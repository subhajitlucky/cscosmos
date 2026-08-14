export interface CheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    code: string;
  }[];
}

export const TS_CHEATSHEET: CheatSheetSection[] = [
  {
    id: 'primitives-unions',
    title: 'Primitives, Unions & Narrowing',
    category: 'Core Syntax',
    snippets: [
      {
        title: 'Discriminated Union Pattern',
        description: 'Exhaustive state pattern with tag property',
        code: `type NetworkState = 
  | { status: 'loading' }
  | { status: 'success'; data: string[] }
  | { status: 'error'; error: Error };

function render(state: NetworkState) {
  switch (state.status) {
    case 'loading': return '...';
    case 'success': return state.data.join(', ');
    case 'error': return state.error.message;
  }
}`
      },
      {
        title: 'Custom Type Predicate Guard',
        description: 'Teach compiler custom runtime check',
        code: `function isDefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

const list = [1, null, 2, undefined, 3];
const cleanList: number[] = list.filter(isDefined); // number[]`
      }
    ]
  },
  {
    id: 'generics-patterns',
    title: 'Generics & Constraints',
    category: 'Generics',
    snippets: [
      {
        title: 'Const Type Parameter (<const T>) (TS 5.0+)',
        description: 'Auto-infer literal tuples and objects without as const',
        code: `function makeRoutes<const T extends readonly string[]>(routes: T): T {
  return routes;
}
const routes = makeRoutes(['/home', '/about']); // readonly ["/home", "/about"]`
      },
      {
        title: 'keyof typeof Indexer',
        description: 'Type-safe object property getter',
        code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`
      }
    ]
  },
  {
    id: 'advanced-transformations',
    title: 'Advanced Type Gymnastics',
    category: 'Advanced Types',
    snippets: [
      {
        title: 'Template Literal Type Builder',
        description: 'Generate string pattern unions',
        code: `type Event = 'click' | 'focus';
type EventHandler = \`on\${Capitalize<Event>}\`; // "onClick" | "onFocus"`
      },
      {
        title: 'Unpack Promise (infer)',
        description: 'Extract internal resolved type of Promise',
        code: `type Unpack<T> = T extends Promise<infer U> ? U : T;
type Post = Unpack<Promise<{ id: number; title: string }>>; // { id: number; title: string }`
      }
    ]
  },
  {
    id: 'react-ts',
    title: 'React 19 & TypeScript Patterns',
    category: 'React & TS',
    snippets: [
      {
        title: 'Component Props with Children',
        description: 'Clean typed props interface',
        code: `import { ReactNode } from 'react';

interface CardProps {
  title: string;
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function Card({ title, variant = 'primary', children }: CardProps) {
  return <div className={variant}><h3>{title}</h3>{children}</div>;
}`
      },
      {
        title: 'Typed Event Handler',
        description: 'Typing native input change and form events',
        code: `import { ChangeEvent, FormEvent } from 'react';

function Form() {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return <form onSubmit={handleSubmit}><input onChange={handleChange} /></form>;
}`
      }
    ]
  }
];
