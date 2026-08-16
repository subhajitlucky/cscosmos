import { type Topic } from "../topics";
import { GitBranch } from "lucide-react";

export const inheritance: Topic = {
    id: "inheritance",
    title: "Inheritance",
    category: "Advanced",
    icon: GitBranch,
    shortDescription: "Is-a relationships and code reuse.",
    definition: "Solidity supports multiple inheritance (C++ style) with C3 linearization. Contracts can inherit functionality from other contracts using the `is` keyword. This is the backbone of reusability (e.g., `is ERC20`).",
    useCases: [
        "Using standard libraries (OpenZeppelin).",
        "Splitting large contracts into modules.",
        "Overriding default behavior (`virtual` / `override`)."
    ],
    syntaxExample: `contract Parent {
    function greet() public virtual returns (string memory) {
        return "Hello";
    }
}

contract Child is Parent {
    function greet() public override returns (string memory) {
        return "Hi there";
    }
}`,
    practicalExample: {
        description: "Multiple inheritance and the 'super' keyword.",
        code: `contract Ownable {
    address public owner;
    constructor() { owner = msg.sender; }
}

contract Pausable is Ownable {
    bool public paused;
    function pause() public {
        // Accessing Parent's state
        require(msg.sender == owner); 
        paused = true;
    }
}

contract Token is Ownable, Pausable {
    function transfer() public {
        require(!paused, "Stopped");
        // Logic
    }
}`
    },
    concepts: [
        { label: "C3 Linearization", explanation: "The specific order in which parent contracts are initialized and searched for functions. Right-to-Left in declarations." },
        { label: "virtual/override", explanation: "Explicit keywords required to modify parent behavior (safety feature)." },
        { label: "super", explanation: "Calls the function one level up the inheritance tree." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The DNA Tree",
        description: "Inheritance is like genetics. The Child contract gets features from its Parent. If the Parent has blue eyes, the Child has blue eyes, unless the Child explicitly 'overrides' that gene. With multiple parents, order matters—you get the features of the last parent listed most strongly."
    },
    underTheHood: {
        description: "Inheritance doesn't exist at runtime! The compiler flattens everything. It takes the code from Parent A, Parent B, and Child, and mashes it into ONE giant bytecode blob. `super` calls are just internal jumps.",
        opcodes: ["JUMP", "JUMPDEST"]
    },
    gasAnalysis: {
        description: "Inheritance is free at runtime but costs at deployment.",
        tips: [
            "Inheriting a huge contract increases your deployment size, even if you only use one function.",
            "Internal function calls between inherited contracts are cheap (simple jumps)."
        ]
    },
    securityInsights: {
        description: "Diamond Problem and Shadowing.",
        risks: [
            "State Variable Shadowing: (Disallowed in 0.6+) Declaring a variable with the same name as a parent.",
            "Constructor Order: Base constructors are executed following linearization rules, not necessarily how you'd expect."
        ]
    }
}
