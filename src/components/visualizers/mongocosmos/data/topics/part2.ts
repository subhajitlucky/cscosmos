import { MongoTopic } from './types';

export const PART2_TOPICS: MongoTopic[] = [
  {
    id: 'wiredtiger-page-layout',
    topicNumber: 11,
    title: 'WiredTiger B-Tree Internal vs Leaf Page Layout',
    category: 'wiredtiger',
    difficulty: 'Intermediate',
    summary: 'WiredTiger structures both data collections and indexes as B-Trees, organizing data into Internal branch pages and Leaf data pages.',
    definition: 'WiredTiger is MongoDB\'s default pluggable storage engine. It organizes data and indexes using B-Trees (or LSM trees for specialized workloads). Internal pages store navigation keys and child page pointers, while Leaf pages store actual key-value pairs (document payloads or index record IDs).',
    eli5: 'Think of WiredTiger as a high-speed library filing system: the card catalog shelves (Internal pages) guide you to the specific drawer (Leaf page) containing the exact document folder.',
    realWorldExample: {
      description: 'Navigating an index B-Tree on user email addresses.',
      sampleDocuments: [
        {
          collection: 'system.indexes',
          doc: {
            page_type: 'leaf',
            entries: [
              { key: 'alice@cloud.io', record_id: 1042 },
              { key: 'bob@cloud.io', record_id: 1043 }
            ]
          }
        }
      ],
      explanation: 'Internal pages route lookups down through tree levels to the leaf page holding the record pointer in O(log N) time.'
    },
    syntaxSteps: [
      {
        step: 'Inspect collection WiredTiger page statistics',
        code: `db.users.stats().wiredTiger["block-manager"];`,
        note: 'Inspects allocated block bytes and page reuse metrics.'
      },
      {
        step: 'Check B-Tree page size configuration',
        code: `db.users.stats().wiredTiger["creationString"];`,
        note: 'Shows internal_page_max (default 4KB) and leaf_page_max (default 32KB).'
      }
    ],
    rulesTable: [
      {
        rule: 'internal_page_max (4KB)',
        explanation: 'Keeps internal navigation nodes small and high-fanout, maximizing cache fit.'
      },
      {
        rule: 'leaf_page_max (32KB)',
        explanation: 'Default maximum uncompressed size for leaf pages before triggering a page split.'
      }
    ],
    deepDive: {
      title: 'B-Tree Page Splitting in WiredTiger',
      description: 'When insertions or updates cause a leaf page to exceed leaf_page_max, WiredTiger reconciles the page in memory. It splits the page into two or more daughter pages, inserts a new separator key into the parent internal page, and queues the dirty pages for writing to disk at the next checkpoint.',
      codeSnippet: `// Stats tracking page splits:
db.serverStatus().wiredTiger.btree["pages split by reconciliation"];`,
      warning: 'Frequent random inserts into UUID indexes trigger constant mid-page splits, degrading I/O performance.'
    },
    advantages: [
      'High fanout reduces B-Tree height to 3-4 levels for millions of documents',
      'Configurable leaf and internal page boundaries optimize for read vs write heavy workloads',
      'Lock-free algorithms minimize mutex contention during tree traversals'
    ],
    disadvantages: [
      'Page splits require updating parent internal pages, temporarily creating dirty cache entries',
      'Random insertion workloads can leave leaf pages partially empty (fragmented)'
    ],
    interviewQuestions: [
      {
        question: 'Why does WiredTiger use different default page sizes for internal nodes (4KB) vs leaf nodes (32KB)?',
        answer: 'Internal nodes only store separator keys and 64-bit child page pointers; keeping them at 4KB ensures high fanout and allows all internal routing pages to stay permanently pinned in RAM. Leaf nodes store full document or index payloads, where a larger 32KB size maximizes sequential disk I/O throughput and compression ratios.'
      }
    ],
    interviewReadyAnswer: 'WiredTiger structures collections and indexes as B-Trees. Internal pages default to 4KB for high fanout and fast routing, while leaf pages default to 32KB to balance compression efficiency and disk I/O. When leaf pages exceed the limit, WiredTiger performs in-memory reconciliation page splits.',
    quickTest: {
      question: 'What is the default uncompressed maximum leaf page size in WiredTiger for standard collections?',
      options: [
        { key: 'A', text: '32 KB' },
        { key: 'B', text: '4 KB' },
        { key: 'C', text: '16 MB' },
        { key: 'D', text: '1 MB' }
      ],
      correctAnswer: 'A',
      explanation: 'WiredTiger defaults leaf_page_max to 32 KB for collections and index trees, while internal pages default to 4 KB.'
    },
    mentalModel: 'Internal pages are road signs; leaf pages are destinations.',
    codeSnippet: `// View B-Tree traversal stats:
db.serverStatus().wiredTiger.btree;`,
    takeaways: [
      'WiredTiger indexes and collections are organized as B-Trees.',
      'Internal pages route searches; leaf pages store keys and record IDs.',
      'Sequential inserts cluster at the right edge, avoiding mid-page splits.'
    ],
    commonPitfall: {
      mistake: 'Using completely random UUID strings as primary keys without considering B-Tree page splits.',
      fix: 'Use ObjectIds or monotonically increasing UUIDv7 to keep inserts sequential.'
    },
    prevTopicId: 'schema-anti-patterns',
    nextTopicId: 'wiredtiger-cache-architecture'
  },
  {
    id: 'wiredtiger-cache-architecture',
    topicNumber: 12,
    title: 'WiredTiger In-Memory Cache (Clean vs Dirty Pages)',
    category: 'wiredtiger',
    difficulty: 'Advanced',
    summary: 'The WiredTiger cache buffers frequently accessed B-Tree pages in memory, managing transitions between Clean and Dirty page states.',
    definition: 'The WiredTiger Cache is an in-memory buffer pool that holds working set pages. A page is "Clean" if its in-memory contents match its persistent representation on disk. A page becomes "Dirty" when an insert, update, or delete modifies it in memory. WiredTiger background eviction workers continuously write dirty pages to disk.',
    eli5: 'Think of the cache like a chef\'s kitchen prep table. Fresh ingredients from the pantry are "Clean". Once the chef chops and cooks them, they become "Dirty" (modified). Before closing the kitchen, the assistant must pack them into containers and store them back in the pantry (disk).',
    realWorldExample: {
      description: 'Monitoring WiredTiger cache usage on an active production replica node.',
      sampleDocuments: [
        {
          collection: 'serverStatus.wiredTiger.cache',
          doc: {
            "bytes currently in the cache": 17179869184, // 16GB
            "maximum bytes configured": 34359738368,    // 32GB
            "tracked dirty bytes in the cache": 1073741824 // 1GB
          }
        }
      ],
      explanation: 'WiredTiger actively tracks the ratio of dirty bytes to ensure dirty data does not exceed 20% of total cache capacity.'
    },
    syntaxSteps: [
      {
        step: 'Query real-time cache metrics in mongosh',
        code: `const c = db.serverStatus().wiredTiger.cache;
print("Cache total: " + (c["bytes currently in the cache"] / 1024 / 1024) + " MB");
print("Dirty bytes: " + (c["tracked dirty bytes in the cache"] / 1024 / 1024) + " MB");`,
        note: 'Monitors memory pressure and dirty page accumulation.'
      }
    ],
    rulesTable: [
      {
        rule: 'Default Allocation',
        explanation: 'Defaults to 50% of (RAM - 1GB), or 256MB, whichever is larger.'
      },
      {
        rule: 'Eviction Trigger',
        explanation: 'Background eviction begins when cache reaches 80% full, or dirty bytes reach 5%.'
      },
      {
        rule: 'Client Stall Trigger',
        explanation: 'If dirty bytes reach 20% or cache reaches 95%, client threads are forced to perform storage eviction.'
      }
    ],
    deepDive: {
      title: 'Client Thread Stalls During High Dirty Cache Pressure',
      description: 'If a massive write burst generates dirty pages faster than background eviction threads can flush them to disk, WiredTiger reaches its critical threshold (20% dirty). At this point, application client threads submitting writes are conscripted into performing eviction. Application write latency spikes from 1ms to hundreds of milliseconds.',
      codeSnippet: `// Mongod configuration parameter in mongod.conf:
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 16`,
      warning: 'Never allocate 100% of host RAM to WiredTiger; OS file system buffers and client connections need RAM.'
    },
    advantages: [
      'Sub-millisecond read and write latency for data resident in the working cache',
      'Separation of Clean and Dirty pages minimizes unnecessary disk I/O flushes',
      'Lock-free hazard pointers allow concurrent reads and updates on cache pages'
    ],
    disadvantages: [
      'Write bursts can overwhelm eviction workers, causing sudden client latency spikes',
      'High cache pressure forces premature eviction of hot read pages'
    ],
    interviewQuestions: [
      {
        question: 'What happens to client request latency when WiredTiger dirty cache exceeds 20%?',
        answer: 'When dirty cache exceeds 20%, WiredTiger throttles incoming writes and forces the client worker threads themselves to synchronously write dirty pages to disk before accepting new operations, causing dramatic latency spikes.'
      }
    ],
    interviewReadyAnswer: 'WiredTiger allocates 50% of (RAM - 1GB) to its cache, categorizing pages as Clean or Dirty. Background eviction threads keep dirty pages below 5% and overall utilization below 80%. If dirty cache breaches 20%, client write threads are throttled and forced into synchronous disk reconciliation.',
    quickTest: {
      question: 'By default, what formula does MongoDB use to determine the WiredTiger cache size on a standalone server?',
      options: [
        { key: 'A', text: '50% of (Total RAM - 1 GB), or 256 MB, whichever is greater' },
        { key: 'B', text: '100% of available physical RAM' },
        { key: 'C', text: 'A fixed 4 GB allocation' },
        { key: 'D', text: '80% of free swap memory' }
      ],
      correctAnswer: 'A',
      explanation: 'WiredTiger defaults to 50% of (RAM - 1GB) to leave sufficient headroom for OS filesystem cache, mongod process overhead, and client connections.'
    },
    mentalModel: 'Clean pages can be discarded instantly; dirty pages must be paid for with disk I/O.',
    codeSnippet: `// Check if client threads are being forced to evict:
db.serverStatus().wiredTiger.cache["application threads page write from cache to disk"];`,
    takeaways: [
      'Default cache size is 50% of RAM minus 1GB.',
      'Dirty pages are modified memory buffers not yet synced to disk.',
      'Monitor dirty cache ratio to detect write bottlenecks before client throttling occurs.'
    ],
    commonPitfall: {
      mistake: 'Allocating 90% of system RAM to WiredTiger, causing Linux OOM killer to terminate mongod.',
      fix: 'Leave at least 30-40% of RAM for OS page cache, connection buffers, and query work memory.'
    },
    prevTopicId: 'wiredtiger-page-layout',
    nextTopicId: 'checkpoints-and-recovery'
  },
  {
    id: 'checkpoints-and-recovery',
    topicNumber: 13,
    title: 'WiredTiger Checkpoints & Crash Consistency',
    category: 'wiredtiger',
    difficulty: 'Advanced',
    summary: 'WiredTiger periodically writes consistent filesystem snapshots (checkpoints) to disk every 60 seconds, acting as recovery anchors during crash reboots.',
    definition: 'A Checkpoint in WiredTiger is a persistent, crash-consistent snapshot of the entire database written to disk. By default, MongoDB triggers a checkpoint every 60 seconds or after 2GB of journal data. If the server crashes or loses power, WiredTiger recovers by loading the latest checkpoint and replaying the journal from that point forward.',
    eli5: 'Checkpoints are like autosaves in a video game every 60 seconds. If your console loses power, the game reloads from the last autosave and uses your quick-log (journal) to catch up on the last few seconds.',
    realWorldExample: {
      description: 'Observing checkpoint creation during high-volume data ingestion.',
      sampleDocuments: [
        {
          collection: 'serverStatus.wiredTiger.checkpoint',
          doc: {
            "checkpoint count": 450,
            "last checkpoint duration (msecs)": 320,
            "bytes written": 419430400 // 400MB written to disk
          }
        }
      ],
      explanation: 'Every 60 seconds, all dirty B-Tree pages are written to persistent blocks on disk and the root pointers are atomically updated.'
    },
    syntaxSteps: [
      {
        step: 'Trigger a manual checkpoint in mongosh',
        code: `db.fsyncLock(); // Flushes all dirty pages and creates checkpoint
db.fsyncUnlock(); // Resumes writes`,
        note: 'Useful before taking consistent filesystem-level LVM/EBS snapshots.'
      },
      {
        step: 'Check last checkpoint runtime stats',
        code: `db.serverStatus().wiredTiger.transaction["transaction checkpoint total time (msecs)"];`,
        note: 'Measures I/O latency spent syncing dirty pages to disk.'
      }
    ],
    rulesTable: [
      {
        rule: 'Frequency',
        explanation: 'Executes every 60 seconds or when 2GB of journal data has been written.'
      },
      {
        rule: 'Non-Blocking Writes',
        explanation: 'Checkpoints run concurrently with ongoing reads and writes using copy-on-write page reconciliation.'
      }
    ],
    deepDive: {
      title: 'Copy-On-Write and Atomic Root Pointer Swap',
      description: 'WiredTiger does not overwrite existing disk blocks in place during a checkpoint. Instead, it writes dirty pages into newly allocated free disk blocks (Copy-On-Write). Once all pages are safely written and fsynced, WiredTiger atomically updates the root block pointers in the metadata file (WiredTiger.wt). If a crash happens midway, the previous checkpoint remains 100% uncorrupted.',
      codeSnippet: `// View checkpoint historical runtimes:
db.serverStatus().wiredTiger.transaction["transaction checkpoint most recent time (msecs)"];`,
      warning: 'High disk latency during checkpoints can cause periodic write stalls every 60 seconds.'
    },
    advantages: [
      'Guarantees full database crash recovery even if the server suffers an abrupt power outage',
      'Copy-on-write design prevents database file corruption during in-flight crashes',
      'Enables non-disruptive, crash-consistent storage block backups (EBS/SAN snapshots)'
    ],
    disadvantages: [
      'Causes periodic I/O write spikes every 60 seconds as accumulated dirty pages are flushed',
      'Free block fragmentation requires background space reclamation'
    ],
    interviewQuestions: [
      {
        question: 'How do WiredTiger checkpoints and the write-ahead journal work together to guarantee Durability?',
        answer: 'Checkpoints create a complete, consistent snapshot of all collection and index data on disk every 60 seconds. The write-ahead journal records operations between checkpoints. Upon recovery after an unexpected crash, WiredTiger loads the last successful checkpoint and replays all journal records committed since that checkpoint, restoring 100% of committed transactions.'
      }
    ],
    interviewReadyAnswer: 'Checkpoints occur every 60 seconds (or 2GB of journal), flushing all dirty cache pages to disk using a copy-on-write strategy. Recovery involves rolling back to the last valid checkpoint and replaying the journal from that point forward.',
    quickTest: {
      question: 'What is the default time interval between automated WiredTiger checkpoints in MongoDB?',
      options: [
        { key: 'A', text: '60 seconds' },
        { key: 'B', text: '1 second' },
        { key: 'C', text: '10 minutes' },
        { key: 'D', text: '24 hours' }
      ],
      correctAnswer: 'A',
      explanation: 'WiredTiger triggers a background checkpoint every 60 seconds, or sooner if 2GB of un-checkpointed journal records accumulate.'
    },
    mentalModel: 'Checkpoints are persistent base snapshots; journals are the incremental delta logs between them.',
    codeSnippet: `// Check checkpoint generation count:
db.serverStatus().wiredTiger.transaction["transaction checkpoint generation"];`,
    takeaways: [
      'Checkpoints occur every 60 seconds by default.',
      'Copy-on-write guarantees that aborted checkpoints never corrupt the database.',
      'Checkpoints allow the engine to truncate historical journal files.'
    ],
    commonPitfall: {
      mistake: 'Taking raw filesystem file copies while mongod is actively writing without fsyncLock().',
      fix: 'Use mongodump, an LVM/EBS atomic snapshot, or db.fsyncLock() before backing up raw files.'
    },
    prevTopicId: 'wiredtiger-cache-architecture',
    nextTopicId: 'lookaside-table-las'
  },
  {
    id: 'lookaside-table-las',
    topicNumber: 14,
    title: 'The Lookaside Table (LAS) & Cache Pressure Overflow',
    category: 'wiredtiger',
    difficulty: 'Expert',
    summary: 'The WiredTiger Lookaside Table (LAS) acts as an overflow swap area on disk for old transaction updates when the in-memory cache experiences extreme pressure.',
    definition: 'The Lookaside Table (WiredTigerLAS.wt) is a specialized on-disk file used by WiredTiger during intense memory cache pressure. When an active page needs to be evicted to free RAM, but that page contains uncommitted modifications or updates required by older concurrent transactions, WiredTiger writes those historical version deltas into the Lookaside Table.',
    eli5: 'Imagine your desk is overflowing with papers. You need to clear space, but some old documents belong to a colleague who is still on vacation. Instead of throwing them away or keeping them on your desk, you move them into a temporary storage locker in the hallway (the Lookaside table).',
    realWorldExample: {
      description: 'A long-running report running for 45 minutes while thousands of concurrent updates modify the same records.',
      sampleDocuments: [
        {
          collection: 'serverStatus.wiredTiger.lookaside',
          doc: {
            "lookaside table entries allocated": 250000,
            "lookaside table inserts": 180000,
            "lookaside table lookups": 95000
          }
        }
      ],
      explanation: 'WiredTiger spills old version tuples to the LAS file so it can evict the parent pages from RAM without breaking the long-running query.'
    },
    syntaxSteps: [
      {
        step: 'Monitor Lookaside table size and activity in serverStatus',
        code: `const las = db.serverStatus().wiredTiger["lookaside table"];
print("LAS Inserts: " + las["lookaside table inserts"]);
print("LAS Lookups: " + las["lookaside table lookups"]);`,
        note: 'Elevated LAS activity indicates prolonged cache starvation and long-running transactions.'
      }
    ],
    rulesTable: [
      {
        rule: 'Trigger Cause',
        explanation: 'Active cache eviction coupled with long-running transactions holding old snapshot timestamps.'
      },
      {
        rule: 'Performance Warning',
        explanation: 'When queries must read from the Lookaside table, read latency degrades drastically due to random disk reads.'
      }
    ],
    deepDive: {
      title: 'How Long-Running Queries Drive LAS Spilling',
      description: 'Under MVCC, every update creates a new row version while preserving the old version for concurrent readers. If a transaction opens a snapshot at timestamp T0 and runs for 1 hour, WiredTiger CANNOT discard any row versions modified after T0. When cache pressure demands page eviction, WiredTiger has no choice but to write these historical versions into WiredTigerLAS.wt on disk.',
      codeSnippet: `// Find long-running operations pinning historical snapshots:
db.currentOp({ "secs_running": { $gt: 300 } });`,
      warning: 'Never allow reporting queries or batch updates to run for hours without paginating.'
    },
    advantages: [
      'Prevents out-of-memory (OOM) crashes during severe cache starvation',
      'Allows long-running analytical queries to finish without failing with snapshot isolation errors'
    ],
    disadvantages: [
      'High disk I/O latency when queries must probe the on-disk LAS table to reconstruct snapshots',
      'Excessive LAS usage indicates that system RAM is undersized for the workload'
    ],
    interviewQuestions: [
      {
        question: 'What is the primary cause of high WiredTiger Lookaside Table (LAS) activity?',
        answer: 'High LAS activity is triggered when long-running read operations or uncommitted transactions pin old snapshot timestamps, preventing the engine from purging dead MVCC row versions, while concurrent write traffic forces the cache eviction server to spill these uncommitted or historical deltas to the LAS file on disk.'
      }
    ],
    interviewReadyAnswer: 'The Lookaside Table (LAS) is WiredTiger\'s overflow swap file for MVCC historical versions. When the cache is full and pages must be evicted, but contain row versions required by active older transactions, those versions are written to the LAS file on disk to prevent OOM errors.',
    quickTest: {
      question: 'Which metric in db.serverStatus() indicates that WiredTiger is swapping historical MVCC versions to disk?',
      options: [
        { key: 'A', text: 'wiredTiger["lookaside table"]["lookaside table inserts"]' },
        { key: 'B', text: 'wiredTiger["connection"]["total connections"]' },
        { key: 'C', text: 'wiredTiger["lock"]["read tickets"]' },
        { key: 'D', text: 'wiredTiger["cache"]["bytes read into cache"]' }
      ],
      correctAnswer: 'A',
      explanation: 'The lookaside table metrics track entries, inserts, and lookups against the on-disk overflow swap table.'
    },
    mentalModel: 'LAS is WiredTiger\'s swap partition for historical MVCC versions pinned by slow queries.',
    codeSnippet: `// Kill long-running ops causing LAS bloat:
db.killOp(opId);`,
    takeaways: [
      'LAS acts as an overflow swap for MVCC versions.',
      'Caused by long-running transactions running alongside heavy writes.',
      'High LAS activity signals the need for more RAM or shorter transaction lifetimes.'
    ],
    commonPitfall: {
      mistake: 'Running unindexed reporting queries that scan millions of rows over 40 minutes on a write-heavy primary.',
      fix: 'Route heavy analytical queries to dedicated read-only secondary nodes.'
    },
    prevTopicId: 'checkpoints-and-recovery',
    nextTopicId: 'wiredtiger-mvcc-snapshot'
  },
  {
    id: 'wiredtiger-mvcc-snapshot',
    topicNumber: 15,
    title: 'WiredTiger MVCC & In-Memory Snapshot Isolation',
    category: 'wiredtiger',
    difficulty: 'Advanced',
    summary: 'WiredTiger implements multi-version concurrency control (MVCC) in memory using linked update chains, allowing readers to query consistent snapshots without blocking writers.',
    definition: 'Multi-Version Concurrency Control (MVCC) in WiredTiger ensures that readers do not block writers, and writers do not block readers. When a document is modified, WiredTiger does not overwrite the existing record in memory. Instead, it prepends a new update structure containing the new data and transaction commit timestamp to an in-memory update chain linked to the B-Tree row.',
    eli5: 'When an author edits a shared document, instead of erasing sentences and locking the page, they stick a transparent sticky note over the paragraph. Readers who arrived earlier read the original page; new readers read the sticky note.',
    realWorldExample: {
      description: 'Concurrent read queries reading customer balance while an update transaction is in flight.',
      sampleDocuments: [
        {
          collection: 'accounts',
          doc: {
            _id: 'acc_01',
            balance: 500 // In-memory update chain: [ { ts: 105, val: 400 }, { ts: 100, val: 500 } ]
          }
        }
      ],
      explanation: 'A reader with snapshot timestamp 102 reads 500, while a reader with timestamp 106 reads 400 concurrently without any mutex locks.'
    },
    syntaxSteps: [
      {
        step: 'Run query with snapshot read concern in a transaction',
        code: `const session = db.getMongo().startSession();
session.startTransaction({ readConcern: { level: "snapshot" } });
const acc = session.getDatabase("bank").accounts.findOne({ _id: "acc_01" });
session.commitTransaction();`,
        note: 'Guarantees the read views a point-in-time consistent snapshot across all collections.'
      }
    ],
    rulesTable: [
      {
        rule: 'Readers vs Writers',
        explanation: 'Readers read historical versions from update chains without acquiring write locks.'
      },
      {
        rule: 'Update Chains',
        explanation: 'Each memory row tuple maintains a linked list of update structures ordered by timestamp.'
      }
    ],
    deepDive: {
      title: 'Update Chain Traversal & Reconciliation',
      description: 'When a reader traverses a B-Tree page, it evaluates the update chain on each row against its active transaction read timestamp. If the top version is uncommitted or committed after the reader\'s snapshot timestamp, WiredTiger walks backward along the pointer chain until it finds the version committed before its snapshot.',
      codeSnippet: `// Structure of in-memory row:
// [Row Key: "acc_01"] -> [Update Tx: 108, Balance: 400] -> [Update Tx: 100, Balance: 500]`,
      warning: 'Deep update chains on hot spot rows consume CPU during backward traversal.'
    },
    advantages: [
      'Eliminates read-write lock contention across concurrent clients',
      'Provides true point-in-time Snapshot Isolation for multi-document ACID transactions',
      'Historical versions are garbage collected automatically during in-memory page reconciliation'
    ],
    disadvantages: [
      'Update chains consume working cache RAM until reconciled and evicted',
      'High write contention on a single document creates long update chains that slow reads'
    ],
    interviewQuestions: [
      {
        question: 'How does WiredTiger handle concurrent updates to the same document under MVCC?',
        answer: 'WiredTiger uses optimistic concurrency control for row updates. If two concurrent transactions attempt to update the same document, the second transaction detects a write conflict (WriteConflictException) and automatically retries internally, or aborts if operating within an explicit client transaction.'
      }
    ],
    interviewReadyAnswer: 'WiredTiger implements MVCC using in-memory update chains attached to B-Tree leaf tuples. Readers consult their snapshot timestamp and traverse the chain to view consistent point-in-time data without acquiring locks. When pages are reconciled during checkpoints or eviction, committed updates are collapsed into base leaf blocks.',
    quickTest: {
      question: 'Under WiredTiger MVCC, what structure is attached to a B-Tree row in memory to record concurrent modifications?',
      options: [
        { key: 'A', text: 'An in-memory linked list update chain' },
        { key: 'B', text: 'A hard disk table lock file' },
        { key: 'C', text: 'A secondary B+ Tree index pointer' },
        { key: 'D', text: 'A system journal semaphore' }
      ],
      correctAnswer: 'A',
      explanation: 'WiredTiger attaches an in-memory update chain (linked list of timestamped update structs) to each modified B-Tree leaf record.'
    },
    mentalModel: 'MVCC update chains are transparent revision overlays: readers see the overlay matching their arrival time.',
    codeSnippet: `// Check write conflicts handled by MVCC:
db.serverStatus().wiredTiger.transaction["write conflicts"];`,
    takeaways: [
      'Readers never block writers in WiredTiger.',
      'Updates prepend new version structures to an in-memory linked list.',
      'Reconciliation purges historical versions older than the oldest active transaction.'
    ],
    commonPitfall: {
      mistake: 'Incrementing a single document counter 10,000 times per second in a tight loop, causing update chain thrashing.',
      fix: 'Use distributed counters or aggregate via bucket collections.'
    },
    prevTopicId: 'lookaside-table-las',
    nextTopicId: 'journal-write-ahead-logging'
  },
  {
    id: 'journal-write-ahead-logging',
    topicNumber: 16,
    title: 'WiredTiger Journaling & fsync Durability Mechanics',
    category: 'wiredtiger',
    difficulty: 'Advanced',
    summary: 'The WiredTiger write-ahead journal logs raw data mutations sequentially to non-volatile disk, guaranteeing ACID durability between 60-second checkpoint intervals.',
    definition: 'The WiredTiger Journal is an append-only write-ahead log (WAL) stored in the journal/ directory. Because database checkpoints only occur every 60 seconds, all intermediate write operations are written sequentially to the journal on non-volatile disk. If mongod crashes, the journal is replayed to reconstruct all committed writes.',
    eli5: 'Checkpoints are taking a full photograph of your room once an hour. The journal is writing down every item you move in a notepad as soon as you move it. If the power cuts, you look at the last photo and read your notes to put everything in its exact place.',
    realWorldExample: {
      description: 'A financial payment write with { j: true } write concern guaranteeing on-disk persistence before confirming to the client.',
      sampleDocuments: [
        {
          collection: 'transfers',
          doc: {
            _id: 'tx_9921',
            from: 'u1',
            to: 'u2',
            amount: 500
          }
        }
      ],
      explanation: 'With j: true, mongod forces an fsync on the journal buffer, guaranteeing durability before returning success.'
    },
    syntaxSteps: [
      {
        step: 'Execute write with explicit journal durability concern',
        code: `db.transfers.insertOne(
  { from: "u1", to: "u2", amount: 500 },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
);`,
        note: 'j: true blocks client return until the journal entry is physically flushed to disk.'
      }
    ],
    rulesTable: [
      {
        rule: 'Default Commit Interval',
        explanation: 'WiredTiger flushes journal records to disk every 100 milliseconds (commitIntervalMs).'
      },
      {
        rule: 'j: true vs j: false',
        explanation: 'j: true commits synchronously to disk (fsync); j: false confirms as soon as memory buffers are updated.'
      }
    ],
    deepDive: {
      title: 'Group Commit & Batching in the Journal Ring Buffer',
      description: 'Invoking fsync for every individual client write would limit throughput to disk IOPS limits (a few thousand writes/sec). WiredTiger implements Group Commit: multiple concurrent client writes group their records into a shared in-memory journal buffer. A single thread executes fsync, satisfying dozens of waiting client write concerns in a single disk cycle.',
      codeSnippet: `// Journal statistics in serverStatus:
db.serverStatus().wiredTiger.log;
// "log bytes write": total bytes appended
// "log sync operations": number of physical fsync calls to disk`,
      warning: 'Disabling journaling in standalone instances means an unexpected power outage can cause up to 60 seconds of data loss.'
    },
    advantages: [
      'Guarantees ACID Durability without requiring full B-Tree page writes to disk on every insert',
      'Sequential disk writes to the journal are orders of magnitude faster than random B-Tree page writes',
      'Group commit amortizes disk fsync latency across concurrent client threads'
    ],
    disadvantages: [
      'Synchronous { j: true } writes add 2-10ms of disk I/O latency to client request cycles',
      'Journaling consumes continuous disk write I/O bandwidth'
    ],
    interviewQuestions: [
      {
        question: 'If a MongoDB server experiences an abrupt power loss, what is the maximum window of data loss if writes were issued with { j: false } on a standalone instance?',
        answer: 'With { j: false }, writes are acknowledged in memory. The journal buffer flushes to disk every 100ms (commitIntervalMs). Therefore, the maximum data loss window on an abrupt power loss is up to 100 milliseconds. With { j: true }, the data loss window is exactly 0.'
      }
    ],
    interviewReadyAnswer: 'WiredTiger uses write-ahead journaling to guarantee durability between 60-second checkpoints. Journal buffers are flushed sequentially to disk every 100ms by default, or immediately when writes request { j: true }. On crash recovery, WiredTiger loads the last checkpoint and replays journal logs to reconstruct committed state.',
    quickTest: {
      question: 'What is the default maximum journal commit interval (commitIntervalMs) in WiredTiger for background syncs?',
      options: [
        { key: 'A', text: '100 milliseconds' },
        { key: 'B', text: '60 seconds' },
        { key: 'C', text: '1 millisecond' },
        { key: 'D', text: '5 seconds' }
      ],
      correctAnswer: 'A',
      explanation: 'WiredTiger flushes journal buffers to disk every 100 milliseconds by default, unless triggered sooner by { j: true } writes.'
    },
    mentalModel: 'The journal is a fast sequential ledger; checkpoints are periodic full balance sheets.',
    codeSnippet: `// Check journal sync operations:
db.serverStatus().wiredTiger.log["log sync operations"];`,
    takeaways: [
      'The journal protects against power failures between 60s checkpoints.',
      'Sequential WAL writes are fast and efficient.',
      'Use { j: true } for mission-critical writes that cannot tolerate a 100ms loss window.'
    ],
    commonPitfall: {
      mistake: 'Assuming { w: "majority" } guarantees on-disk persistence on the primary node.',
      fix: '{ w: "majority" } guarantees replication to memory across replica set members; specify { j: true } if physical disk flush is mandatory.'
    },
    prevTopicId: 'wiredtiger-mvcc-snapshot',
    nextTopicId: 'compression-algorithms'
  },
  {
    id: 'compression-algorithms',
    topicNumber: 17,
    title: 'Block Compression: Snappy, zlib, zstd & Prefix Compression',
    category: 'wiredtiger',
    difficulty: 'Intermediate',
    summary: 'WiredTiger achieves 60-80% storage savings by compressing collection data blocks with Snappy/zstd and index pages with Prefix Compression.',
    definition: 'WiredTiger compresses collection data pages before writing them to disk blocks using block compression algorithms (Snappy by default, or zlib/zstd). In addition, index B-Tree pages utilize Prefix Compression, which eliminates redundant common key prefixes across consecutive index entries.',
    eli5: 'Block compression is like putting your winter clothes into a vacuum-seal bag before putting them in the attic: they take up 70% less space. Prefix compression in an index is like writing "smith" once and writing ", john", ", jane", ", mary" instead of re-writing "smith" every time.',
    realWorldExample: {
      description: 'Compressing a 100GB access log collection using zstandard (zstd) instead of default Snappy.',
      sampleDocuments: [
        {
          collection: 'system.profile',
          doc: {
            uncompressedSize: '100 GB',
            snappyCompressedSize: '32 GB',
            zstdCompressedSize: '18 GB'
          }
        }
      ],
      explanation: 'Switching to zstd reduces disk footprint from 32GB to 18GB, saving disk costs at the expense of slightly higher CPU usage.'
    },
    syntaxSteps: [
      {
        step: 'Create a collection with high-ratio zstd compression',
        code: `db.createCollection("heavy_logs", {
  storageEngine: {
    wiredTiger: {
      configString: "block_compressor=zstd"
    }
  }
});`,
        note: 'zstd provides superior compression ratios compared to snappy.'
      },
      {
        step: 'Inspect compression ratio on existing collection',
        code: `const s = db.heavy_logs.stats();
print("Compression Ratio: " + (s.size / s.storageSize).toFixed(2) + "x");`,
        note: 'Shows uncompressed memory size divided by physical disk space.'
      }
    ],
    rulesTable: [
      {
        rule: 'Snappy (Default)',
        explanation: 'Balanced performance: low CPU overhead with moderate compression (~60% space savings).'
      },
      {
        rule: 'zstd (Recommended for Analytics)',
        explanation: 'High compression ratio (up to 80% savings) with competitive decompression speeds.'
      },
      {
        rule: 'Prefix Compression',
        explanation: 'Enabled on all B-Tree indexes by default; strips duplicate key prefixes across adjacent entries.'
      }
    ],
    deepDive: {
      title: 'Index Prefix Compression Mechanics',
      description: 'Consider an index on { lastName: 1, firstName: 1 } where 10,000 entries share the last name "Williams". Instead of repeating "Williams" 10,000 times in B-Tree leaf blocks, WiredTiger stores the prefix length and only records the differentiating characters. This cuts index size by 50% or more, allowing vastly more index keys to fit into RAM.',
      codeSnippet: `// Verify prefix compression is active on indexes:
db.users.stats().indexSizes;`,
      warning: 'Decompression happens dynamically when reading pages into RAM; CPU usage increases on read-heavy workloads with zlib.'
    },
    advantages: [
      'Reduces disk storage costs by 60% to 80% across production clusters',
      'Reduces physical disk I/O bottlenecks: reading smaller compressed blocks is faster than raw uncompressed blocks',
      'Index prefix compression drastically expands the number of index keys fitting into RAM cache'
    ],
    disadvantages: [
      'Higher CPU utilization for compression during writes and decompression during reads',
      'Data pages must be decompressed in memory, meaning RAM cache capacity is unaffected by disk compression'
    ],
    interviewQuestions: [
      {
        question: 'Does WiredTiger compression reduce the RAM required to hold the active working set in memory?',
        answer: 'No. WiredTiger compresses data blocks only when writing to disk. When pages are read into the WiredTiger in-memory cache, they are decompressed into raw BSON tuples. Therefore, working set RAM requirements are determined by uncompressed document and key sizes.'
      }
    ],
    interviewReadyAnswer: 'WiredTiger applies block compression (Snappy, zlib, or zstd) to collection data blocks on disk and prefix compression to index pages. Prefix compression eliminates duplicate key prefixes in index B-Trees, while zstd provides optimal disk density for cold or analytical collections with modest CPU trade-offs.',
    quickTest: {
      question: 'Which compression algorithm is the default block compressor for collections in MongoDB WiredTiger?',
      options: [
        { key: 'A', text: 'Snappy' },
        { key: 'B', text: 'zlib' },
        { key: 'C', text: 'gzip' },
        { key: 'D', text: 'bzip2' }
      ],
      correctAnswer: 'A',
      explanation: 'Snappy is the default collection block compressor in WiredTiger, designed for low CPU consumption and fast throughput.'
    },
    mentalModel: 'Compress on disk for cheap storage and fast I/O; decompress in RAM for instant CPU execution.',
    codeSnippet: `// Inspect storage efficiency:
const stats = db.orders.stats();
console.log("Size in RAM: " + stats.size + " | Size on disk: " + stats.storageSize);`,
    takeaways: [
      'Snappy is default; zstd provides higher compression for archival tables.',
      'Index pages use prefix compression by default.',
      'Compression saves disk space and disk I/O, but trades CPU cycles.'
    ],
    commonPitfall: {
      mistake: 'Using zlib compression on extreme high-throughput, CPU-bound transactional clusters.',
      fix: 'Use default Snappy or zstd for lower CPU compression latency.'
    },
    prevTopicId: 'journal-write-ahead-logging',
    nextTopicId: 'cache-eviction-workers'
  },
  {
    id: 'cache-eviction-workers',
    topicNumber: 18,
    title: 'Eviction Server Threads & Cache Eviction Triggers',
    category: 'wiredtiger',
    difficulty: 'Advanced',
    summary: 'WiredTiger utilizes autonomous background eviction worker threads to continuously reclaim cache memory, pacing clean page drops and dirty page flushes.',
    definition: 'The WiredTiger Eviction Server is an autonomous background subsystem consisting of multiple eviction worker threads. Its responsibility is to monitor cache utilization and ensure that available cache memory never drops below safe operating margins by discarding clean pages and writing dirty pages to disk.',
    eli5: 'Imagine a busy restaurant dining room with limited tables. The busboys (eviction threads) constantly clear empty plates (clean pages) and wipe down dirty tables (dirty pages) so new guests (queries) never have to wait outside.',
    realWorldExample: {
      description: 'Eviction server pacing under high memory load.',
      sampleDocuments: [
        {
          collection: 'serverStatus.wiredTiger.cache',
          doc: {
            "eviction worker thread evicting pages": 4,
            "pages evicted by application threads": 0,
            "maximum page size at eviction": 65536
          }
        }
      ],
      explanation: 'Zero pages evicted by application threads proves that background eviction workers are keeping pace with write throughput.'
    },
    syntaxSteps: [
      {
        step: 'Check eviction worker health and page eviction rates',
        code: `const c = db.serverStatus().wiredTiger.cache;
print("Evicted clean: " + c["unmodified pages evicted"]);
print("Evicted dirty: " + c["modified pages evicted"]);
print("Evicted by app threads: " + c["pages evicted by application threads"]);`,
        note: 'Non-zero "pages evicted by application threads" indicates dangerous cache exhaustion.'
      }
    ],
    rulesTable: [
      {
        rule: 'Eviction Trigger (80%)',
        explanation: 'Background eviction begins gently when cache exceeds 80% capacity.'
      },
      {
        rule: 'Aggressive Eviction (95%)',
        explanation: 'Background threads spawn extra workers and evict aggressively.'
      },
      {
        rule: 'App Thread Stalls (95%+ or 20% dirty)',
        explanation: 'Client application queries stall and are forced to perform disk eviction themselves.'
      }
    ],
    deepDive: {
      title: 'The LRU (Least Recently Used) Hazard Pointer Algorithm',
      description: 'WiredTiger does not use a naive global LRU linked list, which causes massive lock contention on multi-core servers. Instead, eviction threads walk random B-Tree branches using hazard pointers, scoring pages based on read generation timestamps and dirty status, selecting cold candidates for eviction without blocking active worker threads.',
      codeSnippet: `// Server status metrics tracking eviction server:
db.serverStatus().wiredTiger.cache["eviction server passes through the cache"];`,
      warning: 'When client threads are forced to evict, database p99 latency spikes drastically.'
    },
    advantages: [
      'Decouples query execution from physical disk flush routines under normal loads',
      'Hazard-pointer scanning avoids global lock bottlenecks on 64+ CPU core servers',
      'Dynamic scaling of eviction workers matches incoming write bursts'
    ],
    disadvantages: [
      'Consumes significant background CPU during heavy random write workloads',
      'Can evict warm data prematurely if the working set exceeds physical cache allocation'
    ],
    interviewQuestions: [
      {
        question: 'What is the significance of the "pages evicted by application threads" metric in WiredTiger serverStatus?',
        answer: 'Under normal operation, this metric should be zero because dedicated background eviction worker threads handle all page evictions. If this value is greater than zero, it means background eviction workers could not keep up with write volume, forcing incoming client application threads to synchronously write dirty pages to disk, causing severe latency spikes.'
      }
    ],
    interviewReadyAnswer: 'WiredTiger maintains background eviction worker threads that monitor cache thresholds (80% full or 5% dirty). They scan B-Trees using hazard pointers to evict cold clean pages and write dirty pages to disk. If cache reaches 95% full or 20% dirty, client threads are forced to evict, causing application latency spikes.',
    quickTest: {
      question: 'Which condition causes incoming application client requests to stall and perform page eviction themselves?',
      options: [
        { key: 'A', text: 'Dirty cache exceeds 20% or total cache exceeds 95%' },
        { key: 'B', text: 'Replica set election heartbeat is triggered' },
        { key: 'C', text: 'A user creates a new sparse index' },
        { key: 'D', text: 'A capped collection completes its first circular loop' }
      ],
      correctAnswer: 'A',
      explanation: 'When dirty cache exceeds 20% or overall cache reaches 95%, WiredTiger conscripts client threads into writing pages to disk to prevent OOM failure.'
    },
    mentalModel: 'Eviction threads are the sanitation crew: they keep the cache tidy so clients never have to clean up.',
    codeSnippet: `// Alert on application thread evictions:
if (db.serverStatus().wiredTiger.cache["pages evicted by application threads"] > 0) {
  print("WARNING: Client write latency impacted by cache pressure!");
}`,
    takeaways: [
      'Eviction workers continuously reclaim cache memory in the background.',
      'Monitor "pages evicted by application threads" to detect cache sizing issues.',
      'Maintain working set size within 70% of configured cache capacity.'
    ],
    commonPitfall: {
      mistake: 'Ignoring alerts when application thread evictions occur, leading to cascading client connection pool timeouts.',
      fix: 'Scale up host RAM, increase WiredTiger cache size, or optimize index working sets.'
    },
    prevTopicId: 'compression-algorithms',
    nextTopicId: 'read-write-tickets'
  },
  {
    id: 'read-write-tickets',
    topicNumber: 19,
    title: 'Concurrency Control: Read Tickets vs Write Tickets',
    category: 'wiredtiger',
    difficulty: 'Advanced',
    summary: 'MongoDB limits concurrent WiredTiger storage engine execution using Ticket Concurrency Control (128 read tickets and 128 write tickets by default).',
    definition: 'WiredTiger uses an admission-control ticketing system to prevent thread thrashing and excessive context switching at the CPU level. By default, MongoDB configures 128 concurrent Read Tickets and 128 concurrent Write Tickets. Before an operation touches the storage engine, it must acquire a ticket; if none are available, operations queue.',
    eli5: 'Think of a nightclub with a strict capacity of 128 dancers and 128 staff. Even if 1,000 people are standing outside the door, the bouncer will not let person #129 in until someone leaves, preventing the dance floor from collapsing.',
    realWorldExample: {
      description: 'Checking available storage tickets during a traffic spike.',
      sampleDocuments: [
        {
          collection: 'serverStatus.wiredTiger.concurrentTransactions',
          doc: {
            write: { out: 12, available: 116, totalTickets: 128 },
            read: { out: 4, available: 124, totalTickets: 128 }
          }
        }
      ],
      explanation: 'If write.available reaches 0, incoming write requests queue up at the network layer, spiking query latency.'
    },
    syntaxSteps: [
      {
        step: 'Check available read and write tickets in mongosh',
        code: `const t = db.serverStatus().wiredTiger.concurrentTransactions;
print("Read tickets available: " + t.read.available + " / " + t.read.totalTickets);
print("Write tickets available: " + t.write.available + " / " + t.write.totalTickets);`,
        note: 'Available tickets dropping to 0 indicates severe database queueing.'
      }
    ],
    rulesTable: [
      {
        rule: 'Default Allocation',
        explanation: '128 concurrent read tickets and 128 concurrent write tickets.'
      },
      {
        rule: 'Ticket Exhaustion',
        explanation: 'When available tickets hit 0, new queries queue in the global lock queue, increasing connection counts.'
      }
    ],
    deepDive: {
      title: 'Ticket Queuing vs Slow Queries',
      description: 'A common misconception is that ticket exhaustion is caused by high traffic volume. In 90% of production incidents, ticket exhaustion is caused by a few unindexed slow queries (COLLSCAN) holding read tickets for 5 seconds each. Because each query hogs a ticket for seconds rather than milliseconds, the 128 available tickets vanish in less than a second.',
      codeSnippet: `// Adjust ticket limits dynamically in mongod (use caution):
db.adminCommand({
  setParameter: 1,
  wiredTigerConcurrentReadTransactions: 256,
  wiredTigerConcurrentWriteTransactions: 256
});`,
      warning: 'Increasing tickets on CPU-saturated machines exacerbates CPU context-switching overhead.'
    },
    advantages: [
      'Prevents catastrophic CPU collapse caused by thousands of concurrent threads thrashing execution contexts',
      'Protects storage engine internal data structures from mutex lock contention',
      'Provides a deterministic ceiling for active storage engine workloads'
    ],
    disadvantages: [
      'A single unindexed query scanning millions of rows can hold a ticket for seconds, starving all clients',
      'Ticket exhaustion cascades into client application connection pool exhaustion'
    ],
    interviewQuestions: [
      {
        question: 'Why does a slow, unindexed query cause WiredTiger ticket exhaustion for unrelated fast queries?',
        answer: 'Each storage engine operation must acquire a ticket before accessing data and holds it until the operation completes. A fast indexed query releases its ticket in 1ms, allowing thousands of queries per second. An unindexed query scanning a large table holds its ticket for seconds. If dozens of slow queries run concurrently, all 128 tickets are held, causing all incoming fast queries to queue indefinitely.'
      }
    ],
    interviewReadyAnswer: 'MongoDB limits concurrent WiredTiger operations using 128 read and 128 write tickets to prevent CPU context thrashing. If tickets are exhausted (available = 0), operations queue at the networking layer. Ticket exhaustion is almost always caused by slow unindexed queries holding tickets for extended durations.',
    quickTest: {
      question: 'What is the default number of concurrent write tickets configured in MongoDB WiredTiger?',
      options: [
        { key: 'A', text: '128' },
        { key: 'B', text: '1,000' },
        { key: 'C', text: '16' },
        { key: 'D', text: 'Unlimited' }
      ],
      correctAnswer: 'A',
      explanation: 'WiredTiger defaults to 128 concurrent read and 128 concurrent write tickets to prevent CPU context-switch degradation.'
    },
    mentalModel: 'Tickets are admission passes: fast queries use them and leave; slow queries hog them and cause lines outside.',
    codeSnippet: `// Check active queue length:
db.serverStatus().globalLock.currentQueue;`,
    takeaways: [
      'Default ticket allocation is 128 reads and 128 writes.',
      'Zero available tickets indicates operations are queueing.',
      'Kill slow unindexed queries to restore available tickets immediately.'
    ],
    commonPitfall: {
      mistake: 'Increasing ticket limits when tickets hit 0, worsening CPU cache thrashing.',
      fix: 'Find and index the slow queries holding the tickets instead of increasing ticket counts.'
    },
    prevTopicId: 'cache-eviction-workers',
    nextTopicId: 'mmapv1-vs-wiredtiger'
  },
  {
    id: 'mmapv1-vs-wiredtiger',
    topicNumber: 20,
    title: 'MMAPv1 vs WiredTiger: The Storage Architecture Evolution',
    category: 'wiredtiger',
    difficulty: 'Advanced',
    summary: 'Analyze the architectural leap from MongoDB\'s legacy MMAPv1 engine (database-level locking, uncompressed) to WiredTiger (document-level concurrency, compression).',
    definition: 'MMAPv1 was MongoDB\'s original storage engine, relying directly on the operating system\'s memory-mapped files (mmap system call) for memory management. In MongoDB 3.0, WiredTiger was introduced and became default in 3.2, replacing MMAPv1 with document-level concurrency, block compression, and true B-Tree cache reconciliation.',
    eli5: 'MMAPv1 was like letting the city council (the OS) manage your store\'s inventory: whenever someone bought an apple, the council locked the whole grocery store. WiredTiger is having your own professional in-house manager with specialized shelves and individual customer carts.',
    realWorldExample: {
      description: 'Contrasting concurrency between MMAPv1 and WiredTiger.',
      sampleDocuments: [
        {
          collection: 'engine_comparison',
          doc: {
            mmapv1: { concurrency: 'Database / Collection Level Locking', compression: 'None (Raw Disk Blocks)' },
            wiredTiger: { concurrency: 'Document Level Lock-Free Concurrency', compression: 'Snappy / zstd (up to 80% savings)' }
          }
        }
      ],
      explanation: 'WiredTiger delivered a 7-10x throughput increase on concurrent write workloads over MMAPv1.'
    },
    syntaxSteps: [
      {
        step: 'Verify active storage engine in mongod',
        code: `db.serverStatus().storageEngine;
// Returns { name: "wiredTiger", supportsCommittedReads: true, ... }`,
        note: 'MMAPv1 was completely deprecated and removed in MongoDB 4.2.'
      }
    ],
    rulesTable: [
      {
        rule: 'Locking Granularity',
        explanation: 'MMAPv1 used database/collection locking; WiredTiger uses document-level optimistic concurrency.'
      },
      {
        rule: 'Compression',
        explanation: 'MMAPv1 had zero compression; WiredTiger compresses collections and index prefixes.'
      },
      {
        rule: 'Memory Management',
        explanation: 'MMAPv1 delegated memory to the OS kernel; WiredTiger manages its own dedicated cache.'
      }
    ],
    deepDive: {
      title: 'Why Delegating Memory to the OS Failed at Scale',
      description: 'MMAPv1 simply called mmap() on data files and allowed the OS kernel\'s page replacement algorithm to decide what to evict. However, the OS kernel has zero semantic awareness of B-Tree structure or transaction dependencies. The OS frequently evicted hot root B-Tree index pages while keeping cold document pages, leading to catastrophic disk thrashing.',
      codeSnippet: `// WiredTiger engine configuration in modern mongod:
storage:
  engine: wiredTiger`,
      warning: 'Legacy MMAPv1 storage files cannot be directly booted by MongoDB 4.2+ binaries.'
    },
    advantages: [
      'Document-level concurrency allows thousands of concurrent writes to the same collection',
      'Built-in block compression cuts storage footprint by up to 80%',
      'Dedicated memory cache management prioritizes B-Tree index structures over cold raw data'
    ],
    disadvantages: [
      'Requires explicit cache configuration to avoid memory contention with external applications',
      'Increased CPU utilization compared to raw zero-overhead OS memory mapping'
    ],
    interviewQuestions: [
      {
        question: 'What were the two biggest architectural limitations of the legacy MMAPv1 engine that WiredTiger solved?',
        answer: '1. Coarse-grained locking: MMAPv1 locked the entire database or collection on writes, bottlenecking concurrent write workloads. WiredTiger introduced document-level concurrency. 2. Zero compression: MMAPv1 stored raw uncompressed BSON on disk. WiredTiger introduced Snappy/zstd block compression, slashing disk footprint by 60-80%.'
      }
    ],
    interviewReadyAnswer: 'MMAPv1 relied on OS memory mapping and suffered from collection-level locking and zero compression. WiredTiger introduced document-level concurrency, dedicated buffer cache management, and Snappy/zstd compression, yielding 7-10x higher write throughput and 70% storage reduction.',
    quickTest: {
      question: 'In which major version of MongoDB was the legacy MMAPv1 storage engine completely removed?',
      options: [
        { key: 'A', text: 'MongoDB 4.2' },
        { key: 'B', text: 'MongoDB 3.0' },
        { key: 'C', text: 'MongoDB 5.0' },
        { key: 'D', text: 'MongoDB 2.6' }
      ],
      correctAnswer: 'A',
      explanation: 'MongoDB 4.2 completely removed the deprecated MMAPv1 storage engine, making WiredTiger the sole standard engine.'
    },
    mentalModel: 'MMAPv1 was passive OS memory mapping; WiredTiger is an active, optimized relational-grade engine.',
    codeSnippet: `// Verify storage engine capabilities:
db.serverStatus().storageEngine.supportsCommittedReads;`,
    takeaways: [
      'WiredTiger introduced document-level concurrency and block compression.',
      'MMAPv1 was completely removed in MongoDB 4.2.',
      'WiredTiger manages its own cache rather than relying on OS page tables.'
    ],
    commonPitfall: {
      mistake: 'Assuming MongoDB still uses coarse collection-level locking on concurrent writes.',
      fix: 'Understand that WiredTiger supports full document-level lock-free concurrency.'
    },
    prevTopicId: 'read-write-tickets',
    nextTopicId: 'single-field-indexes'
  }
];
