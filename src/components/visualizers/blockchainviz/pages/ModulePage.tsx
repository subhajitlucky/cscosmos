import { BlockchainProvider } from '../store/BlockchainContext';
import { TransactionCreator } from '../components/visualizers/TransactionCreator';
import { MempoolVisualizer } from '../components/visualizers/MempoolVisualizer';
import { ChainVisualizer } from '../components/visualizers/ChainVisualizer';
import { Activity, ShieldCheck, Zap, Database, Terminal, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsHeader = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
            { label: "Network Status", value: "Operational", icon: Globe, color: "text-green-500" },
            { label: "Consensus", value: "Active", icon: ShieldCheck, color: "text-primary" },
            { label: "Mempool Load", value: "Dynamic", icon: Zap, color: "text-yellow-500" },
            { label: "Registry", value: "Immutable", icon: Database, color: "text-blue-500" }
        ].map((stat, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card/50 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all"
            >
                <div className={`p-2.5 rounded-xl bg-secondary ${stat.color} group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">{stat.label}</div>
                    <div className="text-sm font-black tracking-tight">{stat.value}</div>
                </div>
            </motion.div>
        ))}
    </div>
);

export const ModulePage = () => {
  return (
    <BlockchainProvider>
        <div className="min-h-screen bg-background text-foreground pb-20 pt-8 px-6 md:px-12 lg:px-16 overflow-hidden relative">
            {/* --- ELITE BACKGROUND LAYER --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 opacity-[0.05]" 
                     style={{ backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 container max-w-screen-xl mx-auto space-y-12">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border/50 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                            <Terminal className="w-3.5 h-3.5" /> Simulation Core v1.0
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-foreground uppercase">
                            Protocol <span className="text-primary">Playground.</span>
                        </h1>
                        <p className="text-muted-foreground text-lg font-medium tracking-tight max-w-xl">
                            A high-fidelity sandbox to execute state transitions and observe the physical properties of cryptographic history.
                        </p>
                    </div>
                </div>

                <StatsHeader />

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Panel: Transaction Forge */}
                    <div className="lg:col-span-4 space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Transaction Forge</h2>
                                </div>
                            </div>
                            <TransactionCreator />
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Global Mempool</h2>
                                </div>
                            </div>
                            <div className="h-[550px]">
                                <MempoolVisualizer />
                            </div>
                        </section>
                    </div>

                    {/* Right Panel: The Living Chain */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                <h2 className="text-xs font-black uppercase tracking-[0.2em]">Ledger Explorer</h2>
                            </div>
                            <div className="text-[9px] font-black text-muted-foreground uppercase flex gap-6 tracking-widest">
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Consensus Active</span>
                                <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" /> P2P Sync</span>
                            </div>
                        </div>
                        <div className="bg-card/30 backdrop-blur-xl rounded-[3rem] border-2 border-border/50 p-4 md:p-10 min-h-[600px] md:min-h-[900px] shadow-2xl relative overflow-hidden">
                            {/* Background Grid Decor */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                            
                            <ChainVisualizer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BlockchainProvider>
  );
};

export default ModulePage;
