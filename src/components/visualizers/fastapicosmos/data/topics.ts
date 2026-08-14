export interface FastApiTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'ASGI & Starlette Core' | 'AsyncIO & Event Loop' | 'Pydantic V2 & Validation' | 'Dependency Injection' | 'Real-Time & Background Tasks';
  difficulty: 'starter' | 'intermediate' | 'advanced' | 'expert';
  summary: string;
  definition: string;
  analogy: string;
  steps: string[];
  mistakes: string[];
  optimization: string;
  codeSnippet: string;
  outputDescription: string;
  related: string[];
}

export interface FastApiTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: FastApiTopic[];
}

export const fastApiTopics: FastApiTopic[] = [
  // 1. ASGI & Starlette
  {
    id: 'asgi-vs-wsgi-uvicorn',
    title: 'ASGI vs WSGI & The Uvicorn Event Loop',
    kicker: 'Architecture / 01',
    group: 'ASGI & Starlette Core',
    difficulty: 'starter',
    summary: 'Why traditional WSGI synchronous servers block threads, and how ASGI enables non-blocking async Python I/O.',
    definition: 'WSGI (Web Server Gateway Interface) is synchronous: each concurrent HTTP connection occupies an entire OS worker thread. ASGI (Asynchronous Server Gateway Interface) is asynchronous: a single Python process running an event loop (Uvicorn on uvloop) coordinates thousands of concurrent requests by suspending I/O waiting periods via standard async/await.',
    analogy: 'A restaurant waiter (WSGI) who stands by the table for 15 minutes waiting while the chef cooks the meal, serving only 4 tables an hour vs an ASGI waiter who takes 50 orders in 2 minutes, passing tickets to the kitchen and delivering dishes as soon as they are ready.',
    steps: [
      'Uvicorn opens non-blocking socket listener via uvloop (libuv C binding)',
      'Constructs ASGI scope dictionary containing request headers, client IP, and HTTP path',
      'Calls application(scope, receive, send) asynchronously',
      'Middleware intercepts and mutates scope/headers',
      'Streams response bytes chunk-by-chunk through send({"type": "http.response.body"})'
    ],
    mistakes: [
      'Calling blocking synchronous libraries (e.g. time.sleep() or requests.get()) inside an async def endpoint (starves the entire event loop)',
      'Running Uvicorn with a single worker in production without a Gunicorn process manager'
    ],
    optimization: 'Running Uvicorn with uvloop delivers 300% higher HTTP request throughput than standard Python asyncio by utilizing libuv native C event polling.',
    codeSnippet: `# ASGI Application Function Contract
async def app(scope, receive, send):
    assert scope['type'] == 'http'
    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [[b'content-type', b'application/json']],
    })
    await send({
        'type': 'http.response.body',
        'body': b'{"status": "ok", "engine": "uvicorn"}',
    })`,
    outputDescription: 'Low-level ASGI protocol interface processing raw HTTP sockets.',
    related: ['async-def-vs-def', 'pydantic-v2-rust-core', 'dependency-injection-dag']
  },
  {
    id: 'async-def-vs-def',
    title: 'Endpoint Execution: async def vs def (ThreadPool Offload)',
    kicker: 'Concurrency / 01',
    group: 'AsyncIO & Event Loop',
    difficulty: 'intermediate',
    summary: 'How FastAPI automatically routes standard "def" functions to external AnyIO thread pools to avoid blocking the main event loop.',
    definition: 'FastAPI differentiates between async def and def handlers. async def functions execute directly on the main event loop (must never execute blocking CPU/I/O code). Standard def functions are automatically offloaded to an external worker ThreadPool (via AnyIO), safely isolating blocking database drivers (like psycopg2 or SQLAlchemy sync) from the event loop.',
    analogy: 'The master chef (Event Loop) handles all quick orders directly. When a recipe requires 30 minutes of manual dough kneading (def), the chef delegates the bowl to a kitchen assistant (ThreadPool) so the chef can keep preparing instant salads.',
    steps: [
      'FastAPI inspects function signature at startup using inspect.iscoroutinefunction()',
      'If async def: FastAPI calls await endpoint() directly in the event loop',
      'If standard def: FastAPI calls anyio.to_thread.run_sync(endpoint)',
      'Worker thread pool executes blocking code without freezing other concurrent requests',
      'Returns computed response back to the main ASGI event loop'
    ],
    mistakes: [
      'Declaring an endpoint as async def and then running blocking code like time.sleep(5) or sync boto3 calls',
      'Using def for lightweight non-blocking async queries (creates unnecessary thread context switching overhead)'
    ],
    optimization: 'Use async def with native async drivers (asyncpg, httpx, motor) for maximum 50,000+ req/sec non-blocking throughput.',
    codeSnippet: `from fastapi import FastAPI
import asyncio
import time

app = FastAPI()

# 1. Non-blocking Async I/O (Main Event Loop)
@app.get("/async-io")
async def async_io():
    await asyncio.sleep(1) # Suspends coroutine, 0 CPU wasted
    return {"mode": "async_event_loop"}

# 2. Blocking Sync I/O (Auto-offloaded to ThreadPool)
@app.get("/sync-blocking")
def sync_blocking():
    time.sleep(1) # ThreadPool worker sleeps safely; event loop unharmed
    return {"mode": "thread_pool_worker"}`,
    outputDescription: 'Demonstrates automated concurrency routing between event loop and thread pool.',
    related: ['asgi-vs-wsgi-uvicorn', 'dependency-injection-dag', 'background-tasks-sse']
  },

  // 2. Pydantic V2 & Validation
  {
    id: 'pydantic-v2-rust-core',
    title: 'Pydantic V2 & Rust Core Serialization Engine',
    kicker: 'Validation / 01',
    group: 'Pydantic V2 & Validation',
    difficulty: 'advanced',
    summary: 'The 20x speedup of Pydantic V2 using pydantic-core in Rust, strict type coercion, and JSON schema extraction.',
    definition: 'FastAPI uses Pydantic V2 for request validation and response serialization. In V2, the validation and JSON parsing engine was rewritten entirely in Rust (pydantic-core), executing data validation at compiled C/Rust speeds (~5x to 50x faster than pure Python) while enforcing strict static typing and generating interactive OpenAPI 3.1 JSON schemas.',
    analogy: 'Replacing a human customs inspector checking passports one stamp at a time with an automated biometric laser gate that verifies 1,000 passports per second in hardware.',
    steps: [
      'HTTP Request Body (JSON bytes) enters FastAPI endpoint',
      'Rust pydantic-core parses JSON directly into validated C structures without Python object allocations',
      'Applies field constraints (gt=0, regex, email validation, datetime parsing)',
      'Constructs validated Pydantic model and injects it into endpoint parameter',
      'Response model serializes back to JSON bytes at native Rust speeds via model_dump_json()'
    ],
    mistakes: [
      'Using manual dictionary validation instead of declarative Pydantic schemas',
      'Ignoring response_model parameter (leads to leaking sensitive database fields like hashed_password)'
    ],
    optimization: 'Pydantic V2 response_model serialization compiles to direct Rust bytecode, skipping Python dictionary transformation overhead.',
    codeSnippet: `from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=32)
    email: EmailStr
    age: int = Field(ge=18, le=120)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = {
        "str_strip_whitespace": True,
        "json_schema_extra": {"example": {"username": "ada_lovelace", "email": "ada@cosmos.org", "age": 28}}
    }`,
    outputDescription: 'Compiles type-safe validation schema with automated 422 Unprocessable Entity error payloads.',
    related: ['dependency-injection-dag', 'asgi-vs-wsgi-uvicorn', 'background-tasks-sse']
  },

  // 3. Dependency Injection
  {
    id: 'dependency-injection-dag',
    title: 'Hierarchical Dependency Injection (DAG & Yield Contexts)',
    kicker: 'Architecture / 02',
    group: 'Dependency Injection',
    difficulty: 'advanced',
    summary: 'How FastAPI builds a Directed Acyclic Graph (DAG) of Depends(), memoizes sub-dependencies, and executes teardown cleanup.',
    definition: 'FastAPI features a built-in Dependency Injection system powered by Depends(). At request time, FastAPI resolves dependencies as a Directed Acyclic Graph (DAG), caches results across sub-dependencies using use_cache=True (memoization), and guarantees cleanup teardown execution (database session commits, locks) using yield generators.',
    analogy: 'A modular factory assembly line: when assembling a car, the engine sub-assembly is built once and shared across multiple inspection stations, and all factory tools are automatically cleaned and returned to their shelves at the end of the shift.',
    steps: [
      'Client sends request to endpoint requiring multiple Depends() parameters',
      'FastAPI traverses dependency tree, constructing a topological execution order DAG',
      'Executes sub-dependencies (e.g. get_db(), get_current_user())',
      'Memoizes return values so duplicate dependencies run exactly once per request',
      'Executes endpoint handler',
      'Executes post-yield code in reverse order to close database connections and release locks'
    ],
    mistakes: [
      'Putting long-running computations inside dependencies without async or yield context scoping',
      'Disabling use_cache=True unnecessarily, causing duplicate database lookups in a single request'
    ],
    optimization: 'Yield dependencies guarantee 100% reliable database connection pooling return, preventing connection pool exhaustion under high concurrency.',
    codeSnippet: `from fastapi import FastAPI, Depends, HTTPException, status
from typing import AsyncGenerator

async def get_db_session() -> AsyncGenerator:
    session = await DatabasePool.acquire()
    try:
        yield session # Injected into endpoint
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close() # Guaranteed cleanup!

async def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_db_session)):
    user = await db.query_user(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user`,
    outputDescription: 'Resolves database session and authentication in an atomic DAG with guaranteed cleanup.',
    related: ['pydantic-v2-rust-core', 'async-def-vs-def', 'background-tasks-sse']
  },

  // 4. Real-Time & Background
  {
    id: 'background-tasks-sse',
    title: 'Background Tasks, Server-Sent Events (SSE) & WebSockets',
    kicker: 'Real-Time / 01',
    group: 'Real-Time & Background Tasks',
    difficulty: 'intermediate',
    summary: 'Streaming real-time SSE tokens, full-duplex WebSockets, and firing background tasks after sending HTTP responses.',
    definition: 'FastAPI natively supports asynchronous streaming patterns. BackgroundTasks queues lightweight jobs (sending welcome emails, logging audit trails) to run after the HTTP response has been sent to the client. Server-Sent Events (SSE) stream AI LLM tokens via sse-starlette, while WebSockets enable full-duplex real-time communication.',
    analogy: 'A coffee shop cashier handing you your espresso cup immediately, while a background barista grinds new coffee beans in the background without making you wait at the register.',
    steps: [
      'Client invokes endpoint: e.g. POST /signup',
      'Endpoint registers background job: background_tasks.add_task(send_email, user.email)',
      'FastAPI returns HTTP 201 Created to client immediately (<10ms)',
      'Event loop executes send_email() asynchronously in the background',
      'For SSE: yields EventSourceMessage chunks continuously over persistent HTTP stream'
    ],
    mistakes: [
      'Using BackgroundTasks for heavy multi-minute CPU tasks (use Celery, Redis Queue, or ARQ instead)',
      'Failing to handle WebSocket disconnection exceptions causing zombie connection leaks'
    ],
    optimization: 'Streaming LLM tokens with Server-Sent Events reduces Time to First Token (TTFT) perceived latency by 90% compared to waiting for full generation.',
    codeSnippet: `from fastapi import FastAPI, BackgroundTasks
from sse_starlette.sse import EventSourceResponse
import asyncio

app = FastAPI()

# 1. Background Task (Runs after HTTP Response)
@app.post("/register")
async def register(email: str, bg: BackgroundTasks):
    bg.add_task(send_welcome_email, email)
    return {"message": "User registered, email will send in background"}

# 2. Server-Sent Events (Real-time Token Stream)
@app.get("/stream-tokens")
async def stream_tokens():
    async def token_generator():
        for word in ["Building", "high-performance", "async", "APIs", "with", "FastAPI"]:
            await asyncio.sleep(0.1)
            yield {"data": word}
    return EventSourceResponse(token_generator())`,
    outputDescription: 'Streams real-time event chunks with instant client responsiveness.',
    related: ['dependency-injection-dag', 'async-def-vs-def', 'asgi-vs-wsgi-uvicorn']
  }
];

