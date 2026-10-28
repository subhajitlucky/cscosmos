'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ChevronLeft, ChevronRight, Circle, Lightbulb, Play, Terminal } from 'lucide-react';
import { topics } from '../data/topics';
import FlowVisualizer from '../components/visualizations/FlowVisualizer';
import { TOPIC_BASE_PATH, TOPIC_DOMAIN, TOPIC_NAME, TOPIC_SLUG } from '../data/topic';
import { TopicActionBar } from '@/components/learning/TopicActionBar';
import { TopicNotes } from '@/components/learning/TopicNotes';
import { RelatedTopics } from '@/components/learning/RelatedTopics';
import { TopicComments } from '@/components/learning/TopicComments';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { MODULE_META } from '../data/moduleMeta';
import { setTopicCompleted } from '@/lib/local-learning';

export default function TopicLesson({ topicId }: { topicId: string }) {
  // Resolve during render, NOT in an effect. `topics` is a static import, so this
  // is safe on the server — and it is what puts the lesson into the pre-rendered
  // HTML. The previous useState+useEffect lookup meant every /webprotocols/topics/*
  // page shipped with an empty body and was filled in only after hydration
  // (AGENTS.md §1/§3). The route validates the id and 404s for unknown topics.
  const topic = topics.find((t) => t.id === topicId);
  const { isComplete, toggle, completedCount } = useModuleProgress();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [topicId]);

  if (!topic) return null;

  const currentIndex = topics.findIndex((t) => t.id === topic.id);
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;
  const { analogy, syntax, example, detailedSections } = topic.content;
  const isDone = isComplete(topic.id);
  const moduleMeta = MODULE_META[topic.id];

  return (
    <div className="max-w-[1700px] mx-auto w-full flex flex-col gap-8">
      {/* Lesson Navigation Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-6">
        <Link href={`${TOPIC_BASE_PATH}/path`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
          <ChevronLeft size={16} /> Back to Path
        </Link>
        <div className="flex items-center gap-3">
          {moduleMeta && (
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:inline">
              {moduleMeta.difficulty} · {moduleMeta.minutes} min
            </span>
          )}
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Module {currentIndex + 1} of {topics.length}</span>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-500" 
               style={{ width: `${((currentIndex + 1) / topics.length) * 100}%` }}
             />
          </div>
        </div>
      </div>

      <TopicActionBar
        slug={TOPIC_SLUG}
        name={TOPIC_NAME}
        domain={TOPIC_DOMAIN}
        showBreadcrumb={false}
        className="mb-0 border-b-0 pb-0"
      />

      {/* Main Lesson Content */}
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{topic.name}</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">{topic.content.definition}</p>
      </div>

      {/* Analogy */}
      {analogy && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex gap-3">
          <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            <span className="font-bold text-primary">Think of it like this: </span>
            {analogy}
          </p>
        </div>
      )}

      {/* Interactive Visualizer Canvas */}
      <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2 font-bold text-sm text-primary uppercase tracking-wider">
            <Play size={16} /> Interactive Protocol Simulation
          </div>
        </div>
        <FlowVisualizer type={topic.content.visualizationType} topicId={topic.id} />
      </div>

      {/* Syntax */}
      {syntax && (
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-3">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Terminal size={16} className="text-primary" /> Syntax
          </h3>
          <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
            <code>{syntax}</code>
          </pre>
        </div>
      )}

      {/* Worked request / response example */}
      {example && (
        <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Worked example</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {example.request && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Request</p>
                <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  <code>{example.request}</code>
                </pre>
              </div>
            )}
            {example.response && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Response</p>
                <pre className="bg-slate-900 text-sky-300 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  <code>{example.response}</code>
                </pre>
              </div>
            )}
          </div>
          {example.explanation && (
            <p className="text-sm text-muted-foreground leading-relaxed">{example.explanation}</p>
          )}
          {example.highlights && example.highlights.length > 0 && (
            <ul className="space-y-1.5">
              {example.highlights.map((highlight, i) => (
                <li key={i} className="text-sm text-foreground/90 flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Lesson Details & Sections */}
      {detailedSections && detailedSections.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {detailedSections.map((sec, i) => (
            <div key={i} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-foreground">{sec.title}</h3>
              {sec.content && <p className="text-sm text-muted-foreground leading-relaxed">{sec.content}</p>}
              {sec.subItems && sec.subItems.length > 0 && (
                <ul className="space-y-2">
                  {sec.subItems.map((item, j) => (
                    <li key={j} className="text-sm leading-relaxed">
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="text-muted-foreground"> — {item.description}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sec.code && (
                <pre className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                  <code>{sec.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Module status</p>
          <p className="text-sm text-foreground">
            {isDone ? 'Completed' : `Not completed · ${completedCount} of ${topics.length} modules done`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            const nextDone = toggle(topic.id);
            if (nextDone && completedCount + 1 === topics.length) {
              setTopicCompleted(TOPIC_SLUG, true);
            } else if (!nextDone) {
              setTopicCompleted(TOPIC_SLUG, false);
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isDone ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground" />
          )}
          {isDone ? 'Completed' : 'Mark module complete'}
        </button>
      </div>

      <div className="space-y-3">
        <TopicNotes slug={TOPIC_SLUG} name={TOPIC_NAME} domain={TOPIC_DOMAIN} />
        <RelatedTopics slug={TOPIC_SLUG} domain={TOPIC_DOMAIN} />
        <TopicComments slug={TOPIC_SLUG} />
      </div>

      {/* Bottom Prev / Next Navigation */}
      <div className="flex items-center justify-between border-t border-border/80 pt-8 mt-8">
        {prevTopic ? (
          <Link 
            href={`${TOPIC_BASE_PATH}${prevTopic.path}`}
            className="flex items-center gap-2 bg-card border border-border/80 px-5 py-3 rounded-2xl font-bold text-sm hover:border-primary transition-all text-foreground"
          >
            <ChevronLeft size={18} /> Previous: {prevTopic.name}
          </Link>
        ) : <div />}

        {nextTopic ? (
          <Link 
            href={`${TOPIC_BASE_PATH}${nextTopic.path}`}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Next: {nextTopic.name} <ChevronRight size={18} />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
