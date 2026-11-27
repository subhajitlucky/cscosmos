import type { DBMSLesson } from './types';

export const concurrencyLessons: DBMSLesson[] = [
  {
    chapterId: 'concurrency-problems',
    plainEnglish: 'It is two people editing the same shared document without seeing each other\'s changes.',
    hook:
      'Concurrent transactions are supposed to behave as if they ran one at a time. Interleavings can break that promise in four classic ways.',
    objectives: [
      'Explain lost update, dirty read, unrepeatable read, and phantom read.',
      'Trace an interleaving that causes each problem.',
      'Define serializability.',
      'Know why isolation levels trade correctness for concurrency.',
    ],
    sections: [
      {
        title: 'Lost update and dirty read',
        body:
          'A lost update happens when two transactions read the same value, both modify it, and one overwrites the other. A dirty read happens when a transaction reads data written by another transaction that has not committed and may still roll back.',
        code: String.raw`T1: read x=100
T2: read x=100
T1: write x=110
T2: write x=120   /* T1's update is lost */

T1: write x=200
T2: read x=200    /* dirty read */
T1: rollback      /* T2 read a value that never existed */`,
      },
      {
        title: 'Unrepeatable read and phantom',
        body:
          'An unrepeatable read happens when a transaction reads the same row twice and gets different values because another transaction committed a change in between. A phantom read happens when a transaction repeats a range query and sees new rows that another transaction inserted.',
      },
      {
        title: 'Serializability',
        body:
          'A schedule is serializable if its effect is equivalent to some serial execution of the same transactions. The DBMS uses locks, timestamps, or validation to enforce a serializable schedule. Weaker isolation levels allow some anomalies to gain concurrency.',
      },
    ],
    keyTakeaways: [
      'Lost update: one transaction overwrites another\'s change.',
      'Dirty read: reading uncommitted data.',
      'Unrepeatable read: the same row changes between reads.',
      'Phantom read: a range query sees new rows.',
      'Serializability is the correctness target.',
    ],
    pitfalls: [
      'Thinking a transaction is isolated just because it is atomic.',
      'Assuming every isolation level prevents phantoms.',
      'Ignoring the cost of serializable isolation.',
    ],
    focusPoints: [
      'Trace each anomaly with two transactions.',
      'Explain serializability in one sentence.',
      'Match isolation levels to the anomalies they prevent.',
    ],
    quiz: [
      {
        question: 'What is a dirty read?',
        options: ['Reading uncommitted data', 'Reading the same row twice', 'Overwriting an update', 'Seeing a new row'],
        answer: 0,
        explanation:
          'A dirty read reads data written by a transaction that has not committed and may roll back.',
      },
      {
        question: 'What does serializability guarantee?',
        options: [
          'The result is equivalent to some serial execution',
          'Every transaction commits',
          'No transaction waits',
          'No locks are used',
        ],
        answer: 0,
        explanation:
          'A serializable schedule produces the same effect as running the transactions one after another.',
      },
    ],
  },

  {
    chapterId: 'locking-2pl',
    plainEnglish: 'One key to the bathroom. Others wait. If two people each hold one key and wait for the other, that is a deadlock.',
    walkthrough: { kind: 'locking' },
    hook:
      'Locks are the classic way to enforce isolation. Two-phase locking makes the schedule serializable, and deadlocks are the price.',
    objectives: [
      'Explain shared and exclusive locks.',
      'Read a lock compatibility matrix.',
      'Describe growing and shrinking phases.',
      'Recognize and prevent deadlock.',
    ],
    sections: [
      {
        title: 'Shared and exclusive locks',
        body:
          'A shared lock allows other transactions to read but not write. An exclusive lock allows one transaction to read and write. Multiple shared locks can coexist; an exclusive lock conflicts with everything. The lock manager grants or blocks requests according to a compatibility matrix.',
        code: String.raw`          S     X
S         yes   no
X         no    no`,
      },
      {
        title: 'Two-phase locking',
        body:
          'In the growing phase, a transaction acquires locks and may not release any. In the shrinking phase, it releases locks and may not acquire new ones. Strict 2PL holds all locks until commit, which prevents cascading rollbacks and guarantees serializability.',
      },
      {
        title: 'Deadlock',
        body:
          'A deadlock happens when transactions wait on each other in a cycle. The DBMS can prevent it with ordered locking, avoid it with wait-die or wound-wait, or detect it by building a wait-for graph and aborting a victim. Deadlock is a correctness-preserving cost, not data corruption.',
        code: String.raw`T1 holds A, waits for B
T2 holds B, waits for A
wait-for graph: T1 -> T2 -> T1  (cycle)`,
      },
    ],
    keyTakeaways: [
      'Shared locks allow readers; exclusive locks allow one writer.',
      '2PL has a growing phase and a shrinking phase.',
      'Strict 2PL holds locks until commit.',
      'Deadlock is a cycle in the wait-for graph.',
      'Deadlock can be prevented, avoided, or detected.',
    ],
    pitfalls: [
      'Releasing a lock in the growing phase.',
      'Assuming 2PL prevents deadlock; it prevents non-serializable schedules.',
      'Ignoring lock granularity and contention.',
    ],
    focusPoints: [
      'Use the compatibility matrix.',
      'Trace growing and shrinking phases.',
      'Draw a wait-for graph and identify a deadlock.',
    ],
    quiz: [
      {
        question: 'Which lock conflicts with every other lock?',
        options: ['Shared', 'Exclusive', 'Intent', 'Read'],
        answer: 1,
        explanation:
          'An exclusive lock conflicts with both shared and exclusive locks.',
      },
      {
        question: 'What is the defining rule of 2PL?',
        options: [
          'No lock acquisition after the first release',
          'No locks at all',
          'Only shared locks',
          'Locks are released immediately',
        ],
        answer: 0,
        explanation:
          'Once a transaction releases a lock, it cannot acquire another; that is the shrinking phase.',
      },
    ],
  },

  {
    chapterId: 'timestamp-optimistic',
    plainEnglish: 'Let everyone work, then check at the end whether their edits clashed.',
    hook:
      'Not every system wants to wait for locks. Timestamps and optimistic validation let transactions run and check for conflicts later.',
    objectives: [
      'Explain timestamp ordering.',
      'Describe the validation phase of optimistic concurrency control.',
      'Know what MVCC keeps multiple versions.',
      'Compare optimistic and pessimistic control.',
    ],
    sections: [
      {
        title: 'Timestamp ordering',
        body:
          'Each transaction gets a timestamp. Each data item tracks the last read and write timestamps. A read or write that would violate the timestamp order is rejected and the transaction restarts. This avoids locks but can cause repeated restarts under contention.',
      },
      {
        title: 'Optimistic concurrency control',
        body:
          'A transaction runs without locks, recording its reads and writes. At commit, a validation phase checks whether any concurrent transaction changed the data it read. If there is a conflict, it aborts and retries. Optimistic control works well when conflicts are rare.',
      },
      {
        title: 'Multiversion concurrency control',
        body:
          'MVCC keeps multiple versions of a row. Readers see a consistent snapshot without blocking writers, and writers create new versions. Old versions are reclaimed when no transaction needs them. This is why many modern databases allow reads and writes to proceed concurrently.',
        code: String.raw`row id=1:
version 1: balance=100
version 2: balance=120

reader with old snapshot -> version 1
new reader -> version 2`,
      },
    ],
    keyTakeaways: [
      'Timestamp ordering rejects out-of-order operations.',
      'Optimistic control validates at commit and retries on conflict.',
      'MVCC keeps multiple row versions for consistent reads.',
      'Optimistic control is good when conflicts are rare.',
      'Pessimistic locking is better under high contention.',
    ],
    pitfalls: [
      'Assuming optimistic control never aborts.',
      'Forgetting that MVCC needs garbage collection for old versions.',
      'Confusing timestamps with wall-clock time.',
    ],
    focusPoints: [
      'Trace a timestamp conflict.',
      'Explain the validation phase.',
      'Compare MVCC with locking.',
    ],
    quiz: [
      {
        question: 'When does optimistic concurrency control validate a transaction?',
        options: ['At commit', 'At the first read', 'At every write', 'Never'],
        answer: 0,
        explanation:
          'Validation happens at commit, after the transaction has run without locks.',
      },
      {
        question: 'What does MVCC keep?',
        options: ['Multiple versions of a row', 'Multiple schemas', 'Multiple indexes', 'Multiple logs'],
        answer: 0,
        explanation:
          'Multiversion concurrency control keeps older versions so readers can see a consistent snapshot.',
      },
    ],
  },
];
