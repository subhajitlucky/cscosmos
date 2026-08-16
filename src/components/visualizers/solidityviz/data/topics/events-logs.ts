import { type Topic } from "../topics";
import { Radio } from "lucide-react";

export const eventsLogs: Topic = {
    id: "events-logs",
    title: "Events & Logs",
    category: "Fundamentals",
    icon: Radio,
    shortDescription: "Cheap off-chain data storage and triggering frontend updates.",
    definition: "Events allow contracts to print logs to the blockchain. These logs are NOT accessible by other contracts (meaning you can't read them on-chain), but they are indexed and searchable by off-chain services (frontends, The Graph, indexers).",
    useCases: [
        "Updating the UI when a transfer happens.",
        "Storing historical data cheaply (2000 gas vs 20000 gas).",
        "Triggering off-chain workflows."
    ],
    syntaxExample: `event Transfer(address indexed from, address indexed to, uint256 amount);

function transfer(address to, uint amount) external {
    // ... logic ...
    emit Transfer(msg.sender, to, amount);
}`,
    practicalExample: {
        description: "Emit an event whenever critical state changes.",
        code: `contract Token {
    mapping(address => uint) public balances;
    
    // 'indexed' allows filtering logs by this parameter
    event Sent(address indexed from, address indexed to, uint amount);

    function send(address to, uint amount) public {
        balances[msg.sender] -= amount;
        balances[to] += amount;
        
        // Notify the world
        emit Sent(msg.sender, to, amount);
    }
}`
    },
    concepts: [
        { label: "indexed", explanation: "Adds the parameter to a Bloom Filter, enabling efficient searching/filtering of logs." },
        { label: "emit", explanation: "The keyword to trigger an event." },
        { label: "logs", explanation: "Data written to the transaction receipt, cheaper than storage." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Megaphone",
        description: "Emitting an event is like shouting into a megaphone. Your smart contract (the speaker) announces something happened. People in the crowd (the frontend/users) hear it and react. However, other contracts on stage *cannot* hear the megaphone logs."
    },
    underTheHood: {
        description: "Events use the `LOG0` to `LOG4` opcodes. The number corresponds to the number of 'topics' (indexed parameters). Data is stored in a special 'Logs' field of the block, not in the state trie.",
        opcodes: ["LOG1", "LOG2", "LOG3", "LOG4"]
    },
    gasAnalysis: {
        description: "Events are much cheaper than Storage.",
        tips: [
            "Store historical data (like a history of moves in a game) in Events, not Arrays, if the contract doesn't need to read it back.",
            "Use `indexed` sparingly (costs more gas), only for fields you actually need to search by."
        ]
    },
    securityInsights: {
        description: "Events are reliable but not immediate for all observers.",
        risks: [
            "Phishing: Events can be spoofed by other contracts if frontends don't verify the `address` emitting the event.",
            "Don't rely on events for on-chain logic."
        ]
    }
}
