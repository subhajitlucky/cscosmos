'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  ArrowRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import { cn } from '../utils/cn';

const BASE = '/fullstack/css-cosmos';

interface ConceptTopic {
  name: string;
  difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
  path: string;
}

interface ConceptTrack {
  id: string;
  name: string;
  topics: ConceptTopic[];
}

const CONCEPT_TRACKS: ConceptTrack[] = [
  {
    id: 'selectors-cascade',
    name: '1. Selectors & Cascade',
    topics: [
      { name: 'Selectors & Specificity', difficulty: 'Foundation', path: '/selectors' },
      { name: 'Cascade & Inheritance', difficulty: 'Foundation', path: '/cascade' },
      { name: 'Pseudo-Classes & Elements', difficulty: 'Foundation', path: '/selectors' },
      { name: ':is(), :where(), and :has()', difficulty: 'Intermediate', path: '/selectors' },
      { name: 'Cascade Layers (@layer)', difficulty: 'Intermediate', path: '/cascade' },
    ],
  },
  {
    id: 'box-model',
    name: '2. Box Model & Geometry',
    topics: [
      { name: 'Box Model', difficulty: 'Foundation', path: '/box-model' },
      { name: 'Display Modes', difficulty: 'Foundation', path: '/display' },
      { name: 'Positioning (Relative, Absolute, Sticky)', difficulty: 'Foundation', path: '/positioning' },
      { name: 'Floats & Clearfix', difficulty: 'Intermediate', path: '/floats' },
    ],
  },
  {
    id: 'flexbox-grid',
    name: '3. Flexbox & Grid Systems',
    topics: [
      { name: 'Flexbox Layout', difficulty: 'Foundation', path: '/flexbox' },
      { name: 'CSS Grid', difficulty: 'Intermediate', path: '/grid' },
      { name: 'CSS Subgrid', difficulty: 'Advanced', path: '/grid' },
      { name: 'Multi-Column Layout', difficulty: 'Intermediate', path: '/multicolumn' },
    ],
  },
  {
    id: 'units-math',
    name: '4. Units, Math & Custom Properties',
    topics: [
      { name: 'CSS Units (px, rem, vh, ch)', difficulty: 'Foundation', path: '/units' },
      { name: 'Math Functions (calc, min, max, clamp)', difficulty: 'Foundation', path: '/functions' },
      { name: 'CSS Variables (Custom Properties)', difficulty: 'Foundation', path: '/variables' },
    ],
  },
  {
    id: 'visual-styling',
    name: '5. Visual Styling & Color',
    topics: [
      { name: 'Colors & Modern OKLCH', difficulty: 'Foundation', path: '/colors' },
      { name: 'Backgrounds & Gradients', difficulty: 'Intermediate', path: '/backgrounds' },
      { name: 'Borders & Shapes', difficulty: 'Foundation', path: '/borders' },
      { name: 'Box Shadows & Glows', difficulty: 'Foundation', path: '/shadows' },
      { name: 'Filters & Blend Modes', difficulty: 'Intermediate', path: '/filters' },
      { name: 'Clip-Path & Masking', difficulty: 'Advanced', path: '/clipping' },
    ],
  },
  {
    id: 'typography',
    name: '6. Typography & Text',
    topics: [
      { name: 'Typography & Line Flow', difficulty: 'Foundation', path: '/typography' },
      { name: 'Fonts & Variable Fonts', difficulty: 'Intermediate', path: '/fonts' },
    ],
  },
  {
    id: 'responsive',
    name: '7. Responsive & Component Architecture',
    topics: [
      { name: 'Responsive Design Principles', difficulty: 'Foundation', path: '/responsive' },
      { name: 'Media Queries (@media)', difficulty: 'Foundation', path: '/media-queries' },
      { name: 'Container Queries (@container)', difficulty: 'Intermediate', path: '/container-queries' },
      { name: 'CSS Accessibility', difficulty: 'Foundation', path: '/css-a11y' },
      { name: 'Print Styling', difficulty: 'Intermediate', path: '/print' },
    ],
  },
  {
    id: 'transitions-motion',
    name: '8. Transitions & Animation',
    topics: [
      { name: 'Transitions & Easing', difficulty: 'Foundation', path: '/transitions' },
      { name: 'CSS Animations + Keyframes', difficulty: 'Foundation', path: '/animations' },
      { name: '3D Transforms & Perspective', difficulty: 'Advanced', path: '/3d' },
      { name: 'Motion Path (offset-path)', difficulty: 'Advanced', path: '/motion-path' },
    ],
  },
  {
    id: 'internals-architecture',
    name: '9. Engine Internals & Performance',
    topics: [
      { name: 'Browser Rendering Pipeline', difficulty: 'Advanced', path: '/rendering' },
      { name: 'Reflow, Repaint & Compositing', difficulty: 'Advanced', path: '/reflow' },
      { name: 'GPU Acceleration', difficulty: 'Advanced', path: '/gpu' },
      { name: 'CSS Architecture (BEM, SMACSS)', difficulty: 'Advanced', path: '/architecture' },
      { name: 'CSS Debugging Tools', difficulty: 'Foundation', path: '/debugging' },
      { name: 'Houdini API — Paint Worklet', difficulty: 'Advanced', path: '/houdini-paint' },
      { name: 'Houdini API — Typed OM', difficulty: 'Advanced', path: '/houdini-typedom' },
      { name: 'Houdini API — Layout API', difficulty: 'Advanced', path: '/houdini-layout' },
    ],
  },
];

