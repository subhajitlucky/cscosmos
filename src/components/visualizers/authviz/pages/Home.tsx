'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckSquare,
  FlaskConical,
  Key,
  Lock,
  PlayCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AUTH_TOPICS } from '../data/topics';

export default function Home() {
  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Hero Header */}
      <section className="flex flex-col items-center gap-6 py-6 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Authentication &amp; Identity Architecture · {AUTH_TOPICS.length} Lessons</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground"
        >
          Master Modern Identity
          <br />
          <span className="text-emerald-600 dark:text-emerald-400">
            OAuth 2.0, JWTs &amp; Zero Trust
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
        >
          A visual, step-by-step deep dive into what happens when users authenticate — from OAuth 2.0 PKCE verifiers and asymmetric RS256 JWTs to WebAuthn Passkeys, SameSite cookies, RBAC engines, and Zero Trust security.
        </motion.p>

        {/* 3 Main Action Buttons */}
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 pt-2"
        >
          <Link
            href="/authviz/concepts"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-7 py-3.5 text-base font-bold text-white transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Start Curriculum <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/authviz/lab"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <FlaskConical className="w-4 h-4 text-emerald-500" /> Simulation Lab
          </Link>
          <Link
            href="/authviz/problems"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <CheckSquare className="w-4 h-4 text-emerald-500" /> Practice (60 Qs)
          </Link>
        </motion.div>

        {/* 3 Main Navbar Feature Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left w-full">
          <Link
            href="/authviz/concepts"
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/40 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit">
                <BookOpen className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
                Core Concepts
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                30 structured lessons covering authentication foundations, session lifecycles, OAuth 2.0 PKCE, RS256 JWTs, cookies vs tokens, RBAC, and Zero Trust.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-foreground">
              <span>View Full Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/authviz/lab"
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/40 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit">
                <FlaskConical className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
                Simulation Lab
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                11 interactive security visualizers: PKCE, JWT inspector, cookie security, session lifecycle, token rotation, RBAC, IDOR, and hashing.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Launch Studio</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/authviz/problems"
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/40 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
                  Practice Problems
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  60 Qs
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Evaluate and reinforce your security engineering understanding with instant feedback.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Start Practice</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* 3 Core Identity Pillars Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: ShieldCheck,
            title: 'Authentication & MFA',
            desc: 'OAuth 2.0 PKCE authorization flows, OpenID Connect user claims, hardware WebAuthn Passkeys, and TOTP RFC 6238 timesteps.',
          },
          {
            icon: Key,
            title: 'Cryptographic Signatures',
            desc: 'Asymmetric RS256 JWT signatures, JWKS public key rotation, and memory-hard Argon2id password hashing.',
          },
          {
            icon: Lock,
            title: 'Policy & Transport Defense',
            desc: 'HttpOnly SameSite cookies, RBAC/ABAC dynamic decision points, and Zero Trust mTLS microservices.',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="p-6 border border-border/80 rounded-2xl bg-card shadow-xs space-y-3"
          >
            <item.icon className="w-8 h-8 text-emerald-500 mb-2" />
            <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Bottom Call to Action */}
      <section className="text-center py-8 space-y-4 max-w-xl mx-auto border-t border-border/80">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Ready to Master Modern Identity?
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
          Begin with Lesson 1 to master the OAuth 2.0 Authorization Code Flow with PKCE, or test your skills in the simulation lab.
        </p>
        <div className="pt-2">
          <Link
            href={`/authviz/concepts/${AUTH_TOPICS[0].id}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <PlayCircle className="w-5 h-5" /> Start Lesson 1: PKCE Flow
          </Link>
        </div>
      </section>
    </div>
  );
}
