import { PlaygroundLab } from "@/components/visualizers/nextjscosmos/components/playground-lab";
import { RscFlightInspector } from "@/components/visualizers/nextjscosmos/components/RscFlightInspector";
import { NextCacheMatrix } from "@/components/visualizers/nextjscosmos/components/NextCacheMatrix";

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="py-24 border-b bg-zinc-950 text-white bg-grid-premium overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-zinc-950/50" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-6">
              Experimental Environment
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
              The Next.js <span className="text-primary">Behavior Lab.</span>
            </h1>
            <p className="text-base sm:text-xl text-zinc-400 leading-relaxed">
              Interact with live Next.js 15 architectures: inspect React Server Component flight streams, the 4-layer caching matrix, and component rendering lifecycles in real-time.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container-custom py-12 -mt-20 relative z-20 space-y-12">
        {/* Feature 1: RSC Flight Stream Inspector */}
        <RscFlightInspector />

        {/* Feature 2: 4-Layer Caching Architecture Matrix */}
        <NextCacheMatrix />

        {/* Feature 3: Interactive Rendering Lifecycle Lab */}
        <div className="glass rounded-[2.5rem] p-2 border-white/10 shadow-2xl overflow-hidden">
          <div className="bg-background rounded-[2.3rem] overflow-hidden border border-border">
            <PlaygroundLab />
          </div>
        </div>
      </div>
    </div>
  );
}