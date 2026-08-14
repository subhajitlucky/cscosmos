'use client';

import React, { useState } from 'react';
import { HardDrive, Play, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';

interface CacheItem {
  key: string;
  value: string;
  lastAccessed: number;
  freq: number;
  ttlRemaining: number;
}

const INITIAL_KEYS: CacheItem[] = [
  { key: 'user:101', value: 'Alice', lastAccessed: 10, freq: 8, ttlRemaining: 300 },
  { key: 'user:102', value: 'Bob', lastAccessed: 2, freq: 1, ttlRemaining: 60 },
  { key: 'user:103', value: 'Charlie', lastAccessed: 8, freq: 12, ttlRemaining: 180 },
  { key: 'product:99', value: 'Keyboard', lastAccessed: 1, freq: 2, ttlRemaining: 400 },
];

export function EvictionSimulator() {
  const [keys, setKeys] = useState<CacheItem[]>(INITIAL_KEYS);
  const [policy, setPolicy] = useState<'allkeys-lru' | 'allkeys-lfu' | 'volatile-ttl'>('allkeys-lru');
  const [log, setLog] = useState<string>('Memory Limit: 4 Keys. Click "Add Key (Trigger Eviction)" to see which key is reclaimed.');

  const addKeyWithEviction = () => {
    const newKeyName = `session:${Math.floor(Math.random() * 900) + 100}`;
    const newKey: CacheItem = {
      key: newKeyName,
      value: 'TokenData',
      lastAccessed: 15,
      freq: 1,
      ttlRemaining: 3600
    };

    // If already 4 keys, evict 1 based on policy
    if (keys.length >= 4) {
      let evictedKey: CacheItem;
      if (policy === 'allkeys-lru') {
        // Find key with lowest lastAccessed
        evictedKey = [...keys].sort((a, b) => a.lastAccessed - b.lastAccessed)[0];
        setLog(`🧹 EVICTED [${evictedKey.key}] via allkeys-lru (Least recently accessed: t=${evictedKey.lastAccessed}). Inserted ${newKeyName}.`);
      } else if (policy === 'allkeys-lfu') {
        // Find key with lowest frequency
        evictedKey = [...keys].sort((a, b) => a.freq - b.freq)[0];
        setLog(`🧹 EVICTED [${evictedKey.key}] via allkeys-lfu (Lowest frequency count: ${evictedKey.freq} hits). Inserted ${newKeyName}.`);
      } else {
        // Shortest TTL
        evictedKey = [...keys].sort((a, b) => a.ttlRemaining - b.ttlRemaining)[0];
        setLog(`🧹 EVICTED [${evictedKey.key}] via volatile-ttl (Shortest TTL remaining: ${evictedKey.ttlRemaining}s). Inserted ${newKeyName}.`);
      }

      setKeys((prev) => [...prev.filter((k) => k.key !== evictedKey.key), newKey]);
    } else {
      setKeys((prev) => [...prev, newKey]);
      setLog(`Inserted ${newKeyName} into RAM. Current keys: ${keys.length + 1}/4`);
    }
  };

  const reset = () => {
    setKeys(INITIAL_KEYS);
    setLog('Memory reset to initial 4 keys.');
  };

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-6 sm:p-8 space-y-6 shadow-xl my-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400">
              Redis Memory Reclamation
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Maxmemory Eviction Policy Simulator
            </h3>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold">
          Max Capacity: 4 Keys (100% Full)
        </span>
      </div>

      {/* Policy Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { id: 'allkeys-lru' as const, name: '1. allkeys-lru', desc: 'Evict least recently accessed key' },
          { id: 'allkeys-lfu' as const, name: '2. allkeys-lfu', desc: 'Evict least frequently accessed key' },
          { id: 'volatile-ttl' as const, name: '3. volatile-ttl', desc: 'Evict key with shortest remaining TTL' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setPolicy(item.id)}
            className={`p-3.5 rounded-2xl border text-left font-mono text-xs transition-all ${
              policy === item.id
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-md'
                : 'bg-card border-border text-foreground hover:border-amber-500'
            }`}
          >
            <div className="font-bold">{item.name}</div>
            <div className={`text-[10px] ${policy === item.id ? 'text-slate-900' : 'text-muted-foreground'}`}>
              {item.desc}
            </div>
          </button>
        ))}
      </div>

      {/* Keys in RAM Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {keys.map((k) => (
          <div
            key={k.key}
            className="p-4 rounded-2xl bg-card border border-border shadow-sm space-y-2 font-mono text-xs"
          >
            <div className="flex items-center justify-between border-b border-border pb-1.5">
              <span className="font-bold text-red-600 dark:text-red-400">{k.key}</span>
              <span className="text-[10px] text-muted-foreground">RAM</span>
            </div>
            <div className="text-foreground">Value: {k.value}</div>
            <div className="text-[11px] text-muted-foreground space-y-0.5 pt-1">
              <div>• Last accessed: t={k.lastAccessed}s ago</div>
              <div>• Frequency: {k.freq} hits</div>
              <div>• TTL Remaining: {k.ttlRemaining}s</div>
            </div>
          </div>
        ))}
      </div>

      {/* Trace Log */}
      <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800">
        <span className="text-amber-400 font-bold">Eviction Log:</span> {log}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 pt-2 border-t border-amber-500/20">
        <button
          onClick={addKeyWithEviction}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Key (Trigger Eviction)</span>
        </button>

        <button
          onClick={reset}
          className="px-4 py-2.5 rounded-2xl border border-border hover:bg-card text-foreground text-xs font-bold transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset RAM</span>
        </button>
      </div>
    </div>
  );
}
