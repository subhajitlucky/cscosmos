import * as React from "react"
import { cn } from "../../lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
    const variants = {
        primary: "bg-primary text-primary-foreground shadow-[0_12px_40px_-12px_rgba(101,84,255,0.45)] hover:bg-primary/90 hover:shadow-[0_18px_48px_-18px_rgba(101,84,255,0.55)]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-white/15 text-foreground hover:bg-white/5 hover:text-foreground",
        ghost: "hover:bg-white/5 hover:text-foreground/90",
    }

    const sizes = {
        sm: "h-9 px-3 rounded-full text-sm",
        md: "h-10 px-4 py-2 rounded-full",
        lg: "h-11 px-8 rounded-full text-lg",
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center font-medium ring-offset-background transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-ring",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    )
}
