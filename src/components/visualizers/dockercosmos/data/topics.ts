export interface DockerTopic {
  id: string;
  title: string;
  category: 'containers' | 'storage' | 'networking' | 'k8s-core' | 'k8s-advanced' | 'security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const DOCKER_TOPICS: DockerTopic[] = [
  {
    id: 'linux-namespaces-isolation',
    title: 'Linux Kernel Namespaces: The Illusion of a Private Machine',
    category: 'containers',
    difficulty: 'Beginner',
    summary: 'A container is just a standard Linux process isolated by 6 Kernel Namespaces: PID (Process IDs), NET (Network stacks/IPs), MNT (Mount points/RootFS), IPC (Inter-Process Comm), UTS (Hostname), and USER (UID/GID mapping).',
    mentalModel: 'The Hotel Room vs Entire House: Virtual Machines build a completely separate house from the foundation up (Hypervisor + Guest OS). Containers give you a private hotel room with your own locked door, bathroom, and keycard (Namespaces) inside a shared building with shared plumbing (Host Linux Kernel).',
    codeSnippet: `# Unshare system call to create isolated namespaces manually:
sudo unshare --fork --pid --mount-proc --net /bin/bash

# Inside isolated namespace:
ps aux
# PID 1 is your bash shell! The host's 300 other processes are invisible.

ip addr
# Clean isolated loopback interface without host network adapters.`,
    takeaways: [
      'Containers do NOT have a guest kernel or virtualized BIOS; they share the host Linux kernel directly.',
      'PID Namespace maps Process ID 1 inside the container to a standard arbitrary PID (e.g. PID 48921) on the host.',
      'NET Namespace creates a private virtual network stack with its own IP, routing table, and iptables rules.'
    ],
    commonPitfall: {
      mistake: 'Running processes as root inside containers without User Namespaces, allowing kernel exploit escapes with full root privileges on the host.',
      fix: 'Use rootless Docker or non-root USER directives (e.g. USER node or USER 10001).'
    },
    nextTopicId: 'cgroups-v2-resource-limits'
  },
  {
    id: 'cgroups-v2-resource-limits',
    title: 'Control Groups (cgroups v2): CPU Quotas & The OOM Killer',
    category: 'containers',
    difficulty: 'Intermediate',
    summary: 'While Namespaces control WHAT a container can see, Control Groups (cgroups) control HOW MUCH host resources (CPU cycles, Memory, Disk I/O, PIDs) a container is permitted to consume.',
    mentalModel: 'The Hotel Keycard Power Limiter: Namespaces give you the hotel room; Cgroups restrict the air conditioner to 500 Watts (CPU quota) and turn off the lights if you use more than 100 Gallons of water (OOM Killer).',
    codeSnippet: `# Run container with 512MB RAM limit and 0.5 CPU quota:
docker run -d \\
  --name web-app \\
  --memory="512m" \\
  --memory-swap="512m" \\
  --cpus="0.5" \\
  nginx:alpine

# Under the hood: Linux CFS (Completely Fair Scheduler) quota:
# /sys/fs/cgroup/memory.max = 536870912 (512MB)
# /sys/fs/cgroup/cpu.max = 50000 100000 (50ms per 100ms period = 0.5 CPU)`,
    takeaways: [
      'CPU Limits: The Linux CFS scheduler throttles CPU cycles by pausing process execution if quota is exhausted within a 100ms period.',
      'Memory Limits: If a container exceeds its memory.max threshold and swap is disabled, the Linux Kernel OOM Killer immediately terminates the container with Exit Code 137 (SIGKILL 9 + 128).',
      'cgroups v2 provides a unified hierarchy, eliminating resource contention bugs present in v1.'
    ],
    commonPitfall: {
      mistake: 'Setting aggressive CPU limits on latency-sensitive Node.js/Go services, causing severe tail-latency spikes due to CFS throttling.',
      fix: 'Set CPU requests for Kubernetes scheduling, but omit strict CPU limits or benchmark CFS period quotas.'
    },
    nextTopicId: 'overlayfs-union-layers'
  },
  {
    id: 'overlayfs-union-layers',
    title: 'OverlayFS & Layered Image Architecture (lowerdir vs upperdir)',
    category: 'storage',
    difficulty: 'Advanced',
    summary: 'Docker images are composed of read-only immutable layers (lowerdir) combined with a thin read-write container layer (upperdir). OverlayFS presents a unified merged filesystem view via Copy-on-Write (CoW).',
    mentalModel: 'The Overhead Projector Transparencies: Each Dockerfile command is a clear transparent plastic sheet printed with ink (read-only lowerdir). When stacked together, you see the complete picture. When you write a file in the container, you draw with a dry-erase marker on the top glass sheet (upperdir).',
    codeSnippet: `# Dockerfile layer caching order:
FROM node:22-alpine AS base
WORKDIR /app

# Layer 1 (Cached unless package.json changes):
COPY package*.json ./
RUN npm ci --only=production

# Layer 2 (Frequently changing source code):
COPY . .

# OverlayFS Directory Hierarchy:
# lowerdir = Read-only image layers (node runtime + npm dependencies)
# upperdir = Container read-write layer (log files, /tmp writes)
# merged = Unified view visible inside the container at /`,
    takeaways: [
      'Copy-on-Write (CoW): Modifying a file from a lower layer copies the entire file into the upperdir before writing.',
      'Immutable Layers: Multiple running containers based on the same image share 100% of read-only lowerdir layers in RAM, saving gigabytes of disk and page cache.',
      'Deleting a file in a container creates a "whiteout" character device in upperdir, masking the file in merged view without deleting it from the base image.'
    ],
    commonPitfall: {
      mistake: 'Installing build tools and deleting them in a subsequent RUN command (e.g. RUN apt-get install && RUN apt-get remove), which still permanently retains the files in previous lowerdir layers.',
      fix: 'Combine install and cleanup in a SINGLE RUN instruction or use Multi-Stage builds.'
    },
    nextTopicId: 'docker-networking-bridge-iptables'
  },
  {
    id: 'docker-networking-bridge-iptables',
    title: 'Docker Networking: Bridge Networks, veth Pairs & iptables NAT',
    category: 'networking',
    difficulty: 'Advanced',
    summary: 'Docker connects containers using Virtual Ethernet (veth) cable pairs linked to a Linux software bridge (docker0 / custom bridge), routing incoming traffic via iptables PREROUTING NAT tables.',
    mentalModel: 'The Ethernet Switch & Patch Cables: The host machine creates a virtual software network switch (docker0 bridge). Every container receives one end of a virtual ethernet patch cable (veth), while the other end is plugged into docker0.',
    codeSnippet: `# Inspect Docker virtual network interfaces:
ip link show
# Shows: docker0 (bridge) <---> veth9a42f (container peer)

# Run container with port publishing:
docker run -d -p 8080:80 --name web nginx

# iptables NAT forwarding rule automatically created:
# -A PREROUTING -p tcp -m tcp --dport 8080 -j DNAT --to-destination 172.17.0.2:80`,
    takeaways: [
      'veth pair: Virtual ethernet interface pair acting like a bidirectional patch cord between host network and container NET namespace.',
      'Bridge Driver: Default network providing private subnet (172.17.0.0/16) and automatic DNS resolution on user-defined custom networks.',
      'Host Driver: Bypasses container network isolation, binding directly to host network ports with zero NAT overhead.'
    ],
    commonPitfall: {
      mistake: 'Trying to connect two containers via container names on the default "bridge" network (default bridge lacks embedded DNS).',
      fix: 'Create a user-defined network: docker network create my-net && docker run --net my-net.'
    },
    nextTopicId: 'k8s-control-plane-architecture'
  },
  {
    id: 'k8s-control-plane-architecture',
    title: 'Kubernetes Control Plane: Declarative Reconciliation Loop',
    category: 'k8s-core',
    difficulty: 'Advanced',
    summary: 'The Kubernetes Control Plane maintains desired cluster state through continuous reconciliation: kube-apiserver (REST hub) <-> etcd (Raft state store) <-> kube-scheduler (Node placement) <-> kube-controller-manager (Reconciliation loops).',
    mentalModel: 'The Thermostat & HVAC System: You set the desired temperature to 72°F (Declarative YAML manifest). The thermostat constantly measures actual temperature against desired state (Reconciliation Loop) and turns on the furnace until Actual == Desired.',
    codeSnippet: `# Declarative Manifest (Specify DESIRED state, not imperative steps):
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 3 # Desired State: Exactly 3 Pods
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: server
        image: api:v2.0
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"`,
    takeaways: [
      'Declarative Model: You declare the target end state; Kubernetes controllers continuously execute reconciliation loops to converge actual state to desired state.',
      'etcd: Distributed, consistent Raft-replicated key-value store containing the single source of truth for the entire cluster.',
      'kube-apiserver is the ONLY component that directly communicates with etcd; all other controllers watch the API server via HTTP long-polling.'
    ],
    commonPitfall: {
      mistake: 'Using imperative kubectl create/replace commands in production CI/CD instead of declarative kubectl apply -f.',
      fix: 'Always use kubectl apply -f with GitOps controllers (ArgoCD, Flux) for automated reconciliation.'
    },
    nextTopicId: 'k8s-pod-lifecycle-probes'
  },
  {
    id: 'k8s-pod-lifecycle-probes',
    title: 'Kubernetes Pod Lifecycle & Health Probes (Liveness vs Readiness)',
    category: 'k8s-core',
    difficulty: 'Intermediate',
    summary: 'A Pod is the smallest deployable compute unit in Kubernetes (sharing network IP and storage volumes). Health probes determine if containers should be restarted (Liveness), receive traffic (Readiness), or given time to boot (Startup).',
    mentalModel: 'The Restaurant Chef: Startup Probe checks if the chef has arrived at work; Readiness Probe checks if the chef has prepped ingredients and is ready to take customer orders; Liveness Probe checks if the chef has fainted and needs replacement.',
    codeSnippet: `apiVersion: v1
kind: Pod
metadata:
  name: web-pod
spec:
  containers:
  - name: app
    image: web:v1
    # 1. Startup Probe: Grants up to 60s for initial database migrations:
    startupProbe:
      httpGet:
        path: /health/startup
        port: 8080
      failureThreshold: 30
      periodSeconds: 2
    # 2. Readiness Probe: Controls inclusion in Service endpoint pool:
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8080
      periodSeconds: 5
    # 3. Liveness Probe: Restarts container on deadlocks:
    livenessProbe:
      httpGet:
        path: /health/live
        port: 8080
      periodSeconds: 10`,
    takeaways: [
      'Readiness Probe Failure: Removes Pod IP from Service Endpoints (stops routing traffic), but does NOT restart the container.',
      'Liveness Probe Failure: Kubelet immediately kills and restarts the container based on restartPolicy.',
      'CrashLoopBackOff: Occurs when a container exits immediately on startup (Exit Code 1 or 137), triggering exponential restart backoff (10s, 20s, 40s... up to 5min).'
    ],
    commonPitfall: {
      mistake: 'Checking external database dependencies in a Liveness Probe; if the DB has a blip, ALL Pods in the cluster restart simultaneously, causing a cascading outage.',
      fix: 'Check external dependencies only in Readiness Probes; keep Liveness Probes strictly checking internal process deadlocks.'
    },
    nextTopicId: 'k8s-services-kube-proxy-iptables'
  },
  {
    id: 'k8s-services-kube-proxy-iptables',
    title: 'Kubernetes Services & kube-proxy Packet Routing (iptables vs IPVS)',
    category: 'networking',
    difficulty: 'Advanced',
    summary: 'Since Pod IPs are ephemeral and change upon restart, a Service provides a stable virtual ClusterIP and DNS name, load-balancing traffic across matching Pod endpoints via kube-proxy iptables/IPVS rules.',
    mentalModel: 'The Reception Desk & Call Center: Pods are individual call operators whose desks change every morning. The Service is the single toll-free telephone number (ClusterIP) that automatically distributes incoming calls to available operators (Endpoints).',
    codeSnippet: `apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  type: ClusterIP # Internal virtual IP
  selector:
    app: api # Matches Pod labels
  ports:
  - protocol: TCP
    port: 80 # Service Port
    targetPort: 8080 # Container Port

# CoreDNS creates cluster internal DNS record:
# api-service.default.svc.cluster.local -> 10.96.0.42`,
    takeaways: [
      'ClusterIP: Default virtual IP reachable only from within the Kubernetes cluster.',
      'NodePort: Exposes the Service on a static high port (30000-32767) on EVERY cluster node IP.',
      'LoadBalancer: Provisions a cloud load balancer (AWS NLB/ALB, GCP Cloud LB) routing to NodePorts.',
      'kube-proxy programs the Linux kernel iptables/IPVS packet filter tables on each node for layer-4 connection routing.'
    ],
    commonPitfall: {
      mistake: 'Using large clusters with 5,000+ Services on legacy iptables mode, causing O(N) linear packet inspection latency degradation.',
      fix: 'Switch kube-proxy to IPVS mode for O(1) hash-table lookup performance.'
    },
    nextTopicId: 'k8s-ingress-controllers'
  },
  {
    id: 'k8s-ingress-controllers',
    title: 'Ingress Controllers & Layer-7 HTTP Routing',
    category: 'networking',
    difficulty: 'Intermediate',
    summary: 'Ingress acts as a smart HTTP/HTTPS reverse proxy and API Gateway at the edge of the cluster, providing path-based routing (/api -> api-svc, / -> web-svc) and TLS termination with a single public Load Balancer.',
    mentalModel: 'The Airport Terminal Directory: The public entrance (Ingress) inspects your boarding pass URL path. If it says "/flights", you are routed to Gate A; if "/baggage", to Gate B.',
    codeSnippet: `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: main-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls-cert
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /v1/users
        pathType: Prefix
        backend:
          service:
            name: user-service
            port:
              number: 80
      - path: /v1/orders
        pathType: Prefix
        backend:
          service:
            name: order-service
            port:
              number: 80`,
    takeaways: [
      'Ingress is only an API resource specification; an Ingress Controller (Nginx, Traefik, Envoy, Istio) must be running to execute the routing.',
      'Path-based and host-based routing consolidates dozens of microservices behind a single external cloud IP.',
      'Automates SSL/TLS certificates via cert-manager and ACME Let\'s Encrypt.'
    ],
    commonPitfall: {
      mistake: 'Creating a separate cloud LoadBalancer Service for every microservice, multiplying cloud infrastructure costs by 10x.',
      fix: 'Use a single Ingress Controller backed by one Load Balancer to route all cluster services.'
    }
  }
];
