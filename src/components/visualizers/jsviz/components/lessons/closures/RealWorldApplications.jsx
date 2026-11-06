'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Clock, 
  Cpu, 
  Play, 
  Check, 
  Copy, 
  Terminal, 
  Sparkles,
  ArrowRight,
  Code
} from 'lucide-react';
import { useTheme } from '@/context/useTheme';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { runInSandbox } from './sandboxRunner';

const APPLICATIONS = [
  {
    id: 'privacy',
    title: 'Data Encapsulation & Invariants',
    category: 'Information Hiding',
    icon: ShieldCheck,
    badgeColor: 'border-blue-500/30 text-blue-700 dark:text-blue-400 bg-blue-500/10',
    whyNeeded: 'Closures provide architectural encapsulation by keeping state inside lexical scope rather than public object properties. External code cannot bypass validation invariants or corrupt internal variables.',
    productionTip: 'CRITICAL SECURITY DISTINCTION: Closures provide encapsulation, NOT a security boundary. Any same-origin code (such as third-party packages or XSS payloads) can inspect memory or monkeypatch functions. Never store client-side API secrets or keys inside closures under the assumption of cryptographic protection.',
    code: `function createBankAccount(initialBalance) {
  // Encapsulated state in lexical scope (not object properties)
  let balance = initialBalance;
  const ledger = [];

  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit amount must be positive");
      balance += amount;
      ledger.push(\`+\$\${amount} (balance: \$\${balance})\`);
      return balance;
    },
    withdraw(amount) {
      if (amount <= 0 || amount > balance) {
        console.warn("Withdrawal rejected: insufficient balance or invalid amount.");
        return false;
      }
      balance -= amount;
      ledger.push(\`-\$\${amount} (balance: \$\${balance})\`);
      return balance;
    },
    getBalance() {
      return balance; // Read-only value accessor
    },
    getLedger() {
      return [...ledger]; // Return shallow copy to prevent external mutation
    }
  };
}

const account = createBankAccount(500);
account.deposit(200);
account.withdraw(150);

console.log("Current Balance:", account.getBalance()); // 550
console.log("Transaction Ledger:", account.getLedger());

// Direct property access is undefined (encapsulated):
console.log("account.balance:", account.balance); // undefined
// State cannot be corrupted by accidental assignments like account.balance = -9999`
  },
  {
    id: 'factories',
    title: 'Function Factories & Currying',
    category: 'Functional Architecture',
    icon: Layers,
    badgeColor: 'border-emerald-500/30 text-emerald-700 dark:text-brand-lime bg-emerald-500/10',
    whyNeeded: 'Instead of passing the same configuration parameter to every single function call, a closure factory pre-bakes the configuration once and produces specialized runner functions.',
    productionTip: 'Widely used in middleware, Redux action creators, React custom hooks, and HTTP client interceptors.',
    code: `// Function Factory: Pre-configures a base URL and authentication
function createHttpClient(baseUrl, defaultHeaders = {}) {
  // baseUrl and defaultHeaders are captured in the closure!
  return function sendRequest(path, options = {}) {
    const fullUrl = \`\${baseUrl}\${path}\`;
    const mergedHeaders = { ...defaultHeaders, ...options.headers };
    
    return \`HTTP \${options.method || 'GET'} -> \${fullUrl} with \${JSON.stringify(mergedHeaders)}\`;
  };
}

// Instantiate customized clients:
const userApi = createHttpClient("https://api.cscosmos.io/v1", {
  "X-Client": "WebCosmos",
  "Authorization": "Bearer token_abc"
});

console.log(userApi("/profile"));
console.log(userApi("/settings", { method: "POST" }));`
  },
  {
    id: 'async-handlers',
    title: 'Event Handlers & Debouncing',
    category: 'Async Coordination',
    icon: Clock,
    badgeColor: 'border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-500/10',
    whyNeeded: 'Debouncing and throttling require tracking a timer variable across asynchronous ticks without polluting the global namespace. Closures maintain timer ID continuity.',
    productionTip: 'Every utility like Lodash debounce, React useCallback, and RxJS operators relies entirely on closures to preserve timer IDs between event cycles.',
    code: `// Classic Debounce Implementation:
function debounce(callback, delayMs) {
  let timerId = null; // Stored in closure memory!

  return function debounced(...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    
    timerId = setTimeout(() => {
      callback(...args);
      timerId = null;
    }, delayMs);
  };
}

// Simulation:
const performSearch = debounce((query) => {
  console.log(\`[Search Executed] Query: "\${query}"\`);
}, 150);

console.log("User typing fast...");
performSearch("re");
performSearch("reac");
performSearch("react closures"); // Only the last call will fire!`
  },
  {
    id: 'memoization',
    title: 'Memoization & Computational Cache',
    category: 'Performance Optimization',
    icon: Cpu,
    badgeColor: 'border-purple-500/30 text-purple-700 dark:text-purple-400 bg-purple-500/10',
    whyNeeded: 'Expensive calculations (algorithms, regex compilations, matrix transformations) should only run once for identical inputs. Closures provide an isolated cache table.',
    productionTip: 'React useMemo and library memoize functions keep internal cache tables inside closures, ensuring maximum performance without memory leaks.',
    code: `function memoize(fn) {
  const cache = new Map(); // Private cache in closure scope

  return function memoized(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      console.log(\`[Cache HIT] Retrieved key: \${key}\`);
      return cache.get(key);
    }

    console.log(\`[Cache MISS] Computing key: \${key}...\`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Expensive Factorial:
const factorial = memoize((n) => {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
});

console.log("Run 1:", factorial(5));
console.log("Run 2:", factorial(5)); // Instant cache hit!`
  }
];

