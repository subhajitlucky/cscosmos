import type { Topic } from './topics';
import { topics } from './topics';

export type StageLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export interface RoadmapStage {
  stageIndex: number;
  level: StageLevel;
  name: string;
  summary: string;
  slugs: string[];
}

export interface RoleRoadmap {
  id: string;
  title: string;
  shortTitle: string;
  tagline: string;
  description: string;
  icon: 'Globe' | 'Server' | 'Layers' | 'Cpu' | 'Brain' | 'Workflow' | 'ShieldCheck' | 'Terminal';
  accentColor: string;
  targetRoles: string[];
  stages: RoadmapStage[];
}

export const ROLE_ROADMAPS: RoleRoadmap[] = [
  {
    id: 'frontend',
    title: 'Frontend Engineer',
    shortTitle: 'Frontend',
    tagline: 'Modern UI Architecture, Browser Runtimes & Reactive Systems',
    description:
      'From DOM rendering, CSS layout algorithms, and JavaScript execution internals to modern frameworks, SSR, performance profiling, and WebAssembly.',
    icon: 'Globe',
    accentColor: 'text-sky-500 border-sky-500/30 bg-sky-500/10',
    targetRoles: ['Frontend Developer', 'UI/UX Engineer', 'Web Platform Architect'],
    stages: [
      {
        stageIndex: 1,
        level: 'Basic',
        name: 'Web Foundations & Runtime Mechanics',
        summary: 'Master semantic markup, layout rendering, JS event loops, and underlying HTTP protocols.',
        slugs: ['html-cosmos', 'css-cosmos', 'jsviz', 'webprotocols', 'browseruniverse'],
      },
      {
        stageIndex: 2,
        level: 'Intermediate',
        name: 'Component Architecture & Type Systems',
        summary: 'Build robust, scalable component hierarchies with strict type safety and modern style tooling.',
        slugs: ['tsviz', 'reactcosmos', 'tailwindcosmos', 'vuecosmos', 'sveltecosmos'],
      },
      {
        stageIndex: 3,
        level: 'Advanced',
        name: 'Full-Stack Web, State & Performance',
        summary: 'Master server-side rendering, streaming, client-server data synchronization, and security.',
        slugs: ['nextjscosmos', 'state-management-data-fetching', 'forms-validation', 'websecurity', 'testing', 'apiviz'],
      },
      {
        stageIndex: 4,
        level: 'Expert',
        name: 'Low-Level Web, WebAssembly & Cross-Platform',
        summary: 'Push browser limits with linear memory execution, CRDT synchronization, and spatial computing.',
        slugs: ['wasmcosmos', 'crossplatformviz', 'synccosmos', 'xrcosmos'],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Distributed Systems',
    shortTitle: 'Backend',
    tagline: 'High-Throughput APIs, Distributed Storage & Event-Driven Systems',
    description:
      'From process models, relational data, and asynchronous runtimes to message queues, microservices, consensus protocols, and large-scale system design.',
    icon: 'Server',
    accentColor: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
    targetRoles: ['Backend Engineer', 'Distributed Systems Engineer', 'Cloud Infrastructure Developer'],
    stages: [
      {
        stageIndex: 1,
        level: 'Basic',
        name: 'Runtime Execution & Network I/O',
        summary: 'Understand CPU memory execution, networking protocols, and concurrent language runtimes.',
        slugs: ['program-cosmos', 'webprotocols', 'sqlcosmos', 'nodecosmos', 'golangviz', 'fastapicosmos'],
      },
      {
        stageIndex: 2,
        level: 'Intermediate',
        name: 'Data Architecture, Caching & Network Layers',
        summary: 'Design transactional storage, document models, in-memory caching, and robust security.',
        slugs: ['database-internals-indexes-transactions', 'mongocosmos', 'redisviz', 'authviz', 'computer-networks-internals-tcpip', 'lldcosmos'],
      },
      {
        stageIndex: 3,
        level: 'Advanced',
        name: 'Message Streaming, Microservices & Containers',
        summary: 'Decouple services using publish/subscribe queues, containerize workflows, and balance traffic.',
        slugs: ['mqviz', 'microservicesviz', 'dockercosmos', 'loadbalancing', 'event-sourcing-and-cqrs-writeread-models'],
      },
      {
        stageIndex: 4,
        level: 'Expert',
        name: 'Consensus, Scalability & Formal Verification',
        summary: 'Engineer fault-tolerant distributed architectures with Raft/Paxos, CRDT sync, and TLA+ safety proofs.',
        slugs: ['systemdesignviz', 'consensusviz', 'synccosmos', 'formal-methods-and-tla-the-math-of-correctness', 'distributed-systems-visualizer-replication-consistency'],
      },
    ],
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Product Engineer',
    shortTitle: 'Full-Stack',
    tagline: 'End-to-End Product Engineering from Browser DOM to Cloud Deployments',
    description:
      'Bridging user experience and backend resilience: reactive frontend interfaces, type-safe API contracts, database modeling, and automated cloud delivery.',
    icon: 'Layers',
    accentColor: 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10',
    targetRoles: ['Full-Stack Engineer', 'Founding Engineer', 'Product Software Developer'],
    stages: [
      {
        stageIndex: 1,
        level: 'Basic',
        name: 'Web & Runtime Fundamentals',
        summary: 'Grasp the core pillars of web execution, layout structure, dynamic scripting, and relational data.',
        slugs: ['html-cosmos', 'css-cosmos', 'jsviz', 'webprotocols', 'sqlcosmos'],
      },
      {
        stageIndex: 2,
        level: 'Intermediate',
        name: 'Full-Stack Frameworks & API Contracts',
        summary: 'Connect client components to asynchronous server backends with authentication and database layers.',
        slugs: ['tsviz', 'reactcosmos', 'nodecosmos', 'fastapicosmos', 'authviz', 'mongocosmos'],
      },
      {
        stageIndex: 3,
        level: 'Advanced',
        name: 'Production Architecture & Cloud Operations',
        summary: 'Deploy full-stack SSR apps, configure containerization, enforce web security, and manage versioning.',
        slugs: ['nextjscosmos', 'tailwindcosmos', 'websecurity', 'redisviz', 'dockercosmos', 'gitcosmos', 'testing'],
      },
      {
        stageIndex: 4,
        level: 'Expert',
        name: 'System Design & High-Availability Scaling',
        summary: 'Architect resilient multi-tier systems with load balancers, microservices, and cloud infrastructure.',
        slugs: ['systemdesignviz', 'microservicesviz', 'loadbalancing', 'cloudcosmos'],
      },
    ],
  },
  {
    id: 'kernel',
    title: 'Real-Time Kernel & Embedded Engineer',
    shortTitle: 'Kernel & Embedded',
    tagline: 'Operating Systems, PREEMPT_RT, Hardware Registers & Robotics Systems',
    description:
      'From hardware instruction pipelines, assembly, and C systems programming to kernel bootloaders, deterministic real-time operating systems (RTOS), and eBPF tracing.',
    icon: 'Cpu',
    accentColor: 'text-amber-500 border-amber-500/30 bg-amber-500/10',
    targetRoles: ['Real-Time Kernel Engineer', 'Embedded Systems Engineer', 'Robotics Software Engineer', 'Firmware Engineer'],
    stages: [
      {
        stageIndex: 1,
        level: 'Basic',
        name: 'Hardware Model, Assembly & Systems C',
        summary: 'Understand CPU execution cycles, silicon registers, C pointers, and machine assembly.',
        slugs: ['program-cosmos', 'risc-v-and-custom-silicon-open-hardware', 'c-and-c-systems-programming-memory-pointers', 'reverse-engineering-and-assembly-low-level-code'],
      },
      {
        stageIndex: 2,
        level: 'Intermediate',
        name: 'Operating System Internals & Memory Architecture',
        summary: 'Master CPU caches, virtual memory paging, process scheduling algorithms, and binary linking.',
        slugs: ['computer-architecture-cpu-caches', 'operating-systems-internals-processes-memory', 'memory-allocators-and-virtual-memory-malloc-paging', 'linkers-loaders-and-executables-elf-pe'],
      },
      {
        stageIndex: 3,
        level: 'Advanced',
        name: 'Kernel Boot, Determinism & Safe Concurrency',
        summary: 'Trace system bootloaders, configure deterministic real-time scheduling, and prevent hardware side-channels.',
        slugs: ['bootloader-and-kernel-boot-process-startup', 'real-time-operating-systems-rtos-and-determinism', 'rustviz', 'hardware-security-and-side-channel-attacks-spectre-meltdown'],
      },
      {
        stageIndex: 4,
        level: 'Expert',
        name: 'Kernel Observability, Verification & GPU Computing',
        summary: 'Hook kernel events with eBPF, formally verify mission-critical safety with TLA+, and leverage parallel GPU compute.',
        slugs: ['ebpf-and-low-level-observability-kernel-hooks-sandboxing', 'formal-methods-and-tla-the-math-of-correctness', 'gpu-architecture-and-parallelism-cuda-simd-shaders'],
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning Engineer',
    shortTitle: 'AI & ML',
    tagline: 'Linear Algebra, Deep Learning, Transformers, LLMs & Autonomous Agents',
    description:
      'Master the mathematical foundations of machine learning, neural architectures, PyTorch, transformers, production RAG pipelines, and multi-agent coordination.',
    icon: 'Brain',
    accentColor: 'text-purple-500 border-purple-500/30 bg-purple-500/10',
    targetRoles: ['AI Engineer', 'Machine Learning Systems Developer', 'LLM Solutions Architect'],
    stages: [
      {
        stageIndex: 1,
        level: 'Basic',
        name: 'Mathematical Foundations & Python for AI',
        summary: 'Build intuitive mastery of linear algebra, calculus, tensors, and numerical Python libraries.',
        slugs: ['aimathviz', 'python-for-ai-engineering', 'ai-engineering-foundations'],
      },
      {
        stageIndex: 2,
        level: 'Intermediate',
        name: 'Neural Networks & Deep Learning Systems',
        summary: 'Train neural architectures with backpropagation, PyTorch tensors, embeddings, and computer vision.',
        slugs: ['neural-network-fundamentals', 'pytorch-fundamentals', 'training-neural-networks', 'embeddings-and-representation-learning', 'computer-vision'],
      },
      {
        stageIndex: 3,
        level: 'Advanced',
        name: 'Transformers, Large Language Models & RAG',
        summary: 'Implement multi-head attention, LLM fine-tuning, retrieval-augmented generation, and vector indices.',
        slugs: ['natural-language-processing-foundations', 'transformer-architecture', 'large-language-models', 'rag-fundamentals', 'vector-databases-and-vector-indexes', 'prompt-engineering-and-context-engineering'],
      },
      {
        stageIndex: 4,
        level: 'Expert',
        name: 'AI Agents, Evaluation & GPU Infrastructure',
        summary: 'Orchestrate autonomous agent loops, standardize tool protocols via MCP, benchmark accuracy, and design AI systems.',
        slugs: ['ai-agent-fundamentals', 'mcp-and-ai-tool-protocols', 'ai-evaluation-and-evals', 'gpu-architecture-and-parallelism-cuda-simd-shaders', 'ai-system-design'],
      },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & Cloud Platform Engineer',
    shortTitle: 'DevOps & Cloud',
    tagline: 'Infrastructure as Code, Kubernetes, Cloud Scaling & Reliability Engineering',
    description:
      'From Git workflows, Linux command lines, and container runtimes to Kubernetes cluster orchestration, traffic throttling, chaos injection, and internal developer platforms.',
    icon: 'Workflow',
    accentColor: 'text-teal-500 border-teal-500/30 bg-teal-500/10',
    targetRoles: ['Platform Engineer', 'DevOps Specialist', 'Site Reliability Engineer (SRE)', 'Cloud Architect'],
    stages: [
      {
        stageIndex: 1,
        level: 'Basic',
        name: 'Version Control, Protocols & Systems Basics',
        summary: 'Master Git internals, commit graphs, network communication protocols, and execution models.',
        slugs: ['gitcosmos', 'webprotocols', 'program-cosmos'],
      },
      {
        stageIndex: 2,
        level: 'Intermediate',
        name: 'Containers, Orchestration & Cloud Architecture',
        summary: 'Package microservices with Docker, schedule workloads with Kubernetes, and architect cloud topologies.',
        slugs: ['dockercosmos', 'k8scosmos', 'cloudcosmos', 'loadbalancing'],
      },
      {
        stageIndex: 3,
        level: 'Advanced',
        name: 'Observability, Security & Reliability (SRE)',
        summary: 'Implement automated traffic rate limiting, telemetry pipelines, secrets encryption, and SLO/SLI tracking.',
        slugs: ['rate-limiting-throttling', 'observability-systems-logs-metrics', 'secrets-management', 'site-reliability-engineering-slis-slos'],
      },
      {
        stageIndex: 4,
        level: 'Expert',
        name: 'Kernel Tracing, Chaos & Developer Platforms',
        summary: 'Profile live clusters with eBPF probes, inject controlled failures, and build standardized internal portals.',
        slugs: ['ebpf-and-low-level-observability-kernel-hooks-sandboxing', 'chaos-engineering-failure-injection', 'platform-engineering-and-internal-developer-portals-idps'],
      },
    ],
  },
  {
    id: 'security',
    title: 'Cybersecurity & Systems Defense',
    shortTitle: 'Cybersecurity',
    tagline: 'Threat Modeling, Cryptography, Reverse Engineering & Low-Level Exploits',
    description:
      'From web attack vectors and authentication mechanics to zero-trust perimeters, cryptography, binary reverse engineering, and hardware side-channel defense.',
    icon: 'ShieldCheck',
    accentColor: 'text-rose-500 border-rose-500/30 bg-rose-500/10',
    targetRoles: ['Security Engineer', 'Application Security Specialist', 'Penetration Tester', 'Reverse Engineer'],
    stages: [
      {
        stageIndex: 1,
        level: 'Basic',
        name: 'Web Security & Network Protocols',
        summary: 'Identify common web vulnerabilities (XSS, CSRF), secure HTTP headers, and authentication flows.',
        slugs: ['websecurity', 'webprotocols', 'authviz'],
      },
      {
        stageIndex: 2,
        level: 'Intermediate',
        name: 'Zero-Trust Architecture & Cryptography',
        summary: 'Implement identity perimeters, design threat models, analyze cryptographic primitives, and inspect traffic.',
        slugs: ['zero-trust-architecture-and-iam', 'security-engineering-threat-models', 'cryptviz', 'network-defense-and-traffic-analysis-wireshark-firewalls'],
      },
      {
        stageIndex: 3,
        level: 'Advanced',
        name: 'Reverse Engineering, Malware & Red Teaming',
        summary: 'Disassemble x86/ARM binaries, inspect sandbox execution, trace attack vectors, and run digital forensics.',
        slugs: ['reverse-engineering-and-assembly-low-level-code', 'malware-analysis-and-sandbox-internals', 'penetration-testing-and-red-teaming-exploits-c2', 'digital-forensics-and-incident-response-dfir'],
      },
      {
        stageIndex: 4,
        level: 'Expert',
        name: 'Hardware Side-Channels & Next-Gen Cryptography',
        summary: 'Mitigate speculative execution CPU flaws (Spectre/Meltdown), analyze RF signals, and prepare for quantum crypto.',
        slugs: ['hardware-security-and-side-channel-attacks-spectre-meltdown', 'software-defined-radio-sdr-and-signal-hacking', 'post-quantum-cryptography-lattice-based-dilithium'],
      },
    ],
  },
  {
    id: 'corecs',
    title: 'Core CS & Problem Solving',
    shortTitle: 'Core CS',
    tagline: 'Data Structures, Computational Theory, Compilers & Quantum Circuits',
    description:
      'The timeless foundations of computer science: algorithmic analysis, operating systems, compiler pipelines, automata theory, and quantum logic.',
    icon: 'Terminal',
    accentColor: 'text-violet-500 border-violet-500/30 bg-violet-500/10',
    targetRoles: ['Computer Scientist', 'Algorithms Engineer', 'Systems Software Specialist', 'Compilers Engineer'],
    stages: [
      {
        stageIndex: 1,
        level: 'Basic',
        name: 'Execution Mechanics & Fundamental Algorithms',
        summary: 'Understand memory models, sequential instruction execution, and array/string manipulation.',
        slugs: ['program-cosmos', 'arrayviz', 'stringalgoviz'],
      },
      {
        stageIndex: 2,
        level: 'Intermediate',
        name: 'Database Engines, Networks & Operating Systems',
        summary: 'Explore relational storage indexes, TCP/IP socket mechanics, and kernel process management.',
        slugs: ['database-internals-indexes-transactions', 'computer-networks-internals-tcpip', 'operating-systems-internals-processes-memory'],
      },
      {
        stageIndex: 3,
        level: 'Advanced',
        name: 'Compilers, Formal Languages & Quantum Computing',
        summary: 'Build ASTs and bytecode interpreters, study Turing automata complexity, and simulate quantum logic gates.',
        slugs: ['compilers-and-runtime-internals-ast-bytecode', 'theory-of-computation-automata-languages-complexity', 'quantum-computing-internals-qubits-gates-circuits'],
      },
      {
        stageIndex: 4,
        level: 'Expert',
        name: 'Custom Silicon, Formal Proofs & Parallel SIMD',
        summary: 'Design RISC-V hardware architectures, write formal mathematical specs with TLA+, and parallelize on GPUs.',
        slugs: ['risc-v-and-custom-silicon-open-hardware', 'formal-methods-and-tla-the-math-of-correctness', 'gpu-architecture-and-parallelism-cuda-simd-shaders'],
      },
    ],
  },
];

const topicMap = new Map<string, Topic>(topics.map((t) => [t.slug, t]));

export function getRoleRoadmap(roleId: string): RoleRoadmap | undefined {
  return ROLE_ROADMAPS.find((r) => r.id === roleId);
}

export function getEnrichedStages(role: RoleRoadmap) {
  let stepCounter = 1;
  return role.stages.map((stage) => {
    const stageTopics = stage.slugs
      .map((slug) => topicMap.get(slug))
      .filter((t): t is Topic => Boolean(t))
      .map((topic) => ({
        ...topic,
        stepNumber: stepCounter++,
      }));

    const stageMinutes = stageTopics.reduce((acc, t) => acc + t.estimatedMinutes, 0);
    const activeEngines = stageTopics.filter((t) => t.status === 'active').length;

    return {
      ...stage,
      topics: stageTopics,
      totalMinutes: stageMinutes,
      activeEngines,
    };
  });
}
