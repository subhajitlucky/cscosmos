import { useEffect, useState, useMemo } from 'react';
import { useParams, Link, Navigate } from '@/components/visualizers/shared/RouterShim';
import { topics, type TopicConfig } from '../lib/topics';
import { ArrowLeft, ArrowRight, Lightbulb, Info, Activity, Radio, BarChart3, ShieldAlert, Skull, Terminal, Zap, Cable, RefreshCw, Server, Share2, Link2, Play, Pause } from 'lucide-react';
import NetworkGraph from '../components/visualizer/NetworkGraph';
import { useNetwork } from '../hooks/useNetwork';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

const TopicDetail = () => {
  const { topicId } = useParams();
  const topic = topics.find(t => t.id === topicId) as TopicConfig;

  const { state, speed, isPaused, broadcast, reset, setSpeed, setPaused, connectNodes, killNode } = useNetwork(
    topic?.initialState || { nodes: [], connections: [], packets: [] }
  );

  const [isReconfiguring, setIsReconfiguring] = useState(false);

  // Stats Logic
  const metrics = useMemo(() => {
    const totalNodes = state.nodes.length;
    const nodesWithData = state.nodes.filter(n => (n.mempool.length > 0 || n.chain.length > 0) && !n.isDown).length;
    const saturation = totalNodes > 0 ? (nodesWithData / totalNodes) * 100 : 0;
    return {
      saturation,
      duplicates: state.stats?.duplicatesPrevented || 0,
      total: state.stats?.totalTransmissions || 0
    };
  }, [state.nodes, state.stats]);

  useEffect(() => {
    if (topic) {
      reset(topic.initialState);
    }
  }, [topicId, reset, topic]);

  const togglePause = () => {
    setPaused(!isPaused);
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  if (!topic) return <Navigate to="/learn" replace />;

  const currentIndex = topics.findIndex(t => t.id === topicId);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  const handleInteractiveAction = () => {
    topic.action({
      state,
      broadcast,
      connectNodes,
      killNode,
      togglePause,
      isPaused
    });
  };

  const setArchitecture = (type: 'centralized' | 'decentralized') => {
    const isCurrentlyCentralized = state.nodes.some(n => n.id === 'Server');
    if ((type === 'centralized' && isCurrentlyCentralized) || (type === 'decentralized' && !isCurrentlyCentralized)) return;

    setIsReconfiguring(true);

    setTimeout(() => {
      if (type === 'decentralized') {
        reset({
          nodes: [
            { id: 'Alpha', type: 'full', x: 300, y: 150, peers: ['Beta', 'Gamma', 'Delta'], mempool: [], chain: [], latency: 100 },
            { id: 'Beta', type: 'full', x: 150, y: 250, peers: ['Alpha', 'Gamma', 'Epsilon'], mempool: [], chain: [], latency: 100 },
            { id: 'Gamma', type: 'full', x: 450, y: 250, peers: ['Alpha', 'Beta', 'Zeta'], mempool: [], chain: [], latency: 100 },
            { id: 'Delta', type: 'full', x: 200, y: 450, peers: ['Alpha', 'Epsilon', 'Zeta'], mempool: [], chain: [], latency: 100 },
            { id: 'Epsilon', type: 'full', x: 400, y: 450, peers: ['Beta', 'Delta', 'Zeta'], mempool: [], chain: [], latency: 100 },
            { id: 'Zeta', type: 'full', x: 300, y: 300, peers: ['Gamma', 'Delta', 'Epsilon'], mempool: [], chain: [], latency: 100 },
          ],
          connections: [
            { id: 'ab', from: 'Alpha', to: 'Beta', latency: 1000 },
            { id: 'ag', from: 'Alpha', to: 'Gamma', latency: 1000 },
            { id: 'ad', from: 'Alpha', to: 'Delta', latency: 1000 },
            { id: 'bg', from: 'Beta', to: 'Gamma', latency: 1000 },
            { id: 'be', from: 'Beta', to: 'Epsilon', latency: 1000 },
            { id: 'gz', from: 'Gamma', to: 'Zeta', latency: 1000 },
            { id: 'dz', from: 'Delta', to: 'Zeta', latency: 1000 },
            { id: 'ez', from: 'Epsilon', to: 'Zeta', latency: 1000 },
            { id: 'de', from: 'Delta', to: 'Epsilon', latency: 1000 },
          ],
          packets: []
        });
      } else {
        reset(topic.initialState);
      }
      setTimeout(() => setIsReconfiguring(false), 400);
    }, 300);
  };

  const isCentralized = state.nodes.some(n => n.id === 'Server');

  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-primary font-black">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-bg-app flex flex-col transition-colors duration-500">
      <section className="pt-20 pb-12 px-6 max-w-6xl mx-auto w-full text-glow">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link to="/learn" className="inline-flex items-center gap-2 text-[9px] font-mono font-black uppercase tracking-[0.4em] text-primary/60 mb-6 hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" /> // INDEX_ARCHIVE
          </Link>

          <h1 className="text-4xl lg:text-6xl font-display font-black tracking-tight text-main mb-10 uppercase leading-none">
            {topic.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <div className="premium-panel p-8 border-l-4 border-l-primary bg-primary/[0.01]">
                <div className="flex items-center gap-3 mb-6 text-primary/40">
                  <Info className="w-5 h-5" />
                  <span className="tech-label text-[9px]">Module_Briefing</span>
                </div>
                <p className="text-lg lg:text-xl text-main font-medium leading-relaxed tracking-tight opacity-90">
                  {renderContent(topic.content)}
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="premium-panel p-6 bg-surface/30">
                <div className="flex items-center gap-3 mb-4 text-accent/40">
                  <Lightbulb className="w-4 h-4" />
                  <span className="tech-label text-[9px]">Conceptual_Link</span>
                </div>
                <p className="text-sm lg:text-base text-text-muted leading-relaxed italic">
                  "{topic.analogy}"
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 pb-8 sm:pb-12 max-w-6xl mx-auto w-full h-[600px] sm:h-[700px] lg:h-[800px]">
        <div className="w-full h-full premium-panel relative overflow-hidden shadow-2xl border-primary/10 bg-[#02040a]">

          <div className="absolute top-0 left-0 right-0 h-10 sm:h-12 bg-surface/80 backdrop-blur border-b border-border-dim flex items-center justify-between px-4 sm:px-6 z-20">
            <div className="flex items-center gap-2 sm:gap-3">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-pulse" />
              <span className="text-[8px] sm:text-[10px] font-mono text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em]">Neural_Simulation_Core</span>
            </div>

            {topic.id === 'why-p2p' && (
              <div className="flex items-center bg-bg-app/50 p-0.5 sm:p-1 rounded-lg border border-white/5 shadow-inner">
                <button onClick={() => setArchitecture('centralized')} className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 rounded-md font-mono text-[7px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${isCentralized ? 'bg-primary/20 text-primary border border-primary/30' : 'text-text-muted hover:text-white'}`}>
                  <Server className="w-2.5 h-2.5 sm:w-3 h-3" /> <span className="hidden xs:inline">Centralized</span><span className="xs:hidden">Central</span>
                </button>
                <button onClick={() => setArchitecture('decentralized')} className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 rounded-md font-mono text-[7px] sm:text-[9px] font-black uppercase tracking-widest transition-all ${!isCentralized ? 'bg-primary/20 text-primary border border-primary/30' : 'text-text-muted hover:text-white'}`}>
                  <Share2 className="w-2.5 h-2.5 sm:w-3 h-3" /> <span className="hidden xs:inline">P2P_Mesh</span><span className="xs:hidden">P2P</span>
                </button>
              </div>
            )}

            <div className="hidden md:flex items-center gap-4">
              <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest">Topology: {isCentralized ? 'Star' : 'Mesh'}</span>
            </div>
          </div>

          <div className="absolute top-12 sm:top-16 left-0 right-0 lg:left-auto lg:right-6 flex flex-row lg:flex-col justify-center lg:justify-start gap-2 sm:gap-3 px-4 sm:px-0 z-30 pointer-events-none text-glow">
            <MetricPanel icon={<BarChart3 />} label="Net_Saturation" value={`${metrics.saturation.toFixed(0)}%`} />
            <MetricPanel icon={<ShieldAlert />} label="Spam_Mitigated" value={metrics.duplicates} />
            {topic.id === 'why-p2p' && (
              <MetricPanel icon={<Skull />} label="Req_Failed" value={state.stats?.failedRequests || 0} />
            )}
          </div>

          <AnimatePresence>
            {topic.id === 'nodes-peers' && state.connections.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="absolute top-28 sm:top-16 left-4 sm:left-6 z-30 pointer-events-none space-y-2 w-32 sm:w-48"
              >
                <div className="hud-panel-bg p-2 sm:p-4 border border-primary/20 rounded-xl backdrop-blur-xl">
                  <h4 className="font-mono text-[7px] sm:text-[8px] font-black text-primary/60 uppercase tracking-[0.2em] mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                    <Link2 className="w-2.5 h-2.5 sm:w-3 h-3" /> PEER_TABLE
                  </h4>
                  <div className="space-y-1 sm:space-y-2">
                    {state.connections.map((c, i) => (
                      <div key={c.id} className="flex items-center justify-between text-[7px] sm:text-[9px] font-mono text-main">
                        <span className="text-primary/40">[{i}]</span>
                        <span className="truncate max-w-[60px] sm:max-w-none">{c.to.replace('Remote-', 'NODE_')}</span>
                        <span className="text-emerald-500 font-bold">ACK</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isReconfiguring && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 bg-[#02040a]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-spin" />
                <span className="font-mono text-[10px] sm:text-xs font-bold text-primary animate-pulse uppercase tracking-[0.4em]">Morphing_Topology...</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full h-full">
            <NetworkGraph state={state} topicId={topic.id} />
          </div>

          <div className="absolute bottom-16 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto flex flex-col sm:items-end gap-2 sm:gap-3 z-30">
            <button onClick={handleInteractiveAction} className="premium-btn py-3 sm:py-4 px-4 sm:px-10 shadow-lg group overflow-hidden w-full sm:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] font-black">
                {topic.id === 'nodes-peers' ? <Cable className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary animate-pulse" /> : <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-primary animate-pulse" />}
                {topic.interactiveLabel.toUpperCase()}
              </span>
            </button>

            {topic.id === 'why-p2p' && (() => {
              const targetId = isCentralized ? 'Server' : 'Alpha';
              const isTargetDown = state.nodes.find(n => n.id === targetId)?.isDown;
              return (
                <button
                  onClick={() => killNode(targetId)}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 border rounded-xl font-mono text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex-1 ${isTargetDown
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 hover:border-emerald-500'
                    : 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20 hover:border-red-500'
                    }`}
                >
                  {isTargetDown ? <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Skull className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  {isTargetDown ? 'REVIVE' : (isCentralized ? 'KILL_SERVER' : 'KILL_NODE')}
                </button>
              );
            })()}
          </div>

          <div className="absolute bottom-2 sm:bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-6 px-4 sm:px-6 py-2 sm:py-3 bg-surface/90 backdrop-blur-2xl border border-primary/20 rounded-xl shadow-xl z-20">
            <button onClick={togglePause} className="p-1.5 sm:p-2.5 rounded-lg bg-primary/5 border border-primary/10 text-primary hover:bg-primary/10 transition-all active:scale-90">
              {isPaused ? <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> : <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />}
            </button>
            <div className="h-4 sm:h-6 w-px bg-border-dim" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              {[0.5, 1, 2].map((s) => (
                <button key={s} onClick={() => changeSpeed(s)} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg font-mono text-[8px] sm:text-[9px] font-black transition-all border ${speed === s ? 'bg-primary/10 text-primary border-primary/30' : 'text-text-muted border-transparent hover:text-primary'}`}>{s}X</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="hud-panel-bg p-8 rounded-2xl border border-border-dim space-y-6">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-main tracking-tight uppercase">Simulation_Architecture</h3>
            </div>
            <div className="space-y-4 font-mono text-xs text-muted leading-relaxed">
              {topic.briefing.arch.map((item, i) => (
                <p key={i}><span className="text-primary font-bold">:: {item.label}:</span> {item.desc}</p>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="hud-panel-bg p-8 rounded-2xl border border-border-dim space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-accent" />
              <h3 className="font-display font-bold text-main tracking-tight uppercase">Operational_Logic</h3>
            </div>
            <div className="space-y-4 font-mono text-xs text-muted leading-relaxed">
              {topic.briefing.logic.map((item, i) => (
                <p key={i}><span className="text-accent font-bold">:: {item.label}:</span> {item.desc}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 max-w-6xl mx-auto w-full border-t border-border-dim mt-auto">
        <div className="flex justify-between items-center gap-8 text-glow">
          {prevTopic ? (
            <Link to={`/learn/${prevTopic.id}`} className="group flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-bg-app transition-all shadow-sm">
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest">Previous</div>
                <div className="text-xs font-display font-bold text-main group-hover:text-primary transition-colors uppercase tracking-tight">{prevTopic.title}</div>
              </div>
            </Link>
          ) : <div />}
          {nextTopic ? (
            <Link to={`/learn/${nextTopic.id}`} className="group flex items-center gap-4 text-right">
              <div className="hidden sm:block">
                <div className="text-[8px] font-mono text-text-muted uppercase tracking-widest">Next</div>
                <div className="text-xs font-display font-bold text-main group-hover:text-primary transition-colors uppercase tracking-tight">{nextTopic.title}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-bg-app transition-all shadow-sm">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ) : <div />}
        </div>
      </footer>
    </div>
  );
};

interface MetricPanelProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const MetricPanel = ({ icon, label, value }: MetricPanelProps) => (
  <div className="hud-panel-bg backdrop-blur-xl border border-border-dim p-2 sm:p-6 rounded-lg sm:rounded-xl shadow-lg min-w-[90px] sm:min-w-[220px] flex sm:block flex-col sm:items-start items-center gap-0.5 sm:gap-0">
    <div className="flex items-center gap-1.5 sm:gap-2 sm:mb-3 text-primary/60">
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-2.5 h-2.5 sm:w-3 sm:h-3' }) : icon}
      <span className="text-[6px] sm:text-[10px] font-mono font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap">{label}</span>
    </div>
    <div className="text-xs sm:text-2xl font-display font-black text-main tracking-tighter">{value}</div>
  </div>
);

export default TopicDetail;