export default function Concepts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');

  const filteredTracks = useMemo(() => {
    return CONCEPT_TRACKS.map((track) => {
      if (selectedTrack !== 'All' && track.id !== selectedTrack) {
        return { ...track, topics: [] };
      }

      const matchingTopics = track.topics.filter((topic) => {
        const matchesDiff = selectedDifficulty === 'All' || topic.difficulty === selectedDifficulty;
        const matchesQuery =
          !searchQuery ||
          topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          track.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDiff && matchesQuery;
      });

      return {
        ...track,
        topics: matchingTopics,
      };
    }).filter((track) => track.topics.length > 0);
  }, [selectedDifficulty, selectedTrack, searchQuery]);

  const totalTopicsCount = useMemo(() => {
    return filteredTracks.reduce((acc, t) => acc + t.topics.length, 0);
  }, [filteredTracks]);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6 py-4">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">
            <BookOpen className="h-4 w-4" />
            <span>Curriculum · Core Concepts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            CSS Concepts
          </h1>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={`${BASE}/lab`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold px-4 py-2 text-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>CSS Tinker Lab</span>
            </Link>

            <Link
              href={`${BASE}/problems`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>100 CSS Challenges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts (e.g. flexbox, subgrid, oklch, :has, specificity)..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto overflow-x-auto shadow-xs">
              {['All', 'Foundation', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                    selectedDifficulty === diff
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Track Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Track:
            </span>
            <button
              onClick={() => setSelectedTrack('All')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs transition-colors shrink-0 border',
                selectedTrack === 'All'
                  ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
              )}
            >
              All Tracks
            </button>
            {CONCEPT_TRACKS.map((track) => (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs transition-colors shrink-0 border',
                  selectedTrack === track.id
                    ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-950 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                )}
              >
                {track.name}
              </button>
            ))}
          </div>
        </div>

        {/* Result Counter when filtered */}
        {(searchQuery || selectedDifficulty !== 'All' || selectedTrack !== 'All') && (
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Showing {totalTopicsCount} matching {totalTopicsCount === 1 ? 'topic' : 'topics'}
          </div>
        )}

        {/* Tracks and Topics Grid */}
        <div className="space-y-7">
          {filteredTracks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No CSS concepts found matching your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedDifficulty('All');
                  setSelectedTrack('All');
                  setSearchQuery('');
                }}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-mono font-bold"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredTracks.map((track) => (
              <section key={track.id} className="space-y-3">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {track.name}
                  </h2>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {track.topics.length} {track.topics.length === 1 ? 'topic' : 'topics'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
                  {track.topics.map((topic) => (
                    <Link
                      key={topic.name}
                      href={`${BASE}/topics${topic.path}`}
                      className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 hover:shadow-xs transition-all group"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate block">
                          {topic.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            'text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase',
                            topic.difficulty === 'Foundation' &&
                              'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/50 dark:border-emerald-800/50',
                            topic.difficulty === 'Intermediate' &&
                              'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/50 dark:border-amber-800/50',
                            topic.difficulty === 'Advanced' &&
                              'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-950/50 dark:border-rose-800/50'
                          )}
                        >
                          {topic.difficulty}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </PageTransition>
  );
}
