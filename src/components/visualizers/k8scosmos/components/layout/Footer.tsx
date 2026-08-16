import { Link } from '@/components/visualizers/shared/RouterShim';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold">Kubernetes Cosmos</span>
            <span className="mx-2">•</span>
            <span>An interactive learning experience</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/concepts"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Concepts
            </Link>
            <Link
              to="/lab"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Lab
            </Link>
          </div>

          <div className="text-xs text-muted-foreground">
            Built by <span className="font-medium">GLM 4.7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
