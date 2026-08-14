'use client';

import React, { useState } from 'react';
import { ArrowRight, MessageSquare, Play, RotateCcw, Send } from 'lucide-react';

export function InteractiveChannelWidget() {
  const [queue, setQueue] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('Channel is idle. Send a message to get started.');
  const [bufferSize, setBufferSize] = useState<number>(2);

  const sendMessage = () => {
    if (queue.length >= bufferSize) {
      setStatus(`⛔ BLOCKING: Channel is full (${queue.length}/${bufferSize})! Sender goroutine is paused until receiver reads.`);
      return;
    }
    const item = `Msg #${queue.length + 1}`;
    setQueue([...queue, item]);
    setStatus(`✅ SENT: '${item}' enqueued into channel buffer. Receiver can read now.`);
  };

  const receiveMessage = () => {
    if (queue.length === 0) {
      setStatus('⛔ BLOCKING: Channel is empty! Receiver goroutine is paused until sender writes.');
      return;
    }
    const [first, ...rest] = queue;
    setQueue(rest);
    setStatus(`📨 RECEIVED: '${first}' read from channel buffer.`);
  };

  const reset = () => {
    setQueue([]);
    setStatus('Channel is idle. Send a message to get started.');
  };

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-500/10 p-6 space-y-4 shadow-sm my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--foreground)]">
            Interactive Goroutine &amp; Channel Simulator
          </h3>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 font-mono font-bold">
          Concurrent CSP
        </span>
      </div>

      <p className="text-xs sm:text-sm text-[var(--muted)]">
        &ldquo;Do not communicate by sharing memory; share memory by communicating.&rdquo; Test how Go channels synchronize goroutines:
      </p>

      {/* Channel Buffer Queue */}
      <div className="p-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel)] space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--muted)] border-b border-[var(--panel-border)] pb-2">
          <span>Channel: <code>ch := make(chan string, {bufferSize})</code></span>
          <span className="font-bold text-purple-600 dark:text-purple-400">
            Buffer: {queue.length} / {bufferSize} items
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            Sender G1 (Worker)
          </div>
          <ArrowRight className="w-4 h-4 text-purple-500" />

          {/* Slots */}
          <div className="flex-1 flex gap-2 p-2 rounded-xl bg-slate-900/10 dark:bg-slate-900/50 border border-purple-500/30 min-h-[50px] items-center justify-center">
            {Array.from({ length: bufferSize }).map((_, idx) => {
              const item = queue[idx];
              return (
                <div
                  key={idx}
                  className={`flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                    item
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'border border-dashed border-slate-400/40 text-slate-400'
                  }`}
                >
                  {item || `Slot ${idx + 1}`}
                </div>
              );
            })}
          </div>

          <ArrowRight className="w-4 h-4 text-purple-500" />
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Receiver G2 (Main)
          </div>
        </div>
      </div>

      {/* Status Output */}
      <div className="p-3 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
        <span className="text-purple-400 font-bold">Runtime Log:</span> {status}
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--panel-border)]">
        <button
          onClick={sendMessage}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send: <code>ch &lt;- msg</code></span>
        </button>

        <button
          onClick={receiveMessage}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Receive: <code>msg := &lt;-ch</code></span>
        </button>

        <button
          onClick={reset}
          className="p-2 rounded-xl border border-[var(--panel-border)] hover:bg-[var(--panel)] text-[var(--muted)]"
          title="Reset Channel"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
