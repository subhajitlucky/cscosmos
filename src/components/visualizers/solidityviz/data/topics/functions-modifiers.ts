import { type Topic } from "../topics";
import { FunctionSquare } from "lucide-react";

export const functionsModifiers: Topic = {
    id: "functions-modifiers",
    title: "Functions & Modifiers",
    category: "Fundamentals",
    icon: FunctionSquare,
    shortDescription: "Reusable logic and access control gates.",
    definition: "Functions are executable units of code. Modifiers are higher-order functions that wrap around a function's execution, commonly used for access control checks (e.g. `onlyOwner`) or state validations.",
    useCases: [
        "Restricting access to administrative actions.",
        "Validating inputs before execution.",
        "Preventing reentrancy attacks (`nonReentrant`)."
    ],
    syntaxExample: `function transfer(address to, uint amount) 
    public 
    virtual 
    onlyOwner 
    returns (bool) 
{
    // Function body
}

modifier onlyOwner() {
    require(msg.sender == owner, "Auth");
    _; // Resume function execution
}`,
    practicalExample: {
        description: "A common pattern: using a modifier to gate access to a sensitive function.",
        code: `contract AccessControl {
    address public owner;
    uint256 public value;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        // Logic before the function runs
        if (msg.sender != owner) {
            revert("Not authorized");
        }
        _; // Original function body runs here
        // Logic after (rare)
    }

    function changeValue(uint256 _newVal) public onlyOwner {
        value = _newVal;
    }
}`
    },
    concepts: [
        { label: "msg.sender", explanation: "Global variable representing the address that called the function." },
        { label: "modifier", explanation: "A compile-time code wrapper. The `_;` symbol is replaced by the function body." },
        { label: "view/pure", explanation: "State mutability modifiers. View reads state; Pure reads nothing." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Bouncer and the VIP Club",
        description: "A **Modifier** is the bouncer at the club door. He checks your ID (`msg.sender`) before he lets you in (`_;`). If you don't pass the check (`require`), you get turned away immediately, and no resources are wasted inside."
    },
    underTheHood: {
        description: "Modifiers result in 'bytecode inlining'. The compiler literally copies the modifier's code and pastes the function's code where the `_;` is. This means heavy modifiers increase contract size for every function they attach to.",
        opcodes: ["JUMP", "REVERT", "CALLER"]
    },
    gasAnalysis: {
        description: "Modifiers are generally efficient, but big modifiers bloat bytecode.",
        tips: [
            "If a modifier is used many times and is large, consider making it call an internal function to reduce bytecode size."
        ]
    },
    securityInsights: {
        description: "Modifiers are the first line of defense.",
        risks: [
            "Incorrect logic in modifiers leaves the entire contract vulnerable.",
            "Forgeting `_;` causes the function to simply finish without executing its body."
        ]
    }
}
