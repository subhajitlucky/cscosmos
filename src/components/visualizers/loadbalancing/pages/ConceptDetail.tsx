import React, { useMemo } from 'react';
import { useParams, Navigate, Link } from '@/components/visualizers/shared/RouterShim';
import { Layout } from '../components/Layout';
import { concepts } from '../data/concepts';
import { TrafficVisualizer } from '../components/visualizers/TrafficVisualizer';
import { useSimulation } from '../engine/useSimulation';
import { useStore } from '../store/useStore';
import { ChevronLeft, Info, ArrowRight, Clock, CheckCircle2, ChevronRight, Home, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LBAlgorithm, SimulationMode } from '../engine/types';

const ConceptDetail = () => {
  useSimulation();
  const { slug } = useParams();
  const setAlgorithm = useStore((state: any) => state.setAlgorithm);
  const setSimulationMode = useStore((state: any) => state.setSimulationMode);
  
  const conceptIndex = concepts.findIndex(c => c.slug === slug);
  const concept = concepts[conceptIndex];

  const nextConcept = concepts[conceptIndex + 1];
  const prevConcept = concepts[conceptIndex - 1];

  const readingTime = useMemo(() => {
    if (!concept) return 0;
    const words = (concept.content + concept.tradeoffs).split(' ').length;
    return Math.ceil(words / 200);
  }, [concept]);

  React.useEffect(() => {
    if (concept) {
        // Combined mapping logic
        const algoMap: Record<string, LBAlgorithm> = {
            'round-robin': 'round-robin',
            'weighted-round-robin': 'weighted-round-robin',
            'least-connections': 'least-connections',
            'least-response-time': 'least-response-time',
            'hash-based': 'ip-hash',
            'consistent-hashing': 'ip-hash' // Use hashing algo for consistent hashing too
        };

        const modeMap: Record<string, SimulationMode> = {
            'reverse-proxy': 'reverse-proxy',
            'client-vs-server-side': 'client-side',
            'layer-4': 'l4',
            'layer-7': 'l7',
            'consistent-hashing': 'consistent-hashing',
            'health-checks': 'health-checks',
            'backend-failures': 'health-checks',
            'circuit-breaker': 'circuit-breaker',
            'sticky-sessions': 'sticky-sessions',
            'session-affinity': 'sticky-sessions',
            'cdn-vs-lb': 'cdn',
            'autoscaling': 'autoscaling',
            'retries-timeouts': 'retries',
            'bottlenecks': 'bottleneck',
            'global-lb': 'global-lb',
            'anti-patterns': 'single-point-of-failure',
            'stateless-services': 'default', // Standard balancing
            'stateful-services': 'sticky-sessions' // Map to sticky logic
        };

        const algo = algoMap[concept.slug];
        if (algo) setAlgorithm(algo);
        
        setSimulationMode(modeMap[concept.slug] || 'default');
    }
    window.scrollTo(0, 0);
  }, [concept, setAlgorithm, setSimulationMode]);

  if (!concept) return <Navigate to="/concepts" />;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12 px-4 md:px-0">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-50 flex items-center gap-1">
                <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/concepts" className="hover:text-zinc-900 dark:hover:text-zinc-50">
                Knowledge Base
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-zinc-900 dark:text-zinc-50 truncate max-w-[150px] md:max-w-none">
                {concept.title}
            </span>
        </nav>

        <article className="space-y-10">
            <header className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        {concept.group}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                        <Clock className="h-3 w-3" />
                        {readingTime} min read
                    </div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.1] lg:max-w-4xl">
                    {concept.title}
                </h1>
                
                <div className="grid lg:grid-cols-3 gap-10 pt-2">
                    <div className="lg:col-span-2 space-y-6">
                        <p className="text-lg md:text-xl leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                            {concept.content}
                        </p>
                        
                        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-2xl space-y-3">
                            <h4 className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Key Takeaways
                            </h4>
                            <ul className="grid md:grid-cols-2 gap-3">
                                {[
                                    "Fundamental to system scalability",
                                    "Reduces single points of failure",
                                    "Optimizes resource utilization",
                                    "Enhances user experience latency"
                                ].map((item, i) => (
                                    <li key={i} className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
                                        <div className="mt-1.5 h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="p-6 bg-zinc-950 dark:bg-zinc-900 text-white rounded-2xl space-y-5 shadow-xl shadow-zinc-950/20 dark:shadow-none border border-transparent dark:border-zinc-800">
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    <h4 className="text-base font-bold tracking-tight">Trade-offs</h4>
                                </div>
                                <p className="text-xs text-white/80 leading-relaxed font-medium">
                                    {concept.tradeoffs}
                                </p>
                                <Link 
                                    to="/lab"
                                    className="flex items-center justify-center w-full py-2.5 bg-white text-zinc-950 rounded-lg font-bold text-[10px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    Try in Sandbox <ArrowRight className="h-3 w-3 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <h3 className="text-xl font-bold tracking-tight">Visual Simulation</h3>
                    <div className="hidden md:block text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Live_Model: {concept.slug}</div>
                </div>
                <div className="p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden ring-1 ring-zinc-100 dark:ring-zinc-900">
                    <TrafficVisualizer />
                </div>
                
                {/* Dynamic Simulation Insights */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={concept.slug}
                    className="p-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-4"
                >
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                        <Activity className="h-3 w-3" /> 
                        What to observe in this simulation
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Visual Behavior</h5>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                {concept.slug === 'client-vs-server-side' && "Notice the absence of a central load balancer. The 'Smart Client' itself holds the registry and directs traffic to specific nodes."}
                                {concept.slug === 'reverse-proxy' && "Observe the 'Proxy Gateway' boundary. Requests must clear SSL and Caching checks. Watch for red 'Blocked' dots—these represent invalid traffic or SSL handshake failures that are rejected before reaching your servers."}
                                {concept.slug === 'layer-4' && "Traffic is shown as simple square 'packets'. The balancer routes based on raw connection data (IP/Port) without inspecting content."}
                                {concept.slug === 'layer-7' && "Requests 'pulse' at the Load Balancer. This represents Deep Packet Inspection, where headers and cookies are analyzed for smart routing."}
                                {concept.slug === 'health-checks' && "Watch the emerald pulses traveling to nodes. These heartbeats monitor node availability to prevent routing to failed instances."}
                                {concept.slug === 'circuit-breaker' && "As errors accumulate, the Load Balancer changes color and 'opens' the circuit, instantly failing requests to protect the backend."}
                                {concept.slug === 'global-lb' && "Traffic is distributed across geographically separated regions (US-East vs EU-West) based on location-aware logic."}
                                {concept.slug === 'sticky-sessions' && "Specific client paths are highlighted in blue, demonstrating how a user is 'stuck' to a single server for session persistence."}
                                {concept.slug === 'cdn-vs-lb' && "Traffic hits local 'Edge Nodes' closer to the source, reducing the distance data must travel compared to an origin server."}
                                {concept.slug === 'autoscaling' && "Watch the fleet size change. New nodes are provisioned during high load and decommissioned when traffic subsides."}
                                {concept.slug === 'retries-timeouts' && "Requests that fail are automatically recirculated with a 'Retry' indicator and a visual glow, showing fault tolerance."}
                                {concept.group === 'Algorithms' && `Observe the ${concept.title} logic. The distribution follows a specific ${concept.slug.includes('robin') ? 'sequential' : 'calculated'} pattern across all healthy nodes.`}
                                {!['client-vs-server-side', 'reverse-proxy', 'layer-4', 'layer-7', 'health-checks', 'circuit-breaker', 'global-lb', 'sticky-sessions', 'cdn-vs-lb', 'autoscaling', 'retries-timeouts'].includes(concept.slug) && concept.group !== 'Algorithms' && "The simulation demonstrates standard traffic distribution across a healthy server fleet to ensure high availability."}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h5 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Technical Significance</h5>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                {concept.slug === 'layer-4' && "This operates at the Transport Layer (TCP). It is extremely fast and CPU-efficient but cannot perform URL-based routing."}
                                {concept.slug === 'layer-7' && "By operating at the Application Layer (HTTP), this allows for complex logic like A/B testing or microservice routing."}
                                {concept.slug === 'circuit-breaker' && "This pattern prevents 'cascading failures' by stopping requests before they can further overwhelm a struggling system."}
                                {concept.group === 'Algorithms' && "Choosing the right algorithm is a trade-off between distribution fairness, server capacity, and the overhead of state tracking."}
                                {concept.slug === 'health-checks' && "Without this mechanism, users would frequently hit 'dead' servers, resulting in 5xx errors and poor availability."}
                                {concept.slug === 'sticky-sessions' && "While necessary for stateful apps, session affinity can lead to 'hot spots' where one server is much busier than others."}
                                {concept.slug === 'global-lb' && "Essential for disaster recovery and reducing latency (Speed of Light) for a global user base."}
                                {concept.slug === 'reverse-proxy' && "This layer shields your fleet (Topology Hiding) and offloads CPU-intensive tasks like SSL/TLS handshakes, allowing backend instances to focus solely on business logic."}
                                {!['layer-4', 'layer-7', 'circuit-breaker', 'health-checks', 'sticky-sessions', 'global-lb', 'reverse-proxy'].includes(concept.slug) && concept.group !== 'Algorithms' && "Load balancing is the foundation of high-scale system design, transforming a collection of servers into a single resilient service."}
                            </p>
                        </div>
                    </div>
                </motion.div>
                
                <p className="text-center text-[10px] text-zinc-400 font-medium italic">
                    Figure 1.1: Real-time behavior analysis of {concept.title} under simulated traffic load.
                </p>
            </div>

            <footer className="pt-10 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4">
                {prevConcept && (
                    <Link 
                        to={`/concepts/${prevConcept.slug}`}
                        className="flex-1 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-all group"
                    >
                        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                            <ChevronLeft className="h-3 w-3" /> Previous Topic
                        </div>
                        <div className="text-base font-bold group-hover:translate-x-1 transition-transform">{prevConcept.title}</div>
                    </Link>
                )}
                {nextConcept && (
                    <Link 
                        to={`/concepts/${nextConcept.slug}`}
                        className="flex-1 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-all group text-right"
                    >
                        <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                            Next Topic <ChevronRight className="h-3 w-3" />
                        </div>
                        <div className="text-base font-bold group-hover:-translate-x-1 transition-transform">{nextConcept.title}</div>
                    </Link>
                )}
            </footer>
        </article>
      </div>
    </Layout>
  );
};

export default ConceptDetail;
