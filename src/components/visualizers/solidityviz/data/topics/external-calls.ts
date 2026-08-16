import { type Topic } from "../topics";
import { PhoneOutgoing } from "lucide-react";

export const externalCalls: Topic = {
    id: "external-calls",
    title: "External Calls",
    category: "Advanced",
    icon: PhoneOutgoing,
    shortDescription: "Sending ETH and Data to others.",
    definition: "Contracts can interact with other contracts or EOAs by making external calls. The low-level `.call` is the most flexible way, allowing you to send ETH and data, but it requires careful handling of return values and reentrancy risks.",
    useCases: [
        "Sending ETH (Withdrawals).",
        "Calling functions without an interface (bytes signature).",
        "Multicall patterns."
    ],
    syntaxExample: `// 1. Sending ETH (Recommended)
(bool success, ) = recipient.call{value: 1 ether}("");
require(success, "Transfer failed");

// 2. Calling a function "foo(uint256)"
(bool success, bytes memory data) = target.call(
    abi.encodeWithSignature("foo(uint256)", 123)
);`,
    practicalExample: {
        description: "A generic executor that can call any function on any contract.",
        code: `contract Executor {
    event Executed(bool success, bytes result);

    function execute(
        address target, 
        bytes calldata data, 
        uint256 value
    ) external payable {
        // Low-level call
        (bool success, bytes memory result) = target.call{value: value}(data);
        
        if (!success) {
            // Retrieve revert reason if possible
            if (result.length > 0) {
                 assembly {
                     let returndata_size := mload(result)
                     revert(add(32, result), returndata_size)
                 }
            } else {
                revert("Call failed");
            }
        }
        
        emit Executed(success, result);
    }
}`
    },
    concepts: [
        { label: "Check-Effect-Interaction", explanation: "The golden rule: specific state changes first, then make the external call." },
        { label: "Gas Stipend", explanation: "`.transfer()` sends 2300 gas. `.call()` sends all gas (63/64 rule)." },
        { label: "Return Data", explanation: "The raw bytes returned by the target. Needs decoding with `abi.decode`." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Phone Call",
        description: "Making an external call is like calling someone on the phone. You dial the number (Address), say something (Calldata), and maybe Venmo them money at the same time (Value). You wait for them to say something back (Return Data). If they hang up on you (`revert`), you decide if you want to hang up too or keep going."
    },
    underTheHood: {
        description: "The `CALL` opcode is complex. It creates a new sub-context. It returns a boolean (1=success, 0=failure) onto the stack. It does NOT automatically bubble up reverts; you must check the boolean.",
        opcodes: ["CALL", "RETURNDATASIZE", "RETURNDATACOPY"]
    },
    gasAnalysis: {
        description: "Calls are expensive.",
        tips: [
            "Use `staticcall` if you only need to read data (safer).",
            "Batch calls using Multicall to save transaction base fee cost."
        ]
    },
    securityInsights: {
        description: "Unhandled return values are dangerous.",
        risks: [
            "Silently Failing Sends: If you use `.call` and don't check `success`, the transfer might fail but your contract thinks it worked."
        ]
    }
}
