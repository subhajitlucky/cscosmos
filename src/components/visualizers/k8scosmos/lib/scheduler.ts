import type {
  Node,
  Pod,
  SchedulingDecision,
  SchedulerConfig,
  NodeSelectorTerm,
  NodeSelectorRequirement
} from '../types/scheduler';

export class SchedulerEngine {
  private nodes: Map<string, Node>;
  private pods: Map<string, Pod>;
  private config: SchedulerConfig;

  constructor(config: SchedulerConfig = {
    algorithm: 'bin-packing',
    enablePreemption: true
  }) {
    this.nodes = new Map();
    this.pods = new Map();
    this.config = config;
  }

  setNodes(nodes: Node[]) {
    this.nodes = new Map(nodes.map(n => [n.id, n]));
  }

  setPods(pods: Pod[]) {
    this.pods = new Map(pods.map(p => [p.id, p]));
  }

  updatePod(pod: Pod) {
    this.pods.set(pod.id, pod);
  }

  schedule(podId: string): SchedulingDecision {
    const pod = this.pods.get(podId);
    if (!pod) {
      return {
        podId,
        nodeId: null,
        reason: 'Pod not found',
        filteredNodes: [],
        nodeScores: new Map()
      };
    }

    if (pod.status === 'running') {
      return {
        podId,
        nodeId: pod.nodeName || null,
        reason: 'Pod is already running',
        filteredNodes: [],
        nodeScores: new Map()
      };
    }

    const readyNodes = Array.from(this.nodes.values()).filter(
      n => n.status === 'ready'
    );

    const { filteredNodes, filteredOutReasons } = this.filterNodes(pod, readyNodes);

    if (filteredNodes.length === 0) {
      pod.status = 'pending';
      pod.schedulingReason = filteredOutReasons[0] || 'No suitable nodes available';
      this.updatePod(pod);

      return {
        podId,
        nodeId: null,
        reason: pod.schedulingReason,
        filteredNodes: [],
        nodeScores: new Map()
      };
    }

    const scoredNodes = this.scoreNodes(pod, filteredNodes);
    const sortedNodes = scoredNodes.sort((a, b) => b.score - a.score);

    const selectedNode = sortedNodes[0];
    pod.nodeName = selectedNode.node.id;
    pod.status = 'running';
    pod.schedulingReason = `Scheduled on ${selectedNode.node.name}`;

    const node = this.nodes.get(selectedNode.node.id);
    if (node) {
      node.pods.push(pod.id);
      node.cpu += pod.cpuRequest;
      node.memory += pod.memoryRequest;
      this.nodes.set(node.id, node);
    }
    this.updatePod(pod);

    return {
      podId,
      nodeId: selectedNode.node.id,
      reason: pod.schedulingReason,
      filteredNodes: readyNodes.map(n => n.id),
      nodeScores: new Map(scoredNodes.map(s => [s.node.id, s.score]))
    };
  }

  private filterNodes(pod: Pod, nodes: Node[]): {
    filteredNodes: Node[];
    filteredOutReasons: string[];
  } {
    const reasons: string[] = [];
    const filtered: Node[] = [];

    for (const node of nodes) {
      const reasonsForNode: string[] = [];

      if (!this.checkResources(pod, node)) {
        reasonsForNode.push('Insufficient resources');
      }

      if (!this.checkNodeSelector(pod, node)) {
        reasonsForNode.push('Node selector mismatch');
      }

      if (!this.checkTaints(pod, node)) {
        reasonsForNode.push('Taints not tolerated');
      }

      if (!this.checkNodeAffinity(pod, node)) {
        reasonsForNode.push('Node affinity not satisfied');
      }

      if (reasonsForNode.length === 0) {
        filtered.push(node);
      } else {
        reasons.push(`${node.name}: ${reasonsForNode.join(', ')}`);
      }
    }

    return { filteredNodes: filtered, filteredOutReasons: reasons };
  }

