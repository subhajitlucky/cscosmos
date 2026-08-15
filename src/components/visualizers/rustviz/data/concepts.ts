export interface RustConcept {
  id: string;
  title: string;
  category: 'Memory & Ownership' | 'Borrowing & Lifetimes' | 'Smart Pointers' | 'Concurrency' | 'Advanced Systems';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  slug: string;
  readTime: string;
  keyTakeaways: string[];
  codeExample: string;
  explanation: string[];
  deepDive: {
    title: string;
    content: string;
    code?: string;
  }[];
  pitfallIds?: string[];
}

export const rustConcepts: RustConcept[] = [
  {
    id: 'ownership-moves',
    title: 'Ownership & Move Semantics',
    category: 'Memory & Ownership',
    difficulty: 'Beginner',
    slug: 'ownership-moves',
    readTime: '6 min',
    summary: 'How Rust manages memory without garbage collection through exclusive ownership, transfer semantics, and deterministic drops.',
    keyTakeaways: [
      'Each value in Rust has exactly one owner at any given time.',
      'When the owner goes out of scope, the value is automatically dropped (RAII).',
      'Assigning a non-Copy value transfers ownership (Move), invalidating the source binding.',
      'Types implementing the Copy trait perform bitwise shallow copies rather than moves.'
    ],
    codeExample: `fn main() {
    let s1 = String::from("Ferris");
    // Ownership of the heap buffer is transferred to s2.
    let s2 = s1; 

    // Error: use of moved value 's1' (E0382)
    // println!("{}", s1); 

    println!("s2 holds the buffer: {}", s2);
} // s2 is dropped here; heap memory is freed immediately.`,
    explanation: [
      "Rust achieves memory safety without a garbage collector through a strict set of compile-time rules called Ownership.",
      "Variables allocated on the stack (like integers, floats, booleans, and fixed arrays) implement the `Copy` trait. When assigned or passed into functions, their bits are duplicated on the stack with negligible cost.",
      "Heap-allocated types (like `String`, `Vec<T>`, and `Box<T>`) are represented on the stack as a 'Fat Pointer' consisting of: (1) pointer address, (2) capacity, and (3) length.",
      "When `s1` is assigned to `s2`, Rust simply copies the 24-byte stack descriptor from `s1` to `s2` and invalidates `s1`. This avoids expensive deep heap copies while preventing double-free vulnerabilities when variables fall out of scope."
    ],
    deepDive: [
      {
        title: 'Stack vs Heap Memory Layout',
        content: 'The stack stores local variables with known, fixed sizes at compile time. The heap stores dynamically sized or growable data. In a `String`, the stack holds pointer (8B), length (8B), and capacity (8B) on a 64-bit architecture.',
        code: `// Stack frame (24 bytes)
// [ ptr: 0x7fff0010 | cap: 8 | len: 6 ]
//                 │
//                 ▼
// Heap storage: [ 'F', 'e', 'r', 'r', 'i', 's' ]`
      },
      {
        title: 'Drop Flags and Stack Unwinding',
        content: 'The Rust compiler tracks whether a variable must be dropped using static analysis or single-bit "drop flags" on the stack frame when branches conditionally move ownership.',
        code: `fn conditional_move(condition: bool) {
    let s = String::from("allocated");
    if condition {
        consume(s); // Moved here conditionally
    }
    // Compiler injects: if (!s_dropped) { drop(s); }
}`
      }
    ],
    pitfallIds: ['e0382-moved-value', 'e0506-assign-while-borrowed']
  },
  {
    id: 'borrow-checker',
    title: 'The Borrow Checker & Aliasing XOR Mutability',
    category: 'Borrowing & Lifetimes',
    difficulty: 'Intermediate',
    slug: 'borrow-checker',
    readTime: '8 min',
    summary: 'Compile-time enforcement of the fundamental law of systems safety: multiple immutable readers OR exactly one mutable writer.',
    keyTakeaways: [
      'You may have any number of immutable references (&T) to a resource.',
      'OR you may have exactly one mutable reference (&mut T) to a resource.',
      'You can NEVER have both at the same time in the same scope.',
      'References must always be valid for their entire active lifetime (no dangling pointers).'
    ],
    codeExample: `fn main() {
    let mut data = vec![1, 2, 3];

    let r1 = &data;     // Shared reference (Reader 1)
    let r2 = &data;     // Shared reference (Reader 2)
    println!("Readers: {:?}, {:?}", r1, r2);

    // After r1 and r2 are no longer used (NLL):
    let w = &mut data;  // Exclusive mutable reference (Writer)
    w.push(4);
    println!("Updated: {:?}", w);
}`,
    explanation: [
      "The Borrow Checker enforces the 'Aliasing XOR Mutability' theorem at compile time, eliminating data races, iterator invalidation, and pointer corruption without runtime overhead.",
      "When a shared reference `&T` is active, the underlying target is frozen in place: neither the owner nor any other reference can mutate or move it.",
      "When a mutable reference `&mut T` is created, it asserts exclusive access. The original variable cannot be read or written directly until the mutable borrow expires.",
      "Thanks to Non-Lexical Lifetimes (NLL), a borrow ends at its last line of actual use rather than the end of the enclosing curly-brace block."
    ],
    deepDive: [
      {
        title: 'Iterator Invalidation Prevention',
        content: 'In C++ or JavaScript, pushing into a vector while looping over it can reallocate the backing buffer, causing undefined behavior or stale pointers. Rust catches this at compile time.',
        code: `let mut vec = vec![1, 2, 3];
for item in &vec { // &vec borrows immutable
    // vec.push(10); // COMPILE ERROR: cannot borrow \`vec\` as mutable
}`
      }
    ],
    pitfallIds: ['e0502-borrow-mut-immut', 'e0499-multiple-mut-borrows']
  },
  {
    id: 'non-lexical-lifetimes',
    title: 'Non-Lexical Lifetimes (NLL)',
    category: 'Borrowing & Lifetimes',
    difficulty: 'Intermediate',
    slug: 'non-lexical-lifetimes',
    readTime: '7 min',
    summary: 'How Rust 2018+ computes live ranges based on Control Flow Graphs (CFG) rather than rigid lexical scope blocks.',
    keyTakeaways: [
      'In Rust 2015, borrows lasted until the closing curly brace `}` of their lexical scope.',
      'NLL uses control flow graph (CFG) analysis to end borrows at their point of last actual use.',
      'Enables natural code patterns like modifying a hashmap entry right after checking a reference.',
      'Eliminates the need for artificial inner scope blocks `{ ... }` solely to drop references.'
    ],
    codeExample: `fn process_map(map: &mut std::collections::HashMap<String, i32>) {
    let key = String::from("score");
    
    // In Rust 2015, 'val' borrow extended to the end of the function!
    if let Some(val) = map.get(&key) {
        println!("Existing score: {}", val);
    } // Under NLL, immutable borrow of 'map' ends right here!

    // We can now immediately mutate 'map' without compiler error
    map.insert(key, 100); 
}`,
    explanation: [
      "Early Rust versions tied the lifetime of every reference strictly to the syntactic scope (`{ ... }`) where it was declared.",
      "Non-Lexical Lifetimes (NLL) revolutionized Rust borrow checking by analyzing the control flow graph. A borrow is considered live only at the exact CFG points where it can actually be dereferenced in future execution.",
      "If a reference is never read again after line 12, its loan is released at line 12, freeing the underlying variable for new exclusive borrows at line 13."
    ],
    deepDive: [
      {
        title: 'CFG Live Ranges vs Lexical Braces',
        content: 'NLL represents variables as sets of Mid-Level Intermediate Representation (MIR) control points where values are live.',
        code: `let mut x = 10;
let r = &x;     // Point A: Loan starts
println!("{}", r); // Point B: Last read of r! Loan ends here.
x = 20;         // Point C: Valid mutation under NLL (Error in 2015).`
      }
    ],
    pitfallIds: ['e0502-borrow-mut-immut']
  },
  {
    id: 'lifetimes-variance',
    title: 'Lifetimes, Elision & Variance',
    category: 'Borrowing & Lifetimes',
    difficulty: 'Advanced',
    slug: 'lifetimes-variance',
    readTime: '10 min',
    summary: 'Generic lifetime annotations (\'a), compiler elision rules, and subtyping relationships (Covariance vs Invariance).',
    keyTakeaways: [
      "Lifetimes do not change runtime duration; they are compile-time proof markers for the compiler's borrow checker.",
      "The 3 Lifetime Elision Rules allow omitting annotations in standard function signatures.",
      "Covariance (`&'a T`) allows substituting a longer lifetime where a shorter one is expected.",
      "Invariance (`&mut T`) forbids lifetime substitution to prevent inserting shorter-lived data into longer containers."
    ],
    codeExample: `// Lifetime 'a states: output reference is valid for as long as BOTH x and y are valid.
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let string1 = String::from("long string is long");
    let result;
    {
        let string2 = String::from("xyz");
        result = longest(string1.as_str(), string2.as_str());
        println!("Longest: {}", result);
    }
    // println!("{}", result); // Error: string2 dropped! (E0597)
}`,
    explanation: [
      "Every reference in Rust has an associated lifetime representing the span of code where the referenced data is guaranteed valid.",
      "When a function returns a reference derived from its input arguments, the compiler requires explicit lifetime annotations (e.g. `'a`) if it cannot disambiguate which input parameter the output borrows from.",
      "Variance describes how subtyping of lifetimes applies to composite types. Because `'static` outlives `'a`, `'static` is a subtype of `'a` (`'static: 'a`).",
      "Immutable references `&'a T` are covariant over `'a` and `T`. Mutable references `&'a mut T` are covariant over `'a` but invariant over `T`."
    ],
    deepDive: [
      {
        title: 'The 3 Lifetime Elision Rules',
        content: '1. Each elided lifetime in parameters becomes a distinct lifetime.\n2. If there is exactly one input lifetime parameter, that lifetime is assigned to all elided output lifetimes.\n3. If there are multiple input parameters and one is `&self` or `&mut self`, the lifetime of `self` is assigned to all output lifetimes.',
        code: `fn get_str(&self) -> &str 
// Desugars into:
fn get_str<'a>(&'a self) -> &'a str`
      }
    ],
    pitfallIds: ['e0597-does-not-live-long-enough', 'e0515-returns-local-ref']
  },
  {
    id: 'box-rc-arc',
    title: 'Smart Pointers: Box, Rc, and Arc',
    category: 'Smart Pointers',
    difficulty: 'Intermediate',
    slug: 'box-rc-arc',
    readTime: '8 min',
    summary: 'Memory indirection primitives for recursive data structures, single-threaded shared ownership, and atomic thread-safe reference counting.',
    keyTakeaways: [
      '`Box<T>` provides unique ownership of heap-allocated data with zero runtime overhead.',
      '`Rc<T>` enables multiple shared owners in a single thread via non-atomic reference counting.',
      '`Arc<T>` uses Atomic operations for thread-safe shared ownership across multiple threads.',
      '`Weak<T>` breaks reference cycles that would otherwise cause memory leaks.'
    ],
    codeExample: `use std::sync::Arc;
use std::thread;

fn main() {
    // Arc allows multi-threaded shared ownership
    let shared_state = Arc::new(vec![10, 20, 30]);

    let mut handles = vec![];
    for thread_id in 0..3 {
        let state_clone = Arc::clone(&shared_state); // Bumps atomic strong count
        handles.push(thread::spawn(move || {
            println!("Thread {}: len = {}", thread_id, state_clone.len());
        }));
    }

    for h in handles { h.join().unwrap(); }
    println!("Strong count: {}", Arc::strong_count(&shared_state));
}`,
    explanation: [
      "Smart pointers are data structures that act like pointers while offering metadata and capabilities like automatic resource management via the `Deref` and `Drop` traits.",
      "`Box<T>` puts data on the heap. It is essential for recursive types whose size cannot be calculated at compile time, such as linked lists and AST tree nodes.",
      "`Rc<T>` (Reference Counted) tracks the number of owners of a heap value. When a clone is made, the strong count increments; when an instance goes out of scope, it decrements. When it hits 0, the memory is freed.",
      "`Arc<T>` (Atomic Reference Counted) performs atomic increments and decrements, making it safe to send across threads at the cost of atomic synchronization instructions."
    ],
    deepDive: [
      {
        title: 'Rc/Arc Memory Layout',
        content: 'An `Rc<T>` pointer on the stack points to a heap header containing: `[ strong_count: usize | weak_count: usize | value: T ]`.',
        code: `// Stack               Heap
// ptr: 0x5000 ──────► [ strong: 2 | weak: 1 | data: "Payload" ]`
      }
    ],
    pitfallIds: ['e0277-trait-not-satisfied']
  },
  {
    id: 'interior-mutability',
    title: 'Interior Mutability: Cell, RefCell & Mutex',
    category: 'Smart Pointers',
    difficulty: 'Advanced',
    slug: 'interior-mutability',
    readTime: '9 min',
    summary: 'Bypassing static borrow checker restrictions when you have an immutable reference but need to mutate inner state.',
    keyTakeaways: [
      'Interior Mutability allows mutating data even through a shared `&T` reference.',
      '`Cell<T>` provides zero-overhead interior mutability for Copy types by moving values in and out.',
      '`RefCell<T>` enforces the borrow checking rules dynamically at runtime via `borrow()` and `borrow_mut()`.',
      '`Mutex<T>` and `RwLock<T>` provide thread-safe runtime mutual exclusion and synchronization.'
    ],
    codeExample: `use std::cell::RefCell;

struct Logger {
    log_count: RefCell<usize>, // Mutable even through &Logger
}

impl Logger {
    fn log(&self, msg: &str) {
        let mut count = self.log_count.borrow_mut(); // Runtime borrow check
        *count += 1;
        println!("[#{}] {}", *count, msg);
    }
}

fn main() {
    let logger = Logger { log_count: RefCell::new(0) };
    logger.log("Booting server..."); // &logger is immutable!
    logger.log("Connected to database.");
}`,
    explanation: [
      "Normally in Rust, having a shared reference `&T` strictly prevents mutation. Interior mutability uses `UnsafeCell<T>` under the hood to allow controlled mutation from an immutable exterior handle.",
      "`RefCell<T>` keeps an internal integer counter representing active loans: 0 = unborrowed, positive integer = number of active `&T` borrows, -1 = active `&mut T` borrow.",
      "If you call `.borrow_mut()` while an active `.borrow()` exists on the same thread, `RefCell` will panic at runtime rather than allow undefined memory corruption."
    ],
    deepDive: [
      {
        title: 'Compile-Time vs Runtime Safety',
        content: 'Compile-time borrow checking (`&T` / `&mut T`) has 0 runtime cost. `RefCell` trades slight runtime overhead and potential panics for flexibility in graph and observer patterns.',
        code: `let cell = RefCell::new(42);
let r1 = cell.borrow();
// let mut r2 = cell.borrow_mut(); // PANIC: AlreadyBorrowed`
      }
    ],
    pitfallIds: ['e0502-borrow-mut-immut']
  },
  {
    id: 'send-sync-concurrency',
    title: 'Fearless Concurrency: Send & Sync Traits',
    category: 'Concurrency',
    difficulty: 'Advanced',
    slug: 'send-sync-concurrency',
    readTime: '9 min',
    summary: 'The two foundational auto-traits that guarantee multi-threaded memory safety and compile-out data races.',
    keyTakeaways: [
      '`Send` indicates that ownership of the type can be transferred safely across thread boundaries.',
      '`Sync` indicates that references `&T` can be safely shared between multiple threads simultaneously.',
      'Relationship: `T: Sync` if and only if `&T: Send`.',
      'Types containing `Rc<T>` or `RefCell<T>` are `!Send` and `!Sync` due to non-atomic counters.'
    ],
    codeExample: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    // Arc<Mutex<T>> is Send + Sync, safe across threads
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..5 {
        let counter_clone = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            let mut num = counter_clone.lock().unwrap();
            *num += 1;
        }));
    }

    for h in handles { h.join().unwrap(); }
    println!("Final count: {}", *counter.lock().unwrap());
}`,
    explanation: [
      "Rust achieves 'Fearless Concurrency' through its type system. Concurrency bugs like data races are caught during compilation rather than producing production crashes.",
      "`Send` and `Sync` are 'Auto Traits': if all fields in a struct implement `Send`, the parent struct automatically implements `Send` without manual boilerplate.",
      "If you attempt to send an `Rc<T>` across a thread, the compiler halts with error 'E0277: Rc<T> cannot be sent between threads safely' because incrementing non-atomic reference counters from two threads simultaneously causes a data race."
    ],
    deepDive: [
      {
        title: 'Data Race Definition in Rust',
        content: 'A data race occurs when 2 or more pointers access the same memory location concurrently, at least one access is a write, and there is no synchronization. Rust makes this impossible in safe code.',
        code: `// Raw pointers are !Send and !Sync:
