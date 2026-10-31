'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Binary, Type, Palette, RotateCcw, Sparkles } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BIT_WEIGHTS = [128, 64, 32, 16, 8, 4, 2, 1];

export function BinaryDataExplorer() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'binary' | 'ascii' | 'pixel'>('binary');

  // Binary mode state (0 to 255)
  const [bits, setBits] = useState<number[]>([0, 0, 1, 0, 1, 0, 1, 0]); // 42 in binary

  // ASCII mode state
  const [textInput, setTextInput] = useState<string>('CAT');
  const [selectedCharIdx, setSelectedCharIdx] = useState<number>(0);

  // Pixel mode state (RGB 0-255)
  const [red, setRed] = useState<number>(59);
  const [green, setGreen] = useState<number>(130);
  const [blue, setBlue] = useState<number>(246);

  // Compute decimal from bits
  const decimalValue = bits.reduce((sum, bit, index) => sum + bit * BIT_WEIGHTS[index], 0);
  const hexValue = decimalValue.toString(16).toUpperCase().padStart(2, '0');

  const toggleBit = (index: number) => {
    setBits((prev) => {
      const next = [...prev];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
  };

  const setFromDecimal = (val: number) => {
    const clamped = Math.max(0, Math.min(255, Math.floor(val || 0)));
    const newBits = BIT_WEIGHTS.map((weight) => (clamped & weight ? 1 : 0));
    setBits(newBits);
  };

  const resetBits = () => {
    setFromDecimal(42);
  };

  // ASCII computations
  const safeText = textInput.length > 0 ? textInput : ' ';
  const safeIdx = Math.min(selectedCharIdx, safeText.length - 1);
  const activeChar = safeText[safeIdx] ?? ' ';
  const charCode = activeChar.charCodeAt(0);
  const charHex = charCode.toString(16).toUpperCase().padStart(2, '0');
  const charBinary = charCode.toString(2).padStart(8, '0');

  return (
    <div className={cn(
      "rounded-2xl border p-6 sm:p-8 space-y-6 shadow-xl transition-colors",
      theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    )}>
      {/* Header and Mode Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-border/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
            Interactive Laboratory
          </span>
          <h3 className="text-xl font-bold text-foreground">
            How Data Is Stored in 1s and 0s
          </h3>
        </div>

        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted/60 border border-border" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'binary'}
            onClick={() => setActiveTab('binary')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              activeTab === 'binary'
                ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Binary className="w-3.5 h-3.5" />
            <span>1. Binary Numbers</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'ascii'}
            onClick={() => setActiveTab('ascii')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              activeTab === 'ascii'
                ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Type className="w-3.5 h-3.5" />
            <span>2. Text &amp; ASCII</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pixel'}
            onClick={() => setActiveTab('pixel')}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
              activeTab === 'pixel'
                ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>3. Pixels &amp; Colors</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Binary Number Switcher */}
      {activeTab === 'binary' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Click individual bits to flip them between <strong>0 (OFF)</strong> and <strong>1 (ON)</strong>, or type any number between 0 and 255.
            </p>
            <button
              type="button"
              onClick={resetBits}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded border border-border transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to 42
            </button>
          </div>

          {/* Live Values HUD */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10">
              <span className="text-xs uppercase font-mono text-amber-500 font-bold block mb-1">
                Decimal (Base 10)
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={0}
                  max={255}
                  value={decimalValue}
                  onChange={(e) => setFromDecimal(Number(e.target.value))}
                  className="text-3xl font-extrabold font-mono text-foreground bg-transparent w-24 border-b border-amber-400 focus:outline-none"
                  aria-label="Decimal number value"
                />
                <span className="text-xs text-muted-foreground">Human readable</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10">
              <span className="text-xs uppercase font-mono text-emerald-500 font-bold block mb-1">
                Binary (Base 2 — 1 Byte)
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {bits.slice(0, 4).join('')} {bits.slice(4, 8).join('')}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">8 bits (switches)</span>
            </div>

            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10">
              <span className="text-xs uppercase font-mono text-emerald-500 font-bold block mb-1">
                Hexadecimal (Base 16)
              </span>
              <span className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                0x{hexValue}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">2 hex digits per byte</span>
            </div>
          </div>

          {/* Interactive Bit Switches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Most Significant Bit (MSB: 2⁷ = 128)</span>
              <span>Least Significant Bit (LSB: 2⁰ = 1)</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
              {bits.map((bit, idx) => {
                const weight = BIT_WEIGHTS[idx];
                const isOn = bit === 1;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleBit(idx)}
                    className={cn(
                      "p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                      isOn
                        ? "bg-amber-600 border-amber-500 text-white shadow-lg shadow-xs scale-[1.02]"
                        : "bg-card border-border text-foreground hover:border-amber-400/50"
                    )}
                    aria-label={`Bit weight ${weight}, current value ${bit}`}
                  >
                    <span className="text-xs font-mono opacity-70">
                      +{weight}
                    </span>
                    <span className="text-3xl font-extrabold font-mono">
                      {bit}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider",
                      isOn ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {isOn ? 'ON' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mathematical Expansion */}
          <div className="p-4 rounded-xl border border-border bg-muted/30 font-mono text-xs space-y-2">
            <span className="text-muted-foreground block font-bold font-sans">
              Mathematical Sum:
            </span>
            <div className="flex flex-wrap gap-1.5 items-center text-foreground">
              {bits.map((bit, idx) => {
                const weight = BIT_WEIGHTS[idx];
                return (
                  <span key={idx} className={bit ? "text-amber-500 font-bold" : "text-muted-foreground opacity-50"}>
                    ({bit} × {weight}) {idx < 7 ? '+ ' : ''}
                  </span>
                );
              })}
              <span className="font-bold text-foreground">= {decimalValue}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Text, ASCII & Strings in Memory */}
      {activeTab === 'ascii' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Computers cannot store letters or text directly. Every character is assigned an 8-bit numerical code (ASCII). A word or sentence is stored as an <strong>array of sequential bytes</strong> in consecutive memory addresses.
            </p>
            <button
              type="button"
              onClick={() => { setTextInput('CAT'); setSelectedCharIdx(0); }}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded border border-border transition-colors shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Reset to "CAT"
            </button>
          </div>

          {/* Interactive Word Input & Memory Byte Strip */}
          <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
              <div>
                <label htmlFor="ascii-word-input" className="text-xs font-bold text-foreground block">
                  Type a Word or Short Text (up to 8 characters):
                </label>
                <span className="text-[11px] text-muted-foreground">
                  Watch how each character becomes a separate byte at a sequential memory address.
                </span>
              </div>
              <input
                id="ascii-word-input"
                type="text"
                maxLength={8}
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  setSelectedCharIdx(0);
                }}
                className="w-full sm:w-48 px-3.5 py-2 text-center text-lg font-extrabold font-mono rounded-xl border-2 border-amber-500 bg-background text-foreground focus:outline-none focus:ring-4 focus:ring-amber-500/20"
                placeholder="e.g. CAT"
              />
            </div>

            {/* Sequential RAM Address Strip */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-amber-500 uppercase block">
                Sequential Memory Layout in RAM (Click a byte to inspect):
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {safeText.split('').map((ch, idx) => {
                  const code = ch.charCodeAt(0);
                  const hex = code.toString(16).toUpperCase().padStart(2, '0');
                  const bin = code.toString(2).padStart(8, '0');
                  const isSelected = idx === safeIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedCharIdx(idx)}
                      className={cn(
                        "p-3 rounded-xl border-2 flex flex-col items-center min-w-[70px] sm:min-w-[85px] transition-all text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                        isSelected
                          ? "bg-amber-500 text-zinc-950 font-bold border-amber-500 shadow-lg scale-[1.03]"
                          : "bg-muted/40 border-border text-foreground hover:border-amber-400"
                      )}
                      aria-label={`Character ${ch} at memory address 0x0${idx}`}
                    >
                      <span className={cn("text-[10px] font-mono", isSelected ? "text-amber-100" : "text-muted-foreground")}>
                        RAM [0x0{idx}]
                      </span>
                      <span className="text-2xl font-black font-mono my-1">
                        '{ch}'
                      </span>
                      <span className={cn("text-xs font-mono font-bold", isSelected ? "text-white" : "text-amber-500")}>
                        {code}
                      </span>
                      <span className={cn("text-[10px] font-mono", isSelected ? "text-amber-200" : "text-emerald-500")}>
                        0x{hex}
                      </span>
                    </button>
                  );
                })}

                {/* Null Terminator */}
                <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 flex flex-col items-center min-w-[70px] sm:min-w-[85px] text-center opacity-70">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    RAM [0x0{safeText.length}]
                  </span>
                  <span className="text-xl font-bold font-mono my-1 text-muted-foreground">
                    '\0'
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    0
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Null End
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Focused Character Deep-Dive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-xs font-mono text-muted-foreground block mb-1">
                Active Character
              </span>
              <span className="text-3xl font-black font-mono text-foreground">
                '{activeChar}'
              </span>
              <span className="text-xs text-muted-foreground block mt-1">
                Address: RAM [0x0{safeIdx}]
              </span>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-xs font-mono text-amber-500 font-bold block mb-1">
                ASCII Decimal Code
              </span>
              <span className="text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                {charCode}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">
                Hex: 0x{charHex}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-xs font-mono text-emerald-500 font-bold block mb-1">
                8-Bit Binary Byte
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {charBinary.slice(0, 4)} {charBinary.slice(4, 8)}
              </span>
              <span className="text-xs text-muted-foreground block mt-1">
                Physical transistor switches
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                The 'A' vs 'a' Discovery
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Notice that uppercase <strong>'A'</strong> is 65 (<code className="font-mono">0100 0001</code>) and lowercase <strong>'a'</strong> is 97 (<code className="font-mono">0110 0001</code>). They differ by exactly <strong>32 (bit 5)</strong>! Flipping just one bit converts between uppercase and lowercase.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h4 className="font-bold text-foreground">Why Does The Null Terminator '\0' Exist?</h4>
              <p className="text-muted-foreground leading-relaxed">
                In languages like C, memory has no visible borders. To know where a word ends, a byte holding numerical <strong>0 ('\0')</strong> is placed immediately after the last letter so the CPU knows when to stop reading!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pixels & Images Representation */}
      {activeTab === 'pixel' && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            A digital screen is made of millions of tiny colored dots called <strong>pixels</strong>. Every pixel is represented by 3 bytes of data: Red, Green, and Blue (RGB).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Live RGB Sliders */}
            <div className="space-y-4 p-5 rounded-xl border border-border bg-card">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-red-500">Red Byte: {red}</span>
                  <span className="text-muted-foreground font-mono">{red.toString(2).padStart(8, '0')}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={red}
                  onChange={(e) => setRed(Number(e.target.value))}
                  className="w-full accent-red-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-green-500">Green Byte: {green}</span>
                  <span className="text-muted-foreground font-mono">{green.toString(2).padStart(8, '0')}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={green}
                  onChange={(e) => setGreen(Number(e.target.value))}
                  className="w-full accent-green-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-foreground">Channel 3 (Blue): {blue}</span>
                  <span className="text-muted-foreground font-mono">{blue.toString(2).padStart(8, '0')}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={blue}
                  onChange={(e) => setBlue(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Color Swatch & Byte Representation */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-card gap-4">
              <div
                className="w-28 h-28 rounded-2xl shadow-xl border-2 border-white/20 transition-all"
                style={{ backgroundColor: `rgb(${red}, ${green}, ${blue})` }}
              />
              <div className="text-center space-y-1">
                <span className="text-xs uppercase font-mono text-muted-foreground block">
                  Hex Color Code:
                </span>
                <span className="text-xl font-mono font-bold text-foreground">
                  #{red.toString(16).padStart(2, '0').toUpperCase()}
                  {green.toString(16).padStart(2, '0').toUpperCase()}
                  {blue.toString(16).padStart(2, '0').toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground block">
                  3 Bytes in RAM = 24 bits of color data
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
