'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, Play, RefreshCw, RotateCcw, Sparkles, Trophy, Wand2 } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string;
  targetDescription: string;
  initialProps: {
    display: string;
    justifyContent: string;
    alignItems: string;
    flexDirection: string;
    gap: string;
  };
  solution: {
    display: string;
    justifyContent: string;
    alignItems: string;
  };
}

const CHALLENGES: Challenge[] = [
  {
    id: 'center-div',
    title: 'Challenge 1: Perfectly Center a Div',
    difficulty: 'Beginner',
    instructions: 'Use Flexbox to center the inner card both horizontally and vertically inside the container.',
    targetDescription: 'Display: flex, Justify-Content: center, Align-Items: center',
    initialProps: {
      display: 'block',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: '0px'
    },
    solution: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  {
    id: 'space-between',
    title: 'Challenge 2: Navbar Space-Between Alignment',
    difficulty: 'Beginner',
    instructions: 'Distribute navbar items evenly across the width with items vertically aligned in the center.',
    targetDescription: 'Display: flex, Justify-Content: space-between, Align-Items: center',
    initialProps: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: '0px'
    },
    solution: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  },
  {
    id: 'column-center',
    title: 'Challenge 3: Centered Vertical Stack Column',
    difficulty: 'Intermediate',
    instructions: 'Stack elements vertically in a column and center them horizontally along the cross axis.',
    targetDescription: 'Display: flex, Flex-Direction: column, Align-Items: center',
    initialProps: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      flexDirection: 'row',
      gap: '12px'
    },
    solution: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
];

export function CssChallengeArena() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [display, setDisplay] = useState('block');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('flex-start');
  const [flexDirection, setFlexDirection] = useState('row');
  const [gap, setGap] = useState('12px');

  const handleSelect = (ch: Challenge) => {
    setSelectedChallenge(ch);
    setDisplay(ch.initialProps.display);
    setJustifyContent(ch.initialProps.justifyContent);
    setAlignItems(ch.initialProps.alignItems);
    setFlexDirection(ch.initialProps.flexDirection);
    setGap(ch.initialProps.gap);
  };

  const isSolved =
    display === selectedChallenge.solution.display &&
    justifyContent === selectedChallenge.solution.justifyContent &&
    alignItems === selectedChallenge.solution.alignItems;

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Interactive Layout Challenge Arena
            </div>
            <h3 className="text-xl font-bold text-foreground">
              CSS Layout Matching Game &amp; Evaluator
            </h3>
          </div>
        </div>

        {/* Challenge Tabs */}
        <div className="flex flex-wrap gap-2">
          {CHALLENGES.map((ch) => (
            <button
              key={ch.id}
              onClick={() => handleSelect(ch)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedChallenge.id === ch.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'bg-card border border-border text-foreground hover:border-amber-500'
              }`}
            >
              {ch.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Controls & Target Info */}
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400">{selectedChallenge.difficulty}</span>
              {isSolved && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Match!
                </span>
              )}
            </div>
            <h4 className="text-base font-bold text-foreground">{selectedChallenge.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{selectedChallenge.instructions}</p>
          </div>

          {/* Interactive Property Controls */}
          <div className="p-4 rounded-2xl bg-card border border-border space-y-3 font-mono text-xs">
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">display:</label>
              <div className="flex gap-2">
                {['block', 'flex', 'grid'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDisplay(d)}
                    className={`flex-1 py-1.5 rounded-lg border text-center transition ${
                      display === d ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' : 'border-border hover:bg-muted'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">justify-content:</label>
              <div className="grid grid-cols-2 gap-2">
                {['flex-start', 'center', 'space-between', 'space-around'].map((j) => (
                  <button
                    key={j}
                    onClick={() => setJustifyContent(j)}
                    className={`py-1.5 rounded-lg border text-center text-[11px] transition ${
                      justifyContent === j ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' : 'border-border hover:bg-muted'
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">align-items:</label>
              <div className="grid grid-cols-3 gap-2">
                {['flex-start', 'center', 'flex-end'].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAlignItems(a)}
                    className={`py-1.5 rounded-lg border text-center text-[11px] transition ${
                      alignItems === a ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' : 'border-border hover:bg-muted'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Canvas Preview */}
        <div className="space-y-2 flex flex-col justify-between">
          <div
            className="w-full h-80 rounded-3xl border-2 border-dashed border-amber-500/40 bg-slate-950/60 p-4 transition-all duration-300 overflow-hidden"
            style={{
              display: display,
              justifyContent: justifyContent,
              alignItems: alignItems,
              flexDirection: flexDirection as any,
              gap: gap
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center shadow-lg transition-all">
              Box 1
            </div>
            {selectedChallenge.id === 'space-between' && (
              <div className="w-16 h-16 rounded-2xl bg-cyan-400 text-slate-950 font-bold flex items-center justify-center shadow-lg transition-all">
                Box 2
              </div>
            )}
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800">
            <span className="text-amber-400 font-bold">Live CSS:</span> <code>{`{ display: ${display}; justify-content: ${justifyContent}; align-items: ${alignItems}; }`}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
