export interface SqlFlashcard {
  id: string;
  category: 'Indexing & Performance' | 'Query Execution' | 'Transactions & MVCC' | 'Architecture';
  question: string;
  answer: string;
  code?: string;
  tip: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
}

export const SQL_FLASHCARDS: SqlFlashcard[] = [
  {
    id: 'sf-1',
    category: 'Indexing & Performance',
    difficulty: 'Junior',
    question: 'Why are B+ Trees preferred over standard Binary Search Trees (BST) or B-Trees for database indexes?',
    answer: '1. High Fanout (100+ keys per node) minimizes tree height to 3-4 levels, requiring only 3-4 disk I/O reads to find any record among millions. 2. Leaf pages are linked with bidirectional pointers for ultra-fast sequential range scans without re-traversing parent nodes. 3. Internal nodes do not store row data payloads, fitting vastly more keys per memory page.',
    code: `CREATE INDEX idx_users_created ON users(created_at);
-- Range scan traverses root -> leaf once, then walks leaf linked list:
SELECT * FROM users WHERE created_at >= '2026-01-01';`,
    tip: 'A B+ Tree with page size 8KB and 4 bytes per key can store over 100,000,000 index pointers at height 3.'
  },
  {
    id: 'sf-2',
    category: 'Query Execution',
    difficulty: 'Junior',
    question: 'How does Three-Valued Logic handle NULL comparisons in WHERE clauses?',
    answer: 'In SQL, comparisons with NULL (e.g. col = NULL or col != NULL) evaluate to UNKNOWN, never TRUE or FALSE. A WHERE clause only retains rows where the predicate is strictly TRUE. Therefore, WHERE col = NULL returns zero rows. Always use IS NULL or IS NOT NULL.',
    code: `-- ❌ Bug: Always returns 0 rows!
SELECT * FROM users WHERE status = NULL;

-- ✅ Correct comparison:
SELECT * FROM users WHERE status IS NULL;`,
    tip: 'COALESCE(val, fallback) returns the first non-null argument and is essential for safe defaults.'
  },
  {
    id: 'sf-3',
    category: 'Query Execution',
    difficulty: 'Mid',
    question: 'What is the Leftmost Prefix Rule in Composite Indexes?',
    answer: 'A composite index on (A, B, C) can only accelerate queries that filter on columns starting from the leftmost column in sequence (e.g. A, or A+B, or A+B+C). Filtering on (B) or (C) alone cannot use the B+ Tree index because the search tree is ordered primarily by A.',
    code: `CREATE INDEX idx_users_comp ON users(country, status, score);
-- ✅ Uses Index: WHERE country = 'US' AND status = 'active'
-- ❌ Cannot Use Index: WHERE status = 'active'`,
    tip: 'Always order composite index columns: strict equality columns first, range columns last.'
  },
  {
    id: 'sf-4',
    category: 'Query Execution',
    difficulty: 'Junior',
    question: 'What is the difference between COUNT(*) and COUNT(column_name)?',
    answer: 'COUNT(*) counts every physical row returned by the query, regardless of whether columns contain NULL values. COUNT(column_name) counts only rows where the specified column is NOT NULL, ignoring rows with NULL in that column.',
    code: `-- Table: [{id: 1, val: 10}, {id: 2, val: NULL}]
SELECT COUNT(*), COUNT(val) FROM t;
-- Result: COUNT(*) = 2, COUNT(val) = 1`,
    tip: 'Use COUNT(*) unless you specifically need to count the presence of non-null values.'
  },
  {
    id: 'sf-5',
    category: 'Query Execution',
    difficulty: 'Mid',
    question: 'When should you use HAVING instead of WHERE?',
    answer: 'WHERE filters individual input rows BEFORE grouping and aggregation occur. HAVING filters aggregated summary rows AFTER the GROUP BY computation has completed. Aggregation functions like SUM(), AVG(), or COUNT() cannot be used in WHERE.',
    code: `SELECT dept, AVG(salary) 
FROM employees 
WHERE is_active = TRUE -- Row filter before grouping
GROUP BY dept 
HAVING AVG(salary) > 80000; -- Aggregate filter after grouping`,
    tip: 'Filtering in WHERE is faster because it reduces the number of rows the database must group and aggregate.'
  },
  {
    id: 'sf-6',
    category: 'Indexing & Performance',
    difficulty: 'Mid',
    question: 'What is a Clustered Index and how does it differ from a Secondary Index in MySQL InnoDB?',
    answer: 'In MySQL InnoDB, the Clustered Index (Primary Key) stores the entire row data payload directly inside the leaf nodes of the B+ Tree. Secondary indexes store only the index columns and the Primary Key value. Looking up a row via a secondary index requires a secondary B+ Tree traversal (Bookmark Lookup) into the clustered index.',
    code: `-- InnoDB Clustered Leaf: [id: 1, name: "Alice", email: "..."]
-- Secondary idx_email Leaf: [email: "alice@test.com", id: 1]`,
    tip: 'In PostgreSQL, all tables are Heap tables; all indexes are secondary and point to (block, offset) tuples in the heap.'
  },
  {
    id: 'sf-7',
    category: 'Query Execution',
    difficulty: 'Senior',
    question: 'What is the difference between Index Scan, Index Only Scan, and Bitmap Index Scan in EXPLAIN ANALYZE?',
    answer: '1. Index Scan: Reads B-Tree leaf, then fetches each matching row tuple from table heap. 2. Index Only Scan: Reads only the B-Tree index because all requested SELECT columns exist inside the index (Covering Index), skipping table heap entirely. 3. Bitmap Index Scan: Gathers matching physical page block IDs into an in-memory bitmap array and reads table heap pages sequentially in physical disk order.',
    code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT id, email FROM users WHERE email = 'test@example.com';
-- If index is on (email, id) -> Index Only Scan (Fastest!)`,
    tip: 'Index Only Scan can be 10x faster than standard Index Scan on large tables because it avoids random disk I/O to table heap pages.'
  },
  {
    id: 'sf-8',
    category: 'Query Execution',
    difficulty: 'Senior',
    question: 'How do Hash Join, Merge Join, and Nested Loop Join compare in query execution?',
    answer: '1. Nested Loop Join: Scans outer table and performs index lookups into inner table for each row (Best for small outer datasets with indexed inner table). 2. Hash Join: Builds in-memory hash table on the smaller relation, then streams the larger relation probing the hash table (Best for large unsorted equi-joins). 3. Merge Join: Traverses both inputs in lockstep (Best when both inputs are pre-sorted by index or ORDER BY).',
    code: `-- Nested Loop: O(N * log M)
-- Hash Join: O(N + M) (Requires work_mem memory)
-- Merge Join: O(N + M) (Requires pre-sorted streams)`,
    tip: 'If work_mem is too small, a Hash Join spills hash partitions to disk ("Batch: 2+"), drastically degrading performance.'
  },
  {
    id: 'sf-9',
    category: 'Query Execution',
    difficulty: 'Mid',
    question: 'What is the difference between RANK() and DENSE_RANK() in Window Functions?',
    answer: 'Both assign numeric rankings based on an ORDER BY clause. However, when ties occur, RANK() skips subsequent numbers leaving gaps (e.g. 1, 2, 2, 4), whereas DENSE_RANK() never skips numbers (e.g. 1, 2, 2, 3).',
    code: `SELECT name, score,
  RANK() OVER (ORDER BY score DESC) as r,
  DENSE_RANK() OVER (ORDER BY score DESC) as dr
FROM athletes;`,
    tip: 'ROW_NUMBER() always assigns strictly sequential numbers (1, 2, 3, 4) regardless of ties.'
  },
  {
    id: 'sf-10',
    category: 'Transactions & MVCC',
    difficulty: 'Senior',
    question: 'How does Multi-Version Concurrency Control (MVCC) in PostgreSQL prevent readers and writers from blocking each other?',
    answer: 'Instead of locking rows in place, UPDATE creates a new row tuple with the current transaction ID as xmin, and marks the old row tuple with xmax. Readers only see row versions where xmin is committed and xmax is either 0 or uncommitted, allowing readers to read old snapshots concurrently without blocking writes.',
    code: `-- Tuple Header: (xmin: 105, xmax: 0) -> Active
-- When TX 108 updates: old tuple becomes (xmin: 105, xmax: 108)
-- New tuple inserted: (xmin: 108, xmax: 0)`,
    tip: 'AutoVacuum periodically sweeps through pages to reclaim space from dead tuples (rows where xmax is older than the oldest running transaction).'
  },
  {
    id: 'sf-11',
    category: 'Transactions & MVCC',
    difficulty: 'Senior',
    question: 'What is the role of Write-Ahead Logging (WAL) in database crash recovery?',
    answer: 'Under ACID durability, all database modifications must be recorded in an append-only WAL log sequentially on non-volatile disk BEFORE dirty table pages are flushed from RAM to disk. If the server crashes or loses power, the engine replays WAL records (REDO) to reconstruct committed transactions and rolls back (UNDO) uncommitted ones.',
    code: `BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- Written sequentially to WAL buffer and fsynced on COMMIT:
COMMIT;`,
    tip: 'Sequential writes to WAL are orders of magnitude faster than random I/O writes to scattered B-Tree and Heap disk pages.'
  },
  {
    id: 'sf-12',
    category: 'Transactions & MVCC',
    difficulty: 'Staff',
    question: 'What is Write Skew anomaly and which isolation level prevents it?',
    answer: 'Write Skew occurs when two concurrent transactions read overlapping state, evaluate a business rule, and make disjoint updates that collectively violate the constraint (e.g. two doctors simultaneously requesting on-call duty leave when at least 1 must remain active). Repeatable Read does NOT prevent Write Skew; only SERIALIZABLE isolation or explicit SELECT FOR UPDATE locks prevent it.',
    code: `-- To prevent Write Skew in Repeatable Read:
SELECT * FROM doctors_on_call FOR UPDATE;
-- Locks rows, forcing concurrent transactions to serialize`,
    tip: 'PostgreSQL uses Serializable Snapshot Isolation (SSI), which detects dependency cycles (rw-antidependencies) without aggressive table-level locking.'
  },
  {
    id: 'sf-13',
    category: 'Transactions & MVCC',
    difficulty: 'Senior',
    question: 'How do you build a lock-free distributed background job queue in PostgreSQL?',
    answer: 'Use SELECT FOR UPDATE SKIP LOCKED. When multiple worker threads query for pending jobs concurrently, SKIP LOCKED skips any rows currently locked by other workers rather than waiting in a queue. Each worker atomically locks and claims distinct jobs with zero lock contention.',
    code: `BEGIN;
SELECT id, payload 
FROM jobs 
WHERE status = 'pending' 
ORDER BY priority DESC 
LIMIT 1 
FOR UPDATE SKIP LOCKED;

UPDATE jobs SET status = 'processing' WHERE id = :job_id;
COMMIT;`,
    tip: 'SKIP LOCKED eliminates the need for external queue brokers like Redis or SQS for modest background worker throughput.'
  },
  {
    id: 'sf-14',
    category: 'Indexing & Performance',
    difficulty: 'Senior',
    question: 'What is a BRIN index and when is it superior to a B+ Tree index?',
    answer: 'A Block Range Index (BRIN) stores only the minimum and maximum values for physical ranges of disk pages (typically 128 pages). For massive append-only tables (like audit logs or metrics) naturally sorted by timestamp, a BRIN index is 99% smaller than a B-Tree (megabytes instead of gigabytes) and fits entirely in RAM.',
    code: `CREATE INDEX idx_logs_brin ON audit_logs USING BRIN (created_at);
-- B-Tree size: 10 GB
-- BRIN size: 25 MB!`,
    tip: 'BRIN relies on physical disk correlation. It is useless for randomized data or tables with frequent random updates.'
  },
  {
    id: 'sf-15',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'What is Boyce-Codd Normal Form (BCNF) and how does it relate to 3NF?',
    answer: 'A relation is in BCNF if for every non-trivial functional dependency (X -> Y), X is a superkey (candidate key). BCNF is a stricter version of 3NF. While 3NF permits Y to be a prime attribute (part of a candidate key), BCNF requires the determinant X itself to be a candidate key, eliminating all redundancy from overlapping composite keys.',
    code: `-- If (Student, Subject) -> Teacher, and Teacher -> Subject:
-- 3NF allows this (Subject is prime attribute).
-- BCNF forbids this because Teacher is not a candidate key!`,
    tip: 'In practice, reaching 3NF/BCNF prevents insertion and deletion anomalies at the expense of requiring more JOINs.'
  },
  {
    id: 'sf-16',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'What is the difference between a View and a Materialized View?',
    answer: 'A standard View is merely a saved SQL query alias; the underlying query is executed fresh every time the view is referenced. A Materialized View executes the query once and physically writes the resulting rows to disk as a concrete table, allowing indexing and instant analytical queries at the expense of requiring periodic refresh.',
    code: `-- Create physical snapshot:
CREATE MATERIALIZED VIEW mv_monthly_revenue AS
SELECT DATE_TRUNC('month', order_date), SUM(total) FROM orders GROUP BY 1;

-- Refresh without blocking reads (requires unique index):
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_revenue;`,
    tip: 'Always create a UNIQUE INDEX on a Materialized View so you can refresh it with CONCURRENTLY.'
  },
  {
    id: 'sf-17',
    category: 'Architecture',
    difficulty: 'Staff',
    question: 'What is Partition Pruning in database table partitioning?',
    answer: 'Partition Pruning is an optimizer technique where the query planner analyzes WHERE clause conditions and completely eliminates irrelevant physical partition tables from the query execution plan. For example, querying a table partitioned by year for date "2026-03-01" will read only the 2026 partition on disk, skipping 2020-2025.',
    code: `-- Table partitioned by RANGE (created_at):
EXPLAIN SELECT * FROM transactions 
WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31';
-- Plan shows: Seq Scan on transactions_2026_q1 (other partitions excluded!)`,
    tip: 'Partition keys MUST be included in any Primary Key or UNIQUE constraints on the partitioned table.'
  },
  {
    id: 'sf-18',
    category: 'Transactions & MVCC',
    difficulty: 'Staff',
    question: 'How do you prevent and resolve database Deadlocks?',
    answer: 'A deadlock occurs when two transactions wait on locks held by each other in a cyclic dependency. The database engine resolves deadlocks by running a background cycle-detection algorithm on the Wait-For graph and forcibly aborting the transaction with the fewest changes. Prevention: Always acquire row and table locks in a strict, deterministic order (e.g. sorted by primary key ID).',
    code: `-- Safe multi-row locking pattern:
BEGIN;
SELECT * FROM accounts 
WHERE id IN (42, 108) 
ORDER BY id ASC -- Strict ascending order prevents deadlocks!
FOR UPDATE;
UPDATE accounts SET ...;
COMMIT;`,
    tip: 'Set deadlock_timeout (e.g. 1s) to control how quickly PostgreSQL initiates cycle detection on blocked transactions.'
  },
  {
    id: 'sf-19',
    category: 'Indexing & Performance',
    difficulty: 'Mid',
    question: 'What is a Partial Index, and why is it superior to indexing an entire table column?',
    answer: 'A Partial Index (filtered index) indexes only rows that satisfy a specified WHERE predicate. This reduces index file size on disk by up to 99%, minimizes buffer cache footprint, speeds up INSERT and UPDATE operations for rows outside the condition, and directly accelerates queries filtering on common status flags.',
    code: `CREATE INDEX idx_unprocessed_orders ON orders (created_at) 
WHERE status = 'unprocessed';
-- Only indexes pending rows, ignoring millions of completed orders!`,
    tip: 'If 99% of table rows are completed and only 1% are pending, a partial index is 99% smaller and faster than a full index.'
  },
  {
    id: 'sf-20',
    category: 'Indexing & Performance',
    difficulty: 'Senior',
    question: 'Why does WHERE LOWER(email) = "..." ignore a standard B-tree index on email, and how does an Expression Index fix it?',
    answer: 'Standard B-Trees index the raw column value, not the output of functions applied to it. The query planner cannot inverse function evaluations at runtime to traverse the B-Tree. An Expression (Functional) Index precomputes and indexes the deterministic function result, enabling index seeks on evaluated expressions.',
    code: `-- ❌ Cannot use standard index on email:
SELECT * FROM users WHERE LOWER(email) = 'alice@example.com';

-- ✅ Create Functional / Expression Index:
CREATE INDEX idx_users_lower_email ON users (LOWER(email));`,
    tip: 'Functions used in expression indexes must be IMMUTABLE. Volatile functions like NOW() or RANDOM() cannot be indexed.'
  },
  {
    id: 'sf-21',
    category: 'Indexing & Performance',
    difficulty: 'Senior',
    question: 'How does a GIN (Generalized Inverted Index) work internally, and when should it be used instead of a B+ Tree?',
    answer: 'While B+ Trees map one column value to one or more row pointers, a GIN index breaks composite attributes (such as JSONB keys/values, arrays, or tsvector text tokens) into individual elements and maps each element to a posting list of matching tuple IDs. It is optimal for array containment (@>), JSONB path queries, and full-text search.',
    code: `CREATE INDEX idx_events_payload ON events USING GIN (payload jsonb_path_ops);
-- Ultra-fast JSON containment check:
SELECT * FROM events WHERE payload @> '{"env": "production", "status": "failed"}';`,
    tip: 'GIN lookups are extremely fast for containment, but writes are slower than B-Trees because a single row update updates multiple posting lists.'
  },
  {
    id: 'sf-22',
    category: 'Query Execution',
    difficulty: 'Senior',
    question: 'Why does OFFSET 1000000 LIMIT 20 cause severe database degradation, and how does Keyset (Cursor) Pagination solve it?',
    answer: 'OFFSET N requires the database engine to physically scan and discard the first N rows from disk and memory before returning the requested batch (O(N) execution time). Keyset (Cursor-based) Pagination filters directly on indexed sequential columns (e.g. WHERE (created_at, id) < (:cursor_time, :cursor_id)), seeking directly to the target B+ Tree leaf page in O(log N) time.',
    code: `-- ❌ O(N) scan: Reads 1,000,020 rows and discards 1,000,000:
SELECT * FROM activity_feed ORDER BY id DESC OFFSET 1000000 LIMIT 20;

-- ✅ O(log N) seek: Jumps straight to cursor via index:
SELECT * FROM activity_feed WHERE id < :last_seen_id ORDER BY id DESC LIMIT 20;`,
    tip: 'Never expose raw integer OFFSET in high-scale public APIs; encode composite cursors as opaque base64 tokens.'
  },
  {
    id: 'sf-23',
    category: 'Transactions & MVCC',
    difficulty: 'Mid',
    question: 'What does each property in the ACID acronym specifically guarantee in a relational database?',
    answer: 'Atomicity: All operations in a transaction succeed completely or roll back entirely ("all or nothing"). Consistency: State transitions strictly obey all defined schema constraints, foreign keys, and rules. Isolation: Concurrent transactions execute without observing intermediate, uncommitted states of others. Durability: Once committed, state changes survive power outages, crashes, and server restarts.',
    code: `BEGIN;
UPDATE accounts SET balance = balance - 250 WHERE id = 1;
UPDATE accounts SET balance = balance + 250 WHERE id = 2;
COMMIT; -- Atomic, Isolated, Durable across crashes`,
    tip: 'Durability requires non-volatile disk write barriers (fsync) to ensure WAL buffers are flushed from OS memory.'
  },
  {
    id: 'sf-24',
    category: 'Transactions & MVCC',
    difficulty: 'Senior',
    question: 'What are the 4 ANSI SQL isolation levels, and what anomalies can occur in each?',
    answer: '1. Read Uncommitted: Permits Dirty Reads, Non-Repeatable Reads, and Phantoms. 2. Read Committed: Eliminates Dirty Reads; permits Non-Repeatable Reads and Phantoms. 3. Repeatable Read: Eliminates Dirty and Non-Repeatable Reads; permits Phantoms (and Write Skew). 4. Serializable: Eliminates all anomalies, guaranteeing transactions execute equivalent to a strict serial schedule.',
    code: `SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- Guarantees repeated SELECT queries within this transaction observe an identical snapshot`,
    tip: 'PostgreSQL does not implement Read Uncommitted; specifying it automatically defaults to Read Committed.'
  },
  {
    id: 'sf-25',
    category: 'Query Execution',
    difficulty: 'Mid',
    question: 'What is the fundamental difference between UNION and UNION ALL, and why is UNION ALL preferred when deduplication is unnecessary?',
    answer: 'UNION combines datasets and performs an expensive sort or hash-based deduplication step across all columns to eliminate duplicate tuples (O(N log N) or hash table memory). UNION ALL concatenates streams directly without deduplication (O(N) streaming cost), consuming zero extra memory and negligible CPU.',
    code: `-- ❌ Incurs sort / hash deduplication overhead:
SELECT user_id FROM orders UNION SELECT user_id FROM refunds;

-- ✅ Fast streaming row concatenation:
SELECT user_id FROM orders UNION ALL SELECT user_id FROM refunds;`,
    tip: 'Always default to UNION ALL unless business requirements explicitly necessitate eliminating duplicates.'
  },
  {
    id: 'sf-26',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'Why is a dedicated connection pooler like PgBouncer or HikariCP essential for PostgreSQL at scale?',
    answer: 'PostgreSQL uses a process-per-connection architecture where each client connection forks a dedicated OS backend process consuming 5-10MB of private RAM, catalog caches, and lock structures. 1,000 idle connections waste gigabytes of RAM and cause severe OS context-switching overhead. A connection pooler multiplexes thousands of incoming client connections over 20-50 active PostgreSQL worker backends.',
    code: `# pgbouncer.ini configuration:
pool_mode = transaction
max_client_conn = 5000
default_pool_size = 30`,
    tip: 'In transaction pooling mode, prepared statements and temporary tables cannot be shared across queries without named pool configs.'
  },
  {
    id: 'sf-27',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'What is database sharding, and how do Range-Based Sharding and Hash-Based Sharding compare?',
    answer: 'Sharding horizontally partitions rows across multiple autonomous physical database nodes. Range-Based Sharding partitions by key ranges (e.g. IDs 1-1M to Shard 1); it simplifies range queries but creates extreme write hot spots on the latest shard. Hash-Based Sharding distributes rows uniformly using a hash function (hash(id) % shards), eliminating hot spots at the cost of requiring cross-shard scatter-gather queries for range scans.',
    code: `-- Routing pseudo-code:
shard_id = murmur3(tenant_id) % total_shards;
-- Range queries across multiple tenants require broadcasting to all shards`,
    tip: 'Consistent hashing with virtual vnodes minimizes data migration when expanding or contracting shard clusters.'
  },
  {
    id: 'sf-28',
    category: 'Indexing & Performance',
    difficulty: 'Senior',
    question: 'What causes Table Bloat in PostgreSQL, and how do standard VACUUM and VACUUM FULL differ?',
    answer: 'When rows are updated or deleted, MVCC leaves dead tuples in 8 KB disk pages. If dead tuples accumulate faster than AutoVacuum purges them, pages become sparse, wasting disk and buffer cache. Standard VACUUM marks dead space as reusable for future INSERTs without blocking reads or writes, but does NOT shrink the physical file on disk. VACUUM FULL rewrites the entire table into a new file, reclaiming disk space, but holds an ACCESS EXCLUSIVE lock blocking all queries.',
    code: `-- Non-blocking maintenance (reclaims space for new writes):
VACUUM (VERBOSE, ANALYZE) users;

-- Reclaims OS disk space (Warning: exclusive table lock):
VACUUM FULL users;`,
    tip: 'For zero-downtime table repacking without table-level locking in production, use pg_repack.'
  },
  {
    id: 'sf-29',
    category: 'Query Execution',
    difficulty: 'Senior',
    question: 'Why are Correlated Subqueries frequently slow, and how does the query planner optimize Common Table Expressions (CTEs)?',
    answer: 'A correlated subquery references columns from the outer query, conceptually re-evaluating the inner query once for every single row returned by the outer query (O(N x M) nested loop). Modern query planners often flatten subqueries into JOINs. In PostgreSQL 12+, CTEs are inlined by default into the main query plan unless marked MATERIALIZED, which enforces an optimization barrier.',
    code: `-- ❌ Naive correlated subquery:
SELECT name, (SELECT MAX(total) FROM orders WHERE user_id = u.id) FROM users u;

-- ✅ Equi-join with GROUP BY (hash joinable):
SELECT u.name, MAX(o.total) FROM users u 
LEFT JOIN orders o ON o.user_id = u.id GROUP BY u.id, u.name;`,
    tip: 'Use WITH data AS MATERIALIZED (...) only when you deliberately want to prevent the optimizer from pushing predicates into the CTE.'
  },
  {
    id: 'sf-30',
    category: 'Transactions & MVCC',
    difficulty: 'Staff',
    question: 'How does Two-Phase Commit (2PC) guarantee atomicity across distributed databases, and what is its primary failure mode?',
    answer: 'Phase 1 (Prepare): The coordinator asks participants if they can commit. Each node writes undo/redo logs, acquires locks, and votes PREPARED or ABORT. Phase 2 (Commit): If all agree, coordinator command participants to COMMIT; if any abort, all ROLLBACK. Failure Mode: If coordinator crashes after Phase 1, participants are left in doubt, holding exclusive locks indefinitely (blocking availability) until coordinator recovery.',
    code: `-- PostgreSQL distributed transaction syntax:
PREPARE TRANSACTION 'tx_transfer_901';
-- Participant locks remain held across connection drops until:
COMMIT PREPARED 'tx_transfer_901';`,
    tip: 'Modern microservice architectures favor the asynchronous Saga Pattern with compensating transactions over synchronous 2PC.'
  },
  {
    id: 'sf-31',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'What causes Replication Lag in primary-replica setups, and how can applications avoid Read-Your-Own-Writes staleness?',
    answer: 'Asynchronous replication transmits WAL logs from the primary to replicas over the network. Under heavy write traffic or long-running replica queries, the replica replay worker falls behind. A user who updates their profile and immediately reads from a replica sees stale data. Solutions: 1. Route writes and immediate post-write reads to the Primary. 2. Compare WAL Log Sequence Numbers (LSN) with pg_last_wal_replay_lsn() before serving reads.',
    code: `-- Check lag in bytes on replica:
SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), pg_last_wal_replay_lsn()) AS lag_bytes;`,
    tip: 'Sticky Primary pattern: Route all user reads to the primary database for 5-10 seconds after that user submits a mutation.'
  },
  {
    id: 'sf-32',
    category: 'Transactions & MVCC',
    difficulty: 'Mid',
    question: 'What is the difference between Optimistic Concurrency Control (OCC) and Pessimistic Concurrency Control (PCC)?',
    answer: 'Pessimistic Locking assumes conflicts are frequent and explicitly locks records upfront (SELECT FOR UPDATE), forcing concurrent transactions to queue. Optimistic Locking assumes conflicts are rare; it reads records without locks alongside an integer version column. On update, it checks WHERE id = :id AND version = :read_version. If another transaction modified the row, the update affects 0 rows, prompting an application retry.',
    code: `-- Optimistic Concurrency Control update:
