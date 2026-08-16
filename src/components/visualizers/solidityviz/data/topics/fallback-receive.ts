import { type Topic } from "../topics";
import { HelpCircle } from "lucide-react";

export const fallbackReceive: Topic = {
    id: "fallback-receive",
    title: "Fallback & Receive",
    category: "Internals",
    icon: HelpCircle,
    shortDescription: "Handling raw ETH and unknown function calls.",
    definition: "These are special functions that run when a contract receives ETH without data (`receive`) or when a function call doesn't match any exist function signature (`fallback`). They are the 'catch-all' handlers.",
    useCases: [
        "Contracts designed to simply hold ETH (Wallets).",
        "Proxy patterns (delegating unknown calls to implementation).",
        "Handling mistakes gracefully."
    ],
    syntaxExample: `// Called when data is empty
receive() external payable {
    // Thanks for the ETH
}

// Called when no other function matches
fallback() external payable {
    // Log "Function not found"
}`,
    practicalExample: {
        description: "A Wallet that accepts ETH and logs unknown interaction attempts.",
        code: `contract EtherWallet {
    event Received(address sender, uint amount);
    event FallbackCalled(address sender, bytes data);

    // 1. Someone sends only ETH
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    // 2. Someone sends data (calls non-existent func)
    fallback() external payable {
        emit FallbackCalled(msg.sender, msg.data);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}`
    },
    concepts: [
        { label: "msg.data", explanation: "The raw calldata sent with the transaction." },
        { label: "Selection", explanation: "Solidity tries to match function selector -> then receive() -> then fallback()." },
        { label: "2300 Gas", explanation: "Standard `transfer()` only forwards 2300 gas, barely enough to emit an event in receive()." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Receptionist",
        description: "If you ask for a specific person (`function foo()`), you get them. If you walk in silently handing over cash, the `receive` receptionist takes it. If you walk in speaking gibberish, the `fallback` receptionist handles you (usually by kicking you out or redirecting you)."
    },
    underTheHood: {
        description: "The function selector dispatcher is just a `switch` statement in bytecode. If no case matches `msg.sig`, it jumps to the fallback block.",
        opcodes: ["CALLDATALOAD", "SHR", "JUMPI"]
    },
    gasAnalysis: {
        description: "Keep receive/fallback extremely simple.",
        tips: [
            "If receive() runs out of gas (because sender used `.transfer()`), the ETH transfer fails. Always test this.",
            "Use `emit` only in fallback if you expect simple transfers."
        ]
    },
    securityInsights: {
        description: "The most common vector for Reentrancy.",
        risks: [
            "Attacker contracts put malicious logic in their `fallback` function to hijack control flow during a `.call()`.",
            "Always follow Checks-Effects-Interactions pattern."
        ]
    }
}
