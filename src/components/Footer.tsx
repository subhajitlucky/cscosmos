import { Code2, Github, Heart } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/30">
            <div className="container py-8 md:py-12 max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        <span className="font-semibold">CSCosmos</span>
                    </div>

                    <p className="text-sm text-muted-foreground flex items-center">
                        Built with <Heart className="mx-1 h-3 w-3 text-red-500 fill-red-500" /> for computer science thinkers.
                    </p>

                    <div className="flex items-center gap-4">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
