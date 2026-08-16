import { type Topic } from "../topics";
import { Cpu } from "lucide-react";

export const memoryCalldata: Topic = {
    id: "memory-calldata",
    title: "Memory vs Calldata",
    category: "Internals",
    icon: Cpu,
    shortDescription: "Volatile data areas.",
    definition: "`memory` is temporary storage that is erased after transaction execution. `calldata` is a non-modifiable, non-persistent area where function arguments are stored. Calldata behaves like memory but is cheaper and read-only.",
    useCases: [
        "Processing arrays without saving to storage.",
        "String manipulation.",
        "Saving gas on external function calls."
    ],
    syntaxExample: `function process(
    uint[] calldata nums, // Read-only, cheap
    string memory text    // Mutable, execution cost
) external pure {
    
    // Can READ nums[0]
    // Cannot WRITE nums[0] = 1;

    string memory copy = text; 
    // Can modify 'copy'
}`,
    practicalExample: {
        description: "Comparing the cost of Memory copies vs Calldata slicing.",
        code: `contract MemoryVsCalldata {
    // Expensive: Copies argument to memory
    function useMemory(uint[] memory arr) external pure returns (uint) {
        return arr.length;
    }

    // Cheap: Reads directly from input
    function useCalldata(uint[] calldata arr) external pure returns (uint) {
        return arr.length;
    }
}`
    },
    concepts: [
        { label: "Memory Expansion", explanation: "Gas cost grows logically with size, but Quadratically after a threshold. Allocating HUGE memory is very expensive." },
        { label: "Free Memory Pointer", explanation: "Points to the next free specific byte in memory (0x40)." }
    ],
    visualizer: "memory",
    mentalModel: {
        title: "The Scratchpad vs. The Speech",
        description: "**Calldata** is the speech someone gave you. It's written in stone (or audio recording); you can listen to it, but you can't change what they said. **Memory** is your scratchpad. You can copy parts of the speech there and edit them, cross them out, or write new things."
    },
    underTheHood: {
        description: "Memory is a byte array. Solidity manages a 'Free Memory Pointer' at address 0x40. When you say `new bytes(100)`, it reads 0x40, reserves 100 bytes, and updates 0x40.",
        opcodes: ["MSTORE", "MLOAD", "CALLDATALOAD", "CALLDATASIZE"]
    },
    gasAnalysis: {
        description: "Avoid copying if possible.",
        tips: [
            "Always use `calldata` for external function parameters if you don't need to modify them.",
            "Reuse memory arrays instead of creating new ones in a loop."
        ]
    },
    securityInsights: {
        description: "Memory safety is generally high.",
        risks: [
            "Allocating dynamic memory based on user input size can lead to Out of Gas Denial of Service."
        ]
    }
}
