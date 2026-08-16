import { Link } from '@/components/visualizers/shared/RouterShim'
import { topics } from "../data/topics"
import { cn } from "../lib/utils"

export function Learn() {
    return (
        <div className="py-10 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Learning Path</h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Master Solidity from the ground up. Explore interactive modules designed to explain the EVM visually.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => {
                    const Icon = topic.icon
                    return (
                        <Link
                            key={topic.id}
                            to={`/learn/${topic.id}`}
                            className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-glow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2 rounded-md bg-primary/10 text-primary w-fit")}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                                    {topic.category}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                {topic.title}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-3">
                                {topic.shortDescription}
                            </p>

                            <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-10 rounded-lg transition-opacity" />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default Learn;
