'use client';

import React from 'react';
import Link from 'next/link';
import { topics } from '../data/topics';
import { BookOpen, CheckSquare, Search } from 'lucide-react';
import useStore from '../store/useStore';

const Learn = () => {
    const { progress } = useStore();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredTopics = topics.map(category => ({
        ...category,
        items: category.items.filter(item =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.items.length > 0);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-brand-border pb-8">
                    <div>
                        <h1 className="text-5xl font-bold tracking-tighter mb-4" style={{ color: 'var(--text-main)' }}>
                            CURRICULUM
                        </h1>
                        <p className="font-mono max-w-xl" style={{ color: 'var(--text-muted)' }}>
                            Structured 100-concept learning path. From primitives and engine mechanics to modern async architecture.
                        </p>
                        <div className="flex items-center gap-3 mt-4">
                            <span className="text-xs font-mono px-2.5 py-1 rounded border border-brand-lime/40 bg-brand-lime/10 text-brand-lime font-bold">
                                100 CONCEPTS
                            </span>
                            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                                {progress.completedTopics ? progress.completedTopics.length : 0} / 100 COMPLETED
                            </span>
                        </div>
                    </div>

                    <div className="w-full md:w-auto mt-8 md:mt-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="SEARCH_MODULES..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-80 border border-brand-border px-4 py-3 font-mono text-sm focus:outline-none focus:border-brand-lime placeholder-gray-600 dark:placeholder-gray-400 transition-colors"
                                style={{ color: 'var(--text-main)', backgroundColor: 'var(--bg-surface)' }}
                            />
                            <Search className="absolute right-3 top-3 text-gray-500" size={18} />
                        </div>
                    </div>
                </div>

                <div className="space-y-16">
                    {filteredTopics.map((category) => (
                        <div key={category.title}>
                            <div className="flex items-center mb-8">
                                <div className="w-3 h-3 bg-brand-lime mr-4 shadow-[0_0_10px_var(--accent-main)]"></div>
                                <h2 className="text-2xl font-bold uppercase tracking-widest" style={{ color: 'var(--text-main)' }}>{category.title}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.items.map((topic, index) => {
                                    const isCompleted = progress.completedTopics.includes(topic.id);
                                    return (
                                        <Link
                                            key={topic.id}
                                            href={`/jsviz/topic/${topic.id}`}
                                            className="group neo-card p-5 relative flex flex-col justify-between h-full"
                                        >
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    {isCompleted && (
                                                        <CheckSquare size={18} className="text-brand-lime" />
                                                    )}
                                                </div>

                                                <h3 className="text-base sm:text-lg font-bold group-hover:text-brand-lime transition-colors leading-snug" style={{ color: 'var(--text-main)' }}>
                                                    {topic.title}
                                                </h3>
                                            </div>

                                            <div className="w-full h-1 bg-brand-border mt-4 group-hover:bg-brand-lime transition-colors"></div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredTopics.length === 0 && (
                        <div className="py-20 text-center border border-dashed border-brand-border">
                            <p className="text-gray-600 dark:text-gray-400 font-mono">NO_MODULES_FOUND</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Learn;
