import { Hash } from 'lucide-react';
import type { TopicContent } from '../../types/topic';

export const merkleProofs: TopicContent = {
  id: 'merkle-proofs',
  title: 'Merkle Proofs & Light Clients',
  description: 'The mathematical magic of verifying a single account among billions with minimal data.',
  definition: 'A Merkle Proof (Inclusion Proof) is a logarithmic-sized dataset (O(log N)) that proves a specific key-value pair exists within a trie identified by a specific State Root.',
  analogy: 'A notary who doesn\'t look at your whole bank account history, but just verifies the signatures on a single transaction to confirm it\'s valid.',
  deepDive: 'In Ethereum, a proof is a list of RLP-encoded nodes. A \'Light Client\' starts with a trusted 32-byte State Root. To verify an account balance, it only needs the path of nodes from the root to the leaf. It hashes the leaf, then uses the neighbor data in the proof to re-calculate the hash of the parent, repeating this until it reaches the root. If the final hash matches the trusted State Root, the balance is verified without needing the full 500GB+ state.',
  steps: [
    { title: 'Path Generation', description: 'A full node searches the trie and collects all nodes along the search path into a list.' },
    { title: 'Verification Hashing', description: 'The verifier re-calculates the Keccak-256 hash of each node in the proof, moving bottom-up.' },
    { title: 'Trustless Access', description: 'Enables hardware wallets and mobile apps to interact with the blockchain with full cryptographic security.' }
  ],
  visualType: 'proof',
  icon: Hash,
  color: 'text-rose-500',
  tag: 'Verification'
};
