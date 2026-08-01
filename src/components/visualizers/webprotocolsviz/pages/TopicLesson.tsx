'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Info, Code, Play, RotateCcw } from 'lucide-react';
import { topics } from '../data/topics';
import type { Topic } from '../data/topics';
import FlowVisualizer from '../components/visualizations/FlowVisualizer';

export default function TopicLesson({ topicId: propTopicId }: { topicId?: string }) {
  const params = useParams();
  const router = useRouter();
  const topicId = propTopicId || (params?.topicId as string);
  const [topic, setTopic] = useState<Topic | null>(null);

  useEffect(() => {
    const foundTopic = topics.find(t => t.id === topicId);
    if (foundTopic) {
      setTopic(foundTopic);
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    } else if (topicId) {
      router.push('/webprotocols/path');
    }
  }, [topicId, router]);

  if (!topic) return null;

  const currentIndex = topics.findIndex(t => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <div className="max-w-[1700px] mx-auto w-full flex flex-col gap-8">
      {/* Lesson Navigation Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-6">
        <Link href="/webprotocols/path" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <ChevronLeft size={16} /> Back to Path
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Module {currentIndex + 1} of {topics.length}</span>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-500" 
               style={{ width: `${((currentIndex + 1) / topics.length) * 100}%` }}
             />
          </div>
        </div>
      </div>

      {/* Main Lesson Content */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{topic.name}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">{topic.content.definition}</p>
      </div>

      {/* Interactive Visualizer Canvas */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2 font-bold text-sm text-primary uppercase tracking-wider">
            <Play size={16} /> Interactive Protocol Simulation
          </div>
        </div>
        <FlowVisualizer type={topic.content.visualizationType} topicId={topic.id} />
      </div>

      {/* Lesson Details & Sections */}
      {topic.content.detailedSections && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {topic.content.detailedSections.map((sec, i) => (
            <div key={i} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-foreground">{sec.title}</h3>
              {sec.content && <p className="text-sm text-muted-foreground leading-relaxed">{sec.content}</p>}
              {sec.code && (
                <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  <code>{sec.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom Prev / Next Navigation */}
      <div className="flex items-center justify-between border-t border-border/80 pt-8 mt-8">
        {prevTopic ? (
          <Link 
            href={`/webprotocols${prevTopic.path}`}
            className="flex items-center gap-2 bg-card border border-border/80 px-5 py-3 rounded-2xl font-bold text-sm hover:border-primary transition-all text-foreground"
          >
            <ChevronLeft size={18} /> Previous: {prevTopic.name}
          </Link>
        ) : <div />}

        {nextTopic ? (
          <Link 
            href={`/webprotocols${nextTopic.path}`}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Next: {nextTopic.name} <ChevronRight size={18} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
