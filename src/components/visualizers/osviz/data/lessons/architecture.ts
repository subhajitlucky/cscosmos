import type { OSLesson } from './types';

export const architectureLessons: OSLesson[] = [
  {
    chapterId: 'instruction-cycle',
    hook:
      'Every instruction follows the same rhythm: fetch, decode, execute, write back. Interrupts are checked between beats, not in the middle of one.',
    objectives: [
      'List the four phases of the instruction cycle.',
      'Explain the role of the PC, IR, MAR, and MDR.',
      'Trace a simple add instruction.',
      'Know where interrupts are checked.',
    ],
    sections: [
      {
        title: 'Fetch and decode',
        body:
          'The program counter holds the address of the next instruction. The CPU copies the PC to the memory address register, reads the instruction into the memory data register, and loads it into the instruction register. The PC advances. The decoder determines the opcode, the operands, and the addressing mode.',
        code: String.raw`MAR = PC
MDR = memory[MAR]
IR = MDR
PC = PC + instruction_size
decode(IR)`,
      },
      {
        title: 'Execute and write back',
        body:
          'The execution unit reads the operands, performs the operation, and writes the result to a register or memory. The write-back phase commits the result. Some instructions need several cycles: indirect addressing needs an extra memory read, and a multiply may take multiple cycles. The control unit sequences these steps.',
        code: String.raw`operand1 = read(register or memory)
operand2 = read(register or immediate)
result = ALU(op, operand1, operand2)
write(result, destination)`,
      },
      {
        title: 'Interrupts at instruction boundaries',
        body:
          'The CPU checks for pending interrupts after completing an instruction. If one is pending, it saves the current PC and status, switches to kernel mode, and jumps to the handler. This is why an interrupt does not corrupt a partially executed instruction: the instruction either finishes or is restarted.',
      },
    ],
    keyTakeaways: [
      'The cycle is fetch, decode, execute, write back.',
      'The PC points to the next instruction.',
      'The IR holds the current instruction; MAR/MDR handle memory transfers.',
      'Interrupts are checked at instruction boundaries.',
      'Some instructions need extra cycles for operands.',
    ],
    pitfalls: [
      'Thinking the PC points to the current instruction after fetch; it advances.',
      'Confusing the IR with the instruction memory.',
      'Assuming every instruction completes in one cycle.',
    ],
    focusPoints: [
      'Trace an add instruction through the four phases.',
      'Name the registers and their jobs.',
      'Explain why interrupts are checked at boundaries.',
    ],
    quiz: [
      {
        question: 'What does the program counter hold?',
        options: ['The current instruction', 'The address of the next instruction', 'The last result', 'The stack pointer'],
        answer: 1,
        explanation:
          'The PC holds the address of the next instruction to fetch; it advances after the fetch.',
      },
      {
        question: 'When does the CPU check for pending interrupts?',
        options: ['After each instruction', 'Only at boot', 'Inside the ALU', 'During the fetch only'],
        answer: 0,
        explanation:
          'Interrupts are recognized at instruction boundaries so the machine state is well defined.',
      },
    ],
  },

  {
    chapterId: 'addressing-modes',
    hook:
      'The instruction says what to do; the addressing mode says where the operand is. Direct, indirect, relative, indexed, and paging each compute a different effective address.',
    objectives: [
      'Explain the effective address.',
      'Compute direct, indirect, relative, indexed, and paging addresses.',
      'Know the cost of indirect addressing.',
      'Match addressing modes to arrays and position-independent code.',
    ],
    sections: [
      {
        title: 'Direct and indirect',
        body:
          'In direct addressing, the instruction contains the operand address. The CPU reads that address once. In indirect addressing, the instruction contains an address that points to the operand address. The CPU must read memory once to get the effective address and again to get the operand, so indirect addressing costs an extra memory access.',
        code: String.raw`direct:    EA = address_in_instruction
indirect:  EA = memory[address_in_instruction]
           operand = memory[EA]`,
      },
      {
        title: 'Relative and indexed',
        body:
          'Relative addressing adds a signed offset to the program counter. It supports position-independent code because the offset is relative to the current instruction. Indexed addressing adds an index register to a base address, which is how arrays are traversed: the base points to the array and the index selects the element.',
        code: String.raw`relative: EA = PC + offset
indexed:  EA = base + index
array[i]: base = &array[0], index = i * element_size`,
      },
      {
        title: 'Paging addressing',
        body:
          'Paging addressing translates a virtual address through the page table before the memory access. The CPU splits the address into a virtual page number and an offset, looks up the frame, and forms the physical address. If the page is not present, the access raises a page fault instead of completing.',
        code: String.raw`vpn    = vaddr / page_size
offset = vaddr % page_size
frame  = page_table[vpn]
paddr  = frame * page_size + offset`,
      },
    ],
    keyTakeaways: [
      'The effective address is the final address used by the CPU.',
      'Direct uses the address in the instruction.',
      'Indirect uses a pointer and costs an extra memory read.',
      'Relative supports position-independent code.',
      'Indexed supports arrays; paging translates through a page table.',
    ],
    pitfalls: [
      'Confusing the address in the instruction with the operand.',
      'Forgetting the extra memory access for indirect addressing.',
      'Mixing up relative and indexed addressing.',
    ],
    focusPoints: [
      'Compute the effective address for each mode.',
      'Know which mode supports arrays and which supports position independence.',
      'Know why indirect addressing is slower.',
    ],
    quiz: [
      {
        question: 'Which addressing mode uses a pointer to the operand address?',
        options: ['Direct', 'Indirect', 'Immediate', 'Register'],
        answer: 1,
        explanation:
          'Indirect addressing stores an address that points to the operand address, requiring an extra memory access.',
      },
      {
        question: 'Which mode adds an index register to a base address?',
        options: ['Relative', 'Indexed', 'Direct', 'Paging'],
        answer: 1,
        explanation:
          'Indexed addressing computes the effective address as base + index, which is useful for arrays.',
      },
    ],
  },
];
