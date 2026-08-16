import { type Topic } from "../topics";
import { Plug } from "lucide-react";

export const interfaces: Topic = {
    id: "interfaces",
    title: "Interfaces",
    category: "Advanced",
    icon: Plug,
    shortDescription: "Talking to other contracts.",
    definition: "Interfaces define separate the 'what' (function signatures) from the 'how' (implementation). They contain no state and no function bodies. They are used to call other contracts or define standards (ERC20, ERC721).",
    useCases: [
        "Calling Uniswap or external DeFi protocols.",
        "Ensuring your contract adheres to a token standard.",
        "Decoupling architecture."
    ],
    syntaxExample: `interface IERC20 {
    function transfer(address to, uint amount) external returns (bool);
    function balanceOf(address account) external view returns (uint);
}

contract MyBot {
    function checkBalance(address token, address user) external view returns (uint) {
        // Calling external contract via interface
        return IERC20(token).balanceOf(user);
    }
}`,
    practicalExample: {
        description: "Interacting with an unknown contract via an interface.",
        code: `interface ILogger {
    function log(string memory message) external;
}

contract App {
    address public loggerAddress;

    function setLogger(address _logger) public {
        loggerAddress = _logger;
    }

    function doWork() public {
        // We don't know the code of Logger, only its shape
        ILogger(loggerAddress).log("Work done");
    }
}`
    },
    concepts: [
        { label: "ABI", explanation: "Application Binary Interface. The standard way to encode data for contract calls." },
        { label: "Polymorphism", explanation: "You can swap the `loggerAddress` for ANY contract that implements `log`, and it just works." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Universal Remote",
        description: "An Interface is a User Manual or a Remote Control. It has buttons labeled 'Volume Up' and 'Power'. It doesn't tell you *how* the TV works inside, but if you point it at any supported TV (contract) and press the button, it does the action."
    },
    underTheHood: {
        description: "An interface call compiles to an external `CALL`. It takes the function selector (e.g., `bytes4(keccak256('transfer(address,uint256)'))`) and the encoded arguments, and sends them to the target address.",
        opcodes: ["EXTCODESIZE", "STATICCALL", "CALL"]
    },
    gasAnalysis: {
        description: "External calls are expensive.",
        tips: [
            "Don't call interfaces in a loop.",
            "Use `staticcall` (view functions) when you don't need to change state."
        ]
    },
    securityInsights: {
        description: "The target might not be what you think.",
        risks: [
            "The contract at `loggerAddress` might not actually implement `log`, causing a revert.",
            "The contract might be malicious and contain reentrancy traps."
        ]
    }
}
