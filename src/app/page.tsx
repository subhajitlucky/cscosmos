import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { domains, domainPath, type DomainKey } from '@/data/domains';
import { topics } from '@/data/topics';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'CSCosmos — A working library of computer science',
  description: siteConfig.description,
  openGraph: {
    title: 'CSCosmos — A working library of computer science',
    description: siteConfig.description,
    url: '/',
    siteName: siteConfig.name,
    type: 'website',
  },
};

const REBUILT_MODULES = [
  {
    number: '01',
    title: 'IT Fundamentals',
    href: '/corecs/fundamentals-of-it',
    description:
      'Computer organization, memory and storage, number systems, Boolean algebra, 8086 microprocessors, software, and MS Office.',
    stats: '7 topics · 140 drills · 3 tools',
    tag: 'Foundations',
  },
  {
    number: '02',
    title: 'C Programming',
    href: '/corecs/c-programming',
    description:
      'From the character set and control flow to pointers, structures, dynamic memory, files, and bitwise masks.',
    stats: '35 lessons · 41 drills · 2 labs',
    tag: 'Programming',
  },
  {
    number: '03',
    title: 'Operating Systems',
    href: '/corecs/operating-systems',
    description:
      'Processes, scheduling, virtual memory, paging, file systems, I/O, and the boundary between user programs and the kernel.',
    stats: '39 lessons · 39 drills · 3 labs',
    tag: 'Systems',
  },
  {
    number: '04',
    title: 'DBMS Foundations',
    href: '/corecs/dbms',
    description:
      'ER modeling, relational algebra, keys, normalization, transactions, recovery, concurrency, and distributed data.',
    stats: '32 lessons · 1,000 drills · 3 labs',
    tag: 'Data',
  },
  {
    number: '05',
    title: 'Computer Networks',
    href: '/corecs/computer-networks-internals-tcpip',
    description:
      'A packet’s journey through DNS, TCP, routing, congestion control, TLS, and the application layer.',
    stats: '50 concepts · packet simulator',
    tag: 'Networks',
  },
];

const PRINCIPLES = [
  {
    number: '01',
    title: 'Read the idea',
    text: 'A short explanation with a worked example, not a wall of definitions.',
  },
  {
    number: '02',
    title: 'Operate the model',
    text: 'Change an input in the lab and watch the system respond.',
  },
  {
    number: '03',
    title: 'Test the rule',
    text: 'Answer questions that check the concept, then read the reasoning.',
  },
];

function countDomain(domainKey: string) {
  const domainTopics = topics.filter(
    (topic) => topic.domain === domainKey || topic.crossListedDomains?.includes(domainKey as DomainKey),
  );
  return {
    active: domainTopics.filter((topic) => topic.status === 'active').length,
    total: domainTopics.length,
  };
}

export default function HomePage() {
  const liveTopics = topics.filter((topic) => topic.status === 'active').length;

  return (
    <div className="pb-20">
      <section className="page-container border-b border-border py-10 sm:py-14">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          CSCosmos / Computer science index
        </p>
        <div className="mt-5 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="max-w-[780px] font-serif text-[clamp(2.8rem,6vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance">
              A working library of computer science.
            </h1>
            <p className="mt-5 max-w-[650px] font-serif text-[1.1rem] leading-[1.75] text-muted-foreground">
              Each module starts with a question, builds the model, and lets you operate it. Read the
              notes, run the instrument, then test the rule.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/topics"
                className="inline-flex h-11 w-full items-center justify-between gap-2 bg-foreground px-5 text-[13px] font-semibold text-background transition-opacity hover:opacity-90 sm:w-auto sm:justify-center"
              >
                Browse live modules <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/corecs/fundamentals-of-it"
                className="inline-flex h-11 w-full items-center justify-between gap-2 border border-border px-5 text-[13px] font-semibold text-foreground transition-colors hover:border-foreground/40 sm:w-auto sm:justify-center"
              >
                Start with IT Fundamentals <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="border-t border-border pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              The catalog
            </p>
            <dl className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Topics</dt>
                <dd className="mt-1 font-serif text-3xl leading-none">{topics.length}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Live</dt>
                <dd className="mt-1 font-serif text-3xl leading-none">{liveTopics}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Domains</dt>
                <dd className="mt-1 font-serif text-3xl leading-none">{domains.length}</dd>
              </div>
            </dl>
            <p className="mt-4 max-w-[320px] text-[13px] leading-relaxed text-muted-foreground">
              Most of the catalog is still planned. The modules below are complete, reviewed, and open
              to use.
            </p>
          </div>
        </div>
      </section>

      <section className="page-container border-b border-border py-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Rebuilt from scratch
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Start with a module.
            </h2>
          </div>
          <Link href="/topics" className="inline-flex items-center gap-1.5 text-[12px] font-semibold hover:text-primary">
            See all live modules <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-7 border-t border-border">
          {REBUILT_MODULES.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group grid gap-3 border-b border-border px-1 py-5 transition-colors hover:bg-secondary/30 sm:grid-cols-[46px_minmax(0,1fr)_200px_auto] sm:items-center sm:gap-5"
            >
              <span className="font-mono text-[11px] text-muted-foreground">{module.number}</span>
              <span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-xl font-semibold group-hover:text-primary sm:text-2xl">
                    {module.title}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    {module.tag}
                  </span>
                </span>
                <span className="mt-1 block max-w-[720px] text-[13px] leading-relaxed text-muted-foreground">
                  {module.description}
                </span>
              </span>
              <span className="font-mono text-[10px] leading-snug text-muted-foreground sm:text-right">{module.stats}</span>
              <ArrowRight className="hidden h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
            </Link>
          ))}
        </div>
      </section>

      <section className="page-container border-b border-border py-10 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              The eight domains
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Browse by discipline.
            </h2>
          </div>
        </div>

        <div className="mt-7 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">
          {domains.map((domain, index) => {
            const counts = countDomain(domain.domainKey);
            return (
              <Link
                key={domain.domainKey}
                href={domainPath(domain.domainKey)}
                className={`group border-b border-border py-4 pr-4 transition-colors hover:bg-secondary/30 ${index % 2 === 0 ? 'sm:pr-6' : 'sm:border-l sm:pl-6'} ${index % 4 > 0 ? 'lg:border-l lg:pl-6' : ''}`}
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(index + 1).padStart(2, '0')} / {counts.active} live
                </span>
                <span className="mt-2 block font-serif text-lg font-semibold group-hover:text-primary">
                  {domain.name}
                </span>
                <span className="mt-1 block text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                  {domain.description}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                  {counts.total} topics <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="page-container py-10 sm:py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-2 max-w-[420px] font-serif text-3xl font-semibold tracking-[-0.03em]">
              Read it. Operate it. Prove you know it.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <div key={principle.number} className="border-t border-border pt-3">
                <p className="font-mono text-[10px] text-muted-foreground">{principle.number}</p>
                <h3 className="mt-2 font-serif text-lg font-semibold">{principle.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{principle.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
