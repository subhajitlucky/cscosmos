export interface CaseStudy {
  id: string;
  company: string;
  topicSlug: string;
  title: string;
  scenario: string;
  challenge: string;
  solution: string;
  impact: string;
  codeSnippet?: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cloudflare-gc',
    company: 'Cloudflare',
    topicSlug: 'garbage-collector',
    title: 'How Cloudflare Reduced Go GC Latency by 90% Using sync.Pool',
    scenario: 'High-throughput DNS and TLS edge proxy servers processing 50M+ requests per second.',
    challenge: 'Allocating millions of temporary 32 KB byte buffers per second triggered frequent Garbage Collector Stop-The-World (STW) mark phases, causing 50ms latency spikes.',
    solution: 'Replaced ephemeral heap buffer allocations with a global `sync.Pool`. Buffers are checked out upon request arrival and returned to the pool immediately upon completion.',
    impact: 'P99 latency dropped from 50ms to 4ms. GC memory churn dropped by 92%.',
    codeSnippet: `var bufferPool = sync.Pool{
    New: func() any {
        b := make([]byte, 32*1024)
        return &b
    },
}

func handleRequest(r io.Reader) {
    bufPtr := bufferPool.Get().(*[]byte)
    defer bufferPool.Put(bufPtr) // Return to pool
    // Process request with *bufPtr...
}`,
  },
  {
    id: 'kubernetes-context',
    company: 'Kubernetes',
    topicSlug: 'context',
    title: 'How Kubernetes Prevents Cluster-Wide Goroutine Floods via Context Cancellation',
    scenario: 'Kube-apiserver handling thousands of concurrent controller reconcile loops and watch streams.',
    challenge: 'When a network partition occurred, blocked HTTP API client calls left orphaned goroutines waiting indefinitely for network I/O, eventually exhausting node memory (OOM).',
    solution: 'Mandated `context.WithTimeout()` on all etcd, client-go, and webhook calls. When an HTTP connection terminates, the top-level request context cancels instantly, terminating the whole subtree of worker goroutines.',
    impact: 'Zero leaked goroutines during network splits; memory footprint stabilized under peak load.',
    codeSnippet: `ctx, cancel := context.WithTimeout(parentCtx, 5*time.Second)
defer cancel()

// etcd query automatically terminates if it exceeds 5 seconds
res, err := etcdClient.Get(ctx, "/registry/pods/default/nginx")`,
  },
  {
    id: 'uber-zap',
    company: 'Uber',
    topicSlug: 'logging',
    title: 'How Uber Built Zap: Zero-Allocation High-Speed Structured Logging',
    scenario: 'Microservice mesh generating terabytes of logging data across thousands of host instances.',
    challenge: 'Traditional reflection-based logging (e.g. `log.Printf("%v", data)`) caused millions of interface boxing heap allocations, saturating the CPU with GC tracking.',
    solution: 'Designed Zap around strongly-typed field encoders (`zap.String()`, `zap.Int()`) that write bytes directly into pre-allocated memory buffers without interface boxing.',
    impact: 'Logging became 10x faster than standard library loggers with 0 heap allocations in the critical path.',
    codeSnippet: `// Zero-allocation structured field logging:
logger.Info("failed to fetch user",
    zap.String("user_id", "usr_99"),
    zap.Int("attempt", 3),
    zap.Duration("backoff", time.Second),
)`,
  },
  {
    id: 'docker-cgroups',
    company: 'Docker',
    topicSlug: 'runtime-internals',
    title: 'How Docker Manages GOMAXPROCS Inside Linux Containers (CFS Quotas)',
    scenario: 'Running Go applications inside CPU-throttled Docker and Kubernetes pods.',
    challenge: 'By default, Go initializes `GOMAXPROCS` to the physical host CPU core count (e.g. 64 cores), even if the container is quota-limited to 2 CPUs. This created 64 OS threads fighting for 2 CPU quotas, causing heavy CFS throttling.',
    solution: 'Integrated `go.uber.org/automaxprocs` to automatically read Linux CFS cgroup quotas at startup and configure `runtime.GOMAXPROCS` to match the exact container CPU limit.',
    impact: 'Eliminated CPU throttling, reducing P99 latency by 30% without changing application logic.',
    codeSnippet: `import _ "go.uber.org/automaxprocs"

func main() {
    // Automatically sets GOMAXPROCS to container CPU quota!
}`,
  },
];

export const caseStudiesMap = new Map<string, CaseStudy>(
  CASE_STUDIES.map((c) => [c.topicSlug, c])
);
