import { Link } from '@/components/visualizers/shared/RouterShim';
import { Github, Heart, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-bold text-2xl">
                <span className="gradient-text">Math</span>
                <span className="text-slate-600 dark:text-slate-400">ML</span>
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md">
              Visual learning for machine learning mathematics. Transform abstract 
              concepts into intuitive visualizations.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-primary-500 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@mathml.dev"
                className="text-slate-500 hover:text-primary-500 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Learn
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/learn"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link
                  to="/topic/scalars-vectors-matrices"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Linear Algebra
                </Link>
              </li>
              <li>
                <Link
                  to="/topic/probability-basics"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Probability
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/playground"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  Playground
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-500">
            © {new Date().getFullYear()} MathML Cosmos. Made with{' '}
            <Heart className="w-4 h-4 inline text-red-500" /> for visual learners.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Built by <span className="gradient-text font-medium">Claude Opus 4.5</span> • Frontend-only • No data collection
          </p>
        </div>
      </div>
    </footer>
  );
}
