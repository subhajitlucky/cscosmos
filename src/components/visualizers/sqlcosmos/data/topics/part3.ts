import { SqlTopic } from './types';

export const TOPICS_21_TO_30: SqlTopic[] = [
  {
    id: 'having-clause',
    topicNumber: 21,
    title: 'HAVING Clause',
    category: 'query-execution',
    difficulty: 'Intermediate',
    summary: 'Filtering aggregated groups vs individual rows, WHERE vs HAVING execution order, and performance implications.',
    definition: 'The HAVING clause specifies filter conditions applied to grouped rows (the output of GROUP BY), filtering based on aggregate expressions like COUNT(), SUM(), or AVG().',
    eli5: 'WHERE filters individual applicants before the team is formed; HAVING filters whole teams after their total scores have been calculated.',
    realWorldExample: {
      description: 'Finding departments that have more than 5 employees and an average salary over $100,000.',
      tables: [
        {
          title: 'Department Aggregates',
          headers: ['department', 'COUNT(*)', 'AVG(salary)'],
          rows: [
            ['Engineering', 12, '$125,000 (Passes HAVING)'],
            ['Sales', 8, '$85,000 (Fails salary check)'],
            ['HR', 3, '$95,000 (Fails count check)'],
          ],
        },
      ],
      explanation: 'HAVING COUNT(*) > 5 AND AVG(salary) > 100000 filters out Sales and HR.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Filtering grouped results with HAVING',
        code: 'SELECT department, COUNT(*) AS staff_count, AVG(salary) AS avg_sal\nFROM employees\nWHERE status = \'active\' -- Filters rows BEFORE grouping\nGROUP BY department\nHAVING COUNT(*) >= 5   -- Filters groups AFTER aggregation\nORDER BY avg_sal DESC;',
        note: 'WHERE filters individual tuples; HAVING filters aggregate buckets.',
      },
    ],
    rulesTable: [
      { rule: 'WHERE vs HAVING Timing', explanation: 'WHERE evaluates before GROUP BY; HAVING evaluates after GROUP BY and aggregate calculation.' },
      { rule: 'Pre-Filter Optimization', explanation: 'Never put filters on plain columns in HAVING if they could be placed in WHERE (filtering early saves CPU).' },
      { rule: 'Aggregate Requirement', explanation: 'Conditions inside HAVING typically involve aggregate functions like SUM, COUNT, or AVG.' },
    ],
    deepDive: {
      title: 'Performance: Why Filtering in WHERE Beats HAVING',
      description: 'Filtering in WHERE discards rows before the engine allocates memory for HashAggregate. If you filter in HAVING, the database must ingest, sort, or hash every single row first, wasting memory and CPU.',
      codeSnippet: '-- SLOW (Groups all countries first, then discards):\nSELECT country, COUNT(*) FROM users GROUP BY country HAVING country = \'US\';\n\n-- FAST (Filters in WHERE, grouping ONLY US rows):\nSELECT country, COUNT(*) FROM users WHERE country = \'US\' GROUP BY country;',
      warning: 'Only put conditions in HAVING that strictly require aggregate functions.',
    },
    advantages: ['Enables conditional filtering on calculated group metrics.', 'Completes the relational pipeline for grouped analytics.'],
    disadvantages: ['Misplacing row-level predicates into HAVING wastes substantial query memory.'],
    interviewQuestions: [
      {
        question: 'What is the core difference between WHERE and HAVING?',
        answer: 'WHERE filters individual rows before grouping occurs and cannot contain aggregate functions. HAVING filters grouped rows after aggregation has been calculated.',
      },
      {
        question: 'Can you use the HAVING clause without a GROUP BY clause?',
        answer: 'Yes. In SQL, if you omit GROUP BY, the entire table is treated as a single group. For example, SELECT AVG(salary) FROM emp HAVING AVG(salary) > 50000 evaluates the global average.',
      },
    ],
    interviewReadyAnswer: 'WHERE filters rows before grouping, while HAVING filters groups after aggregation. To maximize database performance, always filter raw rows in the WHERE clause as early as possible and reserve HAVING exclusively for aggregate calculations.',
    quickTest: {
      question: 'Which of the following queries correctly filters for departments where average salary exceeds 80,000?',
      options: [
        { key: 'A', text: 'SELECT dept, AVG(salary) FROM emp WHERE AVG(salary) > 80000 GROUP BY dept;' },
        { key: 'B', text: 'SELECT dept, AVG(salary) FROM emp GROUP BY dept HAVING AVG(salary) > 80000;' },
        { key: 'C', text: 'SELECT dept, AVG(salary) FROM emp HAVING dept = "IT";' },
        { key: 'D', text: 'SELECT dept FROM emp WHERE salary > 80000;' },
      ],
      correctAnswer: 'B',
      explanation: 'Aggregate functions cannot appear in WHERE; they must be evaluated in the HAVING clause after grouping.',
    },
    mentalModel: 'Team Tournament: WHERE eliminates individual players who do not have a uniform; HAVING eliminates entire teams whose combined score is below 100 points.',
    codeSnippet: 'SELECT customer_id, COUNT(id) AS total_orders, SUM(amount) AS total_spend\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(id) >= 10 AND SUM(amount) > 1000;',
    takeaways: ['WHERE filters rows before GROUP BY; HAVING filters after.', 'Aggregate functions cannot appear in WHERE.', 'Always push non-aggregate filters into WHERE to minimize memory.'],
    commonPitfall: { mistake: 'Putting plain column filters into HAVING (e.g. HAVING dept = "IT"), which forces the database to group the entire table first.', fix: 'Move the filter to WHERE: WHERE dept = "IT".' },
    nextTopicId: 'string-functions',
    prevTopicId: 'group-by-grouping',
  },
  {
    id: 'string-functions',
    topicNumber: 22,
    title: 'String Functions',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Text manipulation: CONCAT, SUBSTRING, LENGTH, TRIM, REPLACE, UPPER/LOWER, and regular expression matching.',
    definition: 'SQL string functions manipulate, clean, extract, and format text data stored in CHAR, VARCHAR, or TEXT columns.',
    eli5: 'String functions are text tools like scissors (SUBSTRING), glue (CONCAT), an eraser (TRIM), or a dictionary search-and-replace.',
    realWorldExample: {
      description: 'Sanitizing user-submitted phone numbers and emails before rendering or storage.',
      tables: [
        {
          title: 'Input vs Output',
          headers: ['Raw Input', 'Function', 'Cleaned Output'],
          rows: [
            ['  Lucky@Gmail.com  ', 'LOWER(TRIM(...))', 'lucky@gmail.com'],
            ['(555) 123-4567', 'REPLACE(REPLACE(...))', '5551234567'],
          ],
        },
      ],
      explanation: 'String functions ensure canonical format across user records.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Common text transformations',
        code: 'SELECT\n  LOWER(TRIM(email)) AS normalized_email,\n  CONCAT(first_name, \' \', last_name) AS full_name,\n  SUBSTRING(phone FROM 1 FOR 3) AS area_code,\n  LENGTH(password_hash) AS hash_length,\n  REPLACE(description, \'bad\', \'good\') AS clean_desc\nFROM users;',
      },
    ],
    rulesTable: [
      { rule: '1-Based Indexing', explanation: 'In SQL (unlike C or Python), SUBSTRING positions are 1-based: SUBSTRING("hello", 1, 2) returns "he".' },
      { rule: 'NULL Handling', explanation: 'TRIM(NULL), UPPER(NULL), and SUBSTRING(NULL) all return NULL.' },
      { rule: 'Multi-byte Characters', explanation: 'LENGTH() counts characters, while OCTET_LENGTH() counts physical bytes (UTF-8).' },
    ],
    deepDive: {
      title: 'Expression Indexes for Case-Insensitive Queries',
      description: 'Using LOWER(email) in a WHERE clause prevents the engine from using a normal index on email. Creating an expression index solves this completely.',
      codeSnippet: '-- Create expression index on normalized text:\nCREATE INDEX idx_users_lower_email ON users(LOWER(email));\n\n-- Now this uses an Index Scan:\nSELECT * FROM users WHERE LOWER(email) = \'lucky@example.com\';',
      warning: 'Without an expression index, querying on functions forces a full table scan.',
    },
    advantages: ['Transforms data on the fly directly inside the database.', 'Enables data standardization and cleaning during ingestion.'],
    disadvantages: ['Overusing string manipulation functions in WHERE without expression indexes disables B-Trees.'],
    interviewQuestions: [
      {
        question: 'Are string indexes in SQL 0-based or 1-based?',
        answer: 'SQL string functions use 1-based indexing. Position 1 refers to the very first character of the string.',
      },
      {
        question: 'What is the difference between LENGTH() and OCTET_LENGTH()?',
        answer: 'LENGTH() returns the number of characters in the string. OCTET_LENGTH() returns the number of bytes required to store it (which can be 2-4 bytes per character for multi-byte UTF-8 emojis or non-Latin scripts).',
      },
    ],
    interviewReadyAnswer: 'SQL provides standard text functions like CONCAT, SUBSTRING, TRIM, and REPLACE. String indexes are 1-based, and when string transformations are used in WHERE predicates, expression indexes are required to preserve logarithmic B-Tree lookups.',
    quickTest: {
      question: 'What does SUBSTRING(\'CSCosmos\', 1, 2) return in standard SQL?',
      options: [
        { key: 'A', text: '\'C\'' },
        { key: 'B', text: '\'CS\'' },
        { key: 'C', text: '\'SC\'' },
        { key: 'D', text: '\'S\'' },
      ],
      correctAnswer: 'B',
      explanation: 'SQL strings are 1-based. Starting at position 1 for a length of 2 characters yields "CS".',
    },
    mentalModel: 'Word processor toolbar: Cut, paste, uppercase, trim spaces, and find-replace.',
    codeSnippet: 'SELECT CONCAT_WS(\', \', city, state, country) AS location\nFROM addresses;',
    takeaways: ['SQL string functions use 1-based indexing.', 'Use CONCAT or CONCAT_WS to avoid NULL drops.', 'Create expression indexes for functions used in WHERE filters.'],
    commonPitfall: { mistake: 'Writing SUBSTRING(str, 0, 2) assuming 0-based indexing like JavaScript or Python.', fix: 'Start at position 1 in SQL: SUBSTRING(str, 1, 2).' },
    nextTopicId: 'date-functions',
    prevTopicId: 'having-clause',
  },
  {
    id: 'date-functions',
    topicNumber: 23,
    title: 'Date & Time Functions',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'NOW, CURRENT_DATE, EXTRACT, DATE_TRUNC, INTERVAL math, and UTC timestamp best practices.',
    definition: 'SQL date and time functions handle temporal calculations, timezone conversions, period truncations, and date arithmetic.',
    eli5: 'Date functions are a calendar and clock inside your database: they tell you what time it is, add 7 days to an expiration date, or tell you what day of the week it was.',
    realWorldExample: {
      description: 'A subscription billing engine calculating expiration dates and monthly revenue aggregates.',
      tables: [
        {
          title: 'Subscription Math',
          headers: ['started_at', 'Interval', 'expires_at'],
          rows: [
            ['2026-01-15 10:00:00', 'INTERVAL \'30 days\'', '2026-02-14 10:00:00'],
          ],
        },
      ],
      explanation: 'started_at + INTERVAL \'30 days\' computes the exact renewal date.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Current timestamps and interval arithmetic',
        code: 'SELECT\n  CURRENT_DATE AS today,\n  CURRENT_TIMESTAMP AS now_utc,\n  CURRENT_TIMESTAMP + INTERVAL \'7 days\' AS one_week_later,\n  CURRENT_TIMESTAMP - INTERVAL \'1 month\' AS last_month;',
      },
      {
        step: 'Step 2: Grouping by time bucket with DATE_TRUNC (PostgreSQL)',
        code: 'SELECT\n  DATE_TRUNC(\'month\', created_at) AS month_bucket,\n  COUNT(*) AS signups\nFROM users\nGROUP BY month_bucket\nORDER BY month_bucket;',
        note: 'DATE_TRUNC collapses timestamps into clean time buckets (hour, day, week, month).',
      },
      {
        step: 'Step 3: Extracting specific date parts',
        code: 'SELECT EXTRACT(DOW FROM created_at) AS day_of_week FROM orders;',
        note: 'Extracts numeric year, month, day, hour, or day of week (0 = Sunday).',
      },
    ],
    rulesTable: [
      { rule: 'TIMESTAMPTZ Always', explanation: 'Always use TIMESTAMPTZ (timestamp with time zone) in PostgreSQL to store normalized UTC timestamps.' },
      { rule: 'NOW() Transaction Stability', explanation: 'In PostgreSQL, NOW() returns the start timestamp of the current transaction and does not change between statements in the same transaction.' },
      { rule: 'CLOCK_TIMESTAMP()', explanation: 'If you need the true wall-clock time as a statement executes, use CLOCK_TIMESTAMP().' },
    ],
    deepDive: {
      title: 'Timestamp with Time Zone (TIMESTAMPTZ) Storage Reality',
      description: 'A common misconception is that TIMESTAMPTZ stores a string like "2026-01-01+05:30". In reality, PostgreSQL converts all incoming timestamps to UTC and stores them as an 8-byte integer representing microseconds since 2000-01-01 UTC.',
      codeSnippet: '-- Always use TIMESTAMPTZ for distributed systems:\nCREATE TABLE audit_trail (\n  id BIGINT PRIMARY KEY,\n  occurred_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP\n);',
      warning: 'Never use plain TIMESTAMP (without time zone) for financial or global web applications.',
    },
    advantages: ['Native timezone math eliminates client-side timezone calculation bugs.', 'DATE_TRUNC simplifies time-series analytics.'],
    disadvantages: ['Daylight savings transitions can complicate interval calculations across borders.'],
    interviewQuestions: [
      {
        question: 'What is the difference between TIMESTAMP and TIMESTAMPTZ in PostgreSQL?',
        answer: 'TIMESTAMP stores naive date/time without timezone info. TIMESTAMPTZ converts incoming times to UTC for storage and converts UTC back to the client session timezone upon retrieval.',
      },
      {
        question: 'What is the purpose of the DATE_TRUNC function?',
        answer: 'DATE_TRUNC truncates a timestamp to a specified precision (like "day", "month", or "year"), setting sub-units to zero. It is widely used to create time-series grouping buckets.',
      },
    ],
    interviewReadyAnswer: 'SQL provides robust date and time manipulation through INTERVAL arithmetic, EXTRACT, and DATE_TRUNC. In production, always use TIMESTAMPTZ to normalize records to UTC and prevent timezone drift.',
    quickTest: {
      question: 'In PostgreSQL, what does DATE_TRUNC(\'month\', TIMESTAMP \'2026-04-18 14:32:00\') return?',
      options: [
        { key: 'A', text: '\'2026-04-01 00:00:00\'' },
        { key: 'B', text: '\'2026-04-30 23:59:59\'' },
        { key: 'C', text: '\'2026-04-18 00:00:00\'' },
        { key: 'D', text: '\'2026-01-01 00:00:00\'' },
      ],
      correctAnswer: 'A',
      explanation: 'DATE_TRUNC resets all components smaller than the specified unit (month) to their baseline, yielding the first day of that month at 00:00:00.',
    },
    mentalModel: 'Digital Clock and Calendar: Adding an interval moves the hands forward; DATE_TRUNC snaps the clock back to the start of the current period.',
    codeSnippet: 'SELECT DATE_TRUNC(\'day\', created_at) AS day, COUNT(*) AS daily_sales\nFROM orders\nWHERE created_at >= NOW() - INTERVAL \'30 days\'\nGROUP BY day\nORDER BY day;',
    takeaways: ['Always store timestamps as TIMESTAMPTZ (normalized to UTC).', 'Use INTERVAL for safe date arithmetic.', 'DATE_TRUNC creates clean time-series buckets for GROUP BY.'],
    commonPitfall: { mistake: 'Using naive TIMESTAMP without time zone and having timestamps drift when daylight savings occurs.', fix: 'Use TIMESTAMPTZ for all physical timestamps.' },
    nextTopicId: 'numeric-functions',
    prevTopicId: 'string-functions',
  },
  {
    id: 'numeric-functions',
    topicNumber: 24,
    title: 'Numeric Functions',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Mathematical operations: ROUND, CEIL, FLOOR, ABS, MOD, and floating-point vs exact numeric precision.',
    definition: 'SQL numeric functions perform mathematical computations, rounding, truncation, and absolute value evaluations on integer and decimal columns.',
    eli5: 'Numeric functions are the buttons on a scientific calculator: rounding money to 2 decimals, rounding up with ceiling, or getting positive numbers with absolute value.',
    realWorldExample: {
      description: 'Calculating payment splits, fee rounding, and inventory batch distributions.',
      tables: [
        {
          title: 'Price Calculations',
          headers: ['Raw Price', 'ROUND(..., 2)', 'CEIL(...)', 'FLOOR(...)'],
          rows: [
            ['45.678', '45.68', '46', '45'],
            ['10.121', '10.12', '11', '10'],
          ],
        },
      ],
      explanation: 'ROUND rounds to the nearest decimal; CEIL always rounds up; FLOOR always rounds down.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Rounding and ceiling functions',
        code: 'SELECT\n  ROUND(125.4567, 2) AS rounded_cents,  -- 125.46\n  CEIL(4.01) AS ceiling_val,           -- 5\n  FLOOR(4.99) AS floor_val,            -- 4\n  ABS(-50.00) AS absolute_balance,     -- 50.00\n  MOD(10, 3) AS remainder;             -- 1',
      },
    ],
    rulesTable: [
      { rule: 'ROUND Precision', explanation: 'ROUND(num, s) rounds to s decimal places. Omission of s defaults to 0 decimal places.' },
      { rule: 'CEIL vs FLOOR', explanation: 'CEIL rounds towards positive infinity; FLOOR rounds towards negative infinity.' },
      { rule: 'NUMERIC Exactness', explanation: 'NUMERIC/DECIMAL provides arbitrary precision; FLOAT/REAL introduces floating point inaccuracy.' },
    ],
    deepDive: {
      title: 'Floating Point Rounding Disasters in Financial Systems',
      description: 'Storing money using FLOAT or DOUBLE causes binary IEEE 754 precision loss where 0.1 + 0.2 = 0.30000000000000004. In production banking schemas, ALWAYS use NUMERIC(12, 2) or store integer cents.',
      codeSnippet: '-- WRONG (FLOAT causes financial drift):\nCREATE TABLE bad_ledger ( balance FLOAT );\n\n-- CORRECT (Exact decimal representation):\nCREATE TABLE good_ledger ( balance NUMERIC(14, 2) NOT NULL DEFAULT 0.00 );',
      warning: 'Never use FLOAT for financial currency balances or accounting books.',
    },
    advantages: ['Executes mathematical transformations close to the data.', 'Guarantees uniform rounding across all API consumers.'],
    disadvantages: ['Complex trigonometric calculations in SQL consume high database CPU.'],
    interviewQuestions: [
      {
        question: 'What is the difference between NUMERIC/DECIMAL and FLOAT in SQL?',
        answer: 'NUMERIC/DECIMAL is an exact fixed-point type that guarantees precision without rounding errors (ideal for money). FLOAT is an approximate binary floating-point type that can introduce precision artifacts.',
      },
      {
        question: 'What does MOD(17, 5) return?',
        answer: 'It returns 2 (the remainder when 17 is divided by 5).',
      },
    ],
    interviewReadyAnswer: 'SQL provides built-in numeric functions like ROUND, CEIL, FLOOR, and MOD. For financial applications, storing amounts in NUMERIC guarantees exact precision and eliminates floating-point rounding discrepancies.',
    quickTest: {
      question: 'What does CEIL(8.1) evaluate to in SQL?',
      options: [
        { key: 'A', text: '8' },
        { key: 'B', text: '9' },
        { key: 'C', text: '8.1' },
        { key: 'D', text: 'NULL' },
      ],
      correctAnswer: 'B',
      explanation: 'CEIL always rounds up to the next nearest integer, so 8.1 rounds up to 9.',
    },
    mentalModel: 'Bank cash drawer: Rounding ensures pennies are distributed accurately without lost fractions.',
    codeSnippet: 'SELECT item_id, price, ROUND(price * 0.95, 2) AS discounted_price\nFROM inventory;',
    takeaways: ['Use ROUND(val, 2) to format decimal currency.', 'CEIL rounds up; FLOOR rounds down.', 'Always use NUMERIC/DECIMAL for financial data, never FLOAT.'],
    commonPitfall: { mistake: 'Using FLOAT for money and having automated reconciliation scripts report a $0.01 mismatch.', fix: 'Use NUMERIC(12, 2) or integer cents.' },
    nextTopicId: 'type-conversion',
    prevTopicId: 'date-functions',
  },
  {
    id: 'type-conversion',
    topicNumber: 25,
    title: 'Type Conversion',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'CAST, PostgreSQL :: shorthand, implicit vs explicit coercion, and avoiding type conversion performance traps.',
    definition: 'Type conversion translates a value from one data type to another, either explicitly via CAST() or implicitly by the query engine during evaluation.',
    eli5: 'Type conversion is an electrical adapter: turning a string of text containing digits "123" into a real number 123 so you can do math with it.',
    realWorldExample: {
      description: 'Parsing JSON string numbers or converting dates to human-readable timestamps.',
      tables: [
        {
          title: 'Type Casting',
          headers: ['Input Text', 'Target Type', 'Result'],
          rows: [
            ['\'2026-01-01\'', 'DATE', '2026-01-01'],
            ['\'42.50\'', 'NUMERIC(5,2)', '42.50'],
          ],
        },
      ],
      explanation: 'Explicit CAST ensures mathematical and relational operators work as intended.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Standard ANSI CAST syntax',
        code: 'SELECT CAST(\'2026-01-01\' AS DATE), CAST(100 AS VARCHAR(10));',
        note: 'Universal syntax supported by all SQL engines.',
      },
      {
        step: 'Step 2: PostgreSQL shorthand double-colon (::)',
        code: 'SELECT \'123\'::INT + 5 AS total, \'{"key": "value"}\'::JSONB AS payload;',
        note: 'Concise and idiomatic in PostgreSQL.',
      },
    ],
    rulesTable: [
      { rule: 'ANSI Standard', explanation: 'CAST(expression AS target_type) is the universal ANSI SQL standard.' },
      { rule: 'Failed Coercion Error', explanation: 'Attempting to cast invalid text (e.g. \'abc\'::INT) aborts the transaction with a runtime error.' },
      { rule: 'Index Invalidation on Implicit Cast', explanation: 'If a column is VARCHAR and you compare col = 123, the engine may implicitly cast col to INT, invalidating the B-Tree index!' },
    ],
    deepDive: {
      title: 'The Silent Index-Killer: Implicit Type Coercion',
      description: 'When you compare an indexed VARCHAR column against an integer literal (WHERE phone = 9876543210), SQL engines coerce the table column to an integer: WHERE CAST(phone AS INT) = 9876543210. This wraps the column in a function and forces a full table scan!',
      codeSnippet: '-- SLOW FULL TABLE SCAN (Implicit coercion invalidates index):\nWHERE phone_varchar = 9876543210;\n\n-- FAST B-TREE INDEX SEEK (Types match exactly):\nWHERE phone_varchar = \'9876543210\';',
      warning: 'Always match literal data types in your application code with table schema types.',
    },
    advantages: ['Enables dynamic data transformation.', 'Resolves data type mismatches between client applications and schemas.'],
    disadvantages: ['Implicit type conversion in WHERE clauses destroys query performance.'],
    interviewQuestions: [
      {
        question: 'What is the difference between explicit and implicit type conversion in SQL?',
        answer: 'Explicit conversion is declared by the developer using CAST() or ::. Implicit conversion is automatically performed by the database engine when comparing different types (e.g., comparing an integer to a float).',
      },
      {
        question: 'Why can implicit type conversion cause a query to become slow?',
        answer: 'Because if the database engine converts the table column to match the parameter type (rather than converting the parameter), the column becomes wrapped in a function, preventing the B-Tree index from being used.',
      },
    ],
    interviewReadyAnswer: 'Type conversion translates data types using ANSI CAST or PostgreSQL :: shorthand. Developers must be careful with implicit type coercion in WHERE clauses, as mismatched types can prevent B-Tree index utilization and force full table scans.',
    quickTest: {
      question: 'Which query uses standard ANSI SQL syntax to convert a string to an integer?',
      options: [
        { key: 'A', text: 'CONVERT_TO(\'100\', INT)' },
        { key: 'B', text: 'CAST(\'100\' AS INT)' },
        { key: 'C', text: 'PARSE_INT(\'100\')' },
        { key: 'D', text: 'MAKE_INT(\'100\')' },
      ],
      correctAnswer: 'B',
      explanation: 'CAST(expression AS type) is the ANSI SQL standard for explicit type casting.',
    },
    mentalModel: 'Plug adapter: Adapting an American plug to a European outlet so power flows seamlessly.',
    codeSnippet: 'SELECT id, CAST(total_cents AS NUMERIC) / 100 AS total_usd\nFROM orders;',
    takeaways: ['Use CAST(x AS type) for ANSI standard type conversion.', 'Postgres supports the convenient :: shorthand (e.g. "val"::int).', 'Ensure query parameters match column types to avoid index invalidation.'],
    commonPitfall: { mistake: 'Passing integer IDs into string/UUID columns in application queries, causing full table scans.', fix: 'Pass string parameters to match string/UUID columns in schemas.' },
    nextTopicId: 'primary-key',
    prevTopicId: 'numeric-functions',
  },
  {
    id: 'primary-key',
    topicNumber: 26,
    title: 'Primary Key',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'Row uniqueness, NOT NULL enforcement, candidate keys, surrogate vs natural keys, and clustered index implications.',
    definition: 'A Primary Key (PK) is a column (or minimal set of columns) that uniquely identifies each row in a table. It strictly enforces uniqueness and forbids NULL values.',
    eli5: 'A Primary Key is like your Citizen National ID or Passport Number: no two citizens can share the same number, and everyone is required to have one.',
    realWorldExample: {
      description: 'An employee directory where every employee is identified by a unique auto-incrementing ID.',
      tables: [
        {
          title: 'Employees Table',
          headers: ['id (PK)', 'email', 'name'],
          rows: [
            [1, 'lucky@company.com', 'Lucky'],
            [2, 'rahul@company.com', 'Rahul'],
          ],
        },
      ],
      explanation: 'The primary key guarantees that employee #1 is completely unique across the entire organization.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Single-column Identity Primary Key',
        code: 'CREATE TABLE users (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  email VARCHAR(255) NOT NULL UNIQUE\n);',
        note: 'Automatically creates a unique B-Tree index on id.',
      },
      {
        step: 'Step 2: Composite Primary Key for Junction Tables',
        code: 'CREATE TABLE student_courses (\n  student_id INT REFERENCES students(id),\n  course_id INT REFERENCES courses(id),\n  enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE,\n  PRIMARY KEY (student_id, course_id)\n);',
        note: 'Ensures a student cannot enroll in the exact same course twice.',
      },
    ],
    rulesTable: [
      { rule: 'Uniqueness Invariant', explanation: 'No two rows can have the same primary key value.' },
      { rule: 'NOT NULL Required', explanation: 'Primary key columns cannot contain NULL values.' },
      { rule: 'One PK Per Table', explanation: 'A table can have exactly one primary key constraint (though it may span multiple columns).' },
    ],
    deepDive: {
      title: 'Surrogate Keys vs Natural Keys',
      description: 'A Natural Key is real-world data that is unique (like an email address or SSN). A Surrogate Key is an artificial system-generated identifier (like BIGINT IDENTITY or UUIDv7). Surrogate keys insulate database schemas from business identity changes (e.g. a user changing their email address).',
      codeSnippet: '-- Preferred Surrogate Key pattern:\nCREATE TABLE customers (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, -- Surrogate\n  tax_id VARCHAR(50) UNIQUE NOT NULL                  -- Natural candidate\n);',
      warning: 'Using mutable natural keys (like email) as primary keys causes painful foreign key cascades when values change.',
    },
    advantages: ['Guarantees entity integrity and row identification.', 'Automatically creates a high-performance unique B-Tree index.'],
    disadvantages: ['Composite primary keys with wide text columns consume excessive index space.'],
    interviewQuestions: [
      {
        question: 'Can a Primary Key column contain NULL values?',
        answer: 'No. By ANSI standard, primary key columns are strictly constrained to NOT NULL.',
      },
      {
        question: 'What is the difference between a Primary Key and a UNIQUE constraint?',
        answer: 'A table can have only one Primary Key, and it cannot contain NULLs. A table can have multiple UNIQUE constraints, and in standard SQL, columns with a UNIQUE constraint are allowed to store NULLs (unless explicitly set to NOT NULL).',
      },
    ],
    interviewReadyAnswer: 'A Primary Key uniquely identifies rows in a table while enforcing NOT NULL. Best practice uses synthetic surrogate keys (such as BIGINT identity or sequential UUIDs) to protect foreign key relationships from mutable business attributes.',
    quickTest: {
      question: 'Which of the following is TRUE about Primary Keys in SQL?',
      options: [
        { key: 'A', text: 'A table can have multiple Primary Key constraints.' },
        { key: 'B', text: 'Primary Key columns can store NULL values.' },
        { key: 'C', text: 'A table can have only one Primary Key, and it strictly forbids NULL values.' },
        { key: 'D', text: 'Primary Keys do not create an index.' },
      ],
      correctAnswer: 'C',
      explanation: 'A table is permitted exactly one Primary Key, which mandates absolute uniqueness and forbids NULL values.',
    },
    mentalModel: 'Passport Number: Uniquely identifies you worldwide and can never be empty.',
    codeSnippet: 'CREATE TABLE orders (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  customer_id INT NOT NULL\n);',
    takeaways: ['A Primary Key uniquely identifies rows and forbids NULLs.', 'A table can have only one Primary Key constraint.', 'Prefer immutable surrogate keys over mutable natural keys.'],
    commonPitfall: { mistake: 'Using a mutable natural key like email as the PK, causing widespread foreign key updates when a user changes their email.', fix: 'Use an identity surrogate integer/UUID as PK and place a UNIQUE constraint on email.' },
    nextTopicId: 'foreign-key',
    prevTopicId: 'type-conversion',
  },
  {
    id: 'foreign-key',
    topicNumber: 27,
    title: 'Foreign Key',
    category: 'foundations',
    difficulty: 'Intermediate',
    summary: 'Referential integrity, parent-child relationships, ON DELETE CASCADE, ON UPDATE actions, and foreign key indexing requirements.',
    definition: 'A Foreign Key is a column (or group of columns) in one table that references a primary key or unique key in another table, maintaining referential integrity between them.',
    eli5: 'Imagine a school: Every student belongs to a class. Each class has a unique ID. A student cannot be assigned to a class that doesn\'t exist. The student\'s class_id is a Foreign Key.',
    realWorldExample: {
      description: 'We have two tables: Departments and Employees.',
      tables: [
        {
          title: 'Departments',
          headers: ['id (PK)', 'name'],
          rows: [
            [1, 'IT'],
            [2, 'HR'],
          ],
        },
        {
          title: 'Employees',
          headers: ['id (PK)', 'name', 'department_id (FK)'],
          rows: [
            [101, 'Lucky', 1],
            [102, 'Rahul', 2],
            [103, 'Amit', 1],
          ],
        },
      ],
      explanation: 'Here departments.id is the Primary Key, and employees.department_id is the Foreign Key. The foreign key ensures an employee cannot reference a nonexistent department.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Create Departments table',
        code: 'CREATE TABLE departments (\n  id INT PRIMARY KEY,\n  name VARCHAR(100)\n);',
      },
      {
        step: 'Step 2: Create Employees with Foreign Key constraint',
        code: 'CREATE TABLE employees (\n  id INT PRIMARY KEY,\n  name VARCHAR(100),\n  department_id INT,\n  FOREIGN KEY (department_id) REFERENCES departments(id)\n);',
      },
      {
        step: 'Step 3: Insert valid records',
        code: 'INSERT INTO departments VALUES (1, \'IT\'), (2, \'HR\');\nINSERT INTO employees VALUES (101, \'Lucky\', 1), (102, \'Rahul\', 2);',
      },
      {
        step: 'Step 4: Attempt invalid insertion',
        code: '-- Fails with constraint violation!\nINSERT INTO employees VALUES (103, \'Amit\', 99);\n-- ERROR: insert on table "employees" violates foreign key constraint',
        note: 'Department 99 does not exist, so the foreign key blocks the insertion.',
      },
    ],
    rulesTable: [
      { rule: 'Duplicate values', explanation: 'Allowed (multiple employees can reference the same department).' },
      { rule: 'NULL values', explanation: 'Allowed unless NOT NULL constraint is explicitly specified.' },
      { rule: 'Multiple foreign keys', explanation: 'Allowed in one table (e.g. orders can reference users, coupons, and warehouses).' },
      { rule: 'Referenced value', explanation: 'Must exist in the parent table (unless the foreign key column is NULL).' },
      { rule: 'Delete parent', explanation: 'May be restricted (NO ACTION / RESTRICT) or trigger an automated cascading action.' },
    ],
    deepDive: {
      title: 'ON DELETE CASCADE Mechanics & Indexing',
      description: 'When you configure ON DELETE CASCADE, deleting a parent row automatically purges all child records referencing it. Be careful: CASCADE can delete thousands of related records. Furthermore, in PostgreSQL, foreign keys do NOT automatically create secondary indexes; you must manually index foreign key columns to prevent full table scans and lock contention during parent deletes.',
      codeSnippet: '-- Manual index on foreign key column (MANDATORY for production):\nCREATE INDEX idx_employees_department_id ON employees(department_id);\n\n-- Cascade configuration:\nALTER TABLE employees\n  ADD CONSTRAINT fk_emp_dept\n  FOREIGN KEY (department_id) REFERENCES departments(id)\n  ON DELETE CASCADE;',
      warning: 'Deleting a parent row without an index on the child table\'s foreign key triggers a full table scan of the child table and acquires share locks.',
    },
    advantages: [
      'Prevents orphan records and invalid relationships.',
      'Maintains data integrity at the database storage engine layer.',
      'Supports automated lifecycle management via ON DELETE CASCADE / SET NULL.',
    ],
    disadvantages: [
      'Adds validation overhead during INSERT and UPDATE writes.',
      'Can complicate deletions and cause accidental cascaded data loss.',
      'Requires explicit index creation in PostgreSQL to prevent table lock bottlenecks.',
    ],
    interviewQuestions: [
      {
        question: 'Can a foreign key contain NULL values?',
        answer: 'Yes, unless restricted by a NOT NULL constraint. A NULL foreign key represents an optional or unassigned relationship.',
      },
      {
        question: 'Can a foreign key contain duplicate values?',
        answer: 'Yes. Multiple child rows can reference the exact same parent row (e.g. multiple employees in the same department).',
      },
      {
        question: 'Does a foreign key automatically create an index in PostgreSQL?',
        answer: 'No. While primary keys automatically create unique B-Tree indexes, foreign key columns do not. Engineers must create them manually with CREATE INDEX.',
      },
      {
        question: 'What is the difference between Primary Key and Foreign Key?',
        answer: 'A Primary Key uniquely identifies a row in its table and cannot be NULL. A Foreign Key references a key in another table, can contain duplicates, and can be NULL.',
        comparisonTable: {
          headers: ['Primary Key', 'Foreign Key'],
          rows: [
            ['Uniquely identifies a row', 'References a key in another table'],
            ['Cannot be NULL', 'Can be NULL'],
            ['Must be unique', 'Can have duplicates'],
            ['One PK per table', 'Multiple FKs per table allowed'],
          ],
        },
      },
    ],
    interviewReadyAnswer: 'A foreign key is a constraint that establishes a relationship between two tables and ensures referential integrity. For example, in an employees table, department_id can reference the id column of the departments table, preventing employees from referencing departments that don\'t exist.',
    quickTest: {
      question: 'We have Users (id 1, 2) and Orders (id 101 for user 1; id 102 for user 2). What happens if we execute "DELETE FROM users WHERE id = 1;" when orders.user_id is a foreign key referencing users.id with default NO ACTION behavior?',
      options: [
        { key: 'A', text: 'User 1 is deleted automatically.' },
        { key: 'B', text: 'User 1 and order 101 are deleted.' },
        { key: 'C', text: 'An error occurs because order 101 references user 1.' },
        { key: 'D', text: 'Only order 101 is deleted.' },
      ],
      correctAnswer: 'C',
      explanation: 'Under default NO ACTION or RESTRICT, the database rejects the deletion of a parent row if dependent child records still exist.',
    },
    mentalModel: 'Classroom roster: You cannot assign a student to room 99 if room 99 does not exist in the school building.',
    codeSnippet: 'CREATE TABLE orders (\n  id BIGINT PRIMARY KEY,\n  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT\n);',
    takeaways: [
      'Foreign keys enforce referential integrity between tables.',
      'Child rows can have duplicate and NULL foreign key values.',
      'Always manually index foreign key columns in PostgreSQL.',
    ],
    commonPitfall: {
      mistake: 'Forgetting to create a B-Tree index on foreign key columns, causing full table scans and heavy locking when deleting parent records.',
      fix: 'Always run: CREATE INDEX idx_child_fk ON child_table(parent_id);',
    },
    nextTopicId: 'constraints-integrity',
    prevTopicId: 'primary-key',
  },
  {
    id: 'constraints-integrity',
    topicNumber: 28,
    title: 'Constraints & Invariants',
    category: 'foundations',
    difficulty: 'Beginner',
    summary: 'NOT NULL, UNIQUE, CHECK, DEFAULT constraints, domain validation, and database-level business rules.',
    definition: 'Constraints are database-level declarations that enforce data integrity rules on table columns, rejecting any INSERT or UPDATE that violates them.',
    eli5: 'Constraints are the security rules of a building: "no entry without a badge" (NOT NULL), "every badge must be distinct" (UNIQUE), and "must be at least 18 years old" (CHECK).',
    realWorldExample: {
      description: 'A user profile table ensuring valid usernames, positive account balances, and verified status.',
      tables: [
        {
          title: 'Accounts Constraints',
          headers: ['Column', 'Constraint', 'Rule'],
          rows: [
            ['username', 'UNIQUE NOT NULL', 'Must exist and be unique'],
            ['balance', 'CHECK (balance >= 0)', 'No negative balances'],
            ['status', 'DEFAULT \'active\'', 'Auto-defaults to active'],
          ],
        },
      ],
      explanation: 'Constraints stop bad data at the database boundary before it reaches disk.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Adding CHECK and UNIQUE constraints',
        code: 'CREATE TABLE bank_accounts (\n  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n  account_number VARCHAR(20) UNIQUE NOT NULL,\n  balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00\n    CONSTRAINT chk_positive_balance CHECK (balance >= 0.00),\n  account_type VARCHAR(10) NOT NULL\n    CHECK (account_type IN (\'checking\', \'savings\', \'investment\'))\n);',
      },
    ],
    rulesTable: [
      { rule: 'NOT NULL', explanation: 'Prohibits NULL values in the specified column.' },
      { rule: 'UNIQUE', explanation: 'Guarantees that all non-null values in the column are distinct.' },
      { rule: 'CHECK', explanation: 'Validates arbitrary boolean conditions (e.g. price > 0).' },
      { rule: 'DEFAULT', explanation: 'Supplies a fallback value if omitted during INSERT.' },
    ],
    deepDive: {
      title: 'Database Constraints vs Application Validation',
      description: 'Application code validation is vulnerable to race conditions, multi-service bugs, and direct SQL script executions. Database-level constraints are ACID invariants enforced by the storage engine, making corrupted data physically impossible.',
      codeSnippet: '-- Guaranteed invariant across all microservices:\nALTER TABLE users ADD CONSTRAINT chk_email_format\n  CHECK (email ~* \'^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$\');',
      warning: 'Never rely solely on frontend or API validation for critical business rules like positive inventory or unique emails.',
    },
    advantages: ['Single source of truth for invariants.', 'Prevents corrupted records regardless of which microservice writes the data.'],
    disadvantages: ['Complex multi-table constraints require triggers or serialized transactions.'],
    interviewQuestions: [
      {
        question: 'Can a column with a UNIQUE constraint contain multiple NULL values in PostgreSQL?',
        answer: 'Yes. In ANSI SQL and PostgreSQL (prior to NULLS NOT DISTINCT in PG15), each NULL is considered distinct, so multiple NULLs are allowed in a UNIQUE column.',
      },
      {
        question: 'Why should business invariants be enforced with CHECK constraints rather than just application code?',
        answer: 'Because application validation cannot protect against concurrent race conditions, direct DBA maintenance scripts, or bugs across multiple microservices accessing the same database.',
      },
    ],
    interviewReadyAnswer: 'Constraints enforce schema-level invariants including NOT NULL, UNIQUE, CHECK, and DEFAULT. Defining invariants at the database layer ensures data integrity cannot be bypassed by application-level race conditions or multi-service bugs.',
    quickTest: {
      question: 'What happens if you execute: INSERT INTO bank_accounts (account_number, balance) VALUES (\'A100\', -50.00); when balance has CHECK (balance >= 0)?',
      options: [
        { key: 'A', text: 'The balance is clamped to 0.00 automatically.' },
        { key: 'B', text: 'The statement fails with a CHECK constraint violation error.' },
        { key: 'C', text: 'The balance is saved as NULL.' },
        { key: 'D', text: 'The row is saved with a warning.' },
      ],
      correctAnswer: 'B',
      explanation: 'CHECK constraints evaluate row values on INSERT and UPDATE; if the expression evaluates to FALSE, the statement immediately aborts.',
    },
    mentalModel: 'Security turnstile: Rejects anyone without a valid ticket or who doesn\'t meet height requirements.',
    codeSnippet: 'ALTER TABLE products ADD CONSTRAINT chk_price CHECK (price > 0.00);',
    takeaways: ['Constraints guarantee ACID invariants at the storage level.', 'CHECK constraints validate domain ranges and allowed strings.', 'UNIQUE constraints allow multiple NULLs unless NOT NULL is added.'],
    commonPitfall: { mistake: 'Relying exclusively on application validation and having duplicate records slip in under high-concurrency race conditions.', fix: 'Add a UNIQUE or CHECK constraint directly to the database table.' },
    nextTopicId: 'inner-join',
    prevTopicId: 'foreign-key',
  },
  {
    id: 'inner-join',
    topicNumber: 29,
    title: 'INNER JOIN',
    category: 'query-execution',
    difficulty: 'Intermediate',
    summary: 'Relational equi-joins, Cartesian product filtering, multi-table joins, and physical join operators (Nested Loop, Hash, Merge).',
    definition: 'An INNER JOIN matches and combines rows from two or more tables based on a join condition, returning only rows where the condition evaluates to TRUE in both tables.',
    eli5: 'Think of two puzzle pieces: an INNER JOIN only gives you the pieces that snap together perfectly. If a piece has no match on the other side, it gets tossed out.',
    realWorldExample: {
      description: 'Matching users with their orders.',
      tables: [
        {
          title: 'Users',
          headers: ['id', 'name'],
          rows: [
            [1, 'Alice'],
            [2, 'Bob'],
            [3, 'Charlie (No orders)'],
          ],
        },
        {
          title: 'Orders',
          headers: ['order_id', 'user_id', 'product'],
          rows: [
            [101, 1, 'Laptop'],
            [102, 2, 'Phone'],
          ],
        },
      ],
      explanation: 'Charlie is excluded from the result because he has no matching orders.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Two-table INNER JOIN',
        code: 'SELECT u.id, u.name, o.product, o.total_amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id;',
        note: 'Only rows where u.id = o.user_id are returned.',
      },
      {
        step: 'Step 2: Multi-table join',
        code: 'SELECT u.name, o.id AS order_id, p.name AS product_name\nFROM users u\nJOIN orders o ON u.id = o.user_id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id;',
        note: 'Joins propagate matching relations across multiple relational hops.',
      },
    ],
    rulesTable: [
      { rule: 'Unmatched Rows Discarded', explanation: 'Any row in either table without a corresponding match is excluded.' },
      { rule: 'Duplicate Key Multiplication', explanation: 'If a key matches 3 rows in table A and 2 rows in table B, the result contains 3 * 2 = 6 rows.' },
      { rule: 'INNER Keyword Optional', explanation: 'JOIN defaults to INNER JOIN if no outer modifier is specified.' },
    ],
    deepDive: {
      title: 'Physical Join Operators: Hash Join, Merge Join, Nested Loop',
      description: 'The Cost-Based Optimizer chooses among three physical join algorithms: 1) Nested Loop Join (scans table A and probes an index on B), 2) Hash Join (hashes smaller table into RAM and probes with larger table), 3) Merge Join (scans two pre-sorted inputs in lockstep).',
      codeSnippet: '-- EXPLAIN output showing physical join choice:\nEXPLAIN ANALYZE\nSELECT * FROM users u JOIN orders o ON u.id = o.user_id;\n-- "Hash Join (cost=2.15..18.40 rows=100 width=64)"\n-- "  Hash Cond: (o.user_id = u.id)"',
      warning: 'Missing indexes on join keys force slow Nested Loop joins or full-table Hash Joins.',
    },
    advantages: ['Extracts strictly related data across normalized relational entities.', 'Highly optimized by Cost-Based Optimizers.'],
    disadvantages: ['Omitting the ON join condition accidentally creates a massive Cartesian cross product.'],
    interviewQuestions: [
      {
        question: 'What happens if you omit the ON clause in an INNER JOIN?',
        answer: 'It results in a syntax error in modern SQL, or produces a Cartesian product (CROSS JOIN) where every row of table A pairs with every row of table B (N * M rows).',
      },
      {
        question: 'When does the query planner choose a Hash Join over a Nested Loop Join?',
        answer: 'The planner chooses a Hash Join when joining large unindexed tables where sorting is expensive. It chooses a Nested Loop when one table is very small and the other table has a B-Tree index on the join key.',
      },
    ],
    interviewReadyAnswer: 'An INNER JOIN returns rows that satisfy the join predicate in both tables, discarding unmatched records. Database engines execute joins physically using Nested Loop, Hash Join, or Merge Join strategies depending on table sizes and index presence.',
    quickTest: {
      question: 'Table A has 4 rows; Table B has 5 rows. No rows match the join condition A.id = B.a_id. How many rows does "SELECT * FROM A JOIN B ON A.id = B.a_id" return?',
      options: [
        { key: 'A', text: '4' },
        { key: 'B', text: '5' },
        { key: 'C', text: '0' },
        { key: 'D', text: '20' },
      ],
      correctAnswer: 'C',
      explanation: 'An INNER JOIN strictly returns rows with matching keys on both sides; with zero matches, 0 rows are returned.',
    },
    mentalModel: 'Matching socks: Only pairs of socks that have a matching partner come out of the laundry basket; lone socks are left behind.',
    codeSnippet: 'SELECT c.name, o.order_date, o.total\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.total > 500;',
    takeaways: ['INNER JOIN only returns matching records from both sides.', 'Engineers must index join columns (e.g. foreign keys).', 'Engines use Nested Loop, Hash Join, or Merge Join algorithms.'],
    commonPitfall: { mistake: 'Joining on columns with mismatched data types, preventing index lookups.', fix: 'Ensure foreign keys and primary keys have identical physical types.' },
    nextTopicId: 'left-and-right-join',
    prevTopicId: 'constraints-integrity',
  },
  {
    id: 'left-and-right-join',
    topicNumber: 30,
    title: 'LEFT & RIGHT JOIN',
    category: 'query-execution',
    difficulty: 'Intermediate',
    summary: 'Preserving outer table rows, NULL padding for unmatched records, anti-joins, and why RIGHT JOIN is rarely used in practice.',
    definition: 'A LEFT JOIN returns all rows from the left table, along with matching rows from the right table; if no match exists, NULLs are returned for right-table columns.',
    eli5: 'Think of attendance at a party: Every invited guest on your list is recorded (left table). If they brought a gift (right table), the gift is recorded; if they did not, the gift column says NULL.',
    realWorldExample: {
      description: 'Finding all customers and any orders they placed, including customers who have never ordered.',
      tables: [
        {
          title: 'Left Join Result',
          headers: ['Customer', 'Order ID', 'Total'],
          rows: [
            ['Alice', 101, '$120.00'],
            ['Bob', 102, '$85.00'],
            ['Charlie (Preserved)', 'NULL', 'NULL'],
          ],
        },
      ],
      explanation: 'Charlie is preserved even though he has no orders.',
    },
    sqlSyntaxSteps: [
      {
        step: 'Step 1: Preserving left table with LEFT JOIN',
        code: 'SELECT c.id, c.name, o.id AS order_id, o.total_amount\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;',
        note: 'Every customer appears at least once.',
      },
      {
        step: 'Step 2: Anti-Join pattern (Finding rows with NO matches)',
        code: 'SELECT c.id, c.name\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;',
        note: 'Filters for customers who have NEVER placed an order.',
      },
    ],
    rulesTable: [
      { rule: 'All Left Rows Kept', explanation: 'Every row from the left table is preserved in the output at least once.' },
      { rule: 'NULL Padding', explanation: 'If no match is found on the right table, all right table columns are populated with NULL.' },
      { rule: 'RIGHT JOIN Equivalence', explanation: 'A RIGHT JOIN B is logically identical to B LEFT JOIN A. Standard practice standardizes on LEFT JOIN.' },
    ],
    deepDive: {
      title: 'The Accidental Demotion of LEFT JOIN to INNER JOIN',
      description: 'A notorious bug occurs when developers write a LEFT JOIN, and then put a filter on the right table in the WHERE clause: WHERE orders.status = "completed". Because orders.status IS NULL for unmatched customers, and NULL = "completed" evaluates to UNKNOWN, all non-ordering customers are discarded, converting the LEFT JOIN into an accidental INNER JOIN!',
      codeSnippet: '-- ACCIDENTAL INNER JOIN (filters out customers without orders!):\nSELECT c.name, o.total\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.status = \'completed\';\n\n-- FIXED (Filter placed inside the ON clause preserves customers):\nSELECT c.name, o.total\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id AND o.status = \'completed\';',
      warning: 'Filtering right-table columns in WHERE silently converts a LEFT JOIN into an INNER JOIN.',
    },
    advantages: ['Preserves master entity records even when child records do not exist.', 'Anti-join pattern (WHERE right.id IS NULL) efficiently identifies missing data.'],
    disadvantages: ['Accidental WHERE filters demote outer joins to inner joins.'],
    interviewQuestions: [
      {
        question: 'How do you find all records in Table A that have no matching record in Table B?',
        answer: 'Use a LEFT JOIN followed by a WHERE clause checking that the primary key of Table B IS NULL: SELECT A.* FROM A LEFT JOIN B ON A.id = B.a_id WHERE B.id IS NULL.',
      },
      {
        question: 'Why do most SQL style guides recommend avoiding RIGHT JOIN?',
        answer: 'Because RIGHT JOIN requires the developer to read query logic backwards (right to left). Standardizing on LEFT JOIN keeps query data flow reading consistently from top-to-bottom and left-to-right.',
      },
    ],
    interviewReadyAnswer: 'A LEFT JOIN preserves every row from the left table, populating right-table columns with NULL when no match exists. Placing filters on the right table inside the WHERE clause accidentally demotes it to an INNER JOIN; filters on outer tables must remain in the ON condition.',
    quickTest: {
      question: 'How does placing "WHERE orders.status = \'shipped\'" affect a query that uses "FROM customers LEFT JOIN orders ON customers.id = orders.customer_id"?',
      options: [
        { key: 'A', text: 'It has no effect on customers without orders.' },
        { key: 'B', text: 'It silently converts the LEFT JOIN into an INNER JOIN, eliminating customers with no orders.' },
        { key: 'C', text: 'It causes a syntax error.' },
        { key: 'D', text: 'It updates the orders table.' },
      ],
      correctAnswer: 'B',
      explanation: 'Because orders.status is NULL for customers with no orders, the WHERE clause discards those rows, effectively turning the query into an INNER JOIN.',
    },
    mentalModel: 'Master Guest List: Every invited guest has a line on your clipboard; if they checked a coat, the ticket number is written; if not, the box is blank (NULL).',
    codeSnippet: 'SELECT u.name, COUNT(o.id) AS total_orders\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.name;',
    takeaways: ['LEFT JOIN preserves all rows from the left table.', 'Unmatched rows receive NULL for right-table columns.', 'Put right-table filters in the ON clause to prevent demoting to INNER JOIN.'],
    commonPitfall: { mistake: 'Putting right-table predicates in the WHERE clause, inadvertently dropping left-table rows.', fix: 'Move the predicate into the ON clause: LEFT JOIN orders o ON ... AND o.status = "active".' },
    nextTopicId: 'full-outer-join',
    prevTopicId: 'inner-join',
  },
];
