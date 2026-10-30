'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Sparkles,
  Sliders,
} from 'lucide-react';
import { SqlTopic } from '../data/topics';
import { BTreeIndexVisualizer } from './BTreeIndexVisualizer';
import { SqlJoinsVisualizer } from './SqlJoinsVisualizer';
import { WindowFunctionVisualizer } from './WindowFunctionVisualizer';
import { AcidMvccVisualizer } from './AcidMvccVisualizer';
import { TransactionAnomalyStepper } from './TransactionAnomalyStepper';
import { CompositeIndexEvaluator } from './CompositeIndexEvaluator';
import { ExplainPlanVisualizer } from './ExplainPlanVisualizer';
import { SchemaErVisualizer } from './SchemaErVisualizer';

interface VisualStep {
  title: string;
  engineAction: string;
  explanation: string;
  activeQuery?: string;
  visualState: {
    status: 'idle' | 'processing' | 'matched' | 'filtered' | 'error' | 'success';
    nodes: Array<{
      id: string;
      label: string;
      sub?: string;
      highlight?: boolean;
      status?: 'active' | 'success' | 'warning' | 'error' | 'muted';
      badge?: string;
    }>;
    metrics?: Array<{ label: string; value: string }>;
    codeHighlight?: string;
    note?: string;
  };
}

interface TopicSimData {
  simTitle: string;
  simConcept: string;
  scenarios: Array<{
    name: string;
    query: string;
    steps: VisualStep[];
  }>;
}