UPDATE inventory 
SET stock = stock - 1, version = version + 1 
WHERE id = 42 AND version = 5;
-- Application checks: if rows_affected == 0, conflict detected -> retry!`,
    tip: 'Use OCC for high-read, low-contention web applications; use PCC for intense hot-spot inventory counters or balance transfers.'
  },
  {
    id: 'sf-33',
    category: 'Indexing & Performance',
    difficulty: 'Junior',
    question: 'Does creating a FOREIGN KEY constraint automatically create an index on the referencing column?',
    answer: 'No! Relational databases (PostgreSQL, MySQL, Oracle) automatically create unique B-Tree indexes for PRIMARY KEY and UNIQUE constraints, but they do NOT index FOREIGN KEY columns. Without a secondary index on the foreign key column, parent-child JOINs perform sequential scans, and deleting/updating a parent row locks the entire child table during referential integrity checks.',
    code: `ALTER TABLE orders ADD CONSTRAINT fk_orders_user 
FOREIGN KEY (user_id) REFERENCES users(id);

-- ⚠️ Essential manual step:
CREATE INDEX idx_orders_user_id ON orders(user_id);`,
    tip: 'Unindexed foreign keys are one of the most common causes of unexpected table-level locking deadlocks during parent record deletions.'
  },
  {
    id: 'sf-34',
    category: 'Query Execution',
    difficulty: 'Staff',
    question: 'How does the Cost-Based Optimizer estimate query execution costs, and what happens when table statistics are stale?',
    answer: 'The CBO calculates plan costs using estimated disk page I/O (seq_page_cost, random_page_cost) and CPU cycles (cpu_tuple_cost). It derives row selectivity from statistics gathered by ANALYZE (stored in pg_statistic), including null fractions, distinct values, Most Common Values (MCV) lists, and equi-depth histograms. Stale statistics cause catastrophic plan miscalculations, such as choosing a Nested Loop over millions of rows instead of a Hash Join.',
    code: `-- Refresh statistics on high-churn tables:
