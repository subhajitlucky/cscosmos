import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StringBoxProps {
  char: string;
  index: number;
  isHighlighted?: boolean;
  isSecondaryHighlighted?: boolean;
  isMatch?: boolean;
  className?: string;
  label?: string;
}

export const StringBox: React.FC<StringBoxProps> = ({ 
  char, 
  index, 
  isHighlighted, 
  isSecondaryHighlighted,
  isMatch,
  className,
  label
}) => {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <motion.div
        layout
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          "w-6 h-6 flex items-center justify-center border rounded text-[10px] font-black transition-colors duration-200",
          isHighlighted ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300" :
          isSecondaryHighlighted ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
          isMatch ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" :
          "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
          className
        )}
      >
        {char === ' ' ? '␣' : char}
      </motion.div>
      <span className="text-[7px] text-slate-400 font-mono tracking-tighter">{label ?? index}</span>
    </div>
  );
};

interface StringRowProps {
  text: string;
  highlightedIndices?: number[];
  secondaryHighlightedIndices?: number[];
  matchedIndices?: number[];
  startIndex?: number;
  label?: string;
}

export const StringRow: React.FC<StringRowProps> = ({ 
  text, 
  highlightedIndices = [], 
  secondaryHighlightedIndices = [],
  matchedIndices = [],
  startIndex = 0,
  label
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>}
      <div className="flex gap-1">
        {text.split('').map((char, i) => (
          <StringBox 
            key={i} 
            char={char} 
            index={i + startIndex} 
            isHighlighted={highlightedIndices.includes(i)}
            isSecondaryHighlighted={secondaryHighlightedIndices.includes(i)}
            isMatch={matchedIndices.includes(i)}
          />
        ))}
      </div>
    </div>
  );
};
