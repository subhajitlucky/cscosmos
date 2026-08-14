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

export type CommonPitfall = {
  mistake: string;
  fix: string;
};

export type FullConcept = {
  slug: string;
  title: string;
  levelId: string;
  levelBadge: string;
  category: string;
  summary: string;
  analogy: string;
  bullets: string[];
  mentalModel?: string;
  sections: ConceptSection[];
  commonPitfalls?: CommonPitfall[];
  quizzes: ConceptQuiz[];
};

export const allConcepts: FullConcept[] = [
  {
    "slug": "introduction-to-go",
    "title": "Introduction to Go",
    "levelId": "L0",
    "levelBadge": "🟢 Level 0 — Absolute Basics",
    "category": "Foundation",
    "summary": "Discover why Google created Go in 2009 to replace complex C++ and Java codebases with a fast, simple, and concurrent language.",
    "analogy": "Imagine a Swiss Army knife stripped of 50 useless attachments, leaving only the sharpest blade, bottle opener, and scissors. That is Go: minimal, lightning-fast, and built for purpose.",
    "bullets": [
      "Created by computing pioneers Robert Griesemer, Rob Pike, and Ken Thompson at Google.",
      "Compiled directly to machine code — runs without a JVM, Python interpreter, or Node runtime.",
      "Built-in concurrency (goroutines and channels) makes multicore scaling effortless.",
      "Opinionated formatting: `go fmt` eliminates all debates over tabs vs spaces."
    ],
    "mentalModel": "[Your Go Code: main.go] ──(go build)──> [Single Native Binary] ──> [Executes in 0ms on Linux/Mac/Windows]",
    "sections": [
      {
        "title": "1. Why Was Go Invented?",
        "explanation": "In the late 2000s, Google was managing massive codebases with millions of lines of C++ and Java. Builds took hours, dependency management was fragile, and writing multicore code was error-prone. Go was designed around three pillars: Simplicity, Fast Compilation, and Native Concurrency.",
        "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // A complete, runnable Go program\n    fmt.Println(\"Welcome to Go! Simple, fast, and concurrent.\")\n}",
        "visualHint": "Notice how clean this is: no public static void main(), no class wrappers, no boilerplates."
      },
      {
        "title": "2. The Single Binary Advantage",
        "explanation": "When you compile a Go program with `go build`, the Go compiler bundles your code AND the lightweight Go runtime into a single standalone executable file. You can deploy it to any server with zero dependencies installed.",
        "code": "$ go build -o myapp main.go\n$ ./myapp\nWelcome to Go! Simple, fast, and concurrent."
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Trying to use OOP class inheritance (like `class Cat extends Animal`).",
        "fix": "Go has NO classes or inheritance. Use simple structs and composition (embedding)."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary compilation result of a Go program?",
        "choices": [
          "A bytecode file requiring a Java Virtual Machine",
          "A single standalone executable binary",
          "An interpreted script running inside an engine",
          "A folder of dependencies like node_modules"
        ],
        "answer": 1,
        "explanation": "Go compiles directly into a standalone native binary with zero external dependencies."
      },
      {
        "id": 2,
        "question": "How does Go handle code formatting across different teams?",
        "choices": [
          "Every developer creates their own custom style rules",
          "`go fmt` enforces one standard universal format for all Go code",
          "Formatting is ignored by the compiler",
          "Go requires semicolons on every line"
        ],
        "answer": 1,
        "explanation": "`go fmt` automatically formats all Go code to the universal standard style."
      }
    ]
  },
  {
    "slug": "installation-and-setup",
    "title": "Installation & Setup",
    "levelId": "L0",
    "levelBadge": "🟢 Level 0 — Absolute Basics",
    "category": "Foundation",
    "summary": "Step-by-step guide to installing the official Go compiler, configuring environment paths, and setting up VS Code or GoLand.",
    "analogy": "Installing Go is like setting up a carpenter workshop: GOROOT is the storage shed where the factory tools live, and GOPATH/workspace is your personal workbench.",
    "bullets": [
      "Download and install from the official site (go.dev).",
      "Verify installation with `go version` in your terminal.",
      "Install the official Go extension in VS Code for instant autocompletion and error detection powered by `gopls`.",
      "Initialize any new project anywhere with `go mod init <name>`."
    ],
    "mentalModel": "[Terminal] ──> go version ──> go1.24+ Installed!\n     │\n     ├── GOROOT: Location of standard library & compiler\n     └── GOPATH: Downloaded third-party modules cache",
    "sections": [
      {
        "title": "1. Verifying Your Installation",
        "explanation": "Once installed, open any terminal or command prompt and run `go version`. You should see the active Go version and CPU architecture.",
        "code": "$ go version\ngo version go1.24.0 linux/amd64\n\n# Check active environment settings\n$ go env GOPATH GOROOT"
      },
      {
        "title": "2. Setting Up Your Editor",
        "explanation": "Install Visual Studio Code and install the official \"Go\" extension by Google. This automatically installs `gopls` (the official Go language server), giving you syntax highlighting, auto-imports on save, and type hints.",
        "code": "// .vscode/settings.json (Recommended Beginner Settings)\n{\n  \"editor.formatOnSave\": true,\n  \"go.useLanguageServer\": true\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Thinking you must put all projects inside `~/go/src` (the old GOPATH way).",
        "fix": "Modern Go uses Go Modules! You can create your projects in ANY folder on your computer by running `go mod init myproject`."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Which tool provides intelligent autocomplete, error squiggles, and refactoring in your code editor?",
        "choices": [
          "npm",
          "gopls (Go Language Server)",
          "gcc",
          "webpack"
        ],
        "answer": 1,
        "explanation": "`gopls` is the official Go language server powering IDE integrations."
      }
    ]
  },
  {
    "slug": "hello-world",
    "title": "Hello World",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Line-by-line breakdown of your first Go program: packages, standard library imports, and the main entrypoint.",
    "analogy": "`package main` is the front door of your house. When the computer runs your program, it walks right through `package main` and rings the `func main()` doorbell.",
    "bullets": [
      "`package main` tells the Go compiler: \"This is an executable application, not a library.\"",
      "`import \"fmt\"` imports the Formatted I/O package from the Go Standard Library.",
      "`func main()` is the starting line where program execution begins.",
      "Functions are enclosed in curly braces `{}` and the opening brace MUST be on the same line as `func`."
    ],
    "mentalModel": "┌────────────────────────────────────────┐\n│ package main     <-- Entry package     │\n│ import \"fmt\"     <-- Load tools        │\n│                                        │\n│ func main() {    <-- Entry point       │\n│     fmt.Println(\"Hello, Gopher!\")      │\n│ }                                      │\n└────────────────────────────────────────┘",
    "sections": [
      {
        "title": "1. The Code Breakdown",
        "explanation": "Here is every single line explained for beginners:",
        "code": "// 1. Every Go file must belong to a package\npackage main\n\n// 2. Import packages you need from standard library\nimport \"fmt\"\n\n// 3. The main function: execution starts here\nfunc main() {\n    // Println outputs text with an automatic newline at the end\n    fmt.Println(\"Hello, World!\")\n}"
      },
      {
        "title": "2. Running vs Building",
        "explanation": "You have two main ways to execute your code: `go run` compiles and runs in memory immediately (great for rapid development), while `go build` saves a standalone binary to disk.",
        "code": "# Run immediately:\n$ go run main.go\nHello, World!\n\n# Build a binary file:\n$ go build main.go\n$ ./main\nHello, World!"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Putting the opening curly brace `{` on a new line (e.g. `func main() \\n {`).",
        "fix": "In Go, the opening brace `{` MUST be on the same line. The compiler automatically inserts semicolons at line endings, so putting `{` on a new line causes a syntax error."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What happens if you name your package `package calculator` instead of `package main`?",
        "choices": [
          "It compiles into an executable binary",
          "It compiles as a reusable library package and cannot be run directly with `go run`",
          "The code fails with a syntax error",
          "It runs in debug mode"
        ],
        "answer": 1,
        "explanation": "Only `package main` produces a runnable executable. Other names create library packages."
      }
    ]
  },
  {
    "slug": "basic-syntax",
    "title": "Basic Syntax",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Learn the core rules of Go: semicolon insertion, export visibility (Capitalization), and commenting.",
    "analogy": "Capital letters in Go are like VIP badges. If a function or variable starts with a Capital letter, it can leave the room (public). If it starts with lowercase, it stays private in the room.",
    "bullets": [
      "Visibility is determined purely by capitalization: `ExportedName` vs `unexportedName`.",
      "No trailing semicolons required — the Go lexer inserts them automatically.",
      "Go uses `//` for single-line comments and `/* */` for multi-line block comments.",
      "Naming convention: use MixedCaps/camelCase (e.g., `userID`, `parseJSON`), never snake_case."
    ],
    "mentalModel": "[Inside package mathutil]\n  ├── CalculateTotal()  ──> Starts with Capital 'C' ──> 🟢 PUBLIC (Exported)\n  └── helperFunction()  ──> Starts with Lowercase 'h' ──> 🔒 PRIVATE (Unexported)",
    "sections": [
      {
        "title": "1. Exported vs Unexported (Public vs Private)",
        "explanation": "In Go, there are no `public` or `private` keywords. The first letter of any identifier decides its visibility to other packages.",
        "code": "package wallet\n\n// Exported (Public): starts with Capital 'B'\n// Other packages can do wallet.Balance\nvar Balance = 1000\n\n// Unexported (Private): starts with lowercase 's'\n// Only functions inside package wallet can access this\nvar secretPin = 1234"
      },
      {
        "title": "2. Naming Conventions",
        "explanation": "Go developers follow strict naming rules: keep names concise, use CamelCase, and acronyms should be capitalized together (e.g. `httpServer`, `urlID`, `jsonParser`).",
        "code": "// ✅ Good idiomatic Go:\nvar maxRetryCount = 5\nvar apiURL = \"https://api.example.com\"\n\n// ❌ Unidiomatic (Avoid snake_case):\nvar max_retry_count = 5"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Importing a package but not using it.",
        "fix": "Go treats unused imports as compiler errors. Remove unused imports or use `gopls` which cleans them automatically on save."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "How do you make a struct field accessible to other packages in Go?",
        "choices": [
          "Add the `public` keyword before the field",
          "Start the field name with a Capital letter",
          "Add `@exported` tag above the field",
          "Place it in a `public.go` file"
        ],
        "answer": 1,
        "explanation": "Capitalizing the first letter of an identifier exports it to external packages."
      }
    ]
  },
  {
    "slug": "variables",
    "title": "Variables",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Mastering variable declarations: `var`, short declaration (`:=`), automatic zero-values, and type inference.",
    "analogy": "Variables are labeled storage boxes. In Go, you never get a dirty or random box from memory: if you do not put something inside, Go automatically cleans it and places a default \"Zero Value\" inside.",
    "bullets": [
      "Standard declaration: `var age int = 25` (explicit type).",
      "Short declaration: `age := 25` (type inferred automatically, only valid inside functions).",
      "Zero Values: uninitialized variables automatically get safe defaults (`0`, `\"\"`, `false`, `nil`).",
      "Unused local variables cause compile-time errors to keep codebases lean."
    ],
    "mentalModel": "Zero Values in Go:\n  Numbers (int, float) ──> 0 / 0.0\n  Booleans (bool)      ──> false\n  Strings (string)     ──> \"\" (empty string)\n  Pointers / Slices    ──> nil",
    "sections": [
      {
        "title": "1. Three Ways to Declare Variables",
        "explanation": "Go provides flexible ways to create variables based on whether you know the initial value:",
        "code": "package main\n\nimport \"fmt\"\n\nfunc main() {\n    // 1. Explicit declaration with zero value (score becomes 0)\n    var score int\n\n    // 2. Explicit type with initial value\n    var username string = \"Gopher\"\n\n    // 3. Short declaration with automatic type inference (most common)\n    level := 10       // Go infers 'int'\n    isPro := true     // Go infers 'bool'\n\n    fmt.Println(score, username, level, isPro)\n}"
      },
      {
        "title": "2. Zero Values Protect You From Garbage Memory",
        "explanation": "In C/C++, uninitialized variables contain random garbage bytes from RAM. In Go, every variable is guaranteed to start in a predictable zero state.",
        "code": "var count int     // 0\nvar name string    // \"\" (empty string)\nvar active bool    // false\nvar ptr *int       // nil (points to nothing safely)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Using `:=` outside of a function body at package level.",
        "fix": "Short declaration `:=` is only allowed inside function bodies. At package level, always use `var name = value`."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the value of `var active bool` before any assignment?",
        "choices": [
          "nil",
          "undefined",
          "false",
          "true"
        ],
        "answer": 2,
        "explanation": "The zero value of a boolean in Go is `false`."
      },
      {
        "id": 2,
        "question": "Can you use `name := \"Alice\"` at the top level of a Go file outside any function?",
        "choices": [
          "Yes, anywhere in the file",
          "No, `:=` is only valid inside function bodies",
          "Only if exported",
          "Only in package main"
        ],
        "answer": 1,
        "explanation": "Short variable declaration `:=` can only be used inside function bodies."
      }
    ]
  },
  {
    "slug": "basic-types",
    "title": "Basic Types",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Explore Go numeric primitives, booleans, immutable strings, bytes, and Unicode runes.",
    "analogy": "Types are like specific container shapes: a water cup, a shoebox, and a letter envelope. You can not pour soup into an envelope — Go enforces this strictly to prevent runtime crashes.",
    "bullets": [
      "Integers: `int`, `int8`, `int16`, `int32`, `int64` and unsigned `uint` variants.",
      "Floating points: `float32` and `float64` (default for decimals).",
      "Strings: Immutable sequences of UTF-8 bytes.",
      "`byte` is an alias for `uint8` (raw 8-bit byte), `rune` is an alias for `int32` (Unicode character code point)."
    ],
    "mentalModel": "[String: \"Go 世界\"]\n  ├── Bytes: [71, 111, 32, 228, 184, 150, 231, 149, 140] (9 bytes total)\n  └── Runes: ['G', 'o', ' ', '世', '界'] (5 Unicode characters)",
    "sections": [
      {
        "title": "1. Integers and Floats",
        "explanation": "In Go, `int` is architecture-dependent (64-bit on 64-bit systems). Type conversion is ALWAYS explicit — Go never silently converts `int` to `float64`.",
        "code": "var x int = 42\nvar y float64 = float64(x) // Explicit conversion required!"
      },
      {
        "title": "2. Bytes vs Runes",
        "explanation": "Because Go natively supports UTF-8, English letters take 1 byte, while emojis and international characters take 2–4 bytes. A `rune` represents a single full character.",
        "code": "s := \"Hi 🚀\"\nfmt.Println(len(s)) // 7 bytes (H:1, i:1, space:1, rocket:4)\n\n// Range iterates by RUNES (characters), not raw bytes:\nfor index, char := range s {\n    fmt.Printf(\"Char %c at byte index %d\\n\", char, index)\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Trying to modify a string character in-place like `s[0] = 'A'`.",
        "fix": "Strings in Go are completely immutable. Convert to a byte slice first: `b := []byte(s); b[0] = 'A'; s = string(b)`."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is a `rune` in Go?",
        "choices": [
          "An alias for `int32` representing a single Unicode code point (character)",
          "An 8-bit ASCII character",
          "A special floating point number",
          "A cryptographic hash key"
        ],
        "answer": 0,
        "explanation": "A `rune` is an `int32` that holds a single Unicode character code point."
      }
    ]
  },
  {
    "slug": "constants",
    "title": "Constants",
    "levelId": "L1",
    "levelBadge": "🟡 Level 1 — Fundamentals",
    "category": "Foundation",
    "summary": "Understand compile-time constants, untyped arbitrary precision, and the `iota` auto-incrementing enumerator.",
    "analogy": "Constants are like blueprints carved into stone before the building is even constructed. They can never be altered once created.",
    "bullets": [
      "Declared with `const` keyword and evaluated strictly at compile time.",
      "Untyped constants have infinite mathematical precision until assigned to a typed variable.",
      "`iota` is an auto-incrementing integer index that simplifies enum definitions."
    ],
    "mentalModel": "const (\n    Sunday    = iota  // 0\n    Monday    = iota  // 1\n    Tuesday   = iota  // 2\n    Wednesday = iota  // 3\n)",
    "sections": [
      {
        "title": "1. Declaring Constants & iota",
        "explanation": "`iota` resets to 0 whenever the `const` keyword appears and increments by 1 on each subsequent line in the block.",
        "code": "package main\n\nimport \"fmt\"\n\nconst (\n    StatusPending = iota // 0\n    StatusActive         // 1 (iota continues)\n    StatusClosed         // 2\n)\n\nconst (\n    _  = 1 << (10 * iota)\n    KB // 1024\n    MB // 1048576\n    GB // 1073741824\n)\n\nfunc main() {\n    fmt.Println(StatusActive) // 1\n    fmt.Printf(\"1 GB = %d bytes\\n\", GB)\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Trying to assign a runtime function return value to a constant (e.g. `const now = time.Now()`).",
        "fix": "Constants can ONLY be assigned values that are known at compile time."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "When are Go constants evaluated?",
        "choices": [
          "At compile-time",
          "When the program starts up in main()",
          "During runtime garbage collection",
          "Only on demand"
        ],
        "answer": 0,
        "explanation": "Constants are evaluated strictly at compile time by the compiler."
      }
    ]
  },
  {
    "slug": "conditionals",
    "title": "Conditionals",
    "levelId": "L2",
    "levelBadge": "🟠 Level 2 — Flow Control",
    "category": "Flow Control",
    "summary": "Branching logic using if, else, and Go unique short initializer statements.",
    "analogy": "Think of a train track switch that checks the signal right before switching tracks. Go allows you to prepare the signal (initializer) on the exact same line as the switch.",
    "bullets": [
      "No parentheses required around condition checks: `if x > 10 { ... }`.",
      "Short initializer syntax: `if err := doWork(); err != nil` limits variable scope to the if-block.",
      "Go encourages early returns and guard clauses over deeply nested if-else trees."
    ],
    "mentalModel": "if [init statement]; [condition check] {\n    // executes if true\n} else {\n    // executes if false\n}",
    "sections": [
      {
        "title": "1. Scoped Initializer Statements",
        "explanation": "You can execute a statement before checking a condition. Variables created here exist only inside the if-else blocks, preventing namespace pollution.",
        "code": "if user, err := findUser(101); err != nil {\n    fmt.Println(\"Error:\", err)\n    return\n} else {\n    fmt.Println(\"Found user:\", user.Name)\n}\n// 'user' is no longer accessible here! Kept safe from accidental reuse."
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Writing giant nested if/else pyramids.",
        "fix": "Use \"guard clauses\" (check for error, return immediately) to keep happy-path code left-aligned."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Where is a variable declared in an `if err := do(); err != nil` statement accessible?",
        "choices": [
          "Throughout the whole function",
          "Only within the if and associated else blocks",
          "Globally across the package",
          "Inside the if block only"
        ],
        "answer": 1,
        "explanation": "Variables created in an if-statement initializer are scoped only to that if/else construct."
      }
    ]
  },
  {
    "slug": "switch",
    "title": "Switch Statements",
    "levelId": "L2",
    "levelBadge": "🟠 Level 2 — Flow Control",
    "category": "Flow Control",
    "summary": "Clean multi-way branching without automatic fallthrough bugs and dynamic type inspection.",
    "analogy": "A vending machine coin slot: it checks the coin against multiple sizes and routes it immediately to the right bucket without falling into all other buckets.",
    "bullets": [
      "Cases break automatically by default (no manual `break` keyword needed).",
      "Tagless switches (`switch { ... }`) serve as a cleaner, more readable alternative to chained `if-else if` blocks.",
      "Type switches (`switch v := i.(type)`) safely inspect the underlying dynamic type of an interface value."
    ],
    "mentalModel": "switch value {\ncase \"A\", \"B\": // matches either\n    // breaks automatically\ncase \"C\":\n    // breaks automatically\ndefault:\n    // fallback\n}",
    "sections": [
      {
        "title": "1. Tagless and Multi-Value Switch",
        "explanation": "Go switch cases can evaluate expressions, check multiple matching values separated by commas, or omit the switch variable entirely.",
        "code": "// 1. Multiple values per case\nrole := \"admin\"\nswitch role {\ncase \"admin\", \"moderator\":\n    fmt.Println(\"Staff access granted\")\ncase \"guest\":\n    fmt.Println(\"Read-only access\")\n}\n\n// 2. Tagless switch (Clean replacement for if-else chains)\nscore := 85\nswitch {\ncase score >= 90:\n    fmt.Println(\"Grade A\")\ncase score >= 80:\n    fmt.Println(\"Grade B\")\ndefault:\n    fmt.Println(\"Grade C\")\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Adding manual `break` at the end of every case.",
        "fix": "Go cases break automatically! `break` is redundant unless breaking out of an outer loop."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Do Go switch cases automatically fall through to the next case like in C/Java?",
        "choices": [
          "Yes, unless you write break",
          "No, Go breaks automatically by default",
          "Only in type switches",
          "Only in debug mode"
        ],
        "answer": 1,
        "explanation": "Go switch cases break automatically."
      }
    ]
  },
  {
    "slug": "loops",
    "title": "Loops (for & range)",
    "levelId": "L2",
    "levelBadge": "🟠 Level 2 — Flow Control",
    "category": "Flow Control",
    "summary": "The single loop keyword in Go: classic three-part loops, while-style conditions, infinite loops, and range iteration.",
    "analogy": "An automated conveyer belt: it carries items one by one (`for range`) until the batch is done, or runs continuously (`for {}`) until an emergency stop button (`break`) is pressed.",
    "bullets": [
      "`for` is the ONLY looping keyword in Go (no `while` or `do-while`).",
      "Four flavors: classic counting `for i := 0; i < N; i++`, condition-only `for ok`, infinite `for {}`, and collection iteration `for index, value := range collection`.",
      "In Go 1.22+, loop iteration variables are created fresh per iteration, preventing closure capture bugs."
    ],
    "mentalModel": "1. Classic:   for i := 0; i < 5; i++ { ... }\n2. While:     for condition { ... }\n3. Infinite:  for { if stop { break } }\n4. Range:     for idx, val := range slice { ... }",
    "sections": [
      {
        "title": "1. The Four Flavors of for",
        "explanation": "Because Go has no `while` keyword, `for` handles every loop use case with clean syntax:",
        "code": "// 1. Classic Counter\nfor i := 0; i < 3; i++ {\n    fmt.Println(\"Count:\", i)\n}\n\n// 2. While-style\nn := 1\nfor n < 100 {\n    n *= 2\n}\n\n// 3. Range over Slice\nfruits := []string{\"Apple\", \"Banana\", \"Cherry\"}\nfor idx, fruit := range fruits {\n    fmt.Printf(\"%d: %s\\n\", idx, fruit)\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Using `_` when you only want the index in `for i := range items`.",
        "fix": "If you only provide one variable in `for i := range items`, Go gives you the INDEX. If you want only the value, write `for _, val := range items`."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "How many different looping keywords exist in the Go language?",
        "choices": [
          "3 (for, while, do)",
          "1 (for)",
          "2 (for, while)",
          "4 (for, foreach, while, loop)"
        ],
        "answer": 1,
        "explanation": "Go has only one looping keyword: `for`."
      }
    ]
  },
  {
    "slug": "error-handling",
    "title": "Error Handling",
    "levelId": "L2",
    "levelBadge": "🟠 Level 2 — Flow Control",
    "category": "Flow Control",
    "summary": "Master explicit error returns, custom error types, error wrapping with %w, and inspection with errors.Is and errors.As.",
    "analogy": "Imagine ordering a package online: instead of the delivery truck silently crashing (exceptions), the driver hands you two boxes at your door: your item, and a status sheet. If the status sheet says \"Damaged in transit\", you handle it right there.",
    "bullets": [
      "Errors are normal values that implement the `error` interface (`Error() string`).",
      "Functions return errors as the final return value: `result, err := doSomething()`.",
      "Wrap errors with context using `fmt.Errorf(\"reading config failed: %w\", err)`.",
      "`errors.Is()` checks for specific sentinel errors, `errors.As()` extracts specific custom error types."
    ],
    "mentalModel": "[Function Call] ──> Returns (Data, error)\n                           │\n                           ├── If error != nil ──> Handle/Log/Wrap & Return\n                           └── If error == nil ──> Proceed safely with Data",
    "sections": [
      {
        "title": "1. Idiomatic Error Returns and Wrapping",
        "explanation": "Go favors explicit, visible error handling over invisible exception bubbling:",
        "code": "package main\n\nimport (\n    \"errors\"\n    \"fmt\"\n)\n\nvar ErrUserNotFound = errors.New(\"user not found\")\n\nfunc findUser(id int) (string, error) {\n    if id != 42 {\n        return \"\", fmt.Errorf(\"lookup id %d: %w\", id, ErrUserNotFound)\n    }\n    return \"Alice\", nil\n}\n\nfunc main() {\n    _, err := findUser(99)\n    if err != nil {\n        if errors.Is(err, ErrUserNotFound) {\n            fmt.Println(\"Handled missing user safely!\")\n        }\n        fmt.Println(\"Full error chain:\", err)\n    }\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Ignoring returned errors by assigning them to blank identifier `val, _ := compute()`.",
        "fix": "Never discard errors in production code! Always check `if err != nil`."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "Which formatting verb wraps an error so it can be unpacked by `errors.Is()`?",
        "choices": [
          "%v",
          "%s",
          "%w",
          "%e"
        ],
        "answer": 2,
        "explanation": "`%w` in `fmt.Errorf` wraps an error inside an inspectable wrapper."
      }
    ]
  },
  {
    "slug": "functions",
    "title": "Functions & Multiple Returns",
    "levelId": "L3",
    "levelBadge": "🔵 Level 3 — Functions",
    "category": "Functions",
    "summary": "Declaring functions, parameters, multiple return values, named returns, and variadic arguments.",
    "analogy": "A vending machine with a dual-tray slot: you input money, and it drops your snack in tray 1 and your receipt/change in tray 2 at the exact same moment.",
    "bullets": [
      "Functions can return multiple values simultaneously.",
      "Variadic functions (`...T`) accept arbitrary numbers of arguments.",
      "First-class citizens: can be assigned to variables and passed to other functions."
    ],
    "sections": [
      {
        "title": "1. Understanding Functions & Multiple Returns",
        "explanation": "Declaring functions, parameters, multiple return values, named returns, and variadic arguments. In Go, functions & multiple returns is designed around clarity and high runtime efficiency.",
        "code": "func divide(a, b float64) (float64, error) {\n    if b == 0 { return 0, errors.New(\"cannot divide by zero\") }\n    return a / b, nil\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing functions & multiple returns without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Functions & Multiple Returns?",
        "choices": [
          "Functions can return multiple values simultaneously.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Functions can return multiple values simultaneously."
      }
    ]
  },
  {
    "slug": "anonymous-and-closures",
    "title": "Anonymous Functions & Closures",
    "levelId": "L3",
    "levelBadge": "🔵 Level 3 — Functions",
    "category": "Functions",
    "summary": "Functions declared inline and closures that capture variables from their outer environment.",
    "analogy": "A hiker backpack: when you create a closure function inside another function, it packs all local variables into its backpack and carries them with it wherever it travels.",
    "bullets": [
      "Anonymous functions have no name and can be executed inline: `func() { ... }()`",
      "Closures capture and retain references to variables in enclosing scopes.",
      "Commonly used in HTTP middleware and concurrent worker pools."
    ],
    "sections": [
      {
        "title": "1. Understanding Anonymous Functions & Closures",
        "explanation": "Functions declared inline and closures that capture variables from their outer environment. In Go, anonymous functions & closures is designed around clarity and high runtime efficiency.",
        "code": "func makeCounter() func() int {\n    count := 0\n    return func() int {\n        count++\n        return count\n    }\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing anonymous functions & closures without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Anonymous Functions & Closures?",
        "choices": [
          "Anonymous functions have no name and can be executed inline: `func() { ... }()`",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Anonymous functions have no name and can be executed inline: `func() { ... }()`"
      }
    ]
  },
  {
    "slug": "defer-panic-recover",
    "title": "Defer, Panic, and Recover",
    "levelId": "L3",
    "levelBadge": "🔵 Level 3 — Functions",
    "category": "Functions",
    "summary": "Guaranteed cleanup with defer (LIFO order), handling unrecoverable panics, and recovering safely.",
    "analogy": "`defer` is a sticky note on your front door: \"Lock the door when leaving\". No matter which way you exit the room, the sticky note instruction executes right before you step outside.",
    "bullets": [
      "`defer` runs guaranteed cleanup logic right before the enclosing function returns.",
      "Multiple deferred calls execute in Last-In, First-Out (LIFO) order.",
      "`recover()` catches active panics inside a deferred function."
    ],
    "sections": [
      {
        "title": "1. Understanding Defer, Panic, and Recover",
        "explanation": "Guaranteed cleanup with defer (LIFO order), handling unrecoverable panics, and recovering safely. In Go, defer, panic, and recover is designed around clarity and high runtime efficiency.",
        "code": "func readFile(path string) {\n    f, _ := os.Open(path)\n    defer f.Close() // Guaranteed to close when readFile returns!\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing defer, panic, and recover without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Defer, Panic, and Recover?",
        "choices": [
          "`defer` runs guaranteed cleanup logic right before the enclosing function returns.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`defer` runs guaranteed cleanup logic right before the enclosing function returns."
      }
    ]
  },
  {
    "slug": "arrays",
    "title": "Arrays (Fixed Size)",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Fixed-length sequential blocks of memory with value-copy semantics.",
    "analogy": "A 12-slot egg carton: the size is fixed at manufacture. You cannot fit 13 eggs in a 12-egg carton, and passing the carton to a friend copies all 12 eggs.",
    "bullets": [
      "Fixed length is part of the type signature: `[5]int` is distinct from `[10]int`.",
      "Value semantics: assigning copies the entire memory block.",
      "Serves as the underlying backing storage for dynamic slices."
    ],
    "sections": [
      {
        "title": "1. Understanding Arrays (Fixed Size)",
        "explanation": "Fixed-length sequential blocks of memory with value-copy semantics. In Go, arrays (fixed size) is designed around clarity and high runtime efficiency.",
        "code": "var scores [3]int = [3]int{90, 85, 95}\nb := scores // Copies all 3 integers!"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing arrays (fixed size) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Arrays (Fixed Size)?",
        "choices": [
          "Fixed length is part of the type signature: `[5]int` is distinct from `[10]int`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Fixed length is part of the type signature: `[5]int` is distinct from `[10]int`."
      }
    ]
  },
  {
    "slug": "slices",
    "title": "Slices (Dynamic Arrays)",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Dynamic views into backing arrays: pointer, length, capacity, and automatic growth.",
    "analogy": "A camera viewfinder sliding over a panorama photo. The viewfinder has a starting pointer, a current view width (length), and a max frame limit (capacity).",
    "bullets": [
      "Slice header is a 24-byte struct: `*array`, `len`, and `cap`.",
      "`append()` automatically allocates a larger backing array when capacity is exceeded.",
      "Sub-slicing shares the same underlying array memory."
    ],
    "sections": [
      {
        "title": "1. Understanding Slices (Dynamic Arrays)",
        "explanation": "Dynamic views into backing arrays: pointer, length, capacity, and automatic growth. In Go, slices (dynamic arrays) is designed around clarity and high runtime efficiency.",
        "code": "// 24-byte Slice Header: [ Data Pointer | Len: 2 | Cap: 4 ]\ns := make([]int, 2, 4)\ns = append(s, 10, 20) // Appends in-place without reallocation!"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing slices (dynamic arrays) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Slices (Dynamic Arrays)?",
        "choices": [
          "Slice header is a 24-byte struct: `*array`, `len`, and `cap`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Slice header is a 24-byte struct: `*array`, `len`, and `cap`."
      }
    ]
  },
  {
    "slug": "maps",
    "title": "Maps (Hash Tables)",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Key-value associative hash tables with O(1) average lookups and comma-ok syntax.",
    "analogy": "A hotel concierge desk: you give a room guest name (key), and they hand you the room key (value) instantly without searching room by room.",
    "bullets": [
      "Key types must be comparable (support `==`).",
      "Comma-ok idiom `val, ok := m[key]` tests if a key exists.",
      "Unordered iteration: Go randomizes map iteration order by design.",
      "Writing to a nil map triggers a panic; initialize with `make(map[K]V)`."
    ],
    "sections": [
      {
        "title": "1. Understanding Maps (Hash Tables)",
        "explanation": "Key-value associative hash tables with O(1) average lookups and comma-ok syntax. In Go, maps (hash tables) is designed around clarity and high runtime efficiency.",
        "code": "ages := make(map[string]int)\nages[\"Alice\"] = 30\nif age, exists := ages[\"Bob\"]; !exists {\n    fmt.Println(\"Bob is not in the map\")\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing maps (hash tables) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Maps (Hash Tables)?",
        "choices": [
          "Key types must be comparable (support `==`).",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Key types must be comparable (support `==`)."
      }
    ]
  },
  {
    "slug": "structs",
    "title": "Structs & Composition",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Grouping related data fields, struct tags for JSON/DB serialization, and composition via embedding.",
    "analogy": "A passport: contains labeled fields (Name, Birthdate, Country). Embedding is like stamping a Visa inside the passport — all visa permissions are attached directly to your passport.",
    "bullets": [
      "Primary building block for custom data structures in Go.",
      "Composition over inheritance: embed structs to promote inner fields.",
      "Struct tags (e.g. `json:\"id\"`) guide serialization reflection."
    ],
    "sections": [
      {
        "title": "1. Understanding Structs & Composition",
        "explanation": "Grouping related data fields, struct tags for JSON/DB serialization, and composition via embedding. In Go, structs & composition is designed around clarity and high runtime efficiency.",
        "code": "type User struct {\n    ID    int    `json:\"id\"`\n    Email string `json:\"email\"`\n}\n\ntype Admin struct {\n    User  // Embedded struct (Composition)\n    Level int `json:\"level\"`\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing structs & composition without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Structs & Composition?",
        "choices": [
          "Primary building block for custom data structures in Go.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Primary building block for custom data structures in Go."
      }
    ]
  },
  {
    "slug": "pointers",
    "title": "Pointers & Memory Addresses",
    "levelId": "L4",
    "levelBadge": "🟣 Level 4 — Composite Data",
    "category": "Memory & Types",
    "summary": "Direct memory references with & (address-of) and * (dereference) without unsafe pointer arithmetic.",
    "analogy": "A GPS coordinate written on a piece of paper. Instead of shipping your entire physical house to a friend, you hand them the GPS coordinates so they can visit and update the house.",
    "bullets": [
      "`&x` gets the memory address of variable `x`.",
      "`*p` reads or mutates the value stored at address `p`.",
      "Safe Go forbids pointer arithmetic (no `p++`).",
      "Passing pointers avoids copying large structs and enables mutation in functions."
    ],
    "sections": [
      {
        "title": "1. Understanding Pointers & Memory Addresses",
        "explanation": "Direct memory references with & (address-of) and * (dereference) without unsafe pointer arithmetic. In Go, pointers & memory addresses is designed around clarity and high runtime efficiency.",
        "code": "type Account struct { Balance int }\n\nfunc deposit(acc *Account, amount int) {\n    acc.Balance += amount // Modifies the original account in place!\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing pointers & memory addresses without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Pointers & Memory Addresses?",
        "choices": [
          "`&x` gets the memory address of variable `x`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`&x` gets the memory address of variable `x`."
      }
    ]
  },
  {
    "slug": "methods",
    "title": "Methods (Receivers)",
    "levelId": "L5",
    "levelBadge": "🔴 Level 5 — Methods & Interfaces",
    "category": "Methods & Interfaces",
    "summary": "Attaching functions to user-defined types using value and pointer receivers.",
    "analogy": "Giving a car an accelerator pedal. The method `Car.Accelerate()` belongs to the car type and updates its speedometer.",
    "bullets": [
      "Pointer receiver `func (c *Car) Accelerate()` can mutate struct state.",
      "Value receiver `func (c Car) Speed()` operates on a read-only copy.",
      "Methods can be defined on any named type in the same package."
    ],
    "sections": [
      {
        "title": "1. Understanding Methods (Receivers)",
        "explanation": "Attaching functions to user-defined types using value and pointer receivers. In Go, methods (receivers) is designed around clarity and high runtime efficiency.",
        "code": "type User struct { Name string }\n\nfunc (u *User) SetName(name string) {\n    u.Name = name // Mutates caller\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing methods (receivers) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Methods (Receivers)?",
        "choices": [
          "Pointer receiver `func (c *Car) Accelerate()` can mutate struct state.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Pointer receiver `func (c *Car) Accelerate()` can mutate struct state."
      }
    ]
  },
  {
    "slug": "interfaces",
    "title": "Interfaces (Duck Typing)",
    "levelId": "L5",
    "levelBadge": "🔴 Level 5 — Methods & Interfaces",
    "category": "Methods & Interfaces",
    "summary": "Implicit interface implementation, interface values (itab + data pointer), and the `any` type.",
    "analogy": "A universal electrical wall socket. Any device that has the matching 3-prong plug gets electricity — the wall socket does not care if it is a lamp, laptop, or refrigerator.",
    "bullets": [
      "Implicit implementation: if a type defines all methods of an interface, it automatically implements it (no `implements` keyword!).",
      "Represented under the hood as `(type descriptor itab, data pointer)`.",
      "`any` (`interface{}`) represents any type in Go."
    ],
    "sections": [
      {
        "title": "1. Understanding Interfaces (Duck Typing)",
        "explanation": "Implicit interface implementation, interface values (itab + data pointer), and the `any` type. In Go, interfaces (duck typing) is designed around clarity and high runtime efficiency.",
        "code": "type Greeter interface {\n    Greet() string\n}\n\ntype Robot struct{}\nfunc (r Robot) Greet() string { return \"Beep Boop!\" }"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing interfaces (duck typing) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Interfaces (Duck Typing)?",
        "choices": [
          "Implicit implementation: if a type defines all methods of an interface, it automatically implements it (no `implements` keyword!).",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Implicit implementation: if a type defines all methods of an interface, it automatically implements it (no `implements` keyword!)."
      }
    ]
  },
  {
    "slug": "embedding-interfaces",
    "title": "Embedding Interfaces",
    "levelId": "L5",
    "levelBadge": "🔴 Level 5 — Methods & Interfaces",
    "category": "Methods & Interfaces",
    "summary": "Composing larger interfaces by combining smaller single-method interfaces.",
    "analogy": "Snapping Lego blocks together: combining a `Reader` block and a `Writer` block to build a `ReadWriter` super-tool.",
    "bullets": [
      "Standard library idiomatic pattern: keep interfaces tiny (1-2 methods).",
      "`io.ReadWriter` is composed of `io.Reader` and `io.Writer`.",
      "Allows consumers to accept only the exact interface contract they need."
    ],
    "sections": [
      {
        "title": "1. Understanding Embedding Interfaces",
        "explanation": "Composing larger interfaces by combining smaller single-method interfaces. In Go, embedding interfaces is designed around clarity and high runtime efficiency.",
        "code": "type Reader interface { Read(p []byte) (n int, err error) }\ntype Writer interface { Write(p []byte) (n int, err error) }\n\ntype ReadWriter interface {\n    Reader\n    Writer\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing embedding interfaces without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Embedding Interfaces?",
        "choices": [
          "Standard library idiomatic pattern: keep interfaces tiny (1-2 methods).",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Standard library idiomatic pattern: keep interfaces tiny (1-2 methods)."
      }
    ]
  },
  {
    "slug": "polymorphism",
    "title": "Polymorphism in Go",
    "levelId": "L5",
    "levelBadge": "🔴 Level 5 — Methods & Interfaces",
    "category": "Methods & Interfaces",
    "summary": "Decoupling business logic from concrete implementations to allow seamless testing and swapping.",
    "analogy": "A universal TV remote control with a \"Power\" button that works seamlessly whether pointed at a Samsung, Sony, or LG television.",
    "bullets": [
      "Pass interfaces as function parameters, return concrete structs.",
      "Enables painless mocking in unit tests without complex mocking frameworks.",
      "Clean separation between business rules and storage/API adapters."
    ],
    "sections": [
      {
        "title": "1. Understanding Polymorphism in Go",
        "explanation": "Decoupling business logic from concrete implementations to allow seamless testing and swapping. In Go, polymorphism in go is designed around clarity and high runtime efficiency.",
        "code": "type Notifier interface { Send(msg string) error }\n\nfunc AlertTeam(n Notifier, msg string) {\n    n.Send(msg) // Works with Email, Slack, SMS, or MockNotifier!\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing polymorphism in go without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Polymorphism in Go?",
        "choices": [
          "Pass interfaces as function parameters, return concrete structs.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Pass interfaces as function parameters, return concrete structs."
      }
    ]
  },
  {
    "slug": "stack-vs-heap",
    "title": "Stack vs Heap & Escape Analysis",
    "levelId": "L6",
    "levelBadge": "⚫ Level 6 — Memory Model",
    "category": "Memory Model",
    "summary": "How the compiler decides between fast automatic stack allocations and garbage-collected heap allocations.",
    "analogy": "Stack memory is a pad of sticky notes on your desk: instant to write on, torn off and recycled the moment you finish. Heap is the long-term warehouse storage room.",
    "bullets": [
      "Stack allocations cost almost 0 CPU cycles and are cleaned up on function return.",
      "Heap allocations require Garbage Collector tracking.",
      "Compiler Escape Analysis (`go build -gcflags=\"-m\"`) determines where memory lives."
    ],
    "sections": [
      {
        "title": "1. Understanding Stack vs Heap & Escape Analysis",
        "explanation": "How the compiler decides between fast automatic stack allocations and garbage-collected heap allocations. In Go, stack vs heap & escape analysis is designed around clarity and high runtime efficiency.",
        "code": "func makeOnStack() int {\n    x := 42\n    return x // Stack allocated (copied by value)\n}\n\nfunc makeOnHeap() *int {\n    x := 42\n    return &x // Escapes to Heap! (Pointer outlives function)\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing stack vs heap & escape analysis without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Stack vs Heap & Escape Analysis?",
        "choices": [
          "Stack allocations cost almost 0 CPU cycles and are cleaned up on function return.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Stack allocations cost almost 0 CPU cycles and are cleaned up on function return."
      }
    ]
  },
  {
    "slug": "garbage-collector",
    "title": "Garbage Collector (Tri-color)",
    "levelId": "L6",
    "levelBadge": "⚫ Level 6 — Memory Model",
    "category": "Memory Model",
    "summary": "Concurrent tri-color mark-and-sweep GC providing sub-millisecond stop-the-world pauses.",
    "analogy": "A team of janitors cleaning an office building while workers are working: they tag active desks with color badges (White, Grey, Black) and recycle unreferenced desks in the background.",
    "bullets": [
      "Runs concurrently with your application goroutines.",
      "STW (Stop-The-World) pauses are typically under 1 millisecond.",
      "Tuned via `GOGC` environment variable (default 100)."
    ],
    "sections": [
      {
        "title": "1. Understanding Garbage Collector (Tri-color)",
        "explanation": "Concurrent tri-color mark-and-sweep GC providing sub-millisecond stop-the-world pauses. In Go, garbage collector (tri-color) is designed around clarity and high runtime efficiency.",
        "code": "// GOGC=100 triggers GC when heap doubles\n// GOMEMLIMIT sets hard memory ceiling in modern Go"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing garbage collector (tri-color) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Garbage Collector (Tri-color)?",
        "choices": [
          "Runs concurrently with your application goroutines.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Runs concurrently with your application goroutines."
      }
    ]
  },
  {
    "slug": "alignment-and-padding",
    "title": "Memory Alignment & Struct Padding",
    "levelId": "L6",
    "levelBadge": "⚫ Level 6 — Memory Model",
    "category": "Memory Model",
    "summary": "Optimizing struct memory layout by ordering fields from largest to smallest.",
    "analogy": "Packing suitcases into a shelf with fixed 8-inch slots. Placing small items next to large ones without planning leaves empty gap padding.",
    "bullets": [
      "CPUs read memory in 4-byte or 8-byte word boundaries.",
      "Misaligned fields cause compiler padding bytes.",
      "Organize struct fields from largest size (8 bytes) to smallest (1 byte) to save memory."
    ],
    "sections": [
      {
        "title": "1. Understanding Memory Alignment & Struct Padding",
        "explanation": "Optimizing struct memory layout by ordering fields from largest to smallest. In Go, memory alignment & struct padding is designed around clarity and high runtime efficiency.",
        "code": "// ❌ Takes 24 bytes (with padding gaps):\ntype Bad struct { a bool; b int64; c bool }\n\n// ✅ Takes 16 bytes (packed tightly):\ntype Good struct { b int64; a bool; c bool }"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing memory alignment & struct padding without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Memory Alignment & Struct Padding?",
        "choices": [
          "CPUs read memory in 4-byte or 8-byte word boundaries.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "CPUs read memory in 4-byte or 8-byte word boundaries."
      }
    ]
  },
  {
    "slug": "zero-copy",
    "title": "Zero-Copy Techniques",
    "levelId": "L6",
    "levelBadge": "⚫ Level 6 — Memory Model",
    "category": "Memory Model",
    "summary": "High-throughput data processing by sharing memory buffers across slices without allocations.",
    "analogy": "Reading a book directly off the library shelf instead of photocopying every page before reading it.",
    "bullets": [
      "Sub-slicing existing byte buffers avoids allocating new heap memory.",
      "`unsafe.String` and `unsafe.SliceData` convert between strings and byte slices with zero copies."
    ],
    "sections": [
      {
        "title": "1. Understanding Zero-Copy Techniques",
        "explanation": "High-throughput data processing by sharing memory buffers across slices without allocations. In Go, zero-copy techniques is designed around clarity and high runtime efficiency.",
        "code": "// Zero-allocation sub-slice:\nheader := buffer[:16]\npayload := buffer[16:]"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing zero-copy techniques without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Zero-Copy Techniques?",
        "choices": [
          "Sub-slicing existing byte buffers avoids allocating new heap memory.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Sub-slicing existing byte buffers avoids allocating new heap memory."
      }
    ]
  },
  {
    "slug": "goroutines",
    "title": "Goroutines (Lightweight Threads)",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Asynchronous user-space threads multiplexed onto OS threads by the Go runtime.",
    "analogy": "Instead of hiring a 10-ton industrial crane (OS Thread) for every small brick, Go creates thousands of origami paper workers (Goroutines) that start in 2 Kilobytes of memory.",
    "bullets": [
      "Spawned simply by adding `go` keyword before a function call: `go doTask()`.",
      "Initial stack is only 2 KB (grows and shrinks dynamically).",
      "A single Go process can effortlessly run hundreds of thousands of concurrent goroutines."
    ],
    "sections": [
      {
        "title": "1. Understanding Goroutines (Lightweight Threads)",
        "explanation": "Asynchronous user-space threads multiplexed onto OS threads by the Go runtime. In Go, goroutines (lightweight threads) is designed around clarity and high runtime efficiency.",
        "code": "func fetch(url string) {\n    fmt.Println(\"Fetched:\", url)\n}\n\nfunc main() {\n    go fetch(\"https://example.com\") // Runs in background!\n    time.Sleep(100 * time.Millisecond)\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing goroutines (lightweight threads) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Goroutines (Lightweight Threads)?",
        "choices": [
          "Spawned simply by adding `go` keyword before a function call: `go doTask()`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Spawned simply by adding `go` keyword before a function call: `go doTask()`."
      }
    ]
  },
  {
    "slug": "channels",
    "title": "Channels (Pipes)",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Thread-safe communication pipelines between concurrent goroutines.",
    "analogy": "A pneumatic tube system in an office: drop a container tube in, and it whooshes across the room directly into the receiver hands without anyone sharing desks.",
    "bullets": [
      "\"Do not communicate by sharing memory; instead, share memory by communicating.\"",
      "Unbuffered channels (`make(chan int)`) block until both sender and receiver are ready (rendezvous).",
      "Buffered channels (`make(chan int, 5)`) hold items up to capacity before blocking."
    ],
    "sections": [
      {
        "title": "1. Understanding Channels (Pipes)",
        "explanation": "Thread-safe communication pipelines between concurrent goroutines. In Go, channels (pipes) is designed around clarity and high runtime efficiency.",
        "code": "ch := make(chan string)\n\ngo func() {\n    ch <- \"Task Completed!\" // Send\n}()\n\nmsg := <-ch // Receive (blocks until ready)\nfmt.Println(msg)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing channels (pipes) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Channels (Pipes)?",
        "choices": [
          "\"Do not communicate by sharing memory; instead, share memory by communicating.\"",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "\"Do not communicate by sharing memory; instead, share memory by communicating.\""
      }
    ]
  },
  {
    "slug": "select",
    "title": "Select (Channel Multiplexing)",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Listening to multiple channels simultaneously with timeouts and non-blocking default cases.",
    "analogy": "A 911 emergency operator with 5 phone lines lit up: the operator answers whichever line rings first, or takes a quick action if all lines are idle.",
    "bullets": [
      "Blocks until one of its channel cases is ready to send or receive.",
      "`default` case executes immediately if no channel is ready (non-blocking).",
      "If multiple channels are ready, Go picks one at random with fair distribution."
    ],
    "sections": [
      {
        "title": "1. Understanding Select (Channel Multiplexing)",
        "explanation": "Listening to multiple channels simultaneously with timeouts and non-blocking default cases. In Go, select (channel multiplexing) is designed around clarity and high runtime efficiency.",
        "code": "select {\ncase msg := <-ch1:\n    fmt.Println(\"Received from ch1:\", msg)\ncase msg := <-ch2:\n    fmt.Println(\"Received from ch2:\", msg)\ncase <-time.After(1 * time.Second):\n    fmt.Println(\"Timed out!\")\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing select (channel multiplexing) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Select (Channel Multiplexing)?",
        "choices": [
          "Blocks until one of its channel cases is ready to send or receive.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Blocks until one of its channel cases is ready to send or receive."
      }
    ]
  },
  {
    "slug": "sync-primitives",
    "title": "Sync Primitives (Mutex & WaitGroup)",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Low-level synchronization tools: Mutex, RWMutex, WaitGroup, Once, and Pool.",
    "analogy": "`sync.Mutex` is the key to a single-occupancy airplane bathroom. Only one person holds the key; everyone else waits in line until the door unlocks.",
    "bullets": [
      "`sync.Mutex` (`Lock()` / `Unlock()`) protects shared state against concurrent data races.",
      "`sync.WaitGroup` (`Add()`, `Done()`, `Wait()`) blocks until a group of goroutines finish.",
      "`sync.Pool` reuses memory objects to reduce garbage collection load."
    ],
    "sections": [
      {
        "title": "1. Understanding Sync Primitives (Mutex & WaitGroup)",
        "explanation": "Low-level synchronization tools: Mutex, RWMutex, WaitGroup, Once, and Pool. In Go, sync primitives (mutex & waitgroup) is designed around clarity and high runtime efficiency.",
        "code": "var wg sync.WaitGroup\nfor i := 0; i < 3; i++ {\n    wg.Add(1)\n    go func(id int) {\n        defer wg.Done()\n        fmt.Println(\"Worker\", id, \"done\")\n    }(i)\n}\nwg.Wait() // Waits for all 3 workers!"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing sync primitives (mutex & waitgroup) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Sync Primitives (Mutex & WaitGroup)?",
        "choices": [
          "`sync.Mutex` (`Lock()` / `Unlock()`) protects shared state against concurrent data races.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`sync.Mutex` (`Lock()` / `Unlock()`) protects shared state against concurrent data races."
      }
    ]
  },
  {
    "slug": "context",
    "title": "Context (Timeouts & Cancellation)",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Propagating cancellation signals, deadlines, and request-scoped metadata across API layers.",
    "analogy": "A mission commander with a red abort button. If the mission timer expires, pressing the abort button sends an instant cancel signal to all agents in the field.",
    "bullets": [
      "Always pass `ctx context.Context` as the first argument of functions performing I/O.",
      "`context.WithTimeout()` cancels operations that exceed time limits.",
      "Prevents wasted server CPU on abandoned HTTP client requests."
    ],
    "sections": [
      {
        "title": "1. Understanding Context (Timeouts & Cancellation)",
        "explanation": "Propagating cancellation signals, deadlines, and request-scoped metadata across API layers. In Go, context (timeouts & cancellation) is designed around clarity and high runtime efficiency.",
        "code": "ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)\ndefer cancel()\n\nreq, _ := http.NewRequestWithContext(ctx, \"GET\", \"https://api.com\", nil)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing context (timeouts & cancellation) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Context (Timeouts & Cancellation)?",
        "choices": [
          "Always pass `ctx context.Context` as the first argument of functions performing I/O.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Always pass `ctx context.Context` as the first argument of functions performing I/O."
      }
    ]
  },
  {
    "slug": "scheduler-gmp",
    "title": "The GMP Scheduler Model",
    "levelId": "L7",
    "levelBadge": "🟤 Level 7 — Runtime & Concurrency",
    "category": "Concurrency",
    "summary": "Inside the Go runtime M:N scheduler: Goroutines (G), Machines (M), and Processors (P).",
    "analogy": "A restaurant kitchen: G = Customer Orders (Goroutines), P = Cooking Stations with work queues, M = Chefs/Cooks (OS Threads) executing recipes.",
    "bullets": [
      "G (Goroutine), M (OS Thread), P (Logical Context bound to GOMAXPROCS CPU cores).",
      "Work-stealing: idle Processors steal goroutines from busy processors to balance load.",
      "Sysmon runtime thread preempts long-running goroutines cooperatively."
    ],
    "sections": [
      {
        "title": "1. Understanding The GMP Scheduler Model",
        "explanation": "Inside the Go runtime M:N scheduler: Goroutines (G), Machines (M), and Processors (P). In Go, the gmp scheduler model is designed around clarity and high runtime efficiency.",
        "code": "// GOMAXPROCS sets number of P contexts (defaults to CPU core count)\nruntime.GOMAXPROCS(runtime.NumCPU())"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing the gmp scheduler model without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind The GMP Scheduler Model?",
        "choices": [
          "G (Goroutine), M (OS Thread), P (Logical Context bound to GOMAXPROCS CPU cores).",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "G (Goroutine), M (OS Thread), P (Logical Context bound to GOMAXPROCS CPU cores)."
      }
    ]
  },
  {
    "slug": "generics",
    "title": "Generics (Type Parameters)",
    "levelId": "L8",
    "levelBadge": "🟩 Level 8 — Advanced Types",
    "category": "Advanced Types",
    "summary": "Writing reusable, type-safe data structures and algorithms without `any` casting.",
    "analogy": "A universal blender container that can blend apples, oranges, or protein powder with 100% type safety without needing 3 separate blenders.",
    "bullets": [
      "Syntax: `func Map[T any, R any](s []T, f func(T) R) []R`.",
      "`comparable` constraint allows using `==` and `!=`.",
      "Tilde operator `~int` matches custom types whose underlying type is `int`."
    ],
    "sections": [
      {
        "title": "1. Understanding Generics (Type Parameters)",
        "explanation": "Writing reusable, type-safe data structures and algorithms without `any` casting. In Go, generics (type parameters) is designed around clarity and high runtime efficiency.",
        "code": "func Min[T int | float64](a, b T) T {\n    if a < b { return a }\n    return b\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing generics (type parameters) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Generics (Type Parameters)?",
        "choices": [
          "Syntax: `func Map[T any, R any](s []T, f func(T) R) []R`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Syntax: `func Map[T any, R any](s []T, f func(T) R) []R`."
      }
    ]
  },
  {
    "slug": "type-aliases",
    "title": "Type Aliases vs Defined Types",
    "levelId": "L8",
    "levelBadge": "🟩 Level 8 — Advanced Types",
    "category": "Advanced Types",
    "summary": "Refactoring large codebases and gradual migration with `type T = Original`.",
    "analogy": "A nickname for your friend. \"Bob\" and \"Robert\" refer to the exact same physical person with the exact same identity.",
    "bullets": [
      "`type UserID = string` creates an exact alias (shares method set).",
      "`type UserID string` creates a brand new distinct type (cannot be assigned without conversion)."
    ],
    "sections": [
      {
        "title": "1. Understanding Type Aliases vs Defined Types",
        "explanation": "Refactoring large codebases and gradual migration with `type T = Original`. In Go, type aliases vs defined types is designed around clarity and high runtime efficiency.",
        "code": "type ID = string // Alias (identical)\ntype CustomID string // Defined type (distinct type)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing type aliases vs defined types without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Type Aliases vs Defined Types?",
        "choices": [
          "`type UserID = string` creates an exact alias (shares method set).",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`type UserID = string` creates an exact alias (shares method set)."
      }
    ]
  },
  {
    "slug": "custom-types",
    "title": "Custom Defined Types",
    "levelId": "L8",
    "levelBadge": "🟩 Level 8 — Advanced Types",
    "category": "Advanced Types",
    "summary": "Creating domain-specific types to enforce compile-time safety and attach methods.",
    "analogy": "Currency units: creating `type USD int` and `type EUR int` ensures you never accidentally add dollars and euros together without converting.",
    "bullets": [
      "Prevents accidental argument swapping in functions: `createUser(id UserID, role Role)`.",
      "Attach custom `String()` methods to implement `fmt.Stringer`."
    ],
    "sections": [
      {
        "title": "1. Understanding Custom Defined Types",
        "explanation": "Creating domain-specific types to enforce compile-time safety and attach methods. In Go, custom defined types is designed around clarity and high runtime efficiency.",
        "code": "type Celsius float64\ntype Fahrenheit float64\n\nfunc (c Celsius) ToFahrenheit() Fahrenheit {\n    return Fahrenheit(c*9/5 + 32)\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing custom defined types without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Custom Defined Types?",
        "choices": [
          "Prevents accidental argument swapping in functions: `createUser(id UserID, role Role)`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Prevents accidental argument swapping in functions: `createUser(id UserID, role Role)`."
      }
    ]
  },
  {
    "slug": "file-handling",
    "title": "File Handling & Streams",
    "levelId": "L9",
    "levelBadge": "🟧 Level 9 — File I/O & Systems",
    "category": "Systems & I/O",
    "summary": "Reading, writing, and streaming large files efficiently using os, io, and bufio.",
    "analogy": "Drinking water through a straw (`io.Reader` stream) rather than trying to swallow the entire water tank into your mouth at once.",
    "bullets": [
      "`io.Reader` and `io.Writer` are the universal streaming interfaces in Go.",
      "`bufio.Scanner` reads files line-by-line with minimal memory usage.",
      "`os.ReadFile` and `os.WriteFile` provide quick one-liner helpers for small files."
    ],
    "sections": [
      {
        "title": "1. Understanding File Handling & Streams",
        "explanation": "Reading, writing, and streaming large files efficiently using os, io, and bufio. In Go, file handling & streams is designed around clarity and high runtime efficiency.",
        "code": "f, err := os.Open(\"data.txt\")\nif err != nil { return }\ndefer f.Close()\n\nscanner := bufio.NewScanner(f)\nfor scanner.Scan() {\n    fmt.Println(scanner.Text())\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing file handling & streams without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind File Handling & Streams?",
        "choices": [
          "`io.Reader` and `io.Writer` are the universal streaming interfaces in Go.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`io.Reader` and `io.Writer` are the universal streaming interfaces in Go."
      }
    ]
  },
  {
    "slug": "networking",
    "title": "Networking & HTTP Services",
    "levelId": "L9",
    "levelBadge": "🟧 Level 9 — File I/O & Systems",
    "category": "Systems & I/O",
    "summary": "Building high-performance HTTP servers, clients, and custom middleware chains.",
    "analogy": "A postal sorting station: accepting incoming mail envelopes (HTTP requests), validating addresses (routing), and dispatching reply envelopes (HTTP responses).",
    "bullets": [
      "`net/http` standard library is production-grade out of the box.",
      "Middleware pattern wraps `http.Handler` for auth, logging, and metrics.",
      "Supports HTTP/2 and HTTP/3 with automatic TLS."
    ],
    "sections": [
      {
        "title": "1. Understanding Networking & HTTP Services",
        "explanation": "Building high-performance HTTP servers, clients, and custom middleware chains. In Go, networking & http services is designed around clarity and high runtime efficiency.",
        "code": "http.HandleFunc(\"/hello\", func(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprintf(w, \"Hello, %s!\", r.URL.Query().Get(\"name\"))\n})\nhttp.ListenAndServe(\":8080\", nil)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing networking & http services without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Networking & HTTP Services?",
        "choices": [
          "`net/http` standard library is production-grade out of the box.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`net/http` standard library is production-grade out of the box."
      }
    ]
  },
  {
    "slug": "encoding",
    "title": "Encoding & Serialization (JSON)",
    "levelId": "L9",
    "levelBadge": "🟧 Level 9 — File I/O & Systems",
    "category": "Systems & I/O",
    "summary": "Converting structs to JSON and decoding streams with encoding/json.",
    "analogy": "A universal language translator converting living Go objects into text subtitles (JSON) for network transmission.",
    "bullets": [
      "`json.Marshal` converts structs to JSON bytes.",
      "`json.Unmarshal` parses JSON bytes into a struct pointer.",
      "`json.NewDecoder` decodes streaming payloads without loading the entire payload into RAM."
    ],
    "sections": [
      {
        "title": "1. Understanding Encoding & Serialization (JSON)",
        "explanation": "Converting structs to JSON and decoding streams with encoding/json. In Go, encoding & serialization (json) is designed around clarity and high runtime efficiency.",
        "code": "type Person struct {\n    Name string `json:\"name\"`\n    Age  int    `json:\"age,omitempty\"`\n}\ndata, _ := json.Marshal(Person{Name: \"Gopher\", Age: 15})"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing encoding & serialization (json) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Encoding & Serialization (JSON)?",
        "choices": [
          "`json.Marshal` converts structs to JSON bytes.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`json.Marshal` converts structs to JSON bytes."
      }
    ]
  },
  {
    "slug": "cli-tools",
    "title": "CLI Utilities & Flags",
    "levelId": "L9",
    "levelBadge": "🟧 Level 9 — File I/O & Systems",
    "category": "Systems & I/O",
    "summary": "Building powerful command-line applications with flag parsing and OS signal trapping.",
    "analogy": "The control dashboard on a sports car: toggles and dials (`--verbose`, `--port`) that let the driver customize performance.",
    "bullets": [
      "`flag` package parses command line arguments: `flag.StringVar(&port, \"port\", \"8080\", \"server port\")`.",
      "`os/signal` catches SIGINT (Ctrl+C) and SIGTERM for graceful application shutdown."
    ],
    "sections": [
      {
        "title": "1. Understanding CLI Utilities & Flags",
        "explanation": "Building powerful command-line applications with flag parsing and OS signal trapping. In Go, cli utilities & flags is designed around clarity and high runtime efficiency.",
        "code": "port := flag.String(\"port\", \"8080\", \"service port\")\nflag.Parse()\nfmt.Println(\"Listening on port:\", *port)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing cli utilities & flags without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind CLI Utilities & Flags?",
        "choices": [
          "`flag` package parses command line arguments: `flag.StringVar(&port, \"port\", \"8080\", \"server port\")`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`flag` package parses command line arguments: `flag.StringVar(&port, \"port\", \"8080\", \"server port\")`."
      }
    ]
  },
  {
    "slug": "go-modules",
    "title": "Go Modules & Versioning",
    "levelId": "L10",
    "levelBadge": "🟨 Level 10 — Build & Deploy",
    "category": "Tooling & DevOps",
    "summary": "Managing project dependencies, semantic versioning, and go.sum checksum verification.",
    "analogy": "A certified recipe book that locks exact ingredient brands and version numbers so the cake tastes 100% identical in every bakery.",
    "bullets": [
      "`go mod init <module-path>` starts a new module.",
      "`go mod tidy` automatically downloads used dependencies and removes unused ones.",
      "`go.sum` contains cryptographic hashes to prevent dependency tampering attacks."
    ],
    "sections": [
      {
        "title": "1. Understanding Go Modules & Versioning",
        "explanation": "Managing project dependencies, semantic versioning, and go.sum checksum verification. In Go, go modules & versioning is designed around clarity and high runtime efficiency.",
        "code": "$ go mod init github.com/user/myproject\n$ go mod tidy"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing go modules & versioning without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Go Modules & Versioning?",
        "choices": [
          "`go mod init <module-path>` starts a new module.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`go mod init <module-path>` starts a new module."
      }
    ]
  },
  {
    "slug": "build-system",
    "title": "Build System & Cross-Compilation",
    "levelId": "L10",
    "levelBadge": "🟨 Level 10 — Build & Deploy",
    "category": "Tooling & DevOps",
    "summary": "Compiling binaries for any operating system and architecture with zero cross-compiler setup.",
    "analogy": "A 3D blueprint printer: with one command switch, you print a native Windows `.exe`, Mac `.dylib`, or Linux ELF binary without owning those machines.",
    "bullets": [
      "`GOOS=linux GOARCH=amd64 go build` compiles for Linux from Mac or Windows.",
      "`//go:build linux` build tags compile files conditionally per OS."
    ],
    "sections": [
      {
        "title": "1. Understanding Build System & Cross-Compilation",
        "explanation": "Compiling binaries for any operating system and architecture with zero cross-compiler setup. In Go, build system & cross-compilation is designed around clarity and high runtime efficiency.",
        "code": "# Cross-compile for Linux 64-bit:\n$ GOOS=linux GOARCH=amd64 go build -o server-linux main.go"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing build system & cross-compilation without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Build System & Cross-Compilation?",
        "choices": [
          "`GOOS=linux GOARCH=amd64 go build` compiles for Linux from Mac or Windows.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`GOOS=linux GOARCH=amd64 go build` compiles for Linux from Mac or Windows."
      }
    ]
  },
  {
    "slug": "packaging",
    "title": "Package Design & Internal Rules",
    "levelId": "L10",
    "levelBadge": "🟨 Level 10 — Build & Deploy",
    "category": "Tooling & DevOps",
    "summary": "Structuring maintainable packages, public vs private APIs, and the internal package guard.",
    "analogy": "A restaurant: the dining room is public (`pkg/`), but the food preparation kitchen and pantry are strictly employees-only (`internal/`).",
    "bullets": [
      "`internal/` directories are strictly enforced by the Go compiler — cannot be imported by external projects.",
      "Keep packages focused on single responsibilities (e.g. `auth`, `storage`).",
      "Avoid circular package import cycles."
    ],
    "sections": [
      {
        "title": "1. Understanding Package Design & Internal Rules",
        "explanation": "Structuring maintainable packages, public vs private APIs, and the internal package guard. In Go, package design & internal rules is designed around clarity and high runtime efficiency.",
        "code": "myproject/\n├── cmd/api/main.go\n├── internal/auth/service.go  <-- Private to myproject\n└── pkg/validator/check.go    <-- Reusable by others"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing package design & internal rules without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Package Design & Internal Rules?",
        "choices": [
          "`internal/` directories are strictly enforced by the Go compiler — cannot be imported by external projects.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`internal/` directories are strictly enforced by the Go compiler — cannot be imported by external projects."
      }
    ]
  },
  {
    "slug": "performance-tools",
    "title": "Performance Profiling (pprof & Race)",
    "levelId": "L10",
    "levelBadge": "🟨 Level 10 — Build & Deploy",
    "category": "Tooling & DevOps",
    "summary": "Finding memory leaks, CPU bottlenecks, and data races with pprof, benchmarks, and -race.",
    "analogy": "An ultrasound sensor and speedometer plugged into an engine during a high-speed test track run.",
    "bullets": [
      "`go test -bench=. -benchmem` measures nanoseconds per operation and bytes allocated.",
      "`go test -race` detects concurrent data race bugs.",
      "`pprof` generates visual flame graphs of CPU and heap memory usage."
    ],
    "sections": [
      {
        "title": "1. Understanding Performance Profiling (pprof & Race)",
        "explanation": "Finding memory leaks, CPU bottlenecks, and data races with pprof, benchmarks, and -race. In Go, performance profiling (pprof & race) is designed around clarity and high runtime efficiency.",
        "code": "func BenchmarkFib(b *testing.B) {\n    for i := 0; i < b.N; i++ {\n        Fib(20)\n    }\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing performance profiling (pprof & race) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Performance Profiling (pprof & Race)?",
        "choices": [
          "`go test -bench=. -benchmem` measures nanoseconds per operation and bytes allocated.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`go test -bench=. -benchmem` measures nanoseconds per operation and bytes allocated."
      }
    ]
  },
  {
    "slug": "escape-analysis-deep",
    "title": "Deep Escape Analysis",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "How compiler heuristics determine heap escapes through pointers, closures, and interfaces.",
    "analogy": "A hotel bouncer checking if guests can stay in the private VIP lounge (stack) or must register in the general guest registry (heap).",
    "bullets": [
      "Variables escape if their pointer outlives their creating stack frame.",
      "Passing values to `fmt.Println(val)` causes escape because `fmt.Println` takes `...any`.",
      "Keeping hot loops on the stack prevents GC spikes."
    ],
    "sections": [
      {
        "title": "1. Understanding Deep Escape Analysis",
        "explanation": "How compiler heuristics determine heap escapes through pointers, closures, and interfaces. In Go, deep escape analysis is designed around clarity and high runtime efficiency.",
        "code": "$ go build -gcflags=\"-m -m\" main.go"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing deep escape analysis without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Deep Escape Analysis?",
        "choices": [
          "Variables escape if their pointer outlives their creating stack frame.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Variables escape if their pointer outlives their creating stack frame."
      }
    ]
  },
  {
    "slug": "inlining",
    "title": "Function Inlining",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "Eliminating function call overhead by inserting the function body directly at call sites.",
    "analogy": "Copy-pasting a short 1-line formula right onto your test sheet instead of flipping to the back appendix page every time.",
    "bullets": [
      "Simple functions with low complexity scores are automatically inlined.",
      "Eliminates stack frame push/pop overhead.",
      "`//go:noinline` prevents inlining when benchmarking."
    ],
    "sections": [
      {
        "title": "1. Understanding Function Inlining",
        "explanation": "Eliminating function call overhead by inserting the function body directly at call sites. In Go, function inlining is designed around clarity and high runtime efficiency.",
        "code": "//go:noinline\nfunc doNotInlineMe() { ... }"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing function inlining without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Function Inlining?",
        "choices": [
          "Simple functions with low complexity scores are automatically inlined.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Simple functions with low complexity scores are automatically inlined."
      }
    ]
  },
  {
    "slug": "compiler-flags",
    "title": "Compiler & Linker Flags",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "Injecting build versions and stripping binary debug tables with -ldflags.",
    "analogy": "Stripping luggage tags and packing labels from a parcel to make it ultra-lightweight before shipping.",
    "bullets": [
      "`-ldflags=\"-s -w\"` removes symbol and DWARF debug tables (reduces binary size by ~30%).",
      "`-ldflags=\"-X main.Version=1.0.0\"` injects build metadata at compile time."
    ],
    "sections": [
      {
        "title": "1. Understanding Compiler & Linker Flags",
        "explanation": "Injecting build versions and stripping binary debug tables with -ldflags. In Go, compiler & linker flags is designed around clarity and high runtime efficiency.",
        "code": "$ go build -ldflags=\"-s -w -X main.BuildVersion=v2.1\" -o app main.go"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing compiler & linker flags without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Compiler & Linker Flags?",
        "choices": [
          "`-ldflags=\"-s -w\"` removes symbol and DWARF debug tables (reduces binary size by ~30%).",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`-ldflags=\"-s -w\"` removes symbol and DWARF debug tables (reduces binary size by ~30%)."
      }
    ]
  },
  {
    "slug": "linker-internals",
    "title": "Linker Internals & Dead Code Elimination",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "How the Go linker resolves symbols and discards unused package functions.",
    "analogy": "A book editor removing every chapter and diagram that is never referenced in the final story before sending to the printer.",
    "bullets": [
      "Dead Code Elimination (DCE) strips unused functions from imported packages.",
      "Pure Go packages link statically into pure zero-dependency ELF binaries."
    ],
    "sections": [
      {
        "title": "1. Understanding Linker Internals & Dead Code Elimination",
        "explanation": "How the Go linker resolves symbols and discards unused package functions. In Go, linker internals & dead code elimination is designed around clarity and high runtime efficiency.",
        "code": "// Unused functions in imported libraries are automatically stripped!"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing linker internals & dead code elimination without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Linker Internals & Dead Code Elimination?",
        "choices": [
          "Dead Code Elimination (DCE) strips unused functions from imported packages.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Dead Code Elimination (DCE) strips unused functions from imported packages."
      }
    ]
  },
  {
    "slug": "goroutine-leak-detection",
    "title": "Goroutine Leak Detection",
    "levelId": "L11",
    "levelBadge": "🟪 Level 11 — Runtime & Compiler (Expert)",
    "category": "Runtime & Compiler",
    "summary": "Diagnosing and resolving orphaned goroutines blocked on channels or uncancelled contexts.",
    "analogy": "Leaving the water tap running in an empty hotel room. If no one turns it off, memory quietly fills up until the server runs out of RAM.",
    "bullets": [
      "Orphaned goroutines never exit and retain their stack memory permanently.",
      "Always use buffered channels with capacity 1 for single-result goroutines.",
      "Use `runtime.NumGoroutine()` in tests to verify goroutines terminate cleanly."
    ],
    "sections": [
      {
        "title": "1. Understanding Goroutine Leak Detection",
        "explanation": "Diagnosing and resolving orphaned goroutines blocked on channels or uncancelled contexts. In Go, goroutine leak detection is designed around clarity and high runtime efficiency.",
        "code": "func TestNoGoroutineLeak(t *testing.T) {\n    initial := runtime.NumGoroutine()\n    runTask()\n    time.Sleep(50 * time.Millisecond)\n    if runtime.NumGoroutine() > initial {\n        t.Fatal(\"Goroutine leak detected!\")\n    }\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing goroutine leak detection without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Goroutine Leak Detection?",
        "choices": [
          "Orphaned goroutines never exit and retain their stack memory permanently.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Orphaned goroutines never exit and retain their stack memory permanently."
      }
    ]
  },
  {
    "slug": "project-structure",
    "title": "Standard Go Project Layout",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Organizing scalable production repositories: cmd, internal, pkg, and api.",
    "analogy": "A well-organized bank: public ATM in front lobby (`cmd/`), security vaults and staff-only rooms in the back (`internal/`), shared brochures in reception (`pkg/`).",
    "bullets": [
      "`cmd/<app-name>/main.go` for application binaries.",
      "`internal/` for private domain logic that cannot be imported by external packages.",
      "`pkg/` for public reusable libraries."
    ],
    "sections": [
      {
        "title": "1. Understanding Standard Go Project Layout",
        "explanation": "Organizing scalable production repositories: cmd, internal, pkg, and api. In Go, standard go project layout is designed around clarity and high runtime efficiency.",
        "code": "my-service/\n├── cmd/server/main.go\n├── internal/\n│   ├── user/\n│   └── order/\n└── pkg/apiclient/"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing standard go project layout without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Standard Go Project Layout?",
        "choices": [
          "`cmd/<app-name>/main.go` for application binaries.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`cmd/<app-name>/main.go` for application binaries."
      }
    ]
  },
  {
    "slug": "dependency-injection",
    "title": "Dependency Injection without Frameworks",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Wiring application layers explicitly with constructor functions.",
    "analogy": "Handing a driver the car keys rather than forcing the driver to assemble the engine block before every trip.",
    "bullets": [
      "Constructor pattern: `NewUserService(repo UserRepository) *UserService`.",
      "Explicit parameter passing over magical reflection containers.",
      "Enables trivial swapping with mock test doubles."
    ],
    "sections": [
      {
        "title": "1. Understanding Dependency Injection without Frameworks",
        "explanation": "Wiring application layers explicitly with constructor functions. In Go, dependency injection without frameworks is designed around clarity and high runtime efficiency.",
        "code": "func NewService(repo Repository) *Service {\n    return &Service{repo: repo}\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing dependency injection without frameworks without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Dependency Injection without Frameworks?",
        "choices": [
          "Constructor pattern: `NewUserService(repo UserRepository) *UserService`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Constructor pattern: `NewUserService(repo UserRepository) *UserService`."
      }
    ]
  },
  {
    "slug": "clean-architecture",
    "title": "Clean / Hexagonal Architecture",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Isolating domain business rules from databases, HTTP frameworks, and external APIs.",
    "analogy": "A medieval castle: the king and crown jewels (domain entities) stay safe in the inner keep, untouched by whatever changes happen at the outer moat.",
    "bullets": [
      "Domain models and business logic sit in the core.",
      "Outer layers (Postgres, HTTP, Redis) depend on inner interfaces, never the reverse."
    ],
    "sections": [
      {
        "title": "1. Understanding Clean / Hexagonal Architecture",
        "explanation": "Isolating domain business rules from databases, HTTP frameworks, and external APIs. In Go, clean / hexagonal architecture is designed around clarity and high runtime efficiency.",
        "code": "type UserRepository interface {\n    GetByID(ctx context.Context, id string) (*User, error)\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing clean / hexagonal architecture without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Clean / Hexagonal Architecture?",
        "choices": [
          "Domain models and business logic sit in the core.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Domain models and business logic sit in the core."
      }
    ]
  },
  {
    "slug": "testing",
    "title": "Table-Driven Testing & Mocks",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Writing idiomatic Go tests with slices of test cases and t.Run subtests.",
    "analogy": "A car crash-test facility: running a standardized checklist of 20 different speed and angle tests through the exact same testing harness.",
    "bullets": [
      "Table-driven tests define a slice of test cases and iterate with `t.Run`.",
      "`go test -v -cover` verifies test coverage."
    ],
    "sections": [
      {
        "title": "1. Understanding Table-Driven Testing & Mocks",
        "explanation": "Writing idiomatic Go tests with slices of test cases and t.Run subtests. In Go, table-driven testing & mocks is designed around clarity and high runtime efficiency.",
        "code": "func TestAdd(t *testing.T) {\n    tests := []struct{ a, b, want int }{\n        {1, 2, 3},\n        {-1, 1, 0},\n    }\n    for _, tt := range tests {\n        if got := Add(tt.a, tt.b); got != tt.want {\n            t.Errorf(\"got %d, want %d\", got, tt.want)\n        }\n    }\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing table-driven testing & mocks without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Table-Driven Testing & Mocks?",
        "choices": [
          "Table-driven tests define a slice of test cases and iterate with `t.Run`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Table-driven tests define a slice of test cases and iterate with `t.Run`."
      }
    ]
  },
  {
    "slug": "logging",
    "title": "Structured Logging with log/slog",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Production logging with standard structured key-value attributes in Go 1.21+.",
    "analogy": "A flight black box recorder: saving logs in structured JSON format with timestamps and tags so search engines can index them instantly.",
    "bullets": [
      "Standard library `log/slog` replaces third-party loggers.",
      "Outputs structured JSON or high-performance text.",
      "Supports strongly-typed attributes like `slog.String` and `slog.Int`."
    ],
    "sections": [
      {
        "title": "1. Understanding Structured Logging with log/slog",
        "explanation": "Production logging with standard structured key-value attributes in Go 1.21+. In Go, structured logging with log/slog is designed around clarity and high runtime efficiency.",
        "code": "logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))\nlogger.Info(\"User logged in\", slog.String(\"userId\", \"usr_123\"), slog.Int(\"attempts\", 1))"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing structured logging with log/slog without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Structured Logging with log/slog?",
        "choices": [
          "Standard library `log/slog` replaces third-party loggers.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Standard library `log/slog` replaces third-party loggers."
      }
    ]
  },
  {
    "slug": "microservices",
    "title": "Microservices & Graceful Shutdown",
    "levelId": "L12",
    "levelBadge": "🔥 Level 12 — Architecture & Practices",
    "category": "Architecture",
    "summary": "Building resilient services with gRPC, Protocol Buffers, and zero-downtime termination.",
    "analogy": "A restaurant kitchen finishing cooking current customer orders before closing the restaurant for the night, rather than abruptly turning off the lights.",
    "bullets": [
      "gRPC provides high-throughput binary RPC communication over HTTP/2.",
      "Catch OS signals (`SIGTERM`) and call `server.Shutdown(ctx)` to finish in-flight requests."
    ],
    "sections": [
      {
        "title": "1. Understanding Microservices & Graceful Shutdown",
        "explanation": "Building resilient services with gRPC, Protocol Buffers, and zero-downtime termination. In Go, microservices & graceful shutdown is designed around clarity and high runtime efficiency.",
        "code": "quit := make(chan os.Signal, 1)\nsignal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)\n<-quit\nserver.Shutdown(context.Background())"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing microservices & graceful shutdown without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Microservices & Graceful Shutdown?",
        "choices": [
          "gRPC provides high-throughput binary RPC communication over HTTP/2.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "gRPC provides high-throughput binary RPC communication over HTTP/2."
      }
    ]
  },
  {
    "slug": "unsafe",
    "title": "The Unsafe Package",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Bypassing Go type safety with unsafe.Pointer and raw memory casting.",
    "analogy": "Removing the safety guard on a high-powered electric saw: cuts raw materials at blinding speed, but one millimeter slip cuts your finger off!",
    "bullets": [
      "`unsafe.Pointer` converts between arbitrary pointer types.",
      "`uintptr` stores raw memory address integers.",
      "Bypasses Go safety guarantees; reserved for low-level kernels and extreme performance libraries."
    ],
    "sections": [
      {
        "title": "1. Understanding The Unsafe Package",
        "explanation": "Bypassing Go type safety with unsafe.Pointer and raw memory casting. In Go, the unsafe package is designed around clarity and high runtime efficiency.",
        "code": "p := unsafe.Pointer(&myStruct)\nrawByte := (*byte)(p)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing the unsafe package without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind The Unsafe Package?",
        "choices": [
          "`unsafe.Pointer` converts between arbitrary pointer types.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`unsafe.Pointer` converts between arbitrary pointer types."
      }
    ]
  },
  {
    "slug": "atomic-operations",
    "title": "Atomic Operations (sync/atomic)",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Lock-free concurrency using CPU hardware atomic instructions.",
    "analogy": "A mechanical turnstile clicker at a stadium gate: clicks forward in 1 clock cycle without needing a security guard to lock the gate.",
    "bullets": [
      "`atomic.AddInt64()`, `atomic.LoadPointer()`, `atomic.CompareAndSwap()`.",
      "Far faster than Mutexes for simple counters.",
      "Uses CPU atomic instructions (lock cmpxchg)."
    ],
    "sections": [
      {
        "title": "1. Understanding Atomic Operations (sync/atomic)",
        "explanation": "Lock-free concurrency using CPU hardware atomic instructions. In Go, atomic operations (sync/atomic) is designed around clarity and high runtime efficiency.",
        "code": "var counter int64\natomic.AddInt64(&counter, 1)\nval := atomic.LoadInt64(&counter)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing atomic operations (sync/atomic) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Atomic Operations (sync/atomic)?",
        "choices": [
          "`atomic.AddInt64()`, `atomic.LoadPointer()`, `atomic.CompareAndSwap()`.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`atomic.AddInt64()`, `atomic.LoadPointer()`, `atomic.CompareAndSwap()`."
      }
    ]
  },
  {
    "slug": "wasm",
    "title": "WebAssembly (WASM)",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Compiling Go code into WebAssembly binaries to run directly inside web browsers.",
    "analogy": "Putting a Go astronaut into a specialized spacesuit so they can breathe and work inside the alien Web Browser planet.",
    "bullets": [
      "`GOOS=js GOARCH=wasm go build -o main.wasm` compiles Go to WASM.",
      "`syscall/js` interacts directly with the JavaScript DOM and browser APIs."
    ],
    "sections": [
      {
        "title": "1. Understanding WebAssembly (WASM)",
        "explanation": "Compiling Go code into WebAssembly binaries to run directly inside web browsers. In Go, webassembly (wasm) is designed around clarity and high runtime efficiency.",
        "code": "// syscall/js exposes Go functions to window.myGoFunc in browser"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing webassembly (wasm) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind WebAssembly (WASM)?",
        "choices": [
          "`GOOS=js GOARCH=wasm go build -o main.wasm` compiles Go to WASM.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`GOOS=js GOARCH=wasm go build -o main.wasm` compiles Go to WASM."
      }
    ]
  },
  {
    "slug": "reflection",
    "title": "Reflection (reflect package)",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Dynamic type inspection and struct field manipulation at runtime.",
    "analogy": "An airport baggage X-ray scanner inspecting the internal contents of an unmarked sealed package at runtime.",
    "bullets": [
      "`reflect.TypeOf()` and `reflect.ValueOf()` inspect dynamic types.",
      "Powers ORMs and JSON serializers.",
      "Has noticeable performance costs compared to static code."
    ],
    "sections": [
      {
        "title": "1. Understanding Reflection (reflect package)",
        "explanation": "Dynamic type inspection and struct field manipulation at runtime. In Go, reflection (reflect package) is designed around clarity and high runtime efficiency.",
        "code": "t := reflect.TypeOf(myStruct)\nfor i := 0; i < t.NumField(); i++ {\n    fmt.Println(t.Field(i).Name)\n}"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing reflection (reflect package) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Reflection (reflect package)?",
        "choices": [
          "`reflect.TypeOf()` and `reflect.ValueOf()` inspect dynamic types.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`reflect.TypeOf()` and `reflect.ValueOf()` inspect dynamic types."
      }
    ]
  },
  {
    "slug": "plugins",
    "title": "Go Plugins (.so Dynamic Loading)",
    "levelId": "L13",
    "levelBadge": "🟫 Level 13 — Specialized Topics",
    "category": "Specialized",
    "summary": "Loading compiled shared libraries (.so) into running Go processes.",
    "analogy": "Hot-swapping game cartridges into a gaming console while the console is powered on.",
    "bullets": [
      "`plugin.Open(\"plugin.so\")` loads shared object libraries at runtime.",
      "Requires identical compiler flags and Go versions between host and plugin."
    ],
    "sections": [
      {
        "title": "1. Understanding Go Plugins (.so Dynamic Loading)",
        "explanation": "Loading compiled shared libraries (.so) into running Go processes. In Go, go plugins (.so dynamic loading) is designed around clarity and high runtime efficiency.",
        "code": "p, _ := plugin.Open(\"module.so\")\nsym, _ := p.Lookup(\"PerformTask\")"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing go plugins (.so dynamic loading) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Go Plugins (.so Dynamic Loading)?",
        "choices": [
          "`plugin.Open(\"plugin.so\")` loads shared object libraries at runtime.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`plugin.Open(\"plugin.so\")` loads shared object libraries at runtime."
      }
    ]
  },
  {
    "slug": "runtime-internals",
    "title": "Runtime Memory Allocator (mcache & mheap)",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "TCMalloc-derived memory architecture: size classes, spans, mcache, and mcentral.",
    "analogy": "A bank with local cash drawers (mcache) for quick withdrawals, backed by the central vault (mcentral) for large requests.",
    "bullets": [
      "`mcache`: Per-P lock-free cache for small object allocations.",
      "`mcentral`: Shared cache of span classes.",
      "`mheap`: Allocates virtual memory directly from the OS."
    ],
    "sections": [
      {
        "title": "1. Understanding Runtime Memory Allocator (mcache & mheap)",
        "explanation": "TCMalloc-derived memory architecture: size classes, spans, mcache, and mcentral. In Go, runtime memory allocator (mcache & mheap) is designed around clarity and high runtime efficiency.",
        "code": "// Size classes categorize allocations from 8 bytes to 32 KB without lock contention"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing runtime memory allocator (mcache & mheap) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Runtime Memory Allocator (mcache & mheap)?",
        "choices": [
          "`mcache`: Per-P lock-free cache for small object allocations.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`mcache`: Per-P lock-free cache for small object allocations."
      }
    ]
  },
  {
    "slug": "gc-internals",
    "title": "GC Internals & Pacing",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "Concurrent tri-color marking algorithm, write barriers, and GC pacing calculation.",
    "analogy": "A 3-color sticker tagging system during a warehouse audit: White (unvisited), Grey (discovered), Black (scanned and safe).",
    "bullets": [
      "Concurrent mark phase runs alongside user goroutines.",
      "Write barriers track pointer mutations during marking.",
      "Mutator assists throttle heavy-allocating goroutines."
    ],
    "sections": [
      {
        "title": "1. Understanding GC Internals & Pacing",
        "explanation": "Concurrent tri-color marking algorithm, write barriers, and GC pacing calculation. In Go, gc internals & pacing is designed around clarity and high runtime efficiency.",
        "code": "// Tri-Color Marking: White (garbage candidate) -> Grey (queued) -> Black (retained)"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing gc internals & pacing without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind GC Internals & Pacing?",
        "choices": [
          "Concurrent mark phase runs alongside user goroutines.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Concurrent mark phase runs alongside user goroutines."
      }
    ]
  },
  {
    "slug": "memory-layout",
    "title": "Memory Layouts & Zero-Sized Types",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "Binary representations of interfaces, strings, slices, and struct{} in RAM.",
    "analogy": "Standardized shipping containers: exact centimeter dimensions for how structs and strings pack into 64-bit RAM slots.",
    "bullets": [
      "`struct{}` takes exactly 0 bytes of memory.",
      "Strings are 16 bytes: `(data *byte, len int)`.",
      "Interfaces are 16 bytes: `(tab *itab, data unsafe.Pointer)`."
    ],
    "sections": [
      {
        "title": "1. Understanding Memory Layouts & Zero-Sized Types",
        "explanation": "Binary representations of interfaces, strings, slices, and struct{} in RAM. In Go, memory layouts & zero-sized types is designed around clarity and high runtime efficiency.",
        "code": "fmt.Println(unsafe.Sizeof(struct{}{})) // 0 bytes!"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing memory layouts & zero-sized types without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Memory Layouts & Zero-Sized Types?",
        "choices": [
          "`struct{}` takes exactly 0 bytes of memory.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`struct{}` takes exactly 0 bytes of memory."
      }
    ]
  },
  {
    "slug": "channel-internals",
    "title": "Channel Internals (hchan & sudog)",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "Under the hood of channels: the hchan struct, circular ring buffer, and wait queues.",
    "analogy": "A lockbox with a circular turnstile for items and two waiting benches (`sendq` and `recvq`) for sleeping goroutines.",
    "bullets": [
      "`hchan` contains a mutex, circular buffer array, and `sudog` linked lists for blocked senders/receivers.",
      "Direct copy: if a receiver is waiting, sender writes directly into receiver memory!"
    ],
    "sections": [
      {
        "title": "1. Understanding Channel Internals (hchan & sudog)",
        "explanation": "Under the hood of channels: the hchan struct, circular ring buffer, and wait queues. In Go, channel internals (hchan & sudog) is designed around clarity and high runtime efficiency.",
        "code": "// hchan: [ mutex | qcount | dataqsiz | buf | sendq | recvq ]"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing channel internals (hchan & sudog) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Channel Internals (hchan & sudog)?",
        "choices": [
          "`hchan` contains a mutex, circular buffer array, and `sudog` linked lists for blocked senders/receivers.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`hchan` contains a mutex, circular buffer array, and `sudog` linked lists for blocked senders/receivers."
      }
    ]
  },
  {
    "slug": "map-internals",
    "title": "Map Internals (hmap & bmap buckets)",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "How Go maps organize 8-key buckets, tophash filtering, and incremental evacuation.",
    "analogy": "A filing cabinet with 8 folders per drawer and quick sticky tabs (tophash) to identify matching files in 1 CPU cycle.",
    "bullets": [
      "`hmap` points to an array of `bmap` buckets (8 key/value slots each).",
      "`tophash` byte array enables fast SIMD-like candidate filtering.",
      "Resizing doubles bucket count and evacuates data incrementally to avoid latency spikes."
    ],
    "sections": [
      {
        "title": "1. Understanding Map Internals (hmap & bmap buckets)",
        "explanation": "How Go maps organize 8-key buckets, tophash filtering, and incremental evacuation. In Go, map internals (hmap & bmap buckets) is designed around clarity and high runtime efficiency.",
        "code": "// bmap: [ tophash[8] | keys[8] | values[8] | overflow pointer ]"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing map internals (hmap & bmap buckets) without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Map Internals (hmap & bmap buckets)?",
        "choices": [
          "`hmap` points to an array of `bmap` buckets (8 key/value slots each).",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "`hmap` points to an array of `bmap` buckets (8 key/value slots each)."
      }
    ]
  },
  {
    "slug": "slice-internals",
    "title": "Slice Internals & Memory Retention",
    "levelId": "L14",
    "levelBadge": "🟩 Level 14 — Internals Deep Dive",
    "category": "Internals",
    "summary": "Slice reallocation algorithms and preventing memory leaks from sub-sliced buffers.",
    "analogy": "Holding onto a tiny coupon clipped from a giant newspaper. If you keep the whole newspaper in your hands, the entire paper cannot be recycled!",
    "bullets": [
      "Sub-slicing a large buffer holds the entire underlying array in memory.",
      "Use `copy()` to copy only needed sub-elements and free the large array."
    ],
    "sections": [
      {
        "title": "1. Understanding Slice Internals & Memory Retention",
        "explanation": "Slice reallocation algorithms and preventing memory leaks from sub-sliced buffers. In Go, slice internals & memory retention is designed around clarity and high runtime efficiency.",
        "code": "// Avoid memory leak from large buffer:\nsub := make([]byte, len(needed))\ncopy(sub, largeBuffer[:10])"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing slice internals & memory retention without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Slice Internals & Memory Retention?",
        "choices": [
          "Sub-slicing a large buffer holds the entire underlying array in memory.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Sub-slicing a large buffer holds the entire underlying array in memory."
      }
    ]
  },
  {
    "slug": "philosophy",
    "title": "Go Philosophy & Proverbs",
    "levelId": "L15",
    "levelBadge": "🟦 Level 15 — Philosophy & Distributed",
    "category": "Philosophy & Systems",
    "summary": "Core engineering philosophy: simplicity, readability, composition, and the Go Proverbs.",
    "analogy": "The minimalist architect creed: \"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.\"",
    "bullets": [
      "\"Clear is better than clever.\"",
      "\"A little copying is better than a little dependency.\"",
      "\"Errors are values. Program them.\""
    ],
    "sections": [
      {
        "title": "1. Understanding Go Philosophy & Proverbs",
        "explanation": "Core engineering philosophy: simplicity, readability, composition, and the Go Proverbs. In Go, go philosophy & proverbs is designed around clarity and high runtime efficiency.",
        "code": "// Write obvious, readable code that any engineer can maintain at 3 AM!"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing go philosophy & proverbs without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Go Philosophy & Proverbs?",
        "choices": [
          "\"Clear is better than clever.\"",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "\"Clear is better than clever.\""
      }
    ]
  },
  {
    "slug": "anti-patterns",
    "title": "Common Go Anti-Patterns",
    "levelId": "L15",
    "levelBadge": "🟦 Level 15 — Philosophy & Distributed",
    "category": "Philosophy & Systems",
    "summary": "Practices to avoid: panic for control flow, unmetered goroutine spawning, and shared mutable state.",
    "analogy": "Danger signs on a hiking trail: \"Do not climb beyond this fence\", \"Do not ignite fires here\".",
    "bullets": [
      "Never use `panic` for expected error paths.",
      "Never spawn unbounded goroutines without worker pool limits.",
      "Avoid global mutable variables."
    ],
    "sections": [
      {
        "title": "1. Understanding Common Go Anti-Patterns",
        "explanation": "Practices to avoid: panic for control flow, unmetered goroutine spawning, and shared mutable state. In Go, common go anti-patterns is designed around clarity and high runtime efficiency.",
        "code": "// ❌ Anti-pattern: spawning unlimited goroutines in web handler\n// ✅ Idiomatic: bounded worker pools or semaphores"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing common go anti-patterns without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Common Go Anti-Patterns?",
        "choices": [
          "Never use `panic` for expected error paths.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Never use `panic` for expected error paths."
      }
    ]
  },
  {
    "slug": "distributed-systems",
    "title": "Distributed Systems Patterns in Go",
    "levelId": "L15",
    "levelBadge": "🟦 Level 15 — Philosophy & Distributed",
    "category": "Philosophy & Systems",
    "summary": "Raft consensus, circuit breakers, idempotency, and distributed tracing in Go.",
    "analogy": "A council of elders on separate islands communicating via carrier pigeons to agree on a single shared truth.",
    "bullets": [
      "Go powers modern cloud infrastructure: Kubernetes, Docker, etcd, Terraform, CockroachDB.",
      "Raft consensus algorithm implemented natively in etcd and HashiCorp Raft.",
      "OpenTelemetry context propagation for distributed tracing."
    ],
    "sections": [
      {
        "title": "1. Understanding Distributed Systems Patterns in Go",
        "explanation": "Raft consensus, circuit breakers, idempotency, and distributed tracing in Go. In Go, distributed systems patterns in go is designed around clarity and high runtime efficiency.",
        "code": "// Distributed tracing context propagation across HTTP calls"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing distributed systems patterns in go without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Distributed Systems Patterns in Go?",
        "choices": [
          "Go powers modern cloud infrastructure: Kubernetes, Docker, etcd, Terraform, CockroachDB.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Go powers modern cloud infrastructure: Kubernetes, Docker, etcd, Terraform, CockroachDB."
      }
    ]
  },
  {
    "slug": "open-source-patterns",
    "title": "Idiomatic Open-Source Patterns",
    "levelId": "L15",
    "levelBadge": "🟦 Level 15 — Philosophy & Distributed",
    "category": "Philosophy & Systems",
    "summary": "Standard library design patterns, Effective Go guidelines, and linters.",
    "analogy": "The community garden rules: everyone agrees on the same tool storage and watering schedule so the whole garden flourishes.",
    "bullets": [
      "Run `golangci-lint` to enforce 50+ community standard linters.",
      "Write thorough doc comments: any exported symbol must have a comment starting with its name.",
      "Accept interfaces, return concrete types."
    ],
    "sections": [
      {
        "title": "1. Understanding Idiomatic Open-Source Patterns",
        "explanation": "Standard library design patterns, Effective Go guidelines, and linters. In Go, idiomatic open-source patterns is designed around clarity and high runtime efficiency.",
        "code": "// UserService manages user authentication and lifecycle.\ntype UserService struct { ... }"
      }
    ],
    "commonPitfalls": [
      {
        "mistake": "Misusing idiomatic open-source patterns without understanding its memory or concurrency semantics.",
        "fix": "Always follow standard Go idioms and verify with tests."
      }
    ],
    "quizzes": [
      {
        "id": 1,
        "question": "What is the primary concept behind Idiomatic Open-Source Patterns?",
        "choices": [
          "Run `golangci-lint` to enforce 50+ community standard linters.",
          "Requires manual C-style pointer math",
          "Disables garbage collection",
          "Forces single-threaded execution"
        ],
        "answer": 0,
        "explanation": "Run `golangci-lint` to enforce 50+ community standard linters."
      }
    ]
  }
];

export const conceptsMap = new Map<string, FullConcept>(
  allConcepts.map((c) => [c.slug, c])
);
