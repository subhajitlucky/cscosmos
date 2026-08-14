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
    nextTopicId: 'unknown-any-never'
  },
  {
    id: 'unknown-any-never',
    title: 'Top & Bottom Types (unknown, any, never)',
    category: 'types',
    difficulty: 'Intermediate',
    summary: 'In TypeScript type theory, "unknown" and "any" are Top Types (contain all values), while "never" is the Bottom Type (empty set / unreachable).',
    mentalModel: 'The Universe & The Black Hole: "unknown" is the entire universe (could be anything, must verify before touching); "never" is a black hole where nothing exists.',
    codeSnippet: `// 1. any: Disables type-checking (DANGEROUS)
let a: any = 'hello';
a.nonExistentMethod(); // Compiles fine, crashes at runtime!

// 2. unknown: Safe Top Type (MUST narrow before use)
let u: unknown = 'hello';
// u.toUpperCase(); // ❌ Compiler error!
if (typeof u === 'string') {
  console.log(u.toUpperCase()); // ✅ Safe!
}

// 3. never: Bottom Type (Exhaustiveness checking)
function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}`,
    takeaways: [
      'Always prefer "unknown" over "any" when dealing with dynamic data (JSON.parse, API responses).',
      '"never" is assignable to every type, but no type (except never itself) is assignable to never.',
      'Use assertNever() in the default case of discriminated unions to catch unhandled enum variants at compile time.'
    ],
    commonPitfall: {
      mistake: 'Using "any" to silence compiler errors, masking critical runtime crashes.',
      fix: 'Use "unknown" and perform type narrowing with zod or type guards.'
    },
    nextTopicId: 'satisfies-operator'
  },
  {
    id: 'satisfies-operator',
    title: 'The satisfies Operator (TS 4.9+)',
    category: 'types',
    difficulty: 'Intermediate',
    summary: 'The "satisfies" operator validates that an expression matches a type contract without widening or mutating its inferred literal type.',
    mentalModel: 'The Passport Checkpoint: The officer checks if your passport satisfies the visa rules, but does NOT stamp over your name or blur your identity photo.',
    codeSnippet: `type RGB = [red: number, green: number, blue: number];
type Color = string | RGB;

// ❌ With type annotation (widens palette values to string | RGB):
const paletteAnnotated: Record<string, Color> = {
  red: [255, 0, 0],
  green: '#00ff00',
};
// paletteAnnotated.green.toUpperCase(); // ❌ Error: toUpperCase does not exist on RGB!

// ✅ With satisfies operator (validates contract AND preserves exact literal types):
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, Color>;

palette.green.toUpperCase(); // ✅ TypeScript knows green is string!
palette.red.map(c => c * 2);  // ✅ TypeScript knows red is RGB tuple!`,
    takeaways: [
      '"satisfies" ensures an object matches a constraint without losing specific property key or literal type inference.',
      'Prevents typos in object keys while retaining autocompletion for exact property names.',
      'Replaces the need for unsafe "as" type assertions in config objects.'
    ],
    commonPitfall: {
      mistake: 'Using "as Record<string, Color>" which silences genuine property typos and type mismatches.',
      fix: 'Use "satisfies Record<string, Color>" for strict validation with zero type widening.'
    },
    nextTopicId: 'as-const-assertions'
  },
  {
    id: 'as-const-assertions',
    title: 'as const & Const Assertions',
    category: 'types',
    difficulty: 'Intermediate',
    summary: 'Suffixing an expression with "as const" signals to the compiler that all literal types should be preserved and object properties made readonly.',
    mentalModel: 'Laminating a Document: Once laminated, no text can be altered, numbers become exact immutable constants, and arrays become fixed tuples.',
    codeSnippet: `// Without as const: inferred as string[]
const routesMutable = ['/home', '/about', '/contact'];

// With as const: inferred as readonly ["/home", "/about", "/contact"]
const ROUTES = ['/home', '/about', '/contact'] as const;
type AppRoute = typeof ROUTES[number]; 
// Inferred as: "/home" | "/about" | "/contact"

const config = {
  endpoint: 'https://api.com',
  retries: 3
} as const;
// config.retries = 5; // ❌ Error: Cannot assign to 'retries' because it is a read-only property.`,
    takeaways: [
      '"as const" locks object properties as readonly and narrows strings/numbers to literal types.',
      'Arrays become fixed readonly tuples instead of mutable arrays.',
      'Ideal for creating single-source-of-truth configuration objects and deriving union types.'
    ],
    commonPitfall: {
      mistake: 'Defining a separate union type manually: type Routes = "/home" | "/about" and duplicating the array.',
      fix: 'Declare the array once with "as const" and derive the union with typeof array[number].'
    },
    nextTopicId: 'type-predicates'
  },
  {
    id: 'type-predicates',
    title: 'Type Predicates & Assertion Functions',
    category: 'types',
    difficulty: 'Intermediate',
    summary: 'Custom type guards with "param is Type" and assertion functions with "asserts condition" teach the compiler how to narrow types in custom logic.',
    mentalModel: 'The Authenticity Certificate: An expert appraiser inspects a diamond and issues a formal signed certificate (is Diamond) guaranteeing its purity to buyers.',
    codeSnippet: `interface Fish { swim: () => void; }
interface Bird { fly: () => void; }

// Custom Type Predicate:
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows pet is Fish!
  } else {
    pet.fly();  // TypeScript knows pet is Bird!
  }
}

// Assertion Function:
function assertNonNull<T>(val: T, msg: string): asserts val is NonNullable<T> {
  if (val === null || val === undefined) throw new Error(msg);
}`,
    takeaways: [
      'Type predicate functions return a boolean and have the return type "argName is SpecificType".',
      'Assertion functions (asserts condition) throw on failure and narrow the variable in the subsequent outer scope.',
      'Enables clean filtering of arrays: array.filter(isNotNull).'
    ],
    commonPitfall: {
      mistake: 'Writing a type predicate that returns a plain boolean: function isFish(p): boolean, failing to narrow the calling scope.',
      fix: 'Explicitly specify the type predicate return type: pet is Fish.'
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
    nextTopicId: 'const-type-parameters'
  },
  {
    id: 'const-type-parameters',
    title: 'Const Type Parameters (TS 5.0+)',
    category: 'generics',
    difficulty: 'Advanced',
    summary: 'TypeScript 5.0 introduced <const T> to allow functions to infer the most specific literal and readonly types without requiring callers to pass "as const".',
    mentalModel: 'Automatic Seal: The function automatically adds the "as const" wax seal to whatever arguments you pass in, saving callers repetitive typing.',
    codeSnippet: `// Without const modifier: T is inferred as string[]
function getRoutesOld<T extends string[]>(routes: T): T {
  return routes;
}
const r1 = getRoutesOld(['/home', '/dashboard']); // string[]

// With const type parameter: T is inferred as readonly ['/home', '/dashboard']
function getRoutesNew<const T extends readonly string[]>(routes: T): T {
  return routes;
}
const r2 = getRoutesNew(['/home', '/dashboard']); // readonly ["/home", "/dashboard"]`,
    takeaways: [
      '<const T> infers literal string, number, and boolean types instead of wide primitives.',
      'Array literals passed to <const T> functions are inferred as readonly tuples.',
      'Dramatically improves ergonomics for DSLs, router builders, and schema libraries.'
    ],
    commonPitfall: {
      mistake: 'Expecting <const T> to freeze objects at runtime.',
      fix: 'Remember that TypeScript is compile-time only; use Object.freeze() if runtime immutability is required.'
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
    nextTopicId: 'branded-types'
  },
  {
    id: 'branded-types',
    title: 'Branded / Nominal Types & Unit Safety',
    category: 'advanced',
    difficulty: 'Advanced',
    summary: 'TypeScript is structural by default, but branded types use unique symbol tags to enforce nominal distinction between identical primitives (e.g. USD vs EUR, UserId vs PostId).',
    mentalModel: 'The Currency Exchange: A $100 dollar bill and a €100 euro bill are both paper rectangles with the number 100 on them, but you cannot spend euros in a US vending machine.',
    codeSnippet: `// Brand helper:
declare const brand: unique symbol;
type Brand<T, B> = T & { readonly [brand]: B };

type USD = Brand<number, 'USD'>;
type EUR = Brand<number, 'EUR'>;

function makeUSD(n: number): USD { return n as USD; }
function makeEUR(n: number): EUR { return n as EUR; }

function payInUSD(amount: USD) {
  console.log(\`Paid USD: \${amount}\`);
}

const walletUSD = makeUSD(50);
const walletEUR = makeEUR(50);

payInUSD(walletUSD); // ✅ Valid!
// payInUSD(walletEUR); // ❌ Error! Type 'EUR' is not assignable to type 'USD'.`,
    takeaways: [
      'Branded types attach a unique nominal phantom property to prevent accidental primitive substitution.',
      'Essential for safety in financial applications (currencies), physics calculations (meters vs feet), and database IDs.',
      'Zero runtime overhead—the brand symbol exists purely at compile time.'
    ],
    commonPitfall: {
      mistake: 'Passing raw primitive numbers or unvalidated strings to functions expecting specific branded IDs.',
      fix: 'Use constructor/validation functions (e.g. parseEmail()) that return branded types.'
    },
    nextTopicId: 'indexed-access-types'
  },
  {
    id: 'indexed-access-types',
    title: 'Indexed Access Types & keyof typeof',
    category: 'types',
    difficulty: 'Intermediate',
    summary: 'Indexed access types let you look up the type of a specific property on another type using T[K] syntax.',
    mentalModel: 'The Card Catalog: You look up the drawer label ("author") in the library catalog to inspect the exact format of the author card.',
    codeSnippet: `const API_ROUTES = {
  users: '/api/v1/users',
  posts: '/api/v1/posts',
  auth: { login: '/api/v1/login', logout: '/api/v1/logout' }
};

type Routes = typeof API_ROUTES;
type AuthRoutes = Routes['auth']; // { login: string; logout: string }
type RouteValues = Routes[keyof Routes]; // string | { login: string; logout: string }`,
    takeaways: [
      'Syntax: Type["propertyName"].',
      'Use typeof object to capture the type of an existing JavaScript runtime variable.',
      'Index with [number] to extract the element type of an array (e.g. MyArray[number]).'
    ],
    commonPitfall: {
      mistake: 'Indexing with dot notation: Type.prop (which is invalid type syntax; use Type["prop"]).',
      fix: 'Always use bracket notation for indexed access types: Type["prop"].'
    },
    nextTopicId: 'covariance-contravariance'
  },
  {
    id: 'covariance-contravariance',
    title: 'Function Variance: Covariance & Contravariance',
    category: 'advanced',
    difficulty: 'Expert',
    summary: 'Variance describes how subtyping between complex types relates to subtyping between their components. Return types are Covariant, while function parameters are Contravariant.',
    mentalModel: 'The Strict Restaurant Contract: A restaurant promise says "Order a Meal, get Food" (Covariant return). But to fulfill the chef role, you must be able to cook ANY meal, not just burgers (Contravariant parameter).',
    codeSnippet: `class Animal { name = 'Animal'; }
class Dog extends Animal { bark() {} }

// 1. Return Types are COVARIANT (Dog is assignable to Animal):
type AnimalProducer = () => Animal;
type DogProducer = () => Dog;
let produceAnimal: AnimalProducer = () => new Dog(); // ✅ Safe!

// 2. Parameter Types are CONTRAVARIANT (AnimalConsumer is assignable to DogConsumer):
type AnimalConsumer = (a: Animal) => void;
type DogConsumer = (d: Dog) => void;
let consumeDog: DogConsumer = (a: Animal) => console.log(a.name); // ✅ Safe!`,
    takeaways: [
      'Covariance: Subtype relationship is preserved in the same direction (Dog -> Animal produces () => Dog -> () => Animal).',
      'Contravariance: Subtype relationship is reversed in function parameters ((Animal) => void is assignable to (Dog) => void).',
      'TypeScript enables strictFunctionTypes by default to catch unsafe parameter bivariance.'
    ],
    commonPitfall: {
      mistake: 'Using method syntax in interfaces (foo(x: Dog): void) which defaults to unsafe bivariance.',
      fix: 'Use property function syntax: foo: (x: Dog) => void to enforce strict contravariance.'
    },
    nextTopicId: 'declaration-merging'
  },
  {
    id: 'declaration-merging',
    title: 'Declaration Merging & Module Augmentation',
    category: 'advanced',
    difficulty: 'Advanced',
    summary: 'TypeScript allows merging multiple declarations sharing the same name (e.g. interfaces, namespaces) into a single definition.',
    mentalModel: 'The Addendum: When new amendments are ratified to the constitution, they merge into the official legal document without replacing earlier articles.',
    codeSnippet: `// Merging Interfaces:
interface User {
  id: string;
}
interface User {
  name: string; // Merged into User { id: string; name: string }
}

// Module Augmentation (extending Express Request):
declare global {
  namespace Express {
    interface Request {
      currentUser?: { id: string; role: string };
    }
  }
}`,
    takeaways: [
      'Interfaces with the same name in the same scope automatically merge their member fields.',
      'Type aliases ("type") cannot merge; attempting to declare duplicate types throws an error.',
      'Module augmentation lets you add custom properties to third-party npm packages safely.'
    ],
    commonPitfall: {
      mistake: 'Trying to redeclare conflicting property types across merged interfaces (e.g. id: string vs id: number).',
      fix: 'Ensure merged properties have identical or compatible types.'
    },
    nextTopicId: 'decorators-tc39'
  },
  {
    id: 'decorators-tc39',
    title: 'Stage 3 TC39 Decorators (TS 5.0+)',
    category: 'advanced',
    difficulty: 'Advanced',
    summary: 'Standard ECMAScript Decorators allow annotating and modifying class declarations, methods, and fields cleanly without experimental flags.',
    mentalModel: 'The Security Checkpoint Guard: A function wrapper placed before entering a secure room that logs timestamps and checks credentials before allowing entry.',
    codeSnippet: `// Method timing decorator:
function loggedMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  return function (this: This, ...args: Args): Return {
    console.log(\`Calling \${String(context.name)} with args:\`, args);
    const result = target.call(this, ...args);
    console.log(\`Result:\`, result);
    return result;
  };
}

class Calculator {
  @loggedMethod
  add(a: number, b: number) {
    return a + b;
  }
}`,
    takeaways: [
      'TypeScript 5.0 implements standard TC39 Stage 3 decorators (no experimentalDecorators flag needed).',
      'Decorators receive target and a type-safe context object (ClassMethodDecoratorContext).',
      'Used heavily in modern backend frameworks like NestJS and UI component libraries.'
    ],
    commonPitfall: {
      mistake: 'Confusing legacy experimentalDecorators syntax with modern Stage 3 decorator context APIs.',
      fix: 'Use ClassMethodDecoratorContext and modern TS 5.0+ signature patterns.'
    },
    nextTopicId: 'tsconfig-module-resolution'
  },
  {
    id: 'tsconfig-module-resolution',
    title: 'Modern tsconfig & moduleResolution: "bundler"',
    category: 'compiler',
    difficulty: 'Intermediate',
    summary: 'Modern TypeScript projects use moduleResolution: "bundler" with ESNext module targets to mirror Vite, Webpack, and Next.js resolution rules.',
    mentalModel: 'The GPS Map Version: An updated satellite map that knows modern roundabouts and bridges exists, instead of an old 1990s paper road atlas.',
    codeSnippet: `// tsconfig.json (Modern recommended Next.js / Vite setup):
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`,
    takeaways: [
      '"moduleResolution": "bundler" supports package.json "exports" subpaths and extensionless imports.',
      '"isolatedModules": true ensures single-file transpilers (esbuild, SWC) can transpile each file independently.',
      '"noEmit": true offloads bundle generation to Vite/Next.js while using tsc purely for type diagnostics.'
    ],
    commonPitfall: {
      mistake: 'Using legacy moduleResolution: "node" in modern Vite/Next.js projects, breaking package.json exports mapping.',
      fix: 'Update tsconfig.json to moduleResolution: "bundler" for modern ESM tooling.'
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
