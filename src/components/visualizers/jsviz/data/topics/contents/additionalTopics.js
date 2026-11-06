// Auto-generated 50 comprehensive advanced JavaScript topic contents for the 100-concepts curriculum
export const additionalTopics = {
    "typeof-detection": {
        "definition": "The `typeof` operator returns a string indicating the type of the unevaluated operand. While simple for primitives, it has historical quirks (such as `typeof null === 'object'`) and nuances when distinguishing arrays, functions, and plain objects.",
        "syntax": "typeof operand;\ntypeof(operand);\n\n// Reliable type check utility\nfunction getType(val) {\n  return Object.prototype.toString.call(val).slice(8, -1).toLowerCase();\n}",
        "examples": [
            {
                "title": "Common typeof Quirks",
                "code": "console.log(typeof 42);              // \"number\"\nconsole.log(typeof \"hello\");         // \"string\"\nconsole.log(typeof true);            // \"boolean\"\nconsole.log(typeof undefined);       // \"undefined\"\nconsole.log(typeof Symbol());        // \"symbol\"\nconsole.log(typeof 10n);             // \"bigint\"\nconsole.log(typeof function() {});   // \"function\"\n\n// The historical bug:\nconsole.log(typeof null);            // \"object\" ⚠️\nconsole.log(typeof []);              // \"object\" (not array!)\nconsole.log(typeof {});              // \"object\"",
                "explanation": "`typeof null` returning 'object' is a legacy bug from the first version of JS where the type tag 000 was used for objects, and null had NULL pointer address (0x00)."
            },
            {
                "title": "Robust Type Detection with Object.prototype.toString",
                "code": "const toType = (val) => Object.prototype.toString.call(val).slice(8, -1);\n\nconsole.log(toType([]));          // \"Array\"\nconsole.log(toType({}));          // \"Object\"\nconsole.log(toType(null));        // \"Null\"\nconsole.log(toType(new Date()));  // \"Date\"\nconsole.log(toType(/regex/));     // \"RegExp\"\nconsole.log(toType(new Map()));   // \"Map\"",
                "explanation": "`Object.prototype.toString.call()` queries the internal [[Class]] tag, reliably differentiating object subtypes."
            }
        ],
        "explanation": "In JavaScript, primitive types (number, string, boolean, undefined, symbol, bigint) produce their type name directly. However, all reference types except functions return `'object'`. To safely distinguish Arrays, use `Array.isArray()`, and to distinguish custom instances, use `instanceof` or constructor checks.",
        "useCases": [
            "**Defensive parameter validation**: Verifying argument types at function boundaries.",
            "**Serializers & Parsers**: Choosing branching logic based on primitive vs complex data.",
            "**Feature Detection**: Checking `typeof window !== 'undefined'` for SSR environments."
        ],
        "memoryModel": "Primitives are stored directly on the stack or in tagged pointer memory words (Smi in V8), allowing `typeof` to read the bitwise type tag in O(1) time without pointer dereferencing.",
        "visualizationType": "datatypes"
    },
    "equality-comparison": {
        "definition": "JavaScript provides three equality testing operations: loose equality (`==`), strict equality (`===`), and `Object.is()`. Strict equality tests value and type without coercion, while `Object.is()` additionally distinguishes `-0` from `+0` and treats `NaN` as equal to `NaN`.",
        "syntax": "// Loose equality (coerces types)\na == b;\n\n// Strict equality (no coercion)\na === b;\n\n// SameValue equality (exact IEEE-754 semantics)\nObject.is(a, b);",
        "examples": [
            {
                "title": "Strict vs Loose Equality",
                "code": "console.log(5 == \"5\");       // true (coerces string to number)\nconsole.log(5 === \"5\");      // false (different types)\n\nconsole.log(null == undefined);  // true\nconsole.log(null === undefined); // false\n\nconsole.log([] == 0);        // true (coerces [] to \"\" then to 0!)\nconsole.log([] === 0);       // false",
                "explanation": "`==` follows complex coercion algorithms (ToNumber, ToPrimitive). `===` is almost always preferred for predictable behavior."
            },
            {
                "title": "Object.is Corner Cases (NaN and -0)",
                "code": "console.log(NaN === NaN);            // false! (IEEE-754 rule)\nconsole.log(Object.is(NaN, NaN));    // true!\n\nconsole.log(+0 === -0);              // true!\nconsole.log(Object.is(+0, -0));      // false!\n\nconsole.log(1 / +0);                 // Infinity\nconsole.log(1 / -0);                 // -Infinity",
                "explanation": "IEEE-754 specifies `NaN !== NaN`. `Object.is` implements the ECMAScript SameValue algorithm, making it ideal for state reconciliation in frameworks like React."
            }
        ],
        "explanation": "Always default to `===` in daily development. Use `Object.is()` when you must accurately detect `NaN` state changes or distinguish signed zeroes in graphics/physics simulations.",
        "useCases": [
            "**React State Diffing**: React's `useState` and `memo` rely internally on `Object.is` to avoid unnecessary re-renders.",
            "**Input Sanitization**: Preventing silent bugs caused by `'0' == false` or `'' == 0`.",
            "**Mathematical Algorithms**: Preserving directional signs of zero in vector calculations."
        ],
        "memoryModel": "Strict equality checks both the type tag bits and the value payload. For heap objects, it simply compares the 64-bit memory addresses of the two object pointers.",
        "visualizationType": "datatypes"
    },
    "truthy-falsy": {
        "definition": "In JavaScript, any value evaluated in a boolean context is either **truthy** or **falsy**. Exactly eight values are falsy: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined`, and `NaN`. All other values, including empty arrays `[]` and empty objects `{}`, are truthy.",
        "syntax": "// Boolean context coercions\nif (value) { /* runs if truthy */ }\n\nBoolean(value); // explicit cast\n!!value;        // double negation idiom\n\n// Short-circuiting operators\nconst a = x && y; // returns x if falsy, else y\nconst b = x || y; // returns x if truthy, else y\nconst c = x ?? y; // returns x unless null/undefined",
        "examples": [
            {
                "title": "The 8 Falsy Values",
                "code": "const falsyList = [false, 0, -0, 0n, \"\", null, undefined, NaN];\nfalsyList.forEach(val => {\n  console.log(val, \"->\", Boolean(val)); // all false\n});\n\n// Watch out: Objects and arrays are ALWAYS truthy!\nconsole.log(Boolean([])); // true\nconsole.log(Boolean({})); // true\nconsole.log(Boolean(\"0\")); // true",
                "explanation": "Even empty structures `[]` and `{}` evaluate to `true` because they are references to heap objects."
            },
            {
                "title": "Short-Circuiting and Nullish Coalescing",
                "code": "const userCount = 0;\n\n// Buggy fallback with ||\nconst display1 = userCount || 10;\nconsole.log(display1); // 10 ❌ (0 was treated as absent!)\n\n// Fixed with ?? (Nullish Coalescing)\nconst display2 = userCount ?? 10;\nconsole.log(display2); // 0 ✅ (only falls back on null/undefined)",
                "explanation": "`??` only falls back when the left operand is `null` or `undefined`, preventing accidental overrides of `0` or `false`."
            }
        ],
        "explanation": "Short-circuit evaluation is evaluated from left to right. Logical `&&` halts at the first falsy operand and returns it; logical `||` halts at the first truthy operand and returns it.",
        "useCases": [
            "**Safe Default Fallbacks**: Using `??` to provide config defaults without clobbering zero or false.",
            "**Conditional Execution**: `isValid && submitForm()` for lightweight guard clauses.",
            "**UI Toggle States**: Sanitizing dynamic props into pure booleans via `!!isExpanded`."
        ],
        "memoryModel": "V8 engine implements fast inline branching: for booleans and Smis, the condition register is inspected directly; for pointers, the engine checks for the special oddball heap constants (`oddball: false`, `oddball: null`).",
        "visualizationType": "datatypes"
    },
    "symbols": {
        "definition": "A `Symbol` is an immutable, unique primitive value typically used as guaranteed non-colliding property keys for objects, or as extension points for ECMAScript internal behaviors (Well-Known Symbols).",
        "syntax": "const sym1 = Symbol(\"description\");\nconst sym2 = Symbol(\"description\");\nconsole.log(sym1 === sym2); // false (always unique)\n\n// Computed property key\nconst obj = {\n  [sym1]: \"secretValue\"\n};",
        "examples": [
            {
                "title": "Preventing Object Property Collisions",
                "code": "const ID = Symbol(\"id\");\n\nconst user = {\n  name: \"Subhajit\",\n  [ID]: 10192\n};\n\nconsole.log(user[ID]); // 10192\n\n// Symbols are hidden from normal iteration:\nconsole.log(Object.keys(user)); // [\"name\"]\nconsole.log(JSON.stringify(user)); // '{\"name\":\"Subhajit\"}'\n\n// Accessing symbols explicitly:\nconsole.log(Object.getOwnPropertySymbols(user)); // [Symbol(id)]",
                "explanation": "Symbols prevent library plugins or third-party code from accidentally overwriting internal object metadata."
            },
            {
                "title": "Well-Known Symbol: Symbol.toPrimitive",
                "code": "const score = {\n  points: 150,\n  [Symbol.toPrimitive](hint) {\n    if (hint === 'number') return this.points;\n    if (hint === 'string') return `Score: ${this.points}`;\n    return this.points;\n  }\n};\n\nconsole.log(+score);          // 150\nconsole.log(`${score}`);       // \"Score: 150\"\nconsole.log(score + 10);      // 160",
                "explanation": "Well-known symbols like `Symbol.toPrimitive` and `Symbol.iterator` let you customize how the JS engine treats your objects."
            }
        ],
        "explanation": "Symbols cannot be auto-coerced into strings or numbers; doing `sym + 'text'` throws a TypeError. This deliberate design protects against key collision bugs.",
        "useCases": [
            "**Library & Framework Metadata**: Storing private internals on user objects without name collisions.",
            "**Custom Iterables**: Implementing `[Symbol.iterator]` to make any object work with `for...of`.",
            "**Custom Primitive Conversions**: Hooking into `Symbol.toPrimitive` for domain math models."
        ],
        "memoryModel": "Symbols are unique heap primitives. The V8 engine maintains a Symbol table; each symbol retains its unique identifier integer, ensuring `Symbol('a') !== Symbol('a')`.",
        "visualizationType": "datatypes"
    },
    "pass-by-value-reference": {
        "definition": "JavaScript is strictly **pass-by-value**. For primitive types, the actual binary value is copied into the function parameter. For objects, the **memory reference (pointer address)** is copied by value—often called **pass-by-sharing**.",
        "syntax": "function modify(primitive, object) {\n  primitive = 999;        // modifies local copy only\n  object.name = \"Alice\";  // mutates shared heap object\n  object = { name: \"Bob\" }; // reassigns local pointer only\n}",
        "examples": [
            {
                "title": "Primitives vs Object Mutation in Functions",
                "code": "let num = 10;\nlet person = { name: \"Subhajit\" };\n\nfunction test(a, b) {\n  a = 50;\n  b.name = \"Updated\";\n}\n\ntest(num, person);\n\nconsole.log(num);         // 10 (unchanged)\nconsole.log(person.name); // \"Updated\" (mutated via shared pointer)",
                "explanation": "`num` was copied by value. `person` copied the reference address, so mutating `b.name` altered the original object in the heap."
            },
            {
                "title": "Reassigning the Reference Does Not Affect the Caller",
                "code": "let config = { port: 3000 };\n\nfunction reset(cfg) {\n  cfg = { port: 8080 }; // points cfg to a brand new object\n}\n\nreset(config);\nconsole.log(config.port); // 3000 (original untouched!)",
                "explanation": "Reassigning a parameter variable merely changes what the local variable points to; it does not redirect the caller's reference."
            }
        ],
        "explanation": "Understanding pass-by-sharing prevents unintended data mutations across your codebase. To protect objects against accidental mutation in functions, make shallow or deep copies before passing or use `Object.freeze()`.",
        "useCases": [
            "**State Management**: Ensuring pure reducer functions copy state rather than mutating arguments.",
            "**Function Safety**: Avoiding side effects in shared utility functions.",
            "**Performance Optimization**: Passing large objects without duplicating their memory footprint."
        ],
        "memoryModel": "When a function is called, a new Activation Record (stack frame) is pushed. Parameter slots on the stack are filled with 64-bit values: raw numbers/booleans for primitives, or heap memory addresses for objects.",
        "visualizationType": "datatypes"
    },
    "temporal-dead-zone": {
        "definition": "The **Temporal Dead Zone (TDZ)** is the time window between entering a block scope and the actual line where a `let` or `const` variable is declared. Accessing the variable during this window throws a `ReferenceError`.",
        "syntax": "{\n  // TDZ begins for x\n  console.log(x); // ❌ ReferenceError: Cannot access 'x' before initialization\n  let x = 10;     // TDZ ends for x\n  console.log(x); // ✅ 10\n}",
        "examples": [
            {
                "title": "Hoisting with TDZ vs var Hoisting",
                "code": "// var hoists and initializes to undefined\nconsole.log(varVar); // undefined\nvar varVar = \"I am hoisted\";\n\n// let/const hoist into TDZ (uninitialized)\ntry {\n  console.log(letVar);\n} catch (err) {\n  console.log(err.name); // \"ReferenceError\"\n}\nlet letVar = \"I am in TDZ until here\";",
                "explanation": "Both `var` and `let` are hoisted by the compiler, but `var` is initialized immediately to `undefined`, whereas `let` remains uninitialized in the TDZ."
            },
            {
                "title": "TDZ in Default Parameters",
                "code": "// TDZ occurs left-to-right in parameters\nfunction calc(a = b, b = 2) {\n  return a + b;\n}\n\ntry {\n  calc();\n} catch (e) {\n  console.log(\"TDZ Error:\", e.message); // Cannot access 'b' before initialization\n}",
                "explanation": "When `a = b` executes, parameter `b` has not yet been initialized and is in the TDZ."
            }
        ],
        "explanation": "The TDZ was introduced in ECMAScript 2015 to prevent subtle bugs where variables are accessed before their definition, catching logic errors at runtime instead of silently reading `undefined`.",
        "useCases": [
            "**Reliable Refactoring**: Catches accidental usage of variables before their initial setup.",
            "**Temporal Safety**: Guarantees `const` variables are never read in an unassigned state.",
            "**Predictable Scoping**: Keeps block variables strictly localized."
        ],
        "memoryModel": "During the Environment Record setup in the Creation Phase, `let` and `const` slots are created with a special internal V8 hole value (`v8::internal::TheHole`). Any bytecode read of TheHole triggers a ReferenceError bailout.",
        "visualizationType": "variables"
    },
    "call-stack": {
        "definition": "The **Call Stack** is a LIFO (Last-In, First-Out) data structure used by the JavaScript engine to keep track of function execution context. When a function is called, its frame is pushed; when it returns, its frame is popped.",
        "syntax": "function first() { second(); }\nfunction second() { third(); }\nfunction third() { console.trace(); }\n\nfirst();",
        "examples": [
            {
                "title": "Visualizing the Stack Trace",
                "code": "function multiply(a, b) {\n  return a * b;\n}\n\nfunction square(n) {\n  return multiply(n, n);\n}\n\nfunction printSquare(n) {\n  const result = square(n);\n  console.log(\"Result:\", result);\n}\n\nprintSquare(4);",
                "explanation": "Call order: printSquare pushed -> square pushed -> multiply pushed -> multiply returns (popped) -> square returns (popped) -> printSquare finishes (popped)."
            },
            {
                "title": "Stack Overflow (Exceeding Call Stack Limits)",
                "code": "let depth = 0;\nfunction recurse() {\n  depth++;\n  recurse();\n}\n\ntry {\n  recurse();\n} catch (err) {\n  console.log(\"Overflow at depth:\", depth);\n  console.log(err.name); // \"RangeError: Maximum call stack size exceeded\"\n}",
                "explanation": "Infinite recursion without a base case exhausts available stack memory, triggering a RangeError."
            }
        ],
        "explanation": "Because JavaScript is single-threaded, there is only one Call Stack on the main thread. Long-running synchronous functions block the call stack, preventing the Event Loop from processing user clicks or renders.",
        "useCases": [
            "**Debugging with console.trace()**: Inspecting the chain of callers that led to a specific point.",
            "**Analyzing Error Stacks**: Reading `.stack` properties on Error instances in monitoring tools like Sentry.",
            "**Preventing UI Freezes**: Breaking deep synchronous recursive trees into async batches."
        ],
        "memoryModel": "The OS/V8 allocates a contiguous memory segment (typically 1MB - 2MB) for the execution stack. Each stack frame contains arguments, local variables, return program counter, and pointer to the caller's frame.",
        "visualizationType": "callstack"
    },
    "pure-functions": {
        "definition": "A **Pure Function** always returns the same output for the same arguments (deterministic) and causes no observable side effects (such as modifying external variables, mutating arguments, or performing I/O).",
        "syntax": "// Pure\nconst add = (a, b) => a + b;\n\n// Impure (Side effect: mutates external variable)\nlet count = 0;\nconst impureAdd = (a) => { count += a; return count; };",
        "examples": [
            {
                "title": "Pure vs Impure Array Handling",
                "code": "// IMPURE: Mutates the incoming array\nfunction addItemImpure(arr, item) {\n  arr.push(item);\n  return arr;\n}\n\n// PURE: Returns a new array with no side effects\nfunction addItemPure(arr, item) {\n  return [...arr, item];\n}\n\nconst original = [1, 2];\nconst updated = addItemPure(original, 3);\nconsole.log(original); // [1, 2] (Preserved!)\nconsole.log(updated);  // [1, 2, 3]",
                "explanation": "Pure functions do not mutate their arguments, preventing accidental bugs across other parts of the application."
            },
            {
                "title": "Referential Transparency",
                "code": "// A pure function can be replaced by its evaluated value\nconst double = (x) => x * 2;\n\n// double(5) + double(5) is mathematically identical to:\n// 10 + 10\nconsole.log(double(5) + double(5)); // 20",
                "explanation": "Referential transparency allows compilers and memoization libraries to cache function results safely."
            }
        ],
        "explanation": "Pure functions form the bedrock of modern UI frameworks (React components, Redux reducers) because they are trivial to test, reason about, parallelize, and cache.",
        "useCases": [
            "**State Management (Redux/Zustand)**: Writing deterministic state transitions `(state, action) => newState`.",
            "**Memoization**: Caching heavy calculation results by argument hashes.",
            "**Unit Testing**: Writing robust tests without mocking external dependencies or clearing global state."
        ],
        "memoryModel": "Pure functions avoid escaping pointer writes outside their stack frame, allowing optimizing compilers to perform aggressive dead-code elimination and register allocation.",
        "visualizationType": "callstack"
    },
    "currying": {
        "definition": "Currying is the functional technique of transforming a function that takes multiple arguments into a sequence of nesting functions that each take a single argument: `f(a, b, c) -> f(a)(b)(c)`.",
        "syntax": "// Standard function\nconst add = (a, b) => a + b;\n\n// Curried function\nconst curriedAdd = (a) => (b) => a + b;\n\nconst addFive = curriedAdd(5);\nconsole.log(addFive(3)); // 8",
        "examples": [
            {
                "title": "Generic Auto-Currying Utility",
                "code": "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args);\n    }\n    return (...nextArgs) => curried.apply(this, args.concat(nextArgs));\n  };\n}\n\nfunction sum(a, b, c) {\n  return a + b + c;\n}\n\nconst curriedSum = curry(sum);\nconsole.log(curriedSum(1)(2)(3)); // 6\nconsole.log(curriedSum(1, 2)(3)); // 6\nconsole.log(curriedSum(1)(2, 3)); // 6",
                "explanation": "`curry()` inspects `fn.length` (arity). If enough arguments have been provided, it executes `fn`; otherwise, it returns a closure waiting for the remaining arguments."
            },
            {
                "title": "Practical API Logging with Currying",
                "code": "const log = (severity) => (prefix) => (message) => {\n  console.log(`[${severity.toUpperCase()}] [${prefix}] ${message}`);\n};\n\nconst errorLogger = log(\"error\")(\"AUTH_SERVICE\");\nerrorLogger(\"Invalid token detected\"); // [ERROR] [AUTH_SERVICE] Invalid token detected\nerrorLogger(\"Session expired\");        // [ERROR] [AUTH_SERVICE] Session expired",
                "explanation": "Currying enables partial configuration, creating specialized utility functions without duplicating configuration strings."
            }
        ],
        "explanation": "Currying is closely related to Partial Application. While currying produces strict unary (single-argument) chains, both techniques leverage closures to lock in earlier parameters.",
        "useCases": [
            "**Configurable Utilities**: Pre-configuring loggers, API fetchers, and validators with shared endpoints or tokens.",
            "**Event Handlers**: Attaching parameter payloads to React event callbacks: `onClick={handleClick(id)}`.",
            "**Composition Pipelines**: Preparing unary functions for `compose()` and `pipe()` workflows."
        ],
        "memoryModel": "Each partially applied curried function allocates a closure environment on the Heap holding the accumulated arguments array until the final call triggers execution.",
        "visualizationType": "callstack"
    },
    "recursion-tco": {
        "definition": "Recursion is a programming pattern where a function calls itself to solve smaller instances of the same problem. A proper recursive algorithm requires a **Base Case** to stop recursion and a **Recursive Step** that moves toward the base case.",
        "syntax": "function countdown(n) {\n  if (n <= 0) return; // Base Case\n  console.log(n);\n  countdown(n - 1);  // Recursive Step\n}",
        "examples": [
            {
                "title": "Factorial with Tail Call Form",
                "code": "// Standard recursion (Not tail-call optimized: stack holds multiplier)\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\n// Tail-recursive form (Accumulator is passed in the final call)\nfunction factorialTail(n, acc = 1) {\n  if (n <= 1) return acc;\n  return factorialTail(n - 1, n * acc); // Tail call!\n}\n\nconsole.log(factorialTail(5)); // 120",
                "explanation": "In tail-recursive form, the recursive call is the very last operation. Nothing needs to be computed after the call returns."
            },
            {
                "title": "Flattening Deeply Nested Trees",
                "code": "const fileTree = {\n  name: \"root\",\n  children: [\n    { name: \"src\", children: [{ name: \"index.js\" }] },\n    { name: \"package.json\" }\n  ]\n};\n\nfunction collectFiles(node) {\n  let files = [node.name];\n  if (node.children) {\n    for (const child of node.children) {\n      files = files.concat(collectFiles(child));\n    }\n  }\n  return files;\n}\n\nconsole.log(collectFiles(fileTree)); // [\"root\", \"src\", \"index.js\", \"package.json\"]",
                "explanation": "Recursion is the natural algorithmic paradigm for traversing hierarchical structures like the DOM tree or JSON directory trees."
            }
        ],
        "explanation": "While Tail Call Optimization (TCO) was formally added to the ECMAScript 2015 specification, most major engines (including V8) disabled it in non-strict mode to preserve stack trace fidelity for debugging.",
        "useCases": [
            "**DOM / AST Traversals**: Walking through deeply nested component trees and syntax nodes.",
            "**Divide-and-Conquer Algorithms**: QuickSort, MergeSort, and Binary Search algorithms.",
            "**Recursive Data Modeling**: Rendering nested comment threads and navigational folder hierarchies."
        ],
        "memoryModel": "Without TCO, each recursive invocation pushes a new stack frame of size O(N). If recursion exceeds the stack size limit (~10,000 frames in V8), a `RangeError` is thrown.",
        "visualizationType": "callstack"
    },
    "variable-shadowing": {
        "definition": "Variable Shadowing occurs when a variable declared within an inner scope has the same identifier name as a variable declared in an outer scope. The inner declaration 'shadows' (masks) the outer one within the inner scope.",
        "syntax": "const name = \"Global\";\n\nfunction demo() {\n  const name = \"Local\"; // Shadows outer 'name'\n  console.log(name);    // \"Local\"\n}",
        "examples": [
            {
                "title": "Shadowing in Nested Block Scopes",
                "code": "let x = 100;\n\nif (true) {\n  let x = 200; // Inner x shadows outer x\n  console.log(\"Inner x:\", x); // 200\n\n  if (true) {\n    let x = 300; // Even deeper shadow\n    console.log(\"Deep x:\", x); // 300\n  }\n}\n\nconsole.log(\"Outer x:\", x); // 100 (unmodified!)",
                "explanation": "Inner declarations do not overwrite outer variables; they simply take precedence during identifier resolution."
            },
            {
                "title": "Accidental Shadowing in Event Callbacks",
                "code": "const error = \"Server connection lost\";\n\nfunction handleResponse(response) {\n  fetch('/api')\n    .then(res => res.json())\n    .catch(error => {\n      // ⚠️ Shadows outer 'error' string!\n      console.log(\"Catch block error:\", error.message);\n    });\n}\nconsole.log(\"Global error is safe:\", error);",
                "explanation": "Reusing variable names like `error`, `e`, or `data` can lead to shadowing bugs where the developer accidentally reads the inner parameter instead of outer context."
            }
        ],
        "explanation": "Linter rules like ESLint's `no-shadow` help developers avoid shadowing, ensuring code clarity and preventing accidental logic errors.",
        "useCases": [
            "**Scope Isolation**: Safely naming helper variables inside localized functions without checking all global variables.",
            "**Loop Counters**: Using `for (let i = 0...)` in nested loops without colliding with parent counters.",
            "**Clean Encapsulation**: Ensuring inner helper functions keep their state private."
        ],
        "memoryModel": "The JS engine searches for identifiers in the current Lexical Environment Record first. If found, search stops immediately (masking parent records). If not found, it traverses the `[[OuterEnv]]` pointer.",
        "visualizationType": "callstack"
    },
    "closure-loop-problem": {
        "definition": "The classic 'closure loop problem' occurs when asynchronous callbacks inside a loop capture a shared `var` variable. Because `var` is function-scoped, all callbacks reference the exact same memory slot after the loop finishes.",
        "syntax": "// The Bug:\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100); // logs 3, 3, 3\n}\n\n// The Fix (let):\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => console.log(j), 100); // logs 0, 1, 2\n}",
        "examples": [
            {
                "title": "The Historical IIFE Fix",
                "code": "for (var i = 0; i < 3; i++) {\n  // Before ES6 'let', we used an Immediately Invoked Function Expression:\n  (function(capturedIndex) {\n    setTimeout(() => {\n      console.log(\"IIFE captured:\", capturedIndex);\n    }, 100);\n  })(i);\n}\n// Outputs: 0, 1, 2",
                "explanation": "Passing `i` into the IIFE created a brand new function scope per iteration, locking the current value in memory."
            },
            {
                "title": "The Modern ES6 Block-Scoping Fix",
                "code": "for (let i = 0; i < 3; i++) {\n  setTimeout(() => {\n    console.log(\"Modern let captured:\", i);\n  }, 100);\n}\n// Outputs: 0, 1, 2",
                "explanation": "ES6 specified that `for (let ...)` creates a brand new Lexical Environment binding for each individual iteration of the loop."
            }
        ],
        "explanation": "This classic interview question illustrates the difference between function-scoped variables (`var`) and block-scoped variables (`let`), as well as how closures retain references to variables rather than snapshots of values.",
        "useCases": [
            "**Dynamic Button Listeners**: Attaching click listeners inside lists without displaying the index of the last element.",
            "**Staggered API Requests**: Scheduling delayed fetches with sequential indices.",
            "**Timer Animations**: Animating sequential elements with computed offsets."
        ],
        "memoryModel": "With `var`, one single binding exists in the outer Environment Record. With `let`, the V8 engine allocates a fresh Environment Record on the heap for every loop iteration, capturing that iteration's distinct value.",
        "visualizationType": "variables"
    },
    "new-binding": {
        "definition": "When a function is invoked with the `new` operator, it acts as a constructor. JavaScript executes four distinct steps: creates a new object, links prototypes, binds `this`, and returns the object.",
        "syntax": "function Person(name) {\n  this.name = name;\n}\n\nconst user = new Person(\"Subhajit\");",
        "examples": [
            {
                "title": "Simulating the new Operator",
                "code": "function customNew(Constructor, ...args) {\n  // 1. Create a fresh empty object linked to Constructor's prototype\n  const instance = Object.create(Constructor.prototype);\n\n  // 2. Invoke Constructor with 'this' bound to the new instance\n  const result = Constructor.apply(instance, args);\n\n  // 3. Return result if it's an object, otherwise return the instance\n  return (typeof result === 'object' && result !== null) ? result : instance;\n}\n\nfunction Car(model) {\n  this.model = model;\n}\nCar.prototype.drive = function() { return `Driving ${this.model}`; };\n\nconst car = customNew(Car, \"Tesla\");\nconsole.log(car.drive()); // \"Driving Tesla\"\nconsole.log(car instanceof Car); // true",
                "explanation": "This 4-step algorithm reproduces the exact behavior of JavaScript's native `new` keyword."
            },
            {
                "title": "Constructor Returning an Object Override",
                "code": "function Gadget() {\n  this.kind = \"Phone\";\n  return { custom: \"Overridden Object\" }; // Returns object!\n}\n\nconst g = new Gadget();\nconsole.log(g.kind);   // undefined!\nconsole.log(g.custom); // \"Overridden Object\"",
                "explanation": "If a constructor explicitly returns an object, that object replaces the newly created instance. Returning primitives (like a number or string) is ignored."
            }
        ],
        "explanation": "ES6 classes enforce calling constructors with `new`; calling a `class` constructor without `new` throws a `TypeError: Class constructor cannot be invoked without 'new'` via `new.target`.",
        "useCases": [
            "**Object Instantiation**: Creating stateful instances with shared prototype methods.",
            "**`new.target` Verification**: Detecting whether a function was invoked with `new` or directly.",
            "**Custom Data Structures**: Building Linked Lists, Trees, and Graph nodes."
        ],
        "memoryModel": "The engine allocates an object header on the GC heap, sets its hidden `__proto__` shape pointer to `Constructor.prototype`, and assigns the stack frame's `this` pointer to this new heap address.",
        "visualizationType": "callstack"
    },
    "lexical-this": {
        "definition": "Unlike regular functions whose `this` binding depends on how they are called (dynamic binding), **Arrow Functions** do not possess their own `this`. Instead, they capture `this` from the enclosing lexical scope at the time they are defined.",
        "syntax": "const obj = {\n  name: \"JSViz\",\n  regularFunc: function() { console.log(this.name); },\n  arrowFunc: () => { console.log(this.name); }\n};",
        "examples": [
            {
                "title": "Arrow Functions in Callbacks",
                "code": "const timerObj = {\n  seconds: 0,\n  start() {\n    // Arrow function captures 'this' from start()\n    setInterval(() => {\n      this.seconds++;\n      console.log(\"Seconds:\", this.seconds);\n    }, 1000);\n  }\n};\n\n// In ES5, developers had to do: var self = this; or func.bind(this);",
                "explanation": "Arrow functions resolve `this` just like any other identifier—by walking up the lexical scope chain."
            },
            {
                "title": "Where NOT to Use Arrow Functions",
                "code": "const profile = {\n  username: \"subhajit\",\n  // ⚠️ Object literal does NOT create a lexical scope!\n  greet: () => {\n    console.log(\"Hello, \" + this.username);\n  }\n};\n\nprofile.greet(); // \"Hello, undefined\" (this is globalThis/window)",
                "explanation": "Object curly braces `{}` do not define a scope. The arrow function's lexical scope is the outer module or window."
            }
        ],
        "explanation": "Because arrow functions have lexical `this`, `call()`, `apply()`, and `bind()` cannot override their `this`. Any context passed to them via those methods is simply ignored.",
        "useCases": [
            "**Event Listeners & Timers**: Retaining component context inside `setTimeout`, `fetch`, or event callbacks.",
            "**React Component Callbacks**: Defining class or functional callback handlers without binding in constructors.",
            "**Functional Pipelines**: Mapping data with array methods without losing context."
        ],
        "memoryModel": "Arrow functions omit the `[[ThisValue]]` slot in their Function Environment Record. The compiler rewrites identifier lookup of `this` to point to the outer lexical context's `this`.",
        "visualizationType": "callstack"
    },
    "object-immutability": {
        "definition": "JavaScript provides three levels of object immutability: `Object.preventExtensions()` (no new properties), `Object.seal()` (no adding or deleting properties), and `Object.freeze()` (completely read-only, non-configurable properties).",
        "syntax": "Object.preventExtensions(obj); // Can't add new props\nObject.seal(obj);              // Can't add/remove, can still edit existing\nObject.freeze(obj);            // Completely frozen (read-only)",
        "examples": [
            {
                "title": "Comparing the 3 Immutability Levels",
                "code": "const user = { name: \"Subhajit\", role: \"admin\" };\n\nObject.freeze(user);\n\n// Modifications fail silently (or throw TypeError in strict mode)\nuser.name = \"Alex\";\ndelete user.role;\nuser.age = 25;\n\nconsole.log(user); // { name: \"Subhajit\", role: \"admin\" }\nconsole.log(Object.isFrozen(user)); // true",
                "explanation": "`Object.freeze()` locks all properties: `writable: false` and `configurable: false`."
            },
            {
                "title": "Deep Freeze Utility",
                "code": "function deepFreeze(obj) {\n  Object.keys(obj).forEach(prop => {\n    if (typeof obj[prop] === 'object' && obj[prop] !== null) {\n      deepFreeze(obj[prop]);\n    }\n  });\n  return Object.freeze(obj);\n}\n\nconst config = deepFreeze({ api: { host: \"localhost\" } });\n// config.api.host = \"remote\"; // ❌ Prevented by deep freeze!",
                "explanation": "`Object.freeze()` is **shallow**. Nested objects inside a frozen parent can still be mutated unless recursively frozen."
            }
        ],
        "explanation": "Immutability guarantees prevent accidental state mutations in large applications, especially in predictable state stores like Redux and Zustand.",
        "useCases": [
            "**Constants & Configuration**: Freezing application configs to prevent runtime tampering.",
            "**Defensive APIs**: Returning frozen snapshots of internal engine states to prevent consumers from mutating them.",
            "**Security Hardening**: Freezing prototypes (`Object.freeze(Object.prototype)`) to block prototype pollution attacks."
        ],
        "memoryModel": "When an object is frozen, V8 transitions the object's Map (Hidden Class) to a frozen shape where all property descriptors are marked non-writable and non-configurable.",
        "visualizationType": "variables"
    },
    "object-create": {
        "definition": "`Object.create()` creates a new object with the specified prototype object and optional property descriptors. It allows direct prototypal inheritance without relying on constructor functions or classes.",
        "syntax": "const child = Object.create(parentPrototype, {\n  prop: { value: 1, writable: true }\n});",
        "examples": [
            {
                "title": "Pure Prototypal Delegation",
                "code": "const animal = {\n  makeSound() { return this.sound || \"silence\"; }\n};\n\nconst dog = Object.create(animal);\ndog.sound = \"Woof!\";\n\nconsole.log(dog.makeSound()); // \"Woof!\"\nconsole.log(Object.getPrototypeOf(dog) === animal); // true",
                "explanation": "`dog` delegates to `animal`. When `dog.makeSound()` is called, JS walks up the prototype chain and finds the method on `animal`."
            },
            {
                "title": "Dictionary Objects with No Prototype (Object.create(null))",
                "code": "// A pure dictionary with zero prototype baggage\nconst cleanMap = Object.create(null);\n\nconsole.log(cleanMap.toString); // undefined\nconsole.log(cleanMap.__proto__); // undefined\n\ncleanMap[\"key\"] = 123;\n// Immune to prototype pollution attacks!",
                "explanation": "`Object.create(null)` has no prototype (`[[Prototype]] = null`). It lacks methods like `toString` and `hasOwnProperty`, making it a safe hash-map."
            }
        ],
        "explanation": "Before ES6 classes, `Object.create(Parent.prototype)` was the standard, correct way to implement prototype inheritance between constructor functions.",
        "useCases": [
            "**Safe Hash Maps**: Using `Object.create(null)` to store user-submitted keys without prototype pollution risks.",
            "**Behavior Delegation (OLOO)**: Objects Linking to Other Objects without class overhead.",
            "**Polymorphic Cloning**: Creating lightweight derivative objects with fallback defaults."
        ],
        "memoryModel": "V8 allocates a new JSObject in the young generation heap whose hidden prototype pointer directly references the provided prototype object.",
        "visualizationType": "prototype"
    },
    "class-inheritance": {
        "definition": "Class inheritance allows a child class to inherit methods and properties from a parent class using the `extends` keyword. Inside the derived class constructor, `super()` must be called before accessing `this`.",
        "syntax": "class Animal {\n  constructor(name) { this.name = name; }\n  speak() { return `${this.name} makes a noise.`; }\n}\n\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name); // Invokes Animal constructor\n    this.breed = breed;\n  }\n}",
        "examples": [
            {
                "title": "Inheritance and Method Overriding with super",
                "code": "class Shape {\n  area() { return 0; }\n}\n\nclass Rectangle extends Shape {\n  constructor(w, h) {\n    super();\n    this.w = w;\n    this.h = h;\n  }\n  area() {\n    return this.w * this.h;\n  }\n}\n\nconst rect = new Rectangle(5, 10);\nconsole.log(rect.area()); // 50\nconsole.log(rect instanceof Shape); // true",
                "explanation": "`Rectangle.prototype` inherits from `Shape.prototype`. Calling `rect.area()` invokes the overridden method on `Rectangle`."
            },
            {
                "title": "The Mandatory super() Call Rule",
                "code": "class Parent {}\nclass Child extends Parent {\n  constructor() {\n    // console.log(this); // ❌ ReferenceError! Must call super() first!\n    super();\n    console.log(this); // ✅ Valid\n  }\n}\nnew Child();",
                "explanation": "In derived classes, `this` is uninitialized until `super()` executes because the parent class is responsible for allocating the instance."
            }
        ],
        "explanation": "JavaScript class inheritance is syntax sugar over prototypal delegation: `Child.prototype.__proto__ === Parent.prototype` and `Child.__proto__ === Parent` (for static inheritance).",
        "useCases": [
            "**Custom Error Hierarchies**: `class NotFoundError extends Error`.",
            "**UI Component Systems**: Custom web components `class MyButton extends HTMLElement`.",
            "**Framework Controllers**: Extending base services in backend frameworks like NestJS."
        ],
        "memoryModel": "When `new Child()` is invoked, an uninitialized context is pushed. `super()` calls `Parent`, which allocates the heap object and binds it to `this`, which is then handed down to `Child`.",
        "visualizationType": "callstack"
    },
    "private-class-fields": {
        "definition": "Private Class Fields (prefixed with `#`) provide hard runtime privacy in JavaScript classes. Private fields cannot be accessed or inspected outside the class body, even via `Object.keys()` or reflection.",
        "syntax": "class BankAccount {\n  #balance = 0; // Private field\n\n  deposit(amount) { this.#balance += amount; }\n  getBalance() { return this.#balance; }\n}",
        "examples": [
            {
                "title": "Private Fields and Private Methods",
                "code": "class Wallet {\n  #funds = 100;\n\n  #validate(amount) {\n    return amount > 0 && amount <= this.#funds;\n  }\n\n  spend(amount) {\n    if (this.#validate(amount)) {\n      this.#funds -= amount;\n      return true;\n    }\n    return false;\n  }\n}\n\nconst w = new Wallet();\nconsole.log(w.spend(30)); // true\n// console.log(w.#funds); // ❌ SyntaxError: Private field '#funds' must be declared in an enclosing class",
                "explanation": "Private fields are enforced at the language syntax level, providing true privacy unlike old conventions like `_underscores`."
            },
            {
                "title": "Static Initialization Blocks",
                "code": "class Database {\n  static #connection = null;\n\n  static {\n    // Runs once when class definition is evaluated\n    Database.#connection = \"DB_CONNECTED_POOL\";\n    console.log(\"Static block executed\");\n  }\n\n  static isConnected() { return Database.#connection !== null; }\n}\n\nconsole.log(Database.isConnected()); // true",
                "explanation": "`static { ... }` blocks run once during class declaration evaluation, ideal for complex static setup or secret sharing."
            }
        ],
        "explanation": "Unlike TypeScript's compile-time `private` keyword which disappears after transpilation, JavaScript `#` private identifiers are enforced strictly at runtime by the JS engine.",
        "useCases": [
            "**Encapsulating Sensitive State**: Hiding internal tokens, secrets, or raw connection pointers.",
            "**Defensive Class Invariants**: Guaranteeing callers cannot bypass validation by directly mutating fields.",
            "**Library Internal Refactoring**: Freely altering internal private helper methods without breaking public APIs."
        ],
        "memoryModel": "V8 models private class fields using an internal PrivateNames slot (conceptually similar to an internal WeakMap), decoupling them from normal string-keyed object property storage.",
        "visualizationType": "variables"
    },
    "cloning-objects": {
        "definition": "Cloning objects in JavaScript can be shallow or deep. Shallow cloning (`Object.assign` or spread `{...obj}`) only copies first-level properties, leaving nested objects shared by reference. Deep cloning creates fully independent copies.",
        "syntax": "// Shallow Clone\nconst shallow = { ...original };\nconst shallow2 = Object.assign({}, original);\n\n// Deep Clone (Modern Standard)\nconst deep = structuredClone(original);",
        "examples": [
            {
                "title": "Shallow Clone Mutation Trap",
                "code": "const user = {\n  name: \"Subhajit\",\n  preferences: { theme: \"dark\" }\n};\n\nconst shallow = { ...user };\nshallow.preferences.theme = \"light\";\n\n// The nested object was mutated in BOTH!\nconsole.log(user.preferences.theme); // \"light\" ⚠️",
                "explanation": "The spread operator copies pointer addresses for nested objects, so modifying `shallow.preferences` mutates `user.preferences`."
            },
            {
                "title": "Deep Cloning with structuredClone",
                "code": "const complex = {\n  date: new Date(),\n  items: [1, 2, { id: 99 }],\n  map: new Map([[\"key\", \"value\"]])\n};\n\nconst deep = structuredClone(complex);\ndeep.items[2].id = 100;\n\nconsole.log(complex.items[2].id); // 99 (Original completely safe!)\nconsole.log(deep.date instanceof Date); // true\nconsole.log(deep.map instanceof Map);   // true",
                "explanation": "`structuredClone()` is the native browser & Node.js standard for deep copying. Unlike `JSON.parse(JSON.stringify())`, it supports Dates, Maps, Sets, and circular references."
            }
        ],
        "explanation": "Avoid `JSON.parse(JSON.stringify())` because it drops `undefined`, `functions`, and `Symbols`, converts `Date` objects to ISO strings, and throws on circular references.",
        "useCases": [
            "**State Immutability**: Producing pristine copies of state in Redux or React before applying changes.",
            "**Undo / Redo History**: Storing independent snapshots of document states.",
            "**Web Worker Communication**: `structuredClone` is the exact algorithm used by `postMessage`."
        ],
        "memoryModel": "Shallow cloning copies 64-bit word pointers on the heap. `structuredClone` performs a deep graph traversal, allocating distinct new heap allocations for every reachable object.",
        "visualizationType": "datatypes"
    },
    "array-methods-mutating": {
        "definition": "JavaScript Array methods are strictly categorized into **mutating** (modifying the original array in-place) and **non-mutating** (returning a new array while preserving the original). ES2023 introduced non-mutating counterparts.",
        "syntax": "// Mutating (In-place)\narr.push(); arr.pop(); arr.shift(); arr.unshift();\narr.splice(); arr.sort(); arr.reverse();\n\n// Non-Mutating (Pure)\narr.slice(); arr.concat(); arr.map(); arr.filter();\n\n// Modern ES2023 Non-Mutating Counterparts:\narr.toSorted(); arr.toReversed(); arr.toSpliced(); arr.with(index, val);",
        "examples": [
            {
                "title": "arr.push()",
                "badge": "Mutating",
                "category": "Mutating (In-place)",
                "code": "const fruits = ['apple', 'banana'];\n\n// push() appends one or more items to the END of the array in-place\nconst newLength = fruits.push('cherry', 'date');\n\nconsole.log(\"Returned (new length):\", newLength); // 4\nconsole.log(\"Original fruits (mutated):\", fruits);  // ['apple', 'banana', 'cherry', 'date']",
                "explanation": "`push()` appends one or more elements to the end of the original array and mutates it in-place. Crucially, it returns the *new length* of the array, NOT the array itself."
            },
            {
                "title": "arr.pop()",
                "badge": "Mutating",
                "category": "Mutating (In-place)",
                "code": "const stack = ['task 1', 'task 2', 'task 3'];\n\n// pop() removes the LAST element from the array in-place\nconst removedItem = stack.pop();\n\nconsole.log(\"Returned (removed item):\", removedItem); // 'task 3'\nconsole.log(\"Original stack (mutated):\", stack);       // ['task 1', 'task 2']",
                "explanation": "`pop()` removes the last element from an array in-place and returns that element. If the array is already empty, it returns `undefined` without throwing an error."
            },
            {
                "title": "arr.shift()",
                "badge": "Mutating",
                "category": "Mutating (In-place)",
                "code": "const queue = ['customer A', 'customer B', 'customer C'];\n\n// shift() removes the FIRST element (index 0) in-place\nconst served = queue.shift();\n\nconsole.log(\"Returned (removed item):\", served); // 'customer A'\nconsole.log(\"Original queue (mutated):\", queue);  // ['customer B', 'customer C']",
                "explanation": "`shift()` removes the element at index 0 and shifts all remaining elements down by one index. It mutates the array in-place with O(N) linear time complexity and returns the removed element."
            },
            {
                "title": "arr.unshift()",
                "badge": "Mutating",
                "category": "Mutating (In-place)",
                "code": "const queue = ['normal task', 'low task'];\n\n// unshift() prepends one or more elements to the BEGINNING (index 0)\nconst newLength = queue.unshift('URGENT task');\n\nconsole.log(\"Returned (new length):\", newLength); // 3\nconsole.log(\"Original queue (mutated):\", queue);    // ['URGENT task', 'normal task', 'low task']",
                "explanation": "`unshift()` inserts one or more items at the beginning of the array in-place, shifting existing items forward. Like `push()`, it returns the *new array length*."
            },
            {
                "title": "arr.splice()",
                "badge": "Mutating",
                "category": "Mutating (In-place)",
                "code": "const items = ['a', 'b', 'c', 'd'];\n\n// splice(start, deleteCount, ...itemsToAdd)\n// Removes 2 items starting at index 1, and inserts 'X' & 'Y':\nconst deleted = items.splice(1, 2, 'X', 'Y');\n\nconsole.log(\"Returned (deleted items):\", deleted); // ['b', 'c']\nconsole.log(\"Original items (mutated):\", items);   // ['a', 'X', 'Y', 'd']",
                "explanation": "`splice()` is the Swiss Army knife for in-place array modification. It can remove, insert, or replace elements at any index. It mutates the original array and returns an array of the deleted elements."
            },
            {
                "title": "arr.sort()",
                "badge": "Mutating",
                "category": "Mutating (In-place)",
                "code": "const scores = [40, 10, 100, 25, 5];\n\n// ⚠️ Default sort converts to strings (e.g., '100' comes before '25'):\n// scores.sort(); -> [10, 100, 25, 40, 5]\n\n// Proper numeric sort in-place:\nscores.sort((a, b) => a - b);\n\nconsole.log(\"Original scores (mutated):\", scores); // [5, 10, 25, 40, 100]",
                "explanation": "`sort()` reorders array elements in-place and returns the same array reference. Always provide a comparator function `(a, b) => a - b` when sorting numbers to avoid lexicographical string sorting bugs."
            },
            {
                "title": "arr.reverse()",
                "badge": "Mutating",
                "category": "Mutating (In-place)",
                "code": "const letters = ['a', 'b', 'c', 'd'];\n\n// reverse() inverts element order directly in memory\nconst returnedRef = letters.reverse();\n\nconsole.log(\"Original letters (mutated):\", letters);     // ['d', 'c', 'b', 'a']\nconsole.log(\"Returns same array reference?:\", returnedRef === letters); // true",
                "explanation": "`reverse()` flips the array elements in-place. The first becomes the last, and the last becomes the first. It mutates the array and returns the mutated array reference itself."
            },
            {
                "title": "arr.slice()",
                "badge": "Non-Mutating",
                "category": "Non-Mutating (Pure)",
                "code": "const animals = ['ant', 'bison', 'camel', 'duck', 'elephant'];\n\n// slice(start, endExclusive) creates a shallow copy of a slice\nconst extracted = animals.slice(1, 4);\n\nconsole.log(\"Returned copy:\", extracted);           // ['bison', 'camel', 'duck']\nconsole.log(\"Original animals (pure/intact):\", animals); // ['ant', 'bison', 'camel', 'duck', 'elephant']",
                "explanation": "`slice()` extracts a section of an array and returns a brand-new array. The original array is left completely untouched (non-mutating)."
            },
            {
                "title": "arr.concat()",
                "badge": "Non-Mutating",
                "category": "Non-Mutating (Pure)",
                "code": "const teamA = ['Alice', 'Bob'];\nconst teamB = ['Charlie', 'Dana'];\n\n// concat() joins arrays or values into a brand NEW array\nconst merged = teamA.concat(teamB, 'Eve');\n\nconsole.log(\"Returned merged copy:\", merged);   // ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve']\nconsole.log(\"Original teamA (pure/intact):\", teamA); // ['Alice', 'Bob']\nconsole.log(\"Original teamB (pure/intact):\", teamB); // ['Charlie', 'Dana']",
                "explanation": "`concat()` merges two or more arrays (or values) and returns a new combined array. None of the original input arrays are altered."
            },
            {
                "title": "arr.map()",
                "badge": "Non-Mutating",
                "category": "Non-Mutating (Pure)",
                "code": "const prices = [10, 20, 30];\n\n// map() transforms each element into a brand NEW array of identical length\nconst formatted = prices.map((p) => `$${p.toFixed(2)}`);\n\nconsole.log(\"Returned new array:\", formatted);   // ['$10.00', '$20.00', '$30.00']\nconsole.log(\"Original prices (pure/intact):\", prices); // [10, 20, 30]",
                "explanation": "`map()` calls a transformer callback on each element and returns a newly constructed array containing the returned values, preserving the original array."
            },
            {
                "title": "arr.filter()",
                "badge": "Non-Mutating",
                "category": "Non-Mutating (Pure)",
                "code": "const numbers = [12, 5, 8, 130, 44];\n\n// filter() creates a NEW array with elements that pass the boolean test\nconst bigNumbers = numbers.filter((num) => num >= 10);\n\nconsole.log(\"Returned new array:\", bigNumbers);   // [12, 130, 44]\nconsole.log(\"Original numbers (pure/intact):\", numbers); // [12, 5, 8, 130, 44]",
                "explanation": "`filter()` iterates through each element and evaluates a predicate function. It returns a new array with all elements that return a truthy value without mutating the source array."
            },
            {
                "title": "arr.toSorted()",
                "badge": "ES2023 Pure",
                "category": "Modern ES2023 Counterparts",
                "code": "const scores = [40, 10, 100, 25, 5];\n\n// ES2023 toSorted() sorts into a NEW array without mutating original!\nconst sortedScores = scores.toSorted((a, b) => a - b);\n\nconsole.log(\"Returned sorted copy:\", sortedScores); // [5, 10, 25, 40, 100]\nconsole.log(\"Original scores (pure/intact):\", scores);   // [40, 10, 100, 25, 5]",
                "explanation": "Introduced in ES2023, `toSorted()` provides the immutable counterpart to `sort()`. It returns a sorted copy of the elements, keeping the source array intact."
            },
            {
                "title": "arr.toReversed()",
                "badge": "ES2023 Pure",
                "category": "Modern ES2023 Counterparts",
                "code": "const items = ['first', 'second', 'third'];\n\n// ES2023 toReversed() returns a REVERSED COPY without mutating original!\nconst reversed = items.toReversed();\n\nconsole.log(\"Returned reversed copy:\", reversed); // ['third', 'second', 'first']\nconsole.log(\"Original items (pure/intact):\", items);   // ['first', 'second', 'third']",
                "explanation": "Introduced in ES2023, `toReversed()` is the immutable twin of `reverse()`. It produces a new array with items in reverse order while preserving the original array."
            },
            {
                "title": "arr.toSpliced()",
                "badge": "ES2023 Pure",
                "category": "Modern ES2023 Counterparts",
                "code": "const letters = ['a', 'b', 'c', 'd'];\n\n// ES2023 toSpliced(start, deleteCount, ...itemsToAdd)\n// ⚠️ Crucial difference: toSpliced() returns the RESULTING NEW ARRAY,\n// whereas splice() mutates original and returns deleted items!\nconst result = letters.toSpliced(1, 2, 'X', 'Y');\n\nconsole.log(\"Returned new array:\", result);        // ['a', 'X', 'Y', 'd']\nconsole.log(\"Original letters (pure/intact):\", letters); // ['a', 'b', 'c', 'd']",
                "explanation": "Introduced in ES2023, `toSpliced()` performs slice-and-splice operations without mutating the original array. Note that `toSpliced()` returns the new modified array, whereas `splice()` returns the deleted items."
            },
            {
                "title": "arr.with()",
                "badge": "ES2023 Pure",
                "category": "Modern ES2023 Counterparts",
                "code": "const users = ['Alice', 'Bob', 'Charlie'];\n\n// ES2023 with(index, newValue) returns a copy with ONE element replaced:\nconst updated = users.with(1, 'Bobby');\nconsole.log(\"Updated copy with(1, 'Bobby'):\", updated); // ['Alice', 'Bobby', 'Charlie']\nconsole.log(\"Original users (pure/intact):\", users);     // ['Alice', 'Bob', 'Charlie']\n\n// Supports negative index (counts from the end):\nconst replacedLast = users.with(-1, 'Chuck');\nconsole.log(\"Replaced last with(-1, 'Chuck'):\", replacedLast); // ['Alice', 'Bob', 'Chuck']",
                "explanation": "Introduced in ES2023, `arr.with(index, value)` replaces the value at the given index immutably, returning a new array. Negative indices count backward from the end (-1 is the last item)."
            }
        ],
        "goldenRules": [
            {
                "title": "Never mutate state arrays directly in React, Redux, or Vue",
                "trapCode": "// ⚠️ BUG IN REACT:\nconst [items, setItems] = useState([1, 2, 3]);\nitems.push(4); // Modifies original array in-place!\nsetItems(items); // React does Object.is(prev, next) -> SAME REFERENCE! -> NO RE-RENDER!",
                "why": "React and modern reactive state frameworks detect changes via shallow reference equality. Because mutating methods modify the existing array at the same heap address, the reference is identical and re-rendering is skipped. Always use non-mutating methods (toSorted, toSpliced, with, filter, map) or spread clones `[...items, 4]`."
            },
            {
                "title": "Beware: splice() returns deleted items, but toSpliced() returns the new array",
                "trapCode": "const arr = [1, 2, 3];\nconst res1 = arr.splice(1, 1);   // res1 is [2] (the deleted items) ⚠️\nconst res2 = arr.toSpliced(1, 1); // res2 is [1, 3] (the resulting array) ✅",
                "why": "This is one of the most common API signature traps in modern JavaScript. In-place `splice()` returns what was removed, whereas pure `toSpliced()` returns the newly constructed array with modifications applied."
            }
        ],
        "quiz": [
            {
                "id": "q1",
                "category": "Array Mutation",
                "badgeClass": "text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
                "title": "Which of the following array methods modifies the original array in-place?",
                "code": "const list = [1, 2, 3];\n// Which call mutates list directly?",
                "options": [
                    {
                        "letter": "A",
                        "label": "list.concat(4)",
                        "correct": false,
                        "why": "concat() is non-mutating; it allocates and returns a brand-new array without altering the original list."
                    },
                    {
                        "letter": "B",
                        "label": "list.push(4)",
                        "correct": true,
                        "why": "Correct! push() modifies the backing array storage in-place and returns the new length."
                    },
                    {
                        "letter": "C",
                        "label": "list.slice(0, 2)",
                        "correct": false,
                        "why": "slice() returns a shallow copy of the requested segment and does not mutate the original array."
                    },
                    {
                        "letter": "D",
                        "label": "list.toSorted()",
                        "correct": false,
                        "why": "toSorted() is an ES2023 non-mutating method that returns a new sorted array."
                    }
                ]
            },
            {
                "id": "q2",
                "category": "ES2023 APIs",
                "badgeClass": "text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
                "title": "How does ES2023 toSpliced() differ fundamentally from traditional splice()?",
                "code": "const arr = ['a', 'b', 'c'];\nconst x = arr.splice(1, 1);\nconst y = arr.toSpliced(1, 1);",
                "options": [
                    {
                        "letter": "A",
                        "label": "splice() mutates and returns deleted items, whereas toSpliced() preserves original and returns the resulting new array.",
                        "correct": true,
                        "why": "Correct! splice() returns deleted elements and mutates in-place; toSpliced() returns the new array without mutating."
                    },
                    {
                        "letter": "B",
                        "label": "toSpliced() only works with numbers, while splice() works with all types.",
                        "correct": false,
                        "why": "Both methods work with all JavaScript data types."
                    },
                    {
                        "letter": "C",
                        "label": "They are identical aliases; toSpliced() is just syntactic sugar for splice().",
                        "correct": false,
                        "why": "toSpliced() is pure and does not mutate the caller; splice() modifies the caller in-place."
                    },
                    {
                        "letter": "D",
                        "label": "toSpliced() returns a Promise that resolves asynchronously.",
                        "correct": false,
                        "why": "toSpliced() is a synchronous array method."
                    }
                ]
            },
            {
                "id": "q3",
                "category": "Modern Immutability",
                "badgeClass": "text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                "title": "How can you immutably update the item at index 2 of an array to 99?",
                "code": "const arr = [10, 20, 30, 40];",
                "options": [
                    {
                        "letter": "A",
                        "label": "arr[2] = 99;",
                        "correct": false,
                        "why": "Direct index assignment directly mutates the original array in-place."
                    },
                    {
                        "letter": "B",
                        "label": "const updated = arr.with(2, 99);",
                        "correct": true,
                        "why": "Correct! ES2023 arr.with(index, value) returns a new array with the element at index replaced, leaving arr unmodified."
                    },
                    {
                        "letter": "C",
                        "label": "arr.splice(2, 1, 99);",
                        "correct": false,
                        "why": "splice() mutates arr in-place."
                    },
                    {
                        "letter": "D",
                        "label": "arr.push(99);",
                        "correct": false,
                        "why": "push() appends to the end of arr and mutates it."
                    }
                ]
            }
        ],
        "explanation": "Writing clean, predictable applications requires knowing whether a method mutates in-place. In modern React and state-driven apps, mutation leads to dropped re-renders and stale UI.",
        "useCases": [
            "**React State Updates**: Using `toSorted()` or `filter()` instead of mutating state arrays.",
            "**Data Pipelines**: Chaining non-mutating transforms `arr.filter().toSorted().map()` safely.",
            "**Performance Optimization**: Using in-place `splice()` or `push()` inside tight computational loops where memory allocation is critical."
        ],
        "memoryModel": "Mutating methods modify the backing storage vector in-place. Non-mutating methods allocate a new ArrayBuffer vector on the heap and copy the element pointers.",
        "visualizationType": "arrays"
    },
    "array-reduce-mastery": {
        "definition": "`Array.prototype.reduce()` executes a reducer callback function on each element of the array, passing the return value from calculation on the preceding element. It is the universal array transformer.",
        "syntax": "array.reduce((accumulator, currentValue, index, array) => {\n  return nextAccumulator;\n}, initialValue);",
        "examples": [
            {
                "title": "Grouping Data (Object.groupBy alternative)",
                "code": "const people = [\n  { name: \"Subhajit\", role: \"Dev\" },\n  { name: \"Sarah\", role: \"Dev\" },\n  { name: \"Alex\", role: \"Design\" }\n];\n\nconst grouped = people.reduce((acc, person) => {\n  const role = person.role;\n  acc[role] = acc[role] || [];\n  acc[role].push(person.name);\n  return acc;\n}, {});\n\nconsole.log(grouped);\n// { Dev: [\"Subhajit\", \"Sarah\"], Design: [\"Alex\"] }",
                "explanation": "`reduce` easily aggregates lists into grouped dictionaries in a single O(N) pass."
            },
            {
                "title": "Sequential Promise Execution Pipeline",
                "code": "const tasks = [\n  () => Promise.resolve(\"Step 1 done\"),\n  (prev) => Promise.resolve(prev + \" -> Step 2 done\"),\n  (prev) => Promise.resolve(prev + \" -> Step 3 done\")\n];\n\ntasks.reduce((chain, currentTask) => {\n  return chain.then(currentTask);\n}, Promise.resolve(\"Start\")).then(console.log);\n// \"Start -> Step 1 done -> Step 2 done -> Step 3 done\"",
                "explanation": "`reduce` can chain async operations sequentially without complex recursion."
            }
        ],
        "explanation": "Any array method (`map`, `filter`, `find`, `every`) can be implemented using `reduce`. Always supply an `initialValue` to avoid unexpected behavior with empty arrays.",
        "useCases": [
            "**Statistical Calculations**: Computing sums, averages, medians, and min/max in a single pass.",
            "**Composing Middleware**: Redux's `applyMiddleware` uses `reduce` to wrap dispatch functions.",
            "**Flattening Deep Data**: Accumulating nested data sets into normalized lookup maps."
        ],
        "memoryModel": "The accumulator persists across iterations in the function's activation frame, eliminating the need to allocate intermediate arrays on the heap.",
        "visualizationType": "arrays"
    },
    "weakmap-weakset": {
        "definition": "`WeakMap` and `WeakSet` are collections whose keys (for WeakMap) and values (for WeakSet) must be objects (or non-registered symbols) and are held **weakly**. If no other reference to the object exists, it can be garbage collected.",
        "syntax": "const wm = new WeakMap();\nlet key = { id: 1 };\nwm.set(key, \"metadata\");\n\nkey = null; // The entry is automatically removed from memory by GC!",
        "examples": [
            {
                "title": "Storing Private DOM Node Metadata",
                "code": "const clickCounters = new WeakMap();\n\nfunction trackClick(btnElement) {\n  let count = clickCounters.get(btnElement) || 0;\n  clickCounters.set(btnElement, count + 1);\n  console.log(\"Button clicked:\", count + 1);\n}\n\n// When btnElement is removed from the DOM and discarded,\n// its counter in WeakMap is automatically garbage-collected!",
                "explanation": "Because the reference is weak, WeakMap prevents memory leaks when DOM elements are created and removed dynamically."
            },
            {
                "title": "WeakSet for Object Tagging",
                "code": "const visitedNodes = new WeakSet();\n\nfunction processNode(node) {\n  if (visitedNodes.has(node)) {\n    return; // Already processed\n  }\n  visitedNodes.add(node);\n  console.log(\"Processing unique node:\", node.id);\n}\n\nlet item = { id: 42 };\nprocessNode(item);\nprocessNode(item); // Skipped",
                "explanation": "WeakSet lets you tag objects with booleans without modifying the objects or preventing their garbage collection."
            }
        ],
        "explanation": "Because keys are weak and can disappear at any moment during garbage collection, `WeakMap` and `WeakSet` are **not iterable** and have no `.size` property or `.keys()` method.",
        "useCases": [
            "**Preventing Memory Leaks**: Associating temporary metadata with external DOM elements.",
            "**Truly Private Class State**: Emulating private instance variables in ES5 libraries.",
            "**Memoization Caches**: Caching computed results for objects without pinning them in memory."
        ],
        "memoryModel": "V8 Ephemeron tables link keys weakly. The garbage collector does not treat WeakMap keys as GC roots; if no strong path exists to the key, the key and its value are swept during Mark-Sweep.",
        "visualizationType": "mapset"
    },
    "dataview": {
        "definition": "`DataView` provides a low-level interface for reading and writing multiple number types in a binary `ArrayBuffer`, regardless of the host CPU's native endianness (byte order).",
        "syntax": "const buffer = new ArrayBuffer(16);\nconst view = new DataView(buffer);\n\n// write 16-bit integer at byte offset 0, little-endian = true\nview.setInt16(0, 42, true);\n\n// read back\nconst val = view.getInt16(0, true);",
        "examples": [
            {
                "title": "Handling Endianness (Big-Endian vs Little-Endian)",
                "code": "const buffer = new ArrayBuffer(4);\nconst view = new DataView(buffer);\n\n// Write 0x12345678 as Big-Endian (Network Byte Order)\nview.setUint32(0, 0x12345678, false); // false = Big Endian\n\n// Read first byte\nconsole.log(\"Byte 0:\", view.getUint8(0).toString(16)); // \"12\"\n\n// Read as Little-Endian (x86 CPU native)\nconsole.log(\"Little Endian read:\", view.getUint32(0, true).toString(16));\n// \"78563412\" (Byte order reversed!)",
                "explanation": "Network protocols typically use Big-Endian, while modern CPUs (x86, ARM) use Little-Endian. DataView bridges this gap cleanly."
            },
            {
                "title": "Parsing Binary File Headers (e.g. BMP / PNG)",
                "code": "function readWavHeader(buffer) {\n  const view = new DataView(buffer);\n  // Read 4-character ASCII tag\n  const tag = String.fromCharCode(\n    view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3)\n  );\n  return { tag };\n}",
                "explanation": "`DataView` enables parsing binary game assets, audio files, and WebGL buffers directly in JavaScript."
            }
        ],
        "explanation": "While TypedArray views (`Uint8Array`, `Float32Array`) enforce uniform element types aligned to machine endianness, `DataView` gives byte-level offset control with explicit endianness flags.",
        "useCases": [
            "**Binary Network Protocols**: Parsing WebSocket binary frames and custom packet protocols.",
            "**Media File Decoders**: Reading audio, video, and image container headers in WebAssembly/JS.",
            "**WebGL & Canvas Graphics**: Interfacing with custom vertex buffer layouts."
        ],
        "memoryModel": "DataView wraps a raw C++ heap buffer (`v8::internal::ArrayBuffer`). Reading or writing executes direct byte-level memory loads/stores with optional bitwise byte swapping for endianness.",
        "visualizationType": "arrays"
    },
    "sparse-vs-dense-arrays": {
        "definition": "JavaScript distinguishes between **dense (packed)** arrays and **sparse (holey)** arrays. Sparse arrays contain 'holes' (missing indices where no element has ever been defined), causing the V8 engine to de-optimize array lookups into prototype hash-table lookups.",
        "syntax": "// Dense (Packed) Array\nconst dense = [1, 2, 3];\n\n// Sparse (Holey) Array\nconst sparse = [1, , 3]; // hole at index 1\nconst emptySlots = new Array(5); // 5 holes!",
        "examples": [
            {
                "title": "Holes vs undefined",
                "code": "const sparse = [1, , 3];\nconst denseWithUndefined = [1, undefined, 3];\n\nconsole.log(sparse[1]);              // undefined\nconsole.log(denseWithUndefined[1]); // undefined\n\n// BUT:\nconsole.log(1 in sparse);              // false (Index 1 doesn't exist!)\nconsole.log(1 in denseWithUndefined); // true (Index 1 exists with value undefined)\n\nsparse.forEach((val, i) => console.log(i)); // logs 0, then 2 (skips hole!)",
                "explanation": "Array iteration methods (`forEach`, `map`, `reduce`) automatically skip holes in sparse arrays, leading to surprising bugs."
            },
            {
                "title": "Accidental Array De-optimization in V8",
                "code": "const arr = [1, 2, 3]; // PACKED_SMI_ELEMENTS (fastest)\n\narr[1000] = 99; // ⚠️ De-optimizes to HOLEY_ELEMENTS dictionary mode!\n\nconsole.log(arr.length); // 1001\n// Looking up arr[500] now requires walking the prototype chain!",
                "explanation": "Setting an index far beyond the array length turns the fast contiguous vector into a dictionary-backed sparse structure."
            }
        ],
        "explanation": "To keep array access fast, always initialize arrays densely using `Array.from({ length: 5 }, () => 0)` or `arr.fill(0)` instead of `new Array(5)`.",
        "useCases": [
            "**High-Performance Code**: Keeping V8 arrays in `PACKED_SMI_ELEMENTS` or `PACKED_DOUBLE_ELEMENTS` mode.",
            "**Safe Initialization**: Using `Array.from()` to construct pre-allocated arrays without holes.",
            "**Data Science / Graphics**: Preventing megamorphic element transition penalties."
        ],
        "memoryModel": "Dense arrays are stored as contiguous memory vectors in C++. Sparse arrays de-optimize into `NumberDictionary` hash maps where lookups take hash lookups and walk `Array.prototype`.",
        "visualizationType": "arrays"
    },
    "for-of-vs-for-in": {
        "definition": "`for...of` iterates over **iterable values** (arrays, strings, Maps, Sets, Generators) using the Iteration Protocol. `for...in` iterates over all **enumerable property keys** of an object and its prototype chain.",
        "syntax": "// for...of (Values of Iterables)\nfor (const value of iterable) { ... }\n\n// for...in (Keys of Objects)\nfor (const key in object) { ... }",
        "examples": [
            {
                "title": "The Classic Array Trap with for...in",
                "code": "const colors = [\"red\", \"green\", \"blue\"];\ncolors.customProperty = \"custom\";\n\nconsole.log(\"--- for...of ---\");\nfor (const color of colors) {\n  console.log(color); // \"red\", \"green\", \"blue\" (Values!)\n}\n\nconsole.log(\"--- for...in ---\");\nfor (const index in colors) {\n  console.log(index, typeof index); \n  // \"0\" string, \"1\" string, \"2\" string, \"customProperty\" string ⚠️\n}",
                "explanation": "`for...in` treats arrays as plain objects, iterating over string keys and extra attached properties."
            },
            {
                "title": "Prototype Chain Traversal in for...in",
                "code": "const parent = { inherited: true };\nconst child = Object.create(parent);\nchild.own = \"yes\";\n\nfor (const key in child) {\n  console.log(key); // \"own\", AND \"inherited\"! ⚠️\n}\n\n// Guarding with Object.hasOwn:\nfor (const key in child) {\n  if (Object.hasOwn(child, key)) {\n    console.log(\"Own key only:\", key); // \"own\"\n  }\n}",
                "explanation": "`for...in` traverses inherited prototype keys unless filtered with `Object.hasOwn()`."
            }
        ],
        "explanation": "Summary rule of thumb: Use `for...of` for collections, arrays, and iterables. Use `Object.keys()` or `Object.entries()` with `for...of` for plain objects. Almost never use `for...in` on arrays.",
        "useCases": [
            "**Iterable Processing**: Consuming strings character by character or reading array values with `for...of`.",
            "**Async Streams**: Consuming async generators with `for await (const chunk of stream)`.",
            "**Property Auditing**: Inspecting object keys and legacy property configurations."
        ],
        "memoryModel": "`for...of` calls the internal `[Symbol.iterator]()` method and repeatedly calls `.next()`. `for...in` requests the Shape/Map descriptor chain from the engine.",
        "visualizationType": "arrays"
    },
    "advanced-generators": {
        "definition": "Advanced Generators leverage **two-way communication** with `it.next(value)` to pass data into the generator, and `yield*` to delegate iteration to another generator or iterable.",
        "syntax": "function* delegateGen() {\n  yield* [1, 2];\n  const input = yield \"Send me something\";\n  yield `You said: ${input}`;\n}",
        "examples": [
            {
                "title": "Two-Way Data Transfer via next()",
                "code": "function* dialog() {\n  const name = yield \"What is your name?\";\n  const role = yield `Welcome, ${name}! What is your role?`;\n  return `Profile created: ${name} the ${role}`;\n}\n\nconst bot = dialog();\nconsole.log(bot.next().value);       // \"What is your name?\"\nconsole.log(bot.next(\"Subhajit\").value); // \"Welcome, Subhajit! What is your role?\"\nconsole.log(bot.next(\"Architect\").value); // \"Profile created: Subhajit the Architect\"",
                "explanation": "Values passed to `next(val)` become the return value of the paused `yield` expression inside the generator."
            },
            {
                "title": "Recursive Tree Flattening with yield*",
                "code": "function* walkTree(node) {\n  yield node.val;\n  if (node.children) {\n    for (const child of node.children) {\n      yield* walkTree(child); // Delegating to child generator\n    }\n  }\n}\n\nconst tree = { val: 1, children: [{ val: 2 }, { val: 3, children: [{ val: 4 }] }] };\nconsole.log([...walkTree(tree)]); // [1, 2, 3, 4]",
                "explanation": "`yield*` transparently yields all values from the sub-generator without manual loop unwrapping."
            }
        ],
        "explanation": "Generators provided the foundational architecture for async/await before native browser support existed (e.g. libraries like `co` and Redux Saga).",
        "useCases": [
            "**Redux Saga**: Managing complex async side effects and action coordination via sagas.",
            "**Infinite Lazy Sequences**: Generating prime numbers, IDs, or paginated requests on demand.",
            "**State Machines**: Implementing sequential step-by-step game loop or wizard workflows."
        ],
        "memoryModel": "When a generator yields, its execution stack frame is suspended and preserved as a heap-allocated GeneratorObject containing its register state, local variables, and program counter.",
        "visualizationType": "generator"
    },
    "reflect-api": {
        "definition": "The `Reflect` built-in object provides methods for interceptable JavaScript operations. The methods on `Reflect` correspond 1:1 with `Proxy` traps, allowing safe default behavior forwarding with proper receiver binding.",
        "syntax": "Reflect.get(target, propertyKey, receiver);\nReflect.set(target, propertyKey, value, receiver);\nReflect.has(target, propertyKey);\nReflect.deleteProperty(target, propertyKey);",
        "examples": [
            {
                "title": "Safe Property Access with Proxy & Reflect",
                "code": "const user = {\n  _name: \"Subhajit\",\n  get name() { return this._name; }\n};\n\nconst proxy = new Proxy(user, {\n  get(target, prop, receiver) {\n    console.log(`Intercepted read: ${prop}`);\n    // Passing 'receiver' ensures 'this' inside getters points to 'proxy'\n    return Reflect.get(target, prop, receiver);\n  }\n});\n\nconsole.log(proxy.name); // \"Intercepted read: name\" -> \"Subhajit\"",
                "explanation": "Using `Reflect.get(target, prop, receiver)` preserves the correct `this` binding inside getters when accessing proxied objects."
            },
            {
                "title": "Functional Property Deletion",
                "code": "const car = { make: \"Toyota\" };\n\n// Old way: returns true, but throws in strict mode if frozen\n// delete car.make;\n\n// Reflect way: returns boolean status cleanly\nconst success = Reflect.deleteProperty(car, \"make\");\nconsole.log(\"Deleted:\", success); // true",
                "explanation": "`Reflect` methods return clean booleans instead of throwing errors or using archaic operator syntax."
            }
        ],
        "explanation": "`Reflect` is not a constructor (`new Reflect()` throws TypeError). It acts as a namespace containing modern, functional equivalents of internal engine operations.",
        "useCases": [
            "**Proxy Handler Forwarding**: Forwarding operations to default engine implementations inside traps.",
            "**Metaprogramming & Reflection**: Cleanly defining properties with `Reflect.defineProperty()`.",
            "**Dynamic Instantiation**: Using `Reflect.construct(Target, args)` instead of `new`."
        ],
        "memoryModel": "Reflect methods map directly to ECMAScript internal abstract operations (`[[Get]]`, `[[Set]]`, `[[Delete]]`), bypassing intermediate operator parsing in V8.",
        "visualizationType": "metaprogramming"
    },
    "symbols-registry": {
        "definition": "The Global Symbol Registry allows symbols to be shared across distinct code realms (such as iframes, workers, or separate modules) using `Symbol.for(key)` and `Symbol.keyFor(sym)`.",
        "syntax": "// Look up or register global symbol\nconst sym1 = Symbol.for(\"app.version\");\nconst sym2 = Symbol.for(\"app.version\");\nconsole.log(sym1 === sym2); // true!\n\n// Retrieve symbol key\nconsole.log(Symbol.keyFor(sym1)); // \"app.version\"",
        "examples": [
            {
                "title": "Cross-Realm / Cross-Window Symbol Sharing",
                "code": "// Local Symbol: unique every call\nconst local1 = Symbol(\"token\");\nconst local2 = Symbol(\"token\");\nconsole.log(local1 === local2); // false\n\n// Global Registry Symbol: shared singleton key\nconst global1 = Symbol.for(\"shared.token\");\nconst global2 = Symbol.for(\"shared.token\");\nconsole.log(global1 === global2); // true ✅\n\n// Useful when communicating between iframe <-> parent window",
                "explanation": "`Symbol.for()` checks the global runtime symbol registry before allocating a new symbol, returning the shared instance if found."
            },
            {
                "title": "Well-Known Symbol: Symbol.hasInstance",
                "code": "class EvenNumber {\n  static [Symbol.hasInstance](instance) {\n    return typeof instance === 'number' && instance % 2 === 0;\n  }\n}\n\nconsole.log(4 instanceof EvenNumber); // true!\nconsole.log(7 instanceof EvenNumber); // false!",
                "explanation": "Well-known symbols customize language operators (`instanceof`, `for...of`, `split`) at the engine level."
            }
        ],
        "explanation": "While ordinary `Symbol('id')` is local and unique, `Symbol.for('id')` is global to the entire JavaScript runtime process.",
        "useCases": [
            "**Micro-Frontend State Coordination**: Sharing tokens across independent micro-frontend bundles.",
            "**Custom Pattern Matching**: Customizing `instanceof` with `Symbol.hasInstance`.",
            "**Extending Standard Protocols**: Hooking into `Symbol.iterator`, `Symbol.asyncIterator`, and `Symbol.isConcatSpreadable`."
        ],
        "memoryModel": "V8 maintains an internal string-keyed hash table for global symbols. Lookups in `Symbol.for()` query this table in O(1) time.",
        "visualizationType": "datatypes"
    },
    "top-level-await": {
        "definition": "Top-Level Await allows the `await` keyword to be used outside of `async` function bodies at the top level of **ES Modules**. It enables modules to act as asynchronous resources that coordinate before dependent modules evaluate.",
        "syntax": "// In an ES Module (.mjs or script type=\"module\")\nconst res = await fetch(\"https://api.example.com/config\");\nexport const config = await res.json();",
        "examples": [
            {
                "title": "Asynchronous Resource Initialization",
                "code": "// db.js\nconsole.log(\"1. Connecting to DB...\");\n// export const connection = await connectDatabase();\nconsole.log(\"2. DB Connected!\");\n\n// app.js\n// import { connection } from './db.js';\n// console.log(\"3. App started with connection!\");",
                "explanation": "Any module importing `db.js` will wait until `db.js` finishes awaiting before executing its own code."
            },
            {
                "title": "Dynamic Fallback Module Loading",
                "code": "let databaseService;\ntry {\n  databaseService = await import(\"./productionDb.js\");\n} catch (err) {\n  databaseService = await import(\"./mockDb.js\");\n}\nexport { databaseService };",
                "explanation": "Top-level await simplifies conditional asynchronous module imports."
            }
        ],
        "explanation": "Top-level await blocks the evaluation of modules that import it, but does not block sibling module evaluation, ensuring optimal parallel loading graphs.",
        "useCases": [
            "**Dynamic Configuration**: Fetching runtime environment settings before application bootstrap.",
            "**WebAssembly Loading**: `const wasm = await WebAssembly.instantiateStreaming(...)`.",
            "**Database Connection Pooling**: Guaranteeing DB connection pools are active before servicing queries."
        ],
        "memoryModel": "The module graph is evaluated as a Promise graph. The engine suspends module execution, registers the awaiting promise, and continues evaluating independent module branches.",
        "visualizationType": "eventloop"
    },
    "promise-chaining": {
        "definition": "Promise Chaining is the pattern of chaining `.then()`, `.catch()`, and `.finally()` calls together. Whatever value a `.then()` handler returns is automatically wrapped in a resolved Promise and forwarded to the next `.then()`.",
        "syntax": "fetchUserData()\n  .then(user => fetchUserOrders(user.id))\n  .then(orders => calculateTotal(orders))\n  .catch(err => handleError(err))\n  .finally(() => cleanup());",
        "examples": [
            {
                "title": "Return Value Unwrapping",
                "code": "Promise.resolve(10)\n  .then(val => {\n    console.log(\"Step 1:\", val); // 10\n    return val * 2; // returns number -> wrapped in Promise\n  })\n  .then(val => {\n    console.log(\"Step 2:\", val); // 20\n    return new Promise(res => setTimeout(() => res(val + 5), 100)); // returns Promise -> unwrapped!\n  })\n  .then(val => {\n    console.log(\"Step 3:\", val); // 25\n  });",
                "explanation": "If a handler returns a Promise, JavaScript pauses the chain and unwraps the resolved value before proceeding."
            },
            {
                "title": "Centralized Error Catching",
                "code": "Promise.resolve(\"data\")\n  .then(() => { throw new Error(\"Network timeout!\"); })\n  .then(() => console.log(\"Will not run\"))\n  .catch(err => {\n    console.log(\"Caught:\", err.message); // \"Caught: Network timeout!\"\n    return \"Fallback recovery value\";\n  })\n  .then(recovery => {\n    console.log(\"Resumed:\", recovery); // \"Resumed: Fallback recovery value\"\n  });",
                "explanation": "A `.catch()` handler intercepts any rejection above it in the chain and can recover the chain by returning a fallback value."
            }
        ],
        "explanation": "Promise chaining solved 'Callback Hell' (the Pyramid of Doom) by transforming deeply nested continuation callbacks into linear, top-to-bottom asynchronous pipelines.",
        "useCases": [
            "**Multi-Step API Pipelines**: Authenticate $\\rightarrow$ Fetch User $\\rightarrow$ Fetch Preferences $\\rightarrow$ Render.",
            "**Graceful Degradation**: Catching failed external API calls and providing offline cache data.",
            "**Resource Cleanup**: Closing database connections or file handles in `.finally()`."
        ],
        "memoryModel": "Each `.then()` allocation constructs a new PromiseReaction object containing capability records that link into the microtask queue upon settlement.",
        "visualizationType": "eventloop"
    },
    "promise-combinators": {
        "definition": "JavaScript provides four Promise Combinators to coordinate multiple asynchronous operations in parallel: `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, and `Promise.any()`.",
        "syntax": "Promise.all([p1, p2]);        // Fails fast if ANY reject\nPromise.allSettled([p1, p2]); // Waits for ALL, never rejects\nPromise.race([p1, p2]);       // First to settle (resolve OR reject)\nPromise.any([p1, p2]);        // First to FULFILL (ignores rejections)",
        "examples": [
            {
                "title": "Promise.all vs Promise.allSettled",
                "code": "const p1 = Promise.resolve(\"Data 1\");\nconst p2 = Promise.reject(\"Service Unavailable\");\n\n// Promise.all rejects immediately:\nPromise.all([p1, p2])\n  .catch(err => console.log(\"Promise.all failed:\", err));\n\n// Promise.allSettled completes all promises safely:\nPromise.allSettled([p1, p2])\n  .then(results => {\n    console.log(results);\n    // [\n    //   { status: 'fulfilled', value: 'Data 1' },\n    //   { status: 'rejected', reason: 'Service Unavailable' }\n    // ]\n  });",
                "explanation": "Use `Promise.all` when all operations must succeed (all-or-nothing). Use `Promise.allSettled` when you need partial successes."
            },
            {
                "title": "Request Timeout Pattern with Promise.race",
                "code": "const timeout = (ms) => new Promise((_, rej) => \n  setTimeout(() => rej(new Error(\"Timeout\")), ms)\n);\n\nfunction fetchWithTimeout(url, ms) {\n  return Promise.race([\n    fetch(url),\n    timeout(ms)\n  ]);\n}",
                "explanation": "`Promise.race()` settles with whichever promise completes first, making it ideal for timeout guards."
            }
        ],
        "explanation": "`Promise.any()` fulfills as soon as *any* promise fulfills. If all reject, it throws an `AggregateError` containing all rejection errors.",
        "useCases": [
            "**Batch Data Loading**: Loading user profile, notifications, and feed data simultaneously with `Promise.all`.",
            "**Dashboard Metrics**: Loading widgets independently with `Promise.allSettled` so one failure doesn't break the page.",
            "**Fastest Mirror Fetching**: Querying multiple CDN edge mirrors with `Promise.any`."
        ],
        "memoryModel": "Combinators allocate an internal counter and result array. Each incoming promise attaches reaction handlers that decrement the remaining counter until completion conditions are met.",
        "visualizationType": "eventloop"
    },
    "async-error-handling": {
        "definition": "Async error handling requires capturing both synchronous exceptions and asynchronous rejections. With `async/await`, errors are handled using standard `try...catch...finally` blocks, while unhandled rejections bubble up to runtime error handlers.",
        "syntax": "async function fetchData() {\n  try {\n    const res = await apiCall();\n    return res.data;\n  } catch (error) {\n    logger.error(\"Fetch failed\", error);\n    throw error; // Re-throw or return fallback\n  } finally {\n    setLoading(false);\n  }\n}",
        "examples": [
            {
                "title": "The Silent Catch Pitfall in Loops",
                "code": "async function processItems(items) {\n  // ⚠️ BAD: forEach does NOT await async callbacks!\n  // items.forEach(async (item) => { await save(item); });\n\n  // ✅ CORRECT: Sequential execution with for...of\n  for (const item of items) {\n    try {\n      await save(item);\n    } catch (err) {\n      console.error(`Failed saving item ${item.id}:`, err.message);\n    }\n  }\n}",
                "explanation": "`Array.prototype.forEach` does not await promises; errors inside async callbacks escape the caller's try/catch."
            },
            {
                "title": "Go-Style [err, data] Async Tuple Wrapper",
                "code": "async function to(promise) {\n  try {\n    const data = await promise;\n    return [null, data];\n  } catch (err) {\n    return [err, null];\n  }\n}\n\n// Usage:\nconst [err, user] = await to(fetchUser(42));\nif (err) {\n  console.log(\"Handled error:\", err.message);\n} else {\n  console.log(\"User:\", user);\n}",
                "explanation": "The tuple pattern eliminates deep nesting of `try/catch` blocks in linear async control flows."
            }
        ],
        "explanation": "Forgetting to `await` a promise or catch its rejection results in an unhandled promise rejection, which crashes modern Node.js processes by default.",
        "useCases": [
            "**Robust API Clients**: Retrying network failures and mapping status codes to domain errors.",
            "**Crash Prevention**: Catching background async worker errors before they terminate the process.",
            "**Resource Safety**: Ensuring database locks or loading spinners are released in `finally` blocks."
        ],
        "memoryModel": "When an `await` encounters a rejected promise, the V8 microtask scheduler synthesizes an exception on the suspended generator frame and resumes execution into the enclosing catch block.",
        "visualizationType": "eventloop"
    },
    "async-iteration": {
        "definition": "Async Iteration allows iterating over asynchronous data streams using the `for await...of` loop and the Async Iterable Protocol (`Symbol.asyncIterator`). Each call to `.next()` returns a Promise resolving to `{ value, done }`.",
        "syntax": "for await (const chunk of asyncStream) {\n  console.log(chunk);\n}\n\n// Defining an async iterable:\nconst customStream = {\n  [Symbol.asyncIterator]() {\n    return {\n      async next() {\n        return { value: data, done: false };\n      }\n    };\n  }\n};",
        "examples": [
            {
                "title": "Consuming a Stream with for await...of",
                "code": "async function* countStream() {\n  for (let i = 1; i <= 3; i++) {\n    await new Promise(r => setTimeout(r, 100)); // wait 100ms\n    yield `Stream Chunk #${i}`;\n  }\n}\n\nasync function run() {\n  for await (const chunk of countStream()) {\n    console.log(\"Received:\", chunk);\n  }\n  console.log(\"Stream completed!\");\n}\nrun();",
                "explanation": "`for await...of` automatically awaits each yielded promise before advancing to the next iteration."
            },
            {
                "title": "Reading Node.js File / HTTP Streams",
                "code": "// Simulating chunk-by-chunk stream reader\nasync function readLargeData(readableStream) {\n  let totalBytes = 0;\n  for await (const chunk of readableStream) {\n    totalBytes += chunk.length;\n    console.log(`Received ${chunk.length} bytes`);\n  }\n  return totalBytes;\n}",
                "explanation": "Async iterators simplify streaming without needing manual `.on('data')` and `.on('end')` listener choreography."
            }
        ],
        "explanation": "Async generators (`async function*`) combine generators with promises, enabling pull-based asynchronous streaming with backpressure handling.",
        "useCases": [
            "**Streaming LLM Responses**: Consuming chunked token streams from AI APIs (OpenAI, Gemini).",
            "**File I/O**: Reading massive multi-gigabyte log files line by line without memory exhaustion.",
            "**Paginated REST APIs**: Transparently fetching subsequent pages of results as the user scrolls."
        ],
        "memoryModel": "Each iteration step queues a microtask when the promise resolves, keeping memory usage constant regardless of stream length.",
        "visualizationType": "eventloop"
    },
    "abort-controller": {
        "definition": "`AbortController` is the standard web API used to cancel ongoing asynchronous tasks, HTTP fetch requests, timers, or event listeners via an associated `AbortSignal`.",
        "syntax": "const controller = new AbortController();\nconst signal = controller.signal;\n\n// Trigger cancellation\ncontroller.abort();",
        "examples": [
            {
                "title": "Cancelling an HTTP Fetch Request",
                "code": "const controller = new AbortController();\n\nsetTimeout(() => {\n  controller.abort(); // Cancel request after 200ms\n  console.log(\"Aborted fetch!\");\n}, 200);\n\nfetch(\"https://jsonplaceholder.typicode.com/photos\", { signal: controller.signal })\n  .then(res => res.json())\n  .catch(err => {\n    if (err.name === 'AbortError') {\n      console.log(\"Fetch successfully cancelled.\");\n    } else {\n      console.error(\"Other error:\", err);\n    }\n  });",
                "explanation": "Passing `controller.signal` tells the browser's network layer to immediately sever the HTTP socket when `.abort()` is invoked."
            },
            {
                "title": "Cancelling Event Listeners in Bulk",
                "code": "const controller = new AbortController();\n\nwindow.addEventListener('resize', () => console.log('Resizing'), { signal: controller.signal });\nwindow.addEventListener('scroll', () => console.log('Scrolling'), { signal: controller.signal });\n\n// Clean up all listeners at once:\ncontroller.abort();\nconsole.log(\"All listeners removed cleanly.\");",
                "explanation": "Passing `{ signal }` to `addEventListener` allows tearing down multiple event listeners in a single command."
            }
        ],
        "explanation": "`AbortSignal.timeout(ms)` (modern standard) creates a signal that automatically aborts after a timeout, removing the need for manual `setTimeout` controller cleanup.",
        "useCases": [
            "**Autocomplete Search**: Cancelling previous in-flight search queries as the user continues typing.",
            "**Component Teardown**: Aborting pending fetches in React `useEffect` cleanup return functions.",
            "**Request Timeouts**: Enforcing request deadlines with `signal: AbortSignal.timeout(5000)`."
        ],
        "memoryModel": "The AbortSignal maintains an internal list of abort algorithms. Calling `abort()` triggers these callbacks synchronously, freeing network buffers and socket file descriptors.",
        "visualizationType": "eventloop"
    },
    "timers-animation": {
        "definition": "Timers (`setTimeout`, `setInterval`) schedule asynchronous callbacks on the macrotask queue. `requestAnimationFrame` (rAF) schedules callbacks synchronized with the browser's display refresh rate (typically 60Hz - 144Hz) before the next repaint.",
        "syntax": "// Timer (Macrotask)\nconst timerId = setTimeout(callback, delayMs);\nclearTimeout(timerId);\n\n// Display Animation (Render Phase)\nconst frameId = requestAnimationFrame(timestamp => {\n  // runs immediately prior to browser paint\n});\ncancelAnimationFrame(frameId);",
        "examples": [
            {
                "title": "Why requestAnimationFrame is Superior for Smooth UI",
                "code": "let x = 0;\nconst box = { style: { transform: '' } };\n\nfunction animate(time) {\n  x += 2;\n  box.style.transform = `translateX(${x}px)`;\n  if (x < 300) {\n    requestAnimationFrame(animate); // Synchronized with display VSync\n  }\n}\nrequestAnimationFrame(animate);",
                "explanation": "`requestAnimationFrame` avoids frame drops (jank) because it executes right before the browser calculates styles, layout, and painting."
            },
            {
                "title": "Timer Clamping (The 4ms Rule)",
                "code": "let count = 0;\nconst start = Date.now();\n\nfunction rapid() {\n  count++;\n  if (count === 10) {\n    console.log(`10 intervals took: ${Date.now() - start}ms`);\n    return;\n  }\n  // Even with 0ms delay, browsers clamp nested timers to >= 4ms!\n  setTimeout(rapid, 0);\n}\nrapid();",
                "explanation": "HTML5 spec dictates that after 5 nested levels of `setTimeout`, the minimum delay is clamped to at least 4 milliseconds."
            }
        ],
        "explanation": "Timers in background tabs are heavily throttled by browsers (often clamped to 1000ms) to conserve battery. `requestAnimationFrame` is paused entirely when a tab is inactive.",
        "useCases": [
            "**Smooth UI Animations**: Moving, fading, and transforming DOM elements without tearing.",
            "**Game Loops**: Updating canvas or WebGL physics states aligned with monitor refresh rates.",
            "**Non-Blocking Scheduling**: Deferring heavy non-critical work with `requestIdleCallback`."
        ],
        "memoryModel": "Timers register timer handles in the browser's C++ timer wheel / min-heap. When the deadline expires, the callback is dispatched into the macrotask queue.",
        "visualizationType": "eventloop"
    },
    "dom-event-propagation": {
        "definition": "DOM Event Propagation describes the lifecycle of an event traveling through the DOM tree in three distinct phases: **Capturing Phase** (traveling down from `window` to target), **Target Phase** (executing on the target element), and **Bubbling Phase** (propagating back up to `window`).",
        "syntax": "// Listen in Bubbling Phase (default)\nelement.addEventListener('click', handler, false);\n\n// Listen in Capturing Phase\nelement.addEventListener('click', handler, true);\n\n// Stop Propagation\nevent.stopPropagation();\nevent.stopImmediatePropagation();",
        "examples": [
            {
                "title": "Event Delegation Pattern",
                "code": "// Instead of attaching 1,000 listeners to 1,000 <li> elements:\nconst list = document.querySelector('ul');\n\nlist.addEventListener('click', (event) => {\n  // Utilize bubbling: detect which button was clicked\n  const button = event.target.closest('button');\n  if (!button) return;\n  console.log(\"Clicked item ID:\", button.dataset.id);\n});",
                "explanation": "Event Delegation takes advantage of bubbling, saving substantial memory by using a single event listener on a parent container."
            },
            {
                "title": "stopPropagation vs preventDefault",
                "code": "function handleLink(e) {\n  e.preventDefault(); // Prevents navigating to the href URL\n  e.stopPropagation(); // Stops event from bubbling to parent elements\n  console.log(\"Custom link action executed\");\n}",
                "explanation": "`preventDefault()` stops default browser action (following a link, submitting a form). `stopPropagation()` stops the event from traveling up the DOM."
            }
        ],
        "explanation": "Events bubble by default (like `click`, `keydown`), but certain events do not bubble (such as `focus`, `blur`, `mouseenter`, `mouseleave`).",
        "useCases": [
            "**Event Delegation**: High-performance tables and lists with thousands of interactive rows.",
            "**Modal Click-Outside Detection**: Listening on `window` and checking `modal.contains(e.target)`.",
            "**Analytics & Tracking**: Capturing user interactions globally at the `document` level."
        ],
        "memoryModel": "During event dispatch, the browser's DOM engine computes the element ancestry chain array and traverses it forward (capture) and in reverse (bubble), invoking registered listener arrays.",
        "visualizationType": "internal"
    },
    "custom-events": {
        "definition": "`CustomEvent` enables decoupled, event-driven communication between isolated components or DOM nodes by creating and dispatching custom named events carrying arbitrary `detail` payloads.",
        "syntax": "const event = new CustomEvent('user:login', {\n  detail: { userId: 42, role: 'admin' },\n  bubbles: true,\n  cancelable: true\n});\n\ntargetElement.dispatchEvent(event);",
        "examples": [
            {
                "title": "Decoupled Cross-Component Messaging",
                "code": "// Component A: Dispatches event\nfunction triggerNotification(msg) {\n  const ev = new CustomEvent('app:notify', {\n    detail: { message: msg, time: Date.now() },\n    bubbles: true\n  });\n  window.dispatchEvent(ev);\n}\n\n// Component B: Listens independently\nwindow.addEventListener('app:notify', (e) => {\n  console.log(\"Notification received:\", e.detail.message);\n});\n\ntriggerNotification(\"Settings saved successfully!\");",
                "explanation": "Components A and B do not know about each other; they communicate exclusively through the native event bus."
            },
            {
                "title": "Cancelable Custom Events",
                "code": "const ev = new CustomEvent('item:delete', {\n  detail: { id: 99 },\n  cancelable: true\n});\n\nconst allowed = window.dispatchEvent(ev);\nif (!allowed) {\n  console.log(\"Deletion was cancelled by an event listener!\");\n}",
                "explanation": "If a listener calls `e.preventDefault()`, `dispatchEvent()` returns `false`, allowing listeners to veto operations."
            }
        ],
        "explanation": "Custom events allow building lightweight pub/sub systems natively inside the browser without importing third-party libraries like EventEmitter.",
        "useCases": [
            "**Micro-Frontend Communication**: Emitting events across isolated React, Vue, and vanilla DOM boundaries.",
            "**Web Components**: Exposing lifecycle events (`modal-closed`, `tab-changed`) from shadow DOM to parent apps.",
            "**Plugin Systems**: Allowing third-party plugins to hook into application state events."
        ],
        "memoryModel": "The event object and its `detail` dictionary are allocated in the JS heap. `dispatchEvent` invokes registered callback listeners synchronously within the current call stack.",
        "visualizationType": "internal"
    },
    "fetch-streams": {
        "definition": "The `Fetch API` returns responses whose `.body` property is a `ReadableStream`. Instead of buffering the entire payload into RAM with `res.json()`, data can be processed chunk-by-chunk as bytes arrive from the network.",
        "syntax": "const response = await fetch(url);\nconst reader = response.body.getReader();\n\nwhile (true) {\n  const { value, done } = await reader.read();\n  if (done) break;\n  // value is a Uint8Array chunk\n}",
        "examples": [
            {
                "title": "Streaming Text with TextDecoder",
                "code": "async function streamText(url) {\n  const response = await fetch(url);\n  const reader = response.body.getReader();\n  const decoder = new TextDecoder(\"utf-8\");\n\n  while (true) {\n    const { value, done } = await reader.read();\n    if (done) break;\n    const textChunk = decoder.decode(value, { stream: true });\n    console.log(\"Received chunk:\", textChunk);\n  }\n}",
                "explanation": "`TextDecoder({ stream: true })` handles multi-byte characters split across chunk boundaries."
            },
            {
                "title": "Tracking Download Progress",
                "code": "async function fetchWithProgress(url) {\n  const res = await fetch(url);\n  const total = +res.headers.get('Content-Length') || 0;\n  let loaded = 0;\n  const reader = res.body.getReader();\n\n  while (true) {\n    const { value, done } = await reader.read();\n    if (done) break;\n    loaded += value.length;\n    console.log(`Progress: ${Math.round((loaded / total) * 100)}%`);\n  }\n}",
                "explanation": "Streaming allows real-time calculation of download percentages without holding entire files in memory."
            }
        ],
        "explanation": "Fetch streaming enables the typewriter effect in modern AI chat interfaces (ChatGPT, Claude) by rendering tokens as they are generated by backend servers.",
        "useCases": [
            "**AI Chat Token Streaming**: Rendering markdown text progressively from Server-Sent Events (SSE).",
            "**Large File Downloads**: Streaming gigabyte-sized CSVs or video files with minimal memory footprint.",
            "**Transform Pipelines**: Piping network streams into compression/decompression transforms."
        ],
        "memoryModel": "The browser network process fills an internal ring buffer. Reading chunks transfers ownership of the underlying `Uint8Array` memory to JavaScript without duplicating buffer bytes.",
        "visualizationType": "eventloop"
    },
    "web-workers": {
        "definition": "`Web Workers` allow running JavaScript scripts in background threads isolated from the main UI thread. Workers prevent compute-heavy operations from blocking user interactions, scrolling, or animations.",
        "syntax": "// In main script:\nconst worker = new Worker('worker.js');\nworker.postMessage({ data: 100 });\nworker.onmessage = (e) => console.log(e.data);\n\n// In worker.js:\nself.onmessage = (e) => {\n  const result = heavyCalculation(e.data);\n  self.postMessage(result);\n};",
        "examples": [
            {
                "title": "Offloading Heavy Sorting to a Worker",
                "code": "// main.js\nconst worker = new Worker('worker.js');\n\nworker.postMessage({ action: 'SORT', data: [99, 12, 54, 3, 1] });\n\nworker.onmessage = (e) => {\n  console.log(\"Sorted by background worker:\", e.data);\n  worker.terminate(); // Clean up thread\n};",
                "explanation": "Calculations inside the worker run on a distinct OS thread, keeping the main browser UI responsive at 60fps."
            },
            {
                "title": "Transferable Objects for Zero-Copy Messaging",
                "code": "const worker = new Worker('worker.js');\nconst largeBuffer = new ArrayBuffer(1024 * 1024 * 32); // 32MB\n\n// Transfer buffer ownership (zero-copy! O(1) performance)\nworker.postMessage({ buffer: largeBuffer }, [largeBuffer]);\n\nconsole.log(largeBuffer.byteLength); // 0! (Transferred, no longer accessible here)",
                "explanation": "Transferable objects move memory ownership between threads instantly without copying bytes."
            }
        ],
        "explanation": "Web Workers do **not** have access to the DOM, `window`, or `document`. They communicate strictly via asynchronous message passing (`postMessage`).",
        "useCases": [
            "**Image / Video Processing**: Applying filters, resizing images, and encoding video frames off the main thread.",
            "**Data Parsing**: Parsing massive JSON datasets, CSV files, and complex crypto operations.",
            "**Physics Engines**: Simulating game physics and collision detection independently of rendering."
        ],
        "memoryModel": "A Worker runs in a separate OS thread with its own independent V8 Isolate, heap, call stack, and event loop. Data sent via `postMessage` is copied using the Structured Clone algorithm unless transferred.",
        "visualizationType": "internal"
    },
    "browser-storage": {
        "definition": "Client-side storage mechanisms offer varying persistence, capacity, and performance: **LocalStorage** (synchronous, 5MB, string-only), **SessionStorage** (tab-scoped, 5MB), and **IndexedDB** (asynchronous, transactional, gigabyte-capacity NoSQL database).",
        "syntax": "// LocalStorage\nlocalStorage.setItem('theme', 'dark');\nconst theme = localStorage.getItem('theme');\n\n// IndexedDB (Async transaction)\nconst request = indexedDB.open('AppDB', 1);",
        "examples": [
            {
                "title": "Safe JSON Storage with LocalStorage",
                "code": "const Storage = {\n  get(key, fallback = null) {\n    try {\n      const item = localStorage.getItem(key);\n      return item ? JSON.parse(item) : fallback;\n    } catch (e) {\n      return fallback;\n    }\n  },\n  set(key, value) {\n    try {\n      localStorage.setItem(key, JSON.stringify(value));\n    } catch (e) {\n      console.warn(\"Storage quota exceeded!\", e);\n    }\n  }\n};",
                "explanation": "Always wrap LocalStorage calls in `try/catch` because reading can fail in private browsing mode or when storage quotas are exceeded."
            },
            {
                "title": "IndexedDB Overview",
                "code": "// IndexedDB is non-blocking and stores complex data\nconst req = indexedDB.open(\"UserData\", 1);\nreq.onupgradeneeded = (e) => {\n  const db = e.target.result;\n  db.createObjectStore(\"files\", { keyPath: \"id\" });\n};\nreq.onsuccess = (e) => {\n  const db = e.target.result;\n  console.log(\"IndexedDB ready for binary & structured storage\");\n};",
                "explanation": "IndexedDB can store Blobs, ArrayBuffers, and complex nested objects without serializing to strings."
            }
        ],
        "explanation": "LocalStorage is synchronous and blocks the main thread on read/write. For apps storing megabytes of offline data or large media, IndexedDB is strongly recommended.",
        "useCases": [
            "**User Preferences**: Storing theme (`dark`/`light`) and UI layout settings in LocalStorage.",
            "**Form State / Session Cache**: Preserving wizard draft state across page refreshes in SessionStorage.",
            "**Offline Progressive Web Apps (PWA)**: Storing offline documents, images, and cached API responses in IndexedDB."
        ],
        "memoryModel": "LocalStorage and SessionStorage write to simple key-value disk files via the browser process. IndexedDB uses LevelDB / SQLite backing stores with B-Tree indexing on disk.",
        "visualizationType": "internal"
    },
    "mutation-observer": {
        "definition": "`MutationObserver` provides a high-performance, asynchronous mechanism to watch for changes being made to the DOM tree (such as added/removed nodes, attribute updates, or character data changes).",
        "syntax": "const observer = new MutationObserver((mutationsList, observer) => {\n  for (const mutation of mutationsList) {\n    console.log(\"Mutation detected:\", mutation.type);\n  }\n});\n\nobserver.observe(targetNode, {\n  childList: true,\n  subtree: true,\n  attributes: true\n});",
        "examples": [
            {
                "title": "Detecting Dynamic DOM Injections",
                "code": "const container = document.getElementById('feed');\n\nconst observer = new MutationObserver((mutations) => {\n  for (const m of mutations) {\n    if (m.type === 'childList') {\n      m.addedNodes.forEach(node => {\n        if (node.nodeType === 1) { // Element node\n          console.log(\"New element added:\", node.tagName);\n        }\n      });\n    }\n  }\n});\n\nobserver.observe(container, { childList: true });",
                "explanation": "`MutationObserver` batches notifications and executes after DOM changes settle, avoiding the performance penalties of legacy mutation events."
            },
            {
                "title": "IntersectionObserver for Infinite Scrolling",
                "code": "// Related modern observer: IntersectionObserver\nconst sentinel = document.querySelector('#load-more-sentinel');\n\nconst observer = new IntersectionObserver((entries) => {\n  if (entries[0].isIntersecting) {\n    console.log(\"Reached bottom! Load next page...\");\n  }\n}, { threshold: 1.0 });\n\nobserver.observe(sentinel);",
                "explanation": "Observers replace expensive scroll event listeners with hardware-accelerated visibility checks."
            }
        ],
        "explanation": "`MutationObserver` callbacks run as microtasks at the end of the current task, ensuring they complete before the browser repaints.",
        "useCases": [
            "**Third-Party Widgets**: Detecting when an external widget or ad script has rendered into the page.",
            "**Auto-Resizing Elements**: Synchronizing parent containers with dynamically expanding child content.",
            "**Lazy Loading**: Loading images and tracking analytics impressions with `IntersectionObserver`."
        ],
        "memoryModel": "The browser's layout engine queues mutation records in a microtask list. The observer callback is invoked with a batched array of records during microtask draining.",
        "visualizationType": "internal"
    },
    "unhandled-rejections": {
        "definition": "An **Unhandled Rejection** occurs when a Promise rejects and no `.catch()` handler or `try/catch` block intercepts the failure. Modern JavaScript runtimes provide global event traps to intercept and report these errors.",
        "syntax": "// In Browser:\nwindow.addEventListener('unhandledrejection', (event) => {\n  console.log(\"Unhandled promise:\", event.reason);\n  event.preventDefault(); // Prevents browser console error\n});\n\n// In Node.js:\nprocess.on('unhandledRejection', (reason, promise) => {\n  console.error(\"Unhandled Rejection at:\", promise, \"reason:\", reason);\n});",
        "examples": [
            {
                "title": "Global Error Boundary in Browsers",
                "code": "window.addEventListener('unhandledrejection', (event) => {\n  console.error(\"🔥 Global Async Catch:\", event.reason);\n\n  // Send error telemetry to server\n  // reportToSentry(event.reason);\n\n  // Prevent default console red error:\n  event.preventDefault();\n});\n\n// Example unhandled failure:\nPromise.reject(new Error(\"Failed to load user session!\"));",
                "explanation": "`unhandledrejection` provides a safety net catching async errors that escaped local component handling."
            },
            {
                "title": "Handling Delayed Rejection Handlers",
                "code": "window.addEventListener('rejectionhandled', (event) => {\n  console.log(\"A late .catch() handler was attached to:\", event.promise);\n});\n\nconst p = Promise.reject(\"Deferred error\");\n\nsetTimeout(() => {\n  // Attached 500ms late!\n  p.catch(err => console.log(\"Finally caught late:\", err));\n}, 500);",
                "explanation": "The `rejectionhandled` event fires if a handler is attached to a previously unhandled rejected promise."
            }
        ],
        "explanation": "In Node.js 16+, unhandled rejections terminate the process with a non-zero exit code by default, making proper global error handlers critical for server stability.",
        "useCases": [
            "**Centralized Error Telemetry**: Automatically forwarding unhandled errors to monitoring services like Datadog and Sentry.",
            "**Clean Server Shutdown**: Gracefully terminating worker pools upon unexpected database errors.",
            "**User Crash Dialogs**: Showing helpful feedback modals when background sync fails."
        ],
        "memoryModel": "When a promise rejects without a reaction, the engine flags it in an internal unhandled rejection list. If not handled by the end of the microtask turn, the global trap is invoked.",
        "visualizationType": "eventloop"
    },
    "garbage-collection": {
        "definition": "JavaScript manages memory automatically using **Garbage Collection (GC)**. The V8 engine implements a **Generational Garbage Collector** based on the hypothesis that most objects die young: splitting memory into **Young Generation (Scavenger)** and **Old Generation (Mark-Sweep-Compact)**.",
        "syntax": "// Reachability determines GC survival:\nlet user = { name: \"Subhajit\" }; // Heap object allocated (Reachable via 'user')\nuser = null; // Unreachable! Eligible for garbage collection.",
        "examples": [
            {
                "title": "Reachability Graph & Discarding Data",
                "code": "function createUser() {\n  const profile = { id: 101, token: \"xyz789\" };\n  return { id: profile.id }; // Only returns 'id'\n  // 'profile' variable goes out of scope.\n  // The object { id: 101, token: \"xyz789\" } becomes unreachable and is collected!\n}\n\nconst activeUser = createUser();",
                "explanation": "Once an object is no longer reachable from any GC Root (call stack, global object), its memory is freed."
            },
            {
                "title": "Circular References are Safely Handled",
                "code": "function createCycle() {\n  const a = {};\n  const b = {};\n  a.neighbor = b;\n  b.neighbor = a; // Circular reference!\n  return \"Done\";\n}\n\ncreateCycle();\n// Even though 'a' and 'b' reference each other,\n// neither is reachable from the Root. Modern Mark-and-Sweep collects both!",
                "explanation": "Unlike legacy reference counting, Mark-and-Sweep easily handles cyclic references because it checks root reachability."
            }
        ],
        "explanation": "The Young Gen uses the fast 'Scavenge' algorithm copying surviving objects between Semi-spaces. Objects surviving multiple cycles are promoted to the Old Generation, which uses incremental Mark-Sweep-Compact.",
        "useCases": [
            "**Memory-Efficient Algorithms**: Minimizing object allocations in render loops to prevent GC pauses.",
            "**Object Pooling**: Reusing object instances in games to prevent scavenger thrashing.",
            "**Profiling RAM in DevTools**: Using the Memory tab to analyze Heap Snapshots."
        ],
        "memoryModel": "The heap is divided into New Space (1-64MB) and Old Space (several GB). The Scavenger uses Cheney's copying algorithm; Old Space uses Tri-color marking (White, Grey, Black) incrementally.",
        "visualizationType": "internal"
    },
    "memory-leaks": {
        "definition": "A **Memory Leak** occurs when an application retains references to objects that are no longer needed, preventing the Garbage Collector from reclaiming their memory. Over time, leaks degrade performance and crash tabs.",
        "syntax": "// Common Leak Sources:\n// 1. Accidental Globals: window.leaked = ...\n// 2. Forgotten Timers: setInterval(...)\n// 3. Detached DOM Nodes\n// 4. Retained Closures",
        "examples": [
            {
                "title": "The Forgotten Timer Leak",
                "code": "function startTracking() {\n  const largeData = new Array(1000000).fill(\"data\");\n\n  // ⚠️ Leak: The timer callback retains 'largeData' forever\n  // even if the user navigates away from the page!\n  const timer = setInterval(() => {\n    console.log(\"Pinging with data length:\", largeData.length);\n  }, 1000);\n\n  // FIX: Always return a cleanup function:\n  return () => clearInterval(timer);\n}\n\nconst cleanup = startTracking();\n// cleanup(); // frees the timer and largeData",
                "explanation": "Intervals keep callbacks and their enclosed variables alive in memory until explicitly cancelled with `clearInterval()`."
            },
            {
                "title": "Detached DOM Tree Leak",
                "code": "let detachedButton = null;\n\nfunction createButton() {\n  const btn = document.createElement('button');\n  btn.textContent = 'Click me';\n  document.body.appendChild(btn);\n\n  // Storing a reference:\n  detachedButton = btn;\n\n  // Removing from DOM:\n  document.body.removeChild(btn);\n  // 'btn' is removed from the visible page, BUT still pinned in memory\n  // because detachedButton still points to it!\n}\n\ncreateButton();\n// Fix: detachedButton = null;",
                "explanation": "Keeping references to removed DOM elements retains the element and its entire tree of children in RAM."
            }
        ],
        "explanation": "Detect memory leaks in Chrome DevTools using the **Performance** tab (sawtooth memory graph indicates clean GC; steadily climbing line indicates a leak) and **Heap Snapshots**.",
        "useCases": [
            "**Single Page Apps (SPAs)**: Cleaning up subscriptions and event listeners when switching routes.",
            "**Long-Running Node.js Servers**: Preventing heap exhaustion under sustained traffic.",
            "**Chart & Visualizer Widgets**: Disposing canvas, SVG, and D3 elements upon component unmount."
        ],
        "memoryModel": "Retained paths in the GC Root tree prevent the Mark phase from marking the object White (swept). The heap footprint steadily grows until V8 reaches `max-old-space-size` and throws OOM.",
        "visualizationType": "internal"
    },
    "v8-compiler-pipeline": {
        "definition": "The **V8 Engine** executes JavaScript through an advanced multi-tier compilation pipeline: parsing source code into an **AST**, generating bytecode with the **Ignition** interpreter, and compiling hot functions into optimized machine code using the **TurboFan** JIT compiler.",
        "syntax": "Source JS Code\n      │\n  [Parser / Scanner]\n      ▼\nAbstract Syntax Tree (AST)\n      │\n  [Ignition Interpreter]\n      ▼\n    Bytecode (Executed + Profiled)\n      │\n  [TurboFan JIT Compiler]\n      ▼\nOptimized Machine Code",
        "examples": [
            {
                "title": "How Ignition and TurboFan Coordinate",
                "code": "function add(a, b) {\n  return a + b;\n}\n\n// 1. Initial calls: Ignition interprets bytecode and collects Type Feedback\nfor (let i = 0; i < 10000; i++) {\n  add(i, i + 1); // Type feedback: a is Integer, b is Integer\n}\n\n// 2. 'add' becomes 'hot': TurboFan compiles it directly to machine code\n// using fast integer assembly instructions.\n\n// 3. De-optimization trigger:\nadd(\"hello\", \"world\"); // ⚠️ Feedback violated! TurboFan bails out to Ignition.",
                "explanation": "TurboFan produces blistering assembly code by speculating that future calls will use the same types seen in past runs."
            },
            {
                "title": "Inspecting Bytecode and Compilation",
                "code": "// You can view V8 bytecode by running Node with:\n// node --print-bytecode --print-opt-code script.js\n\nfunction greet(name) {\n  return \"Hello \" + name;\n}\nconsole.log(greet(\"JSViz\"));",
                "explanation": "Ignition uses register-based bytecode, minimizing memory consumption on low-end mobile devices."
            }
        ],
        "explanation": "V8 also includes a fast baseline JIT compiler called **Sparkplug** positioned between Ignition and TurboFan to accelerate execution before full profiling completes.",
        "useCases": [
            "**Writing High-Performance JS**: Keeping functions monomorphic to avoid JIT de-optimizations.",
            "**Understanding Cold Start**: Minimizing large script payloads to reduce Parser / AST compilation time.",
            "**Serverless Optimization**: Optimizing function startup times in AWS Lambda / Vercel Edge."
        ],
        "memoryModel": "The Parser outputs an in-memory AST; Ignition translates AST nodes into an array of bytecode opcodes stored in the code space. TurboFan outputs direct CPU assembly instructions into executable memory pages.",
        "visualizationType": "internal"
    },
    "v8-hidden-classes": {
        "definition": "Because JavaScript is dynamically typed, V8 creates internal **Hidden Classes (Shapes or Maps)** behind the scenes to track object property layouts and memory offsets, enabling fast O(1) property lookups via **Inline Caches (IC)**.",
        "syntax": "// Object initialized with predictable property order\nfunction Point(x, y) {\n  this.x = x; // Transitions from Map0 -> Map1\n  this.y = y; // Transitions from Map1 -> Map2\n}",
        "examples": [
            {
                "title": "Shape Transitions and Property Order",
                "code": "// Object 1:\nconst p1 = {};\np1.x = 10;\np1.y = 20;\n\n// Object 2: (Different order!)\nconst p2 = {};\np2.y = 20;\np2.x = 10;\n\n// p1 and p2 end up with DIFFERENT Hidden Classes!\n// V8 cannot share optimized inline cache slots between them!",
                "explanation": "Always initialize object properties in the exact same order so V8 can share the same Hidden Class."
            },
            {
                "title": "Monomorphic vs Megamorphic Calls",
                "code": "function getX(point) {\n  return point.x; // Inline Cache caches point's shape\n}\n\n// MONOMORPHIC (Fastest: single shape)\ngetX({ x: 1, y: 2 });\ngetX({ x: 3, y: 4 });\n\n// MEGAMORPHIC (De-optimized: 5+ different shapes)\n// Passing completely different object shapes forces V8 into generic slow lookup!",
                "explanation": "Monomorphic function call-sites (always receiving objects of the same shape) run orders of magnitude faster than megamorphic ones."
            }
        ],
        "explanation": "Deleting properties with `delete obj.prop` changes the object's shape and transitions it into slow dictionary mode. Prefer setting properties to `null` or `undefined` instead of deleting them.",
        "useCases": [
            "**High-Performance Libraries**: Consistent constructor property order in graphics, 3D (Three.js), and game engines.",
            "**Avoiding Slow Mode**: Preventing accidental `delete` calls on critical domain objects.",
            "**Monomorphic Architecture**: Ensuring functions receive uniform object structures."
        ],
        "memoryModel": "Every JSObject has a 4-byte pointer to its `Map`. The Map stores property name arrays and their exact byte offset in the object's backing storage vector.",
        "visualizationType": "internal"
    },
    "deoptimization": {
        "definition": "A **De-optimization (Bailout)** occurs when an assumption made by TurboFan's optimizing JIT compiler is violated at runtime (e.g., passing a string into a function optimized for integers). The engine discards the machine code and bails out to the Ignition bytecode interpreter.",
        "syntax": "function compute(val) {\n  return val.count + 1; // TurboFan assumes val always has numeric 'count'\n}\n\ncompute({ count: 5 }); // Optimized\ncompute({ count: \"5\" }); // ⚠️ Bails out to interpreter!",
        "examples": [
            {
                "title": "Triggering a JIT Bailout",
                "code": "function sum(arr) {\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}\n\n// Warm up with integer array (PACKED_SMI)\nfor (let i = 0; i < 10000; i++) {\n  sum([1, 2, 3, 4]);\n}\n\n// De-optimization: pass array with holes or strings\nsum([1, \"two\", 3]); // JIT Bailout! Machine code discarded.",
                "explanation": "TurboFan had optimized `sum` for integers. Passing a string invalidates the speculative assumption, forcing a de-optimization bailout."
            },
            {
                "title": "Arguments Object Leaks",
                "code": "// Anti-pattern that prevents JIT optimization:\nfunction badWrapper() {\n  return [].slice.call(arguments); // Leaking arguments prevents optimization!\n}\n\n// Modern optimized alternative:\nfunction goodWrapper(...args) {\n  return args; // Fully optimized by TurboFan!\n}",
                "explanation": "Passing the `arguments` object outside a function prevents V8 from allocating arguments on registers."
            }
        ],
        "explanation": "Occasional de-optimizations are harmless, but 'de-optimization loops' (where a function continually optimizes and de-optimizes) severely degrade application throughput.",
        "useCases": [
            "**Performance Benchmarking**: Diagnosing CPU spikes in high-throughput Node.js microservices.",
            "**Type Consistency**: Writing type-consistent code or using TypeScript to protect JIT assumptions.",
            "**Eliminating Bailouts**: Avoiding unsupported patterns inside hot loops."
        ],
        "memoryModel": "During bailout, the engine reconstructs the interpreter's virtual register state and call stack frames from the optimized machine code stack frame using a Deopt Exit Table.",
        "visualizationType": "internal"
    },
    "object-sandboxing": {
        "definition": "Object Sandboxing and Hardening is the practice of restricting the runtime execution environment of untrusted code, disabling access to sensitive globals (`window`, `process`, `fetch`), and locking down standard prototypes against tampering.",
        "syntax": "// Locking the global prototype against pollution:\nObject.freeze(Object.prototype);\nObject.freeze(Array.prototype);\nObject.freeze(Function.prototype);",
        "examples": [
            {
                "title": "Lightweight Function Sandbox Pitfall",
                "code": "// ⚠️ Insecure naive sandbox:\nfunction naiveRun(untrustedCode) {\n  const sandbox = { Math, count: 0 };\n  const fn = new Function(...Object.keys(sandbox), untrustedCode);\n  fn(...Object.values(sandbox));\n}\n\n// Attack vector: Escaping via constructor!\n// naiveRun(\"this.constructor.constructor('return process')().exit()\");",
                "explanation": "`new Function()` and `eval()` can easily escape naive sandboxes by reaching the root Function constructor."
            },
            {
                "title": "Defensive Programming with Object.freeze",
                "code": "const config = Object.freeze({\n  apiKey: \"SECRET_KEY_123\",\n  endpoints: Object.freeze({\n    auth: \"https://auth.example.com\"\n  })\n});\n\n// Any attempt to modify throws or fails:\n// config.apiKey = \"TAMPERED\";",
                "explanation": "Deeply freezing objects guarantees that shared configuration data cannot be modified by malicious dependencies."
            }
        ],
        "explanation": "True JavaScript sandboxing in browsers requires isolated `<iframe>` environments with `sandbox` attributes, or modern standard proposals like the ShadowRealm API.",
        "useCases": [
            "**Plugin Systems**: Running untrusted user scripts or plugins inside SaaS platforms (Figma, Notion).",
            "**Security Hardening**: Defending mission-critical web apps against prototype tampering from compromised npm packages.",
            "**Online Code Editors**: Safely running student or user code in interactive playgrounds."
        ],
        "memoryModel": "Deep object hardening marks prototype descriptors non-writable in the engine Map, aborting write instructions before modifying heap memory words.",
        "visualizationType": "internal"
    },
    "weak-references": {
        "definition": "`WeakRef` and `FinalizationRegistry` (ES2021) allow developers to hold weak references to objects without preventing their garbage collection, and to register cleanup callbacks that fire after the target object has been collected.",
        "syntax": "let target = { data: \"large\" };\nconst ref = new WeakRef(target);\n\n// Dereference: returns target, or undefined if collected\nconst obj = ref.deref();\n\n// Cleanup registry\nconst registry = new FinalizationRegistry(heldValue => {\n  console.log(\"Collected object metadata:\", heldValue);\n});\nregistry.register(target, \"User #42\");",
        "examples": [
            {
                "title": "Memory-Conscious Image Cache",
                "code": "class ImageCache {\n  constructor() {\n    this.cache = new Map();\n  }\n\n  get(url) {\n    const ref = this.cache.get(url);\n    if (ref) {\n      const img = ref.deref();\n      if (img) return img; // Cache hit!\n    }\n    // Cache miss or collected: reload\n    return null;\n  }\n\n  set(url, img) {\n    this.cache.set(url, new WeakRef(img));\n  }\n}",
                "explanation": "The cache provides fast lookups for in-memory images, but allows the GC to reclaim image buffers when system memory runs low."
            },
            {
                "title": "Cleaning Up External Resources with FinalizationRegistry",
                "code": "const registry = new FinalizationRegistry(fileHandle => {\n  console.log(`Closing dangling file handle: ${fileHandle}`);\n});\n\nfunction openSession(id) {\n  const session = { id };\n  registry.register(session, `handle-${id}`);\n  return session;\n}\n\nlet activeSession = openSession(101);\nactiveSession = null; // When GC runs, the registry callback will close the handle!",
                "explanation": "FinalizationRegistry provides a native destructor-like hook for cleaning up native C++ resources, WebGL textures, or file handles."
            }
        ],
        "explanation": "Avoid relying on `WeakRef` for critical application architecture. Garbage collection timing is non-deterministic and varies dramatically between engines and battery states.",
        "useCases": [
            "**Large Media Caching**: Caching decoded audio or canvas graphics without risking out-of-memory crashes.",
            "**Native Resource Destructors**: Releasing WebAssembly or WebGL memory buffers when JS wrappers are swept.",
            "**Observability & Profiling**: Tracking object lifecycles in memory diagnostic tools."
        ],
        "memoryModel": "A `WeakRef` object holds a raw pointer to the target without marking it as a strong root. During GC marking, if only weak references remain, the target is swept and `.deref()` is cleared to `undefined`.",
        "visualizationType": "variables"
    },
    "js-anti-patterns": {
        "definition": "JavaScript anti-patterns are coding habits that appear convenient but cause severe performance degradations, memory leaks, subtle coercion bugs, or JIT compiler de-optimizations.",
        "syntax": "// Anti-Patterns to Avoid:\n// 1. Modifying the prototype of built-ins (Array.prototype.myFunc = ...)\n// 2. Using 'delete' operator on hot objects\n// 3. Using eval() or Function() constructor\n// 4. Mixing types in arrays or properties\n// 5. Relying on implicit global variables",
        "examples": [
            {
                "title": "Anti-Pattern: The 'delete' Operator in Hot Paths",
                "code": "const point = { x: 10, y: 20 };\n\n// ❌ SLOW: Forces object into dictionary mode!\ndelete point.x;\n\n// ✅ FAST: Assign null or undefined, preserving Hidden Class\npoint.x = null;",
                "explanation": "`delete` forces V8 to throw away the object's optimized Hidden Class, slowing down future property reads."
            },
            {
                "title": "Anti-Pattern: Modifying Array.prototype (Monkey Patching)",
                "code": "// ❌ DANGEROUS: Monkey patching standard prototypes\n// Array.prototype.last = function() { return this[this.length - 1]; };\n\n// Problems:\n// 1. Conflicts with future ECMAScript additions (e.g. SmooshGate).\n// 2. Pollutes for...in loops across all libraries in your app.\n\n// ✅ CORRECT: Use standalone helper functions:\nconst last = (arr) => arr[arr.length - 1];",
                "explanation": "Extending built-in prototypes causes compatibility issues and security vulnerabilities across shared libraries."
            }
        ],
        "explanation": "Modern development environments leverage strict ESLint rules, TypeScript, and modern ECMAScript idioms to catch anti-patterns during development rather than in production.",
        "useCases": [
            "**Code Quality Audits**: Reviewing pull requests and legacy codebases for hidden performance bottlenecks.",
            "**Framework Design**: Ensuring libraries do not pollute global prototypes or degrade user code performance.",
            "**High-Throughput Services**: Optimizing backend microservices for maximum requests per second."
        ],
        "memoryModel": "Anti-patterns like `delete` mutate the internal Map transition tree of V8 objects from linear offset structures into expensive sparse hash tables (`NameDictionary`).",
        "visualizationType": "internal"
    }
};

export default additionalTopics;
