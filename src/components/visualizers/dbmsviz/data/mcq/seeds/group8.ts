import type { DBMSProblemSeed } from '../types';

export const group8Seeds: DBMSProblemSeed[] = [
  // fragmentation-replication
  {
    chapterId: 'fragmentation-replication',
    title: 'Splitting Rows Across Sites',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which fragmentation strategy stores a subset of a table\'s rows at each site, typically selected by a predicate such as region?',
    options: [
      'Vertical fragmentation',
      'Replication',
      'Horizontal fragmentation',
      'Mixed fragmentation',
    ],
    answer: 2,
    explanation:
      'Horizontal fragmentation applies a predicate to rows, so each site holds a complete row for a different subset of customers.',
    hint: 'Ask whether the split follows rows or columns.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Splitting Columns Across Sites',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Vertical fragmentation divides a relation by doing what?',
    options: [
      'Copying every row to each site',
      'Distributing groups of columns to different sites',
      'Partitioning rows by region',
      'Splitting the transaction log',
    ],
    answer: 1,
    explanation:
      'Vertical fragmentation groups columns, often keeping frequently queried columns together and moving large, rarely used columns elsewhere.',
    hint: 'Think of projecting different column sets.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Rebuilding Horizontal Fragments',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which relational operation reconstructs the original relation from complete horizontal fragments?',
    options: ['Join on the primary key', 'Projection', 'Set difference', 'Union'],
    answer: 3,
    explanation:
      'Each horizontal fragment holds whole rows, so union combines them; join would be needed only if columns had been split.',
    hint: 'The fragments share the same schema.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Rebuilding Vertical Fragments',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'How are vertical fragments normally reconstructed into the original relation?',
    options: [
      'Join the fragments on the shared primary key',
      'Union the fragments',
      'Take the Cartesian product',
      'Apply selection to each fragment',
    ],
    answer: 0,
    explanation:
      'Each vertical fragment carries the key, so joining on it restores the full rows; union would mismatch unrelated column sets.',
    hint: 'The fragments share a key, not the same schema.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Why the Key Appears in Every Vertical Fragment',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why must every vertical fragment include the primary key?',
    options: [
      'To enforce domain integrity',
      'To satisfy first normal form',
      'To reduce storage overhead',
      'To make lossless reconstruction by join possible',
    ],
    answer: 3,
    explanation:
      'Without the key, rows from different column fragments cannot be matched, so the original relation could not be rebuilt correctly.',
    hint: 'Consider how the database would pair a name with its blob.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'What Replication Stores',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does replication store at multiple sites?',
    options: [
      'Copies of the same data',
      'A different row subset at each site',
      'A different column subset at each site',
      'Only index pages',
    ],
    answer: 0,
    explanation:
      'Replication keeps duplicate copies of the same tuples, unlike fragmentation, which divides rows or columns among sites.',
    hint: 'The copies are identical in content.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Read Scaling with Replicas',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the main benefit of replication for a read-heavy product catalogue?',
    options: [
      'It removes the need for a primary key',
      'It guarantees zero stale reads',
      'It spreads read load and reduces latency',
      'It eliminates write conflicts',
    ],
    answer: 2,
    explanation:
      'Multiple copies let reads be served nearby and in parallel; writes still need propagation, so replication does not remove write conflicts.',
    hint: 'Many readers, few writers.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Synchronous Replication Cost',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the direct cost of synchronous replication?',
    options: [
      'Reads always return stale data',
      'Commits no longer survive crashes',
      'Fragments become incomplete',
      'Writes wait for replica acknowledgement',
    ],
    answer: 3,
    explanation:
      'A commit must wait until the required replicas confirm the write, which raises write latency across the network.',
    hint: 'The client cannot finish until the copies confirm.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Regional Storefront Split',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Northwind Retail stores customer records in one table. EU staff query only EU customers, and Asia staff query only Asian customers; each region writes its own records.',
    prompt: 'Which distribution design best localizes these accesses?',
    options: [
      'Vertical fragmentation by column groups',
      'Horizontal fragmentation by region',
      'Full replication at every office',
      'No fragmentation or replication',
    ],
    answer: 1,
    explanation:
      'Region is a row predicate, so horizontal fragments place customers from each region locally; full replication would copy every row everywhere.',
    hint: 'The natural boundary is a customer attribute that filters rows.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Meaning of Fragment Completeness',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does completeness require of a fragmentation design?',
    options: [
      'Every tuple of the original relation appears in at least one fragment',
      'Every fragment has the same number of rows',
      'Every fragment contains every column',
      'Every fragment is stored at every site',
    ],
    answer: 0,
    explanation:
      'Completeness guarantees no data is lost when the fragments are combined; equal sizes and full columns are not required.',
    hint: 'Nothing from the original table may go missing.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Horizontal Fragment Disjointness',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'For horizontal fragments, what does disjointness mean?',
    options: [
      'Fragments use different schemas',
      'Every fragment is replicated twice',
      'No tuple appears in more than one fragment',
      'Each fragment has a separate primary key',
    ],
    answer: 2,
    explanation:
      'Disjoint horizontal fragments avoid duplicate rows; overlapping predicates would place the same tuple in multiple fragments.',
    hint: 'Think about duplicate membership of a row.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Logistics Data at the Edge',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'Atlas Logistics wants each regional office to read and write only its own shipments, avoiding cross-region traffic for routine work. Corporate analysts still need a global view.',
    prompt: 'Which plan best serves both needs?',
    options: [
      'Replicate the entire shipment table to every office',
      'Vertically split the shipment notes column',
      'Store all shipments in one central site only',
      'Horizontally fragment shipments by region, then feed a global warehouse',
    ],
    answer: 3,
    explanation:
      'Local row fragments handle regional writes, while periodic loading into a warehouse gives analysts the global view without cross-region reads.',
    hint: 'Separate operational locality from analytical consolidation.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Derived Horizontal Fragmentation',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Derived horizontal fragmentation partitions a relation using what?',
    options: [
      'Predicates defined on another relation that it joins with',
      'The physical order of its rows',
      'A hash of every column value',
      'The number of replicas at each site',
    ],
    answer: 0,
    explanation:
      'The fragment predicate comes from a related table, such as splitting orders according to which customer region owns them.',
    hint: 'The splitting rule lives in a related table.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Hot Columns and a Cold Blob',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'The customer table at Meridian Bank is queried mostly for id, name, and email. A large KYC document blob is read only during audits, and the table is very wide.',
    prompt: 'Which vertical fragmentation is most sensible?',
    options: [
      'Split rows by customer region',
      'Keep one hot fragment with id, name, and email, and one cold fragment with id and the blob',
      'Replicate the entire table to every branch',
      'Move the primary key out of both fragments',
    ],
    answer: 1,
    explanation:
      'Separating frequently read columns from the large blob keeps hot pages compact; repeating customer_id in both fragments preserves joinability.',
    hint: 'Group columns by access frequency, but keep the key.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Catalogue Reads Worldwide',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'Orbit Media serves a product catalogue from six regions. Writes occur hourly, reads dominate, and users tolerate a few seconds of staleness.',
    prompt: 'Which replication strategy fits best?',
    options: [
      'Asynchronous replication to regional read replicas',
      'Synchronous replication to every region for every write',
      'Vertical fragmentation of product descriptions',
      'No replication, with all reads sent to one site',
    ],
    answer: 0,
    explanation:
      'Async replicas absorb read traffic locally without making every hourly write wait for six regions; brief staleness is explicitly acceptable.',
    hint: 'Match the consistency requirement to the stated tolerance.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Write Amplification Under Replication',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Sending every inventory update to five synchronous replicas primarily increases which cost?',
    options: [
      'Read latency only',
      'The number of dimension tables',
      'Primary-key duplication',
      'Write amplification and commit latency',
    ],
    answer: 3,
    explanation:
      'Each logical write becomes six physical writes and the commit waits for acknowledgements, so both write volume and latency rise.',
    hint: 'Count the physical writes caused by one update.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Slow Checkout Across Continents',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A checkout service writes to a primary in Frankfurt and waits for a synchronous replica in Sydney. The network round trip is 300 ms, and customers complain about slow payments.',
    prompt: 'What is the most direct cause of the added checkout latency?',
    options: [
      'The fragments are incomplete',
      'The primary key is too wide',
      'The commit waits for the Sydney acknowledgement',
      'Vertical fragmentation duplicated the rows',
    ],
    answer: 2,
    explanation:
      'Synchronous replication makes commit latency include the intercontinental round trip; fragmentation and key width do not explain the fixed 300 ms wait.',
    hint: 'Identify which step must finish before the commit returns.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Why Quorums Overlap',
    difficulty: 'Medium',
    type: 'mcq',
    context:
      'A key is stored on three replicas. Writes must be acknowledged by two replicas, and reads contact two replicas.',
    prompt: 'Why is a read guaranteed to see the latest committed write?',
    options: [
      'The read quorum and write quorum must intersect',
      'Reads always contact every replica',
      'The write quorum equals all three replicas',
      'Replicas never fail during a read',
    ],
    answer: 0,
    explanation:
      'With R + W greater than N, any read set overlaps the write set, so at least one node supplies the newest value.',
    hint: 'Use the quorum inequality with N = 3.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Where Stale Reads Are Acceptable',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which workload best tolerates eventually consistent reads?',
    options: [
      'Interbank settlement of a transfer',
      'Seat assignment during checkout',
      'Inventory reservation for a flash sale',
      'View counts on a video page',
    ],
    answer: 3,
    explanation:
      'A view counter can lag briefly without harming anyone, whereas money, seats, and stock require immediate agreement.',
    hint: 'Pick the value whose temporary inaccuracy has no business consequence.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Placing Replicas Near Readers',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A news site has 90% of its readers in Europe and 10% in Asia. Its primary write site is in Europe, and articles are edited a few times per day.',
    prompt: 'Where should read replicas be placed?',
    options: [
      'One large replica in Asia only',
      'Replicas in both Europe and Asia, with Europe carrying most capacity',
      'One replica at every editor desk',
      'No replicas; keep a single server in Europe',
    ],
    answer: 1,
    explanation:
      'Replica placement should follow read demand, so both regions need copies, with capacity weighted toward the larger European audience.',
    hint: 'Follow the distribution of readers, not the writers.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Mixed Fragmentation',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is mixed fragmentation?',
    options: [
      'Replicating only the primary key',
      'Splitting a table into rows only',
      'Combining horizontal and vertical fragmentation in one design',
      'Storing every fragment at every site',
    ],
    answer: 2,
    explanation:
      'A mixed design might first split customers by region and then split each regional fragment into hot and cold columns.',
    hint: 'Two fragmentation directions can be composed.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Overlapping Regional Predicates',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      "A team fragments orders into region = 'EU' and region = 'EU-EXPORT'. Some orders satisfy both predicates, so they are stored in both fragments.",
    prompt: 'Which fragmentation property is violated?',
    options: ['Completeness', 'Reconstructibility', 'Referential integrity', 'Disjointness'],
    answer: 3,
    explanation:
      'Disjointness fails because one tuple belongs to two fragments; completeness still holds, since every order is represented somewhere.',
    hint: 'The problem is duplicate membership, not missing data.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Serving Reads During a Partition',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An online store replicates product data asynchronously. A network partition isolates the primary, and a replica in another region keeps serving reads with prices from last night.',
    prompt: 'Which trade-off has the system made?',
    options: [
      'Consistency over availability',
      'Availability over freshness',
      'Durability over atomicity',
      'Fragmentation over replication',
    ],
    answer: 1,
    explanation:
      'The isolated replica stays available by serving older data, which is the availability side of the CAP choice; it does not preserve freshness.',
    hint: 'Ask what the replica sacrifices to keep answering requests.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Two Masters, One Price',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A retailer runs multi-master replication in two regions. Both regions update the same product price within seconds, and last-write-wins is the conflict rule.',
    prompt: 'What is the main risk of this design?',
    options: [
      'Reads become impossible',
      'The primary key disappears',
      'Fragments cannot be joined',
      'A legitimate update can be silently overwritten',
    ],
    answer: 3,
    explanation:
      'Last-write-wins resolves conflicts by discarding one version, so a valid price change can vanish without an error or reconciliation.',
    hint: 'Think about what happens to the losing concurrent write.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Lossless Vertical Reconstruction',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'A vertical fragmentation omits customer_id from the fragment holding credit_limit. What is the consequence?',
    options: [
      'The fragment can still be joined by customer name',
      'Storage doubles automatically',
      'The original rows cannot be reconstructed reliably',
      'The table becomes horizontally fragmented',
    ],
    answer: 2,
    explanation:
      'Without the key, credit limits cannot be matched to the correct customers, so the decomposition is not lossless; names are not guaranteed unique.',
    hint: 'Find the attribute needed to pair rows again.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Derived Fragmentation for Orders',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Orders are split by the region of the customer who placed them. The customer table is fragmented by region, and the orders table has customer_id but no region column.',
    prompt: 'How should the orders fragment predicate be expressed?',
    options: [
      'Hash the order total',
      'Use the order date only',
      'Join or semijoin orders to the regional customer fragment',
      'Replicate every order to all regions',
    ],
    answer: 2,
    explanation:
      'The order rows must be matched to customers in the target region, so a semijoin against that customer fragment defines membership.',
    hint: 'The region lives in the customer fragment, not in orders.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Quorum Arithmetic',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'With five replicas, which read and write quorums guarantee overlap?',
    options: ['R = 3, W = 3', 'R = 1, W = 1', 'R = 2, W = 2', 'R = 1, W = 4'],
    answer: 0,
    explanation:
      'Strong overlap requires R + W greater than 5; only 3 + 3 satisfies it, while the others sum to 4 or less.',
    hint: 'Add the quorums and compare with the replica count.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Partition Choice for Payments',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A payments database is synchronous across two data centers. During a partition, the minority site stops accepting writes rather than risk divergent balances.',
    prompt: 'Which CAP posture is this system choosing?',
    options: [
      'AP, because both sites accept writes',
      'CA, because partitions never occur',
      'CP, because it preserves consistency by refusing writes',
      'Neither C nor A, because it stops all traffic',
    ],
    answer: 2,
    explanation:
      'The minority site rejects writes to avoid inconsistency, which is the consistent-and-partition-tolerant choice; availability is sacrificed.',
    hint: 'Which property is protected by rejecting the write?',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Replica Placement for Mixed Workload',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A ticketing platform has heavy reads in three regions but all seat allocations must be serialized at one primary. Read replicas lag by under a second.',
    prompt: 'Which design best balances the requirements?',
    options: [
      'Multi-master writes in all three regions',
      'A single write primary with read replicas in each region',
      'Synchronous writes to all three regions for every read',
      'Vertical fragmentation of the seat table',
    ],
    answer: 1,
    explanation:
      'Keeping one primary preserves serialized allocation, while regional replicas absorb read traffic; multi-master would create conflicting seat sales.',
    hint: 'Separate the single-writer requirement from read locality.',
  },
  {
    chapterId: 'fragmentation-replication',
    title: 'Concurrent Profile Edits',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A social app uses multi-master replication for user profiles. Two devices update the same biography field offline, then sync different text versions.',
    prompt: 'Which mechanism best handles this conflict without losing user intent?',
    options: [
      'Silently apply last-write-wins on the server clock',
      'Drop both updates and reset the field',
      'Replicate the field synchronously to every device',
      'Keep both versions and merge or surface them for resolution',
    ],
    answer: 3,
    explanation:
      'Preserving both versions allows a merge or user choice; silent last-write-wins can discard a genuine edit and hide the conflict.',
    hint: 'Consider whether either version can safely be thrown away.',
  },

  // data-warehousing
  {
    chapterId: 'data-warehousing',
    title: 'Which ETL Stage Cleans Data?',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'An ETL pipeline standardizes date formats and removes duplicate customer records before populating the warehouse.',
    prompt: 'Which ETL stage performs this cleaning and conforming work?',
    options: ['Extract', 'Transform', 'Load', 'Index'],
    answer: 1,
    explanation:
      'The transform stage cleans, conforms, and derives values before the data is loaded into the warehouse.',
    hint: 'It happens after extraction but before loading.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'OLTP Workload Shape',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which processing style handles many small concurrent transactions?',
    options: [
      'Few large scans over years of history',
      'Bulk imports with no concurrency',
      'Many short reads and writes touching few rows',
      'One nightly aggregation job only',
    ],
    answer: 2,
    explanation:
      'OLTP handles frequent small transactions, such as taking an order or updating a balance, with high concurrency.',
    hint: 'Think of a cashier processing one sale at a time.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'OLAP Workload Shape',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which processing style scans large historical datasets for aggregation?',
    options: [
      'Single-row lookups by primary key',
      'Large scans and aggregations over historical data',
      'Frequent tiny updates from checkout terminals',
      'Short inserts with immediate commit',
    ],
    answer: 1,
    explanation:
      'OLAP queries summarize large historical datasets, often grouping by dimensions such as region and quarter.',
    hint: 'Reports usually touch many rows and few columns.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Centre of a Star Schema',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What sits at the centre of a star schema?',
    options: ['A dimension table', 'A staging table', 'An index', 'A fact table'],
    answer: 3,
    explanation:
      'The fact table holds measures and foreign keys, while dimension tables surround it and provide descriptive context.',
    hint: 'It stores the numbers being analyzed.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Purpose of a Dimension',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is the main purpose of a dimension table in a warehouse?',
    options: [
      'To provide descriptive context for filtering and grouping facts',
      'To store every transaction amount',
      'To replace the fact table',
      'To hold only primary keys',
    ],
    answer: 0,
    explanation:
      'Dimensions describe the who, what, where, and when, enabling analysts to slice facts by product, store, or date.',
    hint: 'Think labels rather than measurements.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Contents of a Fact Table',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'A typical fact table row contains which combination?',
    options: [
      'Only descriptive text fields',
      'Only surrogate keys with no numbers',
      'Measures plus foreign keys to dimensions',
      'One full copy of each source table',
    ],
    answer: 2,
    explanation:
      'Each fact row records a measurement at a declared grain and points to the dimensions that describe that event.',
    hint: 'Numbers plus references to descriptive tables.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'What Is a Data Mart?',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is a data mart?',
    options: [
      'A backup copy of the OLTP database',
      'A focused analytical subset for one department or subject',
      'A tool that extracts source data',
      'A normalized transactional schema',
    ],
    answer: 1,
    explanation:
      'A data mart serves a narrower audience, such as finance or sales, and may be independent or fed from the central warehouse.',
    hint: 'Smaller scope than the enterprise warehouse.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Why a Warehouse Is Separate',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Why do organizations usually keep a warehouse separate from operational systems?',
    options: [
      'To avoid backing up transactional data',
      'To store only current-day data',
      'To eliminate the need for ETL',
      'To run heavy analysis without slowing transactions',
    ],
    answer: 3,
    explanation:
      'Analytical scans can consume enormous resources, so separating them protects OLTP response times and allows historical retention.',
    hint: 'Consider what a month-end report does to a checkout database.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Roll-Up Operation',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the OLAP roll-up operation do?',
    options: [
      'Adds more detail to each fact',
      'Deletes old partitions',
      'Aggregates data to a coarser level',
      'Randomly samples rows',
    ],
    answer: 2,
    explanation:
      'Roll-up moves from finer to coarser granularity, such as summarizing daily sales into monthly totals.',
    hint: 'The opposite of drill-down.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Grain of a Fact Table',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the grain of a fact table define?',
    options: [
      'The level of detail represented by one fact row',
      'The number of dimension tables',
      'The storage block size',
      'The primary key data type',
    ],
    answer: 0,
    explanation:
      'Grain states exactly what one row means, such as one product per store per day, and every measure must fit that level.',
    hint: 'Ask what a single row represents.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Month-End Reports Slow Checkout',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A retailer runs large month-end sales reports directly on its order database. During reporting, checkout latency spikes and customers abandon purchases.',
    prompt: 'Which architectural change best addresses the problem?',
    options: [
      'Add more indexes to the order database',
      'Load order data into a warehouse and run reports there',
      'Move the reports to the checkout terminals',
      'Delete historical orders to shrink the tables',
    ],
    answer: 1,
    explanation:
      'A warehouse isolates heavy analytical scans from transaction processing; more indexes would still let reports compete for the same resources.',
    hint: 'Separate the analytical workload from the operational one.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Simple Sales Dashboard',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A retail chain wants a first warehouse model for sales by product, store, and day. Analysts need simple, fast queries and can accept some duplicated product descriptions.',
    prompt: 'Which schema is the most direct fit?',
    options: [
      'A fully normalized OLTP schema',
      'A snowflake with five levels of product hierarchy',
      'A single flat file with no dimensions',
      'A star schema with one sales fact and product, store, and date dimensions',
    ],
    answer: 3,
    explanation:
      'A star schema keeps dimensions denormalized and joins simple, matching the stated tolerance for duplicated descriptive values.',
    hint: 'Match the model to simple queries and denormalized dimensions.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Star or Snowflake for Product Hierarchy',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A warehouse team must choose between a star and a snowflake for product data. Product descriptions repeat heavily in the star, while the snowflake adds category and department tables and more joins.',
    prompt: 'Which consideration should drive the choice?',
    options: [
      'The star is always faster for every query',
      'The snowflake always uses less storage',
      'Query simplicity versus dimension redundancy and join cost',
      'The number of source systems only',
    ],
    answer: 2,
    explanation:
      'The trade-off is denormalized simplicity against normalized storage and extra joins; neither schema wins universally.',
    hint: 'Name the cost each design is paying.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Normalizing a Product Chain',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A retailer stores product, category, and department in one dimension. Category depends on department, and the same category text repeats for thousands of products.',
    prompt: 'Which warehouse change reduces that redundancy?',
    options: [
      'Snowflake the product dimension into product, category, and department tables',
      'Move category into the fact table',
      'Add a second fact table for categories',
      'Delete the department attribute',
    ],
    answer: 0,
    explanation:
      'Snowflaking normalizes the hierarchy into linked dimension tables, reducing repeated text at the cost of additional joins.',
    hint: 'Normalize the dimension, not the measurements.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Classifying a Warehouse Column',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'In a sales warehouse, which attribute is a dimension rather than a measure?',
    options: ['Revenue', 'Units sold', 'Discount amount', 'Store city'],
    answer: 3,
    explanation:
      'Store city describes where the sale happened, while revenue, units, and discount are numeric facts to aggregate.',
    hint: 'Ask whether the value is descriptive or additive.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Measures That Do Not Add Up',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which measure should not be summed across all dimensions?',
    options: ['Units sold', 'A profit margin percentage', 'Revenue', 'Order count'],
    answer: 1,
    explanation:
      'Percentages are non-additive; averaging margins across stores requires weighting by revenue, not simply adding the percentages.',
    hint: 'Consider what happens when two 50% margins are added.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'From Quarterly to Monthly',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An executive reviews quarterly revenue by region. She then asks for the same measure broken down by month within each quarter.',
    prompt: 'Which OLAP operation is she performing?',
    options: ['Drill-down', 'Roll-up', 'Pivot', 'Slice'],
    answer: 0,
    explanation:
      'Drill-down increases detail by moving from quarters to months; roll-up would move in the opposite, coarser direction.',
    hint: 'The new view has more detail, not less.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Slice Versus Dice',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What distinguishes dice from slice in OLAP?',
    options: [
      'Dice removes all dimensions',
      'Dice selects on two or more dimensions, while slice fixes one dimension',
      'Slice aggregates every measure',
      'Slice always returns one cell',
    ],
    answer: 1,
    explanation:
      'A slice typically fixes one dimension value, while a dice operation applies predicates across multiple dimensions to form a subcube.',
    hint: 'Count how many dimensions the filter touches.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Tracking a Customer Address History',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A customer changes city twice. Finance needs each order attributed to the city where the customer lived when the order was placed.',
    prompt: 'Which slowly changing dimension technique preserves this history?',
    options: [
      'Overwrite the old city in place',
      'Delete the customer row and reinsert it',
      'Store only the latest city in the fact table',
      'Add a new dimension row with validity dates and a current flag',
    ],
    answer: 3,
    explanation:
      'Type 2 slowly changing dimensions keep versioned rows with effective dates, so each fact can join to the version valid at its event time.',
    hint: 'The old version must remain available for historical joins.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Messy Country Values',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'Source systems store the country as US, USA, United States, and U.S.A. The warehouse needs one consistent value for regional reporting.',
    prompt: 'Which ETL step should fix this?',
    options: [
      'Extract more rows from the source',
      'Transform the values into a standard country code',
      'Load all variants and let analysts choose',
      'Skip the country dimension entirely',
    ],
    answer: 1,
    explanation:
      'Cleaning and conforming values is a transform responsibility; loading variants would preserve the inconsistency and break grouping.',
    hint: 'Which stage is allowed to change the data?',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Why Surrogate Keys',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why do warehouses often use surrogate keys for dimensions?',
    options: [
      'They encrypt the natural key',
      'They are always shorter than any natural key',
      'They insulate warehouse history from source-system key changes',
      'They remove the need for foreign keys',
    ],
    answer: 2,
    explanation:
      'A stable warehouse-generated key lets the warehouse keep its own version history even when source identifiers are reused or reformatted.',
    hint: 'Think about independence from operational systems.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Shared Product Dimension',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'The sales mart and inventory mart both report by product, but each defines product category differently, so totals disagree.',
    prompt: 'What is the best remedy?',
    options: [
      'Build one conformed product dimension shared by both marts',
      'Let each mart keep its own definition',
      'Remove product from both marts',
      'Join the marts only at report time',
    ],
    answer: 0,
    explanation:
      'Conformed dimensions give both marts the same category definitions, which is what makes cross-mart comparisons consistent.',
    hint: 'Agree once on the shared descriptive entity.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Nightly Load Getting Slower',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A warehouse reloads every fact row each night. The source adds millions of rows per day, and the load window is now too short.',
    prompt: 'Which change is most appropriate?',
    options: [
      'Drop all warehouse indexes',
      'Switch to incremental loads based on changed or new rows',
      'Load only on the first day of each month',
      'Move the warehouse onto the OLTP server',
    ],
    answer: 1,
    explanation:
      'Incremental loading processes only new or changed data, shrinking the nightly window; dropping indexes or loading monthly would harm freshness or queries.',
    hint: 'Avoid reprocessing data that has not changed.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Role of a Staging Area',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'What is a staging area used for in an ETL pipeline?',
    options: [
      'Serving final dashboards to executives',
      'Storing only archived backups',
      'Holding extracted data for cleaning and validation before load',
      'Replacing the warehouse fact tables',
    ],
    answer: 2,
    explanation:
      'Staging isolates raw extracted data so transformations and quality checks can run before anything reaches the curated warehouse.',
    hint: 'It sits between source extraction and the warehouse load.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Why Declare Grain First',
    difficulty: 'Hard',
    type: 'mcq',
    context:
      'A team designs a sales fact table without agreeing whether a row is one order or one order line. Revenue totals later disagree between reports.',
    prompt: 'What is the root design error?',
    options: [
      'Too many dimensions',
      'Missing surrogate keys',
      'An undefined or inconsistent grain',
      'Using a star instead of a snowflake',
    ],
    answer: 2,
    explanation:
      'Different reports assume different row meanings, so sums double-count or miss lines; the grain must be fixed before measures are chosen.',
    hint: 'Ask what one fact row is supposed to represent.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Factless Fact Tables',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What is a factless fact table used for?',
    options: [
      'Storing dimension text without keys',
      'Recording events or coverage when there is no numeric measure',
      'Replacing every dimension table',
      'Compressing the warehouse',
    ],
    answer: 1,
    explanation:
      'A factless table can record attendance, eligibility, or promotion coverage using only dimension keys, enabling counts of events.',
    hint: 'Some events matter even when no amount is recorded.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Late-Arriving Product',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A sale arrives in the warehouse before its new product appears in the nightly product feed. The load must still complete without losing the sale.',
    prompt: 'Which approach is most robust?',
    options: [
      'Reject the sale until the product appears',
      'Create a placeholder dimension row and update it when the product arrives',
      'Drop the product key from the fact table',
      'Duplicate the sale into every product category',
    ],
    answer: 1,
    explanation:
      'A placeholder or inferred dimension member preserves the fact immediately and can be reconciled later when the real attributes arrive.',
    hint: 'Do not block the fact load on a missing description.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Historical Accuracy in SCD Type 2',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A customer dimension uses type 2 rows with start and end dates. An order from March is joined to the dimension using the current date rather than the order date.',
    prompt: 'What is the likely result?',
    options: [
      'The order disappears',
      'The join returns every historical version',
      'The fact table is normalized',
      'The order is attributed to the customer version current today, not in March',
    ],
    answer: 3,
    explanation:
      'Type 2 joins must use the fact event date within the validity range; using the current date picks the latest version and distorts history.',
    hint: 'Which date belongs in the between condition?',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Pre-Aggregated Monthly Sales',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'Most dashboard queries ask for monthly revenue by region, but a few auditors need individual transactions. The raw fact table is enormous.',
    prompt: 'Which design serves both groups efficiently?',
    options: [
      'Keep raw facts and add an aggregate table for common monthly queries',
      'Keep only the monthly aggregate table',
      'Delete raw facts older than one day',
      'Replace the warehouse with a transaction log',
    ],
    answer: 0,
    explanation:
      'Aggregates accelerate repeated summaries while raw facts remain for drill-through and audit; keeping only aggregates would destroy detail.',
    hint: 'Do not force every query to scan the finest grain.',
  },
  {
    chapterId: 'data-warehousing',
    title: 'Safe ETL Reruns',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A nightly load fails halfway. The operator reruns the same job, and some orders are now counted twice because the job inserts without checking prior loads.',
    prompt: 'Which fix makes the load safe to rerun?',
    options: [
      'Sort the source rows before loading',
      'Add more staging disk',
      'Make the load idempotent using keys, upserts, or partition replacement',
      'Run the job only once and never retry',
    ],
    answer: 2,
    explanation:
      'Idempotent loading ensures a repeated run produces the same warehouse state, preventing duplicate facts after a partial failure.',
    hint: 'The second run must not create a second copy of the same fact.',
  },

  // data-mining
  {
    chapterId: 'data-mining',
    title: 'Mining Versus Reporting',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What distinguishes data mining from an ordinary aggregate query?',
    options: [
      'Mining always runs faster',
      'Mining searches for hidden patterns or predictions rather than retrieving known data',
      'Mining cannot use a database',
      'Mining always returns exactly one row',
    ],
    answer: 1,
    explanation:
      'A normal query answers a known question with a precise predicate; mining discovers structure such as groups, rules, or predicted labels.',
    hint: 'One asks for numbers you already defined; the other looks for structure.',
  },
  {
    chapterId: 'data-mining',
    title: 'Classification Uses Labels',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does classification predict?',
    options: [
      'A discrete label learned from labeled examples',
      'Groups in unlabeled data',
      'Co-occurring item sets only',
      'The physical storage layout',
    ],
    answer: 0,
    explanation:
      'Classification learns a mapping from features to known categories, such as predicting whether a customer will churn.',
    hint: 'The training data already contains the target category.',
  },
  {
    chapterId: 'data-mining',
    title: 'Clustering Without a Target',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which technique groups records when no label column exists?',
    options: ['Classification', 'Regression', 'Clustering', 'Association rule mining'],
    answer: 2,
    explanation:
      'Clustering uses similarity in the features to form groups, so no predefined target is needed.',
    hint: 'No answer key is available during training.',
  },
  {
    chapterId: 'data-mining',
    title: 'Reading an Association Rule',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the rule {bread} → {butter} mean?',
    options: [
      'Bread causes butter to spoil',
      'Butter is always bought before bread',
      'Bread and butter are the same product',
      'Customers who buy bread often also buy butter',
    ],
    answer: 3,
    explanation:
      'The arrow expresses co-occurrence: bread appears in the antecedent and butter in the consequent, with strength measured by support and confidence.',
    hint: 'It is about baskets, not causality.',
  },
  {
    chapterId: 'data-mining',
    title: 'Regression Target',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What kind of value does regression predict?',
    options: [
      'A category with no order',
      'A numeric value such as revenue or demand',
      'A cluster identifier',
      'A transaction log record',
    ],
    answer: 1,
    explanation:
      'Regression estimates a continuous quantity, such as monthly revenue or demand, unlike classification, which predicts a class.',
    hint: 'Think of a quantity on a number line.',
  },
  {
    chapterId: 'data-mining',
    title: 'Anomaly Detection',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What is anomaly detection used for?',
    options: [
      'Normalizing dimension tables',
      'Compressing historical data',
      'Finding unusual records that differ from expected behavior',
      'Replacing association rules',
    ],
    answer: 2,
    explanation:
      'It flags rare or unexpected events, such as a credit-card charge that looks unlike the normal pattern for that card.',
    hint: 'The goal is the odd record, not the average one.',
  },
  {
    chapterId: 'data-mining',
    title: 'Why Hold Out Data',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why is a model evaluated on a test set it did not train on?',
    options: [
      'To estimate performance on unseen data',
      'To increase training accuracy',
      'To remove missing values',
      'To make the model smaller',
    ],
    answer: 0,
    explanation:
      'Held-out data measures generalization; training accuracy can be high simply because the model memorized the examples.',
    hint: 'You want evidence about future records.',
  },
  {
    chapterId: 'data-mining',
    title: 'Support in One Sentence',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the support of an itemset measure?',
    options: [
      'How confident the rule is',
      'The fraction of transactions containing the itemset',
      'The number of distinct products in the store',
      'The lift over a random guess',
    ],
    answer: 1,
    explanation:
      'Support is the frequency of the itemset in the whole dataset, computed as transactions containing it divided by total transactions.',
    hint: 'It is a share of all baskets.',
  },
  {
    chapterId: 'data-mining',
    title: 'Confidence in One Sentence',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'What does the confidence of {A} → {B} measure?',
    options: [
      'The share of all transactions containing B',
      'The number of items in A',
      'The share of A transactions that also contain B',
      'The profit from selling B',
    ],
    answer: 2,
    explanation:
      'Confidence conditions on the antecedent: among baskets with A, it is the proportion that also contain B.',
    hint: 'The denominator is the antecedent count.',
  },
  {
    chapterId: 'data-mining',
    title: 'Unusual Card Charge',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A bank monitors card transactions. Most charges match where and how much a customer usually spends, but one card suddenly shows a large overseas purchase at 3 a.m.',
    prompt: 'Which mining task best describes flagging this event?',
    options: [
      'Classification into churn or loyal',
      'Clustering customers into segments',
      'Association rule discovery',
      'Anomaly detection',
    ],
    answer: 3,
    explanation:
      'The bank is identifying a record that deviates from normal behavior rather than assigning a predefined class or finding co-occurrence.',
    hint: 'The event is rare and unexpected, not a known category.',
  },
  {
    chapterId: 'data-mining',
    title: 'Predicting Who Will Leave',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A subscription company has two years of customers labeled as churned or retained, along with usage features. It wants to score current customers before renewal.',
    prompt: 'Which technique fits best?',
    options: [
      'Clustering',
      'Association rules',
      'Regression on the churn flag',
      'Classification',
    ],
    answer: 3,
    explanation:
      'The target is a known binary label and historical examples exist, which is exactly the setup for classification.',
    hint: 'The outcome is a category and the past is labeled.',
  },
  {
    chapterId: 'data-mining',
    title: 'Grouping Shoppers Without Segments',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A retailer has purchase behavior for 200,000 shoppers but no predefined segment labels. Marketing wants naturally similar groups for a campaign.',
    prompt: 'Which technique should it use first?',
    options: ['Clustering', 'Classification', 'Association rules', 'Regression'],
    answer: 0,
    explanation:
      'Clustering discovers groups from behavioral similarity when no target label exists; classification would require predefined segments.',
    hint: 'There is no answer key to learn from.',
  },
  {
    chapterId: 'data-mining',
    title: 'Computing Support',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A grocer analyzes 1,000 baskets. Bread appears in 200, and bread and butter appear together in 120.',
    prompt: 'What is the support of {bread, butter}?',
    options: ['20%', '12%', '60%', '6%'],
    answer: 1,
    explanation:
      'Support divides the 120 joint baskets by all 1,000 baskets, giving 0.12; 60% would be confidence, not support.',
    hint: 'Use the total number of baskets as the denominator.',
  },
  {
    chapterId: 'data-mining',
    title: 'Computing Confidence',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'Of 500 online orders, 100 include milk, and 40 include both milk and cereal.',
    prompt: 'What is the confidence of {milk} → {cereal}?',
    options: ['40%', '8%', '20%', '80%'],
    answer: 0,
    explanation:
      'Confidence is 40 joint orders divided by the 100 milk orders, or 40%; 8% is the support of the pair across all 500 orders.',
    hint: 'Condition on baskets that already contain milk.',
  },
  {
    chapterId: 'data-mining',
    title: 'When Confidence Misleads',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'A rule has 95% confidence but only 1% support. What is the main concern?',
    options: [
      'It is too complex to compute',
      'It proves causation',
      'It applies to almost every basket',
      'It affects too few transactions to be useful',
    ],
    answer: 3,
    explanation:
      'High confidence on a tiny antecedent can be real but commercially minor; support shows the rule covers very little of the business.',
    hint: 'Ask how many baskets the rule actually touches.',
  },
  {
    chapterId: 'data-mining',
    title: 'Great Training, Poor Field Results',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A churn model scores 98% on its training data but 61% on a held-out set. The team used hundreds of features and only 2,000 customers.',
    prompt: 'What is the most likely diagnosis?',
    options: [
      'Underfitting',
      'Data leakage in the test set',
      'Overfitting',
      'The target label is numeric',
    ],
    answer: 2,
    explanation:
      'The large train-test gap with many features on modest data signals memorization; underfitting would show poor results on both sets.',
    hint: 'Compare performance on seen and unseen data.',
  },
  {
    chapterId: 'data-mining',
    title: 'The 99% Accuracy Trap',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'Only 1% of transactions are fraudulent. A model that predicts not fraud for every transaction reports 99% accuracy.',
    prompt: 'Why is accuracy a poor summary here?',
    options: [
      'It ignores the majority class',
      'It hides that the model catches no fraud at all',
      'It penalizes false positives too heavily',
      'It requires a numeric target',
    ],
    answer: 1,
    explanation:
      'Accuracy is dominated by the majority class, so a useless model that never flags fraud still looks excellent; recall for fraud is zero.',
    hint: 'Ask what the model does with the rare class.',
  },
  {
    chapterId: 'data-mining',
    title: 'The Feature That Gives It Away',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A team predicts loan default using features including account_closed_date, which is recorded only after a loan has already defaulted.',
    prompt: 'What problem does this feature create?',
    options: [
      'It causes underfitting',
      'It reduces support',
      'It makes the model too simple',
      'It leaks the outcome into training',
    ],
    answer: 3,
    explanation:
      'A post-outcome field encodes the answer, so the model looks accurate in training but cannot be used before the outcome is known.',
    hint: 'Would this value exist at prediction time?',
  },
  {
    chapterId: 'data-mining',
    title: 'Classification or Regression',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which task predicts next month total revenue as a numeric amount?',
    options: ['Classification', 'Clustering', 'Regression', 'Association rules'],
    answer: 2,
    explanation:
      'The target is continuous, so regression is appropriate; classification predicts categories such as high, medium, or low.',
    hint: 'The output is a quantity, not a class.',
  },
  {
    chapterId: 'data-mining',
    title: 'Purpose of Cross-Validation',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why use k-fold cross-validation?',
    options: [
      'To train on the test set',
      'To eliminate all bias',
      'To estimate performance more reliably with limited data',
      'To guarantee the model is interpretable',
    ],
    answer: 2,
    explanation:
      'Rotating the holdout across folds gives several estimates instead of one, which is useful when data is scarce.',
    hint: 'One split can be lucky or unlucky.',
  },
  {
    chapterId: 'data-mining',
    title: 'Segments for a Campaign',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A marketing team wants to send different offers to distinct groups of customers based on recency, frequency, and spend. No group labels exist.',
    prompt: 'Which approach best matches the goal?',
    options: [
      'Train a classifier on churn labels',
      'Cluster customers by the three behavioral measures',
      'Mine association rules between products',
      'Forecast revenue with regression',
    ],
    answer: 1,
    explanation:
      'The team needs discovered segments, not predictions of a known label, so clustering on behavioral features is the direct fit.',
    hint: 'The output is a set of groups you did not define in advance.',
  },
  {
    chapterId: 'data-mining',
    title: 'Cross-Sell Placement',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A supermarket wants to know which products are frequently bought together so it can place them near each other.',
    prompt: 'Which mining technique is designed for this?',
    options: ['Association rule mining', 'Classification', 'Regression', 'Anomaly detection'],
    answer: 0,
    explanation:
      'Association rules measure co-occurrence of items in baskets, which directly supports cross-selling and shelf placement decisions.',
    hint: 'Look for patterns within the same basket.',
  },
  {
    chapterId: 'data-mining',
    title: 'Missing Values Before Mining',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Why must missing values be handled before training a model?',
    options: [
      'They always improve accuracy',
      'They are illegal in SQL',
      'They remove the need for a test set',
      'Many algorithms cannot learn correctly from incomplete records',
    ],
    answer: 3,
    explanation:
      'Missing inputs can bias estimates or break distance and probability calculations, so imputation or exclusion must be chosen deliberately.',
    hint: 'Think about what a model does with a blank feature.',
  },
  {
    chapterId: 'data-mining',
    title: 'Where Mining Effort Goes',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'In practice, which activity usually consumes the largest share of a mining project?',
    options: [
      'Choosing the programming language',
      'Writing the final dashboard',
      'Data cleaning, preparation, and problem framing',
      'Renaming the output files',
    ],
    answer: 2,
    explanation:
      'Real datasets are messy and ambiguous, so defining the question and preparing trustworthy features dominates the work.',
    hint: 'The algorithm is rarely the bottleneck.',
  },
  {
    chapterId: 'data-mining',
    title: 'Reading Both Directions',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'In 800 transactions, 240 contain A, 160 contain B, and 96 contain both. A team reports confidence for A → B.',
    prompt: 'Which pair of values is correct for support and confidence of A → B?',
    options: [
      'Support 12%, confidence 40%',
      'Support 40%, confidence 12%',
      'Support 12%, confidence 60%',
      'Support 60%, confidence 40%',
    ],
    answer: 0,
    explanation:
      'Support is 96/800 = 12%; confidence is 96/240 = 40%. The 60% figure is confidence for B → A, a common reversal error.',
    hint: 'Divide joint count by total for support, then by A count.',
  },
  {
    chapterId: 'data-mining',
    title: 'What Lift Adds',
    difficulty: 'Hard',
    type: 'mcq',
    context:
      'Butter appears in 30% of baskets, and confidence for {bread} → {butter} is 60%.',
    prompt: 'What is the lift of the rule?',
    options: ['0.5', '30%', '60%', '2.0'],
    answer: 3,
    explanation:
      'Lift is confidence divided by the consequent base rate, so 0.60 / 0.30 = 2.0, meaning butter is twice as likely given bread.',
    hint: 'Compare confidence with the baseline rate for butter.',
  },
  {
    chapterId: 'data-mining',
    title: 'Trees That Memorize',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A decision tree grows until every training leaf is pure. Training accuracy is 100%, but validation accuracy falls as depth increases.',
    prompt: 'Which remedy is most appropriate?',
    options: [
      'Add more features',
      'Prune the tree or limit its depth',
      'Train for more epochs on the same data',
      'Remove the validation set',
    ],
    answer: 1,
    explanation:
      'The tree is fitting noise; limiting depth or pruning restores generalization, while adding features or training longer worsens overfitting.',
    hint: 'Limit the model so it cannot memorize noise.',
  },
  {
    chapterId: 'data-mining',
    title: 'Catching Rare Fraud',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A fraud team must catch as many fraudulent transactions as possible, but each false alarm costs an analyst review. The fraud rate is 0.5%.',
    prompt: 'Which evaluation focus is most appropriate?',
    options: [
      'Overall accuracy only',
      'Training loss only',
      'Recall for fraud, balanced against precision and review cost',
      'The number of features used',
    ],
    answer: 2,
    explanation:
      'Missing fraud is the costly error, so recall matters; precision keeps false alarms manageable, while accuracy is dominated by the 99.5% legitimate class.',
    hint: 'Which mistake is more expensive: a missed fraud or a false alarm?',
  },
  {
    chapterId: 'data-mining',
    title: 'Random Split on Time-Ordered Data',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A retailer predicts next-week demand but randomly splits three years of sales into training and test sets. The model shows suspiciously strong results.',
    prompt: 'What is the likely evaluation flaw?',
    options: [
      'Temporal leakage from future data into training',
      'Too few features',
      'The target is categorical',
      'The model is underfit',
    ],
    answer: 0,
    explanation:
      'Random splitting lets later periods inform earlier predictions; time-ordered data should be split chronologically to mimic real forecasting.',
    hint: 'Would the model have known the future at prediction time?',
  },
  {
    chapterId: 'data-mining',
    title: 'Validating Clusters Without Labels',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'When no labels exist, which evidence best supports that a clustering is useful?',
    options: [
      'Perfect training accuracy',
      'Stable, interpretable groups that differ on business-relevant measures',
      'A low support value',
      'A high confidence for one rule',
    ],
    answer: 1,
    explanation:
      'Without ground truth, cluster quality is judged by cohesion, separation, stability, and whether the segments make sense for decisions.',
    hint: 'There is no answer key, so look for structure and usefulness.',
  },

  // comparison-and-review
  {
    chapterId: 'comparison-and-review',
    title: 'Tree With One Parent',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which characteristic defines the hierarchical model?',
    options: [
      'Records form a tree where each child has one parent',
      'Records form an arbitrary graph with many owners',
      'Data is stored only in two-column tables',
      'Relationships are always many-to-many',
    ],
    answer: 0,
    explanation:
      'Hierarchical databases arrange record types as a tree, so each child record type has exactly one parent record type.',
    hint: 'Picture a family tree with no shared parents.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Graph of Owner and Member Sets',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which model represents data as records connected through owner and member sets?',
    options: ['Relational', 'Hierarchical', 'Network', 'Document'],
    answer: 2,
    explanation:
      'The network model uses sets to link owner records to member records, allowing a member to participate in multiple sets.',
    hint: 'It was designed to overcome tree restrictions.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Tables and Declarative Queries',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'Which model stores data in relations and supports declarative set-based queries?',
    options: ['Hierarchical', 'Relational', 'Network', 'Navigational'],
    answer: 1,
    explanation:
      'The relational model represents data as tables and lets users state what they want, leaving access paths to the optimizer.',
    hint: 'You describe the result, not the navigation.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Which Model Is Declarative',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which access style is characteristic of the relational model?',
    options: [
      'Follow pointers from parent to child',
      'Traverse owner-member chains manually',
      'Hard-code physical record addresses',
      'Submit a declarative query and let the optimizer choose a plan',
    ],
    answer: 3,
    explanation:
      'Relational queries specify the result set; the optimizer selects joins, indexes, and access paths, unlike navigational pointer chasing.',
    hint: 'The user does not choose the access path.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Navigational Pair',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which two classic models are primarily navigational?',
    options: [
      'Relational and object',
      'Document and relational',
      'Hierarchical and network',
      'Relational and network',
    ],
    answer: 2,
    explanation:
      'Hierarchical and network systems require programs to follow predefined parent-child or owner-member paths to reach records.',
    hint: 'Both predate the declarative relational model.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Hierarchical Many-to-Many Problem',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Why is a pure hierarchical model awkward for many-to-many relationships?',
    options: [
      'A child can have only one parent, so shared membership needs duplication or workarounds',
      'It cannot store numeric values',
      'It has no indexes',
      'It cannot represent one-to-many relationships',
    ],
    answer: 0,
    explanation:
      'A student enrolled in many courses cannot be a child of each course without repeated records, which introduces redundancy and update anomalies.',
    hint: 'Think about a record needing two parents.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'What the Network Model Removes',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'A legacy network database lets one member record belong to several sets. Which limitation of the pure hierarchical model does this remove?',
    options: [
      'The need for a primary key',
      'The single-parent restriction',
      'The need for disk storage',
      'The requirement for SQL',
    ],
    answer: 1,
    explanation:
      'A hierarchy gives each child one parent; set membership lets a record participate in several owner-member paths.',
    hint: 'Compare a tree with a graph of sets.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Many-to-Many in the Relational Model',
    difficulty: 'Easy',
    type: 'mcq',
    prompt:
      'How is a many-to-many relationship normally implemented in a relational database?',
    options: [
      'By nesting a table inside a column',
      'By using only a primary key',
      'By storing comma-separated foreign keys',
      'By adding a junction table with foreign keys to both sides',
    ],
    answer: 3,
    explanation:
      'A junction or bridge table holds pairs of keys, turning the many-to-many relationship into two one-to-many relationships.',
    hint: 'One row represents one pairing.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Recognizing a Normal Query',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which question is a normal database query rather than a mining task?',
    options: [
      'Which customers are likely to churn next month?',
      'How many orders over 100 were placed in March?',
      'What natural customer segments exist?',
      'Which products are usually bought together?',
    ],
    answer: 1,
    explanation:
      'It retrieves a known aggregate using a precise predicate; the other questions seek predictions, latent groups, or co-occurrence patterns.',
    hint: 'The answer is a deterministic count, not a discovered pattern.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Recognizing a Mining Question',
    difficulty: 'Easy',
    type: 'mcq',
    prompt: 'Which question is best treated as a data-mining problem?',
    options: [
      'List orders shipped to Berlin last week',
      'Count products with zero stock',
      'Which customers are likely to default on a loan?',
      'Show the schema of the orders table',
    ],
    answer: 2,
    explanation:
      'Predicting default requires learning from historical labeled cases and evaluating generalization, unlike a fixed retrieval query.',
    hint: 'The answer is a prediction, not a stored fact.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Strict Corporate Hierarchy',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'An HR system stores a strict reporting tree: every employee has exactly one manager, and most queries walk up or down that chain.',
    prompt: 'Which model structure matches this domain most directly?',
    options: ['Hierarchical', 'Relational with many-to-many junctions', 'Graph', 'Document'],
    answer: 0,
    explanation:
      'The reporting line is a tree with one parent per employee, which is exactly the native shape of the hierarchical model.',
    hint: 'The domain itself forbids multiple managers.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'General-Purpose Order System',
    difficulty: 'Easy',
    type: 'scenario',
    context:
      'A new order system needs transactions, ad hoc joins across customers, products, and payments, plus strong integrity constraints.',
    prompt: 'Which model should the team choose as its operational foundation?',
    options: ['Hierarchical', 'Network', 'Document', 'Relational'],
    answer: 3,
    explanation:
      'Relational databases provide declarative joins, constraints, and transactional integrity, which match general-purpose operational systems well.',
    hint: 'Look for the model designed for flexible set queries and constraints.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'File System Directories',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A storage service models folders that contain files and subfolders. Each item has exactly one parent folder, and access follows the path from root to leaf.',
    prompt: 'Which data model naturally matches this structure?',
    options: [
      'Relational with a junction table',
      'Graph with arbitrary edges',
      'Document with no hierarchy',
      'Hierarchical',
    ],
    answer: 3,
    explanation:
      'A directory tree has one parent per node and is navigated by path, which mirrors hierarchical parent-child records.',
    hint: 'The structure is a tree by definition.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Airline Route Network',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An airline stores flights connecting many cities. A city can be served by many routes, and a route can connect many cities through intermediate stops. Analysts traverse these connections frequently.',
    prompt: 'Which model is most natural for the connections?',
    options: [
      'Hierarchical',
      'Network or graph',
      'Flat file',
      'Relational with no relationships',
    ],
    answer: 1,
    explanation:
      'Many-to-many connections and path traversal fit the network model with its sets, or a modern graph model, not a strict tree.',
    hint: 'Many cities, many routes, frequent traversal.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Ad Hoc Analytical Joins',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A fraud analyst needs to join accounts, transactions, merchants, and alerts in queries that change daily. The schema is stable and SQL skills are common.',
    prompt: 'Which model is the most practical fit?',
    options: ['Relational', 'Hierarchical', 'Network', 'Key-value only'],
    answer: 0,
    explanation:
      'The relational model handles unpredictable joins declaratively and is well supported by SQL tools, unlike fixed navigational paths.',
    hint: 'The queries are not known in advance.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Evolving Product Attributes',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'An e-commerce catalogue adds new optional attributes every month, such as battery life or fabric type. Different product categories need different fields, and most reads fetch one product document.',
    prompt: 'Which model fits these requirements well?',
    options: [
      'Hierarchical',
      'Network',
      'Document',
      'A single fixed relational table',
    ],
    answer: 2,
    explanation:
      'A document store accommodates nested, varying attributes per product without altering a global schema for every new field.',
    hint: 'Flexible per-item structure matters more than cross-item joins.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Friends of Friends',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      "A social app answers queries such as 'friends of friends who live nearby' and 'shortest path between two users'. Relationships are the main data.",
    prompt: 'Which model should power these relationship queries?',
    options: ['Hierarchical', 'Relational with a single table', 'Document', 'Graph'],
    answer: 3,
    explanation:
      'Graph databases store edges as first-class data and traverse variable-depth paths efficiently, which matches relationship-centric queries.',
    hint: 'The query walks relationships rather than scanning tables.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'System for Historical Trends',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'Which system is designed for multi-year trend analysis across regions and products?',
    options: [
      'OLTP order database',
      'Data warehouse',
      'Hierarchical master file',
      'Transaction log',
    ],
    answer: 1,
    explanation:
      'A warehouse stores integrated historical data in analytical schemas, while an OLTP system is tuned for current transactions.',
    hint: 'Think about long history and large aggregations.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Predicting Loan Default',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A lender has five years of loans labeled defaulted or repaid, plus applicant and repayment features. It wants to score new applications.',
    prompt: 'Which approach fits best?',
    options: [
      'A relational join of all tables',
      'An OLAP roll-up by branch',
      'A classification model trained on the labeled history',
      'A hierarchical navigation program',
    ],
    answer: 2,
    explanation:
      'The outcome is a known binary label and historical examples exist, so classification is the direct predictive technique.',
    hint: 'There is a labeled target to learn from.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Reporting or Mining?',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      "A manager asks, 'What was average order value by store last quarter?' A second manager asks, 'Which customers are likely to respond to a premium offer?'",
    prompt: 'How should these be classified?',
    options: [
      'The first is reporting; the second is mining',
      'Both are mining',
      'The first is mining; the second is reporting',
      'Neither uses data',
    ],
    answer: 0,
    explanation:
      'The first is a deterministic aggregate over known data; the second requires a predictive model and evaluation on unseen customers.',
    hint: 'One answer is already in the data; the other must be inferred.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Navigating Without an Index',
    difficulty: 'Medium',
    type: 'scenario',
    context:
      'A legacy hierarchical system answers parent-to-child queries quickly. A new request asks for all orders above a threshold across every branch, with no usable path.',
    prompt: 'Why is this query expensive in the hierarchical model?',
    options: [
      'It cannot store numeric thresholds',
      'It must traverse many tree paths because no global declarative access exists',
      'It requires a junction table',
      'It automatically replicates every record',
    ],
    answer: 1,
    explanation:
      'Hierarchical access follows predefined paths, so a cross-branch filter may require scanning many trees instead of using a set-based optimizer.',
    hint: 'The model rewards known paths, not arbitrary predicates.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Logical Data Independence',
    difficulty: 'Medium',
    type: 'mcq',
    prompt: 'Which capability is a major advantage of the relational model?',
    options: [
      'It forbids all schema changes',
      'It requires programs to know record addresses',
      'It separates logical schema changes from application access',
      'It eliminates the need for transactions',
    ],
    answer: 2,
    explanation:
      'Views and declarative queries let the logical schema evolve with less impact on programs, something navigational models handle poorly.',
    hint: 'Applications should not depend on physical paths.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Owner and Member Records',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'In which model is a relationship explicitly represented as a set with an owner and members?',
    options: ['Network', 'Relational', 'Document', 'Columnar warehouse'],
    answer: 0,
    explanation:
      'The network model sets define one owner record type and its member record types, and programs navigate those links.',
    hint: 'This vocabulary is specific to one classic model.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'What Mining Needs That a Query Does Not',
    difficulty: 'Medium',
    type: 'mcq',
    prompt:
      'What does a classification task require that an ordinary reporting query does not?',
    options: [
      'A primary key',
      'A GROUP BY clause',
      'A normalized schema',
      'Labeled examples and evaluation on unseen data',
    ],
    answer: 3,
    explanation:
      'Supervised learning needs historical labels and a generalization check, while a reporting query simply aggregates stored facts.',
    hint: 'Think about how the system would learn the answer.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Cross-Branch Report in a Legacy Tree',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A hierarchical inventory system stores parts under assembly branches. A report needs all parts from every assembly that cost more than 500, regardless of branch.',
    prompt: 'Why is this report more natural in a relational system?',
    options: [
      'Relational systems forbid indexes',
      'Hierarchical systems cannot store costs',
      'A relational optimizer can filter and join sets without following fixed paths',
      'Relational systems duplicate every part',
    ],
    answer: 2,
    explanation:
      'The relational model treats rows as sets and lets the optimizer choose access paths, unlike hierarchical navigation that depends on predefined tree paths.',
    hint: 'Compare set-based filtering with path-following.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Modeling Many-to-Many in a Tree',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A hierarchical database must represent students and courses, where each student takes many courses and each course has many students. The team duplicates student records under each course.',
    prompt: 'What consequence should they expect?',
    options: [
      'Stronger referential integrity',
      'Faster ad hoc joins',
      'No change in storage',
      'Redundant data and update anomalies when a student changes address',
    ],
    answer: 3,
    explanation:
      'Duplicating a student under every course stores the same fact repeatedly, so one address change must update many copies and can leave inconsistencies.',
    hint: 'Think about a fact stored in several tree locations.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Regulated Reporting With Stable Schema',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A bank must produce audited reports joining accounts, transactions, and collateral. The schema is stable, queries are complex and change quarterly, and consistency is critical.',
    prompt: 'Which foundation is the best fit?',
    options: [
      'A relational database, potentially with a warehouse layer for analysis',
      'A hierarchical file for each report',
      'A network model navigated by custom programs',
      'A document store with no transactions',
    ],
    answer: 0,
    explanation:
      'Complex ad hoc joins, integrity, and stable structured data favor the relational model; a warehouse can isolate the reporting workload.',
    hint: 'Match declarative joins and integrity to the requirement.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'OLAP Versus Mining',
    difficulty: 'Hard',
    type: 'mcq',
    prompt: 'What best distinguishes OLAP analysis from data mining?',
    options: [
      'OLAP cannot aggregate data',
      'OLAP explains known historical aggregates; mining induces patterns or predictions',
      'Mining never uses historical data',
      'Mining always returns a single number',
    ],
    answer: 1,
    explanation:
      'OLAP supports interactive slicing and aggregation of known measures, while mining learns structure or predictive models from data.',
    hint: 'One explores known numbers; the other learns a pattern.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Variable-Depth Connections',
    difficulty: 'Hard',
    type: 'scenario',
    context:
      'A logistics platform must find routes with one to five hops between warehouses, where connections change daily and path queries dominate. A relational join per hop is becoming unwieldy.',
    prompt: 'Which model is the strongest fit?',
    options: ['Hierarchical', 'Wide-column only', 'Graph', 'A single flat file'],
    answer: 2,
    explanation:
      'Graph storage represents each connection as an edge and supports variable-depth traversal directly, avoiding a growing chain of self-joins.',
    hint: 'The depth is not fixed in advance.',
  },
  {
    chapterId: 'comparison-and-review',
    title: 'Choosing a Combined Architecture',
    difficulty: 'Hard',
    type: 'mcq',
    prompt:
      'Which architecture best separates transactional correctness, historical analysis, and predictive scoring?',
    options: [
      'One hierarchical system for all three',
      'A single spreadsheet shared by every team',
      'A document store with no analytical layer',
      'An OLTP relational database, a warehouse, and a mining or scoring service',
    ],
    answer: 3,
    explanation:
      'Each layer has a distinct workload: transactions need integrity, the warehouse needs history and aggregation, and mining needs features and model evaluation.',
    hint: 'Match each workload to the component designed for it.',
  },
];
