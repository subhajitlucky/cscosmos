import React from 'react';
import { Hash, Shield, Terminal, ChevronRight, Zap, Cpu, Globe, Link2, ArrowRight } from 'lucide-react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion, useScroll, useTransform } from 'framer-motion';
import clsx from 'clsx';

const BackgroundAtmosphere = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Soft glowing orbs */}
    <motion.div 
      animate={{ 
        x: [0, 50, 0],
        y: [0, 30, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-brand-500/10 dark:bg-brand-400/20 blur-[100px] rounded-full" 
    />
    <motion.div 
      animate={{ 
        x: [0, -40, 0],
        y: [0, 50, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-400/20 blur-[120px] rounded-full" 
    />
    <motion.div 
      animate={{ 
        opacity: [0.1, 0.2, 0.1],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-500/5 dark:bg-emerald-400/10 blur-[80px] rounded-full" 
    />
    
    {/* Precision Grid Overlay */}
    <div 
      className="absolute inset-0 opacity-[0.05] dark:opacity-[0.15]" 
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse at center, black, transparent 80%)'
      }}
    />
  </div>
);

interface BentoCardProps {
  icon: React.ElementType;
  title: string;
  desc: string;
  delay: number;
  className?: string;
  color: string;
  to: string;
}

const BentoCard = ({ icon: Icon, title, desc, delay, className, color, to }: BentoCardProps) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={clsx(
        "relative group rounded-[2rem] border transition-all duration-500 overflow-hidden",
        "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border-slate-200 dark:border-white/10",
        "hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/5 dark:hover:shadow-glow-brand hover:-translate-y-1",
        className
    )}
  >
    <Link to={to} className="absolute inset-0 z-20" />
    <div className={clsx("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br", color)} />
    
    <div className="relative z-10 p-8 flex flex-col h-full">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
        <Icon className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-brand-500 transition-colors" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white tracking-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm flex-grow">{desc}</p>
      
      <div className="mt-6 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
          Learn More <ArrowRight className="ml-2 w-3 h-3" />
      </div>
    </div>
  </motion.div>
);

export const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -80]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundAtmosphere />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 backdrop-blur-md text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10"
        >
          <span className="flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
          </span>
          <span>Simulation Engine Live</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-slate-900 dark:text-white leading-[0.9]"
        >
          The Architecture of
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-indigo-500 to-indigo-600 dark:from-brand-300 dark:to-indigo-400">
             Digital Trust.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Master the mathematical primitives that define the modern web. Explore the mechanics of <span className="text-slate-900 dark:text-slate-200 font-bold">Privacy</span>, <span className="text-slate-900 dark:text-slate-200 font-bold">Integrity</span>, and <span className="text-slate-900 dark:text-slate-200 font-bold">Decentralized Consensus</span>.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto z-10"
        >
          <Link to="/learn" className="group w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(14,165,233,0.2)] active:scale-95 flex items-center justify-center gap-2">
            <span>Explore the Path</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/playground" className="group w-full sm:w-auto px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-200 dark:border-slate-800 hover:border-brand-500 active:scale-95 flex items-center justify-center gap-2 shadow-sm">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>Enter the Sandbox</span>
          </Link>
        </motion.div>

        {/* Dynamic Floating Symbols */}
        <motion.div style={{ y: y1 }} className="absolute top-40 left-[5%] opacity-10 hidden lg:block pointer-events-none">
          <Hash className="w-32 h-32 text-brand-500 rotate-12" />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute bottom-20 right-[5%] opacity-10 hidden lg:block pointer-events-none">
          <Shield className="w-40 h-40 text-indigo-500 -rotate-12" />
        </motion.div>
      </section>

      {/* Modern Bento Grid Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[240px]">
          
          <BentoCard 
            delay={0.1}
            icon={Zap}
            title="Real-time Simulation"
            desc="Witness the Avalanche Effect in real-time. Watch as one bit flips the entire cryptographic universe."
            className="md:col-span-8"
            color="from-brand-500/5 to-transparent"
            to="/playground"
          />
          
          <BentoCard 
            delay={0.2}
            icon={Cpu}
            title="Hardware Logic"
            desc="Intuitive visual models of low-level cryptography operations."
            className="md:col-span-4"
            color="from-indigo-500/5 to-transparent"
            to="/learn/intro"
          />

          <BentoCard 
            delay={0.3}
            icon={Link2}
            title="Digital Immutability"
            desc="Understand why history cannot be rewritten once the math is cast in stone."
            className="md:col-span-4"
            color="from-emerald-500/5 to-transparent"
            to="/learn/blockchain"
          />

          <BentoCard 
            delay={0.4}
            icon={Globe}
            title="Global Trust"
            desc="Explore the primitives that secure trillions in digital assets and billions of private conversations daily."
            className="md:col-span-8"
            color="from-amber-500/5 to-transparent"
            to="/learn"
          />
          
        </div>
      </section>

      {/* Sophisticated Stats */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
                { label: 'Visualizers', value: '10+' },
                { label: 'Open Source', value: '100%' },
                { label: 'Simulation Latency', value: '0ms' },
                { label: 'Access', value: 'Free' }
            ].map((stat, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                >
                    <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">{stat.value}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{stat.label}</div>
                </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
