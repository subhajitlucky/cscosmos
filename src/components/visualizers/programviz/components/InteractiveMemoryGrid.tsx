'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Edit3, ArrowDownToLine, RotateCcw, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MemoryCell {
  address: number;
  hexAddr: string;
  value: number;
  label?: string;
  type: 'code' | 'data' | 'free';
}

const INITIAL_RAM: MemoryCell[] = [
  { address: 0, hexAddr: '0x00', value: 0x48, label: 'MOV R0, 15', type: 'code' },
  { address: 1, hexAddr: '0x01', value: 0x49, label: 'MOV R1, 27', type: 'code' },
  { address: 2, hexAddr: '0x02', value: 0x50, label: 'ADD R0, R1', type: 'code' },
  { address: 3, hexAddr: '0x03', value: 0x58, label: 'STORE [0x10]', type: 'code' },
  { address: 4, hexAddr: '0x04', value: 0xFF, label: 'HALT', type: 'code' },
  { address: 5, hexAddr: '0x05', value: 0x00, type: 'free' },
  { address: 6, hexAddr: '0x06', value: 0x00, type: 'free' },
  { address: 7, hexAddr: '0x07', value: 0x00, type: 'free' },
  { address: 8, hexAddr: '0x08', value: 0x00, type: 'free' },
  { address: 9, hexAddr: '0x09', value: 0x00, type: 'free' },
  { address: 10, hexAddr: '0x0A', value: 0x00, type: 'free' },
  { address: 11, hexAddr: '0x0B', value: 0x00, type: 'free' },
  { address: 12, hexAddr: '0x0C', value: 0x00, type: 'free' },
  { address: 13, hexAddr: '0x0D', value: 0x00, type: 'free' },
  { address: 14, hexAddr: '0x0E', value: 0x00, type: 'free' },
  { address: 15, hexAddr: '0x0F', value: 0x00, type: 'free' },
  { address: 16, hexAddr: '0x10', value: 42, label: 'result = 42', type: 'data' },
  { address: 17, hexAddr: '0x11', value: 15, label: 'var a = 15', type: 'data' },
  { address: 18, hexAddr: '0x12', value: 27, label: 'var b = 27', type: 'data' },
  { address: 19, hexAddr: '0x13', value: 0x00, type: 'free' },
  { address: 20, hexAddr: '0x14', value: 0x00, type: 'free' },
  { address: 21, hexAddr: '0x15', value: 0x00, type: 'free' },
  { address: 22, hexAddr: '0x16', value: 0x00, type: 'free' },
  { address: 23, hexAddr: '0x17', value: 0x00, type: 'free' },
  { address: 24, hexAddr: '0x18', value: 0x00, type: 'free' },
  { address: 25, hexAddr: '0x19', value: 0x00, type: 'free' },
  { address: 26, hexAddr: '0x1A', value: 0x00, type: 'free' },
  { address: 27, hexAddr: '0x1B', value: 0x00, type: 'free' },
  { address: 28, hexAddr: '0x1C', value: 0x00, type: 'free' },
  { address: 29, hexAddr: '0x1D', value: 0x00, type: 'free' },
  { address: 30, hexAddr: '0x1E', value: 0x00, type: 'free' },
  { address: 31, hexAddr: '0x1F', value: 0x00, type: 'free' },
];

