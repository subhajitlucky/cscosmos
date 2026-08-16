import React, { useState, useEffect } from 'react';
import { sha256 } from '../../utils/crypto';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Zap, GitCompare, RefreshCw } from 'lucide-react';

export const AvalancheDemo: React.FC = () => {
  const [input1, setInput1] = useState('Blockchain');
  const [input2, setInput2] = useState('Blockchaln'); // Typo intentional
  const [hash1, setHash1] = useState('');
  const [hash2, setHash2] = useState('');
  const [diffPercent, setDiffPercent] = useState(0);

  useEffect(() => {
    const compute = async () => {
      const h1 = await sha256(input1);
      const h2 = await sha256(input2);
      setHash1(h1);
      setHash2(h2);
      
      // Calculate difference
      let diffs = 0;
      for (let i = 0; i < h1.length; i++) {
        if (h1[i] !== h2[i]) diffs++;
      }
      setDiffPercent(Math.round((diffs / h1.length) * 100));
    };
    compute();
  }, [input1, input2]);

  const handleFlip = () => {
      // Find a random position to flip a character
      if (input1.length === 0) {
          setInput1("Hello");
          setInput2("Hullo");
          return;
      }
      const idx = Math.floor(Math.random() * input1.length);
      const charCode = input1.charCodeAt(idx);
      const newChar = String.fromCharCode(charCode === 65 ? 66 : charCode - 1); // Simple flip
      const arr = input1.split('');
      arr[idx] = newChar;
      setInput2(arr.join(''));
  };

  const renderHashCompare = () => {
    if (!hash1 || !hash2) return null;
    return (
      <div className="grid grid-cols-8 sm:grid-cols-16 gap-0.5 font-mono text-[10px] sm:text-xs break-all">
        {hash1.split('').map((char, i) => {
          const isDiff = char !== hash2[i];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={clsx(
                "h-6 w-full flex items-center justify-center rounded-sm transition-colors duration-300",
                isDiff 
                  ? "bg-rose-500 text-white font-bold" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600"
              )}
            >
              {isDiff ? "≠" : "="}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* Concept Banner */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-lg text-indigo-900 dark:text-indigo-200">The Avalanche Effect</h4>
        </div>
        <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed max-w-2xl">
            In cryptography, we want total unpredictability. A tiny snowball (small change in input) should cause a massive avalanche (total change in output).
            If two inputs are 99.9% similar, their hashes should be <strong>completely different</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Input Side */}
          <div className="space-y-6">
              
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Original Input</label>
                  <input
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <div className="mt-2 text-[10px] text-slate-400 font-mono break-all bg-slate-50 dark:bg-slate-950/50 p-2 rounded">
                      {hash1.substring(0, 32)}...
                  </div>
              </div>

              <div className="flex justify-center -my-3 relative z-10">
                  <button 
                    onClick={handleFlip}
                    className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:scale-110 transition-transform shadow-sm"
                    title="Change one character automatically"
                  >
                      <RefreshCw className="w-5 h-5" />
                  </button>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3">
                      <div className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-full border border-rose-100 dark:border-rose-900/30">
                          Modified Input
                      </div>
                  </div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Comparison Input</label>
                  <input
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    className="w-full p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 font-mono text-sm focus:ring-2 focus:ring-rose-500 transition-all text-rose-900 dark:text-rose-100"
                  />
                  <div className="mt-2 text-[10px] text-rose-400 font-mono break-all bg-rose-50/50 dark:bg-slate-950/50 p-2 rounded">
                      {hash2.substring(0, 32)}...
                  </div>
              </div>

          </div>

          {/* Analysis Side */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                      <GitCompare className="w-5 h-5 text-emerald-400" />
                      Difference Analysis
                  </h3>
                  <div className="text-2xl font-black text-emerald-400">
                      {diffPercent}% <span className="text-sm font-medium text-slate-400">Different</span>
                  </div>
              </div>

              <div className="flex-grow flex flex-col justify-center">
                  <div className="mb-2 flex justify-between text-xs text-slate-400 uppercase font-bold">
                      <span>Hash Comparison Map</span>
                      <span>Red = Changed Bit</span>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                      {renderHashCompare()}
                  </div>
              </div>

              <div className="mt-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
                  <h5 className="font-bold text-sm mb-2 text-slate-200">Why does this matter?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                      If the output was similar when the input was similar, a hacker could guess the original password by trying close variations. 
                      Because of the <strong>Avalanche Effect</strong>, "Password123" looks completely unrelated to "Password124" in the database.
                  </p>
              </div>
          </div>

      </div>
    </div>
  );
};