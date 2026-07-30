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
import { Cpu } from 'lucide-react';

const VisualizerCanvas = ({ topicId, code, isRunning }) => {
    const [visualization, setVisualization] = useState(null);

    useEffect(() => {
        try {
            // Logic for Variables, Scope, Operators, Property Descriptors, Legacy
            if (['variables', 'variables-scope', 'operators', 'property-descriptors', 'legacy'].includes(topicId)) {
                // Improved regex to handle basic destructuring [a, b] or {x, y}
                const varRegex = /(?:let|const|var)\s+(?:\{([\w\s,]+)\}|\[([\w\s,]+)\]|([\w$]+))\s*=\s*([^;]+);?/g;
                let match;
                const variables = [];
                while ((match = varRegex.exec(code)) !== null) {
                    if (match[3]) { // Simple variable
                        variables.push({ name: match[3], value: match[4].trim() });
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
            else if (['data-types', 'memory-model'].includes(topicId)) {
                const stackItems = [];
                const heapItems = [];
                // Same improved regex here
                const varRegex = /(?:let|const|var)\s+(?:\{([\w\s,]+)\}|\[([\w\s,]+)\]|([\w$]+))\s*=\s*([^;]+);?/g;
                let match;
                while ((match = varRegex.exec(code)) !== null) {
                    const names = [];
                    if (match[3]) names.push(match[3]);
                    else if (match[1]) match[1].split(',').map(n => n.trim()).filter(n => n).forEach(n => names.push(n));
                    else if (match[2]) match[2].split(',').map(n => n.trim()).filter(n => n).forEach(n => names.push(n));

                    const val = match[4].trim();
                    const isObj = val.startsWith('{') || val.startsWith('[') || val.includes('function') || val.includes('new ');
                    
                    names.forEach(name => {
                        if (isObj) {
                            const addr = `0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`;
                            stackItems.push({ name, value: addr, isRef: true });
                            heapItems.push({ addr, content: val });
                        } else {
                            stackItems.push({ name, value: val, isRef: false });
                        }
                    });
                }
                setVisualization({ type: 'datatypes', stack: stackItems, heap: heapItems });
            }
            // Logic for Call Stack / Functions / Spec Internals / Eval
            else if (['functions-basics', 'scope-chain', 'closures', 'execution-context', 'this-binding', 'function-methods', 'arguments-rest', 'arrow-functions', 'constructor-functions', 'classes', 'spec-internals', 'eval'].includes(topicId)) {
                const funcRegex = /function\s+([\w$]+)|([\w$]+)\s*\(|class\s+([\w$]+)/g;
                let match;
                const frames = ['Global Context'];
                while ((match = funcRegex.exec(code)) !== null) {
                    const name = match[1] || match[2] || match[3];
                    if (name && !['console', 'log', 'if', 'for', 'while', 'switch'].includes(name)) {
                        frames.push(`${name}()`);
                    }
                }
                setVisualization({ type: 'callstack', frames: frames.reverse() });
            }
            // Logic for Event Loop / Async
            else if (['event-loop', 'microtasks', 'promises', 'async-await', 'callbacks', 'async-patterns', 'dynamic-imports'].includes(topicId)) {
                setVisualization({ 
                    type: 'eventloop',
                    hasMicro: code.includes('Promise') || code.includes('await') || code.includes('then'),
                    hasMacro: code.includes('setTimeout') || code.includes('setInterval')
                });
            }
            // Logic for Prototype Chain / Security
            else if (['prototype-chain', 'security'].includes(topicId)) {
                setVisualization({ type: 'prototype', chain: ['Instance', 'Prototype', 'Object.prototype', 'null'] });
            }
            // Logic for Arrays / Iteration / Shared Memory / Typed Arrays
            else if (['arrays', 'iteration-protocols', 'shared-memory', 'typed-arrays'].includes(topicId)) {
                const arrayMatch = code.match(/\[(.*?)\]/);
                const items = arrayMatch ? arrayMatch[1].split(',').map(s => s.trim()) : ['1', '2', '3'];
                setVisualization({ type: 'arrays', items });
            }
            // Logic for Metaprogramming
            else if (topicId === 'metaprogramming') {
                setVisualization({ type: 'metaprogramming' });
            }
            // Logic for Map/Set
            else if (topicId === 'map-set') {
                setVisualization({ type: 'mapset' });
            }
            // Logic for Generators
            else if (topicId === 'generators') {
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

        switch (visualization.type) {
            case 'variables':
                return <VariableVisualizer variables={visualization.variables} />;
            case 'datatypes':
                return <DataTypeVisualizer stack={visualization.stack} heap={visualization.heap} />;
            case 'callstack':
                return <CallStackVisualizer frames={visualization.frames} />;
            case 'eventloop':
                return <EventLoopVisualizer hasMicro={visualization.hasMicro} hasMacro={visualization.hasMacro} />;
            case 'prototype':
                return <PrototypeVisualizer chain={visualization.chain} />;
            case 'arrays':
                return <ArrayVisualizer items={visualization.items} />;
            case 'mapset':
                return <MapSetVisualizer code={code} />;
            case 'generator':
                return <GeneratorVisualizer code={code} />;
            case 'metaprogramming':
                return <MetaprogrammingVisualizer code={code} />;
            case 'internal':
                return <InternalVisualizer topicId={topicId} code={code} />;
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
        <div className="w-full h-full relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
            {renderContent()}
        </div>
    );
};

export default VisualizerCanvas;
