import { Link } from '@/components/visualizers/shared/RouterShim';
import { topics } from '../lib/topics';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

export const ConceptPage = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* --- ELITE BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.1]" 
             style={{ backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 container max-w-screen-xl mx-auto px-6 md:px-8 py-20">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
            >
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">
                    The Learning Path
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-foreground">
                    Protocol <br />
                    <span className="text-primary italic font-serif pr-4">Fundamentals.</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium tracking-tight">
                    A comprehensive technical sequence designed to build your engineering intuition from the first hash to global consensus.
                </p>
            </motion.div>
        </div>

        {/* Timeline Path */}
        <div className="max-w-4xl mx-auto relative">
            {/* Central Animated Line */}
            <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-border md:-ml-[0.5px]" />

            <div className="space-y-24">
                {topics.map((topic, index) => (
                    <motion.div 
                        key={topic.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className={`relative flex flex-col md:flex-row gap-12 items-center ${
                            index % 2 === 0 ? 'md:flex-row-reverse' : ''
                        }`}
                    >
                        {/* Timeline Anchor */}
                        <div className="absolute left-0 md:left-1/2 md:-ml-6 w-12 h-12 rounded-2xl bg-background border-2 border-primary flex items-center justify-center z-20 shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            <span className="text-sm font-black font-mono">{String(index + 1).padStart(2, '0')}</span>
                        </div>

                        {/* Content Card */}
                        <Link to={`/concepts/${topic.id}`} className={`w-full md:w-1/2 pl-16 md:pl-0 ${
                            index % 2 === 0 ? 'md:pl-16' : 'md:pr-16'
                        }`}>
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="group"
                            >
                                <Card className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-2xl font-black uppercase tracking-tighter group-hover:text-primary transition-colors">
                                                {topic.title}
                                            </h3>
                                            <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                                            {topic.description}
                                        </p>
                                        
                                        {/* Technical Decoration */}
                                        <div className="mt-6 flex gap-2">
                                            <div className="h-1 w-12 bg-primary/20 rounded-full" />
                                            <div className="h-1 w-4 bg-primary/10 rounded-full" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Link>
                        
                        {/* Empty Space for the other side of the timeline */}
                        <div className="hidden md:block w-1/2" />
                    </motion.div>
                ))}
            </div>

            {/* Bottom CTA */}
            <div className="flex flex-col items-center mt-40 relative z-10 space-y-8">
                <div className="w-px h-24 bg-primary/40" />
                <Link to="/playground">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary text-primary-foreground px-12 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 flex items-center gap-4 tracking-widest uppercase"
                    >
                        Enter Terminal <Zap className="w-6 h-6 fill-current" />
                    </motion.div>
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptPage;
