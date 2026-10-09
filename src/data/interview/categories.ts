import type { InterviewCategory } from './types';

export const categories: InterviewCategory[] = [
  {
    key: 'fullstack',
    title: 'Full Stack Interview Questions',
    shortTitle: 'Full Stack',
    description: 'JavaScript, React, networking and databases — the rounds that gate every web role.',
    icon: 'Layers',
    accent: 'text-blue-500',
    topics: ['Browser', 'React', 'JavaScript', 'Databases'],
  },
  {
    key: 'cybersecurity',
    title: 'Cybersecurity Interview Questions',
    shortTitle: 'Cybersecurity',
    description: 'XSS, CSRF and auth-token attacks: think like an attacker, defend like an engineer.',
    icon: 'ShieldAlert',
    accent: 'text-rose-500',
    topics: ['Web Security', 'Authentication'],
  },
  {
    key: 'dsa',
    title: 'DSA Interview Questions',
    shortTitle: 'DSA',
    description: 'Patterns, proofs and complexity — from brute force to the optimal solution.',
    icon: 'Binary',
    accent: 'text-green-500',
    topics: ['Arrays & Hashing', 'Strings', 'Caching & Design', 'Linked Lists'],
  },
  {
    key: 'system-design',
    title: 'System Design Interview Questions',
    shortTitle: 'System Design',
    description: 'Scale, caching and traffic control — design decisions and the math behind them.',
    icon: 'Network',
    accent: 'text-purple-500',
    topics: ['Scalability', 'Traffic'],
  },
  {
    key: 'ai-ml',
    title: 'AI / ML Interview Questions',
    shortTitle: 'AI / ML',
    description: 'Transformers, RAG and training internals — the questions behind modern AI roles.',
    icon: 'BrainCircuit',
    accent: 'text-red-500',
    topics: ['Transformers', 'RAG', 'Training'],
  },
];
