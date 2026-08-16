import { type Topic } from "../topics";
import { Cpu } from "lucide-react";

export const evmModel: Topic = {
    id: "evm-model",
    title: "EVM & Architecture",
    category: "Internals",
    icon: Cpu,
    shortDescription: "Understand the Stack, Memory, and Storage.",
    definition: "The Ethereum Virtual Machine (EVM) is a stack-based computer. It has no registers, but it has access to three main data locations: the Stack (for calculations), Memory (temporary byte array), and Storage (persistent key-value store).",
    useCases: [
        "Debugging reverts by understanding stack traces.",
        "Optimizing gas by using memory over storage.",
        "Writing assembly (Yul) for highly optimized code."
    ],
    syntaxExample: `// The EVM processes bytecode, but in Solidity:

// Stack operations (implicit)
uint256 a = 1;
uint256 b = 2;
uint256 c = a + b; // POP a, POP b, ADD, PUSH c

// Memory operations
string memory name = "Solidity"; // MSTORE

// Storage operations
uint256 public count; // SSTORE
`,
    practicalExample: {
        description: "This contract demonstrates the cost difference between Memory (cheap, temporary) and Storage (expensive, persistent).",
        code: `contract EVMStorageVsMemory {
    uint256 public storageVal; // Slot 0

    function expensiveStore() public {
        // SSTORE = 20k gas (first time)
        storageVal = 123; 
    }

    function cheapMemory() public pure returns (uint256) {
        // MSTORE = 3 gas
        uint256 memoryVal = 123;
        return memoryVal;
    }
}`
    },
    concepts: [
        { label: "Stack", explanation: "LIFO data structure. Max 1024 depth. Used for all mathematical operations and local variables." },
        { label: "Memory", explanation: "Linear, byte-addressable volatile storage. Cleared at the end of transaction. Costs grow quadratically with size." },
        { label: "Storage", explanation: "Permanent key-value store. 32-byte keys map to 32-byte values. Extremely expensive to write." }
    ],
    visualizer: "stack",

    mentalModel: {
        title: "The Industrial Workbench",
        description: "Imagine a workbench. The **Stack** is your hands (can only hold a few things, where work happens). **Memory** is the table surface (plenty of room for current project, wiped clean daily). **Storage** is the filing cabinet in the back (infinite space, lasts forever, but takes a long walk to retrieve/store files)."
    },
    underTheHood: {
        description: "The EVM is a quasi-Turing complete machine. It is 'quasi' because execution is limited by Gas. It is a big loop that fetches the next instruction (PC), executes it, pays gas, and updates state.",
        opcodes: ["POP", "PUSH1", "MSTORE", "SSTORE", "STOP"]
    },
    gasAnalysis: {
        description: "Memory is cheap but not free. Storage is very expensive.",
        tips: [
            "Use `calldata` instead of `memory` for read-only function arguments.",
            "Cache storage variables in stack/memory if reading multiple times."
        ]
    },
    securityInsights: {
        description: "Deep understanding of the EVM prevents subtle bugs.",
        risks: [
            "Stack Too Deep: Solidity can't access variables deep in the stack (limit ~16).",
            "Out of Gas: Infinite loops or massive allocations will revert the transaction."
        ]
    }
}
