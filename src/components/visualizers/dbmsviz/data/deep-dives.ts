export interface DBMSDeepDive {
  oneIdea: string;
  whyItMatters: string;
  example: {
    title: string;
    scenario: string;
    steps: { action: string; result: string }[];
    conclusion: string;
  };
  tradeoff: {
    gain: string;
    cost: string;
    verdict: string;
  };
  terms: { term: string; definition: string }[];
}

export const dbmsDeepDives: Record<string, DBMSDeepDive> = {
  'dbms-introduction': {
    oneIdea:
      "A DBMS is a contract: applications describe what data they need, and the DBMS guarantees how it is stored, shared, and protected.",
    whyItMatters:
      "The moment two users write at once, or one process crashes mid-update, a folder of files stops being enough. The DBMS is the component that turns those failure cases into rules.",
    example: {
      title: "The last seat in a course",
      scenario:
        "A course has one seat left. Two students press Enroll at the same instant, and the registrar application talks to a DBMS.",
      steps: [
        {
          action: "Both sessions read seats_left = 1.",
          result: "Each application believes there is room.",
        },
        {
          action: "The first transaction decrements the seat count and commits.",
          result: "The DBMS makes the new value durable and visible.",
        },
        {
          action: "The second transaction tries to write zero again.",
          result: "The constraint check sees no seat left and rejects the enrollment.",
        },
      ],
      conclusion:
        "Without a DBMS, both programs could read 1, both could write 0, and the course would be oversold. The database is not just storage; it is the referee.",
    },
    tradeoff: {
      gain: "One contract for concurrency, recovery, integrity, and access control.",
      cost: "A server process, administration, query overhead, and a schema that must be designed deliberately.",
      verdict: "Worth it as soon as more than one writer, more than one user, or one crash matters.",
    },
    terms: [
      {
        term: "Metadata",
        definition: "Data about the data: table names, column types, keys, constraints, and access rules.",
      },
      {
        term: "Data independence",
        definition: "The ability to change how data is stored without rewriting the applications that use it.",
      },
    ],
  },

  'dbms-architecture': {
    oneIdea:
      "Three schemas let one stored database serve many views without rewriting the data for each consumer.",
    whyItMatters:
      "A registrar, an advisor, and a student app can all read the same database through different external schemas while the physical storage changes underneath them.",
    example: {
      title: "One database, three views",
      scenario:
        "A university stores students, courses, and enrollments. Three consumers need different slices of the same data.",
      steps: [
        {
          action: "The registrar opens the full student record, including contact details.",
          result: "The external schema exposes every approved column.",
        },
        {
          action: "An advisor opens only advisees and their current courses.",
          result: "The external schema filters rows and hides sensitive columns.",
        },
        {
          action: "The storage team adds an index on student_id.",
          result: "The conceptual and external schemas do not change; queries simply run faster.",
        },
      ],
      conclusion:
        "The three-schema architecture separates what users see, what the database means, and how it is stored. That separation is what makes a database maintainable.",
    },
    tradeoff: {
      gain: "Logical and physical independence, plus a place to enforce security.",
      cost: "More catalog objects, mapping logic, and a design step that cannot be skipped.",
      verdict: "Essential for shared systems; overkill for a single-user local file.",
    },
    terms: [
      {
        term: "External schema",
        definition: "A user-facing view of the conceptual schema, often restricted in rows or columns.",
      },
      {
        term: "Logical data independence",
        definition: "Changing the conceptual schema without changing external schemas or applications.",
      },
    ],
  },

  'data-models-overview': {
    oneIdea:
      "A data model is a vocabulary for structure, constraints, and operations; choose the one that matches the relationships in the domain.",
    whyItMatters:
      "The model decides which questions are cheap to ask. A tree is excellent for a hierarchy and awkward for a graph with shared members.",
    example: {
      title: "The org chart that became a graph",
      scenario:
        "A company starts with a strict hierarchy: every employee reports to one manager.",
      steps: [
        {
          action: "Store the company as a tree of divisions, departments, and employees.",
          result: "Hierarchical navigation is fast and simple.",
        },
        {
          action: "A senior engineer joins two projects in different divisions.",
          result: "The tree must duplicate the employee or add a pointer that the model does not own.",
        },
        {
          action: "Move the shared relationships into a graph-like model.",
          result: "The employee becomes one node with many connections.",
        },
      ],
      conclusion:
        "The model is not a neutral container. It is a claim about which relationships are first-class.",
    },
    tradeoff: {
      gain: "A model that makes the common query natural and the schema understandable.",
      cost: "Every model hides some other query or forces a workaround.",
      verdict: "Choose for the relationships you cannot afford to fake.",
    },
    terms: [
      {
        term: "Schema",
        definition: "The structure of the data: types, relationships, and constraints.",
      },
      {
        term: "Instance",
        definition: "The actual data stored at one moment under a given schema.",
      },
    ],
  },

  'erd-fundamentals': {
    oneIdea:
      "An ERD is a contract sketch: entities are nouns, relationships are verbs, and attributes are the facts you must remember.",
    whyItMatters:
      "Most schema bugs are modeling bugs that were visible in the diagram. Drawing the relationship before the tables exposes ambiguous business rules early.",
    example: {
      title: "A library loan is not a book",
      scenario:
        "A library wants to record who borrowed which book and when it is due.",
      steps: [
        {
          action: "Draw Member and Book as entities and Borrow as a relationship.",
          result: "The diagram says a member borrows a book.",
        },
        {
          action: "Add borrowed_on and due_on to Borrow.",
          result: "The relationship now carries facts that belong to the event, not to the book.",
        },
        {
          action: "Allow the same member to borrow the same book again later.",
          result: "Borrow becomes its own entity, Loan, with a loan_id and a history.",
        },
      ],
      conclusion:
        "A relationship with attributes is often an entity in disguise. The ERD lets you see that before a table forces the issue.",
    },
    tradeoff: {
      gain: "A shared picture of the domain that non-programmers can review.",
      cost: "A diagram can become too detailed to read, and it is not automatically a good physical schema.",
      verdict: "Keep the conceptual diagram readable; move implementation details into the relational design.",
    },
    terms: [
      {
        term: "Entity",
        definition: "A thing with an independent identity, such as Student, Course, or Loan.",
      },
      {
        term: "Attribute",
        definition: "A property of an entity or relationship, such as a title or a due date.",
      },
    ],
  },

  'erd-relationships': {
    oneIdea:
      "Cardinality and participation decide where the foreign key goes and whether it is allowed to be null.",
    whyItMatters:
      "Wrong cardinality produces duplicate rows, impossible relationships, or a junction table that should not exist. The diagram is where that error is cheapest to fix.",
    example: {
      title: "Department, professor, and course",
      scenario:
        "A university has departments, professors, and courses. A department has many professors. A professor can teach many courses, and a course can have many professors.",
      steps: [
        {
          action: "Place department_id as a foreign key in Professor.",
          result: "The 1:N relationship is stored on the many side.",
        },
        {
          action: "Create Teaching(professor_id, course_id) for the M:N relationship.",
          result: "Neither professor nor course needs a repeating group.",
        },
        {
          action: "Give each professor at most one office.",
          result: "A unique foreign key or a separate 1:1 table enforces the rule.",
        },
      ],
      conclusion:
        "The foreign key always lives on the many side of a 1:N relationship. M:N requires a junction relation. 1:1 needs a uniqueness rule.",
    },
    tradeoff: {
      gain: "Relationships that cannot be represented incorrectly by accident.",
      cost: "Optional relationships require nullable foreign keys, which weakens some constraints.",
      verdict: "Model participation explicitly: ask whether every entity must participate, not just whether it may.",
    },
    terms: [
      {
        term: "Cardinality",
        definition: "The maximum number of entities on one side that can participate with one entity on the other.",
      },
      {
        term: "Participation",
        definition: "Whether every entity must participate in a relationship or only some may.",
      },
    ],
  },

  'hierarchical-model': {
    oneIdea:
      "A hierarchical database stores a tree: one parent, many children, and fast navigation along a known path.",
    whyItMatters:
      "It explains why early databases were fast for bills of materials and awkward for many-to-many relationships. The trade-off still appears in modern document and directory stores.",
    example: {
      title: "A shared part in a bill of materials",
      scenario:
        "An assembly contains subassemblies, and the same bolt is used in two different subassemblies.",
      steps: [
        {
          action: "Store Division → Department → Employee as parent-child segments.",
          result: "A path query from a division to its employees is direct.",
        },
        {
          action: "Store Assembly → Subassembly → Part.",
          result: "A part used in two subassemblies must appear twice.",
        },
        {
          action: "Update the bolt's supplier.",
          result: "Every duplicated copy must be found and changed.",
        },
      ],
      conclusion:
        "The tree is an excellent index and a poor model for shared ownership. Duplication is the price of keeping one parent.",
    },
    tradeoff: {
      gain: "Very fast parent-child navigation and a simple physical layout.",
      cost: "No direct many-to-many relationships; structural change can require rebuilding the tree.",
      verdict: "Good for strict hierarchies and path queries; weak when entities have multiple parents.",
    },
    terms: [
      {
        term: "Segment",
        definition: "A record type in a hierarchical database, stored as a node in the tree.",
      },
      {
        term: "Parent-child relationship",
        definition: "A one-to-many link where each child has exactly one parent.",
      },
    ],
  },

  'network-model': {
    oneIdea:
      "The network model generalizes the tree into a graph: one record can participate in several sets.",
    whyItMatters:
      "It is the historical answer to many-to-many data. It also shows why navigation-based databases pushed complexity onto every application programmer.",
    example: {
      title: "A student in several courses",
      scenario:
        "A university needs students enrolled in many courses, and courses containing many students.",
      steps: [
        {
          action: "Define Student and Course record types.",
          result: "Each record has a stable database key.",
        },
        {
          action: "Define an Enrollment set with Student as owner and Course as member.",
          result: "A student can own many enrollment occurrences.",
        },
        {
          action: "Define a second set with Course as owner and Student as member.",
          result: "The same student participates from both directions.",
        },
      ],
      conclusion:
        "The graph solves the shared-entity problem, but the application must know which set to traverse. The model exposes the path instead of hiding it behind a query language.",
    },
    tradeoff: {
      gain: "Efficient many-to-many navigation without duplicating records.",
      cost: "Complex pointer structures; schema changes can break programs that know the old paths.",
      verdict: "A useful historical lesson in why declarative access beat manual navigation.",
    },
    terms: [
      {
        term: "Set",
        definition: "A named one-to-many relationship between an owner record type and a member record type.",
      },
      {
        term: "Owner / member",
        definition: "The two roles in a network set; one owner occurrence can point to many member occurrences.",
      },
    ],
  },

  'relational-model': {
    oneIdea:
      "A relation is a set of tuples over named, typed domains; row order and duplicate tuples are not part of the model.",
    whyItMatters:
      "Set semantics are what let the optimizer reorder joins, push filters, and return the same answer by a different plan.",
    example: {
      title: "Enrollment is a set",
      scenario:
        "A relation Enrollment has student_id, course_id, and grade. Two identical rows would mean the same student took the same course with the same grade twice.",
      steps: [
        {
          action: "Insert (1, C1, A) twice.",
          result: "A true relation keeps one tuple; SQL may keep both unless a key forbids it.",
        },
        {
          action: "Project only course_id.",
          result: "Duplicate course values collapse in relational algebra; SQL needs DISTINCT.",
        },
        {
          action: "Join Enrollment with Student on student_id.",
          result: "The result is a new relation with a combined schema.",
        },
      ],
      conclusion:
        "The relational model is small: domains, tuples, relations, and operations. Its power comes from closing every operation over relations.",
    },
    tradeoff: {
      gain: "Declarative queries, set-based optimization, and a simple logical model.",
      cost: "Joins can be expensive, and real SQL systems reintroduce duplicates and nulls.",
      verdict: "The default model for business data because it separates meaning from navigation.",
    },
    terms: [
      {
        term: "Domain",
        definition: "The set of allowed values for an attribute, including its type and constraints.",
      },
      {
        term: "Degree and cardinality",
        definition: "Degree is the number of attributes; cardinality is the number of tuples.",
      },
    ],
  },

  'codd-rules': {
    oneIdea:
      "Codd's rules are a conformance checklist: data in tables, every value addressable, catalog in tables, views, set operations, and independence.",
    whyItMatters:
      "A product can look like a table store and still fail the relational contract. The rules give you precise questions to ask about a system's guarantees.",
    example: {
      title: "Auditing a table-shaped database",
      scenario:
        "A vendor claims its product is relational because it shows results in rows and columns.",
      steps: [
        {
          action: "Ask whether the system catalog is exposed as ordinary tables.",
          result: "If metadata can only be read through private commands, the information rule is weakened.",
        },
        {
          action: "Try to update a view and observe the result.",
          result: "A system that cannot update any view fails the view-updating rule, though many real systems compromise here.",
        },
        {
          action: "Change a secondary index and rerun the same query.",
          result: "If applications must change, physical independence is incomplete.",
        },
      ],
      conclusion:
        "The rules are a benchmark, not a marketing badge. Most SQL products satisfy the spirit and bend several rules in practice.",
    },
    tradeoff: {
      gain: "A vocabulary for judging whether a system deserves the relational name.",
      cost: "Strict conformance can conflict with performance, null handling, and vendor extensions.",
      verdict: "Use the rules to understand guarantees; do not expect a perfect score from any commercial system.",
    },
    terms: [
      {
        term: "Information rule",
        definition: "All data, including metadata, is represented as values in tables.",
      },
      {
        term: "View updating",
        definition: "The ability to update certain views as if they were base tables.",
      },
    ],
  },

  'relational-algebra-selection': {
    oneIdea:
      "Selection filters rows; projection chooses columns. Selection preserves the schema, projection can reduce the degree.",
    whyItMatters:
      "Every query plan begins by pushing selections and projections closer to the data. Understanding the operators makes EXPLAIN output readable.",
    example: {
      title: "Names of students over 20",
      scenario:
        "Student(id, name, age) has Ada 21, Grace 22, and Linus 20.",
      steps: [
        {
          action: "Apply σ_age > 20 to Student.",
          result: "Ada and Grace survive; Linus is removed.",
        },
        {
          action: "Apply π_name to the result.",
          result: "The schema becomes (name) and the tuples are Ada and Grace.",
        },
        {
          action: "Try π_name first, then σ_age > 20.",
          result: "The predicate refers to a column that no longer exists, so the expression is invalid.",
        },
      ],
      conclusion:
        "The order is not cosmetic. Projection can remove the attribute a later predicate needs.",
    },
    tradeoff: {
      gain: "Smaller intermediate relations and less I/O.",
      cost: "Projecting too early can force a rejoin or lose a key needed later.",
      verdict: "Push selections early; push projections only when the required columns are known.",
    },
    terms: [
      {
        term: "Predicate",
        definition: "A condition that evaluates to true, false, or unknown for a tuple.",
      },
      {
        term: "Projection",
        definition: "An operation that keeps a subset of attributes and eliminates duplicate tuples.",
      },
    ],
  },

  'relational-algebra-set-ops': {
    oneIdea:
      "Union, intersection, and difference operate on whole tuples and require union-compatible relations.",
    whyItMatters:
      "They are the clean way to combine result sets with the same shape, and they expose when two queries are not actually comparable.",
    example: {
      title: "Who took C1 or C2?",
      scenario:
        "Take π_student_id(σ_course_id = C1(Enroll)) and the same expression for C2.",
      steps: [
        {
          action: "Union the two relations.",
          result: "Every student who took either course appears once.",
        },
        {
          action: "Intersect the two relations.",
          result: "Only students who took both courses remain.",
        },
        {
          action: "Subtract the C2 set from the C1 set.",
          result: "Students who took C1 but not C2 remain.",
        },
      ],
      conclusion:
        "Set operations are only valid when both inputs have the same number and compatible types of attributes. SQL's UNION, INTERSECT, and EXCEPT follow the same rule.",
    },
    tradeoff: {
      gain: "Composable answers without repeating the same predicate in multiple queries.",
      cost: "Duplicate elimination needs sorting or hashing, and SQL multiset semantics may surprise you.",
      verdict: "Use set operations for shape-compatible results; use joins when the rows must be combined column-wise.",
    },
    terms: [
      {
        term: "Union-compatible",
        definition: "Two relations have the same degree and corresponding attributes drawn from the same domains.",
      },
      {
        term: "Set semantics",
        definition: "Duplicate tuples are not counted; SQL often uses bag or multiset semantics instead.",
      },
    ],
  },

  'relational-algebra-joins': {
    oneIdea:
      "A join is a Cartesian product followed by a predicate; the predicate decides which combinations survive.",
    whyItMatters:
      "Normalization splits facts into separate relations, so joins are how the original entity is reconstructed. Join order and indexes decide whether that is fast or catastrophic.",
    example: {
      title: "Students and their enrollments",
      scenario:
        "Student has 3 rows and Enroll has 3 rows. The Cartesian product has 9 combinations.",
      steps: [
        {
          action: "Form Student × Enroll.",
          result: "Nine candidate rows, most with mismatched student ids.",
        },
        {
          action: "Keep rows where Student.id = Enroll.student_id.",
          result: "Three matching rows remain: Ada twice and Grace once.",
        },
        {
          action: "Use a left outer join instead.",
          result: "Linus remains with null course and grade, because he has no enrollment.",
        },
      ],
      conclusion:
        "An inner join drops unmatched rows. An outer join preserves them with nulls. The choice is a business rule, not a formatting preference.",
    },
    tradeoff: {
      gain: "Reconstruct entities without duplicating facts in storage.",
      cost: "Joins consume memory and I/O; a bad join order can multiply intermediate rows.",
      verdict: "Normalize for integrity, then index the join keys and verify the plan.",
    },
    terms: [
      {
        term: "Theta join",
        definition: "A join whose condition can use any comparison, not only equality.",
      },
      {
        term: "Outer join",
        definition: "A join that preserves unmatched rows from one or both inputs, filling missing columns with null.",
      },
    ],
  },

  keys: {
    oneIdea:
      "A key is a minimal set of attributes that determines every tuple; a foreign key is a reference to a key in another relation.",
    whyItMatters:
      "Keys are both the identity of a row and the anchor for joins. A schema without keys cannot distinguish two otherwise identical facts.",
    example: {
      title: "The key of an enrollment",
      scenario:
        "Enrollment contains student_id, course_id, grade, and student_name.",
      steps: [
        {
          action: "Test student_id alone.",
          result: "It is not a key: one student can enroll in several courses.",
        },
        {
          action: "Test (student_id, course_id).",
          result: "It is unique and minimal, so it is a candidate key.",
        },
        {
          action: "Add grade to the key.",
          result: "It is still unique, but no longer minimal; it is a superkey, not a candidate key.",
        },
      ],
      conclusion:
        "A primary key is the chosen candidate key. A foreign key must match an existing key value or be null when the relationship is optional.",
    },
    tradeoff: {
      gain: "Identity, integrity, and efficient joins.",
      cost: "Natural keys can change; surrogate keys add a column and require discipline.",
      verdict: "Use a stable surrogate key when the natural key may change; keep a unique constraint on the natural key.",
    },
    terms: [
      {
        term: "Candidate key",
        definition: "A minimal superkey; removing any attribute would break uniqueness.",
      },
      {
        term: "Foreign key",
        definition: "One or more attributes whose values must match a key in another relation or be null.",
      },
    ],
  },

  'integrity-constraints': {
    oneIdea:
      "Constraints are executable business rules: the DBMS refuses any state that violates them, regardless of which application wrote the data.",
    whyItMatters:
      "Application validation is bypassed by imports, scripts, and bugs. Database constraints are the last line of defense for shared data.",
    example: {
      title: "A salary that cannot be negative",
      scenario:
        "Employee has salary and department_id. The business requires salary > 0 and a valid department.",
      steps: [
        {
          action: "Add CHECK (salary > 0).",
          result: "An insert with -1 is rejected even if the application forgets to validate.",
        },
        {
          action: "Add FOREIGN KEY (department_id) REFERENCES Department(id).",
          result: "An employee cannot point to a department that does not exist.",
        },
        {
          action: "Choose ON DELETE RESTRICT.",
          result: "Deleting a department with employees fails instead of silently orphaning them.",
        },
      ],
      conclusion:
        "The constraint belongs to the data model, not to one UI. Put the rule where every writer must pass through it.",
    },
    tradeoff: {
      gain: "Guaranteed integrity and less duplicated validation logic.",
      cost: "Every write pays a check; bulk loads and cascades can become slower or surprising.",
      verdict: "Prefer declarative constraints over triggers; relax them only with a measured reason.",
    },
    terms: [
      {
        term: "Domain constraint",
        definition: "A rule on the values an attribute may take, such as type, range, or nullability.",
      },
      {
        term: "Referential integrity",
        definition: "A foreign key value must reference an existing row or be null.",
      },
    ],
  },

  'assertions-triggers': {
    oneIdea:
      "An assertion states an invariant that must always hold; a trigger reacts to an event and runs procedural code.",
    whyItMatters:
      "Some rules span several rows or tables and cannot be expressed as a simple CHECK. Triggers can enforce them, but they also hide behavior from the application.",
    example: {
      title: "Do not oversell a course",
      scenario:
        "Course has capacity 30. Enrollment rows are inserted one at a time.",
      steps: [
        {
          action: "Try a CHECK constraint on Course.",
          result: "It cannot see the count of enrollment rows, so it cannot express the rule alone.",
        },
        {
          action: "Create a BEFORE INSERT trigger on Enrollment.",
          result: "The trigger counts current enrollments and rejects the insert when the course is full.",
        },
        {
          action: "Two inserts race through the count.",
          result: "Without locking or a serializable transaction, both may see 29 and both may insert.",
        },
      ],
      conclusion:
        "A trigger is not automatically atomic. Cross-row invariants need concurrency control as well as trigger logic.",
    },
    tradeoff: {
      gain: "Complex, cross-table rules enforced centrally.",
      cost: "Hidden control flow, cascading triggers, portability problems, and harder debugging.",
      verdict: "Use constraints where possible; use triggers for auditing or carefully scoped cross-row rules.",
    },
    terms: [
      {
        term: "Assertion",
        definition: "A declared condition that the database must always satisfy.",
      },
      {
        term: "Trigger",
        definition: "A procedure that fires before or after an insert, update, or delete on a table.",
      },
    ],
  },

  'functional-dependencies': {
    oneIdea:
      "X → Y means every two tuples that agree on X must also agree on Y; the dependency is a rule, not a correlation you noticed once.",
    whyItMatters:
      "Functional dependencies are the evidence behind normalization. Without them, decomposition is just moving columns around.",
    example: {
      title: "Advisor depends on student",
      scenario:
        "A Student table contains student_id, student_name, advisor_id, and advisor_name.",
      steps: [
        {
          action: "Observe student_id → student_name and student_id → advisor_id.",
          result: "The student id determines the student's own facts and their assigned advisor.",
        },
        {
          action: "Observe advisor_id → advisor_name.",
          result: "The advisor id determines the advisor name.",
        },
        {
          action: "Compose the dependencies.",
          result: "student_id → advisor_name is transitive, which is exactly the 3NF violation.",
        },
      ],
      conclusion:
        "A dependency found in one sample is not a guarantee. It becomes a schema rule only when the business confirms it or a constraint enforces it.",
    },
    tradeoff: {
      gain: "A precise basis for keys, decomposition, and anomaly analysis.",
      cost: "Real domains have conditional dependencies and exceptions that are hard to enumerate.",
      verdict: "Write the dependencies down before normalizing; test them against future data, not just today's rows.",
    },
    terms: [
      {
        term: "Determinant",
        definition: "The left side X of a functional dependency X → Y.",
      },
      {
        term: "Armstrong's axioms",
        definition: "Reflexivity, augmentation, and transitivity rules for inferring all implied dependencies.",
      },
    ],
  },

  anomalies: {
    oneIdea:
      "Redundancy causes insert, update, and delete anomalies; normalization removes the cause, not just the repeated value.",
    whyItMatters:
      "Repeated facts drift apart. A database that disagrees with itself is worse than a database that is merely slow.",
    example: {
      title: "The advisor name repeated",
      scenario:
        "Student rows store advisor_id and advisor_name. Dr. Hopper advises twenty students.",
      steps: [
        {
          action: "Rename Dr. Hopper in one row.",
          result: "The same advisor now has two names in the same table.",
        },
        {
          action: "Delete the last student advised by Dr. Turing.",
          result: "The advisor disappears entirely, even though the advisor still exists.",
        },
        {
          action: "Add a new advisor with no students yet.",
          result: "There is no row in which to store the advisor without inventing a fake student.",
        },
      ],
      conclusion:
        "The problem is not that the name is long. The problem is that one fact has many homes.",
    },
    tradeoff: {
      gain: "One fact, one place, one update.",
      cost: "More relations and more joins at read time.",
      verdict: "Normalize operational data; denormalize deliberately in warehouses where the redundancy is controlled.",
    },
    terms: [
      {
        term: "Redundancy",
        definition: "Storing the same fact in more than one place, creating a chance for disagreement.",
      },
      {
        term: "Update anomaly",
        definition: "A change that must be made in several rows but is applied to only some of them.",
      },
    ],
  },

  'first-normal-form': {
    oneIdea:
      "First normal form: every attribute holds one atomic value, and no relation contains repeating groups.",
    whyItMatters:
      "Relational operations assume a value is a value. A comma-separated list cannot be joined, filtered, or constrained like a proper relation.",
    example: {
      title: "The phone list in one cell",
      scenario:
        "Student(id, name, phones) stores 555-0100, 555-0101 in a single cell.",
      steps: [
        {
          action: "Try to find every student with phone 555-0101.",
          result: "A substring search is required; an index on the list cannot answer it cleanly.",
        },
        {
          action: "Split the list into StudentPhone(student_id, phone).",
          result: "Each phone becomes one atomic value and one row.",
        },
        {
          action: "Declare (student_id, phone) as the key.",
          result: "The same phone cannot be attached to the same student twice.",
        },
      ],
      conclusion:
        "A repeating group becomes a child relation. The parent keeps its identity; the child carries the many values.",
    },
    tradeoff: {
      gain: "Values can be indexed, joined, constrained, and updated independently.",
      cost: "More rows and one more join to reconstruct the list.",
      verdict: "Always normalize operational data to 1NF; store arrays only in systems designed for them.",
    },
    terms: [
      {
        term: "Atomic value",
        definition: "A value treated as a single unit, with no meaningful internal structure to the database.",
      },
      {
        term: "Repeating group",
        definition: "A multi-valued attribute or repeating set of columns inside one row.",
      },
    ],
  },

  'second-normal-form': {
    oneIdea:
      "Second normal form removes partial dependencies: a non-key attribute must depend on the whole composite key, not just part of it.",
    whyItMatters:
      "A fact about a course does not belong in every enrollment row. Partial dependencies duplicate that fact once per student.",
    example: {
      title: "Enrollment with course names",
      scenario:
        "Enrollment(student_id, course_id, student_name, course_name, grade) has composite key (student_id, course_id).",
      steps: [
        {
          action: "Check student_name against the key.",
          result: "It depends only on student_id, so it is a partial dependency.",
        },
        {
          action: "Check course_name against the key.",
          result: "It depends only on course_id, another partial dependency.",
        },
        {
          action: "Split Student, Course, and Enrollment.",
          result: "Grade remains in Enrollment because it depends on both parts of the key.",
        },
      ],
      conclusion:
        "2NF is about composite keys. If a relation has a single-attribute key, it is automatically in 2NF once it is in 1NF.",
    },
    tradeoff: {
      gain: "Course facts and student facts are stored once.",
      cost: "Queries that want all three facts must join three relations.",
      verdict: "Decompose partial dependencies; keep the relationship fact in the junction relation.",
    },
    terms: [
      {
        term: "Composite key",
        definition: "A key made of two or more attributes.",
      },
      {
        term: "Partial dependency",
        definition: "A non-key attribute that depends on only part of a composite candidate key.",
      },
    ],
  },

  'third-normal-form': {
    oneIdea:
      "Third normal form removes transitive dependencies: every non-key attribute depends on a candidate key and nothing else.",
    whyItMatters:
      "If A determines B and B determines C, storing C next to A repeats C for every A. The repetition is the anomaly.",
    example: {
      title: "Student, advisor, and advisor name",
      scenario:
        "Student(student_id, student_name, advisor_id, advisor_name) has key student_id.",
      steps: [
        {
          action: "Identify the dependencies.",
          result: "student_id → advisor_id and advisor_id → advisor_name.",
        },
        {
          action: "Compose them.",
          result: "student_id → advisor_name is transitive, so advisor_name is not directly dependent on the key.",
        },
        {
          action: "Move advisor_name to Advisor(advisor_id, advisor_name).",
          result: "Student keeps advisor_id as a foreign key; the advisor name appears once.",
        },
      ],
      conclusion:
        "3NF does not forbid foreign keys. It forbids a non-key attribute from depending on another non-key attribute.",
    },
    tradeoff: {
      gain: "Updates touch one advisor row, not every student.",
      cost: "Reading a student with an advisor name requires a join.",
      verdict: "Target 3NF for transactional schemas; use BCNF when overlapping candidate keys cause remaining anomalies.",
    },
    terms: [
      {
        term: "Transitive dependency",
        definition: "A non-key attribute that depends on another non-key attribute rather than directly on a key.",
      },
      {
        term: "Lossless decomposition",
        definition: "A split that can be joined back without inventing or losing tuples.",
      },
    ],
  },

  'transactions-acid': {
    oneIdea:
      "A transaction is an all-or-nothing unit that moves the database from one consistent state to another.",
    whyItMatters:
      "Money, inventory, and bookings are not allowed to be half-updated. ACID is the promise that a crash or a concurrent reader cannot leave a partial fact behind.",
    example: {
      title: "Move 100 from A to B",
      scenario:
        "Account A has 500 and account B has 300. A transfer debits A and credits B.",
      steps: [
        {
          action: "Debit A by 100.",
          result: "A becomes 400 inside the transaction, not yet durable.",
        },
        {
          action: "Crash before crediting B.",
          result: "Recovery rolls back the debit; A returns to 500.",
        },
        {
          action: "Retry and commit both writes.",
          result: "A is 400, B is 400, and the total is unchanged.",
        },
      ],
      conclusion:
        "Atomicity protects the pair of writes. Consistency protects the balance rule. Isolation hides the intermediate state. Durability survives the crash.",
    },
    tradeoff: {
      gain: "A correctness boundary that applications can rely on.",
      cost: "Locks, logging, fsync, and coordination all cost throughput.",
      verdict: "Use transactions for any multi-step invariant; relax isolation only with a measured anomaly budget.",
    },
    terms: [
      {
        term: "Atomicity",
        definition: "All writes in a transaction commit together or none of them do.",
      },
      {
        term: "Durability",
        definition: "A committed transaction survives a crash and restart.",
      },
    ],
  },

  'transaction-states': {
    oneIdea:
      "Transaction states make commit and abort explicit: only a committed transaction is durable, and only an active or failed one can be rolled back.",
    whyItMatters:
      "Recovery decisions depend on where a transaction was when the system crashed. The state tells the recovery manager whether to redo or undo.",
    example: {
      title: "A crash in the partially committed window",
      scenario:
        "T1 has executed its last statement but has not yet written the commit record.",
      steps: [
        {
          action: "The last write completes; T1 enters partially committed.",
          result: "The changes may still be in memory or in an uncommitted log record.",
        },
        {
          action: "The system crashes before the commit record is durable.",
          result: "Recovery treats T1 as uncommitted and undoes its writes.",
        },
        {
          action: "The commit record reaches disk before the crash.",
          result: "Recovery redoes T1 if needed and makes the result visible.",
        },
      ],
      conclusion:
        "Commit is a durable event, not the moment the last SQL statement returns. The log record is the boundary.",
    },
    tradeoff: {
      gain: "A precise recovery contract and a clear visibility rule.",
      cost: "A commit must force a log write, and that fsync is often the latency bottleneck.",
      verdict: "Batch commits when possible, but never report success before the commit record is durable.",
    },
    terms: [
      {
        term: "Active",
        definition: "The transaction is executing and has not reached its final statement.",
      },
      {
        term: "Partially committed",
        definition: "All statements have run, but the commit record is not yet durable.",
      },
    ],
  },

  'recovery-logs': {
    oneIdea:
      "Write-ahead logging records the before and after image before the data page reaches disk; recovery replays committed work and undoes uncommitted work.",
    whyItMatters:
      "A crash can happen between any two writes. The log is the only durable record of what the database intended to do.",
    example: {
      title: "One update and one crash",
      scenario:
        "T1 changes A from 500 to 400 and commits. T2 changes B from 300 to 250 but has not committed when the system crashes.",
      steps: [
        {
          action: "Write the log records before the data pages.",
          result: "The log contains <T1, A, 500, 400> and <T2, B, 300, 250>.",
        },
        {
          action: "T1's commit record reaches disk; T2's does not.",
          result: "The log identifies T1 as a winner and T2 as a loser.",
        },
        {
          action: "Run recovery.",
          result: "Redo T1's change to A; undo T2's change to B.",
        },
      ],
      conclusion:
        "The recovery manager does not guess. It reads the log, builds the winner and loser sets, and applies the correct action.",
    },
    tradeoff: {
      gain: "Crash safety without copying the whole database.",
      cost: "Every write pays log I/O; checkpoints and log truncation add operational complexity.",
      verdict: "WAL is the default recovery mechanism in serious transactional systems.",
    },
    terms: [
      {
        term: "Write-ahead logging",
        definition: "A rule that forces the log record to stable storage before the corresponding data page.",
      },
      {
        term: "Checkpoint",
        definition: "A known-consistent point that limits how much log recovery must scan.",
      },
    ],
  },

  'shadow-paging': {
    oneIdea:
      "Shadow paging writes changed pages to new locations and atomically switches the page-table root, so the old state survives a crash.",
    whyItMatters:
      "It is an elegant alternative to undo logging: if the switch did not happen, the old database is still intact.",
    example: {
      title: "Switch the page table, not the page",
      scenario:
        "The current page table points page 3 to disk block 30. A transaction updates page 3.",
      steps: [
        {
          action: "Copy page 3 to a new block, 41, and modify the copy.",
          result: "The old block 30 remains untouched.",
        },
        {
          action: "Force the new page and a new page table to disk.",
          result: "The old root still points to block 30; the new root points to block 41.",
        },
        {
          action: "Atomically update the root pointer.",
          result: "A crash before the switch leaves the old state; after the switch, the new state is durable.",
        },
      ],
      conclusion:
        "Shadow paging replaces undo with copy-on-write and a pointer swap. It avoids undo logs, but it fragments pages and complicates reclamation.",
    },
    tradeoff: {
      gain: "No undo log and a simple crash-recovery story.",
      cost: "Copy-on-write overhead, page-table growth, and garbage collection of old pages.",
      verdict: "Conceptually important and used in some systems, but most large databases prefer WAL.",
    },
    terms: [
      {
        term: "Shadow page",
        definition: "A new copy of a page written to a different location while the old page remains valid.",
      },
      {
        term: "Page-table root",
        definition: "The pointer that identifies the current consistent version of the page map.",
      },
    ],
  },

  'concurrency-problems': {
    oneIdea:
      "Concurrent transactions can interleave into histories that no serial order could produce, and each anomaly is a different broken guarantee.",
    whyItMatters:
      "Isolation levels are chosen by naming the anomalies they prevent. You cannot reason about a level without knowing the failure it allows.",
    example: {
      title: "Two withdrawals from one balance",
      scenario:
        "Account A has 100. T1 and T2 each withdraw 50 in separate transactions.",
      steps: [
        {
          action: "Both transactions read A = 100.",
          result: "Each believes there is enough money for its withdrawal.",
        },
        {
          action: "Both write 50.",
          result: "The final balance is 50 instead of 0; one withdrawal is lost.",
        },
        {
          action: "Run the same operations serially.",
          result: "The first writes 50, the second reads 50 and writes 0. The serial result is correct.",
        },
      ],
      conclusion:
        "A lost update is not a race in the application's arithmetic. It is a missing guarantee that the read and write form one atomic unit.",
    },
    tradeoff: {
      gain: "Higher isolation prevents more anomalies.",
      cost: "Stronger isolation blocks more concurrency, increases waits, and can cause deadlocks.",
      verdict: "Pick the weakest level that provably prevents the anomalies your business cannot tolerate.",
    },
    terms: [
      {
        term: "Dirty read",
        definition: "Reading a value written by a transaction that has not committed.",
      },
      {
        term: "Phantom",
        definition: "A row that appears or disappears between two reads because another transaction inserted or deleted it.",
      },
    ],
  },

  'locking-2pl': {
    oneIdea:
      "Two-phase locking guarantees conflict serializability by never releasing a lock before the transaction has acquired all the locks it will need.",
    whyItMatters:
      "It is the classic proof that a schedule can be made safe by controlling access to items. It also explains why databases deadlock and why they must detect cycles.",
    example: {
      title: "A deadlock in two steps",
      scenario:
        "T1 needs A then B. T2 needs B then A. Both run at the same time.",
      steps: [
        {
          action: "T1 locks A; T2 locks B.",
          result: "Each transaction holds one item and is making progress.",
        },
        {
          action: "T1 requests B; T2 requests A.",
          result: "Each waits for the other; the wait-for graph contains a cycle.",
        },
        {
          action: "The DBMS aborts one transaction.",
          result: "The survivor acquires both locks, commits, and releases them.",
        },
      ],
      conclusion:
        "The growing phase acquires locks; the shrinking phase releases them. Strict 2PL holds exclusive locks until commit, which also prevents dirty reads.",
    },
    tradeoff: {
      gain: "Serializable schedules from local lock rules.",
      cost: "Blocking, deadlocks, and reduced concurrency; lock granularity changes the pressure.",
      verdict: "Use strict 2PL or a proven variant, and always have a deadlock detector.",
    },
    terms: [
      {
        term: "Two-phase locking",
        definition: "A protocol with a growing phase of lock acquisition and a shrinking phase of release.",
      },
      {
        term: "Wait-for graph",
        definition: "A graph whose edges represent transactions waiting for locks held by other transactions.",
      },
    ],
  },

  'timestamp-optimistic': {
    oneIdea:
      "Timestamp ordering and optimistic concurrency control avoid blocking by validating conflicts; a transaction that loses validation aborts and retries.",
    whyItMatters:
      "Read-heavy workloads can spend more time waiting for locks than doing work. Validation trades blocking for aborts.",
    example: {
      title: "Optimistic checkout",
      scenario:
        "T1 reads item x = 10 and prepares to write 9. T2 writes x = 11 and commits first.",
      steps: [
        {
          action: "T1 records the version of x it read.",
          result: "The read set remembers the version, not just the value.",
        },
        {
          action: "T2 commits a newer version of x.",
          result: "T1's read set is now stale.",
        },
        {
          action: "T1 enters validation and fails.",
          result: "T1 aborts and retries with the new value instead of overwriting T2.",
        },
      ],
      conclusion:
        "Optimistic control is a bet that conflicts are rare. Under heavy write contention, the abort rate can erase the benefit.",
    },
    tradeoff: {
      gain: "No lock waits for read-only work and good throughput when conflicts are rare.",
      cost: "Aborts, retries, and wasted work under contention; starvation is possible.",
      verdict: "Use OCC for read-mostly or short transactions; use locking when conflicts are frequent.",
    },
    terms: [
      {
        term: "Timestamp ordering",
        definition: "A protocol that orders conflicting operations by transaction timestamps.",
      },
      {
        term: "Validation phase",
        definition: "The point in OCC where the system checks whether the transaction's read set is still current.",
      },
    ],
  },

  'distributed-databases': {
    oneIdea:
      "A distributed database spreads data and processing across sites while presenting one logical database to the application.",
    whyItMatters:
      "Locality, scale, and availability are real, but coordination is not free. A network partition forces a choice between consistency and availability.",
    example: {
      title: "Orders in two regions",
      scenario:
        "Customers in Europe and Asia write orders. Each region has its own database site.",
      steps: [
        {
          action: "Fragment orders by region.",
          result: "A European order is written locally; the common query still sees one Orders relation.",
        },
        {
          action: "A global report joins European and Asian orders.",
          result: "The optimizer must move data or ship partial aggregates across the network.",
        },
        {
          action: "The link between regions fails.",
          result: "Each site must decide whether to accept local writes or preserve a single consistent view.",
        },
      ],
      conclusion:
        "Distribution is a physical design choice with logical consequences. Transparency hides the location, not the trade-off.",
    },
    tradeoff: {
      gain: "Local access, horizontal scale, and survival of a site failure.",
      cost: "Network latency, distributed commits, partial failure, and much harder debugging.",
      verdict: "Distribute only when locality, scale, or availability justifies the coordination cost.",
    },
    terms: [
      {
        term: "Distribution transparency",
        definition: "The application can query one logical database without naming the site that stores each fragment.",
      },
      {
        term: "CAP",
        definition: "During a network partition, a system must sacrifice either consistency or availability.",
      },
    ],
  },

  'fragmentation-replication': {
    oneIdea:
      "Fragmentation partitions a relation; replication copies it. Both trade storage and coordination for locality and availability.",
    whyItMatters:
      "The physical distribution of rows determines which queries are local and which become expensive network joins.",
    example: {
      title: "Split by region, copy the catalog",
      scenario:
        "Orders are written in three regions. Product categories are read everywhere and change rarely.",
      steps: [
        {
          action: "Horizontally fragment Orders by region.",
          result: "Each site stores only its region's orders; local queries avoid the network.",
        },
        {
          action: "Vertically fragment Customer into public and private columns.",
          result: "Marketing reads the public fragment without access to sensitive fields.",
        },
        {
          action: "Replicate the ProductCategory table to every site.",
          result: "Reads are local, but an update must reach every replica.",
        },
      ],
      conclusion:
        "Fragmentation is about where a row or column lives. Replication is about how many copies exist. They solve different problems and can be combined.",
    },
    tradeoff: {
      gain: "Local reads, parallel processing, and availability.",
      cost: "Cross-site joins, replica consistency, and more complex failure handling.",
      verdict: "Fragment by access locality; replicate only data whose read/write ratio justifies the copies.",
    },
    terms: [
      {
        term: "Horizontal fragmentation",
        definition: "Splitting a relation by rows, often by region or tenant.",
      },
      {
        term: "Replication",
        definition: "Maintaining multiple copies of the same data at different sites.",
      },
    ],
  },

  'data-warehousing': {
    oneIdea:
      "A warehouse integrates subject-oriented, time-variant, nonvolatile data for analysis, separate from the operational database.",
    whyItMatters:
      "Analysts need history and broad scans. Operational systems need short, concurrent writes. Putting both on one schema makes both worse.",
    example: {
      title: "From nightly orders to a quarterly report",
      scenario:
        "An OLTP system records orders. Finance wants revenue by product and quarter without slowing checkout.",
      steps: [
        {
          action: "Extract new orders and load a staging area.",
          result: "The operational database is not queried by the reporting job.",
        },
        {
          action: "Transform into a star schema: fact_sales, dim_date, dim_product.",
          result: "The warehouse stores historical facts with conformed dimensions.",
        },
        {
          action: "Aggregate by quarter and product.",
          result: "The report scans a controlled analytical schema, not the checkout tables.",
        },
      ],
      conclusion:
        "ETL is not a copy job. It is a modeling job that turns operational events into analytical facts.",
    },
    tradeoff: {
      gain: "Historical analysis without competing with transactions.",
      cost: "ETL latency, extra storage, and a second schema that must be governed.",
      verdict: "Separate analytical workloads once reporting starts competing with operational latency.",
    },
    terms: [
      {
        term: "ETL",
        definition: "Extract, transform, and load: the pipeline that moves operational data into a warehouse.",
      },
      {
        term: "Star schema",
        definition: "A central fact table surrounded by denormalized dimension tables.",
      },
    ],
  },

  'data-mining': {
    oneIdea:
      "Data mining searches for patterns and predictions, not known records; the output is a model or rule that must be validated on data it did not see.",
    whyItMatters:
      "A query answers a question you already know how to ask. Mining proposes patterns you did not specify, which makes false discovery and overfitting the central risks.",
    example: {
      title: "Market basket rules",
      scenario:
        "A grocery chain records which items appear together in each basket.",
      steps: [
        {
          action: "Count baskets containing bread and butter together.",
          result: "Support measures how often the combination occurs.",
        },
        {
          action: "Measure how often butter appears when bread is present.",
          result: "Confidence measures the strength of the rule bread → butter.",
        },
        {
          action: "Test the rule on a later month.",
          result: "If the pattern does not hold, it was a property of the training period, not the business.",
        },
      ],
      conclusion:
        "A mining result is a hypothesis until it survives held-out data. Support and confidence are not proof of causation.",
    },
    tradeoff: {
      gain: "Discovery of structure that a fixed query would never ask for.",
      cost: "Overfitting, spurious correlations, privacy exposure, and models that decay.",
      verdict: "Treat every rule as a claim with a validation plan, not as a fact because the algorithm found it.",
    },
    terms: [
      {
        term: "Support",
        definition: "The fraction of transactions that contain a given itemset.",
      },
      {
        term: "Overfitting",
        definition: "Learning noise in the training data that does not generalize to new data.",
      },
    ],
  },

  'comparison-and-review': {
    oneIdea:
      "Model choice and query type are separate decisions: choose structure for the relationships, and choose analytics for the question.",
    whyItMatters:
      "A hierarchical model can be perfect for a bill of materials and wrong for a reservation graph. A relational database can run both transactions and analytics, but not always well at the same time.",
    example: {
      title: "Three models, three questions",
      scenario:
        "A manufacturer needs a parts explosion, an airline needs route connectivity, and a bank needs account transfers.",
      steps: [
        {
          action: "Model the parts explosion as a hierarchy.",
          result: "Parent-child navigation is natural, and shared parts expose the model's weakness.",
        },
        {
          action: "Model the airline as a graph of connected routes.",
          result: "Many-to-many paths are first-class instead of duplicated.",
        },
        {
          action: "Model the bank relationally with ACID transactions.",
          result: "Keys, constraints, and recovery protect the transfer invariant.",
        },
      ],
      conclusion:
        "There is no universal model. There is a model whose costs land on the queries you can afford to make expensive.",
    },
    tradeoff: {
      gain: "A clear vocabulary for comparing models and workloads.",
      cost: "Real systems mix models, and the boundaries are rarely pure.",
      verdict: "Choose for the invariant and the dominant query; document the queries you are making expensive.",
    },
    terms: [
      {
        term: "OLTP",
        definition: "Online transaction processing: short, concurrent reads and writes that preserve operational invariants.",
      },
      {
        term: "OLAP",
        definition: "Online analytical processing: large scans and aggregations over historical data.",
      },
    ],
  },
};

export const getDBMSDeepDive = (chapterId: string): DBMSDeepDive | undefined =>
  dbmsDeepDives[chapterId];
