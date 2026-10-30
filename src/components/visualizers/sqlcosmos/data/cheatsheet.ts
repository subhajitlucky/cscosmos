export interface SqlCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    sql: string;
    tip: string;
  }[];
}

export const SQL_CHEATSHEET: SqlCheatSheetSection[] = [
  {
    id: 'ddl-constraints',
    title: 'Core DDL, Data Types & Constraints',
    category: 'DDL & Schema',
    snippets: [
      {
        title: 'Table Definition with Full Constraints',
        description: 'Primary key, foreign key with cascade rules, and check constraints',
        sql: `CREATE TABLE orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0.00),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`,
        tip: 'Always index foreign key columns (user_id) to avoid table-level locks on parent updates.'
      },
      {
        title: 'Non-Destructive Column Migration',
        description: 'Add column safely without locking active tables',
        sql: `-- PostgreSQL: Adding column with DEFAULT since PG 11 is metadata-only (instant):
ALTER TABLE users ADD COLUMN is_premium BOOLEAN NOT NULL DEFAULT FALSE;

-- Non-blocking index creation:
CREATE INDEX CONCURRENTLY idx_users_premium ON users(is_premium);`,
        tip: 'In PostgreSQL, CREATE INDEX CONCURRENTLY acquires only a SHARE UPDATE EXCLUSIVE lock, avoiding read/write blocking.'
      }
    ]
  },
  {
    id: 'querying-predicates',
    title: 'Filtering, Pattern Matching & Three-Valued Logic',
    category: 'Querying',
    snippets: [
      {
        title: 'Safe NULL Handling with COALESCE',
        description: 'Substitute fallback values for NULL without three-valued logic errors',
        sql: `SELECT 
  name,
  COALESCE(phone, mobile, 'No Contact') AS active_phone,
  COALESCE(discount_rate, 0.0) AS applied_discount
FROM customers
WHERE deleted_at IS NULL;`,
        tip: 'Never use WHERE col = NULL; comparisons with NULL always return UNKNOWN, discarding rows.'
      },
      {
        title: 'Case-Insensitive Pattern Search (ILIKE & Regex)',
        description: 'Search substring or regular expressions',
        sql: `-- Case-insensitive substring:
SELECT * FROM products WHERE name ILIKE '%mechanical keyboard%';

-- POSIX Regular Expression:
SELECT email FROM users WHERE email ~* '^[A-Z0-9._%+-]+@company\\.com$';`,
        tip: 'Leading wildcards (%text) cannot use standard B-Tree indexes; use a pg_trgm GIN index instead.'
      }
    ]
  },
  {
    id: 'aggregations-grouping',
    title: 'Aggregations, Grouping & Hierarchical Rollups',
    category: 'Aggregation',
    snippets: [
      {
        title: 'Multi-Level Aggregation with Filtered HAVING',
        description: 'Aggregate metrics and filter groups after evaluation',
        sql: `SELECT 
  department,
  COUNT(*) AS total_staff,
  COUNT(commission) AS staff_with_commission,
  ROUND(AVG(salary), 2) AS avg_salary,
  SUM(salary) AS total_payroll
FROM employees
WHERE is_active = TRUE
GROUP BY department
HAVING COUNT(*) >= 5 AND AVG(salary) > 75000
ORDER BY avg_salary DESC;`,
        tip: 'COUNT(*) counts physical rows; COUNT(col) ignores rows where col is NULL.'
      },
      {
        title: 'Subtotal Rollups with ROLLUP & CUBE',
        description: 'Generate automatic subtotals and grand totals in one query',
        sql: `SELECT 
  COALESCE(region, 'Grand Total') AS region,
  COALESCE(product_line, 'Subtotal') AS product_line,
  SUM(revenue) AS total_sales
FROM sales
GROUP BY ROLLUP (region, product_line);`,
        tip: 'ROLLUP creates hierarchical subtotals: (region, product) -> (region) -> Grand Total.'
      }
    ]
  },
  {
    id: 'joins-sets',
    title: 'Joins & Set Operations',
    category: 'Relational Logic',
    snippets: [
      {
        title: 'Multi-Table OUTER JOIN with NULL Filter (Anti-Join)',
        description: 'Find records in Table A that have no corresponding rows in Table B',
        sql: `SELECT u.id, u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL; -- Anti-join: users who never ordered!`,
        tip: 'Antijoins can also be expressed with WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id).'
      },
      {
        title: 'Set Operators: UNION ALL vs EXCEPT',
        description: 'Combine datasets or compute mathematical difference',
        sql: `-- UNION ALL: Concatenate streams without deduplication overhead
SELECT id, email, 'active' AS status FROM current_users
UNION ALL
SELECT id, email, 'archived' AS status FROM legacy_users;

-- EXCEPT: Rows in first set not present in second set
SELECT user_id FROM beta_testers
EXCEPT
SELECT user_id FROM unsubscribed_users;`,
        tip: 'UNION ALL avoids the heavy sort/hash deduplication pass required by UNION.'
      }
    ]
  },
  {
    id: 'window-functions',
    title: 'Advanced Analytics & Window Functions',
    category: 'Analytics',
    snippets: [
      {
        title: 'Month-over-Month Growth with LAG()',
        description: 'Compare current row against previous row in partition',
        sql: `SELECT 
  month,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_rev,
  ROUND(((revenue - LAG(revenue, 1) OVER (ORDER BY month)) / LAG(revenue, 1) OVER (ORDER BY month)) * 100, 2) AS growth_pct
FROM monthly_sales;`,
        tip: 'LAG(column, offset) avoids slow self-joins when analyzing time series trends.'
      },
      {
        title: 'Running Total (Cumulative Sum)',
        description: 'Running cumulative aggregation over ordered window',
        sql: `SELECT 
  id,
  order_date,
  amount,
  SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM orders;`,
        tip: 'Ensure ORDER BY is specified inside OVER() so SUM() acts as a cumulative running total.'
      }
    ]
  },
  {
    id: 'ctes-recursive',
    title: 'Common Table Expressions (CTEs) & Recursion',
    category: 'Query Design',
    snippets: [
      {
        title: 'WITH RECURSIVE (Org Chart / Tree Traversal)',
        description: 'Traverse hierarchical parent-child relationships',
        sql: `WITH RECURSIVE OrgHierarchy AS (
  -- Base case: Root Manager
  SELECT id, name, manager_id, 1 AS depth
  FROM employees
  WHERE manager_id IS NULL
  
  UNION ALL
  
  -- Recursive step: Direct Reports
  SELECT e.id, e.name, e.manager_id, h.depth + 1
  FROM employees e
  JOIN OrgHierarchy h ON e.manager_id = h.id
)
SELECT * FROM OrgHierarchy ORDER BY depth, name;`,
        tip: 'Always include a base case and UNION ALL with termination conditions to prevent infinite loops.'
      },
      {
        title: 'Modular Business Logic with Multiple CTEs',
        description: 'Chain multiple logical steps cleanly',
        sql: `WITH MonthlyOrders AS (
  SELECT user_id, COUNT(*) AS order_cnt, SUM(total) AS spend
  FROM orders
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
),
VipCustomers AS (
  SELECT user_id FROM MonthlyOrders WHERE spend > 1000
)
SELECT u.name, u.email, m.spend
FROM users u
JOIN VipCustomers v ON u.id = v.user_id
JOIN MonthlyOrders m ON u.id = m.user_id;`,
        tip: 'Multiple CTEs improve readability and can be independently debugged and profiled.'
      }
    ]
  },
  {
    id: 'indexing-rules',
    title: 'Indexing & Performance Optimization',
    category: 'Indexes',
    snippets: [
      {
        title: 'Covering Index (Index-Only Scan)',
        description: 'Include all columns needed in SELECT to avoid table heap lookups',
        sql: `CREATE INDEX idx_users_covering ON users(email) INCLUDE (name, role);\n\nSELECT name, role FROM users WHERE email = 'alex@test.com';`,
        tip: 'INCLUDE adds payload columns to the leaf pages without modifying the search key sorting order.'
      },
      {
        title: 'Partial / Filtered Index',
        description: 'Index only a subset of rows to save 90% index size',
        sql: `CREATE INDEX idx_unprocessed_orders ON orders(created_at) WHERE status = 'pending';`,
        tip: 'Perfect for status queues (e.g. status = "pending" or deleted_at IS NULL).'
      },
      {
        title: 'GIN Index for JSONB & Full-Text Search',
        description: 'Index key-value contents within JSON documents',
        sql: `CREATE INDEX idx_products_specs ON products USING GIN (specifications);

-- Query with containment operator @>:
SELECT * FROM products WHERE specifications @> '{"processor": "M3", "ram": "32GB"}';`,
        tip: 'GIN decomposes JSON structures into key/value tokens, enabling instant containment lookups.'
      }
    ]
  },
  {
    id: 'transactions-locking',
    title: 'Transactions, Concurrency & Locking',
    category: 'Transactions',
    snippets: [
      {
        title: 'Pessimistic Row Lock with SELECT FOR UPDATE',
        description: 'Serialize updates to sensitive balances and inventory',
        sql: `BEGIN;

SELECT balance 
FROM user_accounts 
WHERE id = 42 
FOR UPDATE; -- Blocks concurrent modifications!

UPDATE user_accounts 
SET balance = balance - 150 
WHERE id = 42;

COMMIT;`,
        tip: 'Always acquire locks in consistent Primary Key order to prevent distributed deadlocks.'
      },
      {
        title: 'Distributed Background Job Queue with SKIP LOCKED',
        description: 'Lock-free concurrent worker queue in pure SQL',
        sql: `BEGIN;

SELECT id, payload 
FROM job_queue 
WHERE status = 'pending' 
ORDER BY priority DESC, created_at ASC 
LIMIT 1 
FOR UPDATE SKIP LOCKED; -- Skips jobs locked by other concurrent workers!

UPDATE job_queue SET status = 'processing' WHERE id = :job_id;

COMMIT;`,
        tip: 'SKIP LOCKED enables high-throughput job worker pools without race conditions or thread blocking.'
      }
    ]
  }
];
