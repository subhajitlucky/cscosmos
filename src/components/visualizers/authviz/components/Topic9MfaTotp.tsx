'use client';

import React, { useState, useEffect, useId } from 'react';
import {
  Smartphone,
  Mail,
  Key,
  ShieldCheck,
  Clock,
  QrCode,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Code,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  WifiOff,
  Radio,
  Send,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Camera,
  Laptop,
  Scan,
  Database,
  ShieldAlert,
  Globe,
  Wifi,
} from 'lucide-react';

// ============================================================================
// Interactive Visualizer: 3 Core MFA / OTP Experiments
// ============================================================================

export function MfaExperimentsVisualizer() {
  const [activeExperiment, setActiveExperiment] = useState<'normal-otp' | 'totp' | 'backup-codes'>('normal-otp');

  // --------------------------------------------------------------------------
  // Experiment 1 State: Normal OTP (SMS / Email)
  // --------------------------------------------------------------------------
  const [otpChannel, setOtpChannel] = useState<'sms' | 'email'>('sms');
  const [generatedOtp, setGeneratedOtp] = useState<string>('529184');
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<'idle' | 'success' | 'failure'>('idle');
  const [otpTimer, setOtpTimer] = useState<number>(60);

  const handleSendOtp = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomCode);
    setOtpSent(true);
    setOtpVerified('idle');
    setOtpTimer(60);
    setOtpInput('');
  };

  const handleVerifyOtp = () => {
    if (otpInput.trim() === generatedOtp) {
      setOtpVerified('success');
    } else {
      setOtpVerified('failure');
    }
  };

  // --------------------------------------------------------------------------
  // Experiment 2 State: Google Authenticator (TOTP)
  // --------------------------------------------------------------------------
  const [totpSecret] = useState<string>('JBSWY3DPEHPK3PXP');
  const [totpSeconds, setTotpSeconds] = useState<number>(24);
  const [totpCode, setTotpCode] = useState<string>('482 910');
  const [airplaneMode, setAirplaneMode] = useState<boolean>(false);
  const [totpInput, setTotpInput] = useState<string>('');
  const [totpVerifyResult, setTotpVerifyResult] = useState<'idle' | 'success' | 'failure'>('idle');

  // Live timer for 30s TOTP countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTotpSeconds((prev) => {
        if (prev <= 1) {
          // New window, rotate code
          const p1 = Math.floor(100 + Math.random() * 900);
          const p2 = Math.floor(100 + Math.random() * 900);
          setTotpCode(`${p1} ${p2}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvanceTotpWindow = () => {
    const p1 = Math.floor(100 + Math.random() * 900);
    const p2 = Math.floor(100 + Math.random() * 900);
    setTotpCode(`${p1} ${p2}`);
    setTotpSeconds(30);
    setTotpVerifyResult('idle');
  };

  const handleVerifyTotp = () => {
    const sanitizedInput = totpInput.replace(/\s+/g, '');
    const sanitizedCode = totpCode.replace(/\s+/g, '');
    if (sanitizedInput === sanitizedCode) {
      setTotpVerifyResult('success');
    } else {
      setTotpVerifyResult('failure');
    }
  };

  // --------------------------------------------------------------------------
  // Experiment 3 State: Emergency Backup Codes
  // --------------------------------------------------------------------------
  const [backupCodes, setBackupCodes] = useState([
    { code: '4a8f-92bc', used: false },
    { code: '71e0-d35a', used: false },
    { code: '9c4b-810f', used: false },
    { code: '3d2a-77e1', used: false },
    { code: 'e55b-4091', used: false },
  ]);
  const [recoveryInput, setRecoveryInput] = useState<string>('');
  const [recoveryMessage, setRecoveryMessage] = useState<{ type: 'idle' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  });

  const handleUseBackupCode = (codeToUse: string) => {
    const target = backupCodes.find((c) => c.code === codeToUse);
    if (!target) {
      setRecoveryMessage({ type: 'error', text: 'Invalid backup code.' });
      return;
    }
    if (target.used) {
      setRecoveryMessage({
        type: 'error',
        text: `Code "${codeToUse}" was already used and permanently destroyed! Backup codes are strictly single-use.`,
      });
      return;
    }

    setBackupCodes((prev) =>
      prev.map((c) => (c.code === codeToUse ? { ...c, used: true } : c))
    );
    setRecoveryMessage({
      type: 'success',
      text: `Account unlocked successfully using backup code "${codeToUse}"! This code has now been invalidated.`,
    });
    setRecoveryInput('');
  };

  const remainingCodesCount = backupCodes.filter((c) => !c.used).length;

  const normalOtpInputId = useId();
  const totpInputId = useId();
  const recoveryInputId = useId();

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-xl">
      {/* Header & Tabs */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Demonstration
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Multi-Factor Authentication &amp; OTP Studio
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
            Local browser simulation &bull; No external data sent
          </span>
        </div>

        {/* Experiment Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => setActiveExperiment('normal-otp')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeExperiment === 'normal-otp'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Experiment 1
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Normal OTP (SMS &amp; Email)
            </div>
          </button>

          <button
            onClick={() => setActiveExperiment('totp')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeExperiment === 'totp'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Experiment 2
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Google Authenticator (TOTP)
            </div>
          </button>

          <button
            onClick={() => setActiveExperiment('backup-codes')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeExperiment === 'backup-codes'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Experiment 3
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Emergency Backup Codes
            </div>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Experiment 1: Normal OTP (SMS / Email)                               */}
      {/* -------------------------------------------------------------------- */}
      {activeExperiment === 'normal-otp' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase font-mono">
              Concept:
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              A normal OTP is delivered directly to the user over an external channel (like a text message or email).
              It is temporary and valid for only one use.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Step 1: Send OTP */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  1. Request Verification Code
                </span>
                <div className="flex gap-1 text-[11px] font-mono">
                  <button
                    onClick={() => {
                      setOtpChannel('sms');
                      setOtpSent(false);
                      setOtpVerified('idle');
                    }}
                    className={`px-2 py-0.5 rounded-md ${
                      otpChannel === 'sms'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    SMS
                  </button>
                  <button
                    onClick={() => {
                      setOtpChannel('email');
                      setOtpSent(false);
                      setOtpVerified('idle');
                    }}
                    className={`px-2 py-0.5 rounded-md ${
                      otpChannel === 'email'
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    Email
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Destination:{' '}
                <strong className="text-zinc-900 dark:text-zinc-100 font-mono">
                  {otpChannel === 'sms' ? '+1 (555) 019-2834' : 'alice@example.com'}
                </strong>
              </p>

              <button
                onClick={handleSendOtp}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {otpSent ? 'Resend One-Time Code' : 'Send One-Time Code'}
              </button>

              {/* Simulated Device Notification */}
              {otpSent && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs space-y-1 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      {otpChannel === 'sms' ? <Smartphone className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                      Incoming {otpChannel.toUpperCase()} Notification
                    </span>
                    <span>Just now</span>
                  </div>
                  <p className="text-zinc-800 dark:text-zinc-200 font-mono">
                    &quot;Your secure verification code is{' '}
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm tracking-wider">
                      {generatedOtp}
                    </span>
                    . Valid for 60 seconds. Do not share.&quot;
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Enter & Verify */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                2. Enter Code on Website
              </span>

              <div className="space-y-1.5">
                <label htmlFor={normalOtpInputId} className="text-xs text-zinc-600 dark:text-zinc-400">
                  Enter 6-Digit Code:
                </label>
                <div className="flex gap-2">
                  <input
                    id={normalOtpInputId}
                    type="text"
                    maxLength={6}
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value);
                      setOtpVerified('idle');
                    }}
                    placeholder="e.g. 529184"
                    disabled={!otpSent}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-mono tracking-widest text-center focus:outline-hidden focus:border-emerald-500 disabled:opacity-50"
                  />
                  <button
                    onClick={() => {
                      setOtpInput(generatedOtp);
                      setOtpVerified('idle');
                    }}
                    disabled={!otpSent}
                    className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-50"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={!otpSent || otpInput.length < 6}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold transition disabled:opacity-50"
              >
                Verify Code
              </button>

              {/* Outcome Banner */}
              {otpVerified !== 'idle' && (
                <div
                  className={`p-3 rounded-xl border text-xs space-y-0.5 ${
                    otpVerified === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {otpVerified === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    )}
                    <span>
                      {otpVerified === 'success' ? 'Code Verified! Identity Confirmed.' : 'Invalid Code! Verification Failed.'}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {otpVerified === 'success'
                      ? 'The server matched the submitted code and marked it as consumed so it cannot be used again.'
                      : 'The submitted code does not match the code issued for this session.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Experiment 2: Google Authenticator (TOTP)                            */}
      {/* -------------------------------------------------------------------- */}
      {activeExperiment === 'totp' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase font-mono">
              Concept:
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Google Authenticator does not receive SMS or emails. Instead, both your phone and the server share a secret key.
              Every 30 seconds, your phone uses that secret and the current clock to calculate a fresh code <strong>completely offline</strong>!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Left: Setup & Offline Proof */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  1. One-Time Setup (QR Code)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Shared Secret</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 text-xs font-mono">
                <div className="text-zinc-500">Shared Secret Key:</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-wider">
                  {totpSecret}
                </div>
                <p className="text-[10px] text-zinc-500 pt-1">
                  Scanned once by the authenticator app; saved in device storage and server database.
                </p>
              </div>

              {/* Airplane Mode Toggle */}
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <WifiOff className="w-4 h-4 text-amber-500" />
                    Airplane Mode Simulation
                  </span>
                  <button
                    onClick={() => setAirplaneMode(!airplaneMode)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
                      airplaneMode
                        ? 'bg-amber-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {airplaneMode ? 'Active (No Internet)' : 'Disabled'}
                  </button>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Notice that even when internet is disconnected, the 6-digit code on the right continues updating!
                  TOTP depends only on the shared secret and your phone&apos;s internal clock.
                </p>
              </div>
            </div>

            {/* Right: Phone Authenticator Display & Verification */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  2. Authenticator App Display
                </span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {totpSeconds}s remaining
                </span>
              </div>

              {/* Big Display Code */}
              <div className="text-center py-2 space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-widest text-emerald-600 dark:text-emerald-400">
                  {totpCode}
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-1000"
                    style={{ width: `${(totpSeconds / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleAdvanceTotpWindow}
                  className="inline-flex items-center gap-1 text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-mono"
                >
                  <RefreshCw className="w-3 h-3" /> Advance 30s Window
                </button>
                <button
                  onClick={() => {
                    setTotpInput(totpCode.replace(/\s+/g, ''));
                    setTotpVerifyResult('idle');
                  }}
                  className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Fill Code into Login
                </button>
              </div>

              {/* Verification Form */}
              <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex gap-2">
                  <input
                    id={totpInputId}
                    type="text"
                    maxLength={6}
                    value={totpInput}
                    onChange={(e) => {
                      setTotpInput(e.target.value);
                      setTotpVerifyResult('idle');
                    }}
                    placeholder="Enter code to verify"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono tracking-widest text-center focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    onClick={handleVerifyTotp}
                    disabled={totpInput.length < 6}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50"
                  >
                    Verify
                  </button>
                </div>

                {totpVerifyResult !== 'idle' && (
                  <div
                    className={`p-3 rounded-xl border text-xs space-y-0.5 ${
                      totpVerifyResult === 'success'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {totpVerifyResult === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      )}
                      <span>{totpVerifyResult === 'success' ? '200 OK — TOTP Verified!' : '401 Unauthorized — Code Mismatch'}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {totpVerifyResult === 'success'
                        ? 'The server independently calculated the expected code using its own clock and the shared secret. They matched!'
                        : 'The code entered does not match the server’s expected code for this 30-second window.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* Experiment 3: Emergency Backup Codes                                 */}
      {/* -------------------------------------------------------------------- */}
      {activeExperiment === 'backup-codes' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-1 text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300 uppercase font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Scenario: You Lost Your Phone!
            </span>
            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
              If your phone is lost, broken, or stolen, you cannot open Google Authenticator.
              Emergency backup codes allow you to regain access. Each code is <strong>strictly single-use</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Saved Printed Backup Codes Sheet */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Your Printed Recovery Codes
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                  {remainingCodesCount} of 5 Active
                </span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {backupCodes.map((item, idx) => (
                  <div
                    key={item.code}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                      item.used
                        ? 'bg-zinc-100 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-400 line-through'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100'
                    }`}
                  >
                    <span>
                      {idx + 1}. {item.code}
                    </span>
                    {item.used ? (
                      <span className="text-[10px] font-bold text-rose-500 uppercase not-italic">
                        CONSUMED
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setRecoveryInput(item.code);
                          setRecoveryMessage({ type: 'idle', text: '' });
                        }}
                        className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Use This Code
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Tip: Store backup codes in a secure physical location (like a safe) or an encrypted password manager.
              </p>
            </div>

            {/* Login Recovery Form */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Emergency Account Login
              </span>

              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Enter any unused 8-character recovery code to bypass the lost authenticator app and log in.
              </p>

              <div className="space-y-2">
                <label htmlFor={recoveryInputId} className="text-xs text-zinc-600 dark:text-zinc-400 block">
                  Backup Recovery Code:
                </label>
                <div className="flex gap-2">
                  <input
                    id={recoveryInputId}
                    type="text"
                    value={recoveryInput}
                    onChange={(e) => {
                      setRecoveryInput(e.target.value);
                      setRecoveryMessage({ type: 'idle', text: '' });
                    }}
                    placeholder="e.g. 4a8f-92bc"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono text-center focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    onClick={() => handleUseBackupCode(recoveryInput.trim())}
                    disabled={!recoveryInput.trim()}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition disabled:opacity-50"
                  >
                    Unlock Account
                  </button>
                </div>
              </div>

              {recoveryMessage.type !== 'idle' && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                    recoveryMessage.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {recoveryMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    )}
                    <span>
                      {recoveryMessage.type === 'success' ? 'Emergency Access Granted!' : 'Access Denied!'}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">{recoveryMessage.text}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Interactive Knowledge Check
// ============================================================================
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const TOPIC9_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'What does "OTP" stand for, and what makes it different from a standard password?',
    options: [
      'Over-the-Phone; it must be spoken aloud to a customer service agent.',
      'One-Time Password; it is a temporary verification code that expires quickly and cannot be reused.',
      'Optional Terminal Pass; it allows developers to bypass website login screens.',
      'Offline Transmission Protocol; it sends data through radio frequencies.',
    ],
    correctIndex: 1,
    explanation:
      'OTP stands for One-Time Password. Unlike your regular password (which stays the same until you change it), an OTP is valid for a single verification attempt within a short window of time.',
  },
  {
    id: 2,
    question: 'Multi-Factor Authentication (MFA) requires proof from at least two different categories. Which pair represents two genuine, distinct factors?',
    options: [
      'Your password + your mother’s maiden name (both are "something you know").',
      'Your password ("something you know") + a 6-digit code on your mobile authenticator app ("something you have").',
      'Your work email address + your personal email address.',
      'Entering your password twice on the login screen.',
    ],
    correctIndex: 1,
    explanation:
      'True MFA requires factors from different categories. Combining a memorized password ("something you know") with a physical phone generating codes ("something you have") provides genuine two-factor defense.',
  },
  {
    id: 3,
    question: 'Why can Google Authenticator generate valid 6-digit TOTP codes even when your phone is in Airplane Mode with zero internet or cellular service?',
    options: [
      'The phone secretly connects to satellites in orbit to receive codes.',
      'The phone uses its internal hardware clock and the shared secret saved during QR setup to calculate the code locally.',
      'All 10,000 possible codes are downloaded in advance when the app is installed.',
      'Google Authenticator uses Bluetooth to read the website screen directly.',
    ],
    correctIndex: 1,
    explanation:
      'TOTP is calculated purely on your phone! It combines the shared secret (stored during QR scan) with the phone’s current timestamp. No internet connection is needed to generate the code.',
  },
  {
    id: 4,
    question: 'What is the fundamental difference between TOTP and HOTP?',
    options: [
      'TOTP is encrypted, while HOTP is sent as plain text.',
      'TOTP codes rotate automatically with time (e.g. every 30 seconds), while HOTP codes change based on an incrementing counter event.',
      'HOTP only works on iPhone, while TOTP only works on Android.',
      'There is no difference; they are two brand names for the same system.',
    ],
    correctIndex: 1,
    explanation:
      'TOTP (Time-based OTP) changes every 30 seconds based on clock time. HOTP (HMAC-based OTP) changes only when a counter increments, such as pressing a button on a physical security token.',
  },
  {
    id: 5,
    question: 'What is the primary purpose of emergency backup codes, and how should they be treated after they are used?',
    options: [
      'They give friends access to your account; they can be shared and reused indefinitely.',
      'They allow you to log in if you lose your phone; each code is single-use and destroyed once consumed.',
      'They replace your main password permanently upon first login.',
      'They speed up internet connection during authentication.',
    ],
    correctIndex: 1,
    explanation:
      'Backup codes exist so you aren’t permanently locked out if your phone is lost or broken. Each code is single-use: once used to log in, it is invalidated immediately.',
  },
];

function Topic9KnowledgeQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="space-y-4">
      {TOPIC9_QUIZ.map((q) => {
        const userChoice = selectedAnswers[q.id];
        const isRevealed = revealed[q.id];
        const isCorrect = userChoice === q.correctIndex;

        return (
          <div
            key={q.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {q.id}
              </span>
              <p className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                {q.question}
              </p>
            </div>

            <div className="grid gap-2 pl-9">
              {q.options.map((opt, optIdx) => {
                const isSelected = userChoice === optIdx;
                let btnStyle =
                  'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800';

                if (isRevealed) {
                  if (optIdx === q.correctIndex) {
                    btnStyle =
                      'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-800 dark:text-rose-300 font-bold';
                  } else {
                    btnStyle =
                      'bg-zinc-50/50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-900 text-zinc-400 dark:text-zinc-600 opacity-60';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelect(q.id, optIdx)}
                    className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isRevealed && optIdx === q.correctIndex && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {isRevealed && (
              <div
                className={`ml-9 p-3.5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-300'
                    : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <span className="font-bold">
                  {isCorrect ? '✅ Correct! ' : '💡 Explanation: '}
                </span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// Interactive TOTP Step-by-Step Educational Theater
// ============================================================================

const QR_GRID: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
  [0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
];

function SvgQrCode({ className = 'w-28 h-28' }: { className?: string }) {
  return (
    <div
      className={`p-2 bg-white rounded-xl shadow-xs border border-zinc-200 flex items-center justify-center shrink-0 ${className}`}
      aria-label="Simulated QR Code"
    >
      <svg viewBox="0 0 21 21" className="w-full h-full text-zinc-950 fill-current">
        {QR_GRID.map((row, r) =>
          row.map((val, c) => (val === 1 ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" /> : null))
        )}
      </svg>
    </div>
  );
}

interface TotpTheaterStep {
  stepIndex: number;
  chipLabel: string;
  title: string;
  badge: string;
  explanation: string;
  keyTakeaway: string;
}

const TOTP_THEATER_STEPS: TotpTheaterStep[] = [
  {
    stepIndex: 0,
    chipLabel: '1. Secret Setup',
    title: 'Server Generates Secret & QR Code',
    badge: 'Step 1 of 7: Setup Initiation',
    explanation:
      'When you click "Enable 2FA" in your account security settings, the website server generates a random 160-bit shared secret key (e.g., JBSWY3DPEHPK3PXP). The server encodes this key into an otpauth:// URL and displays it on your screen as a high-contrast QR code.',
    keyTakeaway:
      'The QR code is just a graphical shortcut. It exists solely so users don’t have to manually type a 16-character random string on a mobile keyboard.',
  },
  {
    stepIndex: 1,
    chipLabel: '2. Scan QR',
    title: 'Camera Scans the QR Code',
    badge: 'Step 2 of 7: Optical Key Transfer',
    explanation:
      'You open Google Authenticator on your phone and point the camera at your computer screen. The camera sensor reads the optical QR pattern and extracts the shared secret directly into the authenticator app’s local keychain.',
    keyTakeaway:
      'Zero internet is required here! The secret is transferred through optical light photons entering your phone camera lens. No Wi-Fi or mobile data is used.',
  },
  {
    stepIndex: 2,
    chipLabel: '3. Shared Key',
    title: 'Both Sides Store the Exact Same Secret',
    badge: 'Step 3 of 7: Symmetric Secret In Place',
    explanation:
      'Now, both sides hold the identical secret key: the phone stores it in its offline hardware keychain, and the web server stores it in its encrypted database record. From this moment on, your phone NEVER needs an internet connection to produce valid login codes!',
    keyTakeaway:
      'You can switch your phone to Airplane Mode, turn off Wi-Fi, and remove the SIM card. Your authenticator app will still generate valid codes indefinitely.',
  },
  {
    stepIndex: 3,
    chipLabel: '4. Time Windows',
    title: 'Time Synchronization (30-Second Windows)',
    badge: 'Step 4 of 7: Clock Slicing',
    explanation:
      'Standard Unix epoch time (seconds elapsed since Jan 1, 1970) is divided into 30-second blocks using the formula: Window = Floor(Current Time / 30). Because time moves at the exact same rate everywhere, both the phone and server calculate the exact same window number (#59079001).',
    keyTakeaway:
      'Neither device needs to ask the other what time it is. Both simply read their own internal system clocks.',
  },
  {
    stepIndex: 4,
    chipLabel: '5. Parallel Math',
    title: 'Parallel Independent Code Generation',
    badge: 'Step 5 of 7: Deterministic Cryptography',
    explanation:
      'At this exact instant, both devices run the TOTP algorithm (HMAC-SHA1) using identical inputs: Shared Secret (JBSWY3DPEHPK3PXP) + Current Window (#59079001). Both devices calculate the exact same 6-digit result: 482 910!',
    keyTakeaway:
      'Pure deterministic mathematics! Identical inputs + identical cryptographic algorithm = identical 6-digit number, with zero network packets transmitted between phone and server.',
  },
  {
    stepIndex: 5,
    chipLabel: '6. Server Verify',
    title: 'User Submits Code & Server Verifies',
    badge: 'Step 6 of 7: Authentication Check',
    explanation:
      'You read 482 910 on your phone and type it into the website login prompt. Your browser sends this code across the network to the server. The server compares: does what the user typed equal the expected code it calculated locally? If yes, login succeeds!',
    keyTakeaway:
      'The server never contacts Google Authenticator to check if the code is correct. The server already computed the expected code itself and just does a fast equality check.',
  },
  {
    stepIndex: 6,
    chipLabel: '7. Expire & Rotate',
    title: 'Window Expiration & Replay Defense',
    badge: 'Step 7 of 7: Automatic Rotation',
    explanation:
      'When the 30-second countdown reaches zero, the time window increments to #59079002. Code 482 910 is permanently expired, and both devices simultaneously compute a fresh code (731 054). If an attacker intercepted the old code, it is now useless.',
    keyTakeaway:
      'Rotating every 30 seconds protects you from replay attacks. Even if a spy glances at your screen or sniffs an old OTP, they cannot reuse it after 30 seconds have passed.',
  },
];

export function TotpInteractiveTheater() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(24);
  const [currentWindow, setCurrentWindow] = useState<number>(59079001);
  const [testVerificationMode, setTestVerificationMode] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [replayAttempted, setReplayAttempted] = useState<boolean>(false);
  const [copiedSecret, setCopiedSecret] = useState<boolean>(false);

  // 30-second countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setCurrentWindow((w) => w + 1);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Autoplay step sequencer
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = playbackSpeed === 2 ? 3500 : 7000;
    const timeout = setTimeout(() => {
      setCurrentStep((prev) => {
        if (prev < 6) return prev + 1;
        setIsPlaying(false);
        return 0;
      });
    }, intervalMs);
    return () => clearTimeout(timeout);
  }, [isPlaying, currentStep, playbackSpeed]);

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setTestVerificationMode('idle');
    setReplayAttempted(false);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(6, prev + 1));
    setTestVerificationMode('idle');
    setReplayAttempted(false);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setTestVerificationMode('idle');
    setReplayAttempted(false);
  };

  const handleStepSelect = (idx: number) => {
    setCurrentStep(idx);
    setTestVerificationMode('idle');
    setReplayAttempted(false);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText('JBSWY3DPEHPK3PXP');
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const activeStepInfo = TOTP_THEATER_STEPS[currentStep];
  const progressPercent = ((currentStep + 1) / 7) * 100;
  const timerRadius = 16;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerStrokeDashoffset = timerCircumference - (secondsRemaining / 30) * timerCircumference;

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-6 shadow-sm space-y-6">
      {/* 1. Header & Step Scrubber */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-mono text-[11px] font-bold">
                {activeStepInfo.badge}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                Offline Cryptographic Verification
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {activeStepInfo.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-medium">
              Step {currentStep + 1} of 7
            </span>
          </div>
        </div>

        {/* Clickable Step Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {TOTP_THEATER_STEPS.map((step, idx) => {
            const isActive = currentStep === idx;
            const isCompleted = currentStep > idx;
            return (
              <button
                key={step.stepIndex}
                onClick={() => handleStepSelect(idx)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs shadow-emerald-600/30 font-bold'
                    : isCompleted
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
                aria-label={`Jump to ${step.title}`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                    isActive
                      ? 'bg-black/20 text-white'
                      : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </span>
                <span>{step.chipLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Visual Theater Stage: LEFT (Phone) | CENTER (Sync & Net) | RIGHT (Server) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80">
        {/* ================================================================= */}
        {/* LEFT: Google Authenticator (Phone) (4 cols on lg)                */}
        {/* ================================================================= */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Mobile Phone</span>
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                currentStep >= 2
                  ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <WifiOff className="w-3 h-3" />
              <span>Offline Ready</span>
            </span>
          </div>

          {/* Smartphone Hardware Frame */}
          <div className="flex-1 w-full max-w-[290px] mx-auto rounded-[32px] border-4 border-zinc-300 dark:border-zinc-700 bg-zinc-950 text-zinc-100 p-3.5 shadow-xl flex flex-col justify-between min-h-[460px]">
            {/* Top Phone Speaker / Dynamic Island */}
            <div>
              <div className="w-24 h-4 bg-zinc-900 rounded-full mx-auto mb-2.5 flex items-center justify-center gap-2 border border-zinc-800">
                <div className="w-2 h-2 rounded-full bg-zinc-800 border border-zinc-700" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between px-2 text-[10px] text-zinc-400 font-mono mb-3">
                <span>12:00</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-zinc-800 px-1 rounded text-zinc-300">✈️ AIRPLANE</span>
                  <div className="w-4 h-2 border border-zinc-500 rounded-xs flex items-center p-0.5">
                    <div className="h-full w-2.5 bg-emerald-400 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Authenticator App Bar */}
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800/80 flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                  G
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-zinc-100 truncate">Google Authenticator</div>
                  <div className="text-[9px] text-zinc-400 truncate">Time-Based OTP Vault</div>
                </div>
              </div>
            </div>

            {/* Dynamic Phone Screen Content per Step */}
            <div className="flex-1 flex flex-col justify-center py-2">
              {currentStep === 0 && (
                /* Step 1: Standby / Ready to pair */
                <div className="text-center space-y-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
                    <Scan className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200">No Accounts Configured</div>
                    <div className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      Tap &quot;+&quot; to scan the QR code displayed on your website security page.
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                    <span>Camera Standby</span>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                /* Step 2: Camera Viewfinder Active */
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/80 bg-black p-4 text-center space-y-3">
                  {/* Viewfinder Target Reticle */}
                  <div className="absolute inset-2 border-2 border-dashed border-emerald-400/40 rounded-xl pointer-events-none" />
                  {/* Animated Scanning Laser Line */}
                  <div className="absolute left-2 right-2 h-0.5 bg-emerald-400 shadow-sm shadow-emerald-400 animate-pulse top-1/2 transform -translate-y-1/2" />

                  <Camera className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                  <div className="relative z-10 space-y-1">
                    <div className="text-xs font-bold text-emerald-300">Scanning Screen...</div>
                    <div className="text-[10px] text-zinc-300 leading-tight">
                      Aligning QR code within camera viewfinder.
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-900/90 border border-emerald-500/40 text-[10px] text-zinc-200 font-mono">
                    <div className="text-emerald-400 font-bold">QR Detected!</div>
                    <div className="truncate text-zinc-400 text-[9px]">otpauth://totp/CSCosmos...</div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                /* Step 3: Shared Secret Saved */
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-zinc-900 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-emerald-400 uppercase tracking-wider font-mono">Account Saved</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono">
                      Offline Vault
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-zinc-100">CSCosmos Portal</div>
                    <div className="text-[10px] text-zinc-400 font-mono">student@college.edu</div>
                  </div>

                  <div className="p-2 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                    <div className="text-[9px] uppercase font-mono text-zinc-400">Stored Secret Key</div>
                    <div className="text-xs font-mono font-bold text-emerald-300 tracking-wider">
                      JBSWY3DPEHPK3PXP
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 leading-relaxed">
                    Key securely saved in local phone storage. Internet is now permanently optional.
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                /* Step 4: Clock Synchronization */
                <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-100">Internal Hardware Clock</div>
                    <div className="text-[10px] text-zinc-400">Reads phone&apos;s quartz crystal oscillator</div>
                  </div>

                  <div className="p-2 rounded-xl bg-black/60 border border-zinc-800 space-y-1 font-mono text-left">
                    <div className="text-[9px] text-zinc-400">Phone Clock Time: 12:00:42 PM</div>
                    <div className="text-[10px] text-emerald-400 font-bold">
                      Calculated Window: #{currentWindow}
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-400 leading-tight">
                    Formula: Floor(Current Unix Seconds / 30)
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                /* Step 5: Parallel OTP Generation */
                <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-900 border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10 text-center">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="font-bold text-zinc-200">CSCosmos</span>
                    <span className="text-emerald-400">Window #{currentWindow}</span>
                  </div>

                  <div className="space-y-1 py-1">
                    <div className="text-[9px] uppercase font-mono text-zinc-400">Generated TOTP Code</div>
                    <div className="text-3xl font-black font-mono tracking-widest text-emerald-400 drop-shadow-sm">
                      482 910
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-300">
                    <div className="w-4 h-4 rounded-full border border-emerald-400 flex items-center justify-center text-[9px] text-emerald-400 font-bold">
                      {secondsRemaining}
                    </div>
                    <span>{secondsRemaining}s remaining in window</span>
                  </div>

                  <div className="p-2 rounded-xl bg-black/60 border border-zinc-800 text-[10px] text-zinc-400 leading-tight">
                    Computed via HMAC-SHA1(Secret, Window)
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                /* Step 6: Server Verification */
                <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-900 border border-emerald-500/40 text-center">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    Displayed on Mobile Screen
                  </div>
                  <div className="text-2xl font-black font-mono tracking-widest text-emerald-400">
                    482 910
                  </div>
                  <p className="text-[10px] text-zinc-300 leading-relaxed">
                    User views this 6-digit code on their phone screen and types it into the website login form.
                  </p>
                  <div className="p-2 rounded-xl bg-zinc-800/80 border border-zinc-700 text-[10px] text-zinc-300 font-mono">
                    Status: Awaiting typing into browser
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                /* Step 7: Expiration & Regeneration */
                <div className="space-y-3 p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-rose-400 line-through">
                      Previous Code: 482 910 (EXPIRED)
                    </div>
                    <div className="text-[9px] text-zinc-400 font-mono">Window #{currentWindow - 1} Closed</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                    <div className="text-[9px] uppercase font-mono text-emerald-400 font-bold">
                      Fresh Active Code (Window #{currentWindow})
                    </div>
                    <div className="text-2xl font-black font-mono tracking-widest text-emerald-300">
                      731 054
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 leading-tight">
                    Window rolled over. Old code is dead; new code active for the next 30 seconds.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Phone Home Indicator Bar */}
            <div className="pt-2">
              <div className="w-28 h-1 bg-zinc-700 rounded-full mx-auto" />
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* CENTER: Interaction Zone, Synchronizer & Network (4 cols on lg)   */}
        {/* ================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center p-3 text-center space-y-4">
          {currentStep === 0 && (
            <div className="space-y-2 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Setup Step 1</div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The user navigates to website security settings and clicks &quot;Enable 2FA&quot;. The server creates a secret key.
              </p>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-3 max-w-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200 space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <Camera className="w-4 h-4" />
                  <span>Optical Ray Transfer</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 py-1">
                  <ArrowLeft className="w-4 h-4 animate-ping" />
                  <span className="font-mono text-xs font-bold">◄ ◄ ◄ Light Beam ◄ ◄ ◄</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                  Photons of light travel from the laptop monitor into the phone camera lens.
                  <strong> ZERO network packets</strong> are transmitted.
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-2.5 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Key className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Symmetric Key Paired</div>
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                Phone Key == Server Key
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Both devices now independently hold the exact same secret. No future network communication is required to generate codes.
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3 max-w-xs">
              {/* Universal Master Clock Dial */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r={timerRadius * 2}
                    className="stroke-zinc-200 dark:stroke-zinc-800"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r={timerRadius * 2}
                    className="stroke-emerald-500 transition-all duration-1000 ease-linear"
                    strokeWidth="6"
                    strokeDasharray={timerCircumference * 2}
                    strokeDashoffset={timerStrokeDashoffset * 2}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black font-mono text-zinc-900 dark:text-zinc-100">
                    {secondsRemaining}s
                  </span>
                  <span className="text-[9px] uppercase font-mono text-zinc-500 dark:text-zinc-400">Window</span>
                </div>
              </div>

              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Universal Time Slicing</div>
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                Floor(Time / 30) = #{currentWindow}
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Earth&apos;s time ticks identically on both devices. Both clocks calculate the exact same 30-second window.
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3 max-w-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-center space-y-1.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Air-Gapped Math</span>
                </div>
                <div className="text-lg font-black font-mono text-emerald-700 dark:text-emerald-400 tracking-wider">
                  482 910 === 482 910
                </div>
                <div className="text-[10px] text-zinc-600 dark:text-zinc-400 leading-tight">
                  Phone result equals Server result without speaking to each other.
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                <WifiOff className="w-3.5 h-3.5 text-rose-500" />
                <span>0 network packets sent</span>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-3 max-w-xs">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-300">
                  <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>HTTPS Transmission</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-800 dark:text-zinc-200 text-left space-y-0.5">
                  <div className="text-blue-600 dark:text-blue-400 font-bold">POST /api/auth/verify</div>
                  <div>
                    Body: {'{'} &quot;code&quot;: &quot;
                    {testVerificationMode === 'invalid' ? '999111' : '482910'}&quot; {'}'}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs py-0.5">
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                  <span>Sending Code to Server</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-3 max-w-xs">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
                <RefreshCw className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Window Advanced</div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                30 seconds expired. The counter advanced: #59079001 ➔ #59079002. Any previously submitted or captured
                code is now permanently invalid.
              </p>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* RIGHT: Website / Server Screen (4 cols on lg)                    */}
        {/* ================================================================= */}
        <div className="lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Website / Server</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-purple-500" />
              <span>DB Secure</span>
            </span>
          </div>

          {/* Browser / Server Frame */}
          <div className="flex-1 w-full max-w-[340px] mx-auto rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden flex flex-col justify-between min-h-[460px]">
            {/* Browser Header Bar */}
            <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700/80 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 px-2 py-0.5 rounded-md bg-white dark:bg-zinc-950 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate flex items-center gap-1 border border-zinc-200 dark:border-zinc-800">
                <Lock className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                <span className="truncate">
                  https://cscosmos.edu/{currentStep === 5 ? 'login/verify' : 'settings/security'}
                </span>
              </div>
            </div>

            {/* Dynamic Server Screen Content per Step */}
            <div className="p-4 flex-1 flex flex-col justify-center space-y-3">
              {currentStep === 0 && (
                /* Step 1: Server Generates Secret & QR */
                <div className="space-y-3 text-center">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Set Up Two-Factor Auth</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Scan this code with Google Authenticator
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <SvgQrCode className="w-28 h-28" />
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-zinc-500 dark:text-zinc-400 font-bold">
                        Shared Secret Key
                      </span>
                      <button
                        onClick={handleCopySecret}
                        className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 font-medium"
                      >
                        {copiedSecret ? (
                          <>
                            <Check className="w-3 h-3" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 tracking-wider">
                      JBSWY3DPEHPK3PXP
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                /* Step 2: Screen being scanned by camera */
                <div className="space-y-3 text-center">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Awaiting Scan...</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Website is broadcasting QR photons
                    </div>
                  </div>

                  <div className="relative inline-block mx-auto">
                    <div className="absolute -inset-1.5 rounded-2xl bg-emerald-500/20 blur-xs animate-pulse" />
                    <SvgQrCode className="w-28 h-28 relative z-10" />
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-[11px] text-emerald-900 dark:text-emerald-300 font-medium">
                    Phone camera reading QR pattern...
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                /* Step 3: Server Database Record */
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>Server Database Storage</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] space-y-1.5 text-zinc-700 dark:text-zinc-300">
                    <div className="text-[10px] text-zinc-400 uppercase font-bold">Table: users_mfa</div>
                    <div>user: &quot;student@college.edu&quot;</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                      totp_secret: &quot;JBSWY3DPEHPK3PXP&quot;
                    </div>
                    <div>algorithm: &quot;HMAC-SHA1&quot;</div>
                    <div>step_seconds: 30</div>
                  </div>

                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-[10px] text-emerald-950 dark:text-emerald-300 leading-tight">
                    Secret is encrypted and safely committed to database disk.
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                /* Step 4: Server Clock Sync */
                <div className="space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-300 dark:border-blue-500/30 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Server Clock (NTP Sync)</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Synchronized to World Atomic Clocks
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-left font-mono text-[11px] space-y-1">
                    <div className="text-zinc-500 dark:text-zinc-400 text-[10px]">Server Time: 12:00:42 PM</div>
                    <div className="text-blue-600 dark:text-blue-400 font-bold">
                      Calculated Window: #{currentWindow}
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                    Both server and phone reach window #{currentWindow} independently!
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                /* Step 5: Server Expected Code Calculation */
                <div className="space-y-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-center">
                  <div className="text-[10px] uppercase font-mono text-zinc-500 dark:text-zinc-400 font-bold">
                    Server Calculated Expected Code
                  </div>

                  <div className="text-3xl font-black font-mono tracking-widest text-emerald-600 dark:text-emerald-400">
                    482 910
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left font-mono text-[10px] space-y-0.5 text-zinc-700 dark:text-zinc-300">
                    <div>HMAC-SHA1(&quot;JBSWY3...&quot;, #{currentWindow})</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">Expected: 482910</div>
                  </div>

                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    Awaiting HTTP submission from student login screen.
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                /* Step 6: Interactive Verification Test */
                <div className="space-y-3">
                  <div className="text-center space-y-1">
                    <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Login Verification</div>
                    <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                      Enter the 6-digit code shown on your phone
                    </div>
                  </div>

                  {/* 6 Digit Inputs */}
                  <div className="flex justify-center gap-1.5 font-mono">
                    {(testVerificationMode === 'invalid' ? '999111' : '482910').split('').map((char, i) => (
                      <span
                        key={i}
                        className={`w-7 h-9 rounded-lg border flex items-center justify-center font-bold text-sm ${
                          testVerificationMode === 'valid'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                            : testVerificationMode === 'invalid'
                              ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-800 dark:text-rose-300'
                              : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {char}
                      </span>
                    ))}
                  </div>

                  {/* Result Message */}
                  {testVerificationMode === 'valid' && (
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200 text-xs text-center space-y-0.5">
                      <div className="font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>200 OK — Access Granted!</span>
                      </div>
                      <div className="text-[10px]">482910 matches expected server code.</div>
                    </div>
                  )}

                  {testVerificationMode === 'invalid' && (
                    <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200 text-xs text-center space-y-0.5">
                      <div className="font-bold flex items-center justify-center gap-1">
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>401 Unauthorized — Access Denied!</span>
                      </div>
                      <div className="text-[10px]">Submitted 999111 does not match expected 482910.</div>
                    </div>
                  )}

                  {/* Interactive Test Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setTestVerificationMode('valid')}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                        testVerificationMode === 'valid'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-100'
                      }`}
                    >
                      <span>Test Valid Code</span>
                    </button>
                    <button
                      onClick={() => setTestVerificationMode('invalid')}
                      className={`px-2 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                        testVerificationMode === 'invalid'
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-50 dark:bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/30 hover:bg-rose-100'
                      }`}
                    >
                      <span>Test Wrong Code</span>
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                /* Step 7: Expiration & Replay Test */
                <div className="space-y-3">
                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400">Server Window:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">#{currentWindow}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400">Expected OTP:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">731 054</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-zinc-500 dark:text-zinc-400">Old Code (482 910):</span>
                      <span className="font-bold text-rose-500">EXPIRED</span>
                    </div>
                  </div>

                  {replayAttempted && (
                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200 text-xs space-y-0.5">
                      <div className="font-bold flex items-center gap-1">
                        <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Replay Attack Blocked!</span>
                      </div>
                      <p className="text-[10px] leading-relaxed">
                        Attacker tried submitting expired code 482910 from previous window #{currentWindow - 1}.
                        Server strictly rejected it.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setReplayAttempted(true)}
                    className="w-full px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    <span>Simulate Attacker Replaying 482 910</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Server Footer Bar */}
            <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/60 border-t border-zinc-200 dark:border-zinc-700/60 text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center justify-between">
              <span>CSCosmos Identity Engine</span>
              <span>RFC 6238 Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep-Dive Pedagogical Card for Active Step */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 font-mono">
          <Lightbulb className="w-4 h-4" />
          <span>Step {currentStep + 1} Educational Breakdown</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {activeStepInfo.explanation}
        </p>
        <div className="pt-1 flex items-start gap-2 text-xs text-zinc-900 dark:text-zinc-100 font-medium">
          <span className="text-emerald-700 dark:text-emerald-400 font-bold shrink-0">💡 Student Takeaway:</span>
          <span className="text-zinc-700 dark:text-zinc-300">{activeStepInfo.keyTakeaway}</span>
        </div>
      </div>

      {/* 4. Playback Controls Toolbar */}
      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Playback controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
              title="Restart from Step 1"
              aria-label="Restart animation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" /> Auto-Play
                </>
              )}
            </button>

            <button
              onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
              className="px-2.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold transition"
              title="Toggle playback speed"
            >
              {playbackSpeed}x Speed
            </button>
          </div>

          {/* Center: Active Step label */}
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hidden sm:block">
            Step {currentStep + 1} of 7: <span className="font-bold text-zinc-800 dark:text-zinc-200">{activeStepInfo.chipLabel}</span>
          </div>

          {/* Right: Step Prev / Next */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === 6}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Topic 9 Content Component
// ============================================================================
export default function Topic9MfaTotp() {
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const sampleOtplibCode = `import { authenticator } from 'otplib';

// Configure TOTP parameters (RFC 6238 standard: 30-second window, 6 digits)
authenticator.options = {
  step: 30,
  digits: 6,
  window: 1, // Tolerate +/- 1 step (30 seconds) of clock drift
};

// 1. Setup: Generate a shared secret & otpauth URL for QR code
export function setupUserTotp(userEmail: string) {
  const secret = authenticator.generateSecret(); // 160-bit Base32 secret
  const otpauthUri = authenticator.keyuri(userEmail, 'CosmosApp', secret);
  return { secret, otpauthUri };
}

// 2. Verification: Verify submitted code against shared secret
export function verifyUserTotp(submittedCode: string, userSecret: string): boolean {
  // Checks code against current clock and window:
  const isValid = authenticator.verify({ token: submittedCode, secret: userSecret });
  return isValid;
}

// 3. Backup Codes: Generate single-use random recovery codes
export function generateBackupCodes(count = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate random 8-character hex code (e.g., "4a8f-92bc")
    codes.push(crypto.randomUUID().slice(0, 8));
  }
  return codes;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleOtplibCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* A. What Is an OTP? */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          A. What Is an OTP?
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          An <strong>OTP (One-Time Password)</strong> is a temporary numeric code generated to verify a user&apos;s identity.
          Unlike your main account password—which remains the same every day until you change it—an OTP is valid for
          <strong> only one login attempt</strong> and expires within a short window of time (such as 30 seconds to a few minutes).
        </p>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          You have likely encountered OTPs when shopping online or logging into university portals:
        </p>

        <div className="grid sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
              <Smartphone className="w-4 h-4" /> SMS OTP
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A 6-digit code sent via text message to your registered mobile phone number.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold font-mono">
              <Mail className="w-4 h-4" /> Email OTP
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A temporary verification code or magic link delivered straight to your email inbox.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold font-mono">
              <Clock className="w-4 h-4" /> Authenticator App
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A rotating code generated directly on your device using apps like Google Authenticator or Microsoft Authenticator.
            </p>
          </div>
        </div>
      </section>

      {/* B. What Is Multi-Factor Authentication (MFA)? */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          B. What Is Multi-Factor Authentication (MFA)?
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          In traditional login systems, you only enter a username and password. If a malicious attacker discovers your password—through a database breach, malware, or a phishing email—they can log straight into your account.
        </p>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          <strong>Multi-Factor Authentication (MFA)</strong> solves this problem by requiring you to prove your identity using at least <strong>two different categories of evidence</strong> (factors):
        </p>

        <div className="grid sm:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[11px] uppercase block">
              1. Something You Know
            </span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Password or PIN
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              Information memorized in your mind.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[11px] uppercase block">
              2. Something You Have
            </span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Phone or Security Key
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              A physical device you possess in your hands.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[11px] uppercase block">
              3. Something You Are
            </span>
            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
              Biometrics
            </div>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your physical fingerprint, Face ID, or iris scan.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
          <strong>Why this works:</strong> Even if a criminal on the other side of the world steals your password (Factor 1), they cannot access your account because they do not physically hold your smartphone generating the second factor (Factor 2).
        </div>
      </section>

      {/* C. Types of OTP */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          C. Types of OTP: A Quick Comparison
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Not all OTP systems operate the same way. Here is a simple comparison of how each delivers or calculates codes:
        </p>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">How It Works</th>
                <th className="p-3.5">Pros</th>
                <th className="p-3.5">Trade-offs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
              <tr>
                <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">SMS OTP</td>
                <td className="p-3.5">Code is sent via mobile phone text message</td>
                <td className="p-3.5">Very familiar; requires no smartphone apps</td>
                <td className="p-3.5 text-zinc-600 dark:text-zinc-400">Vulnerable to SIM swapping and mobile network interception</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Email OTP</td>
                <td className="p-3.5">Code is sent to user&apos;s registered email</td>
                <td className="p-3.5">Free to send; convenient on laptops</td>
                <td className="p-3.5 text-zinc-600 dark:text-zinc-400">If the email account is hacked, the OTP is compromised too</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400">TOTP (Time-Based)</td>
                <td className="p-3.5">Calculated locally using a shared secret and current time</td>
                <td className="p-3.5">Works 100% offline; fast and immune to SIM swapping</td>
                <td className="p-3.5 text-zinc-600 dark:text-zinc-400">User must have an authenticator app installed</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">HOTP (Counter-Based)</td>
                <td className="p-3.5">Calculated using a shared secret and an incrementing counter</td>
                <td className="p-3.5">Independent of time; common in physical key fobs</td>
                <td className="p-3.5 text-zinc-600 dark:text-zinc-400">Counter can get out of sync if pressed repeatedly</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Demonstration: The 3 Experiments */}
      <section className="space-y-3 pt-2">
        <MfaExperimentsVisualizer />
      </section>

      {/* D. TOTP — Google Authenticator */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          D. How Google Authenticator Works (TOTP)
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          When you enable 2-Step Verification with Google Authenticator, a fascinating question arises:
          <em> How does the app generate the exact same code that the server expects, even when your phone has no internet connection?</em>
        </p>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          The secret is a standard algorithm called <strong>TOTP (Time-Based One-Time Password)</strong>:
        </p>

        {/* Step-by-Step Interactive TOTP Animation */}
        <TotpInteractiveTheater />

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">Why Clock Drift Matters: </span>
          <p>
            Your phone&apos;s clock and the server&apos;s clock might differ by a few seconds. To prevent frustrating login failures,
            servers usually allow a <strong>small clock tolerance window</strong> (checking the current 30-second block as well as the immediate previous and next blocks).
          </p>
        </div>
      </section>

      {/* E. HOTP */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          E. HOTP (Counter-Based OTP)
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Before TOTP became widespread, systems used <strong>HOTP (HMAC-Based One-Time Password)</strong>.
          Instead of looking at a clock, HOTP uses a <strong>counter</strong>:
        </p>

        <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-emerald-300 dark:border-emerald-500/30 shadow-xs space-y-1.5">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono uppercase text-[11px] block">
              TOTP (Time-Based)
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Rotates with Time
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Code automatically refreshes every 30 seconds as the clock advances. Most popular in smartphone apps today.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono uppercase text-[11px] block">
              HOTP (Counter-Based)
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Advances on Button Press
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Code changes only when a button is pressed or an event happens. Common in physical hardware key fobs.
            </p>
          </div>
        </div>
      </section>

      {/* F. Emergency Backup Codes */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          F. Emergency Backup Codes
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          What happens if you drop your phone in water, shatter the screen, or lose it while traveling?
          Without your phone, you cannot open Google Authenticator. Would you be permanently locked out of your account forever?
        </p>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          To prevent permanent lockouts, secure applications issue a set of <strong>Emergency Backup Codes (Recovery Codes)</strong>:
        </p>

        <div className="grid sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 font-mono">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Single-Use by Design
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Each backup code can be used exactly <strong>once</strong>. As soon as you log in with a backup code, the server permanently invalidates it.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 font-mono">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Stored as Hashes
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Just like passwords, servers store backup codes in hashed form so that an unauthorized database dump cannot reveal valid recovery codes.
            </p>
          </div>
        </div>
      </section>

      {/* G. Developer Corner (Optional Expandable Section) */}
      <section className="space-y-3">
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xs">
          <button
            onClick={() => setShowCode(!showCode)}
            className="w-full p-5 sm:p-6 flex items-center justify-between text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Developer Corner: Node.js TOTP Implementation (Optional)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Expandable developer reference using the standard <code className="font-mono text-emerald-600 dark:text-emerald-400">otplib</code> library
                </p>
              </div>
            </div>
            {showCode ? (
              <ChevronUp className="w-5 h-5 text-zinc-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-zinc-500" />
            )}
          </button>

          {showCode && (
            <div className="p-5 sm:p-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-semibold">
                  auth/totp.ts
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-zinc-950 text-zinc-200 font-mono text-xs overflow-x-auto leading-relaxed border border-zinc-800">
                <code>{sampleOtplibCode}</code>
              </pre>

              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Implementation Best Practices:</span>
                <p>
                  1. <strong>Replay Protection:</strong> When a user logs in with a code, record that code as used for the remaining 30-second window so an eavesdropper cannot submit it a second time.
                </p>
                <p>
                  2. <strong>Reputable Libraries:</strong> Always use established libraries (like <code className="font-mono text-emerald-600 dark:text-emerald-400">otplib</code>) rather than rolling your own cryptographic truncation logic.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* H. Knowledge Check */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            H. Knowledge Check
          </h2>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-normal">
          Test your understanding with these 5 conceptual questions. Click an answer to check yourself!
        </p>
        <Topic9KnowledgeQuiz />
      </section>
    </div>
  );
}