  private checkResources(pod: Pod, node: Node): boolean {
    const availableCpu = node.cpuCapacity - node.cpu;
    const availableMemory = node.memoryCapacity - node.memory;

    return (
      pod.cpuRequest <= availableCpu &&
      pod.memoryRequest <= availableMemory
    );
  }

  private checkNodeSelector(pod: Pod, node: Node): boolean {
    if (!pod.nodeSelector || Object.keys(pod.nodeSelector).length === 0) {
      return true;
    }

    for (const [key, value] of Object.entries(pod.nodeSelector)) {
      if (node.labels[key] !== value) {
        return false;
      }
    }

    return true;
  }

  private checkTaints(pod: Pod, node: Node): boolean {
    if (!node.taints || node.taints.length === 0) {
      return true;
    }

    for (const taint of node.taints) {
      const tolerated = pod.tolerations?.some(
        t => t.key === taint.key && t.operator === 'Exists'
      );

      if (!tolerated) {
        if (taint.effect === 'NoSchedule') {
          return false;
        }
      }
    }

    return true;
  }

  private checkNodeAffinity(pod: Pod, node: Node): boolean {
    if (!pod.affinity?.nodeAffinity?.requiredDuringSchedulingIgnoredDuringExecution) {
      return true;
    }

    const required = pod.affinity.nodeAffinity.requiredDuringSchedulingIgnoredDuringExecution;

    for (const term of required.nodeSelectorTerms) {
      if (this.matchesNodeSelectorTerm(term, node)) {
        return true;
      }
    }

    return false;
  }

  private matchesNodeSelectorTerm(term: NodeSelectorTerm, node: Node): boolean {
    if (term.matchExpressions) {
      for (const expr of term.matchExpressions) {
        if (!this.matchesExpression(expr, node.labels)) {
          return false;
        }
      }
    }

    if (term.matchFields) {
      for (const expr of term.matchFields) {
        if (!this.matchesExpression(expr, { name: node.name })) {
          return false;
        }
      }
    }

    return true;
  }

  private matchesExpression(expr: NodeSelectorRequirement, labels: Record<string, string>): boolean {
    const nodeValue = labels[expr.key];

    switch (expr.operator) {
      case 'In':
        return nodeValue !== undefined && (expr.values !== undefined) && expr.values.includes(nodeValue);
      case 'NotIn':
        return expr.values === undefined || !expr.values.includes(nodeValue);
      case 'Exists':
        return expr.key in labels;
      case 'DoesNotExist':
        return !(expr.key in labels);
      case 'Gt':
        return Number(nodeValue) > Number(expr.values?.[0]);
      case 'Lt':
        return Number(nodeValue) < Number(expr.values?.[0]);
      default:
        return false;
    }
  }

  private scoreNodes(pod: Pod, nodes: Node[]): { node: Node; score: number }[] {
    return nodes.map(node => ({
      node,
      score: this.calculateScore(pod, node)
    }));
  }

  private calculateScore(pod: Pod, node: Node): number {
    let score = 0;

    const usedCpuFraction = node.cpu / node.cpuCapacity;
    const usedMemoryFraction = node.memory / node.memoryCapacity;

    switch (this.config.algorithm) {
      case 'bin-packing':
        score -= (usedCpuFraction + usedMemoryFraction) * 50;
        break;
      case 'spread':
        score += (usedCpuFraction + usedMemoryFraction) * 50;
        break;
      case 'random':
        score = Math.random() * 100;
        break;
    }

    const availableCpu = node.cpuCapacity - node.cpu;
    const availableMemory = node.memoryCapacity - node.memory;

    if (availableCpu >= pod.cpuRequest * 2 && availableMemory >= pod.memoryRequest * 2) {
      score -= 10;
    }

    if (node.pods.length < 5) {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score + 50));
  }

  reset() {
    this.nodes.clear();
    this.pods.clear();
  }

  getNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  getPods(): Pod[] {
    return Array.from(this.pods.values());
  }
}
