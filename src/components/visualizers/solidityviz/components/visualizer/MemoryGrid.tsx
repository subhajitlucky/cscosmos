type MemoryGridProps = {
    memory: string[]
}

export function MemoryGrid({ memory }: MemoryGridProps) {
    return (
        <div className="flex flex-col h-full border rounded-md overflow-hidden bg-card">
            <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                <span className="font-semibold text-sm">Memory</span>
                <span className="text-xs text-muted-foreground">{memory.length * 32} bytes</span>
            </div>
            <div className="p-4 flex-1 overflow-auto">
                <div className="grid grid-cols-8 md:grid-cols-16 gap-1 font-mono text-[10px]">
                    {/* Mock visualization of empty memory if needed */}
                    {memory.length === 0 && (
                        <div className="col-span-full text-center text-muted-foreground text-sm italic pt-10">
                            Memory is empty
                        </div>
                    )}

                    {memory.map((word, wordIndex) => (
                        // A word is 32 bytes. For visual simplifiction we might just show the word blocks
                        // or break it down. Let's show words for now.
                        <div key={wordIndex} className="col-span-full mb-2">
                            <div className="text-xs text-muted-foreground mb-1">0x{(wordIndex * 32).toString(16).toUpperCase().padStart(4, '0')}</div>
                            <div className="break-all bg-evm-memory/10 border border-evm-memory/30 text-evm-memory p-2 rounded">
                                {word}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
