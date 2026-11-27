import type { OSLesson } from './types';

export const memoryLessons: OSLesson[] = [
  {
    chapterId: 'contiguous-allocation',
    plainEnglish: 'Contiguous memory is one long row of seats for a group. If the group grows, it may not fit.',
    hook:
      'The simplest memory manager gives each process one contiguous block. It is fast and easy to explain, but free memory slowly turns into a patchwork of holes.',
    objectives: [
      'Explain contiguous allocation and the free list.',
      'Trace first-fit, best-fit, and worst-fit placement.',
      'Distinguish internal and external fragmentation.',
      'Know when compaction is useful.',
    ],
    sections: [
      {
        title: 'The free list',
        body:
          'Memory is divided into a free list of holes and an allocated region for each process. When a process arrives, the allocator chooses a hole large enough and splits it. When a process exits, its block returns to the free list and may be merged with adjacent free blocks. The policy for choosing a hole changes fragmentation and speed.',
      },
      {
        title: 'First-fit, best-fit, worst-fit',
        body:
          'First-fit takes the first hole that fits. Best-fit takes the smallest hole that fits, hoping to preserve large holes. Worst-fit takes the largest hole, hoping to leave a usable remainder. None is universally best. First-fit is usually fastest; best-fit can create tiny unusable leftovers; worst-fit spreads allocations out.',
        code: String.raw`holes = [100K, 500K, 200K, 300K, 600K]

first_fit(212K) -> 500K hole, remainder 288K
best_fit(212K)  -> 300K hole, remainder 88K
worst_fit(212K) -> 600K hole, remainder 388K`,
      },
      {
        title: 'Fragmentation',
        body:
          'External fragmentation means there is enough total free memory but no single hole large enough. Compaction can move processes together to create a large hole, but it costs time and may require relocation support. Internal fragmentation means a process was given more space than it needs, wasting the difference inside its own block. Fixed-size allocation units cause internal fragmentation; variable contiguous blocks cause external fragmentation.',
      },
    ],
    keyTakeaways: [
      'Contiguous allocation gives each process one block.',
      'First-fit is fast; best-fit preserves large holes but can leave tiny remnants.',
      'External fragmentation is free space split into unusable holes.',
      'Internal fragmentation is wasted space inside an allocated block.',
      'Compaction fixes external fragmentation at a cost.',
    ],
    pitfalls: [
      'Confusing internal and external fragmentation.',
      'Assuming best-fit always improves memory utilization.',
      'Forgetting to merge adjacent free blocks on release.',
    ],
    focusPoints: [
      'Run first-fit and best-fit on a small hole list.',
      'Explain why a request can fail despite enough total free memory.',
      'Know the cost of compaction.',
    ],
    quiz: [
      {
        question: 'A request fails although total free memory is sufficient. What is this called?',
        options: ['Internal fragmentation', 'External fragmentation', 'Paging', 'Thrashing'],
        answer: 1,
        explanation:
          'The free memory is split into holes, and no single hole is large enough; this is external fragmentation.',
      },
      {
        question: 'Which placement policy chooses the smallest hole that fits?',
        options: ['First-fit', 'Best-fit', 'Worst-fit', 'Next-fit'],
        answer: 1,
        explanation: 'Best-fit searches for the smallest hole large enough for the request.',
      },
    ],
  },

  {
    chapterId: 'segmentation',
    plainEnglish: 'Segmentation cuts memory into logical pieces, like chapters in a book.',
    walkthrough: {
      kind: 'segmentation',
      segmentIndex: 1,
      offset: 0x100,
      segments: [
        { name: 'code', base: 0x4000, limit: 0x1200 },
        { name: 'data', base: 0x6000, limit: 0x0800 },
        { name: 'stack', base: 0x9000, limit: 0x1000 },
      ],
    },
    hook:
      'Segmentation lets a program be divided by meaning: code, data, stack, and heap. Each segment has a base and a limit, and the hardware checks every access.',
    objectives: [
      'Explain a segment table and the base/limit pair.',
      'Translate a logical segment:offset address.',
      'Know how segmentation supports protection and sharing.',
      'Explain why segmentation still fragments memory externally.',
    ],
    sections: [
      {
        title: 'Logical segments',
        body:
          'A segment is a variable-length logical unit such as code, data, stack, or heap. The programmer or compiler sees a segment number and an offset. The hardware uses a segment table to find the segment\'s base address and limit. The offset must be less than the limit; otherwise the CPU raises a trap. The physical address is base + offset.',
        code: String.raw`segment_table[code]  = { base: 0x4000, limit: 0x1200 };
segment_table[data]  = { base: 0x6000, limit: 0x0800 };
segment_table[stack] = { base: 0x9000, limit: 0x1000 };

logical address (1, 0x0100) -> data segment
check 0x0100 < 0x0800
physical = 0x6000 + 0x0100 = 0x6100`,
      },
      {
        title: 'Protection and sharing',
        body:
          'A segment can carry permission bits: read, write, execute. The hardware checks them on every access, so code can be shared read-only between processes while data stays private. Segmentation matches the programmer\'s mental model better than a flat address space, which is why some architectures still expose segments.',
      },
      {
        title: 'The fragmentation problem',
        body:
          'Because segments are variable-length, allocating and freeing them creates external fragmentation. The OS may compact memory or use a more sophisticated allocator. Paging solves this by using fixed-size units, at the cost of a page table and a different mental model.',
      },
    ],
    keyTakeaways: [
      'A segment is a variable-length logical unit.',
      'The segment table stores a base and a limit.',
      'The hardware checks offset < limit before adding the base.',
      'Segments support protection and sharing.',
      'Variable-length segments cause external fragmentation.',
    ],
    pitfalls: [
      'Adding the base before checking the limit.',
      'Treating a segment offset as an absolute address.',
      'Assuming segmentation eliminates external fragmentation.',
    ],
    focusPoints: [
      'Translate (segment, offset) to a physical address.',
      'Explain the limit check.',
      'Compare segmentation with paging.',
    ],
    quiz: [
      {
        question: 'What does the segment limit check prevent?',
        options: ['Access outside the segment', 'Page faults', 'Context switches', 'Disk fragmentation'],
        answer: 0,
        explanation:
          'The offset must be smaller than the segment limit, so the access stays inside the segment.',
      },
      {
        question: 'What kind of fragmentation does segmentation suffer from?',
        options: ['Internal only', 'External', 'No fragmentation', 'Page-table fragmentation'],
        answer: 1,
        explanation:
          'Variable-length segments leave holes between allocations, causing external fragmentation.',
      },
    ],
  },

  {
    chapterId: 'paging-page-tables',
    plainEnglish: 'Paging cuts memory into equal pages and frames. The page table is the map from page to frame.',
    walkthrough: {
      kind: 'paging',
      virtualAddress: 0x1a2b,
      pageSize: 4096,
      pageTable: [4, 7, -1, 2, 9, -1, 5, 1],
    },
    hook:
      'Paging turns memory into fixed-size pages and frames. The page table is the map, and the offset is the part that never changes.',
    objectives: [
      'Explain pages, frames, and page-table entries.',
      'Split a virtual address into page number and offset.',
      'Translate a virtual address through a page table.',
      'Know what present and protection bits mean.',
    ],
    sections: [
      {
        title: 'Pages and frames',
        body:
          'Virtual memory is divided into fixed-size pages; physical memory is divided into frames of the same size. A page can be placed in any free frame. The page table maps each virtual page number to a frame number. Because pages are fixed-size, there is no external fragmentation; only the last page of a process may be partially wasted.',
      },
      {
        title: 'The address split',
        body:
          'A virtual address has two parts: the virtual page number and the offset. With 4 KB pages, the offset is 12 bits because 2^12 = 4096. The page number indexes the page table; the offset selects a byte inside the page. The physical address is the frame number times the page size plus the offset.',
        code: String.raw`page_size = 4096
vaddr = 0x1A2B
vpn = 0x1A2B / 0x1000 = 1
offset = 0x1A2B % 0x1000 = 0xA2B
frame = page_table[1] = 7
paddr = 7 * 0x1000 + 0xA2B = 0x7A2B`,
      },
      {
        title: 'Page-table entries',
        body:
          'A page-table entry stores the frame number plus control bits. The present/valid bit says whether the page is in memory. Protection bits say read, write, execute, or user/kernel access. A dirty bit says the page has been modified, and a reference bit helps replacement policies. A missing page triggers a page fault, which is the bridge to virtual memory.',
      },
    ],
    keyTakeaways: [
      'Pages are virtual; frames are physical.',
      'The virtual address splits into page number and offset.',
      'The page table maps page number to frame number.',
      'The offset is unchanged during translation.',
      'Present and protection bits control access and faults.',
    ],
    pitfalls: [
      'Adding the page number to the offset instead of the frame base.',
      'Forgetting that the offset width comes from the page size.',
      'Assuming the page table itself is always in physical memory.',
    ],
    focusPoints: [
      'Compute the offset width from the page size.',
      'Translate a virtual address step by step.',
      'Explain the present and dirty bits.',
    ],
    quiz: [
      {
        question: 'With 4 KB pages, what is the offset for virtual address 0x1A2B?',
        options: ['0x1A2B', '0xA2B', '0x1', '0x7'],
        answer: 1,
        explanation:
          'The page size is 0x1000, so the offset is the low 12 bits: 0xA2B.',
      },
      {
        question: 'What does the present bit in a page-table entry indicate?',
        options: ['The page is in memory', 'The page is writable', 'The page is executable', 'The page is shared'],
        answer: 0,
        explanation:
          'The present bit says whether the page is currently resident in a physical frame.',
      },
    ],
  },

  {
    chapterId: 'tlb-translation',
    plainEnglish: 'The TLB is a sticky note of recent address translations, so the CPU does not reread the whole map.',
    walkthrough: {
      kind: 'tlb',
      virtualAddress: 0x1a2b,
      pageSize: 4096,
      pageTable: [4, 7, -1, 2, 9, -1, 5, 1],
    },
    hook:
      'A page table lives in memory, so every translation could mean an extra memory access. The TLB is a tiny cache that makes the common case fast.',
    objectives: [
      'Explain a TLB hit and a TLB miss.',
      'Trace the hit and miss paths.',
      'Compute effective access time from a hit ratio.',
      'Explain why locality makes the TLB effective.',
    ],
    sections: [
      {
        title: 'TLB hits and misses',
        body:
          'The Translation Lookaside Buffer is a small associative cache inside the MMU. It stores recent page-number-to-frame translations. On a hit, the CPU gets the frame immediately. On a miss, the hardware or kernel walks the page table, finds the frame, and inserts the translation into the TLB. If the page is not present, the miss becomes a page fault.',
        code: String.raw`if (TLB contains vpn):
    frame = TLB[vpn]          /* hit */
else:
    frame = page_table[vpn]   /* miss: walk */
    TLB[vpn] = frame`,
      },
      {
        title: 'Effective access time',
        body:
          'Suppose a TLB lookup takes 10 ns, a memory access takes 100 ns, and the hit ratio is 90%. A hit costs 10 + 100 = 110 ns. A miss costs 10 + 100 + 100 = 210 ns because the page table must also be read. Effective access time = 0.9 × 110 + 0.1 × 210 = 120 ns. Without a TLB, every access would cost at least 200 ns.',
        code: String.raw`EAT = h * (tlb + mem) + (1 - h) * (tlb + mem + mem)
    = 0.9 * 110 + 0.1 * 210
    = 120 ns`,
      },
      {
        title: 'Locality and TLB reach',
        body:
          'Programs tend to access a small set of pages repeatedly. That locality keeps the TLB hit rate high. TLB reach is the amount of memory the TLB can cover: number of entries times page size. If the working set is larger than the reach, the hit rate drops and performance suffers.',
      },
    ],
    keyTakeaways: [
      'The TLB caches page-table translations.',
      'A hit avoids the page-table walk.',
      'A miss costs an extra memory access; a missing page becomes a fault.',
      'EAT depends on hit ratio, TLB access time, and memory access time.',
      'Locality keeps the TLB effective.',
    ],
    pitfalls: [
      'Forgetting to include the TLB lookup time on a miss.',
      'Assuming a TLB miss always means a page fault.',
      'Ignoring TLB reach when the working set grows.',
    ],
    focusPoints: [
      'Compute EAT with a given hit ratio.',
      'Trace the hit and miss paths.',
      'Explain why a TLB miss is not necessarily a page fault.',
    ],
    quiz: [
      {
        question: 'What happens on a TLB miss?',
        options: ['The page table is walked', 'The process is terminated', 'The disk is formatted', 'The page is always evicted'],
        answer: 0,
        explanation:
          'The MMU or kernel reads the page table to find the translation, then may insert it into the TLB.',
      },
      {
        question: 'With a 90% hit ratio, 10 ns TLB lookup, and 100 ns memory access, what is the EAT?',
        options: ['110 ns', '120 ns', '200 ns', '210 ns'],
        answer: 1,
        explanation:
          'EAT = 0.9 × 110 + 0.1 × 210 = 99 + 21 = 120 ns.',
      },
    ],
  },

  {
    chapterId: 'virtual-memory-demand-paging',
    plainEnglish: 'Virtual memory is a bookshelf bigger than your desk. You keep only the pages you are reading on the desk.',
    hook:
      'Virtual memory lets a process use an address space larger than RAM. The trick is simple: load a page only when it is actually needed.',
    objectives: [
      'Explain demand paging and the resident set.',
      'List the steps the kernel takes on a page fault.',
      'Know why locality makes demand paging work.',
      'Distinguish a page fault from an invalid access.',
    ],
    sections: [
      {
        title: 'Demand paging',
        body:
          'With demand paging, a process starts with few or no pages in memory. When it touches a page that is not present, the CPU raises a page fault. The kernel loads the page from disk or another backing store. Pages that are not being used can stay on disk, so the virtual address space can exceed physical memory.',
      },
      {
        title: 'The page-fault steps',
        body:
          'The CPU traps to the kernel and saves the faulting address. The kernel checks that the address is valid. It finds a free frame or chooses a victim page. If the victim is dirty, it is written back. The requested page is read into the frame. The page table and TLB are updated, the faulting instruction is restarted, and the process continues. If the address is invalid, the kernel sends a segmentation fault instead.',
        code: String.raw`1. trap: page not present
2. validate address
3. find free frame or evict victim
4. write back dirty victim
5. read page into frame
6. update page table and TLB
7. restart instruction`,
      },
      {
        title: 'Locality and the resident set',
        body:
          'Demand paging works because programs exhibit locality: they reuse a small set of pages for a while. The set of pages a process is actively using is its resident set or working set. If the resident set fits in memory, page faults are rare. If it does not, the system may thrash.',
      },
    ],
    keyTakeaways: [
      'Demand paging loads a page on first reference.',
      'A page fault traps to the kernel and may load a page from disk.',
      'The kernel validates the address before loading.',
      'The faulting instruction is restarted after the page is present.',
      'Locality keeps the resident set small.',
    ],
    pitfalls: [
      'Thinking every page fault is a fatal error.',
      'Forgetting to write back a dirty victim page.',
      'Assuming the process restarts from the beginning instead of the faulting instruction.',
    ],
    focusPoints: [
      'List the page-fault steps in order.',
      'Explain valid versus invalid faults.',
      'Define the working set.',
    ],
    quiz: [
      {
        question: 'What is demand paging?',
        options: [
          'Loading a page only when it is referenced',
          'Loading the entire process at startup',
          'Keeping every page in RAM',
          'Disabling the page table',
        ],
        answer: 0,
        explanation:
          'Demand paging brings a page into memory on its first reference, not in advance.',
      },
      {
        question: 'What happens to the faulting instruction after the page is loaded?',
        options: ['It is restarted', 'It is skipped', 'It is deleted', 'The process is always killed'],
        answer: 0,
        explanation:
          'The instruction is restarted so the access can complete now that the page is present.',
      },
    ],
  },

  {
    chapterId: 'fifo-page-replacement',
    plainEnglish: 'FIFO evicts the page that has been on the desk the longest, like clearing the oldest note first.',
    walkthrough: {
      kind: 'page-replacement',
      references: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
      frameCount: 3,
      defaultPolicy: 'FIFO',
    },
    hook:
      'FIFO evicts the page that has been in memory the longest. It is easy to implement and surprisingly capable of making the wrong decision.',
    objectives: [
      'Trace FIFO replacement on a reference string.',
      'Count page faults and hits.',
      'Explain Belady\'s anomaly.',
      'Know FIFO\'s strengths and weaknesses.',
    ],
    sections: [
      {
        title: 'The algorithm',
        body:
          'Keep pages in a queue in arrival order. On a fault with no free frame, remove the page at the front, load the new page, and put it at the back. On a hit, the queue order does not change. FIFO ignores how recently or how often a page was used.',
        code: String.raw`on fault:
    if free_frame: frame = free_frame
    else: frame = queue.pop_front()
    load(page, frame)
    queue.push_back(page)`,
      },
      {
        title: 'Worked reference string',
        body:
          'Use three frames and the reference string 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5. The first three references fault and fill the frames. Reference 4 evicts 1. Reference 1 evicts 2. Reference 2 evicts 3. Reference 5 evicts 4. References 1 and 2 hit. Reference 3 evicts 1. Reference 4 evicts 2, and reference 5 hits. FIFO produces 9 faults.',
        code: String.raw`ref: 1 2 3 4 1 2 5 1 2 3 4 5
faults: F F F F F F F . . F F .
frames after each step are in the lab trace`,
      },
      {
        title: 'Belady\'s anomaly',
        body:
          'Normally more frames should mean fewer faults. FIFO can violate this: for some reference strings, increasing the number of frames increases the number of page faults. This is Belady\'s anomaly. It happens because FIFO does not respect the stack property that LRU has. If an algorithm is a stack algorithm, adding frames can never increase faults.',
      },
    ],
    keyTakeaways: [
      'FIFO evicts the oldest resident page.',
      'A hit does not change the queue order.',
      'FIFO is simple but ignores usage recency.',
      'FIFO can suffer Belady\'s anomaly.',
      'Stack algorithms such as LRU do not.',
    ],
    pitfalls: [
      'Moving a page to the back on a hit; FIFO does not do that.',
      'Counting a hit as a fault.',
      'Assuming more frames always reduce FIFO faults.',
    ],
    focusPoints: [
      'Trace the frame queue after every reference.',
      'Count faults and hits separately.',
      'Explain Belady\'s anomaly with a concrete reference string.',
    ],
    quiz: [
      {
        question: 'Which page does FIFO evict?',
        options: ['The most recently used page', 'The oldest resident page', 'The page used farthest in the future', 'A random page'],
        answer: 1,
        explanation:
          'FIFO evicts the page that has been in memory the longest, regardless of how recently it was used.',
      },
      {
        question: 'What is Belady\'s anomaly?',
        options: [
          'More frames can cause more page faults under FIFO',
          'Fewer frames always cause fewer faults',
          'FIFO always performs optimally',
          'LRU cannot use a stack',
        ],
        answer: 0,
        explanation:
          'FIFO can produce more faults when given more frames, which is Belady\'s anomaly.',
      },
    ],
  },

  {
    chapterId: 'lru-optimal-page-replacement',
    plainEnglish: 'LRU guesses the future from the past. Optimal peeks at the future.',
    walkthrough: {
      kind: 'page-replacement',
      references: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
      frameCount: 3,
      defaultPolicy: 'LRU',
    },
    hook:
      'LRU uses the past as a predictor of the future. Optimal uses the future directly. Comparing them tells you how much a real policy gives up.',
    objectives: [
      'Trace LRU replacement on a reference string.',
      'Trace Optimal replacement on the same string.',
      'Compare the fault counts.',
      'Explain why Optimal is only a benchmark.',
    ],
    sections: [
      {
        title: 'LRU',
        body:
          'LRU evicts the page that has not been used for the longest time. On every hit, the page becomes the most recently used. On a fault, the least recently used page leaves. LRU approximates locality and is a stack algorithm, so it does not suffer Belady\'s anomaly. Exact LRU is expensive to implement; real systems approximate it with reference bits or clock hands.',
        code: String.raw`on access(page):
    move page to most-recent position

on fault:
    victim = least-recent page
    evict(victim)
    insert(new_page)`,
      },
      {
        title: 'Optimal replacement',
        body:
          'Optimal evicts the page that will not be used for the longest time in the future. It produces the minimum possible number of faults for a given reference string and frame count. It cannot be implemented online because it needs future knowledge, but it is the benchmark against which real policies are measured.',
      },
      {
        title: 'Comparing the policies',
        body:
          'Use the classic reference string 7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1 with three frames. FIFO gives 15 faults. LRU gives 12, and Optimal gives 9. The exact counts depend on the string, but the pattern is typical: Optimal is best, LRU is close, and FIFO can be noticeably worse.',
        code: String.raw`same reference string, 3 frames:
FIFO    -> 15 faults
LRU     -> 12 faults
Optimal ->  9 faults`,
      },
    ],
    keyTakeaways: [
      'LRU evicts the least recently used page.',
      'LRU is a stack algorithm and avoids Belady\'s anomaly.',
      'Optimal evicts the page used farthest in the future.',
      'Optimal is a benchmark, not an online algorithm.',
      'LRU is usually much better than FIFO and close to Optimal.',
    ],
    pitfalls: [
      'Updating recency on a fault but not on a hit.',
      'Thinking Optimal can be implemented with future knowledge.',
      'Assuming LRU always matches Optimal.',
    ],
    focusPoints: [
      'Maintain recency order after every access.',
      'Trace Optimal by scanning the future string.',
      'Compare the final fault counts.',
    ],
    quiz: [
      {
        question: 'Which page does LRU evict?',
        options: ['The oldest resident page', 'The least recently used page', 'The page used farthest in the future', 'The largest page'],
        answer: 1,
        explanation:
          'LRU evicts the page that has gone the longest without being referenced.',
      },
      {
        question: 'Why can Optimal not be used in a real system?',
        options: ['It needs future knowledge of page references', 'It uses too much disk', 'It cannot handle hits', 'It always causes Belady\'s anomaly'],
        answer: 0,
        explanation:
          'Optimal needs to know which page will be used last in the future, which is unavailable online.',
      },
    ],
  },

  {
    chapterId: 'thrashing-working-set',
    plainEnglish: 'Thrashing is running between the desk and the shelf so much that no reading gets done.',
    hook:
      'When the working sets of running processes do not fit in memory, the system spends its life paging. That is thrashing: the CPU is busy, but no useful work is happening.',
    objectives: [
      'Define thrashing and its symptoms.',
      'Explain the working-set model.',
      'Relate degree of multiprogramming to page faults.',
      'Know the common controls for thrashing.',
    ],
    sections: [
      {
        title: 'The failure loop',
        body:
          'A process faults, so the kernel evicts a page. That page belongs to another active process, which faults soon after. The kernel evicts another page, and the cycle repeats. Disk I/O dominates, CPU utilization collapses, and the scheduler may add more processes because the CPU looks idle, making everything worse.',
      },
      {
        title: 'The working set',
        body:
          'The working set is the set of pages a process has referenced in a recent window. If the sum of all working sets is larger than physical memory, thrashing is likely. The OS can reduce the degree of multiprogramming, admit fewer processes, or allocate more frames to the processes that need them.',
        code: String.raw`working_set(process, window) =
    pages referenced in the last window of time

if sum(working_sets) > physical_frames:
    reduce multiprogramming`,
      },
      {
        title: 'Controls',
        body:
          'A page-fault-frequency policy monitors each process\'s fault rate. If the rate is too high, the process needs more frames; if it is too low, it may have too many. The OS can also use a working-set policy to suspend processes whose working sets cannot fit. Adding RAM is the direct fix, but it is not always possible.',
      },
    ],
    keyTakeaways: [
      'Thrashing is excessive paging with little useful work.',
      'It happens when working sets exceed physical memory.',
      'Adding more processes can make thrashing worse.',
      'Working-set and page-fault-frequency policies control it.',
      'Reducing multiprogramming is a common emergency response.',
    ],
    pitfalls: [
      'Thinking high CPU utilization always means useful work; thrashing can show high kernel activity.',
      'Adding processes when the system is already thrashing.',
      'Confusing a high page-fault rate with a normal cold start.',
    ],
    focusPoints: [
      'Explain the thrashing feedback loop.',
      'Define the working set.',
      'Name two controls for thrashing.',
    ],
    quiz: [
      {
        question: 'What is thrashing?',
        options: [
          'Spending most time handling page faults',
          'Running too many CPU-bound processes',
          'Deleting too many files',
          'Using too many interrupts',
        ],
        answer: 0,
        explanation:
          'Thrashing occurs when the system spends most of its time paging instead of executing useful work.',
      },
      {
        question: 'What often happens if the scheduler adds more processes during thrashing?',
        options: ['The situation gets worse', 'It always fixes the problem', 'Page faults disappear', 'Memory usage shrinks'],
        answer: 0,
        explanation:
          'More processes increase the total working set, causing even more faults.',
      },
    ],
  },
];
