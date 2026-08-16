import { useParams, Link } from '@/components/visualizers/shared/RouterShim';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Zap, BarChart3, Globe, ShieldCheck, type LucideIcon, Sparkles, BookOpen, Fingerprint, Binary } from 'lucide-react';
import { type FC, useState } from 'react';
import { useSound } from '../hooks/useSound';

// Visualizers
import { TamperSimulation } from '../components/visualizers/TamperSimulation';
import { AvalancheSimulation } from '../components/visualizers/AvalancheSimulation';
import { LeafConstruction } from '../components/visualizers/LeafConstruction';
import { InternalNodeVisualizer } from '../components/visualizers/InternalNodeVisualizer';
import { MerkleRootVisualizer } from '../components/visualizers/MerkleRootVisualizer';
import { BinaryStructureVisualizer } from '../components/visualizers/BinaryStructureVisualizer';
import { ProofPathVisualizer } from '../components/visualizers/ProofPathVisualizer';
import { EfficiencyVisualizer } from '../components/visualizers/EfficiencyVisualizer';
import { BlockchainVisualizer } from '../components/visualizers/BlockchainVisualizer';

const TopicVisualizer = ({ type }: { type: string }) => {
  switch (type) {
    case 'tamper': return <TamperSimulation />;
    case 'avalanche': return <AvalancheSimulation />;
    case 'leaf': return <LeafConstruction />;
    case 'internal': return <InternalNodeVisualizer />;
    case 'root': return <MerkleRootVisualizer />;
    case 'binary': return <BinaryStructureVisualizer />;
    case 'proof': return <ProofPathVisualizer />;
    case 'efficiency': return <EfficiencyVisualizer />;
    case 'blockchain': return <BlockchainVisualizer />;
    default: return <div className="text-muted text-sm">Visualization not found</div>;
  }
};

