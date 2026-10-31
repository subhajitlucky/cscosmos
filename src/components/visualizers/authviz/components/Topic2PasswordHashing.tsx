'use client';

import React, { useState, useId } from 'react';
import {
  Key,
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
  Users,
  Sliders,
  AlertTriangle,
} from 'lucide-react';

// ============================================================================
// Interactive Visualizer: "Interactive Password Hashing Lab"
// ============================================================================
function generateRandomSalt(): string {
  const chars = '0123456789abcdef';
  let salt = '';
  for (let i = 0; i < 16; i++) {
    salt += chars[Math.floor(Math.random() * chars.length)];
  }
  return salt;
}

// Pseudo-hash generator for educational simulation (deterministic from input)
function simulateArgon2Hash(password: string, salt: string, memoryMb: number, iterations: number): string {
  let seed = 0;
  for (let i = 0; i < password.length; i++) {
    seed = (seed * 31 + password.charCodeAt(i)) >>> 0;
  }
  for (let i = 0; i < salt.length; i++) {
    seed = (seed * 17 + salt.charCodeAt(i)) >>> 0;
  }
  seed = (seed ^ (memoryMb * 1024)) >>> 0;
  seed = (seed ^ (iterations * 97)) >>> 0;

  const hexSeed = seed.toString(16).padStart(8, '0');
  const part1 = btoa(password + salt).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
  const part2 = btoa(salt + hexSeed).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);

  return `$argon2id$v=19$m=${memoryMb * 1024},t=${iterations},p=4$${btoa(salt).slice(0, 12)}$${part1}${part2}`;
}

