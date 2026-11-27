import type { DBMSLesson } from './types';

export const normalizationLessons: DBMSLesson[] = [
  {
    chapterId: 'functional-dependencies',
    plainEnglish: 'If you know a student\'s ID, you know their name. That is a functional dependency.',
    hook:
      'A functional dependency is a rule about the data: if you know X, you can determine Y. Normalization is the process of organizing tables so those rules do not create redundancy.',
    objectives: [
      'Read X → Y as a functional dependency.',
      'Apply Armstrong\'s axioms to derive dependencies.',
      'Compute an attribute closure.',
      'Identify partial and transitive dependencies.',
    ],
    sections: [
      {
        title: 'The notation',
        body:
          'X → Y means every pair of tuples that agree on X must also agree on Y. If student_id → student_name, two rows with the same student_id must have the same student_name. The dependency is a property of the domain, not of the current rows.',
        code: String.raw`student_id -> student_name
course_id  -> course_name
(student_id, course_id) -> grade`,
      },
      {
        title: 'Armstrong\'s axioms',
        body:
          'Reflexivity: if Y is a subset of X, then X → Y. Augmentation: if X → Y, then XZ → YZ. Transitivity: if X → Y and Y → Z, then X → Z. These three rules generate all dependencies implied by a set. Union and decomposition are derived rules.',
        code: String.raw`reflexivity:   if Y ⊆ X, then X -> Y
augmentation:  if X -> Y, then XZ -> YZ
transitivity:  if X -> Y and Y -> Z, then X -> Z`,
      },
      {
        title: 'Closure and candidate keys',
        body:
          'The closure of X, written X+, is the set of all attributes determined by X. If X+ contains every attribute, X is a superkey. If no proper subset of X has that property, X is a candidate key. Computing closures is a systematic way to find keys from dependencies.',
        code: String.raw`R(A, B, C, D)
A -> B
B -> C

A+ = {A, B, C}
A is not a key unless D is also determined.`,
      },
      {
        title: 'Partial and transitive dependencies',
        body:
          'A partial dependency is a non-key attribute that depends on only part of a composite key. A transitive dependency is a non-key attribute that depends on another non-key attribute. Both are the targets of 2NF and 3NF respectively.',
      },
    ],
    keyTakeaways: [
      'X → Y means X determines Y.',
      'Armstrong\'s axioms derive all implied dependencies.',
      'X+ is the set of attributes determined by X.',
      'A candidate key determines every attribute and is minimal.',
      'Partial and transitive dependencies cause redundancy.',
    ],
    pitfalls: [
      'Reading dependencies from a single sample table rather than the domain.',
      'Forgetting that a candidate key must be minimal.',
      'Confusing a superkey with a candidate key.',
    ],
    focusPoints: [
      'Compute a closure from a small dependency set.',
      'Find a candidate key.',
      'Identify a partial and a transitive dependency.',
    ],
    quiz: [
      {
        question: 'What does X → Y mean?',
        options: ['X determines Y', 'Y determines X', 'X and Y are equal', 'X is a foreign key'],
        answer: 0,
        explanation:
          'Every pair of tuples that agree on X must also agree on Y.',
      },
      {
        question: 'Which axiom says if X → Y, then XZ → YZ?',
        options: ['Reflexivity', 'Augmentation', 'Transitivity', 'Decomposition'],
        answer: 1,
        explanation: 'Augmentation lets you add the same attributes to both sides.',
      },
    ],
  },

  {
    chapterId: 'anomalies',
    plainEnglish: 'It is writing the same fact in many places: change one copy and forget another, and the notebook disagrees with itself.',
    hook:
      'A badly designed table can be internally consistent today and impossible to update correctly tomorrow. Anomalies are the symptoms.',
    objectives: [
      'Recognize insertion, update, and deletion anomalies.',
      'Explain redundancy in a denormalized table.',
      'Connect anomalies to functional dependencies.',
      'Know why normalization reduces anomalies.',
    ],
    sections: [
      {
        title: 'The denormalized table',
        body:
          'Consider Enrollment(student_id, student_name, course_id, course_name, instructor_id, instructor_name, grade). Student names repeat for every course, course names repeat for every student, and instructor names repeat for every course. The redundancy is the root cause of the anomalies.',
        code: String.raw`student_id | student_name | course_id | course_name | instructor
1          | Ada          | C1        | DBMS        | I1
1          | Ada          | C2        | OS          | I2
2          | Grace        | C1        | DBMS        | I1`,
      },
      {
        title: 'Insertion anomaly',
        body:
          'You cannot insert a new course without a student, because the table requires a student_id. You cannot insert a student without a course. The schema forces unrelated facts to be stored together.',
      },
      {
        title: 'Update and deletion anomalies',
        body:
          'If the course name changes, every row for that course must be updated; missing one creates inconsistency. Deleting the last student in a course can erase the course and instructor information entirely. Normalization splits the facts into separate relations so each fact is stored once.',
      },
    ],
    keyTakeaways: [
      'Insertion anomalies prevent storing independent facts.',
      'Update anomalies cause inconsistent copies of the same fact.',
      'Deletion anomalies erase unrelated facts.',
      'Redundancy is the common cause.',
      'Normalization stores each fact once.',
    ],
    pitfalls: [
      'Thinking anomalies only appear with duplicate rows; they can appear with no exact duplicate.',
      'Denormalizing before understanding the workload.',
      'Blaming the DBMS for a schema design problem.',
    ],
    focusPoints: [
      'Give one concrete insertion, update, and deletion anomaly.',
      'Trace redundancy to a functional dependency.',
      'Explain how decomposition removes the anomaly.',
    ],
    quiz: [
      {
        question: 'What causes an update anomaly?',
        options: [
          'The same fact is stored in multiple rows',
          'The table has too many indexes',
          'The primary key is too short',
          'The DBMS is slow',
        ],
        answer: 0,
        explanation:
          'When a fact is duplicated, updating one copy and not the others creates inconsistency.',
      },
      {
        question: 'Which anomaly can erase unrelated facts?',
        options: ['Insertion', 'Update', 'Deletion', 'Projection'],
        answer: 2,
        explanation:
          'Deleting the last row that contains a course or instructor can remove that information entirely.',
      },
    ],
  },

  {
    chapterId: 'first-normal-form',
    plainEnglish: 'One fact per box. Do not stuff a whole shopping list into one cell.',
    walkthrough: { kind: 'normalization', form: '1NF' },
    hook:
      'First normal form is simple: every value must be atomic. No lists, no repeating groups, no hidden multiple values in one cell.',
    objectives: [
      'State the 1NF rule.',
      'Recognize multivalued and repeating attributes.',
      'Decompose a non-1NF table.',
      'Choose a primary key for the decomposed tables.',
    ],
    sections: [
      {
        title: 'The rule',
        body:
          'A relation is in first normal form if every attribute contains only atomic values and there are no repeating groups. A cell holding "555-0100, 555-0101" is a multivalued attribute, not an atomic value. A table with Phone1, Phone2, Phone3 columns has a repeating group.',
      },
      {
        title: 'Decomposition',
        body:
          'Move the multivalued attribute into a separate relation with a foreign key back to the original entity. Student(id, name, phones) becomes Student(id, name) and StudentPhone(student_id, phone). The new table\'s primary key is the combination of student_id and phone.',
        code: String.raw`before:
Student(id, name, phones)
1, Ada, "555-0100, 555-0101"

after:
Student(id, name)
StudentPhone(student_id, phone)
1, 1, 555-0100
1, 1, 555-0101`,
      },
      {
        title: 'Why it matters',
        body:
          'Atomic values make queries, constraints, and updates predictable. You can index a phone number, enforce a format, or count phones without parsing a comma-separated string. 1NF is the foundation for every later normal form.',
      },
    ],
    keyTakeaways: [
      '1NF requires atomic values and no repeating groups.',
      'Multivalued attributes become separate relations.',
      'Repeating columns such as Phone1, Phone2 are not 1NF.',
      'The decomposed relation usually has a composite key.',
      '1NF makes constraints and queries simpler.',
    ],
    pitfalls: [
      'Storing comma-separated lists in a single column.',
      'Using repeating columns instead of a child table.',
      'Thinking 1NF requires a single-column primary key.',
    ],
    focusPoints: [
      'Identify a non-atomic attribute.',
      'Decompose a multivalued attribute into a child table.',
      'Explain why atomic values help constraints.',
    ],
    quiz: [
      {
        question: 'What is required for 1NF?',
        options: ['Atomic attribute values', 'No foreign keys', 'A single-column primary key', 'No NULL values'],
        answer: 0,
        explanation:
          'Every attribute value must be atomic, with no repeating groups or lists.',
      },
      {
        question: 'How do you represent a multivalued attribute in 1NF?',
        options: ['In a separate child table', 'In a comma-separated string', 'In multiple columns', 'In a BLOB'],
        answer: 0,
        explanation:
          'The multivalued attribute becomes a child table with a foreign key to the parent entity.',
      },
    ],
  },

  {
    chapterId: 'second-normal-form',
    plainEnglish: 'If a fact belongs to only half of a two-part key, give it its own table.',
    walkthrough: { kind: 'normalization', form: '2NF' },
    hook:
      'Second normal form removes dependencies on only part of a composite key. If a non-key attribute depends on half the key, it belongs in another table.',
    objectives: [
      'Identify a composite primary key.',
      'Detect a partial dependency.',
      'Decompose a relation into 2NF.',
      'Explain why 1NF is a prerequisite.',
    ],
    sections: [
      {
        title: 'The rule',
        body:
          'A relation is in 2NF if it is in 1NF and every non-key attribute is fully functionally dependent on the whole primary key. If the primary key is a single attribute, 2NF is automatic. Partial dependencies only matter with composite keys.',
      },
      {
        title: 'A partial dependency example',
        body:
          'Enrollment(student_id, course_id, student_name, course_name, grade) has primary key (student_id, course_id). student_name depends only on student_id; course_name depends only on course_id. Both are partial dependencies. grade depends on the full key.',
        code: String.raw`(student_id, course_id) -> grade     full dependency
student_id -> student_name            partial
course_id  -> course_name             partial`,
      },
      {
        title: 'Decomposition',
        body:
          'Split the partial dependencies into their own relations: Student(student_id, student_name), Course(course_id, course_name), and Enrollment(student_id, course_id, grade). The enrollment table keeps the full-key dependency; the others keep the single-attribute dependencies.',
        code: String.raw`Student(student_id, student_name)
Course(course_id, course_name)
Enrollment(student_id, course_id, grade)`,
      },
    ],
    keyTakeaways: [
      '2NF removes partial dependencies on a composite key.',
      'A relation with a single-attribute key is automatically in 2NF if it is in 1NF.',
      'Decompose each partial dependency into its own relation.',
      'The junction table keeps the full-key dependency.',
      '2NF reduces redundancy and update anomalies.',
    ],
    pitfalls: [
      'Applying 2NF to a single-attribute key and expecting changes.',
      'Forgetting that 1NF is a prerequisite.',
      'Losing the relationship between the decomposed tables.',
    ],
    focusPoints: [
      'Identify the composite key.',
      'Test each non-key attribute for full dependency.',
      'Decompose and preserve the junction table.',
    ],
    quiz: [
      {
        question: 'What does 2NF remove?',
        options: ['Partial dependencies on a composite key', 'Transitive dependencies', 'Multivalued attributes', 'Foreign keys'],
        answer: 0,
        explanation:
          '2NF requires every non-key attribute to depend on the whole composite key, not just part of it.',
      },
      {
        question: 'If a relation has a single-attribute primary key and is in 1NF, is it in 2NF?',
        options: ['Yes', 'No', 'Only if it has no NULLs', 'Only if it has an index'],
        answer: 0,
        explanation:
          'Partial dependencies require a composite key, so a single-attribute key cannot have one.',
      },
    ],
  },

  {
    chapterId: 'third-normal-form',
    plainEnglish: 'If A tells you B, and B tells you C, do not store C next to A.',
    walkthrough: { kind: 'normalization', form: '3NF' },
    hook:
      'Third normal form removes the chain: a non-key attribute should not determine another non-key attribute.',
    objectives: [
      'Define a transitive dependency.',
      'Test a relation for 3NF.',
      'Decompose a relation into 3NF.',
      'Explain the trade-offs of further normalization.',
    ],
    sections: [
      {
        title: 'The rule',
        body:
          'A relation is in 3NF if it is in 2NF and no non-key attribute transitively determines another non-key attribute. Equivalently, every functional dependency X → A has X as a superkey or A as a prime attribute. The second wording is the formal test.',
      },
      {
        title: 'A transitive dependency example',
        body:
          'Student(student_id, student_name, advisor_id, advisor_name) has student_id → advisor_id and advisor_id → advisor_name. Therefore student_id → advisor_name transitively. advisor_name is a non-key attribute determined by another non-key attribute, so the relation is not in 3NF.',
        code: String.raw`student_id -> advisor_id
advisor_id -> advisor_name
student_id -> advisor_name   transitive`,
      },
      {
        title: 'Decomposition',
        body:
          'Split the transitive dependency into its own relation: Student(student_id, student_name, advisor_id) and Advisor(advisor_id, advisor_name). The foreign key advisor_id preserves the relationship. The decomposition is lossless because the common attribute is a key in one of the relations.',
        code: String.raw`Student(student_id, student_name, advisor_id)
Advisor(advisor_id, advisor_name)`,
      },
      {
        title: 'Trade-offs',
        body:
          '3NF reduces redundancy and update anomalies, but it can increase the number of joins. Sometimes a controlled denormalization is justified for read-heavy workloads. Make that choice deliberately, with measurements, not by accident.',
      },
    ],
    keyTakeaways: [
      '3NF removes transitive dependencies among non-key attributes.',
      'The formal test: every determinant is a superkey or the dependent is prime.',
      'Decompose the transitive dependency into its own relation.',
      'Lossless decomposition requires a common key.',
      'Denormalize only with a measured reason.',
    ],
    pitfalls: [
      'Confusing 3NF with 2NF.',
      'Decomposing without preserving the relationship.',
      'Denormalizing before measuring the read workload.',
    ],
    focusPoints: [
      'Identify a transitive dependency.',
      'Apply the formal 3NF test.',
      'Decompose and verify a lossless join.',
    ],
    quiz: [
      {
        question: 'What does 3NF remove?',
        options: ['Transitive dependencies among non-key attributes', 'Partial dependencies', 'Multivalued attributes', 'Foreign keys'],
        answer: 0,
        explanation:
          '3NF ensures non-key attributes do not depend on other non-key attributes.',
      },
      {
        question: 'Which decomposition is lossless?',
        options: [
          'The common attribute is a key in at least one relation',
          'Both relations have the same number of rows',
          'Both relations have no foreign keys',
          'The common attribute is nullable',
        ],
        answer: 0,
        explanation:
          'A lossless join is guaranteed when the common attribute is a key in one of the decomposed relations.',
      },
    ],
  },
];
