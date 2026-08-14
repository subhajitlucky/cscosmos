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
    question: 'Why does B+ Tree preferred over standard Binary Search Trees (BST) or B-Trees for database indexes?',
    answer: '1. High Fanout (100+ keys per node) minimizes tree height to 3-4 levels, requiring only 3-4 disk I/O reads to find any record among millions. 2. Leaf pages are linked with bidirectional pointers for ultra-fast sequential range scans without re-traversing parent nodes. 3. Internal nodes do not store row data payloads, fitting vastly more keys per memory page.',
    code: `CREATE INDEX idx_users_created ON users(created_at);
-- Range scan traverses root -> leaf once, then walks leaf linked list:
SELECT * FROM users WHERE created_at >= '2026-01-01';`,
    tip: 'A B+ Tree with page size 8KB and 4 bytes per key can store over 100,000,000 index pointers at height 3.'
  },
  {
    id: 'sf-2',
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
    id: 'sf-3',
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
    id: 'sf-4',
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
    id: 'sf-5',
    category: 'Transactions & MVCC',
    difficulty: 'Staff',
    question: 'What is Write Skew anomaly and which isolation level prevents it?',
    answer: 'Write Skew occurs when two concurrent transactions read overlapping state, evaluate a business rule, and make disjoint updates that collectively violate the constraint (e.g. two doctors simultaneously requesting on-call duty leave when at least 1 must remain active). Repeatable Read does NOT prevent Write Skew; only SERIALIZABLE isolation or explicit SELECT FOR UPDATE locks prevent it.',
    code: `-- To prevent Write Skew in Repeatable Read:
SELECT * FROM doctors_on_call FOR UPDATE;
-- Locks rows, forcing concurrent transactions to serialize`,
    tip: 'PostgreSQL uses Serializable Snapshot Isolation (SSI), which detects dependency cycles (rw-antidependencies) without aggressive table-level locking.'
  }
];
