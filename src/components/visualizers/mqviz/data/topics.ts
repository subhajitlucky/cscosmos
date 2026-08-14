export interface MqTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Queueing Fundamentals' | 'Append-Only Commit Logs' | 'Consumer Groups & Scaling' | 'Resilience & Retries' | 'Event Streaming Patterns';
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

export interface MqTopicGroup {
  id: string;
  name: string;
  description: string;
  badgeColor: string;
  topics: MqTopic[];
}

export const mqTopics: MqTopic[] = [
  // 1. Fundamentals
  {
    id: 'pub-sub-vs-queue',
    title: 'Point-to-Point Queue vs Pub/Sub',
    kicker: 'Fundamentals / 01',
    group: 'Queueing Fundamentals',
    difficulty: 'starter',
    summary: 'The difference between competing consumer work queues and broadcast event channels.',
    definition: 'In a Point-to-Point Queue (e.g. RabbitMQ classic queue), each message is consumed by exactly one worker. In Publish/Subscribe (Pub/Sub), an event published to a topic is copied and delivered to every subscribed channel or independent consumer service.',
    analogy: 'Point-to-point is like a stack of support tickets in an office: the first worker to grab a ticket solves it alone. Pub/Sub is like an emergency broadcast siren: everyone tuned in hears the announcement simultaneously.',
    steps: [
      'Producer publishes message with a topic routing key',
      'Broker matches subscriber bindings',
      'In Point-to-Point: message is leased to one worker and deleted upon Ack',
      'In Pub/Sub: message is fanned out to independent subscriber queues',
      'Consumers process in parallel without stepping on each other'
    ],
    mistakes: [
      'Using point-to-point queues when multiple microservices need the same event for different purposes',
      'Forgetting consumer acknowledgments causing unacknowledged message memory leaks',
      'Assuming Pub/Sub guarantees global message ordering across multiple independent consumers'
    ],
    optimization: 'Decoupling producers from consumers converts synchronous request-reply network waterfalls into asynchronous background processing, smoothing out peak traffic spikes.',
    codeSnippet: `// RabbitMQ / AMQP Channel Setup
await channel.assertExchange('order_events', 'fanout', { durable: true });
await channel.assertQueue('email_notifications_queue');
await channel.bindQueue('email_notifications_queue', 'order_events', '');

// Publish Event
channel.publish('order_events', '', Buffer.from(JSON.stringify({ orderId: 'ord_901', total: 120 })));`,
    outputDescription: 'Broadcasts order event to Email, Analytics, and Inventory services in parallel.',
    related: ['delivery-guarantees', 'kafka-commit-log', 'consumer-groups']
  },
  {
    id: 'delivery-guarantees',
    title: 'Delivery Guarantees (At-Least-Once vs Exactly-Once)',
    kicker: 'Fundamentals / 02',
    group: 'Queueing Fundamentals',
    difficulty: 'intermediate',
    summary: 'Navigating At-Most-Once, At-Least-Once, and Idempotent Exactly-Once processing.',
    definition: 'Delivery semantics dictate what happens during network partitions and server crashes. At-Most-Once risks message loss. At-Least-Once guarantees delivery but may duplicate messages. Exactly-Once requires idempotent consumers or distributed two-phase transaction commits.',
    analogy: 'Sending a registered letter: At-Most-Once is standard mail with no tracking. At-Least-Once keeps sending copies until a signature receipt returns. Exactly-Once includes a unique stamp so your bank only credits the payment once.',
    steps: [
      'Producer attaches unique idempotency key (ProducerId + SequenceNumber)',
      'Broker writes message to disk and replies with ACK',
      'If ACK drops due to timeout, producer safely retries',
      'Broker deduplicates incoming retry using sequence index',
      'Consumer commits read offset in the same transaction as state mutation'
    ],
    mistakes: [
      'Assuming any message broker provides "magic" Exactly-Once without idempotent database writes',
      'Committing consumer offsets before business processing finishes, causing message loss on crash',
      'Ignoring network timeout edge cases during acknowledgment phases'
    ],
    optimization: 'Designing business logic to be inherently idempotent (e.g. UPSERT or tracking processed event IDs) makes At-Least-Once queues behave with Exactly-Once correctness at near-zero overhead.',
    codeSnippet: `// Idempotent Event Consumer Handler
async function handlePaymentEvent(event) {
  const existing = await db.processedEvents.findOne({ eventId: event.id });
  if (existing) {
    console.log('Duplicate event detected. Skipping execution:', event.id);
    return;
  }
  await db.transaction(async (tx) => {
    await tx.accounts.incrementBalance(event.userId, event.amount);
    await tx.processedEvents.insert({ eventId: event.id, processedAt: new Date() });
  });
}`,
    outputDescription: 'Guarantees bank balances are updated strictly once, even if network retries deliver the event 5 times.',
    related: ['pub-sub-vs-queue', 'idempotent-producers', 'dead-letter-retries']
  },

  // 2. Commit Logs
  {
    id: 'kafka-commit-log',
    title: 'Append-Only Commit Logs & Partitions',
    kicker: 'Commit Logs / 01',
    group: 'Append-Only Commit Logs',
    difficulty: 'advanced',
    summary: 'Why Kafka partitions use sequential disk writes, OS PageCache, and Zero-Copy for millions of ops/sec.',
    definition: 'Instead of deleting messages upon read, systems like Apache Kafka and Redpanda store events in an immutable, append-only commit log on disk. Topics are split into multiple partitions for horizontal scaling.',
    analogy: 'An immutable courtroom transcript ledger: stenographers only append new lines to the end of the page. Readers can reread past testimony at any speed simply by remembering their bookmark page number.',
    steps: [
      'Producer hashes message key: Partition = MurmurHash(key) % numPartitions',
      'Broker appends record to the end of partition segment file on disk',
      'Operating system buffers write in memory via Kernel PageCache',
      'Zero-Copy (sendfile system call) streams bytes directly from disk cache to network socket',
      'Message remains immutable on disk for days or months until retention policy expires'
    ],
    mistakes: [
      'Creating thousands of tiny partitions per broker, overwhelming OS file descriptors and metadata sync',
      'Using random or missing keys when strict per-entity ordering is required',
      'Treating Kafka like a traditional transient queue and attempting to delete individual messages'
    ],
    optimization: 'Sequential disk I/O approaches raw physical drive write speeds (hundreds of MB/s), outperforming random memory access in traditional database engines.',
    codeSnippet: `// Producing with Key-Based Partitioning
const producer = kafka.producer();
await producer.send({
  topic: 'customer-transactions',
  messages: [
    { 
      key: 'user_4821', // All events for user_4821 route to the SAME partition
      value: JSON.stringify({ action: 'TRANSFER', amount: 500 }),
      timestamp: Date.now()
    }
  ]
});`,
    outputDescription: 'Guarantees sequential FIFO execution for each user without locking other users.',
    related: ['consumer-groups', 'zero-copy-io', 'rebalance-protocols']
  },
  {
    id: 'zero-copy-io',
    title: 'Zero-Copy & OS PageCache Mechanics',
    kicker: 'Commit Logs / 02',
    group: 'Append-Only Commit Logs',
    difficulty: 'expert',
    summary: 'Bypassing user-space memory buffers using Linux sendfile() and kernel PageCache.',
    definition: 'Traditional servers copy data: Disk $\to$ OS PageCache $\to$ JVM/App Buffer $\to$ Socket Buffer $\to$ NIC. Svelte/Kafka commit logs use the Linux sendfile() syscall to transfer data directly from OS PageCache to Network Interface Card (NIC), skipping CPU memory copies.',
    analogy: 'Sending a container straight from the train cargo bay onto a cargo ship via conveyor, without unpacking every crate into a warehouse first.',
    steps: [
      'Consumer requests bytes at offset 10,480 to 20,480',
      'Kafka issues sendfile(socket_fd, file_fd, offset, count)',
      'Linux Kernel DMA (Direct Memory Access) copies from disk cache directly to network buffer',
      'Zero context switches between kernel space and user space memory',
      'Saturates 10Gbps/100Gbps network cards with less than 5% CPU utilization'
    ],
    mistakes: [
      'Allocating huge JVM heap sizes that fight the Linux kernel for PageCache RAM',
      'Enabling synchronous disk fsync on every single message instead of relying on OS background flush and replica durability'
    ],
    optimization: 'Keeping JVM heaps small (e.g. 6-8GB) allows remaining system RAM to act as a massive multi-gigabyte PageCache pool.',
    codeSnippet: `// Linux sendfile Syscall Architecture
// C/JVM Internals:
// FileChannel.transferTo(position, count, targetSocketChannel);
// Bypasses JVM user-space buffer completely.`,
    outputDescription: 'Enables a single broker node to stream 1,000,000+ messages per second.',
    related: ['kafka-commit-log', 'consumer-groups', 'resilience-isr']
  },

  // 3. Consumer Groups
  {
    id: 'consumer-groups',
    title: 'Consumer Groups & Partition Rebalancing',
    kicker: 'Scaling / 01',
    group: 'Consumer Groups & Scaling',
    difficulty: 'intermediate',
    summary: 'Distribute partition workloads across multiple worker instances with automatic failover.',
    definition: 'A Consumer Group consists of multiple worker instances sharing a single Group ID. Partitions of a topic are divided evenly among instances in the group. If an instance crashes, the group coordinator initiates a Rebalance to reassign orphaned partitions.',
    analogy: 'A bank teller counter: 6 lines of customers (partitions) are split among 3 active tellers (consumers). If one teller takes a lunch break, the other two tellers split the 6 lines evenly.',
    steps: [
      'Consumer instances join group via JoinGroup / SyncGroup heartbeat requests',
      'Group Coordinator assigns partitions using Cooperative Sticky or Range assignor',
      'Each consumer maintains and periodically commits its current offset (e.g. offset 412)',
      'If heartbeat drops for session.timeout.ms, coordinator triggers rebalance',
      'Healthy consumers pick up the failed partition and resume from last committed offset'
    ],
    mistakes: [
      'Adding more consumer instances than the total number of partitions (extra instances sit completely idle)',
      'Blocking the event loop in a single message handler causing heartbeat timeouts and rebalance storms',
      'Using legacy Eager rebalancing which pauses all consumers during every minor worker rollout'
    ],
    optimization: 'Using Cooperative Sticky Assignor enables incremental rebalancing without stopping the world for unaffected consumers.',
    codeSnippet: `// Kafka Consumer Group Definition
const consumer = kafka.consumer({
  groupId: 'fraud-detection-service',
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  partitionAssigners: [PartitionAssigners.cooperativeSticky]
});

await consumer.subscribe({ topic: 'customer-transactions', fromBeginning: false });
await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log(\`Partition \${partition} | Offset \${message.offset}: \${message.value}\`);
  }
});`,
    outputDescription: 'Scales consumer throughput linearly with partition count.',
    related: ['kafka-commit-log', 'consumer-lag', 'dead-letter-retries']
  },
  {
    id: 'consumer-lag',
    title: 'Consumer Lag & Backpressure Diagnostics',
    kicker: 'Scaling / 02',
    group: 'Consumer Groups & Scaling',
    difficulty: 'advanced',
    summary: 'Detecting processing bottlenecks by monitoring Log-End-Offset vs Consumer-Committed-Offset.',
    definition: 'Consumer Lag is the delta between the latest message written to a partition (Log-End-Offset) and the last message processed by the consumer (Current Offset). High lag indicates downstream bottlenecks, slow database queries, or unhandled exceptions.',
    analogy: 'An airport baggage conveyor: luggage is landing on the belt at 50 bags/min, but handlers are only loading 30 bags/min into carts. The piling bags represent consumer lag.',
    steps: [
      'Broker tracks Log-End-Offset (LEO = 50,000)',
      'Consumer commits processed offset (Offset = 42,000)',
      'Consumer Lag = LEO - Current Offset = 8,000 unread messages',
      'Lag metrics stream to Prometheus / Datadog alert thresholds',
      'Auto-scaler spins up additional worker containers or scales database write pools'
    ],
    mistakes: [
      'Ignoring consumer lag until broker disk fills up or message retention window expires',
      'Increasing consumer concurrency without scaling the downstream database write capacity',
      'Failing to batch database writes when processing high-throughput streams'
    ],
    optimization: 'Batching downstream database inserts (e.g. 500 events per bulk write) drops consumer CPU overhead by 90% and slashes lag.',
    codeSnippet: `// Batching Messages in Consumer Loop
await consumer.run({
  eachBatch: async ({ batch, resolveOffset, heartbeat }) => {
    const records = batch.messages.map(m => JSON.parse(m.value));
    await db.analytics.insertMany(records); // Bulk insert
    resolveOffset(batch.lastOffset());
    await heartbeat();
  }
});`,
    outputDescription: 'Processes 5,000 events/sec per worker with near-zero lag.',
    related: ['consumer-groups', 'dead-letter-retries', 'kafka-commit-log']
  },

  // 4. Resilience & Retries
  {
    id: 'dead-letter-retries',
    title: 'Dead-Letter Queues & Exponential Backoff Retries',
    kicker: 'Resilience / 01',
    group: 'Resilience & Retries',
    difficulty: 'intermediate',
    summary: 'Handle poison-pill messages and downstream outages without stalling topic processing.',
    definition: 'When processing fails, immediate retries can hammer a recovering service. A robust strategy uses exponential backoff retry queues (e.g. retry-10s, retry-1m) and ultimately shunts unrecoverable poison-pill messages into a Dead-Letter Queue (DLQ) for human inspection.',
    analogy: 'A package sorting center: if a parcel has an illegible address, workers do not shut down the entire conveyor belt. They set it aside in a dead-letter bin to investigate later.',
    steps: [
      'Consumer attempts message processing; an exception is thrown',
      'Catch block checks retry count in message headers',
      'If retryCount < max: publish message to delay retry topic with TTL and backoff',
      'If retryCount >= max: route to Dead-Letter Queue (DLQ) and commit offset on main topic',
      'Main topic pipeline continues uninterrupted'
    ],
    mistakes: [
      'Infinite immediate retries on fatal syntax/schema errors blocking the entire partition',
      'Dropping failed messages into /dev/null without dead-letter audit tracking',
      'Forgetting jitter on backoff times causing thundering herd synchronized retry storms'
    ],
    optimization: 'Full jitter ($Backoff = \text{random}(0, \text{base} \times 2^{\text{attempt}})$) distributes retry attempts across time, preventing cascading server collapses.',
    codeSnippet: `// Exponential Backoff with DLQ Router
async function processWithRetry(message, attempt = 0) {
  try {
    await sendPaymentToStripe(message);
  } catch (error) {
    if (attempt < 3) {
      const delayMs = Math.pow(2, attempt) * 1000 + Math.random() * 500; // Jitter
      console.log(\`Retry attempt \${attempt + 1} scheduled in \${delayMs}ms\`);
      await sleep(delayMs);
      return processWithRetry(message, attempt + 1);
    } else {
      console.error('Max retries exceeded. Routing to DLQ:', message.id);
      await producer.send({ topic: 'payments-dlq', messages: [message] });
    }
  }
}`,
    outputDescription: 'Guarantees 100% data preservation while keeping main topic velocity at max speed.',
    related: ['delivery-guarantees', 'resilience-isr', 'transactional-outbox']
  },
  {
    id: 'resilience-isr',
    title: 'In-Sync Replicas (ISR) & Acks=all Durability',
    kicker: 'Resilience / 02',
    group: 'Resilience & Retries',
    difficulty: 'advanced',
    summary: 'Raft/Paxos-style replication quorum, min.insync.replicas, and leader failovers.',
    definition: 'To survive hardware destruction, each partition has 1 Leader replica and N Follower replicas. The broker tracks In-Sync Replicas (ISR). With acks=all and min.insync.replicas=2, an acknowledgment is returned only after the message is safely replicated across quorum nodes.',
    analogy: 'Signing a treaty: the agreement is not binding until copies are verified and stamped in at least two independent international embassy vaults.',
    steps: [
      'Producer sends record with acks=all to Partition Leader node',
      'Leader writes record to local log and sends sync data to Followers',
      'Followers fetch and append; acknowledge back to Leader',
      'When quorum (min.insync.replicas) confirms, Leader sends ACK to Producer',
      'If Leader crashes, ZooKeeper/KRaft promotes an In-Sync Follower to new Leader with 0 data loss'
    ],
    mistakes: [
      'Using acks=1 or acks=0 for critical financial data, causing silent data loss on leader crash',
      'Setting min.insync.replicas equal to total replica count, making writes fail whenever any 1 node undergoes maintenance'
    ],
    optimization: 'Setting replication factor = 3 and min.insync.replicas = 2 allows continuous writes and zero data loss even during full single-node hardware outages.',
    codeSnippet: `// High-Durability Producer Configuration
const producer = kafka.producer({
  acks: -1, // acks=all: wait for full In-Sync Replica quorum
  timeout: 30000,
  retry: {
    initialRetryTime: 100,
    retries: 8
  }
});`,
    outputDescription: 'Zero message loss guarantee across server reboots and data center network splits.',
    related: ['dead-letter-retries', 'kafka-commit-log', 'idempotent-producers']
  },

  // 5. Patterns
  {
    id: 'transactional-outbox',
    title: 'Transactional Outbox Pattern',
    kicker: 'Patterns / 01',
    group: 'Event Streaming Patterns',
    difficulty: 'advanced',
    summary: 'Atomically coordinate SQL database mutations with message broker events using Change Data Capture (CDC).',
    definition: 'In distributed systems, writing to a database and publishing to a message broker in separate steps is vulnerable to dual-write failure. The Transactional Outbox pattern writes the business state AND an outbox message row in the same ACID database transaction, while a CDC relay (like Debezium) streams outbox rows to the broker.',
    analogy: 'Dropping a payment check into an outgoing mail tray right inside the bank teller drawer: the balance update and the outgoing letter are committed in the same physical box simultaneously.',
    steps: [
      'Application starts local database ACID transaction',
      'Mutates business table (e.g. INSERT INTO orders ...)',
      'Inserts event record into outbox table (INSERT INTO outbox ...)',
      'Commits local transaction (Atomicity guaranteed)',
      'CDC process (Debezium/Polling relay) reads outbox table log and streams events to Kafka'
    ],
    mistakes: [
      'Attempting distributed 2-Phase Commit (2PC) across microservices instead of Transactional Outbox',
      'Publishing to message queue first before committing to DB: if DB commit fails, ghost events trigger false operations',
      'Forgetting to truncate processed outbox table records over time'
    ],
    optimization: 'Log-based CDC (reading database WAL write-ahead logs) imposes 0 database lock contention and delivers sub-millisecond relay speeds.',
    codeSnippet: `// ACID Transaction with Outbox Table
await db.transaction(async (tx) => {
  const order = await tx.orders.create({ userId: 'u_99', total: 250 });
  await tx.outbox.create({
    aggregateType: 'Order',
    aggregateId: order.id,
    eventType: 'OrderCreated',
    payload: JSON.stringify(order)
  });
});
// Debezium captures the outbox INSERT via PostgreSQL WAL replication stream`,
    outputDescription: 'Eliminates dual-write inconsistencies forever.',
    related: ['event-sourcing', 'delivery-guarantees', 'dead-letter-retries']
  },
  {
    id: 'event-sourcing',
    title: 'Event Sourcing & CQRS Streams',
    kicker: 'Patterns / 02',
    group: 'Event Streaming Patterns',
    difficulty: 'expert',
    summary: 'Store state as a sequence of immutable domain events and project read models asynchronously.',
    definition: 'Instead of storing only current state (e.g. Balance = $150), Event Sourcing stores every state-changing event (AccountOpened, MoneyDeposited, FeeCharged). Command Query Responsibility Segregation (CQRS) uses these event streams to build high-speed read projections in Elasticsearch or Redis.',
    analogy: 'A bank passbook: it does not just show your remaining balance; it lists every single credit and debit line item since account creation, allowing you to reconstruct the balance at any exact second in history.',
    steps: [
      'Command arrives: "Withdraw $50"',
      'Aggregate loads past event stream and validates business invariants',
      'New event "MoneyWithdrawn" is appended to the event store',
      'Event stream broadcasts to Projection handlers',
      'Read models in SQL/Redis update asynchronously for sub-5ms queries'
    ],
    mistakes: [
      'Modifying or deleting past events in the event store (events must remain strictly immutable)',
      'Querying the raw event store for complex search filters instead of maintaining dedicated CQRS read projections',
      'Applying Event Sourcing to simple CRUD domains with no temporal or audit requirements'
    ],
    optimization: 'Snapshots stored every 1,000 events prevent replaying years of events when loading an aggregate into memory.',
    codeSnippet: `// Event Sourcing Aggregate Reconstitution
class BankAccountAggregate {
  balance = 0;
  status = 'INITIAL';

  apply(event) {
    switch (event.type) {
      case 'AccountOpened':
        this.status = 'ACTIVE';
        break;
      case 'MoneyDeposited':
        this.balance += event.amount;
        break;
      case 'MoneyWithdrawn':
        this.balance -= event.amount;
        break;
    }
  }
}`,
    outputDescription: 'Provides 100% auditable history and enables point-in-time state time-travel.',
    related: ['transactional-outbox', 'kafka-commit-log', 'delivery-guarantees']
  }
];

