const fs = require('fs');
const path = require('path');

const topicsData = [
  {
    id: 'what-is-react',
    title: 'What is React?',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'React is a declarative, component-based JavaScript library for building user interfaces with predictable state.',
    mentalModel: 'The Chef: You give the restaurant kitchen an order recipe (state), and the chef prepares the exact dish (DOM) automatically.',
    codeSnippet: `import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div className="card">
      <h1>Hello, React 19!</h1>
      <p>Building declarative UIs made effortless.</p>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);`,
    takeaways: [
      'Declarative paradigm: You describe WHAT the UI should look like for a given state, not HOW to manipulate DOM nodes.',
      'Component-based architecture enables isolation, high reusability, and modular testability.',
      'One-way data flow ensures predictable state updates and effortless debugging.'
    ],
    commonPitfall: {
      mistake: 'Directly querying and modifying DOM nodes (e.g. document.getElementById().innerText = "new").',
      fix: 'Use React state (useState) to trigger declarative re-renders based on data changes.'
    },
    visualizerType: 'render',
    nextTopicId: 'declarative-ui'
  },
  {
    id: 'declarative-ui',
    title: 'Declarative UI',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'In declarative UI, you declare the desired UI state directly rather than issuing imperative step-by-step DOM mutations.',
    mentalModel: 'The GPS: You tell your navigation system the destination address (state), and it calculates all turns automatically rather than you driving blindfolded.',
    codeSnippet: `function NotificationBadge({ unreadCount }) {
  // Declarative: UI is a pure projection of unreadCount
  return (
    <div className="badge">
      Inbox {unreadCount > 0 && <span className="pill">{unreadCount}</span>}
    </div>
  );
}`,
    takeaways: [
      'UI is a function of state: UI = f(state).',
      'No manual addEventListener or element.classList.add() spaghetti code.',
      'Eliminates UI desynchronization bugs where DOM state drifts from JavaScript variables.'
    ],
    commonPitfall: {
      mistake: 'Imperatively toggling hidden/show classes using jQuery or querySelector inside components.',
      fix: 'Use boolean state with conditional JSX rendering (e.g. {isOpen && <Modal />} ).'
    },
    visualizerType: 'render',
    nextTopicId: 'virtual-dom'
  },
  {
    id: 'virtual-dom',
    title: 'Virtual DOM',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'A lightweight in-memory JavaScript representation of the real DOM tree used to compute minimal DOM mutation diffs.',
    mentalModel: 'The Blueprint: Before rebuilding a skyscraper wall, architects test changes on a digital 3D model (vDOM) to avoid expensive physical demolition.',
    codeSnippet: `// Virtual DOM object created by JSX:
const vnode = {
  type: 'button',
  props: {
    className: 'btn-primary',
    children: 'Click Me'
  }
};

// React reconciler diffs vnode before touching real browser DOM`,
    takeaways: [
      'Virtual DOM objects are cheap JavaScript objects living in heap memory.',
      'React diffs the new vDOM tree against the previous vDOM tree during the render phase.',
      'Only the exact changed DOM properties/nodes are committed to the real browser DOM.'
    ],
    commonPitfall: {
      mistake: 'Assuming Virtual DOM diffing is completely free and creating thousands of unnecessary elements.',
      fix: 'Use memoization or virtualized lists for giant datasets (e.g. 10,000+ items).'
    },
    visualizerType: 'fiber',
    nextTopicId: 'jsx-compilation'
  },
  {
    id: 'jsx-compilation',
    title: 'JSX Compilation',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'JSX is a syntax extension for JavaScript that compiles into React.createElement or react/jsx-runtime function calls.',
    mentalModel: 'The Translator: Writing JSX looks like HTML, but the compiler instantly translates it into standard JavaScript objects.',
    codeSnippet: `// JSX:
const element = <h1 className="title">Hello World</h1>;

// Compiles into (React 17+ JSX Transform):
import { jsx as _jsx } from 'react/jsx-runtime';
const elementCompiled = _jsx('h1', {
  className: 'title',
  children: 'Hello World'
});`,
    takeaways: [
      'JSX is syntactic sugar that produces JavaScript objects representing DOM nodes or components.',
      'Expressions inside curly braces { } can evaluate any valid JavaScript expression.',
      'All tags must be closed, and adjacent JSX elements must be wrapped in a parent or Fragment <> </>.'
    ],
    commonPitfall: {
      mistake: 'Returning multiple sibling JSX elements without a wrapping element or Fragment.',
      fix: 'Wrap siblings with <> ... </> (React Fragment) to avoid invalid JavaScript returns.'
    },
    visualizerType: 'render',
    nextTopicId: 'components-composition'
  },
  {
    id: 'components-composition',
    title: 'Components & Composition',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'Components are self-contained, reusable building blocks that accept props and return JSX.',
    mentalModel: 'LEGO Bricks: Small specialized bricks snap together to build castles, spaceships, or entire cities.',
    codeSnippet: `function Card({ title, children }) {
  return (
    <div className="card-container">
      <h2 className="card-title">{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

function App() {
  return (
    <Card title="User Profile">
      <p>Name: Alice</p>
      <button>Edit</button>
    </Card>
  );
}`,
    takeaways: [
      'Prefer composition over inheritance using props.children and specialized slot props.',
      'Components should adhere to the Single Responsibility Principle.',
      'Keep components pure: given the same props, they should return the same JSX without side effects during render.'
    ],
    commonPitfall: {
      mistake: 'Defining a component inside another component function, causing it to re-mount on every render.',
      fix: 'Always declare component functions at the module top-level scope.'
    },
    visualizerType: 'fiber',
    nextTopicId: 'props-flow'
  },
  {
    id: 'props-flow',
    title: 'Props Flow',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'Props pass read-only data from parent components down to child components in a strict unidirectional flow.',
    mentalModel: 'The Waterfall: Water only flows downwards from the top mountain spring to the river valley below.',
    codeSnippet: `function UserAvatar({ name, size = 40 }) {
  return (
    <img 
      src={\`/avatars/\${name}.png\`} 
      alt={name}
      style={{ width: size, height: size, borderRadius: '50%' }} 
    />
  );
}

// Parent passes immutable props:
<UserAvatar name="sarah" size={64} />`,
    takeaways: [
      'Props are read-only (immutable): A child component must never mutate its received props.',
      'To pass data back up to a parent, pass a callback function as a prop (e.g. onSelect={handleSelect}).',
      'Default props can be specified cleanly using JavaScript default parameter syntax.'
    ],
    commonPitfall: {
      mistake: 'Attempting to reassign or modify props (e.g. props.count = 5).',
      fix: 'Treat props as strictly read-only; maintain local state if modification is required.'
    },
    visualizerType: 'props',
    nextTopicId: 'state-updates'
  },
  {
    id: 'state-updates',
    title: 'State Updates',
    category: 'hooks',
    difficulty: 'intermediate',
    summary: 'State is local, mutable component memory that triggers a re-render whenever updated.',
    mentalModel: 'The Scoreboard: When a team scores, you update the digital display (setter), and the stadium scoreboard flashes the new number immediately.',
    codeSnippet: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    // Functional updater ensures latest state during rapid clicks
    setCount(prev => prev + 1);
  };

  return (
    <button onClick={increment}>
      Clicks: {count}
    </button>
  );
}`,
    takeaways: [
      'State updates are asynchronous and scheduled in batches to maximize rendering efficiency.',
      'Always use functional state updaters setCount(prev => prev + 1) when new state depends on previous state.',
      'State persists across re-renders for as long as the component remains mounted in the DOM tree.'
    ],
    commonPitfall: {
      mistake: 'Mutating state objects directly (e.g. user.age = 25) without creating a new reference.',
      fix: 'Always pass a new copy (e.g. setUser({ ...user, age: 25 })) so React detects the reference change.'
    },
    visualizerType: 'state',
    nextTopicId: 'controlled-uncontrolled'
  },
  {
    id: 'controlled-uncontrolled',
    title: 'Controlled vs Uncontrolled',
    category: 'fundamentals',
    difficulty: 'intermediate',
    summary: 'Controlled inputs store their current value in React state; uncontrolled inputs store value directly in the DOM.',
    mentalModel: 'The Steering Wheel: Controlled is drive-by-wire (computer controls steering); uncontrolled is a mechanical linkage directly to tires.',
    codeSnippet: `import { useState, useRef } from 'react';

