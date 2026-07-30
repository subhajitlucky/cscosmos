'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { htmlTags } from '../../data/html-tags';
import BoxModelVisualizer from './Visualizers/BoxModelVisualizer';
import { ArrowLeft, Code2, BookOpen, Sparkles } from 'lucide-react';

const VISUALIZERS = {
    'box-model': BoxModelVisualizer,
};

export default function TopicPage({ topicId: propTopicId }) {
    const params = useParams();
    const topicId = propTopicId || (params?.topicId);

    const tagData = htmlTags.find(t => t.id === topicId) || htmlTags.find(t => t.id === 'html');
    const Visualizer = VISUALIZERS[topicId];

    if (!tagData) return <div className="text-white">Topic not found</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20 pt-6">
            <Link href="/html-cosmos/learn" className="inline-flex items-center gap-2 text-slate-400 hover:text-lime-400 mb-6 transition-colors group text-sm font-medium">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Concepts
            </Link>

            <div className="space-y-8">
                <div className="flex items-start gap-5 border-b border-slate-800 pb-6">
                    <div className="w-12 h-12 bg-lime-400/10 rounded-lg flex items-center justify-center shrink-0 border border-lime-400/20">
                        <tagData.icon className="text-lime-400" size={24} strokeWidth={2} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-tight mb-2">{tagData.tag}</h1>
                        <p className="text-lg text-slate-300 font-medium">
                            {tagData.description}
                        </p>
                    </div>
                </div>

                {Visualizer && (
                    <div className="my-8">
                        <Visualizer />
                    </div>
                )}

                {tagData.content && (
                    <div className="space-y-6 text-slate-300 leading-relaxed font-sans">
                        {tagData.content.overview && (
                            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <BookOpen size={20} className="text-lime-400" /> Overview
                                </h2>
                                <p>{tagData.content.overview}</p>
                            </section>
                        )}

                        {tagData.content.syntax && (
                            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <Code2 size={20} className="text-lime-400" /> Syntax & Code Example
                                </h2>
                                <pre className="bg-slate-950 text-lime-400 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-slate-800">
                                    <code>{tagData.content.syntax}</code>
                                </pre>
                            </section>
                        )}

                        {tagData.content.ariaNotes && (
                            <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <Sparkles size={20} className="text-lime-400" /> Accessibility & ARIA Guidelines
                                </h2>
                                <p>{tagData.content.ariaNotes}</p>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
