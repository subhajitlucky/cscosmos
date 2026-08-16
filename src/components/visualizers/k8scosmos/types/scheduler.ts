export interface Node {
  id: string;
  name: string;
  cpu: number;
  cpuCapacity: number;
  memory: number;
  memoryCapacity: number;
  labels: Record<string, string>;
  taints: Taint[];
  pods: string[];
  status: 'ready' | 'not-ready';
}

export interface Taint {
  key: string;
  operator?: string;
  value: string;
  effect: 'NoSchedule' | 'PreferNoSchedule' | 'NoExecute';
}

export interface Pod {
  id: string;
  name: string;
  cpuRequest: number;
  memoryRequest: number;
  cpuLimit?: number;
  memoryLimit?: number;
  nodeSelector?: Record<string, string>;
  affinity?: Affinity;
  tolerations?: Taint[];
  priority?: number;
  nodeName?: string;
  status: 'pending' | 'running' | 'failed';
  schedulingReason?: string;
}

export interface Affinity {
  nodeAffinity?: NodeAffinity;
  podAffinity?: PodAffinity;
  podAntiAffinity?: PodAffinity;
}

export interface NodeAffinity {
  requiredDuringSchedulingIgnoredDuringExecution?: {
    nodeSelectorTerms: NodeSelectorTerm[];
  };
  preferredDuringSchedulingIgnoredDuringExecution?: PreferredSchedulingTerm[];
}

export interface NodeSelectorTerm {
  matchExpressions?: NodeSelectorRequirement[];
  matchFields?: NodeSelectorRequirement[];
}

export interface NodeSelectorRequirement {
  key: string;
  operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist' | 'Gt' | 'Lt';
  values?: string[];
}

export interface PreferredSchedulingTerm {
  weight: number;
  preference: NodeSelectorTerm;
}

export interface PodAffinity {
  requiredDuringSchedulingIgnoredDuringExecution?: PodAffinityTerm[];
  preferredDuringSchedulingIgnoredDuringExecution?: WeightedPodAffinityTerm[];
}

export interface PodAffinityTerm {
  labelSelector?: {
    matchLabels?: Record<string, string>;
  };
  topologyKey: string;
  namespaces?: string[];
}

export interface WeightedPodAffinityTerm {
  weight: number;
  podAffinityTerm: PodAffinityTerm;
}

export interface ClusterState {
  nodes: Node[];
  pods: Pod[];
}

export interface SchedulingDecision {
  podId: string;
  nodeId: string | null;
  reason: string;
  filteredNodes: string[];
  nodeScores: Map<string, number>;
}

export interface SchedulerConfig {
  algorithm: 'bin-packing' | 'spread' | 'random';
  enablePreemption: boolean;
}
