export interface BlockchainCheatSheetSection {
  id: string;
  title: string;
  category: string;
  snippets: {
    title: string;
    description: string;
    code: string;
    tip: string;
  }[];
}

export const BLOCKCHAIN_CHEATSHEET: BlockchainCheatSheetSection[] = [
  {
    id: 'solidity-security',
    title: 'Solidity Security & Gas Patterns',
    category: 'Solidity & EVM',
    snippets: [
      {
        title: 'Custom Errors (Gas Optimization)',
        description: 'Replace expensive revert strings with cheap custom errors (saves 50+ gas per revert)',
        code: `// Define custom error:
error InsufficientBalance(uint256 available, uint256 required);

function transfer(address to, uint256 amount) external {
  if (balances[msg.sender] < amount) {
    revert InsufficientBalance(balances[msg.sender], amount);
  }
  balances[msg.sender] -= amount;
  balances[to] += amount;
}`,
        tip: 'Custom errors encode as 4-byte selectors, avoiding expensive string ABI encoding in bytecode.'
      },
      {
        title: 'Safe ETH Transfer Pattern',
        description: 'Recommended way to send ETH without 2,300 gas stipend limitations',
        code: `(bool success, ) = recipient.call{value: amount}("");
if (!success) {
  revert TransferFailed();
}`,
        tip: 'Always pair with ReentrancyGuard to prevent re-entrant callbacks.'
      }
    ]
  },
  {
    id: 'web3-ethers',
    title: 'Ethers.js / Viem Cryptography & RPC Operations',
    category: 'Web3 SDK',
    snippets: [
      {
        title: 'Compute Keccak-256 Hash of Packed Data',
        description: 'Match Solidity abi.encodePacked in TypeScript',
        code: `import { keccak256, encodePacked } from 'viem';

const messageHash = keccak256(
  encodePacked(['address', 'uint256'], ['0x71C...897', 1000000000000000000n])
);`,
        tip: 'Ensure uint256 values are passed as BigInt (n suffix) to avoid JavaScript floating point truncation.'
      },
      {
        title: 'EIP-712 Typed Structured Data Signing',
        description: 'Sign human-readable transactions off-chain',
        code: `const domain = {
  name: 'MyDApp',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcC...123'
};

const signature = await walletClient.signTypedData({
  domain,
  types: { Permit: [{ name: 'spender', type: 'address' }, { name: 'value', type: 'uint256' }] },
  primaryType: 'Permit',
  message: { spender: '0x123...', value: 100n }
});`,
        tip: 'Protects users from phishing by displaying clear message fields in MetaMask.'
      }
    ]
  }
];