// Generates high-fidelity visual animation data for all 50 topics
function getTopicSimData(topic: SqlTopic): TopicSimData {
  const num = topic.topicNumber;

  switch (num) {
    case 1: // Intro to SQL
      return {
        simTitle: 'Declarative Engine Pipeline',
        simConcept: 'SQL specifies WHAT data you want; the engine optimizer figures out HOW to access disk.',
        scenarios: [
          {
            name: 'Declarative Query Execution',
            query: "SELECT id, email FROM users WHERE country = 'India';",
            steps: [
              {
                title: 'Step 1: SQL Lexer & Parser',
                engineAction: 'Text Tokenization & AST Construction',
                explanation: 'The client sends the raw SQL string. The parser validates syntax and builds an Abstract Syntax Tree (AST).',
                visualState: {
                  status: 'processing',
                  nodes: [
                    { id: 'client', label: 'Client App', sub: 'Sends Query', status: 'muted' },
                    { id: 'parser', label: 'SQL Parser', sub: 'AST Validation', status: 'active', highlight: true, badge: 'Tokens OK' },
                    { id: 'catalog', label: 'System Catalog', sub: 'Metadata Cache', status: 'muted' },
                  ],
                  metrics: [{ label: 'Parser Time', value: '0.04 ms' }, { label: 'Syntax Errors', value: '0' }],
                  note: 'Verifies table "users" and columns "id", "email", "country" exist.',
                },
              },
              {
                title: 'Step 2: Cost-Based Optimizer (CBO)',
                engineAction: 'Plan Enumeration & Statistics Analysis',
                explanation: 'The optimizer consults table stats. It chooses between a Sequential Scan vs Index Scan.',
                visualState: {
                  status: 'processing',
                  nodes: [
                    { id: 'cbo', label: 'Cost-Based Optimizer', sub: 'Dynamic Programming', status: 'active', highlight: true, badge: 'Plan Selected' },
                    { id: 'plan', label: 'Index Scan on idx_country', sub: 'Estimated Cost: 4.2', status: 'success' },
                  ],
                  metrics: [{ label: 'Seq Scan Cost', value: '45.00' }, { label: 'Index Scan Cost', value: '4.20' }],
                  note: 'Optimizer selects the lowest cost execution plan (Index Scan).',
                },
              },
              {
                title: 'Step 3: Storage Engine & Buffer Cache',
                engineAction: 'Page Fetch & Predicate Evaluation',
                explanation: 'The storage engine checks shared buffers (RAM). If missing, it reads the 8KB disk block into memory.',
                visualState: {
                  status: 'matched',
                  nodes: [
                    { id: 'buffer', label: 'Shared Buffers (RAM)', sub: 'Cache Hit: 8KB Page #4', status: 'success', highlight: true },
                    { id: 'filter', label: 'Filter Evaluator', sub: "country = 'India'", status: 'active' },
                  ],
                  metrics: [{ label: 'Shared Hits', value: '2 blocks' }, { label: 'Disk Reads', value: '0' }],
                  note: 'Fast in-memory point lookup. Zero random physical disk I/O.',
                },
              },
              {
                title: 'Step 4: Result Projection & Client Return',
                engineAction: 'Tuple Serialization & Network Flush',
                explanation: 'Only the requested projection columns (id, email) are serialized and returned to the client socket.',
                visualState: {
                  status: 'success',
                  nodes: [
                    { id: 'row1', label: 'Tuple #1: Lucky', sub: 'id: 1, email: lucky@...', status: 'success', badge: 'Matched' },
                    { id: 'row2', label: 'Tuple #2: Amit', sub: 'id: 103, email: amit@...', status: 'success', badge: 'Matched' },
                  ],
                  metrics: [{ label: 'Rows Returned', value: '2' }, { label: 'Total Exec Time', value: '0.08 ms' }],
                  note: 'Client receives clean relational tuples without managing low-level pointers.',
                },
              },
            ],
          },
        ],
      };

    case 2: // Database & Tables
      return {
        simTitle: 'Slotted Page Disk Architecture',
        simConcept: 'Tables store data inside 8 KB disk pages containing a Page Header, Item Pointer array, and Heap Tuples.',
        scenarios: [
          {
            name: '8 KB Page Layout Walkthrough',
            query: 'SELECT * FROM users WHERE id = 42; -- Examining 8KB Block 0x05',
            steps: [
              {
                title: 'Step 1: 8KB Page Header & Item Pointers',
                engineAction: 'Inspect Page Header (24 bytes)',
                explanation: 'Every disk page begins with a 24-byte header containing LSN (Log Sequence Number) and line pointer count.',
                visualState: {
                  status: 'processing',
                  nodes: [
                    { id: 'header', label: 'Page Header (24B)', sub: 'LSN: 0/1A45B, Flags: 0x0', status: 'active', highlight: true },
                    { id: 'ptr1', label: 'Line Pointer #1', sub: 'Offset: 8140, Len: 48B', status: 'muted' },
                    { id: 'ptr2', label: 'Line Pointer #2', sub: 'Offset: 8080, Len: 60B', status: 'muted' },
                  ],
                  metrics: [{ label: 'Page Size', value: '8192 bytes' }, { label: 'Free Space', value: '4120 bytes' }],
                  note: 'Item pointers grow from bottom-up; raw row tuples grow top-down from end of page.',
                },
              },
              {
                title: 'Step 2: Free Space Hole & Tuple Offset',
                engineAction: 'Resolve Tuple Offset',
                explanation: 'The line pointer points to byte offset 8080 inside the page where tuple #42 physically resides.',
                visualState: {
                  status: 'matched',
                  nodes: [
                    { id: 'freespace', label: 'Free Space Gap', sub: 'Available for new INSERTs', status: 'muted' },
                    { id: 'tuple', label: 'Heap Tuple #42', sub: 'Header (23B) + [42, Alice, 1500]', status: 'success', highlight: true, badge: 'Target' },
                  ],
                  metrics: [{ label: 'Tuple Offset', value: '8080' }, { label: 'Tuple Length', value: '60 bytes' }],
                  note: 'Slotted page architecture allows moving tuples during VACUUM without invalidating index pointers.',
                },
              },
              {
                title: 'Step 3: Tuple Header & Column Extraction',
                engineAction: 'Unpack Tuple Attributes',
                explanation: 'The tuple header contains MVCC metadata (xmin, xmax, infomasks). Columns are extracted using data type offsets.',
                visualState: {
                  status: 'success',
                  nodes: [
                    { id: 'xmin', label: 'xmin: 1042', sub: 'Created by TX 1042', status: 'success' },
                    { id: 'xmax', label: 'xmax: 0', sub: 'Active (Not Deleted)', status: 'success' },
                    { id: 'payload', label: 'Columns: [id: 42, name: Alice]', sub: 'Data Decoded', status: 'success', highlight: true },
                  ],
                  metrics: [{ label: 'Visibility', value: 'VISIBLE' }, { label: 'Attributes', value: '3 columns' }],
                  note: 'Tuple decoded into relational memory buffer.',
                },
              },
            ],
          },
        ],
      };

    case 27: // Foreign Key
      return {
        simTitle: 'Referential Integrity & CASCADE Engine',
        simConcept: 'Foreign Keys enforce parent-child invariants and automatically synchronize deletions.',
        scenarios: [
          {
            name: 'ON DELETE CASCADE Simulation',
            query: 'DELETE FROM departments WHERE id = 1; -- Trigger CASCADE to employees',
            steps: [
              {
                title: 'Step 1: Check Parent Record',
                engineAction: 'Evaluate departments WHERE id = 1',
                explanation: 'The database acquires a row-level Exclusive Lock on department 1 (IT).',
                visualState: {
                  status: 'processing',
                  nodes: [
                    { id: 'dept1', label: 'Dept #1 (IT)', sub: 'Status: Pending Delete', status: 'warning', highlight: true, badge: 'X-Lock' },
                    { id: 'dept2', label: 'Dept #2 (HR)', sub: 'Status: Active', status: 'muted' },
                  ],
                  metrics: [{ label: 'Parent Table', value: 'departments' }, { label: 'Target ID', value: '1' }],
                  note: 'Referential integrity check triggers internal FK trigger handler.',
                },
              },
              {
                title: 'Step 2: Scan Child FK Index (employees.department_id)',
                engineAction: 'Lookup child records referencing parent id 1',
                explanation: 'The engine queries the foreign key index on employees. It locates two matching employee records.',
                visualState: {
                  status: 'matched',
                  nodes: [
                    { id: 'emp1', label: 'Emp #101 (Lucky)', sub: 'dept_id: 1 ➔ Cascade Target', status: 'warning', highlight: true, badge: 'Match' },
                    { id: 'emp2', label: 'Emp #102 (Rahul)', sub: 'dept_id: 2 ➔ Unaffected', status: 'muted' },
                    { id: 'emp3', label: 'Emp #103 (Amit)', sub: 'dept_id: 1 ➔ Cascade Target', status: 'warning', highlight: true, badge: 'Match' },
                  ],
                  metrics: [{ label: 'FK Index Scan', value: 'Hit (2 rows)' }, { label: 'Action', value: 'CASCADE' }],
                  note: 'If an index on department_id is missing, the engine is forced to do a slow full table scan!',
                },
              },
              {
                title: 'Step 3: Atomic Cascade Deletion & Commit',
                engineAction: 'Delete child records then delete parent department',
                explanation: 'Both child rows (Lucky & Amit) and the parent department are marked dead under the same transaction ID.',
                visualState: {
                  status: 'success',
                  nodes: [
                    { id: 'del_dept', label: 'Dept #1 (IT)', sub: 'DELETED (xmax = tx_id)', status: 'error', badge: 'Removed' },
                    { id: 'del_emp1', label: 'Emp #101', sub: 'DELETED by CASCADE', status: 'error', badge: 'Removed' },
                    { id: 'del_emp3', label: 'Emp #103', sub: 'DELETED by CASCADE', status: 'error', badge: 'Removed' },
                  ],
                  metrics: [{ label: 'Total Rows Deleted', value: '3' }, { label: 'Integrity Preserved', value: '100%' }],
                  note: 'Referential integrity is guaranteed: zero orphaned records remain.',
                },
              },
            ],
          },
        ],
      };

    default: // Dynamic high-fidelity visualizer for any of the 50 topics
      return generateDynamicSimData(topic);
  }
}

