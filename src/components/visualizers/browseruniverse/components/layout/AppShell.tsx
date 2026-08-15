'use client';

import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { ThemeProvider } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function AppShell({ children, className }: Props) {
  return (
    <ThemeProvider>
      <div className={cn('relative min-h-screen bg-[#0b1220] text-slate-100 font-sans antialiased', className)}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="gradient-blur left-[10%] top-[-10%] h-64 w-64 bg-[#7c3aed]/30" />
          <div className="gradient-blur right-[5%] top-10 h-72 w-72 bg-[#22d3ee]/25" />
          <div className="gradient-blur left-[20%] bottom-[-10%] h-80 w-80 bg-[#22c55e]/20" />
        </div>
        <Navbar />
        <main className="relative z-10 page-container py-8 sm:py-10">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
