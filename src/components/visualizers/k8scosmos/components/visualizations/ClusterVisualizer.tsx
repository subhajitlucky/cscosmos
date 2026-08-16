import { motion } from 'framer-motion';
import type { Node as NodeType, Pod } from '../../types/scheduler';
import { Cpu, HardDrive, Box, Server, Activity } from 'lucide-react';

interface ClusterVisualizerProps {
  nodes: NodeType[];
  pods: Pod[];
  onNodeClick?: (node: NodeType) => void;
  selectedNodeId?: string;
}

export function ClusterVisualizer({ nodes, pods, onNodeClick, selectedNodeId }: ClusterVisualizerProps) {
  const getPodsForNode = (nodeId: string) => {
    return pods.filter(p => p.nodeName === nodeId);
  };

  const getCpuPercentage = (node: NodeType) => {
    return (node.cpu / node.cpuCapacity) * 100;
  };

  const getMemoryPercentage = (node: NodeType) => {
    return (node.memory / node.memoryCapacity) * 100;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background to-muted/20 p-8">
      <div className="absolute top-4 left-4 flex items-center space-x-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span>Control Plane</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Server className="w-4 h-4" />
          <span>{nodes.length} Nodes</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Box className="w-4 h-4" />
          <span>{pods.filter(p => p.status === 'running').length} Running Pods</span>
        </div>
      </div>

      <div className="flex items-start justify-center space-x-8 mt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 border-2 border-primary/30">
            <Activity className="w-10 h-10 text-primary-foreground" />
          </div>
          <span className="mt-2 text-sm font-medium text-muted-foreground">Control Plane</span>
        </motion.div>

        <div className="w-32 border-l-2 border-dashed border-border h-40 mt-8"></div>

        <div className="flex flex-wrap justify-center gap-6 max-w-3xl">
          {nodes.map((node, index) => {
            const nodePods = getPodsForNode(node.id);
            const cpuPercent = getCpuPercentage(node);
            const memoryPercent = getMemoryPercentage(node);

            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative cursor-pointer transition-all ${
                  selectedNodeId === node.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => onNodeClick?.(node)}
              >
                <div className="bg-card border border-border rounded-lg p-4 shadow-lg min-w-[280px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Server className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{node.name}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${node.status === 'ready' ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>CPU</span>
                          <span>{node.cpu} / {node.cpuCapacity}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cpuPercent}%` }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm">
                      <HardDrive className="w-4 h-4 text-purple-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Memory</span>
                          <span>{node.memory} / {node.memoryCapacity}</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${memoryPercent}%` }}
                            className="h-full bg-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex flex-wrap gap-2">
                      {nodePods.map((pod) => (
                        <motion.div
                          key={pod.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-8 h-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center"
                          title={pod.name}
                        >
                          <Box className="w-4 h-4 text-primary" />
                        </motion.div>
                      ))}
                      {Array.from({ length: 6 - nodePods.length }).map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded bg-muted border border-border opacity-30"
                        />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {nodePods.length} pod{nodePods.length !== 1 ? 's' : ''} running
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
