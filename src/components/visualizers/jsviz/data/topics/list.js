// Topic catalog and lookup
export const topics = [
    {
        title: 'Tier A: Core JavaScript (Must Master)',
        description: 'If you complete this tier, you genuinely understand JavaScript and can work confidently in any JS codebase.',
        items: [
            {
                id: 'variables-scope',
                title: 'Variables & Scope',
                description: 'var, let, const, block vs function scope, global scope, lexical environment, hoisting, temporal dead zone'
            },
            {
                id: 'data-types',
                title: 'Data Types & Values',
                description: 'Primitives, objects, mutability, value vs reference, typeof, instanceof'
            },
            {
                id: 'operators',
                title: 'Operators',
                description: 'Arithmetic, logical, comparison, assignment, ternary, nullish coalescing, optional chaining, delete, in, instanceof'
            },
            {
                id: 'control-flow',
                title: 'Control Flow',
                description: 'if/else, switch, loops, break/continue, try/catch/finally, throw'
            },
            {
                id: 'functions-basics',
                title: 'Function Fundamentals',
                description: 'Function declarations vs expressions, parameters, return values, recursion'
            },
            {
                id: 'objects',
                title: 'Object Literals & Property Access',
                description: 'Dot vs bracket notation, computed properties, shorthand syntax'
            },
            {
                id: 'arrays',
                title: 'Arrays & Essential Methods',
                description: 'map, filter, reduce, forEach, find, some, every, includes, indexOf, slice, splice (mutation vs non-mutation)'
            },
            {
                id: 'strings',
                title: 'Strings & Essential Methods',
                description: 'slice, split, includes, indexOf, replace, trim, startsWith, endsWith, padStart, padEnd, repeat, charAt'
            },
            {
                id: 'type-coercion',
                title: 'Type Conversion & Equality',
                description: 'Implicit vs explicit coercion, ToPrimitive/ToNumber, == vs ===, truthy/falsy rules'
            },
            {
                id: 'literals-syntax',
                title: 'Literals & Syntax Rules',
                description: 'Object {}, array [], function syntax, template literals, numeric literals, regex literals, strict vs sloppy mode'
            },
            {
                id: 'callbacks',
                title: 'Callbacks',
                description: 'Continuation-passing style, error-first callbacks'
            },
            {
                id: 'higher-order-functions',
                title: 'Higher-Order Functions',
                description: 'Functions as values, callbacks, composition, currying basics'
            },
            {
                id: 'scope-chain',
                title: 'Scope Chain & Lexical Environment',
                description: 'Variable resolution, nested scopes, shadowing'
            },
            {
                id: 'closures',
                title: 'Closures',
                description: 'Lexical scope retention, private state, memory implications'
            },
            {
                id: 'execution-context',
                title: 'Execution Context & Call Stack',
                description: 'Global vs function execution context, creation vs execution phase, call stack behavior'
            },
            {
                id: 'this-binding',
                title: '`this` Binding Rules',
                description: 'Default, implicit, explicit, new binding, arrow function behavior'
            },
            {
                id: 'function-methods',
                title: 'Function Methods (call / apply / bind)',
                description: 'Explicit this binding patterns, method borrowing'
            },
            {
                id: 'arguments-rest',
                title: 'Arguments Object & Rest Parameters',
                description: 'arguments object, aliasing behavior, rest syntax, spread operator'
            },
            {
                id: 'arrow-functions',
                title: 'Arrow Functions',
                description: 'Lexical this, syntax differences, limitations, use cases'
            },
            {
                id: 'prototype-chain',
                title: 'Prototype Chain',
                description: 'Prototypal inheritance, [[Prototype]], Object.create, delegation model'
            },
            {
                id: 'constructor-functions',
                title: 'Constructor Functions & new',
                description: 'new operator steps, instance creation, constructor behavior'
            },
            {
                id: 'classes',
                title: 'Class Syntax (ES6+)',
                description: 'Class sugar over prototypes, extends, super, static members, private fields'
            },
            {
                id: 'regex',
                title: 'Regular Expressions (Essential)',
                description: 'test, match, replace, search, basic groups and flags'
            },
            {
                id: 'errors',
                title: 'Error Handling & Custom Errors',
                description: 'Built-in error types, custom errors, propagation, stack traces'
            },
            {
                id: 'event-loop',
                title: 'Event Loop & Concurrency Model',
                description: 'Call stack, task queues, microtasks, run-to-completion semantics'
            },
            {
                id: 'microtasks',
                title: 'Microtasks & queueMicrotask',
                description: 'Promise jobs, scheduling guarantees vs macrotasks'
            },
            {
                id: 'promises',
                title: 'Promises',
                description: 'States, chaining, combinators, error propagation'
            },
            {
                id: 'async-await',
                title: 'Async / Await',
                description: 'Sequential vs parallel async code, try/catch error handling'
            },
            {
                id: 'modules',
                title: 'ES Modules',
                description: 'import/export, named vs default exports, live bindings, module scope'
            }
        ]
    },

    {
        title: 'Tier B: Advanced JavaScript (Learn -> Revisit)',
        description: 'Important concepts that deepen understanding but are not required for daily JavaScript work.',
        items: [
            {
                id: 'property-descriptors',
                title: 'Property Descriptors',
                description: 'writable, enumerable, configurable, getters/setters, Object.defineProperty'
            },
            {
                id: 'iteration-protocols',
                title: 'Iteration Protocols',
                description: 'Iterable vs iterator, Symbol.iterator, how for...of and spread work internally'
            },
            {
                id: 'template-literals',
                title: 'Template Literals (Advanced)',
                description: 'Tagged templates, raw strings'
            },
            {
                id: 'map-set',
                title: 'Map, Set, WeakMap, WeakSet',
                description: 'Key equality, weak references, garbage collection behavior'
            },
            {
                id: 'typed-arrays',
                title: 'Typed Arrays & Binary Data',
                description: 'ArrayBuffer, DataView, typed array views'
            },
            {
                id: 'numbers',
                title: 'Numbers & IEEE-754',
                description: 'Floating-point precision, NaN, Infinity, signed zero'
            },
            {
                id: 'math',
                title: 'Math Object',
                description: 'Rounding, randomness, mathematical utilities'
            },
            {
                id: 'bigint',
                title: 'BigInt',
                description: 'BigInt literals, arithmetic, interoperability limits'
            },
            {
                id: 'date',
                title: 'Date',
                description: 'Timestamps, time zones, pitfalls'
            },
            {
                id: 'intl',
                title: 'Intl API',
                description: 'Localization, number and date formatting'
            },
            {
                id: 'json',
                title: 'JSON',
                description: 'Serialization, parsing, replacers, revivers'
            },
            {
                id: 'generators',
                title: 'Generators & Async Iteration',
                description: 'yield, delegation, async generators, for await...of'
            },
            {
                id: 'dynamic-imports',
                title: 'Dynamic Imports',
                description: 'import(), lazy loading, code splitting'
            }
        ]
    },

    {
        title: 'Tier C: JavaScript Internals & Deep Dive (Optional)',
        description: 'Engine-level and academic topics. Learn when curiosity or specialization demands it.',
        items: [
            {
                id: 'spec-internals',
                title: 'ECMAScript Internals',
                description: 'Execution contexts, realms, jobs, abstract operations'
            },
            {
                id: 'memory-model',
                title: 'Memory Model & Garbage Collection',
                description: 'Heap vs stack, reachability, GC strategies, memory leaks'
            },
            {
                id: 'shared-memory',
                title: 'Shared Memory & Atomics',
                description: 'SharedArrayBuffer, Atomics operations, synchronization'
            },
            {
                id: 'async-patterns',
                title: 'Advanced Async Control Flow',
                description: 'Debounce, throttle, retries, backoff, cancellation'
            },
            {
                id: 'metaprogramming',
                title: 'Metaprogramming',
                description: 'Proxy, Reflect, invariants'
            },
            {
                id: 'eval',
                title: 'eval & Dynamic Code Execution',
                description: 'Security risks, scope behavior, safer alternatives'
            },
            {
                id: 'security',
                title: 'Language-Level Security',
                description: 'Prototype pollution, object hardening, defensive patterns'
            },
            {
                id: 'legacy',
                title: 'Legacy & Edge Syntax',
                description: 'with, labels, deprecated syntax, historical context'
            }
        ]
    }
];

export const getTopicById = (id) => {
    for (const category of topics) {
        const found = category.items.find(item => item.id === id);
        if (found) return found;
    }
    return null;
};