// Controlled: React state is the single source of truth
function ControlledInput() {
  const [text, setText] = useState('');
  return <input value={text} onChange={e => setText(e.target.value)} />;
}

// Uncontrolled: DOM holds the value, accessed via ref
function UncontrolledInput() {
  const inputRef = useRef(null);
  const handleSubmit = () => alert(inputRef.current.value);
  return <input ref={inputRef} defaultValue="default" />;
}`,
    takeaways: [
      'Controlled components allow instant validation, masking, and dynamic disabled buttons.',
      'Uncontrolled components are useful when integrating with non-React libraries or file upload inputs.',
      'Never switch an input from uncontrolled (value=undefined) to controlled (value="str") dynamically.'
    ],
    commonPitfall: {
      mistake: 'Passing value={undefined} initially and later string, triggering React uncontrolled-to-controlled warning.',
      fix: 'Always initialize controlled input state with an empty string: useState("").'
    },
    visualizerType: 'render',
    nextTopicId: 'event-handling'
  },
  {
    id: 'event-handling',
    title: 'Event Handling',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'React wraps native browser events in SyntheticEvent objects for cross-browser consistency and unified delegation.',
    mentalModel: 'The Universal Adapter: No matter what country outlet you plug into, the adapter gives your laptop clean standard power.',
    codeSnippet: `function Form() {
  const handleSubmit = (e) => {
    e.preventDefault(); // Stop native browser page reload
    console.log('Form submitted securely!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Send</button>
    </form>
  );
}`,
    takeaways: [
      'React event names use camelCase (onClick, onSubmit, onKeyDown) instead of lowercase.',
      'Event handlers are passed as function references: onClick={handleClick}, NOT onClick={handleClick()}.',
      'React delegates event listeners to the root container rather than attaching individual listeners to every DOM node.'
    ],
    commonPitfall: {
      mistake: 'Invoking the handler immediately in JSX: onClick={handleClick()} which runs during render.',
      fix: 'Pass the function reference: onClick={handleClick} or inline arrow onClick={() => handleClick(id)}.'
    },
    visualizerType: 'render',
    nextTopicId: 'conditional-rendering'
  },
  {
    id: 'conditional-rendering',
    title: 'Conditional Rendering',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'Displaying different UI elements or components based on application state or props.',
    mentalModel: 'The Toggle Switch: Flipping the wall switch changes whether the chandelier is illuminated or dark.',
    codeSnippet: `function UserGreeting({ user, isLoading }) {
  if (isLoading) return <div>Loading account...</div>;
  
  return (
    <div>
      {user ? (
        <h2>Welcome back, {user.name}!</h2>
      ) : (
        <button>Log In</button>
      )}
      
      {/* Short-circuit rendering: */}
      {user?.isPremium && <span className="star">⭐ Premium Member</span>}
    </div>
  );
}`,
    takeaways: [
      'Use ternary operators (condition ? <A /> : <B />) for dual-branch rendering.',
      'Use logical AND (condition && <Component />) for single-branch rendering.',
      'Returning null from a component tells React to render nothing to the DOM.'
    ],
    commonPitfall: {
      mistake: 'Writing array.length && <List /> when length is 0, which renders a literal "0" text on the screen.',
      fix: 'Use boolean comparison: array.length > 0 && <List /> or Boolean(array.length) && <List />.'
    },
    visualizerType: 'render',
    nextTopicId: 'lists-keys'
  },
  {
    id: 'lists-keys',
    title: 'Lists & Keys',
    category: 'fundamentals',
    difficulty: 'beginner',
    summary: 'Keys provide unique stable identities to array elements so React can efficiently match, reorder, or delete DOM nodes.',
    mentalModel: 'The Coat Check Ticket: When retrieving your coat, the attendant uses your unique ticket ID instead of guessing your coat size by appearance.',
    codeSnippet: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className={todo.done ? 'completed' : ''}>
          <span>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}`,
    takeaways: [
      'Keys must be unique among sibling elements in the same array.',
      'Never use array indices as keys if items can be sorted, inserted, or filtered.',
      'Keys help React maintain local component state across reorders and deletions.'
    ],
    commonPitfall: {
      mistake: 'Using index as key: <li key={index}> causing input fields to retain state from wrong items upon deletion.',
      fix: 'Always use stable unique IDs from your database or data source (e.g. key={item.id}).'
    },
    visualizerType: 'fiber',
    nextTopicId: 'component-rerendering'
  },
  {
    id: 'component-rerendering',
    title: 'Component Re-rendering',
    category: 'rendering',
    difficulty: 'intermediate',
    summary: 'A re-render occurs when React calls a component function again to compute its updated Virtual DOM subtree.',
    mentalModel: 'The Refresh: Refreshing the weather dashboard repaints current temperatures without needing to rebuild the entire computer screen.',
    codeSnippet: `import { useState } from 'react';

function Parent() {
  const [count, setCount] = useState(0);
  console.log('Parent rendered');

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment: {count}</button>
      <Child />
    </div>
  );
}

function Child() {
  console.log('Child re-rendered with parent');
  return <p>Static Child Content</p>;
}`,
    takeaways: [
      'By default, when a parent component re-renders, all of its descendant children also re-render.',
      'Re-rendering is NOT the same as real DOM painting; React only touches real DOM if the output changed.',
      'State changes, prop updates, and context consumption are the 3 main triggers for re-renders.'
    ],
    commonPitfall: {
      mistake: 'Believing that re-rendering always causes slow DOM performance and over-optimizing prematurely.',
      fix: 'Re-rendering in memory is extremely fast; only optimize with memo when profiling proves bottleneck.'
    },
    visualizerType: 'render',
    nextTopicId: 'usestate-deep-dive'
  },
  {
    id: 'usestate-deep-dive',
    title: 'useState Deep Dive',
    category: 'hooks',
    difficulty: 'intermediate',
    summary: 'useState stores state in the component Fiber node linked list and provides a setter that schedules a re-render.',
    mentalModel: 'The Locker: Each useState call reserves a numbered locker in your component Fiber. React opens lockers in exact order on each render.',
    codeSnippet: `import { useState } from 'react';

function ProfileEditor() {
  // Lazy state initialization: runs only once on mount
  const [settings, setSettings] = useState(() => {
    return JSON.parse(localStorage.getItem('settings') || '{}');
  });

  const updateTheme = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
  };

  return <div>Theme: {settings.theme || 'dark'}</div>;
}`,
    takeaways: [
      'Hooks rely on strict call ordering: never call useState inside conditionals, loops, or nested functions.',
      'Use lazy state initialization useState(() => computeExpensiveValue()) for slow initial setups.',
      'State updates are batched together automatically by React 18+ inside event handlers, promises, and timeouts.'
    ],
    commonPitfall: {
      mistake: 'Calling an expensive function directly inside useState(getBigData()), executing it on every render.',
      fix: 'Pass a function reference useState(() => getBigData()) to run it only once on mount.'
    },
    visualizerType: 'hooks',
    nextTopicId: 'useeffect'
  },
  {
    id: 'useeffect',
    title: 'useEffect',
    category: 'hooks',
    difficulty: 'intermediate',
    summary: 'useEffect lets you synchronize a component with an external system (DOM, network subscriptions, timers).',
    mentalModel: 'The Satellite Dish: Whenever the satellite coordinates change (dependencies), you re-align the antenna and close the old signal.',
    codeSnippet: `import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createChatConnection(roomId);
    connection.connect();

    // Cleanup function: runs before re-running effect or unmounting
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Re-connect only when roomId changes

  return <div>Connected to room: {roomId}</div>;
}`,
    takeaways: [
      'Effects run after the browser paints the screen to avoid blocking visual rendering.',
      'The cleanup function returned by useEffect runs before the next effect run and on component unmount.',
      'Always list all reactive values (props, state) used inside the effect in the dependency array.'
    ],
    commonPitfall: {
      mistake: 'Omitting reactive variables from the dependency array, causing stale closure bugs.',
      fix: 'Include all variables read inside the effect in the dependencies array [dep1, dep2].'
    },
    visualizerType: 'hooks',
    nextTopicId: 'uselayouteffect'
  },
  {
    id: 'uselayouteffect',
    title: 'useLayoutEffect',
    category: 'hooks',
    difficulty: 'advanced',
    summary: 'useLayoutEffect fires synchronously after all DOM mutations but before the browser paints on screen.',
    mentalModel: 'The Tape Measure: You measure the exact size of a room before the interior decorator paints the wall to avoid visual flickering.',
    codeSnippet: `import { useLayoutEffect, useRef, useState } from 'react';

function Tooltip({ targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    // Measure DOM synchronously before browser repaints:
    if (ref.current) {
      setTooltipHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  return <div ref={ref} className="tooltip">Height: {tooltipHeight}px</div>;
}`,
    takeaways: [
      'Fires synchronously between DOM mutation and screen paint, preventing visual layout jumps/flickers.',
      'Blocks browser painting: keep logic minimal to prevent frame drops and UI freezes.',
      'Default to useEffect unless you are explicitly measuring layout or calculating scroll position.'
    ],
    commonPitfall: {
      mistake: 'Using useLayoutEffect for data fetching or network requests, blocking the main thread from painting.',
      fix: 'Use standard useEffect for async network operations; reserve useLayoutEffect for layout measurements.'
    },
    visualizerType: 'hooks',
    nextTopicId: 'useref'
  },
  {
    id: 'useref',
    title: 'useRef',
    category: 'hooks',
    difficulty: 'intermediate',
    summary: 'useRef creates a mutable object holding a .current property that persists across renders without triggering re-renders.',
    mentalModel: 'The Secret Notebook: You jot down phone numbers in your pocket notebook without broadcasting a public speech every time you write.',
    codeSnippet: `import { useRef } from 'react';

function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const renderCount = useRef(0);

  renderCount.current++; // Mutating ref does NOT trigger re-render!

  const onButtonClick = () => {
    // Directly focus native input node:
    inputEl.current.focus();
  };

  return (
    <div>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus Input</button>
      <p>Rendered {renderCount.current} times</p>
    </div>
  );
}`,
    takeaways: [
      'Mutating ref.current does NOT cause a component re-render.',
      'Commonly used for DOM references, storing interval IDs, and tracking previous state values.',
      'Do not read or write ref.current during JSX rendering (treat it as impure outside effects/handlers).'
    ],
    commonPitfall: {
      mistake: 'Trying to trigger a UI update by mutating myRef.current = newValue.',
      fix: 'Use useState if changing the value needs to update the rendered screen.'
    },
    visualizerType: 'hooks',
    nextTopicId: 'usememo'
  },
  {
    id: 'usememo',
    title: 'useMemo',
    category: 'hooks',
    difficulty: 'advanced',
    summary: 'useMemo caches the calculated result of an expensive calculation between renders until dependencies change.',
    mentalModel: 'The Calculator Memory: Instead of recalculating a 50-digit equation every time, you store the final answer in the calculator memory.',
    codeSnippet: `import { useMemo, useState } from 'react';

function ProductList({ products, query }) {
  // Caches filtered list; only recalculates when products or query changes
  const filteredProducts = useMemo(() => {
    console.log('Filtering 10,000 products...');
    return products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  }, [products, query]);

  return <div>Found {filteredProducts.length} items</div>;
}`,
    takeaways: [
      'Only use useMemo for truly computationally expensive operations or preserving reference equality for props.',
      'useMemo runs during rendering, so avoid side effects inside the calculation function.',
      'Overusing useMemo on trivial calculations adds memory overhead without performance benefits.'
    ],
    commonPitfall: {
      mistake: 'Wrapping basic math (e.g. const sum = useMemo(() => a + b, [a, b])) which is slower than recalculating.',
      fix: 'Only memoize heavy array transformations (1000+ items) or objects passed to memoized children.'
    },
    visualizerType: 'hooks',
    nextTopicId: 'usecallback'
  },
  {
    id: 'usecallback',
    title: 'useCallback',
    category: 'hooks',
    difficulty: 'advanced',
    summary: 'useCallback caches a function definition between renders to maintain stable reference equality.',
    mentalModel: 'The Reusable Stamp: Instead of hand-signing each document with a slightly different signature, you use a stable rubber stamp.',
    codeSnippet: `import { useCallback, useState, memo } from 'react';

const ChildButton = memo(({ onClick, label }) => {
  console.log('ChildButton rendered');
  return <button onClick={onClick}>{label}</button>;
});

function Parent() {
  const [count, setCount] = useState(0);

  // Stable function reference prevents ChildButton from re-rendering
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Rerender Parent</button>
      <ChildButton onClick={handleClick} label="Submit" />
    </div>
  );
}`,
    takeaways: [
      'useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).',
      'It is primarily useful when passing callbacks to optimized children that rely on reference equality (React.memo).',
      'Functions declared inside components are recreated on every render; useCallback prevents new references.'
    ],
    commonPitfall: {
      mistake: 'Using useCallback on functions passed to regular un-memoized DOM elements (<button onClick={fn}>).',
      fix: 'Only use useCallback when the child component is wrapped in React.memo or used in effect dependencies.'
    },
    visualizerType: 'hooks',
    nextTopicId: 'custom-hooks'
  },
  {
    id: 'custom-hooks',
    title: 'Custom Hooks',
    category: 'hooks',
    difficulty: 'intermediate',
    summary: 'Custom hooks are JavaScript functions whose names start with "use" and can call other React hooks to share stateful logic.',
    mentalModel: 'The Swiss Army Tool: You package reusable tools (knife, scissors, bottle opener) into one pocketable knife handle.',
    codeSnippet: `import { useState, useEffect } from 'react';

// Custom hook encapsulating window width listener:
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

// In component:
function ResponsiveHeader() {
  const width = useWindowWidth();
  return <header>Screen Width: {width}px ({width > 768 ? 'Desktop' : 'Mobile'})</header>;
}`,
    takeaways: [
      'Custom hooks extract and share stateful logic, NOT the state itself (each hook call gets independent state).',
      'Must follow the Rules of Hooks (name starts with "use" and called only at the top level).',
      'Great for data fetching, form handling, subscriptions, and sensor listeners.'
    ],
    commonPitfall: {
      mistake: 'Assuming two components calling useMyHook() share the same global state.',
      fix: 'Each call creates an isolated state instance; use Context API or state stores for global shared state.'
    },
    visualizerType: 'hooks',
    nextTopicId: 'rules-of-hooks'
  },
  {
    id: 'rules-of-hooks',
    title: 'Rules of Hooks',
    category: 'hooks',
    difficulty: 'intermediate',
    summary: 'Hooks must only be called at the top level of React function components or custom hooks.',
    mentalModel: 'The Assembly Line: Every car on the conveyor belt must receive parts in the exact sequential order without skipping stations.',
    codeSnippet: `// ❌ WRONG: Hook inside condition
if (isLoggedIn) {
  useEffect(() => { ... }); // Violates hook order!
}

// ✅ CORRECT: Condition inside hook
useEffect(() => {
  if (isLoggedIn) {
    // Safe and maintains hook call order!
  }
}, [isLoggedIn]);`,
    takeaways: [
      'Rule 1: Only call hooks at the top level (never in if statements, for loops, or nested functions).',
      'Rule 2: Only call hooks from React function components or custom hooks.',
      'Enforced by the eslint-plugin-react-hooks linter plugin.'
    ],
    commonPitfall: {
      mistake: 'Placing useState or useEffect after an early return statement (if (loading) return null).',
      fix: 'Move all hook invocations to the top of the component before any conditional return statements.'
    },
    visualizerType: 'hooks',
    nextTopicId: 'context-api'
  },
  {
    id: 'context-api',
    title: 'Context API',
    category: 'patterns',
    difficulty: 'intermediate',
    summary: 'Context provides a way to pass data through the component tree without manually passing props at every level.',
    mentalModel: 'The Radio Broadcast: The radio tower broadcasts music to the entire city; any house with a radio receiver tunes in directly.',
    codeSnippet: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('dark');

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
      Current Theme: {theme}
    </button>
  );
}`,
    takeaways: [
      'Avoids "prop drilling" where intermediary components pass props they never consume.',
      'Every component calling useContext(MyContext) re-renders whenever the context value changes.',
      'Split large contexts into smaller, focused contexts (e.g. AuthContext, ThemeContext) to limit re-renders.'
    ],
    commonPitfall: {
      mistake: 'Passing a new object literal value={{ a, b }} in Provider without useMemo, causing all consumers to re-render constantly.',
      fix: 'Memoize the context value: const value = useMemo(() => ({ a, b }), [a, b]).'
    },
    visualizerType: 'props',
    nextTopicId: 'prop-drilling'
  },
  {
    id: 'prop-drilling',
    title: 'Prop Drilling',
    category: 'patterns',
    difficulty: 'intermediate',
    summary: 'The anti-pattern of passing props through multiple levels of intermediate components that do not need the data.',
    mentalModel: 'The Bucket Brigade: 10 people in a line passing a bucket of water to extinguish a fire at the end of the street.',
    codeSnippet: `// ❌ Prop Drilling: Intermediate Page & Layout don't need 'user'
