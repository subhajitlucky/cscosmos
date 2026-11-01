'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Cpu,
  FlaskConical,
  HardDrive,
  RefreshCw,
  Terminal,
  Waves,
} from 'lucide-react';
import { LibuvEventLoopStepper } from '../components/LibuvEventLoopStepper';
import { ThreadPoolVisualizer } from '../components/ThreadPoolVisualizer';
import { StreamsBackpressureLab } from '../components/StreamsBackpressureLab';
import { ClusterVsWorkerLab } from '../components/ClusterVsWorkerLab';
import { V8MemoryVisualizer } from '../components/V8MemoryVisualizer';
import { EventEmitterVisualizer } from '../components/EventEmitterVisualizer';
import { NodePlayground } from '../components/NodePlayground';

const LAB_TABS = [
  { id: 'event-loop', label: 'Event Loop Stepper', icon: RefreshCw },
  { id: 'streams', label: 'Streams & Backpressure', icon: Waves },
  { id: 'threads', label: 'Thread Pool & Clustering', icon: Cpu },
  { id: 'memory', label: 'V8 Memory & Leaks', icon: HardDrive },
  { id: 'playground', label: 'Trace Playground', icon: Terminal },
];

export default function Lab() {
  const [activeTab, setActiveTab] = useState<string>('event-loop');

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest">
          <FlaskConical className="w-3.5 h-3.5" /> Interactive Sandbox Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Node.js Runtime Simulation Lab
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Interactive evaluation of the 6-phase Libuv event loop, thread pool offloading, stream backpressure buffers, and V8 generational garbage collection.
        </p>
      </div>

      {/* Lab Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
        {LAB_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-emerald-500/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Lab Content */}
      <div className="pt-2">
        {activeTab === 'event-loop' && (
          <div className="space-y-6">
            <LibuvEventLoopStepper />
          </div>
        )}

        {activeTab === 'streams' && (
          <div className="space-y-6">
            <StreamsBackpressureLab />
          </div>
        )}

        {activeTab === 'threads' && (
          <div className="space-y-8">
            <ThreadPoolVisualizer />
            <ClusterVsWorkerLab />
          </div>
        )}

        {activeTab === 'memory' && (
          <div className="space-y-8">
            <V8MemoryVisualizer />
            <EventEmitterVisualizer />
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="space-y-6">
            <NodePlayground />
          </div>
        )}
      </div>
    </div>
  );
}
