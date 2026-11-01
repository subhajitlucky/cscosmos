'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Layout,
  Palette,
  Smartphone,
  Flame,
  Code2,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import PageTransition from '../components/common/PageTransition';
import SectionHeader from '../components/common/SectionHeader';
import { cn } from '../utils/cn';

interface ConceptTrack {
  id: string;
  name: string;
  iconName: string;
  description: string;
  concepts: {
    title: string;
    difficulty: 'Foundation' | 'Intermediate' | 'Advanced';
    slug: string;
    summary: string;
    syntax: string;
    keyPoints: string[];
  }[];
}

const CONCEPT_TRACKS: ConceptTrack[] = [
  {
    id: 'foundations',
    name: '1. Syntax, Cascade & Foundations',
    iconName: 'Layers',
    description: 'The fundamental browser rendering pipeline, cascading rules, specificity math, and box geometry.',
    concepts: [
      {
        title: 'Selectors & Combinators',
        difficulty: 'Foundation',
        slug: '/selectors',
        summary: 'Targeting elements using type, class, ID, attribute, child (>), sibling (+, ~), and pseudo selectors.',
        syntax: 'article > h2.highlight:not(.draft) { color: #2563eb; }',
        keyPoints: [
          'Specificity hierarchy: Inline (1000) > ID (100) > Class/Attribute/Pseudo (10) > Element (1)',
          'Universal selector (*) and :where() carry exactly zero specificity',
          'Modern combinators include child (>), next-sibling (+), and subsequent-sibling (~)',
        ],
      },
      {
        title: 'The Cascade & Inheritance',
        difficulty: 'Foundation',
        slug: '/cascade',
        summary: 'How browsers resolve conflicts between author styles, user styles, user-agent defaults, and importance.',
        syntax: ':root { --main-color: inherit; }\np { all: unset; }',
        keyPoints: [
          'Cascade algorithm prioritizes Origin & Importance, Cascade Layers, Specificity, and Source Order',
          'Keywords: inherit (takes from parent), initial (resets to CSS spec default), revert (resets to browser default)',
          'Typography and color properties inherit by default; box model geometry does not inherit',
        ],
      },
      {
        title: 'The CSS Box Model',
        difficulty: 'Foundation',
        slug: '/box-model',
        summary: 'Content, padding, border, and margin dimensions governing layout footprint and hit-testing.',
        syntax: '* {\n  box-sizing: border-box;\n  margin: 0;\n}',
        keyPoints: [
          'box-sizing: border-box includes padding and borders inside width and height',
          'Vertical margin collapse occurs between adjacent block-level elements in normal flow',
          'Negative margins pull elements closer or expand container footprints',
        ],
      },
      {
        title: 'Values, Units & Math Functions',
        difficulty: 'Foundation',
        slug: '/functions',
        summary: 'Absolute units (px) vs relative units (rem, em, ch, vw, vh, cqw) and dynamic math formulas.',
        syntax: 'h1 {\n  font-size: clamp(1.5rem, 4vw, 3rem);\n  width: min(100%, 72ch);\n}',
        keyPoints: [
          'rem scales relative to html root font size; em scales relative to current element font size',
          'Modern viewport units include dvh, lvh, svh to handle mobile browser navigation bars accurately',
          'Math functions: calc() for mixed arithmetic, min() and max() for boundaries, clamp(min, val, max)',
        ],
      },
      {
        title: 'Display Modes & Formatting Contexts',
        difficulty: 'Foundation',
        slug: '/display',
        summary: 'Normal flow geometry: inline, block, inline-block, and Block Formatting Context (BFC) containment.',
        syntax: '.container {\n  display: flow-root; /* Creates clean BFC */\n}',
        keyPoints: [
          'Inline elements ignore width and height and vertical margins; block elements claim 100% width',
          'Inline-block flows inline with text while honoring explicit width, height, and box padding',
          'display: flow-root creates a new Block Formatting Context, cleanly containing internal floats',
        ],
      },
    ],
  },
  {
    id: 'layout',
    name: '2. Modern Layout Systems',
    iconName: 'Layout',
    description: 'One-dimensional Flexbox, two-dimensional CSS Grid, nested subgrids, and coordinate positioning.',
    concepts: [
      {
        title: 'Flexbox 1D Architecture',
        difficulty: 'Foundation',
        slug: '/flexbox',
        summary: 'Linear distribution of items along a main axis with cross-axis alignment, wrapping, and proportional expansion.',
        syntax: '.row {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 1rem;\n}',
        keyPoints: [
          'Main axis is determined by flex-direction (row vs column); cross axis runs perpendicular',
          'justify-content aligns along main axis; align-items and align-content align cross axis',
          'flex: 1 1 auto shorthand controls flex-grow (expand), flex-shrink (compress), and flex-basis (base size)',
        ],
      },
      {
        title: 'CSS Grid 2D Architecture',
        difficulty: 'Intermediate',
        slug: '/grid',
        summary: 'Two-dimensional grid tracks, lines, cells, areas, and auto-fitting responsive track sizing.',
        syntax: '.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n}',
        keyPoints: [
          'Fraction unit (fr) divides free leftover space proportionally between tracks',
          'auto-fit wraps tracks and expands them to fill space; auto-fill maintains empty phantom columns',
          'grid-template-areas allows authoring human-readable ASCII layout maps',
        ],
      },
      {
        title: 'CSS Subgrid',
        difficulty: 'Advanced',
        slug: '/grid',
        summary: 'Allow nested grid children to participate directly in and align to the parent grid track lines.',
        syntax: '.parent { display: grid; grid-template-columns: 200px 1fr; }\n.child { display: grid; grid-column: span 2; grid-template-columns: subgrid; }',
        keyPoints: [
          'Eliminates mismatched card headers, footers, or labels across multi-column card layouts',
          'Inherits track sizes, gaps, and line names directly from ancestor grid',
          'Full native browser support across all modern evergreen rendering engines',
        ],
      },
      {
        title: 'Positioning & Stacking Contexts',
        difficulty: 'Foundation',
        slug: '/positioning',
        summary: 'Static, relative, absolute, fixed, and sticky coordinate placement and 3D z-axis stacking rules.',
        syntax: '.header {\n  position: sticky;\n  top: 0;\n  z-index: 50;\n}',
        keyPoints: [
          'relative establishes a containing block for descendants without removing element from normal flow',
          'sticky switches between relative and fixed based on viewport scroll threshold',
          'Stacking contexts are formed by opacity < 1, transform != none, z-index on positioned elements, or isolation: isolate',
        ],
      },
      {
        title: 'Multi-Column Layout',
        difficulty: 'Intermediate',
        slug: '/multicolumn',
        summary: 'Newspaper-style continuous text columns with balanced heights and spanning headers.',
        syntax: '.article {\n  column-count: 3;\n  column-gap: 2rem;\n  column-rule: 1px solid #e2e8f0;\n}',
        keyPoints: [
          'column-width and column-count enable responsive auto-balancing text flows',
          'column-span: all allows hero headers or pull quotes to break across column boundaries',
          'break-inside: avoid prevents awkward pagination splits across images and figures',
        ],
      },
    ],
  },
  {
    id: 'visuals',
    name: '3. Visual Styling, Color & Typography',
    iconName: 'Palette',
    description: 'Next-generation wide-gamut color spaces, fluid typography, elevations, and frosted glass aesthetics.',
    concepts: [
      {
        title: 'Modern Color Spaces & OKLCH',
        difficulty: 'Intermediate',
        slug: '/colors',
        summary: 'Perceptually uniform color models: OKLCH, LCH, Display P3 wide gamut, and native color-mix().',
        syntax: ':root {\n  --brand: oklch(0.65 0.24 150);\n  --tint: color-mix(in oklch, var(--brand) 80%, white);\n}',
        keyPoints: [
          'OKLCH provides consistent perceived brightness across hues, eliminating muddy transitions',
          'color-mix() allows dynamic theme blending directly in CSS without Sass preprocessors',
          'Display P3 supports ~25% more vibrant greens, oranges, and reds than legacy sRGB',
        ],
      },
      {
        title: 'Typography & Variable Fonts',
        difficulty: 'Foundation',
        slug: '/typography',
        summary: 'Readability ratios, line-height geometry, font-display optimization, and variable font axes.',
        syntax: 'body {\n  font-family: Inter, system-ui, sans-serif;\n  line-height: 1.6;\n  font-optical-sizing: auto;\n}',
        keyPoints: [
          'Measure rule: optimal line length is 45 to 75 characters per line (max-width: 65ch)',
          'Variable fonts combine weights (100–900), optical size (opsz), and slant into a single file download',
          'font-display: swap prevents FOIT (Flash of Invisible Text) on slower network connections',
        ],
      },
      {
        title: 'Borders, Outlines & Shapes',
        difficulty: 'Foundation',
        slug: '/borders',
        summary: 'Geometry styling: border-radius, accessible focus outlines, aspect-ratio, and box-sizing.',
        syntax: '.button:focus-visible {\n  outline: 2px solid #2563eb;\n  outline-offset: 2px;\n}',
        keyPoints: [
          'outline does not consume layout space or cause reflow; borders add to box dimensions in content-box',
          'outline-offset creates a crisp, accessible visual separation between element and focus ring',
          'aspect-ratio (e.g. 16/9, 1/1) locks proportions without padding-top percentage hacks',
        ],
      },
      {
        title: 'Layered Shadows & Elevation',
        difficulty: 'Foundation',
        slug: '/shadows',
        summary: 'Simulating physical depth, elevation scales, and ambient light with multi-stop box shadows.',
        syntax: '.card {\n  box-shadow:\n    0 1px 3px rgba(0,0,0,0.05),\n    0 10px 15px -3px rgba(0,0,0,0.1);\n}',
        keyPoints: [
          'Natural shadows combine a tight, sharp contact shadow with a soft, diffused ambient glow',
          'drop-shadow() filter conforms to PNG/SVG transparency; box-shadow conforms to rectangle boundary',
          'Inset shadows create recessed wells, text inputs, and pressed state aesthetics',
        ],
      },
      {
        title: 'Glassmorphism & Backdrop Filters',
        difficulty: 'Intermediate',
        slug: '/filters',
        summary: 'Frosted glass effects using backdrop-filter blur, translucent alpha channels, and border highlights.',
        syntax: '.glass {\n  background: rgba(255, 255, 255, 0.15);\n  backdrop-filter: blur(16px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n}',
        keyPoints: [
          'backdrop-filter filters elements behind the background, not inside the target element',
          'Requires fallback background color for older browsers without backdrop-filter support',
          'Pair with subtle high-contrast border to ensure content accessibility in light and dark modes',
        ],
      },
    ],
  },
  {
    id: 'responsive',
    name: '4. Responsive & Component Architecture',
    iconName: 'Smartphone',
    description: 'Component-first container queries, media query breakpoints, fluid math, and internationalization.',
    concepts: [
      {
        title: 'Container Queries (@container)',
        difficulty: 'Advanced',
        slug: '/container-queries',
        summary: 'The biggest breakthrough in responsive web design: styling elements based on parent container width.',
        syntax: '.parent { container-type: inline-size; }\n@container (min-width: 420px) {\n  .card { display: flex; }\n}',
        keyPoints: [
          'Components become completely portable: place in sidebar or main feed, and it self-adapts',
          'Container query units (cqw, cqh, cqi) provide proportional sizing relative to container boundary',
          'Container style queries enable reacting to custom property state values in ancestor containers',
        ],
      },
      {
        title: 'Mobile-First Media Queries',
        difficulty: 'Foundation',
        slug: '/media-queries',
        summary: 'Progressive enhancement using min-width breakpoints and device capability detection.',
        syntax: '/* Mobile default */\n.grid { grid-template-columns: 1fr; }\n@media (min-width: 768px) {\n  .grid { grid-template-columns: 1fr 1fr; }\n}',
        keyPoints: [
          'Mobile-first architecture writes simplest base styles first and layers complexity with min-width',
          'Hover queries (@media (hover: hover)) prevent sticky mobile hover states on touchscreens',
          'Prefers queries adapt to OS settings: prefers-color-scheme, prefers-reduced-motion, prefers-contrast',
        ],
      },
      {
        title: 'Logical Properties for Global i18n',
        difficulty: 'Intermediate',
        slug: '/borders',
        summary: 'Direction-agnostic layout using block/inline terminology instead of left/right/top/bottom.',
        syntax: '.element {\n  margin-inline: auto;\n  padding-block: 1rem;\n  border-inline-start: 4px solid blue;\n}',
        keyPoints: [
          'inline-size maps to width in horizontal-tb text; block-size maps to height',
          'margin-inline-start automatically switches from left to right when language is RTL (Arabic/Hebrew)',
          'Eliminates hundreds of lines of duplicate overrides for internationalized multi-language apps',
        ],
      },
    ],
  },
  {
    id: 'motion',
    name: '5. Transitions, Transforms & Motion',
    iconName: 'Flame',
    description: 'Hardware-accelerated 2D and 3D transforms, cubic bezier timing curves, and keyframe choreography.',
    concepts: [
      {
        title: 'CSS Transitions & Easing Curves',
        difficulty: 'Foundation',
        slug: '/transitions',
        summary: 'Smooth state interpolation with custom cubic-bezier timing functions, durations, and property whitelists.',
        syntax: '.btn {\n  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n.btn:hover { transform: scale(1.05); }',
        keyPoints: [
          'Always specify transition-property explicitly (e.g. transform, opacity) instead of all for performance',
          'cubic-bezier curves allow creating elastic, bouncy, and physics-based interactions',
          'Respect accessibility: always disable or tone down transitions under prefers-reduced-motion: reduce',
        ],
      },
      {
        title: 'Hardware 2D & 3D Transforms',
        difficulty: 'Intermediate',
        slug: '/3d',
        summary: 'Translate, scale, rotate, skew, and 3D perspective manipulation rendered on GPU compositor layers.',
        syntax: '.card-scene {\n  perspective: 1000px;\n}\n.card-3d {\n  transform-style: preserve-3d;\n  transform: rotateY(180deg);\n}',
        keyPoints: [
          'Transforms do not trigger browser layout reflow or repaint; they execute directly on GPU compositor',
          'perspective defines the virtual distance between the viewer and the z=0 plane',
          'transform-style: preserve-3d ensures nested children maintain distinct 3D depth positions',
        ],
      },
      {
        title: 'Keyframe Animations (@keyframes)',
        difficulty: 'Intermediate',
        slug: '/animations',
        summary: 'Multi-step timeline choreography with percentage steps, iteration controls, and fill modes.',
        syntax: '@keyframes float {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-8px); }\n}\n.badge { animation: float 3s ease-in-out infinite; }',
        keyPoints: [
          'animation-fill-mode: forwards preserves the final frame state after animation completes',
          'animation-play-state: paused allows toggling CSS animations directly from JavaScript or hover',
          'Scroll-driven animations (animation-timeline: scroll()) synchronize animation frames with scroll position',
        ],
      },
    ],
  },
  {
    id: 'modern',
    name: '6. Modern CSS Architecture (2026)',
    iconName: 'Code2',
    description: 'The latest W3C CSS standards: Cascade Layers, Native Nesting, :has() relational selector, and Tokens.',
    concepts: [
      {
        title: 'CSS Custom Properties (Variables)',
        difficulty: 'Foundation',
        slug: '/variables',
        summary: 'Cascading design tokens enabling real-time runtime theming, dynamic calculations, and component props.',
        syntax: ':root { --color-bg: #fff; }\n[data-theme="dark"] { --color-bg: #09090b; }\nbody { background-color: var(--color-bg); }',
        keyPoints: [
          'Variables inherit down the DOM tree; changing a token on a component cascades to all its children',
          'Accepts fallback value: var(--color, #000) handles missing or undefined tokens safely',
          'Can be modified dynamically from JavaScript using element.style.setProperty("--progress", val)',
        ],
      },
      {
        title: 'The Relational Selector: :has()',
        difficulty: 'Advanced',
        slug: '/selectors',
        summary: 'The long-awaited parent selector: style ancestors and previous siblings based on what they contain.',
        syntax: '/* Style card when checkbox inside is checked */\n.card:has(input[type="checkbox"]:checked) {\n  border-color: #10b981;\n}',
        keyPoints: [
          'Solves decades of CSS limitations: style forms based on validity, cards based on media presence',
          'Can target preceding siblings: a:has(+ .dropdown:hover) for bidirectional hover menus',
          'Evaluated performantly by browser engines without expensive JavaScript DOM mutation listeners',
        ],
      },
      {
        title: 'Cascade Layers (@layer)',
        difficulty: 'Advanced',
        slug: '/cascade',
        summary: 'Manage specificity conflicts definitively by grouping styles into explicit priority tiers.',
        syntax: '@layer reset, base, components, utilities;\n\n@layer components {\n  .btn { padding: 12px; }\n}',
        keyPoints: [
          'Layer order declared at top overrides internal selector specificity (later layers always beat earlier layers)',
          'Allows utility classes in @layer utilities to override component styles with zero specificity wars',
          'Unlayered styles always take highest precedence over any layered author styles',
        ],
      },
      {
        title: 'Native CSS Nesting',
        difficulty: 'Intermediate',
        slug: '/selectors',
        summary: 'Nest selectors directly inside rules without Sass preprocessors using native & nesting syntax.',
        syntax: '.nav {\n  display: flex;\n  & > .item {\n    color: #475569;\n    &:hover { color: #000; }\n  }\n}',
        keyPoints: [
          '& represents the parent selector exactly like Sass, natively parsed by the browser',
          'Reduces duplicate selector text and organizes styles cleanly alongside their parent component',
          'Supported natively across Chrome, Firefox, Safari, and Edge without any build tooling',
        ],
      },
    ],
  },
];

