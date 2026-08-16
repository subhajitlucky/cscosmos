import { Zap } from "lucide-react"

// Mock data for demonstration
const SCENARIOS = {
    standard: {
        total: 21542,
        breakdown: [
            { name: "Base Fee", cost: 21000, width: "80%" },
            { name: "Execution", cost: 542, width: "20%" }
        ]
    },
    optimized: {
        total: 21230,
        breakdown: [
            { name: "Base Fee", cost: 21000, width: "85%" },
            { name: "Execution", cost: 230, width: "15%" }
        ]
    }
}

export function GasVisualizer() {
    return (
        <div className="grid md:grid-cols-2 gap-8">
            <GasCard title="Standard Loop" data={SCENARIOS.standard} />
            <GasCard title="Unchecked Loop (Optimized)" data={SCENARIOS.optimized} isOptimized />
        </div>
    )
}

function GasCard({ title, data, isOptimized = false }: { title: string, data: typeof SCENARIOS.standard, isOptimized?: boolean }) {
    return (
        <div className="border rounded-lg p-4 bg-background relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-sm">{title}</h4>
                <div className="flex items-center text-xs font-mono bg-muted px-2 py-1 rounded">
                    <Zap className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                    {data.total.toLocaleString()} gas
                </div>
            </div>

            <div className="h-6 w-full flex rounded overflow-hidden mb-2">
                {data.breakdown.map((item, i) => (
                    <div
                        key={i}
                        className={`h-full ${i === 0 ? 'bg-slate-300 dark:bg-slate-700' : (isOptimized ? 'bg-green-500' : 'bg-red-500')}`}
                        style={{ width: item.width }}
                        title={`${item.name}: ${item.cost}`}
                    />
                ))}
            </div>

            <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Tx Base Cost (21k)</span>
                <span>Opcode Execution</span>
            </div>

            {isOptimized && (
                <div className="absolute top-0 right-0 p-1 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase rounded-bl">
                    Saved {(SCENARIOS.standard.total - data.total).toLocaleString()} gas
                </div>
            )}
        </div>
    )
}
