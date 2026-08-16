import { cn } from "../../lib/utils"

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export const CodeBlock = ({ children, className, label }: CodeBlockProps) => {
  return (
    <div className={cn("relative rounded-lg bg-secondary/50 font-mono text-xs md:text-sm my-4 border border-border overflow-hidden", className)}>
        {label && (
            <div className="bg-muted px-4 py-1 text-xs text-muted-foreground border-b border-border">
                {label}
            </div>
        )}
      <div className="p-4 overflow-x-auto">
        {children}
      </div>
    </div>
  )
}
