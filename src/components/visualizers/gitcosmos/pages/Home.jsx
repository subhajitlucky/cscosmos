import { Link } from '@/components/visualizers/shared/RouterShim'
import { ArrowRight, GitBranch, Database, Zap, Terminal, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

function Home() {
  return (
    <div className="space-y-24 pb-24">
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 pt-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl space-y-8"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Visual Git Learning
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Understand Git <br />
            <span className="text-[#F05033]">
              Beyond Commands
            </span>
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            See the commit graph evolve, watch pointers move, and build a perfect mental model of Git. Interactive, visual, and risk-free.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/playground"
              className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Terminal className="w-4 h-4" />
              Open Playground
            </Link>
            <Link
              to="/concepts"
              className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              Learn Concepts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-16 w-full max-w-5xl mx-auto p-4 rounded-3xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 backdrop-blur-sm"
        >
          <GitGraphAnimation />
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: GitBranch,
              title: 'Dynamic Graphs',
              desc: 'Every operation is visualized in real-time. Watch branches grow and merges happen.',
              color: 'emerald'
            },
            {
              icon: Database,
              title: 'Mental Models',
              desc: 'Learn the "why" not just the "how". Build a lasting understanding of snapshots.',
              color: 'teal'
            },
            {
              icon: Zap,
              title: 'Safe Sandbox',
              desc: 'Experiment with destructive commands like rebase and hard resets without fear.',
              color: 'amber'
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/50 transition-colors group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 text-${feature.color}-500`} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-200">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="relative p-12 rounded-[2.5rem] bg-slate-900 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[100px] -mr-48 -mt-48" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Master the <br />
                Git Universe.
              </h2>
              <p className="text-slate-400 text-lg">
                Stop fighting Git and start using it to its full potential. Our visual approach makes complex workflows intuitive.
              </p>
              <div className="flex gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                      U{i}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="text-white font-bold">Join 10,000+ developers</p>
                  <p className="text-slate-500">learning Git visually</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10">
              <DetailedGitGraph />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function GitGraphAnimation() {
  return (
    <svg viewBox="0 0 700 350" className="w-full h-auto">
      <defs>
        <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
          <stop offset="100%" stopColor="#059669" stopOpacity="1" />
        </linearGradient>
      </defs>

      <g transform="translate(60, 60)">
        <line x1="0" y1="0" x2="0" y2="180" stroke="currentColor" strokeWidth="3" className="text-slate-300 dark:text-slate-700" />
        <circle cx="0" cy="180" r="25" fill="url(#mainGradient)">
          <animate attributeName="r" values="25;27;25" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x="0" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">C1</text>
        <text x="35" y="185" fill="#10b981" fontSize="13" fontWeight="bold">main</text>

        <line x1="0" y1="180" x2="140" y2="140" stroke="currentColor" strokeWidth="3" className="text-slate-300 dark:text-slate-700" />
        <circle cx="140" cy="140" r="25" fill="url(#mainGradient)" />
        <text x="140" y="145" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">C2</text>

        <line x1="140" y1="140" x2="280" y2="180" stroke="currentColor" strokeWidth="3" className="text-slate-300 dark:text-slate-700" />
        <circle cx="280" cy="180" r="25" fill="url(#mainGradient)" />
        <text x="280" y="185" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">C3</text>

        <line x1="140" y1="140" x2="420" y2="60" stroke="currentColor" strokeWidth="3" className="text-slate-300 dark:text-slate-700" />
        <circle cx="420" cy="60" r="25" fill="url(#mainGradient)" />
        <text x="420" y="65" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">F1</text>
        <text x="420" y="35" fill="#10b981" fontSize="13" fontWeight="bold">feature</text>

        <line x1="280" y1="180" x2="560" y2="140" stroke="currentColor" strokeWidth="3" className="text-slate-300 dark:text-slate-700" markerEnd="url(#arrow)" />
        <line x1="420" y1="60" x2="560" y2="140" stroke="currentColor" strokeWidth="3" className="text-slate-300 dark:text-slate-700" markerEnd="url(#arrow)" />
        <circle cx="560" cy="140" r="25" fill="#f59e0b" />
        <text x="560" y="145" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">M</text>

        <polygon points="560,110 573,90 547,90" fill="#ef4444">
          <animate attributeName="points" values="560,110 573,90 547,90; 560,108 575,88 545,88; 560,110 573,90 547,90" dur="1s" repeatCount="indefinite" />
        </polygon>
      </g>

      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" className="fill-slate-300 dark:fill-slate-700" />
        </marker>
      </defs>
    </svg>
  )
}

function DetailedGitGraph() {
  return (
    <svg viewBox="0 0 450 250" className="w-full h-auto">
      <g transform="translate(40, 40)">
        <line x1="20" y1="30" x2="20" y2="170" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 dark:text-slate-700" />
        <circle cx="20" cy="170" r="20" fill="#10b981" />
        <text x="20" y="175" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C1</text>

        <line x1="20" y1="170" x2="120" y2="140" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 dark:text-slate-700" />
        <circle cx="120" cy="140" r="20" fill="#10b981" />
        <text x="120" y="145" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C2</text>

        <line x1="120" y1="140" x2="220" y2="170" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 dark:text-slate-700" />
        <circle cx="220" cy="170" r="20" fill="#10b981" />
        <text x="220" y="175" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">C3</text>

        <line x1="120" y1="140" x2="340" y2="50" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 dark:text-slate-700" />
        <circle cx="340" cy="50" r="20" fill="#06b6d4" />
        <text x="340" y="55" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">F1</text>

        <line x1="340" y1="50" x2="340" y2="110" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 dark:text-slate-700" />
        <circle cx="340" cy="110" r="20" fill="#06b6d4" />
        <text x="340" y="115" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">F2</text>

        <line x1="220" y1="170" x2="340" y2="110" stroke="currentColor" strokeWidth="2.5" className="text-slate-300 dark:text-slate-700" />

        <text x="70" y="200" fill="#10b981" fontSize="13" fontWeight="bold">main</text>
        <text x="340" y="80" fill="#06b6d4" fontSize="13" fontWeight="bold">feature</text>

        <polygon points="340,25 358,5 322,5" fill="#ef4444">
          <animate attributeName="y" values="25;22;25" dur="1s" repeatCount="indefinite" />
        </polygon>
      </g>
    </svg>
  )
}

export default Home