export default function Concepts() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTrack, setSelectedTrack] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTracks = useMemo(() => {
    return CONCEPT_TRACKS.map((track) => {
      if (selectedTrack !== 'All' && track.id !== selectedTrack) {
        return null;
      }

      const matchingConcepts = track.concepts.filter((concept) => {
        const matchesDiff =
          selectedDifficulty === 'All' || concept.difficulty === selectedDifficulty;
        const matchesQuery =
          !searchQuery ||
          concept.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          concept.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          concept.syntax.toLowerCase().includes(searchQuery.toLowerCase()) ||
          concept.keyPoints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesDiff && matchesQuery;
      });

      if (matchingConcepts.length === 0) return null;

      return {
        ...track,
        concepts: matchingConcepts,
      };
    }).filter(Boolean) as ConceptTrack[];
  }, [selectedDifficulty, selectedTrack, searchQuery]);

  const totalMatchingConcepts = useMemo(() => {
    return filteredTracks.reduce((acc, t) => acc + t.concepts.length, 0);
  }, [filteredTracks]);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-8 py-4">
        {/* Header */}
        <div className="space-y-3 border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary font-bold">
            <BookOpen className="h-4 w-4" />
            <span>Curriculum · Core Concepts</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            CSS Concepts: From Foundations to Advanced Architecture
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Follow this progressive mental model curriculum covering selectors, cascade algorithms, flexbox, 2D grid, fluid typography, 3D motion, container queries, and cascade layers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/fullstack/css-cosmos/lab"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-slate-950 font-bold px-4 py-2 text-xs hover:bg-primary/90 transition-all shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5 fill-current" />
              <span>Open CSS Tinker Lab</span>
            </Link>

            <Link
              href="/fullstack/css-cosmos/problems"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface text-slate-900 dark:text-white font-bold px-4 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>Practice 100 Challenges</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-text" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts (e.g. flexbox, subgrid, oklch, :has, specificity)..."
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl border border-border self-start sm:self-auto overflow-x-auto">
              {['All', 'Foundation', 'Intermediate', 'Advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap',
                    selectedDifficulty === diff
                      ? 'bg-primary text-slate-950 font-bold shadow-xs'
                      : 'text-muted-text hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Track Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-muted-text text-[11px] font-mono uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Track:
            </span>
            <button
              onClick={() => setSelectedTrack('All')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs transition-colors shrink-0 border',
                selectedTrack === 'All'
                  ? 'border-primary bg-primary/10 text-primary font-bold'
                  : 'border-border bg-surface text-muted-text hover:text-slate-900 dark:hover:text-white'
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
                    ? 'border-primary bg-primary/10 text-primary font-bold'
                    : 'border-border bg-surface text-muted-text hover:text-slate-900 dark:hover:text-white'
                )}
              >
                {track.name.split('. ')[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks & Concepts List */}
        <div className="space-y-12">
          {filteredTracks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                No CSS concepts found matching your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedDifficulty('All');
                  setSelectedTrack('All');
                  setSearchQuery('');
                }}
                className="text-xs text-primary hover:underline font-mono"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredTracks.map((track) => (
              <section key={track.id} className="space-y-4">
                <div className="border-b border-border/80 pb-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{track.name}</span>
                  </h2>
                  <p className="text-xs text-muted-text mt-0.5">{track.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {track.concepts.map((concept) => (
                    <div
                      key={concept.title}
                      className="rounded-xl border border-border bg-surface p-5 space-y-3.5 hover:border-primary/50 transition-all flex flex-col justify-between shadow-xs"
                    >
                      <div className="space-y-2">
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {concept.title}
                          </h3>
                          <span
                            className={cn(
                              'text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0',
                              concept.difficulty === 'Foundation' &&
                                'text-emerald-600 bg-emerald-500/10 border-emerald-500/30',
                              concept.difficulty === 'Intermediate' &&
                                'text-amber-600 bg-amber-500/10 border-amber-500/30',
                              concept.difficulty === 'Advanced' &&
                                'text-rose-600 bg-rose-500/10 border-rose-500/30'
                            )}
                          >
                            {concept.difficulty}
                          </span>
                        </div>

                        {/* Summary */}
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {concept.summary}
                        </p>

                        {/* Syntax Code block */}
                        <div className="pt-1">
                          <pre className="rounded-lg bg-slate-950 p-2.5 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-zinc-800">
                            {concept.syntax}
                          </pre>
                        </div>

                        {/* Key mental model points */}
                        <div className="space-y-1 pt-1 text-xs text-muted-text font-sans">
                          {concept.keyPoints.map((pt, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold mt-0.5">·</span>
                              <span className="text-[11px] leading-snug">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                        <Link
                          href={`/fullstack/css-cosmos/topics${concept.slug}`}
                          className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                        >
                          <span>Deep Dive</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>

                        <Link
                          href="/fullstack/css-cosmos/lab"
                          className="text-muted-text hover:text-slate-900 dark:hover:text-white font-mono text-[11px]"
                        >
                          Tinker in Lab →
                        </Link>
                      </div>
                    </div>
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
