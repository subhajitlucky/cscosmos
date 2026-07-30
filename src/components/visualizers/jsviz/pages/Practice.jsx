'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { problems } from '../data/problems';
import { CheckSquare, Code, Filter, Search, Terminal } from 'lucide-react';
import useStore from '../store/useStore';

const Practice = () => {
    const { progress } = useStore();
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const difficulties = ['All', 'Easy', 'Intermediate', 'Advanced', 'Expert'];

    const filteredProblems = problems.filter(p => {
        const matchesDifficulty = filter === 'All' || p.difficulty === filter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDifficulty && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 border-b border-brand-border pb-8">
                    <h1 className="text-5xl font-bold tracking-tighter mb-4" style={{ color: 'var(--text-main)' }}>
                        PRACTICE_ARENA
                    </h1>
                    <p className="font-mono" style={{ color: 'var(--text-muted)' }}>
                        Execute algorithmic challenges. Validate logic.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {difficulties.map((diff) => (
                            <button
                                key={diff}
                                onClick={() => setFilter(diff)}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${filter === diff
                                        ? 'bg-brand-lime text-brand-black border-brand-lime font-black'
                                        : 'bg-transparent border-brand-border hover:border-[var(--text-main)] hover:text-[var(--text-main)]'
                                    }`}
                                style={{ color: filter === diff ? 'var(--text-inverse)' : 'var(--text-muted)' }}
                            >
                                {diff}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                        <input
                            type="text"
                            placeholder="SEARCH_PROBLEMS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-brand-border px-4 pl-10 py-2 font-mono text-sm focus:outline-none focus:border-brand-lime placeholder-gray-500 transition-colors"
                            style={{ color: 'var(--text-main)', backgroundColor: 'var(--bg-surface)' }}
                        />
                    </div>
                </div>

                {/* Problem List */}
                <div className="border border-brand-border" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="grid grid-cols-12 border-b border-brand-border p-4 text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)' }}>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-6 md:col-span-7">Problem</div>
                        <div className="col-span-3 md:col-span-2">Difficulty</div>
                        <div className="col-span-2 text-right">Action</div>
                    </div>

                    <ul className="divide-y divide-brand-border">
                        {filteredProblems.map((problem) => {
                            const isSolved = progress.solvedProblems.includes(problem.id);
                            return (
                                <li key={problem.id} className="group transition-colors" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                    <Link href={`/jsviz/problem/${problem.id}`} className="grid grid-cols-12 p-4 items-center">
                                        <div className="col-span-1">
                                            {isSolved ? (
                                                <CheckSquare size={20} className="text-brand-lime" />
                                            ) : (
                                                <div className="w-5 h-5 border border-gray-600 rounded-sm"></div>
                                            )}
                                        </div>

                                        <div className="col-span-6 md:col-span-7 pr-4">
                                            <p className={`text-lg font-bold truncate ${isSolved ? 'text-brand-lime' : 'group-hover:text-brand-lime transition-colors'}`} style={{ color: isSolved ? undefined : 'var(--text-main)' }}>
                                                {problem.title}
                                            </p>
                                            <p className="text-xs font-mono truncate hidden md:block mt-1" style={{ color: 'var(--text-muted)' }}>
                                                {problem.description}
                                            </p>
                                        </div>

                                        <div className="col-span-3 md:col-span-2">
                                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 border ${problem.difficulty === 'Easy' ? 'text-green-500 border-green-500/30' :
                                                    problem.difficulty === 'Intermediate' ? 'text-blue-500 border-blue-500/30' :
                                                        problem.difficulty === 'Advanced' ? 'text-orange-500 border-orange-500/30' :
                                                            'text-red-500 border-red-500/30'}`}>
                                                {problem.difficulty}
                                            </span>
                                        </div>

                                        <div className="col-span-2 text-right">
                                            <span className="text-gray-500 group-hover:text-white transition-colors">
                                                <Terminal size={20} className="ml-auto" />
                                            </span>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {filteredProblems.length === 0 && (
                        <div className="p-12 text-center text-gray-500 font-mono">
                            NO_DATA_FOUND
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Practice;
