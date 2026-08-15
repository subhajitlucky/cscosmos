'use client';

import React, { useState } from 'react';
import { 
  GitBranch, 
  Send, 
  Lock, 
  Unlock, 
  Play, 
  RotateCcw, 
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';

export function ConcurrencyVisualizer() {
  const [messages, setMessages] = useState<string[]>(['Job #1 Payload', 'Job #2 Payload']);
  const [isMutexLocked, setIsMutexLocked] = useState(false);
  const [activeWorker, setActiveWorker] = useState<number | null>(null);

  const handleSendMessage = () => {
    const nextId = messages.length + 1;
    setMessages([...messages, `Job #${nextId} Payload`]);
  };

  const handleConsumeMessage = () => {
    if (messages.length > 0) {
      setMessages(messages.slice(1));
    }
  };

  const handleToggleMutex = (workerId: number) => {
    if (isMutexLocked) {
      if (activeWorker === workerId) {
        setIsMutexLocked(false);
        setActiveWorker(null);
      }
    } else {
      setIsMutexLocked(true);
      setActiveWorker(workerId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[var(--rust-border)] pb-4">
        <h3 className="text-lg font-bold text-[var(--rust-text)] flex items-center">
          <GitBranch className="mr-2 h-5 w-5 text-[var(--rust-purple)]" />
          Multi-Threaded Channels (mpsc) &amp; Mutex Simulator
        </h3>
        <p className="text-xs text-[var(--rust-muted)]">
          Visualize thread message passing without shared memory, and RAII MutexGuard locking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-4 shadow-sm space-y-4 font-mono text-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)]">
              Channel &amp; Mutex Operations
            </div>

            {/* Channel Send & Recv */}
            <div className="space-y-2">
              <div className="text-[11px] text-[var(--rust-muted)] font-bold">mpsc Channel:</div>
              <div className="flex gap-2">
                <button
                  onClick={handleSendMessage}
                  className="flex-1 py-2 px-3 rounded-lg bg-[var(--rust-primary)] text-white font-bold flex items-center justify-center space-x-1 hover:bg-[var(--rust-primary-hover)] transition-colors"
                >
                  <Send className="h-3 w-3 mr-1" />
                  <span>tx.send(msg)</span>
                </button>
                <button
                  onClick={handleConsumeMessage}
                  disabled={messages.length === 0}
                  className="flex-1 py-2 px-3 rounded-lg bg-[var(--rust-surface-2)] text-[var(--rust-text)] border border-[var(--rust-border)] font-bold disabled:opacity-30 hover:border-[var(--rust-primary)] transition-colors"
                >
                  rx.recv()
                </button>
              </div>
            </div>

            {/* Mutex lock controls */}
            <div className="space-y-2 pt-2 border-t border-[var(--rust-border)]">
              <div className="text-[11px] text-[var(--rust-muted)] font-bold">Mutex&lt;State&gt; Lock Contention:</div>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2].map((id) => (
                  <button
                    key={id}
                    onClick={() => handleToggleMutex(id)}
                    disabled={isMutexLocked && activeWorker !== id}
                    className={`p-2.5 rounded-lg border font-bold text-center transition-all ${
                      activeWorker === id
                        ? 'bg-rose-950/30 border-rose-500 text-rose-300'
                        : isMutexLocked
                        ? 'opacity-30 border-[var(--rust-border)] bg-[var(--rust-surface-2)] cursor-not-allowed'
                        : 'bg-[var(--rust-surface-2)] border-[var(--rust-border)] text-[var(--rust-text)] hover:border-[var(--rust-primary)]'
                    }`}
                  >
                    {activeWorker === id ? `Worker ${id} (Holds Lock)` : `Worker ${id} Lock`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[var(--rust-primary-light)] border border-[var(--rust-primary-border)] text-[11px] leading-relaxed text-[var(--rust-text)]">
              <div className="font-bold text-[var(--rust-primary)] mb-1">Ownership Transfer in Channels:</div>
              When <code>tx.send(val)</code> is invoked, full ownership of <code>val</code> moves across thread boundaries. The sending thread can no longer read or modify it.
            </div>
          </div>
        </div>

        {/* Right: Visual Threads and Queue (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-[var(--rust-border)] bg-[var(--rust-surface)] p-5 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between border-b border-[var(--rust-border)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--rust-text)] font-mono">
                Thread Pipeline &amp; Channel Ring Buffer
              </span>
              <span className="text-[11px] font-mono text-[var(--rust-muted)]">std::sync::mpsc</span>
            </div>

            {/* Channel FIFO queue container */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-[var(--rust-muted)] flex justify-between">
                <span>FIFO Buffer ({messages.length} pending)</span>
                <span>Producers &rarr; Queue &rarr; Consumer</span>
              </div>

              <div className="min-h-14 p-2 rounded-lg bg-[var(--rust-bg)] border border-[var(--rust-border)] flex items-center gap-2 overflow-x-auto">
                {messages.length === 0 ? (
                  <span className="text-xs font-mono text-[var(--rust-muted)] px-3">Queue is empty (rx waiting...)</span>
                ) : (
                  messages.map((m, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 rounded bg-[var(--rust-primary-light)] border border-[var(--rust-primary-border)] text-[var(--rust-primary)] font-mono text-xs font-bold whitespace-nowrap shadow-sm"
                    >
                      {m}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Mutex Guard State Indicator */}
            <div className="p-4 rounded-lg bg-[var(--rust-surface-2)] border border-[var(--rust-border)] space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--rust-text)]">Mutex Guard Status</span>
                {isMutexLocked ? (
                  <span className="flex items-center px-2 py-0.5 rounded bg-rose-950/40 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                    <Lock className="h-3 w-3 mr-1" /> LOCKED by Worker #{activeWorker}
                  </span>
                ) : (
                  <span className="flex items-center px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    <Unlock className="h-3 w-3 mr-1" /> UNLOCKED (Ready)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[var(--rust-muted)]">
                {isMutexLocked
                  ? `Worker #${activeWorker} acquired exclusive MutexGuard. Any other thread attempting to lock will block until the guard is dropped.`
                  : 'No thread currently holds the lock. Ready for instant acquisition.'}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
