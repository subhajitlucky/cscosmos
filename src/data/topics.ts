import type { DomainKey } from './domains';

export interface Topic {
    id: number;
    name: string;
    domain: DomainKey;
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
}

const createTopic = (name: string, domain: DomainKey, options?: TopicOptions): Topic => ({
    id: idCounter++,
    name,
    domain,
    slug: slugify(name),
    shortDescription: `Interactive visualization and learning module for ${name}.`,
    status: options?.status ?? 'coming-soon',
    url: options?.url,
});

export const topics: Topic[] = [
    // Full Stack Development
    // 1. Foundations
    createTopic("How Programs Execute (CPU, Memory, I/O)", "fullstack", { status: 'active', url: "https://programviz.vercel.app" }),
    createTopic("HTTP & Web Protocols (Headers, Caching)", "fullstack", { status: 'active', url: "https://webprotocols.vercel.app" }),
    createTopic("Web Security (XSS, CSRF, CSP, CORS)", "fullstack", { status: 'active', url: "https://websecureviz.vercel.app" }),
    createTopic("HTML & Accessibility (Semantics, ARIA)", "fullstack", { status: 'active', url: "https://htmlviz.vercel.app" }),
    createTopic("CSS Visualizer (Box Model, Flexbox, Grid)", "fullstack", { status: 'active', url: "https://cssviz.vercel.app" }),
    createTopic("JavaScript Visualizer (Execution, Async, Memory)", "fullstack", { status: 'active', url: "https://jsviz.vercel.app/" }),
    createTopic("TypeScript Visualizer (Types, Inference, Compiler)", "fullstack", { status: 'active', url: "https://tsviz.vercel.app/" }),
    createTopic("Browser Internals (DOM, Rendering, Storage)", "fullstack", { status: 'active', url: "https://browseruniverse.vercel.app/" }),

    // 2. Frontend Engineering
    createTopic("React Visualizer (Hooks, Reconciliation)", "fullstack" , { status: 'active', url: "https://reactcosmos.vercel.app/" }),
    createTopic("Next.js Visualizer (Routing, SSR, RSC)", "fullstack" , { status: 'active', url: "https://nextjscosmos.vercel.app/" }),
    createTopic("Vue Visualizer (Reactivity, Templates)", "fullstack"),
    createTopic("Svelte / SvelteKit Visualizer (Compiler, Reactivity)", "fullstack"),
    createTopic("TailwindCSS Playground (Utility-First CSS)", "fullstack"),
    createTopic("WebAssembly Internals (Wasm & Linear Memory)", "fullstack"),
    createTopic("Spatial Computing & XR (3D UI, WebXR)", "fullstack"),
    createTopic("Cross-Platform Internals (React Native Bridge vs Skia)", "fullstack"),

    // 3. Backend & Runtime
    createTopic("Node.js Runtime (Event Loop, libuv)", "fullstack" , { status: 'active', url: "https://nodecosmos.vercel.app" }),
    createTopic("Go Backend Internals (Goroutines, Memory)", "fullstack", { status: 'active', url: "https://golangviz.vercel.app" }),
    createTopic("Rust Backend Internals (Ownership, Concurrency)", "fullstack" , { status: 'active', url: "https://rustviz.vercel.app" }),
    createTopic("Python FastAPI Backend (Async, Dependency Injection)", "fullstack"),
    createTopic("API Design (REST, GraphQL)", "fullstack" , { status: 'active', url: "https://apiviz.vercel.app" }),
    createTopic("Authentication & Authorization (JWT, OAuth2)", "fullstack" , { status: 'active', url: "https://authviz.vercel.app" }),

    // 4. Data & State
    createTopic("SQL Visualizer (Queries, Indexes)", "fullstack", { status: 'active', url: "https://sqlcosomos.vercel.app" }),
    createTopic("MongoDB Visualizer (Documents, Aggregation)", "fullstack"),
    createTopic("Redis Visualizer (Caching, Data Structures)", "fullstack", { status: 'active', url: "https://redisviz.vercel.app" }),
    createTopic("Real-Time Sync Algorithms (CRDTs & OT)", "fullstack"),

    // 5. Architecture & Scale
    createTopic("Message Queues Visualizer (Pub/Sub, Retries)", "fullstack"),
    createTopic("Microservices Architecture (Services, Failures)", "fullstack"),
    createTopic("Object-Oriented Design & Patterns (SOLID, LLD)", "fullstack"),
    createTopic("System Design & Scalability (Caching, Sharding)", "fullstack"),
    createTopic("AI Application Engineering (RAG, Agents, Vector Search)", "fullstack"),
    createTopic("Testing & Quality Engineering (TDD, BDD, Property-Based)", "fullstack"),

    // Data Structures & Algorithms
    createTopic("Array Visualizer (Memory, Indexing)", "dsa", { status: 'active', url: "https://arrayviz.vercel.app/" }),
    createTopic("String Algorithms (Encoding, Patterns)", "dsa" , { status: 'active', url: "https://stringalgoviz.vercel.app/" }),
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
    createTopic("Blockchain Fundamentals (Blocks, Transactions)", "web3" , { status: 'active', url: "https://blockchainviz.vercel.app" }),
    createTopic("Cryptography Fundamentals (Hashing, Signatures)", "web3" , { status: 'active', url: "https://cryptviz.vercel.app" }),
    createTopic("Merkle Tree Visualizer (Integrity)", "web3" , { status: 'active', url: "https://merkletreeviz.vercel.app" }),
    createTopic("Patricia Trie Visualizer (State Storage)", "web3" , { status: 'active', url: "https://patriciatrie.vercel.app" }),
    createTopic("Blockchain Consensus (PoW, PoS)", "web3" , { status: 'active', url: "https://consensusviz.vercel.app" }),
    createTopic("Blockchain P2P Networking (Gossip)", "web3" , { status: 'active', url: "https://ptopblockchain.vercel.app" }),
    createTopic("EVM Internals (Storage, Execution)", "web3" , { status: 'active', url: "https://evminternals.vercel.app" }),
    createTopic("Solidity Smart Contracts (EVM Logic)", "web3", { status: 'active', url: "https://solidityviz.vercel.app" }),
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

    // Cybersecurity & Ethical Hacking
    createTopic("Cryptography Fundamentals (Hashing, Signatures)", "security" , { status: 'active', url: "https://cryptviz.vercel.app" }),
    createTopic("Network Defense & Traffic Analysis (Wireshark, Firewalls)", "security"),
    createTopic("Software Defined Radio (SDR) & Signal Hacking", "security"),
    createTopic("Penetration Testing & Red Teaming (Exploits, C2)", "security"),
    createTopic("Digital Forensics & Incident Response (DFIR)", "security"),
    createTopic("Malware Analysis & Sandbox Internals", "security"),
    createTopic("Reverse Engineering & Assembly (Low-Level Code)", "security"),
    createTopic("Hardware Security & Side-Channel Attacks (Spectre, Meltdown)", "security"),
    createTopic("Zero Trust Architecture & IAM", "security"),
    createTopic("Software Supply Chain Security (SBOM, Sigstore, SLSA)", "security"),
    createTopic("Security Engineering (Threat Models)", "security"),

    // Artificial Intelligence
    createTopic("Math for Machine Learning (Linear Algebra, Probability)", "ai" , { status: 'active', url: "https://aimathviz.vercel.app" }),
    createTopic("Optimization Algorithms (Gradient Descent)", "ai"),
    createTopic("Machine Learning Fundamentals (Bias-Variance)", "ai"),
    createTopic("Decision Trees (Splits)", "ai"),
    createTopic("Random Forests (Ensembles)", "ai"),
    createTopic("Support Vector Machines (Margins)", "ai"),
    createTopic("Neural Networks (Backpropagation)", "ai"),
    createTopic("Convolutional Neural Networks (Filters)", "ai"),
    createTopic("Recurrent Neural Networks (Sequences)", "ai"),
    createTopic("Generative Adversarial Networks (Adversarial Training)", "ai"),
    createTopic("Diffusion Models (Noise Removal)", "ai"),
    createTopic("Reinforcement Learning (Agents, Rewards)", "ai"),
    createTopic("Transformers & Attention (Self-Attention)", "ai"),
    createTopic("LLM Systems (Tokenizers, RAG, Vector DBs)", "ai"),
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
    createTopic("Git & Version Control (Commits, Branches)", "devops" , { status: 'active', url: "https://gitcosmos.vercel.app" }),
    createTopic("Docker & Containers (Isolation)", "devops" , { status: 'active', url: "https://dockercosmos.vercel.app" }),
    createTopic("Kubernetes & Orchestration (Scheduling)", "devops" , { status: 'active', url: "https://k8scosmos.vercel.app" }),
    createTopic("Cloud Architecture Visualizer (AWS, Scaling)", "devops" , { status: 'active', url: "https://cloudcosmos.vercel.app" }),
    createTopic("CI/CD Pipeline Visualizer (Build, Deploy)", "devops"),
    createTopic("Infrastructure as Code (Terraform)", "devops"),
    createTopic("Load Balancing (Traffic Distribution)", "devops" , { status: 'active', url: "https://loadbalancing.vercel.app" }),
    createTopic("Rate Limiting (Throttling)", "devops"),
    createTopic("Observability Systems (Logs, Metrics)", "devops"),
    createTopic("Site Reliability Engineering (SLIs, SLOs)", "devops"),
    createTopic("Disaster Recovery (Backups)", "devops"),
    createTopic("Chaos Engineering (Failure Injection)", "devops"),
    createTopic("eBPF & Low-Level Observability (Kernel Hooks, Sandboxing)", "devops"),
    createTopic("Software Supply Chain Security (SBOM, Sigstore, SLSA)", "devops"),
    createTopic("FinOps & Cloud Economics (Cost Optimization, Carbon Tracking)", "devops"),
    createTopic("Platform Engineering & Internal Developer Portals (IDPs)", "devops"),

    // Advanced Engineering & Systems
    createTopic("Distributed Systems Visualizer (Replication, Consistency)", "advanced"),
    createTopic("Event Sourcing & CQRS (Write/Read Models)", "advanced"),
    createTopic("Streaming Systems (Event Time)", "advanced"),
    createTopic("Security Engineering (Threat Models)", "advanced"),
    createTopic("Performance Engineering (Profiling)", "advanced"),
    createTopic("Functional Programming (Category Theory, Immutability)", "advanced"),
    createTopic("Computer Graphics & Physics (Raytracing, Engines)", "advanced"),
    createTopic("Reverse Engineering & Assembly (Low-Level Code)", "advanced"),
    createTopic("Bootloader & Kernel Boot Process (Startup)", "advanced"),
    createTopic("Real-Time Operating Systems (RTOS) & Determinism", "advanced"),
    createTopic("Consensus Protocols (Raft, Paxos, Zab)", "advanced"),
    createTopic("Hardware Security & Side-Channel Attacks (Spectre, Meltdown)", "advanced"),
    createTopic("Agent-Based Simulation (Digital Twins, City Simulation)", "advanced"),
];
