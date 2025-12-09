import type { Topic } from "../data/topics"
import { Lock } from "lucide-react"
import { Link } from "react-router-dom"

interface TopicCardProps {
    topic: Topic;
    onClick?: () => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
    const isLive = topic.status === 'active';
    const cardAriaLabel = `${topic.name}${isLive ? " (Live)" : " (Coming soon)"}`;

    const CardContent = (
        <div
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-white/70 dark:bg-white/5 p-5 card-hover backdrop-blur min-h-[180px]"
            role={onClick ? "button" : "article"}
            tabIndex={onClick ? 0 : -1}
            aria-label={cardAriaLabel}
            onKeyDown={(e) => {
                if (!onClick) return;
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex justify-between items-start mb-3">
                <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{topic.domain}</p>
                    <h4 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors pr-4 line-clamp-2 min-h-[48px]">
                    {topic.name}
                </h4>
                </div>
                {isLive ? (
                    <span className="pill-badge border border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-100">
                        Live
                    </span>
                ) : (
                    <span className="pill-badge border border-indigo-200 bg-indigo-100 text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-100">
                        Coming Soon
                    </span>
                )}
            </div>

            <p className="relative z-10 text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                {topic.shortDescription}
            </p>

            {!isLive && (
                <div className="absolute inset-0 bg-background/5 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="bg-background text-foreground px-4 py-2 rounded-full shadow-lg border border-border flex items-center text-sm font-medium">
                        <Lock className="w-3 h-3 mr-2" /> Coming Soon
                    </div>
                </div>
            )}
        </div>
    )

    if (onClick) {
        return (
            <div onClick={onClick} className="cursor-pointer">
                {CardContent}
            </div>
        )
    }

    if (topic.url) {
        return (
            <a
                href={topic.url}
                target="_blank"
                rel="noreferrer"
                className="block focus-ring rounded-2xl h-full"
                aria-label={cardAriaLabel}
            >
                {CardContent}
            </a>
        )
    }

    return (
        <Link to={`/${topic.domain}/${topic.slug}`} className="block focus-ring rounded-2xl h-full" aria-label={cardAriaLabel}>
            {CardContent}
        </Link>
    )
}
