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
    CheckCircle2, XCircle, Play, Database, AlertTriangle,
    SlidersHorizontal, CheckCheck
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

    // Segmented tab state for enhanced topics
    const [activeTab, setActiveTab] = useState('studio'); // 'studio' | 'matrix' | 'traps'

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
    };

    const loadCodeAndVisualize = (customCode, targetTab = 'studio') => {
        setCode(customCode);
        setIsRunning(true);
        if (targetTab) {
            setActiveTab(targetTab);
        }
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

    const architecture = content?.architecture || content?.analogy;
    const typeCatalog = content?.typeCatalog || content?.kingdoms;
    const hasTabs = Boolean(architecture || typeCatalog || content?.goldenRules);

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
                                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-brand-lime uppercase tracking-wider">
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

            {/* Main Content Workspace */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 space-y-6">
                
                {/* 1. Sleek 1-Liner Concept Strip */}
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-brand-lime shrink-0"></div>
                        <p className="text-xs sm:text-sm font-mono text-zinc-800 dark:text-zinc-200 leading-snug">
                            {content?.definition || topic.description}
                        </p>
                    </div>

                    {/* Segmented Tab Controls (Linear/Apple-style) */}
                    {hasTabs && (
                        <div className="flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-black/60 border border-zinc-200 dark:border-zinc-800 shrink-0 self-stretch sm:self-auto overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('studio')}
                                className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                    activeTab === 'studio'
                                        ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-xs font-bold'
                                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                                }`}
                            >
                                <Play size={12} className={activeTab === 'studio' ? 'text-emerald-600 dark:text-brand-lime' : ''} />
                                <span>Memory Studio</span>
                            </button>

                            {typeCatalog && (
                                <button
                                    onClick={() => setActiveTab('matrix')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                        activeTab === 'matrix'
                                            ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-xs font-bold'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    <Layers size={12} className={activeTab === 'matrix' ? 'text-emerald-600 dark:text-brand-lime' : ''} />
                                    <span>Type Matrix</span>
                                </button>
                            )}

                            {content?.goldenRules && (
                                <button
                                    onClick={() => setActiveTab('traps')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                                        activeTab === 'traps'
                                            ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 shadow-xs font-bold'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    <AlertTriangle size={12} className={activeTab === 'traps' ? 'text-amber-500' : ''} />
                                    <span>Traps &amp; Quiz</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* TAB 1: MEMORY STUDIO (DEFAULT HERO VIEW) */}
                {(activeTab === 'studio' || !hasTabs) && (
                    <div ref={visualizerRef} className="space-y-4">
                        {/* 4-Step Walkthrough Bar */}
                        {content?.stepperSteps && (
                            <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                                    <span className="text-[11px] font-mono text-zinc-500 font-bold uppercase mr-1">Steps:</span>
                                    {content.stepperSteps.map((step, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setActiveStepperStep(idx);
                                                loadCodeAndVisualize(step.fullCode || step.code, 'studio');
                                            }}
                                            className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all border ${
                                                activeStepperStep === idx
                                                    ? 'border-emerald-500 dark:border-brand-lime bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime font-bold shadow-xs'
                                                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900/40'
                                            }`}
                                        >
                                            <span className="opacity-60 mr-1">0{step.stepNumber}.</span>
                                            {step.label}
                                        </button>
                                    ))}
                                </div>

                                {content.stepperSteps[activeStepperStep] && (
                                    <div className="flex items-center gap-2 justify-between md:justify-end text-xs font-mono border-t md:border-t-0 pt-2 md:pt-0 border-zinc-200 dark:border-zinc-800">
                                        <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-xs sm:max-w-md">
                                            {content.stepperSteps[activeStepperStep].explanation}
                                        </span>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                disabled={activeStepperStep === 0}
                                                onClick={() => {
                                                    const prev = activeStepperStep - 1;
                                                    setActiveStepperStep(prev);
                                                    loadCodeAndVisualize(content.stepperSteps[prev].fullCode || content.stepperSteps[prev].code, 'studio');
                                                }}
                                                className="px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-bold disabled:opacity-30"
                                            >
                                                Prev
                                            </button>
                                            <button
                                                disabled={activeStepperStep === content.stepperSteps.length - 1}
                                                onClick={() => {
                                                    const next = activeStepperStep + 1;
                                                    setActiveStepperStep(next);
                                                    loadCodeAndVisualize(content.stepperSteps[next].fullCode || content.stepperSteps[next].code, 'studio');
                                                }}
                                                className="px-2.5 py-0.5 rounded bg-emerald-600 dark:bg-brand-lime text-white dark:text-black text-xs font-bold disabled:opacity-30 flex items-center gap-1"
                                            >
                                                Next <ArrowRight size={11} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Split Code Editor & Realtime Memory Canvas */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
                            {/* Editor */}
                            <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs h-[480px]" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                <div className="px-3.5 py-2 border-b flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                    <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                                        <Code size={13} className="text-emerald-600 dark:text-brand-lime" />
                                        JavaScript Source
                                    </span>
                                    <span className="text-[11px] font-mono text-zinc-500">Edit code &amp; click Run</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <CodeEditor initialCode={code} onRun={handleRun} />
                                </div>
                            </div>

                            {/* Canvas */}
                            <div className="flex flex-col border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-xs h-[480px]" style={{ backgroundColor: 'var(--bg-main)' }}>
                                <div className="px-3.5 py-2 border-b flex justify-between items-center bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                                    <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                                        <Database size={13} className="text-blue-600 dark:text-blue-400" />
                                        Memory Inspector (Stack &amp; Heap)
                                    </span>
                                    <span className="text-[11px] font-mono text-zinc-500">Live Engine State</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <VisualizerCanvas topicId={topic.id} code={code} isRunning={isRunning} onCodeChange={loadCodeAndVisualize} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: TYPE MATRIX & MEMORY ARCHITECTURE */}
                {activeTab === 'matrix' && typeCatalog && (
                    <div className="space-y-6">
                        {/* Stack vs Heap Architectural Card */}
                        {architecture && (
                            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="p-4 rounded-lg border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-mono text-xs font-bold uppercase text-emerald-900 dark:text-brand-lime">
                                                {architecture.primitives.title}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-brand-lime/20 text-emerald-800 dark:text-brand-lime">
                                                {architecture.primitives.badge}
                                            </span>
                                        </div>
                                        <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                            {architecture.primitives.description}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-lg border border-blue-300 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-mono text-xs font-bold uppercase text-blue-900 dark:text-blue-300">
                                                {architecture.objects.title}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300">
                                                {architecture.objects.badge}
                                            </span>
                                        </div>
                                        <p className="text-xs font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">
                                            {architecture.objects.description}
                                        </p>
                                    </div>
                                </div>

                                {content?.comparisonTable && (
                                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                                        <table className="w-full text-left font-mono text-xs border-collapse">
                                            <thead>
                                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold">
                                                    <th className="p-2 sm:px-3.5">Property</th>
                                                    <th className="p-2 sm:px-3.5 text-emerald-800 dark:text-brand-lime">Primitives (Stack)</th>
                                                    <th className="p-2 sm:px-3.5 text-blue-700 dark:text-blue-300">Objects (Heap)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                                {content.comparisonTable.map((row, rIdx) => (
                                                    <tr key={rIdx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                                                        <td className="p-2 sm:px-3.5 font-bold text-zinc-900 dark:text-zinc-100">{row.feature}</td>
                                                        <td className="p-2 sm:px-3.5 text-zinc-700 dark:text-zinc-300">{row.primitive}</td>
                                                        <td className="p-2 sm:px-3.5 text-zinc-700 dark:text-zinc-300">{row.object}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* The 7 Primitives & Reference Types */}
                        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-5">
                            <div>
                                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-brand-lime uppercase tracking-wider block mb-2.5">
                                    The 7 Primitive Types
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                                    {(typeCatalog.primitives?.types || typeCatalog.kingdom1?.types || []).map((type, idx) => (
                                        <div key={idx} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100">{type.name}</span>
                                                    <span className="text-[10px] font-mono text-zinc-500">{type.badge || `#${idx + 1}`}</span>
                                                </div>
                                                <div className="font-mono text-xs text-zinc-800 dark:text-zinc-200 bg-white dark:bg-black/60 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded mb-1.5 overflow-x-auto">
                                                    {type.example}
                                                </div>
                                            </div>
                                            <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                                                {type.explain}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider block mb-2.5">
                                    Reference Types
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {(typeCatalog.objects?.types || typeCatalog.kingdom2?.types || []).map((type, idx) => (
                                        <div key={idx} className="p-3 rounded-lg border border-blue-200 dark:border-blue-900/40 bg-blue-50/20 dark:bg-zinc-900/40 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">{type.name}</span>
                                                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">{type.badge || 'Ref'}</span>
                                                </div>
                                                <div className="font-mono text-xs text-zinc-800 dark:text-blue-200 bg-white dark:bg-black/60 border border-blue-200 dark:border-zinc-800 px-2 py-0.5 rounded mb-1.5 overflow-x-auto">
                                                    {type.example}
                                                </div>
                                            </div>
                                            <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
                                                {type.explain}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ASCII Architecture */}
                        {content?.memoryModel && (
                            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
                                <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-2">
                                    V8 Memory Layout
                                </span>
                                <div className="prose dark:prose-invert max-w-none font-mono text-xs leading-relaxed text-zinc-800 dark:text-zinc-200">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {content.memoryModel}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: TRAPS & QUIZ */}
                {activeTab === 'traps' && content?.goldenRules && (
                    <div className="space-y-6">
                        {/* 2 Common Traps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {content.goldenRules.map((rule, idx) => (
                                <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                                                {rule.title}
                                            </h4>
                                            <button
                                                onClick={() => loadCodeAndVisualize(rule.trapCode, 'studio')}
                                                className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-brand-lime/10 border border-emerald-300 dark:border-brand-lime/40 text-emerald-800 dark:text-brand-lime hover:bg-emerald-600 hover:text-white dark:hover:bg-brand-lime dark:hover:text-black font-mono text-[11px] font-bold transition-all flex items-center gap-1 shrink-0"
                                            >
                                                <Play size={10} /> Try in Studio
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

                                    <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 leading-relaxed border-t border-zinc-200 dark:border-zinc-800 pt-2">
                                        {rule.why}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Quick Quiz */}
                        {content?.quiz && (
                            <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs">
                                <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-3">
                                    Quick Knowledge Check
                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {content.quiz.map((q, qIdx) => {
                                        const selectedOptionIdx = quizAnswers[q.id];
                                        const hasAnswered = selectedOptionIdx !== undefined;

                                        return (
                                            <div key={q.id} className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col justify-between">
                                                <div>
                                                    <div className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                                                        Q{qIdx + 1}: {q.question}
                                                    </div>

                                                    {q.code && (
                                                        <div className="rounded-md overflow-hidden border border-zinc-300 dark:border-zinc-800 my-2 bg-zinc-950">
                                                            <SyntaxHighlighter
                                                                language="javascript"
                                                                style={vscDarkPlus}
                                                                customStyle={{ margin: 0, padding: '8px 10px', background: 'transparent', fontSize: '11px' }}
                                                            >
                                                                {q.code}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                                        {q.options.map((option, optIdx) => {
                                                            const isSelected = selectedOptionIdx === optIdx;
                                                            let btnStyle = 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900/60';

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
                                                                    className={`p-2 rounded border text-left font-mono text-xs transition-all flex items-center justify-between ${btnStyle}`}
                                                                >
                                                                    <span>{option.text}</span>
                                                                    {hasAnswered && option.correct && <CheckCircle2 size={13} className="text-emerald-600 dark:text-green-400 ml-1 shrink-0" />}
                                                                    {hasAnswered && isSelected && !option.correct && <XCircle size={13} className="text-red-600 dark:text-red-400 ml-1 shrink-0" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {hasAnswered && (
                                                    <div className={`mt-2.5 p-2 rounded text-[11px] font-mono border ${
                                                        q.options[selectedOptionIdx].correct 
                                                            ? 'border-emerald-400 bg-emerald-50 dark:bg-green-500/10 text-emerald-950 dark:text-green-300'
                                                            : 'border-amber-400 bg-amber-50 dark:bg-amber-500/10 text-amber-950 dark:text-amber-300'
                                                    }`}>
                                                        {q.options[selectedOptionIdx].explanation}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom Topic Pagination */}
                <div className="pt-4 border-t flex justify-between items-center gap-4" style={{ borderColor: 'var(--border-main)' }}>
                    {prevTopic ? (
                        <Link
                            href={`/jsviz/topic/${prevTopic.id}`}
                            className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col items-start group text-left max-w-[48%] transition-transform hover:-translate-y-0.5"
                        >
                            <span className="text-[11px] font-mono font-bold text-zinc-500 flex items-center gap-1 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
                                <ArrowLeft size={11} /> PREVIOUS
                            </span>
                            <span className="text-xs font-bold truncate w-full mt-0.5 text-zinc-900 dark:text-zinc-100">
                                {prevTopic.title}
                            </span>
                        </Link>
                    ) : <div />}

                    {nextTopic ? (
                        <Link
                            href={`/jsviz/topic/${nextTopic.id}`}
                            className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 flex flex-col items-end group text-right max-w-[48%] transition-transform hover:-translate-y-0.5"
                        >
                            <span className="text-[11px] font-mono font-bold text-zinc-500 flex items-center gap-1 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
                                NEXT <ArrowRight size={11} />
                            </span>
                            <span className="text-xs font-bold truncate w-full mt-0.5 text-zinc-900 dark:text-zinc-100">
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
