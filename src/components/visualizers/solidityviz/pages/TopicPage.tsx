import { useParams, Link } from '@/components/visualizers/shared/RouterShim'
import { topics } from "../data/topics"
import { ArrowLeft, CheckCircle2, Code2, Sparkles, BookOpen, Layers, Lightbulb, Database, Zap, Lock } from "lucide-react"
import { CodeEditor } from "../components/editor/CodeEditor"
import { getVisualizerForTopic } from "../components/visualizer/TopicVisualizerRegistry"

export function TopicPage() {
    const { topicId } = useParams()
    const topic = topics.find(t => t.id === topicId)

    if (!topic) return <div>Topic not found</div>

    // Dynamically get the visualizer component
    const VisualizerComponent = getVisualizerForTopic(topic.id)

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* 1. Hero / Definition */}
            <div className="relative border-b bg-muted/20">
                <div className="absolute inset-0 bg-grid-white/5 mask-image-linear-to-b" />
                <div className="container max-w-4xl mx-auto px-4 py-16 relative">
                    <Link to="/learn" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Curriculum
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="p-4 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 shadow-xl shadow-primary/5">
                            <topic.icon className="w-12 h-12" />
                        </div>
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                                    {topic.category.toUpperCase()}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">{topic.title}</h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {topic.definition}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container max-w-4xl mx-auto px-4 py-12 space-y-20">

                {/* 2. Syntax Breakdown */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <Code2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">Syntax Structure</h2>
                    </div>
                    <div className="grid md:grid-cols-5 gap-8">
                        <div className="md:col-span-3 border rounded-xl overflow-hidden shadow-sm bg-card">
                            <div className="bg-muted/50 px-4 py-2 border-b text-xs font-mono text-muted-foreground">Example.sol</div>
                            <div className="h-[300px]">
                                <CodeEditor value={topic.syntaxExample} onChange={() => { }} />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="font-semibold text-lg">Key Components</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                    Boilerplate structure required by the Solc compiler.
                                </li>
                                <li className="flex gap-3 text-sm text-muted-foreground">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                    Placement of state variables versus functions.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. Practical Example & Logic */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">Practical Implementation</h2>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {topic.practicalExample.description}
                    </p>
                    <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
                        <div className="bg-muted/50 px-4 py-2 border-b text-xs font-mono text-muted-foreground">Practical.sol</div>
                        <div className="h-[400px]">
                            <CodeEditor value={topic.practicalExample.code} onChange={() => { }} />
                        </div>
                    </div>
                </section>

                {/* 4. Concepts Deep Dive */}
                {topic.concepts && topic.concepts.length > 0 && (
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold">Core Concepts</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            {topic.concepts.map((concept, idx) => (
                                <div key={idx} className="p-5 border rounded-xl bg-card hover:bg-muted/20 transition-colors">
                                    <h4 className="font-mono text-sm font-bold text-primary mb-2">{concept.label}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {concept.explanation}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 5. Mastery: Mental Model & Internals */}
                {(topic.mentalModel || topic.underTheHood) && (
                    <section className="grid md:grid-cols-2 gap-8">
                        {topic.mentalModel && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Sparkles className="w-5 h-5" />
                                    <h3 className="font-semibold uppercase tracking-wider text-sm">Mental Model</h3>
                                </div>
                                <div className="p-6 bg-amber-500/5 border border-amber-500/30 rounded-xl">
                                    <h4 className="font-bold text-lg mb-2">{topic.mentalModel.title}</h4>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {topic.mentalModel.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {topic.underTheHood && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-primary">
                                    <Database className="w-5 h-5" />
                                    <h3 className="font-semibold uppercase tracking-wider text-sm">Under the Hood</h3>
                                </div>
                                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl space-y-4">
                                    <p className="text-slate-300 text-sm leading-relaxed">
                                        {topic.underTheHood.description}
                                    </p>
                                    {topic.underTheHood.opcodes && (
                                        <div className="flex flex-wrap gap-2">
                                            {topic.underTheHood.opcodes.map(op => (
                                                <span key={op} className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                                    {op}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* 6. Mastery: Gas & Security */}
                {(topic.gasAnalysis || topic.securityInsights) && (
                    <section className="grid md:grid-cols-2 gap-8">
                        {topic.gasAnalysis && (
                            <div className="border rounded-xl overflow-hidden">
                                <div className="bg-yellow-500/10 px-6 py-3 border-b border-yellow-500/10 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                                    <h3 className="font-bold text-sm text-yellow-700 dark:text-yellow-400">Gas Analysis</h3>
                                </div>
                                <div className="p-6 space-y-4 bg-yellow-500/5">
                                    <p className="text-sm text-muted-foreground">{topic.gasAnalysis.description}</p>
                                    <ul className="space-y-2">
                                        {topic.gasAnalysis.tips.map((tip, i) => (
                                            <li key={i} className="text-xs flex items-start gap-2 text-muted-foreground">
                                                <span className="text-yellow-500 mt-0.5">•</span> {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {topic.securityInsights && (
                            <div className="border rounded-xl overflow-hidden">
                                <div className="bg-red-500/10 px-6 py-3 border-b border-red-500/10 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-red-600 dark:text-red-500" />
                                    <h3 className="font-bold text-sm text-red-700 dark:text-red-400">Security Risks</h3>
                                </div>
                                <div className="p-6 space-y-4 bg-red-500/5">
                                    <p className="text-sm text-muted-foreground">{topic.securityInsights.description}</p>
                                    <ul className="space-y-2">
                                        {topic.securityInsights.risks.map((risk, i) => (
                                            <li key={i} className="text-xs flex items-start gap-2 text-muted-foreground">
                                                <span className="text-red-500 mt-0.5">!</span> {risk}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* 5. Real World Use Cases */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Layers className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold uppercase tracking-wider text-sm text-muted-foreground">Common Use Cases</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {topic.useCases.map((useCase, idx) => (
                            <div key={idx} className="flex p-4 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-colors items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                <span className="font-medium text-sm">{useCase}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. Interactive Visualization */}
                <section className="pt-8">
                    <div className="rounded-3xl p-1 bg-zinc-900 border border-amber-500/40 shadow-2xl">
                        <div className="bg-background rounded-[22px] overflow-hidden">
                            <div className="p-8 md:p-10 text-center border-b bg-muted/10">
                                <div className="inline-flex items-center justify-center p-3 rounded-full bg-purple-500/10 text-purple-500 mb-4">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold mb-3">Interactive Visualization</h2>
                                <p className="text-muted-foreground max-w-2xl mx-auto">
                                    See exactly how the EVM handles this code in memory, storage, and the stack.
                                </p>
                            </div>

                            <div className="p-4 bg-muted/20 min-h-[600px]">
                                <VisualizerComponent topicId={topic.id} />
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default TopicPage;
