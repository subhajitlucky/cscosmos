'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { topics, getTopicById } from '../data/topics';
import { getTopicContent } from '../data/topics/contents';
import Sidebar from '../components/Sidebar';
import useStore from '../store/useStore';
import { DataTypesLesson } from '../components/lessons/DataTypesLesson';
import { WhatIsJsLesson } from '../components/lessons/WhatIsJsLesson';
import { RuntimeEnvironmentsLesson } from '../components/lessons/RuntimeEnvironmentsLesson';
import { EngineArchitectureLesson } from '../components/lessons/EngineArchitectureLesson';
import { SyntaxExpressionsLesson } from '../components/lessons/SyntaxExpressionsLesson';
import { TypeDetectionLesson } from '../components/lessons/TypeDetectionLesson';
import { JsConceptLesson } from '../components/lessons/JsConceptLesson';
import { 
    CheckSquare, ArrowLeft, ArrowRight, Menu, X,
    SlidersHorizontal, CheckCheck
} from 'lucide-react';

const Topic = ({ topicId: propTopicId }) => {
    const params = useParams();
    const id = propTopicId || (params ? params.id : '');

    const topic = getTopicById(id);
    const content = getTopicContent(id);
    const { markTopicCompleted, progress } = useStore();

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
                
                {id === 'what-is-javascript-history-evolution-ecmascript' ? (
                    <WhatIsJsLesson topic={topic} content={content} />
                ) : id === 'javascript-runtime-environments-browser-vs-nodejs' ? (
                    <RuntimeEnvironmentsLesson topic={topic} content={content} />
                ) : id === 'javascript-engine-architecture-execution' ? (
                    <EngineArchitectureLesson topic={topic} content={content} />
                ) : id === 'javascript-syntax-statements-expressions' ? (
                    <SyntaxExpressionsLesson topic={topic} content={content} />
                ) : id === 'data-types' || id === 'primitive-vs-non-primitive-data-types' ? (
                    <DataTypesLesson topic={topic} content={content} />
                ) : id === 'type-detection-typeof-instanceof-tostring' || id === 'typeof-detection' ? (
                    <TypeDetectionLesson topic={topic} content={content} />
                ) : (
                    <JsConceptLesson
                        topic={topic}
                        content={content}
                        conceptNumber={currentIndex + 1}
                    />
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
