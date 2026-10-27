'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/useTheme';

/**
 * Adapter over the app-wide theme provider.
 *
 * This used to keep a second, private theme preference: it read
 * `localStorage.getItem('theme')` inside a `useState` initialiser — i.e. on the
 * render path — and wrote back to that same `'theme'` key, which the rest of
 * the site does not use (the app's key is `'cscosmos-ui-theme'`). Two
 * consequences: `window` was touched during render, which is why this engine
 * could not be pre-rendered and every route sat behind
 * `dynamic(..., { ssr: false })`, and toggling here silently disagreed with the
 * site-wide switch.
 *
 * The shared provider owns the `<html>` class and the storage key, and exposes
 * `resolvedTheme`, the concrete `"light" | "dark"` already painted. Reading it
 * is deterministic on the server and on the client's first render.
 */
export const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all duration-300 relative overflow-hidden group shadow-sm border border-slate-200 dark:border-slate-700"
      aria-label="Toggle Theme"
    >
      <div className="relative z-10 w-5 h-5 flex items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: 10, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 10, opacity: 0, rotate: -45 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: -10, opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 bg-brand-500/5 dark:bg-brand-500/10 scale-0 group-hover:scale-100 transition-transform rounded-xl" />
    </button>
  );
};