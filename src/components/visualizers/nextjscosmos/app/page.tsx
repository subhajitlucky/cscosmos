"use client";

import { motion } from "framer-motion";
import { 
  ArrowRight, Zap, Server, Globe, ChevronRight, Play, Sparkles, 
  Layers, Terminal, Cpu, CheckCircle2, ShieldCheck, Box, Flame
} from "lucide-react";
import Link from "next/link";
import { masteryPath } from "../lib/concepts-data";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-16 md:pt-24 pb-20 overflow-hidden border-b border-border/60">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            
            {/* Version Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-6 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Next.js 15 App Router Architecture Engine</span>
            </motion.div>

            {/* Hero Heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-foreground"
            >
              Master Next.js <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">App Router</span> Architecture
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
            >
              Deconstruct Server Components, Streaming UI, Hydration, SSR, and Server Actions through live, high-fidelity interactive mental models.
            </motion.p>

            {/* Hero CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
            >
              <Link 
                href="/nextjscosmos/concepts"
                className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Explore 35 Modules</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/nextjscosmos/playground"
                className="px-8 py-4 rounded-xl border border-border bg-card hover:bg-muted text-foreground font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-current" />
                <span>Open Interactive Lab</span>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section className="py-16 border-b border-border/60 bg-muted/20">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Server Components (RSC)",
                desc: "Zero-bundle execution model that streams HTML directly without shipping JavaScript to client.",
                icon: Server,
                color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
              },
              {
                title: "Streaming UI Architecture",
                desc: "Progressive page rendering powered by React Suspense boundaries for instant perception.",
                icon: Zap,
                color: "text-amber-400 bg-amber-400/10 border-amber-400/20"
              },
              {
                title: "SSG / SSR / ISR Engine",
                desc: "Granular cache control and dynamic revalidation model at modern global CDN edge.",
                icon: Globe,
                color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
              },
              {
                title: "Server Actions & Mutations",
                desc: "Type-safe RPC boundary connecting form handlers to backend server execution.",
                icon: Layers,
                color: "text-purple-400 bg-purple-400/10 border-purple-400/20"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="p-6 rounded-2xl border border-border bg-card shadow-md hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Runtime Preview & 35 Modules Catalog */}
      <section className="py-20">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
          
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">
                <Sparkles className="w-4 h-4" /> Comprehensive Mastery Curriculum
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                35 Interactive App Router Modules
              </h2>
            </div>
            <Link 
              href="/nextjscosmos/concepts"
              className="text-xs font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1.5"
            >
              <span>View Full Interactive Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Phase Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {masteryPath.map((phase) => (
              <div 
                key={phase.number}
                className="p-6 rounded-2xl border border-border bg-card shadow-lg flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                      Phase {phase.number}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">{phase.items.length} Modules</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{phase.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-6">{phase.description}</p>

                  <div className="space-y-2">
                    {phase.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/nextjscosmos/concepts/${item.slug}`}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all text-xs font-semibold group"
                      >
                        <span className="group-hover:text-cyan-400 transition-colors">{item.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-cyan-400" />
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/nextjscosmos/concepts/${phase.items[0].slug}`}
                  className="w-full py-2.5 rounded-lg border border-border bg-muted/50 hover:bg-muted text-center text-xs font-bold uppercase tracking-wider text-foreground transition-all block"
                >
                  Start Phase {phase.number} →
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