export function PasswordHashingSimulator() {
  const inputId = useId();
  const [activeTab, setActiveTab] = useState<'single' | 'two-users'>('single');

  // Single user state
  const [samplePassword, setSamplePassword] = useState<string>('Student#2026');
  const [userSalt, setUserSalt] = useState<string>('e4b7c29a8f10d35a');
  const [memoryCost, setMemoryCost] = useState<number>(64); // in MB
  const [iterations, setIterations] = useState<number>(3);

  // Two users comparison state
  const sharedPassword = 'SecretPassword#123';
  const [aliceSalt, setAliceSalt] = useState<string>('a1b2c3d4e5f67890');
  const [bobSalt, setBobSalt] = useState<string>('9876543210fedcba');

  const presetPasswords = ['Student#2026', 'BlueSky!42', 'CoffeeCup@99'];

  const currentSingleHash = simulateArgon2Hash(samplePassword, userSalt, memoryCost, iterations);
  const aliceHash = simulateArgon2Hash(sharedPassword, aliceSalt, 64, 3);
  const bobHash = simulateArgon2Hash(sharedPassword, bobSalt, 64, 3);

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Demonstration
          </span>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Password Hashing &amp; Salting Explorer
          </h3>
        </div>
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('single')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'single'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            1. Try Hashing
          </button>
          <button
            onClick={() => setActiveTab('two-users')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'two-users'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            2. Two Users with Same Password
          </button>
        </div>
      </div>

      {activeTab === 'single' ? (
        <div className="space-y-5">
          {/* Preset Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={inputId} className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-600 dark:text-zinc-400">
                Sample Password Input (Demo Only)
              </label>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Never enter real personal passwords
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id={inputId}
                type="text"
                value={samplePassword}
                onChange={(e) => setSamplePassword(e.target.value)}
                placeholder="Enter sample password..."
                className="px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm font-mono focus:outline-hidden focus:border-emerald-500 w-full sm:w-64"
              />
              <div className="flex flex-wrap gap-1.5">
                {presetPasswords.map((pwd) => (
                  <button
                    key={pwd}
                    onClick={() => setSamplePassword(pwd)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition ${
                      samplePassword === pwd
                        ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/30'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    &quot;{pwd}&quot;
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Salt Row */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono uppercase">
                  User&apos;s Cryptographic Salt
                </span>
              </div>
              <button
                onClick={() => setUserSalt(generateRandomSalt())}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition"
              >
                <RefreshCw className="w-3 h-3" /> Generate New Salt
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 font-mono text-xs text-emerald-700 dark:text-emerald-400 break-all">
              {userSalt}
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-normal">
              A random salt is created specifically for this user. It is stored publicly alongside the hash in the database.
            </p>
          </div>

          {/* Argon2id Parameters */}
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Memory Cost (RAM)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{memoryCost} MB</span>
              </div>
              <div className="flex gap-2 pt-1">
                {[19, 48, 64].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMemoryCost(m)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-medium transition ${
                      memoryCost === m
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {m} MB
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                Forces RAM allocation to resist GPU parallel guessing attacks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Time Cost (Passes)
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{iterations} Iterations</span>
              </div>
              <div className="flex gap-2 pt-1">
                {[2, 3, 4].map((t) => (
                  <button
                    key={t}
                    onClick={() => setIterations(t)}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-medium transition ${
                      iterations === t
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {t} Passes
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 pt-0.5">
                Repeats computation rounds to deliberately increase processing time.
              </p>
            </div>
          </div>

          {/* Generated Hash Display */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-mono flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Stored Argon2id Hash String:
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-bold">
                Safe to store in DB
              </span>
            </div>
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-emerald-200 dark:border-emerald-500/20 font-mono text-xs text-zinc-900 dark:text-zinc-100 break-all leading-relaxed">
              {currentSingleHash}
            </div>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
              Notice how the output safely encodes the algorithm name (<code className="font-mono text-emerald-700 dark:text-emerald-400">$argon2id</code>),
              parameters (<code className="font-mono text-emerald-700 dark:text-emerald-400">m={memoryCost * 1024}, t={iterations}</code>), the salt, and the hash into one standard string.
            </p>
          </div>
        </div>
      ) : (
        /* Two Users Tab */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 space-y-1">
            <h4 className="text-xs font-bold uppercase font-mono text-blue-900 dark:text-blue-300">
              Scenario: Alice and Bob choose the EXACT SAME password
            </h4>
            <p className="text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
              Both users registered with the common password <code className="font-mono font-bold">&quot;{sharedPassword}&quot;</code>.
              Observe how unique cryptographic salts prevent identical hashes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Alice */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
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
                  Salt: <span className="font-bold text-emerald-600 dark:text-emerald-400">{aliceSalt}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 break-all text-[11px] text-zinc-800 dark:text-zinc-200">
                  {aliceHash}
                </div>
              </div>
            </div>

            {/* Bob */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-3">
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
                  Salt: <span className="font-bold text-emerald-600 dark:text-emerald-400">{bobSalt}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 break-all text-[11px] text-zinc-800 dark:text-zinc-200">
                  {bobHash}
                </div>
              </div>
            </div>
          </div>

          {/* Key Insight Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-zinc-800 dark:text-zinc-200 space-y-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Key Cryptographic Insight:
            </span>
            <p className="leading-relaxed">
              Even though Alice and Bob entered the exact same password, their stored hashes are completely different.
              An attacker who steals the database cannot tell that they share the same password, and precomputed rainbow tables are completely useless!
            </p>
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
      'A unique salt ensures that identical passwords produce completely different hash strings. This prevents attackers from recognizing common passwords or using precomputed rainbow tables.',
  },
  {
    id: 3,
    question: 'Why are fast cryptographic algorithms like SHA-256 unsuitable for storing user passwords?',
    options: [
      'SHA-256 is an obsolete algorithm that is no longer used anywhere on the internet.',
      'SHA-256 produces hashes that are too short to store in SQL databases.',
      'Modern hardware and graphics cards can compute billions of SHA-256 hashes per second, making brute-force guessing very fast.',
      'SHA-256 only works on numbers and cannot hash text strings.',
    ],
    correctIndex: 2,
    explanation:
      'SHA-256 was designed for rapid data integrity checks. Because it runs in nanoseconds, attackers can test hundreds of millions of guesses per second on modern hardware. Password hashing needs to be deliberately slow.',
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
      'Salts are not secret! They are routinely stored in the database right next to the hash. Their purpose is uniqueness, not secrecy. (A secret key stored separately is called a pepper).',
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

// Recommended OWASP Argon2id Parameters for modern web servers:
const ARGON2_CONFIG = {
  memoryCost: 65536, // 64 MB of RAM required per calculation
  timeCost: 3,       // 3 computational passes
  parallelism: 4,    // 4 CPU threads
  outputLen: 32,     // 32-byte final hash output
};

// 1. User Registration: Hash password with unique automatic salt
export async function registerUserPassword(plaintext: string): Promise<string> {
  // The library automatically generates a cryptographically random salt
  // and encodes the parameters directly into the output string:
  return await hash(plaintext, ARGON2_CONFIG);
}

// 2. User Login: Verify submitted password against stored hash
export async function verifyUserLogin(submittedPassword: string, storedHash: string): Promise<boolean> {
  // Extracts the salt and parameters from the storedHash and computes
  // a constant-time comparison to protect against timing attacks:
  return await verify(storedHash, submittedPassword);
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleNodeCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* A. Why Password Hashing Matters */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          A. Why Password Hashing Matters
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          When users register on a website, they trust the application with their credentials.
          Unfortunately, database leaks, misconfigured cloud backups, and insider threats are an everyday reality in software engineering.
        </p>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          If an application stores passwords in <strong>plaintext</strong> (plain, readable text like <code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-zinc-900 dark:text-zinc-100">&quot;mypassword123&quot;</code>),
          anyone who gains unauthorized access to the database immediately sees every user&apos;s password.
          Because most users reuse passwords across their email, personal social accounts, and banking services, a single plaintext database leak puts their entire digital life at risk.
        </p>
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
            <Lightbulb className="w-4 h-4" /> Everyday Analogy
          </div>
          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
            Storing passwords in plaintext is like writing the PIN code to your front door on a sticky note and pasting it to your front door.
            Secure password hashing transforms that PIN into a permanent, scrambled lock that only matches when the original key is entered.
          </p>
        </div>
      </section>

      {/* B. What Is Password Hashing? */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          B. What Is Password Hashing?
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          To protect passwords, we use a <strong>one-way cryptographic hash function</strong>. Here is how the key terms connect:
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
              A specialized mathematical algorithm that transforms any input into a scrambled, fixed-length output.
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
              The scrambled string stored in the database. It is safe to store because it cannot be reversed.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              4. One-Way Transformation
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Strictly Irreversible
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Unlike <em>encryption</em> (which can be decrypted using a secret key), a cryptographic hash mathematically cannot be turned back into the original password.
            </p>
          </div>
        </div>

        {/* Example Box */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
          <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono uppercase">
            Example (The Avalanche Effect):
          </span>
          <div className="grid sm:grid-cols-2 gap-2 font-mono">
            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-zinc-500 block">Input: &quot;Cat123&quot;</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block truncate">Hash: 7d2f9b84a1e...</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-zinc-500 block">Input: &quot;Cat124&quot; (1 char difference)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold block truncate">Hash: a1c4e788fb2...</span>
            </div>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
            Changing even a single letter completely scrambles the output hash. An attacker cannot guess patterns.
          </p>
        </div>
      </section>

      {/* C. Understanding Salt and Pepper */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          C. Understanding Salt and Pepper
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          If you only hash the raw password, a major security weakness emerges: <strong>identical passwords produce identical hashes</strong>.
          If Alice and Bob both choose <code className="font-mono text-zinc-900 dark:text-zinc-100">&quot;password123&quot;</code>, their database records would look identical!
          Attackers could also precalculate tables of billions of common hashes (known as <em>rainbow tables</em>) to crack passwords instantly.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 pt-1">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-900 dark:text-zinc-100">
                1. What is a Salt?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              A <strong>salt</strong> is a unique, cryptographically random string (e.g. 16 random bytes) generated automatically for each user upon account creation.
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>Key Fact:</strong> Salts are <em>not secret</em>. They are stored right next to the hash in the database.
              Their value comes from <em>uniqueness</em>: because every user has a different salt, identical passwords result in completely different hashes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Lock className="w-4 h-4" />
              <h3 className="text-sm font-bold font-mono uppercase text-zinc-900 dark:text-zinc-100">
                2. What is a Pepper?
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              A <strong>pepper</strong> is an application-wide secret value added to passwords before they are hashed.
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>Key Fact:</strong> Peppers <em>must be kept strictly secret</em>. They are stored outside the database (in secure environment variables or a key vault).
              If the database is stolen, attackers still cannot crack the hashes without the pepper from the application server.
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
                  <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Primary Defense</td>
                  <td className="p-3.5">Stops precomputed rainbow tables &amp; identical hashes</td>
                  <td className="p-3.5">Protects hashes if database dump is stolen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section className="space-y-3 pt-2">
        <PasswordHashingSimulator />
      </section>

      {/* D. Why Not Use SHA-256? */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          D. Why Not Use SHA-256?
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Students often ask: <em>&quot;SHA-256 is a famous cryptographic hash function used in Bitcoin and HTTPS certificates. Why can&apos;t we use it for passwords?&quot;</em>
        </p>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          The answer is <strong>speed</strong>. SHA-256 and MD5 were engineered to verify huge files and signatures in nanoseconds.
          Because they are so fast, modern graphics cards (GPUs) can compute <strong>hundreds of millions of SHA-256 hashes per second</strong>.
          If an attacker steals a database of salted SHA-256 hashes, they can test millions of password guesses every single second.
        </p>

        <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-mono">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            The Core Principle of Password Hashing
          </div>
          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
            Password hashing algorithms must be <strong>deliberately slow and resource-intensive</strong>!
            When a user logs in once, waiting 200 milliseconds is completely unnoticeable.
            However, that small delay makes it practically impossible for an attacker to test hundreds of millions of guesses offline.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Dedicated Password-Hashing Algorithms:
          </h3>
          <div className="grid sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-emerald-300 dark:border-emerald-500/30 shadow-xs space-y-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-sm block">Argon2id (Recommended)</span>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                The modern gold standard. Winner of the international Password Hashing Competition. It requires both processing time and substantial computer memory (RAM).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-sm block">bcrypt</span>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                A battle-tested classic created in 1999. It uses a configurable work factor (cost) to slow down calculations as computers get faster.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono text-sm block">PBKDF2</span>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                A standardized legacy option based on repeating a hash function thousands of times. Widely supported, but lacks memory-hardness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E. Understanding Argon2id */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          E. Understanding Argon2id
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Argon2id is currently recommended by security organizations like OWASP because it is <strong>memory-hard</strong>.
          It gives system architects three configurable tuning knobs:
        </p>

        <div className="grid sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100">1. Memory Cost</span>
            </div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              m = 65536 (64 MB RAM)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Forces the computer to allocate physical memory per hash. Graphics cards have thousands of cores but very little memory per core, preventing massive parallel cracking.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100">2. Time Cost</span>
            </div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              t = 3 (3 Iterations)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              How many computational passes the algorithm makes over the allocated memory. Increasing iterations increases calculation time linearly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-mono font-bold uppercase text-zinc-900 dark:text-zinc-100">3. Parallelism</span>
            </div>
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
              p = 4 (4 CPU Threads)
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              How many independent CPU threads cooperate to compute the hash on modern multi-core processors.
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed pt-1">
          <em>Note for engineers:</em> Parameters should be chosen based on server capacity and current OWASP guidelines (e.g. 64 MB RAM with 3 iterations for general servers, or 19 MB with 2 iterations when memory is constrained).
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
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">User Creates Password</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">User types their password on the signup form over HTTPS.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Step 2</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Generate Random Salt</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Server generates a unique cryptographically random salt.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Step 3</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Argon2id Processing</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Server computes the hash using the password, salt, and parameters.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">Step 4</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Database Persistence</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Salt, parameters, and resulting hash are safely saved in the user record.</p>
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
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">User Submits Password</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">User enters their email and password on the login screen.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Step 2</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Retrieve Stored Hash</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Server fetches the user&apos;s stored Argon2id record from the database.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Step 3</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Constant-Time Verify</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">Library extracts salt and parameters, re-hashes, and compares.</p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">Step 4</span>
              <p className="text-zinc-800 dark:text-zinc-200 font-medium">Success or Failure</p>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">If verified &rarr; Login succeeds (200 OK). If mismatch &rarr; 401 Unauthorized.</p>
            </div>
          </div>
        </div>
      </section>

      {/* G. Practical Code Example (Expandable Developer Reference) */}
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
                  G. Practical Code Example (Node.js &amp; Argon2)
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Optional expandable developer reference using modern industry libraries
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
                <span className="font-bold text-zinc-900 dark:text-zinc-100">How this works in practice:</span>
                <p>
                  The <code className="font-mono text-emerald-600 dark:text-emerald-400">hash()</code> function handles salt generation automatically.
                  The <code className="font-mono text-emerald-600 dark:text-emerald-400">verify()</code> function reads the parameters directly from the stored string and compares in constant time to prevent side-channel timing attacks.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* H. Common Mistakes */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          H. Common Mistakes to Avoid
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono uppercase">
              <XCircle className="w-4 h-4 shrink-0" />
              1. Storing Plaintext Passwords
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Never store passwords unhashed. If the database is ever leaked, every user account is immediately compromised.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono uppercase">
              <XCircle className="w-4 h-4 shrink-0" />
              2. Using Fast Hashes (SHA-256 / MD5)
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Even with a salt, fast general-purpose hashes can be brute-forced at hundreds of millions of guesses per second on modern GPUs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono uppercase">
              <XCircle className="w-4 h-4 shrink-0" />
              3. Reusing Salts Across Users
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Using one universal salt destroys the security value of salting. Identical passwords will once again produce identical hashes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold font-mono uppercase">
              <XCircle className="w-4 h-4 shrink-0" />
              4. Manual String Comparison
            </div>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Do not compare hashes with standard <code className="font-mono text-zinc-900 dark:text-zinc-100">===</code> (which stops on the first mismatch, enabling timing attacks). Always use the library&apos;s <code className="font-mono text-zinc-900 dark:text-zinc-100">verify()</code> function.
            </p>
          </div>
        </div>
      </section>

      {/* I. Knowledge Check */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            I. Knowledge Check
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
