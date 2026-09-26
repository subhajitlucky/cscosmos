'use client';

import { useMemo, useState } from 'react';
import { RotateCcw, Play, CheckCircle2 } from 'lucide-react';

const stages = [
  { id: 'input', label: 'Input', detail: 'User gives a value or observation.' },
  { id: 'processing', label: 'Processing', detail: 'Input is normalized or transformed.' },
  { id: 'model', label: 'Model', detail: 'A tiny model computes a score.' },
  { id: 'prediction', label: 'Prediction', detail: 'The score becomes a prediction.' },
];

export function FoundationLab() {
  const [input, setInput] = useState(72);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(0);

  const score = useMemo(() => Math.max(0, Math.min(1, (input - 30) / 60)), [input]);
  const prediction = score >= 0.5 ? 'HIGH' : 'LOW';

  const run = () => {
    setRunning(true);
    setActive(0);
    stages.forEach((_, i) => setTimeout(() => {
      setActive(i);
      if (i === stages.length - 1) setRunning(false);
    }, i * 650));
  };

  const reset = () => { setInput(72); setActive(0); setRunning(false); };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      <header>
        <div className="text-xs font-mono text-[var(--ai-primary)]">LAB / FIRST TINY AI PIPELINE</div>
        <h1 className="mt-3 font-display text-4xl md:text-6xl font-extrabold text-[var(--ai-text)]">Input → Processing → Model → Prediction</h1>
        <p className="mt-4 max-w-2xl text-[var(--ai-muted)]">A deliberately tiny deterministic model. The goal is to understand the shape of an AI pipeline before introducing neural networks or LLMs.</p>
      </header>

      <section className="rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface)] p-6 space-y-6">
        <label className="block text-sm text-[var(--ai-text)]">Input signal: <strong>{input}</strong>
          <input className="mt-4 w-full accent-indigo-500" type="range" min="0" max="100" value={input} onChange={e => setInput(Number(e.target.value))} />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {stages.map((stage, i) => (
            <div key={stage.id} className={`rounded-xl border p-5 transition-all ${active >= i ? 'border-[var(--ai-primary)] bg-[var(--ai-primary)]/10' : 'border-[var(--ai-border-subtle)]'}`}>
              <div className="flex justify-between text-[10px] font-mono text-[var(--ai-muted)]"><span>0{i + 1}</span>{active >= i && <CheckCircle2 className="w-4 h-4 text-[var(--ai-emerald)]" />}</div>
              <h2 className="mt-3 font-bold text-[var(--ai-text)]">{stage.label}</h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--ai-muted)]">{stage.detail}</p>
              {stage.id === 'model' && <div className="mt-4 font-mono text-xs text-[var(--ai-primary)]">score = {score.toFixed(2)}</div>}
              {stage.id === 'prediction' && <div className="mt-4 font-mono text-xs text-[var(--ai-primary)]">{prediction}</div>}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={run} disabled={running} className="ai-primary-button inline-flex items-center gap-2"><Play className="w-4 h-4" /> Run pipeline</button>
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-[var(--ai-border)] px-4 py-3 text-sm text-[var(--ai-text)]"><RotateCcw className="w-4 h-4" /> Reset</button>
        </div>
      </section>
    </div>
  );
}
