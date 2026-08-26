// Compiler pipeline knowledge base for the expression '2 + 3 * (4 - 1)'.
// Pure data and pure helpers - no browser APIs - safe for module scope.

export const EXPRESSION = '2 + 3 * (4 - 1)';
export const FINAL_RESULT = 11;

export type TokenKind = 'number' | 'operator' | 'lparen' | 'rparen';

export interface TokenDef {
  kind: TokenKind;
  text: string;
}

/** Step 1 output - the lexer's token stream, in source order. */
export const TOKENS: TokenDef[] = [
  { kind: 'number', text: '2' },
  { kind: 'operator', text: '+' },
  { kind: 'number', text: '3' },
  { kind: 'operator', text: '*' },
  { kind: 'lparen', text: '(' },
  { kind: 'number', text: '4' },
  { kind: 'operator', text: '-' },
  { kind: 'number', text: '1' },
  { kind: 'rparen', text: ')' },
];

export type AstKind = 'op' | 'num';

export interface AstNodeDef {
  id: string;
  label: string;
  kind: AstKind;
  /** Center coordinates inside an 800x430 canvas (percentages derived on render). */
  x: number;
  y: number;
}

/**
 * Step 2 output - AST nodes listed in construction (bottom-up) order:
 * operands attach first, then their operator parents, root last.
 */
export const AST_NODES: AstNodeDef[] = [
  { id: 'n2', label: '2', kind: 'num', x: 140, y: 170 },
  { id: 'n3', label: '3', kind: 'num', x: 440, y: 280 },
  { id: 'n4', label: '4', kind: 'num', x: 565, y: 392 },
  { id: 'n1', label: '1', kind: 'num', x: 725, y: 392 },
  { id: 'sub', label: '\u2212', kind: 'op', x: 650, y: 285 },
  { id: 'mul', label: '\u00D7', kind: 'op', x: 545, y: 175 },
  { id: 'add', label: '+', kind: 'op', x: 340, y: 60 },
];

export interface AstEdgeDef {
  parent: string;
  child: string;
}

/** parent <- child wiring; drawn once both endpoint nodes exist. */
export const AST_EDGES: AstEdgeDef[] = [
  { parent: 'add', child: 'n2' },
  { parent: 'add', child: 'mul' },
  { parent: 'mul', child: 'n3' },
  { parent: 'mul', child: 'sub' },
  { parent: 'sub', child: 'n4' },
  { parent: 'sub', child: 'n1' },
];

export interface InstrDef {
  op: 'PUSH' | 'ADD' | 'SUB' | 'MUL';
  arg?: number;
  note: string;
}

/** Step 3 output - post-order bytecode emitted from the AST. */
export const BYTECODE: InstrDef[] = [
  { op: 'PUSH', arg: 2, note: 'left operand of +' },
  { op: 'PUSH', arg: 3, note: 'left operand of *' },
  { op: 'PUSH', arg: 4, note: 'minuend inside parens' },
  { op: 'PUSH', arg: 1, note: 'subtrahend inside parens' },
  { op: 'SUB', note: '(4 \u2212 1) \u2192 3 - parentheses won' },
  { op: 'MUL', note: '3 \u00D7 3 \u2192 9 - precedence honored' },
  { op: 'ADD', note: '2 + 9 \u2192 11 - final value' },
];

export interface ExecStep {
  pc: number;
  label: string;
  popped: number[];
  pushed: number | null;
  stackAfter: number[];
  explain: string;
}

const OP_SYMBOL: Record<string, string> = { ADD: '+', SUB: '\u2212', MUL: '\u00D7' };

/** Pure replay of BYTECODE against an abstract operand-stack machine. */
export function buildExecSteps(): ExecStep[] {
  const out: ExecStep[] = [];
  const stack: number[] = [];
  BYTECODE.forEach((ins, pc) => {
    if (ins.op === 'PUSH') {
      const v = ins.arg ?? 0;
      stack.push(v);
      out.push({
        pc,
        label: 'PUSH ' + v,
        popped: [],
        pushed: v,
        stackAfter: [...stack],
        explain: 'Load the constant ' + v + ' onto the operand stack.',
      });
      return;
    }
    const b = stack.pop();
    const a = stack.pop();
    const rhs = b === undefined ? 0 : b;
    const lhs = a === undefined ? 0 : a;
    const r = ins.op === 'ADD' ? lhs + rhs : ins.op === 'SUB' ? lhs - rhs : lhs * rhs;
    stack.push(r);
    out.push({
      pc,
      label: ins.op,
      popped: [lhs, rhs],
      pushed: r,
      stackAfter: [...stack],
      explain:
        'Pop ' + rhs + ', pop ' + lhs + ' \u2192 ' + lhs + ' ' + (OP_SYMBOL[ins.op] ?? '?') + ' ' +
        rhs + ' = ' + r + ', push the result.',
    });
  });
  return out;
}

/** Replay computed once at module scope (pure, SSR-safe). */
export const EXEC_STEPS: ExecStep[] = buildExecSteps();

export interface PhaseMeta {
  id: string;
  step: string;
  title: string;
  tagline: string;
  breaks: string[];
}

export const PHASES: PhaseMeta[] = [
  {
    id: 'lex',
    step: 'Step 1',
    title: 'Lexer',
    tagline: 'characters \u2192 typed tokens',
    breaks: [
      'No token types: the parser would face raw characters and cannot tell the digits \u00222\u0022,\u00223\u0022 apart from a real number token.',
      'Whitespace, keyword, and operator spelling rules would be re-implemented ad hoc inside the parser.',
      'Errors surface late and vague - \u0022unexpected character\u0022 instead of a precise lexical diagnostic.',
    ],
  },
  {
    id: 'parse',
    step: 'Step 2',
    title: 'Parser',
    tagline: 'tokens \u2192 AST',
    breaks: [
      'A flat token list carries no precedence: 2 + 3 \u00D7 4 could legally mean (2 + 3) \u00D7 4.',
      'Parentheses hold zero grouping power without a grammar - the nesting structure simply does not exist yet.',
      'Broken syntax like a missing bracket would explode mid-evaluation instead of failing fast with a location.',
    ],
  },
  {
    id: 'codegen',
    step: 'Step 3',
    title: 'Code generation',
    tagline: 'AST \u2192 linear bytecode',
    breaks: [
      'Execution would chase tree pointers node by node - cache-hostile, slow, and hard to optimize.',
      'Nothing serializable: bytecode is the artifact that gets cached (.pyc), shipped, and run portably.',
      'Constant folding and peephole passes work on flat instruction runs, not on live object graphs.',
    ],
  },
  {
    id: 'exec',
    step: 'Step 4',
    title: 'Stack machine',
    tagline: 'bytecode \u2192 value',
    breaks: [
      'Instructions name no registers or addresses - without push/pop discipline nothing ever computes.',
      'Each operator would need bespoke glue per operand shape; the stack contract keeps them uniform.',
      'Intermediates like (4 \u2212 1) need somewhere to live between operations - the stack is that place.',
    ],
  },
];

/** How many reveal ticks each phase needs. */
export function phaseTotal(phaseIdx: number): number {
  if (phaseIdx === 0) return TOKENS.length;
  if (phaseIdx === 1) return AST_NODES.length;
  if (phaseIdx === 2) return BYTECODE.length;
  return EXEC_STEPS.length;
}
