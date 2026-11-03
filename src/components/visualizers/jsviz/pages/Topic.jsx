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
    Check, ArrowLeft, ArrowRight, Menu, X, Sparkles, Key,
    Box, CheckCircle2, XCircle, Play, AlertTriangle,
    Database, Compass, Terminal, ShieldAlert, CheckCheck, ListFilter
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
            const yOffset = -90; // offset for sticky header
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const architecture = content?.architecture || content?.analogy;
    const typeCatalog = content?.typeCatalog || content?.kingdoms;

    return (
        <div className="min-h-screen pt-16 flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* 1. Topic Sticky Header Bar */}
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
                        <ListFilter size={13} /> Jump to:
                    </span>
                    <button onClick={() => scrollToSection('sec-overview')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                        00. Overview
                    </button>
                    {architecture && (
                        <button onClick={() => scrollToSection('sec-architecture')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            01. Memory Architecture
                        </button>
                    )}
                    {typeCatalog && (
                        <button onClick={() => scrollToSection('sec-type-system')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            02. The Type System
                        </button>
                    )}
                    <button onClick={() => scrollToSection('sec-memory-lab')} className="px-2.5 py-1 rounded-md border border-emerald-500 dark:border-brand-lime bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime transition-colors font-bold flex items-center gap-1">
                        <Play size={10} /> 03. Interactive Memory Lab
                    </button>
                    {content?.goldenRules && (
                        <button onClick={() => scrollToSection('sec-pitfalls')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            04. Traps &amp; Solutions
                        </button>
                    )}
                    {content?.examples?.length > 0 && (
                        <button onClick={() => scrollToSection('sec-demonstrations')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            05. Demonstrations
                        </button>
                    )}
                    {content?.quiz && (
                        <button onClick={() => scrollToSection('sec-quiz')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            06. Quiz
                        </button>
                    )}
                    {content?.memoryModel && (
                        <button onClick={() => scrollToSection('sec-v8-internals')} className="px-2.5 py-1 rounded-md border border-zinc-300 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-brand-lime bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 transition-colors font-medium">
                            07. V8 Architecture
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

            {/* Main Content Body */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                
                {/* SECTION 0: Objective & Overview */}
                <section id="sec-overview" className="neo-card p-6 border-l-4" style={{ borderLeftColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                            <BookOpen size={18} className="text-emerald-700 dark:text-brand-lime" />
                            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
                                Core Objective &amp; First Principles
                            </h2>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-300 dark:border-brand-lime/40 bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime">
                                O(1) Stack Allocation
                            </span>
                            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300">
                                Dynamic Heap References
                            </span>
                        </div>
                    </div>
                    <p className="text-sm sm:text-base font-mono leading-relaxed text-zinc-800 dark:text-zinc-200">
                        {content?.definition || topic.description}
                    </p>
                </section>

                {/* SECTION 1: Architecture: Stack Allocation vs. Heap Allocation */}
                {architecture && (
                    <section id="sec-architecture" className="neo-card p-6 sm:p-8 border-2 border-brand-border/60" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    SECTION 01
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {architecture.headline}
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold hidden sm:inline">First-Principles Memory Mechanics</span>
                        </div>

                        <p className="text-sm sm:text-base font-mono leading-relaxed mb-6 text-zinc-800 dark:text-zinc-200">
                            {architecture.intro}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* The 7 Primitives (Pass-by-Value) */}
                            <div className="p-5 rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/20 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Cpu size={20} className="text-emerald-700 dark:text-brand-lime" />
                                            <h4 className="text-sm sm:text-base font-bold text-emerald-900 dark:text-brand-lime uppercase tracking-wider">
                                                {architecture.primitives.title}
                                            </h4>
                                        </div>
                                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime border border-emerald-300 dark:border-brand-lime/40">
                                            {architecture.primitives.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono leading-relaxed mb-4 text-zinc-800 dark:text-zinc-200">
                                        {architecture.primitives.description}
                                    </p>
                                    <div className="p-3.5 rounded-lg bg-emerald-100/80 dark:bg-zinc-900/90 border border-emerald-300 dark:border-brand-lime/30 font-mono text-xs sm:text-sm text-emerald-950 dark:text-brand-lime leading-relaxed mb-4">
                                        💡 <strong>Key Invariant:</strong> {architecture.primitives.punchline}
                                    </div>
                                </div>
                                <ul className="space-y-2 border-t border-emerald-200 dark:border-emerald-500/20 pt-3 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-300">
                                    {architecture.primitives.traits.map((t, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="text-emerald-600 dark:text-brand-lime font-bold">✔</span> {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Objects & Reference Types (Pass-by-Reference) */}
                            <div className="p-5 rounded-xl border border-blue-300 dark:border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/20 flex flex-col justify-between shadow-sm">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Database size={20} className="text-blue-600 dark:text-blue-400" />
                                            <h4 className="text-sm sm:text-base font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
                                                {architecture.objects.title}
                                            </h4>
                                        </div>
                                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-500/40">
                                            {architecture.objects.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono leading-relaxed mb-4 text-zinc-800 dark:text-zinc-200">
                                        {architecture.objects.description}
                                    </p>
                                    <div className="p-3.5 rounded-lg bg-blue-100/80 dark:bg-zinc-900/90 border border-blue-300 dark:border-blue-500/30 font-mono text-xs sm:text-sm text-blue-950 dark:text-blue-300 leading-relaxed mb-4">
                                        🔑 <strong>Key Invariant:</strong> {architecture.objects.punchline}
                                    </div>
                                </div>
                                <ul className="space-y-2 border-t border-blue-200 dark:border-blue-500/20 pt-3 text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-300">
                                    {architecture.objects.traits.map((t, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <span className="text-blue-600 dark:text-blue-400 font-bold">✔</span> {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Architectural Comparison Matrix */}
                        {content?.comparisonTable && (
                            <div className="mt-8 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/60 shadow-sm">
                                <div className="px-5 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex flex-wrap items-center justify-between gap-2">
                                    <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                        ⚡ Architectural Matrix: Primitives vs. Reference Types
                                    </span>
                                    <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-medium">Memory Allocation &amp; Mutation Semantics</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left font-mono text-xs sm:text-sm border-collapse">
                                        <thead>
                                            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/40 text-zinc-900 dark:text-zinc-100 font-bold">
                                                <th className="p-3.5 sm:px-5">Dimension</th>
                                                <th className="p-3.5 sm:px-5 text-emerald-800 dark:text-brand-lime">The 7 Primitives (Stack Allocated)</th>
                                                <th className="p-3.5 sm:px-5 text-blue-700 dark:text-blue-300">Objects &amp; References (Heap Allocated)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                            {content.comparisonTable.map((row, rIdx) => (
                                                <tr key={rIdx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                    <td className="p-3.5 sm:px-5 font-bold text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{row.feature}</td>
                                                    <td className="p-3.5 sm:px-5 text-zinc-700 dark:text-zinc-300">{row.primitive}</td>
                                                    <td className="p-3.5 sm:px-5 text-zinc-700 dark:text-zinc-300">{row.object}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* SECTION 2: The Complete Type System */}
                {typeCatalog && (
                    <section id="sec-type-system" className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    SECTION 02
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    {typeCatalog.headline}
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold hidden sm:inline">ECMAScript Type Specifications</span>
                        </div>

                        <p className="text-sm sm:text-base font-mono leading-relaxed mb-6 text-zinc-800 dark:text-zinc-200">
                            {typeCatalog.subheadline}
                        </p>

                        <div className="space-y-8">
                            {/* The 7 Primitives */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500 dark:bg-brand-lime"></span>
                                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
                                        {typeCatalog.primitives?.name || typeCatalog.kingdom1?.name}
                                    </h4>
                                    <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                        ({typeCatalog.primitives?.description || typeCatalog.kingdom1?.description})
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                                    {(typeCatalog.primitives?.types || typeCatalog.kingdom1?.types || []).map((type, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-700 dark:text-brand-lime">
                                                        {type.name}
                                                    </span>
                                                    <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">
                                                        {type.badge || `#${idx + 1}`}
                                                    </span>
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

                            {/* The Object Ecosystem */}
                            <div>
                                <div className="flex items-center gap-2.5 mb-3">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                    <h4 className="text-sm sm:text-base font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                                        {typeCatalog.objects?.name || typeCatalog.kingdom2?.name}
                                    </h4>
                                    <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-medium">
                                        ({typeCatalog.objects?.description || typeCatalog.kingdom2?.description})
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                    {(typeCatalog.objects?.types || typeCatalog.kingdom2?.types || []).map((type, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-mono text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300">
                                                        {type.name}
                                                    </span>
                                                    <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                                                        {type.badge || 'Reference'}
                                                    </span>
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
                    </section>
                )}

                {/* SECTION 3: The Unified Interactive Memory Lab Studio */}
                <section ref={visualizerRef} id="sec-memory-lab" className="neo-card p-6 border-2 flex flex-col shadow-xl" style={{ borderColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex flex-wrap items-center justify-between pb-4 border-b mb-6 gap-3" style={{ borderColor: 'var(--border-main)' }}>
                        <div className="flex items-center gap-2.5">
                            <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                SECTION 03
                            </span>
                            <div>
                                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                                    <Layers size={18} className="text-emerald-700 dark:text-brand-lime" />
                                    Interactive Memory Lab Studio
                                </h3>
                                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                    Live code execution paired directly with real-time Call Stack &amp; Memory Heap simulation
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-mono px-3 py-1 rounded bg-emerald-50 dark:bg-[rgba(var(--accent-main-rgb),0.1)] text-emerald-800 dark:text-brand-lime font-bold border border-emerald-300 dark:border-brand-lime/30">
                            LIVE_SIMULATOR
                        </span>
                    </div>

                    {/* Step-by-Step Guided Stepper */}
                    {content?.stepperSteps && (
                        <div className="mb-6 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <Play size={16} className="text-emerald-700 dark:text-brand-lime" />
                                    <h4 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-emerald-800 dark:text-brand-lime">
                                        Guided Memory Allocation Stepper:
                                    </h4>
                                </div>
                                <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold">
                                    Step {activeStepperStep + 1} of {content.stepperSteps.length}
                                </span>
                            </div>

                            {/* Stepper Tabs */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
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
                                        <div className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">Step {step.stepNumber}</div>
                                        <div className="truncate font-semibold mt-0.5">{step.label.split(' ')[0]} {step.label.split(' ')[1] || ''}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Active Step Information */}
                            {content.stepperSteps[activeStepperStep] && (
                                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                    <div className="space-y-1.5 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold font-mono text-emerald-800 dark:text-brand-lime">
                                                Active Instruction ({content.stepperSteps[activeStepperStep].label}):
                                            </span>
                                        </div>
                                        <div className="font-mono text-xs sm:text-sm text-zinc-900 dark:text-green-300 bg-zinc-100 dark:bg-black/80 border border-zinc-300 dark:border-zinc-700 px-3 py-1 rounded-md inline-block font-semibold">
                                            {content.stepperSteps[activeStepperStep].code}
                                        </div>
                                        <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                            💡 {content.stepperSteps[activeStepperStep].explanation}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
                                        <button
                                            disabled={activeStepperStep === 0}
                                            onClick={() => {
                                                const prev = activeStepperStep - 1;
                                                setActiveStepperStep(prev);
                                                loadCodeAndVisualize(content.stepperSteps[prev].fullCode || content.stepperSteps[prev].code);
                                            }}
                                            className="px-3 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 disabled:opacity-30 hover:border-emerald-500 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={activeStepperStep === content.stepperSteps.length - 1}
                                            onClick={() => {
                                                const next = activeStepperStep + 1;
                                                setActiveStepperStep(next);
                                                loadCodeAndVisualize(content.stepperSteps[next].fullCode || content.stepperSteps[next].code);
                                            }}
                                            className="px-3.5 py-1 rounded bg-emerald-700 dark:bg-brand-lime text-white dark:text-black font-bold text-xs font-mono disabled:opacity-30 hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm"
                                        >
                                            Next Step <ArrowRight size={13} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Integrated 2-Column Split Workspace */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                        {/* Left: Code Editor Sandbox */}
                        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm h-[520px]" style={{ backgroundColor: 'var(--bg-surface)' }}>
                            <div className="px-4 py-2.5 border-b flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-brand-lime flex items-center gap-1.5">
                                    <Code size={14} /> LIVE CODE EDITOR
                                </span>
                                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                                    Edit code &amp; click Run
                                </span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <CodeEditor initialCode={code} onRun={handleRun} />
                            </div>
                        </div>

                        {/* Right: Realtime Stack & Heap Visualizer */}
                        <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm h-[520px]" style={{ backgroundColor: 'var(--bg-main)' }}>
                            <div className="px-4 py-2.5 border-b flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                                    <Layers size={14} /> REALTIME MEMORY CANVAS
                                </span>
                                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                                    Live Stack &amp; Heap State
                                </span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <VisualizerCanvas topicId={topic.id} code={code} isRunning={isRunning} onCodeChange={loadCodeAndVisualize} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: Production Pitfalls & Traps */}
                {content?.goldenRules && (
                    <section id="sec-pitfalls" className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    SECTION 04
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Production Pitfalls &amp; Solutions
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold hidden sm:inline">Engine Edge Cases &amp; Best Practices</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {content.goldenRules.map((rule, idx) => (
                                <div key={idx} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                                            <h4 className="text-sm font-bold text-emerald-800 dark:text-brand-lime font-mono">
                                                {rule.title}
                                            </h4>
                                            <button
                                                onClick={() => loadCodeAndVisualize(rule.trapCode)}
                                                className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-brand-lime/10 border border-emerald-300 dark:border-brand-lime/40 text-emerald-800 dark:text-brand-lime hover:bg-emerald-700 hover:text-white dark:hover:bg-brand-lime dark:hover:text-black font-mono text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                                            >
                                                <Play size={11} /> Load in Lab
                                            </button>
                                        </div>

                                        <div className="rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-800 mb-3 bg-zinc-950">
                                            <SyntaxHighlighter
                                                language="javascript"
                                                style={vscDarkPlus}
                                                customStyle={{ margin: 0, padding: '12px 14px', background: 'transparent', fontSize: '12px' }}
                                            >
                                                {rule.trapCode}
                                            </SyntaxHighlighter>
                                        </div>
                                    </div>

                                    <p className="text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200 leading-relaxed border-t border-zinc-200 dark:border-zinc-800/80 pt-3 mt-2">
                                        💡 <strong className="text-zinc-900 dark:text-zinc-100">Why this happens:</strong> {rule.why}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION 5: Comprehensive Code Demonstrations */}
                {content?.examples?.length > 0 && (
                    <section id="sec-demonstrations" className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    SECTION 05
                                </span>
                                <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                    <Code size={20} className="text-emerald-700 dark:text-brand-lime" /> Comprehensive Code Demonstrations
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold">{content.examples.length} Deep Dives</span>
                        </div>

                        <div className="space-y-6">
                            {content.examples.map((ex, index) => (
                                <div key={index} className="neo-card overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                    <div 
                                        className="px-5 py-3 border-b flex justify-between items-center"
                                        style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-main)' }}
                                    >
                                        <span className="text-xs sm:text-sm font-mono font-bold text-zinc-800 dark:text-zinc-200">
                                            // {ex.title || `Demonstration ${index + 1}`}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => loadCodeAndVisualize(ex.code)}
                                                className="text-xs font-mono font-bold text-emerald-800 dark:text-brand-lime hover:bg-emerald-700 hover:text-white dark:hover:bg-brand-lime dark:hover:text-black transition-colors bg-emerald-50 dark:bg-[rgba(var(--accent-main-rgb),0.1)] px-3 py-1.5 border border-emerald-300 dark:border-brand-lime/30 rounded-lg flex items-center gap-1.5"
                                            >
                                                <Play size={12} /> RUN IN LAB
                                            </button>
                                            <button
                                                onClick={() => handleCopy(ex.code, index)}
                                                className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-opacity px-2.5 py-1.5 border border-zinc-300 dark:border-brand-border rounded-lg"
                                                title="Copy code to clipboard"
                                            >
                                                {copiedIndex === index ? <Check size={14} className="text-emerald-700 dark:text-brand-lime" /> : <Copy size={14} />}
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
                    </section>
                )}

                {/* SECTION 6: Diagnostic Technical Quiz */}
                {content?.quiz && (
                    <section id="sec-quiz" className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center justify-between border-b border-brand-border/50 pb-4 mb-6">
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                    SECTION 06
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                                    Knowledge Check: Diagnostic Technical Quiz
                                </h3>
                            </div>
                            <span className="text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400 font-semibold hidden sm:inline">Self-Assessment</span>
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

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
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
                                                {q.options[selectedOptionIdx].correct ? '🎉 Correct: ' : '💡 Explanation: '}
                                                {q.options[selectedOptionIdx].explanation}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* SECTION 7: V8 Engine & Hardware Architecture */}
                {content?.memoryModel && (
                    <section id="sec-v8-internals" className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-1 rounded bg-emerald-100 dark:bg-brand-lime/10 border border-emerald-400 dark:border-brand-lime text-emerald-800 dark:text-brand-lime">
                                SECTION 07
                            </span>
                            <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                <Cpu size={20} className="text-emerald-700 dark:text-brand-lime" /> V8 Engine Hardware Memory Model
                            </h3>
                        </div>
                        <div className="prose dark:prose-invert max-w-none font-mono text-sm sm:text-base leading-relaxed space-y-3 text-zinc-800 dark:text-zinc-200">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content.memoryModel}
                            </ReactMarkdown>
                        </div>
                    </section>
                )}

                {/* SECTION 8: Production Use Cases */}
                {content?.useCases && content.useCases.length > 0 && (
                    <section className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                            <Sparkles size={20} className="text-emerald-700 dark:text-brand-lime" /> Practical Engineering Use Cases
                        </h3>
                        <ul className="space-y-3 font-mono text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
                            {content.useCases.map((useCase, idx) => (
                                <li key={idx} className="flex items-start gap-2.5">
                                    <span className="text-emerald-700 dark:text-brand-lime font-bold mt-0.5 select-none">❯</span>
                                    <div className="leading-relaxed">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: ({ children }) => <span>{children}</span> }}>
                                            {useCase}
                                        </ReactMarkdown>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {/* SECTION 9: Bottom Topic Pagination */}
                <div className="pt-8 border-t flex justify-between items-center gap-4" style={{ borderColor: 'var(--border-main)' }}>
                    {prevTopic ? (
                        <Link
                            href={`/jsviz/topic/${prevTopic.id}`}
                            className="neo-card p-5 flex flex-col items-start group text-left max-w-[48%] transition-transform hover:-translate-y-1"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
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
                            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-600 dark:text-zinc-400 flex items-center gap-1 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
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
