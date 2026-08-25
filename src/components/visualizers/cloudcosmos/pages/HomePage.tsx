import { motion } from "framer-motion";
import { Link } from '@/components/visualizers/shared/RouterShim';
import { ArrowRight, Zap, Shield, Terminal, Play, Boxes } from "lucide-react";
import { Button } from '@/components/visualizers/cloudcosmos/components/ui/button';

export function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-8 lg:py-16 xl:py-20 overflow-hidden">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center space-y-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border text-sm font-medium text-primary shadow-sm"
            >
              <Zap className="h-4 w-4 fill-primary" />
              <span>Interactive Cloud Simulator v1.0</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl"
            >
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]">
                <span className="inline-block">Visualize the <span className="text-primary italic">Invisible</span></span> Cloud Scale.
              </h1>
              <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl lg:text-2xl mt-8 leading-relaxed">
                Experience high-availability, traffic orchestration, and auto-scaling through an interactive, visual-first control plane.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button asChild size="lg" className="h-14 px-8 rounded-2xl text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95">
                <Link to="/lab">
                  Enter Cloud Lab <Play className="ml-2 h-5 w-5 fill-current" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-2xl text-lg font-semibold glass hover:bg-accent/50 transition-all active:scale-95">
                <Link to="/concepts">Explore Architecture</Link>
              </Button>
            </motion.div>

            {/* Visual Hero Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="w-full max-w-5xl mt-20 relative px-4"
            >
              <div className="aspect-[16/9] rounded-3xl glass border-2 border-primary/20 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-[#326CE5]/5 pointer-events-none" />
                <ArchitectureBackground />
                {/* Flat treatment: animation clips cleanly at the rounded container edge */}
                
                {/* Floating UI elements - removed hidden md:block to ensure visibility */}
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ 
                     opacity: [0, 1, 1, 0],
                     x: [-20, 0, 0, -20],
                     scale: [0.95, 1, 1, 0.95]
                   }}
                   transition={{ 
                     duration: 6, 
                     repeat: Infinity, 
                     times: [0, 0.1, 0.9, 1],
                     ease: "easeInOut" 
                   }}
                   className="absolute top-10 left-10 p-4 glass border-primary/30 shadow-2xl z-30"
                >
                   <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Traffic Stable</span>
                   </div>
                </motion.div>
                
                <motion.div 
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ 
                     opacity: [0, 1, 1, 0],
                     x: [20, 0, 0, 20],
                     scale: [0.95, 1, 1, 0.95]
                   }}
                   transition={{ 
                     duration: 8, 
                     delay: 2, // reduced delay
                     repeat: Infinity, 
                     times: [0, 0.1, 0.9, 1],
                     ease: "easeInOut" 
                   }}
                   className="absolute bottom-10 right-10 p-4 glass border-primary/30 shadow-2xl z-30"
                >
                   <div className="flex items-center gap-3">
                      <div className="p-1 rounded bg-primary/10">
                        <Terminal className="h-4 w-4 text-primary animate-pulse" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">ASG Scale-out Event...</span>
                   </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full py-24 bg-slate-50/50 dark:bg-slate-950/20 relative">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <FeatureCard 
              icon={<Boxes className="h-8 w-8 text-primary" />}
              title="Primitive-Based Learning"
              description="Master VPCs, Subnets, and Gateways by interacting with them visually, not just reading about them."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-yellow-500" />}
              title="Real-Time Feedback"
              description="Adjust traffic dials and see immediate impacts on latency and instance health within the lab."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-blue-500" />}
              title="Chaos Simulation"
              description="Inject faults into Availability Zones to understand how resilient architectures heal themselves."
              delay={0.3}
            />
          </div>
        </div>
      </section>
      
      {/* Paradigm Shift Section */}
      <section className="w-full py-32 border-y relative overflow-hidden">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
             <div className="flex-1 space-y-6 text-center lg:text-left">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl leading-tight">The Architecture <br /> Revolution.</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Moving from static hardware to dynamic, elastic services requires a mental model shift. CloudCosmos makes that shift visible.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                   <div className="flex items-center gap-3 text-sm font-medium">
                      <div className="h-10 w-10 rounded-full glass border flex items-center justify-center text-primary">01</div>
                      <span>Elastic Infrastructure</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm font-medium">
                      <div className="h-10 w-10 rounded-full glass border flex items-center justify-center text-primary">02</div>
                      <span>High Availability</span>
                   </div>
                </div>
             </div>
             
             <div className="flex-1 w-full max-w-md">
                <div className="space-y-4">
                  <ComparisonItem label="Provisioning Time" left="Weeks" right="Seconds" highlight />
                  <ComparisonItem label="Failure Handling" left="Manual" right="Automated" highlight />
                  <ComparisonItem label="Scaling" left="Vertical (Cap)" right="Horizontal (Elastic)" highlight />
                  <ComparisonItem label="Cost Model" left="Capex (Fixed)" right="Opex (Usage)" highlight />
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ComparisonItem({ label, left, right, highlight }: { label: string, left: string, right: string, highlight?: boolean }) {
  return (
    <div className="group p-4 rounded-2xl glass border hover:border-primary/40 transition-all">
       <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
       <div className="flex justify-between items-center font-semibold">
          <span className="text-muted-foreground opacity-50">{left}</span>
          <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
          <span className={highlight ? "text-primary font-bold" : ""}>{right}</span>
       </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="flex flex-col p-8 rounded-3xl glass border hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all group"
    >
      <div className="mb-6 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

function ArchitectureBackground() {
  return (
    <svg className="w-full h-full opacity-60 dark:opacity-50" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Central Hub */}
      <circle cx="400" cy="250" r="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="10 10" />
      <circle cx="400" cy="250" r="150" stroke="currentColor" strokeWidth="0.2" />
      
      {/* Service Nodes */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 400 + Math.cos(rad) * 120;
        const y = 250 + Math.sin(rad) * 120;
        return (
          <motion.g key={i}>
            <rect 
              x={x - 20} y={y - 20} width="40" height="40" rx="8" 
              className="fill-primary/5 stroke-primary/30" strokeWidth="1" 
            />
            <motion.circle 
              cx={x} cy={y} r="3" className="fill-primary"
              initial={{ cx: x, cy: y }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            />
            <line 
              x1="400" y1="250" x2={x} y2={y} 
              stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5"
              className="text-primary/20"
            />
          </motion.g>
        );
      })}
      
      {/* Flowing Traffic */}
      {[...Array(8)].map((_, i) => (
        <motion.circle
          key={`flow-${i}`}
          r="2"
          className="fill-primary"
          initial={{ opacity: 0, cx: 100 + i * 100, cy: 0 }}
          animate={{ 
            cx: [100 + i * 100, 400],
            cy: [0, 250],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </svg>
  );
}
export default HomePage;
