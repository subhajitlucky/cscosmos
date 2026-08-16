import { Hash, FileSignature, Shield, Network, Key, Search, ArrowLeftRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  content: {
    definition: string;
    analogy: string;
    keyPoints: string[];
    realWorldUsage: string;
  };
  visualizerType: 'none' | 'intro' | 'hash-simple' | 'hash-props' | 'avalanche' | 'hash-vs-enc' | 'sig-concept' | 'pk-concept' | 'sig-vs-ver' | 'keys' | 'signature' | 'blockchain';
}

export const TOPICS: Topic[] = [
  {
    id: 'intro',
    title: 'What is Cryptography',
    description: 'The science of digital secrets.',
    icon: Shield,
    content: {
      definition: "At its core, cryptography is the art of transforming information so it's only readable by the intended recipient. It is the invisible shield that protects your bank balance, your private messages, and your digital identity.",
      analogy: "A magic envelope. Anyone can see the envelope exists, but only the person with the correct magic key can make the text inside appear.",
      keyPoints: [
        "Confidentiality: Only authorized eyes can read the data.",
        "Integrity: Proof that the data wasn't changed in transit.",
        "Authentication: Proof of exactly who sent the message."
      ],
      realWorldUsage: "Every time you see the 'Padlock' icon in your browser (HTTPS), cryptography is working to keep your credit card and passwords safe from hackers."
    },
    visualizerType: 'intro'
  },
  {
    id: 'hashing',
    title: 'Hash Functions',
    description: 'The digital fingerprint of data.',
    icon: Hash,
    content: {
      definition: "A hash function is a one-way mathematical algorithm that turns any amount of data into a unique, fixed-size string of characters. No matter how large the input, the output (the hash) is always the same length.",
      analogy: "A digital smoothie. You can turn fruit into a smoothie, but you can't look at the smoothie and turn it back into the original fruit.",
      keyPoints: [
        "Deterministic: Same input always results in the same output.",
        "Fixed-Size: A single letter or a whole book results in a fixed-length string.",
        "Collision Resistant: It's nearly impossible for two different inputs to have the same hash."
      ],
      realWorldUsage: "Companies like Google and Facebook don't store your actual password. They store a 'Hash' of it. When you log in, they hash your entry and see if it matches the stored fingerprint."
    },
    visualizerType: 'hash-simple'
  },
  {
    id: 'hash-properties',
    title: 'Properties of Hash Functions',
    description: 'Why tiny changes break everything.',
    icon: Search,
    content: {
      definition: "Cryptographic hashes have a unique property called the 'Avalanche Effect'. If you change just a single bit of the input, the resulting hash changes so drastically that it appears completely unrelated to the original.",
      analogy: "A house of cards. If you nudge just one card at the bottom, the entire structure collapses and looks nothing like it did before.",
      keyPoints: [
        "Unpredictability: You cannot guess the output based on the input.",
        "Sensitivity: Even adding a single space changes the entire fingerprint.",
        "Integrity Check: This makes it easy to spot if data has been tampered with."
      ],
      realWorldUsage: "When you download a large file (like a video game), your computer checks the 'Checksum' (a hash) to make sure not a single byte was corrupted during the download."
    },
    visualizerType: 'avalanche'
  },
  {
    id: 'hashing-vs-encryption',
    title: 'Hashing vs Encryption',
    description: 'One-way vs. Two-way security.',
    icon: ArrowLeftRight,
    content: {
      definition: "Hashing is for verifying identity (One-Way), while Encryption is for hiding conversations (Two-Way). Hashing is like a seal; Encryption is like a safe.",
      analogy: "Hashing is like taking a fingerprint: you can check if it matches, but you can't 'grow' a human from it. Encryption is like putting a letter in a locked box: you can get the letter back if you have the key.",
      keyPoints: [
        "Usage: Hashing for passwords/files; Encryption for private messages.",
        "The Key: Hashing requires NO key; Encryption MUST have a key.",
        "Reversibility: Hashing is permanent; Encryption is reversible."
      ],
      realWorldUsage: "Use Hashing when you need to prove you know a secret without revealing it. Use Encryption when you need to send a secret to someone else."
    },
    visualizerType: 'hash-vs-enc'
  },
  {
    id: 'public-key',
    title: 'Public Key Cryptography',
    description: 'The foundation of modern identity.',
    icon: Key,
    content: {
      definition: "Public Key Cryptography uses a mathematically linked pair of keys: a Public Key (which you share) and a Private Key (which you keep secret). What one key locks, only the other can unlock.",
      analogy: "A mailbox with a slot. Anyone can drop a letter in (Public Key), but only you have the key to open the back and read the mail (Private Key).",
      keyPoints: [
        "Public Key: Like your email address or home address.",
        "Private Key: Like your house key or password. NEVER share it.",
        "The Magic: You can derive the Public key from the Private, but never the other way around."
      ],
      realWorldUsage: "This powers the entire internet. When you connect to Amazon, your browser uses Amazon's Public Key to lock your data so only Amazon's Private Key can open it."
    },
    visualizerType: 'pk-concept'
  },
  {
    id: 'digital-signatures',
    title: 'Digital Signatures',
    description: 'Proving authenticity.',
    icon: FileSignature,
    content: {
      definition: "A digital signature is a mathematical proof of origin. To create one, you take a hash of your message and encrypt that small hash with your Private Key. This 'signs' the data without revealing your secret.",
      analogy: "The Wax Seal. You use your unique signet ring (Private Key) to leave a mark. Anyone can look at the mark and know it's yours, but they can't recreate it without your ring.",
      keyPoints: [
        "Non-Repudiation: The sender cannot deny sending the message.",
        "Efficiency: We sign the small 'hash' instead of the big 'file' for speed.",
        "Tamper-Proof: If the message changes, the signature immediately becomes invalid."
      ],
      realWorldUsage: "Software updates use digital signatures. Your computer only installs an update if it has a valid signature from Apple or Microsoft, proving it's not a virus."
    },
    visualizerType: 'sig-concept'
  },
  {
    id: 'signing-vs-verification',
    title: 'Signing vs Verification',
    description: 'The distinct roles of key pairs.',
    icon: FileSignature,
    content: {
      definition: "Signing and Verification are two halves of the same coin. The Sender uses their Private Key to 'Lock' the identity, and the Receiver uses the Sender's Public Key to 'Unlock' and confirm it.",
      analogy: "Signing is like writing a check with a secret pen. Verification is like a bank teller using a special light to prove the signature is genuine.",
      keyPoints: [
        "Signing: Hash(Data) + Private Key = Signature.",
        "Verification: Signature + Public Key = Original Hash.",
        "Final Check: If the 'Verified Hash' matches the 'Received Data Hash', it's valid."
      ],
      realWorldUsage: "In Bitcoin, when you 'Send BTC', you are actually providing a Digital Signature. Miners verify your signature using your Public Key to authorize the move."
    },
    visualizerType: 'sig-vs-ver'
  },
  {
    id: 'blockchain',
    title: 'Why Blockchains Need Cryptography',
    description: 'Building trust without middlemen.',
    icon: Network,
    content: {
      definition: "Blockchains use hashes to link blocks into an unbreakable chain and digital signatures to authorize moves. It's a ledger where history is protected by math rather than by a bank or government.",
      analogy: "A public book where every page starts by summarizing the page before it. If you change a single word on page 1, the summaries on all 1,000 following pages will no longer match.",
      keyPoints: [
        "Hashed Linking: Block N contains the hash of Block N-1.",
        "Immutability: You can't rewrite history without breaking the future.",
        "Trustless: We don't need to trust people; we trust the math."
      ],
      realWorldUsage: "Cryptocurrencies like Ethereum use these links to ensure that once a transaction is recorded, it can never be deleted or modified by anyone."
    },
    visualizerType: 'blockchain'
  }
];