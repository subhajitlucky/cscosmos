'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { topics, getTopicById } from '../data/topics';
import { getTopicContent } from '../data/topics/contents';
import CodeEditor from '../components/CodeEditor';
import VisualizerCanvas from '../components/VisualizerCanvas';
import Sidebar from '../components/Sidebar';
import useStore from '../store/useStore';
import { 
    CheckSquare, Code, Lightbulb, BookOpen, Cpu, Layers, Copy, 
    Check, ArrowLeft, ArrowRight, Menu, X, Sparkles, Key, StickyNote,
    Box, HelpCircle, CheckCircle2, XCircle, Play, RotateCcw, AlertTriangle
} from 'lucide-react';

const Topic = ({ topicId: propTopicId }) => {
    const params = useParams();
    const id = propTopicId || (params ? params.id : '');

    const topic = getTopicById(id);
    const content = getTopicContent(id);
    const { markTopicCompleted, progress } = useStore();

    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Stepper state (for phase-based topics)
    const [activeStepperStep, setActiveStepperStep] = useState(0);

    // Quiz answers state: { [qId]: optionIndex }
    const [quizAnswers, setQuizAnswers] = useState({});

    // Ref for smooth scroll to visualizer canvas
    const visualizerRef = useRef(null);

    // Flatten all topics to find prev/next
    const allTopicsFlattened = useMemo(() => {
        return topics.flatMap(cat => cat.items);
    }, []);

    const currentIndex = useMemo(() => {
        return allTopicsFlattened.findIndex(t => t.id === id);
    }, [allTopicsFlattened, id]);

    const prevTopic = allTopicsFlattened[currentIndex - 1];
    const nextTopic = allTopicsFlattened[currentIndex + 1];

    useEffect(() => {
        if (topic && content) {
            setCode(content?.examples?.[0]?.code || content?.syntax || '// Write JavaScript code here...');
        }
    }, [topic, content]);

    if (!topic) {
        return (
            <div className="min-h-screen pt-20 p-8 text-center font-mono" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
                <h2 className="text-2xl font-bold mb-4">⚠️ TOPIC NOT FOUND</h2>
                <p className="mb-6 opacity-70">The requested module ID &quot;{id}&quot; does not exist.</p>
                <Link href="/jsviz/learn" className="neo-btn px-6 py-2">
                    Back to Curriculum
                </Link>
            </div>
        );
    }

    const handleRun = (newCode) => {
        setCode(newCode);
        setIsRunning(true);
        setTimeout(() => setIsRunning(false), 200);
    };

    const handleCopy = (text, index) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
        setCode(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);

        if (visualizerRef.current) {
            visualizerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const loadCodeAndVisualize = (customCode) => {
        setCode(customCode);
        setIsRunning(true);
        setTimeout(() => setIsRunning(false), 200);
        if (visualizerRef.current) {
            visualizerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSelectQuizOption = (qId, optionIdx) => {
        setQuizAnswers(prev => ({
            ...prev,
            [qId]: optionIdx
        }));
    };

    return (
        <div className="min-h-screen pt-16 flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* Topic Header Bar */}
            <header 
                className="border-b px-4 py-3 sm:px-6 sticky top-16 z-20 backdrop-blur-md transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
            >
                <div className="max-w-[1700px] mx-auto flex flex-wrap justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/jsviz/learn" 
                            className="p-2 rounded-lg border opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1.5 text-xs font-mono font-bold"
                            style={{ borderColor: 'var(--border-main)', color: 'var(--text-main)' }}
                            title="Back to Curriculum"
                        >
                            <ArrowLeft size={16} />
                            <span className="hidden sm:inline">Curriculum</span>
                        </Link>

                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg border text-brand-lime hover:bg-[rgba(var(--accent-main-rgb),0.1)] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
                            style={{ borderColor: 'var(--border-main)' }}
                            title="Toggle All Topics Menu"
                        >
                            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                            <span>All Topics</span>
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-mono font-bold text-emerald-700 dark:text-brand-lime uppercase tracking-wider">
                                    Concept {String(currentIndex + 1).padStart(2, '0')} // {topic.category || 'Core JavaScript'}
                                </span>
                            </div>
                            <h1 className="text-lg sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                                {topic.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => markTopicCompleted(topic.id)}
                            className={`neo-btn-secondary px-4 py-2 text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                                progress.completedTopics.includes(topic.id) 
                                    ? 'border-brand-lime text-brand-lime bg-[rgba(var(--accent-main-rgb),0.1)]' 
                                    : ''
                            }`}
                        >
                            <CheckSquare size={14} />
                            {progress.completedTopics.includes(topic.id) ? 'COMPLETED' : 'MARK_COMPLETE'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Slide-out Topic Index Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 pt-32 bg-black/60 backdrop-blur-sm flex justify-start" onClick={() => setSidebarOpen(false)}>
                    <div 
                        className="w-80 max-w-[85vw] h-full border-r overflow-y-auto p-6 shadow-2xl animate-in slide-in-from-left duration-200"
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-4 border-b mb-6" style={{ borderColor: 'var(--border-main)' }}>
                            <span className="text-xs font-bold font-mono text-brand-lime uppercase tracking-widest">
                                Topics Catalog (100 Concepts)
                            </span>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div onClick={() => setSidebarOpen(false)}>
                            <Sidebar topics={topics} />
                        </div>
                    </div>
                </div>
            )}

            {/* Single-Column Spacious Horizontal Flow Layout */}
            <div className="max-w-[1700px] mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-12">
                
                {/* 1. Topic Objective & Overview Banner */}
                <div className="neo-card p-6 border-l-4" style={{ borderLeftColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-emerald-600 dark:text-brand-lime" />
                            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
                                Core Objective
                            </h2>
                        </div>
                        {content?.phases && (
                            <span className="text-xs font-mono font-bold px-3 py-1 rounded border border-emerald-300 dark:border-brand-lime/40 bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime">
                                5-PHASE MASTER GUIDE
                            </span>
                        )}
                    </div>
                    <p className="text-sm sm:text-base font-mono leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {content?.definition || topic.description}
                    </p>
                </div>

                {/* 2. PHASE 1: The 5-Year-Old Intuition (Analogy Section) */}
                {content?.analogy && (
                    <div className="neo-card p-6 sm:p-8 border-2 border-brand-border/60" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    PHASE 01
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {content.analogy.headline}
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold hidden sm:inline">First Principles Intuition</span>
                        </div>

                        <p className="text-sm sm:text-base font-mono leading-relaxed mb-6 text-zinc-800 dark:text-zinc-200">
                            {content.analogy.intro}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sticky Notes (Primitives) */}
                            <div className="p-5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <StickyNote size={20} className="text-emerald-700 dark:text-brand-lime" />
                                            <h4 className="text-sm sm:text-base font-bold text-emerald-900 dark:text-brand-lime uppercase tracking-wider">
                                                {content.analogy.primitives.title}
                                            </h4>
                                        </div>
                                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime border border-emerald-300 dark:border-brand-lime/40">
                                            {content.analogy.primitives.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono leading-relaxed mb-4 text-zinc-800 dark:text-zinc-200">
                                        {content.analogy.primitives.description}
                                    </p>
                                    <div className="p-3.5 rounded-lg bg-emerald-100/80 dark:bg-zinc-900/90 border border-emerald-300 dark:border-brand-lime/30 font-mono text-xs sm:text-sm text-emerald-950 dark:text-brand-lime leading-relaxed mb-4">
                                        💡 <strong>The Punchline:</strong> {content.analogy.primitives.punchline}
                                    </div>
                                </div>
                                <ul className="space-y-2 border-t border-emerald-200 dark:border-emerald-500/20 pt-3 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-300">
                                    {content.analogy.primitives.traits.map((t, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="text-emerald-600 dark:text-brand-lime font-bold">✔</span> {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Locker Keys (Objects & Arrays) */}
                            <div className="p-5 rounded-xl border border-blue-300 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/20 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Key size={20} className="text-blue-600 dark:text-blue-400" />
                                            <h4 className="text-sm sm:text-base font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                                                {content.analogy.objects.title}
                                            </h4>
                                        </div>
                                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40">
                                            {content.analogy.objects.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono leading-relaxed mb-4 text-zinc-800 dark:text-zinc-200">
                                        {content.analogy.objects.description}
                                    </p>
                                    <div className="p-3.5 rounded-lg bg-blue-100/80 dark:bg-zinc-900/90 border border-blue-300 dark:border-blue-500/30 font-mono text-xs sm:text-sm text-blue-950 dark:text-blue-300 leading-relaxed mb-4">
                                        🔑 <strong>The Punchline:</strong> {content.analogy.objects.punchline}
                                    </div>
                                </div>
                                <ul className="space-y-2 border-t border-blue-200 dark:border-blue-500/20 pt-3 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-300">
                                    {content.analogy.objects.traits.map((t, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="text-blue-600 dark:text-blue-400 font-bold">✔</span> {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. PHASE 2: The Two Kingdoms of JavaScript */}
                {content?.kingdoms && (
                    <div className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    PHASE 02
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {content.kingdoms.headline}
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold hidden sm:inline">The 7 Primitives vs Objects</span>
                        </div>

                        <p className="text-sm sm:text-base font-mono leading-relaxed mb-6 text-zinc-800 dark:text-zinc-200">
                            {content.kingdoms.subheadline}
                        </p>

                        <div className="space-y-8">
                            {/* Kingdom 1: Primitives */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-brand-lime"></span>
                                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
                                        {content.kingdoms.kingdom1.name}
                                    </h4>
                                    <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                        ({content.kingdoms.kingdom1.description})
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                    {content.kingdoms.kingdom1.types.map((type, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-700 dark:text-brand-lime">
                                                        {type.name}
                                                    </span>
                                                    <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">#{idx + 1}</span>
                                                </div>
                                                <div className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-black/70 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg mb-2.5 overflow-x-auto font-medium">
                                                    {type.example}
                                                </div>
                                            </div>
                                            <p className="text-xs sm:text-sm font-mono text-zinc-700 dark:text-zinc-300 leading-normal">
                                                {type.explain}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Kingdom 2: Objects */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                                        {content.kingdoms.kingdom2.name}
                                    </h4>
                                    <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                        ({content.kingdoms.kingdom2.description})
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                    {content.kingdoms.kingdom2.types.map((type, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
                                                        {type.name}
                                                    </span>
                                                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">Container</span>
                                                </div>
                                                <div className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-blue-200 bg-blue-50/70 dark:bg-black/70 border border-blue-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg mb-2.5 overflow-x-auto font-medium">
                                                    {type.example}
                                                </div>
                                            </div>
                                            <p className="text-xs sm:text-sm font-mono text-zinc-700 dark:text-zinc-300 leading-normal">
                                                {type.explain}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. PHASE 3: Interactive Mental Model Simulation Canvas */}
                <div ref={visualizerRef} className="neo-card p-6 border-2 flex flex-col shadow-xl" style={{ borderColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: 'var(--border-main)' }}>
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                PHASE 03
                            </span>
                            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                                <Layers size={18} className="text-emerald-600 dark:text-brand-lime" /> Realtime Stack &amp; Heap Simulation Canvas
                            </h3>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-50 dark:bg-[rgba(var(--accent-main-rgb),0.1)] text-emerald-800 dark:text-brand-lime font-bold border border-emerald-300 dark:border-brand-lime/30">
                            INTERACTIVE_CANVAS
                        </span>
                    </div>

                    <div className="min-h-[480px] w-full relative rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-main)', backgroundColor: 'var(--bg-main)' }}>
                        <VisualizerCanvas topicId={topic.id} code={code} isRunning={isRunning} onCodeChange={loadCodeAndVisualize} />
                    </div>

                    {/* Step-by-Step Guided Stepper for Beginners */}
                    {content?.stepperSteps && (
                        <div className="mt-6 pt-6 border-t border-brand-border/40">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Play size={16} className="text-emerald-600 dark:text-brand-lime" />
                                    <h4 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
                                        Guided Line-by-Line Execution Stepper:
                                    </h4>
                                </div>
                                <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold">
                                    Step {activeStepperStep + 1} of {content.stepperSteps.length}
                                </span>
                            </div>

                            {/* Stepper Progress Tabs */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 mb-4">
                                {content.stepperSteps.map((step, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setActiveStepperStep(idx);
                                            loadCodeAndVisualize(step.code);
                                        }}
                                        className={`p-2.5 rounded-lg text-left border font-mono text-xs sm:text-sm transition-all ${
                                            activeStepperStep === idx
                                                ? 'border-emerald-500 dark:border-brand-lime bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime font-bold shadow-sm'
                                                : 'border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/40'
                                        }`}
                                    >
                                        <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Step {step.stepNumber}</div>
                                        <div className="truncate font-semibold mt-0.5">{step.label.split(' ')[0]} {step.label.split(' ')[1]}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Current Step Detail Card */}
                            {content.stepperSteps[activeStepperStep] && (
                                <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-800 dark:text-brand-lime">
                                                Step {content.stepperSteps[activeStepperStep].stepNumber}: {content.stepperSteps[activeStepperStep].label}
                                            </span>
                                        </div>
                                        <div className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-green-300 bg-zinc-100 dark:bg-black/80 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded-md inline-block font-semibold">
                                            {content.stepperSteps[activeStepperStep].code}
                                        </div>
                                        <p className="text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                            💡 {content.stepperSteps[activeStepperStep].explanation}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                                        <button
                                            disabled={activeStepperStep === 0}
                                            onClick={() => {
                                                const prev = activeStepperStep - 1;
                                                setActiveStepperStep(prev);
                                                loadCodeAndVisualize(content.stepperSteps[prev].code);
                                            }}
                                            className="px-3.5 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 text-xs sm:text-sm font-mono font-bold text-zinc-800 dark:text-zinc-200 disabled:opacity-30 hover:border-emerald-500 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={activeStepperStep === content.stepperSteps.length - 1}
                                            onClick={() => {
                                                const next = activeStepperStep + 1;
                                                setActiveStepperStep(next);
                                                loadCodeAndVisualize(content.stepperSteps[next].code);
                                            }}
                                            className="px-4 py-1.5 rounded bg-emerald-600 dark:bg-brand-lime text-white dark:text-black font-bold text-xs sm:text-sm font-mono disabled:opacity-30 hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm"
                                        >
                                            Next Step <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 5. Sandboxed Interactive Code Execution Editor */}
                <div className="neo-card p-0 flex flex-col h-[520px] min-h-[480px] overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="px-5 py-3 border-b flex justify-between items-center bg-[var(--bg-main)] border-brand-border">
                        <span className="text-xs sm:text-sm font-mono font-bold text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
                            <Code size={16} /> LIVE CODE EXECUTION SANDBOX
                        </span>
                        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                            Type custom code &amp; click Run to update memory above
                        </span>
                    </div>
                    <CodeEditor initialCode={code} onRun={handleRun} />
                </div>

                {/* 6. PHASE 4: Four Golden Rules & Everyday Traps */}
                {content?.goldenRules && (
                    <div className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    PHASE 04
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    The 4 Golden Rules &amp; Common Traps
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold hidden sm:inline">Everyday Interview Questions</span>
                        </div>

                        <div className="space-y-6">
                            {content.goldenRules.map((rule, idx) => (
                                <div key={idx} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                                        <h4 className="text-sm sm:text-base font-bold text-emerald-800 dark:text-brand-lime font-mono">
                                            {rule.title}
                                        </h4>
                                        <button
                                            onClick={() => loadCodeAndVisualize(rule.trapCode)}
                                            className="px-3 py-1.5 rounded bg-emerald-50 dark:bg-brand-lime/10 border border-emerald-300 dark:border-brand-lime/40 text-emerald-800 dark:text-brand-lime hover:bg-emerald-600 hover:text-white dark:hover:bg-brand-lime dark:hover:text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5"
                                        >
                                            <Play size={12} /> Try in Visualizer
                                        </button>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-800 mb-3 bg-zinc-950">
                                        <SyntaxHighlighter
                                            language="javascript"
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, padding: '14px 16px', background: 'transparent', fontSize: '13px' }}
                                        >
                                            {rule.trapCode}
                                        </SyntaxHighlighter>
                                    </div>

                                    <p className="text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed">
                                        💡 <strong className="text-zinc-900 dark:text-zinc-100">Why this happens:</strong> {rule.why}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 7. Practical Code Examples Section */}
                {content?.examples?.length > 0 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                <Code size={20} className="text-emerald-600 dark:text-brand-lime" /> Comprehensive Code Demonstrations
                            </h3>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold">{content.examples.length} Scenarios</span>
                        </div>

                        <div className="space-y-6">
                            {content.examples.map((ex, index) => (
                                <div key={index} className="neo-card overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                    <div 
                                        className="px-5 py-3 border-b flex justify-between items-center"
                                        style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-main)' }}
                                    >
                                        <span className="text-xs sm:text-sm font-mono font-bold text-zinc-800 dark:text-zinc-200">
                                            // {ex.title || `Example ${index + 1}`}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => loadCodeAndVisualize(ex.code)}
                                                className="text-xs sm:text-sm font-mono font-bold text-emerald-800 dark:text-brand-lime hover:bg-emerald-600 hover:text-white dark:hover:bg-brand-lime dark:hover:text-black transition-colors bg-emerald-50 dark:bg-[rgba(var(--accent-main-rgb),0.1)] px-3 py-1.5 border border-emerald-300 dark:border-brand-lime/30 rounded-lg flex items-center gap-1.5"
                                            >
                                                <Play size={12} /> VISUALIZE THIS
                                            </button>
                                            <button
                                                onClick={() => handleCopy(ex.code, index)}
                                                className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-opacity px-2.5 py-1.5 border border-zinc-300 dark:border-brand-border rounded-lg"
                                            >
                                                {copiedIndex === index ? <Check size={14} className="text-emerald-600 dark:text-brand-lime" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5 overflow-x-auto text-xs sm:text-sm bg-zinc-950">
                                        <SyntaxHighlighter
                                            language="javascript"
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px' }}
                                        >
                                            {ex.code}
                                        </SyntaxHighlighter>
                                    </div>
                                    {ex.explanation && (
                                        <div className="px-5 py-3.5 border-t text-xs sm:text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200" style={{ borderColor: 'var(--border-main)' }}>
                                            💡 {ex.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 8. PHASE 5: Knowledge Check (Interactive Quiz) */}
                {content?.quiz && (
                    <div className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    PHASE 05
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Knowledge Check: Test Your Mental Model
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold hidden sm:inline">3-Question Quick Quiz</span>
                        </div>

                        <div className="space-y-6">
                            {content.quiz.map((q, qIdx) => {
                                const selectedOptionIdx = quizAnswers[q.id];
                                const hasAnswered = selectedOptionIdx !== undefined;

                                return (
                                    <div key={q.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs sm:text-sm font-mono font-bold text-emerald-800 dark:text-brand-lime">Question {qIdx + 1}:</span>
                                            <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">{q.question}</span>
                                        </div>

                                        {q.code && (
                                            <div className="rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-800 my-3 bg-zinc-950">
                                                <SyntaxHighlighter
                                                    language="javascript"
                                                    style={vscDarkPlus}
                                                    customStyle={{ margin: 0, padding: '12px 16px', background: 'transparent', fontSize: '13px' }}
                                                >
                                                    {q.code}
                                                </SyntaxHighlighter>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-3">
                                            {q.options.map((option, optIdx) => {
                                                const isSelected = selectedOptionIdx === optIdx;
                                                let btnStyle = 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-zinc-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/40';

                                                if (hasAnswered) {
                                                    if (option.correct) {
                                                        btnStyle = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold ring-1 ring-emerald-500';
                                                    } else if (isSelected && !option.correct) {
                                                        btnStyle = 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-300 font-bold ring-1 ring-red-500';
                                                    }
                                                }

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                                        className={`p-3 rounded-lg border text-left font-mono text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                                                    >
                                                        <span>{option.text}</span>
                                                        {hasAnswered && option.correct && <CheckCircle2 size={16} className="text-emerald-600 dark:text-green-400 ml-2 shrink-0" />}
                                                        {hasAnswered && isSelected && !option.correct && <XCircle size={16} className="text-red-600 dark:text-red-400 ml-2 shrink-0" />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {hasAnswered && (
                                            <div className={`mt-3.5 p-3.5 rounded-lg text-xs sm:text-sm font-mono leading-relaxed border ${
                                                q.options[selectedOptionIdx].correct 
                                                    ? 'border-emerald-400 dark:border-green-500/30 bg-emerald-50 dark:bg-green-500/10 text-emerald-950 dark:text-green-300 font-medium'
                                                    : 'border-amber-400 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 text-amber-950 dark:text-amber-300 font-medium'
                                            }`}>
                                                {q.options[selectedOptionIdx].correct ? '🎉 ' : '💡 '}
                                                {q.options[selectedOptionIdx].explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 9. Engine & Memory Architecture Deep Dive */}
                {content?.memoryModel && (
                    <div className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                            <Cpu size={20} className="text-emerald-600 dark:text-brand-lime" /> V8 Engine &amp; Hardware Memory Model
                        </h3>
                        <div className="prose dark:prose-invert max-w-none font-mono text-sm sm:text-base leading-relaxed space-y-3 text-zinc-800 dark:text-zinc-200">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content.memoryModel}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* 10. Production Use Cases */}
                {content?.useCases && content.useCases.length > 0 && (
                    <div className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                            <Sparkles size={20} className="text-emerald-600 dark:text-brand-lime" /> Practical Engineering Use Cases
                        </h3>
                        <ul className="space-y-3 font-mono text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
                            {content.useCases.map((useCase, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                    <span className="text-emerald-600 dark:text-brand-lime font-bold mt-0.5 select-none">❯</span>
                                    <div className="leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: ({ children }) => <span>{children}</span> }}>
                                            {useCase}
                                        </ReactMarkdown>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 11. Bottom Topic Pagination */}
                <div className="pt-8 border-t flex justify-between items-center gap-4" style={{ borderColor: 'var(--border-main)' }}>
                    {prevTopic ? (
                        <Link
                            href={`/jsviz/topic/${prevTopic.id}`}
                            className="neo-card p-5 flex flex-col items-start group text-left max-w-[48%] transition-transform hover:-translate-y-1"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-brand-lime transition-colors">
                                <ArrowLeft size={14} /> PREVIOUS_MODULE
                            </span>
                            <span className="text-sm sm:text-base font-bold truncate w-full mt-1.5 text-zinc-900 dark:text-zinc-100">
                                {prevTopic.title}
                            </span>
                        </Link>
                    ) : <div />}

                    {nextTopic ? (
                        <Link
                            href={`/jsviz/topic/${nextTopic.id}`}
                            className="neo-card p-5 flex flex-col items-end group text-right max-w-[48%] transition-transform hover:-translate-y-1"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1 group-hover:text-emerald-600 dark:group-hover:text-brand-lime transition-colors">
                                NEXT_MODULE <ArrowRight size={14} />
                            </span>
                            <span className="text-sm sm:text-base font-bold truncate w-full mt-1.5 text-zinc-900 dark:text-zinc-100">
                                {nextTopic.title}
                            </span>
                        </Link>
                    ) : <div />}
                </div>
            </div>
        </div>
    );
};

export default Topic;
