'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { topics, getTopicById } from '../data/topics';
import { getTopicContent } from '../data/topics/contents';
import CodeEditor from '../components/CodeEditor';
import VisualizerCanvas from '../components/VisualizerCanvas';
import useStore from '../store/useStore';
import { CheckSquare, Code, Lightbulb, BookOpen, Cpu, Layers, Copy, Check, ArrowLeft, ArrowRight, List } from 'lucide-react';

const Topic = ({ topicId: propTopicId }) => {
    const params = useParams();
    const router = useRouter();
    const id = propTopicId || (params ? params.id : '');

    const topic = getTopicById(id);
    const content = getTopicContent(id);
    const { markTopicCompleted, progress } = useStore();

    const [code, setCode] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [copiedIndex, setCopiedIndex] = useState(null);

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
            setCode(content?.examples?.[0]?.code || content?.syntax || '// No example code available');
            setActiveTab('overview');
        }
    }, [topic, content]);

    if (!topic) {
        return <div className="p-20 text-center font-mono" style={{ color: 'var(--text-main)' }}>ERROR: TOPIC_NOT_FOUND</div>;
    }

    const handleRun = (newCode) => {
        setCode(newCode);
        setIsRunning(true);
        setTimeout(() => setIsRunning(false), 100);
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCode(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="min-h-screen pt-16 flex flex-col" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* Header */}
            <div className="border-b border-brand-border bg-brand-black px-4 py-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/jsviz/learn" className="text-gray-400 hover:text-white p-1 rounded transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <span className="text-xs font-mono text-brand-lime uppercase tracking-widest">
                                Module {String(currentIndex + 1).padStart(2, '0')} // {topic.category}
                            </span>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{topic.title}</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => markTopicCompleted(topic.id)}
                            className={`neo-btn-secondary px-4 py-2 text-xs flex items-center gap-2 ${progress.completedTopics.includes(topic.id) ? 'border-brand-lime text-brand-lime' : ''
                                }`}
                        >
                            <CheckSquare size={14} />
                            {progress.completedTopics.includes(topic.id) ? 'COMPLETED' : 'MARK_COMPLETE'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Split Content */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* Left: Explanation & Visualization */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-brand-border gap-2 sm:gap-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`pb-3 text-xs sm:text-sm font-bold tracking-widest flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'overview'
                                    ? 'border-brand-lime text-brand-lime'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <BookOpen size={16} /> OVERVIEW
                        </button>
                        <button
                            onClick={() => setActiveTab('mental-model')}
                            className={`pb-3 text-xs sm:text-sm font-bold tracking-widest flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'mental-model'
                                    ? 'border-brand-lime text-brand-lime'
                                    : 'border-transparent text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            <Layers size={16} /> MENTAL_MODEL
                        </button>
                    </div>

                    {/* Tab 1: Overview & Content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-base sm:text-lg font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                    {topic.description}
                                </p>
                            </div>

                            {/* Main Explanation */}
                            {content?.explanation && (
                                <div className="neo-card p-6 border-l-4" style={{ borderLeftColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                                    <h3 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                        <Lightbulb size={20} className="text-brand-lime" /> Concept Deep-Dive
                                    </h3>
                                    <div className="font-mono text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-main)' }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {content.explanation}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {/* Code Examples Section */}
                            {content?.examples?.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                        <Code size={18} className="text-brand-lime" /> Code Examples
                                    </h3>

                                    <div className="space-y-6">
                                        {content.examples.map((ex, index) => (
                                            <div key={index} className="neo-card overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                                <div className="px-4 py-2 bg-brand-black border-b border-brand-border flex justify-between items-center">
                                                    <span className="text-xs font-mono text-gray-400 font-bold">// {ex.title}</span>
                                                    <button
                                                        onClick={() => handleCopy(ex.code, index)}
                                                        className="text-xs font-mono text-gray-400 hover:text-brand-lime flex items-center gap-1 transition-colors"
                                                    >
                                                        {copiedIndex === index ? <Check size={12} className="text-brand-lime" /> : <Copy size={12} />}
                                                        {copiedIndex === index ? 'COPIED & LOADED' : 'LOAD TO EDITOR'}
                                                    </button>
                                                </div>
                                                <div className="p-4 overflow-x-auto text-xs sm:text-sm bg-black">
                                                    <SyntaxHighlighter
                                                        language="javascript"
                                                        style={vscDarkPlus}
                                                        customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                                                    >
                                                        {ex.code}
                                                    </SyntaxHighlighter>
                                                </div>
                                                {ex.explanation && (
                                                    <div className="px-4 py-3 border-t border-brand-border text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                                        💡 {ex.explanation}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 2: Mental Model & Visualizer */}
                    {activeTab === 'mental-model' && (
                        <div className="space-y-8">
                            {content?.memoryModel && (
                                <div className="neo-card p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                    <h3 className="text-lg font-bold mb-4 uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                        <Cpu size={18} className="text-brand-lime" /> Memory Architecture & Engine Model
                                    </h3>
                                    <div className="font-mono text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {content.memoryModel}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {/* Interactive Simulation Canvas */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                                        <Layers size={18} className="text-brand-lime" /> Interactive Simulation
                                    </h3>
                                </div>

                                <div className="neo-card p-0 relative min-h-[400px] border-2 overflow-hidden" style={{ borderColor: 'var(--accent-main)', backgroundColor: 'var(--bg-surface)' }}>
                                    <VisualizerCanvas topicId={topic.id} code={code} isRunning={isRunning} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom Navigation */}
                    <div className="pt-12 border-t border-brand-border flex justify-between items-center gap-4">
                        {prevTopic ? (
                            <Link
                                href={`/jsviz/topic/${prevTopic.id}`}
                                className="flex flex-col items-start group text-left max-w-[45%]"
                            >
                                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 group-hover:text-brand-lime transition-colors">
                                    <ArrowLeft size={10} /> PREVIOUS_TOPIC
                                </span>
                                <span className="text-sm font-bold truncate w-full" style={{ color: 'var(--text-main)' }}>
                                    {prevTopic.title}
                                </span>
                            </Link>
                        ) : <div />}

                        {nextTopic ? (
                            <Link
                                href={`/jsviz/topic/${nextTopic.id}`}
                                className="flex flex-col items-end group text-right max-w-[45%]"
                            >
                                <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 group-hover:text-brand-lime transition-colors">
                                    NEXT_TOPIC <ArrowRight size={10} />
                                </span>
                                <span className="text-sm font-bold truncate w-full" style={{ color: 'var(--text-main)' }}>
                                    {nextTopic.title}
                                </span>
                            </Link>
                        ) : <div />}
                    </div>
                </div>

                {/* Right: Interactive Code Editor */}
                <div className="w-full lg:w-[500px] border-t lg:border-t-0 lg:border-l flex flex-col order-1 lg:order-2" style={{ borderColor: 'var(--border-main)', backgroundColor: '#1e1e1e', maxHeight: '600px', minHeight: '400px' }}>
                    <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-main)', backgroundColor: '#252526' }}>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Interactive Editor
                        </span>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <CodeEditor initialCode={code} onRun={handleRun} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topic;
