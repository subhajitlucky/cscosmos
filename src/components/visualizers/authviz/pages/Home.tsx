'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  CheckSquare,
  Cookie,
  Database,
  Fingerprint,
  HelpCircle,
  Key,
  KeyRound,
  Layers,
  Lock,
  Play,
  PlayCircle,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck,
  Zap,
} from 'lucide-react';
import { AUTH_TOPICS, type AuthTopic } from '../data/topics';

interface HandshakeStep {
  id: string;
  stepNum: string;
  stage: string;
  protocol: string;
  actor: 'Client (SPA)' | 'IdP / Auth Server' | 'Resource API';
  command: string;
  codeSnippet: string;
  defense: string;
  detail: string;
}

const HANDSHAKE_TRACE: HandshakeStep[] = [
  {
    id: 'pkce-verifier',
    stepNum: '01',
    stage: 'Code Verifier Generation',
    protocol: 'RFC 7636 §4.1',
    actor: 'Client (SPA)',
    command: 'crypto.getRandomValues(new Uint8Array(32))',
    codeSnippet: 'const codeVerifier = base64url(randomBytes(32));\n// 64-char high-entropy string kept strictly in memory',
    defense: 'Never leaves the browser during initial navigation; eliminates shared secrets in public clients.',
    detail: 'The single-page app creates a cryptographically random string (code verifier) before initiating the authorization redirect.',
  },
  {
    id: 's256-challenge',
    stepNum: '02',
    stage: 'SHA-256 Code Challenge',
    protocol: 'RFC 7636 S256',
    actor: 'Client (SPA)',
    command: 'code_challenge = BASE64URL(SHA256(code_verifier))',
    codeSnippet: 'GET /authorize?response_type=code\n  &client_id=spaclient\n  &code_challenge=E9Melhoa2OwvFrEMTJgu...\n  &code_challenge_method=S256\n  &state=c3f81e92',
    defense: 'One-way SHA-256 transformation; intercepting the authorization URL gives an attacker zero token power.',
    detail: 'Only the one-way hash of the verifier is sent over the browser URL query, coupled with a browser-bound CSRF state cookie.',
  },
  {
    id: 'idp-consent',
    stepNum: '03',
    stage: 'IdP Authentication & MFA',
    protocol: 'OIDC Core 1.0',
    actor: 'IdP / Auth Server',
    command: 'VERIFY user_creds + WebAuthn/TOTP + RECORD(challenge, client_id)',
    codeSnippet: 'POST /login { user, pass, webauthn_assertion }\n// Authorization server binds code_challenge to pending authorization session',
    defense: 'Hardware WebAuthn Passkeys or TOTP timesteps defend against credential stuffing and phishing attacks.',
    detail: 'The authorization server validates the identity of the human user and saves the code challenge against the issued session.',
  },
  {
    id: 'auth-code',
    stepNum: '04',
    stage: 'Single-Use Auth Code Callback',
    protocol: 'OAuth 2.0 RFC 6749',
    actor: 'IdP / Auth Server',
    command: '302 REDIRECT /callback?code=splat_auth_code_9824f8d2&state=c3f81e92',
    codeSnippet: 'HTTP/1.1 302 Found\nLocation: https://app.corp.io/callback?code=splat_auth_code_9824f8d2&state=c3f81e92',
    defense: 'Short TTL (60s max) and strictly single-use; redeemed once and immediately invalidated.',
    detail: 'The browser receives a short-lived authorization code. The client validates the returned state before continuing.',
  },
  {
    id: 'token-exchange',
    stepNum: '05',
    stage: 'PKCE Token Exchange',
    protocol: 'POST /oauth/token',
    actor: 'Client (SPA)',
    command: 'POST /oauth/token { code, code_verifier, client_id }',
    codeSnippet: 'POST /oauth/token HTTP/1.1\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=authorization_code\n&code=splat_auth_code_9824f8d2\n&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
    defense: 'Server hashes code_verifier with SHA-256 and compares to stored code_challenge. Intercepted codes cannot be redeemed without the verifier.',
    detail: 'Direct back-channel HTTP POST. The authorization server computes SHA-256 on the submitted verifier to verify ownership.',
  },
  {
    id: 'rs256-signature',
    stepNum: '06',
    stage: 'RS256 JWT Signature Issuance',
    protocol: 'RFC 7515 / JWKS RFC 7517',
    actor: 'IdP / Auth Server',
    command: 'jwt.sign(payload, idp_rsa_private_key, { algorithm: "RS256", kid: "key_2026_01" })',
    codeSnippet: '{\n  "access_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleV8yMDI2XzAxIn0.eyJzdWIiOiJ1c3JfOTQyIiwiYXVkIjoiaHR0cHM6Ly9hcGkuY29ycC5pbyJ9.C_7u...\",\n  "token_type": "Bearer",\n  "expires_in": 900\n}',
    defense: 'Asymmetric cryptography: IdP signs with private key; resource microservices verify using public JWKS without sharing private keys.',
    detail: 'The IdP generates a signed RS256 JWT containing sub, aud, iss, exp, and role claims for downstream verification.',
  },
  {
    id: 'rbac-gateway',
    stepNum: '07',
    stage: 'Gateway Verification & RBAC Access',
    protocol: 'RFC 6750 / RBAC Engine',
    actor: 'Resource API',
    command: 'VERIFY jwt.signature WITH jwks[kid] && CHECK_POLICY(user.role, "resource:read")',
    codeSnippet: 'GET /api/v1/financial-reports HTTP/1.1\nAuthorization: Bearer eyJhbGciOiJSUzI1NiIs...\n\nHTTP/1.1 200 OK\n{ "status": "authorized", "role": "security_lead" }',
    defense: 'Microservices verify tokens in < 1ms via cached JWKS keys, then enforce strict role and scope checks before executing queries.',
    detail: 'The resource server validates signature integrity, clock expiration, audience matching, and permission grants before serving data.',
  },
];

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All Lessons (19)',
  'oauth-oidc': 'OAuth 2.0 & OIDC (4)',
  'jwt-tokens': 'JWT & Signatures (2)',
  'sessions-cookies': 'Sessions & Cookies (5)',
  'authz-rbac': 'Authorization & RBAC (2)',
  'cryptography-passwords': 'Cryptography & Passwords (5)',
  'resilience-security': 'Resilience & Defense (1)',
};