export const mqTopicGroups: MqTopicGroup[] = [
  {
    id: 'fundamentals',
    name: 'Queueing & Delivery Semantics',
    description: 'Point-to-point work queues, Pub/Sub fan-out, and At-Least-Once vs Exactly-Once contracts.',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
    topics: mqTopics.filter(t => t.group === 'Queueing Fundamentals')
  },
  {
    id: 'commit-logs',
    name: 'Append-Only Commit Logs',
    description: 'Kafka partition mechanics, OS PageCache sequential I/O, and Zero-Copy streaming.',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    topics: mqTopics.filter(t => t.group === 'Append-Only Commit Logs')
  },
  {
    id: 'consumer-scaling',
    name: 'Consumer Groups & Scale',
    description: 'Partition rebalancing protocols, cooperative assignors, and consumer lag diagnostics.',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    topics: mqTopics.filter(t => t.group === 'Consumer Groups & Scaling')
  },
  {
    id: 'resilience',
    name: 'Fault Tolerance & Retries',
    description: 'In-Sync Replicas (ISR), quorum durability, dead-letter queues, and jitter backoff.',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
    topics: mqTopics.filter(t => t.group === 'Resilience & Retries')
  },
  {
    id: 'patterns',
    name: 'Event Streaming Patterns',
    description: 'Transactional Outbox with CDC, Event Sourcing, and CQRS projection streams.',
    badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    topics: mqTopics.filter(t => t.group === 'Event Streaming Patterns')
  }
];

export const getMqTopic = (id: string) => mqTopics.find(t => t.id === id);
