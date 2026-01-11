import { Code2, Github, Heart } from "lucide-react"
import { siteConfig } from "../config/site"

export function Footer() {
    return (
        <footer className="border-t border-border/60 bg-gradient-to-b from-background to-background/60">
            <div className="page-container py-8 md:py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        <span className="font-semibold">{siteConfig.name}</span>
                        <span className="hidden md:inline text-xs text-muted-foreground ml-2 border-l border-border/50 pl-2">
                            Understanding the Machine
                        </span>
                    </div>

                    <p className="text-sm text-muted-foreground flex items-center text-center md:text-left">
                        Built with <Heart className="mx-1 h-3 w-3 text-red-500 fill-red-500" /> for curious CS explorers.
                    </p>

                    <div className="flex items-center gap-4">
                        <a href={siteConfig.links.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
