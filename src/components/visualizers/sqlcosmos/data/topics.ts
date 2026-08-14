export interface SqlTopic {
  id: string;
  title: string;
  category: 'foundations' | 'indexing' | 'query-execution' | 'transactions' | 'architecture';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
}

export const SQL_TOPICS: SqlTopic[] = [
  {
    id: 'relational-model-sql-lifecycle',
    title: 'Relational Model & SQL Query Execution Lifecycle',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'The journey of a SQL query through the database engine: Parser (AST) -> Query Rewriter -> Cost-Based Optimizer -> Execution Engine -> Buffer Pool / Storage Engine.',
    mentalModel: 'The Flight Control Center: The passenger requests a destination (declarative SQL). Flight planners calculate fuel costs and wind speeds (Optimizer) before the pilot flies the optimal route (Execution Engine).',
    codeSnippet: `-- Declarative Query (Specify WHAT, not HOW):
SELECT u.name, COUNT(o.id) AS total_orders
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.name
HAVING COUNT(o.id) >= 5
ORDER BY total_orders DESC
LIMIT 10;`,
    takeaways: [
      'SQL is declarative: You describe the desired dataset, and the Cost-Based Optimizer (CBO) decides the physical access path.',
      'Logical Query Execution Order: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.',
      'Understanding execution order explains why column aliases in SELECT cannot be referenced inside the WHERE clause.'
    ],
    commonPitfall: {
      mistake: 'Using a SELECT alias in WHERE (e.g. SELECT (price * 1.2) AS total WHERE total > 100), causing syntax error.',
      fix: 'Repeat the expression in WHERE or wrap the query inside a CTE / Subquery.'
    },
    nextTopicId: 'btree-bplus-tree-indexes'
  },
  {
    id: 'btree-bplus-tree-indexes',
    title: 'B+ Tree Indexes & Leaf Page Traversals',
    category: 'indexing',
    difficulty: 'Intermediate',
    summary: 'B+ Trees are balanced multi-way search trees used by PostgreSQL, MySQL (InnoDB), and SQLite to provide O(log N) point lookups and efficient sequential range scans.',
    mentalModel: 'The Multi-Tier Library Directory: Wall signs point to corridors (Root), aisle signs point to bookshelves (Branch), and the bookshelf lists titles alphabetically with doubly linked bookmarks to adjacent shelves (Leaf pages).',
    codeSnippet: `-- Create B-Tree index:
CREATE INDEX idx_users_email ON users(email);

-- Point Lookup (O(log N)):
SELECT * FROM users WHERE email = 'alex@example.com';

-- Range Scan (Navigates to first leaf, then traverses linked list):
SELECT * FROM users WHERE created_at BETWEEN '2026-01-01' AND '2026-06-01';`,
    takeaways: [
      'All user data pointers reside strictly in Leaf pages; Internal Branch nodes only store routing search keys.',
      'Leaf pages are linked with bidirectional pointers (prev/next), making range queries (BETWEEN, >=) blazingly fast without re-traversing the root.',
      'Shallow height: A B+ Tree with order 100 and height 3 can index 1,000,000+ records in just 3 disk page reads.'
    ],
    commonPitfall: {
      mistake: 'Applying functions to indexed columns (e.g. WHERE LOWER(email) = "alex@test.com"), disabling the B+ Tree index.',
      fix: 'Create an expression index: CREATE INDEX idx_lower_email ON users(LOWER(email)).'
    },
    nextTopicId: 'clustered-vs-secondary-index'
  },
  {
    id: 'clustered-vs-secondary-index',
    title: 'Clustered vs Secondary Indexes (Heap Tables vs Index-Organized)',
    category: 'indexing',
    difficulty: 'Advanced',
    summary: 'In MySQL InnoDB, the Clustered Index (Primary Key) stores the entire row payload directly inside leaf nodes. Secondary indexes store the Primary Key value, requiring a secondary lookup (Bookmark Lookup).',
    mentalModel: 'The Physical Book vs Index: The Clustered Index is the book chapters printed in page order. Secondary indexes are the alphabetical index at the back pointing to page numbers.',
    codeSnippet: `-- MySQL InnoDB (Clustered on Primary Key):
-- PK Leaf = [id, name, email, created_at, ...]
-- Secondary Index idx_email Leaf = [email, id] (Requires PK lookup!)

-- PostgreSQL (Heap Table Architecture):
-- All indexes (PK and Secondary) point to (Block#, Offset#) tuple pointers in the Heap file.`,
    takeaways: [
      'In InnoDB, every table has exactly ONE Clustered Index (defaults to Primary Key).',
      'Covering Indexes: If a query selects only columns present in the secondary index, it avoids the secondary clustered index lookup (Index-Only Scan).',
      'Keep Primary Keys compact (e.g. BIGINT over UUIDv4) in InnoDB to minimize the size of all secondary index leaf pages.'
    ],
    commonPitfall: {
      mistake: 'Using random UUIDv4 as clustered primary keys in MySQL InnoDB, causing frequent B-Tree leaf page splits and severe write degradation.',
      fix: 'Use auto-incrementing BIGINT or time-ordered UUIDv7 for sequential clustered insertions.'
    },
    nextTopicId: 'composite-indexes-leftmost-prefix'
  },
  {
    id: 'composite-indexes-leftmost-prefix',
    title: 'Composite Indexes & The Leftmost Prefix Rule',
    category: 'indexing',
    difficulty: 'Intermediate',
    summary: 'A composite index on (A, B, C) can satisfy queries on (A), (A, B), and (A, B, C), but CANNOT be used efficiently for queries filtering only on (B) or (C).',
    mentalModel: 'The Phonebook Alphabetical Ordering: Phonebooks are sorted by (LastName, FirstName). You can instantly find "Smith, John", or all "Smiths", but searching for anyone with first name "John" requires reading the entire book cover to cover.',
    codeSnippet: `-- Composite Index definition:
CREATE INDEX idx_users_country_status_created 
ON users(country, status, created_at);

-- ✅ Uses full index:
SELECT * FROM users WHERE country = 'US' AND status = 'active' AND created_at > '2026-01-01';

-- ✅ Uses index on country:
SELECT * FROM users WHERE country = 'US';

-- ❌ CANNOT use index (Violates Leftmost Prefix):
SELECT * FROM users WHERE status = 'active';`,
    takeaways: [
      'The Leftmost Prefix Rule: Index columns must be filtered in order from left to right without gaps.',
      'Equality First, Range Last: Place equality columns first (country = "US") and range columns last (created_at > ...).',
      'A composite index on (A, B) eliminates the need for a separate index on (A).'
    ],
    commonPitfall: {
      mistake: 'Placing range filter columns before equality columns in composite index definition: ON (created_at, status).',
      fix: 'Order composite index columns with strict equality columns first: ON (status, created_at).'
    },
    nextTopicId: 'explain-analyze-query-plans'
  },
  {
    id: 'explain-analyze-query-plans',
    title: 'EXPLAIN ANALYZE & Query Execution Plans',
    category: 'query-execution',
    difficulty: 'Advanced',
    summary: 'EXPLAIN displays the optimizer estimated execution plan; EXPLAIN ANALYZE actually runs the query, reporting real wall-clock timing, row counts, and buffer page cache hits.',
    mentalModel: 'The Architect Blueprint vs Construction Inspection: EXPLAIN is the blueprint estimate (Estimated Cost); EXPLAIN ANALYZE is the inspector measuring the exact time and bricks used.',
    codeSnippet: `-- PostgreSQL Explain Plan:
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE user_id = 942 AND total > 100;

/* Output:
Index Scan using idx_orders_user_id on orders (cost=0.42..8.45 rows=2 width=32) (actual time=0.042..0.051 rows=2 loops=1)
  Index Cond: (user_id = 942)
  Filter: (total > 100.00)
  Buffers: shared hit=3
Planning Time: 0.120 ms
Execution Time: 0.082 ms
*/`,
    takeaways: [
      'Seq Scan: Full table scan reading every page from disk/memory sequentially.',
      'Index Scan: Traverses B-Tree, then fetches matching row tuples from the table heap.',
      'Index Only Scan: Satisfies the entire query directly from the index leaves without touching the table heap.',
      'Bitmap Index Scan: Combines multiple indexes via boolean AND/OR bitmaps before batching heap page reads.'
    ],
    commonPitfall: {
      mistake: 'Assuming low cost means an index will always be used on tiny tables with under 100 rows.',
      fix: 'Understand that optimizer chooses Seq Scan for small tables because reading 2 sequential disk pages is faster than random index lookups.'
    },
    nextTopicId: 'sql-joins-execution'
  },
  {
    id: 'sql-joins-execution',
    title: 'SQL Joins & Execution Algorithms (Nested Loop, Hash, Merge)',
    category: 'query-execution',
    difficulty: 'Advanced',
    summary: 'The query optimizer selects between three physical join strategies: Nested Loop Join (small/indexed), Hash Join (large unsorted equi-joins), and Merge Join (pre-sorted streams).',
    mentalModel: 'Finding Pairs at a Party: Nested Loop is asking every guest one-by-one; Hash Join is putting names into a hash bucket first then checking matches; Merge Join is lining up both groups alphabetically and stepping together.',
    codeSnippet: `-- 1. Nested Loop Join: Ideal when outer set is small and inner table has an index.
-- Complexity: O(N * log M)

-- 2. Hash Join: Builds in-memory hash table of smaller table, probes with larger.
-- Complexity: O(N + M)

-- 3. Merge Join: Steps through two sorted inputs in lockstep.
-- Complexity: O(N + M) if pre-sorted, or O(N log N + M log M) with sort step.`,
    takeaways: [
      'Nested Loop Join is preferred when joining a small dataset with a table that has an index on the join key.',
      'Hash Join excels at large ad-hoc joins without indexes (build phase creates hash table in work_mem, probe phase scans matching rows).',
      'Merge Join is fastest when both inputs are already sorted by indexes or ORDER BY clauses.'
    ],
    commonPitfall: {
      mistake: 'Joining on columns with mismatched data types (e.g. VARCHAR id joining INT id), preventing index usage and forcing slow Nested Loops.',
      fix: 'Ensure foreign keys and primary keys share exact matching data types.'
    },
    nextTopicId: 'acid-transactions'
  },
  {
    id: 'acid-transactions',
    title: 'ACID Properties & Write-Ahead Logging (WAL)',
    category: 'transactions',
    difficulty: 'Advanced',
    summary: 'ACID guarantees database reliability: Atomicity (All or Nothing), Consistency (Constraints preserved), Isolation (Concurrent transactions do not interfere), and Durability (Committed data survives crashes via WAL).',
    mentalModel: 'The Flight Reservation & Bank Transfer: Either both the bank debit and credit succeed (Atomicity), or the transaction rolls back completely with zero lost funds.',
    codeSnippet: `BEGIN TRANSACTION;

-- Deduct from Account A:
UPDATE accounts SET balance = balance - 500 WHERE id = 1 AND balance >= 500;

-- Credit Account B:
UPDATE accounts SET balance = balance + 500 WHERE id = 2;

-- Guarantee durability to disk:
COMMIT;`,
    takeaways: [
      'Write-Ahead Logging (WAL): Changes are written sequentially to the append-only WAL log on disk BEFORE dirty data pages are flushed to disk.',
      'Crash Recovery: Upon unexpected power cut, the database replays the WAL log (REDO) to reconstruct committed state and UNDO uncommitted transactions.',
      'Checkpointing periodically flushes dirty in-memory pages to disk, bounding recovery time on restart.'
    ],
    commonPitfall: {
      mistake: 'Disabling fsync in production for short-term write speed benchmarks, risking complete database corruption on server power loss.',
      fix: 'Keep synchronous_commit = on (or equivalent) for mission-critical financial databases.'
    },
    nextTopicId: 'transaction-isolation-levels'
  },
  {
    id: 'transaction-isolation-levels',
    title: 'Transaction Isolation Levels & Concurrency Anomalies',
    category: 'transactions',
    difficulty: 'Expert',
    summary: 'SQL standards define 4 isolation levels to prevent concurrency anomalies: Read Uncommitted, Read Committed, Repeatable Read, and Serializable.',
    mentalModel: 'The Soundproof Meeting Rooms: Read Uncommitted has glass walls with speakers; Serializable puts every transaction into a private locked vault one at a time.',
    codeSnippet: `-- Set transaction isolation level:
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Concurrency Anomalies Matrix:
-- 1. Dirty Read: Transaction reads uncommitted data written by another transaction.
-- 2. Non-Repeatable Read: Reading the same row twice yields different column values.
-- 3. Phantom Read: A range query executed twice returns new inserted rows.
-- 4. Serialization Anomaly / Write Skew: Concurrent transactions violate global business constraints.`,
    takeaways: [
      'Read Committed (PostgreSQL / Oracle default): Prevents Dirty Reads by taking a snapshot at each SQL statement.',
      'Repeatable Read (MySQL InnoDB default): Prevents Dirty and Non-Repeatable Reads by taking a snapshot at the start of the transaction.',
      'Serializable: Full mathematical equivalence to serial execution, using SSI (Serializable Snapshot Isolation) or 2PL.'
    ],
    commonPitfall: {
      mistake: 'Assuming Repeatable Read prevents Write Skew anomalies (e.g. two doctors simultaneously checking out of on-call duty, leaving 0 on-call).',
      fix: 'Use SERIALIZABLE isolation level or explicit SELECT FOR UPDATE row-level locking.'
    },
    nextTopicId: 'mvcc-multi-version-concurrency'
  },
  {
    id: 'mvcc-multi-version-concurrency',
    title: 'Multi-Version Concurrency Control (MVCC) & Vacuuming',
    category: 'transactions',
    difficulty: 'Expert',
    summary: 'MVCC allows readers not to block writers and writers not to block readers by storing multiple immutable versions of row tuples with creation (xmin) and deletion (xmax) transaction IDs.',
    mentalModel: 'The Document Version History: Instead of erasing text on paper with an eraser while someone is reading it, you print a new edition (version 2) with a timestamp stamp, leaving version 1 untouched for current readers.',
    codeSnippet: `-- PostgreSQL Row Header (Tuple Header):
-- t_xmin: Transaction ID that inserted this row version
-- t_xmax: Transaction ID that deleted/updated this row version

-- UPDATE user SET name = 'Bob' WHERE id = 1:
-- 1. Sets xmax = current_tx_id on old tuple (marking dead)
-- 2. Inserts new tuple with xmin = current_tx_id, xmax = 0

-- Table Bloat cleanup:
VACUUM (VERBOSE, ANALYZE) users;`,
    takeaways: [
      'Readers never wait for writers, and writers never wait for readers.',
      'Dead Tuples: Updated or deleted rows remain on disk until cleaned up by the background AutoVacuum daemon.',
      'Transaction ID Wraparound: PostgreSQL must vacuum older tables to freeze old 32-bit transaction IDs before reaching 2 billion transactions.'
    ],
    commonPitfall: {
      mistake: 'Holding open long-running idle transactions (e.g. idle in transaction for hours), preventing AutoVacuum from reclaiming dead tuples and causing massive table bloat.',
      fix: 'Set idle_in_transaction_session_timeout = 60000 (1 min) to automatically terminate abandoned connections.'
    },
    nextTopicId: 'window-functions'
  },
  {
    id: 'window-functions',
    title: 'Window Functions (ROW_NUMBER, RANK, OVER PARTITION)',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'Window functions perform calculations across a set of table rows related to the current row without collapsing them into a single row like GROUP BY does.',
    mentalModel: 'The Rolling Leaderboard: Every runner crosses the finish line and retains their individual bib number and name, while the digital screen calculates their rank and time gap relative to their specific age division.',
    codeSnippet: `-- Top 3 Highest Earners Per Department:
WITH RankedSalaries AS (
  SELECT 
    id,
    name,
    department,
    salary,
    DENSE_RANK() OVER (
      PARTITION BY department 
      ORDER BY salary DESC
    ) as rank_in_dept,
    AVG(salary) OVER (
      PARTITION BY department
    ) as dept_avg_salary
  FROM employees
)
SELECT * FROM RankedSalaries WHERE rank_in_dept <= 3;`,
    takeaways: [
      'ROW_NUMBER() assigns consecutive integers (1, 2, 3, 4).',
      'RANK() leaves gaps for ties (1, 2, 2, 4); DENSE_RANK() does not leave gaps (1, 2, 2, 3).',
      'LAG() and LEAD() fetch values from preceding or succeeding rows without self-joins (ideal for calculating month-over-month growth).'
    ],
    commonPitfall: {
      mistake: 'Trying to use window functions directly inside WHERE (e.g. WHERE ROW_NUMBER() = 1), causing a syntax error.',
      fix: 'Wrap the window function in a Common Table Expression (CTE) or subquery and filter outside.'
    }
  }
];
