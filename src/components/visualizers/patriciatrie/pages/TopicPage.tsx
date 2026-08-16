import React, { Suspense, lazy } from 'react';
import { useParams, Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lightbulb, PlayCircle, Database, Loader2, CheckCircle2, Cpu, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';
import { topicData } from '../utils/topicContent';
import type { VisualizerType } from '../types/topic';
import SimulationErrorBoundary from '../components/visualizers/SimulationErrorBoundary';
import { useProgress } from '../hooks/useProgress';

// Dynamic Imports for Simulations (Code Splitting)
const NibbleVisualizer = lazy(() => import('../components/visualizers/NibbleVisualizer'));
const MerkleProofVisualizer = lazy(() => import('../components/visualizers/MerkleProofVisualizer'));
const StateUpdateVisualizer = lazy(() => import('../components/visualizers/StateUpdateVisualizer'));
const TrieComparisonVisualizer = lazy(() => import('../components/visualizers/TrieComparisonVisualizer'));
const NodeArchetypeVisualizer = lazy(() => import('../components/visualizers/NodeArchetypeVisualizer'));
const PathCompressionVisualizer = lazy(() => import('../components/visualizers/PathCompressionVisualizer'));
const StateRootVisualizer = lazy(() => import('../components/visualizers/StateRootVisualizer'));
const WhyBlockchainStateVisualizer = lazy(() => import('../components/visualizers/WhyBlockchainStateVisualizer'));
const RLPVisualizer = lazy(() => import('../components/visualizers/RLPVisualizer'));
const PatriciaTrieVisualizer = lazy(() => import('../components/visualizers/PatriciaTrieVisualizer'));

const visualizerMap: Record<VisualizerType, React.ReactNode> = {
  'encoding': <NibbleVisualizer />,
  'nodes': <TrieComparisonVisualizer />,
  'archetypes': <NodeArchetypeVisualizer />,
  'compression': <PathCompressionVisualizer />,
  'root-anchor': <StateRootVisualizer />,
  'state': <WhyBlockchainStateVisualizer />,
  'state-update': <StateUpdateVisualizer />,
  'proof': <MerkleProofVisualizer />,
  'rlp': <RLPVisualizer />,
  'patricia-trie': <PatriciaTrieVisualizer />,
};

const VisualizerSkeleton = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-400">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    >
      <Loader2 size={40} className="text-orange-500/40" />
    </motion.div>
    <p className="text-xs font-black uppercase tracking-[0.2em] animate-pulse">Initializing Neural Engine...</p>
  </div>
);

const TopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicId ? topicData[topicId] : null;
  const { markAsComplete, isCompleted } = useProgress();

  if (!topic) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold">Topic not found</h2>
        <Link to="/learn" className="text-orange-500 mt-4 inline-block">Return to Learn</Link>
      </div>
    );
  }

  const completed = isCompleted(topic.id);

  const handleComplete = () => {
    if (!completed) {
      markAsComplete(topic.id);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#8b5cf6', '#ffffff'] // Orange, Violet, White
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      {/* Navigation Breadcrumb */}
      <div className="flex justify-between items-center py-8">
        <Link to="/learn" className="inline-flex items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
             <ArrowLeft size={14} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">Back to Hub</span>
        </Link>
        {completed && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
          >
            <CheckCircle2 size={12} /> Module Mastered
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-16">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 mb-6">
             <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-violet-600 rounded-full" />
             <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
               {topic.tag} Protocol
             </span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black mb-8 text-neutral-900 dark:text-white tracking-tight leading-[0.9]">
            {topic.title}
          </h1>
          <p className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium max-w-3xl">
            {topic.definition}
          </p>
          
          <div className="mt-10 p-6 rounded-3xl bg-orange-500/5 border border-orange-500/20 backdrop-blur-sm flex gap-5 items-start">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
              <Lightbulb size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest block mb-2">Conceptual Analogy</span>
              <p className="text-neutral-700 dark:text-neutral-200 italic font-medium text-lg leading-relaxed">"{topic.analogy}"</p>
            </div>
          </div>
        </motion.div>

        {/* Cinematic Simulation Stage */}
        <div className="w-full relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-violet-500/5 to-orange-500/5 blur-3xl -z-10" />
          <div className="w-full min-h-[500px] lg:min-h-[700px] bg-white dark:bg-neutral-900/80 rounded-[48px] border border-neutral-200 dark:border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col">
            
            {/* Simulation Header / Toolbar */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-200 dark:border-white/5">
               <div className="flex items-center gap-3">
                  <Cpu size={18} className="text-violet-500" />
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-500">Interactive Environment</span>
               </div>
               <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
               </div>
            </div>

            <div className="flex-1 w-full overflow-hidden relative">
               <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />
               <div className="w-full h-full overflow-auto p-4 md:p-12 custom-scrollbar">
                  <div className="w-full min-h-full flex items-center justify-center">
                      <div className="w-full max-w-full">
                        <SimulationErrorBoundary>
                          <Suspense fallback={<VisualizerSkeleton />}>
                            {visualizerMap[topic.visualType]}
                          </Suspense>
                        </SimulationErrorBoundary>
                      </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
           {/* Deep Dive Column */}
           <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-neutral-900 dark:bg-black rounded-[40px] border border-neutral-800 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                   <Terminal size={140} />
                </div>
                <div className="relative z-10">
                   <h3 className="text-xs font-black text-violet-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Database size={14} /> Engineer's Note
                   </h3>
                   <p className="text-neutral-300 leading-relaxed font-medium text-lg">
                     {topic.deepDive}
                   </p>
                </div>
              </motion.div>
           </div>

           {/* Key Concepts Column */}
           <div className="lg:col-span-7 space-y-8">
              <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <PlayCircle className="text-orange-500" size={24} /> Key Takeaways
              </h3>
              <div className="grid gap-4">
                {topic.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex gap-6 p-6 rounded-[32px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-orange-500/30 transition-all shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center text-lg font-black text-neutral-400 transition-colors shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <span className="font-bold block mb-2 text-lg text-neutral-900 dark:text-white">{step.title}</span>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-medium">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-8 pt-16 border-t border-neutral-200 dark:border-neutral-800">
           <div className="flex-1 flex justify-start w-full sm:w-auto">
              <button 
                onClick={handleComplete}
                disabled={completed}
                className={`
                  w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
                  ${completed 
                    ? 'bg-emerald-500 text-white cursor-default shadow-lg shadow-emerald-500/20' 
                    : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:scale-105 shadow-2xl shadow-orange-500/20'}
                `}
              >
                {completed ? <CheckCircle2 size={18} /> : <PlayCircle size={18} />}
                {completed ? 'Lesson Completed' : 'Mark as Complete'}
              </button>
           </div>

           <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
              {(() => {
                const topicIds = Object.keys(topicData);
                const currentIndex = topicIds.indexOf(topic.id);
                const prevTopicId = currentIndex > 0 ? topicIds[currentIndex - 1] : null;
                const nextTopicId = currentIndex < topicIds.length - 1 ? topicIds[currentIndex + 1] : null;
                const prevTopic = prevTopicId ? topicData[prevTopicId] : null;
                const nextTopic = nextTopicId ? topicData[nextTopicId] : null;

                return (
                  <>
                    {prevTopic && (
                      <Link
                        to={`/learn/${prevTopic.id}`}
                        className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-orange-500/50 hover:bg-white dark:hover:bg-neutral-900 transition-all text-neutral-500 hover:text-orange-500"
                        title="Previous Lesson"
                      >
                        <ArrowLeft size={20} />
                      </Link>
                    )}
                    {nextTopic && (
                      <Link
                        to={`/learn/${nextTopic.id}`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-orange-500/30 transition-all active:scale-95"
                      >
                        Next Lesson <ArrowRight size={16} />
                      </Link>
                    )}
                  </>
                );
              })()}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;