struct RawHandle {
    ptr: *mut u8, // Prevent accidental cross-thread transmission
}`
      }
    ],
    pitfallIds: ['e0277-trait-not-satisfied']
  },
  {
    id: 'channels-crossbeam',
    title: 'Message Passing & Channels (mpsc & crossbeam)',
    category: 'Concurrency',
    difficulty: 'Intermediate',
    slug: 'channels-crossbeam',
    readTime: '7 min',
    summary: 'Actor-style concurrency following the philosophy: Do not communicate by sharing memory; share memory by communicating.',
    keyTakeaways: [
      '`std::sync::mpsc` provides Multi-Producer, Single-Consumer FIFO queues.',
      'Unbounded channels (`channel()`) can grow infinitely in memory.',
      'Bounded channels (`sync_channel(N)`) apply backpressure, blocking senders when full.',
      'Crossbeam channels provide high-performance multi-producer multi-consumer (mpmc) with zero-alloc lock-free ring buffers.'
    ],
    codeExample: `use std::sync::mpsc;
use std::thread;
use std::time::Duration;

fn main() {
    let (tx, rx) = mpsc::channel();

    for id in 0..3 {
        let thread_tx = tx.clone();
        thread::spawn(move || {
            thread_tx.send(format!("Job #{} completed", id)).unwrap();
        });
    }
    drop(tx); // Drop original sender so receiver knows when stream ends!

    for msg in rx { // Iterates until all tx handles are dropped
        println!("Worker event: {}", msg);
    }
}`,
    explanation: [
      "Channels decouple producers and consumers, eliminating the need for shared mutable state and complex explicit mutex locking.",
      "When a sender transmits a value over a channel (`tx.send(val)`), ownership of `val` is transferred across the thread boundary. The sender can no longer access `val`.",
      "When all `Sender` instances are dropped, the channel automatically closes, allowing the receiver's iterator loop to terminate cleanly."
    ],
    deepDive: [
      {
        title: 'Bounded Backpressure vs Unbounded Queues',
        content: 'In high-throughput microservices, unbounded queues risk Out-Of-Memory (OOM) crashes if producers outpace consumers. `sync_channel(bound)` blocks `send()` until queue slots free up.',
        code: `let (tx, rx) = mpsc::sync_channel(2);
