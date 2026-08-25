import React from 'react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { Zap, Shield, Share2, ArrowRight, Network, Activity, Database, Cpu, Globe } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative pt-8 md:pt-12 pb-16 md:pb-24 overflow-hidden">

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-[9px] font-mono font-black uppercase tracking-[0.2em] text-primary">System_V2.4_Active</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black leading-[0.95] tracking-tighter mb-6 text-main text-balance">
              MASTER THE <span className="text-amber-600 dark:text-amber-500">DECENTRALIZED</span> WEB.
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-text-muted max-w-md mb-8 sm:mb-10 font-medium leading-relaxed border-l border-primary/30 pl-6">
              The high-fidelity engine for blockchain P2P visualization.
              Analyze gossip vectors, test resilience, and explore the mechanics of decentralization.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/playground" className="premium-btn py-3 px-8 group">
                <span className="flex items-center gap-2 text-xs">
                  LAUNCH_SANDBOX <Zap className="w-3.5 h-3.5 group-hover:fill-primary transition-colors" />
                </span>
              </Link>

              <Link to="/learn" className="px-6 py-3 font-display text-xs font-bold uppercase tracking-widest text-text-muted hover:text-primary flex items-center gap-2 transition-all group">
                CURRICULUM <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Optimized Graphic - Now visible on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[420px]">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-[spin_40s_linear_infinite]" />
              <div className="absolute inset-4 sm:inset-8 lg:inset-12 rounded-full border border-dashed border-primary/20 animate-[spin_25s_linear_infinite_reverse]" />

              <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 w-full">
                  <StatHUD icon={<Globe />} label="REACH" value="GLOBAL" color="text-primary" />
                  <StatHUD icon={<Cpu />} label="LOGIC" value="STABLE" color="text-emerald-500" />
                  <StatHUD icon={<Network />} label="UPLINK" value="SECURE" color="text-amber-500" />
                  <StatHUD icon={<Shield />} label="SEC" value="MAX" color="text-purple-500" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Capabilities */}
      <section className="mt-12 md:mt-24 pt-8 md:pt-16 border-t border-border-dim">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            <FeatureItem
              icon={<Share2 className="w-5 h-5" />}
              title="GOSSIP_VECTORS"
              description="Visualize the exponential spread of data across peer clusters."
            />
            <FeatureItem
              icon={<Database className="w-5 h-5" />}
              title="REPLICATION"
              description="Monitor state synchronization across global network nodes."
            />
            <FeatureItem
              icon={<Activity className="w-5 h-5" />}
              title="LATENCY_SIM"
              description="Test performance under variable connection quality scenarios."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const StatHUD = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string, color: string }) => (
  <div className="premium-panel p-5 group hover:border-primary/30 transition-all duration-500">
    <div className={`mb-3 ${color} opacity-50 group-hover:opacity-100 transition-opacity`}>
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' }) : icon}
    </div>
    <div className="font-mono text-[8px] text-text-muted mb-1 tracking-widest">{label}</div>
    <div className={`text-xl font-display font-black tracking-tight ${color}`}>{value}</div>
  </div>
);

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="premium-panel p-6 group">
    <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-6 group-hover:border-primary/30 transition-all">
      {icon}
    </div>
    <h3 className="font-display font-bold text-base mb-3 tracking-tight text-main">{title}</h3>
    <p className="text-xs text-text-muted leading-relaxed font-medium">{description}</p>
  </div>
);

export default Home;