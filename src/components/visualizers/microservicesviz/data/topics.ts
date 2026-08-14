export interface MicroserviceTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Decomposition & Boundaries' | 'Resilience & Fault Tolerance' | 'Distributed Transactions & Sagas' | 'Observability & Tracing' | 'Protocols & Service Mesh';
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

export interface MicroserviceTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: MicroserviceTopic[];
}

export const microserviceTopics: MicroserviceTopic[] = [
  // 1. Decomposition & Boundaries
  {
    id: 'ddd-bounded-contexts-database-per-service',
    title: 'Domain-Driven Design (DDD) & Database-per-Service',
    kicker: 'Architecture / 01',
    group: 'Decomposition & Boundaries',
    difficulty: 'starter',
    summary: 'Decomposing monoliths into autonomous Bounded Contexts with isolated private datastores to prevent distributed monolith anti-patterns.',
    definition: 'Microservices architecture decomposes systems along business capabilities into autonomous Bounded Contexts. A non-negotiable rule is Database-per-Service: each microservice owns its private database. No other service may query its tables directly—all access must cross strict public API/gRPC or asynchronous event interfaces.',
    analogy: 'Independent sovereign countries: each country maintains its own internal currency and legal records. If Country A wants data from Country B, it sends a formal diplomatic ambassador (API request) rather than breaking into Country B’s confidential filing cabinets.',
    steps: [
      'Identify ubiquitous language and business subdomains (Core, Supporting, Generic)',
      'Draw Bounded Context boundaries separating domain models (e.g. Order vs Inventory vs Billing)',
      'Provision dedicated private database instance per service (PostgreSQL, MongoDB, DynamoDB)',
      'Expose versioned REST/gRPC or GraphQL contracts',
      'Publish Domain Events (e.g. OrderCreated) to asynchronous event brokers (Kafka/RabbitMQ)'
    ],
    mistakes: [
      'Allowing multiple microservices to read/write to a shared SQL database (creates a Distributed Monolith with tight schema coupling and single point of failure)',
      'Creating microservices that are too granular (e.g. a separate service for every database table)'
    ],
    optimization: 'Change Data Capture (CDC via Debezium) streams internal database mutations directly into Kafka topics without dual-write race conditions.',
    codeSnippet: `// Order Service - Autonomous Bounded Context with Private Database
import { Router } from 'express';
import { orderRepository } from './db/orderRepo';
import { eventBus } from './events/kafkaProducer';

export const orderRouter = Router();

orderRouter.post('/orders', async (req, res) => {
  const { customerId, items, totalAmount } = req.body;

  // 1. Write to private isolated database
  const order = await orderRepository.create({
    customerId,
    items,
    totalAmount,
    status: 'PENDING',
  });

  // 2. Publish asynchronous Domain Event across service boundaries
  await eventBus.publish('OrderCreated', {
    orderId: order.id,
    customerId,
    items,
    totalAmount,
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({ orderId: order.id, status: 'PENDING' });
});`,
    outputDescription: 'Maintains strict data encapsulation with asynchronous cross-service domain events.',
    related: ['circuit-breaker-bulkhead-resilience', 'saga-distributed-transactions', 'opentelemetry-distributed-tracing']
  },

  // 2. Resilience & Fault Tolerance
  {
    id: 'circuit-breaker-bulkhead-resilience',
    title: 'Circuit Breakers, Bulkheads & Cascading Failures',
    kicker: 'Resilience / 01',
    group: 'Resilience & Fault Tolerance',
    difficulty: 'intermediate',
    summary: 'Preventing total system collapse using 3-state Circuit Breakers (Closed, Open, Half-Open) and Bulkhead thread isolation.',
    definition: 'In distributed systems, failures are inevitable. A Circuit Breaker monitors downstream RPC calls. When the error or timeout rate exceeds a threshold (e.g. 50% errors over 10s), it trips OPEN, immediately rejecting traffic with cached fallbacks to prevent thread starvation. After a cooldown period, it enters HALF-OPEN to test canary requests before closing.',
    analogy: 'An electrical circuit breaker in your house: if a faulty appliance overloads a wire, the breaker trips to cut electricity instantly, preventing your entire house from catching fire.',
    steps: [
      'CLOSED state: Normal operation; requests pass through while error rate is tracked in a sliding window',
      'Failure Threshold Exceeded: Breaker trips to OPEN state',
      'OPEN state: Calls fail fast immediately without hitting downstream service, returning fallback data',
      'Reset Timeout expires: Breaker enters HALF-OPEN state',
      'Canary requests test downstream health: if successful -> CLOSED, if failed -> returns to OPEN'
    ],
    mistakes: [
      'Retrying failed requests infinitely in a tight loop without exponential backoff and jitter (causes self-inflicted Thundering Herd DDoS outages)',
      'Failing to isolate thread pools (Bulkheads), allowing one slow service to consume all available worker threads'
    ],
    optimization: 'Exponential Backoff with Full Jitter randomizes retry intervals, spreading burst traffic across the entire recovery window.',
    codeSnippet: `// Circuit Breaker State Machine Implementation
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly threshold = 5;
  private readonly resetTimeout = 10000; // 10s

  async execute<T>(action: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = 'HALF_OPEN';
      } else {
        return fallback(); // Fast-fail fallback
      }
    }

    try {
      const result = await action();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
      }
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.threshold) {
        this.state = 'OPEN';
      }
      return fallback();
    }
  }
}`,
    outputDescription: 'Trips circuit on downstream failure, guaranteeing sub-millisecond fast-fail recovery.',
    related: ['ddd-bounded-contexts-database-per-service', 'saga-distributed-transactions', 'grpc-service-mesh-envoy']
  },

  // 3. Distributed Transactions & Sagas
  {
    id: 'saga-distributed-transactions',
    title: 'The Saga Pattern: Orchestration vs Choreography',
    kicker: 'Transactions / 01',
    group: 'Distributed Transactions & Sagas',
    difficulty: 'advanced',
    summary: 'Managing distributed multi-service transactions without blocking Two-Phase Commit (2PC) using compensating rollback actions.',
    definition: 'Two-Phase Commit (2PC) does not scale in microservices due to synchronous locking. The Saga pattern models a long-running transaction as a sequence of local transactions across individual microservices. If any step fails (e.g. Payment Declined), the Saga executes Compensating Transactions in reverse order (e.g. Unreserve Inventory, Cancel Order) to restore eventual consistency.',
    analogy: 'Booking a vacation package (Flight, Hotel, Rental Car): if the rental car is sold out, you don’t lock the entire global travel database; you invoke cancellation policies to refund the hotel and flight reservations.',
    steps: [
      'Order Service creates Order in PENDING status; invokes Saga Coordinator',
      'Step 1: Inventory Service reserves items (Local Tx 1)',
      'Step 2: Payment Service attempts credit card charge (Local Tx 2)',
      'Failure Occurs: Payment declined due to insufficient funds',
      'Compensating Actions: Saga Coordinator invokes Inventory Service to release reserved stock and updates Order status to CANCELLED'
    ],
    mistakes: [
      'Assuming compensating transactions are identical to database ROLLBACKs (compensating transactions are new forward business actions visible to users)',
      'Neglecting idempotent consumers for compensation commands during message retries'
    ],
    optimization: 'Orchestrator Sagas centralize failure state management into a finite state machine (FSM), avoiding cyclical event loops inherent in complex choreography.',
    codeSnippet: `// Saga Orchestrator FSM Workflow
interface SagaStep {
  name: string;
  forward: () => Promise<void>;
  compensate: () => Promise<void>;
}

class OrderSagaOrchestrator {
  private executedSteps: SagaStep[] = [];

  async executeSaga(steps: SagaStep[]) {
    for (const step of steps) {
      try {
        await step.forward();
        this.executedSteps.push(step);
      } catch (err) {
        console.error(\`Saga failed at step: \${step.name}. Triggering compensations...\`);
        await this.rollback();
        throw new Error(\`Saga Failed: \${err.message}\`);
      }
    }
  }

  private async rollback() {
    // Execute compensating actions in reverse topological order
    for (const step of [...this.executedSteps].reverse()) {
      await step.compensate();
    }
  }
}`,
    outputDescription: 'Executes forward transactions with guaranteed compensating rollbacks on failure.',
    related: ['circuit-breaker-bulkhead-resilience', 'ddd-bounded-contexts-database-per-service', 'opentelemetry-distributed-tracing']
  },

  // 4. Observability & Distributed Tracing
  {
    id: 'opentelemetry-distributed-tracing',
    title: 'Distributed Tracing & OpenTelemetry (Trace & Span IDs)',
    kicker: 'Observability / 01',
    group: 'Observability & Tracing',
    difficulty: 'intermediate',
    summary: 'Correlating async requests across 50+ microservices using W3C Trace Context, Span IDs, and OpenTelemetry collectors.',
    definition: 'In a microservices architecture, a single user click triggers a cascade of synchronous RPCs and asynchronous message queue jobs. Distributed Tracing injects a unique TraceID and parent SpanID into HTTP/gRPC metadata headers (W3C traceparent). This reconstructs the complete end-to-end execution waterfall DAG with precise latency breakdowns and error root-cause localization.',
    analogy: 'Attaching a GPS tracking barcode to a postal parcel: as the package moves across airplanes, sorting hubs, and delivery vans, each transit station scans the same barcode, allowing you to track the exact timeline and bottleneck.',
    steps: [
      'API Gateway generates 128-bit hex TraceID: 4bf92f3577b34da6a3ce929d0e0e4736',
      'Generates root SpanID: 00f067aa0ba902b7',
      'Injects W3C header into outgoing RPC: traceparent: 00-4bf92f3577...-00f067aa...-01',
      'Downstream service extracts TraceID, generates child SpanID, and records span duration',
      'OpenTelemetry Collector aggregates all spans into a unified waterfall DAG trace'
    ],
    mistakes: [
      'Failing to propagate context headers across asynchronous background workers or message queues',
      'Sampling 100% of high-volume traces in multi-million req/sec systems (causes severe storage cost explosion; use tail-based sampling instead)'
    ],
    optimization: 'Tail-based sampling buffers spans in memory and only persists traces containing HTTP 5xx errors or latency > 1,000ms.',
    codeSnippet: `// W3C TraceContext Header Propagation
import { trace, context, propagation } from '@opentelemetry/api';

const tracer = trace.getTracer('payment-service');

export async function processPayment(orderId: string, amount: number) {
  // Start active span inheriting trace parent from active context
  return tracer.startActiveSpan('processPayment', async (span) => {
    span.setAttribute('order.id', orderId);
    span.setAttribute('payment.amount', amount);

    try {
      const chargeResult = await paymentGateway.charge(amount);
      span.setStatus({ code: 1 }); // OK
      return chargeResult;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message }); // ERROR
      throw error;
    } finally {
      span.end(); // Flushes span metrics to collector
    }
  });
}`,
    outputDescription: 'Traces distributed requests with end-to-end span telemetry and error recording.',
    related: ['ddd-bounded-contexts-database-per-service', 'circuit-breaker-bulkhead-resilience', 'grpc-service-mesh-envoy']
  },

  // 5. Protocols & Service Mesh
  {
    id: 'grpc-service-mesh-envoy',
    title: 'gRPC Protobuf & Service Mesh (Envoy Sidecars)',
    kicker: 'Service Mesh / 01',
    group: 'Protocols & Service Mesh',
    difficulty: 'expert',
    summary: 'High-performance binary Protobuf serialization over HTTP/2 and mTLS traffic routing via Envoy sidecar proxies (Istio).',
    definition: 'Inter-service communication inside a microservices cluster is optimized using gRPC over HTTP/2 multiplexed connections with binary Protocol Buffers (Protobuf). A Service Mesh (Istio / Linkerd) deploys an Envoy sidecar proxy alongside every container, offloading mutual TLS (mTLS) encryption, traffic shifting (canary releases), and telemetry without touching application code.',
    analogy: 'Every diplomat in a foreign summit having a dedicated multilingual security bodyguard (Envoy Sidecar) who handles all encryption, translation, security vetting, and phone routing, allowing the diplomat to focus 100% on policy.',
    steps: [
      'Define strongly-typed service interface in .proto file (e.g. rpc GetUser (UserRequest) returns (UserResponse))',
      'Protobuf compiler generates optimized native serialization binaries in Go, Rust, Java, or Node',
      'Application issues gRPC call to localhost Envoy proxy over HTTP/2',
      'Envoy sidecar encrypts payload with ephemeral mTLS certificate and applies load-balancing policy',
      'Remote Envoy sidecar decrypts payload and forwards request to destination application container'
    ],
    mistakes: [
      'Using uncompressed JSON REST for chatty high-frequency internal microservice communication (wastes 70% CPU on parsing)',
      'Deploying a full service mesh without sufficient operational scale (introduces 2-5ms sidecar hop latency overhead)'
    ],
    optimization: 'gRPC HTTP/2 connection pooling multiplexes 10,000+ RPC requests over a single persistent TCP socket, eliminating TCP handshake overhead.',
    codeSnippet: `// Protocol Buffer Definition: orders.proto
syntax = "proto3";

package cosmos.orders;

service OrderService {
  rpc GetOrder (OrderRequest) returns (OrderResponse);
  rpc StreamOrderUpdates (OrderRequest) returns (stream OrderStatusUpdate);
}

message OrderRequest {
  string order_id = 1;
}

message OrderResponse {
  string order_id = 1;
  string customer_id = 2;
  double total_amount = 3;
  string status = 4;
}`,
    outputDescription: 'Defines schema-enforced, binary-serialized gRPC RPC service interface.',
    related: ['opentelemetry-distributed-tracing', 'circuit-breaker-bulkhead-resilience', 'saga-distributed-transactions']
  }
];

