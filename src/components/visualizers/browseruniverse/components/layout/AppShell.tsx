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
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {theme === 'dark' ? (
          <>
            <div className="absolute left-[10%] top-[-5%] h-[32rem] w-[32rem] rounded-full bg-[#7c3aed]/15 blur-[120px]" />
            <div className="absolute right-[5%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-[#22d3ee]/12 blur-[120px]" />
            <div className="absolute left-[20%] bottom-[5%] h-[32rem] w-[32rem] rounded-full bg-[#22c55e]/08 blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute left-[10%] top-[-5%] h-[32rem] w-[32rem] rounded-full bg-[#7c3aed]/06 blur-[140px]" />
            <div className="absolute right-[5%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-[#22d3ee]/05 blur-[140px]" />
            <div className="absolute left-[20%] bottom-[5%] h-[32rem] w-[32rem] rounded-full bg-[#22c55e]/04 blur-[140px]" />
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
