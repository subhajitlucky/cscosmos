import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Database, Layers, GitBranch, Cpu, Code, ShieldCheck } from 'lucide-react';
import { Link } from '@/components/visualizers/shared/RouterShim';

const Home: React.FC = () => {
  const features = [
    {
      title: 'Stack Machine',
      description: 'The EVM is a stack-based machine. Visualize how 256-bit words are pushed and popped to drive computation.',
      icon: Layers,
      color: 'text-blue-400',
      borderColor: 'group-hover:border-blue-500/50',
      bgColor: 'bg-blue-500/5'
    },
    {
      title: 'Volatile Memory',
      description: 'Explore byte-addressable memory expansion and the quadratic gas costs associated with it.',
      icon: Zap,
      color: 'text-red-400',
      borderColor: 'group-hover:border-red-500/50',
      bgColor: 'bg-red-500/5'
    },
    {
      title: 'Persistent Storage',
      description: 'Understand the permanent state of the blockchain. Key-value slots, hashing, and expensive writes.',
      icon: Database,
      color: 'text-amber-400',
      borderColor: 'group-hover:border-amber-500/50',
      bgColor: 'bg-amber-500/5'
    },
    {
      title: 'Execution Flow',
      description: 'Step through JUMPS, CALLS, and REVERTS to see how smart contracts manage logic and context.',
      icon: GitBranch,
      color: 'text-green-400',
      borderColor: 'group-hover:border-green-500/50',
      bgColor: 'bg-green-500/5'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-evm-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <section className="relative pt-20 pb-32 px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl transition-colors duration-300"
        >
          <Cpu size={48} className="text-evm-accent" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-neutral-900 dark:text-white leading-tight"
        >
          THE EVM <br />
          <span className="text-neutral-300 dark:text-neutral-600">UNPACKED.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A high-fidelity visual simulator for Ethereum Virtual Machine internals.
          Master opcodes, state transitions, and gas mechanics through interaction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/playground"
            className="px-8 py-3.5 bg-evm-accent text-neutral-950 font-bold rounded-xl flex items-center gap-2.5 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all hover:scale-[1.02] shadow-sm"
          >
            OPEN PLAYGROUND <Play size={18} fill="currentColor" />
          </Link>
          <Link
            to="/learn"
            className="px-8 py-3.5 bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium rounded-xl flex items-center gap-2.5 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
          >
            START LEARNING <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Stats / Proof points */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-neutral-400 dark:text-neutral-600 font-mono text-[10px] uppercase tracking-wider"
        >
          <div className="flex items-center gap-2"><Code size={12} /> 140+ Opcodes Simulated</div>
          <div className="flex items-center gap-2"><ShieldCheck size={12} /> Sandboxed Execution</div>
          <div className="flex items-center gap-2"><Zap size={12} /> Real-time Gas Metering</div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 border-t border-neutral-100 dark:border-neutral-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-5 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 transition-all duration-300 group relative overflow-hidden ${f.borderColor}`}
            >
              <div className={`absolute top-0 left-0 w-full h-0.5 ${f.bgColor}`} />
              <div className={`${f.bgColor} ${f.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white tracking-tight">{f.title}</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-500 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* "How it works" Preview */}
      <section className="py-20">
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-10 dark:opacity-15">
              <Code size={140} className="text-evm-accent" />
           </div>
           <div className="relative z-10 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900 dark:text-white tracking-tight leading-tight">Interactive Execution. No RPC required.</h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-8 leading-relaxed">
                Everything runs directly in your browser. We've built a custom EVM engine that mimics the Yellow Paper specifications, allowing you to inspect the stack, memory, and storage at every single step of execution.
              </p>
              <Link to="/learn/intro" className="text-evm-accent font-medium flex items-center gap-2 hover:gap-3 transition-all text-sm">
                Learn how the engine works <ArrowRight size={16} />
              </Link>
           </div>
        </div>
      </section>
    </div>
  );
};

const Play: React.FC<{ size?: number; fill?: string }> = ({ size = 24, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

export default Home;