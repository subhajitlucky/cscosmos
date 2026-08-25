import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800">
      {/* Background patterns */}
      <div className="fixed inset-0 grid-background pointer-events-none opacity-[0.4] dark:opacity-[0.2]" />
      
      <Navbar />
      <main className="flex-1 container mx-auto px-6 md:px-10 lg:px-12 py-12 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};
