'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { topics } from '../data/topics';
import { CheckSquare, Search, ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';
import useStore from '../store/useStore';

const MODULE_SHORT_NAMES = [
    { id: 'all', label: 'All Modules (100)' },
    { id: 'Module 01: JavaScript Foundations & Environment', label: '01: Foundations' },
    { id: 'Module 02: Values, Operators & Control Flow', label: '02: Values & Flow' },
    { id: 'Module 03: Data Structures & Programming Fundamentals', label: '03: Fundamentals' },
    { id: 'Module 04: Functions & Execution Model', label: '04: Functions' },
    { id: 'Module 05: Scope, Closures & this Binding', label: '05: Scopes & this' },
    { id: 'Module 06: Objects & Prototypal Inheritance', label: '06: Objects & OOP' },
    { id: 'Module 07: Collections, Iteration & Modules', label: '07: Collections' },
    { id: 'Module 08: Advanced JavaScript & Metaprogramming', label: '08: Advanced' },
    { id: 'Module 09: Asynchronous JavaScript & Browser APIs', label: '09: Async & APIs' },
    { id: 'Module 10: JavaScript Engine, Memory, Performance & Security', label: '10: Engine & Memory' },
];

const getLevelBadge = (level) => {
    if (!level) return null;
    const l = level.toLowerCase();
    if (l.includes('beginner') || l.includes('level 1')) {
        return {
            label: 'Beginner',
            className: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
        };
    }
    if (l.includes('intermediate') || l.includes('level 2')) {
        return {
            label: 'Intermediate',
            className: 'text-sky-700 dark:text-sky-400 bg-sky-500/10 border-sky-500/20'
        };
    }
    if (l.includes('advanced') || l.includes('level 3')) {
        return {
            label: 'Advanced',
            className: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
        };
    }
    if (l.includes('expert') || l.includes('level 4')) {
        return {
            label: 'Expert',
            className: 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'
        };
    }
    return {
        label: level,
        className: 'text-zinc-600 dark:text-zinc-400 bg-zinc-500/10 border-zinc-500/20'
    };
};

const Learn = () => {
    const pathname = usePathname() || '';
    const basePath = pathname.startsWith('/fullstack/jsviz') ? '/fullstack/jsviz' : '/jsviz';
    const { progress } = useStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const completedCount = progress.completedTopics ? progress.completedTopics.length : 0;
    const completionPercentage = Math.round((completedCount / 100) * 100);

    const filteredTopics = topics
        .filter(category => activeCategory === 'all' || category.title === activeCategory)
        .map(category => ({
            ...category,
            items: category.items.filter(item =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }))
        .filter(category => category.items.length > 0);

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Strip */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 dark:text-brand-lime bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
                                <Sparkles size={12} /> JavaScript Curriculum 2027
                            </span>
                            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                                ECMA-262 Living Standard
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-main)]">
                            JavaScript Interactive Cosmos
                        </h1>

                        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
                            Master JavaScript from fundamentals to engine internals with 100 deep-dive visual lessons, live memory studio simulations, and 1,000 tailored quiz scenarios.
                        </p>

                        {/* Progress Bar & Stats */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 max-w-xl">
                            <div className="flex-1 space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="text-zinc-600 dark:text-zinc-400 font-medium">Curriculum Progress</span>
                                    <span className="font-bold text-emerald-700 dark:text-brand-lime">
                                        {completedCount} / 100 ({completionPercentage}%)
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-200/80 dark:border-zinc-700/50">
                                    <div 
                                        className="h-full bg-emerald-600 dark:bg-brand-lime transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] dark:shadow-[0_0_8px_rgba(204,255,0,0.3)]"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Field */}
                    <div className="w-full md:w-80">
                        <div className="relative">
                            <Search className="absolute left-3.5 top-3 text-zinc-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search 100 concepts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-emerald-500 dark:focus:border-brand-lime focus:ring-1 focus:ring-emerald-500/30 dark:focus:ring-brand-lime/30 transition-all shadow-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Quick-Jump / Module Filter Pills */}
                <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
                        <Layers size={13} /> Filter By Module:
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        {MODULE_SHORT_NAMES.map(mod => {
                            const isActive = activeCategory === mod.id;
                            return (
                                <button
                                    key={mod.id}
                                    type="button"
                                    onClick={() => setActiveCategory(mod.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all border cursor-pointer ${
                                        isActive
                                            ? 'border-emerald-600 dark:border-brand-lime bg-emerald-600 text-white dark:bg-brand-lime dark:text-black font-bold shadow-xs'
                                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                                    }`}
                                >
                                    {mod.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Modules & Concept Cards Grid */}
                <div className="space-y-12">
                    {filteredTopics.map((category) => (
                        <div key={category.title} className="space-y-4">
                            {/* Module Section Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800/80">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-brand-lime shadow-[0_0_8px_rgba(16,185,129,0.5)] dark:shadow-[0_0_8px_rgba(204,255,0,0.4)]"></div>
                                    <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                                        {category.title}
                                    </h2>
                                </div>
                                <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-semibold px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                                    {category.items.length} Concepts
                                </span>
                            </div>

                            {/* Responsive Card Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5">
                                {category.items.map((topic, index) => {
                                    const isCompleted = progress.completedTopics.includes(topic.id);
                                    const displayNum = topic.number || index + 1;
                                    const badge = getLevelBadge(topic.level);

                                    return (
                                        <Link
                                            key={topic.id}
                                            href={`${basePath}/topic/${topic.id}`}
                                            className={`group p-3.5 sm:p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between min-h-[115px] gap-2.5 relative overflow-hidden ${
                                                isCompleted
                                                    ? 'border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-500/40 hover:border-emerald-600 dark:hover:border-emerald-400 shadow-xs'
                                                    : 'border-zinc-200/90 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/50 hover:border-emerald-500/60 dark:hover:border-brand-lime/60 hover:bg-zinc-50/80 dark:hover:bg-zinc-850/60 hover:shadow-md hover:-translate-y-0.5'
                                            }`}
                                        >
                                            {/* Card Top: Number & Level Badge + Title */}
                                            <div className="space-y-1.5">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
                                                        #{String(displayNum).padStart(2, '0')}
                                                    </span>

                                                    {badge && (
                                                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badge.className}`}>
                                                            {badge.label}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Concept Title */}
                                                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors leading-snug line-clamp-2">
                                                    {topic.title}
                                                </h3>
                                            </div>

                                            {/* Card Bottom Row: Features & Action */}
                                            <div className="flex items-center justify-between pt-2.5 border-t border-zinc-100 dark:border-zinc-800/60 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-brand-lime"></span>
                                                    10 MCQs
                                                </span>

                                                <span className="flex items-center gap-1 font-semibold group-hover:text-emerald-700 dark:group-hover:text-brand-lime transition-colors">
                                                    {isCompleted ? (
                                                        <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
                                                            <CheckSquare size={13} /> Done
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                                            Open <ArrowRight size={11} />
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {filteredTopics.length === 0 && (
                        <div className="py-20 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 space-y-3">
                            <BookOpen className="w-8 h-8 text-zinc-400 mx-auto" />
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                                NO_CONCEPTS_MATCHED
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                No concepts found matching &quot;{searchQuery}&quot;. Try searching another keyword or clearing filters.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Learn;
