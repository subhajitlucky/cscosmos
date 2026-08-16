import { type Topic } from "../topics";
import { ShieldAlert } from "lucide-react";

export const reentrancy: Topic = {
    id: "reentrancy",
    title: "Reentrancy Attacks",
    category: "Security",
    icon: ShieldAlert,
    shortDescription: "The DAO Hack vulnerability.",
    definition: "Reentrancy occurs when a contract calls an external contract (e.g., to send ETH), and that external contract calls *back* into the calling contract before the first execution is finished. This creates a recursive loop that can drain funds.",
    useCases: [
        "Understanding The DAO Hack.",
        "Auditing DeFi protocols.",
        "Implementing ReentrancyGuards."
    ],
    syntaxExample: `// Vulnerable
msg.sender.call{value: amount}(""); // Hand over control
balances[msg.sender] = 0; // State updated TOO LATE

// Secure (Checks-Effects-Interactions)
balances[msg.sender] = 0; // Effect FIRST
msg.sender.call{value: amount}(""); // Interaction LAST

// Secure (Modifier)
function withdraw() nonReentrant { ... }`,
    practicalExample: {
        description: "A vulnerable vault and how to fix it.",
        code: `contract Vault {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    // VULNERABLE
    function withdraw() public {
        uint bal = balances[msg.sender];
        require(bal > 0);

        (bool sent, ) = msg.sender.call{value: bal}("");
        require(sent, "Failed");

        // Use check-effects-interactions interaction pattern
        balances[msg.sender] = 0;
    }
}`
    },
    concepts: [
        { label: "Control Flow Hijack", explanation: "When you call another contract, you pause your execution and give them the CPU." },
        { label: "Recursion", explanation: "The attacker calls you, you call them, they call you..." },
        { label: "Atomicity", explanation: "Transactions are atomic, but intermediate states during the transaction can be invalid." }
    ],
    visualizer: "reentrancy",
    mentalModel: {
        title: "The ATM Glitch",
        description: "Imagine an ATM. You ask to withdraw $100. The machine hands you the cash *before* it updates your account balance on the screen. Before it can update the screen, you quickly press 'Withdraw' again. The machine sees the balance is still there and hands you another $100."
    },
    underTheHood: {
        description: "External calls (`CALL` opcode) pass execution context to the target. If the target is a contract, it runs code. It can `.call()` back to the origin because the origin is just another address.",
        opcodes: ["CALL", "SLOAD", "SSTORE"]
    },
    gasAnalysis: {
        description: "Reentrancy guards cost gas.",
        tips: [
            "Use the Checks-Effects-Interactions pattern (free) instead of a Mutex (gas cost) where possible."
        ]
    },
    securityInsights: {
        description: "Always assume external calls are malicious.",
        risks: [
            "Single Function Reentrancy.",
            "Cross-Function Reentrancy (Attacker calls a different function sharing state).",
            "Cross-Contract Reentrancy (Attacker calls a system sharing state)."
        ]
    }
}
