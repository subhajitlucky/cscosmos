import { Link, useLocation } from '@/components/visualizers/shared/RouterShim';

const conceptGroups = [
  {
    name: 'Fundamentals',
    concepts: [
      { id: 'what-is-kubernetes', name: 'What is Kubernetes' },
      { id: 'control-plane', name: 'Control Plane Overview' },
      { id: 'cluster-architecture', name: 'Cluster Architecture' },
    ]
  },
  {
    name: 'Pods & Nodes',
    concepts: [
      { id: 'node', name: 'Node' },
      { id: 'pod', name: 'Pod' },
      { id: 'container-vs-pod', name: 'Container vs Pod' },
    ]
  },
  {
    name: 'Scheduling Basics',
    concepts: [
      { id: 'scheduler-overview', name: 'Scheduler Overview' },
      { id: 'scheduling-lifecycle', name: 'Scheduling Lifecycle' },
      { id: 'pending-pods', name: 'Pending Pods' },
      { id: 'node-resources', name: 'Node Resources' },
      { id: 'requests-vs-limits', name: 'Requests vs Limits' },
      { id: 'bin-packing', name: 'Bin Packing' },
      { id: 'node-selection', name: 'Node Selection' },
    ]
  },
  {
    name: 'Scheduling Constraints',
    concepts: [
      { id: 'labels-selectors', name: 'Labels & Selectors' },
      { id: 'node-affinity', name: 'Node Affinity' },
      { id: 'pod-affinity', name: 'Pod Affinity' },
      { id: 'pod-anti-affinity', name: 'Pod Anti-Affinity' },
      { id: 'taints-tolerations', name: 'Taints & Tolerations' },
    ]
  },
  {
    name: 'Advanced',
    concepts: [
      { id: 'daemonsets', name: 'DaemonSets' },
      { id: 'replicasets', name: 'ReplicaSets' },
      { id: 'deployments', name: 'Deployments' },
      { id: 'preemption', name: 'Preemption' },
      { id: 'priority-classes', name: 'Priority Classes' },
      { id: 'eviction', name: 'Eviction' },
    ]
  },
  {
    name: 'Failures & Recovery',
    concepts: [
      { id: 'unschedulable-pods', name: 'Unschedulable Pods' },
      { id: 'why-pods-pending', name: 'Why Pods Stay Pending' },
      { id: 'cluster-autoscaling', name: 'Cluster Autoscaling' },
      { id: 'debugging', name: 'Scheduling Failures & Debugging' },
    ]
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className = '' }: SidebarProps) {
  const location = useLocation();
  const isConceptsPage = location.pathname === '/concepts' || location.pathname.startsWith('/concepts/');

  if (!isConceptsPage) return null;

  return (
    <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-background border-r border-border overflow-y-auto ${className}`}>
      <div className="p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4">Concepts</h2>
        <nav className="space-y-6">
          {conceptGroups.map((group) => (
            <div key={group.name}>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">{group.name}</h3>
              <ul className="space-y-1">
                {group.concepts.map((concept) => (
                  <li key={concept.id}>
                    <Link
                      to={`/concepts/${concept.id}`}
                      className={`block text-sm py-1.5 px-2 rounded-md transition-colors ${
                        location.pathname === `/concepts/${concept.id}`
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {concept.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
