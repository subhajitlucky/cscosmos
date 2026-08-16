import React, { useState } from 'react';
import { HashDemo } from '../components/visualizers/HashDemo';
import { SignVerifyVisualizer } from '../components/visualizers/SignVerifyVisualizer';
import { EncryptionFlow } from '../components/visualizers/EncryptionFlow';
import { BlockchainDemo } from '../components/visualizers/BlockchainDemo';
import clsx from 'clsx';
import { Hash, PenTool, Lock, Link2, FlaskConical, Shield, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundAtmosphere = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-brand-500/5 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-1/4 w-[40%] h-[40%] bg-indigo-500/5 blur-[100px] rounded-full" />
    <div 
      className="absolute inset-0 opacity-[0.03] dark:opacity-[0.1]" 
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }}
    />
  </div>
);

export const Playground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'hashing' | 'transaction' | 'encryption' | 'blockchain'>('hashing');

  const tabs = [
    { id: 'hashing', label: 'Hashing', icon: Hash, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { id: 'transaction', label: 'Signing', icon: PenTool, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { id: 'encryption', label: 'Messaging', icon: Lock, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: 'blockchain', label: 'Ledger', icon: Link2, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  ] as const;

  return (
    <div className="relative min-h-screen flex flex-col pb-20 overflow-hidden">
      <BackgroundAtmosphere />
      
      <div className="max-w-7xl mx-auto w-full p-6 md:p-8 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 backdrop-blur-md text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">
              <FlaskConical className="w-3 h-3" />
              <span>Research Sandbox v1.0</span>
            </div>
            <h1 className="text-5xl font-black mb-4 text-slate-900 dark:text-white tracking-tighter">The Playground</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              Stress-test the primitives of digital trust. Tweak the math, tamper with the data, and observe the results.
            </p>
          </div>

          {/* Tab Navigation */}
          <nav className="flex items-center p-1.5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "relative px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                    isActive 
                      ? "text-slate-900 dark:text-white shadow-xl" 
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className={clsx("w-4 h-4 transition-colors", isActive ? tab.color : "text-slate-400")} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workstation Area */}
        <div className="relative group">
            {/* Corner Decorative Elements */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-slate-200 dark:border-slate-800 rounded-tl-xl pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-slate-200 dark:border-slate-800 rounded-tr-xl pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-slate-200 dark:border-slate-800 rounded-bl-xl pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-slate-200 dark:border-slate-800 rounded-br-xl pointer-events-none" />

            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl min-h-[600px] flex flex-col transition-all duration-500 hover:border-slate-300 dark:hover:border-slate-700">
                
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                        transition={{ duration: 0.4 }}
                        className="flex-grow flex flex-col"
                    >
                        {/* Tab-specific Lab Header */}
                        <div className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                                    {activeTab === 'hashing' && "Data Fingerprinting Lab"}
                                    {activeTab === 'transaction' && "Identity Verification Unit"}
                                    {activeTab === 'encryption' && "End-to-End Tunnel Simulation"}
                                    {activeTab === 'blockchain' && "Immutable Ledger Sequence"}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-sm leading-relaxed">
                                    {activeTab === 'hashing' && "Analyze how deterministic algorithms transform arbitrary data into fixed-length integrity seals."}
                                    {activeTab === 'transaction' && "Observe the mathematical handshake between private signatures and public verification."}
                                    {activeTab === 'encryption' && "Simulate the secure transit of sensitive data using the Diffie-Hellman key exchange logic."}
                                    {activeTab === 'blockchain' && "Watch the chain-reaction of cryptographic linking. Break one link, break them all."}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col gap-1 min-w-[120px]">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Shield className="w-3 h-3" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Protocol</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">
                                        {activeTab === 'hashing' && "SHA-256"}
                                        {activeTab === 'transaction' && "ECDSA / SECP256K1"}
                                        {activeTab === 'encryption' && "AES-256-GCM"}
                                        {activeTab === 'blockchain' && "Hashed Linking"}
                                    </span>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col gap-1 min-w-[120px]">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Activity className="w-3 h-3" />
                                        <span className="text-[8px] font-black uppercase tracking-widest">Status</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase">Operational</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* The Visualizers */}
                        <div className="flex-grow">
                            {activeTab === 'hashing' && <HashDemo />}
                            {activeTab === 'transaction' && <SignVerifyVisualizer />}
                            {activeTab === 'encryption' && <EncryptionFlow />}
                            {activeTab === 'blockchain' && <BlockchainDemo />}
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>
        </div>

        {/* Floating Lab Metadata */}
        <div className="mt-12 flex flex-wrap justify-center gap-12 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-brand-500" />
                <span>Mathematical Resilience Confirmed</span>
            </div>
            <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Simulation Sandbox: Secure</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Playground;
