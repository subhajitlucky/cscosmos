'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Terminal,
  XCircle,
  Search,
  X,
  Compass,
  Layers,
  Zap,
  ChevronDown,
  BookOpen,
  Keyboard,
  Check,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { NODE_TOPICS } from '../data/topics';
import { Concept1Lesson } from '../components/Concept1Lesson';
import { Concept2Lesson } from '../components/Concept2Lesson';
import { Concept3Lesson } from '../components/Concept3Lesson';
import { Concept4Lesson } from '../components/Concept4Lesson';
import { Concept5Lesson } from '../components/Concept5Lesson';
import { Concept6Lesson } from '../components/Concept6Lesson';
import { Concept7Lesson } from '../components/Concept7Lesson';
import { Concept8Lesson } from '../components/Concept8Lesson';
import { Concept9Lesson } from '../components/Concept9Lesson';
import { Concept10Lesson } from '../components/Concept10Lesson';
import { Concept11Lesson } from '../components/Concept11Lesson';
import { Concept12Lesson } from '../components/Concept12Lesson';

export default function ConceptDetail({ topicId }: { topicId: string }) {
  const router = useRouter();
  const topic = NODE_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    notFound();
  }

  const prevTopic = topic.prevTopicId
    ? NODE_TOPICS.find((t) => t.id === topic.prevTopicId)
    : null;

  const nextTopic = topic.nextTopicId
    ? NODE_TOPICS.find((t) => t.id === topic.nextTopicId)
    : null;

  // Reading progress percentage
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModuleFilter, setActiveModuleFilter] = useState<number | 'all'>('all');

  // Track window scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation shortcuts: Left / Right arrows & Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl?.tagName === 'INPUT' ||
        activeEl?.tagName === 'TEXTAREA' ||
        activeEl?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }

      if ((e.key === 'ArrowLeft' || e.key === '[') && prevTopic) {
        e.preventDefault();
        router.push(`/nodecosmos/concepts/${prevTopic.id}`);
      } else if ((e.key === 'ArrowRight' || e.key === ']') && nextTopic) {
        e.preventDefault();
        router.push(`/nodecosmos/concepts/${nextTopic.id}`);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSwitcherOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSwitcherOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevTopic, nextTopic, router]);

  // Smooth scroll to numbered sections
  const scrollToSection = (sectionIndex: number) => {
    const sections = document.querySelectorAll('section');
    if (sections && sections[sectionIndex]) {
      const yOffset = -90; // offset for sticky navigation header
      const element = sections[sectionIndex];
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Filtered topics for the Concept Switcher Drawer
  const filteredTopics = NODE_TOPICS.filter((t) => {
    const matchesQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(t.number).includes(searchQuery);

    const matchesModule =
      activeModuleFilter === 'all' || t.moduleNumber === activeModuleFilter;

    return matchesQuery && matchesModule;
  });

  return (
    <>
      {/* Scroll Reading Progress Bar Fixed at Top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-slate-200/50 dark:bg-slate-800/50">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-75 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="space-y-8 pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Sticky Glassmorphic Header Bar */}
        <header className="sticky top-2 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-4 py-2.5 shadow-sm flex items-center justify-between gap-3 select-none">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/nodecosmos/concepts"
              className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 shrink-0"
              title="Return to Curriculum Index"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden md:inline">All Concepts</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            {/* Quick Concept Switcher Trigger */}
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-bold transition truncate cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">
                #{topic.number}: {topic.title.replace(/^\d+\.\s*/, '')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
            </button>
          </div>

          {/* Quick Pagination & Shortcut Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80">
              <Keyboard className="w-3 h-3 text-slate-400" />
              <span>← / →</span>
            </span>

            {prevTopic && (
              <Link
                href={`/nodecosmos/concepts/${prevTopic.id}`}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                title={`Previous: ${prevTopic.title}`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            )}

            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
              {topic.number}/280
            </span>

            {nextTopic && (
              <Link
                href={`/nodecosmos/concepts/${nextTopic.id}`}
                className="p-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-xs"
                title={`Next: ${nextTopic.title}`}
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </header>

        {/* Interactive Pedagogical Lesson Experiences */}
        {topic.number === 1 ? (
          <Concept1Lesson />
        ) : topic.number === 2 ? (
          <Concept2Lesson />
        ) : topic.number === 3 ? (
          <Concept3Lesson />
        ) : topic.number === 4 ? (
          <Concept4Lesson />
        ) : topic.number === 5 ? (
          <Concept5Lesson />
        ) : topic.number === 6 ? (
          <Concept6Lesson />
        ) : topic.number === 7 ? (
          <Concept7Lesson />
        ) : topic.number === 8 ? (
          <Concept8Lesson />
        ) : topic.number === 9 ? (
          <Concept9Lesson />
        ) : topic.number === 10 ? (
          <Concept10Lesson />
        ) : topic.number === 11 ? (
          <Concept11Lesson />
        ) : topic.number === 12 ? (
          <Concept12Lesson />
        ) : (
          /* Coming Soon Template for Concepts 13-280 */
          <>
            {/* Title & Metadata */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Module {topic.moduleNumber}: {topic.moduleName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-mono font-bold">
                  {topic.level} Level
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                    topic.stability === 'Experimental'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {topic.stability || 'Stable'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                {topic.title}
              </h1>

              <p className="text-base text-muted-foreground leading-relaxed">
                {topic.summary}
              </p>
            </div>

            {/* Coming Soon Notice */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Roadmap 2027 &bull; In Active Authoring
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  This lesson is concept #{topic.number} of the 280-topic Node.js learning roadmap. Full interactive simulators, execution traces, and hands-on exercises will be progressively rolled out.
                </p>
              </div>
            </div>

            {/* Mental Model Analogy Card */}
            <div className="p-6 rounded-3xl bg-muted/40 border border-border space-y-2">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Intuitive Mental Model
              </div>
              <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed">
                {topic.mentalModel}
              </p>
            </div>

            {/* Code Snippet */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground font-semibold">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-emerald-500" /> Node.js Implementation Preview
                </span>
                <span className="font-mono text-xs">Node.js v22 LTS</span>
              </div>
              <pre className="p-5 rounded-3xl bg-slate-950 text-emerald-300 font-mono text-sm overflow-x-auto border border-border shadow-inner whitespace-pre-wrap leading-relaxed">
                {topic.codeSnippet}
              </pre>
            </div>

            {/* Key Takeaways */}
            <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Architectural Takeaways
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {topic.takeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pitfall & Fix */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Common Production Mistake
                </div>
                <p className="text-sm text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                  {topic.commonPitfall.mistake}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Recommended Solution
                </div>
                <p className="text-sm text-emerald-900 dark:text-emerald-200 leading-relaxed font-medium">
                  {topic.commonPitfall.fix}
                </p>
              </div>
            </div>
          </>
        )}

        {/* Sequential Roadmap Navigation: Prev & Next */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {prevTopic ? (
            <Link
              href={`/nodecosmos/concepts/${prevTopic.id}`}
              className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-xs flex items-center gap-2.5 group"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
              <div className="text-left">
                <div className="text-[10px] text-slate-500 font-normal">Previous Concept</div>
                <span className="truncate max-w-[200px] block font-mono">
                  #{prevTopic.number}: {prevTopic.title.replace(/^\d+\.\s*/, '')}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextTopic && (
            <Link
              href={`/nodecosmos/concepts/${nextTopic.id}`}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center gap-2.5 ml-auto group"
            >
              <div className="text-right">
                <div className="text-[10px] text-emerald-100 font-normal">Next Concept</div>
                <span className="truncate max-w-[200px] block font-mono">
                  #{nextTopic.number}: {nextTopic.title.replace(/^\d+\.\s*/, '')}
                </span>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>

      {/* Floating 6-Step Section Quick-Jump Anchor Dock (Centered at Bottom) */}
      <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-800/90 shadow-2xl text-xs font-mono text-slate-300 select-none">
        <span className="px-2.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Jump:
        </span>

        {[
          { label: 'Problem', index: 0 },
          { label: 'Internals', index: 1 },
          { label: 'Architecture', index: 2 },
          { label: 'Code Lab', index: 3 },
          { label: 'Traps', index: 4 },
          { label: 'Quiz', index: 5 },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => scrollToSection(item.index)}
            className="px-2.5 py-1 rounded-full hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* Interactive Concept Switcher Modal */}
      {isSwitcherOpen && (
        <div className="fixed inset-0 z-50 p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md flex flex-col justify-center items-center animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    NodeCosmos 280 Curriculum Navigator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Jump instantly to any concept across Modules 1&ndash;15
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSwitcherOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Bar & Module Tabs */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by topic title, number, or keyword..."
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-emerald-500 dark:focus:border-emerald-500 font-mono transition"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono select-none">
                <button
                  onClick={() => setActiveModuleFilter('all')}
                  className={`px-3 py-1 rounded-xl transition ${
                    activeModuleFilter === 'all'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All (280)
                </button>
                <button
                  onClick={() => setActiveModuleFilter(1)}
                  className={`px-3 py-1 rounded-xl transition ${
                    activeModuleFilter === 1
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Module 1: Fundamentals (10/10 Ready)
                </button>
                <button
                  onClick={() => setActiveModuleFilter(2)}
                  className={`px-3 py-1 rounded-xl transition ${
                    activeModuleFilter === 2
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Module 2: Installation &amp; CLI (2 Ready)
                </button>
              </div>
            </div>

            {/* Topics List */}
            <div className="p-3 overflow-y-auto space-y-1 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs sm:text-sm">
              {filteredTopics.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400 italic">
                  No concepts matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                filteredTopics.map((item) => {
                  const isCurrent = item.id === topic.id;
                  const isReady = item.status === 'ready';

                  return (
                    <Link
                      key={item.id}
                      href={`/nodecosmos/concepts/${item.id}`}
                      onClick={() => setIsSwitcherOpen(false)}
                      className={`p-3 rounded-2xl flex items-center justify-between gap-3 transition ${
                        isCurrent
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {item.number}
                        </span>
                        <span className="truncate">{item.title.replace(/^\d+\.\s*/, '')}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isReady ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Check className="w-3 h-3" /> Ready
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-[10px] font-medium">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}