ANALYZE VERBOSE orders;

-- Inspect MCV and histograms:
SELECT tablename, attname, null_frac, n_distinct, most_common_vals 
FROM pg_stats WHERE tablename = 'orders';`,
    tip: 'On large skewed tables, increase the statistics target (ALTER TABLE orders ALTER COLUMN status SET STATISTICS 500;) for finer histograms.'
  },
  {
    id: 'sf-35',
    category: 'Architecture',
    difficulty: 'Mid',
    question: 'When should you use a Surrogate Key (UUID, BIGSERIAL) versus a Natural Key (ISO Code, Tax ID)?',
    answer: 'A Natural Key is a real-world attribute that is inherently unique (e.g. ISO currency code "USD"). It saves space and eliminates joins, but introduces severe risk if business requirements change or data entry errors occur. A Surrogate Key (BIGSERIAL or UUID) has no external business meaning and is strictly immutable. Best practice: Use an immutable surrogate primary key internally, and enforce a UNIQUE constraint on natural business attributes.',
    code: `CREATE TABLE countries (
  id BIGSERIAL PRIMARY KEY,           -- Immutable Surrogate Key
  iso_code CHAR(2) NOT NULL UNIQUE,   -- Natural Key with Unique Constraint
  name TEXT NOT NULL
);`,
    tip: 'Avoid random UUIDv4 as primary keys in clustered B-Trees (like InnoDB); use monotonically increasing UUIDv7 to prevent page splits.'
  },
  {
    id: 'sf-36',
    category: 'Indexing & Performance',
    difficulty: 'Senior',
    question: 'What is a GiST (Generalized Search Tree) index, and why is it required for geospatial and range queries?',
    answer: 'B+ Trees can only index data with a strict linear total order (<, =, >). GiST is a balanced tree framework that indexes multidimensional hierarchical objects using bounding boxes (R-Trees). It enables index-accelerated spatial queries like proximity searches (ST_DWithin), polygon overlaps (&&), and calendar range intersections (tsrange && tsrange).',
    code: `CREATE INDEX idx_locations_geom ON places USING GIST (geom);
