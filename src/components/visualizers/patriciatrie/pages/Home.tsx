import React, { useRef } from 'react';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Layers, ShieldCheck, Activity, Globe, Database, Code2, Network } from 'lucide-react';

const Home: React.FC = () => {
  const { scrollY } = useScroll();
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="relative min-h-screen overflow-hidden pb-32">
      {/* Cinematic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/15 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] left-[20%] right-[20%] h-[60%] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.02)_100%)] opacity-50" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-20 px-4 max-w-7xl mx-auto flex flex-col items-center perspective-1000">
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-0 right-0 opacity-10 dark:opacity-20 pointer-events-none"
        >
          <Network size={400} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-8 z-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-neutral-600 dark:text-neutral-300">
              Interactive Learning Platform
            </span>
          </div>

          <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-neutral-900 dark:text-white">
            State <span className="text-orange-600 dark:text-amber-500">Machine</span>
            <br />
            <span className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-400">Architecture</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
            Deconstruct the <span className="text-neutral-900 dark:text-white font-bold">Patricia Merkle Trie</span>. 
            The cryptographic structure that powers Ethereum's global consensus engine.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <MagneticButton to="/learn" primary>
              Start Masterclass <ArrowRight size={18} />
            </MagneticButton>
            <MagneticButton to="/playground">
              Enter Sandbox <Code2 size={18} />
            </MagneticButton>
          </div>
        </motion.div>

        {/* 3D Tilt Card Display */}
        <div className="mt-20 w-full max-w-4xl mx-auto h-[400px] sm:h-[500px] relative z-20">
          <TiltCard />
        </div>
      </section>

      {/* Infinite Marquee */}
      <div className="w-full overflow-hidden py-12 sm:py-24 opacity-20 pointer-events-none select-none">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 text-6xl sm:text-8xl font-black text-neutral-900 dark:text-white"
        >
          {Array(8).fill("MERKLE • PATRICIA • TRIE • CONSENSUS •").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* Bento Grid Features */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[600px]">
          <BentoItem 
            title="Path Compression" 
            desc="Optimizing storage by collapsing redundant nodes."
            icon={Layers}
            colSpan="md:col-span-2"
            bg="bg-amber-500/10"
            delay={0.1}
          />
          <BentoItem 
            title="Cryptographic Proofs" 
            desc="Trustless verification of any state."
            icon={ShieldCheck}
            bg="bg-emerald-500/10"
            delay={0.2}
          />
          <BentoItem 
            title="State Root" 
            desc="The 32-byte anchor of truth."
            icon={Database}
            bg="bg-sky-500/10"
            delay={0.3}
          />
          <BentoItem 
            title="Global Consensus" 
            desc="Deterministic execution across millions of nodes."
            icon={Globe}
            colSpan="md:col-span-2"
            bg="bg-orange-500/10"
            delay={0.4}
          />
        </div>
      </section>
    </div>
  );
};

// --- Subcomponents ---

const MagneticButton = ({ children, to, primary = false }: { children: React.ReactNode, to: string, primary?: boolean }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const ySpring = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set(e.clientX - left - width / 2);
    y.set(e.clientY - top - height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x: xSpring, y: ySpring }}>
      <Link
        ref={ref}
        to={to}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`
          relative px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 overflow-hidden group transition-all duration-300
          ${primary 
            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-2xl shadow-neutral-900/20' 
            : 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-xl'}
        `}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        <div className={`absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${primary ? 'bg-amber-500' : 'bg-neutral-100 dark:bg-neutral-800'}`} />
      </Link>
    </motion.div>
  );
};

const TiltCard = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative cursor-none"
    >
      <div className="absolute inset-4 bg-neutral-900 dark:bg-neutral-950 rounded-[48px] border border-neutral-800 shadow-2xl overflow-hidden flex items-center justify-center group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_50%)] group-hover:scale-150 transition-transform duration-700" />
        
        {/* Floating Elements */}
        <motion.div 
          style={{ transform: "translateZ(50px)" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-amber-600 flex items-center justify-center text-white shadow-2xl shadow-amber-600/30">
            <Activity size={48} />
          </div>
          <div className="text-center">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">
              Live Simulation
            </div>
            <h3 className="text-3xl font-black text-white">Interactive Trie</h3>
          </div>
        </motion.div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />
      </div>
    </motion.div>
  );
};

interface BentoItemProps {
  title: string;
  desc: string;
  icon: React.ElementType;
  colSpan?: string;
  bg: string;
  delay: number;
}

const BentoItem = ({ title, desc, icon: Icon, colSpan = "", bg, delay }: BentoItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    whileHover={{ scale: 0.98 }}
    className={`${colSpan} ${bg} relative rounded-[32px] p-8 border border-neutral-200/50 dark:border-white/5 backdrop-blur-sm overflow-hidden group cursor-pointer`}
  >
    <div className="absolute top-4 right-4 p-3 rounded-full bg-white/50 dark:bg-black/20 text-neutral-900 dark:text-white group-hover:scale-110 transition-transform">
      <Icon size={20} />
    </div>
    <div className="h-full flex flex-col justify-end relative z-10">
      <h3 className="text-2xl font-black text-neutral-900 dark:text-white mb-2">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 font-medium">{desc}</p>
    </div>
    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 dark:bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
  </motion.div>
);

export default Home;