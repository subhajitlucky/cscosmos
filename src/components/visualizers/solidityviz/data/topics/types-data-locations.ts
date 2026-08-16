import { type Topic } from "../topics";
import { FileCode } from "lucide-react";

export const typesDataLocations: Topic = {
    id: "types-data-locations",
    title: "Types & Data Locations",
    category: "Fundamentals",
    icon: FileCode,
    shortDescription: "Value types vs Reference types and where they live.",
    definition: "Solidity is statically typed. Variables serve as containers for data. Crucially, reference types (arrays, structs) must specify a data location: `memory` (temporary), `storage` (persistent), or `calldata` (read-only input).",
    useCases: [
        "Optimizing gas usage by choosing the right location.",
        "Preventing unintended storage modifications.",
        "Handling large datasets efficiently."
    ],
    syntaxExample: `// Value Types (Pass by copy)
uint256 a = 100;
bool isReady = true;
address owner = 0x123...;

// Reference Types (Must define location)
function process(uint[] calldata inputs) external {
    // Copy to memory (expensive but mutable)
    uint[] memory temp = inputs;
    
    // Pointer to storage (cheap reference)
    uint[] storage ptr = myStorageArray;
}`,
    practicalExample: {
        description: "See the difference between modifying a Storage pointer (affects state) vs a Memory copy (discarded).",
        code: `contract DataLocations {
    uint[] public numbers;

    constructor() {
        numbers.push(1);
        numbers.push(2);
    }

    function modifyStorage() public {
        // 'ref' points directly to storage
        uint[] storage ref = numbers;
        ref[0] = 99; // Changes 'numbers[0]' permanently
    }

    function modifyMemory() public view {
        // 'copy' is a new array in memory
        uint[] memory copy = numbers;
        copy[0] = 88; // Does NOT affect 'numbers'
    }
}`
    },
    concepts: [
        { label: "Value Type", explanation: "Stores data directly (e.g. uint, bool, address). Passed by value (copied)." },
        { label: "Reference Type", explanation: "Stores a pointer to data (e.g. array, struct, mapping). Can be passed by reference." },
        { label: "Data Location", explanation: "The specific region of the EVM where data is stored. Affects persistence and gas cost." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Warehouse vs. The Backpack",
        description: "**Storage** is the Warehouse: modifying items here takes a forklift and updates the master inventory. **Memory** is your Backpack: you can take items out of the warehouse, put them in your bag, and modify them, but if you don't put them back, the changes vanish when you leave."
    },
    underTheHood: {
        description: "`storage` variables are state pointers. `memory` is a linear byte array that expands. `calldata` is a non-modifiable, direct usage of the transaction input data area (cheapest). Copying from `calldata` to `memory` costs gas proportional to size (`identity` precompile or loop).",
        opcodes: ["CALLDATALOAD", "MLOAD", "MSTORE", "SLOAD", "SSTORE"]
    },
    gasAnalysis: {
        description: "Wrong data location choices are the #1 source of gas rework.",
        tips: [
            "Use `calldata` for array parameters in external functions to avoid copying.",
            "Don't copy storage arrays to memory unless you need to loop over them many times."
        ]
    },
    securityInsights: {
        description: "Uninitialized storage pointers can point to slot 0 and overwrite critical variables.",
        risks: [
            "Storage Pointer Bug: In older Solidity versions, uninitialized pointers could corrupt storage. (Fixed in 0.5.0, but concept remains important)."
        ]
    }
}
