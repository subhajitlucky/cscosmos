'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { problems } from '../../data/problems';
import { Trophy } from 'lucide-react';
import clsx from 'clsx';

export default function ProblemList() {
    const [filter, setFilter] = useState('All');

    const filteredProblems = filter === 'All'
        ? problems
        : problems.filter(p => p.difficulty === filter);

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'text-green-600 dark:text-green-400 bg-green-500/10 border-green-500/20';
            case 'Medium': return 'text-amber-600 dark:text-yellow-400 bg-amber-500/10 border-amber-500/20';
            case 'Hard': return 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-slate-600 dark:text-slate-400';
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">HTML Challenges</h1>
                    <p className="text-slate-600 dark:text-slate-400">Master HTML by solving {problems.length} hands-on problems.</p>
                </div>

                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    {['All', 'Easy', 'Medium', 'Hard'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={clsx(
                                "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                                filter === f
                                    ? "bg-lime-400 text-slate-950 font-bold shadow-sm"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredProblems.map((problem) => (
                    <Link
                        key={problem.id}
                        href={`/html-cosmos/problems/${problem.id}`}
                        className="flex items-center justify-between bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 p-5 rounded-xl hover:border-lime-500 dark:hover:border-lime-400/50 transition-all group shadow-sm hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:text-lime-600 dark:group-hover:text-lime-400 group-hover:bg-lime-400/10 transition-colors">
                                <Trophy size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">{problem.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{problem.description}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className={clsx("px-3 py-1 rounded-full text-xs font-semibold border", getDifficultyColor(problem.difficulty))}>
                                {problem.difficulty}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
