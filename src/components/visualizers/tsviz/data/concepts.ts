export type Phase = "Basics" | "Intermediate" | "Advanced";

export interface Concept {
    id: string;
    title: string;
    description: string;
    phase: Phase;
    icon?: string;
}

export const concepts: Concept[] = [
    {
        id: "primitives",
        title: "Primitives & Basic Types",
        description: "Understand the building blocks: string, number, boolean, and the 'any' trap.",
        phase: "Basics",
    },
    {
        id: "functions",
        title: "Functions & Signatures",
        description: "Learn how to type function arguments, return values, and callbacks.",
        phase: "Basics",
    },
    {
        id: "interfaces-vs-types",
        title: "Interfaces vs Types",
        description: "The age-old debate. When to use which and how they differ.",
        phase: "Basics",
    },
    {
        id: "type-inference",
        title: "Type Inference",
        description: "Understand how TS guesses types.",
        phase: "Basics",
    },
    {
        id: "literal-types",
        title: "Literal Types & Enums",
        description: "Lock values to specific strings/numbers and compare with enums.",
        phase: "Basics",
    },
    {
        id: "tuples",
        title: "Tuples",
        description: "Fixed-length arrays with positional meaning.",
        phase: "Basics",
    },
    {
        id: "safety-types",
        title: "Safety Types: unknown, never, void, object",
        description: "Safer alternatives to any and how to model impossible or empty values.",
        phase: "Basics",
    },
    {
        id: "unions-intersections",
        title: "Unions & Intersections",
        description: "Combine types to create powerful and flexible data structures.",
        phase: "Intermediate",
    },
    {
        id: "type-guards",
        title: "Narrowing & Type Guards",
        description: "Master control flow analysis to write safer code.",
        phase: "Intermediate",
    },
    {
        id: "type-assertions",
        title: "Assertions, Non-Null, satisfies",
        description: "Direct the type checker safely when it cannot infer enough.",
        phase: "Intermediate",
    },
    {
        id: "type-queries",
        title: "typeof, keyof, Indexed Access",
        description: "Mirror runtime values in the type system for safer reuse.",
        phase: "Intermediate",
    },
    {
        id: "classes",
        title: "Classes & OOP",
        description: "Access modifiers, interfaces with classes, abstract classes.",
        phase: "Intermediate",
    },
    {
        id: "modules",
        title: "Modules & Namespaces",
        description: "Imports, exports, namespaces, and interop patterns.",
        phase: "Intermediate",
    },
    {
        id: "async-await",
        title: "Async/Await",
        description: "Typing Promises and async functions.",
        phase: "Intermediate",
    },
    {
        id: "tsconfig-strict",
        title: "tsconfig & Strict Mode",
        description: "Key compiler flags that keep your codebase safe.",
        phase: "Intermediate",
    },
    {
        id: "generics",
        title: "Generics",
        description: "Write reusable code that works with any data type.",
        phase: "Advanced",
    },
    {
        id: "utility-types",
        title: "Utility Types",
        description: "Partial, Pick, Omit, and other built-in tools to transform types.",
        phase: "Advanced",
    },
    {
        id: "mapped-types",
        title: "Mapped Types",
        description: "Creating new types from existing ones (keyof, in).",
        phase: "Advanced",
    },
    {
        id: "conditional-types",
        title: "Conditional Types",
        description: "Logic within the type system.",
        phase: "Advanced",
    },
    {
        id: "template-literals",
        title: "Template Literal Types",
        description: "String manipulation at the type level.",
        phase: "Advanced",
    },
    {
        id: "ambient-declarations",
        title: "Ambient & Declaration Merging",
        description: "Augment third-party types and describe globals safely.",
        phase: "Advanced",
    },
];
