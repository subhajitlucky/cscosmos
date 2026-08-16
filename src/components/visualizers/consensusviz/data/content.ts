export interface TopicContent {
  id: string;
  title: string;
  definition: string;
  quirkyExample: string;
  keyTakeaways: string[];
  deepDive: string;
}

export const topicContent: Record<string, TopicContent> = {
  'why-consensus': {
    id: 'why-consensus',
    title: 'Why Consensus?',
    definition: 'Consensus is the mechanism by which a group of independent participants in a network agree on a single source of truth, even if some of them fail or act maliciously.',
    quirkyExample: 'Imagine four generals surrounding a city. They must all attack at exactly 9:00 AM to win. If even one general retreats or sends a fake message to the others, the mission fails. How do they agree on the time if one of the generals might be a traitor sending conflicting orders?',
    keyTakeaways: [
      'Distributed systems have no central boss.',
      'Nodes must agree on the state (who owns what coin).',
      'The system must survive failures and attacks (Byzantine Faults).',
    ],
    deepDive: `In a centralized system, the bank's database is the golden truth. In a decentralized blockchain, thousands of computers have their own copy. Consensus ensures everyone eventually agrees on the same copy.`
  },
  'trustless-networks': {
    id: 'trustless-networks',
    title: 'Trustless Networks',
    definition: 'A trustless network is a system where you don\'t need to trust any individual participant because the protocol\'s rules and incentives ensure the system\'s integrity.',
    quirkyExample: "It's like a vending machine. You don't need to trust the owner of the machine to give you a soda; the mechanical rules (money in, soda out) guarantee the result regardless of who owns it.",
    keyTakeaways: [
      'Trust is shifted from people to mathematics and code.',
      'Verification is possible for every participant.',
      'Incentives align personal gain with network health.'
    ],
    deepDive: "In traditional finance, trust is centralized in institutions. In blockchain, trust is distributed. Every node can independently verify the entire history of transactions, making it \"trustless\" because you don't have to take anyone's word for it."
  },
  'pow-overview': {
    id: 'pow-overview',
    title: 'Proof of Work Overview',
    definition: 'Proof of Work (PoW) is a consensus mechanism that requires participants to perform "work" (computational effort) to prevent network abuse and secure the ledger.',
    quirkyExample: "Think of it as a global, digital physical exam. To prove you're a real, dedicated participant, you have to run on a treadmill for an hour. It's hard to do, but easy for anyone to see if you're sweating.",
    keyTakeaways: [
      'The first successful consensus mechanism (Bitcoin).',
      'Uses physical energy as a "scarce resource" for security.',
      'Makes attacking the network prohibitively expensive.'
    ],
    deepDive: "PoW solves the \"Sybil Attack\" problem—where one person creates millions of fake identities—by making identity cost energy. You can't fake a trillion hash calculations per second without real hardware and electricity."
  },
  'pow-mining': {
    id: 'pow-mining',
    title: 'Mining & Hash Puzzles',
    definition: 'Mining is the process of solving difficult cryptographic puzzles to discover new blocks and secure the network.',
    quirkyExample: "It's like a lottery where the winning ticket is a number that, when combined with your data, starts with 10 zeros. You just keep scratching tickets (guessing numbers) as fast as you can.",
    keyTakeaways: [
      'Mining involves finding a "nonce" that satisfies a hash difficulty.',
      'Hashing is a "one-way" function: hard to solve, easy to verify.',
      'Miners are rewarded with newly minted coins and transaction fees.'
    ],
    deepDive: "Miners compete to find a hash below a certain \"target.\" Because hash functions are random, the only way to find a solution is through trial and error (brute force). Once found, it's instant for other nodes to check if it's valid."
  },
  'difficulty-adjustment': {
    id: 'difficulty-adjustment',
    title: 'Difficulty Adjustment',
    definition: 'A mechanism that automatically changes how hard the "work" is to ensure blocks are produced at a consistent rate, regardless of total network power.',
    quirkyExample: 'Imagine a scavenger hunt. If there are 2 players, the items are hidden in easy spots. If 2,000 players join, the items are hidden behind locked doors to make sure the hunt still takes the same amount of time.',
    keyTakeaways: [
      'Keeps block times stable (e.g., 10 minutes for Bitcoin).',
      'Ensures the network remains secure as more miners join.',
      'Prevents the coin supply from being issued too quickly.'
    ],
    deepDive: `If more miners join, they could solve the puzzle faster. The protocol responds by making the puzzle harder (requiring more zeros at the start of the hash). This is a feedback loop that maintains the blockchain's heartbeat.`
  },
  'longest-chain': {
    id: 'longest-chain',
    title: 'Longest Chain Rule',
    definition: 'A rule where nodes always follow the valid chain that has the most cumulative "work" or length, resolving conflicts when two blocks are found at once.',
    quirkyExample: 'If two groups start shouting different news, you listen to the group that is louder and has been shouting the longest. Eventually, everyone joins the loudest group.',
    keyTakeaways: [
      'Solves the problem of network latency and "accidental" forks.',
      'Guarantees eventual agreement across a global network.',
      'Transactions are "final" after enough blocks are added on top.'
    ],
    deepDive: `This is known as "Nakamoto Consensus." It doesn't provide instant certainty, but rather "probabilistic finality." The more blocks on top of yours, the more "work" an attacker would have to redo to erase it.`
  },
  'forks-reorgs': {
    id: 'forks-reorgs',
    title: 'Forks & Reorgs',
    definition: 'A fork happens when the chain splits into two paths. A reorganization (reorg) occurs when a node switches from its current path to a longer, competing path.',
    quirkyExample: "You're driving on a highway that splits. You take the left path, but soon realize the right path has way more cars and goes further. You do a U-turn and join the right path instead.",
    keyTakeaways: [
      'Forks are common and usually resolve within 1-2 blocks.',
      'A "Reorg" can cause recently confirmed transactions to "disappear" temporarily.',
      'Malicious forks (51% attacks) are the main threat to this system.'
    ],
    deepDive: "Forks happen when two miners find blocks simultaneously. The network stays split until one chain becomes longer. At that point, all nodes \"reorg\" to the longer chain. This is why exchanges wait for 6+ confirmations."
  },
  'pos-overview': {
    id: 'pos-overview',
    title: 'Proof of Stake Overview',
    definition: 'Proof of Stake (PoS) is a consensus mechanism where block creators (validators) are chosen based on the number of coins they "stake" as collateral.',
    quirkyExample: 'Instead of a lottery where you buy tickets with electricity, it\'s a lottery where you buy tickets with the currency itself. If you win, you get to speak. If you lie, your tickets are burned.',
    keyTakeaways: [
      'Massively more energy-efficient than Proof of Work.',
      'Security is based on financial capital, not computational power.',
      'Validators, not miners, secure the network.'
    ],
    deepDive: `PoS removes the need for expensive hardware. Instead, you lock up your coins. The more you lock up, the higher your chance of being chosen to propose a block. It's security through economic "skin in the game."`
  },
  'pos-staking': {
    id: 'pos-staking',
    title: 'Validators & Staking',
    definition: 'The process of locking up funds to participate in the consensus process and earn rewards for honest behavior.',
    quirkyExample: 'It\'s like putting a security deposit down for an apartment. If you take care of the place, you get your money back (plus interest). If you wreck it, you lose your deposit.',
    keyTakeaways: [
      'Staking creates an opportunity cost for malicious actors.',
      'Validators are responsible for proposing and voting on blocks.',
      'Incentives are paid out in the form of staking rewards.'
    ],
    deepDive: `Validators must stay online and perform their duties. If they go offline or try to cheat, they are penalized. This ensures that the people with the most to lose are the ones running the network.`
  },
  'block-proposers': {
    id: 'block-proposers',
    title: 'Block Proposers',
    definition: 'In each "slot" or time period, the protocol selects one validator to be the "proposer" of the next block.',
    quirkyExample: 'It\'s like a classroom where the teacher points to one student and says, "You present your project now." Everyone else then checks if the project is good.',
    keyTakeaways: [
      'Selection is pseudo-random but weighted by stake.',
      'Prevents any single node from controlling the chain.',
      'The proposer must gather transactions and create a valid block.'
    ],
    deepDive: `Selection must be unpredictable to prevent "denial of service" attacks on the proposer. Modern protocols use "Verifiable Random Functions" (VRFs) to pick proposers in a way that is fair and transparent.`
  },
  'finality': {
    id: 'finality',
    title: 'Attestations & Finality',
    definition: 'Attestations are "votes" by validators on the validity of a block. Finality is the point at which a block can never be changed without massive financial loss.',
    quirkyExample: "A block proposal is a rumor. Attestations are people saying \"I heard that too and it's true.\" Finality is when the rumor is printed in every history book in the world.",
    keyTakeaways: [
      'PoS often features "checkpointing" for faster finality.',
      'Requires 2/3rds of validators to agree for a "Supermajority."',
      'Deterministic finality is much faster than PoW\'s probabilistic finality.'
    ],
    deepDive: "In Ethereum, for example, validators provide attestations in every epoch. Once a certain threshold of these votes is reached, the block is \"justified\" and then \"finalized.\" Once finalized, it is set in stone."
  },
  'slashing': {
    id: 'slashing',
    title: 'Slashing Conditions',
    definition: 'Slashing is the protocol-enforced penalty where a validator\'s staked funds are permanently taken away for malicious behavior.',
    quirkyExample: 'If a referee in a game is caught taking a bribe, not only do they get fired, but the league also takes all the money out of their bank account.',
    keyTakeaways: [
      'The ultimate deterrent for attacking the network.',
      'Usually triggered by "double signing" (signing two different blocks at once).',
      'Protects against the "Nothing at Stake" problem.'
    ],
    deepDive: `Without slashing, a validator could vote on every possible fork of the chain for free. Slashing makes it expensive to be dishonest. If you try to support two different versions of history, you lose your stake.`
  },
  'consensus-comparison': {
    id: 'consensus-comparison',
    title: 'PoW vs PoS Trade-offs',
    definition: 'Comparing the two dominant consensus mechanisms across energy, security, decentralization, and performance.',
    quirkyExample: 'PoW is like a tank: slow, heavy, consumes lots of fuel, but incredibly hard to break. PoS is like a high-speed train: efficient, fast, but relies on the track (the stake) being well-maintained.',
    keyTakeaways: [
      'PoW is more "unforgeable" but uses extreme energy.',
      'PoS is more scalable and environmentally friendly.',
      'Both aim for the same goal: a decentralized, secure ledger.'
    ],
    deepDive: `The debate often boils down to "Physical Security" (PoW) vs "Economic Security" (PoS). PoW is simpler and has been tested longer, while PoS allows for faster transactions and more complex features like instant finality.`
  }
};