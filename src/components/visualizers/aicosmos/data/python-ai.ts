export interface PythonAiSubtopic {
  id: string;
  number: number;
  title: string;
  category: 'CPython & Memory' | 'Vectorization & Numerics' | 'Async & LLM Services' | 'Typing & Structured Output' | 'Production & Concurrency';
  definition: string;
  keyPoints: string[];
  analogy: string;
  pitfall: string;
  codeSnippet: string;
  visualization:
    | 'pyobject-memory'
    | 'gil-contention'
    | 'gc-cycles'
    | 'pass-by-reference'
    | 'tracemalloc-profile'
    | 'contiguous-vs-pointers'
    | 'vectorized-bench'
    | 'strides-slicing'
    | 'dtype-precision'
    | 'einsum-visualizer'
    | 'event-loop'
    | 'async-fanout'
    | 'semaphore-throttle'
    | 'token-streamer'
    | 'http2-multiplex'
    | 'type-checker'
    | 'protocol-ducktyping'
    | 'pydantic-core'
    | 'json-schema-extract'
    | 'self-healing-loop'
    | 'generator-pipeline'
    | 'context-manager'
    | 'process-pool'
    | 'uv-dependency-graph';
}

export const pythonAiSubtopics: PythonAiSubtopic[] = [
  // Module 1: CPython & Memory
  {
    id: 'cpython-memory-model-pyobject',
    number: 1,
    title: 'CPython Memory Model & PyObject Overhead',
    category: 'CPython & Memory',
    definition: 'In CPython, every variable is a pointer to a heap-allocated C struct called PyObject. A basic integer requires 28 bytes rather than 4 or 8 bytes due to reference counts (ob_refcnt) and type descriptor pointers (ob_type).',
    keyPoints: [
      'Every standard Python value is boxed in a PyObject header (8-byte ob_refcnt + 8-byte ob_type pointer).',
      'Python lists store arrays of 8-byte pointers pointing to scattered PyObjects, destroying CPU cache locality.',
      'AI engineering requires bypassing PyObject boxing using contiguous C/C++ memory buffers (NumPy, PyTorch tensors).'
    ],
    analogy: 'PyObject is like shipping every single jellybean in its own individual cardboard box with tracking barcodes and inspector stamps, rather than packing 10,000 jellybeans in one tight bag.',
    pitfall: 'Storing millions of numerical embeddings in native Python lists of floats, consuming 8x to 12x more RAM than a single float32 tensor buffer.',
    codeSnippet: `import sys

val = 42
print(f"Size of int 42: {sys.getsizeof(val)} bytes") # 28 bytes!
# An array of 1,000,000 Python ints consumes ~8MB for pointers + ~28MB for PyObjects = ~36MB
# A NumPy int32 array consumes exactly 4MB (1M * 4 bytes).`,
    visualization: 'pyobject-memory'
  },
  {
    id: 'gil-and-multithreading',
    number: 2,
    title: 'The Global Interpreter Lock (GIL) & True Concurrency',
    category: 'CPython & Memory',
    definition: 'The CPython GIL is a mutual exclusion lock preventing multiple OS threads from executing Python bytecodes simultaneously. While CPU-bound loops in pure Python cannot scale across multiple cores, C-extensions (NumPy, Torch, BLAS) explicitly release the GIL during matrix computations.',
    keyPoints: [
      'Pure Python threading does NOT accelerate CPU-intensive tasks on multi-core processors.',
      'Threads DO accelerate I/O-bound operations (network API calls, disk reads) because CPython releases the GIL during blocking socket I/O.',
      'High-performance tensor operations in PyTorch and NumPy drop the GIL, allowing C/C++ kernels to execute across all available CPU/GPU threads.',
      'Python 3.13 introduces experimental free-threaded mode (PEP 703), removing the GIL entirely via biased reference counting.'
    ],
    analogy: 'The GIL is like a single microphone in a room. Even with 16 people present (16 CPU cores), only the person holding the microphone can speak pure Python. But if someone leaves the room to do matrix math (C extension), others can grab the microphone.',
    pitfall: 'Using Python threading.Thread to parallelize pure Python data tokenization or feature transformations, resulting in slower execution than single-threaded code due to lock switching overhead.',
    codeSnippet: `import threading
import numpy as np

# Matrix multiplication releases the GIL!
def compute_heavy_gemm():
    a = np.random.rand(2000, 2000)
    b = np.random.rand(2000, 2000)
    _ = np.dot(a, b) # Executes in OpenBLAS/MKL C-threads without GIL

threads = [threading.Thread(target=compute_heavy_gemm) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()`,
    visualization: 'gil-contention'
  },
  {
    id: 'garbage-collection-refcounting-cycles',
    number: 3,
    title: 'Garbage Collection: Reference Counting & Cyclic GC',
    category: 'CPython & Memory',
    definition: 'CPython deallocates objects immediately when their reference counter (ob_refcnt) drops to 0. A secondary generational cyclic garbage collector periodically sweeps circular references (Object A -> Object B -> Object A).',
    keyPoints: [
      'Reference counting is deterministic and instantaneous, avoiding stop-the-world pauses for simple objects.',
      'Cyclic references bypass reference counting and require generational sweeping (Generation 0, 1, and 2).',
      'Long-running inference servers can suffer latency spikes when Gen-2 GC triggers unexpectedly during serving.',
      'Custom del methods and circular closures in model callbacks cause objects to be placed into uncollectable cycles.'
    ],
    analogy: 'Reference counting is checking out library books: the moment nobody is reading it, it returns to the shelf. Cyclic GC is a detective tracking a group of friends who each borrowed a book from the person to their left and forgot to return it.',
    pitfall: 'Accidentally retaining tensors in computation graphs by assigning loss or activation tensors directly to persistent class instances without calling .detach() or .item(), triggering VRAM/RAM memory leaks.',
    codeSnippet: `import sys, gc

# Inspecting reference counts
a = [1, 2, 3]
print("Ref count:", sys.getrefcount(a) - 1) # 1

# Disabling cyclic GC during high-throughput inference passes to prevent latency jitter:
gc.disable()
# ... run high-throughput batch generation ...
gc.enable()`,
    visualization: 'gc-cycles'
  },
  {
    id: 'pass-by-object-reference-and-mutability',
    number: 4,
    title: 'Pass-by-Object-Reference & Mutability Pitfalls',
    category: 'CPython & Memory',
    definition: 'Python uses pass-by-object-reference (or call-by-sharing). Function arguments receive references to existing objects; modifying a mutable object (list, dict, tensor buffer) inside a function mutates the caller’s original state.',
    keyPoints: [
      'Variables in Python are variable names bound to object memory addresses, not memory slots holding raw bytes.',
      'Default parameter values are evaluated once at function definition time, NOT at function call time.',
      'In-place tensor operations (e.g., tensor.add_()) mutate underlying memory in-place and can corrupt backward autograd graphs.'
    ],
    analogy: 'Passing an object in Python is like handing someone the GPS coordinates of your whiteboard. If they write on the whiteboard, everyone looking at that same whiteboard sees the scribbles.',
    pitfall: 'Defining def generate(prompt: str, history: list = []): ... Every call shares the exact same persistent history list in memory!',
    codeSnippet: `from typing import Optional

# BAD: Mutable default argument bug
def append_token(token: str, sequence: list = []):
    sequence.append(token)
    return sequence

# CORRECT: None sentinel pattern
def append_token_safe(token: str, sequence: Optional[list] = None) -> list:
    if sequence is None:
        sequence = []
    sequence.append(token)
    return sequence`,
    visualization: 'pass-by-reference'
  },
  {
    id: 'memory-profiling-and-tracemalloc',
    number: 5,
    title: 'Memory Profiling, tracemalloc & Zero-Copy Views',
    category: 'CPython & Memory',
    definition: 'Tracking memory allocations in production AI services using tracemalloc to capture allocation stack traces, and utilizing Python memoryview for zero-copy binary network buffer slicing.',
    keyPoints: [
      'tracemalloc hooks into CPython memory allocators to report exact file and line numbers of peak allocations.',
      'memoryview allows slicing byte buffers, audio waveforms, and raw tensors without allocating new byte copies.',
      'In high-throughput microservices, zero-copy buffer handling reduces GC pressure and drops latency by 30-50%.'
    ],
    analogy: 'memoryview is like looking through a magnifying glass at a specific paragraph in an encyclopedia rather than photocopying the entire page just to read one sentence.',
    pitfall: 'Converting bytes to strings and slicing substrings repeatedly during audio or binary tensor protocol parsing, creating thousands of short-lived heap allocations.',
    codeSnippet: `import tracemalloc

tracemalloc.start()

# Load embeddings or run batch
data = [bytearray(1024 * 1024) for _ in range(10)] # 10 MB

snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics('lineno')
for stat in top_stats[:3]:
    print(stat)

# Zero-copy slicing:
buf = bytearray(b"HEADER_V1_METADATA_BODY_TENSOR_BYTES")
view = memoryview(buf)
body_view = view[20:] # Zero allocation! Points to original memory`,
    visualization: 'tracemalloc-profile'
  },

  // Module 2: Vectorization & Numerics
  {
    id: 'contiguous-arrays-vs-python-lists',
    number: 6,
    title: 'Contiguous C-Memory Arrays vs Python Lists',
    category: 'Vectorization & Numerics',
    definition: 'NumPy and PyTorch tensors allocate single contiguous blocks of memory where elements sit adjacent to each other. Unlike Python pointer lists, contiguous memory fits into CPU L1/L2 cache lines and enables single-instruction multiple-data (SIMD) vector processing.',
    keyPoints: [
      'A contiguous array stores raw unboxed numbers sequentially in virtual memory (stride = sizeof(dtype)).',
      'CPU hardware prefetchers load contiguous data effortlessly into cache lines (64 bytes at a time).',
      'Python lists cause pointer-chasing: each element requires fetching an arbitrary heap pointer address, causing CPU cache misses.'
    ],
    analogy: 'A contiguous array is a roll of pennies where every coin is touching. A Python list is a box of scavenger hunt clues, each pointing to a coin hidden in a different room.',
    pitfall: 'Using Python for-loops to iterate over arrays element-by-element, throwing away 100x hardware vector speedups.',
    codeSnippet: `import numpy as np

# Contiguous block: exactly 4,000,000 bytes in memory
arr = np.ones(1_000_000, dtype=np.float32)

print("Flags:", arr.flags['C_CONTIGUOUS']) # True
print("Itemsize:", arr.itemsize)            # 4 bytes
print("Total bytes:", arr.nbytes)           # 4,000,000 bytes`,
    visualization: 'contiguous-vs-pointers'
  },
  {
    id: 'vectorized-operations-and-broadcasting',
    number: 7,
    title: 'Vectorized Operations & Broadcasting Rules',
    category: 'Vectorization & Numerics',
    definition: 'Vectorization delegates batch element calculations to pre-compiled BLAS / C / CUDA kernels. Broadcasting stretches smaller dimensional tensors across larger ones without copying data, according to the rule: dimensions must be equal, or one of them must be 1.',
    keyPoints: [
      'Vectorization replaces Python interpreter evaluation loops with vectorized SIMD CPU instructions (AVX-512, NEON) or GPU warps.',
      'Broadcasting evaluates trailing dimensions from right to left: (B, N, D) + (1, D) stretches seamlessly.',
      'Virtual expansion requires zero memory duplication because the stride for dimension of size 1 is set to 0.'
    ],
    analogy: 'Broadcasting is like projecting a 1D silhouette with a flashlight onto a 2D wall. The shadow expands across the surface without needing extra physical objects.',
    pitfall: 'Unintentionally broadcasting arrays with mismatched dimensions, producing silent mathematical shape bugs instead of throwing an error.',
    codeSnippet: `import numpy as np

# Normalizing a batch of embeddings:
# Shape: (batch_size=4, embedding_dim=3)
embeddings = np.array([
    [1.0, 2.0, 3.0],
    [4.0, 5.0, 6.0],
    [7.0, 8.0, 9.0],
    [2.0, 4.0, 6.0]
])

# Mean per feature: shape (1, 3) broadcasts over (4, 3)
means = np.mean(embeddings, axis=0, keepdims=True)
normalized = embeddings - means # Stride 0 along axis 0!`,
    visualization: 'vectorized-bench'
  },
  {
    id: 'strides-views-vs-copies',
    number: 8,
    title: 'Strides, Views vs Copies & Memory Layouts',
    category: 'Vectorization & Numerics',
    definition: 'A NumPy array is a metadata wrapper (shape, strides, dtype) over an underlying memory buffer. Slices return zero-copy views by altering strides; calls like reshape() or transpose() do not copy data unless non-contiguous strides force an allocation.',
    keyPoints: [
      'Strides describe the number of bytes to step in memory to advance by one element along each axis.',
      'Transpose (.T) merely reverses the strides tuple; it does not move or copy a single byte in RAM.',
      'Calling .copy() creates an independent allocation, breaking memory-sharing with the parent buffer.'
    ],
    analogy: 'Strides are like changing the reading cadence of a sentence: reading every 2nd word gives a new view without re-printing the book.',
    pitfall: 'Assuming array slicing creates a copy, then modifying the slice and inadvertently corrupting the training dataset in the source array.',
    codeSnippet: `import numpy as np

base = np.arange(12, dtype=np.int32).reshape(3, 4)
print("Shape:", base.shape)     # (3, 4)
print("Strides:", base.strides) # (16, 4) -> 16 bytes/row, 4 bytes/col

view = base[:, ::2] # Take every 2nd column
print("View shares memory:", view.base is base) # True! Zero memory copied.
print("View strides:", view.strides)           # (16, 8)`,
    visualization: 'strides-slicing'
  },
  {
    id: 'dtypes-and-numerical-precision',
    number: 9,
    title: 'Data Types, Quantization & Precision (FP32, FP16, BF16, INT8)',
    category: 'Vectorization & Numerics',
    definition: 'AI systems trade numerical precision for throughput and memory efficiency. Floating-point types vary in exponent and mantissa allocation: FP32 (8 exp, 23 mantissa), FP16 (5 exp, 10 mantissa), and BF16 (8 exp, 7 mantissa).',
    keyPoints: [
      'FP32 is standard for training stability; BF16 preserves dynamic range to prevent underflow in deep transformer gradients.',
      'Quantization down to INT8 or INT4 cuts model memory footprint by 4x to 8x, fitting large LLMs onto consumer GPUs.',
      'Subnormal numbers and float16 overflow/underflow cause NaN loss spikes if gradient scaling is omitted.'
    ],
    analogy: 'FP32 is a high-resolution 4K architectural blueprint. INT8 is a rough sketch on a napkin: less precise, but 100x lighter to carry and fast enough to build the frame.',
    pitfall: 'Casting raw probabilities to FP16 and taking logarithms, resulting in -inf when probabilities round down to true zero.',
    codeSnippet: `import numpy as np

# Precision comparisons
fp32_val = np.float32(1e-6)
fp16_val = np.float16(1e-6) # Precision lost / subnormal!

print("FP32:", fp32_val)
print("FP16:", fp16_val)

# Memory impact: 7 Billion parameter model
# FP32: 7B * 4 bytes = 28 GB VRAM
# FP16: 7B * 2 bytes = 14 GB VRAM
# INT8: 7B * 1 byte  = 7 GB VRAM
# INT4: 7B * 0.5 byte = 3.5 GB VRAM`,
    visualization: 'dtype-precision'
  },
  {
    id: 'einsum-and-tensor-contractions',
    number: 10,
    title: 'Einstein Summation (einsum) & Matrix Operations',
    category: 'Vectorization & Numerics',
    definition: 'Einstein summation notation provides a unified, concise declarative syntax (np.einsum / torch.einsum) to express transpositions, dot products, batch matrix multiplications, and multi-head attention without intermediate tensor reshaping.',
    keyPoints: [
      'Indices repeated on the input side but omitted on the output side are summed over (contracted).',
      'Standard attention score formula: np.einsum("bhid,bhjd->bhij", Q, K) computes attention matrices across batches and heads directly.',
      'Avoids temporary memory allocations associated with chained transpose and matmul operations.'
    ],
    analogy: 'einsum is like a universal CNC machine: instead of passing a workpiece through 4 separate cutting, drilling, and turning machines, one instruction matrix does the whole contraction.',
    pitfall: 'Writing convoluted reshape-permute-matmul pipelines that allocate intermediate tensors instead of a single einsum operation.',
    codeSnippet: `import numpy as np

B, H, S, D = 2, 4, 16, 64 # Batch, Heads, SeqLen, Dim
Q = np.random.randn(B, H, S, D)
K = np.random.randn(B, H, S, D)

# Multi-head attention raw affinities: Q @ K.T per head
# 'bhsd,bhmd->bhsm' -> contracts across hidden dimension 'd'
scores = np.einsum('bhsd,bhmd->bhsm', Q, K)
print("Attention scores shape:", scores.shape) # (2, 4, 16, 16)`,
    visualization: 'einsum-visualizer'
  },

  // Module 3: Async & LLM Services
  {
    id: 'asyncio-event-loop-and-coroutines',
    number: 11,
    title: 'Asyncio Event Loop & Non-Blocking Coroutines',
    category: 'Async & LLM Services',
    definition: 'Asyncio is a single-threaded cooperative concurrency framework. A central event loop executes non-blocking coroutines, context-switching immediately when a task awaits an I/O operation (such as waiting for an LLM API token or database query).',
    keyPoints: [
      'Coroutines defined with async def pause execution at await expressions and yield control back to the event loop.',
      'Zero OS thread context-switch overhead; a single Python process can maintain 10,000+ active asynchronous network sockets.',
      'Blocking calls (e.g., time.sleep() or CPU matrix math) freeze the entire event loop for all concurrent users.'
    ],
    analogy: 'An event loop is a single master chef at a diner. While a pancake is cooking on the griddle (awaiting network response), the chef chops onions for the next customer rather than standing frozen staring at the pancake.',
    pitfall: 'Invoking a synchronous requests.get() or time.sleep() inside an async function, completely freezing all concurrent API traffic.',
    codeSnippet: `import asyncio

async def fetch_llm_response(prompt: str) -> str:
    print(f"Sending prompt: {prompt}")
    # Simulates non-blocking network socket wait
    await asyncio.sleep(0.5) 
    return f"Response for {prompt}"

async def main():
    # Runs concurrently on single OS thread:
    results = await asyncio.gather(
        fetch_llm_response("Translate"),
        fetch_llm_response("Summarize"),
        fetch_llm_response("Classify")
    )
    print(results)

# asyncio.run(main())`,
    visualization: 'event-loop'
  },
  {
    id: 'concurrent-llm-fanout',
    number: 12,
    title: 'Concurrent LLM Fan-Out & Task Gathering',
    category: 'Async & LLM Services',
    definition: 'Techniques for executing dozens or hundreds of LLM calls in parallel using asyncio.gather, TaskGroups (Python 3.11+), and asyncio.as_completed for low-latency map-reduce agentic workflows.',
    keyPoints: [
      'asyncio.gather fires all tasks concurrently and waits for all to settle before returning an ordered list.',
      'asyncio.as_completed yields results as soon as individual models respond, enabling fast streaming pipelines.',
      'asyncio.TaskGroup provides structured concurrency: if any task raises an exception, remaining sibling tasks are cancelled cleanly.'
    ],
    analogy: 'Fan-out is like dispatching 10 delivery drivers simultaneously rather than sending one driver on 10 sequential round trips.',
    pitfall: 'Failing to handle exceptions inside asyncio.gather without return_exceptions=True, causing a single failure to abort all 99 successful results.',
    codeSnippet: `import asyncio

async def process_chunk(chunk_id: int):
    if chunk_id == 2:
        raise ValueError("Token budget exceeded")
    await asyncio.sleep(0.1)
    return f"Chunk {chunk_id} embeddings"

async def safe_fanout():
    tasks = [process_chunk(i) for i in range(4)]
    # return_exceptions=True prevents cascade abortion
    results = await asyncio.gather(*tasks, return_exceptions=True)
    for r in results:
        if isinstance(r, Exception):
            print("Handled error:", r)
        else:
            print("Success:", r)`,
    visualization: 'async-fanout'
  },
  {
    id: 'rate-limiting-and-semaphores',
    number: 13,
    title: 'Rate-Limiting, Throttling & Async Semaphores',
    category: 'Async & LLM Services',
    definition: 'Controlling concurrency using asyncio.Semaphore to enforce vendor TPM (Tokens Per Minute) and RPM (Requests Per Minute) boundaries without getting rejected with HTTP 429 Too Many Requests.',
    keyPoints: [
      'An asyncio.Semaphore(N) acts as a concurrency gatekeeper, allowing at most N simultaneous calls.',
      'Pairing semaphores with exponential backoff and jitter guarantees smooth recovery during API rate-limit spikes.',
      'Leaky bucket algorithms pace bursts of requests into steady, deterministic request streams.'
    ],
    analogy: 'A semaphore is a nightclub bouncer: only 5 patrons are allowed on the dance floor at once. When one leaves, the next in line enters.',
    pitfall: 'Launching 500 parallel API calls without a semaphore, instantly exhausting OpenAI/Anthropic rate limits and triggering 429 backoff penalties.',
    codeSnippet: `import asyncio

sem = asyncio.Semaphore(3) # Max 3 concurrent requests

async def safe_llm_call(task_id: int):
    async with sem: # Waits if 3 tasks are already inside
        print(f"Task {task_id} acquired permit")
        await asyncio.sleep(0.5) # Network I/O
        print(f"Task {task_id} released permit")
        return f"Result {task_id}"

async def main():
    await asyncio.gather(*(safe_llm_call(i) for i in range(9)))`,
    visualization: 'semaphore-throttle'
  },
  {
    id: 'token-streaming-with-async-generators',
    number: 14,
    title: 'Token Streaming with Async Generators (async for)',
    category: 'Async & LLM Services',
    definition: 'Consuming and emitting real-time token streams via async generators (yield in async def). Powers modern Server-Sent Events (SSE) and WebSocket endpoints to achieve Time-To-First-Token (TTFT) under 300ms.',
    keyPoints: [
      'Async generators yield individual token chunks as they arrive over HTTP chunked transfer encoding.',
      'Reduces perceived user latency: users read generated text immediately rather than waiting 15 seconds for complete synthesis.',
      'Supports cooperative cancellation: if the client disconnects, breaking the async generator loop cleanly terminates upstream GPU generation.'
    ],
    analogy: 'Streaming is drinking water from a tap as it flows; non-streaming is waiting for a 5-gallon bucket to fill before taking a single sip.',
    pitfall: 'Buffering all stream chunks into a string inside the generator before yielding, completely defeating the purpose of streaming.',
    codeSnippet: `import asyncio
from typing import AsyncGenerator

async def mock_token_stream(prompt: str) -> AsyncGenerator[str, None]:
    tokens = ["The", " future", " of", " AI", " is", " streaming."]
    for token in tokens:
        await asyncio.sleep(0.08) # Simulate token generation latency
        yield token

async def client_consumer():
    print("Beginning stream: ", end="", flush=True)
    async for chunk in mock_token_stream("hello"):
        print(chunk, end="", flush=True)
    print("\n[Stream complete]")`,
    visualization: 'token-streamer'
  },
  {
    id: 'httpx-connection-pooling-and-http2',
    number: 15,
    title: 'HTTPX Connection Pooling & HTTP/2 Multiplexing',
    category: 'Async & LLM Services',
    definition: 'Utilizing httpx.AsyncClient with persistent TLS connection reuse and HTTP/2 multiplexing to eliminate repeated TCP 3-way handshakes and TLS negotiations on high-throughput LLM API calls.',
    keyPoints: [
      'Reusing a single AsyncClient instance across requests saves 100ms-300ms of TLS handshake latency per call.',
      'HTTP/2 multiplexing sends concurrent requests over a single TCP socket without head-of-line blocking.',
      'Always configure explicit connect, read, and write timeouts to prevent hung requests during upstream provider outages.'
    ],
    analogy: 'Connection pooling is a permanent dedicated phone line between two offices, instead of dialing the operator, negotiating numbers, and verifying identity on every single word.',
    pitfall: 'Instantiating a new httpx.AsyncClient() inside every function call, closing sockets immediately and suffering connection exhaustion (TIME_WAIT).',
    codeSnippet: `import httpx

limits = httpx.Limits(max_keepalive_connections=20, max_connections=100)
timeout = httpx.Timeout(connect=5.0, read=30.0, write=5.0, pool=5.0)

# Singleton client pattern
async def get_client() -> httpx.AsyncClient:
    return httpx.AsyncClient(limits=limits, timeout=timeout, http2=True)

# Usage across entire server lifecycle:
# client = await get_client()
# response = await client.post("https://api.openai.com/v1/...", ...)`,
    visualization: 'http2-multiplex'
  },

  // Module 4: Typing & Structured Output
  {
    id: 'modern-python-type-system',
    number: 16,
    title: 'Modern Type Hinting (Generics, Unions, TypeVar)',
    category: 'Typing & Structured Output',
    definition: 'Leveraging Python 3.10+ static typing syntax (A | B, TypeVar, Generic, ParamSpec) to build self-documenting AI architectures that can be verified statically with pyright / mypy before deploying to production.',
    keyPoints: [
      'Clean syntax: int | None replaces Optional[int], list[str] replaces List[str].',
      'Generic classes (e.g., VectorStore[DocumentType]) ensure type safety when swapping data models.',
      'Static type checkers catch shape mismatches, missing dict keys, and None dereferences at compile-time.'
    ],
    analogy: 'Type hints are like labeling electrical sockets with voltage and plug shape: they prevent you from plugging a 220V appliance into a 110V circuit.',
    pitfall: 'Relying on Any or generic dict[str, Any] for LLM payloads, allowing schema mutations to silently break downstream pipelines.',
    codeSnippet: `from typing import Generic, TypeVar

T = TypeVar('T')

class EmbeddingRecord(Generic[T]):
    def __init__(self, id: str, vector: list[float], payload: T):
        self.id = id
        self.vector = vector
        self.payload: T = payload

# Statically verified payload type:
record: EmbeddingRecord[dict[str, str]] = EmbeddingRecord(
    id="doc_1", 
    vector=[0.1, -0.4, 0.9], 
    payload={"title": "Attention Is All You Need"}
)`,
    visualization: 'type-checker'
  },
  {
    id: 'protocols-and-structural-subtyping',
    number: 17,
    title: 'Protocols & Duck Typing (typing.Protocol)',
    category: 'Typing & Structured Output',
    definition: 'Using typing.Protocol to define compile-time verified interfaces without requiring explicit inheritance. Allows swapping vector databases, embedding providers, and LLM backends via structural subtyping.',
    keyPoints: [
      'Structural subtyping: any class implementing required methods automatically satisfies the Protocol.',
      'Eliminates tight coupling and multi-inheritance dependency hell in large AI codebases.',
      'Enables mocking LLM providers in automated test suites with 100% type fidelity.'
    ],
    analogy: 'A Protocol is a job description: if a candidate has a valid passport and knows Python, they qualify for the job, regardless of what school they graduated from.',
    pitfall: 'Forcing classes to inherit from monolithic ABCs (Abstract Base Classes), causing brittle diamond inheritance hierarchies.',
    codeSnippet: `from typing import Protocol, runtime_checkable

@runtime_checkable
class LLMProvider(Protocol):
    async def generate(self, prompt: str, temperature: float = 0.7) -> str: ...

# Any class matching the signature satisfies the Protocol automatically:
class MockLocalLLM:
    async def generate(self, prompt: str, temperature: float = 0.7) -> str:
        return "Deterministic test response"

def execute_pipeline(model: LLMProvider):
    assert isinstance(model, LLMProvider) # Verified!`,
    visualization: 'protocol-ducktyping'
  },
  {
    id: 'pydantic-v2-core-internals',
    number: 18,
    title: 'Pydantic v2 Core: Rust-Powered Validation',
    category: 'Typing & Structured Output',
    definition: 'Pydantic v2 offloads data validation and serialization to pydantic-core, a high-performance compiled Rust engine, achieving 5x to 17x speedups over v1 when parsing high-volume JSON payloads.',
    keyPoints: [
      'pydantic-core parses JSON directly into validated Rust structs before creating Python object representations.',
      '@field_validator and @model_validator provide declarative sanitation and cross-field invariant enforcement.',
      'Supports strict=True mode to prevent unwanted type coercion (e.g., rejecting "123" when an int is expected).'
    ],
    analogy: 'Pydantic v1 was a manual security guard checking IDs one by one. Pydantic v2 is an automated airport biometric scanner built with titanium and lasers.',
    pitfall: 'Using v1 syntax (@validator) in modern codebases or omitting strict mode when validating sensitive financial AI inputs.',
    codeSnippet: `from pydantic import BaseModel, Field, field_validator

class ExtractionTarget(BaseModel):
    confidence: float = Field(ge=0.0, le=1.0)
    sentiment: str
    tags: list[str] = Field(default_factory=list)

    @field_validator('sentiment')
    @classmethod
    def validate_sentiment(cls, v: str) -> str:
        if v.upper() not in {'POSITIVE', 'NEGATIVE', 'NEUTRAL'}:
            raise ValueError("Invalid sentiment category")
        return v.upper()`,
    visualization: 'pydantic-core'
  },
  {
    id: 'structured-llm-outputs-and-json-schema',
    number: 19,
    title: 'Structured LLM Outputs & JSON Schema Extraction',
    category: 'Typing & Structured Output',
    definition: 'Generating deterministic JSON Schemas from Pydantic models (model_json_schema) and enforcing constrained decoding or tool-calling modes in modern LLMs (OpenAI JSON Mode / Anthropic Tool Use).',
    keyPoints: [
      'Converts Python classes into OpenAPI-compatible JSON Schemas to constrain LLM sampling logits.',
      'Guarantees output conforms to exact field names, nested objects, and enum constraints.',
      'Forms the foundation of production Agentic tool use and reliable database query synthesis.'
    ],
    analogy: 'Structured extraction is handing the model a pre-cut wooden puzzle frame: the model can only place tokens that physically fit into the designated shapes.',
    pitfall: 'Asking the LLM to output valid JSON in the system prompt without passing the formal schema to the API runtime, resulting in markdown code-fence syntax errors (```json).',
    codeSnippet: `from pydantic import BaseModel
import json

class EntityExtraction(BaseModel):
    entities: list[str]
    is_urgent: bool

# Pass schema directly to model tool definitions:
schema = EntityExtraction.model_json_schema()
print(json.dumps(schema, indent=2))
# Model output string -> validated instance:
raw_llm_json = '{"entities": ["Server", "DB"], "is_urgent": true}'
parsed = EntityExtraction.model_validate_json(raw_llm_json)`,
    visualization: 'json-schema-extract'
  },
  {
    id: 'self-correcting-llm-retry-loops',
    number: 20,
    title: 'Self-Correcting LLM Extraction Loops',
    category: 'Typing & Structured Output',
    definition: 'Building resilient validation pipelines that catch Pydantic ValidationError exceptions, format the exact schema error message into a repair prompt, and re-query the model to achieve 99.9% extraction reliability.',
    keyPoints: [
      'Models rarely make the same structural mistake when shown their exact JSON path error.',
      'Repair prompt injection: append the invalid JSON and the Pydantic ValidationError trace to the conversation.',
      'Limits retry count (typically max 2-3 attempts) to bound cost and latency.'
    ],
    analogy: 'A self-correcting loop is a compiler telling a programmer: "Syntax error on line 4: missing comma" instead of silently crashing the whole operating system.',
    pitfall: 'Retrying the exact same prompt repeatedly without telling the LLM what validation error it produced, resulting in identical failures.',
    codeSnippet: `from pydantic import BaseModel, ValidationError

class UserProfile(BaseModel):
    age: int
    email: str

def parse_with_repair(raw_output: str, model_client, retries=2):
    for attempt in range(retries):
        try:
            return UserProfile.model_validate_json(raw_output)
        except ValidationError as e:
            repair_prompt = f"Fix this JSON: {raw_output}. Errors: {e.errors()}"
            raw_output = model_client(repair_prompt)
    raise RuntimeError("Failed to extract valid schema after retries")`,
    visualization: 'self-healing-loop'
  },

  // Module 5: Production & Concurrency
  {
    id: 'generators-and-lazy-evaluation',
    number: 21,
    title: 'Generators & Lazy Evaluation for Massive Datasets',
    category: 'Production & Concurrency',
    definition: 'Using generator functions (yield) and itertools to stream, filter, and batch massive token datasets line-by-line in constant O(1) memory, rather than loading multi-gigabyte JSONL files into RAM.',
    keyPoints: [
      'Generators produce one item on demand via next() and preserve state between iterations.',
      'Generator pipelines can be composed: parse_jsonl(stream) -> tokenize(stream) -> create_batches(stream).',
      'Keeps working memory footprint under 50MB even when processing 500GB training corpora.'
    ],
    analogy: 'A generator is an assembly line conveyor belt delivering one part at a time, rather than a dump truck unloading 100,000 parts onto your living room floor all at once.',
    pitfall: 'Calling list(generator) on a 10-million row pretraining dataset, immediately triggering an Out-Of-Memory (OOM) kernel kill.',
    codeSnippet: `from typing import Iterator

def stream_jsonl(filepath: str) -> Iterator[str]:
    with open(filepath, 'r', encoding='utf-8') as f:
        for line in f:
            yield line.strip() # O(1) memory footprint

def batch_stream(stream: Iterator[str], batch_size=32) -> Iterator[list[str]]:
    batch = []
    for item in stream:
        batch.append(item)
        if len(batch) == batch_size:
            yield batch
            batch = []
    if batch: yield batch`,
    visualization: 'generator-pipeline'
  },
  {
    id: 'context-managers-and-telemetry',
    number: 22,
    title: 'Context Managers for Latency & GPU Telemetry',
    category: 'Production & Concurrency',
    definition: 'Constructing Python context managers (__enter__ and __exit__ / @contextmanager) to automate GPU VRAM cache clearing, OpenTelemetry trace spans, and microsecond-precision latency logging.',
    keyPoints: [
      'Guarantees cleanup code executes reliably even when exceptions occur inside the code block.',
      'Essential for managing PyTorch CUDA memory contexts: torch.cuda.empty_cache() and torch.no_grad().',
      'Pairs with standard logging to produce structured timing logs for every stage of an inference pipeline.'
    ],
    analogy: 'A context manager is an automatic door closer: no matter how hurried you are or what happens inside the room, the door is guaranteed to close and lock behind you.',
    pitfall: 'Forgetting to handle exceptions in __exit__, either swallowing critical errors unintentionally or leaving unclosed GPU resources.',
    codeSnippet: `import time
from contextlib import contextmanager

@contextmanager
def inference_timer(stage_name: str):
    start = time.perf_counter()
    try:
        yield
    finally:
        elapsed = (time.perf_counter() - start) * 1000
        print(f"[{stage_name}] Latency: {elapsed:.2f}ms")

# Usage:
with inference_timer("LLM Forward Pass"):
    time.sleep(0.12) # Simulating forward computation`,
    visualization: 'context-manager'
  },
  {
    id: 'multiprocessing-worker-pools',
    number: 23,
    title: 'Multiprocessing Pools for Batch Tokenization',
    category: 'Production & Concurrency',
    definition: 'Bypassing the GIL for CPU-bound data preprocessing by spawning isolated OS processes with ProcessPoolExecutor and sharing zero-copy array memory with multiprocessing.shared_memory.',
    keyPoints: [
      'Each worker process runs its own CPython interpreter with its own independent GIL and memory space.',
      'Ideal for heavy text tokenization, image augmentation, and parsing millions of raw PDF/HTML documents.',
      'Inter-process communication (IPC) uses pickle serialization; passing massive data structures can cause IPC bottlenecks unless shared memory is used.'
    ],
    analogy: 'Multiprocessing is opening 8 identical standalone bakeries across town, each with its own oven, ingredients, and bakers, rather than crowding 8 bakers around 1 single oven.',
    pitfall: 'Passing multi-gigabyte Python objects as arguments to multiprocessing workers, causing CPython to serialize and copy the entire object across IPC pipes.',
    codeSnippet: `from concurrent.futures import ProcessPoolExecutor
import os

def cpu_heavy_tokenize(text_chunk: str) -> list[int]:
    # Runs in independent process with its own GIL
    return [ord(c) % 500 for c in text_chunk]

if __name__ == '__main__':
    chunks = ["sample text 1", "sample text 2", "sample text 3"]
    with ProcessPoolExecutor(max_workers=os.cpu_count()) as executor:
        results = list(executor.map(cpu_heavy_tokenize, chunks))
    print(f"Processed {len(results)} chunks")`,
    visualization: 'process-pool'
  },
  {
    id: 'uv-dependency-graph',
    number: 24,
    title: 'Modern Tooling, Packaging & Fast Environments (uv, wheels)',
    category: 'Production & Concurrency',
    definition: 'Modern Python environments for AI require high-speed package resolution (uv, written in Rust), wheel binary compilation, and reproducible lockfiles to manage complex CUDA/PyTorch dependencies without conflicts.',
    keyPoints: [
      'uv resolves and installs dependencies 10x-100x faster than traditional pip, utilizing global content-addressable wheel caching.',
      'PyTorch binary distributions depend on pre-compiled CUDA wheels tailored to specific host GPU driver compute capabilities.',
      'Using pyproject.toml and locked environments guarantees that production inference containers never suffer breaking dependency drifts.'
    ],
    analogy: 'uv is a hyper-speed 3D printer that manufactures your entire tool shed in 2 seconds from blueprints, while old pip was a mail-order catalog waiting weeks for individual nuts and bolts.',
    pitfall: 'Running unpinned pip install torch in production Dockerfiles, inadvertently pulling incompatible CUDA versions that fail to detect the host GPU.',
    codeSnippet: `# Modern pyproject.toml configuration
# [project]
# name = "ai-inference-service"
# dependencies = [
#     "torch>=2.4.0",
#     "pydantic>=2.8.0",
#     "httpx[http2]>=0.27.0",
#     "numpy>=2.0.0"
# ]
#
# Ultra-fast lockfile resolution:
# $ uv pip compile pyproject.toml -o requirements.lock
# $ uv pip sync requirements.lock`,
    visualization: 'uv-dependency-graph'
  }
];

