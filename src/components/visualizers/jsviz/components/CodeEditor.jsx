'use client';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Trash2, Terminal, Code } from 'lucide-react';
import { useTheme } from '@/context/useTheme';

const CodeEditor = ({ initialCode = '', onRun, readOnly = false }) => {
    const { theme } = useTheme();
    const [code, setCode] = useState(initialCode);
    const outputRef = React.useRef(null);

    // Update internal state when prop changes
    React.useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    const [output, setOutput] = useState([]);
    const [isError, setIsError] = useState(false);

    const handleEditorChange = (value) => {
        setCode(value);
    };

    const executeCode = () => {
        setOutput([]);
        setIsError(false);

        const localLogs = [];
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        let restored = false;

        const restoreConsole = () => {
            if (restored) return;
            console.log = originalConsoleLog;
            console.error = originalConsoleError;
            restored = true;
        };

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
            // Batch updates for better performance
            setOutput([...localLogs]);
        };

        console.log = (...args) => pushLog(false, args);
        console.error = (...args) => pushLog(true, args);

        const FLUSH_DELAY = 1500; // capture async logs briefly

        try {
            // eslint-disable-next-line no-new-func
            const run = new Function(code);
            const result = run();

            if (result !== undefined) {
                pushLog(false, [result]);
            }
        } catch (error) {
            pushLog(true, [error.toString()]);
        } finally {
            // allow async logs to arrive, then restore console
            setTimeout(() => {
                restoreConsole();
                if (onRun) onRun(code, localLogs, isError);
            }, FLUSH_DELAY);
        }
    };

    const clearConsole = () => {
        setOutput([]);
        setIsError(false);
    };

    // Auto-scroll console to bottom when output changes
    React.useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [output]);

    return (
        <div className="flex flex-col h-full border-l border-brand-border" style={{ backgroundColor: 'var(--bg-surface)' }}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-brand-border" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <div className="flex items-center space-x-2">
                    <Code size={14} style={{ color: 'var(--accent-main)' }} />
                    <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--text-muted)' }}>Editor_Pane</span>
                </div>
                <div className="flex space-x-2">
                    {!readOnly && (
                        <button
                            onClick={executeCode}
                            className="neo-btn px-3 py-1 text-xs flex items-center gap-2"
                        >
                            <Play size={12} fill="currentColor" />
                            EXECUTE
                        </button>
                    )}
                </div>
            </div>

            {/* Editor & Console Split */}
            <div className="flex-grow flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-hidden relative" style={{ minHeight: '200px' }}>
                    <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        value={code}
                        theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
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

                {/* Console Output - Fixed height section */}
                <div className="h-[40%] flex-shrink-0 flex flex-col border-t border-brand-border" style={{ backgroundColor: 'var(--bg-main)' }}>
                    <div className="px-4 py-1.5 border-b border-brand-border flex justify-between items-center flex-shrink-0" style={{ backgroundColor: 'var(--bg-surface)' }}>
                        <div className="flex items-center space-x-2">
                            <Terminal size={12} style={{ color: 'var(--text-main)' }} />
                            <span className="text-xs font-bold uppercase tracking-widest font-mono" style={{ color: 'var(--text-main)' }}>Console_Output</span>
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
