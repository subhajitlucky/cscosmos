export type Category = 'fundamentals' | 'rendering' | 'hooks' | 'internals' | 'performance' | 'patterns' | 'concurrent';

export interface Topic {
  id: string;
  title: string;
  category: Category;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  visualizerType: 'render' | 'fiber' | 'hooks' | 'props' | 'state';
  nextTopicId?: string;
}

export const TOPICS: Topic[] = [
  { id: 'what-is-react', title: 'What is React?', category: 'fundamentals', difficulty: 'beginner', summary: 'The core philosophy of React.', mentalModel: 'The Chef.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'declarative-ui' },
  { id: 'declarative-ui', title: 'Declarative UI', category: 'fundamentals', difficulty: 'beginner', summary: 'Describing what, not how.', mentalModel: 'The GPS.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'virtual-dom' },
  { id: 'virtual-dom', title: 'Virtual DOM', category: 'fundamentals', difficulty: 'beginner', summary: 'The lightweight copy of the real DOM.', mentalModel: 'The Blueprint.', codeSnippet: '', visualizerType: 'fiber', nextTopicId: 'jsx-compilation' },
  { id: 'jsx-compilation', title: 'JSX Compilation', category: 'fundamentals', difficulty: 'beginner', summary: 'Babel and the JSX transform.', mentalModel: 'The Translator.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'components-composition' },
  { id: 'components-composition', title: 'Components & Composition', category: 'fundamentals', difficulty: 'beginner', summary: 'Atomic building blocks.', mentalModel: 'LEGO.', codeSnippet: '', visualizerType: 'fiber', nextTopicId: 'props-flow' },
  { id: 'props-flow', title: 'Props Flow', category: 'fundamentals', difficulty: 'beginner', summary: 'One-way data binding.', mentalModel: 'The Waterfall.', codeSnippet: '', visualizerType: 'props', nextTopicId: 'state-updates' },
  { id: 'state-updates', title: 'State Updates', category: 'hooks', difficulty: 'intermediate', summary: 'Component memory.', mentalModel: 'The Scoreboard.', codeSnippet: '', visualizerType: 'state', nextTopicId: 'controlled-uncontrolled' },
  { id: 'controlled-uncontrolled', title: 'Controlled vs Uncontrolled', category: 'fundamentals', difficulty: 'intermediate', summary: 'Form management strategies.', mentalModel: 'The Steering Wheel.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'event-handling' },
  { id: 'event-handling', title: 'Event Handling', category: 'fundamentals', difficulty: 'beginner', summary: 'Synthetic events.', mentalModel: 'The Doorbell.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'conditional-rendering' },
  { id: 'conditional-rendering', title: 'Conditional Rendering', category: 'fundamentals', difficulty: 'beginner', summary: 'Logic-based UI.', mentalModel: 'The Toggle.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'lists-keys' },
  { id: 'lists-keys', title: 'Lists & Keys', category: 'fundamentals', difficulty: 'beginner', summary: 'Identifying elements.', mentalModel: 'The Name Tag.', codeSnippet: '', visualizerType: 'fiber', nextTopicId: 'component-rerendering' },
  { id: 'component-rerendering', title: 'Component Re-rendering', category: 'rendering', difficulty: 'intermediate', summary: 'The update cycle.', mentalModel: 'The Refresh.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'usestate-deep-dive' },
  { id: 'usestate-deep-dive', title: 'useState Deep Dive', category: 'hooks', difficulty: 'intermediate', summary: 'Persistent variables.', mentalModel: 'The Locker.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'useeffect' },
  { id: 'useeffect', title: 'useEffect', category: 'hooks', difficulty: 'intermediate', summary: 'Synchronization.', mentalModel: 'The Satellite.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'uselayouteffect' },
  { id: 'uselayouteffect', title: 'useLayoutEffect', category: 'hooks', difficulty: 'advanced', summary: 'Synchronous measurement.', mentalModel: 'The Tape Measure.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'useref' },
  { id: 'useref', title: 'useRef', category: 'hooks', difficulty: 'intermediate', summary: 'Direct DOM access.', mentalModel: 'The Pointer.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'usememo' },
  { id: 'usememo', title: 'useMemo', category: 'hooks', difficulty: 'advanced', summary: 'Value caching.', mentalModel: 'The Result Cache.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'usecallback' },
  { id: 'usecallback', title: 'useCallback', category: 'hooks', difficulty: 'advanced', summary: 'Function caching.', mentalModel: 'The Method Cache.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'custom-hooks' },
  { id: 'custom-hooks', title: 'Custom Hooks', category: 'hooks', difficulty: 'intermediate', summary: 'Logic reuse.', mentalModel: 'The Tool Kit.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'rules-of-hooks' },
  { id: 'rules-of-hooks', title: 'Rules of Hooks', category: 'hooks', difficulty: 'intermediate', summary: 'Top-level constraints.', mentalModel: 'The Traffic Laws.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'context-api' },
  { id: 'context-api', title: 'Context API', category: 'patterns', difficulty: 'intermediate', summary: 'Global broadcast.', mentalModel: 'The Radio Station.', codeSnippet: '', visualizerType: 'props', nextTopicId: 'prop-drilling' },
  { id: 'prop-drilling', title: 'Prop Drilling', category: 'patterns', difficulty: 'intermediate', summary: 'The anti-pattern.', mentalModel: 'The Bucket Brigade.', codeSnippet: '', visualizerType: 'props', nextTopicId: 'state-lifting' },
  { id: 'state-lifting', title: 'State Lifting', category: 'patterns', difficulty: 'intermediate', summary: 'Sharing logic.', mentalModel: 'The Common Room.', codeSnippet: '', visualizerType: 'props', nextTopicId: 'reconciliation-algorithm' },
  { id: 'reconciliation-algorithm', title: 'Reconciliation', category: 'internals', difficulty: 'advanced', summary: 'Tree diffing.', mentalModel: 'The Spot the Difference.', codeSnippet: '', visualizerType: 'fiber', nextTopicId: 'fiber-architecture' },
  { id: 'fiber-architecture', title: 'Fiber Architecture', category: 'internals', difficulty: 'advanced', summary: 'Interruptible work.', mentalModel: 'The To-Do List.', codeSnippet: '', visualizerType: 'fiber', nextTopicId: 'render-vs-commit' },
  { id: 'render-vs-commit', title: 'Render vs Commit', category: 'rendering', difficulty: 'advanced', summary: 'Blueprints vs Construction.', mentalModel: 'The Draft.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'batching-updates' },
  { id: 'batching-updates', title: 'Batching Updates', category: 'internals', difficulty: 'advanced', summary: 'Optimized rendering.', mentalModel: 'The Waiter.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'performance-bottlenecks' },
  { id: 'performance-bottlenecks', title: 'Performance Bottlenecks', category: 'performance', difficulty: 'advanced', summary: 'Identifying lag.', mentalModel: 'The Clogged Pipe.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'memoization-strategies' },
  { id: 'memoization-strategies', title: 'Memoization Strategies', category: 'performance', difficulty: 'advanced', summary: 'Optimization patterns.', mentalModel: 'The Cheat Sheet.', codeSnippet: '', visualizerType: 'hooks', nextTopicId: 'error-boundaries' },
  { id: 'error-boundaries', title: 'Error Boundaries', category: 'patterns', difficulty: 'advanced', summary: 'UI Safety.', mentalModel: 'The Circuit Breaker.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'code-splitting-lazy' },
  { id: 'code-splitting-lazy', title: 'Code Splitting', category: 'patterns', difficulty: 'advanced', summary: 'Dynamic loading.', mentalModel: 'The Just-in-Time Delivery.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'suspense' },
  { id: 'suspense', title: 'Suspense', category: 'concurrent', difficulty: 'expert', summary: 'Async UI.', mentalModel: 'The Curtain.', codeSnippet: '', visualizerType: 'render', nextTopicId: 'concurrent-rendering' },
  { id: 'concurrent-rendering', title: 'Concurrent Rendering', category: 'concurrent', difficulty: 'expert', summary: 'Background work.', mentalModel: 'The Multitasker.', codeSnippet: '', visualizerType: 'fiber', nextTopicId: 'server-components' },
  { id: 'server-components', title: 'Server Components', category: 'patterns', difficulty: 'expert', summary: 'Zero-bundle rendering.', mentalModel: 'The Remote Brain.', codeSnippet: '', visualizerType: 'props', nextTopicId: 'scheduler-internals' },
  { id: 'scheduler-internals', title: 'The Scheduler', category: 'internals', difficulty: 'expert', summary: 'Priority management.', mentalModel: 'The Air Traffic Control.', codeSnippet: '', visualizerType: 'render' }
];
