import { useState, useMemo } from "react";
import { Link } from '@/components/visualizers/shared/RouterShim';
import { concepts } from '@/components/visualizers/cloudcosmos/data/concepts';
import { 
  Cloud, 
  Cpu, 
  Network, 
  Database, 
  ShieldCheck, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Search,
  Box,
  Layers,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons: Record<string, React.ElementType> = {
  'Cloud Fundamentals': Cloud,
  'Compute & Scaling': Cpu,
  'Networking & Traffic': Network,
  'Storage & Databases': Database,
  'Reliability & Availability': ShieldCheck,
  'Performance & Cost': TrendingUp,
  'Failure & Recovery': Zap,
};

const categories = [
  'All Concepts',
  'Cloud Fundamentals',
  'Compute & Scaling',
  'Networking & Traffic',
  'Storage & Databases',
  'Reliability & Availability',
  'Performance & Cost',
  'Failure & Recovery'
];

export function ConceptMapPage() {
  const [activeCategory, setActiveCategory] = useState('All Concepts');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConcepts = useMemo(() => {
    return concepts.filter(concept => {
      const matchesCategory = activeCategory === 'All Concepts' || concept.category === activeCategory;
      const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            concept.shortDefinition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="container mx-auto max-w-7xl px-6">
      <div className="flex flex-col md:flex-row gap-10 py-10">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Categories</h2>
              <nav className="flex flex-col gap-1">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat] || Layers;
                  const count = cat === 'All Concepts' 
                    ? concepts.length 
                    : concepts.filter(c => c.category === cat).length;
                  
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                        activeCategory === cat 
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-4 w-4", activeCategory === cat ? "text-primary-foreground" : "text-primary")} />
                        {cat}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                        activeCategory === cat ? "bg-white/20" : "bg-muted text-muted-foreground group-hover:bg-accent"
                      )}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
               <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-2">
                 <Activity className="h-3 w-3" /> Learning Progress
               </h4>
               <p className="text-[10px] text-muted-foreground leading-relaxed">
                 Explore all {concepts.length} architectural primitives to master cloud system design.
               </p>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{activeCategory}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Displaying {filteredConcepts.length} architecture modules.
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <input 
                 type="text" 
                 placeholder="Search concepts..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 bg-muted/50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
               />
            </div>
          </div>

          <motion.div 
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredConcepts.map((concept) => (
                <motion.div
                  key={concept.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/concepts/${concept.id}`}
                    className="group flex flex-col h-full p-5 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-lg bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {(() => {
                          const Icon = categoryIcons[concept.category] || Box;
                          return <Icon className="h-5 w-5" />;
                        })()}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/60 px-2 py-0.5 rounded-full border border-border bg-muted/30">
                        {concept.category.split(' ')[0]}
                      </span>
                    </div>

                    <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
                      {concept.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {concept.shortDefinition}
                    </p>
                    
                    <div className="mt-auto pt-6 flex items-center gap-4">
                       <div className="flex -space-x-1">
                          {[1, 2].map(i => (
                            <div key={i} className="h-4 w-4 rounded-full border-2 border-background bg-muted text-[8px] flex items-center justify-center font-bold text-muted-foreground">
                               {i}
                            </div>
                          ))}
                       </div>
                       <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors">Learn Mental Model</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredConcepts.length === 0 && (
            <div className="py-20 text-center">
               <Box className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-muted-foreground">No concepts found</h3>
               <p className="text-sm text-muted-foreground/60">Try adjusting your search or category filter.</p>
               <button onClick={() => {setActiveCategory('All Concepts'); setSearchQuery('')}} className="mt-4 text-primary text-sm font-bold hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConceptMapPage;
