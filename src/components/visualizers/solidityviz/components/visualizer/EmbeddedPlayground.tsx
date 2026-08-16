import { useState, useEffect } from "react"
import { CodeEditor } from "../editor/CodeEditor"
import { type EVMState } from "../../sim/EVM"
import { StackViewer } from "./StackViewer"
import { MemoryGrid } from "./MemoryGrid"
import { StorageViewer } from "./StorageViewer"
import { Play, RotateCcw, ChevronRight, ChevronLeft, Bug, Terminal, Cpu, Zap, Info } from "lucide-react"

// Extended state type that includes opcode info
interface ExecutionState extends EVMState {
    opcode?: string;
    gasUsed?: number;
    gasRemaining?: number;
}

interface EmbeddedPlaygroundProps {
    initialCode: string;
    mode?: "stack" | "memory" | "storage" | "gas" | "reentrancy" | "none";
}

export function EmbeddedPlayground({ initialCode, mode = "stack" }: EmbeddedPlaygroundProps) {
    const [code, setCode] = useState<string>(initialCode)
    const [steps, setSteps] = useState<ExecutionState[]>([])
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [hasRun, setHasRun] = useState(false)

    // State for Worker
    const [worker, setWorker] = useState<Worker | null>(null);

    useEffect(() => {
        // Initialize Worker
        const myWorker = new Worker(new URL('../../workers/simulation.worker.ts', import.meta.url), {
            type: 'module'
        });

        myWorker.onmessage = (e) => {
            const { type, payload } = e.data;
            if (type === 'SUCCESS') {
                setSteps(payload.steps);
                setCurrentStep(0);
                setError(null);
                setHasRun(true);
            } else if (type === 'ERROR') {
                setError(payload);
            }
            setIsRunning(false);
        };

        setWorker(myWorker);

        return () => {
            myWorker.terminate();
        };
    }, []);

    const handleRun = () => {
        if (!worker) return;

        setIsRunning(true);
        setError(null);
        setSteps([]);

        worker.postMessage({
            type: 'COMPILE_AND_RUN',
            payload: { code }
        });
    }

    const handleStepForward = () => {
        if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1)
    }

    const handleStepBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1)
    }

    const handleReset = () => {
        setCurrentStep(0)
        setSteps([])
        setHasRun(false)
        setError(null)
    }

    const activeState = steps[currentStep] || { stack: [], memory: [], storage: {}, pc: 0, logs: [], opcode: '', gasUsed: 0, gasRemaining: 0 }

    return (
        <div className="border rounded-xl bg-card shadow-sm overflow-hidden flex flex-col h-[700px]">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 bg-muted/40 border-b flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-md text-xs font-semibold uppercase tracking-wider">
                        <Terminal className="w-3 h-3 mr-2" /> Interactive Simulation
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-xs font-medium disabled:opacity-50"
                    >
                        <Play className="w-3 h-3 mr-1.5" /> {isRunning ? 'Running...' : 'Run'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center px-3 py-1.5 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors text-xs font-medium"
                    >
                        <RotateCcw className="w-3 h-3 mr-1.5" /> Reset
                    </button>

                    <div className="w-px h-4 bg-border mx-2" />

                    <div className="flex items-center gap-1 bg-background border rounded px-1">
                        <button onClick={handleStepBack} disabled={currentStep === 0 || steps.length === 0} className="p-1 hover:bg-accent rounded disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="font-mono text-xs w-12 text-center">
                            {steps.length > 0 ? `${currentStep + 1} / ${steps.length}` : '0 / 0'}
                        </span>
                        <button onClick={handleStepForward} disabled={currentStep === steps.length - 1 || steps.length === 0} className="p-1 hover:bg-accent rounded disabled:opacity-50">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => setCurrentStep(steps.length - 1)} disabled={currentStep === steps.length - 1 || steps.length === 0} className="p-1 hover:bg-accent rounded disabled:opacity-50" title="Jump to End">
                            <span className="text-xs font-bold">{'>>|'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Execution Info Bar - Shows current opcode and gas */}
            {hasRun && steps.length > 0 && (
                <div className="flex items-center gap-4 px-4 py-2 bg-accent/30 border-b text-xs">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Opcode:</span>
                        <code className="bg-primary/20 text-primary px-2 py-0.5 rounded font-bold">
                            {activeState.opcode || 'N/A'}
                        </code>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">PC:</span>
                        <code className="bg-muted px-2 py-0.5 rounded font-mono">{activeState.pc}</code>
                    </div>
                    {activeState.gasUsed !== undefined && (
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-muted-foreground">Gas Used:</span>
                            <code className="bg-muted px-2 py-0.5 rounded font-mono">{activeState.gasUsed}</code>
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
                {/* Editor Side */}
                <div className="flex flex-col border-r border-border min-h-0">
                    <CodeEditor value={code} onChange={(val) => setCode(val || "")} />

                    {/* Info Banner */}
                    <div className="p-2 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs border-t flex items-center">
                        <Info className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span>Type Solidity code (v0.8.26) and click Run. Compiler loads on first use (~2MB).</span>
                    </div>

                    {error && (
                        <div className="p-2 bg-destructive/10 text-destructive text-xs border-t border-destructive/20 flex items-center">
                            <Bug className="w-3 h-3 mr-1" /> {error}
                        </div>
                    )}
                </div>

                {/* Visualizer Side */}
                <div className="flex flex-col min-h-0 bg-muted/5 p-4 overflow-y-auto gap-4">
                    {/* Prompt to Run */}
                    {!hasRun && (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                            <div className="text-center">
                                <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p>Click <strong>Run</strong> to execute the simulation</p>
                                <p className="text-xs mt-1">Then use the step controls to navigate</p>
                            </div>
                        </div>
                    )}

                    {hasRun && (
                        <>
                            {/* Stack Viewer */}
                            <div className="min-h-[180px]">
                                <StackViewer stack={activeState.stack} />
                            </div>

                            {/* Memory Viewer */}
                            {(mode === 'memory' || mode === 'stack') && (
                                <div className="min-h-[180px]">
                                    <MemoryGrid memory={activeState.memory} />
                                </div>
                            )}

                            {/* Storage Viewer */}
                            {(mode === 'storage') && (
                                <div className="min-h-[180px]">
                                    <StorageViewer storage={activeState.storage} />
                                </div>
                            )}

                            {/* Output/Console Panel */}
                            <div className="border rounded-md bg-card overflow-hidden">
                                <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                                    <span className="font-semibold text-sm">Console Output</span>
                                </div>
                                <div className="p-3 font-mono text-xs bg-black/80 text-green-400 min-h-[80px]">
                                    {steps.length === 0 ? (
                                        <span className="text-gray-500">// Waiting for execution...</span>
                                    ) : (
                                        <>
                                            <div className="text-gray-500">// Execution complete - {steps.length} steps</div>
                                            <div className="mt-1">
                                                <span className="text-yellow-400">Step {currentStep + 1}:</span> {activeState.opcode || 'INIT'}
                                                {activeState.stack.length > 0 && (
                                                    <span className="text-cyan-400"> → Stack top: {activeState.stack[activeState.stack.length - 1]}</span>
                                                )}
                                            </div>
                                            {Object.keys(activeState.storage).length > 0 && (
                                                <div className="mt-1 text-purple-400">
                                                    Storage: {JSON.stringify(activeState.storage)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