export const getPythonAiSubtopic = (id: string) => pythonAiSubtopics.find(t => t.id === id);

export const pythonAiCategories = [
  'All',
  'CPython & Memory',
  'Vectorization & Numerics',
  'Async & LLM Services',
  'Typing & Structured Output',
  'Production & Concurrency'
] as const;

export interface PythonAiQuizQuestion {
  id: string;
  subtopicId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const pythonAiQuizQuestions: PythonAiQuizQuestion[] = [
  {
    id: 'q1',
    subtopicId: 'cpython-memory-model-pyobject',
    question: 'Why does a standard Python 64-bit integer take 28 bytes in CPython instead of 8 bytes?',
    options: [
      'Python integers are automatically encrypted in RAM for memory safety.',
      'CPython wraps every value in a PyObject header containing an 8-byte reference count, an 8-byte type pointer, and an 8-byte digit array count.',
      'The Python garbage collector requires 20 bytes of parity checksums on every variable.',
      'Integers in Python are compiled directly into string representations.'
    ],
    correctIndex: 1,
    explanation: 'CPython’s PyObject struct requires an 8-byte ob_refcnt and an 8-byte ob_type pointer, plus digit layout metadata, totaling 28 bytes for small integers. Vectorized tensors avoid this overhead by packing raw unboxed bytes consecutively.',
    difficulty: 'Medium'
  },
  {
    id: 'q2',
    subtopicId: 'gil-and-multithreading',
    question: 'When does Python threading actually achieve true multi-core speedup in an AI application?',
    options: [
      'When executing pure Python for-loops over text tokens.',
      'When performing NumPy or PyTorch matrix multiplications (e.g., GEMM), because C-extensions explicitly release the GIL.',
      'Threading never speeds up any Python application under any circumstance.',
      'Only when running on 32-bit legacy processors.'
    ],
    correctIndex: 1,
    explanation: 'C-extension libraries such as NumPy, PyTorch, and OpenBLAS explicitly call Py_BEGIN_ALLOW_THREADS to release the GIL, enabling parallel C/CUDA threads to run simultaneously across all CPU cores.',
    difficulty: 'Medium'
  },
  {
    id: 'q3',
    subtopicId: 'contiguous-arrays-vs-python-lists',
    question: 'What is the primary hardware reason contiguous NumPy arrays outperform Python lists for numerical operations?',
    options: [
      'NumPy arrays are stored in the CPU registers permanently.',
      'Contiguous memory enables sequential CPU cache line prefetching (L1/L2) and SIMD vector instructions, avoiding pointer-chasing.',
      'Python lists are limited to single-byte precision.',
      'NumPy uses cloud servers to execute calculations remotely.'
    ],
    correctIndex: 1,
    explanation: 'Contiguous arrays store bytes sequentially, allowing CPU hardware prefetchers to load entire 64-byte cache lines at once and execute SIMD (AVX/NEON) vector instructions. Python lists require dereferencing scattered heap pointers, causing frequent cache misses.',
    difficulty: 'Easy'
  },
  {
    id: 'q4',
    subtopicId: 'strides-views-vs-copies',
    question: 'What occurs in memory when you transpose a 2D NumPy array with arr.T?',
    options: [
      'Every single element is copied to a new memory address in reverse order.',
      'NumPy creates a new zero-copy view with reversed strides tuples without copying a single byte.',
      'The array is converted into a Python linked list.',
      'The array becomes read-only and deletes its underlying buffer.'
    ],
    correctIndex: 1,
    explanation: 'Transpose (.T) is an instantaneous metadata operation: it swaps the shape and strides tuples (e.g. from (16, 4) to (4, 16)). No tensor data is copied in memory.',
    difficulty: 'Hard'
  },
  {
    id: 'q5',
    subtopicId: 'asyncio-event-loop-and-coroutines',
    question: 'What happens if you invoke time.sleep(5) inside an async def FastAPI inference endpoint?',
    options: [
      'Only that single request sleeps; other concurrent requests continue executing smoothly.',
      'The entire single-threaded asyncio event loop freezes for 5 seconds, blocking all concurrent users and requests.',
      'FastAPI automatically moves the function to a background worker process.',
      'The Python interpreter throws a SyntaxError.'
    ],
    correctIndex: 1,
    explanation: 'Because asyncio is single-threaded cooperative concurrency, blocking synchronous calls like time.sleep() monopolize the thread and prevent the event loop from servicing any other concurrent tasks. Use await asyncio.sleep() instead.',
    difficulty: 'Easy'
  },
  {
    id: 'q6',
    subtopicId: 'rate-limiting-and-semaphores',
    question: 'How does an asyncio.Semaphore(10) protect an AI microservice when processing 200 concurrent requests?',
    options: [
      'It cancels all requests exceeding the first 10 immediately.',
      'It restricts active concurrent execution inside the semaphore block to at most 10 at any time, queueing remaining tasks safely.',
      'It decreases the token generation temperature by 10%.',
      'It splits the requests into 10 separate physical machines.'
    ],
    correctIndex: 1,
    explanation: 'An asyncio.Semaphore maintains an internal counter. When 10 tasks acquire the permit, subsequent tasks await until an active task releases its permit, preventing API rate-limit exhaustion.',
    difficulty: 'Easy'
  },
  {
    id: 'q7',
    subtopicId: 'pydantic-v2-core-internals',
    question: 'What architectural change explains the 5x-15x performance increase of Pydantic v2 over Pydantic v1?',
    options: [
      'Pydantic v2 disables all validation checks by default.',
      'The core validation and JSON parsing engine (pydantic-core) was rewritten in compiled Rust.',
      'Pydantic v2 runs exclusively on GPU tensor cores.',
      'Pydantic v2 converts Python models to C++ header files on import.'
    ],
    correctIndex: 1,
    explanation: 'Pydantic v2 moved its entire validation engine into pydantic-core, written in Rust. It parses JSON directly into Rust structs and traverses types at machine code speed before surfacing Python objects.',
    difficulty: 'Medium'
  },
  {
    id: 'q8',
    subtopicId: 'structured-llm-outputs-and-json-schema',
    question: 'How do production AI frameworks ensure deterministic structured outputs from probabilistic LLMs?',
    options: [
      'By asking the model "Please return only valid JSON" in the user prompt.',
      'By generating a JSON Schema from Pydantic and constraining token sampling logits or using tool-calling API modes.',
      'By running a regex findall on the output and guessing missing commas.',
      'By encrypting the prompt with SHA-256 before transmission.'
    ],
    correctIndex: 1,
    explanation: 'Constrained sampling and tool-calling modes pass the Pydantic-generated JSON Schema directly to the inference engine, restricting token generation logits so non-conforming tokens have zero probability.',
    difficulty: 'Medium'
  },
  {
    id: 'q9',
    subtopicId: 'generators-and-lazy-evaluation',
    question: 'Why are Python generators (yield) critical when preprocessing a 100GB training dataset on a machine with 16GB of RAM?',
    options: [
      'Generators compress data using gzip automatically.',
      'Generators stream elements lazily one-at-a-time on demand, maintaining an O(1) memory footprint rather than loading the full dataset.',
      'Generators run faster because they bypass Python bytecode.',
      'Generators force the OS to use swap space.'
    ],
    correctIndex: 1,
    explanation: 'Generators yield one element at a time and suspend execution, keeping memory usage constant (O(1)) regardless of whether the dataset contains 10 items or 10 billion items.',
    difficulty: 'Easy'
  },
  {
    id: 'q10',
    subtopicId: 'multiprocessing-worker-pools',
    question: 'When using ProcessPoolExecutor for batch tokenization, what can cause severe performance degradation if not designed carefully?',
    options: [
      'The CPU overheating from running multiple cores.',
      'Inter-Process Communication (IPC) overhead from serializing and pickling massive input/output objects across process boundaries.',
      'Processes running out of virtual PID numbers.',
      'Processes sharing the same Python GIL.'
    ],
    correctIndex: 1,
    explanation: 'Processes do not share memory space by default. Passing massive data objects across process boundaries forces CPython to pickle and unpickle data through OS pipes, which can exceed the time saved by parallel computation unless shared memory or chunking is used.',
    difficulty: 'Hard'
  }
];
