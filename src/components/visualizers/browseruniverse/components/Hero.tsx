'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
};

export default function Hero({ title, subtitle, primaryCta, secondaryCta }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/90 p-6 sm:p-10 shadow-glow">
      <div className="absolute inset-0 grid-accent opacity-60" aria-hidden />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3rem] text-accentSoft">BrowserLab</p>
          <motion.h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {title}
          </motion.h1>
          <p className="max-w-2xl text-base text-slate-300">{subtitle}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/browseruniverse/tour"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-accentSoft"
            >
              <Play size={16} /> {primaryCta}
            </Link>
            <Link
              href="/browseruniverse/sandbox"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-3 text-sm font-semibold text-white transition hover:border-accent/50 hover:text-accentSoft"
            >
              <ArrowRight size={16} /> {secondaryCta}
            </Link>
          </div>
        </div>
        <motion.div
          className="glass relative flex flex-col gap-3 rounded-2xl border border-border p-5 shadow-2xl"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.25rem] text-slate-400">
            Browser pipeline
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              'Network → bytes',
              'HTML tokenizer',
              'DOM + CSSOM',
              'Render tree',
              'Layout',
              'Paint',
              'Composite',
              'GPU',
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-border bg-base/70 px-3 py-2 text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-accent/20 p-4 text-sm text-white">
            <p className="font-semibold">Sandbox ready</p>
            <p className="text-slate-200">
              Live editors, mutation inspector, task queue visualizer, and GPU heatmaps all in one
              place.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
