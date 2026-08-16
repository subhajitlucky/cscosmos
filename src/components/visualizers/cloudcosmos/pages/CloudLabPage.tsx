import { useEffect } from "react";
import { useSimulationStore } from '@/components/visualizers/cloudcosmos/store/useSimulationStore';
import { useInterval } from '@/components/visualizers/cloudcosmos/hooks/useInterval';
import { 
  Card, 
  CardContent, 
} from '@/components/visualizers/cloudcosmos/components/ui/card';
import { Slider } from '@/components/visualizers/cloudcosmos/components/ui/slider';
import { Switch } from '@/components/visualizers/cloudcosmos/components/ui/switch';
import { Button } from '@/components/visualizers/cloudcosmos/components/ui/button';
import { Label } from '@/components/visualizers/cloudcosmos/components/ui/label';
import { ScrollArea } from '@/components/visualizers/cloudcosmos/components/ui/scroll-area';
import { 
  RefreshCcw, 
  Plus, 
  Trash2, 
  Activity, 
  Users,
  Terminal,
  Settings2,
  Cpu,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Instance } from '@/components/visualizers/cloudcosmos/store/useSimulationStore';

export function CloudLabPage() {
  const { 
    instances, 
    trafficRate, 
    autoScalingEnabled, 
    metrics,
    activeAZs,
    logs,
    tick,
    setTrafficRate,
    toggleAutoScaling,
    addInstance,
    removeInstance,
    simulateFailure,
    toggleAZ,
    reset
  } = useSimulationStore();

  // Drive the simulation
  useInterval(() => {
    tick();
  }, 1000);

  // Auto-scaling side effect
  useEffect(() => {
    if (autoScalingEnabled && metrics.cpuUtilization > 70 && instances.length < 8) {
      addInstance();
    }
  }, [metrics.cpuUtilization, autoScalingEnabled, instances.length, addInstance]);

  return (
    <div className="w-full flex flex-col min-h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 pb-10">
      <div className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-10">
        
        {/* Left Control Panel */}
        <aside className="w-full lg:w-56 flex flex-col gap-6 shrink-0 order-2 lg:order-1">
          <div className="glass rounded-[2rem] border p-4 space-y-8 shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b">
              <Settings2 className="h-4 w-4 text-primary" />
              <h2 className="text-[11px] font-bold uppercase tracking-widest">Simulation</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <Label className="text-xs font-bold text-muted-foreground uppercase">Traffic Load</Label>
                   <span className="text-lg font-mono font-bold text-primary">{trafficRate} req/s</span>
                </div>
                <Slider 
                  value={[trafficRate]} 
                  min={0} 
                  max={100} 
                  step={1} 
                  className="py-4"
                  onValueChange={(val) => setTrafficRate(val[0])}
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                   <span>IDLE</span>
                   <span>STRESS_TEST</span>
                </div>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold">Auto Scaling</Label>
                  <p className="text-[10px] text-muted-foreground">Self-healing + Elasticity</p>
                </div>
                <Switch 
                  checked={autoScalingEnabled} 
                  onCheckedChange={toggleAutoScaling} 
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-dashed">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Infrastructure</Label>
                <div className="grid gap-2">
                  <Button 
                    onClick={() => addInstance()} 
                    className="w-full justify-start h-11 rounded-xl glass border-primary/20 hover:border-primary/40 text-xs" 
                    variant="outline"
                    disabled={instances.length >= 10}
                  >
                    <Plus className="mr-2 h-4 w-4 text-primary" /> Deploy New Instance
                  </Button>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {['us-east-1a', 'us-east-1b', 'us-east-1c'].map(az => (
                      <button
                        key={az}
                        onClick={() => toggleAZ(az)}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl text-[10px] font-bold border transition-all",
                          activeAZs.includes(az) 
                            ? "bg-primary/5 border-primary/10 text-primary" 
                            : "bg-destructive/10 border-destructive/20 text-destructive"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className={cn("h-1.5 w-1.5 rounded-full", activeAZs.includes(az) ? "bg-primary animate-pulse" : "bg-destructive")} />
                          {az.toUpperCase()}
                        </div>
                        <span className="opacity-60">{activeAZs.includes(az) ? "ONLINE" : "FAILURE"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={reset} variant="ghost" className="w-full h-11 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors">
                <RefreshCcw className="mr-2 h-3 w-3" /> Factory System Reset
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="flex-1 glass rounded-[2.5rem] border shadow-2xl relative overflow-hidden flex flex-col min-h-[500px] lg:min-h-0 order-1 lg:order-2">
          {/* Blueprint Grid Decor */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]"></div>
          
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 glass border-primary/20 rounded-full flex items-center gap-3 w-max max-w-[90%]">
             <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] shrink-0" />
             <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase truncate">Control Plane: Connected</span>
          </div>

          <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-12">
            {/* Load Balancer */}
            <motion.div 
              layout
              className="z-20 p-6 lg:p-8 glass border-2 border-primary/40 rounded-3xl shadow-2xl flex flex-col items-center gap-3 group relative mb-8"
            >
              <div className="absolute -inset-1 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl -z-10" />
              <Activity className="h-8 w-8 lg:h-10 lg:w-10 text-primary" />
              <div className="text-center">
                <div className="font-bold text-base lg:text-lg tracking-tight uppercase">Edge Balancer</div>
                <div className="text-[10px] font-mono text-primary/60 tracking-widest">ELB_V2_PROD</div>
              </div>
            </motion.div>

            {/* Traffic Visualization */}
            <div className="absolute inset-0 pointer-events-none z-10">
               <TrafficLines count={trafficRate} />
            </div>

            {/* Instance Space */}
            <div className="z-20 w-full mt-4 lg:mt-12 max-h-[60%] overflow-y-auto px-2">
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {instances.map((instance) => (
                    <motion.div
                      key={instance.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="w-full sm:w-[130px]"
                    >
                      <InstanceCard 
                        instance={instance} 
                        onKill={() => removeInstance(instance.id)}
                        onFail={() => simulateFailure(instance.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>

        {/* Right Status Panel */}
        <aside className="w-full lg:w-56 xl:w-64 flex flex-col gap-6 shrink-0 order-3">
           <div className="glass rounded-[2rem] border p-4 flex-none space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                 <Activity className="h-4 w-4" /> Telemetry
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
                <MetricItem 
                  label="Cluster Load" 
                  value={`${Math.round(metrics.cpuUtilization)}%`} 
                  status={metrics.cpuUtilization > 80 ? 'error' : metrics.cpuUtilization > 60 ? 'warning' : 'healthy'}
                  icon={<Cpu className="h-4 w-4" />}
                />
                <MetricItem 
                  label="Response Time" 
                  value={`${Math.round(metrics.latency)}ms`} 
                  status={metrics.latency > 100 ? 'error' : 'healthy'}
                  icon={<Terminal className="h-4 w-4" />}
                />
                <MetricItem 
                  label="Active Sessions" 
                  value={trafficRate * 10} 
                  status="healthy"
                  icon={<Users className="h-4 w-4" />}
                />
                {metrics.errorRate > 0 && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="col-span-2 lg:col-span-1 p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2"
                   >
                     <ShieldAlert className="h-4 w-4 text-destructive" />
                     <span className="text-[10px] font-bold text-destructive uppercase">High Error Rate: {metrics.errorRate.toFixed(1)}%</span>
                   </motion.div>
                )}
              </div>
           </div>

           <div className="glass rounded-[2rem] border p-6 flex-1 flex flex-col min-h-[300px] lg:min-h-0 overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Control Logs
              </h3>
              <ScrollArea className="flex-1 font-mono text-[9px] pr-3 h-[200px] lg:h-auto">
                 <div className="space-y-2">
                    {logs.map((log) => (
                      <div key={log.id} className={cn(
                        "flex gap-2 p-2 rounded-lg border leading-relaxed transition-colors",
                        log.type === 'error' ? 'bg-destructive/5 border-destructive/10 text-destructive' : 
                        log.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10 text-amber-500' :
                        log.type === 'success' ? 'bg-green-500/5 border-green-500/10 text-green-500' : 
                        'bg-slate-500/5 border-slate-500/10 text-slate-400'
                      )}>
                         <span className="opacity-40 shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                         <span>{log.message}</span>
                      </div>
                    ))}
                 </div>
              </ScrollArea>
           </div>
        </aside>
      </div>
    </div>
  );
}

function InstanceCard({ instance, onKill, onFail }: { instance: Instance, onKill: () => void, onFail: () => void }) {
  const isHealthy = instance.status === 'healthy';
  const isUnhealthy = instance.status === 'unhealthy';

  return (
    <Card className={cn(
      "group overflow-hidden transition-all border shadow-lg rounded-2xl",
      isHealthy ? "glass border-primary/20 hover:border-primary/40" : 
      isUnhealthy ? "bg-destructive/5 border-destructive/40 shadow-destructive/5" : "border-amber-500/40 bg-amber-500/5"
    )}>
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="text-[9px] font-mono font-bold opacity-40 uppercase">{instance.id}</div>
            <div className="flex items-center gap-1.5">
               <div className={cn("h-1.5 w-1.5 rounded-full", isHealthy ? "bg-primary shadow-[0_0_5px_rgba(59,130,246,0.5)]" : isUnhealthy ? "bg-destructive" : "bg-amber-500 animate-pulse")} />
               <span className="text-[10px] font-bold uppercase tracking-wider">{instance.az.split('-').pop()}</span>
            </div>
          </div>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={onFail} title="Inject Fault" className="p-1 hover:text-amber-500 transition-colors"><ShieldAlert className="h-3 w-3" /></button>
             <button onClick={onKill} title="Terminate" className="p-1 hover:text-red-500 transition-colors"><Trash2 className="h-3 w-3" /></button>
          </div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase">
             <span>CPU LOAD</span>
             <span className={cn(instance.load > 80 ? "text-destructive" : "text-primary")}>{Math.round(instance.load)}%</span>
          </div>
          <div className="h-1 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
             <motion.div 
               className={cn("h-full", instance.load > 80 ? "bg-destructive" : "bg-primary shadow-[0_0_8px_rgba(59,130,246,0.3)]")}
               initial={{ width: 0 }}
               animate={{ width: `${instance.load}%` }}
             />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricItem({ label, value, status, icon }: { label: string, value: string | number, status: 'healthy' | 'warning' | 'error', icon: React.ReactNode }) {
  const colorClass = status === 'error' ? 'text-destructive' : status === 'warning' ? 'text-amber-500' : 'text-primary';
  
  return (
    <div className="space-y-2 p-1">
      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className={cn("text-3xl font-extrabold tracking-tight font-mono", colorClass)}>
        {value}
      </div>
    </div>
  );
}

function TrafficLines({ count }: { count: number }) {
  const lines = Math.min(12, Math.ceil(count / 8));
  
  return (
    <svg className="w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.circle
          key={i}
          r="2"
          fill="url(#dotGradient)"
          initial={{ cy: 10, cx: 20 + i * 5, opacity: 0 }}
          animate={{ cy: 35, opacity: [0, 1, 0.5, 0] }}
          transition={{ 
            duration: 1.8, 
            repeat: Infinity, 
            delay: i * 0.25,
            ease: "linear"
          }}
        />
      ))}
      
       {Array.from({ length: lines }).map((_, i) => (
        <motion.circle
          key={`lb-${i}`}
          r="1.5"
          fill="url(#dotGradient)"
          initial={{ cy: 55, cx: 50, opacity: 0 }}
          animate={{ cy: 75, cx: 15 + i * 14, opacity: [0, 1, 0.5, 0] }}
          transition={{ 
            duration: 2.2, 
            repeat: Infinity, 
            delay: i * 0.15,
            ease: "linear"
          }}
        />
      ))}
    </svg>
  );
}
export default CloudLabPage;
