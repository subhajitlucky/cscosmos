import { useParams, Link, Navigate } from '@/components/visualizers/shared/RouterShim';
import { topics } from '../lib/topics';
import { topicContent } from '../lib/topic-content';
import { Button } from '../components/ui/button';
import { ArrowLeft, ArrowRight, BookOpen, Layers, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const TopicPage = () => {
    const { topicId } = useParams();
    const topicIndex = topics.findIndex(t => t.id === topicId);
    
    if (topicIndex === -1 || !topicId) {
        return <Navigate to="/concepts" replace />;
    }

    const topicIdKey = topics[topicIndex].id;
    const contentData = topicContent[topicIdKey];
    
    if (!contentData) {
         return (
            <div className="min-h-screen flex items-center justify-center">
                 <h2 className="text-2xl font-bold">Content coming soon for {topics[topicIndex].title}</h2>
                 <Link to="/concepts"><Button className="mt-4">Back</Button></Link>
            </div>
         );
    }

    const { Visualizer, content, title, subtitle } = contentData;
    const nextTopic = topics[topicIndex + 1];
    const prevTopic = topics[topicIndex - 1];

    return (
        <div className="relative min-h-screen bg-background pb-20">
            {/* --- TOP TECHNICAL HEADER --- */}
            <div className="absolute top-0 left-0 right-0 h-[400px] bg-secondary/5 border-b border-border/50 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.05]" 
                     style={{ backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 container max-w-screen-xl mx-auto px-6 md:px-8 pt-12">
                {/* Top Navigation Bar */}
                <div className="flex justify-between items-center mb-16">
                    <Link to="/concepts">
                        <Button variant="ghost" className="group text-muted-foreground hover:text-primary transition-all px-0">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
                            <span className="text-[10px] font-black uppercase tracking-widest">Return to Path</span>
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4 bg-card/50 backdrop-blur-md border border-border/50 px-4 py-1.5 rounded-full shadow-sm">
                        <div className="flex items-center gap-2">
                            <Layers className="w-3 h-3 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Module</span>
                        </div>
                        <div className="h-3 w-px bg-border" />
                        <span className="text-[10px] font-black font-mono text-primary">{String(topicIndex + 1).padStart(2, '0')} / {topics.length}</span>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* Title Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 mb-16 text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/60 uppercase">
                            {title}
                        </h1>
                        <p className="text-xl md:text-2xl text-primary font-serif italic opacity-80">{subtitle}</p>
                    </motion.div>

                    {/* Simulation Wrapper */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card border-2 border-border/50 rounded-[2.5rem] p-4 md:p-10 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-6 left-6 flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
                            <Terminal className="w-3 h-3" /> Interactive Simulation Environment
                        </div>
                        <div className="min-h-[400px] flex flex-col justify-center mt-8">
                            <Visualizer />
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-20 prose prose-neutral dark:prose-invert max-w-none grid md:grid-cols-1 gap-12"
                    >
                        <div className="bg-secondary/5 border border-border/50 p-8 md:p-12 rounded-[2rem] shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-primary text-primary-foreground rounded-2xl">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tighter m-0">Technical Briefing</h2>
                            </div>
                            <div className="text-muted-foreground leading-relaxed text-lg font-medium tracking-tight">
                                {content}
                            </div>
                        </div>
                    </motion.div>

                    {/* Modular Footer Nav */}
                    <div className="mt-20 flex flex-col sm:flex-row justify-between items-center gap-6 pt-12 border-t border-border/50">
                        {prevTopic ? (
                            <Link to={`/concepts/${prevTopic.id}`} className="w-full sm:w-auto">
                                <Button variant="outline" className="h-16 px-8 rounded-2xl gap-4 group w-full justify-start border-2 hover:bg-secondary/50">
                                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Previous Module</span>
                                        <span className="text-sm font-black uppercase tracking-tighter">{prevTopic.title}</span>
                                    </div>
                                </Button>
                            </Link>
                        ) : <div />}

                        <Link to={nextTopic ? `/concepts/${nextTopic.id}` : "/playground"} className="w-full sm:w-auto">
                            <Button className="h-16 px-8 rounded-2xl gap-4 group w-full justify-between bg-primary shadow-xl shadow-primary/20">
                                <div className="flex flex-col items-start">
                                    <span className="text-[9px] font-black uppercase tracking-widest opacity-70">{nextTopic ? "Next Module" : "Mission Complete"}</span>
                                    <span className="text-sm font-black uppercase tracking-tighter">{nextTopic ? nextTopic.title : "Enter Playground"}</span>
                                </div>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TopicPage;
