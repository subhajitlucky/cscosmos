export type DomainKey = 'fullstack' | 'dsa' | 'web3' | 'ai' | 'corecs' | 'devops' | 'security' | 'advanced';

export interface Domain {
    name: string;
    domainKey: DomainKey;
    description: string;
    color: string;
}

/** Canonical path for a domain hub. Keep this as the single source of truth. */
export const domainPath = (domainKey: DomainKey) => `/${domainKey}`;

export const domains: Domain[] = [
    {
        name: "Full Stack Development",
        domainKey: "fullstack",
        description: "Master modern web development from HTML/CSS to scalable backend systems.",
        color: "bg-blue-500"
    },
    {
        name: "Data Structures & Algorithms",
        domainKey: "dsa",
        description: "Visualize and master the fundamental algorithms that power software.",
        color: "bg-green-500"
    },
    {
        name: "Web3 & Blockchain",
        domainKey: "web3",
        description: "Explore the decentralized world of smart contracts and cryptography.",
        color: "bg-purple-500"
    },
    {
        name: "Cybersecurity & Ethical Hacking",
        domainKey: "security",
        description: "Master the art of offense and defense: Cryptography, Pen Testing, and Forensics.",
        color: "bg-rose-600"
    },
    {
        name: "Artificial Intelligence",
        domainKey: "ai",
        description: "Dive into machine learning, neural networks, and the future of AI.",
        color: "bg-red-500"
    },
    {
        name: "Core Computer Science",
        domainKey: "corecs",
        description: "Understand the operating systems, networks, and databases beneath the surface.",
        color: "bg-yellow-500"
    },
    {
        name: "DevOps / Cloud / Engineering",
        domainKey: "devops",
        description: "Learn how modern software is built, deployed, and scaled in the cloud.",
        color: "bg-orange-500"
    },
    {
        name: "Advanced Engineering & Systems",
        domainKey: "advanced",
        description: "Tackle complex system design, security, and high-performance engineering.",
        color: "bg-indigo-500"
    }
];
