'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Terminal,
  Trash2,
  Check,
  Sparkles,
  Copy,
  Maximize2,
  Minimize2,
  Cpu,
  Layers,
  Activity,
  HardDrive,
  Info,
  CheckCircle2,
  Command,
} from 'lucide-react';

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
  const [copied, setCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'inspector'>('terminal');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0);
  const [execStats, setExecStats] = useState<{
    duration: number;
    memory: string;
    status: 'idle' | 'success' | 'error';
    exitCode: number;
  }>({
    duration: 0,
    memory: '5.8 MB',
    status: 'idle',
    exitCode: 0,
  });

  const logIdRef = useRef<number>(2);
  const activeTimersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      // Clear any pending timers on unmount
      activeTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

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
      versions: {
        node: '22.11.0',
        v8: '12.4.254.20-node.15',
        uv: '1.48.0',
        zlib: '1.3.0.1-motley-7d77fb7',
        brotli: '1.1.0',
        ares: '1.33.1',
        modules: '127',
        nghttp2: '1.63.0',
        napi: '9',
        llhttp: '9.2.1',
        openssl: '3.0.15+quic',
        cldr: '45.0',
        icu: '75.1',
        tz: '2024a',
        unicode: '15.1',
      },
      platform: 'linux',
      arch: 'x64',
      title: 'node',
      execPath: '/usr/local/bin/node',
      pid: 1042,
      env: {
        NODE_ENV: 'development',
        USER: 'subhajit',
        PATH: '/home/subhajit/.nvm/versions/node/v22.11.0/bin:/usr/local/bin:/usr/bin:/bin',
      },
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
          } catch (err: unknown) {
            pushLog('error', `nextTick Error: ${err instanceof Error ? err.message : String(err)}`);
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

    const startTime = performance.now();
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
      const elapsed = Math.max(1, Math.round(performance.now() - startTime));
      setExecStats({
        duration: elapsed,
        memory: '5.8 MB',
        status: 'success',
        exitCode: 0,
      });
    } catch (err: any) {
      const elapsed = Math.max(1, Math.round(performance.now() - startTime));
      setExecStats({
        duration: elapsed,
        memory: '6.2 MB',
        status: 'error',
        exitCode: 1,
      });
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

  const lineCount = code.split('\n').length;

  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRun();
    }
  };

  const editorContent = (
    <div className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all ${isFullscreen ? 'h-full max-h-[90vh] flex flex-col' : ''}`}>
      {/* Mac-Style Top Window Chrome */}
      <div className="px-4 sm:px-5 py-3.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          {/* Frosted Window Controls */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 border border-rose-600/40 inline-block shadow-2xs" />
            <span className="w-3 h-3 rounded-full bg-amber-500/90 border border-amber-600/40 inline-block shadow-2xs" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 border border-emerald-600/40 inline-block shadow-2xs" />
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-800" />

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {title}
            </span>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-mono text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Node.js v22 LTS
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRun}
            disabled={isRunning}
            title="Execute Code (⌘+Enter)"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Code"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset to Initial Code"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen'}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Preset Pills */}
      {presets && presets.length > 0 && (
        <div className="px-4 sm:px-5 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto select-none">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-500" /> Presets:
          </span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedPreset(idx);
                setCode(preset.code);
                clearOutput();
                setLogs([
                  {
                    id: logIdRef.current++,
                    type: 'info',
                    message: `Loaded: ${preset.label}. Click "Run Code" or press ⌘+Enter to execute.`,
                  },
                ]);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition shrink-0 cursor-pointer ${
                selectedPreset === idx
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* Code Editor Body with Line Numbers */}
      <div className={`relative bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm flex ${isFullscreen ? 'flex-1 overflow-hidden' : ''}`}>
        {/* Line Numbers Gutter */}
        <div className="select-none py-4 px-3 bg-slate-950 text-slate-600 border-r border-slate-800/80 text-right font-mono text-xs leading-6 shrink-0">
          {Array.from({ length: Math.max(lineCount, 6) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative flex-1">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleTextareaKeyDown}
            rows={isFullscreen ? 16 : Math.max(7, Math.min(14, lineCount + 1))}
            spellCheck={false}
            className="w-full h-full p-4 bg-transparent text-emerald-300 font-mono text-xs sm:text-sm outline-none resize-none leading-6 placeholder:text-slate-600 selection:bg-emerald-500/30"
            placeholder="// Type or paste your Node.js code here..."
          />
        </div>
      </div>

      {/* Editor Status Bar */}
      <div className="px-4 py-1.5 bg-slate-900 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span>file: <strong className="text-slate-200">main.mjs</strong></span>
          <span>lines: <strong className="text-slate-200">{lineCount}</strong></span>
          <span>chars: <strong className="text-slate-200">{code.length}</strong></span>
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span className="hidden sm:inline">Shortcut: <strong className="text-emerald-400">⌘+Enter</strong></span>
          <span className="text-slate-400 font-semibold">Node.js Engine Active</span>
        </div>
      </div>

      {/* Output Console / Inspector Tabs */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 flex-1 flex flex-col">
        {/* Tab Header Bar */}
        <div className="px-4 sm:px-5 py-2 bg-slate-200/70 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-500" />
              <span>Terminal (stdout / stderr)</span>
            </button>

            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'inspector'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Process &amp; V8 Inspector</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {execStats && (
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${execStats.status === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                <span>Exit: {execStats.exitCode}</span>
                <span>•</span>
                <span>{execStats.duration}ms</span>
              </span>
            )}

            {logs.length > 0 && activeTab === 'terminal' && (
              <button
                onClick={clearOutput}
                className="text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                title="Clear Output"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Terminal Logs */}
        {activeTab === 'terminal' && (
          <div className="p-4 min-h-[100px] max-h-[260px] overflow-y-auto space-y-1.5 font-mono text-xs sm:text-sm bg-slate-950 text-slate-200 selection:bg-emerald-500/30">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic py-2">
                Terminal idle. Click &quot;Run Code&quot; (or ⌘+Enter) to execute.
              </div>
            ) : (
              logs.map((log) => {
                if (log.type === 'error') {
                  return (
                    <div
                      key={log.id}
                      className="text-rose-400 flex items-start gap-2 bg-rose-950/20 p-1.5 rounded-lg border border-rose-900/40"
                    >
                      <span className="text-rose-500 font-bold shrink-0">&gt;</span>
                      <pre className="whitespace-pre-wrap leading-relaxed">{log.message}</pre>
                    </div>
                  );
                }
                if (log.type === 'warn') {
                  return (
                    <div
                      key={log.id}
                      className="text-amber-300 flex items-start gap-2 bg-amber-950/20 p-1.5 rounded-lg border border-amber-900/40"
                    >
                      <span className="text-amber-500 font-bold shrink-0">&gt;</span>
                      <pre className="whitespace-pre-wrap leading-relaxed">{log.message}</pre>
                    </div>
                  );
                }
                if (log.type === 'info') {
                  return (
                    <div
                      key={log.id}
                      className="text-slate-400 italic flex items-start gap-2 py-0.5"
                    >
                      <span className="text-emerald-500 shrink-0">&gt;</span>
                      <pre className="whitespace-pre-wrap leading-relaxed">{log.message}</pre>
                    </div>
                  );
                }
                return (
                  <div
                    key={log.id}
                    className="text-emerald-300 flex items-start gap-2 py-0.5"
                  >
                    <span className="text-emerald-500 font-bold shrink-0">&gt;</span>
                    <pre className="whitespace-pre-wrap leading-relaxed">{log.message}</pre>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 2: Runtime & V8 Engine Inspector */}
        {activeTab === 'inspector' && (
          <div className="p-4 bg-slate-950 text-slate-200 text-xs font-mono space-y-4 max-h-[260px] overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">V8 Engine</span>
                <div className="text-emerald-400 font-bold text-xs sm:text-sm">v12.4.254</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">libuv Event Loop</span>
                <div className="text-blue-400 font-bold text-xs sm:text-sm">v1.48.0</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">OpenSSL Cryptography</span>
                <div className="text-purple-400 font-bold text-xs sm:text-sm">v3.0.15</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Node-API (N-API)</span>
                <div className="text-amber-400 font-bold text-xs sm:text-sm">v9 • ABI 127</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>V8 Heap Allocated</span>
                  <span className="text-emerald-400 font-bold">5.8 MB / 9.7 MB</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Process Architecture</span>
                  <span className="text-blue-400 font-bold">Linux x64 (PID 1042)</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  ExecPath: /usr/local/bin/node
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 p-4 sm:p-8 bg-slate-950/85 backdrop-blur-md flex flex-col justify-center items-center animate-in fade-in duration-200">
        <div className="w-full max-w-5xl h-full max-h-[92vh]">
          {editorContent}
        </div>
      </div>
    );
  }

  return editorContent;
}