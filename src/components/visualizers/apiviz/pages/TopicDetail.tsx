'use client';

import { learningPath } from '../data/learning-path';
import { AlertTriangle, ArrowLeft, Code2, Layers, PlayCircle, Repeat } from 'lucide-react';
import Link from 'next/link';
import { TopicVisual } from '../components/topic-visuals/TopicVisual';
import { VISUAL_LABELS } from '../components/topic-visuals/chrome';

export function TopicDetail({ topicId }: { topicId: string }) {
  // Find topic in data
  const allTopics = learningPath.flatMap(d => d.topics);
  const topic = allTopics.find(t => t.id === topicId) || allTopics[0];
  const domain = learningPath.find(d => d.topics.some(t => t.id === topic.id)) ?? learningPath[0];

  // FS-20: `LearningPath` marks the eight `coming-soon` topics as LOCKED (`href="#"`,
  // grayscale, a "LOCKED" label) — but this route rendered the same interactive template for
  // every id, so those lessons were fully reachable by URL and the lock was decorative. The
  // lock is the honest half (the data says the lesson is not written), so the route now
  // agrees with it instead of quietly contradicting it.
  const isActive = topic.status === 'active';

  return (
    <div className="space-y-24 pb-32">
      {/* Back Nav */}
      <Link href="/apiviz/learn" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/40 hover:text-cyan-400 transition-colors group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        BACK_TO_MAP
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-20">

        {/* Left Column: Theory & Context */}
        <div className="xl:col-span-4 space-y-16">

          {/* Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3 text-cyan-400/40">
              <Layers className="w-4 h-4 text-cyan-400/60" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                DOMAIN::{domain.id}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/25">
                {domain.name}
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-[#d6f5f5]">{topic.name}</h1>
            <div className="p-6 border-l-4 border-cyan-400 bg-cyan-400/5">
              <p className="text-sm font-bold text-cyan-400/60 uppercase leading-relaxed italic">
                &quot;{topic.description}&quot;
              </p>
            </div>
          </div>

          {/* Analogy */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Repeat className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400/40">Real_World_Analogy</h2>
            </div>
            <p className="text-sm font-bold text-cyan-400/80 uppercase leading-relaxed border-2 border-cyan-400/10 p-8 bg-black/40">
              {topic.analogy}
            </p>
          </div>

          {/* Constraints & trade-offs — authored per topic (FS-27c: these used to be two
              hardcoded bullets identical on every page) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-xs font-black uppercase tracking-widest text-amber-500/40">Constraints_&_Tradeoffs</h2>
            </div>
            <ul className="space-y-4">
              {topic.constraints.map((constraint) => (
                <li key={constraint} className="flex items-start gap-4 text-[10px] font-bold text-cyan-400/40 uppercase leading-relaxed">
                  <div className="w-1.5 h-1.5 bg-amber-500 mt-1 flex-shrink-0" />
                  {constraint}
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Right Column: the topic's own visualization */}
        <div className="xl:col-span-8 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-cyan-400">
                <PlayCircle className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest italic">INTERACTIVE_TRACE</span>
              </div>
              <div className="text-[10px] font-black text-cyan-400/20 uppercase tracking-[0.2em]">
                TRACE::{VISUAL_LABELS[topic.visual]}
              </div>
            </div>

            <div className="flex border-2 border-cyan-400/20 bg-black/40 min-h-[600px] relative overflow-hidden">
              {isActive ? (
                <TopicVisual topic={topic} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full p-12 space-y-8 relative overflow-hidden">
                  <div className="absolute inset-0 grid-bg opacity-10" />
                  <div className="relative z-10 max-w-md text-center space-y-4 border-2 border-dashed border-cyan-400/20 p-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400/60">
                      STATUS::COMING_SOON
                    </span>
                    <p className="text-lg font-black uppercase tracking-widest text-cyan-400/80">
                      {topic.name}
                    </p>
                    <p className="text-[11px] leading-relaxed text-cyan-400/50">{topic.description}</p>
                    <p className="text-[10px] uppercase tracking-widest text-cyan-400/40">
                      PLANNED_METHOD::{VISUAL_LABELS[topic.visual]}
                    </p>
                    <p className="text-[10px] text-cyan-400/40 uppercase tracking-widest">
                      This lesson has no walkthrough yet.
                    </p>
                    <Link
                      href="/apiviz/learn"
                      className="inline-block mt-2 px-4 py-2 border border-cyan-400/40 text-cyan-400 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-cyan-400 hover:text-black transition-all"
                    >
                      ← BACK_TO_LEARNING_PATH
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Illustrative specimen — authored per topic (FS-27c: every page used to claim
              `GET /api/v1/resources/<slug>`, which was not true of most subjects) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400/40">Illustrative_Specimen</h2>
            </div>
            <div className="bg-black/60 border-2 border-cyan-400/10 p-8 rounded-sm font-mono text-[11px] text-cyan-400/40 leading-relaxed overflow-x-auto italic">
              <pre className="whitespace-pre-wrap">{topic.specimen}</pre>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400/20">
              Placeholders in &lt;angle-brackets&gt;. Illustrative message shapes, not a description of any specific API.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