export default function Home() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const activeStep = HANDSHAKE_TRACE[activeStepIndex];

  const filteredTopics = selectedCategory === 'all'
    ? AUTH_TOPICS
    : AUTH_TOPICS.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-16 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 py-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
        >
          <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
          <span>Security &amp; Identity Engineering · {AUTH_TOPICS.length} Architectural Lessons</span>
          <span className="h-px w-8 bg-emerald-500" aria-hidden="true" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground"
        >
          Authentication &amp; Identity Architecture
          <br />
          <span className="text-emerald-600 dark:text-emerald-400">from PKCE to Passkeys</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
        >
          A rigorous visual exploration of modern identity systems — from OAuth 2.0 PKCE verifiers and asymmetric RS256 JWTs to WebAuthn Passkeys, SameSite cookies, RBAC engines, and Zero Trust mTLS.
        </motion.p>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 pt-2"
        >
          <Link
            href="/authviz/concepts"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-7 py-3.5 text-base font-bold text-white transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Start Curriculum ({AUTH_TOPICS.length} Lessons) <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/authviz/pkce-lab"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <KeyRound className="w-4 h-4 text-emerald-500" /> Interactive PKCE Lab
          </Link>
          <Link
            href="/authviz/flashcards"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-base font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <HelpCircle className="w-4 h-4 text-emerald-500" /> Security Flashcards
          </Link>
        </motion.div>

        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {AUTH_TOPICS.length} Architectural Lessons · 5 Dedicated Testing Studios · 24 Architect Flashcards · Zero Secrets
        </p>

        {/* 3 Main Hub Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left w-full">
          <Link
            href="/authviz/concepts"
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit">
                <BookOpen className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
                Core Curriculum
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                19 architectural deep dives: OAuth 2.0 PKCE, RS256 JWTs, WebAuthn, SAML 2.0, mTLS, and RBAC/ABAC policy engines.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-foreground">
              <span>View Full Syllabus</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/authviz/pkce-lab"
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
                Interactive Security Studios
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                5 sandboxes: Step through PKCE verifiers, tamper with JWT headers, test HttpOnly cookies vs tokens, and benchmark Argon2id.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Launch Studio Suite</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/authviz/flashcards"
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:bg-muted/40 hover:border-emerald-500/40 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-muted text-foreground w-fit">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors">
                  Interview Flashcards
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  24 Scenarios
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Master high-stakes Security Architect interview questions: JWT &quot;none&quot; exploits, JWKS key caching, and CSRF SameSite nuances.
              </p>
            </div>
            <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Practice Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* The Identity Lifecycle Showcase: End-to-End */}
      <section className="grid gap-8 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-10">
        <div className="flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Architectural Handshake Trace</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              One identity handshake, end to end.
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Every stage maps to a defense-in-depth RFC standard. Step through the live PKCE token exchange, asymmetric RS256 signature verification, and RBAC policy enforcement.
            </p>
          </div>

          {/* 3 Pillars List */}
          <div className="space-y-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
            <div className="flex items-center gap-3 border-t border-border/70 pt-3">
              <span className="font-bold text-emerald-500">01</span>
              <span className="text-foreground">Token Issuance &amp; PKCE Verification (RFC 7636)</span>
            </div>
            <div className="flex items-center gap-3 border-t border-border/70 pt-3">
              <span className="font-bold text-emerald-500">02</span>
              <span className="text-foreground">Asymmetric RS256 &amp; Public JWKS Key Rotation</span>
            </div>
            <div className="flex items-center gap-3 border-t border-border/70 pt-3">
              <span className="font-bold text-emerald-500">03</span>
              <span className="text-foreground">Role-Based &amp; Attribute-Based Policy Enforcement</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/authviz/pkce-lab"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Explore the interactive PKCE visualizer studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Interactive Terminal Handshake Trace */}
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 font-mono text-xs text-slate-200 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>OAuth 2.0 PKCE + RS256 Trace</span>
            </span>
            <span>Step {activeStep.stepNum} of 07</span>
          </div>

          {/* Interactive Steps Pill Bar */}
          <div className="grid grid-cols-7 border-b border-slate-800 text-center text-[10px] divide-x divide-slate-800">
            {HANDSHAKE_TRACE.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`py-2 transition-colors ${
                  activeStepIndex === idx
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
                }`}
                title={step.stage}
              >
                {step.stepNum}
              </button>
            ))}
          </div>

          {/* Step Body */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                {activeStep.stepNum}. {activeStep.stage}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded border border-slate-700 bg-slate-900 text-slate-400">
                {activeStep.actor}
              </span>
            </div>

            <div className="p-3 rounded bg-slate-900/90 border border-slate-800 space-y-1.5">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                Spec: {activeStep.protocol}
              </div>
              <pre className="text-[11px] text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
                {activeStep.codeSnippet}
              </pre>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Security Defense:
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {activeStep.defense}
              </p>
            </div>
          </div>

          {/* Step Footer Navigation Controls */}
          <div className="border-t border-slate-800 px-4 py-3 flex items-center justify-between text-[11px] text-slate-400">
            <button
              onClick={() => setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : HANDSHAKE_TRACE.length - 1))}
              className="hover:text-slate-200 transition-colors flex items-center gap-1 font-semibold"
            >
              ← Previous
            </button>
            <span className="text-slate-500 text-[10px]">
              Click any step to inspect payload
            </span>
            <button
              onClick={() => setActiveStepIndex((prev) => (prev < HANDSHAKE_TRACE.length - 1 ? prev + 1 : 0))}
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 font-semibold"
            >
              Next Step →
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Security Studios Grid (5 Dedicated Labs + WebAuthn) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold">
              <Key className="w-3.5 h-3.5 text-emerald-500" />
              <span>Hands-On Security Sandboxes</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Dedicated Interactive Testing Studios
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Break cryptographic signatures, intercept PKCE verifiers, simulate cookie injection, and benchmark memory hardness in dedicated sandboxes.
            </p>
          </div>
          <Link
            href="/authviz/pkce-lab"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-emerald-500 transition-colors"
          >
            <span>View All Labs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Studio 1: PKCE */}
          <Link
            href="/authviz/pkce-lab"
            className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-muted text-foreground group-hover:text-emerald-500 transition-colors">
                  <KeyRound className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  RFC 7636
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                OAuth 2.0 PKCE Studio
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate high-entropy Code Verifiers, compute SHA-256 S256 challenges, and step through authorization code token exchange with zero client secrets.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Launch PKCE Studio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Studio 2: JWT */}
          <Link
            href="/authviz/jwt-lab"
            className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-muted text-foreground group-hover:text-emerald-500 transition-colors">
                  <Key className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  RFC 7519
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                JWT Signature &amp; Exploit Inspector
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Decode Base64URL Header and Payload claims, simulate the famous &quot;alg: none&quot; signature vulnerability, and inspect asymmetric RS256 verification.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Launch JWT Inspector</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Studio 3: Session vs Token */}
          <Link
            href="/authviz/session-lab"
            className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-muted text-foreground group-hover:text-emerald-500 transition-colors">
                  <Cookie className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  XSS vs CSRF
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                Cookies vs Tokens Security Lab
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Compare HttpOnly SameSite=Lax cookies against LocalStorage Bearer tokens under simulated script injection (XSS) and cross-site forgery (CSRF).
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Launch Cookie Lab</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Studio 4: RBAC vs ABAC */}
          <Link
            href="/authviz/rbac-lab"
            className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-muted text-foreground group-hover:text-emerald-500 transition-colors">
                  <UserCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Policy Engine
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                RBAC vs ABAC Policy Engine
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Evaluate role assignments vs dynamic attribute policies (clearance, departmental boundary, time-of-day, and IP geographic constraints).
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Launch RBAC Engine</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Studio 5: Password Hashing */}
          <Link
            href="/authviz/hashing-lab"
            className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-muted text-foreground group-hover:text-emerald-500 transition-colors">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Argon2id
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                Password Hashing Benchmarker
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Benchmark memory-hardness (m_cost), time-hardness (t_cost), salt randomness, and GPU resistance across Argon2id, bcrypt, and PBKDF2.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Launch Hashing Studio</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Studio 6: WebAuthn Passkeys */}
          <Link
            href="/authviz/concepts/webauthn-passkeys-fido2"
            className="group p-6 rounded-2xl border border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-muted text-foreground group-hover:text-emerald-500 transition-colors">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  FIDO2 Passkeys
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                WebAuthn &amp; Biometric Passkeys
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deep dive into hardware authenticators, public-private key registration, WebAuthn challenge signing, and phishing resistance.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Explore Passkey Architecture</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Curriculum Syllabus & Learning Path (All 19 Lessons) */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              <span>Structured Syllabus</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              Comprehensive Identity Curriculum
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              19 architectural topics arranged sequentially from foundational protocols to enterprise Zero Trust infrastructure.
            </p>
          </div>
          <Link
            href="/authviz/concepts"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-emerald-500 transition-colors"
          >
            <span>Full Syllabus Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-card border border-border text-foreground hover:border-emerald-500/50 hover:bg-muted/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 19 Lessons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTopics.map((topic, index) => {
            const originalIndex = AUTH_TOPICS.findIndex((t) => t.id === topic.id) + 1;
            const formattedNum = originalIndex < 10 ? `0${originalIndex}` : `${originalIndex}`;

            return (
              <Link
                key={topic.id}
                href={`/authviz/concepts/${topic.id}`}
                className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-emerald-500/50 hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Lesson {formattedNum}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      topic.difficulty === 'Beginner'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : topic.difficulty === 'Intermediate'
                        ? 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20'
                        : topic.difficulty === 'Advanced'
                        ? 'bg-muted text-foreground border border-border'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-emerald-500 transition-colors line-clamp-2">
                    {topic.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {topic.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Start Interactive Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Architect Interview Flashcards Highlight */}
      <section className="rounded-2xl border border-border/80 bg-card p-6 md:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
              <span>High-Stakes Architecture Prep</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
              24 Security Architect Interview Flashcards
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Real architectural scenarios tested at top cloud platforms: JWT signature tampering, JWKS caching race conditions, and cross-site cookie leaks.
            </p>
          </div>

          <Link
            href="/authviz/flashcards"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-7 py-3.5 text-sm font-bold text-white transition-colors shadow-sm shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            Launch Flashcards <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Token Cryptography
            </div>
            <div className="text-sm font-bold text-foreground">JWT &quot;none&quot; &amp; RS256 / HS256 Confusion</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Why legacy parsers treated HS256 shared secrets as RS256 public keys and how modern middleware enforces explicit alg whitelisting.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
            <div className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
              High Availability
            </div>
            <div className="text-sm font-bold text-foreground">JWKS Key Rotation &amp; Cache Races</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              How to avoid cache-stampede DDoS when an IdP publishes a new key ID (kid) before downstream microservices invalidate their local cache.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-border/70 bg-muted/20 space-y-2">
            <div className="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
              Browser Security
            </div>
            <div className="text-sm font-bold text-foreground">SameSite=Lax Top-Level CSRF</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Why SameSite=Lax still attaches session cookies on top-level GET navigations, and why OAuth 2.0 still requires a browser-bound state cookie.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Action CTA */}
      <section className="text-center py-8 space-y-6 max-w-2xl mx-auto border-t border-border/80">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Ready to Master Modern Identity?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          Begin with Lesson 1 to master the OAuth 2.0 Authorization Code Flow with PKCE, or jump directly into any of our 5 interactive testing studios.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href={`/authviz/concepts/${AUTH_TOPICS[0].id}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <PlayCircle className="w-5 h-5" /> Start Lesson 1: PKCE Flow
          </Link>
          <Link
            href="/authviz/cheatsheet"
            className="inline-flex items-center gap-2 px-7 py-4 border border-border bg-card hover:bg-muted text-foreground rounded-xl font-bold text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Bookmark className="w-5 h-5 text-emerald-500" /> RFC Cheat Sheet
          </Link>
        </div>
      </section>
    </div>
  );
}
