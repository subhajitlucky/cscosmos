import { SqlTopic } from './types';

export const TOPICS_11_TO_20: SqlTopic[] = [
  {
    "id": "sql-operators",
    "topicNumber": 11,
    "title": "SQL Operators",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Arithmetic, comparison, concatenation, bitwise operators, and expression evaluation precedence rules.",
    "definition": "SQL operators are reserved symbols or keywords used in clauses to perform arithmetic computations, comparisons, and logical transformations on operands.",
    "eli5": "Operators are math and comparison symbols (+, -, *, =, <, >). Just like PEMDAS in school math, SQL follows strict rules for what gets calculated first.",
    "realWorldExample": {
      "description": "An invoice calculation with volume discount percentages and shipping charges.",
      "tables": [
        {
          "title": "Line Items",
          "headers": [
            "unit_price",
            "quantity",
            "discount_rate"
          ],
          "rows": [
            [
              "50.00",
              4,
              "0.10"
            ]
          ]
        }
      ],
      "explanation": "Total cost calculation: (50.00 * 4) * (1 - 0.10) + 5.00 shipping."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Arithmetic and comparison operators",
        "code": "SELECT\n  product_name,\n  price * quantity AS subtotal,\n  price * quantity * (1 - discount) AS discounted_total\nFROM line_items\nWHERE (price * quantity) >= 100.00;"
      },
      {
        "step": "String and modulo operators",
        "code": "SELECT first_name || ' ' || last_name AS full_name, (id % 2 = 0) AS is_even_batch FROM users;"
      }
    ],
    "rulesTable": [
      {
        "rule": "Operator Precedence",
        "explanation": "Multiplication (*) and division (/) have higher precedence than addition (+) and subtraction (-)."
      },
      {
        "rule": "Integer Division Traps",
        "explanation": "In engines like SQL Server and older Postgres, 5 / 2 yields 2 (integer division) unless cast to float: 5.0 / 2."
      },
      {
        "rule": "NULL Propagation",
        "explanation": "Any arithmetic operation involving NULL yields NULL (e.g., 100 + NULL = NULL)."
      },
      {
        "rule": "Operator evaluation precedence",
        "explanation": "Multiplication/division takes precedence over addition/subtraction; comparison operators evaluate before logical operators."
      },
      {
        "rule": "Integer division truncation",
        "explanation": "In standard SQL and PostgreSQL, dividing an integer by an integer yields an integer (5 / 2 = 2), not a float."
      }
    ],
    "deepDive": {
      "title": "String Concatenation Standards: || vs CONCAT",
      "description": "ANSI SQL uses the double pipe || for string concatenation. However, in standard SQL, \"Hello\" || NULL results in NULL. Functions like CONCAT(\"Hello\", NULL) in MySQL/Postgres treat NULL as an empty string.",
      "codeSnippet": "SELECT 'Lucky' || ' ' || NULL;     -- Returns NULL in standard SQL!\nSELECT CONCAT('Lucky', ' ', NULL);  -- Returns 'Lucky ' safely.",
      "warning": "Use CONCAT or COALESCE to avoid dropping entire strings when nullable columns are concatenated."
    },
    "advantages": [
      "Enables expressive calculations inside the query engine.",
      "Minimizes application middleware round-trips."
    ],
    "disadvantages": [
      "Complex arithmetic in WHERE clauses disables B-Tree index traversal."
    ],
    "interviewQuestions": [
      {
        "question": "What is the integer division trap in SQL and how do you prevent unexpected zero results?",
        "answer": "In PostgreSQL and many SQL dialects, dividing two integers performs integer division, truncating the fractional part (e.g. 1 / 4 evaluates to 0, not 0.25). To perform floating-point or exact decimal division, at least one operand must be explicitly cast to float or numeric: 1.0 * val1 / val2 or CAST(val1 AS NUMERIC) / val2."
      },
      {
        "question": "What are SQL operator precedence rules and how do they lead to bugs in compound expressions?",
        "answer": "Precedence from highest to lowest: 1. Parentheses, 2. Unary operators (+, -), 3. Multiplication/Division (*, /, %), 4. Addition/Subtraction (+, -), 5. Comparison operators (=, !=, <, >), 6. NOT, 7. AND, 8. OR. Because AND evaluates before OR, a query like WHERE role = 'admin' OR department = 'IT' AND active = true is evaluated as role = 'admin' OR (department = 'IT' AND active = true), allowing inactive admins access."
      },
      {
        "question": "What is the difference between string concatenation operators across PostgreSQL, MySQL, and SQL Server?",
        "answer": "PostgreSQL, Oracle, and SQLite use the ANSI standard || operator for string concatenation ('hello' || ' ' || 'world'). SQL Server uses the + operator. MySQL historically treats + as numeric addition and requires the CONCAT() function. Furthermore, standard || returns NULL if any operand is NULL, whereas CONCAT_WS() skips NULLs."
      },
      {
        "question": "What are bitwise operators in SQL and where are they used in high-performance architectures?",
        "answer": "SQL supports bitwise AND (&), OR (|), XOR (#), and shift operators (<<, >>). High-performance systems use bitwise operations to store permission bitmasks inside a single INT or BIGINT column (e.g. 1=Read, 2=Write, 4=Delete, 8=Admin). Checking if a user has Write permission is an ultra-fast bitwise test: WHERE (permissions & 2) != 0."
      },
      {
        "question": "How do comparison operators handle NULL values?",
        "answer": "Any standard comparison operator (=, !=, <, >, <=, >=) evaluated against NULL produces UNKNOWN, never TRUE or FALSE. In SQL, UNKNOWN is rejected in WHERE and HAVING clauses. The only standard operators capable of safely testing for NULL are IS NULL, IS NOT NULL, and the null-safe equality operator (IS NOT DISTINCT FROM in PostgreSQL or <=> in MySQL)."
      }
    ],
    "interviewReadyAnswer": "SQL provides arithmetic, comparison, and string operators. Precedence determines evaluation order, and developers must account for integer division truncations and NULL propagation.",
    "quickTest": {
      "question": "What does \"SELECT 5 + 5 * 2;\" return in standard SQL?",
      "options": [
        {
          "key": "A",
          "text": "20"
        },
        {
          "key": "B",
          "text": "15"
        },
        {
          "key": "C",
          "text": "NULL"
        },
        {
          "key": "D",
          "text": "Syntax Error"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Multiplication (*) has higher precedence than addition (+), so 5 * 2 = 10, then 5 + 10 = 15."
    },
    "mentalModel": "Math Class PEMDAS: Multiplication and division always execute before addition and subtraction unless parentheses force an override.",
    "codeSnippet": "SELECT name, price, price * 1.18 AS price_with_tax FROM items WHERE price > 50;",
    "takeaways": [
      "Multiplication and division precede addition and subtraction.",
      "NULL propagation causes expressions with NULL to evaluate to NULL.",
      "Wrap expressions in parentheses to ensure unambiguous evaluation."
    ],
    "commonPitfall": {
      "mistake": "Writing 1 / 2 and expecting 0.5 when both operands are integers.",
      "fix": "Use 1.0 / 2 or CAST(1 AS NUMERIC) / 2."
    },
    "nextTopicId": "and-or-not-logic",
    "prevTopicId": "distinct-and-limit"
  },
  {
    "id": "and-or-not-logic",
    "topicNumber": 12,
    "title": "AND, OR, NOT Logic",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Combining boolean predicates, operator precedence (AND before OR), De Morgan’s laws, and short-circuit evaluation.",
    "definition": "AND, OR, and NOT are logical operators used in WHERE and HAVING clauses to join or negate search predicates.",
    "eli5": "AND is picky (both must be true). OR is generous (at least one must be true). NOT flips the switch (true becomes false).",
    "realWorldExample": {
      "description": "Filtering customers who are either premium members OR active users located in the EU.",
      "tables": [
        {
          "title": "Users",
          "headers": [
            "name",
            "is_premium",
            "is_active",
            "region"
          ],
          "rows": [
            [
              "Alice",
              "true",
              "false",
              "US"
            ],
            [
              "Bob",
              "false",
              "true",
              "EU"
            ],
            [
              "Charlie",
              "false",
              "false",
              "EU"
            ]
          ]
        }
      ],
      "explanation": "Without parentheses, AND binds tighter than OR, leading to unintended filter results."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Parentheses for logical grouping",
        "code": "SELECT name, is_premium, region\nFROM users\nWHERE is_premium = TRUE OR (is_active = TRUE AND region = 'EU');",
        "note": "Always use explicit parentheses when mixing AND with OR."
      },
      {
        "step": "Step 2: Negation with NOT",
        "code": "SELECT name FROM users WHERE NOT (region = 'US' OR region = 'CA');",
        "note": "Equivalent to region != 'US' AND region != 'CA'."
      }
    ],
    "rulesTable": [
      {
        "rule": "AND Binds Tighter Than OR",
        "explanation": "Condition A OR B AND C is evaluated as A OR (B AND C)."
      },
      {
        "rule": "Short-Circuiting",
        "explanation": "Most SQL optimizers short-circuit boolean conditions for efficiency, but order of evaluation is not guaranteed."
      },
      {
        "rule": "De Morgan’s Laws",
        "explanation": "NOT (A AND B) equals (NOT A) OR (NOT B); NOT (A OR B) equals (NOT A) AND (NOT B)."
      },
      {
        "rule": "Operator precedence (AND before OR)",
        "explanation": "AND has strictly higher precedence than OR; always use explicit parentheses when combining them."
      },
      {
        "rule": "Index union scan on OR",
        "explanation": "OR conditions on different columns require BitmapOr index scans or full table scans if one column is unindexed."
      }
    ],
    "deepDive": {
      "title": "The Dangerous \"AND Binds Tighter Than OR\" Production Bug",
      "description": "Developers frequently write: WHERE status = \"active\" AND country = \"US\" OR country = \"CA\". Because AND takes precedence, this executes as (active AND US) OR CA, accidentally leaking all inactive Canadian accounts!",
      "codeSnippet": "-- DANGEROUS BUG (returns inactive Canadians!):\nWHERE status = 'active' AND country = 'US' OR country = 'CA';\n\n-- FIXED WITH PARENTHESES:\nWHERE status = 'active' AND (country = 'US' OR country = 'CA');",
      "warning": "Whenever you mix AND with OR, parentheses are mandatory for defensive coding."
    },
    "advantages": [
      "Enables precise multi-dimensional filtering.",
      "Allows clean expression of complex business rules."
    ],
    "disadvantages": [
      "Unparenthesized expressions create catastrophic data leak bugs."
    ],
    "interviewQuestions": [
      {
        "question": "How does an OR clause affect index utilization compared to an AND clause?",
        "answer": "An AND clause on indexed columns (col1 = 1 AND col2 = 2) can utilize a single composite B-Tree index or perform a fast index intersection. An OR clause on different columns (col1 = 1 OR col2 = 2) requires the engine to either perform a BitmapOr scan (scanning index 1, scanning index 2, combining bitmaps in memory, and fetching heap pages) or fall back to a full table scan if either column lacks an index."
      },
      {
        "question": "What are De Morgan’s Laws and how do you apply them to simplify complex SQL predicates?",
        "answer": "De Morgan’s Laws state: 1. NOT (A AND B) = (NOT A) OR (NOT B), and 2. NOT (A OR B) = (NOT A) AND (NOT B). In SQL performance tuning, converting negated complex groupings into positive indexed comparisons often allows the optimizer to use B-Tree indexes instead of scanning the full table."
      },
      {
        "question": "What is short-circuit evaluation in boolean expressions and can you rely on it in SQL?",
        "answer": "In procedural languages (like C/Python), if the first operand of AND is FALSE, the second operand is never evaluated. In SQL, the SQL standard does NOT guarantee short-circuit evaluation order: the Cost-Based Optimizer is free to evaluate expressions in whatever order is cheapest. For example, in WHERE x > 0 AND 100 / x > 2, the engine might evaluate 100 / x first and crash with a division-by-zero error. Use CASE WHEN for guaranteed evaluation order."
      },
      {
        "question": "How does NOT interact with B-Tree indexes?",
        "answer": "B-Tree indexes are sorted structures optimized for finding specific keys or bounded ranges. The NOT operator (e.g. WHERE status != 'active') is non-SARGable because it asks for everything EXCEPT a value. Unless the table is partitioned or a partial index is specifically created, the optimizer almost always falls back to a Sequential Scan."
      },
      {
        "question": "How do you optimize a slow OR query across two indexed columns?",
        "answer": "A query like SELECT * FROM users WHERE email = 'x' OR phone = 'y' can be slow if the optimizer struggles with BitmapOr. You can optimize it by rewriting it as a UNION ALL with an anti-join or deduplication: (SELECT * FROM users WHERE email = 'x') UNION (SELECT * FROM users WHERE phone = 'y'); This allows each branch to perform an ultra-fast O(log N) index seek."
      }
    ],
    "interviewReadyAnswer": "AND takes precedence over OR in SQL boolean logic. To prevent unintentional security and data filtering bugs, always wrap OR clauses inside parentheses when combined with AND.",
    "quickTest": {
      "question": "How does SQL evaluate the expression: TRUE OR FALSE AND FALSE?",
      "options": [
        {
          "key": "A",
          "text": "FALSE because it reads left-to-right."
        },
        {
          "key": "B",
          "text": "TRUE because AND evaluates first: FALSE AND FALSE = FALSE, then TRUE OR FALSE = TRUE."
        },
        {
          "key": "C",
          "text": "NULL"
        },
        {
          "key": "D",
          "text": "Syntax Error"
        }
      ],
      "correctAnswer": "B",
      "explanation": "AND has higher precedence than OR. FALSE AND FALSE is evaluated first (FALSE), and then TRUE OR FALSE evaluates to TRUE."
    },
    "mentalModel": "Electrical Circuit: AND is components in series (all must connect); OR is components in parallel (any path connects).",
    "codeSnippet": "SELECT * FROM accounts\nWHERE status = 'active' AND (plan = 'enterprise' OR balance > 10000);",
    "takeaways": [
      "AND evaluates before OR by default.",
      "Always use explicit parentheses when combining AND and OR.",
      "Apply De Morgan’s laws when simplifying NOT conditions."
    ],
    "commonPitfall": {
      "mistake": "Writing WHERE is_deleted = false AND type = \"admin\" OR type = \"moderator\", inadvertently exposing soft-deleted moderators.",
      "fix": "Wrap in parentheses: WHERE is_deleted = false AND (type = \"admin\" OR type = \"moderator\")."
    },
    "nextTopicId": "between-operator",
    "prevTopicId": "sql-operators"
  },
  {
    "id": "between-operator",
    "topicNumber": 13,
    "title": "BETWEEN Operator",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Inclusive range queries, boundary semantics, timestamp datetime edge cases, and NOT BETWEEN.",
    "definition": "The BETWEEN operator matches values within a specified range, inclusive of both lower and upper endpoints.",
    "eli5": "BETWEEN is like asking for everyone whose height is from 5 feet to 6 feet, including people who are exactly 5 feet or exactly 6 feet.",
    "realWorldExample": {
      "description": "Filtering quarterly financial transactions between $100 and $500.",
      "tables": [
        {
          "title": "Transactions",
          "headers": [
            "id",
            "amount",
            "status"
          ],
          "rows": [
            [
              1,
              "100.00 (Matched - lower bound)",
              "completed"
            ],
            [
              2,
              "350.00 (Matched)",
              "completed"
            ],
            [
              3,
              "500.00 (Matched - upper bound)",
              "completed"
            ],
            [
              4,
              "500.01 (Excluded)",
              "completed"
            ]
          ]
        }
      ],
      "explanation": "BETWEEN 100.00 AND 500.00 matches rows 1, 2, and 3."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Numeric Range",
        "code": "SELECT id, product_name, price\nFROM products\nWHERE price BETWEEN 20.00 AND 100.00;",
        "note": "Equivalent to price >= 20.00 AND price <= 100.00."
      },
      {
        "step": "Step 2: Safe Timestamp Ranges",
        "code": "-- Safer alternative to BETWEEN for timestamps:\nSELECT id, event_time\nFROM logs\nWHERE event_time >= '2026-01-01' AND event_time < '2026-02-01';",
        "note": "Avoids missing events occurring at 2026-01-31 23:59:59.999."
      }
    ],
    "rulesTable": [
      {
        "rule": "Inclusivity",
        "explanation": "BETWEEN is always inclusive of both lower and upper boundary values."
      },
      {
        "rule": "Ordering Requirement",
        "explanation": "BETWEEN a AND b requires a <= b. If a > b, it evaluates to FALSE and returns 0 rows."
      },
      {
        "rule": "Index SSeekable",
        "explanation": "B-Tree indexes efficiently optimize BETWEEN into an index range scan."
      },
      {
        "rule": "Boundary inclusivity",
        "explanation": "BETWEEN is strictly inclusive: val BETWEEN low AND high is identical to val >= low AND val <= high."
      },
      {
        "rule": "Timestamp boundary hazard",
        "explanation": "Using BETWEEN on timestamps includes midnight of the end date, causing off-by-one errors; use >= AND < instead."
      }
    ],
    "deepDive": {
      "title": "Why BETWEEN is Dangerous for Timestamps",
      "description": "Writing WHERE created_at BETWEEN \"2026-01-01\" AND \"2026-01-31\" resolves to 2026-01-31 00:00:00. Any transaction that took place later on January 31st (e.g. 2:00 PM) is silently omitted!",
      "codeSnippet": "-- DANGEROUS (misses all events after midnight Jan 31):\nWHERE created_at BETWEEN '2026-01-01' AND '2026-01-31';\n\n-- ROBUST (Half-open interval >= and <):\nWHERE created_at >= '2026-01-01' AND created_at < '2026-02-01';",
      "warning": "Never use BETWEEN on TIMESTAMP or TIMESTAMPTZ columns. Use half-open intervals >= and < instead."
    },
    "advantages": [
      "Clean, readable syntax for bounded integer and numeric ranges.",
      "Directly mapped to B-Tree index range scans."
    ],
    "disadvantages": [
      "Prone to timestamp bugs due to endpoint inclusion."
    ],
    "interviewQuestions": [
      {
        "question": "Why is BETWEEN considered an antipattern for timestamp and date range queries in production?",
        "answer": "BETWEEN is inclusive on both ends. If an engineer writes WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31', the string '2026-01-31' is cast to '2026-01-31 00:00:00.000000'. Any transaction occurring at 10:00 AM or 11:59 PM on January 31st will be silently omitted! The production standard is always half-open intervals: WHERE created_at >= '2026-01-01' AND created_at < '2026-02-01'."
      },
      {
        "question": "How does a B-Tree index physically execute a BETWEEN query?",
        "answer": "The engine uses the B-Tree index to perform a single binary search seek to find the first leaf entry >= low boundary (O(log N)). Then, because B-Tree leaf pages are doubly linked in sorted order, the engine simply scans along the leaf nodes sequentially until it encounters an entry > high boundary, avoiding any random disk I/O."
      },
      {
        "question": "What happens if you reverse the arguments in BETWEEN (e.g. BETWEEN 10 AND 5)?",
        "answer": "In SQL, BETWEEN low AND high is defined as value >= low AND value <= high. If you write BETWEEN 10 AND 5, the condition evaluates to value >= 10 AND value <= 5, which is mathematically impossible for any real number. The query will return zero rows with no syntax error or warning."
      },
      {
        "question": "What is NOT BETWEEN and how does it handle NULL values?",
        "answer": "NOT BETWEEN low AND high is equivalent to value < low OR value > high. If the value is NULL, the comparison yields UNKNOWN and the row is excluded from the result set. Furthermore, if either low or high is NULL, the entire expression evaluates to UNKNOWN."
      },
      {
        "question": "Can BETWEEN be used on text and string columns?",
        "answer": "Yes, BETWEEN works on any data type with a defined collation order (e.g. WHERE name BETWEEN 'A' AND 'C'). However, string boundaries can be tricky: 'Car' is included because 'Car' <= 'C', but 'Cat' is > 'C' and is excluded. For text ranges, exact prefix matches or LIKE 'A%' are generally preferred."
      }
    ],
    "interviewReadyAnswer": "BETWEEN filters values inside an inclusive boundary. While ideal for integers and decimals, half-open intervals (>= start AND < next_period) must be used for timestamps to avoid truncating sub-day records.",
    "quickTest": {
      "question": "Given the clause \"WHERE score BETWEEN 80 AND 90\", will a student with a score of exactly 90 be included?",
      "options": [
        {
          "key": "A",
          "text": "No, the upper boundary is exclusive."
        },
        {
          "key": "B",
          "text": "Yes, BETWEEN is inclusive of both endpoints."
        },
        {
          "key": "C",
          "text": "Only if score is an integer type."
        },
        {
          "key": "D",
          "text": "Only if ORDER BY score is provided."
        }
      ],
      "correctAnswer": "B",
      "explanation": "BETWEEN is strictly inclusive on both ends, so both 80 and 90 are matched."
    },
    "mentalModel": "Doorway measuring tape: Anyone whose height touches or falls between the 5ft and 6ft marks is let through.",
    "codeSnippet": "SELECT * FROM orders WHERE total_cents BETWEEN 1000 AND 5000;",
    "takeaways": [
      "BETWEEN is inclusive of both bounds.",
      "BETWEEN lower AND upper requires lower <= upper.",
      "Use >= and < for timestamp filtering to avoid end-of-day data loss."
    ],
    "commonPitfall": {
      "mistake": "Writing BETWEEN \"2026-01-01\" AND \"2026-01-31\" and losing records created on Jan 31st at 10 AM.",
      "fix": "Use created_at >= '2026-01-01' AND created_at < '2026-02-01'."
    },
    "nextTopicId": "in-and-not-in",
    "prevTopicId": "and-or-not-logic"
  },
  {
    "id": "in-and-not-in",
    "topicNumber": 14,
    "title": "IN & NOT IN",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Discrete set matching, subquery execution, and the catastrophic Three-Valued Logic trap of NOT IN with NULLs.",
    "definition": "The IN operator determines whether a specified value matches any value within a discrete list or subquery set.",
    "eli5": "IN is like a guest list with multiple names. If your name is on any of the lines, you get in. NOT IN means you can only enter if you are not on that list.",
    "realWorldExample": {
      "description": "Selecting users whose billing country is in North America.",
      "tables": [
        {
          "title": "Users",
          "headers": [
            "id",
            "name",
            "country_code"
          ],
          "rows": [
            [
              1,
              "Alice",
              "US"
            ],
            [
              2,
              "Bob",
              "CA"
            ],
            [
              3,
              "Charlie",
              "IN"
            ]
          ]
        }
      ],
      "explanation": "country_code IN ('US', 'CA', 'MX') matches Alice and Bob."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Discrete list membership",
        "code": "SELECT id, name, country_code\nFROM users\nWHERE country_code IN ('US', 'CA', 'MX');",
        "note": "Syntactic sugar for country_code = 'US' OR country_code = 'CA' OR country_code = 'MX'."
      },
      {
        "step": "Step 2: Dynamic subquery with NOT EXISTS (safe vs NOT IN)",
        "code": "SELECT u.id, u.name\nFROM users u\nWHERE NOT EXISTS (\n  SELECT 1 FROM blacklisted_users b WHERE b.user_id = u.id\n);",
        "note": "Safely handles NULL values without dropping all records."
      }
    ],
    "rulesTable": [
      {
        "rule": "List Matching",
        "explanation": "val IN (x, y, z) evaluates to TRUE if val equals any element in the set."
      },
      {
        "rule": "NOT IN with NULL Disaster",
        "explanation": "If the set contains even a single NULL value, NOT IN evaluates to UNKNOWN for all rows, returning 0 rows!"
      },
      {
        "rule": "Subquery Form",
        "explanation": "Optimizers transform IN (SELECT ...) into Semi-Joins; NOT IN into Anti-Joins."
      },
      {
        "rule": "Three-Valued Logic NULL catastrophe",
        "explanation": "If the list inside NOT IN contains a single NULL value, the entire expression evaluates to UNKNOWN for all rows."
      },
      {
        "rule": "Optimizer array transform",
        "explanation": "Engines transform IN (constants) into an index seek list (ScalarArrayOp) for O(K * log N) lookups."
      }
    ],
    "deepDive": {
      "title": "The Infamous NOT IN with NULL Trap",
      "description": "In SQL: val NOT IN (1, 2, NULL) is evaluated as: val != 1 AND val != 2 AND val != NULL. Because val != NULL evaluates to UNKNOWN, and anything AND UNKNOWN cannot evaluate to TRUE, the entire WHERE clause returns ZERO rows!",
      "codeSnippet": "-- DANGEROUS: If blacklist contains even ONE NULL, returns 0 rows!\nSELECT * FROM users WHERE id NOT IN (SELECT user_id FROM blacklist);\n\n-- SAFE: NOT EXISTS handles NULLs deterministically:\nSELECT * FROM users u WHERE NOT EXISTS (\n  SELECT 1 FROM blacklist b WHERE b.user_id = u.id\n);",
      "warning": "Never use NOT IN with a subquery unless the subquery column is strictly guaranteed to be NOT NULL."
    },
    "advantages": [
      "Concise syntax compared to chaining dozens of OR statements.",
      "Optimizer can leverage B-Tree index scans with multi-point skips."
    ],
    "disadvantages": [
      "NOT IN combined with NULL subqueries causes silent query failure."
    ],
    "interviewQuestions": [
      {
        "question": "Why does \"val NOT IN (1, 2, NULL)\" always return zero rows in SQL? Explain Three-Valued Logic.",
        "answer": "NOT IN is expanded as: val != 1 AND val != 2 AND val != NULL. In SQL, any comparison with NULL (val != NULL) evaluates to UNKNOWN. In boolean logic: TRUE AND TRUE AND UNKNOWN evaluates to UNKNOWN. Because the WHERE clause only accepts rows where the condition is TRUE, every single row is rejected! If a subquery returns even one NULL, NOT IN silently returns empty set. Use NOT EXISTS instead."
      },
      {
        "question": "What is the performance difference between IN (list of 10,000 values) vs JOIN with a temporary table?",
        "answer": "Passing 10,000 literal constants inside an IN (...) clause causes massive SQL query string bloat, slows down parser tokenization, prevents query plan caching, and can exceed query buffer limits. The production standard is passing an array (ANY(?)) or bulk inserting values into a temporary table and performing an INNER JOIN, which uses hash joins or merge joins in O(N)."
      },
      {
        "question": "How does the query optimizer execute IN (subquery) vs EXISTS (subquery)?",
        "answer": "Historically, naive engines executed IN (subquery) as a nested loop for every row. Modern Cost-Based Optimizers (PostgreSQL, MySQL 8+) automatically rewrite IN (subquery) into a Semi-Join or Hash Join. However, when nullable columns are involved, the optimizer cannot easily rewrite NOT IN into an Anti-Join due to 3VL rules, making NOT EXISTS strictly superior."
      },
      {
        "question": "What is the PostgreSQL ANY(ARRAY[...]) syntax and why is it preferred over IN?",
        "answer": "In PostgreSQL, WHERE id = ANY($1::int[]) is preferred over WHERE id IN (...) when using prepared statements. It allows passing a single array parameter from application code (e.g. Node.js or Go) without dynamically constructing comma-separated SQL strings, eliminating SQL injection risk and enabling 100% prepared statement cache reuse."
      },
      {
        "question": "What is the difference between IN and Multiple OR statements under the hood?",
        "answer": "Mathematically, WHERE id IN (1, 2, 3) is equivalent to WHERE id = 1 OR id = 2 OR id = 3. However, under the hood, the optimizer recognizes IN as a discrete set lookup and executes it as an Index Scan using a ScalarArrayOp seek list, whereas arbitrary OR expressions across multiple columns require complex BitmapOr scans."
      }
    ],
    "interviewReadyAnswer": "The IN operator matches values against a discrete set. While IN is clean, NOT IN poses a severe production risk when NULLs are present in the dataset. Production queries should use NOT EXISTS to guarantee predictable two-valued logic.",
    "quickTest": {
      "question": "What does the query \"SELECT 1 WHERE 5 NOT IN (1, 2, NULL);\" return?",
      "options": [
        {
          "key": "A",
          "text": "1 row containing 1"
        },
        {
          "key": "B",
          "text": "0 rows (empty set)"
        },
        {
          "key": "C",
          "text": "NULL"
        },
        {
          "key": "D",
          "text": "A syntax error"
        }
      ],
      "correctAnswer": "B",
      "explanation": "5 != NULL evaluates to UNKNOWN. In WHERE clauses, UNKNOWN behaves as FALSE, so zero rows are returned."
    },
    "mentalModel": "VIP Guest List: IN checks if you are on the list; NOT IN tries to confirm you are not on the list, but if a name on the list is smudged/unknown (NULL), security stops everyone.",
    "codeSnippet": "SELECT * FROM users WHERE role IN ('admin', 'editor', 'manager');",
    "takeaways": [
      "IN replaces chains of OR clauses.",
      "NOT IN returns zero rows if the subquery contains any NULL.",
      "Always prefer NOT EXISTS over NOT IN for subqueries."
    ],
    "commonPitfall": {
      "mistake": "Using NOT IN on a subquery pointing to a nullable column and receiving zero rows unexpectedly.",
      "fix": "Use NOT EXISTS or add WHERE col IS NOT NULL inside the subquery."
    },
    "nextTopicId": "like-and-wildcards",
    "prevTopicId": "between-operator"
  },
  {
    "id": "like-and-wildcards",
    "topicNumber": 15,
    "title": "LIKE & Wildcards",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Pattern matching with % and _, case-insensitive ILIKE in PostgreSQL, escape characters, and B-Tree prefix indexability.",
    "definition": "The LIKE operator matches string patterns using wildcards: % represents zero or more characters, while _ represents exactly one character.",
    "eli5": "LIKE is like playing Hangman or typing a search with an asterisk (*). \"%smith\" finds any name ending in smith, while \"_at\" finds cat, bat, and hat.",
    "realWorldExample": {
      "description": "Searching for user emails matching a domain or finding product SKUs with specific prefix formats.",
      "tables": [
        {
          "title": "Users",
          "headers": [
            "id",
            "email"
          ],
          "rows": [
            [
              1,
              "lucky@gmail.com (Matches %gmail.com)"
            ],
            [
              2,
              "rahul@yahoo.com (No match)"
            ],
            [
              3,
              "admin@gmail.com (Matches %gmail.com)"
            ]
          ]
        }
      ],
      "explanation": "WHERE email LIKE '%@gmail.com' filters for Gmail accounts."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Prefix Match (Indexable with B-Tree)",
        "code": "SELECT id, username FROM users WHERE username LIKE 'john%';",
        "note": "Prefix matches can use a standard B-Tree index scan."
      },
      {
        "step": "Step 2: Case-insensitive search with ILIKE (PostgreSQL)",
        "code": "SELECT id, name FROM products WHERE name ILIKE '%laptop%';",
        "note": "Matches Laptop, LAPTOP, and laptop."
      },
      {
        "step": "Step 3: Single character wildcard _ and escape characters",
        "code": "-- Match 3-letter codes starting with A and ending with Z:\nSELECT code FROM coupons WHERE code LIKE 'A_Z';\n\n-- Match literal percentage sign using ESCAPE:\nSELECT id, discount FROM promotions WHERE discount LIKE '50\\%' ESCAPE '\\';",
        "note": "Use escape sequences when matching literal % or _ symbols."
      }
    ],
    "rulesTable": [
      {
        "rule": "% Wildcard",
        "explanation": "Matches zero, one, or multiple arbitrary characters."
      },
      {
        "rule": "_ Wildcard",
        "explanation": "Matches exactly one single character."
      },
      {
        "rule": "Leading Wildcard Index Invalidation",
        "explanation": "A pattern starting with % (e.g. '%search') cannot use a B-Tree index and forces a sequential scan."
      },
      {
        "rule": "B-Tree prefix indexability",
        "explanation": "LIKE queries with trailing wildcards (term%) use B-Tree indexes; leading wildcards (%term) force sequential scans."
      },
      {
        "rule": "Escape character syntax",
        "explanation": "To match literal % or _ characters, use the ESCAPE clause or backslash escaping."
      }
    ],
    "deepDive": {
      "title": "B-Tree Indexing vs Trigram (GIN) Full-Text Search",
      "description": "Standard B-Tree indexes only support prefix matches (LIKE \"abc%\"). When you need suffix or substring matching (LIKE \"%abc%\"), you must use a GIN index with the pg_trgm extension in PostgreSQL.",
      "codeSnippet": "-- Enable trigram extension in Postgres:\nCREATE EXTENSION IF NOT EXISTS pg_trgm;\n\n-- Create GIN trigram index for fast %substring% searches:\nCREATE INDEX idx_products_name_trgm ON products USING gin (name gin_trgm_ops);\n\n-- Now this uses an index instead of a full table scan!\nSELECT * FROM products WHERE name ILIKE '%macbook%';",
      "warning": "Without GIN trigrams, every LIKE \"%query%\" query scans every single disk page of the table."
    },
    "advantages": [
      "Built-in pattern matching without complex external search engines.",
      "Prefix matches (LIKE \"abc%\") execute in O(log N) using B-Trees."
    ],
    "disadvantages": [
      "Leading wildcards (%abc) force full table scans on B-Tree indexes."
    ],
    "interviewQuestions": [
      {
        "question": "Why can a B-Tree index be used for LIKE 'abc%' but NOT for LIKE '%abc'?",
        "answer": "A B-Tree index stores strings sorted in alphabetical order from left to right. When given 'abc%', the engine knows the exact starting prefix: it navigates the tree to 'abc' in O(log N) and scans forward until strings no longer start with 'abc'. When given '%abc', the first character could be anything from A to Z: the B-Tree sort order provides zero filtering advantage, forcing a full sequential scan of every page."
      },
      {
        "question": "How do you perform fast substring searching (LIKE '%pattern%') on large tables in PostgreSQL?",
        "answer": "Standard B-Tree indexes cannot satisfy leading wildcards. In PostgreSQL, you use the pg_trgm (Trigram) extension with a GIN (Generalized Inverted Index) or GiST index: CREATE INDEX idx_users_name_trgm ON users USING gin (name gin_trgm_ops); Trigrams split strings into 3-character slices, allowing the GIN index to satisfy arbitrary substring matches in milliseconds."
      },
      {
        "question": "What is the difference between LIKE and ILIKE in PostgreSQL?",
        "answer": "LIKE is case-sensitive ('Apple' LIKE 'app%' evaluates to FALSE). ILIKE is a PostgreSQL-specific extension that performs case-insensitive pattern matching ('Apple' ILIKE 'app%' evaluates to TRUE). To index ILIKE queries in standard ANSI engines, you must create a functional index on LOWER(col) and query WHERE LOWER(col) LIKE 'app%'."
      },
      {
        "question": "How do you search for literal percentage (%) or underscore (_) characters in LIKE?",
        "answer": "Because % and _ are wildcards, you must escape them. In standard SQL, you specify an ESCAPE character: WHERE code LIKE '10$%' ESCAPE '$'; or in PostgreSQL using backslash: WHERE code LIKE '10\\%';"
      },
      {
        "question": "What is the difference between SQL LIKE and Full-Text Search (tsvector / MATCH AGAINST)?",
        "answer": "LIKE performs raw character pattern matching without linguistic understanding. Full-Text Search parses text into lexemes, performs stemming (mapping \"running\" to \"run\"), strips stop words (\"the\", \"is\"), supports relevance ranking (ts_rank), and uses inverted indexes (GIN), making it vastly superior for natural language search."
      }
    ],
    "interviewReadyAnswer": "LIKE enables wildcard string searches using % and _. Prefix searches (abc%) can leverage standard B-Tree index scans, whereas arbitrary substring searches (%abc%) require GIN trigram indexes to prevent full table scans.",
    "quickTest": {
      "question": "Which of the following queries can efficiently utilize a standard B-Tree index on the name column?",
      "options": [
        {
          "key": "A",
          "text": "WHERE name LIKE '%smith'"
        },
        {
          "key": "B",
          "text": "WHERE name LIKE '%smith%'"
        },
        {
          "key": "C",
          "text": "WHERE name LIKE 'smith%'"
        },
        {
          "key": "D",
          "text": "WHERE name ILIKE '%smith%'"
        }
      ],
      "correctAnswer": "C",
      "explanation": "Only prefix searches (without a leading wildcard) can use B-Tree root-to-leaf traversal."
    },
    "mentalModel": "Telephone Directory: You can instantly find \"Smith, J\" because the book is sorted by the first letter, but you cannot quickly find all people whose name ends in \"ith\".",
    "codeSnippet": "SELECT * FROM users WHERE email LIKE '%@company.com';\nSELECT * FROM users WHERE username LIKE 'admin_%';",
    "takeaways": [
      "% matches any length; _ matches single characters.",
      "Prefix searches (val%) use B-Trees; leading wildcards (%val) do not.",
      "Use GIN trigram indexes for high-speed substring searches."
    ],
    "commonPitfall": {
      "mistake": "Writing LIKE '%keyword%' on large tables in API search endpoints, causing high CPU usage.",
      "fix": "Use PostgreSQL pg_trgm GIN indexes or full-text search (tsvector)."
    },
    "nextTopicId": "is-null-handling",
    "prevTopicId": "in-and-not-in"
  },
  {
    "id": "is-null-handling",
    "topicNumber": 16,
    "title": "IS NULL & NULL Handling",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Three-Valued Logic (3VL), IS NULL, IS NOT NULL, COALESCE, NULLIF, and avoiding = NULL errors.",
    "definition": "In SQL, NULL represents missing, unknown, or inapplicable information. Because it is not a concrete value, it cannot be evaluated with equality operators (=, !=) and requires IS NULL or IS NOT NULL.",
    "eli5": "NULL is an empty mystery box. You cannot ask \"Does box A equal box B?\" because nobody knows what is inside either box. You can only ask \"Is this box empty?\".",
    "realWorldExample": {
      "description": "An application tracks user phone numbers, where some users have not provided a number yet.",
      "tables": [
        {
          "title": "Users",
          "headers": [
            "id",
            "name",
            "phone_number"
          ],
          "rows": [
            [
              1,
              "Lucky",
              "9876543210"
            ],
            [
              2,
              "Rahul",
              "NULL (Unknown)"
            ]
          ]
        }
      ],
      "explanation": "WHERE phone_number = NULL returns ZERO rows! You must write WHERE phone_number IS NULL."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Proper NULL checks",
        "code": "-- INCORRECT (Always returns 0 rows!):\n-- SELECT * FROM users WHERE phone_number = NULL;\n\n-- CORRECT:\nSELECT id, name FROM users WHERE phone_number IS NULL;\nSELECT id, name FROM users WHERE phone_number IS NOT NULL;"
      },
      {
        "step": "Step 2: Fallback with COALESCE",
        "code": "SELECT name, COALESCE(phone_number, 'Not Provided') AS contact_phone\nFROM users;",
        "note": "COALESCE returns the first non-null argument in the parameter list."
      },
      {
        "step": "Step 3: Preventing division by zero with NULLIF",
        "code": "SELECT total_sales / NULLIF(total_orders, 0) AS avg_sale FROM stats;",
        "note": "NULLIF(x, 0) turns 0 into NULL, which safely causes division to return NULL instead of crashing."
      }
    ],
    "rulesTable": [
      {
        "rule": "No Equality with NULL",
        "explanation": "NULL = NULL evaluates to UNKNOWN, not TRUE."
      },
      {
        "rule": "WHERE Clause Filter",
        "explanation": "A WHERE predicate only admits rows evaluating strictly to TRUE; UNKNOWN rows are discarded."
      },
      {
        "rule": "IS DISTINCT FROM",
        "explanation": "col IS DISTINCT FROM val safely handles NULL as a comparable value in PostgreSQL."
      },
      {
        "rule": "Three-Valued Logic (3VL)",
        "explanation": "Comparisons with NULL yield UNKNOWN. UNKNOWN is treated as false in WHERE, but groups together in GROUP BY."
      },
      {
        "rule": "COALESCE vs NULLIF semantics",
        "explanation": "COALESCE returns the first non-null argument; NULLIF returns NULL if two arguments are equal."
      }
    ],
    "deepDive": {
      "title": "Aggregate Functions and NULLs",
      "description": "Standard aggregate functions like COUNT(column), SUM(column), and AVG(column) completely ignore NULL values! Notice that COUNT(*) counts physical rows, but COUNT(column) only counts rows where that specific column is NOT NULL.",
      "codeSnippet": "-- Table with 3 rows: values [10, 20, NULL]\nSELECT\n  COUNT(*) AS total_rows,      -- Returns 3\n  COUNT(val) AS non_null_rows,  -- Returns 2\n  AVG(val) AS average           -- Returns 15 ((10 + 20) / 2, not 30/3!)\nFROM numbers;",
      "warning": "AVG() ignores NULLs, which can artificially skew statistical metrics unless wrapped with COALESCE(val, 0)."
    },
    "advantages": [
      "Cleanly represents unknown or optional real-world attributes.",
      "COALESCE provides seamless fallback defaults."
    ],
    "disadvantages": [
      "Three-Valued Logic introduces subtle bugs if developers use = NULL."
    ],
    "interviewQuestions": [
      {
        "question": "Why does \"WHERE col = NULL\" always return zero rows in SQL?",
        "answer": "In relational database theory and ANSI SQL, NULL represents missing, unknown, or inapplicable information. You cannot say whether an unknown value is equal to another unknown value. Therefore, the expression col = NULL evaluates to UNKNOWN. The WHERE clause only returns rows where the filter evaluates to TRUE, so all rows are discarded. You must use IS NULL."
      },
      {
        "question": "What is Three-Valued Logic (3VL) and how do truth tables work with UNKNOWN?",
        "answer": "SQL uses 3VL with three truth values: TRUE, FALSE, and UNKNOWN. Key truth table rules: TRUE AND UNKNOWN = UNKNOWN, FALSE AND UNKNOWN = FALSE (short-circuits), TRUE OR UNKNOWN = TRUE (short-circuits), FALSE OR UNKNOWN = UNKNOWN, NOT UNKNOWN = UNKNOWN. In WHERE/HAVING filters, only TRUE qualifies; UNKNOWN is rejected."
      },
      {
        "question": "What is the difference between COALESCE and NULLIF?",
        "answer": "COALESCE takes N arguments and returns the first non-NULL expression: COALESCE(phone, mobile, 'N/A'). NULLIF takes two arguments and returns NULL if they are equal, otherwise returning the first argument: NULLIF(val, 0) is commonly used to prevent division-by-zero errors (e.g. total / NULLIF(count, 0))."
      },
      {
        "question": "How do B-Tree indexes handle NULL values across PostgreSQL, MySQL, and Oracle?",
        "answer": "In PostgreSQL and MySQL (InnoDB), B-Tree indexes index NULL values. A query with WHERE col IS NULL can utilize an Index Scan. In Oracle, B-Tree indexes completely omit entries where ALL indexed columns are NULL, meaning Oracle cannot use a single-column B-Tree index for WHERE col IS NULL unless a compound index or bitmap index is used."
      },
      {
        "question": "How does GROUP BY and ORDER BY treat NULL values?",
        "answer": "In GROUP BY, all NULL values are considered equal and collapsed into a single distinct group bucket. In ORDER BY, ANSI SQL allows specifying NULLS FIRST or NULLS LAST: in PostgreSQL, NULLs default to NULLS LAST for ASC and NULLS FIRST for DESC; in MySQL, NULLs are treated as the lowest possible values."
      }
    ],
    "interviewReadyAnswer": "NULL represents missing data and requires Three-Valued Logic. Equality checks (= NULL) fail because comparisons with NULL evaluate to UNKNOWN. Use IS NULL, IS NOT NULL, and COALESCE to handle nullability safely.",
    "quickTest": {
      "question": "What is the result of the expression: NULL = NULL?",
      "options": [
        {
          "key": "A",
          "text": "TRUE"
        },
        {
          "key": "B",
          "text": "FALSE"
        },
        {
          "key": "C",
          "text": "UNKNOWN"
        },
        {
          "key": "D",
          "text": "0"
        }
      ],
      "correctAnswer": "C",
      "explanation": "In SQL Three-Valued Logic, comparing two unknown values produces UNKNOWN."
    },
    "mentalModel": "Empty Gift Box: You cannot tell if two unmarked closed boxes hold the same present. They are both UNKNOWN until inspected.",
    "codeSnippet": "SELECT name, COALESCE(bio, 'No bio added.') AS bio\nFROM profiles\nWHERE deleted_at IS NULL;",
    "takeaways": [
      "Never use = NULL; always use IS NULL or IS NOT NULL.",
      "COALESCE returns the first non-null expression.",
      "Aggregate functions (except COUNT(*)) completely ignore NULLs."
    ],
    "commonPitfall": {
      "mistake": "Writing WHERE status != \"cancelled\" and accidentally filtering out rows where status IS NULL.",
      "fix": "Write WHERE status != \"cancelled\" OR status IS NULL (or use IS DISTINCT FROM)."
    },
    "nextTopicId": "order-by-sorting",
    "prevTopicId": "like-and-wildcards"
  },
  {
    "id": "order-by-sorting",
    "topicNumber": 17,
    "title": "ORDER BY Sorting",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "Sorting query results, multi-column ordering, ASC and DESC, NULLS FIRST / NULLS LAST, and avoiding in-memory sort spills.",
    "definition": "The ORDER BY clause sorts the result set of a query by one or more columns or expressions in ascending (ASC) or descending (DESC) order.",
    "eli5": "Relational databases do not store rows in any guaranteed order. ORDER BY is the organizer that sorts items alphabetically by name, or numerically by price.",
    "realWorldExample": {
      "description": "An executive leaderboard displays top sales reps ordered by sales revenue, with ties broken by seniority.",
      "tables": [
        {
          "title": "Sales Leaderboard",
          "headers": [
            "name",
            "revenue",
            "hire_date"
          ],
          "rows": [
            [
              "Alice",
              "$150,000",
              "2021-01-15"
            ],
            [
              "Bob",
              "$120,000",
              "2020-05-10"
            ],
            [
              "Charlie",
              "$120,000",
              "2022-09-01"
            ]
          ]
        }
      ],
      "explanation": "ORDER BY revenue DESC, hire_date ASC breaks ties deterministically."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Multi-column sorting",
        "code": "SELECT name, department, salary\nFROM employees\nORDER BY department ASC, salary DESC;",
        "note": "First groups by department alphabetically, then sorts salaries highest to lowest within each department."
      },
      {
        "step": "Step 2: Explicit NULL placement",
        "code": "SELECT id, name, priority\nFROM tasks\nORDER BY priority DESC NULLS LAST;",
        "note": "Ensures tasks without a priority value do not appear at the top of the list."
      }
    ],
    "rulesTable": [
      {
        "rule": "No Default Order",
        "explanation": "Without an ORDER BY clause, the database makes ZERO guarantee about physical row return order."
      },
      {
        "rule": "Position Numbers",
        "explanation": "ORDER BY 1, 2 sorts by the 1st and 2nd columns in the SELECT projection, but explicit names are preferred."
      },
      {
        "rule": "NULL Placement Defaults",
        "explanation": "In PostgreSQL, ASC defaults to NULLS LAST, while DESC defaults to NULLS FIRST."
      },
      {
        "rule": "Sort memory boundary (work_mem)",
        "explanation": "If sorted tuples exceed work_mem, the engine spills to disk using an external two-pass merge sort."
      },
      {
        "rule": "Index-backed sorting (zero CPU)",
        "explanation": "Scanning an index in key order satisfies ORDER BY without performing an in-memory sort operation."
      }
    ],
    "deepDive": {
      "title": "Index Sorting vs In-Memory work_mem Spills",
      "description": "If an index matches the requested ORDER BY clause (e.g. index on (department, salary DESC)), the engine traverses the index leaf pointers directly in pre-sorted order. Without an index, the engine performs an external sort, which spills to disk if work_mem is exceeded.",
      "codeSnippet": "-- EXPLAIN showing index traversal with ZERO sorting cost:\nEXPLAIN ANALYZE\nSELECT id, created_at FROM orders ORDER BY created_at DESC LIMIT 10;\n-- Result: \"Index Scan Backward using idx_orders_created_at\"",
      "warning": "Sorting unindexed million-row tables causes temporary disk files and high query latency."
    },
    "advantages": [
      "Guarantees deterministic presentation order.",
      "Enables correct pagination when combined with LIMIT."
    ],
    "disadvantages": [
      "Unindexed sorts require high memory and CPU to sort rows in work_mem."
    ],
    "interviewQuestions": [
      {
        "question": "What happens when an ORDER BY query exceeds available work_mem in PostgreSQL?",
        "answer": "The database first attempts an in-memory QuickSort. If the candidate tuples exceed the work_mem allocation, the engine spills the intermediate tuples to temporary files on disk and performs an External Two-Pass Merge Sort. This introduces severe disk I/O latency. Increasing work_mem for specific sessions or adding an index avoids disk spills."
      },
      {
        "question": "How can an index completely eliminate the execution cost of ORDER BY?",
        "answer": "A B-Tree index is already physically ordered on disk. If a query orders by the indexed column (e.g. ORDER BY created_at DESC), the Cost-Based Optimizer can perform an Index Scan in the backward direction, streaming rows already sorted. EXPLAIN ANALYZE will show \"Index Scan\" with ZERO \"Sort\" nodes in the execution plan."
      },
      {
        "question": "What is the difference between NULLS FIRST and NULLS LAST?",
        "answer": "NULLS FIRST places all NULL records at the beginning of the result set; NULLS LAST places them at the end. In PostgreSQL: ORDER BY col ASC defaults to NULLS LAST, while ORDER BY col DESC defaults to NULLS FIRST. Explicitly specifying NULLS LAST ensures pagination consistency when descending."
      },
      {
        "question": "Why does \"ORDER BY RAND()\" or \"ORDER BY RANDOM()\" cause catastrophic performance on large tables?",
        "answer": "ORDER BY RANDOM() assigns a random floating-point value to every row in the table, forcing the engine to perform a full sequential scan of the entire table and sort all millions of rows in memory or disk, just to discard all but the top few. It runs in O(N log N) time and destroys database performance."
      },
      {
        "question": "Can you sort by a column that is not included in the SELECT projection list?",
        "answer": "Yes, in standard queries (SELECT id, name FROM users ORDER BY created_at), the engine retains created_at in the working tuple during sorting and strips it during final projection. However, if the query includes DISTINCT or UNION, all ORDER BY expressions MUST appear in the SELECT list because duplicate elimination happens before sorting."
      }
    ],
    "interviewReadyAnswer": "ORDER BY determines the sequence of returned tuples. Because relational tables have no intrinsic order, sorting is mandatory for pagination. Using matching B-Tree indexes eliminates in-memory sort overhead entirely.",
    "quickTest": {
      "question": "Which clause ensures that NULL values appear at the end of a descending sort in PostgreSQL?",
      "options": [
        {
          "key": "A",
          "text": "ORDER BY score DESC IGNORE NULLS"
        },
        {
          "key": "B",
          "text": "ORDER BY score DESC NULLS LAST"
        },
        {
          "key": "C",
          "text": "ORDER BY score DESC WITHOUT NULLS"
        },
        {
          "key": "D",
          "text": "ORDER BY score DESC BOTTOM"
        }
      ],
      "correctAnswer": "B",
      "explanation": "NULLS LAST explicitly instructs the query planner to place NULL tuples at the very end of the result set."
    },
    "mentalModel": "Alphabetizing index cards: If they are already filed in order (indexed), you pick them up instantly; if they are in a messy pile, you must sit down and sort them on your desk.",
    "codeSnippet": "SELECT id, customer, amount\nFROM invoices\nORDER BY amount DESC NULLS LAST\nLIMIT 10;",
    "takeaways": [
      "Relational tables have no inherent order without ORDER BY.",
      "Use NULLS FIRST or NULLS LAST for deterministic NULL sorting.",
      "Matching B-Tree indexes allow index scans without sort overhead."
    ],
    "commonPitfall": {
      "mistake": "Relying on physical insertion order for display sequence instead of providing an explicit ORDER BY clause.",
      "fix": "Always write explicit ORDER BY clauses on queries powering UI lists."
    },
    "nextTopicId": "case-when-statements",
    "prevTopicId": "is-null-handling"
  },
  {
    "id": "case-when-statements",
    "topicNumber": 18,
    "title": "CASE WHEN Statements",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Conditional branching logic, simple vs searched CASE expressions, conditional aggregations, and pivoting.",
    "definition": "CASE WHEN is a conditional expression in SQL that evaluates a series of conditions and returns a value when the first true condition is met, functioning like an IF-THEN-ELSE block.",
    "eli5": "CASE WHEN is a sorting hat: if you are brave, you go to Gryffindor; else if you are smart, you go to Ravenclaw; otherwise, you go to Hufflepuff.",
    "realWorldExample": {
      "description": "Categorizing customer orders into tiered loyalty categories based on lifetime spend.",
      "tables": [
        {
          "title": "Customer Tiers",
          "headers": [
            "name",
            "lifetime_spend",
            "tier"
          ],
          "rows": [
            [
              "Alice",
              "$12,000",
              "Platinum"
            ],
            [
              "Bob",
              "$3,500",
              "Gold"
            ],
            [
              "Charlie",
              "$200",
              "Standard"
            ]
          ]
        }
      ],
      "explanation": "CASE WHEN lifetime_spend >= 10000 THEN 'Platinum' ... assigns the correct label dynamically."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Searched CASE expression",
        "code": "SELECT name, lifetime_spend,\n  CASE\n    WHEN lifetime_spend >= 10000 THEN 'Platinum'\n    WHEN lifetime_spend >= 2500 THEN 'Gold'\n    WHEN lifetime_spend >= 500 THEN 'Silver'\n    ELSE 'Standard'\n  END AS customer_tier\nFROM customers;",
        "note": "Conditions evaluate in sequential top-down order."
      },
      {
        "step": "Step 2: Conditional aggregation (Pivot pattern)",
        "code": "SELECT department,\n  COUNT(*) AS total_employees,\n  SUM(CASE WHEN salary > 100000 THEN 1 ELSE 0 END) AS high_earners\nFROM employees\nGROUP BY department;",
        "note": "Counts specific sub-segments in a single table pass."
      }
    ],
    "rulesTable": [
      {
        "rule": "Sequential Evaluation",
        "explanation": "CASE stops evaluating as soon as the first condition evaluates to TRUE."
      },
      {
        "rule": "ELSE Default",
        "explanation": "If no WHEN matches and no ELSE clause is provided, the CASE expression returns NULL."
      },
      {
        "rule": "Uniform Return Types",
        "explanation": "All return expressions across all WHEN and ELSE branches must share compatible data types."
      },
      {
        "rule": "Short-circuit branch evaluation",
        "explanation": "CASE evaluates conditions sequentially; the first branch that evaluates to TRUE returns immediately."
      },
      {
        "rule": "Data type consistency across branches",
        "explanation": "All THEN and ELSE result expressions must coerce to a single compatible data type."
      }
    ],
    "deepDive": {
      "title": "Conditional Aggregations vs FILTER Clause",
      "description": "SUM(CASE WHEN ...) is the standard ANSI technique for conditional aggregation. PostgreSQL also supports the modern FILTER (WHERE ...) clause, which is even cleaner and easier to read.",
      "codeSnippet": "-- Standard SQL (Universal):\nSELECT SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) FROM orders;\n\n-- Modern PostgreSQL FILTER syntax:\nSELECT SUM(amount) FILTER (WHERE status = 'completed') FROM orders;",
      "warning": "Always provide an explicit ELSE clause to prevent unexpected NULL values from polluting calculations."
    },
    "advantages": [
      "Brings procedural if-else branching logic cleanly into declarative SQL.",
      "Powers complex multi-metric reporting in a single table scan."
    ],
    "disadvantages": [
      "Deeply nested CASE statements can harm query readability."
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between a Simple CASE expression and a Searched CASE expression?",
        "answer": "A Simple CASE compares a single base expression against values using equality: CASE status WHEN 1 THEN 'active' WHEN 2 THEN 'paused' END. A Searched CASE evaluates arbitrary boolean expressions in each branch: CASE WHEN score >= 90 THEN 'A' WHEN score >= 80 THEN 'B' END. Searched CASE is vastly more flexible."
      },
      {
        "question": "How do you use conditional aggregation (CASE inside SUM/COUNT) to pivot rows into columns?",
        "answer": "Conditional aggregation wraps CASE WHEN inside aggregate functions. It allows transforming long-format category rows into wide-format reporting columns in a single table pass without dynamic SQL or extension modules.",
        "codeBlock": "SELECT \n    department_id,\n    COUNT(*) AS total_employees,\n    COUNT(CASE WHEN gender = 'F' THEN 1 END) AS female_count,\n    COUNT(CASE WHEN gender = 'M' THEN 1 END) AS male_count,\n    SUM(CASE WHEN status = 'active' THEN salary ELSE 0 END) AS active_payroll\nFROM employees\nGROUP BY department_id;"
      },
      {
        "question": "What happens if no WHEN condition matches and there is no ELSE clause in CASE?",
        "answer": "If no WHEN condition evaluates to TRUE and an ELSE clause is omitted, the CASE expression evaluates to NULL by default. It never throws an exception. In production, always supply an explicit ELSE clause to prevent silent NULL injection into mathematical formulas."
      },
      {
        "question": "Can a CASE expression be used to safely guard against division by zero?",
        "answer": "Yes. Because CASE WHEN evaluates branches sequentially and short-circuits upon the first match, placing the zero-check in the first WHEN condition guarantees safety: SELECT CASE WHEN count = 0 THEN 0 ELSE total / count END FROM metrics; The engine will never evaluate the ELSE branch when count = 0."
      },
      {
        "question": "Can you create an index on a CASE expression in PostgreSQL?",
        "answer": "Yes. PostgreSQL supports expression indexes. You can index the result of a deterministic CASE expression: CREATE INDEX idx_users_vip ON users ((CASE WHEN total_spent > 10000 THEN 1 ELSE 0 END)); Queries filtering on that exact CASE expression will use the index seek."
      }
    ],
    "interviewReadyAnswer": "CASE WHEN provides conditional branching in SQL. Beyond labeling rows, its most powerful production application is conditional aggregation, allowing developers to calculate multiple metrics across categories in a single query pass.",
    "quickTest": {
      "question": "What does a CASE expression return if no WHEN condition evaluates to TRUE and no ELSE clause is defined?",
      "options": [
        {
          "key": "A",
          "text": "0"
        },
        {
          "key": "B",
          "text": "NULL"
        },
        {
          "key": "C",
          "text": "An empty string ''"
        },
        {
          "key": "D",
          "text": "A runtime error"
        }
      ],
      "correctAnswer": "B",
      "explanation": "ANSI SQL standards mandate that a CASE expression without a matching branch and without an ELSE clause evaluates to NULL."
    },
    "mentalModel": "Traffic lights: If light is green, proceed; else if light is yellow, slow down; otherwise, stop.",
    "codeSnippet": "SELECT id, status,\n  CASE status\n    WHEN 'paid' THEN 'Invoice Settled'\n    WHEN 'pending' THEN 'Action Required'\n    ELSE 'Unknown State'\n  END AS display_status\nFROM invoices;",
    "takeaways": [
      "CASE expressions evaluate in sequential top-down order.",
      "Always provide an ELSE clause to avoid unexpected NULLs.",
      "Use CASE inside SUM() to calculate conditional aggregates."
    ],
    "commonPitfall": {
      "mistake": "Returning mixed incompatible types (e.g. WHEN true THEN 42 ELSE \"None\"), causing type coercion errors.",
      "fix": "Ensure all branches return the same data type."
    },
    "nextTopicId": "aggregate-functions",
    "prevTopicId": "order-by-sorting"
  },
  {
    "id": "aggregate-functions",
    "topicNumber": 19,
    "title": "Aggregate Functions",
    "category": "query-execution",
    "difficulty": "Beginner",
    "summary": "COUNT, SUM, AVG, MIN, MAX, DISTINCT inside aggregates, and understanding how NULLs affect mathematical results.",
    "definition": "Aggregate functions compute a single scalar summary value across a collection (or partition) of multiple column values.",
    "eli5": "Aggregate functions are like a team captain tallying stats at the end of a game: finding the highest score (MAX), lowest score (MIN), total points (SUM), or average.",
    "realWorldExample": {
      "description": "A monthly financial summary calculating total sales, average ticket size, and total unique buyers.",
      "tables": [
        {
          "title": "Monthly Orders",
          "headers": [
            "order_id",
            "buyer_id",
            "amount"
          ],
          "rows": [
            [
              1,
              101,
              "150.00"
            ],
            [
              2,
              102,
              "50.00"
            ],
            [
              3,
              101,
              "200.00"
            ]
          ]
        }
      ],
      "explanation": "SUM(amount) = 400.00, AVG(amount) = 133.33, COUNT(DISTINCT buyer_id) = 2."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Multi-metric summary",
        "code": "SELECT\n  COUNT(*) AS total_transactions,\n  COUNT(DISTINCT buyer_id) AS unique_buyers,\n  SUM(amount) AS total_revenue,\n  AVG(amount) AS average_ticket,\n  MIN(amount) AS smallest_sale,\n  MAX(amount) AS largest_sale\nFROM orders;",
        "note": "Computes entire dataset metrics in a single aggregation step."
      }
    ],
    "rulesTable": [
      {
        "rule": "NULL Exclusion",
        "explanation": "All aggregate functions (except COUNT(*)) completely ignore NULL values during computation."
      },
      {
        "rule": "Empty Set Behavior",
        "explanation": "SUM, AVG, MIN, and MAX on an empty table return NULL; COUNT returns 0."
      },
      {
        "rule": "DISTINCT Modifier",
        "explanation": "COUNT(DISTINCT col) deduplicates values before calculating the count."
      },
      {
        "rule": "NULL handling in aggregates",
        "explanation": "SUM, AVG, MIN, and MAX ignore NULL values entirely; COUNT(*) counts all rows including NULLs."
      },
      {
        "rule": "Aggregate restriction in WHERE",
        "explanation": "Aggregates cannot be used in WHERE clauses because row filtering occurs before aggregation."
      }
    ],
    "deepDive": {
      "title": "Empty Table Aggregation Behavior",
      "description": "If you run SELECT SUM(salary) FROM employees WHERE 1 = 0, the query returns a single row with NULL (not 0!). If your application expects a number, wrap the aggregate with COALESCE.",
      "codeSnippet": "-- Returns NULL if no matching rows exist:\nSELECT SUM(amount) FROM payments WHERE status = 'failed';\n\n-- Returns 0.00 reliably:\nSELECT COALESCE(SUM(amount), 0.00) FROM payments WHERE status = 'failed';",
      "warning": "Never assume SUM() or AVG() return 0 on empty sets; they return NULL."
    },
    "advantages": [
      "Enables high-performance data reduction directly in database RAM.",
      "Minimizes application network transfer by computing summaries on disk."
    ],
    "disadvantages": [
      "Running aggregates without index-supported filters requires full sequential scans."
    ],
    "interviewQuestions": [
      {
        "question": "What is the critical difference between COUNT(*), COUNT(1), and COUNT(column)?",
        "answer": "COUNT(*) and COUNT(1) are semantically identical in modern optimizers: they count the total number of rows in the relation, regardless of whether columns contain NULL. COUNT(column) evaluates the specific column for every row and counts ONLY rows where the column is NOT NULL. If a table has 10 rows and 3 are NULL, COUNT(*) returns 10 while COUNT(col) returns 7."
      },
      {
        "question": "Why does AVG(column) produce unexpected results when columns contain NULL?",
        "answer": "AVG(col) calculates SUM(col) / COUNT(col), NOT SUM(col) / total_rows. Rows with NULL are omitted from both the numerator and denominator. If 4 employees earn $100 and 1 has NULL salary, AVG() returns 100 / 1 = 100, not 100 / 2 = 50. If you want NULLs treated as zero, you must use AVG(COALESCE(col, 0))."
      },
      {
        "question": "What is the performance penalty of COUNT(DISTINCT column) and how do you optimize it?",
        "answer": "COUNT(DISTINCT col) requires the engine to collect all values into an in-memory hash set or sort them to deduplicate before counting. In distributed or high-cardinality tables, this is extremely expensive and memory-intensive. For analytics on billions of rows where exact counts are unnecessary, modern databases provide HyperLogLog (HLL) approximation functions (e.g. hyperloglog in PostgreSQL or APPROX_COUNT_DISTINCT in Snowflake)."
      },
      {
        "question": "What is the FILTER clause in PostgreSQL aggregates?",
        "answer": "PostgreSQL supports the standard ANSI FILTER (WHERE condition) clause directly on aggregate functions: SELECT count(*) FILTER (WHERE status = 'active') FROM users; This is cleaner, faster, and more readable than the traditional COUNT(CASE WHEN status = 'active' THEN 1 END) syntax."
      },
      {
        "question": "What do aggregate functions return when executed against an empty table?",
        "answer": "COUNT(*) returns 0. However, SUM(), AVG(), MIN(), and MAX() all return NULL! If an application expects a number, calling SUM() on an empty result set will return NULL, causing NullPointerExceptions unless wrapped in COALESCE(SUM(val), 0)."
      }
    ],
    "interviewReadyAnswer": "Aggregate functions condense multiple rows into a single scalar metric. With the exception of COUNT(*), all aggregates omit NULL values, and empty set calculations return NULL for functions like SUM and AVG.",
    "quickTest": {
      "question": "What does the query \"SELECT COUNT(bonus) FROM staff\" return if staff has 10 rows and 4 employees have bonus = NULL?",
      "options": [
        {
          "key": "A",
          "text": "10"
        },
        {
          "key": "B",
          "text": "6"
        },
        {
          "key": "C",
          "text": "NULL"
        },
        {
          "key": "D",
          "text": "4"
        }
      ],
      "correctAnswer": "B",
      "explanation": "COUNT(column_name) only counts rows where that specific column is NOT NULL (10 - 4 = 6)."
    },
    "mentalModel": "Cash Register: It adds up all money tendered, finds the highest purchase of the day, and reports the daily average.",
    "codeSnippet": "SELECT COUNT(*) AS total_orders, COALESCE(SUM(amount), 0) AS total_revenue\nFROM orders\nWHERE order_date = CURRENT_DATE;",
    "takeaways": [
      "COUNT(*) counts all rows; COUNT(col) counts only non-null values.",
      "SUM and AVG return NULL on empty matching sets.",
      "Use COALESCE(SUM(val), 0) to ensure numeric returns."
    ],
    "commonPitfall": {
      "mistake": "Assuming SUM(amount) returns 0 when no rows match, causing NullPointerExceptions in application code.",
      "fix": "Wrap with COALESCE: COALESCE(SUM(amount), 0)."
    },
    "nextTopicId": "group-by-grouping",
    "prevTopicId": "case-when-statements"
  },
  {
    "id": "group-by-grouping",
    "topicNumber": 20,
    "title": "GROUP BY Grouping",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Grouping rows into buckets, multi-column grouping, aggregate integrity rules, and GROUP BY execution mechanics.",
    "definition": "The GROUP BY clause collapses rows that share identical values in specified columns into summary buckets, enabling aggregate functions to run per group.",
    "eli5": "Imagine sorting a box of Lego bricks by color. You make separate piles for red, blue, and green, and then count how many bricks are in each pile.",
    "realWorldExample": {
      "description": "An executive report showing total sales and headcount per department.",
      "tables": [
        {
          "title": "Employees Table",
          "headers": [
            "name",
            "department",
            "salary"
          ],
          "rows": [
            [
              "Alice",
              "Engineering",
              "$120,000"
            ],
            [
              "Bob",
              "Engineering",
              "$110,000"
            ],
            [
              "Charlie",
              "Marketing",
              "$90,000"
            ]
          ]
        },
        {
          "title": "Grouped Result",
          "headers": [
            "department",
            "headcount",
            "total_payroll"
          ],
          "rows": [
            [
              "Engineering",
              2,
              "$230,000"
            ],
            [
              "Marketing",
              1,
              "$90,000"
            ]
          ]
        }
      ],
      "explanation": "Rows are grouped by department, computing aggregates for each department bucket."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Single and multi-column grouping",
        "code": "SELECT\n  department,\n  country,\n  COUNT(*) AS total_staff,\n  ROUND(AVG(salary), 2) AS avg_salary\nFROM employees\nGROUP BY department, country;",
        "note": "Every non-aggregated column in the SELECT list MUST appear in the GROUP BY clause."
      }
    ],
    "rulesTable": [
      {
        "rule": "Projection Invariant",
        "explanation": "Any column in SELECT that is not wrapped in an aggregate function must be listed in GROUP BY."
      },
      {
        "rule": "NULL Grouping",
        "explanation": "All NULL values in a grouping column are treated as equal and placed into a single shared NULL group."
      },
      {
        "rule": "HashAggregate vs GroupAggregate",
        "explanation": "Engines group rows using in-memory hash tables (HashAggregate) or by sorting first (GroupAggregate)."
      },
      {
        "rule": "Single-value rule",
        "explanation": "Every non-aggregated column in the SELECT list must appear in the GROUP BY clause."
      },
      {
        "rule": "Hash Aggregate vs Group Aggregate",
        "explanation": "The engine either hashes grouping keys into RAM (HashAggregate) or pre-sorts data (GroupAggregate)."
      }
    ],
    "deepDive": {
      "title": "HashAggregate vs GroupAggregate Engine Plans",
      "description": "The Cost-Based Optimizer chooses between HashAggregate (building a hash table in memory) and GroupAggregate (sorting input rows first, then scanning sequentially). If work_mem is too small to hold all distinct groups, the hash table spills to disk.",
      "codeSnippet": "-- EXPLAIN output showing HashAggregate:\nEXPLAIN SELECT department, COUNT(*) FROM employees GROUP BY department;\n-- \"HashAggregate (cost=15.20..17.20 rows=200 width=16)\"",
      "warning": "Grouping on high-cardinality columns (like unique user IDs) consumes large amounts of memory."
    },
    "advantages": [
      "Transforms granular row data into structured departmental/category analytics.",
      "Enables multi-dimensional summaries in a single query."
    ],
    "disadvantages": [
      "Grouping massive datasets without indexes creates high memory pressure and disk spills."
    ],
    "interviewQuestions": [
      {
        "question": "Why does \"SELECT department, name, AVG(salary) FROM employees GROUP BY department;\" fail with a syntax error?",
        "answer": "This violates the Single-Value Rule of relational algebra. GROUP BY department collapses multiple employee rows into a single summary row per department. The department has one value, and AVG(salary) computes one scalar value. But \"name\" has multiple different values per department: the engine cannot guess which employee name to display without an aggregate function (e.g. STRING_AGG, MAX)."
      },
      {
        "question": "What is the difference between Hash Aggregate and Group Aggregate in execution plans?",
        "answer": "In Hash Aggregate, the engine builds an in-memory hash table where keys are the GROUP BY columns and values are the running aggregate accumulators; it processes in O(N) but requires enough work_mem. In Group Aggregate, the input data must already be sorted by the grouping columns (via an index or sort); the engine streams through sorted rows and emits a group whenever the key changes, using minimal memory."
      },
      {
        "question": "What are GROUPING SETS, ROLLUP, and CUBE in SQL?",
        "answer": "These are multidimensional aggregation extensions that compute multiple levels of subtotals in a single query pass. ROLLUP(year, month) creates hierarchical subtotals: (year, month), (year), and grand total. CUBE(region, product) creates all possible combinations: (region, product), (region), (product), and grand total. GROUPING SETS allows defining exact custom subtotal combinations."
      },
      {
        "question": "How do indexes optimize GROUP BY performance?",
        "answer": "If an index exists on the grouping columns (e.g. INDEX ON employees(department)), the database can avoid the expensive in-memory hash table or sort phase entirely. It performs an Index Scan to read the rows already ordered by department, executing a streaming GroupAggregate in O(N) time with O(1) memory."
      },
      {
        "question": "Can you GROUP BY an expression or calculation in SQL?",
        "answer": "Yes. You can group by computed expressions, such as GROUP BY DATE_TRUNC('month', created_at) or GROUP BY CASE WHEN age >= 18 THEN 'Adult' ELSE 'Minor' END. However, in standard SQL, you must repeat the exact expression in the GROUP BY clause unless using column position numbers (e.g. GROUP BY 1)."
      }
    ],
    "interviewReadyAnswer": "GROUP BY aggregates rows with identical values into summary buckets. Every column in the SELECT list must either be declared in the GROUP BY clause or enclosed in an aggregate function.",
    "quickTest": {
      "question": "Why does the query \"SELECT dept_id, title, COUNT(*) FROM staff GROUP BY dept_id;\" throw an error in standard SQL?",
      "options": [
        {
          "key": "A",
          "text": "COUNT(*) cannot be used with GROUP BY."
        },
        {
          "key": "B",
          "text": "The column \"title\" is in SELECT but neither aggregated nor included in GROUP BY."
        },
        {
          "key": "C",
          "text": "GROUP BY requires an ORDER BY clause."
        },
        {
          "key": "D",
          "text": "dept_id must be a string column."
        }
      ],
      "correctAnswer": "B",
      "explanation": "In ANSI SQL, any column projected in SELECT that is not inside an aggregate function must be present in the GROUP BY clause."
    },
    "mentalModel": "Sorting laundry: You divide clothes into piles by color, and then count or weigh each pile.",
    "codeSnippet": "SELECT department, COUNT(*) AS staff_count, AVG(salary) AS avg_sal\nFROM employees\nGROUP BY department\nORDER BY staff_count DESC;",
    "takeaways": [
      "All non-aggregated SELECT columns must appear in GROUP BY.",
      "NULLs cluster into a single shared group.",
      "Optimizers use HashAggregate or GroupAggregate execution nodes."
    ],
    "commonPitfall": {
      "mistake": "Forgetting a column in GROUP BY that was included in SELECT.",
      "fix": "Add the missing column to the GROUP BY clause or aggregate it."
    },
    "nextTopicId": "having-clause",
    "prevTopicId": "aggregate-functions"
  }
];
