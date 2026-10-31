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
  Sparkles,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { AUTH_TOPICS } from '../data/topics';
import { renderConceptScene } from './VisualConceptScenes';

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
  const topic = AUTH_TOPICS.find((t) => t.id === topicId);
  const steps = topic?.stepByStep && topic.stepByStep.length > 0
    ? topic.stepByStep
    : [
        'Step 1: Setup and initial cryptographic state allocation.',
        'Step 2: Credential presentation and hashing pass.',
        'Step 3: Protocol handshake and challenge negotiation.',
        'Step 4: Threat verification and boundary defense check.',
        'Step 5: Token issuance or policy enforcement decision.',
        'Step 6: Stateful persistence or zero-trust session termination.',
      ];

  const totalSteps = steps.length;
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1);

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

  const toggleSpeed = useCallback(() => {
    setSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  }, []);

  const currentStepText = steps[currentStep] || steps[0];

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl space-y-0 text-foreground transition-all">
      {/* 1. Header Bar & Controls */}
      <div className="px-5 py-3.5 bg-zinc-900/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-100 tracking-tight">
                Visual Step-by-Step Concept Explainer
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                {category}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 line-clamp-1 font-medium">
              {topicTitle}
            </div>
          </div>
        </div>

        {/* Playback & Step Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition shadow-sm ${
              isPlaying
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
            title={isPlaying ? 'Pause Auto-Play' : 'Start Auto-Play'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
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
            onClick={handlePrev}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSpeed}
            className="px-2.5 py-1 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono font-bold border border-zinc-700/60 transition"
            title="Playback Speed"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* 2. Step Scrubber Bar */}
      <div className="px-5 py-2.5 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 shrink-0 mr-1">
          Steps:
        </span>
        <div className="flex items-center gap-2 w-full">
          {steps.map((s, idx) => {
            const isActive = idx === currentStep;
            const isDone = idx < currentStep;
            const stepNum = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;

            return (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(idx);
                }}
                className={`flex-1 min-w-[70px] py-1.5 px-2.5 rounded-xl text-left border transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 border-emerald-500/60 shadow-sm'
                    : isDone
                      ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-600 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      isActive
                        ? 'text-emerald-400'
                        : isDone
                          ? 'text-zinc-300'
                          : 'text-zinc-500'
                    }`}
                  >
                    {stepNum}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bespoke Visual Scene Stage */}
      <div className="p-5 sm:p-6 bg-zinc-950 min-h-[260px] flex flex-col justify-center relative overflow-hidden">
        {/* Subtle ambient grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${topicId}-step-${currentStep}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {renderConceptScene(topicId, currentStep)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 4. Pedagogical Step Narrative Card */}
      <div className="p-5 bg-zinc-900/60 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
              <Lightbulb className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold text-zinc-200">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>

          <span className="text-[10px] font-mono text-zinc-500">
            {isPlaying ? `Auto-stepping (${speed}x)` : 'Paused (Step manually)'}
          </span>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed font-medium">
          {currentStepText}
        </p>

        {/* Security Takeaway Banner */}
        <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-2.5 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <span className="text-zinc-200 font-bold">Security Guarantee: </span>
            {topic?.takeaways && topic.takeaways.length > 0
              ? topic.takeaways[currentStep % topic.takeaways.length]
              : 'Every step enforces explicit validation boundaries and eliminates implicit trust.'}
          </div>
        </div>
      </div>
    </div>
  );
}
