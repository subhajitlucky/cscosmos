export interface Flashcard {
  id: string;
  category: 'Fundamentals' | 'Concurrency' | 'Memory & Slices' | 'Interfaces & Types' | 'Runtime & GC';
  question: string;
  answer: string;
  codeSnippet?: string;
}

export const FLASHCARDS: Flashcard[] = [
  {
    id: 'slice-header',
    category: 'Memory & Slices',
    question: 'What is the internal memory representation of a Slice Header in 64-bit Go?',
    answer: 'A 24-byte struct containing 3 fields: a 8-byte pointer to the backing array (`*data`), an 8-byte length integer (`len`), and an 8-byte capacity integer (`cap`).',
    codeSnippet: `type SliceHeader struct {
    Data uintptr
    Len  int
    Cap  int
}`,
  },
  {
    id: 'nil-interface-trap',
    category: 'Interfaces & Types',
    question: 'Why does `var err *MyCustomError = nil; if err != nil` evaluate to TRUE in Go?',
    answer: 'An interface in Go is only nil if BOTH its type descriptor (`itab`) AND data pointer are nil. Here, the interface holds type `*MyCustomError`, so the interface value itself is NOT nil!',
    codeSnippet: `type MyError struct{}
func (e *MyError) Error() string { return "boom" }

func getErr() error {
    var p *MyError = nil
    return p // itab != nil!
}

if err := getErr(); err != nil {
    // This branch EXECUTES even though p was nil!
}`,
  },
  {
    id: 'channel-deadlock',
    category: 'Concurrency',
    question: 'What happens when sending to an unbuffered channel when no receiver is ready?',
    answer: 'The sender goroutine blocks indefinitely (transitions to Waiting state). If all other goroutines in the program are also sleeping, the Go runtime detects a deadlock and panics.',
    codeSnippet: `ch := make(chan int)
ch <- 42 // Blocks forever if on main goroutine without concurrent reader!
// fatal error: all goroutines are asleep - deadlock!`,
  },
  {
    id: 'struct-padding',
    category: 'Memory & Slices',
    question: 'How does field order affect the memory size of a Go struct?',
    answer: 'Go aligns struct fields on word boundaries (8 bytes on 64-bit). Poor ordering introduces compiler padding bytes. Ordering fields from largest (8 bytes) to smallest (1 byte) minimizes memory waste.',
    codeSnippet: `// 24 bytes (with padding gaps):
type Bad struct { a bool; b int64; c bool }

// 16 bytes (optimized layout):
type Good struct { b int64; a bool; c bool }`,
  },
  {
    id: 'gmp-stealing',
    category: 'Runtime & GC',
    question: 'How does the Go GMP runtime scheduler perform work-stealing?',
    answer: 'When a logical processor (P) runs out of local runnable goroutines, it attempts to steal half the goroutines from another random P\'s local run queue before checking the global queue or sleeping.',
  },
  {
    id: 'string-immutability',
    category: 'Fundamentals',
    question: 'Can you modify a character in a Go string in-place like `s[0] = \'A\'`?',
    answer: 'No! Strings in Go are strictly immutable byte slices. To modify characters, convert to `[]byte` or `[]rune`, mutate the slice, and convert back to `string`.',
  },
  {
    id: 'defer-eval-timing',
    category: 'Fundamentals',
    question: 'When are function arguments evaluated in a `defer` statement?',
    answer: 'Arguments to a deferred function are evaluated IMMEDIATELY at the moment the `defer` statement is reached, but the function body executes when the enclosing function returns.',
    codeSnippet: `x := 10
defer fmt.Println(x) // Evaluates x=10 right now!
x = 20
// Prints: 10 (not 20)`,
  },
  {
    id: 'sync-pool-reclaim',
    category: 'Runtime & GC',
    question: 'When are objects stored inside `sync.Pool` reclaimed by the runtime?',
    answer: 'Items in `sync.Pool` may be automatically dropped and reclaimed during any Garbage Collection cycle without notification, so `sync.Pool` should only store temporary reusable buffers.',
  },
];
