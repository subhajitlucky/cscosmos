'use client';

import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    BookOpen,
    Layers,
    ShieldCheck,
    Terminal,
    Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { htmlTags } from '../../data/html-tags';
import { problems } from '../../data/problems';
import { BASE } from '../../constants';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export default function Home() {
    const totalConcepts = htmlTags.length;
    const totalProblems = problems.length;
    const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
    const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
    const hardCount = problems.filter(p => p.difficulty === 'Hard').length;

    return (
        <div className="w-full space-y-16 py-4 pb-16">
            {/* 1. Hero Section */}
            <motion.section
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 sm:p-12 lg:p-16 shadow-sm"
            >
                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                    {/* Eyebrow Badge */}
                    <motion.div variants={itemVariants} className="flex justify-center">
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-mono font-semibold text-lime-700 dark:text-lime-400 bg-lime-500/10 border border-lime-500/30">
                            <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                            <span>HTMLCosmos · Semantic Architecture & Web Accessibility</span>
                        </div>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white"
                    >
                        Master Modern Semantic HTML <br />
                        <span className="text-[#E34F26]">& Accessible ARIA</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-300 font-sans max-w-2xl mx-auto"
                    >
                        An interactive computer science workbench. Explore {totalConcepts} native building blocks of the web, audit live markup with an automated WCAG accessibility scanner, and master DOM architecture through {totalProblems} hands-on challenges.
                    </motion.p>

                    {/* Action Buttons */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
                    >
                        <Link
                            href={`${BASE}/learn`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.35)] hover:bg-lime-300 transition-all group"
                        >
                            <BookOpen size={16} />
                            <span>Explore {totalConcepts} Concepts</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>

                        <Link
                            href={`${BASE}/playground`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-7 py-3.5 text-sm font-bold text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <Terminal size={16} className="text-slate-500" />
                            <span>Interactive Playground</span>
                        </Link>

                        <Link
                            href={`${BASE}/problems`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-7 py-3.5 text-sm font-bold text-slate-900 dark:text-white hover:border-slate-400 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                        >
                            <Trophy size={16} className="text-amber-500" />
                            <span>{totalProblems} Practice Challenges</span>
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            {/* 2. Key Architecture Metrics Grid */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                        {totalConcepts}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                        Curated Concepts & Tags
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        Covering semantic landmarks, forms, media, tables, and dialogs.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                        {totalProblems}
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                        Auto-Graded Challenges
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        {easyCount} Easy, {mediumCount} Medium, and {hardCount} Hard hands-on DOM problems.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <div className="text-3xl font-display font-extrabold text-[#E34F26]">
                        100%
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                        Native A11y Scanner
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        Instant DOM audits for image alts, label bindings, and heading order.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm">
                    <div className="text-3xl font-display font-extrabold text-lime-600 dark:text-lime-400">
                        WCAG 2.2
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                        Accessibility Standards
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        Keyboard navigation, ARIA landmarks, and screen reader testing.
                    </p>
                </div>
            </section>

            {/* 3. Core Capabilities Grid (4 Cards) */}
            <section className="space-y-6">
                <div>
                    <h2 className="text-xs font-mono uppercase tracking-widest text-[#E34F26] font-bold">
                        Platform Capabilities
                    </h2>
                    <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">
                        Everything you need to build accessible, semantic web applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm group">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-600 dark:text-lime-400">
                                <Layers size={22} strokeWidth={2.2} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Semantic Layout & Document Landmarks
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Replace generic div soups with native structural landmarks (<code className="text-xs font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">&lt;main&gt;</code>, <code className="text-xs font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">&lt;nav&gt;</code>, <code className="text-xs font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">&lt;article&gt;</code>, <code className="text-xs font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">&lt;aside&gt;</code>) to provide clean document outlines for search engines and assistive technology.
                            </p>
                        </div>
                        <div className="pt-6">
                            <Link
                                href={`${BASE}/learn`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-lime-600 dark:text-lime-400 hover:text-lime-700 dark:hover:text-lime-300 group-hover:translate-x-0.5 transition-all"
                            >
                                <span>Browse Concept Galaxy</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm group">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-[#E34F26]/10 border border-[#E34F26]/20 flex items-center justify-center text-[#E34F26]">
                                <ShieldCheck size={22} strokeWidth={2.2} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Real-Time A11y & WCAG Scanner
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Audit live markup directly in the sandbox editor. Automatically detect missing doctypes, unlabelled form inputs, omitted image <code className="text-xs font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">alt</code> text, and broken heading hierarchies with step-by-step remediation advice.
                            </p>
                        </div>
                        <div className="pt-6">
                            <Link
                                href={`${BASE}/playground`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E34F26] hover:underline group-hover:translate-x-0.5 transition-all"
                            >
                                <span>Test In Playground</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm group">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Terminal size={22} strokeWidth={2.2} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                Live Interactive Workbench
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Experiment with live HTML and CSS rendering in a zero-configuration sandbox. Inspect DOM node behaviors, practice responsive layout techniques, and evaluate interactive widgets like <code className="text-xs font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">&lt;dialog&gt;</code> and <code className="text-xs font-mono px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">&lt;details&gt;</code>.
                            </p>
                        </div>
                        <div className="pt-6">
                            <Link
                                href={`${BASE}/playground`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline group-hover:translate-x-0.5 transition-all"
                            >
                                <span>Launch Sandbox</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm group">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Trophy size={22} strokeWidth={2.2} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                50 Auto-Evaluated Coding Challenges
                            </h3>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                                Strengthen your markup proficiency with 50 graded challenges. Write HTML to satisfy concrete requirements, pass automated DOM assertions, and earn confidence in accessible markup practices.
                            </p>
                        </div>
                        <div className="pt-6">
                            <Link
                                href={`${BASE}/problems`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline group-hover:translate-x-0.5 transition-all"
                            >
                                <span>View 50 Challenges</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Challenge Track Summary & Practice Callout */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 sm:p-12 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        <Trophy size={14} />
                        <span>Interactive Assessment Arena</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white">
                        Ready to test your markup skills?
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Solve {totalProblems} auto-evaluated problems with real-time test assertions. Progress from fundamental tag nesting to advanced ARIA attributes and keyboard-accessible widgets.
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 font-semibold">
                            {easyCount} Easy
                        </span>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-yellow-400 border border-amber-500/20 font-semibold">
                            {mediumCount} Medium
                        </span>
                        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 font-semibold">
                            {hardCount} Hard
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                    <Link
                        href={`${BASE}/problems`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.35)] hover:bg-lime-300 transition-all text-center group"
                    >
                        <span>Start Challenge #1</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href={`${BASE}/playground`}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-slate-800 px-8 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-center"
                    >
                        <span>Open Sandbox Playground</span>
                    </Link>
                </div>
            </section>
        </div>
    );
}
