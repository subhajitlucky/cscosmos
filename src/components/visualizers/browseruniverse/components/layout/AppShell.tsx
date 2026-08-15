'use client';

import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import '../../styles.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

function ShellInner({ children, className }: Props) {
  const { theme } = useTheme();

  return (
    <div className={cn('browseruniverse-root relative min-h-screen font-sans antialiased transition-colors duration-300', theme === 'light' ? 'light-mode' : 'dark-mode', className)}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {theme === 'dark' ? (
          <>
            <div className="gradient-blur left-[10%] top-[-10%] h-64 w-64 bg-[#7c3aed]/30" />
            <div className="gradient-blur right-[5%] top-10 h-72 w-72 bg-[#22d3ee]/25" />
            <div className="gradient-blur left-[20%] bottom-[-10%] h-80 w-80 bg-[#22c55e]/20" />
          </>
        ) : (
          <>
            <div className="gradient-blur left-[10%] top-[-10%] h-64 w-64 bg-[#7c3aed]/10" />
            <div className="gradient-blur right-[5%] top-10 h-72 w-72 bg-[#22d3ee]/10" />
            <div className="gradient-blur left-[20%] bottom-[-10%] h-80 w-80 bg-[#22c55e]/10" />
          </>
        )}
      </div>
      <Navbar />
      <main className="relative z-10 page-container py-8 sm:py-10">{children}</main>
      <Footer />
    </div>
  );
}

export default function AppShell({ children, className }: Props) {
  return (
    <ThemeProvider>
      <ShellInner className={className}>{children}</ShellInner>
    </ThemeProvider>
  );
}
