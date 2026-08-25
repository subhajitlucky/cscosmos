import React, { useEffect } from 'react';
import { useParams, Link } from '@/components/visualizers/shared/RouterShim';
import { TOPICS } from '../lib/evm/topics';
import { useEVM } from '../hooks/useEVM';
import StackVisualizer from '../components/visualizers/StackVisualizer';
import MemoryVisualizer from '../components/visualizers/MemoryVisualizer';
import StorageVisualizer from '../components/visualizers/StorageVisualizer';
import OpcodeVisualizer from '../components/visualizers/OpcodeVisualizer';
import GasMeter from '../components/visualizers/GasMeter';
import { ArrowLeft, ChevronRight, ChevronLeft, SkipForward, RotateCcw, Book, Sparkles, Cpu, Database, Layers, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated visualization components for each concept
const EVMOverviewAnimation: React.FC = () => (
  <div className="relative h-64 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute w-48 h-48 rounded-full border-2 border-evm-accent/20"
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute w-32 h-32 rounded-full border-2 border-blue-500/20"
    />
    <div className="relative flex flex-col items-center">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="p-4 rounded-2xl bg-evm-accent/10 text-evm-accent mb-2"
      >
        <Cpu size={40} />
      </motion.div>
      <span className="text-sm font-mono text-neutral-500">EVM Core</span>
    </div>
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center"
    >
      <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 mb-1">
        <Layers size={20} />
      </div>
      <span className="text-[10px] text-neutral-500">Stack</span>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 }}
      className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center"
    >
      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 mb-1">
        <Database size={20} />
      </div>
      <span className="text-[10px] text-neutral-500">Storage</span>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center"
    >
      <div className="p-2 rounded-lg bg-green-500/10 text-green-500 mb-1">
        <Zap size={20} />
      </div>
      <span className="text-[10px] text-neutral-500">Gas</span>
    </motion.div>
  </div>
);

const StackAnimation: React.FC = () => {
  return (
    <div className="relative h-48 flex flex-col items-center justify-end pb-4">
      <div className="absolute top-0 text-[10px] text-neutral-500 uppercase tracking-wide">Stack (LIFO)</div>
      <motion.div
        className="w-24 h-8 bg-evm-accent/20 border-2 border-evm-accent rounded-lg flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-xs font-mono">0x03</span>
      </motion.div>
      <motion.div
        className="w-24 h-8 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-xs font-mono">0x02</span>
      </motion.div>
      <motion.div
        className="w-24 h-8 bg-amber-500/20 border-2 border-amber-500 rounded-lg flex items-center justify-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-xs font-mono">0x01</span>
      </motion.div>
      <div className="absolute bottom-0 w-24 h-1 bg-neutral-300 dark:bg-neutral-700 rounded" />
      <p className="absolute -right-32 top-1/2 -translate-y-1/2 text-[10px] text-neutral-500 max-w-[100px]">
        Last item added is first to be removed
      </p>
    </div>
  );
};

