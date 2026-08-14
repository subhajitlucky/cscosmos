'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Sparkles, Terminal } from 'lucide-react';

interface CliHistory {
  command: string;
  output: string;
  type: 'success' | 'error' | 'info';
}

export function RedisCliPlayground() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CliHistory[]>([
    { command: 'PING', output: 'PONG', type: 'success' },
    { command: 'SET user:100 "Alice"', output: 'OK', type: 'success' },
    { command: 'GET user:100', output: '"Alice"', type: 'success' },
  ]);
  const [store, setStore] = useState<Record<string, any>>({
    'user:100': 'Alice',
    'counter': '42'
  });

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const verb = parts[0].toUpperCase();
    const args = parts.slice(1);

    let output = '';
    let type: 'success' | 'error' | 'info' = 'success';

    if (verb === 'PING') {
      output = 'PONG';
    } else if (verb === 'SET') {
      if (args.length < 2) {
        output = '(error) ERR wrong number of arguments for "set" command';
        type = 'error';
      } else {
        const key = args[0];
        const val = args.slice(1).join(' ').replace(/^["']|["']$/g, '');
        setStore((prev) => ({ ...prev, [key]: val }));
        output = 'OK';
      }
    } else if (verb === 'GET') {
      if (args.length < 1) {
        output = '(error) ERR wrong number of arguments for "get" command';
        type = 'error';
      } else {
        const key = args[0];
        output = store[key] !== undefined ? `"${store[key]}"` : '(nil)';
      }
    } else if (verb === 'INCR') {
      const key = args[0];
      const current = parseInt(store[key] || '0', 10);
      if (isNaN(current)) {
        output = '(error) ERR value is not an integer or out of range';
        type = 'error';
      } else {
        const next = current + 1;
        setStore((prev) => ({ ...prev, [key]: String(next) }));
        output = `(integer) ${next}`;
      }
    } else if (verb === 'KEYS') {
      output = Object.keys(store).map((k, i) => `${i + 1}) "${k}"`).join('\n') || '(empty list or set)';
    } else if (verb === 'DBSIZE') {
      output = `(integer) ${Object.keys(store).length}`;
    } else if (verb === 'FLUSHALL') {
      setStore({});
      output = 'OK';
    } else {
      output = `(error) ERR unknown command '${verb}'`;
      type = 'error';
    }

    setHistory((prev) => [...prev, { command: trimmed, output, type }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 text-slate-100 p-6 sm:p-8 space-y-6 shadow-2xl my-8 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-red-400">
              Interactive Web CLI
            </div>
            <h3 className="text-lg font-bold text-white font-sans">
              redis-cli --version 7.2.4 (localhost:6379)
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Keys in Memory: {Object.keys(store).length}</span>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="min-h-[220px] max-h-[340px] overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-red-500 font-bold">127.0.0.1:6379&gt;</span>
              <span className="text-white font-bold">{item.command}</span>
            </div>
            <div className={`pl-4 whitespace-pre-wrap ${
              item.type === 'error' ? 'text-rose-400 font-bold' : 'text-emerald-400'
            }`}>
              {item.output}
            </div>
          </div>
        ))}
      </div>

      {/* Command Input Box */}
      <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-2xl border border-slate-800">
        <span className="text-red-500 font-bold pl-2">127.0.0.1:6379&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Try: SET user:99 'Bob' | GET user:99 | INCR counter | KEYS *"
          className="flex-1 bg-transparent border-none text-white outline-none text-xs"
        />
        <button
          onClick={() => executeCommand(input)}
          className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
        >
          Send
        </button>
      </div>

      {/* Quick Command Chips */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
        <span className="text-slate-500 text-[11px] self-center">Quick commands:</span>
        <button
          onClick={() => executeCommand('INCR counter')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800"
        >
          INCR counter
        </button>
        <button
          onClick={() => executeCommand('KEYS *')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800"
        >
          KEYS *
        </button>
        <button
          onClick={() => executeCommand('DBSIZE')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800"
        >
          DBSIZE
        </button>
        <button
          onClick={() => executeCommand('FLUSHALL')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] border border-slate-800"
        >
          FLUSHALL
        </button>
      </div>
    </div>
  );
}
