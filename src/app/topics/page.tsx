'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { domains, domainPath, type DomainKey } from '@/data/domains';
import { topics } from '@/data/topics';

type DomainFilter = DomainKey | 'all';

export default function AllTopicsPage() {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState<DomainFilter>('all');
  const [showPlanned, setShowPlanned] = useState(false);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return topics.filter((topic) => {
      const matchesDomain =
        domain === 'all' ||
        topic.domain === domain ||
        topic.crossListedDomains?.includes(domain);
      const matchesStatus = showPlanned || topic.status === 'active';
      const matchesTerm =
        term.length === 0 ||
        topic.name.toLowerCase().includes(term) ||
        topic.slug.toLowerCase().includes(term) ||
        topic.tags.some((tag) => tag.toLowerCase().includes(term));
      return matchesDomain && matchesStatus && matchesTerm;
    });
  }, [domain, query, showPlanned]);

  const grouped = useMemo(() => {
    if (domain !== 'all') {
      const selected = domains.find((item) => item.domainKey === domain);
      return selected && filtered.length > 0 ? [{ domain: selected, topics: filtered }] : [];
    }
    return domains
      .map((item) => ({
        domain: item,
        topics: filtered.filter((topic) => topic.domain === item.domainKey),
      }))
      .filter((group) => group.topics.length > 0);
  }, [domain, filtered]);

  const liveCount = topics.filter((topic) => topic.status === 'active').length;

  return (
    <div className="page-container py-10 sm:py-14">
      <header className="border-b border-border pb-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          CSCosmos / Catalog
        </p>
        <div className="mt-3 grid gap-6 md:grid-cols-[1fr_280px] md:items-end">
          <div>
            <h1 className="font-serif text-[clamp(2.8rem,6vw,4.8rem)] font-semibold leading-none tracking-[-0.04em]">
              All Topics
            </h1>
            <p className="mt-4 max-w-2xl font-serif text-[1rem] leading-relaxed text-muted-foreground">
              {liveCount} complete modules, with planned topics hidden by default. Search by name, tag,
              or slug.
            </p>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3 md:block md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Showing
            </span>
            <span className="ml-2 font-serif text-2xl leading-none sm:text-3xl">{filtered.length}</span>
            <span className="ml-1 font-mono text-[10px] text-muted-foreground">
              of {topics.length}
            </span>
          </div>
        </div>
      </header>

      <section className="border-b border-border py-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,220px)_1fr] lg:items-end">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Search
            </span>
            <span className="mt-2 flex items-center gap-2 border-b border-border-strong pb-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Topic, tag, or slug"
                className="w-full bg-transparent font-serif text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search topics"
              />
            </span>
          </label>

          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Discipline
            </span>
            <select
              value={domain}
              onChange={(event) => setDomain(event.target.value as DomainFilter)}
              className="mt-2 w-full border-0 border-b border-border-strong bg-transparent pb-2 font-mono text-[11px] text-foreground outline-none"
              aria-label="Filter by discipline"
            >
              <option value="all">All disciplines</option>
              {domains.map((item) => (
                <option key={item.domainKey} value={item.domainKey}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center justify-start gap-2 lg:justify-end">
            <button
              type="button"
              onClick={() => setShowPlanned((value) => !value)}
              className="border border-border px-3 py-2 text-[10px] font-mono uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
              aria-pressed={showPlanned}
            >
              {showPlanned ? 'Hide planned' : `Show planned (${topics.length - liveCount})`}
            </button>
          </div>
        </div>
      </section>

      <div>
        {grouped.map((group, groupIndex) => {
          const groupLive = group.topics.filter((topic) => topic.status === 'active').length;
          return (
            <section key={group.domain.domainKey} className="border-b border-border">
              <div className="flex flex-wrap items-baseline justify-between gap-2 py-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(groupIndex + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-2xl font-semibold tracking-[-0.03em]">
                    {group.domain.name}
                  </h2>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {groupLive} live / {group.topics.length} shown
                </span>
              </div>

              <div>
                {group.topics.map((topic) => {
                  const isLive = topic.status === 'active';
                  return (
                    <Link
                      key={topic.catalogId}
                      href={topic.canonicalPath}
                      className="group grid gap-2 border-t border-border py-4 transition-colors hover:bg-secondary/30 sm:grid-cols-[minmax(0,1fr)_220px_110px_24px] sm:items-center sm:gap-5"
                    >
                      <span className="min-w-0">
                        <span className="block font-sans text-[15px] font-semibold leading-snug group-hover:text-primary">
                          {topic.name}
                        </span>
                        {topic.tags.length > 0 && (
                          <span className="mt-1 block truncate font-mono text-[10px] text-muted-foreground">
                            {topic.tags.slice(0, 4).join(' · ')}
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {topic.difficulty} · {topic.estimatedMinutes} min
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.08em]">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 bg-emerald-500" />
                            Live
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Planned</span>
                        )}
                      </span>
                      <ArrowRight className="hidden h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {grouped.length === 0 && (
        <div className="py-16 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">No match</p>
          <p className="mt-2 font-serif text-2xl font-semibold">Try a broader search.</p>
        </div>
      )}

      <p className="mt-6 font-mono text-[10px] leading-relaxed text-muted-foreground">
        Planned topics open an in-development page. Live topics are complete modules.
      </p>
    </div>
  );
}
