import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ClusterVisualizer } from '../components/visualizations/ClusterVisualizer';
import { SchedulerFlow } from '../components/visualizations/SchedulerFlow';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useStore } from '../stores/store';
import type { Node, Pod } from '../types/scheduler';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Play, RotateCcw, Server, Box, Cpu, HardDrive, PlusCircle } from 'lucide-react';

export function LabPage() {
  const {
    nodes,
    pods,
    selectedNode,
    selectedPod,
    setNodes,
    setPods,
    addNode,
    addPod,
    removeNode,
    removePod,
    selectNode,
    selectPod,
    schedulePod,
    resetCluster,
    schedulingDecisions
  } = useStore();

  const [schedulingStep, setSchedulingStep] = useState<'idle' | 'filtering' | 'scoring' | 'binding' | 'complete' | 'failed'>('idle');
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [showPodForm, setShowPodForm] = useState(false);

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newNode: Node = {
      id: `node-${Date.now()}`,
      name: formData.get('name') as string || `node-${nodes.length + 1}`,
      cpu: 0,
      cpuCapacity: Number(formData.get('cpu')) || 2,
      memory: 0,
      memoryCapacity: Number(formData.get('memory')) || 4096,
      labels: { zone: 'default' },
      taints: [],
      pods: [],
      status: 'ready'
    };
    addNode(newNode);
    setShowNodeForm(false);
  };

  const handleAddPod = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newPod: Pod = {
      id: `pod-${Date.now()}`,
      name: formData.get('name') as string || `pod-${pods.length + 1}`,
      cpuRequest: Number(formData.get('cpu')) || 500,
      memoryRequest: Number(formData.get('memory')) || 512,
      cpuLimit: Number(formData.get('cpuLimit')) || undefined,
      memoryLimit: Number(formData.get('memoryLimit')) || undefined,
      status: 'pending',
      nodeSelector: formData.get('nodeSelector') ? JSON.parse(formData.get('nodeSelector') as string) : undefined,
      tolerations: [],
      priority: Number(formData.get('priority')) || 0
    };
    addPod(newPod);
    setShowPodForm(false);
  };

  const handleSchedulePod = async (podId: string) => {
    setSchedulingStep('filtering');
    await new Promise(r => setTimeout(r, 800));
    setSchedulingStep('scoring');
    await new Promise(r => setTimeout(r, 800));
    setSchedulingStep('binding');
    await new Promise(r => setTimeout(r, 500));
    schedulePod(podId);

    const pod = pods.find(p => p.id === podId);
    if (pod?.status === 'running') {
      setSchedulingStep('complete');
    } else {
      setSchedulingStep('failed');
    }
    setTimeout(() => setSchedulingStep('idle'), 2000);
  };

  const handleScheduleAll = async () => {
    const pendingPods = pods.filter(p => p.status === 'pending');
    for (const pod of pendingPods) {
      await handleSchedulePod(pod.id);
      await new Promise(r => setTimeout(r, 500));
    }
  };

  const initializeCluster = () => {
    const initialNodes: Node[] = [
      { id: 'node-1', name: 'worker-1', cpu: 0, cpuCapacity: 2000, memory: 0, memoryCapacity: 4096, labels: { zone: 'us-west-1' }, taints: [], pods: [], status: 'ready' },
      { id: 'node-2', name: 'worker-2', cpu: 0, cpuCapacity: 2000, memory: 0, memoryCapacity: 4096, labels: { zone: 'us-west-2' }, taints: [], pods: [], status: 'ready' },
      { id: 'node-3', name: 'worker-3', cpu: 0, cpuCapacity: 1000, memory: 0, memoryCapacity: 2048, labels: { zone: 'us-east-1' }, taints: [], pods: [], status: 'ready' },
    ];
    const initialPods: Pod[] = [
      { id: 'pod-1', name: 'web-frontend', cpuRequest: 250, memoryRequest: 256, status: 'pending' },
      { id: 'pod-2', name: 'api-backend', cpuRequest: 500, memoryRequest: 512, status: 'pending' },
      { id: 'pod-3', name: 'database', cpuRequest: 750, memoryRequest: 1024, status: 'pending' },
    ];
    setNodes(initialNodes);
    setPods(initialPods);
  };

  const reset = () => {
    resetCluster();
    setSchedulingStep('idle');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-[calc(100vh-10rem)]">
            <div className="flex-1 flex flex-col min-w-0">
              <div className="border border-border bg-card rounded-lg p-4 mb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">Scheduler Lab</h1>
                    <p className="text-sm text-muted-foreground">Interactive Kubernetes scheduling simulator</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button variant="outline" size="sm" onClick={initializeCluster}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Initialize
                    </Button>
                    <Button variant="outline" size="sm" onClick={reset}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                    <Button variant="default" size="sm" onClick={handleScheduleAll} disabled={pods.filter(p => p.status === 'pending').length === 0}>
                      <Play className="w-4 h-4 mr-2" />
                      Schedule All
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 relative overflow-hidden border border-border rounded-lg bg-muted/20 p-4 lg:p-6">
                <ClusterVisualizer
                  nodes={nodes}
                  pods={pods}
                  onNodeClick={selectNode}
                  selectedNodeId={selectedNode?.id}
                />
              </div>
              </div>
              
              <aside className="w-full lg:w-[420px] shrink-0 border border-border bg-card rounded-lg flex flex-col h-full overflow-hidden">
              <div className="p-5 border-b border-border">
                <SchedulerFlow currentStep={schedulingStep} nodeName={selectedPod?.nodeName} />
              </div>
              
              <div className="flex-1 overflow-y-auto scroll-smooth">
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center">
                      <Server className="w-4 h-4 mr-2" />
                      Nodes ({nodes.length})
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowNodeForm(!showNodeForm)}>
                      <PlusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showNodeForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        <Card>
                          <CardContent className="p-4">
                            <form onSubmit={handleAddNode} className="space-y-4">
                              <input
                                name="name"
                                placeholder="Node name"
                                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  name="cpu"
                                  type="number"
                                  placeholder="CPU (m)"
                                  defaultValue="2000"
                                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                <input
                                  name="memory"
                                  type="number"
                                  placeholder="Memory (Mi)"
                                  defaultValue="4096"
                                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                              </div>
                              <Button type="submit" size="sm" className="w-full">Add Node</Button>
                            </form>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="space-y-3 mb-8">
                    {nodes.map((node) => (
                      <motion.div
                        key={node.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedNode?.id === node.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => selectNode(node)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{node.name}</span>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${node.status === 'ready' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e: React.MouseEvent) => { e.stopPropagation(); removeNode(node.id); }}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Cpu className="w-3 h-3" />
                            <span>{node.cpu} / {node.cpuCapacity}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <HardDrive className="w-3 h-3" />
                            <span>{node.memory} / {node.memoryCapacity}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center">
                      <Box className="w-4 h-4 mr-2" />
                      Pods ({pods.length})
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowPodForm(!showPodForm)}>
                      <PlusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {showPodForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4"
                      >
                        <Card>
                          <CardContent className="p-4">
                            <form onSubmit={handleAddPod} className="space-y-4">
                              <input
                                name="name"
                                placeholder="Pod name"
                                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  name="cpu"
                                  type="number"
                                  placeholder="CPU Request"
                                  defaultValue="250"
                                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                <input
                                  name="memory"
                                  type="number"
                                  placeholder="Memory (Mi)"
                                  defaultValue="256"
                                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                              </div>
                              <input
                                name="priority"
                                type="number"
                                placeholder="Priority (default 0)"
                                defaultValue="0"
                                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                              <Button type="submit" size="sm" className="w-full">Add Pod</Button>
                            </form>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div className="space-y-3">
                    {pods.map((pod) => {
                      const decision = schedulingDecisions.get(pod.id);
                      return (
                        <motion.div
                          key={pod.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-lg border transition-colors ${
                            selectedPod?.id === pod.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => selectPod(pod)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{pod.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant={pod.status === 'running' ? 'default' : 'secondary'} className="text-xs">
                                {pod.status}
                              </Badge>
                              {pod.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2"
                                  onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleSchedulePod(pod.id); }}
                                >
                                  <Play className="w-3 h-3" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e: React.MouseEvent) => { e.stopPropagation(); removePod(pod.id); }}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground mb-1">
                            CPU: {pod.cpuRequest}m, Memory: {pod.memoryRequest}Mi
                          </div>
                          {pod.nodeName && (
                            <div className="text-xs text-primary">
                              Running on {pod.nodeName}
                            </div>
                          )}
                          {pod.schedulingReason && pod.status === 'pending' && (
                            <div className="text-xs text-red-500 mt-1">
                              {pod.schedulingReason}
                            </div>
                          )}
                          {decision && (
                            <div className="mt-2 pt-2 border-t border-border">
                              <div className="text-xs text-muted-foreground">Score breakdown:</div>
                              <div className="text-xs">
                                {Array.from(decision.nodeScores.entries()).map((entry) => {
                                  const [nodeId, score] = entry as [string, number];
                                  return (
                                    <div key={nodeId} className="flex justify-between">
                                      <span>{nodes.find(n => n.id === nodeId)?.name}</span>
                                      <span>{score.toFixed(1)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {selectedNode && (
              <div className="p-5 border-t border-border bg-muted/30">
                <h3 className="font-semibold mb-3">{selectedNode.name} Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">CPU:</span>
                    <span className="ml-2">{selectedNode.cpu} / {selectedNode.cpuCapacity}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Memory:</span>
                    <span className="ml-2">{selectedNode.memory} / {selectedNode.memoryCapacity}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Pods:</span>
                    <span className="ml-2">{selectedNode.pods.length}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Labels:</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(selectedNode.labels).map(([k, v]) => (
                        <Badge key={k} variant="default" className="text-xs">
                          {k}={v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default LabPage;