export default function RealWorldApplications() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted 
    ? (resolvedTheme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')))
    : resolvedTheme === 'dark';

  const syntaxTheme = isDark ? vscDarkPlus : vs;

  const [activeApp, setActiveApp] = useState(APPLICATIONS[0]);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeApp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runCode = async () => {
    setConsoleOutput([]);
    setIsRunning(true);

    try {
      const result = await runInSandbox(activeApp.code, { timeoutMs: 2500 });
      if (result.superseded) return;
      if (result.error) {
        setConsoleOutput([
          ...result.logs,
          { type: 'error', text: result.error }
        ]);
      } else if (result.logs.length === 0) {
        setConsoleOutput([{ type: 'log', text: '// Code ran cleanly with no output.' }]);
      } else {
        setConsoleOutput(result.logs);
      }
    } catch (err) {
      setConsoleOutput([{ type: 'error', text: err.message || String(err) }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-sm">
      
      {/* Top Header */}
      <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Production Architecture
            </span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Where Closures Power Modern JavaScript
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            4 Industry Patterns
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30 flex items-center gap-2 overflow-x-auto">
        {APPLICATIONS.map((app) => {
          const Icon = app.icon;
          const isSelected = activeApp.id === app.id;
          return (
            <button
              key={app.id}
              onClick={() => {
                setActiveApp(app);
                setConsoleOutput([]);
              }}
              className={`pb-3 px-3 text-xs font-mono font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                isSelected
                  ? 'border-emerald-500 text-emerald-800 dark:text-brand-lime'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Icon size={14} />
              <span>{app.title}</span>
            </button>
          );
        })}
      </div>

      {/* Pattern Content Body */}
      <div className="p-5 sm:p-6 space-y-5">
        
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40">
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-1">
              Why Closures Are Needed Here
            </span>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {activeApp.whyNeeded}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-brand-lime block mb-1">
              Production Best Practice
            </span>
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
              {activeApp.productionTip}
            </p>
          </div>
        </div>

        {/* Code & Runner Workspace */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-[#0c1017] shadow-xs">
          
          {/* Action Bar */}
          <div className="p-3 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <Code size={14} className="text-emerald-600 dark:text-brand-lime" />
              <span className="font-bold text-zinc-800 dark:text-zinc-300">{activeApp.id}.js</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check size={12} className="text-emerald-600 dark:text-brand-lime" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="p-1.5 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-brand-lime hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 text-[11px] font-bold"
              >
                <Play size={12} />
                <span>{isRunning ? 'Running...' : 'Run Pattern'}</span>
              </button>
            </div>
          </div>

          {/* Syntax Highlighted Code */}
          <div className={`p-4 overflow-x-auto text-xs sm:text-sm ${
            isDark 
              ? 'bg-[#090d16] selection:bg-[#264f78] selection:text-white' 
              : 'bg-zinc-50/70 selection:bg-blue-100 selection:text-blue-900'
          }`}>
            <SyntaxHighlighter
              language="javascript"
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                border: 'none',
                fontSize: '12.5px',
                lineHeight: '1.65'
              }}
              codeTagProps={{
                style: {
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {activeApp.code}
            </SyntaxHighlighter>
          </div>

          {/* Inline Console Output */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 px-4 bg-zinc-100/70 dark:bg-zinc-950 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 pb-1.5">
              <Terminal size={12} className="text-emerald-600 dark:text-brand-lime" />
              <span className="font-bold">Output Console</span>
            </div>
            {consoleOutput.length === 0 ? (
              <div className="text-zinc-500 dark:text-zinc-600 text-[11px] py-1">
                Click &quot;Run Pattern&quot; to execute this code live.
              </div>
            ) : (
              <div className="space-y-1">
                {consoleOutput.map((log, i) => (
                  <div key={i} className={log.type === 'error' ? 'text-red-600 dark:text-red-400 font-bold' : 'text-emerald-700 dark:text-emerald-300 text-[11px] font-bold'}>
                    &gt; {log.text}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