tx.send("A").unwrap(); // Ok
tx.send("B").unwrap(); // Ok
// tx.send("C").unwrap(); // Blocks until rx.recv() is called!`
      }
    ],
    pitfallIds: ['e0382-moved-value']
  },
  {
    id: 'tokio-async-runtime',
    title: 'Async Rust & Tokio Runtime Architecture',
    category: 'Concurrency',
    difficulty: 'Advanced',
    slug: 'tokio-async-runtime',
    readTime: '10 min',
    summary: 'Poll-based cooperative multitasking, zero-cost state machines, Wakers, and Tokio multi-threaded work-stealing reactor.',
    keyTakeaways: [
      'Rust Futures are lazy: they do nothing unless actively polled by an executor.',
      '`async fn` compiles into an anonymous state machine enum storing local variables across `.await` points.',
      '`Waker` allows an I/O source or timer to notify the runtime when a paused future is ready to be polled again.',
      'Tokio combines an OS I/O reactor (epoll/kqueue) with a multi-threaded work-stealing task scheduler.'
    ],
    codeExample: `use tokio::time::{sleep, Duration};

async fn fetch_metrics(service_id: u32) -> String {
    sleep(Duration::from_millis(50)).await; // Non-blocking yield
    format!("Service {} latency: 4ms", service_id)
}

#[tokio::main]
async fn main() {
    let task1 = tokio::spawn(fetch_metrics(1));
    let task2 = tokio::spawn(fetch_metrics(2));

    let (res1, res2) = tokio::join!(task1, task2);
    println!("Results: {:?}, {:?}", res1.unwrap(), res2.unwrap());
}`,
    explanation: [
      "Unlike Go goroutines or Node.js event loops, Async Rust futures do not allocate a separate stack or run automatically in the background.",
      "The `Future` trait defines a single required method: `fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>`.",
      "When a future returns `Poll::Pending`, it registers the current task's `Waker` with the event source. When the data arrives (e.g. packet on socket), the kernel signals Tokio via `epoll`, which wakes the task and puts it back onto the worker queue."
    ],
    deepDive: [
      {
        title: 'State Machine Transformation',
        content: 'The compiler translates each `.await` point into a distinct variant of an anonymous enum, capturing only the live variables that span across that suspension point.',
        code: `// Conceptual transformation:
enum FetchMetricsState {
    Start,
    WaitingOnSleep(tokio::time::Sleep),
    Done,
}`
      }
    ],
    pitfallIds: ['e0277-trait-not-satisfied']
  },
  {
    id: 'unsafe-rust-ffi',
    title: 'Unsafe Rust & The Invariant Boundary',
    category: 'Advanced Systems',
    difficulty: 'Advanced',
    slug: 'unsafe-rust-ffi',
    readTime: '10 min',
    summary: 'The superpowers of Unsafe Rust, raw pointers (*const T / *mut T), FFI boundaries, and maintaining soundness invariants.',
    keyTakeaways: [
      'Unsafe Rust does not disable the borrow checker; it grants 5 specific superpowers.',
      'The 5 superpowers: Dereferencing raw pointers, calling unsafe functions, implementing unsafe traits, mutating mutable statics, and accessing union fields.',
      'Soundness: Safe code calling your safe abstractions MUST NEVER trigger Undefined Behavior (UB).',
      'Miri is the official Undefined Behavior detection tool for interpreting Rust MIR.'
    ],
    codeExample: `fn split_at_mut<T>(slice: &mut [T], mid: usize) -> (&mut [T], &mut [T]) {
    let len = slice.len();
    let ptr = slice.as_mut_ptr();
    assert!(mid <= len);

    // Safe wrapper around unsafe pointer arithmetic
    unsafe {
        (
            std::slice::from_raw_parts_mut(ptr, mid),
            std::slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

fn main() {
    let mut numbers = vec![10, 20, 30, 40, 50];
    let (left, right) = split_at_mut(&mut numbers, 2);
    left[0] = 99;
    right[0] = 88;
    println!("Result: {:?}", numbers);
}`,
    explanation: [
      "Every systems language must occasionally talk directly to hardware, allocate raw memory, or bridge with C libraries. Rust isolates these operations inside `unsafe` blocks.",
      "The safe standard library data structures (`Vec`, `HashMap`, `Arc`, `Mutex`) are all implemented using Unsafe Rust wrapped in 100% sound, safe public APIs.",
      "A raw pointer (`*const T` or `*mut T`) can be null, unaligned, or dangling without error; the compiler only requires an `unsafe` block when you actually dereference (`*ptr`) it."
    ],
    deepDive: [
      {
        title: 'Undefined Behavior (UB) Rules in Rust',
        content: 'UB includes: Dereferencing null/dangling pointers, violating aliasing rules (e.g. creating `&mut` to the same memory as an existing reference), creating invalid enum discriminants, or producing uninitialized non-MaybeUninit memory.',
        code: `// Strict aliasing violation (Instant UB):
let mut x = 5;
let p = &mut x as *mut i32;
unsafe {
    let r1 = &mut *p;
    let r2 = &mut *p; // UB: Two simultaneous &mut references!
}`
      }
    ],
    pitfallIds: ['e0506-assign-while-borrowed']
  },
  {
    id: 'trait-objects-dispatch',
    title: 'Static vs Dynamic Dispatch (Generics vs dyn Trait)',
    category: 'Advanced Systems',
    difficulty: 'Intermediate',
    slug: 'trait-objects-dispatch',
    readTime: '8 min',
    summary: 'Monomorphization and inlining vs VTables and fat pointer trait objects (`Box<dyn Trait>`).',
    keyTakeaways: [
      'Static Dispatch (Generics / `impl Trait`) monomorphizes code at compile-time for maximum speed and zero-cost inlining.',
      'Dynamic Dispatch (`dyn Trait`) uses runtime VTables via a 16-byte fat pointer (data pointer + vtable pointer).',
      'Object Safety rules determine whether a trait can be turned into a `dyn Trait` object.',
      'Trait methods returning `Self` or containing generic type parameters are NOT object safe.'
    ],
    codeExample: `trait Drawer {
    fn draw(&self);
}

struct Button;
impl Drawer for Button { fn draw(&self) { println!("Drawing Button"); } }

struct Canvas;
impl Drawer for Canvas { fn draw(&self) { println!("Drawing Canvas"); } }

// Dynamic dispatch: Heterogeneous collection using fat pointers
fn render_all(items: &[Box<dyn Drawer>]) {
    for item in items {
        item.draw(); // Looks up fn pointer in VTable at runtime
    }
}

fn main() {
    let widgets: Vec<Box<dyn Drawer>> = vec![
        Box::new(Button),
        Box::new(Canvas),
    ];
    render_all(&widgets);
}`,
    explanation: [
      "Rust lets developers choose explicitly between compile-time code duplication (monomorphization) and runtime dynamic dispatch.",
      "With Generics (`fn draw<T: Drawer>(item: T)`), the compiler generates a specialized binary function for every concrete type used. This allows aggressive LLVM optimization and CPU instruction inlining.",
      "With `dyn Trait`, the value is represented as a fat pointer containing: (1) pointer to the concrete data on heap, and (2) pointer to the compiler-generated VTable containing function pointers and drop glue."
    ],
    deepDive: [
      {
        title: 'VTable Anatomy in Memory',
        content: 'The VTable contains: `[ destructor_ptr | size: usize | align: usize | method_1_ptr | method_2_ptr ... ]`.',
        code: `// Fat pointer on stack (16 bytes):
// [ data_ptr: 0x1000 | vtable_ptr: 0x8000 ]
//         │                  │
//         ▼                  ▼
// [ Button struct ]    [ drop_fn | size: 0 | align: 1 | draw_fn ]`
      }
    ],
    pitfallIds: ['e0277-trait-not-satisfied']
  },
  {
    id: 'raii-drop-hierarchy',
    title: 'Deterministic Destruction: RAII & The Drop Hierarchy',
    category: 'Memory & Ownership',
    difficulty: 'Intermediate',
    slug: 'raii-drop-hierarchy',
    readTime: '6 min',
    summary: 'How Rust guarantees deterministic cleanup of files, sockets, locks, and heap buffers the exact instant scopes exit.',
    keyTakeaways: [
      'Resource Acquisition Is Initialization (RAII) ties external resource lifespans to stack variable scopes.',
      'Fields in a struct are dropped in declaration order (top to bottom).',
      'Tuple elements and local variables are dropped in reverse declaration order (LIFO).',
      '`std::mem::forget` and `ManuallyDrop<T>` allow selectively bypassing Drop execution.'
    ],
    codeExample: `struct DatabaseLock {
    name: String,
}

impl Drop for DatabaseLock {
    fn drop(&mut self) {
        println!(">>> RAII: Lock '{}' released back to pool!", self.name);
    }
}

fn main() {
    {
        let _lock = DatabaseLock { name: String::from("users_table") };
        println!("Executing safe write transaction...");
    } // _lock falls out of scope here; drop() executes deterministically!

    println!("Transaction finalized.");
}`,
    explanation: [
      "In languages with a garbage collector (Java, Go, Python), memory is reclaimed unpredictably at a later time, meaning non-memory resources like file handles and mutex locks require manual closing.",
      "In Rust, destruction is 100% deterministic: when the enclosing block ends or a function returns, the compiler automatically invokes the `Drop::drop` method for every active resource in that scope.",
      "Even in the event of a panic, Rust automatically unwinds the stack, executing Drop destructors along the way to prevent resource leaks and database corruption."
    ],
    deepDive: [
      {
        title: 'Drop Order Rules',
        content: '1. Variables in a function are dropped in reverse order of declaration (LIFO stack).\n2. Fields inside a struct/enum are dropped in direct order of declaration.\n3. Vector elements are dropped from index 0 to len-1.',
        code: `struct Pair { a: String, b: String }
// When Pair drops: a is dropped first, then b.
let x = String::from("1");
let y = String::from("2");
// At scope exit: y drops first, then x.`
      }
    ],
    pitfallIds: ['e0506-assign-while-borrowed']
  }
];

export const rustCategories = [
  'All',
  'Memory & Ownership',
  'Borrowing & Lifetimes',
  'Smart Pointers',
  'Concurrency',
  'Advanced Systems'
] as const;
