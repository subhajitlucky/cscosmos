'use client';
import React from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, language = 'html' }) {
    const handleEditorChange = (value) => {
        onChange(value || '');
    };

    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-[#1e1e1e]">
            <div className="h-9 bg-[#1e1e1e] border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-500 font-mono ml-2">index.html</span>
            </div>
            <Editor
                height="calc(100% - 36px)"
                defaultLanguage={language}
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: 'Fira Code',
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                }}
            />
        </div>
    );
}
