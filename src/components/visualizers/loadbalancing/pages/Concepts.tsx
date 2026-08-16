import { useState, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { concepts } from '../data/concepts';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { ArrowRight, Book, Server, Shield, Activity, Zap, Layers, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Concepts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const groups = useMemo(() => Array.from(new Set(concepts.map(c => c.group))), []);

  const filteredConcepts = useMemo(() => {
    return concepts.filter(concept => {
      const matchesSearch = concept.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           concept.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = !selectedGroup || concept.group === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [searchQuery, selectedGroup]);

  const getIcon = (group: string) => {
    switch (group) {
        case 'Fundamentals': return <Shield className="h-5 w-5" />;
        case 'Algorithms': return <Zap className="h-5 w-5" />;
        case 'Health & Failures': return <Activity className="h-5 w-5" />;
        case 'Performance & Latency': return <Layers className="h-5 w-5" />;
        default: return <Server className="h-5 w-5" />;
    }
  };

  const activeGroups = Array.from(new Set(filteredConcepts.map(c => c.group)));

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-10 pb-16">
        <section className="space-y-6 pt-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-3 text-center md:text-left"
            >
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Knowledge Base</h1>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl font-medium leading-relaxed">
                    A comprehensive guide to modern traffic distribution, from fundamental 
                    networking to complex fault-tolerant architectures.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col md:flex-row gap-3 items-center bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input 
                        type="text"
                        placeholder="Search concepts..."
                        className="w-full bg-transparent pl-11 pr-4 py-2.5 outline-none text-sm font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
                <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden md:block" />
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar" style={{ overflowAnchor: 'none' }}>
                    <button
                        onClick={() => setSelectedGroup(null)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                            !selectedGroup 
                            ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-zinc-100 dark:ring-1 dark:ring-zinc-700' 
                            : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                    >
                        All Topics
                    </button>
                    {groups.map(group => (
                        <button
                            key={group}
                            onClick={() => setSelectedGroup(group)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                                selectedGroup === group
                                ? 'bg-zinc-950 text-white dark:bg-zinc-800 dark:text-zinc-100 dark:ring-1 dark:ring-zinc-700' 
                                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                            }`}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </motion.div>
        </section>

        <div className="space-y-12">
            {activeGroups.map((group) => (
                <motion.div 
                    key={group} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <div className="p-2 bg-zinc-950 dark:bg-zinc-900 text-white rounded-lg shadow-md border border-transparent dark:border-zinc-800">
                            {getIcon(group)}
                        </div>
                        <h2 className="text-xl font-bold tracking-tight uppercase tracking-[0.1em]">{group}</h2>
                        <span className="ml-auto text-[9px] font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                            {filteredConcepts.filter(c => c.group === group).length} Articles
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredConcepts.filter(c => c.group === group).map((concept) => (
                                <motion.div
                                    key={concept.slug}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Link to={`/concepts/${concept.slug}`} className="group block h-full">
                                        <Card className="h-full hover:border-zinc-950 dark:hover:border-white transition-all duration-300 rounded-2xl border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden shadow-sm hover:shadow-lg bg-white dark:bg-zinc-900/50">
                                            <CardHeader className="p-5">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                                                            <Book className="h-3 w-3" />
                                                            <span>Technical Brief</span>
                                                        </div>
                                                        <ArrowRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <CardTitle className="text-lg font-bold tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                                            {concept.title}
                                                        </CardTitle>
                                                        <CardDescription className="text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                                            {concept.content}
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </motion.div>
            ))}

            {filteredConcepts.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center space-y-4"
                >
                    <div className="inline-flex p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                        <Search className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="text-xl font-bold">No concepts found</h3>
                    <p className="text-zinc-500">Try adjusting your search or filters to find what you're looking for.</p>
                    <button 
                        onClick={() => {setSearchQuery(''); setSelectedGroup(null);}}
                        className="text-sm font-bold underline underline-offset-4"
                    >
                        Clear all filters
                    </button>
                </motion.div>
            )}
        </div>
      </div>
    </Layout>
  );
};

export default Concepts;
