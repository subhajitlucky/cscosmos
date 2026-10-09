'use client';

import type { Topic } from "../data/topics"
import type { Domain } from "../data/domains"
import { Lock } from "lucide-react"
import Link from "next/link"

interface TopicCardProps {
    topic: Topic;
    onClick?: () => void;
    /** Set when the card surfaces via an alias tag; names the topic's home domain. */
    alsoInDomain?: Domain;
}

export function TopicCard({ topic, onClick, alsoInDomain }: TopicCardProps) {
    const isLive = topic.status === 'active';
    const cardAriaLabel = `${topic.name}${isLive ? " (Live)" : " (Coming soon)"}`;
    const targetUrl = topic.url || `/${topic.domain}/${topic.slug}`;

    const CardContent = (
        <div
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors duration-200 hover:border-foreground/20 hover:shadow-md min-h-[180px]"
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
            <div className="relative z-10 flex justify-between items-start mb-3">
                <div>
                    <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">{topic.domain}</p>
                        {alsoInDomain && (
                            <span
                                className="inline-flex items-center rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-muted-foreground"
                                title={"Cross-listed from " + alsoInDomain.name}
                            >
                                Also in {alsoInDomain.name}
                            </span>
                        )}
                    </div>
                    <h4 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors pr-4 line-clamp-2 min-h-[48px]">
                        {topic.name}
                    </h4>
                </div>
                {isLive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-500 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                        LIVE
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-[11px] font-mono text-muted-foreground">
                        PLANNED
                    </span>
                )}
            </div>

            <p className="relative z-10 text-sm text-muted-foreground line-clamp-2 min-h-[40px] leading-relaxed">
                {topic.shortDescription}
            </p>

            {!isLive && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="bg-card text-foreground px-3.5 py-1.5 rounded-md border border-border shadow-sm flex items-center text-xs font-mono">
                        <Lock className="w-3 h-3 mr-1.5 text-muted-foreground" /> In Development
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

    if (targetUrl.startsWith('http')) {
        return (
            <a
                href={targetUrl}
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
        <Link href={targetUrl} className="block focus-ring rounded-2xl h-full" aria-label={cardAriaLabel}>
            {CardContent}
        </Link>
    )
}
