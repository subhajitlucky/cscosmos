'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { TOPIC_BASE_PATH } from '../data/topic';
import { topics } from '../data/topics';

const TRACE = [
  { label: 'DNS', value: 'example.com → 93.184.216.34', tone: 'text-slate-400' },
  { label: 'TCP', value: ':443 · connection established', tone: 'text-slate-400' },
  { label: 'TLS', value: '1.3 · encrypted', tone: 'text-emerald-400' },
  { label: 'GET', value: '/index.html · HTTP/1.1', tone: 'text-primary' },
  { label: 'CACHE', value: 'MISS → origin', tone: 'text-amber-400' },
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
            href={`${TOPIC_BASE_PATH}/playground`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Play size={18} /> Open playground
          </Link>
        </motion.div>

        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {topics.length} modules · hands-on labs · self-paced
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
    </div>
  );
};

export default Home;
