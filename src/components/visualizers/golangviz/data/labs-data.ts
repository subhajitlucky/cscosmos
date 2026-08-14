export interface LabTestCase {
  name: string;
  input: string;
  expected: string;
}

export interface CodingLab {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  description: string;
  initialCode: string;
  solutionCode: string;
  hints: string[];
  testCases: LabTestCase[];
}

export const CODING_LABS: CodingLab[] = [
  {
    id: 'worker-pool',
    title: 'Lab 1: Build a Concurrent Worker Pool',
    difficulty: 'Intermediate',
    category: 'Concurrency',
    description:
      'Implement `RunWorkerPool(jobs []int, numWorkers int) []int` that uses a bounded number of worker goroutines and channels to square each number concurrently and return the results.',
    initialCode: `package main

import (
    "sync"
)

// RunWorkerPool squares all numbers using numWorkers concurrent goroutines.
func RunWorkerPool(jobs []int, numWorkers int) []int {
    // TODO: Create jobs channel and results channel
    // TODO: Spawn numWorkers goroutines with sync.WaitGroup
    // TODO: Send jobs, close jobs channel, and collect squared results
    
    var results []int
    return results
}`,
    solutionCode: `package main

import "sync"

func RunWorkerPool(jobs []int, numWorkers int) []int {
    jobsChan := make(chan int, len(jobs))
    resultsChan := make(chan int, len(jobs))

    var wg sync.WaitGroup

    // Spawn workers
    for w := 0; w < numWorkers; w++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for j := range jobsChan {
                resultsChan <- j * j
            }
        }()
    }

    // Feed jobs
    for _, j := range jobs {
        jobsChan <- j
    }
    close(jobsChan)

    // Wait and close results
    wg.Wait()
    close(resultsChan)

    var results []int
    for r := range resultsChan {
        results = append(results, r)
    }
    return results
}`,
    hints: [
      'Create buffered channels for jobs and results: `make(chan int, len(jobs))`.',
      'Use `sync.WaitGroup` to track worker goroutines and close the results channel after `wg.Wait()`.',
      'Iterate over channels using `for item := range ch` which terminates automatically when the channel is closed.'
    ],
    testCases: [
      { name: 'Test 1: Square [1, 2, 3, 4, 5] with 3 workers', input: 'jobs: [1, 2, 3, 4, 5], workers: 3', expected: '[1, 4, 9, 16, 25]' },
      { name: 'Test 2: Empty slice [] with 2 workers', input: 'jobs: [], workers: 2', expected: '[]' },
      { name: 'Test 3: Single element [10] with 1 worker', input: 'jobs: [10], workers: 1', expected: '[100]' },
    ],
  },
  {
    id: 'lru-cache',
    title: 'Lab 2: Thread-Safe LRU Cache',
    difficulty: 'Advanced',
    category: 'Data Structures & Concurrency',
    description:
      'Design a thread-safe generic `LRUCache[K, V]` using `sync.RWMutex`, a hash map for O(1) lookups, and a doubly linked list for eviction.',
    initialCode: `package main

import "sync"

type LRUCache[K comparable, V any] struct {
    capacity int
    mu       sync.RWMutex
    items    map[K]V
}

func NewLRUCache[K comparable, V any](capacity int) *LRUCache[K, V] {
    return &LRUCache[K, V]{
        capacity: capacity,
        items:    make(map[K]V),
    }
}

func (c *LRUCache[K, V]) Get(key K) (V, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    val, ok := c.items[key]
    return val, ok
}

func (c *LRUCache[K, V]) Put(key K, val V) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items[key] = val
}`,
    solutionCode: `package main

import "sync"

type LRUCache[K comparable, V any] struct {
    capacity int
    mu       sync.RWMutex
    items    map[K]V
}

func NewLRUCache[K comparable, V any](capacity int) *LRUCache[K, V] {
    return &LRUCache[K, V]{
        capacity: capacity,
        items:    make(map[K]V),
    }
}

func (c *LRUCache[K, V]) Get(key K) (V, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    val, ok := c.items[key]
    return val, ok
}

func (c *LRUCache[K, V]) Put(key K, val V) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.items[key] = val
}`,
    hints: [
      'Use `sync.RWMutex` so multiple concurrent readers can read simultaneously with `RLock()`.',
      'Write operations (`Put`, eviction) require exclusive `Lock()`.',
    ],
    testCases: [
      { name: 'Test 1: Put and Get key "user_1"', input: 'Put("user_1", "Alice") -> Get("user_1")', expected: '"Alice", true' },
      { name: 'Test 2: Get non-existent key', input: 'Get("missing")', expected: 'zero-value, false' },
    ],
  },
  {
    id: 'slice-filter',
    title: 'Lab 3: Zero-Allocation In-Place Slice Filter',
    difficulty: 'Beginner',
    category: 'Memory & Slices',
    description:
      'Implement `FilterInPlace(nums []int, predicate func(int) bool) []int` that filters a slice in-place without allocating a new underlying array.',
    initialCode: `package main

// FilterInPlace keeps elements matching predicate using 0 heap allocations.
func FilterInPlace(nums []int, predicate func(int) bool) []int {
    // TODO: Write elements in-place by maintaining a write index
    return nums
}`,
    solutionCode: `package main

func FilterInPlace(nums []int, predicate func(int) bool) []int {
    writeIdx := 0
    for _, x := range nums {
        if predicate(x) {
            nums[writeIdx] = x
            writeIdx++
        }
    }
    return nums[:writeIdx]
}`,
    hints: [
      'Maintain an integer `writeIdx := 0` tracking where the next matching element should be written.',
      'Return the re-sliced slice header `nums[:writeIdx]` which shares the exact same backing array.'
    ],
    testCases: [
      { name: 'Test 1: Filter Even numbers from [1, 2, 3, 4, 5, 6]', input: '[1, 2, 3, 4, 5, 6], isEven', expected: '[2, 4, 6]' },
      { name: 'Test 2: Filter numbers > 10 from [5, 12, 3, 20]', input: '[5, 12, 3, 20], n > 10', expected: '[12, 20]' },
    ],
  },
];
