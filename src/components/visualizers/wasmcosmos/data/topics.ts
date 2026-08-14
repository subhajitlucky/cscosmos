export interface WasmTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Wasm Foundations & Format' | 'Stack Machine & Execution' | 'Linear Memory & JS Bridge' | 'WASI & System Interfaces' | 'Toolchains & Component Model';
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  optimization: string;
  watSnippet: string;
  jsBridgeSnippet: string;
  outputDescription: string;
  related: string[];
}

export interface WasmTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: WasmTopic[];
}

export const wasmTopics: WasmTopic[] = [
  // 1. Foundations & Format
  {
    id: 'wasm-binary-format',
    title: 'WASM Binary Format & Magic Bytes',
    kicker: 'Foundations / 01',
    group: 'Wasm Foundations & Format',
    difficulty: 'starter',
    summary: 'The structure of .wasm binary modules, magic preamble 0x00 0x61 0x73 0x6d, and section tables.',
    definition: 'WebAssembly (WASM) is a compact binary instruction format designed for near-native execution speed. Every valid .wasm file begins with a 4-byte magic preamble (\\0asm) followed by a 4-byte version number (0x01), divided into sequential numbered sections (Type, Import, Function, Table, Memory, Export, Code).',
    analogy: 'A standardized shipping manifest: the first 8 bytes certify the container format, and subsequent numbered compartments store specific cargo (function signatures, memory quotas, executable machine opcodes).',
    steps: [
      'Engine reads 8-byte preamble: \\0asm (0x00 0x61 0x73 0x6d) + version 1 (0x01 0x00 0x00 0x00)',
      'Section 1 (Type Section): Decodes function parameter and return type signatures',
      'Section 3 (Function Section): Maps function indices to declared type signatures',
      'Section 7 (Export Section): Exposes named functions to the host environment (JavaScript)',
      'Section 10 (Code Section): Contains raw bytecode bodies for each function'
    ],
    mistakes: [
      'Attempting to edit binary .wasm files manually without using the WebAssembly Text Format (WAT)',
      'Assuming Wasm replaces JavaScript instead of acting as a high-performance co-processor alongside it',
      'Forgetting that Wasm modules are sandboxed and cannot access the DOM or network directly without host imports'
    ],
    optimization: 'Wasm binary bytecode parses at single-pass linear time (~10-20x faster than JavaScript source text parsing), allowing immediate streaming compilation via WebAssembly.compileStreaming().',
    watSnippet: `(module
  ;; Function Signature (Type Section)
  (func $add (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add)
  ;; Export to Host (Export Section)
  (export "add" (func $add))
)`,
    jsBridgeSnippet: `// Streaming Compilation & Instantiation
const response = await fetch('/math.wasm');
const { instance } = await WebAssembly.instantiateStreaming(response);
const result = instance.exports.add(40, 2);
console.log('Wasm result:', result); // 42`,
    outputDescription: 'Compiles in streaming chunks directly from the network socket and executes add() at near-native CPU speeds.',
    related: ['stack-machine-opcodes', 'wat-text-format', 'linear-memory-basics']
  },
  {
    id: 'wat-text-format',
    title: 'WAT (WebAssembly Text Format) & S-Expressions',
    kicker: 'Foundations / 02',
    group: 'Wasm Foundations & Format',
    difficulty: 'intermediate',
    summary: 'Reading and writing human-readable S-expressions, module declarations, and function signatures.',
    definition: 'WAT (WebAssembly Text Format) represents binary WebAssembly as nested S-expressions (symbolic expressions in Lisp-like parentheses). Tools like wat2wasm and wasm2wat convert bidirectionally between human-readable .wat and binary .wasm without loss.',
    analogy: 'Sheet music for a symphony: WAT is the readable musical score that composers write and analyze, while WASM is the encoded binary data stream fed to an electronic synthesizer.',
    steps: [
      'Wrap module in root (module ...) expression',
      'Declare typed functions with (param ...) and (result ...)',
      'Use structured control flow or linear stack instructions',
      'Export functions using (export "name" (func $id))',
      'Compile with wat2wasm to generate production .wasm binary'
    ],
    mistakes: [
      'Mixing up integer types (i32 vs i64) in function return declarations',
      'Forgetting that parameters are zero-indexed local variables in WAT scope'
    ],
    optimization: 'Folding linear instructions into nested S-expressions ((i32.add (local.get $a) (local.get $b))) makes complex mathematical pipelines readable while compiling to identical linear bytecode.',
    watSnippet: `(module
  (func $square (param $n f64) (result f64)
    (f64.mul (local.get $n) (local.get $n))
  )
  (export "square" (func $square))
)`,
    jsBridgeSnippet: `const watModule = await WebAssembly.instantiate(wasmBytes);
console.log(watModule.instance.exports.square(9.0)); // 81.0`,
    outputDescription: 'Computes 64-bit IEEE 754 floating-point square with zero JIT warmup overhead.',
    related: ['wasm-binary-format', 'stack-machine-opcodes', 'control-flow-blocks']
  },

  // 2. Stack Machine
  {
    id: 'stack-machine-opcodes',
    title: 'Stack Machine & Bytecode Evaluation',
    kicker: 'Execution / 01',
    group: 'Stack Machine & Execution',
    difficulty: 'intermediate',
    summary: 'How the evaluation stack pushes operands, pops arguments, and computes results.',
    definition: 'Unlike hardware CPUs with physical registers (x86 RAX/RBX, ARM r0/r1), WebAssembly is a virtual Stack Machine. Instructions push values (i32, i64, f32, f64) onto an implicit evaluation stack and pop operands for mathematical and logical operations.',
    analogy: 'A spring-loaded plate dispenser in a cafeteria: you push plates onto the top of the stack, and arithmetic operators grab the top two plates to calculate the sum, pushing the answer back on top.',
    steps: [
      'Instruction i32.const 10 pushes 10 onto the evaluation stack: [10]',
      'Instruction i32.const 25 pushes 25 onto the evaluation stack: [10, 25]',
      'Instruction i32.add pops 25 and 10, calculates 10 + 25 = 35',
      'i32.add pushes result 35 onto the stack: [35]',
      'Function returns the remaining top-of-stack value to the caller'
    ],
    mistakes: [
      'Leaving unconsumed orphan values on the evaluation stack at function exit (causes type-checker validation failure)',
      'Attempting to pop an empty stack (underflow error during validation)',
      'Assuming stack operations involve slow RAM (modern Wasm JIT engines map virtual stack slots directly to physical CPU registers)'
    ],
    optimization: 'Single-pass register allocation converts abstract stack bytecode into optimal register-to-register assembly instructions (e.g. ADD EAX, EBX) during compilation.',
    watSnippet: `(module
  (func $calc (result i32)
    i32.const 100
    i32.const 20
    i32.div_s   ;; 100 / 20 = 5
    i32.const 7
    i32.mul     ;; 5 * 7 = 35
  )
  (export "calc" (func $calc))
)`,
    jsBridgeSnippet: `const { instance } = await WebAssembly.instantiate(wasmBytes);
console.log('Computed value:', instance.exports.calc()); // 35`,
    outputDescription: 'Executes stack arithmetic chain in a single clock cycle on host hardware.',
    related: ['control-flow-blocks', 'wasm-binary-format', 'linear-memory-basics']
  },
  {
    id: 'control-flow-blocks',
    title: 'Structured Control Flow (Block, Loop, Br_if)',
    kicker: 'Execution / 02',
    group: 'Stack Machine & Execution',
    difficulty: 'advanced',
    summary: 'Why Wasm bans arbitrary goto jumps in favor of structured block, loop, and branch labels.',
    definition: 'To guarantee verifiable memory safety and prevent malicious code exploits, WebAssembly strictly prohibits arbitrary goto jumps. Instead, it enforces Structured Control Flow using block, loop, if/else, and branch instructions (br, br_if, br_table).',
    analogy: 'A secure train track switch: trains can only advance forward through approved block gates or loop back to designated turnaround roundabouts, preventing derailments onto arbitrary rails.',
    steps: [
      'block $B: A forward-branching construct. A branch (br $B) jumps OUT of the block to the end',
      'loop $L: A backward-branching construct. A branch (br $L) jumps back to the TOP of the loop',
      'Condition is evaluated on the stack and popped by br_if',
      'Nested control structures validate operand stack balance statically before execution',
      'Guarantees all branches are provably well-formed at compile time'
    ],
    mistakes: [
      'Confusing loop branching semantics: br inside a loop jumps to the start (continue), whereas br inside a block jumps to the end (break)',
      'Failing to leave the stack in a balanced state across both branches of an if/else'
    ],
    optimization: 'Structured control flow allows the JIT engine to validate and verify 100% of branch targets in a single sequential linear pass without expensive graph analysis.',
    watSnippet: `(module
  (func $sumToN (param $n i32) (result i32)
    (local $i i32)
    (local $sum i32)
    (block $exit
      (loop $repeat
        ;; if ($i == $n) break
        (br_if $exit (i32.eq (local.get $i) (local.get $n)))
        ;; $i = $i + 1
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        ;; $sum = $sum + $i
        (local.set $sum (i32.add (local.get $sum) (local.get $i)))
        ;; continue loop
        (br $repeat)
      )
    )
    (local.get $sum)
  )
  (export "sumToN" (func $sumToN))
)`,
    jsBridgeSnippet: `const { instance } = await WebAssembly.instantiate(wasmBytes);
console.log('Sum 1..100:', instance.exports.sumToN(100)); // 5050`,
    outputDescription: 'Computes mathematical summation loop with zero branch prediction misses.',
    related: ['stack-machine-opcodes', 'wasm-binary-format', 'toolchain-compilation']
  },

  // 3. Linear Memory
  {
    id: 'linear-memory-basics',
    title: 'Linear Memory & ArrayBuffer Sharing',
    kicker: 'Memory / 01',
    group: 'Linear Memory & JS Bridge',
    difficulty: 'advanced',
    summary: 'Managing 64KB memory pages, raw byte manipulation, and sharing memory with JavaScript TypedArrays.',
    definition: 'WebAssembly manages memory as a single contiguous, mutable byte array called Linear Memory. Allocated in fixed 64KB pages, Linear Memory is represented in JavaScript as a standard WebAssembly.Memory object wrapping an ArrayBuffer, allowing zero-copy sharing between JS and Wasm.',
    analogy: 'A shared whiteboard grid divided into 65,536-character pages: both the JavaScript painter and the Wasm mathematician can read and write raw bytes at exact coordinate offsets.',
    steps: [
      'Declare memory module: (memory (export "mem") 1) (1 page = 64KB = 65,536 bytes)',
      'Store bytes from Wasm using i32.store, i32.store8, or f64.store at byte offset',
      'JavaScript creates a TypedArray view: new Uint8Array(memory.buffer)',
      'Both JavaScript and Wasm read/write identical memory addresses without copying',
      'Memory dynamically expands on demand using memory.grow(additionalPages)'
    ],
    mistakes: [
      'Caching a JavaScript TypedArray view across a memory.grow() call (growing memory detaches and invalidates the previous ArrayBuffer)',
      'Writing past the allocated page bounds (causes an out-of-bounds trap)',
      'Assuming memory is garbage collected (Wasm linear memory must be manually managed with malloc/free or Rust allocator)'
    ],
    optimization: 'Zero-copy ArrayBuffer memory sharing allows passing 4K video frames or multi-megabyte image buffers to Wasm with 0ms transfer latency.',
    watSnippet: `(module
  (memory (export "memory") 1) ;; 1 page = 64 KiB
  ;; Store integer at memory offset
  (func $write (param $offset i32) (param $val i32)
    local.get $offset
    local.get $val
    i32.store)
  (export "write" (func $write))
)`,
    jsBridgeSnippet: `const memory = new WebAssembly.Memory({ initial: 1 });
const { instance } = await WebAssembly.instantiate(wasmBytes, { env: { memory } });

instance.exports.write(0, 42); // Store 42 at byte index 0

const view = new Int32Array(memory.buffer);
console.log('Read from JS buffer:', view[0]); // 42`,
    outputDescription: 'Demonstrates zero-copy bidirectional read/write between Wasm and JavaScript memory.',
    related: ['string-marshalling-bridge', 'wasm-binary-format', 'stack-machine-opcodes']
  },
  {
    id: 'string-marshalling-bridge',
    title: 'String & Object Marshalling Bridge',
    kicker: 'Memory / 02',
    group: 'Linear Memory & JS Bridge',
    difficulty: 'expert',
    summary: 'Encoding UTF-8 strings into Linear Memory, passing pointers, and decoding return buffers.',
    definition: 'WebAssembly natively understands only numeric primitives (i32, i64, f32, f64). To pass strings, JSON, or complex objects, strings must be encoded as UTF-8 bytes into Linear Memory, passing (ptr, len) coordinate pairs across the foreign function interface (FFI).',
    analogy: 'Translating a book across international borders: you encode the words into numeric telegraph pulses, send the start address and word count, and decode the pulses back into text on the receiving end.',
    steps: [
      'JavaScript encodes string using TextEncoder: const bytes = new TextEncoder().encode("Hello")',
      'Calls Wasm allocator function (e.g. malloc(bytes.length)) to receive memory pointer ptr',
      'Copies encoded bytes into new Uint8Array(wasmMemory.buffer, ptr, bytes.length)',
      'Invokes Wasm function passing ptr and bytes.length as arguments',
      'Decodes return buffer using TextDecoder: new TextDecoder().decode(subArray)'
    ],
    mistakes: [
      'Attempting to pass raw JavaScript string objects directly into Wasm function arguments',
      'Forgetting to free allocated string pointers resulting in unrecoverable memory leaks',
      'Ignoring UTF-8 multi-byte characters (emoji, accents) causing byte length truncation'
    ],
    optimization: 'Tools like wasm-bindgen automate pointer allocation, UTF-8 transcoding, and cleanup with zero boilerplate.',
    watSnippet: `(module
  (memory (export "memory") 1)
  ;; Stores "WASM" (0x57, 0x41, 0x53, 0x4d) in data section at offset 0
  (data (i32.const 0) "WASM")
  (func $getStringPtr (result i32)
    i32.const 0)
  (func $getStringLen (result i32)
    i32.const 4)
  (export "getStringPtr" (func $getStringPtr))
  (export "getStringLen" (func $getStringLen))
)`,
    jsBridgeSnippet: `const { instance } = await WebAssembly.instantiate(wasmBytes);
const ptr = instance.exports.getStringPtr();
const len = instance.exports.getStringLen();
const bytes = new Uint8Array(instance.exports.memory.buffer, ptr, len);
const str = new TextDecoder().decode(bytes);
console.log('Decoded Wasm String:', str); // "WASM"`,
    outputDescription: 'Transfers string data seamlessly across the JS-Wasm boundary.',
    related: ['linear-memory-basics', 'toolchain-compilation', 'wasi-system-interface']
  },

  // 4. WASI & Systems
  {
    id: 'wasi-system-interface',
    title: 'WASI (WebAssembly System Interface)',
    kicker: 'Systems / 01',
    group: 'WASI & System Interfaces',
    difficulty: 'advanced',
    summary: 'Running WebAssembly outside the browser with POSIX-style sandboxed filesystem and network access.',
    definition: 'WASI (WebAssembly System Interface) is a standardized set of POSIX-like system calls designed to run Wasm securely on servers, edge runtimes, and local machines (via Wasmtime, Wasmer, Node.js). WASI uses capability-based security: a program has 0 access to files or network unless explicitly granted by the host.',
    analogy: 'A guest visiting an office building: they cannot roam anywhere in the building unless a security guard specifically programs their keycard with exact access to Room 302.',
    steps: [
      'Wasm module imports WASI syscalls: fd_read, fd_write, clock_time_get',
      'Host runtime (Wasmtime/Node) pre-opens allowed directories (--dir=/tmp)',
      'Module invokes fd_write(1, ...) to write to standard output stdout',
      'Runtime enforces capability boundary: requests outside granted directories are rejected with EACCES',
      'Enables true "write once, run securely anywhere" portability'
    ],
    mistakes: [
      'Assuming WASI modules can read arbitrary files like /etc/passwd without pre-opened capability grants',
      'Using browser-specific DOM APIs inside a non-browser WASI standalone executable'
    ],
    optimization: 'WASI micro-virtual machines cold-start in sub-millisecond speeds (~100 microseconds), outperforming Docker containers by 1,000x for edge serverless functions.',
    watSnippet: `(module
  ;; Import WASI fd_write from host
  (import "wasi_snapshot_preview1" "fd_write"
    (func $fd_write (param i32 i32 i32 i32) (result i32)))
  (memory (export "memory") 1)
  ;; Stores "Hello WASI\\n" at offset 8
  (data (i32.const 8) "Hello WASI\\n")
  (func $main (export "_start")
    ;; Setup iovec structure at offset 0: [ptr=8, len=11]
    (i32.store (i32.const 0) (i32.const 8))
    (i32.store (i32.const 4) (i32.const 11))
    ;; Call fd_write(1 (stdout), iovs_ptr=0, iovs_len=1, nwritten_ptr=20)
    (drop (call $fd_write (i32.const 1) (i32.const 0) (i32.const 1) (i32.const 20)))
  )
)`,
    jsBridgeSnippet: `// Node.js WASI Runner
import { WASI } from 'wasi';
import fs from 'fs';

const wasi = new WASI({ version: 'preview1' });
const wasm = await WebAssembly.compile(fs.readFileSync('hello.wasm'));
const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());
wasi.start(instance); // Prints "Hello WASI"`,
    outputDescription: 'Executes secure sandboxed CLI program on server with zero operating system vulnerabilities.',
    related: ['string-marshalling-bridge', 'wasm-binary-format', 'component-model']
  },

  // 5. Toolchains & Future
  {
    id: 'toolchain-compilation',
    title: 'Rust & C++ Toolchains (wasm-pack & Emscripten)',
    kicker: 'Toolchains / 01',
    group: 'Toolchains & Component Model',
    difficulty: 'advanced',
    summary: 'Compiling high-performance Rust and C/C++ codebases into optimized .wasm packages.',
    definition: 'Rather than writing raw WAT by hand, developers author compute-heavy algorithms in Rust (using wasm-pack and wasm-bindgen) or C/C++ (using Emscripten). The LLVM compiler backend optimizes algorithms with SIMD vectorization and strips dead code into ultra-compact .wasm binaries.',
    analogy: 'Translating high-level architectural blueprints (Rust/C++) through an industrial automated precision machine tool into microchips ready for instant deployment.',
    steps: [
      'Author compute logic in Rust: #[wasm_bindgen] pub fn fast_blur(img: &[u8]) -> Vec<u8>',
      'Run wasm-pack build --target web --release',
      'LLVM optimizes with -O3 and wasm-opt runs binary size shrinking',
      'Emits .wasm binary, TypeScript type definitions, and JavaScript glue wrappers',
      'Import directly in React/Next.js: import init, { fast_blur } from "./pkg/blur.js"'
    ],
    mistakes: [
      'Building without --release mode resulting in 10x larger unoptimized debug Wasm files',
      'Pulling in heavy standard library dependencies (like full formatting engines) when minimal crates suffice'
    ],
    optimization: 'Running wasm-opt -Oz (from Binaryen) performs dead-code elimination, inlining, and tree-shaking, shrinking Wasm binary sizes by up to 40%.',
    watSnippet: `// Rust Source (src/lib.rs)
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}`,
    jsBridgeSnippet: `import init, { fibonacci } from './pkg/rust_wasm.js';
await init();
console.log('Fibonacci(40):', fibonacci(40)); // Instant calculation`,
    outputDescription: 'Computes heavy recursive Fibonacci in milliseconds without freezing the browser UI thread.',
    related: ['wasi-system-interface', 'string-marshalling-bridge', 'component-model']
  },
  {
    id: 'component-model',
    title: 'WebAssembly Component Model & WIT',
    kicker: 'Toolchains / 02',
    group: 'Toolchains & Component Model',
    difficulty: 'expert',
    summary: 'Language-agnostic composable micro-modules using WebAssembly Interface Types (WIT).',
    definition: 'The WebAssembly Component Model represents the next evolution of software modularity. By defining typed interfaces in WIT (Wasm Interface Type), a component written in Rust can seamlessly link and call a component written in Python or Go with zero manual serialization glue.',
    analogy: 'Universal USB-C ports for software: any module written in any language snaps directly into any other module with guaranteed type safety and zero data friction.',
    steps: [
      'Define interface in world.wit: interface calculator { add: func(a: s32, b: s32) -> s32; }',
      'Rust component implements calculator interface',
      'Python/TypeScript host imports and binds the component with full type safety',
      'Canonical ABI transparently marshals strings, records, variants, and lists',
      'Enables composable, polyglot software ecosystems across cloud and edge'
    ],
    mistakes: [
      'Writing custom ad-hoc JSON serializers between Wasm modules instead of standard WIT interfaces',
      'Confusing core Wasm modules (.wasm) with higher-level Wasm components'
    ],
    optimization: 'Canonical ABI eliminates custom marshalling overhead, allowing direct structured data exchange between polyglot languages at native hardware memory speeds.',
    watSnippet: `;; WIT Interface Definition (calculator.wit)
package cosmos:math;

interface calculator {
  add: func(a: s32, b: s32) -> s32;
  multiply: func(a: s32, b: s32) -> s32;
}`,
    jsBridgeSnippet: `// Composable Component Linkage
import { calculator } from './calculator.component.wasm';
console.log(calculator.add(50, 50)); // 100`,
    outputDescription: 'Polyglot component interoperability without glue code.',
    related: ['toolchain-compilation', 'wasi-system-interface', 'wasm-binary-format']
  }
];

