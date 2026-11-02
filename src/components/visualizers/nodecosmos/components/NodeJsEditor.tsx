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
    setActiveTab('terminal');
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
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col ${
        isFullscreen ? 'h-full max-h-[92vh]' : ''
      }`}
    >
      {/* Top Bar: Title, System Pill & Controls */}
      <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 opacity-60">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-700" />
          </div>

          <div className="h-3.5 w-px bg-slate-200 dark:bg-slate-800" />

          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono">
              {title}
            </span>
          </div>

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800/80 text-emerald-700 dark:text-emerald-400 border border-slate-300 dark:border-slate-700/60 hidden sm:inline-block">
            Node.js v22 LTS
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleRun}
            disabled={isRunning}
            title="Execute Code (⌘+Enter / Ctrl+Enter)"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copy Code"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition text-xs font-medium flex items-center gap-1 cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset Code"
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition text-xs font-medium flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen'}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer shadow-xs"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Preset Selector Bar */}
      {presets && presets.length > 0 && (
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto select-none">
          <span className="text-[11px] font-semibold text-slate-500 font-mono uppercase tracking-wider shrink-0">
            Examples:
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
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition shrink-0 cursor-pointer ${
                selectedPreset === idx
                  ? 'bg-slate-200 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-semibold border border-slate-300 dark:border-slate-700 shadow-xs'
                  : 'bg-white dark:bg-transparent border border-slate-200 dark:border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {/* 2-Column Grid: Code Editor (Left) & Output Terminal (Right) */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 ${isFullscreen ? 'flex-1' : ''}`}>
        {/* Left Column: Code Editor */}
        <div className="flex flex-col h-[340px] lg:h-[380px]">
          {/* Subheader */}
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono select-none">
            <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              main.mjs
            </span>
            <span className="text-slate-500 text-[11px]">JavaScript Editor</span>
          </div>

          {/* Textarea + Line Numbers */}
          <div className="flex-1 flex overflow-hidden bg-white dark:bg-slate-950 font-mono text-xs sm:text-sm">
            <div className="select-none py-3 px-2.5 bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 border-r border-slate-200 dark:border-slate-900 text-right font-mono text-xs leading-6 shrink-0 w-10">
              {Array.from({ length: Math.max(lineCount, 6) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              spellCheck={false}
              className="flex-1 p-3 bg-white dark:bg-slate-950 text-slate-900 dark:text-emerald-300 font-mono text-xs sm:text-sm outline-none resize-none leading-6 placeholder:text-slate-400 dark:placeholder:text-slate-600 selection:bg-emerald-500/20 overflow-y-auto"
              placeholder="// Type Node.js code here..."
            />
          </div>

          {/* Left Footer */}
          <div className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 select-none">
            <span>⌘+Enter to Run</span>
            <span>{lineCount} lines</span>
          </div>
        </div>

        {/* Right Column: Terminal Output */}
        <div className="flex flex-col h-[340px] lg:h-[380px]">
          {/* Subheader */}
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono select-none">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  activeTab === 'terminal'
                    ? 'text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-transparent font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Output (stdout)
              </button>
              <button
                onClick={() => setActiveTab('inspector')}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  activeTab === 'inspector'
                    ? 'text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-transparent font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Runtime Inspector
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              {execStats && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Exit: {execStats.exitCode} • {execStats.duration}ms
                </span>
              )}
              {logs.length > 0 && activeTab === 'terminal' && (
                <button
                  onClick={clearOutput}
                  className="text-[11px] text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition flex items-center gap-1 cursor-pointer"
                  title="Clear Console"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Terminal Logs Body */}
          {activeTab === 'terminal' && (
            <div className="flex-1 p-3 overflow-y-auto space-y-1 font-mono text-xs sm:text-sm bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-emerald-500/20">
              {logs.length === 0 ? (
                <div className="text-slate-400 dark:text-slate-500 italic py-2">
                  Ready to execute. Click &quot;Run Code&quot; to evaluate your JavaScript.
                </div>
              ) : (
                logs.map((log) => {
                  if (log.type === 'error') {
                    return (
                      <div
                        key={log.id}
                        className="text-rose-700 dark:text-rose-400 flex items-start gap-2 bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded border border-rose-200 dark:border-rose-900/40"
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
                        className="text-amber-800 dark:text-amber-300 flex items-start gap-2 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded border border-amber-200 dark:border-amber-900/40"
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
                        className="text-slate-500 dark:text-slate-400 italic flex items-start gap-2 py-0.5"
                      >
                        <span className="text-emerald-500 shrink-0">&gt;</span>
                        <pre className="whitespace-pre-wrap leading-relaxed">{log.message}</pre>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={log.id}
                      className="text-slate-800 dark:text-emerald-300 flex items-start gap-2 py-0.5"
                    >
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">&gt;</span>
                      <pre className="whitespace-pre-wrap leading-relaxed">{log.message}</pre>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Inspector Body */}
          {activeTab === 'inspector' && (
            <div className="flex-1 p-3.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-mono space-y-3 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">V8 Engine</span>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">v12.4.254</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">libuv Event Loop</span>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold">v1.48.0</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Crypto (OpenSSL)</span>
                  <div className="text-purple-600 dark:text-purple-400 font-semibold">v3.0.15</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase">Node-API ABI</span>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold">ABI 127</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[11px]">
                  <span>V8 Heap Usage</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">5.8 MB / 9.7 MB</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          )}

          {/* Right Footer */}
          <div className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500 select-none">
            <span>Process PID: 1042</span>
            <span>{logs.length} output line(s)</span>
          </div>
        </div>
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