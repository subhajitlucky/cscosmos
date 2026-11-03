'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Clock,
  Sparkles,
  ArrowRight,
  Code2,
  Terminal,
  Cpu,
  Layers,
  Copy,
  Check,
  Play,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  const [copiedSyntax, setCopiedSyntax] = useState(false);
  const [copiedExampleIndex, setCopiedExampleIndex] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const studioRef = useRef(null);

  // Build segmented presets from examples and syntax
  const presets = useMemo(() => {
    const items = [];
    const rawExamples = content?.examples || [];

    rawExamples.forEach((ex, idx) => {
      let title = ex.title;
      if (!title && ex.code) {
        const firstLine = ex.code.trim().split('\n')[0];
        const match = firstLine.match(/^\/\/\s*(?:\d+[\.\:\-]\s*)?(.+)$/);
        if (match && match[1]) {
          title = match[1].trim();
        }
      }
      const cleanTitle = title || `Pattern ${idx + 1}`;
      const badge = cleanTitle.length > 18 ? `Pattern ${idx + 1}` : cleanTitle;

      items.push({
        id: `preset-${idx}`,
        title: `${idx + 1}. ${cleanTitle}`,
        badge,
        description: ex.explanation || `Interactive scenario demonstrating ${topic?.title || 'this JavaScript concept'}.`,
        code: ex.code || '// Write JavaScript code here...'
      });
    });

    if (items.length === 0 && content?.syntax) {
      items.push({
        id: 'preset-syntax',
        title: '1. Syntax Reference',
        badge: 'Syntax',
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

  // Build quiz questions: prioritize explicit quiz, fallback to smart concept check
  const quizList = useMemo(() => {
    if (content?.quiz && Array.isArray(content.quiz) && content.quiz.length > 0) {
      return content.quiz;
    }

    const list = [];
    const topicTitle = topic?.title || 'this feature';

    // Question 1: Purpose
    list.push({
      id: 'q1',
      question: `What is the primary purpose of ${topicTitle} in JavaScript?`,
      code: null,
      options: [
        {
          text: content?.definition 
            ? `${content.definition.replace(/`/g, '').slice(0, 110)}...` 
            : `Provides structured language semantics for ${topicTitle}.`,
          correct: true,
          explanation: content?.definition || `Correct! This is the core purpose of ${topicTitle}.`
        },
        {
          text: `Directly manipulates GPU hardware registers without JavaScript engine validation.`,
          correct: false,
          explanation: `JavaScript code executes within an ECMAScript host environment (such as V8 in Node.js or the browser).`
        }
      ]
    });

    // Question 2: Behavior
    if (content?.examples?.[0]?.code) {
      list.push({
        id: 'q2',
        question: `How does JavaScript execute this pattern?`,
        code: content.examples[0].code.slice(0, 220),
        options: [
          {
            text: `Follows ECMAScript runtime evaluation rules for ${topicTitle}.`,
            correct: true,
            explanation: content.examples[0].explanation || `Correct! The JavaScript runtime handles this deterministically.`
          },
          {
            text: `Immediately halts the script and forces a browser reload.`,
            correct: false,
            explanation: `Standard JavaScript statements do not crash the host browser process.`
          }
        ]
      });
    }

    return list;
  }, [content, topic]);

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
            <div className="p-3 bg-[#090d16] overflow-x-auto text-xs sm:text-sm">
              <SyntaxHighlighter
                language="javascript"
                style={vscDarkPlus}
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

            {/* Segmented Preset Switcher */}
            {presets.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                {presets.map((preset, idx) => {
                  const isActive = activePresetIndex === idx;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-bold border border-zinc-200 dark:border-zinc-700'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <span>{preset.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isActive 
                          ? 'bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime font-bold'
                          : 'bg-zinc-200/70 dark:bg-zinc-800 text-zinc-500'
                      }`}>
                        {preset.badge}
                      </span>
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
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
              Key Code Patterns in Action
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {content.examples.map((ex, idx) => {
              let exTitle = ex.title;
              if (!exTitle && ex.code) {
                const firstLine = ex.code.trim().split('\n')[0];
                const match = firstLine.match(/^\/\/\s*(?:\d+[\.\:\-]\s*)?(.+)$/);
                if (match && match[1]) {
                  exTitle = match[1].trim();
                }
              }
              const displayTitle = exTitle || `Pattern 0${idx + 1}`;

              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 overflow-hidden shadow-xs"
                >
                  <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime">
                        0{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-100">
                        {displayTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyExample(ex.code, idx)}
                        className="p-1.5 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                        title="Copy code"
                      >
                        {copiedExampleIndex === idx ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                      </button>

                      <button
                        onClick={() => handleLoadIntoStudio(ex.code)}
                        className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-brand-lime/10 border border-emerald-300 dark:border-brand-lime/30 text-emerald-800 dark:text-brand-lime hover:bg-emerald-600 hover:text-white dark:hover:bg-brand-lime dark:hover:text-black font-mono text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Play size={11} /> Try in Studio
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-[#090d16] overflow-x-auto text-xs sm:text-sm">
                    <SyntaxHighlighter
                      language="javascript"
                      style={vscDarkPlus}
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
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-amber-200 my-2 overflow-x-auto">
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
          8. QUICK KNOWLEDGE CHECK (QUIZ)
         ========================================================================= */}
      {quizList.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700 dark:text-brand-lime" />
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-main)] tracking-tight">
              Quick Knowledge Check
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizList.map((q, qIdx) => {
              const selectedIdx = quizAnswers[q.id];
              const hasAnswered = selectedIdx !== undefined;

              return (
                <div 
                  key={q.id || qIdx} 
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-emerald-800 dark:text-brand-lime">
                      Question 0{qIdx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[var(--text-main)] mt-1">
                      {q.question}
                    </p>

                    {q.code && (
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-100 my-2 overflow-x-auto">
                        <code>{q.code}</code>
                      </div>
                    )}

                    <div className="space-y-1.5 pt-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedIdx === optIdx;
                        let btnStyle = 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400';

                        if (hasAnswered) {
                          if (opt.correct) {
                            btnStyle = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold';
                          } else if (isSelected && !opt.correct) {
                            btnStyle = 'border-rose-600 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 font-bold';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizSelect(q.id || `q-${qIdx}`, optIdx)}
                            className={`w-full p-2.5 rounded-lg text-left text-xs font-mono transition-colors flex items-center justify-between border cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt.text}</span>
                            {hasAnswered && opt.correct && <CheckCircle2 size={13} className="text-emerald-600 dark:text-brand-lime shrink-0 ml-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {hasAnswered && (
                    <div className={`p-2.5 rounded-lg text-xs leading-relaxed mt-2 border ${
                      q.options[selectedIdx]?.correct
                        ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300'
                        : 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300'
                    }`}>
                      {q.options[selectedIdx]?.explanation || (q.options[selectedIdx]?.correct ? 'Correct!' : 'Review the concept above.')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}

export default JsConceptLesson;
