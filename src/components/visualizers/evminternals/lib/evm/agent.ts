import type { EVMState } from '../../types/evm';
import { OPCODES } from './opcodes';

export interface AgentResponse {
  thought: string;
  suggestion?: string;
  warning?: string;
}

export class EVMAssistant {
  analyze(state: EVMState): AgentResponse {
    const pc = state.pc;
    const op = state.code[pc];
    const opcode = OPCODES[op];

    if (state.status === 'halted') {
      return {
        thought: "The execution has successfully halted. The stack and memory state represent the final result of your program.",
        suggestion: "Try modifying the bytecode to experiment with different outcomes!"
      };
    }

    if (state.status === 'error') {
      return {
        thought: `Execution failed with error: ${state.error}.`,
        warning: "Make sure you have enough gas and all jump destinations are valid JUMPDEST (0x5b) instructions."
      };
    }

    if (state.status === 'reverted') {
       return {
         thought: "The transaction was reverted. This typically happens when a condition isn't met or a REVERT opcode is executed.",
         warning: "All state changes have been rolled back, but gas was still consumed."
       };
    }

    const responses: AgentResponse[] = [];

    // Rule-based analysis
    if (opcode?.name.startsWith('PUSH')) {
      responses.push({
        thought: `Currently at PUSH instruction. It's going to place a value on top of the stack.`,
        suggestion: "Observe how the stack grows after the next step."
      });
    } else if (opcode?.name === 'ADD' || opcode?.name === 'SUB' || opcode?.name === 'MUL') {
      if (state.stack.length < 2) {
        responses.push({
          thought: `The next opcode is ${opcode.name}, which requires 2 items on the stack.`,
          warning: "Stack underflow imminent! Make sure you have enough items before calling arithmetic opcodes."
        });
      } else {
        responses.push({
          thought: `Ready to perform ${opcode.name} on the top two stack items.`
        });
      }
    } else if (opcode?.name === 'MSTORE') {
      responses.push({
        thought: "Storing a value into volatile memory. This is often used for preparing return data or complex structures.",
        suggestion: "Check the Memory visualizer to see the expansion cost and updated bytes."
      });
    } else if (opcode?.name === 'SSTORE') {
      responses.push({
        thought: "Writing to persistent storage. This is an expensive operation that updates the blockchain state.",
        warning: "SSTORE costs up to 20,000 gas for new slots!"
      });
    } else if (opcode?.name === 'JUMPI') {
      responses.push({
        thought: "Conditional jump ahead. The execution will branch depending on whether the second stack item is zero.",
        suggestion: "Verify the jump destination is a valid JUMPDEST."
      });
    }

    return responses[0] || {
      thought: `Executing ${opcode?.name || 'unknown opcode'}. The EVM is currently in the ${state.status} state.`,
      suggestion: "Click 'Step' to proceed with the next instruction."
    };
  }
}
