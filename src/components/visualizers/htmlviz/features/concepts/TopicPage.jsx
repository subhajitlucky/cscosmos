'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { htmlTags } from '../../data/html-tags';
import BoxModelVisualizer from './Visualizers/BoxModelVisualizer';
import { ArrowLeft, Code2, Sparkles } from 'lucide-react';

const VISUALIZERS = {
    'box-model': BoxModelVisualizer,
};

export default function TopicPage({ topicId: propTopicId }) {
    const params = useParams();
    const topicId = propTopicId || (params?.slug ? params.slug[1] : undefined);

    const tagData = htmlTags.find(t => t.id === topicId) || htmlTags.find(t => t.id === 'html');
    const Visualizer = VISUALIZERS[topicId];

    if (!tagData) return <div className="text-slate-900 dark:text-white p-8">Topic not found</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20 pt-6">
            <Link href="/html-cosmos/learn" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 mb-6 transition-colors group text-sm font-medium">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Concepts
            </Link>

            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-start gap-5 border-b border-slate-200 dark:border-slate-800 pb-6">
                    <div className="w-12 h-12 bg-lime-400/10 rounded-lg flex items-center justify-center shrink-0 border border-lime-400/20">
                        {tagData.icon && <tagData.icon className="text-lime-600 dark:text-lime-400" size={24} strokeWidth={2} />}
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-2">{tagData.tag}</h1>
                        <p className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                            {tagData.description}
                        </p>
                    </div>
                </div>

                {/* Explanation */}
                <div className="prose dark:prose-invert max-w-none">
                    <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {tagData.explanation}
                    </p>
                </div>

                {/* Real World Example */}
                {tagData.realWorld && (
                    <div className="mb-12">
                        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <span className="text-lime-600 dark:text-lime-400">✦</span> In The Wild
                        </h2>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 relative overflow-hidden group shadow-sm">
                            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${tagData.realWorld.color || 'from-lime-400 to-purple-600'}`} />

                            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-lime-600 dark:text-lime-400 uppercase tracking-wider mb-1">
                                        Seen in: {tagData.realWorld.app}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                        {tagData.realWorld.feature}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        {tagData.realWorld.description}
                                    </p>
                                </div>

                                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl">
                                    📱
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Interactive Visualizer Lab */}
                {Visualizer && (
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="text-lime-600 dark:text-lime-400" size={20} />
                            Interactive Lab
                        </h3>
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-lg">
                            <div className="p-6">
                                <Visualizer />
                            </div>
                        </div>
                    </div>
                )}

                {/* Live Code Example & Preview */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Code2 className="text-lime-600 dark:text-lime-400" size={20} />
                        Live Example & Code
                    </h3>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-lg ring-1 ring-black/5 dark:ring-white/5">

                        <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                <span className="text-xs font-mono font-bold uppercase tracking-wider">Preview Output</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-900 border-b border-slate-800">
                            <pre className="font-mono text-sm text-lime-400 overflow-x-auto">
                                <code>{tagData.exampleCode || "<!-- No example code -->"}</code>
                            </pre>
                        </div>

                        {tagData.exampleCode && (
                            <div className="relative group">
                                <div className="h-48 bg-white p-2">
                                    <iframe
                                        title="preview"
                                        srcDoc={tagData.exampleCode}
                                        className="w-full h-full border-none"
                                        sandbox="allow-scripts"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                            <Link
                                href="/html-cosmos/playground"
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-lime-400 text-slate-950 font-bold hover:bg-lime-300 text-sm transition-all duration-200"
                            >
                                <Code2 size={16} />
                                Open in Playground
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
