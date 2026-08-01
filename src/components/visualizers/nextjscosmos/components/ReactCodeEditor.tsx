'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ReactCodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function ReactCodeEditor({ code, onChange, readOnly = false }: ReactCodeEditorProps) {
  return (
    <div className="relative font-mono text-sm bg-[#1e1e1e] text-zinc-100 rounded-xl overflow-hidden border border-zinc-800 shadow-xl h-full flex flex-col">
      <div className="flex bg-[#252526] px-4 py-2 border-b border-zinc-800 justify-between items-center text-xs text-zinc-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          <span className="ml-2 font-bold text-zinc-300">page.tsx</span>
        </div>
        <span className="text-[10px] uppercase font-bold text-primary">Live Code Editor</span>
      </div>

      <div className="grid grid-cols-1 relative flex-1 min-h-[360px]">
        {/* Syntax Highlighted Display */}
        <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed bg-transparent">
          <SyntaxHighlighter
            language="typescript"
            style={vscDarkPlus}
            showLineNumbers={true}
            customStyle={{
              margin: 0,
              padding: 0,
              background: 'transparent',
              fontSize: '13px',
              lineHeight: '1.6',
            }}
          >
            {code || '// Type code here...'}
          </SyntaxHighlighter>
        </div>

        {/* Transparent Textarea Overlay for Live Editing */}
        {!readOnly && (
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            className="absolute inset-0 w-full h-full p-4 font-mono text-xs sm:text-sm leading-relaxed text-transparent bg-transparent caret-primary resize-none outline-none overflow-auto pl-12"
            style={{
              lineHeight: '1.6',
              fontSize: '13px',
            }}
          />
        )}
      </div>
    </div>
  );
}
