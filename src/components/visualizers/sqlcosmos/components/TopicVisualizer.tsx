'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
  HardDrive,
  Activity,
  Clock,
  Compass,
  Check,
  X,
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

interface VisualNode {
  id: string;
  label: string;
  sub?: string;
  category?: 'tuple' | 'gate' | 'index' | 'buffer' | 'storage' | 'output';
  highlight?: boolean;
  status?: 'active' | 'success' | 'warning' | 'error' | 'muted';
  badge?: string;
  attributes?: Record<string, string | number>;
}

interface VisualStep {
  title: string;
  engineAction: string;
  explanation: string;
  activeQuery?: string;
  telemetry: {
    bufferHitRate: string;
    estimatedCost: string;
    ioType: string;
    latencyUs: string;
    tuplesProcessed: number;
  };
  visualState: {
    status: 'idle' | 'processing' | 'matched' | 'filtered' | 'error' | 'success';
    stageName: string;
    nodes: VisualNode[];
    mathFormula?: string;
    note?: string;
  };
}

interface TopicSimData {
  simTitle: string;
  simConcept: string;
  scenarios: Array<{
    name: string;
    query: string;
    description: string;
    steps: VisualStep[];
  }>;
}

// 3Blue1Brown level simulation generator for all 50 topics
function getTopicSimData(topic: SqlTopic): TopicSimData {
  const num = topic.topicNumber;
  const title = topic.title;

  if (num === 1) { // Intro to SQL
    return {
      simTitle: 'Declarative Query Execution Pipeline',
      simConcept: 'SQL specifies WHAT data to retrieve. The Cost-Based Optimizer determines the optimal physical path to disk.',
      scenarios: [
        {
          name: 'Declarative Stream (Point Lookup)',
          query: "SELECT id, email, country FROM users WHERE country = 'India';",
          description: 'Traces the transformation from raw SQL text to AST, execution plan, buffer hit, and output tuple.',
          steps: [
            {
              title: 'Phase 1: Lexical Analysis & Abstract Syntax Tree (AST)',
              engineAction: 'Tokenize query string & validate against system catalog',
              explanation: 'The parser reads the SQL string and generates an Abstract Syntax Tree (AST). It verifies that table "users" and columns "id, email, country" exist in the pg_catalog metadata cache.',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '0.04 cost units', ioType: 'Catalog Lookup', latencyUs: '35 µs', tuplesProcessed: 0 },
              visualState: {
                status: 'processing',
                stageName: 'SQL Parser & Semantic Analyzer',
                mathFormula: 'Q_{raw} \\xrightarrow{\\text{Lexer}} \\text{Tokens} \\xrightarrow{\\text{Grammar}} \\text{AST}(Select, From(users), Where(country = \'India\'))',
                nodes: [
                  { id: 'client', label: 'Client Socket', sub: 'Inbound SQL Text', category: 'tuple', status: 'muted', badge: 'Source' },
                  { id: 'parser', label: 'AST Compiler', sub: 'Grammar Tree Constructed', category: 'gate', status: 'active', highlight: true, badge: 'Tokens OK' },
                  { id: 'catalog', label: 'Catalog Cache', sub: 'O(1) Schema Verified', category: 'storage', status: 'success', badge: 'Types Valid' },
                ],
                note: 'Syntax and permission checks pass with zero disk I/O.',
              },
            },
            {
              title: 'Phase 2: Cost-Based Optimizer (CBO) Plan Enumeration',
              engineAction: 'Dynamic Programming search across Index Scan vs Seq Scan',
              explanation: 'The optimizer checks table statistics (MCV frequency, histograms). It calculates that an Index Scan on idx_country costs 4.2 units versus a full Sequential Scan costing 45.0 units.',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '4.20 cost units', ioType: 'Plan Selection', latencyUs: '82 µs', tuplesProcessed: 0 },
              visualState: {
                status: 'processing',
                stageName: 'Query Planner (Cost Engine)',
                mathFormula: '\\text{Cost} = (N_{\\text{pages}} \\times c_{\\text{page}}) + (N_{\\text{tuples}} \\times c_{\\text{cpu}}) \\implies 4.2 < 45.0',
                nodes: [
                  { id: 'seq_scan', label: 'Sequential Scan', sub: 'Cost: 45.0 (Rejection)', category: 'storage', status: 'error', badge: 'Discarded' },
                  { id: 'idx_scan', label: 'Index Scan (idx_country)', sub: 'Cost: 4.2 (Optimal Plan)', category: 'index', status: 'success', highlight: true, badge: 'Selected' },
                ],
                note: 'CBO selects index point seek based on statistical selectivity.',
              },
            },
            {
              title: 'Phase 3: Storage Engine & Shared Buffer Hit',
              engineAction: 'Traverse B-Tree leaf & fetch 8 KB page from RAM buffer pool',
              explanation: 'The execution engine follows the B-Tree root to the leaf page. It checks the Shared Buffers pool in RAM: 8 KB Block #04 is already cached in memory, avoiding physical disk I/O.',
              telemetry: { bufferHitRate: '100% (Shared RAM)', estimatedCost: '4.20 cost units', ioType: 'Shared Buffer Hit', latencyUs: '112 µs', tuplesProcessed: 2 },
              visualState: {
                status: 'matched',
                stageName: 'Buffer Pool Execution',
                mathFormula: '\\text{SharedBuffer}(\\text{Block } 0x04) \\xrightarrow{\\text{Cache Hit}} \\text{RAM Page Bus (0 Disk Reads)}',
                nodes: [
                  { id: 'btree', label: 'idx_country Leaves', sub: 'Key: \'India\' -> CTID (4, 1)', category: 'index', status: 'success' },
                  { id: 'ram', label: 'Shared Buffers (8 KB)', sub: 'Block 0x04 Cached in RAM', category: 'buffer', status: 'success', highlight: true, badge: 'Cache Hit' },
                  { id: 'disk', label: 'NVMe Storage', sub: 'Zero Physical Reads Required', category: 'storage', status: 'muted' },
                ],
                note: 'Ultra-fast memory bus access: zero mechanical or NVMe wait states.',
              },
            },
            {
              title: 'Phase 4: Projection Pushdown & Stream Emission',
              engineAction: 'Filter row headers, strip unrequested columns, serialize output',
              explanation: 'The executor unpacks the matching tuples, applies projection pushdown (emitting only id, email, country), and streams serialized relational records to the client socket.',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '4.20 cost units', ioType: 'Network Output', latencyUs: '138 µs', tuplesProcessed: 2 },
              visualState: {
                status: 'success',
                stageName: 'Result Hopper Output',
                mathFormula: '\\pi_{\\text{id, email, country}}(\\sigma_{\\text{country}=\'India\'}(\\text{Users})) \\implies \\{ \\text{Row}_1, \\text{Row}_2 \\}',
                nodes: [
                  { id: 'out1', label: 'Lucky (#1)', sub: 'email: lucky@... | India', category: 'output', status: 'success', highlight: true, badge: 'Emitted' },
                  { id: 'out2', label: 'Amit (#103)', sub: 'email: amit@... | India', category: 'output', status: 'success', highlight: true, badge: 'Emitted' },
                ],
                note: 'Execution completed in 0.138 ms. Mathematical relation delivered.',
              },
            },
          ],
        },
      ],
    };
  }

  if (num === 7) { // WHERE Clause
    return {
      simTitle: 'SARGable Predicate Filter Pipeline',
      simConcept: 'Streaming row tuples through laser evaluation gates; filtering matching tuples and deflecting non-matching records.',
      scenarios: [
        {
          name: 'Compound SARGable Filter',
          query: "SELECT id, name, salary FROM employees WHERE salary > 60000 AND status = 'active';",
          description: 'Visualizes short-circuit boolean evaluation, index selectivity, and row filtering.',
          steps: [
            {
              title: 'Phase 1: Ingest Candidate Tuples from Relation Heap',
              engineAction: 'Stream 8 KB page row tuples into evaluation gate',
              explanation: 'Three employee records from the table heap enter the execution pipeline. Each row carries physical byte offsets and MVCC visibility transaction headers.',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '2.15 cost units', ioType: 'Heap Fetch', latencyUs: '22 µs', tuplesProcessed: 3 },
              visualState: {
                status: 'processing',
                stageName: 'Tuple Stream Ingestion',
                nodes: [
                  { id: 't1', label: 'Alice ($75k, active)', sub: 'Tuple 1', category: 'tuple', status: 'active', highlight: true, badge: 'Evaluating' },
                  { id: 't2', label: 'Bob ($50k, active)', sub: 'Tuple 2', category: 'tuple', status: 'muted', badge: 'Queued' },
                  { id: 't3', label: 'Charlie ($90k, inactive)', sub: 'Tuple 3', category: 'tuple', status: 'muted', badge: 'Queued' },
                ],
                note: 'Tuples enter CPU instruction pipeline in row-oriented slotted order.',
              },
            },
            {
              title: 'Phase 2: Evaluate SARGable Boolean Predicates',
              engineAction: 'Atomic comparisons with short-circuit evaluation',
              explanation: 'Alice satisfies salary > 60000 AND status = active (both TRUE). Bob fails salary > 60000 (short-circuits to FALSE). Charlie passes salary > 60000 but fails status = active (evaluates to FALSE).',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '2.15 cost units', ioType: 'CPU Predicate Gate', latencyUs: '48 µs', tuplesProcessed: 3 },
              visualState: {
                status: 'matched',
                stageName: 'Laser Evaluation Gate',
                mathFormula: 'P(t) = (t.\\text{salary} > 60000) \\land (t.\\text{status} = \'\\text{active}\') \\implies \\{ \\text{Alice: T}, \\text{Bob: F}, \\text{Charlie: F} \\}',
                nodes: [
                  { id: 't1', label: 'Alice', sub: '75k > 60k (T) & active (T) -> PASS', category: 'output', status: 'success', highlight: true, badge: 'TRUE' },
                  { id: 't2', label: 'Bob', sub: '50k > 60k (F) -> Short-circuit DROP', category: 'tuple', status: 'error', badge: 'FALSE' },
                  { id: 't3', label: 'Charlie', sub: '90k > 60k (T) & inactive (F) -> DROP', category: 'tuple', status: 'error', badge: 'FALSE' },
                ],
                note: 'Non-matching rows hit the rejection deflector barrier and are freed from cache.',
              },
            },
            {
              title: 'Phase 3: Materialize Qualifying Output Projection',
              engineAction: 'Filter complete: emit matching record to output stream',
              explanation: 'Only Alice meets all boolean criteria. The projection engine emits the qualifying tuple to the output stream with selectivity = 33.3%.',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '2.15 cost units', ioType: 'Output Stream', latencyUs: '64 µs', tuplesProcessed: 1 },
              visualState: {
                status: 'success',
                stageName: 'Output Delivery',
                nodes: [
                  { id: 'out1', label: 'Alice (ID: 101, Salary: $75,000)', sub: 'Selectivity: 33.3% | Emitted to Client', category: 'output', status: 'success', highlight: true, badge: 'Emitted' },
                ],
                note: 'Clean mathematical filtering complete with zero intermediate disk spills.',
              },
            },
          ],
        },
      ],
    };
  }

  if (num === 27) { // Foreign Key
    return {
      simTitle: 'Referential Integrity & CASCADE Engine',
      simConcept: 'Foreign keys enforce relational parent-child graph consistency. Deletions cascade atomically through child tables.',
      scenarios: [
        {
          name: 'ON DELETE CASCADE Execution',
          query: 'DELETE FROM departments WHERE id = 1; -- Trigger CASCADE to employees',
          description: 'Visualizes parent X-Lock, child index lookup, and atomic multi-table deletion.',
          steps: [
            {
              title: 'Phase 1: Acquire Row-Level Exclusive Lock on Parent',
              engineAction: 'Evaluate departments WHERE id = 1 and lock parent row',
              explanation: 'The transaction acquires an Exclusive Row Lock (X-Lock) on Department 1 (IT). No other transaction can update or reference this department while the delete is pending.',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '1.05 cost units', ioType: 'X-Lock Acquired', latencyUs: '18 µs', tuplesProcessed: 1 },
              visualState: {
                status: 'processing',
                stageName: 'Parent Row Locking',
                mathFormula: '\\text{Lock}(\\text{Dept}_{\\text{id}=1}, \\text{Exclusive}) \\implies \\text{Block Foreign Updates}',
                nodes: [
                  { id: 'dept1', label: 'Dept #1 (IT)', sub: 'Status: Pending Deletion', category: 'storage', status: 'warning', highlight: true, badge: 'X-Lock' },
                  { id: 'dept2', label: 'Dept #2 (HR)', sub: 'Status: Active (Unaffected)', category: 'storage', status: 'muted' },
                ],
                note: 'Referential integrity triggers internal foreign key cascading handler.',
              },
            },
            {
              title: 'Phase 2: Probe Child FK Index (employees.department_id)',
              engineAction: 'Index Scan on child relation to identify referencing tuples',
              explanation: 'The engine queries the foreign key index on employees.department_id = 1. It finds two referencing employee tuples (Lucky & Amit).',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '3.40 cost units', ioType: 'FK Index Scan', latencyUs: '42 µs', tuplesProcessed: 2 },
              visualState: {
                status: 'matched',
                stageName: 'Child Index Probe',
                mathFormula: '\\sigma_{\\text{dept\\_id}=1}(\\text{Employees}) \\xrightarrow{\\text{FK Index Seek}} \\{ \\text{Emp}_{101}, \\text{Emp}_{103} \\}',
                nodes: [
                  { id: 'emp1', label: 'Emp #101 (Lucky)', sub: 'dept_id: 1 -> CASCADE Target', category: 'tuple', status: 'warning', highlight: true, badge: 'Target' },
                  { id: 'emp2', label: 'Emp #102 (Rahul)', sub: 'dept_id: 2 -> Safe (HR)', category: 'tuple', status: 'muted' },
                  { id: 'emp3', label: 'Emp #103 (Amit)', sub: 'dept_id: 1 -> CASCADE Target', category: 'tuple', status: 'warning', highlight: true, badge: 'Target' },
                ],
                note: 'If an index on department_id is missing, the engine would have to scan the entire employees table!',
              },
            },
            {
              title: 'Phase 3: Atomic Multi-Table Deletion & Commit',
              engineAction: 'Set xmax on child tuples and parent tuple under single Transaction ID',
              explanation: 'Both child rows (Lucky and Amit) and the parent department are marked dead under the same transaction ID in the Write-Ahead Log. Referential integrity is 100% preserved with zero orphaned records.',
              telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '4.80 cost units', ioType: 'WAL Commit Sync', latencyUs: '78 µs', tuplesProcessed: 3 },
              visualState: {
                status: 'success',
                stageName: 'Atomic Cascade Commit',
                mathFormula: '\\text{WAL}(tx_{1042}) \\implies \\{ \\text{Dept}_1^{\\dagger}, \\text{Emp}_{101}^{\\dagger}, \\text{Emp}_{103}^{\\dagger} \\} \\xrightarrow{\\text{fsync}} \\text{Disk}',
                nodes: [
                  { id: 'del_dept', label: 'Dept #1 (IT)', sub: 'DELETED (xmax = tx_id)', category: 'storage', status: 'error', badge: 'Removed' },
                  { id: 'del_emp1', label: 'Emp #101 (Lucky)', sub: 'DELETED by CASCADE', category: 'storage', status: 'error', badge: 'Removed' },
                  { id: 'del_emp3', label: 'Emp #103 (Amit)', sub: 'DELETED by CASCADE', category: 'storage', status: 'error', badge: 'Removed' },
                ],
                note: 'Zero orphaned records remain. Referential invariant strictly maintained.',
              },
            },
          ],
        },
      ],
    };
  }

  // Universal dynamic 3Blue1Brown simulation generator for all other topics
  return generateUniversal3B1BSim(topic);
}

