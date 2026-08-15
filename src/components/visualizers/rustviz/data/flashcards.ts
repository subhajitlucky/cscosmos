export interface RustFlashcard {
  id: string;
  category: 'Ownership' | 'Borrowing' | 'Memory Layout' | 'Smart Pointers' | 'Concurrency' | 'Traits & Generics' | 'Async';
  question: string;
  answer: string;
  codeSnippet?: string;
  explanation: string;
}

export const rustFlashcards: RustFlashcard[] = [
  {
    id: 'fc-1',
    category: 'Ownership',
    question: 'What happens when a String is assigned from variable A to variable B in Rust?',
    answer: 'Ownership of the heap buffer is moved to B; variable A is statically invalidated and can no longer be used.',
    codeSnippet: 'let a = String::from("Rust");\nlet b = a; // Move: a is now invalidated',
    explanation: 'Rust copies the 24-byte stack descriptor (pointer, capacity, length) to B without reallocating the heap buffer, avoiding double-free and deep copy overhead.'
  },
  {
    id: 'fc-2',
    category: 'Borrowing',
    question: 'What is the core rule of the Rust Borrow Checker regarding aliasing and mutability?',
    answer: 'You may have ANY number of immutable references (&T) OR exactly ONE mutable reference (&mut T), but never both in the same scope.',
    explanation: 'This "Aliasing XOR Mutability" theorem guarantees that no code can mutate memory while another piece of code is concurrently reading or writing it.'
  },
  {
    id: 'fc-3',
    category: 'Memory Layout',
    question: 'What does a fat pointer for a slice `&[T]` contain on a 64-bit architecture?',
    answer: '16 bytes: an 8-byte pointer to the first element and an 8-byte length count.',
    codeSnippet: '// &[T] stack footprint (16 bytes):\n// [ ptr: *const T (8B) | len: usize (8B) ]',
    explanation: 'Unlike C array pointers that decay to raw memory addresses, Rust slices carry their length alongside the pointer for instant bounds checking.'
  },
  {
    id: 'fc-4',
    category: 'Memory Layout',
    question: 'What is the stack footprint of `String` or `Vec<T>`?',
    answer: '24 bytes: 8-byte pointer, 8-byte capacity, and 8-byte length.',
    codeSnippet: '// Vec<T> stack frame (24 bytes):\n// [ ptr: *mut T (8B) | cap: usize (8B) | len: usize (8B) ]',
    explanation: 'When capacity is exceeded during a push, a new heap buffer is allocated, existing elements are moved, and the old buffer is deallocated.'
  },
  {
    id: 'fc-5',
    category: 'Concurrency',
    question: 'What is the difference between the `Send` and `Sync` traits?',
    answer: '`Send` indicates ownership can be transferred across threads. `Sync` indicates references (&T) can be shared safely across threads.',
    codeSnippet: '// Relationship:\n// T is Sync <=> &T is Send',
    explanation: 'If a type has non-atomic shared state (like `Rc<T>`), it is neither Send nor Sync. If a type is `Mutex<T>`, it is Send + Sync if T is Send.'
  },
  {
    id: 'fc-6',
    category: 'Smart Pointers',
    question: 'Why would you use `Arc<Mutex<T>>` instead of `Rc<RefCell<T>>`?',
    answer: '`Arc<Mutex<T>>` is thread-safe (implements Send + Sync), whereas `Rc<RefCell<T>>` is strictly single-threaded.',
    explanation: '`Arc` uses atomic CPU instructions for reference counting and `Mutex` uses OS/futex locks for mutual exclusion across threads.'
  },
  {
    id: 'fc-7',
    category: 'Borrowing',
    question: 'What is Non-Lexical Lifetimes (NLL)?',
    answer: 'A borrow checking model where borrows end at their point of last actual use rather than the syntactic closing brace `}` of their block.',
    explanation: 'Introduced in Rust 2018, NLL analyzes the Control Flow Graph (MIR CFG) to free loans as soon as they are no longer referenced.'
  },
  {
    id: 'fc-8',
    category: 'Traits & Generics',
    question: 'What is the trade-off between Static Dispatch (Generics) and Dynamic Dispatch (`dyn Trait`)?',
    answer: 'Static dispatch produces inlined, specialized code with 0 runtime cost (larger binary); Dynamic dispatch uses a 16-byte VTable fat pointer for heterogeneous collections.',
    explanation: 'Static dispatch monomorphizes every concrete type at compile time. Dynamic dispatch trades a VTable pointer lookup for flexibility.'
  },
  {
    id: 'fc-9',
    category: 'Async',
    question: 'Why are Rust Futures described as "zero-cost state machines"?',
    answer: 'Async functions compile into anonymous enum state machines with no heap allocations or runtime thread overhead unless explicitly boxed.',
    explanation: 'Futures only advance when polled (`Poll::Ready` or `Poll::Pending`). No background threads are spawned unless an executor like Tokio schedules them.'
  },
  {
    id: 'fc-10',
    category: 'Ownership',
    question: 'What is the difference between `Copy` and `Clone` in Rust?',
    answer: '`Copy` is an implicit, inexpensive bitwise `memcpy` on stack data; `Clone` is an explicit, potentially expensive user-defined duplication (e.g. heap cloning).',
    explanation: 'Types implementing `Copy` must also implement `Clone`. Any type managing external heap memory (like `Vec` or `String`) cannot implement `Copy`.'
  }
];
