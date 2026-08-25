'use client';

import React, { useState } from 'react';
import { Activity, Play, RotateCcw, Zap, Sliders, Smartphone, Cpu, ShieldCheck, AlertCircle } from 'lucide-react';

export function BridgeSim() {
  const [engine, setEngine] = useState<'legacy' | 'jsi' | 'flutter'>('legacy');
  const [eventRateHz, setEventRateHz] = useState<number>(60);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [metrics, setMetrics] = useState({
    sentPackets: 0,
    queueDepth: 0,
    bridgeLatencyMs: 0,
    droppedFrames: 0,
    fps: 60,
  });

  const runTraffic = () => {
    setSimulating(true);
    let count = 0;
    let dropped = 0;

    const interval = setInterval(() => {
      count += 1;
      const queue = engine === 'legacy' ? Math.min(45, count * 4) : 0;
      const latency = engine === 'legacy' ? 16.6 + count * 2.5 : engine === 'jsi' ? 0.2 : 0.05;
      
      if (engine === 'legacy') {
        dropped += Math.floor(Math.random() * 2) + 1;
      }

      const currentFps = engine === 'legacy' ? Math.max(28, 60 - count * 3) : engine === 'jsi' ? 60 : 120;

      setMetrics({
        sentPackets: count * (eventRateHz / 10),
        queueDepth: queue,
        bridgeLatencyMs: Number(latency.toFixed(2)),
        droppedFrames: dropped,
        fps: currentFps,
      });

      if (count >= 12) {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 120);
  };

  const resetSim = (newEngine?: 'legacy' | 'jsi' | 'flutter') => {
    if (newEngine) setEngine(newEngine);
    setMetrics({
      sentPackets: 0,
      queueDepth: 0,
      bridgeLatencyMs: 0,
      droppedFrames: 0,
      fps: (newEngine || engine) === 'flutter' ? 120 : 60,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cp-primary)]/30 bg-[var(--cp-primary)]/10 text-[var(--cp-primary)] text-xs font-mono">
          <Activity className="w-3.5 h-3.5" /> High-Frequency Gesture &amp; Sensor Simulator
        </div>
        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--cp-text)]">
          Bridge Serialization <span className="text-[var(--cp-primary)] cp-glow">vs JSI Direct C++</span>
        </h1>
        <p className="text-sm md:text-base text-[var(--cp-muted)] max-w-2xl leading-relaxed">
          Stress test message queues under high-frequency 60Hz and 120Hz gesture traffic. Observe JSON batching congestion vs direct C++ HostObject pointers.
        </p>
      </div>

      {/* Engine Selector */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-mono text-[var(--cp-muted)]">Target Architecture:</span>
        {[
          ['legacy', 'Legacy React Native (Asynchronous JSON Bridge)'],
          ['jsi', 'New Architecture (JSI C++ HostObjects)'],
          ['flutter', 'Flutter Engine (Direct Impeller GPU Canvas)'],
        ].map(([eId, label]) => (
          <button
            key={eId}
            onClick={() => resetSim(eId as 'legacy' | 'jsi' | 'flutter')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
              engine === eId
                ? 'bg-[var(--cp-primary)] text-white font-bold shadow-md'
                : 'border border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] text-[var(--cp-muted)] hover:text-[var(--cp-text)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Simulator Controls */}
        <div className="lg:col-span-5 rounded-2xl border border-[var(--cp-border)] bg-[var(--cp-surface)] p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--cp-border-subtle)] pb-4">
            <span className="text-[var(--cp-primary)] uppercase tracking-wider font-bold">
              Traffic Generator Configuration
            </span>
            <button
              onClick={() => resetSim()}
              className="text-[10px] text-[var(--cp-muted)] hover:text-[var(--cp-primary)] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px]">
                <span className="text-[var(--cp-muted)]">Gesture Sample Frequency</span>
                <span className="font-bold text-[var(--cp-primary)]">{eventRateHz} Hz (Events / sec)</span>
              </div>
              <input
                type="range"
                min="30"
                max="120"
                step="30"
                value={eventRateHz}
                onChange={(e) => setEventRateHz(Number(e.target.value))}
                className="w-full accent-[var(--cp-primary)] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[var(--cp-muted)]">
                <span>30Hz (Touch tap)</span>
                <span>60Hz (Pan Drag)</span>
                <span>120Hz (ProMotion)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-bg)] border border-[var(--cp-border-subtle)] space-y-2 text-[11px]">
              <span className="text-[var(--cp-primary)] font-bold">Traffic Type:</span>
              <p className="text-[var(--cp-muted)] leading-relaxed text-[10px]">
                Continuous 2D pan gesture coordinates: <code>[touchId, pageX, pageY, velocityX, velocityY, timestamp]</code>.
              </p>
            </div>

            <button
              onClick={runTraffic}
              disabled={simulating}
              className="w-full py-3 rounded-lg bg-[var(--cp-primary)] text-white font-bold hover:bg-[var(--cp-primary-hover)] transition-all shadow-md active:scale-95 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {simulating ? 'Injecting High-Rate Stream...' : 'Start Gesture Stream'}
            </button>
          </div>
        </div>

        {/* Right Telemetry & Queue Monitor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-Time Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Frame Rate</span>
              <div className={`text-xl font-bold ${metrics.fps >= 60 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metrics.fps} FPS
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Bridge Latency</span>
              <div className="text-xl font-bold text-[var(--cp-sky)]">
                {metrics.bridgeLatencyMs} ms
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Queue Depth</span>
              <div className={`text-xl font-bold ${metrics.queueDepth > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {metrics.queueDepth} pkts
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border-subtle)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Dropped Frames</span>
              <div className={`text-xl font-bold ${metrics.droppedFrames > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {metrics.droppedFrames}
              </div>
            </div>
          </div>

          {/* Queue Visualization Bar */}
          <div className="p-6 rounded-2xl border border-[var(--cp-border-subtle)] bg-[var(--cp-surface)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--cp-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" /> Asynchronous Queue Congestion Monitor
              </span>
              <span className="text-[10px] text-[var(--cp-muted)]">
                {engine === 'legacy' ? 'JSON BUFFER' : 'C++ DIRECT POINTER'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-bg)] border border-[var(--cp-border-subtle)] space-y-3">
              <div className="h-6 rounded-lg bg-[var(--cp-surface-2)] overflow-hidden flex">
                {metrics.queueDepth > 0 ? (
                  <div
                    className="h-full bg-amber-500 transition-all duration-100 flex items-center justify-center text-[10px] text-black font-bold"
                    style={{ width: `${Math.min(100, metrics.queueDepth * 2.5)}%` }}
                  >
                    Queue: {metrics.queueDepth}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-emerald-400">
                    ✓ Queue Clear — Zero Serialization Overhead
                  </div>
                )}
              </div>

              <div className="text-[10px] text-[var(--cp-muted)] leading-relaxed">
                {engine === 'legacy' && (
                  <span className="text-amber-400">
                    ⚠ JSON serialization causes queue backlog on JS thread during fast gestures, triggering frame drops.
                  </span>
                )}
                {engine === 'jsi' && (
                  <span className="text-emerald-400">
                    ✓ JSI invokes C++ HostObjects synchronously on the same thread stack with zero queue latency.
                  </span>
                )}
                {engine === 'flutter' && (
                  <span className="text-sky-400">
                    ✓ Dart compiles to ARM machine code and draws directly to the GPU surface at 120 FPS.
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
