import type { DBMSProblemSeed } from '../types';

export const group5Seeds: DBMSProblemSeed[] = [
  {
    chapterId: 'anomalies',
    title: 'Root Cause of Anomalies',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the usual root cause of insert, update, and delete anomalies in a relation?',
    options: [
      'Storing the same fact in many rows',
      'Using too many indexes',
      'Choosing a short primary key',
      'Running queries without transactions',
    ],
    answer: 0,
    explanation:
      'Repeated facts make one logical change require many row changes, and independent facts share a row.',
    hint: 'Think about one fact appearing in several places.',
  },
  {
    chapterId: 'anomalies',
    title: 'One Course, Many Copies',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which non-key fact is stored redundantly in this table?',
    context:
      'Enrollment\nstudent_id | course_id | course_name\n1          | C1        | Databases\n2          | C1        | Databases\n3          | C2        | Networks',
    options: ['student_id', 'course_id', 'The combination of student_id and course_id', 'course_name'],
    answer: 3,
    explanation:
      'Course C1 has the same course_name in two rows; the name follows course_id and is repeated. The course_id itself is the necessary link.',
    hint: 'Compare non-key values that repeat across different students.',
  },
  {
    chapterId: 'anomalies',
    title: 'Definition of an Update Anomaly',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which situation is an update anomaly?',
    options: [
      'A new course cannot be recorded until a student enrolls',
      'Deleting a row also removes unrelated course details',
      'A fact is changed in some rows but left stale in others',
      "Two transactions overwrite each other's changes",
    ],
    answer: 2,
    explanation:
      'An update anomaly occurs when duplicated data is updated inconsistently, leaving conflicting copies of one fact.',
    hint: 'It is about changing a repeated fact.',
  },
  {
    chapterId: 'anomalies',
    title: 'Definition of a Deletion Anomaly',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A deletion anomaly occurs when deleting one row...',
    options: [
      'fails because of a foreign key',
      'also erases facts that are unrelated to the deleted entity',
      'leaves duplicate rows behind',
      'changes the primary key of the table',
    ],
    answer: 1,
    explanation:
      'When an unrelated fact exists only in the deleted row, removing that row destroys the fact as a side effect.',
    hint: 'Ask what other information lived only in that row.',
  },
  {
    chapterId: 'anomalies',
    title: 'Definition of an Insertion Anomaly',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which problem is an insertion anomaly?',
    options: [
      'A new course cannot be added without inventing a student enrollment',
      'A row is inserted twice with the same key',
      'An insert is blocked by a CHECK constraint',
      'An insert creates a duplicate index entry',
    ],
    answer: 0,
    explanation:
      'The schema ties a course to a student, so an independent course fact cannot be inserted on its own.',
    hint: 'The table forces two unrelated facts into one row.',
  },
  {
    chapterId: 'anomalies',
    title: 'Last Enrollment for C3',
    difficulty: 'Easy',
    type: 'scenario',
    prompt:
      'Deleting the row for student 7 to remove Mia also removes the only record of course C3 and instructor Ito. Which anomaly is this?',
    context:
      'Enrollment\nstudent_id | student_name | course_id | course_name | instructor\n7          | Mia          | C3        | Graphics    | Ito\n8          | Noah         | C4        | Networks    | Rao',
    options: ['Insertion anomaly', 'Update anomaly', 'Deletion anomaly', 'Redundancy anomaly'],
    answer: 2,
    explanation:
      'The deleted row carried unrelated course and instructor facts, so the deletion destroys information that should survive.',
    hint: 'Identify the facts that disappear along with the student.',
  },
  {
    chapterId: 'anomalies',
    title: 'Adding C9 Before Anyone Enrolls',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Why can a new course C9 not be inserted before any student enrolls in it?',
    context:
      'Enrollment has primary key (student_id, course_id) and columns student_id, course_id, course_name. No separate Course table exists.',
    options: [
      'course_name is not atomic',
      'The composite primary key needs a student_id value',
      'The table has a transitive dependency',
      'The course lacks a foreign key',
    ],
    answer: 1,
    explanation:
      'With (student_id, course_id) as the key, a course-only row has no student_id value and cannot be represented.',
    hint: 'Every row must supply the whole primary key.',
  },
  {
    chapterId: 'anomalies',
    title: 'Repeated Instructor Names',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which functional dependency explains why instructor_name repeats?',
    context:
      'Section\ncourse_id | course_name | instructor_id | instructor_name\nC1        | DBMS        | I1            | Ito\nC2        | OS          | I1            | Ito\nC3        | Networks    | I2            | Rao',
    options: [
      'course_id → instructor_name',
      'course_name → course_id',
      'instructor_name → instructor_id',
      'instructor_id → instructor_name',
    ],
    answer: 3,
    explanation:
      'Instructor I1 appears in two rows with the same name, so instructor_id determines instructor_name.',
    hint: 'Find the attribute whose value stays fixed for a given instructor.',
  },
  {
    chapterId: 'anomalies',
    title: 'Not a Modification Anomaly',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which problem is not one of the three classic modification anomalies caused by a poor table design?',
    options: ['Insertion anomaly', 'Lost update', 'Update anomaly', 'Deletion anomaly'],
    answer: 1,
    explanation:
      'A lost update comes from concurrent transactions, not from redundant facts in a schema.',
    hint: 'One of these belongs to concurrency control.',
  },
  {
    chapterId: 'anomalies',
    title: 'Meaning of Redundancy',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In relational design, redundancy means that...',
    options: [
      'the same fact is stored in more than one place',
      'a table has more columns than rows',
      'a query joins too many tables',
      'a key contains more than one attribute',
    ],
    answer: 0,
    explanation:
      'Redundancy is repeated storage of one fact, which makes updates harder and wastes space.',
    hint: 'It is about repeated facts, not table shape.',
  },
  {
    chapterId: 'anomalies',
    title: 'Course Title Follows Course ID',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'If a relation stores course_name alongside course_id for every enrollment, which dependency explains why course_name can be stored redundantly?',
    options: [
      'student_id → course_name',
      'course_name → course_id',
      'course_id → course_name',
      'student_id → course_id',
    ],
    answer: 2,
    explanation:
      'Course_name is determined by course_id, so the same name repeats for every row that references that course.',
    hint: 'Which attribute identifies the course?',
  },
  {
    chapterId: 'anomalies',
    title: 'Which Attribute Is Redundant?',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'In Enrollment(student_id, course_id, grade, student_name), which attribute is redundant when student_name depends on student_id?',
    options: ['grade', 'course_id', 'student_id', 'student_name'],
    answer: 3,
    explanation:
      'Student_name can be derived from student_id, so storing it in every enrollment repeats a student fact.',
    hint: 'Look for the non-key attribute determined by another non-key attribute.',
  },
  {
    chapterId: 'anomalies',
    title: 'Renaming One of Forty Rows',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'A clerk changes a course name to Database Systems in only one of the 40 rows that repeat it. Which anomaly has occurred?',
    options: [
      'Insertion anomaly',
      'Deletion anomaly',
      'Update anomaly',
      'None, because course_id is unchanged',
    ],
    answer: 2,
    explanation:
      'The same course name now has two values, so the update was applied to one copy of a repeated fact.',
    hint: 'The fact exists in many rows, but only one was changed.',
  },
  {
    chapterId: 'anomalies',
    title: 'New Instructor Without a Section',
    difficulty: 'Medium',
    type: 'scenario',
    prompt:
      'A new instructor I3 must be recorded before being assigned any section. Which anomaly blocks this?',
    context:
      'Teaching\nsection_id | course_id | instructor_id | instructor_name | department\nS1         | C1        | I1            | Ito             | Computing\nS2         | C2        | I2            | Rao             | Computing\nsection_id is part of the primary key and cannot be NULL.',
    options: [
      'Insertion anomaly',
      'Update anomaly',
      'Deletion anomaly',
      'No anomaly; a NULL section_id works',
    ],
    answer: 0,
    explanation:
      'Instructor facts are tied to a section row, so an instructor with no section cannot be inserted without a placeholder.',
    hint: 'The entity facts have no independent home.',
  },
  {
    chapterId: 'anomalies',
    title: 'Deleting the Last Section of I2',
    difficulty: 'Medium',
    type: 'scenario',
    prompt:
      'Deleting section S2 removes the only record of the department and phone of instructor Rao. Which anomaly is this?',
    context:
      'Teaching\nsection_id | instructor_id | instructor_name | department | phone\nS2         | I2            | Rao             | Computing  | 555-0200',
    options: ['Insertion anomaly', 'Deletion anomaly', 'Update anomaly', 'Atomicity violation'],
    answer: 1,
    explanation:
      'Deleting a section also deletes independent instructor facts that happened to be stored only in that row.',
    hint: 'Ask which non-section facts vanish with the row.',
  },
  {
    chapterId: 'anomalies',
    title: 'Room Capacity Determined by Room',
    difficulty: 'Medium',
    type: 'scenario',
    prompt:
      'Which dependency directly causes room_capacity to be repeated for every course in the same room?',
    context:
      'Class\ncourse_id | course_name | room | room_capacity\nC1        | DBMS        | R101 | 40\nC2        | OS          | R101 | 40\nC3        | Networks    | R102 | 25\nFDs: course_id → room, room → room_capacity',
    options: [
      'course_id → room',
      'course_id → room_capacity',
      'room_capacity → room',
      'room → room_capacity',
    ],
    answer: 3,
    explanation:
      'Capacity belongs to the room, so room → room_capacity repeats the capacity for each course scheduled there.',
    hint: 'Find the determinant that is not the course.',
  },
  {
    chapterId: 'anomalies',
    title: 'Updating an Advisor Phone',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'A1 changes phone number, but only the row for Ada is updated. What is the immediate result?',
    context:
      'Student\nstudent_id | name  | advisor_id | advisor_phone\n1          | Ada   | A1         | 555-0100\n2          | Grace | A1         | 555-0100\n3          | Alan  | A2         | 555-0200\nFDs: student_id → advisor_id, advisor_id → advisor_phone',
    options: [
      'The table violates 1NF',
      'The phone for advisor A2 is deleted',
      'student_id is no longer a key',
      'Grace row shows a stale phone number for A1',
    ],
    answer: 3,
    explanation:
      'The phone fact was duplicated, and updating one copy leaves the other copy inconsistent with it.',
    hint: 'Trace both rows belonging to advisor A1.',
  },
  {
    chapterId: 'anomalies',
    title: 'Counting Extra Course Names',
    difficulty: 'Medium',
    type: 'scenario',
    prompt:
      'How many course_name values are unnecessary copies, compared with storing each name once per course?',
    context:
      'Enrollment has 200 rows covering 20 distinct courses. Each row stores course_name, and every course currently has 10 enrollments.',
    options: ['20', '180', '200', '10'],
    answer: 1,
    explanation:
      'One copy per course needs 20 stores, but 200 are kept, so 180 copies are unnecessary.',
    hint: 'Subtract the number of distinct courses from the number of rows.',
  },
  {
    chapterId: 'anomalies',
    title: 'Two Different Course Names for C1',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'What does this state demonstrate?',
    context:
      'After a partial update, the table contains:\nstudent_id | course_id | course_name\n1          | C1        | DBMS\n2          | C1        | Database Systems',
    options: [
      'A deletion anomaly',
      'A violation of domain atomicity',
      'An update anomaly that produced inconsistent copies',
      'A lossless join',
    ],
    answer: 2,
    explanation:
      'One logical course fact now has two values because the repeated name was not updated everywhere.',
    hint: 'The problem is inconsistency between two copies.',
  },
  {
    chapterId: 'anomalies',
    title: 'Course Notes Must Wait for a Student',
    difficulty: 'Medium',
    type: 'scenario',
    prompt:
      'A new course C8 with notes must be stored before enrollment opens. Which anomaly prevents this?',
    context:
      'Enrollment\nstudent_id (PK part, NOT NULL) | course_id (PK part) | course_name | course_note\nNo separate Course relation exists.',
    options: ['Insertion anomaly', 'Update anomaly', 'Deletion anomaly', 'Phantom read'],
    answer: 0,
    explanation:
      'A course cannot exist without a student_id because the only table for courses requires an enrollment key.',
    hint: 'What value would the missing key part take?',
  },
  {
    chapterId: 'anomalies',
    title: 'Parts and Suppliers Mixed',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which insertion is made awkward by this design?',
    context:
      'Supply\nsupplier_id | supplier_city | part_id | part_name | quantity\nS1          | Pune          | P1      | Bolt      | 100\nS1          | Pune          | P2      | Nut       | 200\nS2          | Delhi         | P1      | Bolt      | 50\nFDs: supplier_id → supplier_city, part_id → part_name, (supplier_id, part_id) → quantity',
    options: [
      'Adding another supply row for S1 and P1',
      'Changing the quantity for S1 and P2',
      'Deleting a supply row for S2 and P1',
      'Adding a new part that no supplier supplies',
    ],
    answer: 3,
    explanation:
      'A part name is tied to a supply row, so a part with no supplier lacks a key value for the table.',
    hint: 'Look for an entity that can exist independently of a supply relationship.',
  },
  {
    chapterId: 'anomalies',
    title: 'A Grade Is Not Redundant',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Why is grade not considered redundant in this table?',
    context:
      'Enrollment\nstudent_id | course_id | grade\n1          | C1        | A\n2          | C1        | B\n1          | C2        | A\nFD: (student_id, course_id) → grade. No smaller determinant is given.',
    options: [
      'It depends on only part of the key',
      'It is determined by the entire composite key and by neither part alone',
      'It is a prime attribute',
      'It has few distinct values',
    ],
    answer: 1,
    explanation:
      'A grade belongs to one student-course pair, so the full key determines it and no smaller determinant repeats it.',
    hint: 'Which attributes are needed to identify one grade?',
  },
  {
    chapterId: 'anomalies',
    title: 'Design That Avoids All Three Anomalies',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Which decomposition best removes the insert, update, and delete anomalies of Enrollment(student_id, student_name, course_id, course_name, grade)?',
    options: [
      'Student(student_id, student_name), Course(course_id, course_name), Enrollment(student_id, course_id, grade)',
      'Student(student_id, student_name, course_id), Course(course_id, course_name), Grade(student_id, grade)',
      'Enrollment(student_id, course_id, grade), CourseNames(course_id, course_name, student_name)',
      'StudentCourse(student_id, course_id, student_name, course_name, grade)',
    ],
    answer: 0,
    explanation:
      'Each fact gets one home: student facts, course facts, and the grade for a student-course pair.',
    hint: 'Separate the entities from the relationship that connects them.',
  },
  {
    chapterId: 'anomalies',
    title: 'Which Link Explains the Repetition?',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'If Enrollment stores student_id, student_name, and course_id, which dependency best explains why student_name repeats across course rows?',
    options: [
      'course_id → student_name',
      'student_name → course_id',
      'student_id → student_name',
      'course_id → student_id',
    ],
    answer: 2,
    explanation:
      'Student_name follows student_id, so it repeats wherever that student appears with another course.',
    hint: 'Which attribute identifies the student?',
  },
  {
    chapterId: 'anomalies',
    title: 'Independent Facts Sharing a Row',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'What design problem arises when one relation stores course facts and instructor facts but no relationship requires them to appear together?',
    options: [
      'Each fact must be repeated or forced to wait for the other',
      'The relation automatically violates 3NF',
      'The relation cannot have a primary key',
      'All attributes become prime',
    ],
    answer: 0,
    explanation:
      'Unrelated facts in one row either repeat across rows or block insertion until a matching row exists.',
    hint: 'Think about what happens when only one of the facts is known.',
  },
  {
    chapterId: 'anomalies',
    title: 'Partial Decomposition Leaves Redundancy',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'If only Course(course_id, course_name) is extracted, what redundancy remains in Enrollment?',
    context:
      'Enrollment\nstudent_id | course_id | student_name | course_name | grade\n1          | C1        | Ada          | DBMS        | A\n1          | C2        | Ada          | OS          | B\n2          | C1        | Grace        | DBMS        | A\nFDs: student_id → student_name, course_id → course_name',
    options: [
      'No redundancy remains because course_name is extracted',
      'grade becomes redundant once course_name is removed',
      'student_name still repeats for every course, so a Student relation is also needed',
      'course_id becomes a foreign key and cannot repeat',
    ],
    answer: 2,
    explanation:
      'Removing course_name leaves student_name duplicated across the enrollments of each student, so a second split is required.',
    hint: 'Check the other non-key attribute against its determinant.',
  },
  {
    chapterId: 'anomalies',
    title: 'Adding a Part Before Any Supply',
    difficulty: 'Hard',
    type: 'scenario',
    prompt:
      'Which pair of facts is forced to share a row, so neither can be recorded alone?',
    context:
      'Supply\nsupplier_id | supplier_city | part_id | part_name | quantity\nS1          | Pune          | P1      | Bolt      | 100\nS2          | Delhi         | P1      | Bolt      | 50\nFDs: supplier_id → supplier_city, part_id → part_name, (supplier_id, part_id) → quantity',
    options: [
      'Supplier and quantity',
      'Part and quantity',
      'Supplier city and part name',
      'Supplier and part',
    ],
    answer: 3,
    explanation:
      'Supplier and part facts share every row; a supplier with no part, or a part with no supplier, cannot be stored.',
    hint: 'Which two entities form the key of the relationship?',
  },
  {
    chapterId: 'anomalies',
    title: 'After Splitting Student and Course',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which redundancy is most directly eliminated by creating the Course relation?',
    context:
      'Enrollment was decomposed into:\nStudent(student_id, student_name)\nCourse(course_id, course_name)\nEnrollment(student_id, course_id, grade)',
    options: [
      'The repeat of student_name across enrollment rows',
      'The repeat of course_name across enrollment rows',
      'The repeat of grade values across students',
      'The repeat of the composite key in Enrollment',
    ],
    answer: 1,
    explanation:
      'Course_name now lives once per course, so the Course relation removes the repeated course fact from enrollment rows.',
    hint: 'Which attribute does the Course relation own?',
  },
  {
    chapterId: 'anomalies',
    title: 'Recombining Student and Advisor',
    difficulty: 'Hard',
    type: 'scenario',
    prompt:
      'If these are merged into Student(student_id, name, advisor_id, advisor_name, advisor_phone), which anomaly becomes most likely?',
    context:
      'Normalized tables:\nStudent(student_id, name, advisor_id)\nAdvisor(advisor_id, advisor_name, advisor_phone)',
    options: [
      'An update anomaly when an advisor phone changes',
      'A lossless join failure',
      'An insertion anomaly for new students',
      'A violation of domain atomicity',
    ],
    answer: 0,
    explanation:
      'Advisor facts would repeat for every advisee, so changing one phone would require updating many rows consistently.',
    hint: 'Which fact would now appear once per student?',
  },
  {
    chapterId: 'anomalies',
    title: 'Not Caused by Redundancy',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'Which problem is not a schema redundancy anomaly, even though it can corrupt data?',
    options: [
      'A course name left stale in some enrollment rows',
      'A lost update caused by two concurrent transactions',
      'A course that cannot be inserted without a student',
      'An advisor phone erased with the last advisee',
    ],
    answer: 1,
    explanation:
      'A lost update is a concurrency-control failure; the schema could be fully normalized and still allow it.',
    hint: 'One problem depends on transaction timing, not table design.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'The First Normal Form Rule',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which requirement defines first normal form?',
    options: [
      'Every non-key attribute depends on the whole key',
      'Every attribute value is atomic and no repeating groups exist',
      'Every determinant is a candidate key',
      'No non-key attribute determines another non-key attribute',
    ],
    answer: 1,
    explanation:
      '1NF requires one atomic value per attribute position and no sets, lists, or repeating column groups.',
    hint: 'Think about what can appear in a single cell.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'What Counts as Atomic',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'For 1NF, an attribute value is atomic when it...',
    options: [
      'is treated as a single indivisible value by the model',
      'contains no punctuation',
      'is shorter than 255 characters',
      'is never NULL',
    ],
    answer: 0,
    explanation:
      'Atomicity is about how the model uses the value, not its length or punctuation.',
    hint: 'It is about meaning, not formatting.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Multivalued Attribute',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which attribute is multivalued?',
    options: [
      'A student date of birth',
      'A course credit count',
      'A student list of phone numbers',
      'An employee salary',
    ],
    answer: 2,
    explanation:
      'A list of phone numbers gives one attribute multiple values per entity, which violates 1NF.',
    hint: 'Look for a value that naturally holds more than one item.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Phone Columns as a Repeating Group',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why does a Student table with columns Phone1, Phone2, and Phone3 violate 1NF?',
    options: [
      'Phone numbers contain digits',
      'The table has no foreign key',
      'The columns are optional',
      'The columns form a repeating group for one attribute',
    ],
    answer: 3,
    explanation:
      'Phone1 through Phone3 store repeated instances of the same attribute instead of separate rows.',
    hint: 'The three columns represent the same fact more than once.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Tags in a Single Cell',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which 1NF problem does the tags column have?',
    context:
      'Article\narticle_id | title    | tags\nA1         | Indexing | sql,index,btree',
    options: [
      'It contains a NULL',
      'It stores several values in one attribute position',
      'It has no primary key',
      'It depends on only part of a key',
    ],
    answer: 1,
    explanation:
      'The tags cell holds a list, so the attribute is multivalued rather than atomic.',
    hint: 'Count how many distinct tags share one cell.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Student Phone Child Table',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which child relation is the usual 1NF result?',
    context:
      'Student(student_id, name, phones) is decomposed to remove the multivalued phones attribute.',
    options: [
      'StudentPhone(student_id, phone)',
      'Phone(phone, student_name)',
      'StudentPhone(student_id, name, phones)',
      'Phone(student_id, phone1, phone2)',
    ],
    answer: 0,
    explanation:
      'Each phone becomes its own row keyed by the student and the phone value.',
    hint: 'One row per student-phone pair.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Skill Columns Violate 1NF',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which normal form does this table violate?',
    context:
      'Employee\nemp_id | name  | skill1 | skill2 | skill3\nE1     | Ada   | SQL    | Python | NULL\nE2     | Grace | Java   | NULL   | NULL',
    options: ['2NF only', '3NF only', '1NF', 'No normal form; it is already normalized'],
    answer: 2,
    explanation:
      'Skill1, skill2, and skill3 repeat one attribute across columns, creating a repeating group.',
    hint: 'The numbered skill columns are the clue.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Genres Held as a Set',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'A film table stores a comma-separated genre list in one column. What is the most direct 1NF fix?',
    options: [
      'Add more genre columns',
      'Store genres as uppercase text',
      'Add a surrogate key to Film',
      'Move each film-genre pair to a separate FilmGenre table',
    ],
    answer: 3,
    explanation:
      'A child table stores one genre per row, making each value atomic and queryable.',
    hint: 'Replace the list with one row per value.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Does 1NF Ban NULL?',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Does first normal form forbid NULL values?',
    options: [
      'Yes, every attribute must be NOT NULL',
      'No, 1NF says nothing about NULL',
      'Only for primary key columns',
      'Only for numeric columns',
    ],
    answer: 1,
    explanation:
      '1NF concerns atomic values and repeating groups; NULL handling is a separate constraint decision.',
    hint: 'Do not confuse atomicity with mandatory values.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Does 1NF Require a Single-Column Key?',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Does 1NF require a single-column primary key?',
    options: [
      'No, a composite key is allowed',
      'Yes, every relation needs one column',
      'Only if the relation has no foreign keys',
      'Only for child tables',
    ],
    answer: 0,
    explanation:
      '1NF permits composite keys; in fact, decomposed multivalued attributes often produce them.',
    hint: 'Atomic values and key shape are different issues.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Role of Student_ID in StudentPhone',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'What role does student_id play in StudentPhone?',
    context: 'Student(student_id, name)\nStudentPhone(student_id, phone)',
    options: [
      'It is an alternate key',
      'It is a non-key attribute',
      'It is a foreign key referencing Student',
      'It is a multivalued attribute',
    ],
    answer: 2,
    explanation:
      'StudentPhone uses student_id to link each phone back to its owning student.',
    hint: 'It points to the parent relation.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Order of Normal Forms',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which statement about the normal forms is correct?',
    options: [
      'A relation can be in 2NF without being in 1NF',
      '3NF removes repeating groups',
      '1NF removes transitive dependencies',
      '1NF is a prerequisite for 2NF and 3NF',
    ],
    answer: 3,
    explanation:
      'Higher normal forms assume the earlier ones, so atomic values come first.',
    hint: 'Normalization builds upward from the first form.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Splitting an Order List',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which decomposition removes the 1NF violation while preserving the quantities?',
    context:
      'Orders\norder_id | customer | items\n1001     | Ada      | Pen x2, Book x1',
    options: [
      'Order(order_id, customer) and OrderItem(order_id, item, quantity)',
      'Order(order_id, customer, item) and Quantity(order_id, quantity)',
      'Order(order_id, items) and Customer(customer)',
      'OrderItem(order_id, item, quantity) only',
    ],
    answer: 0,
    explanation:
      'Order keeps the customer fact, while OrderItem stores one item and its quantity per row.',
    hint: 'Each item needs its own row and a place for its quantity.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Sparse Phone Columns',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Besides violating 1NF, what practical problem do the phone columns create?',
    context:
      'Contact\ncontact_id | phone1   | phone2   | phone3\n1          | 555-0100 | NULL     | NULL\n2          | 555-0200 | 555-0201 | NULL\n3          | 555-0300 | 555-0301 | 555-0302',
    options: [
      'They make contact_id non-unique',
      'They impose a fixed maximum and waste space on NULLs',
      'They prevent the use of foreign keys',
      'They make every phone value non-atomic',
    ],
    answer: 1,
    explanation:
      'The design caps phones at three and stores many empty columns as the number of phones varies.',
    hint: 'What happens when a contact needs a fourth phone?',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Atomicity of a Full Name',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Is splitting name into first_name and last_name required by 1NF?',
    context:
      'A designer stores name as a single value such as Ada Lovelace and never queries first and last names separately.',
    options: [
      'Yes, every composite value must be split',
      'Yes, because a space makes it multivalued',
      'Only if the name is a primary key',
      'No, 1NF does not require splitting values that the model treats as one',
    ],
    answer: 3,
    explanation:
      'Atomicity depends on use; a full name used as one unit can remain a single attribute.',
    hint: 'Do not confuse composite with multivalued.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'JSON Array of Reviews',
    difficulty: 'Medium',
    type: 'scenario',
    prompt:
      'If each review must be queried and constrained independently, what is the best assessment?',
    context:
      'Product\nproduct_id | name | reviews\nP1         | Lamp | [{"user":"Ada","stars":5},{"user":"Bo","stars":4}]',
    options: [
      'The table is in 1NF because JSON is one value',
      'The table is in 2NF but not 3NF',
      'The reviews attribute is multivalued for this use, so it violates 1NF',
      'JSON always violates 2NF but never 1NF',
    ],
    answer: 2,
    explanation:
      'When individual reviews are data items, packing them into one attribute makes the value non-atomic.',
    hint: 'Consider what the application needs to do with each review.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Key of the Decomposed Phone Table',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'A student-phone child table stores (student_id, phone). A student may have many phones, and family members may share a phone number. What is the appropriate primary key?',
    options: ['student_id alone', '(student_id, phone)', 'phone alone', 'There is no key because phones repeat'],
    answer: 1,
    explanation:
      'Neither attribute is unique alone, but the pair identifies one phone belonging to one student.',
    hint: 'Which combination distinguishes the repeated values?',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Benefit of the Phone Child Table',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which statement is true after moving the phone columns to StudentPhone(student_id, phone)?',
    context:
      'Student(student_id, name, phone1, phone2) stores one row per student and allows at most two phones.',
    options: [
      'A student can have any number of phones without adding columns',
      'Student names are now stored once per phone',
      'Phone numbers become unique across all students',
      'The foreign key is no longer needed',
    ],
    answer: 0,
    explanation:
      'The child table grows by rows, not columns, so the fixed phone1 and phone2 limit disappears.',
    hint: 'Think about adding a third phone.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Course Prerequisites List',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which attribute is non-atomic, and what should replace it?',
    context:
      'Course\ncourse_code | title           | prerequisites\nCS201       | Data Structures | CS101;CS102',
    options: [
      'course_code; use a numeric ID',
      'title; split it into words',
      'prerequisites; keep it as a semicolon list',
      'prerequisites; use a CoursePrereq(course_code, prereq_code) table',
    ],
    answer: 3,
    explanation:
      'The prerequisites cell holds a set of course codes, so each prerequisite should become its own row.',
    hint: 'The semicolons separate multiple values.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Rows for a Prerequisite Table',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which rows belong in CoursePrereq?',
    context:
      'CS201 has prerequisites CS101 and CS102. The new table is CoursePrereq(course_code, prereq_code).',
    options: [
      '(CS201, CS101;CS102) as one row',
      '(CS201, CS101) only',
      '(CS201, CS101) and (CS201, CS102)',
      '(CS101, CS102) and (CS201, NULL)',
    ],
    answer: 2,
    explanation:
      'Each prerequisite pair is a separate atomic row, preserving both prerequisites for CS201.',
    hint: 'One row per course-prerequisite pair.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Atomic but Partially Dependent',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'The table has only atomic values. What is its highest normal form?',
    context:
      'Enrollment\nstudent_id | course_id | student_name | grade\nPrimary key: (student_id, course_id)\nFDs: student_id → student_name, (student_id, course_id) → grade',
    options: ['2NF', '1NF', '3NF', 'BCNF'],
    answer: 1,
    explanation:
      'Atomic values satisfy 1NF, but student_name depends on part of the composite key, violating 2NF.',
    hint: 'Check the non-key attribute that follows only one key column.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Repeating Group Versus Duplicate Row',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which design is a repeating group rather than an ordinary set of rows?',
    options: [
      'One row with columns Skill1, Skill2, Skill3',
      'Three rows with columns emp_id and skill',
      'Three rows with the same emp_id and different skills',
      'One row with a composite primary key',
    ],
    answer: 0,
    explanation:
      'Numbered columns repeat the same attribute inside a row; separate rows are the normalized alternative.',
    hint: 'A repeating group repeats attributes across columns.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Why Lists Hurt Queries',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Why does a comma-separated list in a column make queries and constraints harder?',
    options: [
      'The list makes the table too small',
      'The list prevents the use of a primary key',
      'Individual values must be parsed, and indexes cannot target them cleanly',
      'The list automatically creates a foreign key',
    ],
    answer: 2,
    explanation:
      'A list is one stored value, so normal comparison, indexing, and per-value constraints do not apply directly.',
    hint: 'Think about searching for one element inside the text.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Composite Key Does Not Break 1NF',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Does the composite primary key itself violate 1NF?',
    context:
      'Enrollment\nstudent_id | course_id | grade\n1          | C1        | A\n1          | C2        | B\nPrimary key: (student_id, course_id)',
    options: [
      'Yes, every key must be a single column',
      'Yes, because it contains a foreign key',
      'Only when the key has more than three columns',
      'No, 1NF allows composite keys and all values are atomic',
    ],
    answer: 3,
    explanation:
      'A composite key is a normal relational construct; 1NF only requires atomic values and no repeating groups.',
    hint: 'Separate the key shape from the atomicity rule.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Merging Phones Back into Columns',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Which merge of Student(student_id, name) and StudentPhone(student_id, phone) would violate 1NF?',
    options: [
      'Student(student_id, name, phone) with one phone per row',
      'Student(student_id, name, phone1, phone2, phone3)',
      'StudentPhone(student_id, phone, phone_type)',
      'Student(student_id, name) plus a view joining phones',
    ],
    answer: 1,
    explanation:
      'Fixed phone columns recreate a repeating group; one phone per row stays atomic.',
    hint: 'Which version stores several phones in one row?',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Multivalued Attribute Versus Multivalued Dependency',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'Which statement correctly distinguishes a 1NF problem from a 4NF problem?',
    options: [
      'A multivalued attribute packs several values into one cell; a multivalued dependency concerns independent multivalued facts across relations',
      'Both are fixed by adding more columns',
      'A multivalued attribute is a 4NF issue, while a multivalued dependency is a 1NF issue',
      'Neither can occur in a relational database',
    ],
    answer: 0,
    explanation:
      '1NF addresses atomic values in cells; 4NF addresses independent multivalued facts that cause cross-product redundancy.',
    hint: 'One is about cell contents; the other is about combinations of facts.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Dependents with Duplicate Names',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'What is the appropriate key for this relation?',
    context:
      'Employee(emp_id, dependent_name) would store each dependent. Two employees can each have a dependent named Sam.',
    options: ['dependent_name alone', 'emp_id alone', '(emp_id, dependent_name)', 'A new column that repeats dependent_name'],
    answer: 2,
    explanation:
      'A name can repeat across employees, and an employee can have several dependents, so the pair is needed.',
    hint: 'Neither column is unique by itself in the described data.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Same Product Twice on an Order',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'If OrderItem starts as (order_id, product_id, quantity), what key problem appears?',
    context:
      'An order may list the same product on two separate lines, each with its own quantity.',
    options: [
      'The table violates 1NF because quantity is numeric',
      'product_id becomes a superkey',
      'The table has no redundancy',
      'The pair (order_id, product_id) may repeat, so it cannot identify a line',
    ],
    answer: 3,
    explanation:
      'Repeated products need a line identifier, such as line_no, so each order line is uniquely keyed.',
    hint: 'What distinguishes two lines for the same product?',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Lossless Split of Contact Data',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Why does the 1NF design keep every contact-city association recoverable?',
    context:
      'R(contact_id, phones, city) stores a list of phones and a city for each contact; city depends only on contact_id. The 1NF design is R1(contact_id, phone) and R2(contact_id, city).',
    options: [
      'contact_id is a key in R2',
      'phone is a key in R1',
      'Both relations have the same number of rows',
      'city is multivalued',
    ],
    answer: 0,
    explanation:
      'The common attribute contact_id is a key of R2, so each phone row can be paired with its contact city without losing facts.',
    hint: 'Check the common attribute in one decomposed relation.',
  },
  {
    chapterId: 'first-normal-form',
    title: 'Child Table Still Needs a Key',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'What problem does the missing primary key create?',
    context:
      'After moving phones out of Student, a designer creates StudentPhone(student_id, phone) but declares no primary key and allows duplicate rows.',
    options: [
      'The table violates 1NF again',
      'The same phone can be recorded twice for one student, making updates ambiguous',
      'student_id stops being a foreign key',
      'The phone values become non-atomic',
    ],
    answer: 1,
    explanation:
      'Without a key, duplicate student-phone pairs can exist, so one logical fact has multiple indistinguishable rows.',
    hint: 'What does a missing key fail to prevent?',
  },
  {
    chapterId: 'first-normal-form',
    title: '1NF Trade-off',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What is a typical cost of decomposing a multivalued attribute into a child table?',
    options: [
      'Values stop being atomic',
      'The parent table loses its primary key',
      'Queries may need an extra join to reassemble the list',
      'The child table cannot have a composite key',
    ],
    answer: 2,
    explanation:
      'The normalized design gains integrity and flexible cardinality but may require joins for list-style output.',
    hint: 'Think about what a query must do to collect all phones.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'The Second Normal Form Rule',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which condition must a 1NF relation satisfy to be in 2NF?',
    options: [
      'Every non-key attribute depends on the whole primary key',
      'Every attribute is atomic',
      'Every determinant is a candidate key',
      'No non-key attribute determines another non-key attribute',
    ],
    answer: 0,
    explanation:
      '2NF removes partial dependencies, so no non-key attribute may depend on only part of a composite key.',
    hint: 'Focus on the word whole key.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Partial Dependency Defined',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A partial dependency exists when a non-key attribute depends on...',
    options: [
      'the entire composite key',
      'another non-key attribute',
      'a proper subset of a composite candidate key',
      'a foreign key in another relation',
    ],
    answer: 2,
    explanation:
      'Partial means dependence on only part of a composite key, not on the full key.',
    hint: 'Part of the key, not the whole key.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Single-Column Key and 2NF',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A 1NF relation has a single-column primary key. Is it automatically in 2NF?',
    options: [
      'No, it may still have a partial dependency',
      'Yes, because a single-column key has no proper non-empty subset',
      'Only if it has no NULL values',
      'Only if it has a foreign key',
    ],
    answer: 1,
    explanation:
      'A partial dependency needs a composite key, so a single-attribute key cannot create one.',
    hint: 'What proper subset could a one-column key have?',
  },
  {
    chapterId: 'second-normal-form',
    title: 'When Partial Dependencies Are Possible',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Partial dependencies can occur only when the relation has...',
    options: ['more than ten rows', 'at least one NULL', 'no foreign keys', 'a composite candidate key'],
    answer: 3,
    explanation:
      'Partiality is about depending on part of a key, which requires a key with more than one attribute.',
    hint: 'Which key shape has parts to depend on?',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Student Name Depends on Student_ID',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which dependency violates 2NF?',
    context:
      'Enrollment\nstudent_id | course_id | student_name | grade\n1          | C1        | Ada          | A\n1          | C2        | Ada          | B\nPrimary key: (student_id, course_id)\nFD: student_id → student_name',
    options: [
      'student_id → student_name',
      '(student_id, course_id) → grade',
      'student_id, course_id → student_name',
      'course_id → grade',
    ],
    answer: 0,
    explanation:
      'Student_name depends on only student_id, a proper subset of the composite key.',
    hint: 'Which determinant uses just one key column?',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Grade Uses the Whole Key',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which attribute is fully dependent on the composite key?',
    context:
      'Enrollment\nstudent_id | course_id | grade\n1          | C1        | A\n1          | C2        | B\n2          | C1        | A\nPrimary key: (student_id, course_id)',
    options: ['student_name, if present', 'course_name, if present', 'grade', 'student_id'],
    answer: 2,
    explanation:
      'Grade is determined by the student-course pair and by neither attribute alone.',
    hint: 'Which value changes when either the student or the course changes?',
  },
  {
    chapterId: 'second-normal-form',
    title: '1NF Before 2NF',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Can a relation be in 2NF without being in 1NF?',
    options: [
      'Yes, if it has no partial dependencies',
      'No, 2NF requires 1NF first',
      'Yes, if every attribute is a key',
      'Only when it has a composite key',
    ],
    answer: 1,
    explanation:
      'The normal forms are cumulative: 2NF assumes atomic values and no repeating groups.',
    hint: 'Normalization forms build on one another.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Where Student_Name Belongs',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'In a 2NF decomposition of Enrollment(student_id, course_id, student_name, grade) with student_id → student_name, where should student_name go?',
    options: [
      'Enrollment, because it is used with the key',
      'Course(course_id, student_name)',
      'A new table Grade(student_id, student_name)',
      'Student(student_id, student_name)',
    ],
    answer: 3,
    explanation:
      'Student_name follows student_id, so it belongs in a relation keyed by student_id.',
    hint: 'Match the attribute to its determinant.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Junction Table After Decomposition',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'After 2NF decomposition, which relation remains as the junction between students and courses?',
    options: [
      'Enrollment(student_id, course_id, grade)',
      'Student(student_id, course_id)',
      'Course(student_id, course_id, grade)',
      'Grade(student_id, grade)',
    ],
    answer: 0,
    explanation:
      'The grade depends on the full pair, so it stays with both key attributes in the junction relation.',
    hint: 'Keep the attribute that needs both entities.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Prime Attributes in a Composite Key',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Relation R(A, B, C) has exactly one candidate key, the composite key (A, B).',
    prompt: 'Which attributes of R are prime?',
    options: ['Only A', 'Only B', 'A and B', 'A, B, and C'],
    answer: 2,
    explanation:
      'Prime attributes belong to at least one candidate key. A and B form the only candidate key, so both are prime.',
    hint: 'Look at every attribute inside the candidate key.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Highest Normal Form with a Partial Dependency',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which normal form does the five-column Enrollment relation reach?',
    context:
      'Enrollment\nstudent_id | course_id | student_name | course_name | grade\nKey: (student_id, course_id)\nFDs: student_id → student_name, course_id → course_name, (student_id, course_id) → grade',
    options: ['2NF', '1NF', '3NF', 'BCNF'],
    answer: 1,
    explanation:
      'Values are atomic, but two non-key attributes depend on parts of the key, so 2NF fails.',
    hint: 'Find dependencies on only one part of the key.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Which FD Is the 2NF Violation?',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'R(student_id, course_id, student_name, grade) has key (student_id, course_id). Which dependency violates 2NF?',
    options: [
      '(student_id, course_id) → grade',
      '(student_id, course_id) → student_name',
      'student_name → grade',
      'student_id → student_name',
    ],
    answer: 3,
    explanation:
      'Only the last FD uses a proper subset of the key; the full-key FD is exactly what 2NF wants.',
    hint: 'Look for a determinant that is not the whole key.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'How Many Relations After 2NF?',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Enrollment(student_id, course_id, student_name, course_name, grade) has key (student_id, course_id), with student_id → student_name and course_id → course_name. How many relations does a standard 2NF decomposition produce?',
    options: ['Three', 'Two', 'Four', 'One, because 2NF is automatic'],
    answer: 0,
    explanation:
      'Student, Course, and Enrollment each hold one set of facts, giving three relations.',
    hint: 'Count the two partial dependencies plus the junction.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Correct 2NF Decomposition',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which decomposition removes the partial dependencies?',
    context:
      'Enrollment(student_id, course_id, student_name, course_name, grade) with key (student_id, course_id).',
    options: [
      'Student(student_id, student_name, course_name), Course(course_id, grade)',
      'Enrollment(student_id, course_id, grade), StudentCourse(student_id, student_name, course_name)',
      'Student(student_id, student_name), Course(course_id, course_name), Enrollment(student_id, course_id, grade)',
      'Student(student_id, course_id), Course(course_id, student_name), Grade(grade)',
    ],
    answer: 2,
    explanation:
      'Each partial dependency gets its own relation, and the junction keeps the full-key dependency.',
    hint: 'Separate student facts, course facts, and the pair-dependent grade.',
  },
  {
    chapterId: 'second-normal-form',
    title: '2NF but Not 3NF',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which normal form does Student reach with its advisor chain?',
    context:
      'Student\nstudent_id | name  | advisor_id | advisor_name\n1          | Ada   | A1         | Ito\n2          | Grace | A1         | Ito\nFDs: student_id → advisor_id, advisor_id → advisor_name',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: 1,
    explanation:
      'There is no partial dependency because the key is a single attribute, but advisor_name is transitively dependent.',
    hint: 'No composite key, but there is a chain of non-key attributes.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'All Non-Key Attributes on the Full Key',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'R(A, B, C, D) has key (A, B) and FDs (A, B) → C and (A, B) → D. Neither A nor B alone determines C or D. Is R in 2NF?',
    options: [
      'No, because C and D are non-key',
      'No, because the key has two attributes',
      'Only if A and B are both NOT NULL',
      'Yes, every non-key attribute depends on the whole key',
    ],
    answer: 3,
    explanation:
      'Both C and D require the full pair, so there is no partial dependency and 2NF holds.',
    hint: 'Check whether either key part alone determines C or D.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Extracting Course Facts',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which relation should hold course_name after 2NF decomposition?',
    context:
      'Enrollment(student_id, course_id, course_name, grade) has key (student_id, course_id) and FD course_id → course_name.',
    options: [
      'Course(course_id, course_name)',
      'Student(course_id, course_name)',
      'Enrollment(student_id, course_name, grade)',
      'Grade(course_id, course_name)',
    ],
    answer: 0,
    explanation:
      'Course_name is determined by course_id alone, so a Course relation keyed by course_id stores it once.',
    hint: 'Use the determinant as the key of the new relation.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Key of the Remaining Enrollment Table',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'After 2NF decomposition, Student(student_id, student_name), Course(course_id, course_name), and Enrollment(student_id, course_id, grade) exist. What is the primary key of Enrollment?',
    options: ['student_id alone', 'course_id alone', '(student_id, course_id)', 'grade'],
    answer: 2,
    explanation:
      'A grade is unique only for one student-course pair, so both foreign keys form the key.',
    hint: 'Which pair identifies one grade?',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Dependency Preservation After 2NF',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'R(student_id, course_id, student_name, grade) has FDs student_id → student_name and (student_id, course_id) → grade. It is split into Student(student_id, student_name) and Enrollment(student_id, course_id, grade). Are the original FDs preserved?',
    options: [
      'No, student_id → student_name is lost',
      'Yes, each FD is enforced in one of the new relations',
      'No, the composite key disappears',
      'Only if a foreign key is declared',
    ],
    answer: 1,
    explanation:
      'Student holds the first dependency, and Enrollment holds the second, so no FD requires a join to check.',
    hint: 'Locate each determinant and dependent in the new tables.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Three-Part Key with a Partial Dependency',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which dependency breaks 2NF?',
    context:
      'Shipment(supplier_id, part_id, project_id, supplier_name, quantity)\nKey: (supplier_id, part_id, project_id)\nFD: supplier_id → supplier_name',
    options: [
      '(supplier_id, part_id, project_id) → quantity',
      'part_id → project_id',
      '(supplier_id, part_id) → project_id',
      'supplier_id → supplier_name',
    ],
    answer: 3,
    explanation:
      'Supplier_name depends on one of the three key attributes, so it is partially dependent on the key.',
    hint: 'Look for a determinant that is only part of the three-column key.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Composite Key with a Full Dependency',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which statement is true?',
    context:
      'R(A, B, C)\nKey: (A, B)\nFDs: (A, B) → C, A does not determine C, B does not determine C',
    options: [
      'R is in 2NF because C depends on the whole key',
      'R is not in 2NF because C is non-key',
      'R is in 3NF but not 2NF',
      'R has a partial dependency on A',
    ],
    answer: 0,
    explanation:
      'C needs both A and B, so it is fully dependent and 2NF is satisfied.',
    hint: 'Test whether either single attribute determines C.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Why 2NF Reduces Redundancy',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Why does moving student_name out of Enrollment into Student reduce redundancy?',
    options: [
      'A student can be added without a course',
      'A course can be deleted without a student',
      'A student rename becomes a one-row update instead of many row changes',
      'Two students can share a course',
    ],
    answer: 2,
    explanation:
      'Storing the name once makes a rename a single-row update instead of a multi-row correction.',
    hint: 'Which repeated fact was moved?',
  },
  {
    chapterId: 'second-normal-form',
    title: 'When 2NF Is Automatically Satisfied',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Why is R automatically in 2NF when its only key is A?',
    context:
      'R(A, B, C, D)\nKey: A\nFDs: A → B, A → C, A → D',
    options: [
      'Every attribute is prime',
      'The key is a single attribute, so no partial dependency is possible',
      'There are no non-key attributes',
      'All FDs are transitive',
    ],
    answer: 1,
    explanation:
      'With a one-attribute key, every non-key attribute depends on the whole key by definition.',
    hint: 'Partial dependency needs a key with parts.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Lossless 2NF Split',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Why is the split of R into R1(A, B) and R2(B, C) lossless?',
    context:
      'R(A, B, C) has key (A, B) and FD B → C. It is split into R1(A, B) and R2(B, C).',
    options: [
      'A is a key in R1',
      'Both relations have two attributes',
      'C is a foreign key in R1',
      'B is a key in R2',
    ],
    answer: 3,
    explanation:
      'The common attribute B is a key of R2, so joining R1 and R2 cannot create spurious or missing rows.',
    hint: 'Check the shared attribute in the relation that holds C.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'All Attributes Prime',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Does R satisfy 2NF when all three attributes are prime?',
    context:
      'R(A, B, C)\nFDs: A, B → C and C → A\nCandidate keys: (A, B) and (B, C)',
    options: [
      'Yes, because every attribute is prime',
      'No, because B → C is partial',
      'No, because C → A is transitive',
      'Only if C is NOT NULL',
    ],
    answer: 0,
    explanation:
      '2NF only restricts non-key attributes; here A, B, and C all belong to a candidate key.',
    hint: 'Which attributes are non-key?',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Hidden Partial Dependency',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which attribute shows that R is not in 2NF?',
    context:
      'R(A, B, C, D)\nKey: (A, B)\nFDs: (A, B) → D and B → C',
    options: [
      'D, because it depends on the full key',
      'A, because it is part of the key',
      'C, because B alone determines it',
      'B, because it is a foreign key',
    ],
    answer: 2,
    explanation:
      'C is a non-key attribute determined by B, a proper subset of the composite key.',
    hint: 'Find the dependent of the single-attribute determinant.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Decomposition That Preserves B to C',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which split is correct?',
    context:
      'R(A, B, C) has key (A, B) and FD B → C. The goal is a 2NF decomposition that preserves B → C.',
    options: [
      'R1(A, B) and R2(A, C)',
      'R1(A, B) and R2(B, C)',
      'R1(A, C) and R2(B, C)',
      'R1(A) and R2(B, C)',
    ],
    answer: 1,
    explanation:
      'Putting B and C together preserves B → C, and the shared B makes the join lossless.',
    hint: 'Keep the determinant and dependent in the same relation.',
  },
  {
    chapterId: 'second-normal-form',
    title: '2NF but Not 3NF with a Composite Key',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which normal form does the composite-key Enrollment relation reach?',
    context:
      'Enrollment\nstudent_id | course_id | instructor_id | instructor_name\nKey: (student_id, course_id)\nFDs: (student_id, course_id) → instructor_id, instructor_id → instructor_name',
    options: ['1NF', '3NF', 'BCNF', '2NF'],
    answer: 3,
    explanation:
      'No non-key attribute depends on part of the key, but instructor_name depends transitively on instructor_id.',
    hint: 'Check partial dependencies first, then the non-key chain.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Partial Plus Transitive',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which normal form does R(A, B, C, D) fail first under A → C and C → D?',
    context:
      'R(A, B, C, D)\nKey: (A, B)\nFDs: A → C and C → D',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: 0,
    explanation:
      'A → C is partial, so R fails 2NF even before the transitive chain C → D is considered.',
    hint: 'The first failure determines the highest form.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Counting 2NF Relations',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'A dependency-preserving 2NF decomposition produces how many relations?',
    context:
      'R(A, B, C, D, E)\nKey: (A, B)\nFDs: A → C, B → D, (A, B) → E',
    options: ['Two', 'Four', 'Three', 'Five'],
    answer: 2,
    explanation:
      'Split A → C and B → D into their own relations, then keep (A, B, E) as the remaining relation.',
    hint: 'Count the two partial dependencies and the leftover key relation.',
  },
  {
    chapterId: 'second-normal-form',
    title: 'Common Attribute as a Key',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which condition proves the split is lossless?',
    context:
      'R(A, B, C) has key (A, B) and FD B → C. A 2NF split is R1(A, B) and R2(B, C).',
    options: [
      'A is unique in R1',
      'B is a key of R2',
      'C is non-key in R',
      'R1 and R2 have the same cardinality',
    ],
    answer: 1,
    explanation:
      'Losslessness follows because the common attribute B determines all of R2, so the join recovers exactly R.',
    hint: 'Use the standard lossless-join test for two relations.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'The Third Normal Form Rule',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which condition defines 3NF for a relation?',
    options: [
      'Every attribute is atomic',
      'Every non-key attribute depends on the whole key',
      'Every relation has a foreign key',
      'For every nontrivial X → A, X is a superkey or A is prime',
    ],
    answer: 3,
    explanation:
      'The formal test allows a non-superkey determinant only when the dependent attribute is part of a candidate key.',
    hint: 'Recall the superkey-or-prime wording.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Transitive Dependency Defined',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A transitive dependency in a relation occurs when...',
    options: [
      'a non-key attribute depends on part of a composite key',
      'a non-key attribute depends on another non-key attribute',
      'a foreign key references a primary key',
      'two candidate keys overlap',
    ],
    answer: 1,
    explanation:
      'The chain X → Y → Z, where Y and Z are non-key, is the transitive pattern 3NF removes.',
    hint: 'Look for a chain among non-key attributes.',
  },
  {
    chapterId: 'third-normal-form',
    title: '3NF Requires 2NF',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Can a relation be in 3NF while failing 2NF?',
    options: [
      'No, because 3NF requires 2NF',
      'Yes, if it has no transitive dependencies',
      'Yes, if all attributes are prime',
      'Only when it has a composite key',
    ],
    answer: 0,
    explanation:
      '3NF is cumulative; partial dependencies must already be removed before transitive ones are addressed.',
    hint: 'Normal forms build in order.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Prime Attribute Again',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'In the 3NF test, an attribute is prime when it...',
    options: [
      'has no NULL values',
      'is the first column of the table',
      'belongs to at least one candidate key',
      'is determined by a foreign key',
    ],
    answer: 2,
    explanation:
      'Prime means membership in any candidate key, not merely the chosen primary key.',
    hint: 'Candidate keys define primeness.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Advisor Name Chain',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which dependency is transitive?',
    context:
      'Student\nstudent_id | name  | advisor_id | advisor_name\n1          | Ada   | A1         | Ito\n2          | Grace | A1         | Ito\nFDs: student_id → advisor_id, advisor_id → advisor_name',
    options: [
      'student_id → advisor_id',
      'advisor_id → advisor_name',
      'student_id → name',
      'student_id → advisor_name',
    ],
    answer: 3,
    explanation:
      'Student_id determines advisor_id, and advisor_id determines advisor_name, so the name is transitively dependent.',
    hint: 'Combine the two given dependencies.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Which FD Violates 3NF?',
    difficulty: 'Easy',
    type: 'scenario',
    prompt: 'Which dependency has a determinant that is not a superkey in Student?',
    context:
      'Student(student_id, name, advisor_id, advisor_name)\nKey: student_id\nFDs: student_id → advisor_id, advisor_id → advisor_name',
    options: [
      'student_id → advisor_id',
      'advisor_id → advisor_name',
      'student_id → name',
      'student_id → advisor_name',
    ],
    answer: 1,
    explanation:
      'Advisor_id is not a superkey and advisor_name is non-prime, so this dependency breaks the 3NF test.',
    hint: 'Find the determinant that is not a superkey.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Where Advisor_Name Belongs',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Student(student_id, name, advisor_id, advisor_name) has student_id → advisor_id and advisor_id → advisor_name. In a 3NF decomposition, which relation should hold advisor_name?',
    options: [
      'Advisor(advisor_id, advisor_name)',
      'Student(student_id, advisor_name)',
      'Name(advisor_name)',
      'Advisor(advisor_name, student_id)',
    ],
    answer: 0,
    explanation:
      'Advisor_name depends on advisor_id, not on student_id, so it belongs in the Advisor relation keyed by advisor_id.',
    hint: 'Place the attribute beside its determinant.',
  },
  {
    chapterId: 'third-normal-form',
    title: '3NF Versus BCNF',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'How does BCNF differ from 3NF?',
    options: [
      'BCNF allows partial dependencies',
      'BCNF requires atomic values; 3NF does not',
      'BCNF requires every determinant to be a superkey, with no prime-attribute exception',
      'BCNF applies only to composite keys',
    ],
    answer: 2,
    explanation:
      'BCNF drops the 3NF exception for prime dependents, making every nontrivial determinant a superkey.',
    hint: 'The exception for prime attributes is removed.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'What 3NF Removes',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Third normal form primarily removes...',
    options: [
      'multivalued attributes',
      'partial dependencies on a composite key',
      'foreign keys',
      'transitive dependencies among non-key attributes',
    ],
    answer: 3,
    explanation:
      '3NF targets transitive chains where one non-key attribute determines another, separating the dependent fact.',
    hint: 'The problem is a chain, not part of a key.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Highest Normal Form with an Advisor Chain',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Student(student_id, name, advisor_id, advisor_name) has key student_id, with student_id → advisor_id and advisor_id → advisor_name. How far does Student normalize when advisor_name follows advisor_id?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: 1,
    explanation:
      'The single-attribute key rules out partial dependencies, but advisor_name is transitively dependent, so 3NF fails.',
    hint: 'Check 2NF first, then follow the non-key chain.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Prime Dependent Exception',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Does C → B violate 3NF?',
    context:
      'R(A, B, C)\nKey: (A, B)\nFD: C → B\nCandidate keys: (A, B) and (A, C)',
    options: [
      'No, because B is prime and the dependency is allowed',
      'Yes, because C is not a superkey',
      'Yes, because B is non-prime',
      'No, because C is non-prime',
    ],
    answer: 0,
    explanation:
      'In 3NF, a non-superkey determinant is acceptable when its dependent is prime; B belongs to both candidate keys.',
    hint: 'Apply the superkey-or-prime test.',
  },
  {
    chapterId: 'third-normal-form',
    title: '3NF but Not BCNF',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which normal form does R(A, B, C) satisfy when AB → C and C → B?',
    context:
      'R(A, B, C)\nFDs: A, B → C and C → B\nCandidate keys: (A, B) and (A, C)',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: 2,
    explanation:
      'C → B has a non-superkey determinant but a prime dependent, so 3NF holds and BCNF fails.',
    hint: 'Check whether the dependent of C is part of a key.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Student and Advisor Split',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Which decomposition of Student(student_id, name, advisor_id, advisor_name), with student_id → advisor_id and advisor_id → advisor_name, removes the transitive dependency?',
    options: [
      'Student(student_id, name) and AdvisorName(advisor_name)',
      'Student(student_id, advisor_name) and Advisor(advisor_id, name)',
      'StudentAdvisor(student_id, name, advisor_id, advisor_name)',
      'Student(student_id, name, advisor_id) and Advisor(advisor_id, advisor_name)',
    ],
    answer: 3,
    explanation:
      'The advisor facts move to a relation keyed by advisor_id, while Student keeps the foreign key.',
    hint: 'Keep the linking key in the student relation.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Is the Advisor Split Lossless?',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Why is the join of these two relations lossless?',
    context:
      'Student(student_id, name, advisor_id)\nAdvisor(advisor_id, advisor_name)\nOriginal: Student(student_id, name, advisor_id, advisor_name)',
    options: [
      'Both relations have the same number of rows',
      'The common attribute advisor_id is a key of Advisor',
      'student_id is a foreign key',
      'advisor_name is non-prime',
    ],
    answer: 1,
    explanation:
      'Because advisor_id determines every Advisor attribute, the join restores each student advisor without spurious rows.',
    hint: 'Use the common attribute, not the foreign key alone.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Are the FDs Preserved?',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Are the original dependencies preserved?',
    context:
      'Original FDs: student_id → advisor_id and advisor_id → advisor_name.\nDecomposition: Student(student_id, name, advisor_id), Advisor(advisor_id, advisor_name).',
    options: [
      'Yes, both FDs are enforceable within the new relations',
      'No, student_id → advisor_id is lost',
      'No, advisor_id → advisor_name needs a join',
      'Only if advisor_id is nullable',
    ],
    answer: 0,
    explanation:
      'Each determinant and its dependent remain together, so neither dependency requires a join to check.',
    hint: 'Locate each FD inside the decomposed tables.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Course to Department Chain',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Course(course_id, course_name, dept_id, dept_name) has course_id → dept_id and dept_id → dept_name. Which dependency is transitive?',
    options: [
      'course_id → dept_id',
      'dept_id → dept_name',
      'course_id → dept_name',
      'course_id → course_name',
    ],
    answer: 2,
    explanation:
      'The department name is reached through dept_id, so course_id determines it transitively.',
    hint: 'Follow the two-step chain.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Composite Key with a Transitive Chain',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Which single-attribute determinant in Enrollment breaks 3NF?',
    context:
      'Enrollment\nstudent_id | course_id | instructor_id | instructor_name\nKey: (student_id, course_id)\nFDs: (student_id, course_id) → instructor_id, instructor_id → instructor_name',
    options: [
      '(student_id, course_id) → instructor_id',
      '(student_id, course_id) → instructor_name',
      'student_id → course_id',
      'instructor_id → instructor_name',
    ],
    answer: 3,
    explanation:
      'Instructor_id is not a superkey and instructor_name is non-prime, so the dependency is not permitted in 3NF.',
    hint: 'Find the non-key determinant.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Course and Department: Highest Form',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Course(course_id, course_name, dept_id, dept_name) has key course_id, with course_id → dept_id and dept_id → dept_name. At what normal form does Course stop when dept_name follows dept_id?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: 1,
    explanation:
      'The single-attribute key means 2NF holds, but dept_name is transitively dependent on dept_id, so 3NF fails.',
    hint: 'No partial dependency, but there is a chain.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Correct Course Decomposition',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Which 3NF decomposition is correct for Course(course_id, course_name, dept_id, dept_name), with course_id → dept_id and dept_id → dept_name?',
    options: [
      'Course(course_id, course_name, dept_id) and Department(dept_id, dept_name)',
      'Course(course_id, course_name) and Department(course_id, dept_name)',
      'Course(course_id, dept_id, dept_name) and Department(course_name)',
      'Department(course_id, course_id, dept_name)',
    ],
    answer: 0,
    explanation:
      'Splitting at dept_id gives each department fact one home and keeps the linking key in Course.',
    hint: 'Break the chain at the non-key determinant.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Normal Form After the Split',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Are Course and Department both in BCNF after the split?',
    context:
      'Course(course_id, course_name, dept_id)\nDepartment(dept_id, dept_name)\nFDs: course_id → course_name, dept_id; dept_id → dept_name',
    options: [
      'Course is 2NF; Department is 1NF',
      'Both are only 1NF',
      'Both are in 3NF, and also in BCNF',
      'Both are 3NF but not BCNF',
    ],
    answer: 2,
    explanation:
      'In Course, course_id is the only determinant and a key; in Department, dept_id is a key. Both are BCNF.',
    hint: 'Check whether every determinant is a key.',
  },
  {
    chapterId: 'third-normal-form',
    title: '3NF but Not BCNF with Overlapping Keys',
    difficulty: 'Medium',
    type: 'scenario',
    prompt: 'Is R in BCNF?',
    context:
      'R(A, B, C)\nFDs: A, B → C and C → A\nCandidate keys: (A, B) and (B, C)',
    options: [
      'Yes, every attribute is prime',
      'Yes, because AB is a key',
      'No, because AB → C is partial',
      'No, because C → A has a non-superkey determinant',
    ],
    answer: 3,
    explanation:
      'C is not a superkey, so BCNF fails even though A is prime and 3NF holds.',
    hint: 'BCNF ignores the prime-attribute exception.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Lossless but Not Dependency Preserving',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which property does this decomposition fail?',
    context:
      'R(A, B, C)\nFDs: A, B → C and C → A\nA BCNF decomposition is R1(A, C) and R2(B, C).',
    options: [
      'Lossless join',
      'Dependency preservation for AB → C',
      'Atomicity',
      'First normal form',
    ],
    answer: 1,
    explanation:
      'The join is lossless because C is a key in R1, but AB → C spans both relations and cannot be checked locally.',
    hint: 'Which FD needs attributes from both new relations?',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Choosing a 3NF Decomposition',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Which set of relations is a lossless, dependency-preserving 3NF decomposition for R(A, B, C, D) with FDs A → B, B → C, C → D and key A?',
    options: [
      'R1(A, B), R2(B, C), R3(C, D)',
      'R1(A, B), R2(A, C), R3(A, D)',
      'R1(A, B, C), R2(A, D)',
      'R1(A, D), R2(B, C)',
    ],
    answer: 0,
    explanation:
      'Each dependency keeps its determinant and dependent together, and the chain of shared keys makes the joins lossless.',
    hint: 'Follow each arrow into its own relation.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Partial Plus Transitive, Different Table',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which normal form does OrderLine reach with its two partial dependencies?',
    context:
      'OrderLine\norder_id | product_id | product_name | customer_city\nKey: (order_id, product_id)\nFDs: product_id → product_name, order_id → customer_city',
    options: ['2NF', '3NF', '1NF', 'BCNF'],
    answer: 2,
    explanation:
      'Both product_name and customer_city depend on parts of the composite key, so 2NF fails and the relation is only 1NF.',
    hint: 'Check the two single-attribute determinants.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Department Name Redundancy',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Course(course_id, course_name, dept_id, dept_name) stores dept_name for every course in the department. Which anomaly is most likely when a department is renamed?',
    options: [
      'A course cannot be inserted without a department',
      'A department cannot be deleted',
      'A course loses its primary key',
      'Some course rows keep the old department name',
    ],
    answer: 3,
    explanation:
      'The repeated department name can be updated in one row but not another, producing conflicting copies of the same fact.',
    hint: 'Which non-key fact is repeated across courses?',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Prime Attributes in a Chain',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which FD breaks 3NF?',
    context:
      'R(A, B, C)\nFDs: A → B and B → C\nKey: A',
    options: [
      'A → B, because B is non-prime',
      'B → C, because B is not a superkey and C is non-prime',
      'A → C, because it is transitive',
      'None; R is in 3NF',
    ],
    answer: 1,
    explanation:
      'B is not a superkey and C is not prime, so B → C violates the formal 3NF test.',
    hint: 'Only one determinant is not a key.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'A Chain That Still Reaches BCNF',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'How far can R(A, B, C) normalize under A ↔ B and A → C?',
    context:
      'R(A, B, C)\nFDs: A → B and B → A and A → C',
    options: ['BCNF', '3NF but not BCNF', '2NF but not 3NF', '1NF'],
    answer: 0,
    explanation:
      'Candidate keys are A and B; every determinant is a superkey, so both 3NF and BCNF hold.',
    hint: 'Compute the candidate keys before judging the determinants.',
  },
  {
    chapterId: 'third-normal-form',
    title: '3NF Decomposition Task',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which dependency must be removed to make R 3NF?',
    context:
      'R(A, B, C, D)\nFDs: A → B, B → C, A → D\nKey: A',
    options: ['A → B', 'A → D', 'B → C', 'None; R is in 3NF'],
    answer: 2,
    explanation:
      'B is not a superkey and C is non-prime, so B → C breaks 3NF; A → B and A → D are allowed because A is a key.',
    hint: 'Compare each determinant with the candidate key.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'BCNF Split Loses a Dependency',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'Which original dependency is no longer enforceable in one relation?',
    context:
      'R(A, B, C)\nFDs: A, B → C and C → B\nFor BCNF, R is split into R1(A, C) and R2(B, C).',
    options: ['C → B', 'A → C', 'B → C', 'A, B → C'],
    answer: 3,
    explanation:
      'AB → C needs A and B together, but A is in R1 and B is in R2, so the dependency spans the split.',
    hint: 'Which FD uses attributes from both new tables?',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Always Achievable Decomposition',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'Which guarantee distinguishes a 3NF decomposition from a BCNF decomposition?',
    options: [
      'Only 3NF is lossless',
      '3NF can always be made lossless and dependency-preserving; BCNF may sacrifice dependency preservation',
      'Only BCNF preserves dependencies',
      'Neither form can be reached algorithmically',
    ],
    answer: 1,
    explanation:
      '3NF synthesis guarantees both properties, while some BCNF decompositions must split an FD across relations.',
    hint: 'Think about the trade-off when BCNF forces a split.',
  },
  {
    chapterId: 'third-normal-form',
    title: 'Formal 3NF Test Outcome',
    difficulty: 'Hard',
    type: 'scenario',
    prompt: 'What is the highest form reached by R(A, B, C, D) given AB → C, C → D, and D → A?',
    context:
      'R(A, B, C, D)\nFDs: A, B → C, C → D, D → A\nCandidate keys: (A, B) and (B, C)',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    answer: 0,
    explanation:
      'C → D is partial because C is part of candidate key BC, so R fails 2NF and is only 1NF.',
    hint: 'Check partial dependencies against every candidate key.',
  },
];
