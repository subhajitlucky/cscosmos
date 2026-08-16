import React from 'react';
import { useParams, Navigate, Link } from '@/components/visualizers/shared/RouterShim';
import { TOPICS } from '../data/topics';
import { HashDemo } from '../components/visualizers/HashDemo';
import { DigitalSignatureVisualizer } from '../components/visualizers/DigitalSignatureVisualizer';
import { PublicKeyDemo } from '../components/visualizers/PublicKeyDemo';
import { SignVerifyVisualizer } from '../components/visualizers/SignVerifyVisualizer';
import { CaesarCipherDemo } from '../components/visualizers/CaesarCipherDemo';
import { AvalancheDemo } from '../components/visualizers/AvalancheDemo';
import { BlockchainDemo } from '../components/visualizers/BlockchainDemo';
import { HashVsEncryption } from '../components/visualizers/HashVsEncryption';
import { ArrowLeft, ArrowRight, Activity, Globe, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

export const TopicPage: React.FC = () => {
  const { topicId } = useParams();
  const topicIndex = TOPICS.findIndex(t => t.id === topicId);
  const topic = TOPICS[topicIndex];
  const nextTopic = TOPICS[topicIndex + 1];
  const prevTopic = TOPICS[topicIndex - 1];

  if (!topic) {
    return <Navigate to="/learn" replace />;
  }

  const renderVisualizer = () => {
    switch (topic.visualizerType) {
      case 'intro':
        return <CaesarCipherDemo />;
      case 'avalanche':
        return <AvalancheDemo />;
      case 'sig-concept':
        return <DigitalSignatureVisualizer />;
      case 'pk-concept':
        return <PublicKeyDemo />;
      case 'sig-vs-ver':
        return <SignVerifyVisualizer />;
      case 'hash-simple':
      case 'hash-props':
        return <HashDemo />;
      case 'blockchain':
         return <BlockchainDemo />;
      case 'hash-vs-enc':
         return <HashVsEncryption />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col pb-20 overflow-hidden">
      <BackgroundAtmosphere />
      
      <div className="max-w-6xl mx-auto w-full p-6 md:p-8 relative z-10">
        {/* Navigation Breadcrumb */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/learn" className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-brand-600 transition-all text-[10px] font-black uppercase tracking-widest mb-12 shadow-sm">
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Path</span>
            </Link>
        </motion.div>

        {/* Module Header */}
        <div className="mb-16">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6"
            >
                <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-600">
                    <topic.icon className="w-8 h-8" />
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Module {topicIndex + 1} of {TOPICS.length}
                </div>
            </motion.div>
            
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-6"
            >
                {topic.title}
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-3xl"
            >
                {topic.content.definition}
            </motion.p>
        </div>

        {/* Content Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {/* Analogy Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Analogy</h3>
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed">
                    "{topic.content.analogy}"
                </p>
            </motion.div>

            {/* Properties Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600">
                        <Shield className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Key Properties</h3>
                </div>
                <ul className="space-y-4">
                    {topic.content.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 leading-tight">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            {/* Real World Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-emerald-500/20 dark:border-emerald-500/10 rounded-[2rem] flex flex-col shadow-xl shadow-emerald-500/5"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                        <Globe className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600/60 dark:text-emerald-400/60">Real World</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
                    {topic.content.realWorldUsage}
                </p>
            </motion.div>
        </div>

        {/* Visualizer Section */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-20"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-600">
                        <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Interactive Simulation</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/60 dark:text-emerald-400/60">Live Environment</span>
                </div>
            </div>
            
            <div className="relative group">
                {/* Corner Decorative Elements */}
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-slate-200 dark:border-slate-800 rounded-tl-xl pointer-events-none" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-slate-200 dark:border-slate-800 rounded-tr-xl pointer-events-none" />
                
                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 md:p-12 shadow-2xl overflow-hidden transition-all duration-500 hover:border-slate-300 dark:hover:border-slate-700">
                    {renderVisualizer()}
                </div>
            </div>
        </motion.div>

        {/* Navigation Footer */}
        <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 pt-12 border-t border-slate-200 dark:border-white/10">
            {prevTopic ? (
                <Link to={`/learn/${prevTopic.id}`} className="flex-1 group p-6 rounded-[2rem] border-2 border-slate-100 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md hover:border-brand-500/30 transition-all flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-500 transition-colors">
                        <ArrowLeft className="w-6 h-6 transform group-hover:translate-x-[-2px] transition-transform" />
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Previous Module</div>
                        <div className="text-lg font-black text-slate-900 dark:text-white leading-tight">{prevTopic.title}</div>
                    </div>
                </Link>
            ) : <div className="flex-1" />}

            {nextTopic ? (
                <Link to={`/learn/${nextTopic.id}`} className="flex-1 group p-6 rounded-[2rem] bg-slate-900 dark:bg-brand-600 text-white transition-all flex items-center justify-between shadow-xl dark:shadow-glow-brand hover:scale-[1.02] active:scale-[0.98]">
                    <div className="text-left">
                        <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Next Module</div>
                        <div className="text-lg font-black leading-tight">{nextTopic.title}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            ) : (
                <Link to="/playground" className="flex-1 group p-6 rounded-[2rem] bg-brand-600 text-white transition-all flex items-center justify-between shadow-xl dark:shadow-glow-brand hover:scale-[1.02] active:scale-[0.98]">
                    <div className="text-left">
                        <div className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] mb-1">Learning Complete</div>
                        <div className="text-lg font-black leading-tight">Enter the Sandbox</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                        <ArrowRight className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            )}
        </div>
      </div>
    </div>
  );
};
export default TopicPage;
