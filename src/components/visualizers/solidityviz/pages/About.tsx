import { Github, Twitter, Boxes } from "lucide-react"

export function About() {
    return (
        <div className="max-w-4xl mx-auto py-16 space-y-16">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    About Solidity Visualized
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                    A visual-first educational platform designed to demystify the Ethereum Virtual Machine (EVM) for developers.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">The Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Learning smart contract development is hard. Most resources rely on heavy text and abstract concepts.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        We believe that <strong>seeing is understanding</strong>. By visualizing stack operations, memory allocation, and storage packing in real-time, we bridge the gap between high-level Solidity code and low-level EVM execution.
                    </p>
                </div>
                <div className="bg-card border rounded-2xl p-8 shadow-glow transform rotate-1 hover:rotate-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                            <Boxes className="w-8 h-8" />
                        </div>
                        <div>
                            <div className="font-bold text-lg">Interactive Learning</div>
                            <div className="text-xs text-muted-foreground">Experiment. Fail. Learn.</div>
                        </div>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Real-time Stack Visualization</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            <span>Storage Slot Packing</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span>Gas Cost Analysis</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t pt-10 text-center space-y-8">
                <h3 className="text-lg font-semibold">Open Source</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    This project is open source and built for the community. Contributions are welcome!
                </p>
                <div className="flex justify-center gap-4">
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                        <Twitter className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default About;
