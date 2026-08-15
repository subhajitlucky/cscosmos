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
    const [search, setSearch] = useState(initialConcept);
    const [difficulty, setDifficulty] = useState<ProblemDifficulty | "All">("All");
    const [conceptFilter, setConceptFilter] = useState(initialConcept);

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
        <div className="container mx-auto px-4 py-10 space-y-6 max-w-5xl">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">TypeScript Problems</h1>
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
                    className="md:w-80 h-10 rounded-md border bg-background px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
                                "h-10 px-3 rounded-md border text-sm transition",
                                difficulty === d
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-foreground/80 hover:border-primary/40"
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
                            className="h-9 px-2 rounded-md border text-xs bg-muted text-foreground/80 hover:border-primary/40"
                        >
                            Clear concept filter: {conceptFilter}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((p) => (
                    <Link key={p.id} href={`/tsviz/problems/${p.id}`} className="block">
                        <ProblemCard problem={p} />
                    </Link>
                ))}
                {filtered.length === 0 && (
                    <Card>
                        <CardContent className="p-6 text-muted-foreground">
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
        <Card className="h-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                    <Badge variant={badgeVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{problem.concept}</div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{problem.summary}</CardContent>
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
        <Suspense fallback={<div className="container py-10 text-muted-foreground">Loading...</div>}>
            <ProblemsContent />
        </Suspense>
    );
}

export default Problems;
