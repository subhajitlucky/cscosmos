export interface TailwindTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Utility-First Philosophy' | 'Flexbox & CSS Grid' | 'Box Model & Spacing' | 'Variants & State Inheritance' | 'Tailwind 4 & Engine Internals';
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  optimization: string;
  tailwindSnippet: string;
  cssOutput: string;
  related: string[];
}

export interface TailwindTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: TailwindTopic[];
}

export const tailwindTopics: TailwindTopic[] = [
  // 1. Philosophy
  {
    id: 'utility-first-vs-semantic',
    title: 'Utility-First vs Semantic CSS',
    kicker: 'Philosophy / 01',
    group: 'Utility-First Philosophy',
    difficulty: 'starter',
    summary: 'Why composing low-level utility classes scales while custom semantic class names accumulate technical debt.',
    definition: 'In traditional Semantic CSS (BEM), every new component requires a new unique class name and CSS rule, leading to unbounded CSS bundle growth (O(N)). Utility-First CSS provides atomic single-purpose classes that compose directly in markup, causing total CSS size to plateau at O(1) regardless of application size.',
    analogy: 'Semantic CSS is like ordering a custom bespoke screw manufactured for every individual piece of furniture. Utility CSS is a standard toolbox containing standardized LEGO blocks that can build any skyscraper.',
    steps: [
      'Developer composes single-purpose classes directly inside JSX/HTML',
      'No context switching between HTML template and CSS stylesheet files',
      'Reusing utility classes adds 0 bytes to the compiled CSS bundle',
      'Refactoring UI requires modifying local markup without fear of breaking distant views',
      'CSS bundle size flattens at ~10-15kB compressed for multi-thousand page apps'
    ],
    mistakes: [
      'Creating premature component abstractions with @apply in CSS files instead of React/Vue components',
      'Inventing semantic wrapper classes like .card-body-text-highlight that duplicate standard utilities',
      'Over-relying on arbitrary values like w-[317px] instead of adhering to the design token scale'
    ],
    optimization: 'Utility composition allows browser caching to cache the single global CSS stylesheet once, achieving 100% cache hit rates on all subsequent route navigations.',
    tailwindSnippet: `<!-- Reusable Utility Composition -->
<div class="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all">
  <div class="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
    01
  </div>
  <div>
    <h3 class="font-bold text-slate-900 dark:text-white">Zero CSS Debt</h3>
    <p class="text-sm text-slate-500">Atomic composition that scales linearly.</p>
  </div>
</div>`,
    cssOutput: `/* Compiled CSS Output */
.flex { display: flex; }
.items-center { align-items: center; }
.gap-4 { gap: 1rem; }
.p-6 { padding: 1.5rem; }
.rounded-2xl { border-radius: 1rem; }
.transition-all { transition-property: all; }`,
    related: ['jit-compiler-oxide', 'box-model-padding', 'flexbox-alignment']
  },
  {
    id: 'jit-compiler-oxide',
    title: 'Just-In-Time (JIT) & Oxide Engine',
    kicker: 'Philosophy / 02',
    group: 'Utility-First Philosophy',
    difficulty: 'advanced',
    summary: 'How Tailwind scans templates in Rust and generates exact on-demand CSS in under 10 milliseconds.',
    definition: 'Tailwind CSS v3/v4 uses an on-demand JIT scanning engine (rewritten in Rust as Tailwind Oxide). Rather than generating a massive 50MB stylesheet of every potential utility up front, the compiler scans template tokens regex-free and produces only the exact CSS rules actually used in your codebase.',
    analogy: 'A 3D printer that manufactures only the exact bolt you request on demand, rather than warehousing 5 million unused spare parts in a warehouse.',
    steps: [
      'Oxide engine monitors file change events in source directories',
      'Fast Rust parser extracts class string candidates from template files',
      'Compiler resolves candidate tokens against theme scales and variant modifiers',
      'Generates micro-CSS AST and writes optimized stylesheet to memory/disk',
      'Completes full compilation cycle in sub-15ms incremental build times'
    ],
    mistakes: [
      'Constructing dynamic class strings at runtime like bg-${color}-500 (the static scanner cannot guess all dynamic permutations)',
      'Forgetting to configure source content paths in older Tailwind v3 configs'
    ],
    optimization: 'Always write full unbroken class names (e.g. isActive ? "bg-cyan-500" : "bg-slate-500") so the static compiler can detect every candidate token.',
    tailwindSnippet: `// Safelist / Full Class Expression Pattern
const variantStyles = {
  primary: 'bg-cyan-500 text-black hover:bg-cyan-400',
  secondary: 'bg-slate-800 text-white hover:bg-slate-700',
  danger: 'bg-rose-500 text-white hover:bg-rose-600'
};

export function Button({ variant = 'primary', children }) {
  return (
    <button className={\`px-4 py-2 rounded-lg font-semibold transition-colors \${variantStyles[variant]}\`}>
      {children}
    </button>
  );
}`,
    cssOutput: `/* Compiled on-demand CSS */
.bg-cyan-500 { background-color: #06b6d4; }
.hover\\:bg-cyan-400:hover { background-color: #22d3ee; }
.bg-rose-500 { background-color: #f43f5e; }`,
    related: ['utility-first-vs-semantic', 'arbitrary-values', 'tailwind-v4-features']
  },

  // 2. Flexbox & Grid
  {
    id: 'flexbox-alignment',
    title: 'Flexbox Layout & Axis Alignment',
    kicker: 'Layout / 01',
    group: 'Flexbox & CSS Grid',
    difficulty: 'starter',
    summary: 'Master main-axis vs cross-axis alignment, gap distribution, and flex-shrink/grow mechanics.',
    definition: 'Flexbox coordinates one-dimensional layout along a Main Axis (row or col) and Cross Axis. Utilities like justify-*, items-*, gap-*, and flex-1 provide deterministic positioning for fluid UI components.',
    analogy: 'An adjustable row of seats on an airplane: justify-between pushes window seats to the walls, items-center aligns everyone to the aisle center, and flex-1 lets middle seats expand to fill leftover space.',
    steps: [
      'Apply "flex" to instantiate Flex Formatting Context',
      'Set direction: "flex-row" (horizontal) or "flex-col" (vertical)',
      'Align Main Axis with "justify-start | justify-center | justify-between"',
      'Align Cross Axis with "items-start | items-center | items-stretch"',
      'Distribute child expansion using "flex-1" or "flex-shrink-0"'
    ],
    mistakes: [
      'Mixing up justify-* (main axis) with items-* (cross axis) when changing flex-direction to flex-col',
      'Using margin hacks for spacing instead of modern native "gap-*" utility',
      'Forgetting "min-w-0" on flex children when dealing with long overflowing text truncation'
    ],
    optimization: 'Using "gap-*" instead of child margins eliminates the need for :last-child margin resets and prevents flex layout edge clipping.',
    tailwindSnippet: `<div class="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-slate-900 border border-slate-800">
  <div class="flex items-center gap-3 min-w-0">
    <div class="w-10 h-10 rounded-full bg-cyan-500 flex-shrink-0" />
    <div class="truncate">
      <div class="font-bold text-white truncate">Long User Name That Truncates</div>
      <div class="text-xs text-slate-400">active now</div>
    </div>
  </div>
  <button class="flex-shrink-0 px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold">
    Connect
  </button>
</div>`,
    cssOutput: `.flex { display: flex; }
.justify-between { justify-content: space-between; }
.items-center { align-items: center; }
.flex-shrink-0 { flex-shrink: 0; }
.min-w-0 { min-width: 0px; }`,
    related: ['grid-autofit', 'utility-first-vs-semantic', 'box-model-padding']
  },
  {
    id: 'grid-autofit',
    title: 'CSS Grid Auto-Fit & Responsive Tracks',
    kicker: 'Layout / 02',
    group: 'Flexbox & CSS Grid',
    difficulty: 'intermediate',
    summary: 'Build fluid 2D responsive grids without media queries using auto-fit and minmax().',
    definition: 'CSS Grid provides true two-dimensional track layouts. Combining arbitrary grid templates like "grid-cols-[repeat(auto-fit,minmax(280px,1fr))]" creates responsive card matrices that automatically adapt to screen widths without a single media query.',
    analogy: 'A ceramic tile floor installer who automatically fits whole tiles across the floor width, only wrapping to the next line when space runs out.',
    steps: [
      'Define Grid Container: "grid"',
      'Configure columns: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" or auto-fit',
      'Set uniform row and column spacing: "gap-6"',
      'Span multiple cells: "col-span-2" or "row-span-2"',
      'Align track items using "place-items-center" or "content-start"'
    ],
    mistakes: [
      'Using nested flexboxes when a simple 2D CSS grid solves alignment in 1/3 the code',
      'Over-specifying explicit heights on grid rows causing content to overflow and clip'
    ],
    optimization: 'Auto-fit responsive grids eliminate 80% of responsive breakpoint declarations and eliminate layout reflow jitter.',
    tailwindSnippet: `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="col-span-1 lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800">
    <h3 class="text-xl font-bold text-white">Featured Hero Card (2 Cols)</h3>
  </div>
  <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800">
    <h3 class="text-xl font-bold text-white">Side Metric (1 Col)</h3>
  </div>
</div>`,
    cssOutput: `.grid { display: grid; }
.gap-6 { gap: 1.5rem; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
@media (min-width: 1024px) {
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:col-span-2 { grid-column: span 2 / span 2; }
}`,
    related: ['flexbox-alignment', 'responsive-breakpoints', 'box-model-padding']
  },

  // 3. Box Model & Spacing
  {
    id: 'box-model-padding',
    title: 'Box Model Dynamics, Ring & Borders',
    kicker: 'Box Model / 01',
    group: 'Box Model & Spacing',
    difficulty: 'starter',
    summary: 'Understand Box-Sizing: border-box, padding vs margin, and the outer ring utility.',
    definition: 'Every DOM element is rendered as a box comprising Content, Padding, Border, and Margin. Tailwind sets "box-sizing: border-box" globally so padding and border never expand an element beyond its defined width. The "ring-*" utility applies box-shadow outlines that do not shift layout geometry.',
    analogy: 'Framing a photograph: Content is the picture, Padding is the white matte mat, Border is the wooden picture frame, and Margin is the empty wall space around the frame.',
    steps: [
      'Tailwind Preflight resets all elements to "box-sizing: border-box"',
      'Inner spacing is applied with "p-*" (padding)',
      'Outer separation is applied with "m-*" (margin)',
      'Borders are defined with "border border-slate-200"',
      'Focus indicators use "ring-2 ring-cyan-500 ring-offset-2" to avoid border resizing shifts'
    ],
    mistakes: [
      'Applying margins to both siblings causing unexpected margin-collapse anomalies',
      'Adding border on hover (:hover:border-2) which causes a 2px layout jitter (use ring or transparent border instead)'
    ],
    optimization: 'Using "ring-*" for focus and active states guarantees 0px layout reflow shifts and preserves 60 FPS animation smoothness.',
    tailwindSnippet: `<button class="px-5 py-2.5 rounded-lg font-medium text-white bg-slate-900 border border-slate-700 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all">
  Click without layout shift
</button>`,
    cssOutput: `*, ::before, ::after { box-sizing: border-box; }
.ring-2 { --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }`,
    related: ['utility-first-vs-semantic', 'flexbox-alignment', 'variants-hover-focus']
  },

  // 4. Variants & State
  {
    id: 'variants-hover-focus',
    title: 'Pseudo-Classes, Group & Peer State Inheritance',
    kicker: 'State / 01',
    group: 'Variants & State Inheritance',
    difficulty: 'intermediate',
    summary: 'Coordinate child styling based on parent hover (group-*) or sibling input status (peer-*).',
    definition: 'Tailwind variants prefix utility classes with conditions (hover:, focus:, active:, disabled:). The "group" and "peer" classes allow styles to react to parent or sibling state changes purely in CSS without JavaScript event listeners.',
    analogy: 'A chandelier wired to a wall switch: toggling the wall switch (parent/peer) lights up every hanging crystal (group-hover/peer-checked) instantly through electrical wiring.',
    steps: [
      'Mark parent container with "group" class',
      'Target child elements with "group-hover:translate-x-1" or "group-hover:text-cyan-400"',
      'For form inputs: mark input with "peer" class',
      'Style subsequent sibling label with "peer-focus:text-cyan-500" or "peer-invalid:text-rose-500"'
    ],
    mistakes: [
      'Placing "peer" elements after the styled target in the DOM (CSS sibling selectors "~" only traverse downward)',
      'Nesting multiple "group" containers without named identifiers (group/sidebar, group/card)'
    ],
    optimization: 'Named groups ("group/card" + "group-hover/card:*") allow deeply nested components to trigger independent micro-animations with 0 JS listeners.',
    tailwindSnippet: `<div class="group relative p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer">
  <div class="flex items-center justify-between">
    <span class="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
      Interactive Card Title
    </span>
    <span class="text-slate-500 group-hover:translate-x-1 group-hover:text-cyan-400 transition-transform">
      →
    </span>
  </div>
</div>`,
    cssOutput: `.group:hover .group-hover\\:text-cyan-400 { color: #22d3ee; }
.group:hover .group-hover\\:translate-x-1 { transform: translateX(0.25rem); }`,
    related: ['responsive-breakpoints', 'box-model-padding', 'arbitrary-values']
  },
  {
    id: 'responsive-breakpoints',
    title: 'Mobile-First Responsive Breakpoint Architecture',
    kicker: 'State / 02',
    group: 'Variants & State Inheritance',
    difficulty: 'intermediate',
    summary: 'Why Tailwind uses min-width queries and how to build fluid mobile-first layouts.',
    definition: 'Tailwind breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px) are Mobile-First min-width media queries. Unprefixed utilities apply to mobile screens (0px+), while prefixed variants override styles as screen width expands.',
    analogy: 'Designing a poster: you first compose the compact postcard version. As the paper expands to a magazine cover or billboard, you add extra columns and larger typography.',
    steps: [
      'Design base mobile layout first (e.g. "flex-col text-sm p-4")',
      'Add tablet breakpoint: "md:flex-row md:text-base md:p-6"',
      'Add desktop layout: "lg:grid-cols-4 lg:p-8"',
      'All breakpoint queries stack monotonically using "@media (min-width: ...)"'
    ],
    mistakes: [
      'Attempting to use breakpoints as max-width desktop-down queries (e.g. expecting "sm:" to mean "mobile only")',
      'Over-declaring duplicate properties across consecutive breakpoints'
    ],
    optimization: 'Mobile-first min-width styling results in smaller initial render trees on mobile devices and prevents media query cascade clashes.',
    tailwindSnippet: `<div class="w-full text-center sm:text-left p-4 sm:p-8 md:p-12 lg:p-16 rounded-3xl bg-slate-900 text-white">
  <h1 class="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
    Mobile-First Responsive Typography
  </h1>
</div>`,
    cssOutput: `.text-center { text-align: center; }
@media (min-width: 640px) {
  .sm\\:text-left { text-align: left; }
  .sm\\:text-4xl { font-size: 2.25rem; }
}
@media (min-width: 1024px) {
  .lg\\:text-6xl { font-size: 3.75rem; }
}`,
    related: ['variants-hover-focus', 'flexbox-alignment', 'grid-autofit']
  },

  // 5. Tailwind 4 & Internals
  {
    id: 'tailwind-v4-features',
    title: 'Tailwind CSS v4 & Native CSS Theme Engine',
    kicker: 'Internals / 01',
    group: 'Tailwind 4 & Engine Internals',
    difficulty: 'advanced',
    summary: 'The new CSS-first configuration using @theme, modern CSS color-mix, and zero-config builds.',
    definition: 'Tailwind CSS v4 removes tailwind.config.js in favor of a CSS-first architecture using standard @theme directives, native CSS cascade layers (@layer), CSS variables, and modern color spaces (OKLCH, display-p3).',
    analogy: 'Upgrading from an external JavaScript config parser to native browser-level engine instructions built directly into the stylesheet.',
    steps: [
      'Import Tailwind v4 directly in CSS: "@import \\"tailwindcss\\";"',
      'Declare custom tokens using "@theme { --color-brand: #06b6d4; }"',
      'Tokens automatically generate matching utilities ("bg-brand", "text-brand", "border-brand")',
      'Leverage modern native CSS variables for runtime dynamic theme switching'
    ],
    mistakes: [
      'Relying on deprecated PostCSS plugins like tailwindcss/nesting when CSS nesting is now native in modern browsers',
      'Defining hardcoded color tokens instead of referencing CSS variable custom properties'
    ],
    optimization: 'Native CSS "@theme" eliminates the JavaScript config runtime, slashing build times by over 500% and enabling instant HMR hot reloads.',
    tailwindSnippet: `/* Tailwind v4 CSS-First Configuration */
@import "tailwindcss";

@theme {
  --color-cosmic-cyan: #06b6d4;
  --color-cosmic-gold: #f59e0b;
  --font-display: 'Syne', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}

.hero-banner {
  font-family: var(--font-display);
  background-color: var(--color-cosmic-cyan);
}`,
    cssOutput: `:root {
  --color-cosmic-cyan: #06b6d4;
  --color-cosmic-gold: #f59e0b;
}
.bg-cosmic-cyan { background-color: var(--color-cosmic-cyan); }
.text-cosmic-gold { color: var(--color-cosmic-gold); }`,
    related: ['jit-compiler-oxide', 'arbitrary-values', 'utility-first-vs-semantic']
  },
  {
    id: 'arbitrary-values',
    title: 'Arbitrary Values, Calc() & Dynamic Modifiers',
    kicker: 'Internals / 02',
    group: 'Tailwind 4 & Engine Internals',
    difficulty: 'expert',
    summary: 'Escape token constraints on demand with brackets: bg-[#00d8ff], grid-cols-[1fr_200px], and calc().',
    definition: 'When design requirements demand a one-off pixel-perfect value outside your theme scale, square bracket syntax "[...]" allows arbitrary CSS values, CSS variables, and mathematical expressions to be compiled on demand without writing custom CSS classes.',
    analogy: 'A tailor who normally uses standard off-the-rack sizing (S, M, L, XL), but can instantly cut a custom 33.7cm sleeve on request without redesigning the entire sewing machine.',
    steps: [
      'Identify one-off requirement: e.g. 3D transform "rotate-x-[15deg]"',
      'Enclose custom value in square brackets: "h-[calc(100vh-4rem)]"',
      'Use underscores for spaces in complex values: "grid-cols-[200px_1fr_100px]"',
      'Target CSS custom properties directly: "bg-[var(--user-theme-accent)]"'
    ],
    mistakes: [
      'Using arbitrary values everywhere instead of standardizing repeating spacings into design tokens',
      'Using literal spaces inside brackets instead of underscores (e.g. "grid-cols-[200px 1fr]" will fail to parse)'
    ],
    optimization: 'Reserving arbitrary values for truly unique one-off components keeps 95%+ of your application consistent with your design token scale.',
    tailwindSnippet: `<div class="w-[calc(100%-2rem)] max-w-[1280px] min-h-[480px] grid grid-cols-[240px_1fr] bg-[#0a0f1d] border border-cyan-500/20 rounded-[2rem] p-[2.25rem] shadow-[0_20px_60px_-15px_rgba(6,182,212,0.15)]">
  <aside class="border-r border-white/10 pr-[1.5rem]">Sidebar</aside>
  <main class="pl-[1.5rem]">Main View</main>
</div>`,
    cssOutput: `.w-\\[calc\\(100\\%-2rem\\)\\] { width: calc(100% - 2rem); }
.grid-cols-\\[240px_1fr\\] { grid-template-columns: 240px 1fr; }
.bg-\\[\\#0a0f1d\\] { background-color: #0a0f1d; }`,
    related: ['tailwind-v4-features', 'jit-compiler-oxide', 'grid-autofit']
  }
];

