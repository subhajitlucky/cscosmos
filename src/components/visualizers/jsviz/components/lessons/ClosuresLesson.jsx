'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Layers, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Copy, 
  Play, 
  Terminal, 
  Cpu, 
  Brain, 
  ShieldCheck, 
  Bookmark, 
  CheckSquare, 
  Award, 
  Lightbulb,
  FileCode,
  Zap,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '@/context/useTheme';
import useStore from '../../store/useStore';

// Sub-components
import MentalModelDiagram from './closures/MentalModelDiagram';
import ClosureVisualizer from './closures/ClosureVisualizer';
import ClosurePlayground from './closures/ClosurePlayground';
import RealWorldApplications from './closures/RealWorldApplications';
import CommonMistakes from './closures/CommonMistakes';
import ClosureChallenges from './closures/ClosureChallenges';
import ClosureQuiz from './closures/ClosureQuiz';
import { runInSandbox } from './closures/sandboxRunner';

const SECTIONS = [
  { id: 'overview', label: '1. Overview' },
  { id: 'mental-model', label: '2. Mental Model' },
  { id: 'how-it-works', label: '3. How It Works' },
  { id: 'visualizer', label: '4. Visualizer' },
  { id: 'playground', label: '5. Playground' },
  { id: 'applications', label: '6. Applications' },
  { id: 'mistakes', label: '7. Pitfalls' },
  { id: 'challenges', label: '8. Challenges' },
  { id: 'knowledge-check', label: '9. Knowledge Check' },
  { id: 'completion', label: '10. Milestone' }
];

const INTRO_CODE = `function outer() {
  let name = "JavaScript";

  function inner() {
    console.log(name);
  }

  return inner;
}

const myFunc = outer();
myFunc(); // Outputs: "JavaScript"`;

const UNDER_THE_HOOD_CODE = `function createCounter() {
  let count = 0;

  function increment() {
    count++;
    return count;
  }

  return increment;
}

const counter = createCounter();

console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3`;

const LINE_BY_LINE_EXPLANATION = [
  { line: '1', text: 'function outer() {', note: 'outer function declared in the global scope.' },
  { line: '2', text: '  let name = "JavaScript";', note: 'name is initialized inside outer\'s local Lexical Environment.' },
  { line: '4', text: '  function inner() {', note: 'inner function created; stamped with inner.[[Environment]] = outerEnv.' },
  { line: '5', text: '    console.log(name);', note: 'Reads name from outer scope via [[Environment]] identifier lookup.' },
  { line: '8', text: '  return inner;', note: 'Exports the inner function reference along with its backpack.' },
  { line: '11', text: 'const myFunc = outer();', note: 'outer() executes and pops from Call Stack! myFunc now references inner.' },
  { line: '12', text: 'myFunc(); // "JavaScript"', note: 'myFunc() runs in global scope, yet still successfully accesses "name"!' }
];

const LIFECYCLE_STEPS = [
  { step: 'STEP 1', title: 'Call createCounter()', desc: 'A new execution context is pushed to the Call Stack.' },
  { step: 'STEP 2', title: 'Establish Environment', desc: 'A fresh Lexical Environment and its Environment Record are instantiated.' },
  { step: 'STEP 3', title: 'Initialize count = 0', desc: 'Identifier "count" is bound with initial value 0.' },
  { step: 'STEP 4', title: 'Create increment()', desc: 'Function object receives internal specification slot [[Environment]] = createCounterEnv.' },
  { step: 'STEP 5', title: 'Return increment', desc: 'Function reference is returned to global variable "counter".' },
  { step: 'STEP 6', title: 'Context Pops from Stack', desc: 'createCounter context pops from stack, but environment remains reachable via counter.[[Environment]].' },
  { step: 'STEP 7', title: 'First Call: counter()', desc: 'increment resolves "count" via [[Environment]], updates 0 -> 1, returns 1.' },
  { step: 'STEP 8', title: 'Second Call: counter()', desc: 'Accesses SAME live binding, updates 1 -> 2. State persists across calls.' }
];

