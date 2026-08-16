import { type Topic } from "../topics";
import { Database } from "lucide-react";

export const storageLayout: Topic = {
    id: "storage-layout",
    title: "Storage Layout",
    category: "Internals",
    icon: Database,
    shortDescription: "How the EVM packs data into 32-byte slots.",
    definition: "Contract state variables are stored in a persistent key-value store. The EVM maps variable names to 32-byte 'slots'. To save space (and expensive gas), solidity packs smaller variables that are declared next to each other into a single slot.",
    useCases: [
        "Audit preparation: ensuring critical data is where you expect.",
        "Gas Optimization: Squeezing 4 `uint64`s into 1 slot saves 75% gas.",
        "Upgradeability: Ensuring storage layouts don't collide in proxies."
    ],
    syntaxExample: `// Unoptimized (3 Slots)
uint128 a; // Slot 0 (Partial)
uint256 b; // Slot 1 (Full)
uint128 c; // Slot 2 (Partial)

// Optimized (2 Slots)
uint128 a; // Slot 0
uint128 c; // Slot 0 (Packed!)
uint256 b; // Slot 1`,
    practicalExample: {
        description: "Visualizing the difference between packed and unpacked storage.",
        code: `contract StoragePacking {
    // SLOT 0
    uint128 public A = 1;
    uint128 public B = 2; 
    // (A and B are packed together)

    // SLOT 1
    uint256 public C = 3; 

    // SLOT 2
    uint8 public D = 4;
    // (Wasted 31 bytes here if nothing follows)
}`
    },
    concepts: [
        { label: "Slot", explanation: "A 32-byte chunk of storage. The basic unit of persistence." },
        { label: "Packing", explanation: "Putting multiple variables < 32 bytes into one slot." },
        { label: "Offset", explanation: "Where a variable begins within a slot (0 to 31)." }
    ],
    visualizer: "storage",
    mentalModel: {
        title: "Tetris in a Warehouse",
        description: "Storage is like a warehouse with uniform 32-byte boxes. You want to fill each box completely before opening a new one. If you put a small marble (uint8) in a box and seal it, you wasted space. If you put 32 marbles in, you win."
    },
    underTheHood: {
        description: "Variables are laid out in order of declaration. If a variable doesn't fit in the remaining space of the current slot, it moves to the next. Structs and Arrays always start a new slot.",
        opcodes: ["SSTORE", "SLOAD"]
    },
    gasAnalysis: {
        description: "`SSTORE` is the most expensive opcode (20k gas for new slot).",
        tips: [
            "Pack `uint128` timestamps and `address` (160 bits) together.",
            "Pack `bool` flags (1 byte each)."
        ]
    },
    securityInsights: {
        description: "Storage collisions in Proxy patterns.",
        risks: [
            "If you upgrade a contract and insert a new variable in the middle, purely by index, it will overwrite the data of the variable that used to be there."
        ]
    }
}
