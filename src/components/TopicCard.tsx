import type { Topic } from "../data/topics"
import { Lock } from "lucide-react"

interface TopicCardProps {
    topic: Topic;
    onClick?: () => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-card/50 p-5 hover:bg-card hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors pr-4">
                    {topic.name}
                </h4>
                {topic.status === 'coming-soon' && (
                    <span className="inline-flex items-center rounded-full border border-yellow-200 bg-yellow-100 px-2.5 py-0.5 text-xs font-semibold text-yellow-800 dark:border-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-500">
                        Coming Soon
                    </span>
                )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
                {topic.shortDescription}
            </p>

            {topic.status === 'coming-soon' && (
                <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="bg-background text-foreground px-4 py-2 rounded-full shadow-lg border border-border flex items-center text-sm font-medium">
                        <Lock className="w-3 h-3 mr-2" /> Coming Soon
                    </div>
                </div>
            )}
        </div>
    )
}
