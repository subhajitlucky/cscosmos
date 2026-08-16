import React from 'react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-[40px] flex items-center justify-center text-primary shadow-2xl">
          <AlertCircle size={48} className="sm:w-16 sm:h-16" />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl sm:text-6xl font-black tracking-tighter mb-4 text-neutral-900 dark:text-white"
      >
        404: Path <span className="text-primary">Not Found</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-neutral-500 dark:text-neutral-400 text-lg max-w-md mb-10 font-medium"
      >
        The cryptographic path you're looking for doesn't resolve to any known node in our trie.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link 
          to="/" 
          className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-primary/25 active:scale-95"
        >
          <Home size={16} /> Return Home
        </Link>
        <Link 
          to="/learn" 
          className="px-8 py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all active:scale-95"
        >
          <Search size={16} /> Learning Path
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
