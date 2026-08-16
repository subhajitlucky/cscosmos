import React, { useEffect } from 'react';
import { useParams, Link } from '@/components/visualizers/shared/RouterShim';
import { ArrowLeft, BookOpen, Lightbulb, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { topicContent } from '../data/content';
import MiningViz from '../components/visualizations/MiningViz';
import ConsensusIntroViz from '../components/visualizations/ConsensusIntroViz';
import LongestChainViz from '../components/visualizations/LongestChainViz';
import PoSViz from '../components/visualizations/PoSViz';
import FinalityViz from '../components/visualizations/FinalityViz';
import TrustlessNetworksViz from '../components/visualizations/TrustlessNetworksViz';
import PoWOverviewViz from '../components/visualizations/PoWOverviewViz';
import DifficultyAdjustmentViz from '../components/visualizations/DifficultyAdjustmentViz';
import ForksReorgsViz from '../components/visualizations/ForksReorgsViz';
import PoSOverviewViz from '../components/visualizations/PoSOverviewViz';
import BlockProposersViz from '../components/visualizations/BlockProposersViz';
import SlashingViz from '../components/visualizations/SlashingViz';
import ConsensusComparisonViz from '../components/visualizations/ConsensusComparisonViz';

const TopicPage: React.FC = () => {
  const { topicId } = useParams();
  const content = topicId ? topicContent[topicId] : null;

  // Ensure page scrolls to top on topic change
  useEffect(() => {
    const scrollHandle = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(scrollHandle);
  }, [topicId]);

  const topicKeys = Object.keys(topicContent);
  const currentIndex = topicId ? topicKeys.indexOf(topicId) : -1;
  
  const prevTopicId = currentIndex > 0 ? topicKeys[currentIndex - 1] : null;
  const nextTopicId = currentIndex !== -1 && currentIndex < topicKeys.length - 1 ? topicKeys[currentIndex + 1] : null;
  
  const prevTopic = prevTopicId ? topicContent[prevTopicId] : null;
  const nextTopic = nextTopicId ? topicContent[nextTopicId] : null;

  const renderVisualization = () => {
    switch (topicId) {
      case 'why-consensus':
        return <ConsensusIntroViz />;
      case 'trustless-networks':
        return <TrustlessNetworksViz />;
      case 'pow-overview':
        return <PoWOverviewViz />;
      case 'pow-mining':
        return <MiningViz />;
      case 'difficulty-adjustment':
        return <DifficultyAdjustmentViz />;
      case 'longest-chain':
        return <LongestChainViz />;
      case 'forks-reorgs':
        return <ForksReorgsViz />;
      case 'pos-overview':
        return <PoSOverviewViz />;
      case 'pos-staking':
        return <PoSViz />;
      case 'block-proposers':
        return <BlockProposersViz />;
      case 'finality':
        return <FinalityViz />;
      case 'slashing':
        return <SlashingViz />;
      case 'consensus-comparison':
        return <ConsensusComparisonViz />;
      default:
        return (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 min-h-[400px] flex items-center justify-center">
             <p className="text-gray-500">Interactive Visualization for "{topicId}" is coming soon.</p>
          </div>
        );
    }
  };

  if (!content) {
    return (
      <div className="text-center py-20 font-mono">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter transition-colors">Topic not found</h2>
        <Link to="/learn" className="text-blue-600 dark:text-blue-400 hover:underline mt-4 inline-block font-black uppercase tracking-widest text-xs">Return to Learning Path</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-mono">
      <Link to="/learn" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" /> Back to Learning Path
      </Link>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={topicId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <header className="space-y-4 text-left">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
              {content.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-bold uppercase tracking-tight">
              {content.definition}
            </p>
          </header>

          <section className="bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 p-5 rounded-r-xl text-left">
            <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400">
              <Lightbulb className="w-4 h-4" />
              <h3 className="font-bold uppercase tracking-wider text-xs">The "Quirky" Analogy</h3>
            </div>
            <p className="italic text-sm sm:text-base text-gray-700 dark:text-gray-300 font-bold uppercase tracking-tight">
              "{content.quirkyExample}"
            </p>
          </section>

          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-indigo-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">Interactive Concept</h2>
            </div>
            <div className="relative">
               {renderVisualization()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <section className="space-y-4 text-left">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="w-4 h-4" />
                <h3 className="font-bold text-base uppercase tracking-widest">Key Takeaways</h3>
              </div>
              <ul className="space-y-3">
                {content.keyTakeaways.map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-700 dark:text-gray-300 font-bold uppercase text-[11px] tracking-tight">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0 flex items-center justify-center text-xs font-black">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-4 text-left">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white uppercase tracking-widest">Deep Dive</h3>
              <div className="prose dark:prose-invert text-gray-600 dark:text-gray-400 whitespace-pre-line text-[11px] font-bold uppercase leading-relaxed tracking-tight">
                {content.deepDive}
              </div>
            </section>
          </div>

          {/* Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-12 border-t border-gray-100 dark:border-slate-800">
            {prevTopic ? (
              <Link
                to={`/learn/${prevTopic.id}`}
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-inner">
                  <ChevronLeft size={20} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mb-0.5">Previous</div>
                  <div className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base uppercase tracking-tight">{prevTopic.title}</div>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {nextTopic ? (
              <Link
                to={`/learn/${nextTopic.id}`}
                className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group text-right"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest mb-0.5">Next</div>
                  <div className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base uppercase tracking-tight">{nextTopic.title}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-inner">
                  <ChevronRight size={20} />
                </div>
              </Link>
            ) : (
               <div className="hidden sm:block" />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TopicPage;