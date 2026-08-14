export type ConceptSection = {
  title: string;
  explanation: string;
  code?: string;
  visualHint?: string;
};

export type ConceptQuiz = {
  id: number;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
};

export type FullConcept = {
  slug: string;
  title: string;
  levelId: string;
  levelBadge: string;
  category: string;
  summary: string;
  bullets: string[];
  sections: ConceptSection[];
  quizzes: ConceptQuiz[];
};

export const allConcepts: FullConcept[] = [
  {
    "slug": "introduction-to-go",
    "title": "Introduction to Go",
    "levelId": "L0",
    "levelBadge": "🟢 Level 0 — Absolute Basics",
    "category": "Foundation",
    "summary": "Why Go exists, what problems it solves, and how its modern toolchain is organized.",
    "bullets": [
      "Created at Google in 2009 by Robert Griesemer, Rob Pike, and Ken Thompson to solve software engineering at scale.",
      "Core philosophy: simplicity, fast compilation, built-in concurrency, and robust garbage collection.",
      "Produces single, statically-linked standalone binaries with no virtual machine or external runtime dependencies."
    ],
    "sections": [
      {
        "title": "The Purpose of Go",
        "explanation": "Go was designed to combat the growing complexity of massive codebases in C++ and Java. It eliminates inheritance hierarchies, complex template metaprogramming, and manual memory management in favor of composition, explicit error handling, and high-performance concurrency primitives built directly into the language runtime.",
        "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, Go! Simple, fast, and concurrent.\")\n}",
        "visualHint": "Go compiles directly into native machine code (ELF/Mach-O/PE) with zero external runtime dependencies."
      },
      {
        "title": "Toolchain & Workspace Evolution",
        "explanation": "In early Go versions, all code had to live inside a single $GOPATH workspace directory. Since Go 1.11, Go Modules (go.mod) provide standardized dependency management, allowing repositories to live in any directory with reproducible cryptographic checksums (go.sum).",
        "code": "$ go version\ngo version go1.24.0 linux/amd64\n\n$ go mod init myproject\ngo: creating new go.mod: module myproject"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the output of a standard Go build command?",
        "choices": [
          "A JAR file running on a JVM",
          "A standalone, statically-linked native binary",
          "Interpreted bytecode executed by an interpreter",
          "A bundle of source files with node_modules"
        ],
        "answer": 1,
        "explanation": "Go compiles directly into a standalone static binary containing your code and the Go runtime."
      },
      {
        "id": 2,
        "question": "Which file defines a Go project and its external dependencies?",
        "choices": [
          "package.json",
          "Cargo.toml",
          "go.mod",
          "Gopkg.lock"
        ],
        "answer": 2,
        "explanation": "go.mod is the standard module definition file in Go."
      }
    ]
  },
  {
    "slug": "installation-and-setup",
    "title": "Installation & Setup",
    "levelId": "L0",
    "levelBadge": "🟢 Level 0 — Absolute Basics",
    "category": "Foundation",
    "summary": "Setting up the Go compiler toolchain, verifying environment variables, and configuring modern IDEs.",
    "bullets": [
      "Download and install the official Go distribution from go.dev.",
      "Verify installation with go version and inspect runtime configuration via go env.",
      "Configure VS Code (with official Go extension) or GoLand for gopls language server support."
    ],
    "sections": [
      {
        "title": "Installing the Toolchain",
        "explanation": "Installing Go gives you the full toolchain: compiler (go build), package manager (go get/go mod), test runner (go test), formatter (go fmt), and static analyzer (go vet).",
        "code": "# Check your Go version\ngo version\n\n# Inspect environment variables\ngo env GOROOT GOPATH GOOS GOARCH"
      },
      {
        "title": "Language Server: gopls",
        "explanation": "Go provides the official language server gopls (pronounced \"Go please\"), which delivers real-time type checking, intelligent autocompletion, instant jump-to-definition, and automatic imports directly in your editor.",
        "code": "// .vscode/settings.json\n{\n  \"go.useLanguageServer\": true,\n  \"go.lintOnSave\": \"package\",\n  \"editor.formatOnSave\": true\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is GOROOT in Go?",
        "choices": [
          "The directory where your application source code lives",
          "The root directory of your Go toolchain and standard library installation",
          "A cache folder for third-party modules",
          "The global system temp directory"
        ],
        "answer": 1,
        "explanation": "GOROOT points to the installation directory of the Go SDK and standard library."
      }
    ]
  },
  {
    "slug": "hello-world",
    "title": "Hello World",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Deconstructing the smallest complete Go program: packages, imports, and the main entrypoint.",
    "bullets": [
      "package main declares an executable program rather than a shared library.",
      "import \"fmt\" brings in the standard formatted I/O package.",
      "func main() is the entrypoint executed by the Go runtime."
    ],
    "sections": [
      {
        "title": "Anatomy of main.go",
        "explanation": "Every executable Go binary starts with package main and must contain exactly one main() function. The fmt package provides I/O functions with C-like formatting verbs.",
        "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"Hello, World!\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Which package name is required for an executable Go program?",
        "choices": [
          "package app",
          "package main",
          "package root",
          "package executable"
        ],
        "answer": 1,
        "explanation": "Executables must always use package main; other package names create reusable libraries."
      }
    ]
  },
  {
    "slug": "basic-syntax",
    "title": "Basic Syntax",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Rules of Go syntax: semicolons, naming conventions, export rules, and package structure.",
    "bullets": [
      "Capitalization governs visibility: UpperCase is exported (public), lowerCase is unexported (package-private).",
      "Semicolons are automatically inserted by the compiler lexer at line ends.",
      "Naming style is MixedCaps/camelCase without underscores."
    ],
    "sections": [
      {
        "title": "Export Rules (Visibility)",
        "explanation": "Go has no public or private keywords. Instead, if an identifier begins with a capital letter, it is exported and accessible outside its package. If it begins with a lowercase letter, it is unexported.",
        "code": "package mathutil\n\n// Exported: accessible by other packages\nconst Pi = 3.14159\n\n// Unexported: only accessible within mathutil\nfunc calculateRadius(area float64) float64 {\n    return 0.0\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "How do you make a struct field or function exported (public) in Go?",
        "choices": [
          "Add public keyword",
          "Start its name with a capital letter",
          "Add an @export decorator",
          "Declare it in public.go"
        ],
        "answer": 1,
        "explanation": "Capitalizing the first letter exports the identifier to other packages."
      }
    ]
  },
  {
    "slug": "variables",
    "title": "Variables",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Declaring, initializing, and scoping variables with var and short declaration (:=).",
    "bullets": [
      "var name type declares variables with automatic zero-value initialization (no uninitialized garbage memory).",
      "Short declaration name := value infers the type inside function bodies.",
      "Go strictly forbids unused local variables to prevent dead code and memory leaks."
    ],
    "sections": [
      {
        "title": "Declarations and Zero Values",
        "explanation": "Variables in Go are always initialized to their zero value if no explicit initial value is provided: 0 for numbers, \"\" for strings, false for booleans, and nil for pointers, slices, maps, channels, and interfaces.",
        "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var count int       // initialized to 0\n    var message string  // initialized to \"\"\n    var active bool     // initialized to false\n\n    // Short declaration with type inference:\n    name := \"Gopher\"    // inferred as string\n    \n    fmt.Println(count, message, active, name)\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the zero value of an uninitialized string variable in Go?",
        "choices": [
          "null",
          "undefined",
          "\"\" (empty string)",
          "nil"
        ],
        "answer": 2,
        "explanation": "The zero value for strings is \"\" (empty string)."
      }
    ]
  },
  {
    "slug": "basic-types",
    "title": "Basic Types",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Primitives in Go: signed/unsigned integers, floats, booleans, strings, and UTF-8 runes.",
    "bullets": [
      "Integers: int, int8, int16, int32, int64 and unsigned equivalents (uint, uint8/byte, uintptr).",
      "Floating point: float32, float64 and complex numbers (complex64, complex128).",
      "rune is an alias for int32, representing a single UTF-8 Unicode code point.",
      "Strings are immutable byte slices under the hood."
    ],
    "sections": [
      {
        "title": "Strings, Bytes, and Runes",
        "explanation": "In Go, strings are read-only byte slices containing UTF-8 encoded text. When iterating over a string with range, Go decodes UTF-8 runes (code points) rather than raw bytes.",
        "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    s := \"Hello, 世界\"\n    fmt.Printf(\"Byte length: %d\\n\", len(s)) // 13 bytes\n\n    for i, r := range s {\n        fmt.Printf(\"%d: %c (rune %U)\\n\", i, r, r)\n    }\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a rune in Go?",
        "choices": [
          "An alias for int32 representing a Unicode code point",
          "An 8-bit ASCII character",
          "A mutable string",
          "A memory pointer"
        ],
        "answer": 0,
        "explanation": "A rune is an alias for int32 and represents a single Unicode code point."
      }
    ]
  },
  {
    "slug": "constants",
    "title": "Constants",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Compile-time constants, untyped literals, arbitrary precision, and the iota enumerator.",
    "bullets": [
      "Declared with const and evaluated strictly at compile-time.",
      "Untyped constants possess arbitrary mathematical precision until assigned to typed variables.",
      "iota is an auto-incrementing integer index inside const blocks."
    ],
    "sections": [
      {
        "title": "The iota Enumerator",
        "explanation": "iota simplifies sequential constant definitions and bitmask flags by incrementing for each item in a const block.",
        "code": "package main\n\nimport \"fmt\"\n\nconst (\n    _  = 1 << (10 * iota) // ignore first value\n    KB                    // 1024\n    MB                    // 1048576\n    GB                    // 1073741824\n)\n\nfunc main() {\n    fmt.Printf(\"1 GB = %d bytes\\n\", GB)\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "When is the value of a Go const computed?",
        "choices": [
          "At runtime on program startup",
          "At compile-time",
          "When the constant is first accessed",
          "During garbage collection"
        ],
        "answer": 1,
        "explanation": "Constants in Go are strictly compile-time expressions."
      }
    ]
  },
  {
    "slug": "conditionals",
    "title": "Conditionals",
    "levelId": "L2",
    "levelBadge": "🟠 Level 2 — Flow Control",
    "category": "Flow Control",
    "summary": "Branching logic using if, else, and the idiomatic short-statement initializer.",
    "bullets": [
      "No parentheses required around conditional expressions.",
      "Scoped initializers: if err := doWork(); err != nil binds variables strictly to the if/else blocks.",
      "Early returns and guard clauses keep the main logic unnested (avoiding the arrow anti-pattern)."
    ],
    "sections": [
      {
        "title": "Short Statement Initialization",
        "explanation": "Go allows executing a simple statement before evaluating the condition. Variables declared in this statement are only available inside the if and else blocks.",
        "code": "if user, err := getUser(id); err != nil {\n    return fmt.Errorf(\"user lookup failed: %w\", err)\n} else {\n    fmt.Println(\"Found user:\", user.Name)\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Where is a variable declared in an if statement initializer accessible?",
        "choices": [
          "Throughout the entire function",
          "Only within the if and associated else blocks",
          "Globally across the package",
          "Inside the if block only"
        ],
        "answer": 1,
        "explanation": "Variables initialized in an if header are scoped to that if block and any attached else/else if blocks."
      }
    ]
  },
  {
    "slug": "switch",
    "title": "Switch",
    "levelId": "L2",
    "levelBadge": "🟠 Level 2 — Flow Control",
    "category": "Flow Control",
    "summary": "Clean multi-way branching without automatic fallthrough and type-based dispatch.",
    "bullets": [
      "Cases break automatically; fallthrough must be explicitly requested.",
      "Conditionless switches switch { ... } act as a cleaner alternative to chained if-else blocks.",
      "Type switches switch v := i.(type) inspect dynamic types of interface values safely."
    ],
    "sections": [
      {
        "title": "Expression & Type Switches",
        "explanation": "Switch cases can match multiple values separated by commas. Type switches allow branching on the underlying concrete type of an interface.",
        "code": "// Tagless switch (cleaner if-else)\nswitch {\ncase score >= 90:\n    fmt.Println(\"Grade: A\")\ncase score >= 80:\n    fmt.Println(\"Grade: B\")\ndefault:\n    fmt.Println(\"Grade: C\")\n}\n\n// Type switch\nfunc describe(i any) {\n    switch v := i.(type) {\n    case int:\n        fmt.Println(\"Integer:\", v)\n    case string:\n        fmt.Println(\"String of length:\", len(v))\n    }\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Do Go switch cases automatically fall through to the next case?",
        "choices": [
          "Yes, like C and Java",
          "No, they break automatically unless fallthrough is specified",
          "Only if the case is empty",
          "Only in type switches"
        ],
        "answer": 1,
        "explanation": "In Go, switch cases do not fall through by default."
      }
    ]
  },
  {
    "slug": "loops",
    "title": "Loops",
    "levelId": "L2",
    "levelBadge": "🟠 Level 2 — Flow Control",
    "category": "Flow Control",
    "summary": "The single loop construct in Go: standard three-component for, while-style, infinite loops, and range iteration.",
    "bullets": [
      "for is the only looping keyword in Go (no while or do-while).",
      "for i := 0; i < N; i++ for index-based counting.",
      "for range seamlessly iterates over slices, arrays, maps, strings, and channels.",
      "In Go 1.22+, loop variables are per-iteration scoped, eliminating common closure capture bugs."
    ],
    "sections": [
      {
        "title": "The Many Forms of for",
        "explanation": "Go consolidates all loop varieties into for: standard 3-part loop, condition-only loop (while), infinite loop, and range iteration.",
        "code": "// 1. Standard\nfor i := 0; i < 3; i++ { fmt.Println(i) }\n\n// 2. While equivalent\nfor condition { process() }\n\n// 3. Infinite loop\nfor {\n    if done() { break }\n}\n\n// 4. Range over slice\nnums := []int{10, 20, 30}\nfor index, value := range nums {\n    fmt.Printf(\"nums[%d] = %d\\n\", index, value)\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "How many different looping keywords does Go have?",
        "choices": [
          "3 (for, while, do)",
          "2 (for, while)",
          "1 (for)",
          "4 (for, foreach, while, loop)"
        ],
        "answer": 2,
        "explanation": "Go only has one looping keyword: for."
      }
    ]
  },
  {
    "slug": "error-handling",
    "title": "Error Handling",
    "levelId": "L2",
    "levelBadge": "🟠 Level 2 — Flow Control",
    "category": "Flow Control",
    "summary": "Explicit error returns, error wrapping with %w, and inspection using errors.Is and errors.As.",
    "bullets": [
      "Errors are normal values implementing the error interface with Error() string.",
      "Functions return errors as their final return value (val, err := doSomething()).",
      "fmt.Errorf(\"context: %w\", err) wraps errors to maintain an inspectable chain.",
      "errors.Is checks for sentinel errors, errors.As casts to specific error types."
    ],
    "sections": [
      {
        "title": "Idiomatic Error Inspection",
        "explanation": "Go favors explicit error checks (if err != nil) over invisible exception bubbling. Wrapped errors preserve stack context while enabling programmatic checks.",
        "code": "var ErrNotFound = errors.New(\"resource not found\")\n\nfunc fetch(id string) error {\n    return fmt.Errorf(\"fetch %s failed: %w\", id, ErrNotFound)\n}\n\nfunc main() {\n    err := fetch(\"usr_123\")\n    if errors.Is(err, ErrNotFound) {\n        fmt.Println(\"Handled missing resource gracefully!\")\n    }\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Which verb in fmt.Errorf wraps an error for inspection with errors.Is?",
        "choices": [
          "%v",
          "%s",
          "%w",
          "%e"
        ],
        "answer": 2,
        "explanation": "%w wraps the error inside a wrapper error type."
      }
    ]
  },
  {
    "slug": "functions",
    "title": "Functions",
    "levelId": "L3",
    "levelBadge": "🔵 Level 3 — Functions",
    "category": "Functions",
    "summary": "Function declarations, multiple return values, named returns, and variadic arguments.",
    "bullets": [
      "First-class citizens: functions can be stored in variables, passed as arguments, and returned from functions.",
      "Multiple returns eliminate the need for out-parameters or tuple container wrappers.",
      "Variadic parameters func sum(nums ...int) accept arbitrary argument counts."
    ],
    "sections": [
      {
        "title": "Multiple Returns & Variadics",
        "explanation": "Multiple return values are fundamental to Go, enabling concurrent returns of computational results and error states.",
        "code": "func divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New(\"division by zero\")\n    }\n    return a / b, nil\n}\n\nfunc sum(nums ...int) int {\n    total := 0\n    for _, n := range nums { total += n }\n    return total\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "How do you define a variadic parameter in Go?",
        "choices": [
          "params []int",
          "...int",
          "*int[]",
          "args int..."
        ],
        "answer": 1,
        "explanation": "The ...T syntax defines a variadic parameter that receives arguments as a slice."
      }
    ]
  },
  {
    "slug": "anonymous-and-closures",
    "title": "Anonymous & Closures",
    "levelId": "L3",
    "levelBadge": "🔵 Level 3 — Functions",
    "category": "Functions",
    "summary": "Higher-order functions, function literals, and closures capturing surrounding lexical scope.",
    "bullets": [
      "Function literals func() { ... } can be declared inline.",
      "Closures capture and retain references to variables declared in their enclosing lexical environment.",
      "Useful for factory functions, middleware chains, and concurrent goroutine handlers."
    ],
    "sections": [
      {
        "title": "Stateful Closures",
        "explanation": "A closure references variables from outside its body. The function may access and assign to the referenced variables.",
        "code": "func counter() func() int {\n    count := 0\n    return func() int {\n        count++\n        return count\n    }\n}\n\nfunc main() {\n    next := counter()\n    fmt.Println(next()) // 1\n    fmt.Println(next()) // 2\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What happens to a variable captured by a closure when the outer function returns?",
        "choices": [
          "It is immediately freed from memory",
          "It escapes to the heap and remains alive as long as the closure is reachable",
          "It causes a memory segmentation fault",
          "It resets to its zero value"
        ],
        "answer": 1,
        "explanation": "Escape analysis moves captured variables to the heap so the closure can safely access them."
      }
    ]
  },
  {
    "slug": "defer-panic-recover",
    "title": "Defer / Panic / Recover",
    "levelId": "L3",
    "levelBadge": "🔵 Level 3 — Functions",
    "category": "Functions",
    "summary": "Cleanup guarantees with defer (LIFO), abnormal panics, and recovering safely inside deferred frames.",
    "bullets": [
      "defer schedules a function call to run immediately before the enclosing function returns.",
      "Multiple defer statements execute in Last-In, First-Out (LIFO) stack order.",
      "Arguments to deferred functions are evaluated immediately when defer is called.",
      "recover() intercepts an active panic to prevent process termination."
    ],
    "sections": [
      {
        "title": "Safe Resource Cleanup & Panic Recovery",
        "explanation": "defer guarantees resource release (e.g. file closing, mutex unlocking) even if errors or panics occur.",
        "code": "func safeOperation() {\n    defer func() {\n        if r := recover(); r != nil {\n            fmt.Println(\"Recovered from panic:\", r)\n        }\n    }()\n\n    file, _ := os.Open(\"data.txt\")\n    defer file.Close() // Guaranteed to close on return\n\n    panic(\"unexpected critical failure\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "In what order do multiple deferred calls execute?",
        "choices": [
          "First-In, First-Out (FIFO)",
          "Last-In, First-Out (LIFO / Stack order)",
          "Random order",
          "Parallel execution"
        ],
        "answer": 1,
        "explanation": "Deferred function calls execute in reverse (LIFO) order."
      }
    ]
  },
  {
    "slug": "arrays",
    "title": "Arrays",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Fixed-length homogeneous sequential memory blocks with value-copy semantics.",
    "bullets": [
      "Array length is part of its static type ([4]int is distinct from [5]int).",
      "Arrays have value semantics: assigning or passing an array copies the entire data block.",
      "Underlies the dynamic slice abstraction in Go."
    ],
    "sections": [
      {
        "title": "Value Semantics of Arrays",
        "explanation": "Because arrays are values, passing a large array to a function copies every element onto the stack frame.",
        "code": "var a [3]int = [3]int{1, 2, 3}\nb := a // copies all 3 integers into b\nb[0] = 99\n\nfmt.Println(a[0]) // 1 (original unmodified)\nfmt.Println(b[0]) // 99"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Are [3]int and [4]int the same type in Go?",
        "choices": [
          "Yes, both are integer arrays",
          "No, array length is part of the type signature",
          "Yes, during compilation",
          "Only when passed as pointers"
        ],
        "answer": 1,
        "explanation": "In Go, the array length is part of its type."
      }
    ]
  },
  {
    "slug": "slices",
    "title": "Slices",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Dynamically-sized views into backing arrays: length, capacity, slicing, and growth strategy.",
    "bullets": [
      "A slice is a 24-byte header (on 64-bit): Data pointer (*array), Length (int), and Capacity (int).",
      "make([]T, len, cap) preallocates backing array memory to minimize reallocations.",
      "append() doubles capacity when small and transitions to a ~1.25x growth rate when large."
    ],
    "sections": [
      {
        "title": "The Slice Header & Growth",
        "explanation": "Slices do not store elements directly; they point to a contiguous segment of an underlying array.",
        "code": "// Slice header: [Pointer | Len: 2 | Cap: 5]\ns := make([]int, 2, 5)\ns[0] = 10\ns[1] = 20\n\n// Append appends in-place as long as len < cap\ns = append(s, 30) // Len becomes 3, Cap remains 5"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What three fields comprise a slice header in Go?",
        "choices": [
          "Pointer to backing array, Length, Capacity",
          "Hash, Keys, Values",
          "Start index, End index, Size",
          "Buffer, Mutex, Head"
        ],
        "answer": 0,
        "explanation": "A slice header consists of a pointer to the backing array, length, and capacity."
      }
    ]
  },
  {
    "slug": "maps",
    "title": "Maps",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Hash table implementation in Go: key-value storage, buckets, comma-ok lookups, and iteration.",
    "bullets": [
      "Key types must be comparable (implement == and !=).",
      "Lookup with comma-ok idiom: val, ok := m[key] distinguishes missing keys from zero-values.",
      "Map iteration order is randomized by design to prevent reliance on hash bucket order.",
      "Writing to a nil map triggers a runtime panic; initialize with make(map[K]V)."
    ],
    "sections": [
      {
        "title": "Safe Map Access & Modification",
        "explanation": "Maps are reference pointers to an hmap header. Accessing a missing key returns the value type zero-value.",
        "code": "counts := make(map[string]int)\ncounts[\"go\"] = 42\n\n// Check existence with comma-ok\nif val, exists := counts[\"rust\"]; exists {\n    fmt.Println(val)\n} else {\n    fmt.Println(\"Key does not exist\")\n}\n\ndelete(counts, \"go\")"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What happens when writing to a nil map in Go?",
        "choices": [
          "It automatically initializes the map",
          "It fails silently",
          "It panics at runtime",
          "It returns false"
        ],
        "answer": 2,
        "explanation": "Writing to a nil map causes a runtime panic."
      }
    ]
  },
  {
    "slug": "structs",
    "title": "Structs",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Typed collections of fields, composition via struct embedding, and metadata struct tags.",
    "bullets": [
      "Primary way to define custom data models in Go.",
      "Composition over inheritance: embedded structs promote fields and methods directly.",
      "Struct tags (e.g. `json:\"name,omitempty\"`) supply reflection metadata for serialization."
    ],
    "sections": [
      {
        "title": "Embedding & Tags",
        "explanation": "Go uses struct embedding for composition. Embedded fields are promoted to the outer struct.",
        "code": "type BaseUser struct {\n    ID   string `json:\"id\"`\n    Role string `json:\"role\"`\n}\n\ntype AdminUser struct {\n    BaseUser // Embedded struct (composition)\n    Permissions []string `json:\"permissions\"`\n}\n\nfunc main() {\n    admin := AdminUser{\n        BaseUser: BaseUser{ID: \"adm_1\", Role: \"superadmin\"},\n        Permissions: []string{\"write\", \"delete\"},\n    }\n    // Promoted field access:\n    fmt.Println(admin.ID, admin.Role)\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "How does Go achieve polymorphism and code reuse instead of class inheritance?",
        "choices": [
          "Class inheritance with extends",
          "Struct embedding and interface implementation",
          "Multiple inheritance",
          "Abstract base classes"
        ],
        "answer": 1,
        "explanation": "Go uses struct composition (embedding) and implicit interface implementation."
      }
    ]
  },
  {
    "slug": "pointers",
    "title": "Pointers",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Direct memory addresses without pointer arithmetic: referencing (&) and dereferencing (*).",
    "bullets": [
      "&x produces the memory address of x.",
      "*p accesses or mutates the value stored at address p.",
      "Go has no pointer arithmetic in safe code (p++ is invalid).",
      "Passing pointers avoids copying large structs and allows mutating state."
    ],
    "sections": [
      {
        "title": "Pointers & Mutation",
        "explanation": "Pointers allow functions to mutate the caller variable state without copying entire structs.",
        "code": "type Counter struct {\n    Value int\n}\n\nfunc increment(c *Counter) {\n    c.Value++ // Automatically dereferences pointer\n}\n\nfunc main() {\n    c := &Counter{Value: 0}\n    increment(c)\n    fmt.Println(c.Value) // 1\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Is pointer arithmetic (like ptr++) allowed in standard safe Go?",
        "choices": [
          "Yes, just like C/C++",
          "No, pointer arithmetic is not permitted in safe Go",
          "Only inside for loops",
          "Only on integer pointers"
        ],
        "answer": 1,
        "explanation": "Safe Go prohibits pointer arithmetic to ensure memory safety."
      }
    ]
  },
  {
    "slug": "methods",
    "title": "Methods",
    "levelId": "L5",
    "levelBadge": "🔴 Level 5 — Methods & Interfaces",
    "category": "Methods & Interfaces",
    "summary": "Attaching functions to types using value and pointer receivers.",
    "bullets": [
      "Pointer receiver (*T) can mutate and avoids copies",
      "Value receiver (T) receives a read-only copy",
      "Methods can be declared on any user-defined type"
    ],
    "sections": [
      {
        "title": "Understanding Methods",
        "explanation": "Attaching functions to types using value and pointer receivers. In production Go engineering, mastering methods is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Methods\nfunc main() {\n    fmt.Println(\"Exploring Methods in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Methods in Go?",
        "choices": [
          "Pointer receiver (*T) can mutate and avoids copies",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Pointer receiver (*T) can mutate and avoids copies"
      }
    ]
  },
  {
    "slug": "interfaces",
    "title": "Interfaces",
    "levelId": "L5",
    "levelBadge": "🔴 Level 5 — Methods & Interfaces",
    "category": "Methods & Interfaces",
    "summary": "Implicit interface contracts (duck typing) and internal itab representation.",
    "bullets": [
      "Types implement interfaces implicitly",
      "Composed of type metadata pointer and value pointer",
      "any (interface{}) accepts all types"
    ],
    "sections": [
      {
        "title": "Understanding Interfaces",
        "explanation": "Implicit interface contracts (duck typing) and internal itab representation. In production Go engineering, mastering interfaces is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Interfaces\nfunc main() {\n    fmt.Println(\"Exploring Interfaces in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Interfaces in Go?",
        "choices": [
          "Types implement interfaces implicitly",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Types implement interfaces implicitly"
      }
    ]
  },
  {
    "slug": "embedding-interfaces",
    "title": "Embedding Interfaces",
    "levelId": "L5",
    "levelBadge": "🔴 Level 5 — Methods & Interfaces",
    "category": "Methods & Interfaces",
    "summary": "Composing larger interfaces by combining smaller interfaces.",
    "bullets": [
      "io.ReadWriter embeds io.Reader and io.Writer",
      "Enforces small, single-method interface design (e.g. Reader, Writer, Stringer)"
    ],
    "sections": [
      {
        "title": "Understanding Embedding Interfaces",
        "explanation": "Composing larger interfaces by combining smaller interfaces. In production Go engineering, mastering embedding interfaces is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Embedding Interfaces\nfunc main() {\n    fmt.Println(\"Exploring Embedding Interfaces in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Embedding Interfaces in Go?",
        "choices": [
          "io.ReadWriter embeds io.Reader and io.Writer",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "io.ReadWriter embeds io.Reader and io.Writer"
      }
    ]
  },
  {
    "slug": "polymorphism",
    "title": "Polymorphism",
    "levelId": "L5",
    "levelBadge": "🔴 Level 5 — Methods & Interfaces",
    "category": "Methods & Interfaces",
    "summary": "Runtime polymorphism via interface abstraction without inheritance.",
    "bullets": [
      "Decouples callers from concrete implementations",
      "Enables straightforward dependency mocking in tests"
    ],
    "sections": [
      {
        "title": "Understanding Polymorphism",
        "explanation": "Runtime polymorphism via interface abstraction without inheritance. In production Go engineering, mastering polymorphism is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Polymorphism\nfunc main() {\n    fmt.Println(\"Exploring Polymorphism in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Polymorphism in Go?",
        "choices": [
          "Decouples callers from concrete implementations",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Decouples callers from concrete implementations"
      }
    ]
  },
  {
    "slug": "stack-vs-heap",
    "title": "Stack vs Heap",
    "levelId": "L6",
    "levelBadge": "⚫ Level 6 — Memory Model",
    "category": "Memory Model",
    "summary": "Compiler escape analysis deciding where variable allocations live.",
    "bullets": [
      "Stack memory is fast and reclaimed on function return",
      "Heap allocations are managed by the garbage collector",
      "go build -gcflags=\"-m\" displays escape analysis decisions"
    ],
    "sections": [
      {
        "title": "Understanding Stack vs Heap",
        "explanation": "Compiler escape analysis deciding where variable allocations live. In production Go engineering, mastering stack vs heap is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Stack vs Heap\nfunc main() {\n    fmt.Println(\"Exploring Stack vs Heap in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Stack vs Heap in Go?",
        "choices": [
          "Stack memory is fast and reclaimed on function return",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Stack memory is fast and reclaimed on function return"
      }
    ]
  },
  {
    "slug": "garbage-collector",
    "title": "Garbage Collector",
    "levelId": "L6",
    "levelBadge": "⚫ Level 6 — Memory Model",
    "category": "Memory Model",
    "summary": "Concurrent tri-color mark-and-sweep GC and latency minimization.",
    "bullets": [
      "Runs concurrently with user goroutines",
      "STW (Stop-The-World) pauses are sub-millisecond",
      "Tuned via GOGC environment variable"
    ],
    "sections": [
      {
        "title": "Understanding Garbage Collector",
        "explanation": "Concurrent tri-color mark-and-sweep GC and latency minimization. In production Go engineering, mastering garbage collector is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Garbage Collector\nfunc main() {\n    fmt.Println(\"Exploring Garbage Collector in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Garbage Collector in Go?",
        "choices": [
          "Runs concurrently with user goroutines",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Runs concurrently with user goroutines"
      }
    ]
  },
  {
    "slug": "alignment-and-padding",
    "title": "Alignment & Padding",
    "levelId": "L6",
    "levelBadge": "⚫ Level 6 — Memory Model",
    "category": "Memory Model",
    "summary": "Memory word alignment and optimizing struct field order.",
    "bullets": [
      "Fields align to their size boundaries",
      "Order fields from largest to smallest to minimize memory padding"
    ],
    "sections": [
      {
        "title": "Understanding Alignment & Padding",
        "explanation": "Memory word alignment and optimizing struct field order. In production Go engineering, mastering alignment & padding is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Alignment & Padding\nfunc main() {\n    fmt.Println(\"Exploring Alignment & Padding in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Alignment & Padding in Go?",
        "choices": [
          "Fields align to their size boundaries",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Fields align to their size boundaries"
      }
    ]
  },
  {
    "slug": "zero-copy",
    "title": "Zero-copy",
    "levelId": "L6",
    "levelBadge": "⚫ Level 6 — Memory Model",
    "category": "Memory Model",
    "summary": "Techniques for zero-allocation data processing in high-performance paths.",
    "bullets": [
      "Slice re-slicing without copying bytes",
      "unsafe.String and unsafe.SliceData for buffer sharing"
    ],
    "sections": [
      {
        "title": "Understanding Zero-copy",
        "explanation": "Techniques for zero-allocation data processing in high-performance paths. In production Go engineering, mastering zero-copy is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Zero-copy\nfunc main() {\n    fmt.Println(\"Exploring Zero-copy in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Zero-copy in Go?",
        "choices": [
          "Slice re-slicing without copying bytes",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Slice re-slicing without copying bytes"
      }
    ]
  },
  {
    "slug": "goroutines",
    "title": "Goroutines",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Lightweight concurrent execution threads managed by the Go runtime.",
    "bullets": [
      "Initial stack size is only 2 KB (grows dynamically)",
      "Millions can run concurrently with negligible memory overhead",
      "go func() starts a goroutine asynchronously"
    ],
    "sections": [
      {
        "title": "Understanding Goroutines",
        "explanation": "Lightweight concurrent execution threads managed by the Go runtime. In production Go engineering, mastering goroutines is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Goroutines\nfunc main() {\n    fmt.Println(\"Exploring Goroutines in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Goroutines in Go?",
        "choices": [
          "Initial stack size is only 2 KB (grows dynamically)",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Initial stack size is only 2 KB (grows dynamically)"
      }
    ]
  },
  {
    "slug": "channels",
    "title": "Channels",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Thread-safe communication pipelines between concurrent goroutines.",
    "bullets": [
      "Unbuffered channels require both sender and receiver to synchronize",
      "Buffered channels hold items up to capacity before blocking",
      "Close channels from the sender side"
    ],
    "sections": [
      {
        "title": "Understanding Channels",
        "explanation": "Thread-safe communication pipelines between concurrent goroutines. In production Go engineering, mastering channels is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Channels\nfunc main() {\n    fmt.Println(\"Exploring Channels in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Channels in Go?",
        "choices": [
          "Unbuffered channels require both sender and receiver to synchronize",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Unbuffered channels require both sender and receiver to synchronize"
      }
    ]
  },
  {
    "slug": "select",
    "title": "Select",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Multiplexing multiple channel operations with non-blocking fallbacks.",
    "bullets": [
      "Blocks until one channel operation can proceed",
      "default case executes immediately if all channels are blocked",
      "Fair pseudo-random selection when multiple cases are ready"
    ],
    "sections": [
      {
        "title": "Understanding Select",
        "explanation": "Multiplexing multiple channel operations with non-blocking fallbacks. In production Go engineering, mastering select is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Select\nfunc main() {\n    fmt.Println(\"Exploring Select in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Select in Go?",
        "choices": [
          "Blocks until one channel operation can proceed",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Blocks until one channel operation can proceed"
      }
    ]
  },
  {
    "slug": "sync-primitives",
    "title": "Sync Primitives",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Low-level synchronization tools in the sync package.",
    "bullets": [
      "sync.Mutex and sync.RWMutex protect critical shared sections",
      "sync.WaitGroup coordinates goroutine completion",
      "sync.Pool reuses allocated objects to reduce GC pressure"
    ],
    "sections": [
      {
        "title": "Understanding Sync Primitives",
        "explanation": "Low-level synchronization tools in the sync package. In production Go engineering, mastering sync primitives is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Sync Primitives\nfunc main() {\n    fmt.Println(\"Exploring Sync Primitives in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Sync Primitives in Go?",
        "choices": [
          "sync.Mutex and sync.RWMutex protect critical shared sections",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "sync.Mutex and sync.RWMutex protect critical shared sections"
      }
    ]
  },
  {
    "slug": "context",
    "title": "Context",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Managing request lifecycles, cancellation signals, and timeouts across API boundaries.",
    "bullets": [
      "context.WithTimeout and context.WithCancel propagate cancellation",
      "Pass ctx as the first parameter of functions performing I/O",
      "Carries request-scoped key/value metadata"
    ],
    "sections": [
      {
        "title": "Understanding Context",
        "explanation": "Managing request lifecycles, cancellation signals, and timeouts across API boundaries. In production Go engineering, mastering context is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Context\nfunc main() {\n    fmt.Println(\"Exploring Context in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Context in Go?",
        "choices": [
          "context.WithTimeout and context.WithCancel propagate cancellation",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "context.WithTimeout and context.WithCancel propagate cancellation"
      }
    ]
  },
  {
    "slug": "scheduler-gmp",
    "title": "Scheduler (GMP)",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "The Go runtime M:N scheduler model: Goroutines, Machines, and Processors.",
    "bullets": [
      "G = Goroutine, M = OS Thread, P = Logical Processor",
      "Work-stealing scheduler balances work queues across cores",
      "Sysmon thread preempts long-running goroutines cooperatively"
    ],
    "sections": [
      {
        "title": "Understanding Scheduler (GMP)",
        "explanation": "The Go runtime M:N scheduler model: Goroutines, Machines, and Processors. In production Go engineering, mastering scheduler (gmp) is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Scheduler (GMP)\nfunc main() {\n    fmt.Println(\"Exploring Scheduler (GMP) in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Scheduler (GMP) in Go?",
        "choices": [
          "G = Goroutine, M = OS Thread, P = Logical Processor",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "G = Goroutine, M = OS Thread, P = Logical Processor"
      }
    ]
  },
  {
    "slug": "generics",
    "title": "Generics",
    "levelId": "L8",
    "levelBadge": "🟩 Level 8 — Advanced Types",
    "category": "Advanced Types",
    "summary": "Type parameters and constraints for reusable type-safe algorithms.",
    "bullets": [
      "func Map[T any, R any](items []T, fn func(T) R) []R",
      "comparable constraint for map keys",
      "~int tilde operator matches underlying types"
    ],
    "sections": [
      {
        "title": "Understanding Generics",
        "explanation": "Type parameters and constraints for reusable type-safe algorithms. In production Go engineering, mastering generics is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Generics\nfunc main() {\n    fmt.Println(\"Exploring Generics in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Generics in Go?",
        "choices": [
          "func Map[T any, R any](items []T, fn func(T) R) []R",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "func Map[T any, R any](items []T, fn func(T) R) []R"
      }
    ]
  },
  {
    "slug": "type-aliases",
    "title": "Type Aliases",
    "levelId": "L8",
    "levelBadge": "🟩 Level 8 — Advanced Types",
    "category": "Advanced Types",
    "summary": "type T = Original for non-breaking codebase refactoring.",
    "bullets": [
      "Identical to the original type (shares method sets)",
      "Crucial for large-scale package migration"
    ],
    "sections": [
      {
        "title": "Understanding Type Aliases",
        "explanation": "type T = Original for non-breaking codebase refactoring. In production Go engineering, mastering type aliases is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Type Aliases\nfunc main() {\n    fmt.Println(\"Exploring Type Aliases in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Type Aliases in Go?",
        "choices": [
          "Identical to the original type (shares method sets)",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Identical to the original type (shares method sets)"
      }
    ]
  },
  {
    "slug": "custom-types",
    "title": "Custom Types",
    "levelId": "L8",
    "levelBadge": "🟩 Level 8 — Advanced Types",
    "category": "Advanced Types",
    "summary": "Defining distinct types to enforce semantic compiler safety.",
    "bullets": [
      "type UserID string prevents mixing up with OrderID",
      "Can define custom String(), MarshalJSON() methods"
    ],
    "sections": [
      {
        "title": "Understanding Custom Types",
        "explanation": "Defining distinct types to enforce semantic compiler safety. In production Go engineering, mastering custom types is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Custom Types\nfunc main() {\n    fmt.Println(\"Exploring Custom Types in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Custom Types in Go?",
        "choices": [
          "type UserID string prevents mixing up with OrderID",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "type UserID string prevents mixing up with OrderID"
      }
    ]
  },
  {
    "slug": "file-handling",
    "title": "File Handling",
    "levelId": "L9",
    "levelBadge": "🟧 Level 9 — File I/O & Systems",
    "category": "Systems & I/O",
    "summary": "Working with files, streams, and directories using os and io.",
    "bullets": [
      "io.Reader and io.Writer streaming interfaces",
      "bufio.Scanner for reading line-by-line efficiently",
      "os.ReadFile and os.WriteFile for quick disk operations"
    ],
    "sections": [
      {
        "title": "Understanding File Handling",
        "explanation": "Working with files, streams, and directories using os and io. In production Go engineering, mastering file handling is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating File Handling\nfunc main() {\n    fmt.Println(\"Exploring File Handling in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of File Handling in Go?",
        "choices": [
          "io.Reader and io.Writer streaming interfaces",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "io.Reader and io.Writer streaming interfaces"
      }
    ]
  },
  {
    "slug": "networking",
    "title": "Networking",
    "levelId": "L9",
    "levelBadge": "🟧 Level 9 — File I/O & Systems",
    "category": "Systems & I/O",
    "summary": "Building HTTP servers, clients, and TCP sockets with net/http.",
    "bullets": [
      "http.Server with connection timeouts and graceful shutdown",
      "Middleware pattern using http.Handler chaining",
      "High-performance HTTP/2 by default"
    ],
    "sections": [
      {
        "title": "Understanding Networking",
        "explanation": "Building HTTP servers, clients, and TCP sockets with net/http. In production Go engineering, mastering networking is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Networking\nfunc main() {\n    fmt.Println(\"Exploring Networking in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Networking in Go?",
        "choices": [
          "http.Server with connection timeouts and graceful shutdown",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "http.Server with connection timeouts and graceful shutdown"
      }
    ]
  },
  {
    "slug": "encoding",
    "title": "Encoding",
    "levelId": "L9",
    "levelBadge": "🟧 Level 9 — File I/O & Systems",
    "category": "Systems & I/O",
    "summary": "JSON, XML, and binary serialization using standard library decoders.",
    "bullets": [
      "json.Marshal and json.Unmarshal for struct conversions",
      "json.NewDecoder for memory-efficient streaming processing",
      "Custom MarshalJSON and UnmarshalJSON handlers"
    ],
    "sections": [
      {
        "title": "Understanding Encoding",
        "explanation": "JSON, XML, and binary serialization using standard library decoders. In production Go engineering, mastering encoding is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Encoding\nfunc main() {\n    fmt.Println(\"Exploring Encoding in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Encoding in Go?",
        "choices": [
          "json.Marshal and json.Unmarshal for struct conversions",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "json.Marshal and json.Unmarshal for struct conversions"
      }
    ]
  },
  {
    "slug": "cli-tools",
    "title": "CLI Tools",
    "levelId": "L9",
    "levelBadge": "🟧 Level 9 — File I/O & Systems",
    "category": "Systems & I/O",
    "summary": "Building robust command-line utilities in Go.",
    "bullets": [
      "flag package for argument parsing",
      "Handling OS termination signals (SIGINT/SIGTERM) with os/signal",
      "Compiles to single zero-dependency CLI binaries"
    ],
    "sections": [
      {
        "title": "Understanding CLI Tools",
        "explanation": "Building robust command-line utilities in Go. In production Go engineering, mastering cli tools is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating CLI Tools\nfunc main() {\n    fmt.Println(\"Exploring CLI Tools in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of CLI Tools in Go?",
        "choices": [
          "flag package for argument parsing",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "flag package for argument parsing"
      }
    ]
  },
  {
    "slug": "go-modules",
    "title": "Go Modules",
    "levelId": "L10",
    "levelBadge": "🟨 Level 10 — Build & Deploy",
    "category": "Tooling & DevOps",
    "summary": "Dependency management, semantic versioning, and go.sum verification.",
    "bullets": [
      "go mod tidy cleans up unused dependencies",
      "go.sum cryptographically verifies module contents",
      "replace directives for local multi-repo development"
    ],
    "sections": [
      {
        "title": "Understanding Go Modules",
        "explanation": "Dependency management, semantic versioning, and go.sum verification. In production Go engineering, mastering go modules is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Go Modules\nfunc main() {\n    fmt.Println(\"Exploring Go Modules in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Go Modules in Go?",
        "choices": [
          "go mod tidy cleans up unused dependencies",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "go mod tidy cleans up unused dependencies"
      }
    ]
  },
  {
    "slug": "build-system",
    "title": "Build System",
    "levelId": "L10",
    "levelBadge": "🟨 Level 10 — Build & Deploy",
    "category": "Tooling & DevOps",
    "summary": "Cross-compiling, build tags, and optimizing binary artifacts.",
    "bullets": [
      "GOOS=linux GOARCH=amd64 go build for cross-compilation",
      "Build tags //go:build linux isolate platform-specific code",
      "Reproducible builds with Go toolchain"
    ],
    "sections": [
      {
        "title": "Understanding Build System",
        "explanation": "Cross-compiling, build tags, and optimizing binary artifacts. In production Go engineering, mastering build system is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Build System\nfunc main() {\n    fmt.Println(\"Exploring Build System in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Build System in Go?",
        "choices": [
          "GOOS=linux GOARCH=amd64 go build for cross-compilation",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "GOOS=linux GOARCH=amd64 go build for cross-compilation"
      }
    ]
  },
  {
    "slug": "packaging",
    "title": "Packaging",
    "levelId": "L10",
    "levelBadge": "🟨 Level 10 — Build & Deploy",
    "category": "Tooling & DevOps",
    "summary": "Package layout patterns and internal access control.",
    "bullets": [
      "internal/ directory hides packages from outside modules",
      "cmd/ for application binary entrypoints",
      "Avoid package circular dependencies by design"
    ],
    "sections": [
      {
        "title": "Understanding Packaging",
        "explanation": "Package layout patterns and internal access control. In production Go engineering, mastering packaging is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Packaging\nfunc main() {\n    fmt.Println(\"Exploring Packaging in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Packaging in Go?",
        "choices": [
          "internal/ directory hides packages from outside modules",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "internal/ directory hides packages from outside modules"
      }
    ]
  },
  {
    "slug": "performance-tools",
    "title": "Performance Tools",
    "levelId": "L10",
    "levelBadge": "🟨 Level 10 — Build & Deploy",
    "category": "Tooling & DevOps",
    "summary": "Profiling with pprof, writing benchmarks, and race detection.",
    "bullets": [
      "go test -bench=. -benchmem measures throughput and allocations",
      "go tool pprof analyzes CPU and memory flame graphs",
      "go test -race catches concurrent data races"
    ],
    "sections": [
      {
        "title": "Understanding Performance Tools",
        "explanation": "Profiling with pprof, writing benchmarks, and race detection. In production Go engineering, mastering performance tools is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Performance Tools\nfunc main() {\n    fmt.Println(\"Exploring Performance Tools in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Performance Tools in Go?",
        "choices": [
          "go test -bench=. -benchmem measures throughput and allocations",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "go test -bench=. -benchmem measures throughput and allocations"
      }
    ]
  },
  {
    "slug": "escape-analysis-deep",
    "title": "Escape Analysis (deep)",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "Deep dive into compiler escape heuristics.",
    "bullets": [
      "Passing pointers across stack boundaries triggers heap escape",
      "Interface assignments usually escape to heap",
      "Keep hot loop allocations on stack for max performance"
    ],
    "sections": [
      {
        "title": "Understanding Escape Analysis (deep)",
        "explanation": "Deep dive into compiler escape heuristics. In production Go engineering, mastering escape analysis (deep) is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Escape Analysis (deep)\nfunc main() {\n    fmt.Println(\"Exploring Escape Analysis (deep) in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Escape Analysis (deep) in Go?",
        "choices": [
          "Passing pointers across stack boundaries triggers heap escape",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Passing pointers across stack boundaries triggers heap escape"
      }
    ]
  },
  {
    "slug": "inlining",
    "title": "Inlining",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "How the Go compiler inlines functions to eliminate call overhead.",
    "bullets": [
      "Leaf functions within complexity budget are automatically inlined",
      "//go:noinline directive disables inlining when needed",
      "Mid-stack inlining optimizes modern Go code"
    ],
    "sections": [
      {
        "title": "Understanding Inlining",
        "explanation": "How the Go compiler inlines functions to eliminate call overhead. In production Go engineering, mastering inlining is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Inlining\nfunc main() {\n    fmt.Println(\"Exploring Inlining in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Inlining in Go?",
        "choices": [
          "Leaf functions within complexity budget are automatically inlined",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Leaf functions within complexity budget are automatically inlined"
      }
    ]
  },
  {
    "slug": "compiler-flags",
    "title": "Compiler Flags",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "Leveraging gcflags and ldflags for debugging and optimization.",
    "bullets": [
      "go build -ldflags=\"-s -w\" strips debug symbols to shrink binary size",
      "go build -ldflags=\"-X main.Version=1.0\" injects build variables",
      "-gcflags=\"-m -m\" provides verbose optimization logs"
    ],
    "sections": [
      {
        "title": "Understanding Compiler Flags",
        "explanation": "Leveraging gcflags and ldflags for debugging and optimization. In production Go engineering, mastering compiler flags is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Compiler Flags\nfunc main() {\n    fmt.Println(\"Exploring Compiler Flags in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Compiler Flags in Go?",
        "choices": [
          "go build -ldflags=\"-s -w\" strips debug symbols to shrink binary size",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "go build -ldflags=\"-s -w\" strips debug symbols to shrink binary size"
      }
    ]
  },
  {
    "slug": "linker-internals",
    "title": "Linker Internals",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "How the Go linker resolves symbols and eliminates dead code.",
    "bullets": [
      "Dead code elimination (DCE) strips unused packages and functions",
      "Static linking embeds C runtime dependencies when pure Go is used"
    ],
    "sections": [
      {
        "title": "Understanding Linker Internals",
        "explanation": "How the Go linker resolves symbols and eliminates dead code. In production Go engineering, mastering linker internals is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Linker Internals\nfunc main() {\n    fmt.Println(\"Exploring Linker Internals in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Linker Internals in Go?",
        "choices": [
          "Dead code elimination (DCE) strips unused packages and functions",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Dead code elimination (DCE) strips unused packages and functions"
      }
    ]
  },
  {
    "slug": "goroutine-leak-detection",
    "title": "Goroutine Leak Detection",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "Detecting and preventing orphaned goroutines in production.",
    "bullets": [
      "Unbounded channel sends block indefinitely if receiver exits",
      "Always use timeouts or context cancellation on long operations",
      "runtime.NumGoroutine() monitors active goroutine count"
    ],
    "sections": [
      {
        "title": "Understanding Goroutine Leak Detection",
        "explanation": "Detecting and preventing orphaned goroutines in production. In production Go engineering, mastering goroutine leak detection is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Goroutine Leak Detection\nfunc main() {\n    fmt.Println(\"Exploring Goroutine Leak Detection in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Goroutine Leak Detection in Go?",
        "choices": [
          "Unbounded channel sends block indefinitely if receiver exits",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Unbounded channel sends block indefinitely if receiver exits"
      }
    ]
  },
  {
    "slug": "project-structure",
    "title": "Project Structure",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Standard Go project layout for maintainable scalable services.",
    "bullets": [
      "cmd/ for executable binaries, internal/ for private domain logic",
      "pkg/ for reusable public libraries",
      "configs/ and migrations/ for operational assets"
    ],
    "sections": [
      {
        "title": "Understanding Project Structure",
        "explanation": "Standard Go project layout for maintainable scalable services. In production Go engineering, mastering project structure is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Project Structure\nfunc main() {\n    fmt.Println(\"Exploring Project Structure in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Project Structure in Go?",
        "choices": [
          "cmd/ for executable binaries, internal/ for private domain logic",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "cmd/ for executable binaries, internal/ for private domain logic"
      }
    ]
  },
  {
    "slug": "dependency-injection",
    "title": "Dependency Injection",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Decoupling application layers with constructor functions.",
    "bullets": [
      "NewService(repo Repository) constructor pattern",
      "Explicit dependencies over magical reflection containers",
      "Ensures straightforward unit testing with mock interfaces"
    ],
    "sections": [
      {
        "title": "Understanding Dependency Injection",
        "explanation": "Decoupling application layers with constructor functions. In production Go engineering, mastering dependency injection is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Dependency Injection\nfunc main() {\n    fmt.Println(\"Exploring Dependency Injection in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Dependency Injection in Go?",
        "choices": [
          "NewService(repo Repository) constructor pattern",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "NewService(repo Repository) constructor pattern"
      }
    ]
  },
  {
    "slug": "clean-architecture",
    "title": "Clean Architecture",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Hexagonal / Ports-and-Adapters architecture in Go.",
    "bullets": [
      "Domain entities at the core, independent of databases and HTTP frameworks",
      "Interfaces define repository contracts, adapters implement them"
    ],
    "sections": [
      {
        "title": "Understanding Clean Architecture",
        "explanation": "Hexagonal / Ports-and-Adapters architecture in Go. In production Go engineering, mastering clean architecture is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Clean Architecture\nfunc main() {\n    fmt.Println(\"Exploring Clean Architecture in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Clean Architecture in Go?",
        "choices": [
          "Domain entities at the core, independent of databases and HTTP frameworks",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Domain entities at the core, independent of databases and HTTP frameworks"
      }
    ]
  },
  {
    "slug": "testing",
    "title": "Testing",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Idiomatic table-driven tests, mocks, and subtests.",
    "bullets": [
      "Table-driven tests iterate over test case slices with t.Run",
      "testing/quick for property-based fuzz testing",
      "go test -coverprofile=coverage.out verifies test coverage"
    ],
    "sections": [
      {
        "title": "Understanding Testing",
        "explanation": "Idiomatic table-driven tests, mocks, and subtests. In production Go engineering, mastering testing is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Testing\nfunc main() {\n    fmt.Println(\"Exploring Testing in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Testing in Go?",
        "choices": [
          "Table-driven tests iterate over test case slices with t.Run",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Table-driven tests iterate over test case slices with t.Run"
      }
    ]
  },
  {
    "slug": "logging",
    "title": "Logging",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Structured logging with log/slog in modern Go.",
    "bullets": [
      "slog.Info, slog.Error with strongly-typed attributes (slog.Int, slog.String)",
      "JSONHandler outputs structured JSON for cloud log aggregators"
    ],
    "sections": [
      {
        "title": "Understanding Logging",
        "explanation": "Structured logging with log/slog in modern Go. In production Go engineering, mastering logging is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Logging\nfunc main() {\n    fmt.Println(\"Exploring Logging in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Logging in Go?",
        "choices": [
          "slog.Info, slog.Error with strongly-typed attributes (slog.Int, slog.String)",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "slog.Info, slog.Error with strongly-typed attributes (slog.Int, slog.String)"
      }
    ]
  },
  {
    "slug": "microservices",
    "title": "Microservices",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Building resilient distributed microservices with gRPC and HTTP.",
    "bullets": [
      "Protocol Buffers define API schema contracts",
      "Graceful shutdown on SIGTERM ensures zero dropped in-flight requests",
      "Health check endpoints for container orchestrators"
    ],
    "sections": [
      {
        "title": "Understanding Microservices",
        "explanation": "Building resilient distributed microservices with gRPC and HTTP. In production Go engineering, mastering microservices is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Microservices\nfunc main() {\n    fmt.Println(\"Exploring Microservices in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Microservices in Go?",
        "choices": [
          "Protocol Buffers define API schema contracts",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Protocol Buffers define API schema contracts"
      }
    ]
  },
  {
    "slug": "unsafe",
    "title": "Unsafe",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Bypassing Go type safety with the unsafe package.",
    "bullets": [
      "unsafe.Pointer allows casting between arbitrary pointer types",
      "uintptr represents raw memory addresses without GC tracking",
      "High risk of memory corruption; reserved for extreme low-level drivers"
    ],
    "sections": [
      {
        "title": "Understanding Unsafe",
        "explanation": "Bypassing Go type safety with the unsafe package. In production Go engineering, mastering unsafe is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Unsafe\nfunc main() {\n    fmt.Println(\"Exploring Unsafe in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Unsafe in Go?",
        "choices": [
          "unsafe.Pointer allows casting between arbitrary pointer types",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "unsafe.Pointer allows casting between arbitrary pointer types"
      }
    ]
  },
  {
    "slug": "atomic-operations",
    "title": "Atomic Operations",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Lock-free concurrency using CPU atomic instructions in sync/atomic.",
    "bullets": [
      "atomic.AddInt64, atomic.LoadPointer, atomic.CompareAndSwap",
      "Significantly faster than mutexes for simple counter variables",
      "Memory barriers ensure cache coherency across CPU cores"
    ],
    "sections": [
      {
        "title": "Understanding Atomic Operations",
        "explanation": "Lock-free concurrency using CPU atomic instructions in sync/atomic. In production Go engineering, mastering atomic operations is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Atomic Operations\nfunc main() {\n    fmt.Println(\"Exploring Atomic Operations in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Atomic Operations in Go?",
        "choices": [
          "atomic.AddInt64, atomic.LoadPointer, atomic.CompareAndSwap",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "atomic.AddInt64, atomic.LoadPointer, atomic.CompareAndSwap"
      }
    ]
  },
  {
    "slug": "wasm",
    "title": "WASM",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Compiling Go programs to WebAssembly for browser execution.",
    "bullets": [
      "GOOS=js GOARCH=wasm go build produces .wasm binary",
      "syscall/js package interacts directly with JavaScript DOM",
      "Enables running Go code inside client-side web apps"
    ],
    "sections": [
      {
        "title": "Understanding WASM",
        "explanation": "Compiling Go programs to WebAssembly for browser execution. In production Go engineering, mastering wasm is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating WASM\nfunc main() {\n    fmt.Println(\"Exploring WASM in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of WASM in Go?",
        "choices": [
          "GOOS=js GOARCH=wasm go build produces .wasm binary",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "GOOS=js GOARCH=wasm go build produces .wasm binary"
      }
    ]
  },
  {
    "slug": "reflection",
    "title": "Reflection",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Inspecting types and values dynamically at runtime with reflect.",
    "bullets": [
      "reflect.TypeOf and reflect.ValueOf inspect runtime types",
      "Used in ORMs, serializers, and dependency injectors",
      "Has noticeable runtime performance cost; prefer static types"
    ],
    "sections": [
      {
        "title": "Understanding Reflection",
        "explanation": "Inspecting types and values dynamically at runtime with reflect. In production Go engineering, mastering reflection is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Reflection\nfunc main() {\n    fmt.Println(\"Exploring Reflection in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Reflection in Go?",
        "choices": [
          "reflect.TypeOf and reflect.ValueOf inspect runtime types",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "reflect.TypeOf and reflect.ValueOf inspect runtime types"
      }
    ]
  },
  {
    "slug": "plugins",
    "title": "Plugins",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Dynamic shared library (.so) loading at runtime.",
    "bullets": [
      "plugin.Open loads compiled Go plugins dynamically",
      "Requires identical Go compiler and toolchain versions between host and plugin"
    ],
    "sections": [
      {
        "title": "Understanding Plugins",
        "explanation": "Dynamic shared library (.so) loading at runtime. In production Go engineering, mastering plugins is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Plugins\nfunc main() {\n    fmt.Println(\"Exploring Plugins in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Plugins in Go?",
        "choices": [
          "plugin.Open loads compiled Go plugins dynamically",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "plugin.Open loads compiled Go plugins dynamically"
      }
    ]
  },
  {
    "slug": "runtime-internals",
    "title": "Runtime Internals",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "Go runtime memory allocator: arenas, spans, mcache, and mcentral.",
    "bullets": [
      "Thread-caching malloc (TCMalloc) derived memory allocator",
      "mcache provides lock-free per-thread allocation for small objects",
      "mheap allocates large memory spans from the OS virtual address space"
    ],
    "sections": [
      {
        "title": "Understanding Runtime Internals",
        "explanation": "Go runtime memory allocator: arenas, spans, mcache, and mcentral. In production Go engineering, mastering runtime internals is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Runtime Internals\nfunc main() {\n    fmt.Println(\"Exploring Runtime Internals in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Runtime Internals in Go?",
        "choices": [
          "Thread-caching malloc (TCMalloc) derived memory allocator",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Thread-caching malloc (TCMalloc) derived memory allocator"
      }
    ]
  },
  {
    "slug": "gc-internals",
    "title": "GC Internals",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "Under the hood of the concurrent tri-color garbage collector.",
    "bullets": [
      "White (unvisited), Grey (discovered), Black (scanned) object states",
      "Write barrier intercepts pointer modifications during concurrent marking",
      "Mutator assist forces allocating goroutines to help mark memory"
    ],
    "sections": [
      {
        "title": "Understanding GC Internals",
        "explanation": "Under the hood of the concurrent tri-color garbage collector. In production Go engineering, mastering gc internals is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating GC Internals\nfunc main() {\n    fmt.Println(\"Exploring GC Internals in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of GC Internals in Go?",
        "choices": [
          "White (unvisited), Grey (discovered), Black (scanned) object states",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "White (unvisited), Grey (discovered), Black (scanned) object states"
      }
    ]
  },
  {
    "slug": "memory-layout",
    "title": "Memory Layout",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "Binary memory layouts of Go types, interfaces, and empty structs.",
    "bullets": [
      "struct{} takes exactly 0 bytes of memory",
      "Interface is two pointers: (tab *itab, data unsafe.Pointer)",
      "String is two words: (data *byte, len int)"
    ],
    "sections": [
      {
        "title": "Understanding Memory Layout",
        "explanation": "Binary memory layouts of Go types, interfaces, and empty structs. In production Go engineering, mastering memory layout is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Memory Layout\nfunc main() {\n    fmt.Println(\"Exploring Memory Layout in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Memory Layout in Go?",
        "choices": [
          "struct{} takes exactly 0 bytes of memory",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "struct{} takes exactly 0 bytes of memory"
      }
    ]
  },
  {
    "slug": "channel-internals",
    "title": "Channel Internals",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "The hchan struct and wait queues in the Go runtime.",
    "bullets": [
      "hchan contains mutex, circular ring buffer, and sendq/recvq sudog wait lists",
      "Channel operations acquire hchan lock briefly to enqueue/dequeue sudogs"
    ],
    "sections": [
      {
        "title": "Understanding Channel Internals",
        "explanation": "The hchan struct and wait queues in the Go runtime. In production Go engineering, mastering channel internals is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Channel Internals\nfunc main() {\n    fmt.Println(\"Exploring Channel Internals in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Channel Internals in Go?",
        "choices": [
          "hchan contains mutex, circular ring buffer, and sendq/recvq sudog wait lists",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "hchan contains mutex, circular ring buffer, and sendq/recvq sudog wait lists"
      }
    ]
  },
  {
    "slug": "map-internals",
    "title": "Map Internals",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "The hmap struct, buckets, tophash, and incremental evacuation.",
    "bullets": [
      "hmap stores array of 8-slot bmap buckets",
      "tophash byte array allows fast SIMD-like key filtering",
      "Doubles bucket count incrementally during table growth"
    ],
    "sections": [
      {
        "title": "Understanding Map Internals",
        "explanation": "The hmap struct, buckets, tophash, and incremental evacuation. In production Go engineering, mastering map internals is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Map Internals\nfunc main() {\n    fmt.Println(\"Exploring Map Internals in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Map Internals in Go?",
        "choices": [
          "hmap stores array of 8-slot bmap buckets",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "hmap stores array of 8-slot bmap buckets"
      }
    ]
  },
  {
    "slug": "slice-internals",
    "title": "Slice Internals",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "Slice reallocation mechanics and avoiding sub-slice memory leaks.",
    "bullets": [
      "Sub-slicing a large array holds the entire backing array in memory",
      "Copy to a fresh slice to allow GC to reclaim unused backing buffers"
    ],
    "sections": [
      {
        "title": "Understanding Slice Internals",
        "explanation": "Slice reallocation mechanics and avoiding sub-slice memory leaks. In production Go engineering, mastering slice internals is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Slice Internals\nfunc main() {\n    fmt.Println(\"Exploring Slice Internals in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Slice Internals in Go?",
        "choices": [
          "Sub-slicing a large array holds the entire backing array in memory",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Sub-slicing a large array holds the entire backing array in memory"
      }
    ]
  },
  {
    "slug": "philosophy",
    "title": "Philosophy",
    "levelId": "L15",
    "levelBadge": "🟦 Level 15 — Philosophy & Distributed",
    "category": "Philosophy & Systems",
    "summary": "Core Go design philosophy and the Go Proverbs.",
    "bullets": [
      "\"Don't communicate by sharing memory, share memory by communicating.\"",
      "\"Clear is better than clever.\"",
      "\"A little copying is better than a little dependency.\""
    ],
    "sections": [
      {
        "title": "Understanding Philosophy",
        "explanation": "Core Go design philosophy and the Go Proverbs. In production Go engineering, mastering philosophy is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Philosophy\nfunc main() {\n    fmt.Println(\"Exploring Philosophy in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Philosophy in Go?",
        "choices": [
          "\"Don't communicate by sharing memory, share memory by communicating.\"",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "\"Don't communicate by sharing memory, share memory by communicating.\""
      }
    ]
  },
  {
    "slug": "anti-patterns",
    "title": "Anti-patterns",
    "levelId": "L15",
    "levelBadge": "🟦 Level 15 — Philosophy & Distributed",
    "category": "Philosophy & Systems",
    "summary": "Common mistakes and bad patterns to avoid in Go.",
    "bullets": [
      "Using panic for normal error control flow",
      "Ignoring returned errors or discarding them with _",
      "Spawning unmetered goroutines without bounded worker pools"
    ],
    "sections": [
      {
        "title": "Understanding Anti-patterns",
        "explanation": "Common mistakes and bad patterns to avoid in Go. In production Go engineering, mastering anti-patterns is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Anti-patterns\nfunc main() {\n    fmt.Println(\"Exploring Anti-patterns in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Anti-patterns in Go?",
        "choices": [
          "Using panic for normal error control flow",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Using panic for normal error control flow"
      }
    ]
  },
  {
    "slug": "distributed-systems",
    "title": "Distributed Systems",
    "levelId": "L15",
    "levelBadge": "🟦 Level 15 — Philosophy & Distributed",
    "category": "Philosophy & Systems",
    "summary": "Building distributed services, consensus, and fault-tolerant nodes in Go.",
    "bullets": [
      "Leader election and consensus algorithms (Raft in etcd/Consul)",
      "Circuit breakers and exponential backoff retry mechanisms",
      "Distributed tracing with OpenTelemetry context propagation"
    ],
    "sections": [
      {
        "title": "Understanding Distributed Systems",
        "explanation": "Building distributed services, consensus, and fault-tolerant nodes in Go. In production Go engineering, mastering distributed systems is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Distributed Systems\nfunc main() {\n    fmt.Println(\"Exploring Distributed Systems in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Distributed Systems in Go?",
        "choices": [
          "Leader election and consensus algorithms (Raft in etcd/Consul)",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Leader election and consensus algorithms (Raft in etcd/Consul)"
      }
    ]
  },
  {
    "slug": "open-source-patterns",
    "title": "Open-source Patterns",
    "levelId": "L15",
    "levelBadge": "🟦 Level 15 — Philosophy & Distributed",
    "category": "Philosophy & Systems",
    "summary": "Idiomatic conventions across the Go open-source ecosystem.",
    "bullets": [
      "Effective Go standard guidelines",
      "Automated linting with golangci-lint and staticcheck",
      "Consistent error wrapping and documentation conventions"
    ],
    "sections": [
      {
        "title": "Understanding Open-source Patterns",
        "explanation": "Idiomatic conventions across the Go open-source ecosystem. In production Go engineering, mastering open-source patterns is essential for building scalable, concurrent, and high-performance backend systems.",
        "code": "package main\n\nimport (\n    \"fmt\"\n)\n\n// Example demonstrating Open-source Patterns\nfunc main() {\n    fmt.Println(\"Exploring Open-source Patterns in Go.\")\n}"
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a primary advantage of Open-source Patterns in Go?",
        "choices": [
          "Effective Go standard guidelines",
          "Requires manual pointer arithmetic",
          "Disables the garbage collector completely",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Effective Go standard guidelines"
      }
    ]
  }
];

export const conceptsMap = new Map<string, FullConcept>(
  allConcepts.map((c) => [c.slug, c])
);
