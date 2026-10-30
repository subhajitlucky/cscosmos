'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CheckSquare,
  Search,
  Terminal,
  Play,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Table as TableIcon,
  HelpCircle,
  AlertCircle,
  Database,
  ArrowRight,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SQL_PROBLEMS,
  getProblemById,
  type SqlProblem,
  type ProblemDifficulty,
} from '../data/problems';
import {
  evaluateSql,
  type SqlRow,
  type SqlResult,
} from '../lib/sqlSubsetEvaluator';

const DIFFICULTIES: ('All' | ProblemDifficulty)[] = [
  'All',
  'Easy',
  'Intermediate',
  'Advanced',
  'Expert',
];

const SAMPLE_SCHEMAS: Record<string, { columns: string[]; rows: SqlRow[] }> = {
  users: {
    columns: ['id', 'name', 'email', 'role', 'country'],
    rows: [
      { id: 1, name: 'Alice', email: 'alice@test.com', role: 'admin', country: 'US' },
      { id: 2, name: 'Bob', email: 'bob@test.com', role: 'developer', country: 'CA' },
      { id: 3, name: 'Charlie', email: 'charlie@test.com', role: 'developer', country: 'US' },
      { id: 4, name: 'Diana', email: 'diana@test.com', role: 'designer', country: 'UK' },
    ],
  },
  orders: {
    columns: ['id', 'user_id', 'product', 'total'],
    rows: [
      { id: 101, user_id: 1, product: 'MacBook Pro', total: 2499.0 },
      { id: 102, user_id: 1, product: 'Magic Mouse', total: 99.0 },
      { id: 103, user_id: 2, product: 'Mechanical Keyboard', total: 150.0 },
      { id: 104, user_id: 3, product: '4K Monitor', total: 450.0 },
    ],
  },
};

