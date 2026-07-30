'use client';
import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import LivePreview from './LivePreview';
import { Play, RotateCcw } from 'lucide-react';

const DEFAULT_CODE = `<!DOCTYPE html>
<html>
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
    <p>Welcome to HTMLViz Compiler.</p>
    <button>Click Me</button>
  </div>
</body>
</html>`;

export default function CompilerPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [key, setKey] = useState(0); // Force re-render of preview on reset

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-white">Playground</h1>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-dark font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] hover:scale-105">
            <Play size={18} fill="currentColor" />
            Run Code
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 auto-rows-[minmax(340px,1fr)]">
        <div className="min-h-[340px] md:min-h-0 md:h-full">
          <CodeEditor code={code} onChange={setCode} />
        </div>
        <div className="min-h-[340px] md:min-h-0 md:h-full">
          <LivePreview key={key} code={code} />
        </div>
      </div>
    </div>
  );
}
