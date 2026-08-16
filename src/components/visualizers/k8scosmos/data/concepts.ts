export interface Concept {
  id: string;
  title: string;
  shortDefinition: string;
  mentalModel: string;
  yamlExample: string;
  commonMisconceptions: string[];
}

export const conceptOrder: string[] = [
  'what-is-kubernetes',
  'control-plane',
  'cluster-architecture',
  'node',
  'pod',
  'container-vs-pod',
  'scheduler-overview',
  'scheduling-lifecycle',
  'pending-pods',
  'node-resources',
  'requests-vs-limits',
  'bin-packing',
  'node-selection',
  'labels-selectors',
  'node-affinity',
  'pod-affinity',
  'pod-anti-affinity',
  'taints-tolerations',
  'daemonsets',
  'replicasets',
  'deployments',
  'preemption',
  'priority-classes',
  'eviction',
  'unschedulable-pods',
  'why-pods-pending',
  'cluster-autoscaling',
  'debugging'
];

export const concepts: Record<string, Concept> = {
  'what-is-kubernetes': {
    id: 'what-is-kubernetes',
    title: 'What is Kubernetes',
    shortDefinition: 'Kubernetes is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.',
    mentalModel: 'Think of Kubernetes as a conductor for an orchestra. The conductor (Kubernetes) doesn\'t play any instrument (run containers) but ensures every musician (pod) plays at the right time, in the right place, at the right tempo. Kubernetes manages where your containers run, how they communicate, and ensures they stay healthy.',
    yamlExample: `apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:latest`,
    commonMisconceptions: [
      'Kubernetes runs containers directly - FALSE: Pods run containers',
      'Kubernetes replaces Docker - FALSE: It orchestrates container runtimes',
      'You must use Kubernetes for all workloads - FALSE: It depends on your needs'
    ]
  },

  'control-plane': {
    id: 'control-plane',
    title: 'Control Plane Overview',
    shortDefinition: 'The control plane is the brain of Kubernetes that makes global decisions about cluster state and responds to cluster events.',
    mentalModel: 'The control plane is like a corporate headquarters making strategic decisions. It doesn\'t do the actual work (that\'s for nodes/employees), but it decides what work needs to be done, who should do it, and monitors progress.',
    yamlExample: `# Control plane components run as static pods
# No direct YAML configuration needed`,
    commonMisconceptions: [
      'Control plane runs workloads - FALSE: Worker nodes run workloads',
      'You must configure each component manually - FALSE: Managed services handle this',
      'All control plane components must be on the same machine - FALSE: Can be distributed'
    ]
  },

  'cluster-architecture': {
    id: 'cluster-architecture',
    title: 'Cluster Architecture',
    shortDefinition: 'A Kubernetes cluster consists of a control plane and worker nodes that communicate to manage and run containerized applications.',
    mentalModel: 'A cluster is a factory. The control plane is the management office that plans production. Worker nodes are production lines where actual work happens. The API server is the front desk where all requests go.',
    yamlExample: `# Architecture is defined at cluster level
# Example: creating a node
apiVersion: v1
kind: Node
metadata:
  name: worker-node-1
spec:
  capacity:
    cpu: "4"
    memory: 16Gi`,
    commonMisconceptions: [
      'Clusters are single machines - FALSE: They\'re collections of machines',
      'All nodes are identical - FALSE: Nodes can have different resources',
      'Architecture is fixed - FALSE: Can add/remove nodes dynamically'
    ]
  },

  'node': {
    id: 'node',
    title: 'Node',
    shortDefinition: 'A node is a worker machine in Kubernetes that runs containerized applications as pods.',
    mentalModel: 'A node is like a computer in a computer lab. It has its own CPU, memory, storage, and can run multiple programs (pods) simultaneously. Kubernetes treats all nodes as interchangeable resources.',
    yamlExample: `apiVersion: v1
kind: Node
metadata:
  name: node-1
  labels:
    role: worker
    zone: us-west-1
spec:
  capacity:
    cpu: "4"
    memory: 8Gi`,
    commonMisconceptions: [
      'Nodes are physical machines only - FALSE: Can be VMs or physical',
      'All nodes must run the same OS - FALSE: Can be heterogeneous',
      'Pods are tied to specific nodes - FALSE: Pods can be rescheduled'
    ]
  },

  'pod': {
    id: 'pod',
    title: 'Pod',
    shortDefinition: 'A pod is the smallest deployable unit in Kubernetes, representing a single instance of a running process in the cluster.',
    mentalModel: 'A pod is like a "wrapper" that can hold one or more containers that need to work together. Think of it as a shared workspace - all containers in a pod share the same network and storage resources.',
    yamlExample: `apiVersion: v1
kind: Pod
metadata:
  name: web-pod
spec:
  containers:
  - name: web
    image: nginx
  - name: logger
    image: log-collector
    volumeMounts:
    - mountPath: /var/log
      name: shared-logs
  volumes:
  - name: shared-logs
    emptyDir: {}`,
    commonMisconceptions: [
      'Pods are containers - FALSE: Pods contain containers',
      'Pods are persistent - FALSE: Pods are ephemeral',
      'Every container needs its own pod - FALSE: Related containers can share a pod'
    ]
  },

  'container-vs-pod': {
    id: 'container-vs-pod',
    title: 'Container vs Pod',
    shortDefinition: 'Containers are isolated processes, while pods are groups of containers that share resources and are scheduled together.',
    mentalModel: 'If containers are individual workers, a pod is a work team. Team members share tools (network, storage) and work in the same location (node). You can have a team of one (single-container pod) or many (multi-container pod).',
    yamlExample: `# Single container pod
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    image: myapp

# Multi-container pod
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    image: myapp
  - name: sidecar
    image: sidecar-proxy`,
    commonMisconceptions: [
      'Pod and container are the same thing - FALSE: Pods wrap containers',
      'Each container gets its own IP - FALSE: Pod IP is shared',
      'Containers in a pod are scheduled separately - FALSE: They\'re scheduled together'
    ]
  },

  'scheduler-overview': {
    id: 'scheduler-overview',
    title: 'Scheduler Overview',
    shortDefinition: 'The Kubernetes scheduler is a control plane component that decides which node should run each unscheduled pod.',
    mentalModel: 'The scheduler is like an air traffic controller deciding which runway each plane should land on. It doesn\'t land the planes itself but tells each plane which runway to use based on availability, size, and priority.',
    yamlExample: `# Scheduler configuration
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
- schedulerName: default-scheduler
  plugins:
    queueSort:
      enabled:
      - name: PrioritySort`,
    commonMisconceptions: [
      'Scheduler runs pods - FALSE: Scheduler assigns nodes, kubelet runs pods',
      'Scheduler is a pod - FALSE: It\'s a control plane process',
      'Scheduling decisions are final - FALSE: Pods can be rescheduled'
    ]
  },

  'scheduling-lifecycle': {
    id: 'scheduling-lifecycle',
    title: 'Scheduling Lifecycle',
    shortDefinition: 'The scheduling lifecycle involves filtering nodes, scoring candidates, and binding the pod to the best node.',
    mentalModel: 'Like hiring for a job: First filter candidates who meet minimum requirements (filtering), then rank them by skills and fit (scoring), finally make the job offer to the best candidate (binding).',
    yamlExample: `# No direct YAML for lifecycle
# Observe: kubectl describe pod <pod-name>`,
    commonMisconceptions: [
      'Scheduling is instant - FALSE: It takes time through multiple phases',
      'All nodes are evaluated equally - FALSE: Filtering happens first',
      'Once scheduled, pod stays forever - FALSE: Can be evicted/rescheduled'
    ]
  },

  'pending-pods': {
    id: 'pending-pods',
    title: 'Pending Pods',
    shortDefinition: 'A pod is pending when it has been created but not yet scheduled to run on a node.',
    mentalModel: 'A pending pod is like a customer waiting for a table. They\'ve arrived (pod created) and are waiting to be seated (scheduled). If the restaurant is full or has restrictions (insufficient resources, constraints), they keep waiting.',
    yamlExample: `apiVersion: v1
kind: Pod
metadata:
  name: pending-pod
spec:
  containers:
  - name: app
    image: myapp
    resources:
      requests:
        memory: 16Gi  # May cause pending if no node has 16Gi available`,
    commonMisconceptions: [
      'Pending means failed - FALSE: It means waiting to be scheduled',
      'Pending pods are deleted automatically - FALSE: They wait until scheduled',
      'All pending pods will eventually run - FALSE: Some may never schedule'
    ]
  },

  'node-resources': {
    id: 'node-resources',
    title: 'Node Resources',
    shortDefinition: 'Nodes have CPU, memory, and storage resources that are allocated to pods based on their requests.',
    mentalModel: 'Node resources are like a hotel\'s rooms and amenities. Each guest (pod) requests certain rooms and amenities. The hotel manager (scheduler) tries to accommodate all guests while respecting their requests.',
    yamlExample: `apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    image: myapp
    resources:
      requests:
        cpu: "500m"
        memory: "512Mi"
      limits:
        cpu: "1000m"
        memory: "1Gi"`,
    commonMisconceptions: [
      'Limits are guaranteed - FALSE: Limits are maximums, requests are guarantees',
      'CPU is measured in cores - TRUE: But also supports millicores (500m = 0.5 cores)',
      'Resources are shared equally - FALSE: Based on pod requests'
    ]
  },

  'requests-vs-limits': {
    id: 'requests-vs-limits',
    title: 'Requests vs Limits',
    shortDefinition: 'Requests are guaranteed resources, while limits are the maximum resources a container can use.',
    mentalModel: 'Requests are like reserving a table at a restaurant - they guarantee you\'ll have a spot. Limits are like a spending cap - you can\'t exceed it. If you don\'t specify a limit, you could consume all available resources.',
    yamlExample: `apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    image: myapp
    resources:
      requests:
        cpu: "500m"      # Guaranteed
        memory: "512Mi"  # Guaranteed
      limits:
        cpu: "1000m"     # Maximum
        memory: "1Gi"    # Maximum`,
    commonMisconceptions: [
      'Requests must equal limits - FALSE: They can be different',
      'Limits are required - FALSE: Optional but recommended',
      'CPU limits enforce max usage - TRUE: But memory limits can kill container'
    ]
  },

  'bin-packing': {
    id: 'bin-packing',
    title: 'Bin Packing',
    shortDefinition: 'Bin packing is a scheduling strategy that places pods as densely as possible on the fewest nodes.',
    mentalModel: 'Like packing a suitcase - you want to fit as much as possible in the smallest number of suitcases. Kubernetes can use bin-packing to consolidate workloads, leaving other nodes empty for scaling or maintenance.',
    yamlExample: `# Set scheduler profile
apiVersion: kubescheduler.config.k8s.io/v1beta3
kind: KubeSchedulerConfiguration
profiles:
- pluginConfig:
  - name: NodeResourcesFit
    args:
      resources:
        - name: cpu
          weight: 1
        - name: memory
          weight: 1`,
    commonMisconceptions: [
      'Bin-packing always best - FALSE: Sometimes spreading is better',
      'Bin-packing reduces resource waste - TRUE: But can cause hotspots',
      'All schedulers use bin-packing - FALSE: Different strategies available'
    ]
  },

  'node-selection': {
    id: 'node-selection',
    title: 'Node Selection',
    shortDefinition: 'Node selection is the process the scheduler uses to choose which node should run a pod.',
    mentalModel: 'Like a student choosing classes - you filter out classes that don\'t meet requirements (core courses, time slots), then rank remaining options by preference (interesting professor, good time), finally register for the best option.',
    yamlExample: `apiVersion: v1
kind: Pod
spec:
  nodeSelector:
    disktype: ssd
  containers:
  - name: app
    image: myapp`,
    commonMisconceptions: [
      'Scheduler randomly picks nodes - FALSE: Uses filtering and scoring',
      'Node selection is instant - FALSE: Multi-step process',
      'You can force a specific node - TRUE: Using nodeSelector or nodeName'
    ]
  },

  'labels-selectors': {
    id: 'labels-selectors',
    title: 'Labels & Selectors',
    shortDefinition: 'Labels are key-value pairs attached to objects, and selectors are used to identify objects with matching labels.',
    mentalModel: 'Labels are like name tags on luggage. Selectors are like "All bags with red tags go to carousel 1". They help organize and group Kubernetes objects without changing their core structure.',
    yamlExample: `apiVersion: v1
kind: Pod
metadata:
  labels:
    app: web
    tier: frontend
---
apiVersion: v1
kind: Service
spec:
  selector:
    app: web    # Selects pods with this label
  ports:
  - port: 80`,
    commonMisconceptions: [
      'Labels are for identification only - FALSE: Used for scheduling too',
      'Labels must be unique - FALSE: Multiple objects can have same labels',
      'Labels are required - FALSE: Optional but highly recommended'
    ]
  },

  'node-affinity': {
    id: 'node-affinity',
    title: 'Node Affinity',
    shortDefinition: 'Node affinity rules constrain which nodes a pod can be scheduled on based on node labels.',
    mentalModel: 'Node affinity is like having a preference for where you sit in a restaurant. "I prefer a window seat" (preferred) vs "I must sit in non-smoking" (required). Kubernetes respects these when placing pods.',
    yamlExample: `apiVersion: v1
kind: Pod
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disktype
            operator: In
            values:
            - ssd
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        preference:
          matchExpressions:
          - key: zone
            operator: In
            values:
            - us-west-1
  containers:
  - name: app
    image: myapp`,
    commonMisconceptions: [
      'Affinity guarantees placement - FALSE: Only required affinity is mandatory',
      'Affinity replaces nodeSelector - FALSE: Can be used together',
      'Affinity is evaluated after scheduling - FALSE: It\'s used during filtering/scoring'
    ]
  },

  'pod-affinity': {
    id: 'pod-affinity',
    title: 'Pod Affinity',
    shortDefinition: 'Pod affinity rules specify that pods should be placed near (on the same node or zone) as other pods.',
    mentalModel: 'Like wanting to sit near your friends at a concert. Pod affinity tells Kubernetes "put this pod on the same node as other pods from the same application" to improve performance or enable communication.',
    yamlExample: `apiVersion: v1
kind: Pod
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: web
        topologyKey: "kubernetes.io/hostname"
  containers:
  - name: app
    image: myapp`,
    commonMisconceptions: [
      'Pod affinity affects all pods - FALSE: Only affects pods with the rule',
      'Affinity is required - FALSE: Optional scheduling constraint',
      'Affinity prevents node failure issues - TRUE: But also spreads risk'
    ]
  },

  'pod-anti-affinity': {
    id: 'pod-anti-affinity',
    title: 'Pod Anti-Affinity',
    shortDefinition: 'Pod anti-affinity rules specify that pods should be placed away from (not on the same node as) other pods.',
    mentalModel: 'Like sitting far apart in a theater to ensure even distribution. Pod anti-affinity spreads pods across different nodes to improve fault tolerance - if one node fails, not all pods go down.',
    yamlExample: `apiVersion: v1
kind: Pod
spec:
  affinity:
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchLabels:
            app: web
        topologyKey: "kubernetes.io/hostname"
  containers:
  - name: app
    image: myapp`,
    commonMisconceptions: [
      'Anti-affinity prevents any pods on same node - FALSE: Only matching pods',
      'Anti-affinity guarantees even distribution - TRUE: But can lead to pending pods',
      'Anti-affinity and affinity conflict - FALSE: Can use both together'
    ]
  },

  'taints-tolerations': {
    id: 'taints-tolerations',
    title: 'Taints & Tolerations',
    shortDefinition: 'Taints repel pods unless they have matching tolerations, controlling which pods can run on nodes.',
    mentalModel: 'Taints are "Do Not Enter" signs on rooms. Only people with a special key (toleration) can enter. This lets you dedicate nodes to specific workloads or keep problematic pods away from critical nodes.',
    yamlExample: `# Add taint to node
kubectl taint nodes node1 key=value:NoSchedule

# Pod with toleration
apiVersion: v1
kind: Pod
spec:
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
  containers:
  - name: app
    image: myapp`,
    commonMisconceptions: [
      'Taints prevent all pods - FALSE: Only pods without matching tolerations',
      'Tolerations force scheduling - FALSE: Just allow scheduling',
      'All nodes have taints - FALSE: Taints are added deliberately'
    ]
  },

  'daemonsets': {
    id: 'daemonsets',
    title: 'DaemonSets',
    shortDefinition: 'DaemonSets ensure a copy of a pod runs on all (or some) nodes in the cluster.',
    mentalModel: 'Like ensuring every classroom has a teacher. DaemonSets automatically add pods when nodes are added and remove them when nodes are removed, useful for monitoring agents, log collectors, or storage daemons.',
    yamlExample: `apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      containers:
      - name: fluentd
        image: fluentd`,
    commonMisconceptions: [
      'DaemonSets run on control plane - FALSE: Only on worker nodes (usually)',
      'DaemonSet pods can\'t be managed - FALSE: They\'re normal pods managed by DaemonSet controller',
      'DaemonSets replace Deployments - FALSE: Used for different purposes'
    ]
  },

  'replicasets': {
    id: 'replicasets',
    title: 'ReplicaSets',
    shortDefinition: 'ReplicaSets ensure a specified number of pod replicas are running at any given time.',
    mentalModel: 'A ReplicaSet is like an auto-scaling team manager. If someone quits or gets sick, the manager hires a replacement. If too many people are working, some are let go. The team size stays constant.',
    yamlExample: `apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: web-replicaset
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx`,
    commonMisconceptions: [
      'ReplicaSets are for rolling updates - FALSE: Use Deployments for that',
      'ReplicaSets manage pods exactly - FALSE: Use match labels, not names',
      'Manually created pods count - FALSE: ReplicaSet only manages its own pods'
    ]
  },

  'deployments': {
    id: 'deployments',
    title: 'Deployments',
    shortDefinition: 'Deployments provide declarative updates to Pods and ReplicaSets, enabling rolling updates and rollbacks.',
    mentalModel: 'A Deployment is like a software version controller for pods. It manages multiple versions of your application, allowing smooth transitions between versions with automatic rollback if something goes wrong.',
    yamlExample: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-deployment
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web
        image: nginx:1.21`,
    commonMisconceptions: [
      'Deployments directly manage pods - FALSE: They manage ReplicaSets',
      'Deployments require manual updates - FALSE: Declarative updates',
      'Rollbacks are difficult - FALSE: One command to rollback'
    ]
  },

  'preemption': {
    id: 'preemption',
    title: 'Preemption',
    shortDefinition: 'Preemption allows a high-priority pod to evict lower-priority pods to get scheduled on a node.',
    mentalModel: 'Like priority boarding for flights - a VIP (high-priority pod) can take the seat of a regular passenger (low-priority pod). The lower-priority pod gets bumped and must wait for another flight (node).',
    yamlExample: `apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000
globalDefault: false
description: "High priority pods"

---
apiVersion: v1
kind: Pod
spec:
  priorityClassName: high-priority
  containers:
  - name: app
    image: myapp`,
    commonMisconceptions: [
      'All pods can preempt - FALSE: Only pods with higher priority',
      'Preemption is automatic - TRUE: Scheduler handles it',
      'Preempted pods are deleted - TRUE: They\'re terminated and must restart'
    ]
  },

  'priority-classes': {
    id: 'priority-classes',
    title: 'Priority Classes',
    shortDefinition: 'Priority classes define importance levels for pods, affecting scheduling order and preemption.',
    mentalModel: 'Priority classes are like ticket classes (Economy, Business, First Class). Higher priority pods get preferential treatment during scheduling and can preempt lower priority pods when resources are scarce.',
    yamlExample: `apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: production
value: 1000000
globalDefault: false
description: "Production workloads"

---
apiVersion: v1
kind: Pod
metadata:
  name: prod-pod
spec:
  priorityClassName: production
  containers:
  - name: app
    image: myapp`,
    commonMisconceptions: [
      'Priority classes guarantee resources - FALSE: Just affect scheduling order',
      'Default priority is zero - TRUE: Unless a global default is set',
      'Priority affects runtime behavior - FALSE: Only affects scheduling'
    ]
  },

  'eviction': {
    id: 'eviction',
    title: 'Eviction',
    shortDefinition: 'Eviction is the process of terminating and rescheduling pods, usually due to resource pressure or node issues.',
    mentalModel: 'Eviction is like being asked to leave a full elevator. When resources (space) are needed, some passengers (pods) must exit. Important passengers (higher priority) get to stay.',
    yamlExample: `# Eviction happens automatically
# View evicted pods:
kubectl get pods -A | grep Evicted

# Resource pressure can trigger eviction
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    image: myapp
    resources:
      requests:
        memory: "512Mi"
      limits:
        memory: "1Gi"`,
    commonMisconceptions: [
      'Eviction is manual only - FALSE: Often automatic (kubelet, scheduler)',
      'Evicted pods disappear - FALSE: Visible as Evicted until deleted',
      'All pods can be evicted - FALSE: DaemonSets have protection'
    ]
  },

  'unschedulable-pods': {
    id: 'unschedulable-pods',
    title: 'Unschedulable Pods',
    shortDefinition: 'A pod is unschedulable when no suitable node is available to run it due to resource constraints or scheduling requirements.',
    mentalModel: 'Like a passenger whose luggage is too big for the overhead bin. The passenger (pod) exists but can\'t be seated (scheduled) until constraints are resolved - either by removing requirements or finding a suitable bin (node).',
    yamlExample: `apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    image: myapp
    resources:
      requests:
        cpu: "10"  # May cause unschedulable if no node has 10 CPUs`,
    commonMisconceptions: [
      'Unschedulable = Pending - TRUE: They\'re the same state',
      'Unschedulable pods retry automatically - TRUE: Until scheduled',
      'Unschedulable means broken - FALSE: Just waiting for conditions to be met'
    ]
  },

  'why-pods-pending': {
    id: 'why-pods-pending',
    title: 'Why Pods Stay Pending',
    shortDefinition: 'Pods stay pending when the scheduler cannot find a suitable node, often due to insufficient resources, taints, or affinity constraints.',
    mentalModel: 'A pod is like a person waiting for an elevator. The doors won\'t close if: elevator is full (insufficient resources), elevator is for VIPs only (taints without tolerations), or they must wait for their group (affinity constraints).',
    yamlExample: `# Check why pod is pending
kubectl describe pod <pod-name>

# Common causes in events:
# 0/3 nodes available: 3 Insufficient cpu
# 0/3 nodes available: 3 node(s) had taint {node-role.kubernetes.io/control-plane}, that the pod didn't tolerate`,
    commonMisconceptions: [
      'Pending always means resources issue - FALSE: Could be constraints, taints, etc.',
      'Pending pods consume resources - FALSE: They don\'t run yet',
      'All pending pods will eventually run - FALSE: May never schedule if constraints are impossible'
    ]
  },

  'cluster-autoscaling': {
    id: 'cluster-autoscaling',
    title: 'Cluster Autoscaling',
    shortDefinition: 'Cluster autoscaler automatically adjusts the number of nodes in a cluster based on resource demand.',
    mentalModel: 'Like a building that adds more floors when tenants need more space. When pods can\'t be scheduled (pending), the autoscaler adds more nodes. When nodes are underutilized, it removes them to save costs.',
    yamlExample: `apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 50

# Cluster autoscaler runs separately
# Configuration is cluster-specific`,
    commonMisconceptions: [
      'Autoscaler adds pods - FALSE: Cluster autoscaler adds nodes (HPA adds pods)',
      'Autoscaling is instant - FALSE: Takes time to provision nodes',
      'Autoscaler never removes nodes - FALSE: Removes underutilized nodes'
    ]
  },

  'debugging': {
    id: 'debugging',
    title: 'Scheduling Failures & Debugging',
    shortDefinition: 'Debugging scheduling failures involves checking pod events, scheduler logs, and node status to understand why pods can\'t be scheduled.',
    mentalModel: 'Debugging is like being a detective solving a mystery. Follow the clues: pod status (pending), events (why), node availability (where), and scheduler logs (decisions). Each clue points to the solution.',
    yamlExample: `# Key debugging commands:
kubectl describe pod <pod-name>     # Check events
kubectl get nodes                    # Check node status
kubectl top nodes                    # Check node usage
kubectl logs -n kube-system <scheduler-pod>  # Scheduler logs

# Common issues in Events:
# Insufficient resources
# Node affinity not satisfied
# Taints not tolerated`,
    commonMisconceptions: [
      'Debugging requires complex tools - FALSE: kubectl describe is usually enough',
      'All scheduling issues are obvious - FALSE: Some require investigating constraints',
      'Scheduler logs are always helpful - TRUE: But need to find the right pod'
    ]
  }
};
