import { Layout } from '../components/Layout';
import { TrafficVisualizer } from '../components/visualizers/TrafficVisualizer';
import { Button } from '../components/ui/button';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { ArrowRight, Globe, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSimulation } from '../engine/useSimulation';

const Home = () => {
  useSimulation();

  return (
    <Layout>
      <div className="relative isolate">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center space-y-10 pt-10 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open Source Traffic Engine
                </div>
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                    Routing Reimagined.
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    A high-fidelity simulator for distributed systems. Visualize traffic patterns, 
                    experiment with algorithms, and master the art of resilience engineering.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button size="lg" asChild className="rounded-full px-8 h-12 text-base font-semibold">
                        <Link to="/lab">Start Exploration <ArrowRight className="h-4 w-4 ml-2" /></Link>
                    </Button>
                    <Button size="lg" variant="ghost" asChild className="rounded-full px-8 h-12 text-base font-medium">
                        <Link to="/concepts">View Concepts</Link>
                    </Button>
                </div>
            </motion.div>
        </section>

        {/* Primary Visualizer Card */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="max-w-6xl mx-auto p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 dark:shadow-none mb-32"
        >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800/50 mb-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-3 w-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-3 w-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                    <div className="h-4 w-[1px] bg-zinc-100 dark:bg-zinc-800 mx-2" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Simulation_Active: True</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-400">v1.0.4-stable</div>
            </div>
            <TrafficVisualizer />
        </motion.div>

        {/* Feature Highlights */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16 py-20 border-t border-zinc-100 dark:border-zinc-900">
            <div className="space-y-4">
                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                    <Zap className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">Real-time Distribution</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    Observe how different algorithms behave under varying loads, 
                    visualizing exactly where every request is routed.
                </p>
            </div>
            <div className="space-y-4">
                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">Failure Resilience</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    Test your system's durability by simulating server crashes 
                    and observing automatic failover mechanisms.
                </p>
            </div>
            <div className="space-y-4">
                <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                    <Globe className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">Architectural Insight</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                    Gain a deep, intuitive understanding of L4 vs L7 switching 
                    and global traffic management patterns.
                </p>
            </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
