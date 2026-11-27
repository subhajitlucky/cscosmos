import type { DBMSLesson } from './types';

export const relationalLessons: DBMSLesson[] = [
  {
    chapterId: 'relational-model',
    plainEnglish: 'A table is a sheet of graph paper: columns are labels and rows are records.',
    hook:
      'The relational model is deceptively simple: data lives in tables, and queries describe the result instead of the navigation path.',
    objectives: [
      'Define relation, tuple, attribute, domain, degree, and cardinality.',
      'Distinguish a schema from an instance.',
      'Explain why the relational model is declarative.',
      'Read a relation as a set of tuples.',
    ],
    sections: [
      {
        title: 'Relations, tuples, and attributes',
        body:
          'A relation is a table with a fixed set of columns. A tuple is a row. An attribute is a named column. A domain is the set of allowed values for an attribute, such as integers or dates. The degree is the number of attributes; the cardinality is the number of tuples. A relation is a set, so duplicate rows are not allowed in the pure model.',
        code: String.raw`Student(id, name, age)

degree = 3
cardinality = 4

{ (1, Ada, 21),
  (2, Grace, 22),
  (3, Linus, 20),
  (4, Margaret, 23) }`,
      },
      {
        title: 'Schema versus instance',
        body:
          'The schema is the structure: relation names, attributes, domains, and constraints. The instance is the data at a particular moment. The schema changes rarely; the instance changes constantly. A database catalog stores the schema and metadata.',
      },
      {
        title: 'Declarative access',
        body:
          'In the relational model, you describe the result you want, not the pointer path to it. The DBMS chooses an execution plan using indexes, statistics, and join algorithms. This logical independence is why relational systems became the default for general-purpose data.',
      },
    ],
    keyTakeaways: [
      'A relation is a table; a tuple is a row; an attribute is a column.',
      'A domain defines the allowed values of an attribute.',
      'Degree counts attributes; cardinality counts tuples.',
      'The schema is structure; the instance is current data.',
      'Relational queries are declarative.',
    ],
    pitfalls: [
      'Confusing degree with cardinality.',
      'Assuming a table must have a primary key in the pure model; keys are constraints.',
      'Forgetting that a relation is a set, not a bag.',
    ],
    focusPoints: [
      'Compute degree and cardinality from a small table.',
      'Give an example of a domain.',
      'Explain declarative versus navigational access.',
    ],
    quiz: [
      {
        question: 'What is the degree of a relation?',
        options: ['The number of rows', 'The number of attributes', 'The number of keys', 'The number of users'],
        answer: 1,
        explanation: 'Degree is the number of attributes (columns).',
      },
      {
        question: 'What is the cardinality of a relation?',
        options: ['The number of rows', 'The number of columns', 'The number of constraints', 'The number of indexes'],
        answer: 0,
        explanation: 'Cardinality is the number of tuples (rows).',
      },
    ],
  },

  {
    chapterId: 'codd-rules',
    plainEnglish: 'Codd\'s rules are a checklist for what counts as a proper table-based database.',
    hook:
      'Codd\'s rules are a checklist for what "relational" really means. Real systems follow some rules fully and bend others.',
    objectives: [
      'List the core ideas behind Codd\'s 12 rules.',
      'Explain the information, guaranteed access, and view rules.',
      'Distinguish logical and physical independence rules.',
      'Know where real DBMSs compromise.',
    ],
    sections: [
      {
        title: 'The foundation rules',
        body:
          'Rule 0 says the system must qualify as relational. The information rule says all data, including metadata, is stored in tables. The guaranteed-access rule says every value must be addressable by table name, primary key, and column. Systematic null handling says nulls must be distinct from any actual value.',
        code: String.raw`SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Student';

/* metadata such as column names and types is itself stored in tables */`,
      },
      {
        title: 'Catalog, views, and independence',
        body:
          'The catalog rule says the system catalog is stored relationally. The view rule says views are virtual relations. The logical and physical independence rules say changes at one level should not break the levels above. These rules are the backbone of portable, maintainable database design.',
      },
      {
        title: 'Integrity, distribution, and non-subversion',
        body:
          'The integrity rules require entity and referential integrity to be enforced by the DBMS. The distribution rule allows a distributed database to look like one system. The non-subversion rule says no lower-level language or tool may bypass the constraints. Real systems often expose bulk-load or administrative bypasses, so the rule is aspirational in places.',
      },
    ],
    keyTakeaways: [
      'Codd\'s rules define the properties of a relational DBMS.',
      'All data and metadata should be represented in tables.',
      'Logical and physical independence are explicit rules.',
      'Integrity must be enforced by the DBMS, not only by applications.',
      'Real systems compromise on some rules.',
    ],
    pitfalls: [
      'Memorizing rule numbers without understanding the principles.',
      'Assuming every SQL database is fully relational by Codd\'s definition.',
      'Ignoring the non-subversion rule when designing bulk operations.',
    ],
    focusPoints: [
      'Explain the information and guaranteed-access rules.',
      'Know which rules cover independence.',
      'Give one example of a real-system compromise.',
    ],
    quiz: [
      {
        question: 'Which rule says all data, including metadata, is stored in tables?',
        options: ['Information rule', 'View rule', 'Non-subversion rule', 'Distribution rule'],
        answer: 0,
        explanation:
          'The information rule requires all data and metadata to be represented as values in relations.',
      },
      {
        question: 'What does the non-subversion rule forbid?',
        options: [
          'Bypassing integrity constraints through another interface',
          'Using views',
          'Creating indexes',
          'Storing data in tables',
        ],
        answer: 0,
        explanation:
          'No lower-level tool or language should be able to bypass the relational constraints.',
      },
    ],
  },

  {
    chapterId: 'relational-algebra-selection',
    plainEnglish: 'Selection picks rows; projection picks columns. It is like choosing which students to show and which facts about them.',
    walkthrough: { kind: 'algebra', operation: 'selection' },
    hook:
      'Selection chooses rows; projection chooses columns. They are the first two moves in almost every query plan.',
    objectives: [
      'Apply selection σ with a predicate.',
      'Apply projection π and know when duplicates disappear.',
      'Compose selection and projection.',
      'Read relational algebra notation.',
    ],
    sections: [
      {
        title: 'Selection σ',
        body:
          'Selection filters tuples that satisfy a predicate. σ_age ≥ 21 (Student) returns only students aged 21 or older. Selection does not change the schema; it returns the same columns with fewer rows.',
        code: String.raw`Student(id, name, age)
1 Ada 21
2 Grace 22
3 Linus 20

σ_age >= 21 (Student) -> Ada, Grace`,
      },
      {
        title: 'Projection π',
        body:
          'Projection chooses a subset of attributes. π_name, age (Student) returns only the name and age columns. Because a relation is a set, duplicate rows are eliminated. In SQL, SELECT DISTINCT makes that explicit; SELECT without DISTINCT uses bag semantics.',
        code: String.raw`π_name (Student) -> {Ada}, {Grace}, {Linus}

π_age (Student) -> {21}, {22}, {20}
/* if two students were 21, projection would return one 21 */`,
      },
      {
        title: 'Composition',
        body:
          'Operators compose. π_name (σ_age ≥ 21 (Student)) first filters rows, then projects columns. The order matters for performance and sometimes for the result when duplicates are involved. The optimizer may reorder operations as long as the result is equivalent.',
      },
    ],
    keyTakeaways: [
      'Selection filters rows; projection filters columns.',
      'Selection keeps the schema; projection changes it.',
      'Projection eliminates duplicates under set semantics.',
      'Operators can be composed and nested.',
      'SQL SELECT is closer to projection, WHERE to selection.',
    ],
    pitfalls: [
      'Confusing selection with projection.',
      'Forgetting duplicate elimination in projection.',
      'Assuming SQL SELECT always removes duplicates; it does not without DISTINCT.',
    ],
    focusPoints: [
      'Write σ and π expressions for a small table.',
      'Explain why projection can reduce cardinality.',
      'Trace the order of operations in a composed expression.',
    ],
    quiz: [
      {
        question: 'Which operator filters rows?',
        options: ['Projection π', 'Selection σ', 'Union ∪', 'Join ⋈'],
        answer: 1,
        explanation: 'Selection σ keeps tuples that satisfy a predicate.',
      },
      {
        question: 'What does projection do?',
        options: ['Chooses a subset of attributes', 'Chooses a subset of rows', 'Sorts rows', 'Creates an index'],
        answer: 0,
        explanation: 'Projection π returns only the listed attributes.',
      },
    ],
  },

  {
    chapterId: 'relational-algebra-set-ops',
    plainEnglish: 'Combine two name lists: union is everyone, intersection is people on both lists, and difference is people only on the first list.',
    hook:
      'Set operations combine whole relations. The catch is union compatibility: the two inputs must have the same shape.',
    objectives: [
      'State the union-compatibility requirement.',
      'Apply union, intersection, and difference.',
      'Know the difference between set and bag semantics.',
      'Recognize when a set operation is invalid.',
    ],
    sections: [
      {
        title: 'Union compatibility',
        body:
          'Two relations are union-compatible when they have the same number of attributes and corresponding attributes have compatible domains. Names need not match, but the positions must line up. Without compatibility, union, intersection, and difference are undefined.',
        code: String.raw`A(name, age) and B(student_name, years) are compatible
A(name, age) and B(name) are not compatible`,
      },
      {
        title: 'Union, intersection, difference',
        body:
          'Union returns tuples in either relation. Intersection returns tuples in both. Difference returns tuples in the first but not the second. All three eliminate duplicates under set semantics.',
        code: String.raw`A = {1,2,3}
B = {3,4}

A ∪ B = {1,2,3,4}
A ∩ B = {3}
A - B = {1,2}`,
      },
      {
        title: 'Set versus bag semantics',
        body:
          'The relational model uses sets, so duplicates disappear. SQL tables are bags by default: UNION ALL keeps duplicates, UNION removes them. Knowing which semantics you are using is essential when counting rows or comparing query results.',
      },
    ],
    keyTakeaways: [
      'Set operations require union-compatible relations.',
      'Union combines, intersection keeps common tuples, difference subtracts.',
      'Set semantics eliminate duplicates.',
      'SQL distinguishes UNION from UNION ALL.',
      'Compatibility is about shape and domains, not column names.',
    ],
    pitfalls: [
      'Applying union to relations with different degrees.',
      'Assuming SQL UNION ALL removes duplicates.',
      'Ignoring domain compatibility even when positions match.',
    ],
    focusPoints: [
      'Test two relations for union compatibility.',
      'Compute union, intersection, and difference on small sets.',
      'Explain set versus bag semantics.',
    ],
    quiz: [
      {
        question: 'What is required for union compatibility?',
        options: [
          'Same degree and compatible domains',
          'Same table name',
          'Same primary key',
          'Same number of rows',
        ],
        answer: 0,
        explanation:
          'The relations must have the same number of attributes with compatible domains in the same positions.',
      },
      {
        question: 'Which operation returns tuples in A but not in B?',
        options: ['Union', 'Intersection', 'Difference', 'Cartesian product'],
        answer: 2,
        explanation: 'Set difference A − B keeps tuples that belong to A and not to B.',
      },
    ],
  },

  {
    chapterId: 'relational-algebra-joins',
    plainEnglish: 'A join matches two lists by a shared ID, like pairing students with their course cards.',
    walkthrough: { kind: 'algebra', operation: 'join' },
    hook:
      'A join is a Cartesian product followed by a filter. That one sentence explains both why joins are powerful and why they can explode in size.',
    objectives: [
      'Compute a Cartesian product and its cardinality.',
      'Apply theta, equi, and natural joins.',
      'Know which columns a natural join keeps.',
      'Explain why join order matters for performance.',
    ],
    sections: [
      {
        title: 'Cartesian product',
        body:
          'The Cartesian product A × B pairs every tuple of A with every tuple of B. If A has m tuples and B has n, the result has m × n tuples and degree(A) + degree(B) attributes. It is rarely useful alone, but it is the foundation of joins.',
        code: String.raw`A = {a1, a2}, B = {b1, b2}
A × B = {(a1,b1),(a1,b2),(a2,b1),(a2,b2)}
cardinality = 2 × 2 = 4`,
      },
      {
        title: 'Theta and equi joins',
        body:
          'A theta join A ⋈θ B is σθ(A × B): pair the tuples, then keep the pairs that satisfy θ. An equi join uses equality, such as Student.id = Enroll.student_id. The join condition can compare columns from either relation.',
        code: String.raw`Student(id, name)
Enroll(student_id, course)

Student ⋈ Student.id = Enroll.student_id Enroll`,
      },
      {
        title: 'Natural join',
        body:
          'A natural join matches tuples on all attributes with the same name and keeps one copy of each shared column. It is convenient when schemas are designed with consistent names, but dangerous when a shared name is accidental. Explicit join conditions are safer in production queries.',
        code: String.raw`Student(id, name)
Enroll(id, course)

Student ⋈ Enroll  /* matches on id, keeps one id */`,
      },
    ],
    keyTakeaways: [
      'Cartesian product pairs every tuple with every tuple.',
      'A theta join is a Cartesian product plus a predicate.',
      'An equi join uses equality in the predicate.',
      'A natural join matches all shared attribute names.',
      'Join order affects cost even when the result is the same.',
    ],
    pitfalls: [
      'Forgetting the join predicate and accidentally creating a Cartesian product.',
      'Assuming a natural join is always safe.',
      'Ignoring the cardinality explosion of a product.',
    ],
    focusPoints: [
      'Compute the cardinality of a Cartesian product.',
      'Write a theta join for two small relations.',
      'Explain the difference between equi and natural join.',
    ],
    quiz: [
      {
        question: 'If A has 3 tuples and B has 4, how many tuples does A × B have?',
        options: ['7', '12', '3', '4'],
        answer: 1,
        explanation: 'The Cartesian product pairs every tuple, so 3 × 4 = 12.',
      },
      {
        question: 'What does a natural join match on?',
        options: ['All attributes with the same name', 'The primary key only', 'Every attribute regardless of name', 'No attributes'],
        answer: 0,
        explanation:
          'A natural join matches on all shared attribute names and keeps one copy of them.',
      },
    ],
  },

  {
    chapterId: 'keys',
    plainEnglish: 'A key is a name tag that no one else in the room can have.',
    hook:
      'A key is a promise: no two rows share this value, and the database will enforce it.',
    objectives: [
      'Define superkey, candidate key, primary key, alternate key, and foreign key.',
      'Find candidate keys in a small relation.',
      'Explain referential integrity.',
      'Know the difference between a key and an index.',
    ],
    sections: [
      {
        title: 'Superkeys and candidate keys',
        body:
          'A superkey is any set of attributes that uniquely identifies a tuple. A candidate key is a minimal superkey: removing any attribute breaks uniqueness. A relation can have several candidate keys. The primary key is the chosen candidate key; the others are alternate keys.',
        code: String.raw`Student(id, email, name)
id -> unique
email -> unique
(id, name) -> superkey but not minimal
candidate keys: {id}, {email}
primary key: id
alternate key: email`,
      },
      {
        title: 'Foreign keys',
        body:
          'A foreign key is a set of attributes in one relation that references a candidate key in another relation. It enforces referential integrity: every non-null foreign-key value must match an existing referenced tuple. Foreign keys are how relationships are represented in the relational model.',
      },
      {
        title: 'Keys versus indexes',
        body:
          'A key is a logical constraint. An index is a physical access structure. A primary key is usually indexed, but an index does not make a column unique unless it is declared unique. Confusing the two leads to schemas that look correct but allow duplicates.',
      },
    ],
    keyTakeaways: [
      'A superkey uniquely identifies a tuple; a candidate key is minimal.',
      'The primary key is the chosen candidate key; the rest are alternate keys.',
      'A foreign key references a candidate key in another relation.',
      'Referential integrity requires foreign keys to match existing rows.',
      'A key is a constraint, not an index.',
    ],
    pitfalls: [
      'Calling every unique column a primary key.',
      'Forgetting that a foreign key can be NULL unless declared NOT NULL.',
      'Assuming an index enforces uniqueness.',
    ],
    focusPoints: [
      'Find all candidate keys in a small relation.',
      'Distinguish primary, alternate, and foreign keys.',
      'Explain referential integrity with an example.',
    ],
    quiz: [
      {
        question: 'What is a candidate key?',
        options: ['A minimal superkey', 'Any index', 'A foreign key', 'A non-unique column'],
        answer: 0,
        explanation:
          'A candidate key is a minimal set of attributes that uniquely identifies each tuple.',
      },
      {
        question: 'What does a foreign key enforce?',
        options: ['Referential integrity', 'Domain independence', 'Physical independence', 'Normalization'],
        answer: 0,
        explanation:
          'A foreign key ensures that a value references an existing tuple in another relation.',
      },
    ],
  },

  {
    chapterId: 'integrity-constraints',
    plainEnglish: 'These are house rules: every room needs a number, and every key must open a real door.',
    hook:
      'Constraints are the database\'s promises. If the data violates them, the DBMS rejects the change instead of letting the application decide.',
    objectives: [
      'Explain entity, domain, and referential integrity.',
      'Use NOT NULL, UNIQUE, CHECK, and foreign keys.',
      'Know when to cascade and when to restrict.',
      'Distinguish column constraints from table constraints.',
    ],
    sections: [
      {
        title: 'Entity and domain integrity',
        body:
          'Entity integrity requires every tuple to have a non-null primary key, so each row is identifiable. Domain integrity requires every value to belong to the attribute\'s domain: correct type, allowed range, and valid format. CHECK constraints and NOT NULL enforce domain rules; data types enforce the basic domain.',
        code: String.raw`CREATE TABLE Student (
    id      INTEGER PRIMARY KEY,
    name    TEXT NOT NULL,
    age     INTEGER CHECK (age >= 0 AND age <= 150)
);`,
      },
      {
        title: 'Referential integrity',
        body:
          'A foreign key must match an existing referenced key or be NULL. When a referenced row is deleted or updated, the database must choose an action. RESTRICT blocks the change. CASCADE propagates it. SET NULL clears the reference, and SET DEFAULT assigns a default. The right action depends on the business rule, not on convenience.',
      },
      {
        title: 'Column versus table constraints',
        body:
          'A column constraint applies to one attribute. A table constraint can span several attributes, such as a composite primary key or a CHECK comparing two columns. Name your constraints so errors are readable and migrations are manageable.',
      },
    ],
    keyTakeaways: [
      'Entity integrity: no null primary keys.',
      'Domain integrity: values must be valid for their type and rules.',
      'Referential integrity: foreign keys must match existing rows or be NULL.',
      'CASCADE, RESTRICT, SET NULL, and SET DEFAULT are delete/update actions.',
      'Table constraints can enforce multi-column rules.',
    ],
    pitfalls: [
      'Assuming a data type alone enforces all domain rules.',
      'Using CASCADE without understanding the business rule.',
      'Forgetting that NULL foreign keys are allowed unless declared otherwise.',
    ],
    focusPoints: [
      'Write a table with primary, foreign, and CHECK constraints.',
      'Choose cascade versus restrict for a concrete relationship.',
      'Explain entity, domain, and referential integrity in one sentence each.',
    ],
    quiz: [
      {
        question: 'What does entity integrity require?',
        options: ['A non-null primary key', 'A foreign key', 'A unique index', 'A CHECK constraint on every column'],
        answer: 0,
        explanation:
          'Entity integrity ensures every tuple can be uniquely identified by a non-null primary key.',
      },
      {
        question: 'What does ON DELETE CASCADE do?',
        options: [
          'Deletes referencing rows when the referenced row is deleted',
          'Blocks the delete',
          'Sets the foreign key to NULL',
          'Creates a new index',
        ],
        answer: 0,
        explanation:
          'Cascade propagates the delete to rows that reference the deleted key.',
      },
    ],
  },

  {
    chapterId: 'assertions-triggers',
    plainEnglish: 'An assertion is a house rule; a trigger is an alarm that rings when something changes.',
    hook:
      'Some rules span tables or need procedural logic. Assertions and triggers let the database enforce behavior that a simple constraint cannot.',
    objectives: [
      'Explain what an assertion checks.',
      'Distinguish before and after triggers.',
      'Know row-level versus statement-level triggers.',
      'Recognize the risks of trigger logic.',
    ],
    sections: [
      {
        title: 'Assertions',
        body:
          'An assertion is a condition that the database must always satisfy. It can reference multiple tables and is checked when relevant changes occur. Assertions are declarative and powerful, but support varies across DBMSs and complex assertions can be expensive to check.',
        code: String.raw`CREATE ASSERTION valid_enrollment
CHECK (
    NOT EXISTS (
        SELECT * FROM Enroll
        WHERE grade IS NOT NULL
          AND student_id NOT IN (SELECT id FROM Student)
    )
);`,
      },
      {
        title: 'Trigger events and timing',
        body:
          'A trigger fires on INSERT, UPDATE, or DELETE. A BEFORE trigger can validate or modify the incoming row; an AFTER trigger can propagate changes or write an audit record. A row-level trigger fires once per affected row; a statement-level trigger fires once per statement.',
        code: String.raw`CREATE TRIGGER audit_update
AFTER UPDATE ON Student
FOR EACH ROW
BEGIN
    INSERT INTO Audit(student_id, changed_at)
    VALUES (OLD.id, CURRENT_TIMESTAMP);
END;`,
      },
      {
        title: 'Risks and best practices',
        body:
          'Triggers hide logic in the database, can fire recursively, and can make bulk operations slow or unpredictable. Keep them small, document them, and avoid using them for business workflows that belong in the application. Assertions are better for declarative invariants; triggers are better for auditing and tightly coupled integrity rules.',
      },
    ],
    keyTakeaways: [
      'Assertions declare global conditions that must hold.',
      'Triggers run procedural code on data changes.',
      'BEFORE triggers can validate or modify; AFTER triggers can propagate or audit.',
      'Row-level triggers fire per row; statement-level triggers fire per statement.',
      'Triggers can hide complexity and cause recursive side effects.',
    ],
    pitfalls: [
      'Using triggers for complex business workflows.',
      'Forgetting that a trigger may fire during a bulk load.',
      'Assuming every DBMS supports assertions identically.',
    ],
    focusPoints: [
      'Write a small AFTER trigger for auditing.',
      'Explain the difference between BEFORE and AFTER.',
      'Know when an assertion is preferable to a trigger.',
    ],
    quiz: [
      {
        question: 'Which trigger timing can modify the incoming row before it is stored?',
        options: ['BEFORE', 'AFTER', 'INSTEAD OF only', 'No trigger can'],
        answer: 0,
        explanation:
          'A BEFORE trigger runs before the row is written and can validate or adjust it.',
      },
      {
        question: 'What is an assertion?',
        options: [
          'A declarative condition the database must always satisfy',
          'A stored procedure',
          'An index',
          'A foreign key',
        ],
        answer: 0,
        explanation:
          'An assertion is a database-wide condition that must remain true.',
      },
    ],
  },
];
