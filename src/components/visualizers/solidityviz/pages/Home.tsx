import { ArrowRight, Box, Cpu, ShieldCheck } from "lucide-react"
import { Link } from '@/components/visualizers/shared/RouterShim'

export function Home() {
    return (
        <div className="space-y-20 py-10">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-20 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />

                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Master Solidity <br />
                    <span className="text-amber-600 dark:text-amber-500">
                        Visually.
                    </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    The interactive playground to understand the Ethereum Virtual Machine. Watch the stack, memory, and storage update in real-time as you code.
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <Link to="/playground" className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-glow-sm">
                        Start Coding
                    </Link>
                    <Link to="/learn" className="px-8 py-3 rounded-md border bg-background hover:bg-muted font-medium transition-colors flex items-center gap-2 group">
                        Start Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Features Matrix */}
            <section className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={Cpu}
                    title="EVM Internals"
                    description="Step through bytecode execution. Visualize Stack, Memory, and the Program Counter in real-time."
                    color="text-blue-500"
                />
                <FeatureCard
                    icon={Box}
                    title="Storage Layout"
                    description="Understand how Solidity packs variables into 32-byte slots to optimize storage costs."
                    color="text-purple-500"
                />
                <FeatureCard
                    icon={ShieldCheck}
                    title="Security Labs"
                    description="Simulate common vulnerabilities like Reentrancy and Overflow to learn how to prevent them."
                    color="text-green-500"
                />
            </section>
        </div>
    )
}

function FeatureCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
    return (
        <div className="p-6 rounded-xl border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300 group">
            <div className={`w-12 h-12 rounded-lg bg-background border shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
                {description}
            </p>
        </div>
    )
}

export default Home;
