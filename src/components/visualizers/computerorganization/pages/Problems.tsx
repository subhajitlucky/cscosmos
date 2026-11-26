'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../styles.css';
import { challenges } from '../data/challenges';
import { computerOrganizationChapters } from '../data/chapters';

export interface ComputerOrganizationProblemsProps {
  basePath?: string;
}

// Concept challenges: reason first, then reveal. No scoring and no option lists —
// each card is a small teaching exercise tied back to its chapter.
export function ComputerOrganizationProblems({
  basePath = '/corecs/computer-organization',
}: ComputerOrganizationProblemsProps) {
  const [revealed, setRevealed] = useState<string[]>([]);
  const [filter, setFilter] = useState('all');
  const shown = challenges.filter((c) => filter === 'all' || c.chapter === filter);

  return (
    <div className="co-root mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold">Concept challenges</h1>
      <p className="co-muted mt-2">
        Reason first, then reveal. Every explanation links back to its chapter.
      </p>

      <label htmlFor="co-problem-filter" className="co-muted mt-6 block text-sm">
        Filter by chapter
      </label>
      <select
        id="co-problem-filter"
        className="co-card mt-2 block w-full sm:max-w-sm"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All chapters</option>
        {computerOrganizationChapters.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      {shown.length === 0 ? (
        <p className="co-muted mt-6">No challenges for this chapter yet.</p>
      ) : (
        <ol className="mt-6 grid gap-4">
          {shown.map((c) => {
            const isRevealed = revealed.includes(c.id);
            return (
              <li key={c.id} className="co-card">
                <span className="co-chip co-num">{c.kind}</span>
                <h2 className="mt-2 font-semibold">{c.prompt}</h2>
                <p className="co-muted mt-2 text-sm">Hint: {c.hint}</p>
                <div className="mt-3">
                  <button
                    type="button"
                    className="co-chip"
                    aria-expanded={isRevealed}
                    aria-controls={`co-answer-${c.id}`}
                    onClick={() =>
                      setRevealed((r) =>
                        isRevealed ? r.filter((x) => x !== c.id) : [...r, c.id],
                      )
                    }
                  >
                    {isRevealed ? 'Hide answer' : 'Reveal answer'}
                  </button>
                  <div id={`co-answer-${c.id}`} aria-live="polite" hidden={!isRevealed}>
                    {isRevealed && (
                      <div className="co-answer">
                        <p>
                          <strong>{c.answer}</strong>
                        </p>
                        <p className="co-muted mt-1">{c.explanation}</p>
                        <Link className="mt-2 inline-block" href={`${basePath}/learn/${c.chapter}`}>
                          Back to chapter →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
