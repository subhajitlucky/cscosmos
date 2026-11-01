'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  BookOpen,
  FlaskConical,
  CheckSquare,
  Clock,
  ExternalLink,
  Lock,
  Layers,
  Globe,
  Code2,
} from 'lucide-react';
import { securityTopics } from '../data/topics';
import { TOPIC_BASE_PATH } from '../data/topic';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card/90 to-red-950/15 p-8 lg:p-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3.5 py-1 text-xs font-semibold text-red-500">
          <ShieldAlert className="h-4 w-4" />
          <span>CSCosmos Flagship Security Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
          Web Security{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">
            Demystified & Visualized
          </span>
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Master the bedrock browser isolation boundary: Same-Origin Policy, CORS preflights, XSS mitigations,
          anti-CSRF architectures, CSP Level 3, and modern defense-in-depth security headers.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href={`${TOPIC_BASE_PATH}/topics/same-origin-policy`}
            className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 text-sm font-bold shadow-md hover:opacity-90 transition-opacity"
          >
            <span>Start Curriculum</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={`${TOPIC_BASE_PATH}/lab`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <FlaskConical className="h-4 w-4 text-red-500" />
            <span>Security Lab</span>
          </Link>

          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <CheckSquare className="h-4 w-4 text-emerald-500" />
            <span>Practice Arena (52 Qs)</span>
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto border-t border-border/60">
          <div>
            <div className="text-2xl font-black text-foreground">8</div>
            <div className="text-xs text-muted-foreground">Deep-Dive Modules</div>
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">52</div>
            <div className="text-xs text-muted-foreground">Practice Questions</div>
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">5</div>
            <div className="text-xs text-muted-foreground">Interactive Sandboxes</div>
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">100%</div>
            <div className="text-xs text-muted-foreground">Free & Open Access</div>
          </div>
        </div>
      </div>

      {/* Curriculum Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Curriculum Modules</h2>
            <p className="text-sm text-muted-foreground">
              Progressive, concept-first deep dives into modern web security models.
            </p>
          </div>

          <Link
            href={`${TOPIC_BASE_PATH}/topics/same-origin-policy`}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:underline"
          >
            <span>Begin Chapter 1</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {securityTopics.map((topic, idx) => (
            <Link
              key={topic.id}
              href={`${TOPIC_BASE_PATH}/topics/${topic.id}`}
              className="group rounded-xl border border-border bg-card p-6 space-y-3 transition-all hover:border-red-500/50 hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-red-500">
                    MODULE 0{idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{topic.estimatedTime}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground group-hover:text-red-500 transition-colors">
                  {topic.name}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {topic.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
                <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground font-medium">
                  {topic.category}
                </span>

                <span className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:translate-x-0.5 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Feature Highlights Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lab Feature Card */}
        <div className="rounded-2xl border border-border bg-card p-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 w-fit">
              <FlaskConical className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Interactive Security Lab</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Test live CSP directive rules, evaluate CORS preflight matrices, test XSS payloads
              against multiple defense filters, and inspect SameSite cookie configurations.
            </p>
          </div>
          <Link
            href={`${TOPIC_BASE_PATH}/lab`}
            className="inline-flex items-center gap-2 font-bold text-xs text-red-500 hover:underline pt-2"
          >
            <span>Launch Interactive Lab</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Practice Arena Feature Card */}
        <div className="rounded-2xl border border-border bg-card p-7 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">52-Question Practice Arena</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Verify your security architecture instincts with 52 scenario-based questions spanning
              OWASP Top 10, RFC 6265bis cookie standards, and Fetch CORS specifications.
            </p>
          </div>
          <Link
            href={`${TOPIC_BASE_PATH}/problems`}
            className="inline-flex items-center gap-2 font-bold text-xs text-emerald-600 dark:text-emerald-400 hover:underline pt-2"
          >
            <span>Enter Practice Arena</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
