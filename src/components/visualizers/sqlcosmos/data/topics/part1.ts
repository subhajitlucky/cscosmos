import { SqlTopic } from './types';

export const TOPICS_1_TO_10: SqlTopic[] = [
  {
    id: 'intro-to-sql',
    topicNumber: 1,
    title: 'Introduction to SQL',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Core relational concepts, Structured Query Language (SQL) vs NoSQL document/key-value stores, RDBMS guarantees, and standard database use cases.',
    definition: 'SQL (Structured Query Language) is the standard declarative programming language used to manage, query, and manipulate data stored in a Relational Database Management System (RDBMS).',
    eli5: 'Think of an Excel workbook with rigid tabs that link to each other by ID numbers. SQL is the universal language you use to ask questions and update data in that workbook without opening it by hand.',
    realWorldExample: {
      description: 'An e-commerce store needs consistent order records. A customer placed an order with items, inventory amounts, and payment status.',
      tables: [
        {
          title: 'Users',
          headers: ['id (PK)', 'email', 'country'],
          rows: [
            [1, 'lucky@example.com', 'India'],
            [2, 'rahul@example.com', 'Germany'],
          ],
        },
        {
          title: 'Orders',
          headers: ['id (PK)', 'user_id (FK)', 'total_usd'],
          rows: [
            [101, 1, '120.00'],
            [102, 2, '85.50'],
          ],
        },
      ],
      explanation: 'SQL ensures every order references a real user and financial balances balance out deterministically.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Check database version and current timestamp',
        code: 'SELECT version(), CURRENT_TIMESTAMP;',
        note: 'Returns the database engine distribution (e.g. PostgreSQL, MySQL) and server clock.',
      },
      {
        step: 'Step 2: Simple declarative relational query',
        code: 'SELECT id, email FROM users WHERE country = \'India\';',
        note: 'You declare WHAT data you want; the engine optimizer chooses HOW to retrieve it.',
      },
    ],
    rulesTable: [
      { rule: 'Declarative semantics', explanation: 'Queries specify what dataset is required, not procedural loop steps.' },
      { rule: 'ANSI standard compliance', explanation: 'Core syntax works across PostgreSQL, MySQL, SQLite, Oracle, and SQL Server.' },
      { rule: 'Schema enforcement', explanation: 'Every column must adhere to a designated type (e.g., INT, VARCHAR, TIMESTAMP).' },
    ],
    deepDive: {
      title: 'SQL vs NoSQL Storage Paradigms',
      description: 'RDBMS engines prioritize ACID transactions and normalized relational schemas. NoSQL systems (Document, Key-Value, Columnar) prioritize schema flexibility and horizontal partition scaling at the expense of strict cross-entity constraints.',
      codeSnippet: '-- SQL: Strict relational join\nSELECT u.email, o.total_usd\nFROM users u\nJOIN orders o ON u.id = o.user_id;\n\n// NoSQL Document (MongoDB JSON embed):\n// { "_id": 101, "user_email": "lucky@example.com", "total_usd": 120.00 }',
      warning: 'Do not use NoSQL when you require multi-entity relational integrity and complex financial reporting.',
    },
    advantages: [
      'Declarative syntax: no manual file pointers or low-level loops.',
      'Strict schema enforcement guarantees data shape and type safety.',
      'ACID guarantees prevent corrupted balances or ghost transactions.',
    ],
    disadvantages: [
      'Rigid schema migrations require structured ALTER TABLE processes.',
      'Horizontal sharding across thousands of servers is more complex than simple document stores.',
    ],
    interviewQuestions: [
      {
        question: 'What is the fundamental difference between declarative and procedural languages?',
        answer: 'In procedural languages (like C or Python), you write explicit step-by-step algorithms and loops. In SQL (declarative), you specify the desired output condition and relations, leaving algorithm selection to the Cost-Based Optimizer (CBO).',
      },
      {
        question: 'When should you choose SQL over a NoSQL database?',
        answer: 'Choose SQL when data is relational, requires foreign key consistency, structured financial ledger accuracy, complex joins, or strict ACID compliance.',
      },
      {
        question: 'What is an RDBMS?',
        answer: 'A Relational Database Management System is software (like PostgreSQL, MySQL) that stores data in tables of rows and columns, enforcing relationships using primary and foreign keys.',
      },
    ],
    interviewReadyAnswer: 'SQL is the standard declarative query language for relational databases. It allows engineers to describe required datasets while the database optimizer figures out the optimal disk access path and join algorithm, providing ACID consistency and referential integrity.',
    quickTest: {
      question: 'Which of the following describes why SQL is considered a declarative language?',
      options: [
        { key: 'A', text: 'You must write for-loops to iterate through disk pages.' },
        { key: 'B', text: 'You specify what data you want, and the database optimizer decides how to fetch it.' },
        { key: 'C', text: 'It only runs on cloud-native hardware.' },
        { key: 'D', text: 'It compiles directly to x86 assembly at runtime without a query planner.' },
      ],
      correctAnswer: 'B',
      explanation: 'SQL is declarative because developers declare the target criteria (SELECT, WHERE, JOIN) and the Cost-Based Optimizer chooses the physical execution plan.',
    },
    mentalModel: 'Flight Planner: You declare your departure and destination, and the air traffic system plans the most efficient route.',
    codeSnippet: 'SELECT u.email, o.total_usd\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.total_usd > 100.00;',
    takeaways: [
      'SQL is declarative: specify WHAT, not HOW.',
      'RDBMS engines guarantee ACID transactional integrity.',
      'Schemas enforce uniform column data types across all rows.',
    ],
    commonPitfall: {
      mistake: 'Treating SQL like procedural code by writing cursor loops instead of set-based declarative queries.',
      fix: 'Use set-based joins, filters, and aggregations rather than row-by-row procedural cursors.',
    },
    nextTopicId: 'database-and-tables',
  },
  {
    id: 'database-and-tables',
    topicNumber: 2,
    title: 'Database & Tables',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Relational database architecture: schemas, tables, columns, slotted page row storage, primary keys, and relationships.',
    definition: 'A database is an organized container of schemas, while a table is a structured collection of rows (records) and columns (attributes) representing an entity.',
    eli5: 'A database is a giant filing cabinet. Each drawer is a schema, each folder is a table, each sheet of paper is a row, and each form field on that paper is a column.',
    realWorldExample: {
      description: 'A university system stores students and courses.',
      tables: [
        {
          title: 'Students Table',
          headers: ['id', 'first_name', 'gpa', 'enrolled_at'],
          rows: [
            [1, 'Alice', '3.85', '2024-09-01'],
            [2, 'Bob', '3.40', '2024-09-01'],
          ],
        },
      ],
      explanation: 'Every row represents a unique student; every column has a strict type (e.g. gpa is NUMERIC(3,2)).',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Create a dedicated schema',
        code: 'CREATE SCHEMA IF NOT EXISTS university;',
        note: 'Namespaces keep tables organized and avoid naming collisions.',
      },
      {
        step: 'Step 2: Create a structured table',
        code: 'CREATE TABLE university.students (\n  id INT PRIMARY KEY,\n  first_name VARCHAR(50) NOT NULL,\n  gpa NUMERIC(3, 2) CHECK (gpa >= 0.0 AND gpa <= 4.0),\n  enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE\n);',
        note: 'Columns enforce strict types, default values, and domain integrity rules.',
      },
    ],
    rulesTable: [
      { rule: 'Column Homogeneity', explanation: 'All values in a column must match the defined data type.' },
      { rule: 'Row Uniqueness', explanation: 'Every row should be uniquely identifiable via a Primary Key.' },
      { rule: 'Atomic Values', explanation: 'First Normal Form requires that cells contain single scalar values, not nested arrays or unparsed text.' },
    ],
    deepDive: {
      title: 'Physical Slotted Page Storage',
      description: 'On disk, tables are stored in fixed-size blocks (typically 8 KB in PostgreSQL). The page header contains pointers (item pointers) growing downward, while row tuples grow upward from the bottom of the page.',
      codeSnippet: '-- Slotted Page Layout:\n-- [ Page Header | Line Pointer 1 | Line Pointer 2 | ... Free Space ... | Tuple 2 | Tuple 1 ]',
      warning: 'Variable-length text columns that exceed page capacity are automatically moved off-table into TOAST storage.',
    },
    advantages: [
      'Predictable memory and disk layout.',
      'Fast column projection and indexing.',
      'Automatic type safety at the storage engine level.',
    ],
    disadvantages: [
      'Altering column types on multi-million row tables can require rewrite locks.',
      'Sparse tables with many nullable columns can consume unnecessary page space.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between a database and a schema?',
        answer: 'A database is the top-level container with its own physical catalogs and permissions. A schema is a logical namespace inside a database that groups tables, views, and functions.',
      },
      {
        question: 'What is a slotted page in RDBMS storage engines?',
        answer: 'A slotted page is an 8 KB disk block where an array of line pointers at the top points to variable-length tuple data stored at the bottom, allowing rows to be moved within the page without changing their external tuple ID (TID).',
      },
    ],
    interviewReadyAnswer: 'A relational database organizes entities into schemas and tables. Each table enforces a strict schema of typed columns, storing records in fixed-size slotted disk pages with primary keys ensuring row identity.',
    quickTest: {
      question: 'In a standard relational table, what ensures that every record can be distinctly identified?',
      options: [
        { key: 'A', text: 'A Primary Key constraint' },
        { key: 'B', text: 'A database schema name' },
        { key: 'C', text: 'A foreign key cascade' },
        { key: 'D', text: 'A LIMIT clause' },
      ],
      correctAnswer: 'A',
      explanation: 'A Primary Key uniquely identifies each row in a table and cannot contain NULL values.',
    },
    mentalModel: 'Filing Cabinet: Schemas are drawers, tables are folders, rows are paper forms, and columns are typed input boxes.',
    codeSnippet: 'CREATE TABLE university.courses (\n  id SERIAL PRIMARY KEY,\n  code VARCHAR(10) UNIQUE NOT NULL,\n  credits INT CHECK (credits > 0)\n);',
    takeaways: [
      'Tables are collections of rows conforming to column schema definitions.',
      'Disk engines store table rows in 8 KB slotted disk pages.',
      'Schemas provide namespaces to prevent table naming collisions.',
    ],
    commonPitfall: {
      mistake: 'Putting unrelated multi-valued data in a single comma-separated string column.',
      fix: 'Normalize into separate rows or a child junction table.',
    },
    nextTopicId: 'sql-command-types',
    prevTopicId: 'intro-to-sql',
  },
  {
    id: 'sql-command-types',
    topicNumber: 3,
    title: 'SQL Command Types',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'The 5 major SQL sub-languages: DDL, DML, DQL, DCL, and TCL with practical syntax and execution context.',
    definition: 'SQL commands are categorized into five sub-languages based on their function: DDL (structure), DML (data manipulation), DQL (querying), DCL (permissions), and TCL (transactions).',
    eli5: 'Think of a building: DDL is the architect building rooms, DML is the tenant moving furniture in, DQL is a visitor looking around, DCL is the security guard giving keys, and TCL is the contract signing.',
    realWorldExample: {
      description: 'A banking application uses all five command types in daily operation.',
      tables: [
        {
          title: 'SQL Command Categories',
          headers: ['Category', 'Acronym', 'Core Verbs'],
          rows: [
            ['Data Definition', 'DDL', 'CREATE, ALTER, DROP, TRUNCATE'],
            ['Data Manipulation', 'DML', 'INSERT, UPDATE, DELETE'],
            ['Data Query', 'DQL', 'SELECT'],
            ['Data Control', 'DCL', 'GRANT, REVOKE'],
            ['Transaction Control', 'TCL', 'COMMIT, ROLLBACK, SAVEPOINT'],
          ],
        },
      ],
      explanation: 'An administrator creates the table (DDL), grants access (DCL), customers transfer funds (TCL + DML), and auditors review logs (DQL).',
    },
    sqlSyntaxSteps: [
      {
        step: 'DDL: Define Structure',
        code: 'CREATE TABLE accounts (id INT PRIMARY KEY, balance NUMERIC(10,2));',
      },
      {
        step: 'TCL & DML: Safe Transactional Write',
        code: 'BEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE id = 1;\nUPDATE accounts SET balance = balance + 50 WHERE id = 2;\nCOMMIT;',
      },
      {
        step: 'DQL: Query State',
        code: 'SELECT id, balance FROM accounts WHERE id IN (1, 2);',
      },
      {
        step: 'DCL: Control Permissions',
        code: 'GRANT SELECT ON accounts TO auditor_role;',
      },
    ],
    rulesTable: [
      { rule: 'DDL Implicit Commits', explanation: 'In MySQL and Oracle, DDL statements cause an automatic commit of any open transaction (PostgreSQL supports transactional DDL).' },
      { rule: 'DML Row Locks', explanation: 'DML operations acquire row-level exclusive locks until the transaction issues COMMIT or ROLLBACK.' },
      { rule: 'DQL Concurrency', explanation: 'Under standard MVCC, SELECT statements do not lock out read or write operations.' },
    ],
    deepDive: {
      title: 'Transactional DDL in Modern Engines',
      description: 'PostgreSQL allows DDL statements (like CREATE TABLE or ALTER TABLE) to execute inside a BEGIN...COMMIT block, allowing atomic schema rollback if a migration step fails.',
      codeSnippet: 'BEGIN;\nALTER TABLE accounts ADD COLUMN currency VARCHAR(3) DEFAULT \'USD\';\n-- If something fails, ROLLBACK restores previous schema!\nCOMMIT;',
      warning: 'In MySQL, DDL statements implicitly commit any active transaction, making automated migration rollback impossible.',
    },
    advantages: [
      'Clear separation of duties between schema design, data mutation, and security.',
      'Fine-grained access control through DCL grants.',
      'Transactional safety via TCL guarantees all-or-nothing execution.',
    ],
    disadvantages: [
      'Running heavy DDL operations on production can cause table locks.',
      'Uncommitted TCL blocks hold database locks and exhaust connection pools.',
    ],
    interviewQuestions: [
      {
        question: 'What is the difference between DELETE and TRUNCATE?',
        answer: 'DELETE is a DML command that removes rows one-by-one, firing triggers and recording full undo/WAL logs. TRUNCATE is a DDL command that deallocates entire disk pages, is much faster, resets auto-increment sequences, and does not fire row triggers.',
      },
      {
        question: 'Does PostgreSQL support transactional DDL?',
        answer: 'Yes. In PostgreSQL, most DDL statements (like CREATE TABLE, ALTER TABLE, DROP TABLE) can be run inside a transaction block and rolled back atomically.',
      },
    ],
    interviewReadyAnswer: 'SQL is divided into five core sub-languages: DDL manages schemas, DML mutates rows, DQL retrieves data, DCL manages permissions, and TCL guarantees atomicity via COMMIT and ROLLBACK.',
    quickTest: {
      question: 'Which of the following is a DDL (Data Definition Language) command?',
      options: [
        { key: 'A', text: 'UPDATE' },
        { key: 'B', text: 'TRUNCATE TABLE' },
        { key: 'C', text: 'SELECT' },
        { key: 'D', text: 'GRANT' },
      ],
      correctAnswer: 'B',
      explanation: 'TRUNCATE TABLE is a DDL command because it deallocates the physical underlying storage structures of the table.',
    },
    mentalModel: 'Building construction: DDL is pouring concrete, DML is decorating rooms, DQL is taking a photo, DCL is handing out keys, and TCL is signing the deed.',
    codeSnippet: '-- DDL creates, DML writes, DQL reads, TCL commits:\nBEGIN;\nINSERT INTO accounts (id, balance) VALUES (1, 1000.00);\nCOMMIT;\nSELECT * FROM accounts;',
    takeaways: [
      'DDL changes table schema; DML mutates row data; DQL queries data.',
      'TCL controls transactions with BEGIN, COMMIT, and ROLLBACK.',
      'TRUNCATE is fast DDL, whereas DELETE is logged DML.',
    ],
    commonPitfall: {
      mistake: 'Using DELETE without a WHERE clause to clear a table with millions of rows, generating huge WAL logs and slowing down the server.',
      fix: 'Use TRUNCATE TABLE to instantly deallocate the disk pages.',
    },
    nextTopicId: 'create-statements',
    prevTopicId: 'database-and-tables',
  },
  {
    id: 'create-statements',
    topicNumber: 4,
    title: 'CREATE Statements',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'CREATE DATABASE, CREATE SCHEMA, CREATE TABLE, generated columns, column types, and schema options.',
    definition: 'The CREATE statement is a DDL command used to instantiate new databases, schemas, tables, indexes, and views within the RDBMS catalog.',
    eli5: 'CREATE is like drafting an empty blueprint for a new house or building. You define the room sizes, door names, and rules before anyone moves in.',
    realWorldExample: {
      description: 'Creating an audit logging table with timestamp defaults, identity columns, and JSON payloads.',
      tables: [
        {
          title: 'audit_logs schema',
          headers: ['Column', 'Type', 'Constraint / Default'],
          rows: [
            ['id', 'BIGINT', 'GENERATED ALWAYS AS IDENTITY (PK)'],
            ['action', 'VARCHAR(50)', 'NOT NULL'],
            ['payload', 'JSONB', 'NOT NULL DEFAULT \'{}\''],
            ['created_at', 'TIMESTAMPTZ', 'NOT NULL DEFAULT NOW()'],
          ],
        },
      ],
      explanation: 'The table guarantees that every log entry receives a strictly incrementing ID and a UTC timestamp.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Create table with identity and defaults',
        code: 'CREATE TABLE audit_logs (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  action VARCHAR(50) NOT NULL,\n  user_id INT REFERENCES users(id),\n  payload JSONB NOT NULL DEFAULT \'{}\',\n  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP\n);',
        note: 'GENERATED ALWAYS AS IDENTITY is the standard ANSI replacement for legacy SERIAL.',
      },
      {
        step: 'Step 2: Create Table with IF NOT EXISTS',
        code: 'CREATE TABLE IF NOT EXISTS system_settings (\n  key VARCHAR(100) PRIMARY KEY,\n  value TEXT NOT NULL\n);',
        note: 'Prevents runtime deployment errors if the table is already present.',
      },
    ],
    rulesTable: [
      { rule: 'IF NOT EXISTS', explanation: 'Prevents SQL execution errors if an entity with the specified name already exists.' },
      { rule: 'Identity vs Serial', explanation: 'GENERATED ALWAYS AS IDENTITY conforms to SQL:2003 standards and prevents accidental manual ID overrides.' },
      { rule: 'Storage limits', explanation: 'Tables cannot exceed physical engine limits (e.g., 1600 columns in PostgreSQL).' },
    ],
    deepDive: {
      title: 'Generated (Computed) Columns',
      description: 'Modern SQL allows generated columns that automatically calculate their value from other columns, either stored on disk or virtual.',
      codeSnippet: 'CREATE TABLE invoices (\n  id INT PRIMARY KEY,\n  subtotal NUMERIC(10, 2) NOT NULL,\n  tax_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.08,\n  total NUMERIC(10, 2) GENERATED ALWAYS AS (subtotal * (1 + tax_rate)) STORED\n);',
      warning: 'Stored generated columns consume disk space but can be indexed directly with B-Trees for fast lookups.',
    },
    advantages: [
      'Guarantees data shape and schema constraints upfront.',
      'Supports identity sequencing without race conditions.',
      'Enables database engine optimizations based on known data widths.',
    ],
    disadvantages: [
      'Schema alterations on massive tables require table locks or background migrations.',
    ],
    interviewQuestions: [
      {
        question: 'Why should you prefer GENERATED ALWAYS AS IDENTITY over SERIAL in PostgreSQL?',
        answer: 'SERIAL is an internal macro that creates a separate sequence object without strict permission guards. GENERATED ALWAYS AS IDENTITY is ANSI SQL standard, prevents accidental manual inserts over identity values, and integrates cleanly with pg_dump and permissions.',
      },
      {
        question: 'What is the purpose of the IF NOT EXISTS clause in CREATE TABLE?',
        answer: 'It enables idempotent database migration scripts by skipping creation without throwing a fatal error if the table already exists.',
      },
    ],
    interviewReadyAnswer: 'The CREATE TABLE statement instantiates relational entities with typed columns, constraints, and identity defaults. Standard practice uses ANSI identity columns and appropriate storage types to optimize slotted page density.',
    quickTest: {
      question: 'Which clause prevents a migration script from crashing if a table is already present?',
      options: [
        { key: 'A', text: 'IGNORE ERROR' },
        { key: 'B', text: 'IF NOT EXISTS' },
        { key: 'C', text: 'ON DUPLICATE SKIP' },
        { key: 'D', text: 'TRY CREATE' },
      ],
      correctAnswer: 'B',
      explanation: 'CREATE TABLE IF NOT EXISTS checks the database catalog and creates the table only if no entity with that name exists.',
    },
    mentalModel: 'Architect Blueprint: Drawing the boundaries, room sizes, and specifications before construction begins.',
    codeSnippet: 'CREATE TABLE IF NOT EXISTS products (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  sku VARCHAR(30) UNIQUE NOT NULL,\n  price_cents INT CHECK (price_cents >= 0)\n);',
    takeaways: [
      'Use GENERATED ALWAYS AS IDENTITY instead of legacy SERIAL.',
      'Always specify appropriate nullability and CHECK constraints.',
      'Use IF NOT EXISTS for idempotent migration scripts.',
    ],
    commonPitfall: {
      mistake: 'Using unconstrained VARCHAR or TEXT for fixed enumerated values like status.',
      fix: 'Use a CHECK constraint (CHECK (status IN (\'active\', \'archived\'))) or an ENUM type.',
    },
    nextTopicId: 'insert-statements',
    prevTopicId: 'sql-command-types',
  },
  {
    id: 'insert-statements',
    topicNumber: 5,
    title: 'INSERT Statements',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Single row inserts, multi-row batching, INSERT INTO ... SELECT, and the RETURNING clause for atomic pipelines.',
    definition: 'The INSERT statement is a DML command used to add one or more new tuples (rows) into a database table.',
    eli5: 'INSERT is like mailing a letter into a mailbox. You fill out the address and details, drop it in, and the post office assigns it a receipt and spot.',
    realWorldExample: {
      description: 'A registration service creates new user records and needs their newly generated primary key IDs immediately.',
      tables: [
        {
          title: 'Inserted Rows',
          headers: ['id (Auto)', 'username', 'email'],
          rows: [
            [101, 'lucky', 'lucky@example.com'],
            [102, 'rahul', 'rahul@example.com'],
          ],
        },
      ],
      explanation: 'Using batch INSERT sends multiple rows in a single network round-trip.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Single Row Insert with RETURNING',
        code: 'INSERT INTO users (username, email)\nVALUES (\'lucky\', \'lucky@example.com\')\nRETURNING id, created_at;',
        note: 'Returns generated identity columns without a second SELECT query.',
      },
      {
        step: 'Step 2: Multi-row Batch Insert',
        code: 'INSERT INTO users (username, email) VALUES\n  (\'rahul\', \'rahul@example.com\'),\n  (\'amit\', \'amit@example.com\'),\n  (\'neha\', \'neha@example.com\');',
        note: 'Significantly faster than executing separate insert statements in a loop.',
      },
      {
        step: 'Step 3: INSERT INTO ... SELECT',
        code: 'INSERT INTO user_archives (id, email)\nSELECT id, email FROM users WHERE is_active = FALSE;',
        note: 'Pulls data from one table directly into another entirely within engine memory.',
      },
    ],
    rulesTable: [
      { rule: 'Column List Matching', explanation: 'Values in the VALUES list must align with the specified column order.' },
      { rule: 'Default Value Omission', explanation: 'Columns with DEFAULT or IDENTITY constraints can be omitted from the insert column list.' },
      { rule: 'Constraint Violations', explanation: 'If any single row in a multi-row insert violates a constraint, the entire statement is rolled back.' },
    ],
    deepDive: {
      title: 'Batch Inserts and Write-Ahead Log (WAL) Efficiency',
      description: 'Executing 1,000 separate INSERT statements causes 1,000 network round-trips and 1,000 transaction sync operations. A single batched INSERT statement writes all tuples in one go, drastically reducing disk flush overhead.',
      codeSnippet: '-- Slow (1000 round-trips):\n-- INSERT INTO t VALUES (1); INSERT INTO t VALUES (2); ...\n\n-- Fast (1 round-trip):\nINSERT INTO t (val) VALUES (1), (2), (3), (4), (5);',
      warning: 'Extremely large batch inserts (e.g. 100,000 rows in one statement) can hit parameter limits or memory thresholds; batch in chunks of 1,000 to 5,000.',
    },
    advantages: [
      'Batching minimizes network round-trips and WAL lock contention.',
      'RETURNING clause provides instant access to auto-generated columns.',
      'INSERT INTO SELECT allows bulk data transformation without application middleware.',
    ],
    disadvantages: [
      'A single failing row in a batch statement cancels all other rows unless handled with ON CONFLICT.',
    ],
    interviewQuestions: [
      {
        question: 'What is the performance advantage of multi-row INSERT over individual statements?',
        answer: 'Multi-row inserts bundle multiple tuples into a single query parse tree, single network round-trip, and single WAL transaction flush, providing 10x-50x higher throughput.',
      },
      {
        question: 'What does the RETURNING clause do in PostgreSQL?',
        answer: 'It causes the INSERT, UPDATE, or DELETE command to return specific column values (such as generated IDs or calculated columns) for every affected row, avoiding a second SELECT round-trip.',
      },
    ],
    interviewReadyAnswer: 'The INSERT statement writes new rows to a table. High-performance applications use multi-row batched inserts to minimize network latency and leverage the RETURNING clause to atomically capture database-generated keys.',
    quickTest: {
      question: 'What happens if the 3rd row in a 5-row batch INSERT violates a UNIQUE constraint?',
      options: [
        { key: 'A', text: 'Rows 1, 2, 4, and 5 are inserted; row 3 is skipped.' },
        { key: 'B', text: 'The entire statement fails and no rows are inserted.' },
        { key: 'C', text: 'Row 3 is inserted with a NULL value.' },
        { key: 'D', text: 'The database terminates the client connection immediately.' },
      ],
      correctAnswer: 'B',
      explanation: 'SQL statements are atomic by default: if any single row fails constraint validation, the entire statement aborts and rolls back.',
    },
    mentalModel: 'Loading a pallet: Put 50 boxes on one pallet and ship it across the warehouse once, rather than driving 50 individual round-trips.',
    codeSnippet: 'INSERT INTO users (username, email)\nVALUES (\'lucky\', \'lucky@test.com\')\nRETURNING id, created_at;',
    takeaways: [
      'Batch insert multiple rows in a single query for maximum throughput.',
      'Use RETURNING to read back auto-generated primary keys without extra queries.',
      'INSERT statements are atomic; any row failure rolls back the entire batch.',
    ],
    commonPitfall: {
      mistake: 'Inserting records in a procedural for-loop over the network, incurring high latency.',
      fix: 'Accumulate rows and execute a single batched multi-row INSERT.',
    },
    nextTopicId: 'select-statements',
    prevTopicId: 'create-statements',
  },
  {
    id: 'select-statements',
    topicNumber: 6,
    title: 'SELECT Statements',
    category: 'query-execution',
    difficulty: 'Beginner',
    summary: 'SELECT projections, column aliases, scalar expressions, arithmetic transformations, and the logical query execution order.',
    definition: 'The SELECT statement is the foundational DQL command used to project and retrieve data from one or more tables or views.',
    eli5: 'SELECT is like a custom photo filter. You have a huge photo album (the table), and SELECT lets you pick exactly which faces (columns) you want to see on your screen.',
    realWorldExample: {
      description: 'An analytics dashboard displays total employee compensation including base salary and bonuses.',
      tables: [
        {
          title: 'Employees',
          headers: ['id', 'first_name', 'salary', 'bonus_percent'],
          rows: [
            [1, 'Alice', '100000', '0.10'],
            [2, 'Bob', '80000', '0.05'],
          ],
        },
      ],
      explanation: 'The query calculates total compensation on the fly and aliases the result.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Column projection and aliasing',
        code: 'SELECT\n  first_name AS employee_name,\n  salary,\n  (salary * bonus_percent) AS bonus_amount,\n  salary + (salary * bonus_percent) AS total_compensation\nFROM employees;',
        note: 'Expressions in the SELECT list transform raw column values into calculated fields.',
      },
      {
        step: 'Step 2: Selecting literal constants and system functions',
        code: 'SELECT 42 AS answer, CURRENT_DATE AS today, UPPER(\'hello\') AS greeting;',
        note: 'SELECT can evaluate scalar expressions without querying any table.',
      },
    ],
    rulesTable: [
      { rule: 'Avoid SELECT * in Production', explanation: 'SELECT * fetches unneeded columns, breaks covering index scans, and risks application failure when columns change.' },
      { rule: 'Logical Execution Order', explanation: 'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT. Aliases defined in SELECT are not visible in WHERE.' },
      { rule: 'Column Aliases with Spaces', explanation: 'Aliases with spaces or special characters must be wrapped in double quotes: "Total Compensation".' },
    ],
    deepDive: {
      title: 'Why SELECT * Destroys Index-Only Scans',
      description: 'When an index contains all requested columns (e.g. index on (user_id, status)), the engine reads directly from the index leaves (Index-Only Scan). If you write SELECT *, the engine must perform costly heap disk lookups for every matching row.',
      codeSnippet: '-- Fast Index-Only Scan:\nSELECT user_id, status FROM users WHERE user_id = 42;\n\n-- Slow Table Heap Scan (because of SELECT *):\nSELECT * FROM users WHERE user_id = 42;',
      warning: 'Never use SELECT * in production API endpoints or latency-critical paths.',
    },
    advantages: [
      'Fine-grained control over network payload size.',
      'Supports on-the-fly mathematical and text transformations.',
      'Enables covering index optimizations when projecting specific columns.',
    ],
    disadvantages: [
      'Writing SELECT * transfers unused data over the wire and wastes buffer cache.',
    ],
    interviewQuestions: [
      {
        question: 'Why can you not use a column alias defined in SELECT inside the WHERE clause?',
        answer: 'Because the WHERE clause is evaluated before the SELECT clause in the logical query processing order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT). At the time WHERE filters rows, the projection aliases do not exist yet.',
      },
      {
        question: 'What is the logical order of query processing in SQL?',
        answer: '1. FROM/JOIN, 2. WHERE, 3. GROUP BY, 4. HAVING, 5. SELECT, 6. DISTINCT, 7. ORDER BY, 8. LIMIT/OFFSET.',
      },
    ],
    interviewReadyAnswer: 'The SELECT statement projects and computes columns from relational sets. In production systems, explicit column projection is mandatory to preserve network bandwidth and enable database Index-Only Scans.',
    quickTest: {
      question: 'Why does the query "SELECT salary * 2 AS double_sal FROM emp WHERE double_sal > 50000" fail in standard SQL?',
      options: [
        { key: 'A', text: 'You cannot multiply numbers in SQL.' },
        { key: 'B', text: 'WHERE evaluates before SELECT in the logical execution order, so double_sal is not yet known.' },
        { key: 'C', text: 'Column aliases must be capitalized.' },
        { key: 'D', text: 'The AS keyword is deprecated in ANSI SQL.' },
      ],
      correctAnswer: 'B',
      explanation: 'WHERE filters rows before the SELECT projection step runs, meaning aliases created in SELECT cannot be resolved inside WHERE.',
    },
    mentalModel: 'Filtering Camera: Only capture the specific objects you want in the frame, rather than taking a panoramic shot of the entire city and throwing away 90% of it.',
    codeSnippet: 'SELECT u.name, (u.balance * 1.05) AS projected_balance\nFROM users u\nWHERE u.status = \'active\';',
    takeaways: [
      'Always project explicit column names; never use SELECT * in production.',
      'Logical query execution order explains alias visibility rules.',
      'Selective projection enables B-Tree Index-Only scans without heap lookups.',
    ],
    commonPitfall: {
      mistake: 'Using SELECT * in backend API queries, pulling heavy BLOB/TEXT columns unintentionally.',
      fix: 'Explicitly specify only the needed columns in the SELECT clause.',
    },
    nextTopicId: 'where-clause',
    prevTopicId: 'insert-statements',
  },
  {
    id: 'where-clause',
    topicNumber: 7,
    title: 'WHERE Clause',
    category: 'query-execution',
    difficulty: 'Beginner',
    summary: 'Filtering tuples using comparison operators, predicate sargability, and avoiding unindexed function scans.',
    definition: 'The WHERE clause specifies search conditions (predicates) that filter rows before any grouping or aggregation takes place.',
    eli5: 'WHERE is a security guard at a club door. Only guests with valid IDs and correct dress codes are allowed inside; everyone else is filtered out immediately.',
    realWorldExample: {
      description: 'Filtering active subscribers whose account balance is greater than zero.',
      tables: [
        {
          title: 'Accounts',
          headers: ['id', 'user_id', 'status', 'balance'],
          rows: [
            [1, 101, 'active', '45.00'],
            [2, 102, 'suspended', '0.00'],
            [3, 103, 'active', '120.00'],
          ],
        },
      ],
      explanation: 'WHERE filters out row 2 because its status is not active.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Filtering with comparison operators',
        code: 'SELECT id, user_id, balance\nFROM accounts\nWHERE status = \'active\' AND balance > 0.00;',
        note: 'Only rows where both conditions evaluate to TRUE are returned.',
      },
      {
        step: 'Step 2: Checking multiple criteria with parentheses',
        code: 'SELECT id, user_id\nFROM accounts\nWHERE (status = \'active\' OR status = \'trial\')\n  AND balance >= 10.00;',
        note: 'Parentheses clarify evaluation order when mixing AND and OR.',
      },
    ],
    rulesTable: [
      { rule: 'Boolean Evaluation', explanation: 'WHERE returns rows where the condition evaluates strictly to TRUE (discarding FALSE and UNKNOWN).' },
      { rule: 'Sargability', explanation: 'Predicates must be Search Argument Able (sargable) so the optimizer can traverse B-Tree index pages directly.' },
      { rule: 'Aggregates Forbidden', explanation: 'Aggregate functions (like COUNT or SUM) cannot be used in WHERE; use HAVING instead.' },
    ],
    deepDive: {
      title: 'Sargability and B-Tree Index Invalidation',
      description: 'Wrapping an indexed column inside a function prevents the database from using a B-Tree index, forcing a full sequential scan of the table.',
      codeSnippet: '-- Non-sargable (SLOW - scans entire table):\nWHERE EXTRACT(YEAR FROM created_at) = 2026;\n\n-- Sargable (FAST - uses B-Tree range scan):\nWHERE created_at >= \'2026-01-01\' AND created_at < \'2027-01-01\';',
      warning: 'Never apply functions to column names on the left side of comparison operators in WHERE.',
    },
    advantages: [
      'Filters unneeded rows before expensive grouping, sorting, or joins.',
      'Allows B-Tree index scans to jump directly to matching leaf pages.',
      'Reduces working memory (work_mem) consumption.',
    ],
    disadvantages: [
      'Poorly structured non-sargable predicates degrade queries into slow full table scans.',
    ],
    interviewQuestions: [
      {
        question: 'What is a sargable query?',
        answer: 'A query is sargable (Search Argument Able) when the database optimizer can use an index to evaluate the filter condition. Applying functions or calculations to column names (e.g. WHERE UPPER(name) = "ALICE") makes it non-sargable unless an expression index exists.',
      },
      {
        question: 'What happens when a WHERE condition evaluates to UNKNOWN due to a NULL value?',
        answer: 'The row is discarded. In SQL Three-Valued Logic, the WHERE clause only retains rows where the predicate evaluates strictly to TRUE.',
      },
    ],
    interviewReadyAnswer: 'The WHERE clause filters rows using search predicates prior to grouping. High-performance queries keep predicates sargable by comparing isolated column names against constants, allowing B-Tree indexes to perform logarithmic point lookups.',
    quickTest: {
      question: 'Which WHERE clause is sargable and can efficiently utilize a standard B-Tree index on created_at?',
      options: [
        { key: 'A', text: 'WHERE DATE(created_at) = \'2026-05-01\'' },
        { key: 'B', text: 'WHERE created_at >= \'2026-05-01 00:00:00\' AND created_at < \'2026-05-02 00:00:00\'' },
        { key: 'C', text: 'WHERE TO_CHAR(created_at, \'YYYY-MM-DD\') = \'2026-05-01\'' },
        { key: 'D', text: 'WHERE EXTRACT(DAY FROM created_at) = 1' },
      ],
      correctAnswer: 'B',
      explanation: 'Option B compares the bare indexed column against literal bounds, enabling a direct B-Tree index range scan.',
    },
    mentalModel: 'Security checkpoint: Guests are filtered at the gate based on ticket criteria before entering the venue.',
    codeSnippet: 'SELECT id, name, balance\nFROM users\nWHERE status = \'active\' AND created_at >= \'2026-01-01\';',
    takeaways: [
      'WHERE filters rows before GROUP BY and aggregations.',
      'Only predicates that evaluate to TRUE are kept (FALSE and UNKNOWN are discarded).',
      'Keep predicates sargable by avoiding function wrappers on indexed columns.',
    ],
    commonPitfall: {
      mistake: 'Writing WHERE UPPER(email) = \'TEST@EXAMPLE.COM\', which disables the standard index on email.',
      fix: 'Use an expression index (CREATE INDEX ON users(UPPER(email))) or store normalized lowercase emails.',
    },
    nextTopicId: 'update-statements',
    prevTopicId: 'select-statements',
  },
  {
    id: 'update-statements',
    topicNumber: 8,
    title: 'UPDATE Statements',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Mutating column values, multi-column updates, WHERE safety guards, RETURNING, and MVCC tuple versioning.',
    definition: 'The UPDATE statement is a DML command that modifies existing column values in one or more table rows matching a search condition.',
    eli5: 'UPDATE is like using white-out and a pen on an existing form. You locate the exact file by ID, erase the old number, and write the new value.',
    realWorldExample: {
      description: 'An e-commerce customer upgrades their shipping address and receives a confirmation receipt.',
      tables: [
        {
          title: 'Before Update',
          headers: ['id', 'user_id', 'status'],
          rows: [[101, 1, 'pending']],
        },
        {
          title: 'After Update',
          headers: ['id', 'user_id', 'status'],
          rows: [[101, 1, 'shipped']],
        },
      ],
      explanation: 'The order status mutates from pending to shipped in an atomic transaction.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Targeted update with WHERE and RETURNING',
        code: 'UPDATE orders\nSET status = \'shipped\', shipped_at = CURRENT_TIMESTAMP\nWHERE id = 101 AND status = \'pending\'\nRETURNING id, status, shipped_at;',
        note: 'Guards ensure you only transition valid pending orders.',
      },
      {
        step: 'Step 2: Multi-column calculated update',
        code: 'UPDATE accounts\nSET balance = balance - 25.00, updated_at = NOW()\nWHERE id = 42;',
        note: 'Relative updates prevent overwriting concurrent balance changes.',
      },
    ],
    rulesTable: [
      { rule: 'Mandatory WHERE Clause', explanation: 'An UPDATE statement without a WHERE clause updates every single row in the table.' },
      { rule: 'Row-Level Exclusive Locks', explanation: 'The database acquires an exclusive row lock on every updated row until COMMIT or ROLLBACK.' },
      { rule: 'Constraint Re-check', explanation: 'All foreign key, check, and type constraints are validated for updated values.' },
    ],
    deepDive: {
      title: 'MVCC: In-Place Overwrites vs New Tuple Versions',
      description: 'Under Multi-Version Concurrency Control (MVCC) in PostgreSQL, an UPDATE does NOT overwrite the old row in place. Instead, it marks the old tuple header (t_xmax = current_tx) and writes a brand new tuple (t_xmin = current_tx) into the page.',
      codeSnippet: '-- Behind the scenes in Postgres page:\n-- Tuple 1: [xmin: 100, xmax: 105 (expired), data: "pending"]\n-- Tuple 2: [xmin: 105, xmax: 0 (current), data: "shipped"]',
      warning: 'Updating indexed columns generates index churn and page bloat until VACUUM cleans old versions.',
    },
    advantages: [
      'In-place transactional state transitions.',
      'Supports mathematical relative increments without client-side state round-trips.',
      'RETURNING clause confirms updated state instantly.',
    ],
    disadvantages: [
      'Forgetting the WHERE clause accidentally mutates the entire table.',
      'Heavy updates can cause table bloat and high write amplification.',
    ],
    interviewQuestions: [
      {
        question: 'How does PostgreSQL execute an UPDATE under MVCC?',
        answer: 'PostgreSQL treats UPDATE as a logical DELETE followed by an INSERT. It sets t_xmax on the old tuple to the current transaction ID and inserts a new tuple with t_xmin set to the current transaction ID.',
      },
      {
        question: 'How do you prevent lost update anomalies during concurrent updates?',
        answer: 'Use atomic relative expressions (SET balance = balance + 10), optimistic concurrency with version columns (WHERE version = 5), or explicit locking with SELECT ... FOR UPDATE.',
      },
    ],
    interviewReadyAnswer: 'The UPDATE statement mutates existing rows matching a filter predicate. Under relational MVCC engines, updates create new row versions while locking updated records until transaction completion.',
    quickTest: {
      question: 'What happens if you run "UPDATE users SET status = \'inactive\';" without a WHERE clause?',
      options: [
        { key: 'A', text: 'The query fails with a syntax error.' },
        { key: 'B', text: 'Only the first row in the table is updated.' },
        { key: 'C', text: 'Every row in the users table is updated to inactive.' },
        { key: 'D', text: 'Only rows where status is NULL are updated.' },
      ],
      correctAnswer: 'C',
      explanation: 'Without a WHERE clause, UPDATE operates unconditionally on every row in the target table.',
    },
    mentalModel: 'Form Revision: Cross out the old line, stamp the expiration time on it, and append the new revised record.',
    codeSnippet: 'UPDATE users\nSET balance = balance + 100.00, updated_at = NOW()\nWHERE id = 42\nRETURNING id, balance;',
    takeaways: [
      'Always verify WHERE conditions before executing UPDATE statements.',
      'PostgreSQL MVCC writes a new tuple version for every updated row.',
      'Relative expressions like balance = balance + 10 prevent race conditions.',
    ],
    commonPitfall: {
      mistake: 'Fetching a value into application code, adding 10 in memory, and writing it back, causing lost updates under high concurrency.',
      fix: 'Perform atomic in-database updates: UPDATE t SET count = count + 1 WHERE id = 1.',
    },
    nextTopicId: 'delete-statements',
    prevTopicId: 'where-clause',
  },
  {
    id: 'delete-statements',
    topicNumber: 9,
    title: 'DELETE Statements',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Row deletion mechanics, WHERE safeguards, DELETE RETURNING, cascading constraints, and DELETE vs TRUNCATE differences.',
    definition: 'The DELETE statement is a DML command that removes one or more rows from a table based on a predicate, firing triggers and maintaining transactional rollback capability.',
    eli5: 'DELETE is like taking an individual piece of paper out of a filing folder and putting it in the shredder. The folder stays, but that specific sheet is gone.',
    realWorldExample: {
      description: 'An application deletes expired session tokens older than 30 days.',
      tables: [
        {
          title: 'User Sessions',
          headers: ['token', 'user_id', 'expires_at'],
          rows: [
            ['tok_111', 1, '2026-01-01 (Expired)'],
            ['tok_222', 2, '2026-12-31 (Active)'],
          ],
        },
      ],
      explanation: 'DELETE removes tok_111 while keeping tok_222 intact.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Targeted DELETE with WHERE',
        code: 'DELETE FROM user_sessions\nWHERE expires_at < CURRENT_TIMESTAMP;',
        note: 'Only expired sessions are targeted.',
      },
      {
        step: 'Step 2: DELETE with RETURNING',
        code: 'DELETE FROM orders\nWHERE status = \'cancelled\' AND created_at < NOW() - INTERVAL \'90 days\'\nRETURNING id, user_id, total_usd;',
        note: 'Allows the application to log deleted records to an external archive.',
      },
    ],
    rulesTable: [
      { rule: 'Missing WHERE Clause', explanation: 'DELETE FROM table_name without WHERE deletes all rows in the table row-by-row.' },
      { rule: 'Foreign Key Enforcement', explanation: 'If a deleted row is referenced by child tables, deletion fails unless ON DELETE CASCADE or SET NULL is configured.' },
      { rule: 'Trigger Activation', explanation: 'DELETE activates BEFORE DELETE and AFTER DELETE triggers for every removed row.' },
    ],
    deepDive: {
      title: 'DELETE vs TRUNCATE Architecture',
      description: 'DELETE scans rows, checks visibility, acquires row locks, generates full WAL records, and marks tuples dead. TRUNCATE is a DDL command that instantly resets the table file on disk (allocating new empty disk fork), which is orders of magnitude faster.',
      codeSnippet: '-- Slow for millions of rows (logged row-by-row):\nDELETE FROM large_logs;\n\n-- Instant (deallocates storage pages directly):\nTRUNCATE TABLE large_logs;',
      warning: 'TRUNCATE cannot be filtered with a WHERE clause; it always empties the entire table.',
    },
    advantages: [
      'Precise row targeting via standard WHERE predicates.',
      'Supports transactional ROLLBACK if mistakes occur.',
      'RETURNING clause captures deleted records for audit archives.',
    ],
    disadvantages: [
      'Deleting millions of rows creates massive WAL generation and table page fragmentation.',
    ],
    interviewQuestions: [
      {
        question: 'What are the main differences between DELETE, TRUNCATE, and DROP?',
        answer: 'DELETE is a DML command that removes filtered rows one by one, is logged in WAL, and fires triggers. TRUNCATE is DDL that quickly deallocates all pages from a table without firing row triggers. DROP removes the table definition, schema, and all data completely from the database catalog.',
      },
      {
        question: 'Does DELETE immediately free up disk space in PostgreSQL?',
        answer: 'No. In PostgreSQL, DELETE marks tuples as dead (setting t_xmax). The physical disk space is only reclaimed for reuse by VACUUM, and returned to the OS via VACUUM FULL.',
      },
    ],
    interviewReadyAnswer: 'The DELETE statement removes filtered rows while logging each change and checking foreign key referential integrity. In high-volume systems, TRUNCATE is preferred for bulk wipes, while soft-deletes (is_deleted = true) are often used to preserve audit history.',
    quickTest: {
      question: 'Why does TRUNCATE execute significantly faster than DELETE on a 10-million row table?',
      options: [
        { key: 'A', text: 'TRUNCATE bypasses database authentication.' },
        { key: 'B', text: 'TRUNCATE deallocates disk data pages directly without scanning rows or logging each row deletion.' },
        { key: 'C', text: 'TRUNCATE only works on memory tables.' },
        { key: 'D', text: 'TRUNCATE converts all rows into binary files.' },
      ],
      correctAnswer: 'B',
      explanation: 'TRUNCATE is a DDL operation that deallocates storage extents directly rather than visiting and logging individual rows.',
    },
    mentalModel: 'Shredding documents: DELETE shreds individual sheets of paper one by one; TRUNCATE empties the entire recycling bin in a single dump.',
    codeSnippet: 'DELETE FROM cart_items\nWHERE cart_id = 99\nRETURNING id, product_id;',
    takeaways: [
      'Always double-check WHERE filters before issuing DELETE.',
      'DELETE generates WAL records for each deleted row; TRUNCATE deallocates pages.',
      'Dead tuples from DELETE require VACUUM to reclaim storage space.',
    ],
    commonPitfall: {
      mistake: 'Using DELETE in a script to wipe huge staging tables, saturating transaction logs and disk I/O.',
      fix: 'Use TRUNCATE TABLE for fast and clean table resets.',
    },
    nextTopicId: 'distinct-and-limit',
    prevTopicId: 'update-statements',
  },
  {
    id: 'distinct-and-limit',
    topicNumber: 10,
    title: 'DISTINCT & LIMIT',
    category: 'query-execution',
    difficulty: 'Beginner',
    summary: 'Eliminating duplicate rows with DISTINCT, PostgreSQL DISTINCT ON, and deterministic paging with LIMIT and OFFSET.',
    definition: 'DISTINCT deduplicates matching rows from query results, while LIMIT and OFFSET restrict the quantity and starting position of returned tuples.',
    eli5: 'DISTINCT is a duplicate filter: if you have five red marbles, it only hands you one. LIMIT is a plate size: no matter how much food is cooked, it only gives you 10 pieces.',
    realWorldExample: {
      description: 'An application fetches the top 5 countries where customers reside without duplicates.',
      tables: [
        {
          title: 'Users Table',
          headers: ['id', 'name', 'country'],
          rows: [
            [1, 'Alice', 'India'],
            [2, 'Bob', 'USA'],
            [3, 'Charlie', 'India'],
            [4, 'David', 'USA'],
            [5, 'Eve', 'Germany'],
          ],
        },
      ],
      explanation: 'SELECT DISTINCT country produces: India, USA, Germany.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Deduplicating values with DISTINCT',
        code: 'SELECT DISTINCT country FROM users ORDER BY country;',
        note: 'Sorts or hashes values in memory to discard duplicates.',
      },
      {
        step: 'Step 2: Pagination with LIMIT and OFFSET',
        code: 'SELECT id, name, created_at\nFROM users\nORDER BY created_at DESC\nLIMIT 10 OFFSET 20;',
        note: 'Always combine LIMIT with ORDER BY for deterministic results.',
      },
      {
        step: 'Step 3: PostgreSQL DISTINCT ON',
        code: 'SELECT DISTINCT ON (user_id) user_id, order_date, total_usd\nFROM orders\nORDER BY user_id, order_date DESC;',
        note: 'Returns the single most recent order for each user.',
      },
    ],
    rulesTable: [
      { rule: 'ORDER BY Requirement', explanation: 'LIMIT without ORDER BY produces non-deterministic results because relational engines do not guarantee physical row order.' },
      { rule: 'All-Column Scope', explanation: 'SELECT DISTINCT a, b deduplicates unique combinations of (a, b), not just column a.' },
      { rule: 'OFFSET Scaling Penalty', explanation: 'OFFSET 10000 forces the engine to compute and discard 10,000 rows before returning results.' },
    ],
    deepDive: {
      title: 'Offset Paging vs Keyset (Cursor) Pagination',
      description: 'OFFSET pagination gets progressively slower on deep pages because the database must scan all preceding rows. Keyset pagination uses indexed WHERE conditions to achieve constant O(1) page lookup times.',
      codeSnippet: '-- Bad for deep pages (O(N) cost):\nSELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 50000;\n\n-- Good Keyset Pagination (O(log N) index seek):\nSELECT * FROM orders WHERE id > 50000 ORDER BY id LIMIT 20;',
      warning: 'Never use high OFFSET values on multi-million row tables in production APIs.',
    },
    advantages: [
      'DISTINCT eliminates unwanted duplicate records from reports.',
      'LIMIT protects network bandwidth and API response sizes.',
      'DISTINCT ON cleanly solves "greatest-n-per-group" query problems.',
    ],
    disadvantages: [
      'DISTINCT triggers expensive in-memory sort or hash operations.',
      'High OFFSET queries cause high disk I/O and CPU waste.',
    ],
    interviewQuestions: [
      {
        question: 'Why is keyset (cursor) pagination preferred over OFFSET pagination for large datasets?',
        answer: 'OFFSET N requires the database to generate and discard N rows, causing O(N) execution time. Keyset pagination filters by an indexed column (e.g. WHERE id > last_seen_id ORDER BY id LIMIT 20), allowing direct B-Tree point lookup in O(log N) time.',
      },
      {
        question: 'How does PostgreSQL DISTINCT ON work?',
        answer: 'DISTINCT ON (col) keeps only the first row for each distinct value of col based on the specified ORDER BY expression, making it easy to fetch the latest event per entity.',
      },
    ],
    interviewReadyAnswer: 'DISTINCT removes duplicate tuples using in-memory hash or sort aggregates, while LIMIT bounds response sizes. To maintain deterministic paging and sub-millisecond latency, always combine LIMIT with ORDER BY and use keyset pagination instead of high OFFSETs.',
    quickTest: {
      question: 'What is the primary drawback of using high OFFSET values (e.g. OFFSET 100000) for API pagination?',
      options: [
        { key: 'A', text: 'OFFSET is not supported in PostgreSQL.' },
        { key: 'B', text: 'The database must still scan and discard the first 100,000 rows, wasting memory and CPU.' },
        { key: 'C', text: 'OFFSET automatically locks the table.' },
        { key: 'D', text: 'OFFSET inverts the sort order of the results.' },
      ],
      correctAnswer: 'B',
      explanation: 'OFFSET N requires the query engine to evaluate and throw away the first N rows before returning the requested slice.',
    },
    mentalModel: 'Line at an amusement park: LIMIT 5 lets the first 5 people in; OFFSET 100 makes the guard count 100 people and throw them out before letting the next 5 enter.',
    codeSnippet: 'SELECT DISTINCT country FROM users ORDER BY country;\nSELECT * FROM users ORDER BY id DESC LIMIT 10 OFFSET 0;',
    takeaways: [
      'DISTINCT operates across all projected columns.',
      'Always pair LIMIT with an unambiguous ORDER BY.',
      'Use keyset pagination (WHERE id > last_id) instead of high OFFSET values.',
    ],
    commonPitfall: {
      mistake: 'Using LIMIT without an ORDER BY clause, causing inconsistent row sequences between requests.',
      fix: 'Always provide an explicit, unique ORDER BY column when using LIMIT.',
    },
    nextTopicId: 'sql-operators',
    prevTopicId: 'delete-statements',
  },
];
