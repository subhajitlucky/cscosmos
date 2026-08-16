import { type Topic } from "../topics";
import { AlertTriangle } from "lucide-react";

export const controlFlowErrors: Topic = {
    id: "control-flow-errors",
    title: "Control Flow & Errors",
    category: "Fundamentals",
    icon: AlertTriangle,
    shortDescription: "If statements, loops, and handling reverts.",
    definition: "Solidity supports standard control flow (`if`, `else`, `for`, `while`). Error handling is done via `require`, `revert`, and `assert`. Understanding how to revert transactions effectively is key to gas efficiency and security.",
    useCases: [
        "Validating user balance before transfer.",
        "Looping through arrays (carefully).",
        "Returning detailed error messages to the frontend."
    ],
    syntaxExample: `if (x > y) {
    // Branch A
} else {
    // Branch B
}

// Custom Error (Gas Efficient)
error InsufficientFunds(uint available, uint required);

if (balance < amount) {
    revert InsufficientFunds(balance, amount);
}`,
    practicalExample: {
        description: "Using custom errors to save gas compared to string requires.",
        code: `contract ErrorHandling {
    uint256 public maxLimit = 100;
    
    error TooHigh(uint256 provided);

    function setVal(uint256 _val) public {
        // Old way (Expensive string)
        // require(_val <= maxLimit, "Value too high");

        // New way (Cheap 4-byte selector)
        if (_val > maxLimit) {
            revert TooHigh(_val);
        }
        
        // Loop example
        for(uint i=0; i<5; i++) {
            // Logic
        }
    }
}`
    },
    concepts: [
        { label: "require", explanation: "Checks conditions. If false, reverts changes and refunds remaining gas. Used for inputs." },
        { label: "assert", explanation: "Checks invariants. If false, consumes ALL gas (panic). Used for internal errors." },
        { label: "revert", explanation: "Imperatively stops execution. Can return custom error data." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Emergency Stop Button",
        description: "In normal coding, an error might crash the app. In Solidity, an error (`revert`) is a **Time Machine**. It undoes *everything* that happened in the current transaction as if it never occurred, preserving the blockchain's integrity."
    },
    underTheHood: {
        description: "`revert` compiles to the `REVERT` opcode, which halts execution and returns a data payload. `assert` compiles to `INVALID` (0xFE), consuming all gas. Loops (`JUMP`) must be bounded, or they will hit the Block Gas Limit.",
        opcodes: ["JUMPI", "REVERT", "INVALID"]
    },
    gasAnalysis: {
        description: "Reverting early saves gas. Custom errors save gas over strings.",
        tips: [
            "Always validate inputs at the very top of the function.",
            "Use Custom Errors (`error MyError()`) instead of strings for cheaper deployment and execution."
        ]
    },
    securityInsights: {
        description: "Unhandled exceptions can leave contracts in broken states (rare due to atomicity, but logic matters).",
        risks: [
            "DoS with Block Gas Limit: Iterating over an array that can grow indefinitely will eventually make the function uncallable."
        ]
    }
}