export default function Problems() {
  const [selectedId, setSelectedId] = useState<string>(SQL_PROBLEMS[0].id);
  const [filter, setFilter] = useState<'All' | ProblemDifficulty>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState<string>(SQL_PROBLEMS[0].initialSql);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [activeSchemaTab, setActiveSchemaTab] = useState<string>('users');

  // Evaluation results state
  const [lastResult, setLastResult] = useState<SqlResult | null>(null);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [evalStatus, setEvalStatus] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [evalFeedback, setEvalFeedback] = useState<string>('');

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const solverSectionRef = useRef<HTMLDivElement>(null);

  // Load solved problems from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sqlcosmos_solved_problems');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSolvedIds(new Set(parsed));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const activeProblem = useMemo(() => {
    return getProblemById(selectedId) || SQL_PROBLEMS[0];
  }, [selectedId]);

  // Sync editor when active problem changes
  const handleSelectProblem = (problem: SqlProblem) => {
    setSelectedId(problem.id);
    setQuery(problem.initialSql);
    setShowHint(false);
    setLastResult(null);
    setExecTime(null);
    setEvalStatus('idle');
    setEvalFeedback('');
    if (problem.tablesUsed && problem.tablesUsed.length > 0) {
      setActiveSchemaTab(problem.tablesUsed[0]);
    }
  };

  // Evaluate query against active challenge
  const handleEvaluateChallenge = () => {
    const started = performance.now();
    const result = evaluateSql(query);
    const duration = performance.now() - started;

    setLastResult(result);
    setExecTime(duration);

    if (result.status === 'unsupported') {
      setEvalStatus('failed');
      setEvalFeedback(result.note || 'Query could not be evaluated.');
      return;
    }

    const passed = activeProblem.validate(result.rows, result.columns);
    if (passed) {
      setEvalStatus('passed');
      setEvalFeedback('All validation assertions passed!');

      setSolvedIds((prev) => {
        const updated = new Set(prev).add(activeProblem.id);
        try {
          localStorage.setItem('sqlcosmos_solved_problems', JSON.stringify(Array.from(updated)));
        } catch {
          // Ignore storage error
        }
        return updated;
      });

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback
      }
    } else {
      setEvalStatus('failed');
      setEvalFeedback(
        `Returned ${result.rows.length} row(s), but output tuples do not satisfy challenge requirements. Check your WHERE clause or selected columns.`
      );
    }
  };

  const handleResetCode = () => {
    setQuery(activeProblem.initialSql);
    setLastResult(null);
    setEvalStatus('idle');
    setEvalFeedback('');
  };

  // Filter problems for the table
  const filteredProblems = useMemo(() => {
    return SQL_PROBLEMS.filter((p) => {
      const matchesDiff = filter === 'All' || p.difficulty === filter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesDiff && matchesSearch;
    });
  }, [filter, searchQuery]);

  const currentIndex = SQL_PROBLEMS.findIndex((p) => p.id === activeProblem.id);
  const prevProblem = currentIndex > 0 ? SQL_PROBLEMS[currentIndex - 1] : null;
  const nextProblem = currentIndex < SQL_PROBLEMS.length - 1 ? SQL_PROBLEMS[currentIndex + 1] : null;

  const isCurrentSolved = solvedIds.has(activeProblem.id);
  const completionPercentage = Math.round((solvedIds.size / SQL_PROBLEMS.length) * 100);

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header section matching JS Practice Arena theme */}
      <div className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
            SQL_PRACTICE_ARENA
          </span>
          <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
            // In-Memory Client Relational Engine
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-foreground mb-3">
          SQL Practice Problems
        </h1>
        <p className="font-mono text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed">
          Execute relational SQL challenges. Validate schema logic, predicates, and output tuples
          directly against in-memory tables.
        </p>

        {/* Quick progress banner */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card/60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-foreground font-semibold">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>
                PROGRESS: {solvedIds.size} / {SQL_PROBLEMS.length} SOLVED ({completionPercentage}%)
              </span>
            </div>
            <div className="w-32 sm:w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            Current Target: <span className="text-foreground font-semibold">{activeProblem.title}</span>
          </div>
        </div>
      </div>

      {/* Interactive Challenge Workspace (Split Screen IDE) */}
      <div
        ref={solverSectionRef}
        className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-colors"
      >
        {/* Workspace Top Bar */}
        <div className="px-5 py-4 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 border rounded ${
                activeProblem.difficulty === 'Easy'
                  ? 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                  : activeProblem.difficulty === 'Intermediate'
                  ? 'text-blue-700 dark:text-blue-400 border-blue-500/30 bg-blue-500/10'
                  : activeProblem.difficulty === 'Advanced'
                  ? 'text-orange-700 dark:text-orange-400 border-orange-500/30 bg-orange-500/10'
                  : 'text-red-700 dark:text-red-400 border-red-500/30 bg-red-500/10'
              }`}
            >
              PRACTICE_CHALLENGE // {activeProblem.difficulty}
            </span>
            <h2 className="text-lg font-bold text-foreground tracking-tight">
              {activeProblem.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {(isCurrentSolved || evalStatus === 'passed') && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Challenge Solved</span>
              </span>
            )}

            <div className="flex items-center gap-1 border-l border-border pl-3 ml-1">
              <button
                disabled={!prevProblem}
                onClick={() => prevProblem && handleSelectProblem(prevProblem)}
                title="Previous Challenge"
                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={!nextProblem}
                onClick={() => nextProblem && handleSelectProblem(nextProblem)}
                title="Next Challenge"
                className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          {/* Left Column: Problem Details, Schemas, & Test Criteria (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-border overflow-y-auto max-h-[750px]">
            {/* Description Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <span>Problem Prompt</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {activeProblem.category}
                </span>
              </div>
              <p className="font-mono text-sm text-foreground leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/70">
                {activeProblem.description}
              </p>
            </div>

            {/* Expected Output Specification */}
            <div className="p-3.5 rounded-xl border border-border/80 bg-muted/10 space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
                Expected Output Criteria
              </span>
              <p className="text-xs font-mono text-foreground/90">
                {activeProblem.expectedOutputSummary}
              </p>
            </div>

            {/* Relational Schema Viewer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                  <Database size={13} className="text-emerald-500" />
                  <span>Target Table Schemas</span>
                </span>
                <div className="flex gap-1">
                  {activeProblem.tablesUsed.map((tbl) => (
                    <button
                      key={tbl}
                      onClick={() => setActiveSchemaTab(tbl)}
                      className={`px-2 py-0.5 rounded text-[11px] font-mono transition border ${
                        activeSchemaTab === tbl
                          ? 'bg-foreground text-background border-foreground font-bold'
                          : 'bg-muted/40 text-muted-foreground border-border hover:text-foreground'
                      }`}
                    >
                      {tbl}
                    </button>
                  ))}
                </div>
              </div>

              {SAMPLE_SCHEMAS[activeSchemaTab] && (
                <div className="rounded-xl border border-border overflow-hidden bg-background">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-muted/40 border-b border-border text-[11px] text-muted-foreground uppercase tracking-wider">
                        <tr>
                          {SAMPLE_SCHEMAS[activeSchemaTab].columns.map((col) => (
                            <th key={col} className="p-2 font-semibold">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60 text-muted-foreground">
                        {SAMPLE_SCHEMAS[activeSchemaTab].rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-muted/20 transition-colors">
                            {SAMPLE_SCHEMAS[activeSchemaTab].columns.map((col) => (
                              <td key={col} className="p-2 text-foreground/80">
                                {String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Hint Accordion */}
            <div className="border border-border/80 rounded-xl p-3 bg-muted/10 space-y-2">
              <button
                onClick={() => setShowHint((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs font-mono text-muted-foreground hover:text-foreground transition"
              >
                <span className="flex items-center gap-1.5 font-bold">
                  <HelpCircle size={14} className="text-amber-500" />
                  <span>{showHint ? 'Hide Guidance Hint' : 'Need a hint? Click here'}</span>
                </span>
                <span className="text-[10px] uppercase underline">
                  {showHint ? 'Collapse' : 'Reveal'}
                </span>
              </button>

              {showHint && (
                <div className="pt-2 border-t border-border/60 text-xs font-mono text-foreground/90 space-y-1 animate-in fade-in">
                  <div className="text-[11px] text-muted-foreground">Suggested SQL statement:</div>
                  <pre className="p-2.5 rounded bg-zinc-950 text-emerald-400 dark:bg-black overflow-x-auto text-xs border border-border">
                    {activeProblem.hint}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Code Editor & Query Output (7 cols) */}
          <div className="lg:col-span-7 flex flex-col bg-[#141416] text-white">
            {/* Terminal Title Bar */}
            <div className="px-4 py-2.5 border-b border-border/40 bg-[#1c1c1f] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                <Terminal size={14} className="text-emerald-400" />
                <span className="font-semibold uppercase tracking-wider">SQL Solution Editor</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Monospace Code Editor Area */}
            <div className="p-4 flex-1 flex flex-col space-y-3 bg-[#111113]">
              <div className="relative flex-1 min-h-[160px]">
                <textarea
                  ref={editorRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="-- Write your SQL solution statement here..."
                  spellCheck={false}
                  rows={6}
                  className="w-full h-full p-4 rounded-xl bg-[#0b0b0d] text-emerald-400 font-mono text-sm leading-relaxed border border-border/40 focus:border-emerald-500/80 focus:outline-none resize-y selection:bg-emerald-500/30"
                />
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  onClick={handleResetCode}
                  className="px-3 py-1.5 rounded-lg border border-border/60 bg-white/5 hover:bg-white/10 text-gray-300 font-mono text-xs flex items-center gap-1.5 transition"
                >
                  <RotateCcw size={13} />
                  <span>Reset Solution Code</span>
                </button>

                {/* Main Evaluate Button - exact name 'Evaluate Challenge' for E2E tests */}
                <button
                  onClick={handleEvaluateChallenge}
                  className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Play size={14} className="fill-current" />
                  <span>Evaluate Challenge</span>
                </button>
              </div>
            </div>

            {/* Results / Feedback Terminal */}
            <div className="border-t border-border/40 bg-[#0d0d0f] p-4 space-y-3 min-h-[160px]">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span className="uppercase tracking-wider font-bold">Execution Output</span>
                {execTime !== null && (
                  <span className="text-emerald-400 tabular-nums">
                    Elapsed: {execTime.toFixed(2)} ms
                  </span>
                )}
              </div>

              {/* Status Message */}
              {evalStatus !== 'idle' && (
                <div
                  className={`p-3 rounded-lg border text-xs font-mono flex items-start gap-2.5 ${
                    evalStatus === 'passed'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500/40 bg-red-500/10 text-red-400'
                  }`}
                >
                  {evalStatus === 'passed' ? (
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-bold uppercase tracking-wider">
                      {evalStatus === 'passed' ? 'SUCCESS // VERIFICATION PASSED' : 'VERIFICATION_ERROR'}
                    </div>
                    <div>{evalFeedback}</div>
                  </div>
                </div>
              )}

              {/* Result Table Preview */}
              {lastResult && lastResult.status === 'ok' && (
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-gray-400">
                    Returned {lastResult.rows.length} row(s) • Columns: [
                    {lastResult.columns.join(', ')}]
                  </div>

                  <div className="rounded-lg border border-border/40 overflow-hidden max-h-[160px] overflow-y-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-white/5 border-b border-border/40 text-gray-400 uppercase text-[10px] tracking-wider sticky top-0">
                        <tr>
                          {lastResult.columns.map((col) => (
                            <th key={col} className="p-2 font-semibold">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20 text-gray-200">
                        {lastResult.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                            {lastResult.columns.map((col) => (
                              <td key={col} className="p-2">
                                {String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {lastResult === null && evalStatus === 'idle' && (
                <div className="p-6 text-center text-xs font-mono text-gray-500 border border-dashed border-border/40 rounded-lg">
                  READY_FOR_EVALUATION: Press &ldquo;Evaluate Challenge&rdquo; to test query.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Arena Problem Browser Header & Controls */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Difficulty Filter Pills matching JS practice */}
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setFilter(diff)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all rounded ${
                  filter === diff
                    ? 'bg-emerald-500 text-black border-emerald-500 font-black shadow-xs'
                    : 'bg-transparent border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Search Box matching JS practice */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="SEARCH_PROBLEMS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-border px-4 pl-10 py-2 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors bg-card text-foreground rounded"
            />
          </div>
        </div>

        {/* 12-Column Problem List Table matching JS practice */}
        <div className="border border-border rounded-xl overflow-hidden bg-card shadow-xs">
          <div className="grid grid-cols-12 border-b border-border p-4 text-xs font-bold uppercase tracking-widest bg-muted/30 text-muted-foreground">
            <div className="col-span-1">Status</div>
            <div className="col-span-7 md:col-span-7">Problem</div>
            <div className="col-span-2 md:col-span-2">Difficulty</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          <ul className="divide-y divide-border">
            {filteredProblems.map((problem) => {
              const isSolved = solvedIds.has(problem.id);
              const isSelected = activeProblem.id === problem.id;

              return (
                <li
                  key={problem.id}
                  className={`group transition-colors ${
                    isSelected ? 'bg-muted/30' : 'hover:bg-muted/20'
                  }`}
                >
                  <div className="grid grid-cols-12 p-4 items-center">
                    {/* Status checkbox */}
                    <div className="col-span-1">
                      {isSolved ? (
                        <CheckSquare size={20} className="text-emerald-500" />
                      ) : (
                        <div className="w-5 h-5 border border-muted-foreground/40 rounded-sm" />
                      )}
                    </div>

                    {/* Problem Title & Description */}
                    <div className="col-span-7 md:col-span-7 pr-4">
                      {/* Button with problem.title so page.getByRole('button', { name: /Filter Developers/i }) matches */}
                      <button
                        onClick={() => {
                          handleSelectProblem(problem);
                          solverSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`text-left font-bold text-base sm:text-lg transition-colors cursor-pointer ${
                          isSolved
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-foreground group-hover:text-emerald-500'
                        }`}
                      >
                        {problem.title}
                      </button>
                      <p className="text-xs font-mono text-muted-foreground truncate hidden md:block mt-1">
                        {problem.description}
                      </p>
                    </div>

                    {/* Difficulty tag */}
                    <div className="col-span-2 md:col-span-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2 py-1 border rounded ${
                          problem.difficulty === 'Easy'
                            ? 'text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : problem.difficulty === 'Intermediate'
                            ? 'text-blue-700 dark:text-blue-400 border-blue-500/30'
                            : problem.difficulty === 'Advanced'
                            ? 'text-orange-700 dark:text-orange-400 border-orange-500/30'
                            : 'text-red-700 dark:text-red-400 border-red-500/30'
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>

                    {/* Action button */}
                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => {
                          handleSelectProblem(problem);
                          solverSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border border-border text-muted-foreground group-hover:text-foreground group-hover:border-emerald-500 rounded transition"
                      >
                        <Terminal size={14} />
                        <span className="hidden sm:inline">SOLVE</span>
                        <ArrowRight size={13} className="hidden sm:inline" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {filteredProblems.length === 0 && (
            <div className="p-12 text-center text-muted-foreground font-mono">
              NO_DATA_FOUND: No challenges match your current search and difficulty filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