const MemoryAnimation: React.FC = () => (
  <div className="relative h-40">
    <div className="flex items-end justify-center gap-1 h-full">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${20 + Math.sin(i * 0.8) * 15 + 20}%` }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="w-8 bg-amber-500/20 border border-amber-500/40 rounded-t"
        />
      ))}
    </div>
    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-neutral-500 px-2">
      <span>Offset 0x00</span>
      <span>Offset 0x1F</span>
    </div>
  </div>
);

const StorageAnimation: React.FC = () => (
  <div className="relative h-40">
    <div className="grid grid-cols-4 gap-2">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
        >
          <div className="text-[8px] text-neutral-400">slot {i}</div>
          <div className="text-xs font-mono text-evm-accent truncate">
            {i === 0 ? '0x0000...0001' : '0x0'}
          </div>
        </motion.div>
      ))}
    </div>
    <p className="text-[10px] text-neutral-500 text-center mt-2">Persistent key-value storage</p>
  </div>
);

const ControlFlowAnimation: React.FC = () => (
  <div className="relative h-32">
    <div className="flex items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700"
      >
        <span className="text-xs font-mono">PC: 0</span>
      </motion.div>
      <motion.div
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-evm-accent"
      >
        →
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-3 py-2 rounded-lg bg-evm-accent/10 border border-evm-accent"
      >
        <span className="text-xs font-mono text-evm-accent">JUMP to 5</span>
      </motion.div>
      <motion.div
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        className="text-blue-500"
      >
        ↗
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500"
      >
        <span className="text-xs font-mono text-blue-500">PC: 5 (JUMPDEST)</span>
      </motion.div>
    </div>
  </div>
);

const GasAnimation: React.FC = () => (
  <div className="relative h-32">
    <div className="flex items-end justify-center gap-8 h-full pb-4">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '60%' }}
          transition={{ duration: 0.5 }}
          className="w-12 bg-green-500/30 border-2 border-green-500 rounded-t"
        />
        <span className="text-[10px] text-neutral-500 mt-1">ADD (3)</span>
      </div>
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '80%' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-12 bg-blue-500/30 border-2 border-blue-500 rounded-t"
        />
        <span className="text-[10px] text-neutral-500 mt-1">MSTORE (12)</span>
      </div>
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-12 bg-red-500/30 border-2 border-red-500 rounded-t"
        />
        <span className="text-[10px] text-neutral-500 mt-1">SSTORE (20k)</span>
      </div>
    </div>
  </div>
);

const RevertAnimation: React.FC = () => (
  <div className="relative h-32">
    <div className="flex flex-col items-center gap-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500 text-green-600 dark:text-green-400 text-xs"
      >
        ✓ State Change 1
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500 text-green-600 dark:text-green-400 text-xs"
      >
        ✓ State Change 2
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500 text-red-600 dark:text-red-400 text-xs flex items-center gap-2"
      >
        <AlertTriangle size={14} /> REVERT!
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs"
      >
        ← All changes undone
      </motion.div>
    </div>
  </div>
);

// Map topics to their animations
const getTopicAnimation = (topicId: string) => {
  const animations: Record<string, React.FC> = {
    'intro': EVMOverviewAnimation,
    'execution-env': EVMOverviewAnimation,
    'stack': StackAnimation,
    'memory': MemoryAnimation,
    'storage': StorageAnimation,
    'storage-layout': StorageAnimation,
    'opcodes': EVMOverviewAnimation,
    'control-flow': ControlFlowAnimation,
    'gas': GasAnimation,
    'calls': EVMOverviewAnimation,
    'reverts': RevertAnimation,
  };
  return animations[topicId] || EVMOverviewAnimation;
};

const TopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  
  const topicIdx = TOPICS.findIndex(t => t.id === topicId);
  const topic = TOPICS[topicIdx];
  const nextTopic = TOPICS[topicIdx + 1];
  const prevTopic = TOPICS[topicIdx - 1];

  const { state, agentResponse, step, reset } = useEVM(topic?.bytecode);

  useEffect(() => {
    if (topic?.bytecode) {
      reset(topic.bytecode);
    }
    window.scrollTo(0, 0);
  }, [topic, reset]);

  if (!topic) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4 text-neutral-900 dark:text-white">Topic not found</h2>
        <Link to="/learn" className="text-evm-accent hover:underline">Back to Learning Path</Link>
      </div>
    );
  }

  const handleReset = () => {
    if (topic.bytecode) {
      reset(topic.bytecode);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <nav className="flex items-center justify-between py-4">
        <Link to="/learn" className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back to Curriculum
        </Link>
        <div className="text-xs font-mono text-neutral-600">
          Lesson {topicIdx + 1} of {TOPICS.length}
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Content Side */}
        <div className="lg:col-span-5 space-y-8">
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-evm-accent/10 text-evm-accent text-[10px] font-bold uppercase tracking-wider">
              <Book size={12} /> {topic.id.replace('-', ' ')}
            </div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">{topic.title}</h1>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed italic border-l-2 border-neutral-200 dark:border-neutral-800 pl-6">
                {topic.description}
              </p>
              <div className="h-px w-20 bg-neutral-100 dark:bg-neutral-800 my-8" />
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-lg">
                {topic.content}
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 pt-12">
            {prevTopic ? (
              <Link 
                to={`/learn/${prevTopic.id}`}
                className="group flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm"
              >
                <div className="text-[10px] uppercase text-neutral-400 dark:text-neutral-600 font-bold flex items-center gap-1">
                   <ChevronLeft size={10} /> Previous
                </div>
                <div className="text-sm font-bold truncate text-neutral-900 dark:text-white group-hover:text-evm-accent transition-colors">{prevTopic.title}</div>
              </Link>
            ) : <div />}
            
            {nextTopic ? (
              <Link 
                to={`/learn/${nextTopic.id}`}
                className="group flex flex-col gap-2 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-evm-accent/30 transition-all text-right shadow-sm"
              >
                <div className="text-[10px] uppercase text-neutral-400 dark:text-neutral-600 font-bold flex items-center gap-1 justify-end">
                   Next Up <ChevronRight size={10} />
                </div>
                <div className="text-sm font-bold truncate text-neutral-900 dark:text-white group-hover:text-evm-accent transition-colors">{nextTopic.title}</div>
              </Link>
            ) : (
               <Link 
                to="/playground"
                className="group flex flex-col gap-2 p-4 rounded-xl bg-evm-accent text-neutral-950 transition-all text-right shadow-md"
              >
                <div className="text-[10px] uppercase text-neutral-900/60 font-bold flex items-center gap-1 justify-end">
                   Final Step <ChevronRight size={10} />
                </div>
                <div className="text-sm font-bold truncate">Open Playground</div>
              </Link>
            )}
          </div>
        </div>

        {/* Visualizer Side */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {topic.bytecode ? (
              <motion.div 
                key={`${topic.id}-sim`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4 sticky top-24"
              >
                <div className="flex items-center justify-between p-4 rounded-t-xl bg-white dark:bg-neutral-900 border-x border-t border-neutral-200 dark:border-neutral-800 shadow-sm transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-evm-accent animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-400">Execution Simulation</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleReset}
                      className="p-1.5 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm"
                      title="Reset simulation"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button 
                      onClick={step}
                      disabled={state?.status !== 'idle' && state?.status !== 'running'}
                      className="px-4 py-1.5 rounded bg-evm-accent text-neutral-950 text-xs font-bold hover:bg-evm-accent/90 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md"
                    >
                      <SkipForward size={14} /> Step Instruction
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    {/* Assistant Thought */}
                    <div className="p-3 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/30 shadow-sm transition-colors">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">
                          <Sparkles size={12} /> Assistant Note
                       </div>
                       <p className="text-xs text-neutral-600 dark:text-neutral-300 italic leading-relaxed">
                         "{agentResponse?.thought}"
                       </p>
                    </div>
                    <div className="h-[250px]">
                      <OpcodeVisualizer code={state?.code || new Uint8Array(0)} pc={state?.pc || 0} />
                    </div>
                    <div className="h-[300px]">
                      <StackVisualizer stack={state?.stack || []} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="h-[300px]">
                      {topic.id === 'storage' || topic.id === 'storage-layout' ? (
                        <StorageVisualizer storage={state?.storage || {}} />
                      ) : (
                        <MemoryVisualizer memory={state?.memory || new Uint8Array(0)} />
                      )}
                    </div>
                    <GasMeter 
                      totalUsed={state?.gasDetails?.totalUsed || 0}
                      lastCost={state?.gasDetails?.lastCost || 0}
                      remaining={state?.gas || 0}
                      refund={state?.gasDetails?.refund || 0}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={`${topic.id}-static`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px] relative overflow-hidden"
              >
                {/* Animated Visualization for this Topic */}
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  {React.createElement(getTopicAnimation(topic.id))}
                </motion.div>

                <div className="space-y-2 relative z-10">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Visual Concept</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                    The next interactive lesson will let you step through actual bytecode to see this concept in action.
                  </p>
                </div>

                {nextTopic && (
                  <Link
                    to={`/learn/${nextTopic.id}`}
                    className="mt-6 px-6 py-2.5 bg-evm-accent text-neutral-950 font-semibold rounded-lg hover:scale-105 transition-all flex items-center gap-2 text-sm"
                  >
                    Try Interactive Example <ChevronRight size={16} />
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TopicPage;