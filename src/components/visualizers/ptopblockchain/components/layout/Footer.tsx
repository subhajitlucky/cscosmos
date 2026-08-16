import { Heart, Terminal, Cpu, Network, Activity } from 'lucide-react';
import { Link } from '@/components/visualizers/shared/RouterShim';

const Footer = () => {
  return (
    <footer className="border-t border-border-dim bg-surface/50 backdrop-blur-md mt-auto relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-6 text-primary font-display font-black tracking-widest text-lg uppercase">
              <Terminal className="w-6 h-6" /> P2P_VIZ.CORE
            </div>
            <p className="text-muted text-xs font-mono leading-relaxed max-w-md">
              High-fidelity decentralized network simulation environment. 
              Visualizing gossip protocols, state replication, and consensus mechanics in real-time.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/20 bg-primary/5 text-[10px] font-mono uppercase tracking-widest text-primary">
                 <Cpu className="w-3.5 h-3.5" /> Kernel: v2.4.0
               </div>
               <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-mono uppercase tracking-widest text-emerald-500">
                 <Network className="w-3.5 h-3.5" /> Uplink: Secure
               </div>
            </div>
          </div>
          
          <div className="md:col-span-5">
            <h4 className="font-display font-bold text-[11px] uppercase tracking-[0.3em] text-primary/60 mb-6">Quick_Access_Nodes</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs font-mono text-muted">
              <li><Link to="/" className="hover:text-primary transition-colors flex items-center gap-2"><span>::</span> MISSION_CONTROL</Link></li>
              <li><Link to="/learn" className="hover:text-primary transition-colors flex items-center gap-2"><span>::</span> TRAINING_MODULES</Link></li>
              <li><Link to="/playground" className="hover:text-primary transition-colors flex items-center gap-2"><span>::</span> WAR_ROOM</Link></li>
              <li><Link to="/learn/gossip-basics" className="hover:text-primary transition-colors flex items-center gap-2"><span>::</span> GOSSIP_ALGO</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-dim flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-mono text-muted uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} P2P_VISUALIZER. [SYSTEM_ID: REDACTED]</p>
          
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2 text-emerald-500 font-bold cursor-default">
              <Activity className="w-3.5 h-3.5" />
              STATUS: OPTIMAL
            </span>
            <span className="flex items-center gap-2 group cursor-default">
              built by gemini 3 flash <Heart className="w-3.5 h-3.5 fill-current text-red-500 animate-heartbeat" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;