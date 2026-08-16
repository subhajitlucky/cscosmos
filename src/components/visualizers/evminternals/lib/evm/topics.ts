export interface Topic {
  id: string;
  title: string;
  description: string;
  bytecode?: string;
  content: string;
}

export const TOPICS: Topic[] = [
  {
    id: 'intro',
    title: 'What is the EVM?',
    description: 'Overview of the Ethereum Virtual Machine.',
    content: 'The Ethereum Virtual Machine (EVM) is the heart of the Ethereum protocol. It is a quasi-Turing complete machine that executes smart contract code. Unlike a physical CPU, the EVM is a software-based machine that ensures every node on the network reaches the exact same state after executing a transaction. It processes 256-bit words, which are optimized for Keccak-256 hashing and elliptic curve operations.'
  },
  {
    id: 'execution-env',
    title: 'Execution Environment',
    description: 'The context where code runs.',
    content: 'Every execution in the EVM happens within a specific context. This context includes the code being run, the caller (msg.sender), the value sent (msg.value), and environmental data like block number and timestamp. When a contract calls another contract, a new execution context is created, and the old one is saved on a call stack.'
  },
  {
    id: 'stack',
    title: 'Stack Machine Model',
    description: 'Understanding the LIFO architecture.',
    bytecode: '6001600201', // PUSH1 01 PUSH1 02 ADD
    content: 'The EVM uses a Last-In, First-Out (LIFO) stack to store small pieces of data needed for operations. The stack can hold up to 1024 items, each 256 bits wide. Most opcodes work by popping one or more items from the top, performing a calculation, and pushing the result back. For example, ADD pops two numbers and pushes their sum.'
  },
  {
    id: 'memory',
    title: 'Memory Model',
    description: 'Volatile byte-addressable space.',
    bytecode: '604260005260206000f3', // PUSH1 42 PUSH1 00 MSTORE PUSH1 20 PUSH1 00 RETURN
    content: 'Memory is a temporary, byte-addressable linear space. It is used to store complex data like strings, arrays, or structs during execution. Unlike the stack, you can access any byte in memory at any time. However, memory is volatile—it is wiped clean once execution finishes. Memory expansion has a quadratic gas cost, meaning it gets exponentially more expensive as you use more of it.'
  },
  {
    id: 'storage',
    title: 'Storage & Persistence',
    description: 'The permanent state of a contract.',
    bytecode: '60ff600055', // PUSH1 ff PUSH1 00 SSTORE
    content: 'Storage is a persistent key-value store that lasts forever on the blockchain. It maps 256-bit keys to 256-bit values. Every smart contract has its own isolated storage area. Writing to storage (SSTORE) is one of the most expensive operations in the EVM because every node in the network must store that data indefinitely.'
  },
  {
    id: 'storage-layout',
    title: 'Storage Slots & Layout',
    description: 'How variables map to slots.',
    bytecode: '60016000556002600155', // Store 1 in slot 0, 2 in slot 1
    content: 'In Solidity, state variables are mapped to 32-byte storage slots starting from index 0. If multiple variables can fit into a single 32-byte slot (like two uint128s), the compiler will "pack" them to save gas. For dynamic types like mappings and arrays, the storage slot is determined by hashing the key or the index using Keccak-256.'
  },
  {
    id: 'opcodes',
    title: 'Opcodes Overview',
    description: 'The instruction set of the EVM.',
    bytecode: '6005600402600301', // (5 * 4) + 3
    content: 'Opcodes are the individual instructions that the EVM understands. There are over 140 unique opcodes, ranging from simple arithmetic (ADD, MUL) to environment queries (BALANCE, BLOCKHASH) and state manipulation (SSTORE, LOG). Each opcode is represented by a single byte (0x00 to 0xff).'
  },
  {
    id: 'control-flow',
    title: 'Control Flow',
    description: 'JUMP, JUMPI and JUMPDEST.',
    bytecode: '600a60015760006000fd5b6042600052', 
    content: 'Execution usually flows line by line. JUMP and JUMPI allow the program to skip to different parts of the code. A JUMP takes the destination from the stack and moves the Program Counter (PC) there. For security, the destination MUST be a JUMPDEST (0x5b) instruction, or the execution will fail.'
  },
  {
    id: 'gas',
    title: 'Gas Model',
    description: 'Fueling the decentralized computer.',
    bytecode: '60016000556002600055', // Updating same slot is cheaper than creating it
    content: 'Gas is a unit of measurement for the computational effort required to execute an operation. Every opcode has a fixed gas cost (e.g., ADD costs 3 gas). This prevents infinite loops and DDoS attacks on the network. If a transaction runs out of gas, all changes are reverted, but the gas is still paid to the miner.'
  },
  {
    id: 'calls',
    title: 'Calls & Contexts',
    description: 'CALL, DELEGATECALL, STATICCALL.',
    content: 'The EVM provides several ways for contracts to interact. CALL sends a message to another account. DELEGATECALL is special: it executes the target contract\'s code but uses the CALLING contract\'s storage and context. STATICCALL is like CALL but prevents any state changes (read-only).'
  },
  {
    id: 'reverts',
    title: 'Reverts & Errors',
    description: 'Handling failure gracefully.',
    bytecode: '6001600014600a5760006000fd5b', // If 1 == top, jump, else revert
    content: 'When an error occurs or a requirement isn\'t met, the REVERT opcode stops execution and undoes all state changes made during the transaction. However, it allows returning a reason (error message) to the caller. Other error types like INVALID or Out-of-Gas also revert state but might consume all remaining gas.'
  }
];