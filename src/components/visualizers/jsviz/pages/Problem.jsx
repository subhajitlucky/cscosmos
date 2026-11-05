'use client';

import React, { useState, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { problems, getProblemById } from '../data/problems';
import CodeEditor from '../components/CodeEditor';
import useStore from '../store/useStore';
import { CheckSquare, ArrowLeft, ArrowRight, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

const Problem = ({ problemId: propProblemId }) => {
    const params = useParams();
    const pathname = usePathname() || '';
    const isCanonical = pathname.startsWith('/fullstack/jsviz');
    const basePath = isCanonical ? '/fullstack/jsviz' : '/jsviz';

    const id = propProblemId || (params ? params.id : '');
    const problem = getProblemById(id);
    const { markProblemSolved } = useStore();

    const [code, setCode] = useState('');
    const [testResults, setTestResults] = useState([]);
    const [allPassed, setAllPassed] = useState(false);

    useEffect(() => {
        if (problem) {
            setCode(problem.boilerplate);
            setTestResults([]);
            setAllPassed(false);
        }
    }, [problem]);

    if (!problem) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="neo-card p-8 max-w-md w-full space-y-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <div className="font-mono text-sm text-red-500 font-bold uppercase tracking-widest">
                        ERROR: PROBLEM_NOT_FOUND
                    </div>
                    <p className="text-xs font-mono text-[var(--text-muted)]">
                        The requested problem identifier could not be resolved.
                    </p>
                    <Link
                        href={`${basePath}/practice`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-brand-lime text-black hover:opacity-90 transition-opacity"
                    >
                        <ArrowLeft size={14} /> Back to Challenges
                    </Link>
                </div>
            </div>
        );
    }

    const currentIndex = problems.findIndex((p) => p.id === problem.id);
    const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null;
    const nextProblem = currentIndex >= 0 && currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null;

    const runTests = (userCode) => {
        const results = [];
        let passedCount = 0;

        problem.testCases.forEach((testCase) => {
            try {
                const funcMatch = problem.boilerplate.match(/function\s+(\w+)/);
                const funcName = funcMatch ? funcMatch[1] : 'solution';
                const wrappedCode = `
          ${userCode}
          return eval('${funcName}')(...${JSON.stringify(testCase.input)});
        `;

                const run = new Function(wrappedCode);
                const result = run();

                const isCorrect = JSON.stringify(result) === JSON.stringify(testCase.expected);

                if (isCorrect) passedCount++;

                results.push({
                    input: JSON.stringify(testCase.input),
                    expected: JSON.stringify(testCase.expected),
                    actual: JSON.stringify(result),
                    passed: isCorrect
                });
            } catch (err) {
                results.push({
                    input: JSON.stringify(testCase.input),
                    expected: JSON.stringify(testCase.expected),
                    actual: err.toString(),
                    passed: false
                });
            }
        });

        setTestResults(results);

        if (passedCount === problem.testCases.length) {
            setAllPassed(true);
            markProblemSolved(problem.id);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            setAllPassed(false);
        }
    };

    return (
        <div className="min-h-screen pt-16 flex flex-col" style={{ backgroundColor: 'var(--bg-main)' }}>
            {/* Header */}
            <div className="border-b border-brand-border bg-brand-black px-4 py-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                        <Link
                            href={`${basePath}/practice`}
                            className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 rounded-lg border border-transparent hover:border-brand-border transition-colors"
                            title="Back to All Challenges"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-brand-lime uppercase tracking-widest">
                                    PRACTICE_CHALLENGE // {problem.difficulty}
                                </span>
                                {currentIndex >= 0 && (
                                    <span className="text-xs font-mono text-[var(--text-muted)]">
                                        ({currentIndex + 1} of {problems.length})
                                    </span>
                                )}
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)]">
                                {problem.title}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Stepper Controls */}
                        <div className="flex items-center gap-1.5">
                            {prevProblem && (
                                <Link
                                    href={`${basePath}/problem/${prevProblem.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors hover:border-brand-lime hover:text-brand-lime"
                                    style={{
                                        borderColor: 'var(--border-main)',
                                        color: 'var(--text-muted)',
                                        backgroundColor: 'var(--bg-surface)',
                                    }}
                                    title={`Previous: ${prevProblem.title}`}
                                >
                                    <ArrowLeft size={14} />
                                    <span className="hidden sm:inline">Prev</span>
                                </Link>
                            )}
                            {nextProblem && (
                                <Link
                                    href={`${basePath}/problem/${nextProblem.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors hover:border-brand-lime hover:text-brand-lime"
                                    style={{
                                        borderColor: 'var(--border-main)',
                                        color: 'var(--text-muted)',
                                        backgroundColor: 'var(--bg-surface)',
                                    }}
                                    title={`Next: ${nextProblem.title}`}
                                >
                                    <span className="hidden sm:inline">Next</span>
                                    <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>

                        {allPassed && (
                            <div className="flex items-center space-x-2 text-brand-lime font-bold text-sm bg-[rgba(var(--accent-main-rgb),0.1)] px-3 py-1.5 rounded-lg border border-[color:var(--accent-main)]">
                                <CheckSquare size={16} />
                                <span>PASSED</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Split Screen Workbench - Centered with max-w-7xl and generous padding so it never touches screen edges */}
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-0">
                <div
                    className="flex-1 flex flex-col lg:flex-row min-h-[600px] border rounded-2xl overflow-hidden shadow-sm"
                    style={{ borderColor: 'var(--border-main)', backgroundColor: 'var(--bg-surface)' }}
                >
                    {/* Left: Problem Details & Test Output */}
                    <div
                        className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-8 space-y-6"
                        style={{ backgroundColor: 'var(--bg-main)' }}
                    >
                        <div className="neo-card p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                            <h3 className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-2">
                                Description
                            </h3>
                            <p className="font-mono text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
                                {problem.description}
                            </p>
                        </div>

                        {/* Test Cases Output */}
                        {testResults.length > 0 && (
                            <div className="neo-card p-6 space-y-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                                <h3 className="text-xs font-mono text-brand-lime uppercase tracking-widest">
                                    TEST_SUITE_RESULTS ({testResults.filter((r) => r.passed).length}/{testResults.length})
                                </h3>

                                <div className="space-y-3 font-mono text-xs">
                                    {testResults.map((res, i) => (
                                        <div
                                            key={i}
                                            className={`p-3 border rounded-lg ${
                                                res.passed
                                                    ? 'border-green-500/30 bg-green-500/10 text-green-800 dark:text-green-400'
                                                    : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between font-bold mb-1">
                                                <span>TEST_CASE #{i + 1}</span>
                                                <span>{res.passed ? 'PASSED' : 'FAILED'}</span>
                                            </div>
                                            <div>Input: <span className="text-zinc-600 dark:text-zinc-300">{res.input}</span></div>
                                            <div>Expected: <span className="text-zinc-600 dark:text-zinc-300">{res.expected}</span></div>
                                            <div>Output: <span className="text-zinc-600 dark:text-zinc-300">{res.actual}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Code Editor */}
                    <div
                        className="w-full lg:w-[540px] xl:w-[600px] border-t lg:border-t-0 lg:border-l flex flex-col"
                        style={{
                            borderColor: 'var(--border-main)',
                            backgroundColor: 'var(--bg-surface)',
                            minHeight: '520px',
                        }}
                    >
                        <div
                            className="px-4 py-2.5 border-b flex items-center justify-between"
                            style={{ borderColor: 'var(--border-main)', backgroundColor: 'var(--bg-main)' }}
                        >
                            <span
                                className="text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <Terminal size={14} /> Solution Editor
                            </span>
                            <div className="flex space-x-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                            </div>
                        </div>
                        <div className="flex-grow flex flex-col min-h-0">
                            <CodeEditor initialCode={code} onRun={runTests} className="border-0 rounded-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem;
