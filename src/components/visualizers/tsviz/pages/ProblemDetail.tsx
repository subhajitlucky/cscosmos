'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import { problems, type Problem } from "../data/problems";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { checkTypeScriptSyntax, formatError } from "../lib/playground-utils";
import { AlertCircle, ArrowLeft, Play, RotateCcw, Lightbulb, Eye } from "lucide-react";

const defaultTemplate = (title: string) => `// ${title}
// Write your solution below. Use console.log to see output.

`;

export function ProblemDetail({ problemId: propProblemId }: { problemId?: string }) {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug;
    const problemId = propProblemId || (Array.isArray(slug) && slug.length > 1 ? slug[1] : undefined);
    const problem = problems.find((p) => p.id === problemId);

    const [code, setCode] = useState(() => (problem ? problem.starterCode || defaultTemplate(problem.title) : ""));
    const [result, setResult] = useState<Awaited<ReturnType<typeof checkTypeScriptSyntax>> | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [showSolution, setShowSolution] = useState(false);

    useEffect(() => {
        if (problem) {
            setCode(problem.starterCode || defaultTemplate(problem.title));
            setResult(null);
        }
    }, [problem]);

    if (!problem) {
        return (
            <div className="container py-16 text-center space-y-4">
                <div className="flex justify-center">
                    <AlertCircle className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Problem not found</h1>
                <Button variant="link" onClick={() => router.push("/tsviz/problems")}>Back to Problems</Button>
            </div>
        );
    }

    const handleRun = async () => {
        setIsRunning(true);
        const res = await checkTypeScriptSyntax(code);
        setResult(res);
        setIsRunning(false);
    };

    const handleReset = () => {
        setCode(problem.starterCode || defaultTemplate(problem.title));
        setResult(null);
    };

    return (
        <div className="container py-8 max-w-6xl space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <Link href="/tsviz/problems">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Problems
                        </Button>
                    </Link>
                    <Badge variant={badgeVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                </div>
                <Badge variant="outline">{problem.concept}</Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-xl">{problem.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        <p className="leading-relaxed text-foreground">{problem.description || problem.summary}</p>
                        {problem.starterCode && (
                            <p className="text-xs text-muted-foreground/80">
                                Starter provided. Feel free to modify.
                            </p>
                        )}
                        {problem.expectedOutput && (
                            <div className="rounded-md border bg-muted/30 p-3">
                                <div className="text-xs uppercase text-muted-foreground mb-1">Expected output</div>
                                <pre className="text-sm font-mono whitespace-pre-wrap">{problem.expectedOutput}</pre>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {problem.hints && problem.hints.length > 0 && (
                                <Button size="sm" variant="secondary" className="gap-2" onClick={() => setShowHints((v) => !v)}>
                                    <Lightbulb className="h-4 w-4" />
                                    {showHints ? "Hide hints" : "Show hints"}
                                </Button>
                            )}
                            {problem.solution && (
                                <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowSolution((v) => !v)}>
                                    <Eye className="h-4 w-4" />
                                    {showSolution ? "Hide solution" : "Show solution"}
                                </Button>
                            )}
                        </div>
                        {showHints && problem.hints && (
                            <ul className="list-disc list-inside space-y-1 text-foreground">
                                {problem.hints.map((h, idx) => (
                                    <li key={idx}>{h}</li>
                                ))}
                            </ul>
                        )}
                        {showSolution && problem.solution && (
                            <div className="rounded-md border bg-muted/30 p-3">
                                <div className="text-xs uppercase text-muted-foreground mb-1">Solution</div>
                                <pre className="text-sm font-mono whitespace-pre-wrap">{problem.solution}</pre>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Solution</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleReset}>
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Reset
                            </Button>
                            <Button size="sm" onClick={handleRun} disabled={isRunning}>
                                <Play className="h-4 w-4 mr-1" />
                                {isRunning ? "Running..." : "Run"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Editor
                            height="320px"
                            defaultLanguage="typescript"
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                            }}
                        />
                        <OutputPanel result={result} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function OutputPanel({ result }: { result: Awaited<ReturnType<typeof checkTypeScriptSyntax>> | null }) {
    if (!result) {
        return (
            <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                Run your code to see output and diagnostics.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
                {result.success ? (
                    <span className="text-green-600 dark:text-green-400">Success</span>
                ) : (
                    <span className="text-red-600 dark:text-red-400">Errors</span>
                )}
            </div>

            {result.errors.length > 0 && (
                <div className="space-y-1">
                    {result.errors.map((err, idx) => (
                        <div key={idx} className="rounded border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 px-3 py-2 text-sm text-red-700 dark:text-red-300">
                            {formatError(err)}
                        </div>
                    ))}
                </div>
            )}

            {result.warnings.length > 0 && (
                <div className="space-y-1">
                    {result.warnings.map((warn, idx) => (
                        <div key={idx} className="rounded border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20 px-3 py-2 text-sm text-yellow-700 dark:text-yellow-300">
                            {formatError(warn)}
                        </div>
                    ))}
                </div>
            )}

            {result.output && (
                <div className="rounded border bg-muted/30 px-3 py-2 font-mono text-sm whitespace-pre-wrap">
                    {result.output.trim().length > 0 ? result.output : "No output (nothing was logged). Add console.log to view values."}
                </div>
            )}

            {!result.output && (
                <div className="rounded border bg-muted/30 px-3 py-2 font-mono text-sm whitespace-pre-wrap text-muted-foreground">
                    No output (nothing was logged). Add console.log to view values.
                </div>
            )}
        </div>
    );
}

function badgeVariant(difficulty: Problem["difficulty"]): "outline" | "secondary" | "default" {
    switch (difficulty) {
    case "Easy":
        return "outline";
    case "Medium":
        return "secondary";
    case "Hard":
        return "default";
    }
    return "outline";
}

export default ProblemDetail;
