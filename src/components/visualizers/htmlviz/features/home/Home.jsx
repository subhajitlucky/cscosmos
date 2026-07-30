'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, Layers, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Home() {
    return (
        <div className="relative isolate pt-6">
            <div className="py-6 sm:py-8 lg:pb-20">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="mx-auto max-w-4xl text-center"
                    >

                        {/* Badge */}
                        <motion.div variants={item} className="mb-8 flex justify-center">
                            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-lime-400 ring-1 ring-lime-400/30 bg-lime-400/10 transition-colors font-mono">
                                Interactive HTML & Accessibility Engine
                            </div>
                        </motion.div>

                        <motion.h1 variants={item} className="text-5xl font-display font-bold tracking-tighter text-white sm:text-8xl mb-8">
                            Master Modern <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400">
                                HTML & ARIA
                            </span>
                        </motion.h1>

                        <motion.p variants={item} className="mt-6 text-lg sm:text-xl leading-8 text-slate-400 font-sans max-w-2xl mx-auto">
                            Step-by-step visual lessons, DOM structure playgrounds, and accessibility challenge problems for modern web developers.
                        </motion.p>

                        <motion.div variants={item} className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/html-cosmos/learn"
                                className="rounded-full bg-lime-400 px-8 py-4 text-base font-bold text-slate-950 shadow-[0_0_20px_rgba(163,230,53,0.4)] hover:bg-lime-300 transition-all flex items-center gap-2 group"
                            >
                                Start Learning
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link
                                href="/html-cosmos/playground"
                                className="rounded-full px-8 py-4 text-base font-bold text-white border border-slate-800 hover:border-slate-700 bg-slate-900/50 hover:bg-slate-900 transition-all"
                            >
                                Open Playground
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