export const microserviceTopicGroups: MicroserviceTopicGroup[] = [
  {
    id: 'decomposition',
    name: 'Decomposition & Service Boundaries',
    description: 'Domain-Driven Design, Bounded Contexts, and Database-per-Service isolation patterns.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: microserviceTopics.filter(t => t.group === 'Decomposition & Boundaries')
  },
  {
    id: 'resilience',
    name: 'Resilience & Fault Tolerance',
    description: 'Circuit breakers (Closed/Open/Half-Open), Bulkheads, Rate Limiting, and Jitter retries.',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    topics: microserviceTopics.filter(t => t.group === 'Resilience & Fault Tolerance')
  },
  {
    id: 'transactions-sagas',
    name: 'Distributed Transactions & Sagas',
    description: 'Compensating transactions, Orchestration FSMs, and Choreographed asynchronous sagas.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: microserviceTopics.filter(t => t.group === 'Distributed Transactions & Sagas')
  },
  {
    id: 'observability',
    name: 'Observability & Distributed Tracing',
    description: 'OpenTelemetry W3C traceparents, Span IDs, and end-to-end waterfall latency localization.',
    badgeColor: 'border-sky-500/30 text-sky-400 bg-sky-500/10',
    topics: microserviceTopics.filter(t => t.group === 'Observability & Tracing')
  },
  {
    id: 'service-mesh',
    name: 'Protocols & Service Mesh',
    description: 'Binary gRPC Protobuf over HTTP/2, mTLS encryption, and Envoy sidecar proxy meshes.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: microserviceTopics.filter(t => t.group === 'Protocols & Service Mesh')
  }
];

export const getMicroserviceTopic = (id: string) => microserviceTopics.find(t => t.id === id);