function App() {
  const [user, setUser] = useState({ name: 'Alex' });
  return <Layout user={user} />;
}
function Layout({ user }) { return <Sidebar user={user} />; }
function Sidebar({ user }) { return <UserProfile user={user} />; }

// ✅ Solution: Component Composition with children
function AppClean() {
  const [user, setUser] = useState({ name: 'Alex' });
  return (
    <Layout>
      <Sidebar>
        <UserProfile user={user} />
      </Sidebar>
    </Layout>
  );
}`,
    takeaways: [
      'Prop drilling creates tight coupling between intermediate layout components and deep child data.',
      'Component composition (passing JSX via children) is often cleaner than introducing global Context.',
      'Use Context API when data is truly global across widely separated branches (e.g. current user, theme, locale).'
    ],
    commonPitfall: {
      mistake: 'Reaching for complex Redux or global state libraries when simple component composition solves the drilling.',
      fix: 'Lift component instantiation up and pass prepared elements via children slots.'
    },
    visualizerType: 'props',
    nextTopicId: 'state-lifting'
  },
  {
    id: 'state-lifting',
    title: 'State Lifting',
    category: 'patterns',
    difficulty: 'intermediate',
    summary: 'Lifting state up involves moving shared state to the closest common ancestor of the components that need it.',
    mentalModel: 'The Common Bulletin Board: Instead of two roommates keeping private notes, they pin messages on the shared refrigerator door.',
    codeSnippet: `import { useState } from 'react';