// Universal dynamic generator creating custom interactive simulations for each topic
function generateDynamicSimData(topic: SqlTopic): TopicSimData {
  const t = topic.title;
  const num = topic.topicNumber;

  if (num === 7) { // WHERE clause
    return {
      simTitle: 'Predicate Filter Evaluation Pipeline',
      simConcept: 'Streaming rows through boolean predicates; evaluating sargability and row selectivity.',
      scenarios: [
        {
          name: 'Filter Evaluation',
          query: "SELECT * FROM employees WHERE salary > 60000 AND status = 'active';",
          steps: [
            {
              title: 'Step 1: Stream Tuples from Table',
              engineAction: 'Fetch raw rows from heap or index',
              explanation: 'Candidate rows enter the filter engine one by one.',
              visualState: {
                status: 'processing',
                nodes: [
                  { id: 'r1', label: 'Alice ($75k, active)', sub: 'Row 1', status: 'active', highlight: true },
                  { id: 'r2', label: 'Bob ($50k, active)', sub: 'Row 2', status: 'muted' },
                  { id: 'r3', label: 'Charlie ($90k, inactive)', sub: 'Row 3', status: 'muted' },
                ],
                metrics: [{ label: 'Rows Scanned', value: '3' }, { label: 'Filtered In', value: '0' }],
              },
            },
            {
              title: 'Step 2: Evaluate Boolean Predicates',
              engineAction: 'Short-circuit evaluation of AND clauses',
              explanation: 'Alice passes both predicates. Bob fails salary > 60000. Charlie fails status = active.',
              visualState: {
                status: 'matched',
                nodes: [
                  { id: 'r1', label: 'Alice', sub: '75k > 60k (T) & active (T) ➔ TRUE', status: 'success', highlight: true, badge: 'PASS' },
                  { id: 'r2', label: 'Bob', sub: '50k > 60k (F) ➔ Short-circuits FALSE', status: 'error', badge: 'REJECT' },
                  { id: 'r3', label: 'Charlie', sub: '90k > 60k (T) & inactive (F) ➔ FALSE', status: 'error', badge: 'REJECT' },
                ],
                metrics: [{ label: 'Pass Rate', value: '33.3%' }, { label: 'Selectivity', value: '0.33' }],
              },
            },
            {
              title: 'Step 3: Output Result Projection',
              engineAction: 'Emit surviving tuple to client stream',
              explanation: 'Only Alice meets all criteria and is emitted to the output buffer.',
              visualState: {
                status: 'success',
                nodes: [
                  { id: 'out1', label: 'Alice (ID: 101, Salary: $75,000)', sub: 'Output Tuple', status: 'success', highlight: true, badge: 'Emitted' },
                ],
                metrics: [{ label: 'Final Rows', value: '1' }, { label: 'CPU Instructions', value: 'Minimal' }],
              },
            },
          ],
        },
      ],
    };
  }

  if (num === 20 || num === 21) { // GROUP BY & HAVING
    return {
      simTitle: 'Hash Aggregation & Bucket Pipeline',
      simConcept: 'Splitting rows into distinct hash buckets, calculating aggregates, and filtering grouped metrics.',
      scenarios: [
        {
          name: 'Group By & Aggregate Flow',
          query: 'SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 65000;',
          steps: [
            {
              title: 'Step 1: Hash Key Calculation',
              engineAction: 'Hash department column for incoming rows',
              explanation: 'The engine hashes the group key ("IT", "HR", "Sales") into in-memory hash buckets.',
              visualState: {
                status: 'processing',
                nodes: [
                  { id: 'b1', label: 'Bucket #1: IT', sub: 'Alice ($80k), David ($70k)', status: 'active', highlight: true },
                  { id: 'b2', label: 'Bucket #2: HR', sub: 'Bob ($50k), Eve ($55k)', status: 'active' },
                  { id: 'b3', label: 'Bucket #3: Sales', sub: 'Charlie ($90k)', status: 'active' },
                ],
                metrics: [{ label: 'Hash Table', value: 'In-Memory (work_mem)' }, { label: 'Groups', value: '3' }],
              },
            },
            {
              title: 'Step 2: Aggregate Calculation per Group',
              engineAction: 'Compute AVG(salary) across bucket tuples',
              explanation: 'IT average = $75,000. HR average = $52,500. Sales average = $90,000.',
              visualState: {
                status: 'matched',
                nodes: [
                  { id: 'b1', label: 'IT Group', sub: 'Count: 2 | AVG: $75,000', status: 'success', highlight: true },
                  { id: 'b2', label: 'HR Group', sub: 'Count: 2 | AVG: $52,500', status: 'muted' },
                  { id: 'b3', label: 'Sales Group', sub: 'Count: 1 | AVG: $90,000', status: 'success', highlight: true },
                ],
                metrics: [{ label: 'Aggregates Done', value: '3 buckets' }],
              },
            },
            {
              title: 'Step 3: HAVING Filter Stage',
              engineAction: 'Filter groups where AVG(salary) > 65000',
              explanation: 'HAVING filters aggregated groups. IT and Sales qualify; HR ($52,500) is discarded.',
              visualState: {
                status: 'success',
                nodes: [
                  { id: 'out1', label: 'IT', sub: 'AVG: $75,000 ➔ Kept', status: 'success', highlight: true, badge: 'PASS' },
                  { id: 'out2', label: 'HR', sub: 'AVG: $52,500 ➔ Dropped by HAVING', status: 'error', badge: 'REJECT' },
                  { id: 'out3', label: 'Sales', sub: 'AVG: $90,000 ➔ Kept', status: 'success', highlight: true, badge: 'PASS' },
                ],
                metrics: [{ label: 'Output Groups', value: '2' }],
              },
            },
          ],
        },
      ],
    };
  }

  if (num === 29 || num === 30 || num === 31 || num === 32) { // Joins
    return {
      simTitle: 'Physical Join Engine (Build & Probe Phase)',
      simConcept: 'Comparing rows between tables using Hash Join and Nested Loop mechanisms.',
      scenarios: [
        {
          name: 'Hash Join Execution',
          query: 'SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id;',
          steps: [
            {
              title: 'Step 1: Build Phase (Smaller Table)',
              engineAction: 'Construct in-memory Hash Table on users.id',
              explanation: 'The optimizer selects the smaller table (users) and hashes primary keys into memory buckets.',
              visualState: {
                status: 'processing',
                nodes: [
                  { id: 'h1', label: 'Hash Bucket 1', sub: 'Key: id=1 ➔ Alice', status: 'active', highlight: true },
                  { id: 'h2', label: 'Hash Bucket 2', sub: 'Key: id=2 ➔ Bob', status: 'active' },
                ],
                metrics: [{ label: 'Build Table', value: 'users (2 rows)' }, { label: 'Memory Used', value: '16 KB' }],
              },
            },
            {
              title: 'Step 2: Probe Phase (Larger Table Stream)',
              engineAction: 'Stream orders and probe hash table with user_id',
              explanation: 'Streaming incoming orders table and looking up user_id in the hash table in O(1) time.',
              visualState: {
                status: 'matched',
                nodes: [
                  { id: 'o1', label: 'Order #101', sub: 'user_id: 1 ➔ Matches Alice', status: 'success', highlight: true, badge: 'Join Hit' },
                  { id: 'o2', label: 'Order #102', sub: 'user_id: 2 ➔ Matches Bob', status: 'success', highlight: true, badge: 'Join Hit' },
                  { id: 'o3', label: 'Order #103', sub: 'user_id: 99 ➔ No Match in Hash', status: 'error', badge: 'No Match' },
                ],
                metrics: [{ label: 'Probe Time', value: '0.02 ms' }, { label: 'Join Matches', value: '2' }],
              },
            },
            {
              title: 'Step 3: Joined Tuples Emitted',
              engineAction: 'Combine attributes and output joined rows',
              explanation: 'Attributes from both relations are stitched together into the final output projection.',
              visualState: {
                status: 'success',
                nodes: [
                  { id: 'j1', label: '[Alice, Order 101: $140]', sub: 'Joined Result Row 1', status: 'success', highlight: true },
                  { id: 'j2', label: '[Bob, Order 102: $85]', sub: 'Joined Result Row 2', status: 'success', highlight: true },
                ],
                metrics: [{ label: 'Join Complexity', value: 'O(N + M)' }],
              },
            },
          ],
        },
      ],
    };
  }

  // Universal fallback simulation for other topics
  return {
    simTitle: `${t} Visual Simulator`,
    simConcept: `Interactive engine animation demonstrating relational behavior, disk structures, and execution flow for ${t}.`,
    scenarios: [
      {
        name: 'Standard Engine Flow',
        query: topic.codeSnippet || `EXPLAIN ANALYZE -- ${t} Execution Flow;`,
        steps: [
          {
            title: 'Step 1: Input & Parsing Stage',
            engineAction: `Validate SQL syntax and resolve schema metadata for ${t}`,
            explanation: `The database engine inspects active tables, verifies permissions, and prepares the physical operation.`,
            visualState: {
              status: 'processing',
              nodes: [
                { id: 'n1', label: 'SQL Input', sub: `Initiating ${t}`, status: 'active', highlight: true },
                { id: 'n2', label: 'Schema Catalog', sub: 'Checking Table Invariants', status: 'muted' },
              ],
              metrics: [{ label: 'Target Topic', value: `#${num}` }, { label: 'Status', value: 'Validating' }],
              note: topic.mentalModel,
            },
          },
          {
            title: 'Step 2: Engine Processing & State Evaluation',
            engineAction: `Execute physical algorithm: ${topic.category.toUpperCase()} layer`,
            explanation: topic.definition,
            visualState: {
              status: 'matched',
              nodes: [
                { id: 'n3', label: 'Execution Engine', sub: 'Evaluating Invariants', status: 'success', highlight: true, badge: 'In Progress' },
                { id: 'n4', label: 'Buffer Pool / Disk', sub: 'Handling 8KB Blocks', status: 'active' },
              ],
              metrics: [{ label: 'Category', value: topic.category }, { label: 'Difficulty', value: topic.difficulty }],
              note: 'Engine ensures ACID compliance and referential consistency.',
            },
          },
          {
            title: 'Step 3: Verification & Execution Complete',
            engineAction: 'Commit state changes and return verified output',
            explanation: topic.interviewReadyAnswer,
            visualState: {
              status: 'success',
              nodes: [
                { id: 'n5', label: 'Operation Success', sub: 'Invariants Preserved', status: 'success', highlight: true, badge: 'Done' },
                { id: 'n6', label: 'Output Stream', sub: 'Result Returned to Client', status: 'success' },
              ],
              metrics: [{ label: 'Execution', value: 'SUCCESS' }, { label: 'Data Integrity', value: '100%' }],
              note: topic.takeaways[0] || 'Declarative execution completed.',
            },
          },
        ],
      },
    ],
  };
}

