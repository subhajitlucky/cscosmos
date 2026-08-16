import React from 'react';
import { ShieldAlert, Activity, Lock } from 'lucide-react';

// Placeholder imports for visualizers - we will implement these next
import { WhatIsBlockchainViz } from '../components/topics/visualizers/WhatIsBlockchainViz';
import { DistributedLedgerViz } from '../components/topics/visualizers/DistributedLedgerViz';
import { TransactionViz } from '../components/topics/visualizers/TransactionViz';
import { BlockViz } from '../components/topics/visualizers/BlockViz';
import { BlockHeaderViz } from '../components/topics/visualizers/BlockHeaderViz';
import { BlockBodyViz } from '../components/topics/visualizers/BlockBodyViz';
import { HashLinkingViz } from '../components/topics/visualizers/HashLinkingViz';
import { GenesisBlockViz } from '../components/topics/visualizers/GenesisBlockViz';
import { MerkleTreeViz } from '../components/topics/visualizers/MerkleTreeViz';
import { ImmutabilityViz } from '../components/topics/visualizers/ImmutabilityViz';
import { ForkViz } from '../components/topics/visualizers/ForkViz';

export interface TopicContentData {
    title: string;
    subtitle: string;
    content: React.ReactNode;
    Visualizer: React.ComponentType;
}

