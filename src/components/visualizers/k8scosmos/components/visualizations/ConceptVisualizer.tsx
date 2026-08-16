import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Server, Box, Activity, Zap, ArrowRight, ArrowDown, X, Check, Cpu, HardDrive } from 'lucide-react';

interface ConceptVisualizerProps {
  conceptId: string;
}

export function ConceptVisualizer({ conceptId }: ConceptVisualizerProps) {
  const visualizer = getVisualizer(conceptId);
  return <div className="mb-8">{visualizer}</div>;
}

function getVisualizer(conceptId: string): React.ReactElement {
  switch (conceptId) {
    case 'what-is-kubernetes':
      return <KubernetesOverview />;
    case 'control-plane':
      return <ControlPlane />;
    case 'cluster-architecture':
      return <ClusterArchitecture />;
    case 'node':
      return <NodeVisualizer />;
    case 'pod':
      return <PodVisualizer />;
    case 'container-vs-pod':
      return <ContainerVsPod />;
    case 'scheduler-overview':
      return <SchedulerOverview />;
    case 'scheduling-lifecycle':
      return <SchedulingLifecycle />;
    case 'pending-pods':
      return <PendingPods />;
    case 'node-resources':
      return <NodeResources />;
    case 'requests-vs-limits':
      return <RequestsVsLimits />;
    case 'bin-packing':
      return <BinPacking />;
    case 'node-selection':
      return <NodeSelection />;
    case 'labels-selectors':
      return <LabelsSelectors />;
    case 'node-affinity':
      return <NodeAffinity />;
    case 'pod-affinity':
      return <PodAffinity />;
    case 'pod-anti-affinity':
      return <PodAntiAffinity />;
    case 'taints-tolerations':
      return <TaintsTolerations />;
    case 'daemonsets':
      return <DaemonSets />;
    case 'replicasets':
      return <ReplicaSets />;
    case 'deployments':
      return <Deployments />;
    case 'preemption':
      return <Preemption />;
    case 'priority-classes':
      return <PriorityClasses />;
    case 'eviction':
      return <Eviction />;
    case 'unschedulable-pods':
      return <UnschedulablePods />;
    case 'why-pods-pending':
      return <WhyPodsPending />;
    case 'cluster-autoscaling':
      return <ClusterAutoscaling />;
    case 'debugging':
      return <Debugging />;
    default:
      return <div className="text-muted-foreground">Visualization coming soon...</div>;
  }
}

function KubernetesOverview() {
  return (
    <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-8 border border-primary/20 h-64 overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-6xl">🎛️</div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-0 flex items-center justify-center gap-4"
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            className="flex flex-col items-center"
          >
            <Server className="w-16 h-16 text-primary" />
            <Box className="w-8 h-8 text-blue-500 -mt-2" />
          </motion.div>
        ))}
      </motion.div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-muted-foreground">
        Kubernetes orchestrates containers across multiple nodes
      </div>
    </div>
  );
}

function ControlPlane() {
  return (
    <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl p-6 border border-purple-500/20">
      <div className="grid grid-cols-2 gap-4 mb-4">
        {['API Server', 'Scheduler', 'Controller Manager', 'etcd'].map((component, i) => (
          <motion.div
            key={component}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.15 }}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <Activity className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-sm font-medium">{component}</div>
          </motion.div>
        ))}
      </div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-center text-sm text-muted-foreground"
      >
        Control plane manages the entire cluster
      </motion.div>
    </div>
  );
}

