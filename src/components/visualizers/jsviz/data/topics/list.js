// JavaScript Mastery 2027 (Version 2.0) — 100 Concepts Curriculum
export const topics = [
    {
        title: "Module 01: JavaScript Foundations & Environment",
        level: "Level 1 — Beginner",
        description: "History, runtime environments, V8 engine architecture, syntax, variables, strict mode, and fundamental data types.",
        items: [
            {
                id: "what-is-javascript-history-evolution-ecmascript",
                number: 1,
                title: "What is JavaScript? History, Evolution & ECMAScript",
                description: "History from Netscape and Brendan Eich, the role of TC39, ECMAScript versions, and language evolution.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "javascript-runtime-environments-browser-vs-nodejs",
                number: 2,
                title: "JavaScript Runtime Environments: Browser vs Node.js",
                description: "Host environments, the window vs global object, Web APIs, libuv, and server-side execution.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "javascript-engine-architecture-execution",
                number: 3,
                title: "JavaScript Engine Architecture & Execution",
                description: "How modern engines parse source code into AST, generate bytecode, and optimize through JIT compilation.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "javascript-syntax-statements-expressions",
                number: 4,
                title: "JavaScript Syntax, Statements & Expressions",
                description: "Lexical structure, statement vs expression distinction, automatic semicolon insertion (ASI), and grammar.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "variables-var-let-const",
                number: 5,
                title: "Variables: var, let & const",
                description: "Variable declaration mechanics, scope boundaries, immutability of const bindings, and reassignment.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "comments-identifiers-reserved-keywords",
                number: 6,
                title: "Comments, Identifiers & Reserved Keywords",
                description: "Identifier naming rules, Unicode identifier variables, reserved words, and documentation standards.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "strict-mode-modern-javascript",
                number: 7,
                title: "Strict Mode & Modern JavaScript",
                description: "Invoking 'use strict', eliminating silent errors, preventing accidental globals, and module defaults.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "primitive-vs-non-primitive-data-types",
                number: 8,
                title: "Primitive vs Non-Primitive Data Types",
                description: "The 7 primitives stored directly on the stack vs Objects stored in the heap and passed by reference.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "type-detection-typeof-instanceof-tostring",
                number: 9,
                title: "Type Detection: typeof, instanceof & Object.prototype.toString",
                description: "Reliable type inspection, typeof quirks, instanceof prototype traversal, and Object.prototype.toString.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            },
            {
                id: "type-conversion-type-coercion",
                number: 10,
                title: "Type Conversion & Type Coercion",
                description: "Explicit type conversions vs implicit coercion, ToPrimitive algorithm, ToNumber, and ToString rules.",
                category: "Module 01: JavaScript Foundations & Environment",
                level: "Level 1 — Beginner"
            }
        ]
    },
    {
        title: "Module 02: Values, Operators & Control Flow",
        level: "Level 1 — Beginner",
        description: "Number systems, IEEE-754 floats, BigInt, strings, symbols, equality comparison, operators, and control flow.",
        items: [
            {
                id: "numbers-ieee754-floating-point-precision",
                number: 11,
                title: "Numbers, IEEE-754 & Floating-Point Precision",
                description: "Double-precision 64-bit binary format, the 0.1 + 0.2 precision dilemma, NaN, and Number.EPSILON.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "bigint-arbitrary-precision-integers",
                number: 12,
                title: "BigInt & Arbitrary-Precision Integers",
                description: "Safe integer limits, BigInt literals, avoiding precision loss for 64-bit IDs, and mixed math constraints.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "strings-immutability-string-methods",
                number: 13,
                title: "Strings, Immutability & String Methods",
                description: "UTF-16 encoding units, immutable string memory semantics, and essential manipulation utilities.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "boolean-null-undefined",
                number: 14,
                title: "Boolean, null & undefined",
                description: "Logical truth flags, intentional absence of value (null), uninitialized states, and undeclared bindings.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "symbols-unique-identifiers",
                number: 15,
                title: "Symbols & Unique Identifiers",
                description: "Unique primitive tokens, hidden object properties, Symbol.for registry, and collision prevention.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "equality-comparisons-object-is",
                number: 16,
                title: "Equality: ==, === & Object.is()",
                description: "Loose coercion equality (==) vs strict identity (===) vs Object.is SameValue algorithm for NaN and -0.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "truthy-falsy-short-circuit-evaluation",
                number: 17,
                title: "Truthy, Falsy & Short-Circuit Evaluation",
                description: "The 8 falsy values, Boolean coercion rules, short-circuit logical operators, and default value assignment.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "operators-precedence-associativity",
                number: 18,
                title: "Operators, Precedence & Associativity",
                description: "Operator precedence order, associativity rules, arithmetic, comparison, and bitwise operators.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "conditional-statements-if-else-switch",
                number: 19,
                title: "Conditional Statements: if, else & switch",
                description: "Branching execution flow, multi-case matching in switch statements, fall-through risks, and ternary expressions.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            },
            {
                id: "loops-for-while-do-while-break-continue",
                number: 20,
                title: "Loops: for, while, do...while, break & continue",
                description: "Standard iteration loops, condition evaluation sequences, loop control statements, and labeled breaks.",
                category: "Module 02: Values, Operators & Control Flow",
                level: "Level 1 — Beginner"
            }
        ]
    },
    {
        title: "Module 03: Data Structures & Programming Fundamentals",
        level: "Level 1 — Beginner",
        description: "Arrays, mutating vs immutable operations, objects, destructuring, spread/rest, optional chaining, and modern RegExp.",
        items: [
            {
                id: "arrays-creation-indexing-fundamental-methods",
                number: 21,
                title: "Arrays: Creation, Indexing & Fundamental Methods",
                description: "Array literals, indexed storage, dynamic resizing, and core stack/queue methods (push, pop, shift, unshift).",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "array-mutation-vs-non-mutating-methods",
                number: 22,
                title: "Array Mutation vs Non-Mutating Methods",
                description: "In-place mutation risks vs modern non-mutating equivalents (toSorted, toReversed, toSpliced, slice).",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "objects-creation-properties-access",
                number: 23,
                title: "Objects: Creation, Properties & Access",
                description: "Object literals, dot vs bracket access, dynamic computed keys, and property removal semantics.",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "object-array-destructuring",
                number: 24,
                title: "Object & Array Destructuring",
                description: "Extracting structured data into discrete variables, default fallback values, and nested path pattern matching.",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "spread-rest-syntax",
                number: 25,
                title: "Spread & Rest Syntax",
                description: "Shallow cloning objects and arrays via spread (...), rest parameter gathering in functions, and immutability.",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "template-literals-tagged-templates",
                number: 26,
                title: "Template Literals & Tagged Templates",
                description: "String interpolation with backticks, multiline strings, and tagged template parsing functions.",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "optional-chaining-nullish-coalescing",
                number: 27,
                title: "Optional Chaining & Nullish Coalescing",
                description: "Safely drilling into deeply nested properties with ?. and providing accurate defaults using ?.",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "date-timestamps-math-object",
                number: 28,
                title: "Date, Timestamps & Math Object",
                description: "Epoch timestamps, Date formatting, Math constants, random number generation, and Math.sumPrecise().",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "json-serialization-parsing-rawjson",
                number: 29,
                title: "JSON: Serialization, Parsing & JSON.rawJSON()",
                description: "JSON.stringify custom replacers, JSON.parse revivers, loss of non-serializable types, and JSON.rawJSON().",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            },
            {
                id: "regular-expressions-regexp-escape",
                number: 30,
                title: "Regular Expressions & RegExp.escape()",
                description: "Pattern syntax, regex flags, capture groups, lookaheads, and safe string sanitization with RegExp.escape().",
                category: "Module 03: Data Structures & Programming Fundamentals",
                level: "Level 1 — Beginner"
            }
        ]
    },
    {
        title: "Module 04: Functions & Execution Model",
        level: "Level 2 — Intermediate",
        description: "Function declarations, expressions, arrow syntax, higher-order functions, execution contexts, call stack, and recursion.",
        items: [
            {
                id: "function-declarations-vs-function-expressions",
                number: 31,
                title: "Function Declarations vs Function Expressions",
                description: "Hoisted declarations vs runtime-evaluated expressions, named function expressions, and call semantics.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "parameters-arguments-default-parameters",
                number: 32,
                title: "Parameters, Arguments & Default Parameters",
                description: "Call-time default evaluation, rest parameters, and transitioning from legacy arguments objects.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "arrow-functions-lexical-syntax",
                number: 33,
                title: "Arrow Functions & Lexical Syntax",
                description: "Concise expression syntax, lack of prototype property, inability to serve as constructors, and lexical bindings.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "first-class-functions-callbacks",
                number: 34,
                title: "First-Class Functions & Callbacks",
                description: "Functions treated as first-class citizens: passing as arguments, returning from functions, and callbacks.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "higher-order-functions-function-composition",
                number: 35,
                title: "Higher-Order Functions & Function Composition",
                description: "Building composable abstractions, composing pipe functions, and declarative data transformation pipelines.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "execution-context-execution-phases",
                number: 36,
                title: "Execution Context & Execution Phases",
                description: "Creation phase vs execution phase, variable environment initialization, and environment record tracking.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "call-stack-stack-overflow",
                number: 37,
                title: "Call Stack & Stack Overflow",
                description: "LIFO execution stack frame management, tracking function execution, and debugging stack overflow limits.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "hoisting-temporal-dead-zone",
                number: 38,
                title: "Hoisting & Temporal Dead Zone",
                description: "Declaration lifting mechanisms for var/functions and TDZ uninitialized access errors with let/const.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "pure-functions-side-effects-referential-transparency",
                number: 39,
                title: "Pure Functions, Side Effects & Referential Transparency",
                description: "Deterministic outputs, eliminating mutable state mutations, testability, and compiler memoization.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            },
            {
                id: "recursion-tail-calls-stack-management",
                number: 40,
                title: "Recursion, Tail Calls & Stack Management",
                description: "Base case termination, recursive call structures, call frame overhead, and proper recursion patterns.",
                category: "Module 04: Functions & Execution Model",
                level: "Level 2 — Intermediate"
            }
        ]
    },
    {
        title: "Module 05: Scope, Closures & this Binding",
        level: "Level 2 — Intermediate",
        description: "Scoping models, scope chains, lexical environments, closure mechanics, this binding rules, and currying.",
        items: [
            {
                id: "global-function-block-scope",
                number: 41,
                title: "Global, Function & Block Scope",
                description: "Scope boundaries, global namespace pollution, function scoping with var, and block scoping with let/const.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "lexical-scope-scope-chain",
                number: 42,
                title: "Lexical Scope & Scope Chain",
                description: "Author-time scoping determined by source code structure and identifier lookup up the lexical scope chain.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "variable-shadowing-identifier-resolution",
                number: 43,
                title: "Variable Shadowing & Identifier Resolution",
                description: "Inner scopes shadowing outer variable declarations, scope collision prevention, and resolution rules.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "closures-lexical-environment",
                number: 44,
                title: "Closures & Lexical Environment",
                description: "Functions maintaining access to their outer lexical environment after outer execution has finished.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "closures-in-loops-asynchronous-callbacks",
                number: 45,
                title: "Closures in Loops & Asynchronous Callbacks",
                description: "The classic loop closure issue with var, per-iteration binding with let, and factory closures.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "this-keyword-implicit-binding",
                number: 46,
                title: "this Keyword & Implicit Binding",
                description: "Call-site determination of this, method invocation context, and losing binding upon callback detachment.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "explicit-binding-call-apply-bind",
                number: 47,
                title: "Explicit Binding: call(), apply() & bind()",
                description: "Explicitly setting context: immediate invocation with call/apply vs creating bound functions with bind.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "new-operator-constructor-invocation",
                number: 48,
                title: "new Operator & Constructor Invocation",
                description: "The 4 steps of new: object creation, prototype linkage, this binding, and instance return.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "arrow-functions-lexical-this",
                number: 49,
                title: "Arrow Functions & Lexical this",
                description: "Inheriting this from surrounding lexical context, immunity to call/apply rebinding, and callback usage.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            },
            {
                id: "currying-partial-application-function-arguments",
                number: 50,
                title: "Currying, Partial Application & Function Arguments",
                description: "Converting multi-argument functions into unary function chains, partial application, and reusable helpers.",
                category: "Module 05: Scope, Closures & this Binding",
                level: "Level 2 — Intermediate"
            }
        ]
    },
    {
        title: "Module 06: Objects & Prototypal Inheritance",
        level: "Level 2 — Intermediate",
        description: "Property descriptors, getters/setters, immutability, prototypes, prototype chain, classes, and private fields.",
        items: [
            {
                id: "object-property-descriptors-attributes",
                number: 51,
                title: "Object Property Descriptors & Attributes",
                description: "value, writable, enumerable, and configurable flags manipulated via Object.defineProperty.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "property-accessors-getters-setters",
                number: 52,
                title: "Property Accessors: Getters & Setters",
                description: "Defining accessor property functions for computed attributes, input validation, and reactivity.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "object-immutability-freeze-seal-preventextensions",
                number: 53,
                title: "Object Immutability: freeze(), seal() & preventExtensions()",
                description: "Shallow vs deep freeze, sealing property structures, preventing extensions, and defensive programming.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "prototype-prototype-internal-mechanism",
                number: 54,
                title: "Prototype & [[Prototype]] Internal Mechanism",
                description: "The internal [[Prototype]] link, Object.getPrototypeOf, Object.setPrototypeOf, and prototype sharing.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "prototype-chain-property-lookup",
                number: 55,
                title: "Prototype Chain & Property Lookup",
                description: "Walking the prototype chain to null, property shadowing, and safe verification with Object.hasOwn().",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "constructor-functions-prototype-methods",
                number: 56,
                title: "Constructor Functions & Prototype Methods",
                description: "Shared methods attached to Function.prototype for memory efficiency vs per-instance method duplication.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "object-create-delegation",
                number: 57,
                title: "Object.create() & Delegation",
                description: "Prototypal delegation without constructor functions and creating clean null-prototype dictionaries.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "es6-classes-class-syntax",
                number: 58,
                title: "ES6 Classes & Class Syntax",
                description: "Class declarations, constructor methods, instance methods, and syntactical sugar over prototypes.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "class-inheritance-super-static-members",
                number: 59,
                title: "Class Inheritance, super() & Static Members",
                description: "Subclassing with extends, calling super() in constructors, static methods, and factory methods.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            },
            {
                id: "private-fields-static-blocks-encapsulation",
                number: 60,
                title: "Private Fields, Static Blocks & Encapsulation",
                description: "True encapsulation using private hash fields (#), private instance methods, and static initialization blocks.",
                category: "Module 06: Objects & Prototypal Inheritance",
                level: "Level 2 — Intermediate"
            }
        ]
    },
    {
        title: "Module 07: Collections, Iteration & Modules",
        level: "Level 3 — Advanced",
        description: "Array iteration (groupBy), Map/Set set methods, WeakMap/WeakSet, iterator protocols, generators, and ES Modules.",
        items: [
            {
                id: "array-iteration-map-filter-reduce-transformations",
                number: 61,
                title: "Array Iteration: map(), filter(), reduce() & Advanced Transformations",
                description: "Functional data pipelines, complex reduce accumulators, flatMap, and modern Object.groupBy().",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "map-set-collections-composition-union-intersection",
                number: 62,
                title: "Map & Set Collections: Composition, Union & Intersection",
                description: "Keyed collections, object keys, Set uniqueness, modern Set union/intersection, and Map.getOrInsert().",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "weakmap-weakset-weak-references",
                number: 63,
                title: "WeakMap, WeakSet & Weak References",
                description: "Garbage-collection friendly references, private metadata storage, WeakRef deref, and FinalizationRegistry.",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "iterable-iterator-protocols",
                number: 64,
                title: "Iterable & Iterator Protocols",
                description: "The Symbol.iterator protocol, iterator next() contracts, and custom iterable data structures.",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "for-of-vs-for-in",
                number: 65,
                title: "for...of vs for...in",
                description: "Iterating iterable values with for...of vs enumerating enumerable string keys and prototypes with for...in.",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "generators-function-star-yield",
                number: 66,
                title: "Generators: function* & yield",
                description: "Pausable function execution, bidirectional communication with yield, and custom sequence streams.",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "generator-delegation-yield-star-communication",
                number: 67,
                title: "Generator Delegation: yield* & Communication",
                description: "Delegating iteration to secondary iterables with yield*, handling exceptions via throw(), and early returns.",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "modern-iterator-helpers-iterator-concat",
                number: 68,
                title: "Modern Iterator Helpers & Iterator.concat()",
                description: "Lazy iterator combinators: map, filter, take, drop, flatMap, and chaining sequences with Iterator.concat().",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "es-modules-import-export-scope-import-attributes",
                number: 69,
                title: "ES Modules: import, export, Module Scope & Import Attributes",
                description: "Static module graph, named/default exports, module scope isolation, and modern import attributes (with { type }).",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            },
            {
                id: "commonjs-vs-es-modules-dynamic-import-top-level-await",
                number: 70,
                title: "CommonJS vs ES Modules, Dynamic import() & Top-Level await",
                description: "Synchronous require() vs async import, interoperability nuances, dynamic code loading, and top-level await.",
                category: "Module 07: Collections, Iteration & Modules",
                level: "Level 3 — Advanced"
            }
        ]
    },
    {
        title: "Module 08: Advanced JavaScript & Metaprogramming",
        level: "Level 3 — Advanced",
        description: "Proxies, Reflect API, well-known symbols, Typed Arrays, Float16Array, SharedArrayBuffer, Atomics, and Intl API.",
        items: [
            {
                id: "proxy-objects-metaprogramming",
                number: 71,
                title: "Proxy Objects & Metaprogramming",
                description: "Intercepting fundamental operations (get, set, has, deleteProperty) for validation and reactivity.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "reflect-api-reflect-operations",
                number: 72,
                title: "Reflect API & Reflect Operations",
                description: "Standard object manipulation methods matching Proxy traps, boolean return codes, and receiver forwarding.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "symbols-well-known-symbols-custom-protocols",
                number: 73,
                title: "Symbols: Well-Known Symbols & Custom Protocols",
                description: "Hooking into language mechanisms: Symbol.toPrimitive, Symbol.hasInstance, Symbol.species, and toStringTag.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "typed-arrays-arraybuffer-float16array",
                number: 74,
                title: "Typed Arrays, ArrayBuffer & Float16Array",
                description: "Binary data buffers, Uint8Array through Float64Array, modern Float16Array, and Base64/Hex encoding helpers.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "dataview-binary-data-endianness",
                number: 75,
                title: "DataView, Binary Data & Endianness",
                description: "Reading heterogeneous binary structures with explicit big-endian and little-endian byte ordering.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "sharedarraybuffer-atomics",
                number: 76,
                title: "SharedArrayBuffer & Atomics",
                description: "Multi-threaded shared memory concurrency across workers, atomic operations, and lock synchronization.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "intl-api-internationalization",
                number: 77,
                title: "Intl API & Internationalization",
                description: "Locale-aware formatting with Intl.NumberFormat, Intl.DateTimeFormat, Intl.RelativeTimeFormat, and Collator.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "error-objects-custom-errors-error-iserror",
                number: 78,
                title: "Error Objects, Custom Errors & Error.isError()",
                description: "Subclassing Error, capturing call stacks, chained errors with cause, and modern Error.isError() detection.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "ecmascript-specification-abstract-operations",
                number: 79,
                title: "ECMAScript Specification & Abstract Operations",
                description: "Decoding the ECMA-262 formal specification: Type(x), ToPrimitive, internal slots, and algorithmic steps.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            },
            {
                id: "eval-dynamic-code-execution-security-implications",
                number: 80,
                title: "eval(), Dynamic Code Execution & Security Implications",
                description: "Dynamic string evaluation hazards, scope leakage, Function constructors, and CSP defense.",
                category: "Module 08: Advanced JavaScript & Metaprogramming",
                level: "Level 3 — Advanced"
            }
        ]
    },
    {
        title: "Module 09: Asynchronous JavaScript & Browser APIs",
        level: "Level 3 — Advanced",
        description: "Event loop, microtasks, Promises, Promise combinators, Promise.try, async/await, streams, and DOM events.",
        items: [
            {
                id: "synchronous-vs-asynchronous-execution",
                number: 81,
                title: "Synchronous vs Asynchronous Execution",
                description: "Single-threaded execution guarantees, non-blocking I/O operations, and run-to-completion semantics.",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "event-loop-javascript-concurrency-model",
                number: 82,
                title: "Event Loop & JavaScript Concurrency Model",
                description: "The execution coordinator: stack frames, task processing, microtask checkpoints, and render updates.",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "task-queue-microtask-queue-queuemicrotask",
                number: 83,
                title: "Task Queue, Microtask Queue & queueMicrotask()",
                description: "Macrotasks (timers, I/O) vs microtasks (Promises, queueMicrotask), and execution priority drain rules.",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "promises-states-lifecycle-resolution",
                number: 84,
                title: "Promises: States, Lifecycle & Resolution",
                description: "Pending, fulfilled, and rejected transitions, executor contracts, and immutable resolution values.",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "promise-chaining-error-propagation-promise-try",
                number: 85,
                title: "Promise Chaining, Error Propagation & Promise.try()",
                description: "Sequential promise pipelining, catching rejection chains, and uniform exception handling with Promise.try().",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "promise-combinators-all-race-any-allsettled",
                number: 86,
                title: "Promise Combinators: all(), race(), any() & allSettled()",
                description: "Parallel orchestrations: fail-fast all(), fastest-result race(), first-success any(), and complete allSettled().",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "async-await-array-fromasync-concurrency-patterns",
                number: 87,
                title: "async/await, Array.fromAsync() & Concurrency Patterns",
                description: "Writing asynchronous code synchronously, avoiding sequential await waterfalls, and Array.fromAsync().",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "async-iterators-async-generators-for-await-of",
                number: 88,
                title: "Async Iterators, Async Generators & for await...of",
                description: "Symbol.asyncIterator protocol, streaming data with async generator functions, and consumption via for await...of.",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "abortcontroller-fetch-api-web-streams",
                number: 89,
                title: "AbortController, Fetch API & Web Streams",
                description: "Canceling network requests and async operations with AbortSignal, timeout signals, and streaming responses.",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            },
            {
                id: "browser-event-system-eventtarget-bubbling-capturing",
                number: 90,
                title: "Browser Event System, EventTarget, Bubbling & Capturing",
                description: "The 3 DOM event phases: capturing, targeting, and bubbling, stopPropagation(), and event delegation.",
                category: "Module 09: Asynchronous JavaScript & Browser APIs",
                level: "Level 3 — Advanced"
            }
        ]
    },
    {
        title: "Module 10: JavaScript Engine, Memory, Performance & Security",
        level: "Level 4 — Expert",
        description: "Memory model, Garbage Collection, V8 internals, Hidden Classes, JIT compilation, Web Workers, and Security.",
        items: [
            {
                id: "javascript-memory-model-stack-vs-heap",
                number: 91,
                title: "JavaScript Memory Model: Stack vs Heap",
                description: "Stack frames for execution and primitives vs heap memory for dynamic object allocations and pointers.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "garbage-collection-mark-and-sweep-generational-gc",
                number: 92,
                title: "Garbage Collection: Mark-and-Sweep & Generational GC",
                description: "Root reachability, mark-and-sweep algorithm, V8 Scavenger for young objects vs Mark-Compact for old objects.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "memory-leaks-retained-references-memory-profiling",
                number: 93,
                title: "Memory Leaks, Retained References & Memory Profiling",
                description: "Accidental global variables, uncleared timers, detached DOM nodes, and Chrome DevTools heap snapshots.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "v8-architecture-parser-ignition-turbofan",
                number: 94,
                title: "V8 Architecture: Parser, Ignition & TurboFan",
                description: "How V8 parses code into AST, interprets bytecode via Ignition, and JIT-optimizes with TurboFan.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "hidden-classes-shapes-inline-caching",
                number: 95,
                title: "Hidden Classes, Shapes & Inline Caching",
                description: "Object shape transitions, monomorphic vs polymorphic inline caches, and keeping objects performant.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "jit-compilation-speculative-optimisation-deoptimisation",
                number: 96,
                title: "JIT Compilation, Speculative Optimisation & Deoptimisation",
                description: "Hot function profiling, speculative type assumptions, deoptimization bailouts, and writing JIT-friendly code.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "web-workers-worker-threads-parallel-execution",
                number: 97,
                title: "Web Workers, Worker Threads & Parallel Execution",
                description: "Offloading intensive computations to background threads, postMessage structured cloning, and parallelism.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "browser-performance-debouncing-throttling-requestanimationframe",
                number: 98,
                title: "Browser Performance: Debouncing, Throttling & requestAnimationFrame",
                description: "Throttling high-frequency scroll/resize events, debouncing inputs, and 60 FPS animation scheduling.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "javascript-security-prototype-pollution-sandboxing-hardening",
                number: 99,
                title: "JavaScript Security: Prototype Pollution, Sandboxing & Hardening",
                description: "Prototype pollution injection vectors, Object.freeze defenses, secure JSON parsing, and sandboxing.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            },
            {
                id: "javascript-performance-engineering-advanced-anti-patterns",
                number: 100,
                title: "JavaScript Performance Engineering & Advanced Anti-Patterns",
                description: "delete operator penalties, argument leakage deopts, sparse arrays, and zero-allocation performance patterns.",
                category: "Module 10: JavaScript Engine, Memory, Performance & Security",
                level: "Level 4 — Expert"
            }
        ]
    }
];

export const getTopicById = (id) => {
    // Support legacy and alternate slug aliases for data types
    if (id === 'data-types' || id === 'data-types-values') {
        return getTopicById('primitive-vs-non-primitive-data-types');
    }
    for (const category of topics) {
        const found = category.items.find(item => item.id === id);
        if (found) return found;
    }
    return null;
};
