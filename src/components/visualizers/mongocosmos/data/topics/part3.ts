import { MongoTopic } from './types';

export const PART3_TOPICS: MongoTopic[] = [
  {
    id: 'single-field-indexes',
    topicNumber: 21,
    title: 'Single-Field Indexes & Sort Directionality',
    category: 'indexing',
    difficulty: 'Beginner',
    summary: 'Single-field indexes create a sorted B-Tree on one document attribute. Sort directionality (1 vs -1) does not matter for single-field queries because WiredTiger traverses B-Trees bidirectionally.',
    definition: 'A Single-Field Index creates an ordered B-Tree index structure on a single top-level or nested field in a collection. For single-field indexes, the index sort order (ascending 1 or descending -1) is arbitrary because the query planner can traverse the B-Tree in reverse direction with zero performance penalty.',
    eli5: 'A single-field index is like a numbered contact list sorted A to Z. You can flip from front to back (A to Z) or back to front (Z to A) just as easily.',
    realWorldExample: {
      description: 'Indexing email addresses for instant user lookup and sorting.',
      sampleDocuments: [
        {
          collection: 'users',
          doc: {
            _id: 'u1',
            email: 'alice@cloud.io',
            role: 'admin'
          }
        }
      ],
      explanation: 'An index on { email: 1 } satisfies both db.users.find().sort({ email: 1 }) and db.users.find().sort({ email: -1 }) with equal O(log N) speed.'
    },
    syntaxSteps: [
      {
        step: 'Create an ascending index on a nested field',
        code: `db.users.createIndex({ "profile.username": 1 }, { unique: true });`,
        note: 'Unique constraint enforces that no two documents have identical values.'
      },
      {
        step: 'Verify index usage with explain()',
        code: `db.users.find({ "profile.username": "alice" }).explain("executionStats");`,
        note: 'Winning plan shows IXSCAN on profile.username_1.'
      }
    ],
    rulesTable: [
      {
        rule: 'Directionality Neutrality',
        explanation: 'For single field indexes, { age: 1 } and { age: -1 } are completely interchangeable.'
      },
      {
        rule: 'The Default _id Index',
        explanation: 'MongoDB automatically creates a unique single-field index on _id; it cannot be dropped.'
      }
    ],
    deepDive: {
      title: 'B-Tree Forward vs Backward Iterator in WiredTiger',
      description: 'WiredTiger B-Tree leaf pages are linked by bidirectional pointers. A query requesting .sort({ age: -1 }) against an index created with { age: 1 } simply seeks to the highest key in the B-Tree and traverses backward using prev pointers. This symmetry does NOT apply to compound indexes with multiple fields!',
      codeSnippet: `// Drop redundant single-field index if compound index with same prefix exists:
db.users.dropIndex("email_1");`,
      warning: 'Every index incurs write overhead on insert/update/delete operations.'
    },
    advantages: [
      'Transforms O(N) collection scans (COLLSCAN) into O(log N) index seeks (IXSCAN)',
      'Satisfies both ascending and descending single-field sort operations natively',
      'Supports unique constraints to prevent duplicate data insertion'
    ],
    disadvantages: [
      'Each index consumes RAM in the working set and requires CPU/IO on every document write',
      'Cannot optimize multi-predicate queries filtering on independent columns'
    ],
    interviewQuestions: [
      {
        question: 'Does the sort direction (1 vs -1) matter when creating a single-field index?',
        answer: 'No. Sort direction does not matter for single-field indexes because WiredTiger can traverse B-Tree leaf nodes in either direction with identical efficiency. Directionality only matters for compound indexes with multiple fields (e.g. { a: 1, b: -1 }).'
      }
    ],
    interviewReadyAnswer: 'A single-field index constructs a B-Tree on one attribute. Because WiredTiger can traverse B-Tree leaves bidirectionally, sort direction (1 vs -1) does not matter for single-field queries. Always verify index seeks via explain().',
    quickTest: {
      question: 'Which index will efficiently support the query: db.users.find().sort({ score: -1 })?',
      options: [
        { key: 'A', text: 'Either { score: 1 } or { score: -1 }' },
        { key: 'B', text: 'Only { score: -1 }' },
        { key: 'C', text: 'Only a compound index on { score: 1, _id: 1 }' },
        { key: 'D', text: 'Only a clustered index' }
      ],
      correctAnswer: 'A',
      explanation: 'Single-field indexes can be traversed in both directions; either { score: 1 } or { score: -1 } will satisfy the descending sort without an in-memory sort.'
    },
    mentalModel: 'A single-field index is a two-way street: you can drive in either direction with equal speed.',
    codeSnippet: `// Create single field index:
db.orders.createIndex({ total: 1 });`,
    takeaways: [
      'Single-field indexes support both ascending and descending sorts.',
      '_id index is unique and created automatically.',
      'Always check executionStats to verify IXSCAN.'
    ],
    commonPitfall: {
      mistake: 'Creating two separate indexes { age: 1 } and { age: -1 } on the same collection.',
      fix: 'Keep only one; single-field indexes traverse bidirectionally.'
    },
    prevTopicId: 'mmapv1-vs-wiredtiger',
    nextTopicId: 'compound-index-esr'
  },
  {
    id: 'compound-index-esr',
    topicNumber: 22,
    title: 'Compound Indexes & The ESR (Equality, Sort, Range) Rule',
    category: 'indexing',
    difficulty: 'Advanced',
    summary: 'The Golden Rule of MongoDB Indexing: Order compound index attributes by Equality first, Sort second, and Range third to minimize scanned index keys.',
    definition: 'A Compound Index contains multiple fields in a defined sequence. The ESR (Equality, Sort, Range) Rule dictates that optimal compound index column ordering is: 1. Equality fields first (exact matches), 2. Sort fields second (satisfying sort order without in-memory sorting), and 3. Range fields last ($gt, $lt, $in).',
    eli5: 'Think of a library catalog. If you want books where Language = English (Equality), sorted by Year (Sort), and Price < $20 (Range): sorting the shelf by Language first, then Year, then Price lets you walk straight to the shelf and read in order without backtracking.',
    realWorldExample: {
      description: 'Optimizing an e-commerce order query: category = "Hardware", sorted by created_at DESC, total > 500.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: {
            category: 'Hardware', // Equality
            created_at: '2026-03-01', // Sort
            total: 1250 // Range
          }
        }
      ],
      explanation: 'Optimal compound index according to ESR: { category: 1, created_at: -1, total: 1 }.'
    },
    syntaxSteps: [
      {
        step: 'Create compound index following ESR order',
        code: `db.orders.createIndex({ category: 1, created_at: -1, total: 1 });`,
        note: 'Equality: category, Sort: created_at, Range: total.'
      },
      {
        step: 'Query using ESR index',
        code: `db.orders.find({
  category: "Hardware",
  total: { $gt: 500 }
}).sort({ created_at: -1 });`,
        note: 'Guarantees totalKeysExamined === nReturned and stage is SORT-free!'
      }
    ],
    rulesTable: [
      {
        rule: 'E - Equality',
        explanation: 'Place exact match fields first to immediately narrow the B-Tree search space to a contiguous range.'
      },
      {
        rule: 'S - Sort',
        explanation: 'Place sort fields next to avoid in-memory blocking sorts (SORT stage) and the 100MB RAM sort limit.'
      },
      {
        rule: 'R - Range',
        explanation: 'Place inequality ($gt, $lt, $in) fields last. Placing a range field before a sort field breaks index-assisted sorting.'
      }
    ],
    deepDive: {
      title: 'Why Placing Range Before Sort Breaks the Index Sort',
      description: 'If you index { total: 1, created_at: -1 } and query { total: { $gt: 500 } }.sort({ created_at: -1 }), the B-Tree scan visits multiple total values (501, 502, ...). Within each total value, created_at is sorted; however, across different total values, created_at is completely unsorted! MongoDB is forced to load all matching records into memory and run a blocking SORT algorithm.',
      codeSnippet: `// ❌ Flawed order (Range before Sort):
db.orders.createIndex({ total: 1, created_at: -1 }); // Incurs SORT stage!
// ✅ Correct ESR order:
db.orders.createIndex({ created_at: -1, total: 1 }); // Non-blocking!`,
      warning: 'If in-memory sort exceeds 100MB, MongoDB aborts the query with an error unless allowDiskUse: true is set.'
    },
    advantages: [
      'Eliminates in-memory sort stages (SORT), preventing 100MB RAM sort exceptions',
      'Achieves optimal index selectivity: keysExamined precisely matches nReturned',
      'A single compound index can also satisfy queries filtering on its prefix attributes'
    ],
    disadvantages: [
      'Large compound indexes consume significant RAM cache space',
      'Cannot be traversed backwards if sort directions differ in opposing vectors'
    ],
    interviewQuestions: [
      {
        question: 'Explain the ESR rule in MongoDB and what happens if you place a Range field before a Sort field in a compound index?',
        answer: 'The ESR rule orders compound index fields: Equality, Sort, then Range. If a Range field is placed before a Sort field, the index scan traverses multiple disjoint keys for the range predicate. Because documents across those disparate range values are not sorted relative to each other, the database cannot use the index to satisfy the sort and must execute an expensive in-memory SORT stage.'
      }
    ],
    interviewReadyAnswer: 'The ESR rule states that compound indexes should be ordered: Equality fields first to partition the search space, Sort fields second to avoid in-memory sorting, and Range fields last. Violating ESR by placing Range before Sort triggers an in-memory blocking SORT stage.',
    quickTest: {
      question: 'Which compound index optimally satisfies: db.users.find({ country: "US", age: { $gte: 21 } }).sort({ signupDate: -1 })?',
      options: [
        { key: 'A', text: '{ country: 1, signupDate: -1, age: 1 }' },
        { key: 'B', text: '{ age: 1, country: 1, signupDate: -1 }' },
        { key: 'C', text: '{ age: 1, signupDate: -1, country: 1 }' },
        { key: 'D', text: '{ signupDate: -1, age: 1, country: 1 }' }
      ],
      correctAnswer: 'A',
      explanation: 'Following ESR: country is Equality (E), signupDate is Sort (S), and age is Range (R). Thus, { country: 1, signupDate: -1, age: 1 } is optimal.'
    },
    mentalModel: 'ESR: Filter down (E), line them up (S), then trim the edges (R).',
    codeSnippet: `// Verify no SORT stage exists in explain plan:
const plan = db.orders.find({ category: "Hardware", total: { $gt: 500 } })
  .sort({ created_at: -1 }).explain("executionStats");
console.log(plan.executionStats.executionStages.stage); // Should be IXSCAN / FETCH, NOT SORT`,
    takeaways: [
      'ESR = Equality, Sort, Range.',
      'Never place a range predicate before a sort predicate in an index.',
      'Avoiding the in-memory SORT stage protects against 100MB memory limits.'
    ],
    commonPitfall: {
      mistake: 'Putting timestamp range before sort column in index, causing in-memory sort spills on high-volume queries.',
      fix: 'Put equality fields first, sort field second, range field last.'
    },
    prevTopicId: 'single-field-indexes',
    nextTopicId: 'multikey-indexes-arrays'
  },
  {
    id: 'multikey-indexes-arrays',
    topicNumber: 23,
    title: 'Multikey Indexes on Arrays & Architecture Restrictions',
    category: 'indexing',
    difficulty: 'Intermediate',
    summary: 'When an index includes an array field, MongoDB creates a Multikey index where each array element receives its own B-Tree entry, introducing critical compound index constraints.',
    definition: 'A Multikey Index is an index where one or more indexed fields is an array. For each document, MongoDB creates a separate index key for every element in the array. In a compound multikey index, at most ONE field can be an array to prevent exponential combinatorial index entry explosions.',
    eli5: 'If a book has 5 tags, a multikey index creates 5 separate bookmarks pointing to that same book. If you tried to index 5 tags and 5 authors together combinatorially, you would have to write 25 bookmarks for just one book!',
    realWorldExample: {
      description: 'Indexing user tags for instant keyword searches.',
      sampleDocuments: [
        {
          collection: 'users',
          doc: {
            _id: 'u1',
            name: 'Dev Dave',
            tags: ['backend', 'go', 'k8s'] // Generates 3 index keys!
          }
        }
      ],
      explanation: 'An index on { tags: 1 } creates three index keys pointing to document u1.'
    },
    syntaxSteps: [
      {
        step: 'Create multikey index on array field',
        code: `db.users.createIndex({ tags: 1 });`,
        note: 'Automatically flagged as multikey in catalog metadata.'
      },
      {
        step: 'Query array containment using multikey index',
        code: `db.users.find({ tags: "k8s" });`,
        note: 'Executes an IXSCAN on the "k8s" index key.'
      }
    ],
    rulesTable: [
      {
        rule: 'Single Array Limit',
        explanation: 'A compound index cannot contain more than one array field (prevents Cartesian product explosion).'
      },
      {
        rule: 'Multikey Flag',
        explanation: 'Once a collection receives a single document with an array in an indexed field, the index is permanently marked multikey.'
      }
    ],
    deepDive: {
      title: 'Cartesian Product Prevention Rule',
      description: 'If MongoDB allowed compound indexes on two array fields (e.g. tags: [5 items] and categories: [5 items]), a single document would generate 5 x 5 = 25 B-Tree entries. If both arrays had 100 items, one document would generate 10,000 index entries, destroying write throughput and exhausting RAM.',
      codeSnippet: `// ❌ Attempting to create compound index on two arrays throws error:
// db.products.createIndex({ tags: 1, categories: 1 });
// MongoServerError: cannot index parallel arrays [tags] [categories]`,
      warning: 'Never attempt to index two parallel array fields in a single compound index.'
    },
    advantages: [
      'Enables fast indexed lookups for array membership and tags queries',
      'Supports element matching ($elemMatch) on arrays of nested subdocuments',
      'Seamlessly handled by the same syntax as scalar indexes'
    ],
    disadvantages: [
      'Documents with large arrays generate many B-Tree entries, increasing write latency and index size',
      'Cannot index two parallel array fields in the same compound index'
    ],
    interviewQuestions: [
      {
        question: 'Why does MongoDB prohibit creating a compound index on two parallel array fields?',
        answer: 'To prevent a Cartesian product explosion of index entries. If a document contained two arrays with N and M elements respectively, indexing both in a compound index would generate N x M index keys for that single document, causing severe write amplification, index bloat, and memory exhaustion.'
      }
    ],
    interviewReadyAnswer: 'When an indexed field contains an array, MongoDB creates a Multikey index where each array item generates a separate B-Tree entry. To prevent combinatorial key explosion, MongoDB strictly forbids indexing more than one array field in a compound index.',
    quickTest: {
      question: 'What error does MongoDB throw if you attempt to insert a document with two arrays into a compound index covering both fields?',
      options: [
        { key: 'A', text: 'cannot index parallel arrays' },
        { key: 'B', text: 'OutOfMemoryError' },
        { key: 'C', text: 'IndexKeyTooLong' },
        { key: 'D', text: 'BSONObjectTooLarge' }
      ],
      correctAnswer: 'A',
      explanation: 'MongoDB rejects compound indexes spanning multiple array fields with the error: "cannot index parallel arrays".'
    },
    mentalModel: 'Multikey indexes fan out: 1 document becomes N index bookmarks.',
    codeSnippet: `// Check if an index is multikey:
db.users.getIndexes(); // Look for "isMultiKey": true`,
    takeaways: [
      'Multikey indexes index individual array elements.',
      'Only ONE field in a compound index may be an array.',
      'Large arrays multiply index write costs.'
    ],
    commonPitfall: {
      mistake: 'Indexing an array field that contains thousands of items per document, causing severe write latency.',
      fix: 'Keep indexed arrays small or use specialized text/search indexes.'
    },
    prevTopicId: 'compound-index-esr',
    nextTopicId: 'covered-queries'
  },
  {
    id: 'covered-queries',
    topicNumber: 24,
    title: 'Covered Queries & Zero-Document Heap Scans',
    category: 'indexing',
    difficulty: 'Advanced',
    summary: 'A Covered Query is the fastest possible read in MongoDB: every queried and projected field exists within the index B-Tree, completely bypassing document heap reads.',
    definition: 'A Covered Query is a query where: 1. All fields in the query filter are part of an index, and 2. All fields returned in the projection are part of that same index (with _id explicitly suppressed if not in the index). Because the index satisfies the entire query, WiredTiger reads only the B-Tree keys and never reads document payloads from disk or cache.',
    eli5: 'Imagine asking a librarian: "What year was Pride and Prejudice published?" Instead of walking to the back room and pulling the heavy book off the shelf, the librarian reads the year directly from the index card in their hand.',
    realWorldExample: {
      description: 'Ultra-high-throughput user authentication checking password hash and status.',
      sampleDocuments: [
        {
          collection: 'users',
          doc: {
            username: 'alice',
            passwordHash: '$2a$12$...',
            status: 'active'
          }
        }
      ],
      explanation: 'Index on { username: 1, passwordHash: 1, status: 1 } satisfies the query with zero document heap lookups.'
    },
    syntaxSteps: [
      {
        step: 'Create covering compound index',
        code: `db.users.createIndex({ username: 1, status: 1, email: 1 });`,
        note: 'Index contains all three fields.'
      },
      {
        step: 'Execute covered query suppressing _id',
        code: `db.users.find(
  { username: "alice", status: "active" },
  { _id: 0, email: 1, username: 1 } // _id: 0 is mandatory!
).explain("executionStats");`,
        note: 'explain() shows totalDocsExamined: 0 and stage: PROJECTION_COVERED.'
      }
    ],
    rulesTable: [
      {
        rule: 'totalDocsExamined: 0',
        explanation: 'The definitive indicator of a covered query in executionStats.'
      },
      {
        rule: '_id Suppression Mandatory',
        explanation: 'Unless _id is part of the index, the projection must include _id: 0.'
      },
      {
        rule: 'No Multikey Indexes',
        explanation: 'An index containing an array field can never cover a query.'
      }
    ],
    deepDive: {
      title: 'Why Covered Queries Yield a 10x Performance Boost',
      description: 'In a standard index scan (IXSCAN), finding an entry in the B-Tree produces a RecordId pointer. The engine must then perform a second lookup into the collection data store (FETCH stage) to load the BSON document. A covered query eliminates the FETCH stage entirely, cutting memory access and disk I/O in half.',
      codeSnippet: `// Winning plan in a covered query:
// "stage": "PROJECTION_COVERED",
// "totalDocsExamined": 0,
// "totalKeysExamined": 1,
// "nReturned": 1`,
      warning: 'Never project fields not present in the index if aiming for covered query execution.'
    },
    advantages: [
      'Eliminates the FETCH stage, resulting in maximum query throughput and lowest possible latency',
      'totalDocsExamined is exactly 0: zero document cache pages loaded',
      'Dramatically reduces working set memory pressure on high-frequency read APIs'
    ],
    disadvantages: [
      'Requires wide compound indexes that consume more RAM to store all projected fields',
      'Does not work on multikey (array) indexes or embedded subdocument queries'
    ],
    interviewQuestions: [
      {
        question: 'What two conditions are required for a query to be considered "Covered" in MongoDB?',
        answer: '1. All fields present in the query filter and sort must be part of an index. 2. All fields returned in the projection must be present in that same index, and the _id field must be explicitly suppressed ({ _id: 0 }) unless _id is an indexed component.'
      }
    ],
    interviewReadyAnswer: 'A covered query is fulfilled entirely from the index B-Tree without touching the collection document store. It requires all filtered and projected fields to be in the index with _id: 0 suppressed, resulting in totalDocsExamined: 0 in explain plan execution stats.',
    quickTest: {
      question: 'Which explain() metric definitively proves that a query was executed as a Covered Query?',
      options: [
        { key: 'A', text: 'totalDocsExamined === 0' },
        { key: 'B', text: 'totalKeysExamined === 0' },
        { key: 'C', text: 'stage === "COLLSCAN"' },
        { key: 'D', text: 'isMultiKey === true' }
      ],
      correctAnswer: 'A',
      explanation: 'A covered query satisfies all fields from index B-Trees, meaning totalDocsExamined is strictly 0.'
    },
    mentalModel: 'Covered queries read the index card, never opening the book.',
    codeSnippet: `// Verify covered query execution:
const exp = db.users.find({ username: "alice" }, { _id: 0, username: 1 }).explain("executionStats");
console.log("Docs examined: " + exp.executionStats.totalDocsExamined); // 0`,
    takeaways: [
      'Covered queries have totalDocsExamined: 0.',
      'Always suppress _id: 0 unless _id is in the index.',
      'Multikey indexes cannot cover queries.'
    ],
    commonPitfall: {
      mistake: 'Forgetting to add { _id: 0 } to the projection, causing an unnecessary FETCH stage.',
      fix: 'Always explicitly suppress _id when covering queries.'
    },
    prevTopicId: 'multikey-indexes-arrays',
    nextTopicId: 'partial-and-sparse-indexes'
  },
  {
    id: 'partial-and-sparse-indexes',
    topicNumber: 25,
    title: 'Partial & Sparse Indexes: Saving RAM on Skewed Data',
    category: 'indexing',
    difficulty: 'Intermediate',
    summary: 'Partial and Sparse indexes index only documents matching a filter expression or containing a target field, slashing index RAM footprint by up to 95%.',
    definition: 'A Partial Index only indexes documents in a collection that meet a specified filter expression (partialFilterExpression). A Sparse Index only indexes documents that contain the indexed field. Partial indexes supersede sparse indexes by offering expressive filtering operators ($gt, $exists, $type).',
    eli5: 'Instead of making an index entry for all 1,000,000 orders, you create a VIP index that only entries for orders where total > $1,000. The index is 99% smaller and super fast.',
    realWorldExample: {
      description: 'Indexing only active users with verified email addresses.',
      sampleDocuments: [
        {
          collection: 'users',
          doc: {
            email: 'verified_user@cloud.io',
            status: 'active'
          }
        }
      ],
      explanation: 'Only 5% of users are verified; indexing only active users saves 95% of index RAM.'
    },
    syntaxSteps: [
      {
        step: 'Create a partial index with filter expression',
        code: `db.users.createIndex(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "active", email: { $exists: true } }
  }
);`,
        note: 'Enforces unique email ONLY on active accounts, allowing multiple inactive dummy accounts!'
      },
      {
        step: 'Query that utilizes the partial index',
        code: `db.users.find({ email: "verified_user@cloud.io", status: "active" });`,
        note: 'Query filter must match or be a subset of the partialFilterExpression.'
      }
    ],
    rulesTable: [
      {
        rule: 'Subset Requirement',
        explanation: 'A query can only use a partial index if its WHERE criteria guarantees the result is a subset of the partialFilterExpression.'
      },
      {
        rule: 'Sparse vs Partial',
        explanation: 'Sparse indexes only check field existence; Partial indexes allow complex expressions ($gt, $eq, $exists).'
      }
    ],
    deepDive: {
      title: 'Unique Constraints on Partial Indexes',
      description: 'In many business domains, uniqueness is only required for active records. For example, a username must be unique among active accounts, but deleted accounts can retain duplicate historic usernames. A unique partial index cleanly solves this without application-level workarounds.',
      codeSnippet: `// Unique constraint scoped only to un-deleted accounts:
db.accounts.createIndex(
  { username: 1 },
  { unique: true, partialFilterExpression: { deleted: false } }
);`,
      warning: 'If a query omits the filter condition, MongoDB cannot use the partial index and falls back to a COLLSCAN.'
    },
    advantages: [
      'Reduces index size by up to 95% for skewed or status-filtered datasets',
      'Faster write operations: inserts for non-matching documents bypass index updates',
      'Enables conditional unique constraints on subsets of data'
    ],
    disadvantages: [
      'Queries that do not include the partial filter predicate cannot use the index',
      'Cannot be combined with sparse option in the same index'
    ],
    interviewQuestions: [
      {
        question: 'Why are Partial Indexes preferred over Sparse Indexes in modern MongoDB architecture?',
        answer: 'Sparse indexes only filter on field existence ({ field: { $exists: true } }), whereas Partial Indexes support expressive filter predicates (e.g. { rating: { $gte: 4 }, status: "active" }). In fact, sparse indexes are essentially a subset of partial indexes.'
      }
    ],
    interviewReadyAnswer: 'Partial indexes index only documents satisfying a partialFilterExpression. They drastically cut RAM usage and write overhead on skewed data and enable conditional unique constraints. The query planner will only use a partial index if the query predicate is guaranteed to be a subset of the index filter.',
    quickTest: {
      question: 'Under what condition will the query planner refuse to use a Partial Index on { email: 1 } created with partialFilterExpression: { status: "active" }?',
      options: [
        { key: 'A', text: 'When the query searches for email without filtering for status: "active"' },
        { key: 'B', text: 'When the collection has more than 10,000 documents' },
        { key: 'C', text: 'When the collection is replicated' },
        { key: 'D', text: 'When the document has an ObjectId primary key' }
      ],
      correctAnswer: 'A',
      explanation: 'The query planner cannot use a partial index unless the query filter guarantees that all possible matching documents reside within the index.'
    },
    mentalModel: 'Partial indexes are filtered bookmarks: only items that matter get indexed.',
    codeSnippet: `// Create partial index for pending orders:
db.orders.createIndex(
  { created_at: 1 },
  { partialFilterExpression: { status: "pending" } }
);`,
    takeaways: [
      'Partial indexes filter which documents enter the B-Tree.',
      'Saves immense RAM and speeds up writes.',
      'Queries must include the partial filter to use the index.'
    ],
    commonPitfall: {
      mistake: 'Expecting a partial index to speed up a generic find() query that omits the partial filter.',
      fix: 'Always include the partial filter expression in queries intended to use the index.'
    },
    prevTopicId: 'covered-queries',
    nextTopicId: 'ttl-indexes-expiry'
  },
  {
    id: 'ttl-indexes-expiry',
    topicNumber: 26,
    title: 'TTL (Time To Live) Indexes & Automated Document Expiry',
    category: 'indexing',
    difficulty: 'Intermediate',
    summary: 'TTL indexes automatically purge documents from collections after a designated time interval based on a date timestamp field, replacing custom cron cleanup jobs.',
    definition: 'A TTL (Time To Live) Index is a specialized single-field index that MongoDB uses to automatically delete documents after a specified number of seconds (expireAfterSeconds). A background thread (the TTLMonitor) runs every 60 seconds, scanning the TTL index B-Tree and purging expired documents.',
    eli5: 'Think of an expiration date stamped on a carton of milk. Every minute, a store clerk checks the milk aisle and throws away any carton whose date has passed.',
    realWorldExample: {
      description: 'Auto-expiring temporary user login sessions after 24 hours.',
      sampleDocuments: [
        {
          collection: 'sessions',
          doc: {
            session_token: 'tok_982172',
            user_id: 'u42',
            created_at: 'ISODate("2026-03-01T10:00:00Z")' // Expires at 2026-03-02T10:00:00Z
          }
        }
      ],
      explanation: 'Setting expireAfterSeconds: 86400 (24h) guarantees the session is purged automatically.'
    },
    syntaxSteps: [
      {
        step: 'Create a TTL index expiring documents after 1 hour (3600s)',
        code: `db.sessions.createIndex(
  { created_at: 1 },
  { expireAfterSeconds: 3600 }
);`,
        note: 'created_at field must store a BSON UTC Date (ISODate).'
      },
      {
        step: 'Modify expireAfterSeconds on an existing live TTL index',
        code: `db.runCommand({
  collMod: "sessions",
  index: {
    keyPattern: { created_at: 1 },
    expireAfterSeconds: 7200 // Extended to 2 hours
  }
});`,
        note: 'Modifies expiry interval without dropping and rebuilding the index.'
      }
    ],
    rulesTable: [
      {
        rule: 'UTC Date Type Required',
        explanation: 'If the indexed field is not a Date (e.g. integer timestamp or string), the document will never expire.'
      },
      {
        rule: 'Primary Node Deletions',
        explanation: 'The TTL thread runs only on the primary node and replicates deletes to secondaries via the oplog.'
      },
      {
        rule: 'Single-Field Only',
        explanation: 'TTL indexes must be single-field; compound TTL indexes are not supported.'
      }
    ],
    deepDive: {
      title: 'TTL Monitor Execution Loop & Timing Guarantees',
      description: 'The TTLMonitor thread awakens every 60 seconds. Because it runs once a minute and deletes documents in batches, a document whose TTL expires at 10:00:05 might not be deleted until 10:00:59. Applications requiring exact sub-second expiry must include a filter: { expireAt: { $gt: new Date() } } in query statements.',
      codeSnippet: `// Check TTL deletion metrics in serverStatus:
db.serverStatus().metrics.ttl;
// "deletedDocuments": total expired documents purged`,
      warning: 'Capped collections do not support TTL indexes.'
    },
    advantages: [
      'Eliminates custom background cron jobs or worker scripts for data retention cleanup',
      'Deletions are automatically sequenced through the replication oplog',
      'Supports dynamic per-document expiry by setting expireAfterSeconds: 0 and storing future dates'
    ],
    disadvantages: [
      'Deletions are not sub-second instantaneous (subject to the 60s TTL thread period)',
      'High deletion bursts can create temporary I/O lock contention on primary nodes'
    ],
    interviewQuestions: [
      {
        question: 'How can you configure a TTL index so that each document has a completely custom expiration time?',
        answer: 'Set expireAfterSeconds: 0 on the index, and in each document, store the exact future expiration date/time in the indexed field (e.g. expireAt: ISODate("2026-12-31T23:59:59Z")). When the current time reaches that date, the document expires.'
      }
    ],
    interviewReadyAnswer: 'TTL indexes automatically delete documents after expireAfterSeconds based on a BSON Date field. The TTLMonitor background task runs every 60 seconds on the primary and replicates deletes through the oplog. Custom per-document expiration is achieved by setting expireAfterSeconds: 0 and storing target expiration timestamps.',
    quickTest: {
      question: 'What happens to a document in a collection with a TTL index if its indexed timestamp field contains a string instead of an ISODate?',
      options: [
        { key: 'A', text: 'The document will never expire' },
        { key: 'B', text: 'The document is deleted immediately' },
        { key: 'C', text: 'MongoDB throws a collection corruption error' },
        { key: 'D', text: 'The document is moved to GridFS' }
      ],
      correctAnswer: 'A',
      explanation: 'TTL indexes only process BSON Date types. Documents where the field is not a Date or is missing are simply ignored by the TTL monitor.'
    },
    mentalModel: 'TTL indexes are automated garbage collectors: timestamps trigger self-destruction.',
    codeSnippet: `// Check TTL monitor status:
db.serverStatus().metrics.ttl.passes;`,
    takeaways: [
      'TTL indexes auto-delete documents based on a Date field.',
      'TTLMonitor thread runs every 60 seconds.',
      'Set expireAfterSeconds: 0 for dynamic per-document expiration dates.'
    ],
    commonPitfall: {
      mistake: 'Storing epoch milliseconds as an integer in a TTL field and wondering why documents never expire.',
      fix: 'Always store BSON UTC Dates: new Date() or ISODate().'
    },
    prevTopicId: 'partial-and-sparse-indexes',
    nextTopicId: 'text-and-wildcard-indexes'
  },
  {
    id: 'text-and-wildcard-indexes',
    topicNumber: 27,
    title: 'Text Indexes & Wildcard ($**) Index Architectures',
    category: 'indexing',
    difficulty: 'Advanced',
    summary: 'Text indexes provide tokenization and stemming for keyword search, while Wildcard indexes ($**) index arbitrary, dynamic document schemas and polymorphic attributes.',
    definition: 'Text Indexes tokenize string fields, stem root words (e.g. "running" -> "run"), strip stop words, and calculate TF-IDF relevance scores. Wildcard Indexes ({ "$**": 1 } or { "metadata.$**": 1 }) automatically index all scalar fields within dynamic, unpredictable JSON payloads.',
    eli5: 'A standard index is like looking up an exact word in an alphabetical list. A Text index is like a search engine that understands word roots. A Wildcard index is a magic net that catches every new field without you having to define them one by one.',
    realWorldExample: {
      description: 'Indexing dynamic product attributes where each category has custom keys (color, voltage, size, weight).',
      sampleDocuments: [
        {
          collection: 'products',
          doc: {
            name: 'Drill Pro',
            attributes: { voltage: '20V', rpm: 1500, wireless: true }
          }
        }
      ],
      explanation: 'A wildcard index on "attributes.$**" enables index-accelerated queries on any arbitrary attribute.'
    },
    syntaxSteps: [
      {
        step: 'Create a full-text search index with language stemming',
        code: `db.articles.createIndex({ title: "text", body: "text" });`,
        note: 'Only one text index is permitted per collection.'
      },
      {
        step: 'Query using $text search with relevance sorting',
        code: `db.articles.find(
  { $text: { $search: "database scaling" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });`,
        note: 'Sorts results by algorithmic relevance textScore.'
      },
      {
        step: 'Create a wildcard index on dynamic subdocuments',
        code: `db.products.createIndex({ "attributes.$**": 1 });`,
        note: 'Indexes all scalar paths within attributes.'
      }
    ],
    rulesTable: [
      {
        rule: 'One Text Index Limit',
        explanation: 'A collection can contain at most ONE text index (can cover multiple compound fields).'
      },
      {
        rule: 'Wildcard Limitations',
        explanation: 'Wildcard indexes cannot be compound, multikey-compound, or unique.'
      }
    ],
    deepDive: {
      title: 'Wildcard Index Path Expansion Mechanics',
      description: 'When a wildcard index is created on "metadata.$**", WiredTiger flattens every nested object into distinct path-value tuples: metadata.specs.ram = 32, metadata.env = "prod". This is ideal for multi-tenant applications or SaaS platforms where users define custom form fields without pre-defined schemas.',
      codeSnippet: `// Wildcard projection filtering (include/exclude paths):
db.products.createIndex(
  { "$**": 1 },
  { wildcardProjection: { "attributes.secret": 0, "history": 0 } }
);`,
      warning: 'Full text search in MongoDB does not replace dedicated search engines (Elasticsearch/Atlas Search) for fuzzy typo tolerance.'
    },
    advantages: [
      'Wildcard indexes eliminate index migration overhead on dynamic polymorphic schemas',
      'Text indexes provide stemming, stop words, and relevance scoring natively',
      'Supports searching across arbitrary nested sub-properties with zero schema setup'
    ],
    disadvantages: [
      'Text indexes are heavy on writes and consume substantial RAM cache',
      'Wildcard indexes consume significant storage if applied to root { "$**": 1 } on deep documents'
    ],
    interviewQuestions: [
      {
        question: 'When should you choose a Wildcard Index over creating individual compound indexes?',
        answer: 'Use Wildcard Indexes when querying dynamic, unpredictable, or user-defined schemas (e.g. an attributes subdocument in an e-commerce catalog or custom metadata in a multi-tenant SaaS application) where the exact field names are unknown in advance or constantly changing.'
      }
    ],
    interviewReadyAnswer: 'Text indexes provide tokenization, language stemming, and relevance scoring (max 1 per collection). Wildcard indexes ({ "$**": 1 }) index dynamic scalar paths across polymorphic schemas, ideal for user-defined attributes without catalog index churn.',
    quickTest: {
      question: 'How many Text indexes can be created on a single MongoDB collection?',
      options: [
        { key: 'A', text: 'Exactly one' },
        { key: 'B', text: 'Up to 5' },
        { key: 'C', text: 'Unlimited' },
        { key: 'D', text: 'None (text search is only supported in Atlas)' }
      ],
      correctAnswer: 'A',
      explanation: 'A collection can have at most one text index, but that single text index can include multiple string fields.'
    },
    mentalModel: 'Text indexes are dictionaries; Wildcard indexes are omnidirectional nets.',
    codeSnippet: `// Query wildcard index:
db.products.find({ "attributes.voltage": "20V" });`,
    takeaways: [
      'Text indexes support $text search and textScore relevance.',
      'Only one text index per collection.',
      'Wildcard indexes ($**) optimize dynamic polymorphic schemas.'
    ],
    commonPitfall: {
      mistake: 'Expecting $text search to support wildcard substring matching like *data*.',
      fix: 'Use regex or Atlas Search (Lucene) for true infix/fuzzy typo matching.'
    },
    prevTopicId: 'ttl-indexes-expiry',
    nextTopicId: 'geospatial-2dsphere'
  },
  {
    id: 'geospatial-2dsphere',
    topicNumber: 28,
    title: 'Geospatial 2dsphere Indexes & GeoJSON Spatial Queries',
    category: 'indexing',
    difficulty: 'Intermediate',
    summary: 'The 2dsphere index calculates spherical geometries on Earth’s curved surface using GeoJSON objects, powering proximity, polygon containment, and intersection queries.',
    definition: 'A 2dsphere index supports geospatial queries on a spherical model of the Earth (WGS84 datum). It indexes GeoJSON geometry objects (Point, LineString, Polygon, MultiPolygon) and executes spatial calculations like $near, $geoWithin, and $geoIntersects.',
    eli5: 'Instead of treating the world like a flat sheet of paper (which distorts distances), a 2dsphere index treats the Earth like an actual round globe, calculating true distances as airplanes fly.',
    realWorldExample: {
      description: 'Finding all restaurants within 2 kilometers of a user\'s GPS coordinates.',
      sampleDocuments: [
        {
          collection: 'restaurants',
          doc: {
            name: 'Luigi\'s Pizza',
            location: {
              type: 'Point',
              coordinates: [-73.9857, 40.7484] // Longitude FIRST, then Latitude!
            }
          }
        }
      ],
      explanation: 'The $near operator finds matching points sorted by distance from the coordinate.'
    },
    syntaxSteps: [
      {
        step: 'Create a 2dsphere index on a GeoJSON field',
        code: `db.restaurants.createIndex({ location: "2dsphere" });`,
        note: 'Always requires valid GeoJSON Point structure.'
      },
      {
        step: 'Query locations within 2000 meters sorted by proximity',
        code: `db.restaurants.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [-73.9857, 40.7484] },
      $maxDistance: 2000 // Distance in meters
    }
  }
});`,
        note: 'Returns points ordered by geographic distance.'
      }
    ],
    rulesTable: [
      {
        rule: 'Coordinate Order',
        explanation: 'GeoJSON strictly mandates [Longitude, Latitude] order (-180 to 180, -90 to 90).'
      },
      {
        rule: 'Distance Units',
        explanation: 'Spherical queries ($near, $maxDistance) calculate distance in meters.'
      }
    ],
    deepDive: {
      title: 'The Longitude / Latitude Inversion Trap',
      description: 'The #1 bug in geospatial databases is entering coordinates as [Latitude, Longitude]. GeoJSON follows cartographic [X, Y] Cartesian conventions: X is Longitude (-180 to 180), Y is Latitude (-90 to 90). Inverting them places New York City in the Antarctic Ocean and throws out-of-bounds index errors.',
      codeSnippet: `// Valid GeoJSON Point:
// { type: "Point", coordinates: [ -122.4194, 37.7749 ] } // San Francisco (Lng, Lat)`,
      warning: 'Latitude values exceeding 90 or -90 crash 2dsphere index writes.'
    },
    advantages: [
      'Accurate spherical Earth geodesic calculations without flat-projection distortions',
      'Native support for complex polygonal boundary containment ($geoWithin)',
      'Automatically sorts proximity results by distance from origin coordinates'
    ],
    disadvantages: [
      'Geospatial math is CPU-intensive compared to standard scalar B-Tree comparisons',
      'Requires strict adherence to GeoJSON formatting rules'
    ],
    interviewQuestions: [
      {
        question: 'What is the coordinate order required for GeoJSON Point objects in MongoDB 2dsphere indexes?',
        answer: 'GeoJSON strictly requires [Longitude, Latitude] order (X coordinate, then Y coordinate). Reversing the order to [Latitude, Longitude] is a critical error that causes incorrect geographic calculations or out-of-bounds index exceptions.'
      }
    ],
    interviewReadyAnswer: 'The 2dsphere index calculates spherical geometries using GeoJSON (Point, Polygon) on Earth\'s WGS84 ellipsoid. It requires coordinates in [Longitude, Latitude] order and powers $near, $geoWithin, and $geoIntersects queries measured in meters.',
    quickTest: {
      question: 'Which coordinate order is strictly required for GeoJSON points in MongoDB?',
      options: [
        { key: 'A', text: '[Longitude, Latitude]' },
        { key: 'B', text: '[Latitude, Longitude]' },
        { key: 'C', text: '[Altitude, Latitude]' },
        { key: 'D', text: '[Degrees, Minutes]' }
      ],
      correctAnswer: 'A',
      explanation: 'GeoJSON adheres to standard X/Y Cartesian ordering: Longitude (X) followed by Latitude (Y).'
    },
    mentalModel: '2dsphere is GPS math on a true globe: Longitude first, Latitude second.',
    codeSnippet: `// Check polygon boundary containment:
db.zones.find({
  area: {
    $geoIntersects: {
      $geometry: { type: "Point", coordinates: [-73.98, 40.74] }
    }
  }
});`,
    takeaways: [
      '2dsphere uses Earth\'s curved spherical geometry.',
      'Coordinate format is strictly [Longitude, Latitude].',
      '$near returns documents ordered by meter distance.'
    ],
    commonPitfall: {
      mistake: 'Entering [Latitude, Longitude], causing documents to be mapped to the wrong hemisphere.',
      fix: 'Always store coordinates as [Longitude, Latitude].'
    },
    prevTopicId: 'text-and-wildcard-indexes',
    nextTopicId: 'hidden-indexes-testing'
  },
  {
    id: 'hidden-indexes-testing',
    topicNumber: 29,
    title: 'Hidden Indexes: Evaluating Index Dropping Safely',
    category: 'indexing',
    difficulty: 'Intermediate',
    summary: 'Hidden indexes allow database administrators to hide an index from the query planner to safely test the impact of index removal before permanently dropping it.',
    definition: 'A Hidden Index is an index that is invisible to the query optimizer during query plan evaluation. While hidden, the index is still actively updated during inserts, updates, and deletes, maintaining full B-Tree synchronization. If queries degrade after hiding, the index can be unhidden instantly without a costly rebuild.',
    eli5: 'Dropping a large index in production is like cutting a bridge: if traffic gets ruined, rebuilding the bridge takes hours. Hiding an index is like putting up a temporary "Road Closed" sign: you test the traffic, and if a traffic jam happens, you just take the sign down in 1 second.',
    realWorldExample: {
      description: 'Testing whether an unmaintained 50GB index on orders.customer_code can be safely dropped without impacting production.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: {
            _id: 'o1',
            customer_code: 'CUST-881'
          }
        }
      ],
      explanation: 'Hiding the index hides it from the query planner. If query response times remain normal for 48 hours, it is safe to permanently drop.'
    },
    syntaxSteps: [
      {
        step: 'Hide an index from query optimization',
        code: `db.orders.hideIndex("customer_code_1");`,
        note: 'Index remains updated on writes, but query planner ignores it.'
      },
      {
        step: 'Unhide an index instantly if performance degrades',
        code: `db.orders.unhideIndex("customer_code_1");`,
        note: 'Immediately available to query planner in O(1) time without rebuilding.'
      }
    ],
    rulesTable: [
      {
        rule: 'Write Maintenance',
        explanation: 'Hidden indexes still incur write performance overhead and disk storage footprint.'
      },
      {
        rule: '_id Exception',
        explanation: 'The primary key _id index cannot be hidden.'
      }
    ],
    deepDive: {
      title: 'Zero-Downtime Index Deprecation Workflow',
      description: 'Dropping a 100GB index takes 1 second, but rebuilding it if queries collapse takes hours of disk I/O, CPU, and cache thrashing. The enterprise best practice is: 1. Hide index, 2. Monitor slow query logs and p99 latency for 72 hours, 3. If no regressions occur, run dropIndex(). If latency spikes, unhideIndex() instantly restores performance.',
      codeSnippet: `// Check index hidden status:
db.orders.getIndexes().forEach(idx => {
  print(idx.name + " -> hidden: " + (idx.hidden || false));
});`,
      warning: 'Do not leave indexes hidden indefinitely; they continue consuming write IOPS and cache space.'
    },
    advantages: [
      'Eliminates the catastrophic risk of dropping an index that was secretly used by rare cron jobs or reports',
      'Unhiding is an instantaneous metadata operation taking under 1 millisecond',
      'Allows safe performance auditing in live production clusters'
    ],
    disadvantages: [
      'While hidden, the index continues to consume write overhead and disk space',
      'Cannot be used to test write throughput improvements until permanently dropped'
    ],
    interviewQuestions: [
      {
        question: 'Why should you hide an index instead of immediately dropping it when performing index cleanup in production?',
        answer: 'Dropping an index is irreversible; if you discover that a critical production job relied on that index, rebuilding a large index on a multi-terabyte collection takes hours and severely impacts cluster performance. Hiding the index makes it invisible to the planner while keeping it synchronized on disk, allowing you to instantly unhide it in 1ms if query regressions occur.'
      }
    ],
    interviewReadyAnswer: 'Hidden indexes are invisible to the query planner but continue to be updated on writes. They provide a safe, zero-risk deprecation path: hiding an index tests whether queries regress, allowing instantaneous unhiding in 1ms without the hours of downtime required to rebuild a dropped index.',
    quickTest: {
      question: 'Does a hidden index continue to receive updates when documents are inserted or modified?',
      options: [
        { key: 'A', text: 'Yes, it remains fully synchronized with all collection writes' },
        { key: 'B', text: 'No, writes bypass hidden indexes' },
        { key: 'C', text: 'Only if writeConcern is set to majority' },
        { key: 'D', text: 'Only on secondary nodes' }
      ],
      correctAnswer: 'A',
      explanation: 'Hidden indexes continue to be maintained during all writes so that they can be unhidden and used immediately without rebuilding.'
    },
    mentalModel: 'Hiding an index is putting on an invisibility cloak: the planner cannot see it, but it is still physically there.',
    codeSnippet: `// Toggle index visibility:
db.collection.hideIndex("idx_name");
db.collection.unhideIndex("idx_name");`,
    takeaways: [
      'Always hide an index before dropping it in production.',
      'Hidden indexes still consume write I/O and disk space.',
      'Unhiding is instantaneous (O(1) catalog update).'
    ],
    commonPitfall: {
      mistake: 'Leaving 10 unused hidden indexes on a collection for months, wasting write IOPS.',
      fix: 'Drop the hidden indexes permanently after a 7-day observation period.'
    },
    prevTopicId: 'geospatial-2dsphere',
    nextTopicId: 'explain-execution-stats'
  },
  {
    id: 'explain-execution-stats',
    topicNumber: 30,
    title: 'Mastering explain("executionStats"): COLLSCAN vs IXSCAN',
    category: 'indexing',
    difficulty: 'Advanced',
    summary: 'Analyze MongoDB query execution plans: diagnose full collection scans (COLLSCAN), index seeks (IXSCAN), in-memory sorts (SORT), and selectivity ratios.',
    definition: 'The explain("executionStats") command reveals the internal physical plan chosen by the query optimizer and the actual runtime metrics: totalKeysExamined, totalDocsExamined, nReturned, executionTimeMillis, and the pipeline of execution stages (IXSCAN, FETCH, SORT, COLLSCAN).',
    eli5: 'explain() is the X-ray machine for your queries: it shows whether the database read 5 index entries to find 5 results, or whether it had to scan through 1,000,000 records because an index was missing.',
    realWorldExample: {
      description: 'Diagnosing a slow query searching for active accounts.',
      sampleDocuments: [
        {
          collection: 'explain_output',
          doc: {
            stage: 'COLLSCAN',
            nReturned: 4,
            totalDocsExamined: 1000000, // ⚠️ Catastrophe: scanned 1M docs to find 4!
            executionTimeMillis: 850
          }
        }
      ],
      explanation: 'Ratio of 1,000,000 docs examined to 4 returned proves an urgent missing index on the status field.'
    },
    syntaxSteps: [
      {
        step: 'Run explain with full execution statistics',
        code: `db.orders.find({ status: "pending", total: { $gt: 100 } })
  .sort({ created_at: -1 })
  .explain("executionStats");`,
        note: 'Inspect executionStats block for runtime metrics.'
      },
      {
        step: 'Extract key performance indicators',
        code: `const stats = db.orders.find({ user_id: "u1" }).explain("executionStats").executionStats;
print("Returned: " + stats.nReturned);
print("Keys Examined: " + stats.totalKeysExamined);
print("Docs Examined: " + stats.totalDocsExamined);`,
        note: 'Optimal queries maintain totalDocsExamined === nReturned.'
      }
    ],
    rulesTable: [
      {
        rule: 'COLLSCAN',
        explanation: 'Full Collection Scan: reads every physical document in the collection from disk/cache. Red flag in production.'
      },
      {
        rule: 'IXSCAN -> FETCH',
        explanation: 'Standard indexed query: searches B-Tree (IXSCAN) and fetches matching documents (FETCH).'
      },
      {
        rule: 'SORT stage',
        explanation: 'In-memory blocking sort: indicates missing index on the sort field.'
      }
    ],
    deepDive: {
      title: 'The Index Selectivity Efficiency Ratio',
      description: 'The golden metric of MongoDB query tuning is the Selectivity Ratio: totalKeysExamined / nReturned. An ideal ratio is 1.0 (every key examined matched a returned document). If the ratio is 50 or 100+, the index is poorly selective or missing trailing compound predicates, forcing the engine to scan extraneous keys.',
      codeSnippet: `// Key indicators in explain output:
// "totalKeysExamined": 10000,
// "totalDocsExamined": 10000,
// "nReturned": 5 -> Severe inefficiency! Ratio is 2000:1`,
      warning: 'A query with high totalDocsExamined causes buffer cache thrashing and ticket exhaustion.'
    },
    advantages: [
      'Uncovers exactly why queries are slow (missing index, in-memory sort, bad ESR order)',
      'Provides definitive proof of covered queries (totalDocsExamined: 0)',
      'Reveals candidate plans evaluated and rejected by the query optimizer'
    ],
    disadvantages: [
      'Running explain("executionStats") executes the query, consuming real server resources',
      'Output JSON is verbose and requires trained architectural interpretation'
    ],
    interviewQuestions: [
      {
        question: 'In explain("executionStats"), what does it signify when totalKeysExamined is 10,000 but nReturned is only 5?',
        answer: 'It indicates severe index inefficiency. The query planner is scanning 10,000 index keys to find only 5 matching documents. This occurs when the leading fields of a compound index have low selectivity, or when filter predicates are missing from the index, forcing the engine to traverse wide ranges of non-matching B-Tree keys.'
      }
    ],
    interviewReadyAnswer: 'explain("executionStats") exposes the query optimizer\'s physical execution plan. Key metrics include totalKeysExamined, totalDocsExamined, and nReturned. The primary goal of query optimization is eliminating COLLSCAN and in-memory SORT stages, driving the ratio of totalDocsExamined / nReturned as close to 1:1 as possible.',
    quickTest: {
      question: 'Which execution stage in an explain() winning plan indicates that MongoDB had to scan every document in the collection?',
      options: [
        { key: 'A', text: 'COLLSCAN' },
        { key: 'B', text: 'IXSCAN' },
        { key: 'C', text: 'PROJECTION_COVERED' },
        { key: 'D', text: 'FETCH' }
      ],
      correctAnswer: 'A',
      explanation: 'COLLSCAN signifies a full collection scan where every single document in the collection is read.'
    },
    mentalModel: 'explain() is the speedometer and telemetry: it measures the exact work the engine did to find your data.',
    codeSnippet: `// Benchmark query plan efficiency:
const e = db.orders.find({ category: "Audio" }).explain("executionStats");
console.log(e.executionStats.winningPlan.stage);`,
    takeaways: [
      'COLLSCAN is a full table scan; IXSCAN is an index seek.',
      'Aim for totalDocsExamined === nReturned.',
      'Eliminate SORT stages by aligning compound index fields with the ESR rule.'
    ],
    commonPitfall: {
      mistake: 'Assuming a query is optimized because it has an index, even though totalKeysExamined is 100,000 for 10 results.',
      fix: 'Refactor index fields to match the exact query predicates and eliminate key scanning.'
    },
    prevTopicId: 'hidden-indexes-testing',
    nextTopicId: 'agg-pipeline-architecture'
  }
];
