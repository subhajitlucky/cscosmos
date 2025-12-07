import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

export function ComingSoon() {
    return (
        <div className="min-h-screen flex flex-col bg-background font-sans">
            <Navbar />
            <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                <div className="space-y-6 max-w-md">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Coming Soon</h1>
                    <p className="text-xl text-muted-foreground">
                        We are working hard to build this interactive experience. Stay tuned!
                    </p>
                    <div className="flex justify-center">
                        <Link to="/">
                            <Button variant="outline" className="gap-2">
                                <ArrowLeft className="h-4 w-4" /> Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
