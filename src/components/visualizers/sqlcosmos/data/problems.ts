import type { SqlRow } from '../lib/sqlSubsetEvaluator';

export type ProblemDifficulty = 'Easy' | 'Intermediate' | 'Advanced' | 'Expert';

export interface SqlProblem {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  category: string;
  description: string;
  hint: string;
  initialSql: string;
  solutionSql: string;
  tablesUsed: string[];
  expectedOutputSummary: string;
  validate: (rows: SqlRow[], columns: string[]) => boolean;
}

export const SQL_PROBLEMS: SqlProblem[] = [
  // EASY (1-10)
  {
    id: 'ch-1',
    title: 'Filter Developers',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Write a SQL query to select all user records where the role is "developer".',
    hint: "Use SELECT * FROM users WHERE role = 'developer';",
    initialSql: "SELECT * FROM users WHERE role = 'developer';",
    solutionSql: "SELECT * FROM users WHERE role = 'developer';",
    tablesUsed: ['users'],
    expectedOutputSummary: '2 rows (Bob, Charlie) with developer role',
    validate: (rows) => rows.length === 2 && rows.every((r) => r.role === 'developer'),
  },
  {
    id: 'ch-2',
    title: 'High-Value Orders',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Query all orders where the total price is strictly greater than 200.',
    hint: 'Use SELECT * FROM orders WHERE total > 200;',
    initialSql: 'SELECT * FROM orders WHERE total > 200;',
    solutionSql: 'SELECT * FROM orders WHERE total > 200;',
    tablesUsed: ['orders'],
    expectedOutputSummary: '2 rows (MacBook Pro $2499, 4K Monitor $450)',
    validate: (rows) => rows.length === 2 && rows.every((r) => Number(r.total) > 200),
  },
  {
    id: 'ch-3',
    title: 'US Customers',
    difficulty: 'Easy',
    category: 'Projections & Filtering',
    description: 'Select the name, email, and country columns for all users residing in "US".',
    hint: "SELECT name, email, country FROM users WHERE country = 'US';",
    initialSql: "SELECT name, email, country FROM users WHERE country = 'US';",
    solutionSql: "SELECT name, email, country FROM users WHERE country = 'US';",
    tablesUsed: ['users'],
    expectedOutputSummary: '2 rows (Alice, Charlie) with name, email, and country',
    validate: (rows, cols) =>
      rows.length === 2 &&
      rows.every((r) => r.country === 'US') &&
      cols.includes('name') &&
      cols.includes('country'),
  },
  {
    id: 'ch-4',
    title: 'Budget Purchases',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Query all orders with total price less than or equal to $150.',
    hint: 'SELECT * FROM orders WHERE total <= 150;',
    initialSql: 'SELECT * FROM orders WHERE total <= 150;',
    solutionSql: 'SELECT * FROM orders WHERE total <= 150;',
    tablesUsed: ['orders'],
    expectedOutputSummary: '2 rows (Magic Mouse $99, Mechanical Keyboard $150)',
    validate: (rows) =>
      rows.length === 2 && rows.every((r) => Number(r.total) <= 150),
  },
  {
    id: 'ch-5',
    title: 'Designer Profile Lookup',
    difficulty: 'Easy',
    category: 'Projections & Filtering',
    description: 'Select the name and email for users with role = "designer".',
    hint: "SELECT name, email FROM users WHERE role = 'designer';",
    initialSql: "SELECT name, email FROM users WHERE role = 'designer';",
    solutionSql: "SELECT name, email FROM users WHERE role = 'designer';",
    tablesUsed: ['users'],
    expectedOutputSummary: '1 row (Diana) with name and email',
    validate: (rows, cols) =>
      rows.length === 1 &&
      rows[0].name === 'Diana' &&
      cols.includes('name') &&
      cols.includes('email'),
  },
  {
    id: 'ch-6',
    title: 'Canadian User Search',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Select all columns for users residing in Canada (country = "CA").',
    hint: "SELECT * FROM users WHERE country = 'CA';",
    initialSql: "SELECT * FROM users WHERE country = 'CA';",
    solutionSql: "SELECT * FROM users WHERE country = 'CA';",
    tablesUsed: ['users'],
    expectedOutputSummary: '1 row (Bob, Canadian developer)',
    validate: (rows) => rows.length === 1 && rows[0].country === 'CA' && rows[0].name === 'Bob',
  },
  {
    id: 'ch-7',
    title: 'Top Tier Hardware Purchases',
    difficulty: 'Easy',
    category: 'Filtering & Comparison',
    description: 'Find all order records with a total purchase value of 1000 or greater.',
    hint: 'SELECT * FROM orders WHERE total >= 1000;',
    initialSql: 'SELECT * FROM orders WHERE total >= 1000;',
    solutionSql: 'SELECT * FROM orders WHERE total >= 1000;',
    tablesUsed: ['orders'],
    expectedOutputSummary: '1 row (MacBook Pro at $2499.0)',
    validate: (rows) => rows.length === 1 && Number(rows[0].total) >= 1000,
  },
  {
    id: 'ch-8',
    title: 'Customer Contact Roster',
    difficulty: 'Easy',
    category: 'Projections',
    description: 'Select only the name and email columns for all users to construct an address book.',
    hint: 'SELECT name, email FROM users;',
    initialSql: 'SELECT name, email FROM users;',
    solutionSql: 'SELECT name, email FROM users;',
    tablesUsed: ['users'],
    expectedOutputSummary: '4 rows containing only name and email columns',
    validate: (rows, cols) =>
      rows.length === 4 &&
      cols.includes('name') &&
      cols.includes('email') &&
      !cols.includes('id'),
  },
  {
    id: 'ch-9',
    title: 'Display Hardware Catalog',
    difficulty: 'Easy',
    category: 'Specific Equality',
    description: 'Locate the order record that corresponds strictly to the "4K Monitor".',
    hint: "SELECT * FROM orders WHERE product = '4K Monitor';",
    initialSql: "SELECT * FROM orders WHERE product = '4K Monitor';",
    solutionSql: "SELECT * FROM orders WHERE product = '4K Monitor';",
    tablesUsed: ['orders'],
    expectedOutputSummary: '1 row for order #104 ($450.0)',
    validate: (rows) => rows.length === 1 && rows[0].product === '4K Monitor',
  },
  {
    id: 'ch-10',
    title: 'Sub-100 Dollar Accessories',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Select all orders whose total cost is strictly less than 100.',
    hint: 'SELECT * FROM orders WHERE total < 100;',
    initialSql: 'SELECT * FROM orders WHERE total < 100;',
    solutionSql: 'SELECT * FROM orders WHERE total < 100;',
    tablesUsed: ['orders'],
    expectedOutputSummary: '1 row (Magic Mouse at $99.0)',
    validate: (rows) => rows.length === 1 && Number(rows[0].total) < 100,
  },

  // INTERMEDIATE (11-18)
  {
    id: 'ch-11',
    title: 'Relational Inner Join',
    difficulty: 'Intermediate',
    category: 'Joins & Relations',
    description: 'Join users and orders on user_id to display user name, order product, and order total for orders over $100.',
    hint: 'SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;',
    initialSql: 'SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;',
    solutionSql: 'SELECT u.name, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;',
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '3 rows (MacBook Pro, Mechanical Keyboard, 4K Monitor)',
    validate: (rows, cols) =>
      rows.length === 3 &&
      cols.includes('name') &&
      cols.includes('product') &&
      rows.every((r) => Number(r.total || r['o.total']) > 100),
  },
  {
    id: 'ch-12',
    title: 'Developer Equipment Orders',
    difficulty: 'Intermediate',
    category: 'Joins & Relations',
    description: 'Join users and orders on u.id = o.user_id to list all orders placed by users holding the "developer" role.',
    hint: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'developer';",
    initialSql: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'developer';",
    solutionSql: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'developer';",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '2 rows for developer orders (Bob & Charlie)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every((r) => r.role === 'developer' || r['u.role'] === 'developer'),
  },
  {
    id: 'ch-13',
    title: 'US Orders Spending Audit',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join users and orders to find all purchases made by users residing in the "US" where total exceeds 200.',
    hint: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'US' AND o.total > 200;",
    initialSql: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'US' AND o.total > 200;",
    solutionSql: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'US' AND o.total > 200;",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '2 rows (Alice $2499, Charlie $450)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every((r) => {
        const country = r.country ?? r['u.country'];
        const total = Number(r.total ?? r['o.total']);
        return country === 'US' && total > 200;
      }),
  },
  {
    id: 'ch-14',
    title: 'Non-Developer Purchasing Audit',
    difficulty: 'Intermediate',
    category: 'Joins & Negation',
    description: 'Identify all orders placed by users who do NOT have the role "developer".',
    hint: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role != 'developer';",
    initialSql: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role != 'developer';",
    solutionSql: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role != 'developer';",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '2 rows (Alice’s MacBook and Magic Mouse orders)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every((r) => (r.role ?? r['u.role']) !== 'developer'),
  },
  {
    id: 'ch-15',
    title: 'Admin Hardware Orders',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Retrieve user email and order details for all purchases made by an "admin".',
    hint: "SELECT u.name, u.email, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'admin';",
    initialSql: "SELECT u.name, u.email, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'admin';",
    solutionSql: "SELECT u.name, u.email, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'admin';",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '2 rows belonging to admin Alice',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every((r) => (r.email ?? r['u.email']) === 'alice@test.com'),
  },
  {
    id: 'ch-16',
    title: 'Canadian Procurement Record',
    difficulty: 'Intermediate',
    category: 'Multi-Table Filtering',
    description: 'Join users and orders to retrieve all products ordered by Canadian accounts ("CA").',
    hint: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'CA';",
    initialSql: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'CA';",
    solutionSql: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'CA';",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '1 row for Bob in Canada ($150 Keyboard)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].country ?? rows[0]['u.country']) === 'CA',
  },
  {
    id: 'ch-17',
    title: 'Column Aliasing & Presentation',
    difficulty: 'Intermediate',
    category: 'Aliasing & Projection',
    description: 'Join users and orders and project u.name AS customer_name and o.product AS item_ordered for orders over 100.',
    hint: 'SELECT u.name AS customer_name, o.product AS item_ordered FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;',
    initialSql: 'SELECT u.name AS customer_name, o.product AS item_ordered FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;',
    solutionSql: 'SELECT u.name AS customer_name, o.product AS item_ordered FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100;',
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '3 rows with custom aliases customer_name & item_ordered',
    validate: (rows, cols) =>
      rows.length === 3 &&
      cols.includes('customer_name') &&
      cols.includes('item_ordered'),
  },
  {
    id: 'ch-18',
    title: 'Mid-Range Peripherals',
    difficulty: 'Intermediate',
    category: 'Range Compound Conditions',
    description: 'Query the orders table for items priced strictly between $100 and $500 (total > 100 AND total < 500).',
    hint: 'SELECT * FROM orders WHERE total > 100 AND total < 500;',
    initialSql: 'SELECT * FROM orders WHERE total > 100 AND total < 500;',
    solutionSql: 'SELECT * FROM orders WHERE total > 100 AND total < 500;',
    tablesUsed: ['orders'],
    expectedOutputSummary: '2 rows (Mechanical Keyboard $150, 4K Monitor $450)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every((r) => Number(r.total) > 100 && Number(r.total) < 500),
  },

  // ADVANCED (19-23)
  {
    id: 'ch-19',
    title: 'High-Value US Developer Purchases',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Find all purchases where the user is a "developer", resides in "US", and the order total is 400 or greater.',
    hint: "SELECT u.name, u.role, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'developer' AND u.country = 'US' AND o.total >= 400;",
    initialSql: "SELECT u.name, u.role, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'developer' AND u.country = 'US' AND o.total >= 400;",
    solutionSql: "SELECT u.name, u.role, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role = 'developer' AND u.country = 'US' AND o.total >= 400;",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '1 row (Charlie: 4K Monitor at $450.0)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Charlie' || rows[0]['u.name'] === 'Charlie'),
  },
  {
    id: 'ch-20',
    title: 'Multi-Condition Exclusion Filter',
    difficulty: 'Advanced',
    category: 'Exclusion & Compound Logic',
    description: 'Select all orders from the orders table where total is strictly greater than 100 AND product != "Magic Mouse".',
    hint: "SELECT * FROM orders WHERE total > 100 AND product != 'Magic Mouse';",
    initialSql: "SELECT * FROM orders WHERE total > 100 AND product != 'Magic Mouse';",
    solutionSql: "SELECT * FROM orders WHERE total > 100 AND product != 'Magic Mouse';",
    tablesUsed: ['orders'],
    expectedOutputSummary: '3 rows excluding Magic Mouse',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every((r) => Number(r.total) > 100 && r.product !== 'Magic Mouse'),
  },
  {
    id: 'ch-21',
    title: 'Cross-Border Procurement Audit',
    difficulty: 'Advanced',
    category: 'Relational Projection & Filtering',
    description: 'Join users and orders to list all transactions where country != "US" AND total >= 100.',
    hint: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country != 'US' AND o.total >= 100;",
    initialSql: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country != 'US' AND o.total >= 100;",
    solutionSql: "SELECT u.name, u.country, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country != 'US' AND o.total >= 100;",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '1 row (Bob in CA with $150 transaction)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].country ?? rows[0]['u.country']) === 'CA',
  },
  {
    id: 'ch-22',
    title: 'Role-Based Budget Sourcing',
    difficulty: 'Advanced',
    category: 'Compound Relational Predicates',
    description: 'Find all orders placed by users where role != "admin" AND total <= 200.',
    hint: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role != 'admin' AND o.total <= 200;",
    initialSql: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role != 'admin' AND o.total <= 200;",
    solutionSql: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.role != 'admin' AND o.total <= 200;",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '1 row (Bob, developer with $150 keyboard)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Bob' || rows[0]['u.name'] === 'Bob'),
  },
  {
    id: 'ch-23',
    title: 'Strict Multi-Predicate User Scan',
    difficulty: 'Advanced',
    category: 'Exact Multi-Predicate Match',
    description: 'Select all users whose country is "US" AND role = "developer" AND id >= 3.',
    hint: "SELECT * FROM users WHERE country = 'US' AND role = 'developer' AND id >= 3;",
    initialSql: "SELECT * FROM users WHERE country = 'US' AND role = 'developer' AND id >= 3;",
    solutionSql: "SELECT * FROM users WHERE country = 'US' AND role = 'developer' AND id >= 3;",
    tablesUsed: ['users'],
    expectedOutputSummary: '1 row (Charlie: id=3, US developer)',
    validate: (rows) =>
      rows.length === 1 && rows[0].name === 'Charlie',
  },

  // EXPERT (24-25)
  {
    id: 'ch-24',
    title: 'Enterprise Boundary Spend Join',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join users and orders selecting customer email, product, and total where u.country = "US" AND o.total > 50 AND o.total < 2000.',
    hint: "SELECT u.email, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'US' AND o.total > 50 AND o.total < 2000;",
    initialSql: "SELECT u.email, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'US' AND o.total > 50 AND o.total < 2000;",
    solutionSql: "SELECT u.email, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE u.country = 'US' AND o.total > 50 AND o.total < 2000;",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '2 rows (Alice Magic Mouse $99, Charlie 4K Monitor $450)',
    validate: (rows, cols) =>
      rows.length === 2 &&
      cols.includes('email') &&
      cols.includes('product') &&
      rows.every((r) => {
        const total = Number(r.total ?? r['o.total']);
        return total > 50 && total < 2000;
      }),
  },
  {
    id: 'ch-25',
    title: 'High-Cap Enterprise Expenditure Audit',
    difficulty: 'Expert',
    category: 'Schema Audit & Constraint Check',
    description: 'Perform a qualified join to verify transactions of $2000 or greater placed by users located in "US".',
    hint: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total >= 2000 AND u.country = 'US';",
    initialSql: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total >= 2000 AND u.country = 'US';",
    solutionSql: "SELECT u.name, u.role, o.product, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total >= 2000 AND u.country = 'US';",
    tablesUsed: ['users', 'orders'],
    expectedOutputSummary: '1 row (Alice, admin, MacBook Pro $2499.0)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Alice' || rows[0]['u.name'] === 'Alice') &&
      Number(rows[0].total ?? rows[0]['o.total']) >= 2000,
  },
];

export function getProblemById(id: string): SqlProblem | undefined {
  return SQL_PROBLEMS.find((p) => p.id === id);
}
