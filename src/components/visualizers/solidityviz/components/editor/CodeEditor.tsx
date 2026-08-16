import Editor, { type OnMount } from "@monaco-editor/react"
import { useTheme } from "../../lib/theme"

type CodeEditorProps = {
    value: string
    onChange: (value: string | undefined) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
    const { theme } = useTheme()

    const handleEditorDidMount: OnMount = (_, monaco) => {
        // Define a basic Solidity theme if needed, or rely on vs-dark
        monaco.editor.defineTheme("solidity-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
                "editor.background": "#0f172a", // Match slate-900 or similar
            },
        })
    }

    return (
        <div className="h-full w-full rounded-md overflow-hidden border border-border">
            <Editor
                height="100%"
                defaultLanguage="solidity"
                defaultValue="// Write your Solidity code here..."
                value={value}
                onChange={onChange}
                theme={theme === "dark" || theme === "system" ? "vs-dark" : "light"}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    padding: { top: 16 },
                    scrollBeyondLastLine: false,
                    fontFamily: "JetBrains Mono, monospace",
                }}
                onMount={handleEditorDidMount}
            />
        </div>
    )
}
