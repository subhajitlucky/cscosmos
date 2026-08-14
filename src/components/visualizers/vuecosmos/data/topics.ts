export interface TopicItem {
  title: string;
  summary: string;
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  group: string;
  color: string;
}

export interface TopicGroup {
  label: string;
  color: string;
  topics: [string, string, 'starter' | 'intermediate' | 'advanced' | 'expert'][];
}

export const topicGroups: TopicGroup[] = [
  {
    label: 'Foundations',
    color: 'lime',
    topics: [
      ['What is Vue', 'See the big picture', 'starter'],
      ['Vue Architecture', 'The pieces and how they talk', 'starter'],
      ['Virtual DOM', 'A sketch before the paint', 'intermediate'],
      ['Template Compilation', 'From HTML to render function', 'intermediate'],
      ['Rendering Pipeline', 'State change → pixels', 'advanced'],
    ],
  },
  {
    label: 'Reactivity',
    color: 'coral',
    topics: [
      ['Reactive Data', 'State that knows who needs it', 'starter'],
      ['Dependency Tracking', 'The invisible subscriber list', 'intermediate'],
      ['Proxy-based Reactivity', 'Objects with a nervous system', 'advanced'],
      ['Refs', 'A single value, wrapped', 'starter'],
      ['Reactive Objects', 'Deeply connected state', 'intermediate'],
      ['Computed Properties', 'Cached derivations', 'intermediate'],
      ['Watch', 'React to a specific change', 'intermediate'],
      ['WatchEffect', 'Run when anything changes', 'advanced'],
    ],
  },
  {
    label: 'Templates',
    color: 'sky',
    topics: [
      ['Template Syntax', 'HTML with a superpower', 'starter'],
      ['Interpolation', 'Put state into the page', 'starter'],
      ['Attribute Binding', 'Dynamic DOM attributes', 'starter'],
      ['Conditional Rendering', 'Choose what exists', 'starter'],
      ['List Rendering', 'Turn arrays into UI', 'starter'],
      ['Event Handling', 'Listen to the world', 'starter'],
      ['Event Modifiers', 'Small rules, cleaner handlers', 'intermediate'],
      ['Form Bindings', 'Two-way, made visible', 'intermediate'],
      ['Custom Directives', 'Teach the DOM new tricks', 'advanced'],
    ],
  },
  {
    label: 'Components',
    color: 'violet',
    topics: [
      ['Single File Components', 'A component in one place', 'starter'],
      ['Composition API', 'Organize by capability', 'intermediate'],
      ['Setup Function', 'Where composition begins', 'intermediate'],
      ['Provide & Inject', 'Pass context down the tree', 'advanced'],
      ['Composable Functions', 'Reusable stateful logic', 'intermediate'],
      ['Component Communication', 'A conversation between boxes', 'starter'],
      ['Props', 'Data flows down', 'starter'],
      ['Custom Events', 'Intent flows up', 'starter'],
      ['Emit', 'Send a signal upward', 'starter'],
      ['v-model', 'A contract for two-way data', 'intermediate'],
      ['Slots', 'Leave a space for content', 'intermediate'],
      ['Scoped Slots', 'Content with context', 'advanced'],
      ['Dynamic Components', 'Swap the view', 'intermediate'],
    ],
  },
  {
    label: 'Runtime',
    color: 'yellow',
    topics: [
      ['Lifecycle Hooks', 'Moments in a component’s life', 'intermediate'],
      ['KeepAlive', 'Pause without forgetting', 'advanced'],
      ['Teleport', 'Render somewhere else', 'advanced'],
      ['Suspense', 'Make waiting feel intentional', 'advanced'],
      ['Transitions', 'Give change a shape', 'intermediate'],
      ['TransitionGroup', 'Animate a collection', 'advanced'],
      ['Animation System', 'Motion as a state change', 'intermediate'],
    ],
  },
  {
    label: 'Scale',
    color: 'mint',
    topics: [
      ['Pinia', 'A shared state graph', 'intermediate'],
      ['Vue Router', 'State in the URL', 'intermediate'],
      ['Navigation Guards', 'Gate a route transition', 'advanced'],
      ['Lazy Loading', 'Bring code when needed', 'intermediate'],
      ['Code Splitting', 'Smaller first download', 'advanced'],
      ['SSR', 'Render closer to the user', 'advanced'],
      ['Hydration', 'Wake up server HTML', 'advanced'],
      ['Performance Optimization', 'Make updates cheaper', 'advanced'],
      ['DevTools', 'See the invisible', 'starter'],
      ['Common Anti-patterns', 'What to unlearn', 'intermediate'],
    ],
  },
];

export const allTopics: TopicItem[] = topicGroups.flatMap((group) =>
  group.topics.map(([title, summary, difficulty]) => ({
    title,
    summary,
    difficulty,
    group: group.label,
    color: group.color,
  }))
);

export const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const getTopic = (slug: string): TopicItem | undefined =>
  allTopics.find((topic) => slugify(topic.title) === slug);

export interface TopicDetailItem {
  kicker: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  performance: string;
  related: string[];
}

export const topicDetails: Record<string, TopicDetailItem> = {
  'dependency-tracking': {
    kicker: 'Reactive systems / 02',
    definition: 'Vue remembers which effects read a piece of state, then wakes only those effects when the state changes.',
    analogy: 'Think of a small newsroom. Each reporter subscribes to the desks they need. When a desk updates, only the right reporters get the memo.',
    steps: ['A render reads count', 'Vue records the active effect', 'count changes', 'Vue triggers the subscribers', 'The component updates'],
    mistakes: ['Expecting every component to update', 'Mutating a non-reactive copy', 'Destructuring reactive state too early'],
    performance: 'Tracking keeps work local. The win is not that Vue never renders — it is that Vue can identify what is worth rendering.',
    related: ['Reactive Data', 'Proxy-based Reactivity', 'Computed Properties'],
  },
  'computed-properties': {
    kicker: 'Reactive systems / 06',
    definition: 'A computed value is a lazy, cached effect. It recalculates only when one of its reactive inputs has become stale.',
    analogy: 'It is a carefully labeled jar in the fridge: you do not remake the smoothie every time someone asks for it — only after an ingredient changes.',
    steps: ['Read source state', 'Cache the derived result', 'Mark stale when a dependency changes', 'Recompute on next read', 'Share the cached value'],
    mistakes: ['Changing state inside a computed getter', 'Using a watcher for a pure derivation', 'Forgetting that it is lazy'],
    performance: 'Computed properties are ideal for expensive, deterministic transformations. Keep getters pure so caching stays predictable.',
    related: ['Dependency Tracking', 'Watch', 'Reactive Data'],
  },
  'virtual-dom': {
    kicker: 'Rendering / 01',
    definition: 'The Virtual DOM is a lightweight JavaScript description of the UI. Vue compares the new description with the old one before touching the browser DOM.',
    analogy: 'Instead of rebuilding a room from scratch, you compare two floor plans and carry only the furniture that actually moved.',
    steps: ['Create a VNode tree', 'Compare it to the previous tree', 'Find the smallest differences', 'Patch the real DOM', 'Browser paints the result'],
    mistakes: ['Thinking the Virtual DOM is always faster', 'Using unstable list keys', 'Assuming every state change means a full DOM rewrite'],
    performance: 'Stable keys and predictable component boundaries help Vue make smaller patches and avoid unnecessary work.',
    related: ['Template Compilation', 'Rendering Pipeline', 'List Rendering'],
  },
};
