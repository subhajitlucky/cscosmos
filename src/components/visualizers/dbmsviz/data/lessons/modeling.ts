import type { DBMSLesson } from './types';

export const modelingLessons: DBMSLesson[] = [
  {
    chapterId: 'erd-fundamentals',
    walkthrough: { kind: 'erd', cardinality: '1:N' },
    hook:
      'Before tables, there is a domain. An ERD is the bridge between a real-world problem and a relational schema.',
    objectives: [
      'Identify entities, attributes, and keys in a domain.',
      'Distinguish simple, composite, multivalued, and derived attributes.',
      'Know what makes an entity strong or weak.',
      'Read basic ERD notation.',
    ],
    sections: [
      {
        title: 'Entities and attributes',
        body:
          'An entity is a distinguishable object or concept, such as a Student or a Course. An entity set is the collection of all such objects. An attribute describes an entity. A simple attribute is atomic; a composite attribute has parts, such as an address with street, city, and postal code. A multivalued attribute can have several values, such as phone numbers. A derived attribute is computed, such as age from a birth date.',
        code: String.raw`Student
  id           simple, key
  name         composite (first, last)
  phone        multivalued
  birth_date   stored
  age          derived from birth_date`,
      },
      {
        title: 'Keys and strong entities',
        body:
          'A key uniquely identifies an entity within its set. A strong entity has its own key, such as student_id. A weak entity cannot be uniquely identified without the owner entity; its key includes the owner\'s key. In an ERD, entities are rectangles, attributes are ovals, keys are underlined, and weak entities use a double rectangle.',
      },
      {
        title: 'From ERD to tables',
        body:
          'A strong entity usually becomes a table with its attributes as columns and its key as the primary key. Composite attributes are flattened into separate columns. Multivalued attributes become separate tables with a foreign key back to the entity. Derived attributes are usually not stored.',
      },
    ],
    keyTakeaways: [
      'An entity is an object; an entity set is a collection of objects.',
      'Attributes describe entities and can be simple, composite, multivalued, or derived.',
      'A strong entity has its own key; a weak entity depends on an owner.',
      'Multivalued attributes usually become separate tables.',
      'ERD notation maps naturally to relational tables.',
    ],
    pitfalls: [
      'Treating an attribute as an entity when it has its own identity.',
      'Storing a derived value and then forgetting to update it.',
      'Giving a weak entity its own independent primary key.',
    ],
    focusPoints: [
      'Identify entities and keys in a short domain description.',
      'Classify attributes correctly.',
      'Explain how a multivalued attribute becomes a table.',
    ],
    quiz: [
      {
        question: 'What is a derived attribute?',
        options: ['An attribute computed from other data', 'A key that appears twice', 'A multivalued attribute', 'A weak entity'],
        answer: 0,
        explanation:
          'A derived attribute is calculated from stored data, such as age from a birth date.',
      },
      {
        question: 'What makes a weak entity weak?',
        options: [
          'It cannot be uniquely identified without an owner entity',
          'It has no attributes',
          'It has too many rows',
          'It is stored in a file',
        ],
        answer: 0,
        explanation:
          'A weak entity\'s key includes the owner\'s key, so it depends on another entity for identity.',
      },
    ],
  },

  {
    chapterId: 'erd-relationships',
    walkthrough: { kind: 'erd', cardinality: 'M:N' },
    hook:
      'Relationships are where ERDs get interesting. Cardinality and participation decide whether a schema is faithful or subtly wrong.',
    objectives: [
      'Read relationship diamonds and cardinality labels.',
      'Distinguish 1:1, 1:N, and M:N relationships.',
      'Explain total and partial participation.',
      'Model weak entities and identifying relationships.',
    ],
    sections: [
      {
        title: 'Relationships and degree',
        body:
          'A relationship connects entities. Its degree is the number of entity sets involved: unary (recursive), binary, or ternary. A binary relationship between Student and Course might be "enrolls." A recursive relationship connects an entity to another entity of the same set, such as an employee managing other employees.',
        code: String.raw`[Student] --enrolls-- [Course]      binary
[Employee] --manages--> [Employee]   unary
[Supplier] --supplies-- [Part] --to-- [Project]  ternary`,
      },
      {
        title: 'Cardinality and participation',
        body:
          'Cardinality describes how many entities can participate: one-to-one, one-to-many, or many-to-many. Participation describes whether every entity must participate: total participation (double line) or partial participation (single line). A course may have many students, but every offering must have at least one instructor — those are separate constraints.',
      },
      {
        title: 'Weak entities and identifying relationships',
        body:
          'A weak entity has no independent key. It is connected to an owner by an identifying relationship. For example, a Dependent is identified by the combination of Employee ID and Dependent Name. The identifying relationship is drawn with a double diamond, and the weak entity with a double rectangle.',
      },
    ],
    keyTakeaways: [
      'Relationship degree counts the entity sets involved.',
      'Cardinality is 1:1, 1:N, or M:N.',
      'Participation says whether every entity must take part.',
      'Weak entities use an owner\'s key plus a partial key.',
      'M:N relationships become separate tables in the relational model.',
    ],
    pitfalls: [
      'Confusing cardinality with participation.',
      'Forgetting that a recursive relationship still has a role for each side.',
      'Modeling a weak entity as a strong one with an unrelated key.',
    ],
    focusPoints: [
      'Label both sides of a relationship with cardinality.',
      'Explain total versus partial participation.',
      'Convert an M:N relationship into two 1:N relationships plus a junction table.',
    ],
    quiz: [
      {
        question: 'What does M:N mean?',
        options: ['Many entities on both sides of a relationship', 'One entity on each side', 'No participation', 'A weak entity'],
        answer: 0,
        explanation:
          'M:N means many entities of one set relate to many entities of the other set, such as students and courses.',
      },
      {
        question: 'What does total participation mean?',
        options: [
          'Every entity in the set must participate in the relationship',
          'Only some entities participate',
          'The relationship has no cardinality',
          'The relationship is recursive',
        ],
        answer: 0,
        explanation:
          'Total participation means every entity of that set must be involved in at least one relationship instance.',
      },
    ],
  },

  {
    chapterId: 'hierarchical-model',
    hook:
      'The hierarchical model is a tree. It is fast when your data is a tree and painful when it is not.',
    objectives: [
      'Explain parent-child records in the hierarchical model.',
      'Trace navigational access through a tree.',
      'Know why many-to-many relationships are difficult.',
      'Identify the strengths and limits of hierarchical databases.',
    ],
    sections: [
      {
        title: 'Tree-structured records',
        body:
          'A hierarchical database stores records in a tree. Each child has exactly one parent, and a parent can have many children. Access starts at the root and follows a path down the tree. This makes one-to-many navigation fast and predictable, but it fixes the access path into the schema.',
        code: String.raw`Department
  ├── Employee
  │     ├── Dependent
  │     └── Dependent
  └── Employee
        └── Dependent`,
      },
      {
        title: 'Navigational access',
        body:
          'The program navigates from parent to child using pointers or path names. There is no declarative query optimizer choosing a plan; the application knows the tree. This is efficient for stable, tree-shaped workloads but brittle when requirements change.',
      },
      {
        title: 'Limitations',
        body:
          'Many-to-many relationships require redundant copies or an artificial hierarchy. A child cannot have two parents without duplicating data. Queries that need a different path may be expensive. The model is historically important and still appears in directories and file systems, but it is not the default for new application data.',
      },
    ],
    keyTakeaways: [
      'Hierarchical databases are trees with one parent per child.',
      'Access is navigational and path-dependent.',
      'One-to-many navigation is fast.',
      'Many-to-many relationships cause redundancy or awkward workarounds.',
      'The model fits directories and stable tree-shaped data.',
    ],
    pitfalls: [
      'Trying to model a many-to-many relationship directly.',
      'Assuming a child can have two parents.',
      'Confusing a hierarchical database with a file directory tree, though the shape is similar.',
    ],
    focusPoints: [
      'Draw a small tree and trace a query path.',
      'Explain why M:N is hard.',
      'Name one modern use of tree-shaped data.',
    ],
    quiz: [
      {
        question: 'How many parents can a record have in a pure hierarchical model?',
        options: ['Zero', 'Exactly one', 'Two', 'Unlimited'],
        answer: 1,
        explanation:
          'A hierarchical record has exactly one parent; multiple parents would break the tree structure.',
      },
      {
        question: 'What is the main access method in a hierarchical database?',
        options: ['Declarative SQL joins', 'Navigating parent-child paths', 'Hashing every record', 'Full-table scans only'],
        answer: 1,
        explanation:
          'Applications navigate from parent to child along a predefined path.',
      },
    ],
  },

  {
    chapterId: 'network-model',
    hook:
      'The network model turns the tree into a graph. Many-to-many becomes possible, but the program now has to navigate a web of sets.',
    objectives: [
      'Explain records and sets in the network model.',
      'Describe owner and member records.',
      'Trace many-to-many relationships through sets.',
      'Know the costs of navigational graph access.',
    ],
    sections: [
      {
        title: 'Records and sets',
        body:
          'The network model stores records and connects them with sets. A set has one owner record type and one or more member record types. A member can belong to several sets, so a record can have multiple parents. This removes the hierarchical restriction and supports many-to-many relationships.',
        code: String.raw`Owner: Department
Set: employs
Members: Employee

Owner: Project
Set: assigns
Members: Employee

Employee can be a member of both sets.`,
      },
      {
        title: 'Navigational access',
        body:
          'Programs navigate from an owner to its members, or from a member back to its owners, using set pointers. The schema encodes the allowed paths. Access can be very fast for those paths, but the application must know the graph and the set names.',
      },
      {
        title: 'Trade-offs',
        body:
          'The network model supports complex relationships and avoids the duplication of hierarchical many-to-many workarounds. However, schema changes can break navigation, queries are procedural, and developers must understand the physical set structure. The relational model replaced it for most general-purpose applications because declarative queries and logical independence proved more valuable.',
      },
    ],
    keyTakeaways: [
      'Network databases are graphs of records connected by sets.',
      'A record can be a member of multiple sets, enabling many-to-many relationships.',
      'Access is navigational through owner/member links.',
      'Fast for known paths, brittle for changing queries.',
      'The relational model traded navigation for declarative access.',
    ],
    pitfalls: [
      'Assuming a set is the same as a relational table.',
      'Forgetting that navigation follows predefined paths.',
      'Ignoring the complexity of schema evolution.',
    ],
    focusPoints: [
      'Draw a set with an owner and members.',
      'Explain how a record can have multiple parents.',
      'Compare network navigation with relational joins.',
    ],
    quiz: [
      {
        question: 'What is a set in the network model?',
        options: [
          'A relationship between an owner record and member records',
          'A table of rows',
          'A primary key',
          'A file on disk',
        ],
        answer: 0,
        explanation:
          'A set defines a one-to-many link from an owner record type to member record types.',
      },
      {
        question: 'How does the network model support many-to-many relationships?',
        options: [
          'A record can be a member of multiple sets',
          'Every record has one parent',
          'It duplicates every row',
          'It uses SQL joins',
        ],
        answer: 0,
        explanation:
          'Because a member record can belong to several sets, it can be linked to multiple owners.',
      },
    ],
  },
];
