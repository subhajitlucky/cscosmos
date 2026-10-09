'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Code2,
  Binary,
  Blocks,
  ShieldCheck,
  BrainCircuit,
  Cpu,
  Boxes,
  Network,
  type LucideIcon,
} from 'lucide-react';
import type { Domain, DomainKey } from '../data/domains';
import { topics } from '../data/topics';

interface DomainCardProps {
  domain: Domain;
}

const DOMAIN_META: Record<
  DomainKey,
  {
    index: string;
    icon: LucideIcon;
    tags: string[];
  }
> = {
  fullstack: {
    index: '01',
    icon: Code2,
    tags: ['CPU Cycle', 'Event Loop', 'React VDOM'],
  },
  dsa: {
    index: '02',
    icon: Binary,
    tags: ['RAM Cache', 'KMP Strings', 'Sliding Window'],
  },
  web3: {
    index: '03',
    icon: Blocks,
    tags: ['EVM Internals', 'Merkle Proofs', 'Solidity'],
  },
  security: {
    index: '04',
    icon: ShieldCheck,
    tags: ['SDR Signals', 'Reverse Eng', 'Sandbox'],
  },
  ai: {
    index: '05',
    icon: BrainCircuit,
    tags: ['Foundations', 'Neural Backprop', 'Transformers'],
  },
  corecs: {
    index: '06',
    icon: Cpu,
    tags: ['OS Paging', 'Virtual Memory', 'ELF Loaders'],
  },
  devops: {
    index: '07',
    icon: Boxes,
    tags: ['Docker Kernel', 'Kubernetes', 'eBPF'],
  },
  advanced: {
    index: '08',
    icon: Network,
    tags: ['Distributed Raft', 'Event Sourcing', 'RTOS'],
  },
};

export function DomainCard({ domain }: DomainCardProps) {
  const meta = DOMAIN_META[domain.domainKey] || {
    index: '00',
    icon: Code2,
    tags: [],
  };
  const Icon = meta.icon;

  const domainTopics = topics.filter(
    (t) => t.domain === domain.domainKey || t.aliases?.includes(domain.domainKey)
  );
  const activeCount = domainTopics.filter((t) => t.status === 'active').length;

  return (
    <Link
      href={domain.path}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card p-6 transition-colors duration-200 hover:border-foreground/30 hover:bg-secondary/20 focus-ring"
    >
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary/60 text-foreground group-hover:text-primary transition-colors">
              <Icon className="h-4 w-4" />
            </span>
            <span className="font-mono text-xs font-semibold text-muted-foreground tracking-wider">
              //{meta.index}
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground font-medium">
            {activeCount > 0 ? (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {activeCount} Live
              </>
            ) : (
              'Curated Roadmap'
            )}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {domain.name}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {domain.description}
          </p>
        </div>

        {meta.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-border/60 bg-secondary/40 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          <span>{domainTopics.length} Modules</span>
          <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Enter Domain <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
