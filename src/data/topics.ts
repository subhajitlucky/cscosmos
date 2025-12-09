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
    createTopic("HTML & Accessibility Visualizer", "fullstack", { status: 'active', url: "https://htmlviz.vercel.app" }),
    createTopic("CSS Visualizer (Flexbox/Grid/Box Model)", "fullstack", { status: 'active', url: "https://cssviz.vercel.app" }),
    createTopic("JavaScript Deep Visualizer", "fullstack", { status: 'active', url: "https://jsviz.vercel.app/" }),
    createTopic("TypeScript Deep Dive + Compiler Visualizer", "fullstack", { status: 'active', url: "https://tsviz.vercel.app/" }),
    createTopic("DOM & Browser Internals Website", "fullstack"),
    createTopic("Responsive Design & Layout System Visualizer", "fullstack"),
    createTopic("React Visual Learning Website", "fullstack"),
    createTopic("Next.js Architecture + Rendering Visualizer", "fullstack"),
    createTopic("Vue Visual Explainer", "fullstack"),
    createTopic("Svelte/SvelteKit Visual Learning", "fullstack"),
    createTopic("TailwindCSS Visual Playground", "fullstack"),
    createTopic("Node.js Internals + Event Loop Visualizer", "fullstack"),
    createTopic("Express/Fastify Backend Playground", "fullstack"),
    createTopic("Golang Backend + Memory/Goroutine Visualizer", "fullstack", { status: 'active', url: "https://golangviz.vercel.app" }),
    createTopic("Rust Backend + Ownership/Borrow Checker Visualizer", "fullstack"),
    createTopic("Python FastAPI Backend Learning Site", "fullstack"),
    createTopic("GraphQL API Designer + Schema Visualizer", "fullstack"),
    createTopic("REST API Architecture Website", "fullstack"),
    createTopic("SQL Visualizer", "fullstack"),
    createTopic("NoSQL Playground (MongoDB)", "fullstack"),
    createTopic("Redis Visual Internals + Caching Website", "fullstack"),
    createTopic("Microservices Visualizer", "fullstack"),
    createTopic("Message Queue Visualizer", "fullstack"),
    createTopic("Complete System Design Visual Learning Website", "fullstack"),

    // Data Structures & Algorithms
    createTopic("Arrays & Strings Visualizer", "dsa", { status: 'active', url: "https://arrayviz.vercel.app/" }),
    createTopic("Stacks Visualizer", "dsa"),
    createTopic("Queues Visualizer", "dsa"),
    createTopic("Linked List Pointer Visualizer", "dsa"),
    createTopic("Binary Tree Traversal Visualizer", "dsa"),
    createTopic("Binary Search Tree Visualizer", "dsa"),
    createTopic("AVL / Red-Black Tree Visualizer", "dsa"),
    createTopic("Heap & Priority Queue Visualizer", "dsa"),
    createTopic("Segment Tree Visualizer", "dsa"),
    createTopic("Fenwick Tree (BIT) Visualizer", "dsa"),
    createTopic("Graph Explorer (BFS/DFS)", "dsa"),
    createTopic("Shortest Path Visualizer", "dsa"),
    createTopic("All-Pairs Path Visualizer (Floyd-Warshall)", "dsa"),
    createTopic("MST Visualizer", "dsa"),
    createTopic("SCC Visualizer", "dsa"),
    createTopic("DP Visualizer", "dsa"),
    createTopic("Knapsack Family Visualizer", "dsa"),
    createTopic("String DP Visualizer", "dsa"),
    createTopic("Number Theory Playground", "dsa"),
    createTopic("Matrix Exponentiation Visualizer", "dsa"),

    // Web3 & Blockchain
    createTopic("Solidity Visual Learning Site", "web3"),
    createTopic("Rust (Solana) Smart Contract Learning Site", "web3"),
    createTopic("EVM Storage Layout Visualizer", "web3"),
    createTopic("EVM Instruction Stepper & Debugger", "web3"),
    createTopic("Transaction Lifecycle Visualizer", "web3"),
    createTopic("Gas & Opcode Cost Visualizer", "web3"),
    createTopic("Blockchain Block Explorer Simulator", "web3"),
    createTopic("Merkle Tree / Patricia Trie Visualizer", "web3"),
    createTopic("Proof-of-Work Simulator", "web3"),
    createTopic("Proof-of-Stake Simulator", "web3"),
    createTopic("Layer-2 Rollups Visualizer", "web3"),
    createTopic("Smart Contract Security Playground", "web3"),
    createTopic("Attack Simulation Website", "web3"),
    createTopic("Hashing & Digital Signature Visualizer", "web3"),
    createTopic("Cryptography Fundamentals Visualizer", "web3"),
    createTopic("Zero-Knowledge Proofs Visualizer", "web3"),

    // Artificial Intelligence
    createTopic("Linear Algebra Visualizer", "ai"),
    createTopic("Probability & Statistics Visualizer", "ai"),
    createTopic("Optimization Algorithms Visualizer", "ai"),
    createTopic("ML Basics Website", "ai"),
    createTopic("Decision Trees + Random Forest Visualizer", "ai"),
    createTopic("SVM Visualizer", "ai"),
    createTopic("Feedforward Neural Network Visualizer", "ai"),
    createTopic("Backpropagation Visualizer", "ai"),
    createTopic("Activation Functions Playground", "ai"),
    createTopic("CNN Visualizer", "ai"),
    createTopic("RNN/LSTM/GRU Visualizer", "ai"),
    createTopic("GAN Visualizer", "ai"),
    createTopic("Self-Attention Visualizer", "ai"),
    createTopic("Multi-Head Attention Playground", "ai"),
    createTopic("Positional Encoding Visualizer", "ai"),
    createTopic("Transformer Encoder/Decoder Visualizer", "ai"),
    createTopic("Tokenizer Visualizer", "ai"),
    createTopic("LLM Training Process Visualizer", "ai"),
    createTopic("RAG Visualizer", "ai"),
    createTopic("Vector Database Visualizer", "ai"),
    createTopic("Reinforcement Learning Playground", "ai"),
    createTopic("Convolution Visualizer", "ai"),
    createTopic("Object Detection / YOLO Visualizer", "ai"),
    createTopic("End-to-end ML Pipeline Visualizer", "ai"),
    createTopic("Model Deployment & Monitoring Playground", "ai"),
    createTopic("Diffusion Models Visualizer", "ai"),

    // Core Computer Science
    createTopic("Process & Thread Visualizer", "corecs"),
    createTopic("Scheduling Algorithms Visualizer", "corecs"),
    createTopic("Virtual Memory & Paging Visualizer", "corecs"),
    createTopic("Deadlock & Synchronization Visualizer", "corecs"),
    createTopic("TCP Handshake Visualizer", "corecs"),
    createTopic("DNS Lookup Visualizer", "corecs"),
    createTopic("HTTP Lifecycle Visualizer", "corecs"),
    createTopic("SSL/TLS Handshake Visualizer", "corecs"),
    createTopic("Indexes & B+ Trees Visualizer", "corecs"),
    createTopic("Query Execution Planner Visualizer", "corecs"),
    createTopic("ACID & Isolation Levels Simulator", "corecs"),
    createTopic("Lexer/Parser → AST Visualizer", "corecs"),
    createTopic("Bytecode/IR Optimization Visualizer", "corecs"),
    createTopic("Replication & Sharding Visualizer", "corecs"),
    createTopic("Consensus Algorithm Visualizer", "corecs"),
    createTopic("Garbage Collector Internals Visualizer", "corecs"),
    createTopic("Memory Allocation & Heap Manager Visualizer", "corecs"),
    createTopic("Filesystem Internals Visualizer", "corecs"),
    createTopic("OS Security & Isolation Visualizer", "corecs"),
    createTopic("Network Routing & Packet Flow Visualizer", "corecs"),

    // DevOps / Cloud / Engineering
    createTopic("Git Commit/Branch/Rebase Visualizer", "devops"),
    createTopic("Docker Internals Visualizer", "devops"),
    createTopic("Kubernetes Visualizer", "devops"),
    createTopic("AWS Architecture Playground", "devops"),
    createTopic("Serverless Architecture Visualizer", "devops"),
    createTopic("Linux Internals Visualizer", "devops"),
    createTopic("Shell Commands Sandbox", "devops"),
    createTopic("CI/CD Pipeline Visualizer", "devops"),
    createTopic("Packaging & Build Tools Visualizer", "devops"),
    createTopic("API Documentation / OpenAPI Visualizer", "devops"),

    // Advanced Engineering & Systems
    createTopic("Reverse Engineering & Assembly Playground", "advanced"),
    createTopic("Cybersecurity Fundamentals Visualizer", "advanced"),
    createTopic("Testing & QA Automation Visualizer", "advanced"),
    createTopic("Software Architecture Patterns Visualizer", "advanced"),
    createTopic("Domain-Driven Design Visualizer", "advanced"),
    createTopic("API Authentication & Authorization Visualizer", "advanced"),
    createTopic("Realtime Systems & WebSocket Visualizer", "advanced"),
    createTopic("Event Sourcing & CQRS Visualizer", "advanced"),
    createTopic("Observability Playground", "advanced"),
    createTopic("Performance Engineering Visualizer", "advanced"),
    createTopic("Formal Verification & Symbolic Execution Visualizer", "advanced"),
];
