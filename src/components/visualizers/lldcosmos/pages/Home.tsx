'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Box, Activity, Layers, ArrowUpRight, CheckCircle2, RotateCcw, Play, Zap, Cpu, ShieldCheck, ArrowUp, ArrowDown } from 'lucide-react';
import { lldTopics } from '../data/topics';

export function Home() {
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [targetFloor, setTargetFloor] = useState<number>(4);
  const [strategy, setStrategy] = useState<'SCAN' | 'SSTF' | 'FCFS'>('SCAN');
  const [elevatorState, setElevatorState] = useState<'IDLE' | 'MOVING_UP' | 'MOVING_DOWN' | 'DOORS_OPEN'>('IDLE');
  const [observersNotified, setObserversNotified] = useState<string[]>([
    'FloorDisplayPanel: Floor 1',
    'AudioChime: Standby',
    'WeightSensor: 0 kg (OK)'
  ]);

  const requestFloor = (floor: number) => {
    if (floor === currentFloor || elevatorState !== 'IDLE') return;
    setTargetFloor(floor);
    const movingDir = floor > currentFloor ? 'MOVING_UP' : 'MOVING_DOWN';
    setElevatorState(movingDir);

    setObserversNotified([
      `ElevatorController: Strategy ${strategy} dispatched Car to Floor ${floor}`,
      `DisplayPanel: ${movingDir.replace('_', ' ')}`,
      `AudioChime: Chime active`
    ]);

    // Simulate multi-floor transit
    const transitInterval = setInterval(() => {
      setCurrentFloor(prev => {
        if (prev < floor) return prev + 1;
        if (prev > floor) return prev - 1;
        return prev;
      });
    }, 600);

    setTimeout(() => {
      clearInterval(transitInterval);
      setCurrentFloor(floor);
      setElevatorState('DOORS_OPEN');
      setObserversNotified([
        `FloorDisplayPanel: Arrived at Floor ${floor}`,
        `DoorMechanism: Doors Opened (State: DOORS_OPEN)`,
        `AudioChime: Floor ${floor} Ding!`
      ]);

      setTimeout(() => {
        setElevatorState('IDLE');
        setObserversNotified([
          `FloorDisplayPanel: Floor ${floor} (IDLE)`,
          `DoorMechanism: Doors Closed`,
          `WeightSensor: Calibrated`
        ]);
      }, 1200);
    }, Math.abs(floor - currentFloor) * 600 + 300);
  };

  const resetElevator = () => {
    setCurrentFloor(1);
    setTargetFloor(1);
    setElevatorState('IDLE');
    setObserversNotified([
      'FloorDisplayPanel: Floor 1',
      'AudioChime: Standby',
      'WeightSensor: 0 kg (OK)'
    ]);
  };

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-6 max-w-7xl mx-auto">
        <div className="lld-grid-bg absolute inset-0 -z-10 rounded-3xl opacity-60" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--lld-primary)]/30 bg-[var(--lld-primary)]/10 text-[var(--lld-primary)] text-xs font-mono">
              <Box className="w-3.5 h-3.5 animate-pulse text-[var(--lld-primary)]" />
              SOLID Principles &bull; Design Patterns &bull; Clean Architecture
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-[var(--lld-text)]">
              Clean Architecture.<br />
              <span className="text-[var(--lld-primary)] lld-glow">SOLID Principles.</span> Design Patterns.
            </h1>

            <p className="text-base md:text-lg text-[var(--lld-muted)] max-w-xl leading-relaxed">
              Master Low-Level Design (LLD) and Machine Coding interviews. Deconstruct Creational, Structural, and Behavioral patterns with polymorphic class hierarchies.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/lldcosmos/learn"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--lld-primary)] text-white font-semibold text-sm hover:bg-[var(--lld-primary-hover)] transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] active:scale-95"
              >
                Explore Concept Map <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/lldcosmos/solid-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--lld-border)] bg-[var(--lld-surface)] text-[var(--lld-text)] font-mono text-sm hover:border-[var(--lld-primary)] hover:text-[var(--lld-primary)] transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-[var(--lld-emerald)]" />
                SOLID Lab
              </Link>

              <Link
                href="/lldcosmos/patterns-lab"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] text-[var(--lld-muted)] font-mono text-sm hover:text-[var(--lld-text)] transition-all"
              >
                <Cpu className="w-4 h-4 text-[var(--lld-purple)]" />
                GoF Patterns Lab
              </Link>
            </div>
          </div>

          {/* Right Live LLD Smart Elevator Simulator */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-[var(--lld-border)] bg-[var(--lld-surface)] shadow-2xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-3 border-b border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-[var(--lld-muted)] ml-2">LLD::ElevatorSystem</span>
                </div>
                <button
                  onClick={resetElevator}
                  className="text-[10px] text-[var(--lld-muted)] hover:text-[var(--lld-primary)]"
                  title="Reset"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Strategy Pattern Picker */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[var(--lld-muted)]">Strategy Pattern (Scheduling):</span>
                    <span className="text-[var(--lld-primary)] font-bold">{strategy}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['SCAN', 'SSTF', 'FCFS'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setStrategy(s as 'SCAN' | 'SSTF' | 'FCFS')}
                        className={`py-1.5 rounded-lg text-[10px] text-center transition-all ${
                          strategy === s
                            ? 'bg-[var(--lld-primary)] text-white font-bold shadow'
                            : 'border border-[var(--lld-border-subtle)] bg-[var(--lld-bg)] text-[var(--lld-muted)] hover:text-[var(--lld-text)]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Elevator Shaft & Floor Controls */}
                <div className="grid grid-cols-12 gap-4 items-center bg-[var(--lld-bg)] p-4 rounded-xl border border-[var(--lld-border-subtle)]">
                  {/* Shaft Visual */}
                  <div className="col-span-5 flex flex-col-reverse gap-1 border-r border-[var(--lld-border-subtle)] pr-3">
                    {[1, 2, 3, 4, 5].map((floor) => {
                      const isCarHere = currentFloor === floor;
                      return (
                        <div
                          key={floor}
                          className={`h-8 rounded-lg border flex items-center justify-between px-2 text-[10px] font-bold transition-all ${
                            isCarHere
                              ? 'border-[var(--lld-primary)] bg-[var(--lld-primary)]/20 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                              : 'border-white/5 bg-white/[0.02] text-[var(--lld-muted)]'
                          }`}
                        >
                          <span>F{floor}</span>
                          {isCarHere && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--lld-primary)] text-white">
                              {elevatorState === 'DOORS_OPEN' ? 'DOORS ◫' : elevatorState === 'MOVING_UP' ? '▲' : elevatorState === 'MOVING_DOWN' ? '▼' : 'CAR'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Floor Request Buttons */}
                  <div className="col-span-7 space-y-1.5">
                    <span className="text-[10px] text-[var(--lld-muted)]">Request Floor (Observer Target):</span>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((f) => (
                        <button
                          key={f}
                          onClick={() => requestFloor(f)}
                          disabled={elevatorState !== 'IDLE'}
                          className={`h-9 rounded-lg border font-bold text-xs transition-all ${
                            currentFloor === f
                              ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                              : 'border-[var(--lld-border-subtle)] bg-[var(--lld-surface-2)] text-[var(--lld-text)] hover:border-[var(--lld-primary)]'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <div className="text-[9px] text-[var(--lld-muted)] pt-1">
                      State Pattern: <strong className="text-[var(--lld-primary)]">{elevatorState}</strong>
                    </div>
                  </div>
                </div>

                {/* Observer Notification Logs */}
                <div className="p-3 rounded-xl bg-[var(--lld-bg)] border border-[var(--lld-border-subtle)] space-y-1 text-[10px]">
                  <div className="text-[var(--lld-primary)] uppercase tracking-wider font-bold text-[9px]">
                    Observer Pattern (Active Subscribers):
                  </div>
                  {observersNotified.map((obs, idx) => (
                    <div key={idx} className="text-[var(--lld-muted)]">
                      • {obs}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLID Principles Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--lld-primary)] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> Architectural Pillars
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-[var(--lld-text)]">
            The SOLID Principles Matrix
          </h2>
          <p className="text-sm text-[var(--lld-muted)]">
            The foundation of maintainable, testable, and loosely-coupled object-oriented codebases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 font-mono text-xs">
          {[
            { letter: 'S', name: 'Single Responsibility', rule: 'One class, one reason to change', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10' },
            { letter: 'O', name: 'Open/Closed', rule: 'Open for extension, closed for modification', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
            { letter: 'L', name: 'Liskov Substitution', rule: 'Subtypes must be substitutable for base types', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
            { letter: 'I', name: 'Interface Segregation', rule: 'Clients should not depend on unused methods', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10' },
            { letter: 'D', name: 'Dependency Inversion', rule: 'Depend on abstractions, not concrete classes', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10' },
          ].map((item) => (
            <div key={item.letter} className="p-6 rounded-xl border border-[var(--lld-border-subtle)] bg-[var(--lld-surface)] space-y-3">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-sm ${item.color}`}>
                {item.letter}
              </div>
              <h3 className="font-display font-bold text-sm text-[var(--lld-text)]">{item.name}</h3>
              <p className="text-[11px] text-[var(--lld-muted)] leading-relaxed">{item.rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--lld-border-subtle)] pb-6">
          <div>
            <div className="text-xs font-mono text-[var(--lld-primary)] uppercase tracking-wider">
              Architecture Tracks
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--lld-text)] mt-1">
              LLD &amp; Design Pattern Modules
            </h2>
          </div>
          <Link
            href="/lldcosmos/learn"
            className="inline-flex items-center gap-2 text-xs font-mono text-[var(--lld-primary)] hover:underline"
          >
            View all 5 topics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lldTopics.map((topic) => (
            <Link
              key={topic.id}
              href={`/lldcosmos/learn/${topic.id}`}
              className="lld-card p-6 rounded-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--lld-primary)]">
                  {topic.kicker}
                </span>
                <ArrowUpRight className="w-4 h-4 text-[var(--lld-muted)] group-hover:text-[var(--lld-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <h3 className="font-display font-bold text-lg text-[var(--lld-text)] group-hover:text-[var(--lld-primary)] transition-colors">
                {topic.title}
              </h3>

              <p className="text-xs text-[var(--lld-muted)] leading-relaxed line-clamp-2">
                {topic.summary}
              </p>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--lld-border-subtle)] text-[var(--lld-muted)]">
                  {topic.difficulty}
                </span>
                <span className="text-[10px] font-mono text-[var(--lld-muted)]">
                  {topic.group}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