function getSpecializedLab(num: number): { name: string; component: React.ReactNode } | null {
  if (num === 2 || num === 4 || num === 26 || num === 27 || num === 28) {
    return { name: 'Interactive Schema & ER Studio', component: <SchemaErVisualizer /> };
  }
  if (num === 29 || num === 30 || num === 31 || num === 32) {
    return { name: 'Physical Joins Engine Lab', component: <SqlJoinsVisualizer /> };
  }
  if (num === 42 || num === 48) {
    return { name: 'B+ Tree Page Stepper', component: <BTreeIndexVisualizer /> };
  }
  if (num === 43) {
    return { name: 'CBO EXPLAIN Plan Studio', component: <ExplainPlanVisualizer /> };
  }
  if (num === 44 || num === 45) {
    return { name: 'MVCC Snapshot & Isolation Studio', component: <AcidMvccVisualizer /> };
  }
  if (num === 49) {
    return { name: 'Concurrency Anomaly Stepper', component: <TransactionAnomalyStepper /> };
  }
  if (num === 46 || num === 47) {
    return { name: 'Window Function Partitioner', component: <WindowFunctionVisualizer /> };
  }
  return null;
}

export function TopicVisualizer({ topic }: { topic: SqlTopic }) {
  const simData = getTopicSimData(topic);
  const specializedLab = getSpecializedLab(topic.topicNumber);
  const [activeTab, setActiveTab] = useState<'animation' | 'lab'>('animation');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeScenario = simData.scenarios[activeScenarioIdx] || simData.scenarios[0];
  const steps = activeScenario.steps;
  const currentStep = steps[currentStepIdx] || steps[0];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeTab === 'animation') {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, activeTab]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-4">
      {specializedLab && (
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-card max-w-fit">
          <button
            onClick={() => setActiveTab('animation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'animation'
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Animation Stepper</span>
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'lab'
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{specializedLab.name}</span>
          </button>
        </div>
      )}

      {activeTab === 'lab' && specializedLab ? (
        specializedLab.component
      ) : (
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 space-y-6 shadow-sm transition-colors">
          {/* Visualizer Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl border border-border bg-muted/60 text-foreground flex items-center justify-center font-bold shadow-xs">
                <Cpu className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-foreground" />
                  <span>Interactive Engine Simulation</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  {simData.simTitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground font-mono text-xs">
                Step {currentStepIdx + 1} of {steps.length}
              </span>
            </div>
          </div>

          {/* Scenario Selector & SQL Query Banner */}
          <div className="space-y-3">
            {simData.scenarios.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {simData.scenarios.map((sc, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveScenarioIdx(idx);
                      setCurrentStepIdx(0);
                      setIsPlaying(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                      activeScenarioIdx === idx
                        ? 'bg-foreground text-background border-foreground shadow-xs'
                        : 'bg-card border-border text-foreground hover:bg-muted/40'
                    }`}
                  >
                    {sc.name}
                  </button>
                ))}
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-zinc-950 text-zinc-100 dark:bg-black font-mono text-xs sm:text-sm border border-border/80 flex items-center justify-between gap-3 overflow-x-auto">
              <span className="text-emerald-400 font-bold shrink-0">SQL&gt;</span>
              <code className="text-zinc-200 flex-1 truncate">{activeScenario.query}</code>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0">Active Input</span>
            </div>
          </div>

          {/* Animation Stage Canvas */}
          <div className="p-5 sm:p-6 rounded-xl border border-border bg-muted/15 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {currentStep.title}
                </h4>
                <div className="text-xs font-mono text-muted-foreground mt-0.5">
                  Engine Action: {currentStep.engineAction}
                </div>
              </div>

              {currentStep.visualState.metrics && (
                <div className="hidden sm:flex items-center gap-3">
                  {currentStep.visualState.metrics.map((m, mIdx) => (
                    <div key={mIdx} className="text-right">
                      <div className="text-[10px] font-mono text-muted-foreground uppercase">{m.label}</div>
                      <div className="text-xs font-mono font-bold text-foreground">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visual Node Graph */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentStep.visualState.nodes.map((node) => {
                let borderStyle = 'border-border bg-card';
                let badgeStyle = 'bg-muted/40 text-muted-foreground';

                if (node.status === 'active') {
                  borderStyle = 'border-foreground/50 bg-foreground/5 shadow-xs';
                  badgeStyle = 'bg-foreground text-background';
                } else if (node.status === 'success') {
                  borderStyle = 'border-emerald-500/50 bg-emerald-500/10';
                  badgeStyle = 'bg-emerald-500 text-white';
                } else if (node.status === 'warning') {
                  borderStyle = 'border-amber-500/50 bg-amber-500/10';
                  badgeStyle = 'bg-amber-500 text-white';
                } else if (node.status === 'error') {
                  borderStyle = 'border-rose-500/50 bg-rose-500/10';
                  badgeStyle = 'bg-rose-500 text-white';
                } else if (node.status === 'muted') {
                  borderStyle = 'border-border/60 bg-card/60 opacity-60';
                }

                return (
                  <div
                    key={node.id}
                    className={`p-4 rounded-xl border transition-all space-y-1.5 ${borderStyle} ${
                      node.highlight ? 'ring-2 ring-foreground/20' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-foreground truncate">{node.label}</span>
                      {node.badge && (
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${badgeStyle}`}>
                          {node.badge}
                        </span>
                      )}
                    </div>
                    {node.sub && (
                      <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                        {node.sub}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Explanation Callout */}
            <div className="p-4 rounded-xl bg-card border border-border space-y-2">
              <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>How the Database Executes This:</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {currentStep.explanation}
              </p>
              {currentStep.visualState.note && (
                <div className="text-xs text-muted-foreground font-mono pt-1 border-t border-border/60">
                  💡 {currentStep.visualState.note}
                </div>
              )}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors shadow-xs"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Auto Play</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                title="Reset to Step 1"
                aria-label="Reset animation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIdx === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev Step</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIdx === steps.length - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted/40 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