export const topicContent: Record<string, TopicContentData> = {
    "what-is-blockchain": {
        title: "What is a Blockchain?",
        subtitle: "A deterministic state machine replicated across a P2P network.",
        Visualizer: WhatIsBlockchainViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    At its core, a blockchain is a <strong>Replicated State Machine</strong>. In computer science, a state machine is a system that transitions from state <em>S<sub>n</sub></em> to <em>S<sub>n+1</sub></em> by applying a set of valid inputs (transactions).
                </p>
                <div className="bg-secondary/30 p-4 rounded-xl font-mono text-sm text-center border border-border">
                    State<sub>n+1</sub> = APPLY(State<sub>n</sub>, Transaction)
                </div>
                <h3 className="text-xl font-bold text-foreground mt-8">Engineering Primitives</h3>
                <ul className="space-y-3">
                    <li className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span><strong>Determinism:</strong> Given the same set of transactions and the same starting state, every node in the network <em>must</em> arrive at the exact same resulting state.</span>
                    </li>
                    <li className="flex gap-3">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span><strong>State Machine Replication:</strong> The process of ensuring that this state transition happens across thousands of geographically distributed nodes simultaneously.</span>
                    </li>
                </ul>
            </div>
        )
    },
    "distributed-ledger": {
        title: "Distributed Ledger Technology (DLT)",
        subtitle: "Solving the Byzantine Generals Problem.",
        Visualizer: DistributedLedgerViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    The "Distributed" in DLT refers to the absence of a central coordinator. This introduces the <strong>Byzantine Generals Problem</strong>: how can a network reach consensus if some nodes are malicious or simply failing?
                </p>
                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> The CAP Theorem Trade-off
                    </h4>
                    <p className="text-sm">
                        Distributed systems usually choose two of three: Consistency, Availability, or Partition Tolerance. Blockchains typically prioritize <strong>Consistency and Partition Tolerance (CP)</strong>, using consensus protocols to ensure the ledger remains a single "Source of Truth" even during network outages.
                    </p>
                </div>
                <p>
                    Unlike a traditional "Distributed Database," a DLT assumes an <strong>adversarial environment</strong>. It doesn't just replicate data; it uses economic incentives and cryptographic proofs to ensure the data is valid.
                </p>
            </div>
        )
    },
    "transactions": {
        title: "The Anatomy of a Transaction",
        subtitle: "Cryptographic state transitions signed by private keys.",
        Visualizer: TransactionViz,
        content: (
            <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
                <p>
                    A transaction is a <strong>digitally signed state transition</strong>. Security is rooted in <strong>Elliptic Curve Cryptography (ECC)</strong>, specifically the hardness of the Discrete Logarithm Problem.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                        <div className="text-primary font-mono font-bold mb-1">d (Private Key)</div>
                        <p className="text-[11px] leading-tight">A massive, random scalar secret. This is your <strong>mathematical signature stamp</strong>.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                        <div className="text-primary font-mono font-bold mb-1">G (Generator)</div>
                        <p className="text-[11px] leading-tight">A fixed point on a curve. The <strong>standard baseline</strong> for all curve operations.</p>
                    </div>
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border">
                        <div className="text-primary font-mono font-bold mb-1">Q (Public Key)</div>
                        <p className="text-[11px] leading-tight">A point on the curve derived via $Q = d \times G$. It is <strong>impossible</strong> to reverse this operation.</p>
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-primary" /> Deterministic Nonces (RFC 6979)
                    </h4>
                    <p className="text-sm">
                        To sign a message, a temporary random number $k$ (the nonce) is required. If $k$ is ever reused, an observer can solve a linear equation to find your private key $d$. Modern implementations generate $k$ deterministically from the transaction data itself to eliminate this risk.
                    </p>
                </div>
            </div>
        )
    },
    "blocks": {
        title: "Blocks: The Batch Mechanism",
        subtitle: "Establishing a canonical temporal order.",
        Visualizer: BlockViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    In a global P2P network, "time" is relative. Different nodes may receive transactions in different orders. <strong>Blocks</strong> solve this by batching transactions into a single unit that establishes a <strong>Canonical Temporal Order</strong>.
                </p>
                
                <h3 className="text-xl font-bold text-foreground mt-8">The Throughput vs. Latency Trade-off</h3>
                <div className="grid md:grid-cols-2 gap-6 my-6">
                    <div className="bg-secondary/30 p-5 rounded-2xl border border-border">
                        <h4 className="font-bold text-xs text-primary mb-2 uppercase">Throughput (TPS)</h4>
                        <p className="text-xs">Increasing block size allows for more Transactions Per Second, but increases the data burden on nodes, leading to centralization.</p>
                    </div>
                    <div className="bg-secondary/30 p-5 rounded-2xl border border-border">
                        <h4 className="font-bold text-xs text-primary mb-2 uppercase">Settlement Latency</h4>
                        <p className="text-xs">Faster block times (shorter intervals) reduce waiting time but increase the risk of "Chain Reorganizations" (Forks).</p>
                    </div>
                </div>

                <p>
                    Every block creation is a compromise within the <strong>Scalability Trilemma</strong>: balancing security, scalability, and decentralization.
                </p>
            </div>
        )
    },
    "block-headers": {
        title: "Deep Dive: Block Headers",
        subtitle: "The 80-byte security core of the blockchain.",
        Visualizer: BlockHeaderViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    The <strong>Block Header</strong> is an 80-byte metadata summary of the entire block. It acts as a bridge between the previous block and the transactions within the current one.
                </p>

                <h3 className="text-xl font-bold text-foreground mt-8">The Difficulty Adjustment (DAA)</h3>
                <p>
                    The network targets a constant block time (e.g., 10 minutes). If hashpower increases, blocks are found too quickly. Every 2016 blocks, Bitcoin adjusts the <strong>Target</strong> field in the header.
                </p>
                
                <div className="bg-secondary/10 border-l-4 border-primary p-4 font-mono text-sm">
                    Hash(Header) {"<"} Target
                </div>

                <p>
                    Miners must iterate the <strong>Nonce</strong> until the resulting header hash is numerically less than this target. This makes the security of the chain <strong>thermodynamically expensive</strong> to rewrite.
                </p>
            </div>
        )
    },
    "block-body": {
        title: "Block Body & Storage",
        subtitle: "Serialization and the Coinbase reward.",
        Visualizer: BlockBodyViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    The <strong>Block Body</strong> contains the raw transaction data. Before transmission, this data undergoes <strong>Serialization</strong>—converting high-level data structures into a compact binary stream (Wire Format).
                </p>

                <div className="bg-yellow-500/5 border border-yellow-500/20 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Lock className="w-4 h-4 text-yellow-600" /> The Coinbase Transaction
                    </h4>
                    <p className="text-sm">
                        Every block begins with a unique <strong>Coinbase Transaction</strong>. This is the "Generation" event where new tokens are created as a subsidy for the miner, alongside the collected transaction fees. This is the only entry point for new supply in the system.
                    </p>
                </div>

                <p>
                    The body is conceptually structured as a <strong>Merkle Tree</strong>, though the actual storage on disk is usually a sequential append-only flat file (like Bitcoin's <code>blk.dat</code>).
                </p>
            </div>
        )
    },
    "hash-linking": {
        title: "Cryptographic Hash Linking",
        subtitle: "Building the recursive Chain of Trust.",
        Visualizer: HashLinkingViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    The "Chain" in Blockchain is a mathematical construct created by embedding the <strong>Parent Hash</strong> into the child's header. This establishes a <strong>Recursive Dependency</strong>.
                </p>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> The Avalanche Effect
                    </h4>
                    <p className="text-sm">
                        Hashing algorithms like SHA-256 are designed such that a single bit change in the input (changing a decimal point in a transaction) produces a completely uncorrelated output. This ensures that any attempt to tamper with history is instantly visible as the entire subsequent chain of hashes breaks.
                    </p>
                </div>

                <p>
                    To successfully alter a past block, an attacker must not only change that block but also <strong>re-calculate the Proof of Work</strong> for every single block that follows it, faster than the rest of the network can produce new blocks.
                </p>
            </div>
        )
    },
    "genesis-block": {
        title: "The Genesis Block",
        subtitle: "Block Height 0: The Hardcoded Truth.",
        Visualizer: GenesisBlockViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    Every blockchain begins with a <strong>Genesis Block</strong>. It is the only block in the system that does not point to a predecessor. Instead of being discovered by miners, its parameters are <strong>hardcoded</strong> into the protocol software itself.
                </p>

                <h3 className="text-xl font-bold text-foreground mt-8">Bootstraping Trust</h3>
                <p>
                    The Genesis Block establishes the initial state of the network, including the reward schedule and initial difficulty. In Bitcoin, Block #0 contained a famous message: <em>"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"</em>.
                </p>

                <div className="bg-secondary/30 p-5 rounded-2xl border border-border">
                    <h4 className="font-bold text-xs text-primary mb-2 uppercase">Engineering Significance</h4>
                    <p className="text-xs">By hardcoding the Genesis Block hash, the software ensures that every node in the network is building on the exact same foundation. It acts as the <strong>Anchor of Trust</strong> for the entire cryptographic history that follows.</p>
                </div>
            </div>
        )
    },
    "merkle-trees": {
        title: "Merkle Trees & Roots",
        subtitle: "Efficient verification of mass data inclusion.",
        Visualizer: MerkleTreeViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    A <strong>Merkle Tree</strong> (or Binary Hash Tree) is a data structure used to summarize all the transactions in a block into a single 32-byte fingerprint: the <strong>Merkle Root</strong>. This root is what actually gets stored in the Block Header.
                </p>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> Logarithmic Efficiency: O(log n)
                    </h4>
                    <p className="text-sm">
                        To prove that a transaction is part of a block containing 1,000 transactions, you don't need to provide all 1,000. You only need to provide about 10 hashes (the <strong>Merkle Proof</strong>). This allows light clients (like mobile wallets) to verify payments securely without downloading the entire blockchain.
                    </p>
                </div>

                <h3 className="text-xl font-bold text-foreground mt-8">The Propagation of Trust</h3>
                <p>
                    The tree is built from the bottom up. Transactions are hashed, paired, and hashed again until only one hash remains. This structure ensures that if a single character in a single transaction changes, the entire Merkle Root becomes invalid, instantly alerting the network to the tampering.
                </p>
            </div>
        )
    },
    "immutability": {
        title: "Immutability & Proof of Work",
        subtitle: "Thermodynamic security and Probabilistic Finality.",
        Visualizer: ImmutabilityViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    Immutability in a blockchain is not a static property; it is <strong>probabilistic</strong>. The deeper a block is buried in the chain, the more energy is required to rewrite it. This is the result of <strong>Accumulated Proof of Work</strong>.
                </p>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> Settlement Finality
                    </h4>
                    <p className="text-sm">
                        Each new block acts as a "confirmation" for all previous blocks. After 6 confirmations on Bitcoin (~1 hour), the cost to rewrite history becomes so prohibitively expensive (requiring more energy than entire countries) that the transaction is considered <strong>Final</strong>.
                    </p>
                </div>

                <h3 className="text-xl font-bold text-foreground mt-8">The 51% Attack</h3>
                <p>
                    To rewrite a block at height $H$, an attacker must possess more than 51% of the network's total hashrate. They must then re-mine block $H$, $H+1$, $H+2$, and so on, until their malicious chain is longer than the honest one. This is why decentralized hashrate is the ultimate shield for blockchain security.
                </p>
            </div>
        )
    },
    "forks": {
        title: "Forks & Consensus",
        subtitle: "Resolving disagreements in a decentralized system.",
        Visualizer: ForkViz,
        content: (
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                <p>
                    A <strong>Fork</strong> occurs when the blockchain splits into two potential paths. This can happen accidentally (two miners find a block at once) or intentionally (to upgrade the protocol).
                </p>

                <h3 className="text-xl font-bold text-foreground mt-8">Nakamoto Consensus: The Longest Chain</h3>
                <p>
                    Nodes use the <strong>Longest Chain Rule</strong> to decide which path is the "Truth." Specifically, they follow the chain with the most <strong>Accumulated Proof of Work</strong>. If you are on a shorter branch (an "Orphan" chain), your transactions will be reverted in a process called a <strong>Chain Reorganization</strong>.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-6">
                    <div className="bg-secondary/30 p-5 rounded-2xl border border-border">
                        <h4 className="font-bold text-xs text-primary mb-2 uppercase">Soft Fork</h4>
                        <p className="text-xs">A backward-compatible upgrade. Old nodes still recognize new blocks as valid. It's a narrowing of the rules.</p>
                    </div>
                    <div className="bg-secondary/30 p-5 rounded-2xl border border-border">
                        <h4 className="font-bold text-xs text-primary mb-2 uppercase">Hard Fork</h4>
                        <p className="text-xs">A non-backward-compatible change. Old nodes reject new blocks. This results in two permanent, separate blockchains.</p>
                    </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl space-y-4">
                    <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" /> Probabilistic Settlement
                    </h4>
                    <p className="text-sm">
                        Because forks can happen accidentally, engineers wait for <strong>Confirmations</strong>. The more blocks added to a chain, the less likely it is that a longer competing chain exists elsewhere, ensuring your transaction is permanently recorded.
                    </p>
                </div>
            </div>
        )
    }
};
