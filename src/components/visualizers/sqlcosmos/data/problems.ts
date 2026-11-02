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

  // EASY (26-45)
  {
    id: 'ch-26',
    title: 'All Hardware Products',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Query all products from the products table where the category is "Hardware".',
    hint: "SELECT * FROM products WHERE category = 'Hardware';",
    initialSql: "SELECT * FROM products WHERE category = 'Hardware';",
    solutionSql: "SELECT * FROM products WHERE category = 'Hardware';",
    tablesUsed: ['products'],
    expectedOutputSummary: '2 rows (MacBook Pro, Webcam 1080p)',
    validate: (rows) => rows.length === 2 && rows.every((r) => r.category === 'Hardware'),
  },
  {
    id: 'ch-27',
    title: 'High-Stock Inventory',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Select all products whose current stock is greater than or equal to 40 units.',
    hint: 'SELECT * FROM products WHERE stock >= 40;',
    initialSql: 'SELECT * FROM products WHERE stock >= 40;',
    solutionSql: 'SELECT * FROM products WHERE stock >= 40;',
    tablesUsed: ['products'],
    expectedOutputSummary: '3 rows (Magic Mouse, USB-C Dock, Standing Desk Mat)',
    validate: (rows) => rows.length === 3 && rows.every((r) => Number(r.stock) >= 40),
  },
  {
    id: 'ch-28',
    title: 'Product Pricing Directory',
    difficulty: 'Easy',
    category: 'Projections',
    description: 'Project only the name and price columns for all products in inventory.',
    hint: 'SELECT name, price FROM products;',
    initialSql: 'SELECT name, price FROM products;',
    solutionSql: 'SELECT name, price FROM products;',
    tablesUsed: ['products'],
    expectedOutputSummary: '8 rows containing only name and price columns',
    validate: (rows, cols) =>
      rows.length === 8 &&
      cols.includes('name') &&
      cols.includes('price') &&
      !cols.includes('id'),
  },
  {
    id: 'ch-29',
    title: 'Display Category Products',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Select all product records classified under category "Displays".',
    hint: "SELECT * FROM products WHERE category = 'Displays';",
    initialSql: "SELECT * FROM products WHERE category = 'Displays';",
    solutionSql: "SELECT * FROM products WHERE category = 'Displays';",
    tablesUsed: ['products'],
    expectedOutputSummary: '1 row (4K Monitor at $450)',
    validate: (rows) => rows.length === 1 && rows[0].name === '4K Monitor',
  },
  {
    id: 'ch-30',
    title: 'Audio Hardware Catalog',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Find all items in products belonging to the "Audio" category.',
    hint: "SELECT * FROM products WHERE category = 'Audio';",
    initialSql: "SELECT * FROM products WHERE category = 'Audio';",
    solutionSql: "SELECT * FROM products WHERE category = 'Audio';",
    tablesUsed: ['products'],
    expectedOutputSummary: '1 row (Noise-Canceling Headphones at $349)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Noise-Canceling Headphones',
  },
  {
    id: 'ch-31',
    title: 'Department Floor Lookup',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Query all departments located on floor 3.',
    hint: 'SELECT * FROM departments WHERE floor = 3;',
    initialSql: 'SELECT * FROM departments WHERE floor = 3;',
    solutionSql: 'SELECT * FROM departments WHERE floor = 3;',
    tablesUsed: ['departments'],
    expectedOutputSummary: '2 rows (Engineering and Infrastructure)',
    validate: (rows) => rows.length === 2 && rows.every((r) => Number(r.floor) === 3),
  },
  {
    id: 'ch-32',
    title: 'Large Budget Departments',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Select all departments with an annual budget greater than or equal to 300000.',
    hint: 'SELECT * FROM departments WHERE budget >= 300000;',
    initialSql: 'SELECT * FROM departments WHERE budget >= 300000;',
    solutionSql: 'SELECT * FROM departments WHERE budget >= 300000;',
    tablesUsed: ['departments'],
    expectedOutputSummary: '2 rows (Engineering $500k, Infrastructure $350k)',
    validate: (rows) => rows.length === 2 && rows.every((r) => Number(r.budget) >= 300000),
  },
  {
    id: 'ch-33',
    title: 'Department Names and Budgets',
    difficulty: 'Easy',
    category: 'Projections',
    description: 'Select only the name and budget columns for all departments.',
    hint: 'SELECT name, budget FROM departments;',
    initialSql: 'SELECT name, budget FROM departments;',
    solutionSql: 'SELECT name, budget FROM departments;',
    tablesUsed: ['departments'],
    expectedOutputSummary: '4 rows containing only name and budget',
    validate: (rows, cols) =>
      rows.length === 4 &&
      cols.includes('name') &&
      cols.includes('budget') &&
      !cols.includes('id'),
  },
  {
    id: 'ch-34',
    title: 'High-Earner Employees',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Select all employees with a salary strictly greater than 140000.',
    hint: 'SELECT * FROM employees WHERE salary > 140000;',
    initialSql: 'SELECT * FROM employees WHERE salary > 140000;',
    solutionSql: 'SELECT * FROM employees WHERE salary > 140000;',
    tablesUsed: ['employees'],
    expectedOutputSummary: '2 rows (Alice $185k, Bob $145k)',
    validate: (rows) => rows.length === 2 && rows.every((r) => Number(r.salary) > 140000),
  },
  {
    id: 'ch-35',
    title: 'Senior Tenured Staff',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Query all employees who have 6 or more years of experience (experience_years >= 6).',
    hint: 'SELECT * FROM employees WHERE experience_years >= 6;',
    initialSql: 'SELECT * FROM employees WHERE experience_years >= 6;',
    solutionSql: 'SELECT * FROM employees WHERE experience_years >= 6;',
    tablesUsed: ['employees'],
    expectedOutputSummary: '4 rows (Alice 10yr, Bob 6yr, Diana 7yr, Fiona 6yr)',
    validate: (rows) => rows.length === 4 && rows.every((r) => Number(r.experience_years) >= 6),
  },
  {
    id: 'ch-36',
    title: 'Employee Title Roster',
    difficulty: 'Easy',
    category: 'Projections',
    description: 'Select the name, title, and salary columns for all employees.',
    hint: 'SELECT name, title, salary FROM employees;',
    initialSql: 'SELECT name, title, salary FROM employees;',
    solutionSql: 'SELECT name, title, salary FROM employees;',
    tablesUsed: ['employees'],
    expectedOutputSummary: '8 rows with name, title, and salary',
    validate: (rows, cols) =>
      rows.length === 8 &&
      cols.includes('name') &&
      cols.includes('title') &&
      cols.includes('salary'),
  },
  {
    id: 'ch-37',
    title: 'Enterprise Tier Customers',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Select all customers classified as "Enterprise" tier.',
    hint: "SELECT * FROM customers WHERE tier = 'Enterprise';",
    initialSql: "SELECT * FROM customers WHERE tier = 'Enterprise';",
    solutionSql: "SELECT * FROM customers WHERE tier = 'Enterprise';",
    tablesUsed: ['customers'],
    expectedOutputSummary: '2 rows (Acme Corp, Globex Ltd)',
    validate: (rows) => rows.length === 2 && rows.every((r) => r.tier === 'Enterprise'),
  },
  {
    id: 'ch-38',
    title: 'High Credit Limit Accounts',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Query all customer accounts with a credit limit greater than 30000.',
    hint: 'SELECT * FROM customers WHERE credit_limit > 30000;',
    initialSql: 'SELECT * FROM customers WHERE credit_limit > 30000;',
    solutionSql: 'SELECT * FROM customers WHERE credit_limit > 30000;',
    tablesUsed: ['customers'],
    expectedOutputSummary: '2 rows (Acme Corp $50k, Globex Ltd $45k)',
    validate: (rows) => rows.length === 2 && rows.every((r) => Number(r.credit_limit) > 30000),
  },
  {
    id: 'ch-39',
    title: 'German Customer Directory',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Query all customer records located in Germany (country = "DE").',
    hint: "SELECT * FROM customers WHERE country = 'DE';",
    initialSql: "SELECT * FROM customers WHERE country = 'DE';",
    solutionSql: "SELECT * FROM customers WHERE country = 'DE';",
    tablesUsed: ['customers'],
    expectedOutputSummary: '1 row (Soylent AI in Berlin)',
    validate: (rows) => rows.length === 1 && rows[0].country === 'DE',
  },
  {
    id: 'ch-40',
    title: 'Pending Invoice Records',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Select all invoices where status is "pending".',
    hint: "SELECT * FROM invoices WHERE status = 'pending';",
    initialSql: "SELECT * FROM invoices WHERE status = 'pending';",
    solutionSql: "SELECT * FROM invoices WHERE status = 'pending';",
    tablesUsed: ['invoices'],
    expectedOutputSummary: '2 rows (invoice #503 $8000, invoice #505 $2200)',
    validate: (rows) => rows.length === 2 && rows.every((r) => r.status === 'pending'),
  },
  {
    id: 'ch-41',
    title: 'Five-Figure Invoices',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Query all invoices where the amount is greater than or equal to 10000.',
    hint: 'SELECT * FROM invoices WHERE amount >= 10000;',
    initialSql: 'SELECT * FROM invoices WHERE amount >= 10000;',
    solutionSql: 'SELECT * FROM invoices WHERE amount >= 10000;',
    tablesUsed: ['invoices'],
    expectedOutputSummary: '2 rows (invoice #501 $12000, invoice #502 $15500)',
    validate: (rows) => rows.length === 2 && rows.every((r) => Number(r.amount) >= 10000),
  },
  {
    id: 'ch-42',
    title: 'Active Production Servers',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Select all servers from the servers table where status is "active".',
    hint: "SELECT * FROM servers WHERE status = 'active';",
    initialSql: "SELECT * FROM servers WHERE status = 'active';",
    solutionSql: "SELECT * FROM servers WHERE status = 'active';",
    tablesUsed: ['servers'],
    expectedOutputSummary: '4 rows (prod-api-01, prod-api-02, prod-db-master, prod-cache-01)',
    validate: (rows) => rows.length === 4 && rows.every((r) => r.status === 'active'),
  },
  {
    id: 'ch-43',
    title: 'High-Density Compute Nodes',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Select all servers with 16 or more CPU cores (cores >= 16).',
    hint: 'SELECT * FROM servers WHERE cores >= 16;',
    initialSql: 'SELECT * FROM servers WHERE cores >= 16;',
    solutionSql: 'SELECT * FROM servers WHERE cores >= 16;',
    tablesUsed: ['servers'],
    expectedOutputSummary: '3 rows (prod-api-01 16, prod-api-02 16, prod-db-master 32)',
    validate: (rows) => rows.length === 3 && rows.every((r) => Number(r.cores) >= 16),
  },
  {
    id: 'ch-44',
    title: 'Large Memory Fleet',
    difficulty: 'Easy',
    category: 'Threshold Filtering',
    description: 'Find all servers with ram_gb greater than 32.',
    hint: 'SELECT * FROM servers WHERE ram_gb > 32;',
    initialSql: 'SELECT * FROM servers WHERE ram_gb > 32;',
    solutionSql: 'SELECT * FROM servers WHERE ram_gb > 32;',
    tablesUsed: ['servers'],
    expectedOutputSummary: '3 rows (prod-api-01 64GB, prod-api-02 64GB, prod-db-master 128GB)',
    validate: (rows) => rows.length === 3 && rows.every((r) => Number(r.ram_gb) > 32),
  },
  {
    id: 'ch-45',
    title: 'European Infrastructure Fleet',
    difficulty: 'Easy',
    category: 'Filtering & Predicates',
    description: 'Select the hostname and region for all servers provisioned in "eu-west".',
    hint: "SELECT hostname, region FROM servers WHERE region = 'eu-west';",
    initialSql: "SELECT hostname, region FROM servers WHERE region = 'eu-west';",
    solutionSql: "SELECT hostname, region FROM servers WHERE region = 'eu-west';",
    tablesUsed: ['servers'],
    expectedOutputSummary: '2 rows (prod-cache-01, backup-node-01)',
    validate: (rows, cols) =>
      rows.length === 2 &&
      rows.every((r) => r.region === 'eu-west') &&
      cols.includes('hostname') &&
      cols.includes('region'),
  },

  // INTERMEDIATE (46-67)
  {
    id: 'ch-46',
    title: 'Budget Peripherals Scan',
    difficulty: 'Intermediate',
    category: 'Range Compound Conditions',
    description: 'Select name, price, and stock for all products in category "Peripherals" priced under 120.',
    hint: "SELECT name, price, stock FROM products WHERE category = 'Peripherals' AND price < 120;",
    initialSql: "SELECT name, price, stock FROM products WHERE category = 'Peripherals' AND price < 120;",
    solutionSql: "SELECT name, price, stock FROM products WHERE category = 'Peripherals' AND price < 120;",
    tablesUsed: ['products'],
    expectedOutputSummary: '1 row (Magic Mouse $99, stock 45)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Magic Mouse',
  },
  {
    id: 'ch-47',
    title: 'Mid-Tier Product Pricing',
    difficulty: 'Intermediate',
    category: 'Range Compound Conditions',
    description: 'Query products priced between $100 and $400 (price >= 100 AND price <= 400).',
    hint: 'SELECT * FROM products WHERE price >= 100 AND price <= 400;',
    initialSql: 'SELECT * FROM products WHERE price >= 100 AND price <= 400;',
    solutionSql: 'SELECT * FROM products WHERE price >= 100 AND price <= 400;',
    tablesUsed: ['products'],
    expectedOutputSummary: '3 rows (Mechanical Keyboard $150, Headphones $349, Webcam $119)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every((r) => Number(r.price) >= 100 && Number(r.price) <= 400),
  },
  {
    id: 'ch-48',
    title: 'Low-Stock Urgent Replenishment',
    difficulty: 'Intermediate',
    category: 'Range Compound Conditions',
    description: 'Find all products where stock is strictly less than 25 AND price >= 100.',
    hint: 'SELECT * FROM products WHERE stock < 25 AND price >= 100;',
    initialSql: 'SELECT * FROM products WHERE stock < 25 AND price >= 100;',
    solutionSql: 'SELECT * FROM products WHERE stock < 25 AND price >= 100;',
    tablesUsed: ['products'],
    expectedOutputSummary: '3 rows (MacBook Pro 15, 4K Monitor 20, Headphones 12)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every((r) => Number(r.stock) < 25 && Number(r.price) >= 100),
  },
  {
    id: 'ch-49',
    title: 'Department Staff Inner Join',
    difficulty: 'Intermediate',
    category: 'Joins & Relations',
    description: 'Join employees and departments on department_id = d.id to display employee name, department name, and salary.',
    hint: 'SELECT e.name, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id;',
    initialSql: 'SELECT e.name, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id;',
    solutionSql: 'SELECT e.name, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '8 rows with e.name, dept_name, and salary',
    validate: (rows, cols) =>
      rows.length === 8 &&
      cols.includes('name') &&
      cols.includes('dept_name') &&
      cols.includes('salary'),
  },
  {
    id: 'ch-50',
    title: 'Engineering Department Staff',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join employees and departments to list all employees who belong to department_id = 1 (Engineering).',
    hint: 'SELECT e.name, e.title, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1;',
    initialSql: 'SELECT e.name, e.title, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1;',
    solutionSql: 'SELECT e.name, e.title, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '3 rows (Alice, Bob, George)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every((r) => r.name === 'Alice' || r.name === 'Bob' || r.name === 'George'),
  },
  {
    id: 'ch-51',
    title: 'Design Department Salaries',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join employees and departments on department_id = d.id to find all staff in department_id = 2 earning over 100000.',
    hint: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.salary > 100000;',
    initialSql: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.salary > 100000;',
    solutionSql: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.salary > 100000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '2 rows (Diana $130k, Evan $110k)',
    validate: (rows) =>
      rows.length === 2 && rows.every((r) => Number(r.salary) > 100000),
  },
  {
    id: 'ch-52',
    title: 'Third-Floor Staff Roster',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join employees and departments to display all employees whose department is stationed on floor 3.',
    hint: 'SELECT e.name, e.title, d.name AS dept_name, d.floor FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3;',
    initialSql: 'SELECT e.name, e.title, d.name AS dept_name, d.floor FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3;',
    solutionSql: 'SELECT e.name, e.title, d.name AS dept_name, d.floor FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '5 rows (Alice, Bob, Charlie, George, Hannah)',
    validate: (rows) =>
      rows.length === 5 &&
      rows.every((r) => Number(r.floor ?? r['d.floor']) === 3),
  },
  {
    id: 'ch-53',
    title: 'Customer Invoices Inner Join',
    difficulty: 'Intermediate',
    category: 'Joins & Relations',
    description: 'Join customers and invoices on c.id = i.customer_id to display customer name, invoice amount, and payment status.',
    hint: 'SELECT c.name, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id;',
    initialSql: 'SELECT c.name, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id;',
    solutionSql: 'SELECT c.name, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id;',
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '6 invoice records with customer name, amount, and status',
    validate: (rows, cols) =>
      rows.length === 6 &&
      cols.includes('name') &&
      cols.includes('amount') &&
      cols.includes('status'),
  },
  {
    id: 'ch-54',
    title: 'Paid Customer Invoices',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join customers and invoices on c.id = i.customer_id to retrieve all invoices that have status = "paid".',
    hint: "SELECT c.name, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.status = 'paid';",
    initialSql: "SELECT c.name, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.status = 'paid';",
    solutionSql: "SELECT c.name, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.status = 'paid';",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '4 rows of paid invoices (Acme x2, Initech, Soylent AI)',
    validate: (rows) =>
      rows.length === 4 &&
      rows.every((r) => (r.status ?? r['i.status']) === 'paid'),
  },
  {
    id: 'ch-55',
    title: 'Pending Enterprise Receivables',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join customers and invoices to find all pending invoices for customers holding the "Enterprise" tier.',
    hint: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND i.status = 'pending';",
    initialSql: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND i.status = 'pending';",
    solutionSql: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND i.status = 'pending';",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Globex Ltd with $8000 pending invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Globex Ltd' || rows[0]['c.name'] === 'Globex Ltd'),
  },
  {
    id: 'ch-56',
    title: 'US Customer Billing Audit',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join customers and invoices to locate all invoice records for customers based in country = "US".',
    hint: "SELECT c.name, c.city, i.amount FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'US';",
    initialSql: "SELECT c.name, c.city, i.amount FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'US';",
    solutionSql: "SELECT c.name, c.city, i.amount FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'US';",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '3 rows (Acme $12000, Acme $15500, Initech $4500)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every(
        (r) =>
          r.name === 'Acme Corp' ||
          r.name === 'Initech' ||
          r['c.name'] === 'Acme Corp' ||
          r['c.name'] === 'Initech'
      ),
  },
  {
    id: 'ch-57',
    title: 'Active US-East Infrastructure',
    difficulty: 'Intermediate',
    category: 'Compound Predicates',
    description: 'Query the servers table for nodes located in region = "us-east" that are currently status = "active".',
    hint: "SELECT * FROM servers WHERE region = 'us-east' AND status = 'active';",
    initialSql: "SELECT * FROM servers WHERE region = 'us-east' AND status = 'active';",
    solutionSql: "SELECT * FROM servers WHERE region = 'us-east' AND status = 'active';",
    tablesUsed: ['servers'],
    expectedOutputSummary: '3 rows (prod-api-01, prod-api-02, prod-db-master)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every((r) => r.region === 'us-east' && r.status === 'active'),
  },
  {
    id: 'ch-58',
    title: 'Non-Active Server Audit',
    difficulty: 'Intermediate',
    category: 'Negation & Filtering',
    description: 'Find all servers whose status is NOT equal to "active" (status != "active").',
    hint: "SELECT hostname, region, status FROM servers WHERE status != 'active';",
    initialSql: "SELECT hostname, region, status FROM servers WHERE status != 'active';",
    solutionSql: "SELECT hostname, region, status FROM servers WHERE status != 'active';",
    tablesUsed: ['servers'],
    expectedOutputSummary: '2 rows (staging-app-01 idle, backup-node-01 maintenance)',
    validate: (rows) =>
      rows.length === 2 && rows.every((r) => r.status !== 'active'),
  },
  {
    id: 'ch-59',
    title: 'High-Spec European Nodes',
    difficulty: 'Intermediate',
    category: 'Compound Predicates',
    description: 'Query servers located in "eu-west" with ram_gb >= 32.',
    hint: "SELECT hostname, region, ram_gb FROM servers WHERE region = 'eu-west' AND ram_gb >= 32;",
    initialSql: "SELECT hostname, region, ram_gb FROM servers WHERE region = 'eu-west' AND ram_gb >= 32;",
    solutionSql: "SELECT hostname, region, ram_gb FROM servers WHERE region = 'eu-west' AND ram_gb >= 32;",
    tablesUsed: ['servers'],
    expectedOutputSummary: '2 rows (prod-cache-01, backup-node-01)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every((r) => r.region === 'eu-west' && Number(r.ram_gb) >= 32),
  },
  {
    id: 'ch-60',
    title: 'Junior Staff Identification',
    difficulty: 'Intermediate',
    category: 'Threshold Filtering',
    description: 'Select name, title, and experience_years for employees with less than 4 years of experience.',
    hint: 'SELECT name, title, experience_years FROM employees WHERE experience_years < 4;',
    initialSql: 'SELECT name, title, experience_years FROM employees WHERE experience_years < 4;',
    solutionSql: 'SELECT name, title, experience_years FROM employees WHERE experience_years < 4;',
    tablesUsed: ['employees'],
    expectedOutputSummary: '1 row (George, Junior Backend Developer with 2 years)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'George',
  },
  {
    id: 'ch-61',
    title: 'Security Staff Compensation',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join employees and departments on department_id = d.id for department_id = 4 (Security) to view staff compensation.',
    hint: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 4;',
    initialSql: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 4;',
    solutionSql: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 4;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '1 row (Fiona, Security Operations Engineer $140k)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Fiona',
  },
  {
    id: 'ch-62',
    title: 'Accessory Stock Audit',
    difficulty: 'Intermediate',
    category: 'Compound Predicates',
    description: 'Query products where category = "Accessories" AND price < 80.',
    hint: "SELECT name, category, price FROM products WHERE category = 'Accessories' AND price < 80;",
    initialSql: "SELECT name, category, price FROM products WHERE category = 'Accessories' AND price < 80;",
    solutionSql: "SELECT name, category, price FROM products WHERE category = 'Accessories' AND price < 80;",
    tablesUsed: ['products'],
    expectedOutputSummary: '1 row (Standing Desk Mat at $59)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Standing Desk Mat',
  },
  {
    id: 'ch-63',
    title: 'Fiscal Year 2026 Billings',
    difficulty: 'Intermediate',
    category: 'Compound Predicates',
    description: 'Select all invoices where year = 2026 AND amount > 5000.',
    hint: 'SELECT * FROM invoices WHERE year = 2026 AND amount > 5000;',
    initialSql: 'SELECT * FROM invoices WHERE year = 2026 AND amount > 5000;',
    solutionSql: 'SELECT * FROM invoices WHERE year = 2026 AND amount > 5000;',
    tablesUsed: ['invoices'],
    expectedOutputSummary: '4 rows (invoices #501, #502, #503, #506)',
    validate: (rows) =>
      rows.length === 4 &&
      rows.every((r) => Number(r.year) === 2026 && Number(r.amount) > 5000),
  },
  {
    id: 'ch-64',
    title: 'Growth Tier Accounts',
    difficulty: 'Intermediate',
    category: 'Filtering & Predicates',
    description: 'Query customers who hold tier = "Growth" AND credit_limit >= 20000.',
    hint: "SELECT name, city, country, credit_limit FROM customers WHERE tier = 'Growth' AND credit_limit >= 20000;",
    initialSql: "SELECT name, city, country, credit_limit FROM customers WHERE tier = 'Growth' AND credit_limit >= 20000;",
    solutionSql: "SELECT name, city, country, credit_limit FROM customers WHERE tier = 'Growth' AND credit_limit >= 20000;",
    tablesUsed: ['customers'],
    expectedOutputSummary: '2 rows (Initech in Austin, Soylent AI in Berlin)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every((r) => r.name === 'Initech' || r.name === 'Soylent AI'),
  },
  {
    id: 'ch-65',
    title: 'Custom Aliased Employee Compensation',
    difficulty: 'Intermediate',
    category: 'Aliasing & Projection',
    description: 'Select e.name AS full_name and e.salary AS annual_pay from employees for staff earning at least 135000.',
    hint: 'SELECT e.name AS full_name, e.salary AS annual_pay FROM employees e WHERE e.salary >= 135000;',
    initialSql: 'SELECT e.name AS full_name, e.salary AS annual_pay FROM employees e WHERE e.salary >= 135000;',
    solutionSql: 'SELECT e.name AS full_name, e.salary AS annual_pay FROM employees e WHERE e.salary >= 135000;',
    tablesUsed: ['employees'],
    expectedOutputSummary: '4 rows with columns full_name and annual_pay',
    validate: (rows, cols) =>
      rows.length === 4 &&
      cols.includes('full_name') &&
      cols.includes('annual_pay'),
  },
  {
    id: 'ch-66',
    title: 'Server Compute Core Density',
    difficulty: 'Intermediate',
    category: 'Compound Predicates',
    description: 'Select hostname, cores, ram_gb from servers where cores >= 8 AND cores <= 16.',
    hint: 'SELECT hostname, cores, ram_gb FROM servers WHERE cores >= 8 AND cores <= 16;',
    initialSql: 'SELECT hostname, cores, ram_gb FROM servers WHERE cores >= 8 AND cores <= 16;',
    solutionSql: 'SELECT hostname, cores, ram_gb FROM servers WHERE cores >= 8 AND cores <= 16;',
    tablesUsed: ['servers'],
    expectedOutputSummary: '4 rows (prod-api-01, prod-api-02, prod-cache-01, backup-node-01)',
    validate: (rows) =>
      rows.length === 4 &&
      rows.every((r) => Number(r.cores) >= 8 && Number(r.cores) <= 16),
  },
  {
    id: 'ch-67',
    title: 'High-Value Invoices in 2026',
    difficulty: 'Intermediate',
    category: 'Joins & Filtering',
    description: 'Join customers and invoices to find all 2026 invoices where amount >= 12000.',
    hint: 'SELECT c.name, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.year = 2026 AND i.amount >= 12000;',
    initialSql: 'SELECT c.name, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.year = 2026 AND i.amount >= 12000;',
    solutionSql: 'SELECT c.name, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.year = 2026 AND i.amount >= 12000;',
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '2 rows belonging to Acme Corp ($12000, $15500)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every(
        (r) =>
          (r.name === 'Acme Corp' || r['c.name'] === 'Acme Corp') &&
          Number(r.amount) >= 12000
      ),
  },

  // ADVANCED (68-87)
  {
    id: 'ch-68',
    title: 'High-Tenure Engineering Leadership',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join employees and departments to find employees in department_id = 1 with experience_years >= 6 AND salary >= 145000.',
    hint: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1 AND e.experience_years >= 6 AND e.salary >= 145000;',
    initialSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1 AND e.experience_years >= 6 AND e.salary >= 145000;',
    solutionSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1 AND e.experience_years >= 6 AND e.salary >= 145000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '2 rows (Alice $185k 10yr, Bob $145k 6yr)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every(
        (r) =>
          (r.name === 'Alice' || r.name === 'Bob') &&
          Number(r.salary) >= 145000
      ),
  },
  {
    id: 'ch-69',
    title: 'Cross-Department Senior Compensation Audit',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join employees and departments selecting staff where d.budget >= 300000 AND e.salary > 130000 AND e.experience_years >= 5.',
    hint: 'SELECT e.name, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.budget >= 300000 AND e.salary > 130000 AND e.experience_years >= 5;',
    initialSql: 'SELECT e.name, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.budget >= 300000 AND e.salary > 130000 AND e.experience_years >= 5;',
    solutionSql: 'SELECT e.name, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.budget >= 300000 AND e.salary > 130000 AND e.experience_years >= 5;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '3 rows (Alice in Engineering, Bob in Engineering, Charlie in Infrastructure)',
    validate: (rows) =>
      rows.length === 3 && rows.every((r) => Number(r.salary) > 130000),
  },
  {
    id: 'ch-70',
    title: 'Enterprise Customer Paid Revenue Audit',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join customers and invoices to find paid invoices from Enterprise customers with amount >= 10000.',
    hint: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND i.status = 'paid' AND i.amount >= 10000;",
    initialSql: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND i.status = 'paid' AND i.amount >= 10000;",
    solutionSql: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND i.status = 'paid' AND i.amount >= 10000;",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '2 rows (Acme Corp invoices of $12000 and $15500)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every(
        (r) =>
          (r.name === 'Acme Corp' || r['c.name'] === 'Acme Corp') &&
          Number(r.amount) >= 10000
      ),
  },
  {
    id: 'ch-71',
    title: 'SRE Fleet Capacity Qualification',
    difficulty: 'Advanced',
    category: 'Multi-Predicate Fleet Audit',
    description: 'Query servers where region = "us-east" AND status = "active" AND cores >= 16 AND ram_gb >= 64.',
    hint: "SELECT hostname, region, cores, ram_gb FROM servers WHERE region = 'us-east' AND status = 'active' AND cores >= 16 AND ram_gb >= 64;",
    initialSql: "SELECT hostname, region, cores, ram_gb FROM servers WHERE region = 'us-east' AND status = 'active' AND cores >= 16 AND ram_gb >= 64;",
    solutionSql: "SELECT hostname, region, cores, ram_gb FROM servers WHERE region = 'us-east' AND status = 'active' AND cores >= 16 AND ram_gb >= 64;",
    tablesUsed: ['servers'],
    expectedOutputSummary: '3 rows (prod-api-01, prod-api-02, prod-db-master)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every(
        (r) =>
          r.region === 'us-east' &&
          Number(r.cores) >= 16 &&
          Number(r.ram_gb) >= 64
      ),
  },
  {
    id: 'ch-72',
    title: 'High-Value Inventory Stock Ratio',
    difficulty: 'Advanced',
    category: 'Compound Threshold Filter',
    description: 'Query products table where price >= 300 AND stock <= 20.',
    hint: 'SELECT name, category, price, stock FROM products WHERE price >= 300 AND stock <= 20;',
    initialSql: 'SELECT name, category, price, stock FROM products WHERE price >= 300 AND stock <= 20;',
    solutionSql: 'SELECT name, category, price, stock FROM products WHERE price >= 300 AND stock <= 20;',
    tablesUsed: ['products'],
    expectedOutputSummary: '3 rows (MacBook Pro, 4K Monitor, Headphones)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every((r) => Number(r.price) >= 300 && Number(r.stock) <= 20),
  },
  {
    id: 'ch-73',
    title: 'Non-US Enterprise Accounts',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join customers and invoices to find invoices for Enterprise tier accounts where customer country != "US".',
    hint: "SELECT c.name, c.country, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND c.country != 'US';",
    initialSql: "SELECT c.name, c.country, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND c.country != 'US';",
    solutionSql: "SELECT c.name, c.country, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND c.country != 'US';",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Globex Ltd in UK with $8000 pending invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Globex Ltd' || rows[0]['c.name'] === 'Globex Ltd'),
  },
  {
    id: 'ch-74',
    title: 'Infrastructure SRE Staff Audit',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join employees and departments on department_id = d.id for department_id = 3 (Infrastructure) with salary >= 130000.',
    hint: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 3 AND e.salary >= 130000;',
    initialSql: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 3 AND e.salary >= 130000;',
    solutionSql: 'SELECT e.name, e.title, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 3 AND e.salary >= 130000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '1 row (Charlie, Site Reliability Engineer $135k)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Charlie',
  },
  {
    id: 'ch-75',
    title: 'Mid-Market German Revenue Check',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join customers and invoices for customers in country = "DE" where status = "paid" AND amount > 8000.',
    hint: "SELECT c.name, c.city, i.amount FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'DE' AND i.status = 'paid' AND i.amount > 8000;",
    initialSql: "SELECT c.name, c.city, i.amount FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'DE' AND i.status = 'paid' AND i.amount > 8000;",
    solutionSql: "SELECT c.name, c.city, i.amount FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'DE' AND i.status = 'paid' AND i.amount > 8000;",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Soylent AI in Berlin with $9500 paid invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Soylent AI' || rows[0]['c.name'] === 'Soylent AI'),
  },
  {
    id: 'ch-76',
    title: 'Database Master Server Verification',
    difficulty: 'Advanced',
    category: 'Multi-Predicate Fleet Audit',
    description: 'Select hostname, cores, ram_gb from servers where cores >= 32 AND status = "active".',
    hint: "SELECT hostname, cores, ram_gb FROM servers WHERE cores >= 32 AND status = 'active';"
,
    initialSql: "SELECT hostname, cores, ram_gb FROM servers WHERE cores >= 32 AND status = 'active';",
    solutionSql: "SELECT hostname, cores, ram_gb FROM servers WHERE cores >= 32 AND status = 'active';",
    tablesUsed: ['servers'],
    expectedOutputSummary: '1 row (prod-db-master with 32 cores, 128GB RAM)',
    validate: (rows) => rows.length === 1 && rows[0].hostname === 'prod-db-master',
  },
  {
    id: 'ch-77',
    title: 'Design Department Leadership Compensation',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join employees and departments for department_id = 2 where experience_years >= 5 AND salary >= 120000.',
    hint: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.experience_years >= 5 AND e.salary >= 120000;',
    initialSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.experience_years >= 5 AND e.salary >= 120000;',
    solutionSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.experience_years >= 5 AND e.salary >= 120000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '1 row (Diana, Product Design Lead $130k)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Diana',
  },
  {
    id: 'ch-78',
    title: 'High-Volume Accessory Stock',
    difficulty: 'Advanced',
    category: 'Compound Predicates',
    description: 'Select name, price, stock from products where category = "Accessories" AND stock >= 50 AND price < 100.',
    hint: "SELECT name, price, stock FROM products WHERE category = 'Accessories' AND stock >= 50 AND price < 100;",
    initialSql: "SELECT name, price, stock FROM products WHERE category = 'Accessories' AND stock >= 50 AND price < 100;",
    solutionSql: "SELECT name, price, stock FROM products WHERE category = 'Accessories' AND stock >= 50 AND price < 100;",
    tablesUsed: ['products'],
    expectedOutputSummary: '1 row (USB-C Dock at $89, 60 stock)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'USB-C Dock',
  },
  {
    id: 'ch-79',
    title: 'Starter Tier Billing Exception',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join customers and invoices to find pending invoices for accounts with tier = "Starter".',
    hint: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Starter' AND i.status = 'pending';",
    initialSql: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Starter' AND i.status = 'pending';",
    solutionSql: "SELECT c.name, c.tier, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Starter' AND i.status = 'pending';",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Umbrella Tech with $2200 pending invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Umbrella Tech' || rows[0]['c.name'] === 'Umbrella Tech'),
  },
  {
    id: 'ch-80',
    title: 'Experienced Security Personnel',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join employees and departments for department_id = 4 where experience_years >= 6 AND salary >= 130000.',
    hint: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 4 AND e.experience_years >= 6 AND e.salary >= 130000;',
    initialSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 4 AND e.experience_years >= 6 AND e.salary >= 130000;',
    solutionSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 4 AND e.experience_years >= 6 AND e.salary >= 130000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '1 row (Fiona, Security Operations Engineer)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Fiona',
  },
  {
    id: 'ch-81',
    title: 'High-Credit Growth Accounts',
    difficulty: 'Advanced',
    category: 'Compound Predicates',
    description: 'Query customers where tier = "Growth" AND credit_limit > 22000.',
    hint: "SELECT name, city, country, credit_limit FROM customers WHERE tier = 'Growth' AND credit_limit > 22000;",
    initialSql: "SELECT name, city, country, credit_limit FROM customers WHERE tier = 'Growth' AND credit_limit > 22000;",
    solutionSql: "SELECT name, city, country, credit_limit FROM customers WHERE tier = 'Growth' AND credit_limit > 22000;",
    tablesUsed: ['customers'],
    expectedOutputSummary: '1 row (Soylent AI with $25k limit)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Soylent AI',
  },
  {
    id: 'ch-82',
    title: 'Mid-Priced Hardware Accessories',
    difficulty: 'Advanced',
    category: 'Compound Predicates',
    description: 'Select name, price, stock from products where category = "Hardware" AND price < 500.',
    hint: "SELECT name, price, stock FROM products WHERE category = 'Hardware' AND price < 500;",
    initialSql: "SELECT name, price, stock FROM products WHERE category = 'Hardware' AND price < 500;",
    solutionSql: "SELECT name, price, stock FROM products WHERE category = 'Hardware' AND price < 500;",
    tablesUsed: ['products'],
    expectedOutputSummary: '1 row (Webcam 1080p at $119)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Webcam 1080p',
  },
  {
    id: 'ch-83',
    title: 'Floor 3 High-Salary Talent',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join employees and departments on department_id = d.id where d.floor = 3 AND e.salary >= 140000.',
    hint: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3 AND e.salary >= 140000;',
    initialSql: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3 AND e.salary >= 140000;',
    solutionSql: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3 AND e.salary >= 140000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '2 rows (Alice $185k, Bob $145k)',
    validate: (rows) =>
      rows.length === 2 && rows.every((r) => Number(r.salary) >= 140000),
  },
  {
    id: 'ch-84',
    title: 'European Maintenance Fleet Identification',
    difficulty: 'Advanced',
    category: 'Compound Predicates',
    description: 'Select hostname, region, status from servers where region = "eu-west" AND status = "maintenance".',
    hint: "SELECT hostname, region, status FROM servers WHERE region = 'eu-west' AND status = 'maintenance';",
    initialSql: "SELECT hostname, region, status FROM servers WHERE region = 'eu-west' AND status = 'maintenance';",
    solutionSql: "SELECT hostname, region, status FROM servers WHERE region = 'eu-west' AND status = 'maintenance';",
    tablesUsed: ['servers'],
    expectedOutputSummary: '1 row (backup-node-01)',
    validate: (rows) => rows.length === 1 && rows[0].hostname === 'backup-node-01',
  },
  {
    id: 'ch-85',
    title: 'Prior Fiscal Year Historical Billings',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join customers and invoices to find all invoices issued in year = 2025 where status = "paid".',
    hint: "SELECT c.name, i.amount, i.year, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.year = 2025 AND i.status = 'paid';",
    initialSql: "SELECT c.name, i.amount, i.year, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.year = 2025 AND i.status = 'paid';",
    solutionSql: "SELECT c.name, i.amount, i.year, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE i.year = 2025 AND i.status = 'paid';",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Initech with $4500 invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Initech' || rows[0]['c.name'] === 'Initech'),
  },
  {
    id: 'ch-86',
    title: 'High-Yield Production API Cluster',
    difficulty: 'Advanced',
    category: 'Multi-Predicate Fleet Audit',
    description: 'Query servers where region = "us-east" AND cores = 16 AND ram_gb = 64;',
    hint: "SELECT hostname, cores, ram_gb FROM servers WHERE region = 'us-east' AND cores = 16 AND ram_gb = 64;",
    initialSql: "SELECT hostname, cores, ram_gb FROM servers WHERE region = 'us-east' AND cores = 16 AND ram_gb = 64;",
    solutionSql: "SELECT hostname, cores, ram_gb FROM servers WHERE region = 'us-east' AND cores = 16 AND ram_gb = 64;",
    tablesUsed: ['servers'],
    expectedOutputSummary: '2 rows (prod-api-01, prod-api-02)',
    validate: (rows) =>
      rows.length === 2 &&
      rows.every(
        (r) =>
          Number(r.cores) === 16 &&
          Number(r.ram_gb) === 64
      ),
  },
  {
    id: 'ch-87',
    title: 'Design Systems Engineering Audit',
    difficulty: 'Advanced',
    category: 'Compound Multi-Condition Joins',
    description: 'Join employees and departments for department_id = 2 where experience_years <= 4 AND salary <= 115000.',
    hint: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.experience_years <= 4 AND e.salary <= 115000;',
    initialSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.experience_years <= 4 AND e.salary <= 115000;',
    solutionSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 2 AND e.experience_years <= 4 AND e.salary <= 115000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '1 row (Evan, Design Systems Engineer $110k, 4 years)',
    validate: (rows) => rows.length === 1 && rows[0].name === 'Evan',
  },

  // EXPERT (88-100)
  {
    id: 'ch-88',
    title: 'Enterprise Top-Tier Paid Invoices Audit',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join customers and invoices to find all paid invoices for Enterprise accounts located in "US" where invoice amount > 14000.',
    hint: "SELECT c.name, c.tier, c.city, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND c.country = 'US' AND i.status = 'paid' AND i.amount > 14000;",
    initialSql: "SELECT c.name, c.tier, c.city, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND c.country = 'US' AND i.status = 'paid' AND i.amount > 14000;",
    solutionSql: "SELECT c.name, c.tier, c.city, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.tier = 'Enterprise' AND c.country = 'US' AND i.status = 'paid' AND i.amount > 14000;",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Acme Corp with $15500 invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Acme Corp' || rows[0]['c.name'] === 'Acme Corp') &&
      Number(rows[0].amount ?? rows[0]['i.amount']) > 14000,
  },
  {
    id: 'ch-89',
    title: 'Principal Architect Compensation Verification',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join employees and departments on department_id = d.id where d.budget >= 500000 AND e.experience_years >= 10 AND e.salary > 180000.',
    hint: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.budget >= 500000 AND e.experience_years >= 10 AND e.salary > 180000;',
    initialSql: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.budget >= 500000 AND e.experience_years >= 10 AND e.salary > 180000;',
    solutionSql: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.budget >= 500000 AND e.experience_years >= 10 AND e.salary > 180000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '1 row (Alice: Principal Architect $185k)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Alice' || rows[0]['e.name'] === 'Alice'),
  },
  {
    id: 'ch-90',
    title: 'Multi-Condition Inventory Liquidity Audit',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Select all products where price >= 100 AND price <= 500 AND stock >= 20 AND stock <= 35.',
    hint: 'SELECT name, category, price, stock FROM products WHERE price >= 100 AND price <= 500 AND stock >= 20 AND stock <= 35;',
    initialSql: 'SELECT name, category, price, stock FROM products WHERE price >= 100 AND price <= 500 AND stock >= 20 AND stock <= 35;',
    solutionSql: 'SELECT name, category, price, stock FROM products WHERE price >= 100 AND price <= 500 AND stock >= 20 AND stock <= 35;',
    tablesUsed: ['products'],
    expectedOutputSummary: '3 rows (Mechanical Keyboard, 4K Monitor, Webcam 1080p)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every(
        (r) =>
          Number(r.price) >= 100 &&
          Number(r.price) <= 500 &&
          Number(r.stock) >= 20 &&
          Number(r.stock) <= 35
      ),
  },
  {
    id: 'ch-91',
    title: 'SRE Production Fleet High-Memory Threshold',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Select hostname, region, cores, ram_gb from servers where region = "us-east" AND status = "active" AND cores >= 32 AND ram_gb >= 128;',
    hint: "SELECT hostname, region, cores, ram_gb FROM servers WHERE region = 'us-east' AND status = 'active' AND cores >= 32 AND ram_gb >= 128;",
    initialSql: "SELECT hostname, region, cores, ram_gb FROM servers WHERE region = 'us-east' AND status = 'active' AND cores >= 32 AND ram_gb >= 128;",
    solutionSql: "SELECT hostname, region, cores, ram_gb FROM servers WHERE region = 'us-east' AND status = 'active' AND cores >= 32 AND ram_gb >= 128;",
    tablesUsed: ['servers'],
    expectedOutputSummary: '1 row (prod-db-master with 32 cores and 128GB RAM)',
    validate: (rows) => rows.length === 1 && rows[0].hostname === 'prod-db-master',
  },
  {
    id: 'ch-92',
    title: 'Non-US Enterprise Pending Billing Inspection',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join customers and invoices to find pending invoices for customers where country = "UK" AND credit_limit >= 40000;',
    hint: "SELECT c.name, c.country, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'UK' AND c.credit_limit >= 40000 AND i.status = 'pending';",
    initialSql: "SELECT c.name, c.country, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'UK' AND c.credit_limit >= 40000 AND i.status = 'pending';",
    solutionSql: "SELECT c.name, c.country, i.amount, i.status FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'UK' AND c.credit_limit >= 40000 AND i.status = 'pending';",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Globex Ltd with $8000 pending invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Globex Ltd' || rows[0]['c.name'] === 'Globex Ltd'),
  },
  {
    id: 'ch-93',
    title: 'Engineering Staff Mid-Career Benchmark',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join employees and departments on department_id = d.id for department_id = 1 where salary >= 140000 AND salary <= 150000 AND experience_years >= 6.',
    hint: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1 AND e.salary >= 140000 AND e.salary <= 150000 AND e.experience_years >= 6;',
    initialSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1 AND e.salary >= 140000 AND e.salary <= 150000 AND e.experience_years >= 6;',
    solutionSql: 'SELECT e.name, e.title, e.salary, e.experience_years FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.department_id = 1 AND e.salary >= 140000 AND e.salary <= 150000 AND e.experience_years >= 6;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '1 row (Bob, Senior Software Engineer $145k)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Bob' || rows[0]['e.name'] === 'Bob'),
  },
  {
    id: 'ch-94',
    title: 'German Mid-Tier Fiscal 2026 Audit',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join customers and invoices for country = "DE" where year = 2026 AND amount >= 9000 AND status = "paid".',
    hint: "SELECT c.name, c.country, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'DE' AND i.year = 2026 AND i.amount >= 9000 AND i.status = 'paid';",
    initialSql: "SELECT c.name, c.country, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'DE' AND i.year = 2026 AND i.amount >= 9000 AND i.status = 'paid';",
    solutionSql: "SELECT c.name, c.country, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.country = 'DE' AND i.year = 2026 AND i.amount >= 9000 AND i.status = 'paid';",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Soylent AI with $9500 paid invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Soylent AI' || rows[0]['c.name'] === 'Soylent AI'),
  },
  {
    id: 'ch-95',
    title: 'Critical Infrastructure Floor 3 Budget Join',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join employees and departments on department_id = d.id where d.floor = 3 AND d.budget >= 350000 AND e.salary >= 135000 AND e.experience_years >= 5.',
    hint: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3 AND d.budget >= 350000 AND e.salary >= 135000 AND e.experience_years >= 5;',
    initialSql: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3 AND d.budget >= 350000 AND e.salary >= 135000 AND e.experience_years >= 5;',
    solutionSql: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 3 AND d.budget >= 350000 AND e.salary >= 135000 AND e.experience_years >= 5;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '3 rows (Alice $185k, Bob $145k, Charlie $135k)',
    validate: (rows) =>
      rows.length === 3 && rows.every((r) => Number(r.salary) >= 135000),
  },
  {
    id: 'ch-96',
    title: 'Staging Server Resource Underutilization',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Select hostname, region, status, cores from servers where status = "idle" AND region = "us-west" AND cores <= 4;',
    hint: "SELECT hostname, region, status, cores FROM servers WHERE status = 'idle' AND region = 'us-west' AND cores <= 4;",
    initialSql: "SELECT hostname, region, status, cores FROM servers WHERE status = 'idle' AND region = 'us-west' AND cores <= 4;",
    solutionSql: "SELECT hostname, region, status, cores FROM servers WHERE status = 'idle' AND region = 'us-west' AND cores <= 4;",
    tablesUsed: ['servers'],
    expectedOutputSummary: '1 row (staging-app-01 idle with 4 cores)',
    validate: (rows) =>
      rows.length === 1 && rows[0].hostname === 'staging-app-01',
  },
  {
    id: 'ch-97',
    title: 'Growth Tier Texas Receivable Audit',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join customers and invoices for city = "Austin" where c.tier = "Growth" AND i.status = "paid" AND i.year = 2025;',
    hint: "SELECT c.name, c.city, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.city = 'Austin' AND c.tier = 'Growth' AND i.status = 'paid' AND i.year = 2025;",
    initialSql: "SELECT c.name, c.city, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.city = 'Austin' AND c.tier = 'Growth' AND i.status = 'paid' AND i.year = 2025;",
    solutionSql: "SELECT c.name, c.city, i.amount, i.year FROM customers c JOIN invoices i ON c.id = i.customer_id WHERE c.city = 'Austin' AND c.tier = 'Growth' AND i.status = 'paid' AND i.year = 2025;",
    tablesUsed: ['customers', 'invoices'],
    expectedOutputSummary: '1 row (Initech in Austin with $4500 invoice)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Initech' || rows[0]['c.name'] === 'Initech'),
  },
  {
    id: 'ch-98',
    title: 'Security Floor 4 Budget Alignment',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Join employees and departments on department_id = d.id where d.floor = 4 AND d.budget <= 300000 AND e.salary >= 140000;',
    hint: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 4 AND d.budget <= 300000 AND e.salary >= 140000;',
    initialSql: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 4 AND d.budget <= 300000 AND e.salary >= 140000;',
    solutionSql: 'SELECT e.name, e.title, d.name AS dept_name, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE d.floor = 4 AND d.budget <= 300000 AND e.salary >= 140000;',
    tablesUsed: ['employees', 'departments'],
    expectedOutputSummary: '1 row (Fiona in Security with $140k salary)',
    validate: (rows) =>
      rows.length === 1 &&
      (rows[0].name === 'Fiona' || rows[0]['e.name'] === 'Fiona'),
  },
  {
    id: 'ch-99',
    title: 'High-Volume Peripheral Inventory Valuation',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Select name, price, stock from products where category = "Peripherals" AND price >= 100 AND stock >= 30;',
    hint: "SELECT name, price, stock FROM products WHERE category = 'Peripherals' AND price >= 100 AND stock >= 30;",
    initialSql: "SELECT name, price, stock FROM products WHERE category = 'Peripherals' AND price >= 100 AND stock >= 30;",
    solutionSql: "SELECT name, price, stock FROM products WHERE category = 'Peripherals' AND price >= 100 AND stock >= 30;",
    tablesUsed: ['products'],
    expectedOutputSummary: '1 row (Mechanical Keyboard at $150, 30 stock)',
    validate: (rows) =>
      rows.length === 1 && rows[0].name === 'Mechanical Keyboard',
  },
  {
    id: 'ch-100',
    title: 'Enterprise Fleet Dual-Region Master Audit',
    difficulty: 'Expert',
    category: 'Complex Enterprise Queries',
    description: 'Select hostname, region, status, cores, ram_gb from servers where status = "active" AND region != "us-west" AND cores >= 8 AND ram_gb >= 32 AND cores < 32;',
    hint: "SELECT hostname, region, status, cores, ram_gb FROM servers WHERE status = 'active' AND region != 'us-west' AND cores >= 8 AND ram_gb >= 32 AND cores < 32;",
    initialSql: "SELECT hostname, region, status, cores, ram_gb FROM servers WHERE region != 'us-west' AND status = 'active' AND cores >= 8 AND ram_gb >= 32 AND cores < 32;",
    solutionSql: "SELECT hostname, region, status, cores, ram_gb FROM servers WHERE region != 'us-west' AND status = 'active' AND cores >= 8 AND ram_gb >= 32 AND cores < 32;",
    tablesUsed: ['servers'],
    expectedOutputSummary: '3 rows (prod-api-01, prod-api-02, prod-cache-01)',
    validate: (rows) =>
      rows.length === 3 &&
      rows.every(
        (r) =>
          r.status === 'active' &&
          Number(r.cores) >= 8 &&
          Number(r.cores) < 32 &&
          Number(r.ram_gb) >= 32
      ),
  },
];

export function getProblemById(id: string): SqlProblem | undefined {
  return SQL_PROBLEMS.find((p) => p.id === id);
}
