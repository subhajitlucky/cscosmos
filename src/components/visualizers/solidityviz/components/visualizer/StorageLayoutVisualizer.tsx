import { calculateLayout } from "../../sim/storageLayout"

// Educational mock data inputs
const SCENARIOS = {
    unpacked: [
        { name: "a", type: "uint128", value: "1" },
        { name: "c", type: "uint256", value: "3" }, // Forces new slot
        { name: "b", type: "uint128", value: "2" }, // New slot
    ],
    packed: [
        { name: "a", type: "uint128", value: "1" },
        { name: "b", type: "uint128", value: "2" }, // Packs with 'a'
        { name: "c", type: "uint256", value: "3" }, // New slot
    ]
}

type Props = {
    scenario: "packed" | "unpacked"
}

export function StorageLayoutVisualizer({ scenario }: Props) {
    const variables = SCENARIOS[scenario];
    const slots = calculateLayout(variables);

    return (
        <div className="space-y-4">
            <div className="grid gap-2">
                {slots.map((slot) => (
                    <div key={slot.id} className="flex items-center gap-4">
                        <span className="font-mono text-xs text-muted-foreground w-12 text-right">Slot {slot.id}</span>
                        <div className="flex-1 h-12 border rounded bg-muted/30 relative flex items-center pr-1 border-gray-500/20 overflow-hidden">
                            {/* Visualizing 32 bytes from right (byte 0) to left (byte 31) */}

                            {/* Filler for empty space */}
                            <div className="flex-1 flex items-center justify-center text-[10px] text-muted-foreground/30 italic">
                                {slot.remainingBytes > 0 && `${slot.remainingBytes} bytes free`}
                            </div>

                            {/* Packed Items */}
                            {slot.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    style={{ width: `${(item.bytes / 32) * 100}%` }}
                                    className={`${item.color} h-10 rounded-sm flex flex-col items-center justify-center text-[10px] text-white shadow-sm border border-white/10`}
                                    title={`${item.type} ${item.name}`}
                                >
                                    <span className="font-bold">{item.name}</span>
                                    <span className="opacity-80 scale-90">{item.bytes}B</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex bg-card p-3 rounded border justify-start gap-4 text-xs">
                <div className="font-semibold text-muted-foreground">Variables:</div>
                {variables.map((v, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded-full ${SCENARIOS.unpacked.find(x => x.name === v.name) ? calculateLayout(SCENARIOS.unpacked)[0]?.items[0]?.color /* Mock logic, color stability issue */ : ''} `}></div>
                        {/* Color matching is tricky here without centralized state, just listing them */}
                        <code className="bg-muted px-1 rounded">{v.type} {v.name}</code>
                    </div>
                ))}
            </div>
        </div>
    )
}
