'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Code2,
  Terminal,
  Cpu,
  Layers,
  Copy,
  Check,
  Play,
  Info,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/context/useTheme';
import CodeEditor from '../CodeEditor';
import VisualizerCanvas from '../VisualizerCanvas';

/**
 * Universal interactive lesson component for JavaScript Visualizer curriculum (Concepts 02 to 100).
 * Provides an ultra-simple, professional, beginner-friendly experience with:
 * - Module & Concept breadcrumbs
 * - Crystal clear definition and syntax reference
 * - Interactive Live Memory Studio with segmented presets and visualizer engine
 * - Key code patterns in action with 1-click execution
 * - Real-world engineering takeaways
 * - Under-the-hood engine & memory mechanics
 * - Interactive knowledge check quiz
 */
export function JsConceptLesson({ topic, content, conceptNumber = 2 }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted 
    ? (resolvedTheme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')))
    : resolvedTheme === 'dark';

  const syntaxTheme = isDark ? vscDarkPlus : vs;

  const [copiedSyntax, setCopiedSyntax] = useState(false);
  const [copiedExampleIndex, setCopiedExampleIndex] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [activeQuizIndex, setActiveQuizIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const studioRef = useRef(null);

  // Extract unique categories across presets if available
  const categories = useMemo(() => {
    const rawExamples = content?.examples || [];
    const set = new Set();
    rawExamples.forEach((ex) => {
      const cat = ex.category || ex.badge;
      if (cat) set.add(cat);
    });
    if (set.size > 1) {
      return ['All', ...Array.from(set)];
    }
    return [];
  }, [content]);

  const [selectedCategory, setSelectedCategory] = useState('All');

  // Build segmented presets from examples and syntax
  const presets = useMemo(() => {
    const items = [];
    const rawExamples = content?.examples || [];

    rawExamples.forEach((ex, idx) => {
      let title = ex.title;
      if (!title && ex.code) {
        const firstLine = ex.code.trim().split('\n')[0];
        const match = firstLine.match(/^\/\/\s*(?:\d+[.:-]\s*)?(.+)$/);
        if (match && match[1]) {
          title = match[1].trim();
        }
      }
      const cleanTitle = title || `Pattern ${idx + 1}`;
      const badge = ex.badge || (cleanTitle.length > 18 ? `Pattern ${idx + 1}` : null);
      const category = ex.category || ex.badge || null;

      items.push({
        id: `preset-${idx}`,
        realIndex: idx,
        title: `${idx + 1}. ${cleanTitle}`,
        badge,
        category,
        description: ex.explanation || `Interactive scenario demonstrating ${topic?.title || 'this JavaScript concept'}.`,
        code: ex.code || '// Write JavaScript code here...'
      });
    });

    if (items.length === 0 && content?.syntax) {
      items.push({
        id: 'preset-syntax',
        realIndex: 0,
        title: '1. Syntax Reference',
        badge: 'Syntax',
        category: null,
        description: 'Core syntax and declarations for this concept.',
        code: content.syntax
      });
    }

    return items;
  }, [content, topic]);

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [liveCode, setLiveCode] = useState(presets[0]?.code || content?.syntax || '// Write JavaScript code here...');

  // Update live code whenever topic or presets change
  useEffect(() => {
    if (presets.length > 0) {
      setActivePresetIndex(0);
      setLiveCode(presets[0].code);
    } else if (content?.syntax) {
      setLiveCode(content.syntax);
    }
  }, [presets, content]);

  const handleRunCode = (newCode) => {
    setLiveCode(newCode);
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 200);
  };

  const handleSelectPreset = (index) => {
    setActivePresetIndex(index);
    if (presets[index]) {
      handleRunCode(presets[index].code);
    }
  };

  const handleCopySyntax = () => {
    if (content?.syntax) {
      navigator.clipboard.writeText(content.syntax);
      setCopiedSyntax(true);
      setTimeout(() => setCopiedSyntax(false), 2000);
    }
  };

  const handleCopyExample = (codeText, idx) => {
    navigator.clipboard.writeText(codeText);
    setCopiedExampleIndex(idx);
    setTimeout(() => setCopiedExampleIndex(null), 2000);
  };

  const handleLoadIntoStudio = (codeText) => {
    handleRunCode(codeText);
    if (studioRef.current) {
      studioRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuizSelect = (qId, optionIdx) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleQuizReset = () => {
    setQuizAnswers({});
    setActiveQuizIndex(0);
  };

  // Build quiz questions: prioritize explicit quiz, fallback to smart 3-question check
  const quizList = useMemo(() => {
    if (content?.quiz && Array.isArray(content.quiz) && content.quiz.length > 0) {
      return content.quiz.map((q, idx) => ({
        id: q.id || `q-${idx + 1}`,
        category: q.category || `Concept ${String(conceptNumber).padStart(2, '0')}`,
        badgeClass: q.badgeClass || (
          idx === 0
            ? 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20'
            : idx === 1
              ? 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'
              : 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'
        ),
        title: q.title || q.question,
        code: q.code || null,
        options: (q.options || []).map((opt, optIdx) => ({
          letter: opt.letter || (optIdx === 0 ? 'A' : optIdx === 1 ? 'B' : optIdx === 2 ? 'C' : 'D'),
          label: opt.label || opt.text || (typeof opt === 'string' ? opt : `Option ${optIdx + 1}`),
          correct: Boolean(opt.correct),
          why: opt.why || opt.explanation || (opt.correct ? 'Correct! This matches JavaScript language semantics.' : 'Incorrect for this scenario.')
        }))
      }));
    }

    const list = [];
    const topicTitle = topic?.title || 'this feature';
    const firstExample = content?.examples?.[0];
    const firstTrap = content?.goldenRules?.[0];

    // Helper to get clean, complete syntax declarations without mid-construct cuts
    const getCleanSyntaxSnippet = (syntax) => {
      if (!syntax) return null;
      const trimmed = syntax.trim();
      const blocks = trimmed.split(/\n\s*\n/);
      const firstBlock = blocks[0] || trimmed;
      const lines = firstBlock.split('\n');
      if (lines.length <= 6) return firstBlock;
      return lines.slice(0, 6).join('\n');
    };

    // Helper to get clean example code without character-level cuts
    const getCleanExampleSnippet = (code) => {
      if (!code) return `// Executing ${topicTitle}\nconst result = true;`;
      const trimmed = code.trim();
      const lines = trimmed.split('\n');
      if (lines.length <= 8) return trimmed;
      return lines.slice(0, 8).join('\n');
    };

    // Question 1: Purpose & Mental Model
    list.push({
      id: 'q1',
      category: 'Mental Model',
      badgeClass: 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20',
      title: `What is the primary role of ${topicTitle}?`,
      code: getCleanSyntaxSnippet(content?.syntax),
      options: [
        {
          letter: 'A',
          label: content?.definition 
            ? content.definition.replace(/`/g, '').trim()
            : `Provides deterministic ECMAScript runtime semantics for ${topicTitle}.`,
          correct: true,
          why: content?.definition || `Correct! This is the primary role of ${topicTitle}.`
        },
        {
          letter: 'B',
          label: `Bypasses JavaScript engine safety checks to modify low-level CPU registers directly.`,
          correct: false,
          why: `JavaScript operates securely inside an ECMAScript host environment and cannot bypass safety abstractions.`
        }
      ]
    });

    // Question 2: Runtime Execution & Behavior
    list.push({
      id: 'q2',
      category: 'Runtime Behavior',
      badgeClass: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
      title: `How does JavaScript evaluate this code pattern?`,
      code: getCleanExampleSnippet(firstExample?.code),
      options: [
        {
          letter: 'A',
          label: firstExample?.explanation 
            ? firstExample.explanation.replace(/[`*]/g, '').trim()
            : `Executes predictably according to JavaScript engine specification rules.`,
          correct: true,
          why: firstExample?.explanation || `Correct! The JavaScript runtime handles this deterministically.`
        },
        {
          letter: 'B',
          label: `Causes an unrecoverable engine crash and forces a browser process termination.`,
          correct: false,
          why: `Standard JavaScript execution does not trigger browser process termination.`
        }
      ]
    });

    // Question 3: Engineering Best Practice / Gotcha
    list.push({
      id: 'q3',
      category: 'Engineering Takeaway',
      badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: firstTrap ? `What is the main pitfall to avoid with ${topicTitle}?` : `What is the recommended best practice for ${topicTitle}?`,
      code: firstTrap?.trapCode ? firstTrap.trapCode.trim() : null,
      options: [
        {
          letter: 'A',
          label: firstTrap 
            ? `${firstTrap.title || 'Beware of subtle behavior differences and edge cases.'}`
            : (content?.useCases?.[0] ? content.useCases[0].replace(/\*\*/g, '').replace(/`/g, '').trim() : `Follow clean code principles and explicit typing conventions.`),
          correct: true,
          why: firstTrap?.why || `Correct! Adhering to this practice prevents bugs and improves code maintainability.`
        },
        {
          letter: 'B',
          label: `Ignore warnings because modern engines automatically patch broken logic at runtime.`,
          correct: false,
          why: `JavaScript engines execute the exact code written; they do not automatically rewrite logic bugs.`
        }
      ]
    });

    return list;
  }, [content, topic, conceptNumber]);

  const totalQuizQuestions = quizList.length;
  const currentQ = quizList[activeQuizIndex] || quizList[0];
  const currentAnswerIdx = currentQ ? quizAnswers[currentQ.id] : undefined;
  const isCurrentAnswered = currentAnswerIdx !== undefined;
  const isCurrentCorrect = isCurrentAnswered && currentQ?.options[currentAnswerIdx]?.correct;

  const answeredQuizCount = Object.keys(quizAnswers).length;
  const correctQuizCount = quizList.filter(q => {
    const ans = quizAnswers[q.id];
    return ans !== undefined && q.options[ans]?.correct;
  }).length;

  const activePreset = presets[activePresetIndex] || presets[0];

  return (
    <div className="space-y-10 w-full">

      {/* =========================================================================
          1. LESSON HEADER
         ========================================================================= */}
      <header className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-brand-lime font-bold border border-emerald-500/20">
            {topic?.category || 'JavaScript Core Curriculum'}
          </span>
          <span>&bull;</span>
          <span>Concept {String(conceptNumber).padStart(2, '0')} of 100</span>
          <span>&bull;</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 min read
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-main)]">
          {topic?.title}
        </h1>

        <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {content?.definition || topic?.description}
        </p>
      </header>

      {/* =========================================================================
          2. THE CORE CONCEPT & SYNTAX DECODER
         ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
            The Core Concept
          </h2>
        </div>

        {content?.explanation && (
          <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {content.explanation}
          </p>
        )}

        {/* Syntax Reference Card */}
        {content?.syntax && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs">
            <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Code2 size={14} className="text-emerald-600 dark:text-brand-lime" />
                Syntax Reference
              </span>
              <button
                onClick={handleCopySyntax}
                className="flex items-center gap-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              >
                {copiedSyntax ? <Check size={12} className="text-emerald-600 dark:text-brand-lime" /> : <Copy size={12} />}
                <span>{copiedSyntax ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className={`p-3 overflow-x-auto text-xs sm:text-sm border-t ${
              isDark 
                ? 'bg-[#090d16] border-zinc-800 selection:bg-[#264f78] selection:text-white' 
                : 'bg-zinc-50 border-zinc-200 selection:bg-blue-100 selection:text-blue-900'
            }`}>
              <SyntaxHighlighter
                language="javascript"
                style={syntaxTheme}
                customStyle={{
                  margin: 0,
                  padding: 0,
                  background: 'transparent',
                  fontSize: '12px',
                  lineHeight: '1.6'
                }}
              >
                {content.syntax}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          3. LIVE INTERACTIVE MEMORY STUDIO
         ========================================================================= */}
      <section ref={studioRef} className="space-y-4 scroll-mt-20">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
                Live Interactive Studio
              </h2>
            </div>

            {/* Category Filter Pills (if multiple categories exist) */}
            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
                {categories.map((cat) => {
                  const count = cat === 'All' ? presets.length : presets.filter(p => p.category === cat).length;
                  const isCatActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCatActive
                          ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-bold border border-zinc-200 dark:border-zinc-700'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isCatActive 
                          ? 'bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime font-bold'
                          : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Segmented Preset Switcher */}
            {presets.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                {presets
                  .filter((preset) => selectedCategory === 'All' || preset.category === selectedCategory)
                  .map((preset) => {
                    const targetIdx = preset.realIndex !== undefined ? preset.realIndex : 0;
                    const isActive = activePresetIndex === targetIdx;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => handleSelectPreset(targetIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isActive
                            ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-bold border border-zinc-200 dark:border-zinc-700'
                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <span>{preset.title}</span>
                        {preset.badge && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                            isActive 
                              ? 'bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime font-bold'
                              : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500'
                          }`}>
                            {preset.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Preset Context Guidance Banner */}
          {activePreset?.description && (
            <div className="px-3.5 py-2 rounded-lg bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <Info size={14} className="text-emerald-600 dark:text-brand-lime shrink-0" />
              <span>{activePreset.description}</span>
            </div>
          )}
        </div>

        {/* Split Screen Studio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          
          {/* Editor Container */}
          <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs h-[520px]">
            <CodeEditor initialCode={liveCode} onRun={handleRunCode} className="border-0 rounded-none h-full" />
          </div>

          {/* Visualizer Canvas Container */}
          <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs h-[520px] bg-white dark:bg-zinc-950">
            <VisualizerCanvas 
              topicId={topic?.id} 
              code={liveCode} 
              isRunning={isRunning} 
              onCodeChange={handleRunCode} 
            />
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. KEY CODE PATTERNS IN ACTION
         ========================================================================= */}
      {content?.examples && content.examples.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
                Key Code Patterns in Action
              </h2>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
                {categories.map((cat) => {
                  const count = cat === 'All' ? content.examples.length : content.examples.filter(e => (e.category || e.badge) === cat).length;
                  const isCatActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isCatActive
                          ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-bold border border-zinc-200 dark:border-zinc-700'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isCatActive 
                          ? 'bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime font-bold'
                          : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {content.examples
              .map((ex, originalIdx) => ({ ex, originalIdx }))
              .filter(({ ex }) => selectedCategory === 'All' || (ex.category || ex.badge) === selectedCategory)
              .map(({ ex, originalIdx }) => {
                let exTitle = ex.title;
                if (!exTitle && ex.code) {
                  const firstLine = ex.code.trim().split('\n')[0];
                  const match = firstLine.match(/^\/\/\s*(?:\d+[.:-]\s*)?(.+)$/);
                  if (match && match[1]) {
                    exTitle = match[1].trim();
                  }
                }
                const displayTitle = exTitle || `Pattern ${String(originalIdx + 1).padStart(2, '0')}`;

                return (
                  <div 
                    key={originalIdx} 
                    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs"
                  >
                    <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime">
                          {String(originalIdx + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-100">
                          {displayTitle}
                        </h3>
                        {ex.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                            ex.badge.toLowerCase().includes('mutating') && !ex.badge.toLowerCase().includes('non')
                              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30'
                              : ex.badge.toLowerCase().includes('es2023')
                                ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/30'
                                : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30'
                          }`}>
                            {ex.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyExample(ex.code, originalIdx)}
                          className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                          title="Copy code"
                        >
                          {copiedExampleIndex === originalIdx ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        </button>

                        <button
                          onClick={() => handleLoadIntoStudio(ex.code)}
                          className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-brand-lime/10 border border-emerald-300 dark:border-brand-lime/30 text-emerald-800 dark:text-brand-lime hover:bg-emerald-600 hover:text-white dark:hover:bg-brand-lime dark:hover:text-black font-mono text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Play size={11} /> Try in Studio
                        </button>
                      </div>
                    </div>

                  <div className={`p-3 overflow-x-auto text-xs sm:text-sm border-t ${
                    isDark 
                      ? 'bg-[#090d16] border-zinc-800 selection:bg-[#264f78] selection:text-white' 
                      : 'bg-zinc-50 border-zinc-200 selection:bg-blue-100 selection:text-blue-900'
                  }`}>
                    <SyntaxHighlighter
                      language="javascript"
                      style={syntaxTheme}
                      customStyle={{
                        margin: 0,
                        padding: 0,
                        background: 'transparent',
                        fontSize: '12px',
                        lineHeight: '1.6'
                      }}
                    >
                      {ex.code}
                    </SyntaxHighlighter>
                  </div>

                  {ex.explanation && (
                    <div className="px-4 py-2.5 bg-zinc-50/60 dark:bg-zinc-950/40 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2 leading-relaxed">
                      <Info size={14} className="text-emerald-600 dark:text-brand-lime shrink-0 mt-0.5" />
                      <span>{ex.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================================
          5. REAL-WORLD ENGINEERING USE CASES
         ========================================================================= */}
      {content?.useCases && content.useCases.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
              Real-World Engineering Takeaways
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {content.useCases.map((useCase, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-brand-lime shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                  {useCase.replace(/\*\*/g, '')}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          6. UNDER THE HOOD: ENGINE & MEMORY MECHANICS
         ========================================================================= */}
      {content?.memoryModel && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
              Under the Hood: Engine &amp; Memory Mechanics
            </h2>
          </div>

          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
              <Lightbulb size={14} />
              <span>How JavaScript Executes This</span>
            </div>
            <div className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-mono whitespace-pre-line bg-zinc-50 dark:bg-black/40 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
              {content.memoryModel}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================================
          7. COMMON TRAPS TO AVOID
         ========================================================================= */}
      {content?.goldenRules && content.goldenRules.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
              Common Pitfalls &amp; Traps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.goldenRules.map((rule, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-zinc-900/40 space-y-3 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-950 dark:text-zinc-100 flex items-center gap-1.5 mb-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    {rule.title}
                  </h3>
                  {rule.trapCode && (
                    <div className={`p-2.5 rounded-lg font-mono text-xs my-2 overflow-x-auto border ${
                      isDark 
                        ? 'bg-slate-950 text-amber-200 border-slate-800 selection:bg-[#264f78] selection:text-white' 
                        : 'bg-amber-50 text-amber-950 border-amber-200 selection:bg-amber-100 selection:text-amber-900'
                    }`}>
                      <code>{rule.trapCode}</code>
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200 dark:border-zinc-800 pt-2">
                  {rule.why}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          8. QUICK KNOWLEDGE CHECK (QUIZ) - SINGLE-QUESTION FOCUSED STEPPER
         ========================================================================= */}
      {quizList.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
                  Quick Knowledge Check
                </h2>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  Test your understanding on these {totalQuizQuestions} questions (one by one):
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
                Score: <strong className="text-emerald-700 dark:text-brand-lime">{correctQuizCount}</strong> / {totalQuizQuestions}
              </span>
              {answeredQuizCount > 0 && (
                <button
                  type="button"
                  onClick={handleQuizReset}
                  title="Reset all questions"
                  className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Selector Tabs / Stepper */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800">
            {quizList.map((q, idx) => {
              const isTabActive = activeQuizIndex === idx;
              const tabAnswer = quizAnswers[q.id];
              const isTabAnswered = tabAnswer !== undefined;
              const isTabCorrect = isTabAnswered && q.options[tabAnswer]?.correct;

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => setActiveQuizIndex(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    isTabActive
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-bold border border-zinc-200 dark:border-zinc-700 ring-1 ring-emerald-500/30'
                      : isTabAnswered
                        ? isTabCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-brand-lime border border-emerald-300 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isTabActive
                      ? 'bg-emerald-600 text-white dark:bg-brand-lime dark:text-slate-950'
                      : isTabAnswered
                        ? isTabCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-[11px] truncate max-w-[100px]">
                    {q.category || `Q${idx + 1}`}
                  </span>
                  {isTabAnswered && (
                    isTabCorrect ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-lime shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    )
                  )}
                </button>
              );
            })}
          </div>

          {/* Focused Single Question Card */}
          {currentQ && (
            <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-md border ${currentQ.badgeClass || 'text-emerald-700 dark:text-brand-lime bg-emerald-500/10 border-emerald-500/20'}`}>
                  Question {activeQuizIndex + 1} of {totalQuizQuestions} &bull; {currentQ.category}
                </span>

                {isCurrentAnswered && (
                  <span className={`text-xs font-mono font-bold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${
                    isCurrentCorrect
                      ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400'
                      : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400'
                  }`}>
                    {isCurrentCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </>
                    )}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)] leading-snug">
                {currentQ.title}
              </h3>

              {currentQ.code && (
                <div className={`rounded-xl border p-4 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner ${
                  isDark 
                    ? 'bg-slate-950 text-slate-100 border-slate-800 selection:bg-[#264f78] selection:text-white' 
                    : 'bg-zinc-100 text-zinc-900 border-zinc-300 selection:bg-blue-100 selection:text-blue-900'
                }`}>
                  <pre className="whitespace-pre">
                    <code>{currentQ.code}</code>
                  </pre>
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = currentAnswerIdx === optIdx;
                  let btnStyle = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 hover:border-emerald-500/60 dark:hover:border-brand-lime/60 hover:bg-emerald-50/30 dark:hover:bg-zinc-850';

                  if (isCurrentAnswered) {
                    if (opt.correct) {
                      btnStyle = 'border-emerald-500 dark:border-brand-lime bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500/30';
                    } else if (isSelected && !opt.correct) {
                      btnStyle = 'border-rose-500 dark:border-rose-500 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 font-semibold ring-1 ring-rose-500/30';
                    } else {
                      btnStyle = 'border-zinc-200 dark:border-zinc-850 opacity-50 bg-zinc-100/50 dark:bg-zinc-900/30';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleQuizSelect(currentQ.id, optIdx)}
                      className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer group ${btnStyle}`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                        isCurrentAnswered && opt.correct
                          ? 'bg-emerald-600 text-white dark:bg-brand-lime dark:text-slate-950'
                          : isCurrentAnswered && isSelected && !opt.correct
                            ? 'bg-rose-600 text-white'
                            : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 group-hover:bg-emerald-600 group-hover:text-white dark:group-hover:bg-brand-lime dark:group-hover:text-slate-950'
                      }`}>
                        {opt.letter}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs sm:text-sm leading-relaxed block text-[var(--text-main)]">
                          {opt.label}
                        </span>
                        {isCurrentAnswered && isSelected && (
                          <span className={`text-[11px] block mt-1.5 font-medium ${
                            opt.correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {opt.why}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Nav inside Question Card */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  disabled={activeQuizIndex === 0}
                  onClick={() => setActiveQuizIndex((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-mono text-zinc-500">
                  {activeQuizIndex + 1} / {totalQuizQuestions}
                </span>

                <button
                  type="button"
                  disabled={activeQuizIndex === totalQuizQuestions - 1}
                  onClick={() => setActiveQuizIndex((prev) => Math.min(totalQuizQuestions - 1, prev + 1))}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-brand-lime dark:text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}

    </div>
  );
}

export default JsConceptLesson;
