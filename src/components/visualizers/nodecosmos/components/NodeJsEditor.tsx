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
      env: { NODE_ENV: 'development', USER: 'subhajit', PATH: '/usr/local/bin:/usr/bin' },
      uptime: () => 48.3,
      cwd: () => '/home/subhajit/project',
      memoryUsage: () => ({
        rss: 35651584,
        heapTotal: 9699328,
        heapUsed: 5849088,
        external: 1474560,
        arrayBuffers: 131072,
      }),
      argv: ['/usr/local/bin/node', '/home/subhajit/project/app.js'],
      exit: (code = 0) => pushLog('warn', `process.exit(${code}) called`),
      nextTick: (callback: () => void) => {
        queueMicrotask(() => {
          try {
            callback();
          } catch (err: any) {
            pushLog('error', `nextTick Error: ${err?.message || err}`);
          }
        });
      },
    };

    const customBuffer = {
      from: (input: string | number[]) => {
        const str = typeof input === 'string' ? input : String.fromCharCode(...input);
        return {
          toString: (encoding = 'utf8') => {
            if (encoding === 'hex') {
              return Array.from(str)
                .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
                .join('');
            }
            if (encoding === 'base64') {
              try {
                return btoa(str);
              } catch {
                return str;
              }
            }
            return str;
          },
          length: str.length,
          byteLength: str.length,
        };
      },
      alloc: (size: number, fill = 0) => ({
        length: size,
        byteLength: size,
        toString: () => `<Buffer ${size} bytes (allocated outside V8 heap)>`,
      }),
      isBuffer: (obj: any) => Boolean(obj && typeof obj === 'object' && 'byteLength' in obj),
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

    const customV8 = {
      getHeapStatistics: () => ({
        total_heap_size: 9699328,
        total_heap_size_executable: 524288,
        total_physical_size: 9699328,
        total_available_size: 2197815296,
        used_heap_size: 5849088,
        heap_size_limit: 2197815296,
        malloced_memory: 16384,
        peak_malloced_memory: 1105920,
        does_zap_garbage: 0,
        number_of_native_contexts: 2,
        number_of_detached_contexts: 0,
      }),
      getHeapSpaceStatistics: () => [
        { space_name: 'new_space', space_size: 1048576, space_used_size: 524288, space_available_size: 524288 },
        { space_name: 'old_space', space_size: 6291456, space_used_size: 4718592, space_available_size: 1572864 },
        { space_name: 'code_space', space_size: 1048576, space_used_size: 524288, space_available_size: 524288 },
        { space_name: 'map_space', space_size: 1048576, space_used_size: 524288, space_available_size: 524288 },
        { space_name: 'large_object_space', space_size: 2097152, space_used_size: 1048576, space_available_size: 1048576 },
      ],
    };

    type Listener = (...args: any[]) => void;

    class CustomEventEmitter {
      private _events: Record<string, Listener[]> = Object.create(null);
      private _maxListeners = 10;

      on(event: string, listener: Listener) {
        if (!this._events[event]) {
          this._events[event] = [];
        }
        this._events[event].push(listener);
        if (this._events[event].length > this._maxListeners) {
          pushLog(
            'warn',
            `MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${this._events[event].length} ${event} listeners added to [EventEmitter]. Use emitter.setMaxListeners() to increase limit.`
          );
        }
        return this;
      }

      addListener(event: string, listener: Listener) {
        return this.on(event, listener);
      }

      once(event: string, listener: Listener) {
        const wrapper = (...args: any[]) => {
          this.off(event, wrapper);
          listener.apply(this, args);
        };
        (wrapper as any).listener = listener;
        return this.on(event, wrapper);
      }

      emit(event: string, ...args: any[]) {
        if (event === 'error' && (!this._events['error'] || this._events['error'].length === 0)) {
          const err =
            args[0] instanceof Error
              ? args[0]
              : new Error(`Unhandled 'error' event: ${args[0] || 'Unknown error'}`);
          throw err;
        }
        const listeners = this._events[event];
        if (!listeners || listeners.length === 0) return false;
        const copy = [...listeners];
        for (const fn of copy) {
          fn.apply(this, args);
        }
        return true;
      }

      off(event: string, listener: Listener) {
        if (!this._events[event]) return this;
        this._events[event] = this._events[event].filter(
          (fn) => fn !== listener && (fn as any).listener !== listener
        );
        return this;
      }

      removeListener(event: string, listener: Listener) {
        return this.off(event, listener);
      }

      removeAllListeners(event?: string) {
        if (event) {
          delete this._events[event];
        } else {
          this._events = Object.create(null);
        }
        return this;
      }

      listenerCount(event: string) {
        return this._events[event]?.length || 0;
      }

      rawListeners(event: string) {
        return [...(this._events[event] || [])];
      }

      setMaxListeners(n: number) {
        this._maxListeners = n;
        return this;
      }

      getMaxListeners() {
        return this._maxListeners;
      }
    }

    const customFsPromises = {
      readFile: async (_path: string, _encoding?: string) => {
        return `{\n  "name": "cscosmos",\n  "version": "1.0.0",\n  "description": "Computer Science Visualizer Platform"\n}`;
      },
      writeFile: async (_path: string, _data: unknown) => {
        return undefined;
      },
    };

    const customFs = {
      readFileSync: (_path: string, _encoding?: string) => {
        return `{\n  "name": "cscosmos",\n  "version": "1.0.0",\n  "description": "Computer Science Visualizer Platform"\n}`;
      },
      readFile: (_path: string, ...args: unknown[]) => {
        const cb = args.find((a): a is (err: Error | null, data?: string) => void => typeof a === 'function');
        if (cb) {
          window.setTimeout(() => {
            cb(null, `{\n  "name": "cscosmos",\n  "version": "1.0.0"\n}`);
          }, 20);
        }
      },
      writeFileSync: (_path: string, _data: unknown) => undefined,
      promises: customFsPromises,
    };

    const customRequire = (moduleName: string) => {
      const clean = moduleName.replace(/^node:/, '');
      if (clean === 'v8') return customV8;
      if (clean === 'buffer') return { Buffer: customBuffer, default: { Buffer: customBuffer } };
      if (clean === 'process') return customProcess;
      if (clean === 'events') {
        const fn: any = CustomEventEmitter;
        fn.EventEmitter = CustomEventEmitter;
        fn.default = CustomEventEmitter;
        return fn;
      }
      if (clean === 'fs/promises') return customFsPromises;
      if (clean === 'fs') return customFs;
      if (clean === 'path') {
        return {
          join: (...parts: string[]) => parts.join('/'),
          resolve: (...parts: string[]) => '/' + parts.join('/'),
          basename: (p: string) => p.split('/').pop() || '',
          dirname: (p: string) => p.split('/').slice(0, -1).join('/') || '/',
        };
      }
      if (clean === 'util') {
        return {
          promisify: (fn: any) => (...args: any[]) =>
            new Promise((resolve, reject) => {
              fn(...args, (err: any, res: any) => (err ? reject(err) : resolve(res)));
            }),
        };
      }
      return {};
    };

    const customSetImmediate = (handler: () => void) => {
      const timerId = window.setTimeout(() => {
        try {
          handler();
        } catch (err: any) {
          pushLog('error', `Immediate Error: ${err?.message || err}`);
        }
      }, 0);
      activeTimersRef.current.push(timerId);
      return timerId;
    };

    // Temporarily attach globals to window scope for seamless access without parameter collisions
    const win = window as any;
    const prevV8 = win.v8;
    const prevEventEmitter = win.EventEmitter;
    const prevSetImmediate = win.setImmediate;
    const prevClearImmediate = win.clearImmediate;

    win.v8 = customV8;
    win.EventEmitter = CustomEventEmitter;
    win.setImmediate = customSetImmediate;
    win.clearImmediate = window.clearTimeout;

    try {
      // Execute the user code in sandbox
      const executor = new Function(
        'console',
        'process',
        'Buffer',
        'require',
        'setTimeout',
        'clearTimeout',
        'setImmediate',
        'clearImmediate',
        'global',
        code
      );
      executor(
        customConsole,
        customProcess,
        customBuffer,
        customRequire,
        customSetTimeout,
        window.clearTimeout,
        customSetImmediate,
        window.clearTimeout,
        window
      );
    } catch (err: any) {
      pushLog('error', `${err?.name || 'Error'}: ${err?.message || err}`);
    } finally {
      win.v8 = prevV8;
      win.EventEmitter = prevEventEmitter;
      win.setImmediate = prevSetImmediate;
      win.clearImmediate = prevClearImmediate;
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
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
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
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono uppercase tracking-wider">
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
              className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition shadow-2xs"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Code Editor Body */}
      <div className="p-4 sm:p-5 space-y-2 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400 font-medium">
          <span>JavaScript File: hello.js</span>
          <span>Editable Code</span>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={7}
          spellCheck={false}
          className="w-full p-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 dark:bg-slate-950 dark:text-emerald-300 dark:border-slate-800 font-mono text-sm focus:border-emerald-500 dark:focus:border-emerald-500 outline-none shadow-inner leading-relaxed resize-y transition-colors"
        />
      </div>

      {/* Output Terminal Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
        <div className="px-5 py-2.5 bg-slate-200/70 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-slate-700 dark:text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Terminal Output (stdout / stderr)</span>
          </div>

          {logs.length > 0 && (
            <button
              onClick={clearOutput}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>

        <div className="p-4 min-h-[90px] max-h-[240px] overflow-y-auto space-y-1.5 font-mono text-xs sm:text-sm">
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