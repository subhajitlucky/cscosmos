import { type Topic } from "../topics";
import { Table } from "lucide-react";

export const mappingsArrays: Topic = {
    id: "mappings-arrays",
    title: "Mappings & Arrays",
    category: "Fundamentals",
    icon: Table,
    shortDescription: "Key-value stores vs. Iterate lists.",
    definition: "Mappings are hash tables (O(1) lookup, no iteration, no length). Arrays are ordered lists (O(n) iteration, length tracking). Knowing when to use which is the first real architecture decision a Solidity dev makes.",
    useCases: [
        "Mapping: User Balances (`mapping(address => uint)`).",
        "Array: List of all active users (`address[] users`).",
        "Combination: Iterable Mapping (Mapping + Array)."
    ],
    syntaxExample: `// Mapping
mapping(address => uint256) public balances;
// Write
balances[msg.sender] = 100;
// Read
uint bal = balances[msg.sender];

// Array
uint256[] public scores;
// Write
scores.push(50);
// Read
uint score = scores[0];`,
    practicalExample: {
        description: "A common pattern: Accessing data efficiently. Mappings are cheap to write/read but can't be looped. Arrays can be looped but get expensive as they grow.",
        code: `contract DataStructures {
    mapping(address => uint256) public balances;
    address[] public users;

    function deposit() public payable {
        // O(1) gas cost - Constant time
        if (balances[msg.sender] == 0) {
            users.push(msg.sender); // O(1) amortized
        }
        balances[msg.sender] += msg.value;
    }

    // Dangerous! O(n) gas cost - Grows with user count
    function totalBalance() public view returns (uint256) {
        uint256 total = 0;
        for (uint i = 0; i < users.length; i++) {
            total += balances[users[i]];
        }
        return total;
    }
}`
    },
    concepts: [
        { label: "Mapping", explanation: "Virtual hash table. All keys exist and map to default value (0). Cannot be iterated." },
        { label: "Array", explanation: "Contiguous (usually) list of items. Can be dynamic (push/pop) or fixed size." },
        { label: "Sparse", explanation: "Mappings are sparse; they don't occupy space for empty keys." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Magic Locker vs. The Shelf",
        description: "**Mapping**: A locker room with infinite lockers. You can only open a locker if you have the key. You can't say 'show me all lockers with stuff in them' without checking every single one of the 2^256 lockers. **Array**: A shelf of books. You can walk down the line (iterate) and count them, but finding a specific book takes time if you don't know its index."
    },
    underTheHood: {
        description: "Mappings calculate storage slots using `keccak256(key . slot)`. Arrays use `keccak256(slot)` for the data and store the length at the `slot`. Dynamic arrays in memory work differently than storage.",
        opcodes: ["SHA3 (KECCAK256)", "SSTORE", "SLOAD"]
    },
    gasAnalysis: {
        description: "Mappings are generally cheaper for random access.",
        tips: [
            "Use Mappings for lookups (balances, allowances).",
            "Use Arrays only if you simply must iterate or keep order.",
            "Avoid unbounded loops over arrays—this is a top security/gas risk."
        ]
    },
    securityInsights: {
        description: "Array length manipulation and DoS are key risks.",
        risks: [
            "DoS by Block Gas Limit: If an array gets too big, a function iterating it effectively stops working forever.",
            "Deleting an array element leaves a gap; shuffling the last element to the gap is the gas-efficient 'swap-and-pop' trick."
        ]
    }
}
