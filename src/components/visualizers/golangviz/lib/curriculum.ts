export type Chapter = {
  slug: string;
  title: string;
  summary: string;
  category: "Foundation" | "Memory" | "Concurrency" | "Advanced";
};

export const chapters: Chapter[] = [
  {
    slug: "foundation",
    title: "Foundation",
    summary: "Toolchain, syntax, first program, control flow, functions, errors.",
    category: "Foundation",
  },
  {
    slug: "memory",
    title: "Memory & Types",
    summary: "Stack vs heap, escape analysis, pointers, structs, slices, maps, interfaces.",
    category: "Memory",
  },
  {
    slug: "concurrency",
    title: "Concurrency",
    summary: "Goroutines, channels, select, sync primitives, scheduler deep dive.",
    category: "Concurrency",
  },
  {
    slug: "advanced",
    title: "Advanced & Tooling",
    summary: "Generics, testing, benchmarking, profiling, modules, cross-compilation, GC.",
    category: "Advanced",
  },
];

export type Concept = { title: string; bullets: string[]; href?: string };
export type ConceptLevel = { id: string; badge: string; blurb: string; concepts: Concept[] };

export const levels: ConceptLevel[] = [
  {
    id: "L0",
    badge: "🟢 Level 0 — Absolute Basics",
    blurb: "Intro + install + workspace basics.",
    concepts: [
      {
        title: "Introduction to Go",
        href: "/golangviz/concepts/introduction-to-go",
        bullets: ["What is Go? Why it was created (simplicity, concurrency, performance)", "Toolchain, workspace", "GOPATH vs Modules"],
      },
      {
        title: "Installation & Setup",
        href: "/golangviz/concepts/installation-and-setup",
        bullets: ["Install Go; go version; go env", "VSCode / GoLand setup", "$GOROOT and $GOPATH"],
      },
    ],
  },
  {
    id: "L1",
    badge: "🟡 Level 1 — Fundamentals",
    blurb: "Hello World, syntax, vars, types, constants.",
    concepts: [
      {
        title: "Hello World",
        href: "/golangviz/concepts/hello-world",
        bullets: ["package main", "func main()", "fmt.Println"],
      },
      {
        title: "Basic Syntax",
        href: "/golangviz/concepts/basic-syntax",
        bullets: ["Packages & imports", "Comments", "Naming conventions"],
      },
      {
        title: "Variables",
        href: "/golangviz/concepts/variables",
        bullets: ["var declarations", "Short := ", "Zero values", "Typed vs untyped constants"],
      },
      {
        title: "Basic Types",
        href: "/golangviz/concepts/basic-types",
        bullets: ["ints, floats, complex", "string (immutable)", "bool", "byte, rune"],
      },
      {
        title: "Constants",
        href: "/golangviz/concepts/constants",
        bullets: ["const", "iota", "Typed & untyped"],
      },
    ],
  },
  {
    id: "L2",
    badge: "🟠 Level 2 — Flow Control",
    blurb: "Conditionals, switch, loops, error basics.",
    concepts: [
      { title: "Conditionals",
        href: "/golangviz/concepts/conditionals", bullets: ["if, if with initializer, else-if"] },
      { title: "Switch",
        href: "/golangviz/concepts/switch", bullets: ["Multiple cases", "Condition switches", "Type switch"] },
      { title: "Loops",
        href: "/golangviz/concepts/loops", bullets: ["for", "range over slices/arrays/maps/strings", "Infinite loops"] },
      {
        title: "Error Handling",
        href: "/golangviz/concepts/error-handling",
        bullets: ["error type", "Create/return errors", "fmt.Errorf + %w", "errors.Is / errors.As"],
      },
    ],
  },
  {
    id: "L3",
    badge: "🔵 Level 3 — Functions",
    blurb: "Functions, closures, defer/panic/recover.",
    concepts: [
      { title: "Functions",
        href: "/golangviz/concepts/functions", bullets: ["Multiple returns", "Named returns", "Variadic"] },
      { title: "Anonymous & Closures",
        href: "/golangviz/concepts/anonymous-and-closures", bullets: ["Closures, returning functions"] },
      { title: "Defer / Panic / Recover",
        href: "/golangviz/concepts/defer-panic-recover", bullets: ["Stack unwinding", "When to use defer", "Panic + recover patterns"] },
    ],
  },
  {
    id: "L4",
    badge: "🟣 Level 4 — Composite Data",
    blurb: "Arrays, slices, maps, structs, pointers.",
    concepts: [
      { title: "Arrays",
        href: "/golangviz/concepts/arrays", bullets: ["Fixed size", "Value semantics", "Memory layout"] },
      {
        title: "Slices",
        href: "/golangviz/concepts/slices",
        bullets: ["Header (ptr, len, cap)", "Backing array", "Reslicing", "Append growth", "Copy"],
      },
      {
        title: "Maps",
        href: "/golangviz/concepts/maps",
        bullets: ["Hash table, buckets/overflow", "Lookup/insert/delete", "Iteration randomness", "nil vs empty maps"],
      },
      { title: "Structs",
        href: "/golangviz/concepts/structs", bullets: ["Definition", "Tags", "Anonymous fields", "Embedding"] },
      { title: "Pointers",
        href: "/golangviz/concepts/pointers", bullets: ["& and *", "Pointer to array vs slice", "Value vs reference", "Escape basics"] },
    ],
  },
  {
    id: "L5",
    badge: "🔴 Level 5 — Methods & Interfaces",
    blurb: "Methods, method sets, interfaces, embedding.",
    concepts: [
      { title: "Methods",
        href: "/golangviz/concepts/methods", bullets: ["Value vs pointer receivers", "Method sets", "Mutability rules"] },
      {
        title: "Interfaces",
        href: "/golangviz/concepts/interfaces",
        bullets: ["Implicit impl", "Satisfaction", "Empty interface (any)", "Type assertions/switches", "itab + data ptr internals"],
      },
      { title: "Embedding Interfaces",
        href: "/golangviz/concepts/embedding-interfaces", bullets: ["Composing behavior", "Struct vs interface embedding"] },
      { title: "Polymorphism",
        href: "/golangviz/concepts/polymorphism", bullets: ["Interface-based polymorphism (no inheritance)"] },
    ],
  },
  {
    id: "L6",
    badge: "⚫ Level 6 — Memory Model",
    blurb: "Stack/heap, GC, alignment, zero-copy patterns.",
    concepts: [
      { title: "Stack vs Heap",
        href: "/golangviz/concepts/stack-vs-heap", bullets: ["Escape analysis", "Allocation decisions", "Stack growth"] },
      { title: "Garbage Collector",
        href: "/golangviz/concepts/garbage-collector", bullets: ["Tracing GC", "Write barriers", "STW phases", "Tuning"] },
      { title: "Alignment & Padding",
        href: "/golangviz/concepts/alignment-and-padding", bullets: ["Struct alignment rules", "Minimizing padding"] },
      { title: "Zero-copy",
        href: "/golangviz/concepts/zero-copy", bullets: ["Slices/maps share memory", "Large struct copy patterns"] },
    ],
  },
  {
    id: "L7",
    badge: "🟤 Level 7 — Runtime & Concurrency",
    blurb: "Goroutines, channels, select, sync, context, GMP.",
    concepts: [
      { title: "Goroutines",
        href: "/golangviz/concepts/goroutines", bullets: ["Lightweight threads", "Scheduler", "Stack growth", "Blocking vs non-blocking"] },
      { title: "Channels",
        href: "/golangviz/concepts/channels", bullets: ["Buffered/unbuffered", "Blocking sends", "Closing", "Range"] },
      { title: "Select",
        href: "/golangviz/concepts/select", bullets: ["Multiple channel ops", "Default", "Fairness"] },
      { title: "Sync Primitives",
        href: "/golangviz/concepts/sync-primitives", bullets: ["Mutex/RWMutex", "WaitGroup", "Once/Map/Cond/Pool"] },
      { title: "Context",
        href: "/golangviz/concepts/context", bullets: ["Propagation", "Deadlines", "Cancellation"] },
      { title: "Scheduler (GMP)",
        href: "/golangviz/concepts/scheduler-gmp", bullets: ["G/M/P", "Work stealing", "Preemption"] },
    ],
  },
  {
    id: "L8",
    badge: "🟩 Level 8 — Advanced Types",
    blurb: "Generics, type aliases, custom types.",
    concepts: [
      { title: "Generics",
        href: "/golangviz/concepts/generics", bullets: ["Type params", "Constraints", "comparable", "Generic structs/methods"] },
      { title: "Type Aliases",
        href: "/golangviz/concepts/type-aliases", bullets: ["type T = OriginalType", "Migrations"] },
      { title: "Custom Types",
        href: "/golangviz/concepts/custom-types", bullets: ["Methods", "Implementing interfaces"] },
    ],
  },
  {
    id: "L9",
    badge: "🟧 Level 9 — File I/O & Systems",
    blurb: "Files, networking, encoding, CLI.",
    concepts: [
      { title: "File Handling",
        href: "/golangviz/concepts/file-handling", bullets: ["os pkg", "Read/write", "Scanners/readers"] },
      { title: "Networking",
        href: "/golangviz/concepts/networking", bullets: ["net TCP/UDP", "net/http", "HTTP server/client", "Middleware patterns"] },
      { title: "Encoding",
        href: "/golangviz/concepts/encoding", bullets: ["JSON/YAML", "Custom marshalers", "Streaming decoders"] },
      { title: "CLI Tools",
        href: "/golangviz/concepts/cli-tools", bullets: ["flags", "Cobra/Viper basics"] },
    ],
  },
  {
    id: "L10",
    badge: "🟨 Level 10 — Build & Deploy",
    blurb: "Modules, builds, packaging, perf tools.",
    concepts: [
      { title: "Go Modules",
        href: "/golangviz/concepts/go-modules", bullets: ["go mod init", "Deps/versioning"] },
      { title: "Build System",
        href: "/golangviz/concepts/build-system", bullets: ["go build/run/install", "Cross compilation"] },
      { title: "Packaging",
        href: "/golangviz/concepts/packaging", bullets: ["Publish modules", "replace directives"] },
      { title: "Performance Tools",
        href: "/golangviz/concepts/performance-tools", bullets: ["Benchmarks", "pprof", "Tracing", "Race detector"] },
    ],
  },
  {
    id: "L11",
    badge: "🟪 Level 11 — Runtime & Compiler (Expert)",
    blurb: "Escape analysis deep, inlining, flags, linker.",
    concepts: [
      { title: "Escape Analysis (deep)",
        href: "/golangviz/concepts/escape-analysis-deep", bullets: ["Rules", "Heap vs stack control"] },
      { title: "Inlining",
        href: "/golangviz/concepts/inlining", bullets: ["Inlining rules"] },
      { title: "Compiler Flags",
        href: "/golangviz/concepts/compiler-flags", bullets: ["-gcflags", "-ldflags", "Build tags"] },
      { title: "Linker Internals",
        href: "/golangviz/concepts/linker-internals", bullets: ["DCE", "Symbol resolution"] },
      { title: "Goroutine Leak Detection",
        href: "/golangviz/concepts/goroutine-leak-detection", bullets: ["Memory/channel leaks"] },
    ],
  },
  {
    id: "L12",
    badge: "🔥 Level 12 — Architecture & Practices",
    blurb: "Project structure, DI, clean architecture, testing, logging, microservices.",
    concepts: [
      { title: "Project Structure",
        href: "/golangviz/concepts/project-structure", bullets: ["Standard layout", "DDD"] },
      { title: "Dependency Injection",
        href: "/golangviz/concepts/dependency-injection", bullets: ["No-framework DI", "Wire/Fx (optional)"] },
      { title: "Clean Architecture",
        href: "/golangviz/concepts/clean-architecture", bullets: ["Entities, use cases, repos, services"] },
      { title: "Testing",
        href: "/golangviz/concepts/testing", bullets: ["Unit, table-driven, mocks, integration"] },
      { title: "Logging",
        href: "/golangviz/concepts/logging", bullets: ["Structured logs", "Zap/Zerolog"] },
      { title: "Microservices",
        href: "/golangviz/concepts/microservices", bullets: ["gRPC/Protobuf", "REST", "Async messaging"] },
    ],
  },
  {
    id: "L13",
    badge: "🟫 Level 13 — Specialized Topics",
    blurb: "Unsafe, atomics, WASM, reflection, plugins.",
    concepts: [
      { title: "Unsafe",
        href: "/golangviz/concepts/unsafe", bullets: ["Pointer ops", "Reinterpretation", "Risks"] },
      { title: "Atomic Operations",
        href: "/golangviz/concepts/atomic-operations", bullets: ["sync/atomic", "CAS", "Barriers"] },
      { title: "WASM",
        href: "/golangviz/concepts/wasm", bullets: ["Go in the browser"] },
      { title: "Reflection",
        href: "/golangviz/concepts/reflection", bullets: ["reflect pkg", "Framework patterns"] },
      { title: "Plugins",
        href: "/golangviz/concepts/plugins", bullets: [".so dynamic loading"] },
    ],
  },
  {
    id: "L14",
    badge: "🟩 Level 14 — Internals Deep Dive",
    blurb: "Runtime internals, GC internals, memory layout, channel/map/slice internals.",
    concepts: [
      { title: "Runtime Internals",
        href: "/golangviz/concepts/runtime-internals", bullets: ["Goroutine mgmt", "Scheduler ticks", "Allocator"] },
      { title: "GC Internals",
        href: "/golangviz/concepts/gc-internals", bullets: ["Tri-color", "Mutator assists", "Pacing"] },
      { title: "Memory Layout",
        href: "/golangviz/concepts/memory-layout", bullets: ["Object headers", "Pointer scanning"] },
      { title: "Channel Internals",
        href: "/golangviz/concepts/channel-internals", bullets: ["hchan", "Send/recv queues"] },
      { title: "Map Internals",
        href: "/golangviz/concepts/map-internals", bullets: ["Buckets/overflow", "Resizing"] },
      { title: "Slice Internals",
        href: "/golangviz/concepts/slice-internals", bullets: ["Growth strategy", "Zero-copy gotchas"] },
    ],
  },
  {
    id: "L15",
    badge: "🟦 Level 15 — Philosophy & Distributed",
    blurb: "Philosophy, anti-patterns, distributed systems, OSS patterns.",
    concepts: [
      { title: "Philosophy",
        href: "/golangviz/concepts/philosophy", bullets: ["Simplicity", "Minimalism", "Composition"] },
      { title: "Anti-patterns",
        href: "/golangviz/concepts/anti-patterns", bullets: ["Panic misuse", "Goroutine leaks", "Global state", "Unbounded channels"] },
      { title: "Distributed Systems",
        href: "/golangviz/concepts/distributed-systems", bullets: ["Concurrency models", "RPC systems", "Queues/workers"] },
      { title: "Open-source Patterns",
        href: "/golangviz/concepts/open-source-patterns", bullets: ["Idiomatic Go", "Effective Go", "go vet + linters"] },
    ],
  },
];

export function getConceptNavigation(currentHref: string) {
  const allConcepts = levels.flatMap((l) => l.concepts).filter((c) => c.href);
  const currentIndex = allConcepts.findIndex((c) => c.href === currentHref);

  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? allConcepts[currentIndex - 1] : null,
    next: currentIndex < allConcepts.length - 1 ? allConcepts[currentIndex + 1] : null,
  };
}