export type DomainKey = 'fullstack' | 'dsa' | 'web3' | 'ai' | 'corecs' | 'devops' | 'advanced';

export interface Domain {
    name: string;
    path: string;
    domainKey: DomainKey;
    description: string;
    color: string;
}

export const domains: Domain[] = [
    {
        name: "Full Stack Development",
        path: "/fullstack",
        domainKey: "fullstack",
        description: "Master modern web development from HTML/CSS to scalable backend systems.",
        color: "bg-blue-500"
    },
    {
        name: "Data Structures & Algorithms",
        path: "/dsa",
        domainKey: "dsa",
        description: "Visualize and master the fundamental algorithms that power software.",
        color: "bg-green-500"
    },
    {
        name: "Web3 & Blockchain",
        path: "/web3",
        domainKey: "web3",
        description: "Explore the decentralized world of smart contracts and cryptography.",
        color: "bg-purple-500"
    },
    {
        name: "Artificial Intelligence",
        path: "/ai",
        domainKey: "ai",
        description: "Dive into machine learning, neural networks, and the future of AI.",
        color: "bg-red-500"
    },
    {
        name: "Core Computer Science",
        path: "/corecs",
        domainKey: "corecs",
        description: "Understand the operating systems, networks, and databases beneath the surface.",
        color: "bg-yellow-500"
    },
    {
        name: "DevOps / Cloud / Engineering",
        path: "/devops",
        domainKey: "devops",
        description: "Learn how modern software is built, deployed, and scaled in the cloud.",
        color: "bg-orange-500"
    },
    {
        name: "Advanced Engineering & Systems",
        path: "/advanced",
        domainKey: "advanced",
        description: "Tackle complex system design, security, and high-performance engineering.",
        color: "bg-indigo-500"
    }
];
