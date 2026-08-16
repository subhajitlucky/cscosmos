export type EVMState = {
    stack: string[]
    memory: string[] // Bytes represented as hex strings
    storage: Record<string, string> // slot -> value
    pc: number // Program Counter
    logs: string[]
}

export type OpcodeExecution = {
    pc: number
    opcode: string
    name: string
    gasCost: number
    description: string
    stackChange?: { pop: number; push: number }
}

export class MockEVM {
    // private state: EVMState

    constructor() {
        /* this.state = {
            stack: [],
            memory: [],
            storage: {},
            pc: 0,
            logs: []
        } */
    }

    public reset() {
        /* this.state = {
            stack: [],
            memory: [],
            storage: {},
            pc: 0,
            logs: []
        } */
    }

    // Determine steps based on simple parsing of the code
    // This is a "fake" compilation for educational visualization
    public compileAndSimulate(code: string): EVMState[] {
        const steps: EVMState[] = []
        let currentStack: string[] = []
        const currentMemory: string[] = []
        let currentStorage: Record<string, string> = {}

        // Simple heuristic parser to generate visual steps
        const lines = code.split('\n')

        lines.forEach((line, index) => {
            const trimmed = line.trim()
            if (trimmed.startsWith('uint')) {
                // Visualize pushing to stack/memory
                const parts = trimmed.split('=')
                if (parts.length > 1) {
                    const rightSide = parts[1].replace(';', '').trim()

                    // Basic simulation for additions (e.g. value + tax)
                    if (rightSide.includes('+')) {
                        // This is a naive heuristic for demonstration
                        // It assumes previous variables might have been defined or just adds numbers
                        const [l, r] = rightSide.split('+').map(x => x.trim())
                        // Just mock the result for visualization purposes if we can't parse variables
                        // If both are numbers
                        if (!isNaN(Number(l)) && !isNaN(Number(r))) {
                            const sum = Number(l) + Number(r)
                            currentStack = [...currentStack, this.toHex(sum.toString())]
                        } else {
                            // Fallback for demo: assume value=100, tax=20 if variables match
                            let val = 0
                            if (l === 'value') val += 100
                            if (l === 'tax') val += 20
                            if (r === 'value') val += 100
                            if (r === 'tax') val += 20

                            if (val > 0) {
                                currentStack = [...currentStack, this.toHex(val.toString())]
                            } else {
                                // Just push a dummy value if parsing fails
                                currentStack = [...currentStack, this.toHex("0")]
                            }
                        }
                    } else {
                        const value = rightSide
                        // SIMULATION: PUSH value to Stack
                        currentStack = [...currentStack, this.toHex(value)]
                    }
                }
            } else if (trimmed.startsWith('storage')) {
                // Mock storage write
                // storage[0] = total; 
                if (trimmed.includes('=')) {
                    // Extract index
                    const match = trimmed.match(/storage\[(\d+)\]/)
                    if (match && match[1]) {
                        const index = match[1]
                        // Take the top of stack or just parsing the right side?
                        // For simplicity, let's take the last pushed stack value
                        const val = currentStack[currentStack.length - 1] || this.toHex("0");
                        currentStorage = { ...currentStorage, [index]: val }
                    }
                }
            }

            // Snapshot state after this line
            steps.push({
                stack: [...currentStack],
                memory: [...currentMemory],
                storage: { ...currentStorage },
                pc: index,
                logs: []
            })
        })

        return steps
    }

    private toHex(val: string): string {
        if (!isNaN(Number(val))) {
            return "0x" + Number(val).toString(16).padStart(64, '0')
        }
        return "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
}
