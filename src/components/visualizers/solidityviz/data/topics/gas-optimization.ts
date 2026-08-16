import { type Topic } from "../topics";
import { Gauge } from "lucide-react";

export const gasOptimization: Topic = {
    id: "gas-optimization",
    title: "Gas Optimization",
    category: "Gas",
    icon: Gauge,
    shortDescription: "Saving money on-chain.",
    definition: "Gas is the fuel for the EVM. Every opcode costs a specific amount of gas. Optimization is the art of achieving the same logic with fewer or cheaper opcodes. This is critical because high gas costs can make DApps unusable.",
    useCases: [
        "Reducing transaction fees for users.",
        "Fitting more complex logic into the Block Gas Limit.",
        "Preventing Out-of-Gas errors."
    ],
    syntaxExample: `// Expensive
uint256 public a = 1;

// Optimized
uint256 private a = 1; // Private is cheaper (no getter)

// Loop Optimization
// Cache array length to stack
uint len = array.length;
for(uint i=0; i < len; ++i) { // Pre-increment
    // ...
}`,
    practicalExample: {
        description: "A comparison of standard vs optimized code.",
        code: `contract GasRace {
    uint[] public data;

    // Bad: SLOADs length every iteration, i++
    function badSum() external view returns (uint sum) {
        for(uint i=0; i < data.length; i++) {
            sum += data[i];
        }
    }

    // Good: Cache length, ++i, unchecked
    function goodSum() external view returns (uint sum) {
        uint len = data.length; // SLOAD once
        for(uint i=0; i < len;) {
            sum += data[i];
            unchecked { ++i; } // Skip overflow check
        }
    }
}`
    },
    concepts: [
        { label: "Cold vs Warm", explanation: "First access to storage/account is expensive (Cold). Subsequent accesses are cheap (Warm)." },
        { label: "Refunds", explanation: "Freeing storage (setting to 0) used to give refunds, but now is capped." },
        { label: "Zero vs Non-Zero", explanation: "Storing 0 is cheap. Storing non-zero is expensive." }
    ],
    visualizer: "gas",
    mentalModel: {
        title: "The Toll Road",
        description: "Driving a car (transaction). Every mile you drive costs gas. Turning on the AC (Storage) costs extra. Playing the radio (Memory) costs a little. The goal is to get to the destination carrying the same cargo, using the least fuel possible."
    },
    underTheHood: {
        description: "Gas is calculated dynamically. `SSTORE` (20k/2.9k) and `SLOAD` (2.1k/100) are the main drivers. `unchecked` blocks disable overhead 0.8.0+ overflow checks.",
        opcodes: ["GAS", "SSTORE", "SLOAD", "JUMPDEST"]
    },
    gasAnalysis: {
        description: "The Holy Trinity of Savings.",
        tips: [
            "Minimize Storage Writes.",
            "Use `calldata` for read-only arguments.",
            "Cache storage variables in memory/stack."
        ]
    },
    securityInsights: {
        description: "Optimization shouldn't compromise readability or security.",
        risks: [
            "Removing overflow checks (`unchecked`) blindly can cause massive bugs.",
            "Complex bit-packing can make code unmaintainable."
        ]
    }
}
