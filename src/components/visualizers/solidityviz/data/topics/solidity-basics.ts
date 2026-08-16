import { Layers } from "lucide-react";
import { type Topic } from "../topics";

export const solidityBasics: Topic = {
    id: "solidity-basics",
    title: "Solidity Basics",
    category: "Fundamentals",
    icon: Layers,
    shortDescription: "The structure of a smart contract.",
    definition: "Solidity is an object-oriented, high-level language for implementing smart contracts. A contract is a collection of code (functions) and data (state) that resides at a specific address on the Ethereum blockchain.",
    useCases: ["Digital Wallets", "Voting Systems", "Crowdfunding"],
    syntaxExample: `pragma solidity ^0.8.0;

contract HelloWorld {
    // State variable
    string public greet = "Hello";
}`,
    practicalExample: {
        description: "A minimal contract that stores and retrieves a value.",
        code: `contract SimpleStorage {
    uint256 public value;

    function set(uint256 _value) public {
        value = _value;
    }
}`
    },
    concepts: [
        { label: "contract", explanation: "Defines a new smart contract. Similar to a 'class' in other languages." },
        { label: "uint256", explanation: "Unsigned Integer of 256 bits. The standard variable type for numbers in Ethereum." },
        { label: "public", explanation: "Visibility modifier. Automatically creates a 'getter' function so others can read this variable." },
        { label: "function", explanation: "A block of code that allows you to execute actions or calculations." }
    ],
    visualizer: "stack",

    mentalModel: {
        title: "The Persistent State Machine",
        description: "Think of a Smart Contract not as a script that runs and finishes, but as a singleton object living on the blockchain that maintains its state forever. Every function call is a transaction that transitions this state from A to B."
    },
    underTheHood: {
        description: "When you declare a `uint256` state variable, the EVM reserves a 32-byte slot in the contract's specific Storage Trie. Accessing this variable uses the `SLOAD` opcode (costly) and writing to it uses `SSTORE` (very costly). The 'public' keyword automatically generates a getter function that corresponds to a specific 4-byte function selector in the bytecode.",
        opcodes: ["SLOAD", "SSTORE", "JUMP", "JUMPI"]
    },
    gasAnalysis: {
        description: "State changes are the most expensive operations on Ethereum.",
        tips: [
            "Avoid writing to storage in loops.",
            "Use `memory` variables for intermediate calculations.",
            "Pack variables (e.g. uint128, uint128) to fit in one slot."
        ]
    },
    securityInsights: {
        description: "Everything on the blockchain is public, even 'private' variables.",
        risks: [
            "Don't store passwords or API keys in variables, even private ones.",
            "Integer overflows (solved in Solidity 0.8+)."
        ]
    }
}
