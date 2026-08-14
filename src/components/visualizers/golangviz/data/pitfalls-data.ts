export interface GoPitfall {
  id: string;
  title: string;
  category: 'Concurrency' | 'Memory & Slices' | 'Interfaces & Types' | 'Error & Control Flow' | 'Maps & Structs';
  severity: 'Critical' | 'High' | 'Medium';
  explanation: string;
  buggyCode: string;
  fixedCode: string;
  underTheHood: string;
}

export const GO_PITFALLS: GoPitfall[] = [
  {
    id: 'goroutine-loop-capture',
    title: '1. Capturing Loop Iteration Variables in Concurrent Goroutines (Pre-Go 1.22)',
    category: 'Concurrency',
    severity: 'Critical',
    explanation: 'Spawning a goroutine inside a for loop that closes over the loop variable can cause all goroutines to read the final iteration value rather than their current index.',
    buggyCode: `for i := 0; i < 5; i++ {
    go func() {
        fmt.Println(i) // ❌ All goroutines may print '5'!
    }()
}`,
    fixedCode: `// ✅ Explicitly pass the variable as an argument:
for i := 0; i < 5; i++ {
    go func(idx int) {
        fmt.Println(idx) // Prints 0, 1, 2, 3, 4 reliably
    }(i)
}`,
    underTheHood: 'Prior to Go 1.22, loop variables shared a single memory address across all iterations. In Go 1.22+, loop variables are per-iteration scoped by default.',
  },
  {
    id: 'nil-error-interface',
    title: '2. Returning a Nil Concrete Pointer to an error Interface',
    category: 'Interfaces & Types',
    severity: 'Critical',
    explanation: 'If a function returns a typed pointer initialized to nil as an `error` interface, `if err != nil` will evaluate to TRUE because the interface holds non-nil type metadata.',
    buggyCode: `type CustomError struct{}
func (e *CustomError) Error() string { return "custom error" }

func Validate() error {
    var p *CustomError = nil
    return p // ❌ Returns interface with (type=*CustomError, data=nil)
}

if err := Validate(); err != nil {
    // 💥 This executes! err is not nil because it has a type descriptor!
}`,
    fixedCode: `func Validate() error {
    var p *CustomError = nil
    if someCondition {
        return p
    }
    return nil // ✅ Explicitly return bare nil!
}`,
    underTheHood: 'An interface in Go is represented as `(itab, data)`. An interface is only `nil` when BOTH `itab == nil` AND `data == nil`.',
  },
  {
    id: 'slice-memory-leak',
    title: '3. Memory Leak from Sub-Slicing a Giant Backing Array',
    category: 'Memory & Slices',
    severity: 'High',
    explanation: 'Extracting a small 10-byte slice from a 100 MB file buffer holds the ENTIRE 100 MB backing array in RAM, preventing the Garbage Collector from freeing it.',
    buggyCode: `func GetHeader() []byte {
    bigFile := read100MBFile() // 100 MB in heap
    return bigFile[:10]        // ❌ Holds entire 100 MB in RAM!
}`,
    fixedCode: `func GetHeader() []byte {
    bigFile := read100MBFile()
    header := make([]byte, 10)
    copy(header, bigFile[:10]) // ✅ Copies 10 bytes to fresh slice!
    return header              // bigFile is reclaimed by GC
}`,
    underTheHood: 'A slice header holds a direct pointer to the backing array. As long as the sub-slice pointer is reachable, the GC cannot collect the 100 MB array.',
  },
  {
    id: 'nil-map-write',
    title: '4. Panic on Writing to an Uninitialized Nil Map',
    category: 'Maps & Structs',
    severity: 'Critical',
    explanation: 'Reading from a nil map safely returns zero-values, but writing to a nil map triggers an immediate fatal runtime panic.',
    buggyCode: `var users map[string]int // users == nil
users["Alice"] = 100     // 💥 PANIC: assignment to entry in nil map`,
    fixedCode: `// ✅ Always initialize maps before writing:
users := make(map[string]int)
users["Alice"] = 100 // Safe!`,
    underTheHood: 'Maps are pointers to `hmap` structs. A `nil` map points to `0x0`, so writing to it attempts to dereference a null pointer.',
  },
  {
    id: 'unbuffered-channel-goroutine-leak',
    title: '5. Goroutine Leak on Unbuffered Channel Send with Timeout',
    category: 'Concurrency',
    severity: 'High',
    explanation: 'Spawning a background worker with `time.After` and an unbuffered channel blocks the worker permanently if the timeout fires first.',
    buggyCode: `func QueryWithTimeout() (string, error) {
    ch := make(chan string) // ❌ Unbuffered channel!
    go func() {
        res := slowDatabaseCall()
        ch <- res // 💥 Blocks forever if timeout fires before this!
    }()

    select {
    case res := <-ch:
        return res, nil
    case <-time.After(100 * time.Millisecond):
        return "", errors.New("timeout") // Goroutine leaked in memory!
    }
}`,
    fixedCode: `// ✅ Use a buffered channel of size 1:
ch := make(chan string, 1) // Sender can always write without blocking!
go func() {
    ch <- slowDatabaseCall()
}()`,
    underTheHood: 'Unbuffered channel sends block until a receiver reads. If the receiver exits due to timeout, the sender goroutine remains paused in RAM forever.',
  },
  {
    id: 'defer-inside-infinite-loop',
    title: '6. Using defer Inside a Long-Running Loop',
    category: 'Error & Control Flow',
    severity: 'High',
    explanation: '`defer` statements do NOT execute at the end of the loop block — they only execute when the ENTIRE enclosing function returns, potentially exhausting file descriptors.',
    buggyCode: `func ProcessFiles(paths []string) {
    for _, path := range paths {
        f, _ := os.Open(path)
        defer f.Close() // ❌ All files remain open until ProcessFiles returns!
    }
}`,
    fixedCode: `func ProcessFiles(paths []string) {
    for _, path := range paths {
        func(p string) {
            f, _ := os.Open(p)
            defer f.Close() // ✅ Closes immediately at end of inner function!
            process(f)
        }(path)
    }
}`,
    underTheHood: '`defer` pushes cleanup closures onto the function stack frame. Stack frames are only unwound on function return, not loop iterations.',
  },
];
