import { type Topic } from "../topics";
import { Globe } from "lucide-react";

export const globalVars: Topic = {
    id: "global-vars",
    title: "Global Variables",
    category: "Internals",
    icon: Globe,
    shortDescription: "Block context and transaction context.",
    definition: "Solidity provides special variables that exist in the global namespace. These give you information about the blockchain (Block Context) and the current transaction (Transaction Context).",
    useCases: [
        "Getting the caller address (`msg.sender`).",
        "Getting the time (`block.timestamp`) for deadlines.",
        "Getting value sent (`msg.value`) for payments."
    ],
    syntaxExample: `function info() public payable {
    address who = msg.sender;       // Who called me?
    uint howMuch = msg.value;       // How much ETH?
    bytes memory data = msg.data;   // Raw data
    
    uint time = block.timestamp;    // Unix time (seconds)
    uint num = block.number;        // Block height
    uint chain = block.chainid;     // 1 = Mainnet, 11155111 = Sepolia
}`,
    practicalExample: {
        description: "Using block.timestamp for a time-locked wallet.",
        code: `contract TimeLock {
    uint256 public unlockTime;
    address public owner;

    constructor(uint256 _seconds) {
        owner = msg.sender;
        unlockTime = block.timestamp + _seconds;
    }

    function withdraw() public {
        require(msg.sender == owner, "Not owner");
        require(block.timestamp >= unlockTime, "Too early");

        payable(owner).transfer(address(this).balance);
    }
}`
    },
    concepts: [
        { label: "block.timestamp", explanation: "Current block timestamp in seconds since Unix epoch. Manipulatable by miners by ~15s." },
        { label: "tx.origin", explanation: "The original sender of the transaction. Dangerous for authorization (phishing risk)." },
        { label: "msg.sender", explanation: "The immediate caller (can be a person or another contract)." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Environment Stats",
        description: "Imagine your code running inside a transparent box. `Global Variables` are the displays on the wall of the box telling you: 'What time is it?', 'Who is outside the box poking me?', 'How heavy is the bag of money they threw in?'."
    },
    underTheHood: {
        description: "These map directly to context opcodes. `block.timestamp` is `TIMESTAMP`. `msg.sender` is `CALLER`. Accessing these is generally very cheap.",
        opcodes: ["TIMESTAMP", "NUMBER", "CALLER", "CALLVALUE", "CHAINID"]
    },
    gasAnalysis: {
        description: "Cheap to read.",
        tips: [
            "Don't read `block.timestamp` repeatedly in a loop; store it in a stack variable."
        ]
    },
    securityInsights: {
        description: "Don't trust miners completely.",
        risks: [
            "Timestamp Dependence: Don't use `block.timestamp` for random number generation (miners can bias it).",
            "tx.origin Phishing: Never use `tx.origin` for auth. An attacker can trick you into calling their contract, which then calls yours."
        ]
    }
}