export function InteractiveMemoryGrid() {
  const { theme } = useTheme();
  const [ram, setRam] = useState<MemoryCell[]>(INITIAL_RAM);
  const [selectedAddr, setSelectedAddr] = useState<number>(16); // 0x10 by default
  const [inputValue, setInputValue] = useState<string>('99');
  const [customLabel, setCustomLabel] = useState<string>('user_val');
  const [lastAction, setLastAction] = useState<string>('Selected address 0x10. Currently holding 42.');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const selectedCell = ram.find((c) => c.address === selectedAddr) ?? ram[0];

  const handleWrite = () => {
    const numeric = parseInt(inputValue, 10);
    const validVal = isNaN(numeric) ? 0 : Math.max(0, Math.min(255, numeric));

    setRam((prev) =>
      prev.map((cell) =>
        cell.address === selectedAddr
          ? {
              ...cell,
              value: validVal,
              label: customLabel.trim() || undefined,
              type: 'data',
            }
          : cell
      )
    );

    setLastAction(
      `Wrote value ${validVal} (0x${validVal.toString(16).toUpperCase().padStart(2, '0')}) into address ${selectedCell.hexAddr}.`
    );
  };

  const handleReset = () => {
    setRam(INITIAL_RAM);
    setSelectedAddr(16);
    setInputValue('99');
    setCustomLabel('user_val');
    setLastAction('Reset memory to initial state.');
  };

  return (
    <div className={cn(
      "rounded-2xl border p-6 sm:p-8 space-y-6 shadow-xl transition-colors",
      theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
    )}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5 border-border/80">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-green-500 font-bold">
            Interactive Hardware Simulator
          </span>
          <h3 className="text-xl font-bold text-foreground">
            Interactive RAM Address Grid
          </h3>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset RAM
        </button>
      </div>

      <p className="text-sm text-muted-foreground">
        Every byte in RAM has a unique numerical <strong>address</strong> (like a house number). Click any address in the grid below to inspect, read, or write data into that specific physical location.
      </p>

      {/* Grid Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-green-500/20 border border-green-500" />
          <span className="text-muted-foreground">Code Segment (Instructions)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-blue-500/20 border border-blue-500" />
          <span className="text-muted-foreground">Data Segment (Variables)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-muted border border-border" />
          <span className="text-muted-foreground">Free / Unused Memory</span>
        </div>
      </div>

      {/* Main Memory Grid (32 Bytes: 4 rows x 8 columns) */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5">
          {ram.map((cell) => {
            const isSelected = cell.address === selectedAddr;
            return (
              <button
                key={cell.address}
                type="button"
                onClick={() => {
                  setSelectedAddr(cell.address);
                  setLastAction(`Read address ${cell.hexAddr}: holds value ${cell.value} (0x${cell.value.toString(16).toUpperCase().padStart(2, '0')}).`);
                }}
                className={cn(
                  "p-2.5 rounded-xl border flex flex-col items-center justify-between min-h-[72px] transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  isSelected
                    ? "ring-2 ring-blue-500 border-blue-500 bg-blue-500/15 scale-[1.04] shadow-md z-10"
                    : cell.type === 'code'
                    ? "bg-green-500/10 border-green-500/30 hover:border-green-500"
                    : cell.type === 'data'
                    ? "bg-blue-500/10 border-blue-500/30 hover:border-blue-500"
                    : "bg-card border-border hover:border-muted-foreground/40"
                )}
                aria-label={`Address ${cell.hexAddr}, value ${cell.value}`}
              >
                <span className="text-[10px] font-mono font-bold text-muted-foreground">
                  {cell.hexAddr}
                </span>

                <span className={cn(
                  "text-sm sm:text-base font-extrabold font-mono",
                  isSelected
                    ? "text-blue-500"
                    : cell.type === 'code'
                    ? "text-green-600 dark:text-green-400"
                    : cell.type === 'data'
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-foreground"
                )}>
                  {cell.value.toString(16).toUpperCase().padStart(2, '0')}
                </span>

                <span className="text-[9px] font-mono text-muted-foreground truncate max-w-full">
                  {cell.label || '0'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Cell Inspector & Write Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl border border-border bg-card">
        {/* Cell Telemetry */}
        <div className="space-y-3 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4 border-border">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-bold text-foreground">
              Address Inspector: <span className="font-mono text-blue-500">{selectedCell.hexAddr}</span>
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
              <span className="text-[10px] text-muted-foreground block">Hex Value</span>
              <span className="font-mono font-bold text-foreground">
                0x{selectedCell.value.toString(16).toUpperCase().padStart(2, '0')}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
              <span className="text-[10px] text-muted-foreground block">Decimal</span>
              <span className="font-mono font-bold text-foreground">
                {selectedCell.value}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/50 border border-border">
              <span className="text-[10px] text-muted-foreground block">Binary Byte</span>
              <span className="font-mono font-bold text-foreground text-[10px]">
                {selectedCell.value.toString(2).padStart(8, '0')}
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            <strong>Role:</strong> {selectedCell.label ? selectedCell.label : 'Unused RAM address'}
          </p>

          <div className="text-xs p-2 rounded bg-muted/30 font-mono text-foreground border border-border/60">
            {lastAction}
          </div>
        </div>

        {/* Write to Memory Controls */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-emerald-500" />
            Store / Write Value to {selectedCell.hexAddr}
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mem-val-input" className="text-[11px] font-bold text-muted-foreground block mb-1">
                Value (0–255):
              </label>
              <input
                id="mem-val-input"
                type="number"
                min={0}
                max={255}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="mem-label-input" className="text-[11px] font-bold text-muted-foreground block mb-1">
                Variable Label (Optional):
              </label>
              <input
                id="mem-label-input"
                type="text"
                maxLength={12}
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="w-full px-3 py-1.5 text-sm font-mono rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. score"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleWrite}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            Write Byte into RAM Address {selectedCell.hexAddr}
          </button>
        </div>
      </div>

      {/* Optional Collapsible Advanced Deep-Dive: Virtual Memory & MMU */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="w-full flex items-center justify-between p-4 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors text-left"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold text-foreground">
              Optional Advanced Topic: Virtual Memory &amp; The Memory Management Unit (MMU)
            </span>
          </div>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 mt-2 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-3 text-xs leading-relaxed text-muted-foreground">
                <h5 className="font-bold text-foreground text-sm">
                  Do programs touch real physical RAM addresses directly?
                </h5>
                <p>
                  In modern operating systems (Linux, macOS, Windows), <strong>no program ever sees real physical RAM addresses</strong>. If every program could touch physical RAM directly, a rogue program could read your browser passwords or overwrite the operating system kernel!
                </p>
                <p>
                  Instead, every process is given an illusion called <strong>Virtual Memory</strong>. The CPU contains a dedicated hardware chip called the <strong>Memory Management Unit (MMU)</strong>. Whenever your program reads address <code className="font-mono">0x10</code>, the MMU consults a <strong>Page Table</strong> to translate that virtual address into a physical RAM chip address on the fly.
                </p>
                <p>
                  If a program tries to access memory it doesn't own, the MMU raises a hardware fault — causing the OS to instantly terminate the program with a <strong>Segmentation Fault (SIGSEGV)</strong>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
