'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Sparkles,
  FileText,
  Trash2,
  Eye,
  Edit3,
  Check,
} from 'lucide-react';

// ============================================================================
// Interactive Visualizer: "Who Can Access What?"
// ============================================================================
type Role = 'guest' | 'employee' | 'admin';
type Action = 'profile' | 'documents' | 'deleteUser';

function WhoCanAccessWhatVisualizer() {
  const [selectedRole, setSelectedRole] = useState<Role>('employee');
  const [selectedAction, setSelectedAction] = useState<Action>('documents');

  // Role metadata
  const roles = [
    {
      id: 'guest' as Role,
      label: 'Guest',
      sublabel: 'Not logged in',
      icon: User,
      isAuthenticated: false,
    },
    {
      id: 'employee' as Role,
      label: 'Employee',
      sublabel: 'Logged in as Alice',
      icon: User,
      isAuthenticated: true,
    },
    {
      id: 'admin' as Role,
      label: 'Admin',
      sublabel: 'Logged in as Sarah',
      icon: ShieldCheck,
      isAuthenticated: true,
    },
  ];

  // Action metadata
  const actions = [
    {
      id: 'profile' as Action,
      label: 'View Profile',
      desc: 'Read basic public information',
      icon: Eye,
    },
    {
      id: 'documents' as Action,
      label: 'Edit Documents',
      desc: 'Modify team files and notes',
      icon: Edit3,
    },
    {
      id: 'deleteUser' as Action,
      label: 'Delete Users',
      desc: 'Remove user accounts from the system',
      icon: Trash2,
    },
  ];

  const currentRoleObj = roles.find((r) => r.id === selectedRole)!;
  const currentActionObj = actions.find((a) => a.id === selectedAction)!;

  // Evaluation logic
  const isAuthenticated = currentRoleObj.isAuthenticated;

  // Authorization policy matrix
  let isAuthorized = false;
  if (isAuthenticated) {
    if (selectedRole === 'admin') {
      isAuthorized = true; // Admin can do everything
    } else if (selectedRole === 'employee') {
      isAuthorized = selectedAction === 'profile' || selectedAction === 'documents';
    }
  }

  // Determine final HTTP status & explanation
  let httpStatus = 200;
  let statusText = 'OK (Access Granted)';
  let explanation = '';

  if (!isAuthenticated) {
    httpStatus = 401;
    statusText = '401 Unauthorized';
    explanation =
      'The user is not logged in. The application does not know who this visitor is, so access is denied immediately before checking permissions.';
  } else if (!isAuthorized) {
    httpStatus = 403;
    statusText = '403 Forbidden';
    explanation = `${currentRoleObj.label} is logged in successfully, but does not have permission to ${currentActionObj.label.toLowerCase()}. Only Admins can perform this action.`;
  } else {
    httpStatus = 200;
    statusText = '200 OK (Access Granted)';
    explanation = `${currentRoleObj.label} is authenticated and has the required permission to ${currentActionObj.label.toLowerCase()}. The action succeeds!`;
  }

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Simulation
          </span>
          <h3 className="text-lg font-bold text-zinc-100 mt-1">
            Who Can Access What?
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-400">
          Select a role and an action to see the result
        </span>
      </div>

      {/* Selectors Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* 1. Pick a Role */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400">
            1. Select User Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((r) => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-zinc-100 shadow-sm'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1.5 ${
                      isSelected ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  />
                  <div className="text-xs font-bold">{r.label}</div>
                  <div className="text-[10px] text-zinc-500 leading-tight mt-0.5 truncate">
                    {r.sublabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Pick an Action */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-400">
            2. Select Desired Action
          </label>
          <div className="grid grid-cols-3 gap-2">
            {actions.map((a) => {
              const Icon = a.icon;
              const isSelected = selectedAction === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAction(a.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-zinc-100 shadow-sm'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1.5 ${
                      isSelected ? 'text-emerald-400' : 'text-zinc-500'
                    }`}
                  />
                  <div className="text-xs font-bold">{a.label}</div>
                  <div className="text-[10px] text-zinc-500 leading-tight mt-0.5 truncate">
                    {a.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Evaluation Results Banner */}
      <div className="grid sm:grid-cols-2 gap-3 pt-2">
        {/* Step 1: Authentication Result */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-400 font-mono text-[11px] uppercase">
              Step 1: Authentication Check
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                isAuthenticated
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {isAuthenticated ? 'Authenticated ✅' : 'Unauthenticated ❌'}
            </span>
          </div>
          <div className="text-xs text-zinc-300">
            {isAuthenticated ? (
              <span>
                Identity is confirmed: <strong className="text-zinc-100">{currentRoleObj.label}</strong> is logged in.
              </span>
            ) : (
              <span>
                Anonymous visitor: No credentials or session token provided.
              </span>
            )}
          </div>
        </div>

        {/* Step 2: Authorization Result */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-400 font-mono text-[11px] uppercase">
              Step 2: Authorization Check
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                !isAuthenticated
                  ? 'bg-zinc-800 text-zinc-500'
                  : isAuthorized
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {!isAuthenticated
                ? 'Skipped'
                : isAuthorized
                  ? 'Permitted ✅'
                  : 'Denied ❌'}
            </span>
          </div>
          <div className="text-xs text-zinc-300">
            {!isAuthenticated ? (
              <span>
                Cannot evaluate permissions because the visitor is not logged in.
              </span>
            ) : isAuthorized ? (
              <span>
                Role <strong className="text-zinc-100">{currentRoleObj.label}</strong> has permission to <strong className="text-zinc-100">{currentActionObj.label}</strong>.
              </span>
            ) : (
              <span>
                Role <strong className="text-zinc-100">{currentRoleObj.label}</strong> lacks permission to <strong className="text-zinc-100">{currentActionObj.label}</strong>.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Final Outcome Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          httpStatus === 200
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : httpStatus === 401
              ? 'bg-rose-500/10 border-rose-500/30'
              : 'bg-amber-500/10 border-amber-500/30'
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2 mb-2">
          <div className="flex items-center gap-2">
            {httpStatus === 200 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Final Result:
            </span>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${
              httpStatus === 200
                ? 'bg-emerald-500/20 text-emerald-400'
                : httpStatus === 401
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            HTTP {statusText}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          {explanation}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Interactive Knowledge Check Component
// ============================================================================
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question:
      'When you unlock your smartphone using your fingerprint or entering a PIN, which security process is taking place?',
    options: [
      'Authentication (Proving who you are)',
      'Authorization (Checking what files you can edit)',
      'Data Encryption',
      'Database Backup',
    ],
    correctIndex: 0,
    explanation:
      'Authentication verifies identity ("Who is holding this phone?"). Once your identity is confirmed, the phone unlocks.',
  },
  {
    id: 2,
    question:
      'An authenticated university student logs into the portal and tries to edit the exam grades of their classmates. Access is blocked. Which check stopped them?',
    options: [
      'Authentication failed (The student is not recognized)',
      'Authorization failed (The student has no permission to change grades)',
      'Network Timeout',
      'Password Expiration',
    ],
    correctIndex: 1,
    explanation:
      'The student is successfully logged in (Authentication succeeded), but their student role does not allow editing grades (Authorization failed).',
  },
  {
    id: 3,
    question:
      'Which HTTP status code should a server return when a user visits a private page without logging in at all?',
    options: ['200 OK', '401 Unauthorized', '403 Forbidden', '500 Server Error'],
    correctIndex: 1,
    explanation:
      'HTTP 401 Unauthorized means "We do not know who you are. Please log in first." HTTP 403 Forbidden is used when the user is already logged in but lacks permission.',
  },
  {
    id: 4,
    question:
      'True or False: If a user logs in successfully with a valid password, they should automatically have permission to access every page and database record in the application.',
    options: [
      'True (Logging in grants universal access)',
      'False (Authentication only proves identity; authorization must still check permissions for each resource)',
    ],
    correctIndex: 1,
    explanation:
      'Logging in simply confirms identity. Applications must always verify whether that specific user or role has permission to access the requested resource.',
  },
];

function KnowledgeCheckQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setRevealed((prev) => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="space-y-4">
      {QUIZ_QUESTIONS.map((q) => {
        const userChoice = selectedAnswers[q.id];
        const isRevealed = revealed[q.id];
        const isCorrect = userChoice === q.correctIndex;

        return (
          <div
            key={q.id}
            className="p-5 sm:p-6 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-4"
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {q.id}
              </span>
              <p className="text-sm sm:text-base font-semibold text-zinc-100 leading-snug">
                {q.question}
              </p>
            </div>

            <div className="grid gap-2 pl-9">
              {q.options.map((opt, optIdx) => {
                const isSelected = userChoice === optIdx;
                let btnStyle =
                  'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100';

                if (isRevealed) {
                  if (optIdx === q.correctIndex) {
                    btnStyle =
                      'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnStyle =
                      'bg-rose-500/10 border-rose-500 text-rose-300 font-bold';
                  } else {
                    btnStyle = 'bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60';
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
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {isRevealed && (
              <div
                className={`ml-9 p-3.5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                  isCorrect
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300'
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
// Main Topic 1 Content Component
// ============================================================================
export default function Topic1Foundations() {
  return (
    <div className="space-y-10">
      {/* A. Introduction */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          A. Introduction
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Every multi-user application needs to protect its data. Whether you are using Instagram,
          online banking, or your college student portal, the system must answer two essential questions:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              1. Authentication
            </span>
            <div className="text-base font-bold text-zinc-100">
              &quot;Who are you?&quot;
            </div>
            <p className="text-xs text-zinc-400">
              Verifying that you are really the person you claim to be.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              2. Authorization
            </span>
            <div className="text-base font-bold text-zinc-100">
              &quot;What are you allowed to do?&quot;
            </div>
            <p className="text-xs text-zinc-400">
              Checking what actions and records you have permission to access.
            </p>
          </div>
        </div>
      </section>

      {/* B. Authentication */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          B. Authentication (AuthN)
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          <strong>Authentication</strong> is the process of verifying a user&apos;s identity. When you
          type your email and password to log in, you are proving to the system who you are.
        </p>
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
            <Lightbulb className="w-3.5 h-3.5" /> Real-World Example
          </div>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Think of showing your <strong>passport</strong> at airport security. The officer compares
            your face to the photo and checks the official seal. This confirms your identity. It proves
            who you are.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-zinc-200">
            Common Authentication Methods:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block">Passwords</span>
              <span className="text-[10px] text-zinc-500">Secret memorized text</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block">OTPs (One-Time)</span>
              <span className="text-[10px] text-zinc-500">6-digit SMS / app codes</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block">Passkeys</span>
              <span className="text-[10px] text-zinc-500">Hardware device credentials</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block">Biometrics</span>
              <span className="text-[10px] text-zinc-500">Fingerprint or Face ID</span>
            </div>
          </div>
        </div>
      </section>

      {/* C. Authorization */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          C. Authorization (AuthZ)
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          <strong>Authorization</strong> is the process of deciding what an authenticated user is permitted
          to access or modify.
        </p>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Why isn&apos;t authentication enough on its own? Because logging in only tells the application
          <em> who</em> you are, not what you should be allowed to touch. An intern and the company CEO
          can both log into the same corporate portal, but they should not have the same access permissions.
        </p>

        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            Example: A Company Application
          </span>
          <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block">Employee</span>
              <span className="text-zinc-400 mt-1 block">
                Can view company policies and their own payslip.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block">Manager</span>
              <span className="text-zinc-400 mt-1 block">
                Can view and approve time-off requests for their team.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="font-bold text-zinc-200 block">Administrator</span>
              <span className="text-zinc-400 mt-1 block">
                Can add or delete user accounts and manage system settings.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* D. Comparison Table */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          D. Authentication vs Authorization
        </h2>
        <p className="text-sm text-zinc-300">
          Here is a quick side-by-side comparison to help you remember the difference:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Feature</th>
                <th className="p-3.5 text-emerald-400 font-bold">Authentication (AuthN)</th>
                <th className="p-3.5 text-zinc-100 font-bold">Authorization (AuthZ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 bg-zinc-950 text-zinc-300">
              <tr>
                <td className="p-3.5 font-bold text-zinc-200">Core Question</td>
                <td className="p-3.5">&quot;Who are you?&quot;</td>
                <td className="p-3.5">&quot;What are you allowed to do?&quot;</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-200">Primary Purpose</td>
                <td className="p-3.5">Verifies user identity</td>
                <td className="p-3.5">Determines access permissions</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-200">Order of Execution</td>
                <td className="p-3.5">Happens <strong>first</strong></td>
                <td className="p-3.5">Happens <strong>second</strong> (after identity is known)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-200">Real-World Analogy</td>
                <td className="p-3.5">Showing your passport at border control</td>
                <td className="p-3.5">Showing your boarding pass at the plane gate</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-200">HTTP Status Code</td>
                <td className="p-3.5 font-mono text-emerald-400">401 Unauthorized</td>
                <td className="p-3.5 font-mono text-rose-400">403 Forbidden</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Simulation Callout */}
      <section className="space-y-3 pt-2">
        <WhoCanAccessWhatVisualizer />
      </section>

      {/* E. How They Work Together */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          E. How They Work Together (Alice&apos;s Scenario)
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Let&apos;s trace what happens when an employee named <strong>Alice</strong> tries to access
          a sensitive billing spreadsheet:
        </p>

        <div className="space-y-2.5">
          {[
            {
              num: '1',
              title: 'Alice submits her credentials',
              desc: 'Alice types her email and password into the company login page.',
            },
            {
              num: '2',
              title: 'Identity is verified (Authentication)',
              desc: 'The server verifies the password against stored records and confirms: "Yes, this is Alice."',
            },
            {
              num: '3',
              title: 'Alice requests a restricted billing document',
              desc: 'Alice clicks on the link: /company/finances/q3-billing.pdf.',
            },
            {
              num: '4',
              title: 'The server checks permissions (Authorization)',
              desc: 'The server looks at Alice’s role (Marketing Specialist) and compares it with the required permission (Finance Team).',
            },
            {
              num: '5',
              title: 'Decision is rendered',
              desc: 'Because Alice is not in Finance, the server denies access with an "Access Denied (403)" message. Alice is logged in, but not authorized for this specific file.',
            },
          ].map((item) => (
            <div
              key={item.num}
              className="p-3.5 sm:p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-start gap-3.5"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {item.num}
              </span>
              <div>
                <h4 className="text-sm font-bold text-zinc-100">{item.title}</h4>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* F. HTTP Status Codes */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          F. HTTP Status Codes: 401 vs 403
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          When an action fails, web servers use standard HTTP status codes to tell the client what went wrong.
          Understanding these two codes is essential for any developer:
        </p>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-mono text-rose-400">
                HTTP 401 Unauthorized
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                AuthN Failed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <strong>Meaning:</strong> &quot;We don&apos;t know who you are.&quot;
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The request did not provide valid login credentials, or your session has expired. You need
              to log in first.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-mono text-amber-400">
                HTTP 403 Forbidden
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AuthZ Failed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <strong>Meaning:</strong> &quot;We know who you are, but you cannot touch this.&quot;
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You are successfully authenticated, but your account or role does not have permission
              to view or edit this resource.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 leading-relaxed">
          <span className="font-bold text-zinc-200">Security Note on 404: </span>
          Sometimes, an application will return <code className="text-zinc-200">404 Not Found</code> instead
          of <code className="text-zinc-200">403 Forbidden</code>. This is done intentionally to prevent
          attackers from guessing whether a secret file exists or not.
        </div>
      </section>

      {/* G. Common Misconceptions */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
          G. Common Misconceptions
        </h2>
        <div className="grid gap-3">
          {[
            {
              myth: 'Logging in gives a user access to everything in the application.',
              fact: 'Logging in only confirms who you are. Your specific assigned role (e.g., student vs teacher) determines what you can actually see and do.',
            },
            {
              myth: 'Authentication and authorization are just different words for the same thing.',
              fact: 'They are two completely distinct security checkpoints. Authentication happens first; authorization happens second.',
            },
            {
              myth: 'Having a valid login token (like a JWT) automatically grants permission to all resources.',
              fact: 'A token is like a digital ID card. It proves identity, but the server must still check whether that ID is allowed to perform each specific action.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5"
            >
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Myth: &quot;{item.myth}&quot;</span>
              </div>
              <div className="text-xs sm:text-sm text-zinc-300 pl-6 leading-relaxed">
                <strong className="text-emerald-400">Fact: </strong>
                {item.fact}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* H. Knowledge Check */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
            H. Knowledge Check
          </h2>
        </div>
        <p className="text-sm text-zinc-400">
          Test your understanding with these 4 quick conceptual questions. Click an answer to check yourself!
        </p>
        <KnowledgeCheckQuiz />
      </section>
    </div>
  );
}
