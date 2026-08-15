export interface ConceptContent {
    longDescription: string;
    syntax?: string;
    exampleCode?: string;
}

// Detailed content for each concept is split out so the concepts list stays lean.
export const conceptContent: Record<string, ConceptContent> = {
    primitives: {
        longDescription: `Primitives are the simplest, most fundamental data types in TypeScript. They are immutable (cannot be changed) and passed by value in memory.

**The 7 Primitive Types:**
• string - Textual data ("hello", 'world', \`template\`)
• number - All numeric values (integers, floats, Infinity, NaN)
• boolean - true or false
• null - Intentional absence of value
• undefined - Variable declared but not assigned
• symbol - Unique identifier (advanced)
• bigint - Large integers beyond Number.MAX_SAFE_INTEGER

**Key Characteristics:**
✓ Stored directly in the stack (fast access)
✓ Immutable - operations create new values
✓ Compared by value, not reference
✓ Cannot have properties (unlike objects)

Prefer using strict null checks so null/undefined are explicit in your types.`,
        syntax: "let variableName: type = value;",
        exampleCode: `// ===== STRING =====
let username: string = "Alice";
let templateStr: string = \`User: \${username}\`;

// ===== NUMBER =====
let age: number = 25;
let hex: number = 0xFF;

// ===== BOOLEAN =====
let isActive: boolean = true;

// ===== NULL & UNDEFINED =====
let data: null = null;           // Intentional empty
let value: undefined = undefined; // Not yet assigned

// ===== TYPE INFERENCE =====
let auto = "I'm a string!"; // inferred string

// ===== THE 'ANY' TRAP (AVOID) =====
let dangerous: any = "text";
dangerous = 42;              // No error, defeats TS!
dangerous.nonExistent();     // Compiles, crashes at runtime

// ===== SAFER UNION =====
let safe: string | null = null;
let correct: number = Number.parseInt("42");`,
    },
    functions: {
        longDescription: `Functions are the building blocks of any application. TypeScript adds type safety to parameters, return values, and function expressions.

**Key Concepts:**
• Parameter & return types
• Optional/default parameters
• Rest parameters
• Function overloads
• Arrow functions vs declarations

Typed functions catch errors early, document expectations, and improve IDE help.`,
        syntax: "function name(param: Type): ReturnType { ... }",
        exampleCode: `// BASIC FUNCTION
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// OPTIONAL + DEFAULT
function buildUser(name: string, age?: number, active: boolean = true) {
  return { name, age, active };
}

// REST
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// FUNCTION TYPE ALIAS
type MathOp = (a: number, b: number) => number;
const add: MathOp = (a, b) => a + b;

// OVERLOAD (compile-time signatures)
function format(value: string): string;
function format(value: number): string;
function format(value: string | number) {
  return value.toString();
}

// ARROW VS FUNCTION FOR 'this'
const counter = {
  count: 0,
  inc() {
    this.count += 1; // ok, has 'this'
  },
};`,
    },
    "interfaces-vs-types": {
        longDescription: `Interfaces and type aliases both describe shapes, but each shines in different spots.

**Interfaces**
• Mergeable (declaration merging)
• Great for OO contracts and public APIs
• Extends using 'extends'

**Types**
• More flexible: unions, primitives, tuples, mapped types
• Compose using '&'
• Cannot merge, but work well for computed types

Use interfaces for extensible object contracts; use types for unions/tuples/utility-based transforms.`,
        syntax: "interface Name { ... } | type Name = { ... }",
        exampleCode: `// INTERFACE
interface User {
  name: string;
  age: number;
}

interface User {  // declaration merge
  email: string;
}

// TYPE ALIAS
type Product = {
  id: number;
  title: string;
};

// EXTENDING
interface Admin extends User {
  role: string;
}
type SuperAdmin = User & { permissions: string[] };

// UNION (types only)
type Status = "pending" | "approved" | "rejected";

// MAPPED TYPE (types only)
type Readonly<T> = { readonly [K in keyof T]: T[K] };`,
    },
    "type-inference": {
        longDescription: `Type inference is TS guessing types from usage so you write less.

It looks at:
• Initializers (const/let)
• Return statements
• Default params
• Contextual positions (e.g., callbacks)

Let it infer obvious things; annotate public surfaces or when inference is too broad.`,
        syntax: "let variable = value; // Type inferred from value",
        exampleCode: `let name = "Alice";     // string
let nums = [1, 2, 3];   // number[]
let mixed = [1, "two"]; // (number | string)[]

function double(x: number) {
  return x * 2; // return inferred number
}

const names = ["Ada", "Linus"];
names.forEach((n) => n.toUpperCase()); // contextual typing: n is string

// Too broad without initializer -> any
let data;
data = "string";
data = 42;

// Safer
let safeData: unknown;
// must narrow before use`,
    },
    "literal-types": {
        longDescription: `Literal types lock a value to an exact string/number/boolean. Union them for safe finite sets. Enums give a runtime object; union literals are tree-shakeable and often preferred in frontend code.

Use const assertions (\`as const\`) to capture literal intent from arrays/objects.`,
        syntax: `type Status = "idle" | "loading" | "success" | "error";`,
        exampleCode: `type Status = "idle" | "loading" | "success" | "error";
let status: Status = "loading";
// status = "done"; // ❌ not allowed

// Derive literal union from data
const buttons = ["primary", "secondary", "ghost"] as const;
type ButtonVariant = (typeof buttons)[number];
const variant: ButtonVariant = "ghost";

// Enum (runtime object)
enum Direction { Up = "UP", Down = "DOWN" }
const dir: Direction = Direction.Up;`,
    },
    tuples: {
        longDescription: `Tuples are fixed-length arrays where each position has its own type. Great for coordinates, pairs, and function results. Use labels for readability and readonly when you don't want mutation.`,
        syntax: `type Point = [x: number, y: number];`,
        exampleCode: `type Point = [x: number, y: number];
const origin: Point = [0, 0];

// Readonly tuple
type RGB = readonly [number, number, number];
const red: RGB = [255, 0, 0];

// Function returning a tuple
function useCounter(): [number, () => void] {
  let count = 0;
  const inc = () => { count += 1; };
  return [count, inc];
}

// Variadic tuple (TS 4+)
type WithId<T> = [id: string, ...items: T[]];
const users: WithId<string> = ["team-1", "alice", "bob"];`,
    },
    "safety-types": {
        longDescription: `Safer primitives for everyday work:
• unknown: like a locked box—must narrow before use (safer than any)
• never: impossible value; signals functions that throw/loop or exhaustive checks
• void: no useful return; usually only undefined allowed
• object: any non-primitive value (arrays, functions, objects)

Prefer unknown over any for untrusted inputs, and use never to model impossible states.

**Why it matters:**
• unknown forces you to prove safety before property access—great for untrusted inputs
• never catches missing cases in switches so refactors fail fast
• void/object communicate intent (fire-and-forget vs non-primitive)`,
        syntax: `let input: unknown;
function fail(msg: string): never { throw new Error(msg); }`,
        exampleCode: `function parseUser(input: unknown) {
  if (typeof input === "string") {
    return { name: input.toUpperCase() };
  }
  throw new Error("Expected string");
}

function fail(message: string): never {
  throw new Error(message);
}

function onClick(): void {
  // return undefined implicitly
}

function takesObject(value: object) {
  // disallows primitives
  console.log(value);
}`,
    },
    "unions-intersections": {
        longDescription: `Unions represent “either/or”. Intersections combine shapes into “both”.

Use unions for finite states and API responses; pair with narrowing. Use intersections to compose behaviors, but avoid conflicting fields.`,
        syntax: `type Status = "idle" | "loading" | "success" | "error";
type AdminUser = User & { permissions: string[] };`,
        exampleCode: `type Status = "idle" | "loading" | "success" | "error";

type ApiSuccess = { status: "success"; data: string };
type ApiError = { status: "error"; message: string };
type ApiResponse = ApiSuccess | ApiError;

function handle(res: ApiResponse) {
  if (res.status === "success") {
    console.log(res.data);
  } else {
    console.error(res.message);
  }
}

type Timestamped = { createdAt: Date };
type Identified = { id: string };
type Entity = Timestamped & Identified;`,
    },
    "type-guards": {
        longDescription: `Type guards narrow unions at runtime. TS recognizes:
• typeof (string/number/boolean/bigint/symbol/undefined)
• instanceof (classes)
• in (property existence)
• equality checks / discriminated unions
• user-defined predicates: function isX(arg): arg is X

Good narrowing avoids unsafe optional chaining and runtime errors.

**Why it matters:**
• Prevents “cannot read property of undefined” by proving shape before access
• Enables IDE autocomplete within narrowed branches
• Exhaustive guards with never fail builds when new variants are added`,
        syntax: `function isUser(value: unknown): value is User { ... }`,
        exampleCode: `function isUser(value: unknown): value is { id: string; name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as any).id === "string"
  );
}

function printLength(value: string | string[]) {
  if (typeof value === "string") {
    console.log(value.length);
  } else {
    console.log(value.length); // now string[]
  }
}

class HttpError extends Error { status = 500; }
function handle(err: unknown) {
  if (err instanceof HttpError) {
    console.error(err.status);
  }
}
`,
    },
    "type-assertions": {
        longDescription: `When TS can't prove a type but you know more:
• as assertions: tell TS to treat a value as a narrower type (use sparingly)
• non-null assertion (!): assert value is not null/undefined
• satisfies: checks a value against a type without widening literals
• definite assignment (!:) let TS know a class/var will be assigned before use

Prefer narrowing and satisfies over blunt assertions for safety.

**Why it matters:**
• Assertions can hide real bugs—use them after runtime checks, not before
• satisfies keeps literal precision while still validating shape
• Definite assignment (!) should be rare; initialize in constructors instead when possible`,
        syntax: `const el = document.getElementById("email") as HTMLInputElement;`,
        exampleCode: `// 'as' assertion
const email = document.getElementById("email") as HTMLInputElement;
email.value = "hi@example.com";

// non-null assertion
declare const maybeUser: { name: string } | undefined;
const username = maybeUser!.name;

// satisfies keeps literal precision
const config = {
  env: "prod",
  retry: 3,
} satisfies { env: "dev" | "prod"; retry: number };

// definite assignment
class Store {
  private cache!: Map<string, string>;
  init() {
    this.cache = new Map();
  }
}
`,
    },
    "type-queries": {
        longDescription: `Type queries mirror runtime values in the type system.
• typeof: capture the type of a value
• keyof: union of property names
• indexed access: T[K] to grab a property type

These enable DRY typing that follows the runtime objects you already have.

**Why it matters:**
• Prevents drift between runtime objects and types—one source of truth
• Great for event maps, route configs, and API response shapes
• Reduces duplication and keeps refactors safe`,
        syntax: `const user = { id: 1, name: "Ada" } as const;
type User = typeof user;`,
        exampleCode: `const user = { id: 1, name: "Ada", active: true } as const;

type User = typeof user;
type UserKeys = keyof User;          // "id" | "name" | "active"
type NameType = User["name"];        // "Ada"

// Generic helper using indexed access
type ValueOf<T> = T[keyof T];
type Primitive = ValueOf<{ a: string; b: number }>; // string | number

// keyof with Record
type ApiResponse<T> = { data: T; status: number };
type ResponseStatus = ApiResponse<string>["status"];`,
    },
    classes: {
        longDescription: `Classes get full typing: access modifiers, readonly fields, implements contracts, and abstract bases. Prefer interfaces for shape contracts; classes add runtime behavior.`,
        syntax: `class Service implements Disposable { constructor(private url: string) {} }`,
        exampleCode: `interface Printable { print(): void; }

abstract class Shape {
  constructor(protected color: string) {}
  abstract area(): number;
}

class Rectangle extends Shape implements Printable {
  constructor(color: string, private width: number, private height: number) {
    super(color);
  }
  area() {
    return this.width * this.height;
  }
  print() {
    console.log(\`Rect \${this.color}: \${this.area()}\`);
  }
}

const rect = new Rectangle("blue", 10, 4);
rect.print();`,
    },
    modules: {
        longDescription: `Modules isolate scope. Use ESM \`import/export\`. Add \`import type\` / \`export type\` to avoid pulling runtime code for types. Namespaces are legacy; prefer modules.

Be mindful of path aliases and interop (CJS vs ESM).

**Why it matters:**
• Mixing default/named imports across CJS/ESM can silently break at runtime
• import type keeps bundles small and avoids unexpected side effects
• Consistent path aliases keep tooling (Vite/TS/Jest) aligned`,
        syntax: `import type { User } from "./types";
export function getUser(id: string): Promise<User> { ... }`,
        exampleCode: `// types.ts
export type User = { id: string; name: string };

// api.ts
import type { User } from "./types";
export async function fetchUser(id: string): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}

// index.ts
export * from "./api";
export type { User } from "./types";

// Legacy namespace (avoid unless needed)
// namespace Legacy { export const version = "1.0"; }`,
    },
    "async-await": {
        longDescription: `Async functions return Promise-wrapped types. Use \`Promise<T>\` or \`Awaited<T>\` to model resolved values. Always consider error types when catching unknown.

**Why it matters:**
• Typed promises prevent you from forgetting awaited shapes
• Catching unknown avoids assuming Error and crashing on non-Error throws
• Adding AbortSignal avoids wasted work and makes UIs responsive`,
        syntax: `async function fetchUser(id: string): Promise<User> { ... }`,
        exampleCode: `type User = { id: string; name: string };

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(\`/users/\${id}\`);
  if (!res.ok) throw new Error("Request failed");
  return res.json() as Promise<User>;
}

// Awaited extracts inner type
type UserPromise = ReturnType<typeof fetchUser>;   // Promise<User>
type UserResolved = Awaited<UserPromise>;         // User

async function safeGet(id: string) {
  try {
    return await fetchUser(id);
  } catch (err: unknown) {
    if (err instanceof Error) console.error(err.message);
  }
}
`,
    },
    "tsconfig-strict": {
        longDescription: `Compiler flags shape your safety net. \`strict\` bundles many checks:
• noImplicitAny
• strictNullChecks
• strictBindCallApply
• strictFunctionTypes
• strictPropertyInitialization

Other helpful flags: noUncheckedIndexedAccess, exactOptionalPropertyTypes, useUnknownInCatchVariables, noEmitOnError.`,
        syntax: `"compilerOptions": {
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}`,
        exampleCode: `// strictNullChecks example
function greet(name?: string) {
  // name: string | undefined
  if (!name) return;
  console.log(name.toUpperCase());
}

// noUncheckedIndexedAccess
const list: string[] = [];
const first: string | undefined = list[0]; // must handle undefined`,
    },
    generics: {
        longDescription: `Generics let you write reusable, type-safe utilities. Constrain them when needed and provide defaults for ergonomics.`,
        syntax: `function identity<T>(value: T): T { return value; }`,
        exampleCode: `function identity<T>(value: T): T {
  return value;
}

function first<T>(list: T[]): T | undefined {
  return list[0];
}

function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

type ApiResponse<TData = unknown> = {
  data: TData;
  status: number;
};
const res: ApiResponse<string> = { data: "ok", status: 200 };`,
    },
    "utility-types": {
        longDescription: `Built-in helpers transform types quickly.
Common ones:
• Partial<T>, Required<T>
• Readonly<T>, Mutable via -readonly in mapped types
• Pick<T, K>, Omit<T, K>
• Record<K, V>
• ReturnType<T>, Parameters<T>
• Awaited<T>`,
        syntax: `type DraftUser = Partial<User>;
type UserIdMap = Record<string, User>;`,
        exampleCode: `type User = { id: string; name: string; email?: string };

type UserDraft = Partial<User>;            // all optional
type UserRequired = Required<User>;        // all required
type UserPreview = Pick<User, "id" | "name">;
type UserSansEmail = Omit<User, "email">;
type UserMap = Record<string, User>;

function makeUser(): User { return { id: "1", name: "Ada" }; }
type CreatedUser = ReturnType<typeof makeUser>;`,
    },
    "mapped-types": {
        longDescription: `Mapped types iterate over keys to build new shapes. Combine with keyof and modifiers to add/remove readonly/optional flags. Key remapping (as) lets you change names.`,
        syntax: `type Readonly<T> = { readonly [K in keyof T]: T[K] };`,
        exampleCode: `type User = { id: string; name?: string };

type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

type RequiredUser = {
  [K in keyof User]-?: User[K];
};

// Key remapping
type EventHandlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}\`]: (value: T[K]) => void;
};

type Handlers = EventHandlers<{ click: MouseEvent; focus: FocusEvent }>;
// { onClick: (value: MouseEvent) => void; onFocus: (value: FocusEvent) => void }`,
    },
    "conditional-types": {
        longDescription: `Conditional types add logic to the type system. They distribute over unions when the checked type is a naked generic. Use \`infer\` to pull out parts of a type.`,
        syntax: `type IsString<T> = T extends string ? true : false;`,
        exampleCode: `type IsString<T> = T extends string ? true : false;
type A = IsString<string>;  // true
type B = IsString<number>;  // false

type ElementType<T> = T extends (infer U)[] ? U : T;
type Num = ElementType<number[]>; // number

// Distributive behavior
type Nullable<T> = T | null;
type NonNullable<T> = T extends null | undefined ? never : T;
type Result = NonNullable<string | null>; // string`,
    },
    "template-literals": {
        longDescription: `Template literal types let you build string types from pieces. Combine with unions to enumerate patterns such as route names or event keys.`,
        syntax: `type EventName = \`user:\${"created" | "updated"}\`;`,
        exampleCode: `type EventName = \`user:\${"created" | "updated"}\`;
const evt: EventName = "user:created";

type Route = \`/users/\${string}\`;
const profileRoute: Route = "/users/42";

type RGB = \`rgb(\${number}, \${number}, \${number})\`;`,
    },
    "ambient-declarations": {
        longDescription: `Ambient declarations describe types for code you don't own. Useful for JS libraries, globals, or virtual modules.
• declare module "lib": add typings for an untyped package
• declare global: augment globalThis/window
• declaration merging: extend existing module types`,
        syntax: `declare module "uuid" {
  export function v4(): string;
}`,
        exampleCode: `// ambient.d.ts
declare module "uuid" {
  export function v4(): string;
}

declare global {
  interface Window {
    appVersion: string;
  }
}

declare const process: {
  env: { NODE_ENV: "development" | "production" };
};`,
    },
};

