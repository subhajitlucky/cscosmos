'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Laptop,
  Server,
  Database,
  Lock,
  KeyRound,
  Cpu,
  Clock,
  AlertTriangle,
  User,
  Sparkles,
} from 'lucide-react';
import {
  getAnimationScenario,
  TopicAnimationScenario,
  AnimationNode,
} from '../data/topicAnimations';

interface TopicAnimationTheaterProps {
  topicId: string;
  topicTitle: string;
  category: string;
}

export default function TopicAnimationTheater({
  topicId,
  topicTitle,
  category,
}: TopicAnimationTheaterProps) {
  const scenario: TopicAnimationScenario = getAnimationScenario(topicId, topicTitle, category);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);

  const totalSteps = scenario.stages.length;
  const activeStage = scenario.stages[currentStep] || scenario.stages[0];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 3800 / speed;
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % totalSteps);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, totalSteps]);

  const handlePrev = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : totalSteps - 1));
  }, [totalSteps]);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => (prev + 1) % totalSteps);
  }, [totalSteps]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const getNodeIcon = (iconType: AnimationNode['iconType']) => {
    switch (iconType) {
      case 'user':
        return <User className="w-5 h-5 text-emerald-400" />;
      case 'client':
        return <Laptop className="w-5 h-5 text-emerald-400" />;
      case 'gateway':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'auth':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'redis':
      case 'database':
        return <Database className="w-5 h-5 text-emerald-400" />;
      case 'hsm':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'lock':
        return <Lock className="w-5 h-5 text-emerald-400" />;
      case 'clock':
        return <Clock className="w-5 h-5 text-emerald-400" />;
      case 'attacker':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      default:
        return <KeyRound className="w-5 h-5 text-emerald-400" />;
    }
  };

  // Find packet sender and receiver coordinates
  const packetFromNode = activeStage.packet
    ? scenario.nodes.find((n) => n.id === activeStage.packet?.from)
    : null;
  const packetToNode = activeStage.packet
    ? scenario.nodes.find((n) => n.id === activeStage.packet?.to)
    : null;

  return (
    <div className="rounded-3xl border border-border/80 bg-zinc-950 overflow-hidden shadow-2xl space-y-0 text-foreground transition-all">
      {/* 3Blue1Brown Top Bar Controls */}
      <div className="px-5 py-3.5 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              {scenario.title}
            </h3>
            <p className="text-[11px] text-zinc-400 line-clamp-1">
              {scenario.subtitle}
            </p>
          </div>
        </div>

        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition"
            title="Previous Stage"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition"
            title="Next Stage"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80 transition"
            title="Restart Animation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-1" />

          {/* Speed Selector */}
          <button
            onClick={() => setSpeed(speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1)}
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-zinc-400 hover:text-zinc-200 transition"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Step Scrubber Pills */}
      <div className="px-5 py-2.5 bg-zinc-950 border-b border-zinc-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {scenario.stages.map((stage, idx) => {
          const isActive = idx === currentStep;
          return (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 border border-transparent'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'}`} />
              <span>
                {stage.step < 10 ? `0${stage.step}` : stage.step} {stage.stageTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main 3Blue1Brown Animation Canvas */}
      <div className="relative w-full h-[320px] sm:h-[360px] bg-zinc-950 overflow-hidden select-none">
        {/* Subtle coordinate dot grid */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #71717a 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* SVG Network Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {scenario.nodes.map((node, i) => {
            if (i === scenario.nodes.length - 1) return null;
            const nextNode = scenario.nodes[i + 1];
            const isConnectionActive =
              activeStage.activeNodeIds.includes(node.id) &&
              activeStage.activeNodeIds.includes(nextNode.id);

            return (
              <g key={`conn-${node.id}-${nextNode.id}`}>
                <line
                  x1={`${node.x}%`}
                  y1={`${node.y}%`}
                  x2={`${nextNode.x}%`}
                  y2={`${nextNode.y}%`}
                  stroke={isConnectionActive ? '#10b981' : '#27272a'}
                  strokeWidth={isConnectionActive ? '2.5' : '1.5'}
                  strokeDasharray={isConnectionActive ? '6 4' : 'none'}
                  className={isConnectionActive ? 'animate-pulse' : ''}
                />
              </g>
            );
          })}
        </svg>

        {/* Animated Flying Packet */}
        {packetFromNode && packetToNode && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`packet-${currentStep}-${packetFromNode.id}-${packetToNode.id}`}
              initial={{
                left: `${packetFromNode.x}%`,
                top: `${packetFromNode.y}%`,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                left: `${packetToNode.x}%`,
                top: `${packetToNode.y}%`,
                opacity: 1,
                scale: 1,
              }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{
                duration: 1.4 / speed,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
            >
              <div
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold shadow-xl border flex items-center gap-1.5 whitespace-nowrap ${
                  activeStage.packet?.type === 'blocked'
                    ? 'bg-rose-950/90 text-rose-300 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : activeStage.packet?.type === 'crypto'
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-zinc-900/90 text-zinc-100 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-ping ${
                    activeStage.packet?.type === 'blocked' ? 'bg-rose-400' : 'bg-emerald-400'
                  }`}
                />
                <span>{activeStage.packet?.label}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Entity Nodes */}
        {scenario.nodes.map((node) => {
          const isActive = activeStage.activeNodeIds.includes(node.id);
          const isAttacker = node.iconType === 'attacker';

          return (
            <div
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
              onClick={() => {
                // Clicking a node highlights it
              }}
            >
              {/* Glowing Aura when active */}
              {isActive && (
                <motion.div
                  layoutId={`aura-${node.id}`}
                  className={`absolute -inset-3 rounded-full blur-md opacity-40 animate-pulse ${
                    isAttacker ? 'bg-rose-500' : 'bg-emerald-500'
                  }`}
                />
              )}

              {/* Node Circle */}
              <div
                className={`relative w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-lg ${
                  isActive
                    ? isAttacker
                      ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/50 scale-110'
                      : 'bg-zinc-900 border-emerald-500 ring-2 ring-emerald-500/50 scale-110'
                    : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {getNodeIcon(node.iconType)}
              </div>

              {/* Node Labels */}
              <div className="mt-2 text-center pointer-events-none">
                <div className={`text-xs font-bold leading-tight ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`}>
                  {node.label}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 leading-tight">
                  {node.role}
                </div>
              </div>
            </div>
          );
        })}

        {/* Step Counter Badge inside Stage */}
        <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-400">
          STAGE {currentStep + 1} / {totalSteps}
        </div>
      </div>

      {/* Stage Narration & Live Payload Inspector Panel */}
      <div className="p-5 sm:p-6 bg-zinc-950 border-t border-zinc-800/80 space-y-4">
        {/* Stage Description */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[11px] font-mono font-bold">
              STEP 0{currentStep + 1}
            </span>
            <h4 className="text-base font-bold text-zinc-100">
              {activeStage.stageTitle}
            </h4>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {activeStage.description}
          </p>
        </div>

        {/* Live Payload & State Inspector (3Blue1Brown Inspector Window) */}
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Live Cryptographic &amp; Network Payload
            </span>
            <span className="text-[10px] text-emerald-400/80">MEMORY &bull; EN ROUTE</span>
          </div>
          <div className="font-mono text-xs text-emerald-300 bg-black/60 p-3 rounded-xl overflow-x-auto border border-zinc-800/80 whitespace-pre leading-relaxed">
            {JSON.stringify(activeStage.payloadData, null, 2)}
          </div>
        </div>

        {/* Senior Security Architect Commentary Callout */}
        <div
          className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
            activeStage.securityStatus === 'blocked'
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
              : activeStage.securityStatus === 'warning'
              ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
              : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
          }`}
        >
          {activeStage.securityStatus === 'blocked' ? (
            <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">
            <strong>Security Architecture Guarantee: </strong>
            {activeStage.securityNote}
          </span>
        </div>
      </div>
    </div>
  );
}
