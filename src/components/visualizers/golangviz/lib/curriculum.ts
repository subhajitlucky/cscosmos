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
      { title: "Conditionals", bullets: ["if, if with initializer, else-if"] },
      { title: "Switch", bullets: ["Multiple cases", "Condition switches", "Type switch"] },
      { title: "Loops", bullets: ["for", "range over slices/arrays/maps/strings", "Infinite loops"] },
      {
        title: "Error Handling",
        bullets: ["error type", "Create/return errors", "fmt.Errorf + %w", "errors.Is / errors.As"],
      },
    ],
  },
  {
    id: "L3",
    badge: "🔵 Level 3 — Functions",
    blurb: "Functions, closures, defer/panic/recover.",
    concepts: [
      { title: "Functions", bullets: ["Multiple returns", "Named returns", "Variadic"] },
      { title: "Anonymous & Closures", bullets: ["Closures, returning functions"] },
      { title: "Defer / Panic / Recover", bullets: ["Stack unwinding", "When to use defer", "Panic + recover patterns"] },
    ],
  },
  {
    id: "L4",
    badge: "🟣 Level 4 — Composite Data",
    blurb: "Arrays, slices, maps, structs, pointers.",
    concepts: [
      { title: "Arrays", bullets: ["Fixed size", "Value semantics", "Memory layout"] },
      {
        title: "Slices",
        bullets: ["Header (ptr, len, cap)", "Backing array", "Reslicing", "Append growth", "Copy"],
      },
      {
        title: "Maps",
        bullets: ["Hash table, buckets/overflow", "Lookup/insert/delete", "Iteration randomness", "nil vs empty maps"],
      },
      { title: "Structs", bullets: ["Definition", "Tags", "Anonymous fields", "Embedding"] },
      { title: "Pointers", bullets: ["& and *", "Pointer to array vs slice", "Value vs reference", "Escape basics"] },
    ],
  },
  {
    id: "L5",
    badge: "🔴 Level 5 — Methods & Interfaces",
    blurb: "Methods, method sets, interfaces, embedding.",
    concepts: [
      { title: "Methods", bullets: ["Value vs pointer receivers", "Method sets", "Mutability rules"] },
      {
        title: "Interfaces",
        bullets: ["Implicit impl", "Satisfaction", "Empty interface (any)", "Type assertions/switches", "itab + data ptr internals"],
      },
      { title: "Embedding Interfaces", bullets: ["Composing behavior", "Struct vs interface embedding"] },
      { title: "Polymorphism", bullets: ["Interface-based polymorphism (no inheritance)"] },
    ],
  },
  {
    id: "L6",
    badge: "⚫ Level 6 — Memory Model",
    blurb: "Stack/heap, GC, alignment, zero-copy patterns.",
    concepts: [
      { title: "Stack vs Heap", bullets: ["Escape analysis", "Allocation decisions", "Stack growth"] },
      { title: "Garbage Collector", bullets: ["Tracing GC", "Write barriers", "STW phases", "Tuning"] },
      { title: "Alignment & Padding", bullets: ["Struct alignment rules", "Minimizing padding"] },
      { title: "Zero-copy", bullets: ["Slices/maps share memory", "Large struct copy patterns"] },
    ],
  },
  {
    id: "L7",
    badge: "🟤 Level 7 — Runtime & Concurrency",
    blurb: "Goroutines, channels, select, sync, context, GMP.",
    concepts: [
      { title: "Goroutines", bullets: ["Lightweight threads", "Scheduler", "Stack growth", "Blocking vs non-blocking"] },
      { title: "Channels", bullets: ["Buffered/unbuffered", "Blocking sends", "Closing", "Range"] },
      { title: "Select", bullets: ["Multiple channel ops", "Default", "Fairness"] },
      { title: "Sync Primitives", bullets: ["Mutex/RWMutex", "WaitGroup", "Once/Map/Cond/Pool"] },
      { title: "Context", bullets: ["Propagation", "Deadlines", "Cancellation"] },
      { title: "Scheduler (GMP)", bullets: ["G/M/P", "Work stealing", "Preemption"] },
    ],
  },
  {
    id: "L8",
    badge: "🟩 Level 8 — Advanced Types",
    blurb: "Generics, type aliases, custom types.",
    concepts: [
      { title: "Generics", bullets: ["Type params", "Constraints", "comparable", "Generic structs/methods"] },
      { title: "Type Aliases", bullets: ["type T = OriginalType", "Migrations"] },
      { title: "Custom Types", bullets: ["Methods", "Implementing interfaces"] },
    ],
  },
  {
    id: "L9",
    badge: "🟧 Level 9 — File I/O & Systems",
    blurb: "Files, networking, encoding, CLI.",
    concepts: [
      { title: "File Handling", bullets: ["os pkg", "Read/write", "Scanners/readers"] },
      { title: "Networking", bullets: ["net TCP/UDP", "net/http", "HTTP server/client", "Middleware patterns"] },
      { title: "Encoding", bullets: ["JSON/YAML", "Custom marshalers", "Streaming decoders"] },
      { title: "CLI Tools", bullets: ["flags", "Cobra/Viper basics"] },
    ],
  },
  {
    id: "L10",
    badge: "🟨 Level 10 — Build & Deploy",
    blurb: "Modules, builds, packaging, perf tools.",
    concepts: [
      { title: "Go Modules", bullets: ["go mod init", "Deps/versioning"] },
      { title: "Build System", bullets: ["go build/run/install", "Cross compilation"] },
      { title: "Packaging", bullets: ["Publish modules", "replace directives"] },
      { title: "Performance Tools", bullets: ["Benchmarks", "pprof", "Tracing", "Race detector"] },
    ],
  },
  {
    id: "L11",
    badge: "🟪 Level 11 — Runtime & Compiler (Expert)",
    blurb: "Escape analysis deep, inlining, flags, linker.",
    concepts: [
      { title: "Escape Analysis (deep)", bullets: ["Rules", "Heap vs stack control"] },
      { title: "Inlining", bullets: ["Inlining rules"] },
      { title: "Compiler Flags", bullets: ["-gcflags", "-ldflags", "Build tags"] },
      { title: "Linker Internals", bullets: ["DCE", "Symbol resolution"] },
      { title: "Goroutine Leak Detection", bullets: ["Memory/channel leaks"] },
    ],
  },
  {
    id: "L12",
    badge: "🔥 Level 12 — Architecture & Practices",
    blurb: "Project structure, DI, clean architecture, testing, logging, microservices.",
    concepts: [
      { title: "Project Structure", bullets: ["Standard layout", "DDD"] },
      { title: "Dependency Injection", bullets: ["No-framework DI", "Wire/Fx (optional)"] },
      { title: "Clean Architecture", bullets: ["Entities, use cases, repos, services"] },
      { title: "Testing", bullets: ["Unit, table-driven, mocks, integration"] },
      { title: "Logging", bullets: ["Structured logs", "Zap/Zerolog"] },
      { title: "Microservices", bullets: ["gRPC/Protobuf", "REST", "Async messaging"] },
    ],
  },
  {
    id: "L13",
    badge: "🟫 Level 13 — Specialized Topics",
    blurb: "Unsafe, atomics, WASM, reflection, plugins.",
    concepts: [
      { title: "Unsafe", bullets: ["Pointer ops", "Reinterpretation", "Risks"] },
      { title: "Atomic Operations", bullets: ["sync/atomic", "CAS", "Barriers"] },
      { title: "WASM", bullets: ["Go in the browser"] },
      { title: "Reflection", bullets: ["reflect pkg", "Framework patterns"] },
      { title: "Plugins", bullets: [".so dynamic loading"] },
    ],
  },
  {
    id: "L14",
    badge: "🟩 Level 14 — Internals Deep Dive",
    blurb: "Runtime internals, GC internals, memory layout, channel/map/slice internals.",
    concepts: [
      { title: "Runtime Internals", bullets: ["Goroutine mgmt", "Scheduler ticks", "Allocator"] },
      { title: "GC Internals", bullets: ["Tri-color", "Mutator assists", "Pacing"] },
      { title: "Memory Layout", bullets: ["Object headers", "Pointer scanning"] },
      { title: "Channel Internals", bullets: ["hchan", "Send/recv queues"] },
      { title: "Map Internals", bullets: ["Buckets/overflow", "Resizing"] },
      { title: "Slice Internals", bullets: ["Growth strategy", "Zero-copy gotchas"] },
    ],
  },
  {
    id: "L15",
    badge: "🟦 Level 15 — Philosophy & Distributed",
    blurb: "Philosophy, anti-patterns, distributed systems, OSS patterns.",
    concepts: [
      { title: "Philosophy", bullets: ["Simplicity", "Minimalism", "Composition"] },
      { title: "Anti-patterns", bullets: ["Panic misuse", "Goroutine leaks", "Global state", "Unbounded channels"] },
      { title: "Distributed Systems", bullets: ["Concurrency models", "RPC systems", "Queues/workers"] },
      { title: "Open-source Patterns", bullets: ["Idiomatic Go", "Effective Go", "go vet + linters"] },
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