'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { htmlTags } from '../../data/html-tags';
import { Search, Grid, Map } from 'lucide-react';
import clsx from 'clsx';

export default function ConceptsGrid() {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('path'); // 'grid' or 'path'

    const filteredTags = htmlTags.filter(tag =>
        tag.tag.toLowerCase().includes(search.toLowerCase()) ||
        tag.description.toLowerCase().includes(search.toLowerCase())
    );

    const levels = {
        'Core Concept': [],
        '1. Foundation': [],
        '2. Content': [],
        '3. Layout': [],
        '4. Lists & Tables': [],
        '5. Media': [],
        '6. Forms': [],
        '6. Interactive': []
    };

    filteredTags.forEach(tag => {
        const level = tag.level || 'Other';
        if (!levels[level]) levels[level] = [];
        levels[level].push(tag);
    });

    return (
        <div className="min-h-screen pt-12 pb-20 px-2">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white mb-2">Concept Galaxy</h1>
                        <p className="text-slate-400">Master the building blocks of the web.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 flex items-center">
                            <button
                                onClick={() => setViewMode('path')}
                                className={clsx(
                                    "px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all",
                                    viewMode === 'path' ? "bg-lime-400 text-slate-950" : "text-slate-400 hover:text-white"
                                )}
                            >
                                <Map size={16} /> Path
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={clsx(
                                    "px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all",
                                    viewMode === 'grid' ? "bg-lime-400 text-slate-950" : "text-slate-400 hover:text-white"
                                )}
                            >
                                <Grid size={16} /> Grid
                            </button>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                            <input
                                type="text"
                                placeholder="Search tags..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {viewMode === 'path' && (
                    <div className="space-y-16 relative">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-lime-400/50 via-lime-400/20 to-transparent hidden md:block" />

                        {Object.entries(levels).map(([levelName, tags]) => (
                            tags.length > 0 && (
                                <div key={levelName} className="relative md:pl-24">
                                    <div className="absolute left-0 top-0 hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-slate-950 border-2 border-lime-400 text-lime-400 font-bold shadow-[0_0_20px_rgba(163,230,53,0.2)] z-10">
                                        {levelName.split('.')[0]}
                                    </div>

                                    <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                                        <span className="md:hidden text-lime-400">#</span> {levelName.replace(/^\d+\.\s/, '')}
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {tags.map(tag => (
                                            <TagCard key={tag.id} tag={tag} />
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredTags.map((tag) => (
                            <TagCard key={tag.id} tag={tag} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TagCard({ tag }) {
    const Icon = tag.icon;
    return (
        <Link
            href={`/html-cosmos/learn/${tag.id}`}
            className="group relative bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 hover:border-lime-400/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-lime-400 group-hover:text-slate-950 transition-colors">
                    <Icon size={20} className="text-slate-400 group-hover:text-slate-950" />
                </div>
                <span className="text-xs font-mono text-slate-400 border border-slate-800 px-2 py-1 rounded-full uppercase tracking-wider">
                    {tag.category}
                </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-lime-400 transition-colors">
                {tag.tag}
            </h3>
            <p className="text-sm text-slate-400 line-clamp-2">
                {tag.description}
            </p>
        </Link>
    );
}
