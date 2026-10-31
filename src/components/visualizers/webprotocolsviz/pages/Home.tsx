'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { TOPIC_BASE_PATH } from '../data/topic';
import { topics } from '../data/topics';

const TRACE = [
  { label: 'DNS', value: 'example.com → 93.184.216.34', tone: 'text-slate-400' },
  { label: 'TCP', value: ':443 · connection established', tone: 'text-slate-400' },
  { label: 'TLS', value: '1.3 · encrypted', tone: 'text-emerald-400' },
  { label: 'GET', value: '/index.html · HTTP/1.1', tone: 'text-foreground' },
  { label: 'CACHE', value: 'MISS → origin', tone: 'text-slate-300' },
  { label: '200', value: 'OK · text/html · 14 KB', tone: 'text-emerald-400' },
];

const Home = () => {
  return (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col items-center gap-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          Protocol field guide · {topics.length} modules
        </motion.div>

        <motion.h1
          className="max-w-4xl text-5xl font-extrabold tracking-tight text-foreground md:text-7xl"
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          HTTP &amp; Web Protocols
          <br />
          <span className="italic text-primary">from socket to cache</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl text-xl text-muted-foreground"
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Trace one request from DNS and TCP through TLS, headers, and cache.
          Then break the exchange yourself in the playground.
        </motion.p>

        <motion.div
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <Link
            href={`${TOPIC_BASE_PATH}/path`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Start the path <ArrowRight size={18} />
          </Link>
          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <CheckSquare size={18} /> Practice (100 Qs)
          </Link>
          <Link
            href={`${TOPIC_BASE_PATH}/playground`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Play size={18} /> Open playground
          </Link>
        </motion.div>

        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {topics.length} modules · 100 practice problems · hands-on labs · self-paced
        </p>
      </section>

      <section className="grid gap-8 rounded-2xl border border-border bg-card p-8 md:grid-cols-2 md:p-12">
        <div className="flex flex-col justify-center gap-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              One request, end to end.
            </h2>
            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              Every module maps to a real step in the network path. Change a header,
              watch the cache flip, then inspect the response.
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <div className="flex items-center gap-3 border-t border-border/70 pt-3">
              <span className="text-primary">01</span>
              <span>DNS → TCP → TLS</span>
            </div>
            <div className="flex items-center gap-3 border-t border-border/70 pt-3">
              <span className="text-primary">02</span>
              <span>Headers, cache, and validation</span>
            </div>
            <div className="flex items-center gap-3 border-t border-border/70 pt-3">
              <span className="text-primary">03</span>
              <span>Build and inspect your own request</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-slate-500">
            <span>Request trace</span>
            <span>HTTPS</span>
          </div>
          <div className="divide-y divide-slate-800">
            {TRACE.map((row) => (
              <div key={row.label} className="flex items-center gap-4 px-4 py-3">
                <span className="w-12 shrink-0 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {row.label}
                </span>
                <span className={row.tone}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 px-4 py-3 text-[10px] text-slate-500">
            Then change the headers yourself in the playground.
          </div>
        </div>
      </section>

      {/* Practice Arena Highlight Section */}
      <section className="rounded-2xl border border-border/80 bg-card p-8 md:p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comprehensive System Evaluation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              100 Practice Problems, Curated Line-by-Line
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              From beginner HTTP grammar and status codes to RFC 9111 caching subtleties, CORS preflight edge cases,
              TLS 1.3 0-RTT replay hazards, and QUIC stream multiplexing.
            </p>
          </div>

          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 px-7 py-3.5 text-sm font-bold text-primary-foreground transition-colors shadow-xs shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Launch Practice Arena <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-wider">
              Beginner (Q1–Q33)
            </div>
            <div className="text-sm font-bold text-foreground">HTTP &amp; Network Foundations</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Client-server model, ports 80/443, request verbs, headers, status codes (200, 404, 500), and fundamental caching.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
            <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              Intermediate (Q34–Q85)
            </div>
            <div className="text-sm font-bold text-foreground">RFCs, Security &amp; Protocols</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Idempotency, 206 Partial, 304 Not Modified, stale-while-revalidate, CORS preflights, CSP, HTTP/2 multiplexing, and WebSockets.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
            <div className="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
              Advanced (Q86–Q100)
            </div>
            <div className="text-sm font-bold text-foreground">Systems Architecture &amp; Attacks</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              HTTP request smuggling, cache poisoning, 0-RTT replay security, QPACK stream decoupling, and TCP slow-start dynamics.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
