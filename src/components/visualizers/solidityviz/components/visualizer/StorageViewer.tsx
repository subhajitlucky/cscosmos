import { Database } from "lucide-react"

type StorageViewerProps = {
    storage: Record<string, string>
}

export function StorageViewer({ storage }: StorageViewerProps) {
    const keys = Object.keys(storage)

    return (
        <div className="flex flex-col h-full border rounded-md overflow-hidden bg-card">
            <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                <span className="font-semibold text-sm flex items-center gap-2">
                    <Database className="w-3 h-3" /> Storage
                </span>
                <span className="text-xs text-muted-foreground">{keys.length} slots</span>
            </div>
            <div className="p-4 flex-1 overflow-auto space-y-2">
                {keys.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm italic pt-10">
                        Storage is empty
                    </div>
                ) : (
                    keys.map((slot) => (
                        <div key={slot} className="flex flex-col space-y-1 bg-card border rounded p-2">
                            <span className="text-xs text-muted-foreground font-mono">Slot: {slot}</span>
                            <div className="bg-evm-storage/10 border border-evm-storage/30 text-evm-storage font-mono text-xs p-2 rounded truncate">
                                {storage[slot]}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
