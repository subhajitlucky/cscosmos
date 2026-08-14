'use client';

import React, { useState } from 'react';
import { Bot, Play, RotateCcw, Zap, CheckCircle2, Terminal, Code2, Database, Search } from 'lucide-react';

const AGENT_TASKS = [
  {
    id: 'sql',
    title: '1. SQL Database Query & Aggregation',
    prompt: 'Calculate total MRR for enterprise APAC accounts with >50 seats',
    steps: [
      { type: 'thought', content: 'I need to query the enterprise customers table in PostgreSQL to sum MRR where seats > 50 and region is APAC.' },
      { type: 'action', tool: 'sql_executor', args: { query: "SELECT sum(mrr) AS total_mrr FROM enterprise_customers WHERE seats > 50 AND region = 'APAC';" } },
      { type: 'observation', content: '{ "total_mrr": 248500, "row_count": 14 }' },
      { type: 'thought', content: 'The query returned a total MRR of $248,500 across 14 enterprise accounts. I have sufficient data to synthesize the answer.' },
      { type: 'final_answer', content: 'The total Monthly Recurring Revenue (MRR) for enterprise APAC customers with more than 50 seats is **$248,500/month** across 14 active accounts.' }
    ]
  },
  {
    id: 'k8s',
    title: '2. Kubernetes Cluster Autoscaling & Diagnostic',
    prompt: 'Check web-deployment pod CPU usage and scale replica count if > 85%',
    steps: [
      { type: 'thought', content: 'First, I should query the Kubernetes Metrics Server API to fetch current CPU utilization for web-deployment pods.' },
      { type: 'action', tool: 'k8s_api', args: { namespace: 'production', deployment: 'web-deployment', metric: 'cpu_percent' } },
      { type: 'observation', content: '{ "average_cpu": "89.4%", "current_replicas": 4 }' },
      { type: 'thought', content: 'Average CPU is 89.4%, which exceeds the 85% threshold. I will invoke scaleDeployment to add 2 additional pods.' },
      { type: 'action', tool: 'k8s_scale', args: { namespace: 'production', deployment: 'web-deployment', replicas: 6 } },
      { type: 'observation', content: '{ "status": "Scaled successfully", "new_replicas": 6 }' },
      { type: 'final_answer', content: 'Diagnostic confirmed CPU at **89.4%** (exceeding threshold). Successfully scaled `web-deployment` from **4 to 6 replicas** in production.' }
    ]
  }
];

export function AgentLab() {
  const [selectedTask, setSelectedTask] = useState(AGENT_TASKS[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runAgent = () => {
    setIsRunning(true);
    setCurrentStepIndex(1);

    const totalSteps = selectedTask.steps.length;
    let idx = 1;
    const interval = setInterval(() => {
      idx++;
      if (idx <= totalSteps) {
        setCurrentStepIndex(idx);
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 700);
  };

  const resetAgent = (task = selectedTask) => {
    setSelectedTask(task);
    setCurrentStepIndex(0);
    setIsRunning(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--ai-amber)]/30 bg-[var(--ai-amber)]/10 text-[var(--ai-amber)] text-xs font-mono">
          <Bot className="w-3.5 h-3.5" /> ReAct Autonomous Agent &amp; Tool Execution Lab
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--ai-text)]">
          Autonomous Agent <span className="text-[var(--ai-amber)] ai-glow">ReAct Loop Studio</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--ai-muted)] max-w-2xl leading-relaxed">
          Step through Reasoning + Acting (ReAct) execution loops with live JSON function calling, tool observations, and self-correcting deductions.
        </p>
      </div>

      {/* Task Selector */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
        {AGENT_TASKS.map((task) => (
          <button
            key={task.id}
            onClick={() => resetAgent(task)}
            className={`px-4 py-2.5 rounded-lg transition-all ${
              selectedTask.id === task.id
                ? 'bg-[var(--ai-amber)] text-black font-bold shadow-md'
                : 'border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-[var(--ai-muted)] hover:text-[var(--ai-text)]'
            }`}
          >
            {task.title}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Agent Prompt & Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-4">
            <span className="text-[var(--ai-amber)] uppercase tracking-wider font-bold flex items-center gap-2">
              <Bot className="w-3.5 h-3.5" /> Agent Goal &amp; Tools
            </span>
            <button
              onClick={() => resetAgent()}
              className="text-[10px] text-[var(--ai-muted)] hover:text-[var(--ai-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[var(--ai-bg)] border border-[var(--ai-border-subtle)] space-y-2">
              <span className="text-[10px] text-[var(--ai-muted)] uppercase tracking-wider block">Assigned User Task:</span>
              <p className="text-[var(--ai-text)] font-sans text-sm font-semibold">{selectedTask.prompt}</p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-[var(--ai-muted)] uppercase tracking-wider block">Available Function Tools:</span>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded border border-white/5 bg-white/[0.02] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-400" /> sql_executor
                </div>
                <div className="p-2 rounded border border-white/5 bg-white/[0.02] flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" /> k8s_api
                </div>
              </div>
            </div>

            <button
              onClick={runAgent}
              disabled={isRunning || currentStepIndex > 0}
              className="w-full py-3 rounded-lg bg-[var(--ai-amber)] text-black font-bold hover:bg-amber-400 transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              {isRunning ? 'Agent Reasoning & Executing Tools...' : 'Dispatch Autonomous Agent'}
            </button>
          </div>
        </div>

        {/* Right ReAct Execution Transcript */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-4">
              <span className="text-[var(--ai-amber)] uppercase tracking-wider font-bold text-[10px]">
                ReAct Agent Trace (Thought &rarr; Action &rarr; Observation)
              </span>
              <span className="text-[10px] text-[var(--ai-muted)]">
                Step {currentStepIndex} of {selectedTask.steps.length}
              </span>
            </div>

            {currentStepIndex === 0 ? (
              <div className="p-8 text-center text-[var(--ai-muted)] border border-dashed border-white/10 rounded-xl">
                Click &ldquo;Dispatch Autonomous Agent&rdquo; to begin ReAct execution loop.
              </div>
            ) : (
              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {selectedTask.steps.slice(0, currentStepIndex).map((step, idx) => {
                  if (step.type === 'thought') {
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 space-y-1">
                        <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block">💭 Thought:</span>
                        <p className="leading-relaxed">{step.content}</p>
                      </div>
                    );
                  }
                  if (step.type === 'action') {
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 space-y-1.5">
                        <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider block">⚡ Action (Tool Call):</span>
                        <div className="p-2 rounded bg-black/40 text-[10px] text-cyan-300">
                          <code>{step.tool}({JSON.stringify(step.args, null, 2)})</code>
                        </div>
                      </div>
                    );
                  }
                  if (step.type === 'observation') {
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-1">
                        <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider block">👁 Observation:</span>
                        <p className="leading-relaxed font-mono text-[10px]">{step.content}</p>
                      </div>
                    );
                  }
                  if (step.type === 'final_answer') {
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-100 space-y-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">🎯 Final Answer:</span>
                        <p className="leading-relaxed font-sans text-xs">{step.content}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
