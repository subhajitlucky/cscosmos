export interface Topic {
    id: string;
    title: string;
    description: string;
    icon?: string; // We can add icon names here later
}

export const topics: Topic[] = [
    {
        id: "what-is-blockchain",
        title: "What is a Blockchain",
        description: "Understand the fundamental definition: a shared, immutable ledger that records transactions in a secure way."
    },
    {
        id: "distributed-ledger",
        title: "Distributed Ledger Concept",
        description: "How a network of computers (nodes) maintains a synchronized copy of the data without a central authority."
    },
    {
        id: "transactions",
        title: "Transactions",
        description: "The atomic unit of a blockchain. Sending value or data from one address to another, signed cryptographically."
    },
    {
        id: "blocks",
        title: "Blocks",
        description: "How transactions are grouped together into containers to be processed and stored efficiently."
    },
    {
        id: "block-headers",
        title: "Block Headers",
        description: "The metadata of a block: version, timestamp, previous hash, and the mining puzzle solution (nonce)."
    },
    {
        id: "block-body",
        title: "Block Body",
        description: "The actual list of transactions contained within the block, often organized in a specific structure."
    },
    {
        id: "hash-linking",
        title: "Hash Linking",
        description: "The 'Chain' in Blockchain. How each block embeds the fingerprint of the previous one, creating a sequence."
    },
    {
        id: "genesis-block",
        title: "Genesis Block",
        description: "The very first block in the chain (Block 0). It has no parent and is hardcoded into the software."
    },
    {
        id: "merkle-trees",
        title: "Merkle Trees",
        description: "A smart way to summarize thousands of transactions into a single hash (root) for verification."
    },
    {
        id: "immutability",
        title: "Immutability",
        description: "Why you can't change history. The domino effect that invalidates the chain if you tamper with old data."
    },
    {
        id: "forks",
        title: "Forks",
        description: "What happens when two blocks are found at the same time, or when the rules of the network change."
    }
];
