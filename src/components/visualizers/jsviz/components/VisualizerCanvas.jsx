'use client';
import React, { useState, useEffect } from 'react';
import VariableVisualizer from './visualizations/VariableVisualizer';
import DataTypeVisualizer from './visualizations/DataTypeVisualizer';
import CallStackVisualizer from './visualizations/CallStackVisualizer';
import EventLoopVisualizer from './visualizations/EventLoopVisualizer';
import PrototypeVisualizer from './visualizations/PrototypeVisualizer';
import ArrayVisualizer from './visualizations/ArrayVisualizer';
import MapSetVisualizer from './visualizations/MapSetVisualizer';
import GeneratorVisualizer from './visualizations/GeneratorVisualizer';
import InternalVisualizer from './visualizations/InternalVisualizer';
import MetaprogrammingVisualizer from './visualizations/MetaprogrammingVisualizer';

const VisualizerCanvas = ({ topicId, code, isRunning, onCodeChange }) => {
    const [visualization, setVisualization] = useState(null);

    useEffect(() => {
        try {
            const safeCode = typeof code === 'string' ? code : '';

            // Logic for Variables, Scope, Operators, Property Descriptors, Legacy
            if (['variables', 'variables-scope', 'operators', 'property-descriptors', 'legacy', 'temporal-dead-zone', 'object-immutability', 'private-class-fields', 'weak-references', 'closure-loop-problem'].includes(topicId)) {
                const varRegex = /(?:let|const|var)\s+(?:\{([\w\s,]+)\}|\[([\w\s,]+)\]|([\w$]+))\s*=\s*([^;]+);?/g;
                let match;
                const variables = [];
                let loopGuard = 0;
                while ((match = varRegex.exec(safeCode)) !== null && loopGuard++ < 50) {
                    if (varRegex.lastIndex === match.index) varRegex.lastIndex++;
                    if (match[3]) { // Simple variable
                        variables.push({ name: match[3], value: (match[4] || '').trim() });
                    } else if (match[1]) { // Object destructuring {a, b}
                        match[1].split(',').forEach(v => {
                            const name = v.trim();
                            if (name) variables.push({ name, value: '...' });
                        });
                    } else if (match[2]) { // Array destructuring [a, b]
                        match[2].split(',').forEach(v => {
                            const name = v.trim();
                            if (name) variables.push({ name, value: '...' });
                        });
                    }
                }
                setVisualization({ type: 'variables', variables });
            } 
            // Logic for Data Types (Stack vs Heap) & Memory Model
            else if (['data-types', 'memory-model', 'typeof-detection', 'type-coercion', 'equality-comparison', 'truthy-falsy', 'numbers', 'bigint', 'strings', 'symbols', 'pass-by-value-reference', 'cloning-objects', 'symbols-registry'].includes(topicId)) {
                const stackItems = [];
                const heapItems = [];

                // Line-by-line parsing to accurately trace assignments, references, and mutations
                const lines = safeCode.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
                let addrIndex = 0x4F12;

                for (const line of lines) {
                    const declMatch = line.match(/^(?:let|const|var)\s+([\w$]+)\s*=\s*(.+?);?$/);
                    const assignMatch = line.match(/^([\w$]+)\s*=\s*(.+?);?$/);
                    const propMutMatch = line.match(/^([\w$]+)\.([\w$]+)\s*=\s*(.+?);?$/);

                    if (declMatch) {
                        const name = declMatch[1];
                        const val = declMatch[2].trim();

                        const existing = stackItems.find(s => s.name === val);
                        if (existing) {
                            if (existing.isRef) {
                                // Shared reference (same locker key)!
                                stackItems.push({ name, value: existing.value, isRef: true });
                            } else {
                                stackItems.push({ name, value: existing.value, isRef: false });
                            }
                        } else if (val.startsWith('{') || val.startsWith('[') || val.includes('function') || val.includes('new ')) {
                            const addr = `0x${(addrIndex += 0x18).toString(16).toUpperCase()}`;
                            stackItems.push({ name, value: addr, isRef: true });
                            heapItems.push({ addr, content: val });
                        } else {
                            stackItems.push({ name, value: val, isRef: false });
                        }
                    } else if (propMutMatch) {
                        const objName = propMutMatch[1];
                        const prop = propMutMatch[2];
                        const propVal = propMutMatch[3].trim().replace(/['"]/g, '');
                        const target = stackItems.find(s => s.name === objName);
                        if (target && target.isRef) {
                            const heapEntry = heapItems.find(h => h.addr === target.value);
                            if (heapEntry) {
                                if (heapEntry.content.includes(prop)) {
                                    heapEntry.content = heapEntry.content.replace(new RegExp(`${prop}\\s*:\\s*['"][^'"]*['"]`), `${prop}: "${propVal}"`);
                                } else {
                                    heapEntry.content = heapEntry.content.replace(/\}$/, `, ${prop}: "${propVal}" }`);
                                }
                            }
                        }
                    } else if (assignMatch) {
                        const name = assignMatch[1];
                        const val = assignMatch[2].trim();
                        const target = stackItems.find(s => s.name === name);
                        if (target && !target.isRef) {
                            target.value = val;
                        }
                    }
                }
                setVisualization({ type: 'datatypes', stack: stackItems, heap: heapItems });
            }
            // Logic for Call Stack / Functions / Spec Internals / Eval
            else if (['functions-basics', 'scope-chain', 'closures', 'execution-context', 'this-binding', 'function-methods', 'arguments-rest', 'arrow-functions', 'constructor-functions', 'classes', 'spec-internals', 'eval', 'call-stack', 'pure-functions', 'currying', 'recursion-tco', 'variable-shadowing', 'new-binding', 'lexical-this', 'class-inheritance'].includes(topicId)) {
                const funcRegex = /function\s+([\w$]+)|([\w$]+)\s*\(|class\s+([\w$]+)/g;
                let match;
                const frames = ['Global Context'];
                let loopGuard = 0;
                while ((match = funcRegex.exec(safeCode)) !== null && loopGuard++ < 50) {
                    if (funcRegex.lastIndex === match.index) funcRegex.lastIndex++;
                    const name = match[1] || match[2] || match[3];
                    if (name && !['console', 'log', 'if', 'for', 'while', 'switch'].includes(name)) {
                        frames.push(`${name}()`);
                    }
                }
                setVisualization({ type: 'callstack', frames: frames.reverse() });
            }
            // Logic for Event Loop / Async
            else if (['event-loop', 'microtasks', 'promises', 'async-await', 'callbacks', 'async-patterns', 'dynamic-imports', 'promise-chaining', 'promise-combinators', 'async-error-handling', 'async-iteration', 'abort-controller', 'timers-animation', 'top-level-await', 'unhandled-rejections'].includes(topicId)) {
                setVisualization({ 
                    type: 'eventloop',
                    hasMicro: safeCode.includes('Promise') || safeCode.includes('await') || safeCode.includes('then') || safeCode.includes('queueMicrotask'),
                    hasMacro: safeCode.includes('setTimeout') || safeCode.includes('setInterval')
                });
            }
            // Logic for Prototype Chain / Security
            else if (['prototype-chain', 'security', 'object-create', 'object-sandboxing'].includes(topicId)) {
                setVisualization({ type: 'prototype', chain: ['Instance', 'Prototype', 'Object.prototype', 'null'] });
            }
            // Logic for Arrays / Iteration / Shared Memory / Typed Arrays
            else if (['arrays', 'iteration-protocols', 'shared-memory', 'typed-arrays', 'array-methods-mutating', 'array-reduce-mastery', 'dataview', 'sparse-vs-dense-arrays', 'for-of-vs-for-in'].includes(topicId)) {
                const arrayMatch = safeCode.match(/\[(.*?)\]/);
                const items = arrayMatch ? arrayMatch[1].split(',').map(s => s.trim()) : ['1', '2', '3'];
                setVisualization({ type: 'arrays', items });
            }
            // Logic for Metaprogramming
            else if (['metaprogramming', 'reflect-api'].includes(topicId)) {
                setVisualization({ type: 'metaprogramming' });
            }
            // Logic for Map/Set
            else if (['map-set', 'weakmap-weakset'].includes(topicId)) {
                setVisualization({ type: 'mapset' });
            }
            // Logic for Generators
            else if (['generators', 'advanced-generators'].includes(topicId)) {
                setVisualization({ type: 'generator' });
            }
            else {
                setVisualization({ type: 'internal' });
            }
        } catch (err) {
            setVisualization({ type: 'error', message: 'Visualizer error.' });
        }
    }, [code, topicId]);

    const renderContent = () => {
        if (!visualization) return null;

        const safeCode = typeof code === 'string' ? code : '';

        switch (visualization.type) {
            case 'variables':
                return <VariableVisualizer variables={visualization.variables} />;
            case 'datatypes':
                return <DataTypeVisualizer stack={visualization.stack} heap={visualization.heap} onSelectPreset={onCodeChange} />;
            case 'callstack':
                return <CallStackVisualizer frames={visualization.frames} />;
            case 'eventloop':
                return <EventLoopVisualizer hasMicro={visualization.hasMicro} hasMacro={visualization.hasMacro} code={safeCode} isRunning={isRunning} />;
            case 'prototype':
                return <PrototypeVisualizer chain={visualization.chain} />;
            case 'arrays':
                return <ArrayVisualizer items={visualization.items} />;
            case 'mapset':
                return <MapSetVisualizer code={safeCode} />;
            case 'generator':
                return <GeneratorVisualizer code={safeCode} />;
            case 'metaprogramming':
                return <MetaprogrammingVisualizer code={safeCode} />;
            case 'internal':
                return <InternalVisualizer topicId={topicId} code={safeCode} />;
            case 'error':
                return (
                    <div className="flex items-center justify-center h-full p-4 text-red-400 font-mono text-xs">
                        ⚠️ {visualization.message}
                    </div>
                );
            default:
                return (
                    <div className="flex items-center justify-center h-full flex-col gap-4">
                        <div className="w-12 h-12 border-4 border-dashed border-gray-200 rounded-full animate-spin"></div>
                        <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">Initializing_Dedicated_Vis...</span>
                    </div>
                );
        }
    };

    return (
        <div className="w-full min-h-full relative" style={{ backgroundColor: 'transparent' }}>
            {renderContent()}
        </div>
    );
};

export default VisualizerCanvas;
