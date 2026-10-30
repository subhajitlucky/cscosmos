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
    "id": "relational-model-sql-lifecycle",
    "title": "Relational Model & SQL Query Execution Lifecycle",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "The complete journey of a SQL query through the database engine: Parser (AST) -> Query Rewriter -> Cost-Based Optimizer (CBO) -> Execution Engine -> Buffer Pool / Storage Engine.",
    "mentalModel": "The Flight Control Center: The passenger requests a destination (declarative SQL). Flight planners calculate fuel costs and wind speeds (Optimizer) before the pilot flies the optimal route (Execution Engine).",
    "codeSnippet": "-- Declarative Query (Specify WHAT, not HOW):\nSELECT u.name, COUNT(o.id) AS total_orders\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE u.status = 'active'\nGROUP BY u.name\nHAVING COUNT(o.id) >= 5\nORDER BY total_orders DESC\nLIMIT 10;",
    "takeaways": [
      "SQL is declarative: You describe the desired dataset, and the Cost-Based Optimizer (CBO) decides the physical access path.",
      "Logical Query Execution Order: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.",
      "Understanding execution order explains why column aliases created in SELECT cannot be referenced inside the WHERE clause."
    ],
    "commonPitfall": {
      "mistake": "Using a SELECT alias in WHERE (e.g. SELECT (price * 1.2) AS total WHERE total > 100), causing syntax error.",
      "fix": "Repeat the expression in WHERE or wrap the query inside a Common Table Expression (CTE) / Subquery."
    },
    "nextTopicId": "ddl-tables-data-types"
  },
  {
    "id": "ddl-tables-data-types",
    "title": "DDL: Tables, Schemas & Native Data Types",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Data Definition Language (DDL) creates, alters, and manages relational structures. Choosing optimal physical data types directly impacts page storage density, cache efficiency, and buffer utilization.",
    "mentalModel": "Architectural Blueprint & Container Sizes: Selecting BIGINT vs SMALLINT or VARCHAR vs CHAR is like choosing shipping containers\u2014oversized containers waste 80% of ship cargo capacity (disk pages and buffer pool RAM).",
    "codeSnippet": "-- Create optimized relational table with appropriate types:\nCREATE TABLE users (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  uuid UUID NOT NULL DEFAULT gen_random_uuid(),\n  username VARCHAR(50) NOT NULL,\n  email VARCHAR(255) NOT NULL,\n  role VARCHAR(20) NOT NULL DEFAULT 'member',\n  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,\n  is_verified BOOLEAN NOT NULL DEFAULT FALSE,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP\n);",
    "takeaways": [
      "Fixed vs Variable types: CHAR(N) pads with trailing spaces; VARCHAR(N) stores actual string length with a 1-to-4 byte header.",
      "NUMERIC/DECIMAL guarantees exact precision for financial amounts, avoiding floating-point rounding errors caused by FLOAT/REAL.",
      "Always store timestamps with timezone (TIMESTAMPTZ in Postgres) to ensure UTC normalization across distributed servers."
    ],
    "commonPitfall": {
      "mistake": "Storing financial currencies using FLOAT or DOUBLE PRECISION, leading to rounding discrepancies like 0.1 + 0.2 = 0.30000000000000004.",
      "fix": "Always use NUMERIC(12, 2) or store currency amounts in integer cents (e.g. 1000 for $10.00)."
    },
    "nextTopicId": "data-integrity-constraints"
  },
  {
    "id": "data-integrity-constraints",
    "title": "Data Integrity: Constraints & Foreign Key Cascades",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Constraints are engine-level invariants that guarantee data consistency. Foreign keys enforce referential integrity across relational entities with deterministic cascading actions.",
    "mentalModel": "Legal Contracts & Border Control: Constraints are security checkpoints at the border. Any row violating CHECK, UNIQUE, NOT NULL, or FOREIGN KEY rules is immediately rejected before touching the disk.",
    "codeSnippet": "-- Table constraints enforcing invariants:\nCREATE TABLE orders (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  user_id BIGINT NOT NULL,\n  product VARCHAR(100) NOT NULL,\n  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0.00),\n  status VARCHAR(20) NOT NULL DEFAULT 'pending'\n    CHECK (status IN ('pending', 'completed', 'cancelled')),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,\n  CONSTRAINT fk_orders_user\n    FOREIGN KEY (user_id) REFERENCES users(id)\n    ON DELETE CASCADE ON UPDATE CASCADE\n);",
    "takeaways": [
      "Foreign keys enforce referential integrity; ON DELETE CASCADE automatically purges child records when a parent row is deleted.",
      "CHECK constraints allow complex validation logic directly in the schema without relying exclusively on application code.",
      "Foreign key columns do NOT automatically create secondary indexes in PostgreSQL; omitting an index on user_id causes slow table locks on deletes."
    ],
    "commonPitfall": {
      "mistake": "Forgetting to index the foreign key column (e.g. orders.user_id), resulting in full table scans and share locks when deleting a user.",
      "fix": "Always create an explicit B-Tree index on referencing foreign key columns: CREATE INDEX idx_orders_user_id ON orders(user_id)."
    },
    "nextTopicId": "dml-crud-upserts"
  },
  {
    "id": "dml-crud-upserts",
    "title": "DML: CRUD Operations, Batching & UPSERTs",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Data Manipulation Language (DML) covers row mutations. Modern SQL introduces atomic UPSERTs (ON CONFLICT DO UPDATE) and RETURNING clauses to eliminate race conditions.",
    "mentalModel": "The Warehouse Loading Dock: Batching inserts is like loading a pallet truck once instead of carrying individual boxes 1,000 times back and forth.",
    "codeSnippet": "-- Atomic UPSERT with RETURNING clause:\nINSERT INTO user_stats (user_id, login_count, last_login)\nVALUES (42, 1, CURRENT_TIMESTAMP)\nON CONFLICT (user_id) DO UPDATE SET\n  login_count = user_stats.login_count + 1,\n  last_login = EXCLUDED.last_login\nRETURNING id, user_id, login_count, last_login;",
    "takeaways": [
      "ON CONFLICT DO UPDATE (UPSERT) executes atomically inside the storage engine, eliminating check-then-insert race conditions.",
      "The EXCLUDED pseudo-table represents the proposed values that conflicted with the existing row.",
      "The RETURNING clause returns generated identity values, defaults, or updated columns in a single database round-trip."
    ],
    "commonPitfall": {
      "mistake": "Running a SELECT query first to check existence before doing INSERT in application code, causing duplicate key race conditions under concurrency.",
      "fix": "Use atomic INSERT ... ON CONFLICT (id) DO UPDATE / DO NOTHING in a single query."
    },
    "nextTopicId": "where-null-three-valued-logic"
  },
  {
    "id": "where-null-three-valued-logic",
    "title": "WHERE Clause & NULLs: Three-Valued Logic (3VL)",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "In SQL, NULL signifies unknown or missing data. Comparisons involving NULL evaluate to UNKNOWN, requiring Three-Valued Logic (TRUE, FALSE, UNKNOWN) rather than standard Boolean logic.",
    "mentalModel": "The Sealed Mystery Box: If box A and box B both contain unknown contents, is Content A equal to Content B? We cannot say YES or NO\u2014the answer is UNKNOWN.",
    "codeSnippet": "-- Three-Valued Logic Demonstration:\n-- NULL = NULL evaluates to UNKNOWN, which WHERE treats as FALSE!\nSELECT * FROM users WHERE middle_name = NULL; -- Returns 0 rows!\n\n-- Correct idiomatic NULL handling:\nSELECT * FROM users WHERE middle_name IS NULL;\nSELECT * FROM users WHERE middle_name IS NOT NULL;\n\n-- Safe equality checking with IS NOT DISTINCT FROM:\nSELECT * FROM users WHERE middle_name IS NOT DISTINCT FROM 'Alexander';",
    "takeaways": [
      "In SQL, NULL = NULL evaluates to UNKNOWN, not TRUE. Therefore, WHERE col = NULL will never return any rows.",
      "Logical operators with UNKNOWN: TRUE AND UNKNOWN is UNKNOWN; FALSE AND UNKNOWN is FALSE; TRUE OR UNKNOWN is TRUE.",
      "Use IS NULL and IS NOT NULL, or IS DISTINCT FROM to treat two NULLs as identical without evaluating to UNKNOWN."
    ],
    "commonPitfall": {
      "mistake": "Writing WHERE status != 'inactive', expecting to match rows where status is NULL. Because NULL != 'inactive' evaluates to UNKNOWN, those rows are silently dropped!",
      "fix": "Explicitly check for NULL: WHERE status != 'inactive' OR status IS NULL (or WHERE status IS DISTINCT FROM 'inactive')."
    },
    "nextTopicId": "sql-execution-order-lifecycle"
  },
  {
    "id": "sql-execution-order-lifecycle",
    "title": "Logical Query Execution Order: FROM to LIMIT",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "SQL code is written starting with SELECT, but executed in a strict logical sequence by the database engine: FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.",
    "mentalModel": "The Assembly Line: You cannot inspect or sort finished cars (SELECT, ORDER BY) before the raw steel enters the factory floor and gets filtered on the conveyor belt (FROM, WHERE).",
    "codeSnippet": "-- Step-by-Step Logical Pipeline:\n-- 1. FROM & JOIN: Combine virtual datasets\n-- 2. WHERE: Filter physical rows\n-- 3. GROUP BY: Cluster into buckets\n-- 4. HAVING: Filter aggregated buckets\n-- 5. SELECT & Window: Project columns and evaluate OVER()\n-- 6. DISTINCT: Remove duplicates\n-- 7. ORDER BY: Sort final set\n-- 8. LIMIT / OFFSET: Slice window\nSELECT dept, AVG(salary) AS avg_sal\nFROM employees\nWHERE is_active = TRUE\nGROUP BY dept\nHAVING AVG(salary) > 80000\nORDER BY avg_sal DESC\nLIMIT 5;",
    "takeaways": [
      "WHERE filters individual rows BEFORE aggregation; HAVING filters aggregated groups AFTER GROUP BY.",
      "Column aliases defined in SELECT are invisible to WHERE and HAVING because SELECT executes after them.",
      "ORDER BY executes AFTER SELECT, which is why it can reference SELECT column aliases and expressions."
    ],
    "commonPitfall": {
      "mistake": "Putting aggregate functions in WHERE (e.g. WHERE AVG(salary) > 50000), which throws an engine syntax error.",
      "fix": "Place aggregate condition in HAVING or compute the aggregate in a CTE first."
    },
    "nextTopicId": "filtering-pattern-matching-regex"
  },
  {
    "id": "filtering-pattern-matching-regex",
    "title": "Pattern Matching: LIKE, ILIKE, Wildcards & POSIX Regex",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "String filtering with wildcards (%) and single-character matches (_), case-insensitive matching with ILIKE, and POSIX regular expressions (~ and ~*).",
    "mentalModel": "The Detective Fingerprint Search: % is a blank check for any number of characters; _ is a single wildcard letter placeholder.",
    "codeSnippet": "-- Wildcard & Case-Insensitive Pattern Matching:\nSELECT * FROM products WHERE sku LIKE 'ELEC-%';     -- Starts with ELEC-\nSELECT * FROM products WHERE name ILIKE '%phone%';   -- Case-insensitive\nSELECT * FROM codes WHERE code LIKE '__-____';       -- Exactly 2 chars, dash, 4 chars\n\n-- POSIX Regex in PostgreSQL:\nSELECT * FROM users WHERE email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$';",
    "takeaways": [
      "Leading wildcards (%text) defeat standard B-Tree index scans and force sequential disk scans.",
      "Trailing wildcards (text%) can utilize standard B-Tree indexes via range scans if collation supports it.",
      "For heavy wildcard and regex searching, specialized trigram GIN indexes (pg_trgm) provide 100x acceleration."
    ],
    "commonPitfall": {
      "mistake": "Using LIKE '%keyword%' on a million-row table and wondering why queries take 5 seconds even with an index.",
      "fix": "Use a trigram GIN index (CREATE INDEX idx_name_trgm ON products USING gin (name gin_trgm_ops)) for fast substring searches."
    },
    "nextTopicId": "case-conditional-expressions"
  },
  {
    "id": "case-conditional-expressions",
    "title": "Conditional Logic: CASE, COALESCE & NULLIF",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Transforming data values conditionally inside declarative SQL using Searched CASE expressions, COALESCE fallback chains, and NULLIF division-by-zero guards.",
    "mentalModel": "The Railway Switch: A switch track diverts trains to track A, B, or C depending on signal flags (WHEN conditions).",
    "codeSnippet": "-- Conditional categorization & safe division:\nSELECT\n  order_id,\n  total,\n  CASE\n    WHEN total >= 1000 THEN 'VIP'\n    WHEN total >= 250  THEN 'Standard'\n    ELSE 'Economy'\n  END AS tier,\n  -- Safe division preventing Divide-by-Zero error:\n  revenue / NULLIF(units_sold, 0) AS avg_unit_price,\n  -- Fallback value chain:\n  COALESCE(preferred_phone, mobile_phone, work_phone, 'N/A') AS contact_phone\nFROM sales;",
    "takeaways": [
      "CASE expressions evaluate conditions in top-down sequential order and stop at the first match (short-circuit).",
      "COALESCE returns the first non-NULL expression in its argument list.",
      "NULLIF(a, b) returns NULL if a equals b; otherwise it returns a. It is the gold standard for preventing division-by-zero crashes."
    ],
    "commonPitfall": {
      "mistake": "Allowing division by zero (revenue / count) when count is 0, crashing the entire batch query.",
      "fix": "Wrap denominator with NULLIF(count, 0), which returns NULL instead of raising a runtime division exception."
    },
    "nextTopicId": "database-normalization-1nf-2nf-3nf"
  },
  {
    "id": "database-normalization-1nf-2nf-3nf",
    "title": "Normalization Essentials: 1NF, 2NF & 3NF Decomposition",
    "category": "foundations",
    "difficulty": "Intermediate",
    "summary": "Eliminating update, insert, and delete anomalies by breaking down monolithic tables based on functional dependencies: Atomic columns (1NF), Full functional dependency (2NF), and No transitive dependencies (3NF).",
    "mentalModel": "The Organized Tool Chest: Putting wrenches in the wrench slot and screwdrivers in the screwdriver tray ensures replacing a broken wrench doesn't accidentally alter your screwdrivers.",
    "codeSnippet": "-- 1NF: Atomic values (No CSV strings or nested lists)\n-- 2NF: No partial dependency on part of a composite primary key\n-- 3NF: No transitive dependencies (Non-key column determines another non-key column)\n\n-- Violation of 3NF (dept_name depends on dept_id, not emp_id):\n-- employees(emp_id, emp_name, dept_id, dept_name)\n\n-- Decomposed to 3NF:\nCREATE TABLE departments (\n  id INT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);\n\nCREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  dept_id INT REFERENCES departments(id)\n);",
    "takeaways": [
      "1NF requires atomic values in every column and a primary key.",
      "2NF requires all non-key attributes to be fully functionally dependent on the entire primary key.",
      "3NF requires that no non-key attribute is transitively dependent on the primary key (X -> Y and Y -> Z)."
    ],
    "commonPitfall": {
      "mistake": "Storing comma-separated tags in a single column (e.g. tags = 'sql,db,backend'), violating 1NF and preventing index lookups.",
      "fix": "Use a normalized Many-to-Many junction table (post_tags) or native PostgreSQL typed arrays."
    },
    "nextTopicId": "transactions-savepoints-rollback"
  },
  {
    "id": "transactions-savepoints-rollback",
    "title": "Transaction Control: SAVEPOINT & Partial Rollback",
    "category": "foundations",
    "difficulty": "Intermediate",
    "summary": "Controlling transactional boundaries with BEGIN, COMMIT, and ROLLBACK. SAVEPOINT allows rolling back a portion of a transaction without aborting the entire unit of work.",
    "mentalModel": "Video Game Checkpoints: When facing a hard dungeon boss, you save at the checkpoint (SAVEPOINT). If you take damage, you revert to the checkpoint rather than restarting the entire game from Level 1.",
    "codeSnippet": "BEGIN;\n\nINSERT INTO accounts (user_id, balance) VALUES (101, 500);\n\nSAVEPOINT credit_check;\n\n-- Risky external operation:\nUPDATE credit_scores SET score = score + 10 WHERE user_id = 101;\n\n-- If risky operation failed, rollback ONLY to checkpoint:\nROLLBACK TO SAVEPOINT credit_check;\n\n-- Continue other valid operations:\nINSERT INTO audit_log (event) VALUES ('User 101 created without credit boost');\n\nCOMMIT; -- Successfully commits user 101 and audit_log!",
    "takeaways": [
      "SAVEPOINT creates an in-transaction checkpoint that can be rolled back to without invalidating prior statements.",
      "RELEASE SAVEPOINT destroys the savepoint marker while preserving changes made up to that point.",
      "In PostgreSQL, an unhandled error inside a transaction marks the transaction as aborted; all subsequent queries fail until ROLLBACK."
    ],
    "commonPitfall": {
      "mistake": "Executing queries in an aborted PostgreSQL transaction block after an error occurred, leading to 'current transaction is aborted' errors.",
      "fix": "Use SAVEPOINT before executing statements that might fail (e.g. speculative inserts), allowing you to ROLLBACK TO SAVEPOINT on exception."
    },
    "nextTopicId": "aggregations-group-by-having"
  },
  {
    "id": "aggregations-group-by-having",
    "title": "GROUP BY & HAVING: Aggregation Engine & Filter Mechanics",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Collapsing multiple rows into summary metrics using aggregate functions (COUNT, SUM, AVG, MIN, MAX). HAVING filters grouped buckets, while WHERE filters pre-aggregated rows.",
    "mentalModel": "The Factory Sorter: WHERE discards damaged apples before boxing. GROUP BY packs remaining apples into variety crates. HAVING rejects crates weighing less than 10kg.",
    "codeSnippet": "-- Multi-column aggregation with HAVING:\nSELECT\n  department,\n  role,\n  COUNT(*) AS employee_count,\n  ROUND(AVG(salary), 2) AS average_salary,\n  MAX(salary) AS top_salary\nFROM employees\nWHERE status = 'active'\nGROUP BY department, role\nHAVING COUNT(*) >= 3 AND AVG(salary) > 60000\nORDER BY department, average_salary DESC;",
    "takeaways": [
      "Any column in the SELECT clause that is NOT inside an aggregate function MUST be present in the GROUP BY clause.",
      "WHERE filters individual rows BEFORE grouping; HAVING filters aggregated groups AFTER GROUP BY.",
      "COUNT(*) counts all rows including NULLs; COUNT(column_name) counts only rows where the specified column is NOT NULL."
    ],
    "commonPitfall": {
      "mistake": "Writing SELECT dept, name, AVG(salary) GROUP BY dept without including name in GROUP BY, causing an engine syntax error.",
      "fix": "Remove name from SELECT, include it in GROUP BY, or use an analytical window function instead."
    },
    "nextTopicId": "grouping-sets-rollup-cube"
  },
  {
    "id": "grouping-sets-rollup-cube",
    "title": "Multi-Dimensional Aggregations: GROUPING SETS, ROLLUP & CUBE",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Generating hierarchical subtotals, grand totals, and multi-dimensional cross-tabulations in a single efficient pass without executing multiple UNION ALL queries.",
    "mentalModel": "The Executive Spreadsheet Subtotal: ROLLUP calculates regional totals and automatically appends grand national totals at the bottom in one query.",
    "codeSnippet": "-- Multi-level aggregation with ROLLUP:\nSELECT\n  country,\n  state,\n  city,\n  SUM(sales) AS total_sales\nFROM retail_sales\nGROUP BY ROLLUP (country, state, city);\n\n-- CUBE generates all 2^N dimensional permutations:\nSELECT product_cat, region, SUM(revenue)\nFROM sales\nGROUP BY CUBE (product_cat, region);",
    "takeaways": [
      "ROLLUP creates hierarchical subtotals from right to left, plus a grand total row.",
      "CUBE produces all possible combinations of grouping columns (2^N groupings for N dimensions).",
      "GROUPING SETS allows selective definition of specific subtotal combinations, avoiding the performance penalty of calculating unwanted dimensions."
    ],
    "commonPitfall": {
      "mistake": "Running multiple separate queries connected by UNION ALL to compute subtotals, scanning the underlying table 4 times.",
      "fix": "Use GROUP BY ROLLUP(...) to scan the table once and generate all subtotal rows in a single pass."
    },
    "nextTopicId": "set-operations-union-intersect-except"
  },
  {
    "id": "set-operations-union-intersect-except",
    "title": "Set Operations: UNION, UNION ALL, INTERSECT & EXCEPT",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Combining rowsets from multiple SELECT statements using relational set theory operations. UNION removes duplicates via sort/hash, while UNION ALL streams rows instantly.",
    "mentalModel": "The Venn Diagram: UNION is the full merger of both circles. INTERSECT is the overlapping center slice. EXCEPT is circle A minus circle B.",
    "codeSnippet": "-- UNION vs UNION ALL performance:\n-- UNION ALL (Fast, preserves duplicates, zero deduplication overhead):\nSELECT user_id, 'customer' AS source FROM customers\nUNION ALL\nSELECT user_id, 'vendor' AS source FROM vendors;\n\n-- INTERSECT (Find IDs present in BOTH tables):\nSELECT user_id FROM beta_testers\nINTERSECT\nSELECT user_id FROM paid_subscribers;\n\n-- EXCEPT (Find paid users who have NEVER logged in):\nSELECT id FROM users WHERE is_paid = true\nEXCEPT\nSELECT user_id FROM logins;",
    "takeaways": [
      "UNION performs a deduplication step (Hash or Unique Sort), making it significantly slower than UNION ALL.",
      "Default to UNION ALL unless duplicate elimination is an explicit business requirement.",
      "All queries in a set operation must have matching numbers of columns with compatible data types."
    ],
    "commonPitfall": {
      "mistake": "Using UNION by default instead of UNION ALL, causing the database to sort millions of rows in memory to eliminate duplicates that don't exist.",
      "fix": "Always use UNION ALL unless deduplication is strictly necessary."
    },
    "nextTopicId": "subqueries-correlated-exists"
  },
  {
    "id": "subqueries-correlated-exists",
    "title": "Subqueries: Scalar, Table & Correlated EXISTS",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Subqueries execute within an outer query. Correlated subqueries reference outer row values for every iteration, whereas EXISTS short-circuits on the first matching record.",
    "mentalModel": "The Security Guard with a Checklist: EXISTS looks into the building and stops checking the second it finds one matching person; IN lists every single person in the phone book before deciding.",
    "codeSnippet": "-- Efficient Correlated EXISTS (Short-circuits on first hit):\nSELECT u.id, u.name\nFROM users u\nWHERE EXISTS (\n  SELECT 1\n  FROM orders o\n  WHERE o.user_id = u.id\n    AND o.total > 500\n);\n\n-- Scalar Subquery in SELECT:\nSELECT\n  name,\n  salary,\n  (SELECT ROUND(AVG(salary), 2) FROM employees) AS company_avg\nFROM employees;",
    "takeaways": [
      "EXISTS stops scanning the inner table as soon as a single matching row is located (Boolean short-circuit).",
      "Correlated subqueries evaluate for each candidate row in the outer table unless rewritten into joins by the optimizer.",
      "NOT IN evaluates to UNKNOWN if the subquery returns even a single NULL value, filtering out all rows! Use NOT EXISTS instead."
    ],
    "commonPitfall": {
      "mistake": "Using WHERE id NOT IN (SELECT user_id FROM blacklist) when blacklist contains a NULL, causing the entire query to return zero rows.",
      "fix": "Always prefer WHERE NOT EXISTS (SELECT 1 FROM blacklist b WHERE b.user_id = u.id) to safely handle NULLs."
    },
    "nextTopicId": "sql-joins-execution"
  },
  {
    "id": "sql-joins-execution",
    "title": "Relational Joins: INNER, LEFT, RIGHT, FULL & CROSS Joins",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Logical joining of two relational tables based on join predicates. INNER filters non-matches, OUTER preserves unmatched rows with NULL padding, and CROSS produces Cartesian products.",
    "mentalModel": "The Dinner Reservation Table: INNER JOIN seats only parties that have matching reservations. LEFT JOIN seats every guest, placing an empty chair (NULL) if no table reservation was found.",
    "codeSnippet": "-- Comprehensive join variants:\n-- 1. INNER JOIN (Intersection):\nSELECT u.name, o.product\nFROM users u\nJOIN orders o ON u.id = o.user_id;\n\n-- 2. LEFT OUTER JOIN (All users, even without orders):\nSELECT u.name, COALESCE(o.product, 'No Orders') AS product\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n\n-- 3. CROSS JOIN (Cartesian product N * M):\nSELECT c.name, s.size\nFROM colors c\nCROSS JOIN sizes s;",
    "takeaways": [
      "Filtering on the right table inside WHERE in a LEFT JOIN converts it into an INNER JOIN unless checking for IS NULL.",
      "CROSS JOIN generates N x M rows and can exhaust memory if executed on large tables.",
      "Always join on indexed primary and foreign keys to enable Index Nested Loop or Hash Joins."
    ],
    "commonPitfall": {
      "mistake": "Adding WHERE orders.status = 'active' on a LEFT JOIN, which eliminates rows where orders.status is NULL, turning it into an accidental INNER JOIN.",
      "fix": "Move the filter condition into the ON clause: LEFT JOIN orders o ON u.id = o.user_id AND o.status = 'active'."
    },
    "nextTopicId": "anti-and-semi-joins"
  },
  {
    "id": "anti-and-semi-joins",
    "title": "Semi-Joins & Anti-Joins: High-Performance Filtering",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Semi-joins return outer rows that have at least one match in the inner table without duplicating outer rows. Anti-joins return rows that have NO match in the inner table.",
    "mentalModel": "VIP Door Checker: A semi-join only checks if your name is on the VIP guest list; it doesn't give you two wristbands if your name was written twice.",
    "codeSnippet": "-- Semi-Join (Returns each user once, no duplicate rows from multiple orders):\nSELECT u.id, u.name\nFROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);\n\n-- Anti-Join (Find users with ZERO orders):\nSELECT u.id, u.name\nFROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);",
    "takeaways": [
      "Using JOIN to test existence can duplicate outer rows if the inner table has multiple matches, forcing a slow DISTINCT step.",
      "Semi-joins (EXISTS) never duplicate rows, keeping memory usage minimal.",
      "Anti-joins (NOT EXISTS) allow the optimizer to perform fast Hash Anti-Joins or Index Anti-Scans."
    ],
    "commonPitfall": {
      "mistake": "Writing SELECT DISTINCT u.* FROM users u JOIN orders o ON u.id = o.user_id, which creates duplicate tuples then sorts to deduplicate.",
      "fix": "Use a Semi-Join: SELECT * FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id)."
    },
    "nextTopicId": "lateral-joins-cross-apply"
  },
  {
    "id": "lateral-joins-cross-apply",
    "title": "LATERAL Joins & CROSS APPLY: Correlated Rowsets",
    "category": "query-execution",
    "difficulty": "Advanced",
    "summary": "LATERAL subqueries act like a for-each loop over the outer table, allowing subqueries on the right side of a join to reference columns from previous tables on the left side.",
    "mentalModel": "The Per-Row Sub-Contractor: For every row in Table A, Table B executes a customized mini-query that can access Table A's current values.",
    "codeSnippet": "-- Find the TOP 2 most recent orders for EACH user (Top-N per group):\nSELECT\n  u.name,\n  latest_orders.product,\n  latest_orders.total,\n  latest_orders.created_at\nFROM users u\nCROSS JOIN LATERAL (\n  SELECT o.product, o.total, o.created_at\n  FROM orders o\n  WHERE o.user_id = u.id\n  ORDER BY o.created_at DESC\n  LIMIT 2\n) AS latest_orders;",
    "takeaways": [
      "Standard subqueries in FROM/JOIN cannot reference columns from sibling tables; LATERAL unlocks this capability.",
      "LATERAL is the optimal pattern for Top-N per group queries when supported by an index on (group_col, order_col).",
      "Supported natively in PostgreSQL as LATERAL and in SQL Server / Oracle as CROSS APPLY."
    ],
    "commonPitfall": {
      "mistake": "Using window functions over the entire 10-million row orders table just to get 2 orders per user, sorting gigabytes of data.",
      "fix": "Use CROSS JOIN LATERAL with LIMIT 2 backed by an index on (user_id, created_at DESC) for lightning-fast per-user lookups."
    },
    "nextTopicId": "pivot-and-unpivot-crosstab"
  },
  {
    "id": "pivot-and-unpivot-crosstab",
    "title": "Pivot, Unpivot & Dynamic Cross-Tabulation",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Transforming rows into columns (Pivot) and columns into rows (Unpivot) for reporting dashboards. Modern PostgreSQL accomplishes this cleanly using the aggregate FILTER clause.",
    "mentalModel": "Rotating the Rubik's Cube: Pivoting turns vertical transaction records into a horizontal matrix with months as column headers.",
    "codeSnippet": "-- Clean Modern Pivoting using aggregate FILTER clause:\nSELECT\n  product_id,\n  SUM(sales) FILTER (WHERE EXTRACT(QUARTER FROM sale_date) = 1) AS q1_sales,\n  SUM(sales) FILTER (WHERE EXTRACT(QUARTER FROM sale_date) = 2) AS q2_sales,\n  SUM(sales) FILTER (WHERE EXTRACT(QUARTER FROM sale_date) = 3) AS q3_sales,\n  SUM(sales) FILTER (WHERE EXTRACT(QUARTER FROM sale_date) = 4) AS q4_sales,\n  SUM(sales) AS total_annual_sales\nFROM orders\nGROUP BY product_id;",
    "takeaways": [
      "The FILTER (WHERE ...) clause attached to aggregate functions is ANSI standard and far cleaner than legacy CASE statements.",
      "Pivoting rows into columns simplifies downstream consumption in business intelligence tools and spreadsheets.",
      "Unpivoting (normalizing columns back to rows) can be performed efficiently using CROSS JOIN LATERAL with VALUES()."
    ],
    "commonPitfall": {
      "mistake": "Writing multiple full queries with UNION ALL to generate quarterly sales columns.",
      "fix": "Use conditional aggregation with SUM(sales) FILTER (WHERE ...) in a single scan."
    },
    "nextTopicId": "window-functions"
  },
  {
    "id": "window-functions",
    "title": "Analytical Window Functions: Ranking & Frame Partitions",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Computing cumulative, ranking, and comparative statistics across subsets of rows without collapsing rows like GROUP BY. Covers OVER (PARTITION BY ... ORDER BY ...).",
    "mentalModel": "The Sliding Magnifying Glass: You view the entire table, and through a magnifying glass (window frame), you compute running metrics for your department without hiding your fellow coworkers.",
    "codeSnippet": "-- Window Ranking Functions:\nSELECT\n  name,\n  department,\n  salary,\n  ROW_NUMBER() OVER w AS row_num, -- 1, 2, 3, 4\n  RANK()       OVER w AS rnk,     -- 1, 1, 3, 4 (Ties produce gaps)\n  DENSE_RANK() OVER w AS dense_rnk-- 1, 1, 2, 3 (No gaps)\nFROM employees\nWINDOW w AS (PARTITION BY department ORDER BY salary DESC);",
    "takeaways": [
      "Window functions execute AFTER WHERE, GROUP BY, and HAVING, but BEFORE ORDER BY and LIMIT.",
      "ROW_NUMBER() assigns unique sequential integers; RANK() leaves gaps after ties; DENSE_RANK() does not leave gaps.",
      "The WINDOW clause allows defining reusable window specifications to prevent code duplication."
    ],
    "commonPitfall": {
      "mistake": "Attempting to filter window function results in WHERE (e.g. WHERE ROW_NUMBER() OVER (...) = 1), which causes a syntax error.",
      "fix": "Compute the window ranking in a CTE or subquery first, then filter the resulting column in the outer WHERE clause."
    },
    "nextTopicId": "window-functions-value-frames"
  },
  {
    "id": "window-functions-value-frames",
    "title": "Window Value Functions & Frame Specs (ROWS vs RANGE)",
    "category": "query-execution",
    "difficulty": "Advanced",
    "summary": "Accessing adjacent rows without self-joins using LAG(), LEAD(), and FIRST_VALUE(), and mastering frame boundaries (ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW).",
    "mentalModel": "The Rolling Tape Recorder: LAG lets you listen to the song played right before this one; LEAD lets you preview the next track on the playlist.",
    "codeSnippet": "-- Month-over-Month Growth Calculation with LAG:\nSELECT\n  month,\n  revenue,\n  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_revenue,\n  ROUND(\n    (revenue - LAG(revenue, 1) OVER (ORDER BY month)) /\n    LAG(revenue, 1) OVER (ORDER BY month) * 100.0, 2\n  ) AS mom_growth_pct,\n  -- Cumulative 3-Month Moving Average:\n  AVG(revenue) OVER (\n    ORDER BY month\n    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\n  ) AS moving_3mo_avg\nFROM monthly_financials;",
    "takeaways": [
      "LAG(col, N) fetches the value from N rows earlier; LEAD(col, N) fetches from N rows ahead.",
      "Default window frame with ORDER BY is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW (treats duplicate order values identically).",
      "ROWS mode specifies exact physical row offsets, while RANGE specifies value-based intervals."
    ],
    "commonPitfall": {
      "mistake": "Unintentionally using default RANGE instead of ROWS for cumulative sums, causing identical timestamps to sum together simultaneously instead of step-by-step.",
      "fix": "Explicitly specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW for deterministic step-by-step rolling sums."
    },
    "nextTopicId": "common-table-expressions-recursive"
  },
  {
    "id": "common-table-expressions-recursive",
    "title": "Common Table Expressions (CTEs): WITH & Materialization",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Named temporary result sets defined using the WITH clause. Improves readability, modularity, and query planning. Explains PostgreSQL CTE inlining vs MATERIALIZED optimization.",
    "mentalModel": "Lego Assembly Sub-Components: Building complex engines out of labeled modular sub-assemblies (CTEs) instead of trying to mold the entire query out of a single molten blob of plastic.",
    "codeSnippet": "-- Modular CTE with Materialization hint:\nWITH regional_sales AS (\n  SELECT region, SUM(amount) AS total_sales\n  FROM orders\n  GROUP BY region\n),\ntop_regions AS (\n  SELECT region\n  FROM regional_sales\n  WHERE total_sales > 1000000\n)\nSELECT e.name, e.region, e.salary\nFROM employees e\nJOIN top_regions tr ON e.region = tr.region;",
    "takeaways": [
      "CTEs make complex queries readable and maintainable compared to deeply nested subqueries.",
      "In modern PostgreSQL (v12+), non-recursive CTEs are inlined by default unless explicitly marked AS MATERIALIZED.",
      "WITH MATERIALIZED forces the engine to evaluate the CTE once into a temporary buffer, preventing redundant re-evaluations."
    ],
    "commonPitfall": {
      "mistake": "Assuming CTEs act as optimization fences that always prevent index usage. Since Postgres 12, simple CTEs are inlined seamlessly.",
      "fix": "Use WITH cte AS MATERIALIZED only when you intentionally want to force a single execution and freeze optimizer statistics."
    },
    "nextTopicId": "recursive-ctes-hierarchical-graphs"
  },
  {
    "id": "recursive-ctes-hierarchical-graphs",
    "title": "Recursive CTEs: Hierarchies, Trees & Graph Traversal",
    "category": "query-execution",
    "difficulty": "Advanced",
    "summary": "Traversing organizational hierarchies, bill-of-materials, graph structures, and generating sequential series using WITH RECURSIVE (Anchor member UNION ALL Recursive member).",
    "mentalModel": "The Family Tree Climber: The Anchor member finds the CEO. The Recursive member repeatedly asks 'Who reports to the people found in the previous step?' until no more employees are found.",
    "codeSnippet": "-- Traverse Manager-Employee Org Chart with Depth Level:\nWITH RECURSIVE org_chart AS (\n  -- Anchor Member: Top-level CEO\n  SELECT id, name, manager_id, 1 AS depth, name::TEXT AS hierarchy_path\n  FROM employees\n  WHERE manager_id IS NULL\n\n  UNION ALL\n\n  -- Recursive Member: Subordinates of previous level\n  SELECT e.id, e.name, e.manager_id, o.depth + 1, o.hierarchy_path || ' -> ' || e.name\n  FROM employees e\n  JOIN org_chart o ON e.manager_id = o.id\n)\nSELECT * FROM org_chart ORDER BY hierarchy_path;",
    "takeaways": [
      "A recursive CTE consists of an Anchor member, UNION ALL, and a Recursive member referencing the CTE itself.",
      "Execution terminates automatically when the recursive step returns zero new rows.",
      "Always guard against infinite circular loops in cyclical graphs by tracking visited IDs in an array."
    ],
    "commonPitfall": {
      "mistake": "Running a recursive query on cyclical data (e.g. A reports to B, B reports to A), causing an infinite loop that crashes the server.",
      "fix": "Add a loop detection clause: WHERE NOT e.id = ANY(o.path_array)."
    },
    "nextTopicId": "btree-bplus-tree-indexes"
  },
  {
    "id": "btree-bplus-tree-indexes",
    "title": "B+ Tree Index Internals: Root, Branch & Leaf Page Splits",
    "category": "indexing",
    "difficulty": "Intermediate",
    "summary": "B+ Trees are balanced, self-reorganizing search trees optimized for block storage. All keys and data pointers reside strictly in doubly-linked leaf nodes, enabling O(log N) lookups and O(K) sequential range scans.",
    "mentalModel": "The Library Index Card Catalog: Instead of walking through 100,000 bookshelves, you look at Room 1 (Root), walk to Cabinet 4 (Branch), open Drawer 12 (Leaf), and pull the exact shelf coordinate.",
    "codeSnippet": "-- Standard B-Tree Index creation:\nCREATE INDEX idx_users_email ON users USING btree (email);\n\n-- Composite B-Tree Index:\nCREATE INDEX idx_orders_user_created ON orders (user_id, created_at DESC);\n\n-- Inspect index leaf page metrics in PostgreSQL:\n-- SELECT * FROM pgstatindex('idx_users_email');",
    "takeaways": [
      "B+ Tree fanout is typically 100-300 per 8KB page; a 3-level B-Tree can index tens of millions of rows in just 3 I/O page reads.",
      "Leaf pages are doubly linked (prev/next), making ORDER BY and range queries (BETWEEN x AND y) lightning fast without re-traversing from the root.",
      "Inserting keys into a full page causes a 50/50 page split, creating random I/O overhead."
    ],
    "commonPitfall": {
      "mistake": "Indexing random UUID primary keys with default B-Trees, triggering constant 50/50 page splits and severe write amplification.",
      "fix": "Use UUIDv7 (time-ordered sequential UUIDs) or BIGINT IDENTITY to ensure sequential leaf page appends."
    },
    "nextTopicId": "clustered-vs-secondary-index"
  },
  {
    "id": "clustered-vs-secondary-index",
    "title": "Clustered vs. Secondary Indexes & Table Heap Files",
    "category": "indexing",
    "difficulty": "Intermediate",
    "summary": "In MySQL InnoDB, the clustered index IS the table data. In PostgreSQL, tables are stored in Heap Files, and all indexes (including Primary Key) are secondary indexes storing physical tuple pointers (ctid / TID).",
    "mentalModel": "The Dictionary vs The Index at the Back: A dictionary is clustered (words are physically sorted on pages). A textbook index is secondary (lists terms and page numbers where the text is physically printed).",
    "codeSnippet": "-- PostgreSQL Heap Tuple ID (ctid) demonstration:\nSELECT ctid, id, name FROM users LIMIT 3;\n-- ctid (0, 1) means Block 0, Offset 1 on disk!\n\n-- Reorganize PostgreSQL table heap to match index order:\nCLUSTER users USING idx_users_created_at;",
    "takeaways": [
      "In clustered engines (InnoDB), primary key lookups avoid a secondary heap lookup; secondary index lookups perform a double lookup (Secondary -> PK -> Data).",
      "In PostgreSQL heap engines, all indexes point directly to disk TID tuples (Block, Offset).",
      "PostgreSQL CLUSTER physically sorts the table heap once, but new updates do not preserve clustered order automatically."
    ],
    "commonPitfall": {
      "mistake": "Assuming secondary index point lookups only read 1 disk block. They read 3 B-Tree blocks PLUS 1 table heap block.",
      "fix": "Use Covering Indexes (INCLUDE) to satisfy queries directly from the index leaf without touching the table heap."
    },
    "nextTopicId": "composite-indexes-leftmost-prefix"
  },
  {
    "id": "composite-indexes-leftmost-prefix",
    "title": "Composite Indexes & The Leftmost Prefix Rule",
    "category": "indexing",
    "difficulty": "Intermediate",
    "summary": "Composite multi-column indexes sort rows by (col1, col2, col3). The B-Tree search can only filter on col2 if col1 is tested with equality. Skipping leading columns causes index skips or full table scans.",
    "mentalModel": "The Telephone Book (Last Name, First Name): You can quickly find 'Smith, John' or all 'Smiths'. But you cannot use the telephone book to find everyone named 'John' without reading every single page.",
    "codeSnippet": "-- Composite index on (country, status, created_at):\nCREATE INDEX idx_users_country_status ON users(country, status, created_at);\n\n-- \u2705 Uses all 3 index columns:\nSELECT * FROM users WHERE country = 'US' AND status = 'active' AND created_at > '2026-01-01';\n\n-- \u2705 Uses leading column (country):\nSELECT * FROM users WHERE country = 'US';\n\n-- \u274c Violates Leftmost Prefix Rule (Cannot use index for search):\nSELECT * FROM users WHERE status = 'active';",
    "takeaways": [
      "Leftmost Prefix Rule: An index on (A, B, C) can satisfy queries on (A), (A, B), and (A, B, C), but NOT (B) or (C) alone.",
      "Range filters (<, >, BETWEEN) freeze index utilization for subsequent columns; columns after a range filter can only be evaluated as post-filters.",
      "Order columns by: Equality filters FIRST, Range filters SECOND, Sort (ORDER BY) columns LAST."
    ],
    "commonPitfall": {
      "mistake": "Creating an index on (created_at, status) when queries filter WHERE status = 'active' AND created_at > NOW(), preventing status from narrowing the B-Tree search.",
      "fix": "Place equality columns first: CREATE INDEX idx ON users (status, created_at)."
    },
    "nextTopicId": "covering-indexes-include"
  },
  {
    "id": "covering-indexes-include",
    "title": "Covering Indexes & The INCLUDE Clause (Index-Only Scan)",
    "category": "indexing",
    "difficulty": "Advanced",
    "summary": "An Index-Only Scan answers a query completely from the index leaves without reading table heap blocks. The INCLUDE clause appends payload columns to leaf pages without widening branch keys.",
    "mentalModel": "The Fast-Track Boarding Pass: Your mobile boarding pass has both your gate number (Key) and seat assignment (Payload). You don't need to visit the check-in desk (Table Heap) at all.",
    "codeSnippet": "-- Covering Index with INCLUDE clause:\nCREATE INDEX idx_orders_user_covering\nON orders (user_id)\nINCLUDE (product, total, created_at);\n\n-- Executes as 100% Index-Only Scan with 0 Heap Fetches!\nSELECT product, total, created_at\nFROM orders\nWHERE user_id = 942;",
    "takeaways": [
      "Index-Only Scans can be 10x to 100x faster because table heap I/O is skipped completely.",
      "INCLUDE columns are stored only in the leaf nodes, keeping branch nodes compact and maintaining high fanout.",
      "PostgreSQL requires the Visibility Map bit to be clean (checked by VACUUM) to guarantee that tuples in the index are visible to all transactions."
    ],
    "commonPitfall": {
      "mistake": "Adding payload columns directly to the index key list (user_id, product, total), bloating the B-Tree branch pages and reducing fanout.",
      "fix": "Use the INCLUDE clause to store non-search payload columns strictly in the leaf nodes."
    },
    "nextTopicId": "partial-and-expression-indexes"
  },
  {
    "id": "partial-and-expression-indexes",
    "title": "Partial Indexes & Expression / Functional Indexes",
    "category": "indexing",
    "difficulty": "Intermediate",
    "summary": "Partial indexes index only a subset of rows matching a WHERE predicate, drastically reducing index size. Expression indexes index the result of functions (e.g. LOWER(email), (metadata->>'id')).",
    "mentalModel": "The VIP Speed Lane: Why index 10 million archived orders when your application only queries the 5,000 active 'pending' orders? Index only what you query.",
    "codeSnippet": "-- 1. Partial Index (Tiny footprint, indexes only active queue):\nCREATE INDEX idx_orders_pending\nON orders (created_at)\nWHERE status = 'pending';\n\n-- 2. Expression / Functional Index (Case-insensitive email lookup):\nCREATE UNIQUE INDEX idx_users_lower_email\nON users (LOWER(email));\n\n-- Query matching the expression index:\nSELECT * FROM users WHERE LOWER(email) = 'alice@test.com';",
    "takeaways": [
      "Partial indexes save 90%+ disk space and buffer pool RAM when queries target skewed status flags (e.g. unprocessed = true).",
      "A query must include the exact WHERE clause of the partial index for the optimizer to consider using it.",
      "Queries searching LOWER(col) will NOT use a standard B-Tree index on col; an expression index on LOWER(col) is required."
    ],
    "commonPitfall": {
      "mistake": "Indexing an entire 50-million row table where 99% of rows are status='archived' and queries only touch status='active'.",
      "fix": "Create a partial index: CREATE INDEX idx ON orders(created_at) WHERE status = 'active'."
    },
    "nextTopicId": "specialized-indexes-gin-gist-brin-partial"
  },
  {
    "id": "specialized-indexes-gin-gist-brin-partial",
    "title": "Specialized Index Engines: GIN, GiST & BRIN",
    "category": "indexing",
    "difficulty": "Advanced",
    "summary": "B-Trees excel at 1-dimensional comparisons. Specialized access methods conquer complex data: GIN for JSONB and Full-Text Search, GiST for geometric coordinates, and BRIN for massive sequential time-series.",
    "mentalModel": "Specialized Transport Vehicles: A sedan (B-Tree) is great for highways. A submarine (GiST) handles multi-dimensional ocean depths. A cargo train (BRIN) handles millions of tons along a single straight track.",
    "codeSnippet": "-- GIN Index for JSONB document containment:\nCREATE INDEX idx_users_meta ON users USING gin (metadata);\nSELECT * FROM users WHERE metadata @> '{\"plan\": \"pro\"}';\n\n-- BRIN Index for 1-Billion Row Time-Series Table (1000x smaller than B-Tree!):\nCREATE INDEX idx_sensor_brin ON sensor_logs USING brin (recorded_at);\nSELECT * FROM sensor_logs WHERE recorded_at BETWEEN '2026-01-01' AND '2026-01-02';",
    "takeaways": [
      "GIN (Generalized Inverted Index) maps individual array elements, JSONB keys/values, and text tokens to matching tuple IDs.",
      "BRIN (Block Range Index) stores only the MIN and MAX value for ranges of physical disk pages (e.g. 128 pages = 1MB block), taking kilobytes instead of gigabytes.",
      "GiST (Generalized Search Tree) powers PostGIS spatial geometry, k-nearest neighbors, and overlapping timestamp ranges."
    ],
    "commonPitfall": {
      "mistake": "Using a B-Tree index on a billion-row append-only timestamp table, resulting in a 30 GB index that blows out server RAM.",
      "fix": "Use a BRIN index (Block Range Index), reducing index size from 30 GB down to 5 MB while maintaining high-speed range scans."
    },
    "nextTopicId": "hash-indexes-in-databases"
  },
  {
    "id": "hash-indexes-in-databases",
    "title": "Hash Indexes: O(1) Equality Lookups & WAL Safety",
    "category": "indexing",
    "difficulty": "Intermediate",
    "summary": "Hash indexes map keys to 32-bit hash buckets, delivering O(1) equality point lookups. Modern PostgreSQL (v10+) makes Hash indexes fully crash-safe with WAL logging and replication support.",
    "mentalModel": "The Locker Room Number: Instead of searching a tree, you pass your key through a math function that tells you immediately which locker door to open.",
    "codeSnippet": "-- Hash Index creation for point lookups:\nCREATE INDEX idx_tokens_hash ON auth_tokens USING hash (token_hash);\n\n-- Fast O(1) point lookup:\nSELECT user_id, expires_at FROM auth_tokens WHERE token_hash = 'a8f9c1d2e3f4';",
    "takeaways": [
      "Hash indexes can be faster than B-Trees for very wide string keys because they compare 32-bit hash codes instead of full string prefixes.",
      "Hash indexes ONLY support simple equality (=) comparisons; they CANNOT satisfy range queries (<, >, BETWEEN) or ORDER BY sorts.",
      "In PostgreSQL 10+, Hash indexes are fully WAL-logged and safely replicated to streaming replicas."
    ],
    "commonPitfall": {
      "mistake": "Attempting to use a Hash index for sorting (ORDER BY token_hash) or range filtering (WHERE token_hash > 'a'), which falls back to a full table scan.",
      "fix": "Use Hash indexes only for strict equality point lookups; use B-Tree for sorting and ranges."
    },
    "nextTopicId": "index-bloat-maintenance"
  },
  {
    "id": "index-bloat-maintenance",
    "title": "Index Bloat, Page Fragmentation & REINDEX CONCURRENTLY",
    "category": "indexing",
    "difficulty": "Advanced",
    "summary": "Frequent updates and deletes leave empty dead space in B-Tree index pages. Index bloat wastes memory cache and degrades search latency. REINDEX CONCURRENTLY rebuilds indexes without write downtime.",
    "mentalModel": "The Half-Empty Filing Cabinet: Half the folders were thrown out, but the empty drawers still occupy floor space. Compacting the cabinet frees up room in the office.",
    "codeSnippet": "-- Zero-Downtime Index Rebuild in PostgreSQL:\nREINDEX INDEX CONCURRENTLY idx_orders_user_id;\n\n-- Measure Index Bloat with pgstattuple:\n-- SELECT * FROM pgstatuple('idx_orders_user_id');",
    "takeaways": [
      "B-Tree index pages do not always collapse when rows are deleted, leading to physical bloat.",
      "High bloat forces the database to read more disk pages into the buffer pool cache for the same number of keys.",
      "REINDEX CONCURRENTLY builds a new index in the background, swaps the catalog entry, and drops the old index without taking an exclusive write lock."
    ],
    "commonPitfall": {
      "mistake": "Running a plain REINDEX TABLE in production during peak business hours, which acquires an ACCESS EXCLUSIVE lock and blocks all reads and writes.",
      "fix": "Always use REINDEX TABLE CONCURRENTLY or REINDEX INDEX CONCURRENTLY to avoid blocking user traffic."
    },
    "nextTopicId": "physical-join-nested-loop"
  },
  {
    "id": "physical-join-nested-loop",
    "title": "Physical Join Algorithms: Nested Loop & Index Nested Loop",
    "category": "indexing",
    "difficulty": "Intermediate",
    "summary": "The engine access path for joins: For every row in the outer table, it scans or probes the inner table. When backed by an inner B-Tree index, complexity is O(N * log M).",
    "mentalModel": "The Address Book Lookup: You have 5 invitations (Outer Table). For each invitation, you look up the address in your phone contact book (Index on Inner Table) in 2 seconds.",
    "codeSnippet": "-- Nested Loop Query Pattern:\n-- Optimizer chooses Nested Loop when outer table is small (e.g. 5 users)\n-- and inner table has an index on join key:\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT u.name, o.product\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE u.id IN (1, 2, 3);",
    "takeaways": [
      "Nested Loop Join is chosen by the CBO when the outer relation is small and the inner relation has an index on the join key.",
      "Without an inner index, complexity degrades to O(N * M), which is catastrophic for large tables.",
      "The outer table is also called the driving table; good optimizer statistics ensure the smaller table drives the loop."
    ],
    "commonPitfall": {
      "mistake": "Missing an index on the foreign key column, forcing the engine into a Cartestian Nested Loop scan O(N * M) that pegs CPU at 100%.",
      "fix": "Index the foreign key column so the engine uses an Index Nested Loop join in O(N * log M)."
    },
    "nextTopicId": "explain-analyze-query-plans"
  },
  {
    "id": "explain-analyze-query-plans",
    "title": "EXPLAIN ANALYZE: Cost Model, Buffers & Node Inspection",
    "category": "indexing",
    "difficulty": "Advanced",
    "summary": "Dissecting execution plans. Understanding startup cost vs total cost (cost=0.42..8.45), row cardinality estimation errors, and buffer cache hit rates (Buffers: shared hit vs read).",
    "mentalModel": "The X-Ray Machine: An X-ray shows the bone structure of your query before and after running, revealing whether your query had to lift 100kg of disk pages (shared read) or 0kg from RAM (shared hit).",
    "codeSnippet": "-- Deep Execution Plan Diagnostics:\nEXPLAIN (ANALYZE, BUFFERS, TIMING, COSTS)\nSELECT u.name, COUNT(o.id) AS total_orders\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE u.status = 'active'\nGROUP BY u.name\nORDER BY total_orders DESC\nLIMIT 10;",
    "takeaways": [
      "EXPLAIN shows the optimizer estimate; EXPLAIN ANALYZE actually runs the query and reports real wall-clock execution time and row counts.",
      "Always inspect 'Buffers: shared hit vs read': shared read means physical disk I/O; shared hit means served from fast RAM buffer cache.",
      "Large discrepancies between 'rows=1' (estimated) and 'actual rows=100000' indicate stale catalog statistics, requiring an ANALYZE command."
    ],
    "commonPitfall": {
      "mistake": "Running EXPLAIN ANALYZE on a production DELETE or UPDATE query, which actually executes the deletion and mutates real production data!",
      "fix": "Run EXPLAIN ANALYZE inside a transaction block and immediately ROLLBACK: BEGIN; EXPLAIN ANALYZE DELETE ...; ROLLBACK;."
    },
    "nextTopicId": "acid-transactions"
  },
  {
    "id": "acid-transactions",
    "title": "ACID Properties: The Mathematical Guarantees of RDBMS",
    "category": "transactions",
    "difficulty": "Intermediate",
    "summary": "The fundamental pillars of relational durability: Atomicity (all or nothing), Consistency (schema & invariants preserved), Isolation (concurrent safety), and Durability (WAL fsync survival).",
    "mentalModel": "The Bank Wire Transfer: If $100 is deducted from Alice's account, it MUST arrive in Bob's account. If the power cable is pulled halfway through, Alice gets her $100 back (Atomicity & Durability).",
    "codeSnippet": "-- Atomic Bank Transfer Transaction:\nBEGIN;\n\nUPDATE accounts SET balance = balance - 100 WHERE id = 1; -- Alice\nUPDATE accounts SET balance = balance + 100 WHERE id = 2; -- Bob\n\n-- Verify invariants (Consistency check):\n-- If any constraint fails, the entire block rolls back!\nCOMMIT;",
    "takeaways": [
      "Atomicity guarantees no partial writes; transactions commit completely or rollback completely.",
      "Consistency ensures constraints, triggers, and foreign keys remain valid after every committed state.",
      "Durability guarantees that committed data survives power failures, operating system crashes, and reboots via the Write-Ahead Log (WAL)."
    ],
    "commonPitfall": {
      "mistake": "Running multiple related updates without an explicit BEGIN ... COMMIT block in application code, leaving orphaned state on network timeout.",
      "fix": "Wrap multi-statement state changes inside an explicit database transaction."
    },
    "nextTopicId": "transaction-isolation-levels"
  },
  {
    "id": "transaction-isolation-levels",
    "title": "ANSI SQL Isolation Levels & Concurrency Anomalies",
    "category": "transactions",
    "difficulty": "Advanced",
    "summary": "Balancing concurrency throughput against correctness: Read Uncommitted, Read Committed (default), Repeatable Read, and Serializable. Each higher level eliminates specific concurrency anomalies.",
    "mentalModel": "The Tinted Glass Office: Read Committed lets you see people as soon as they step outside the door. Repeatable Read takes a photo of the office when you sat down and shows you that photo all day.",
    "codeSnippet": "-- Set Transaction Isolation Level:\nBEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;\n\n-- Snapshot is frozen at this first query:\nSELECT SUM(balance) FROM accounts;\n\n-- Even if other sessions insert or update accounts, this query\n-- returns the EXACT same sum throughout this transaction:\nSELECT SUM(balance) FROM accounts;\n\nCOMMIT;",
    "takeaways": [
      "Read Committed is the default in PostgreSQL; each individual statement sees a new snapshot of committed data.",
      "Repeatable Read takes a single snapshot at the start of the first statement, ensuring consistent reads across the entire transaction.",
      "Serializable guarantees transactions execute with the same outcome as if they were executed one after another sequentially."
    ],
    "commonPitfall": {
      "mistake": "Assuming Repeatable Read prevents all race conditions. It prevents non-repeatable reads and phantom rows, but is STILL vulnerable to Write Skew!",
      "fix": "Use SERIALIZABLE isolation or explicit SELECT FOR UPDATE locks to prevent write skew anomalies."
    },
    "nextTopicId": "dirty-nonrepeatable-phantom-reads"
  },
  {
    "id": "dirty-nonrepeatable-phantom-reads",
    "title": "Concurrency Anomalies: Dirty, Non-Repeatable & Phantom Reads",
    "category": "transactions",
    "difficulty": "Intermediate",
    "summary": "Deep dive into the 3 classic ANSI SQL anomalies: Dirty Read (reading uncommitted abort data), Non-Repeatable Read (row value changes mid-transaction), and Phantom Read (row count changes in range queries).",
    "mentalModel": "The Ghost in the Ledger: You count 50 inventory boxes. While you are writing the report, someone walks in and drops off box #51. When you count again, a new phantom box appeared.",
    "codeSnippet": "-- Non-Repeatable Read Demonstration (Under Read Committed):\n-- Session A:\nBEGIN;\nSELECT balance FROM accounts WHERE id = 1; -- Returns 100\n\n-- Session B concurrently executes & commits:\n-- UPDATE accounts SET balance = 500 WHERE id = 1; COMMIT;\n\n-- Session A runs same query again:\nSELECT balance FROM accounts WHERE id = 1; -- Returns 500! Value mutated mid-transaction!",
    "takeaways": [
      "Dirty reads can cause catastrophic business errors by acting on phantom money from rolled-back transactions.",
      "Non-repeatable reads occur when concurrent UPDATEs commit during your read transaction.",
      "Phantom reads occur when concurrent INSERTs or DELETEs commit during your range scan (BETWEEN x AND y)."
    ],
    "commonPitfall": {
      "mistake": "Relying on Read Committed when running financial end-of-month reconciliations where multiple summary reports must see consistent totals.",
      "fix": "Use REPEATABLE READ or SERIALIZABLE to freeze the snapshot for the reconciliation session."
    },
    "nextTopicId": "write-skew-and-serialization"
  },
  {
    "id": "write-skew-and-serialization",
    "title": "Write Skew Anomaly & Serializable Snapshot Isolation (SSI)",
    "category": "transactions",
    "difficulty": "Expert",
    "summary": "Write Skew occurs when two concurrent transactions read overlapping state, conclude a constraint is satisfied, and write to disjoint records, violating a global business invariant. Only SERIALIZABLE prevents Write Skew.",
    "mentalModel": "The On-Call Doctors Dilemma: Hospital rule says at least 1 doctor must be on call. Doctor Alice and Doctor Bob see 2 doctors active, so both check out at the exact same second. Now 0 doctors are on call!",
    "codeSnippet": "-- Write Skew Scenario (Repeatable Read fails!):\n-- Session 1 (Doctor Alice):\nBEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT COUNT(*) FROM on_call WHERE is_active = true; -- Count = 2\nUPDATE on_call SET is_active = false WHERE doctor = 'Alice';\nCOMMIT;\n\n-- Session 2 concurrently (Doctor Bob):\nBEGIN ISOLATION LEVEL REPEATABLE READ;\nSELECT COUNT(*) FROM on_call WHERE is_active = true; -- Count = 2\nUPDATE on_call SET is_active = false WHERE doctor = 'Bob';\nCOMMIT;\n\n-- Both commit successfully! Constraint violated (0 doctors on call)!\n-- FIX: Use SERIALIZABLE (PostgreSQL aborts the second transaction with 40001 serialization_failure).",
    "takeaways": [
      "Write Skew cannot be detected by standard row-level locks because the two transactions write to different rows.",
      "PostgreSQL uses Serializable Snapshot Isolation (SSI) with SIREAD locks on tuples and pages to detect rw-antidependency cycles in memory.",
      "Applications using SERIALIZABLE isolation must implement retry loops on serialization_failure (SQLSTATE 40001)."
    ],
    "commonPitfall": {
      "mistake": "Thinking Repeatable Read protects against all race conditions in booking systems, allowing double-bookings via write skew.",
      "fix": "Use SERIALIZABLE isolation with application retry logic, or explicit SELECT FOR UPDATE locking."
    },
    "nextTopicId": "locking-select-for-update-deadlocks"
  },
  {
    "id": "locking-select-for-update-deadlocks",
    "title": "Row Locking, SELECT FOR UPDATE & Deadlock Resolution",
    "category": "transactions",
    "difficulty": "Advanced",
    "summary": "Pessimistic concurrency control using explicit row locks. SELECT FOR UPDATE locks matching rows until transaction end. SKIP LOCKED enables high-throughput queue processing without worker contention.",
    "mentalModel": "The Ticket Counter Baton: You hold the physical baton for Seat 42. Nobody else can touch Seat 42 until you either pay for it or hand the baton back.",
    "codeSnippet": "-- High-Concurrency Job Queue Worker Pattern:\nBEGIN;\nSELECT id, payload\nFROM job_queue\nWHERE status = 'pending'\nORDER BY priority DESC\nLIMIT 1\nFOR UPDATE SKIP LOCKED; -- Skips jobs already locked by other worker threads!\n\n-- Process job payload...\nUPDATE job_queue SET status = 'completed' WHERE id = 42;\nCOMMIT;",
    "takeaways": [
      "FOR UPDATE acquires an exclusive write lock on returned rows, queuing concurrent readers wanting locks.",
      "FOR UPDATE SKIP LOCKED bypasses locked rows instantly, enabling zero-contention distributed worker queues in pure SQL.",
      "Deadlocks happen when Session 1 locks Row A then wants Row B, while Session 2 locks Row B then wants Row A. The engine automatically aborts one session."
    ],
    "commonPitfall": {
      "mistake": "Updating multiple tables or rows in random order across transactions, inevitably triggering deadlock crashes.",
      "fix": "Always acquire locks and update rows in strict, consistent ID order (ORDER BY id) across all application threads."
    },
    "nextTopicId": "optimistic-concurrency-control"
  },
  {
    "id": "optimistic-concurrency-control",
    "title": "Optimistic Concurrency Control (OCC) & Version Numbers",
    "category": "transactions",
    "difficulty": "Intermediate",
    "summary": "Handling concurrency without holding open database locks. Transactions read data freely and check a version number or timestamp upon writing. If the version changed, the update is rejected.",
    "mentalModel": "Wiki Document Editing: Two editors open Page Version 4. Editor A saves changes, advancing the page to Version 5. When Editor B tries to save, the system rejects it because Version 4 is obsolete.",
    "codeSnippet": "-- Optimistic Concurrency Control via version column:\n-- Read step (No lock held!):\nSELECT id, balance, version FROM accounts WHERE id = 1;\n-- balance: 500, version: 12\n\n-- Update step (Atomic Compare-And-Swap):\nUPDATE accounts\nSET\n  balance = balance - 100,\n  version = version + 1\nWHERE id = 1 AND version = 12;\n\n-- If rows_affected == 0, another client updated first! Throw conflict & retry.",
    "takeaways": [
      "OCC avoids database lock contention, maximizing read and write throughput in low-conflict environments.",
      "Locks are never held during user think-time or slow external API calls.",
      "When conflict rate is high, OCC causes excessive retry overhead; switch to pessimistic SELECT FOR UPDATE."
    ],
    "commonPitfall": {
      "mistake": "Holding a database transaction open while making a slow 5-second HTTP call to Stripe or OpenAI, exhausting all pool connections.",
      "fix": "Use OCC: Release database transaction, execute HTTP call, then perform atomic UPDATE ... WHERE version = N."
    },
    "nextTopicId": "mvcc-multi-version-concurrency"
  },
  {
    "id": "mvcc-multi-version-concurrency",
    "title": "MVCC Storage Engine: xmin, xmax, Dead Tuples & AutoVacuum",
    "category": "transactions",
    "difficulty": "Advanced",
    "summary": "Multi-Version Concurrency Control (MVCC) ensures readers never block writers and writers never block readers. UPDATES insert new physical tuple versions; AutoVacuum reclaims dead space.",
    "mentalModel": "The Camera Snapshot & Janitor: Writers append new polaroids to the photo album. Readers look at older snapshots taken when their transaction started. The janitor (AutoVacuum) throws away photos no reader is looking at.",
    "codeSnippet": "-- Inspect PostgreSQL internal MVCC metadata headers:\nSELECT ctid, xmin, xmax, id, name\nFROM users;\n\n-- xmin: Transaction ID that created this row version\n-- xmax: Transaction ID that deleted/superseded this row version (0 if alive)\n\n-- Manual vacuum to reclaim dead tuples:\nVACUUM (VERBOSE, ANALYZE) users;",
    "takeaways": [
      "In PostgreSQL, an UPDATE does NOT overwrite data in-place; it creates a new tuple and marks the old tuple with xmax = current_tx.",
      "Dead tuples remain on disk until AutoVacuum cleans them up after all older transactions finish.",
      "Long-running transactions prevent AutoVacuum from reclaiming dead tuples, leading to catastrophic table bloat."
    ],
    "commonPitfall": {
      "mistake": "Leaving idle transactions open for hours (IDLE in transaction), preventing AutoVacuum from cleaning dead tuples and bloating tables by 500%.",
      "fix": "Configure idle_in_transaction_session_timeout = '1min' in postgresql.conf."
    },
    "nextTopicId": "write-ahead-logging-aries"
  },
  {
    "id": "write-ahead-logging-aries",
    "title": "Write-Ahead Logging (WAL), LSNs & ARIES Crash Recovery",
    "category": "transactions",
    "difficulty": "Advanced",
    "summary": "Database durability engine: Changes are written sequentially to the Write-Ahead Log (WAL) on disk BEFORE modifying dirty data pages in RAM. On crash, ARIES recovery replays WAL to restore consistent state.",
    "mentalModel": "The Pilot Flight Black Box: The pilot announces every flight maneuver into the audio recorder before touching the joystick. If the plane loses power, investigators reconstruct every movement from the tape.",
    "codeSnippet": "-- PostgreSQL WAL inspection queries:\nSELECT pg_current_wal_lsn(); -- Current Log Sequence Number\nSELECT pg_walfile_name(pg_current_wal_lsn()); -- Current physical WAL segment file\n\n-- Force immediate checkpoint and flush:\nCHECKPOINT;",
    "takeaways": [
      "WAL converts random I/O writes into sequential I/O appends, delivering 100x faster commit latency.",
      "A transaction is officially durable the instant its commit record is flushed (fsync) to the WAL disk file.",
      "ARIES recovery consists of three phases on crash restart: Analysis (reconstruct dirty pages), Redo (replay all history), and Undo (rollback uncommitted transactions)."
    ],
    "commonPitfall": {
      "mistake": "Setting synchronous_commit = off globally, which trades crash durability for speed and risks losing the last few milliseconds of transactions on power loss.",
      "fix": "Keep synchronous_commit = on for financial and core user data; use off only for disposable telemetry or bulk staging tables."
    },
    "nextTopicId": "buffer-pool-memory-cache"
  },
  {
    "id": "buffer-pool-memory-cache",
    "title": "Buffer Pool & Shared Buffers: Clock-Sweep Page Eviction",
    "category": "transactions",
    "difficulty": "Advanced",
    "summary": "How database engines cache 8KB disk blocks in RAM. The Clock-Sweep eviction algorithm balances hit count pins against dirty page background writing (bgwriter).",
    "mentalModel": "The Workbench vs The Warehouse: The buffer pool is your immediate desk space. If your desk fills up, you put the least-recently used tool back onto the warehouse shelf.",
    "codeSnippet": "-- Inspect shared buffer cache contents using pg_buffercache:\n-- SELECT c.relname, count(*) AS pages_in_ram\n-- FROM pg_buffercache b\n-- JOIN pg_class c ON b.relfilenode = pg_relation_filenode(c.oid)\n-- GROUP BY c.relname\n-- ORDER BY pages_in_ram DESC LIMIT 10;\n\n-- Optimal postgresql.conf rule of thumb: shared_buffers = 25% of total server RAM.",
    "takeaways": [
      "All reads and writes occur in RAM within the buffer pool; disk pages are only read when not present in memory.",
      "Modified pages in RAM are marked 'dirty' and flushed asynchronously to disk by the background writer (bgwriter).",
      "Setting shared_buffers to 25% of system RAM allows the database to leverage both internal buffers and the OS kernel page cache."
    ],
    "commonPitfall": {
      "mistake": "Allocating 90% of server RAM to shared_buffers in PostgreSQL, starving the OS page cache and background worker processes.",
      "fix": "Set shared_buffers to 25% of RAM in PostgreSQL, reserving remaining memory for OS caching and work_mem query execution."
    },
    "nextTopicId": "physical-join-hash-join"
  },
  {
    "id": "physical-join-hash-join",
    "title": "Physical Join Algorithms: In-Memory Hash Join & Spill to Disk",
    "category": "transactions",
    "difficulty": "Intermediate",
    "summary": "How Hash Joins operate: Phase 1 builds an in-memory hash table on the smaller relation inside work_mem; Phase 2 streams and probes with the larger relation. Spills to disk if work_mem is exceeded.",
    "mentalModel": "The Coat Check System: You drop off all small jackets and get tickets with numbers (Hash Table). When big groups enter, they check their ticket numbers directly in O(1) time.",
    "codeSnippet": "-- Force inspection of Hash Join execution:\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT u.name, o.total\nFROM users u\nJOIN orders o ON u.id = o.user_id;\n\n-- In EXPLAIN output:\n-- -> Hash Join (cost=...)\n--      Hash Cond: (o.user_id = u.id)\n--      -> Seq Scan on orders o (Probe)\n--      -> Hash (Build)\n--           Buckets: 1024 Batches: 1 Memory Usage: 32kB",
    "takeaways": [
      "Hash Join has O(N + M) complexity and is the workhorse algorithm for large ad-hoc equi-joins without indexes.",
      "If the hash table exceeds work_mem, the engine partitions data into batches and spills to temporary disk files, degrading performance.",
      "Increasing work_mem prevents temporary disk spills for complex analytical join queries."
    ],
    "commonPitfall": {
      "mistake": "Setting work_mem to 10 GB globally, which can crash the server with Out-Of-Memory (OOM) when 100 concurrent connections each run multiple joins.",
      "fix": "Set work_mem conservatively globally (e.g. 32MB - 64MB) and bump it locally per-session for heavy analytical queries."
    },
    "nextTopicId": "database-normalization-bcnf"
  },
  {
    "id": "database-normalization-bcnf",
    "title": "Database Normalization (1NF to BCNF) vs. Strategic Denormalization",
    "category": "architecture",
    "difficulty": "Advanced",
    "summary": "Boyce-Codd Normal Form (BCNF) guarantees every determinant is a candidate key. Balancing pure normalization against read performance via strategic denormalization and read caches.",
    "mentalModel": "The Custom Sports Car vs Family Minivan: Pure BCNF is an aerospace-engineered formula racecar (zero redundancy, flawless integrity). Denormalization is a pickup truck carrying extra spare tires for immediate convenience.",
    "codeSnippet": "-- Strategic Denormalization: Storing pre-aggregated order totals and user stats:\nALTER TABLE users ADD COLUMN cached_lifetime_spend NUMERIC(12, 2) DEFAULT 0.00;\n\n-- Maintained atomically via trigger or background stream:\nCREATE OR REPLACE FUNCTION update_user_spend()\nRETURNS TRIGGER AS $$\nBEGIN\n  UPDATE users\n  SET cached_lifetime_spend = cached_lifetime_spend + NEW.total\n  WHERE id = NEW.user_id;\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;",
    "takeaways": [
      "BCNF eliminates all redundancy based on functional dependencies; every non-trivial determinant must be a candidate key.",
      "High normalization increases write performance and ensures consistency, but requires 6-way joins on reads.",
      "Strategic denormalization trades write complexity and storage for microsecond read latency in high-read production systems."
    ],
    "commonPitfall": {
      "mistake": "Denormalizing columns prematurely before profiling queries, causing data desynchronization bugs across tables.",
      "fix": "Start with 3NF/BCNF; denormalize only specific hot metrics that are confirmed read bottlenecks via EXPLAIN ANALYZE."
    },
    "nextTopicId": "physical-join-merge-join"
  },
  {
    "id": "physical-join-merge-join",
    "title": "Physical Join Algorithms: Sort-Merge Join Mechanics",
    "category": "architecture",
    "difficulty": "Intermediate",
    "summary": "Sort-Merge Join sorts both inputs by the join key (if not already indexed in sorted order) and steps through both streams simultaneously with two pointers in a single linear pass.",
    "mentalModel": "Two Sorted Decks of Cards: You hold red cards sorted 1 to 10 and black cards sorted 1 to 10. You flip the top card of both decks simultaneously, comparing values in lockstep without searching backwards.",
    "codeSnippet": "-- Sort-Merge Join Plan:\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT u.id, o.id\nFROM users u\nJOIN orders o ON u.id = o.user_id\nORDER BY u.id;\n\n-- In EXPLAIN output:\n-- -> Merge Join\n--      Merge Cond: (u.id = o.user_id)\n--      -> Index Scan on users_pkey u\n--      -> Index Scan on idx_orders_user_id o",
    "takeaways": [
      "Sort-Merge Join has linear O(N + M) complexity once both inputs are sorted.",
      "Ideal when both relations are already sorted by the join key via B-Tree indexes, or when the query specifies an ORDER BY on the join key.",
      "Handles outer joins and equality comparisons with minimal memory overhead."
    ],
    "commonPitfall": {
      "mistake": "Forcing Sort-Merge joins on unsorted data without indexes, which incurs an expensive O(N log N) disk sort.",
      "fix": "Ensure B-Tree indexes exist on join keys so the engine skips the explicit sort step entirely."
    },
    "nextTopicId": "cost-based-optimizer-stats"
  },
  {
    "id": "cost-based-optimizer-stats",
    "title": "Cost-Based Optimizer (CBO), Statistics & pg_statistic",
    "category": "architecture",
    "difficulty": "Advanced",
    "summary": "How database optimizers calculate query cost. The CBO uses data distribution histograms, null fractions, and most common values (MCV) stored in catalog tables to pick the cheapest execution tree.",
    "mentalModel": "Google Maps Route Planner: The GPS checks real-time traffic reports (Database Statistics) to calculate travel time (Query Cost) across highways (Index Scans) vs side streets (Seq Scans).",
    "codeSnippet": "-- Inspect Column Statistics in PostgreSQL:\nSELECT\n  attname AS column_name,\n  n_distinct,\n  null_frac,\n  most_common_vals,\n  most_common_freqs\nFROM pg_stats\nWHERE tablename = 'users' AND attname = 'country';\n\n-- Manually update statistics:\nANALYZE users;",
    "takeaways": [
      "Cost is expressed in arbitrary units of disk page reads: seq_page_cost (1.0), random_page_cost (4.0 for HDD, 1.1 for NVMe SSD).",
      "pg_stats stores histogram bounds and most common values to estimate row selectivity before running queries.",
      "If statistics are stale, the optimizer can choose a slow sequential table scan instead of an index scan."
    ],
    "commonPitfall": {
      "mistake": "Leaving random_page_cost set to default 4.0 on modern NVMe SSDs, tricking the optimizer into thinking indexes are 4x slower than table scans.",
      "fix": "Set random_page_cost = 1.1 on SSD/NVMe cloud hosting to encourage proper index scan usage."
    },
    "nextTopicId": "query-plan-regressions"
  },
  {
    "id": "query-plan-regressions",
    "title": "Query Plan Regressions & Bad Cardinality Estimates",
    "category": "architecture",
    "difficulty": "Expert",
    "summary": "Detecting and resolving sudden query slowdowns. Explains how correlated column predicates break standard independence assumptions and how extended statistics (`CREATE STATISTICS`) fix regressions.",
    "mentalModel": "The Flawed Weather Forecast: Assuming rain probability and umbrella sales are independent events leads to mathematically absurd predictions.",
    "codeSnippet": "-- Create Multivariate / Extended Statistics for correlated columns:\n-- By default, CBO assumes 'city' and 'zip_code' are independent!\nCREATE STATISTICS stat_users_city_zip ON city, zip_code FROM users;\nANALYZE users;\n\n-- Query now accurately estimates cardinality and picks index plan:\nSELECT * FROM users WHERE city = 'San Francisco' AND zip_code = '94102';",
    "takeaways": [
      "The CBO assumes column filters are statistically independent: P(A AND B) = P(A) * P(B). When columns correlate, it drastically underestimates rows.",
      "Underestimating row counts causes the CBO to pick slow Nested Loops instead of Hash Joins.",
      "Extended statistics (CREATE STATISTICS) capture functional dependencies between related columns."
    ],
    "commonPitfall": {
      "mistake": "Debugging a slow query by adding more indexes, when the real problem was correlated columns causing bad optimizer cardinality estimates.",
      "fix": "Create multivariate extended statistics with CREATE STATISTICS to fix cardinality calculations."
    },
    "nextTopicId": "views-materialized-views"
  },
  {
    "id": "views-materialized-views",
    "title": "Views, Materialized Views & Zero-Downtime Refresh",
    "category": "architecture",
    "difficulty": "Intermediate",
    "summary": "Standard views are virtual queries expanded into the AST at runtime. Materialized views persist query results physically to disk for instant retrieval and support REFRESH CONCURRENTLY.",
    "mentalModel": "Live Stream vs Saved Video: A standard view re-records the live show every time you watch. A materialized view saves the video file to disk so you can watch instantly without buffering.",
    "codeSnippet": "-- Materialized View with Concurrent Refresh capability:\nCREATE MATERIALIZED VIEW mv_daily_sales AS\nSELECT\n  DATE_TRUNC('day', created_at) AS sale_date,\n  COUNT(*) AS total_orders,\n  SUM(total) AS daily_revenue\nFROM orders\nGROUP BY 1;\n\n-- REQUIRED for CONCURRENT refresh (unique index):\nCREATE UNIQUE INDEX idx_mv_daily_sales_date ON mv_daily_sales (sale_date);\n\n-- Zero-Downtime refresh (Readers are NOT blocked!):\nREFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;",
    "takeaways": [
      "Standard views incur zero storage overhead and always return real-time data by inlining into the caller query.",
      "Materialized views cache complex aggregation results on disk, delivering 1,000x faster reads at the cost of staleness.",
      "REFRESH MATERIALIZED VIEW CONCURRENTLY requires a UNIQUE index on the view and allows reads while updating."
    ],
    "commonPitfall": {
      "mistake": "Running REFRESH MATERIALIZED VIEW without CONCURRENTLY in production, which takes an exclusive lock and blocks all dashboard queries.",
      "fix": "Create a UNIQUE index on the materialized view and always refresh with REFRESH MATERIALIZED VIEW CONCURRENTLY."
    },
    "nextTopicId": "table-partitioning-sharding"
  },
  {
    "id": "table-partitioning-sharding",
    "title": "Table Partitioning: Range, List & Hash Strategies",
    "category": "architecture",
    "difficulty": "Advanced",
    "summary": "Splitting massive multi-terabyte tables into smaller physical tables while maintaining a single declarative interface. The optimizer uses Partition Pruning to eliminate untouched partitions from queries.",
    "mentalModel": "The Filing Cabinet with Yearly Drawers: Instead of searching one giant 10-foot-tall drawer, you open the drawer labeled '2026' and search only 1/10th of the records.",
    "codeSnippet": "-- Declarative Range Partitioning by Timestamp:\nCREATE TABLE sensor_readings (\n  id BIGINT GENERATED ALWAYS AS IDENTITY,\n  device_id INT NOT NULL,\n  reading NUMERIC(8, 2) NOT NULL,\n  recorded_at TIMESTAMPTZ NOT NULL,\n  PRIMARY KEY (id, recorded_at) -- Partition key MUST be part of PK!\n) PARTITION BY RANGE (recorded_at);\n\n-- Create physical monthly partition tables:\nCREATE TABLE sensor_readings_2026_01 PARTITION OF sensor_readings\n  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');\n\nCREATE TABLE sensor_readings_2026_02 PARTITION OF sensor_readings\n  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');",
    "takeaways": [
      "Partition Pruning: The optimizer inspects query WHERE conditions and excludes irrelevant partitions before scanning disk blocks.",
      "Dropping an old partition (DROP TABLE sensor_readings_2025_01) is instantaneous and generates ZERO WAL bloat compared to DELETE FROM.",
      "The partition key must be included in the table's PRIMARY KEY and UNIQUE constraints."
    ],
    "commonPitfall": {
      "mistake": "Executing DELETE FROM logs WHERE created_at < '2025-01-01' on a 100-million row table, locking tables, bloating WAL, and taking hours.",
      "fix": "Use Range Partitioning and simply DROP TABLE logs_2024; which completes in 2 milliseconds with zero WAL overhead."
    },
    "nextTopicId": "primary-replica-replication"
  },
  {
    "id": "primary-replica-replication",
    "title": "Primary-Replica Replication, Read Scaling & Replication Lag",
    "category": "architecture",
    "difficulty": "Advanced",
    "summary": "Architecting high-availability databases: Physical Streaming Replication streams WAL records from Primary to Replicas. Explains asynchronous vs synchronous replication and handling Replication Lag.",
    "mentalModel": "The Live Translation Relay: The primary speaker broadcasts sentences into a microphone (Primary WAL). Translators listen and repeat the words into localized headphones (Replicas) with a 200ms delay (Lag).",
    "codeSnippet": "-- Measure Replication Lag in PostgreSQL on Primary:\nSELECT\n  client_addr,\n  application_name,\n  state,\n  sync_state,\n  pg_wal_lsn_diff(pg_current_wal_lsn(), write_lsn) AS write_lag_bytes,\n  pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS replay_lag_bytes\nFROM pg_stat_replication;",
    "takeaways": [
      "Physical streaming replication sends byte-for-byte WAL records, ensuring replicas are exact binary clones of the primary.",
      "Asynchronous replication provides high write performance on the primary, but risks data loss on sudden ungraceful failover.",
      "Synchronous replication guarantees zero data loss (RPO = 0), but primary transactions block waiting for network ACK from replica."
    ],
    "commonPitfall": {
      "mistake": "User updates their profile on Primary, redirects to their profile page which reads from an asynchronous Replica, and sees their old profile due to 100ms replication lag.",
      "fix": "Implement 'Read-Your-Own-Writes' session routing: Send reads to Primary for 2 seconds following any write operation."
    },
    "nextTopicId": "horizontal-sharding-distributed"
  },
  {
    "id": "horizontal-sharding-distributed",
    "title": "Horizontal Sharding, Consistent Hashing & Distributed 2PC",
    "category": "architecture",
    "difficulty": "Expert",
    "summary": "Scaling beyond single-node vertical hardware limits. Partitioning data horizontally across distinct independent database servers using Shard Keys, Consistent Hash Rings, and Two-Phase Commit (2PC).",
    "mentalModel": "The Global Postal Sorting Hub: Packages for Zip Code 90000-99999 are shipped to the California warehouse; packages for 10000-19999 go to New York. Neither warehouse needs to know about the other's internal storage.",
    "codeSnippet": "-- Logical Concept: Consistent Hashing Shard Assignment:\n-- Shard_ID = MurmurHash3(tenant_id) % Number_Of_Shards\n\n-- Distributed Two-Phase Commit (2PC) in SQL:\n-- Phase 1: Prepare (Coordinator asks all nodes to lock resources and log to WAL)\nPREPARE TRANSACTION 'tx_transfer_1001';\n\n-- Phase 2: Commit (If all nodes vote YES, coordinator sends final commit)\nCOMMIT PREPARED 'tx_transfer_1001';",
    "takeaways": [
      "Choosing a good Shard Key (e.g. tenant_id) is critical; bad shard keys cause cross-shard joins and hot-spotting.",
      "Cross-shard distributed joins and aggregations require multi-node scatter-gather network overhead.",
      "Two-Phase Commit (2PC) coordinates atomic commits across independent nodes, but introduces blocking latency if coordinator fails."
    ],
    "commonPitfall": {
      "mistake": "Sharding by auto-incrementing ID or timestamp, causing 100% of current write traffic to slam into a single active shard server.",
      "fix": "Use a hash-based shard key (e.g. Hash(tenant_id) or Hash(user_id)) to uniformly distribute writes across all database nodes."
    }
  }
];
