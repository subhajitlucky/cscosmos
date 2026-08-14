'use client';

import React, { useState } from 'react';
import { GitPullRequest, Play, RotateCcw, Zap, CheckCircle2, ShieldCheck, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface SagaStep {
  id: string;
  name: string;
  forwardAction: string;
  compensatingAction: string;
  service: string;
}

const SAGA_STEPS: SagaStep[] = [
  { id: 'order', name: '1. Create Order', service: 'Order Service', forwardAction: 'Insert order (status: PENDING)', compensatingAction: 'Update order (status: CANCELLED)' },
  { id: 'inventory', name: '2. Reserve Stock', service: 'Inventory Service', forwardAction: 'Decrement item stock by 1', compensatingAction: 'Increment item stock by 1 (Release)' },
  { id: 'payment', name: '3. Charge Payment', service: 'Payment Service', forwardAction: 'Authorize Stripe credit card', compensatingAction: 'Issue Stripe refund' },
  { id: 'shipping', name: '4. Dispatch Courier', service: 'Shipping Service', forwardAction: 'Create FedEx tracking waybill', compensatingAction: 'Void FedEx shipping label' },
];

export function SagaLab() {
  const [failAtStep, setFailAtStep] = useState<number | null>(2); // Default fail at Payment
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [isCompensating, setIsCompensating] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<{ [id: string]: 'SUCCESS' | 'COMPENSATED' | 'FAILED' }>({});
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Saga Orchestrator FSM ready.',
    '[CONFIG] Select failure point and click "Execute Distributed Saga".'
  ]);

  const executeSaga = () => {
    setCurrentStep(0);
    setIsCompensating(false);
    setCompletedSteps({});
    setLogs(['[SAGA START] Initiating OrderSaga workflow']);

    let step = 0;
    const forwardInterval = setInterval(() => {
      if (step < SAGA_STEPS.length) {
        const sagaStep = SAGA_STEPS[step];
        setCurrentStep(step);

        if (failAtStep !== null && step === failAtStep) {
          // Failure occurred!
          clearInterval(forwardInterval);
          setCompletedSteps(prev => ({ ...prev, [sagaStep.id]: 'FAILED' }));
          setLogs(prev => [
            `[ERROR] ${sagaStep.service}: ${sagaStep.name} FAILED!`,
            '[COMPENSATION TRIGGERED] Orchestrator executing backward compensations...',
            ...prev.slice(0, 5)
          ]);

          // Start compensation
          setTimeout(() => startRollback(step - 1), 600);
        } else {
          setCompletedSteps(prev => ({ ...prev, [sagaStep.id]: 'SUCCESS' }));
          setLogs(prev => [`[FORWARD] ${sagaStep.service}: ${sagaStep.forwardAction} (OK)`, ...prev.slice(0, 5)]);
          step++;
        }
      } else {
        clearInterval(forwardInterval);
        setCurrentStep(null);
        setLogs(prev => ['[SAGA COMPLETE] All distributed transactions committed successfully!', ...prev.slice(0, 5)]);
      }
    }, 600);
  };

  const startRollback = (fromStep: number) => {
    setIsCompensating(true);
    let step = fromStep;

    const rollbackInterval = setInterval(() => {
      if (step >= 0) {
        const sagaStep = SAGA_STEPS[step];
        setCurrentStep(step);
        setCompletedSteps(prev => ({ ...prev, [sagaStep.id]: 'COMPENSATED' }));
        setLogs(prev => [`[COMPENSATE] ${sagaStep.service}: ${sagaStep.compensatingAction} (Reverted)`, ...prev.slice(0, 5)]);
        step--;
      } else {
        clearInterval(rollbackInterval);
        setCurrentStep(null);
        setIsCompensating(false);
        setLogs(prev => ['[SAGA ROLLBACK FINISHED] System returned to consistent state.', ...prev.slice(0, 5)]);
      }
    }, 600);
  };

  const resetAll = () => {
    setCurrentStep(null);
    setIsCompensating(false);
    setCompletedSteps({});
    setLogs(['[RESET] Saga state cleared.']);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ms-amber)]/30 bg-[var(--ms-amber)]/10 text-[var(--ms-amber)] text-xs font-mono">
          <GitPullRequest className="w-3.5 h-3.5" /> Distributed Transactions &amp; Eventual Consistency
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ms-text)]">
          Saga Orchestration <span className="text-[var(--ms-primary)] ms-glow">&amp; Compensations</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--ms-muted)] max-w-2xl leading-relaxed">
          Step through multi-service transactions without blocking Two-Phase Commit (2PC). Observe forward execution and automated backward compensating rollbacks.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Saga Timeline */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--ms-border)] bg-[var(--ms-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--ms-border-subtle)] pb-4">
            <span className="text-[var(--ms-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
              <GitPullRequest className="w-3.5 h-3.5" /> Saga Execution Pipeline
            </span>
            <button
              onClick={resetAll}
              className="text-[10px] text-[var(--ms-muted)] hover:text-[var(--ms-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Failure Injection Picker */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-[var(--ms-muted)]">Inject Failure Point:</span>
            <div className="grid grid-cols-4 gap-2">
              {['Step 1 (Order)', 'Step 2 (Stock)', 'Step 3 (Payment)', 'None (Success)'].map((label, idx) => {
                const stepVal = idx === 3 ? null : idx;
                return (
                  <button
                    key={idx}
                    onClick={() => { setFailAtStep(stepVal); resetAll(); }}
                    className={`p-2 rounded-lg text-[9px] text-center transition-all ${
                      failAtStep === stepVal
                        ? 'bg-[var(--ms-amber)] text-black font-bold shadow'
                        : 'border border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] text-[var(--ms-muted)] hover:text-[var(--ms-text)]'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saga Steps */}
          <div className="space-y-3">
            {SAGA_STEPS.map((step, idx) => {
              const status = completedSteps[step.id];
              const isCurrent = currentStep === idx;
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all ${
                    status === 'SUCCESS'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : status === 'FAILED'
                      ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 ring-2 ring-rose-500/40'
                      : status === 'COMPENSATED'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                      : isCurrent
                      ? 'border-[var(--ms-primary)] bg-[var(--ms-primary)]/10 text-white'
                      : 'border-[var(--ms-border-subtle)] bg-[var(--ms-bg)] text-[var(--ms-muted)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-[var(--ms-text)]">{step.name}</div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-black/40 font-bold">
                      {status || (isCurrent ? (isCompensating ? 'COMPENSATING' : 'EXECUTING') : 'PENDING')}
                    </span>
                  </div>

                  <div className="mt-2 text-[10px] space-y-1 text-[var(--ms-muted)]">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <ArrowRight className="w-3 h-3" /> Forward: {step.forwardAction}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <ArrowLeft className="w-3 h-3" /> Compensate: {step.compensatingAction}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={executeSaga}
            className="w-full py-3 rounded-lg bg-[var(--ms-primary)] text-white font-bold hover:bg-[var(--ms-primary-hover)] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" /> Execute Distributed Saga
          </button>
        </div>

        {/* Right Logs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--ms-border-subtle)] bg-[var(--ms-surface)] space-y-3">
            <span className="text-[var(--ms-primary)] uppercase tracking-wider font-bold text-[10px]">
              Why Sagas Beat 2-Phase Commit (2PC)
            </span>
            <p className="text-[11px] text-[var(--ms-muted)] leading-relaxed">
              2PC requires holding global database row locks until all participants vote commit. If one network partition occurs, the entire system freezes.
            </p>
            <p className="text-[11px] text-[var(--ms-muted)] leading-relaxed">
              Sagas commit each local transaction immediately in its private database. If failure strikes, reverse compensating actions restore eventual consistency with zero blocking locks.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--ms-bg)] border border-[var(--ms-border-subtle)] space-y-1.5 text-[11px] max-h-48 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className="text-[var(--ms-muted)] leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
