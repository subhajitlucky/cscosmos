'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="flex flex-col gap-16">
      <section className="text-center flex flex-col items-center gap-6 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground bg-card border border-border rounded-full transition-all hover:border-primary/50 shadow-sm"
          >
            ← CSCosmos
          </Link>
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase dark:bg-primary/20">
            Master the Web Infrastructure
          </span>
        </motion.div>
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl text-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          HTTP & Web Protocols <br /> 
          <span className="text-primary italic">Visually Explained</span>
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Stop memorizing and start visualizing. A premium, guided tutorial designed to make headers, caching, and network cycles intuitive for everyone.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link 
            href="/webprotocols/path" 
            className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
          >
            Start Learning <ArrowRight size={20} />
          </Link>
          <Link 
            href="/webprotocols/playground" 
            className="bg-card text-foreground border-2 border-border px-8 py-4 rounded-2xl font-bold text-lg hover:bg-muted transition-all flex items-center justify-center gap-2"
          >
            Explore Playground
          </Link>
        </motion.div>
      </section>

      {/* Visual Teaser */}
      <section className="relative bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden transition-colors">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Intuitive Learning</h2>
            <p className="text-lg text-muted-foreground">
              Every concept comes with an interactive visualization. Understand how data flows from your browser to the server and back through the cache.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-md text-green-600 dark:text-green-400">
                  <Zap size={18} />
                </div>
                <div>
                  <div className="font-bold text-foreground">Fast-paced</div>
                  <div className="text-sm text-muted-foreground">Zero fluff, all value</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-1 rounded-md text-blue-600 dark:text-blue-400">
                  <Shield size={18} />
                </div>
                <div>
                  <div className="font-bold text-foreground">Deep Dive</div>
                  <div className="text-sm text-muted-foreground">Headers & Security</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full bg-slate-900 rounded-2xl p-6 aspect-video shadow-2xl relative overflow-hidden flex flex-col justify-center">
             <div className="flex justify-between items-center mb-8 px-4">
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                   <div className="text-white text-[10px] font-mono">CLIENT</div>
                </div>
                <div className="flex-1 h-[2px] bg-primary/60 relative mx-4">
                   <motion.div 
                    animate={{ x: ['-100%', '300%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full blur-sm"
                   />
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                   <div className="text-white text-[10px] font-mono">SERVER</div>
                </div>
             </div>
             <div className="space-y-2 font-mono text-xs opacity-80">
                <div className="text-green-400">GET /index.html HTTP/1.1</div>
                <div className="text-blue-400">Host: example.com</div>
                <div className="text-slate-400">Accept: text/html</div>
             </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
      </section>
    </div>
  );
};

export default Home;
