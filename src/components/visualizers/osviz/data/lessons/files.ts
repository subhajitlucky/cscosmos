import type { OSLesson } from './types';

export const fileLessons: OSLesson[] = [
  {
    chapterId: 'file-concept-directories',
    hook:
      'A file is more than bytes. It is a name, a set of attributes, a location, and a set of operations the OS promises to perform safely.',
    objectives: [
      'List the attributes and operations of a file.',
      'Explain hierarchical directories and paths.',
      'Distinguish hard links from symbolic links.',
      'Know what metadata the file system stores.',
    ],
    sections: [
      {
        title: 'File attributes and operations',
        body:
          'A file has a name, size, owner, permissions, timestamps, type, and location. The operating system supports create, open, read, write, seek, close, delete, and truncate. The file system stores metadata separately from the data blocks. A file descriptor or handle is the process\'s reference to an open file.',
      },
      {
        title: 'Directories and paths',
        body:
          'A directory maps names to file metadata. A hierarchical directory tree forms paths. An absolute path starts at the root; a relative path starts at the current directory. Directories themselves are files with special structure and permissions. Path resolution walks one component at a time, checking permissions and following links.',
        code: String.raw`/home/ada/report.txt
 ^    ^   ^
root  dir  file

relative from /home/ada: report.txt`,
      },
      {
        title: 'Hard links and symbolic links',
        body:
          'A hard link is another directory entry for the same file metadata; deleting one name does not delete the data until the link count reaches zero. A symbolic link is a small file containing a path to another file; it can point across file systems and can become dangling. Links are a file-system feature, not a copy.',
      },
    ],
    keyTakeaways: [
      'A file is data plus metadata plus a name.',
      'File descriptors are per-process handles for open files.',
      'Paths are resolved one directory component at a time.',
      'Hard links share metadata; symbolic links store a path.',
      'Permissions are checked during path resolution and I/O.',
    ],
    pitfalls: [
      'Confusing a file name with the file itself.',
      'Assuming deleting a hard link deletes the data immediately.',
      'Forgetting that a symbolic link can dangle.',
    ],
    focusPoints: [
      'Name five file attributes.',
      'Trace absolute and relative path resolution.',
      'Compare hard and symbolic links.',
    ],
    quiz: [
      {
        question: 'What is a hard link?',
        options: [
          'Another directory entry for the same file metadata',
          'A copy of the file data',
          'A pointer to a path string',
          'A special device file',
        ],
        answer: 0,
        explanation:
          'A hard link adds another name for the same inode/metadata; the data is not copied.',
      },
      {
        question: 'What happens when the last hard link to a file is removed?',
        options: ['The data blocks are freed', 'The file becomes a symbolic link', 'The file grows', 'Nothing changes'],
        answer: 0,
        explanation:
          'When the link count reaches zero and no process has the file open, the file system frees the data and metadata.',
      },
    ],
  },

  {
    chapterId: 'contiguous-file-allocation',
    hook:
      'Contiguous allocation gives a file one run of blocks. It is the fastest layout for sequential and direct access, but it is brittle when files grow.',
    objectives: [
      'Map a file to a start block and length.',
      'Compute the block address for a record.',
      'Explain external fragmentation in file systems.',
      'Know why growing a file is difficult.',
    ],
    sections: [
      {
        title: 'The mapping',
        body:
          'The directory entry stores the first block and the number of blocks. Block i of the file is start + i. Random access is a simple calculation, so direct access is fast. Sequential access is even faster because the disk head can stay near consecutive blocks.',
        code: String.raw`file report.txt: start = 20, length = 5
block 0 -> 20
block 3 -> 23
block 4 -> 24`,
      },
      {
        title: 'Fragmentation and growth',
        body:
          'As files are created and deleted, free space becomes fragmented. A new file may not find a contiguous run large enough even when total free space is sufficient. Compaction can fix this but is expensive. If a file grows, it may need to be moved to a larger hole, and its directory entry must be updated.',
      },
      {
        title: 'When it works well',
        body:
          'Contiguous allocation is excellent for read-only media, preallocated files, and workloads where file sizes are known in advance. It is less suitable for general-purpose file systems with many small, growing files.',
      },
    ],
    keyTakeaways: [
      'Contiguous allocation stores a start block and length.',
      'Direct access is O(1).',
      'External fragmentation makes allocation fail despite free space.',
      'Growing a file may require relocation.',
      'It works best for known-size or read-only files.',
    ],
    pitfalls: [
      'Forgetting that the file occupies exactly length blocks.',
      'Assuming free space is automatically contiguous.',
      'Ignoring the cost of moving a growing file.',
    ],
    focusPoints: [
      'Compute block i from start + i.',
      'Explain why a file cannot always grow in place.',
      'Compare sequential and direct access cost.',
    ],
    quiz: [
      {
        question: 'A file starts at block 20 and has length 5. Which block holds file block 3?',
        options: ['20', '23', '24', '25'],
        answer: 1,
        explanation: 'File block i is at start + i, so block 3 is 20 + 3 = 23.',
      },
      {
        question: 'What is the main allocation problem with contiguous files?',
        options: ['External fragmentation', 'Too many pointers', 'Slow direct access', 'No metadata'],
        answer: 0,
        explanation:
          'Free space becomes fragmented into runs that may be too small for a new file.',
      },
    ],
  },

  {
    chapterId: 'linked-allocation-fat',
    hook:
      'Linked allocation spreads a file across blocks and stores a next pointer in each block. FAT moves those pointers into a table so the chain can be followed without reading every data block.',
    objectives: [
      'Trace a linked file chain.',
      'Explain the File Allocation Table.',
      'Compute the cost of direct access.',
      'Know how free space is represented in FAT.',
    ],
    sections: [
      {
        title: 'Linked allocation',
        body:
          'Each block stores data plus a pointer to the next block. The directory entry stores only the first block. A file can grow by allocating any free block and linking it. There is no external fragmentation, but a random access to block i requires following i links, and each link may cost a disk read if the block is not cached.',
        code: String.raw`directory: report.txt -> block 5
block 5  data + next 9
block 9  data + next 2
block 2  data + next 14
block 14 data + next EOF`,
      },
      {
        title: 'The File Allocation Table',
        body:
          'FAT removes the next pointer from the data block and stores it in a table indexed by block number. The directory entry still stores the first block. To follow the file, read FAT[5] = 9, FAT[9] = 2, and so on. The FAT is small enough to be cached in memory, so chain traversal is faster than reading each data block just to find the next pointer.',
        code: String.raw`FAT[5]  = 9
FAT[9]  = 2
FAT[2]  = 14
FAT[14] = EOF
FAT[20] = FREE`,
      },
      {
        title: 'Access cost',
        body:
          'Sequential access is good: follow the chain and read each block once. Direct access to block i is O(i) because the chain must be walked. FAT is a linked-allocation variant, so it inherits this weakness. Indexed allocation solves direct access by storing all block pointers in one place.',
      },
    ],
    keyTakeaways: [
      'Linked allocation stores a next pointer per block.',
      'FAT stores those pointers in a table indexed by block.',
      'The directory entry stores the first block.',
      'Sequential access is efficient; direct access is O(n).',
      'FAT entries also represent free and end-of-file blocks.',
    ],
    pitfalls: [
      'Confusing the FAT with the data blocks.',
      'Assuming direct access is O(1).',
      'Forgetting to mark the last block as EOF.',
    ],
    focusPoints: [
      'Walk a FAT chain and count the blocks.',
      'Explain why FAT improves on in-block pointers.',
      'Compare sequential and direct access cost.',
    ],
    quiz: [
      {
        question: 'In a FAT file system, what does a FAT entry contain?',
        options: ['The next block in the chain', 'The file contents', 'The file owner', 'The directory name'],
        answer: 0,
        explanation:
          'Each FAT entry points to the next block, or marks the block free or end-of-file.',
      },
      {
        question: 'What is the direct-access cost of block i in a FAT chain?',
        options: ['O(1)', 'O(i)', 'O(log i)', 'O(i^2)'],
        answer: 1,
        explanation:
          'The chain must be followed from the first block, so accessing block i takes i steps.',
      },
    ],
  },

  {
    chapterId: 'indexed-file-allocation',
    hook:
      'Indexed allocation puts every block pointer in one index block. Direct access becomes fast, at the cost of an extra block and a limit on file size.',
    objectives: [
      'Explain an index block and its pointers.',
      'Compute direct-access cost.',
      'Know how multi-level indexes extend file size.',
      'Compare indexed allocation with FAT.',
    ],
    sections: [
      {
        title: 'The index block',
        body:
          'The directory entry points to an index block. The index block contains pointers to the file\'s data blocks. To read file block i, load the index block and follow pointer i. The data block need not be read to find the next block. This gives direct access in two reads: index block plus data block.',
        code: String.raw`directory: report.txt -> index block 3
index[0] = 7
index[1] = 11
index[2] = 18
index[3] = 21

read file block 2 -> read index[2] -> read block 18`,
      },
      {
        title: 'Multi-level indexes',
        body:
          'A single index block limits the maximum file size. A multi-level index uses an index of indexes. The first-level block points to second-level index blocks, which point to data blocks. This scales to large files but adds memory accesses for deep lookups. Real file systems blend direct, indirect, and multi-level pointers.',
      },
      {
        title: 'Trade-offs',
        body:
          'Indexed allocation gives fast direct access and no external fragmentation. It wastes space when a file is small because the index block is mostly empty, and it adds an extra block read per access. FAT is better for tiny files and sequential scans; indexed allocation is better for random access and larger files.',
      },
    ],
    keyTakeaways: [
      'An index block stores pointers to data blocks.',
      'Direct access costs index read plus data read.',
      'Multi-level indexes extend the maximum file size.',
      'Indexed allocation avoids chain traversal.',
      'The index block can waste space for small files.',
    ],
    pitfalls: [
      'Forgetting the index block read in the access cost.',
      'Assuming one index block can address unlimited file size.',
      'Confusing an index block with a data block.',
    ],
    focusPoints: [
      'Trace a direct read through an index block.',
      'Explain multi-level indexing.',
      'Compare FAT and indexed access costs.',
    ],
    quiz: [
      {
        question: 'What does an index block contain?',
        options: ['Pointers to the file\'s data blocks', 'The file contents', 'The directory tree', 'The free list'],
        answer: 0,
        explanation:
          'The index block stores the block pointers, so the file system can find any data block directly.',
      },
      {
        question: 'What is the direct-access cost for indexed allocation?',
        options: ['One data read', 'Index read plus data read', 'O(n) chain walk', 'No reads'],
        answer: 1,
        explanation:
          'The file system reads the index block to get the pointer, then reads the data block.',
      },
    ],
  },

  {
    chapterId: 'sequential-file-organization',
    hook:
      'Sequential organization is the simplest record layout: records sit one after another in key order. It is perfect for scans and painful for random inserts.',
    objectives: [
      'Explain sequential record organization.',
      'Analyze search, insert, and delete costs.',
      'Know which workloads fit sequential files.',
      'Compare it with indexed organization.',
    ],
    sections: [
      {
        title: 'Layout and search',
        body:
          'Records are stored in key order, one after another. A sequential search reads records until it finds the key or passes the position where the key should be. Searching is O(n) in the worst case, but scanning the whole file is optimal because blocks are contiguous. This layout is ideal for reports, logs, and batch processing.',
      },
      {
        title: 'Insertion and deletion',
        body:
          'Inserting a record in the middle requires shifting later records or leaving a gap. Deleting a record leaves a hole or requires compaction. Both operations can be expensive. A common compromise is to append new records to an overflow area and merge periodically.',
        code: String.raw`keys: 10 20 30 40 50
insert 25 -> 10 20 25 30 40 50  (shift 30,40,50)
delete 30 -> 10 20 25 40 50     (shift or leave a hole)`,
      },
      {
        title: 'When to use it',
        body:
          'Sequential organization is best when the workload is mostly full scans, the file is written once, or the records are processed in key order. It is a poor choice for frequent random lookups and point updates.',
      },
    ],
    keyTakeaways: [
      'Records are stored in key order.',
      'Sequential scan is efficient; random search is O(n).',
      'Insertions and deletions can require shifting or compaction.',
      'It suits batch scans and append-heavy workloads.',
      'Indexed organization is better for random lookup.',
    ],
    pitfalls: [
      'Assuming sequential order makes random lookup fast.',
      'Ignoring the cost of shifting records.',
      'Forgetting that deletion can leave holes.',
    ],
    focusPoints: [
      'Analyze search cost.',
      'Explain why insertion is expensive.',
      'Match sequential files to a workload.',
    ],
    quiz: [
      {
        question: 'What is the worst-case search cost in a sequential file?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
        answer: 2,
        explanation:
          'A sequential search may need to read every record, so the worst case is O(n).',
      },
      {
        question: 'Which workload suits a sequential file?',
        options: ['Full scans and batch processing', 'Frequent random point lookups', 'Hash-based equality searches', 'Range queries on a B-tree'],
        answer: 0,
        explanation:
          'Sequential files are efficient when records are processed in order or scanned in full.',
      },
    ],
  },

  {
    chapterId: 'indexed-file-organization',
    hook:
      'An index adds a shortcut: instead of scanning records, look up the key and jump to the block. The price is extra space and maintenance.',
    objectives: [
      'Explain an index entry and a lookup.',
      'Distinguish dense and sparse indexes.',
      'Compare primary and secondary indexes.',
      'Analyze lookup and update costs.',
    ],
    sections: [
      {
        title: 'Index entries',
        body:
          'An index is a separate structure mapping a key to a record location. A lookup searches the index, then reads the data block. If the index is sorted, binary search or a B-tree can make lookup O(log n). The index itself is stored in blocks and may be cached.',
        code: String.raw`index:
key 10 -> block 4, slot 0
key 20 -> block 4, slot 1
key 30 -> block 5, slot 0

lookup(20) -> index -> block 4 -> record`,
      },
      {
        title: 'Dense and sparse indexes',
        body:
          'A dense index has an entry for every record. A sparse index has one entry per block, pointing to the first record in that block; the block is then scanned. Sparse indexes are smaller and cheaper to maintain but require a short scan. A primary index is built on the file\'s sort key; a secondary index supports another search key.',
      },
      {
        title: 'Update cost',
        body:
          'Every insert, delete, or key update must update the index. A dense index may need an entry for every new record. A secondary index may need many entries. Indexes speed reads but slow writes and consume space. The right number of indexes depends on the read/write mix.',
      },
    ],
    keyTakeaways: [
      'An index maps a key to a record location.',
      'Dense indexes have an entry per record; sparse indexes per block.',
      'Primary indexes use the sort key; secondary indexes support other keys.',
      'Indexes speed reads but add write and space overhead.',
      'Sorted indexes support efficient range queries.',
    ],
    pitfalls: [
      'Forgetting to update the index on every write.',
      'Assuming a sparse index can find a record without scanning its block.',
      'Creating many secondary indexes without considering write cost.',
    ],
    focusPoints: [
      'Trace an index lookup.',
      'Compare dense and sparse indexes.',
      'Explain the read/write trade-off.',
    ],
    quiz: [
      {
        question: 'What is a sparse index?',
        options: [
          'An index with one entry per block',
          'An index with an entry for every record',
          'An index with no keys',
          'A hash table',
        ],
        answer: 0,
        explanation:
          'A sparse index stores one entry per block and scans the block after finding the right range.',
      },
      {
        question: 'What is the main cost of adding an index?',
        options: ['Extra space and slower writes', 'Slower reads', 'More page faults only', 'No cost'],
        answer: 0,
        explanation:
          'The index consumes space and must be maintained on every insert, delete, or update.',
      },
    ],
  },

  {
    chapterId: 'line-hashed-file-organization',
    hook:
      'Line-sequential files handle variable-length text; hashed files turn a key into a bucket address. One is flexible, the other is fast for exact matches.',
    objectives: [
      'Explain line-sequential records and delimiters.',
      'Explain hashing, buckets, and collisions.',
      'Analyze point lookup and range query costs.',
      'Know when hashing is the wrong choice.',
    ],
    sections: [
      {
        title: 'Line-sequential organization',
        body:
          'A line-sequential file stores variable-length records, often lines of text. Each record needs a delimiter or a length prefix so the reader knows where it ends. Reading is sequential; finding a random line requires scanning from the beginning or using a separate index. Logs and configuration files commonly use this layout.',
        code: String.raw`length-prefixed:
[5]hello[5]world

delimited:
hello\nworld\n`,
      },
      {
        title: 'Hashed organization',
        body:
          'A hash function maps a key to a bucket number. The bucket holds the record or a pointer to it. A point lookup computes the hash and reads one bucket, giving near-constant time when the distribution is good. Collisions happen when two keys map to the same bucket; they are handled by chaining or open addressing.',
        code: String.raw`bucket = hash(key) % bucket_count
read bucket
if collision: follow overflow chain`,
      },
      {
        title: 'The range-query problem',
        body:
          'Hashing destroys key order. A query for all keys between 10 and 20 cannot jump to a range; it may have to scan many buckets. Hashed files are excellent for exact-match lookups and poor for range queries and ordered scans. An index or a tree is the better choice when order matters.',
      },
    ],
    keyTakeaways: [
      'Line-sequential files store variable-length records with delimiters or lengths.',
      'Hashing maps a key to a bucket for fast point lookups.',
      'Collisions require chaining or open addressing.',
      'Hashing is weak for range queries and ordered scans.',
      'Choose the organization based on the query pattern.',
    ],
    pitfalls: [
      'Forgetting to handle hash collisions.',
      'Using hashing for range queries.',
      'Assuming a line-sequential file supports fast random access without an index.',
    ],
    focusPoints: [
      'Explain length-prefixed versus delimited records.',
      'Compute a bucket index with a hash function.',
      'State the main weakness of hashing.',
    ],
    quiz: [
      {
        question: 'What is the main weakness of a hashed file?',
        options: ['Inefficient range queries', 'Slow point lookups', 'No random access', 'It cannot store keys'],
        answer: 0,
        explanation:
          'Hashing scatters keys, so a range query cannot follow key order and may scan many buckets.',
      },
      {
        question: 'How does a line-sequential file know where a record ends?',
        options: ['A delimiter or a length prefix', 'The page table', 'The FAT', 'The TLB'],
        answer: 0,
        explanation:
          'Variable-length records need a delimiter or a length field to mark their boundary.',
      },
    ],
  },

  {
    chapterId: 'file-sorting-merging',
    hook:
      'A file may be larger than memory, so sorting must be external. The trick is to create sorted runs, then merge them without loading the whole file.',
    objectives: [
      'Explain external merge sort.',
      'Trace the run creation and merge phases.',
      'Know why merging is I/O-bound.',
      'Estimate the number of passes.',
    ],
    sections: [
      {
        title: 'Sorted runs',
        body:
          'Read as much of the file as fits in memory, sort that chunk, and write it back as a sorted run. Repeat until the whole file is a set of runs. Each run is internally sorted, but the file as a whole is not. The number of runs depends on the file size and the memory buffer.',
        code: String.raw`chunk 1 -> sort -> run1
chunk 2 -> sort -> run2
chunk 3 -> sort -> run3`,
      },
      {
        title: 'Merging runs',
        body:
          'Merge two or more sorted runs by repeatedly taking the smallest front record. A two-way merge uses two input buffers and one output buffer. A k-way merge uses k input buffers and is faster when memory allows. Each merge pass reads and writes the whole file, so the I/O cost grows with the number of passes.',
        code: String.raw`merge(run1, run2):
    while both have records:
        output the smaller front record
    append the remaining records`,
      },
      {
        title: 'Cost',
        body:
          'External sorting is dominated by disk I/O, not comparisons. More memory means fewer runs and fewer merge passes. A large k-way merge can reduce the number of passes to one or two. The final sorted file is written once, and intermediate runs are deleted.',
      },
    ],
    keyTakeaways: [
      'External sorting creates sorted runs that fit in memory.',
      'Merging combines runs without loading the whole file.',
      'The cost is dominated by I/O passes.',
      'More memory means fewer runs and fewer passes.',
      'A k-way merge can reduce the number of passes.',
    ],
    pitfalls: [
      'Trying to sort the whole file in memory.',
      'Ignoring the cost of writing intermediate runs.',
      'Assuming comparisons dominate external sorting.',
    ],
    focusPoints: [
      'Explain run creation.',
      'Trace a two-way merge.',
      'Relate memory size to the number of passes.',
    ],
    quiz: [
      {
        question: 'Why does external sorting create runs?',
        options: [
          'The file is too large to sort in memory at once',
          'Runs make the file smaller',
          'Runs are required by the file system',
          'It avoids comparisons',
        ],
        answer: 0,
        explanation:
          'Each run is sorted in memory and written back, so the file never has to fit in RAM all at once.',
      },
      {
        question: 'What dominates the cost of external sorting?',
        options: ['Disk I/O', 'CPU comparisons', 'Page-table walks', 'Interrupts'],
        answer: 0,
        explanation:
          'Reading and writing runs and merge passes is the main cost.',
      },
    ],
  },

  {
    chapterId: 'file-indexing-updating',
    hook:
      'An index is only useful if it stays correct. Updates must change the data and every index that points to it, and a crash in the middle must not leave the file inconsistent.',
    objectives: [
      'Explain index maintenance on insert, delete, and update.',
      'Compare in-place and out-of-place updates.',
      'Explain write-ahead logging.',
      'Know how recovery uses the log.',
    ],
    sections: [
      {
        title: 'Maintaining indexes',
        body:
          'Every insert adds an index entry; every delete removes one; every key update removes the old entry and adds a new one. A dense index may need more work than a sparse index. If an index is sorted, inserting a key may require splitting a block. The file system must keep the data and index consistent even if a crash occurs between the two writes.',
      },
      {
        title: 'In-place versus out-of-place',
        body:
          'An in-place update overwrites the old record. If the system crashes midway, the record may be half written. An out-of-place update writes a new version to a free block, then atomically switches the pointer. The old version remains available until the switch is committed, which makes recovery simpler.',
        code: String.raw`in-place:
write(record_block, new_value)   /* crash here = torn record */

out-of-place:
new_block = write(new_value)
commit_pointer(record -> new_block)
free(old_block)`,
      },
      {
        title: 'Write-ahead logging',
        body:
          'Before changing a data block, write a log record describing the change. The log is forced to stable storage before the data block is written. After a crash, recovery scans the log: committed transactions are redone, incomplete ones are undone. This is the foundation of crash-safe file systems and databases.',
        code: String.raw`log.append({ op: "update", key: 42, old: A, new: B });
log.flush();
write_data_block(42, B);
log.commit();`,
      },
    ],
    keyTakeaways: [
      'Every index must be updated when the data changes.',
      'In-place updates risk torn records on a crash.',
      'Out-of-place updates switch a pointer atomically.',
      'Write-ahead logging records intent before data changes.',
      'Recovery redoes committed work and undoes incomplete work.',
    ],
    pitfalls: [
      'Updating data without updating its indexes.',
      'Assuming a single block write is atomic.',
      'Forgetting to flush the log before writing data.',
    ],
    focusPoints: [
      'List the index work for an insert and a delete.',
      'Explain the torn-write problem.',
      'Trace redo and undo during recovery.',
    ],
    quiz: [
      {
        question: 'What is the purpose of a write-ahead log?',
        options: ['To recover safely after a crash', 'To speed up reads', 'To compress files', 'To allocate blocks'],
        answer: 0,
        explanation:
          'The log records changes before they are applied, so recovery can redo or undo work.',
      },
      {
        question: 'What is an out-of-place update?',
        options: [
          'Write a new version and switch the pointer',
          'Overwrite the old record in place',
          'Delete the index',
          'Move the file to another disk',
        ],
        answer: 0,
        explanation:
          'The new version is written elsewhere and the pointer is switched atomically.',
      },
    ],
  },
];
