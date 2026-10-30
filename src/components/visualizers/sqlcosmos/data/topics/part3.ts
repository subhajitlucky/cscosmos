import { SqlTopic } from './types';

export const TOPICS_21_TO_30: SqlTopic[] = [
  {
    "id": "having-clause",
    "topicNumber": 21,
    "title": "HAVING Clause",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Filtering aggregated groups vs individual rows, WHERE vs HAVING execution order, and performance implications.",
    "definition": "The HAVING clause specifies filter conditions applied to grouped rows (the output of GROUP BY), filtering based on aggregate expressions like COUNT(), SUM(), or AVG().",
    "eli5": "WHERE filters individual applicants before the team is formed; HAVING filters whole teams after their total scores have been calculated.",
    "realWorldExample": {
      "description": "Finding departments that have more than 5 employees and an average salary over $100,000.",
      "tables": [
        {
          "title": "Department Aggregates",
          "headers": [
            "department",
            "COUNT(*)",
            "AVG(salary)"
          ],
          "rows": [
            [
              "Engineering",
              12,
              "$125,000 (Passes HAVING)"
            ],
            [
              "Sales",
              8,
              "$85,000 (Fails salary check)"
            ],
            [
              "HR",
              3,
              "$95,000 (Fails count check)"
            ]
          ]
        }
      ],
      "explanation": "HAVING COUNT(*) > 5 AND AVG(salary) > 100000 filters out Sales and HR."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Filtering grouped results with HAVING",
        "code": "SELECT department, COUNT(*) AS staff_count, AVG(salary) AS avg_sal\nFROM employees\nWHERE status = 'active' -- Filters rows BEFORE grouping\nGROUP BY department\nHAVING COUNT(*) >= 5   -- Filters groups AFTER aggregation\nORDER BY avg_sal DESC;",
        "note": "WHERE filters individual tuples; HAVING filters aggregate buckets."
      }
    ],
    "rulesTable": [
      {
        "rule": "WHERE vs HAVING Timing",
        "explanation": "WHERE evaluates before GROUP BY; HAVING evaluates after GROUP BY and aggregate calculation."
      },
      {
        "rule": "Pre-Filter Optimization",
        "explanation": "Never put filters on plain columns in HAVING if they could be placed in WHERE (filtering early saves CPU)."
      },
      {
        "rule": "Aggregate Requirement",
        "explanation": "Conditions inside HAVING typically involve aggregate functions like SUM, COUNT, or AVG."
      },
      {
        "rule": "Post-aggregation filtering",
        "explanation": "HAVING evaluates only after rows are grouped and aggregate functions (COUNT, SUM) are computed."
      },
      {
        "rule": "Filter placement optimization",
        "explanation": "Non-aggregate row filters should always be placed in WHERE rather than HAVING to eliminate rows early."
      }
    ],
    "deepDive": {
      "title": "Performance: Why Filtering in WHERE Beats HAVING",
      "description": "Filtering in WHERE discards rows before the engine allocates memory for HashAggregate. If you filter in HAVING, the database must ingest, sort, or hash every single row first, wasting memory and CPU.",
      "codeSnippet": "-- SLOW (Groups all countries first, then discards):\nSELECT country, COUNT(*) FROM users GROUP BY country HAVING country = 'US';\n\n-- FAST (Filters in WHERE, grouping ONLY US rows):\nSELECT country, COUNT(*) FROM users WHERE country = 'US' GROUP BY country;",
      "warning": "Only put conditions in HAVING that strictly require aggregate functions."
    },
    "advantages": [
      "Enables conditional filtering on calculated group metrics.",
      "Completes the relational pipeline for grouped analytics."
    ],
    "disadvantages": [
      "Misplacing row-level predicates into HAVING wastes substantial query memory."
    ],
    "interviewQuestions": [
      {
        "question": "Why should you filter in WHERE instead of HAVING whenever possible?",
        "answer": "WHERE filters rows before they are placed into grouping buckets or processed by aggregate accumulators, dramatically reducing the amount of data the engine must hold in memory (work_mem). Filtering in HAVING forces the engine to group and aggregate millions of rows first, only to throw them away at the very end."
      },
      {
        "question": "Can you use a column in the HAVING clause that is NOT present in the SELECT projection list?",
        "answer": "Yes! You can filter on any aggregate function in HAVING even if it is not selected: SELECT department, COUNT(*) FROM employees GROUP BY department HAVING AVG(salary) > 80000; The engine computes AVG(salary) internally during aggregation, evaluates the boolean filter, and then drops the metric from the final projected output."
      },
      {
        "question": "Can HAVING be used without a GROUP BY clause in SQL?",
        "answer": "Yes! When HAVING is used without GROUP BY, the entire table is treated as a single implicit group: SELECT COUNT(*) FROM orders HAVING COUNT(*) > 1000; If the condition is met, it returns the count; if not, it returns zero rows."
      },
      {
        "question": "What is the logical execution order relationship between WHERE, GROUP BY, and HAVING?",
        "answer": "1. WHERE filters individual candidate rows from the source table. 2. GROUP BY partitions the remaining rows into distinct hash buckets. 3. Aggregates compute metrics per bucket. 4. HAVING filters the completed group summary rows. Any group failing HAVING is discarded from the result pipeline."
      },
      {
        "question": "Can you filter on window functions inside a HAVING clause?",
        "answer": "No. Window functions (e.g. ROW_NUMBER(), RANK()) are evaluated at Step 5.5 (during or right after SELECT), which occurs AFTER the HAVING clause (Step 4). To filter on a window function result, you must wrap the query in a Common Table Expression (CTE) or derived table subquery."
      }
    ],
    "interviewReadyAnswer": "WHERE filters rows before grouping, while HAVING filters groups after aggregation. To maximize database performance, always filter raw rows in the WHERE clause as early as possible and reserve HAVING exclusively for aggregate calculations.",
    "quickTest": {
      "question": "Which of the following queries correctly filters for departments where average salary exceeds 80,000?",
      "options": [
        {
          "key": "A",
          "text": "SELECT dept, AVG(salary) FROM emp WHERE AVG(salary) > 80000 GROUP BY dept;"
        },
        {
          "key": "B",
          "text": "SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) > 80000;"
        },
        {
          "key": "C",
          "text": "SELECT dept, AVG(salary) FROM emp HAVING dept = \"IT\";"
        },
        {
          "key": "D",
          "text": "SELECT dept FROM emp WHERE salary > 80000;"
        }
      ],
      "correctAnswer": "B",
      "explanation": "Aggregate functions cannot appear in WHERE; they must be evaluated in the HAVING clause after grouping."
    },
    "mentalModel": "Team Tournament: WHERE eliminates individual players who do not have a uniform; HAVING eliminates entire teams whose combined score is below 100 points.",
    "codeSnippet": "SELECT customer_id, COUNT(id) AS total_orders, SUM(amount) AS total_spend\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(id) >= 10 AND SUM(amount) > 1000;",
    "takeaways": [
      "WHERE filters rows before GROUP BY; HAVING filters after.",
      "Aggregate functions cannot appear in WHERE.",
      "Always push non-aggregate filters into WHERE to minimize memory."
    ],
    "commonPitfall": {
      "mistake": "Putting plain column filters into HAVING (e.g. HAVING dept = \"IT\"), which forces the database to group the entire table first.",
      "fix": "Move the filter to WHERE: WHERE dept = \"IT\"."
    },
    "nextTopicId": "string-functions",
    "prevTopicId": "group-by-grouping"
  },
  {
    "id": "string-functions",
    "topicNumber": 22,
    "title": "String Functions",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Text manipulation: CONCAT, SUBSTRING, LENGTH, TRIM, REPLACE, UPPER/LOWER, and regular expression matching.",
    "definition": "SQL string functions manipulate, clean, extract, and format text data stored in CHAR, VARCHAR, or TEXT columns.",
    "eli5": "String functions are text tools like scissors (SUBSTRING), glue (CONCAT), an eraser (TRIM), or a dictionary search-and-replace.",
    "realWorldExample": {
      "description": "Sanitizing user-submitted phone numbers and emails before rendering or storage.",
      "tables": [
        {
          "title": "Input vs Output",
          "headers": [
            "Raw Input",
            "Function",
            "Cleaned Output"
          ],
          "rows": [
            [
              "  Lucky@Gmail.com  ",
              "LOWER(TRIM(...))",
              "lucky@gmail.com"
            ],
            [
              "(555) 123-4567",
              "REPLACE(REPLACE(...))",
              "5551234567"
            ]
          ]
        }
      ],
      "explanation": "String functions ensure canonical format across user records."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Common text transformations",
        "code": "SELECT\n  LOWER(TRIM(email)) AS normalized_email,\n  CONCAT(first_name, ' ', last_name) AS full_name,\n  SUBSTRING(phone FROM 1 FOR 3) AS area_code,\n  LENGTH(password_hash) AS hash_length,\n  REPLACE(description, 'bad', 'good') AS clean_desc\nFROM users;"
      }
    ],
    "rulesTable": [
      {
        "rule": "1-Based Indexing",
        "explanation": "In SQL (unlike C or Python), SUBSTRING positions are 1-based: SUBSTRING(\"hello\", 1, 2) returns \"he\"."
      },
      {
        "rule": "NULL Handling",
        "explanation": "TRIM(NULL), UPPER(NULL), and SUBSTRING(NULL) all return NULL."
      },
      {
        "rule": "Multi-byte Characters",
        "explanation": "LENGTH() counts characters, while OCTET_LENGTH() counts physical bytes (UTF-8)."
      },
      {
        "rule": "Character vs Byte length",
        "explanation": "LENGTH() counts UTF-8 characters; OCTET_LENGTH() counts actual bytes consumed on disk."
      },
      {
        "rule": "Functional index on string transforms",
        "explanation": "Using UPPER(email) or LOWER(name) requires an expression index to prevent full table scans."
      }
    ],
    "deepDive": {
      "title": "Expression Indexes for Case-Insensitive Queries",
      "description": "Using LOWER(email) in a WHERE clause prevents the engine from using a normal index on email. Creating an expression index solves this completely.",
      "codeSnippet": "-- Create expression index on normalized text:\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\n\n-- Now this uses an Index Scan:\nSELECT * FROM users WHERE LOWER(email) = 'lucky@example.com';",
      "warning": "Without an expression index, querying on functions forces a full table scan."
    },
    "advantages": [
      "Transforms data on the fly directly inside the database.",
      "Enables data standardization and cleaning during ingestion."
    ],
    "disadvantages": [
      "Overusing string manipulation functions in WHERE without expression indexes disables B-Trees."
    ],
    "interviewQuestions": [
      {
        "question": "What is the difference between LENGTH() and OCTET_LENGTH() in SQL?",
        "answer": "LENGTH(str) returns the count of unicode characters (characters seen by human eyes). OCTET_LENGTH(str) returns the exact number of bytes used to store the string in memory or disk. For multi-byte characters (like emojis or non-Latin alphabets), LENGTH('🚀') is 1, while OCTET_LENGTH('🚀') is 4 bytes. In network protocols and buffer allocations, always use OCTET_LENGTH."
      },
      {
        "question": "What is the difference between CONCAT() and the standard || operator regarding NULL handling?",
        "answer": "In standard ANSI SQL, the concatenation operator (||) follows Three-Valued Logic: if ANY operand is NULL, the entire result becomes NULL ('Hello ' || NULL yields NULL). The CONCAT() function in PostgreSQL and MySQL treats NULL as an empty string, safely joining remaining strings without returning NULL."
      },
      {
        "question": "How do you perform regex pattern matching and replacement in PostgreSQL?",
        "answer": "PostgreSQL provides POSIX regular expression operators: ~ (case-sensitive match), ~* (case-insensitive match), !~ (does not match), and REGEXP_REPLACE(source, pattern, replacement, flags). For example, REGEXP_REPLACE(phone, '[^0-9]', '', 'g') strips all non-numeric characters from a phone number."
      },
      {
        "question": "Why does SUBSTRING indexing require an Expression Index?",
        "answer": "If a query filters with WHERE SUBSTRING(account_number, 1, 4) = 'ACCT', a standard B-Tree index on account_number cannot be used because the B-Tree keys store the entire string. To achieve fast index seeks, you must create a functional expression index: CREATE INDEX idx_acc_prefix ON accounts ((SUBSTRING(account_number, 1, 4)));"
      },
      {
        "question": "What is the difference between TRIM, LTRIM, and RTRIM?",
        "answer": "TRIM removes specified characters (defaulting to whitespace) from both the leading and trailing ends of a string. LTRIM removes whitespace only from the left (leading) end. RTRIM removes whitespace only from the right (trailing) end. Modern ANSI SQL also supports TRIM(LEADING '0' FROM code)."
      }
    ],
    "interviewReadyAnswer": "SQL provides standard text functions like CONCAT, SUBSTRING, TRIM, and REPLACE. String indexes are 1-based, and when string transformations are used in WHERE predicates, expression indexes are required to preserve logarithmic B-Tree lookups.",
    "quickTest": {
      "question": "What does SUBSTRING('CSCosmos', 1, 2) return in standard SQL?",
      "options": [
        {
          "key": "A",
          "text": "'C'"
        },
        {
          "key": "B",
          "text": "'CS'"
        },
        {
          "key": "C",
          "text": "'SC'"
        },
        {
          "key": "D",
          "text": "'S'"
        }
      ],
      "correctAnswer": "B",
      "explanation": "SQL strings are 1-based. Starting at position 1 for a length of 2 characters yields \"CS\"."
    },
    "mentalModel": "Word processor toolbar: Cut, paste, uppercase, trim spaces, and find-replace.",
    "codeSnippet": "SELECT CONCAT_WS(', ', city, state, country) AS location\nFROM addresses;",
    "takeaways": [
      "SQL string functions use 1-based indexing.",
      "Use CONCAT or CONCAT_WS to avoid NULL drops.",
      "Create expression indexes for functions used in WHERE filters."
    ],
    "commonPitfall": {
      "mistake": "Writing SUBSTRING(str, 0, 2) assuming 0-based indexing like JavaScript or Python.",
      "fix": "Start at position 1 in SQL: SUBSTRING(str, 1, 2)."
    },
    "nextTopicId": "date-functions",
    "prevTopicId": "having-clause"
  },
  {
    "id": "date-functions",
    "topicNumber": 23,
    "title": "Date & Time Functions",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "NOW, CURRENT_DATE, EXTRACT, DATE_TRUNC, INTERVAL math, and UTC timestamp best practices.",
    "definition": "SQL date and time functions handle temporal calculations, timezone conversions, period truncations, and date arithmetic.",
    "eli5": "Date functions are a calendar and clock inside your database: they tell you what time it is, add 7 days to an expiration date, or tell you what day of the week it was.",
    "realWorldExample": {
      "description": "A subscription billing engine calculating expiration dates and monthly revenue aggregates.",
      "tables": [
        {
          "title": "Subscription Math",
          "headers": [
            "started_at",
            "Interval",
            "expires_at"
          ],
          "rows": [
            [
              "2026-01-15 10:00:00",
              "INTERVAL '30 days'",
              "2026-02-14 10:00:00"
            ]
          ]
        }
      ],
      "explanation": "started_at + INTERVAL '30 days' computes the exact renewal date."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Current timestamps and interval arithmetic",
        "code": "SELECT\n  CURRENT_DATE AS today,\n  CURRENT_TIMESTAMP AS now_utc,\n  CURRENT_TIMESTAMP + INTERVAL '7 days' AS one_week_later,\n  CURRENT_TIMESTAMP - INTERVAL '1 month' AS last_month;"
      },
      {
        "step": "Step 2: Grouping by time bucket with DATE_TRUNC (PostgreSQL)",
        "code": "SELECT\n  DATE_TRUNC('month', created_at) AS month_bucket,\n  COUNT(*) AS signups\nFROM users\nGROUP BY month_bucket\nORDER BY month_bucket;",
        "note": "DATE_TRUNC collapses timestamps into clean time buckets (hour, day, week, month)."
      },
      {
        "step": "Step 3: Extracting specific date parts",
        "code": "SELECT EXTRACT(DOW FROM created_at) AS day_of_week FROM orders;",
        "note": "Extracts numeric year, month, day, hour, or day of week (0 = Sunday)."
      }
    ],
    "rulesTable": [
      {
        "rule": "TIMESTAMPTZ Always",
        "explanation": "Always use TIMESTAMPTZ (timestamp with time zone) in PostgreSQL to store normalized UTC timestamps."
      },
      {
        "rule": "NOW() Transaction Stability",
        "explanation": "In PostgreSQL, NOW() returns the start timestamp of the current transaction and does not change between statements in the same transaction."
      },
      {
        "rule": "CLOCK_TIMESTAMP()",
        "explanation": "If you need the true wall-clock time as a statement executes, use CLOCK_TIMESTAMP()."
      },
      {
        "rule": "TIMESTAMP vs TIMESTAMPTZ",
        "explanation": "TIMESTAMPTZ stores timestamps in UTC on disk and converts to client timezone; TIMESTAMP ignores timezones."
      },
      {
        "rule": "Index-friendly date truncation",
        "explanation": "Avoid DATE_TRUNC in WHERE clauses; use half-open range queries on raw timestamp columns."
      }
    ],
    "deepDive": {
      "title": "Timestamp with Time Zone (TIMESTAMPTZ) Storage Reality",
      "description": "A common misconception is that TIMESTAMPTZ stores a string like \"2026-01-01+05:30\". In reality, PostgreSQL converts all incoming timestamps to UTC and stores them as an 8-byte integer representing microseconds since 2000-01-01 UTC.",
      "codeSnippet": "-- Always use TIMESTAMPTZ for distributed systems:\nCREATE TABLE audit_trail (\n  id BIGINT PRIMARY KEY,\n  occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP\n);",
      "warning": "Never use plain TIMESTAMP (without time zone) for financial or global web applications."
    },
    "advantages": [
      "Native timezone math eliminates client-side timezone calculation bugs.",
      "DATE_TRUNC simplifies time-series analytics."
    ],
    "disadvantages": [
      "Daylight savings transitions can complicate interval calculations across borders."
    ],
    "interviewQuestions": [
      {
        "question": "What is the critical difference between TIMESTAMP WITHOUT TIME ZONE and TIMESTAMPTZ in PostgreSQL?",
        "answer": "TIMESTAMPTZ converts incoming timestamps to UTC and stores them as an 8-byte UTC integer on disk. When read, it converts UTC to the client session’s local timezone. TIMESTAMP WITHOUT TIME ZONE stores the raw literal numbers without timezone metadata, making it impossible to determine when events actually occurred across distributed servers. Production distributed systems should ALWAYS use TIMESTAMPTZ."
      },
      {
        "question": "Why is \"WHERE DATE_TRUNC('day', created_at) = '2026-01-01'\" a performance bug, and how do you fix it?",
        "answer": "Wrapping created_at in DATE_TRUNC() destroys SARGability: the engine must execute the DATE_TRUNC function for every single row in the table, preventing any B-Tree index on created_at from being used. The correct index-friendly pattern is a half-open interval on the raw column: WHERE created_at >= '2026-01-01 00:00:00+00' AND created_at < '2026-01-02 00:00:00+00'."
      },
      {
        "question": "How does interval arithmetic work in SQL and how do you calculate time differences?",
        "answer": "Relational engines support INTERVAL types. You can add or subtract durations directly: NOW() - INTERVAL '30 days'. Subtracting two timestamps (ts2 - ts1) yields an INTERVAL representing exact days, hours, minutes, and seconds. EXTRACT(EPOCH FROM (ts2 - ts1)) converts the duration into total seconds as a floating-point number."
      },
      {
        "question": "What is the difference between NOW(), CURRENT_TIMESTAMP, and CLOCK_TIMESTAMP() in PostgreSQL?",
        "answer": "NOW() and CURRENT_TIMESTAMP return the start time of the CURRENT TRANSACTION and remain frozen throughout the transaction (ensuring all rows written by one transaction share an identical timestamp). CLOCK_TIMESTAMP() returns the actual real-world wall-clock time at the exact microsecond the function is executed."
      },
      {
        "question": "How do you handle Daylight Saving Time (DST) edge cases in SQL?",
        "answer": "DST transitions create ambiguity: an hour can be repeated (fall back) or skipped (spring forward). By storing all timestamps as UTC using TIMESTAMPTZ, internal math is strictly monotonic (zero leap hours or skipped hours). Local conversion only happens during presentation at the application edge using AT TIME ZONE 'America/New_York'."
      }
    ],
    "interviewReadyAnswer": "SQL provides robust date and time manipulation through INTERVAL arithmetic, EXTRACT, and DATE_TRUNC. In production, always use TIMESTAMPTZ to normalize records to UTC and prevent timezone drift.",
    "quickTest": {
      "question": "In PostgreSQL, what does DATE_TRUNC('month', TIMESTAMP '2026-04-18 14:32:00') return?",
      "options": [
        {
          "key": "A",
          "text": "'2026-04-01 00:00:00'"
        },
        {
          "key": "B",
          "text": "'2026-04-30 23:59:59'"
        },
        {
          "key": "C",
          "text": "'2026-04-18 00:00:00'"
        },
        {
          "key": "D",
          "text": "'2026-01-01 00:00:00'"
        }
      ],
      "correctAnswer": "A",
      "explanation": "DATE_TRUNC resets all components smaller than the specified unit (month) to their baseline, yielding the first day of that month at 00:00:00."
    },
    "mentalModel": "Digital Clock and Calendar: Adding an interval moves the hands forward; DATE_TRUNC snaps the clock back to the start of the current period.",
    "codeSnippet": "SELECT DATE_TRUNC('day', created_at) AS day, COUNT(*) AS daily_sales\nFROM orders\nWHERE created_at >= NOW() - INTERVAL '30 days'\nGROUP BY day\nORDER BY day;",
    "takeaways": [
      "Always store timestamps as TIMESTAMPTZ (normalized to UTC).",
      "Use INTERVAL for safe date arithmetic.",
      "DATE_TRUNC creates clean time-series buckets for GROUP BY."
    ],
    "commonPitfall": {
      "mistake": "Using naive TIMESTAMP without time zone and having timestamps drift when daylight savings occurs.",
      "fix": "Use TIMESTAMPTZ for all physical timestamps."
    },
    "nextTopicId": "numeric-functions",
    "prevTopicId": "string-functions"
  },
  {
    "id": "numeric-functions",
    "topicNumber": 24,
    "title": "Numeric Functions",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Mathematical operations: ROUND, CEIL, FLOOR, ABS, MOD, and floating-point vs exact numeric precision.",
    "definition": "SQL numeric functions perform mathematical computations, rounding, truncation, and absolute value evaluations on integer and decimal columns.",
    "eli5": "Numeric functions are the buttons on a scientific calculator: rounding money to 2 decimals, rounding up with ceiling, or getting positive numbers with absolute value.",
    "realWorldExample": {
      "description": "Calculating payment splits, fee rounding, and inventory batch distributions.",
      "tables": [
        {
          "title": "Price Calculations",
          "headers": [
            "Raw Price",
            "ROUND(..., 2)",
            "CEIL(...)",
            "FLOOR(...)"
          ],
          "rows": [
            [
              "45.678",
              "45.68",
              "46",
              "45"
            ],
            [
              "10.121",
              "10.12",
              "11",
              "10"
            ]
          ]
        }
      ],
      "explanation": "ROUND rounds to the nearest decimal; CEIL always rounds up; FLOOR always rounds down."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Rounding and ceiling functions",
        "code": "SELECT\n  ROUND(125.4567, 2) AS rounded_cents,  -- 125.46\n  CEIL(4.01) AS ceiling_val,           -- 5\n  FLOOR(4.99) AS floor_val,            -- 4\n  ABS(-50.00) AS absolute_balance,     -- 50.00\n  MOD(10, 3) AS remainder;             -- 1"
      }
    ],
    "rulesTable": [
      {
        "rule": "ROUND Precision",
        "explanation": "ROUND(num, s) rounds to s decimal places. Omission of s defaults to 0 decimal places."
      },
      {
        "rule": "CEIL vs FLOOR",
        "explanation": "CEIL rounds towards positive infinity; FLOOR rounds towards negative infinity."
      },
      {
        "rule": "NUMERIC Exactness",
        "explanation": "NUMERIC/DECIMAL provides arbitrary precision; FLOAT/REAL introduces floating point inaccuracy."
      },
      {
        "rule": "Exact vs Approximate numeric precision",
        "explanation": "NUMERIC/DECIMAL provides exact arbitrary precision; FLOAT/REAL has binary rounding errors."
      },
      {
        "rule": "Rounding semantics (ROUND vs TRUNC)",
        "explanation": "ROUND rounds to the nearest integer; TRUNC truncates towards zero without rounding."
      }
    ],
    "deepDive": {
      "title": "Floating Point Rounding Disasters in Financial Systems",
      "description": "Storing money using FLOAT or DOUBLE causes binary IEEE 754 precision loss where 0.1 + 0.2 = 0.30000000000000004. In production banking schemas, ALWAYS use NUMERIC(12, 2) or store integer cents.",
      "codeSnippet": "-- WRONG (FLOAT causes financial drift):\nCREATE TABLE bad_ledger ( balance FLOAT );\n\n-- CORRECT (Exact decimal representation):\nCREATE TABLE good_ledger ( balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00 );",
      "warning": "Never use FLOAT for financial currency balances or accounting books."
    },
    "advantages": [
      "Executes mathematical transformations close to the data.",
      "Guarantees uniform rounding across all API consumers."
    ],
    "disadvantages": [
      "Complex trigonometric calculations in SQL consume high database CPU."
    ],
    "interviewQuestions": [
      {
        "question": "Why should financial and monetary calculations NEVER use FLOAT or DOUBLE PRECISION in SQL?",
        "answer": "FLOAT and DOUBLE PRECISION use IEEE 754 binary floating-point representation, which cannot accurately represent common base-10 decimals like 0.1 or 0.01 (e.g. 0.1 + 0.2 = 0.30000000000000004). Over millions of financial transactions, accumulated rounding errors cause ledger imbalances. Financial systems must ALWAYS use NUMERIC(precision, scale) or DECIMAL, which store exact base-10 digits."
      },
      {
        "question": "What is the difference between CEIL, FLOOR, ROUND, and TRUNC?",
        "answer": "CEIL(x) rounds UP to the nearest integer (CEIL(4.1) = 5). FLOOR(x) rounds DOWN to the nearest integer (FLOOR(4.9) = 4). ROUND(x) rounds to the nearest integer (ROUND(4.5) = 5). TRUNC(x) simply discards fractional digits towards zero (TRUNC(4.9) = 4, TRUNC(-4.9) = -4)."
      },
      {
        "question": "What does NUMERIC(10, 2) mean in relational schema design?",
        "answer": "Precision (10) is the total number of significant digits in the number, both left and right of the decimal point. Scale (2) is the number of digits to the right of the decimal point. Therefore, NUMERIC(10, 2) can store numbers from -99,999,999.99 to +99,999,999.99. Inserting a number with more than 8 digits before the decimal point throws a numeric overflow error."
      },
      {
        "question": "How does modulus (%) behave with negative numbers in SQL?",
        "answer": "In SQL (and PostgreSQL), MOD(n, m) returns the remainder of n / m. The sign of the result matches the sign of the dividend (n): MOD(-7, 3) returns -1, whereas in Python (-7 % 3) returns 2. In cross-platform applications, always wrap negative modulus math in ABS() if positive remainders are expected."
      },
      {
        "question": "What is Banker’s Rounding (Round to Even) and how does SQL handle midpoint rounding?",
        "answer": "Standard math rounds midpoints (0.5) up. Banker’s Rounding rounds midpoints to the nearest EVEN number (2.5 -> 2, 3.5 -> 4) to eliminate statistical positive bias in large financial datasets. Standard SQL ROUND() typically rounds half-away-from-zero (4.5 -> 5, -4.5 -> -5), but floating-point casts can trigger IEEE round-to-even behavior."
      }
    ],
    "interviewReadyAnswer": "SQL provides built-in numeric functions like ROUND, CEIL, FLOOR, and MOD. For financial applications, storing amounts in NUMERIC guarantees exact precision and eliminates floating-point rounding discrepancies.",
    "quickTest": {
      "question": "What does CEIL(8.1) evaluate to in SQL?",
      "options": [
        {
          "key": "A",
          "text": "8"
        },
        {
          "key": "B",
          "text": "9"
        },
        {
          "key": "C",
          "text": "8.1"
        },
        {
          "key": "D",
          "text": "NULL"
        }
      ],
      "correctAnswer": "B",
      "explanation": "CEIL always rounds up to the next nearest integer, so 8.1 rounds up to 9."
    },
    "mentalModel": "Bank cash drawer: Rounding ensures pennies are distributed accurately without lost fractions.",
    "codeSnippet": "SELECT item_id, price, ROUND(price * 0.95, 2) AS discounted_price\nFROM inventory;",
    "takeaways": [
      "Use ROUND(val, 2) to format decimal currency.",
      "CEIL rounds up; FLOOR rounds down.",
      "Always use NUMERIC/DECIMAL for financial data, never FLOAT."
    ],
    "commonPitfall": {
      "mistake": "Using FLOAT for money and having automated reconciliation scripts report a $0.01 mismatch.",
      "fix": "Use NUMERIC(12, 2) or integer cents."
    },
    "nextTopicId": "type-conversion",
    "prevTopicId": "date-functions"
  },
  {
    "id": "type-conversion",
    "topicNumber": 25,
    "title": "Type Conversion",
    "category": "foundations",
    "difficulty": "Intermediate",
    "summary": "CAST, PostgreSQL :: shorthand, implicit vs explicit coercion, and avoiding type conversion performance traps.",
    "definition": "Type conversion translates a value from one data type to another, either explicitly via CAST() or implicitly by the query engine during evaluation.",
    "eli5": "Type conversion is an electrical adapter: turning a string of text containing digits \"123\" into a real number 123 so you can do math with it.",
    "realWorldExample": {
      "description": "Parsing JSON string numbers or converting dates to human-readable timestamps.",
      "tables": [
        {
          "title": "Type Casting",
          "headers": [
            "Input Text",
            "Target Type",
            "Result"
          ],
          "rows": [
            [
              "'2026-01-01'",
              "DATE",
              "2026-01-01"
            ],
            [
              "'42.50'",
              "NUMERIC(5,2)",
              "42.50"
            ]
          ]
        }
      ],
      "explanation": "Explicit CAST ensures mathematical and relational operators work as intended."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Standard ANSI CAST syntax",
        "code": "SELECT CAST('2026-01-01' AS DATE), CAST(100 AS VARCHAR(10));",
        "note": "Universal syntax supported by all SQL engines."
      },
      {
        "step": "Step 2: PostgreSQL shorthand double-colon (::)",
        "code": "SELECT '123'::INT + 5 AS total, '{\"key\": \"value\"}'::JSONB AS payload;",
        "note": "Concise and idiomatic in PostgreSQL."
      }
    ],
    "rulesTable": [
      {
        "rule": "ANSI Standard",
        "explanation": "CAST(expression AS target_type) is the universal ANSI SQL standard."
      },
      {
        "rule": "Failed Coercion Error",
        "explanation": "Attempting to cast invalid text (e.g. 'abc'::INT) aborts the transaction with a runtime error."
      },
      {
        "rule": "Index Invalidation on Implicit Cast",
        "explanation": "If a column is VARCHAR and you compare col = 123, the engine may implicitly cast col to INT, invalidating the B-Tree index!"
      },
      {
        "rule": "Implicit cast index invalidation",
        "explanation": "Comparing a string column to an integer literal can trigger implicit casting that disables B-Tree index seeks."
      },
      {
        "rule": "Safe casting with error handling",
        "explanation": "Use TRY_CAST or regex checks to prevent queries from aborting on invalid string format conversions."
      }
    ],
    "deepDive": {
      "title": "The Silent Index-Killer: Implicit Type Coercion",
      "description": "When you compare an indexed VARCHAR column against an integer literal (WHERE phone = 9876543210), SQL engines coerce the table column to an integer: WHERE CAST(phone AS INT) = 9876543210. This wraps the column in a function and forces a full table scan!",
      "codeSnippet": "-- SLOW FULL TABLE SCAN (Implicit coercion invalidates index):\nWHERE phone_varchar = 9876543210;\n\n-- FAST B-TREE INDEX SEEK (Types match exactly):\nWHERE phone_varchar = '9876543210';",
      "warning": "Always match literal data types in your application code with table schema types."
    },
    "advantages": [
      "Enables dynamic data transformation.",
      "Resolves data type mismatches between client applications and schemas."
    ],
    "disadvantages": [
      "Implicit type conversion in WHERE clauses destroys query performance."
    ],
    "interviewQuestions": [
      {
        "question": "Why can comparing an indexed VARCHAR column to an integer literal cause a full table scan?",
        "answer": "In SQL type coercion rules, integers have higher precedence than strings. If phone_number is VARCHAR and the query executes WHERE phone_number = 123456, the database engine must implicitly convert the string column to an integer: WHERE CAST(phone_number AS INT) = 123456. Because the column is wrapped in an implicit cast function, the B-Tree index is disabled, forcing a full table scan!"
      },
      {
        "question": "What is the difference between standard ANSI CAST() and PostgreSQL :: shorthand?",
        "answer": "Standard SQL uses CAST(expression AS type): CAST('123' AS INTEGER). PostgreSQL provides the concise :: operator shorthand: '123'::INTEGER. They are functionally identical under the hood, but CAST() is 100% portable across MySQL, Oracle, SQL Server, and SQLite, while :: is PostgreSQL-specific."
      },
      {
        "question": "What is the difference between Implicit and Explicit Type Coercion?",
        "answer": "Implicit coercion happens automatically behind the scenes (e.g. adding INT to FLOAT promotes the INT to FLOAT). Explicit coercion is specified directly by the developer using CAST() or ::. Relying on implicit coercion in WHERE clauses or JOIN conditions is dangerous because it often silently invalidates indexes or causes unexpected precision loss."
      },
      {
        "question": "How do you safely cast strings to numbers without throwing fatal query errors on malformed data?",
        "answer": "In standard databases, casting 'abc' to INT throws a fatal runtime exception that aborts the entire transaction. PostgreSQL provides regular expression validation or custom functions (SELECT CASE WHEN val ~ '^\\d+$' THEN val::INT END). Engines like Snowflake, BigQuery, and SQL Server provide TRY_CAST(val AS INT), which returns NULL instead of throwing an error."
      },
      {
        "question": "How does JSONB type casting work in PostgreSQL?",
        "answer": "PostgreSQL provides specialized JSON operators: -> extracts a JSON object or array element (preserving JSON type), ->> extracts a JSON element as text, and #> extracts nested paths. Once extracted as text with ->>, it can be cast directly to relational types: (user_data->>'age')::INT."
      }
    ],
    "interviewReadyAnswer": "Type conversion translates data types using ANSI CAST or PostgreSQL :: shorthand. Developers must be careful with implicit type coercion in WHERE clauses, as mismatched types can prevent B-Tree index utilization and force full table scans.",
    "quickTest": {
      "question": "Which query uses standard ANSI SQL syntax to convert a string to an integer?",
      "options": [
        {
          "key": "A",
          "text": "CONVERT_TO('100', INT)"
        },
        {
          "key": "B",
          "text": "CAST('100' AS INT)"
        },
        {
          "key": "C",
          "text": "PARSE_INT('100')"
        },
        {
          "key": "D",
          "text": "MAKE_INT('100')"
        }
      ],
      "correctAnswer": "B",
      "explanation": "CAST(expression AS type) is the ANSI SQL standard for explicit type casting."
    },
    "mentalModel": "Plug adapter: Adapting an American plug to a European outlet so power flows seamlessly.",
    "codeSnippet": "SELECT id, CAST(total_cents AS NUMERIC) / 100 AS total_usd\nFROM orders;",
    "takeaways": [
      "Use CAST(x AS type) for ANSI standard type conversion.",
      "Postgres supports the convenient :: shorthand (e.g. \"val\"::int).",
      "Ensure query parameters match column types to avoid index invalidation."
    ],
    "commonPitfall": {
      "mistake": "Passing integer IDs into string/UUID columns in application queries, causing full table scans.",
      "fix": "Pass string parameters to match string/UUID columns in schemas."
    },
    "nextTopicId": "primary-key",
    "prevTopicId": "numeric-functions"
  },
  {
    "id": "primary-key",
    "topicNumber": 26,
    "title": "Primary Key",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "Row uniqueness, NOT NULL enforcement, candidate keys, surrogate vs natural keys, and clustered index implications.",
    "definition": "A Primary Key (PK) is a column (or minimal set of columns) that uniquely identifies each row in a table. It strictly enforces uniqueness and forbids NULL values.",
    "eli5": "A Primary Key is like your Citizen National ID or Passport Number: no two citizens can share the same number, and everyone is required to have one.",
    "realWorldExample": {
      "description": "An employee directory where every employee is identified by a unique auto-incrementing ID.",
      "tables": [
        {
          "title": "Employees Table",
          "headers": [
            "id (PK)",
            "email",
            "name"
          ],
          "rows": [
            [
              1,
              "lucky@company.com",
              "Lucky"
            ],
            [
              2,
              "rahul@company.com",
              "Rahul"
            ]
          ]
        }
      ],
      "explanation": "The primary key guarantees that employee #1 is completely unique across the entire organization."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Single-column Identity Primary Key",
        "code": "CREATE TABLE users (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email VARCHAR(255) NOT NULL UNIQUE\n);",
        "note": "Automatically creates a unique B-Tree index on id."
      },
      {
        "step": "Step 2: Composite Primary Key for Junction Tables",
        "code": "CREATE TABLE student_courses (\n  student_id INT REFERENCES students(id),\n  course_id INT REFERENCES courses(id),\n  enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE,\n  PRIMARY KEY (student_id, course_id)\n);",
        "note": "Ensures a student cannot enroll in the exact same course twice."
      }
    ],
    "rulesTable": [
      {
        "rule": "Uniqueness Invariant",
        "explanation": "No two rows can have the same primary key value."
      },
      {
        "rule": "NOT NULL Required",
        "explanation": "Primary key columns cannot contain NULL values."
      },
      {
        "rule": "One PK Per Table",
        "explanation": "A table can have exactly one primary key constraint (though it may span multiple columns)."
      },
      {
        "rule": "Clustered vs Non-clustered primary key",
        "explanation": "MySQL InnoDB physically orders heap rows inside the PK B-Tree; PostgreSQL uses non-clustered heap tables."
      },
      {
        "rule": "UUID page split hazard",
        "explanation": "Random UUIDv4 primary keys cause catastrophic B-Tree page splits; use ordered UUIDv7 or BIGINT."
      }
    ],
    "deepDive": {
      "title": "Surrogate Keys vs Natural Keys",
      "description": "A Natural Key is real-world data that is unique (like an email address or SSN). A Surrogate Key is an artificial system-generated identifier (like BIGINT IDENTITY or UUIDv7). Surrogate keys insulate database schemas from business identity changes (e.g. a user changing their email address).",
      "codeSnippet": "-- Preferred Surrogate Key pattern:\nCREATE TABLE customers (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Surrogate\n  tax_id VARCHAR(50) UNIQUE NOT NULL                  -- Natural candidate\n);",
      "warning": "Using mutable natural keys (like email) as primary keys causes painful foreign key cascades when values change."
    },
    "advantages": [
      "Guarantees entity integrity and row identification.",
      "Automatically creates a high-performance unique B-Tree index."
    ],
    "disadvantages": [
      "Composite primary keys with wide text columns consume excessive index space."
    ],
    "interviewQuestions": [
      {
        "question": "What is the architectural difference between a Surrogate Key and a Natural Key?",
        "answer": "A Natural Key is an existing attribute with real-world business meaning (e.g. SSN, VIN, email). A Surrogate Key is a meaningless system-generated identifier (e.g. auto-increment BIGINT or UUID). Natural keys can change due to business pivots, causing massive cascading foreign key update overhead. Surrogate keys are immutable, compact, and decouple internal relations from external business logic."
      },
      {
        "question": "Why are random UUIDv4 primary keys dangerous for write-heavy relational databases?",
        "answer": "UUIDv4 values are completely random. When new rows are inserted into a B-Tree primary key index, random keys insert into random leaf pages across disk. As tables grow larger than RAM, every insert causes a random disk I/O and triggers B-Tree page splits (splitting 8 KB pages in half, causing 50% storage fragmentation). Using time-ordered UUIDv7 or sequential BIGINT ensures append-only sequential writes to the rightmost leaf page."
      },
      {
        "question": "What is the physical difference between a Primary Key in PostgreSQL vs MySQL (InnoDB)?",
        "answer": "In MySQL InnoDB, the table IS the primary key (Clustered Index): heap rows are stored directly in the leaf pages of the primary key B+ Tree. In PostgreSQL, all tables are unordered heaps: the primary key is just an ordinary unique B-Tree index whose leaf nodes point to 6-byte physical disk tuple locations (CTID) in the separate heap file."
      },
      {
        "question": "Can a Primary Key consist of multiple columns (Composite Primary Key)?",
        "answer": "Yes. A Composite Primary Key combines multiple columns to enforce row uniqueness: PRIMARY KEY (order_id, item_id). Under the hood, the engine creates a composite B-Tree index on the combined columns. The Leftmost Prefix Rule applies: queries filtering on order_id use the index, but queries filtering on item_id alone cannot navigate the tree without a full scan."
      },
      {
        "question": "Can a table exist without a Primary Key in relational databases?",
        "answer": "Technically yes: SQL allows creating heap tables without a primary key. However, it is an extreme antipattern in production: 1. You cannot uniquely identify or update specific rows, 2. Logical replication tools (like Debezium or AWS DMS) fail without a replica identity key, 3. Foreign key referential integrity cannot reference the table."
      }
    ],
    "interviewReadyAnswer": "A Primary Key uniquely identifies rows in a table while enforcing NOT NULL. Best practice uses synthetic surrogate keys (such as BIGINT identity or sequential UUIDs) to protect foreign key relationships from mutable business attributes.",
    "quickTest": {
      "question": "Which of the following is TRUE about Primary Keys in SQL?",
      "options": [
        {
          "key": "A",
          "text": "A table can have multiple Primary Key constraints."
        },
        {
          "key": "B",
          "text": "Primary Key columns can store NULL values."
        },
        {
          "key": "C",
          "text": "A table can have only one Primary Key, and it strictly forbids NULL values."
        },
        {
          "key": "D",
          "text": "Primary Keys do not create an index."
        }
      ],
      "correctAnswer": "C",
      "explanation": "A table is permitted exactly one Primary Key, which mandates absolute uniqueness and forbids NULL values."
    },
    "mentalModel": "Passport Number: Uniquely identifies you worldwide and can never be empty.",
    "codeSnippet": "CREATE TABLE orders (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  customer_id INT NOT NULL\n);",
    "takeaways": [
      "A Primary Key uniquely identifies rows and forbids NULLs.",
      "A table can have only one Primary Key constraint.",
      "Prefer immutable surrogate keys over mutable natural keys."
    ],
    "commonPitfall": {
      "mistake": "Using a mutable natural key like email as the PK, causing widespread foreign key updates when a user changes their email.",
      "fix": "Use an identity surrogate integer/UUID as PK and place a UNIQUE constraint on email."
    },
    "nextTopicId": "foreign-key",
    "prevTopicId": "type-conversion"
  },
  {
    "id": "foreign-key",
    "topicNumber": 27,
    "title": "Foreign Key",
    "category": "foundations",
    "difficulty": "Intermediate",
    "summary": "Referential integrity, parent-child relationships, ON DELETE CASCADE, ON UPDATE actions, and foreign key indexing requirements.",
    "definition": "A Foreign Key is a column (or group of columns) in one table that references a primary key or unique key in another table, maintaining referential integrity between them.",
    "eli5": "Imagine a school: Every student belongs to a class. Each class has a unique ID. A student cannot be assigned to a class that doesn't exist. The student's class_id is a Foreign Key.",
    "realWorldExample": {
      "description": "We have two tables: Departments and Employees.",
      "tables": [
        {
          "title": "Departments",
          "headers": [
            "id (PK)",
            "name"
          ],
          "rows": [
            [
              1,
              "IT"
            ],
            [
              2,
              "HR"
            ]
          ]
        },
        {
          "title": "Employees",
          "headers": [
            "id (PK)",
            "name",
            "department_id (FK)"
          ],
          "rows": [
            [
              101,
              "Lucky",
              1
            ],
            [
              102,
              "Rahul",
              2
            ],
            [
              103,
              "Amit",
              1
            ]
          ]
        }
      ],
      "explanation": "Here departments.id is the Primary Key, and employees.department_id is the Foreign Key. The foreign key ensures an employee cannot reference a nonexistent department."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Create Departments table",
        "code": "CREATE TABLE departments (\n  id INT PRIMARY KEY,\n  name VARCHAR(100)\n);"
      },
      {
        "step": "Step 2: Create Employees with Foreign Key constraint",
        "code": "CREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  department_id INT,\n  FOREIGN KEY (department_id) REFERENCES departments(id)\n);"
      },
      {
        "step": "Step 3: Insert valid records",
        "code": "INSERT INTO departments VALUES (1, 'IT'), (2, 'HR');\nINSERT INTO employees VALUES (101, 'Lucky', 1), (102, 'Rahul', 2);"
      },
      {
        "step": "Step 4: Attempt invalid insertion",
        "code": "-- Fails with constraint violation!\nINSERT INTO employees VALUES (103, 'Amit', 99);\n-- ERROR: insert on table \"employees\" violates foreign key constraint",
        "note": "Department 99 does not exist, so the foreign key blocks the insertion."
      }
    ],
    "rulesTable": [
      {
        "rule": "Duplicate values",
        "explanation": "Allowed (multiple employees can reference the same department)."
      },
      {
        "rule": "NULL values",
        "explanation": "Allowed unless NOT NULL constraint is explicitly specified."
      },
      {
        "rule": "Multiple foreign keys",
        "explanation": "Allowed in one table (e.g. orders can reference users, coupons, and warehouses)."
      },
      {
        "rule": "Referenced value",
        "explanation": "Must exist in the parent table (unless the foreign key column is NULL)."
      },
      {
        "rule": "Delete parent",
        "explanation": "May be restricted (NO ACTION / RESTRICT) or trigger an automated cascading action."
      }
    ],
    "deepDive": {
      "title": "ON DELETE CASCADE Mechanics & Indexing",
      "description": "When you configure ON DELETE CASCADE, deleting a parent row automatically purges all child records referencing it. Be careful: CASCADE can delete thousands of related records. Furthermore, in PostgreSQL, foreign keys do NOT automatically create secondary indexes; you must manually index foreign key columns to prevent full table scans and lock contention during parent deletes.",
      "codeSnippet": "-- Manual index on foreign key column (MANDATORY for production):\nCREATE INDEX idx_employees_department_id ON employees(department_id);\n\n-- Cascade configuration:\nALTER TABLE employees\n  ADD CONSTRAINT fk_emp_dept\n  FOREIGN KEY (department_id) REFERENCES departments(id)\n  ON DELETE CASCADE;",
      "warning": "Deleting a parent row without an index on the child table's foreign key triggers a full table scan of the child table and acquires share locks."
    },
    "advantages": [
      "Prevents orphan records and invalid relationships.",
      "Maintains data integrity at the database storage engine layer.",
      "Supports automated lifecycle management via ON DELETE CASCADE / SET NULL."
    ],
    "disadvantages": [
      "Adds validation overhead during INSERT and UPDATE writes.",
      "Can complicate deletions and cause accidental cascaded data loss.",
      "Requires explicit index creation in PostgreSQL to prevent table lock bottlenecks."
    ],
    "interviewQuestions": [
      {
        "question": "Can a foreign key contain NULL values?",
        "answer": "Yes, unless restricted by a NOT NULL constraint. A NULL foreign key represents an optional or unassigned relationship."
      },
      {
        "question": "Can a foreign key contain duplicate values?",
        "answer": "Yes. Multiple child rows can reference the exact same parent row (e.g. multiple employees in the same department)."
      },
      {
        "question": "Does a foreign key automatically create an index in PostgreSQL?",
        "answer": "No. While primary keys automatically create unique B-Tree indexes, foreign key columns do not. Engineers must create them manually with CREATE INDEX."
      },
      {
        "question": "What is the difference between Primary Key and Foreign Key?",
        "answer": "A Primary Key uniquely identifies a row in its table and cannot be NULL. A Foreign Key references a key in another table, can contain duplicates, and can be NULL.",
        "comparisonTable": {
          "headers": [
            "Primary Key",
            "Foreign Key"
          ],
          "rows": [
            [
              "Uniquely identifies a row",
              "References a key in another table"
            ],
            [
              "Cannot be NULL",
              "Can be NULL"
            ],
            [
              "Must be unique",
              "Can have duplicates"
            ],
            [
              "One PK per table",
              "Multiple FKs per table allowed"
            ]
          ]
        }
      }
    ],
    "interviewReadyAnswer": "A foreign key is a constraint that establishes a relationship between two tables and ensures referential integrity. For example, in an employees table, department_id can reference the id column of the departments table, preventing employees from referencing departments that don't exist.",
    "quickTest": {
      "question": "We have Users (id 1, 2) and Orders (id 101 for user 1; id 102 for user 2). What happens if we execute \"DELETE FROM users WHERE id = 1;\" when orders.user_id is a foreign key referencing users.id with default NO ACTION behavior?",
      "options": [
        {
          "key": "A",
          "text": "User 1 is deleted automatically."
        },
        {
          "key": "B",
          "text": "User 1 and order 101 are deleted."
        },
        {
          "key": "C",
          "text": "An error occurs because order 101 references user 1."
        },
        {
          "key": "D",
          "text": "Only order 101 is deleted."
        }
      ],
      "correctAnswer": "C",
      "explanation": "Under default NO ACTION or RESTRICT, the database rejects the deletion of a parent row if dependent child records still exist."
    },
    "mentalModel": "Classroom roster: You cannot assign a student to room 99 if room 99 does not exist in the school building.",
    "codeSnippet": "CREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT\n);",
    "takeaways": [
      "Foreign keys enforce referential integrity between tables.",
      "Child rows can have duplicate and NULL foreign key values.",
      "Always manually index foreign key columns in PostgreSQL."
    ],
    "commonPitfall": {
      "mistake": "Forgetting to create a B-Tree index on foreign key columns, causing full table scans and heavy locking when deleting parent records.",
      "fix": "Always run: CREATE INDEX idx_child_fk ON child_table(parent_id);"
    },
    "nextTopicId": "constraints-integrity",
    "prevTopicId": "primary-key"
  },
  {
    "id": "constraints-integrity",
    "topicNumber": 28,
    "title": "Constraints & Invariants",
    "category": "foundations",
    "difficulty": "Beginner",
    "summary": "NOT NULL, UNIQUE, CHECK, DEFAULT constraints, domain validation, and database-level business rules.",
    "definition": "Constraints are database-level declarations that enforce data integrity rules on table columns, rejecting any INSERT or UPDATE that violates them.",
    "eli5": "Constraints are the security rules of a building: \"no entry without a badge\" (NOT NULL), \"every badge must be distinct\" (UNIQUE), and \"must be at least 18 years old\" (CHECK).",
    "realWorldExample": {
      "description": "A user profile table ensuring valid usernames, positive account balances, and verified status.",
      "tables": [
        {
          "title": "Accounts Constraints",
          "headers": [
            "Column",
            "Constraint",
            "Rule"
          ],
          "rows": [
            [
              "username",
              "UNIQUE NOT NULL",
              "Must exist and be unique"
            ],
            [
              "balance",
              "CHECK (balance >= 0)",
              "No negative balances"
            ],
            [
              "status",
              "DEFAULT 'active'",
              "Auto-defaults to active"
            ]
          ]
        }
      ],
      "explanation": "Constraints stop bad data at the database boundary before it reaches disk."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Adding CHECK and UNIQUE constraints",
        "code": "CREATE TABLE bank_accounts (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  account_number VARCHAR(20) UNIQUE NOT NULL,\n  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00\n    CONSTRAINT chk_positive_balance CHECK (balance >= 0.00),\n  account_type VARCHAR(10) NOT NULL\n    CHECK (account_type IN ('checking', 'savings', 'investment'))\n);"
      }
    ],
    "rulesTable": [
      {
        "rule": "NOT NULL",
        "explanation": "Prohibits NULL values in the specified column."
      },
      {
        "rule": "UNIQUE",
        "explanation": "Guarantees that all non-null values in the column are distinct."
      },
      {
        "rule": "CHECK",
        "explanation": "Validates arbitrary boolean conditions (e.g. price > 0)."
      },
      {
        "rule": "DEFAULT",
        "explanation": "Supplies a fallback value if omitted during INSERT."
      },
      {
        "rule": "Database-level vs App-level enforcement",
        "explanation": "Database constraints guarantee integrity across all services, scripts, and direct database updates."
      },
      {
        "rule": "Deferrable constraints for cyclic dependencies",
        "explanation": "DEFERRABLE INITIALLY DEFERRED constraints postpone integrity checks until transaction commit time."
      }
    ],
    "deepDive": {
      "title": "Database Constraints vs Application Validation",
      "description": "Application code validation is vulnerable to race conditions, multi-service bugs, and direct SQL script executions. Database-level constraints are ACID invariants enforced by the storage engine, making corrupted data physically impossible.",
      "codeSnippet": "-- Guaranteed invariant across all microservices:\nALTER TABLE users ADD CONSTRAINT chk_email_format\n  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$');",
      "warning": "Never rely solely on frontend or API validation for critical business rules like positive inventory or unique emails."
    },
    "advantages": [
      "Single source of truth for invariants.",
      "Prevents corrupted records regardless of which microservice writes the data."
    ],
    "disadvantages": [
      "Complex multi-table constraints require triggers or serialized transactions."
    ],
    "interviewQuestions": [
      {
        "question": "Why should business invariants be enforced via database constraints rather than only in application code?",
        "answer": "Application code is never the sole entry point to data: background worker jobs, direct SQL patches by DBAs, ETL data pipelines, and microservices all touch the database. If validation only exists in code, a bug or race condition in one service corrupts data permanently. Database constraints guarantee mathematical consistency regardless of how data enters the engine."
      },
      {
        "question": "What are Deferrable Constraints (DEFERRABLE INITIALLY DEFERRED) and when are they required?",
        "answer": "Normally, constraints are checked immediately after each SQL statement. If table A has an FK referencing table B, and table B has an FK referencing table A (a circular dependency), inserting into either table throws an FK violation! A deferrable constraint postpones validation until the transaction issues COMMIT, allowing both rows to be inserted before verification."
      },
      {
        "question": "Can a UNIQUE constraint contain multiple NULL values in SQL?",
        "answer": "Yes! In standard ANSI SQL and PostgreSQL, NULL is not equal to NULL (NULL != NULL). Therefore, multiple rows with NULL in a unique column do NOT violate the unique constraint. If you want a column to allow only one NULL value, you must enforce it with a unique partial index: CREATE UNIQUE INDEX idx ON tbl(col) WHERE col IS NOT NULL;"
      },
      {
        "question": "What is a CHECK constraint and what are its performance characteristics?",
        "answer": "A CHECK constraint evaluates a boolean expression on every INSERT and UPDATE: CHECK (price > 0 AND discount <= price). CHECK constraints evaluate in memory in nanoseconds before the tuple is written to the 8 KB page slot. If the condition evaluates to FALSE, the statement aborts. Note: if the expression evaluates to UNKNOWN (due to a NULL), the check constraint PASSES!"
      },
      {
        "question": "How do you add a NOT NULL or CHECK constraint to a table with 100,000,000 rows without locking it?",
        "answer": "Adding a constraint with standard ALTER TABLE acquires an AccessExclusiveLock and scans all 100M rows, locking out readers and writers for minutes. In PostgreSQL, you add the constraint with NOT VALID (instant metadata lock), and then run ALTER TABLE tbl VALIDATE CONSTRAINT name; which validates existing rows with only a weak ShareUpdateExclusiveLock that allows concurrent reads and writes!"
      }
    ],
    "interviewReadyAnswer": "Constraints enforce schema-level invariants including NOT NULL, UNIQUE, CHECK, and DEFAULT. Defining invariants at the database layer ensures data integrity cannot be bypassed by application-level race conditions or multi-service bugs.",
    "quickTest": {
      "question": "What happens if you execute: INSERT INTO bank_accounts (account_number, balance) VALUES ('A100', -50.00); when balance has CHECK (balance >= 0)?",
      "options": [
        {
          "key": "A",
          "text": "The balance is clamped to 0.00 automatically."
        },
        {
          "key": "B",
          "text": "The statement fails with a CHECK constraint violation error."
        },
        {
          "key": "C",
          "text": "The balance is saved as NULL."
        },
        {
          "key": "D",
          "text": "The row is saved with a warning."
        }
      ],
      "correctAnswer": "B",
      "explanation": "CHECK constraints evaluate row values on INSERT and UPDATE; if the expression evaluates to FALSE, the statement immediately aborts."
    },
    "mentalModel": "Security turnstile: Rejects anyone without a valid ticket or who doesn't meet height requirements.",
    "codeSnippet": "ALTER TABLE products ADD CONSTRAINT chk_price CHECK (price > 0.00);",
    "takeaways": [
      "Constraints guarantee ACID invariants at the storage level.",
      "CHECK constraints validate domain ranges and allowed strings.",
      "UNIQUE constraints allow multiple NULLs unless NOT NULL is added."
    ],
    "commonPitfall": {
      "mistake": "Relying exclusively on application validation and having duplicate records slip in under high-concurrency race conditions.",
      "fix": "Add a UNIQUE or CHECK constraint directly to the database table."
    },
    "nextTopicId": "inner-join",
    "prevTopicId": "foreign-key"
  },
  {
    "id": "inner-join",
    "topicNumber": 29,
    "title": "INNER JOIN",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Relational equi-joins, Cartesian product filtering, multi-table joins, and physical join operators (Nested Loop, Hash, Merge).",
    "definition": "An INNER JOIN matches and combines rows from two or more tables based on a join condition, returning only rows where the condition evaluates to TRUE in both tables.",
    "eli5": "Think of two puzzle pieces: an INNER JOIN only gives you the pieces that snap together perfectly. If a piece has no match on the other side, it gets tossed out.",
    "realWorldExample": {
      "description": "Matching users with their orders.",
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
              "Alice"
            ],
            [
              2,
              "Bob"
            ],
            [
              3,
              "Charlie (No orders)"
            ]
          ]
        },
        {
          "title": "Orders",
          "headers": [
            "order_id",
            "user_id",
            "product"
          ],
          "rows": [
            [
              101,
              1,
              "Laptop"
            ],
            [
              102,
              2,
              "Phone"
            ]
          ]
        }
      ],
      "explanation": "Charlie is excluded from the result because he has no matching orders."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Two-table INNER JOIN",
        "code": "SELECT u.id, u.name, o.product, o.total_amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;",
        "note": "Only rows where u.id = o.user_id are returned."
      },
      {
        "step": "Step 2: Multi-table join",
        "code": "SELECT u.name, o.id AS order_id, p.name AS product_name\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id;",
        "note": "Joins propagate matching relations across multiple relational hops."
      }
    ],
    "rulesTable": [
      {
        "rule": "Unmatched Rows Discarded",
        "explanation": "Any row in either table without a corresponding match is excluded."
      },
      {
        "rule": "Duplicate Key Multiplication",
        "explanation": "If a key matches 3 rows in table A and 2 rows in table B, the result contains 3 * 2 = 6 rows."
      },
      {
        "rule": "INNER Keyword Optional",
        "explanation": "JOIN defaults to INNER JOIN if no outer modifier is specified."
      },
      {
        "rule": "Physical join operators",
        "explanation": "Cost-Based Optimizers choose between Nested Loop Join, Hash Join, and Merge Join based on table sizes and indexes."
      },
      {
        "rule": "Join associativity and commutativity",
        "explanation": "INNER JOINs are mathematically associative; the optimizer reorders join sequence to minimize intermediate tuples."
      }
    ],
    "deepDive": {
      "title": "Physical Join Operators: Hash Join, Merge Join, Nested Loop",
      "description": "The Cost-Based Optimizer chooses among three physical join algorithms: 1) Nested Loop Join (scans table A and probes an index on B), 2) Hash Join (hashes smaller table into RAM and probes with larger table), 3) Merge Join (scans two pre-sorted inputs in lockstep).",
      "codeSnippet": "-- EXPLAIN output showing physical join choice:\nEXPLAIN ANALYZE\nSELECT * FROM users u JOIN orders o ON u.id = o.user_id;\n-- \"Hash Join (cost=2.15..18.40 rows=100 width=64)\"\n-- \"  Hash Cond: (o.user_id = u.id)\"",
      "warning": "Missing indexes on join keys force slow Nested Loop joins or full-table Hash Joins."
    },
    "advantages": [
      "Extracts strictly related data across normalized relational entities.",
      "Highly optimized by Cost-Based Optimizers."
    ],
    "disadvantages": [
      "Omitting the ON join condition accidentally creates a massive Cartesian cross product."
    ],
    "interviewQuestions": [
      {
        "question": "How does the Cost-Based Optimizer choose between Nested Loop, Hash Join, and Merge Join?",
        "answer": "1. Nested Loop Join: ideal when the outer table is very small and the inner table has a B-Tree index on the join key (O(N log M)). 2. Hash Join: ideal for large unsorted tables with equality conditions; the smaller table is hashed into RAM (work_mem) and the larger table probes it in O(N + M). 3. Merge Join: ideal when both inputs are already sorted by the join key (via indexes or sort); it steps through both inputs in lockstep in O(N + M) with minimal memory."
      },
      {
        "question": "What happens when a Hash Join exceeds available work_mem?",
        "answer": "If the hash table built on the smaller relation exceeds work_mem, the engine cannot perform an in-memory hash join. It falls back to a Two-Pass Hybrid Hash Join: it hashes rows into disk batches (partitions) on temporary disk storage and reads them back in multiple passes. This causes heavy disk I/O and query slowdown."
      },
      {
        "question": "Why does join order matter to the optimizer if INNER JOIN is mathematically commutative?",
        "answer": "While A JOIN B produces the exact same result as B JOIN A, the physical execution cost can differ by orders of magnitude. The optimizer uses dynamic programming to evaluate join order permutations, aiming to join the most selective tables first to dramatically reduce the size of intermediate tuple streams entering subsequent join stages."
      },
      {
        "question": "What is a Cartesian Product and how does it happen accidentally in INNER JOINs?",
        "answer": "A Cartesian Product occurs when two tables are joined without an ON condition (or an ON condition that always evaluates to TRUE), pairing every row in table A with every row in table B. If table A has 10,000 rows and table B has 10,000 rows, the result is 100,000,000 rows, exploding memory and crashing application servers."
      },
      {
        "question": "What is the performance difference between joining on an integer primary key vs a string column?",
        "answer": "Joining on integers is vastly faster: 1. Integer comparisons are single CPU assembly instructions, 2. Integers are fixed 4 or 8 bytes, maximizing B-Tree page density and hash table cache locality. Joining on strings requires variable-length byte comparisons, collation lookups, higher memory footprint, and slower hash computation."
      }
    ],
    "interviewReadyAnswer": "An INNER JOIN returns rows that satisfy the join predicate in both tables, discarding unmatched records. Database engines execute joins physically using Nested Loop, Hash Join, or Merge Join strategies depending on table sizes and index presence.",
    "quickTest": {
      "question": "Table A has 4 rows; Table B has 5 rows. No rows match the join condition A.id = B.a_id. How many rows does \"SELECT * FROM A JOIN B ON A.id = B.a_id\" return?",
      "options": [
        {
          "key": "A",
          "text": "4"
        },
        {
          "key": "B",
          "text": "5"
        },
        {
          "key": "C",
          "text": "0"
        },
        {
          "key": "D",
          "text": "20"
        }
      ],
      "correctAnswer": "C",
      "explanation": "An INNER JOIN strictly returns rows with matching keys on both sides; with zero matches, 0 rows are returned."
    },
    "mentalModel": "Matching socks: Only pairs of socks that have a matching partner come out of the laundry basket; lone socks are left behind.",
    "codeSnippet": "SELECT c.name, o.order_date, o.total\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.total > 500;",
    "takeaways": [
      "INNER JOIN only returns matching records from both sides.",
      "Engineers must index join columns (e.g. foreign keys).",
      "Engines use Nested Loop, Hash Join, or Merge Join algorithms."
    ],
    "commonPitfall": {
      "mistake": "Joining on columns with mismatched data types, preventing index lookups.",
      "fix": "Ensure foreign keys and primary keys have identical physical types."
    },
    "nextTopicId": "left-and-right-join",
    "prevTopicId": "constraints-integrity"
  },
  {
    "id": "left-and-right-join",
    "topicNumber": 30,
    "title": "LEFT & RIGHT JOIN",
    "category": "query-execution",
    "difficulty": "Intermediate",
    "summary": "Preserving outer table rows, NULL padding for unmatched records, anti-joins, and why RIGHT JOIN is rarely used in practice.",
    "definition": "A LEFT JOIN returns all rows from the left table, along with matching rows from the right table; if no match exists, NULLs are returned for right-table columns.",
    "eli5": "Think of attendance at a party: Every invited guest on your list is recorded (left table). If they brought a gift (right table), the gift is recorded; if they did not, the gift column says NULL.",
    "realWorldExample": {
      "description": "Finding all customers and any orders they placed, including customers who have never ordered.",
      "tables": [
        {
          "title": "Left Join Result",
          "headers": [
            "Customer",
            "Order ID",
            "Total"
          ],
          "rows": [
            [
              "Alice",
              101,
              "$120.00"
            ],
            [
              "Bob",
              102,
              "$85.00"
            ],
            [
              "Charlie (Preserved)",
              "NULL",
              "NULL"
            ]
          ]
        }
      ],
      "explanation": "Charlie is preserved even though he has no orders."
    },
    "sqlSyntaxSteps": [
      {
        "step": "Step 1: Preserving left table with LEFT JOIN",
        "code": "SELECT c.id, c.name, o.id AS order_id, o.total_amount\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;",
        "note": "Every customer appears at least once."
      },
      {
        "step": "Step 2: Anti-Join pattern (Finding rows with NO matches)",
        "code": "SELECT c.id, c.name\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;",
        "note": "Filters for customers who have NEVER placed an order."
      }
    ],
    "rulesTable": [
      {
        "rule": "All Left Rows Kept",
        "explanation": "Every row from the left table is preserved in the output at least once."
      },
      {
        "rule": "NULL Padding",
        "explanation": "If no match is found on the right table, all right table columns are populated with NULL."
      },
      {
        "rule": "RIGHT JOIN Equivalence",
        "explanation": "A RIGHT JOIN B is logically identical to B LEFT JOIN A. Standard practice standardizes on LEFT JOIN."
      },
      {
        "rule": "Outer row preservation",
        "explanation": "LEFT JOIN preserves all rows from the left relation, padding unmatched right attributes with NULL."
      },
      {
        "rule": "Filter placement (ON vs WHERE)",
        "explanation": "Filters placed in ON preserve left rows with NULL right columns; filters in WHERE discard unmatched left rows."
      }
    ],
    "deepDive": {
      "title": "The Accidental Demotion of LEFT JOIN to INNER JOIN",
      "description": "A notorious bug occurs when developers write a LEFT JOIN, and then put a filter on the right table in the WHERE clause: WHERE orders.status = \"completed\". Because orders.status IS NULL for unmatched customers, and NULL = \"completed\" evaluates to UNKNOWN, all non-ordering customers are discarded, converting the LEFT JOIN into an accidental INNER JOIN!",
      "codeSnippet": "-- ACCIDENTAL INNER JOIN (filters out customers without orders!):\nSELECT c.name, o.total\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.status = 'completed';\n\n-- FIXED (Filter placed inside the ON clause preserves customers):\nSELECT c.name, o.total\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'completed';",
      "warning": "Filtering right-table columns in WHERE silently converts a LEFT JOIN into an INNER JOIN."
    },
    "advantages": [
      "Preserves master entity records even when child records do not exist.",
      "Anti-join pattern (WHERE right.id IS NULL) efficiently identifies missing data."
    ],
    "disadvantages": [
      "Accidental WHERE filters demote outer joins to inner joins."
    ],
    "interviewQuestions": [
      {
        "question": "What is the critical difference between putting a filter in the ON clause vs the WHERE clause of a LEFT JOIN?",
        "answer": "In a LEFT JOIN: 1. Conditions in the ON clause determine which right-table rows match the left-table rows; if no right row matches, the left row is STILL emitted with NULLs for right columns. 2. Conditions in the WHERE clause evaluate AFTER the join; if you filter right_table.status = 'active' in WHERE, the NULLs created for unmatched left rows are rejected, converting your LEFT JOIN into an INNER JOIN!"
      },
      {
        "question": "What is an Anti-Join and how do you write it using LEFT JOIN vs NOT EXISTS?",
        "answer": "An Anti-Join returns rows from table A that have NO matching rows in table B (e.g. users with zero orders). Using LEFT JOIN: SELECT u.* FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE o.id IS NULL; Using NOT EXISTS: SELECT u.* FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id); NOT EXISTS is strictly preferred by modern optimizers because it short-circuits on the first match."
      },
      {
        "question": "Why is RIGHT JOIN almost never used in professional SQL codebases?",
        "answer": "RIGHT JOIN is semantically identical to LEFT JOIN with the table order reversed (A RIGHT JOIN B is identical to B LEFT JOIN A). In professional codebases, engineers read queries from top-to-bottom and left-to-right. Using LEFT JOIN keeps the primary driving relation as the anchor at the top of the FROM clause, maximizing readability and mental clarity."
      },
      {
        "question": "Can a LEFT JOIN produce duplicate rows of the left table?",
        "answer": "Yes! If a single row in the left table matches multiple rows in the right table (a 1-to-many relationship, such as one user with five orders), the left row is duplicated five times in the output stream, once for each matching order."
      },
      {
        "question": "How does the query optimizer execute a Hash Left Join?",
        "answer": "The optimizer builds an in-memory hash table on the right table (including a bitmask tracking whether each entry has been matched). It then streams the left table, probing the hash table: if matches exist, it emits joined rows; if no match exists, it emits the left row with NULL values for right columns."
      }
    ],
    "interviewReadyAnswer": "A LEFT JOIN preserves every row from the left table, populating right-table columns with NULL when no match exists. Placing filters on the right table inside the WHERE clause accidentally demotes it to an INNER JOIN; filters on outer tables must remain in the ON condition.",
    "quickTest": {
      "question": "How does placing \"WHERE orders.status = 'shipped'\" affect a query that uses \"FROM customers LEFT JOIN orders ON customers.id = orders.customer_id\"?",
      "options": [
        {
          "key": "A",
          "text": "It has no effect on customers without orders."
        },
        {
          "key": "B",
          "text": "It silently converts the LEFT JOIN into an INNER JOIN, eliminating customers with no orders."
        },
        {
          "key": "C",
          "text": "It causes a syntax error."
        },
        {
          "key": "D",
          "text": "It updates the orders table."
        }
      ],
      "correctAnswer": "B",
      "explanation": "Because orders.status is NULL for customers with no orders, the WHERE clause discards those rows, effectively turning the query into an INNER JOIN."
    },
    "mentalModel": "Master Guest List: Every invited guest has a line on your clipboard; if they checked a coat, the ticket number is written; if not, the box is blank (NULL).",
    "codeSnippet": "SELECT u.name, COUNT(o.id) AS total_orders\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.name;",
    "takeaways": [
      "LEFT JOIN preserves all rows from the left table.",
      "Unmatched rows receive NULL for right-table columns.",
      "Put right-table filters in the ON clause to prevent demoting to INNER JOIN."
    ],
    "commonPitfall": {
      "mistake": "Putting right-table predicates in the WHERE clause, inadvertently dropping left-table rows.",
      "fix": "Move the predicate into the ON clause: LEFT JOIN orders o ON ... AND o.status = \"active\"."
    },
    "nextTopicId": "full-outer-join",
    "prevTopicId": "inner-join"
  }
];
