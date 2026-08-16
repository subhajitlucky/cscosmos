import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import type { Step } from '../../types';

interface AlgorithmVisualizerProps {
  steps: Step[];
  renderStep: (step: Step) => React.ReactNode;
  onComplete?: () => void;
  speed?: number;
}

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({ 
  steps, 
  renderStep, 
  onComplete,
  speed: initialSpeed = 500 
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const timerRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      if (currentStepIndex < steps.length - 1) {
        timerRef.current = window.setTimeout(() => {
          setCurrentStepIndex(prev => prev + 1);
        }, speed);
      } else {
        setTimeout(() => {
          setIsPlaying(false);
          onComplete?.();
        }, 0);
      }
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, speed, onComplete]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const reset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };
  const stepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeft.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!scrollContainerRef.current) return;
    isDragging.current = false;
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;
    isDragging.current = false;
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 px-2 gap-4">
        <div className="flex items-center gap-1.5">
          <button onClick={reset} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-brand-500" title="Reset"><RotateCcw size={16} /></button>
          <button onClick={() => setCurrentStepIndex(prev => Math.max(prev - 1, 0))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-brand-500" title="Previous Step"><SkipBack size={16} /></button>
          <button onClick={togglePlay} className="p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95" title={isPlaying ? "Pause" : "Play"}>{isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button>
          <button onClick={stepForward} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-brand-500" title="Next Step"><SkipForward size={16} /></button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1 min-w-[120px]">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Playback Speed</span>
            <input 
              type="range" min="50" max="2000" step="50"
              value={2050 - speed} 
              onChange={(e) => setSpeed(2050 - parseInt(e.target.value))}
              className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>
          <div className="flex flex-col items-end border-l border-slate-100 dark:border-slate-800 pl-6">
            <div className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">Execution State</div>
            <div className="text-sm font-black text-brand-500 font-mono">STEP {currentStepIndex + 1} / {steps.length}</div>
          </div>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="min-h-[140px] flex items-center overflow-x-auto py-2 px-4 custom-scrollbar cursor-grab active:cursor-grabbing select-none"
      >
        <div className="m-auto flex items-center justify-center pointer-events-none">
          {steps.length > 0 && renderStep(steps[currentStepIndex])}
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Process Description</span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic">
          {steps[currentStepIndex]?.description || "Ready to start..."}
        </p>
      </div>
    </div>
  );
};
