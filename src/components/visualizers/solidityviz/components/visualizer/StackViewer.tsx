

type StackViewerProps = {
    stack: string[]
}

export function StackViewer({ stack }: StackViewerProps) {
    return (
        <div className="flex flex-col h-full border rounded-md overflow-hidden bg-card">
            <div className="bg-muted px-4 py-2 border-b flex items-center justify-between">
                <span className="font-semibold text-sm">Stack</span>
                <span className="text-xs text-muted-foreground">{stack.length} items</span>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-2">
                {stack.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm italic pt-10">
                        Stack is empty
                    </div>
                ) : (
                    stack.slice().reverse().map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 animate-in slide-in-from-left duration-300">
                            <span className="text-xs font-mono text-muted-foreground w-6">
                                {stack.length - 1 - index}:
                            </span>
                            <div className="flex-1 bg-evm-stack/10 border border-evm-stack/30 text-evm-stack font-mono text-xs p-2 rounded truncate" title={item}>
                                {item}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
