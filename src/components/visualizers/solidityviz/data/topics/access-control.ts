import { type Topic } from "../topics";
import { Lock } from "lucide-react";

export const accessControl: Topic = {
    id: "access-control",
    title: "Access Control",
    category: "Security",
    icon: Lock,
    shortDescription: "Who can do what?",
    definition: "Restricting who can call sensitive functions. From simple `Ownable` (one admin) to complex Role-Based Access Control (RBAC) (Minter, Burner, Admin).",
    useCases: [
        "Upgradeability (Admin only).",
        "Minting Tokens.",
        "Pausing Contracts."
    ],
    syntaxExample: `address public owner;

modifier onlyOwner() {
    require(msg.sender == owner);
    _;
}

// OpenZeppelin AccessControl
bytes32 public constant MINTER_ROLE = keccak256("MINTER");

function mint() public onlyRole(MINTER_ROLE) { ... }`,
    practicalExample: {
        description: "Implementing a basic Role Based system.",
        code: `contract SecureSystem {
    mapping(address => bool) public isAdmin;
    address public superAdmin;

    constructor() {
        superAdmin = msg.sender;
        isAdmin[msg.sender] = true;
    }

    modifier onlyAdmin() {
        require(isAdmin[msg.sender], "Not Admin");
        _;
    }

    function addAdmin(address newAdmin) public {
        require(msg.sender == superAdmin, "Only Super");
        isAdmin[newAdmin] = true;
    }
    
    function sensitiveAction() public onlyAdmin {
        // ...
    }
}`
    },
    concepts: [
        { label: "Role", explanation: "A label (hash) assigned to addresses." },
        { label: "Renounce", explanation: "The ability to give up a role forever (e.g. decentralizing ownership)." },
        { label: "MultiSig", explanation: "Requiring M-of-N signatures for an action." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The ID Card System",
        description: "Simple ownership is like a key to the house; whoever holds it opens the door. RBAC is like a corporate ID badge. The badge itself says 'Accounting' or 'Security'. The door reader checks the badge type, not just who you are."
    },
    underTheHood: {
        description: "Standard access control is just `msg.sender` checking. Complex RBAC is usually a `mapping(bytes32 => mapping(address => bool))` (Role -> User -> HasRole).",
        opcodes: ["CALLER", "EQ", "JUMPI"]
    },
    gasAnalysis: {
        description: "Complex RBAC costs more storage.",
        tips: [
            "Use `Ownable` for simple contracts (1 slot).",
            "Use `AccessControl` for complex systems (mappings cost 20k gas to set up per user)."
        ]
    },
    securityInsights: {
        description: "Lost keys are fatal.",
        risks: [
            "Centralization Risk: One key compromised = System compromised.",
            "Locked Out: Renouncing ownership accidentally means no one can manage the contract ever again."
        ]
    }
}
