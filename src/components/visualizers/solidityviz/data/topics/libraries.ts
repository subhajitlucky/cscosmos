import { type Topic } from "../topics";
import { Book } from "lucide-react";

export const libraries: Topic = {
    id: "libraries",
    title: "Libraries",
    category: "Advanced",
    icon: Book,
    shortDescription: "Stateless code reuse.",
    definition: "Libraries are stateless contracts deployed once and reused by many. They are used to add functionality to primitive types (e.g. `using SafeMath for uint`) or to reduce bytecode size by linking.",
    useCases: [
        "Math operations (SafeMath, Math.sol).",
        "Data structure logic (EnumerableSet, Linked List).",
        "Address utilities (isContract, sendValue)."
    ],
    syntaxExample: `library MathLib {
    function add(uint a, uint b) internal pure returns (uint) {
        return a + b;
    }
}

contract Calc {
    // Usage 1: Direct
    function test() public {
        MathLib.add(1, 2);
    }
    
    // Usage 2: 'Using for'
    using MathLib for uint;
    function test2(uint x) public {
        x.add(2); // Syntactic sugar
    }
}`,
    practicalExample: {
        description: "Creating an iterable mapping using a Library for clean code.",
        code: `library Set {
    struct Data { mapping(uint => bool) flags; }
    
    function insert(Data storage self, uint value) internal {
        self.flags[value] = true;
    }
    function contains(Data storage self, uint value) internal view returns (bool) {
        return self.flags[value];
    }
}

contract MyContract {
    using Set for Set.Data;
    Set.Data private mySet;

    function register(uint id) public {
        mySet.insert(id); // Clean!
    }
}`
    },
    concepts: [
        { label: "internal", explanation: "Internal library functions are inlined (copied) into your contract. No external call." },
        { label: "external/public", explanation: "External library functions are deployed separately and linked. Requires `DELEGATECALL`." },
        { label: "Linking", explanation: "The process of injecting the library's address into the contract bytecode." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Dictionary",
        description: "A Library is a reference book. If it's an **Internal** library, you rip the page out and staple it into your notes (Inline). If it's an **External** library, you leave the book in the library, and whenever you need to look something up, you walk over there (DelegateCall), read it, and come back."
    },
    underTheHood: {
        description: "Internal functions: Bytecode copy-paste (free execution context). External functions: `DELEGATECALL` (expensive context switch, but code resides elsewhere).",
        opcodes: ["DELEGATECALL"]
    },
    gasAnalysis: {
        description: "Trade-off between deployment cost and runtime cost.",
        tips: [
            "Use `internal` libraries for small utilities (cheaper runtime).",
            "Use `external` libraries for massive logic blobs to keep your contract under the 24kb limit."
        ]
    },
    securityInsights: {
        description: "Libraries execute in YOUR context.",
        risks: [
            "If you `DELEGATECALL` to a malicious library, it can destroy your contract (`SELFDESTRUCT`) or steal funds."
        ]
    }
}
