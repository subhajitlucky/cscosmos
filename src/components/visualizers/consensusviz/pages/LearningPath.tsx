import React from 'react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Share2, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  GanttChartSquare, 
  Activity, 
  GitFork, 
  UserCheck, 
  Flame, 
  Scale,
  Layout
} from 'lucide-react';
import { clsx } from 'clsx';

const topics = [
  { id: 'why-consensus', title: 'Why Consensus Needed', desc: 'The fundamental problem of agreement in distributed systems.', category: 'Basics', icon: Share2, complexity: 'Lvl 1' },
  { id: 'trustless-networks', title: 'Trustless Networks', desc: 'How we coordinate without middlemen or central authorities.', category: 'Basics', icon: Users, complexity: 'Lvl 1' },
  { id: 'pow-overview', title: 'Proof of Work Overview', desc: 'Securing the network through computational effort.', category: 'PoW', icon: GanttChartSquare, complexity: 'Lvl 2' },
  { id: 'pow-mining', title: 'Mining & Hash Puzzles', desc: 'The mechanics of brute-forcing cryptographic puzzles.', category: 'PoW', icon: Cpu, complexity: 'Lvl 3' },
  { id: 'difficulty-adjustment', title: 'Difficulty Adjustment', desc: 'How blockchains maintain a steady heartbeat.', category: 'PoW', icon: Activity, complexity: 'Lvl 3' },
  { id: 'longest-chain', title: 'Longest Chain Rule', desc: 'The protocol for choosing the winning version of history.', category: 'PoW', icon: Zap, complexity: 'Lvl 2' },
  { id: 'forks-reorgs', title: 'Forks & Reorgs', desc: 'When the chain splits and how it heals itself.', category: 'PoW', icon: GitFork, complexity: 'Lvl 4' },
  { id: 'pos-overview', title: 'Proof of Stake Overview', desc: 'Security through economic capital instead of energy.', category: 'PoS', icon: ShieldCheck, complexity: 'Lvl 2' },
  { id: 'pos-staking', title: 'Validators & Staking', desc: 'Participating in consensus with "skin in the game".', category: 'PoS', icon: UserCheck, complexity: 'Lvl 3' },
  { id: 'block-proposers', title: 'Block Proposers', desc: 'How the network picks who creates the next block.', category: 'PoS', icon: GanttChartSquare, complexity: 'Lvl 3' },
  { id: 'finality', title: 'Attestations & Finality', desc: 'The process of locking in transactions permanently.', category: 'PoS', icon: CheckCircle2, complexity: 'Lvl 4' },
  { id: 'slashing', title: 'Slashing Conditions', desc: 'The economic penalties that enforce honest behavior.', category: 'PoS', icon: Flame, complexity: 'Lvl 4' },
  { id: 'consensus-comparison', title: 'PoW vs PoS Trade-offs', desc: 'Comparing energy, security, and decentralization.', category: 'Advanced', icon: Scale, complexity: 'Lvl 5' },
];

const LearningPath: React.FC = () => {
  return (
    <div className="relative max-w-5xl mx-auto space-y-16 py-20 px-4 font-mono">
      {/* HUD Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800"
        >
          <Layout size={12} className="text-blue-500" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Curriculum_Structure_v2.1</span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter">LEARNING_PATH</h1>
        <p className="max-w-xl mx-auto text-xs md:text-sm text-gray-600 dark:text-gray-300 font-bold uppercase tracking-tight">Master decentralized agreement through sequential high-fidelity modules.</p>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Connection Line */}
        <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 dark:bg-slate-800 sm:-translate-x-1/2" />

        <div className="space-y-8">
          {topics.map((topic, i) => {
            const Icon = topic.icon;
            const isEven = i % 2 === 0;
            
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={clsx(
                  "relative flex items-center gap-8 group",
                  isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                )}
              >
                {/* Connector Node */}
                <div className="absolute left-8 sm:left-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-gray-200 dark:border-slate-800 sm:-translate-x-1/2 z-20 group-hover:border-blue-500 group-hover:shadow-[0_0_10px_#3b82f6] transition-all duration-500 flex items-center justify-center">
                   <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700 group-hover:bg-blue-500 transition-colors" />
                </div>

                {/* Module Card */}
                <div className="w-full sm:w-[45%] pl-16 sm:pl-0">
                  <Link to={`/learn/${topic.id}`} className="block">
                    <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5 dark:hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden group/card">
                      {/* Glassmorphic Background */}
                      <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={clsx(
                          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover/card:scale-110",
                          topic.category === 'Basics' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' :
                          topic.category === 'PoW' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                          topic.category === 'PoS' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' :
                          'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                        )}>
                          <Icon size={22} />
                        </div>
                        
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 group-hover/card:text-blue-500 transition-colors">
                              MOD_0{i + 1} // {topic.category}
                            </span>
                            <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase">{topic.complexity}</span>
                          </div>
                          <h3 className="text-sm font-black text-gray-900 dark:text-white leading-tight uppercase group-hover/card:translate-x-1 transition-transform">{topic.title}</h3>
                          <p className="text-[10px] text-gray-600 dark:text-gray-300 font-bold uppercase tracking-tight mt-2 line-clamp-2 leading-relaxed">{topic.desc}</p>
                        </div>
                      </div>

                      {/* Hover Arrow */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover/card:opacity-100 group-hover/card:translate-x-0 translate-x-4 transition-all duration-500 text-blue-500">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Empty Side for Spacer (Desktop Only) */}
                <div className="hidden sm:block w-[45%]" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Narrative Footer */}
      <div className="relative z-10 pt-10 text-center">
         <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Activity size={14} className="animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Synchronization Complete: Full Path Accessible</span>
         </div>
      </div>
    </div>
  );
};

export default LearningPath;