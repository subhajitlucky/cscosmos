'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import type { ITWalkthrough } from '../data/lessons/types';

interface Step {
  title: string;
  description: string;
  content: React.ReactNode;
}

const SYSTEM_LAYERS = ['Input', 'CPU', 'Registers', 'Memory', 'Output'];

function LayerStrip({ active }: { active: number }) {
  return (
    <div className="grid gap-1 sm:grid-cols-5">
      {SYSTEM_LAYERS.map((layer, index) => (
        <div
          key={layer}
          className="border px-2 py-3 text-center"
          style={{
            borderColor: index === active ? 'var(--it-primary)' : 'var(--it-border)',
            backgroundColor: index === active ? 'var(--it-primary-soft)' : 'transparent',
            color: index === active ? 'var(--it-primary)' : 'var(--it-muted)',
          }}
        >
          <div className="it-mono text-[9px] font-bold">{String(index + 1).padStart(2, '0')}</div>
          <div className="mt-1 text-[11px] font-semibold">{layer}</div>
        </div>
      ))}
    </div>
  );
}

function Bits({ bits }: { bits: string }) {
  return (
    <div className="flex flex-wrap gap-1">
      {bits.split('').map((bit, index) => (
        <span
          key={`${bit}-${index}`}
          className="flex h-10 w-9 items-center justify-center border font-mono text-sm font-bold"
          style={{
            borderColor: bit === '1' ? 'var(--it-primary)' : 'var(--it-border)',
            backgroundColor: bit === '1' ? 'var(--it-primary-soft)' : 'transparent',
            color: bit === '1' ? 'var(--it-primary)' : 'var(--it-muted)',
          }}
        >
          {bit}
        </span>
      ))}
    </div>
  );
}

function systemSteps(): Step[] {
  return [
    {
      title: 'Input arrives',
      description: 'A key press, sensor reading, or network packet becomes data the machine can handle.',
      content: <LayerStrip active={0} />,
    },
    {
      title: 'Fetch the instruction',
      description: 'The program counter points to the next instruction. The CPU brings it from memory into the instruction register.',
      content: <LayerStrip active={1} />,
    },
    {
      title: 'Decode it',
      description: 'The control unit works out which operation to perform and which registers or memory locations it needs.',
      content: <LayerStrip active={2} />,
    },
    {
      title: 'Execute',
      description: 'The arithmetic logic unit adds, compares, moves, or branches. Memory may be read or written.',
      content: <LayerStrip active={3} />,
    },
    {
      title: 'Write back and output',
      description: 'The result lands in a register or memory. Eventually it leaves through a screen, file, or network response.',
      content: <LayerStrip active={4} />,
    },
  ];
}

function binarySteps(): Step[] {
  return [
    {
      title: 'Start with a decimal value',
      description: 'The character A is code point 65 in ASCII. We want to see how 65 lives inside one byte.',
      content: <div className="font-mono text-3xl font-bold">65</div>,
    },
    {
      title: 'Turn on the place values',
      description: '65 = 64 + 1, so the 64 and 1 bits are on. The other six switches stay off.',
      content: (
        <div className="space-y-3">
          <Bits bits="01000001" />
          <div className="it-mono text-[10px]" style={{ color: 'var(--it-muted)' }}>128 64 32 16 8 4 2 1</div>
        </div>
      ),
    },
    {
      title: 'Read it as hexadecimal',
      description: 'Split the byte into two nibbles: 0100 and 0001. Those are 4 and 1, so the hex value is 41.',
      content: <div className="font-mono text-2xl font-bold">0x41</div>,
    },
    {
      title: 'Map it to a character',
      description: 'The agreed character set maps 65, or 0x41, to the capital letter A. The number is the storage; the letter is the interpretation.',
      content: <div className="font-mono text-4xl font-bold">A</div>,
    },
  ];
}

