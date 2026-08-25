import type { DomainKey } from './domains';

export interface Topic {
    id: number;
    name: string;
    domain: DomainKey;
    /** Extra domains this topic is cross-listed under (tag-based cross-listing). */
    aliases?: DomainKey[];
    shortDescription: string;
    slug: string;
    status: 'coming-soon' | 'active'; // Future proofing
    url?: string;
}

let idCounter = 1;

const slugify = (name: string) =>
    name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

type TopicOptions = {
    status?: Topic['status'];
    url?: string;
    slug?: string;
    aliases?: DomainKey[];
}

const createTopic = (name: string, domain: DomainKey, options?: TopicOptions): Topic => {
    const slug = options?.slug ?? slugify(name);
    const status = options?.status ?? 'coming-soon';
    return {
        id: idCounter++,
        name,
        domain,
        aliases: options?.aliases,
        slug,
        shortDescription: `Interactive visualization and learning module for ${name}.`,
        status,
        url: status === 'active' ? (options?.url ?? `/learn/${slug}`) : undefined,
    };
};

export const topics: Topic[] = [
    // Full Stack Development
    // 1. Foundations
    createTopic("How Programs Execute (CPU, Memory, I/O)", "fullstack", { status: 'active', slug: 'program-cosmos', url: '/program-cosmos' }),
    createTopic("HTTP & Web Protocols (Headers, Caching)", "fullstack", { status: 'active', slug: 'webprotocols', url: '/webprotocols' }),
    createTopic("Web Security (XSS, CSRF, CSP, CORS)", "fullstack", { status: 'active', slug: 'websecurity', url: '/websecurity' }),
    createTopic("HTML & Accessibility (Semantics, ARIA)", "fullstack", { status: 'active', slug: 'html-cosmos', url: '/html-cosmos' }),
    createTopic("CSS Visualizer (Box Model, Flexbox, Grid)", "fullstack", { status: 'active', slug: 'css-cosmos', url: '/css-cosmos' }),
    createTopic("JavaScript Visualizer (Execution, Async, Memory)", "fullstack", { status: 'active', slug: 'jsviz', url: '/jsviz' }),
    createTopic("TypeScript Visualizer (Types, Inference, Compiler)", "fullstack", { status: 'active', slug: 'tsviz', url: '/tsviz' }),
    createTopic("Browser Internals (DOM, Rendering, Storage)", "fullstack", { status: 'active', slug: 'browseruniverse', url: '/browseruniverse' }),

    // 2. Frontend Engineering
    createTopic("React Visualizer (Hooks, Reconciliation)", "fullstack" , { status: 'active', url: "/reactcosmos" }),
    createTopic("Next.js Visualizer (Routing, SSR, RSC)", "fullstack" , { status: 'active', url: "/nextjscosmos" }),
    createTopic("Vue Visualizer (Reactivity, Templates)", "fullstack", { status: 'active', slug: 'vuecosmos', url: '/vuecosmos' }),
    createTopic("Svelte / SvelteKit Visualizer (Compiler, Reactivity)", "fullstack", { status: 'active', slug: 'sveltecosmos', url: '/sveltecosmos' }),
    createTopic("TailwindCSS Playground (Utility-First CSS)", "fullstack", { status: 'active', slug: 'tailwindcosmos', url: '/tailwindcosmos' }),
    createTopic("WebAssembly Internals (Wasm & Linear Memory)", "fullstack", { status: 'active', slug: 'wasmcosmos', url: '/wasmcosmos' }),
    createTopic("Spatial Computing & XR (3D UI, WebXR)", "fullstack", { status: 'active', slug: 'xrcosmos', url: '/xrcosmos' }),
    createTopic("Cross-Platform Internals (React Native Bridge vs Skia)", "fullstack", { status: 'active', slug: 'crossplatformviz', url: '/crossplatformviz' }),

    // 3. Backend & Runtime
    createTopic("Node.js Runtime (Event Loop, libuv)", "fullstack" , { status: 'active', slug: 'nodecosmos', url: '/nodecosmos' }),
    createTopic("Go Backend Internals (Goroutines, Memory)", "fullstack", { status: 'active', slug: 'golangviz', url: '/golangviz' }),
    createTopic("Rust Backend Internals (Ownership, Concurrency)", "fullstack", { status: 'active', slug: 'rustviz', url: '/rustviz' }),
    createTopic("Python FastAPI Backend (Async, Dependency Injection)", "fullstack", { status: 'active', slug: 'fastapicosmos', url: '/fastapicosmos' }),
    createTopic("API Design (REST, GraphQL)", "fullstack" , { status: 'active', slug: 'apiviz', url: '/apiviz' }),
    createTopic("Authentication & Authorization (JWT, OAuth2)", "fullstack" , { status: 'active', slug: 'authviz', url: '/authviz' }),

    // 4. Data & State
    createTopic("SQL Visualizer (Queries, Indexes)", "fullstack", { status: 'active', slug: 'sqlcosmos', url: '/sqlcosmos' }),
    createTopic("MongoDB Visualizer (Documents, Aggregation)", "fullstack", { status: 'active', slug: 'mongocosmos', url: '/mongocosmos' }),
    createTopic("Redis Visualizer (Caching, Data Structures)", "fullstack", { status: 'active', slug: 'redisviz', url: '/redisviz' }),
    createTopic("Real-Time Sync Algorithms (CRDTs & OT)", "fullstack", { status: 'active', slug: 'synccosmos', url: '/synccosmos' }),

    // 5. Architecture & Scale
    createTopic("Docker & Kubernetes Visualizer (Containers, Pods)", "fullstack", { status: 'active', slug: 'dockercosmos', url: '/dockercosmos' }),
    createTopic("Message Queues Visualizer (Pub/Sub, Retries)", "fullstack", { status: 'active', slug: 'mqviz', url: '/mqviz' }),
    createTopic("Microservices Architecture (Services, Failures)", "fullstack", { status: 'active', slug: 'microservicesviz', url: '/microservicesviz' }),
    createTopic("Object-Oriented Design & Patterns (SOLID, LLD)", "fullstack", { status: 'active', slug: 'lldcosmos', url: '/lldcosmos' }),
    createTopic("System Design & Scalability (Caching, Sharding)", "fullstack", { status: 'active', slug: 'systemdesignviz', url: '/systemdesignviz' }),
    createTopic("AI Application Engineering (RAG, Agents, Vector Search)", "fullstack", { status: 'active', slug: 'aicosmos', url: '/aicosmos' }),
    createTopic("Testing & Quality Engineering (TDD, BDD, Property-Based)", "fullstack"),

    // Data Structures & Algorithms
    createTopic("Array Visualizer (Memory, Indexing)", "dsa", { status: 'active', slug: 'arrayviz', url: '/arrayviz' }),
    createTopic("String Algorithms (Encoding, Patterns)", "dsa" , { status: 'active', slug: 'stringalgoviz', url: '/stringalgoviz' }),
    createTopic("Stack Visualizer (LIFO, Call Stack)", "dsa"),
    createTopic("Queue Visualizer (FIFO, Scheduling)", "dsa"),
    createTopic("Linked List Visualizer (Pointers, Nodes)", "dsa"),
    createTopic("Sorting Algorithms (Stability, Complexity)", "dsa"),
    createTopic("Binary Search (Monotonic Search)", "dsa"),
    createTopic("Recursion Visualizer (Call Stack)", "dsa"),
    createTopic("Amortized Analysis (Cost Models)", "dsa"),
    createTopic("Hash Table (Hashing, Collisions)", "dsa"),
    createTopic("Disjoint Set Union (Union-Find)", "dsa"),
    createTopic("Binary Tree (Traversal, Structure)", "dsa"),
    createTopic("Binary Search Tree (Ordering)", "dsa"),
    createTopic("AVL Tree (Self-Balancing)", "dsa"),
    createTopic("Red-Black Tree (Balancing Rules)", "dsa"),
    createTopic("Heap & Priority Queue (Heap Property)", "dsa"),
    createTopic("Graph Traversal BFS (Level Order)", "dsa"),
    createTopic("Graph Traversal DFS (Depth Order)", "dsa"),
    createTopic("Shortest Path Algorithms (Relaxation)", "dsa"),
    createTopic("Minimum Spanning Tree (Greedy Cuts)", "dsa"),
    createTopic("Strongly Connected Components (Graph Cycles)", "dsa"),
    createTopic("Dynamic Programming (State Transitions)", "dsa"),
    createTopic("Knapsack Problem (Constraints)", "dsa"),
    createTopic("String Dynamic Programming (Patterns)", "dsa"),
    createTopic("Segment Tree (Range Queries)", "dsa"),
    createTopic("Fenwick Tree / BIT (Prefix Sums)", "dsa"),
    createTopic("Trie (Prefix Tree)", "dsa"),
    createTopic("Suffix Array (String Indexing)", "dsa"),
    createTopic("Suffix Tree (Compressed Trie)", "dsa"),
    createTopic("Number Theory (GCD, Modulo)", "dsa"),
    createTopic("Bit Manipulation & Binary Arithmetic", "dsa"),
    createTopic("Matrix Exponentiation (Fast Power)", "dsa"),
    createTopic("Computational Geometry (Points, Lines)", "dsa"),
    createTopic("Randomized Algorithms (Probability)", "dsa"),
    createTopic("Approximation Algorithms (Near-Optimal)", "dsa"),
    createTopic("NP-Completeness (Reductions)", "dsa"),
    createTopic("Probabilistic Data Structures (Bloom Filters, HyperLogLog)", "dsa"),
    createTopic("Vector Indexing & Nearest Neighbors (HNSW, LSH, IVF)", "dsa"),
    createTopic("Succinct Data Structures (Roaring Bitmaps, Wavelet Trees)", "dsa"),
    createTopic("Streaming & Distributed Graph Algorithms (PageRank, Louvain, GNNs)", "dsa"),

    // Web3 & Blockchain
    createTopic("Blockchain Fundamentals (Blocks, Transactions)", "web3" , { status: 'active', slug: 'blockchainviz', url: '/blockchainviz' }),
    createTopic("Cryptography Fundamentals (Hashing, Signatures)", "web3", { status: 'active', slug: 'cryptviz', url: '/cryptviz', aliases: ['security'] }),
    createTopic("Merkle Tree Visualizer (Integrity)", "web3" , { status: 'active', slug: 'merkletreeviz', url: '/merkletreeviz' }),
    createTopic("Patricia Trie Visualizer (State Storage)", "web3" , { status: 'active', slug: 'patriciatrie', url: '/patriciatrie' }),
    createTopic("Blockchain Consensus (PoW, PoS)", "web3" , { status: 'active', slug: 'consensusviz', url: '/consensusviz' }),
    createTopic("Blockchain P2P Networking (Gossip)", "web3" , { status: 'active', slug: 'ptopblockchain', url: '/ptopblockchain' }),
    createTopic("EVM Internals (Storage, Execution)", "web3" , { status: 'active', slug: 'evminternals', url: '/evminternals' }),
    createTopic("Solidity Smart Contracts (EVM Logic)", "web3", { status: 'active', slug: 'solidityviz', url: '/solidityviz' }),
    createTopic("Move Language (Resource-Oriented Programming & Safety)", "web3"),
    createTopic("Solana / Rust Contracts (Parallel Execution)", "web3"),
    createTopic("Smart Contract Security (Attacks, Defenses)", "web3"),
    createTopic("MEV & Blockchain Attacks (Front-Running)", "web3"),
    createTopic("Layer-2 Rollups (Optimistic, ZK)", "web3"),
    createTopic("Zero-Knowledge Proofs & ZKML (Verifiable Compute)", "web3"),
    createTopic("Account Abstraction (Smart Accounts)", "web3"),
    createTopic("Cross-Chain Bridges (Interoperability)", "web3"),
    createTopic("Light Clients (Verification)", "web3"),
    createTopic("DAOs & Tokenomics (Governance)", "web3"),
    createTopic("Fully Homomorphic Encryption (FHE & Confidential Computing)", "web3"),
    createTopic("Post-Quantum Cryptography (Lattice-based, Dilithium)", "web3"),
    createTopic("Shared Security & Restaking (EigenLayer & AVS)", "web3"),
    createTopic("DePIN (Decentralized Physical Infrastructure Networks)", "web3"),

    // Cybersecurity & Ethical Hacking    createTopic("Network Defense & Traffic Analysis (Wireshark, Firewalls)", "security"),
    createTopic("Software Defined Radio (SDR) & Signal Hacking", "security", { status: 'active', slug: 'software-defined-radio-sdr-and-signal-hacking', url: '/software-defined-radio-sdr-and-signal-hacking' }),
    createTopic("Penetration Testing & Red Teaming (Exploits, C2)", "security", { status: 'active', slug: 'penetration-testing-and-red-teaming-exploits-c2', url: '/penetration-testing-and-red-teaming-exploits-c2' }),
    createTopic("Digital Forensics & Incident Response (DFIR)", "security", { status: 'active', slug: 'digital-forensics-and-incident-response-dfir', url: '/digital-forensics-and-incident-response-dfir' }),
    createTopic("Malware Analysis & Sandbox Internals", "security"),
    createTopic("Reverse Engineering & Assembly (Low-Level Code)", "security", { status: 'active', slug: 'reverse-engineering-and-assembly-low-level-code', url: '/reverse-engineering-and-assembly-low-level-code', aliases: ['advanced'] }),
    createTopic("Hardware Security & Side-Channel Attacks (Spectre, Meltdown)", "security", { aliases: ['advanced'] }),
    createTopic("Zero Trust Architecture & IAM", "security", { status: 'active', slug: 'zero-trust-architecture-and-iam', url: '/zero-trust-architecture-and-iam' }),
    createTopic("Software Supply Chain Security (SBOM, Sigstore, SLSA)", "security", { aliases: ['devops'] }),
    createTopic("Security Engineering (Threat Models)", "security", { status: 'active', slug: 'security-engineering-threat-models', url: '/security-engineering-threat-models', aliases: ['advanced'] }),

    // Artificial Intelligence
    createTopic("Math for Machine Learning (Linear Algebra, Probability)", "ai" , { status: 'active', slug: 'aimathviz', url: '/aimathviz' }),
    createTopic("Optimization Algorithms (Gradient Descent)", "ai", { status: 'active', url: '/aicosmos/nn-lab' }),
    createTopic("Machine Learning Fundamentals (Bias-Variance)", "ai", { status: 'active', url: '/aicosmos/nn-lab' }),
    createTopic("Decision Trees (Splits)", "ai"),
    createTopic("Random Forests (Ensembles)", "ai"),
    createTopic("Support Vector Machines (Margins)", "ai"),
    createTopic("Neural Networks (Backpropagation)", "ai", { status: 'active', url: '/aicosmos/nn-lab' }),
    createTopic("Convolutional Neural Networks (Filters)", "ai"),
    createTopic("Recurrent Neural Networks (Sequences)", "ai"),
    createTopic("Generative Adversarial Networks (Adversarial Training)", "ai"),
    createTopic("Diffusion Models (Noise Removal)", "ai"),
    createTopic("Reinforcement Learning (Agents, Rewards)", "ai", { status: 'active', url: '/aicosmos/agent-lab' }),
    createTopic("Transformers & Attention (Self-Attention)", "ai", { status: 'active', url: '/aicosmos/attention-lab' }),
    createTopic("LLM Systems (Tokenizers, RAG, Vector DBs)", "ai", { status: 'active', url: '/aicosmos/rag-lab' }),
    createTopic("ML Engineering (Training, Deployment)", "ai"),
    createTopic("Mojo & Python Internals (High-Performance AI Code)", "ai"),
    createTopic("World Models & Embodied AI (Sora, Tesla Bot, Robotics)", "ai"),
    createTopic("Mechanistic Interpretability (Opening the Black Box)", "ai"),
    createTopic("Adversarial Machine Learning (Fooling AI Vision)", "ai"),
    createTopic("Neuro-Symbolic AI (LLMs + Logic Engines)", "ai"),
    createTopic("Neuromorphic Computing & Spiking Neural Networks", "ai"),
    createTopic("Neural Implants & BCI (Neuralink, Decoding, High-Bandwidth)", "ai"),

    // Core Computer Science
    createTopic("Operating Systems Internals (Processes, Memory)", "corecs"),
    createTopic("Memory Allocators & Virtual Memory (Malloc, Paging)", "corecs"),
    createTopic("Linkers, Loaders & Executables (ELF, PE)", "corecs"),
    createTopic("C & C++ Systems Programming (Memory, Pointers)", "corecs"),
    createTopic("Java & JVM Internals (Garbage Collection, Bytecode)", "corecs"),
    createTopic("Computer Architecture (CPU, Caches)", "corecs"),
    createTopic("Computer Networks Internals (TCP/IP)", "corecs"),
    createTopic("Database Internals (Indexes, Transactions)", "corecs"),
    createTopic("Compilers & Runtime Internals (AST, Bytecode)", "corecs"),
    createTopic("Theory of Computation (Automata, Languages, Complexity)", "corecs"),
    createTopic("Quantum Computing Internals (Qubits, Gates, Circuits)", "corecs"),
    createTopic("DNA Storage & Molecular Computing", "corecs"),
    createTopic("Computational Biology & Bioinformatics (CRISPR, AlphaFold)", "corecs"),
    createTopic("GPU Architecture & Parallelism (CUDA, SIMD, Shaders)", "corecs"),
    createTopic("RISC-V & Custom Silicon (Open Hardware)", "corecs"),
    createTopic("Formal Methods & TLA+ (The Math of Correctness)", "corecs"),

    // DevOps / Cloud / Engineering
    createTopic("Git & Version Control (Commits, Branches)", "devops" , { status: 'active', slug: 'gitcosmos', url: '/gitcosmos' }),
    createTopic("Docker & Containers (Isolation)", "devops" , { status: 'active', slug: 'dockercosmos', url: '/dockercosmos' }),
    createTopic("Kubernetes & Orchestration (Scheduling)", "devops" , { status: 'active', slug: 'k8scosmos', url: '/k8scosmos' }),
    createTopic("Cloud Architecture Visualizer (AWS, Scaling)", "devops" , { status: 'active', slug: 'cloudcosmos', url: '/cloudcosmos' }),
    createTopic("CI/CD Pipeline Visualizer (Build, Deploy)", "devops"),
    createTopic("Infrastructure as Code (Terraform)", "devops"),
    createTopic("Load Balancing (Traffic Distribution)", "devops" , { status: 'active', slug: 'loadbalancing', url: '/loadbalancing' }),
    createTopic("Rate Limiting (Throttling)", "devops"),
    createTopic("Observability Systems (Logs, Metrics)", "devops"),
    createTopic("Site Reliability Engineering (SLIs, SLOs)", "devops"),
    createTopic("Disaster Recovery (Backups)", "devops"),
    createTopic("Chaos Engineering (Failure Injection)", "devops"),
    createTopic("eBPF & Low-Level Observability (Kernel Hooks, Sandboxing)", "devops"),    createTopic("FinOps & Cloud Economics (Cost Optimization, Carbon Tracking)", "devops"),
    createTopic("Platform Engineering & Internal Developer Portals (IDPs)", "devops"),

    // Advanced Engineering & Systems
    createTopic("Distributed Systems Visualizer (Replication, Consistency)", "advanced"),
    createTopic("Event Sourcing & CQRS (Write/Read Models)", "advanced"),
    createTopic("Streaming Systems (Event Time)", "advanced"),    createTopic("Performance Engineering (Profiling)", "advanced"),
    createTopic("Functional Programming (Category Theory, Immutability)", "advanced"),
    createTopic("Computer Graphics & Physics (Raytracing, Engines)", "advanced"),    createTopic("Bootloader & Kernel Boot Process (Startup)", "advanced"),
    createTopic("Real-Time Operating Systems (RTOS) & Determinism", "advanced"),
    createTopic("Consensus Protocols (Raft, Paxos, Zab)", "advanced"),    createTopic("Agent-Based Simulation (Digital Twins, City Simulation)", "advanced"),
];
