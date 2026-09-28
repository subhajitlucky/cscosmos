'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Terminal,
  Cpu,
  Boxes,
  ShieldCheck,
  BrainCircuit,
  Binary,
  Code2,
  Blocks,
  HardDrive,
  Layers,
  Radio,
  FileCode,
  Network,
  Clock,
  Sparkles,
  Command,
} from 'lucide-react';
import { domains, type DomainKey } from '@/data/domains';
import { topics, type Topic } from '@/data/topics';
import { tracks } from '@/data/tracks';
import { DomainCard } from '@/components/DomainCard';
import { TopicCard } from '@/components/TopicCard';
import { siteConfig } from '@/config/site';

const DOMAIN_FILTER_OPTIONS: { label: string; key: 'all' | DomainKey }[] = [
  { label: 'All Disciplines', key: 'all' },
  { label: 'Full Stack', key: 'fullstack' },
  { label: 'Algorithms', key: 'dsa' },
  { label: 'Web3', key: 'web3' },
  { label: 'Cybersecurity', key: 'security' },
  { label: 'AI & Machine Learning', key: 'ai' },
  { label: 'Core CS & Systems', key: 'corecs' },
  { label: 'DevOps & Cloud', key: 'devops' },
  { label: 'Advanced Engineering', key: 'advanced' },
];

interface FlagshipEngine {
  title: string;
  badge: string;
  domain: string;
  url: string;
  description: string;
  topicsCovered: string[];
  icon: typeof Cpu;
}

