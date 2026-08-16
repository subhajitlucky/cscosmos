import { useEffect } from "react";
import { useParams, Link, Navigate } from '@/components/visualizers/shared/RouterShim';
import { concepts } from '@/components/visualizers/cloudcosmos/data/concepts';
import { ArrowLeft, AlertCircle, Scale, Beaker, Info, CheckCircle2, Cloud } from "lucide-react";
import { Button } from '@/components/visualizers/cloudcosmos/components/ui/button';
import { HorizontalScalingVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/HorizontalScalingVisualizer';
import { RegionsAZsVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/RegionsAZsVisualizer';
import { LoadBalancerVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/LoadBalancerVisualizer';
import { VerticalScalingVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/VerticalScalingVisualizer';
import { CachingVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/CachingVisualizer';
import { StatelessStatefulVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/StatelessStatefulVisualizer';
import { QueuesMessagingVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/QueuesMessagingVisualizer';
import { DatabaseStorageVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/DatabaseStorageVisualizer';
import { CloudComputingVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/CloudComputingVisualizer';
import { NetworkingVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/NetworkingVisualizer';
import { AvailabilityVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/AvailabilityVisualizer';
import { PerformanceCostVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/PerformanceCostVisualizer';
import { SessionVisualizer } from '@/components/visualizers/cloudcosmos/components/visualizers/SessionVisualizer';

const visualizers: Record<string, React.ReactNode> = {
  'cloud-computing': <CloudComputingVisualizer />,
  'horizontal-scaling': <HorizontalScalingVisualizer />,
  'regions-azs': <RegionsAZsVisualizer />,
  'load-balancers': <LoadBalancerVisualizer />,
  'vertical-scaling': <VerticalScalingVisualizer />,
  'caching-layers': <CachingVisualizer />,
  'stateless-stateful': <StatelessStatefulVisualizer />,
  'queues-messaging': <QueuesMessagingVisualizer />,
  'event-driven': <QueuesMessagingVisualizer />,
  'databases-rds': <DatabaseStorageVisualizer mode="rds" />,
  'nosql-dynamodb': <DatabaseStorageVisualizer mode="nosql" />,
  's3-concept': <DatabaseStorageVisualizer mode="s3" />,
  'sharding': <DatabaseStorageVisualizer mode="rds" />,
  'asg-concept': <HorizontalScalingVisualizer />,
  'vpc-concepts': <NetworkingVisualizer mode="vpc" />,
  'subnets': <NetworkingVisualizer mode="subnet" />,
  'igw-vs-nat': <NetworkingVisualizer mode="gateway" />,
  'session-management': <SessionVisualizer />,
  'read-replicas': <DatabaseStorageVisualizer mode="rds" />,
  'async-processing': <QueuesMessagingVisualizer />,
  'health-checks': <LoadBalancerVisualizer />, // Reusing LB visualizer as it shows health checks
  'high-availability': <AvailabilityVisualizer mode="ha" />,
  'fault-tolerance': <AvailabilityVisualizer mode="ha" />,
  'disaster-recovery': <AvailabilityVisualizer mode="dr" />,
  'multi-az-arch': <AvailabilityVisualizer mode="ha" />,
  'multi-region-arch': <AvailabilityVisualizer mode="multi-region" />,
  'latency-consistency': <PerformanceCostVisualizer mode="latency-consistency" />,
  'cost-performance': <PerformanceCostVisualizer mode="cost-perf" />,
  'monolith-microservices': <HorizontalScalingVisualizer />, // Shows service decomposition concept
};

export function ConceptDetailPage() {
  const { id } = useParams();
  const concept = concepts.find(c => c.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!concept) {
    return <Navigate to="/concepts" replace />;
  }

  const Visualizer = id ? visualizers[id] : null;

  // Navigation logic
  const currentIndex = concepts.findIndex(c => c.id === id);
  const prevConcept = currentIndex > 0 ? concepts[currentIndex - 1] : null;
  const nextConcept = currentIndex < concepts.length - 1 ? concepts[currentIndex + 1] : null;

  return (
    <div className="container mx-auto max-w-7xl py-6 md:py-10 px-6">
      <Link 
        to="/concepts" 
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 md:mb-10"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Architecture Library
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 items-start">
        
        {/* Content Column */}
        <div className="space-y-8 md:space-y-12">
          <header className="space-y-4">
            <div className="text-xs font-bold text-primary uppercase tracking-widest">
              {concept.category}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              {concept.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {concept.shortDefinition}
            </p>
          </header>

          <div className="grid sm:grid-cols-2 gap-6">
             <div className="p-6 rounded-2xl border bg-card/30 space-y-4">
                <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                  <AlertCircle className="mr-2 h-4 w-4" /> Misconceptions
                </h4>
                <ul className="space-y-3">
                  {concept.misconceptions.map((m, i) => (
                    <li key={i} className="text-sm flex gap-3 text-muted-foreground">
                      <span className="text-amber-500 font-bold">•</span>
                      {m}
                    </li>
                  ))}
                </ul>
             </div>
             <div className="p-6 rounded-2xl border bg-card/30 space-y-4">
                <h4 className="flex items-center text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">
                  <Scale className="mr-2 h-4 w-4" /> Trade-offs
                </h4>
                <ul className="space-y-3">
                  {concept.tradeoffs.map((t, i) => (
                    <li key={i} className="text-sm flex gap-3 text-muted-foreground">
                      <span className="text-blue-500 font-bold">•</span>
                      {t}
                    </li>
                  ))}
                </ul>
             </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                 <Info className="h-4 w-4" />
               </div>
               <h3 className="text-xl font-bold tracking-tight">The Mental Model</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap border-l-2 border-primary/20 pl-6 py-2">
              {concept.content}
            </p>
          </div>
        </div>

        {/* Visualizer Sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-3xl border bg-card shadow-sm overflow-hidden flex flex-col min-h-[400px] lg:min-h-[500px]">
             <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <div className="h-2 w-2 rounded-full bg-primary" />
                   Interactive Simulation
                </div>
                <Beaker className="h-4 w-4 text-primary" />
             </div>

             <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 bg-muted/10 relative min-h-[300px]">
                <div className="absolute inset-0 opacity-[0.03] blueprint-grid pointer-events-none" />
                <div className="relative z-10 w-full flex justify-center">
                  {Visualizer ? (
                    Visualizer
                  ) : (
                    <div className="text-center space-y-4 opacity-40">
                      <Cloud className="h-12 w-12 mx-auto" />
                      <p className="text-sm font-medium">Visualization coming soon</p>
                    </div>
                  )}
                </div>
             </div>

             <div className="p-4 bg-primary/5 text-center">
                <p className="text-[10px] font-medium text-primary uppercase tracking-widest">
                  Architecture Primitives v1.0
                </p>
             </div>
          </div>
          
          <div className="mt-6 p-5 rounded-2xl bg-muted/30 border border-dashed flex items-start gap-3">
             <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
             <div className="space-y-1">
                <h5 className="text-xs font-bold uppercase">Architect's Tip</h5>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  When scaling for {concept.title.toLowerCase()}, always consider the impact on downstream dependencies like databases and message queues.
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation Section - Now below everything in the stack */}
      <div className="mt-12 pt-10 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="w-full sm:w-1/3 text-left">
              {prevConcept && (
                <Link 
                  to={`/concepts/${prevConcept.id}`}
                  className="group flex flex-col gap-1 items-start"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Previous Module</span>
                  <span className="text-sm font-bold leading-tight group-hover:underline">{prevConcept.title}</span>
                </Link>
              )}
            </div>

            <Button asChild size="lg" className="rounded-xl font-bold px-10 w-full sm:w-auto shadow-lg shadow-primary/10">
              <Link to="/lab">
                Enter Interactive Lab <Beaker className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <div className="w-full sm:w-1/3 text-right">
              {nextConcept && (
                <Link 
                  to={`/concepts/${nextConcept.id}`}
                  className="group flex flex-col gap-1 items-end"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Next Module</span>
                  <span className="text-sm font-bold leading-tight group-hover:underline">{nextConcept.title}</span>
                </Link>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
export default ConceptDetailPage;
