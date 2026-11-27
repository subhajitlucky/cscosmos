import type { DBMSLesson } from './types';

export const foundationLessons: DBMSLesson[] = [
  {
    chapterId: 'dbms-introduction',
    plainEnglish: 'A DBMS is like a librarian for data: it keeps the books safe, tracks who borrowed them, and stops two people from scribbling on the same page.',
    hook:
      'A file can store data. A DBMS stores data, protects it, lets many users share it, and answers questions without rewriting the program.',
    objectives: [
      'Distinguish data, information, and metadata.',
      'Explain why a DBMS beats a collection of flat files.',
      'List the advantages and limitations of a DBMS.',
      'Identify the main users of a database system.',
    ],
    sections: [
      {
        title: 'Data, information, and metadata',
        body:
          'Data is raw values: 42, "Ada", 2026-11-27. Information is data interpreted in context: "Ada scored 42 in 2026." Metadata is data about the data: column names, types, constraints, and ownership. A database stores all three, which is why a query can be checked against a schema instead of trusting every program to agree on the format.',
      },
      {
        title: 'File system versus DBMS',
        body:
          'A file-based system scatters data across application-specific files. Redundancy, inconsistent formats, and concurrent-write bugs are the programmer\'s problem. A DBMS centralizes the data, enforces a schema, controls concurrent access, provides transactions and recovery, and supports declarative queries. The cost is complexity, memory, and administrative overhead.',
        code: String.raw`file system: app A -> students.txt
             app B -> students.csv
             app C -> students.db

DBMS:        all apps -> one schema -> one source of truth`,
      },
      {
        title: 'Users and roles',
        body:
          'A database administrator manages users, backups, performance, and security. A database designer models the domain and chooses the schema. Application developers write queries and transactions. End users interact through applications or reports. Each role sees a different level of abstraction, which is why the three-schema architecture matters.',
      },
      {
        title: 'Advantages and limitations',
        body:
          'Advantages include controlled redundancy, consistency, sharing, security, backup/recovery, and data independence. Limitations include cost, complexity, overhead for simple applications, and the risk of a single point of failure. A DBMS is worth it when data is shared, valuable, and queried in many ways.',
      },
    ],
    keyTakeaways: [
      'A DBMS centralizes data and enforces a schema.',
      'It provides concurrency control, recovery, security, and declarative querying.',
      'Redundancy and inconsistency are the core problems a DBMS solves.',
      'A DBMS adds cost and complexity; it is not free.',
      'DBA, designer, developer, and end user are distinct roles.',
    ],
    pitfalls: [
      'Thinking a DBMS is just a file with a fancy extension.',
      'Ignoring metadata and constraints.',
      'Assuming a DBMS is always the right choice for a tiny embedded app.',
    ],
    focusPoints: [
      'Name three problems a file system cannot solve well.',
      'List three advantages and one limitation of a DBMS.',
      'Know the difference between data, information, and metadata.',
    ],
    quiz: [
      {
        question: 'What is metadata?',
        options: ['Raw data values', 'Data about the data, such as schema and types', 'A backup file', 'A query result'],
        answer: 1,
        explanation:
          'Metadata describes the structure and meaning of data, such as column names, types, and constraints.',
      },
      {
        question: 'Which problem is a DBMS specifically designed to control?',
        options: ['Redundant and inconsistent data', 'Slow compilers', 'Missing fonts', 'Network cables'],
        answer: 0,
        explanation:
          'A DBMS centralizes data and enforces a schema to reduce redundancy and inconsistency.',
      },
    ],
  },

  {
    chapterId: 'dbms-architecture',
    plainEnglish: 'Think of a restaurant: the menu is what you see, the kitchen is the logical database, and the pantry is the physical storage.',
    hook:
      'A DBMS hides physical storage behind layers. That layering is why you can change a disk or add an index without rewriting every query.',
    objectives: [
      'Explain the three-schema architecture.',
      'Distinguish logical and physical data independence.',
      'Describe the query processor and storage manager.',
      'Know the role of the DBA and end users.',
    ],
    sections: [
      {
        title: 'The three schemas',
        body:
          'The external schema is what a particular user or application sees: a view or subset. The conceptual schema describes the whole logical database: entities, relationships, and constraints. The internal schema describes physical storage: files, pages, indexes, and compression. Mappings between the levels translate a user query into physical operations.',
        code: String.raw`external schema  -> views, application-specific subsets
conceptual schema -> tables, relationships, constraints
internal schema  -> files, pages, indexes, compression`,
      },
      {
        title: 'Data independence',
        body:
          'Logical data independence means you can change the conceptual schema, such as adding a column or splitting a table, without breaking existing external views. Physical data independence means you can change storage, such as adding an index or moving a file, without changing the logical schema. Both depend on the mappings between schema levels.',
      },
      {
        title: 'Query processor and storage manager',
        body:
          'The query processor parses SQL, validates it against the catalog, rewrites it into relational algebra, optimizes it using statistics and indexes, and executes the plan. The storage manager handles files, pages, buffer management, indexing, locking, and recovery. The transaction manager coordinates commits, rollbacks, and concurrency.',
      },
    ],
    keyTakeaways: [
      'External, conceptual, and internal schemas separate users, logic, and storage.',
      'Logical data independence protects views from logical schema changes.',
      'Physical data independence protects the schema from storage changes.',
      'The query processor parses, optimizes, and executes queries.',
      'The storage and transaction managers handle pages, indexes, locks, and recovery.',
    ],
    pitfalls: [
      'Confusing the conceptual schema with the physical layout.',
      'Thinking a view stores data; a view is usually a stored query.',
      'Assuming the optimizer always picks the best plan.',
    ],
    focusPoints: [
      'Draw the three levels and the mappings.',
      'Give one example of logical and physical independence.',
      'Trace a query from SQL text to execution.',
    ],
    quiz: [
      {
        question: 'Which schema describes physical storage?',
        options: ['External schema', 'Conceptual schema', 'Internal schema', 'View schema'],
        answer: 2,
        explanation:
          'The internal schema describes files, pages, indexes, and physical organization.',
      },
      {
        question: 'What does physical data independence allow?',
        options: [
          'Changing storage without changing the logical schema',
          'Changing users without changing passwords',
          'Deleting the catalog',
          'Ignoring constraints',
        ],
        answer: 0,
        explanation:
          'Physical data independence lets the storage layout change without rewriting the logical schema or queries.',
      },
    ],
  },

  {
    chapterId: 'data-models-overview',
    plainEnglish: 'A data model is a map. A tree map, a road map, and a grid map can all describe the same city.',
    hook:
      'A data model is a way of seeing the world. Hierarchical, network, relational, and object models differ in what they make easy and what they make awkward.',
    objectives: [
      'Define a data model.',
      'Compare hierarchical, network, relational, and object models.',
      'Know the strengths and weaknesses of each.',
      'Recognize why the relational model became dominant.',
    ],
    sections: [
      {
        title: 'What a data model provides',
        body:
          'A data model defines data structures, constraints, and operations. It gives designers a vocabulary for entities, attributes, and relationships, and gives the DBMS a way to validate and manipulate data. The model is separate from the physical storage used to implement it.',
      },
      {
        title: 'Hierarchical and network models',
        body:
          'The hierarchical model organizes records as a tree: one parent, many children. It is fast for one-to-many navigation but awkward for many-to-many relationships. The network model generalizes the tree into a graph of records and sets, supporting many-to-many links. Both are navigational: the program follows pointers rather than declaring what it wants.',
      },
      {
        title: 'Relational and object models',
        body:
          'The relational model represents data as relations (tables) and accesses it declaratively with relational algebra or SQL. It separates logical structure from physical navigation, which made it the dominant model. Object and document models add nested structures, inheritance, and flexible schemas, which suit complex or evolving data but complicate joins and constraints.',
        code: String.raw`hierarchical: parent -> children
network:      record <-> set <-> record
relational:   table(rows, columns)
object:       objects with identity, methods, references`,
      },
    ],
    keyTakeaways: [
      'A data model defines structures, constraints, and operations.',
      'Hierarchical models are trees; network models are graphs.',
      'Both legacy models are navigational.',
      'The relational model is declarative and separates logic from storage.',
      'Object and document models favor nested and flexible data.',
    ],
    pitfalls: [
      'Thinking a data model is the same as a file format.',
      'Assuming the relational model cannot represent complex data.',
      'Confusing network sets with relational tables.',
    ],
    focusPoints: [
      'Match each model to its structure.',
      'Explain navigational versus declarative access.',
      'Know one strength and one weakness of each model.',
    ],
    quiz: [
      {
        question: 'Which model organizes records as a tree?',
        options: ['Relational', 'Hierarchical', 'Network', 'Document'],
        answer: 1,
        explanation:
          'The hierarchical model uses parent-child trees, with one parent per record.',
      },
      {
        question: 'What is a key advantage of the relational model?',
        options: [
          'Declarative access separated from physical navigation',
          'It requires no schema',
          'It cannot represent many-to-many relationships',
          'It stores only text',
        ],
        answer: 0,
        explanation:
          'Relational queries state what data is wanted; the DBMS chooses how to navigate and execute.',
      },
    ],
  },
];
