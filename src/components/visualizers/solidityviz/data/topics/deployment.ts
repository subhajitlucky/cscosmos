import { type Topic } from "../topics";
import { Rocket } from "lucide-react";

export const deployment: Topic = {
    id: "deployment",
    title: "Contract Deployment",
    category: "Advanced",
    icon: Rocket,
    shortDescription: "How contracts are born.",
    definition: "Deploying a contract is a special transaction sent to the zero address. The data payload contains the 'Creation Code' (which includes the constructor logic) and the 'Runtime Code' (which lives on-chain). Contracts can also deploy other contracts using the `new` keyword or `CREATE2`.",
    useCases: [
        "Factory patterns (Spawning new pairs in Uniswap).",
        "Deterministic addresses (CREATE2).",
        "Minimal Proxies (Clones)."
    ],
    syntaxExample: `// Standard Deploy (CREATE)
Token t = new Token("MyToken");

// Deterministic Deploy (CREATE2)
// Address depends on salt + code, not nonce
Token t2 = new Token{salt: 123}("MyToken");`,
    practicalExample: {
        description: "A Factory that deploys new Wallets.",
        code: `contract Wallet {
    address public owner;
    constructor(address _owner) { owner = _owner; }
}

contract Factory {
    event Deployed(address wallet, uint salt);

    function createWallet(uint _salt) public {
        // CREATE2
        Wallet w = new Wallet{salt: bytes32(_salt)}(msg.sender);
        
        emit Deployed(address(w), _salt);
    }

    function predictAddress(uint _salt, address _owner) public view returns (address) {
        // Advanced address prediction math
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                bytes32(_salt),
                keccak256(abi.encodePacked(
                    type(Wallet).creationCode,
                    abi.encode(_owner) // Constructor args
                ))
            )
        );
        return address(uint160(uint(hash)));
    }
}`
    },
    concepts: [
        { label: "Creation Code", explanation: "The code that runs ONCE. Its job is to return the Runtime Code." },
        { label: "Runtime Code", explanation: "The code that stays on the blockchain forever." },
        { label: "Nonce", explanation: "For CREATE, address = hash(sender, nonce). For CREATE2, address = hash(sender, salt, code)." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Construction Site",
        description: "Deployment is building a house. The **Creation Code** is the construction crew. They show up, set up the foundation (Constructor), build the walls, and then they leave. The **Runtime Code** is the house that remains. The construction crew is gone forever."
    },
    underTheHood: {
        description: "`CREATE` opcode initializes a new account. It runs the init code. If the init code `RETURN`s some bytes, those bytes become the code of the new account.",
        opcodes: ["CREATE", "CREATE2", "CODECOPY"]
    },
    gasAnalysis: {
        description: "Deployment is the most expensive operation.",
        tips: [
            "Use Minimal Proxies (Clones) instead of deploying full contracts repeatedly.",
            "Remove comments and unused functions to shrink bytecode."
        ]
    },
    securityInsights: {
        description: "Constructor front-running.",
        risks: [
            "If your constructor or initialization logic is not atomic or protected, someone might be able to intercept the deploy transaction."
        ]
    }
}
