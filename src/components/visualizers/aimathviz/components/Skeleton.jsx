import { motion } from 'framer-motion';

// Skeleton for canvas visualizations
export function CanvasSkeleton({ width = 400, height = 300, className = '' }) {
  return (
    <div 
      className={`relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 ${className}`}
      style={{ width: '100%', maxWidth: width, aspectRatio: `${width}/${height}` }}
    >
      <motion.div
        className="absolute inset-0 bg-slate-200/70 dark:bg-slate-700/70"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 border-t-primary-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-400">Loading visualization...</span>
        </div>
      </div>
    </div>
  );
}

// Skeleton for cards
export function CardSkeleton({ className = '' }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for text content
export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-slate-200 dark:bg-slate-700 rounded" 
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

// Skeleton for topic page
export function TopicSkeleton() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          {/* Breadcrumb */}
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32 mb-8" />
          
          {/* Header */}
          <div className="mb-12">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>

          {/* Content grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <CanvasSkeleton width={500} height={400} />
            </div>
            <div className="space-y-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default { CanvasSkeleton, CardSkeleton, TextSkeleton, TopicSkeleton };
