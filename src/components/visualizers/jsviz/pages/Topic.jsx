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
                                <span className="text-[10px] font-mono text-brand-lime uppercase tracking-widest font-bold">
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
                            <BookOpen size={18} className="text-brand-lime" />
                            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-lime">
                                Core Objective
                            </h2>
                        </div>
                        {content?.phases && (
                            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border border-brand-lime/40 bg-brand-lime/10 text-brand-lime">
                                5-PHASE MASTER GUIDE
                            </span>
                        )}
                    </div>
                    <p className="text-sm sm:text-base font-mono leading-relaxed" style={{ color: 'var(--text-main)' }}>
                        {content?.definition || topic.description}
                    </p>
                </div>

                {/* 2. PHASE 1: The 5-Year-Old Intuition (Analogy Section) */}
                {content?.analogy && (
                    <div className="neo-card p-6 sm:p-8 border-2 border-brand-border/60" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-brand-lime/10 border border-brand-lime text-brand-lime">
                                    PHASE 01
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                                    {content.analogy.headline}
                                </h3>
                            </div>
                            <span className="text-xs font-mono text-gray-500 hidden sm:inline">First Principles Intuition</span>
                        </div>

                        <p className="text-sm font-mono leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                            {content.analogy.intro}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sticky Notes (Primitives) */}
                            <div className="p-5 rounded-xl border border-brand-lime/40 bg-brand-lime/5 flex flex-col justify-between shadow-md">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <StickyNote size={18} className="text-brand-lime" />
                                            <h4 className="text-sm font-bold text-brand-lime uppercase tracking-wider">
                                                {content.analogy.primitives.title}
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-lime/20 text-brand-lime">
                                            {content.analogy.primitives.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono leading-relaxed mb-4 text-[var(--text-main)]">
                                        {content.analogy.primitives.description}
                                    </p>
                                    <div className="p-3 rounded-lg bg-black/40 border border-brand-lime/20 font-mono text-xs text-brand-lime leading-relaxed mb-4">
                                        💡 <strong>The Punchline:</strong> {content.analogy.primitives.punchline}
                                    </div>
                                </div>
                                <ul className="space-y-1.5 border-t border-brand-lime/20 pt-3 text-[11px] font-mono text-[var(--text-muted)]">
                                    {content.analogy.primitives.traits.map((t, i) => (
                                        <li key={i} className="flex items-center gap-1.5">
                                            <span className="text-brand-lime">✔</span> {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Locker Keys (Objects & Arrays) */}
                            <div className="p-5 rounded-xl border border-blue-500/40 bg-blue-500/5 flex flex-col justify-between shadow-md">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Key size={18} className="text-blue-400" />
                                            <h4 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                                                {content.analogy.objects.title}
                                            </h4>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                                            {content.analogy.objects.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono leading-relaxed mb-4 text-[var(--text-main)]">
                                        {content.analogy.objects.description}
                                    </p>
                                    <div className="p-3 rounded-lg bg-black/40 border border-blue-500/20 font-mono text-xs text-blue-300 leading-relaxed mb-4">
                                        🔑 <strong>The Punchline:</strong> {content.analogy.objects.punchline}
                                    </div>
                                </div>
                                <ul className="space-y-1.5 border-t border-blue-500/20 pt-3 text-[11px] font-mono text-[var(--text-muted)]">
                                    {content.analogy.objects.traits.map((t, i) => (
                                        <li key={i} className="flex items-center gap-1.5">
                                            <span className="text-blue-400">✔</span> {t}
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
                                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-brand-lime/10 border border-brand-lime text-brand-lime">
                                    PHASE 02
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                                    {content.kingdoms.headline}
                                </h3>
                            </div>
                            <span className="text-xs font-mono text-gray-500 hidden sm:inline">The 7 Primitives vs Objects</span>
                        </div>

                        <p className="text-xs sm:text-sm font-mono leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                            {content.kingdoms.subheadline}
                        </p>

                        <div className="space-y-8">
                            {/* Kingdom 1: Primitives */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-brand-lime"></span>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-brand-lime">
                                        {content.kingdoms.kingdom1.name}
                                    </h4>
                                    <span className="text-[10px] font-mono text-gray-400">
                                        ({content.kingdoms.kingdom1.description})
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {content.kingdoms.kingdom1.types.map((type, idx) => (
                                        <div key={idx} className="p-3.5 rounded-lg border border-brand-border/60 bg-[var(--bg-main)] flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-mono text-xs font-bold text-brand-lime">
                                                        {type.name}
                                                    </span>
                                                    <span className="text-[9px] font-mono text-gray-500">#{idx + 1}</span>
                                                </div>
                                                <div className="font-mono text-xs text-gray-300 bg-black/40 px-2 py-1 rounded mb-2 overflow-x-auto">
                                                    {type.example}
                                                </div>
                                            </div>
                                            <p className="text-[11px] font-mono text-[var(--text-muted)] leading-tight">
                                                {type.explain}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Kingdom 2: Objects */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-blue-400">
                                        {content.kingdoms.kingdom2.name}
                                    </h4>
                                    <span className="text-[10px] font-mono text-gray-400">
                                        ({content.kingdoms.kingdom2.description})
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {content.kingdoms.kingdom2.types.map((type, idx) => (
                                        <div key={idx} className="p-3.5 rounded-lg border border-blue-500/30 bg-[var(--bg-main)] flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-mono text-xs font-bold text-blue-300">
                                                        {type.name}
                                                    </span>
                                                    <span className="text-[9px] font-mono text-blue-400/60">Container</span>
                                                </div>
                                                <div className="font-mono text-xs text-blue-200 bg-black/40 px-2 py-1 rounded mb-2 overflow-x-auto">
                                                    {type.example}
                                                </div>
                                            </div>
                                            <p className="text-[11px] font-mono text-[var(--text-muted)] leading-tight">
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
                            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-brand-lime/10 border border-brand-lime text-brand-lime">
                                PHASE 03
                            </span>
                            <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                <Layers size={18} className="text-brand-lime" /> Realtime Stack &amp; Heap Simulation Canvas
                            </h3>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded bg-[rgba(var(--accent-main-rgb),0.1)] text-brand-lime font-bold">
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
                                    <Play size={15} className="text-brand-lime" />
                                    <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-brand-lime">
                                        Guided Line-by-Line Execution Stepper:
                                    </h4>
                                </div>
                                <span className="text-xs font-mono text-gray-500">
                                    Step {activeStepperStep + 1} of {content.stepperSteps.length}
                                </span>
                            </div>

                            {/* Stepper Progress Tabs */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                                {content.stepperSteps.map((step, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setActiveStepperStep(idx);
                                            loadCodeAndVisualize(step.code);
                                        }}
                                        className={`p-2 rounded text-left border font-mono text-xs transition-all ${
                                            activeStepperStep === idx
                                                ? 'border-brand-lime bg-brand-lime/10 text-brand-lime font-bold shadow-sm'
                                                : 'border-brand-border/60 hover:border-gray-500 text-gray-400'
                                        }`}
                                    >
                                        <div className="text-[10px] opacity-70">Step {step.stepNumber}</div>
                                        <div className="truncate font-semibold">{step.label.split(' ')[0]} {step.label.split(' ')[1]}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Current Step Detail Card */}
                            {content.stepperSteps[activeStepperStep] && (
                                <div className="p-4 rounded-xl border border-brand-border/80 bg-[var(--bg-main)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold font-mono text-brand-lime">
                                                Step {content.stepperSteps[activeStepperStep].stepNumber}: {content.stepperSteps[activeStepperStep].label}
                                            </span>
                                        </div>
                                        <div className="font-mono text-xs text-green-300 bg-black/60 px-3 py-1.5 rounded inline-block">
                                            {content.stepperSteps[activeStepperStep].code}
                                        </div>
                                        <p className="text-xs font-mono text-[var(--text-muted)] leading-relaxed">
                                            💡 {content.stepperSteps[activeStepperStep].explanation}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                        <button
                                            disabled={activeStepperStep === 0}
                                            onClick={() => {
                                                const prev = activeStepperStep - 1;
                                                setActiveStepperStep(prev);
                                                loadCodeAndVisualize(content.stepperSteps[prev].code);
                                            }}
                                            className="px-3 py-1.5 rounded border border-brand-border text-xs font-mono font-bold disabled:opacity-30 hover:border-brand-lime transition-colors"
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
                                            className="px-4 py-1.5 rounded bg-brand-lime text-black font-bold text-xs font-mono disabled:opacity-30 hover:opacity-90 transition-opacity flex items-center gap-1"
                                        >
                                            Next Step <ArrowRight size={13} />
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
                        <span className="text-xs font-mono font-bold text-brand-lime flex items-center gap-1.5">
                            <Code size={16} /> LIVE CODE EXECUTION SANDBOX
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">
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
                                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-brand-lime/10 border border-brand-lime text-brand-lime">
                                    PHASE 04
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                                    The 4 Golden Rules &amp; Common Traps
                                </h3>
                            </div>
                            <span className="text-xs font-mono text-gray-500 hidden sm:inline">Everyday Interview Questions</span>
                        </div>

                        <div className="space-y-6">
                            {content.goldenRules.map((rule, idx) => (
                                <div key={idx} className="p-5 rounded-xl border border-brand-border/60 bg-[var(--bg-main)]">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                                        <h4 className="text-sm font-bold text-brand-lime font-mono">
                                            {rule.title}
                                        </h4>
                                        <button
                                            onClick={() => loadCodeAndVisualize(rule.trapCode)}
                                            className="px-2.5 py-1 rounded bg-brand-lime/10 border border-brand-lime/40 text-brand-lime hover:bg-brand-lime hover:text-black font-mono text-[11px] font-bold transition-all flex items-center gap-1"
                                        >
                                            <Play size={11} /> Try in Visualizer
                                        </button>
                                    </div>

                                    <div className="rounded-lg overflow-hidden border border-brand-border/40 mb-3 bg-black/90">
                                        <SyntaxHighlighter
                                            language="javascript"
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, padding: '12px 16px', background: 'transparent', fontSize: '12px' }}
                                        >
                                            {rule.trapCode}
                                        </SyntaxHighlighter>
                                    </div>

                                    <p className="text-xs font-mono text-[var(--text-muted)] leading-relaxed">
                                        💡 <strong>Why this happens:</strong> {rule.why}
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
                                <Code size={20} className="text-brand-lime" /> Comprehensive Code Demonstrations
                            </h3>
                            <span className="text-xs font-mono text-gray-500">{content.examples.length} Scenarios</span>
                        </div>

                        <div className="space-y-6">
                            {content.examples.map((ex, index) => (
                                <div key={index} className="neo-card overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                    <div 
                                        className="px-5 py-3 border-b flex justify-between items-center"
                                        style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-main)' }}
                                    >
                                        <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
                                            // {ex.title || `Example ${index + 1}`}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => loadCodeAndVisualize(ex.code)}
                                                className="text-xs font-mono font-bold text-brand-lime hover:bg-brand-lime hover:text-black transition-colors bg-[rgba(var(--accent-main-rgb),0.1)] px-3 py-1.5 border border-brand-lime/30 rounded flex items-center gap-1.5"
                                            >
                                                <Play size={12} /> VISUALIZE THIS
                                            </button>
                                            <button
                                                onClick={() => handleCopy(ex.code, index)}
                                                className="text-xs font-mono font-bold text-gray-400 hover:text-white transition-opacity px-2.5 py-1.5 border border-brand-border rounded"
                                            >
                                                {copiedIndex === index ? <Check size={14} className="text-brand-lime" /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5 overflow-x-auto text-xs sm:text-sm bg-black/90">
                                        <SyntaxHighlighter
                                            language="javascript"
                                            style={vscDarkPlus}
                                            customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                                        >
                                            {ex.code}
                                        </SyntaxHighlighter>
                                    </div>
                                    {ex.explanation && (
                                        <div className="px-5 py-3.5 border-t text-xs sm:text-sm font-mono leading-relaxed" style={{ borderColor: 'var(--border-main)', color: 'var(--text-muted)' }}>
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
                                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-brand-lime/10 border border-brand-lime text-brand-lime">
                                    PHASE 05
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                                    Knowledge Check: Test Your Mental Model
                                </h3>
                            </div>
                            <span className="text-xs font-mono text-gray-500 hidden sm:inline">3-Question Quick Quiz</span>
                        </div>

                        <div className="space-y-6">
                            {content.quiz.map((q, qIdx) => {
                                const selectedOptionIdx = quizAnswers[q.id];
                                const hasAnswered = selectedOptionIdx !== undefined;

                                return (
                                    <div key={q.id} className="p-5 rounded-xl border border-brand-border/60 bg-[var(--bg-main)]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-mono font-bold text-brand-lime">Question {qIdx + 1}:</span>
                                            <span className="text-xs sm:text-sm font-bold text-[var(--text-main)]">{q.question}</span>
                                        </div>

                                        {q.code && (
                                            <div className="rounded-lg overflow-hidden border border-brand-border/40 my-3 bg-black/80">
                                                <SyntaxHighlighter
                                                    language="javascript"
                                                    style={vscDarkPlus}
                                                    customStyle={{ margin: 0, padding: '10px 14px', background: 'transparent', fontSize: '12px' }}
                                                >
                                                    {q.code}
                                                </SyntaxHighlighter>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-3">
                                            {q.options.map((option, optIdx) => {
                                                const isSelected = selectedOptionIdx === optIdx;
                                                let btnStyle = 'border-brand-border/60 hover:border-gray-400 text-[var(--text-muted)]';

                                                if (hasAnswered) {
                                                    if (option.correct) {
                                                        btnStyle = 'border-green-500 bg-green-500/15 text-green-400 font-bold';
                                                    } else if (isSelected && !option.correct) {
                                                        btnStyle = 'border-red-500 bg-red-500/15 text-red-400 font-bold';
                                                    }
                                                }

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                                        className={`p-3 rounded-lg border text-left font-mono text-xs transition-all flex items-center justify-between ${btnStyle}`}
                                                    >
                                                        <span>{option.text}</span>
                                                        {hasAnswered && option.correct && <CheckCircle2 size={16} className="text-green-400 ml-2" />}
                                                        {hasAnswered && isSelected && !option.correct && <XCircle size={16} className="text-red-400 ml-2" />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {hasAnswered && (
                                            <div className={`mt-3 p-3 rounded-lg text-xs font-mono leading-relaxed border ${
                                                q.options[selectedOptionIdx].correct 
                                                    ? 'border-green-500/30 bg-green-500/10 text-green-300'
                                                    : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
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
                            <Cpu size={20} className="text-brand-lime" /> V8 Engine &amp; Hardware Memory Model
                        </h3>
                        <div className="prose dark:prose-invert max-w-none font-mono text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-muted)' }}>
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
                            <Sparkles size={20} className="text-brand-lime" /> Practical Engineering Use Cases
                        </h3>
                        <ul className="space-y-3 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                            {content.useCases.map((useCase, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                    <span className="text-brand-lime font-bold mt-0.5 select-none">❯</span>
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
                            <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1 group-hover:text-brand-lime transition-colors">
                                <ArrowLeft size={12} /> PREVIOUS_MODULE
                            </span>
                            <span className="text-sm sm:text-base font-bold truncate w-full mt-1.5" style={{ color: 'var(--text-main)' }}>
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
                            <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1 group-hover:text-brand-lime transition-colors">
                                NEXT_MODULE <ArrowRight size={12} />
                            </span>
                            <span className="text-sm sm:text-base font-bold truncate w-full mt-1.5" style={{ color: 'var(--text-main)' }}>
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
