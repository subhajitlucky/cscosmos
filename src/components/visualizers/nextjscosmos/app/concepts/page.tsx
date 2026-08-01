"use client"

import { Route, Box, Zap, Layers, Server, Share2, ChevronRight, CheckCircle2, Trophy, Target } from "lucide-react"
import Link from "next/link"
import { masteryPath } from "@/components/visualizers/nextjscosmos/lib/concepts-data"
import { useProgress } from "@/components/visualizers/nextjscosmos/lib/progress-store"
import { cn } from "@/components/visualizers/nextjscosmos/lib/utils"

export default function ConceptsPage() {
  const { isCompleted, completed, isLoaded } = useProgress()
  const totalConcepts = masteryPath.reduce((acc, phase) => acc + phase.items.length, 0)
  const completionPercentage = isLoaded ? Math.round((completed.length / totalConcepts) * 100) : 0

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="py-24 border-b bg-muted/20 bg-grid-premium">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                The Mastery Path
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                Learn Next.js <br /> <span className="text-primary">Step by Step.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Follow our structured roadmap to go from a beginner to a Next.js architect. 
                {totalConcepts} professional concepts, organized by complexity.
              </p>
            </div>

            {/* Mastery Score Card */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Target className="h-40 w-40" />
               </div>
               <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                  <div className="relative h-32 w-32 flex-shrink-0">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle className="text-muted/20 stroke-current" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                      <circle 
                        className="text-primary stroke-current transition-all duration-1000 ease-out" 
                        strokeWidth="10" 
                        strokeDasharray={251.2}
                        strokeDashoffset={251.2 - (251.2 * completionPercentage) / 100}
                        strokeLinecap="round" 
                        fill="transparent" 
                        r="40" cx="50" cy="50" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-black">{completionPercentage}%</span>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                     <h3 className="text-2xl font-bold mb-2">Your Mastery Progress</h3>
                     <p className="text-muted-foreground mb-6">You have mastered {completed.length} out of {totalConcepts} essential concepts.</p>
                     <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        {masteryPath.map(phase => {
                          const phaseCompleted = phase.items.filter(i => isCompleted(i.slug)).length
                          const total = phase.items.length
                          return (
                            <div key={phase.number} className="px-4 py-2 rounded-2xl bg-muted/50 border border-border text-xs font-bold flex items-center gap-2">
                              <div className={cn("h-2 w-2 rounded-full", phase.color)} />
                              Phase {phase.number}: {phaseCompleted}/{total}
                            </div>
                          )
                        })}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-20">
        <div className="max-w-5xl mx-auto">
          <div className="space-y-24">
            {masteryPath.map((phase, idx) => (
              <div key={phase.number} className="relative">
                {/* Vertical Line Connector */}
                {idx !== masteryPath.length - 1 && (
                  <div className="absolute left-[23px] top-[60px] bottom-[-60px] w-0.5 bg-linear-to-b from-border via-border to-transparent hidden md:block" />
                )}

                <div className="flex flex-col md:flex-row gap-10">
                  {/* Phase Marker */}
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-2xl ${phase.color} text-white flex items-center justify-center font-black text-xl shadow-lg shadow-${phase.color.split('-')[1]}-500/20`}>
                      {phase.number}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold tracking-tight mb-3">{phase.title}</h2>
                      <p className="text-muted-foreground leading-relaxed">{phase.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {phase.items.map((item) => {
                        const done = isCompleted(item.slug)
                        return (
                          <Link
                            key={item.slug}
                            href={`/nextjscosmos/concepts/${item.slug}`}
                            className={cn(
                              "group flex items-center justify-between p-5 rounded-2xl transition-all border",
                              done 
                                ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10" 
                                : "bg-muted/30 border-border hover:border-primary/30 hover:bg-background"
                            )}
                          >
                            <div className="flex items-center gap-4">
                               <CheckCircle2 className={cn(
                                 "h-5 w-5 transition-colors",
                                 done ? "text-emerald-500" : "text-muted-foreground group-hover:text-primary"
                               )} />
                               <span className={cn(
                                 "font-semibold transition-colors",
                                 done ? "text-emerald-900/80 dark:text-emerald-400" : "text-muted-foreground group-hover:text-foreground"
                               )}>
                                 {item.name}
                               </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Final Milestone */}
            <div className="pt-10 flex flex-col items-center text-center">
               <div className={cn(
                 "h-20 w-20 rounded-full flex items-center justify-center shadow-2xl mb-8 transition-all duration-1000",
                 completionPercentage === 100 ? "bg-linear-to-br from-amber-400 to-orange-600 scale-110" : "bg-muted"
               )}>
                  <Trophy className={cn("h-10 w-10", completionPercentage === 100 ? "text-white" : "text-muted-foreground/30")} />
               </div>
               <h3 className="text-2xl font-bold mb-2">
                 {completionPercentage === 100 ? "Architect Status Reached!" : "Keep Pushing"}
               </h3>
               <p className="text-muted-foreground">
                 {completionPercentage === 100 
                   ? "You have mastered the modern web engine." 
                   : `You've completed ${completed.length} concepts. Master them all to reach Architect status.`}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}