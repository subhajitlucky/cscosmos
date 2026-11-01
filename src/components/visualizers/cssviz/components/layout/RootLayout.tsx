'use client';

import { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="hidden dark:block pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />
        <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">{children}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default RootLayout;
