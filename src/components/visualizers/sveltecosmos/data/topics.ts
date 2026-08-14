export interface SvelteTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Foundations' | 'Svelte 5 Runes' | 'Signals & Reactivity' | 'Templates & Directives' | 'SvelteKit Fullstack';
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  optimization: string;
  codeExample: string;
  compiledJs: string;
  related: string[];
}

export interface SvelteTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: SvelteTopic[];
}

export const svelteTopics: SvelteTopic[] = [
  // 1. Foundations
  {
    id: 'zero-vdom',
    title: 'Zero Virtual DOM',
    kicker: 'Foundations / 01',
    group: 'Foundations',
    difficulty: 'starter',
    summary: 'How Svelte skips the Virtual DOM by compiling components into pinpoint surgical DOM updates.',
    definition: 'Unlike React or Vue which diff in-memory tree representations at runtime, Svelte acts as a compiler. It analyzes templates at build time and emits compact, direct imperative JavaScript that mutates the exact DOM nodes when state changes.',
    analogy: 'Imagine ordering custom precision-cut glass instead of buying a giant sheet and chipping away at it every single day inside your living room.',
    steps: [
      'Parse .svelte template into an Abstract Syntax Tree (AST)',
      'Analyze reactive dependencies and variable writes',
      'Generate imperative createElement and setText operations',
      'Bind event listeners directly to target DOM nodes',
      'Runtime executes zero reconciliation overhead'
    ],
    mistakes: [
      'Assuming Svelte needs a bulky runtime bundle in production',
      'Trying to manually manage reconciliation keys when Svelte compiler already knows the DOM references',
      'Confusing compile-time reactivity with runtime proxies'
    ],
    optimization: 'Because there is no Virtual DOM tree traversal, CPU overhead on low-power mobile devices drops dramatically and memory allocations are negligible.',
    codeExample: `<script>
  let count = $state(0);
</script>

<button onclick={() => count++}>
  Clicks: {count}
</button>`,
    compiledJs: `// Compiler Output (Zero VDOM)
function create_fragment(ctx) {
  let button = $.element("button");
  let text = $.text("Clicks: ");
  let count_text = $.text(ctx.count);
  $.append(button, text);
  $.append(button, count_text);
  $.on(button, "click", ctx.onclick);
  return button;
}`,
    related: ['svelte-compiler', 'state-rune', 'derived-rune']
  },
  {
    id: 'svelte-compiler',
    title: 'Svelte Compiler Pipeline',
    kicker: 'Foundations / 02',
    group: 'Foundations',
    difficulty: 'intermediate',
    summary: 'The journey from .svelte SFC to optimized ESM JavaScript and CSS artifacts.',
    definition: 'The Svelte compiler transforms Single File Components into optimized JavaScript modules. It consists of a Lexer/Parser, an AST Analyzer, an Optimizer, and Code Generators for both Client DOM and Server-Side Rendering (SSR).',
    analogy: 'A translation studio that turns high-level storyboards directly into efficient machine blueprints without carrying translator dictionaries onto the factory floor.',
    steps: [
      'Lexical analysis separates <script>, <template>, and <style>',
      'HTML/JS AST construction using Acorn & custom parser',
      'Scope analysis tracks bindings, signals, and props',
      'CSS encapsulation applies deterministic scoped class hashes',
      'Code generator outputs client hydrateable functions or SSR string renderers'
    ],
    mistakes: [
      'Assuming Svelte components are loaded as raw strings at browser runtime',
      'Over-relying on global CSS selectors instead of scoped component styles',
      'Ignoring compiler warnings about unused variables and accessibility (a11y)'
    ],
    optimization: 'Dead-code elimination strips any unused runtime helpers, resulting in initial bundle sizes under 15KB.',
    codeExample: `// Component source
<script>
  let name = $state('World');
</script>
<h1>Hello {name}!</h1>
<style>
  h1 { color: #ff3e00; }
</style>`,
    compiledJs: `// Generated Client Code
import * as $ from "svelte/internal/client";
export default function App($$anchor) {
  let name = $.source("World");
  var h1 = $.element("h1", "svelte-1x8zq9");
  $.append(h1, $.text("Hello "));
  $.append(h1, $.derive(() => $.get(name)));
  $.append(h1, $.text("!"));
  $.append($$anchor, h1);
}`,
    related: ['zero-vdom', 'state-rune', 'scoped-styles']
  },

  // 2. Svelte 5 Runes
  {
    id: 'state-rune',
    title: '$state() Signal Core',
    kicker: 'Svelte 5 Runes / 01',
    group: 'Svelte 5 Runes',
    difficulty: 'starter',
    summary: 'Declare deeply reactive variables and universal signals anywhere in your codebase.',
    definition: 'In Svelte 5, $state() is the foundational rune that wraps values in reactive signals. It works inside .svelte components and plain .svelte.js/.svelte.ts modules, making reactivity universally portable.',
    analogy: 'A smart broadcasting sensor. When you update its dial, only the speakers specifically tuned to that frequency update.',
    steps: [
      'Declare let val = $state(initialValue)',
      'Compiler transforms read access to signal get() tracking',
      'Mutations (val = x or array.push) trigger signal set()',
      'Scheduled microtask notifies dependent effects and DOM nodes',
      'Only modified DOM text nodes are updated'
    ],
    mistakes: [
      'Using legacy let count = 0 syntax expecting Svelte 5 runes behavior',
      'Destructuring $state objects without using $derived or getters',
      'Attempting to reassign const declarations created with $state'
    ],
    optimization: 'Svelte 5 state is based on fine-grained signals. Updating property a of an object will not trigger effects watching property b.',
    codeExample: `<script>
  let user = $state({
    name: 'Ada',
    score: 100
  });

  function boost() {
    user.score += 25; // Fine-grained mutation
  }
</script>

<p>{user.name}: {user.score} pts</p>
<button onclick={boost}>Boost</button>`,
    compiledJs: `// Svelte 5 Signals Engine
const user = $.proxy({ name: 'Ada', score: 100 });
function boost() {
  user.score += 25; // Proxy setter notifies score signal
}`,
    related: ['derived-rune', 'effect-rune', 'props-rune']
  },
  {
    id: 'derived-rune',
    title: '$derived() Memoized Computations',
    kicker: 'Svelte 5 Runes / 02',
    group: 'Svelte 5 Runes',
    difficulty: 'intermediate',
    summary: 'Pure reactive derivations that lazily calculate and cache values until dependencies mutate.',
    definition: '$derived() creates a reactive expression that automatically tracks any $state or other $derived signals accessed within its expression, caching the result until an input changes.',
    analogy: 'An automated spreadsheet formula. Cell C1 = A1 * B1 recalculates only when A1 or B1 is edited.',
    steps: [
      'Define let total = $derived(price * quantity)',
      'Tracks price and quantity during first read execution',
      'Caches the computed result in an internal signal node',
      'Marks dirty when price or quantity mutates',
      'Recomputes lazily on the next read'
    ],
    mistakes: [
      'Introducing side effects (like API calls or DOM mutations) inside $derived',
      'Using $effect when all you need is a pure calculation',
      'Manually invalidating caches instead of letting the dependency graph do it'
    ],
    optimization: 'If dependencies change back to their original value before the next read, $derived skips recalculation entirely.',
    codeExample: `<script>
  let items = $state([10, 20, 30]);
  let total = $derived(items.reduce((a, b) => a + b, 0));
  let isDiscounted = $derived(total > 50);
</script>

<p>Total: \${total} {isDiscounted ? '(Discount Applied!)' : ''}</p>`,
    compiledJs: `// Svelte 5 Derived Signal
const items = $.source([10, 20, 30]);
const total = $.derive(() => $.get(items).reduce((a, b) => a + b, 0));
const isDiscounted = $.derive(() => $.get(total) > 50);`,
    related: ['state-rune', 'effect-rune', 'signals-graph']
  },
  {
    id: 'effect-rune',
    title: '$effect() Side-Effect Orchestration',
    kicker: 'Svelte 5 Runes / 03',
    group: 'Svelte 5 Runes',
    difficulty: 'intermediate',
    summary: 'Synchronize reactive state with external systems, APIs, canvas renderers, and the browser DOM.',
    definition: '$effect() executes side effects after the DOM has updated. It automatically registers dependencies on any signals read during its execution and re-runs whenever those signals change.',
    analogy: 'An attentive technician who watches warning lights on a control board and logs to disk whenever any dial moves.',
    steps: [
      'Component mounts and DOM is created',
      'First run of $effect() body tracks read signals',
      'Returns an optional cleanup function',
      'Signal changes schedule the effect for next microtask',
      'Runs cleanup first, then re-runs effect body'
    ],
    mistakes: [
      'Mutating state inside $effect causing infinite loop cycles',
      'Forgetting to return cleanup callbacks for timers, web sockets, or event listeners',
      'Using $effect for state synchronization that belongs in $derived'
    ],
    optimization: 'Effects are batched in microtasks so multiple synchronous state mutations result in only one effect invocation.',
    codeExample: `<script>
  let count = $state(0);

  $effect(() => {
    document.title = \`Count: \${count}\`;
    const timer = setInterval(() => console.log('Tick', count), 1000);
    return () => clearInterval(timer); // Cleanup
  });
</script>`,
    compiledJs: `// Effect Lifecycle
$.user_effect(() => {
  document.title = "Count: " + $.get(count);
  const timer = setInterval(() => console.log("Tick", $.get(count)), 1000);
  return () => clearInterval(timer);
});`,
    related: ['state-rune', 'derived-rune', 'lifecycle-flow']
  },
  {
    id: 'props-rune',
    title: '$props() & $bindable() Contracts',
    kicker: 'Svelte 5 Runes / 04',
    group: 'Svelte 5 Runes',
    difficulty: 'starter',
    summary: 'Type-safe component properties with default values, rest attributes, and two-way contracts.',
    definition: 'In Svelte 5, component inputs are declared with let { propName = defaultValue, ...rest } = $props(). For two-way data contracts, $bindable() explicitly opts a property into two-way binding.',
    analogy: 'A formal contract with optional default clauses and dedicated bidirectional communication channels.',
    steps: [
      'Parent passes props via <Child title="Demo" bind:value={name} />',
      'Child receives props through let { title, value = $bindable("") } = $props()',
      'Compiler establishes fine-grained signal forwarding',
      'Two-way mutations in child update the parent signal seamlessly',
      'Type checking validates shape through TypeScript interface'
    ],
    mistakes: [
      'Using legacy export let syntax in Svelte 5 runes mode',
      'Mutating a non-$bindable prop inside child component',
      'Over-binding components when one-way events are more appropriate'
    ],
    optimization: 'Unbound props are static parameter references, completely bypassing proxy overhead.',
    codeExample: `<script>
  interface Props {
    label: string;
    value?: string;
  }
  let { label, value = $bindable('') }: Props = $props();
</script>

<label>{label}</label>
<input bind:value={value} />`,
    compiledJs: `// Props Binding Contract
function Child($$anchor, $$props) {
  let label = $$props.label;
  let value = $.bindable($$props, 'value', '');
}`,
    related: ['state-rune', 'custom-events', 'component-tree']
  },

  // 3. Signals & Reactivity
  {
    id: 'signals-graph',
    title: 'Fine-Grained Signals Graph',
    kicker: 'Signals & Reactivity / 01',
    group: 'Signals & Reactivity',
    difficulty: 'advanced',
    summary: 'The push-pull reactive dependency graph powering Svelte 5 performance.',
    definition: 'Svelte 5 reactivity is built on a push-pull reactive signals graph. Sources (state) notify consumers (derived & effects) that a value changed (push phase), while consumers pull the exact value only when required.',
    analogy: 'A water pipe network with pressure sensors: water does not flow until a faucet is opened, but the pressure alert notifies the valve immediately.',
    steps: [
      'Signal read registers consumer in producer’s subscriber set',
      'State mutation marks all dependent nodes as dirty',
      'Dirty flag propagates down the dependency tree',
      'Effects are scheduled on the microtask queue',
      'DOM patch pulls only the changed values'
    ],
    mistakes: [
      'Assuming signals re-evaluate all code on every tick',
      'Creating circular signal dependencies causing stack overflow',
      'Bypassing signal boundaries with untracked global variables'
    ],
    optimization: 'Untracked reads avoid creating unnecessary graph nodes, keeping memory footprint tiny.',
    codeExample: `// Standalone Universal Reactive Signal
// counter.svelte.js
export function createCounter() {
  let count = $state(0);
  let double = $derived(count * 2);

  return {
    get count() { return count; },
    get double() { return double; },
    increment() { count++; }
  };
}`,
    compiledJs: `// Compiled Signal Source
export function createCounter() {
  const count = $.source(0);
  const double = $.derive(() => $.get(count) * 2);
  return {
    get count() { return $.get(count); },
    get double() { return $.get(double); },
    increment() { $.set(count, $.get(count) + 1); }
  };
}`,
    related: ['state-rune', 'derived-rune', 'microtask-batching']
  },

  // 4. Templates & Directives
  {
    id: 'logic-blocks',
    title: 'Logic Blocks ({#if}, {#each}, {#await})',
    kicker: 'Templates & Directives / 01',
    group: 'Templates & Directives',
    difficulty: 'starter',
    summary: 'Declarative template control structures that mount, diff, and unmount DOM nodes.',
    definition: 'Svelte template syntax provides dedicated logic blocks for conditional branches ({#if}), list iteration ({#each}), and asynchronous promise resolution ({#await}).',
    analogy: 'A stage manager who brings actors onto the stage, organizes the chorus line by name tag, and holds the curtain while waiting for the lead actor.',
    steps: [
      'Evaluate condition or promise state',
      'Mount corresponding block fragment to anchor node',
      'Apply keyed diffing on {#each item (item.id)} items',
      'Resolve {#await} with pending spinner, {:then data}, or {:catch error}',
      'Execute teardown and exit transitions when unmounting'
    ],
    mistakes: [
      'Forgetting unique key expressions in {#each} causing incorrect DOM state reuse',
      'Nesting expensive async operations inside each loop without concurrency caps',
      'Using manual boolean flags instead of native {#await promise}'
    ],
    optimization: 'Keyed each blocks use an index map to reorder existing DOM elements with minimal DOM moves.',
    codeExample: `<script>
  let todos = $state([
    { id: 1, text: 'Master Svelte', done: true },
    { id: 2, text: 'Build SvelteKit App', done: false }
  ]);
</script>

{#each todos as todo (todo.id)}
  <div class:done={todo.done}>
    {todo.text}
  </div>
{:else}
  <p>No todos left!</p>
{/each}`,
    compiledJs: `// Keyed List Reconciliation
$.each(anchor, () => todos, $.index_key, (anchor, item) => {
  var div = $.element("div");
  $.append(div, $.text(item.text));
  $.append(anchor, div);
});`,
    related: ['transitions-actions', 'component-tree', 'zero-vdom']
  },
  {
    id: 'transitions-actions',
    title: 'Transitions & use:actions',
    kicker: 'Templates & Directives / 02',
    group: 'Templates & Directives',
    difficulty: 'intermediate',
    summary: 'Declarative CSS hardware-accelerated animations and reusable element lifecycle directives.',
    definition: 'Svelte features built-in transition directives (in:fade, out:fly, transition:slide) that generate pure CSS keyframe animations, alongside use:action directives that hook directly into native DOM node lifecycles.',
    analogy: 'Custom lighting cues and stage trapdoors that trigger automatically whenever an actor enters or exits the theater.',
    steps: [
      'Element is queued for mount/unmount in the DOM',
      'Transition function calculates CSS keyframes and duration',
      'Svelte injects dynamic CSS @keyframes into document head',
      'GPU renders transition without JavaScript thread jank',
      'Action hook mounts with node, parameters, and destroy callback'
    ],
    mistakes: [
      'Running JavaScript animation loops inside requestAnimationFrame when pure CSS transition is available',
      'Forgetting destroy method in custom action causing memory leaks',
      'Using transition on parent and child simultaneously without local modifier'
    ],
    optimization: 'Svelte transitions run off the main JavaScript thread via CSS animations, ensuring 60-120fps motion even during heavy compute.',
    codeExample: `<script>
  import { fade, slide } from 'svelte/transition';
  let visible = $state(true);

  function autofocus(node) {
    node.focus();
    return {
      destroy() { /* cleanup */ }
    };
  }
</script>

<button onclick={() => visible = !visible}>Toggle</button>
{#if visible}
  <div transition:slide={{ duration: 300 }}>
    <input use:autofocus transition:fade />
  </div>
{/if}`,
    compiledJs: `// CSS Keyframe Generator
$.transition(node, slide, { duration: 300 });
$.action(inputNode, autofocus);`,
    related: ['logic-blocks', 'scoped-styles', 'zero-vdom']
  },

  // 5. SvelteKit Fullstack
  {
    id: 'sveltekit-routing',
    title: 'SvelteKit Universal Routing & Loaders',
    kicker: 'SvelteKit Fullstack / 01',
    group: 'SvelteKit Fullstack',
    difficulty: 'advanced',
    summary: 'Filesystem directory routing, +page.server.ts load functions, and hydration architecture.',
    definition: 'SvelteKit is the official fullstack application framework for Svelte. It uses directory-based routing with special filename conventions (+page.svelte, +page.server.ts, +layout.svelte, +server.ts) to handle SSR, static generation, API endpoints, and data loading.',
    analogy: 'An intelligent airport routing tower where luggage (+page.server.ts) arrives at the gate right before the passengers (+page.svelte) board the plane.',
    steps: [
      'Client requests URL /dashboard/analytics',
      'Server matches src/routes/dashboard/analytics/+page.svelte',
      'Executes load() in +page.server.ts to query database',
      'Renders static HTML string + serialized payload on server',
      'Client hydrates instantly and initiates client-side SPA navigation'
    ],
    mistakes: [
      'Leaking server secret keys inside client-side +page.ts instead of +page.server.ts',
      'Triggering multiple redundant network waterfalls instead of parallel parent/child loaders',
      'Failing to handle progressive enhancement on form submissions'
    ],
    optimization: 'Pre-fetching on link hover (`data-sveltekit-preload-data="hover"`) loads server data in under 50ms before the user even clicks.',
    codeExample: `// src/routes/blog/[slug]/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const post = await db.getPost(params.slug);
  return { post };
};

// src/routes/blog/[slug]/+page.svelte
<script>
  let { data } = $props();
</script>
<h1>{data.post.title}</h1>
<p>{data.post.content}</p>`,
    compiledJs: `// Server Output + Hydration Manifest
export const prerender = false;
export const ssr = true;`,
    related: ['form-actions', 'zero-vdom', 'state-rune']
  },
  {
    id: 'form-actions',
    title: 'Form Actions & Progressive Enhancement',
    kicker: 'SvelteKit Fullstack / 02',
    group: 'SvelteKit Fullstack',
    difficulty: 'advanced',
    summary: 'Handle server mutations seamlessly with zero client JavaScript and progressive enhancement via use:enhance.',
    definition: 'SvelteKit Form Actions let you handle POST mutations in +page.server.ts. Combined with use:enhance, forms work with 100% functionality without JavaScript enabled, and upgrade to seamless AJAX submissions with JS.',
    analogy: 'A dual-mode high-speed train: operates reliably on standard electric rails, but activates magnetic levitation as soon as advanced power is detected.',
    steps: [
      'HTML <form method="POST" action="?/create"> is rendered',
      'User submits form data',
      'If JS is disabled: native HTTP POST triggers server action and re-renders page',
      'If JS is enabled: use:enhance intercepts submit with fetch and updates page data seamlessly',
      'Automatic validation error feedback is provided without full page reloads'
    ],
    mistakes: [
      'Writing custom fetch handlers with complex state when use:enhance does it automatically',
      'Forgetting CSRF token validation when using non-SvelteKit form endpoints',
      'Skipping return fail(400, { message }) for validation feedback'
    ],
    optimization: 'Zero client JS payload required for form submission; server automatically handles redirect and cookie sessions.',
    codeExample: `// +page.server.ts
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email');
    if (!email) return fail(400, { missing: true });
    await db.subscribe(email);
    return { success: true };
  }
};

// +page.svelte
<script>
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<form method="POST" use:enhance>
  <input name="email" type="email" required />
  <button>Subscribe</button>
  {#if form?.success}
    <p>Subscribed successfully!</p>
  {/if}
</form>`,
    compiledJs: `// SvelteKit Enhanced Form Pipeline
$.action(formNode, enhance, {});`,
    related: ['sveltekit-routing', 'state-rune', 'transitions-actions']
  }
];

