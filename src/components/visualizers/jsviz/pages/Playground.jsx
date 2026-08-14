'use client';
import React from 'react';
import CodeEditor from '../components/CodeEditor';
import { EventLoopStepper } from '../components/EventLoopStepper';
import { V8GarbageCollector } from '../components/V8GarbageCollector';
import { Terminal, Sparkles } from 'lucide-react';

const Playground = () => {
    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="border-b border-brand-border pb-6">
                    <div className="flex items-center mb-2">
                        <div className="bg-brand-lime text-brand-black p-2 rounded-sm mr-3">
                            <Terminal size={24} strokeWidth={3} />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter" style={{ color: 'var(--text-main)' }}>
                            JS_PLAYGROUND &amp; SIMULATORS
                        </h1>
                    </div>
                    <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                        Interactive engines for the JavaScript Event Loop, Call Stack, Microtasks, and V8 Garbage Collection.
                    </p>
                </div>

                {/* Feature 1: Interactive Event Loop Stepper */}
                <EventLoopStepper />

                {/* Feature 2: V8 Tri-Color GC Simulator */}
                <V8GarbageCollector />

                {/* Feature 3: Full Code Editor */}
                <div className="space-y-4 pt-4">
                    <h2 className="text-xl font-bold font-mono tracking-tight" style={{ color: 'var(--text-main)' }}>
                        &gt; Live Code Sandbox
                    </h2>
                    <div className="h-[500px]">
                        <CodeEditor initialCode="// Write your JavaScript code here\nconsole.log('Hello, JS_VIZ!');\n\n// Try asynchronous timers & promises\nsetTimeout(() => console.log('Timeout fired'), 500);\nPromise.resolve('Resolved!').then(console.log);" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Playground;
