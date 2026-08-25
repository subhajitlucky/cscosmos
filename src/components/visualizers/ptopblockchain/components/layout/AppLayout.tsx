import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '@/components/visualizers/shared/RouterShim';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-bg-app text-main font-sans selection:bg-primary/30 overflow-x-hidden relative">
      
      {/* Background Layers */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 surface-tint opacity-40 transition-opacity duration-1000" />
        <div className="absolute inset-0 noise opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Global Decorative Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] scanline-overlay opacity-[0.02]" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;