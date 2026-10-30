import { SqlTopic } from './types';

export const TOPICS_1_TO_10: SqlTopic[] = [
  {
    "id": "intro-to-sql",
    "topicNumber": 1,
    "title": "Introduction to SQL",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Core relational concepts, Structured Query Language (SQL) vs NoSQL document/key-value stores, RDBMS guarantees, and standard database use cases.",
    "definition": "SQL (Structured Query Language) is the standard declarative programming language used to manage, query, and manipulate data stored in a Relational Database Management System (RDBMS).",
    "eli5": "Think of an Excel workbook with rigid tabs that link to each other by ID numbers. SQL is the universal language you use to ask questions and update data in that workbook without opening it by hand.",
    "realWorldExample": {
      "description": "An e-commerce store needs consistent order records. A customer placed an order with items, inventory amounts, and payment status.",
      "tables": [
        {
          "title": "Users",
          "headers": [
            "id (PK)",
            "email",
            "country"
          ],
          "rows": [
            [
              1,
              "lucky@example.com",
              "India"
            ],
            [
              2,
              "rahul@example.com",
              "Germany"
            ]
          ]
        },
        {
          "title": "Orders",
          "headers": [
            "id (PK)",
            "user_id (FK)",
            "total_usd"
          ],
          "rows": [
            [
              101,
              1,
              "120.00"
            ],
            [
              102,
              2,
              "85.50"
            ]
          ]
        }
      ],
      "explanation": "SQL ensures every order references a real user and financial balances balance out deterministically."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Check database version and current timestamp",
        "code": "SELECT version(), CURRENT_TIMESTAMP;",
        "note": "Returns the database engine distribution (e.g. PostgreSQL, MySQL) and server clock."
      },
      {
        "step": "Step 2: Simple declarative relational query",
        "code": "SELECT id, email FROM users WHERE country = 'India';",
        "note": "You declare WHAT data you want; the engine optimizer chooses HOW to retrieve it."
      }
    ],
    "rulesTable": [
      {
        "rule": "Declarative semantics",
        "explanation": "Queries specify what dataset is required, not procedural loop steps."
      },
      {
        "rule": "ANSI standard compliance",
        "explanation": "Core syntax works across PostgreSQL, MySQL, SQLite, Oracle, and SQL Server."
      },
      {
        "rule": "Schema enforcement",
        "explanation": "Every column must adhere to a designated type (e.g., INT, VARCHAR, TIMESTAMP)."
      },
      {
        "rule": "Set-based execution",
        "explanation": "Relational operations process entire sets of tuples simultaneously rather than one record at a time."
      },
      {
        "rule": "ACID guarantees",
        "explanation": "Relational engines guarantee Atomicity, Consistency, Isolation, and Durability."
      }
    ],
    "deepDive": {
      "title": "SQL vs NoSQL Storage Paradigms",
      "description": "RDBMS engines prioritize ACID transactions and normalized relational schemas. NoSQL systems (Document, Key-Value, Columnar) prioritize schema flexibility and horizontal partition scaling at the expense of strict cross-entity constraints.",
      "codeSnippet": "-- SQL: Strict relational join\nSELECT u.email, o.total_usd\nFROM users u\nJOIN orders o ON u.id = o.user_id;\n\n// NoSQL Document (MongoDB JSON embed):\n// { \"_id\": 101, \"user_email\": \"lucky@example.com\", \"total_usd\": 120.00 }",
      "warning": "Do not use NoSQL when you require multi-entity relational integrity and complex financial reporting."
    },
    "advantages": [
      "Declarative syntax: no manual file pointers or low-level loops.",
      "Strict schema enforcement guarantees data shape and type safety.",
      "ACID guarantees prevent corrupted balances or ghost transactions."
    ],
    "disadvantages": [
      "Rigid schema migrations require structured ALTER TABLE processes.",
      "Horizontal sharding across thousands of servers is more complex than simple document stores."
    ],
    "interviewQuestions": [
      {
        "question": "What is the fundamental difference between declarative and procedural languages?",
        "answer": "In procedural languages (like C or Python), you write explicit step-by-step algorithms and loops. In SQL (declarative), you specify the desired output condition and relations, leaving algorithm selection to the Cost-Based Optimizer (CBO)."
      },
      {
        "question": "When should you choose SQL over a NoSQL database?",
        "answer": "Choose SQL when data is relational, requires foreign key consistency, structured financial ledger accuracy, complex joins, or strict ACID compliance."
      },
      {
        "question": "What is the logical query processing order in SQL vs physical execution order?",
        "answer": "Logically, SQL processes queries in this order: FROM -> ON -> JOIN -> WHERE -> GROUP BY -> WITH CUBE/ROLLUP -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT/OFFSET. However, the physical engine optimizer can reorder steps as long as the mathematical result is identical."
      },
      {
        "question": "What is an RDBMS and how does Codd’s Relational Algebra form its basis?",
        "answer": "A Relational Database Management System is software that stores data in mathematical relations (tables). Edgar F. Codd defined relational algebra with fundamental operators: Selection (σ, filtering rows), Projection (π, choosing columns), Cartesian Product (×), Set Union (∪), and Set Difference (−). SQL is the concrete declarative syntax representing these operations."
      },
      {
        "question": "Why are procedural cursors and loops considered an antipattern in SQL?",
        "answer": "Relational engines are heavily optimized for set-based operations using SIMD vectorization, index lookups, and batch buffer page reads. Procedural cursors force row-by-row context switching between the procedural runtime and relational engine, destroying cache locality and increasing query time by 10x to 100x."
      }
    ],
    "interviewReadyAnswer": "SQL is the standard declarative query language for relational databases. It allows engineers to describe required datasets while the database optimizer figures out the optimal disk access path and join algorithm, providing ACID consistency and referential integrity.",
    "quickTest": {
      "question": "Which of the following describes why SQL is considered a declarative language?",
      "options": [
        {
          "key": "A",
          "text": "You must write for-loops to iterate through disk pages."
        },
        {
          "key": "B",
          "text": "You specify what data you want, and the database optimizer decides how to fetch it."
        },
        {
          "key": "C",
          "text": "It only runs on cloud-native hardware."
        },
        {
          "key": "D",
          "text": "It compiles directly to x86 assembly at runtime without a query planner."
        }
      ],
      "correctAnswer": "B",
      "explanation": "SQL is declarative because developers declare the target criteria (SELECT, WHERE, JOIN) and the Cost-Based Optimizer chooses the physical execution plan."
    },
    "mentalModel": "Flight Planner: You declare your departure and destination, and the air traffic system plans the most efficient route.",
    "codeSnippet": "SELECT u.email, o.total_usd\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.total_usd > 100.00;",
    "takeaways": [
      "SQL is declarative: specify WHAT, not HOW.",
      "RDBMS engines guarantee ACID transactional integrity.",
      "Schemas enforce uniform column data types across all rows."
    ],
    "commonPitfall": {
      "mistake": "Treating SQL like procedural code by writing cursor loops instead of set-based declarative queries.",
      "fix": "Use set-based joins, filters, and aggregations rather than row-by-row procedural cursors."
    },
    "nextTopicId": "database-and-tables"
  },
  {
    "id": "database-and-tables",
    "topicNumber": 2,
    "title": "Database & Tables",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Relational database architecture: schemas, tables, columns, slotted page row storage, primary keys, and relationships.",
    "definition": "A database is an organized container of schemas, while a table is a structured collection of rows (records) and columns (attributes) representing an entity.",
    "eli5": "A database is a giant filing cabinet. Each drawer is a schema, each folder is a table, each sheet of paper is a row, and each form field on that paper is a column.",
    "realWorldExample": {
      "description": "A university system stores students and courses.",
      "tables": [
        {
          "title": "Students Table",
          "headers": [
            "id",
            "first_name",
            "gpa",
            "enrolled_at"
          ],
          "rows": [
            [
              1,
              "Alice",
              "3.85",
              "2024-09-01"
            ],
            [
              2,
              "Bob",
              "3.40",
              "2024-09-01"
            ]
          ]
        }
      ],
      "explanation": "Every row represents a unique student; every column has a strict type (e.g. gpa is NUMERIC(3,2))."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Create a dedicated schema",
        "code": "CREATE SCHEMA IF NOT EXISTS university;",
        "note": "Namespaces keep tables organized and avoid naming collisions."
      },
      {
        "step": "Step 2: Create a structured table",
        "code": "CREATE TABLE university.students (\n  id INT PRIMARY KEY,\n  first_name VARCHAR(50) NOT NULL,\n  gpa NUMERIC(3, 2) CHECK (gpa >= 0.0 AND gpa <= 4.0),\n  enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE\n);",
        "note": "Columns enforce strict types, default values, and domain integrity rules."
      }
    ],
    "rulesTable": [
      {
        "rule": "Column Homogeneity",
        "explanation": "All values in a column must match the defined data type."
      },
      {
        "rule": "Row Uniqueness",
        "explanation": "Every row should be uniquely identifiable via a Primary Key."
      },
      {
        "rule": "Atomic Values",
        "explanation": "First Normal Form requires that cells contain single scalar values, not nested arrays or unparsed text."
      },
      {
        "rule": "Unordered heap storage",
        "explanation": "Standard tables are heaps: rows are placed into any available 8 KB page slot with free space."
      },
      {
        "rule": "Maximum tuple size (TOAST)",
        "explanation": "Attributes exceeding ~2 KB are compressed and stored out-of-line in secondary TOAST tables."
      }
    ],
    "deepDive": {
      "title": "Physical Slotted Page Storage",
      "description": "On disk, tables are stored in fixed-size blocks (typically 8 KB in PostgreSQL). The page header contains pointers (item pointers) growing downward, while row tuples grow upward from the bottom of the page.",
      "codeSnippet": "-- Slotted Page Layout:\n-- [ Page Header | Line Pointer 1 | Line Pointer 2 | ... Free Space ... | Tuple 2 | Tuple 1 ]",
      "warning": "Variable-length text columns that exceed page capacity are automatically moved off-table into TOAST storage."
    },
    "advantages": [
      "Predictable memory and disk layout.",
      "Fast column projection and indexing.",
      "Automatic type safety at the storage engine level."
    ],
    "disadvantages": [
      "Altering column types on multi-million row tables can require rewrite locks.",
      "Sparse tables with many nullable columns can consume unnecessary page space."
    ],
    "interviewQuestions": [
      {
        "question": "How does a relational database physically store a table on disk?",
        "answer": "Relational engines store tables as an array of fixed-size disk blocks (typically 8 KB pages). Each page contains a 24-byte header, an array of 4-byte line pointers growing downwards from the top, and actual row tuples growing upwards from the bottom. The gap between them is free space. This slotted design allows rows to be moved inside the page during defragmentation without invalidating the page line pointer."
      },
      {
        "question": "What is the difference between a Heap Table and an Index-Organized (Clustered) Table?",
        "answer": "In a Heap Table (default in PostgreSQL), rows are placed in any disk page with available free space in no particular order, and secondary indexes store physical tuple pointers (CTID). In an Index-Organized Table (default in MySQL InnoDB), the table rows are physically sorted and stored directly inside the leaf nodes of the Primary Key B+ Tree.",
        "comparisonTable": {
          "headers": [
            "Feature",
            "Heap Table (PostgreSQL)",
            "Index-Organized Table (MySQL InnoDB)"
          ],
          "rows": [
            [
              "Storage Layout",
              "Unordered pages with free-space map",
              "Physically ordered inside PK B+ Tree leaves"
            ],
            [
              "Primary Key Lookup",
              "Index scan -> Heap page fetch",
              "Direct leaf lookup (Index-Only Scan)"
            ],
            [
              "Secondary Index",
              "Points to physical disk CTID (block:offset)",
              "Points to Primary Key value"
            ],
            [
              "Insert Speed",
              "Very fast (appends to available slot)",
              "Requires B+ Tree traversal & node splits"
            ]
          ]
        }
      },
      {
        "question": "What is column alignment padding and how does column ordering impact table size?",
        "answer": "CPUs access memory faster when data is aligned to word boundaries (e.g. 8 bytes for BIGINT, 4 bytes for INT). When a SMALLINT (2 bytes) is followed by a BIGINT (8 bytes), the database must insert 6 bytes of empty padding to align the BIGINT. Ordering columns from largest to smallest (8-byte, then 4-byte, 2-byte, 1-byte) completely eliminates padding waste."
      },
      {
        "question": "What is the High Water Mark (HWM) in a table and why does deleting rows not shrink the file?",
        "answer": "The High Water Mark is the maximum physical disk block ever allocated to the table. When rows are deleted, the database marks the page slots as dead (free), but does not deallocate the operating system file blocks back to disk to avoid filesystem fragmentation. To return disk space to the OS, PostgreSQL requires VACUUM FULL and MySQL requires OPTIMIZE TABLE."
      },
      {
        "question": "What is TOAST (The Oversized-Attribute Storage Technique) in PostgreSQL?",
        "answer": "Since PostgreSQL pages are fixed at 8 KB, row tuples cannot span across page boundaries. When any attribute (such as TEXT, VARCHAR, or JSONB) exceeds approximately 2 KB, PostgreSQL compresses it. If it is still too large, it splits the data into 2 KB chunks and stores them in a separate TOAST table, leaving an 18-byte pointer in the main row."
      }
    ],
    "interviewReadyAnswer": "A relational database organizes entities into schemas and tables. Each table enforces a strict schema of typed columns, storing records in fixed-size slotted disk pages with primary keys ensuring row identity.",
    "quickTest": {
      "question": "In a standard relational table, what ensures that every record can be distinctly identified?",
      "options": [
        {
          "key": "A",
          "text": "A Primary Key constraint"
        },
        {
          "key": "B",
          "text": "A database schema name"
        },
        {
          "key": "C",
          "text": "A foreign key cascade"
        },
        {
          "key": "D",
          "text": "A LIMIT clause"
        }
      ],
      "correctAnswer": "A",
      "explanation": "A Primary Key uniquely identifies each row in a table and cannot contain NULL values."
    },
    "mentalModel": "Filing Cabinet: Schemas are drawers, tables are folders, rows are paper forms, and columns are typed input boxes.",
    "codeSnippet": "CREATE TABLE university.courses (\n  id SERIAL PRIMARY KEY,\n  code VARCHAR(10) UNIQUE NOT NULL,\n  credits INT CHECK (credits > 0)\n);",
    "takeaways": [
      "Tables are collections of rows conforming to column schema definitions.",
      "Disk engines store table rows in 8 KB slotted disk pages.",
      "Schemas provide namespaces to prevent table naming collisions."
    ],
    "commonPitfall": {
      "mistake": "Putting unrelated multi-valued data in a single comma-separated string column.",
      "fix": "Normalize into separate rows or a child junction table."
    },
    "nextTopicId": "sql-command-types",
    "prevTopicId": "intro-to-sql"
  },
  {
    "id": "sql-command-types",
    "topicNumber": 3,
    "title": "SQL Command Types",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "The 5 major SQL sub-languages: DDL, DML, DQL, DCL, and TCL with practical syntax and execution context.",
    "definition": "SQL commands are categorized into five sub-languages based on their function: DDL (structure), DML (data manipulation), DQL (querying), DCL (permissions), and TCL (transactions).",
    "eli5": "Think of a building: DDL is the architect building rooms, DML is the tenant moving furniture in, DQL is a visitor looking around, DCL is the security guard giving keys, and TCL is the contract signing.",
    "realWorldExample": {
      "description": "A banking application uses all five command types in daily operation.",
      "tables": [
        {
          "title": "SQL Command Categories",
          "headers": [
            "Category",
            "Acronym",
            "Core Verbs"
          ],
          "rows": [
            [
              "Data Definition",
              "DDL",
              "CREATE, ALTER, DROP, TRUNCATE"
            ],
            [
              "Data Manipulation",
              "DML",
              "INSERT, UPDATE, DELETE"
            ],
            [
              "Data Query",
              "DQL",
              "SELECT"
            ],
            [
              "Data Control",
              "DCL",
              "GRANT, REVOKE"
            ],
            [
              "Transaction Control",
              "TCL",
              "COMMIT, ROLLBACK, SAVEPOINT"
            ]
          ]
        }
      ],
      "explanation": "An administrator creates the table (DDL), grants access (DCL), customers transfer funds (TCL + DML), and auditors review logs (DQL)."
    },
    "sqlSyntaxSteps": [
      {
        "step": "DDL: Define Structure",
        "code": "CREATE TABLE accounts (id INT PRIMARY KEY, balance NUMERIC(10,2));"
      },
      {
        "step": "TCL & DML: Safe Transactional Write",
        "code": "BEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE id = 1;\nUPDATE accounts SET balance = balance + 50 WHERE id = 2;\nCOMMIT;"
      },
      {
        "step": "DQL: Query State",
        "code": "SELECT id, balance FROM accounts WHERE id IN (1, 2);"
      },
      {
        "step": "DCL: Control Permissions",
        "code": "GRANT SELECT ON accounts TO auditor_role;"
      }
    ],
    "rulesTable": [
      {
        "rule": "DDL Implicit Commits",
        "explanation": "In MySQL and Oracle, DDL statements cause an automatic commit of any open transaction (PostgreSQL supports transactional DDL)."
      },
      {
        "rule": "DML Row Locks",
        "explanation": "DML operations acquire row-level exclusive locks until the transaction issues COMMIT or ROLLBACK."
      },
      {
        "rule": "DQL Concurrency",
        "explanation": "Under standard MVCC, SELECT statements do not lock out read or write operations."
      },
      {
        "rule": "DDL implicit commits in MySQL",
        "explanation": "DDL statements in MySQL implicitly commit the active transaction, whereas PostgreSQL supports transactional DDL."
      },
      {
        "rule": "AccessExclusiveLock acquired by DDL",
        "explanation": "DDL statements like ALTER TABLE or DROP TABLE acquire AccessExclusiveLock, blocking all concurrent SELECT, INSERT, UPDATE, and DELETE operations."
      }
    ],
    "deepDive": {
      "title": "Transactional DDL in Modern Engines",
      "description": "PostgreSQL allows DDL statements (like CREATE TABLE or ALTER TABLE) to execute inside a BEGIN...COMMIT block, allowing atomic schema rollback if a migration step fails.",
      "codeSnippet": "BEGIN;\nALTER TABLE accounts ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';\n-- If something fails, ROLLBACK restores previous schema!\nCOMMIT;",
      "warning": "In MySQL, DDL statements implicitly commit any active transaction, making automated migration rollback impossible."
    },
    "advantages": [
      "Clear separation of duties between schema design, data mutation, and security.",
      "Fine-grained access control through DCL grants.",
      "Transactional safety via TCL guarantees all-or-nothing execution."
    ],
    "disadvantages": [
      "Running heavy DDL operations on production can cause table locks.",
      "Uncommitted TCL blocks hold database locks and exhaust connection pools."
    ],
    "interviewQuestions": [
      {
        "question": "What is the physical execution difference between DELETE and TRUNCATE?",
        "answer": "DELETE is a DML operation that scans and marks individual row slots dead one by one, writing full transaction log records (WAL/Undo) for every deleted tuple and firing AFTER DELETE triggers. TRUNCATE is a DDL operation that deallocates entire physical disk pages from the storage engine, does not fire per-row triggers, resets identity sequences, and runs orders of magnitude faster.",
        "comparisonTable": {
          "headers": [
            "Metric",
            "DELETE (DML)",
            "TRUNCATE (DDL)"
          ],
          "rows": [
            [
              "Operation Level",
              "Row-by-row tuple deletion",
              "Page-level disk block deallocation"
            ],
            [
              "WAL / Undo Volume",
              "Heavy (logs every deleted row)",
              "Minimal (logs page deallocation)"
            ],
            [
              "Triggers",
              "Fires row-level triggers",
              "Does NOT fire row-level triggers"
            ],
            [
              "Speed (10M rows)",
              "Minutes (high I/O lock)",
              "Milliseconds (instant metadata update)"
            ],
            [
              "WHERE Clause",
              "Supported (selective deletion)",
              "NOT supported (clears entire relation)"
            ]
          ]
        }
      },
      {
        "question": "Can you rollback a TRUNCATE statement inside a transaction in PostgreSQL vs MySQL?",
        "answer": "In PostgreSQL, TRUNCATE is transactional and can be safely rolled back within a BEGIN...ROLLBACK block because PostgreSQL tracks page deallocation in WAL. In MySQL (InnoDB), TRUNCATE is non-transactional and implicitly commits any pending transaction, making rollback impossible."
      },
      {
        "question": "What is DCL and how do role hierarchies and privilege cascades work?",
        "answer": "Data Control Language (GRANT, REVOKE) manages database authorization. When privilege WITH GRANT OPTION is granted to a user, they can delegate privileges to other roles. If a parent role has their grant revoked with CASCADE, all child privileges granted down the chain are automatically revoked."
      },
      {
        "question": "Why can executing an ALTER TABLE statement cause connection pool exhaustion?",
        "answer": "ALTER TABLE requires an AccessExclusiveLock. Even if the ALTER itself is fast, if there is a long-running SELECT currently reading the table, the ALTER statement waits in the lock queue. All subsequent SELECTs behind the ALTER statement are blocked from reading the table, rapidly exhausting the application connection pool."
      },
      {
        "question": "What is the difference between DML and DQL, and why are they sometimes grouped together?",
        "answer": "DQL (Data Query Language) consists of SELECT and is strictly read-only, retrieving data without mutating state. DML (Data Manipulation Language) consists of INSERT, UPDATE, and DELETE which mutate data tuples and acquire row-level write locks. Some SQL standards group SELECT under DML because queries often form the basis of updates (e.g. INSERT INTO ... SELECT)."
      }
    ],
    "interviewReadyAnswer": "SQL is divided into five core sub-languages: DDL manages schemas, DML mutates rows, DQL retrieves data, DCL manages permissions, and TCL guarantees atomicity via COMMIT and ROLLBACK.",
    "quickTest": {
      "question": "Which of the following is a DDL (Data Definition Language) command?",
      "options": [
        {
          "key": "A",
          "text": "UPDATE"
        },
        {
          "key": "B",
          "text": "TRUNCATE TABLE"
        },
        {
          "key": "C",
          "text": "SELECT"
        },
        {
          "key": "D",
          "text": "GRANT"
        }
      ],
      "correctAnswer": "B",
      "explanation": "TRUNCATE TABLE is a DDL command because it deallocates the physical underlying storage structures of the table."
    },
    "mentalModel": "Building construction: DDL is pouring concrete, DML is decorating rooms, DQL is taking a photo, DCL is handing out keys, and TCL is signing the deed.",
    "codeSnippet": "-- DDL creates, DML writes, DQL reads, TCL commits:\nBEGIN;\nINSERT INTO accounts (id, balance) VALUES (1, 1000.00);\nCOMMIT;\nSELECT * FROM accounts;",
    "takeaways": [
      "DDL changes table schema; DML mutates row data; DQL queries data.",
      "TCL controls transactions with BEGIN, COMMIT, and ROLLBACK.",
      "TRUNCATE is fast DDL, whereas DELETE is logged DML."
    ],
    "commonPitfall": {
      "mistake": "Using DELETE without a WHERE clause to clear a table with millions of rows, generating huge WAL logs and slowing down the server.",
      "fix": "Use TRUNCATE TABLE to instantly deallocate the disk pages."
    },
    "nextTopicId": "create-statements",
    "prevTopicId": "database-and-tables"
  },
  {
    "id": "create-statements",
    "topicNumber": 4,
    "title": "CREATE Statements",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "CREATE DATABASE, CREATE SCHEMA, CREATE TABLE, generated columns, column types, and schema options.",
    "definition": "The CREATE statement is a DDL command used to instantiate new databases, schemas, tables, indexes, and views within the RDBMS catalog.",
    "eli5": "CREATE is like drafting an empty blueprint for a new house or building. You define the room sizes, door names, and rules before anyone moves in.",
    "realWorldExample": {
      "description": "Creating an audit logging table with timestamp defaults, identity columns, and JSON payloads.",
      "tables": [
        {
          "title": "audit_logs schema",
          "headers": [
            "Column",
            "Type",
            "Constraint / Default"
          ],
          "rows": [
            [
              "id",
              "BIGINT",
              "GENERATED ALWAYS AS IDENTITY (PK)"
            ],
            [
              "action",
              "VARCHAR(50)",
              "NOT NULL"
            ],
            [
              "payload",
              "JSONB",
              "NOT NULL DEFAULT '{}'"
            ],
            [
              "created_at",
              "TIMESTAMPTZ",
              "NOT NULL DEFAULT NOW()"
            ]
          ]
        }
      ],
      "explanation": "The table guarantees that every log entry receives a strictly incrementing ID and a UTC timestamp."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Create table with identity and defaults",
        "code": "CREATE TABLE audit_logs (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  action VARCHAR(50) NOT NULL,\n  user_id INT REFERENCES users(id),\n  payload JSONB NOT NULL DEFAULT '{}',\n  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP\n);",
        "note": "GENERATED ALWAYS AS IDENTITY is the standard ANSI replacement for legacy SERIAL."
      },
      {
        "step": "Step 2: Create Table with IF NOT EXISTS",
        "code": "CREATE TABLE IF NOT EXISTS system_settings (\n  key VARCHAR(100) PRIMARY KEY,\n  value TEXT NOT NULL\n);",
        "note": "Prevents runtime deployment errors if the table is already present."
      }
    ],
    "rulesTable": [
      {
        "rule": "IF NOT EXISTS",
        "explanation": "Prevents SQL execution errors if an entity with the specified name already exists."
      },
      {
        "rule": "Identity vs Serial",
        "explanation": "GENERATED ALWAYS AS IDENTITY conforms to SQL:2003 standards and prevents accidental manual ID overrides."
      },
      {
        "rule": "Storage limits",
        "explanation": "Tables cannot exceed physical engine limits (e.g., 1600 columns in PostgreSQL)."
      },
      {
        "rule": "Column default evaluation time",
        "explanation": "Default expressions like CURRENT_TIMESTAMP or gen_random_uuid() are evaluated at row insert time, not at schema creation time."
      },
      {
        "rule": "Unlogged table persistence",
        "explanation": "UNLOGGED tables bypass WAL logging, increasing write speed by 3x at the cost of being truncated on an engine crash."
      }
    ],
    "deepDive": {
      "title": "Generated (Computed) Columns",
      "description": "Modern SQL allows generated columns that automatically calculate their value from other columns, either stored on disk or virtual.",
      "codeSnippet": "CREATE TABLE invoices (\n  id INT PRIMARY KEY,\n  subtotal NUMERIC(10, 2) NOT NULL,\n  tax_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.08,\n  total NUMERIC(10, 2) GENERATED ALWAYS AS (subtotal * (1 + tax_rate)) STORED\n);",
      "warning": "Stored generated columns consume disk space but can be indexed directly with B-Trees for fast lookups."
    },
    "advantages": [
      "Guarantees data shape and schema constraints upfront.",
      "Supports identity sequencing without race conditions.",
      "Enables database engine optimizations based on known data widths."
    ],
    "disadvantages": [
      "Schema alterations on massive tables require table locks or background migrations."
    ],
    "interviewQuestions": [
      {
        "question": "What is the physical storage difference between CHAR(n), VARCHAR(n), and TEXT in PostgreSQL?",
        "answer": "In PostgreSQL, CHAR(n), VARCHAR(n), and TEXT all use the exact same underlying varlena structure on disk (a 1 or 4-byte length header followed by the string bytes). CHAR(n) is padded with trailing spaces up to length n, wasting disk space. VARCHAR(n) adds a length check constraint. TEXT has no arbitrary length limit. Under the hood, performance between VARCHAR and TEXT is identical."
      },
      {
        "question": "What are Generated Columns (STORED vs VIRTUAL) and when should you use them?",
        "answer": "A generated column computes its value from other columns. VIRTUAL generated columns are calculated on-the-fly when read, consuming zero disk space but adding CPU cost. STORED generated columns are calculated during INSERT/UPDATE and persisted on disk, allowing direct B-Tree indexing for ultra-fast point lookups.",
        "codeBlock": "CREATE TABLE orders (\n    id BIGINT PRIMARY KEY,\n    price NUMERIC(10,2),\n    tax_rate NUMERIC(4,2),\n    total NUMERIC(10,2) GENERATED ALWAYS AS (price * (1 + tax_rate)) STORED\n);\nCREATE INDEX idx_orders_total ON orders(total);"
      },
      {
        "question": "How does CREATE TABLE AS SELECT (CTAS) differ from standard CREATE TABLE followed by INSERT?",
        "answer": "CTAS copies column names and data types from the source query and populates the table in a single operation. However, CTAS does NOT copy primary keys, foreign keys, unique constraints, check constraints, default expressions, or indexes from the source table. All indexes and constraints must be added manually afterwards."
      },
      {
        "question": "What are UNLOGGED tables and when should you use them in production?",
        "answer": "UNLOGGED tables (PostgreSQL) do not write changes to the Write-Ahead Log (WAL). Writes are dramatically faster (up to 3x) and do not cause WAL replication traffic. However, they are NOT crash-safe: if the database server crashes or loses power, all unlogged tables are automatically truncated upon recovery. They are ideal for cache tables, session stores, or transient ETL staging."
      },
      {
        "question": "What is schema qualification and how does the search_path setting affect security?",
        "answer": "When a query references \"users\", the database searches schemas in the order defined by search_path (e.g. \"$user\", public). If an attacker creates a malicious function or table in a schema that appears earlier in the search_path, applications executing unqualified queries can execute unintended code (SQL Trojan injection). Production queries should always explicitly schema-qualify tables (e.g. public.users)."
      }
    ],
    "interviewReadyAnswer": "The CREATE TABLE statement instantiates relational entities with typed columns, constraints, and identity defaults. Standard practice uses ANSI identity columns and appropriate storage types to optimize slotted page density.",
    "quickTest": {
      "question": "Which clause prevents a migration script from crashing if a table is already present?",
      "options": [
        {
          "key": "A",
          "text": "IGNORE ERROR"
        },
        {
          "key": "B",
          "text": "IF NOT EXISTS"
        },
        {
          "key": "C",
          "text": "ON DUPLICATE SKIP"
        },
        {
          "key": "D",
          "text": "TRY CREATE"
        }
      ],
      "correctAnswer": "B",
      "explanation": "CREATE TABLE IF NOT EXISTS checks the database catalog and creates the table only if no entity with that name exists."
    },
    "mentalModel": "Architect Blueprint: Drawing the boundaries, room sizes, and specifications before construction begins.",
    "codeSnippet": "CREATE TABLE IF NOT EXISTS products (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  sku VARCHAR(30) UNIQUE NOT NULL,\n  price_cents INT CHECK (price_cents >= 0)\n);",
    "takeaways": [
      "Use GENERATED ALWAYS AS IDENTITY instead of legacy SERIAL.",
      "Always specify appropriate nullability and CHECK constraints.",
      "Use IF NOT EXISTS for idempotent migration scripts."
    ],
    "commonPitfall": {
      "mistake": "Using unconstrained VARCHAR or TEXT for fixed enumerated values like status.",
      "fix": "Use a CHECK constraint (CHECK (status IN ('active', 'archived'))) or an ENUM type."
    },
    "nextTopicId": "insert-statements",
    "prevTopicId": "sql-command-types"
  },
  {
    "id": "insert-statements",
    "topicNumber": 5,
    "title": "INSERT Statements",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Single row inserts, multi-row batching, INSERT INTO ... SELECT, and the RETURNING clause for atomic pipelines.",
    "definition": "The INSERT statement is a DML command used to add one or more new tuples (rows) into a database table.",
    "eli5": "INSERT is like mailing a letter into a mailbox. You fill out the address and details, drop it in, and the post office assigns it a receipt and spot.",
    "realWorldExample": {
      "description": "A registration service creates new user records and needs their newly generated primary key IDs immediately.",
      "tables": [
        {
          "title": "Inserted Rows",
          "headers": [
            "id (Auto)",
            "username",
            "email"
          ],
          "rows": [
            [
              101,
              "lucky",
              "lucky@example.com"
            ],
            [
              102,
              "rahul",
              "rahul@example.com"
            ]
          ]
        }
      ],
      "explanation": "Using batch INSERT sends multiple rows in a single network round-trip."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Single Row Insert with RETURNING",
        "code": "INSERT INTO users (username, email)\nVALUES ('lucky', 'lucky@example.com')\nRETURNING id, created_at;",
        "note": "Returns generated identity columns without a second SELECT query."
      },
      {
        "step": "Step 2: Multi-row Batch Insert",
        "code": "INSERT INTO users (username, email) VALUES\n  ('rahul', 'rahul@example.com'),\n  ('amit', 'amit@example.com'),\n  ('neha', 'neha@example.com');",
        "note": "Significantly faster than executing separate insert statements in a loop."
      },
      {
        "step": "Step 3: INSERT INTO ... SELECT",
        "code": "INSERT INTO user_archives (id, email)\nSELECT id, email FROM users WHERE is_active = FALSE;",
        "note": "Pulls data from one table directly into another entirely within engine memory."
      }
    ],
    "rulesTable": [
      {
        "rule": "Column List Matching",
        "explanation": "Values in the VALUES list must align with the specified column order."
      },
      {
        "rule": "Default Value Omission",
        "explanation": "Columns with DEFAULT or IDENTITY constraints can be omitted from the insert column list."
      },
      {
        "rule": "Constraint Violations",
        "explanation": "If any single row in a multi-row insert violates a constraint, the entire statement is rolled back."
      },
      {
        "rule": "Batch insert network efficiency",
        "explanation": "Inserting 1,000 rows in a single multi-row statement avoids 999 network round-trips and transaction commits."
      },
      {
        "rule": "Atomic UPSERT guarantees",
        "explanation": "ON CONFLICT DO UPDATE takes an exclusive row lock, preventing race conditions inherent in SELECT-then-INSERT logic."
      }
    ],
    "deepDive": {
      "title": "Batch Inserts and Write-Ahead Log (WAL) Efficiency",
      "description": "Executing 1,000 separate INSERT statements causes 1,000 network round-trips and 1,000 transaction sync operations. A single batched INSERT statement writes all tuples in one go, drastically reducing disk flush overhead.",
      "codeSnippet": "-- Slow (1000 round-trips):\n-- INSERT INTO t VALUES (1); INSERT INTO t VALUES (2); ...\n\n-- Fast (1 round-trip):\nINSERT INTO t (val) VALUES (1), (2), (3), (4), (5);",
      "warning": "Extremely large batch inserts (e.g. 100,000 rows in one statement) can hit parameter limits or memory thresholds; batch in chunks of 1,000 to 5,000."
    },
    "advantages": [
      "Batching minimizes network round-trips and WAL lock contention.",
      "RETURNING clause provides instant access to auto-generated columns.",
      "INSERT INTO SELECT allows bulk data transformation without application middleware."
    ],
    "disadvantages": [
      "A single failing row in a batch statement cancels all other rows unless handled with ON CONFLICT."
    ],
    "interviewQuestions": [
      {
        "question": "Why is batch inserting (INSERT ... VALUES (...), (...)) so much faster than single-row inserts?",
        "answer": "A single-row INSERT requires a client-server network round trip, query parsing, planning, WAL transaction commit (forcing an fsync to disk), and index updates. Batching 1,000 tuples into one statement parses once, acquires locks once, amortizes a single WAL fsync across 1,000 rows, and batch-updates B-Tree indexes, achieving 50x to 100x higher throughput."
      },
      {
        "question": "What is UPSERT (INSERT ON CONFLICT) and how does it prevent race conditions?",
        "answer": "Before ON CONFLICT, applications had to query SELECT ... WHERE id = 1, then issue INSERT if missing or UPDATE if present. Under concurrent traffic, two threads could simultaneously see no row, both issue INSERT, and one would fail with a Unique Key Violation. INSERT ... ON CONFLICT DO UPDATE executes atomically inside the storage engine using row locks.",
        "codeBlock": "INSERT INTO page_views (page_url, views)\nVALUES ('/blog/sql', 1)\nON CONFLICT (page_url)\nDO UPDATE SET views = page_views.views + 1\nRETURNING views;"
      },
      {
        "question": "Why should you use INSERT ... RETURNING instead of querying SELECT MAX(id)?",
        "answer": "Querying SELECT MAX(id) after an insert is susceptible to severe race conditions: another transaction could insert a row between your insert and your query, returning the wrong ID. Furthermore, MAX(id) requires a separate query. INSERT ... RETURNING returns the generated ID directly from the newly inserted tuple header with zero race conditions and zero extra round-trips."
      },
      {
        "question": "What is bulk loading (COPY / LOAD DATA INFILE) and why does it outperform INSERT statements?",
        "answer": "The PostgreSQL COPY command (or MySQL LOAD DATA INFILE) bypasses the SQL parser, query planner, and per-row statement overhead. The database engine reads raw CSV/binary streams directly into 8 KB buffer pages, postponing secondary index updates and constraint evaluations until the stream completes, loading millions of rows in seconds."
      },
      {
        "question": "What happens when an INSERT statement fails partway through a batch?",
        "answer": "In standard relational engines, a SQL statement is atomic. If the 500th row in a 1,000-row batch violates a CHECK or UNIQUE constraint, the entire statement is aborted, and all 499 previously processed rows in that statement are rolled back. None of the rows remain in the table."
      }
    ],
    "interviewReadyAnswer": "The INSERT statement writes new rows to a table. High-performance applications use multi-row batched inserts to minimize network latency and leverage the RETURNING clause to atomically capture database-generated keys.",
    "quickTest": {
      "question": "What happens if the 3rd row in a 5-row batch INSERT violates a UNIQUE constraint?",
      "options": [
        {
          "key": "A",
          "text": "Rows 1, 2, 4, and 5 are inserted; row 3 is skipped."
        },
        {
          "key": "B",
          "text": "The entire statement fails and no rows are inserted."
        },
        {
          "key": "C",
          "text": "Row 3 is inserted with a NULL value."
        },
        {
          "key": "D",
          "text": "The database terminates the client connection immediately."
        }
      ],
      "correctAnswer": "B",
      "explanation": "SQL statements are atomic by default: if any single row fails constraint validation, the entire statement aborts and rolls back."
    },
    "mentalModel": "Loading a pallet: Put 50 boxes on one pallet and ship it across the warehouse once, rather than driving 50 individual round-trips.",
    "codeSnippet": "INSERT INTO users (username, email)\nVALUES ('lucky', 'lucky@test.com')\nRETURNING id, created_at;",
    "takeaways": [
      "Batch insert multiple rows in a single query for maximum throughput.",
      "Use RETURNING to read back auto-generated primary keys without extra queries.",
      "INSERT statements are atomic; any row failure rolls back the entire batch."
    ],
    "commonPitfall": {
      "mistake": "Inserting records in a procedural for-loop over the network, incurring high latency.",
      "fix": "Accumulate rows and execute a single batched multi-row INSERT."
    },
    "nextTopicId": "select-statements",
    "prevTopicId": "create-statements"
  },
  {
    "id": "select-statements",
    "topicNumber": 6,
    "title": "SELECT Statements",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "SELECT projections, column aliases, scalar expressions, arithmetic transformations, and the logical query execution order.",
    "definition": "The SELECT statement is the foundational DQL command used to project and retrieve data from one or more tables or views.",
    "eli5": "SELECT is like a custom photo filter. You have a huge photo album (the table), and SELECT lets you pick exactly which faces (columns) you want to see on your screen.",
    "realWorldExample": {
      "description": "An analytics dashboard displays total employee compensation including base salary and bonuses.",
      "tables": [
        {
          "title": "Employees",
          "headers": [
            "id",
            "first_name",
            "salary",
            "bonus_percent"
          ],
          "rows": [
            [
              1,
              "Alice",
              "100000",
              "0.10"
            ],
            [
              2,
              "Bob",
              "80000",
              "0.05"
            ]
          ]
        }
      ],
      "explanation": "The query calculates total compensation on the fly and aliases the result."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Column projection and aliasing",
        "code": "SELECT\n  first_name AS employee_name,\n  salary,\n  (salary * bonus_percent) AS bonus_amount,\n  salary + (salary * bonus_percent) AS total_compensation\nFROM employees;",
        "note": "Expressions in the SELECT list transform raw column values into calculated fields."
      },
      {
        "step": "Step 2: Selecting literal constants and system functions",
        "code": "SELECT 42 AS answer, CURRENT_DATE AS today, UPPER('hello') AS greeting;",
        "note": "SELECT can evaluate scalar expressions without querying any table."
      }
    ],
    "rulesTable": [
      {
        "rule": "Avoid SELECT * in Production",
        "explanation": "SELECT * fetches unneeded columns, breaks covering index scans, and risks application failure when columns change."
      },
      {
        "rule": "Logical Execution Order",
        "explanation": "FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT. Aliases defined in SELECT are not visible in WHERE."
      },
      {
        "rule": "Column Aliases with Spaces",
        "explanation": "Aliases with spaces or special characters must be wrapped in double quotes: \"Total Compensation\"."
      },
      {
        "rule": "Logical query processing order",
        "explanation": "FROM is evaluated first, followed by WHERE, GROUP BY, HAVING, SELECT, and ORDER BY."
      },
      {
        "rule": "Alias availability scoping",
        "explanation": "Column aliases defined in SELECT are not visible in WHERE because WHERE evaluates before SELECT."
      }
    ],
    "deepDive": {
      "title": "Why SELECT * Destroys Index-Only Scans",
      "description": "When an index contains all requested columns (e.g. index on (user_id, status)), the engine reads directly from the index leaves (Index-Only Scan). If you write SELECT *, the engine must perform costly heap disk lookups for every matching row.",
      "codeSnippet": "-- Fast Index-Only Scan:\nSELECT user_id, status FROM users WHERE user_id = 42;\n\n-- Slow Table Heap Scan (because of SELECT *):\nSELECT * FROM users WHERE user_id = 42;",
      "warning": "Never use SELECT * in production API endpoints or latency-critical paths."
    },
    "advantages": [
      "Fine-grained control over network payload size.",
      "Supports on-the-fly mathematical and text transformations.",
      "Enables covering index optimizations when projecting specific columns."
    ],
    "disadvantages": [
      "Writing SELECT * transfers unused data over the wire and wastes buffer cache."
    ],
    "interviewQuestions": [
      {
        "question": "What is the exact 8-step logical query processing order of a SQL statement?",
        "answer": "The logical processing order determines when columns and aliases become available: 1. FROM & JOINs (cartesian product & ON filtering), 2. WHERE (row filtering), 3. GROUP BY (bucketing), 4. HAVING (group filtering), 5. SELECT (evaluating expressions & aliases), 6. DISTINCT (duplicate elimination), 7. ORDER BY (sorting), 8. LIMIT / OFFSET (windowing)."
      },
      {
        "question": "Why can you NOT use a column alias defined in SELECT inside the WHERE clause?",
        "answer": "Because of the logical query processing order: the WHERE clause evaluates at Step 2 to filter rows from disk, whereas the SELECT clause (which assigns column aliases) evaluates at Step 5. When the WHERE clause is evaluated, the alias does not exist yet. You must repeat the expression in WHERE or wrap the query in a CTE/subquery."
      },
      {
        "question": "Why is \"SELECT *\" considered a severe production antipattern?",
        "answer": "1. It breaks Covering Index (Index-Only) scans by forcing the engine to visit heap disk pages for unindexed columns. 2. It wastes network bandwidth and serializes unused data across the wire. 3. It pollutes database shared buffer caches with unnecessary columns (like large TEXT or JSONB). 4. If table columns are added or reordered, application code relying on column positions breaks."
      },
      {
        "question": "What is Projection Pushdown in query optimization?",
        "answer": "Projection Pushdown is a Cost-Based Optimizer transformation where the planner pushes the list of required columns down into the lowest physical scan operators (Sequential Scan or Index Scan). The engine only reads the necessary column byte offsets from the 8 KB page into memory, discarding unused attributes immediately."
      },
      {
        "question": "Can a SELECT statement lock rows or cause concurrency blocking?",
        "answer": "Under standard MVCC (Multi-Version Concurrency Control), regular SELECT queries read snapshot data without acquiring locks: readers never block writers, and writers never block readers. However, if a query uses SELECT ... FOR UPDATE or SELECT ... FOR SHARE, it acquires row-level exclusive or shared locks, blocking concurrent transactions from modifying or locking those rows."
      }
    ],
    "interviewReadyAnswer": "The SELECT statement projects and computes columns from relational sets. In production systems, explicit column projection is mandatory to preserve network bandwidth and enable database Index-Only Scans.",
    "quickTest": {
      "question": "Why does the query \"SELECT salary * 2 AS double_sal FROM emp WHERE double_sal > 50000\" fail in standard SQL?",
      "options": [
        {
          "key": "A",
          "text": "You cannot multiply numbers in SQL."
        },
        {
          "key": "B",
          "text": "WHERE evaluates before SELECT in the logical execution order, so double_sal is not yet known."
        },
        {
          "key": "C",
          "text": "Column aliases must be capitalized."
        },
        {
          "key": "D",
          "text": "The AS keyword is deprecated in ANSI SQL."
        }
      ],
      "correctAnswer": "B",
      "explanation": "WHERE filters rows before the SELECT projection step runs, meaning aliases created in SELECT cannot be resolved inside WHERE."
    },
    "mentalModel": "Filtering Camera: Only capture the specific objects you want in the frame, rather than taking a panoramic shot of the entire city and throwing away 90% of it.",
    "codeSnippet": "SELECT u.name, (u.balance * 1.05) AS projected_balance\nFROM users u\nWHERE u.status = 'active';",
    "takeaways": [
      "Always project explicit column names; never use SELECT * in production.",
      "Logical query execution order explains alias visibility rules.",
      "Selective projection enables B-Tree Index-Only scans without heap lookups."
    ],
    "commonPitfall": {
      "mistake": "Using SELECT * in backend API queries, pulling heavy BLOB/TEXT columns unintentionally.",
      "fix": "Explicitly specify only the needed columns in the SELECT clause."
    },
    "nextTopicId": "where-clause",
    "prevTopicId": "insert-statements"
  },
  {
    "id": "where-clause",
    "topicNumber": 7,
    "title": "WHERE Clause",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Filtering tuples using comparison operators, predicate sargability, and avoiding unindexed function scans.",
    "definition": "The WHERE clause specifies search conditions (predicates) that filter rows before any grouping or aggregation takes place.",
    "eli5": "WHERE is a security guard at a club door. Only guests with valid IDs and correct dress codes are allowed inside; everyone else is filtered out immediately.",
    "realWorldExample": {
      "description": "Filtering active subscribers whose account balance is greater than zero.",
      "tables": [
        {
          "title": "Accounts",
          "headers": [
            "id",
            "user_id",
            "status",
            "balance"
          ],
          "rows": [
            [
              1,
              101,
              "active",
              "45.00"
            ],
            [
              2,
              102,
              "suspended",
              "0.00"
            ],
            [
              3,
              103,
              "active",
              "120.00"
            ]
          ]
        }
      ],
      "explanation": "WHERE filters out row 2 because its status is not active."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Filtering with comparison operators",
        "code": "SELECT id, user_id, balance\nFROM accounts\nWHERE status = 'active' AND balance > 0.00;",
        "note": "Only rows where both conditions evaluate to TRUE are returned."
      },
      {
        "step": "Step 2: Checking multiple criteria with parentheses",
        "code": "SELECT id, user_id\nFROM accounts\nWHERE (status = 'active' OR status = 'trial')\n  AND balance >= 10.00;",
        "note": "Parentheses clarify evaluation order when mixing AND and OR."
      }
    ],
    "rulesTable": [
      {
        "rule": "Boolean Evaluation",
        "explanation": "WHERE returns rows where the condition evaluates strictly to TRUE (discarding FALSE and UNKNOWN)."
      },
      {
        "rule": "Sargability",
        "explanation": "Predicates must be Search Argument Able (sargable) so the optimizer can traverse B-Tree index pages directly."
      },
      {
        "rule": "Aggregates Forbidden",
        "explanation": "Aggregate functions (like COUNT or SUM) cannot be used in WHERE; use HAVING instead."
      },
      {
        "rule": "SARGable predicate requirement",
        "explanation": "Predicates must compare raw indexed columns to constants; wrapping columns in functions prevents index scans."
      },
      {
        "rule": "Short-circuit evaluation order",
        "explanation": "Engines may reorder WHERE conditions based on selectivity costs rather than left-to-right code order."
      }
    ],
    "deepDive": {
      "title": "Sargability and B-Tree Index Invalidation",
      "description": "Wrapping an indexed column inside a function prevents the database from using a B-Tree index, forcing a full sequential scan of the table.",
      "codeSnippet": "-- Non-sargable (SLOW - scans entire table):\nWHERE EXTRACT(YEAR FROM created_at) = 2026;\n\n-- Sargable (FAST - uses B-Tree range scan):\nWHERE created_at >= '2026-01-01' AND created_at < '2027-01-01';",
      "warning": "Never apply functions to column names on the left side of comparison operators in WHERE."
    },
    "advantages": [
      "Filters unneeded rows before expensive grouping, sorting, or joins.",
      "Allows B-Tree index scans to jump directly to matching leaf pages.",
      "Reduces working memory (work_mem) consumption."
    ],
    "disadvantages": [
      "Poorly structured non-sargable predicates degrade queries into slow full table scans."
    ],
    "interviewQuestions": [
      {
        "question": "What does SARGable mean in SQL, and why is it critical for performance?",
        "answer": "SARGable stands for \"Search Argument Able\". A predicate is SARGable if the database engine can use a B-Tree index to perform a direct index seek (O(log N)) rather than scanning every row in the table (O(N)). Wrapping an indexed column inside a function (e.g. WHERE YEAR(created_at) = 2026) destroys SARGability because the B-Tree keys contain raw dates, not computed years.",
        "comparisonTable": {
          "headers": [
            "Non-SARGable (Forces Full Table Scan)",
            "SARGable Equivalent (Uses Index Seek)"
          ],
          "rows": [
            [
              "WHERE YEAR(created_at) = 2026",
              "WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'"
            ],
            [
              "WHERE LOWER(email) = 'alice@test.com'",
              "WHERE email = 'alice@test.com' (or create functional index)"
            ],
            [
              "WHERE price * 1.10 > 100",
              "WHERE price > 100 / 1.10"
            ],
            [
              "WHERE name LIKE '%son'",
              "Full Scan (leading wildcard cannot navigate B-Tree)"
            ]
          ]
        }
      },
      {
        "question": "How does the Cost-Based Optimizer estimate selectivity for WHERE predicates?",
        "answer": "The optimizer consults system statistics tables (e.g. pg_statistic / pg_stats in PostgreSQL) populated by ANALYZE. It stores: null_frac (fraction of NULLs), n_distinct (count of unique values), most_common_vals (MCV array with frequencies), and histogram_bounds (quantiles dividing non-MCV values into buckets). The optimizer interpolates histogram buckets to estimate the row count and pick the cheapest execution plan."
      },
      {
        "question": "Does the SQL engine always evaluate WHERE conditions from left to right?",
        "answer": "No. SQL is declarative: the engine is free to evaluate predicates in whatever order it determines to be most efficient. The optimizer typically evaluates cheap, highly-selective predicates first (like integer equality) before evaluating expensive operations (like regex matches or subqueries), regardless of how they are written in the query."
      },
      {
        "question": "What is the difference between filtering in WHERE vs filtering in HAVING?",
        "answer": "WHERE filters individual row tuples BEFORE grouping and aggregation occur. HAVING filters grouped rows AFTER the GROUP BY clause and aggregate computations have executed. Aggregation functions (e.g. SUM(), COUNT()) are forbidden in WHERE clauses because aggregate values do not exist until grouping completes."
      },
      {
        "question": "How does Three-Valued Logic (3VL) affect the WHERE clause with NULLs?",
        "answer": "In SQL, the WHERE clause only outputs rows where the predicate evaluates to TRUE. If a predicate evaluates to FALSE or UNKNOWN (which happens when comparing with NULL, e.g. NULL = 5), the row is discarded. This means WHERE col = 5 and WHERE col != 5 will BOTH exclude rows where col IS NULL."
      }
    ],
    "interviewReadyAnswer": "The WHERE clause filters rows using search predicates prior to grouping. High-performance queries keep predicates sargable by comparing isolated column names against constants, allowing B-Tree indexes to perform logarithmic point lookups.",
    "quickTest": {
      "question": "Which WHERE clause is sargable and can efficiently utilize a standard B-Tree index on created_at?",
      "options": [
        {
          "key": "A",
          "text": "WHERE DATE(created_at) = '2026-05-01'"
        },
        {
          "key": "B",
          "text": "WHERE created_at >= '2026-05-01 00:00:00' AND created_at < '2026-05-02 00:00:00'"
        },
        {
          "key": "C",
          "text": "WHERE TO_CHAR(created_at, 'YYYY-MM-DD') = '2026-05-01'"
        },
        {
          "key": "D",
          "text": "WHERE EXTRACT(DAY FROM created_at) = 1"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Option B compares the bare indexed column against literal bounds, enabling a direct B-Tree index range scan."
    },
    "mentalModel": "Security checkpoint: Guests are filtered at the gate based on ticket criteria before entering the venue.",
    "codeSnippet": "SELECT id, name, balance\nFROM users\nWHERE status = 'active' AND created_at >= '2026-01-01';",
    "takeaways": [
      "WHERE filters rows before GROUP BY and aggregations.",
      "Only predicates that evaluate to TRUE are kept (FALSE and UNKNOWN are discarded).",
      "Keep predicates sargable by avoiding function wrappers on indexed columns."
    ],
    "commonPitfall": {
      "mistake": "Writing WHERE UPPER(email) = 'TEST@EXAMPLE.COM', which disables the standard index on email.",
      "fix": "Use an expression index (CREATE INDEX ON users(UPPER(email))) or store normalized lowercase emails."
    },
    "nextTopicId": "update-statements",
    "prevTopicId": "select-statements"
  },
  {
    "id": "update-statements",
    "topicNumber": 8,
    "title": "UPDATE Statements",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Mutating column values, multi-column updates, WHERE safety guards, RETURNING, and MVCC tuple versioning.",
    "definition": "The UPDATE statement is a DML command that modifies existing column values in one or more table rows matching a search condition.",
    "eli5": "UPDATE is like using white-out and a pen on an existing form. You locate the exact file by ID, erase the old number, and write the new value.",
    "realWorldExample": {
      "description": "An e-commerce customer upgrades their shipping address and receives a confirmation receipt.",
      "tables": [
        {
          "title": "Before Update",
          "headers": [
            "id",
            "user_id",
            "status"
          ],
          "rows": [
            [
              101,
              1,
              "pending"
            ]
          ]
        },
        {
          "title": "After Update",
          "headers": [
            "id",
            "user_id",
            "status"
          ],
          "rows": [
            [
              101,
              1,
              "shipped"
            ]
          ]
        }
      ],
      "explanation": "The order status mutates from pending to shipped in an atomic transaction."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Targeted update with WHERE and RETURNING",
        "code": "UPDATE orders\nSET status = 'shipped', shipped_at = CURRENT_TIMESTAMP\nWHERE id = 101 AND status = 'pending'\nRETURNING id, status, shipped_at;",
        "note": "Guards ensure you only transition valid pending orders."
      },
      {
        "step": "Step 2: Multi-column calculated update",
        "code": "UPDATE accounts\nSET balance = balance - 25.00, updated_at = NOW()\nWHERE id = 42;",
        "note": "Relative updates prevent overwriting concurrent balance changes."
      }
    ],
    "rulesTable": [
      {
        "rule": "Mandatory WHERE Clause",
        "explanation": "An UPDATE statement without a WHERE clause updates every single row in the table."
      },
      {
        "rule": "Row-Level Exclusive Locks",
        "explanation": "The database acquires an exclusive row lock on every updated row until COMMIT or ROLLBACK."
      },
      {
        "rule": "Constraint Re-check",
        "explanation": "All foreign key, check, and type constraints are validated for updated values."
      },
      {
        "rule": "MVCC non-destructive update",
        "explanation": "PostgreSQL does not overwrite row bytes on disk; it marks the old tuple dead and writes a new tuple version."
      },
      {
        "rule": "Row-level exclusive locking",
        "explanation": "UPDATE statements acquire an Exclusive Row Lock (X-Lock) on target rows until the transaction commits."
      }
    ],
    "deepDive": {
      "title": "MVCC: In-Place Overwrites vs New Tuple Versions",
      "description": "Under Multi-Version Concurrency Control (MVCC) in PostgreSQL, an UPDATE does NOT overwrite the old row in place. Instead, it marks the old tuple header (t_xmax = current_tx) and writes a brand new tuple (t_xmin = current_tx) into the page.",
      "codeSnippet": "-- Behind the scenes in Postgres page:\n-- Tuple 1: [xmin: 100, xmax: 105 (expired), data: \"pending\"]\n-- Tuple 2: [xmin: 105, xmax: 0 (current), data: \"shipped\"]",
      "warning": "Updating indexed columns generates index churn and page bloat until VACUUM cleans old versions."
    },
    "advantages": [
      "In-place transactional state transitions.",
      "Supports mathematical relative increments without client-side state round-trips.",
      "RETURNING clause confirms updated state instantly."
    ],
    "disadvantages": [
      "Forgetting the WHERE clause accidentally mutates the entire table.",
      "Heavy updates can cause table bloat and high write amplification."
    ],
    "interviewQuestions": [
      {
        "question": "How does an UPDATE physically execute under MVCC in PostgreSQL vs MySQL InnoDB?",
        "answer": "In PostgreSQL, an UPDATE is essentially a DELETE + INSERT: the existing tuple’s xmax is set to the current transaction ID, and a completely new tuple version is appended to the page with xmin set to current TX. In MySQL InnoDB, updates modifying non-indexed columns update the row in-place and write the previous version into the Undo Log segment for rollback and MVCC reads."
      },
      {
        "question": "What is Heap-Only Tuples (HOT) optimization in PostgreSQL for UPDATEs?",
        "answer": "Normally, when a new tuple version is written, every index on the table must be updated with the new tuple pointer (CTID). If an UPDATE modifies ONLY non-indexed columns and the new tuple fits inside the SAME 8 KB disk page as the old tuple, PostgreSQL uses HOT: the old tuple points directly to the new tuple via a page-internal link, completely eliminating index write overhead."
      },
      {
        "question": "What is the Lost Update anomaly and how do you prevent it using Optimistic vs Pessimistic Locking?",
        "answer": "A Lost Update occurs when two transactions read the same row, compute a new value, and write it back: the second write silently overwrites the first. Pessimistic Locking prevents this using SELECT ... FOR UPDATE (locking the row during read). Optimistic Locking adds a version INT column: UPDATE accounts SET balance = 150, version = version + 1 WHERE id = 1 AND version = 3; if rows_affected is 0, another transaction updated it first and the application retries."
      },
      {
        "question": "What happens when two concurrent transactions attempt to UPDATE the exact same row?",
        "answer": "The first transaction acquires a row-level Exclusive Lock. When the second transaction tries to update the same row, it is blocked and waits in the lock queue. When the first transaction commits: under READ COMMITTED, the second transaction re-evaluates the WHERE clause on the newly committed row version; under REPEATABLE READ, the second transaction immediately aborts with a serialization failure error."
      },
      {
        "question": "How can you UPDATE multiple rows with different values in a single atomic SQL statement?",
        "answer": "You can combine UPDATE with a derived table or CTE using VALUES: UPDATE products AS p SET price = v.new_price FROM (VALUES (1, 19.99), (2, 29.99), (3, 39.99)) AS v(id, new_price) WHERE p.id = v.id; This updates hundreds of distinct rows in a single round-trip without loops."
      }
    ],
    "interviewReadyAnswer": "The UPDATE statement mutates existing rows matching a filter predicate. Under relational MVCC engines, updates create new row versions while locking updated records until transaction completion.",
    "quickTest": {
      "question": "What happens if you run \"UPDATE users SET status = 'inactive';\" without a WHERE clause?",
      "options": [
        {
          "key": "A",
          "text": "The query fails with a syntax error."
        },
        {
          "key": "B",
          "text": "Only the first row in the table is updated."
        },
        {
          "key": "C",
          "text": "Every row in the users table is updated to inactive."
        },
        {
          "key": "D",
          "text": "Only rows where status is NULL are updated."
        }
      ],
      "correctAnswer": "C",
      "explanation": "Without a WHERE clause, UPDATE operates unconditionally on every row in the target table."
    },
    "mentalModel": "Form Revision: Cross out the old line, stamp the expiration time on it, and append the new revised record.",
    "codeSnippet": "UPDATE users\nSET balance = balance + 100.00, updated_at = NOW()\nWHERE id = 42\nRETURNING id, balance;",
    "takeaways": [
      "Always verify WHERE conditions before executing UPDATE statements.",
      "PostgreSQL MVCC writes a new tuple version for every updated row.",
      "Relative expressions like balance = balance + 10 prevent race conditions."
    ],
    "commonPitfall": {
      "mistake": "Fetching a value into application code, adding 10 in memory, and writing it back, causing lost updates under high concurrency.",
      "fix": "Perform atomic in-database updates: UPDATE t SET count = count + 1 WHERE id = 1."
    },
    "nextTopicId": "delete-statements",
    "prevTopicId": "where-clause"
  },
  {
    "id": "delete-statements",
    "topicNumber": 9,
    "title": "DELETE Statements",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Row deletion mechanics, WHERE safeguards, DELETE RETURNING, cascading constraints, and DELETE vs TRUNCATE differences.",
    "definition": "The DELETE statement is a DML command that removes one or more rows from a table based on a predicate, firing triggers and maintaining transactional rollback capability.",
    "eli5": "DELETE is like taking an individual piece of paper out of a filing folder and putting it in the shredder. The folder stays, but that specific sheet is gone.",
    "realWorldExample": {
      "description": "An application deletes expired session tokens older than 30 days.",
      "tables": [
        {
          "title": "User Sessions",
          "headers": [
            "token",
            "user_id",
            "expires_at"
          ],
          "rows": [
            [
              "tok_111",
              1,
              "2026-01-01 (Expired)"
            ],
            [
              "tok_222",
              2,
              "2026-12-31 (Active)"
            ]
          ]
        }
      ],
      "explanation": "DELETE removes tok_111 while keeping tok_222 intact."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Targeted DELETE with WHERE",
        "code": "DELETE FROM user_sessions\nWHERE expires_at < CURRENT_TIMESTAMP;",
        "note": "Only expired sessions are targeted."
      },
      {
        "step": "Step 2: DELETE with RETURNING",
        "code": "DELETE FROM orders\nWHERE status = 'cancelled' AND created_at < NOW() - INTERVAL '90 days'\nRETURNING id, user_id, total_usd;",
        "note": "Allows the application to log deleted records to an external archive."
      }
    ],
    "rulesTable": [
      {
        "rule": "Missing WHERE Clause",
        "explanation": "DELETE FROM table_name without WHERE deletes all rows in the table row-by-row."
      },
      {
        "rule": "Foreign Key Enforcement",
        "explanation": "If a deleted row is referenced by child tables, deletion fails unless ON DELETE CASCADE or SET NULL is configured."
      },
      {
        "rule": "Trigger Activation",
        "explanation": "DELETE activates BEFORE DELETE and AFTER DELETE triggers for every removed row."
      },
      {
        "rule": "Dead tuple creation",
        "explanation": "DELETE marks row slots dead by setting xmax; space is not reclaimed until VACUUM runs."
      },
      {
        "rule": "Cascading lock escalation",
        "explanation": "Deleting a parent row cascades to child tables, acquiring row-level locks across multiple tables simultaneously."
      }
    ],
    "deepDive": {
      "title": "DELETE vs TRUNCATE Architecture",
      "description": "DELETE scans rows, checks visibility, acquires row locks, generates full WAL records, and marks tuples dead. TRUNCATE is a DDL command that instantly resets the table file on disk (allocating new empty disk fork), which is orders of magnitude faster.",
      "codeSnippet": "-- Slow for millions of rows (logged row-by-row):\nDELETE FROM large_logs;\n\n-- Instant (deallocates storage pages directly):\nTRUNCATE TABLE large_logs;",
      "warning": "TRUNCATE cannot be filtered with a WHERE clause; it always empties the entire table."
    },
    "advantages": [
      "Precise row targeting via standard WHERE predicates.",
      "Supports transactional ROLLBACK if mistakes occur.",
      "RETURNING clause captures deleted records for audit archives."
    ],
    "disadvantages": [
      "Deleting millions of rows creates massive WAL generation and table page fragmentation."
    ],
    "interviewQuestions": [
      {
        "question": "Why does executing DELETE FROM users; not free up disk space immediately in PostgreSQL?",
        "answer": "Because of Multi-Version Concurrency Control (MVCC). Other concurrent transactions that started before the DELETE may still need to read the old row versions. PostgreSQL simply records the current transaction ID in the tuple header’s xmax field, marking it invisible to future queries. The disk space is only marked reusable when autovacuum runs, and physical file size shrinks only with VACUUM FULL."
      },
      {
        "question": "What is Soft Delete and what are its major architectural and performance trade-offs?",
        "answer": "Soft Delete adds an is_deleted BOOLEAN or deleted_at TIMESTAMPTZ column instead of physically deleting rows. Advantages: audit recovery and historical compliance. Severe Drawbacks: 1. Every single query must remember to append WHERE deleted_at IS NULL, 2. Unique constraints become complicated (e.g. unique email among active users requires partial indexes), 3. Table and index sizes continuously bloat over time."
      },
      {
        "question": "How do you safely delete 10,000,000 rows from a production table without bringing down the database?",
        "answer": "Deleting 10 million rows in one statement acquires long-running exclusive locks, explodes the Write-Ahead Log (WAL), stalls replication standby nodes, and risks lock timeouts. The production best practice is batch deletion in small chunks (e.g. 5,000 rows at a time) inside a loop with a small sleep between batches to allow autovacuum and replication to keep up.",
        "codeBlock": "DO $$\nDECLARE rows_deleted INT;\nBEGIN\n  LOOP\n    DELETE FROM audit_logs\n    WHERE id IN (\n      SELECT id FROM audit_logs\n      WHERE created_at < NOW() - INTERVAL '90 days'\n      LIMIT 5000\n    );\n    GET DIAGNOSTICS rows_deleted = ROW_COUNT;\n    EXIT WHEN rows_deleted = 0;\n    PERFORM pg_sleep(0.05); -- brief throttle for replication\n  END LOOP;\nEND $$;"
      },
      {
        "question": "What is the difference between DELETE, TRUNCATE, and DROP TABLE?",
        "answer": "DELETE removes rows one by one, writes full WAL logs, and fires triggers. TRUNCATE instantly deallocates entire data pages, resets sequences, requires an AccessExclusiveLock, and does not fire row triggers. DROP TABLE removes the entire table definition, constraints, indexes, and metadata completely from the system catalog."
      },
      {
        "question": "What happens when you delete a row with Foreign Key dependencies?",
        "answer": "The engine inspects the foreign key constraint definition: ON DELETE RESTRICT (or NO ACTION) immediately aborts the delete with an error if child records exist. ON DELETE CASCADE automatically deletes all referencing child rows. ON DELETE SET NULL sets the referencing child foreign key columns to NULL. If foreign key columns lack indexes, cascading deletes cause full table scans on child tables."
      }
    ],
    "interviewReadyAnswer": "The DELETE statement removes filtered rows while logging each change and checking foreign key referential integrity. In high-volume systems, TRUNCATE is preferred for bulk wipes, while soft-deletes (is_deleted = true) are often used to preserve audit history.",
    "quickTest": {
      "question": "Why does TRUNCATE execute significantly faster than DELETE on a 10-million row table?",
      "options": [
        {
          "key": "A",
          "text": "TRUNCATE bypasses database authentication."
        },
        {
          "key": "B",
          "text": "TRUNCATE deallocates disk data pages directly without scanning rows or logging each row deletion."
        },
        {
          "key": "C",
          "text": "TRUNCATE only works on memory tables."
        },
        {
          "key": "D",
          "text": "TRUNCATE converts all rows into binary files."
        }
      ],
      "correctAnswer": "B",
      "explanation": "TRUNCATE is a DDL operation that deallocates storage extents directly rather than visiting and logging individual rows."
    },
    "mentalModel": "Shredding documents: DELETE shreds individual sheets of paper one by one; TRUNCATE empties the entire recycling bin in a single dump.",
    "codeSnippet": "DELETE FROM cart_items\nWHERE cart_id = 99\nRETURNING id, product_id;",
    "takeaways": [
      "Always double-check WHERE filters before issuing DELETE.",
      "DELETE generates WAL records for each deleted row; TRUNCATE deallocates pages.",
      "Dead tuples from DELETE require VACUUM to reclaim storage space."
    ],
    "commonPitfall": {
      "mistake": "Using DELETE in a script to wipe huge staging tables, saturating transaction logs and disk I/O.",
      "fix": "Use TRUNCATE TABLE for fast and clean table resets."
    },
    "nextTopicId": "distinct-and-limit",
    "prevTopicId": "update-statements"
  },
  {
    "id": "distinct-and-limit",
    "topicNumber": 10,
    "title": "DISTINCT & LIMIT",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Eliminating duplicate rows with DISTINCT, PostgreSQL DISTINCT ON, and deterministic paging with LIMIT and OFFSET.",
    "definition": "DISTINCT deduplicates matching rows from query results, while LIMIT and OFFSET restrict the quantity and starting position of returned tuples.",
    "eli5": "DISTINCT is a duplicate filter: if you have five red marbles, it only hands you one. LIMIT is a plate size: no matter how much food is cooked, it only gives you 10 pieces.",
    "realWorldExample": {
      "description": "An application fetches the top 5 countries where customers reside without duplicates.",
      "tables": [
        {
          "title": "Users Table",
          "headers": [
            "id",
            "name",
            "country"
          ],
          "rows": [
            [
              1,
              "Alice",
              "India"
            ],
            [
              2,
              "Bob",
              "USA"
            ],
            [
              3,
              "Charlie",
              "India"
            ],
            [
              4,
              "David",
              "USA"
            ],
            [
              5,
              "Eve",
              "Germany"
            ]
          ]
        }
      ],
      "explanation": "SELECT DISTINCT country produces: India, USA, Germany."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Deduplicating values with DISTINCT",
        "code": "SELECT DISTINCT country FROM users ORDER BY country;",
        "note": "Sorts or hashes values in memory to discard duplicates."
      },
      {
        "step": "Step 2: Pagination with LIMIT and OFFSET",
        "code": "SELECT id, name, created_at\nFROM users\nORDER BY created_at DESC\nLIMIT 10 OFFSET 20;",
        "note": "Always combine LIMIT with ORDER BY for deterministic results."
      },
      {
        "step": "Step 3: PostgreSQL DISTINCT ON",
        "code": "SELECT DISTINCT ON (user_id) user_id, order_date, total_usd\nFROM orders\nORDER BY user_id, order_date DESC;",
        "note": "Returns the single most recent order for each user."
      }
    ],
    "rulesTable": [
      {
        "rule": "ORDER BY Requirement",
        "explanation": "LIMIT without ORDER BY produces non-deterministic results because relational engines do not guarantee physical row order."
      },
      {
        "rule": "All-Column Scope",
        "explanation": "SELECT DISTINCT a, b deduplicates unique combinations of (a, b), not just column a."
      },
      {
        "rule": "OFFSET Scaling Penalty",
        "explanation": "OFFSET 10000 forces the engine to compute and discard 10,000 rows before returning results."
      },
      {
        "rule": "Execution cost of DISTINCT",
        "explanation": "DISTINCT requires sorting or building an in-memory hash table across all projected columns to deduplicate."
      },
      {
        "rule": "OFFSET pagination performance degradation",
        "explanation": "OFFSET N requires the engine to fetch and discard N rows, causing O(N) linear slowdown on deep pages."
      }
    ],
    "deepDive": {
      "title": "Offset Paging vs Keyset (Cursor) Pagination",
      "description": "OFFSET pagination gets progressively slower on deep pages because the database must scan all preceding rows. Keyset pagination uses indexed WHERE conditions to achieve constant O(1) page lookup times.",
      "codeSnippet": "-- Bad for deep pages (O(N) cost):\nSELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 50000;\n\n-- Good Keyset Pagination (O(log N) index seek):\nSELECT * FROM orders WHERE id > 50000 ORDER BY id LIMIT 20;",
      "warning": "Never use high OFFSET values on multi-million row tables in production APIs."
    },
    "advantages": [
      "DISTINCT eliminates unwanted duplicate records from reports.",
      "LIMIT protects network bandwidth and API response sizes.",
      "DISTINCT ON cleanly solves \"greatest-n-per-group\" query problems."
    ],
    "disadvantages": [
      "DISTINCT triggers expensive in-memory sort or hash operations.",
      "High OFFSET queries cause high disk I/O and CPU waste."
    ],
    "interviewQuestions": [
      {
        "question": "How does the database engine physically execute DISTINCT under the hood?",
        "answer": "The Cost-Based Optimizer chooses between two physical algorithms: 1. Hash Aggregate: the engine hashes each row into an in-memory hash table; duplicate hashes with identical values are discarded. 2. Unique Sort: the engine sorts the entire result set (using QuickSort or external merge sort) and then streams rows while discarding adjacent duplicates. Hash Aggregate is faster if the unique set fits in work_mem."
      },
      {
        "question": "What is the critical performance bug of OFFSET pagination (LIMIT 20 OFFSET 1000000)?",
        "answer": "OFFSET 1,000,000 tells the engine to read 1,000,020 rows from disk, sort them, count up to 1,000,000, throw away the first 1,000,000 rows, and return only the last 20 rows. As page numbers increase, response times degrade linearly from milliseconds to seconds, causing massive disk I/O and CPU burn."
      },
      {
        "question": "How does Keyset (Cursor-Based) Pagination solve the OFFSET performance problem?",
        "answer": "Keyset pagination replaces OFFSET with a SARGable WHERE filter on an indexed column (like id or created_at): SELECT * FROM posts WHERE id > last_seen_id ORDER BY id ASC LIMIT 20; Because id is indexed, the engine performs an O(log N) B-Tree seek directly to the 1,000,001st row and reads exactly 20 rows, remaining ultra-fast (0.1 ms) even on page 1,000,000."
      },
      {
        "question": "What is PostgreSQL’s DISTINCT ON (col) and how is it used in interviews?",
        "answer": "DISTINCT ON is a powerful PostgreSQL extension that keeps only the first row of each group based on the ORDER BY clause. It is the cleanest way to solve the classic \"find the latest order per customer\" interview question without writing complex correlated subqueries or window functions.",
        "codeBlock": "-- Get the single most recent order for each customer:\nSELECT DISTINCT ON (customer_id) customer_id, order_id, total, created_at\nFROM orders\nORDER BY customer_id, created_at DESC;"
      },
      {
        "question": "Why is LIMIT without an ORDER BY clause dangerous in production?",
        "answer": "Relational tables are unordered heaps. Without an explicit ORDER BY clause, the database does not guarantee any deterministic order. Running SELECT * FROM users LIMIT 10 twice in a row can return completely different sets of users if disk pages are cached differently or parallel scan workers finish in varying order."
      }
    ],
    "interviewReadyAnswer": "DISTINCT removes duplicate tuples using in-memory hash or sort aggregates, while LIMIT bounds response sizes. To maintain deterministic paging and sub-millisecond latency, always combine LIMIT with ORDER BY and use keyset pagination instead of high OFFSETs.",
    "quickTest": {
      "question": "What is the primary drawback of using high OFFSET values (e.g. OFFSET 100000) for API pagination?",
      "options": [
        {
          "key": "A",
          "text": "OFFSET is not supported in PostgreSQL."
        },
        {
          "key": "B",
          "text": "The database must still scan and discard the first 100,000 rows, wasting memory and CPU."
        },
        {
          "key": "C",
          "text": "OFFSET automatically locks the table."
        },
        {
          "key": "D",
          "text": "OFFSET inverts the sort order of the results."
        }
      ],
      "correctAnswer": "B",
      "explanation": "OFFSET N requires the query engine to evaluate and throw away the first N rows before returning the requested slice."
    },
    "mentalModel": "Line at an amusement park: LIMIT 5 lets the first 5 people in; OFFSET 100 makes the guard count 100 people and throw them out before letting the next 5 enter.",
    "codeSnippet": "SELECT DISTINCT country FROM users ORDER BY country;\nSELECT * FROM users ORDER BY id DESC LIMIT 10 OFFSET 0;",
    "takeaways": [
      "DISTINCT operates across all projected columns.",
      "Always pair LIMIT with an unambiguous ORDER BY.",
      "Use keyset pagination (WHERE id > last_id) instead of high OFFSET values."
    ],
    "commonPitfall": {
      "mistake": "Using LIMIT without an ORDER BY clause, causing inconsistent row sequences between requests.",
      "fix": "Always provide an explicit, unique ORDER BY column when using LIMIT."
    },
    "nextTopicId": "sql-operators",
    "prevTopicId": "delete-statements"
  }
];