-- Fast bounding box intersection search:
SELECT * FROM places WHERE geom && ST_MakeEnvelope(10, 20, 15, 25, 4326);`,
    tip: 'GiST internal nodes are lossy bounding boxes; PostgreSQL automatically runs a final exact recheck filter on matching heap tuples.'
  },
  {
    id: 'sf-37',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'How does PostgreSQL TOAST (The Oversized-Attribute Storage Technique) handle rows exceeding the 8 KB page limit?',
    answer: 'PostgreSQL pages are fixed at 8 KB. When a row exceeds the target threshold (~2 KB), TOAST: 1. Compresses variable-length columns (LZ4 or pglz). 2. If still oversized, moves column data out-of-line into a separate hidden TOAST table, chunking it into 2 KB segments and storing an 18-byte pointer in the original heap tuple.',
    code: `-- Check compression and storage strategy:
SELECT attname, attstorage, attcompression 
FROM pg_attribute 
WHERE attrelid = 'documents'::regclass AND attnum > 0;
-- 'x' = extended (compress + toast), 'p' = plain (no toast)`,
    tip: 'SELECT * on tables with large TOASTed columns incurs extra disk seeks to the TOAST table; project only the columns you need.'
  },
  {
    id: 'sf-38',
    category: 'Query Execution',
    difficulty: 'Junior',
    question: 'How do EXISTS and IN differ when querying subqueries, particularly regarding NULL values?',
    answer: '1. Short-circuiting: EXISTS evaluates as a boolean and halts scanning the moment it encounters the first matching row (LIMIT 1 behavior). 2. NULL Trap: NOT IN (subquery) returns zero rows if the subquery contains even a single NULL value, because comparisons against NULL evaluate to UNKNOWN. In contrast, NOT EXISTS handles NULLs safely without dropping result sets.',
    code: `-- ❌ Bug hazard if orders.user_id has any NULL values:
