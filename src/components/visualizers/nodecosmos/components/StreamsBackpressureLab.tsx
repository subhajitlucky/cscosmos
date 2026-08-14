'use client';

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Play, RefreshCw, Sparkles, Waves, Zap } from 'lucide-react';

export function StreamsBackpressureLab() {
  const [bufferKb, setBufferKb] = useState<number>(12);
  const [highWaterMark] = useState<number>(16); // 16 KB
  const [streamState, setStreamState] = useState<'flowing' | 'paused' | 'drained'>('flowing');
  const [log, setLog] = useState<string>('Readable stream pushing 4KB chunks into Writable stream buffer.');

  const handlePushChunk = () => {
    const nextBuffer = bufferKb + 6;
    if (nextBuffer >= highWaterMark) {
      setBufferKb(highWaterMark);
      setStreamState('paused');
      setLog('⚠️ BACKPRESSURE TRIGGERED: writable.write() returned FALSE! Buffer hit 16KB highWaterMark. readable.pause() invoked!');
    } else {
      setBufferKb(nextBuffer);
      setStreamState('flowing');
      setLog(`Chunk written. Current internal buffer: ${nextBuffer}KB / ${highWaterMark}KB`);
    }
  };

  const handleDrain = () => {
    setBufferKb(0);
    setStreamState('drained');
    setLog('🌊 DRAIN EVENT EMITTED: Writable buffer flushed to disk! readable.resume() invoked. Data flow resumes safely.');
  };

  return (
    <div className="rounded-3xl border border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-blue-600 dark:text-blue-400">
              High-Throughput I/O Architecture
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Node.js Streams &amp; Backpressure Flow Simulator
            </h3>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold ${
          streamState === 'paused'
            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
            : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
        }`}>
          Status: {streamState.toUpperCase()}
        </span>
      </div>

      {/* Stream Pipeline Visualization */}
      <div className="p-6 rounded-3xl bg-slate-950 text-slate-100 border border-slate-800 space-y-6 font-mono text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          {/* Readable */}
          <div className={`p-4 rounded-2xl border transition-all ${
            streamState === 'flowing' ? 'border-emerald-500 bg-emerald-500/20 shadow-md' : 'border-slate-800 bg-slate-900 opacity-60'
          }`}>
            <div className="font-bold text-xs text-emerald-400">Readable Stream</div>
            <span className="text-[10px] text-slate-400">fs.createReadStream</span>
            <div className="pt-2 text-[11px] font-bold">
              {streamState === 'paused' ? '⏸️ PAUSED' : '▶️ PUSHING DATA'}
            </div>
          </div>

          {/* Buffer highWaterMark */}
          <div className={`p-4 rounded-2xl border transition-all ${
            streamState === 'paused' ? 'border-rose-500 bg-rose-500/20 shadow-md' : 'border-blue-500 bg-blue-500/10'
          }`}>
            <div className="font-bold text-xs text-blue-400">Internal Buffer</div>
            <span className="text-[10px] text-slate-400">highWaterMark: 16 KB</span>
            <div className="pt-2 text-sm font-extrabold text-foreground">
              {bufferKb} KB / 16 KB
            </div>
          </div>

          {/* Writable */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900 text-center">
            <div className="font-bold text-xs text-purple-400">Writable Stream</div>
            <span className="text-[10px] text-slate-400">fs.createWriteStream / Socket</span>
            <div className="pt-2 text-[11px] text-slate-300">
              Writing to disk / network
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Buffer Fill Level:</span>
            <span>{Math.round((bufferKb / highWaterMark) * 100)}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                bufferKb >= highWaterMark ? 'bg-rose-500' : 'bg-blue-500'
              }`}
              style={{ width: `${(bufferKb / highWaterMark) * 100}%` }}
            />
          </div>
        </div>

        {/* Log Box */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-blue-400 font-bold">Stream Event:</span> {log}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handlePushChunk}
          disabled={streamState === 'paused'}
          className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Push 6KB Data Chunk</span>
        </button>

        <button
          onClick={handleDrain}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Waves className="w-4 h-4" />
          <span>Emit &ldquo;drain&rdquo; Event (Flush Buffer)</span>
        </button>
      </div>
    </div>
  );
}
