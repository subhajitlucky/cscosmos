'use client';

import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Trash2,
  Eye,
  Edit3,
  Check,
} from 'lucide-react';

// ============================================================================
// Interactive Visualizer: "Who Can Access What?"
// ============================================================================
type Role = 'guest' | 'employee' | 'admin';
type Action = 'public' | 'documents' | 'deleteUser';

function WhoCanAccessWhatVisualizer() {
  const [selectedRole, setSelectedRole] = useState<Role>('employee');
  const [selectedAction, setSelectedAction] = useState<Action>('documents');

  // Role metadata
  const roles = [
    {
      id: 'guest' as Role,
      label: 'Guest',
      sublabel: 'Not logged in (Anonymous)',
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
      label: 'Administrator',
      sublabel: 'Logged in as Sarah',
      icon: ShieldCheck,
      isAuthenticated: true,
    },
  ];

  // Action metadata
  const actions = [
    {
      id: 'public' as Action,
      label: 'View Public Info',
      desc: 'Read public announcement page',
      icon: Eye,
      requiresAuth: false,
    },
    {
      id: 'documents' as Action,
      label: 'Edit Documents',
      desc: 'Modify team files and workspace',
      icon: Edit3,
      requiresAuth: true,
    },
    {
      id: 'deleteUser' as Action,
      label: 'Delete Users',
      desc: 'Remove user accounts from the system',
      icon: Trash2,
      requiresAuth: true,
    },
  ];

  // Quick Preset Scenarios for easy testing
  const quickScenarios: { label: string; role: Role; action: Action }[] = [
    { label: 'Guest → Public Info', role: 'guest', action: 'public' },
    { label: 'Employee → Edit Documents', role: 'employee', action: 'documents' },
    { label: 'Employee → Delete Users', role: 'employee', action: 'deleteUser' },
    { label: 'Admin → Delete Users', role: 'admin', action: 'deleteUser' },
  ];

  const currentRoleObj = roles.find((r) => r.id === selectedRole)!;
  const currentActionObj = actions.find((a) => a.id === selectedAction)!;

  const requiresAuth = currentActionObj.requiresAuth;
  const isAuthenticated = currentRoleObj.isAuthenticated;

  // Step 1: Authentication Check (Who are you?)
  let authNPassed = false;
  let authNStatus = '';
  let authNDesc = '';

  if (!requiresAuth) {
    authNPassed = true;
    authNStatus = 'Not Required (Public)';
    authNDesc = isAuthenticated
      ? `User is logged in as ${currentRoleObj.label}, but public pages do not require authentication.`
      : 'No login required. Public pages are openly accessible to all visitors.';
  } else if (isAuthenticated) {
    authNPassed = true;
    authNStatus = 'Passed ✅';
    authNDesc = `Identity verified: Logged in as ${currentRoleObj.label}.`;
  } else {
    authNPassed = false;
    authNStatus = 'Failed ❌';
    authNDesc = 'Visitor is anonymous (not logged in). A valid session or login is required.';
  }

  // Step 2: Authorization Check (What can you do?)
  let isAuthorized = false;
  let authZStatus = '';
  let authZDesc = '';

  if (!authNPassed) {
    // If AuthN failed on a protected resource, AuthZ is skipped / blocked
    isAuthorized = false;
    authZStatus = 'Skipped (Login Required)';
    authZDesc = 'Cannot check permissions because identity is unknown. Please log in first.';
  } else if (!requiresAuth) {
    // Public resource
    isAuthorized = true;
    authZStatus = 'Permitted ✅';
    authZDesc = 'Public information is accessible to everyone.';
  } else {
    // Protected resource with authenticated user
    if (selectedRole === 'admin') {
      isAuthorized = true;
      authZStatus = 'Permitted ✅';
      authZDesc = 'Administrator role has full permissions across the system.';
    } else if (selectedRole === 'employee') {
      if (selectedAction === 'documents') {
        isAuthorized = true;
        authZStatus = 'Permitted ✅';
        authZDesc = 'Employee role has permission to edit team documents.';
      } else {
        isAuthorized = false;
        authZStatus = 'Denied ❌';
        authZDesc = 'Employee role does not have permission to delete user accounts (Admin only).';
      }
    }
  }

  // Final HTTP Status & Explanation
  let httpStatus = 200;
  let statusBadge = '200 OK';
  let explanation = '';

  if (requiresAuth && !isAuthenticated) {
    httpStatus = 401;
    statusBadge = '401 Unauthorized';
    explanation =
      'HTTP 401 Unauthorized: The request was rejected because the user is not authenticated. The application must know who you are before checking your permissions.';
  } else if (!isAuthorized) {
    httpStatus = 403;
    statusBadge = '403 Forbidden';
    explanation = `HTTP 403 Forbidden: Identity is confirmed as ${currentRoleObj.label}, but this account does not have permission to ${currentActionObj.label.toLowerCase()}. Only Administrators can delete users.`;
  } else {
    httpStatus = 200;
    statusBadge = '200 OK (Access Granted)';
    if (!requiresAuth) {
      explanation =
        'HTTP 200 OK (Access Granted): Public information is accessible to all visitors without requiring credentials.';
    } else {
      explanation = `HTTP 200 OK (Access Granted): ${currentRoleObj.label} is successfully authenticated and has the required authorization to ${currentActionObj.label.toLowerCase()}.`;
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800/80 pb-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Simulation
          </span>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1">
            Who Can Access What?
          </h3>
        </div>
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          Select a role and an action to observe the security checks
        </span>
      </div>

      {/* Quick Scenario Shortcuts */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase font-mono tracking-wider text-zinc-500 dark:text-zinc-400">
          Try a Common Scenario:
        </label>
        <div className="flex flex-wrap gap-2">
          {quickScenarios.map((qs) => {
            const isActive = selectedRole === qs.role && selectedAction === qs.action;
            return (
              <button
                key={qs.label}
                onClick={() => {
                  setSelectedRole(qs.role);
                  setSelectedAction(qs.action);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-zinc-950 font-bold shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                {qs.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selectors Grid */}
      <div className="grid sm:grid-cols-2 gap-4 pt-1">
        {/* 1. Pick a Role */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-600 dark:text-zinc-400">
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
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1.5 ${
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  />
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {r.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 truncate">
                    {r.sublabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Pick an Action */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase font-mono tracking-wider text-zinc-600 dark:text-zinc-400">
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
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                      : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 mb-1.5 ${
                      isSelected
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  />
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {a.label}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight mt-0.5 truncate">
                    {a.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step-by-Step Security Evaluation Cards */}
      <div className="grid sm:grid-cols-2 gap-3 pt-2">
        {/* Step 1: Authentication Check */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wide">
              Step 1: Authentication Check (Who are you?)
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                !requiresAuth
                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-400'
                  : isAuthenticated
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400'
              }`}
            >
              {authNStatus}
            </span>
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {authNDesc}
          </p>
        </div>

        {/* Step 2: Authorization Check */}
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-600 dark:text-zinc-400 font-mono text-[11px] uppercase tracking-wide">
              Step 2: Authorization Check (What can you do?)
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                !authNPassed
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  : isAuthorized
                    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400'
              }`}
            >
              {authZStatus}
            </span>
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {authZDesc}
          </p>
        </div>
      </div>

      {/* Final Outcome Banner */}
      <div
        className={`p-4 rounded-2xl border transition-all ${
          httpStatus === 200
            ? 'bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
            : httpStatus === 401
              ? 'bg-rose-50/80 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'
              : 'bg-amber-50/80 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-950 dark:text-amber-200'
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-2 mb-2">
          <div className="flex items-center gap-2">
            {httpStatus === 200 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Final Result:
            </span>
          </div>
          <span
            className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full ${
              httpStatus === 200
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400'
                : httpStatus === 401
                  ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400'
                  : 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400'
            }`}
          >
            HTTP {statusBadge}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
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
// Main Topic 1 Content Component
// ============================================================================
export default function Topic1Foundations() {
  return (
    <div className="space-y-10">
      {/* A. Introduction */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          A. Introduction
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Every modern web application—from university portals and social media networks to banking systems—must protect its resources and user data. To do this reliably, security systems split access control into two separate, sequential checkpoints: first confirming who is making the request, and then determining whether that person has permission to perform the requested action.
        </p>
      </section>

      {/* B. Authentication */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          B. Authentication (AuthN)
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          <strong>Authentication</strong> is the process of verifying a user&apos;s identity. When you log in with your email and password, the server securely verifies the submitted password against the stored password hash to prove who you are.
        </p>
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-mono">
            <Lightbulb className="w-4 h-4" /> Real-World Analogy
          </div>
          <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
            Think of showing your <strong>passport</strong> at an airport. The officer checks your photo and passport details to confirm who you are before letting you proceed.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Common Authentication Methods:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Passwords</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Verified against stored hash</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">OTPs (One-Time)</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">SMS or authenticator app</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Passkeys</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Device biometric or security key</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Biometrics</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Fingerprint or Face ID</span>
            </div>
          </div>
        </div>
      </section>

      {/* C. Authorization */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          C. Authorization (AuthZ)
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          <strong>Authorization</strong> is the process of deciding what an authenticated user is permitted
          to access or modify.
        </p>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          Why isn&apos;t authentication enough on its own? Because logging in only tells the application
          <em> who</em> you are, not what you should be allowed to touch. An intern and the company CEO
          can both log into the same corporate portal, but they should not have the same access permissions.
        </p>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Example: A Company Application
          </span>
          <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Employee</span>
              <span className="text-zinc-600 dark:text-zinc-400 mt-1 block">
                Can view company policies and their own payslip.
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Manager</span>
              <span className="text-zinc-600 dark:text-zinc-400 mt-1 block">
                Can view and approve time-off requests for their team.
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Administrator</span>
              <span className="text-zinc-600 dark:text-zinc-400 mt-1 block">
                Can add or delete user accounts and manage system settings.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* D. Comparison Table */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          D. Authentication vs Authorization
        </h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 font-normal">
          Here is a quick side-by-side comparison to help you remember the difference:
        </p>
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Feature</th>
                <th className="p-3.5 text-emerald-700 dark:text-emerald-400 font-bold">Authentication (AuthN)</th>
                <th className="p-3.5 text-zinc-900 dark:text-zinc-100 font-bold">Authorization (AuthZ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
              <tr>
                <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Core Question</td>
                <td className="p-3.5">&quot;Who are you?&quot;</td>
                <td className="p-3.5">&quot;What are you allowed to do?&quot;</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Primary Purpose</td>
                <td className="p-3.5">Verifies user identity</td>
                <td className="p-3.5">Determines access permissions</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Order of Execution</td>
                <td className="p-3.5">Happens <strong>first</strong></td>
                <td className="p-3.5">Happens <strong>second</strong> (after identity is known)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-zinc-900 dark:text-zinc-100">Real-World Analogy</td>
                <td className="p-3.5">Showing your passport at border control</td>
                <td className="p-3.5">Showing your boarding pass at the plane gate</td>
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
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          E. How They Work Together (Alice&apos;s Scenario)
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
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
              desc: 'The server securely verifies the submitted password against the stored password hash and confirms: "Yes, this is Alice."',
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
              className="p-4 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs flex items-start gap-3.5"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {item.num}
              </span>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* F. HTTP Status Codes */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          F. HTTP Status Codes: 401 vs 403
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
          When an action fails, web servers use standard HTTP status codes to tell the client what went wrong.
          Understanding these two codes is essential for any developer:
        </p>

        <div className="grid sm:grid-cols-2 gap-3 pt-1">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-mono text-rose-600 dark:text-rose-400">
                HTTP 401 Unauthorized
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-500/10 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 font-bold">
                AuthN Failed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
              <strong>Meaning:</strong> &quot;We don&apos;t know who you are.&quot;
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The request did not provide valid login credentials, or your session has expired. You need
              to log in first.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                HTTP 403 Forbidden
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 font-bold">
                AuthZ Failed
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
              <strong>Meaning:</strong> &quot;We know who you are, but you cannot touch this.&quot;
            </p>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              You are successfully authenticated, but your account or role does not have permission
              to view or edit this resource.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <span className="font-bold text-zinc-800 dark:text-zinc-200">Optional Note (HTTP 404): </span>
          In some security-sensitive systems, the server may return <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-semibold">404 Not Found</code> instead
          of <code className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-mono font-semibold">403 Forbidden</code>. This is done to prevent
          attackers from discovering whether a sensitive document or endpoint exists.
        </div>
      </section>

      {/* G. Common Misconceptions */}
      <section className="space-y-3">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
          G. Common Misconceptions
        </h2>
        <div className="grid gap-3">
          {[
            {
              myth: 'Logging in gives a user access to everything in the application.',
              fact: 'Logging in only confirms who you are. Your specific assigned role (such as student or employee) determines what you can actually see and do.',
            },
            {
              myth: 'Authentication and authorization are just different words for the same thing.',
              fact: 'They are two completely distinct security checkpoints. Authentication answers "Who are you?" while Authorization answers "What are you allowed to do?"',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-1.5"
            >
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>Myth: &quot;{item.myth}&quot;</span>
              </div>
              <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 pl-6 leading-relaxed font-medium">
                <strong className="text-emerald-700 dark:text-emerald-400 font-bold">Fact: </strong>
                {item.fact}
              </div>
            </div>
          ))}
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
        <KnowledgeCheckQuiz />
      </section>
    </div>
  );
}
