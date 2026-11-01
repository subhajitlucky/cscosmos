'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Terminal, Trash2, Check, Sparkles } from 'lucide-react';

interface OutputLog {
  id: number;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
}

interface NodeJsEditorProps {
  initialCode?: string;
  title?: string;
  presets?: { label: string; code: string }[];
}

export function NodeJsEditor({
  initialCode = `console.log("Hello, Node.js!");\n\nconst name = "Subhajit";\n\nconsole.log(\`Welcome, \${name}\`);`,
  title = 'Interactive Node.js Code Runner',
  presets = [
    {
      label: '1. Hello Node.js',
      code: `console.log("Hello, Node.js!");\n\nconst name = "Subhajit";\n\nconsole.log(\`Welcome, \${name}\`);`,
    },
    {
      label: '2. Process & Runtime Info',
      code: `console.log("Node.js Version:", process.version);\nconsole.log("OS Platform:", process.platform);\nconsole.log("CPU Architecture:", process.arch);\nconsole.log("Uptime:", process.uptime(), "seconds");`,
    },
    {
      label: '3. Async Execution Timing',
      code: `console.log("1. Synchronous start");\n\nsetTimeout(() => {\n  console.log("3. Asynchronous callback executed after delay");\n}, 300);\n\nconsole.log("2. Synchronous end");`,
    },
  ],
}: NodeJsEditorProps) {
  const [code, setCode] = useState<string>(initialCode);
  const [logs, setLogs] = useState<OutputLog[]>([
    { id: 1, type: 'info', message: 'Ready to execute. Click "Run Code" to evaluate your JavaScript.' },
  ]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const logIdRef = useRef<number>(2);
  const activeTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      // Clear any pending timers on unmount
      activeTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const clearOutput = () => {
    activeTimersRef.current.forEach((t) => clearTimeout(t));
    activeTimersRef.current = [];
    setLogs([]);
  };

  const handleRun = () => {
    clearOutput();
    setIsRunning(true);

    const capturedLogs: OutputLog[] = [];

    const pushLog = (type: 'log' | 'error' | 'warn' | 'info', ...args: any[]) => {
      const formatted = args
        .map((arg) => {
          if (arg === null) return 'null';
          if (arg === undefined) return 'undefined';
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(' ');

      const newLog: OutputLog = {
        id: logIdRef.current++,
        type,
        message: formatted,
      };

      capturedLogs.push(newLog);
      setLogs((prev) => [...prev, newLog]);
    };

    // Sandboxed mock Node.js environment
    const customConsole = {
      log: (...args: any[]) => pushLog('log', ...args),
      error: (...args: any[]) => pushLog('error', ...args),
      warn: (...args: any[]) => pushLog('warn', ...args),
      info: (...args: any[]) => pushLog('info', ...args),
    };

    const customProcess = {
      version: 'v22.11.0',
      versions: { node: '22.11.0', v8: '12.4.254.20-node.15', uv: '1.48.0' },
      platform: 'linux',
      arch: 'x64',
      title: 'node',
      pid: 1042,
      env: { NODE_ENV: 'development', USER: 'subhajit' },
      uptime: () => 48.3,
      argv: ['/usr/local/bin/node', '/home/subhajit/project/hello.js'],
      exit: (code = 0) => pushLog('warn', `process.exit(${code}) called`),
    };

    const customSetTimeout = (handler: () => void, ms = 0) => {
      const timerId = window.setTimeout(() => {
        try {
          handler();
        } catch (err: any) {
          pushLog('error', `Async Error: ${err?.message || err}`);
        }
      }, ms);
      activeTimersRef.current.push(timerId);
      return timerId;
    };

    try {
      // Execute the user code in sandbox
      const executor = new Function(
        'console',
        'process',
        'setTimeout',
        'clearTimeout',
        code
      );
      executor(customConsole, customProcess, customSetTimeout, window.clearTimeout);
    } catch (err: any) {
      pushLog('error', `${err?.name || 'Error'}: ${err?.message || err}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    clearOutput();
    setLogs([
      { id: logIdRef.current++, type: 'info', message: 'Code reset to initial lesson state.' },
    ]);
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden transition-colors">
      {/* Top Header Bar */}
      <div className="px-5 py-4 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {title}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              In-Browser Node.js Runtime Simulation &bull; v22 LTS
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Code</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset code"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      {presets && presets.length > 0 && (
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
            Quick Examples:
          </span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCode(preset.code);
                clearOutput();
                setLogs([
                  {
                    id: logIdRef.current++,
                    type: 'info',
                    message: `Loaded: ${preset.label}. Click "Run Code" to execute.`,
                  },
                ]);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition shadow-2xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Code Editor Body */}
      <div className="p-4 sm:p-5 space-y-2 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <span>JavaScript File: hello.js</span>
          <span>Editable Code</span>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={7}
          spellCheck={false}
          className="w-full p-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 dark:bg-slate-950 dark:text-emerald-300 dark:border-slate-800 font-mono text-xs focus:border-emerald-500 dark:focus:border-emerald-500 outline-none shadow-inner leading-relaxed resize-y transition-colors"
        />
      </div>

      {/* Output Terminal Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
        <div className="px-5 py-2.5 bg-slate-200/70 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Terminal Output (stdout / stderr)</span>
          </div>

          {logs.length > 0 && (
            <button
              onClick={clearOutput}
              className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="p-4 min-h-[90px] max-h-[220px] overflow-y-auto space-y-1.5 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-slate-400 dark:text-slate-600 italic">
              Terminal idle. Click &quot;Run Code&quot; to execute the program.
            </div>
          ) : (
            logs.map((log) => {
              if (log.type === 'error') {
                return (
                  <div
                    key={log.id}
                    className="text-rose-600 dark:text-rose-400 flex items-start gap-2"
                  >
                    <span className="text-rose-500 font-bold">&gt;</span>
                    <pre className="whitespace-pre-wrap">{log.message}</pre>
                  </div>
                );
              }
              if (log.type === 'warn') {
                return (
                  <div
                    key={log.id}
                    className="text-amber-600 dark:text-amber-400 flex items-start gap-2"
                  >
                    <span className="text-amber-500 font-bold">&gt;</span>
                    <pre className="whitespace-pre-wrap">{log.message}</pre>
                  </div>
                );
              }
              if (log.type === 'info') {
                return (
                  <div
                    key={log.id}
                    className="text-slate-500 dark:text-slate-400 italic flex items-start gap-2"
                  >
                    <span className="text-emerald-500">&gt;</span>
                    <pre className="whitespace-pre-wrap">{log.message}</pre>
                  </div>
                );
              }
              return (
                <div
                  key={log.id}
                  className="text-slate-900 dark:text-emerald-300 flex items-start gap-2"
                >
                  <span className="text-emerald-600 dark:text-emerald-500 font-bold">&gt;</span>
                  <pre className="whitespace-pre-wrap">{log.message}</pre>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
