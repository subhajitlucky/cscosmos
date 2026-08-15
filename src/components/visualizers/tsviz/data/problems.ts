export type ProblemDifficulty = "Easy" | "Medium" | "Hard";

export interface Problem {
    id: string;
    title: string;
    difficulty: ProblemDifficulty;
    concept: string;
    summary: string;
    description?: string;
    starterCode?: string;
    hints?: string[];
    solution?: string;
    expectedOutput?: string;
}

export const problems: Problem[] = [
    { id: "p01", title: "Strongly-type a user profile", difficulty: "Easy", concept: "Primitives & Objects", summary: "Define a typed object for a user with required and optional fields.", description: "Create a typed User object with required id/name and optional email/avatar. Demonstrate safe access and mutation with readonly fields where appropriate.", hints: [
        "Use a type or interface with required and optional fields.",
        "Mark id as readonly to avoid accidental reassignment.",
    ], solution: `type User = {
  readonly id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
};

const user: User = { id: "u1", name: "Ada" };
user.name = "Ada Lovelace";
// user.id = "u2"; // error` },
    { id: "p02", title: "Safer unknown parsing", difficulty: "Easy", concept: "unknown & narrowing", summary: "Parse an unknown API payload and narrow it safely.", description: "Write a parse function that accepts unknown JSON, checks required fields, and returns a typed object. Reject malformed payloads with a typed error string.", hints: [
        "Start with unknown and check typeof === \"object\" and != null.",
        "Check property presence with in and typeof before casting.",
    ], solution: `type User = { id: string; name: string };

function parseUser(data: unknown): User {
  if (typeof data === "object" && data !== null && "id" in data && "name" in data) {
    const { id, name } = data as Record<string, unknown>;
    if (typeof id === "string" && typeof name === "string") {
      return { id, name };
    }
  }
  throw new Error("Invalid payload");
}` },
    { id: "p03", title: "Union of statuses", difficulty: "Easy", concept: "Literal unions", summary: "Create a status union and reject invalid strings.", description: "Define a Status union (e.g., \"idle\" | \"loading\" | \"success\" | \"error\"), a function that accepts only those values, and show that other strings are compile-time errors.", hints: [
        "Make a union of string literals.",
        "Use the union as a parameter type to block other values.",
    ], solution: `type Status = "idle" | "loading" | "success" | "error";

function setStatus(s: Status) {
  return s;
}

setStatus("idle");
// setStatus("done"); // error` },
    { id: "p04", title: "Tuple coordinates", difficulty: "Easy", concept: "Tuples", summary: "Model a 2D point and destructure it with labels.", description: "Create a labeled tuple [x, y], a function that computes distance from origin, and ensure incorrect tuple lengths or reordered values fail at compile-time.", expectedOutput: `distance([3,4]) // 5`, hints: [
        "Use a labeled tuple type: [x: number, y: number].",
        "Destructure parameters to access x and y.",
    ], solution: `type Point = [x: number, y: number];

function distance([x, y]: Point) {
  return Math.hypot(x, y);
}

const p: Point = [3, 4];
distance(p); // 5` },
    { id: "p05", title: "Readonly config", difficulty: "Easy", concept: "Readonly & const assertions", summary: "Freeze a config object to prevent mutation.", description: "Create a config object that cannot be mutated after creation; demonstrate that attempts to modify it fail at compile time.", hints: [
        "Use as const on the literal or Readonly<> on the type.",
        "Show mutation attempts cause errors.",
    ], solution: `const config = {
  api: "https://api.example.com",
  retries: 3,
} as const;

// config.api = "x"; // error: read-only
type Config = typeof config;` },
    { id: "p06", title: "Function overloads", difficulty: "Medium", concept: "Functions & overloads", summary: "Provide overloads for a formatter handling strings and numbers.", description: "Expose overload signatures for string and number inputs, ensuring callers get precise return types and preventing misuse.", starterCode: `function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  // TODO: return a formatted string
  return "";
}

// write tests or console.logs here
`, hints: [
        "Provide two overload signatures: one for string, one for number.",
        "In the implementation signature, accept string | number and return a string.",
    ], solution: `function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return typeof value === "number" ? value.toFixed(2) : value.toUpperCase();
}
` },
    { id: "p07", title: "Discriminated response", difficulty: "Medium", concept: "Unions & guards", summary: "Model success/error API responses and handle them exhaustively.", description: "Use a discriminated union for API responses and implement an exhaustive handler that returns a string message for any variant.", starterCode: `type Success = { status: "success"; data: string };
type Error = { status: "error"; message: string };
type ApiResponse = Success | Error;

function handleResponse(res: ApiResponse) {
  // TODO: narrow and return a string message
}
`, hints: [
        "Use the discriminant field status to narrow.",
        "Add an exhaustive else/never branch to catch new statuses.",
    ], solution: `type Success = { status: "success"; data: string };
type Error = { status: "error"; message: string };
type ApiResponse = Success | Error;

function handleResponse(res: ApiResponse): string {
  if (res.status === "success") return res.data;
  if (res.status === "error") return res.message;
  const _exhaustive: never = res;
  return _exhaustive;
}
` },
    { id: "p08", title: "Narrow with in/typeof", difficulty: "Medium", concept: "Type guards", summary: "Use in and typeof to safely access fields on a union.", description: "Given a union of objects and primitives, write a describe() function that safely handles each variant using typeof and in guards.", starterCode: `type User = { kind: "user"; name: string };
type Guest = { kind: "guest"; expires: Date };
type Person = User | Guest | string;

function describe(person: Person) {
  // TODO: narrow with typeof / in / kind
  return "";
}
`, hints: [
        "Use typeof person === \"string\" first.",
        "Then use in or discriminant kind to split User vs Guest.",
    ], solution: `type User = { kind: "user"; name: string };
type Guest = { kind: "guest"; expires: Date };
type Person = User | Guest | string;

function describe(person: Person): string {
  if (typeof person === "string") return person.toUpperCase();
  if ("kind" in person && person.kind === "user") return \`User: \${person.name}\`;
  if ("kind" in person && person.kind === "guest") return \`Guest until \${person.expires.toISOString()}\`;
  const _exhaustive: never = person;
  return _exhaustive;
}
` },
    { id: "p09", title: "Keyof picker", difficulty: "Medium", concept: "keyof & indexed access", summary: "Write a pick function constrained to existing keys.", description: "Implement a pick<T, K>() that only allows keys of T. Return an object containing just those keys, fully typed.", hints: [
        "Constrain K extends keyof T.",
        "Return an object built from the keys; rely on indexed access T[K].",
    ], solution: `function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((k) => {
    result[k] = obj[k];
  });
  return result;
}` },
    { id: "p10", title: "Mapped readonly", difficulty: "Medium", concept: "Mapped types", summary: "Create a generic to deep-readonly an object.", description: "Write DeepReadonly<T> that makes all properties (and nested objects) readonly.", hints: [
        "Use a mapped type over keyof T.",
        "If value extends object, recurse; otherwise keep the type.",
    ], solution: `type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};` },
    { id: "p11", title: "Partial update", difficulty: "Easy", concept: "Utility types", summary: "Type a function that merges a partial update into an entity.", description: "Accept an entity and a Partial of the entity, merge, and return the updated object.", hints: [
        "Use Partial<T> for the update type.",
        "Spread the original and update to build the result.",
    ], solution: `function mergeUpdate<T>(entity: T, update: Partial<T>): T {
  return { ...entity, ...update };
}` },
    { id: "p12", title: "Record of handlers", difficulty: "Medium", concept: "Record & unions", summary: "Create a handler map keyed by event names.", description: "Given an event union, build a Record mapping each event to a handler function with the right payload type.", hints: [
        "Use Record<EventName, Handler>.",
        "Map payload types using indexed access.",
    ], solution: `type Events = { click: MouseEvent; focus: FocusEvent };
type HandlerMap = { [K in keyof Events]: (e: Events[K]) => void };

const handlers: HandlerMap = {
  click: (e) => console.log(e.clientX),
  focus: (e) => console.log(e.type),
};` },
    { id: "p13", title: "Template literal routes", difficulty: "Medium", concept: "Template literal types", summary: "Constrain route strings to /users/:id patterns.", description: "Type a router helper that only accepts /users/${id} routes. Show that other paths fail at compile time.", starterCode: `type UserRoute = \`/users/\${string}\`;

function goTo(route: UserRoute) {
  // TODO: ensure only valid routes compile
  return route;
}

const ok = goTo("/users/123");
// const bad = goTo("/projects/123"); // should error
`, hints: [
        "Use a template literal type with /users/${string}.",
        "Optionally add constraints for UUID-like ids with unions/interpolation.",
    ], solution: `type UserRoute = \`/users/\${string}\`;

function goTo(route: UserRoute) {
  return route;
}
` },
    { id: "p14", title: "Infer Promise inner", difficulty: "Medium", concept: "Conditional + infer", summary: "Write a type to extract the resolved type of a Promise.", description: "Create a utility UnwrapPromise<T> that extracts the fulfilled type of Promise<T>, leaving non-promises untouched.", hints: [
        "Use conditional with infer U on Promise<U>.",
        "Fallback to T if not a promise.",
    ], solution: `type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;` },
    { id: "p15", title: "Async result type", difficulty: "Medium", concept: "Async/Await", summary: "Type an async function fetching users with rejection handling.", description: "Type an async fetchUser that returns a typed user or throws; ensure call sites see Promise<User>. Add a catch block that narrows unknown errors.", hints: [
        "Return Promise<User> from the function signature.",
        "In catch, check err instanceof Error before using message.",
    ], solution: `type User = { id: string; name: string };

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(\`/users/\${id}\`);
  if (!res.ok) throw new Error("Request failed");
  return res.json() as Promise<User>;
}

async function safeGet(id: string) {
  try {
    return await fetchUser(id);
  } catch (err: unknown) {
    if (err instanceof Error) return err.message;
    return "Unknown error";
  }
}` },
    { id: "p16", title: "Exact optionals", difficulty: "Medium", concept: "tsconfig strict", summary: "Model optional props without allowing undefined assignments.", description: "Show how exactOptionalPropertyTypes affects assignment; create a type that forbids setting optional props to undefined unless explicitly allowed.", hints: [
        "Use exactOptionalPropertyTypes in mind: optional means absent, not undefined.",
        "Prefer prop?: T | undefined if you truly want undefined.",
    ], solution: `type User = { name: string; email?: string };

const u: User = { name: "Ada" };
// u.email = undefined; // error with exactOptionalPropertyTypes
const v: User = { name: "Ada", email: "a@b.com" };` },
    { id: "p17", title: "Branded IDs", difficulty: "Medium", concept: "Opaque/branded types", summary: "Create branded types to avoid mixing userId and orgId.", description: "Brand string IDs to avoid mixing domains, and show functions that only accept the right branded ID.", hints: [
        "Intersect string with a unique symbol property.",
        "Expose factory functions to brand raw strings.",
    ], solution: `type Brand<K, T> = K & { __brand: T };
type UserId = Brand<string, "UserId">;
type OrgId = Brand<string, "OrgId">;

function makeUserId(id: string): UserId {
  return id as UserId;
}

function loadUser(id: UserId) {
  console.log(id);
}

const uid = makeUserId("u1");
// loadUser("u1"); // error
loadUser(uid);` },
    { id: "p18", title: "Array vs tuple params", difficulty: "Easy", concept: "Tuples & rest", summary: "Type a function that accepts a variadic tuple and returns the head.", description: "Given a tuple input, return its first element while preserving literal types.", hints: [
        "Use a generic tuple T extends unknown[].",
        "Return T[0].",
    ], solution: `function head<T extends unknown[]>(items: readonly [...T]): T[0] | undefined {
  return items[0];
}` },
    { id: "p19", title: "Readonly arrays", difficulty: "Easy", concept: "Readonly collections", summary: "Prevent mutation of an array returned from a function.", description: "Return a readonly array and show that mutation attempts fail.", hints: [
        "Use readonly T[] or ReadonlyArray<T> in return type.",
        "Expose methods that do not mutate.",
    ], solution: `function getNames(): readonly string[] {
  return ["Ada", "Linus"] as const;
}
const names = getNames();
// names.push("Grace"); // error` },
    { id: "p20", title: "Intersection composition", difficulty: "Medium", concept: "Intersections", summary: "Combine mixins while avoiding field conflicts.", description: "Compose two object types with intersections; ensure overlapping keys remain compatible.", hints: [
        "Intersections merge fields; types must be compatible.",
        "Avoid conflicting types on the same key.",
    ], solution: `type Position = { x: number; y: number };
type Sized = { w: number; h: number };
type Rect = Position & Sized;
const r: Rect = { x: 0, y: 0, w: 10, h: 5 };` },
    { id: "p21", title: "Module interop", difficulty: "Medium", concept: "Modules/ESM/CJS", summary: "Type imports for a CommonJS module consumed in ESM.", description: "Type a CJS module with declare module, then import it in ESM style with correct default/named interop.", hints: [
        "Use declare module \"pkg\" { export = fn } for CJS default export.",
        "Consume with import pkg from \"pkg\".",
    ], solution: `// ambient.d.ts
declare module "cjs-lib" {
  function fn(x: number): number;
  export = fn;
}

// usage
import fn from "cjs-lib";
fn(2);` },
    { id: "p22", title: "Type-only imports", difficulty: "Easy", concept: "Modules", summary: "Refactor imports to use import type and reduce bundle impact.", description: "Split type imports from value imports; ensure tree-shaking friendly code.", hints: [
        "Use import type { Foo } from \"./types\";",
        "Keep value imports for runtime only.",
    ], solution: `import type { User } from "./types";
import { fetchUser } from "./api";

async function load(id: string): Promise<User> {
  return fetchUser(id);
}` },
    { id: "p23", title: "Index signature safety", difficulty: "Medium", concept: "Index signatures", summary: "Add noUncheckedIndexedAccess-safe indexing to a map.", description: "Given a string-to-number map, add safe getters that return number | undefined respecting noUncheckedIndexedAccess.", hints: [
        "Use Record<string, number> but return number | undefined on lookup.",
        "Guard existence before using.",
    ], solution: `const scores: Record<string, number> = {};
function getScore(id: string): number | undefined {
  return scores[id];
}

const s = getScore("alice");
if (s !== undefined) console.log(s.toFixed(2));` },
    { id: "p24", title: "Form element assertion", difficulty: "Easy", concept: "Type assertions", summary: "Safely cast a queried element to HTMLFormElement with guards.", description: "Query an element, guard its tagName, and then treat it as HTMLFormElement.", hints: [
        "Check el instanceof HTMLFormElement or tagName === \"FORM\".",
        "Avoid bare as without guards.",
    ], solution: `const el = document.getElementById("my-form");

if (el instanceof HTMLFormElement) {
  el.submit();
}` },
    { id: "p25", title: "Distribute over union", difficulty: "Hard", concept: "Conditional types", summary: "Write a conditional type that distributes over union members.", description: "Demonstrate distributive conditional types by boxing each member of a union and excluding a member via never.", starterCode: `type Box<T> = T extends any ? { value: T } : never;

type Input = string | number;
type Result = Box<Input>; // expected: { value: string } | { value: number }
`, hints: [
        "Make the checked type a naked generic to allow distribution.",
        "Return never to drop members you don't want.",
    ], solution: `type Box<T> = T extends any ? { value: T } : never;

type Input = string | number;
type Result = Box<Input>; // { value: string } | { value: number }
` },
    { id: "p26", title: "Event map remap", difficulty: "Hard", concept: "Key remapping", summary: "Map keys to handler names using mapped types with as.", description: "Remap event keys to onX names using mapped types and key remapping.", hints: [
        "Use [K in keyof T as `on${Capitalize<string & K>}`]: ...",
        "Capitalize the key to build the handler name.",
    ], solution: `type Handlers<T> = {
  [K in keyof T as \`on\${Capitalize<string & K>}\`]: (value: T[K]) => void;
};` },
    { id: "p27", title: "Zod-style infer", difficulty: "Hard", concept: "infer usage", summary: "Extract a runtime schema’s TS type using infer in conditionals.", description: "Given a Schema<T> type with a _type field, write an Infer<T> helper that extracts it using infer.", hints: [
        "Pattern-match Schema<infer U> in a conditional type.",
        "Return never if not a Schema.",
    ], solution: `type Schema<T> = { parse: (v: unknown) => T; _type: T };
type Infer<T> = T extends Schema<infer U> ? U : never;` },
    { id: "p28", title: "Deep partial", difficulty: "Hard", concept: "Mapped types", summary: "Implement a DeepPartial utility respecting arrays/objects.", description: "Make every property optional recursively, handling arrays as arrays of DeepPartial of the element.", hints: [
        "Check if T extends (infer U)[] to handle arrays.",
        "Recurse into object properties otherwise.",
    ], solution: `type DeepPartial<T> = T extends (infer U)[]
  ? DeepPartial<U>[]
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;` },
    { id: "p29", title: "Promise queue", difficulty: "Medium", concept: "Async control", summary: "Type a queue that processes tasks sequentially with async handlers.", description: "Create a Queue<T> where enqueue returns Promise<R> and tasks run sequentially.", hints: [
        "Store a tail promise and chain tasks onto it.",
        "Use generic T for input and R for result.",
    ], solution: `class Queue {
  private tail = Promise.resolve();
  enqueue<T>(task: () => Promise<T>): Promise<T> {
    this.tail = this.tail.then(() => task());
    return this.tail;
  }
}` },
    { id: "p30", title: "Abortable fetch wrapper", difficulty: "Medium", concept: "Async + AbortSignal", summary: "Type a wrapper that enforces AbortSignal usage.", description: "Wrap fetch to always require an AbortSignal and return typed JSON.", hints: [
        "Add signal: AbortSignal to the params type.",
        "Return Promise<Result> with Awaited.",
    ], solution: `async function fetchJson<T>(url: string, opts: { signal: AbortSignal }): Promise<T> {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error("Request failed");
  return res.json() as Promise<T>;
}` },
    { id: "p31", title: "Discriminated UI state", difficulty: "Easy", concept: "Unions", summary: "Model loading/success/error UI state and render branches.", description: "Create a UIState union with status and render a message based on it.", hints: [
        "Use a status discriminant.",
        "Ensure exhaustive handling.",
    ], solution: `type UIState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string }
  | { status: "error"; message: string };

function render(state: UIState): string {
  switch (state.status) {
    case "idle": return "Idle";
    case "loading": return "Loading";
    case "success": return state.data;
    case "error": return state.message;
  }
}` },
    { id: "p32", title: "Safe JSON parse", difficulty: "Medium", concept: "unknown & guards", summary: "Parse JSON into unknown then narrow to expected shape.", description: "Parse JSON, then narrow it to a required shape with guards before returning.", hints: [
        "JSON.parse returns any; cast to unknown first.",
        "Check object shape before returning.",
    ], solution: `type User = { id: string; name: string };

function parseUser(json: string): User {
  const data: unknown = JSON.parse(json);
  if (typeof data === "object" && data !== null && "id" in data && "name" in data) {
    const { id, name } = data as Record<string, unknown>;
    if (typeof id === "string" && typeof name === "string") return { id, name };
  }
  throw new Error("Bad json");
}` },
    { id: "p33", title: "Readonly tuple labels", difficulty: "Easy", concept: "Tuples", summary: "Create a labeled readonly tuple for RGB values.", description: "Make a readonly RGB tuple with labeled elements and show mutation errors.", hints: [
        "Use readonly [r: number, g: number, b: number].",
        "Annotate a const value with the tuple type.",
    ], solution: `type RGB = readonly [r: number, g: number, b: number];
const red: RGB = [255, 0, 0] as const;
// red[0] = 0; // error` },
    { id: "p34", title: "Function this typing", difficulty: "Hard", concept: "Functions & this", summary: "Type a method that relies on this, preserving context.", description: "Type a function that uses this to access fields; ensure it errors if detached.", hints: [
        "Use a this parameter: function f(this: Obj, ...).",
        "Bind or call with correct this.",
    ], solution: `type Counter = { value: number; inc(this: Counter): void };

const counter: Counter = {
  value: 0,
  inc() { this.value += 1; },
};

counter.inc();
// const fn = counter.inc; fn(); // error in TS with noImplicitThis` },
    { id: "p35", title: "Overload vs union", difficulty: "Medium", concept: "Overloads vs unions", summary: "Refactor overloads into a union parameter design.", description: "Show how a union parameter can replace multiple overloads while keeping safety.", hints: [
        "Use a union param with a discriminant.",
        "Return type can be derived from the discriminant.",
    ], solution: `type Input = { kind: "text"; value: string } | { kind: "num"; value: number };

function fmt(input: Input): string {
  return input.kind === "text" ? input.value.toUpperCase() : input.value.toFixed(2);
}` },
    { id: "p36", title: "Mapper of DTOs", difficulty: "Medium", concept: "Mapped types", summary: "Transform an API response type into a view model type.", description: "Given an API response type, map field names/types to a UI model.", hints: [
        "Use a mapped type to rename keys.",
        "Use as to remap key names.",
    ], solution: `type ApiUser = { first_name: string; last_name: string };
type UiUser = { [K in keyof ApiUser as K extends "first_name" ? "firstName" : "lastName"]: ApiUser[K] };` },
    { id: "p37", title: "Keyof assertions", difficulty: "Medium", concept: "Type guards", summary: "Create a guard that asserts a string is a key of an object.", description: "Implement isKey(obj, key): key is keyof typeof obj.", hints: [
        "Check key in obj at runtime.",
        "Use a predicate return type.",
    ], solution: `function isKey<T extends object>(obj: T, key: PropertyKey): key is keyof T {
  return key in obj;
}` },
    { id: "p38", title: "Mutable to immutable", difficulty: "Easy", concept: "Readonly utility", summary: "Convert a mutable object type to a readonly version.", description: "Given a mutable type, produce its readonly counterpart.", hints: [
        "Use Readonly<T> or a mapped type with readonly.",
    ], solution: `type Immutable<T> = { readonly [K in keyof T]: T[K] };` },
    { id: "p39", title: "Filter props", difficulty: "Hard", concept: "Mapped + Conditional", summary: "Create a type that picks only function properties from an object.", description: "Pick only keys whose values are functions, returning a new type.", hints: [
        "Use conditional on T[K] extends Function.",
        "Map keys to never to drop them.",
    ], solution: `type OnlyFunctions<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};` },
    { id: "p40", title: "Pick by value type", difficulty: "Hard", concept: "Conditional + keyof", summary: "Pick keys whose values extend a given type.", description: "Extract keys where T[K] extends V.", hints: [
        "Use a helper KeysOfType<T, V> with conditional and as.",
    ], solution: `type KeysOfType<T, V> = { [K in keyof T]: T[K] extends V ? K : never }[keyof T];` },
    { id: "p41", title: "Optional chaining safety", difficulty: "Easy", concept: "Strict null checks", summary: "Refactor code to satisfy strictNullChecks without !.", description: "Rewrite access to nested props with null guards instead of non-null assertions.", hints: [
        "Check value before accessing deeper props.",
        "Use optional chaining and nullish coalescing.",
    ], solution: `function upper(name?: { first?: string }) {
  return name?.first?.toUpperCase() ?? "N/A";
}` },
    { id: "p42", title: "Tuple to union", difficulty: "Easy", concept: "Indexed access", summary: "Turn a readonly tuple of strings into a union type.", description: "Given a readonly tuple, produce a union of its element types.", hints: [
        "Use T[number] on a readonly tuple type.",
    ], solution: `const routes = ["home", "about", "contact"] as const;
type Route = typeof routes[number];` },
    { id: "p43", title: "Variadic tuple append", difficulty: "Medium", concept: "Variadic tuples", summary: "Append an element to a tuple type preserving labels.", description: "Create a type Append<T, U> that appends U to tuple T.", hints: [
        "Use [...T, U] with T extends unknown[].",
    ], solution: `type Append<T extends unknown[], U> = [...T, U];` },
    { id: "p44", title: "Awaited utility", difficulty: "Easy", concept: "Awaited<T>", summary: "Use Awaited to unwrap nested Promise types.", description: "Demonstrate Awaited on Promise<Promise<T>> to get T.", hints: [
        "Awaited<T> handles nested promises.",
    ], solution: `type Resolved = Awaited<Promise<Promise<string>>>; // string` },
    { id: "p45", title: "NonNullable pipeline", difficulty: "Medium", concept: "NonNullable", summary: "Ensure a pipeline output excludes null/undefined.", description: "Create a helper that returns NonNullable<T> of its input and shows runtime guard.", hints: [
        "Use NonNullable<T> in the return type.",
        "Check value != null at runtime.",
    ], solution: `function requireValue<T>(value: T): NonNullable<T> {
  if (value == null) throw new Error("Missing");
  return value as NonNullable<T>;
}` },
    { id: "p46", title: "Readonly Map wrapper", difficulty: "Medium", concept: "Interfaces vs types", summary: "Expose a read-only view over a Map with iterators.", description: "Define a ReadonlyMap-like interface and implement a wrapper that prevents mutation.", hints: [
        "Omit mutating methods, keep getters and iterators.",
    ], solution: `interface IReadonlyMap<K, V> {
  get(key: K): V | undefined;
  has(key: K): boolean;
  readonly size: number;
  [Symbol.iterator](): IterableIterator<[K, V]>;
}

function asReadonly<K, V>(map: Map<K, V>): IReadonlyMap<K, V> {
  return map;
}` },
    { id: "p47", title: "Ambient module typing", difficulty: "Medium", concept: "Ambient declarations", summary: "Type an untyped npm package via declare module.", description: "Write a declare module for an untyped package exposing a function.", hints: [
        "Use declare module \"pkg\" { export function ... }",
    ], solution: `declare module "legacy-pkg" {
  export function doThing(x: number): string;
}` },
    { id: "p48", title: "Global augmentation", difficulty: "Medium", concept: "Declaration merging", summary: "Augment Window with a typed config object.", description: "Extend the Window interface to include a config object and use it safely.", hints: [
        "Use declare global and interface Window { ... }",
    ], solution: `declare global {
  interface Window {
    appConfig: { version: string };
  }
}` },
    { id: "p49", title: "Error branding", difficulty: "Medium", concept: "Discriminated unions", summary: "Create typed errors with codes and narrow by code.", description: "Model errors with a code field and narrow by code to produce messages.", hints: [
        "Use code as discriminant.",
        "Handle each code exhaustively.",
    ], solution: `type AppError =
  | { code: "NETWORK"; message: string }
  | { code: "AUTH"; message: string };

function message(err: AppError): string {
  switch (err.code) {
    case "NETWORK": return "Network error: " + err.message;
    case "AUTH": return "Auth error: " + err.message;
  }
}` },
    { id: "p50", title: "CLI args parser", difficulty: "Hard", concept: "Template literals + conditionals", summary: "Type a CLI flag parser with inferred output object.", description: "Given flags like --port=3000 --dev, produce a typed object with correct value types using template literal types.", hints: [
        "Parse strings with template literal types to split key/value.",
        "Map boolean flags vs key=value pairs differently.",
    ], solution: `type Flag<T extends string> =
  T extends \`--\${infer K}=\${infer V}\` ? { [k in K]: V } :
  T extends \`--\${infer K}\` ? { [k in K]: true } :
  never;` },
];

