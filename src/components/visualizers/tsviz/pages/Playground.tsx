'use client';

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  exampleSnippets,
  checkTypeScriptSyntax,
  formatError,
  type CompilationResult,
  type ExampleKey,
} from "../lib/playground-utils";
import { Play, RotateCcw, ChevronDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Playground() {
  const [code, setCode] = useState(exampleSnippets.basic.code);
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedExample, setSelectedExample] = useState<ExampleKey>("basic");
  const editorRef = useRef<any>(null);
  const exampleEntries = Object.entries(exampleSnippets) as [ExampleKey, (typeof exampleSnippets)[ExampleKey]][];

  // Handle editor mount
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  // Compile and check code
  const handleRun = () => {
    setIsCompiling(true);
    setTimeout(async () => {
      const result = await checkTypeScriptSyntax(code);
      setCompilationResult(result);
      setIsCompiling(false);
    }, 300);
  };

  // Reset to example
  const handleReset = () => {
    const example = exampleSnippets[selectedExample];
    if (example) {
      setCode(example.code);
      setCompilationResult(null);
    }
  };

  // Load example snippet
  const loadExample = (key: ExampleKey) => {
    const example = exampleSnippets[key];
    if (example) {
      setCode(example.code);
      setSelectedExample(key);
      setCompilationResult(null);
    }
  };

  // Auto-compile on code change (debounced)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (code.trim()) {
        const result = await checkTypeScriptSyntax(code);
        setCompilationResult(result);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-7xl px-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-foreground">TypeScript Playground</h1>
          <p className="text-muted-foreground">
            Write, compile, and experiment with TypeScript code in real-time
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Examples <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {exampleEntries.map(([key, example]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => loadExample(key)}
                  className={cn(
                    selectedExample === key && "bg-accent font-semibold"
                  )}
                >
                  {example.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleRun} disabled={isCompiling} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Play className="mr-2 h-4 w-4" />
            {isCompiling ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <Card className="flex flex-col border border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold text-foreground">Editor</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="h-[600px] border-t border-border overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: "on",
                  formatOnPaste: true,
                  formatOnType: true,
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="space-y-6">
          {/* Compilation Status */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">Status</CardTitle>
                {compilationResult && (
                  <div className="flex items-center gap-2">
                    {compilationResult.success ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        compilationResult.success
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      {compilationResult.success ? "Success" : "Error"}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Errors */}
              {compilationResult && compilationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-red-500">
                    Errors ({compilationResult.errors.length})
                  </h3>
                  <div className="space-y-1">
                    {compilationResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-900"
                      >
                        {formatError(error)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {compilationResult && compilationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-yellow-500">
                    Warnings ({compilationResult.warnings.length})
                  </h3>
                  <div className="space-y-1">
                    {compilationResult.warnings.map((warning, index) => (
                      <div
                        key={index}
                        className="text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20 p-2 rounded border border-yellow-200 dark:border-yellow-900"
                      >
                        {formatError(warning)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {compilationResult &&
                compilationResult.success &&
                compilationResult.errors.length === 0 &&
                compilationResult.warnings.length === 0 && (
                  <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-900">
                    Code compiled successfully!
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-foreground">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/40 rounded-md p-4 min-h-[180px] max-h-[280px] overflow-auto border border-border">
                <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                  {compilationResult?.output || "No output yet. Click 'Run' to execute your code."}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-foreground">Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Code is automatically checked for syntax errors</li>
                <li>Use console.log() to see output</li>
                <li>Try different examples from the dropdown menu</li>
                <li>TypeScript types are enforced and checked</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Playground;
