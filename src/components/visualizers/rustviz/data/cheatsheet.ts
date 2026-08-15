export interface CheatSheetSection {
  title: string;
  category: string;
  items: {
    name: string;
    syntax: string;
    description: string;
    details?: string;
  }[];
}

export const rustCheatSheet: CheatSheetSection[] = [
  {
    title: 'Smart Pointers & Memory Wrappers',
    category: 'Memory',
    items: [
      {
        name: 'Box<T>',
        syntax: 'let b = Box::new(5);',
        description: 'Unique heap allocation. 8-byte pointer on stack. Auto-deallocated on drop.',
        details: 'Deref & Drop implemented. Zero-cost heap indirection.'
      },
      {
        name: 'Rc<T>',
        syntax: 'let r = Rc::new(data); let r2 = Rc::clone(&r);',
        description: 'Single-threaded reference counting. Shared ownership. !Send, !Sync.',
        details: 'Heap header tracks strong and weak reference counts.'
      },
      {
        name: 'Arc<T>',
        syntax: 'let a = Arc::new(data); let a2 = Arc::clone(&a);',
        description: 'Atomic Reference Counting. Multi-threaded shared ownership. Send + Sync (if T is Send + Sync).',
        details: 'Uses atomic CPU instructions for thread-safe count manipulation.'
      },
      {
        name: 'RefCell<T>',
        syntax: 'let c = RefCell::new(0); *c.borrow_mut() += 1;',
        description: 'Dynamic interior mutability. Runtime borrow checking. Panics on aliasing violations.',
        details: 'Tracks active loan count at runtime. !Sync.'
      },
      {
        name: 'Mutex<T>',
        syntax: 'let m = Mutex::new(0); let mut g = m.lock().unwrap();',
        description: 'Thread-safe mutual exclusion. Grants RAII MutexGuard giving exclusive &mut T access.',
        details: 'Releases OS/futex lock deterministically when MutexGuard is dropped.'
      },
      {
        name: 'RwLock<T>',
        syntax: 'let lock = RwLock::new(data); let r = lock.read().unwrap();',
        description: 'Multiple concurrent readers OR one exclusive writer across threads.',
        details: 'Optimized for high read-to-write ratio workloads.'
      }
    ]
  },
  {
    title: 'Standard Traits & Conversions',
    category: 'Traits',
    items: [
      {
        name: 'Deref / DerefMut',
        syntax: 'impl Deref for MyBox<T> { type Target = T; ... }',
        description: 'Implicit dereferencing coercions (e.g. &String -> &str, &Vec<T> -> &[T]).',
        details: 'Allows smart pointers to be used transparently as their underlying target.'
      },
      {
        name: 'From / Into',
        syntax: 'impl From<A> for B { fn from(a: A) -> Self { ... } }',
        description: 'Value-to-value conversion. Implementing From automatically implements Into.',
        details: 'Idiomatic and infallible conversion between types.'
      },
      {
        name: 'TryFrom / TryInto',
        syntax: 'impl TryFrom<i64> for u8 { type Error = ...; }',
        description: 'Fallible type conversion returning Result<T, Error>.',
        details: 'Used for bounds-checked numeric conversions and validated domain types.'
      },
      {
        name: 'AsRef / AsMut',
        syntax: 'fn process<P: AsRef<Path>>(path: P) { ... }',
        description: 'Cheap reference-to-reference conversion for generic function parameters.',
        details: 'Enables accepting &str, String, or Path in a single clean function signature.'
      }
    ]
  },
  {
    title: 'Concurrency Primitives',
    category: 'Concurrency',
    items: [
      {
        name: 'mpsc::channel()',
        syntax: 'let (tx, rx) = std::sync::mpsc::channel();',
        description: 'Unbounded Multi-Producer, Single-Consumer FIFO queue.',
        details: 'tx can be cloned across multiple threads; rx consumes messages.'
      },
      {
        name: 'mpsc::sync_channel(N)',
        syntax: 'let (tx, rx) = std::sync::mpsc::sync_channel(10);',
        description: 'Bounded FIFO queue applying backpressure. Blocks senders when buffer reaches N.',
        details: 'Guarantees fixed memory consumption under heavy write load.'
      },
      {
        name: 'thread::spawn',
        syntax: 'thread::spawn(move || { ... });',
        description: 'Spawns an OS-level native thread with a 2MB default stack.',
        details: 'Requires closure to have a \'static lifetime unless scoped threads are used.'
      },
      {
        name: 'thread::scope',
        syntax: 'thread::scope(|s| { s.spawn(|| { ... }); });',
        description: 'Scoped threads that can borrow stack data from the parent scope without \'static.',
        details: 'Guarantees all child threads join before the scope function returns.'
      }
    ]
  }
];
