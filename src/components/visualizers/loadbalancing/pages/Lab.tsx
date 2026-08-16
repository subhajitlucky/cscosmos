import { useState } from 'react';
import { Layout } from '../components/Layout';
import { TrafficVisualizer } from '../components/visualizers/TrafficVisualizer';
import { useStore } from '../store/useStore';
import { useSimulation } from '../engine/useSimulation';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Activity,
  Cpu,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { LBAlgorithm, Node, SimulationMode } from '../engine/types';

const Lab = () => {
  useSimulation();
  const { 
    isPaused, 
    togglePause, 
    algorithm, 
    setAlgorithm, 
    mode,
    setSimulationMode,
    requestRate, 
    setRequestRate,
    nodes,
    updateNode,
    addNode,
    removeNode,
    clearRequests
  } = useStore();

  const [isAlgoOpen, setIsAlgoOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);

  const handleAddNode = () => {
    const id = `n${nodes.length + 1}`;
    addNode({
      id,
      name: `Instance ${String.fromCharCode(65 + nodes.length)}`,
      status: 'healthy',
      weight: 1,
      currentConnections: 0,
      totalRequestsProcessed: 0,
      errorRate: 0.05,
      baseLatency: 800 + Math.random() * 400,
    });
  };

  const algorithms: { id: LBAlgorithm; label: string; desc: string }[] = [
    { id: 'round-robin', label: 'Round Robin', desc: 'Cyclic distribution.' },
    { id: 'least-connections', label: 'Least Connections', desc: 'Active load based.' },
    { id: 'weighted-round-robin', label: 'Weighted RR', desc: 'Capacity weighted.' },
    { id: 'least-response-time', label: 'Least Response Time', desc: 'Latency optimized.' },
    { id: 'random', label: 'Random', desc: 'Uniform distribution.' },
    { id: 'ip-hash', label: 'IP Hash', desc: 'Session persistence.' },
  ];

  const modes: { id: SimulationMode; label: string }[] = [
    { id: 'default', label: 'Standard Topology' },
    { id: 'health-checks', label: 'Health Probing' },
    { id: 'circuit-breaker', label: 'Circuit Breaker' },
    { id: 'sticky-sessions', label: 'Sticky Sessions' },
    { id: 'autoscaling', label: 'Autoscaling' },
    { id: 'cdn', label: 'Edge/CDN' },
    { id: 'global-lb', label: 'Global Traffic' },
    { id: 'bottleneck', label: 'Stress/Bottleneck' },
    { id: 'retries', label: 'Retry Logic' },
    { id: 'client-side', label: 'Client-Side LB' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Interactive Lab</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Real-time control plane and traffic simulation environment.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearRequests} className="rounded-xl h-9 px-4 text-xs font-bold uppercase tracking-wider">
                    <RotateCcw className="h-3.5 w-3.5 mr-2" /> Reset
                </Button>
                <Button 
                    onClick={togglePause} 
                    variant={isPaused ? "default" : "secondary"}
                    size="sm"
                    className="rounded-xl h-9 px-6 text-xs font-bold uppercase tracking-wider min-w-[120px]"
                >
                    {isPaused ? <><Play className="h-3.5 w-3.5 mr-2" /> Resume</> : <><Pause className="h-3.5 w-3.5 mr-2" /> Pause</>}
                </Button>
            </div>
        </header>

        {/* Integrated Control Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm items-center">
            {/* Algorithm Select */}
            <div className="relative">
                <label className="absolute -top-2 left-3 px-1 bg-white dark:bg-zinc-900 text-[8px] font-bold uppercase tracking-widest text-zinc-400">Policy</label>
                <button 
                    onClick={() => {setIsAlgoOpen(!isAlgoOpen); setIsModeOpen(false);}}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    {algorithms.find(a => a.id === algorithm)?.label}
                    <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform", isAlgoOpen && "rotate-180")} />
                </button>
                {isAlgoOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 grid gap-1">
                        {algorithms.map(algo => (
                            <button
                                key={algo.id}
                                onClick={() => {setAlgorithm(algo.id); setIsAlgoOpen(false);}}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    algorithm === algo.id ? "bg-zinc-950 text-white dark:bg-zinc-800 dark:text-zinc-100 dark:ring-1 dark:ring-zinc-700" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                {algo.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Simulation Mode Select */}
            <div className="relative">
                <label className="absolute -top-2 left-3 px-1 bg-white dark:bg-zinc-900 text-[8px] font-bold uppercase tracking-widest text-zinc-400">Environment</label>
                <button 
                    onClick={() => {setIsModeOpen(!isModeOpen); setIsAlgoOpen(false);}}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                    {modes.find(m => m.id === mode)?.label}
                    <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform", isModeOpen && "rotate-180")} />
                </button>
                {isModeOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl z-50 grid grid-cols-2 gap-1 min-w-[300px]">
                        {modes.map(m => (
                            <button
                                key={m.id}
                                onClick={() => {setSimulationMode(m.id); setIsModeOpen(false);}}
                                className={cn(
                                    "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                                    mode === m.id ? "bg-zinc-950 text-white dark:bg-zinc-800 dark:text-zinc-100 dark:ring-1 dark:ring-zinc-700" : "hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                )}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Request Rate Slider */}
            <div className="md:col-span-2 flex items-center gap-4 px-4">
                <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-[8px] font-bold uppercase tracking-widest text-zinc-400">Ingress Rate</label>
                        <span className="font-mono text-[9px] font-bold">{requestRate} REQ/S</span>
                    </div>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="10" 
                        step="0.5"
                        value={requestRate}
                        onChange={(e) => setRequestRate(parseFloat(e.target.value))}
                        className="w-full accent-zinc-900 dark:accent-white h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer"
                    />
                </div>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12 space-y-8">
            <TrafficVisualizer />

            <div className="grid md:grid-cols-3 gap-8">
                <Card className="md:col-span-2 rounded-2xl border-zinc-200/50 dark:border-zinc-800/50 shadow-sm overflow-hidden">
                    <CardHeader className="bg-zinc-50/30 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-800/50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Cpu className="h-4 w-4 text-zinc-400" />
                                <CardTitle className="text-sm font-bold">Fleet Management</CardTitle>
                            </div>
                            <Button size="sm" variant="ghost" onClick={handleAddNode} disabled={nodes.length >= 6} className="h-7 px-3 font-bold text-[10px] uppercase tracking-wider">
                                <Plus className="h-3 w-3 mr-1.5" /> Add Instance
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0" style={{ overflowAnchor: 'none' }}>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="text-zinc-400 bg-zinc-50/10">
                                    <th className="text-left px-6 py-3 font-bold uppercase text-[9px] tracking-widest">Instance</th>
                                    <th className="text-left px-6 py-3 font-bold uppercase text-[9px] tracking-widest">Status</th>
                                    <th className="text-center px-6 py-3 font-bold uppercase text-[9px] tracking-widest">Load</th>
                                    <th className="text-right px-6 py-3 font-bold uppercase text-[9px] tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                {nodes.map((node: Node) => (
                                    <tr key={node.id} className="group transition-colors hover:bg-zinc-50/30 dark:hover:bg-zinc-800/10">
                                        <td className="px-6 py-4">
                                            <span className="font-bold">{node.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => updateNode(node.id, { status: node.status === 'healthy' ? 'unhealthy' : 'healthy' })}
                                                className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${
                                                    node.status === 'healthy' 
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                }`}
                                            >
                                                {node.status === 'healthy' ? 'Online' : 'Offline'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="font-mono font-bold text-zinc-500">{node.currentConnections}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-7 w-7 text-zinc-300 hover:text-red-500"
                                                onClick={() => removeNode(node.id)}
                                                disabled={nodes.length <= 1}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-zinc-950 dark:bg-zinc-900 text-white border-none dark:border dark:border-zinc-800 p-6 flex flex-col justify-center space-y-4 shadow-xl">
                    <div className="p-2 bg-white/10 rounded-lg w-fit">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-lg tracking-tight">System Status</h4>
                        <p className="text-[11px] opacity-60 leading-relaxed font-medium">
                            {algorithm === 'round-robin' && "Cyclic distribution across instances."}
                            {algorithm === 'least-connections' && "Minimizing active connection overhead."}
                            {algorithm === 'weighted-round-robin' && "Capacity-aware weighted distribution."}
                            {algorithm === 'least-response-time' && "Latency-optimized traffic routing."}
                            {algorithm === 'random' && "Unbiased stochastic load distribution."}
                            {algorithm === 'ip-hash' && "Session persistence via source hashing."}
                        </p>
                    </div>
                    <div className="pt-4 mt-auto border-t border-white/10">
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest opacity-40">
                            <span>Environment</span>
                            <span>{mode.replace(/-/g, ' ')}</span>
                        </div>
                    </div>
                </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Lab;