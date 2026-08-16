import { useState } from "react"
import { ArrowDown, RefreshCw, ShieldAlert } from "lucide-react"
import { cn } from "../../lib/utils"

export function ReentrancySim() {
    const [step, setStep] = useState(0)
    const [balance, setBalance] = useState(10)
    const [attackerBalance, setAttackerBalance] = useState(0)

    // Steps in the reentrancy attack
    const steps = [
        {
            id: 'call',
            label: 'Attacker calls withdraw()',
            desc: 'The attacker initiates the withdrawal process.',
            action: () => { }
        },
        {
            id: 'check',
            label: 'Contract checks balance',
            desc: 'Balance is > 0. Check passes.',
            action: () => { }
        },
        {
            id: 'send',
            label: 'Contract sends ETH',
            desc: 'Contract sends 1 ETH to attacker. Control flow handover!',
            action: () => {
                setBalance(b => b - 1)
                setAttackerBalance(b => b + 1)
            }
        },
        {
            id: 'fallback',
            label: 'Attacker Fallback()',
            desc: 'Attacker receives ETH and immediately calls withdraw() again!',
            action: () => { },
            isReentrant: true
        },
        {
            id: 're-enter',
            label: 'Re-enter withdraw()',
            desc: 'Execution loops back to start. Balance was NOT updated yet!',
            action: () => { }
        },
        {
            id: 'drain',
            label: 'Drain Loop',
            desc: 'This loop continues until gas runs out or contract is empty.',
            action: () => {
                setBalance(0)
                setAttackerBalance(11) // All funds drained
            }
        },
    ]

    const handleNext = () => {
        if (step < steps.length - 1) {
            const nextStep = step + 1;
            setStep(nextStep)
            steps[nextStep].action?.();
        }
    }

    const handleReset = () => {
        setStep(0)
        setBalance(10)
        setAttackerBalance(0)
    }

    return (
        <div className="border rounded-lg p-6 space-y-8 bg-card">

            {/* Status Header */}
            <div className="flex justify-between items-center text-sm font-mono">
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span>Contract Balance: {balance} ETH</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <span>Attacker: {attackerBalance} ETH</span>
                </div>
            </div>

            {/* Visualization Diagram */}
            <div className="relative border-l-2 border-dashed ml-4 pl-8 space-y-6">
                {steps.map((s, idx) => (
                    <div
                        key={idx}
                        className={cn(
                            "relative transition-all duration-300 p-3 rounded border",
                            step === idx ? "bg-red-500/10 border-red-500 scale-105 shadow-glow" : "bg-muted/20 border-transparent opacity-50",
                            s.isReentrant ? "ml-8 border-l-4 border-l-red-500" : ""
                        )}
                    >
                        {/* Connecting Line Node */}
                        <div className={cn(
                            "absolute -left-[39px] w-4 h-4 rounded-full border-2 bg-background z-10",
                            step >= idx ? "border-red-500 bg-red-500" : "border-muted-foreground"
                        )} />

                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-sm">{s.label}</h4>
                            {step === idx && <ArrowDown className="w-4 h-4 animate-bounce text-red-500" />}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex gap-4">
                <button
                    onClick={handleNext}
                    disabled={step >= steps.length - 1}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded py-2 text-sm font-medium disabled:opacity-50"
                >
                    {step === steps.length - 1 ? 'Attack Complete' : 'Next Step'}
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 border rounded hover:bg-muted"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="text-[10px] text-center text-muted-foreground bg-yellow-500/10 p-2 rounded">
                Note: In a secure contract, balance is updated BEFORE sending ETH (Checks-Effects-Interactions).
            </div>
        </div>
    )
}
