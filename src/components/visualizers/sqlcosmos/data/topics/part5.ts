import { SqlTopic } from './types';

export const TOPICS_41_TO_50: SqlTopic[] = [
  {
    "id": "database-denormalization",
    "topicNumber": 41,
    "title": "Table Partitioning: Range, List & Hash Strategies",
    "category": "architecture",
    "difficulty": "Advanced",
    "summary": "Intentional data redundancy, read optimization trade-offs, and horizontal table partitioning by Range, List, and Hash.",
    "definition": "Table Partitioning splits a logically large table into smaller physical backing tables (partitions) based on a key (Range, List, or Hash) to enable partition pruning and rapid maintenance.",
    "eli5": "Instead of having one giant encyclopedia with 10 million pages where finding anything takes forever, you split it into 12 volumes by month. If you want July, you pull Volume 7 off the shelf and ignore the other 11.",
    "realWorldExample": {
      "description": "An audit log table receiving 10 million rows per day partitioned by month.",
      "tables": [
        {
          "title": "Partition Layout",
          "headers": [
            "Partition Name",
            "Boundaries",
            "Row Count"
          ],
          "rows": [
            [
              "logs_2026_01",
              ">= 2026-01-01 AND < 2026-02-01",
              "300,000,000"
            ],
            [
              "logs_2026_02",
              ">= 2026-02-01 AND < 2026-03-01",
              "280,000,000"
            ]
          ]
        }
      ],
      "explanation": "A query filtering for February skips the January partition entirely (Partition Pruning)."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Declarative Range Partitioning in PostgreSQL",
        "code": "CREATE TABLE measurement_logs (\n  id BIGINT GENERATED ALWAYS AS IDENTITY,\n  measured_at TIMESTAMPTZ NOT NULL,\n  metric_value NUMERIC(10, 2),\n  PRIMARY KEY (id, measured_at)\n) PARTITION BY RANGE (measured_at);\n\n-- Create physical child partitions:\nCREATE TABLE measurement_2026_01\n  PARTITION OF measurement_logs\n  FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');\n\nCREATE TABLE measurement_2026_02\n  PARTITION OF measurement_logs\n  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');"
      }
    ],
    "rulesTable": [
      {
        "rule": "Partition Key in Primary Key",
        "explanation": "The partition key column must be part of the table’s primary key and unique constraints."
      },
      {
        "rule": "Partition Pruning",
        "explanation": "When a query has WHERE measured_at >= '2026-01-15', the engine only reads the 2026_01 partition, ignoring all others."
      },
      {
        "rule": "Instant Purging via DROP",
        "explanation": "Dropping a monthly partition (DROP TABLE measurement_2026_01) drops hundreds of millions of rows in 5ms without WAL overhead."
      },
      {
        "rule": "Partition Pruning mechanics",
        "explanation": "The Cost-Based Optimizer inspects query WHERE conditions and excludes non-matching child partitions from execution plans."
      },
      {
        "rule": "Instant data lifecycle truncation",
        "explanation": "Dropping or detaching an old partition (e.g. DROP TABLE orders_2022) is instantaneous metadata DDL compared to DELETE."
      }
    ],
    "deepDive": {
      "title": "Range vs List vs Hash Partitioning Strategies",
      "description": "1) Range Partitioning: Assigns rows based on numerical or temporal ranges (ideal for logs and time-series). 2) List Partitioning: Assigns rows by explicit key values (e.g. region: US, EU, APAC). 3) Hash Partitioning: Distributes rows uniformly across N partitions by hashing a key (e.g. user_id) to balance I/O across storage disks.",
      "codeSnippet": "-- Hash partitioning to distribute user writes evenly:\nCREATE TABLE users_hash (id BIGINT, data JSONB, PRIMARY KEY (id))\nPARTITION BY HASH (id);\n\nCREATE TABLE users_p0 PARTITION OF users_hash FOR VALUES WITH (MODULUS 4, REMAINDER 0);\nCREATE TABLE users_p1 PARTITION OF users_hash FOR VALUES WITH (MODULUS 4, REMAINDER 1);",
      "warning": "Do not over-partition into thousands of tiny tables; metadata overhead in the planner can degrade performance."
    },
    "advantages": [
      "Partition pruning drastically reduces disk I/O on large tables.",
      "Instant data lifecycle eviction via DROP TABLE partition instead of slow DELETE."
    ],
    "disadvantages": [
      "Unique constraints across the whole table must include the partition key."
    ],
    "interviewQuestions": [
      {
        "question": "What are the three core declarative partitioning strategies and when should you use each?",
        "answer": "1. Range Partitioning: Partitions data based on ranges of values (e.g. by month or year); ideal for time-series logs, audit events, and financial transactions. 2. List Partitioning: Partitions data by explicit discrete values (e.g. by country or tenant ID); ideal for multi-tenant data isolation. 3. Hash Partitioning: Partitions data using a hash modulus on a key (e.g. hash(user_id) % 16); ideal for evenly distributing write traffic across disks when no natural date range exists."
      },
      {
        "question": "What is Partition Pruning and how does it improve query performance?",
        "answer": "Partition Pruning is a Cost-Based Optimizer optimization where the engine evaluates the query WHERE clause against partition boundary constraints. If a query requests WHERE created_at = '2026-06-15', the optimizer completely eliminates the other 11 monthly partition tables from the query plan at compile time, scanning only the single matching child table and skipping 92% of disk blocks."
      },
      {
        "question": "Why is \"DETACH PARTITION\" or \"DROP TABLE partition\" preferred over \"DELETE FROM table WHERE date < ...\"?",
        "answer": "DELETE scans millions of rows, acquires row-level locks, writes massive Write-Ahead Log (WAL) volume, causes replication lag, leaves dead tuple bloat, and takes hours. Detaching or dropping an old partition table is a pure DDL metadata operation: the operating system immediately unlinks the table files from disk in 2 milliseconds with zero dead tuple bloat."
      },
      {
        "question": "Can you enforce a global UNIQUE constraint across all partitions in PostgreSQL?",
        "answer": "In declarative partitioning, a UNIQUE constraint or Primary Key on a partitioned table MUST include all partitioning columns (e.g. PRIMARY KEY (id, created_at)). PostgreSQL cannot enforce a unique constraint across partitions on id alone because each child partition maintains its own local B-Tree index; global cross-partition indexes do not exist natively."
      },
      {
        "question": "What is the performance overhead of having TOO MANY table partitions (e.g. 5,000 partitions)?",
        "answer": "Having thousands of partitions causes severe performance degradation: 1. The query planner must evaluate constraints and locks across all 5,000 tables, increasing planning time from 1 ms to 200 ms, 2. It consumes massive amounts of database connection memory (relcache buffers), 3. Autovacuum and checkpoint processes must manage thousands of open file descriptors."
      }
    ],
    "interviewReadyAnswer": "Table partitioning divides massive tables into manageable physical chunks by Range, List, or Hash. It enables partition pruning so queries scan only relevant data blocks and allows instant data retention cleanup via partition detachment or dropping.",
    "quickTest": {
      "question": "Why does dropping a child partition execute orders of magnitude faster than running a DELETE statement for the same date range?",
      "options": [
        {
          "key": "A",
          "text": "Dropping a partition unlinks the underlying disk files directly without row-by-row scanning or transaction undo logging."
        },
        {
          "key": "B",
          "text": "DELETE only works on memory tables."
        },
        {
          "key": "C",
          "text": "Dropping a partition is not transaction-safe."
        },
        {
          "key": "D",
          "text": "DROP converts rows into JSON format."
        }
      ],
      "correctAnswer": "A",
      "explanation": "DROP TABLE is a DDL operation that unlinks file forks on disk directly, whereas DELETE visits every row, logs WAL, and updates index pointers."
    },
    "mentalModel": "Filing Cabinet with year labels: If you need tax documents from 2026, you open the 2026 drawer only. To throw out 2010, you discard that entire folder.",
    "codeSnippet": "SELECT * FROM measurement_logs\nWHERE measured_at >= '2026-02-10' AND measured_at < '2026-02-15';",
    "takeaways": [
      "Partition key must be included in unique constraints.",
      "Partition pruning skips irrelevant child tables.",
      "DROP PARTITION achieves zero-cost archival of expired data."
    ],
    "commonPitfall": {
      "mistake": "Omitting the partition key from WHERE clauses, forcing the engine to scan every single partition.",
      "fix": "Always filter by the partition key in high-frequency queries."
    },
    "nextTopicId": "database-indexing",
    "prevTopicId": "database-normalization"
  },
  {
    "id": "database-indexing",
    "topicNumber": 42,
    "title": "Database Indexing",
    "category": "indexing",
    "difficulty": "Intermediate",
    "summary": "B-Tree page structures, Hash indexes, composite indexes, the leftmost prefix rule, and index write amplification.",
    "definition": "A database index is an auxiliary on-disk search structure (predominantly a balanced B+ Tree) that allows the storage engine to locate specific rows in O(log N) time without scanning the entire table.",
    "eli5": "An index is the alphabetical index at the back of a 1,000-page textbook. Instead of reading every page from page 1 to 1,000 to find \"Photosynthesis\", you look in the index, find \"page 432\", and turn directly to it.",
    "realWorldExample": {
      "description": "Looking up a user by email among 50 million records.",
      "tables": [
        {
          "title": "Sequential Scan vs B-Tree Index Scan",
          "headers": [
            "Metric",
            "Without Index (Seq Scan)",
            "With B-Tree Index"
          ],
          "rows": [
            [
              "Algorithm",
              "O(N) linear scan",
              "O(log N) tree traversal"
            ],
            [
              "Disk Pages Read",
              "500,000 8 KB pages",
              "3 to 4 index pages"
            ],
            [
              "Execution Time",
              "4,500 ms",
              "0.05 ms"
            ]
          ]
        }
      ],
      "explanation": "A 3-level B-Tree index resolves point lookups in 3 page reads."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Create B-Tree index",
        "code": "CREATE INDEX idx_users_email ON users(email);",
        "note": "B-Tree is the default index type in PostgreSQL and MySQL."
      },
      {
        "step": "Step 2: Create Composite Index with Leftmost Prefix order",
        "code": "CREATE INDEX idx_orders_user_status ON orders(user_id, status);",
        "note": "Optimizes queries filtering by (user_id) or (user_id AND status)."
      },
      {
        "step": "Step 3: Unique Index",
        "code": "CREATE UNIQUE INDEX idx_users_uuid ON users(uuid);"
      }
    ],
    "rulesTable": [
      {
        "rule": "B-Tree Balance",
        "explanation": "All leaf pages in a B+ Tree reside at the exact same depth from the root."
      },
      {
        "rule": "Leftmost Prefix Rule",
        "explanation": "A composite index on (A, B) can accelerate queries on (A) or (A, B), but CANNOT accelerate queries filtering solely on (B)."
      },
      {
        "rule": "Write Amplification",
        "explanation": "Every INSERT, UPDATE, or DELETE on a table requires updating every index on that table."
      },
      {
        "rule": "B+ Tree fanout and height",
        "explanation": "8 KB B+ Tree pages store hundreds of keys per page, keeping tree height shallow (3 to 4 levels for 100M rows)."
      },
      {
        "rule": "Leftmost prefix rule for compound indexes",
        "explanation": "A composite index on (A, B, C) can satisfy queries filtering on (A), (A, B), or (A, B, C), but NOT (B) or (C) alone."
      }
    ],
    "deepDive": {
      "title": "B+ Tree Page Split Mechanics & Write Penalty",
      "description": "When an index leaf page fills up (typically 8 KB), inserting a new key causes a page split: the engine allocates a new page, moves half the keys over, and inserts a routing key into the parent branch page. This causes write amplification and fragmentation if insertions are random (like UUIDv4).",
      "codeSnippet": "-- Prefer sequential keys (IDENTITY, BIGINT, UUIDv7) over random UUIDv4:\n-- Random UUIDv4 causes random page writes and catastrophic cache eviction.",
      "warning": "Do not index every column; unused indexes slow down writes and waste buffer memory."
    },
    "advantages": [
      "Transforms O(N) full table scans into O(log N) point lookups.",
      "Enforces uniqueness and powers foreign key checks."
    ],
    "disadvantages": [
      "Consumes additional disk and RAM.",
      "Slows down INSERT, UPDATE, and DELETE operations."
    ],
    "interviewQuestions": [
      {
        "question": "Explain the internal B+ Tree structure: Root, Branch, Leaf Pages, and Leaf Linked Lists.",
        "answer": "A B+ Tree is a balanced multi-way search tree where all leaf pages reside at the exact same depth. Internal nodes (Root and Branch pages) store routing keys and 4-byte page pointers. Leaf pages store the actual index keys and 6-byte heap tuple pointers (CTID). Unlike standard B-Trees, data is stored ONLY in leaf pages, and all leaf pages are doubly linked in sorted order, enabling fast point lookups (O(log N)) and sequential range scans."
      },
      {
        "question": "What causes B-Tree Page Splits and how do they lead to index fragmentation?",
        "answer": "When a new key is inserted into a full 8 KB leaf page, the page cannot hold the new entry. The engine must allocate a new 8 KB page, move half the keys to the new page, and insert a new routing key into the parent branch page. Frequent page splits caused by random keys (like UUIDs) leave index pages half-empty (50% fillfactor), wasting RAM and disk space."
      },
      {
        "question": "What is the Leftmost Prefix Rule for composite (multi-column) indexes?",
        "answer": "A composite B-Tree index on (country, status, created_at) sorts keys first by country; within identical countries, it sorts by status; within identical statuses, by created_at. A query filtering on (country) or (country, status) can navigate the B-Tree directly. A query filtering on status alone cannot use the index because keys are sorted primarily by country first."
      },
      {
        "question": "What is the difference between B-Tree, Hash, GIN, and GiST indexes in PostgreSQL?",
        "answer": "1. B-Tree: Default balanced tree for equality (=) and range queries (<, >, BETWEEN). 2. Hash: O(1) in-memory hash lookup for equality (=) only. 3. GIN (Generalized Inverted Index): Maps composite elements (array values, JSONB keys, text lexemes) to rows; ideal for tags, full-text search, and JSONB. 4. GiST (Generalized Search Tree): Balanced tree for geometric, geospatial (PostGIS), and range types."
      },
      {
        "question": "Why does adding an index speed up reads but slow down writes (INSERT, UPDATE, DELETE)?",
        "answer": "Every time a row is inserted, the engine must write the row to the heap page AND traverse every single index B-Tree on that table to insert index keys into leaf pages. If a table has 10 indexes, one INSERT causes 11 disk writes! Updates to indexed columns also require updating the corresponding index B-Trees."
      }
    ],
    "interviewReadyAnswer": "Database indexes are balanced search structures (primarily B+ Trees) that reduce lookup complexity from O(N) to O(log N). Engineers must design composite indexes around the Leftmost Prefix rule while balancing write amplification against read performance.",
    "quickTest": {
      "question": "Given an index on (country, status, created_at), which query CANNOT use this index efficiently?",
      "options": [
        {
          "key": "A",
          "text": "WHERE country = 'US' AND status = 'active'"
        },
        {
          "key": "B",
          "text": "WHERE country = 'US'"
        },
        {
          "key": "C",
          "text": "WHERE status = 'active' AND created_at > '2026-01-01'"
        },
        {
          "key": "D",
          "text": "WHERE country = 'US' AND status = 'active' AND created_at > '2026-01-01'"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Query C omits the leftmost column (country), violating the Leftmost Prefix rule and preventing standard B-Tree index traversal."
    },
    "mentalModel": "Phone Book sorted by (Last Name, First Name): You can instantly find everyone with Last Name \"Smith\", but you cannot find all people with First Name \"John\" without reading the entire book.",
    "codeSnippet": "CREATE INDEX idx_customers_country_city ON customers(country, city);\nSELECT * FROM customers WHERE country = 'India' AND city = 'Bangalore';",
    "takeaways": [
      "B+ Trees guarantee O(log N) search complexity.",
      "Composite indexes require queries to match the leftmost prefix.",
      "Every index adds overhead to INSERT and UPDATE operations."
    ],
    "commonPitfall": {
      "mistake": "Indexing column B and wondering why index on (A, B) isn't used when filtering only on B.",
      "fix": "Follow the leftmost prefix rule or create a separate index on B."
    },
    "nextTopicId": "query-optimization",
    "prevTopicId": "database-denormalization"
  },
  {
    "id": "query-optimization",
    "topicNumber": 43,
    "title": "Query Optimization",
    "category": "indexing",
    "difficulty": "Advanced",
    "summary": "EXPLAIN, EXPLAIN ANALYZE, Cost-Based Optimizer (CBO) decisions, sequential vs index scans, and buffer cache metrics.",
    "definition": "Query Optimization is the internal database process where the Cost-Based Optimizer (CBO) analyzes table statistics and evaluates candidate execution plans to execute a query with minimal I/O and CPU cost.",
    "eli5": "Query optimization is GPS navigation for your database: given traffic, roadblocks, and highway speeds (indexes and statistics), it calculates the fastest route before the car even starts moving.",
    "realWorldExample": {
      "description": "Diagnosing an API endpoint query that suddenly slowed down from 5ms to 800ms.",
      "tables": [
        {
          "title": "EXPLAIN Scan Types",
          "headers": [
            "Plan Node",
            "When Used",
            "Relative Cost"
          ],
          "rows": [
            [
              "Seq Scan",
              "Large percentage of table or unindexed column",
              "High (Reads all disk pages)"
            ],
            [
              "Index Scan",
              "Selective filter lookup (few rows)",
              "Very Fast (B-Tree traversal + heap fetch)"
            ],
            [
              "Index-Only Scan",
              "All projected columns exist inside index leaves",
              "Fastest (Zero heap lookups)"
            ],
            [
              "Bitmap Index Scan",
              "Combines multiple index filters into bitmask",
              "Fast for medium selectivity"
            ]
          ]
        }
      ],
      "explanation": "Running EXPLAIN ANALYZE reveals whether the engine is using an index or scanning raw disk pages."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Inspect query plan without executing",
        "code": "EXPLAIN\nSELECT * FROM orders WHERE user_id = 942;",
        "note": "Shows estimated cost, row counts, and plan tree without running the query."
      },
      {
        "step": "Step 2: Real execution with timings and buffer stats",
        "code": "EXPLAIN (ANALYZE, BUFFERS, TIMING)\nSELECT id, total_amount\nFROM orders\nWHERE user_id = 942 AND status = 'completed';",
        "note": "ANALYZE executes the query, reporting real wall-clock execution time and buffer cache hits."
      }
    ],
    "rulesTable": [
      {
        "rule": "Cost Formula",
        "explanation": "Cost = (Disk Pages * seq_page_cost) + (CPU Tuples * cpu_tuple_cost)."
      },
      {
        "rule": "ANALYZE Caution",
        "explanation": "EXPLAIN ANALYZE actually executes the query! If you run it on DELETE or UPDATE, data will be modified!"
      },
      {
        "rule": "Catalog Statistics",
        "explanation": "The optimizer relies on pg_statistic (refreshed by ANALYZE) to estimate row selectivity."
      },
      {
        "rule": "Cost formula components",
        "explanation": "CBO Cost = (pages * seq_page_cost) + (random_pages * random_page_cost) + (tuples * cpu_tuple_cost)."
      },
      {
        "rule": "Four primary scan types",
        "explanation": "Sequential Scan (full heap), Index Scan (index + heap), Index-Only Scan (leaves only), and Bitmap Index Scan."
      }
    ],
    "deepDive": {
      "title": "Reading an EXPLAIN ANALYZE Plan: Cost, Rows, Buffers",
      "description": "A plan line like: \"Index Scan using idx_orders on orders (cost=0.42..8.45 rows=2 width=32)\" indicates: 1) startup cost: 0.42, 2) total estimated cost: 8.45, 3) estimated matching rows: 2. Buffers: shared hit=3 means 3 pages were read directly from RAM buffer pool.",
      "codeSnippet": "Index Scan using idx_orders_user_id on orders (cost=0.42..8.45 rows=2 width=32) (actual time=0.040..0.042 rows=2 loops=1)\n  Index Cond: (user_id = 942)\n  Buffers: shared hit=3 read=1",
      "warning": "If estimated rows differ from actual rows by an order of magnitude (e.g. est=1 vs act=10,000), run ANALYZE to refresh table statistics."
    },
    "advantages": [
      "Gives full transparency into database execution choices.",
      "Enables targeted indexing and performance tuning."
    ],
    "disadvantages": [
      "Interpreting complex 50-node query execution trees requires deep storage engine knowledge."
    ],
    "interviewQuestions": [
      {
        "question": "How do you read and interpret an \"EXPLAIN (ANALYZE, BUFFERS)\" execution plan in PostgreSQL?",
        "answer": "1. Cost (e.g. cost=0.42..8.45 rows=2 width=32): 0.42 is the startup cost before the first row is emitted; 8.45 is total cost; rows is optimizer estimate; width is average byte size per tuple. 2. Actual Time: real wall-clock execution time in milliseconds. 3. Buffers: shared hit=3 (pages found in RAM cache) vs read=1 (pages fetched from physical disk). High disk reads indicate I/O bottlenecks."
      },
      {
        "question": "What are the four primary table scan mechanisms used by the query optimizer?",
        "answer": "1. Sequential Scan: reads all 8 KB pages sequentially; optimal for full table exports or tables < 100 pages. 2. Index Scan: traverses B-Tree to find leaf pointers, then fetches corresponding tuples from heap pages one by one. 3. Index-Only Scan: satisfies query entirely from B-Tree leaf payload without touching heap pages. 4. Bitmap Index Scan: scans index, builds a bitmap of matching heap page block IDs in RAM, sorts them sequentially, and fetches heap pages in batch."
      },
      {
        "question": "Why did the optimizer choose a Sequential Scan over my B-Tree index?",
        "answer": "1. Low Selectivity: if a query matches > 15-20% of the table, sequential block reads are physically faster than random index seek + random heap fetches. 2. Small Table: if the table fits in 3 disk blocks, scanning all blocks takes less CPU than navigating a B-Tree. 3. Non-SARGable predicate: column was wrapped in a function or suffered implicit type casting. 4. Stale statistics: autovacuum has not updated pg_statistic."
      },
      {
        "question": "What is the difference between Planning Time and Execution Time?",
        "answer": "Planning Time is the time taken by the Cost-Based Optimizer to parse the AST, check statistics, enumerate join orders, evaluate costs, and pick the physical plan tree. Execution Time is the actual time taken by the storage engine to execute the plan operators, fetch disk blocks, and stream tuples."
      },
      {
        "question": "What is Join Reordering and how does the optimizer prevent combinatorial explosion (GEQO)?",
        "answer": "For a query joining N tables, there are (2N - 1)! / (N - 1)! possible join trees. For small joins (N < 12), the planner uses dynamic programming to test all valid join orders. When N exceeds from_collapse_limit or geqo_threshold, the planner switches to Genetic Query Optimization (GEQO), using heuristic evolutionary algorithms to find a near-optimal plan without exhausting CPU memory."
      }
    ],
    "interviewReadyAnswer": "The Cost-Based Optimizer determines execution plans by evaluating estimated I/O and CPU costs against catalog statistics. EXPLAIN ANALYZE provides empirical profiling data, showing actual execution time, scan nodes, and buffer pool hits.",
    "quickTest": {
      "question": "What is the danger of running \"EXPLAIN ANALYZE DELETE FROM sessions WHERE expired = true;\" in production?",
      "options": [
        {
          "key": "A",
          "text": "It fails with a syntax error."
        },
        {
          "key": "B",
          "text": "EXPLAIN ANALYZE actually executes the statement, permanently deleting the matching rows."
        },
        {
          "key": "C",
          "text": "It creates duplicate tables."
        },
        {
          "key": "D",
          "text": "It disables all indexes."
        }
      ],
      "correctAnswer": "B",
      "explanation": "Unlike plain EXPLAIN, EXPLAIN ANALYZE executes the statement. Running it with DML commands mutates real data."
    },
    "mentalModel": "GPS Navigation: Calculating route times based on road types (indexes vs table scans) before committing to driving the vehicle.",
    "codeSnippet": "EXPLAIN (ANALYZE, BUFFERS)\nSELECT c.name, o.total\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE c.country = 'US';",
    "takeaways": [
      "Use EXPLAIN to view estimated plans; EXPLAIN ANALYZE for real timings.",
      "Watch for discrepancies between estimated and actual row counts.",
      "Keep database statistics fresh with regular ANALYZE runs."
    ],
    "commonPitfall": {
      "mistake": "Relying on EXPLAIN alone and not noticing that actual rows retrieved are 1,000x higher than estimated due to stale statistics.",
      "fix": "Run ANALYZE table_name to update table histograms."
    },
    "nextTopicId": "database-transactions",
    "prevTopicId": "database-indexing"
  },
  {
    "id": "database-transactions",
    "topicNumber": 44,
    "title": "Transactions",
    "category": "transactions",
    "difficulty": "Intermediate",
    "summary": "BEGIN, COMMIT, ROLLBACK, SAVEPOINT, nested transaction mechanics, and transaction error handling.",
    "definition": "A database transaction is a logical unit of work comprising one or more SQL operations that execute with all-or-nothing atomicity.",
    "eli5": "A transaction is an all-or-nothing promise. If you transfer $100 to a friend, step 1 takes $100 from you, and step 2 gives $100 to your friend. If step 2 fails, step 1 is cancelled completely so nobody loses money.",
    "realWorldExample": {
      "description": "Transferring $500 between two bank accounts safely.",
      "tables": [
        {
          "title": "Account Balances",
          "headers": [
            "Account",
            "Initial",
            "Step 1 (Deduct)",
            "Step 2 (Credit)"
          ],
          "rows": [
            [
              "Alice (Sender)",
              "$1,000",
              "$500",
              "$500"
            ],
            [
              "Bob (Receiver)",
              "$200",
              "$200",
              "$700"
            ]
          ]
        }
      ],
      "explanation": "If the server crashes between Step 1 and Step 2, ROLLBACK ensures Alice does not lose $500."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Standard atomic transaction",
        "code": "BEGIN;\n\nUPDATE accounts SET balance = balance - 500 WHERE id = 1;\nUPDATE accounts SET balance = balance + 500 WHERE id = 2;\n\n-- If all validations pass:\nCOMMIT;",
        "note": "Either both updates persist or neither does."
      },
      {
        "step": "Step 2: Partial rollback using SAVEPOINT",
        "code": "BEGIN;\nINSERT INTO orders (id, user_id) VALUES (101, 1);\n\nSAVEPOINT before_coupon;\nUPDATE coupons SET used = true WHERE code = 'INVALID_CODE';\n-- Fails validation:\nROLLBACK TO SAVEPOINT before_coupon;\n\n-- Order is still inserted and committed:\nCOMMIT;",
        "note": "Savepoints allow partial rollback of statements inside an active transaction."
      }
    ],
    "rulesTable": [
      {
        "rule": "All-or-Nothing",
        "explanation": "If an error occurs or ROLLBACK is issued, all changes made inside the transaction are completely undone."
      },
      {
        "rule": "Autocommit Mode",
        "explanation": "By default, standalone SQL statements outside a BEGIN block execute inside their own single-statement autocommit transaction."
      },
      {
        "rule": "Savepoint Nesting",
        "explanation": "Savepoints enable emulated nested transactions in PostgreSQL."
      },
      {
        "rule": "Write-Ahead Logging (WAL) protocol",
        "explanation": "WAL changes must be flushed to durable disk before dirty buffer pages can be written to the heap."
      },
      {
        "rule": "Savepoint partial rollback",
        "explanation": "ROLLBACK TO SAVEPOINT rolls back mutations made after the savepoint without aborting the parent transaction."
      }
    ],
    "deepDive": {
      "title": "Write-Ahead Logging (WAL) and Durability",
      "description": "When COMMIT is issued, the database engine does NOT immediately write modified table pages to disk. Instead, it writes a compact record to the Write-Ahead Log (WAL) and flushes it to disk via fsync(). If power fails 1 millisecond later, the database replays WAL records to reconstruct the committed state (ARIES recovery).",
      "codeSnippet": "-- WAL flow:\n-- 1. Mutate page in RAM buffer pool\n-- 2. Append change record to WAL buffer\n-- 3. On COMMIT: fsync() WAL buffer to disk\n-- 4. Later: Checkpointer flushes dirty RAM pages to table data files",
      "warning": "Long-running open transactions prevent vacuuming and hold exclusive locks, paralyzing production databases."
    },
    "advantages": [
      "Guarantees mathematical consistency across multi-table writes.",
      "Enables error recovery without leaving partial corrupted data."
    ],
    "disadvantages": [
      "Holding transactions open too long causes connection pool exhaustion and lock timeouts."
    ],
    "interviewQuestions": [
      {
        "question": "What happens at the database storage engine level when you issue COMMIT?",
        "answer": "When a client executes COMMIT, the database engine does NOT immediately flush all modified 8 KB data pages to table files (that would be slow random I/O). Instead, it appends a Commit Record to the sequential Write-Ahead Log (WAL) buffer and executes an fsync() system call, flushing the log to durable disk. Once WAL is on disk, the transaction is guaranteed durable and the engine acknowledges success."
      },
      {
        "question": "How do SAVEPOINT and ROLLBACK TO SAVEPOINT work under the hood?",
        "answer": "A SAVEPOINT marks an intermediate logical point within an active transaction block. If a subsequent statement fails (e.g. a foreign key violation or balance error), the application can issue ROLLBACK TO SAVEPOINT sp1; The engine invalidates all tuple mutations created after the savepoint without aborting the parent transaction, allowing subsequent statements to continue and commit."
      },
      {
        "question": "What is the difference between an Implicit Transaction and an Explicit Transaction?",
        "answer": "An Explicit Transaction starts with an explicit BEGIN or START TRANSACTION and ends with COMMIT or ROLLBACK. An Implicit Transaction (Autocommit mode) wraps every individual standalone SQL statement in its own automatic transaction: the statement begins, executes, and automatically commits immediately upon completion."
      },
      {
        "question": "What is Transaction ID (XID) wraparound in PostgreSQL and how is it prevented?",
        "answer": "PostgreSQL uses a 32-bit integer for transaction IDs, providing 4.2 billion unique IDs. Because comparison logic treats half the IDs as in the past and half in the future, if a database runs for 2 billion transactions without maintenance, old transaction IDs wrap around and appear to be in the future, causing historical data to suddenly disappear! Autovacuum freeze runs periodically to convert old XIDs into a special FrozenTransactionId."
      },
      {
        "question": "Why are long-running open transactions dangerous in production databases?",
        "answer": "1. They hold row and table locks, causing lock queues and application timeouts. 2. In MVCC, autovacuum CANNOT clean up dead tuples that were created after the oldest active transaction started, causing severe table and index bloat. 3. They prevent WAL logs from being recycled, filling up disk storage."
      }
    ],
    "interviewReadyAnswer": "Transactions bundle multiple SQL operations into an atomic unit using BEGIN, COMMIT, and ROLLBACK. Changes are made durable via Write-Ahead Logging (WAL), with SAVEPOINTS enabling granular partial error recovery.",
    "quickTest": {
      "question": "What happens to changes made within a transaction if a server experiences a sudden power outage before COMMIT is issued?",
      "options": [
        {
          "key": "A",
          "text": "All changes are permanently saved."
        },
        {
          "key": "B",
          "text": "The changes are automatically rolled back during database startup recovery."
        },
        {
          "key": "C",
          "text": "Only the first statement is saved."
        },
        {
          "key": "D",
          "text": "The database marks the table as corrupt."
        }
      ],
      "correctAnswer": "B",
      "explanation": "Uncommitted transactions are never made durable; during recovery, the engine rolls back any uncommitted transactions recorded in the WAL."
    },
    "mentalModel": "Atomic capsule: Pack all items into a sealed capsule. If anything breaks before closing the hatch, the entire capsule is discarded intact.",
    "codeSnippet": "BEGIN;\nUPDATE inventory SET stock = stock - 1 WHERE item_id = 99;\nINSERT INTO order_log (item_id, sold_at) VALUES (99, NOW());\nCOMMIT;",
    "takeaways": [
      "Transactions guarantee all-or-nothing atomicity.",
      "SAVEPOINT allows partial rollbacks inside transactions.",
      "Keep transactions short to prevent lock contention and connection pool exhaustion."
    ],
    "commonPitfall": {
      "mistake": "Performing slow external HTTP API calls or file uploads inside an open database transaction block.",
      "fix": "Perform external network calls outside the transaction; keep the database transaction strictly under 10ms."
    },
    "nextTopicId": "acid-properties",
    "prevTopicId": "query-optimization"
  },
  {
    "id": "acid-properties",
    "topicNumber": 45,
    "title": "ACID Properties",
    "category": "transactions",
    "difficulty": "Advanced",
    "summary": "Atomicity, Consistency, Isolation, and Durability guarantees and their physical database engine implementations.",
    "definition": "ACID is the set of four foundational guarantees (Atomicity, Consistency, Isolation, Durability) that ensure reliable processing of database transactions despite errors, crashes, or concurrent access.",
    "eli5": "ACID is the ultimate safety guarantee for money: either the transfer happens completely or not at all (A), rules are never broken (C), other people can't snoop on money while it moves (I), and once confirmed, a power outage can't erase it (D).",
    "realWorldExample": {
      "description": "A stock trade execution platform handling millions of dollars in concurrent order fills.",
      "tables": [
        {
          "title": "The 4 Pillars of ACID",
          "headers": [
            "Property",
            "What it Guarantees",
            "Physical Database Mechanism"
          ],
          "rows": [
            [
              "Atomicity",
              "All-or-nothing execution",
              "Undo logs / Write-Ahead Log (WAL)"
            ],
            [
              "Consistency",
              "Transitions between valid states",
              "Constraints (PK, FK, CHECK, Types)"
            ],
            [
              "Isolation",
              "Concurrent transactions don't interfere",
              "Locks, MVCC, Snapshot Isolation"
            ],
            [
              "Durability",
              "Committed data survives power failure",
              "fsync() of WAL to non-volatile storage"
            ]
          ]
        }
      ],
      "explanation": "ACID guarantees that even if a lightning strike hits the data center, settled balances remain 100% accurate."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: ACID transactional demonstration",
        "code": "BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;\n\n-- Atomicity & Consistency:\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\n\n-- Durability guaranteed upon COMMIT:\nCOMMIT;"
      }
    ],
    "rulesTable": [
      {
        "rule": "Atomicity (A)",
        "explanation": "If any statement fails, the entire transaction rolls back."
      },
      {
        "rule": "Consistency (C)",
        "explanation": "Transactions must transition the database from one valid state to another, obeying all schema constraints."
      },
      {
        "rule": "Isolation (I)",
        "explanation": "Intermediate uncommitted states are invisible to concurrent transactions."
      },
      {
        "rule": "Durability (D)",
        "explanation": "Once committed, data is written to non-volatile disk and survives server crashes."
      },
      {
        "rule": "ARIES recovery protocol",
        "explanation": "Engines recover from power failure using Analysis, Redo (replay WAL), and Undo (rollback active TX) phases."
      },
      {
        "rule": "fsync durability guarantee",
        "explanation": "Durability relies on the operating system flushing write caches to non-volatile disk platters via fsync."
      }
    ],
    "deepDive": {
      "title": "How Engines Guarantee Durability without Crashing Disk I/O",
      "description": "Writing random 8 KB table pages to SSD on every commit would kill database throughput. Instead, engines append compact delta records to a sequential Write-Ahead Log (WAL) file and issue an fsync() call. Sequential writes are 100x faster than random page writes, enabling high-performance durability.",
      "codeSnippet": "-- Durability setting in PostgreSQL:\n-- synchronous_commit = on (Guarantees WAL is flushed before COMMIT returns to client)",
      "warning": "Setting synchronous_commit = off improves write speed but risks losing the last few milliseconds of transactions upon power loss."
    },
    "advantages": [
      "Absolute reliability for mission-critical financial and medical records.",
      "Protects data integrity against unexpected system crashes and power cuts."
    ],
    "disadvantages": [
      "Strict isolation and fsync() flushes introduce latency compared to non-ACID NoSQL stores."
    ],
    "interviewQuestions": [
      {
        "question": "Explain each of the four ACID properties with concrete database engine mechanisms.",
        "answer": "1. Atomicity: All mutations succeed or none do; implemented via Write-Ahead Logging (WAL) and Undo logs. 2. Consistency: Database state transitions strictly preserve all schema constraints, foreign keys, and invariants. 3. Isolation: Concurrent transactions do not interfere with each other; implemented via Lock Managers (2PL) and MVCC snapshots. 4. Durability: Committed state survives crashes and power outages; implemented via fsync() flushing WAL records to non-volatile storage."
      },
      {
        "question": "What is the Write-Ahead Logging (WAL) protocol and why is it essential for Atomicity and Durability?",
        "answer": "The WAL protocol dictates that log records describing a change MUST be flushed to persistent disk BEFORE the corresponding dirty data page in shared RAM is allowed to be written to disk. If the server loses power, the database boots up, replays the WAL logs during the Redo phase to restore committed transactions, and reverses uncommitted transactions during the Undo phase (ARIES recovery)."
      },
      {
        "question": "What are the four ANSI SQL Isolation Levels and which anomalies does each prevent?",
        "answer": "1. Read Uncommitted: Allows dirty reads, non-repeatable reads, and phantom reads. 2. Read Committed: Prevents dirty reads; allows non-repeatable reads and phantom reads. 3. Repeatable Read: Prevents dirty reads and non-repeatable reads; prevents phantom reads in PostgreSQL (MVCC snapshot); allows write skew. 4. Serializable: Prevents ALL concurrency anomalies using Serializable Snapshot Isolation (SSI) or strict 2-Phase Locking."
      },
      {
        "question": "What is the \"fsync=off\" trap in database benchmarks?",
        "answer": "Setting fsync=off tells the engine to acknowledge commits as soon as data hits the operating system memory buffer, without waiting for the disk hardware to write the bytes. In benchmarks, this shows 10x higher write throughput. However, if the server loses power or the kernel crashes, the entire database cluster suffers catastrophic unrecoverable corruption."
      },
      {
        "question": "What is the difference between Application-level Consistency and Database Consistency?",
        "answer": "Database Consistency ensures the database transitions from one valid schema state to another, satisfying all CHECK, UNIQUE, NOT NULL, and FOREIGN KEY constraints. Application-level consistency ensures business logic rules that span beyond database constraints (e.g. transfer amounts cannot exceed daily fraud limits) are valid before committing."
      }
    ],
    "interviewReadyAnswer": "ACID represents the core transactional guarantees of relational databases: Atomicity via WAL rollbacks, Consistency via schema constraints, Isolation via MVCC and locks, and Durability via fsync flushes of write-ahead log records.",
    "quickTest": {
      "question": "Which ACID property guarantees that once a transaction commits, its modifications will not be lost even if the physical server loses power immediately after?",
      "options": [
        {
          "key": "A",
          "text": "Atomicity"
        },
        {
          "key": "B",
          "text": "Consistency"
        },
        {
          "key": "C",
          "text": "Isolation"
        },
        {
          "key": "D",
          "text": "Durability"
        }
      ],
      "correctAnswer": "D",
      "explanation": "Durability guarantees that committed data is safely recorded on non-volatile storage and survives unexpected power failures."
    },
    "mentalModel": "Bank Vault: A transaction is an armored car delivery: all bags delivered together (A), exact account books (C), nobody peeking inside during transport (I), and locked safely in the vault forever (D).",
    "codeSnippet": "BEGIN;\n-- All operations must succeed together:\nINSERT INTO ledger (account_id, delta) VALUES (42, -100);\nINSERT INTO ledger (account_id, delta) VALUES (99, +100);\nCOMMIT;",
    "takeaways": [
      "Atomicity means all-or-nothing.",
      "Consistency enforces schema constraints and invariants.",
      "Isolation prevents concurrency anomalies; Durability survives power cuts."
    ],
    "commonPitfall": {
      "mistake": "Assuming non-relational distributed databases provide ACID transactions by default.",
      "fix": "Verify whether the underlying database supports multi-document ACID transactions."
    },
    "nextTopicId": "window-functions",
    "prevTopicId": "database-transactions"
  },
  {
    "id": "window-functions",
    "topicNumber": 46,
    "title": "Window Functions",
    "category": "query-execution",
    "difficulty": "Advanced",
    "summary": "OVER, PARTITION BY, ORDER BY frame bounds, ROW_NUMBER, RANK, DENSE_RANK, and preserving row identities.",
    "definition": "A Window Function performs a calculation across a set of table rows that are related to the current row, without collapsing the rows into a single summary output like GROUP BY does.",
    "eli5": "GROUP BY merges an entire class into a single average score row. A Window Function gives each student their own report card showing their individual score AND the class average side-by-side.",
    "realWorldExample": {
      "description": "Ranking employees by salary within each department while retaining all individual employee rows.",
      "tables": [
        {
          "title": "Window Ranking",
          "headers": [
            "Name",
            "Dept",
            "Salary",
            "ROW_NUMBER()",
            "RANK()",
            "DENSE_RANK()"
          ],
          "rows": [
            [
              "Alice",
              "Eng",
              "$120,000",
              1,
              1,
              1
            ],
            [
              "Bob",
              "Eng",
              "$120,000",
              2,
              1,
              1
            ],
            [
              "Charlie",
              "Eng",
              "$90,000",
              3,
              3,
              2
            ]
          ]
        }
      ],
      "explanation": "Notice how RANK skips rank 2 due to the tie, whereas DENSE_RANK does not create a gap."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Department ranking with ROW_NUMBER",
        "code": "SELECT name, department, salary,\n  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept,\n  AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary\nFROM employees;",
        "note": "Rows are NOT collapsed; each employee receives their own row."
      }
    ],
    "rulesTable": [
      {
        "rule": "No Row Collapsing",
        "explanation": "Unlike GROUP BY, window functions retain the exact same number of rows as the input query."
      },
      {
        "rule": "WHERE Clause Restriction",
        "explanation": "Window functions are evaluated in the SELECT projection step and CANNOT be placed in WHERE or HAVING."
      },
      {
        "rule": "Default Frame Specification",
        "explanation": "An ORDER BY inside OVER() defaults to: RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW."
      },
      {
        "rule": "Evaluation order (after WHERE/HAVING)",
        "explanation": "Window functions evaluate at Step 5.5 (during SELECT); they cannot be used inside WHERE or HAVING clauses."
      },
      {
        "rule": "PARTITION BY vs GROUP BY",
        "explanation": "GROUP BY collapses multiple rows into a single row; PARTITION BY calculates aggregates while preserving all individual rows."
      }
    ],
    "deepDive": {
      "title": "ROW_NUMBER() vs RANK() vs DENSE_RANK()",
      "description": "When two rows have identical sorting values (a tie): 1) ROW_NUMBER() assigns strictly sequential numbers (1, 2, 3), breaking ties arbitrarily. 2) RANK() assigns identical numbers but creates gaps (1, 1, 3). 3) DENSE_RANK() assigns identical numbers without gaps (1, 1, 2).",
      "codeSnippet": "-- Ranking comparison on identical values [100, 100, 80]:\nROW_NUMBER: 1, 2, 3\nRANK:       1, 1, 3  (Gap created!)\nDENSE_RANK: 1, 1, 2  (No gap!)",
      "warning": "To filter on window function results (e.g. WHERE rank = 1), you MUST wrap the query in a CTE or derived table."
    },
    "advantages": [
      "Computes complex running totals, rankings, and comparisons without multiple self-joins.",
      "Retains full individual row context alongside aggregated metrics."
    ],
    "disadvantages": [
      "Window sorting on massive tables without matching indexes requires high memory in work_mem."
    ],
    "interviewQuestions": [
      {
        "question": "What is the fundamental difference between ROW_NUMBER(), RANK(), and DENSE_RANK()?",
        "answer": "All three assign rankings based on ORDER BY within a partition: 1. ROW_NUMBER(): strictly sequential unique integers (1, 2, 3, 4); never assigns duplicate ranks even on ties. 2. RANK(): assigns identical ranks to tied rows and SKIPS subsequent rank numbers (1, 2, 2, 4); gap appears. 3. DENSE_RANK(): assigns identical ranks to tied rows and does NOT skip numbers (1, 2, 2, 3); no gaps.",
        "comparisonTable": {
          "headers": [
            "Score",
            "ROW_NUMBER()",
            "RANK()",
            "DENSE_RANK()"
          ],
          "rows": [
            [
              "100",
              "1",
              "1",
              "1"
            ],
            [
              "95",
              "2",
              "2",
              "2"
            ],
            [
              "95",
              "3",
              "2",
              "2"
            ],
            [
              "90",
              "4",
              "4",
              "3"
            ],
            [
              "85",
              "5",
              "5",
              "4"
            ]
          ]
        }
      },
      {
        "question": "Why can Window Functions NOT be used in the WHERE or HAVING clauses?",
        "answer": "Because of the logical query processing order. WHERE evaluates at Step 2 to filter rows from disk, and HAVING evaluates at Step 4 to filter groups. Window functions are evaluated at Step 5.5, AFTER grouping, aggregation, and filtering have completed. To filter on a window function result, you must wrap the query in a Common Table Expression (CTE) or derived table."
      },
      {
        "question": "How do you write a query to find the \"Top 3 highest-earning employees in every department\"?",
        "answer": "You assign DENSE_RANK() partitioned by department and ordered by salary descending inside a CTE, then filter WHERE rnk <= 3 in the outer query:",
        "codeBlock": "WITH ranked_employees AS (\n  SELECT \n    id, name, department_id, salary,\n    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank\n  FROM employees\n)\nSELECT id, name, department_id, salary, salary_rank\nFROM ranked_employees\nWHERE salary_rank <= 3\nORDER BY department_id, salary_rank;"
      },
      {
        "question": "What is the performance and memory cost of executing a Window Function?",
        "answer": "The engine must partition and sort rows in memory according to the OVER (PARTITION BY ... ORDER BY ...) clause. If input data is already sorted by an index matching the partition and order keys, the engine streams rows through the WindowAgg operator in O(N) time with minimal memory. Otherwise, it must sort the entire dataset in work_mem."
      },
      {
        "question": "What happens if you omit PARTITION BY in a window function?",
        "answer": "If PARTITION BY is omitted (e.g. OVER (ORDER BY salary DESC)), the entire table is treated as a single partition. The window function calculates rankings or running totals across all rows in the relation."
      }
    ],
    "interviewReadyAnswer": "Window functions calculate analytics across partitions of rows using the OVER() clause without collapsing row identities. ROW_NUMBER assigns distinct sequences, RANK leaves gaps on ties, and DENSE_RANK numbers ties without gaps.",
    "quickTest": {
      "question": "Three employees tie for 1st place with identical salaries. What rank number will the fourth employee receive using RANK()?",
      "options": [
        {
          "key": "A",
          "text": "2"
        },
        {
          "key": "B",
          "text": "3"
        },
        {
          "key": "C",
          "text": "4"
        },
        {
          "key": "D",
          "text": "1"
        }
      ],
      "correctAnswer": "C",
      "explanation": "RANK leaves gaps for ties. With 3 employees tied at rank 1 (1, 1, 1), the next employee receives rank 4."
    },
    "mentalModel": "Olympics Podium: If two runners tie for Gold, they both get Gold medals (1st), nobody gets Silver, and the next runner gets Bronze (3rd).",
    "codeSnippet": "WITH ranked_orders AS (\n  SELECT user_id, id, amount,\n    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY amount DESC) AS rn\n  FROM orders\n)\nSELECT * FROM ranked_orders WHERE rn = 1;",
    "takeaways": [
      "Window functions do not collapse rows.",
      "ROW_NUMBER produces no ties; RANK leaves gaps; DENSE_RANK leaves no gaps.",
      "Wrap in a CTE to filter on window function outputs."
    ],
    "commonPitfall": {
      "mistake": "Attempting to write WHERE ROW_NUMBER() OVER (...) = 1 directly, which throws a syntax error.",
      "fix": "Wrap the query inside a CTE and filter in the outer WHERE clause."
    },
    "nextTopicId": "advanced-window-functions",
    "prevTopicId": "acid-properties"
  },
  {
    "id": "advanced-window-functions",
    "topicNumber": 47,
    "title": "Advanced Window Functions",
    "category": "query-execution",
    "difficulty": "Advanced",
    "summary": "LAG, LEAD, FIRST_VALUE, LAST_VALUE, running cumulative totals, and explicit ROWS frame boundaries.",
    "definition": "Advanced Window Functions evaluate inter-row navigation (LAG/LEAD) and running cumulative calculations using custom frame specifications (ROWS BETWEEN).",
    "eli5": "LAG looks in the rearview mirror at the previous car; LEAD looks through the windshield at the car ahead; running totals add up your bank balance as every transaction passes by.",
    "realWorldExample": {
      "description": "Calculating month-over-month revenue growth percentage and running year-to-date balances.",
      "tables": [
        {
          "title": "Month over Month Growth",
          "headers": [
            "Month",
            "Revenue",
            "LAG(Revenue)",
            "MoM Growth"
          ],
          "rows": [
            [
              "Jan 2026",
              "$10,000",
              "NULL",
              "N/A"
            ],
            [
              "Feb 2026",
              "$12,000",
              "$10,000",
              "+20.0%"
            ],
            [
              "Mar 2026",
              "$15,000",
              "$12,000",
              "+25.0%"
            ]
          ]
        }
      ],
      "explanation": "LAG(revenue, 1) fetches the previous month without requiring a complex self-join."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Inter-row navigation with LAG and LEAD",
        "code": "SELECT month, revenue,\n  LAG(revenue, 1) OVER (ORDER BY month) AS prev_month_revenue,\n  revenue - LAG(revenue, 1) OVER (ORDER BY month) AS mom_dollar_change\nFROM monthly_sales;"
      },
      {
        "step": "Step 2: Cumulative Running Total with ROWS Frame",
        "code": "SELECT order_date, amount,\n  SUM(amount) OVER (\n    ORDER BY order_date\n    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\n  ) AS running_balance\nFROM transactions;",
        "note": "Explicit ROWS BETWEEN avoids RANGE duplicate summation surprises."
      }
    ],
    "rulesTable": [
      {
        "rule": "LAG / LEAD Offsets",
        "explanation": "LAG(col, N, default) looks back N rows, returning the optional default value if no row exists."
      },
      {
        "rule": "ROWS vs RANGE",
        "explanation": "ROWS treats duplicate values as distinct physical rows; RANGE treats duplicates as identical tie groups."
      },
      {
        "rule": "Frame Default Trap",
        "explanation": "Specifying ORDER BY in OVER() without ROWS causes the frame to sum all tied rows simultaneously!"
      },
      {
        "rule": "Default window frame hazard",
        "explanation": "Specifying ORDER BY without an explicit frame defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW."
      },
      {
        "rule": "ROWS vs RANGE semantics",
        "explanation": "ROWS specifies a physical count of rows; RANGE specifies logical duplicate values based on the ORDER BY key."
      }
    ],
    "deepDive": {
      "title": "The Critical Difference: ROWS BETWEEN vs RANGE BETWEEN",
      "description": "When calculating a running total on duplicate dates, the default RANGE frame groups identical dates together, calculating their combined sum on the first row! Using ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW forces strict physical row-by-row cumulative accumulation.",
      "codeSnippet": "-- DANGEROUS: Jumps on duplicate dates:\nSUM(amount) OVER (ORDER BY date)\n\n-- PRECISE: Smooth physical running balance:\nSUM(amount) OVER (ORDER BY date, id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
      "warning": "Always specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW for financial running balances."
    },
    "advantages": [
      "Eliminates slow, bug-prone self-joins for delta calculations.",
      "Enables complex financial time-series analysis directly in SQL."
    ],
    "disadvantages": [
      "Window frames require careful boundary definitions to avoid unexpected duplicate behaviors."
    ],
    "interviewQuestions": [
      {
        "question": "How do LEAD() and LAG() work and how do they eliminate expensive self-joins?",
        "answer": "LEAD(col, offset, default) accesses data from a subsequent row at a specified offset within the partition without joining the table. LAG(col, offset, default) accesses data from a preceding row. They allow calculating period-over-period growth or time-between-events in a single O(N) streaming pass, replacing quadratic O(N^2) self-joins.",
        "codeBlock": "SELECT \n  date, revenue,\n  LAG(revenue, 1) OVER (ORDER BY date) AS prev_day_revenue,\n  revenue - LAG(revenue, 1) OVER (ORDER BY date) AS daily_growth\nFROM daily_sales;"
      },
      {
        "question": "What is the difference between \"ROWS BETWEEN\" and \"RANGE BETWEEN\" in window frames?",
        "answer": "ROWS operates on physical row offsets: ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING strictly looks at the 1 row physically before and 1 row physically after the current row. RANGE operates on value equality of the ORDER BY column: if multiple rows share the exact same value in the order key, RANGE treats all tied rows as a single frame boundary, often causing unexpected spikes in running totals."
      },
      {
        "question": "How do you calculate a 7-day Moving Average of revenue in SQL?",
        "answer": "You use an analytical window frame over sorted daily records:",
        "codeBlock": "SELECT \n  sale_date, daily_revenue,\n  AVG(daily_revenue) OVER (\n    ORDER BY sale_date \n    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS seven_day_moving_avg\nFROM daily_revenue_table;"
      },
      {
        "question": "What is NTILE(n) and what are its common production use cases?",
        "answer": "NTILE(n) divides the sorted partition into n roughly equal buckets (quartiles, deciles, percentiles) and assigns a bucket number from 1 to n to each row. It is widely used in analytics to segment users into spending quartiles (NTILE(4)) or assign test cohorts."
      },
      {
        "question": "What is FIRST_VALUE() vs LAST_VALUE() and why does LAST_VALUE() often surprise developers?",
        "answer": "FIRST_VALUE(col) returns the first value in the window frame. LAST_VALUE(col) returns the last value in the window frame. Developers are often surprised when LAST_VALUE() simply returns the current row value! This happens because the default window frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW (the frame ends at the current row). To get the true last value of the partition, you must specify ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING."
      }
    ],
    "interviewReadyAnswer": "Advanced window functions like LAG and LEAD allow inter-row calculations without self-joins. When computing running totals, explicitly defining ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW guarantees strict row-by-row accumulation and avoids duplicate RANGE summation traps.",
    "quickTest": {
      "question": "What does LAG(price, 1, 0.0) return when evaluated on the very first row of a partition?",
      "options": [
        {
          "key": "A",
          "text": "NULL"
        },
        {
          "key": "B",
          "text": "0.0 (the specified fallback default)"
        },
        {
          "key": "C",
          "text": "The price of the current row"
        },
        {
          "key": "D",
          "text": "A runtime error"
        }
      ],
      "correctAnswer": "B",
      "explanation": "When LAG looks before the start of the partition, it returns the provided default value (0.0)."
    },
    "mentalModel": "Conveyor belt: As items pass by, LAG looks at the item that just left, LEAD looks at the item arriving next, and the running total weighs everything that has passed so far.",
    "codeSnippet": "SELECT date, amount,\n  LAG(amount) OVER (ORDER BY date) AS prev_amount,\n  SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total\nFROM sales;",
    "takeaways": [
      "LAG looks backward; LEAD looks forward.",
      "Always specify explicit ROWS frames for running totals.",
      "Supply default values (e.g. LAG(col, 1, 0)) to avoid NULL returns."
    ],
    "commonPitfall": {
      "mistake": "Using default RANGE frames for running balances and having identical timestamps sum simultaneously.",
      "fix": "Specify ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW."
    },
    "nextTopicId": "advanced-indexing",
    "prevTopicId": "window-functions"
  },
  {
    "id": "advanced-indexing",
    "topicNumber": 48,
    "title": "Advanced Indexing",
    "category": "indexing",
    "difficulty": "Advanced",
    "summary": "Covering indexes (INCLUDE), Partial indexes, Expression indexes, GIN/GiST index types, and index bloat.",
    "definition": "Advanced Indexing employs specialized database index structures (Covering, Partial, Expression, and GIN/GiST) to satisfy complex query predicates while minimizing index storage and write overhead.",
    "eli5": "Instead of building a giant heavy phonebook of everyone, a Partial Index is a tiny cheat sheet of only active VIPs. A Covering Index includes their phone number right on the badge so you never have to walk to the file cabinet.",
    "realWorldExample": {
      "description": "An application querying unread notifications for active users among 100 million total notifications.",
      "tables": [
        {
          "title": "Index Types",
          "headers": [
            "Index Technique",
            "Example Definition",
            "Benefit"
          ],
          "rows": [
            [
              "Partial Index",
              "WHERE is_read = FALSE",
              "Indexes only 2% of the table; 98% smaller"
            ],
            [
              "Covering (INCLUDE)",
              "INCLUDE (total_amount)",
              "Enables Index-Only Scan without heap visits"
            ],
            [
              "Expression Index",
              "ON (LOWER(email))",
              "Accelerates case-insensitive lookups"
            ]
          ]
        }
      ],
      "explanation": "Specialized indexes drastically reduce index size and maximize buffer cache efficiency."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Covering Index with INCLUDE (PostgreSQL / SQL Server)",
        "code": "CREATE INDEX idx_users_lookup\nON users (email)\nINCLUDE (name, role);",
        "note": "email is in B-Tree search keys; name and role are stored only in leaf nodes."
      },
      {
        "step": "Step 2: Partial Index for High Selectivity Subsets",
        "code": "CREATE INDEX idx_orders_unprocessed\nON orders (created_at)\nWHERE status = 'pending';",
        "note": "Only indexes pending orders; completed orders consume 0 index bytes."
      }
    ],
    "rulesTable": [
      {
        "rule": "INCLUDE Payload",
        "explanation": "Columns in INCLUDE are stored only on leaf pages and cannot be used as search predicates, saving branch node space."
      },
      {
        "rule": "Partial Index Predicate Match",
        "explanation": "Queries must include the exact partial index WHERE clause for the optimizer to use the partial index."
      },
      {
        "rule": "Index-Only Scan",
        "explanation": "When all requested columns are found in the index leaves, the engine avoids table heap page lookups completely."
      },
      {
        "rule": "Covering index INCLUDE clause",
        "explanation": "The INCLUDE clause stores non-key payload attributes directly in B-Tree leaves without adding them to search branch keys."
      },
      {
        "rule": "Visibility Map requirement for Index-Only Scans",
        "explanation": "PostgreSQL checks the Visibility Map to confirm all tuples on the heap page are visible before skipping heap reads."
      }
    ],
    "deepDive": {
      "title": "Index-Only Scans and the Visibility Map",
      "description": "An Index-Only Scan sounds like it never touches the table heap, but in MVCC engines, index tuples do not store transaction visibility headers (xmin/xmax). The engine checks the table's Visibility Map. If all tuples on the page are marked all-visible (verified by VACUUM), the heap visit is skipped entirely!",
      "codeSnippet": "-- Verify all-visible status in EXPLAIN:\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT email, name FROM users WHERE email = 'lucky@example.com';\n-- \"Heap Fetches: 0\" -> True Index-Only Scan!",
      "warning": "Stale visibility maps (due to lack of VACUUM) force Index-Only Scans to visit heap pages anyway."
    },
    "advantages": [
      "Index-Only Scans eliminate random heap I/O entirely.",
      "Partial indexes reduce index storage by 90%+ for asymmetric states (like pending orders)."
    ],
    "disadvantages": [
      "Over-indexing causes write latency and maintenance overhead during autovacuum."
    ],
    "interviewQuestions": [
      {
        "question": "What is a Covering Index and how does it enable Index-Only Scans?",
        "answer": "A Covering Index is an index that contains all columns required by a query (in SELECT, WHERE, and JOIN). When a covering index exists, the query optimizer performs an Index-Only Scan: it reads the required data directly from the B-Tree leaf pages in RAM, completely bypassing the heap data pages and eliminating random physical disk I/O."
      },
      {
        "question": "What is the architectural difference between adding a column to index keys vs using the INCLUDE clause?",
        "answer": "1. Index Keys (CREATE INDEX idx ON tbl(a, b)): Both columns are stored in Root, Branch, and Leaf nodes. Keys are sorted, participate in index uniqueness, and consume B-Tree fanout space. 2. INCLUDE Clause (CREATE INDEX idx ON tbl(a) INCLUDE (b)): Column b is stored ONLY in leaf nodes as non-searchable payload. It does not affect tree sorting, preserves high B-Tree fanout, allows indexing data types that lack B-Tree operator classes, and avoids key length limits."
      },
      {
        "question": "Why does an Index-Only Scan in PostgreSQL sometimes still read heap disk pages?",
        "answer": "PostgreSQL tuple visibility (MVCC xmin/xmax) is stored in heap tuple headers, not inside B-Tree index leaves. To avoid checking the heap for every index row, PostgreSQL maintains a Visibility Map (VM) bitmask for each 8 KB page. If the page is marked all-visible, the engine skips heap reads. If un-vacuumed dead tuples exist on the page, the engine must still fetch the heap page to check visibility."
      },
      {
        "question": "What is a Partial Index and when should you use one in production?",
        "answer": "A Partial Index includes only rows that satisfy a WHERE predicate: CREATE INDEX idx_unpaid_invoices ON invoices(customer_id) WHERE status = 'unpaid'; If 99% of invoices are paid and only 1% are unpaid, a partial index is 99% smaller than a full index, fits entirely in RAM, and speeds up queries on unpaid invoices with zero write overhead when inserting paid invoices."
      },
      {
        "question": "What is an Expression (Functional) Index and what restriction applies to the expression?",
        "answer": "An Expression Index indexes the result of a function: CREATE INDEX idx_lower_email ON users (LOWER(email)); The expression must be strictly IMMUTABLE (it must always return the exact same output for the same input and cannot access outside tables or timestamps)."
      }
    ],
    "interviewReadyAnswer": "Advanced indexing utilizes Partial indexes to target asymmetric subsets with minimal storage, and Covering indexes (using INCLUDE) to satisfy queries entirely inside index leaf pages with zero heap page visits.",
    "quickTest": {
      "question": "Which query can successfully use a partial index created with \"CREATE INDEX idx ON orders(id) WHERE status = 'pending';\"?",
      "options": [
        {
          "key": "A",
          "text": "SELECT * FROM orders WHERE id = 100;"
        },
        {
          "key": "B",
          "text": "SELECT * FROM orders WHERE id = 100 AND status = 'pending';"
        },
        {
          "key": "C",
          "text": "SELECT * FROM orders WHERE status = 'shipped';"
        },
        {
          "key": "D",
          "text": "SELECT * FROM orders;"
        }
      ],
      "correctAnswer": "B",
      "explanation": "The query must include the partial index condition (status = \"pending\") for the optimizer to prove the index contains the required rows."
    },
    "mentalModel": "VIP Fast Pass: A separate tiny line only for VIPs; regular ticket holders are not tracked on that list, keeping the list paper thin.",
    "codeSnippet": "CREATE INDEX idx_active_users ON users(id) WHERE is_active = TRUE;\nSELECT id FROM users WHERE is_active = TRUE AND id = 50;",
    "takeaways": [
      "Use INCLUDE to enable Index-Only Scans without bloating B-Tree branch pages.",
      "Partial indexes save massive disk and memory on asymmetric status flags.",
      "Run VACUUM regularly so the Visibility Map keeps Heap Fetches at 0."
    ],
    "commonPitfall": {
      "mistake": "Adding wide text columns into the primary index key instead of the INCLUDE clause, bloating branch pages.",
      "fix": "Put search columns in the main index key and projection-only columns in INCLUDE."
    },
    "nextTopicId": "locks-and-isolation-levels",
    "prevTopicId": "advanced-window-functions"
  },
  {
    "id": "locks-and-isolation-levels",
    "topicNumber": 49,
    "title": "Locks & Isolation Levels",
    "category": "transactions",
    "difficulty": "Advanced",
    "summary": "Read Committed vs Repeatable Read vs Serializable, MVCC mechanics, row-level locks, table locks, and deadlock resolution.",
    "definition": "Isolation levels define the degree to which modifications made by concurrent transactions are isolated from one another, balancing concurrency anomalies against locking overhead.",
    "eli5": "Isolation levels are soundproof glass partitions between rooms. At lower levels, you can hear mumbling through the wall; at the highest level (Serializable), it is completely soundproof, as if you were the only person in the building.",
    "realWorldExample": {
      "description": "Two users simultaneously attempting to book the very last remaining seat on an airplane.",
      "tables": [
        {
          "title": "Isolation Levels & Concurrency Anomalies",
          "headers": [
            "Isolation Level",
            "Dirty Read",
            "Non-Repeatable Read",
            "Phantom Read",
            "Write Skew"
          ],
          "rows": [
            [
              "Read Uncommitted",
              "Possible",
              "Possible",
              "Possible",
              "Possible"
            ],
            [
              "Read Committed (PG Default)",
              "Prevented",
              "Possible",
              "Possible",
              "Possible"
            ],
            [
              "Repeatable Read",
              "Prevented",
              "Prevented",
              "Prevented (PG)",
              "Possible"
            ],
            [
              "Serializable",
              "Prevented",
              "Prevented",
              "Prevented",
              "Prevented"
            ]
          ]
        }
      ],
      "explanation": "Serializable isolation guarantees execution matches a sequential one-by-one serial order."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Setting transaction isolation level",
        "code": "BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT balance FROM accounts WHERE id = 1;\n-- Even if another transaction updates account 1, this transaction\n-- sees the exact same snapshot until it commits!\nCOMMIT;"
      },
      {
        "step": "Step 2: Explicit pessimistic row locking with FOR UPDATE",
        "code": "BEGIN;\n-- Locks matching rows exclusively until COMMIT:\nSELECT id, available_seats\nFROM flights\nWHERE id = 42\nFOR UPDATE;\n\nUPDATE flights SET available_seats = available_seats - 1 WHERE id = 42;\nCOMMIT;",
        "note": "Prevents race conditions by making competing transactions wait."
      }
    ],
    "rulesTable": [
      {
        "rule": "Readers Don't Block Writers",
        "explanation": "Under MVCC, read transactions never block write transactions, and writers never block readers."
      },
      {
        "rule": "Pessimistic vs Optimistic",
        "explanation": "Pessimistic locking (SELECT FOR UPDATE) locks rows upfront; Optimistic locking checks version counters at commit time."
      },
      {
        "rule": "Deadlock Detection",
        "explanation": "When transaction A waits for B and B waits for A, the database engine aborts one transaction with a deadlock error."
      },
      {
        "rule": "Two-Phase Locking (2PL) protocol",
        "explanation": "In 2PL, a transaction acquires locks during the expanding phase and releases all locks only at COMMIT."
      },
      {
        "rule": "MVCC non-blocking read-write guarantee",
        "explanation": "Readers reading older MVCC snapshots never block concurrent writers; writers never block readers."
      }
    ],
    "deepDive": {
      "title": "Write Skew: The Anomaly that Breaks Repeatable Read",
      "description": "Write Skew occurs when two concurrent transactions read disjoint sets of rows, make decisions based on what they read, and update overlapping constraints. For example, two on-call doctors simultaneously check if at least one doctor remains on call, and both log off at the same instant! Only SERIALIZABLE isolation prevents write skew.",
      "codeSnippet": "-- Tx 1 (Doctor Alice): Checks doctor count >= 2, marks herself off.\n-- Tx 2 (Doctor Bob): Checks doctor count >= 2, marks himself off.\n-- Under Repeatable Read: Both commit, leaving 0 doctors on call!\n-- Under Serializable: One transaction fails with serialization_failure.",
      "warning": "Never rely on Repeatable Read when cross-row business rules depend on concurrent reads."
    },
    "advantages": [
      "Granular control over concurrency vs consistency trade-offs.",
      "SELECT ... FOR UPDATE prevents race conditions in booking and inventory engines."
    ],
    "disadvantages": [
      "Serializable transactions require application retry loops on serialization failures."
    ],
    "interviewQuestions": [
      {
        "question": "How does MVCC (Multi-Version Concurrency Control) achieve non-blocking reads and writes?",
        "answer": "Instead of acquiring locks on rows during reads, MVCC assigns every transaction a unique transaction ID. When a row is updated, the engine appends a new version with xmin set to current TX and xmax on the old tuple. When a reader runs, it takes a Snapshot containing active transaction IDs: it reads the row version committed before its snapshot started. Readers never block writers, and writers never block readers."
      },
      {
        "question": "What is a Deadlock, how does the engine detect it, and how does it recover?",
        "answer": "A Deadlock occurs when Transaction A holds Lock 1 and waits for Lock 2, while Transaction B holds Lock 2 and waits for Lock 1. Neither can proceed. The database Lock Manager maintains a directed \"Wait-For Graph\" where nodes are transactions and edges are lock requests. A background thread detects cycles in the graph (deadlocks) and forcibly aborts one of the transactions (the deadlock victim) with a serialization/deadlock error, allowing the other to complete."
      },
      {
        "question": "What is the Write Skew anomaly and which isolation level prevents it?",
        "answer": "Write Skew occurs under Snapshot Isolation (Repeatable Read). Example: On-call doctor rule requires at least 1 doctor on call. Alice and Bob are both on call. Alice queries on_call_count (sees 2), Bob queries on_call_count (sees 2). Both concurrently execute UPDATE set on_call = false. Both transactions commit because they modified DIFFERENT rows. Now ZERO doctors are on call! Only SERIALIZABLE isolation (or explicit SELECT FOR UPDATE) prevents Write Skew."
      },
      {
        "question": "What is the difference between Shared (S) and Exclusive (X) locks?",
        "answer": "A Shared Lock (S-Lock) is acquired for reading (e.g. SELECT ... FOR SHARE); multiple concurrent transactions can hold S-locks on the same row simultaneously. An Exclusive Lock (X-Lock) is acquired for writing (INSERT, UPDATE, DELETE, SELECT ... FOR UPDATE); only ONE transaction can hold an X-lock, blocking all other transactions from acquiring S-locks or X-locks until the transaction commits."
      },
      {
        "question": "What is lock escalation and why does PostgreSQL NOT use lock escalation?",
        "answer": "Lock escalation (common in SQL Server) occurs when an engine holding thousands of individual row locks automatically converts them into a single table lock to save lock manager RAM, unexpectedly locking out concurrent users. PostgreSQL allocates a fixed, generous lock table in shared memory and NEVER escalates row locks to table locks, ensuring predictable concurrency."
      }
    ],
    "interviewReadyAnswer": "Transaction isolation levels dictate concurrency anomaly boundaries. PostgreSQL defaults to Read Committed using MVCC so readers never block writers. To prevent race conditions, applications employ SELECT FOR UPDATE or promote to Serializable isolation with automated retry loops.",
    "quickTest": {
      "question": "Which concurrency anomaly can occur under Repeatable Read in the ANSI SQL standard, but is completely eliminated by Serializable isolation?",
      "options": [
        {
          "key": "A",
          "text": "Dirty Read"
        },
        {
          "key": "B",
          "text": "Write Skew"
        },
        {
          "key": "C",
          "text": "Lost Update"
        },
        {
          "key": "D",
          "text": "Read Committed"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Write Skew occurs when disjoint rows are modified concurrently based on overlapping constraint checks. Only Serializable isolation prevents write skew."
    },
    "mentalModel": "Turn-based board game: Under Serializable isolation, every player takes their turn in a strict sequence, ensuring no two players move the same piece simultaneously.",
    "codeSnippet": "BEGIN;\nSELECT balance FROM accounts WHERE id = 10 FOR UPDATE;\nUPDATE accounts SET balance = balance - 100 WHERE id = 10;\nCOMMIT;",
    "takeaways": [
      "PostgreSQL defaults to Read Committed; readers never block writers.",
      "Use SELECT FOR UPDATE for pessimistic concurrency control.",
      "Serializable isolation prevents write skew but requires application retries."
    ],
    "commonPitfall": {
      "mistake": "Not having application retry logic when running under Serializable isolation, causing unhandled 40001 serialization errors.",
      "fix": "Wrap Serializable database transactions in exponential backoff retry loops."
    },
    "nextTopicId": "triggers-and-recursive-ctes",
    "prevTopicId": "advanced-indexing"
  },
  {
    "id": "triggers-and-recursive-ctes",
    "topicNumber": 50,
    "title": "Triggers & Recursive CTEs",
    "category": "architecture",
    "difficulty": "Expert",
    "summary": "BEFORE/AFTER row triggers, audit trail generation, recursive hierarchical graphs, and infinite recursion guards.",
    "definition": "Triggers automatically execute procedural logic when specific DML events occur. Recursive CTEs iteratively traverse graphs, organizational charts, and hierarchical relational trees.",
    "eli5": "A Trigger is a tripwire: whenever someone opens a door, an alarm rings or a camera snaps a photo automatically. A Recursive CTE is climbing a family tree from child to parent to grandparent until you reach the root.",
    "realWorldExample": {
      "description": "Traversing an organizational chart of employees and managers to calculate corporate reporting chains.",
      "tables": [
        {
          "title": "Organization Tree",
          "headers": [
            "Level",
            "Employee",
            "Manager"
          ],
          "rows": [
            [
              1,
              "CEO",
              "NULL (Root)"
            ],
            [
              2,
              "VP Engineering",
              "CEO"
            ],
            [
              3,
              "Staff Engineer",
              "VP Engineering"
            ]
          ]
        }
      ],
      "explanation": "A Recursive CTE starts with the CEO anchor member and iteratively joins child employees."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Recursive CTE traversing hierarchy",
        "code": "WITH RECURSIVE org_tree AS (\n  -- 1. Anchor member (Root node):\n  SELECT id, name, manager_id, 1 AS depth\n  FROM employees\n  WHERE manager_id IS NULL\n\n  UNION ALL\n\n  -- 2. Recursive member (Joins parent):\n  SELECT e.id, e.name, e.manager_id, ot.depth + 1\n  FROM employees e\n  JOIN org_tree ot ON e.manager_id = ot.id\n)\nSELECT * FROM org_tree ORDER BY depth, id;",
        "note": "Iterates until the join produces no new rows."
      },
      {
        "step": "Step 2: Automated Audit Trigger with BEFORE/AFTER",
        "code": "CREATE OR REPLACE FUNCTION log_user_update()\nRETURNS TRIGGER LANGUAGE plpgsql AS $$\nBEGIN\n  INSERT INTO user_audit_log (user_id, old_email, new_email, changed_at)\n  VALUES (OLD.id, OLD.email, NEW.email, NOW());\n  RETURN NEW;\nEND;\n$$;\n\nCREATE TRIGGER trg_user_audit\nAFTER UPDATE OF email ON users\nFOR EACH ROW\nEXECUTE FUNCTION log_user_update();"
      }
    ],
    "rulesTable": [
      {
        "rule": "Anchor & Recursive Structure",
        "explanation": "A recursive CTE strictly consists of an Anchor query, UNION ALL, and a Recursive query referencing the CTE name."
      },
      {
        "rule": "Infinite Recursion Guard",
        "explanation": "Graph cycles (e.g. A reports to B and B reports to A) cause infinite loops unless guarded by depth limits or array cycle tracking."
      },
      {
        "rule": "OLD and NEW in Triggers",
        "explanation": "In row-level triggers, OLD represents row state before modification; NEW represents proposed modified state."
      },
      {
        "rule": "BEFORE vs AFTER trigger semantics",
        "explanation": "BEFORE triggers can modify the incoming NEW tuple before write; AFTER triggers run post-write for auditing."
      },
      {
        "rule": "Recursive CTE termination guard",
        "explanation": "Recursive CTEs require an empty set termination condition to prevent infinite loops and stack overflows."
      }
    ],
    "deepDive": {
      "title": "Cycle Detection in Graph Traversals",
      "description": "If your relational hierarchy contains cyclic loops (e.g. node 1 -> node 2 -> node 1), a naive recursive CTE runs forever until memory exhausts. In PostgreSQL, use an array path to detect cycles.",
      "codeSnippet": "WITH RECURSIVE search_graph(id, link, path, cycle) AS (\n  SELECT g.id, g.link, ARRAY[g.id], false FROM graph g\n  UNION ALL\n  SELECT g.id, g.link, path || g.id, g.id = ANY(path)\n  FROM graph g, search_graph sg\n  WHERE g.id = sg.link AND NOT cycle\n)\nSELECT * FROM search_graph WHERE NOT cycle;",
      "warning": "Always set a safety limit (e.g. WHERE depth < 50) when querying recursive trees."
    },
    "advantages": [
      "Solves graph and tree traversal natively in SQL without procedural application loops.",
      "Triggers guarantee unbypassable audit logging."
    ],
    "disadvantages": [
      "Triggers execute hidden logic that can surprise developers and cause lock contention."
    ],
    "interviewQuestions": [
      {
        "question": "What is the architectural difference between BEFORE and AFTER triggers in relational engines?",
        "answer": "1. BEFORE Triggers execute before the tuple is written to the 8 KB disk page. They can inspect and mutate the special NEW record (e.g. sanitizing input, setting default timestamps, hashing passwords) or cancel the operation by returning NULL. 2. AFTER Triggers execute after the tuple is written and indexed. They cannot modify the NEW record; they are used for cascading operations, audit logging, and message queue notifications."
      },
      {
        "question": "How does a Recursive Common Table Expression (CTE) execute step by step?",
        "answer": "A Recursive CTE consists of: 1. Anchor Member: executes once to generate the base initial result set and places it in an intermediate working table. 2. Recursive Member: executes repeatedly, referencing the working table from the previous step and joining to base tables, replacing the working table with newly generated rows. 3. Termination: when the recursive step returns zero rows, the engine unions all intermediate sets and returns the final result.",
        "codeBlock": "WITH RECURSIVE org_tree AS (\n  -- Anchor member: CEO (top of tree)\n  SELECT id, name, manager_id, 1 AS depth\n  FROM employees\n  WHERE manager_id IS NULL\n  \n  UNION ALL\n  \n  -- Recursive member: direct reports\n  SELECT e.id, e.name, e.manager_id, o.depth + 1\n  FROM employees e\n  JOIN org_tree o ON e.manager_id = o.id\n)\nSELECT * FROM org_tree ORDER BY depth, id;"
      },
      {
        "question": "How do you detect and prevent infinite loops in Recursive CTEs caused by cyclic graphs?",
        "answer": "If employee A reports to B and B reports to A (a cyclic graph), a recursive CTE will loop infinitely until memory or integer overflow occurs. In PostgreSQL 14+, you use the CYCLE clause: CYCLE id SET is_cycle USING path; In older versions, you track an array of visited IDs: WHERE e.id != ALL(visited_array) and append array_append(visited_array, e.id)."
      },
      {
        "question": "What is the performance difference between ROW-level and STATEMENT-level triggers?",
        "answer": "A Statement-Level Trigger executes exactly ONCE per SQL statement, regardless of whether the statement touches 1 row or 1,000,000 rows. A Row-Level Trigger (FOR EACH ROW) executes once for EVERY SINGLE ROW modified. Firing a row-level trigger 1 million times incurs massive CPU context-switching overhead and can degrade an insert from 2 seconds to 45 seconds."
      },
      {
        "question": "Why are database triggers often considered an architectural antipattern in modern microservices?",
        "answer": "1. Hidden side effects: Developers debugging application code cannot see triggers executing behind the scenes in the database. 2. Performance bottlenecks: Heavy trigger logic blocks the client transaction, increasing lock durations and connection wait times. 3. Horizontal scaling: Database CPU is expensive; business events are better handled asynchronously using Change Data Capture (CDC / Debezium) and event streaming (Kafka/RabbitMQ)."
      }
    ],
    "interviewReadyAnswer": "Recursive CTEs iteratively traverse graphs and hierarchies by combining an anchor query with a recursive member until termination. Database triggers enforce unbypassable audit logs and constraints by capturing row-level OLD and NEW transitions.",
    "quickTest": {
      "question": "What is the purpose of the Anchor Member in a Recursive CTE?",
      "options": [
        {
          "key": "A",
          "text": "It terminates the query when an error occurs."
        },
        {
          "key": "B",
          "text": "It establishes the initial base result set from which recursion begins."
        },
        {
          "key": "C",
          "text": "It creates a physical index."
        },
        {
          "key": "D",
          "text": "It commits the transaction."
        }
      ],
      "correctAnswer": "B",
      "explanation": "The anchor member is the initial non-recursive query that seeds the recursive worktable."
    },
    "mentalModel": "Domino Chain: The anchor member tips the first domino; the recursive member causes each subsequent domino to fall until none remain.",
    "codeSnippet": "WITH RECURSIVE cnt(x) AS (\n  SELECT 1\n  UNION ALL\n  SELECT x + 1 FROM cnt WHERE x < 10\n)\nSELECT x FROM cnt;",
    "takeaways": [
      "Recursive CTEs traverse trees, graphs, and hierarchies natively.",
      "Always guard against graph cycles using depth or path arrays.",
      "Triggers capture OLD and NEW states for unforgeable audit trails."
    ],
    "commonPitfall": {
      "mistake": "Writing recursive CTEs on user-generated graph data without cycle detection, causing server timeouts.",
      "fix": "Track visited nodes in an array: ARRAY[id] and filter WHERE NOT id = ANY(path)."
    },
    "prevTopicId": "locks-and-isolation-levels"
  }
];
