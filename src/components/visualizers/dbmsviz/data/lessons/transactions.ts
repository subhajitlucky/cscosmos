import type { DBMSLesson } from './types';

export const transactionLessons: DBMSLesson[] = [
  {
    chapterId: 'transactions-acid',
    plainEnglish: 'A bank transfer is all-or-nothing: the money leaves one account and arrives in the other, even after a crash.',
    hook:
      'A transaction is a unit of work that either happens completely or not at all. ACID is the promise that keeps a database trustworthy.',
    objectives: [
      'Define a transaction and its boundaries.',
      'Explain atomicity, consistency, isolation, and durability.',
      'Contrast commit and rollback.',
      'See ACID in a bank-transfer example.',
    ],
    sections: [
      {
        title: 'What a transaction is',
        body:
          'A transaction groups several operations into one logical unit. It begins with a start marker and ends with COMMIT or ROLLBACK. The DBMS must make the whole group behave as if it ran alone and either fully succeeded or never happened.',
        code: String.raw`BEGIN;
UPDATE Account SET balance = balance - 100 WHERE id = 1;
UPDATE Account SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
      },
      {
        title: 'ACID',
        body:
          'Atomicity: all operations succeed or none do. Consistency: the transaction moves the database from one valid state to another. Isolation: concurrent transactions do not see each other\'s uncommitted work. Durability: once committed, the change survives a crash. Each property needs a different mechanism: logging, constraints, concurrency control, and stable storage.',
      },
      {
        title: 'Commit and rollback',
        body:
          'COMMIT makes the transaction durable and visible. ROLLBACK undoes its changes. A transaction may also abort automatically on a constraint violation, deadlock, or crash. The recovery system uses the log to undo uncommitted work and redo committed work.',
      },
    ],
    keyTakeaways: [
      'A transaction is an all-or-nothing unit of work.',
      'Atomicity is all or nothing; consistency preserves invariants.',
      'Isolation hides uncommitted changes; durability survives crashes.',
      'COMMIT makes changes permanent; ROLLBACK undoes them.',
      'Recovery uses logs to redo and undo.',
    ],
    pitfalls: [
      'Leaving a transaction open and holding locks.',
      'Assuming COMMIT is free; it forces durability work.',
      'Confusing consistency with isolation.',
    ],
    focusPoints: [
      'Explain each ACID property with a bank transfer.',
      'Know what COMMIT and ROLLBACK do.',
      'Name the mechanism behind durability.',
    ],
    quiz: [
      {
        question: 'Which ACID property ensures a committed change survives a crash?',
        options: ['Atomicity', 'Consistency', 'Isolation', 'Durability'],
        answer: 3,
        explanation: 'Durability writes committed changes to stable storage.',
      },
      {
        question: 'What does ROLLBACK do?',
        options: ['Undoes the transaction', 'Commits the transaction', 'Creates an index', 'Deletes the database'],
        answer: 0,
        explanation: 'Rollback undoes all changes made by the transaction.',
      },
    ],
  },

  {
    chapterId: 'transaction-states',
    plainEnglish: 'A transaction is like a parcel: packed, ready, shipped, delivered, or returned.',
    walkthrough: { kind: 'transaction-states' },
    hook:
      'A transaction is not simply "running" or "done." It passes through states, and the DBMS makes different guarantees at each one.',
    objectives: [
      'Name the five transaction states.',
      'Trace normal and aborted execution paths.',
      'Explain the partially committed state.',
      'Know what happens after a failure.',
    ],
    sections: [
      {
        title: 'The state diagram',
        body:
          'A transaction starts active. It becomes partially committed after its last operation but before the commit is durable. Once the commit record is safely stored, it is committed. If an error occurs, it enters the failed state and then aborted after rollback. A terminated transaction has finished, whether committed or aborted.',
        code: String.raw`active -> partially committed -> committed
   |                |
   v                v
 failed ---------> aborted`,
      },
      {
        title: 'Normal execution',
        body:
          'During the active state, the transaction reads and writes data and holds locks. In the partially committed state, all operations are done but the commit is not yet durable. The DBMS writes the commit record and flushes the log; then the transaction is committed and its locks can be released.',
      },
      {
        title: 'Failure and rollback',
        body:
          'A failure can come from a constraint violation, a deadlock, a user ROLLBACK, or a system crash. The transaction enters the failed state, the recovery system undoes its changes using the log, and it becomes aborted. The application may retry with a new transaction.',
      },
    ],
    keyTakeaways: [
      'The five states are active, partially committed, committed, failed, and aborted.',
      'Partially committed means the work is done but the commit is not durable yet.',
      'Committed means the commit record is safely stored.',
      'Failed transactions are rolled back and become aborted.',
      'A terminated transaction is either committed or aborted.',
    ],
    pitfalls: [
      'Thinking partially committed is already durable.',
      'Releasing locks before the commit is durable.',
      'Retrying a transaction without considering idempotence.',
    ],
    focusPoints: [
      'Draw the state diagram.',
      'Explain the difference between partially committed and committed.',
      'Trace a crash before and after the commit record.',
    ],
    quiz: [
      {
        question: 'Which state means all operations are done but the commit is not yet durable?',
        options: ['Active', 'Partially committed', 'Committed', 'Aborted'],
        answer: 1,
        explanation:
          'Partially committed is the window between finishing the operations and making the commit durable.',
      },
      {
        question: 'What happens to a failed transaction?',
        options: ['It is rolled back and becomes aborted', 'It is committed', 'It stays active forever', 'It becomes a savepoint'],
        answer: 0,
        explanation: 'The recovery system undoes its changes and marks it aborted.',
      },
    ],
  },

  {
    chapterId: 'recovery-logs',
    plainEnglish: 'The log is a diary of changes. If the power goes out, replay the diary.',
    hook:
      'The log is the database\'s memory of what happened. After a crash, redo and undo use that memory to rebuild a consistent state.',
    objectives: [
      'Explain write-ahead logging.',
      'Distinguish redo from undo.',
      'Know what a checkpoint does.',
      'Trace recovery after a crash.',
    ],
    sections: [
      {
        title: 'Write-ahead logging',
        body:
          'Before a data page is written to disk, the corresponding log record must be on stable storage. This is the write-ahead rule. The log records the transaction ID, page ID, old value, and new value. If a crash occurs, the log is the authoritative record of what was intended.',
        code: String.raw`log:
<T1, begin>
<T1, update, page 5, old=100, new=200>
<T1, commit>`,
      },
      {
        title: 'Redo and undo',
        body:
          'Redo reapplies committed changes that may not have reached the data files. Undo reverses uncommitted changes that may have reached the data files. Recovery scans the log, builds the set of committed and uncommitted transactions, and applies the appropriate pass. The exact algorithm varies, but the principle is the same.',
      },
      {
        title: 'Checkpoints',
        body:
          'A checkpoint flushes dirty pages and writes a checkpoint record. Recovery can start from the last checkpoint instead of the beginning of the log. A fuzzy checkpoint allows normal work to continue while pages are flushed, which keeps the system available.',
      },
    ],
    keyTakeaways: [
      'Write-ahead logging writes the log before the data page.',
      'Redo reapplies committed changes; undo reverses uncommitted changes.',
      'A checkpoint bounds the amount of log recovery must scan.',
      'The log must be on stable storage before commit is acknowledged.',
      'Recovery restores a consistent state after a crash.',
    ],
    pitfalls: [
      'Writing data pages before the log record.',
      'Assuming a checkpoint means no recovery is needed.',
      'Forgetting that undo must handle changes already written to disk.',
    ],
    focusPoints: [
      'State the write-ahead rule.',
      'Explain redo and undo with a small log.',
      'Describe the purpose of a checkpoint.',
    ],
    quiz: [
      {
        question: 'What is the write-ahead rule?',
        options: [
          'Write the log record before the data page',
          'Write the data page before the log',
          'Never write a log',
          'Write only at commit',
        ],
        answer: 0,
        explanation:
          'The log record must reach stable storage before the corresponding data page is written.',
      },
      {
        question: 'What does redo do?',
        options: ['Reapplies committed changes', 'Undoes committed changes', 'Deletes the log', 'Creates a checkpoint'],
        answer: 0,
        explanation: 'Redo reapplies committed work that may not have reached the data files.',
      },
    ],
  },

  {
    chapterId: 'shadow-paging',
    plainEnglish: 'Write the new version on a fresh page, then switch the bookmark.',
    hook:
      'Shadow paging avoids a log by never overwriting the live page table. It switches pointers atomically and keeps the old version as a shadow.',
    objectives: [
      'Explain current and shadow page tables.',
      'Describe the atomic commit switch.',
      'Know the cost of garbage collection.',
      'Compare shadow paging with logging.',
    ],
    sections: [
      {
        title: 'Current and shadow pages',
        body:
          'The database keeps a current page table and a shadow page table. Updates are written to new pages, not the live pages. The current table points to the new pages; the shadow table still points to the old consistent state.',
      },
      {
        title: 'Atomic commit',
        body:
          'At commit, the DBMS writes the updated page table to disk and atomically switches the root pointer to it. Before the switch, the shadow table is the consistent state; after the switch, the new table is. A crash during the switch leaves either the old or the new state, never a mixture.',
        code: String.raw`before commit:
shadow -> old pages (consistent)
current -> new pages (uncommitted)

commit:
write current page table
atomic switch root -> current`,
      },
      {
        title: 'Costs and comparison',
        body:
          'Shadow paging avoids undo/redo logging for page writes, but it fragments the disk because updated pages are written elsewhere. It also needs garbage collection for old pages and can be expensive for large transactions. Logging is more common in modern systems because it handles large updates and recovery more flexibly.',
      },
    ],
    keyTakeaways: [
      'Shadow paging writes updates to new pages.',
      'The shadow page table preserves the last consistent state.',
      'Commit switches the root pointer atomically.',
      'Old pages require garbage collection.',
      'Logging is generally more flexible for large transactions.',
    ],
    pitfalls: [
      'Thinking shadow paging never writes to disk.',
      'Forgetting that old pages consume space until collected.',
      'Assuming the atomic switch is free.',
    ],
    focusPoints: [
      'Explain the current and shadow tables.',
      'Trace a commit and a crash before/after the switch.',
      'Compare shadow paging with WAL.',
    ],
    quiz: [
      {
        question: 'What does the shadow page table represent?',
        options: ['The last consistent state', 'The uncommitted state', 'The transaction log', 'The buffer pool'],
        answer: 0,
        explanation:
          'The shadow table points to the old consistent pages until the commit switch.',
      },
      {
        question: 'What is a cost of shadow paging?',
        options: ['Garbage collection of old pages', 'No crash recovery', 'No transactions', 'No page table'],
        answer: 0,
        explanation:
          'Updated pages are written elsewhere, so old pages must eventually be reclaimed.',
      },
    ],
  },
];