SELECT * FROM users WHERE id NOT IN (SELECT user_id FROM orders);

-- ✅ Safe and fast anti-join:
SELECT * FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);`,
    tip: 'Modern query planners rewrite EXISTS and IN into semi-joins, but NOT EXISTS is vastly safer than NOT IN due to three-valued logic.'
  },
  {
    id: 'sf-39',
    category: 'Transactions & MVCC',
    difficulty: 'Senior',
    question: 'What is the exact distinction between a Non-Repeatable Read and a Phantom Read?',
    answer: 'A Non-Repeatable Read occurs when Transaction A reads an existing row, Transaction B updates or deletes that row and commits, and Transaction A re-reads the row finding modified values. A Phantom Read occurs when Transaction A reads a range of rows matching a predicate, Transaction B inserts a new row matching that predicate and commits, and Transaction A re-runs the range query finding "phantom" rows that did not exist previously.',
    code: `-- Transaction A:
SELECT COUNT(*) FROM users WHERE age >= 21; -- Returns 10
-- Transaction B: INSERT INTO users (age) VALUES (25); COMMIT;
-- Transaction A re-reads:
SELECT COUNT(*) FROM users WHERE age >= 21; -- Returns 11 (Phantom row!)`,
    tip: 'Repeatable Read in PostgreSQL prevents both Non-Repeatable Reads AND Phantom Reads via snapshot isolation.'
  },
  {
    id: 'sf-40',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'How does Synchronous Replication compare with Asynchronous Replication in terms of RPO, RTO, and commit latency?',
    answer: 'Asynchronous Replication confirms commits immediately after local WAL writes; replicas pull changes in the background. It delivers minimal commit latency, but risks data loss (RPO > 0) if the primary crashes before replicas sync. Synchronous Replication blocks commit confirmation until at least one replica confirms WAL receipt and flush. It guarantees Zero Data Loss (RPO = 0), but increases client write latency by network RTT and halts writes if all replicas fail.',
    code: `-- postgresql.conf synchronous configuration:
synchronous_commit = 'on'
synchronous_standby_names = 'FIRST 1 (standby_node1, standby_node2)'`,
    tip: 'Financial ledgers require synchronous replication; high-throughput analytics and social media rely on asynchronous replication.'
  },
  {
    id: 'sf-41',
    category: 'Indexing & Performance',
    difficulty: 'Staff',
    question: 'Where and how are Bloom Filters utilized inside database engines?',
    answer: 'A Bloom Filter is a space-efficient probabilistic data structure that tests set membership with zero false negatives and tunable false positives. Databases use Bloom Filters in two core areas: 1. Hash Joins: Builds a bit array from the build relation; probe-side rows are filtered against the bit array before probing the main hash table, eliminating non-matching probes. 2. LSM engines (RocksDB, Cassandra): Checks if an on-disk SSTable contains a key before triggering disk I/O.',
    code: `-- EXPLAIN plan snippet in distributed/OLAP engines:
->  Parallel Hash Join
    Hash Cond: (orders.user_id = users.id)
    ->  Parallel Seq Scan on orders
        Filter: (bloom_filter_check(user_id))`,
    tip: 'In PostgreSQL, the bloom extension provides multi-column bloom indexes for queries with arbitrary combinations of filter predicates.'
  },
  {
    id: 'sf-42',
    category: 'Query Execution',
    difficulty: 'Senior',
    question: 'In SQL Window Functions, how do ROWS BETWEEN and RANGE BETWEEN fundamentally differ?',
    answer: 'ROWS specifies a physical offset count of rows relative to the current row (e.g. ROWS BETWEEN 2 PRECEDING AND CURRENT ROW covers strictly 3 physical rows). RANGE evaluates the logical value of the ORDER BY expression, including all peer rows with identical sort values (or temporal date offsets like RANGE BETWEEN INTERVAL "7 days" PRECEDING AND CURRENT ROW).',
    code: `-- Moving 3-transaction average:
AVG(amount) OVER (
  ORDER BY transaction_time 
  ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
)

-- 7-day cumulative spend:
SUM(amount) OVER (
  ORDER BY created_date 
  RANGE BETWEEN INTERVAL '7 days' PRECEDING AND CURRENT ROW
)`,
    tip: 'Omitting the frame defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which can cause performance penalties due to peer deduplication.'
  },
  {
    id: 'sf-43',
    category: 'Architecture',
    difficulty: 'Staff',
    question: 'Why are Columnar Storage Engines (ClickHouse, DuckDB) orders of magnitude faster than Row Stores (Postgres) for analytics?',
    answer: 'Row stores store all columns of a tuple contiguously on disk ([id, name, email, amount]). To compute SUM(amount) across 100M rows, a row store must load all unneeded columns into RAM. Column stores store each column in isolated contiguous blocks ([amount, amount, ...]), reading ONLY the queried column from disk, enabling SIMD vectorization, Run-Length Encoding, and 10x higher compression.',
    code: `-- OLTP (Postgres): Instant point lookups:
SELECT * FROM users WHERE id = 12345;

-- OLAP (ClickHouse/DuckDB): 100x faster for aggregation:
SELECT status, SUM(revenue), AVG(duration) FROM events GROUP BY status;`,
    tip: 'Never run heavy ad-hoc analytics on primary OLTP databases; stream data via Change Data Capture (CDC) into columnar warehouses.'
  },
  {
    id: 'sf-44',
    category: 'Transactions & MVCC',
    difficulty: 'Senior',
    question: 'What is Two-Phase Locking (2PL), and why do database engines implement Strict 2PL (SS2PL)?',
    answer: '2PL guarantees serializability by dividing locking into two phases: 1. Growing Phase: Locks acquired, none released. 2. Shrinking Phase: Locks released, none acquired. Standard 2PL permits Cascading Aborts (if T1 releases a lock early and later aborts, T2 which read the data must also abort). Strict 2PL mandates that all exclusive write locks must be held until the very end of the transaction (COMMIT/ROLLBACK), eliminating cascading aborts.',
    code: `-- Strict 2PL timeline:
BEGIN;
LOCK A; LOCK B; -- Growing Phase
-- Updates executed...
COMMIT;         -- All locks released simultaneously at commit!`,
    tip: 'Strict 2PL is the primary concurrency control mechanism powering pessimistic transaction engines.'
  },
  {
    id: 'sf-45',
    category: 'Query Execution',
    difficulty: 'Senior',
    question: 'What is a LATERAL join in SQL, and what common problem does it solve?',
    answer: 'Standard subqueries in a FROM clause cannot reference columns from preceding tables in the same FROM list. A LATERAL join operates like a correlated for-each loop in SQL, allowing an inline subquery or set-returning function to reference columns provided by previous tables. It is ideal for "Top N per category" queries.',
    code: `-- Find the top 2 latest orders for every customer:
SELECT c.name, o.id, o.total, o.created_at
FROM customers c
CROSS JOIN LATERAL (
  SELECT id, total, created_at 
  FROM orders 
  WHERE customer_id = c.id 
  ORDER BY created_at DESC 
  LIMIT 2
) o;`,
    tip: 'Lateral joins combined with a composite index on orders(customer_id, created_at DESC) achieve blazing fast index-nested-loop scans.'
  },
  {
    id: 'sf-46',
    category: 'Indexing & Performance',
    difficulty: 'Senior',
    question: 'What is HOT (Heap-Only Tuple) optimization in PostgreSQL, and how does fillfactor enable it?',
    answer: 'Normally, updating a row updates its heap tuple AND every index on the table, causing index bloat. HOT optimization allows PostgreSQL to place the updated tuple inside the exact same physical 8 KB page as the old tuple if no indexed columns changed. The old tuple points directly to the new tuple via an intra-page pointer without touching B-Tree indexes! Setting fillfactor (e.g. 80 instead of 100) reserves 20% free space per page for future HOT updates.',
    code: `-- Configure 80% fillfactor on write-heavy table:
ALTER TABLE active_sessions SET (fillfactor = 80);
VACUUM FULL active_sessions; -- Rebuilds pages with reserved headroom`,
    tip: 'Check HOT update ratio using SELECT n_tup_upd, n_tup_hot_upd FROM pg_stat_user_tables;'
  },
  {
    id: 'sf-47',
    category: 'Transactions & MVCC',
    difficulty: 'Staff',
    question: 'What is Transaction ID (XID) wraparound, and what disaster occurs if PostgreSQL fails to prevent it?',
    answer: 'PostgreSQL uses a 32-bit unsigned integer for Transaction IDs (xmin/xmax), providing ~4.29 billion IDs. Because MVCC uses circular modular arithmetic to compare whether a transaction is past or future, reaching 2 billion transactions without maintenance causes old transactions to appear in the "future", rendering historic rows invisible! To prevent data loss, AutoVacuum runs "vacuum freeze", marking old tuples with FrozenTransactionId (older than all transactions).',
    code: `-- Check how close database is to autovacuum_freeze_max_age:
SELECT datname, age(datfrozenxid) 
FROM pg_database 
ORDER BY age(datfrozenxid) DESC;`,
    tip: 'If a database reaches the emergency wraparound threshold, PostgreSQL shuts down and refuses connections until vacuumed in single-user mode.'
  },
  {
    id: 'sf-48',
    category: 'Query Execution',
    difficulty: 'Junior',
    question: 'How do NULLIF and COALESCE function, and how do you prevent Division by Zero in SQL?',
    answer: 'COALESCE(val1, val2, ...) returns the first non-NULL expression from left to right. NULLIF(a, b) returns NULL if a equals b, otherwise returns a. To prevent runtime "division by zero" errors that abort transactions, wrap the denominator in NULLIF(denominator, 0). Any number divided by NULL safely returns NULL instead of throwing an exception.',
    code: `-- ❌ Crashes transaction when total_count = 0:
SELECT success_count / total_count FROM metrics;

-- ✅ Safe division by zero handling:
SELECT success_count / NULLIF(total_count, 0) FROM metrics;`,
    tip: 'Combining COALESCE(success_count / NULLIF(total_count, 0), 0) guarantees a safe numeric fallback of 0.'
  },
  {
    id: 'sf-49',
    category: 'Architecture',
    difficulty: 'Senior',
    question: 'Why is Log-Based Change Data Capture (CDC) preferred over SQL triggers or polling for streaming database changes?',
    answer: '1. Zero Database Overhead: Triggers double write I/O and hold transaction locks inside the critical path. Polling WHERE updated_at > last_sync misses hard deletes and hammers the primary database. 2. Log-Based CDC (Debezium) reads changes asynchronously from the transaction write-ahead log (WAL/binlog). It captures 100% of INSERTs, UPDATEs, and DELETEs with sub-millisecond latency, zero application locks, and zero extra load on the query engine.',
    code: `-- PostgreSQL logical replication identity required for CDC:
ALTER TABLE orders REPLICA IDENTITY FULL;
-- Replication slot reads WAL stream directly:
CREATE PUBLICATION cdc_publication FOR TABLE orders, users;`,
    tip: 'CDC guarantees exact ordering of changes matching the physical transaction commit order.'
  },
  {
    id: 'sf-50',
    category: 'Architecture',
    difficulty: 'Staff',
    question: 'How do you add a NOT NULL column with a default value to a 100-million-row table without downtime?',
    answer: 'In older PostgreSQL versions, ALTER TABLE ADD COLUMN NOT NULL DEFAULT rewrote the entire table while holding an ACCESS EXCLUSIVE lock, taking services down for hours. Safe Zero-Downtime Migration Pattern: 1. Add column with DEFAULT (instant metadata update in PG 11+). 2. Add CHECK (column IS NOT NULL) NOT VALID (instant lock). 3. Run ALTER TABLE VALIDATE CONSTRAINT (holds only SHARE UPDATE EXCLUSIVE lock, validates existing rows without blocking concurrent reads or writes).',
    code: `-- Step 1: Instant metadata addition:
ALTER TABLE users ADD COLUMN tier TEXT DEFAULT 'free';

-- Step 2: Non-blocking constraint validation:
ALTER TABLE users ADD CONSTRAINT check_tier_not_null CHECK (tier IS NOT NULL) NOT VALID;
ALTER TABLE users VALIDATE CONSTRAINT check_tier_not_null;`,
    tip: 'Always set SET lock_timeout = "2s"; before running any DDL in production to prevent queueing locks that block application traffic.'
  }
];