export const fastApiTopicGroups: FastApiTopicGroup[] = [
  {
    id: 'asgi-core',
    name: 'ASGI & Starlette Core',
    description: 'Non-blocking I/O architectures, Uvicorn uvloop, and low-level ASGI scope handling.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: fastApiTopics.filter(t => t.group === 'ASGI & Starlette Core')
  },
  {
    id: 'async-concurrency',
    name: 'AsyncIO & Event Loop',
    description: 'Cooperative async/await multitasking and automatic ThreadPool routing for sync def.',
    badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    topics: fastApiTopics.filter(t => t.group === 'AsyncIO & Event Loop')
  },
  {
    id: 'pydantic-validation',
    name: 'Pydantic V2 & Validation',
    description: 'Rust pydantic-core serialization speedups and OpenAPI 3.1 JSON schema generation.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: fastApiTopics.filter(t => t.group === 'Pydantic V2 & Validation')
  },
  {
    id: 'dependency-injection',
    name: 'Dependency Injection (DAG)',
    description: 'Hierarchical Depends() tree resolution, memoization cache, and yield context cleanup.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: fastApiTopics.filter(t => t.group === 'Dependency Injection')
  },
  {
    id: 'realtime-tasks',
    name: 'Real-Time & Background Tasks',
    description: 'Post-response BackgroundTasks queues, SSE streaming token generators, and WebSockets.',
    badgeColor: 'border-teal-500/30 text-teal-400 bg-teal-500/10',
    topics: fastApiTopics.filter(t => t.group === 'Real-Time & Background Tasks')
  }
];

export const getFastApiTopic = (id: string) => fastApiTopics.find(t => t.id === id);