function networkSteps(): Step[] {
  return [
    {
      title: 'Read the URL',
      description: 'The browser separates the scheme, host, path, and query: https, atlas.example, /course.',
      content: <div className="font-mono text-sm">https://atlas.example/course</div>,
    },
    {
      title: 'Resolve the name',
      description: 'DNS turns atlas.example into an IP address. The browser now knows where to send packets.',
      content: <div className="it-mono text-sm" style={{ color: 'var(--it-primary)' }}>atlas.example → 203.0.113.10</div>,
    },
    {
      title: 'Open a secure connection',
      description: 'TCP establishes a reliable connection, then TLS negotiates encryption and verifies the certificate.',
      content: <div className="font-mono text-sm">TCP + TLS handshake ✓</div>,
    },
    {
      title: 'Send the request',
      description: 'The browser sends GET /course. The server finds the page, checks permissions, and may query a database.',
      content: <pre className="border p-3 font-mono text-[11px]" style={{ borderColor: 'var(--it-border)', backgroundColor: 'var(--it-surface-2)' }}>{'GET /course HTTP/2\nHost: atlas.example'}</pre>,
    },
    {
      title: 'Render the response',
      description: 'The server returns HTML and assets. The browser parses, lays out, paints, and the page appears.',
      content: <div className="font-mono text-sm">200 OK · 18 KB · rendered</div>,
    },
  ];
}

function stepsFor(kind: ITWalkthrough): Step[] {
  if (kind === 'binary') return binarySteps();
  if (kind === 'network') return networkSteps();
  return systemSteps();
}

export function Walkthrough({ kind }: { kind: ITWalkthrough }) {
  const steps = stepsFor(kind);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timer = useRef<number | null>(null);
  const atEnd = index >= steps.length - 1;

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [kind]);

  useEffect(() => {
    if (!playing) return;
    if (atEnd) {
      setPlaying(false);
      return;
    }
    timer.current = window.setTimeout(() => {
      setIndex((current) => Math.min(steps.length - 1, current + 1));
    }, 1400 / speed);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [playing, index, atEnd, speed, steps.length]);

  const go = (next: number) => {
    setPlaying(false);
    setIndex(Math.max(0, Math.min(steps.length - 1, next)));
  };

  const step = steps[index];

  return (
    <div className="border" style={{ borderColor: 'var(--it-border-strong)', backgroundColor: 'var(--it-surface)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--it-border)' }}>
        <div className="flex items-baseline gap-3">
          <span className="it-kicker text-[8px]" style={{ color: 'var(--it-primary)' }}>Walkthrough</span>
          <span className="it-mono text-[10px]" style={{ color: 'var(--it-muted)' }}>{String(index + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="flex h-8 w-8 items-center justify-center border disabled:opacity-30" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }} aria-label="Previous step"><SkipBack className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => { if (atEnd && !playing) setIndex(0); setPlaying((value) => !value); }} className="inline-flex h-8 items-center gap-1.5 border px-2.5 text-[9px] font-bold uppercase tracking-wider" style={{ borderColor: 'var(--it-primary)', backgroundColor: 'var(--it-primary)', color: '#fff' }}>
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
          </button>
          <button type="button" onClick={() => go(index + 1)} disabled={atEnd} className="flex h-8 w-8 items-center justify-center border disabled:opacity-30" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }} aria-label="Next step"><SkipForward className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => go(0)} className="flex h-8 w-8 items-center justify-center border" style={{ borderColor: 'var(--it-border)', color: 'var(--it-muted)' }} aria-label="Reset walkthrough"><RotateCcw className="h-3.5 w-3.5" /></button>
          <span className="mx-1 h-5 w-px" style={{ backgroundColor: 'var(--it-border)' }} />
          {[0.5, 1, 2].map((value) => <button key={value} type="button" onClick={() => setSpeed(value)} className="h-8 px-1.5 font-mono text-[9px] font-bold" style={{ backgroundColor: speed === value ? 'var(--it-primary-soft)' : 'transparent', color: speed === value ? 'var(--it-primary)' : 'var(--it-muted)' }}>{value}x</button>)}
        </div>
      </div>
      <div className="flex gap-1 px-4 pt-4" aria-hidden="true">
        {steps.map((_, stepIndex) => <span key={stepIndex} className="h-1 flex-1" style={{ backgroundColor: stepIndex <= index ? 'var(--it-primary)' : 'var(--it-border)' }} />)}
      </div>
      <div className="px-4 py-5 sm:px-5">
        <div className="flex items-baseline gap-3">
          <span className="it-num text-2xl" style={{ color: 'var(--it-primary)' }}>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3 className="text-sm font-semibold">{step.title}</h3>
            <p className="mt-1 text-[11px] leading-relaxed" style={{ color: 'var(--it-muted)' }}>{step.description}</p>
          </div>
        </div>
        <div className="mt-4">{step.content}</div>
      </div>
    </div>
  );
}