function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);

  return (
    <div>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitDisplay value={(celsius * 9) / 5 + 32} />
    </div>
  );
}`,
    takeaways: [
      'When two sibling components need to synchronize, lift the state up to their common parent.',
      'Parent passes down the state value to one child and the update callback to the other child.',
      'Maintains a single source of truth in the component hierarchy.'
    ],
    commonPitfall: {
      mistake: 'Duplicating the same state in both sibling components and trying to synchronize them with useEffect.',
      fix: 'Delete local duplicate state and lift a single state variable to their closest common parent.'
    },
    visualizerType: 'props',
    nextTopicId: 'reconciliation-algorithm'
  },
  {
    id: 'reconciliation-algorithm',
    title: 'Reconciliation',
    category: 'internals',
    difficulty: 'advanced',
    summary: 'The diffing algorithm React uses to compare the old and new Virtual DOM trees and calculate minimal DOM updates.',
    mentalModel: 'Spot the Difference: Comparing two nearly identical cartoon panels and marking only the 2 altered pixels with red ink.',
    codeSnippet: `// Case 1: Same element type -> React updates only changed attributes
// <div className="before" title="stuff" /> -> <div className="after" title="stuff" />
// Real DOM: element.className = 'after';

// Case 2: Different element types -> React destroys and remounts subtree
// <div><Counter /></div> -> <span><Counter /></span>
// Real DOM: Counter is unmounted and remounted with fresh state!`,
    takeaways: [
      'Two elements of different types will produce completely different trees (full teardown & remount).',
      'The developer can hint at which child elements are stable across renders using the key prop.',
      'Reconciliation achieves O(n) linear complexity using structural heuristic assumptions.'
    ],
    commonPitfall: {
      mistake: 'Changing component element wrappers dynamically (e.g. from <div> to <section>), losing all child state.',
      fix: 'Keep component root element types consistent to preserve child instance state.'
    },
    visualizerType: 'fiber',
    nextTopicId: 'fiber-architecture'
  },
  {
    id: 'fiber-architecture',
    title: 'Fiber Architecture',
    category: 'internals',
    difficulty: 'advanced',
    summary: 'React Fiber is the complete rewrite of the core reconciliation engine, enabling incremental rendering and priority-based scheduling.',
    mentalModel: 'The Smart Task Manager: Instead of blocking the whole computer until a 1-hour video finishes exporting, it processes frames in background chunks.',
    codeSnippet: `// Fiber node internal representation (simplified):
const fiberNode = {
  type: 'button',
  key: null,
  stateNode: HTMLButtonElement,
  child: FiberNode,      // First child
  sibling: FiberNode,    // Next sibling
  return: FiberNode,     // Parent fiber
  memoizedState: null,   // Hook linked list
  pendingProps: {},
  flags: 0               // Mutation effect flags (Placement, Update, Deletion)
};`,
    takeaways: [
      'Fiber transforms reconciliation from recursive stack execution into an interruptible linked list traversal.',
      'Work is split into small units called "Fiber nodes" that can be paused, prioritized, or aborted.',
      'Separates work into two phases: Render Phase (asynchronous/interruptible) and Commit Phase (synchronous DOM mutations).'
    ],
    commonPitfall: {
      mistake: 'Assuming render phase code will only execute once per visual screen update.',
      fix: 'Keep render functions strictly pure because concurrent Fiber can abort and restart renders.'
    },
    visualizerType: 'fiber',
    nextTopicId: 'render-vs-commit'
  },
  {
    id: 'render-vs-commit',
    title: 'Render vs Commit',
    category: 'rendering',
    difficulty: 'advanced',
    summary: 'Render phase computes Virtual DOM diffs without side effects; Commit phase applies changes to the real DOM synchronously.',
    mentalModel: 'The Architect vs The Builder: The architect drafts blueprints in their office (Render Phase); the construction crew pours concrete on site (Commit Phase).',
    codeSnippet: `function LifecycleExample() {
  // 1. RENDER PHASE (Pure, no side-effects):
  // React calls this function to compute JSX output.
  const vdom = <h1>Title</h1>;

  // 2. COMMIT PHASE (Side-effects applied):
  // React updates real browser DOM <h1>Title</h1>.

  // 3. POST-COMMIT (Effects run):
  useEffect(() => {
    console.log('DOM is updated and painted!');
  });

  return vdom;
}`,
    takeaways: [
      'Render Phase: Calls component functions, evaluates JSX, and computes diffs. Can be paused/restarted by React.',
      'Commit Phase: Fast synchronous phase where React updates native DOM nodes and refs.',
      'Side effects (HTTP requests, timers, DOM mutations) must NEVER happen in the render phase.'
    ],
    commonPitfall: {
      mistake: 'Triggering side effects (e.g. fetch() or modifying global variables) directly in the body of a component.',
      fix: 'Move all side effects into useEffect or event handlers to ensure they run post-commit.'
    },
    visualizerType: 'render',
    nextTopicId: 'batching-updates'
  },
  {
    id: 'batching-updates',
    title: 'Batching Updates',
    category: 'internals',
    difficulty: 'advanced',
    summary: 'React groups multiple state updates into a single re-render to optimize performance and prevent unnecessary repaints.',
    mentalModel: 'The Restaurant Waiter: The waiter takes drink, appetizer, and main dish orders together to make one trip to the kitchen.',
    codeSnippet: `import { useState } from 'react';

function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    // In React 18+, both updates are automatically batched into 1 render:
    setCount(c => c + 1);
    setFlag(f => !f);
    // Component only re-renders ONCE!
  };

  return <button onClick={handleClick}>Batch Update</button>;
}`,
    takeaways: [
      'Automatic batching in React 18+ applies across event handlers, setTimeout, promises, and native event listeners.',
      'Batching drastically reduces frame rate drops and duplicate layout calculations.',
      'If you ever require synchronous flushing, you can use ReactDOM.flushSync() (use sparingly).'
    ],
    commonPitfall: {
      mistake: 'Expecting state variable value to update synchronously on the very next line of code.',
      fix: 'Remember that state updates are batched; read the updated value in the next render or useEffect.'
    },
    visualizerType: 'render',
    nextTopicId: 'performance-bottlenecks'
  },
  {
    id: 'performance-bottlenecks',
    title: 'Performance Bottlenecks',
    category: 'performance',
    difficulty: 'advanced',
    summary: 'Identifying and diagnosing common React performance issues including wasted renders, heavy computations, and memory leaks.',
    mentalModel: 'The Clogged Pipe: When water drains slowly, inspect where hair is tangled rather than replacing the whole municipal water system.',
    codeSnippet: `// Diagnosing wasted re-renders using React DevTools Profiler:
// 1. Open React DevTools -> Profiler tab
// 2. Check "Record why each component rendered"
// 3. Inspect flamegraph to identify long render durations (>16ms)`,
    takeaways: [
      'Use the React DevTools Profiler to measure component render times and see why components re-rendered.',
      'Look out for non-primitive inline props (objects, functions, arrays) created inside render.',
      'Virtualize long lists using react-window or tanstack-virtual to render only visible viewport items.'
    ],
    commonPitfall: {
      mistake: 'Applying React.memo blindly to every component without measuring.',
      fix: 'Profile first: memoization carries a comparison cost that can be slower than lightweight component renders.'
    },
    visualizerType: 'render',
    nextTopicId: 'memoization-strategies'
  },
  {
    id: 'memoization-strategies',
    title: 'Memoization Strategies',
    category: 'performance',
    difficulty: 'advanced',
    summary: 'Strategic use of React.memo, useMemo, and useCallback to preserve reference stability and prevent redundant render cascades.',
    mentalModel: 'The Speed Pass: If your passport details haven\'t changed since yesterday, the express gate lets you pass through without a full interview.',
    codeSnippet: `import { memo, useMemo, useCallback, useState } from 'react';

// Memoized child component:
const ExpensiveChart = memo(function ExpensiveChart({ data, onSelect }) {
  console.log('Rendering heavy chart canvas...');
  return <canvas />;
});

function Dashboard() {
  const [filter, setFilter] = useState('all');

  // Stable reference:
  const chartData = useMemo(() => generateChartData(filter), [filter]);
  const handleSelect = useCallback((item) => console.log(item), []);

  return <ExpensiveChart data={chartData} onSelect={handleSelect} />;
}`,
    takeaways: [
      'React.memo wraps a component to skip re-rendering if its props are shallowly equal.',
      'Pair React.memo with useMemo (for objects/arrays) and useCallback (for functions).',
      'If props change on every render, React.memo is wasted work.'
    ],
    commonPitfall: {
      mistake: 'Using React.memo on a child while passing an inline arrow function <Child onClick={() => {}} />.',
      fix: 'Wrap the callback in useCallback so the function reference remains identical between renders.'
    },
    visualizerType: 'hooks',
    nextTopicId: 'error-boundaries'
  },
  {
    id: 'error-boundaries',
    title: 'Error Boundaries',
    category: 'patterns',
    difficulty: 'advanced',
    summary: 'Error boundaries are components that catch JavaScript errors anywhere in their child component tree and display a fallback UI.',
    mentalModel: 'The Circuit Breaker: When a toaster short-circuits in the kitchen, the breaker trips to protect the entire house from losing power.',
    codeSnippet: `import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Logged to Sentry:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-card">⚠️ Something went wrong in this widget.</div>;
    }
    return this.props.children;
  }
}`,
    takeaways: [
      'Error boundaries catch errors during rendering, lifecycle methods, and constructors of child trees.',
      'They do NOT catch errors inside async callbacks (fetch/setTimeout) or event handlers (use try/catch there).',
      'Wrap discrete features (e.g. sidebar, feed, chat) in separate boundaries so one failure does not crash the entire app.'
    ],
    commonPitfall: {
      mistake: 'Expecting Error Boundary to catch errors inside async event handlers (e.g. onClick).',
      fix: 'Use regular try/catch blocks inside async event handlers.'
    },
    visualizerType: 'render',
    nextTopicId: 'code-splitting-lazy'
  },
  {
    id: 'code-splitting-lazy',
    title: 'Code Splitting',
    category: 'patterns',
    difficulty: 'advanced',
    summary: 'Code splitting splits the application bundle into smaller chunks loaded on demand using React.lazy and dynamic imports.',
    mentalModel: 'The Just-In-Time Supply Chain: Instead of delivering 50 tons of brick on day 1, trucks deliver roof tiles only when the roof is ready.',
    codeSnippet: `import { lazy, Suspense } from 'react';

// Dynamically imported bundle chunk:
const HeavyDashboardChart = lazy(() => import('./HeavyDashboardChart'));

function AnalyticsPage() {
  return (
    <div>
      <h1>Analytics</h1>
      <Suspense fallback={<div className="skeleton">Loading chart engine...</div>}>
        <HeavyDashboardChart />
      </Suspense>
    </div>
  );
}`,
    takeaways: [
      'React.lazy takes a function that calls a dynamic import() and returns a component.',
      'Always wrap lazy components in a <Suspense fallback={<Loader />}> boundary.',
      'Great for heavy modal dialogs, complex charting libraries, and route-based code splitting.'
    ],
    commonPitfall: {
      mistake: 'Declaring React.lazy(() => import(...)) inside a component function body.',
      fix: 'Always declare lazy components at the top level of the file module.'
    },
    visualizerType: 'render',
    nextTopicId: 'suspense'
  },
  {
    id: 'suspense',
    title: 'Suspense',
    category: 'concurrent',
    difficulty: 'expert',
    summary: 'Suspense lets components suspend rendering while waiting for asynchronous operations (code splitting, data fetching, streaming).',
    mentalModel: 'The Theater Curtain: The stage crew arranges the set behind a decorative curtain (fallback) before revealing the live scene.',
    codeSnippet: `import { Suspense, use } from 'react';

// In React 19, use() can unwrap promises directly in render:
function UserProfile({ userPromise }) {
  const user = use(userPromise);
  return <h2>{user.name} ({user.email})</h2>;
}

function Page({ userPromise }) {
  return (
    <Suspense fallback={<p>Fetching user details...</p>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}`,
    takeaways: [
      'Suspense coordinates async loading states declaratively without manual if (isLoading) boilerplate.',
      'Supports nested fallbacks: granular loaders display as individual components resolve.',
      'In React 19, the use() hook allows unwrapping promises directly inside components wrapped in Suspense.'
    ],
    commonPitfall: {
      mistake: 'Forgetting to handle promise errors when using Suspense for data fetching.',
      fix: 'Always combine Suspense with an Error Boundary to catch network failures cleanly.'
    },
    visualizerType: 'render',
    nextTopicId: 'concurrent-rendering'
  },
  {
    id: 'concurrent-rendering',
    title: 'Concurrent Rendering',
    category: 'concurrent',
    difficulty: 'expert',
    summary: 'Concurrent React can prepare multiple versions of the UI simultaneously and interrupt background renders for urgent user input.',
    mentalModel: 'The Master Chef with Multiple Burners: While simmering a 2-hour stew on low heat, the chef pauses instantly to flip a sizzling steak before it burns.',
    codeSnippet: `import { useState, useTransition } from 'react';

function SearchFilter() {
  const [query, setQuery] = useState('');
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // 1. Urgent update: typing input stays buttery smooth (60 FPS)
    setQuery(e.target.value);

    // 2. Non-urgent background transition: can be interrupted
    startTransition(() => {
      setList(filterHeavy100kList(e.target.value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>Filtering database...</span>}
      <ResultsList items={list} />
    </div>
  );
}`,
    takeaways: [
      'useTransition marks state updates as non-urgent transitions that yield to user keystrokes and clicks.',
      'useDeferredValue defers re-rendering a heavy subtree until urgent updates complete.',
      'Eliminates UI freezing without needing manual debounce timers.'
    ],
    commonPitfall: {
      mistake: 'Wrapping text input value updates in startTransition, making the input feel laggy and delayed.',
      fix: 'Keep the text input state urgent; only wrap the resulting heavy filtered list computation in startTransition.'
    },
    visualizerType: 'fiber',
    nextTopicId: 'server-components'
  },
  {
    id: 'server-components',
    title: 'Server Components',
    category: 'patterns',
    difficulty: 'expert',
    summary: 'React Server Components (RSC) execute exclusively on the server, streaming zero client JavaScript bundle size to the browser.',
    mentalModel: 'The Remote Cloud Kitchen: Meals are cooked and assembled in a centralized industrial kitchen, delivering ready-to-eat hot dishes straight to your door.',
    codeSnippet: `// Server Component (runs ONLY on server, 0 KB client JS):
import db from '@/lib/db';

export default async function ProductPage({ id }) {
  // Direct database query without API routes or useEffect:
  const product = await db.products.findById(id);

  return (
    <div className="product">
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {/* Client Component leaf for interactivity: */}
      <AddToCartButton productId={product.id} />
    </div>
  );
}`,
    takeaways: [
      'Server Components have direct access to backend resources (databases, file systems, internal microservices).',
      'Their code and heavy dependencies (markdown parsers, date formatters) never download to the client browser.',
      'Client components are imported at the interactive leaf nodes using the "use client" directive.'
    ],
    commonPitfall: {
      mistake: 'Trying to use React state (useState) or browser events (onClick) inside a Server Component.',
      fix: 'Extract interactive controls into a separate file with the "use client" directive at the top.'
    },
    visualizerType: 'props',
    nextTopicId: 'scheduler-internals'
  },
  {
    id: 'scheduler-internals',
    title: 'The Scheduler',
    category: 'internals',
    difficulty: 'expert',
    summary: 'The React Scheduler coordinates all tasks based on priority levels, utilizing MessageChannel and cooperative yielding.',
    mentalModel: 'Air Traffic Control: Emergency landings (user clicks) get immediate runway priority over scheduled cargo freight (background pre-fetching).',
    codeSnippet: `// React Scheduler Priority Lanes:
// 1. SyncLane: Synchronous urgent work (discrete user interactions, flushSync)
// 2. InputContinuousLane: Continuous events (drag, mousemove, scroll)
// 3. DefaultLane: Normal state updates (useState, data fetching)
// 4. TransitionLane: Transitions (startTransition, useDeferredValue)
// 5. IdleLane: Background speculative work`,
    takeaways: [
      'The Scheduler uses requestPostMessage / MessageChannel to yield execution back to the browser event loop every 5ms.',
      'Prevents long-running JavaScript execution from dropping frames or causing browser unresponsiveness.',
      'Higher priority tasks interrupt lower priority render work and resume them later.'
    ],
    commonPitfall: {
      mistake: 'Running synchronous blocking for-loops (e.g. 500ms math) on the main thread, bypassing Scheduler yielding.',
      fix: 'Offload heavy pure calculations to Web Workers or chunk updates using startTransition.'
    },
    visualizerType: 'render'
  }
];

const fileContent = `export type Category = 'fundamentals' | 'rendering' | 'hooks' | 'internals' | 'performance' | 'patterns' | 'concurrent';

export interface Topic {
  id: string;
  title: string;
  category: Category;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  visualizerType: 'render' | 'fiber' | 'hooks' | 'props' | 'state';
  nextTopicId?: string;
}

export const TOPICS: Topic[] = ${JSON.stringify(topicsData, null, 2)};
`;

fs.writeFileSync(
  path.join(__dirname, '../src/components/visualizers/reactcosmos/data/topics.ts'),
  fileContent,
  'utf8'
);
console.log('Successfully generated all 35 rich React topics!');
