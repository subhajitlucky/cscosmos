import React from 'react';

/**
 * Kept only so this engine's standalone `App.tsx` still compiles — nothing on the
 * `/ptopblockchain` route mounts it, and the shared provider in the root layout is
 * the single owner of the theme now (see `./ThemeContext`).
 *
 * It used to keep a private theme preference under the storage key `'theme'`,
 * read from a `useState` initialiser — i.e. `localStorage` was touched during
 * render (bug FS-39) — and repainted `<html>` / `<body>` classes. It renders
 * nothing and touches no browser API now.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
