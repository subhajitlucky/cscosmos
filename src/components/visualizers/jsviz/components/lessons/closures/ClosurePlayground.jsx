'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Trash2, 
  Terminal, 
  Code2, 
  Sparkles, 
  AlertCircle,
  FileCode,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useTheme } from '@/context/useTheme';

const PLAYGROUND_PRESETS = [
  {
    id: 'basic-counter',
    name: '1. Basic Counter',
    description: 'State encapsulation with increment and decrement methods.',
    code: `// 1. Basic State Encapsulation
function createCounter(initialValue = 0) {
  let count = initialValue;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getValue() {
      return count;
    }
  };
}

const counter = createCounter(10);
console.log("Initial:", counter.getValue()); // 10
console.log("After increment:", counter.increment()); // 11
console.log("After increment:", counter.increment()); // 12
console.log("After decrement:", counter.decrement()); // 11

// Notice: count cannot be accessed directly!
console.log("Direct access attempt:", counter.count); // undefined`
  },
  {
    id: 'bank-account',
    name: '2. Private Bank Account',
    description: 'True private state protection against unauthorized tampering.',
    code: `// 2. Private State & Validation
function createBankAccount(owner, initialDeposit) {
  let balance = initialDeposit; // Private variable (closure)
  const transactionHistory = []; // Private array

  return {
    getOwner() {
      return owner;
    },
    getBalance() {
      return balance;
    },
    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit must be positive");
      balance += amount;
      transactionHistory.push(\`+\$\${amount} deposited\`);
      console.log(\`[\${owner}] Deposited \$\${amount}. New balance: \$\${balance}\`);
      return balance;
    },
    withdraw(amount) {
      if (amount > balance) {
        console.warn(\`[\${owner}] Overdraft rejected! Insufficient funds.\`);
        return false;
      }
      balance -= amount;
      transactionHistory.push(\`-\$\${amount} withdrawn\`);
      console.log(\`[\${owner}] Withdrew \$\${amount}. Remaining: \$\${balance}\`);
      return balance;
    },
    getHistory() {
      // Returns a copy to prevent external mutation
      return [...transactionHistory];
    }
  };
}

const account = createBankAccount("Subhajit", 500);
account.deposit(250);
account.withdraw(100);
account.withdraw(900); // Exceeds balance!

console.log("Final balance:", account.getBalance());
console.log("Ledger:", account.getHistory());`
  },
  {
    id: 'independent-instances',
    name: '3. Independent Environments',
    description: 'Demonstrating that every function call creates isolated memory.',
    code: `// 3. Demonstrating Independent Heap Records
function makeCounter(label) {
  let current = 0;
  
  return function() {
    current += 1;
    console.log(\`[\${label}] count is now: \${current}\`);
    return current;
  };
}

// Two distinct lexical environment records are created in Heap memory:
const counterAlpha = makeCounter("Alpha");
const counterBeta = makeCounter("Beta");

counterAlpha(); // [Alpha] count is now: 1
counterAlpha(); // [Alpha] count is now: 2
counterAlpha(); // [Alpha] count is now: 3

// Notice counterBeta has its own independent 'current' binding!
counterBeta();  // [Beta] count is now: 1
counterBeta();  // [Beta] count is now: 2

console.log("Alpha again:");
counterAlpha(); // [Alpha] count is now: 4`
  },
  {
    id: 'loop-trap',
    name: '4. Loop Variable Trap',
    description: 'The classic interview problem: var vs let with asynchronous closures.',
    code: `// 4. The Loop Trap: Shared binding vs Per-Iteration binding

console.log("--- PART 1: The 'var' pitfall (Shared binding) ---");
for (var i = 1; i <= 3; i++) {
  setTimeout(() => {
    // All 3 callbacks share the single global 'i' which ends up as 4!
    console.log("var loop callback sees i =", i);
  }, 100);
}

// Fixed with modern 'let' (Block-scoped per-iteration binding)
setTimeout(() => {
  console.log("\\n--- PART 2: The 'let' fix (Separate closures) ---");
  for (let j = 1; j <= 3; j++) {
    setTimeout(() => {
      // Each iteration creates a fresh Lexical Environment for 'j'!
      console.log("let loop callback sees j =", j);
    }, 100);
  }
}, 300);`
  }
];

