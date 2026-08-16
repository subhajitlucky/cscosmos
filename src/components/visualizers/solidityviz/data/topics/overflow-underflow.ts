import { type Topic } from "../topics";
import { AlertTriangle } from "lucide-react";

export const overflowUnderflow: Topic = {
    id: "overflow-underflow",
    title: "Overflow & Underflow",
    category: "Security",
    icon: AlertTriangle,
    shortDescription: "Numbers wrapping around limits.",
    definition: "Fixed-size integers have limits. `uint8` goes from 0 to 255. If you calculate `255 + 1`, it historically wrapped around to `0`. Solidity 0.8+ now automatically reverts on overflow, but understanding it is crucial for legacy code and `unchecked` blocks.",
    useCases: [
        "Historical Audits (SafeMath era).",
        "Optimizing gas with `unchecked`.",
        "Understanding weird token balances."
    ],
    syntaxExample: `uint8 x = 255;
x++; // Reverts in 0.8.0+
// Unchecked block (saves gas)
unchecked {
    x++; // x becomes 0
}`,
    practicalExample: {
        description: "Demonstrating the wrap-around behavior in an unchecked block.",
        code: `contract Odometer {
    uint8 public counter = 255;

    function safeIncrement() public {
        counter++; // Will REVERT
    }

    function unsafeIncrement() public {
        unchecked {
            counter++; // Will become 0
        }
    }
    
    function multiOp() public {
        // Useful for loops where you know constraints
        for(uint i=0; i<100;){
             // body
             unchecked { ++i; }
        }
    }
}`
    },
    concepts: [
        { label: "Wrap Around", explanation: "Like a car odometer, after 999999 comes 000000." },
        { label: "SafeMath", explanation: "Legacy library (OpenZeppelin) used to prevent this before 0.8.0." },
        { label: "Panic(0x11)", explanation: "The error code Solidity throws on overflow." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Odometer",
        description: "If you have a 3-digit combination lock (000-999) and you are at 999, adding 1 rolls it back to 000. It doesn't break; it just loops. In banking software, 'looping' your balance from $0 to $Infinity (underflow) is catastrophic."
    },
    underTheHood: {
        description: "The EVM does NOT check for overflow by default. `ADD` simply adds. Solidity adds extra bytecode (`JUMPI` checks) around every math op. `unchecked` removes these checks.",
        opcodes: ["ADD", "LT", "JUMPI", "REVERT"]
    },
    gasAnalysis: {
        description: "Safe math costs gas.",
        tips: [
            "Use `unchecked` only when you are mathematically 100% sure overflow is impossible (e.g. iterating a bounded array).",
            "Saves ~100 gas per operation."
        ]
    },
    securityInsights: {
        description: "The source of infinite money glitches.",
        risks: [
            "BEC Token Attack: Attacker caused an underflow to give themselves billions of tokens.",
            "Logic Errors: Assuming `a - b` is always positive."
        ]
    }
}
