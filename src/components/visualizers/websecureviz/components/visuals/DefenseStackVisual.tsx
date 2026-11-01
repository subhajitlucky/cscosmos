'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Lock, FileSearch, Hash, VideoOff, EyeOff, Layers, Check, X } from 'lucide-react';

interface DefenseLayer {
  id: string;
  name: string;
  header: string;
  icon: React.ComponentType<{ className?: string }>;
  threatBlocked: string;
  enabled: boolean;
}

export function DefenseStackVisual() {
  const [layers, setLayers] = useState<DefenseLayer[]>([
    {
      id: 'hsts',
      name: 'HTTP Strict Transport Security (HSTS)',
      header: 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload',
      icon: Lock,
      threatBlocked: 'SSL-stripping & unencrypted plaintext MITM eavesdropping.',
      enabled: true,
    },
    {
      id: 'nosniff',
      name: 'MIME-Type Sniffing Protection',
      header: 'X-Content-Type-Options: nosniff',
      icon: FileSearch,
      threatBlocked: 'Malicious scripts disguised as harmless images or text files.',
      enabled: true,
    },
    {
      id: 'sri',
      name: 'Subresource Integrity (SRI)',
      header: 'integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"',
      icon: Hash,
      threatBlocked: 'Compromised third-party CDNs injecting modified JS into users.',
      enabled: true,
    },
    {
      id: 'referrer',
      name: 'Referrer Policy',
      header: 'Referrer-Policy: strict-origin-when-cross-origin',
      icon: EyeOff,
      threatBlocked: 'Leaking sensitive internal URL tokens and user parameters to external sites.',
      enabled: true,
    },
    {
      id: 'permissions',
      name: 'Permissions Policy',
      header: 'Permissions-Policy: camera=(), microphone=(), geolocation=()',
      icon: VideoOff,
      threatBlocked: 'Unauthorized hardware sensor access by embedded widgets or third-party ads.',
      enabled: false,
    },
  ]);

  const [simulatedAttack, setSimulatedAttack] = useState<string | null>(null);

  const toggleLayer = (id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l))
    );
  };

  const runSimulation = (threatType: 'mitm' | 'sniff' | 'cdn' | 'leak' | 'hardware') => {
    setSimulatedAttack(threatType);
  };

  const getAttackResult = () => {
    if (!simulatedAttack) return null;

    if (simulatedAttack === 'mitm') {
      const hsts = layers.find((l) => l.id === 'hsts')?.enabled;
      return {
        title: 'Man-in-the-Middle SSL Strip Attempt',
        blocked: hsts,
        message: hsts
          ? 'BLOCKED: HSTS forced the browser to upgrade the connection to HTTPS before transmitting any data over the network.'
          : 'COMPROMISED: Without HSTS, attacker intercepted the initial HTTP request and stripped TLS, intercepting plain passwords.',
      };
    }

    if (simulatedAttack === 'sniff') {
      const nosniff = layers.find((l) => l.id === 'nosniff')?.enabled;
      return {
        title: 'MIME-Sniffing Exploit (image.jpg containing JS)',
        blocked: nosniff,
        message: nosniff
          ? 'BLOCKED: nosniff ordered the browser to respect Content-Type: image/jpeg and refuse script execution.'
          : 'COMPROMISED: Browser inspected payload bytes and executed hidden JS payload disguised as an image!',
      };
    }

    if (simulatedAttack === 'cdn') {
      const sri = layers.find((l) => l.id === 'sri')?.enabled;
      return {
        title: 'Hacked CDN Injected Malicious Crypto-Miner',
        blocked: sri,
        message: sri
          ? 'BLOCKED: Browser computed cryptographic SHA-384 hash of incoming script; hash mismatch triggered immediate abort.'
          : 'COMPROMISED: Altered script from compromised CDN was executed in the victim browser without verification!',
      };
    }

    if (simulatedAttack === 'leak') {
      const ref = layers.find((l) => l.id === 'referrer')?.enabled;
      return {
        title: 'Cross-Origin Navigation Referrer Leak',
        blocked: ref,
        message: ref
          ? 'PROTECTED: strict-origin-when-cross-origin stripped sensitive URL path and query parameters.'
          : 'LEAKED: Full secret password-reset token inside URL query string was transmitted to third-party server.',
      };
    }

    if (simulatedAttack === 'hardware') {
      const perm = layers.find((l) => l.id === 'permissions')?.enabled;
      return {
        title: 'Embedded Third-Party Widget Requesting Microphone',
        blocked: perm,
        message: perm
          ? 'BLOCKED: Permissions-Policy camera=(), microphone=() strictly disabled audio/video APIs for all child contexts.'
          : 'ALLOWED: Widget prompted victim for hardware access without explicit origin restriction.',
      };
    }

    return null;
  };

  const attackResult = getAttackResult();

  return (
    <div className="bg-card border border-border rounded-xl p-6 sm:p-8 flex flex-col gap-6 w-full max-w-4xl mx-auto shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-red-500" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
            Defense-in-Depth Layered Switchboard
          </span>
        </div>
        <div className="text-xs font-mono bg-muted px-2.5 py-1 rounded-md text-foreground">
          OWASP Top 10
        </div>
      </div>

      {/* Layers Switchboard */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Active Browser Defense Layers:
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  layer.enabled
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-border/60 bg-muted/20 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      layer.enabled
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-foreground">
                        {layer.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          layer.enabled
                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {layer.enabled ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-muted-foreground truncate max-w-xl">
                      {layer.header}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Protects against: {layer.threatBlocked}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors ${
                    layer.enabled
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : 'border-border bg-muted text-muted-foreground'
                  }`}
                >
                  {layer.enabled ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Attack Simulator Buttons */}
      <div className="space-y-3 pt-2">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Simulate Penetration Vector Against Active Stack:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { id: 'mitm', label: '1. SSL Strip' },
            { id: 'sniff', label: '2. MIME Sniff' },
            { id: 'cdn', label: '3. CDN Hijack' },
            { id: 'leak', label: '4. Token Leak' },
            { id: 'hardware', label: '5. Mic Spy' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => runSimulation(btn.id as 'mitm' | 'sniff' | 'cdn' | 'leak' | 'hardware')}
              className={`p-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                simulatedAttack === btn.id
                  ? 'border-red-500 bg-red-500/10 text-foreground shadow-xs'
                  : 'border-border/60 bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Attack Feedback Banner */}
      <AnimatePresence>
        {attackResult && (
          <motion.div
            key={simulatedAttack}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`rounded-xl border p-4 sm:p-5 flex items-start gap-3 ${
              attackResult.blocked
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-rose-500/30 bg-rose-500/5'
            }`}
          >
            {attackResult.blocked ? (
              <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="text-sm font-bold text-foreground">{attackResult.title}</div>
              <div className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                {attackResult.message}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