export const svelteTopicGroups: SvelteTopicGroup[] = [
  {
    id: 'foundations',
    name: 'Foundations & Architecture',
    description: 'Deconstruct the zero-runtime compiler and how Svelte differs from Virtual DOM frameworks.',
    badgeColor: 'border-orange-500/30 text-orange-400 bg-orange-500/10',
    topics: svelteTopics.filter(t => t.group === 'Foundations')
  },
  {
    id: 'runes',
    name: 'Svelte 5 Runes Engine',
    description: 'Master universal signals with $state, $derived, $effect, and $props contracts.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: svelteTopics.filter(t => t.group === 'Svelte 5 Runes')
  },
  {
    id: 'signals',
    name: 'Signals & Reactivity Graph',
    description: 'Fine-grained push-pull dependency resolution and microtask execution batching.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: svelteTopics.filter(t => t.group === 'Signals & Reactivity')
  },
  {
    id: 'templates',
    name: 'Templates, Logic & Transitions',
    description: 'Logic blocks, hardware-accelerated CSS transitions, and DOM lifecycle actions.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: svelteTopics.filter(t => t.group === 'Templates & Directives')
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit Fullstack Architecture',
    description: 'SSR, filesystem routing, server loaders, and progressive enhancement form actions.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: svelteTopics.filter(t => t.group === 'SvelteKit Fullstack')
  }
];

export const getSvelteTopic = (id: string) => svelteTopics.find(t => t.id === id);
