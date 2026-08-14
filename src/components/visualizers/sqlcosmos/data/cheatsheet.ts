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
      }
    ]
  }
];
