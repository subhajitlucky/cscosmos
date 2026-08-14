'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Cookie, Database, Fingerprint, HelpCircle, Key, KeyRound, Lock, ShieldCheck, Sparkles, UserCheck, Zap } from 'lucide-react';
import { OAuthPkceVisualizer } from '../components/OAuthPkceVisualizer';
import { JwtSignatureVisualizer } from '../components/JwtSignatureVisualizer';
import { SessionVsTokenVisualizer } from '../components/SessionVsTokenVisualizer';
import { RbacAbacVisualizer } from '../components/RbacAbacVisualizer';
import { PasswordHashingVisualizer } from '../components/PasswordHashingVisualizer';

export default function Home() {
  return (
    <div className="space-y-12 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Authentication &amp; Identity Architecture Visualizer
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
          Master <span className="text-emerald-600 dark:text-emerald-400">OAuth 2.0, JWT &amp; Identity</span>.
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Interactive visualizers for OAuth 2.0 PKCE flows, JWT header/payload RS256 signature verification, HttpOnly SameSite cookie security vs LocalStorage XSS risks, RBAC vs ABAC policy engines, and Argon2id password hashing.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/authviz/concepts"
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" /> Explore 20 Concepts
          </Link>
          <Link
            href="/authviz/jwt-lab"
            className="px-6 py-3 rounded-2xl border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Key className="w-4 h-4" /> JWT Inspector
          </Link>
        </div>
      </div>

      {/* Feature 1: OAuth 2.0 PKCE Stepper */}
      <OAuthPkceVisualizer />

      {/* Feature 2: JWT Signature & Exploit Inspector */}
      <JwtSignatureVisualizer />

      {/* Feature 3: Cookies vs Tokens XSS Simulator */}
      <SessionVsTokenVisualizer />

      {/* Feature 4: RBAC vs ABAC Policy Engine */}
      <RbacAbacVisualizer />

      {/* Feature 5: Argon2id vs bcrypt Hashing Calculator */}
      <PasswordHashingVisualizer />

      {/* Navigation Cards */}
      <div className="grid sm:grid-cols-3 gap-6 pt-4">
        <Link
          href="/authviz/concepts"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            20 In-Depth Lessons
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            SAML 2.0, WebAuthn Passkeys, TOTP MFA, JWKS key rotation, CSRF synchronizer tokens, and mTLS Zero Trust.
          </p>
        </Link>

        <Link
          href="/authviz/pkce-lab"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            OAuth PKCE Lab
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Step through Code Verifiers, S256 SHA-256 challenges, and token exchanges with zero client secrets.
          </p>
        </Link>

        <Link
          href="/authviz/flashcards"
          className="p-6 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-lg transition-all space-y-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
            Security Flashcards
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Master tough Security Architect interview questions on JWT "none" exploits, JWKS caching, and Argon2id.
          </p>
        </Link>
      </div>
    </div>
  );
}
