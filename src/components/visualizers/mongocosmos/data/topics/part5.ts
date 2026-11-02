import { MongoTopic } from './types';

export const PART5_TOPICS: MongoTopic[] = [
  {
    id: 'replica-set-topology',
    topicNumber: 41,
    title: 'Replica Set Topology: Primary, Secondary & Arbiter Nodes',
    category: 'distributed',
    difficulty: 'Intermediate',
    summary: 'A MongoDB Replica Set is an automated high-availability cluster consisting of one Primary node that accepts all writes and multiple Secondary nodes that replicate data.',
    definition: 'A Replica Set is a group of mongod instances that maintain the same data set. It provides redundancy and high availability. Exactly one node acts as the Primary, accepting all write operations. All other voting members act as Secondaries, asynchronously replicating the Primary\'s oplog. An Arbiter participates in elections to break ties but stores no data.',
    eli5: 'Think of a corporate department with 1 Boss (Primary) and 2 Assistants (Secondaries). The Boss does all the decision-making and hands copies of every memo to the assistants. If the Boss gets sick, the assistants immediately vote one of themselves to become the new Boss.',
    realWorldExample: {
      description: 'A standard production 3-node replica set deployed across 3 availability zones.',
      sampleDocuments: [
        {
          collection: 'rs.status()',
          doc: {
            set: 'rs0',
            members: [
              { name: 'mongo-1:27017', stateStr: 'PRIMARY', health: 1 },
              { name: 'mongo-2:27017', stateStr: 'SECONDARY', health: 1 },
              { name: 'mongo-3:27017', stateStr: 'SECONDARY', health: 1 }
            ]
          }
        }
      ],
      explanation: 'Three data-bearing nodes guarantee that any one node can fail without loss of read/write availability.'
    },
    syntaxSteps: [
      {
        step: 'Initiate a 3-node replica set',
        code: `rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "mongo-1:27017", priority: 2 },
    { _id: 1, host: "mongo-2:27017", priority: 1 },
    { _id: 2, host: "mongo-3:27017", priority: 1 }
  ]
});`,
        note: 'Priority 2 makes mongo-1 the preferred primary candidate.'
      },
      {
        step: 'Inspect replica set status and health',
        code: `rs.status();`,
        note: 'Monitors member states, heartbeat latencies, and sync sources.'
      }
    ],
    rulesTable: [
      {
        rule: 'Odd Number of Votes',
        explanation: 'Always maintain an odd number of voting members (e.g. 3, 5, 7) to prevent split-brain election deadlocks.'
      },
      {
        rule: 'Arbiter Caution',
        explanation: 'Arbiters do not hold data; they can break election ties but cannot be read from or become primary.'
      }
    ],
    deepDive: {
      title: 'Why Arbiters Are Discouraged in Modern MongoDB Clusters',
      description: 'In MongoDB 4.0+, features like multi-document ACID transactions and Read Concern "majority" require majority data-bearing nodes. An Arbiter has no data and cannot acknowledge majority writes. A 2-data-node + 1-arbiter cluster loses majority write availability as soon as a single data node goes down! Modern architectures deploy 3 full data-bearing nodes.',
      codeSnippet: `// Check voting member configuration:
rs.conf().members.map(m => ({ host: m.host, votes: m.votes, priority: m.priority }));`,
      warning: 'Never run an arbiter on the same physical host as a data-bearing node.'
    },
    advantages: [
      'Automatic failover: if primary fails, secondaries elect a new primary in under 3 seconds',
      'Data redundancy across independent physical machines and failure zones',
      'Read scaling: read preferences allow offloading analytical queries to secondaries'
    ],
    disadvantages: [
      'Replication is asynchronous by default; un-replicated writes can be rolled back on failover',
      'Triples storage hardware requirements (3 data-bearing nodes)'
    ],
    interviewQuestions: [
      {
        question: 'What is an Arbiter in a MongoDB replica set, and why is its use generally discouraged in modern production deployments?',
        answer: 'An Arbiter is a mongod instance that participates in replica set elections by casting a vote, but holds no data. Its use is discouraged in modern deployments because an Arbiter cannot participate in { w: "majority" } write acknowledgments. In a cluster with 2 data nodes and 1 arbiter, losing 1 data node permanently blocks all majority writes.'
      }
    ],
    interviewReadyAnswer: 'A MongoDB replica set provides high availability with 1 Primary and multiple Secondaries. The primary processes writes and logs them to the oplog, which secondaries replicate asynchronously. Clusters should have an odd number of voting nodes (typically 3 or 5 data-bearing nodes) to prevent split-brain election ties.',
    quickTest: {
      question: 'What is the minimum recommended number of voting members in a production MongoDB replica set to avoid election ties?',
      options: [
        { key: 'A', text: '3 members' },
        { key: 'B', text: '2 members' },
        { key: 'C', text: '4 members' },
        { key: 'D', text: '1 member' }
      ],
      correctAnswer: 'A',
      explanation: 'A minimum of 3 voting members is required to establish a majority quorum (2 out of 3 votes) during primary elections.'
    },
    mentalModel: 'Replica set is a democratic boardroom: 1 chair (Primary) conducts business; majority vote decides succession.',
    codeSnippet: `// Check who is current primary:
rs.isMaster().primary;`,
    takeaways: [
      '1 Primary processes writes; Secondaries replicate the oplog.',
      'Always maintain an odd number of voting members (3 or 5).',
      'Avoid arbiters when majority write concerns are required.'
    ],
    commonPitfall: {
      mistake: 'Deploying an even number of voting nodes (e.g. 2 nodes), leading to split-brain election deadlocks if a network split occurs.',
      fix: 'Always maintain an odd number of voting members.'
    },
    prevTopicId: 'agg-100mb-memory-limit',
    nextTopicId: 'raft-election-consensus'
  },
  {
    id: 'raft-election-consensus',
    topicNumber: 42,
    title: 'Raft-like Election Algorithm & Term Succession',
    category: 'distributed',
    difficulty: 'Advanced',
    summary: 'MongoDB utilizes a consensus election protocol modeled on Raft (election terms, heartbeat timeouts, and strict majority voting) to elect a primary in under 3 seconds.',
    definition: 'MongoDB\'s election algorithm is a variant of the Raft consensus protocol. Members continuously exchange heartbeats every 2 seconds. If a secondary fails to receive heartbeats from the primary for 10 seconds (electionTimeoutMillis), it declares an election, increments the election Term counter, and solicits votes from all peers. A candidate must secure a strict majority of votes to become Primary.',
    eli5: 'Think of high-school class president elections. If the president goes missing for 10 seconds, a candidate stands up, raises their hand, and calls for a vote. If more than half the class votes for them, they instantly become the new president.',
    realWorldExample: {
      description: 'Automatic failover sequence when Primary crashes unexpectedly.',
      sampleDocuments: [
        {
          collection: 'election_timeline',
          doc: {
            t0: 'Primary loses network connectivity (0s)',
            t1: 'Heartbeat timeout triggers after 10s',
            t2: 'Secondary-1 increments term to 4 and requests votes',
            t3: 'Secondary-2 votes YES (candidate has newest oplog)',
            t4: 'Secondary-1 wins majority (2/3) and transitions to PRIMARY in 1.8s'
          }
        }
      ],
      explanation: 'The entire failover sequence completes in under 2 seconds without human intervention.'
    },
    syntaxSteps: [
      {
        step: 'Step down primary manually to trigger controlled failover',
        code: `rs.stepDown(60); // Primary resigns for 60s, triggering election`,
        note: 'Allows graceful zero-downtime rolling maintenance.'
      },
      {
        step: 'Inspect election term and member priorities',
        code: `rs.status().term; // Current cluster election term`,
        note: 'Monotonically increasing integer term tracking cluster generations.'
      }
    ],
    rulesTable: [
      {
        rule: 'Strict Majority',
        explanation: 'A candidate must win Math.floor(N/2) + 1 votes (e.g. 2 out of 3, or 3 out of 5).'
      },
      {
        rule: 'Oplog Freshness',
        explanation: 'A node will refuse to vote for any candidate whose oplog timestamp is older than its own.'
      }
    ],
    deepDive: {
      title: 'Split-Brain Prevention & Network Partition Isolation',
      description: 'Suppose a 5-node replica set is partitioned by a network split into 2 nodes (Side A) and 3 nodes (Side B). Even if the old primary is on Side A, Side A only has 2 votes (cannot reach majority 3/5). The primary on Side A automatically detects that it cannot see a majority and steps down to Secondary. Side B has 3 nodes, reaches majority, and safely elects a new primary.',
      codeSnippet: `// Verify heartbeat timeout setting (default 10000ms):
rs.conf().settings.electionTimeoutMillis;`,
      warning: 'Network latency spikes between data centers can trigger false-positive failovers if timeout is too short.'
    },
    advantages: [
      'Sub-3-second automated failover restores write availability during hardware crashes',
      'Raft term counter prevents zombie former primaries from overwriting fresh data',
      'Oplog freshness rule guarantees that the candidate with the most recent data wins'
    ],
    disadvantages: [
      'In-flight uncommitted client writes may throw network exceptions during the 2-second election window',
      'Network partitions can isolate a primary, forcing client connection pool reconnects'
    ],
    interviewQuestions: [
      {
        question: 'Under MongoDB\'s election protocol, why will a secondary reject a candidate\'s request for a vote?',
        answer: 'A secondary will vote NO if: 1. The candidate\'s oplog entries are less up-to-date than the secondary\'s own oplog (Oplog Freshness rule), 2. The secondary has already voted for another candidate in the current election term, or 3. The candidate has a priority of 0 (configured as non-electable).'
      }
    ],
    interviewReadyAnswer: 'MongoDB uses a Raft-based consensus protocol. Heartbeats exchange every 2 seconds; if the primary is silent for 10 seconds, a secondary increments the term and requests votes. A candidate must win a strict majority (>50%) and possess the freshest oplog to become Primary.',
    quickTest: {
      question: 'What is the default electionTimeoutMillis setting before a secondary initiates an election?',
      options: [
        { key: 'A', text: '10,000 ms (10 seconds)' },
        { key: 'B', text: '1,000 ms (1 second)' },
        { key: 'C', text: '60,000 ms (60 seconds)' },
        { key: 'D', text: '500 ms' }
      ],
      correctAnswer: 'A',
      explanation: 'By default, secondaries wait 10,000 milliseconds (10 seconds) of missed heartbeats before declaring an election.'
    },
    mentalModel: 'Raft consensus is a democratic quorum: only a candidate with the freshest logs and a true majority can govern.',
    codeSnippet: `// Check election history:
rs.status().electionCandidateMetrics;`,
    takeaways: [
      'Heartbeats run every 2s; election triggers after 10s silence.',
      'Must achieve strict majority (>50%) to elect a primary.',
      'Oplog freshness rule guarantees no data loss to stale candidates.'
    ],
    commonPitfall: {
      mistake: 'Setting electionTimeoutMillis to 500ms, causing flapping elections during transient network jitter.',
      fix: 'Leave electionTimeoutMillis at default 10,000ms in cloud environments.'
    },
    prevTopicId: 'replica-set-topology',
    nextTopicId: 'oplog-replication-lag'
  },
  {
    id: 'oplog-replication-lag',
    topicNumber: 43,
    title: 'The Replication Oplog & Resolving Replication Lag',
    category: 'distributed',
    difficulty: 'Advanced',
    summary: 'The Oplog (operations log) is a capped collection recording idempotent state modifications; monitor and resolve replication lag to avoid stale reads and failover rollbacks.',
    definition: 'The Oplog (local.oplog.rs) is a capped collection on every replica set member that records a rolling log of all write operations that modify database state. Secondaries continuously poll their sync source and apply oplog entries asynchronously. Replication Lag is the time delay between when a write is committed on the Primary and when it is applied on a Secondary.',
    eli5: 'The primary is an architect drawing building blueprints. The secondaries are builders following the architect\'s instructions. Replication lag is the time it takes the builder to catch up when the architect draws faster than the builder can lay bricks.',
    realWorldExample: {
      description: 'Diagnosing a secondary node that has fallen 45 seconds behind the primary.',
      sampleDocuments: [
        {
          collection: 'rs.printSecondaryReplicationInfo()',
          doc: {
            source: 'mongo-2:27017',
            syncedTo: '2026-03-01T14:20:15Z',
            oplogWindow: '72 hours',
            replicationLag: '45 seconds' // ⚠️ 45s behind primary!
          }
        }
      ],
      explanation: 'Clients issuing reads with secondaryPreferred read preference risk reading stale data that is 45 seconds out of date.'
    },
    syntaxSteps: [
      {
        step: 'Check replication lag and oplog window in mongosh',
        code: `rs.printReplicationInfo(); // Primary oplog size and retention window
rs.printSecondaryReplicationInfo(); // Lag in seconds per secondary member`,
        note: 'Monitors the time gap between primary write timestamp and secondary sync.'
      }
    ],
    rulesTable: [
      {
        rule: 'Idempotency',
        explanation: 'All oplog entries are idempotent: applying the same entry multiple times produces the exact same result ($inc becomes $set).'
      },
      {
        rule: 'Oplog Falling Off (Stale)',
        explanation: 'If a secondary falls further behind than the total oplog window (e.g. down for 3 days on a 2-day oplog), it enters RECOVERING state and requires resyncing.'
      }
    ],
    deepDive: {
      title: 'How $inc Transforms into Idempotent $set in the Oplog',
      description: 'Consider the update: db.accounts.updateOne({ _id: 1 }, { $inc: { balance: 50 } }). If balance was 100, the primary does NOT record "$inc 50" in the oplog (which would cause corruption if replayed twice). Instead, the primary computes the final balance (150) and writes an idempotent $set into the oplog: { "o": { "$v": 2, "$set": { "balance": 150 } } }.',
      codeSnippet: `// Inspect recent raw oplog entry:
db.getSiblingDB("local").oplog.rs.find().sort({ $natural: -1 }).limit(1);`,
      warning: 'If a secondary falls off the oplog window, it requires an initial sync from scratch.'
    },
    advantages: [
      'Idempotent log ensures that network retries or out-of-order replays never corrupt data',
      'Powers Change Streams, Change Data Capture (CDC), and point-in-time backup restores',
      'Resizable dynamically without restarting mongod in MongoDB 4.4+'
    ],
    disadvantages: [
      'Heavy bulk write ingestion can outpace secondary disk write IOPS, causing replication lag spikes',
      'Undersized oplog windows risk secondaries falling off during temporary network outages'
    ],
    interviewQuestions: [
      {
        question: 'Why are operations recorded in the MongoDB replication oplog converted to idempotent operations?',
        answer: 'Oplog operations are idempotent (applying them multiple times yields the exact same state) so that secondaries can safely replay entries after network disconnects, restarts, or crash recovery without data corruption. For example, non-idempotent operations like $inc: { count: 1 } are translated into deterministic $set: { count: 42 } entries in the oplog.'
      }
    ],
    interviewReadyAnswer: 'The Oplog (local.oplog.rs) is a capped collection recording all database mutations as idempotent operations (converting $inc to $set). Secondaries continuously replicate and apply oplog entries. Replication lag occurs when secondary write IOPS or network throughput cannot match primary ingestion rates.',
    quickTest: {
      question: 'How does MongoDB transform a non-idempotent $inc operation when recording it into the replication Oplog?',
      options: [
        { key: 'A', text: 'It computes the final value and records an idempotent $set operation' },
        { key: 'B', text: 'It records the raw $inc command unchanged' },
        { key: 'C', text: 'It locks all secondaries with an exclusive table lock' },
        { key: 'D', text: 'It writes the document into GridFS' }
      ],
      correctAnswer: 'A',
      explanation: 'The primary executes the $inc, computes the final scalar result, and writes a deterministic, idempotent $set entry into the oplog.'
    },
    mentalModel: 'The Oplog is an idempotent film strip: re-running any frame lands on the exact same snapshot.',
    codeSnippet: `// Resize oplog dynamically to 50GB:
db.adminCommand({ replSetResizeOplog: 1, size: 51200 });`,
    takeaways: [
      'Oplog entries are strictly idempotent ($inc becomes $set).',
      'Replication lag causes stale reads on secondary nodes.',
      'Size the oplog to hold at least 48-72 hours of write traffic.'
    ],
    commonPitfall: {
      mistake: 'Leaving oplog size at default 5% of disk, causing secondaries to fall off during a weekend outage.',
      fix: 'Resize the oplog to maintain at least 48-72 hours of headroom.'
    },
    prevTopicId: 'raft-election-consensus',
    nextTopicId: 'write-concern-matrix'
  },
  {
    id: 'write-concern-matrix',
    topicNumber: 44,
    title: 'Write Concerns: w:1 vs w:majority vs j:true vs wtimeout',
    category: 'distributed',
    difficulty: 'Advanced',
    summary: 'Write Concerns govern the level of acknowledgment requested from MongoDB before confirming a write operation: balancing latency against durability and rollback protection.',
    definition: 'A Write Concern describes the level of acknowledgment requested from MongoDB for write operations. It consists of three parameters: w (number of nodes that must acknowledge the write), j (whether writes must be flushed to the on-disk journal), and wtimeout (maximum time to wait before throwing a timeout error).',
    eli5: 'Ordering coffee: w:1 is the barista nodding they took your order. w:majority is three baristas confirming they have your coffee cup in hand. j:true is printing an inked receipt on paper. wtimeout is: "If it takes longer than 5 seconds, let me know."',
    realWorldExample: {
      description: 'Executing an enterprise payment write with zero rollback guarantee.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: {
            _id: 'o99',
            total: 2500,
            writeConcern: { w: 'majority', j: true, wtimeout: 5000 }
          }
        }
      ],
      explanation: 'The write is acknowledged only after being committed to disk journals across a majority of replica set nodes.'
    },
    syntaxSteps: [
      {
        step: 'Write with majority acknowledgment and 5s timeout',
        code: `db.orders.insertOne(
  { item: "Server", price: 5000 },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
);`,
        note: 'Protects against write rollback if primary crashes immediately.'
      },
      {
        step: 'Configure cluster-wide default write concern',
        code: `db.adminCommand({
  setDefaultRWConcern: 1,
  defaultWriteConcern: { w: "majority", wtimeout: 10000 }
});`,
        note: 'MongoDB 5.0+ defaults to w: "majority" globally.'
      }
    ],
    rulesTable: [
      {
        rule: 'w: 1',
        explanation: 'Acknowledged as soon as Primary memory cache is updated. Fastest, but vulnerable to rollback if primary crashes before replicating.'
      },
      {
        rule: 'w: "majority"',
        explanation: 'Acknowledged only after replicating to a majority of voting members. Immune to election rollbacks.'
      },
      {
        rule: 'j: true',
        explanation: 'Guarantees on-disk journal fsync before acknowledgment. Protects against simultaneous power failure.'
      }
    ],
    deepDive: {
      title: 'Rollbacks on Failover (The w:1 Trap)',
      description: 'If you write with { w: 1 }, the primary confirms success as soon as it updates its local memory. If the primary suddenly loses power 2 milliseconds later before transmitting the oplog to secondaries, the remaining secondaries elect a new primary. The un-replicated write is permanently lost from the active database and dumped into a .rollback BSON file on the old primary\'s disk.',
      codeSnippet: `// ⚠️ Dangerous write vulnerable to rollback:
db.orders.insertOne({ id: 1 }, { writeConcern: { w: 1 } });
// ✅ Enterprise durable write:
db.orders.insertOne({ id: 1 }, { writeConcern: { w: "majority" } });`,
      warning: 'Never issue financial or security mutations with w: 1.'
    },
    advantages: [
      'w: "majority" guarantees zero data loss (zero rollback) upon primary failover',
      'j: true guarantees crash-resilience against sudden simultaneous datacenter power cuts',
      'wtimeout prevents client application threads from hanging indefinitely during network partitions'
    ],
    disadvantages: [
      'w: "majority" increases write latency by network RTT between primary and secondaries',
      'Omitting wtimeout can cause client connection starvation if secondary nodes become unreachable'
    ],
    interviewQuestions: [
      {
        question: 'What is a MongoDB "Rollback", and which write concern prevents rollbacks from ever occurring?',
        answer: 'A rollback occurs when a primary accepts a write with { w: 1 } and crashes before replicating it to secondaries. When a secondary is elected as the new primary, it lacks that write. When the old primary rejoins, it rolls back the un-replicated write into a rollback BSON file. Writing with { w: "majority" } completely prevents rollbacks because a write is only acknowledged once it exists on a majority of nodes.'
      }
    ],
    interviewReadyAnswer: 'Write Concerns define write durability guarantees. w: 1 acknowledges after the local primary commits (fast, but susceptible to rollback on primary crash). w: "majority" acknowledges after replicating to a majority of voting nodes, guaranteeing zero rollback. j: true enforces an on-disk journal fsync. Always specify wtimeout.',
    quickTest: {
      question: 'Which write concern configuration completely prevents write operations from being rolled back if the primary crashes?',
      options: [
        { key: 'A', text: 'w: "majority"' },
        { key: 'B', text: 'w: 1' },
        { key: 'C', text: 'w: 0' },
        { key: 'D', text: 'j: false' }
      ],
      correctAnswer: 'A',
      explanation: '{ w: "majority" } ensures the write exists on a majority of voting nodes, meaning any newly elected primary is guaranteed to hold the write.'
    },
    mentalModel: 'w:1 is a promise from one person; w:majority is a signed contract witnessed by the room.',
    codeSnippet: `// Safe transaction write concern:
session.startTransaction({
  writeConcern: { w: "majority", wtimeout: 5000 }
});`,
    takeaways: [
      'w: "majority" eliminates rollback risks.',
      'Always set wtimeout to prevent hanging connections.',
      'MongoDB 5.0+ uses w: "majority" as cluster default.'
    ],
    commonPitfall: {
      mistake: 'Using { w: "majority" } without setting wtimeout, causing client requests to hang forever when a secondary fails.',
      fix: 'Always provide a wtimeout (e.g. 5000ms).'
    },
    prevTopicId: 'oplog-replication-lag',
    nextTopicId: 'read-concern-isolation'
  },
  {
    id: 'read-concern-isolation',
    topicNumber: 45,
    title: 'Read Concerns: local vs majority vs linearizable vs snapshot',
    category: 'distributed',
    difficulty: 'Advanced',
    summary: 'Read Concerns control the consistency and isolation of data read from MongoDB: from fast uncommitted local reads to strictly serializable linearizable queries.',
    definition: 'A Read Concern specifies the consistency and isolation guarantees of read operations across a replica set. The five levels are: "local" (default: returns node\'s latest data, may be rolled back), "available" (same as local, fastest in sharding), "majority" (returns data committed to a majority, immune to rollbacks), "linearizable" (guarantees real-time serializability), and "snapshot" (point-in-time ACID snapshot).',
    eli5: '"local" is listening to rumors in the hallway: usually true, but might turn out false. "majority" is waiting for the official school newspaper to confirm it. "linearizable" is calling the principal on the phone right now to verify before taking another step.',
    realWorldExample: {
      description: 'Financial ledger reading an account balance that must never be rolled back.',
      sampleDocuments: [
        {
          collection: 'accounts',
          doc: {
            _id: 'acc_01',
            balance: 50000,
            readConcern: { level: 'majority' }
          }
        }
      ],
      explanation: 'Reading with level: "majority" guarantees the balance cannot be reverted by a primary failover.'
    },
    syntaxSteps: [
      {
        step: 'Query with majority read concern',
        code: `db.accounts.find({ _id: "acc_01" }).readConcern("majority");`,
        note: 'Guarantees the returned data is committed to a majority of replica members.'
      },
      {
        step: 'Query with linearizable read concern (prevents stale reads from partitioned primaries)',
        code: `db.accounts.find({ _id: "acc_01" }).readConcern("linearizable");`,
        note: 'Primary contacts a quorum of peers before returning to confirm it is still the true primary.'
      }
    ],
    rulesTable: [
      {
        rule: 'local',
        explanation: 'Fastest; returns current node data. Vulnerable to reading data that gets rolled back.'
      },
      {
        rule: 'majority',
        explanation: 'Reads from in-memory WiredTiger snapshot representing majority-committed state. Immune to rollbacks.'
      },
      {
        rule: 'linearizable',
        explanation: 'Executes quorum check; blocks until current primary verifies it has not been deposed by a split-brain.'
      },
      {
        rule: 'snapshot',
        explanation: 'Only usable inside multi-document transactions. Reads consistent point-in-time snapshot across all collections.'
      }
    ],
    deepDive: {
      title: 'How "linearizable" Prevents Phantom Reads from Deposed Primaries',
      description: 'Suppose a primary is partitioned off from the network. A new primary is elected, but the old primary does not know it yet. A client reading from the old primary with readConcern: "local" would read stale data. With readConcern: "linearizable", the primary MUST successfully communicate with a majority of members BEFORE returning the read result. If it is deposed, the read fails, preventing stale reads.',
      codeSnippet: `// Linearizable read syntax:
db.locks.find({ resource: "engine_mutex" }).readConcern("linearizable");`,
      warning: 'Linearizable reads must target the Primary node only and add latency equal to a network round-trip.'
    },
    advantages: [
      'majority read concern guarantees that data read by the application will never be rolled back',
      'linearizable read concern provides true recency guarantees even during active network partitions',
      'snapshot read concern delivers ACID snapshot isolation across collections in multi-doc transactions'
    ],
    disadvantages: [
      'linearizable reads incur quorum network round-trip latency on every read operation',
      'majority reads require WiredTiger to maintain in-memory historical snapshot versions'
    ],
    interviewQuestions: [
      {
        question: 'What is the risk of using readConcern: "local" on a primary node?',
        answer: 'With readConcern: "local", the query returns the latest data from the primary\'s memory, which may include writes that have not yet been replicated to secondaries (issued with w: 1). If the primary crashes before replicating those writes, the data is rolled back, meaning the client read "dirty" data that ultimately disappeared from the database.'
      }
    ],
    interviewReadyAnswer: 'Read Concerns govern read isolation. "local" returns the node\'s latest data but risks reading un-replicated writes that could roll back. "majority" reads from WiredTiger\'s majority-committed snapshot, guaranteeing the data will never be rolled back. "linearizable" verifies primary quorum in real-time. "snapshot" provides ACID point-in-time isolation inside transactions.',
    quickTest: {
      question: 'Which Read Concern level is required inside multi-document transactions to guarantee consistent point-in-time reads across collections?',
      options: [
        { key: 'A', text: 'snapshot' },
        { key: 'B', text: 'local' },
        { key: 'C', text: 'available' },
        { key: 'D', text: 'uncommitted' }
      ],
      correctAnswer: 'A',
      explanation: 'Multi-document transactions use readConcern: "snapshot" to observe an identical point-in-time view of data across multiple collections.'
    },
    mentalModel: 'Read concerns choose your truth: "local" is what I think right now; "majority" is what the group permanently agreed on.',
    codeSnippet: `// Query with majority read concern:
db.users.find({ status: "active" }).readConcern("majority");`,
    takeaways: [
      '"local" reads can be rolled back; "majority" cannot.',
      '"linearizable" performs real-time quorum check against split-brain primaries.',
      'Use "snapshot" for multi-document ACID transactions.'
    ],
    commonPitfall: {
      mistake: 'Using readConcern: "linearizable" on a secondary node, throwing an immediate query error.',
      fix: 'Linearizable reads can only be executed on the Primary node.'
    },
    prevTopicId: 'write-concern-matrix',
    nextTopicId: 'read-preferences-routing'
  },
  {
    id: 'read-preferences-routing',
    topicNumber: 46,
    title: 'Read Preferences: primary vs secondaryPreferred vs nearest',
    category: 'distributed',
    difficulty: 'Intermediate',
    summary: 'Read Preferences dictate how database client drivers route read operations across members of a replica set: balancing read scalability against data staleness.',
    definition: 'Read Preference determines which replica set member a client driver directs read queries to. The five modes are: "primary" (default: reads strictly from Primary), "primaryPreferred" (reads Primary; falls back to Secondary if down), "secondary" (reads strictly from Secondaries), "secondaryPreferred" (reads Secondary; falls back to Primary), and "nearest" (reads node with lowest network latency).',
    eli5: 'When asking a question: "primary" is insisting on asking only the manager. "secondary" is only asking the clerk. "nearest" is asking whoever is standing closest to you in the room.',
    realWorldExample: {
      description: 'Routing heavy reporting queries to secondaries to avoid CPU contention on the primary.',
      sampleDocuments: [
        {
          collection: 'analytics_report',
          doc: {
            mode: 'secondaryPreferred',
            tagSets: [{ datacenter: 'east-reporting' }]
          }
        }
      ],
      explanation: 'Reports run against dedicated reporting secondaries, keeping the primary 100% dedicated to client writes.'
    },
    syntaxSteps: [
      {
        step: 'Set read preference in mongosh connection string or query',
        code: `db.orders.find().readPref("secondaryPreferred");`,
        note: 'Routes query to a secondary; falls back to primary if no secondaries are reachable.'
      },
      {
        step: 'Target specific secondary nodes using tag sets',
        code: `db.orders.find().readPref("nearest", [
  { "region": "us-east", "purpose": "analytics" }
]);`,
        note: 'Driver routes to the lowest-latency member matching tag criteria.'
      }
    ],
    rulesTable: [
      {
        rule: 'primary (Default)',
        explanation: 'Guarantees strictly fresh data (Read-Your-Own-Writes consistency).'
      },
      {
        rule: 'secondary / secondaryPreferred',
        explanation: 'Subject to Replication Lag: clients may read stale data.'
      },
      {
        rule: 'nearest',
        explanation: 'Measures ping latency (within a 15ms localThreshold window); optimal for geographically distributed read caching.'
      }
    ],
    deepDive: {
      title: 'The Read-Your-Own-Writes Consistency Trap',
      description: 'A classic bug occurs when a user updates their profile (written to Primary) and is immediately redirected to their profile page. If the web server queries with readPreference: "secondaryPreferred", and the secondary has 200ms of replication lag, the user sees their OLD profile and files a bug ticket! Solution: Route all user-facing post-mutation reads to the Primary, or use Causal Consistency sessions.',
      codeSnippet: `// Driver URI read preference configuration:
// mongodb://node1,node2,node3/?replicaSet=rs0&readPreference=secondaryPreferred&maxStalenessSeconds=120`,
      warning: 'Never use secondary read preferences for financial or transactional validation workflows.'
    },
    advantages: [
      'Scales read throughput across multiple secondary servers without beefing up primary hardware',
      'Tag sets allow isolating analytical workloads to dedicated non-voting reporting members',
      'nearest mode minimizes global network latency for geo-distributed read workloads'
    ],
    disadvantages: [
      'Secondaries can serve stale data due to asynchronous replication lag',
      'Does not scale write throughput (all writes must still go to the Primary)'
    ],
    interviewQuestions: [
      {
        question: 'What is the primary risk of configuring readPreference: "secondary" for application reads?',
        answer: 'The primary risk is reading stale or out-of-date data caused by asynchronous replication lag. If a user performs a write and immediately executes a read routed to a lagging secondary, they will observe outdated data ("Read-Your-Own-Writes" inconsistency).'
      }
    ],
    interviewReadyAnswer: 'Read Preferences control client query routing: "primary" guarantees fresh reads; "secondary" / "secondaryPreferred" offload read queries to secondaries at the expense of replication lag staleness; "nearest" routes to the member with lowest network round-trip time. Tag sets allow targeting specific nodes (e.g. analytics).',
    quickTest: {
      question: 'Which Read Preference mode routes queries to the replica set member with the lowest network ping latency?',
      options: [
        { key: 'A', text: 'nearest' },
        { key: 'B', text: 'secondary' },
        { key: 'C', text: 'primaryPreferred' },
        { key: 'D', text: 'fastest' }
      ],
      correctAnswer: 'A',
      explanation: '"nearest" directs reads to the replica set member with the lowest ping latency within the configured localThreshold window.'
    },
    mentalModel: 'Read preferences are compass directions: decide whether you prioritize freshness (Primary) or locality/offload (Secondary/Nearest).',
    codeSnippet: `// Check read preference of current connection:
db.getMongo().getReadPrefMode();`,
    takeaways: [
      'Primary gives guaranteed freshness.',
      'Secondary gives read scaling, but introduces replication lag staleness.',
      'Use tag sets to isolate heavy analytics from operational traffic.'
    ],
    commonPitfall: {
      mistake: 'Using secondary read preferences expecting to scale writes.',
      fix: 'Remember that only sharding scales write throughput; replica set secondaries only scale reads.'
    },
    prevTopicId: 'read-concern-isolation',
    nextTopicId: 'causal-consistency-sessions'
  },
  {
    id: 'causal-consistency-sessions',
    topicNumber: 47,
    title: 'Causal Consistency Sessions & Logical Clocks',
    category: 'distributed',
    difficulty: 'Expert',
    summary: 'Causal Consistency client sessions utilize Lamport logical clocks (ClusterTime) to guarantee Read-Your-Own-Writes consistency even when reading from lagging secondaries.',
    definition: 'Causal Consistency is a consistency model in MongoDB client sessions. If operation B is causally related to operation A (e.g. an update followed by a read), causal consistency guarantees that every node in the cluster will observe operation A before observing operation B. It enables "Read-Your-Own-Writes" and "Monotonic Reads" across secondaries using Lamport logical timestamps ($clusterTime).',
    eli5: 'Imagine posting a comment on social media and then refreshing the page. In an inconsistent system, your comment disappears because your phone read from a lagging replica. With causal consistency, your phone carries a timestamp passport saying: "I have seen up to event #500; do not answer me until you have caught up to event #500."',
    realWorldExample: {
      description: 'A user creates a new account and immediately reads their account details from a secondary node.',
      sampleDocuments: [
        {
          collection: 'client_session_tracking',
          doc: {
            session_id: 'sess_9921827',
            operationTime: 'Timestamp(1740837600, 4)', // Logical clock
            clusterTime: 'Timestamp(1740837600, 4)'
          }
        }
      ],
      explanation: 'The client passes its operationTime to the secondary; the secondary pauses until its local oplog reaches that timestamp before returning.'
    },
    syntaxSteps: [
      {
        step: 'Start a causally consistent client session in Node.js / mongosh',
        code: `const session = db.getMongo().startSession({ causalConsistency: true });
const orders = session.getDatabase("store").orders;

// Write to Primary:
orders.insertOne({ order_id: 101, total: 250 });

// Read from Secondary with Read-Your-Own-Writes guarantee:
orders.find({ order_id: 101 }).readPref("secondary");
session.endSession();`,
        note: 'Guarantees the newly inserted order is visible even when reading from a secondary!'
      }
    ],
    rulesTable: [
      {
        rule: 'Four Causal Guarantees',
        explanation: '1. Read Your Own Writes, 2. Monotonic Reads, 3. Monotonic Writes, 4. Writes Follow Reads.'
      },
      {
        rule: 'Prerequisites',
        explanation: 'Requires writeConcern: "majority" and readConcern: "majority".'
      }
    ],
    deepDive: {
      title: 'Lamport Logical Clocks ($clusterTime) Protocol',
      description: 'MongoDB servers maintain a global hybrid logical clock (HLC). Every response from the server includes $clusterTime and operationTime. The client driver records these timestamps. When issuing subsequent reads, the driver automatically injects afterClusterTime: operationTime into the request. The secondary node checks its local oplog: if it has not replayed up to afterClusterTime, it waits until the oplog catches up before returning results.',
      codeSnippet: `// Driver auto-injected payload:
// { "find": "orders", "readConcern": { "level": "majority", "afterClusterTime": Timestamp(1740837600, 4) } }`,
      warning: 'If a secondary has severe replication lag, waiting for afterClusterTime can add latency up to maxStalenessSeconds.'
    },
    advantages: [
      'Eliminates the #1 headache of replica sets: stale reads following recent writes',
      'Allows applications to safely offload reads to secondaries without breaking user expectations',
      'Requires zero custom application caching or synchronization logic'
    ],
    disadvantages: [
      'Requires writeConcern and readConcern set to majority',
      'Reads on a severely lagging secondary will wait until the oplog catches up or timeout'
    ],
    interviewQuestions: [
      {
        question: 'How do Causal Consistency sessions in MongoDB guarantee "Read-Your-Own-Writes" when reading from secondary nodes?',
        answer: 'Client sessions track the cluster logical timestamp (operationTime) returned by the primary after a write. When the client executes a subsequent read against a secondary, the driver passes afterClusterTime: operationTime. The secondary node delays answering the query until its local oplog has caught up and applied all changes up to that exact timestamp, guaranteeing the write is visible.'
      }
    ],
    interviewReadyAnswer: 'Causal consistency sessions use Lamport logical clocks ($clusterTime) to guarantee that causally dependent operations are observed in order across all replica nodes. By passing afterClusterTime on reads, secondaries wait for their local oplog to catch up to recent writes, delivering Read-Your-Own-Writes consistency on secondaries.',
    quickTest: {
      question: 'Which timestamp parameter is injected by the client driver to ensure a secondary node has caught up before executing a causally consistent read?',
      options: [
        { key: 'A', text: 'afterClusterTime' },
        { key: 'B', text: 'sysTime' },
        { key: 'C', text: 'unixEpoch' },
        { key: 'D', text: 'heartbeatOffset' }
      ],
      correctAnswer: 'A',
      explanation: 'The driver transmits afterClusterTime matching the session\'s operationTime, instructing the secondary to wait until its oplog reaches that logical time.'
    },
    mentalModel: 'Causal consistency is a timestamp ticket: secondaries check your ticket and catch up before handing you your results.',
    codeSnippet: `// Verify session causal consistency:
const s = db.getMongo().startSession({ causalConsistency: true });
console.log(s.hasEnded());`,
    takeaways: [
      'Causal consistency guarantees Read-Your-Own-Writes on secondaries.',
      'Driven by Lamport logical clocks ($clusterTime).',
      'Requires majority writeConcern and majority readConcern.'
    ],
    commonPitfall: {
      mistake: 'Using causal consistency with unacknowledged { w: 0 } writes, which generate no logical timestamp.',
      fix: 'Use majority write concern with causal sessions.'
    },
    prevTopicId: 'read-preferences-routing',
    nextTopicId: 'sharding-architecture'
  },
  {
    id: 'sharding-architecture',
    topicNumber: 48,
    title: 'Sharding Architecture: mongos, Config Servers & Shards',
    category: 'distributed',
    difficulty: 'Advanced',
    summary: 'MongoDB horizontally partitions massive collections across multiple independent physical clusters (Shards) coordinated by query routers (mongos) and metadata catalogs (Config Servers).',
    definition: 'MongoDB Sharding is a distributed horizontal scale-out architecture that partitions data across multiple independent replica sets (Shards). It consists of three core components: 1. Shards (replica sets holding partitions of data), 2. Config Database (3-node replica set storing cluster routing metadata), and 3. mongos (stateless query routers that route client requests).',
    eli5: 'Think of an international postal system: Shards are the regional delivery warehouses in different cities. The Config Server is the central postal map listing which zip codes belong to which city. mongos routers are the postal sorting clerks who read the envelope address and send the letter straight to the right warehouse.',
    realWorldExample: {
      description: 'A 50TB multi-tenant SaaS application partitioned across 4 shards.',
      sampleDocuments: [
        {
          collection: 'shards_manifest',
          doc: {
            shards: [
              { _id: 'shard01', host: 'rs-shard01/node1:27018,node2:27018' },
              { _id: 'shard02', host: 'rs-shard02/node3:27018,node4:27018' }
            ],
            configsvr: 'rs-config/cfg1:27019,cfg2:27019,cfg3:27019',
            mongos: 'stateless router on port 27017'
          }
        }
      ],
      explanation: 'Clients connect exclusively to mongos routers; the sharding architecture is completely transparent to the application.'
    },
    syntaxSteps: [
      {
        step: 'Check sharding cluster status in mongos',
        code: `sh.status();`,
        note: 'Displays shards, databases, chunk counts, and balancer status.'
      },
      {
        step: 'Enable sharding on a database and shard a collection',
        code: `sh.enableSharding("enterprise_app");
sh.shardCollection("enterprise_app.users", { "tenant_id": "hashed" });`,
        note: 'Uses hashed sharding on tenant_id for even chunk distribution.'
      }
    ],
    rulesTable: [
      {
        rule: 'mongos (Stateless Router)',
        explanation: 'Applications connect to mongos. It caches routing metadata from config servers and routes queries.'
      },
      {
        rule: 'Config Server Replica Set',
        explanation: 'Mandatory 3-node replica set; stores chunk mappings and routing tables. Uses Raft consensus.'
      },
      {
        rule: 'Targeted vs Scatter-Gather',
        explanation: 'Queries containing the shard key route directly to 1 shard; queries missing the shard key must broadcast to ALL shards.'
      }
    ],
    deepDive: {
      title: 'Targeted Query Routing vs Scatter-Gather Broadcast',
      description: 'The golden rule of sharding is Query Routing Efficiency. If a query filters on the shard key: db.orders.find({ tenant_id: 42 }), mongos consults its in-memory chunk map and sends the query directly to Shard 2 (Targeted Query). If the query omits the shard key: db.orders.find({ email: "user@test.com" }), mongos must broadcast the query to EVERY shard in the cluster (Scatter-Gather), wait for all responses, and merge them, bottlenecking cluster throughput.',
      codeSnippet: `// Check if query was targeted or scatter-gather:
db.orders.find({ email: "a@b.com" }).explain().queryPlanner.winningPlan;
// Stage: "SHARD_MERGE" indicates a scatter-gather broadcast!`,
      warning: 'A cluster dominated by scatter-gather queries will suffer degraded throughput as shards increase.'
    },
    advantages: [
      'Horizontal scale-out: scales write throughput, read throughput, and RAM beyond a single machine\'s limits',
      'Sharding is completely transparent to application code via the mongos router interface',
      'Automated chunk balancing migrates data across shards in the background'
    ],
    disadvantages: [
      'Operational complexity: requires managing config replica sets, mongos routers, and multiple shard clusters',
      'Scatter-gather queries missing the shard key suffer latency penalties across shards'
    ],
    interviewQuestions: [
      {
        question: 'What is the role of the Config Server replica set in a MongoDB sharded cluster?',
        answer: 'The Config Server replica set stores the cluster\'s authoritative metadata and routing tables, including the list of active shards, database configurations, and chunk-to-shard mapping ranges. Stateless mongos routers cache this metadata to route client queries directly to the appropriate shards without broadcasting.'
      }
    ],
    interviewReadyAnswer: 'A sharded MongoDB cluster consists of independent Shards (data replica sets), a 3-node Config Server replica set (routing metadata catalog), and stateless mongos query routers. Queries with the shard key are targeted directly to the holding shard, while queries without the shard key trigger an expensive scatter-gather broadcast.',
    quickTest: {
      question: 'What type of query execution occurs when a client issues a find() query that omits the collection\'s Shard Key?',
      options: [
        { key: 'A', text: 'Scatter-Gather (broadcasts to all shards and merges results)' },
        { key: 'B', text: 'Targeted Query (routes directly to 1 shard)' },
        { key: 'C', text: 'Fails immediately with an InvalidShardKeyException' },
        { key: 'D', text: 'Routes to the Config Server primary' }
      ],
      correctAnswer: 'A',
      explanation: 'Without the shard key, mongos cannot determine which shard holds the documents, forcing it to scatter-gather broadcast the query to every shard in the cluster.'
    },
    mentalModel: 'Sharding is a postal network: mongos is the sorter, Config Server is the zip code map, Shards are regional warehouses.',
    codeSnippet: `// Check active chunk balancer status:
sh.isBalancerRunning();`,
    takeaways: [
      'mongos routes queries; Config Servers hold routing metadata; Shards hold data.',
      'Always query with the shard key to achieve targeted single-shard routing.',
      'Scatter-gather queries broadcast to all shards, degrading cluster scalability.'
    ],
    commonPitfall: {
      mistake: 'Connecting application backend drivers directly to individual shards instead of connecting to mongos routers.',
      fix: 'Applications must connect exclusively to mongos query routers.'
    },
    prevTopicId: 'causal-consistency-sessions',
    nextTopicId: 'shard-key-selection'
  },
  {
    id: 'shard-key-selection',
    topicNumber: 49,
    title: 'Shard Key Selection: Cardinality, Monotonic Traps & Jumbo Chunks',
    category: 'distributed',
    difficulty: 'Expert',
    summary: 'The Shard Key is the single most critical architectural choice in MongoDB: evaluate High Cardinality, High Frequency, and Non-Monotonic criteria to avoid un-splittable Jumbo Chunks and write hot spots.',
    definition: 'The Shard Key is the field (or compound fields) that determines the distribution of a collection\'s documents across shards. MongoDB partitions documents into contiguous ranges called Chunks based on the shard key. An ideal shard key exhibits three properties: High Cardinality (many distinct values), High Frequency distribution (even write spread), and Non-Monotonic variation (avoids insertion hot spotting).',
    eli5: 'If you sort a 1,000,000-page book into 4 boxes by First Letter of Chapter: if every chapter starts with "The", 999,999 pages go into Box T, and the other 3 boxes sit completely empty. Choosing a bad shard key creates one exploding box while the others starve.',
    realWorldExample: {
      description: 'The Monotonically Increasing Key Disaster: Sharding by auto-incrementing ID or current timestamp.',
      sampleDocuments: [
        {
          collection: 'disaster_sharding',
          doc: {
            shardKey: { created_at: 1 },
            effect: 'Every single new write lands on the rightmost max chunk on Shard 4; Shards 1, 2, and 3 receive 0% of writes!'
          }
        }
      ],
      explanation: 'Monotonic shard keys route 100% of write traffic to a single shard, completely negating the write-scaling purpose of sharding.'
    },
    syntaxSteps: [
      {
        step: 'Shard collection using Hashed Sharding to uniformly distribute writes',
        code: `sh.shardCollection("telemetry.events", { "device_id": "hashed" });`,
        note: 'MD5 hash uniformly spreads monotonically increasing IDs across all shards!'
      },
      {
        step: 'Compound Range Shard Key for multi-tenant isolation',
        code: `sh.shardCollection("saas.tenants", { "tenant_id": 1, "created_at": 1 });`,
        note: 'Localizes tenant queries to a single shard while preserving date range sorting.'
      }
    ],
    rulesTable: [
      {
        rule: 'High Cardinality',
        explanation: 'Must have millions of distinct values (e.g. user_id). Low cardinality (e.g. status: "active"|"inactive") creates only 2 chunks.'
      },
      {
        rule: 'Non-Monotonic',
        explanation: 'Avoid keys that increase monotonically (timestamps, auto-increment ints) unless using hashed sharding.'
      },
      {
        rule: 'Jumbo Chunks',
        explanation: 'If a single shard key value contains more data than the max chunk size (default 64MB), it becomes an un-splittable, un-movable Jumbo Chunk.'
      }
    ],
    deepDive: {
      title: 'Hashed Sharding vs Ranged Sharding Trade-off Matrix',
      description: 'Ranged Sharding partitions data by raw values [0-100], [100-200]. It enables efficient range queries ({ age: { $gte: 20, $lte: 30 } } routes to 1 shard), but suffers from hot-spotting on monotonic writes. Hashed Sharding hashes the key, achieving perfectly uniform write distribution across all shards, but converts every range scan into an expensive scatter-gather broadcast.',
      codeSnippet: `// Check chunk distribution across shards:
db.events.getShardDistribution();`,
      warning: 'In MongoDB 4.4+, you can refine a shard key by adding suffix fields, but you can never completely change an established shard key.'
    },
    advantages: [
      'Optimal shard key achieves perfectly balanced storage and write throughput across all shards',
      'Hashed sharding completely eliminates monotonic insertion hot spots',
      'Compound shard keys ({ tenant_id: 1, _id: 1 }) achieve both tenant isolation and targeted queries'
    ],
    disadvantages: [
      'Choosing the wrong shard key can permanently bottleneck a multi-million-dollar cluster',
      'A low-cardinality shard key creates un-splittable Jumbo Chunks that halt automatic cluster balancing'
    ],
    interviewQuestions: [
      {
        question: 'Why is sharding by a monotonically increasing timestamp or ObjectId considered an architectural anti-pattern for write-heavy workloads, and how does Hashed Sharding fix it?',
        answer: 'Because monotonically increasing values always append to the rightmost boundary of the chunk range (+inf). Consequently, 100% of incoming writes land on the single shard holding that max chunk, while all other shards sit idle. Hashed Sharding fixes this by hashing the timestamp with MD5, scattering consecutive writes pseudorandomly across all shards uniformly.'
      }
    ],
    interviewReadyAnswer: 'The ideal shard key requires High Cardinality (many unique values) and High Frequency balance. Monotonically increasing keys (timestamps) create single-shard write bottlenecks; resolve this using Hashed Sharding ({ key: "hashed" }) for uniform write distribution, or compound keys ({ tenant_id: 1, user_id: 1 }) for targeted tenant lookups.',
    quickTest: {
      question: 'What is a "Jumbo Chunk" in a MongoDB sharded cluster?',
      options: [
        { key: 'A', text: 'A chunk that exceeds the maximum chunk size (64MB) and cannot be split because all documents share the same shard key value' },
        { key: 'B', text: 'A chunk stored exclusively in RAM cache' },
        { key: 'C', text: 'A chunk undergoing active replication' },
        { key: 'D', text: 'A chunk containing GridFS binary files' }
      ],
      correctAnswer: 'A',
      explanation: 'When too many documents share the exact same shard key value and exceed max chunk size (64MB), MongoDB cannot split the chunk, marking it Jumbo and disabling balancing.'
    },
    mentalModel: 'The shard key is a postal routing zip code: a bad code sends all mail to one post office, crashing the building.',
    codeSnippet: `// Inspect chunk balance:
sh.status({ verbose: true });`,
    takeaways: [
      'Cardinality must be high to allow chunk splitting.',
      'Monotonic keys cause single-shard write hot spotting.',
      'Use Hashed Sharding for uniform write scaling.'
    ],
    commonPitfall: {
      mistake: 'Sharding on status (e.g. "active", "pending", "closed"), creating only 3 chunks that can never be split across 10 shards.',
      fix: 'Use a high-cardinality compound key such as { tenant_id: 1, user_id: 1 }.'
    },
    prevTopicId: 'sharding-architecture',
    nextTopicId: 'multi-doc-acid-transactions'
  },
  {
    id: 'multi-doc-acid-transactions',
    topicNumber: 50,
    title: 'Multi-Document ACID Transactions & Distributed Two-Phase Commit',
    category: 'distributed',
    difficulty: 'Expert',
    summary: 'MongoDB provides fully compliant multi-document ACID transactions across replica sets and sharded clusters using snapshot isolation and distributed Two-Phase Commit (2PC).',
    definition: 'MongoDB supports multi-document ACID transactions across replica sets (since 4.0) and sharded clusters (since 4.2). Transactions guarantee Atomicity, Consistency, Isolation (Snapshot Isolation), and Durability. Distributed transactions across shards are coordinated automatically via a distributed Two-Phase Commit (2PC) protocol.',
    eli5: 'Transferring $100 from Alice to Bob: if you subtract $100 from Alice and the server catches fire before adding it to Bob, the money vanishes. A multi-document ACID transaction guarantees that BOTH updates happen together, or if anything goes wrong, EVERYTHING rolls back as if nothing happened.',
    realWorldExample: {
      description: 'Atomic bank transfer between two independent account documents.',
      sampleDocuments: [
        {
          collection: 'accounts',
          doc: { _id: 'acc_A', balance: 1000 }
        },
        {
          collection: 'accounts',
          doc: { _id: 'acc_B', balance: 500 }
        }
      ],
      explanation: 'Subtracting 200 from A and adding 200 to B occurs in a single atomic transaction block.'
    },
    syntaxSteps: [
      {
        step: 'Execute atomic multi-document transaction in mongosh / Node.js',
        code: `const session = db.getMongo().startSession();
session.startTransaction({
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" }
});

try {
  const accColl = session.getDatabase("bank").accounts;
  accColl.updateOne({ _id: "acc_A" }, { $inc: { balance: -200 } });
  accColl.updateOne({ _id: "acc_B" }, { $inc: { balance: 200 } });
  
  session.commitTransaction(); // Atomic commit!
} catch (error) {
  session.abortTransaction();  // Rollback on any error!
  throw error;
} finally {
  session.endSession();
}`,
        note: 'Guarantees snapshot isolation across all affected collections.'
      }
    ],
    rulesTable: [
      {
        rule: 'Time Limit (60s)',
        explanation: 'Transactions have a default maximum lifetime of 60 seconds (transactionLifetimeLimitSeconds) to avoid pinning MVCC cache.'
      },
      {
        rule: 'DDL Operations Prohibited',
        explanation: 'DDL operations that create collections, create indexes, or drop collections cannot run inside transactions.'
      },
      {
        rule: 'TransientTransactionError',
        explanation: 'Drivers provide automatic retry logic when write conflicts or network failovers occur.'
      }
    ],
    deepDive: {
      title: 'Distributed 2PC Protocol Across Multiple Shards',
      description: 'When a transaction modifies documents spanning Shard 1 and Shard 2, the mongos router designates Shard 1 as the Transaction Coordinator. Phase 1 (Prepare): The coordinator asks all participant shards to acquire locks, flush preparation WAL logs, and vote PREPARED. Phase 2 (Commit): Once all shards agree, coordinator commands all shards to commit atomically.',
      codeSnippet: `// Transaction server status metrics:
db.serverStatus().transactions;
// "currentActive": active transactions holding snapshots`,
      warning: 'Overusing multi-document transactions in MongoDB indicates relational schema design flaws.'
    },
    advantages: [
      'Full ACID compliance for complex multi-entity business workflows (financial ledgers, checkout inventory)',
      'Snapshot isolation guarantees zero dirty reads, non-repeatable reads, or phantom reads',
      'Distributed 2PC handles shard cross-partition atomicity transparently'
    ],
    disadvantages: [
      'Incurs lock overhead and pins WiredTiger cache memory versions during transaction lifespan',
      'Slower write throughput compared to single-document atomic updates'
    ],
    interviewQuestions: [
      {
        question: 'Why does MongoDB recommend relying on single-document atomicity over multi-document transactions whenever possible?',
        answer: 'Single-document operations are inherently atomic in MongoDB and execute with zero distributed locking overhead. Multi-document transactions acquire locks, pin MVCC update chains in WiredTiger cache, increase dirty page pressure, and require distributed Two-Phase Commit across shards. Proper document embedding eliminates the need for 95% of transactions.'
      }
    ],
    interviewReadyAnswer: 'MongoDB supports multi-document ACID transactions across replica sets and sharded clusters using snapshot isolation and distributed Two-Phase Commit. Transactions have a default 60-second limit and require majority write concern. While powerful, document embedding should still be the primary design choice for atomic workflows.',
    quickTest: {
      question: 'What is the default maximum lifespan of a MongoDB multi-document transaction before the server forcibly aborts it?',
      options: [
        { key: 'A', text: '60 seconds' },
        { key: 'B', text: '1 second' },
        { key: 'C', text: '10 minutes' },
        { key: 'D', text: 'Unlimited' }
      ],
      correctAnswer: 'A',
      explanation: 'MongoDB restricts transaction lifetime to 60 seconds (transactionLifetimeLimitSeconds) to prevent uncommitted transactions from exhausting WiredTiger cache memory.'
    },
    mentalModel: 'A transaction is an all-or-nothing vault: either both doors open, or neither does.',
    codeSnippet: `// Check active transaction count:
db.serverStatus().transactions.currentActive;`,
    takeaways: [
      'MongoDB supports multi-document ACID transactions with snapshot isolation.',
      'Distributed transactions across shards use Two-Phase Commit (2PC).',
      'Transactions time out after 60 seconds to protect the cache.',
      'Prefer single-document embedding where possible.'
    ],
    commonPitfall: {
      mistake: 'Wrapping every single simple insert in a multi-document transaction like in a SQL database.',
      fix: 'Use standard single-document operations, which are already fully atomic and 10x faster.'
    },
    prevTopicId: 'shard-key-selection'
  }
];
