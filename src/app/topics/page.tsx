'use client';

import { useMemo, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { TopicCard } from "@/components/TopicCard";
import { topics } from "@/data/topics";
import { domains, type DomainKey } from "@/data/domains";
import type { TopicDifficulty } from "@/data/topic-meta";
import { Button } from "@/components/ui/button";

const allOption = "all" as const;
type DifficultyFilter = TopicDifficulty | typeof allOption;
type TimeFilter = "all" | "30" | "60" | "90";

export default function AllTopicsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDomain, setSelectedDomain] = useState<DomainKey | typeof allOption>(allOption);
    const [difficulty, setDifficulty] = useState<DifficultyFilter>(allOption);
    const [maxMinutes, setMaxMinutes] = useState<TimeFilter>("all");

    const filteredTopics = useMemo(() => {
        return topics.filter((topic) => {
            const matchesDomain =
                selectedDomain === allOption ||
                topic.domain === selectedDomain ||
                topic.crossListedDomains?.includes(selectedDomain);
            const matchesQuery =
                topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesDifficulty = difficulty === allOption || topic.difficulty === difficulty;
            const matchesTime = maxMinutes === "all" || topic.estimatedMinutes <= Number(maxMinutes);
            return matchesDomain && matchesQuery && matchesDifficulty && matchesTime;
        });
    }, [searchQuery, selectedDomain, difficulty, maxMinutes]);

    return (
        <div className="py-12">
            <div className="page-container space-y-10">
                <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.18em] text-primary/70">Explore</p>
                    <div className="flex flex-col gap-3">
                        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">All Topics</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Browse the full catalog of {topics.length} interactive modules. Filter by domain and search to
                            jump straight to what you need.
                        </p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                        <SearchBar
                            className="w-full md:w-2/3"
                            placeholder="Search by topic name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            aria-label="Search all topics"
                        />
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedDomain === allOption ? "primary" : "outline"}
                                size="sm"
                                onClick={() => setSelectedDomain(allOption)}
                            >
                                All
                            </Button>
                            {domains.map((domain) => (
                                <Button
                                    key={domain.domainKey}
                                    variant={selectedDomain === domain.domainKey ? "primary" : "ghost"}
                                    size="sm"
                                    onClick={() => setSelectedDomain(domain.domainKey)}
                                >
                                    {domain.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 border-t border-border/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                Difficulty
                            </span>
                            {([allOption, "beginner", "intermediate", "advanced"] as DifficultyFilter[]).map(
                                (value) => (
                                    <Button
                                        key={value}
                                        variant={difficulty === value ? "primary" : "ghost"}
                                        size="sm"
                                        onClick={() => setDifficulty(value)}
                                    >
                                        {value === allOption
                                            ? "All"
                                            : value.charAt(0).toUpperCase() + value.slice(1)}
                                    </Button>
                                )
                            )}
                        </div>

                        <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                            Max time
                            <select
                                value={maxMinutes}
                                onChange={(event) => setMaxMinutes(event.target.value as TimeFilter)}
                                className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:border-foreground/30 focus:outline-none"
                            >
                                <option value="all">Any</option>
                                <option value="30">30 min</option>
                                <option value="60">60 min</option>
                                <option value="90">90 min</option>
                            </select>
                        </label>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Showing {filteredTopics.length} of {topics.length} topics
                    </div>
                </div>

                {filteredTopics.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTopics.map((topic) => {
                            const matchedViaAlias =
                                selectedDomain !== allOption &&
                                topic.domain !== selectedDomain &&
                                Boolean(topic.crossListedDomains?.includes(selectedDomain));
                            return (
                                <TopicCard
                                    key={topic.catalogId}
                                    topic={topic}
                                    alsoInDomain={
                                        matchedViaAlias
                                            ? domains.find((d) => d.domainKey === topic.domain)
                                            : undefined
                                    }
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground">
                        No topics found. Try a different search or domain filter.
                    </div>
                )}
            </div>
        </div>
    );
}