export const tailwindTopicGroups: TailwindTopicGroup[] = [
  {
    id: 'philosophy',
    name: 'Utility-First Philosophy',
    description: 'Atomic class composition, CSS bundle flattening, and Rust Oxide JIT compilation.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: tailwindTopics.filter(t => t.group === 'Utility-First Philosophy')
  },
  {
    id: 'layout',
    name: 'Flexbox & CSS Grid Layout',
    description: 'Main vs cross axis alignment, flex expansion, auto-fit tracks, and 2D layouts.',
    badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    topics: tailwindTopics.filter(t => t.group === 'Flexbox & CSS Grid')
  },
  {
    id: 'box-model',
    name: 'Box Model & Spacing Dynamics',
    description: 'Border-box resets, padding vs margin, ring focus outlines, and zero-shift layout.',
    badgeColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    topics: tailwindTopics.filter(t => t.group === 'Box Model & Spacing')
  },
  {
    id: 'variants',
    name: 'Variants & State Inheritance',
    description: 'Pseudo-classes, group and peer parent/sibling state modifiers, and mobile-first queries.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: tailwindTopics.filter(t => t.group === 'Variants & State Inheritance')
  },
  {
    id: 'engine',
    name: 'Tailwind 4 & Engine Internals',
    description: 'Native CSS @theme directives, OKLCH color spaces, and bracket arbitrary values.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: tailwindTopics.filter(t => t.group === 'Tailwind 4 & Engine Internals')
  }
];

export const getTailwindTopic = (id: string) => tailwindTopics.find(t => t.id === id);