function generateUniversal3B1BSim(topic: SqlTopic): TopicSimData {
  const t = topic.title;
  const num = topic.topicNumber;
  const cat = topic.category;

  return {
    simTitle: `${t} Engine Visual Simulator`,
    simConcept: `Interactive 3Blue1Brown-style architectural animation demonstrating ${t} execution mechanics, memory buffers, and relational invariants.`,
    scenarios: [
      {
        name: 'Standard Execution Trace',
        query: topic.codeSnippet || `EXPLAIN (ANALYZE, BUFFERS) -- Execution Trace for ${t};`,
        description: `Visualizes the step-by-step physical transformation of data inside the database engine for ${t}.`,
        steps: [
          {
            title: `Phase 1: Input Ingestion & Catalog Validation`,
            engineAction: `Parse SQL expression and verify metadata for ${t}`,
            explanation: `The query engine receives the statement, verifies table contracts in the system catalog, and allocates memory buffers in work_mem.`,
            telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '1.20 cost units', ioType: 'Memory Allocation', latencyUs: '25 µs', tuplesProcessed: 0 },
            visualState: {
              status: 'processing',
              stageName: 'Ingestion & Schema Check',
              mathFormula: `\\mathcal{R}_{\\text{in}} \\xrightarrow{\\text{Validate}} \\text{Schema}(\\text{${cat.toUpperCase()}}) \\implies \\text{Invariant Verified}`,
              nodes: [
                { id: 'n1', label: 'SQL Ingestion', sub: `Initiating ${t}`, category: 'tuple', status: 'active', highlight: true, badge: 'Inbound' },
                { id: 'n2', label: 'Catalog Engine', sub: 'Checking Table Invariants', category: 'storage', status: 'success', badge: 'Verified' },
              ],
              note: topic.mentalModel || 'Initial declarative validation passed.',
            },
          },
          {
            title: `Phase 2: Relational Engine Transformation`,
            engineAction: `Execute physical algorithm: ${topic.category.toUpperCase()} operator`,
            explanation: topic.definition,
            telemetry: { bufferHitRate: '98% (RAM Hit)', estimatedCost: '3.85 cost units', ioType: 'Buffer Execution', latencyUs: '64 µs', tuplesProcessed: 2 },
            visualState: {
              status: 'matched',
              stageName: 'Relational Transformation Core',
              mathFormula: `\\mathcal{T}_{\\text{heap}} \\xrightarrow{\\text{Operator}} \\mathcal{R}_{\\text{out}} \\quad [\\text{ACID Guaranteed}]`,
              nodes: [
                { id: 'n3', label: 'Execution Operator', sub: 'Evaluating Invariants', category: 'gate', status: 'success', highlight: true, badge: 'Processing' },
                { id: 'n4', label: 'Shared Buffer RAM', sub: 'Handling 8 KB Slotted Pages', category: 'buffer', status: 'active', badge: 'Cache Hit' },
              ],
              note: 'Engine maintains strict ACID consistency and relational invariants.',
            },
          },
          {
            title: `Phase 3: State Verification & Output Delivery`,
            engineAction: `Commit state changes, serialize tuples, stream output to client`,
            explanation: topic.interviewReadyAnswer,
            telemetry: { bufferHitRate: '100% (RAM)', estimatedCost: '3.85 cost units', ioType: 'Client Stream', latencyUs: '89 µs', tuplesProcessed: 2 },
            visualState: {
              status: 'success',
              stageName: 'Stream Completion',
              mathFormula: `\\text{Success}(\\mathcal{R}_{\\text{out}}) \\implies 100\\% \\text{ Referential & Transactional Consistency}`,
              nodes: [
                { id: 'n5', label: 'Operation Success', sub: 'Invariants Preserved', category: 'output', status: 'success', highlight: true, badge: 'Committed' },
                { id: 'n6', label: 'Result Projection', sub: 'Emitted to Application Socket', category: 'output', status: 'success', badge: 'Emitted' },
              ],
              note: topic.takeaways[0] || 'Declarative execution completed successfully.',
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
  const [playbackSpeed, setPlaybackSpeed] = useState<0.5 | 1 | 2>(1);

  const activeScenario = simData.scenarios[activeScenarioIdx] || simData.scenarios[0];
  const steps = activeScenario.steps;
  const currentStep = steps[currentStepIdx] || steps[0];

  // Auto-play timer with dynamic speed
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && activeTab === 'animation') {
      const intervalMs = 2800 / playbackSpeed;
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, activeTab, playbackSpeed]);

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

  const progressPercent = ((currentStepIdx) / Math.max(1, steps.length - 1)) * 100;

  return (
    <div className="space-y-4">
      {specializedLab && (
        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-border bg-card max-w-fit shadow-2xs">
          <button
            onClick={() => setActiveTab('animation')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'animation'
                ? 'bg-foreground text-background shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>3Blue1Brown Visual Simulation</span>
          </button>
          <button
            onClick={() => setActiveTab('lab')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
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
        <div className="rounded-2xl border border-border/80 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white p-5 sm:p-7 space-y-6 shadow-xl transition-all overflow-hidden relative">
          {/* Subtle 3Blue1Brown Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Visualizer Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Engine Geometry</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-zinc-100">
                  {simData.simTitle}
                </h3>
              </div>
            </div>

            {/* Speed & Step Pills */}
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-0.5 text-[11px] font-mono">
                {([0.5, 1, 2] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded font-bold transition-colors ${
                      playbackSpeed === spd
                        ? 'bg-cyan-500 text-black shadow-xs'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <span className="px-2.5 py-1 rounded-lg border border-cyan-500/20 bg-cyan-950/30 text-cyan-300 font-mono text-xs font-bold">
                Phase {currentStepIdx + 1} of {steps.length}
              </span>
            </div>
          </div>

          {/* Active SQL Statement Console with Laser Border */}
          <div className="space-y-3 relative z-10">
            <div className="p-4 rounded-xl bg-black/90 border border-cyan-500/30 font-mono text-xs sm:text-sm text-zinc-200 flex items-center justify-between gap-3 overflow-x-auto shadow-[0_0_20px_rgba(56,189,248,0.1)]">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400 font-bold shrink-0">SQL&gt;</span>
              </div>
              <code className="text-cyan-300 font-medium flex-1 truncate">{activeScenario.query}</code>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 shrink-0 font-bold">
                {activeScenario.name}
              </span>
            </div>
          </div>

          {/* 3Blue1Brown Telemetry HUD (Heads-Up Display) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 relative z-10">
            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1">
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 uppercase font-bold">
                <HardDrive className="w-3 h-3 text-cyan-400" />
                <span>Buffer Pool</span>
              </div>
              <div className="text-xs sm:text-sm font-mono font-extrabold text-cyan-300">
                {currentStep.telemetry.bufferHitRate}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1">
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 uppercase font-bold">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Planner Cost</span>
              </div>
              <div className="text-xs sm:text-sm font-mono font-extrabold text-amber-300">
                {currentStep.telemetry.estimatedCost}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1">
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 uppercase font-bold">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span>Physical I/O</span>
              </div>
              <div className="text-xs sm:text-sm font-mono font-extrabold text-emerald-300">
                {currentStep.telemetry.ioType}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm space-y-1">
              <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 uppercase font-bold">
                <Clock className="w-3 h-3 text-violet-400" />
                <span>Engine Latency</span>
              </div>
              <div className="text-xs sm:text-sm font-mono font-extrabold text-violet-300">
                {currentStep.telemetry.latencyUs}
              </div>
            </div>
          </div>

          {/* Cinematic Animation Stage Canvas */}
          <div className="p-6 rounded-2xl border border-cyan-500/20 bg-black/60 backdrop-blur-md space-y-6 relative overflow-hidden shadow-inner">
            {/* Stage Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                  {currentStep.visualState.stageName}
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
                  {currentStep.title}
                </h4>
              </div>

              <div className="text-xs font-mono text-zinc-400">
                Action: <span className="text-zinc-200 font-semibold">{currentStep.engineAction}</span>
              </div>
            </div>

            {/* Mathematical Formula / Invariant Banner */}
            {currentStep.visualState.mathFormula && (
              <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-center font-mono text-xs sm:text-sm text-cyan-300 shadow-inner">
                <span className="text-zinc-400 text-xs font-sans mr-2">Formal Invariant:</span>
                <code className="font-bold tracking-wide">{currentStep.visualState.mathFormula}</code>
              </div>
            )}

            {/* Visual Node Graph with Animated Particle Transitions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-h-[140px] items-stretch">
              <AnimatePresence mode="wait">
                {currentStep.visualState.nodes.map((node, nIdx) => {
                  let borderStyle = 'border-zinc-800 bg-zinc-900/60 text-zinc-200';
                  let glowBadge = 'bg-zinc-800 text-zinc-300';

                  if (node.status === 'active') {
                    borderStyle = 'border-cyan-400/60 bg-cyan-950/30 text-white shadow-[0_0_20px_rgba(56,189,248,0.25)]';
                    glowBadge = 'bg-cyan-500 text-black font-extrabold';
                  } else if (node.status === 'success') {
                    borderStyle = 'border-emerald-500/60 bg-emerald-950/30 text-white shadow-[0_0_20px_rgba(52,211,153,0.25)]';
                    glowBadge = 'bg-emerald-400 text-black font-extrabold';
                  } else if (node.status === 'warning') {
                    borderStyle = 'border-amber-500/60 bg-amber-950/30 text-white shadow-[0_0_20px_rgba(251,191,36,0.25)]';
                    glowBadge = 'bg-amber-400 text-black font-extrabold';
                  } else if (node.status === 'error') {
                    borderStyle = 'border-rose-500/60 bg-rose-950/30 text-white shadow-[0_0_20px_rgba(244,63,94,0.25)]';
                    glowBadge = 'bg-rose-500 text-white font-extrabold';
                  } else if (node.status === 'muted') {
                    borderStyle = 'border-zinc-800/40 bg-zinc-900/20 text-zinc-500 opacity-50';
                  }

                  return (
                    <motion.div
                      key={`${currentStepIdx}-${node.id}`}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{ duration: 0.35, delay: nIdx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className={`p-4 rounded-xl border backdrop-blur-sm transition-all flex flex-col justify-between gap-3 ${borderStyle} ${
                        node.highlight ? 'ring-2 ring-cyan-400/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-bold truncate leading-snug">{node.label}</span>
                        {node.badge && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded shadow-xs shrink-0 ${glowBadge}`}>
                            {node.badge}
                          </span>
                        )}
                      </div>

                      {node.sub && (
                        <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                          {node.sub}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Grant Sanderson-style Intuition Callout */}
            <motion.div
              key={`callout-${currentStepIdx}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="p-4 rounded-xl bg-zinc-900/80 border-l-4 border-cyan-400 space-y-2 border border-zinc-800 shadow-sm"
            >
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Engine Transformation Insight</span>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-normal">
                {currentStep.explanation}
              </p>
              {currentStep.visualState.note && (
                <div className="text-xs text-zinc-400 font-mono pt-1.5 border-t border-zinc-800 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{currentStep.visualState.note}</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* 3Blue1Brown Interactive Timeline Scrubber */}
          <div className="space-y-2 relative z-10 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>0% Start</span>
              <span className="text-cyan-300 font-bold">Progress: {Math.round(progressPercent)}%</span>
              <span>100% Commit</span>
            </div>

            {/* Scrubber Track */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const targetIdx = Math.round(ratio * (steps.length - 1));
                setCurrentStepIdx(targetIdx);
              }}
              className="h-3 w-full rounded-full bg-zinc-800/80 border border-zinc-700/80 cursor-pointer relative overflow-hidden p-0.5 group"
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
                style={{ width: `${progressPercent}%` }}
                layout
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 relative z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)]"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-black" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-black" />
                    <span>Auto Play</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-800 bg-zinc-900 text-xs font-bold text-zinc-200 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Phase</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStepIdx === steps.length - 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-xs font-bold text-cyan-200 hover:text-white hover:bg-cyan-900/60 disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-xs"
              >
                <span>Next Phase</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
