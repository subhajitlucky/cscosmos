export interface TsFlashcard {
  id: string;
  category: 'Foundations' | 'Generics' | 'Advanced Types' | 'Compiler & Architecture';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const TS_FLASHCARDS: TsFlashcard[] = [
  {
    id: 'fc-1',
    category: 'Foundations',
    difficulty: 'Junior',
    question: 'What is the fundamental difference between type and interface in TypeScript?',
    answer: 'Interfaces can be declaration-merged and are primarily intended for defining object shapes. Type aliases can define unions, primitives, tuples, mapped types, and complex conditional types, but cannot be reopened/merged.',
    code: `// Interface can merge:
interface User { name: string; }
interface User { age: number; } // Merged!

// Type cannot merge:
type ID = string | number; // Unions only possible with type`,
    tip: 'Default to interface for public API object contracts and React component props; use type for unions and type transformations.'
  },
  {
    id: 'fc-2',
    category: 'Foundations',
    difficulty: 'Junior',
    question: 'Why should you prefer "unknown" over "any"?',
    answer: '"any" disables all compile-time type checking and allows accessing arbitrary properties. "unknown" is the type-safe Top Type—you cannot call methods, read properties, or pass it to typed functions without first performing type narrowing.',
    code: `let u: unknown = 'hello';
// u.toUpperCase(); // ❌ Compiler Error!
if (typeof u === 'string') {
  u.toUpperCase(); // ✅ Safe after narrowing
}`,
    tip: 'Always type external inputs (JSON.parse, API responses, user inputs) as unknown.'
  },
  {
    id: 'fc-3',
    category: 'Advanced Types',
    difficulty: 'Mid',
    question: 'How does the "satisfies" operator (TS 4.9+) differ from a standard type annotation?',
    answer: 'A type annotation widens values to the declared type (losing exact literal and tuple types). The "satisfies" operator verifies that an object conforms to a type contract WITHOUT widening its inferred literal types.',
    code: `// Type Annotation (widens value):
const c1: Record<string, string | number[]> = { red: '#f00' };
// c1.red.toUpperCase(); // ❌ Error: toUpperCase not on number[]!

// Satisfies (preserves literal type):
const c2 = { red: '#f00' } satisfies Record<string, string | number[]>;
c2.red.toUpperCase(); // ✅ Valid! Inferred as string`,
    tip: 'Use satisfies for configurations and theme palettes where you want strict keys without losing property inference.'
  },
  {
    id: 'fc-4',
    category: 'Generics',
    difficulty: 'Mid',
    question: 'What does the "keyof" operator do?',
    answer: '"keyof T" takes an object type T and produces a union of its string and numeric literal property names.',
    code: `interface Person { id: number; name: string; }
type PersonKeys = keyof Person; // "id" | "name"

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
    tip: 'Combine keyof with typeof to extract keys directly from runtime JS objects: keyof typeof myObject.'
  },
  {
    id: 'fc-5',
    category: 'Advanced Types',
    difficulty: 'Senior',
    question: 'Explain Distributive Conditional Types and how to prevent unwanted distribution.',
    answer: 'When a generic type parameter T is naked in a conditional type (T extends U ? X : Y), it automatically distributes over union members (e.g. (A | B) extends U => (A extends U) | (B extends U)). To disable distribution, wrap both sides in square brackets: [T] extends [U].',
    code: `type ToArray<T> = T extends any ? T[] : never;
type StrOrNumArr = ToArray<string | number>; // string[] | number[] (Distributed)

type NonDistributive<T> = [T] extends [any] ? T[] : never;
type MixedArr = NonDistributive<string | number>; // (string | number)[]`,
    tip: 'Distributive conditional types are the fundamental engine powering built-in Exclude<T, U> and Extract<T, U>.'
  },
  {
    id: 'fc-6',
    category: 'Advanced Types',
    difficulty: 'Senior',
    question: 'What is Nominal Typing and how can it be simulated in TypeScript using Branded Types?',
    answer: 'TypeScript is structural by default (two types with the same shape are interchangeable). Nominal typing distinguishes types by their name. In TS, you can attach a unique symbol brand to primitives to prevent accidental substitution (e.g. USD vs EUR).',
    code: `declare const brand: unique symbol;
type USD = number & { readonly [brand]: 'USD' };
type EUR = number & { readonly [brand]: 'EUR' };

const payUSD = (amount: USD) => {};
// payUSD(100 as EUR); // ❌ Compile Error!`,
    tip: 'Use branded types for database entity IDs (UserId vs PostId) and physics/currency units.'
  },
  {
    id: 'fc-7',
    category: 'Compiler & Architecture',
    difficulty: 'Staff',
    question: 'What is Function Parameter Contravariance and why does TypeScript enforce it?',
    answer: 'Return types are Covariant (a function returning Dog can be assigned to a function returning Animal). Parameter types are Contravariant (a function accepting Animal can be assigned to a function accepting Dog, because it can handle any Animal).',
    code: `class Animal { name = 'Animal'; }
class Dog extends Animal { bark() {} }

type AnimalHandler = (a: Animal) => void;
type DogHandler = (d: Dog) => void;

// Safe Contravariance:
let handleDog: DogHandler = (a: Animal) => console.log(a.name); // ✅ Safe!`,
    tip: 'Use property signatures fn: (x: T) => void instead of method signatures fn(x: T): void to enable strict function type checking.'
  },
  {
    id: 'fc-8',
    category: 'Compiler & Architecture',
    difficulty: 'Senior',
    question: 'What does "moduleResolution": "bundler" in tsconfig do?',
    answer: 'Introduced in TS 5.0, "bundler" instructs the TypeScript compiler to resolve imports exactly like modern bundlers (Vite, Next.js, Webpack, esbuild), supporting package.json "exports" subpaths and extensionless imports without enforcing strict Node.js CJS/ESM extension rules.',
    code: `// tsconfig.json:
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true
  }
}`,
    tip: 'Always use moduleResolution: "bundler" for modern Next.js 15 and Vite frontend applications.'
  }
];