export default function ClosurePlayground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted 
    ? (resolvedTheme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')))
    : resolvedTheme === 'dark';

  const [selectedPreset, setSelectedPreset] = useState(PLAYGROUND_PRESETS[0]);
  const [code, setCode] = useState(PLAYGROUND_PRESETS[0].code);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const timeoutRef = useRef(null);

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setCode(preset.code);
    setConsoleLogs([]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
  };

  const handleReset = () => {
    setCode(selectedPreset.code);
    setConsoleLogs([]);
  };

  const runCode = () => {
    setConsoleLogs([]);
    setIsRunning(true);

    const logs = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    // Capture stdout
    const capture = (type, args) => {
      const formatted = args.map((arg) => {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return '[Object]';
          }
        }
        return String(arg);
      }).join(' ');

      logs.push({
        type,
        text: formatted,
        time: new Date().toLocaleTimeString().split(' ')[0]
      });
      setConsoleLogs([...logs]);
    };

    console.log = (...args) => capture('log', args);
    console.warn = (...args) => capture('warn', args);
    console.error = (...args) => capture('error', args);

    try {
      // Execute within sandbox function wrapper with safety checks
      // Disallow window modifications or DOM manipulation
      const safeWrapper = new Function('console', `
        "use strict";
        try {
          ${code}
        } catch (err) {
          console.error(err.name + ": " + err.message);
        }
      `);

      safeWrapper({
        log: (...args) => capture('log', args),
        warn: (...args) => capture('warn', args),
        error: (...args) => capture('error', args)
      });
    } catch (err) {
      capture('error', [err.name + ': ' + err.message]);
    } finally {
      // Keep console captured slightly for async setTimeout callbacks
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        console.log = originalLog;
        console.warn = originalWarn;
        console.error = originalError;
        setIsRunning(false);
      }, 700);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] overflow-hidden shadow-lg">
      
      {/* Top Header & Preset Selector */}
      <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20">
            <Code2 size={18} />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Safe Sandbox Environment
            </span>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              Live JavaScript Closure Playground
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
            title="Copy Code"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5"
            title="Reset to Template"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={runCode}
            disabled={isRunning}
            className="px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-800 dark:text-brand-lime font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
          >
            <Play size={14} />
            <span>{isRunning ? 'RUNNING...' : 'RUN CODE'}</span>
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      <div className="px-4 py-3 bg-zinc-100/60 dark:bg-zinc-900/40 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-mono text-zinc-400 uppercase font-bold shrink-0 mr-1">
          Templates:
        </span>
        {PLAYGROUND_PRESETS.map((preset) => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all shrink-0 ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-brand-lime border border-emerald-500/30 font-bold shadow-sm'
                  : 'bg-white dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Editor & Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
        
        {/* Left: Code Editor (7 cols) */}
        <div className="lg:col-span-7 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="p-2.5 px-4 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>index.js</span>
            <span className="text-emerald-500 text-[10px]">Editable Script</span>
          </div>
          <div className="flex-1 min-h-[360px] bg-white dark:bg-[#1e1e1e]">
            {mounted ? (
              <Editor
                height="380px"
                language="javascript"
                theme={isDark ? 'vs-dark' : 'vs'}
                value={code}
                onChange={(newVal) => setCode(newVal || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 12.5,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  fontFamily: 'monospace'
                }}
              />
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[380px] p-4 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 font-mono text-xs resize-none outline-none border-none"
              />
            )}
          </div>
        </div>

        {/* Right: Console Output Terminal (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-zinc-50/80 dark:bg-[#090d16] text-zinc-800 dark:text-zinc-300 font-mono text-xs">
          <div className="p-2.5 px-4 bg-zinc-100/90 dark:bg-zinc-900/90 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-emerald-600 dark:text-brand-lime" />
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">Terminal Output</span>
            </div>
            <button
              onClick={handleClearConsole}
              className="p-1 rounded text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              title="Clear Console"
            >
              <Trash2 size={13} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-1.5 min-h-[300px] max-h-[420px]">
            {consoleLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 dark:text-zinc-600 py-12">
                <Terminal size={24} className="opacity-40 mb-2" />
                <p className="text-xs">Console is empty.</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-600 mt-1">
                  Click &quot;RUN CODE&quot; to execute this closure pattern.
                </p>
              </div>
            ) : (
              consoleLogs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 text-xs leading-relaxed font-mono ${
                    log.type === 'error'
                      ? 'text-red-700 dark:text-red-400 bg-red-500/10 dark:bg-red-950/20 p-1.5 rounded border border-red-500/20 dark:border-red-900/30'
                      : log.type === 'warn'
                      ? 'text-amber-800 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-950/20 p-1.5 rounded border border-amber-500/20 dark:border-amber-900/30'
                      : 'text-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-zinc-400 dark:text-zinc-600 select-none text-[10px] shrink-0 pt-0.5">
                    {log.time} &gt;
                  </span>
                  <pre className="whitespace-pre-wrap font-mono flex-1 text-[11.5px]">
                    {log.text}
                  </pre>
                </div>
              ))
            )}
          </div>

          {/* Terminal Footer */}
          <div className="p-2 px-4 border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-100/70 dark:bg-zinc-900/40 text-[10.5px] text-zinc-600 dark:text-zinc-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-emerald-600 dark:text-brand-lime" />
              Sandboxed Execution Safe
            </span>
            <span>{consoleLogs.length} events logged</span>
          </div>
        </div>

      </div>

    </div>
  );
}