const topicData: Record<string, {
  title: string;
  definition: string;
  simpleDef: string;
  analogy: string;
  details: string[];
  icon: LucideIcon;
  visualizationType: string;
}> = {
  'why-integrity': {
    title: 'Why Data Integrity Matters',
    definition: 'Cryptographic integrity provides a mathematical guarantee that data has not been altered. Unlike checksums which detect accidental errors, cryptographic verification prevents intentional tampering by ensuring it is computationally infeasible to generate a valid proof for corrupted data.',
    simpleDef: 'It is a way to make sure that the information you receive is exactly what was sent, and that no one has changed it even a little bit.',
    analogy: 'Like a wax seal on an envelope, but the seal is mathematically tied to every single letter in the message.',
    details: [
      'Detects unauthorized changes instantly.',
      'Ensures trust in distributed systems.',
      'Prevents malicious data injection.'
    ],
    icon: ShieldCheck,
    visualizationType: 'tamper'
  },
  'hashing-recap': {
    title: 'Hashing Recap',
    definition: 'A cryptographic hash function behaves as a deterministic random oracle. It exhibits the "Avalanche Effect", where flipping a single input bit changes approximately 50% of the output bits, making the output unpredictable and irreversible (pre-image resistant).',
    simpleDef: 'Hashing is like a digital blender. You put something in, and you get a unique "fingerprint" back. Change the input a tiny bit, and the fingerprint changes completely!',
    analogy: 'A chaotic blender where putting in a strawberry vs a strawberry with one missing seed results in two completely different colored juices.',
    details: [
      'Deterministic: Same input always gives same output.',
      'One-way: Cannot recreate data from hash.',
      'Avalanche effect: Small change = big difference.'
    ],
    icon: Zap,
    visualizationType: 'avalanche'
  },
  'leaf-nodes': {
    title: 'Leaf Nodes',
    definition: 'Leaf nodes form the foundational layer of the Merkle Tree, acting as the cryptographic commitment to the raw data. Each data block is hashed individually, ensuring that the tree structure is agnostic to the underlying data format.',
    simpleDef: 'The leaves are the very bottom of our tree. They are the fingerprints of our individual pieces of data.',
    analogy: 'The individual bricks at the base of a pyramid, each stamped with a unique code representing its contents.',
    details: [
      'Leaves are the raw data points transformed into hashes.',
      'They represent the actual content being protected.',
      'A tree with 8 items has 8 leaf nodes.'
    ],
    icon: BookOpen,
    visualizationType: 'leaf'
  },
  'internal-nodes': {
    title: 'Internal Nodes',
    definition: 'Internal nodes serve as cryptographic aggregators. By concatenating and hashing pairs of child nodes, they recursively commit to larger subsets of the data, forming a binding chain of custody from the leaves up to the root.',
    simpleDef: 'Internal nodes are like middle-managers. They take two fingerprints from below, combine them, and create a new summary fingerprint.',
    analogy: 'Middle managers who summarize reports from two direct reports and sign off on the combined result.',
    details: [
      'Formed by concatenating and hashing child pairs.',
      'Each level up reduces the number of nodes by half.',
      'They act as a cryptographic bridge to the root.'
    ],
    icon: Binary,
    visualizationType: 'internal'
  },
  'merkle-root': {
    title: 'Merkle Root',
    definition: 'The Merkle Root is the single 256-bit accumulator that cryptographically binds the entire dataset. It serves as a unique global identifier; any permutation or modification of the underlying dataset results in a completely disparate root hash.',
    simpleDef: 'The Merkle Root is the single "Master Fingerprint" at the very top. It represents everything in the tree.',
    analogy: 'The DNA of the entire structure. If you change one cell, the DNA check fails.',
    details: [
      'Changing one byte anywhere in the data changes the root.',
      'Used as a summary for an entire block of transactions.',
      'Provides a "Short Hash" for huge datasets.'
    ],
    icon: Fingerprint,
    visualizationType: 'root'
  },
  'binary-tree-structure': {
    title: 'Binary Tree Structure',
    definition: 'The strict binary structure ensures the tree remains balanced, guaranteeing a tree height of exactly ⌈log₂(N)⌉. This logarithmic property is critical for consistent performance, ensuring verification time remains manageable even as the dataset grows exponentially.',
    simpleDef: 'Everything in our tree happens in pairs. Two nodes become one, all the way to the top.',
    analogy: 'A tournament bracket where every two teams play to produce one winner for the next round.',
    details: [
      'Each pair of nodes combines into one parent.',
      'Logarithmic height: a tree with 1,000,000 leaves is only ~20 levels high.',
      'Organized and predictable path from any leaf to the root.'
    ],
    icon: Globe,
    visualizationType: 'binary'
  },
  'merkle-proofs': {
    title: 'Merkle Proofs',
    definition: 'A Merkle Proof (or Authentication Path) consists of the specific sibling hashes required to reconstruct the path from a leaf to the root. This allows a verifier to recompute the root with only O(log N) information, proving inclusion without possessing the full dataset.',
    simpleDef: 'A proof is a small set of instructions that lets you prove something is in the tree without showing the whole tree.',
    analogy: 'Proving you are related to a king by showing birth certificates of your father, grandfather, and great-grandfather, without needing the family tree of every cousin.',
    details: [
      'Only requires log₂(N) hashes.',
      'Crucial for "Light Clients" in blockchain.',
      'Enables efficient partial data verification.'
    ],
    icon: ShieldCheck,
    visualizationType: 'proof'
  },
  'efficiency': {
    title: 'Efficiency & Scalability',
    definition: 'Merkle Trees decouple verification complexity from data size. While storage grows linearly O(N), proof size and verification time grow logarithmically O(log N), enabling systems to scale to billions of records with negligible verification overhead.',
    simpleDef: 'Even if we have a trillion pieces of data, we can prove one of them is correct in just 40 steps!',
    analogy: 'Finding a book using the Dewey Decimal System (fast) vs walking every aisle looking at every title (slow).',
    details: [
      'Proof size is O(log N) instead of O(N).',
      'Perfect for systems with millions of transactions.',
      'Enables "Light" versions of heavy software.'
    ],
    icon: BarChart3,
    visualizationType: 'efficiency'
  },
  'blockchains': {
    title: 'Merkle Trees in Blockchains',
    definition: 'In blockchain architectures, the Merkle Root in the block header enables Simplified Payment Verification (SPV). Light clients can verify the inclusion of a specific transaction by checking its Merkle path against the trusted block header without downloading the entire blockchain history.',
    simpleDef: 'Blockchains use Merkle Trees to let your phone verify a payment without downloading the whole history of Bitcoin.',
    analogy: 'Checking a restaurant receipt against the total on your bank statement.',
    details: [
      'Transaction IDs are the leaves.',
      'The Merkle Root is stored in the Block Header.',
      'Saves massive amounts of bandwidth and storage.'
    ],
    icon: Globe,
    visualizationType: 'blockchain'
  }
};

const topics = [
  'why-integrity', 'hashing-recap', 'leaf-nodes', 'internal-nodes', 'merkle-root', 
  'binary-tree-structure', 'merkle-proofs', 'efficiency', 'blockchains'
];

