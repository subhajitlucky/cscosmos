import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';

const conceptGroups = [
  {
    name: 'Kubernetes Fundamentals',
    color: 'from-blue-500/10 to-blue-500/5',
    concepts: [
      { id: 'what-is-kubernetes', name: 'What is Kubernetes', desc: 'Understanding the orchestration platform' },
      { id: 'control-plane', name: 'Control Plane Overview', desc: 'Core components that manage the cluster' },
      { id: 'cluster-architecture', name: 'Cluster Architecture', desc: 'How all components work together' },
    ]
  },
  {
    name: 'Pods & Nodes',
    color: 'from-purple-500/10 to-purple-500/5',
    concepts: [
      { id: 'node', name: 'Node', desc: 'Worker machines in the cluster' },
      { id: 'pod', name: 'Pod', desc: 'The smallest deployable unit' },
      { id: 'container-vs-pod', name: 'Container vs Pod', desc: 'Key differences and relationships' },
    ]
  },
  {
    name: 'Scheduling Basics',
    color: 'from-green-500/10 to-green-500/5',
    concepts: [
      { id: 'scheduler-overview', name: 'Scheduler Overview', desc: 'How the scheduler works' },
      { id: 'scheduling-lifecycle', name: 'Scheduling Lifecycle', desc: 'From pod creation to binding' },
      { id: 'pending-pods', name: 'Pending Pods', desc: 'Why pods wait to be scheduled' },
      { id: 'node-resources', name: 'Node Resources', desc: 'CPU and memory management' },
      { id: 'requests-vs-limits', name: 'Requests vs Limits', desc: 'Resource allocation strategies' },
      { id: 'bin-packing', name: 'Bin Packing', desc: 'Efficient resource utilization' },
      { id: 'node-selection', name: 'Node Selection', desc: 'How nodes are chosen for pods' },
    ]
  },
  {
    name: 'Scheduling Constraints',
    color: 'from-orange-500/10 to-orange-500/5',
    concepts: [
      { id: 'labels-selectors', name: 'Labels & Selectors', desc: 'Organizing and selecting objects' },
      { id: 'node-affinity', name: 'Node Affinity', desc: 'Rules for node selection' },
      { id: 'pod-affinity', name: 'Pod Affinity', desc: 'Co-locating related pods' },
      { id: 'pod-anti-affinity', name: 'Pod Anti-Affinity', desc: 'Spreading pods across nodes' },
      { id: 'taints-tolerations', name: 'Taints & Tolerations', desc: 'Controlling pod placement' },
    ]
  },
  {
    name: 'Advanced Scheduling',
    color: 'from-red-500/10 to-red-500/5',
    concepts: [
      { id: 'daemonsets', name: 'DaemonSets', desc: 'Running pods on every node' },
      { id: 'replicasets', name: 'ReplicaSets', desc: 'Maintaining pod replicas' },
      { id: 'deployments', name: 'Deployments', desc: 'Declarative pod management' },
      { id: 'preemption', name: 'Preemption', desc: 'Evicting lower priority pods' },
      { id: 'priority-classes', name: 'Priority Classes', desc: 'Pod importance levels' },
      { id: 'eviction', name: 'Eviction', desc: 'Removing pods from nodes' },
    ]
  },
  {
    name: 'Failures & Recovery',
    color: 'from-cyan-500/10 to-cyan-500/5',
    concepts: [
      { id: 'unschedulable-pods', name: 'Unschedulable Pods', desc: 'When scheduling is impossible' },
      { id: 'why-pods-pending', name: 'Why Pods Stay Pending', desc: 'Common causes and solutions' },
      { id: 'cluster-autoscaling', name: 'Cluster Autoscaling', desc: 'Automatic resource scaling' },
      { id: 'debugging', name: 'Scheduling Failures & Debugging', desc: 'Troubleshooting tips' },
    ]
  },
];

export function ConceptMapPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">Kubernetes Scheduling Concepts</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Explore all the concepts that power Kubernetes scheduling. Click on any concept to dive deep
              into interactive explanations and visualizations.
            </p>
          </motion.div>

          <div className="space-y-12">
            {conceptGroups.map((group, groupIndex) => (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-4 text-foreground">{group.name}</h2>
                  <div className={`bg-gradient-to-br ${group.color} rounded-xl p-6 border border-border`}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.concepts.map((concept) => (
                        <Link
                          key={concept.id}
                          to={`/concepts/${concept.id}`}
                          className="block bg-card hover:bg-card/80 border border-border rounded-lg p-5 transition-all hover:shadow-md hover:border-primary/50"
                        >
                          <h3 className="font-semibold text-foreground mb-2">{concept.name}</h3>
                          <p className="text-sm text-muted-foreground">{concept.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default ConceptMapPage;
