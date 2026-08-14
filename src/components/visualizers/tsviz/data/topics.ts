export interface TsTopic {
  id: string;
  title: string;
  category: 'foundations' | 'types' | 'generics' | 'advanced' | 'compiler';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const TS_TOPICS: TsTopic[] = [
  {
    id: 'structural-typing',
    title: 'Structural Typing & Duck Typing',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'TypeScript uses structural subtyping: two types are compatible if they share the same shape, regardless of declared names.',
    mentalModel: 'The Shape Sorter: If an object has circular pegs with radius 5, it fits into the round slot regardless of whether the wood is painted oak or pine.',
    codeSnippet: `interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function printCoordinates(pt: Point2D) {
  console.log(\`X: \${pt.x}, Y: \${pt.y}\`);
}

const point3D: Point3D = { x: 10, y: 20, z: 30 };
// Valid! Point3D has all required properties of Point2D:
printCoordinates(point3D);`,
    takeaways: [
      'Structural compatibility checks member shapes, not nominal class/interface declaration names.',
      'Objects can have excess properties when assigned through intermediate variables.',
      'Allows seamless interop with existing dynamic JavaScript libraries.'
    ],
    commonPitfall: {
      mistake: 'Directly passing object literals with excess properties: printCoordinates({ x: 1, y: 2, z: 3 }) triggers excess property error.',
      fix: 'Assign to a variable first or declare an open index signature if extra keys are expected.'
    },
    nextTopicId: 'type-inference'
  },
  {
    id: 'type-inference',
    title: 'Type Inference & Contextual Typing',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'The TypeScript compiler automatically deduces types from variable assignments, return values, and context without manual annotations.',
    mentalModel: 'The Detective: Looking at footprints in the snow (variable values), the detective knows an elk walked by without needing a label tagged on its antlers.',
    codeSnippet: `// Inferred as number:
let score = 42;

// Inferred as string[]:
const tags = ['typescript', 'react', 'nextjs'];

// Contextual typing infers 'e' as MouseEvent automatically:
window.addEventListener('click', (e) => {
  console.log(e.clientX, e.clientY);
});`,
    takeaways: [
      'Avoid redundant annotations: write let x = 5 instead of let x: number = 5.',
      'Contextual typing uses the location of an expression (like callback arguments) to infer parameter types.',
      'Use "as const" assertions to narrow inferred types to literal primitives or readonly tuples.'
    ],
    commonPitfall: {
      mistake: 'Over-annotating every single local variable with explicit types, making code noisy and brittle.',
      fix: 'Let TypeScript infer types wherever possible; annotate public function parameters and module return contracts.'
    },
    nextTopicId: 'unions-intersections'
  },
  {
    id: 'unions-intersections',
    title: 'Unions & Intersections',
    category: 'types',
    difficulty: 'Beginner',
    summary: 'Unions (|) represent values that can be one of several types; Intersections (&) combine multiple types into a single unified type.',
    mentalModel: 'Venn Diagrams: Union (A | B) is anything inside circle A or circle B; Intersection (A & B) is the overlapping region possessing traits of both.',
    codeSnippet: `// Union: Can be string OR number
type ID = string | number;

interface HasName {
  name: string;
}
interface HasAge {
  age: number;
}

// Intersection: Must have BOTH name AND age
type Person = HasName & HasAge;

const user: Person = {
  name: 'Alex',
  age: 28
};`,
    takeaways: [
      'Union types only allow access to properties common to ALL member types before narrowing.',
      'Intersections combine fields; intersecting incompatible primitives (string & number) produces "never".',
      'Combine unions with literal discriminants for bulletproof pattern matching.'
    ],
    commonPitfall: {
      mistake: 'Trying to access a specific member property on an un-narrowed union (e.g. animal.bark when animal is Dog | Cat).',
      fix: 'Narrow the union using "if (\'bark\' in animal)" or type discriminants.'
    },
    nextTopicId: 'discriminated-unions'
  },
  {
    id: 'discriminated-unions',
    title: 'Discriminated Unions',
    category: 'types',
    difficulty: 'Intermediate',
    summary: 'A pattern combining union types with a shared literal tag property (discriminant) for exhaustive pattern matching.',
    mentalModel: 'The Color-Coded Passports: Security guards inspect the passport cover color ("type: \'EU\'" vs "type: \'US\'") to direct travelers into the exact designated terminal.',
    codeSnippet: `interface LoadingState {
  status: 'loading';
}
interface SuccessState {
  status: 'success';
  data: string[];
}
interface ErrorState {
  status: 'error';
  error: Error;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

function render(state: AsyncState) {
  switch (state.status) {
    case 'loading':
      return 'Loading spinner...';
    case 'success':
      return \`Data: \${state.data.join(', ')}\`; // TypeScript knows .data exists!
    case 'error':
      return \`Failed: \${state.error.message}\`;
  }
}`,
    takeaways: [
      'Use a common literal property (e.g. type, kind, status) across all union members.',
      'Switch/case statements automatically narrow the type inside each case branch.',
      'Add a default: assertNever(state) branch to guarantee compile-time exhaustiveness checking.'
    ],
    commonPitfall: {
      mistake: 'Using optional properties ({ status?: string, data?: any }) leading to runtime undefined bugs.',
      fix: 'Model state transitions as discrete discriminated union interfaces.'
    },
    nextTopicId: 'type-narrowing'
  },
  {
    id: 'type-narrowing',
    title: 'Type Narrowing & Control Flow Analysis',
    category: 'types',
    difficulty: 'Intermediate',
    summary: 'Control Flow Analysis (CFA) narrows broad types into specific types as execution branches through conditions and type guards.',
    mentalModel: 'The Sieve: As liquid passes through increasingly fine mesh filters, large pebbles (broad types) are separated until only pure sand (exact type) remains.',
    codeSnippet: `function formatValue(val: string | number | Date) {
  if (typeof val === 'string') {
    return val.toUpperCase(); // Inferred as string
  }
  if (typeof val === 'number') {
    return val.toFixed(2); // Inferred as number
  }
  return val.toISOString(); // Inferred as Date
}`,
    takeaways: [
      'Narrow with: typeof, instanceof, in operator, equality checks (===), and custom predicates (x is T).',
      'The "never" type represents unreachable code when all possible union branches have been exhausted.',
      'Control Flow Analysis tracks mutations across code blocks and loops.'
    ],
    commonPitfall: {
      mistake: 'Checking typeof null === "object", which incorrectly identifies null as a plain object.',
      fix: 'Check for truthiness: if (val && typeof val === "object").'
    },
    nextTopicId: 'generics-basics'
  },
  {
    id: 'generics-basics',
    title: 'Generics & Type Parameters',
    category: 'generics',
    difficulty: 'Intermediate',
    summary: 'Generics allow creating reusable components and functions that work across a variety of types while preserving complete type safety.',
    mentalModel: 'The Shipping Container: The container has standard dimensions to travel on trains and ships, but safely carries cars, electronics, or grain inside without losing identity.',
    codeSnippet: `function identity<T>(arg: T): T {
  return arg;
}

const str = identity('hello'); // Inferred as identity<string>
const num = identity(42);      // Inferred as identity<number>

interface ApiResponse<TData> {
  status: number;
  payload: TData;
}

type UserResponse = ApiResponse<{ id: string; name: string }>;`,
    takeaways: [
      'Type parameters (e.g. <T>) act like function arguments for types.',
      'Preserves exact relationship between input arguments and return value types.',
      'TypeScript can automatically infer generic type arguments from function calls.'
    ],
    commonPitfall: {
      mistake: 'Using "any" instead of generic type parameters, throwing away compiler safety.',
      fix: 'Use <T> to let callers determine the specific type while maintaining type flow.'
    },
    nextTopicId: 'generic-constraints'
  },
  {
    id: 'generic-constraints',
    title: 'Generic Constraints & keyof',
    category: 'generics',
    difficulty: 'Intermediate',
    summary: 'Generic constraints limit what types can be passed to a type parameter using the "extends" and "keyof" keywords.',
    mentalModel: 'The Bouncer with a Dress Code: The club accepts anyone (<T>), but only if they are wearing formal shoes (T extends HasShoes).',
    codeSnippet: `// T must have a .length property:
function logLength<T extends { length: number }>(item: T): number {
  return item.length;
}

logLength('hello');   // ✅ string has length
logLength([1, 2, 3]); // ✅ array has length
// logLength(123);    // ❌ Error: number has no length

// Safe property getter using keyof:
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
    takeaways: [
      '<T extends BaseType> enforces that T satisfies the structural requirements of BaseType.',
      'keyof T produces a union of all property keys belonging to type T.',
      'Prevents runtime undefined property access errors at compile time.'
    ],
    commonPitfall: {
      mistake: 'Using T[keyof T] when a specific key is required, returning a broad union of all values.',
      fix: 'Use a second constrained generic parameter <T, K extends keyof T>(obj: T, key: K): T[K].'
    },
    nextTopicId: 'conditional-types'
  },
  {
    id: 'conditional-types',
    title: 'Conditional Types & infer',
    category: 'advanced',
    difficulty: 'Advanced',
    summary: 'Conditional types choose one of two possible types based on a relationship test expressed as an extends check (T extends U ? X : Y).',
    mentalModel: 'The Ternary Logic Gate: If the incoming voltage (T) matches the high threshold (U), route to Output A; otherwise route to Output B.',
    codeSnippet: `// Basic conditional type:
type IsString<T> = T extends string ? 'Yes' : 'No';
type A = IsString<'hello'>; // 'Yes'
type B = IsString<123>;     // 'No'

// Unwrapping Promise using infer:
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type User = UnpackPromise<Promise<{ name: string }>>; // { name: string }`,
    takeaways: [
      'Syntax: SomeType extends OtherType ? TrueType : FalseType.',
      'The "infer" keyword introduces a type variable within the condition to deduce unwrapped types.',
      'Distributive over naked union types (e.g. (A | B) extends U ? X : Y resolves to (A extends U) | (B extends U)).'
    ],
    commonPitfall: {
      mistake: 'Forgetting that conditional types distribute over union types when the generic parameter is un-bracketed.',
      fix: 'Wrap type in brackets [T] extends [U] to disable unwanted union distribution.'
    },
    nextTopicId: 'mapped-types'
  },
  {
    id: 'mapped-types',
    title: 'Mapped Types & Key Remapping',
    category: 'advanced',
    difficulty: 'Advanced',
    summary: 'Mapped types create new object types by transforming properties of an existing type using the "in keyof" syntax.',
    mentalModel: 'The Cookie Press: Taking a set of property names and stamping each with new modifiers (readonly, optional, or transformed key names).',
    codeSnippet: `interface User {
  id: string;
  name: string;
  age: number;
}

// Make all properties optional:
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Key remapping with 'as' and Template Literals:
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type UserGetters = Getters<User>;
// Result: { getId: () => string; getName: () => string; getAge: () => number; }`,
    takeaways: [
      'Mapped types iterate over keys using [K in UnionKeys]: ValueType.',
      'Modifiers like +readonly, -readonly, +?, and -? add or strip constraints.',
      'Key remapping using "as" enables dynamic renaming, filtering, and template literal transformations.'
    ],
    commonPitfall: {
      mistake: 'Applying mapped types directly on union types instead of object key unions.',
      fix: 'Use [K in keyof T] or constrain T extends Record<string, any>.'
    },
    nextTopicId: 'template-literal-types'
  },
  {
    id: 'template-literal-types',
    title: 'Template Literal Types',
    category: 'advanced',
    difficulty: 'Advanced',
    summary: 'Template literal types build string types via template literal syntax, creating powerful string pattern combinations.',
    mentalModel: 'The Slot Machine Reels: Combining prefixes ("on"), entities ("User", "Post"), and actions ("Created", "Deleted") into every possible event name string.',
    codeSnippet: `type Event = 'click' | 'hover' | 'focus';
type Scope = 'window' | 'document';

// Generates union of 6 string permutations:
type ScopedEvent = \`\${Scope}:\${Event}\`;
// "window:click" | "window:hover" | "document:click" | ...

type CSSLength = \`\${number}px\` | \`\${number}rem\` | \`\${number}%\`;
const validMargin: CSSLength = '16px'; // ✅
// const invalidMargin: CSSLength = '16em'; // ❌ Error!`,
    takeaways: [
      'Template literal types produce cross-product unions when interpolated with union types.',
      'Built-in intrinsic string manipulation types: Uppercase<S>, Lowercase<S>, Capitalize<S>, Uncapitalize<S>.',
      'Enables strict type-checking on CSS units, API route paths, and event handler naming conventions.'
    ],
    commonPitfall: {
      mistake: 'Creating giant combinatoric unions with 4+ large unions, causing compiler slowdowns.',
      fix: 'Keep template literal combinations focused on discrete finite sets.'
    },
    nextTopicId: 'compiler-pipeline'
  },
  {
    id: 'compiler-pipeline',
    title: 'TypeScript Compiler (TSC) Architecture',
    category: 'compiler',
    difficulty: 'Expert',
    summary: 'The TypeScript compiler pipeline consists of 5 main stages: Scanner (Tokens) -> Parser (AST) -> Binder (Symbols) -> Checker (Types) -> Emitter (JS/.d.ts).',
    mentalModel: 'The Assembly Plant: Raw metal (characters) is cut into stamped parts (tokens), assembled into a chassis frame (AST), wired with circuits (symbols), quality checked (type checker), and painted for delivery (emitter).',
    codeSnippet: `// 1. SCANNER: Converts raw source code into Token stream
// 'const' -> SyntaxKind.ConstKeyword, 'x' -> SyntaxKind.Identifier

// 2. PARSER: Constructs Abstract Syntax Tree (SourceFile AST)
// Node -> VariableDeclarationStatement

// 3. BINDER: Creates Symbols connecting declarations across files
// Symbol -> maps identifier 'x' to its scope memory location

// 4. CHECKER: The brain of TSC! Calculates type diagnostics
// checker.getTypeAtLocation(node) -> verifies type assignability

// 5. EMITTER: Generates target JavaScript (.js) and declaration (.d.ts)
// Strips types, downlevels modern syntax based on tsconfig.json`,
    takeaways: [
      'The Type Checker accounts for ~80% of compilation time because of deep constraint verification.',
      'The Emitter can run independently via Babel, SWC, or esbuild for ultra-fast transpilation without type checking.',
      'TypeScript generates type declaration maps (.d.ts.map) for instant Go-To-Definition across packages.'
    ],
    commonPitfall: {
      mistake: 'Assuming tools like Vite or esbuild perform type checking during bundling.',
      fix: 'Fast bundlers only strip types (Emitter step); always run "tsc --noEmit" in CI pipelines to catch type errors.'
    }
  }
];
