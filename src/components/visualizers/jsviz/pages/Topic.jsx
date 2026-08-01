'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
    Check, ArrowLeft, ArrowRight, Menu, X 
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
        navigator.clipboard.writeText(text);
        setCode(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="min-h-screen pt-16 flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* Topic Header Bar */}
            <header 
                className="border-b px-4 py-3 sm:px-6 sticky top-16 z-20 backdrop-blur-md transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
            >
                <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-3">
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
                            className="p-2 rounded-lg border text-brand-lime hover:bg-brand-lime/10 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
                            style={{ borderColor: 'var(--border-main)' }}
                            title="Toggle All Topics Menu"
                        >
                            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
                            <span>All Topics</span>
                        </button>

                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-brand-lime uppercase tracking-widest font-bold">
                                    Module {String(currentIndex + 1).padStart(2, '0')} // {topic.category || 'Core JavaScript'}
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
                                    ? 'border-brand-lime text-brand-lime bg-brand-lime/10' 
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
                                Topics Catalog
                            </span>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded text-gray-400 hover:text-white">
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
            <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-10">
                {/* 1. Topic Objective Banner */}
                <div className="neo-card p-6 border-l-4" style={{ borderLeftColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={18} className="text-brand-lime" />
                        <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                            Module Objective
                        </h2>
                    </div>
                    <p className="text-sm sm:text-base font-mono leading-relaxed" style={{ color: 'var(--text-main)' }}>
                        {topic.description}
                    </p>
                </div>

                {/* 2. Interactive Mental Model Simulation Canvas (Full Width) */}
                <div className="neo-card p-6 border-2 flex flex-col overflow-hidden shadow-xl" style={{ borderColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                    <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: 'var(--border-main)' }}>
                        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                            <Layers size={18} className="text-brand-lime" /> Mental Model Realtime Simulation
                        </h3>
                        <span className="text-xs font-mono px-3 py-1 rounded bg-brand-lime/10 text-brand-lime font-bold">
                            INTERACTIVE_CANVAS
                        </span>
                    </div>

                    <div className="h-[340px] sm:h-[400px] w-full relative overflow-hidden rounded border" style={{ borderColor: 'var(--border-main)', backgroundColor: 'var(--bg-main)' }}>
                        <VisualizerCanvas topicId={topic.id} code={code} isRunning={isRunning} />
                    </div>
                </div>

                {/* 3. Sandboxed Interactive Code Execution Editor (Full Width) */}
                <div className="neo-card p-0 flex flex-col min-h-[450px] overflow-hidden shadow-xl" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <CodeEditor initialCode={code} onRun={handleRun} />
                </div>

                {/* 4. Detailed Concept Markdown Breakdown */}
                {content?.explanation && (
                    <div className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                            <Lightbulb size={20} className="text-brand-lime" /> Concept Deep-Dive
                        </h3>
                        <div className="prose dark:prose-invert max-w-none font-mono text-sm sm:text-base leading-relaxed space-y-4" style={{ color: 'var(--text-main)' }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content.explanation}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* 5. Practical Code Examples Section */}
                {content?.examples?.length > 0 && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                            <Code size={20} className="text-brand-lime" /> Practical Code Examples
                        </h3>

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
                                        <button
                                            onClick={() => handleCopy(ex.code, index)}
                                            className="text-xs font-mono font-bold text-brand-lime hover:opacity-80 flex items-center gap-1.5 transition-opacity bg-brand-lime/10 px-3 py-1.5 border border-brand-lime/30 rounded"
                                        >
                                            {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedIndex === index ? 'COPIED & LOADED' : 'LOAD TO EDITOR'}
                                        </button>
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

                {/* 6. Engine & Memory Architecture */}
                {content?.memoryModel && (
                    <div className="neo-card p-6 sm:p-8" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                            <Cpu size={20} className="text-brand-lime" /> Engine & Memory Architecture
                        </h3>
                        <div className="prose dark:prose-invert max-w-none font-mono text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-muted)' }}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content.memoryModel}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* 7. Bottom Topic Pagination */}
                <div className="pt-8 border-t flex justify-between items-center gap-4" style={{ borderColor: 'var(--border-main)' }}>
                    {prevTopic ? (
                        <Link
                            href={`/jsviz/topic/${prevTopic.id}`}
                            className="neo-card p-5 flex flex-col items-start group text-left max-w-[48%] transition-transform hover:-translate-y-1"
                            style={{ backgroundColor: 'var(--bg-surface)' }}
                        >
                            <span className="text-xs font-mono text-gray-400 flex items-center gap-1 group-hover:text-brand-lime transition-colors">
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
                            <span className="text-xs font-mono text-gray-400 flex items-center gap-1 group-hover:text-brand-lime transition-colors">
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
