import { useState, useEffect } from "react"
import { CodeEditor } from "../components/editor/CodeEditor"
import { type EVMState } from "../sim/EVM"
import { StackViewer } from "../components/visualizer/StackViewer"
import { MemoryGrid } from "../components/visualizer/MemoryGrid"
import { StorageViewer } from "../components/visualizer/StorageViewer"
import { Play, RotateCcw, ChevronRight, ChevronLeft, Bug, Cpu, Zap, Info, Terminal } from "lucide-react"

// Extended state type that includes opcode info
interface ExecutionState extends EVMState {
    opcode?: string;
    gasUsed?: number;
    gasRemaining?: number;
}

export function Playground({ initialCode }: { initialCode?: string }) {
    const defaultCode = `// Simple Storage Example
pragma solidity ^0.8.0;

contract SimpleStore {
    uint256 value = 100;
    uint256 tax = 20;
    
    function getTotal() public view returns (uint256) {
        return value + tax;
    }
}
`
    const [code, setCode] = useState<string>(initialCode || defaultCode)
    const [steps, setSteps] = useState<ExecutionState[]>([])
    const [currentStep, setCurrentStep] = useState<number>(0)
    const [error, setError] = useState<string | null>(null)
    const [isRunning, setIsRunning] = useState(false)
    const [hasRun, setHasRun] = useState(false)

    // State for Worker
    const [worker, setWorker] = useState<Worker | null>(null);

    useEffect(() => {
        // Initialize Worker
        const myWorker = new Worker(new URL('../workers/simulation.worker.ts', import.meta.url), {
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
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handleStepBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleReset = () => {
        setCurrentStep(0)
        setSteps([])
        setHasRun(false)
        setError(null)
    }

    const activeState = steps[currentStep] || { stack: [], memory: [], storage: {}, pc: 0, logs: [], opcode: '', gasUsed: 0, gasRemaining: 0 }

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold uppercase tracking-wider">
                    <Terminal className="w-4 h-4 mr-2" /> EVM Playground
                </div>
                <span className="text-muted-foreground text-sm">Execute and visualize EVM bytecode in real-time</span>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                        <Play className="w-4 h-4 mr-2" /> {isRunning ? 'Running...' : 'Compile & Run'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset
                    </button>
                </div>

                <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded-lg">
                    <button
                        onClick={handleStepBack}
                        disabled={currentStep === 0 || steps.length === 0}
                        className="p-2 hover:bg-background rounded disabled:opacity-50 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="font-mono text-sm min-w-[4rem] text-center">
                        {steps.length > 0 ? `${currentStep + 1} / ${steps.length}` : '0 / 0'}
                    </span>
                    <button
                        onClick={handleStepForward}
                        disabled={currentStep === steps.length - 1 || steps.length === 0}
                        className="p-2 hover:bg-background rounded disabled:opacity-50 transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setCurrentStep(steps.length - 1)}
                        disabled={currentStep === steps.length - 1 || steps.length === 0}
                        className="p-2 hover:bg-background rounded disabled:opacity-50 transition-colors"
                        title="Jump to End"
                    >
                        <span className="text-xs font-bold">{'>>|'}</span>
                    </button>
                </div>
            </div>

            {/* Execution Info Bar */}
            {hasRun && steps.length > 0 && (
                <div className="flex items-center gap-6 px-4 py-3 bg-accent/30 border rounded-lg text-sm">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">Opcode:</span>
                        <code className="bg-primary/20 text-primary px-3 py-1 rounded font-bold">
                            {activeState.opcode || 'N/A'}
                        </code>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">PC:</span>
                        <code className="bg-muted px-3 py-1 rounded font-mono">{activeState.pc}</code>
                    </div>
                    {activeState.gasUsed !== undefined && (
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="text-muted-foreground">Gas Used:</span>
                            <code className="bg-muted px-3 py-1 rounded font-mono">{activeState.gasUsed}</code>
                        </div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
                {/* Editor Pane */}
                <div className="lg:col-span-5 flex flex-col min-h-0 border rounded-lg overflow-hidden">
                    <CodeEditor value={code} onChange={(val) => setCode(val || "")} />

                    {/* Info Banner */}
                    <div className="p-3 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs border-t flex items-center">
                        <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>Type Solidity code (v0.8.26) and click Compile & Run. Compiler loads on first use (~2MB).</span>
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 border-t border-destructive/20 text-destructive text-sm flex items-center">
                            <Bug className="w-4 h-4 mr-2" /> {error}
                        </div>
                    )}
                </div>

                {/* Visualizer Pane */}
                <div className="lg:col-span-7 grid grid-cols-2 gap-4 min-h-0 overflow-hidden">

                    {/* Column 1: Stack & Storage */}
                    <div className="flex flex-col gap-4 min-h-0">
                        <div className="flex-1 min-h-0 relative">
                            <StackViewer stack={activeState.stack} />
                        </div>
                        <div className="flex-1 min-h-0 relative">
                            <StorageViewer storage={activeState.storage} />
                        </div>
                    </div>

                    {/* Column 2: Memory & Console */}
                    <div className="flex flex-col gap-4 min-h-0 relative">
                        <div className="flex-1 min-h-0">
                            <MemoryGrid memory={activeState.memory} />
                        </div>

                        {/* Console Output */}
                        <div className="border rounded-md bg-card overflow-hidden">
                            <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                                <span className="font-semibold text-sm">Console Output</span>
                            </div>
                            <div className="p-3 font-mono text-xs bg-black/80 text-green-400 min-h-[100px] max-h-[150px] overflow-auto">
                                {!hasRun ? (
                                    <span className="text-gray-500">// Click "Compile & Run" to execute...</span>
                                ) : steps.length === 0 ? (
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Playground;
