'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProblemById } from '../data/problems';
import CodeEditor from '../components/CodeEditor';
import useStore from '../store/useStore';
import { CheckSquare, XSquare, Play, ArrowLeft, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

const Problem = ({ problemId: propProblemId }) => {
    const params = useParams();
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
        return <div className="p-20 text-center text-white font-mono">ERROR: PROBLEM_NOT_FOUND</div>;
    }

    const runTests = (userCode) => {
        const results = [];
        let passedCount = 0;

        problem.testCases.forEach((testCase) => {
            try {
                const wrappedCode = `
          ${userCode}
          const funcName = '${problem.boilerplate.match(/function\s+(\w+)/)[1]}';
          return eval(funcName)(...${JSON.stringify(testCase.input)});
        `;

                // eslint-disable-next-line no-new-func
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
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/jsviz/practice" className="text-gray-400 hover:text-white p-1 rounded transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <span className="text-xs font-mono text-brand-lime uppercase tracking-widest">
                                PRACTICE_CHALLENGE // {problem.difficulty}
                            </span>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{problem.title}</h1>
                        </div>
                    </div>

                    {allPassed && (
                        <div className="flex items-center space-x-2 text-brand-lime font-bold text-sm bg-brand-lime/10 px-3 py-1 border border-brand-lime">
                            <CheckSquare size={16} />
                            <span>PASSED</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Split Screen */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* Left: Problem Details & Test Output */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
                    <div className="neo-card p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2">Description</h3>
                        <p className="font-mono text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
                            {problem.description}
                        </p>
                    </div>

                    {/* Test Cases Output */}
                    {testResults.length > 0 && (
                        <div className="neo-card p-6 space-y-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                            <h3 className="text-sm font-mono text-brand-lime uppercase tracking-widest">
                                TEST_SUITE_RESULTS ({testResults.filter(r => r.passed).length}/{testResults.length})
                            </h3>

                            <div className="space-y-3 font-mono text-xs">
                                {testResults.map((res, i) => (
                                    <div
                                        key={i}
                                        className={`p-3 border ${res.passed ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}
                                    >
                                        <div className="flex items-center justify-between font-bold mb-1">
                                            <span>TEST_CASE #{i + 1}</span>
                                            <span>{res.passed ? 'PASSED' : 'FAILED'}</span>
                                        </div>
                                        <div>Input: <span className="text-gray-300">{res.input}</span></div>
                                        <div>Expected: <span className="text-gray-300">{res.expected}</span></div>
                                        <div>Output: <span className="text-gray-300">{res.actual}</span></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Code Editor */}
                <div className="w-full lg:w-[600px] border-t lg:border-t-0 lg:border-l flex flex-col" style={{ borderColor: 'var(--border-main)', backgroundColor: '#1e1e1e', minHeight: '500px' }}>
                    <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-main)', backgroundColor: '#252526' }}>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                            <Terminal size={14} /> Solution Editor
                        </span>
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <CodeEditor initialCode={code} onRun={runTests} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem;
