'use client';
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Trash2, Terminal, Code } from 'lucide-react';
import { useTheme } from '@/context/useTheme';

const CodeEditor = ({ initialCode = '', onRun, readOnly = false, className = '' }) => {
    const { theme, resolvedTheme } = useTheme();
    const currentTheme = resolvedTheme || (theme === 'system'
        ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme) || 'dark';
    const isDark = currentTheme === 'dark';
    const monacoTheme = isDark ? 'vs-dark' : 'vs';

    const [code, setCode] = useState(initialCode);
    const outputRef = useRef(null);
    const pendingTimerRef = useRef(null);
    const originalConsoleLogRef = useRef(null);
    const originalConsoleErrorRef = useRef(null);

    // Update internal state when prop changes
    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    const [output, setOutput] = useState([]);
    const [isError, setIsError] = useState(false);

    const handleEditorChange = (value) => {
        setCode(value || '');
    };

    const restoreConsole = () => {
        if (originalConsoleLogRef.current) {
            console.log = originalConsoleLogRef.current;
            originalConsoleLogRef.current = null;
        }
        if (originalConsoleErrorRef.current) {
            console.error = originalConsoleErrorRef.current;
            originalConsoleErrorRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
            restoreConsole();
        };
    }, []);

    const executeCode = () => {
        if (pendingTimerRef.current) {
            clearTimeout(pendingTimerRef.current);
            pendingTimerRef.current = null;
        }
        restoreConsole();

        setOutput([]);
        setIsError(false);

        const localLogs = [];
        originalConsoleLogRef.current = console.log;
        originalConsoleErrorRef.current = console.error;

        const pushLog = (isErr, args) => {
            if (isErr) setIsError(true);
            const line = args
                .map(arg => {
                    if (arg === null) return 'null';
                    if (arg === undefined) return 'undefined';
                    if (typeof arg === 'object') {
                        try {
                            return JSON.stringify(arg, null, 2);
                        } catch {
                            return '[Circular Object]';
                        }
                    }
                    return String(arg);
                })
                .join(' ');
            localLogs.push(line);
            setOutput([...localLogs]);
        };

        console.log = (...args) => pushLog(false, args);
        console.error = (...args) => pushLog(true, args);

        const FLUSH_DELAY = 1500; // capture async logs briefly

        try {
            const run = new Function(code);
            const result = run();

            if (result !== undefined) {
                pushLog(false, [result]);
            }
        } catch (error) {
            pushLog(true, [error.toString()]);
        } finally {
            pendingTimerRef.current = setTimeout(() => {
                restoreConsole();
                if (onRun) onRun(code, localLogs, isError);
                pendingTimerRef.current = null;
            }, FLUSH_DELAY);
        }
    };

    const clearConsole = () => {
        setOutput([]);
        setIsError(false);
    };

    // Auto-scroll console to bottom when output changes
    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <div 
            className={`flex flex-col h-full w-full min-h-[460px] border border-brand-border rounded-lg overflow-hidden ${className}`} 
            style={{ backgroundColor: 'var(--bg-surface)' }}
        >
            {/* Toolbar */}
            <div 
                className="flex items-center justify-between px-4 py-2 border-b border-brand-border flex-shrink-0" 
                style={{ backgroundColor: 'var(--bg-surface)' }}
            >
                <div className="flex items-center space-x-2">
                    <Code size={14} style={{ color: 'var(--accent-main)' }} />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-700 dark:text-zinc-300">JavaScript Editor</span>
                </div>
                <div className="flex space-x-2">
                    {!readOnly && (
                        <button
                            onClick={executeCode}
                            className="neo-btn px-3 py-1 text-xs flex items-center gap-1.5 transition-transform active:scale-95 font-bold"
                        >
                            <Play size={12} fill="currentColor" className="text-emerald-500" />
                            Run Code
                        </button>
                    )}
                </div>
            </div>

            {/* Editor & Console Split */}
            <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
                {/* Monaco Editor Container with Absolute Pinning */}
                <div 
                    className="flex-1 min-h-[220px] relative w-full overflow-hidden" 
                    style={{ backgroundColor: isDark ? '#1e1e1e' : '#fffffe' }}
                >
                    <div className="absolute inset-0 w-full h-full">
                        <Editor
                            height="100%"
                            width="100%"
                            defaultLanguage="javascript"
                            value={code}
                            theme={monacoTheme}
                            onChange={handleEditorChange}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: "'JetBrains Mono', monospace",
                                scrollBeyondLastLine: false,
                                readOnly: readOnly,
                                automaticLayout: true,
                                padding: { top: 16 },
                                renderLineHighlight: 'line',
                                cursorBlinking: 'solid',
                            }}
                        />
                    </div>
                </div>

                {/* Console Output - Dedicated section */}
                <div 
                    className="h-44 sm:h-48 flex-shrink-0 flex flex-col border-t border-brand-border min-h-0" 
                    style={{ backgroundColor: 'var(--bg-main)' }}
                >
                    <div 
                        className="px-4 py-1.5 border-b border-brand-border flex justify-between items-center flex-shrink-0" 
                        style={{ backgroundColor: 'var(--bg-surface)' }}
                    >
                        <div className="flex items-center space-x-2">
                            <Terminal size={12} style={{ color: 'var(--text-main)' }} />
                            <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-700 dark:text-zinc-300">Console Output</span>
                        </div>
                        <button
                            onClick={clearConsole}
                            className="p-1 hover:text-red-400 transition-colors"
                            style={{ color: 'var(--text-muted)' }}
                            title="Clear Console"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                    <div ref={outputRef} className="flex-grow p-3 overflow-y-auto font-mono text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-main)' }}>
                        {output.length === 0 ? (
                            <span className="italic text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Waiting for output...</span>
                        ) : (
                            output.map((line, index) => (
                                <div key={index} className={`mb-1 font-mono text-xs ${isError ? 'text-red-500' : ''}`} style={{ color: isError ? undefined : 'var(--text-main)' }}>
                                    <span style={{ color: 'var(--accent-main)' }} className="mr-2 font-bold">➜</span>
                                    {line}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
