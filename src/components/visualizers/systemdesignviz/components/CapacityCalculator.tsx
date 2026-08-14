'use client';

import React, { useState } from 'react';
import { Calculator, Database, HardDrive, Network, Server, Sparkles, TrendingUp, Zap } from 'lucide-react';

export function CapacityCalculator() {
  const [dauM, setDauM] = useState<number>(50); // 50M DAU
  const [readsPerUser, setReadsPerUser] = useState<number>(40);
  const [writesPerUser, setWritesPerUser] = useState<number>(4);
  const [itemSizeKb, setItemSizeKb] = useState<number>(2); // 2 KB per record

  // Calculations
  const secondsPerDay = 86400;
  const totalReads = dauM * 1000000 * readsPerUser;
  const totalWrites = dauM * 1000000 * writesPerUser;

  const avgReadQps = Math.round(totalReads / secondsPerDay);
  const peakReadQps = Math.round(avgReadQps * 2.5);

  const avgWriteQps = Math.round(totalWrites / secondsPerDay);
  const peakWriteQps = Math.round(avgWriteQps * 2.5);

  const dailyStorageGb = Math.round((totalWrites * itemSizeKb) / (1024 * 1024));
  const yearlyStorageTb = ((dailyStorageGb * 365) / 1024).toFixed(1);

  const dailyReadDataGb = (totalReads * itemSizeKb) / (1024 * 1024);
  const cache8020Gb = Math.round(dailyReadDataGb * 0.2); // 20% of daily read data

  return (
    <div className="rounded-3xl border border-indigo-500/30 bg-indigo-500/5 dark:bg-indigo-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Staff Architect Estimation Engine
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Back-of-the-Envelope Capacity &amp; Scale Calculator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
          Scale: {dauM}M DAU
        </span>
      </div>

      {/* Interactive Parameter Sliders */}
      <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs">
        {/* DAU */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex justify-between font-bold">
            <span>Daily Active Users (DAU):</span>
            <span className="text-indigo-500">{dauM} Million</span>
          </div>
          <input
            type="range"
            min="1"
            max="200"
            step="1"
            value={dauM}
            onChange={(e) => setDauM(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Reads per user */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex justify-between font-bold">
            <span>Reads / User / Day:</span>
            <span className="text-indigo-500">{readsPerUser} Reads</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={readsPerUser}
            onChange={(e) => setReadsPerUser(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Writes per user */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex justify-between font-bold">
            <span>Writes / User / Day:</span>
            <span className="text-indigo-500">{writesPerUser} Writes</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={writesPerUser}
            onChange={(e) => setWritesPerUser(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Payload Size */}
        <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex justify-between font-bold">
            <span>Item Payload Size:</span>
            <span className="text-indigo-500">{itemSizeKb} KB</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="10"
            step="0.5"
            value={itemSizeKb}
            onChange={(e) => setItemSizeKb(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>

      {/* Output Estimates Grid */}
      <div className="grid sm:grid-cols-4 gap-4 font-mono text-xs">
        {/* Read QPS */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">Peak Read QPS (2.5x):</span>
          <div className="text-xl font-extrabold text-sky-400">{peakReadQps.toLocaleString()} QPS</div>
          <p className="text-[10px] text-slate-500">Avg: {avgReadQps.toLocaleString()} QPS</p>
        </div>

        {/* Write QPS */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">Peak Write QPS (2.5x):</span>
          <div className="text-xl font-extrabold text-amber-400">{peakWriteQps.toLocaleString()} QPS</div>
          <p className="text-[10px] text-slate-500">Avg: {avgWriteQps.toLocaleString()} QPS</p>
        </div>

        {/* Storage */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">Yearly Storage:</span>
          <div className="text-xl font-extrabold text-emerald-400">{yearlyStorageTb} TB / Year</div>
          <p className="text-[10px] text-slate-500">+{dailyStorageGb} GB / Day</p>
        </div>

        {/* Cache Size */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-slate-400 font-bold block">80/20 RAM Cache Size:</span>
          <div className="text-xl font-extrabold text-indigo-400">{cache8020Gb} GB RAM</div>
          <p className="text-[10px] text-slate-500">20% of daily read data</p>
        </div>
      </div>
    </div>
  );
}
