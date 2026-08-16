import { type Topic } from "../topics";
import { ArrowRightLeft } from "lucide-react";

export const delegatecall: Topic = {
    id: "delegatecall",
    title: "DelegateCall & Proxies",
    category: "Advanced",
    icon: ArrowRightLeft,
    shortDescription: "Execute code from another contract in YOUR context.",
    definition: "`delegatecall` is a low-level opcode that calls another contract's function, but executes it **in the context of the caller**. This means `msg.sender`, `msg.value`, and most importantly **Storage** refer to the calling contract, not the target.",
    useCases: [
        "Upgradeable Contracts (Proxies).",
        "Libraries.",
        "Meta-transactions."
    ],
    syntaxExample: `// Implementation
contract Logic {
    uint public num;
    function setNum(uint _num) public {
        num = _num; // Sets storage of the CALLER
    }
}

// Proxy
contract Proxy {
    uint public num; // Must match layout!
    
    function upgrade(address _logic, uint _val) public {
        (bool success, ) = _logic.delegatecall(
            abi.encodeWithSignature("setNum(uint256)", _val)
        );
    }
}`,
    practicalExample: {
        description: "A basic Proxy pattern demonstrating storage modification.",
        code: `contract LogicV1 {
    uint public count; // slot 0
    function inc() public { count += 1; }
}

contract Proxy {
    uint public count; // slot 0 - Data lives here
    address public implementation; // slot 1

    constructor(address _impl) {
        implementation = _impl;
    }

    fallback() external payable {
        address _impl = implementation;
        require(_impl != address(0));

        assembly {
            // Copy msg.data to memory
            calldatacopy(0, 0, calldatasize())
            
            // Delegatecall to implementation
            let result := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)

            // Copy return data
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }
}`
    },
    concepts: [
        { label: "Context", explanation: "Who is `this`? In normal call, `this` is the target. In delegatecall, `this` is the caller." },
        { label: "Storage Layout", explanation: "Critical! Both contracts must have identical variable definitions in the same order." },
        { label: "Proxy", explanation: "A shell contract that holds state but asks a Logic contract to manipulate it." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Brain Transplant",
        description: "Imagine code is a brain and storage is a body. A normal `call` is asking your friend to do math; they use their brain and their hands. `delegatecall` is borrowing your friend's brain to move *your* hands. The logic comes from them, but the effect happens to you."
    },
    underTheHood: {
        description: "`DELEGATECALL` takes 6 arguments in assembly. It preserves `msg.sender` (unlike a normal call where `msg.sender` becomes the caller).",
        opcodes: ["DELEGATECALL", "SLOAD", "SSTORE"]
    },
    gasAnalysis: {
        description: "Slightly more expensive than call.",
        tips: [
            "Used heavily in proxies. The gas overhead of the proxy forwarding is ~1-2k gas."
        ]
    },
    securityInsights: {
        description: "The most dangerous opcode.",
        risks: [
            "Storage Collisions: If Proxy has `address impl` at slot 0, and Logic has `uint count` at slot 0, updating count overwrites the implementation address -> bricked contract.",
            "Self Destruct: If Logic has `selfdestruct`, anyone can call it via Proxy and destroy the Proxy."
        ]
    }
}
