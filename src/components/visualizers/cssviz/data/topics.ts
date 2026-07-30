export type VisualizerKey =
  | 'flexbox'
  | 'grid'
  | 'boxModel'
  | 'typography'
  | 'colors'
  | 'animations'
  | 'variables'
  | 'selectors'
  | 'displayModes'
  | 'floats'
  | 'positioning'
  | 'multiColumn'
  | 'responsiveDesign'
  | 'mediaQueries'
  | 'containerQueries'
  | 'unitsFunctions'

export type Topic = {
  name: string
  path: string
  summary: string
  difficulty: 'foundation' | 'intermediate' | 'advanced'
  tags: string[]
  visualizer?: VisualizerKey
  bullets: string[]
}

export const topics: Topic[] = [
  {
    name: 'Selectors & Specificity',
    path: '/selectors',
    summary: 'Understand how selectors target elements and how specificity resolves conflicts.',
    difficulty: 'foundation',
    tags: ['selectors', 'specificity', 'cascade'],
    visualizer: 'selectors',
    bullets: ['Pseudo-classes & pseudo-elements', 'Specificity math and the cascade', ':is(), :where(), and :has()'],
  },
  {
    name: 'Cascade & Inheritance',
    path: '/cascade',
    summary: 'Dive deep into the cascade layers, inheritance rules, and how importance is calculated.',
    difficulty: 'foundation',
    tags: ['cascade', 'inheritance', 'layers'],
    bullets: ['Cascade layers and ordering', 'inherit vs. initial vs. revert', 'Author vs. user vs. UA styles'],
  },
  {
    name: 'Box Model',
    path: '/box-model',
    summary: 'Visualize content, padding, border, and margin with live adjustments.',
    difficulty: 'foundation',
    tags: ['layout', 'box-model', 'visualizer'],
    visualizer: 'boxModel',
    bullets: ['content/padding/border/margin', 'box-sizing and overflow', 'Nested box composition'],
  },
  {
    name: 'Display Modes',
    path: '/display',
    summary: 'Inline, block, inline-block, table, and flow-root behaviors and their layout effects.',
    difficulty: 'foundation',
    tags: ['display', 'flow'],
    visualizer: 'displayModes',
    bullets: ['Formatting contexts', 'flow-root and block formatting', 'inline vs inline-block nuances'],
  },
  {
    name: 'Floats & Clearfix',
    path: '/floats',
    summary: 'Legacy layout tool with modern containment and clearfix recipes.',
    difficulty: 'intermediate',
    tags: ['floats', 'legacy layout'],
    visualizer: 'floats',
    bullets: ['Float stacking rules', 'clearfix techniques', 'BFC and containment'],
  },
  {
    name: 'Positioning',
    path: '/positioning',
    summary: 'Static, relative, absolute, sticky, and fixed positioning with stacking context examples.',
    difficulty: 'foundation',
    tags: ['position', 'stacking-context'],
    visualizer: 'positioning',
    bullets: ['Containing blocks', 'z-index and stacking contexts', 'Sticky thresholds'],
  },
  {
    name: 'Flexbox Visualizer',
    path: '/flexbox',
    summary: 'Interactive flex playground for axes, alignment, wrapping, and gaps.',
    difficulty: 'foundation',
    tags: ['flex', 'layout', 'visualizer'],
    visualizer: 'flexbox',
    bullets: ['Main vs cross axis', 'gap, wrap, and ordering', 'Alignment across breakpoints'],
  },
  {
    name: 'Grid Visualizer',
    path: '/grid',
    summary: 'Design explicit and implicit grids with repeat(), minmax(), and auto-fit/auto-fill.',
    difficulty: 'intermediate',
    tags: ['grid', 'layout', 'visualizer'],
    visualizer: 'grid',
    bullets: ['Grid tracks & gaps', 'auto-fit vs auto-fill', 'Named areas and responsive tracks'],
  },
  {
    name: 'Multi-Column Layout',
    path: '/multicolumn',
    summary: 'Newspaper-like flows with columns, spanning, and balancing strategies.',
    difficulty: 'intermediate',
    tags: ['columns', 'flow'],
    visualizer: 'multiColumn',
    bullets: ['column-count vs column-width', 'spanning headers', 'column gaps and rules'],
  },
  {
    name: 'Responsive Design',
    path: '/responsive',
    summary: 'Fluid design systems built with constraints, clamps, and progressive enhancement.',
    difficulty: 'foundation',
    tags: ['responsive', 'breakpoints'],
    visualizer: 'responsiveDesign',
    bullets: ['Mobile-first strategy', 'fluid typography with clamp()', 'layout shifts and safe areas'],
  },
  {
    name: 'Media Queries',
    path: '/media-queries',
    summary: 'Craft media queries for viewport, accessibility preferences, and device capabilities.',
    difficulty: 'foundation',
    tags: ['media', 'responsive'],
    visualizer: 'mediaQueries',
    bullets: ['prefers-reduced-motion', 'light/dark preferences', 'orientation and color gamut'],
  },
  {
    name: 'Container Queries',
    path: '/container-queries',
    summary: 'Component-driven responsiveness using container size instead of viewport.',
    difficulty: 'intermediate',
    tags: ['container-queries', 'responsive'],
    visualizer: 'containerQueries',
    bullets: ['@container rules', 'Container units (cqw/cqh)', 'Style queries vs size queries'],
  },
  {
    name: 'Typography Lab',
    path: '/typography',
    summary: 'Experiment with font-size, line-height, letter-spacing, and rhythm.',
    difficulty: 'foundation',
    tags: ['type', 'fonts', 'visualizer'],
    visualizer: 'typography',
    bullets: ['Readable line lengths', 'variable font axes', 'baseline rhythm'],
  },
  {
    name: 'Fonts & Variable Fonts',
    path: '/fonts',
    summary: 'Load, optimize, and animate variable fonts with axis sliders.',
    difficulty: 'intermediate',
    tags: ['fonts', 'performance'],
    bullets: ['@font-face strategy', 'font-display and fallback', 'Variable font axes and ranges'],
  },
  {
    name: 'Colors & Gradients',
    path: '/colors',
    summary: 'HSL, LCH, and gradient design with live color wheel and stops.',
    difficulty: 'foundation',
    tags: ['color', 'gradients', 'visualizer'],
    visualizer: 'colors',
    bullets: ['Color spaces & contrast', 'Linear vs radial gradients', 'Layering glows and blend modes'],
  },
  {
    name: 'Backgrounds & Parallax',
    path: '/backgrounds',
    summary: 'Layer multiple backgrounds, blend modes, and subtle parallax illusions.',
    difficulty: 'intermediate',
    tags: ['backgrounds', 'parallax'],
    bullets: ['background-position tricks', 'blend-mode recipes', 'scroll-tied parallax'],
  },
  {
    name: 'Borders & Shapes',
    path: '/borders',
    summary: 'Rounded corners, outlines, border-images, and creative shape utilities.',
    difficulty: 'foundation',
    tags: ['borders', 'shapes'],
    bullets: ['border-image & masks', 'rounded geometry', 'logical vs physical properties'],
  },
  {
    name: 'Clip-path & Masking',
    path: '/clipping',
    summary: 'Reveal content with clip-path polygons, SVG masks, and gradient masks.',
    difficulty: 'advanced',
    tags: ['clip-path', 'masking'],
    bullets: ['CSS mask-image', 'SVG mask vs clip', 'Animating masks'],
  },
  {
    name: 'Filters & Effects',
    path: '/filters',
    summary: 'Blur, hue-rotate, and backdrops to build glassmorphism and neon glows.',
    difficulty: 'intermediate',
    tags: ['filters', 'effects'],
    bullets: ['backdrop-filter patterns', 'performance-aware filters', 'Combining filters & blend modes'],
  },
  {
    name: 'Shadows Playground',
    path: '/shadows',
    summary: 'Soft shadows, inner glows, and layered elevation tokens.',
    difficulty: 'foundation',
    tags: ['shadows', 'elevation'],
    bullets: ['Multi-layer shadows', 'Neumorphism vs glass', 'Drop-shadow vs box-shadow'],
  },
  {
    name: 'Transitions',
    path: '/transitions',
    summary: 'Ease functions, durations, and choreographing micro-interactions.',
    difficulty: 'foundation',
    tags: ['transitions', 'motion'],
    bullets: ['Custom cubic-beziers', 'Staggered transitions', 'Animating layout changes'],
  },
  {
    name: 'CSS Animations + Keyframes',
    path: '/animations',
    summary: 'Author keyframes, iteration modes, and timing with live preview.',
    difficulty: 'foundation',
    tags: ['animations', 'keyframes', 'visualizer'],
    visualizer: 'animations',
    bullets: ['Timing functions & delays', 'Fill modes and directions', 'Animating transforms & opacity'],
  },
  {
    name: '3D Transforms & Perspective',
    path: '/3d',
    summary: 'Rotate, skew, and manage perspective to create layered depth.',
    difficulty: 'advanced',
    tags: ['3d', 'transforms'],
    bullets: ['perspective vs perspective-origin', 'preserve-3d pitfalls', 'Card flip interactions'],
  },
  {
    name: 'Motion Path (offset-path)',
    path: '/motion-path',
    summary: 'Animate elements along arbitrary paths with offset-path and offset-rotate.',
    difficulty: 'advanced',
    tags: ['motion-path', 'animation'],
    bullets: ['Defining paths', 'offset-distance choreography', 'Pairing with keyframes'],
  },
  {
    name: 'CSS Variables (Custom Properties)',
    path: '/variables',
    summary: 'Design tokens and live theming with cascading custom properties.',
    difficulty: 'foundation',
    tags: ['variables', 'design tokens', 'visualizer'],
    visualizer: 'variables',
    bullets: ['Scoping tokens', 'Dynamic overrides', 'calc() with variables'],
  },
  {
    name: 'Functions (calc, min, max, clamp)',
    path: '/functions',
    summary: 'Compose responsive formulas with calc(), clamp(), min(), and max().',
    difficulty: 'foundation',
    tags: ['functions', 'math'],
    visualizer: 'unitsFunctions',
    bullets: ['Constraint-based sizing', 'Combining viewport + rem units', 'Fallback-friendly formulas'],
  },
  {
    name: 'Units (px, em, rem, vw, vh, fr, %)',
    path: '/units',
    summary: 'Choose the right units for sizing, spacing, and layout grids.',
    difficulty: 'foundation',
    tags: ['units', 'responsive'],
    visualizer: 'unitsFunctions',
    bullets: ['Root-based scaling', 'Viewport + container units', 'fr tracks in grid'],
  },
  {
    name: 'Accessibility in CSS',
    path: '/css-a11y',
    summary: 'Inclusive styling with focus states, reduced motion, and readable contrast.',
    difficulty: 'foundation',
    tags: ['a11y', 'motion', 'contrast'],
    bullets: ['Focus-visible and outlines', 'prefers-reduced-motion', 'High-contrast palettes'],
  },
  {
    name: 'Browser Rendering Pipeline',
    path: '/rendering',
    summary: 'Understand style, layout, paint, and composite stages for predictable UI.',
    difficulty: 'advanced',
    tags: ['rendering', 'pipeline'],
    bullets: ['style/layout/paint/composite', 'Critical rendering path', 'Measuring with DevTools'],
  },
  {
    name: 'Reflow, Repaint & Compositing',
    path: '/reflow',
    summary: 'Minimize layout thrash with batching, will-change, and compositor-only animations.',
    difficulty: 'advanced',
    tags: ['performance', 'rendering'],
    bullets: ['Forced reflow culprits', 'paint vs composite', 'transform/opacity animations'],
  },
  {
    name: 'GPU Acceleration',
    path: '/gpu',
    summary: 'Trigger GPU-accelerated paths safely while avoiding memory pitfalls.',
    difficulty: 'advanced',
    tags: ['gpu', 'performance'],
    bullets: ['Compositor layers', 'will-change guidance', 'Image vs vector trade-offs'],
  },
  {
    name: 'Print Styling',
    path: '/print',
    summary: 'Craft paged media rules, margins, and print-friendly color strategies.',
    difficulty: 'intermediate',
    tags: ['print', 'media'],
    bullets: ['@page and size', 'Print-safe colors', 'Hiding interactive chrome'],
  },
  {
    name: 'CSS Architecture (BEM, OOCSS, SMACSS)',
    path: '/architecture',
    summary: 'Structure scalable CSS systems with naming, layering, and composition.',
    difficulty: 'advanced',
    tags: ['architecture', 'scaling'],
    bullets: ['BEM semantics', 'Layered architecture', 'Enforcing constraints with tooling'],
  },
  {
    name: 'Houdini API — Paint Worklet',
    path: '/houdini-paint',
    summary: 'Generate procedural backgrounds with Paint Worklets and custom properties.',
    difficulty: 'advanced',
    tags: ['houdini', 'paint'],
    bullets: ['Registering worklets', 'Drawing with canvas-like APIs', 'Fallback strategies'],
  },
  {
    name: 'Houdini API — Typed OM',
    path: '/houdini-typedom',
    summary: 'Interact with CSS values as typed objects for safer runtime styling.',
    difficulty: 'advanced',
    tags: ['houdini', 'typed-om'],
    bullets: ['CSSUnitValues & StylePropertyMaps', 'Parsing vs serialization', 'Interop with JS animations'],
  },
  {
    name: 'Houdini API — Layout API',
    path: '/houdini-layout',
    summary: 'Author custom layout algorithms that participate in normal flow.',
    difficulty: 'advanced',
    tags: ['houdini', 'layout'],
    bullets: ['registerLayout fundamentals', 'Intrinsic size calculation', 'Progressive enhancement guidance'],
  },
  {
    name: 'CSS Debugging Tools',
    path: '/debugging',
    summary: 'DevTools workflows for inspecting cascade, grid/flex overlays, and performance.',
    difficulty: 'foundation',
    tags: ['debugging', 'devtools'],
    bullets: ['Grid/flex overlays', 'Performance profiling', 'Source maps & coverage'],
  },
]

export const featuredVisualizers: VisualizerKey[] = ['flexbox', 'grid', 'boxModel', 'typography', 'colors', 'animations']

export const featuredTopics = topics.filter((topic) =>
  [
    '/flexbox',
    '/grid',
    '/box-model',
    '/typography',
    '/colors',
    '/animations',
    '/variables',
    '/rendering',
  ].includes(topic.path),
)

