export type InterviewCategoryKey =
  | 'fullstack'
  | 'cybersecurity'
  | 'dsa'
  | 'system-design'
  | 'ai-ml';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Frequency = 'very-often' | 'sometimes' | 'rare';
export type InterviewRound = 'phone-screen' | 'coding' | 'system-design' | 'concept';
export type QuestionType = 'concept' | 'debugging' | 'design' | 'coding';

export const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];
export const FREQUENCIES: Frequency[] = ['very-often', 'sometimes', 'rare'];
export const ROUNDS: InterviewRound[] = ['phone-screen', 'coding', 'system-design', 'concept'];
export const QUESTION_TYPES: QuestionType[] = ['concept', 'debugging', 'design', 'coding'];

/* ---------- Animation specs (plain JSON — serializable across RSC boundary) ---------- */

export interface FlowNode {
  id: string;
  label: string;
  sublabel?: string;
}

export interface FlowPacket {
  from: string;
  to: string;
  label?: string;
}

export interface FlowPhase {
  id: string;
  caption: string;
  packets?: FlowPacket[];
  activeNodeIds?: string[];
  doneNodeIds?: string[];
  errorNodeIds?: string[];
}

export interface StepFlowSpec {
  kind: 'step-flow';
  nodes: FlowNode[];
  /** Ordered top-to-bottom (or left-to-right on wide screens). */
  phases: FlowPhase[];
}

export interface CodeTraceFrame {
  id: string;
  caption: string;
  /** 1-based line numbers to highlight. */
  activeLines: number[];
  variables: { name: string; value: string; changed?: boolean }[];
  output?: string;
}

export interface CodeTraceSpec {
  kind: 'code-trace';
  language: string;
  code: string;
  frames: CodeTraceFrame[];
}

export interface TimelineLane {
  id: string;
  label: string;
  kind: 'call' | 'microtask' | 'macrotask' | 'render' | 'custom';
}

export interface TimelineFrame {
  id: string;
  caption: string;
  marks: { laneId: string; label: string; status: 'active' | 'done' }[];
}

export interface TimelineSpec {
  kind: 'timeline';
  lanes: TimelineLane[];
  frames: TimelineFrame[];
}

export interface PanelLine {
  text: string;
  tone: 'neutral' | 'danger' | 'success';
}

export interface BeforeAfterSpec {
  kind: 'before-after';
  beforeLabel: string;
  afterLabel: string;
  before: PanelLine[];
  after: PanelLine[];
  /** Frames progressively highlight lines; indexes reference the arrays above. */
  frames: { id: string; caption: string; beforeIndex: number; afterIndex: number }[];
}

export interface MemoryBox {
  id: string;
  label: string;
  value?: string;
  highlight?: boolean;
}

export interface MemoryRegion {
  id: string;
  label: string;
  kind: 'stack' | 'heap' | 'storage';
  boxes: MemoryBox[];
}

export interface MemoryCursor {
  id: string;
  label: string;
  targetBoxId: string;
  tone: 'primary' | 'danger' | 'success';
}

export interface MemoryFrame {
  id: string;
  caption: string;
  cursors: MemoryCursor[];
  highlightBoxIds?: string[];
}

export interface MemoryDiagramSpec {
  kind: 'memory-diagram';
  regions: MemoryRegion[];
  frames: MemoryFrame[];
}

export interface CustomAnimationSpec {
  kind: 'custom';
  /** Key into the custom animation registry (see AnimationBlock). */
  key: 'attention-scaling';
}

export type AnimationSpec =
  | StepFlowSpec
  | CodeTraceSpec
  | TimelineSpec
  | BeforeAfterSpec
  | MemoryDiagramSpec
  | CustomAnimationSpec;

/* ---------- Content model ---------- */

export interface QuestionStep {
  title: string;
  /** Markdown-ish plain text; paragraphs separated by blank lines. Keep it prose, no raw HTML. */
  body: string;
  code?: { language: string; source: string };
  animation: AnimationSpec;
}

export interface FollowUp {
  q: string;
  a: string;
}

export interface RelatedEngine {
  label: string;
  href: string;
}

export interface InterviewQuestion {
  slug: string;
  category: InterviewCategoryKey;
  topic: string;
  title: string;
  difficulty: Difficulty;
  frequency: Frequency;
  round: InterviewRound;
  type: QuestionType;
  tags: string[];
  /** One-sentence pitch shown on cards. */
  oneLiner: string;
  /** "What interviewers are testing" — 1 short paragraph. */
  whyAsked: string;
  /** TL;DR mental model — 2-4 sentences. */
  mentalModel: string;
  steps: QuestionStep[];
  edgeCases: string[];
  followUps: FollowUp[];
  relatedEngine?: RelatedEngine;
}

export interface InterviewCategory {
  key: InterviewCategoryKey;
  title: string;
  shortTitle: string;
  description: string;
  /** lucide-react icon name, resolved in the UI via a small map. */
  icon: 'Layers' | 'ShieldAlert' | 'Binary' | 'Network' | 'BrainCircuit';
  /** Tailwind text color class, e.g. 'text-blue-500'. */
  accent: string;
  /** Display taxonomy for filters (chips are derived from actual questions). */
  topics: string[];
}
