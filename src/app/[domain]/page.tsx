import Link from 'next/link';
import { notFound } from 'next/navigation';
import { domains, domainPath, type DomainKey } from '@/data/domains';
import { topics, type Topic } from '@/data/topics';

const FULLSTACK_SECTIONS = [
  { id: 'foundations', name: 'Foundations', description: 'The web platform: protocols, markup, styles, language, and the browser.' },
  { id: 'frontend', name: 'Frontend Engineering', description: 'Building the interface: components, state, forms, performance, and tests.' },
  { id: 'backend', name: 'Backend Engineering', description: 'Servers, APIs, data, jobs, and real-time communication.' },
  { id: 'architecture', name: 'Architecture & Product', description: 'How the pieces fit together and connect to real product services.' },
] as const;

const FULLSTACK_RELATED_DOMAINS: DomainKey[] = ['devops', 'security', 'advanced', 'ai', 'corecs'];

function TopicRows({ items, currentDomain }: { items: Topic[]; currentDomain: DomainKey }) {
  if (items.length === 0) return null;
  return (
    <div className="border-t border-border">
      {items.map((topic) => {
        const isLive = topic.status === 'active';
        return (
          <Link
            key={topic.catalogId}
            href={topic.canonicalPath}
            className="group grid gap-2 border-b border-border py-3.5 transition-colors hover:bg-secondary/30 sm:grid-cols-[minmax(0,1fr)_200px_100px_20px] sm:items-center sm:gap-4"
          >
            <span className="min-w-0">
              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="font-sans text-[14px] font-semibold leading-snug group-hover:text-primary">
                  {topic.name}
                </span>
                {topic.domain !== currentDomain && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                    also in {topic.domain}
                  </span>
                )}
              </span>
              {topic.tags.length > 0 && (
                <span className="mt-0.5 block truncate font-mono text-[9px] text-muted-foreground">
                  {topic.tags.slice(0, 4).join(' · ')}
                </span>
              )}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              {topic.difficulty} · {topic.estimatedMinutes} min
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.08em]">
              {isLive ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 bg-emerald-500" /> Live
                </span>
              ) : (
                <span className="text-muted-foreground">Planned</span>
              )}
            </span>
            <span className="hidden justify-end sm:flex">
              <span className="text-muted-foreground transition-transform group-hover:translate-x-1">→</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-3">
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return domains.map((domain) => ({ domain: domain.domainKey }));
}

export default async function DomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: domainKey } = await params;
  const domain = domains.find((item) => item.domainKey === domainKey);
  if (!domain) notFound();

  const domainTopics = topics.filter(
    (topic) => topic.domain === domain.domainKey || topic.crossListedDomains?.includes(domain.domainKey),
  );
  const owned = domainTopics.filter((topic) => topic.domain === domain.domainKey);
  const shared = domainTopics.filter((topic) => topic.domain !== domain.domainKey);
  const liveOwned = owned.filter((topic) => topic.status === 'active');
  const plannedOwned = owned.filter((topic) => topic.status === 'coming-soon');
  const liveShared = shared.filter((topic) => topic.status === 'active');
  const plannedShared = shared.filter((topic) => topic.status === 'coming-soon');
  const isFullstack = domain.domainKey === 'fullstack';
  const coreTopics = liveOwned.filter((topic) => !topic.curriculumTags?.includes('elective'));
  const electiveTopics = liveOwned.filter((topic) => topic.curriculumTags?.includes('elective'));

  return (
    <div className="page-container py-10 pb-20 sm:py-14">
      <header className="border-b border-border pb-7">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          CSCosmos / {domain.name}
        </p>
        <div className="mt-3 grid gap-5 md:grid-cols-[1fr_220px] md:items-end">
          <div>
            <h1 className="font-serif text-[clamp(2.6rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.04em]">
              {domain.name}
            </h1>
            <p className="mt-4 max-w-2xl font-serif text-[1rem] leading-relaxed text-muted-foreground">
              {domain.description}
            </p>
          </div>
          <div className="border-t border-border pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              {liveOwned.length} live / {owned.length} planned
            </p>
            <p className="mt-1 font-serif text-sm text-muted-foreground">
              {shared.length > 0 ? `${shared.length} linked from other domains` : 'No cross-listed topics'}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-10">
        {isFullstack ? (
          <>
            {FULLSTACK_SECTIONS.map((section, index) => {
              const sectionTopics = coreTopics.filter((topic) => topic.curriculumTags?.includes(section.id));
              if (sectionTopics.length === 0) return null;
              return (
                <section key={section.id} className="space-y-3">
                  <SectionTitle eyebrow={`Core 0${index + 1}`} title={section.name} description={section.description} />
                  <TopicRows items={sectionTopics} currentDomain={domain.domainKey} />
                </section>
              );
            })}
            {electiveTopics.length > 0 && (
              <section className="space-y-3">
                <SectionTitle eyebrow="Optional" title="Electives" description="Pick the tools that fit your stack. You do not need all of them." />
                <TopicRows items={electiveTopics} currentDomain={domain.domainKey} />
              </section>
            )}
          </>
        ) : (
          <section className="space-y-3">
            <SectionTitle eyebrow="Live modules" title="Complete and open to use" description="These are built, reviewed, and available now." />
            <TopicRows items={liveOwned} currentDomain={domain.domainKey} />
          </section>
        )}

        {liveShared.length > 0 && (
          <section className="space-y-3">
            <SectionTitle eyebrow="Linked" title="Also available here" description="These topics live in another domain and are linked from this one." />
            <TopicRows items={liveShared} currentDomain={domain.domainKey} />
          </section>
        )}

        {plannedOwned.length + plannedShared.length > 0 && (
          <details className="border border-border">
            <summary className="cursor-pointer list-none px-4 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:text-foreground">
              Show {plannedOwned.length + plannedShared.length} planned topics
            </summary>
            <div className="border-t border-border px-4 pb-2">
              <TopicRows items={[...plannedOwned, ...plannedShared]} currentDomain={domain.domainKey} />
            </div>
          </details>
        )}

        {isFullstack && (
          <section className="border-t border-border pt-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Related domains</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {FULLSTACK_RELATED_DOMAINS.map((key) => {
                const related = domains.find((item) => item.domainKey === key);
                if (!related) return null;
                return (
                  <Link key={key} href={domainPath(key)} className="text-[12px] font-medium hover:text-primary">
                    {related.name} →
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
