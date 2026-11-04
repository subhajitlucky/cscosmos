'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, ArrowLeft, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BASE } from '../../constants';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 mt-24 transition-colors">
            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand & Engine Overview */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#E34F26] flex items-center justify-center shadow-[0_0_20px_rgba(227,79,38,0.3)]">
                                <Code2 className="text-slate-950" size={22} strokeWidth={2.5} />
                            </div>
                            <div>
                                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                                    HTML<span className="text-lime-500 dark:text-lime-400">Cosmos</span>
                                </span>
                                <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 -mt-1">
                                    Accessibility & Semantics Engine
                                </span>
                            </div>
                        </div>

                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 max-w-sm">
                            An interactive visualizer hub for modern semantic document architecture, keyboard accessibility, and WCAG 2.2 standards. Absorbed natively into CSCosmos.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-2">
                            <Link
                                href="/topics"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-lime-500/50 hover:text-slate-900 dark:hover:text-white transition-all"
                            >
                                <ArrowLeft size={12} />
                                <span>Back to Topics Catalog</span>
                            </Link>
                            <Link
                                href="/fullstack"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-lime-500/50 hover:text-slate-900 dark:hover:text-white transition-all"
                            >
                                <span>Full Stack Hub</span>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation: Curriculum */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                            Curriculum
                        </h3>
                        <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                            <li>
                                <Link href={`${BASE}/learn/box-model`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    Box Model Geometry
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/learn/semantics`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    Semantic Architecture
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/learn/accessibility`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    WCAG & ARIA Roles
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/learn/header`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    Landmarks & Layout
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/learn/form`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    Accessible Forms
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/learn/dialog`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    Native Modal Dialogs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation: Hands-On Tools */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                            Interactive Tools
                        </h3>
                        <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                            <li>
                                <Link href={`${BASE}/learn`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    Concept Galaxy (55 Tags)
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/playground`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    Live Sandbox Editor
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/playground`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-lime-600 dark:text-lime-400" />
                                    <span>Real-Time A11y Scanner</span>
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/problems`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    50 Practice Challenges
                                </Link>
                            </li>
                            <li>
                                <Link href={`${BASE}/about`} className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    Pedagogy & Architecture
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Standards & External References */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
                            Standards
                        </h3>
                        <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                            <li>
                                <a
                                    href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors inline-flex items-center gap-1.5"
                                >
                                    <span>W3C WCAG 2.2 Guidelines</span>
                                    <ExternalLink size={12} className="opacity-70" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://html.spec.whatwg.org/multipage/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors inline-flex items-center gap-1.5"
                                >
                                    <span>WHATWG HTML Living Standard</span>
                                    <ExternalLink size={12} className="opacity-70" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://developer.mozilla.org/en-US/docs/Web/HTML"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors inline-flex items-center gap-1.5"
                                >
                                    <span>MDN HTML Documentation</span>
                                    <ExternalLink size={12} className="opacity-70" />
                                </a>
                            </li>
                            <li>
                                <Link href="/fullstack/css-cosmos" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    CSS Cosmos Visualizer
                                </Link>
                            </li>
                            <li>
                                <Link href="/fullstack/jsviz" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">
                                    JavaScript Memory Engine
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Separator & System Status */}
                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                        © {currentYear} <span className="font-semibold text-slate-800 dark:text-slate-200">CSCosmos</span>. Open Computer Science Education.
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-mono text-[11px]">55 Concepts · 50 Challenges · Active Engine</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