function ClusterArchitecture() {
  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl p-6 border border-blue-500/20">
      <div className="flex gap-4 justify-center mb-6">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-purple-500/20 border border-purple-500 rounded-lg p-4 text-center"
        >
          <div className="text-xs text-purple-500 mb-1">Control Plane</div>
          <Activity className="w-12 h-12 text-purple-500 mx-auto" />
        </motion.div>
      </div>
      <div className="flex gap-4 justify-center">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 text-center"
          >
            <div className="text-xs text-blue-500 mb-1">Worker Node</div>
            <Server className="w-12 h-12 text-blue-500 mx-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NodeVisualizer() {
  return (
    <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl p-6 border border-green-500/20">
      <div className="flex items-center gap-4">
        <Server className="w-16 h-16 text-green-500" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <motion.div
              animate={{ width: ['70%', '80%', '70%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-3 bg-green-500/30 rounded-full overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                className="h-full bg-green-500 w-1/3"
              />
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <motion.div
              animate={{ width: ['60%', '70%', '60%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-3 bg-blue-500/30 rounded-full overflow-hidden"
            >
              <motion.div
                animate={{ x: ['-100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', delay: 0.5 }}
                className="h-full bg-blue-500 w-1/3"
              />
            </motion.div>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <Box key={i} className="w-8 h-8 text-green-500" />
          ))}
        </div>
      </div>
    </div>
  );
}

function PodVisualizer() {
  return (
    <div className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 rounded-xl p-6 border border-orange-500/20">
      <div className="flex items-center justify-center gap-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 border-4 border-dashed border-orange-500 rounded-lg flex items-center justify-center"
        >
          <div className="text-4xl">📦</div>
        </motion.div>
        <div className="flex flex-col gap-2">
          <div className="text-sm font-medium text-orange-500">Pod</div>
          <div className="text-xs text-muted-foreground">
            • Shared network
            <br />
            • Shared storage
            <br />
            • Scheduled together
          </div>
        </div>
      </div>
    </div>
  );
}

function ContainerVsPod() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 rounded-xl p-6 border border-cyan-500/20">
        <div className="text-sm font-medium text-cyan-500 mb-4">Single Container Pod</div>
        <div className="bg-cyan-500/20 border border-cyan-500 rounded-lg p-4 text-center">
          <Box className="w-12 h-12 text-cyan-500 mx-auto" />
        </div>
      </div>
      <div className="bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
        <div className="text-sm font-medium text-yellow-500 mb-4">Multi-Container Pod</div>
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 flex gap-2 justify-center">
          <Box className="w-8 h-8 text-yellow-500" />
          <Box className="w-8 h-8 text-yellow-500" />
          <Box className="w-8 h-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
}

function SchedulerOverview() {
  return (
    <div className="bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 rounded-xl p-6 border border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Box className="w-10 h-10 text-yellow-500" />
          <motion.div
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-8 h-8 text-indigo-500" />
          </motion.div>
        </div>
        <Server className="w-10 h-10 text-green-500" />
      </div>
      <div className="text-center text-sm text-muted-foreground">
        Scheduler decides where to place pods
      </div>
    </div>
  );
}

function SchedulingLifecycle() {
  const steps = ['Filtering', 'Scoring', 'Binding'];
  return (
    <div className="bg-gradient-to-br from-pink-500/5 to-pink-500/10 rounded-xl p-6 border border-pink-500/20">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <motion.div
            key={step}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
            className="flex flex-col items-center"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-yellow-500' : 'bg-green-500'
            }`}>
              <span className="text-white font-bold">{i + 1}</span>
            </div>
            <div className="text-xs mt-2">{step}</div>
            {i < steps.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PendingPods() {
  return (
    <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 rounded-xl p-6 border border-amber-500/20">
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="bg-amber-500/20 border border-amber-500 rounded-lg p-4"
        >
          <Box className="w-12 h-12 text-amber-500" />
          <div className="text-xs text-amber-500 mt-2">Pending</div>
        </motion.div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">Waiting for node...</div>
          <motion.div
            animate={{ width: ['0%', '100%', '0%'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-2 bg-amber-500/30 rounded-full mt-2 overflow-hidden"
          >
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-full bg-amber-500"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function NodeResources() {
  return (
    <div className="bg-gradient-to-br from-teal-500/5 to-teal-500/10 rounded-xl p-6 border border-teal-500/20">
      <Server className="w-20 h-20 text-teal-500 mx-auto mb-4" />
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>CPU</span>
            <span>4 / 8 cores</span>
          </div>
          <div className="h-3 bg-teal-500/30 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: ['40%', '50%', '40%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-full bg-teal-500"
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Memory</span>
            <span>12 / 16 Gi</span>
          </div>
          <div className="h-3 bg-blue-500/30 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: ['70%', '75%', '70%'] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="h-full bg-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestsVsLimits() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl p-6 border border-green-500/20">
        <div className="text-sm font-medium text-green-500 mb-4">Requests (Guaranteed)</div>
        <div className="h-24 bg-green-500/20 border-2 border-green-500 rounded-lg flex items-center justify-center">
          <Check className="w-8 h-8 text-green-500" />
        </div>
        <div className="text-xs text-center mt-2 text-muted-foreground">
          Always available
        </div>
      </div>
      <div className="bg-gradient-to-br from-red-500/5 to-red-500/10 rounded-xl p-6 border border-red-500/20">
        <div className="text-sm font-medium text-red-500 mb-4">Limits (Maximum)</div>
        <div className="h-24 bg-red-500/20 border-2 border-red-500 rounded-lg flex items-center justify-center">
          <X className="w-8 h-8 text-red-500" />
        </div>
        <div className="text-xs text-center mt-2 text-muted-foreground">
          Can't exceed
        </div>
      </div>
    </div>
  );
}

function BinPacking() {
  return (
    <div className="bg-gradient-to-br from-violet-500/5 to-violet-500/10 rounded-xl p-6 border border-violet-500/20">
      <div className="flex gap-4">
        <div className="flex-1 bg-violet-500/20 border border-violet-500 rounded-lg p-3">
          <div className="text-xs text-violet-500 mb-2">Node 1 (Full)</div>
          <div className="grid grid-cols-2 gap-1">
            {[...Array(8)].map((_, i) => (
              <Box key={i} className="w-6 h-6 text-violet-500" />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-violet-500/10 border border-dashed border-violet-500/50 rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-2">Node 2 (Empty)</div>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Bin packing consolidates workloads
      </div>
    </div>
  );
}

function NodeSelection() {
  return (
    <div className="bg-gradient-to-br from-rose-500/5 to-rose-500/10 rounded-xl p-6 border border-rose-500/20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center gap-2">
          <Box className="w-10 h-10 text-rose-500" />
          <ArrowDown className="w-6 h-6 text-rose-500" />
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                borderColor: i === 2 ? '#f43f5e' : 'rgba(244, 63, 94, 0.2)',
                scale: i === 2 ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-rose-500/10 border-2 border-rose-500/20 rounded-lg p-4 text-center"
            >
              <Server className="w-10 h-10 text-rose-500/60" />
              {i === 2 && <div className="text-xs text-rose-500 mt-1">✓ Selected</div>}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabelsSelectors() {
  const labels = ['app=web', 'env=prod', 'tier=frontend'];
  return (
    <div className="bg-gradient-to-br from-sky-500/5 to-sky-500/10 rounded-xl p-6 border border-sky-500/20">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="text-sm font-medium text-sky-500 mb-3">Labels</div>
          <div className="space-y-2">
            {labels.map((label, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-sky-500/20 border border-sky-500 rounded px-3 py-2 text-sm"
              >
                {label}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-emerald-500 mb-3">Selector</div>
          <div className="bg-emerald-500/20 border border-emerald-500 rounded-lg p-4 text-center">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Activity className="w-10 h-10 text-emerald-500 mx-auto" />
            </motion.div>
            <div className="text-xs mt-2">app=web</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeAffinity() {
  return (
    <div className="bg-gradient-to-br from-fuchsia-500/5 to-fuchsia-500/10 rounded-xl p-6 border border-fuchsia-500/20">
      <div className="flex items-center gap-4">
        <Box className="w-12 h-12 text-fuchsia-500" />
        <ArrowRight className="w-6 h-6 text-fuchsia-500" />
        <div className="flex gap-2">
          <div className="bg-fuchsia-500/30 border-2 border-fuchsia-500 rounded-lg p-3 text-center">
            <Server className="w-10 h-10 text-fuchsia-500" />
            <div className="text-xs text-fuchsia-500 mt-1">SSD</div>
          </div>
          <div className="bg-fuchsia-500/10 border border-dashed border-fuchsia-500/30 rounded-lg p-3 text-center">
            <Server className="w-10 h-10 text-fuchsia-500/40" />
            <div className="text-xs text-muted-foreground mt-1">HDD</div>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Pod prefers node with SSD disk
      </div>
    </div>
  );
}

function PodAffinity() {
  return (
    <div className="bg-gradient-to-br from-lime-500/5 to-lime-500/10 rounded-xl p-6 border border-lime-500/20">
      <div className="text-sm font-medium text-lime-500 mb-4 text-center">Pod Affinity - Co-location</div>
      <Server className="w-20 h-20 text-lime-500 mx-auto mb-4" />
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
          >
            <Box className="w-10 h-10 text-lime-500" />
          </motion.div>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Pods scheduled on same node
      </div>
    </div>
  );
}

function PodAntiAffinity() {
  return (
    <div className="bg-gradient-to-br from-slate-500/5 to-slate-500/10 rounded-xl p-6 border border-slate-500/20">
      <div className="text-sm font-medium text-slate-500 mb-4 text-center">Pod Anti-Affinity - Spread</div>
      <div className="flex justify-center gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Server className="w-14 h-14 text-slate-500" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
            >
              <Box className="w-10 h-10 text-slate-500" />
            </motion.div>
          </div>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Pods spread across nodes
      </div>
    </div>
  );
}

function TaintsTolerations() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-gradient-to-br from-red-500/5 to-red-500/10 rounded-xl p-6 border border-red-500/20">
        <div className="text-sm font-medium text-red-500 mb-3 text-center">Node with Taint</div>
        <Server className="w-16 h-16 text-red-500 mx-auto mb-2" />
        <div className="bg-red-500/20 border border-red-500 rounded px-2 py-1 text-center text-xs">
          key=value:NoSchedule
        </div>
        <X className="w-6 h-6 text-red-500 mx-auto mt-2" />
      </div>
      <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl p-6 border border-green-500/20">
        <div className="text-sm font-medium text-green-500 mb-3 text-center">Pod with Toleration</div>
        <Box className="w-16 h-16 text-green-500 mx-auto mb-2" />
        <div className="bg-green-500/20 border border-green-500 rounded px-2 py-1 text-center text-xs">
          key=value:NoSchedule
        </div>
        <Check className="w-6 h-6 text-green-500 mx-auto mt-2" />
      </div>
    </div>
  );
}

function DaemonSets() {
  return (
    <div className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 rounded-xl p-6 border border-orange-500/20">
      <div className="text-sm font-medium text-orange-500 mb-4 text-center">DaemonSet - One Pod per Node</div>
      <div className="flex justify-center gap-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <Server className="w-12 h-12 text-orange-500" />
            <Box className="w-8 h-8 text-orange-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ReplicaSets() {
  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl p-6 border border-blue-500/20">
      <div className="text-sm font-medium text-blue-500 mb-4 text-center">ReplicaSet - Maintains 3 Replicas</div>
      <div className="flex justify-center gap-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          >
            <Box className="w-12 h-12 text-blue-500" />
          </motion.div>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Auto-replaces failed pods
      </div>
    </div>
  );
}

function Deployments() {
  const [version, setVersion] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => setVersion(v => (v + 1) % 2), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 rounded-xl p-6 border border-cyan-500/20">
      <div className="text-sm font-medium text-cyan-500 mb-4 text-center">Deployment - Rolling Update</div>
      <div className="flex justify-center gap-4">
        {['v1.0', 'v2.0'].map((v, i) => (
          <motion.div
            key={v}
            animate={{
              opacity: i === version ? 1 : 0.5,
              scale: i === version ? 1.1 : 0.9
            }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-2"
          >
            <Box className={`w-12 h-12 ${i === version ? 'text-cyan-500' : 'text-cyan-500/40'}`} />
            <div className={`text-xs ${i === version ? 'text-cyan-500' : 'text-muted-foreground'}`}>
              {v}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Gradual pod replacement
      </div>
    </div>
  );
}

function Preemption() {
  return (
    <div className="bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
      <Server className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
      <div className="flex items-center justify-center gap-4">
        <motion.div
          animate={{ x: [0, 50], opacity: [1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <Box className="w-10 h-10 text-red-500" />
          <div className="text-xs text-red-500">Low Priority</div>
        </motion.div>
        <motion.div
          animate={{ x: [-50, 0], opacity: [0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <Box className="w-10 h-10 text-green-500" />
          <div className="text-xs text-green-500">High Priority</div>
        </motion.div>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        High priority pod preempts low priority
      </div>
    </div>
  );
}

function PriorityClasses() {
  return (
    <div className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl p-6 border border-purple-500/20">
      <div className="flex justify-center gap-8 items-end h-32">
        {['Low', 'Medium', 'High'].map((priority, i) => (
          <motion.div
            key={priority}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="flex flex-col items-center"
          >
            <div
              className={`bg-purple-500/${20 + i * 20} border border-purple-500 rounded-t-lg`}
              style={{ height: `${40 + i * 25}px`, width: '40px' }}
            />
            <div className="text-xs mt-2">{priority}</div>
          </motion.div>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Priority affects scheduling order
      </div>
    </div>
  );
}

function Eviction() {
  return (
    <div className="bg-gradient-to-br from-red-500/5 to-red-500/10 rounded-xl p-6 border border-red-500/20">
      <Server className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <motion.div
        animate={{ y: [0, 20, 40], opacity: [1, 0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex justify-center"
      >
        <Box className="w-12 h-12 text-red-500" />
      </motion.div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Pod evicted due to resource pressure
      </div>
    </div>
  );
}

function UnschedulablePods() {
  return (
    <div className="bg-gradient-to-br from-gray-500/5 to-gray-500/10 rounded-xl p-6 border border-gray-500/20">
      <Box className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <div className="flex justify-center gap-2">
        {['No CPU', 'No Memory', 'Taints'].map((reason, i) => (
          <motion.div
            key={reason}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            className="bg-gray-500/20 border border-gray-500 rounded px-2 py-1 text-xs"
          >
            {reason}
          </motion.div>
        ))}
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Cannot find suitable node
      </div>
    </div>
  );
}

function WhyPodsPending() {
  return (
    <div className="space-y-4">
      {['Insufficient Resources', 'Taints Not Tolerated', 'Affinity Constraints'].map((reason, i) => (
        <motion.div
          key={reason}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
          className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3"
        >
          <X className="w-5 h-5 text-amber-500" />
          <span className="text-sm">{reason}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ClusterAutoscaling() {
  const [nodes, setNodes] = useState(2);
  
  useEffect(() => {
    const interval = setInterval(() => setNodes(n => n === 2 ? 3 : 2), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 rounded-xl p-6 border border-emerald-500/20">
      <div className="text-sm font-medium text-emerald-500 mb-4 text-center">Cluster Autoscaling</div>
      <AnimatePresence mode="popLayout">
        {Array.from({ length: nodes }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: i * 0.2 }}
            className="inline-block mx-1"
          >
            <Server className="w-12 h-12 text-emerald-500" />
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="text-center text-xs text-muted-foreground mt-4">
        Nodes auto-scale based on demand
      </div>
    </div>
  );
}

function Debugging() {
  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl p-6 border border-blue-500/20">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">1</div>
          <span className="text-sm">Check pod status</span>
          <ArrowRight className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">2</div>
          <span className="text-sm">View events</span>
          <ArrowRight className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">3</div>
          <span className="text-sm">Check node resources</span>
          <ArrowRight className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
          <span className="text-sm">Found issue!</span>
        </div>
      </div>
    </div>
  );
}