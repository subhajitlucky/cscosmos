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
  // ==========================================
  // LEVEL 1: FOUNDATIONS & DDL/DML BASICS
  // ==========================================
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
    nextTopicId: 'ddl-tables-data-types'
  },
  {
    id: 'ddl-tables-data-types',
    title: 'DDL: Tables, Schemas & Native Data Types',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Data Definition Language (DDL) creates, alters, and manages relational structures. Choosing the right physical data types directly impacts page storage density and memory buffer utilization.',
    mentalModel: 'Architectural Blueprint & Container Sizes: Selecting BIGINT vs SMALLINT or VARCHAR vs CHAR is like choosing shipping containers—oversized containers waste 80% of ship cargo capacity (disk and buffer pool RAM).',
    codeSnippet: `-- Create optimized relational table:
CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  uuid UUID NOT NULL DEFAULT gen_random_uuid(),
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  profile JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ
);

-- Alter table non-destructively:
ALTER TABLE users ADD COLUMN last_login_at TIMESTAMPTZ;`,
    takeaways: [
      'Use NUMERIC / DECIMAL for financial balances to prevent IEEE-754 floating-point rounding errors (e.g. 0.1 + 0.2 != 0.3).',
      'Prefer TIMESTAMPTZ (timestamp with timezone) to store UTC instants and handle daylight saving conversions cleanly.',
      'BIGINT primary keys allow 9 quintillion IDs, avoiding the disastrous 2.14 billion overflow crash of 32-bit INT.'
    ],
    commonPitfall: {
      mistake: 'Using FLOAT or DOUBLE to store monetary amounts, causing silent pennies-rounding drift in accounting balances.',
      fix: 'Always use NUMERIC(12, 2) or integer cents (e.g. 1000 = $10.00).'
    },
    nextTopicId: 'data-integrity-constraints'
  },
  {
    id: 'data-integrity-constraints',
    title: 'Data Integrity: Constraints & Foreign Key Cascades',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Constraints are engine-level invariants that guarantee data consistency. Foreign keys enforce referential integrity across relational entities with deterministic cascading actions.',
    mentalModel: 'The Airport Security Checkpoint: A boarding pass is strictly verified against passenger ID before entry. You cannot check in luggage (Child row) for a non-existent passenger (Parent row).',
    codeSnippet: `-- Enforcing relational integrity constraints:
CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Foreign Key with Cascade Rule:
  CONSTRAINT fk_orders_user
    FOREIGN KEY (user_id) 
    REFERENCES users(id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE,
    
  -- Domain validation rules:
  CONSTRAINT chk_positive_total CHECK (total >= 0.00),
  CONSTRAINT chk_order_status CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled'))
);`,
    takeaways: [
      'ON DELETE RESTRICT / NO ACTION prevents deleting a parent row while active child records exist.',
      'ON DELETE CASCADE automatically purges child records when the parent is deleted (use cautiously for audit safety).',
      'CHECK constraints run validator expressions at write time, eliminating illegal states before storage.',
      'FOREIGN KEY columns must always be indexed to prevent full table scans when the parent table is updated/deleted.'
    ],
    commonPitfall: {
      mistake: 'Forgetting to index foreign key columns (orders.user_id), causing table-level lock escalation or full table scans whenever parent users are modified.',
      fix: 'CREATE INDEX idx_orders_user_id ON orders(user_id);'
    },
    nextTopicId: 'dml-crud-upserts'
  },
  {
    id: 'dml-crud-upserts',
    title: 'DML Core: CRUD Operations & Atomic Upserts',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Data Manipulation Language (DML) manages data mutation: INSERT, UPDATE, DELETE, and atomic UPSERT (INSERT ON CONFLICT / ON DUPLICATE KEY UPDATE) to eliminate race conditions.',
    mentalModel: 'The Hotel Keycard Locker: If locker #42 is empty, place the luggage inside. If already occupied, replace or update the access code in one atomic lock step without opening the locker twice.',
    codeSnippet: `-- 1. Insert multiple rows efficiently:
INSERT INTO products (sku, name, price, stock)
VALUES 
  ('A101', 'Ergonomic Desk', 399.00, 15),
  ('A102', 'Office Chair', 199.00, 40);

-- 2. Atomic UPSERT (Idempotent write in PostgreSQL):
INSERT INTO user_preferences (user_id, theme, email_notifications)
VALUES (42, 'dark', TRUE)
ON CONFLICT (user_id) 
DO UPDATE SET 
  theme = EXCLUDED.theme,
  updated_at = NOW();

-- 3. Safe deletion with RETURNING:
DELETE FROM expired_tokens 
WHERE expires_at < NOW() 
RETURNING id, user_id;`,
    takeaways: [
      'UPSERT eliminates the race condition of "SELECT then INSERT", preventing duplicate key errors under concurrent traffic.',
      'EXCLUDED table reference in PostgreSQL represents the pending row that conflicted with the existing record.',
      'Always use transactions and WHERE clauses when executing UPDATE and DELETE to prevent catastrophic table wipes.'
    ],
    commonPitfall: {
      mistake: 'Running UPDATE without a WHERE clause in production, overwriting every single record in the table.',
      fix: 'Always test updates with a preceding SELECT, or set sql_safe_updates = 1.'
    },
    nextTopicId: 'where-null-three-valued-logic'
  },
  {
    id: 'where-null-three-valued-logic',
    title: 'Filtering, Predicates & Three-Valued Logic (NULLs)',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'SQL operates on Kleene Three-Valued Logic (TRUE, FALSE, UNKNOWN). NULL represents the absence of a value; comparisons with NULL evaluate to UNKNOWN, requiring specialized operators like IS NULL and COALESCE.',
    mentalModel: 'The Sealed Mystery Box: If Box A contains a mystery item (NULL) and Box B contains a mystery item (NULL), you cannot say they are equal! Therefore NULL = NULL is UNKNOWN (falsy in WHERE).',
    codeSnippet: `-- ❌ BUG: Returns ZERO rows even if age IS NULL!
SELECT * FROM users WHERE age = NULL;

-- ✅ Correct NULL comparison:
SELECT * FROM users WHERE age IS NULL;

-- 🛡️ Handling NULLs with COALESCE:
SELECT 
  name, 
  COALESCE(phone, 'No Phone Provided') AS contact_phone,
  COALESCE(discount, 0.0) AS discount_applied
FROM customers;

-- Three-Valued Logic with NOT IN Gotcha:
-- If subquery contains even ONE NULL, NOT IN evaluates to UNKNOWN for all rows!
SELECT * FROM users 
WHERE id NOT IN (SELECT manager_id FROM departments WHERE manager_id IS NOT NULL);`,
    takeaways: [
      'In SQL, NULL is neither equal to nor not-equal to anything—even another NULL. Always use IS NULL or IS NOT NULL.',
      'WHERE clauses only retain rows whose predicate evaluates strictly to TRUE. UNKNOWN is discarded just like FALSE.',
      'NOT IN with a NULL in the subquery returns zero rows. Always use NOT EXISTS instead of NOT IN for nullable columns.'
    ],
    commonPitfall: {
      mistake: 'Using WHERE col NOT IN (SELECT nullable_col FROM ...) which silently returns zero rows if any subquery row has a NULL.',
      fix: 'Use WHERE NOT EXISTS (SELECT 1 FROM ... WHERE ...) which handles NULLs safely.'
    },
    nextTopicId: 'aggregations-group-by-having'
  },
  {
    id: 'aggregations-group-by-having',
    title: 'Aggregations & Grouping (GROUP BY & HAVING)',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'Aggregate functions summarize multi-row sets into summary values. GROUP BY segments rows into distinct buckets; HAVING filters aggregate buckets after calculation, whereas WHERE filters before.',
    mentalModel: 'The Warehouse Sorter: First, throw away damaged boxes (WHERE). Then stack remaining boxes onto pallets by destination country (GROUP BY). Finally, only load pallets that weigh over 500kg onto the cargo plane (HAVING).',
    codeSnippet: `-- Multi-Column Aggregation with Filtered Groups:
SELECT 
  department_id,
  role,
  COUNT(*) AS total_employees,
  COUNT(bonus) AS employees_with_bonus, -- Ignores NULLs!
  ROUND(AVG(salary), 2) AS avg_salary,
  MAX(salary) AS top_salary
FROM employees
WHERE is_active = TRUE -- Evaluated BEFORE grouping
GROUP BY department_id, role
HAVING AVG(salary) > 85000 AND COUNT(*) >= 3 -- Evaluated AFTER grouping
ORDER BY avg_salary DESC;`,
    takeaways: [
      'COUNT(*) counts total physical rows including NULLs; COUNT(column_name) ignores rows where that column is NULL.',
      'WHERE filters input rows before aggregation; HAVING filters output summary rows after grouping.',
      'Every column in the SELECT list that is not inside an aggregate function MUST be present in the GROUP BY clause.'
    ],
    commonPitfall: {
      mistake: 'Putting aggregate conditions into WHERE (e.g. WHERE COUNT(orders.id) > 5), which produces a fatal SQL compilation error.',
      fix: 'Move aggregate conditions to the HAVING clause: HAVING COUNT(orders.id) > 5.'
    },
    nextTopicId: 'set-operations-union-intersect-except'
  },
  {
    id: 'set-operations-union-intersect-except',
    title: 'Set Operations: UNION, INTERSECT & EXCEPT',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'Set operators combine the results of two or more independent SELECT queries into a unified result set based on mathematical set theory: Union, Intersection, and Difference.',
    mentalModel: 'Venn Diagram Operations: UNION combines both circles; UNION ALL stacks both lists without removing duplicates; INTERSECT is the overlapping center; EXCEPT is circle A with circle B carved out.',
    codeSnippet: `-- 1. UNION ALL (Fastest, preserves duplicates):
SELECT id, email, 'employee' AS source FROM employees
UNION ALL
SELECT id, email, 'contractor' AS source FROM contractors;

-- 2. UNION (Deduplicates via expensive sort/hash):
SELECT country FROM customers
UNION
SELECT country FROM suppliers;

-- 3. INTERSECT (Common records present in BOTH queries):
SELECT user_id FROM active_web_users
INTERSECT
SELECT user_id FROM active_mobile_users;

-- 4. EXCEPT / MINUS (Records in A but NOT in B):
SELECT customer_id FROM all_registered_customers
EXCEPT
SELECT customer_id FROM customers_with_orders;`,
    takeaways: [
      'UNION ALL is significantly faster than UNION because it skips the memory-intensive sort/hash deduplication pass.',
      'All queries combined by set operations must have matching column counts and compatible data types.',
      'EXCEPT is a clean, relational alternative to LEFT JOIN ... WHERE right_table.id IS NULL for finding non-matching records.'
    ],
    commonPitfall: {
      mistake: 'Using UNION by default when duplicate rows either do not exist or do not matter, wasting massive CPU/RAM sorting datasets.',
      fix: 'Default to UNION ALL unless unique deduplication is strictly required.'
    },
    nextTopicId: 'subqueries-correlated-exists'
  },

  // ==========================================
  // LEVEL 2: QUERY EXECUTION & ADVANCED QUERIES
  // ==========================================
  {
    id: 'subqueries-correlated-exists',
    title: 'Subqueries & Correlated Subqueries (EXISTS vs IN)',
    category: 'query-execution',
    difficulty: 'Intermediate',
    summary: 'Subqueries are nested SELECT statements. Non-correlated subqueries execute once; correlated subqueries reference outer query columns, evaluating dynamically per row unless rewritten by the optimizer.',
    mentalModel: 'The Detective Calling the Database: A regular subquery prints a static suspects list once. A correlated subquery calls headquarters for every individual pedestrian to verify their specific passport number.',
    codeSnippet: `-- 1. Non-Correlated Scalar Subquery:
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- 2. Correlated Subquery with EXISTS (Optimal Short-Circuit):
SELECT c.id, c.name, c.email
FROM customers c
WHERE EXISTS (
  SELECT 1 
  FROM orders o 
  WHERE o.customer_id = c.id 
    AND o.created_at >= NOW() - INTERVAL '30 days'
);

-- 3. Correlated Subquery in SELECT (Caution: O(N) execution):
SELECT 
  p.name,
  (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id) AS review_count
FROM products p;`,
    takeaways: [
      'EXISTS short-circuits on the very first matching row found; it does not read the entire inner table.',
      'Modern Cost-Based Optimizers often decorrelate subqueries into SEMI-JOINs or ANTI-JOINs for hash table execution.',
      'SELECT EXISTS(...) is safer and faster than IN(...) when querying large datasets with nullable foreign keys.'
    ],
    commonPitfall: {
      mistake: 'Using correlated subqueries inside SELECT (e.g. SELECT u.*, (SELECT ...) FROM users u) on large tables, causing N+1 query performance disasters.',
      fix: 'Rewrite as an outer JOIN with GROUP BY, or use a window function.'
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
-- Complexity: O(N + M) if pre-sorted, or O(N log N + M log M) with sort step.

SELECT u.name, o.total, o.created_at
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.country = 'US';`,
    takeaways: [
      'Nested Loop Join is preferred when joining a small dataset with a table that has an index on the join key.',
      'Hash Join excels at large ad-hoc joins without indexes (build phase creates hash table in work_mem, probe phase scans matching rows).',
      'Merge Join is fastest when both inputs are already sorted by indexes or ORDER BY clauses.'
    ],
    commonPitfall: {
      mistake: 'Joining on columns with mismatched data types (e.g. VARCHAR id joining INT id), preventing index usage and forcing slow Nested Loops.',
      fix: 'Ensure foreign keys and primary keys share exact matching data types.'
    },
    nextTopicId: 'window-functions'
  },
  {
    id: 'window-functions',
    title: 'Window Functions (ROW_NUMBER, RANK, OVER PARTITION)',
    category: 'query-execution',
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
    },
    nextTopicId: 'common-table-expressions-recursive'
  },
  {
    id: 'common-table-expressions-recursive',
    title: 'Common Table Expressions (CTEs) & Recursive Hierarchies',
    category: 'query-execution',
    difficulty: 'Advanced',
    summary: 'Common Table Expressions (WITH syntax) define named temporary result sets for the duration of a query. WITH RECURSIVE enables traversing graph and tree structures like org charts and category trees.',
    mentalModel: 'The Recipe Prep Bowls: Instead of mixing 10 raw ingredients simultaneously in one pan, you chop vegetables in Bowl 1, simmer sauce in Bowl 2, and then combine them cleanly in the final dish.',
    codeSnippet: `-- WITH RECURSIVE: Traversing an Employee Org Chart
WITH RECURSIVE OrgChart AS (
  -- 1. Anchor / Base Case: Top-Level CEO
  SELECT id, name, manager_id, 1 AS depth, CAST(name AS TEXT) AS path
  FROM employees
  WHERE manager_id IS NULL
  
  UNION ALL
  
  -- 2. Recursive Step: Direct Reports of people in OrgChart
  SELECT e.id, e.name, e.manager_id, o.depth + 1, o.path || ' -> ' || e.name
  FROM employees e
  JOIN OrgChart o ON e.manager_id = o.id
)
SELECT depth, path FROM OrgChart ORDER BY depth, path;`,
    takeaways: [
      'Non-recursive CTEs break monstrous 200-line queries into readable, self-documenting modular blocks.',
      'In PostgreSQL 12+, non-recursive CTEs are inlined by default unless marked WITH ... AS MATERIALIZED.',
      'Always ensure recursive CTEs include a terminating condition or cycle detection to prevent infinite loops.'
    ],
    commonPitfall: {
      mistake: 'Running recursive queries on data containing cyclical parent-child loops without cycle detection, causing server out-of-memory crashes.',
      fix: 'Use PostgreSQL CYCLE clause (CYCLE id SET is_cycle USING path) or maintain an array of visited IDs.'
    },
    nextTopicId: 'btree-bplus-tree-indexes'
  },

  // ==========================================
  // LEVEL 3: INDEXING & PHYSICAL STORAGE ENGINE
  // ==========================================
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
    nextTopicId: 'specialized-indexes-gin-gist-brin-partial'
  },
  {
    id: 'specialized-indexes-gin-gist-brin-partial',
    title: 'Specialized Indexes: GIN, GiST, BRIN & Partial Indexes',
    category: 'indexing',
    difficulty: 'Advanced',
    summary: 'Beyond standard B-Trees, modern databases provide specialized indexing structures: GIN for JSONB and full-text search, GiST for geometric coordinates, BRIN for massive time-series tables, and Partial Indexes for filtered sets.',
    mentalModel: 'Specialized Multi-Tools: A B-Tree is a standard screwdriver. GIN is a book index of every word; BRIN is a catalog of minimum/maximum temperatures per shelf, taking 1% of the storage space.',
    codeSnippet: `-- 1. GIN (Generalized Inverted Index) for JSONB containment:
CREATE INDEX idx_users_profile_gin ON users USING GIN (profile);
SELECT * FROM users WHERE profile @> '{"role": "admin", "verified": true}';

-- 2. Partial / Filtered Index (Saves 95% space):
CREATE INDEX idx_unprocessed_jobs ON job_queue (created_at)
WHERE status = 'pending'; -- Ignores millions of completed jobs!

-- 3. BRIN (Block Range Index) for huge 100M+ row append-only logs:
CREATE INDEX idx_logs_created_brin ON audit_logs USING BRIN (created_at);

-- 4. Covering Index (Index-Only Scan with payload columns):
CREATE INDEX idx_users_lookup ON users(email) INCLUDE (first_name, role);`,
    takeaways: [
      'Partial indexes index only rows matching a WHERE condition, dramatically reducing index disk usage and maintenance cost.',
      'GIN indexes map elements (words, array items, JSON keys) to lists of row IDs, powering fast @> searches.',
      'BRIN indexes store only min/max values for physical page ranges, reducing index size by 99% on sorted time-series tables.',
      'Covering indexes (INCLUDE clause) enable Index-Only Scans without bloating the B-Tree search keys.'
    ],
    commonPitfall: {
      mistake: 'Creating full B-Tree indexes on large tables where 98% of rows have status = "archived", wasting gigabytes of RAM.',
      fix: 'Use a partial index: CREATE INDEX idx_active_orders ON orders(created_at) WHERE status = "active";'
    },
    nextTopicId: 'explain-analyze-query-plans'
  },

  // ==========================================
  // LEVEL 4: QUERY OPTIMIZATION & TRANSACTIONS
  // ==========================================
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
    nextTopicId: 'locking-select-for-update-deadlocks'
  },
  {
    id: 'locking-select-for-update-deadlocks',
    title: 'Locking, SELECT FOR UPDATE & Deadlock Resolution',
    category: 'transactions',
    difficulty: 'Expert',
    summary: 'When concurrent transactions must serialize access to critical resources, row-level pessimistic locking (SELECT FOR UPDATE) prevents lost updates. Deadlocks occur when circular wait conditions form.',
    mentalModel: 'The Two Revolving Doors: Transaction A holds Door 1 and waits for Door 2; Transaction B holds Door 2 and waits for Door 1. Neither can move until the security guard (Deadlock Detector) forcibly aborts one.',
    codeSnippet: `-- 1. Pessimistic Row Lock (Blocks concurrent updates until COMMIT):
BEGIN;
SELECT balance FROM bank_accounts WHERE id = 101 FOR UPDATE;
UPDATE bank_accounts SET balance = balance - 100 WHERE id = 101;
COMMIT;

-- 2. Non-blocking High-Throughput Job Queue:
BEGIN;
SELECT id, payload 
FROM background_jobs 
WHERE status = 'pending' 
ORDER BY priority DESC 
LIMIT 1 
FOR UPDATE SKIP LOCKED; -- Ignores rows locked by other workers!

UPDATE background_jobs SET status = 'processing' WHERE id = ...;
COMMIT;`,
    takeaways: [
      'SELECT FOR UPDATE acquires an exclusive row lock, preventing race conditions during read-modify-write workflows.',
      'SKIP LOCKED skips rows currently locked by other workers, enabling lock-free distributed background queues directly in SQL.',
      'Deadlocks are resolved by the engine aborting the least costly transaction with a deadlock error.',
      'Prevent deadlocks by always acquiring multiple row locks in strict primary key numerical order.'
    ],
    commonPitfall: {
      mistake: 'Locking rows in inconsistent order (Tx1 updates Account 1 then 2; Tx2 updates Account 2 then 1), guaranteeing deadlocks under load.',
      fix: 'Always sort lock requests by primary key: SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE.'
    },
    nextTopicId: 'database-normalization-bcnf'
  },

  // ==========================================
  // LEVEL 5: DATABASE ARCHITECTURE & SCHEMA DESIGN
  // ==========================================
  {
    id: 'database-normalization-bcnf',
    title: 'Database Normalization (1NF to BCNF) vs Denormalization',
    category: 'architecture',
    difficulty: 'Advanced',
    summary: 'Normalization systematically organizes relational tables to eliminate insertion, update, and deletion anomalies. BCNF ensures every determinant is a candidate key. Denormalization trades write simplicity for read speed.',
    mentalModel: 'The Modular Wardrobe: Storing socks in the sock drawer and shirts in the closet (Normalized) prevents losing socks. Tossing everything into a mixed suitcase (Denormalized) is faster for a quick trip, but duplicate clothes get ruined.',
    codeSnippet: `-- Unnormalized Table (Anomalies galore!):
-- orders_flat(order_id, user_id, user_email, user_address, product_id, product_name, price)

-- Normalized to 3NF / BCNF:
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  address TEXT NOT NULL
);

CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  current_price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE order_items (
  order_id BIGINT REFERENCES orders(id),
  product_id BIGINT REFERENCES products(id),
  unit_price NUMERIC(10, 2) NOT NULL, -- Historical price snapshot!
  quantity INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);`,
    takeaways: [
      '1NF: Atomic values (no CSV arrays in columns) and unique primary key.',
      '2NF: 1NF + no partial dependency on a composite key (non-key columns depend on whole key).',
      '3NF: 2NF + no transitive dependencies (non-key column must not depend on another non-key column).',
      'BCNF (Boyce-Codd): A stricter version of 3NF where every functional determinant must be a candidate key.',
      'Denormalize strategically for high-throughput read paths (e.g. caching total_reviews count on products table).'
    ],
    commonPitfall: {
      mistake: 'Storing comma-separated IDs inside a VARCHAR column (e.g. tag_ids = "1,4,9"), breaking 1NF and preventing index lookups.',
      fix: 'Create a junction table: user_tags (user_id, tag_id) with foreign key constraints.'
    },
    nextTopicId: 'views-materialized-views'
  },
  {
    id: 'views-materialized-views',
    title: 'Views, Materialized Views & Zero-Downtime Refresh',
    category: 'architecture',
    difficulty: 'Advanced',
    summary: 'Standard Views are stored SQL query shortcuts recomputed on every execution. Materialized Views persist query results physically to disk, enabling sub-millisecond analytical dashboards with concurrent background refresh.',
    mentalModel: 'Live Cooking vs Buffet Warming Tray: A standard View cooks the meal from scratch every time a customer orders (Slow, 100% fresh). A Materialized View keeps prepared dishes in warming trays, replacing the tray periodically (Instant serving).',
    codeSnippet: `-- 1. Standard Virtual View (Executed dynamically on read):
CREATE VIEW v_active_premium_users AS
SELECT id, name, email, plan, created_at
FROM users
WHERE status = 'active' AND plan = 'enterprise';

-- 2. Materialized View (Physical snapshot stored on disk):
CREATE MATERIALIZED VIEW mv_daily_revenue_summary AS
SELECT 
  DATE_TRUNC('day', created_at) AS sale_date,
  product_category,
  COUNT(id) AS total_orders,
  SUM(total) AS gross_revenue
FROM orders
GROUP BY 1, 2;

-- Create Unique Index to enable Concurrent Refresh:
CREATE UNIQUE INDEX idx_mv_daily_revenue 
ON mv_daily_revenue_summary(sale_date, product_category);

-- 3. Non-blocking Zero-Downtime Refresh:
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_revenue_summary;`,
    takeaways: [
      'Standard Views provide security abstraction and code reusability without occupying disk storage.',
      'Materialized Views cache complex multi-table aggregations, serving analytics in sub-milliseconds.',
      'REFRESH MATERIALIZED VIEW CONCURRENTLY uses a unique index and diff log, allowing readers to query the view during updates without table locks.'
    ],
    commonPitfall: {
      mistake: 'Running REFRESH MATERIALIZED VIEW without CONCURRENTLY in production, acquiring an exclusive lock and blocking all dashboard readers.',
      fix: 'Always create a UNIQUE INDEX on the materialized view and use REFRESH MATERIALIZED VIEW CONCURRENTLY.'
    },
    nextTopicId: 'table-partitioning-sharding'
  },
  {
    id: 'table-partitioning-sharding',
    title: 'Table Partitioning: Range, List & Hash Strategies',
    category: 'architecture',
    difficulty: 'Expert',
    summary: 'Declarative table partitioning splits huge multi-hundred-gigabyte tables into smaller physical tables behind a single logical interface. Partition pruning allows the optimizer to skip irrelevant physical partitions entirely.',
    mentalModel: 'The Filing Cabinet Drawers: Instead of stuffing 10,000,000 invoices into a single giant cardboard box, you label drawers by year: 2024, 2025, 2026. A search for a 2026 invoice only opens Drawer 2026.',
    codeSnippet: `-- 1. Declarative Range Partitioning by Date:
CREATE TABLE events_partitioned (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  event_type VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (id, created_at) -- Partition key must be part of PK!
) PARTITION BY RANGE (created_at);

-- 2. Physical Sub-Partitions:
CREATE TABLE events_2026_q1 PARTITION OF events_partitioned
  FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2026-04-01 00:00:00+00');

CREATE TABLE events_2026_q2 PARTITION OF events_partitioned
  FOR VALUES FROM ('2026-04-01 00:00:00+00') TO ('2026-07-01 00:00:00+00');

-- 3. Partition Pruning in action:
-- Query only scans events_2026_q1 on disk; q2 is 100% ignored!
EXPLAIN SELECT * FROM events_partitioned 
WHERE created_at BETWEEN '2026-02-01' AND '2026-02-15';`,
    takeaways: [
      'Partition Pruning: The optimizer inspects WHERE clauses at planning time and excludes irrelevant physical partitions from execution.',
      'Drop Partition vs DELETE: Purging historical data via DROP TABLE events_2024 is instantaneous (0ms) and creates zero WAL/Vacuum bloat compared to DELETE.',
      'Partitioning strategies: RANGE (timestamps/dates), LIST (countries/regions), and HASH (uniform balancing).'
    ],
    commonPitfall: {
      mistake: 'Trying to create a Primary Key without including the partition key column, which causes PostgreSQL to reject table creation.',
      fix: 'Include the partition key in all unique constraints and primary keys: PRIMARY KEY (id, created_at).'
    }
  }
];
