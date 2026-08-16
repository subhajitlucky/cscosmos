import { type Topic } from "../topics";
import { PenTool } from "lucide-react";

export const signatureVerification: Topic = {
    id: "signature-verification",
    title: "Signature Verification",
    category: "Security",
    icon: PenTool,
    shortDescription: "Off-chain signing, on-chain verifying.",
    definition: "Digital signatures allow users to approve transactions or data off-chain using their private key. The smart contract can then verify 'on-chain' that a specific user signed the message, without the user spending gas to send the data.",
    useCases: [
        "Gas-less transactions (Meta-transactions).",
        "NFT Allowlist (Merkle Proofs vs Signatures).",
        "Permit (ERC20 Approve via signature)."
    ],
    syntaxExample: `// ECDSA Library 
using ECDSA for bytes32;

function verify(
    bytes32 hash,
    bytes memory signature
) public pure returns (address) {
    return hash.recover(signature);
}`,
    practicalExample: {
        description: "Verifying a message was signed by an authorised signer.",
        code: `contract Verifier {
    address public signer;

    constructor(address _signer) {
        signer = _signer;
    }

    function verify(string memory message, uint8 v, bytes32 r, bytes32 s) 
        public view returns (bool) 
    {
        // 1. Hash the message (EIP-191)
        bytes32 hash = keccak256(
            abi.encodePacked(
                "\\x19Ethereum Signed Message:\\n32",
                keccak256(bytes(message))
            )
        );

        // 2. Recover signer
        address recovered = ecrecover(hash, v, r, s);
        
        return recovered == signer;
    }
}`
    },
    concepts: [
        { label: "ECDSA", explanation: "Elliptic Curve Digital Signature Algorithm. The math behind Ethereum keys." },
        { label: "ecrecover", explanation: "The EVM precompile that takes a hash + signature and spits out an address." },
        { label: "Replay Attack", explanation: "Using the same valid signature twice. Prevent using nonces." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Wax Seal",
        description: "A digital signature is like a King's ring pressed into wax. The messenger (relayer) carries the letter. The guard (contract) looks at the seal. If it matches the King's ring, the order is executed, even if the King isn't there in person."
    },
    underTheHood: {
        description: "`ecrecover` is a **Precompile** at address 0x01. It costs 3000 gas. It performs complex elliptic curve math that would be too expensive in raw Solidity opcodes.",
        opcodes: ["STATICCALL", "ADDR 0x01"]
    },
    gasAnalysis: {
        description: "Cheaper than on-chain logic for complex validations.",
        tips: [
            "Heavy logic off-chain + light verification on-chain = Low Gas.",
            "Use EIP-712 for structured data (more readable for users but slightly more gas)."
        ]
    },
    securityInsights: {
        description: "Signature Malleability is a common issue.",
        risks: [
            "Signature Replay: Always include a `nonce` or verify the hash hasn't been used before.",
            "Cross-Chain Replay: Include `chainid` in the hash so a signature for Mainnet doesn't work on Polygon."
        ]
    }
}
