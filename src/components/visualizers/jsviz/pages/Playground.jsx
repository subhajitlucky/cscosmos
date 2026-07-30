'use client';
import React from 'react';
import CodeEditor from '../components/CodeEditor';
import { Terminal } from 'lucide-react';

const Playground = () => {
    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 border-b border-brand-border pb-6">
                    <div className="flex items-center mb-2">
                        <div className="bg-brand-lime text-brand-black p-2 rounded-sm mr-3">
                            <Terminal size={24} strokeWidth={3} />
                        </div>
                        <h1 className="text-5xl font-bold tracking-tighter" style={{ color: 'var(--text-main)' }}>
                            PLAYGROUND
                        </h1>
                    </div>
                    <p className="font-mono" style={{ color: 'var(--text-muted)' }}>
                        Experiment with JavaScript code in real-time.
                    </p>
                </div>

                <div className="h-[calc(100vh-250px)] min-h-[600px]">
                    <CodeEditor initialCode="// Write your JavaScript code here\nconsole.log('Hello, Playground!');\n\n// Try creating variables\nconst name = 'World';\nconsole.log(`Hello, ${name}!`);" />
                </div>
            </div>
        </div>
    );
};

export default Playground;
