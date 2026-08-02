"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Server,
  Globe,
  Play,
  Layers,
  Rocket,
  BookOpen,
  Code2,
  MonitorSmartphone,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Animated Counter Hook                                             */
/* ------------------------------------------------------------------ */
function useCountUp(target: number, duration = 1800, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, shouldStart]);
  return count;
}

/* ------------------------------------------------------------------ */
/*  Architecture Diagram Node                                         */
/* ------------------------------------------------------------------ */
function DiagramNode({
  label,
  sublabel,
  icon: Icon,
  color,
  delay,
}: {
  label: string;
  sublabel: string;
  icon: React.ElementType;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className="flex flex-col items-center gap-2 relative z-10"
    >
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border flex items-center justify-center shadow-lg ${color}`}
      >
        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>
      <span className="text-sm sm:text-base font-bold text-foreground">
        {label}
      </span>
      <span className="text-[11px] text-muted-foreground text-center max-w-[100px] leading-tight">
        {sublabel}
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated connector arrow between diagram nodes                    */
/* ------------------------------------------------------------------ */
function DiagramArrow({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="hidden sm:flex items-center origin-left"
    >
      <div className="w-12 md:w-20 h-[2px] bg-gradient-to-r from-cyan-500/60 to-blue-500/60 relative">
        {/* Animated pulse traveling along the arrow */}
        <motion.div
          className="absolute top-[-2px] left-0 w-3 h-[6px] rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          animate={{ left: ["0%", "100%"] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatDelay: 0.6,
            ease: "easeInOut",
            delay: delay + 0.5,
          }}
        />
      </div>
      <ArrowRight className="w-4 h-4 text-blue-400/70 -ml-1" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile vertical connector                                         */
/* ------------------------------------------------------------------ */
function DiagramArrowVertical({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      whileInView={{ opacity: 1, scaleY: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="flex sm:hidden flex-col items-center origin-top"
    >
      <div className="w-[2px] h-8 bg-gradient-to-b from-cyan-500/60 to-blue-500/60" />
      <ArrowRight className="w-4 h-4 text-blue-400/70 rotate-90 -mt-1" />
    </motion.div>
  );
}

/* ================================================================== */
/*  HOMEPAGE                                                          */
/* ================================================================== */
export default function HomePage() {
  /* Stats section - trigger counters on scroll */
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  const moduleCount = useCountUp(35, 1600, statsInView);
  const phaseCount = useCountUp(5, 1200, statsInView);
  const labCount = useCountUp(20, 1400, statsInView);

  /* Feature cards data */
  const features = [
    {
      title: "Server Components",
      desc: "Zero-bundle execution model that streams HTML directly from the server — no JS shipped to the client.",
      icon: Server,
      accent: "text-cyan-400",
      bg: "bg-cyan-400/10 border-cyan-400/20",
    },
    {
      title: "Streaming UI",
      desc: "Progressive rendering powered by React Suspense boundaries for instant perceived load times.",
      icon: Zap,
      accent: "text-amber-400",
      bg: "bg-amber-400/10 border-amber-400/20",
    },
    {
      title: "SSR / SSG / ISR",
      desc: "Granular cache control and revalidation strategies deployed at the global CDN edge.",
      icon: Globe,
      accent: "text-emerald-400",
      bg: "bg-emerald-400/10 border-emerald-400/20",
    },
    {
      title: "Server Actions",
      desc: "Type-safe RPC layer connecting client forms directly to server-side mutation logic.",
      icon: Layers,
      accent: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* ============================================================ */}
      {/*  HERO SECTION                                                */}
      {/* ============================================================ */}
      <section className="relative pt-20 md:pt-28 pb-24 overflow-hidden border-b border-border/60">
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-15%] left-[15%] w-[520px] h-[520px] bg-cyan-500/15 rounded-full blur-[160px]" />
          <div className="absolute bottom-[5%] right-[10%] w-[420px] h-[420px] bg-blue-600/10 rounded-full blur-[140px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 text-center flex flex-col items-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-8 shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            Next.js 15 · App Router · Interactive
          </motion.div>

          {/* Heading — cyan-to-blue gradient only, NO purple */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.08]"
          >
            Master Next.js{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              App Router
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            Explore interactive visualizations, live code playgrounds, and
            animated architecture diagrams that make advanced Next.js concepts
            click — instantly.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/nextjscosmos/concepts"
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/nextjscosmos/playground"
              className="px-8 py-4 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-current" />
              <span>Open Playground</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  ANIMATED ARCHITECTURE DIAGRAM                               */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 border-b border-border/60 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2 block">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              The App Router Request Lifecycle
            </h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto">
              Watch data flow from the browser through edge middleware, server
              components, and back to the client — all in real time.
            </p>
          </motion.div>

          {/* Diagram */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            <DiagramNode
              label="Client"
              sublabel="Browser Request"
              icon={MonitorSmartphone}
              color="text-cyan-400 bg-cyan-400/10 border-cyan-400/25"
              delay={0}
            />
            <DiagramArrow delay={0.15} />
            <DiagramArrowVertical delay={0.15} />

            <DiagramNode
              label="Edge"
              sublabel="Middleware & Routing"
              icon={Zap}
              color="text-amber-400 bg-amber-400/10 border-amber-400/25"
              delay={0.25}
            />
            <DiagramArrow delay={0.4} />
            <DiagramArrowVertical delay={0.4} />

            <DiagramNode
              label="Server"
              sublabel="RSC Rendering"
              icon={Server}
              color="text-emerald-400 bg-emerald-400/10 border-emerald-400/25"
              delay={0.5}
            />
            <DiagramArrow delay={0.65} />
            <DiagramArrowVertical delay={0.65} />

            <DiagramNode
              label="Response"
              sublabel="Streamed HTML + RSC Payload"
              icon={Globe}
              color="text-blue-400 bg-blue-400/10 border-blue-400/25"
              delay={0.75}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURE HIGHLIGHT CARDS                                     */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2 block">
              Core Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              What You&apos;ll Master
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 180 }}
                className="group p-6 rounded-2xl border border-border bg-card shadow-md hover:shadow-xl hover:border-cyan-500/40 transition-all flex flex-col"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${f.bg} ${f.accent}`}
                >
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-cyan-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  INTERACTIVE STATS BANNER                                    */}
      {/* ============================================================ */}
      <section
        ref={statsRef}
        className="py-20 md:py-24 border-b border-border/60 bg-muted/30 relative overflow-hidden"
      >
        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              {
                value: moduleCount,
                suffix: "+",
                label: "Interactive Modules",
                icon: BookOpen,
              },
              {
                value: phaseCount,
                suffix: "",
                label: "Learning Phases",
                icon: Layers,
              },
              {
                value: labCount,
                suffix: "+",
                label: "Hands-On Labs",
                icon: Code2,
              },
              {
                value: 1,
                suffix: "",
                label: "Live Code Editor",
                icon: Rocket,
                isStatic: true,
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2"
              >
                <stat.icon className="w-6 h-6 text-cyan-400 mb-1" />
                <span className="text-4xl sm:text-5xl font-black text-foreground tabular-nums">
                  {/* For the Live Code Editor stat, show a checkmark icon instead of a number */}
                  {"isStatic" in stat && stat.isStatic ? (
                    <span className="text-cyan-400">✓</span>
                  ) : (
                    <>
                      {stat.value}
                      {stat.suffix}
                    </>
                  )}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  QUICK START CTA                                             */}
      {/* ============================================================ */}
      <section className="py-24 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ type: "spring", stiffness: 160 }}
          >
            <Rocket className="w-10 h-10 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Ready to deep-dive?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-10 max-w-lg mx-auto">
              Jump into the interactive learning engine and start building real
              mental models of modern Next.js architecture — today.
            </p>
            <Link
              href="/nextjscosmos/concepts"
              className="inline-flex items-center gap-2.5 px-10 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all group"
            >
              <span>Begin Your Journey</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
