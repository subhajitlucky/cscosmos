"use client"

import { motion } from "framer-motion"
import { ArrowRight, Zap, Server, Globe, ChevronRight, Play } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-24 md:pb-32 overflow-hidden bg-grid-premium">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-50 animate-pulse" />
           <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] opacity-30" />
        </div>
        
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background pointer-events-none" />
        
        <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="group relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 overflow-hidden transition-all hover:bg-primary/10 hover:border-primary/20"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-primary/10 to-transparent" />
              
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="relative z-10">Engineered for Next.js 16</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 md:mb-8 leading-[1.1] text-gradient"
            >
              Illuminate the <br className="hidden sm:block" />
              Next.js Universe.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 md:mb-12 max-w-2xl leading-relaxed px-4 sm:px-0"
            >
              Deconstruct the App Router with high-fidelity, interactive visualizations. 
              Experience the architecture in real-time—zero abstractions, just pure mental models.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto px-6 sm:px-0"
            >
              <Link 
                href="/nextjscosmos/concepts"
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 rounded-full text-sm md:text-base font-semibold bg-primary text-primary-foreground shadow-xl shadow-primary/10 hover:bg-primary/90 transition-all w-full sm:w-auto"
              >
                Explore the Cosmos <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/nextjscosmos/playground"
                className="inline-flex items-center justify-center h-12 md:h-14 px-8 rounded-full text-sm md:text-base font-semibold border border-border bg-background/50 backdrop-blur-xs hover:bg-muted transition-all w-full sm:w-auto"
              >
                Open Playground <Play className="ml-2 h-4 w-4 fill-current" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-1px bg-transparent md:bg-border overflow-hidden rounded-3xl md:border border-border">
            {[
              {
                title: "Server Components",
                desc: "Visualize the zero-bundle size execution model.",
                icon: Server,
                color: "text-blue-500"
              },
              {
                title: "Streaming Architecture",
                desc: "Observe how Suspense boundaries deliver UI progressively.",
                icon: Zap,
                color: "text-amber-500"
              },
              {
                title: "Static & Dynamic",
                desc: "Understand the lifecycle of SSG, SSR, and ISR.",
                icon: Globe,
                color: "text-emerald-500"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 md:p-10 hover:bg-muted/50 transition-colors group rounded-2xl md:rounded-none border border-border md:border-none shadow-sm md:shadow-none">
                <feature.icon className={`h-8 w-8 md:h-10 md:w-10 mb-6 ${feature.color}`} />
                <h3 className="text-lg md:text-xl font-bold mb-3 flex items-center gap-2">
                  {feature.title}
                  <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visualizer Showcase */}
      <section className="py-24 md:py-32">
        <div className="container-custom px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                Architectural Clarity <br className="hidden md:block" /> by Design.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                We believe that complex technical concepts shouldn&apos;t be explained with text walls. 
                Our visualizers are built using real Next.js runtime logs to show you exactly 
                how your application behaves in production.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center lg:justify-start">
                <div className="flex -space-x-3 md:space-x-[-1rem]">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[8px] md:text-[10px] font-bold">
                       JD
                    </div>
                  ))}
                </div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">
                  Trusted by 2,000+ developers
                </p>
              </div>
            </div>
            
            <div className="relative px-4 sm:px-0">
              <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] md:rounded-[3rem] blur-2xl md:blur-3xl opacity-50" />
              <div className="relative aspect-video rounded-2xl md:rounded-3xl border border-border bg-background shadow-2xl overflow-hidden p-1 bg-linear-to-br from-border/50 to-transparent">
                 <div className="h-full w-full rounded-[1.4rem] bg-zinc-950 flex flex-col">
                    <div className="h-8 border-b border-white/5 flex items-center px-4 gap-1.5">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                       <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                       <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                       <div className="ml-4 h-3 w-32 bg-white/5 rounded" />
                    </div>
                    <div className="flex-1 p-8 font-mono text-xs text-zinc-500 space-y-4">
                       <div className="flex gap-4">
                          <span className="text-emerald-500">GET</span>
                          <span className="text-zinc-300">/dashboard</span>
                          <span className="ml-auto text-zinc-600">200 OK</span>
                       </div>
                       <div className="space-y-2">
                          <div className="h-1.5 w-full bg-white/5 rounded" />
                          <div className="h-1.5 w-3/4 bg-white/5 rounded" />
                          <div className="h-1.5 w-5/6 bg-white/5 rounded" />
                       </div>
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: [0, 1, 0] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         className="flex gap-2 items-center text-primary"
                       >
                         <span className="h-2 w-2 rounded-full bg-primary" />
                         Streaming payload...
                       </motion.div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
