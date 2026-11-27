export type DBMSLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type DBMSCategory =
  | 'Foundations'
  | 'Modeling'
  | 'Relational Model'
  | 'Keys & Constraints'
  | 'Normalization'
  | 'Transactions & Recovery'
  | 'Concurrency'
  | 'Distributed & Analytics';

export interface DBMSChapter {
  id: string;
  number: number;
  title: string;
  category: DBMSCategory;
  difficulty: DBMSLevel;
  estimatedMinutes: number;
  summary: string;
  concepts: string[];
  prerequisites: string[];
  visualizerKey?: 'erd' | 'algebra' | 'normalization' | 'transactions' | 'locks' | 'warehouse';
}

export const dbmsCategories: readonly (DBMSCategory | 'All')[] = [
  'All',
  'Foundations',
  'Modeling',
  'Relational Model',
  'Keys & Constraints',
  'Normalization',
  'Transactions & Recovery',
  'Concurrency',
  'Distributed & Analytics',
] as const;

export const dbmsChapters: DBMSChapter[] = [
  {
    id: 'dbms-introduction',
    number: 1,
    title: 'What is a DBMS?',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Why databases exist, what a DBMS manages, who uses it, and the advantages and limitations of a database over flat files.',
    concepts: [
      'Data, information, and metadata',
      'DBMS as a data manager',
      'File system versus DBMS',
      'Advantages and limitations',
      'Users: DBA, designers, developers, end users',
    ],
    prerequisites: [],
  },
  {
    id: 'dbms-architecture',
    number: 2,
    title: 'DBMS Architecture & Modules',
    category: 'Foundations',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'The three-schema architecture, query processing, storage management, and the software modules that make a DBMS work.',
    concepts: [
      'External, conceptual, and internal schemas',
      'Logical and physical data independence',
      'Query parser, optimizer, and executor',
      'Storage manager, buffer manager, and transaction manager',
      'DBA and end-user roles',
    ],
    prerequisites: ['dbms-introduction'],
  },
  {
    id: 'data-models-overview',
    number: 3,
    title: 'Data Models Overview',
    category: 'Foundations',
    difficulty: 'Beginner',
    estimatedMinutes: 12,
    summary:
      'Hierarchical, network, relational, and object models — how each represents entities and relationships.',
    concepts: [
      'Data model definition',
      'Hierarchical model',
      'Network model',
      'Relational model',
      'Object and document models',
    ],
    prerequisites: ['dbms-introduction'],
  },
  {
    id: 'erd-fundamentals',
    number: 4,
    title: 'ERD Fundamentals',
    category: 'Modeling',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'Entities, attributes, keys, and the first steps of turning a real-world domain into an entity-relationship diagram.',
    concepts: [
      'Entity and entity set',
      'Attributes: simple, composite, multivalued, derived',
      'Keys in an ERD',
      'Strong versus weak entities',
      'ERD notation',
    ],
    prerequisites: ['data-models-overview'],
    visualizerKey: 'erd',
  },
  {
    id: 'erd-relationships',
    number: 5,
    title: 'ERD Relationships & Constraints',
    category: 'Modeling',
    difficulty: 'Intermediate',
    estimatedMinutes: 16,
    summary:
      'Relationships, cardinality, participation, weak entities, and how to read a relationship diamond correctly.',
    concepts: [
      'Relationship and relationship set',
      'Degree: unary, binary, ternary',
      'Cardinality: 1:1, 1:N, M:N',
      'Total and partial participation',
      'Weak entities and identifying relationships',
    ],
    prerequisites: ['erd-fundamentals'],
    visualizerKey: 'erd',
  },
  {
    id: 'hierarchical-model',
    number: 6,
    title: 'Hierarchical Database Model',
    category: 'Modeling',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'Records arranged as a tree: one parent, many children. Learn the model, its access path, and its structural limits.',
    concepts: [
      'Tree-structured records',
      'Parent-child relationships',
      'Navigational access',
      'Redundancy and many-to-many limitations',
      'IMS-style databases',
    ],
    prerequisites: ['data-models-overview'],
  },
  {
    id: 'network-model',
    number: 7,
    title: 'Network Database Model',
    category: 'Modeling',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'A graph of records connected by sets. It solves the hierarchical many-to-many problem but makes navigation complex.',
    concepts: [
      'Records and sets',
      'Owner and member records',
      'Many-to-many relationships',
      'Navigational access paths',
      'CODASYL model',
    ],
    prerequisites: ['hierarchical-model'],
  },
  {
    id: 'relational-model',
    number: 8,
    title: 'Relational Model: Domains, Tuples & Cardinality',
    category: 'Relational Model',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'Relations as tables: domains, attributes, tuples, degree, cardinality, and why the model is declarative.',
    concepts: [
      'Relation, tuple, attribute, domain',
      'Degree and cardinality',
      'Schema versus instance',
      'Keys in the relational model',
      'Declarative access',
    ],
    prerequisites: ['data-models-overview'],
  },
  {
    id: 'codd-rules',
    number: 9,
    title: "Codd's 12 Rules",
    category: 'Relational Model',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'The rules that define a truly relational DBMS, what they require, and where real systems compromise.',
    concepts: [
      'Information rule',
      'Guaranteed access and systematic null handling',
      'Catalog and view rules',
      'Physical and logical independence',
      'Integrity and non-subversion rules',
    ],
    prerequisites: ['relational-model'],
  },
  {
    id: 'relational-algebra-selection',
    number: 10,
    title: 'Relational Algebra: Selection & Projection',
    category: 'Relational Model',
    difficulty: 'Beginner',
    estimatedMinutes: 14,
    summary:
      'Selection filters rows; projection chooses columns. Learn the operators, notation, and the order that matters.',
    concepts: [
      'Selection σ (sigma)',
      'Projection π (pi)',
      'Predicates',
      'Duplicate elimination in projection',
      'Composing selection and projection',
    ],
    prerequisites: ['relational-model'],
    visualizerKey: 'algebra',
  },
  {
    id: 'relational-algebra-set-ops',
    number: 11,
    title: 'Relational Algebra: Set Operations',
    category: 'Relational Model',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Union, intersection, and difference. Learn the union-compatible requirement and the result of each operation.',
    concepts: [
      'Union compatibility',
      'Union',
      'Intersection',
      'Difference',
      'Set versus bag semantics',
    ],
    prerequisites: ['relational-algebra-selection'],
    visualizerKey: 'algebra',
  },
  {
    id: 'relational-algebra-joins',
    number: 12,
    title: 'Relational Algebra: Cartesian Product & Joins',
    category: 'Relational Model',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    summary:
      'Cartesian product, theta join, equi join, and natural join — how rows are matched and why joins are the heart of SQL.',
    concepts: [
      'Cartesian product',
      'Theta join',
      'Equi join',
      'Natural join',
      'Join selectivity and cost',
    ],
    prerequisites: ['relational-algebra-set-ops'],
    visualizerKey: 'algebra',
  },
  {
    id: 'keys',
    number: 13,
    title: 'Keys: Superkey, Candidate, Primary & Foreign',
    category: 'Keys & Constraints',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'How a relation identifies rows: superkeys, candidate keys, primary keys, alternate keys, and foreign keys.',
    concepts: [
      'Superkey',
      'Candidate key',
      'Primary key',
      'Alternate key',
      'Foreign key',
      'Referential integrity',
    ],
    prerequisites: ['relational-model'],
  },
  {
    id: 'integrity-constraints',
    number: 14,
    title: 'Integrity Constraints',
    category: 'Keys & Constraints',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'Entity integrity, domain integrity, and referential integrity — the rules that keep a database consistent.',
    concepts: [
      'Entity integrity',
      'Domain integrity',
      'Referential integrity',
      'NOT NULL and CHECK constraints',
      'Cascade versus restrict',
    ],
    prerequisites: ['keys'],
  },
  {
    id: 'assertions-triggers',
    number: 15,
    title: 'Assertions & Triggers',
    category: 'Keys & Constraints',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'Assertions enforce global conditions; triggers run code on insert, update, or delete. Learn when each is appropriate.',
    concepts: [
      'Assertions',
      'Trigger events and timing',
      'Row-level versus statement-level triggers',
      'Before and after triggers',
      'Trigger side effects and recursion',
    ],
    prerequisites: ['integrity-constraints'],
  },
  {
    id: 'functional-dependencies',
    number: 16,
    title: 'Functional Dependencies',
    category: 'Normalization',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    summary:
      'X → Y means X determines Y. Learn Armstrong\'s axioms, closure, and how dependencies drive normalization.',
    concepts: [
      'Functional dependency',
      'Armstrong\'s axioms',
      'Attribute closure',
      'Candidate keys from dependencies',
      'Partial and transitive dependencies',
    ],
    prerequisites: ['keys'],
  },
  {
    id: 'anomalies',
    number: 17,
    title: 'Anomalies: Insert, Update & Delete',
    category: 'Normalization',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'Bad schemas cause redundant data and inconsistent updates. See the three anomaly types in a concrete table.',
    concepts: [
      'Insertion anomaly',
      'Update anomaly',
      'Deletion anomaly',
      'Redundancy',
      'Why normalization matters',
    ],
    prerequisites: ['functional-dependencies'],
  },
  {
    id: 'first-normal-form',
    number: 18,
    title: 'Normalization: 1NF',
    category: 'Normalization',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'First normal form requires atomic values and no repeating groups. Learn the rule and decompose a multivalued table.',
    concepts: [
      'Atomic attributes',
      'Repeating groups',
      'Multivalued attributes',
      '1NF decomposition',
      'Primary key after decomposition',
    ],
    prerequisites: ['anomalies'],
    visualizerKey: 'normalization',
  },
  {
    id: 'second-normal-form',
    number: 19,
    title: 'Normalization: 2NF',
    category: 'Normalization',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'Second normal form removes partial dependencies on part of a composite key. Learn the test and the decomposition.',
    concepts: [
      'Composite primary key',
      'Partial dependency',
      '2NF test',
      'Decomposition into 2NF',
      'Preserving functional dependencies',
    ],
    prerequisites: ['first-normal-form'],
    visualizerKey: 'normalization',
  },
  {
    id: 'third-normal-form',
    number: 20,
    title: 'Normalization: 3NF',
    category: 'Normalization',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'Third normal form removes transitive dependencies. Learn the rule, the decomposition, and the trade-offs.',
    concepts: [
      'Transitive dependency',
      '3NF test',
      'Decomposition into 3NF',
      'Lossless join',
      'Normalization trade-offs',
    ],
    prerequisites: ['second-normal-form'],
    visualizerKey: 'normalization',
  },
  {
    id: 'transactions-acid',
    number: 21,
    title: 'Transactions & ACID',
    category: 'Transactions & Recovery',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'A transaction is a unit of work. Learn atomicity, consistency, isolation, and durability with bank-transfer examples.',
    concepts: [
      'Transaction',
      'Atomicity',
      'Consistency',
      'Isolation',
      'Durability',
      'Commit and rollback',
    ],
    prerequisites: ['relational-model'],
    visualizerKey: 'transactions',
  },
  {
    id: 'transaction-states',
    number: 22,
    title: 'Transaction States',
    category: 'Transactions & Recovery',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'Active, partially committed, committed, failed, and aborted. Trace a transaction through its lifecycle.',
    concepts: [
      'Active state',
      'Partially committed state',
      'Committed state',
      'Failed state',
      'Aborted state',
      'Rollback and restart',
    ],
    prerequisites: ['transactions-acid'],
    visualizerKey: 'transactions',
  },
  {
    id: 'recovery-logs',
    number: 23,
    title: 'Recovery: Logs & Checkpoints',
    category: 'Transactions & Recovery',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    summary:
      'Write-ahead logging, redo, undo, and checkpoints. Learn how a DBMS recovers after a crash.',
    concepts: [
      'Write-ahead logging',
      'Redo and undo',
      'Checkpoints',
      'Log sequence numbers',
      'Crash recovery phases',
    ],
    prerequisites: ['transaction-states'],
    visualizerKey: 'transactions',
  },
  {
    id: 'shadow-paging',
    number: 24,
    title: 'Recovery: Shadow Paging',
    category: 'Transactions & Recovery',
    difficulty: 'Advanced',
    estimatedMinutes: 12,
    summary:
      'Shadow paging keeps two page tables and switches atomically. Learn the idea, its benefits, and its costs.',
    concepts: [
      'Current page table',
      'Shadow page table',
      'Atomic switch',
      'Garbage collection',
      'Comparison with logging',
    ],
    prerequisites: ['recovery-logs'],
  },
  {
    id: 'concurrency-problems',
    number: 25,
    title: 'Concurrency Problems',
    category: 'Concurrency',
    difficulty: 'Advanced',
    estimatedMinutes: 16,
    summary:
      'Lost updates, dirty reads, unrepeatable reads, and phantoms. See how interleavings break correctness.',
    concepts: [
      'Lost update',
      'Dirty read',
      'Unrepeatable read',
      'Phantom read',
      'Serializability',
    ],
    prerequisites: ['transactions-acid'],
    visualizerKey: 'locks',
  },
  {
    id: 'locking-2pl',
    number: 26,
    title: 'Locking & Two-Phase Locking',
    category: 'Concurrency',
    difficulty: 'Advanced',
    estimatedMinutes: 18,
    summary:
      'Shared and exclusive locks, lock compatibility, two-phase locking, and deadlocks.',
    concepts: [
      'Shared lock',
      'Exclusive lock',
      'Lock compatibility matrix',
      'Growing and shrinking phases',
      'Two-phase locking',
      'Deadlock',
    ],
    prerequisites: ['concurrency-problems'],
    visualizerKey: 'locks',
  },
  {
    id: 'timestamp-optimistic',
    number: 27,
    title: 'Timestamp & Optimistic Control',
    category: 'Concurrency',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'Order transactions by timestamp, validate at commit, and compare optimistic and pessimistic control.',
    concepts: [
      'Timestamp ordering',
      'Read and write timestamps',
      'Validation phase',
      'Optimistic concurrency control',
      'Multiversion concurrency control',
    ],
    prerequisites: ['locking-2pl'],
    visualizerKey: 'locks',
  },
  {
    id: 'distributed-databases',
    number: 28,
    title: 'Distributed Databases',
    category: 'Distributed & Analytics',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'Data spread across sites, transparency, and the CAP trade-off. Learn why distribution is both powerful and hard.',
    concepts: [
      'Distributed database',
      'Location and fragmentation transparency',
      'Replication transparency',
      'CAP theorem',
      'Distributed transactions',
    ],
    prerequisites: ['transactions-acid'],
  },
  {
    id: 'fragmentation-replication',
    number: 29,
    title: 'Fragmentation & Replication',
    category: 'Distributed & Analytics',
    difficulty: 'Advanced',
    estimatedMinutes: 14,
    summary:
      'Horizontal and vertical fragmentation, replication, and the trade-offs between availability and consistency.',
    concepts: [
      'Horizontal fragmentation',
      'Vertical fragmentation',
      'Replication',
      'Consistency versus availability',
      'Replica placement',
    ],
    prerequisites: ['distributed-databases'],
  },
  {
    id: 'data-warehousing',
    number: 30,
    title: 'Data Warehousing',
    category: 'Distributed & Analytics',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Separate analytical storage from transactional systems. Learn ETL, star schemas, OLAP, and data marts.',
    concepts: [
      'Operational versus analytical processing',
      'ETL pipeline',
      'Star and snowflake schemas',
      'OLAP cubes',
      'Data marts',
    ],
    prerequisites: ['relational-model'],
    visualizerKey: 'warehouse',
  },
  {
    id: 'data-mining',
    number: 31,
    title: 'Data Mining',
    category: 'Distributed & Analytics',
    difficulty: 'Intermediate',
    estimatedMinutes: 14,
    summary:
      'Find patterns in large data: classification, clustering, association rules, and the tools used to do it.',
    concepts: [
      'Classification',
      'Clustering',
      'Association rules',
      'Regression and anomaly detection',
      'Data mining tools',
    ],
    prerequisites: ['data-warehousing'],
  },
  {
    id: 'comparison-and-review',
    number: 32,
    title: 'HDB vs NDB vs RDB & Data Mining vs Query',
    category: 'Distributed & Analytics',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    summary:
      'Compare the three classic database models and distinguish a data-mining query from an ordinary database query.',
    concepts: [
      'Hierarchical versus network versus relational',
      'Navigation versus declarative access',
      'Data mining versus normal query',
      'When each model fits',
    ],
    prerequisites: ['hierarchical-model', 'network-model', 'relational-model', 'data-mining'],
  },
];

export const dbmsChapterById = new Map(dbmsChapters.map((chapter) => [chapter.id, chapter]));

export function getDBMSChapter(id: string | undefined): DBMSChapter | undefined {
  return id ? dbmsChapterById.get(id) : undefined;
}

export function getDBMSChapterIndex(id: string): number {
  return dbmsChapters.findIndex((chapter) => chapter.id === id);
}

export function getAdjacentDBMSChapters(id: string): {
  previous?: DBMSChapter;
  next?: DBMSChapter;
} {
  const index = getDBMSChapterIndex(id);
  if (index < 0) return {};
  return {
    previous: index > 0 ? dbmsChapters[index - 1] : undefined,
    next: index < dbmsChapters.length - 1 ? dbmsChapters[index + 1] : undefined,
  };
}
