'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { problems } from '../../data/problems';
import CodeEditor from '../compiler/CodeEditor';
import LivePreview from '../compiler/LivePreview';
import { ArrowLeft, CheckCircle, XCircle, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ProblemSolver({ problemId: propProblemId }) {
    const params = useParams();
    const router = useRouter();
    const problemId = propProblemId || params?.id;
    const problem = problems.find(p => p.id === parseInt(problemId));

    const [code, setCode] = useState('');
    const [status, setStatus] = useState('idle');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (problem) {
            setCode(problem.initialCode || '');
            setStatus('idle');
            setFeedback('');
        }
    }, [problem]);

    if (!problem) return <div className="text-slate-900 dark:text-white">Problem not found</div>;

    const checkSolution = () => {
        let passed = false;
        const { validation } = problem;

        if (validation.type === 'includes') {
            passed = validation.value.every(val => code.includes(val));
        } else if (validation.type === 'regex') {
            passed = validation.value.test(code);
        }

        if (passed) {
            setStatus('success');
            setFeedback('Great job! Solution is correct.');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            setStatus('error');
            setFeedback('Solution incomplete or incorrect. Check requirements!');
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col pt-2 pb-6">
            <div className="flex items-center justify-between mb-4">
                <Link href="/html-cosmos/problems" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                    <ArrowLeft size={16} /> Back to Problems
                </Link>
                <button
                    onClick={checkSolution}
                    className="flex items-center gap-2 bg-lime-400 text-slate-950 font-bold px-6 py-2 rounded-lg hover:bg-lime-300 transition-all shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                >
                    <Play size={16} fill="currentColor" /> Submit Solution
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
                <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{problem.title}</h1>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{problem.description}</p>
                        {feedback && (
                            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
                                status === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                            }`}>
                                {status === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                {feedback}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden min-h-[300px]">
                        <CodeEditor code={code} onChange={setCode} />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[300px] shadow-sm">
                    <div className="bg-slate-100 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">
                        Live Preview Output
                    </div>
                    <div className="flex-1 bg-white p-4">
                        <LivePreview code={code} />
                    </div>
                </div>
            </div>
        </div>
    );
}