const TopicPage: FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [isSimple, setIsSimple] = useState(false);
  const { playClick, playHover, playSuccess } = useSound();
  
  const data = topicData[topicId || ''] || topicData['why-integrity'];

  const currentIndex = topics.indexOf(topicId || '');
  const prevTopic = currentIndex > 0 ? topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < topics.length - 1 ? topics[currentIndex + 1] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-12 px-4 md:px-0">
      {/* 1. TOP NAV & PROGRESS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <Link 
            to="/learn" 
            onMouseEnter={playHover}
            className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
        >
            <ArrowLeft className="w-3 h-3 mr-2" />
            Back to Path
        </Link>

        <div className="flex items-center gap-4 bg-secondary/50 px-4 py-2 rounded-2xl border border-muted/10">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">Progress</span>
            <div className="w-32 h-1.5 bg-background rounded-full overflow-hidden">
                <div 
                    className="h-full bg-accent transition-all duration-1000" 
                    style={{ width: `${((currentIndex + 1) / topics.length) * 100}%` }}
                />
            </div>
            <span className="text-[10px] font-black text-foreground">{currentIndex + 1} / {topics.length}</span>
        </div>
      </div>

      {/* 2. HEADER & CONCEPT */}
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={`${topicId}-header`}
            className="lg:col-span-7 space-y-8"
        >
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest">
                    <data.icon className="w-3 h-3" />
                    Chapter 0{currentIndex + 1}
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">{data.title}</h1>
            </div>

            <div className="space-y-6">
                <div className="flex gap-4 border-b border-muted/10">
                    <button 
                        onClick={() => { playClick(); setIsSimple(false); }}
                        className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${!isSimple ? "text-primary" : "text-muted"}`}
                    >
                        Technical Thesis
                        {!isSimple && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />}
                    </button>
                    <button 
                        onClick={() => { playClick(); setIsSimple(true); }}
                        className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${isSimple ? "text-primary" : "text-muted"}`}
                    >
                        ELI5 Perspective
                        {isSimple && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />}
                    </button>
                </div>

                <p className="text-xl md:text-2xl leading-relaxed font-medium text-foreground/80 transition-all">
                    {isSimple ? data.simpleDef : data.definition}
                </p>
            </div>
        </motion.div>

        {/* 3. QUICK STATS SIDEBAR */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
        >
            <div className="p-8 rounded-[2.5rem] bg-card border border-card-border shadow-xl space-y-8">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mb-4">The Analogy</h4>
                    <p className="text-lg text-muted italic leading-relaxed">"{data.analogy}"</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Key Mechanics</h4>
                    <ul className="space-y-3">
                        {data.details.map((detail, i) => (
                        <li key={i} className="text-sm font-bold text-foreground/70 flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            {detail}
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
      </div>

      {/* 4. THE SIMULATION CENTER */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">Laboratory Workspace</h3>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-bold text-muted uppercase tracking-widest">Real-time Simulation Active</span>
            </div>
        </div>
        <div className="w-full min-h-[500px] md:min-h-[650px] rounded-[3rem] md:rounded-[5rem] border border-muted/20 bg-secondary/30 flex items-center justify-center p-4 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 refinery-grid opacity-10 pointer-events-none" />
            <AnimatePresence mode="wait">
            <motion.div
                key={topicId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="w-full h-full flex items-center justify-center relative z-10"
            >
                <TopicVisualizer type={data.visualizationType} />
            </motion.div>
            </AnimatePresence>
        </div>
      </section>

      {/* 5. NAVIGATION FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-12 border-t border-muted/20">
        {prevTopic ? (
          <Link 
            to={`/learn/${prevTopic}`} 
            onMouseEnter={playHover}
            className="flex items-center gap-3 text-muted-foreground font-black uppercase text-[10px] tracking-widest hover:text-primary transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Protocol
          </Link>
        ) : <div />}

        <div className="flex gap-4">
            {nextTopic ? (
            <Link 
                to={`/learn/${nextTopic}`} 
                onClick={() => { playSuccess(); }}
                onMouseEnter={playHover}
                className="flex items-center gap-4 font-black bg-primary px-10 py-5 rounded-[2rem] text-white text-xs uppercase tracking-[0.2em] hover:scale-105 shadow-2xl shadow-primary/20 transition-all"
            >
                Continue Path
                <ArrowRight className="w-4 h-4" />
            </Link>
            ) : (
            <Link 
                to="/playground" 
                onClick={() => { playSuccess(); }}
                className="flex items-center gap-4 font-black bg-accent px-10 py-5 rounded-[2rem] text-white text-xs uppercase tracking-[0.2em] hover:scale-105 shadow-2xl shadow-accent/20 transition-all"
            >
                Final Certification
                <ArrowRight className="w-4 h-4" />
            </Link>
            )}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;