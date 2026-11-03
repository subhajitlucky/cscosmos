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
    CheckSquare, Code, BookOpen, Cpu, Layers, Copy, 
    Check, ArrowLeft, ArrowRight, Menu, X, Sparkles,
    CheckCircle2, XCircle, Play, Database, ListFilter
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

    // Stepper state
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
                <h2 className="text-2xl font-bold mb-4">TOPIC NOT FOUND</h2>
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
            visualizerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const loadCodeAndVisualize = (customCode) => {
        setCode(customCode);
        setIsRunning(true);
        setTimeout(() => setIsRunning(false), 200);
        if (visualizerRef.current) {
            visualizerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSelectQuizOption = (qId, optionIdx) => {
        setQuizAnswers(prev => ({
            ...prev,
            [qId]: optionIdx
        }));
    };

    const scrollToSection = (sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) {
            const yOffset = -90;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const architecture = content?.architecture || content?.analogy;
    const typeCatalog = content?.typeCatalog || content?.kingdoms;

    return (
        <div className="min-h-screen pt-16 flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* Topic Sticky Header Bar */}
            <header 
                className="border-b px-4 sm:px-6 lg:px-8 py-3 sticky top-16 z-20 backdrop-blur-md transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
            >
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
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
                            className="p-2 rounded-lg border text-emerald-800 dark:text-brand-lime hover:bg-[rgba(var(--accent-main-rgb),0.1)] transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
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
                            <h1 className="text-lg sm:text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                                {topic.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => markTopicCompleted(topic.id)}
                            className={`neo-btn-secondary px-3.5 py-1.5 text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                                progress.completedTopics.includes(topic.id) 
                                    ? 'border-emerald-600 dark:border-brand-lime text-emerald-700 dark:text-brand-lime bg-[rgba(var(--accent-main-rgb),0.1)]' 
                                    : ''
                            }`}
                        >
                            <CheckSquare size={14} />
                            {progress.completedTopics.includes(topic.id) ? 'COMPLETED' : 'MARK_COMPLETE'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Quick Section Navigation Jump Bar */}
            <div 
                className="border-b px-4 sm:px-6 lg:px-8 py-2 sticky top-[118px] sm:top-[122px] z-10 backdrop-blur-md overflow-x-auto scrollbar-none transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-main)' }}
            >
                <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs font-mono whitespace-nowrap">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
                        <ListFilter size={13} /> Quick Jump:
                    </span>
                    <button onClick={() => scrollToSection('sec-overview')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                        Overview
                    </button>
                    {architecture && (
                        <button onClick={() => scrollToSection('sec-architecture')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            Stack vs Heap
                        </button>
                    )}
                    {typeCatalog && (
                        <button onClick={() => scrollToSection('sec-type-system')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            Type Catalog
                        </button>
                    )}
                    <button onClick={() => scrollToSection('sec-memory-lab')} className="px-2.5 py-1 rounded-md border border-emerald-500 dark:border-brand-lime bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime transition-colors font-bold flex items-center gap-1">
                        <Play size={10} /> Live Memory Lab
                    </button>
                    {content?.goldenRules && (
                        <button onClick={() => scrollToSection('sec-pitfalls')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            Traps &amp; Solutions
                        </button>
                    )}
                    {content?.quiz && (
                        <button onClick={() => scrollToSection('sec-quiz')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            Quick Quiz
                        </button>
                    )}
                </div>
            </div>

            {/* Slide-out Topic Index Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 pt-32 bg-black/60 backdrop-blur-sm flex justify-start" onClick={() => setSidebarOpen(false)}>
                    <div 
                        className="w-80 max-w-[85vw] h-full border-r overflow-y-auto p-6 shadow-2xl animate-in slide-in-from-left duration-200"
                        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-4 border-b mb-6" style={{ borderColor: 'var(--border-main)' }}>
                            <span className="text-xs font-bold font-mono text-emerald-700 dark:text-brand-lime uppercase tracking-widest">
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

            {/* Main Content Body: Ultra-Lean, Highly Informative */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                
                {/* 1. Concise Overview */}
                <section id="sec-overview" className="neo-card p-5 border-l-4" style={{ borderLeftColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <BookOpen size={17} className="text-emerald-700 dark:text-brand-lime" />
                            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
                                Core Concept
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-300 dark:border-brand-lime/40 bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime">
                                Stack (By Value)
                            </span>
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded border border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300">
                                Heap (By Reference)
                            </span>
                        </div>
                    </div>
                    <p className="text-sm sm:text-base font-mono leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {content?.definition || topic.description}
                    </p>
                </section>

                {/* 2. Stack vs. Heap Architecture */}
                {architecture && (
                    <section id="sec-architecture" className="neo-card p-5 sm:p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-3 mb-5">
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Cpu size={18} className="text-emerald-700 dark:text-brand-lime" />
                                {architecture.headline}
                            </h3>
                            <span className="text-xs font-mono text-zinc-500 font-semibold hidden sm:inline">Memory Allocation</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                            {/* Primitives */}
                            <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-bold text-emerald-900 dark:text-brand-lime uppercase tracking-wider">
                                            {architecture.primitives.title}
                                        </h4>
                                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime border border-emerald-300 dark:border-brand-lime/40">
                                            {architecture.primitives.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 mb-3">
                                        {architecture.primitives.description}
                                    </p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-emerald-100/80 dark:bg-zinc-900 border border-emerald-300 dark:border-brand-lime/30 font-mono text-xs text-emerald-950 dark:text-brand-lime font-medium">
                                    💡 {architecture.primitives.punchline}
                                </div>
                            </div>

                            {/* Objects */}
                            <div className="p-4 rounded-xl border border-blue-300 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/20 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                                            {architecture.objects.title}
                                        </h4>
                                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40">
                                            {architecture.objects.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono leading-relaxed text-zinc-800 dark:text-zinc-200 mb-3">
                                        {architecture.objects.description}
                                    </p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-blue-100/80 dark:bg-zinc-900 border border-blue-300 dark:border-blue-500/30 font-mono text-xs text-blue-950 dark:text-blue-300 font-medium">
                                    🔑 {architecture.objects.punchline}
                                </div>
                            </div>
                        </div>

                        {/* Compact Table */}
                        {content?.comparisonTable && (
                            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900/60 shadow-sm">
                                <table className="w-full text-left font-mono text-xs border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 font-bold">
                                            <th className="p-2.5 sm:px-4">Feature</th>
                                            <th className="p-2.5 sm:px-4 text-emerald-800 dark:text-brand-lime">Primitives (Stack)</th>
                                            <th className="p-2.5 sm:px-4 text-blue-700 dark:text-blue-300">Objects (Heap)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                        {content.comparisonTable.map((row, rIdx) => (
                                            <tr key={rIdx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <td className="p-2.5 sm:px-4 font-bold text-zinc-900 dark:text-zinc-100">{row.feature}</td>
                                                <td className="p-2.5 sm:px-4 text-zinc-700 dark:text-zinc-300">{row.primitive}</td>
                                                <td className="p-2.5 sm:px-4 text-zinc-700 dark:text-zinc-300">{row.object}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {/* 3. The Type Catalog */}
                {typeCatalog && (
                    <section id="sec-type-system" className="neo-card p-5 sm:p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-3 mb-5">
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Layers size={18} className="text-emerald-700 dark:text-brand-lime" />
                                {typeCatalog.headline}
                            </h3>
                            <span className="text-xs font-mono text-zinc-500 font-semibold hidden sm:inline">{typeCatalog.subheadline}</span>
                        </div>

                        {/* Primitives */}
                        <div className="mb-5">
                            <div className="flex items-center gap-2 mb-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-brand-lime"></span>
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
                                    {typeCatalog.primitives?.name || typeCatalog.kingdom1?.name}
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                                {(typeCatalog.primitives?.types || typeCatalog.kingdom1?.types || []).map((type, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono text-xs font-bold text-emerald-700 dark:text-brand-lime">{type.name}</span>
                                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold">{type.badge || `#${idx + 1}`}</span>
                                            </div>
                                            <div className="font-mono text-xs text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-black/70 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded mb-1.5 overflow-x-auto font-medium">
                                                {type.example}
                                            </div>
                                        </div>
                                        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 leading-snug">
                                            {type.explain}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Objects */}
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                                    {typeCatalog.objects?.name || typeCatalog.kingdom2?.name}
                                </h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                {(typeCatalog.objects?.types || typeCatalog.kingdom2?.types || []).map((type, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">{type.name}</span>
                                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">{type.badge || 'Ref'}</span>
                                            </div>
                                            <div className="font-mono text-xs text-zinc-900 dark:text-blue-200 bg-blue-50/70 dark:bg-black/70 border border-blue-200 dark:border-zinc-800 px-2 py-1 rounded mb-1.5 overflow-x-auto font-medium">
                                                {type.example}
                                            </div>
                                        </div>
                                        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 leading-snug">
                                            {type.explain}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* 4. The Interactive Memory Lab Studio */}
                <section ref={visualizerRef} id="sec-memory-lab" className="neo-card p-5 sm:p-6 border-2 flex flex-col shadow-xl" style={{ borderColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex flex-wrap items-center justify-between pb-3 border-b mb-5 gap-2" style={{ borderColor: 'var(--border-main)' }}>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold uppercase tracking-wider flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                                <Play size={16} className="text-emerald-700 dark:text-brand-lime" />
                                Interactive Memory Lab
                            </h3>
                            <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                Code on the left updates the Call Stack &amp; Memory Heap in real-time on the right.
                            </p>
                        </div>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-emerald-50 dark:bg-[rgba(var(--accent-main-rgb),0.1)] text-emerald-800 dark:text-brand-lime font-bold border border-emerald-300 dark:border-brand-lime/30">
                            LIVE STUDIO
                        </span>
                    </div>

                    {/* Step-by-Step Guided Stepper */}
                    {content?.stepperSteps && (
                        <div className="mb-5 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                                {content.stepperSteps.map((step, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setActiveStepperStep(idx);
                                            loadCodeAndVisualize(step.fullCode || step.code);
                                        }}
                                        className={`p-2 rounded-lg text-left border font-mono text-xs transition-all ${
                                            activeStepperStep === idx
                                                ? 'border-emerald-500 dark:border-brand-lime bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime font-bold shadow-sm'
                                                : 'border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900/40'
                                        }`}
                                    >
                                        <div className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Step {step.stepNumber}</div>
                                        <div className="truncate font-semibold">{step.label}</div>
                                    </button>
                                ))}
                            </div>

                            {content.stepperSteps[activeStepperStep] && (
                                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div className="space-y-1 flex-1">
                                        <div className="font-mono text-xs text-zinc-900 dark:text-green-300 bg-zinc-100 dark:bg-black/80 border border-zinc-300 dark:border-zinc-700 px-2 py-0.5 rounded inline-block font-semibold">
                                            {content.stepperSteps[activeStepperStep].code}
                                        </div>
                                        <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
                                            💡 {content.stepperSteps[activeStepperStep].explanation}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            disabled={activeStepperStep === 0}
                                            onClick={() => {
                                                const prev = activeStepperStep - 1;
                                                setActiveStepperStep(prev);
                                                loadCodeAndVisualize(content.stepperSteps[prev].fullCode || content.stepperSteps[prev].code);
                                            }}
                                            className="px-2.5 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 disabled:opacity-30 hover:border-emerald-500"
                                        >
                                            Prev
                                        </button>
                                        <button
                                            disabled={activeStepperStep === content.stepperSteps.length - 1}
                                            onClick={() => {
                                                const next = activeStepperStep + 1;
                                                setActiveStepperStep(next);
                                                loadCodeAndVisualize(content.stepperSteps[next].fullCode || content.stepperSteps[next].code);
                                            }}
                                            className="px-3 py-1 rounded bg-emerald-700 dark:bg-brand-lime text-white dark:text-black font-bold text-xs font-mono disabled:opacity-30 hover:opacity-90 flex items-center gap-1 shadow-sm"
                                        >
                                            Next <ArrowRight size={12} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Integrated 2-Column Split Workspace */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm h-[480px]" style={{ backgroundColor: 'var(--bg-surface)' }}>
                            <div className="px-3 py-2 border-b flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-brand-lime flex items-center gap-1">
                                    <Code size={13} /> CODE EDITOR
                                </span>
                                <span className="text-[11px] font-mono text-zinc-500">Edit &amp; click Run</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <CodeEditor initialCode={code} onRun={handleRun} />
                            </div>
                        </div>

                        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm h-[480px]" style={{ backgroundColor: 'var(--bg-main)' }}>
                            <div className="px-3 py-2 border-b flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1">
                                    <Database size={13} /> REALTIME MEMORY CANVAS
                                </span>
                                <span className="text-[11px] font-mono text-zinc-500">Live Stack &amp; Heap</span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <VisualizerCanvas topicId={topic.id} code={code} isRunning={isRunning} onCodeChange={loadCodeAndVisualize} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Production Traps */}
                {content?.goldenRules && (
                    <section id="sec-pitfalls" className="neo-card p-5 sm:p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-3 mb-4">
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <Sparkles size={17} className="text-emerald-700 dark:text-brand-lime" />
                                Common Traps &amp; Solutions
                            </h3>
                            <span className="text-xs font-mono text-zinc-500 font-semibold hidden sm:inline">Edge Cases</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {content.goldenRules.map((rule, idx) => (
                                <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h4 className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-brand-lime font-mono">
                                                {rule.title}
                                            </h4>
                                            <button
                                                onClick={() => loadCodeAndVisualize(rule.trapCode)}
                                                className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-brand-lime/10 border border-emerald-300 dark:border-brand-lime/40 text-emerald-800 dark:text-brand-lime hover:bg-emerald-700 hover:text-white dark:hover:bg-brand-lime dark:hover:text-black font-mono text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                                            >
                                                <Play size={10} /> Try
                                            </button>
                                        </div>

                                        <div className="rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-800 mb-2 bg-zinc-950">
                                            <SyntaxHighlighter
                                                language="javascript"
                                                style={vscDarkPlus}
                                                customStyle={{ margin: 0, padding: '10px 12px', background: 'transparent', fontSize: '11px' }}
                                            >
                                                {rule.trapCode}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>

                                    <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-1">
                                        💡 {rule.why}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 6. Quick Quiz */}
                {content?.quiz && (
                    <section id="sec-quiz" className="neo-card p-5 sm:p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-3 mb-4">
                            <h3 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <CheckSquare size={17} className="text-emerald-700 dark:text-brand-lime" />
                                Quick Knowledge Check
                            </h3>
                            <span className="text-xs font-mono text-zinc-500 font-semibold hidden sm:inline">2 Questions</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {content.quiz.map((q, qIdx) => {
                                const selectedOptionIdx = quizAnswers[q.id];
                                const hasAnswered = selectedOptionIdx !== undefined;

                                return (
                                    <div key={q.id} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                        <div>
                                            <div className="text-xs font-mono font-bold text-emerald-800 dark:text-brand-lime mb-1">
                                                Q{qIdx + 1}: {q.question}
                                            </div>

                                            {q.code && (
                                                <div className="rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-800 my-2 bg-zinc-950">
                                                    <SyntaxHighlighter
                                                        language="javascript"
                                                        style={vscDarkPlus}
                                                        customStyle={{ margin: 0, padding: '8px 12px', background: 'transparent', fontSize: '11px' }}
                                                    >
                                                        {q.code}
                                                    </SyntaxHighlighter>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {q.options.map((option, optIdx) => {
                                                    const isSelected = selectedOptionIdx === optIdx;
                                                    let btnStyle = 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-zinc-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-zinc-900/40';

                                                    if (hasAnswered) {
                                                        if (option.correct) {
                                                            btnStyle = 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold';
                                                        } else if (isSelected && !option.correct) {
                                                            btnStyle = 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-300 font-bold';
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={optIdx}
                                                            onClick={() => handleSelectQuizOption(q.id, optIdx)}
                                                            className={`p-2 rounded-lg border text-left font-mono text-xs transition-all flex items-center justify-between ${btnStyle}`}
                                                        >
                                                            <span>{option.text}</span>
                                                            {hasAnswered && option.correct && <CheckCircle2 size={14} className="text-emerald-600 dark:text-green-400 ml-1 shrink-0" />}
                                                            {hasAnswered && isSelected && !option.correct && <XCircle size={14} className="text-red-600 dark:text-red-400 ml-1 shrink-0" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {hasAnswered && (
                                            <div className={`mt-3 p-2.5 rounded-lg text-xs font-mono border ${
                                                q.options[selectedOptionIdx].correct 
                                                    ? 'border-emerald-400 bg-emerald-50 dark:bg-green-500/10 text-emerald-950 dark:text-green-300'
                                                    : 'border-amber-400 bg-amber-50 dark:bg-amber-500/10 text-amber-950 dark:text-amber-300'
                                            }`}>
                                                {q.options[selectedOptionIdx].correct ? '🎉 Correct: ' : '💡 '}
                                                {q.options[selectedOptionIdx].explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* 7. Memory Diagram & Use Cases */}
                {content?.memoryModel && (
                    <section className="neo-card p-5 sm:p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <h3 className="text-sm sm:text-base font-bold mb-3 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                            <Cpu size={16} className="text-emerald-700 dark:text-brand-lime" /> V8 Memory Layout
                        </h3>
                        <div className="prose dark:prose-invert max-w-none font-mono text-xs sm:text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content.memoryModel}
                            </ReactMarkdown>
                        </div>
                    </section>
                )}

                {/* Bottom Topic Pagination */}
                <div className="pt-6 border-t flex justify-between items-center gap-4" style={{ borderColor: 'var(--border-main)' }}>
                    {prevTopic ? (
                        <Link
                            href={`/jsviz/topic/${prevTopic.id}`}
                            className="neo-card p-4 flex flex-col items-start group text-left max-w-[48%] transition-transform hover:-translate-y-0.5"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <span className="text-xs font-mono font-bold text-zinc-500 flex items-center gap-1 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
                                <ArrowLeft size={12} /> PREVIOUS
                            </span>
                            <span className="text-sm font-bold truncate w-full mt-1 text-zinc-900 dark:text-zinc-100">
                                {prevTopic.title}
                            </span>
                        </Link>
                    ) : <div />}

                    {nextTopic ? (
                        <Link
                            href={`/jsviz/topic/${nextTopic.id}`}
                            className="neo-card p-4 flex flex-col items-end group text-right max-w-[48%] transition-transform hover:-translate-y-0.5"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <span className="text-xs font-mono font-bold text-zinc-500 flex items-center gap-1 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
                                NEXT <ArrowRight size={12} />
                            </span>
                            <span className="text-sm font-bold truncate w-full mt-1 text-zinc-900 dark:text-zinc-100">
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
