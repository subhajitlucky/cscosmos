'use client';

import { learningPath } from '../data/learning-path';
import { ArrowLeft, Repeat, AlertTriangle, Binary } from 'lucide-react';
import { BTreeSim } from '../components/visualizers/BTreeSim';
import Link from 'next/link';

/**
 * Two statements that are true of MongoDB in general, shown when a topic has no authored
 * tradeoffs of its own. They used to render under a per-topic "Technical_Tradeoffs" heading on
 * all ten topics, which claimed they were specific to whichever topic you were reading (FS-13).
 * They are now labelled as general, and `Topic.tradeoffs` is the seam for real per-topic ones.
 */
const GENERAL_MONGODB_TRADEOFFS = [
  'Excessive indexing increases storage overhead and write latency.',
  'Schema flexibility can lead to data fragmentation if not governed.',
];

export function TopicDetail({ topicId }: { topicId: string }) {
  // Find topic in data
  const allTopics = learningPath.flatMap(d => d.topics);
  const topic = allTopics.find(t => t.id === topicId) || allTopics[0];

  const tradeoffs = topic.tradeoffs?.length ? topic.tradeoffs : GENERAL_MONGODB_TRADEOFFS;
  const tradeoffsHeading = topic.tradeoffs?.length ? 'Technical_Tradeoffs' : 'General_MongoDB_Tradeoffs';

  const renderVisualization = () => {
    switch (topic.id) {
      case 'btree':
        return <BTreeSim />;
      default:
        // This used to be a permanently pulsing "Diagnostic_Sim_Loading" panel, which reads as
        // "still loading" forever — the topic looked broken rather than unimplemented. Only
        // `btree` has a simulator, so say so plainly and point at the one that exists, using
        // the topic's own `status` from the data (four topics are marked `coming-soon`).
        return (
          <div className="flex flex-col items-center justify-center h-full p-12 space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-10" />
            <Binary className="w-20 h-20 text-emerald-400 opacity-10" />
            <div className="text-center space-y-4 relative z-10 max-w-md">
              <span className="text-[10px] font-black text-emerald-400/60 uppercase tracking-[0.5em]">
                {topic.status === 'coming-soon' ? 'Module_Not_Available_Yet' : 'No_Interactive_Simulator'}
              </span>
              <p className="text-sm font-bold text-emerald-400/40 uppercase tracking-widest">
                {topic.name}
              </p>
              <p className="text-[11px] leading-relaxed text-emerald-400/50 normal-case tracking-normal">
                {topic.status === 'coming-soon'
                  ? 'This topic is planned but not written yet. The theory on the left is the authored content that exists for it.'
                  : 'This topic has no interactive simulator yet — the written material on the left is the whole of it. The B-Tree index topic is the one with a working simulator.'}
              </p>
              <Link
                href="/mongocosmos/learn/btree"
                className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Open_the_B-Tree_simulator →
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-32 pb-32">
      {/* Back Nav */}
      <Link href="/mongocosmos/learn" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400/40 hover:text-emerald-400 transition-all group">
        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
        BACK_TO_MAP
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-24">
        
        {/* Left Column: Theory & Context */}
        <div className="xl:col-span-4 space-y-20">
          
          {/* Header */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-emerald-500/10 border-2 border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">
                {topic.domain}
              </div>
              <div className="h-px flex-grow bg-emerald-500/10" />
            </div>
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic leading-none text-glow text-emerald-400">{topic.name}</h1>
            <div className="p-8 border-l-[12px] border-emerald-500 bg-emerald-500/5 italic">
              <p className="text-lg font-bold text-emerald-400/60 uppercase leading-relaxed">
                &ldquo;{topic.description}&rdquo;
              </p>
            </div>
          </div>

          {/* Analogy */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border-2 border-emerald-500/20 flex items-center justify-center bg-emerald-500/5">
                <Repeat className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400/40">Real_World_Analogy</h2>
            </div>
            <div className="p-10 border-4 border-emerald-500/10 dark:bg-black/40 bg-white/60 relative group overflow-hidden">
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-base font-black text-emerald-400/80 uppercase leading-relaxed relative z-10 italic tracking-wide">
                {topic.analogy}
              </p>
            </div>
          </div>

          {/* Trade-offs & Mistakes */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-amber-500">
              <div className="w-10 h-10 border-2 border-amber-500/20 flex items-center justify-center bg-amber-500/5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500/40">{tradeoffsHeading}</h2>
            </div>
            <ul className="space-y-6">
              {tradeoffs.map((m, i) => (
                <li key={i} className="flex items-start gap-6 text-[11px] font-black text-emerald-400/40 uppercase leading-relaxed italic">
                  <div className="w-2 h-2 bg-amber-500 mt-1.5 flex-shrink-0 rotate-45 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                  {m}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Column: Visual Stage */}
        <div className="xl:col-span-8 space-y-12">
          <div className="flex items-center justify-between border-b-2 border-emerald-500/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">SIMULATION_STAGE</span>
            </div>
          </div>

          <div className="h-[750px] border-4 border-emerald-500/20 bg-black/60 backdrop-blur-2xl relative overflow-hidden shadow-2xl">
            {renderVisualization()}
          </div>
        </div>

      </div>
    </div>
  );
}
