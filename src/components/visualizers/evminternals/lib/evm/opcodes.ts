export const OPCODES: Record<number, { name: string; description: string }> = {
  0x00: { name: 'STOP', description: 'Halts execution' },
  0x01: { name: 'ADD', description: 'Addition operation' },
  0x02: { name: 'MUL', description: 'Multiplication operation' },
  0x03: { name: 'SUB', description: 'Subtraction operation' },
  0x04: { name: 'DIV', description: 'Integer division operation' },
  0x05: { name: 'SDIV', description: 'Signed integer division operation (truncated)' },
  0x06: { name: 'MOD', description: 'Modulo remainder operation' },
  0x07: { name: 'SMOD', description: 'Signed modulo remainder operation' },
  0x08: { name: 'ADDMOD', description: 'Modulo addition operation' },
  0x09: { name: 'MULMOD', description: 'Modulo multiplication operation' },
  0x0a: { name: 'EXP', description: 'Exponential operation' },
  0x0b: { name: 'SIGNEXTEND', description: "Extend length of two's complement signed integer" },
  
  0x10: { name: 'LT', description: 'Less-than comparison' },
  0x11: { name: 'GT', description: 'Greater-than comparison' },
  0x12: { name: 'SLT', description: 'Signed less-than comparison' },
  0x13: { name: 'SGT', description: 'Signed greater-than comparison' },
  0x14: { name: 'EQ', description: 'Equality comparison' },
  0x15: { name: 'ISZERO', description: 'Simple not operator' },
  0x16: { name: 'AND', description: 'Bitwise AND operation' },
  0x17: { name: 'OR', description: 'Bitwise OR operation' },
  0x18: { name: 'XOR', description: 'Bitwise XOR operation' },
  0x19: { name: 'NOT', description: 'Bitwise NOT operation' },
  0x1a: { name: 'BYTE', description: 'Retrieve single byte from word' },
  0x1b: { name: 'SHL', description: 'Logical shift left' },
  0x1c: { name: 'SHR', description: 'Logical shift right' },
  0x1d: { name: 'SAR', description: 'Arithmetic shift right' },
  
  0x20: { name: 'KECCAK256', description: 'Compute Keccak-256 hash' },
  
  0x30: { name: 'ADDRESS', description: 'Get address of currently executing account' },
  0x31: { name: 'BALANCE', description: 'Get balance of the given account' },
  0x32: { name: 'ORIGIN', description: 'Get execution-origination address' },
  0x33: { name: 'CALLER', description: 'Get caller address' },
  0x34: { name: 'CALLVALUE', description: 'Get deposited value by the instruction/transaction responsible for this execution' },
  0x35: { name: 'CALLDATALOAD', description: 'Get input data of current environment' },
  0x36: { name: 'CALLDATASIZE', description: 'Get size of input data in current environment' },
  0x37: { name: 'CALLDATACOPY', description: 'Copy input data in current environment to memory' },
  0x38: { name: 'CODESIZE', description: 'Get size of code running in current environment' },
  0x39: { name: 'CODECOPY', description: 'Copy code running in current environment to memory' },
  0x3a: { name: 'GASPRICE', description: 'Get price of gas in current environment' },
  0x3b: { name: 'EXTCODESIZE', description: "Get size of an account's code" },
  0x3c: { name: 'EXTCODECOPY', description: "Copy an account's code to memory" },
  0x3d: { name: 'RETURNDATASIZE', description: 'Get size of output data from the previous call from the current environment' },
  0x3e: { name: 'RETURNDATACOPY', description: 'Copy output data from the previous call to memory' },
  0x3f: { name: 'EXTCODEHASH', description: "Get hash of an account's code" },
  
  0x40: { name: 'BLOCKHASH', description: 'Get the hash of one of the 256 most recent complete blocks' },
  0x41: { name: 'COINBASE', description: "Get the block's beneficiary address" },
  0x42: { name: 'TIMESTAMP', description: "Get the block's timestamp" },
  0x43: { name: 'NUMBER', description: "Get the block's number" },
  0x44: { name: 'DIFFICULTY', description: "Get the block's difficulty" },
  0x45: { name: 'GASLIMIT', description: "Get the block's gas limit" },
  0x46: { name: 'CHAINID', description: 'Get the chain ID' },
  0x47: { name: 'SELFBALANCE', description: 'Get balance of currently executing account' },
  0x48: { name: 'BASEFEE', description: "Get the block's base fee" },
  
  0x50: { name: 'POP', description: 'Remove item from stack' },
  0x51: { name: 'MLOAD', description: 'Load word from memory' },
  0x52: { name: 'MSTORE', description: 'Save word to memory' },
  0x53: { name: 'MSTORE8', description: 'Save byte to memory' },
  0x54: { name: 'SLOAD', description: 'Load word from storage' },
  0x55: { name: 'SSTORE', description: 'Save word to storage' },
  0x56: { name: 'JUMP', description: 'Alter the program counter' },
  0x57: { name: 'JUMPI', description: 'Conditionally alter the program counter' },
  0x58: { name: 'PC', description: 'Get the value of the program counter prior to the increment' },
  0x59: { name: 'MSIZE', description: 'Get the size of active memory in bytes' },
  0x5a: { name: 'GAS', description: 'Get the amount of available gas, including the corresponding reduction' },
  0x5b: { name: 'JUMPDEST', description: 'Mark a valid destination for jumps' },
  
  // 0x60 - 0x7f: PUSH1 - PUSH32
  // 0x80 - 0x8f: DUP1 - DUP16
  // 0x90 - 0x9f: SWAP1 - SWAP16
  
  0xa0: { name: 'LOG0', description: 'Append log record with no topics' },
  0xa1: { name: 'LOG1', description: 'Append log record with one topic' },
  0xa2: { name: 'LOG2', description: 'Append log record with two topics' },
  0xa3: { name: 'LOG3', description: 'Append log record with three topics' },
  0xa4: { name: 'LOG4', description: 'Append log record with four topics' },
  
  0xf0: { name: 'CREATE', description: 'Create a new account with associated code' },
  0xf1: { name: 'CALL', description: 'Message-call into an account' },
  0xf2: { name: 'CALLCODE', description: "Message-call into this account with an alternative account's code" },
  0xf3: { name: 'RETURN', description: 'Halt execution returning output data' },
  0xf4: { name: 'DELEGATECALL', description: "Message-call into this account with an alternative account's code, but persisting the current values for sender and value" },
  0xf5: { name: 'CREATE2', description: 'Create a new account with associated code at a deterministic address' },
  0xfa: { name: 'STATICCALL', description: 'Static message-call into an account' },
  0xfd: { name: 'REVERT', description: 'Halt execution reverting state changes but returning data and remaining gas' },
  0xfe: { name: 'INVALID', description: 'Designated invalid instruction' },
  0xff: { name: 'SELFDESTRUCT', description: 'Halt execution and register account for later deletion' },
};

// Fill in PUSH, DUP, SWAP
for (let i = 1; i <= 32; i++) {
  OPCODES[0x60 + i - 1] = { name: `PUSH${i}`, description: `Place ${i}-byte item on stack` };
}
for (let i = 1; i <= 16; i++) {
  OPCODES[0x80 + i - 1] = { name: `DUP${i}`, description: `Duplicate ${i}th stack item` };
  OPCODES[0x90 + i - 1] = { name: `SWAP${i}`, description: `Exchange 1st and ${i+1}th stack items` };
}
