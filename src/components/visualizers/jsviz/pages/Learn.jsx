'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { topics } from '../data/topics';
import { CheckSquare, Search } from 'lucide-react';
import useStore from '../store/useStore';

const MODULE_SHORT_NAMES = [
    { id: 'all', label: 'All Modules (100)' },
    { id: 'Module 01: Types & Values', label: '01: Types' },
    { id: 'Module 02: Syntax, Operators & Control Flow', label: '02: Syntax' },
    { id: 'Module 03: Functions & Execution Context', label: '03: Functions' },
    { id: 'Module 04: Scopes, Closures & this Binding', label: '04: Closures' },
    { id: 'Module 05: Objects & Prototypal Inheritance', label: '05: Objects & OOP' },
    { id: 'Module 06: Collections & Binary Data', label: '06: Collections' },
    { id: 'Module 07: Iteration & Metaprogramming', label: '07: Iteration' },
    { id: 'Module 08: Asynchronous JavaScript & Event Loop', label: '08: Event Loop' },
    { id: 'Module 09: Async Patterns & Browser Web APIs', label: '09: Web APIs' },
    { id: 'Module 10: V8 Engine, Memory & Security', label: '10: V8 & Memory' },
];

const Learn = () => {
    const { progress } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredTopics = topics
        .filter(category => activeCategory === 'all' || category.title === activeCategory)
        .map(category => ({
            ...category,
            items: category.items.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }))
        .filter(category => category.items.length > 0);

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Strip */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 border-b border-brand-border pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-2" style={{ color: 'var(--text-main)' }}>
                            CURRICULUM
                        </h1>
                        <p className="font-mono text-xs sm:text-sm max-w-xl" style={{ color: 'var(--text-muted)' }}>
                            Structured 100-concept master roadmap. Primitives, closures, asynchronous runtime, and V8 internals.
                        </p>
                        <div className="flex items-center gap-2.5 mt-3">
                            <span className="text-xs font-mono px-2.5 py-1 rounded border border-emerald-300 dark:border-brand-lime/40 bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime font-bold">
                                100 CONCEPTS
                            </span>
                            <span className="text-xs sm:text-sm font-mono text-zinc-700 dark:text-zinc-300 font-medium">
                                {progress.completedTopics ? progress.completedTopics.length : 0} / 100 COMPLETED
                            </span>
                        </div>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="SEARCH_CONCEPTS..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full md:w-72 border border-brand-border px-3.5 py-2 font-mono text-xs focus:outline-none focus:border-brand-lime placeholder-gray-600 dark:placeholder-gray-400 transition-colors"
                                style={{ color: 'var(--text-main)', backgroundColor: 'var(--bg-surface)' }}
                            />
                            <Search className="absolute right-3 top-2.5 text-gray-500" size={15} />
                        </div>
                    </div>
                </div>

                {/* Quick-Jump / Module Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 custom-scrollbar">
                    {MODULE_SHORT_NAMES.map(mod => (
                        <button
                            key={mod.id}
                            onClick={() => setActiveCategory(mod.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                                activeCategory === mod.id
                                    ? 'border-emerald-600 dark:border-brand-lime bg-emerald-50 dark:bg-brand-lime/10 text-emerald-800 dark:text-brand-lime font-bold shadow-sm'
                                    : 'border-zinc-300 dark:border-brand-border text-zinc-700 dark:text-gray-300 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 bg-white dark:bg-transparent'
                            }`}
                        >
                            {mod.label}
                        </button>
                    ))}
                </div>

                {/* Modules & Compact Concept Cards Grid */}
                <div className="space-y-8 sm:space-y-10">
                    {filteredTopics.map((category) => (
                        <div key={category.title}>
                            <div className="flex items-center justify-between mb-3 border-b border-brand-border/40 pb-2">
                                <div className="flex items-center">
                                    <div className="w-2.5 h-2.5 bg-emerald-600 dark:bg-brand-lime mr-3 shadow-[0_0_8px_var(--accent-main)]"></div>
                                    <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-main)' }}>
                                        {category.title}
                                    </h2>
                                </div>
                                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 font-semibold">
                                    {category.items.length} Concepts
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
                                {category.items.map((topic, index) => {
                                    const isCompleted = progress.completedTopics.includes(topic.id);
                                    return (
                                        <Link
                                            key={topic.id}
                                            href={`/jsviz/topic/${topic.id}`}
                                            className="group neo-card p-3 sm:p-3.5 relative flex flex-col justify-between h-full min-h-[96px] hover:border-brand-lime transition-all duration-150"
                                        >
                                            <div>
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 font-bold">
                                                        #{String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    {isCompleted && (
                                                        <CheckSquare size={14} className="text-emerald-600 dark:text-brand-lime" />
                                                    )}
                                                </div>

                                                <h3 className="text-xs sm:text-sm font-semibold group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors leading-snug line-clamp-2" style={{ color: 'var(--text-main)' }}>
                                                    {topic.title}
                                                </h3>
                                            </div>

                                            <div className="w-full h-0.5 bg-brand-border mt-2.5 group-hover:bg-emerald-600 dark:group-hover:bg-brand-lime transition-colors"></div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredTopics.length === 0 && (
                        <div className="py-16 text-center border border-dashed border-brand-border">
                            <p className="text-gray-500 font-mono text-xs">NO_MODULES_OR_CONCEPTS_FOUND</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Learn;
