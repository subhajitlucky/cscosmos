import type { LucideIcon } from 'lucide-react';

export type VisualizerType = 
  | 'encoding' 
  | 'nodes' 
  | 'archetypes' 
  | 'compression' 
  | 'root-anchor' 
  | 'state' 
  | 'state-update' 
  | 'proof'
  | 'rlp'
  | 'patricia-trie';

export interface TopicContent {
  id: string;
  title: string;
  description: string;
  definition: string;
  analogy: string;
  deepDive: string;
  steps: {
    title: string;
    description: string;
  }[];
  visualType: VisualizerType;
  icon?: LucideIcon;
  color?: string;
  tag?: string;
}