export interface DockerFlashcard {
  id: string;
  category: 'Linux Namespaces & Cgroups' | 'Storage & OverlayFS' | 'Docker Networking' | 'Kubernetes Architecture';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const DOCKER_FLASHCARDS: DockerFlashcard[] = [
  {
    id: 'df-1',
    category: 'Linux Namespaces & Cgroups',
    difficulty: 'Junior',
    question: 'What is the fundamental architectural difference between Linux Namespaces and Control Groups (cgroups)?',
    answer: 'Namespaces control VISIBILITY (isolation) by giving the process private views of system resources (PID, Network, Mounts, Hostname, IPC, User). Cgroups control RESOURCE CONSUMPTION by enforcing hard limits and quotas on CPU cycles, RAM, disk I/O bandwidth, and maximum PIDs.',
    code: `# Namespaces -> Isolate environment
# Cgroups -> Enforce resource ceilings (--cpus=2, --memory=1g)`,
    tip: 'Containers are not a hardware virtualization boundary; they are ordinary Linux processes bounded by namespaces and cgroups.'
  },
  {
    id: 'df-2',
    category: 'Storage & OverlayFS',
    difficulty: 'Mid',
    question: 'How does Copy-on-Write (CoW) work in OverlayFS when a container modifies a file from a base image?',
    answer: 'Base image layers are stored as read-only directories in lowerdir. When a container writes or edits an existing file, the storage driver copies the entire file from lowerdir up into the container writable upperdir before executing the write. The original image layer remains 100% immutable and untouched.',
    code: `lowerdir (Read-Only Image) -> upperdir (Read-Write Container) -> merged (Unified RootFS)`,
    tip: 'OverlayFS avoids file duplication until the moment of modification, allowing hundreds of containers to share the same base image in RAM.'
  },
  {
    id: 'df-3',
    category: 'Kubernetes Architecture',
    difficulty: 'Senior',
    question: 'What happens when a Liveness Probe fails vs when a Readiness Probe fails in Kubernetes?',
    answer: '1. Readiness Probe Failure: Kubelet removes the Pod IP from the Service Endpoints list (traffic stops routing to this Pod), but the container is NOT restarted. 2. Liveness Probe Failure: Kubelet assumes the process is deadlocked and immediately terminates and restarts the container.',
    code: `# Readiness = Can this Pod receive user requests right now?
# Liveness = Is the process alive or permanently frozen?`,
    tip: 'Never check external database connections in a Liveness probe to prevent cascading cluster restarts during DB maintenance.'
  },
  {
    id: 'df-4',
    category: 'Docker Networking',
    difficulty: 'Senior',
    question: 'How does kube-proxy route traffic from a Service ClusterIP to individual Pod endpoints?',
    answer: 'kube-proxy watches the Kubernetes API for Service and Endpoint updates and writes layer-4 routing rules directly into the host Linux kernel (using either iptables or IPVS). When a packet targets the virtual ClusterIP, the kernel NAT table rewrites the destination IP to a randomly chosen healthy Pod IP.',
    code: `# kube-proxy in IPVS mode uses hash tables: O(1) performance
# kube-proxy in legacy iptables mode evaluates linear rules: O(N)`,
    tip: 'IPVS mode is recommended for production clusters with more than 1,000 services.'
  },
  {
    id: 'df-5',
    category: 'Kubernetes Architecture',
    difficulty: 'Staff',
    question: 'What causes Exit Code 137 in containerized applications and how do you diagnose it?',
    answer: 'Exit Code 137 represents 128 + Signal 9 (SIGKILL). It almost always indicates that the container exceeded its cgroup memory limit, triggering the Linux Kernel Out-Of-Memory (OOM) Killer. You can verify this by checking kubectl describe pod for Reason: OOMKilled or inspecting dmesg on the node.',
    code: `kubectl describe pod api-pod-79f9 | grep -E "OOMKilled|Exit Code"`,
    tip: 'Tune memory requests/limits and profile heap allocations in Node.js/Go to prevent OOM termination.'
  }
];
