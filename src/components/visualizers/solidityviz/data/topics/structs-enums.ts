import { type Topic } from "../topics";
import { Box } from "lucide-react";

export const structsEnums: Topic = {
    id: "structs-enums",
    title: "Structs & Enums",
    category: "Fundamentals",
    icon: Box,
    shortDescription: "Custom types for complex data.",
    definition: "Structs allow you to group related data together (like a `class` without methods). Enums allow you to define a custom type with a limited set of constant values (like states).",
    useCases: [
        "Struct: Representing a 'User', 'Campaign', or 'Transaction'.",
        "Enum: Tracking state ('Pending', 'Active', 'Canceled')."
    ],
    syntaxExample: `enum Status { Pending, Active, Defaulted }

struct Borrower {
    address account;
    uint256 amount;
    Status status;
}

Borrower public b = Borrower({
    account: 0x..., 
    amount: 100, 
    status: Status.Pending
});`,
    practicalExample: {
        description: "Using a Struct to pack data efficiently into storage slots.",
        code: `contract LoanSystem {
    enum Status { Pending, Active, Paid }

    struct Loan {
        address borrower; // 20 bytes
        uint96 amount;    // 12 bytes
        // Total: 32 bytes (1 Slot) - Gas Optimized!
        
        Status status;    // 1 byte (uint8)
        uint48 deadline; // 6 bytes
        // Total: 7 bytes (Partial Slot 2)
    }

    mapping(uint => Loan) public loans;

    function createLoan(uint _id, uint96 _amt) external {
        loans[_id] = Loan({
            borrower: msg.sender,
            amount: _amt,
            status: Status.Pending,
            deadline: uint48(block.timestamp + 1 days)
        });
    }
}`
    },
    concepts: [
        { label: "Packing", explanation: "Arranging struct members to fit into 32-byte slots reduces gas costs drastically." },
        { label: "Enum", explanation: "Under the hood, just a uint8 (0, 1, 2...). Makes code readable." },
        { label: "Storage Pointer", explanation: "Pass structs by `storage` reference to modify them in place." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Custom Container",
        description: "A **Struct** is a custom box. You decide exactly what fits inside. If you pack the items neatly (small items next to each other), you can fit the whole box into a single 'Storage Slot' shelf space, saving massive rent (gas)."
    },
    underTheHood: {
        description: "Enums are `uint8` by default. Structs are laid out sequentially. If items fit in 32 bytes, they share a slot (`SSTORE` writes to the same key).",
        opcodes: ["MLOAD", "MSTORE", "SSTORE", "SLOAD"]
    },
    gasAnalysis: {
        description: "Struct packing is the easiest way to save gas.",
        tips: [
            "Order `uint`s from smallest to largest or group them to sum to 256 bits.",
            "Put `uint256` members last if possible, or isolate them.",
            "Use `enum` instead of strings for states."
        ]
    },
    securityInsights: {
        description: "Structs in memory are not packed tightly like in storage.",
        risks: [
            "Assuming memory structs are packed can lead to incorrect hash calculations (`keccak256(abi.encode(myStruct))`)."
        ]
    }
}
