'use client';

import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import LivePreview from './LivePreview';
import A11yScanner from './A11yScanner';
import { Play, RotateCcw } from 'lucide-react';

const DEFAULT_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(to right, #e0eafc, #cfdef3);
    }
    .card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      text-align: center;
    }
    h1 { color: #2d3748; }
    button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: transform 0.1s;
    }
    button:active { transform: scale(0.95); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World!</h1>
    <p>Welcome to HTMLCosmos Playground.</p>
    <button aria-label="Click Me">Click Me</button>
  </div>
</body>
</html>`;

export default function CompilerPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [key, setKey] = useState(0);

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Playground</h1>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button 
            onClick={() => setKey(prev => prev + 1)}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-lime-400 text-slate-950 font-bold hover:bg-lime-300 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:scale-105"
          >
            <Play size={18} fill="currentColor" />
            Run Code
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[minmax(360px,1fr)]">
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm h-full">
          <CodeEditor code={code} onChange={setCode} />
        </div>
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm h-full">
          <LivePreview key={key} code={code} />
        </div>
      </div>

      {/* Live Accessibility (A11y) Scanner */}
      <A11yScanner code={code} />
    </div>
  );
}
