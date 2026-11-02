'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckSquare,
  Search,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Database,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MONGO_PROBLEMS, MongoProblem } from '../data/problems';
import {
  executeMqlQuery,
  MOCK_COLLECTIONS,
  MongoExecutionResult
} from '../lib/mongoSubsetEvaluator';

const DIFFICULTIES = ['All', 'Easy', 'Intermediate', 'Advanced', 'Expert'] as const;

export default function Problems() {
  const [selectedId, setSelectedId] = useState<string>(MONGO_PROBLEMS[0].id);
  const [filter, setFilter] = useState<(typeof DIFFICULTIES)[number]>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [queryCode, setQueryCode] = useState<string>(MONGO_PROBLEMS[0].initialCode);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<string>('users');

  // Evaluation results state
  const [lastResult, setLastResult] = useState<MongoExecutionResult | null>(null);
  const [evalStatus, setEvalStatus] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [evalFeedback, setEvalFeedback] = useState<string>('');

  const solverSectionRef = useRef<HTMLDivElement>(null);

  // Load solved problems from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mongocosmos_solved_problems');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSolvedIds(new Set(parsed));
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const activeProblem = useMemo(() => {
    return MONGO_PROBLEMS.find((p) => p.id === selectedId) || MONGO_PROBLEMS[0];
  }, [selectedId]);

  const handleSelectProblem = (problem: MongoProblem) => {
    setSelectedId(problem.id);
    setQueryCode(problem.initialCode);
    setShowHint(false);
    setLastResult(null);
    setEvalStatus('idle');
    setEvalFeedback('');
    setActiveSchemaTab(problem.targetCollection);
    solverSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEvaluate = () => {
    try {
      const t0 = performance.now();
      const res = executeMqlQuery(queryCode, MOCK_COLLECTIONS);
      setLastResult(res);

      const validation = activeProblem.validate(res.documents, queryCode);

      if (validation.valid) {
        setEvalStatus('passed');
        setEvalFeedback(`SUCCESS: Query returned ${res.count} document(s) matching all target criteria! (${res.explain.executionTimeMillis}ms, ${res.explain.stage})`);

        setSolvedIds((prev) => {
          const next = new Set(prev).add(activeProblem.id);
          try {
            localStorage.setItem('mongocosmos_solved_problems', JSON.stringify(Array.from(next)));
          } catch {
            // Ignore storage errors
          }
          return next;
        });

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            disableForReducedMotion: true,
          });
        } catch {
          // ignore
        }
      } else {
        setEvalStatus('failed');
        setEvalFeedback(`VERIFICATION FAILED: ${validation.message || 'Output documents did not match expected criteria.'}`);
      }
    } catch (err: any) {
      setEvalStatus('failed');
      setEvalFeedback(`MQL ERROR: ${err.message || 'Invalid query syntax.'}`);
      setLastResult(null);
    }
  };

  const handleResetCode = () => {
    setQueryCode(activeProblem.initialCode);
    setLastResult(null);
    setEvalStatus('idle');
    setEvalFeedback('');
  };

  const filteredProblems = useMemo(() => {
    return MONGO_PROBLEMS.filter((p) => {
      const matchesDiff = filter === 'All' || p.difficulty === filter;
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDiff && matchesSearch;
    });
  }, [filter, searchQuery]);

  const progressPercent = Math.round((solvedIds.size / MONGO_PROBLEMS.length) * 100);

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Header & Progress */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-border/80 bg-muted/30 text-muted-foreground font-mono text-xs">
          <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>MQL Practice Arena // In-Memory Document Engine</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              MongoDB Practice Problems
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Execute MQL and aggregation challenges. Validate predicates, accumulators, and output tuples directly against in-memory BSON collections.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-border bg-card min-w-[240px]">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-muted-foreground">PROGRESS:</span>
              <span className="font-bold text-foreground">
                {solvedIds.size} / {MONGO_PROBLEMS.length} SOLVED ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Solver Section */}
      <div ref={solverSectionRef} className="space-y-6 scroll-mt-20">
        <div className="p-5 sm:p-6 rounded-xl border border-border bg-card space-y-5 shadow-xs">
          {/* Target Problem Meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                PRACTICE_CHALLENGE // {activeProblem.difficulty.toUpperCase()}
              </span>
              <h2 className="text-base font-bold text-foreground">
                {activeProblem.title}
              </h2>
            </div>

            {solvedIds.has(activeProblem.id) && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Challenge Solved</span>
              </span>
            )}
          </div>

          {/* Description & Expected Criteria */}
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 p-3.5 rounded-lg border border-border bg-muted/10">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Problem Prompt</span>
                <span className="text-muted-foreground font-normal">({activeProblem.category})</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{activeProblem.description}</p>
            </div>

            <div className="space-y-1.5 p-3.5 rounded-lg border border-border bg-muted/10">
              <div className="font-bold text-foreground flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-500" />
                <span>Expected Output Criteria</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{activeProblem.expectedOutput}</p>
            </div>
          </div>

          {/* Target Collection Schemas Tab */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Target Collection Schema</span>
              <div className="flex items-center gap-1">
                {Object.keys(MOCK_COLLECTIONS).map((cName) => (
                  <button
                    key={cName}
                    type="button"
                    onClick={() => setActiveSchemaTab(cName)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      activeSchemaTab === cName
                        ? 'bg-foreground text-background font-bold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {cName}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-border bg-muted/10 font-mono text-[11px] text-muted-foreground max-h-[140px] overflow-y-auto">
              {JSON.stringify(MOCK_COLLECTIONS[activeSchemaTab]?.slice(0, 3), null, 2)}
            </div>
          </div>

          {/* Hint disclosure */}
          <div className="pt-1">
            {!showHint ? (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Need a hint? Click here</span>
              </button>
            ) : (
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs text-foreground space-y-1">
                <span className="font-bold">Hint: </span>
                <span className="font-mono text-muted-foreground">{activeProblem.hint}</span>
              </div>
            )}
          </div>

          {/* MQL Code Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground">MQL Solution Editor</label>
              <button
                type="button"
                onClick={handleResetCode}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Code</span>
              </button>
            </div>
            <textarea
              value={queryCode}
              onChange={(e) => setQueryCode(e.target.value)}
              rows={4}
              spellCheck={false}
              className="w-full p-3 rounded-lg border border-border bg-muted/10 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground leading-relaxed resize-y"
            />
          </div>

          {/* Run Action */}
          <div className="flex items-center justify-between pt-2 border-t border-border/80">
            <button
              type="button"
              onClick={handleEvaluate}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Evaluate Challenge</span>
            </button>

            {evalStatus === 'passed' && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>PASS</span>
              </span>
            )}
            {evalStatus === 'failed' && (
              <span className="text-xs font-bold text-rose-500 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                <span>FAIL</span>
              </span>
            )}
          </div>

          {/* Execution Output Panel */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-foreground">Execution Output</span>
            {evalStatus === 'idle' ? (
              <div className="p-4 text-xs font-mono text-muted-foreground border border-dashed border-border rounded-lg">
                READY_FOR_EVALUATION: Press "Evaluate Challenge" to test query against {activeProblem.targetCollection} collection.
              </div>
            ) : (
              <div
                className={`p-3.5 rounded-lg border text-xs font-mono space-y-2 ${
                  evalStatus === 'passed'
                    ? 'border-emerald-500/40 bg-emerald-500/5 text-foreground'
                    : 'border-rose-500/40 bg-rose-500/5 text-rose-600 dark:text-rose-400'
                }`}
              >
                <div className="font-bold">{evalFeedback}</div>
                {lastResult && lastResult.documents.length > 0 && (
                  <pre className="p-2.5 rounded border border-border bg-background text-[11px] text-foreground max-h-[160px] overflow-y-auto">
                    {JSON.stringify(lastResult.documents, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Problem Directory Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-foreground">All 50 Practice Challenges</h3>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="flex items-center gap-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFilter(d)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    filter === d
                      ? 'bg-foreground text-background font-bold'
                      : 'border border-border bg-card hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="border border-border rounded-xl bg-card overflow-hidden divide-y divide-border/60">
          {filteredProblems.map((p) => {
            const isSolved = solvedIds.has(p.id);
            const isCurrent = p.id === selectedId;

            return (
              <div
                key={p.id}
                onClick={() => handleSelectProblem(p)}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isCurrent
                    ? 'bg-muted/40 border-l-4 border-l-emerald-600'
                    : 'hover:bg-muted/20'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="mt-0.5 sm:mt-0">
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-muted-foreground">{p.id}</span>
                      <h4 className="text-sm font-bold text-foreground">{p.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                    {p.difficulty}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectProblem(p);
                    }}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                      isCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'border border-border hover:bg-muted/40 text-foreground'
                    }`}
                  >
                    SOLVE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
