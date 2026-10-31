'use client';

import React, { useState, useId } from 'react';
import {
  ShieldCheck,
  Lock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Code,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Database,
  Cpu,
  Layers,
  LogIn,
  UserPlus,
} from 'lucide-react';

// ============================================================================
// Deterministic Simulated Hash Helper (Runs locally in browser)
// ============================================================================
function generateRandomSalt(): string {
  const chars = '0123456789abcdef';
  let salt = '';
  for (let i = 0; i < 16; i++) {
    salt += chars[Math.floor(Math.random() * chars.length)];
  }
  return salt;
}

function simulateArgon2Hash(password: string, salt: string): string {
  let seed = 0;
  for (let i = 0; i < password.length; i++) {
    seed = (seed * 31 + password.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < salt.length; i++) {
    seed = (seed * 17 + salt.charCodeAt(i)) >>> 0;
  }
  const hexSeed = seed.toString(16).padStart(8, '0');
  const part1 = btoa(password + salt).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  const part2 = btoa(salt + hexSeed).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);

  return `$argon2id$v=19$m=65536,t=3,p=4$${btoa(salt).slice(0, 12)}$${part1}${part2}`;
}

// ============================================================================
// Interactive Visualizer: 3 Core Password Experiments
// ============================================================================
export function PasswordHashingSimulator() {
  const [activeExperiment, setActiveExperiment] = useState<'salts' | 'speed' | 'workflow'>('salts');

  // Experiment 1 State (Salts)
  const sharedPassword = 'SecretPassword#123';
  const [aliceSalt, setAliceSalt] = useState<string>('a1b2c3d4e5f67890');
  const [bobSalt, setBobSalt] = useState<string>('9876543210fedcba');

  const aliceHash = simulateArgon2Hash(sharedPassword, aliceSalt);
  const bobHash = simulateArgon2Hash(sharedPassword, bobSalt);

  // Experiment 3 State (Workflow: Registration & Login)
  const [registeredPassword, setRegisteredPassword] = useState<string>('Student#2026');
  const [registeredSalt, setRegisteredSalt] = useState<string>('c7e49b1a0f82d35a');
  const [isRegistered, setIsRegistered] = useState<boolean>(true);

  const [loginInput, setLoginInput] = useState<string>('Student#2026');
  const [loginResult, setLoginResult] = useState<'idle' | 'success' | 'failure'>('idle');

  const storedHash = simulateArgon2Hash(registeredPassword, registeredSalt);

  const handleRegisterNew = (newPwd: string) => {
    const newSalt = generateRandomSalt();
    setRegisteredPassword(newPwd);
    setRegisteredSalt(newSalt);
    setIsRegistered(true);
    setLoginInput(newPwd);
    setLoginResult('idle');
  };

  const handleLoginAttempt = () => {
    if (loginInput === registeredPassword) {
      setLoginResult('success');
    } else {
      setLoginResult('failure');
    }
  };

  const loginInputId = useId();

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-xl">
      {/* Header & Experiment Selector */}
      <div className="space-y-4 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Demonstration
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              Password Security Lab: 3 Key Experiments
            </h3>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
            Local browser simulation &bull; Demo data only
          </span>
        </div>

        {/* Experiment Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            onClick={() => setActiveExperiment('salts')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeExperiment === 'salts'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Experiment 1
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Unique Salts in Action
            </div>
          </button>

          <button
            onClick={() => setActiveExperiment('speed')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeExperiment === 'speed'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Experiment 2
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Fast vs. Password Hashing
            </div>
          </button>

          <button
            onClick={() => setActiveExperiment('workflow')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeExperiment === 'workflow'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Experiment 3
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Register &amp; Verify Login
            </div>
          </button>
        </div>
      </div>

      {/* Experiment 1: Unique Salts */}
      {activeExperiment === 'salts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-1 text-xs">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 uppercase font-mono">
              Hypothesis:
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              If two users choose the exact same password, will their stored hashes look identical?
              Observe how adding a unique random salt ensures two completely distinct hash strings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Alice */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">User: Alice</span>
                </div>
                <button
                  onClick={() => setAliceSalt(generateRandomSalt())}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <RefreshCw className="w-3 h-3" /> New Salt
                </button>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="text-zinc-600 dark:text-zinc-400">
                  Password: <span className="font-bold text-zinc-900 dark:text-zinc-100">&quot;{sharedPassword}&quot;</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400">
                  Unique Salt: <span className="font-bold text-emerald-600 dark:text-emerald-400">{aliceSalt}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 break-all text-[11px] text-zinc-800 dark:text-zinc-200">
                  {aliceHash}
                </div>
              </div>
            </div>

            {/* Bob */}
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">User: Bob</span>
                </div>
                <button
                  onClick={() => setBobSalt(generateRandomSalt())}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                >
                  <RefreshCw className="w-3 h-3" /> New Salt
                </button>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="text-zinc-600 dark:text-zinc-400">
                  Password: <span className="font-bold text-zinc-900 dark:text-zinc-100">&quot;{sharedPassword}&quot;</span>
                </div>
                <div className="text-zinc-600 dark:text-zinc-400">
                  Unique Salt: <span className="font-bold text-emerald-600 dark:text-emerald-400">{bobSalt}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 break-all text-[11px] text-zinc-800 dark:text-zinc-200">
                  {bobHash}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-zinc-800 dark:text-zinc-200 space-y-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Key Learning:
            </span>
            <p className="leading-relaxed">
              Alice and Bob share the exact same password, but their stored hashes look completely unrelated.
              An attacker who steals the database cannot tell that they share the same password, and precomputed lookup tables are completely neutralized.
            </p>
          </div>
        </div>
      )}

      {/* Experiment 2: Fast vs Password Hashing */}
      {activeExperiment === 'speed' && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Fast Hashing */}
            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-rose-800 dark:text-rose-400">
                  Fast Hashing (e.g., SHA-256)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 font-bold">
                  Unsuitable for Passwords
                </span>
              </div>
              <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                <p>
                  <strong>Designed For:</strong> File checksums, data integrity, and digital signatures.
                </p>
                <p>
                  <strong>Execution Time:</strong> Under 1 microsecond (nanoseconds).
                </p>
                <p>
                  <strong>Why dangerous for passwords:</strong> Because it is fast, an attacker who obtains stolen hashes can test millions of guesses quickly using automated tools.
                </p>
              </div>
            </div>

            {/* Password Hashing */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-emerald-400">
                  Password Hashing (e.g., Argon2id)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold">
                  Recommended Standard
                </span>
              </div>
              <div className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                <p>
                  <strong>Designed For:</strong> Secure user authentication and credential storage.
                </p>
                <p>
                  <strong>Execution Time:</strong> Deliberately delayed (~100 to 300 ms) + physical RAM cost.
                </p>
                <p>
                  <strong>Why effective:</strong> A fraction of a second is unnoticeable to a human logging in once, but makes mass automated brute-force attacks impractical.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">Takeaway: </span>
            Speed is a feature for downloading files, but a critical vulnerability for storing passwords. Password algorithms must be deliberately slow and resource-intensive.
          </div>
        </div>
      )}

      {/* Experiment 3: Registration and Login Workflow */}
      {activeExperiment === 'workflow' && (
        <div className="space-y-5">
          {/* Phase 1: Registration */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-bold uppercase font-mono text-zinc-900 dark:text-zinc-100">
                Step 1: Registration (Creating the Hash)
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Choose Demo Password:</span>
              {['Student#2026', 'BlueSky!42', 'MyDogRex99'].map((pwd) => (
                <button
                  key={pwd}
                  onClick={() => handleRegisterNew(pwd)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                    registeredPassword === pwd
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                >
                  &quot;{pwd}&quot;
                </button>
              ))}
            </div>

            {/* Stored Record Preview */}
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono space-y-1">
              <div className="text-zinc-500">Database Record (users table):</div>
              <div className="text-zinc-700 dark:text-zinc-300">
                username: <span className="text-zinc-900 dark:text-zinc-100 font-bold">&quot;demo_student&quot;</span>
              </div>
              <div className="text-zinc-700 dark:text-zinc-300">
                salt: <span className="text-emerald-600 dark:text-emerald-400 font-bold">&quot;{registeredSalt}&quot;</span>
              </div>
              <div className="text-zinc-700 dark:text-zinc-300 truncate">
                storedHash: <span className="text-zinc-900 dark:text-zinc-100 font-bold">{storedHash}</span>
              </div>
            </div>
          </div>

          {/* Phase 2: Login Verification */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h4 className="text-xs font-bold uppercase font-mono text-zinc-900 dark:text-zinc-100">
                Step 2: Login Verification (Checking the Password)
              </h4>
            </div>

            <div className="space-y-2">
              <label htmlFor={loginInputId} className="text-xs font-medium text-zinc-600 dark:text-zinc-400 block">
                Submitted Password to Verify:
              </label>
              <div className="flex flex-wrap gap-2">
                <input
                  id={loginInputId}
                  type="text"
                  value={loginInput}
                  onChange={(e) => {
                    setLoginInput(e.target.value);
                    setLoginResult('idle');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs font-mono focus:outline-hidden focus:border-emerald-500 w-full sm:w-60"
                  placeholder="Type submitted password..."
                />
                <button
                  onClick={handleLoginAttempt}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition"
                >
                  Verify Submitted Password
                </button>
                <button
                  onClick={() => {
                    setLoginInput('IncorrectPassword#99');
                    setLoginResult('idle');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                >
                  Fill Wrong Password
                </button>
              </div>
            </div>

            {/* Login Outcome Result */}
            {loginResult !== 'idle' && (
              <div
                className={`p-4 rounded-xl border text-xs space-y-1 transition-all ${
                  loginResult === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <div className="flex items-center gap-1.5">
                    {loginResult === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    )}
                    <span>
                      {loginResult === 'success'
                        ? 'HTTP 200 OK — Password Verified Successfully!'
                        : 'HTTP 401 Unauthorized — Password Verification Failed!'}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase">
                    {loginResult === 'success' ? 'Access Granted' : 'Access Denied'}
                  </span>
                </div>
                <p className="leading-relaxed">
                  {loginResult === 'success'
                    ? 'The library re-computed the hash using the stored salt and parameters; the result matched the stored hash perfectly in constant time.'
                    : 'The submitted password does not match the stored hash. The server denies access without revealing any internal details.'}
                </p>
              </div>
            )}
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

const TOPIC2_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: 'Why should passwords NEVER be stored in plaintext inside a database?',
    options: [
      'Plaintext passwords take up too much storage space in the database.',
      'If the database is leaked or accessed by an attacker, every user account is immediately compromised.',
      'Plaintext passwords cannot be sent over internet cables.',
      'Databases only support numbers, not alphabetical characters.',
    ],
    correctIndex: 1,
    explanation:
      'Databases can be leaked through vulnerabilities or backups. If passwords are plain text, attackers immediately gain access to every user account across the entire system.',
  },
  {
    id: 2,
    question: 'What is the primary purpose of adding a unique cryptographic salt to each user password?',
    options: [
      'To encrypt the password so it can be decrypted and emailed to the user later.',
      'To ensure that two users with the same password produce completely different hashes, stopping precomputed table attacks.',
      'To hide the user’s email address from database administrators.',
      'To make the password easier for the user to remember.',
    ],
    correctIndex: 1,
    explanation:
      'A unique salt ensures that identical passwords produce completely different hash strings. This prevents attackers from recognizing common passwords or using precomputed lookup tables.',
  },
  {
    id: 3,
    question: 'Why are fast cryptographic algorithms like SHA-256 unsuitable for storing user passwords?',
    options: [
      'SHA-256 is an obsolete algorithm that is no longer used anywhere on the internet.',
      'SHA-256 produces hashes that are too short to store in SQL databases.',
      'Fast algorithms execute in nanoseconds, allowing attackers to test millions of password guesses quickly.',
      'SHA-256 only works on numbers and cannot hash text strings.',
    ],
    correctIndex: 2,
    explanation:
      'SHA-256 was designed for rapid data integrity checks. Because it runs in nanoseconds, attackers can test millions of guesses quickly. Password hashing needs to be deliberately slow.',
  },
  {
    id: 4,
    question: 'True or False: A password salt must be kept strictly secret and hidden from the database.',
    options: [
      'True (If an attacker sees the salt, the password is automatically cracked)',
      'False (Salts do not need to be secret; their security value comes from being unique for every single user)',
    ],
    correctIndex: 1,
    explanation:
      'Salts are not secret! They are stored in the database right next to the hash. Their purpose is uniqueness, not secrecy. (A secret key stored separately is called a pepper).',
  },
];

function Topic2KnowledgeQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="space-y-4">
      {TOPIC2_QUIZ.map((q) => {
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
// Main Topic 2 Content Component
// ============================================================================
export default function Topic2PasswordHashing() {
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const sampleNodeCode = `import { hash, verify } from '@node-rs/argon2';

// Recommended configuration based on server capacity and OWASP guidelines:
const ARGON2_CONFIG = {
  memoryCost: 65536, // 64 MB of RAM required per calculation
  timeCost: 3,       // 3 computational passes
  parallelism: 4,    // 4 CPU threads
  outputLen: 32,     // 32-byte final hash output
};

// 1. Registration: Hash password with unique automatic salt
export async function registerUserPassword(plaintext: string): Promise<string> {
  // Generates a cryptographically random salt and encodes parameters into the hash string:
  return await hash(plaintext, ARGON2_CONFIG);
}

// 2. Login: Verify submitted password against stored hash
export async function verifyUserLogin(submittedPassword: string, storedHash: string): Promise<boolean> {
  // Extracts salt and parameters from storedHash and verifies in constant time:
  return await verify(storedHash, submittedPassword);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleNodeCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* A. Why Plaintext Password Storage Is Dangerous */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          A. Why Storing Plaintext Passwords Is Dangerous
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          When users register on a website, they trust the application to safeguard their credentials.
          Unfortunately, database leaks, misconfigured cloud storage, and security breaches happen regularly in the real world.
        </p>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          If an application stores passwords in <strong>plaintext</strong> (plain, readable text like <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-900 dark:text-zinc-100">&quot;mypassword123&quot;</code>),
          anyone who gains unauthorized access to the database immediately sees every user&apos;s password.
          Because many people reuse passwords across personal email, banking, and social media accounts, a single plaintext database breach can compromise a user&apos;s entire digital identity.
        </p>
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
            <Lightbulb className="w-4 h-4" /> Everyday Analogy
          </div>
          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
            Storing passwords in plaintext is like writing the PIN code to your home on a sticky note and pasting it to the front door.
            Secure password hashing transforms that secret into a permanent, scrambled digital lock that cannot be reversed.
          </p>
        </div>
      </section>

      {/* B. What Is Password Hashing? */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          B. What Is Password Hashing?
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          To protect passwords, applications use a <strong>one-way cryptographic hash function</strong>. Here is how the key terms connect:
        </p>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              1. Plaintext Password
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 font-mono">
              &quot;SunnyDay#2026&quot;
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              The raw text the user typed on their keyboard. This must never be stored in the database.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              2. Hash Function
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              One-Way Math Engine
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              A specialized mathematical algorithm that takes input data and produces a scrambled, fixed-length output string.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              3. Password Hash
            </span>
            <div className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100 truncate">
              $argon2id$v=19$m=65536...
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              The scrambled string stored in the database. It is safe to store because it cannot be turned back into the password.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              4. Hashing vs. Encryption
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              One-Way vs. Two-Way
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              <strong>Encryption</strong> is two-way: data is scrambled, but can be decrypted using a secret key.
              <strong> Hashing</strong> is strictly one-way: there is no key that can unhash the string.
            </p>
          </div>
        </div>
      </section>

      {/* C. Salt and Pepper */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          C. Understanding Salt and Pepper
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          If you only hash the raw password, an attacker can spot patterns: <strong>identical passwords produce identical hashes</strong>.
          Two techniques protect against this:
        </p>

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-900 dark:text-zinc-100">
                1. Cryptographic Salt
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              A <strong>salt</strong> is a unique, cryptographically random string generated automatically for each user upon signup.
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>Important:</strong> Salts are <em>not secret</em>. They are stored right next to the hash in the database.
              Their purpose is <em>uniqueness</em>: ensuring that two users with the same password have completely different hashes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Lock className="w-4 h-4" />
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-900 dark:text-zinc-100">
                2. Secret Pepper
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              A <strong>pepper</strong> is an application-wide secret value added to passwords before hashing.
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>Important:</strong> Peppers <em>must be kept strictly secret</em>. They are stored separately from the database (e.g., in a secure secret manager or environment variable) to provide defense-in-depth if the database is leaked.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="pt-2">
          <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Feature</th>
                  <th className="p-3.5 text-emerald-700 dark:text-emerald-400 font-bold">Cryptographic Salt</th>
                  <th className="p-3.5 text-blue-700 dark:text-blue-400 font-bold">Secret Pepper</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Scope</td>
                  <td className="p-3.5">Unique for every single user</td>
                  <td className="p-3.5">Shared across the entire application</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Where Stored</td>
                  <td className="p-3.5">In the database alongside the hash</td>
                  <td className="p-3.5">Stored separately (Secret Manager / Env Var)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Confidentiality</td>
                  <td className="p-3.5">Public (does not need to be secret)</td>
                  <td className="p-3.5">Strictly confidential and secret</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Primary Purpose</td>
                  <td className="p-3.5">Stops precomputed lookup tables &amp; identical hashes</td>
                  <td className="p-3.5">Protects hashes if the database file is stolen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration: The 3 Experiments */}
      <section className="space-y-3 pt-2">
        <PasswordHashingSimulator />
      </section>

      {/* D. Why Not Use SHA-256 for Passwords? */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          D. Why Not Use SHA-256 for Passwords?
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          General cryptographic hash functions like SHA-256 and MD5 were engineered for speed.
          They are designed to verify large files, verify data integrity, and sign certificates in fractions of a microsecond.
        </p>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Because fast algorithms run in nanoseconds, attackers can test millions of password guesses very quickly using modern hardware.
          For password storage, we need the exact opposite: <strong>deliberately slow and resource-intensive algorithms</strong>.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-emerald-300 dark:border-emerald-500/30 shadow-xs space-y-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm block">Argon2id (Recommended)</span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The modern standard for password hashing. It is memory-hard, requiring both CPU time and physical RAM.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-sm block">bcrypt</span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A reliable, battle-tested standard that uses a configurable work factor to increase computation time.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-sm block">PBKDF2</span>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A standardized legacy option based on repeated hashing iterations. Slower than SHA-256, but lacks memory-hardness.
            </p>
          </div>
        </div>
      </section>

      {/* E. Understanding Argon2id */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          E. Understanding Argon2id
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Argon2id is currently recommended by security standards because it is <strong>memory-hard</strong>.
          It gives engineers three simple tuning knobs:
        </p>

        <div className="grid sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100">1. Memory Cost</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              How much RAM is required to compute one hash (e.g., 64 MB). Requiring physical memory makes mass parallel guessing impractical.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100">2. Time Cost</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              How many computational passes the algorithm performs over the memory, scaling calculation time linearly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100">3. Parallelism</span>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              How many independent CPU threads cooperate to compute the hash on multi-core processors.
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1">
          <em>Guidance for engineers:</em> Parameters should be chosen based on server capacity and current security guidance (e.g. OWASP recommendations), rather than treated as a fixed universal guarantee.
        </p>
      </section>

      {/* F. Registration and Login Workflow */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          F. Registration and Login Workflow
        </h2>

        {/* 1. Registration Flow */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
              Workflow 1
            </span>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              User Registration (Storing the Password)
            </h3>
          </div>

          <div className="grid sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Step 1</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Create Password</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">User creates a password on the signup form.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Step 2</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Generate Salt</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Server generates a unique random salt.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Step 3</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Generate Hash</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Password-hashing library generates the password hash.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Step 4</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Store in Database</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Hash and required parameters are safely stored in the database.</p>
            </div>
          </div>
        </div>

        {/* 2. Login Flow */}
        <div className="p-5 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
              Workflow 2
            </span>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              User Login (Verifying the Password)
            </h3>
          </div>

          <div className="grid sm:grid-cols-4 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Step 1</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Submit Password</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">User submits password on the login form.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Step 2</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Retrieve Hash</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Server retrieves the stored hash from the database.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Step 3</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Library Verifies</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Password-hashing library verifies the submitted password.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Step 4</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Result Rendered</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Login succeeds (200 OK) or fails (401 Unauthorized).</p>
            </div>
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
                  Developer Corner: Node.js &amp; Argon2 Example (Optional)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Expandable developer reference using the standard Argon2 library
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
                  auth/passwords.ts
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
                <code>{sampleNodeCode}</code>
              </pre>

              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed space-y-1">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Key implementation notes:</span>
                <p>
                  1. The <code className="font-mono text-emerald-600 dark:text-emerald-400">hash()</code> function handles random salt generation automatically.
                </p>
                <p>
                  2. Always use the library&apos;s <code className="font-mono text-emerald-600 dark:text-emerald-400">verify()</code> function. It automatically extracts parameters and compares in constant time to prevent side-channel timing attacks.
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
          Test your understanding with these 4 quick conceptual questions. Click an answer to check yourself!
        </p>
        <Topic2KnowledgeQuiz />
      </section>
    </div>
  );
}
