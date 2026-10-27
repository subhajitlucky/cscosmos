'use client';

import React, { useState } from 'react';
import { Check, Copy, Play, RotateCcw, Sparkles, Terminal } from 'lucide-react';

interface CodeSnippet {
  id: string;
  name: string;
  code: string;
  expectedOutput: string;
  memoryStats: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'concurrency',
    name: 'Goroutines & Channels',
    code: `package main

import (
    "fmt"
    "time"
)

func worker(id int, ch chan string) {
    time.Sleep(100 * time.Millisecond)
    ch <- fmt.Sprintf("Worker %d finished task", id)
}

func main() {
    ch := make(chan string, 3)
    
    for i := 1; i <= 3; i++ {
        go worker(i, ch)
    }

    for i := 1; i <= 3; i++ {
        msg := <-ch
        fmt.Println("Received:", msg)
    }
    fmt.Println("All concurrent workers completed successfully!")
}`,
    expectedOutput: `Received: Worker 1 finished task
Received: Worker 2 finished task
Received: Worker 3 finished task
All concurrent workers completed successfully!`,
    memoryStats: '3 goroutines, each starting on a ~2 KB stack, writing to a buffered channel with cap 3; the 100ms sleep is source code, not a measured wait.',
  },
  {
    id: 'slices',
    name: 'Slice Dynamic Growth',
    code: `package main

import "fmt"

func main() {
    var nums []int
    fmt.Printf("Initial: len=%d cap=%d\\n", len(nums), cap(nums))

    for i := 1; i <= 8; i++ {
        nums = append(nums, i*10)
        fmt.Printf("Append %d -> len=%d cap=%d | Backing Array: %v\\n", 
            i*10, len(nums), cap(nums), nums)
    }
}`,
    expectedOutput: `Initial: len=0 cap=0
Append 10 -> len=1 cap=1 | Backing Array: [10]
Append 20 -> len=2 cap=2 | Backing Array: [10 20]
Append 30 -> len=3 cap=4 | Backing Array: [10 20 30]
Append 40 -> len=4 cap=4 | Backing Array: [10 20 30 40]
Append 50 -> len=5 cap=8 | Backing Array: [10 20 30 40 50]
Append 60 -> len=6 cap=8 | Backing Array: [10 20 30 40 50 60]
Append 70 -> len=7 cap=8 | Backing Array: [10 20 30 40 50 60 70]
Append 80 -> len=8 cap=8 | Backing Array: [10 20 30 40 50 60 70 80]`,
    memoryStats: 'Appending 8 ints grows capacity 1 -> 2 -> 4 -> 8, i.e. four reallocations of the backing array.',
  },
  {
    id: 'pointers',
    name: 'Pointers & Mutation',
    code: `package main

import "fmt"

type ServerConfig struct {
    Port    int
    MaxConn int
}

func optimize(cfg *ServerConfig) {
    cfg.Port = 8080
    cfg.MaxConn = 5000
}

func main() {
    config := ServerConfig{Port: 3000, MaxConn: 100}
    fmt.Printf("Before: %+v\\n", config)

    optimize(&config) // Pass memory address
    fmt.Printf("After:  %+v (Mutated in place!)\\n", config)
}`,
    expectedOutput: `Before: {Port:3000 MaxConn:100}
After:  {Port:8080 MaxConn:5000} (Mutated in place!)`,
    memoryStats: 'One 16-byte struct mutated in place through a pointer; the caller observes both field updates.',
  },
  {
    id: 'polymorphism',
    name: 'Interface Polymorphism',
    code: `package main

import "fmt"

type Notifier interface {
    Notify(msg string)
}

type EmailSender struct{}
func (e EmailSender) Notify(msg string) {
    fmt.Println("[Email Sent]:", msg)
}

type SlackSender struct{}
func (s SlackSender) Notify(msg string) {
    fmt.Println("[Slack Alert]:", msg)
}

func broadcast(n Notifier, message string) {
    n.Notify(message)
}

func main() {
    broadcast(EmailSender{}, "Server CPU usage at 92%")
    broadcast(SlackSender{}, "Database failover complete")
}`,
    expectedOutput: `[Email Sent]: Server CPU usage at 92%
[Slack Alert]: Database failover complete`,
    memoryStats: 'Two interface values dispatched through the itab to EmailSender.Notify and SlackSender.Notify.',
  },
];

export function LiveGoRunner() {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(SNIPPETS[0]);
  const [code, setCode] = useState<string>(SNIPPETS[0].code);
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectSnippet = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setCode(snippet.code);
    setOutput(null);
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput(null);

    setTimeout(() => {
      setOutput(selectedSnippet.expectedOutput);
      setIsRunning(false);
    }, 450);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="surface rounded-3xl p-6 sm:p-8 border border-[var(--panel-border)] shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--panel-border)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Preset Walkthrough
          </div>
          <h2 className="text-2xl font-extrabold text-[var(--foreground)]">
            Go Code Walkthrough &amp; Preset Explorer
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)]">
            Edit the code, switch presets, and review the output each preset is expected to produce — nothing is compiled or run in the browser.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap gap-2">
          {SNIPPETS.map((snippet) => (
            <button
              key={snippet.id}
              onClick={() => handleSelectSnippet(snippet)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSnippet.id === snippet.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[var(--panel)] border border-[var(--panel-border)] text-[var(--foreground)] hover:border-blue-500'
              }`}
            >
              {snippet.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor & Console Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor Area */}
        <div className="rounded-2xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>main.go</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={copyCode}
                className="hover:text-white transition-colors p-1"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setCode(selectedSnippet.code)}
                className="hover:text-white transition-colors p-1"
                title="Reset code"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="w-full h-80 p-4 font-mono text-xs sm:text-sm bg-transparent text-blue-200 outline-none resize-none leading-relaxed"
          />

          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">Preset Output (no compiler)</span>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition shadow-md flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Loading Preset Output...' : 'Show Preset Output'}</span>
            </button>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div className="rounded-2xl border border-[var(--panel-border)] bg-slate-950 text-slate-100 overflow-hidden shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
              <span>Preset Output (stdout)</span>
            </span>
            <span className="text-slate-400 font-mono text-[11px]">Not executed</span>
          </div>

          <div className="p-4 h-80 overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed space-y-3">
            {isRunning ? (
              <div className="text-blue-400 flex items-center gap-2">
                <span className="animate-spin">⚙️</span> Loading the expected output for this preset...
              </div>
            ) : output ? (
              <pre className="text-emerald-300 whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-slate-500 italic">
                Click &ldquo;Show Preset Output&rdquo; or select a preset above to display its recorded walkthrough output.
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-900 border-t border-slate-800 text-xs font-mono text-slate-400">
            📊 <span className="text-slate-300">Preset notes (illustrative, not measured): {selectedSnippet.memoryStats}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