export function ClosuresLesson({ 
  topic, 
  content, 
  conceptNumber = 44, 
  prevTopic, 
  nextTopic 
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { markTopicCompleted, progress } = useStore();

  const isCompleted = progress.completedTopics.includes(topic?.id || 'closures-lexical-environment');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted 
    ? (resolvedTheme === 'dark' || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')))
    : resolvedTheme === 'dark';

  const syntaxTheme = isDark ? vscDarkPlus : vs;

  // Active section tracking
  const [activeSection, setActiveSection] = useState('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [introConsoleOutput, setIntroConsoleOutput] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const handleCopyIntro = () => {
    navigator.clipboard.writeText(INTRO_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const runIntroCode = async () => {
    setIntroConsoleOutput(null);
    try {
      const result = await runInSandbox(INTRO_CODE, { timeoutMs: 2500 });
      if (result.superseded) return;
      if (result.error) {
        setIntroConsoleOutput([result.error]);
      } else if (result.logs.length > 0) {
        setIntroConsoleOutput(result.logs.map(l => l.text));
      } else {
        setIntroConsoleOutput(['(Code ran with no console output)']);
      }
    } catch (err) {
      setIntroConsoleOutput(['Sandbox error: ' + (err.message || String(err))]);
    }
  };

  const triggerCompletionConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    if (topic?.id) {
      markTopicCompleted(topic.id);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* =========================================================================
          SECTION 0: LESSON HERO
          ========================================================================= */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white via-zinc-50/40 to-transparent dark:from-zinc-900/80 dark:via-zinc-900/30 dark:to-transparent p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        {/* Subtle background ambient blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-4xl space-y-4">
          
          {/* Breadcrumb Header */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-700 dark:text-brand-lime uppercase">
            <span>Module 05 // Scope, Closures & this Binding</span>
            <span>·</span>
            <span>Concept #{String(conceptNumber).padStart(2, '0')}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Closures &amp; Lexical Environment
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed max-w-3xl">
            Discover how JavaScript functions remember their surrounding lexical environment, even after the outer function has finished executing and popped from the call stack.
          </p>

          {/* Metadata Badges Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 font-bold">
              Intermediate
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 flex items-center gap-1.5 font-medium">
              <Clock size={13} />
              20–25 minutes
            </span>
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 font-bold">
              10 MCQs
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 font-bold flex items-center gap-1.5">
              <Zap size={13} />
              Interactive Lab
            </span>

            {/* Quick Completion Badge */}
            {isCompleted && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-brand-lime border border-emerald-500/30 font-bold flex items-center gap-1">
                <CheckCircle2 size={13} />
                Completed
              </span>
            )}
          </div>

        </div>

      </div>

      {/* =========================================================================
          STICKY LESSON SUB-NAVBAR
          ========================================================================= */}
      <div className="sticky top-28 z-30 -mx-4 sm:mx-0 px-4 sm:px-0">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-md p-1.5 overflow-x-auto flex items-center gap-1">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-brand-lime border border-emerald-500/30 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 01: UNDERSTANDING CLOSURES
          ========================================================================= */}
      <section id="overview" className="scroll-mt-36 space-y-6">
        
        {/* Section Heading */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            01
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Core Definition
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              What exactly is a Closure?
            </h2>
          </div>
        </div>

        {/* Intuitive Definition Banner (Stage 1: Simple Language) */}
        <div className="p-5 sm:p-6 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-2">
          <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed font-sans">
            A <strong className="text-emerald-700 dark:text-brand-lime font-bold">closure</strong> happens when a JavaScript function retains access to variables from its surrounding scope, even after the outer function has finished executing.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
            &ldquo;Think of a closure as a function that carries an invisible memory backpack containing all the variables available where it was created.&rdquo;
          </p>
        </div>

        {/* Interactive Code Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left: Code Viewer & Runner (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-[#0c1017] flex flex-col justify-between shadow-sm">
            <div>
              <div className="p-3 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
                  <FileCode size={14} className="text-emerald-600 dark:text-brand-lime" />
                  closure_demo.js
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyIntro}
                    className="p-1 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700/60 transition-colors flex items-center gap-1 text-[11px] font-mono"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-600 dark:text-brand-lime" /> : <Copy size={12} />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={runIntroCode}
                    className="p-1 px-3 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-brand-lime hover:bg-emerald-500/25 transition-all flex items-center gap-1.5 text-[11px] font-mono font-bold"
                  >
                    <Play size={12} />
                    <span>Run Snippet</span>
                  </button>
                </div>
              </div>

              <div className={`p-4 overflow-x-auto text-xs sm:text-sm ${
                isDark 
                  ? 'bg-[#090d16] selection:bg-[#264f78] selection:text-white' 
                  : 'bg-zinc-50/70 selection:bg-blue-100 selection:text-blue-900'
              }`}>
                <SyntaxHighlighter
                  language="javascript"
                  style={syntaxTheme}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: 'transparent',
                    border: 'none',
                    fontSize: '13px',
                    lineHeight: '1.65'
                  }}
                  codeTagProps={{
                    style: {
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {INTRO_CODE}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* Console Output bar */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 p-3 px-4 bg-zinc-100/70 dark:bg-zinc-950 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 text-[11px] mb-1">
                <Terminal size={12} className="text-emerald-600 dark:text-brand-lime" />
                <span className="font-bold">Console Output</span>
              </div>
              {introConsoleOutput ? (
                <div className="text-emerald-700 dark:text-brand-lime font-bold text-xs space-y-0.5">
                  {introConsoleOutput.map((l, i) => <div key={i}>&gt; {l}</div>)}
                </div>
              ) : (
                <div className="text-zinc-500 dark:text-zinc-500 text-[11px]">
                  Click &quot;Run Snippet&quot; to test. Output appears here.
                </div>
              )}
            </div>
          </div>

          {/* Right: Line-by-Line Breakdown (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Line-by-Line Execution Walkthrough</span>
                <span>Trace</span>
              </div>
              <div className="space-y-2.5">
                {LINE_BY_LINE_EXPLANATION.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800/80 text-xs">
                    <div className="font-mono text-emerald-700 dark:text-brand-lime font-bold text-[11px] mb-0.5">
                      Line {item.line}: <span className="text-zinc-800 dark:text-zinc-300 font-normal">{item.text}</span>
                    </div>
                    <div className="text-zinc-600 dark:text-zinc-400 font-sans text-[11.5px] leading-relaxed">
                      {item.note}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 4 Core Architectural Distinctions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10">
            <span className="text-[10px] font-mono font-bold uppercase text-blue-700 dark:text-blue-400 block mb-1">
              01 · Function Object
            </span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">First-Class Object</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A first-class ECMAScript object possessing internal slots (like [[Environment]]) and methods (like [[Call]]), along with properties.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-brand-lime block mb-1">
              02 · Lexical Environment
            </span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">Specification Mechanism</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              An abstract ECMA-262 specification structure that maps identifiers to bindings and tracks outer scope references.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-500/10">
            <span className="text-[10px] font-mono font-bold uppercase text-purple-700 dark:text-purple-400 block mb-1">
              03 · The Closure
            </span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">Retained Scope Access</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The function combined with its persistent access to its outer lexical environment bindings across time.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10">
            <span className="text-[10px] font-mono font-bold uppercase text-amber-700 dark:text-amber-400 block mb-1">
              04 · Execution Context
            </span>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">Stack Execution State</h4>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The runtime mechanism pushed and popped from the Call Stack; leaving the stack does not mean the environment becomes unreachable.
            </p>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 02: BUILD A MENTAL MODEL
          ========================================================================= */}
      <section id="mental-model" className="scroll-mt-36 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            02
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Cognitive Framework
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Build a Mental Model
            </h2>
          </div>
        </div>

        <MentalModelDiagram />
      </section>

      {/* =========================================================================
          SECTION 03: HOW CLOSURES ACTUALLY WORK
          ========================================================================= */}
      <section id="how-it-works" className="scroll-mt-36 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            03
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Execution Sequence &amp; Memory Lifecycle
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Under the Hood: Execution and Memory
            </h2>
          </div>
        </div>

        {/* Code Example Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c1017] overflow-hidden shadow-xs">
          <div className="p-3 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex items-center justify-between text-xs font-mono text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <FileCode size={14} className="text-purple-600 dark:text-purple-400" />
              counter_lifecycle.js
            </span>
            <span className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20 font-bold">
              Memory Lifecycle Example
            </span>
          </div>
          <div className={`p-4 overflow-x-auto text-xs sm:text-sm ${
            isDark 
              ? 'bg-[#090d16] selection:bg-[#264f78] selection:text-white' 
              : 'bg-zinc-50/70 selection:bg-blue-100 selection:text-blue-900'
          }`}>
            <SyntaxHighlighter
              language="javascript"
              style={syntaxTheme}
              customStyle={{
                margin: 0,
                padding: 0,
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                lineHeight: '1.65'
              }}
              codeTagProps={{
                style: {
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {UNDER_THE_HOOD_CODE}
            </SyntaxHighlighter>
          </div>
        </div>

        {/* 8-Step Lifecycle Cards */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 p-5 sm:p-6">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block mb-3 font-bold">
            The 8-Step Closure Execution Cycle
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LIFECYCLE_STEPS.map((s, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20">
                      {s.step}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">0{idx + 1}</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {s.title}
                  </h4>
                  <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CRITICAL TECHNICAL ACCURACY CALLOUT */}
        <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 dark:bg-purple-950/20 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 font-mono font-bold text-purple-700 dark:text-purple-300 text-xs uppercase tracking-wider">
            <Cpu size={16} />
            Critical Technical Distinction: Call Stack Popping vs Environment Reachability
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-purple-500/20">
              <strong className="text-zinc-900 dark:text-white block mb-1">1. The Execution Context Pops:</strong>
              When <code className="font-mono text-purple-600 dark:text-purple-300">createCounter()</code> completes, its Execution Context is <em>popped from the Call Stack and discarded</em>. The single JavaScript thread never leaves finished execution contexts sitting on the stack.
            </div>
            <div className="p-3 rounded-xl bg-white/60 dark:bg-zinc-900/60 border border-purple-500/20">
              <strong className="text-zinc-900 dark:text-white block mb-1">2. Reachability Governs Memory Retention:</strong>
              In the ECMAScript specification, Lexical Environments are abstract semantic structures, not mandated physical heap layouts. Garbage collection follows <em>reachability</em> from GC Roots. Because <code className="font-mono text-emerald-600 dark:text-brand-lime">counter</code> maintains a reference to the environment via its internal <code className="font-mono text-emerald-600 dark:text-brand-lime">[[Environment]]</code> slot, the environment remains reachable.
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 04: INTERACTIVE CLOSURE VISUALIZER (FLAGSHIP)
          ========================================================================= */}
      <section id="visualizer" className="scroll-mt-36 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            04
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Flagship Simulator
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Interactive Closure Visualizer
            </h2>
          </div>
        </div>

        <ClosureVisualizer />
      </section>

      {/* =========================================================================
          SECTION 05: LIVE JAVASCRIPT PLAYGROUND
          ========================================================================= */}
      <section id="playground" className="scroll-mt-36 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            05
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Experimental IDE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Live JavaScript Playground
            </h2>
          </div>
        </div>

        <ClosurePlayground />
      </section>

      {/* =========================================================================
          SECTION 06: REAL-WORLD APPLICATIONS
          ========================================================================= */}
      <section id="applications" className="scroll-mt-36 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            06
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Design Patterns
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Real-World Applications
            </h2>
          </div>
        </div>

        <RealWorldApplications />
      </section>

      {/* =========================================================================
          SECTION 07: COMMON MISTAKES
          ========================================================================= */}
      <section id="mistakes" className="scroll-mt-36 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            07
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Edge Cases &amp; Debugging
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Common Pitfalls &amp; Misconceptions
            </h2>
          </div>
        </div>

        <CommonMistakes />
      </section>

      {/* =========================================================================
          SECTION 08: INTERVIEW CHALLENGES
          ========================================================================= */}
      <section id="challenges" className="scroll-mt-36 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            08
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Career Preparation
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Technical Interview Challenges
            </h2>
          </div>
        </div>

        <ClosureChallenges />
      </section>

      {/* =========================================================================
          SECTION 09: KNOWLEDGE CHECK (10 MCQS)
          ========================================================================= */}
      <section id="knowledge-check" className="scroll-mt-36 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-brand-lime border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm">
            09
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Self-Assessment
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Knowledge Check (10 MCQs)
            </h2>
          </div>
        </div>

        <ClosureQuiz />
      </section>

      {/* =========================================================================
          SECTION 10: LESSON COMPLETION MILESTONE
          ========================================================================= */}
      <section id="completion" className="scroll-mt-36">
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white via-zinc-50/60 to-transparent dark:from-zinc-900 dark:via-zinc-900/60 dark:to-transparent p-6 sm:p-10 text-center space-y-6 shadow-sm">
          
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-brand-lime shadow-inner">
            <Award size={36} />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-brand-lime">
              Curriculum Milestone Achieved
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              You Have Mastered Closures!
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
              You now understand how JavaScript engines manage lexical environments, call stacks, environment reachability, and identifier resolution across all scopes.
            </p>
          </div>

          {/* Mark Complete Action */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={triggerCompletionConfetti}
              className={`px-6 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-brand-lime'
                  : 'neo-btn'
              }`}
            >
              <CheckSquare size={16} />
              <span>{isCompleted ? 'TOPIC COMPLETED ✓' : 'MARK LESSON COMPLETE'}</span>
            </button>
          </div>

          {/* Previous / Next Lesson Navigation Cards */}
          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {prevTopic ? (
              <Link
                href={`/jsviz/topic/${prevTopic.id}`}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between group"
              >
                <span className="text-[10px] font-mono font-bold text-zinc-400 flex items-center gap-1 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
                  <ArrowLeft size={12} /> PREVIOUS CONCEPT #{prevTopic.number || 43}
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1 line-clamp-1">
                  {prevTopic.title}
                </span>
              </Link>
            ) : <div />}

            {nextTopic ? (
              <Link
                href={`/jsviz/topic/${nextTopic.id}`}
                className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 hover:border-emerald-500/50 transition-all flex flex-col justify-between group text-right sm:text-left"
              >
                <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-brand-lime flex items-center justify-end sm:justify-start gap-1">
                  NEXT CONCEPT #{nextTopic.number || 45} <ArrowRight size={12} />
                </span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1 line-clamp-1">
                  {nextTopic.title}
                </span>
              </Link>
            ) : <div />}
          </div>

        </div>
      </section>

    </div>
  );
}

export default ClosuresLesson;
