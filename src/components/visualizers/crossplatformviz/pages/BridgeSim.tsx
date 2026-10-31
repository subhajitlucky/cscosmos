'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Play,
  RotateCcw,
  Zap,
  Sliders,
  Smartphone,
  Cpu,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Info
} from 'lucide-react';

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
    const rateFactor = eventRateHz / 60;

    const interval = setInterval(() => {
      count += 1;
      const queue = engine === 'legacy' ? Math.min(48, Math.round(count * 4 * rateFactor)) : 0;
      const latency = engine === 'legacy' ? 16.6 + count * 2.5 * rateFactor : engine === 'jsi' ? 0.2 : 0.05;

      if (engine === 'legacy') {
        dropped += Math.max(1, Math.round((Math.floor(Math.random() * 2) + 1) * rateFactor));
      }

      const currentFps = engine === 'legacy' ? Math.max(26, Math.round(60 - count * 3 * rateFactor)) : engine === 'jsi' ? 60 : 120;

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--cp-border)] bg-[var(--cp-surface-2)] text-[var(--cp-primary)] text-xs font-mono font-medium">
          <Activity className="w-3.5 h-3.5" /> High-Frequency Gesture &amp; Sensor Stress Lab
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--cp-text)]">
          Bridge Serialization vs JSI Direct C++ Pointers
        </h1>
        <p className="text-sm md:text-base text-[var(--cp-muted)] max-w-2xl leading-relaxed">
          Stress-test mobile message queues under high-frequency 60Hz and 120Hz gesture traffic. Compare JSON batching queues with direct synchronous C++ HostObject memory invocation.
        </p>
      </div>

      {/* Target Architecture Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-xs font-mono text-[var(--cp-muted)]">Target Architecture:</span>
        <div className="flex flex-wrap gap-2">
          {[
            ['legacy', 'Legacy Bridge (JSON Queue)'],
            ['jsi', 'New Architecture (JSI HostObjects)'],
            ['flutter', 'Flutter Engine (Impeller GPU Canvas)'],
          ].map(([eId, label]) => (
            <button
              key={eId}
              onClick={() => resetSim(eId as 'legacy' | 'jsi' | 'flutter')}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-colors ${
                engine === eId
                  ? 'bg-[var(--cp-primary)] text-white font-bold'
                  : 'border border-[var(--cp-border)] bg-[var(--cp-surface)] text-[var(--cp-muted)] hover:text-[var(--cp-text)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-mono text-xs">
        {/* Left Simulator Controls */}
        <div className="lg:col-span-5 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--cp-border)] pb-4">
            <span className="text-[var(--cp-primary)] uppercase tracking-wider font-bold">
              Traffic Generator Configuration
            </span>
            <button
              onClick={() => resetSim()}
              className="text-[10px] text-[var(--cp-muted)] hover:text-[var(--cp-primary)] flex items-center gap-1 font-bold"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--cp-muted)]">Gesture Sampling Frequency:</span>
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
              <div className="flex justify-between text-[10px] text-[var(--cp-muted)]">
                <span>30Hz (Tap)</span>
                <span>60Hz (Pan Drag)</span>
                <span>90Hz (Swipe)</span>
                <span>120Hz (ProMotion)</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[var(--cp-surface-2)] border border-[var(--cp-border)] space-y-2 text-xs">
              <span className="text-[var(--cp-text)] font-bold">Simulated Payload:</span>
              <p className="text-[var(--cp-muted)] leading-relaxed text-[11px] font-sans">
                Continuous 2D pan touch coordinates: <code>[touchId, pageX, pageY, velocityX, velocityY, timestamp]</code>.
              </p>
            </div>

            <button
              onClick={runTraffic}
              disabled={simulating}
              className="w-full py-3 rounded-lg bg-[var(--cp-primary)] text-white font-bold hover:bg-[var(--cp-primary-hover)] transition-colors active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {simulating ? 'Injecting High-Rate Stream...' : 'Start Gesture Stream'}
            </button>
          </div>
        </div>

        {/* Right Telemetry & Queue Monitor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Real-Time Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Events Emitted</span>
              <div className="text-xl font-bold text-[var(--cp-text)]">
                {metrics.sentPackets} pkts
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Frame Rate</span>
              <div className={`text-xl font-bold ${metrics.fps >= 60 ? 'text-[var(--cp-emerald)]' : 'text-[var(--cp-rose)]'}`}>
                {metrics.fps} FPS
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Bridge Latency</span>
              <div className="text-xl font-bold text-[var(--cp-sky)]">
                {metrics.bridgeLatencyMs} ms
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Queue Depth</span>
              <div className={`text-xl font-bold ${metrics.queueDepth > 0 ? 'text-[var(--cp-amber)]' : 'text-[var(--cp-emerald)]'}`}>
                {metrics.queueDepth} pkts
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--cp-surface)] border border-[var(--cp-border)] space-y-1">
              <span className="text-[10px] text-[var(--cp-muted)]">Dropped Frames</span>
              <div className={`text-xl font-bold ${metrics.droppedFrames > 0 ? 'text-[var(--cp-rose)]' : 'text-[var(--cp-emerald)]'}`}>
                {metrics.droppedFrames}
              </div>
            </div>
          </div>

          {/* Queue Visualization Bar */}
          <div className="p-6 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--cp-primary)] uppercase tracking-wider font-bold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5" /> Asynchronous Queue Congestion Monitor
              </span>
              <span className="text-[10px] text-[var(--cp-muted)] font-bold">
                {engine === 'legacy' ? 'JSON ASYNC BUFFER' : engine === 'jsi' ? 'C++ SYNCHRONOUS CALL' : 'GPU DIRECT COMMAND'}
              </span>
            </div>

            <div className="p-4 rounded-lg bg-[var(--cp-surface-2)] border border-[var(--cp-border)] space-y-3">
              <div className="h-6 rounded bg-[var(--cp-surface)] border border-[var(--cp-border)] overflow-hidden flex">
                {metrics.queueDepth > 0 ? (
                  <div
                    className="h-full bg-[var(--cp-amber)] transition-all duration-100 flex items-center justify-center text-[10px] text-black font-bold"
                    style={{ width: `${Math.min(100, metrics.queueDepth * 2.5)}%` }}
                  >
                    Backlog: {metrics.queueDepth} JSON packets
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--cp-emerald)] font-bold">
                    ✓ Queue Empty — Zero Serialization Delay
                  </div>
                )}
              </div>

              <div className="text-[11px] text-[var(--cp-muted)] leading-relaxed font-sans">
                {engine === 'legacy' && (
                  <span className="text-[var(--cp-amber)] font-medium">
                    ⚠ JSON serialization queues events across threads asynchronously. At {eventRateHz}Hz, events accumulate faster than the 16.6ms frame budget, causing dropped frames and lag.
                  </span>
                )}
                {engine === 'jsi' && (
                  <span className="text-[var(--cp-emerald)] font-medium">
                    ✓ JSI invokes C++ HostObjects synchronously on the same thread stack. Coordinates are passed by reference in memory with 0ms queue latency.
                  </span>
                )}
                {engine === 'flutter' && (
                  <span className="text-[var(--cp-sky)] font-medium">
                    ✓ Dart compiles to ARM machine code and draws directly to the GPU surface via Impeller at 120 FPS without crossing an OEM widget boundary.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Educational Takeaway Box */}
          <div className="p-5 rounded-xl border border-[var(--cp-border)] bg-[var(--cp-surface)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--cp-text)]">
              <Info className="w-4 h-4 text-[var(--cp-primary)]" />
              <span>Key Systems Takeaway for Students:</span>
            </div>
            <p className="text-xs text-[var(--cp-muted)] font-sans leading-relaxed">
              When building high-touch experiences (like 120Hz gesture drawing, games, or complex charts), asynchronous serialization bridges cannot meet frame deadlines. Direct synchronous memory invocation (RN JSI) or direct GPU rasterization (Flutter Impeller) is mandatory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
