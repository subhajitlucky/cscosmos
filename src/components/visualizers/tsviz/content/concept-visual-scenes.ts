export interface VizStackSlot {
    id: string;
    label: string;
    value: string;
    type?: string;
    pointsTo?: string;
    address?: string;
    size?: string;
}

export interface VizHeapObject {
    id: string;
    label: string;
    fields: { key: string; value: string; type?: string }[];
    note?: string;
    address?: string;
    size?: string;
}

export interface VizStep {
    title: string;
    description: string;
    stack: VizStackSlot[];
    heap?: VizHeapObject[];
}

export interface VizScene {
    title: string;
    steps: VizStep[];
}

export const conceptVisualScenes: Record<string, VizScene> = {
    primitives: {
        title: "Stack copies vs references",
        steps: [
            {
                title: "Declare primitives",
                description: "Primitives live on the stack with their literal values.",
                stack: [
                    { id: "language", label: "language", value: `"TypeScript"`, type: "string", address: "0x1000", size: "~16B" },
                    { id: "years", label: "years", value: "10", type: "number", address: "0x1008", size: "8B" },
                ],
            },
            {
                title: "Copy by value",
                description: "Assigning copies the value; the new slot is independent.",
                stack: [
                    { id: "language", label: "language", value: `"TypeScript"`, type: "string", address: "0x1000", size: "~16B" },
                    { id: "copy", label: "copy = language", value: `"TypeScript"`, type: "string", address: "0x1010", size: "~16B" },
                ],
            },
            {
                title: "Reassign original",
                description: "Updating the original does not affect the copy.",
                stack: [
                    { id: "language", label: "language", value: `"TS"`, type: "string", address: "0x1000", size: "~4B" },
                    { id: "copy", label: "copy", value: `"TypeScript"`, type: "string", address: "0x1010", size: "~16B" },
                ],
            },
            {
                title: "Reference value (object)",
                description: "Objects live on the heap; stack holds a reference.",
                stack: [
                    { id: "userRef", label: "user", value: "→ user#1", type: "User", pointsTo: "user1", address: "0x1020", size: "8B (ref)" },
                ],
                heap: [
                    { id: "user1", label: "user#1", fields: [
                        { key: "name", value: `"Ada"`, type: "string" },
                        { key: "role", value: `"member"`, type: "string" },
                    ], address: "0x2000", size: "~48B" },
                ],
            },
            {
                title: "Copy reference",
                description: "Copying the reference points to the same heap object.",
                stack: [
                    { id: "userRef", label: "user", value: "→ user#1", type: "User", pointsTo: "user1", address: "0x1020", size: "8B (ref)" },
                    { id: "alias", label: "alias = user", value: "→ user#1", type: "User", pointsTo: "user1", address: "0x1028", size: "8B (ref)" },
                ],
                heap: [
                    { id: "user1", label: "user#1", fields: [
                        { key: "name", value: `"Ada"`, type: "string" },
                        { key: "role", value: `"member"`, type: "string" },
                    ], address: "0x2000", size: "~48B" },
                ],
            },
            {
                title: "Mutate through alias",
                description: "Changing via alias affects the shared heap object.",
                stack: [
                    { id: "userRef", label: "user", value: "→ user#1", type: "User", pointsTo: "user1", address: "0x1020", size: "8B (ref)" },
                    { id: "alias", label: "alias", value: "→ user#1", type: "User", pointsTo: "user1", address: "0x1028", size: "8B (ref)" },
                ],
                heap: [
                    { id: "user1", label: "user#1", fields: [
                        { key: "name", value: `"Ada"`, type: "string" },
                        { key: "role", value: `"admin"`, type: "string" },
                    ], note: "Both references see updated role", address: "0x2000", size: "~48B" },
                ],
            },
        ],
    },
    functions: {
        title: "Call stack & return",
        steps: [
            {
                title: "Call with params",
                description: "Arguments are bound to parameters on the stack.",
                stack: [
                    { id: "param-name", label: "name", value: `"Ada"`, type: "string" },
                    { id: "param-age", label: "age?", value: "undefined", type: "number | undefined" },
                ],
            },
            {
                title: "Compute result",
                description: "Body executes; locals appear on the stack.",
                stack: [
                    { id: "param-name", label: "name", value: `"Ada"`, type: "string" },
                    { id: "display", label: "display", value: `"Ada"`, type: "string" },
                ],
            },
            {
                title: "Return",
                description: "Return value is produced; frame will pop afterward.",
                stack: [
                    { id: "return", label: "return", value: `"Hello, Ada!"`, type: "string" },
                ],
            },
        ],
    },
    "interfaces-vs-types": {
        title: "Shape compatibility",
        steps: [
            {
                title: "Create object",
                description: "Stack variable points to a heap object shaped by interface/type.",
                stack: [
                    { id: "userRef", label: "user: User", value: "→ user#1", type: "User", pointsTo: "user1" },
                ],
                heap: [
                    { id: "user1", label: "user#1", fields: [
                        { key: "id", value: "1", type: "number" },
                        { key: "name", value: `"Ada"`, type: "string" },
                        { key: "email", value: `"ada@example.com"`, type: "string" },
                    ]},
                ],
            },
            {
                title: "Extend/merge",
                description: "An extended shape (Admin) reuses the base object layout.",
                stack: [
                    { id: "adminRef", label: "admin: Admin", value: "→ admin#1", type: "Admin", pointsTo: "admin1" },
                ],
                heap: [
                    { id: "admin1", label: "admin#1", fields: [
                        { key: "id", value: "1", type: "number" },
                        { key: "name", value: `"Ada"`, type: "string" },
                        { key: "email", value: `"ada@example.com"`, type: "string" },
                        { key: "role", value: `"owner"`, type: "string" },
                    ]},
                ],
            },
            {
                title: "Union case",
                description: "A union variable can point to different compatible shapes; guards narrow it.",
                stack: [
                    { id: "account", label: "account: User | Admin", value: "→ admin#1", type: "union", pointsTo: "admin1" },
                ],
                heap: [
                    { id: "admin1", label: "admin#1", fields: [
                        { key: "name", value: `"Ada"`, type: "string" },
                        { key: "role", value: `"owner"`, type: "string" },
                    ], note: "Guard role to treat as Admin" },
                ],
            },
        ],
    },
    "type-inference": {
        title: "Inference from context",
        steps: [
            {
                title: "Initializer",
                description: "Literal seeds a specific inferred type.",
                stack: [
                    { id: "name", label: "name", value: `"Alice"`, type: "string" },
                    { id: "count", label: "count", value: "42", type: "number" },
                ],
            },
            {
                title: "Contextual typing",
                description: "Callback position narrows parameter type automatically.",
                stack: [
                    { id: "names", label: "names", value: `["Ada","Linus"]`, type: "string[]" },
                    { id: "forEach-param", label: "param", value: "string", type: "string" },
                ],
            },
            {
                title: "Best common type",
                description: "Mixed arrays widen to a union.",
                stack: [
                    { id: "mixed", label: "mixed", value: `[1, "two"]`, type: "(number | string)[]" },
                ],
            },
        ],
    },
    "literal-types": {
        title: "Finite states",
        steps: [
            {
                title: "Define literals",
                description: "A union of literals restricts allowed values.",
                stack: [
                    { id: "status", label: "status", value: `"idle"`, type: `"idle" | "loading" | "success" | "error"` },
                ],
            },
            {
                title: "Invalid blocked",
                description: "Changing to an unsupported value would fail.",
                stack: [
                    { id: "status", label: "status", value: `"loading"`, type: `"idle" | "loading" | "success" | "error"` },
                ],
            },
            {
                title: "Enum compare",
                description: "Literal unions are tree-shakeable; enums create runtime objects.",
                stack: [
                    { id: "direction", label: "direction", value: `"UP"`, type: `"UP" | "DOWN"` },
                ],
            },
        ],
    },
    tuples: {
        title: "Positional meaning",
        steps: [
            {
                title: "Tuple declaration",
                description: "Each position has its own type and meaning.",
                stack: [
                    { id: "point", label: "point", value: "[0, 0]", type: "[x: number, y: number]" },
                ],
            },
            {
                title: "Readonly tuple",
                description: "Readonly prevents mutation after creation.",
                stack: [
                    { id: "rgb", label: "rgb", value: "[255, 0, 0]", type: "readonly [number, number, number]" },
                ],
            },
            {
                title: "Variadic tuple",
                description: "Prefix plus variadic tail for flexible APIs.",
                stack: [
                    { id: "withId", label: "withId", value: `["team-1", "alice", "bob"]`, type: "[id: string, ...string[]]" },
                ],
            },
        ],
    },
    "safety-types": {
        title: "Safety-first handling",
        steps: [
            {
                title: "Unknown ingress",
                description: "Unknown forces checks before use.",
                stack: [
                    { id: "input", label: "input", value: "unknown", type: "unknown" },
                ],
            },
            {
                title: "Narrowed branch",
                description: "After typeof check, value becomes string.",
                stack: [
                    { id: "input", label: "input (narrowed)", value: `"HELLO"`, type: "string" },
                ],
            },
            {
                title: "Exhaustiveness",
                description: "never catches missing branches.",
                stack: [
                    { id: "result", label: "result", value: "never hits default", type: "never" },
                ],
            },
        ],
    },
    "unions-intersections": {
        title: "Branch and combine",
        steps: [
            {
                title: "Union states (API response)",
                description: "Value can be one of several shapes.",
                stack: [
                    { id: "response", label: "response", value: "→ success#1", type: "Success | Error", pointsTo: "success1", address: "0x3000", size: "8B (ref)" },
                ],
                heap: [
                    { id: "success1", label: "success#1", address: "0x4000", size: "~32B", fields: [
                        { key: "status", value: `"success"` },
                        { key: "data", value: `"ok"` },
                    ]},
                ],
            },
            {
                title: "Guard to error",
                description: "After checking status, we branch to error shape.",
                stack: [
                    { id: "response", label: "response", value: "→ error#1", type: "Success | Error", pointsTo: "error1", address: "0x3000", size: "8B (ref)" },
                ],
                heap: [
                    { id: "error1", label: "error#1", address: "0x4010", size: "~32B", fields: [
                        { key: "status", value: `"error"` },
                        { key: "message", value: `"fail"` },
                    ], note: "Guarded by status === 'error'" },
                ],
            },
            {
                title: "Intersection (compose capabilities)",
                description: "Combine traits: Identified & Timestamped.",
                stack: [
                    { id: "entity", label: "entity", value: "{id, createdAt}", type: "Identified & Timestamped", address: "0x3008", size: "~24B" },
                ],
            },
        ],
    },
    "type-guards": {
        title: "Narrowing paths",
        steps: [
            {
                title: "Before guard",
                description: "Value is a union; properties are limited.",
                stack: [
                    { id: "value", label: "value", value: "unknown user", type: "{ id: string } | string", address: "0x3100", size: "16B" },
                ],
            },
            {
                title: "Apply guard",
                description: "Predicate proves the shape; fields become accessible.",
                stack: [
                    { id: "value", label: "value", value: "{ id: 'u1' }", type: "{ id: string }", address: "0x3100", size: "16B" },
                ],
            },
            {
                title: "Exhaustiveness",
                description: "never branch ensures all variants handled.",
                stack: [
                    { id: "never", label: "never", value: "unreachable", type: "never", address: "—", size: "0B" },
                ],
            },
        ],
    },
    "type-assertions": {
        title: "Asserting with proof",
        steps: [
            {
                title: "Unknown element",
                description: "DOM query returns a broad type.",
                stack: [
                    { id: "el", label: "el", value: "HTMLElement | null", type: "HTMLElement | null", address: "0x3300", size: "16B" },
                ],
            },
            {
                title: "Runtime check",
                description: "Check tagName before asserting.",
                stack: [
                    { id: "el", label: "el (checked)", value: "HTMLInputElement", type: "HTMLInputElement", address: "0x3300", size: "16B" },
                ],
            },
            {
                title: "Use safely",
                description: "After guard, safe to read .value.",
                stack: [
                    { id: "value", label: "value", value: `"hello"`, type: "string", address: "0x3308", size: "~8B" },
                ],
            },
            {
                title: "satisfies keeps literals",
                description: "Validate shape without widening literals.",
                stack: [
                    { id: "config", label: "config", value: "{env:'prod', retry:3}", type: "{ env: 'prod'; retry: number }", address: "0x3310", size: "~24B" },
                ],
                heap: [
                    { id: "configObj", label: "config#1", address: "0x4300", size: "~40B", fields: [
                        { key: "env", value: `"prod"` },
                        { key: "retry", value: "3" },
                    ], note: "satisfies prevents widening env" },
                ],
            },
        ],
    },
    "type-queries": {
        title: "Sync runtime and types",
        steps: [
            {
                title: "Derive from value",
                description: "typeof captures the exact structure.",
                stack: [
                    { id: "user", label: "user", value: `{id:1,name:"Ada"}`, type: "const object", address: "0x3400", size: "~32B" },
                    { id: "User", label: "type User", value: "typeof user", type: "type", address: "—", size: "—" },
                ],
            },
            {
                title: "Keys union",
                description: "keyof enumerates allowed property names.",
                stack: [
                    { id: "UserKeys", label: "type UserKeys", value: `"id" | "name"`, type: "keyof User", address: "—", size: "—" },
                ],
            },
            {
                title: "Indexed access",
                description: "Pull a property type directly.",
                stack: [
                    { id: "NameType", label: "type NameType", value: "string", type: "User[\"name\"]", address: "—", size: "—" },
                ],
            },
        ],
    },
    classes: {
        title: "Instances and fields",
        steps: [
            {
                title: "Instantiate",
                description: "Stack reference points to heap object with private fields.",
                stack: [
                    { id: "rectRef", label: "rect", value: "→ rect#1", type: "Rectangle", pointsTo: "rect1" },
                ],
                heap: [
                    { id: "rect1", label: "rect#1", fields: [
                        { key: "#width", value: "10" },
                        { key: "#height", value: "4" },
                        { key: "color", value: `"blue"` },
                    ], note: "Private fields hidden from callers" },
                ],
            },
            {
                title: "Method call",
                description: "Methods use this to access fields; stack holds params/local.",
                stack: [
                    { id: "this", label: "this", value: "→ rect#1", type: "Rectangle", pointsTo: "rect1" },
                    { id: "area", label: "area()", value: "40", type: "number" },
                ],
                heap: [
                    { id: "rect1", label: "rect#1", fields: [
                        { key: "#width", value: "10" },
                        { key: "#height", value: "4" },
                    ]},
                ],
            },
            {
                title: "Readonly fields",
                description: "readonly prevents mutation after construction.",
                stack: [
                    { id: "readonlyNote", label: "note", value: "color is readonly", type: "readonly" },
                ],
            },
        ],
    },
    modules: {
        title: "Module boundaries",
        steps: [
            {
                title: "Import type only",
                description: "import type avoids pulling runtime code.",
                stack: [
                    { id: "UserType", label: "import type User", value: "type-only", type: "type", address: "—", size: "—" },
                ],
            },
            {
                title: "Import value",
                description: "Value import brings runtime binding.",
                stack: [
                    { id: "fetchUser", label: "import fetchUser", value: "function", type: "value", address: "0x3500", size: "8B (ref)" },
                ],
            },
            {
                title: "Interop note",
                description: "Default vs named must match CJS/ESM exports.",
                stack: [
                    { id: "interop", label: "interop", value: "match export style", type: "tip", address: "—", size: "—" },
                ],
            },
        ],
    },
    "tsconfig-strict": {
        title: "Compiler guardrails",
        steps: [
            {
                title: "Enable strict",
                description: "strict bundle activates core safety checks.",
                stack: [
                    { id: "strict", label: "strict", value: "on", type: "flag", address: "—", size: "—" },
                    { id: "noImplicitAny", label: "noImplicitAny", value: "on", type: "flag", address: "—", size: "—" },
                ],
            },
            {
                title: "Null safety",
                description: "strictNullChecks + noUncheckedIndexedAccess prevent undefined crashes.",
                stack: [
                    { id: "strictNullChecks", label: "strictNullChecks", value: "on", type: "flag", address: "—", size: "—" },
                    { id: "noUncheckedIndexedAccess", label: "noUncheckedIndexedAccess", value: "on", type: "flag", address: "—", size: "—" },
                ],
            },
            {
                title: "Exact optionals",
                description: "exactOptionalPropertyTypes avoids silent optional misuse.",
                stack: [
                    { id: "exactOptional", label: "exactOptionalPropertyTypes", value: "on", type: "flag", address: "—", size: "—" },
                ],
            },
        ],
    },
    "async-await": {
        title: "Promise lifecycle",
        steps: [
            {
                title: "Call async",
                description: "Async function returns a Promise immediately (pending).",
                stack: [
                    { id: "userPromise", label: "userPromise", value: "Promise<pending>", type: "Promise<User>", address: "0x3200", size: "24B" },
                ],
                heap: [
                    { id: "promiseState", label: "PromiseState", address: "0x4200", size: "~32B", fields: [
                        { key: "state", value: `"pending"` },
                        { key: "value", value: "—" },
                    ], note: "Handlers queued" },
                ],
            },
            {
                title: "Fulfill",
                description: "Promise resolves; awaiting code can resume.",
                stack: [
                    { id: "userPromise", label: "userPromise", value: "Promise<fulfilled>", type: "Promise<User>", address: "0x3200", size: "24B" },
                    { id: "user", label: "user", value: "{id:'1', name:'Ada'}", type: "User", address: "0x3210", size: "~32B" },
                ],
                heap: [
                    { id: "promiseState", label: "PromiseState", address: "0x4200", size: "~32B", fields: [
                        { key: "state", value: `"fulfilled"` },
                        { key: "value", value: "{id:'1', name:'Ada'}" },
                    ]},
                ],
            },
            {
                title: "Reject and catch",
                description: "Error path: err is unknown; narrow before use.",
                stack: [
                    { id: "userPromise", label: "userPromise", value: "Promise<rejected>", type: "Promise<User>", address: "0x3200", size: "24B" },
                    { id: "err", label: "err", value: "unknown", type: "unknown", address: "0x3220", size: "~16B" },
                ],
                heap: [
                    { id: "promiseState", label: "PromiseState", address: "0x4200", size: "~32B", fields: [
                        { key: "state", value: `"rejected"` },
                        { key: "reason", value: `"NetworkError"` },
                    ], note: "Catch branch narrows err" },
                ],
            },
            {
                title: "Abort (cancellation)",
                description: "AbortSignal triggers cancellation to avoid wasted work.",
                stack: [
                    { id: "controller", label: "controller", value: "→ signal#1", type: "AbortController", pointsTo: "signal1", address: "0x3230", size: "8B (ref)" },
                ],
                heap: [
                    { id: "signal1", label: "signal#1", address: "0x4210", size: "~24B", fields: [
                        { key: "aborted", value: "true" },
                        { key: "reason", value: `"user aborted"` },
                    ], note: "Listeners notified; requests canceled" },
                ],
            },
        ],
    },
    generics: {
        title: "Reusable type params",
        steps: [
            {
                title: "Parameterize",
                description: "Generic function captures caller type.",
                stack: [
                    { id: "T", label: "T", value: "string", type: "type param" },
                    { id: "value", label: "value", value: `"hi"`, type: "T" },
                ],
            },
            {
                title: "Constrain",
                description: "extends limits what T can be.",
                stack: [
                    { id: "T2", label: "T extends {id}", value: "{id:'u1'}", type: "type param" },
                ],
            },
            {
                title: "Default",
                description: "Provide defaults to reduce noise.",
                stack: [
                    { id: "TDefault", label: "T = unknown", value: "defaulted", type: "type param" },
                ],
            },
        ],
    },
    "utility-types": {
        title: "Transform shapes quickly",
        steps: [
            {
                title: "Pick/Omit",
                description: "Select only the fields needed.",
                stack: [
                    { id: "preview", label: "UserPreview", value: "{id,name}", type: "Pick<User>" },
                ],
            },
            {
                title: "Partial/Required",
                description: "Toggle optionality for drafts vs persisted.",
                stack: [
                    { id: "draft", label: "UserDraft", value: "all optional", type: "Partial<User>" },
                ],
            },
            {
                title: "ReturnType/Parameters",
                description: "Mirror function surfaces to avoid drift.",
                stack: [
                    { id: "fnTypes", label: "FnTypes", value: "{args, return}", type: "ReturnType/Parameters" },
                ],
            },
        ],
    },
    "mapped-types": {
        title: "Iterate keys",
        steps: [
            {
                title: "Readonly map",
                description: "Map over keys to lock fields.",
                stack: [
                    { id: "readonlyUser", label: "Readonly<User>", value: "all readonly", type: "mapped" },
                ],
            },
            {
                title: "Remove optional",
                description: "Use -? to require fields.",
                stack: [
                    { id: "requiredUser", label: "Required<User>", value: "no optionals", type: "mapped" },
                ],
            },
            {
                title: "Remap keys",
                description: "Rename keys with 'as'.",
                stack: [
                    { id: "handlers", label: "Handlers", value: "onClick/onFocus", type: "mapped as" },
                ],
            },
        ],
    },
    "conditional-types": {
        title: "Branch on assignability",
        steps: [
            {
                title: "Check",
                description: "T extends U ? X : Y selects a branch.",
                stack: [
                    { id: "isString", label: "IsString<number>", value: "false", type: "boolean" },
                ],
            },
            {
                title: "Infer",
                description: "infer pulls out inner pieces.",
                stack: [
                    { id: "ElementType", label: "ElementType<number[]>", value: "number", type: "type" },
                ],
            },
            {
                title: "Distribute",
                description: "Naked T distributes over unions automatically.",
                stack: [
                    { id: "NonNullable", label: "NonNullable<string | null>", value: "string", type: "type" },
                ],
            },
        ],
    },
    "template-literals": {
        title: "Typed strings",
        steps: [
            {
                title: "Compose",
                description: "Build patterns from unions.",
                stack: [
                    { id: "EventName", label: "EventName", value: "user:created | user:updated", type: "template literal" },
                ],
            },
            {
                title: "Route type",
                description: "Constrain routes with params.",
                stack: [
                    { id: "Route", label: "Route", value: '"/users/${string}"', type: "template literal" },
                ],
            },
            {
                title: "RGB format",
                description: "Ensure formatting is correct.",
                stack: [
                    { id: "RGB", label: "RGB", value: "`rgb(${number}, ${number}, ${number})`", type: "template literal" },
                ],
            },
        ],
    },
    "ambient-declarations": {
        title: "Typing externals",
        steps: [
            {
                title: "Declare module",
                description: "Provide types for an untyped package.",
                stack: [
                    { id: "uuid", label: 'declare module "uuid"', value: "v4(): string", type: "ambient" },
                ],
            },
            {
                title: "Augment global",
                description: "Extend Window/globalThis safely.",
                stack: [
                    { id: "window", label: "Window", value: "appVersion: string", type: "global augmentation" },
                ],
            },
            {
                title: "Process env",
                description: "Describe env vars for tooling.",
                stack: [
                    { id: "process", label: "process.env", value: 'NODE_ENV: "development" | "production"', type: "ambient" },
                ],
            },
        ],
    },
};

