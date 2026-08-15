'use client';

import React, { useMemo, useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { problems, type Problem, type ProblemDifficulty } from "../data/problems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const difficulties: ProblemDifficulty[] = ["Easy", "Medium", "Hard"];

function ProblemsContent() {
    const searchParams = useSearchParams();
    const initialConcept = searchParams?.get("concept") || "";
    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState<ProblemDifficulty | "All">("All");
    const [conceptFilter, setConceptFilter] = useState("");

    useEffect(() => {
        if (initialConcept) {
            setConceptFilter(initialConcept);
            setSearch(initialConcept);
        }
    }, [initialConcept]);

    const filtered = useMemo(() => {
        const term = search.toLowerCase().trim();
        const conceptTokens = conceptFilter
            .toLowerCase()
            .split(/\s+|&/)
            .map((t) => t.trim())
            .filter(Boolean);
        const hasConceptFilter = conceptTokens.length > 0;
        return problems.filter((p) => {
            const matchesDifficulty = difficulty === "All" || p.difficulty === difficulty;
            const matchesTerm =
                hasConceptFilter ||
                term.length === 0 ||
                p.title.toLowerCase().includes(term) ||
                p.concept.toLowerCase().includes(term) ||
                p.summary.toLowerCase().includes(term);
            const conceptLower = p.concept.toLowerCase();
            const matchesConcept =
                conceptTokens.length === 0 ||
                conceptTokens.some((token) => conceptLower.includes(token));
            return matchesDifficulty && matchesTerm && matchesConcept;
        });
    }, [search, difficulty, conceptFilter]);

    return (
        <div className="container mx-auto py-10 space-y-6 max-w-5xl px-4">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">TypeScript Problems</h1>
                <p className="text-muted-foreground">
                    50 practice tasks to master TypeScript. Filter by difficulty or search by concept.
                </p>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <input
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setSearch(e.target.value);
                    }}
                    placeholder="Search problems (title, concept)…"
                    className="md:w-80 h-10 rounded-md border border-border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center gap-2 flex-wrap">
                    {(["All", ...difficulties] as const).map((d) => (
                        <button
                            key={d}
                            type="button"
                            onClick={() => {
                                setDifficulty(d);
                            }}
                            className={cn(
                                "h-10 px-3.5 rounded-md border text-sm font-medium transition",
                                difficulty === d
                                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                    : "bg-background text-foreground hover:border-blue-500/40"
                            )}
                        >
                            {d}
                        </button>
                    ))}
                    {conceptFilter && (
                        <button
                            type="button"
                            onClick={() => {
                                setConceptFilter("");
                                setSearch("");
                            }}
                            className="h-9 px-2.5 rounded-md border text-xs bg-muted text-foreground hover:border-primary/40"
                        >
                            Clear filter: {conceptFilter} ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((p) => (
                    <Link key={p.id} href={`/tsviz/problems/${p.id}`} className="block group">
                        <ProblemCard problem={p} />
                    </Link>
                ))}
                {filtered.length === 0 && (
                    <Card className="col-span-2">
                        <CardContent className="p-8 text-center text-muted-foreground">
                            No problems found. Try clearing filters or searching a different term.
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

function ProblemCard({ problem }: { problem: Problem }) {
    return (
        <Card className="h-full border border-border transition-all hover:border-blue-500/50 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {problem.title}
                    </CardTitle>
                    <Badge variant={badgeVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                </div>
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{problem.concept}</div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground leading-relaxed">{problem.summary}</CardContent>
        </Card>
    );
}

function badgeVariant(difficulty: ProblemDifficulty): "outline" | "secondary" | "default" {
    switch (difficulty) {
    case "Easy":
        return "outline";
    case "Medium":
        return "secondary";
    case "Hard":
        return "default";
    }
}

export function Problems() {
    return (
        <Suspense fallback={<div className="container mx-auto py-10 text-muted-foreground text-center">Loading TypeScript problems...</div>}>
            <ProblemsContent />
        </Suspense>
    );
}

export default Problems;
