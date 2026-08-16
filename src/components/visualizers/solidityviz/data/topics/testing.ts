import { type Topic } from "../topics";
import { TestTube } from "lucide-react";

export const testing: Topic = {
    id: "testing",
    title: "Testing & Verification",
    category: "Advanced",
    icon: TestTube,
    shortDescription: "Ensuring correctness before mainnet.",
    definition: "Smart contracts are immutable. Bugs are forever. Testing is the only defense. Modern testing involves Unit Tests (Foundry/Hardhat), Fuzzing (random inputs), and Formal Verification (proving math).",
    useCases: [
        "Catching edge cases.",
        "Proving invariants (e.g. 'Token supply never exceeds 1M').",
        "Simulating mainnet forks."
    ],
    syntaxExample: `// Foundry / Solidity Test style
contract TokenTest is Test {
    Token t;

    function setUp() public {
        t = new Token();
    }

    function testTransfer() public {
        t.mint(address(this), 100);
        t.transfer(address(1), 50);
        assertEq(t.balanceOf(address(1)), 50);
    }
    
    // Fuzz Test (random amount)
    function testFuzzTransfer(uint96 amount) public {
        t.mint(address(this), amount);
        t.transfer(address(1), amount);
        assertEq(t.balanceOf(address(1)), amount);
    }
}`,
    practicalExample: {
        description: "A comprehensive test suite for a Vault.",
        code: `contract VaultTest {
    Vault vault;
    address user = address(1);

    function testDeposit() public {
        vm.prank(user); // Act as user
        vault.deposit{value: 1 ether}();
        
        assert(vault.balanceOf(user) == 1 ether);
    }

    function testFailWithdrawTooMuch() public {
        vm.prank(user);
        vault.withdraw(100 ether); // Should revert
    }
}`
    },
    concepts: [
        { label: "Unit Test", explanation: "Testing one function in isolation." },
        { label: "Fuzzing", explanation: "Throwing millions of random inputs at a function to find crashes." },
        { label: "Invariant", explanation: "A property that must ALWAYS be true (e.g. Total Solvency)." }
    ],
    visualizer: "stack",
    mentalModel: {
        title: "The Crash Test Dummy",
        description: "Testing is putting your car (contract) in a facility and smashing it into walls, dropping it from cranes, and flooding it with water (Fuzzing). If it survives the torture chamber, it might survive the Public Mempool."
    },
    underTheHood: {
        description: "Foundry tests are actually solidity contracts running in a local EVM. Specific cheatcodes (`vm.`) allow you to manipulate time, block number, and even other addresses.",
        opcodes: ["STATICCALL (vm)"]
    },
    gasAnalysis: {
        description: "Gas reporting in tests helps optimization.",
        tips: [
            "Use `forge test --gas-report` to see which functions consume the most gas."
        ]
    },
    securityInsights: {
        description: "100% coverage does not mean 100% secure.",
        risks: [
            "Tests only check what you tell them to check. Logic flaws (correct implementation of bad ideas) are rarely caught by tests."
        ]
    }
}
