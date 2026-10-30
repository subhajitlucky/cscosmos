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
  }
];