const FLAGSHIP_ENGINES: FlagshipEngine[] = [
  {
    title: 'Program Execution & CPU Cycle',
    badge: 'ENGINE // 01',
    domain: 'Full Stack',
    url: '/fullstack/program-cosmos',
    description:
      'Step-by-step CPU instruction cycle: fetch, decode, execute, and writeback. Inspect registers, ALU operations, stack memory frames, and hardware I/O.',
    topicsCovered: ['Fetch-Decode Cycle', 'Call Stack Frames', 'I/O Syscalls'],
    icon: Cpu,
  },
  {
    title: 'AI Engineering Foundations',
    badge: 'ENGINE // 02',
    domain: 'AI & Machine Learning',
    url: '/ai/ai-engineering-foundations',
    description:
      'Master learned parameters, tensor transformations, continuous loss surfaces, and deterministic micro-model execution.',
    topicsCovered: ['Parameter Space', 'Activation Functions', 'Decision Surfaces'],
    icon: BrainCircuit,
  },
  {
    title: 'Array & RAM Cache Locality',
    badge: 'ENGINE // 03',
    domain: 'DSA',
    url: '/dsa/arrayviz',
    description:
      'Live CPU cache latency simulation. Observe L1/L2 hits vs RAM page misses across sequential and random memory stride access patterns.',
    topicsCovered: ['Cache Locality', 'Sliding Window', 'KMP Strings'],
    icon: HardDrive,
  },
  {
    title: 'Docker & Linux Kernel Isolation',
    badge: 'ENGINE // 04',
    domain: 'Full Stack / DevOps',
    url: '/fullstack/dockercosmos',
    description:
      'Deconstruct containers into Linux kernel primitives: PID/NET namespaces, cgroups v2 resource limits, and OverlayFS layered union filesystems.',
    topicsCovered: ['Namespaces', 'Cgroups v2', 'OverlayFS Layers'],
    icon: Boxes,
  },
  {
    title: 'OS Internals & Virtual Memory',
    badge: 'ENGINE // 05',
    domain: 'Core CS',
    url: '/corecs/operating-systems-internals-processes-memory',
    description:
      'Inspect multi-level page tables, TLB cache translations, page faults, and kernel process memory layout with live address translation.',
    topicsCovered: ['Virtual Paging', 'TLB Translation', 'Process Memory'],
    icon: Layers,
  },
  {
    title: 'Blockchain & Merkle State Storage',
    badge: 'ENGINE // 06',
    domain: 'Web3',
    url: '/web3/blockchainviz',
    description:
      'Cryptographic state integrity visualizer: SHA-256 block mining, Merkle tree audit proofs, Patricia Trie state roots, and EVM stack execution.',
    topicsCovered: ['Merkle Trees', 'Patricia Tries', 'EVM Opcode Stack'],
    icon: Blocks,
  },
  {
    title: 'SDR Signal Hacking & Spectrum',
    badge: 'ENGINE // 07',
    domain: 'Security',
    url: '/security/software-defined-radio-sdr-and-signal-hacking',
    description:
      'Interactive radio frequency spectrum waterfall, I/Q constellation diagram, signal demodulation, and packet reverse-engineering.',
    topicsCovered: ['RF Waterfall', 'I/Q Constellation', 'Packet Demod'],
    icon: Radio,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'all' | DomainKey>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalTopics = topics.length;
  const liveTopics = topics.filter((t) => t.status === 'active').length;

  // Keyboard shortcut listener: press "/" to focus search, "Escape" to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInputFocused = activeTag === 'input' || activeTag === 'textarea';

      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && isInputFocused) {
        searchInputRef.current?.blur();
        setSearchQuery('');
      } else if ((e.key === 't' || e.key === 'T') && !isInputFocused) {
        router.push('/topics');
      } else if ((e.key === 'l' || e.key === 'L') && !isInputFocused) {
        router.push('/tracks');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Filtered topics based on search & domain chips
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      const matchesDomain =
        selectedDomain === 'all' ||
        topic.domain === selectedDomain ||
        topic.aliases?.includes(selectedDomain);

      if (!searchQuery.trim()) {
        return matchesDomain;
      }

      const q = searchQuery.toLowerCase();
      const matchesQuery =
        topic.name.toLowerCase().includes(q) ||
        topic.slug.toLowerCase().includes(q) ||
        topic.shortDescription.toLowerCase().includes(q) ||
        topic.domain.toLowerCase().includes(q);

      return matchesDomain && matchesQuery;
    });
  }, [searchQuery, selectedDomain]);

  const isFiltering = searchQuery.trim().length > 0 || selectedDomain !== 'all';

  return (
    <div className="space-y-24 pb-24">
      {/* 1. System Telemetry Bar */}
      <section className="border-b border-border/80 bg-secondary/30">
        <div className="page-container py-3">
          <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                SYS_VER // 2.4.0
              </span>
              <span className="hidden sm:inline text-border">|</span>
              <span className="hidden sm:inline">ONLINE // TELEMETRY VERIFIED</span>
            </div>

            <div className="flex items-center gap-4">
              <span>
                <strong className="text-foreground">{liveTopics}</strong> LIVE ENGINES
              </span>
              <span className="text-border">/</span>
              <span>
                <strong className="text-foreground">{totalTopics}</strong> MODULES
              </span>
              <span className="text-border">/</span>
              <span className="hidden md:inline">
                <strong className="text-foreground">8</strong> DISCIPLINES
              </span>
              <span className="text-border hidden md:inline">/</span>
              <span className="text-emerald-500 dark:text-emerald-400 font-semibold hidden lg:inline">
                100% OPEN
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Hero Section: Architectural Statement */}
      <section className="page-container pt-10 md:pt-16">
        <div className="space-y-8 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/50 px-4 py-1.5 text-xs font-mono text-muted-foreground shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-foreground" />
            <span className="font-semibold text-foreground">{totalTopics} INTERACTIVE MODULES</span>
            <span className="opacity-40">&bull;</span>
            <span className="text-emerald-500 dark:text-emerald-400 font-semibold">{liveTopics} LIVE ENGINES</span>
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.02] font-display">
              Explore the Universe of <br className="hidden sm:inline" />
              <span className="text-muted-foreground">Computer Science.</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-normal leading-relaxed max-w-3xl font-sans">
              Deconstructing the digital universe. Visual, interactive deep-dives into the core of computing — designed for engineers who refuse to just use tools and choose to master them.
            </p>

            {/* Restored Iconic Tagline */}
            <div className="border-l-2 border-foreground/70 pl-4 py-1.5">
              <p className="font-mono text-sm sm:text-base text-foreground font-medium italic tracking-wide">
                &ldquo;{siteConfig.slogan}&rdquo;
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/topics"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-foreground px-7 text-sm font-semibold text-background transition-all hover:bg-foreground/90 active:scale-95 shadow-sm"
            >
              Explore {totalTopics} Topics <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/tracks"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border/80 bg-secondary/30 px-6 text-sm font-semibold text-foreground transition-all hover:bg-secondary/70 hover:border-foreground/30 active:scale-95"
            >
              Curated Learning Tracks
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-transparent px-4 text-sm font-mono text-muted-foreground transition-colors hover:text-foreground"
            >
              About CSCosmos &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Interactive Command Deck & Search */}
      <section className="page-container">
        <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Command className="h-4 w-4 text-muted-foreground" />
                Quick Search & Filter Matrix
              </h2>
              <p className="text-xs font-mono text-muted-foreground">
                Press <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">/</kbd> anywhere to focus. Real-time filtering across {totalTopics} curriculum topics.
              </p>
            </div>

            <div className="text-xs font-mono text-muted-foreground">
              Showing <strong className="text-foreground">{filteredTopics.length}</strong> of {totalTopics} modules
            </div>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, algorithms, protocols, data structures (e.g. 'CPU', 'EVM', 'Docker', 'Cache')..."
              className="flex h-13 w-full rounded-xl border border-border/80 bg-secondary/20 px-11 pr-24 py-3 text-sm font-sans text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-foreground/40 focus:bg-background focus:outline-none"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="rounded border border-border bg-secondary/80 px-2 py-0.5 text-[11px] font-mono text-muted-foreground hover:text-foreground"
                >
                  Clear [Esc]
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-secondary/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground pointer-events-none">
                /
              </kbd>
            </div>
          </div>

          {/* Domain Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
            {DOMAIN_FILTER_OPTIONS.map((opt) => {
              const count =
                opt.key === 'all'
                  ? totalTopics
                  : topics.filter(
                      (t) =>
                        t.domain === opt.key ||
                        (t.aliases as readonly string[] | undefined)?.includes(opt.key)
                    ).length;

              const isSelected = selectedDomain === opt.key;

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedDomain(opt.key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono transition-all ${
                    isSelected
                      ? 'border-foreground bg-foreground text-background font-semibold shadow-sm'
                      : 'border-border/80 bg-secondary/20 text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-background/80' : 'text-muted-foreground/60'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Active Search Results Grid (Surfaces when user is searching/filtering) */}
      {isFiltering ? (
        <section className="page-container space-y-6">
          <div className="flex items-center justify-between border-b border-border/80 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Matching Modules
              </h2>
              <p className="text-xs font-mono text-muted-foreground">
                {filteredTopics.length} topics found for criteria
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedDomain('all');
              }}
              className="text-xs font-mono text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              Reset Filters
            </button>
          </div>

          {filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-4">
              <p className="text-sm font-mono text-muted-foreground">
                NO TOPICS MATCHING “{searchQuery}” IN DOMAIN “{selectedDomain.toUpperCase()}”.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('all');
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2 text-xs font-mono text-foreground hover:bg-secondary"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* 5. Flagship Visualizer Engines Showcase */}
          <section className="page-container space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  CORE INTERACTIVE ENGINES // REPOSITORIES
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-display">
                  Featured Interactive Visualizers
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Dissect fundamental systems live. Inspect real memory allocations,
                  registers, packets, and state transitions without abstraction layers.
                </p>
              </div>

              <Link
                href="/topics"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                View all {liveTopics} live visualizers <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FLAGSHIP_ENGINES.map((engine) => {
                const Icon = engine.icon;
                return (
                  <Link
                    key={engine.url}
                    href={engine.url}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/80 bg-card p-6 transition-all duration-200 hover:border-foreground/30 hover:bg-secondary/20"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/60 text-foreground group-hover:text-primary transition-colors">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                            {engine.domain}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-500 dark:text-emerald-400 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            LIVE
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-mono text-[10px] font-semibold text-muted-foreground tracking-wider">
                          {engine.badge}
                        </span>
                        <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                          {engine.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {engine.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {engine.topicsCovered.map((topic) => (
                          <span
                            key={topic}
                            className="rounded border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      <span className="text-[11px] text-muted-foreground/70">Interactive Workbench</span>
                      <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Launch Engine <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 6. The 8 Core Disciplines (Architectural Bento Grid) */}
          <section className="page-container space-y-8">
            <div className="border-b border-border/80 pb-6 space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                DISCIPLINE DIRECTORY // 8 CORE PILLARS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-display">
                The Computer Science Matrix
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Structured domain roadmaps spanning theoretical foundations, practical
                kernel execution, distributed networks, and modern AI engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {domains.map((domain) => (
                <DomainCard key={domain.domainKey} domain={domain} />
              ))}
            </div>
          </section>

          {/* 7. Structured Learning Tracks Showcase */}
          <section className="page-container space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  CURATED PATHWAYS // SEQUENCE RUNS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground font-display">
                  Structured Learning Tracks
                </h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Multi-module sequences connecting individual visualizers into comprehensive
                  engineering journeys. Free, forever, without paywalls.
                </p>
              </div>

              <Link
                href="/tracks"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:text-primary transition-colors whitespace-nowrap"
              >
                View all tracks <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tracks.map((track) => (
                <Link
                  key={track.slug}
                  href={`/tracks/${track.slug}`}
                  className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-6 transition-all duration-200 hover:border-foreground/30 hover:bg-secondary/20"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded border border-border/80 bg-secondary/50 px-2.5 py-0.5 font-mono text-[10px] uppercase font-semibold text-muted-foreground">
                        {track.level}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> ~{track.estHours}h sequence
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {track.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {track.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-mono text-muted-foreground/80 uppercase tracking-wider block">
                        Included Interactive Engines ({track.modules.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {track.modules.map((m) => (
                          <span
                            key={m.id}
                            className="rounded border border-border/60 bg-secondary/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {m.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-mono font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    <span className="text-emerald-500 font-medium">Free & Self-Paced</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Start Track <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 8. Engineering Philosophy / Manifesto */}
          <section className="page-container">
            <div className="rounded-2xl border border-border/80 bg-card p-8 md:p-12 space-y-8">
              <div className="space-y-2 max-w-2xl">
                <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  THE FIRST-PRINCIPLES MANIFESTO
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-display">
                  Why CSCosmos?
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Most online technical tutorials reduce computing to passive video streams or syntax memorization.
                  CSCosmos is built on three uncompromising principles:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-5">
                  <span className="font-mono text-xs font-bold text-foreground">
                    01 // STATE OVER SYNTAX
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You don't understand CPU pipelining by reading paragraphs. You understand it by stalling the hazard register and watching instructions flush.
                  </p>
                </div>

                <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-5">
                  <span className="font-mono text-xs font-bold text-foreground">
                    02 // ZERO BLACK BOXES
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Every abstraction layer is exposed: from hardware registers and POSIX syscalls to EVM opcodes, TCP sliding windows, and L1 cache hits.
                  </p>
                </div>

                <div className="space-y-2 rounded-xl border border-border/60 bg-secondary/20 p-5">
                  <span className="font-mono text-xs font-bold text-foreground">
                    03 // CLIENT-SIDE & FREE
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Zero forced accounts, zero paywalled tracks, zero telemetry trackers. Pure interactive software compiled directly into the web runtime.
                  </p>
                </div>
              </div>

              {/* Manifesto Slogan Ribbon */}
              <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
                <span className="italic text-foreground font-medium">
                  &ldquo;{siteConfig.slogan}&rdquo;
                </span>
                <span>CSCosmos &bull; Deconstructing the Digital Universe</span>
              </div>
            </div>
          </section>

          {/* 9. Bottom Keyboard Navigation Ribbon */}
          <section className="page-container pt-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs font-mono text-muted-foreground">
              <div className="flex flex-wrap items-center gap-4">
                <span>SHORTCUTS:</span>
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">/</kbd>
                  Search
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">T</kbd>
                  Topics
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">L</kbd>
                  Tracks
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] text-foreground font-semibold">Esc</kbd>
                  Clear
                </span>
              </div>

              <div className="text-muted-foreground">
                CSCosmos Engine &copy; {new Date().getFullYear()} &bull; {siteConfig.slogan}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
