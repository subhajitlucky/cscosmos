'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Fingerprint, Key, Lock, RefreshCw, RotateCcw, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export function WebAuthnPasskeyVisualizer() {
  const [step, setStep] = useState<number>(0);
  const [log, setLog] = useState<string>('WebAuthn / FIDO2 Relying Party (RP) ready for passkey registration.');

  const steps = [
    {
      title: '1. Registration Challenge from Server',
      desc: 'Server sends a 32-byte cryptographic challenge and Relying Party (RP) config to browser: navigator.credentials.create({ publicKey: ... })'
    },
    {
      title: '2. Biometric Prompt on Device Hardware',
      desc: 'Operating System prompts user for TouchID / FaceID / Windows Hello hardware biometric confirmation.'
    },
    {
      title: '3. Hardware Keypair Generation',
      desc: 'Secure Enclave generates an asymmetric keypair. The Private Key NEVER leaves the physical device TPM chip!'
    },
    {
      title: '4. Public Key & Attestation Sent to Server',
      desc: 'Browser transmits public key and signed challenge back to server. Server registers passkey without ever knowing a password!'
    },
    {
      title: '5. Phishing-Proof Authentication Complete',
      desc: 'Future logins sign a new server challenge with the Secure Enclave private key. 100% immune to phishing and credential stuffing! ✅'
    }
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setLog(steps[step].desc);
      setStep((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setLog('Reset WebAuthn passkey flow.');
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
              Next-Gen Passwordless Security
            </div>
            <h3 className="text-xl font-bold text-foreground">
              WebAuthn / FIDO2 Passkeys Biometric Stepper
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
          Step {Math.min(step, 5)} of 5
        </span>
      </div>

      {/* Hardware Enclave vs Server Diagram */}
      <div className="grid md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Device TPM Enclave */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-emerald-400 font-bold">Device Secure Enclave (TouchID / TPM):</span>
            <span className="text-slate-500">Hardware Isolated</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div>
              <span className="text-slate-500">Biometric State: </span>
              <span className={step >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {step >= 2 ? '✅ User Verified (TouchID Approved)' : '[ Idle ]'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Private Key: </span>
              <span className={step >= 3 ? 'text-amber-300 font-bold' : 'text-slate-600'}>
                {step >= 3 ? '🔒 ECDSA P-256 (Never leaves hardware chip)' : '[ None ]'}
              </span>
            </div>
          </div>
        </div>

        {/* Relying Party Server */}
        <div className="p-5 rounded-3xl bg-slate-950 text-slate-300 border border-slate-800 space-y-2 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-sky-400 font-bold">Relying Party (RP) Backend Server:</span>
            <span className="text-slate-500">api.corp.io</span>
          </div>
          <div className="space-y-1 text-[11px]">
            <div>
              <span className="text-slate-500">Challenge Generated: </span>
              <span className={step >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {step >= 1 ? '7b1f9c8d... (32-byte cryptographic nonce)' : '[ None ]'}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Stored Credentials: </span>
              <span className={step >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-600'}>
                {step >= 4 ? 'Public Key (Credential ID: cred_92a)' : '[ Zero passwords stored ]'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Log Box */}
      <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 space-y-1 shadow-inner">
        <span className="text-emerald-400 font-bold">FIDO2 Protocol Trace:</span>
        <p className="text-slate-300 leading-relaxed text-[11px]">{log}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Passkey Flow</span>
        </button>

        <button
          onClick={handleNext}
          disabled={step >= 5}
          className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Step Next Action ({step}/5)</span>
        </button>
      </div>
    </div>
  );
}
