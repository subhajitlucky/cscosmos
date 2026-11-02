import { MongoTopic } from './types';

export const PART4_TOPICS: MongoTopic[] = [
  {
    id: 'agg-pipeline-architecture',
    topicNumber: 31,
    title: 'Aggregation Pipeline Architecture & Streaming vs Blocking Stages',
    category: 'aggregation',
    difficulty: 'Intermediate',
    summary: 'The MongoDB Aggregation Framework processes documents through an assembly-line sequence of stages, categorizing stages into non-blocking Streaming stages and memory-blocking Accumulator stages.',
    definition: 'The Aggregation Framework is MongoDB\'s data processing engine modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline where each stage transforms the stream. Stages are divided into Streaming (pipelined) stages ($match, $project, $unwind) that process documents row-by-row, and Blocking stages ($group, $sort) that must ingest the entire document stream before emitting output.',
    eli5: 'Think of an industrial conveyor belt. A streaming stage is a painter who sprays each toy as it passes by without stopping the belt. A blocking stage is a scale that must weigh ALL 1,000 toys together in a giant basket before letting any of them move forward.',
    realWorldExample: {
      description: 'Streaming documents through an audit filter and computing summary totals.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: { _id: 'o1', total: 100, status: 'completed' }
        }
      ],
      explanation: '$match streams matching documents immediately into $group, which blocks until all orders are summed.'
    },
    syntaxSteps: [
      {
        step: 'Basic multi-stage aggregation pipeline',
        code: `db.orders.aggregate([
  { $match: { status: "completed" } },       // Streaming stage
  { $group: { _id: "$category", totalRev: { $sum: "$total" } } }, // Blocking stage
  { $sort: { totalRev: -1 } }                 // Blocking stage
]);`,
        note: 'Streaming stages pass documents downstream; blocking stages buffer into memory.'
      }
    ],
    rulesTable: [
      {
        rule: 'Streaming Stages',
        explanation: '$match, $project, $unwind, $addFields, $limit. Low memory footprint; documents are processed in-flight.'
      },
      {
        rule: 'Blocking Stages',
        explanation: '$group, $sort (unindexed), $facet, $bucket. Must buffer all input documents into RAM before emitting.'
      }
    ],
    deepDive: {
      title: 'Pipeline Optimization & Stage Coalescing',
      description: 'The aggregation query planner automatically optimizes pipelines before execution. For example, if a $sort is immediately followed by a $limit, the engine coalesces them into a single Top-K streaming heap stage, tracking only the top N items in memory and avoiding a full sort of millions of records.',
      codeSnippet: `// Inspect optimizer stage rewriting:
db.orders.explain().aggregate([
  { $sort: { total: -1 } },
  { $limit: 5 }
]); // Winning plan shows: { "$sort": { "total": -1, "limit": 5 } }`,
      warning: 'Placing blocking stages too early in the pipeline causes excessive RAM consumption.'
    },
    advantages: [
      'Expressive functional transformation language executing directly inside the database kernel',
      'Streaming stages deliver low-latency first-byte responses to client applications',
      'Automated pipeline optimizer coalesces and re-orders stages for performance'
    ],
    disadvantages: [
      'Blocking stages are constrained by a strict 100MB RAM limit unless allowDiskUse is enabled',
      'Complex pipelines with dozens of stages can be difficult to debug and unit test'
    ],
    interviewQuestions: [
      {
        question: 'What is the architectural difference between a streaming stage and a blocking stage in the Aggregation Framework?',
        answer: 'A streaming stage (such as $match, $project, or $unwind) processes documents one by one as they arrive and immediately yields them to the next stage, consuming negligible RAM. A blocking stage (such as $group or unindexed $sort) must consume and process the entire incoming document set in an in-memory buffer before it can emit its first result row.'
      }
    ],
    interviewReadyAnswer: 'The Aggregation Framework executes an assembly line of stages. Streaming stages ($match, $project) transform documents row-by-row with minimal memory overhead, while blocking stages ($group, unindexed $sort) must ingest the entire dataset into memory before yielding output, subject to the 100MB RAM ceiling.',
    quickTest: {
      question: 'Which of the following aggregation pipeline stages is a Blocking stage that must ingest all documents before outputting?',
      options: [
        { key: 'A', text: '$group' },
        { key: 'B', text: '$match' },
        { key: 'C', text: '$project' },
        { key: 'D', text: '$unwind' }
      ],
      correctAnswer: 'A',
      explanation: '$group must ingest every single matching document in the collection to compute group accumulators (like $sum or $avg) before emitting output.'
    },
    mentalModel: 'Streaming stages are water flowing through pipes; blocking stages are retention dams.',
    codeSnippet: `// Execute aggregation with timing measurement:
const t0 = Date.now();
const res = db.orders.aggregate([{ $match: { total: { $gt: 500 } } }]).toArray();
console.log("Time: " + (Date.now() - t0) + "ms");`,
    takeaways: [
      'Aggregation pipelines consist of streaming and blocking stages.',
      '$match and $project stream; $group and $sort block.',
      'Filter early to reduce the volume entering blocking stages.'
    ],
    commonPitfall: {
      mistake: 'Placing $group or $sort before $match, forcing the engine to buffer the entire collection.',
      fix: 'Always place $match at the very beginning of the pipeline.'
    },
    prevTopicId: 'explain-execution-stats',
    nextTopicId: 'match-early-optimization'
  },
  {
    id: 'match-early-optimization',
    topicNumber: 32,
    title: '$match Stage Placement & Early Filter Pushdown',
    category: 'aggregation',
    difficulty: 'Intermediate',
    summary: 'Placing $match as the first stage in an aggregation pipeline enables index utilization (IXSCAN) and filters out non-matching documents before downstream processing.',
    definition: 'The $match stage filters documents according to specified criteria. When placed at the very start of a pipeline, $match takes advantage of collection indexes, using B-Trees to avoid full collection scans. Furthermore, filtering documents early minimizes memory consumption and CPU cycles for all subsequent stages.',
    eli5: 'If you want to bake a cake for 5 friends with chocolate lovers, you filter out the non-chocolate recipes FIRST before buying ingredients and spending 4 hours cooking.',
    realWorldExample: {
      description: 'Computing monthly revenue for completed European orders.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: { _id: 'o10', region: 'EU', status: 'completed', total: 450 }
        }
      ],
      explanation: 'Filtering { region: "EU", status: "completed" } in the first stage reduces 10,000,000 orders to 5,000 before grouping.'
    },
    syntaxSteps: [
      {
        step: 'Optimal pipeline with $match at stage 1',
        code: `db.orders.aggregate([
  { $match: { status: "completed", region: "EU" } }, // Stage 1: Uses compound index!
  { $group: { _id: "$product", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);`,
        note: 'Leverages index on { status: 1, region: 1 }.'
      }
    ],
    rulesTable: [
      {
        rule: 'Index Eligibility',
        explanation: 'Only $match stages at the very beginning of a pipeline (or following $sort on an index) can use indexes.'
      },
      {
        rule: 'Pushdown Optimization',
        explanation: 'MongoDB automatically pushes $match stages before $sort or $project when semantics permit.'
      }
    ],
    deepDive: {
      title: 'Why Post-$lookup or Post-$group $match Destroys Performance',
      description: 'If you execute a $lookup joining 1,000,000 orders with users, and then apply $match { "user.status": "active" }, the database must perform 1,000,000 join lookups before filtering! If you instead filter active users first or use a correlated $lookup pipeline, you perform only a fraction of the join operations.',
      codeSnippet: `// ❌ Flawed: joins 1M docs before filtering:
// [ { $lookup: ... }, { $match: { "order.date": { $gt: "2026-01-01" } } } ]
// ✅ Optimal: filters first, then joins:
// [ { $match: { "date": { $gt: "2026-01-01" } } }, { $lookup: ... } ]`,
      warning: 'Never place a $match after an expensive $unwind or $lookup if the filter could be evaluated earlier.'
    },
    advantages: [
      'Enables B-Tree index scans (IXSCAN) instead of reading every document from disk',
      'Drastically reduces the volume of data that subsequent blocking stages ($group, $sort) must buffer',
      'Protects against exceeding the 100MB aggregation memory ceiling'
    ],
    disadvantages: [
      'Cannot use an index if preceded by $project, $unwind, or $group stages'
    ],
    interviewQuestions: [
      {
        question: 'Can a $match stage use an index if it appears after a $project or $group stage in an aggregation pipeline?',
        answer: 'No. An index can only be used by a $match stage if it appears at the very beginning of the pipeline (or following a $sort that shares the index). Once documents pass through $project or $group, they become transformed ephemeral memory documents disconnected from physical B-Tree on-disk indexes.'
      }
    ],
    interviewReadyAnswer: 'Always place $match at the start of an aggregation pipeline to leverage B-Tree indexes and prune data volume early. Any $match placed after transformative stages like $group, $project, or $unwind operates entirely in memory on unindexed ephemeral documents.',
    quickTest: {
      question: 'Where must $match be placed in an aggregation pipeline to take advantage of an index scan (IXSCAN)?',
      options: [
        { key: 'A', text: 'At the very beginning of the pipeline (first stage)' },
        { key: 'B', text: 'Immediately after the $group stage' },
        { key: 'C', text: 'At the very end of the pipeline' },
        { key: 'D', text: 'Anywhere; MongoDB indexes work across all pipeline stages' }
      ],
      correctAnswer: 'A',
      explanation: 'Indexes can only be utilized by $match if it is positioned at the start of the pipeline before documents are reshaped in memory.'
    },
    mentalModel: 'Filter at the source: never carry water downstream if you intend to dump it out.',
    codeSnippet: `// Verify index scan on aggregation:
db.orders.explain("executionStats").aggregate([
  { $match: { status: "completed" } }
]);`,
    takeaways: [
      'Place $match first to enable index usage.',
      'Prune document volume early to speed up downstream stages.',
      'Post-transformation $match stages cannot use indexes.'
    ],
    commonPitfall: {
      mistake: 'Putting $lookup before $match, executing thousands of joins on documents that are immediately discarded.',
      fix: 'Apply $match before $lookup whenever possible.'
    },
    prevTopicId: 'agg-pipeline-architecture',
    nextTopicId: 'group-accumulators'
  },
  {
    id: 'group-accumulators',
    topicNumber: 33,
    title: '$group Mechanics, Hash Tables & Accumulator Operators',
    category: 'aggregation',
    difficulty: 'Intermediate',
    summary: 'The $group stage partitions documents into discrete buckets by an _id expression and computes aggregate metrics using mathematical and array accumulators.',
    definition: 'The $group stage separates documents into groups according to a specified group key (_id) and calculates metrics for each group using accumulator expressions ($sum, $avg, $min, $max, $push, $addToSet, $first, $last). The engine maintains an in-memory hash table where group keys point to accumulated state.',
    eli5: 'Think of sorting mail into pigeonholes by zip code. As letters arrive, you place them into the matching box and increment the counter written on the box.',
    realWorldExample: {
      description: 'Computing total spend, average order value, and product categories purchased per customer.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: { user_id: 'u1', total: 150, category: 'Hardware' }
        }
      ],
      explanation: '$group by user_id calculates total spend via $sum and unique categories via $addToSet.'
    },
    syntaxSteps: [
      {
        step: 'Aggregate financial summary by customer',
        code: `db.orders.aggregate([
  {
    $group: {
      _id: "$user_id",
      totalSpent: { $sum: "$total" },
      avgOrderValue: { $avg: "$total" },
      orderCount: { $sum: 1 },
      categoriesBought: { $addToSet: "$category" } // Deduplicated array!
    }
  }
]);`,
        note: '_id: null groups all documents in the collection into a single global total.'
      }
    ],
    rulesTable: [
      {
        rule: '$addToSet vs $push',
        explanation: '$addToSet deduplicates items into a unique array; $push appends every item preserving duplicates.'
      },
      {
        rule: '_id: null',
        explanation: 'Grouping by null aggregates the entire dataset into a single overall summary row.'
      }
    ],
    deepDive: {
      title: 'In-Memory Hash Table & Memory Spill Over',
      description: 'During $group execution, MongoDB creates a dynamic in-memory hash table. Each unique _id key occupies a hash bucket. If the group key has high cardinality (e.g. grouping by unique UUID or email across 50M records), the hash table can quickly exceed 100MB of RAM. If allowDiskUse is false, the query aborts with an error.',
      codeSnippet: `// Global collection-wide sum:
db.orders.aggregate([
  { $group: { _id: null, grandTotal: { $sum: "$total" } } }
]);`,
      warning: 'Using $push on high-volume groups can produce output documents exceeding the 16MB document limit.'
    },
    advantages: [
      'Calculates multi-metric summaries ($sum, $avg, $min, $max) in a single database pass',
      'Supports array accumulation ($push, $addToSet) to aggregate child entities into parents',
      'Can group by complex composite expressions: { $group: { _id: { yr: "$year", mo: "$month" } } }'
    ],
    disadvantages: [
      'High-cardinality group keys consume significant memory, risking 100MB RAM exceptions',
      '$addToSet incurs hash-lookup overhead to deduplicate incoming array elements'
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between $push and $addToSet accumulators in a $group stage?',
        answer: '$push appends every encountered value to an array in the output document, preserving duplicates and insertion order. $addToSet checks if the value already exists in the target array and only inserts it if it is unique, functioning as a mathematical set.'
      }
    ],
    interviewReadyAnswer: 'The $group stage separates documents into groups by an _id expression and calculates metrics using accumulator expressions. The engine maintains an in-memory hash table. $sum: 1 counts documents, $avg calculates arithmetic means, and $addToSet builds deduplicated arrays.',
    quickTest: {
      question: 'How do you configure a $group stage to calculate the total sum of all documents in a collection into a single output row?',
      options: [
        { key: 'A', text: 'Set _id: null' },
        { key: 'B', text: 'Set _id: "*"' },
        { key: 'C', text: 'Omit the _id field entirely' },
        { key: 'D', text: 'Set _id: "$all"' }
      ],
      correctAnswer: 'A',
      explanation: 'Setting _id: null tells the $group stage to ignore key partitioning and aggregate all documents into a single global group.'
    },
    mentalModel: 'The $group stage is a mailroom sorter: _id defines the pigeonhole, accumulators count what is inside.',
    codeSnippet: `// Group by department and find top earner:
db.employees.aggregate([
  { $group: { _id: "$dept", maxSalary: { $max: "$salary" } } }
]);`,
    takeaways: [
      '$group organizes documents by an _id key.',
      'Use $addToSet for unique sets, $push for lists.',
      'Group by null for collection-wide aggregate totals.'
    ],
    commonPitfall: {
      mistake: 'Using $push to aggregate millions of order IDs into a single user group, causing a 16MB BSONObj size error.',
      fix: 'Use $count or $sum instead of accumulating massive raw arrays.'
    },
    prevTopicId: 'match-early-optimization',
    nextTopicId: 'project-addfields-reshaping'
  },
  {
    id: 'project-addfields-reshaping',
    topicNumber: 34,
    title: 'Document Reshaping: $project vs $addFields vs $set',
    category: 'aggregation',
    difficulty: 'Beginner',
    summary: 'Compare document transformation stages: $project selects and renames explicit fields, while $addFields and $set append computed values while preserving all existing document attributes.',
    definition: 'Document reshaping stages transform document structure. $project specifies an explicit whitelist or blacklist of fields, discarding unmentioned fields. $addFields (and its alias $set) appends new computed fields or overwrites existing ones while automatically preserving all other document fields without verbose whitelisting.',
    eli5: '$project is like packing a suitcase where you must list every single shirt, sock, and shoe you want to bring. $addFields is like grabbing your existing packed suitcase and just slipping a book into the side pocket.',
    realWorldExample: {
      description: 'Calculating an order total with sales tax without losing the other 20 order fields.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: { _id: 'o1', subtotal: 100, taxRate: 0.08, customer: 'Alice', notes: 'Urgent' }
        }
      ],
      explanation: '$addFields appends totalAmount without requiring you to manually re-list customer, notes, etc.'
    },
    syntaxSteps: [
      {
        step: 'Append calculated field using $set or $addFields',
        code: `db.orders.aggregate([
  {
    $set: {
      totalAmount: { $multiply: ["$subtotal", { $add: [1, "$taxRate"] }] },
      processedDate: new Date()
    }
  }
]);`,
        note: '$set preserves all original fields automatically.'
      },
      {
        step: 'Strict projection using $project',
        code: `db.orders.aggregate([
  {
    $project: {
      _id: 0,
      orderNumber: "$_id",
      subtotal: 1
    }
  }
]);`,
        note: '$project discards all unmentioned fields.'
      }
    ],
    rulesTable: [
      {
        rule: '$project',
        explanation: 'Explicit whitelist or blacklist. Only specified fields survive into the next stage.'
      },
      {
        rule: '$addFields / $set',
        explanation: 'Non-destructive: keeps all existing document attributes and appends or overwrites target fields.'
      }
    ],
    deepDive: {
      title: 'Conditional Expressions with $cond and $switch',
      description: 'Both $project and $set support powerful inline ternary logic. The $cond operator evaluates boolean expressions: { $cond: [ { $gte: ["$score", 90] }, "A", "B" ] }. For multi-branch logic, $switch replaces deeply nested ternary clauses with clean case statements.',
      codeSnippet: `// Multi-case grading with $switch:
db.students.aggregate([
  {
    $set: {
      grade: {
        $switch: {
          branches: [
            { case: { $gte: ["$score", 90] }, then: "A" },
            { case: { $gte: ["$score", 80] }, then: "B" }
          ],
          default: "C"
        }
      }
    }
  }
]);`,
      warning: 'Do not use $project if you only want to add 1 field to a document with 50 fields.'
    },
    advantages: [
      '$set and $addFields eliminate massive boilerplate when appending computed attributes',
      '$project protects privacy by pruning sensitive fields (e.g. passwordHash, ssn) before client delivery',
      'Supports mathematical, string, array, and date transformation operators'
    ],
    disadvantages: [
      'Excessive field creation in long pipelines increases memory size per document',
      'Overwriting fields with different BSON types can break downstream stage assumptions'
    ],
    interviewQuestions: [
      {
        question: 'When should you choose $addFields (or $set) over $project in an aggregation pipeline?',
        answer: 'Use $addFields (or $set) when you want to append new computed fields or update existing values while preserving all other fields in the document. Use $project when you need to construct a strict whitelist of returned fields, rename fields, or explicitly suppress fields (like _id) to prune payload size.'
      }
    ],
    interviewReadyAnswer: '$project constructs an explicit whitelist/blacklist of fields, dropping unmentioned fields. $addFields (aliased as $set in MongoDB 4.2+) non-destructively adds or updates specific fields while keeping all other existing attributes intact.',
    quickTest: {
      question: 'Which aggregation stage allows you to append a new computed field to a document without discarding its other existing fields?',
      options: [
        { key: 'A', text: '$addFields (or $set)' },
        { key: 'B', text: '$project' },
        { key: 'C', text: '$group' },
        { key: 'D', text: '$unwind' }
      ],
      correctAnswer: 'A',
      explanation: '$addFields and $set append new fields while automatically preserving all other existing fields in the document stream.'
    },
    mentalModel: '$project is a sieve: only selected items pass through. $set is a stamp: it adds a mark without altering the contents.',
    codeSnippet: `// Prune fields for client response:
db.users.aggregate([
  { $project: { passwordHash: 0, internalNotes: 0 } }
]);`,
    takeaways: [
      'Use $set to append computed fields without listing all existing fields.',
      'Use $project to create strict whitelists and suppress _id.',
      'Use $cond or $switch for inline conditional logic.'
    ],
    commonPitfall: {
      mistake: 'Using $project to add 1 field, accidentally deleting 30 other document fields that were not re-listed.',
      fix: 'Use $set / $addFields to add fields non-destructively.'
    },
    prevTopicId: 'group-accumulators',
    nextTopicId: 'unwind-array-deconstruction'
  },
  {
    id: 'unwind-array-deconstruction',
    topicNumber: 35,
    title: '$unwind Array Flattening & Memory Multiplication',
    category: 'aggregation',
    difficulty: 'Intermediate',
    summary: 'The $unwind stage deconstructs an array field from input documents, outputting one document for every element in the array.',
    definition: 'The $unwind stage flattens array fields. For every element in an array, $unwind emits an independent copy of the parent document where the array field is replaced by that single element. It enables granular grouping, filtering, and aggregation on individual array items.',
    eli5: 'If you have a shopping cart with 3 items (apple, banana, milk), $unwind splits your one shopping cart into 3 separate shopping carts, each holding just one item.',
    realWorldExample: {
      description: 'Analyzing individual item sales from multi-item order receipts.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: {
            _id: 'o1',
            customer: 'Alice',
            items: [
              { name: 'Keyboard', price: 100 },
              { name: 'Mouse', price: 50 }
            ]
          }
        }
      ],
      explanation: '$unwind: "$items" emits two documents: { _id: "o1", customer: "Alice", items: { name: "Keyboard", price: 100 } } and { _id: "o1", customer: "Alice", items: { name: "Mouse", price: 50 } }.'
    },
    syntaxSteps: [
      {
        step: 'Basic array deconstruction',
        code: `db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.name", totalSold: { $sum: 1 } } }
]);`,
        note: 'Emits one document per array item.'
      },
      {
        step: 'Preserve null and empty arrays with array index tracking',
        code: `db.orders.aggregate([
  {
    $unwind: {
      path: "$items",
      includeArrayIndex: "itemIndex",
      preserveNullAndEmptyArrays: true // Prevents discarding empty orders!
    }
  }
]);`,
        note: 'preserveNullAndEmptyArrays retains parent documents that lack items.'
      }
    ],
    rulesTable: [
      {
        rule: 'Empty Array Elimination',
        explanation: 'By default, documents where the array is empty ([]), null, or missing are completely discarded.'
      },
      {
        rule: 'Memory Multiplication',
        explanation: 'Unwinding an array with 1,000 items creates 1,000 documents in memory, multiplying document volume by 1,000x.'
      }
    ],
    deepDive: {
      title: 'The Memory Multiplication Hazard of Early $unwind',
      description: 'If you have 100,000 documents and each has an array of 50 items, executing $unwind early expands your pipeline from 100,000 documents to 5,000,000 documents in RAM! Always apply $match filters BEFORE $unwind to prevent ballooning intermediate memory buffers.',
      codeSnippet: `// Filter before unwinding to minimize memory explosion:
db.orders.aggregate([
  { $match: { year: 2026 } }, // Filters down first
  { $unwind: "$items" },       // Only unwinds filtered subset
  { $match: { "items.price": { $gt: 50 } } }
]);`,
      warning: 'Never unwind large arrays without filtering first.'
    },
    advantages: [
      'Enables granular aggregation and filtering on individual array elements',
      'includeArrayIndex tracks original positioning for ordered sequence algorithms',
      'Essential for relational-style joins and grouping on embedded items'
    ],
    disadvantages: [
      'Drastically increases document count in the pipeline, multiplying RAM and CPU consumption',
      'Silently drops documents with empty or missing arrays unless preserveNullAndEmptyArrays is true'
    ],
    interviewQuestions: [
      {
        question: 'What happens to a document in an aggregation pipeline when $unwind is applied to an array field that is empty ([])?',
        answer: 'By default, the document is completely dropped from the pipeline. To keep documents with empty, null, or missing arrays, you must use the expanded syntax with preserveNullAndEmptyArrays: true.'
      }
    ],
    interviewReadyAnswer: '$unwind deconstructs an array field, emitting a separate copy of the parent document for each array element. By default, empty or null arrays are discarded unless preserveNullAndEmptyArrays: true is configured. Because $unwind multiplies document counts, always place $match filters before $unwind to avoid memory explosion.',
    quickTest: {
      question: 'Which option in the expanded $unwind syntax prevents documents with empty arrays from being deleted from the pipeline?',
      options: [
        { key: 'A', text: 'preserveNullAndEmptyArrays: true' },
        { key: 'B', text: 'keepEmpty: true' },
        { key: 'C', text: 'allowNull: true' },
        { key: 'D', text: 'ignoreEmpty: false' }
      ],
      correctAnswer: 'A',
      explanation: 'Setting preserveNullAndEmptyArrays: true ensures documents with empty arrays, null, or missing fields are preserved.'
    },
    mentalModel: '$unwind is an accordion expanding: 1 document with 5 items becomes 5 distinct documents.',
    codeSnippet: `// Track array indices:
db.surveys.aggregate([
  { $unwind: { path: "$answers", includeArrayIndex: "questionNumber" } }
]);`,
    takeaways: [
      '$unwind outputs one document per array item.',
      'Use preserveNullAndEmptyArrays: true to prevent dropping empty lists.',
      'Filter before unwinding to prevent memory multiplication.'
    ],
    commonPitfall: {
      mistake: 'Wondering why 30% of documents disappeared after $unwind.',
      fix: 'Set preserveNullAndEmptyArrays: true to retain documents with empty arrays.'
    },
    prevTopicId: 'project-addfields-reshaping',
    nextTopicId: 'lookup-left-outer-joins'
  },
  {
    id: 'lookup-left-outer-joins',
    topicNumber: 36,
    title: '$lookup Joins: Equi-Join vs Correlated Pipeline Joins',
    category: 'aggregation',
    difficulty: 'Advanced',
    summary: 'Perform relational Left Outer Joins in MongoDB using $lookup: from standard equi-joins to complex correlated subquery pipelines with nested filtering.',
    definition: 'The $lookup stage performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing. MongoDB supports two forms: Equality Matches (localField/foreignField) and Correlated Subquery Pipelines (let and pipeline).',
    eli5: 'Imagine holding a list of student names. For every student, you look at the master library checkout catalog, find all books checked out by that student ID, and attach that list of books as an array inside the student\'s folder.',
    realWorldExample: {
      description: 'Joining customers with their recent high-value orders.',
      sampleDocuments: [
        {
          collection: 'customers',
          doc: { _id: 'c1', name: 'Acme Corp' }
        },
        {
          collection: 'orders',
          doc: { _id: 'o99', customer_id: 'c1', total: 4500 }
        }
      ],
      explanation: '$lookup attaches orders matching customer_id as an embedded array customerOrders.'
    },
    syntaxSteps: [
      {
        step: 'Standard equality left outer join',
        code: `db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customer_id",
      as: "orders"
    }
  }
]);`,
        note: 'Attaches matching orders as an array in each customer document.'
      },
      {
        step: 'Advanced correlated subquery pipeline join with filtering',
        code: `db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      let: { custId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$customer_id", "$$custId"] },
                { $gt: ["$total", 1000] }
              ]
            }
          }
        },
        { $sort: { created_at: -1 } },
        { $limit: 3 }
      ],
      as: "topHighValueOrders"
    }
  }
]);`,
        note: 'Executes filtering and sorting on the joined collection before assembling the array!'
      }
    ],
    rulesTable: [
      {
        rule: 'Foreign Field Index Mandatory',
        explanation: 'Always ensure an index exists on foreignField in the joined collection to avoid full collection scans per document.'
      },
      {
        rule: 'Left Outer Join Semantics',
        explanation: 'If no matching documents are found, the target array field is returned as empty ([]).'
      }
    ],
    deepDive: {
      title: 'The Missing Foreign Key Index Disaster',
      description: 'If you join 10,000 customers to an unindexed orders collection with 1,000,000 rows, MongoDB must perform 10,000 full collection scans (COLLSCAN) across the orders table—scanning 10 billion documents in total! Creating an index on orders(customer_id) transforms each probe into an instant B-Tree index seek.',
      codeSnippet: `// ⚠️ Crucial prerequisite before running $lookup:
db.orders.createIndex({ customer_id: 1 });`,
      warning: '$lookup cannot join into a sharded collection.'
    },
    advantages: [
      'Enables relational joins and normalized document modeling when data must stay separate',
      'Correlated pipelines allow filtering, sorting, and projecting joined data before memory allocation',
      'Resulting joined data is embedded directly as a native BSON array'
    ],
    disadvantages: [
      'Significantly slower than querying pre-embedded documents',
      'Massive joins consume substantial RAM working set and CPU cycles'
    ],
    interviewQuestions: [
      {
        question: 'What index must always exist on the target collection when using $lookup to prevent severe query degradation?',
        answer: 'An index must always exist on the foreignField attribute of the target ("from") collection. Without this index, MongoDB executes a full collection scan (COLLSCAN) on the joined collection for every single document in the outer pipeline, causing catastrophic O(N x M) execution times.'
      }
    ],
    interviewReadyAnswer: 'The $lookup stage performs a left outer join to an unsharded collection. It supports basic field equality and correlated subquery pipelines (using let and $expr). To prevent catastrophic performance degradation, an index must always exist on the foreignField of the joined collection.',
    quickTest: {
      question: 'What type of relational join does MongoDB $lookup perform by default?',
      options: [
        { key: 'A', text: 'Left Outer Join' },
        { key: 'B', text: 'Inner Join' },
        { key: 'C', text: 'Full Outer Join' },
        { key: 'D', text: 'Cross Product Join' }
      ],
      correctAnswer: 'A',
      explanation: '$lookup performs a left outer join: if no matching records exist in the foreign collection, the output array is simply empty ([]).'
    },
    mentalModel: '$lookup reaches into another collection: with an index, it grabs books by barcode; without an index, it searches every room.',
    codeSnippet: `// Convert 1:N join into 1:1 object using $unwind:
db.orders.aggregate([
  { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
  { $unwind: "$user" } // Converts [{...}] to {...}
]);`,
    takeaways: [
      '$lookup performs left outer joins.',
      'Always index the foreignField.',
      'Use correlated subquery pipelines to filter joined data before assembly.'
    ],
    commonPitfall: {
      mistake: 'Joining an unindexed collection, causing query execution times to jump from 5ms to 120 seconds.',
      fix: 'Create an index on the foreignField attribute in the target collection.'
    },
    prevTopicId: 'unwind-array-deconstruction',
    nextTopicId: 'facet-multi-analytics'
  },
  {
    id: 'facet-multi-analytics',
    topicNumber: 37,
    title: '$facet Multi-Faceted Aggregation & Parallel Analytics',
    category: 'aggregation',
    difficulty: 'Advanced',
    summary: 'The $facet stage executes multiple independent aggregation sub-pipelines in parallel over the same input document stream in a single database query.',
    definition: 'The $facet stage processes multiple aggregation pipelines within a single stage on the same set of input documents. Each sub-pipeline outputs its own array of results, enabling search engines and dashboards to calculate faceted navigation menus, price histograms, and top categories in one round-trip.',
    eli5: 'Imagine handing a stack of student test papers to 3 teachers at the same time: Teacher A counts how many students passed, Teacher B finds the top 5 highest scores, and Teacher C calculates the average grade. All 3 report back together in one envelope.',
    realWorldExample: {
      description: 'E-commerce search page displaying paginated products along with facet filters (category counts, price ranges, brand counts).',
      sampleDocuments: [
        {
          collection: 'products',
          doc: { _id: 'p1', category: 'Hardware', brand: 'Apple', price: 1999 }
        }
      ],
      explanation: '$facet computes the paginated product results and category filter counts in a single query pass.'
    },
    syntaxSteps: [
      {
        step: 'Run multi-faceted search query',
        code: `db.products.aggregate([
  { $match: { inStock: true } },
  {
    $facet: {
      "categorized": [
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ],
      "priceRanges": [
        { $bucket: { groupBy: "$price", boundaries: [0, 100, 500, 2000], default: "Other" } }
      ],
      "paginatedResults": [
        { $sort: { price: -1 } },
        { $skip: 0 },
        { $limit: 10 }
      ]
    }
  }
]);`,
        note: 'Outputs a single document containing three arrays: categorized, priceRanges, and paginatedResults.'
      }
    ],
    rulesTable: [
      {
        rule: 'Output Boundary (16MB)',
        explanation: 'Because all sub-pipeline results are returned in a single document, the final combined facet document must not exceed 16MB.'
      },
      {
        rule: 'Memory Ceiling',
        explanation: '$facet is a blocking stage; total memory across sub-pipelines is bounded by the 100MB limit.'
      }
    ],
    deepDive: {
      title: 'Eliminating Multiple Client Query Round-Trips',
      description: 'Before $facet, an e-commerce page had to issue 3 or 4 separate aggregate() queries: one for products, one for brands, one for category counts. This tripled network latency and database connection overhead. $facet passes the filtered document stream directly to internal sub-pipelines in memory with zero network overhead.',
      codeSnippet: `// Structure of $facet output:
// {
//   "categorized": [ { "_id": "Hardware", "count": 12 } ],
//   "priceRanges": [ { "_id": 100, "count": 4 } ],
//   "paginatedResults": [ { "_id": "p1", "price": 1999 } ]
// }`,
      warning: 'Do not use $facet if one sub-pipeline produces millions of documents.'
    },
    advantages: [
      'Computes complex dashboards and faceted navigation in a single network round-trip',
      'Operates on a pre-filtered document stream without re-reading collections',
      'Provides clean structured output ready for frontend UI state consumption'
    ],
    disadvantages: [
      'The entire composite result must fit within the 16MB BSON document limit',
      'Sub-pipelines cannot reference results from sibling facets'
    ],
    interviewQuestions: [
      {
        question: 'What is the primary architectural limitation of the $facet aggregation stage?',
        answer: 'The primary limitation is that $facet outputs all its sub-pipeline results inside a single BSON document. Therefore, the combined output across all facets must strictly fit within MongoDB\'s 16MB document size limit. Additionally, $facet is a blocking stage subject to the 100MB RAM limit.'
      }
    ],
    interviewReadyAnswer: 'The $facet stage runs multiple aggregation sub-pipelines in parallel over the same input stream in a single query. It is the industry standard for e-commerce faceted search and analytics dashboards, though the combined output must strictly remain under the 16MB BSON document limit.',
    quickTest: {
      question: 'Why is $facet commonly used in e-commerce product search pages?',
      options: [
        { key: 'A', text: 'To return paginated products and category/price facet counts in a single query' },
        { key: 'B', text: 'To create unique indexes dynamically' },
        { key: 'C', text: 'To bypass the 16MB document limit' },
        { key: 'D', text: 'To shard a collection automatically' }
      ],
      correctAnswer: 'A',
      explanation: '$facet computes multiple analytical dimensions (e.g. price buckets, category counts, paginated records) in a single database round-trip.'
    },
    mentalModel: '$facet is a prism: one beam of filtered documents splits into multiple colored spectrums.',
    codeSnippet: `// Compute total count and paginated items together:
db.orders.aggregate([
  { $facet: {
      "metadata": [{ $count: "total" }],
      "data": [{ $skip: 10 }, { $limit: 10 }]
    }
  }
]);`,
    takeaways: [
      '$facet runs multiple sub-pipelines on the same document stream.',
      'Perfect for search facets and paginated dashboards.',
      'Combined output must fit within the 16MB limit.'
    ],
    commonPitfall: {
      mistake: 'Accumulating unbounded raw document lists inside a facet, breaching the 16MB document limit.',
      fix: 'Use $limit, $project, or $group within each facet sub-pipeline.'
    },
    prevTopicId: 'lookup-left-outer-joins',
    nextTopicId: 'bucket-histograms'
  },
  {
    id: 'bucket-histograms',
    topicNumber: 38,
    title: '$bucket and $bucketAuto: Histogram Categorization',
    category: 'aggregation',
    difficulty: 'Intermediate',
    summary: 'Categorize numeric and temporal data into discrete histogram buckets using manual boundary ranges ($bucket) or automated equal-frequency percentiles ($bucketAuto).',
    definition: 'The $bucket stage categorizes incoming documents into groups (buckets) based on a specified expression and boundary values. The $bucketAuto stage automatically calculates boundary intervals to distribute documents evenly across a specified number of buckets (quantile/percentile bucketing).',
    eli5: '$bucket is like sorting coins into pre-labeled jars: 0-10 cents, 10-25 cents, 25-100 cents. $bucketAuto is asking a computer: "Here are 100 coins, sort them into 4 jars so each jar has exactly 25 coins."',
    realWorldExample: {
      description: 'Analyzing user purchase price distribution into budget, mid-range, and premium brackets.',
      sampleDocuments: [
        {
          collection: 'orders',
          doc: { _id: 'o1', total: 75 }
        },
        {
          collection: 'orders',
          doc: { _id: 'o2', total: 320 }
        }
      ],
      explanation: '$bucket groups orders into [0, 100), [100, 500), and [500, +inf).'
    },
    syntaxSteps: [
      {
        step: 'Manual boundary bucketing',
        code: `db.orders.aggregate([
  {
    $bucket: {
      groupBy: "$total",
      boundaries: [0, 100, 500, 1000],
      default: "Above 1000",
      output: {
        count: { $sum: 1 },
        avgSpend: { $avg: "$total" }
      }
    }
  }
]);`,
        note: 'Boundaries must be sorted in ascending order.'
      },
      {
        step: 'Automated quantile bucketing (4 equal quartiles)',
        code: `db.orders.aggregate([
  {
    $bucketAuto: {
      groupBy: "$total",
      buckets: 4,
      output: { count: { $sum: 1 } }
    }
  }
]);`,
        note: 'Calculates dynamic range boundaries automatically.'
      }
    ],
    rulesTable: [
      {
        rule: '$bucket Boundaries',
        explanation: 'Requires at least 2 boundaries; each boundary must be strictly ascending (e.g. [0, 50, 100]).'
      },
      {
        rule: 'Lower Bound Inclusive',
        explanation: 'Each bucket includes the lower boundary and excludes the upper boundary: [lower, upper).'
      }
    ],
    deepDive: {
      title: 'Powering Analytical Histograms in Microseconds',
      description: 'Generating statistical histograms in relational databases requires complex CASE statements and repetitive range checks. $bucket executes this in a single indexed pass. If the groupBy field is indexed, WiredTiger reads the boundaries directly from the B-Tree, achieving sub-millisecond execution over millions of records.',
      codeSnippet: `// Output of $bucketAuto:
// { "_id": { "min": 10, "max": 45 }, "count": 250 },
// { "_id": { "min": 45, "max": 120 }, "count": 250 }`,
      warning: 'Ensure the groupBy field contains comparable data types.'
    },
    advantages: [
      'Generates statistical distributions and histograms natively inside the database',
      '$bucketAuto eliminates manual statistical range calculations for quantiles',
      'Integrates seamlessly inside $facet for search filtering'
    ],
    disadvantages: [
      '$bucket requires hardcoded domain knowledge to define sensible boundary numbers',
      '$bucketAuto can produce non-intuitive decimal boundaries on skewed data'
    ],
    interviewQuestions: [
      {
        question: 'What is the key difference between $bucket and $bucketAuto in MongoDB?',
        answer: '$bucket requires the developer to explicitly specify the boundary intervals (e.g. [0, 100, 500]) and a default bucket. $bucketAuto only takes the desired number of buckets (e.g. 5) and automatically calculates the boundary ranges so that documents are distributed as evenly as possible across the buckets.'
      }
    ],
    interviewReadyAnswer: '$bucket partitions documents into custom user-defined range buckets ([lower, upper)). $bucketAuto automatically computes boundaries to partition data into N equal-frequency quantiles. Both optimize analytical histogram and price-filter generation.',
    quickTest: {
      question: 'How does the $bucket stage treat boundary values for each range bucket?',
      options: [
        { key: 'A', text: 'Lower boundary is inclusive; upper boundary is exclusive [lower, upper)' },
        { key: 'B', text: 'Both boundaries are inclusive [lower, upper]' },
        { key: 'C', text: 'Both boundaries are exclusive (lower, upper)' },
        { key: 'D', text: 'Lower boundary is exclusive; upper boundary is inclusive' }
      ],
      correctAnswer: 'A',
      explanation: 'In MongoDB $bucket, bucket intervals are half-open: inclusive of the lower bound and exclusive of the upper bound.'
    },
    mentalModel: '$bucket is sorting into labeled bins; $bucketAuto is letting the machine divide the pile evenly.',
    codeSnippet: `// Distribution of user ages into decade buckets:
db.users.aggregate([
  { $bucket: { groupBy: "$age", boundaries: [18, 30, 45, 65], default: "Senior" } }
]);`,
    takeaways: [
      '$bucket uses explicit boundaries; $bucketAuto uses automated quantiles.',
      'Intervals are [inclusive, exclusive).',
      'Ideal for histograms and search filter price sliders.'
    ],
    commonPitfall: {
      mistake: 'Specifying boundaries in non-ascending order (e.g. [100, 50, 0]), causing immediate syntax errors.',
      fix: 'Always sort boundaries in ascending order: [0, 50, 100].'
    },
    prevTopicId: 'facet-multi-analytics',
    nextTopicId: 'merge-and-out-materialization'
  },
  {
    id: 'merge-and-out-materialization',
    topicNumber: 39,
    title: 'Materialized Views via $merge and $out',
    category: 'aggregation',
    difficulty: 'Advanced',
    summary: 'Persist complex aggregation transformations into concrete physical collections using $out (destructive overwrite) or $merge (incremental upsert updates).',
    definition: 'The $out and $merge stages write the output documents of an aggregation pipeline directly into a physical collection. While $out completely overwrites the target collection, $merge (introduced in MongoDB 4.2) enables incremental Materialized Views by matching on an on-disk index key and performing upserts, updates, or custom merging.',
    eli5: '$out is like throwing away an old spreadsheet and saving a brand new file over it. $merge is like updating existing rows in the spreadsheet, adding new rows, and leaving unchanged rows untouched.',
    realWorldExample: {
      description: 'Updating a daily materialized view of customer lifetime value (LTV).',
      sampleDocuments: [
        {
          collection: 'customer_ltv_view',
          doc: { _id: 'c1', totalLtv: 12500, lastUpdated: '2026-03-01' }
        }
      ],
      explanation: '$merge updates customer c1\'s balance incrementally without wiping out unchanged customers.'
    },
    syntaxSteps: [
      {
        step: 'Incremental Materialized View using $merge',
        code: `db.orders.aggregate([
  { $match: { updated_at: { $gt: new Date(Date.now() - 86400000) } } },
  { $group: { _id: "$user_id", newSpend: { $sum: "$total" } } },
  {
    $merge: {
      into: "user_ltv",
      on: "_id", // Match key on target collection
      whenMatched: [
        { $set: { totalLtv: { $add: ["$totalLtv", "$$new.newSpend"] }, lastSync: new Date() } }
      ],
      whenNotMatched: "insert"
    }
  }
]);`,
        note: '$merge updates existing documents in-place using an aggregation pipeline!'
      }
    ],
    rulesTable: [
      {
        rule: '$out (Destructive)',
        explanation: 'Replaces the entire target collection atomically upon completion. Drops existing indexes not recreated.'
      },
      {
        rule: '$merge (Incremental)',
        explanation: 'Matches documents on unique identifier (on), updating existing records and inserting new ones.'
      }
    ],
    deepDive: {
      title: 'Real-Time Materialized Views vs Relational Snapshots',
      description: '$merge enables true on-demand and scheduled Materialized Views in MongoDB. Unlike traditional SQL materialized views that require REFRESH MATERIALIZED VIEW (which often locks or re-scans the entire underlying relation), $merge can process an incremental delta stream (e.g. orders from the last hour) and update target aggregates in milliseconds.',
      codeSnippet: `// Simple upsert merge:
{ $merge: { into: "monthly_metrics", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }`,
      warning: 'The target collection in $merge must have a unique index matching the fields in the "on" clause.'
    },
    advantages: [
      'Eliminates repetitive analytical aggregation queries by caching pre-computed results',
      '$merge supports incremental delta updates without full-table recomputations',
      'Materialized collections can have their own dedicated secondary indexes'
    ],
    disadvantages: [
      '$out drops target collection indexes; $merge requires pre-existing unique indexes',
      'Materialized views are eventually consistent unless updated on every write'
    ],
    interviewQuestions: [
      {
        question: 'Why is $merge significantly superior to $out for maintaining materialized views in production?',
        answer: '$out completely replaces the target collection, dropping existing indexes and requiring full-dataset recomputations. $merge operates incrementally: it can process a small delta (e.g. writes from the last 10 minutes) and update or insert records in the target collection in-place using an on identifier, preserving target indexes and cluster availability.'
      }
    ],
    interviewReadyAnswer: '$out atomically replaces a target collection, while $merge provides incremental materialized view updates. $merge matches documents on unique keys (on), supporting in-place updates, pipeline transformations (whenMatched), and inserts (whenNotMatched) without rewriting the entire collection.',
    quickTest: {
      question: 'Which aggregation stage allows incremental updates to an existing collection matching on a unique identifier?',
      options: [
        { key: 'A', text: '$merge' },
        { key: 'B', text: '$out' },
        { key: 'C', text: '$group' },
        { key: 'D', text: '$lookup' }
      ],
      correctAnswer: 'A',
      explanation: '$merge allows incremental upserts and updates into target collections based on a unique on identifier.'
    },
    mentalModel: '$out replaces the book; $merge edits the existing pages.',
    codeSnippet: `// Run scheduled incremental update:
db.daily_orders.aggregate([
  { $merge: { into: "summary", on: "_id", whenMatched: "merge", whenNotMatched: "insert" } }
]);`,
    takeaways: [
      '$merge creates incremental materialized views.',
      '$out overwrites the entire target collection.',
      'Target collection in $merge requires a unique index on the "on" field.'
    ],
    commonPitfall: {
      mistake: 'Using $out on a collection with custom indexes, accidentally deleting all secondary indexes.',
      fix: 'Use $merge to preserve existing collection indexes.'
    },
    prevTopicId: 'bucket-histograms',
    nextTopicId: 'agg-100mb-memory-limit'
  },
  {
    id: 'agg-100mb-memory-limit',
    topicNumber: 40,
    title: 'The 100MB RAM Stage Limit & allowDiskUse: true',
    category: 'aggregation',
    difficulty: 'Advanced',
    summary: 'Aggregation pipeline stages are constrained by a strict 100MB in-memory RAM limit; learn how to diagnose memory spillover and utilize allowDiskUse: true safely.',
    definition: 'MongoDB enforces a 100MB RAM ceiling per stage in an aggregation pipeline to prevent memory starvation and OOM crashes. If a blocking stage (such as $group, unindexed $sort, or $bucket) accumulates more than 100MB of data in RAM, MongoDB aborts the query with an error unless { allowDiskUse: true } is explicitly enabled.',
    eli5: 'Each station on the assembly line is only given a 100MB workbench. If parts pile up past 100MB, the worker throws their hands up and stops the factory. Setting allowDiskUse gives the worker permission to stack overflow parts into temporary storage boxes on the warehouse floor.',
    realWorldExample: {
      description: 'Sorting 5,000,000 unindexed audit log records in an aggregation pipeline.',
      sampleDocuments: [
        {
          collection: 'query_error',
          doc: {
            code: 16819,
            errmsg: 'Sort exceeded memory limit of 104857600 bytes, but did not opt in to external sorting.'
          }
        }
      ],
      explanation: 'Unindexed sort breached 100MB (104,857,600 bytes), crashing the query.'
    },
    syntaxSteps: [
      {
        step: 'Enable disk spillover in aggregation',
        code: `db.audit_logs.aggregate(
  [
    { $match: { severity: "CRITICAL" } },
    { $sort: { timestamp: -1 } } // Unindexed sort
  ],
  { allowDiskUse: true } // Permits writing temp files to disk!
);`,
        note: 'Allows stages to write temporary spill files in the _tmp directory.'
      }
    ],
    rulesTable: [
      {
        rule: 'Exact Limit',
        explanation: '104,857,600 bytes (100MB) per pipeline stage.'
      },
      {
        rule: 'Performance Trade-off',
        explanation: 'Spilling to disk avoids query abortion, but disk I/O degrades execution speed by 10x-50x.'
      }
    ],
    deepDive: {
      title: 'MongoDB 6.0+ Pipeline Spill Changes',
      description: 'In MongoDB 6.0+, pipeline stages that spill to disk write temporary files to the storageEngine directory. However, relying on allowDiskUse in user-facing online web applications is an architectural anti-pattern. If an API query hits disk spillover, customer response times jump from 50ms to 4,000ms. Disk use should be reserved for offline nightly ETL jobs.',
      codeSnippet: `// Check if query spilled to disk in explain():
const exp = db.orders.explain("executionStats").aggregate([...], { allowDiskUse: true });
// Look for "usedDisk": true in stage stats`,
      warning: 'Never use allowDiskUse: true as a substitute for creating a proper index on the sort field.'
    },
    advantages: [
      'Protects the mongod server from running out of memory (OOM) due to runaway analytical queries',
      'Enables massive multi-gigabyte analytical reporting jobs to complete without failure',
      'Spill files are cleaned up automatically upon pipeline termination'
    ],
    disadvantages: [
      'Writing and reading temporary files to disk severely degrades query execution speed',
      'Increases storage IOPS contention on active production primary nodes'
    ],
    interviewQuestions: [
      {
        question: 'What is the default RAM limit for an individual aggregation stage in MongoDB, and what happens when it is exceeded?',
        answer: 'The default memory limit is 100MB (104,857,600 bytes) per stage. If a blocking stage (like $sort or $group) exceeds this limit, the query terminates with an error (code 16819: Sort exceeded memory limit). To allow the query to complete by writing temporary spillover files to disk, the client must pass { allowDiskUse: true }.'
      }
    ],
    interviewReadyAnswer: 'MongoDB limits each aggregation stage to 100MB of RAM to prevent OOM server failure. Blocking stages exceeding this threshold fail with error 16819 unless { allowDiskUse: true } is supplied, which writes temporary files to disk. In production, index the sort/match fields rather than relying on disk spill in user-facing APIs.',
    quickTest: {
      question: 'What is the exact memory limit for a single aggregation pipeline stage in MongoDB before allowDiskUse is required?',
      options: [
        { key: 'A', text: '100 MB' },
        { key: 'B', text: '16 MB' },
        { key: 'C', text: '1 GB' },
        { key: 'D', text: '256 KB' }
      ],
      correctAnswer: 'A',
      explanation: 'MongoDB restricts aggregation pipeline stages to 100 MB of RAM by default.'
    },
    mentalModel: '100MB is the workbench size: exceed it, and you must stack boxes on the warehouse floor (disk).',
    codeSnippet: `// Safe large-scale ETL aggregation:
db.big_data.aggregate(pipeline, { allowDiskUse: true });`,
    takeaways: [
      'Stages are limited to 100MB of RAM.',
      'allowDiskUse: true permits temporary disk spillover.',
      'Always index sort fields to avoid disk spill in production web APIs.'
    ],
    commonPitfall: {
      mistake: 'Adding allowDiskUse: true to an unindexed web API query instead of creating the missing index.',
      fix: 'Create an index on the sort/filter field so the sort is handled in O(log N) by the B-Tree.'
    },
    prevTopicId: 'merge-and-out-materialization',
    nextTopicId: 'replica-set-topology'
  }
];
