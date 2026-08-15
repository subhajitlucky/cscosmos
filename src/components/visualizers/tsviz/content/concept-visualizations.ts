export interface VisualizationStep {
    title: string;
    detail: string;
}

export interface ConceptVisualization {
    title: string;
    description: string;
    steps: VisualizationStep[];
}

export const conceptVisualizations: Record<string, ConceptVisualization> = {
    primitives: {
        title: "Primitive values through memory",
        description: "Primitives live on the stack, copy by value, and never mutate in place.",
        steps: [
            { title: "Declare", detail: "Allocate a slot on the stack for the primitive value." },
            { title: "Copy", detail: "Assignments copy the value, so changes don’t affect the original." },
            { title: "Narrow", detail: "Control-flow checks refine the type (e.g., string -> literal) for safer use." },
        ],
    },
    functions: {
        title: "Typed function flow",
        description: "Inputs are constrained, body is checked, outputs are enforced.",
        steps: [
            { title: "Parameters", detail: "Arguments are validated against parameter types and defaults." },
            { title: "Body", detail: "Return paths must satisfy the declared (or inferred) return type." },
            { title: "Callers", detail: "Call sites get autocomplete, errors, and overload resolution." },
        ],
    },
    "interfaces-vs-types": {
        title: "Choosing interfaces or types",
        description: "Pick the right tool for extensible shapes or flexible unions.",
        steps: [
            { title: "Shape contract", detail: "Interface/type define object structure for consumers." },
            { title: "Extend or compose", detail: "Interfaces extend; types compose with intersections and unions." },
            { title: "Evolve safely", detail: "Interfaces merge; types stay exact—use based on API surface needs." },
        ],
    },
    "type-inference": {
        title: "How inference flows",
        description: "TypeScript guesses types from context to keep code concise and safe.",
        steps: [
            { title: "Initializer", detail: "A literal seeds the inferred type (string, number, literal, etc.)." },
            { title: "Context", detail: "Callback positions and assignments refine types (contextual typing)." },
            { title: "Boundaries", detail: "Annotate public APIs to prevent overly broad inference." },
        ],
    },
    "literal-types": {
        title: "Locking values with literals",
        description: "Finite sets prevent invalid states and power pattern matching.",
        steps: [
            { title: "Define", detail: "Use unions of literals for allowed states (\"idle\" | \"loading\")." },
            { title: "Derive", detail: "Use as const + typeof/[] to create unions from data." },
            { title: "Compare", detail: "Prefer unions for tree-shaking; use enums when runtime objects are needed." },
        ],
    },
    tuples: {
        title: "Tuple shapes",
        description: "Fixed positions carry meaning; readonly preserves order.",
        steps: [
            { title: "Shape", detail: "Each index has a specific type (e.g., [x: number, y: number])." },
            { title: "Label", detail: "Use labels for readability; use readonly to prevent mutation." },
            { title: "Variadic", detail: "Variadic tuples model prefixes/suffixes for flexible APIs." },
        ],
    },
    "safety-types": {
        title: "Safety-first types",
        description: "unknown and never guard correctness; void/object signal intent.",
        steps: [
            { title: "Unknown ingress", detail: "Accept untrusted input as unknown; narrow before use." },
            { title: "Exhaustive checks", detail: "Use never in switches to catch impossible states." },
            { title: "Void/object intent", detail: "Void means no useful return; object disallows primitives." },
        ],
    },
    "unions-intersections": {
        title: "Combining types",
        description: "Unions model alternatives; intersections merge capabilities.",
        steps: [
            { title: "Branch", detail: "Discriminants split union handling paths safely." },
            { title: "Compose", detail: "Intersections combine roles (e.g., Identified & Timestamped)." },
            { title: "Validate", detail: "Avoid conflicting fields; prefer unions for mutually exclusive cases." },
        ],
    },
    "type-guards": {
        title: "Narrowing with guards",
        description: "Runtime checks refine static types for safe property access.",
        steps: [
            { title: "Built-ins", detail: "Use typeof/instanceof/in to split unions." },
            { title: "Custom guards", detail: "Predicate functions (arg is T) enable reuse across code." },
            { title: "Exhaustive", detail: "A final never case proves all variants are handled." },
        ],
    },
    "type-assertions": {
        title: "Guiding the checker",
        description: "Use assertions sparingly; prefer satisfies and guards.",
        steps: [
            { title: "Narrow first", detail: "Check runtime before asserting DOM or data shapes." },
            { title: "Non-null", detail: "Use ! only after proving presence; avoid masking undefined bugs." },
            { title: "satisfies", detail: "Validate shape while keeping literal precision and no widening." },
        ],
    },
    "type-queries": {
        title: "Reflecting runtime in types",
        description: "typeof/keyof/indexed access keep types in sync with values.",
        steps: [
            { title: "Mirror", detail: "typeof captures a value’s type for reuse elsewhere." },
            { title: "Keys", detail: "keyof enumerates property names; great for event maps or DTOs." },
            { title: "Select", detail: "Indexed access T[K] pulls exact property types to avoid drift." },
        ],
    },
    classes: {
        title: "Class contracts",
        description: "Access modifiers and interfaces define safe OO patterns.",
        steps: [
            { title: "Encapsulate", detail: "private/protected/#private hide internals; readonly guards state." },
            { title: "Implement", detail: "Interfaces ensure public surface consistency." },
            { title: "Abstract", detail: "Abstract bases enforce overrides for required behaviors." },
        ],
    },
    modules: {
        title: "Module boundaries",
        description: "ESM imports/exports, type-only imports, and interop.",
        steps: [
            { title: "Import/Export", detail: "Use ESM; export type to keep runtime lean." },
            { title: "Interop", detail: "Handle default vs named when consuming CJS/ESM packages." },
            { title: "Paths", detail: "Use path aliases safely; keep resolution consistent in tooling." },
        ],
    },
    "async-await": {
        title: "Async flow",
        description: "Promises with clear types, safe errors, and cancellation.",
        steps: [
            { title: "Return Promise<T>", detail: "Model resolved shapes; use Awaited<T> when needed." },
            { title: "Handle errors", detail: "Catch unknown and narrow before use; surface messages safely." },
            { title: "Cancel", detail: "Pass AbortSignal to fetch/work to avoid wasted work." },
        ],
    },
    "tsconfig-strict": {
        title: "Strictness guardrails",
        description: "Compiler flags prevent whole classes of runtime bugs.",
        steps: [
            { title: "strict bundle", detail: "Enable strict and its sub-flags for consistent safety." },
            { title: "Null safety", detail: "strictNullChecks + noUncheckedIndexedAccess block undefined crashes." },
            { title: "Exact props", detail: "exactOptionalPropertyTypes stops silent optional misuse." },
        ],
    },
    generics: {
        title: "Reusable type parameters",
        description: "Capture shapes and constraints for safer abstractions.",
        steps: [
            { title: "Parameterize", detail: "Add <T> to functions/classes to carry caller types." },
            { title: "Constrain", detail: "Use extends to restrict capabilities (e.g., extends { id: string })." },
            { title: "Infer/Default", detail: "Let callers omit generics; provide defaults when sensible." },
        ],
    },
    "utility-types": {
        title: "Transforming shapes",
        description: "Partial/Pick/Omit/Readonly/ReturnType reshape models quickly.",
        steps: [
            { title: "Select", detail: "Pick/Omit slice models for specific views." },
            { title: "Mutability", detail: "Partial/Required/Readonly toggle optionality and mutability." },
            { title: "Functions", detail: "ReturnType/Parameters mirror function surfaces." },
        ],
    },
    "mapped-types": {
        title: "Projecting over keys",
        description: "Iterate keys and remap names/modifiers.",
        steps: [
            { title: "Map keys", detail: "For each key in keyof T, build new properties." },
            { title: "Modify", detail: "Add/remove readonly/optional to control shapes." },
            { title: "Remap", detail: "Rename with 'as' to build handler maps (e.g., onClick)." },
        ],
    },
    "conditional-types": {
        title: "Type-level branching",
        description: "Distribute over unions; extract pieces with infer.",
        steps: [
            { title: "Check", detail: "T extends U ? X : Y picks based on assignability." },
            { title: "Distribute", detail: "Naked T distributes over unions automatically." },
            { title: "Infer", detail: "Pull out inner types (e.g., infer R from Promise<R>). " },
        ],
    },
    "template-literals": {
        title: "Typed string patterns",
        description: "Compose string unions for routes, events, and keys.",
        steps: [
            { title: "Compose", detail: "Use `${A}${B}` with unions to build permutations." },
            { title: "Constrain", detail: "Restrict allowed strings (e.g., user:${\"created\" | \"updated\"})." },
            { title: "Integrate", detail: "Pair with keyof/queries to derive event and route names." },
        ],
    },
    "ambient-declarations": {
        title: "Describing external shapes",
        description: "Add types for code you don’t own via declarations/augmentation.",
        steps: [
            { title: "Declare module", detail: "Provide typings for untyped packages or virtual modules." },
            { title: "Augment global", detail: "Extend Window/globalThis or existing module interfaces safely." },
            { title: "Avoid conflicts", detail: "Keep declarations scoped to avoid polluting consumers." },
        ],
    },
};

