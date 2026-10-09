'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Command, Search } from 'lucide-react';
import { topics, type Topic } from '@/data/topics';
import type { DomainKey } from '@/data/domains';
import { TopicCard } from '@/components/TopicCard';

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

interface HomeSearchDeckProps {
  totalTopics: number;
  children: ReactNode;
}

export function HomeSearchDeck({ totalTopics, children }: HomeSearchDeckProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<'all' | DomainKey>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Single-character shortcuts are only active when focus is on the page body
  // (WCAG 2.1.4): they never fire while a control or input has focus.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const active = document.activeElement;
      const isTyping =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active instanceof HTMLElement && active.isContentEditable);

      if (e.key === 'Escape' && isTyping) {
        searchInputRef.current?.blur();
        setSearchQuery('');
        return;
      }

      const isBodyFocused = !active || active === document.body;
      if (!isBodyFocused) return;

      if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 't' || e.key === 'T') {
        router.push('/topics');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  const filteredTopics = useMemo(() => {
    return topics.filter((topic: Topic) => {
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

  const emptyMessage = searchQuery.trim()
    ? `NO TOPICS MATCHING \u201C${searchQuery}\u201D${
        selectedDomain !== 'all' ? ` IN DOMAIN \u201C${selectedDomain.toUpperCase()}\u201D` : ''
      }.`
    : `NO MODULES IN DOMAIN \u201C${selectedDomain.toUpperCase()}\u201D YET.`;

  return (
    <>
      <section className="page-container">
        <div className="rounded-2xl border border-border/80 bg-card p-6 md:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Command className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                Quick Search &amp; Filter Matrix
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
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="search"
              name="q"
              aria-label="Search curriculum topics"
              autoComplete="off"
              spellCheck={false}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, algorithms, protocols (e.g. 'CPU', 'EVM', 'Docker')…"
              className="flex h-[3.25rem] w-full rounded-xl border border-border/80 bg-secondary/20 px-11 pr-24 py-3 text-sm font-sans text-foreground placeholder:text-muted-foreground transition-colors focus-ring focus:border-foreground/40 focus:bg-background"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="rounded border border-border bg-secondary/80 px-2 py-0.5 text-[11px] font-mono text-muted-foreground hover:text-foreground focus-ring"
                >
                  Clear [Esc]
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-secondary/80 px-2 py-0.5 font-mono text-[10px] text-muted-foreground pointer-events-none">
                /
              </kbd>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40" role="group" aria-label="Filter by discipline">
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
                  aria-pressed={isSelected}
                  onClick={() => setSelectedDomain(opt.key)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono transition-colors focus-ring ${
                    isSelected
                      ? 'border-foreground bg-foreground text-background font-semibold shadow-sm'
                      : 'border-border/80 bg-secondary/20 text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  <span>{opt.label}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-background' : 'text-muted-foreground'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

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
              className="text-xs font-mono text-muted-foreground hover:text-foreground underline underline-offset-4 focus-ring"
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
              <p className="text-sm font-mono text-muted-foreground">{emptyMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('all');
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2 text-xs font-mono text-foreground hover:bg-secondary focus-ring"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </section>
      ) : (
        children
      )}
    </>
  );
}
