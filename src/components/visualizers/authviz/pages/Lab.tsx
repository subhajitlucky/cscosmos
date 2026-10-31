'use client';

import React, { useState } from 'react';
import {
  Clock,
  Cookie,
  Database,
  FileCheck,
  Fingerprint,
  FlaskConical,
  Key,
  KeyRound,
  Lock,
  RefreshCw,
  Repeat,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from 'lucide-react';
import { OAuthPkceVisualizer } from '../components/OAuthPkceVisualizer';
import { JwtSignatureVisualizer } from '../components/JwtSignatureVisualizer';
import { SessionVsTokenVisualizer } from '../components/SessionVsTokenVisualizer';
import { SessionLifecycleVisualizer } from '../components/SessionLifecycleVisualizer';
import { RefreshTokenRotationVisualizer } from '../components/RefreshTokenRotationVisualizer';
import { RbacAbacVisualizer } from '../components/RbacAbacVisualizer';
import { IdorBolaVisualizer } from '../components/IdorBolaVisualizer';
import { PasswordHashingVisualizer } from '../components/PasswordHashingVisualizer';
import { WebAuthnPasskeyVisualizer } from '../components/WebAuthnPasskeyVisualizer';
import { TotpMfaVisualizer } from '../components/TotpMfaVisualizer';
import { JwksRotationVisualizer } from '../components/JwksRotationVisualizer';

type StationId =
  | 'pkce'
  | 'jwt'
  | 'cookies'
  | 'session-lifecycle'
  | 'token-rotation'
  | 'rbac'
  | 'idor-bola'
  | 'hashing'
  | 'passkeys'
  | 'totp'
  | 'jwks';

interface StationMeta {
  id: StationId;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const STATIONS: StationMeta[] = [
  {
    id: 'pkce',
    name: 'OAuth 2.0 PKCE',
    badge: 'RFC 7636',
    icon: KeyRound,
    description: 'Code Verifiers, S256 SHA-256 challenges, and zero-secret token exchange.',
  },
  {
    id: 'jwt',
    name: 'JWT Signature Lab',
    badge: 'RS256 vs None',
    icon: Key,
    description: 'Base64URL Header/Payload claims and "alg: none" signature verification.',
  },
  {
    id: 'cookies',
    name: 'Cookies vs Tokens',
    badge: 'XSS & CSRF',
    icon: Cookie,
    description: 'Compare HttpOnly SameSite cookies against LocalStorage Bearer tokens.',
  },
  {
    id: 'session-lifecycle',
    name: 'Session Lifecycle',
    badge: 'Idle & Expiry',
    icon: Clock,
    description: 'Simulate idle timeouts, absolute expiration windows, and session fixation defense.',
  },
  {
    id: 'token-rotation',
    name: 'Token Rotation',
    badge: 'RFC 9700 BCP',
    icon: Repeat,
    description: 'Single-use refresh token exchange and automatic token family replay revocation.',
  },
  {
    id: 'rbac',
    name: 'RBAC vs ABAC Engine',
    badge: 'Policy Engine',
    icon: UserCheck,
    description: 'Role-based access versus dynamic departmental and contextual attributes.',
  },
  {
    id: 'idor-bola',
    name: 'IDOR & BOLA Lab',
    badge: 'OWASP API #1',
    icon: ShieldAlert,
    description: 'Test resource ID tampering and enforce multi-tenant database authorization boundaries.',
  },
  {
    id: 'hashing',
    name: 'Password Hashing',
    badge: 'Argon2id & bcrypt',
    icon: Lock,
    description: 'Benchmark memory hardness (m_cost), salt entropy, and GPU resistance.',
  },
  {
    id: 'passkeys',
    name: 'WebAuthn Passkeys',
    badge: 'FIDO2 Hardware',
    icon: Fingerprint,
    description: 'Biometric hardware key pairs, origin binding, and phishing defense.',
  },
  {
    id: 'totp',
    name: 'TOTP RFC 6238 MFA',
    badge: '30s Timesteps',
    icon: Zap,
    description: 'Shared Base32 secret, UNIX epoch timesteps, and HMAC-SHA1 codes.',
  },
  {
    id: 'jwks',
    name: 'JWKS Key Rotation',
    badge: 'RFC 7517',
    icon: RefreshCw,
    description: 'Public RSA/EC key distribution, key IDs (kid), and cache invalidation.',
  },
];

export default function Lab() {
  const [activeStation, setActiveStation] = useState<StationId>('pkce');

  const currentStation = STATIONS.find((s) => s.id === activeStation) ?? STATIONS[0];

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/60 text-foreground text-xs font-mono font-semibold">
            <FlaskConical className="w-3.5 h-3.5 text-emerald-500" />
            <span>Interactive Security Lab Suite · 11 Stations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Identity Simulation Lab
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Test and inspect core cryptographic primitives across 11 dedicated stations — PKCE verifiers, JWT signatures, session lifecycles, refresh token rotation, IDOR defenses, and memory-hard password hashing.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl border border-border bg-card text-xs font-mono text-muted-foreground hidden sm:block">
          ACTIVE STATION: <span className="font-bold text-emerald-500 uppercase">{currentStation.name}</span>
        </div>
      </div>

      {/* Station Tabs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2">
        {STATIONS.map((station) => {
          const Icon = station.icon;
          const isActive = activeStation === station.id;

          return (
            <button
              key={station.id}
              onClick={() => setActiveStation(station.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                isActive
                  ? 'border-emerald-500 bg-emerald-500/10 text-foreground font-bold shadow-xs'
                  : 'border-border/70 bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted/70 text-foreground">
                  {station.badge}
                </span>
              </div>
              <span className="text-xs truncate font-semibold">{station.name}</span>
            </button>
          );
        })}
      </div>

      {/* Station Description Banner */}
      <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-mono font-bold text-foreground">
            {currentStation.name} · {currentStation.badge}
          </div>
          <p className="text-xs text-muted-foreground">{currentStation.description}</p>
        </div>
        <div className="text-[11px] font-mono text-muted-foreground shrink-0">
          Station Mode: <span className="text-emerald-500 font-bold">ONLINE</span>
        </div>
      </div>

      {/* Active Visualizer Component */}
      <div className="pt-2">
        {activeStation === 'pkce' && <OAuthPkceVisualizer />}
        {activeStation === 'jwt' && <JwtSignatureVisualizer />}
        {activeStation === 'cookies' && <SessionVsTokenVisualizer />}
        {activeStation === 'session-lifecycle' && <SessionLifecycleVisualizer />}
        {activeStation === 'token-rotation' && <RefreshTokenRotationVisualizer />}
        {activeStation === 'rbac' && <RbacAbacVisualizer />}
        {activeStation === 'idor-bola' && <IdorBolaVisualizer />}
        {activeStation === 'hashing' && <PasswordHashingVisualizer />}
        {activeStation === 'passkeys' && <WebAuthnPasskeyVisualizer />}
        {activeStation === 'totp' && <TotpMfaVisualizer />}
        {activeStation === 'jwks' && <JwksRotationVisualizer />}
      </div>
    </div>
  );
}
