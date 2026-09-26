'use client';

import { useState } from 'react';
import { Check, HelpCircle } from 'lucide-react';

const questions = [
  {q:'Which statement best describes inference?',options:['Changing model weights using training data','Applying a model to new input to produce an output','Collecting labels from users','Choosing a programming language'],answer:1,explain:'Inference is the runtime use of a model with fixed parameters.'},
  {q:'What is a parameter?',options:['A value learned or adjusted inside the model','A deployment server','A user question','A dataset label only'],answer:0,explain:'Parameters are numerical values such as weights that training can adjust.'},
  {q:'Which is broader?',options:['Deep learning','Machine learning','Artificial intelligence','Inference'],answer:2,explain:'AI is the broad field; machine learning and deep learning are subsets or approaches.'},
  {q:'What is a hyperparameter?',options:['A learned weight','A training/configuration choice','A prediction','A token'],answer:1,explain:'Examples include learning rate, batch size, and regularization settings.'},
];

export function FoundationProblems() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      <header>
        <div className="text-xs font-mono text-[var(--ai-primary)]">FOUNDATIONS / KNOWLEDGE CHECK</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-extrabold text-[var(--ai-text)]">Questions & Answers</h1>
        <p className="mt-3 text-[var(--ai-muted)]">Test whether the mental models are clear before moving into machine learning mathematics.</p>
      </header>
      {questions.map((item, qi) => {
        const selected = answers[qi];
        const correct = selected === item.answer;
        return (
          <section key={item.q} className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6 space-y-4">
            <div className="flex gap-3"><HelpCircle className="w-5 h-5 text-[var(--ai-primary)]" /><h2 className="font-bold text-[var(--ai-text)]">{qi + 1}. {item.q}</h2></div>
            <div className="grid gap-2">
              {item.options.map((option, oi) => (
                <button key={option} onClick={() => setAnswers({...answers, [qi]: oi})} className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${selected === oi ? 'border-[var(--ai-primary)] bg-[var(--ai-primary)]/10 text-[var(--ai-text)]' : 'border-[var(--ai-border-subtle)] text-[var(--ai-muted)]'}`}>
                  {option}
                </button>
              ))}
            </div>
            {selected !== undefined && <div className={`rounded-lg p-4 text-sm ${correct ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}><Check className="inline w-4 h-4 mr-2" />{correct ? 'Correct. ' : 'Not quite. '}{item.explain}</div>}
          </section>
        );
      })}
    </div>
  );
}
