import { SqlTopic } from './types';

export const TOPICS_31_TO_40: SqlTopic[] = [
  {
    "id": "full-outer-join",
    "topicNumber": 31,
    "title": "FULL OUTER JOIN",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Combining outer sets from both tables, bidirectional NULL padding, reconciliation queries, and full outer anti-joins.",
    "definition": "A FULL OUTER JOIN returns all rows when there is a match in either the left or right table, returning NULLs on whichever side lacks a matching row.",
    "eli5": "Think of two lists of students: one from Class A and one from Class B. A FULL OUTER JOIN lists every single student from both classes. If someone is in both classes, they share a row; otherwise, their missing class is blank.",
    "realWorldExample": {
      "description": "Reconciling bank accounts and payment gateway transactions to find missing settlements on either side.",
      "tables": [
        {
          "title": "Bank Ledger vs Gateway Ledger",
          "headers": [
            "bank_ref",
            "bank_amount",
            "gateway_ref",
            "gateway_amount"
          ],
          "rows": [
            [
              "TX_101",
              "$100.00",
              "TX_101",
              "$100.00 (Matched)"
            ],
            [
              "TX_102",
              "$50.00",
              "NULL",
              "NULL (Missing in Gateway)"
            ],
            [
              "NULL",
              "NULL",
              "TX_103",
              "$75.00 (Missing in Bank)"
            ]
          ]
        }
      ],
      "explanation": "A FULL OUTER JOIN exposes discrepancies on both sides simultaneously."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Bidirectional reconciliation",
        "code": "SELECT\n  COALESCE(b.id, g.id) AS transaction_id,\n  b.amount AS bank_amount,\n  g.amount AS gateway_amount\nFROM bank_transactions b\nFULL OUTER JOIN gateway_transactions g ON b.id = g.id;"
      },
      {
        "step": "Step 2: Full Outer Anti-Join (Discrepancy only)",
        "code": "SELECT *\nFROM bank_transactions b\nFULL OUTER JOIN gateway_transactions g ON b.id = g.id\nWHERE b.id IS NULL OR g.id IS NULL;",
        "note": "Filters strictly for records that do NOT match on both sides."
      }
    ],
    "rulesTable": [
      {
        "rule": "All Rows Preserved",
        "explanation": "No rows are discarded from either table; missing matches are NULL-padded."
      },
      {
        "rule": "COALESCE Key Merging",
        "explanation": "Use COALESCE(left.id, right.id) to project a unified identifier column."
      },
      {
        "rule": "Execution Mechanism",
        "explanation": "Typically executed via Merge Full Join or Hash Full Join in database engines."
      },
      {
        "rule": "Bidirectional NULL padding",
        "explanation": "FULL OUTER JOIN preserves unmatched rows from BOTH relations, filling missing attributes with NULL on both sides."
      },
      {
        "rule": "Hash Full Outer Join memory",
        "explanation": "Hash Full Outer Join must keep tracking bitmasks for all hash table entries to identify unmatched right rows at stream end."
      }
    ],
    "deepDive": {
      "title": "Full Outer Anti-Join for Data Synchronization Audits",
      "description": "The Full Outer Anti-Join (WHERE a.id IS NULL OR b.id IS NULL) is the definitive SQL pattern for finding sync mismatches between replica databases, payment systems, and data warehouses.",
      "codeSnippet": "SELECT\n  COALESCE(a.id, b.id) AS record_id,\n  CASE\n    WHEN a.id IS NULL THEN 'Missing in Primary'\n    WHEN b.id IS NULL THEN 'Missing in Replica'\n  END AS discrepancy_reason\nFROM primary_table a\nFULL OUTER JOIN replica_table b ON a.id = b.id\nWHERE a.id IS NULL OR b.id IS NULL;",
      "warning": "FULL OUTER JOIN operations cannot be optimized into simple index lookups as easily as INNER or LEFT joins."
    },
    "advantages": [
      "Complete visibility across two datasets without dropping records.",
      "Essential tool for data reconciliation and sync auditing."
    ],
    "disadvantages": [
      "High memory consumption as both sides must be tracked in memory."
    ],
    "interviewQuestions": [
      {
        "question": "When should you use FULL OUTER JOIN in production systems?",
        "answer": "FULL OUTER JOIN is predominantly used in financial reconciliation, schema migrations, and data auditing where you need to compare two datasets and identify: 1. Rows present in both systems, 2. Rows missing in the destination, and 3. Unexpected orphaned rows present only in the destination."
      },
      {
        "question": "How does an engine execute a Hash Full Outer Join under the hood?",
        "answer": "The engine hashes table A into an in-memory hash table where every entry has a \"visited\" bit initialized to 0. It streams table B and probes the hash table: matching rows are emitted and the hash entry’s bit is set to 1; unmatched table B rows are emitted with NULLs for table A. After table B finishes streaming, the engine scans the hash table and emits all entries whose visited bit is still 0 with NULLs for table B."
      },
      {
        "question": "How do you write a Full Outer Anti-Join to find rows that exist in EITHER table but NOT in both?",
        "answer": "A Full Outer Anti-Join combines FULL OUTER JOIN with a WHERE filter checking for NULL on either primary key: SELECT COALESCE(a.id, b.id) AS id, a.val, b.val FROM table_a a FULL OUTER JOIN table_b b ON a.id = b.id WHERE a.id IS NULL OR b.id IS NULL; This returns the symmetric difference between the two datasets."
      },
      {
        "question": "Why can FULL OUTER JOIN NOT be optimized into a simple Nested Loop Join with an inner index scan?",
        "answer": "A standard index nested loop scans outer table A and probes an index on B. But in a FULL OUTER JOIN, the engine must also detect which rows in B were NEVER visited by any row in A! An index probe cannot easily identify unvisited index entries without maintaining a full bitmap of the inner table or scanning table B independently."
      },
      {
        "question": "What is the performance difference between FULL OUTER JOIN vs UNION of LEFT and RIGHT joins?",
        "answer": "A single FULL OUTER JOIN processes both relations in a single pipeline pass using an in-memory hash join. Simulating it with (SELECT ... LEFT JOIN ...) UNION (SELECT ... RIGHT JOIN ...) executes two separate full table scans of both tables, performs two separate joins, and runs an expensive sorting/deduplication pass across the union, running 3x to 5x slower."
      }
    ],
    "interviewReadyAnswer": "A FULL OUTER JOIN preserves all records from both tables, filling unmatched columns with NULLs. Its primary real-world application is data reconciliation and sync audit pipelines between disparate systems.",
    "quickTest": {
      "question": "Table A has 3 rows; Table B has 2 rows. None of the keys match. How many rows does a FULL OUTER JOIN produce?",
      "options": [
        {
          "key": "A",
          "text": "0"
        },
        {
          "key": "B",
          "text": "5"
        },
        {
          "key": "C",
          "text": "6"
        },
        {
          "key": "D",
          "text": "3"
        }
      ],
      "correctAnswer": "B",
      "explanation": "With 0 matches, all 3 rows from A are returned (padded with NULLs for B), and all 2 rows from B are returned (padded with NULLs for A): 3 + 2 = 5 rows."
    },
    "mentalModel": "Venn Diagram: Captures the entire overlapping middle AND both outer left and right crescent wings.",
    "codeSnippet": "SELECT COALESCE(a.id, b.id) AS unified_id, a.val, b.val\nFROM table_a a\nFULL OUTER JOIN table_b b ON a.id = b.id;",
    "takeaways": [
      "FULL OUTER JOIN retains all records from both sides.",
      "Use COALESCE to merge primary keys into a single column.",
      "Ideal for financial reconciliation and audit discrepancy reports."
    ],
    "commonPitfall": {
      "mistake": "Projecting only left.id in a FULL OUTER JOIN, which returns NULL for records only present in the right table.",
      "fix": "Use COALESCE(left.id, right.id) in the SELECT projection."
    },
    "nextTopicId": "self-and-cross-join",
    "prevTopicId": "left-and-right-join"
  },
  {
    "id": "self-and-cross-join",
    "topicNumber": 32,
    "title": "SELF & CROSS JOIN",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Self-referencing hierarchies (manager-employee), Cartesian products (CROSS JOIN), matrix generation, and explosion risks.",
    "definition": "A SELF JOIN joins a table to itself to model hierarchical relationships. A CROSS JOIN produces a Cartesian product, combining every row of table A with every row of table B.",
    "eli5": "SELF JOIN is looking in a family tree: you are a person, and your parent is also a person in the exact same directory. CROSS JOIN is a menu combo: 3 drinks times 4 sandwiches equals 12 meal combinations.",
    "realWorldExample": {
      "description": "Displaying employees alongside their direct managers, or generating all possible shirt sizes and colors.",
      "tables": [
        {
          "title": "Employees Hierarchy",
          "headers": [
            "id",
            "name",
            "manager_id"
          ],
          "rows": [
            [
              1,
              "CEO Boss",
              "NULL"
            ],
            [
              2,
              "Alice (Manager)",
              1
            ],
            [
              3,
              "Bob (Developer)",
              2
            ]
          ]
        }
      ],
      "explanation": "A SELF JOIN compares emp e WITH emp m ON e.manager_id = m.id."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: SELF JOIN for organizational hierarchy",
        "code": "SELECT\n  e.name AS employee_name,\n  COALESCE(m.name, 'Top Executive') AS manager_name\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;",
        "note": "Requires distinct table aliases (e and m) for the same table."
      },
      {
        "step": "Step 2: CROSS JOIN for combination generation",
        "code": "SELECT s.size, c.color\nFROM (VALUES ('S'), ('M'), ('L')) AS s(size)\nCROSS JOIN (VALUES ('Red'), ('Blue')) AS c(color);",
        "note": "Generates 3 * 2 = 6 SKU combinations."
      }
    ],
    "rulesTable": [
      {
        "rule": "Mandatory Table Aliasing",
        "explanation": "A SELF JOIN requires distinct aliases (e.g. e and m) so the parser knows which instance you reference."
      },
      {
        "rule": "Cartesian Explosion",
        "explanation": "CROSS JOIN produces N * M rows. Joining two 10,000-row tables produces 100,000,000 rows."
      },
      {
        "rule": "Implicit CROSS JOIN",
        "explanation": "Listing tables with a comma (FROM A, B) without WHERE is an old-style CROSS JOIN."
      },
      {
        "rule": "Cartesian explosion risk",
        "explanation": "CROSS JOIN produces N * M rows; joining a 100k table with a 100k table generates 10 billion rows."
      },
      {
        "rule": "Mandatory table aliasing in SELF JOIN",
        "explanation": "Joining a table to itself requires distinct aliases (e.g. e for employee, m for manager) to disambiguate columns."
      }
    ],
    "deepDive": {
      "title": "Generating Continuous Date Calendars with CROSS JOIN / generate_series",
      "description": "CROSS JOIN is used in reporting to create a matrix of all dates against all product categories so reports do not omit days with zero sales.",
      "codeSnippet": "-- Matrix of all stores and all dates:\nSELECT s.store_id, d.report_date, COALESCE(SUM(o.amount), 0) AS sales\nFROM stores s\nCROSS JOIN generate_series('2026-01-01'::date, '2026-01-07'::date, '1 day') AS d(report_date)\nLEFT JOIN orders o ON o.store_id = s.store_id AND DATE(o.created_at) = d.report_date\nGROUP BY s.store_id, d.report_date;",
      "warning": "Never execute a CROSS JOIN between two large tables without strict limits or WHERE filters."
    },
    "advantages": [
      "SELF JOIN models trees, graphs, and hierarchies cleanly.",
      "CROSS JOIN generates test combinations, calendars, and SKU matrices."
    ],
    "disadvantages": [
      "Accidental CROSS JOINs exhaust database memory and disk buffer caches."
    ],
    "interviewQuestions": [
      {
        "question": "What is a SELF JOIN and how do you model an organizational employee-manager hierarchy?",
        "answer": "A SELF JOIN is a regular join where a table is joined with itself. In an organizational hierarchy, the employees table has an id (PK) and manager_id (FK referencing employees.id). You join the table to itself using two distinct aliases: SELECT e.name AS employee, m.name AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id; Using LEFT JOIN ensures the CEO (who has NULL manager_id) is preserved."
      },
      {
        "question": "When is CROSS JOIN intentionally used in production architecture?",
        "answer": "CROSS JOIN is used for matrix generation: 1. Generating contiguous calendar reporting ranges by cross-joining a date dimension with active product IDs (so days with zero sales still show 0 instead of missing rows), 2. Generating combinatorial test matrices, 3. Computing Cartesian products for permutations across small dimension lookup tables."
      },
      {
        "question": "What is the difference between comma-separated tables (FROM tableA, tableB) and CROSS JOIN?",
        "answer": "In SQL-89 syntax, FROM tableA, tableB is an implicit CROSS JOIN. In modern SQL-92, explicit CROSS JOIN syntax is preferred. While optimizers produce identical execution plans, explicit CROSS JOIN makes developer intent obvious and prevents accidental missing join conditions."
      },
      {
        "question": "How do you find consecutive rows or pairs of events using a SELF JOIN?",
        "answer": "You join a table to itself on a condition like a.user_id = b.user_id AND b.step = a.step + 1: SELECT a.user_id, a.event_name AS first_step, b.event_name AS next_step FROM user_funnel a JOIN user_funnel b ON a.user_id = b.user_id AND b.step_num = a.step_num + 1; (Note: In modern SQL, window functions like LEAD() are usually faster)."
      },
      {
        "question": "Why does CROSS JOIN LATERAL (in PostgreSQL) differ from a standard CROSS JOIN?",
        "answer": "In a standard CROSS JOIN, table B cannot reference columns from table A. A CROSS JOIN LATERAL acts like a for-each loop: for every row in table A, the subquery on the right is executed with access to table A’s columns. It is widely used to unpack JSON arrays (CROSS JOIN LATERAL jsonb_array_elements()) or fetch the top N items per group."
      }
    ],
    "interviewReadyAnswer": "A SELF JOIN references the same table using distinct aliases to query hierarchies and relational graphs. A CROSS JOIN generates a Cartesian product of all rows, useful for date scaffolds and permutation matrices.",
    "quickTest": {
      "question": "Why does an accidental omission of a join condition (e.g. SELECT * FROM table1, table2) cause severe performance degradation?",
      "options": [
        {
          "key": "A",
          "text": "It triggers table corruption."
        },
        {
          "key": "B",
          "text": "It creates a Cartesian product (CROSS JOIN) producing N * M rows, flooding CPU and memory."
        },
        {
          "key": "C",
          "text": "It locks the database in read-only mode."
        },
        {
          "key": "D",
          "text": "It forces a database restart."
        }
      ],
      "correctAnswer": "B",
      "explanation": "Omitting join conditions causes a Cartesian product that multiplies row counts exponentially (N * M), overwhelming memory and network."
    },
    "mentalModel": "Self join is a family tree in a family reunion book; cross join is a restaurant menu pairing every main dish with every side.",
    "codeSnippet": "SELECT e.name AS staff, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;",
    "takeaways": [
      "SELF JOIN models organizational charts and hierarchies.",
      "Always use table aliases when joining a table to itself.",
      "CROSS JOIN multiplies row counts (N * M); use with caution."
    ],
    "commonPitfall": {
      "mistake": "Forgetting an ON clause or comma-joining tables, generating billions of unwanted Cartesian rows.",
      "fix": "Always use explicit JOIN ... ON syntax."
    },
    "nextTopicId": "subqueries",
    "prevTopicId": "full-outer-join"
  },
  {
    "id": "subqueries",
    "topicNumber": 33,
    "title": "Subqueries",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Scalar subqueries, multi-row subqueries, subqueries in SELECT/FROM/WHERE, and optimizer flattening.",
    "definition": "A subquery (or nested query) is a complete SELECT statement nested inside an outer SQL statement (SELECT, INSERT, UPDATE, or DELETE).",
    "eli5": "A subquery is a question inside a question: \"Who earned more than the average salary?\" First, the inside question finds the average salary ($50k). Then, the outside question finds who earns more than $50k.",
    "realWorldExample": {
      "description": "Finding all employees who earn more than the company-wide average salary.",
      "tables": [
        {
          "title": "Employees",
          "headers": [
            "name",
            "salary"
          ],
          "rows": [
            [
              "Alice",
              "$120,000 (Above average)"
            ],
            [
              "Bob",
              "$80,000 (Below average)"
            ],
            [
              "Charlie",
              "$100,000 (Equals average: $100k)"
            ]
          ]
        }
      ],
      "explanation": "The subquery (SELECT AVG(salary) FROM employees) evaluates to 100,000."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Scalar subquery in WHERE",
        "code": "SELECT name, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);",
        "note": "A scalar subquery returns exactly one row and one column."
      },
      {
        "step": "Step 2: Derived table in FROM clause",
        "code": "SELECT department, avg_sal\nFROM (\n  SELECT department, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY department\n) AS dept_summary\nWHERE avg_sal > 90000;",
        "note": "Derived tables in FROM must have an alias."
      }
    ],
    "rulesTable": [
      {
        "rule": "Scalar Subquery Expectation",
        "explanation": "A scalar subquery used with comparison operators (=, >, <) must return at most 1 value; returning 2+ rows causes a runtime error."
      },
      {
        "rule": "Derived Table Alias",
        "explanation": "In ANSI SQL, every subquery in a FROM clause must be assigned a table alias."
      },
      {
        "rule": "Subquery Flattening",
        "explanation": "Modern Cost-Based Optimizers rewrite subqueries into joins whenever mathematically possible."
      },
      {
        "rule": "Subquery classification",
        "explanation": "Scalar subqueries return 1 row & 1 column; multi-row subqueries return N rows; table subqueries act as derived tables."
      },
      {
        "rule": "Scalar subquery cardinality error",
        "explanation": "If a scalar subquery returns more than 1 row at runtime, the engine aborts the transaction with a fatal error."
      }
    ],
    "deepDive": {
      "title": "Subquery Unnesting and Optimizer Flattening",
      "description": "Modern database optimizers do not naively execute subqueries independently if they can rewrite them into joins. This process is called subquery unnesting or subquery pull-up, allowing the optimizer to choose better join algorithms.",
      "codeSnippet": "-- Written as Subquery:\nSELECT * FROM users WHERE id IN (SELECT user_id FROM orders);\n\n-- Optimizer automatically rewrites it into a Semi-Join:\n-- Hash Semi Join (users.id = orders.user_id)",
      "warning": "Scalar subqueries in the SELECT projection list that reference outer rows can trigger slow row-by-row execution if not unnested."
    },
    "advantages": [
      "Enables expressive multi-step queries without temporary tables.",
      "Allows dynamic filtering against calculated aggregates."
    ],
    "disadvantages": [
      "Complex nested subqueries become hard to read; CTEs are often clearer."
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between a Scalar Subquery, Row Subquery, and Table Subquery?",
        "answer": "1. Scalar Subquery: returns exactly one column and at most one row (e.g. SELECT (SELECT MAX(salary) FROM employees)); it can be used anywhere a literal constant is accepted. 2. Row Subquery: returns multiple columns for a single row (e.g. WHERE (col1, col2) = (SELECT a, b FROM tbl LIMIT 1)). 3. Table Subquery (Derived Table): returns multiple columns and multiple rows, used in the FROM clause with an alias."
      },
      {
        "question": "What happens at runtime if a Scalar Subquery returns multiple rows?",
        "answer": "The SQL query planner allows the query to compile, but when the execution engine runs and detects a second row emitted from the subquery, it immediately aborts the entire transaction with a fatal error: \"more than one row returned by a subquery used as an expression\". Always ensure scalar subqueries use aggregate functions (MAX, MIN) or LIMIT 1."
      },
      {
        "question": "What is Query Decorrelation / Subquery Unnesting in the Cost-Based Optimizer?",
        "answer": "Naive subquery execution runs the inner query repeatedly or creates intermediate spool tables. Modern optimizers perform Subquery Unnesting: they mathematically transform independent or semi-join subqueries into equivalent joins (Hash Join or Merge Join), allowing the planner to explore global join orders and index paths across the entire query tree."
      },
      {
        "question": "Where can subqueries be placed in a SQL statement?",
        "answer": "Subqueries can appear in: 1. SELECT list (scalar subquery generating computed columns), 2. FROM clause (derived tables acting as temporary relations), 3. WHERE clause (filtering with IN, EXISTS, or comparisons), 4. HAVING clause (filtering groups by subquery aggregations), 5. JOIN ON clause, and 6. UPDATE SET assignments."
      },
      {
        "question": "What is the performance difference between a Derived Table Subquery vs a Common Table Expression (CTE)?",
        "answer": "In modern databases (PostgreSQL 12+, MySQL 8+), the optimizer treats non-recursive CTEs and derived table subqueries identically: they are both inlined into the main query AST. However, CTEs are vastly more readable, can be referenced multiple times, and support recursive graph traversal."
      }
    ],
    "interviewReadyAnswer": "Subqueries are nested SELECT statements used in WHERE, FROM, or SELECT clauses. While scalar subqueries return a single value for comparisons, multi-row subqueries work with IN or ANY. Modern optimizers unnest eligible subqueries into joins.",
    "quickTest": {
      "question": "What error occurs when executing \"SELECT * FROM items WHERE price = (SELECT price FROM items);\"?",
      "options": [
        {
          "key": "A",
          "text": "Syntax error: Subqueries cannot query the same table."
        },
        {
          "key": "B",
          "text": "Runtime error: More than one row returned by subquery used as an expression."
        },
        {
          "key": "C",
          "text": "All items are deleted."
        },
        {
          "key": "D",
          "text": "It executes and returns only the first item."
        }
      ],
      "correctAnswer": "B",
      "explanation": "The = operator expects a single scalar value. If the subquery returns multiple prices, the query aborts with a cardinal error."
    },
    "mentalModel": "Nested parentheses in math: Calculate the inner equation inside parentheses first, and feed its result to the outer equation.",
    "codeSnippet": "SELECT name, department, salary\nFROM employees\nWHERE salary = (SELECT MAX(salary) FROM employees);",
    "takeaways": [
      "Scalar subqueries must return at most 1 row and 1 column.",
      "Derived tables in the FROM clause always require an alias.",
      "Optimizers rewrite unnested subqueries into semi-joins."
    ],
    "commonPitfall": {
      "mistake": "Using = with a subquery that might return multiple rows under real production data.",
      "fix": "Use IN or = ANY (...) instead of =."
    },
    "nextTopicId": "correlated-subqueries",
    "prevTopicId": "self-and-cross-join"
  },
  {
    "id": "correlated-subqueries",
    "topicNumber": 34,
    "title": "Correlated Subqueries",
    "category": "query-execution",
    "difficulty": "Advanced",
    "summary": "Outer query row dependencies, execution overhead, decorrelation optimizations, and window function alternatives.",
    "definition": "A correlated subquery is a nested query that depends on column values from the outer query for its evaluation, executing conceptually once for each candidate row processed by the outer query.",
    "eli5": "An uncorrelated subquery is like looking up the weather once for everyone. A correlated subquery is like calling every person individually to ask what clothes they are wearing based on their specific city.",
    "realWorldExample": {
      "description": "Finding employees who earn more than the average salary of their own specific department.",
      "tables": [
        {
          "title": "Employees",
          "headers": [
            "id",
            "dept",
            "salary",
            "Dept Avg"
          ],
          "rows": [
            [
              1,
              "Eng",
              "$130,000",
              "$110,000 (Matched)"
            ],
            [
              2,
              "Eng",
              "$90,000",
              "$110,000 (Filtered)"
            ],
            [
              3,
              "HR",
              "$85,000",
              "$75,000 (Matched)"
            ]
          ]
        }
      ],
      "explanation": "The inner query computes the average for e1.dept, tying it to the outer row."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Correlated subquery with outer reference",
        "code": "SELECT e1.name, e1.department, e1.salary\nFROM employees e1\nWHERE e1.salary > (\n  SELECT AVG(e2.salary)\n  FROM employees e2\n  WHERE e2.department = e1.department -- Outer reference!\n);",
        "note": "e1 is referenced inside the subquery."
      },
      {
        "step": "Step 2: Optimized alternative using Window Functions",
        "code": "WITH ranked AS (\n  SELECT name, department, salary,\n    AVG(salary) OVER (PARTITION BY department) AS dept_avg\n  FROM employees\n)\nSELECT name, department, salary\nFROM ranked\nWHERE salary > dept_avg;",
        "note": "Executes in a single sorted pass instead of row-by-row."
      }
    ],
    "rulesTable": [
      {
        "rule": "Outer Scope Dependency",
        "explanation": "Correlated subqueries cannot execute independently in isolation because they require outer values."
      },
      {
        "rule": "N+1 Execution Penalty",
        "explanation": "Without optimizer decorrelation, evaluating a correlated subquery on N outer rows can cause O(N^2) complexity."
      },
      {
        "rule": "Decorrelation",
        "explanation": "Advanced database optimizers rewrite correlated subqueries into hash or merge joins."
      },
      {
        "rule": "Outer row dependency",
        "explanation": "Correlated subqueries reference columns from the enclosing outer query, binding them to outer execution loops."
      },
      {
        "rule": "Quadratic complexity risk",
        "explanation": "If un-optimized, a correlated subquery executes M times for N outer rows, scaling as O(N * M)."
      }
    ],
    "deepDive": {
      "title": "Correlated Subqueries vs Window Functions Performance",
      "description": "On a table of 100,000 rows, a naive correlated subquery could theoretically execute the inner query 100,000 times! Using an analytic window function (AVG(salary) OVER (PARTITION BY dept)) accomplishes the same result in a single O(N log N) scan.",
      "codeSnippet": "-- Naive correlated subquery (potentially slow):\nWHERE salary > (SELECT AVG(salary) FROM emp e2 WHERE e2.dept = e1.dept)\n\n-- High performance window function (1 pass):\nSELECT * FROM (\n  SELECT *, AVG(salary) OVER (PARTITION BY dept) AS d_avg FROM emp\n) t WHERE salary > d_avg;",
      "warning": "Always check EXPLAIN plans for correlated subqueries to ensure the engine successfully decorrelated them."
    },
    "advantages": [
      "Expressive and intuitive for per-entity comparisons.",
      "Works seamlessly in UPDATE and DELETE statements to target rows based on child tables."
    ],
    "disadvantages": [
      "Can cause devastating O(N^2) query slowdowns if the engine fails to decorrelate."
    ],
    "interviewQuestions": [
      {
        "question": "What is a Correlated Subquery and why is it often a major performance bottleneck?",
        "answer": "A Correlated Subquery is an inner query that references a column from the outer query (e.g. WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.department_id = e1.department_id)). If the Cost-Based Optimizer cannot unnest the query, the engine is forced to execute the subquery once for EVERY SINGLE ROW in the outer table, resulting in O(N * M) nested-loop execution that brings large databases to a crawl."
      },
      {
        "question": "How do you rewrite a correlated subquery into a Window Function for 100x faster performance?",
        "answer": "Instead of computing the department average row-by-row in an inner subquery, you compute it in a single pass using an analytical window function: WITH dept_avg AS (SELECT id, name, department_id, salary, AVG(salary) OVER (PARTITION BY department_id) AS avg_sal FROM employees) SELECT * FROM dept_avg WHERE salary > avg_sal; This executes in a single streaming pass in O(N log N) time."
      },
      {
        "question": "Can the query optimizer automatically decorrelate a subquery into a JOIN?",
        "answer": "Yes! Modern optimizers (PostgreSQL, Oracle, SQL Server) recognize correlated subqueries matching Semi-Join or Anti-Join patterns (such as WHERE EXISTS (SELECT 1 FROM ... WHERE outer.id = inner.id)) and automatically transform them into physical Hash Semi-Joins or Merge Semi-Joins, eliminating the nested loop."
      },
      {
        "question": "What is the difference between an Uncorrelated Subquery and a Correlated Subquery?",
        "answer": "An Uncorrelated Subquery has no dependencies on the outer query: it can be executed once at the start of the query, its result cached in memory, and reused for all outer rows. A Correlated Subquery depends directly on values from the current outer row, meaning its result changes dynamically as the outer scan progresses."
      },
      {
        "question": "How do you find the highest-paid employee per department using a correlated subquery vs CTE?",
        "answer": "Using correlated subquery: SELECT * FROM employees e WHERE salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.dept_id = e.dept_id); Using CTE with window function: WITH ranked AS (SELECT *, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk FROM employees) SELECT * FROM ranked WHERE rnk = 1; The CTE approach avoids repeated table scans and handles ties cleanly."
      }
    ],
    "interviewReadyAnswer": "A correlated subquery references values from the outer query, evaluating dynamically per candidate row. While powerful for per-group filtering, window functions or join transformations are generally preferred to avoid row-by-row execution penalties.",
    "quickTest": {
      "question": "Why can a correlated subquery NOT be tested by running its inner query independently in a database GUI?",
      "options": [
        {
          "key": "A",
          "text": "It has syntax errors."
        },
        {
          "key": "B",
          "text": "It references an alias or column from the outer query that is undefined on its own."
        },
        {
          "key": "C",
          "text": "It can only run inside transactions."
        },
        {
          "key": "D",
          "text": "It requires root privileges."
        }
      ],
      "correctAnswer": "B",
      "explanation": "The inner query contains an outer reference (e.g. e1.department) which does not exist when executed outside the context of the outer query."
    },
    "mentalModel": "Teacher grading on a curve: For every student, the teacher looks at that specific student's section, calculates that section's score, and compares.",
    "codeSnippet": "SELECT o1.id, o1.customer_id, o1.amount\nFROM orders o1\nWHERE o1.amount = (\n  SELECT MAX(o2.amount) FROM orders o2 WHERE o2.customer_id = o1.customer_id\n);",
    "takeaways": [
      "Correlated subqueries depend on outer row values.",
      "They can cause O(N^2) execution without optimizer decorrelation.",
      "Prefer window functions or joins for performance-critical queries."
    ],
    "commonPitfall": {
      "mistake": "Writing correlated subqueries inside the SELECT projection list on large tables, causing massive CPU lag.",
      "fix": "Join against an aggregated derived table or use window functions."
    },
    "nextTopicId": "exists-and-not-exists",
    "prevTopicId": "subqueries"
  },
  {
    "id": "exists-and-not-exists",
    "topicNumber": 35,
    "title": "EXISTS & NOT EXISTS",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Boolean semi-join checks, short-circuit execution, and why NOT EXISTS is superior to NOT IN.",
    "definition": "EXISTS is a boolean operator that tests for the presence of any rows returned by a subquery, returning TRUE as soon as the first matching row is found.",
    "eli5": "EXISTS is like peeking into a room to see if anyone is inside. As soon as you spot one person, you say \"YES!\" and stop looking. You don't need to count all 50 people.",
    "realWorldExample": {
      "description": "Finding all customers who have placed at least one order.",
      "tables": [
        {
          "title": "Users",
          "headers": [
            "id",
            "name"
          ],
          "rows": [
            [
              1,
              "Alice (Has orders)"
            ],
            [
              2,
              "Bob (Has orders)"
            ],
            [
              3,
              "Charlie (0 orders)"
            ]
          ]
        }
      ],
      "explanation": "EXISTS stops searching orders as soon as it finds a single matching row for Alice."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Efficient existence check with EXISTS",
        "code": "SELECT u.id, u.name\nFROM users u\nWHERE EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);",
        "note": "SELECT 1 is conventional because EXISTS only checks row presence, ignoring projected column values."
      },
      {
        "step": "Step 2: Safe absence check with NOT EXISTS",
        "code": "SELECT u.id, u.name\nFROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders o WHERE o.user_id = u.id\n);",
        "note": "Safely handles NULLs without the Three-Valued Logic breakdown of NOT IN."
      }
    ],
    "rulesTable": [
      {
        "rule": "Short-Circuit Evaluation",
        "explanation": "EXISTS terminates scanning as soon as the very first matching row is identified."
      },
      {
        "rule": "Projection Irrelevant",
        "explanation": "Writing SELECT 1, SELECT *, or SELECT NULL inside EXISTS makes no difference; the engine only inspects row existence."
      },
      {
        "rule": "Semi-Join Execution",
        "explanation": "Optimizers convert EXISTS into high-speed Hash Semi-Joins or Index Scans."
      },
      {
        "rule": "Semi-join short-circuiting",
        "explanation": "EXISTS stops scanning the inner table as soon as the first matching tuple is located (best-case O(1))."
      },
      {
        "rule": "Projection list irrelevance",
        "explanation": "The projection list in SELECT inside EXISTS is ignored by the optimizer; SELECT 1 and SELECT * are identical."
      }
    ],
    "deepDive": {
      "title": "EXISTS vs IN vs JOIN Performance",
      "description": "Historically, EXISTS was faster than IN because it short-circuited. Modern query planners frequently rewrite both into identical Semi-Join execution plans. However, NOT EXISTS remains vastly superior to NOT IN because NOT IN breaks when NULLs are present.",
      "codeSnippet": "-- Clean, safe, and fast Semi-Join:\nSELECT c.name FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id AND o.amount > 500);",
      "warning": "Always use NOT EXISTS instead of NOT IN when the child table may contain NULL foreign keys."
    },
    "advantages": [
      "Short-circuits immediately on the first match.",
      "Immune to the Three-Valued Logic NULL bugs that plague NOT IN."
    ],
    "disadvantages": [
      "Writing correlated subqueries for EXISTS can be less readable than simple joins."
    ],
    "interviewQuestions": [
      {
        "question": "Why does \"SELECT 1\" vs \"SELECT *\" inside EXISTS make ZERO performance difference?",
        "answer": "EXISTS only tests for row existence (cardinality > 0); it never projects or retrieves actual column data. The Cost-Based Optimizer parses the subquery, strips out the projection list entirely, and transforms the operation into an internal boolean semi-join. Writing SELECT 1, SELECT *, or SELECT 'pizza' compiles to the exact same execution plan."
      },
      {
        "question": "Why is NOT EXISTS strictly safer and faster than NOT IN when NULLs are present?",
        "answer": "Because of Three-Valued Logic! If an inner query returns even one NULL, NOT IN evaluates to UNKNOWN for all rows, returning ZERO results. NOT EXISTS evaluates a boolean existence check: a row either exists or does not. NULL values in the inner table do not cause NOT EXISTS to fail or return UNKNOWN, making it 100% bug-free and allowing the optimizer to use efficient Hash Anti-Joins."
      },
      {
        "question": "How does the engine physically execute an EXISTS Semi-Join?",
        "answer": "In a Semi-Join, as soon as the engine finds the first matching row in the inner table for a given outer row, it immediately stops scanning the inner table, emits the outer row, and advances to the next outer row. Unlike an INNER JOIN, it never duplicates the outer row even if the inner table has 1,000 matches."
      },
      {
        "question": "What is the difference between an Anti-Join and a Semi-Join?",
        "answer": "A Semi-Join (EXISTS) returns rows from the outer table that have AT LEAST ONE match in the inner table (without duplicating outer rows). An Anti-Join (NOT EXISTS) returns rows from the outer table that have ZERO matches in the inner table. Both execute in O(N + M) using hash or merge algorithms."
      },
      {
        "question": "Can you use EXISTS with an uncorrelated subquery?",
        "answer": "Yes! An uncorrelated EXISTS tests whether a global condition holds true: SELECT * FROM orders WHERE EXISTS (SELECT 1 FROM system_flags WHERE maintenance_mode = false); If the subquery returns any row, the condition evaluates to TRUE for all rows; if empty, the query returns zero rows."
      }
    ],
    "interviewReadyAnswer": "EXISTS evaluates boolean existence using short-circuit semi-join logic. Unlike NOT IN, which breaks when NULL values are present, NOT EXISTS handles nullable columns deterministically, making it the industry standard for anti-joins.",
    "quickTest": {
      "question": "What does \"SELECT 1\" inside \"WHERE EXISTS (SELECT 1 FROM orders WHERE ...)\" signify?",
      "options": [
        {
          "key": "A",
          "text": "It limits the inner query to 1 row."
        },
        {
          "key": "B",
          "text": "It is a syntactic convention; EXISTS only cares if a row exists, ignoring the projection list."
        },
        {
          "key": "C",
          "text": "It forces table locking."
        },
        {
          "key": "D",
          "text": "It counts the number of matching orders."
        }
      ],
      "correctAnswer": "B",
      "explanation": "The projection list in EXISTS is ignored by the database optimizer; it only tests whether at least one tuple satisfies the condition."
    },
    "mentalModel": "Bouncer checking a guest list: The bouncer stops searching as soon as they find your name once. They don't keep scanning the remaining 500 pages.",
    "codeSnippet": "SELECT u.email FROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM logins l WHERE l.user_id = u.id AND l.login_time > NOW() - INTERVAL '30 days'\n);",
    "takeaways": [
      "EXISTS short-circuits on the first matching tuple.",
      "NOT EXISTS is immune to NULL traps.",
      "Optimizers translate EXISTS into semi-joins."
    ],
    "commonPitfall": {
      "mistake": "Using NOT IN on a subquery containing nullable columns and having all rows silently discarded.",
      "fix": "Always use NOT EXISTS for anti-join queries."
    },
    "nextTopicId": "union-and-union-all",
    "prevTopicId": "correlated-subqueries"
  },
  {
    "id": "union-and-union-all",
    "topicNumber": 36,
    "title": "UNION & UNION ALL",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Combining result sets vertically, deduplication overhead, column type compatibility, and set theory.",
    "definition": "UNION combines the result sets of two or more SELECT queries vertically into a single dataset, automatically deduplicating rows. UNION ALL combines results without deduplication.",
    "eli5": "UNION ALL is taping two lists together end-to-end. UNION is taping them together, reading every line, and crossing out any duplicates.",
    "realWorldExample": {
      "description": "Combining active customers and archived customers into a master mailing list.",
      "tables": [
        {
          "title": "Result Comparison",
          "headers": [
            "Operation",
            "List A (100 rows)",
            "List B (50 rows)",
            "Output Rows"
          ],
          "rows": [
            [
              "UNION ALL",
              "100 rows",
              "50 rows",
              "150 rows (Instant)"
            ],
            [
              "UNION",
              "100 rows",
              "50 rows",
              "130 rows (Deduplicated, slower)"
            ]
          ]
        }
      ],
      "explanation": "UNION ALL preserves all rows without memory-intensive sorting or hashing."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: High performance combination with UNION ALL",
        "code": "SELECT id, email, 'customer' AS user_type FROM customers\nUNION ALL\nSELECT id, email, 'contractor' AS user_type FROM contractors\nORDER BY email;",
        "note": "UNION ALL does not sort or deduplicate, making it much faster."
      },
      {
        "step": "Step 2: Distinct set union with UNION",
        "code": "SELECT city FROM domestic_suppliers\nUNION\nSELECT city FROM international_suppliers;",
        "note": "Removes duplicate cities from the combined list."
      }
    ],
    "rulesTable": [
      {
        "rule": "Column Count & Type Compatibility",
        "explanation": "All SELECT statements in the UNION must have the exact same number of columns with compatible data types."
      },
      {
        "rule": "Column Names from First Query",
        "explanation": "The final result set inherits column names and aliases from the first SELECT query."
      },
      {
        "rule": "Single ORDER BY at End",
        "explanation": "Only one ORDER BY clause is permitted, placed at the very end of the entire union pipeline."
      },
      {
        "rule": "UNION deduplication sort overhead",
        "explanation": "UNION executes a mandatory sorting or hash deduplication pass; UNION ALL streams rows with zero deduplication cost."
      },
      {
        "rule": "Column count and type matching",
        "explanation": "Both queries must project the exact same number of columns with compatible data types."
      }
    ],
    "deepDive": {
      "title": "Performance: Why UNION ALL should be your Default",
      "description": "UNION performs an expensive Unique Sort or HashAggregate over the entire combined dataset to eliminate duplicates. If you know the two sets are disjoint (e.g. current orders and archived orders), or if duplicates are acceptable, UNION ALL saves immense CPU and memory.",
      "codeSnippet": "-- SLOW (Sorts and deduplicates 2 million rows in RAM):\nSELECT id FROM current_logs UNION SELECT id FROM archived_logs;\n\n-- FAST (Streams rows immediately without memory sorting):\nSELECT id FROM current_logs UNION ALL SELECT id FROM archived_logs;",
      "warning": "Never use UNION when UNION ALL is sufficient; the deduplication sort can spill to disk."
    },
    "advantages": [
      "Combines disparate tables with identical schemas into unified feeds.",
      "UNION ALL provides high-throughput zero-cost set concatenation."
    ],
    "disadvantages": [
      "UNION triggers expensive in-memory sort or hash deduplication."
    ],
    "interviewQuestions": [
      {
        "question": "What is the exact physical execution difference between UNION and UNION ALL?",
        "answer": "UNION ALL simply concatenates the tuple streams from both queries and streams them directly to the client socket with zero sorting and zero buffering (O(N + M)). UNION concatenates the streams and then forces a mandatory deduplication phase: the engine must either sort all rows or build an in-memory hash set to eliminate duplicates, consuming significant CPU, memory, and potential disk sort spills."
      },
      {
        "question": "Why should software engineers default to UNION ALL unless duplicate removal is strictly required?",
        "answer": "Because UNION incurs a severe O(N log N) sort or hash overhead. If the two queries are known to produce disjoint sets (e.g. querying active_users and archived_users where IDs never overlap), using UNION wastes massive CPU and memory resources deduplicating records that could never be duplicates. Always default to UNION ALL."
      },
      {
        "question": "How are column names determined in a UNION query?",
        "answer": "Column names in the final result set are determined entirely by the projection list of the FIRST query in the UNION chain. Any column aliases specified in subsequent queries are completely ignored by the engine."
      },
      {
        "question": "Can you use ORDER BY on individual queries within a UNION chain?",
        "answer": "In standard SQL, you cannot place ORDER BY on individual branches of a UNION without wrapping them in parentheses or subqueries. An ORDER BY placed at the end of a UNION chain sorts the FINAL concatenated result set after all unions and deduplications have completed."
      },
      {
        "question": "What are the rules for data type compatibility in UNION queries?",
        "answer": "Columns in matching positions must have compatible data types. If Query 1 has an INTEGER and Query 2 has a NUMERIC, the engine implicitly promotes the column to NUMERIC. However, if Query 1 has an INTEGER and Query 2 has a VARCHAR, standard engines will throw a type mismatch error unless explicitly cast."
      }
    ],
    "interviewReadyAnswer": "UNION vertically combines query results with automatic deduplication, while UNION ALL retains all rows without deduplication. Unless duplicate elimination is an explicit business requirement, UNION ALL should always be preferred for performance.",
    "quickTest": {
      "question": "Query 1 returns 50 rows; Query 2 returns 30 rows. Exactly 10 rows exist in both results. How many rows will UNION return?",
      "options": [
        {
          "key": "A",
          "text": "80"
        },
        {
          "key": "B",
          "text": "70"
        },
        {
          "key": "C",
          "text": "40"
        },
        {
          "key": "D",
          "text": "10"
        }
      ],
      "correctAnswer": "B",
      "explanation": "50 + 30 = 80 total rows. Deduplicating the 10 shared rows results in 80 - 10 = 70 distinct rows."
    },
    "mentalModel": "Card decks: UNION ALL shuffles two decks together as-is; UNION goes through the combined deck and throws away all duplicate cards.",
    "codeSnippet": "SELECT id, title, 'article' AS type FROM articles\nUNION ALL\nSELECT id, title, 'video' AS type FROM videos\nORDER BY title;",
    "takeaways": [
      "UNION ALL is significantly faster than UNION.",
      "All unioned queries must share the same number and types of columns.",
      "Column names in the result are determined by the first SELECT statement."
    ],
    "commonPitfall": {
      "mistake": "Defaulting to UNION instead of UNION ALL, causing unwanted sort spills on large reports.",
      "fix": "Default to UNION ALL unless duplicate elimination is required."
    },
    "nextTopicId": "cte-common-table-expressions",
    "prevTopicId": "exists-and-not-exists"
  },
  {
    "id": "cte-common-table-expressions",
    "topicNumber": 37,
    "title": "CTE (Common Table Expressions)",
    "category": "architecture",
    "difficulty": "Intermediate",
    "summary": "WITH clauses, modular query pipelines, CTE optimization fencing in PostgreSQL, and recursive CTE introduction.",
    "definition": "A Common Table Expression (CTE) is a temporary named result set defined within the execution scope of a single SELECT, INSERT, UPDATE, or DELETE statement using the WITH keyword.",
    "eli5": "A CTE is like writing down intermediate numbers on a scratchpad while solving a big math problem: you calculate Step A, name it, and use that named result in Step B.",
    "realWorldExample": {
      "description": "Calculating top sales representatives in each region and joining them with company benchmarks.",
      "tables": [
        {
          "title": "Modular Pipeline",
          "headers": [
            "CTE Name",
            "Purpose"
          ],
          "rows": [
            [
              "regional_sales",
              "Aggregates total revenue per sales rep and region"
            ],
            [
              "regional_averages",
              "Computes benchmark average revenue per region"
            ]
          ]
        }
      ],
      "explanation": "The main query joins regional_sales with regional_averages cleanly."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Multi-CTE pipeline",
        "code": "WITH regional_sales AS (\n  SELECT region, rep_id, SUM(amount) AS total_sales\n  FROM sales\n  GROUP BY region, rep_id\n),\nregional_benchmarks AS (\n  SELECT region, AVG(total_sales) AS avg_sales\n  FROM regional_sales\n  GROUP BY region\n)\nSELECT s.rep_id, s.region, s.total_sales, b.avg_sales\nFROM regional_sales s\nJOIN regional_benchmarks b ON s.region = b.region\nWHERE s.total_sales > b.avg_sales;",
        "note": "Modular, top-to-bottom readable query structure."
      }
    ],
    "rulesTable": [
      {
        "rule": "Scope Limitation",
        "explanation": "A CTE only exists for the duration of the query in which it is declared."
      },
      {
        "rule": "Multiple CTEs",
        "explanation": "Declare multiple CTEs separated by commas under a single WITH keyword."
      },
      {
        "rule": "PostgreSQL 12+ Inlining",
        "explanation": "By default, modern PostgreSQL inlines CTEs like subqueries unless explicitly declared AS MATERIALIZED."
      },
      {
        "rule": "PostgreSQL optimization fence behavior",
        "explanation": "Prior to PG 12, CTEs were always materialized (optimization fence); PG 12+ inlines CTEs unless marked AS MATERIALIZED."
      },
      {
        "rule": "CTE scope and lifetime",
        "explanation": "A CTE exists only for the duration of the single query statement in which it is defined; it cannot be queried in subsequent transactions."
      }
    ],
    "deepDive": {
      "title": "CTE Optimization Fencing: MATERIALIZED vs NOT MATERIALIZED",
      "description": "Prior to PostgreSQL 12, CTEs acted as rigid optimization fences: the engine calculated the entire CTE once, cached it in memory, and prevented the optimizer from pushing outer WHERE filters down into it. PostgreSQL 12+ inlines CTEs automatically.",
      "codeSnippet": "-- Force PostgreSQL to materialize once:\nWITH heavy_calc AS MATERIALIZED (\n  SELECT id, complex_func(data) AS score FROM large_table\n)\nSELECT * FROM heavy_calc WHERE score > 50;\n\n-- Force inlining so outer filters push down:\nWITH raw_data AS NOT MATERIALIZED (\n  SELECT * FROM transactions\n)\nSELECT * FROM raw_data WHERE user_id = 42; -- Pushes user_id = 42 into B-Tree index!",
      "warning": "Use AS MATERIALIZED intentionally if a CTE contains a volatile calculation you want evaluated only once."
    },
    "advantages": [
      "Dramatically improves readability over deeply nested subqueries.",
      "Can be referenced multiple times within the same query."
    ],
    "disadvantages": [
      "In older PostgreSQL (<12), CTEs acted as optimization fences, slowing down queries."
    ],
    "interviewQuestions": [
      {
        "question": "What is an \"Optimization Fence\" in PostgreSQL Common Table Expressions (CTEs)?",
        "answer": "Historically in PostgreSQL (versions 11 and older), every CTE was treated as an optimization fence: the engine computed the entire CTE in memory (materialization) before running the outer query, preventing the optimizer from pushing WHERE filters or index constraints down into the CTE. In PostgreSQL 12+, CTEs are automatically inlined into the main query plan unless explicitly marked WITH cte AS MATERIALIZED (...)."
      },
      {
        "question": "What are the advantages of CTEs over nested derived table subqueries?",
        "answer": "1. Readability: CTEs structure queries linearly from top to bottom instead of deep inside-out nesting. 2. Reusability: A single CTE can be referenced multiple times in the same query (e.g. joined against itself). 3. Recursive queries: CTEs support the RECURSIVE keyword for traversing hierarchical graphs, organizational trees, and bill-of-materials. 4. Writable CTEs: In PostgreSQL, CTEs can contain INSERT/UPDATE/DELETE with RETURNING."
      },
      {
        "question": "What is a Writable (Data-Modifying) CTE in PostgreSQL and how is it used in production?",
        "answer": "PostgreSQL allows INSERT, UPDATE, and DELETE statements inside a CTE with a RETURNING clause. This enables atomic data movement between tables in a single statement without multi-step procedural transactions: WITH moved_rows AS (DELETE FROM active_orders WHERE status = 'archived' RETURNING *) INSERT INTO order_archives SELECT * FROM moved_rows;"
      },
      {
        "question": "When should you explicitly specify WITH ... AS MATERIALIZED in PostgreSQL 12+?",
        "answer": "You specify AS MATERIALIZED when: 1. The CTE is computationally expensive and referenced multiple times in the outer query (preventing the engine from re-evaluating it twice), 2. You intentionally want an optimization fence to prevent the planner from choosing a bad join order or risky plan transformation."
      },
      {
        "question": "Can you update or delete rows through a CTE in PostgreSQL?",
        "answer": "You cannot directly execute UPDATE cte_name SET ... because a CTE is a transient virtual result set. However, you can join the underlying physical table to the CTE in an UPDATE statement: WITH target_users AS (SELECT id FROM users WHERE inactive_days > 90) UPDATE users SET status = 'inactive' WHERE id IN (SELECT id FROM target_users);"
      }
    ],
    "interviewReadyAnswer": "Common Table Expressions (CTEs) define named, modular result sets using the WITH keyword. They turn deeply nested subqueries into readable top-to-bottom pipelines, and modern engines inline them to enable full optimizer index pushdowns.",
    "quickTest": {
      "question": "Which keyword is used to declare a Common Table Expression in SQL?",
      "options": [
        {
          "key": "A",
          "text": "DECLARE"
        },
        {
          "key": "B",
          "text": "WITH"
        },
        {
          "key": "C",
          "text": "TEMP TABLE"
        },
        {
          "key": "D",
          "text": "LET"
        }
      ],
      "correctAnswer": "B",
      "explanation": "The WITH keyword initiates a Common Table Expression in ANSI SQL."
    },
    "mentalModel": "Scratchpad: Writing down intermediate calculations with labels so you can combine them cleanly in the final formula.",
    "codeSnippet": "WITH active_users AS (\n  SELECT id, email FROM users WHERE status = 'active'\n)\nSELECT COUNT(*) FROM active_users;",
    "takeaways": [
      "CTEs improve readability compared to nested subqueries.",
      "Declare multiple CTEs separated by commas with one WITH.",
      "PostgreSQL 12+ inlines CTEs automatically for optimal performance."
    ],
    "commonPitfall": {
      "mistake": "Writing WITH multiple times in the same query instead of separating CTEs with commas.",
      "fix": "Use a single WITH keyword: WITH cte1 AS (...), cte2 AS (...) SELECT ..."
    },
    "nextTopicId": "views-and-materialized-views",
    "prevTopicId": "union-and-union-all"
  },
  {
    "id": "views-and-materialized-views",
    "topicNumber": 38,
    "title": "Views, Materialized Views & Zero-Downtime Refresh",
    "category": "architecture",
    "difficulty": "Advanced",
    "summary": "Virtual views, updateable views, materialized physical caching, CONCURRENTLY refreshes, and security abstractions.",
    "definition": "A View is a stored virtual query that does not store data physically. A Materialized View physically caches the query results on disk and can be indexed for high-performance reporting.",
    "eli5": "A View is a saved bookmark or shortcut: every time you click it, the query runs fresh. A Materialized View is a downloaded PDF snapshot: it is instant to open, but needs to be refreshed periodically.",
    "realWorldExample": {
      "description": "An executive analytics dashboard querying complex joins across millions of orders.",
      "tables": [
        {
          "title": "Standard View vs Materialized View",
          "headers": [
            "Feature",
            "Standard View",
            "Materialized View"
          ],
          "rows": [
            [
              "Data Storage",
              "Virtual (Runs query on call)",
              "Physical disk storage (Cached)"
            ],
            [
              "Speed",
              "Slow on heavy joins",
              "Sub-millisecond index lookups"
            ],
            [
              "Freshness",
              "100% real-time",
              "Requires REFRESH command"
            ],
            [
              "Indexable",
              "No",
              "Yes (B-Tree, GIN, etc.)"
            ]
          ]
        }
      ],
      "explanation": "Materialized Views turn 5-second analytical queries into 2-millisecond indexed reads."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Standard Virtual View",
        "code": "CREATE OR REPLACE VIEW active_customers AS\nSELECT id, name, email\nFROM users\nWHERE status = 'active';",
        "note": "Always returns live, real-time data."
      },
      {
        "step": "Step 2: Materialized View with Indexes and Concurrent Refresh",
        "code": "-- 1. Create materialized view physically on disk:\nCREATE MATERIALIZED VIEW mv_daily_sales AS\nSELECT DATE_TRUNC('day', created_at) AS sale_date, SUM(amount) AS total_revenue\nFROM orders\nGROUP BY sale_date;\n\n-- 2. Create UNIQUE index (Mandatory for CONCURRENT refresh):\nCREATE UNIQUE INDEX idx_mv_daily_sales_date ON mv_daily_sales(sale_date);\n\n-- 3. Zero-downtime refresh without blocking readers:\nREFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_sales;",
        "note": "CONCURRENTLY allows readers to query the view while it is refreshing."
      }
    ],
    "rulesTable": [
      {
        "rule": "Standard View Freshness",
        "explanation": "Virtual views execute their underlying query on every single invocation."
      },
      {
        "rule": "Unique Index for CONCURRENTLY",
        "explanation": "REFRESH MATERIALIZED VIEW CONCURRENTLY strictly requires a unique index on the materialized view."
      },
      {
        "rule": "Security Barrier",
        "explanation": "Views can restrict sensitive columns (e.g. hiding password_hash or credit card numbers) from specific roles."
      },
      {
        "rule": "View macro expansion",
        "explanation": "Standard views do not store data; the query planner expands the view definition into the outer query AST at compile time."
      },
      {
        "rule": "Concurrent refresh prerequisites",
        "explanation": "REFRESH MATERIALIZED VIEW CONCURRENTLY requires at least one UNIQUE index on the materialized view."
      }
    ],
    "deepDive": {
      "title": "Zero-Downtime Cache Invalidation: REFRESH CONCURRENTLY",
      "description": "A standard REFRESH MATERIALIZED VIEW acquires an ACCESS EXCLUSIVE lock on the view, blocking all reads until refresh completes. Adding the CONCURRENTLY keyword creates a temporary copy, computes a diff, and applies changes in place with zero read downtime.",
      "codeSnippet": "-- Production Zero-Downtime refresh job:\nREFRESH MATERIALIZED VIEW CONCURRENTLY mv_leaderboard;",
      "warning": "REFRESH CONCURRENTLY consumes more temporary disk space and memory during execution."
    },
    "advantages": [
      "Standard views simplify query complexity and enforce column security.",
      "Materialized views provide sub-millisecond speeds on multi-million row aggregations."
    ],
    "disadvantages": [
      "Materialized views require scheduled refresh jobs and can serve slightly stale data."
    ],
    "interviewQuestions": [
      {
        "question": "What is the architectural difference between a Standard View and a Materialized View?",
        "answer": "A Standard View is a virtual query rewrite macro: it stores ZERO data on disk. When queried, the engine expands the view SQL into the underlying query AST and executes it against the base tables. A Materialized View executes the query once and persists the physical result as an actual table on disk, consuming disk space but allowing direct B-Tree indexing and sub-millisecond reads.",
        "comparisonTable": {
          "headers": [
            "Feature",
            "Standard View",
            "Materialized View"
          ],
          "rows": [
            [
              "Storage on Disk",
              "0 bytes (virtual query macro)",
              "Full physical table heap on disk"
            ],
            [
              "Read Performance",
              "Same as underlying query",
              "Ultra-fast (point lookups on indexed disk pages)"
            ],
            [
              "Data Freshness",
              "100% real-time (instant)",
              "Stale until REFRESH is executed"
            ],
            [
              "Direct Indexing",
              "NOT supported",
              "Fully supported (B-Tree, GIN, etc.)"
            ],
            [
              "Write Overhead",
              "Zero write overhead on base tables",
              "Requires periodic background refresh cost"
            ]
          ]
        }
      },
      {
        "question": "How does \"REFRESH MATERIALIZED VIEW CONCURRENTLY\" work in PostgreSQL?",
        "answer": "A standard REFRESH acquires an AccessExclusiveLock, locking out all readers until the refresh completes. REFRESH ... CONCURRENTLY allows concurrent readers to continue reading the old data without locking! It creates a temporary table with the new data, compares differences using a UNIQUE index, and applies atomic row updates to the live view using an ExclusiveLock that allows readers."
      },
      {
        "question": "What are Updatable Views and what restrictions apply to them?",
        "answer": "An Updatable View allows clients to execute INSERT, UPDATE, or DELETE directly against the view. Under ANSI SQL, a view is automatically updatable only if: 1. It references exactly one base table in FROM, 2. It contains no GROUP BY, HAVING, DISTINCT, or aggregate functions, 3. It contains no window functions, and 4. All non-nullable table columns are included in the view."
      },
      {
        "question": "What is the \"WITH CHECK OPTION\" clause on updatable views?",
        "answer": "When a view filters rows (e.g. WHERE country = 'US'), an application could update a row setting country = 'UK', causing the row to disappear from the view. Specifying WITH CHECK OPTION instructs the engine to validate updates and inserts against the view’s WHERE clause, throwing an error if the modified row would no longer satisfy the view definition."
      },
      {
        "question": "How do you implement incremental real-time materialized views in PostgreSQL without extensions?",
        "answer": "PostgreSQL does not natively support automatic incremental materialized view refresh. In production, teams either: 1. Schedule a cron job executing REFRESH CONCURRENTLY every 5 minutes, 2. Create an ordinary summary table and maintain it in real-time using AFTER INSERT/UPDATE/DELETE triggers on base tables, or 3. Use specialized streaming database engines like Materialize or ClickHouse."
      }
    ],
    "interviewReadyAnswer": "Views are virtual query shortcuts providing security and abstraction. Materialized views physically persist and index complex aggregation results on disk, with REFRESH MATERIALIZED VIEW CONCURRENTLY providing non-blocking zero-downtime cache updates.",
    "quickTest": {
      "question": "What is strictly required on a Materialized View before you can execute REFRESH MATERIALIZED VIEW CONCURRENTLY?",
      "options": [
        {
          "key": "A",
          "text": "A Primary Key constraint"
        },
        {
          "key": "B",
          "text": "At least one UNIQUE index on the materialized view"
        },
        {
          "key": "C",
          "text": "A foreign key to the parent table"
        },
        {
          "key": "D",
          "text": "Superuser permissions"
        }
      ],
      "correctAnswer": "B",
      "explanation": "PostgreSQL requires a UNIQUE index on the materialized view so it can execute an in-place delta update without locking readers out."
    },
    "mentalModel": "Live Camera vs Printed Photo: A regular view is a live video feed; a materialized view is a printed photo that must be reprinted to update.",
    "codeSnippet": "CREATE MATERIALIZED VIEW mv_user_summary AS\nSELECT user_id, COUNT(*) AS orders, SUM(amount) AS spent\nFROM orders\nGROUP BY user_id;\nCREATE UNIQUE INDEX idx_mv_user ON mv_user_summary(user_id);",
    "takeaways": [
      "Views are virtual queries; Materialized Views store data physically.",
      "Materialized views can have B-Tree and GIN indexes.",
      "Use REFRESH CONCURRENTLY with a UNIQUE index to avoid locking readers."
    ],
    "commonPitfall": {
      "mistake": "Running REFRESH MATERIALIZED VIEW without CONCURRENTLY in production, locking out API readers.",
      "fix": "Create a UNIQUE index and run REFRESH MATERIALIZED VIEW CONCURRENTLY."
    },
    "nextTopicId": "stored-procedures-functions",
    "prevTopicId": "cte-common-table-expressions"
  },
  {
    "id": "stored-procedures-functions",
    "topicNumber": 39,
    "title": "Stored Procedures & Functions",
    "category": "architecture",
    "difficulty": "Advanced",
    "summary": "User-Defined Functions (UDFs), stored procedures, transaction control inside procedures, and PL/pgSQL basics.",
    "definition": "Functions and Stored Procedures are compiled subroutines stored in the database catalog that encapsulate complex business logic and database operations.",
    "eli5": "Instead of sending 20 separate queries back and forth across the internet, you save a program directly inside the database server and run it with one command.",
    "realWorldExample": {
      "description": "A fund transfer operation that deducts money from account A, adds it to account B, logs the transaction, and commits.",
      "tables": [
        {
          "title": "Procedure Capabilities",
          "headers": [
            "Construct",
            "Can Return Value?",
            "Can Commit/Rollback?",
            "Calling Syntax"
          ],
          "rows": [
            [
              "FUNCTION",
              "Yes (MANDATORY)",
              "No (Runs inside caller TX)",
              "SELECT my_func()"
            ],
            [
              "PROCEDURE",
              "No (Optional INOUT)",
              "Yes (Can COMMIT/ROLLBACK)",
              "CALL my_proc()"
            ]
          ]
        }
      ],
      "explanation": "Procedures can manage their own transaction boundaries; functions cannot."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Immutable scalar function",
        "code": "CREATE OR REPLACE FUNCTION calculate_tax(subtotal NUMERIC, tax_rate NUMERIC)\nRETURNS NUMERIC\nLANGUAGE plpgsql\nIMMUTABLE\nAS $$\nBEGIN\n  RETURN ROUND(subtotal * tax_rate, 2);\nEND;\n$$;",
        "note": "IMMUTABLE functions can be indexed in expression indexes."
      },
      {
        "step": "Step 2: Stored Procedure with internal transaction control",
        "code": "CREATE OR REPLACE PROCEDURE transfer_funds(\n  sender_id INT,\n  receiver_id INT,\n  amount NUMERIC\n)\nLANGUAGE plpgsql\nAS $$\nBEGIN\n  UPDATE accounts SET balance = balance - amount WHERE id = sender_id;\n  UPDATE accounts SET balance = balance + amount WHERE id = receiver_id;\n  COMMIT;\nEND;\n$$;\n\n-- Invoke with CALL:\nCALL transfer_funds(101, 102, 50.00);"
      }
    ],
    "rulesTable": [
      {
        "rule": "Procedure Invocation",
        "explanation": "Procedures are executed using CALL proc_name(); Functions are executed with SELECT func_name()."
      },
      {
        "rule": "Transaction Control",
        "explanation": "Procedures support internal COMMIT and ROLLBACK; Functions run within the caller’s transaction."
      },
      {
        "rule": "Volatility Categories",
        "explanation": "Functions are marked VOLATILE (default), STABLE (reads database), or IMMUTABLE (pure function)."
      },
      {
        "rule": "Transaction control in procedures",
        "explanation": "Stored Procedures (CALL) can commit and rollback transactions; User-Defined Functions (SELECT) cannot."
      },
      {
        "rule": "Function volatility categories",
        "explanation": "Functions are marked IMMUTABLE (cacheable), STABLE (constant per statement), or VOLATILE (re-evaluated per row)."
      }
    ],
    "deepDive": {
      "title": "Function Volatility Categories and Query Optimization",
      "description": "Marking a function IMMUTABLE informs the query optimizer that identical arguments always produce identical output without reading tables. The optimizer evaluates the function once at plan time (constant folding) and allows expression indexes.",
      "codeSnippet": "-- IMMUTABLE: Can be pre-computed at plan time and indexed:\nCREATE FUNCTION normalize_sku(text) RETURNS text AS $$ ... $$ IMMUTABLE;\nCREATE INDEX idx_sku ON products(normalize_sku(sku));",
      "warning": "Falsely marking a function IMMUTABLE when it reads database tables leads to stale query plan cache bugs."
    },
    "advantages": [
      "Zero network round-trip overhead for multi-step database operations.",
      "Enforces uniform logic across multiple programming language backends."
    ],
    "disadvantages": [
      "Difficult to version control, test, and debug compared to standard application code."
    ],
    "interviewQuestions": [
      {
        "question": "What is the critical architectural difference between a Stored Procedure and a User-Defined Function (UDF)?",
        "answer": "1. Transaction Control: A Stored Procedure (invoked via CALL proc()) can manage transaction boundaries internally, executing COMMIT and ROLLBACK statements inside its loop. A Function (invoked via SELECT func()) runs strictly inside the caller’s transaction and CANNOT execute COMMIT or ROLLBACK. 2. Return values: Functions must return a value; procedures can return zero or multiple values."
      },
      {
        "question": "What are the three Function Volatility categories in PostgreSQL and why do they matter for indexing?",
        "answer": "1. IMMUTABLE: Cannot modify database and always returns the exact same result for identical arguments (e.g. UPPER(x)); ONLY immutable functions can be used in Expression Indexes. 2. STABLE: Cannot modify database, result depends on current transaction/table data (e.g. CURRENT_TIMESTAMP or table lookups); optimizer evaluates once per statement. 3. VOLATILE: Can return different values even within a single statement (e.g. random() or timeofday()); optimizer must re-evaluate for every single row."
      },
      {
        "question": "What are the security and maintenance trade-offs of embedding business logic in database procedures?",
        "answer": "Advantages: 1. Minimizes network round-trips for multi-step mutations, 2. Centralizes security and authorization in the database layer. Disadvantages: 1. Hard to unit-test and version-control compared to standard application code, 2. Database CPU is expensive and difficult to scale horizontally compared to stateless application servers, 3. Vendor lock-in between PL/pgSQL, T-SQL, and PL/SQL."
      },
      {
        "question": "What is the difference between SECURITY DEFINER and SECURITY INVOKER functions?",
        "answer": "SECURITY INVOKER (the default) executes the function with the privileges of the user who calls it. SECURITY DEFINER executes the function with the elevated privileges of the user who created it (similar to setuid in Linux). In production, SECURITY DEFINER functions must explicitly set a safe search_path to prevent malicious privilege escalation attacks."
      },
      {
        "question": "How does plan caching work for stored procedures and functions?",
        "answer": "When a PL/pgSQL function or procedure executes, the engine compiles execution plans for internal SQL queries. For the first 5 executions, it generates custom plans based on parameter values. If the generic plan is almost as fast as custom plans, it caches the generic execution plan permanently for the database session, saving planning time on subsequent calls."
      }
    ],
    "interviewReadyAnswer": "Functions return values and execute inside the caller’s transaction, while Stored Procedures are invoked with CALL and can manage autonomous transaction commits. Marking pure functions as IMMUTABLE unlocks optimizer constant folding and expression indexing.",
    "quickTest": {
      "question": "Which SQL statement invokes a Stored Procedure in modern PostgreSQL?",
      "options": [
        {
          "key": "A",
          "text": "EXECUTE proc();"
        },
        {
          "key": "B",
          "text": "SELECT proc();"
        },
        {
          "key": "C",
          "text": "CALL proc();"
        },
        {
          "key": "D",
          "text": "RUN proc();"
        }
      ],
      "correctAnswer": "C",
      "explanation": "ANSI standard SQL and PostgreSQL use the CALL keyword to invoke stored procedures."
    },
    "mentalModel": "Microservice inside the database: A packaged script residing on the database server to save network hops.",
    "codeSnippet": "CREATE PROCEDURE archive_old_logs()\nLANGUAGE sql\nAS $$\n  DELETE FROM logs WHERE created_at < NOW() - INTERVAL '1 year';\n$$;\nCALL archive_old_logs();",
    "takeaways": [
      "Use CALL for procedures; use SELECT for functions.",
      "Procedures can execute internal COMMIT and ROLLBACK.",
      "Mark pure math/string functions IMMUTABLE for expression indexing."
    ],
    "commonPitfall": {
      "mistake": "Putting too much application business logic into PL/pgSQL, making code difficult to unit test and scale horizontally.",
      "fix": "Keep procedural code focused on data integrity and high-throughput batch routines."
    },
    "nextTopicId": "database-normalization",
    "prevTopicId": "views-and-materialized-views"
  },
  {
    "id": "database-normalization",
    "topicNumber": 40,
    "title": "Database Normalization (1NF to BCNF)",
    "category": "architecture",
    "difficulty": "Intermediate",
    "summary": "Eliminating data redundancy: 1NF atomicity, 2NF partial dependencies, 3NF transitive dependencies, and Boyce-Codd Normal Form.",
    "definition": "Database Normalization is the formal process of structuring relational schemas to minimize data redundancy and eliminate insert, update, and delete anomalies.",
    "eli5": "Normalization is organizing your bedroom: instead of dumping shoes, shirts, and books in one giant messy bin (unnormalized), you put shirts in the closet, shoes on the rack, and books on the shelf.",
    "realWorldExample": {
      "description": "An unnormalized order sheet where customer addresses are duplicated across thousands of orders.",
      "tables": [
        {
          "title": "Unnormalized (0NF - Redundant)",
          "headers": [
            "order_id",
            "customer_name",
            "customer_address",
            "product"
          ],
          "rows": [
            [
              1,
              "Alice",
              "123 Main St, New York",
              "Laptop"
            ],
            [
              2,
              "Alice",
              "123 Main St, New York",
              "Mouse"
            ]
          ]
        },
        {
          "title": "Normalized (3NF - Separated)",
          "headers": [
            "Table",
            "Columns"
          ],
          "rows": [
            [
              "customers",
              "id (PK), name, address"
            ],
            [
              "orders",
              "id (PK), customer_id (FK), product"
            ]
          ]
        }
      ],
      "explanation": "If Alice moves, we update her address in exactly ONE place in the customers table, eliminating update anomalies."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Normalized Parent-Child Schema in 3NF",
        "code": "CREATE TABLE customers (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  address VARCHAR(255) NOT NULL\n);\n\nCREATE TABLE orders (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  customer_id BIGINT NOT NULL REFERENCES customers(id),\n  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP\n);"
      }
    ],
    "rulesTable": [
      {
        "rule": "First Normal Form (1NF)",
        "explanation": "Atomic values in cells (no comma-separated lists); unique rows identified by a primary key."
      },
      {
        "rule": "Second Normal Form (2NF)",
        "explanation": "Meets 1NF AND eliminates partial dependencies (no non-key column depends on part of a composite PK)."
      },
      {
        "rule": "Third Normal Form (3NF)",
        "explanation": "Meets 2NF AND eliminates transitive dependencies (no non-key column depends on another non-key column)."
      },
      {
        "rule": "Boyce-Codd Normal Form (BCNF)",
        "explanation": "Every determinant in a functional dependency must be a superkey."
      },
      {
        "rule": "Three relational anomalies",
        "explanation": "Normalization eliminates Insertion Anomalies, Update Anomalies (inconsistent copies), and Deletion Anomalies."
      },
      {
        "rule": "Candidate key determinant rule",
        "explanation": "In Boyce-Codd Normal Form (BCNF), every non-trivial functional dependency X -> Y requires X to be a candidate key."
      }
    ],
    "deepDive": {
      "title": "Update, Insert & Delete Anomalies in Denormalized Tables",
      "description": "When schemas are not normalized, databases suffer from 3 anomalies: 1) Update Anomaly (updating an address requires modifying 500 rows; missing one causes data corruption), 2) Insert Anomaly (cannot record a new customer until they place an order), 3) Delete Anomaly (deleting an order accidentally deletes the only record of the customer).",
      "codeSnippet": "-- 3NF guarantees:\n-- Every non-key column must provide a fact about the key,\n-- the whole key, and nothing but the key (so help me Codd).",
      "warning": "Under-normalized schemas inevitably lead to divergent and corrupted data records."
    },
    "advantages": [
      "Eliminates data redundancy and saves storage.",
      "Guarantees that updates only touch a single authoritative row."
    ],
    "disadvantages": [
      "Requires multi-table joins to reconstruct complete views for reading."
    ],
    "interviewQuestions": [
      {
        "question": "Define 1NF, 2NF, 3NF, and BCNF with concise relational definitions.",
        "answer": "1. 1NF (First Normal Form): All column values are atomic (no repeating groups, comma-separated lists, or arrays), and each row is uniquely identifiable. 2. 2NF: In 1NF and no non-prime attribute is partially dependent on any candidate key (eliminates partial key dependencies). 3. 3NF: In 2NF and no non-prime attribute is transitively dependent on a candidate key (no A -> B -> C). 4. BCNF (Boyce-Codd Normal Form): In 3NF and for EVERY functional dependency X -> Y, X must be a superkey/candidate key."
      },
      {
        "question": "What are the three classic relational anomalies eliminated by schema normalization?",
        "answer": "1. Insertion Anomaly: You cannot insert data about an entity without also providing data for an unrelated entity (e.g. cannot record a new course without enrolling at least one student). 2. Update Anomaly: Data is duplicated across multiple rows; updating a teacher’s phone number in one row leaves conflicting stale data in another row. 3. Deletion Anomaly: Deleting one entity accidentally destroys data about another entity (e.g. deleting the last student enrolled in Physics deletes all records of the Physics course)."
      },
      {
        "question": "When and why should you intentionally DENORMALIZE a relational database in production?",
        "answer": "Normalization optimizes for write integrity and storage efficiency by splitting entities into many tables. However, querying 10 joined normalized tables in high-throughput analytical systems (OLAP / Data Warehousing) causes heavy join overhead. Denormalization (e.g. Star Schema, Snowflake Schema, storing customer_name directly in orders) is intentionally used in read-heavy systems to eliminate joins and maximize read throughput."
      },
      {
        "question": "What is a Transitive Dependency and how do you eliminate it to reach 3NF?",
        "answer": "A transitive dependency occurs when non-key attribute A determines non-key attribute B, which determines non-key attribute C (A -> B and B -> C). For example, in an Orders table: order_id -> customer_id and customer_id -> customer_city. customer_city transitively depends on order_id. To reach 3NF, customer_city is moved out of Orders into a separate Customers table referenced by customer_id."
      },
      {
        "question": "What is the difference between 3NF and BCNF?",
        "answer": "3NF allows a functional dependency X -> Y if Y is a prime attribute (part of a candidate key), even if X is not a candidate key. BCNF removes this exception: in BCNF, for EVERY functional dependency X -> Y, X MUST be a candidate key. A table with overlapping composite candidate keys can be in 3NF while violating BCNF."
      }
    ],
    "interviewReadyAnswer": "Normalization organizes relational tables to eliminate redundancy and insertion/update/deletion anomalies. Progressing from 1NF (atomic cells) through 2NF (no partial dependencies) and 3NF (no transitive dependencies) ensures that every non-key column depends strictly on the primary key.",
    "quickTest": {
      "question": "A table has columns: (StudentID, CourseID, StudentName, Grade) where (StudentID, CourseID) is the composite primary key. Why does this violate 2NF?",
      "options": [
        {
          "key": "A",
          "text": "Grade depends on StudentID."
        },
        {
          "key": "B",
          "text": "StudentName depends only on StudentID, which is part of the composite key (partial dependency)."
        },
        {
          "key": "C",
          "text": "It has too many columns."
        },
        {
          "key": "D",
          "text": "Composite keys are illegal in 2NF."
        }
      ],
      "correctAnswer": "B",
      "explanation": "2NF prohibits partial dependencies. StudentName depends solely on StudentID, not the entire composite key (StudentID, CourseID)."
    },
    "mentalModel": "Organized tool shed: Every tool has its dedicated hook. You don't store hammers, nails, and screwdrivers all mixed together in every toolbox.",
    "codeSnippet": "-- 3NF normalized relation:\nCREATE TABLE departments (\n  id INT PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);\nCREATE TABLE employees (\n  id INT PRIMARY KEY,\n  dept_id INT REFERENCES departments(id),\n  name VARCHAR(100)\n);",
    "takeaways": [
      "1NF requires atomic cell values and a primary key.",
      "2NF eliminates partial dependencies on composite keys.",
      "3NF eliminates transitive dependencies between non-key columns."
    ],
    "commonPitfall": {
      "mistake": "Storing multiple values in a single column (e.g. tags = \"react,sql,nextjs\"), violating 1NF.",
      "fix": "Create a normalized child table with one tag per row."
    },
    "nextTopicId": "database-denormalization",
    "prevTopicId": "stored-procedures-functions"
  }
];
