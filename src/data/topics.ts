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
    createTopic("How Programs Execute (CPU, Memory, I/O)", "fullstack", { status: 'active', url: "https://programviz.vercel.app" }),
    createTopic("HTML & Accessibility (Semantics, ARIA)", "fullstack", { status: 'active', url: "https://htmlviz.vercel.app" }),
    createTopic("CSS Visualizer (Box Model, Flexbox, Grid)", "fullstack", { status: 'active', url: "https://cssviz.vercel.app" }),
    createTopic("JavaScript Visualizer (Execution, Async, Memory)", "fullstack", { status: 'active', url: "https://jsviz.vercel.app/" }),
    createTopic("TypeScript Visualizer (Types, Inference, Compiler)", "fullstack", { status: 'active', url: "https://tsviz.vercel.app/" }),
    createTopic("Browser Internals (DOM, Rendering, Storage)", "fullstack", { status: 'active', url: "https://browseruniverse.vercel.app/" }),
    createTopic("Web Security (XSS, CSRF, CSP, CORS)", "fullstack", { status: 'active', url: "https://websecureviz.vercel.app" }),
    createTopic("HTTP & Web Protocols (Headers, Caching)", "fullstack", { status: 'active', url: "https://webprotocols.vercel.app" }),
    createTopic("API Design (REST, GraphQL)", "fullstack" , { status: 'active', url: "https://apiviz.vercel.app" }),
    createTopic("Authentication & Authorization (JWT, OAuth2)", "fullstack" , { status: 'active', url: "https://authviz.vercel.app" }),
    createTopic("React Visualizer (Hooks, Reconciliation)", "fullstack"),
    createTopic("Next.js Visualizer (Routing, SSR, RSC)", "fullstack"),
    createTopic("Vue Visualizer (Reactivity, Templates)", "fullstack"),
    createTopic("Svelte / SvelteKit Visualizer (Compiler, Reactivity)", "fullstack"),
    createTopic("TailwindCSS Playground (Utility-First CSS)", "fullstack"),
    createTopic("Node.js Runtime (Event Loop, libuv)", "fullstack"),
    createTopic("Go Backend Internals (Goroutines, Memory)", "fullstack", { status: 'active', url: "https://golangviz.vercel.app" }),
    createTopic("Rust Backend Internals (Ownership, Concurrency)", "fullstack"),
    createTopic("Python FastAPI Backend (Async, Dependency Injection)", "fullstack"),
    createTopic("SQL Visualizer (Queries, Indexes)", "fullstack"),
    createTopic("MongoDB Visualizer (Documents, Aggregation)", "fullstack"),
    createTopic("Redis Visualizer (Caching, Data Structures)", "fullstack", { status: 'active', url: "https://redisviz.vercel.app" }),
    createTopic("Message Queues Visualizer (Pub/Sub, Retries)", "fullstack"),
    createTopic("Microservices Architecture (Services, Failures)", "fullstack"),
    createTopic("System Design & Scalability (Caching, Sharding)", "fullstack"),

    // Data Structures & Algorithms
    createTopic("Array Visualizer (Memory, Indexing)", "dsa", { status: 'active', url: "https://arrayviz.vercel.app/" }),
    createTopic("String Algorithms (Encoding, Patterns)", "dsa"),
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
    createTopic("Matrix Exponentiation (Fast Power)", "dsa"),
    createTopic("Computational Geometry (Points, Lines)", "dsa"),
    createTopic("Randomized Algorithms (Probability)", "dsa"),
    createTopic("Approximation Algorithms (Near-Optimal)", "dsa"),
    createTopic("NP-Completeness (Reductions)", "dsa"),

    // Web3 & Blockchain
    createTopic("Blockchain Fundamentals (Blocks, Transactions)", "web3" , { status: 'active', url: "https://blockchainviz.vercel.app" }),
    createTopic("Cryptography Fundamentals (Hashing, Signatures)", "web3" , { status: 'active', url: "https://cryptviz.vercel.app" }),
    createTopic("Merkle Tree Visualizer (Integrity)", "web3" , { status: 'active', url: "https://merkletreeviz.vercel.app" }),
    createTopic("Patricia Trie Visualizer (State Storage)", "web3" , { status: 'active', url: "https://patriciatrie.vercel.app" }),
    createTopic("Blockchain Consensus (PoW, PoS)", "web3"),
    createTopic("Blockchain P2P Networking (Gossip)", "web3"),
    createTopic("EVM Internals (Storage, Execution)", "web3"),
    createTopic("Solidity Smart Contracts (EVM Logic)", "web3", { status: 'active', url: "https://solidityviz.vercel.app" }),
    createTopic("Solana / Rust Contracts (Parallel Execution)", "web3"),
    createTopic("Smart Contract Security (Attacks, Defenses)", "web3"),
    createTopic("MEV & Blockchain Attacks (Front-Running)", "web3"),
    createTopic("Layer-2 Rollups (Optimistic, ZK)", "web3"),
    createTopic("Zero-Knowledge Proofs (Privacy)", "web3"),
    createTopic("Account Abstraction (Smart Accounts)", "web3"),
    createTopic("Cross-Chain Bridges (Interoperability)", "web3"),
    createTopic("Light Clients (Verification)", "web3"),
    createTopic("DAOs & Tokenomics (Governance)", "web3"),

    // Artificial Intelligence
    createTopic("Math for Machine Learning (Linear Algebra, Probability)", "ai"),
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

    // Core Computer Science
    createTopic("Operating Systems Internals (Processes, Memory)", "corecs"),
    createTopic("Computer Architecture (CPU, Caches)", "corecs"),
    createTopic("Computer Networks Internals (TCP/IP)", "corecs"),
    createTopic("Database Internals (Indexes, Transactions)", "corecs"),
    createTopic("Compilers & Runtime Internals (AST, Bytecode)", "corecs"),

    // DevOps / Cloud / Engineering
    createTopic("Git & Version Control (Commits, Branches)", "devops"),
    createTopic("Docker & Containers (Isolation)", "devops"),
    createTopic("Kubernetes & Orchestration (Scheduling)", "devops"),
    createTopic("Cloud Architecture Visualizer (AWS, Scaling)", "devops"),
    createTopic("CI/CD Pipeline Visualizer (Build, Deploy)", "devops"),
    createTopic("Infrastructure as Code (Terraform)", "devops"),
    createTopic("Load Balancing (Traffic Distribution)", "devops"),
    createTopic("Rate Limiting (Throttling)", "devops"),
    createTopic("Observability Systems (Logs, Metrics)", "devops"),
    createTopic("Site Reliability Engineering (SLIs, SLOs)", "devops"),
    createTopic("Disaster Recovery (Backups)", "devops"),
    createTopic("Chaos Engineering (Failure Injection)", "devops"),

    // Advanced Engineering & Systems
    createTopic("Distributed Systems Visualizer (Replication, Consistency)", "advanced"),
    createTopic("Event Sourcing & CQRS (Write/Read Models)", "advanced"),
    createTopic("Streaming Systems (Event Time)", "advanced"),
    createTopic("Security Engineering (Threat Models)", "advanced"),
    createTopic("Performance Engineering (Profiling)", "advanced"),
    createTopic("Reverse Engineering & Assembly (Low-Level Code)", "advanced"),
    createTopic("Bootloader & Kernel Boot Process (Startup)", "advanced"),
    createTopic("Formal Verification (Program Correctness)", "advanced"),
];