export const wasmTopicGroups: WasmTopicGroup[] = [
  {
    id: 'foundations',
    name: 'Wasm Foundations & Format',
    description: 'Binary format magic bytes, section tables, and human-readable WAT S-expressions.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: wasmTopics.filter(t => t.group === 'Wasm Foundations & Format')
  },
  {
    id: 'execution',
    name: 'Stack Machine & Execution',
    description: 'Virtual stack evaluation, operand pushes/pops, and structured control flow blocks.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: wasmTopics.filter(t => t.group === 'Stack Machine & Execution')
  },
  {
    id: 'memory',
    name: 'Linear Memory & JS Bridge',
    description: '64KB page allocations, shared ArrayBuffers, zero-copy pointers, and string marshalling.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: wasmTopics.filter(t => t.group === 'Linear Memory & JS Bridge')
  },
  {
    id: 'wasi',
    name: 'WASI & System Interfaces',
    description: 'Capability-based sandboxing, POSIX-style system calls, and standalone serverless Wasm.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: wasmTopics.filter(t => t.group === 'WASI & System Interfaces')
  },
  {
    id: 'toolchains',
    name: 'Toolchains & Component Model',
    description: 'Compiling Rust/C++ with wasm-pack and composable polyglot modules with WIT interfaces.',
    badgeColor: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
    topics: wasmTopics.filter(t => t.group === 'Toolchains & Component Model')
  }
];

export const getWasmTopic = (id: string) => wasmTopics.find(t => t.id === id);
