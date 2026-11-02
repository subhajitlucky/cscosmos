export interface MongoProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Filtering & Projection' | 'Aggregation & Grouping' | 'Array & Subdocument' | 'Index & Optimization';
  description: string;
  expectedOutput: string;
  initialCode: string;
  hint: string;
  solution: string;
  targetCollection: string;
  validate: (results: any[], queryStr: string) => { valid: boolean; message?: string };
}

export const MONGO_PROBLEMS: MongoProblem[] = [
  // EASY: mp-1 to mp-15
  {
    id: 'mp-1',
    title: 'Filter Active Developers',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Write an MQL query to find all users where role is "developer" and status is "active".',
    expectedOutput: '2 documents (Bob Martinez, George Clark)',
    initialCode: 'db.users.find({ });',
    hint: 'Use equality match: { role: "developer", status: "active" }',
    solution: 'db.users.find({ role: "developer", status: "active" })',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 active developers.' };
      const allMatch = res.every((d) => d.role === 'developer' && d.status === 'active');
      return { valid: allMatch, message: allMatch ? undefined : 'Found documents with mismatched role or status.' };
    }
  },
  {
    id: 'mp-2',
    title: 'High-Value Orders Filter',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all orders where total is strictly greater than 500.',
    expectedOutput: '4 orders (MacBook Pro M3, 4K UltraWide Monitor, Ergonomic Desk Chair, Drawing Tablet Pro)',
    initialCode: 'db.orders.find({ });',
    hint: 'Use the $gt comparison operator on the total field: { total: { $gt: 500 } }',
    solution: 'db.orders.find({ total: { $gt: 500 } })',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 4) return { valid: false, message: 'Expected 4 high-value orders.' };
      const allGt = res.every((d) => d.total > 500);
      return { valid: allGt, message: allGt ? undefined : 'Found orders with total <= 500.' };
    }
  },
  {
    id: 'mp-3',
    title: 'Project Customer Names & Credit',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all customers with tier = "Enterprise", projecting only the name and creditLimit fields (suppress _id).',
    expectedOutput: '3 documents with only name and creditLimit fields',
    initialCode: 'db.customers.find({ }, { });',
    hint: 'Pass a projection as the second argument: { name: 1, creditLimit: 1, _id: 0 }',
    solution: 'db.customers.find({ tier: "Enterprise" }, { _id: 0, name: 1, creditLimit: 1 })',
    targetCollection: 'customers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected 3 enterprise customers.' };
      const validFields = res.every((d) => '_id' in d === false && 'name' in d && 'creditLimit' in d);
      return { valid: validFields, message: validFields ? undefined : 'Projection must contain only name and creditLimit with _id suppressed.' };
    }
  },
  {
    id: 'mp-4',
    title: 'Low-Stock Inventory Scan',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Select all products whose current stock is less than 20 units.',
    expectedOutput: '3 products (MacBook Pro M3, Ergonomic Desk Chair, Drawing Tablet Pro)',
    initialCode: 'db.products.find({ });',
    hint: 'Use { stock: { $lt: 20 } }',
    solution: 'db.products.find({ stock: { $lt: 20 } })',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected 3 low stock products.' };
      return { valid: res.every((d) => d.stock < 20), message: 'All returned items must have stock < 20.' };
    }
  },
  {
    id: 'mp-5',
    title: 'Audio Hardware Catalog',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all products in category "Audio".',
    expectedOutput: '2 products (Noise Cancelling Headphones, Studio Microphone)',
    initialCode: 'db.products.find({ });',
    hint: 'Query { category: "Audio" }',
    solution: 'db.products.find({ category: "Audio" })',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 audio products.' };
      return { valid: res.every((d) => d.category === 'Audio') };
    }
  },
  {
    id: 'mp-6',
    title: 'US Infrastructure Nodes',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Query all servers provisioned in region "us-east".',
    expectedOutput: '3 servers (prod-api-01, prod-api-02, prod-db-01)',
    initialCode: 'db.servers.find({ });',
    hint: 'Filter on { region: "us-east" }',
    solution: 'db.servers.find({ region: "us-east" })',
    targetCollection: 'servers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected 3 servers in us-east.' };
      return { valid: res.every((d) => d.region === 'us-east') };
    }
  },
  {
    id: 'mp-7',
    title: 'Pending Orders Audit',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all orders where status is either "shipped" or "cancelled".',
    expectedOutput: '2 orders (4K UltraWide Monitor, Noise Cancelling Headphones)',
    initialCode: 'db.orders.find({ });',
    hint: 'Use the $in operator: { status: { $in: ["shipped", "cancelled"] } }',
    solution: 'db.orders.find({ status: { $in: ["shipped", "cancelled"] } })',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 orders with status shipped or cancelled.' };
      return { valid: res.every((d) => ['shipped', 'cancelled'].includes(d.status)) };
    }
  },
  {
    id: 'mp-8',
    title: 'Nested Contact Email Filter',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all customers whose nested contact.email ends with ".com" or matches domain acme.com.',
    expectedOutput: '2 customers (Acme Corp, Soylent Inc)',
    initialCode: 'db.customers.find({ });',
    hint: 'Use dot notation for nested fields: { "contact.email": { $regex: ".*@.*\\\\.com$" } } or $in',
    solution: 'db.customers.find({ "contact.email": { $regex: "\\\\.com$" } })',
    targetCollection: 'customers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 customers with .com emails.' };
      return { valid: res.every((d) => d.contact?.email?.endsWith('.com')) };
    }
  },
  {
    id: 'mp-9',
    title: 'High-Density Compute Fleet',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Select all servers with 32 or more CPU cores (cores >= 32).',
    expectedOutput: '4 servers with cores >= 32',
    initialCode: 'db.servers.find({ });',
    hint: 'Use { cores: { $gte: 32 } }',
    solution: 'db.servers.find({ cores: { $gte: 32 } })',
    targetCollection: 'servers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 4) return { valid: false, message: 'Expected 4 servers with cores >= 32.' };
      return { valid: res.every((d) => d.cores >= 32) };
    }
  },
  {
    id: 'mp-10',
    title: 'Canadian & German Customers',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all customers residing in country "CA" or "DE".',
    expectedOutput: '2 customers (Globex Ltd, Initech Systems)',
    initialCode: 'db.customers.find({ });',
    hint: 'Use { country: { $in: ["CA", "DE"] } }',
    solution: 'db.customers.find({ country: { $in: ["CA", "DE"] } })',
    targetCollection: 'customers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 customers from CA or DE.' };
      return { valid: res.every((d) => ['CA', 'DE'].includes(d.country)) };
    }
  },
  {
    id: 'mp-11',
    title: 'Active High-Rated Products',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all products that are active (active = true) and have a rating >= 4.7.',
    expectedOutput: '4 products (MacBook Pro M3, Mechanical Keyboard, 4K UltraWide Monitor, Drawing Tablet Pro)',
    initialCode: 'db.products.find({ });',
    hint: 'Filter on { active: true, rating: { $gte: 4.7 } }',
    solution: 'db.products.find({ active: true, rating: { $gte: 4.7 } })',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 4) return { valid: false, message: 'Expected 4 active high-rated products.' };
      return { valid: res.every((d) => d.active === true && d.rating >= 4.7) };
    }
  },
  {
    id: 'mp-12',
    title: 'Senior Age Filter',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all users with age strictly greater than 30.',
    expectedOutput: '4 users (Bob Martinez, Diana Prince, Evan Wright, Fiona Gallagher)',
    initialCode: 'db.users.find({ });',
    hint: 'Use { age: { $gt: 30 } }',
    solution: 'db.users.find({ age: { $gt: 30 } })',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 4) return { valid: false, message: 'Expected 4 users over age 30.' };
      return { valid: res.every((d) => d.age > 30) };
    }
  },
  {
    id: 'mp-13',
    title: 'Wire Payment Transactions',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Find all orders where payment method is "wire".',
    expectedOutput: '2 orders (MacBook Pro M3, Ergonomic Desk Chair)',
    initialCode: 'db.orders.find({ });',
    hint: 'Query { payment: "wire" }',
    solution: 'db.orders.find({ payment: "wire" })',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 wire payment orders.' };
      return { valid: res.every((d) => d.payment === 'wire') };
    }
  },
  {
    id: 'mp-14',
    title: 'Maintenance Fleet Nodes',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Select all servers whose status is NOT "active".',
    expectedOutput: '1 server (prod-cache-01)',
    initialCode: 'db.servers.find({ });',
    hint: 'Use the $ne operator: { status: { $ne: "active" } }',
    solution: 'db.servers.find({ status: { $ne: "active" } })',
    targetCollection: 'servers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 1) return { valid: false, message: 'Expected 1 inactive server.' };
      return { valid: res[0].status !== 'active' };
    }
  },
  {
    id: 'mp-15',
    title: 'Customer Credit Directory',
    difficulty: 'Easy',
    category: 'Filtering & Projection',
    description: 'Select all customer accounts with creditLimit >= 50000.',
    expectedOutput: '3 customers (Acme Corp, Soylent Inc, Umbrella Health)',
    initialCode: 'db.customers.find({ });',
    hint: 'Use { creditLimit: { $gte: 50000 } }',
    solution: 'db.customers.find({ creditLimit: { $gte: 50000 } })',
    targetCollection: 'customers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected 3 high-credit customers.' };
      return { valid: res.every((d) => d.creditLimit >= 50000) };
    }
  },

  // INTERMEDIATE: mp-16 to mp-30
  {
    id: 'mp-16',
    title: 'Array Tag Membership Filter',
    difficulty: 'Intermediate',
    category: 'Array & Subdocument',
    description: 'Find all users who have the tag "backend" inside their tags array.',
    expectedOutput: '2 users (Bob Martinez, Evan Wright)',
    initialCode: 'db.users.find({ });',
    hint: 'In MongoDB, querying an array with a scalar { tags: "backend" } checks for array membership automatically!',
    solution: 'db.users.find({ tags: "backend" })',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 users with "backend" tag.' };
      return { valid: res.every((d) => Array.isArray(d.tags) && d.tags.includes('backend')) };
    }
  },
  {
    id: 'mp-17',
    title: 'Sorted & Limited Price Search',
    difficulty: 'Intermediate',
    category: 'Filtering & Projection',
    description: 'Find all active products, sorted by price in descending order (-1), limiting the result to the top 3 most expensive items.',
    expectedOutput: '3 products (MacBook Pro M3, 4K UltraWide Monitor, Drawing Tablet Pro)',
    initialCode: 'db.products.find({ }).sort({ }).limit();',
    hint: 'db.products.find({ active: true }).sort({ price: -1 }).limit(3)',
    solution: 'db.products.find({ active: true }).sort({ price: -1 }).limit(3)',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected top 3 items.' };
      const prices = res.map((d) => d.price);
      const isSorted = prices[0] >= prices[1] && prices[1] >= prices[2];
      return { valid: isSorted && res[0].price === 2499, message: 'Must return top 3 sorted descending by price.' };
    }
  },
  {
    id: 'mp-18',
    title: 'Multiple Array Tags ($all)',
    difficulty: 'Intermediate',
    category: 'Array & Subdocument',
    description: 'Find all servers that have BOTH "k8s" AND "api" tags in their tags array.',
    expectedOutput: '2 servers (prod-api-01, prod-api-02)',
    initialCode: 'db.servers.find({ });',
    hint: 'Use the $all array operator: { tags: { $all: ["k8s", "api"] } }',
    solution: 'db.servers.find({ tags: { $all: ["k8s", "api"] } })',
    targetCollection: 'servers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 servers with both k8s and api tags.' };
      return { valid: res.every((d) => d.tags.includes('k8s') && d.tags.includes('api')) };
    }
  },
  {
    id: 'mp-19',
    title: 'Count Completed Orders by Category',
    difficulty: 'Intermediate',
    category: 'Aggregation & Grouping',
    description: 'Run an aggregation pipeline on orders to filter status = "completed" and count the number of orders in each category.',
    expectedOutput: 'Grouped categories with count field',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $match: { status: "completed" } }, { $group: { _id: "$category", count: { $sum: 1 } } } ]',
    solution: 'db.orders.aggregate([ { $match: { status: "completed" } }, { $group: { _id: "$category", count: { $sum: 1 } } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length < 3) return { valid: false, message: 'Expected grouped category counts.' };
      const hasFields = res.every((d) => '_id' in d && 'count' in d);
      return { valid: hasFields, message: 'Output documents must contain _id and count.' };
    }
  },
  {
    id: 'mp-20',
    title: 'Total Revenue by Payment Method',
    difficulty: 'Intermediate',
    category: 'Aggregation & Grouping',
    description: 'Aggregate orders to compute total revenue ($sum of total) grouped by payment method, sorted descending by totalRevenue.',
    expectedOutput: 'Grouped payment methods with totalRevenue field sorted descending',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $group: { _id: "$payment", totalRevenue: { $sum: "$total" } } }, { $sort: { totalRevenue: -1 } } ]',
    solution: 'db.orders.aggregate([ { $group: { _id: "$payment", totalRevenue: { $sum: "$total" } } }, { $sort: { totalRevenue: -1 } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected payment revenue groups.' };
      const isSorted = res.every((d, i) => i === 0 || res[i - 1].totalRevenue >= d.totalRevenue);
      return { valid: isSorted && 'totalRevenue' in res[0], message: 'Must group by payment with totalRevenue sorted descending.' };
    }
  },
  {
    id: 'mp-21',
    title: 'Customer Lifetime Spend by Tier',
    difficulty: 'Intermediate',
    category: 'Aggregation & Grouping',
    description: 'Aggregate customers where active = true, grouping by tier to find the average credit limit (avgCredit) rounded or calculated via $avg.',
    expectedOutput: 'Grouped customer tiers with avgCredit',
    initialCode: 'db.customers.aggregate([ ]);',
    hint: '[ { $match: { active: true } }, { $group: { _id: "$tier", avgCredit: { $avg: "$creditLimit" } } } ]',
    solution: 'db.customers.aggregate([ { $match: { active: true } }, { $group: { _id: "$tier", avgCredit: { $avg: "$creditLimit" } } } ])',
    targetCollection: 'customers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected tier groups.' };
      return { valid: res.every((d) => '_id' in d && 'avgCredit' in d), message: 'Each group must have _id and avgCredit.' };
    }
  },
  {
    id: 'mp-22',
    title: 'Nested Hardware Specification Filter',
    difficulty: 'Intermediate',
    category: 'Array & Subdocument',
    description: 'Find all products where the nested subdocument specs.ram is greater than or equal to 32.',
    expectedOutput: '1 product (MacBook Pro M3)',
    initialCode: 'db.products.find({ });',
    hint: 'Use dot notation: { "specs.ram": { $gte: 32 } }',
    solution: 'db.products.find({ "specs.ram": { $gte: 32 } })',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 1) return { valid: false, message: 'Expected 1 product with specs.ram >= 32.' };
      return { valid: res[0].specs?.ram >= 32 };
    }
  },
  {
    id: 'mp-23',
    title: 'Pagination with Skip and Limit',
    difficulty: 'Intermediate',
    category: 'Filtering & Projection',
    description: 'Sort all users by score descending (-1), skip the first 2 users, and limit the result to 3 users.',
    expectedOutput: '3 users (Bob Martinez, Fiona Gallagher, George Clark)',
    initialCode: 'db.users.find({ }).sort({ }).skip().limit();',
    hint: 'db.users.find().sort({ score: -1 }).skip(2).limit(3)',
    solution: 'db.users.find().sort({ score: -1 }).skip(2).limit(3)',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected exactly 3 paginated users.' };
      return { valid: res[0].score === 88 && res[1].score === 84 && res[2].score === 79 };
    }
  },
  {
    id: 'mp-24',
    title: 'Unwind Tags and Count Frequency',
    difficulty: 'Intermediate',
    category: 'Aggregation & Grouping',
    description: 'Deconstruct the users tags array using $unwind, and count how many users have each individual tag.',
    expectedOutput: 'Documents with _id as tag name and tagCount as count',
    initialCode: 'db.users.aggregate([ ]);',
    hint: '[ { $unwind: "$tags" }, { $group: { _id: "$tags", tagCount: { $sum: 1 } } } ]',
    solution: 'db.users.aggregate([ { $unwind: "$tags" }, { $group: { _id: "$tags", tagCount: { $sum: 1 } } } ])',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length < 5) return { valid: false, message: 'Expected multiple unwound tag groups.' };
      return { valid: res.every((d) => '_id' in d && 'tagCount' in d) };
    }
  },
  {
    id: 'mp-25',
    title: 'Average Order Value by User',
    difficulty: 'Intermediate',
    category: 'Aggregation & Grouping',
    description: 'Group all orders by user_id to compute the total spend (totalSpent) and average order value (avgTotal).',
    expectedOutput: 'Summary of user_id orders with totalSpent and avgTotal',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $group: { _id: "$user_id", totalSpent: { $sum: "$total" }, avgTotal: { $avg: "$total" } } } ]',
    solution: 'db.orders.aggregate([ { $group: { _id: "$user_id", totalSpent: { $sum: "$total" }, avgTotal: { $avg: "$total" } } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected user order aggregations.' };
      return { valid: res.every((d) => '_id' in d && 'totalSpent' in d && 'avgTotal' in d) };
    }
  },
  {
    id: 'mp-26',
    title: 'Server Core Density Analysis',
    difficulty: 'Intermediate',
    category: 'Aggregation & Grouping',
    description: 'Group servers by region, calculating the total number of CPU cores (totalCores) and total RAM (totalRam) per region.',
    expectedOutput: 'Regional compute totals',
    initialCode: 'db.servers.aggregate([ ]);',
    hint: '[ { $group: { _id: "$region", totalCores: { $sum: "$cores" }, totalRam: { $sum: "$ramGb" } } } ]',
    solution: 'db.servers.aggregate([ { $group: { _id: "$region", totalCores: { $sum: "$cores" }, totalRam: { $sum: "$ramGb" } } } ])',
    targetCollection: 'servers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length < 2) return { valid: false, message: 'Expected regional groups.' };
      return { valid: res.every((d) => '_id' in d && 'totalCores' in d && 'totalRam' in d) };
    }
  },
  {
    id: 'mp-27',
    title: 'Project Computed Value with $project',
    difficulty: 'Intermediate',
    category: 'Filtering & Projection',
    description: 'Aggregate products projecting only the product name and a computed field inventoryValue (price multiplied by stock). Suppress _id.',
    expectedOutput: 'Documents with name and inventoryValue',
    initialCode: 'db.products.aggregate([ ]);',
    hint: '[ { $project: { _id: 0, name: 1, inventoryValue: { $multiply: ["$price", "$stock"] } } } ]',
    solution: 'db.products.aggregate([ { $project: { _id: 0, name: 1, inventoryValue: { $multiply: ["$price", "$stock"] } } } ])',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected projected products.' };
      return { valid: res.every((d) => '_id' in d === false && 'name' in d && 'inventoryValue' in d) };
    }
  },
  {
    id: 'mp-28',
    title: 'Multiple Criteria Exclusion with $nor',
    difficulty: 'Intermediate',
    category: 'Filtering & Projection',
    description: 'Find all users where status is NOT "pending" AND country is NOT "DE".',
    expectedOutput: '5 users',
    initialCode: 'db.users.find({ });',
    hint: 'Use $nor: { $nor: [ { status: "pending" }, { country: "DE" } ] }',
    solution: 'db.users.find({ $nor: [ { status: "pending" }, { country: "DE" } ] })',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 5) return { valid: false, message: 'Expected 5 non-pending, non-DE users.' };
      return { valid: res.every((d) => d.status !== 'pending' && d.country !== 'DE') };
    }
  },
  {
    id: 'mp-29',
    title: 'Unique Product Categories Set',
    difficulty: 'Intermediate',
    category: 'Aggregation & Grouping',
    description: 'Use a single $group stage with _id: null to extract a deduplicated array of all product categories using $addToSet.',
    expectedOutput: 'Single document with allCategories array',
    initialCode: 'db.products.aggregate([ ]);',
    hint: '[ { $group: { _id: null, allCategories: { $addToSet: "$category" } } } ]',
    solution: 'db.products.aggregate([ { $group: { _id: null, allCategories: { $addToSet: "$category" } } } ])',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 1) return { valid: false, message: 'Expected 1 summary document.' };
      return { valid: Array.isArray(res[0].allCategories) && res[0].allCategories.length >= 4 };
    }
  },
  {
    id: 'mp-30',
    title: 'Order Quantity Minimum and Maximum',
    difficulty: 'Intermediate',
    category: 'Aggregation & Grouping',
    description: 'Group orders by category, finding the minimum total (minTotal) and maximum total (maxTotal) in each category.',
    expectedOutput: 'Category price extremes',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $group: { _id: "$category", minTotal: { $min: "$total" }, maxTotal: { $max: "$total" } } } ]',
    solution: 'db.orders.aggregate([ { $group: { _id: "$category", minTotal: { $min: "$total" }, maxTotal: { $max: "$total" } } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length < 3) return { valid: false, message: 'Expected category price bounds.' };
      return { valid: res.every((d) => '_id' in d && 'minTotal' in d && 'maxTotal' in d) };
    }
  },

  // ADVANCED: mp-31 to mp-42
  {
    id: 'mp-31',
    title: 'Left Outer Join Orders with Customers',
    difficulty: 'Advanced',
    category: 'Aggregation & Grouping',
    description: 'Execute an aggregation on orders joining the users collection on user_id = u._id using $lookup, outputting the user details in a field named customerDetails.',
    expectedOutput: 'Orders with customerDetails array',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "customerDetails" } } ]',
    solution: 'db.orders.aggregate([ { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "customerDetails" } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected joined order documents.' };
      return { valid: res.every((d) => Array.isArray(d.customerDetails) && d.customerDetails.length > 0) };
    }
  },
  {
    id: 'mp-32',
    title: 'Top Spenders Ranking Pipeline',
    difficulty: 'Advanced',
    category: 'Aggregation & Grouping',
    description: 'Aggregate orders where status = "completed", group by user_id to compute totalSpent, sort by totalSpent descending, and limit to top 2 spenders.',
    expectedOutput: 'Top 2 spenders',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $match: { status: "completed" } }, { $group: { _id: "$user_id", totalSpent: { $sum: "$total" } } }, { $sort: { totalSpent: -1 } }, { $limit: 2 } ]',
    solution: 'db.orders.aggregate([ { $match: { status: "completed" } }, { $group: { _id: "$user_id", totalSpent: { $sum: "$total" } } }, { $sort: { totalSpent: -1 } }, { $limit: 2 } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected top 2 spenders.' };
      return { valid: res[0]._id === 'u1' && res[0].totalSpent === 3149 };
    }
  },
  {
    id: 'mp-33',
    title: 'Filtered Array Projection with $elemMatch',
    difficulty: 'Advanced',
    category: 'Array & Subdocument',
    description: 'Find all users who possess an array element matching a tag ending in "end" (backend or frontend).',
    expectedOutput: '3 users (Bob Martinez, Charlie Kim, Evan Wright)',
    initialCode: 'db.users.find({ });',
    hint: 'Use regex on array: { tags: { $regex: "end$" } }',
    solution: 'db.users.find({ tags: { $regex: "end$" } })',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected 3 users matching "end$".' };
      return { valid: res.every((d) => d.tags.some((t: string) => t.endsWith('end'))) };
    }
  },
  {
    id: 'mp-34',
    title: 'Filter Join Results ($unwind + $match)',
    difficulty: 'Advanced',
    category: 'Aggregation & Grouping',
    description: 'Join orders with users, unwind customer, and retain only transactions where the customer\'s country is "CA".',
    expectedOutput: '2 orders placed by Canadian users (u2)',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "customer" } }, { $unwind: "$customer" }, { $match: { "customer.country": "CA" } } ]',
    solution: 'db.orders.aggregate([ { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "customer" } }, { $unwind: "$customer" }, { $match: { "customer.country": "CA" } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 Canadian orders.' };
      return { valid: res.every((d) => d.customer?.country === 'CA') };
    }
  },
  {
    id: 'mp-35',
    title: 'Multi-Condition Complex Filter',
    difficulty: 'Advanced',
    category: 'Filtering & Projection',
    description: 'Find all orders where total > 200 AND category is NOT "Hardware" AND status = "completed".',
    expectedOutput: '3 orders (Ergonomic Desk Chair, Thunderbolt Dock, Studio Microphone)',
    initialCode: 'db.orders.find({ });',
    hint: 'Filter on { total: { $gt: 200 }, category: { $ne: "Hardware" }, status: "completed" }',
    solution: 'db.orders.find({ total: { $gt: 200 }, category: { $ne: "Hardware" }, status: "completed" })',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected 3 non-hardware orders.' };
      return { valid: res.every((d) => d.total > 200 && d.category !== 'Hardware' && d.status === 'completed') };
    }
  },
  {
    id: 'mp-36',
    title: 'Global Hardware Load Average Analysis',
    difficulty: 'Advanced',
    category: 'Aggregation & Grouping',
    description: 'Filter active servers, and compute the global average loadAvg (avgLoad) and max loadAvg (peakLoad) across all active nodes.',
    expectedOutput: '1 summary document with avgLoad and peakLoad',
    initialCode: 'db.servers.aggregate([ ]);',
    hint: '[ { $match: { status: "active" } }, { $group: { _id: null, avgLoad: { $avg: "$loadAvg" }, peakLoad: { $max: "$loadAvg" } } } ]',
    solution: 'db.servers.aggregate([ { $match: { status: "active" } }, { $group: { _id: null, avgLoad: { $avg: "$loadAvg" }, peakLoad: { $max: "$loadAvg" } } } ])',
    targetCollection: 'servers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 1) return { valid: false, message: 'Expected 1 aggregate document.' };
      return { valid: 'avgLoad' in res[0] && 'peakLoad' in res[0] };
    }
  },
  {
    id: 'mp-37',
    title: 'Conditional Category Flagging ($cond)',
    difficulty: 'Advanced',
    category: 'Aggregation & Grouping',
    description: 'Use $project or $set with $cond to project products with an added flag isExpensive (true if price >= 500, else false).',
    expectedOutput: 'Products containing isExpensive boolean',
    initialCode: 'db.products.aggregate([ ]);',
    hint: '[ { $set: { isExpensive: { $cond: [ { $gte: ["$price", 500] }, true, false ] } } } ]',
    solution: 'db.products.aggregate([ { $set: { isExpensive: { $cond: [ { $gte: ["$price", 500] }, true, false ] } } } ])',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected products with isExpensive.' };
      return { valid: res.every((d) => typeof d.isExpensive === 'boolean') };
    }
  },
  {
    id: 'mp-38',
    title: 'Top Product Per Category Discovery',
    difficulty: 'Advanced',
    category: 'Aggregation & Grouping',
    description: 'Sort products by price descending, then group by category using $first to select the most expensive product in each category.',
    expectedOutput: 'One document per category with topProduct',
    initialCode: 'db.products.aggregate([ ]);',
    hint: '[ { $sort: { price: -1 } }, { $group: { _id: "$category", topProduct: { $first: "$name" }, maxPrice: { $first: "$price" } } } ]',
    solution: 'db.products.aggregate([ { $sort: { price: -1 } }, { $group: { _id: "$category", topProduct: { $first: "$name" }, maxPrice: { $first: "$price" } } } ])',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length < 4) return { valid: false, message: 'Expected 4 category winners.' };
      return { valid: res.every((d) => '_id' in d && 'topProduct' in d && 'maxPrice' in d) };
    }
  },
  {
    id: 'mp-39',
    title: 'Pushing Order IDs by Customer',
    difficulty: 'Advanced',
    category: 'Aggregation & Grouping',
    description: 'Group orders by user_id, pushing all order _id values into an array named orderHistory, along with orderCount.',
    expectedOutput: 'Grouped customers with orderHistory array',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $group: { _id: "$user_id", orderHistory: { $push: "$_id" }, orderCount: { $sum: 1 } } } ]',
    solution: 'db.orders.aggregate([ { $group: { _id: "$user_id", orderHistory: { $push: "$_id" }, orderCount: { $sum: 1 } } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected grouped customer histories.' };
      return { valid: res.every((d) => Array.isArray(d.orderHistory) && typeof d.orderCount === 'number') };
    }
  },
  {
    id: 'mp-40',
    title: 'Regional Compute Fleet Load Ranking',
    difficulty: 'Advanced',
    category: 'Aggregation & Grouping',
    description: 'Group servers by region, finding total compute resources and sorting by total cores descending.',
    expectedOutput: 'Ranked regions by cores',
    initialCode: 'db.servers.aggregate([ ]);',
    hint: '[ { $group: { _id: "$region", totalCores: { $sum: "$cores" } } }, { $sort: { totalCores: -1 } } ]',
    solution: 'db.servers.aggregate([ { $group: { _id: "$region", totalCores: { $sum: "$cores" } } }, { $sort: { totalCores: -1 } } ])',
    targetCollection: 'servers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length < 2) return { valid: false, message: 'Expected regions.' };
      return { valid: res[0]._id === 'us-east' && res[0].totalCores === 128 };
    }
  },
  {
    id: 'mp-41',
    title: 'Active High-Capacity Enterprise Search',
    difficulty: 'Advanced',
    category: 'Filtering & Projection',
    description: 'Find active Enterprise customers located in US or UK with credit limit greater than 60,000.',
    expectedOutput: '2 customers (Soylent Inc, Umbrella Health)',
    initialCode: 'db.customers.find({ });',
    hint: 'Filter on { tier: "Enterprise", country: { $in: ["US", "UK"] }, creditLimit: { $gt: 60000 } }',
    solution: 'db.customers.find({ tier: "Enterprise", country: { $in: ["US", "UK"] }, creditLimit: { $gt: 60000 } })',
    targetCollection: 'customers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 high-capacity enterprise accounts.' };
      return { valid: res.every((d) => d.tier === 'Enterprise' && d.creditLimit > 60000) };
    }
  },
  {
    id: 'mp-42',
    title: 'Multi-Role User Search',
    difficulty: 'Advanced',
    category: 'Filtering & Projection',
    description: 'Find all users who are either an "admin" OR have a score strictly greater than 90.',
    expectedOutput: '2 users (Alice Chen, Diana Prince)',
    initialCode: 'db.users.find({ });',
    hint: 'Use $or: { $or: [ { role: "admin" }, { score: { $gt: 90 } } ] }',
    solution: 'db.users.find({ $or: [ { role: "admin" }, { score: { $gt: 90 } } ] })',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 2) return { valid: false, message: 'Expected 2 matching users.' };
      return { valid: res.every((d) => d.role === 'admin' || d.score > 90) };
    }
  },

  // EXPERT: mp-43 to mp-50
  {
    id: 'mp-43',
    title: 'Multi-Faceted Dashboard Aggregation ($facet)',
    difficulty: 'Expert',
    category: 'Aggregation & Grouping',
    description: 'Run an aggregation on orders using $facet to calculate both: 1. "byStatus": total count grouped by status, and 2. "overview": overall total revenue across all orders.',
    expectedOutput: 'Single document containing byStatus and overview arrays',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $facet: { "byStatus": [ { $group: { _id: "$status", count: { $sum: 1 } } } ], "overview": [ { $group: { _id: null, totalRev: { $sum: "$total" } } } ] } } ]',
    solution: 'db.orders.aggregate([ { $facet: { "byStatus": [ { $group: { _id: "$status", count: { $sum: 1 } } } ], "overview": [ { $group: { _id: null, totalRev: { $sum: "$total" } } } ] } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 1) return { valid: false, message: 'Expected single facet document.' };
      return { valid: Array.isArray(res[0].byStatus) && Array.isArray(res[0].overview) && res[0].overview[0]?.totalRev === 5779 };
    }
  },
  {
    id: 'mp-44',
    title: 'Enterprise Customer Order Value Audit',
    difficulty: 'Expert',
    category: 'Aggregation & Grouping',
    description: 'Join customers with orders, filter for customers where tier = "Enterprise", unwind orders, and compute the total spend per enterprise customer.',
    expectedOutput: 'Enterprise customers with aggregated total spend',
    initialCode: 'db.customers.aggregate([ ]);',
    hint: '[ { $match: { tier: "Enterprise" } }, { $lookup: { from: "orders", localField: "_id", foreignField: "user_id", as: "orders" } } ]',
    solution: 'db.customers.aggregate([ { $match: { tier: "Enterprise" } }, { $lookup: { from: "orders", localField: "_id", foreignField: "user_id", as: "orders" } } ])',
    targetCollection: 'customers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 3) return { valid: false, message: 'Expected 3 enterprise customer joins.' };
      return { valid: res.every((d) => d.tier === 'Enterprise' && 'orders' in d) };
    }
  },
  {
    id: 'mp-45',
    title: 'Price Range Bucketing ($bucket)',
    difficulty: 'Expert',
    category: 'Aggregation & Grouping',
    description: 'Partition products into three price tiers using $bucket: [0, 200), [200, 700), and [700, 3000). Count products and average price in each.',
    expectedOutput: 'Three price bucket summaries',
    initialCode: 'db.products.aggregate([ ]);',
    hint: '[ { $bucket: { groupBy: "$price", boundaries: [0, 200, 700, 3000], output: { count: { $sum: 1 }, avgPrice: { $avg: "$price" } } } } ]',
    solution: 'db.products.aggregate([ { $bucket: { groupBy: "$price", boundaries: [0, 200, 700, 3000], output: { count: { $sum: 1 }, avgPrice: { $avg: "$price" } } } } ])',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length < 3) return { valid: false, message: 'Expected 3 price buckets.' };
      return { valid: res.every((d) => '_id' in d && 'count' in d && 'avgPrice' in d) };
    }
  },
  {
    id: 'mp-46',
    title: 'Covered Query Verification',
    difficulty: 'Expert',
    category: 'Index & Optimization',
    description: 'Execute a covered query on users finding by email, projecting only email and suppressing _id ({ _id: 0, email: 1 }).',
    expectedOutput: 'Document containing solely the email field with _id suppressed',
    initialCode: 'db.users.find({ }, { });',
    hint: 'db.users.find({ email: "alice@cloud.io" }, { _id: 0, email: 1 })',
    solution: 'db.users.find({ email: "alice@cloud.io" }, { _id: 0, email: 1 })',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length !== 1) return { valid: false, message: 'Expected 1 matching record.' };
      return { valid: '_id' in res[0] === false && res[0].email === 'alice@cloud.io' && Object.keys(res[0]).length === 1 };
    }
  },
  {
    id: 'mp-47',
    title: 'Customer Average Rating Analysis',
    difficulty: 'Expert',
    category: 'Aggregation & Grouping',
    description: 'Group products by category, projecting category name, totalStock ($sum: stock), and rounding or averaging rating.',
    expectedOutput: 'Category analytics summary',
    initialCode: 'db.products.aggregate([ ]);',
    hint: '[ { $group: { _id: "$category", totalStock: { $sum: "$stock" }, avgRating: { $avg: "$rating" } } } ]',
    solution: 'db.products.aggregate([ { $group: { _id: "$category", totalStock: { $sum: "$stock" }, avgRating: { $avg: "$rating" } } } ])',
    targetCollection: 'products',
    validate: (res) => {
      if (!Array.isArray(res) || res.length < 4) return { valid: false, message: 'Expected 4 categories.' };
      return { valid: res.every((d) => '_id' in d && 'totalStock' in d && 'avgRating' in d) };
    }
  },
  {
    id: 'mp-48',
    title: 'Complex Multi-Stage Revenue Pipeline',
    difficulty: 'Expert',
    category: 'Aggregation & Grouping',
    description: 'Filter orders where total >= 200, group by category to find revenue and item count, and sort by revenue descending.',
    expectedOutput: 'Category revenue summary sorted descending',
    initialCode: 'db.orders.aggregate([ ]);',
    hint: '[ { $match: { total: { $gte: 200 } } }, { $group: { _id: "$category", revenue: { $sum: "$total" }, count: { $sum: 1 } } }, { $sort: { revenue: -1 } } ]',
    solution: 'db.orders.aggregate([ { $match: { total: { $gte: 200 } } }, { $group: { _id: "$category", revenue: { $sum: "$total" }, count: { $sum: 1 } } }, { $sort: { revenue: -1 } } ])',
    targetCollection: 'orders',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected grouped revenue.' };
      return { valid: res[0]._id === 'Hardware' && res[0].revenue === 3249 };
    }
  },
  {
    id: 'mp-49',
    title: 'Tag Popularity Unwind and Filter',
    difficulty: 'Expert',
    category: 'Array & Subdocument',
    description: 'Unwind user tags, group by tag to count occurrences, and filter for tags shared by 2 or more users ($match: count >= 2).',
    expectedOutput: 'Popular tags shared by 2+ users',
    initialCode: 'db.users.aggregate([ ]);',
    hint: '[ { $unwind: "$tags" }, { $group: { _id: "$tags", count: { $sum: 1 } } }, { $match: { count: { $gte: 2 } } } ]',
    solution: 'db.users.aggregate([ { $unwind: "$tags" }, { $group: { _id: "$tags", count: { $sum: 1 } } }, { $match: { count: { $gte: 2 } } } ])',
    targetCollection: 'users',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected popular tags.' };
      return { valid: res.every((d) => d.count >= 2) };
    }
  },
  {
    id: 'mp-50',
    title: 'End-to-End Infrastructure Audit',
    difficulty: 'Expert',
    category: 'Aggregation & Grouping',
    description: 'Filter servers where status = "active", group by region to compute nodeCount, totalCores, and average loadAvg (avgLoad), sorted by nodeCount descending.',
    expectedOutput: 'Active regional compute fleet audit',
    initialCode: 'db.servers.aggregate([ ]);',
    hint: '[ { $match: { status: "active" } }, { $group: { _id: "$region", nodeCount: { $sum: 1 }, totalCores: { $sum: "$cores" }, avgLoad: { $avg: "$loadAvg" } } }, { $sort: { nodeCount: -1 } } ]',
    solution: 'db.servers.aggregate([ { $match: { status: "active" } }, { $group: { _id: "$region", nodeCount: { $sum: 1 }, totalCores: { $sum: "$cores" }, avgLoad: { $avg: "$loadAvg" } } }, { $sort: { nodeCount: -1 } } ])',
    targetCollection: 'servers',
    validate: (res) => {
      if (!Array.isArray(res) || res.length === 0) return { valid: false, message: 'Expected active regional fleet groups.' };
      return { valid: res[0]._id === 'us-east' && res[0].nodeCount === 3 };
    }
  }
];
