import type { DBMSLesson } from './types';

export const distributedLessons: DBMSLesson[] = [
  {
    chapterId: 'distributed-databases',
    plainEnglish: 'Many libraries, one catalog. You do not care which building holds the book.',
    hook:
      'A distributed database looks like one system but stores data across many sites. Transparency hides the network; CAP theory explains why it cannot hide everything.',
    objectives: [
      'Define a distributed database.',
      'Explain location, fragmentation, and replication transparency.',
      'State the CAP trade-off.',
      'Know the challenges of distributed transactions.',
    ],
    sections: [
      {
        title: 'Transparency',
        body:
          'Location transparency means users do not need to know which site stores a row. Fragmentation transparency means they do not need to know how a table is split. Replication transparency means they do not need to know how many copies exist. The DBMS rewrites queries and coordinates updates across sites.',
      },
      {
        title: 'CAP theorem',
        body:
          'A distributed system cannot guarantee consistency, availability, and partition tolerance all at once. When the network partitions, a system must choose between rejecting requests to stay consistent or serving stale data to stay available. Real systems choose different points on that spectrum.',
        code: String.raw`C + A: no partition tolerance
C + P: reject requests during a partition
A + P: serve potentially stale data`,
      },
      {
        title: 'Distributed transactions',
        body:
          'A transaction may touch multiple sites. Two-phase commit coordinates the sites: a prepare phase and a commit phase. If a participant fails, the coordinator must decide whether to commit or abort. Distributed transactions are powerful but expensive and fragile under network failures.',
      },
    ],
    keyTakeaways: [
      'A distributed database spreads data across sites but presents one logical system.',
      'Transparency hides location, fragmentation, and replication.',
      'CAP forces a trade-off during network partitions.',
      'Two-phase commit coordinates distributed transactions.',
      'Distribution adds latency and failure modes.',
    ],
    pitfalls: [
      'Assuming a distributed database is always more available.',
      'Forgetting that transparency is a logical illusion, not a physical one.',
      'Ignoring the cost of two-phase commit.',
    ],
    focusPoints: [
      'Explain the three transparencies.',
      'State the CAP trade-off in one sentence.',
      'Trace two-phase commit at a high level.',
    ],
    quiz: [
      {
        question: 'What does location transparency hide?',
        options: ['Which site stores the data', 'The schema', 'The primary key', 'The transaction log'],
        answer: 0,
        explanation:
          'Users do not need to know which physical site holds a row.',
      },
      {
        question: 'What does CAP say a system must trade during a partition?',
        options: ['Consistency or availability', 'Schema or data', 'Locks or timestamps', 'Indexes or views'],
        answer: 0,
        explanation:
          'During a network partition, a system must choose between consistency and availability.',
      },
    ],
  },

  {
    chapterId: 'fragmentation-replication',
    plainEnglish: 'Split the books by city, or keep copies of the popular ones everywhere.',
    hook:
      'Distribution has two basic moves: split the data or copy it. Fragmentation improves locality; replication improves availability.',
    objectives: [
      'Distinguish horizontal and vertical fragmentation.',
      'Explain replication and its consistency cost.',
      'Know the trade-off between availability and consistency.',
      'Choose a distribution strategy for a workload.',
    ],
    sections: [
      {
        title: 'Fragmentation',
        body:
          'Horizontal fragmentation splits rows: customers in Europe go to one site, customers in Asia to another. Vertical fragmentation splits columns: frequently accessed columns stay together, large rarely used columns move elsewhere. A fragment must be reconstructible through union or join.',
        code: String.raw`horizontal:
site A: customers where region = 'EU'
site B: customers where region = 'ASIA'

vertical:
site A: customer_id, name, email
site B: customer_id, profile_blob`,
      },
      {
        title: 'Replication',
        body:
          'Replication stores copies of the same data at multiple sites. It improves read availability and reduces latency, but every write must be propagated. Synchronous replication keeps copies consistent at the cost of latency; asynchronous replication is faster but can serve stale data.',
      },
      {
        title: 'Choosing a strategy',
        body:
          'Use fragmentation when access is naturally partitioned by region or attribute. Use replication when reads dominate and availability matters. Most systems combine both: fragment large tables and replicate small, read-heavy reference data.',
      },
    ],
    keyTakeaways: [
      'Horizontal fragmentation splits rows; vertical splits columns.',
      'Fragments must be reconstructible.',
      'Replication trades write cost for read availability.',
      'Synchronous replication is consistent but slower.',
      'Asynchronous replication is faster but may be stale.',
    ],
    pitfalls: [
      'Fragmenting without a way to reconstruct the original relation.',
      'Assuming replication is free.',
      'Ignoring write amplification under replication.',
    ],
    focusPoints: [
      'Give one horizontal and one vertical fragmentation example.',
      'Compare synchronous and asynchronous replication.',
      'Match a strategy to a read-heavy workload.',
    ],
    quiz: [
      {
        question: 'What does horizontal fragmentation split?',
        options: ['Rows', 'Columns', 'Indexes', 'Transactions'],
        answer: 0,
        explanation:
          'Horizontal fragmentation partitions rows, often by a predicate such as region.',
      },
      {
        question: 'What is the cost of synchronous replication?',
        options: ['Higher write latency', 'No consistency', 'No availability', 'No schema'],
        answer: 0,
        explanation:
          'The write must wait for replicas to acknowledge before it is considered committed.',
      },
    ],
  },

  {
    chapterId: 'data-warehousing',
    plainEnglish: 'A report card for the whole school, built from many teachers\' grade books.',
    hook:
      'Operational databases are tuned for many small transactions. A warehouse is tuned for large analytical questions over history.',
    objectives: [
      'Distinguish OLTP from OLAP.',
      'Explain the ETL pipeline.',
      'Describe star and snowflake schemas.',
      'Know what a data mart is.',
    ],
    sections: [
      {
        title: 'OLTP versus OLAP',
        body:
          'OLTP systems handle many short reads and writes: place an order, update a balance. OLAP systems run fewer, larger analytical queries over historical data: revenue by region by quarter. Mixing the two on one system usually hurts both.',
      },
      {
        title: 'ETL and schemas',
        body:
          'Extract, transform, and load (ETL) moves data from operational systems into the warehouse. The transformation cleans, conforms, and aggregates. A star schema has a central fact table surrounded by dimension tables. A snowflake schema normalizes dimensions further, reducing redundancy but adding joins.',
        code: String.raw`star:
FactSales(date_id, product_id, store_id, amount)
DimDate, DimProduct, DimStore

snowflake:
DimProduct -> DimCategory -> DimDepartment`,
      },
      {
        title: 'OLAP and data marts',
        body:
          'OLAP operations include roll-up, drill-down, slice, dice, and pivot. A data mart is a smaller warehouse focused on one department or subject. It can be independent or fed from the central warehouse.',
      },
    ],
    keyTakeaways: [
      'OLTP optimizes transactions; OLAP optimizes analysis.',
      'ETL extracts, transforms, and loads warehouse data.',
      'Star schemas use a fact table and denormalized dimensions.',
      'Snowflake schemas normalize dimensions further.',
      'Data marts serve a focused subset of the warehouse.',
    ],
    pitfalls: [
      'Running heavy analytics on the production OLTP database.',
      'Assuming a star schema is always better than snowflake.',
      'Skipping data quality in the transform step.',
    ],
    focusPoints: [
      'Compare OLTP and OLAP workloads.',
      'Draw a small star schema.',
      'Explain roll-up and drill-down.',
    ],
    quiz: [
      {
        question: 'What does ETL stand for?',
        options: ['Extract, Transform, Load', 'Evaluate, Test, Launch', 'Extend, Trace, Log', 'Export, Transfer, Link'],
        answer: 0,
        explanation:
          'ETL moves data from sources, cleans and conforms it, and loads it into the warehouse.',
      },
      {
        question: 'What is the center of a star schema?',
        options: ['A fact table', 'A dimension table', 'An index', 'A view'],
        answer: 0,
        explanation:
          'The fact table stores measures and foreign keys to the surrounding dimension tables.',
      },
    ],
  },

  {
    chapterId: 'data-mining',
    plainEnglish: 'It is looking for patterns in a big box of receipts, not just finding one receipt.',
    hook:
      'Data mining is not just a big query. It is the search for patterns that were not explicitly requested.',
    objectives: [
      'Define data mining.',
      'Distinguish classification, clustering, and association rules.',
      'Know the role of feature selection and evaluation.',
      'List common data-mining tools.',
    ],
    sections: [
      {
        title: 'What mining adds',
        body:
          'A normal query answers a known question, such as "How many orders in March?" Data mining looks for hidden structure. It might ask, "Which customers are likely to churn?" It combines statistics, machine learning, and database techniques on large datasets.',
      },
      {
        title: 'Core techniques',
        body:
          'Classification predicts a label from labeled examples. Clustering groups similar records without labels. Association rules find items that co-occur, such as products bought together. Regression predicts a numeric value; anomaly detection finds unusual records.',
        code: String.raw`classification: churn = yes/no
clustering:   group customers by behavior
association:  {bread} -> {butter}
regression:   predicted revenue
anomaly:      unusual transaction`,
      },
      {
        title: 'Process and tools',
        body:
          'A mining project selects data, cleans it, engineers features, trains a model, evaluates it on held-out data, and deploys it. Tools include SQL analytics, Python libraries such as scikit-learn, R, and dedicated platforms. The hard part is usually data quality and problem framing, not the algorithm.',
      },
    ],
    keyTakeaways: [
      'Data mining finds patterns rather than answering a fixed query.',
      'Classification predicts labels; clustering groups unlabeled data.',
      'Association rules find co-occurring items.',
      'Evaluation on held-out data is essential.',
      'Data quality and problem framing dominate the work.',
    ],
    pitfalls: [
      'Confusing a normal aggregate query with mining.',
      'Evaluating a model on the training data.',
      'Ignoring data leakage.',
    ],
    focusPoints: [
      'Distinguish classification, clustering, and association.',
      'Explain why held-out evaluation matters.',
      'Name two tools used in practice.',
    ],
    quiz: [
      {
        question: 'Which technique groups unlabeled records by similarity?',
        options: ['Classification', 'Clustering', 'Regression', 'Association rules'],
        answer: 1,
        explanation:
          'Clustering finds groups in data without predefined labels.',
      },
      {
        question: 'What is an association rule?',
        options: [
          'A pattern such as {bread} → {butter}',
          'A primary key',
          'A normalization rule',
          'A transaction log',
        ],
        answer: 0,
        explanation:
          'Association rules describe items that frequently co-occur.',
      },
    ],
  },

  {
    chapterId: 'comparison-and-review',
    plainEnglish: 'A tree, a road map, and a spreadsheet are each good for a different question.',
    hook:
      'The three classic models are not just history. Each one answers a different question about how data should be structured and accessed.',
    objectives: [
      'Compare hierarchical, network, and relational models.',
      'Distinguish navigation from declarative access.',
      'Distinguish a data-mining query from a normal query.',
      'Choose a model for a given workload.',
    ],
    sections: [
      {
        title: 'HDB vs NDB vs RDB',
        body:
          'Hierarchical: tree, one parent, fast one-to-many navigation, awkward many-to-many. Network: graph of sets, supports many-to-many, still navigational. Relational: tables, declarative queries, logical independence, the default for general-purpose data. Object and document models extend the relational idea with nested or flexible structures.',
        code: String.raw`HDB: tree, one parent, navigational
NDB: graph, multiple parents, navigational
RDB: tables, declarative, set-based`,
      },
      {
        title: 'Data mining versus normal query',
        body:
          'A normal query retrieves known data with a precise predicate, such as "orders over 100 in March." A mining query searches for patterns or predictions, such as "which customers are likely to churn?" The first is deterministic and often aggregate. The second is statistical and evaluated on held-out data.',
      },
      {
        title: 'Choosing a model',
        body:
          'Use a relational database for transactional integrity and ad hoc queries. Use a document store for evolving nested data. Use a graph database when relationships are the primary query. Use a warehouse for analytics and a mining tool for prediction. The model should follow the workload, not fashion.',
      },
    ],
    keyTakeaways: [
      'HDB is a tree; NDB is a graph; RDB is tables.',
      'HDB and NDB are navigational; RDB is declarative.',
      'Normal queries retrieve known data; mining finds patterns.',
      'Mining is statistical and needs evaluation.',
      'Choose the model based on the workload.',
    ],
    pitfalls: [
      'Assuming the newest model is always the right model.',
      'Treating mining as a synonym for reporting.',
      'Ignoring the cost of navigation in legacy models.',
    ],
    focusPoints: [
      'Compare the three models in one table.',
      'Give one example of a normal query and one mining question.',
      'Match a workload to a model.',
    ],
    quiz: [
      {
        question: 'Which model uses a tree with one parent per record?',
        options: ['Hierarchical', 'Network', 'Relational', 'Document'],
        answer: 0,
        explanation:
          'The hierarchical model is a tree with one parent per child record.',
      },
      {
        question: 'How does a data-mining query differ from a normal query?',
        options: [
          'It searches for patterns or predictions rather than retrieving known data',
          'It never uses a database',
          'It always returns one row',
          'It cannot use indexes',
        ],
        answer: 0,
        explanation:
          'Mining looks for hidden structure or predictions, while a normal query retrieves data matching a known predicate.',
      },
    ],
  },
];
