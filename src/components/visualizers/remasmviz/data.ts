// x86-64 step-through program for the reverse-engineering workshop:
// check_password(guess) compares the input byte-by-byte against a hardcoded
// secret and jumps to a success or failure stub. Pure data - no browser APIs.

export const SECRET = 's3cr3t';
export const SECRET_BASE = 0x402010;
export const GUESS_BUFFER_ADDR = 0x7ffd1a40;
export const STACK_TOP = 0x7ffd2ff8;
export const MAX_GUESS_LEN = 16;

export type RegName = 'RIP' | 'RAX' | 'RBX' | 'RCX' | 'RSI' | 'RDI' | 'RSP';

export type Op =
  | { kind: 'init-secret' }
  | { kind: 'zero-counter' }
  | { kind: 'load-guess-byte' }
  | { kind: 'load-secret-byte' }
  | { kind: 'compare' }
  | { kind: 'jump-ne-fail'; target: number }
  | { kind: 'test-nul' }
  | { kind: 'jump-e-success'; target: number }
  | { kind: 'inc-counter' }
  | { kind: 'jmp-loop'; target: number }
  | { kind: 'set-return'; value: number }
  | { kind: 'ret' };

export interface Instruction {
  /** Hex instruction pointer address, e.g. "004005fc". */
  addr: string;
  text: string;
  explain: string;
  reInsight: string;
  op: Op;
}

/** Index of the loop head inside INSTRUCTIONS. */
export const LOOP_START = 2;

/**
 * The program. Branch targets are indices into this array so the simulator
 * stays trivially auditable.
 */
export const INSTRUCTIONS: Instruction[] = [
  {
    addr: '004005fc',
    text: 'mov   rsi, 0x402010',
    explain:
      'Load the address of the stored secret into RSI. From here on, RSI points at the reference string sitting in .data.',
    reInsight: 'Hardcoded data address: run strings(1) on the binary and the secret falls out before any dynamic analysis.',
    op: { kind: 'init-secret' },
  },
  {
    addr: '00400600',
    text: 'xor   rcx, rcx',
    explain: 'Zero RCX. XOR-ing a register with itself is the shortest encoding of zero.',
    reInsight: 'The classic zeroing idiom announces a loop counter - expect a byte-wise compare loop directly below.',
    op: { kind: 'zero-counter' },
  },
  {
    addr: '00400603',
    text: 'movzx eax, byte ptr [rdi+rcx]',
    explain: 'Read one byte of the caller-supplied guess at offset RCX into AL, zero-extending it into RAX.',
    reInsight: 'Attacker-controlled bytes enter here - trace where RDI was filled to find the input surface.',
    op: { kind: 'load-guess-byte' },
  },
  {
    addr: '00400608',
    text: 'movzx ebx, byte ptr [rsi+rcx]',
    explain: 'Read the matching secret byte into BL for the current index.',
    reInsight: 'The secret is consumed one byte per iteration, so total iterations leak the string length.',
    op: { kind: 'load-secret-byte' },
  },
  {
    addr: '0040060d',
    text: 'cmp   al, bl',
    explain: 'Subtract AL - BL internally and set flags only; ZF=1 means the two bytes are equal.',
    reInsight: 'The whole password check collapses into flag bits - patching this to cmp al,al makes every password pass.',
    op: { kind: 'compare' },
  },
  {
    addr: '0040060f',
    text: 'jne   0x00400626',
    explain: 'If ZF=0 (mismatch) abandon the loop immediately and jump to the failure stub.',
    reInsight: 'Early exit on first difference: response time grows with the matching prefix - a textbook timing oracle.',
    op: { kind: 'jump-ne-fail', target: 12 },
  },
  {
    addr: '00400615',
    text: 'test  al, al',
    explain: 'AND AL with itself to set flags; ZF=1 only when AL holds the NUL terminator.',
    reInsight: 'Confirms C-string semantics: the NUL probe leaks the exact password length to anyone tracing the loop.',
    op: { kind: 'test-nul' },
  },
  {
    addr: '00400617',
    text: 'je    0x00400621',
    explain: 'Both strings ended together - take the acceptance branch.',
    reInsight: 'One-instruction crack: force this jump (or NOP the jne above) and the check always succeeds.',
    op: { kind: 'jump-e-success', target: 10 },
  },
  {
    addr: '00400619',
    text: 'inc   rcx',
    explain: 'Advance the loop index by one byte.',
    reInsight: 'A stride of 1 confirms a byte-wide compare, not an optimized word-wide one.',
    op: { kind: 'inc-counter' },
  },
  {
    addr: '0040061a',
    text: 'jmp   0x00400603',
    explain: 'Jump back to the loop head for the next pair of bytes.',
    reInsight: 'The backward edge marks the hot path - in a debugger, this is where a breakpoint pays rent.',
    op: { kind: 'jmp-loop', target: LOOP_START },
  },
  {
    addr: '00400621',
    text: 'mov   eax, 1',
    explain: 'Set the return value to 1 - success - before handing control back.',
    reInsight: 'Return-value contract recovered: flipping this constant in a patch reverses the verdict everywhere.',
    op: { kind: 'set-return', value: 1 },
  },
  {
    addr: '00400626',
    text: 'ret',
    explain: 'Pop the return address and resume the caller with RAX = 1: access granted.',
    reInsight: 'A reverser now writes a keygen: any string terminating at the same NUL-aligned length is accepted.',
    op: { kind: 'ret' },
  },
  {
    addr: '0040062b',
    text: 'xor   eax, eax',
    explain: 'Failure stub: set the return value to 0.',
    reInsight: 'A two-byte failure stub - binary diffing versions highlights exactly these verdict constants.',
    op: { kind: 'set-return', value: 0 },
  },
  {
    addr: '0040062e',
    text: 'ret',
    explain: 'Resume the caller with RAX = 0: access denied.',
    reInsight: 'End of analysis - the control-flow graph is fully mapped and decompiles to near-original C.',
    op: { kind: 'ret' },
  },
];

/** Labels rendered as separators in the code listing. */
export const SECTION_LABELS: Record<number, string> = {
  [LOOP_START]: '.loop:',
  10: '.success:',
  12: '.fail:',
};
