export interface CheatSheetRecipe {
  id: string;
  category: 'Syntax & Types' | 'Concurrency' | 'HTTP & Web' | 'Memory & Slices' | 'Error Handling' | 'Testing & Benchmarks';
  title: string;
  description: string;
  code: string;
  tags: string[];
}

export const CHEATSHEET_RECIPES: CheatSheetRecipe[] = [
  {
    id: 'worker-pool',
    category: 'Concurrency',
    title: 'Bounded Goroutine Worker Pool',
    description: 'Process thousands of jobs using a fixed number of worker goroutines without exhausting system RAM.',
    code: `func WorkerPool(jobs <-chan int, results chan<- int, numWorkers int) {
    var wg sync.WaitGroup
    for w := 1; w <= numWorkers; w++ {
        wg.Add(1)
        go func(workerID int) {
            defer wg.Done()
            for job := range jobs {
                results <- job * 2
            }
        }(w)
    }
    wg.Wait()
    close(results)
}`,
    tags: ['concurrency', 'worker pool', 'sync.WaitGroup', 'channels'],
  },
  {
    id: 'http-graceful-shutdown',
    category: 'HTTP & Web',
    title: 'Production HTTP Server with Graceful Shutdown',
    description: 'Listen on port 8080 and gracefully drain in-flight HTTP connections upon SIGINT or SIGTERM.',
    code: `srv := &http.Server{
    Addr:         ":8080",
    Handler:      mux,
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
    IdleTimeout:  120 * time.Second,
}

go func() {
    if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
        log.Fatalf("listen: %s\\n", err)
    }
}()

stop := make(chan os.Signal, 1)
signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
<-stop

ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()
srv.Shutdown(ctx)`,
    tags: ['http', 'server', 'graceful shutdown', 'signals'],
  },
  {
    id: 'error-wrapping-unwrap',
    category: 'Error Handling',
    title: 'Idiomatic Error Wrapping with %w and errors.Is',
    description: 'Wrap underlying errors with context and check for specific sentinel error types across layers.',
    code: `var ErrNotFound = errors.New("resource not found")

func GetUser(id string) (*User, error) {
    user, err := db.Find(id)
    if err != nil {
        return nil, fmt.Errorf("db lookup failed for %s: %w", id, ErrNotFound)
    }
    return user, nil
}

// In caller:
if err := GetUser("123"); errors.Is(err, ErrNotFound) {
    // Handle 404 Not Found cleanly
}`,
    tags: ['errors', 'errors.Is', 'fmt.Errorf', 'sentinel'],
  },
  {
    id: 'slice-filter-inplace',
    category: 'Memory & Slices',
    title: 'Zero-Allocation In-Place Slice Filter',
    description: 'Filter elements in a slice reusing the existing backing array memory without any heap allocations.',
    code: `func FilterInPlace(nums []int, keep func(int) bool) []int {
    n := 0
    for _, x := range nums {
        if keep(x) {
            nums[n] = x
            n++
        }
    }
    return nums[:n]
}`,
    tags: ['slices', 'memory', 'zero allocation', 'filter'],
  },
  {
    id: 'table-driven-test',
    category: 'Testing & Benchmarks',
    title: 'Standard Table-Driven Unit Test with t.Run',
    description: 'Run multiple test cases through a single clean testing table with descriptive subtests.',
    code: `func TestMultiply(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 2, 3, 6},
        {"zero", 0, 5, 0},
        {"negative", -2, 4, -8},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := Multiply(tt.a, tt.b)
            if got != tt.want {
                t.Errorf("Multiply(%d, %d) = %d; want %d", tt.a, tt.b, got, tt.want)
            }
        })
    }
}`,
    tags: ['testing', 'table-driven', 't.Run', 'unit test'],
  },
  {
    id: 'sync-pool-buffer',
    category: 'Memory & Slices',
    title: 'sync.Pool for High-Throughput Buffer Reuse',
    description: 'Recycle large byte buffers to eliminate Garbage Collection memory pressure.',
    code: `var bufPool = sync.Pool{
    New: func() any {
        return new(bytes.Buffer)
    },
}

func ProcessStream(r io.Reader) {
    buf := bufPool.Get().(*bytes.Buffer)
    buf.Reset()
    defer bufPool.Put(buf) // Return for reuse

    buf.ReadFrom(r)
}`,
    tags: ['sync.Pool', 'memory', 'garbage collection', 'optimization'],
  },
];
