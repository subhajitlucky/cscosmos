'use client';

import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, Zap, RotateCcw, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

interface RetryStep {
  attempt: number;
  delayMs: number;
  timeSec: number;
  status: 'PENDING' | 'RETRYING' | 'FAILED' | 'DLQ_STORED' | 'SUCCESS';
}

export function RetrySimulator() {
  const [strategy, setStrategy] = useState<'exponential' | 'jitter' | 'linear'>('jitter');
  const [maxRetries, setMaxRetries] = useState(4);
  const [baseDelay, setBaseDelay] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [steps, setSteps] = useState<RetryStep[]>([]);
  const [dlqItems, setDlqItems] = useState<{ id: string; payload: string; reason: string; timestamp: string }[]>([]);

  const calculateDelay = (attempt: number) => {
    if (strategy === 'linear') {
      return baseDelay * 1000;
    }
    if (strategy === 'exponential') {
      return Math.pow(2, attempt) * baseDelay * 1000;
    }
    // Full Jitter: random between 0 and (2^attempt * baseDelay)
    const maxBackoff = Math.pow(2, attempt) * baseDelay * 1000;
    return Math.floor(Math.random() * maxBackoff) + 200;
  };

  const runSimulation = (shouldFailCompletely: boolean) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSteps([]);

    let cumulativeTime = 0;
    const generatedSteps: RetryStep[] = [];

    for (let i = 0; i < maxRetries; i++) {
      const delay = calculateDelay(i);
      cumulativeTime += delay / 1000;
      const isLast = i === maxRetries - 1;
      
      let finalStatus: RetryStep['status'] = 'RETRYING';
      if (isLast) {
        finalStatus = shouldFailCompletely ? 'DLQ_STORED' : 'SUCCESS';
      }

      generatedSteps.push({
        attempt: i + 1,
        delayMs: delay,
        timeSec: Number(cumulativeTime.toFixed(2)),
        status: finalStatus
      });
    }

    setSteps(generatedSteps);
    setIsSimulating(false);

    if (shouldFailCompletely) {
      setDlqItems(prev => [
        {
          id: `dlq_${Date.now().toString().slice(-4)}`,
          payload: '{"orderId":"ord_8921","card":"4111_EXPIRED"}',
          reason: 'Max retries exhausted (HTTP 500 Payment Gateway Timeout)',
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev.slice(0, 4)
      ]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--mq-rose)]/30 bg-[var(--mq-rose)]/10 text-[var(--mq-rose)] text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" /> Resilience &amp; Fault Tolerance Lab
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--mq-text)]">
          Exponential Backoff <span className="text-[var(--mq-rose)] mq-glow">&amp; DLQ Lab</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--mq-muted)] max-w-2xl leading-relaxed">
          Simulate downstream microservice outages. Compare linear vs exponential backoff with full jitter to prevent thundering-herd cascade failures.
        </p>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Strategy Setup */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--mq-border)] bg-[var(--mq-surface)] p-6 space-y-6 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[var(--mq-border-subtle)] pb-4">
            <span className="text-[var(--mq-primary)] uppercase tracking-wider font-bold">
              Retry Policy Configuration
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[var(--mq-muted)]">Backoff Algorithm</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ['jitter', 'Full Jitter'],
                  ['exponential', 'Exponential'],
                  ['linear', 'Linear Delay']
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setStrategy(id as any)}
                    className={`py-2 rounded text-[10px] transition-all ${
                      strategy === id
                        ? 'bg-[var(--mq-primary)] text-black font-bold'
                        : 'border border-[var(--mq-border-subtle)] bg-[var(--mq-bg)] text-[var(--mq-muted)] hover:text-[var(--mq-text)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--mq-muted)]">Max Retry Attempts</span>
                <span className="text-[var(--mq-primary)] font-bold">{maxRetries}</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={maxRetries}
                onChange={(e) => setMaxRetries(Number(e.target.value))}
                className="w-full accent-[var(--mq-primary)] cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[var(--mq-muted)]">Base Delay Unit</span>
                <span className="text-[var(--mq-primary)] font-bold">{baseDelay}s</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={baseDelay}
                onChange={(e) => setBaseDelay(Number(e.target.value))}
                className="w-full accent-[var(--mq-primary)] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => runSimulation(false)}
                className="py-3 rounded-lg bg-[var(--mq-emerald)] text-black font-semibold text-xs hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Recover After Retries
              </button>
              <button
                onClick={() => runSimulation(true)}
                className="py-3 rounded-lg bg-[var(--mq-rose)] text-white font-semibold text-xs hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Poison Pill $\to$ DLQ
              </button>
            </div>
          </div>
        </div>

        {/* Right Retry Timeline & DLQ Store */}
        <div className="lg:col-span-7 space-y-6">
          {/* Timeline */}
          <div className="rounded-2xl border border-[var(--mq-border-subtle)] bg-[var(--mq-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--mq-primary)] uppercase tracking-wider font-bold">
                Retry Dispatch Timeline
              </span>
              <span className="text-[10px] font-mono text-[var(--mq-muted)]">
                POLICY: {strategy.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {steps.map((step, idx) => {
                const isDlq = step.status === 'DLQ_STORED';
                const isSuccess = step.status === 'SUCCESS';
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                      isDlq
                        ? 'border-[var(--mq-rose)]/40 bg-[var(--mq-rose)]/10 text-[var(--mq-rose)]'
                        : isSuccess
                        ? 'border-[var(--mq-emerald)]/40 bg-[var(--mq-emerald)]/10 text-[var(--mq-emerald)]'
                        : 'border-[var(--mq-border-subtle)] bg-[var(--mq-bg)] text-[var(--mq-text)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-[var(--mq-surface-2)] text-[10px] font-bold text-[var(--mq-muted)]">
                        Attempt #{step.attempt}
                      </span>
                      <span>Delay: {(step.delayMs / 1000).toFixed(2)}s</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-[var(--mq-muted)]">T +{step.timeSec}s</span>
                      <span className="font-bold uppercase tracking-wider">
                        [{step.status}]
                      </span>
                    </div>
                  </div>
                );
              })}
              {steps.length === 0 && (
                <div className="p-8 text-center text-xs font-mono text-[var(--mq-muted)] border border-dashed border-[var(--mq-border-subtle)] rounded-xl">
                  Run a simulation on the left to see the retry schedule.
                </div>
              )}
            </div>
          </div>

          {/* Dead-Letter Queue Bucket */}
          <div className="rounded-2xl border border-[var(--mq-rose)]/30 bg-[var(--mq-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--mq-rose)] uppercase tracking-wider font-bold flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5" /> Dead-Letter Storage (DLQ)
              </span>
              <span className="text-[10px] font-mono text-[var(--mq-muted)]">
                {dlqItems.length} stored messages
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {dlqItems.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[var(--mq-bg)] border border-[var(--mq-rose)]/20 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-[var(--mq-rose)]">
                    <span>ID: {item.id}</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <div className="text-[var(--mq-text)] text-[11px] truncate">{item.payload}</div>
                  <div className="text-[10px] text-[var(--mq-muted)]">{item.reason}</div>
                </div>
              ))}
              {dlqItems.length === 0 && (
                <div className="text-center py-4 text-xs text-[var(--mq-muted)]">
                  No poison pills currently in DLQ bucket.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
