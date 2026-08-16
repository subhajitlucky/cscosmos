import { useParams, Link } from '@/components/visualizers/shared/RouterShim'
import { getConceptById, conceptGroups } from '../data/concepts'
import { ArrowLeft, ChevronRight, Terminal, BookOpen, GitBranch, Tag, RefreshCw, Save, Layout as LayoutIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

function ConceptPage() {
  const { id } = useParams()
  const concept = getConceptById(id)
  const [isDark, setIsDark] = useState(() => 
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  if (!concept) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Concept not found</h2>
          <Link
            to="/concepts"
            className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Library
          </Link>
        </div>
      </div>
    )
  }

  const allConcepts = conceptGroups.flatMap(g => g.concepts)
  const currentIndex = allConcepts.findIndex(c => c.id === id)
  const previousConcept = currentIndex > 0 ? allConcepts[currentIndex - 1] : null
  const nextConcept = currentIndex < allConcepts.length - 1 ? allConcepts[currentIndex + 1] : null

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 transition-all duration-500">
      {/* 1. BREADCRUMBS & HEADER */}
      <header className="space-y-8">
        <Link
          to="/concepts"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to library
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-tighter border border-emerald-500/20">
                {concept.difficulty}
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {conceptGroups.find(g => g.concepts.includes(concept))?.name}
              </span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white"
            >
              {concept.name}
            </motion.h1>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hidden md:block">
            <GitBranch className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
      </header>

      {/* 2. THE CORE IDEA SECTION */}
      <section className="grid lg:grid-cols-2 gap-8 items-start">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-emerald-500" />
              The Definition
            </h2>
            <p className="text-2xl md:text-3xl leading-tight text-slate-800 dark:text-slate-100 font-bold tracking-tight">
              {concept.definition}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative overflow-hidden group"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 flex items-center gap-2">
            <div className="w-4 h-[1px] bg-slate-400" />
            Mental Model
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-400 relative z-10 italic">
            "{concept.mentalModel}"
          </p>
        </motion.div>
      </section>

      {/* 3. VISUAL SIMULATION STAGE */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
            <div className="w-4 h-[1px] bg-slate-400" />
            Visual Simulation
          </h2>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-slate-400 uppercase">Live Engine</span>
          </div>
        </div>
        
        <div className="p-1 rounded-[3rem] bg-slate-100 dark:bg-slate-800 shadow-inner">
          <div className="bg-white dark:bg-slate-950 rounded-[2.8rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
            <Visualization type={concept.visualization} isDark={isDark} />
          </div>
        </div>
      </section>

      {/* 4. PRACTICAL & DEEP DIVE */}
      <section className="grid lg:grid-cols-12 gap-12 pt-8">
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-rose-500" />
              Watch Out (Common Pitfalls)
            </h2>
            <div className="grid gap-4">
              {concept.commonMistakes.map((mistake, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10"
                >
                  <div className="w-6 h-6 rounded-lg bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">!</div>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed">{mistake}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-6">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-emerald-500" />
              Hands-on Command
            </h2>
            <div className="rounded-[2rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
              <div className="px-5 py-3 bg-slate-800 flex items-center justify-between border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                </div>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">shell</span>
              </div>
              <div className="p-8 font-mono text-sm group-hover:bg-slate-900/50 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 select-none font-bold">~ $</span>
                  <code className="text-emerald-400 break-all">{concept.command}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-8 border-t border-slate-100 dark:border-slate-800">
            {nextConcept && (
              <Link to={`/concepts/${nextConcept.id}`} className="flex items-center justify-between p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all group">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block">Next Topic</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">{nextConcept.name}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            {previousConcept && (
              <Link to={`/concepts/${previousConcept.id}`} className="flex items-center gap-4 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all group">
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 transition-transform" />
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Previous</span>
                  <span className="text-base font-bold text-slate-600 dark:text-slate-400">{previousConcept.name}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function Visualization({ type, isDark }) {
  const primaryColor = isDark ? '#10b981' : '#059669'
  const secondaryColor = isDark ? '#06b6d4' : '#0891b2'
  const textColor = isDark ? '#ffffff' : '#0f172a'
  const mutedColor = isDark ? '#9ca3af' : '#64748b'
  const borderColor = isDark ? '#334155' : '#e2e8f0'

  const containerClasses = "w-full min-h-[400px] flex items-center justify-center relative p-12 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px]"

  switch (type) {
    case 'timeline':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 200" className="w-full">
            <motion.line
              x1="50" y1="100" x2="550" y2="100"
              stroke={borderColor} strokeWidth="4" strokeLinecap="round"
            />
            {[100, 250, 400, 550].map((x, i) => (
              <motion.g key={x} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.5 }}>
                <circle cx={x} cy="100" r="20" fill={primaryColor} />
                <circle cx={x} cy="100" r="25" fill="none" stroke={primaryColor} strokeWidth="2" opacity="0.3">
                  <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x={x} y="145" textAnchor="middle" fill={textColor} fontSize="10" fontWeight="black" className="uppercase">v{i+1}.0</text>
              </motion.g>
            ))}
            <motion.path 
              d="M 100 60 L 100 80" stroke="#ef4444" strokeWidth="4" markerEnd="url(#arrow)"
              animate={{ x: [0, 150, 300, 450, 0] }}
              transition={{ duration: 10, repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] }}
            />
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
        </div>
      )

    case 'distributed-network':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full max-w-lg">
            <circle cx="300" cy="150" r="40" fill={primaryColor} opacity="0.1" stroke={primaryColor} strokeDasharray="4 2" />
            <text x="300" y="155" textAnchor="middle" fill={primaryColor} fontSize="10" fontWeight="black">SERVER</text>
            
            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
              const rad = (angle * Math.PI) / 180
              const x = 300 + Math.cos(rad) * 120
              const y = 150 + Math.sin(rad) * 120
              return (
                <g key={i}>
                  <motion.line x1="300" y1="150" x2={x} y2={y} stroke={borderColor} strokeWidth="2" />
                  <circle cx={x} cy={y} r="15" fill={secondaryColor} />
                  <motion.circle
                    r="4" fill={primaryColor}
                    animate={{ cx: [300, x, 300], cy: [150, y, 150] }}
                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  />
                </g>
              )
            })}
          </svg>
        </div>
      )

    case 'staging-area':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full">
            <rect x="50" y="100" width="120" height="100" rx="20" fill="none" stroke={borderColor} strokeWidth="3" strokeDasharray="8 4" />
            <rect x="240" y="100" width="120" height="100" rx="20" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="3" />
            <rect x="430" y="100" width="120" height="100" rx="20" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="3" />
            
            <text x="110" y="85" textAnchor="middle" fill={mutedColor} fontSize="10" fontWeight="black">WORK</text>
            <text x="300" y="85" textAnchor="middle" fill={primaryColor} fontSize="10" fontWeight="black">STAGE</text>
            <text x="490" y="85" textAnchor="middle" fill={secondaryColor} fontSize="10" fontWeight="black">REPO</text>

            <motion.g
              animate={{ 
                x: [0, 190, 380, 0],
                opacity: [1, 1, 1, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 0.6, 1] }}
            >
              <rect x="80" y="125" width="60" height="50" rx="10" fill="white" stroke={textColor} strokeWidth="2" className="shadow-2xl" />
              <path d="M 95 145 L 125 145" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
              <path d="M 95 155 L 115 155" stroke={borderColor} strokeWidth="3" strokeLinecap="round" />
            </motion.g>
          </svg>
        </div>
      )

    case 'commit-node':
      return (
        <div className={containerClasses}>
          <div className="relative">
            <motion.div 
              className="w-48 h-48 rounded-[3rem] bg-emerald-500 flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.3)]"
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="w-24 h-32 bg-white/20 rounded-2xl border-4 border-white/30 backdrop-blur-md flex flex-col p-4 gap-2">
                <div className="w-full h-2 bg-white/40 rounded" />
                <div className="w-full h-2 bg-white/40 rounded" />
                <div className="w-2/3 h-2 bg-white/40 rounded" />
              </div>
            </motion.div>
            <motion.div 
              className="absolute inset-0 border-8 border-emerald-500 rounded-[3.5rem]"
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      )

    case 'hash-fingerprint':
      return (
        <div className={containerClasses}>
          <div className="flex flex-col items-center gap-12 w-full max-w-md">
            <div className="flex gap-4">
              {['A', 'B', 'C'].map((l, i) => (
                <motion.div 
                  key={l}
                  className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xl shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ delay: i * 0.2, repeat: Infinity }}
                >
                  {l}
                </motion.div>
              ))}
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-1/2"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <motion.div 
              className="p-6 bg-slate-900 text-emerald-400 font-mono text-xl font-black rounded-3xl shadow-2xl border-2 border-emerald-500/30 break-all text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              7af2...de91
            </motion.div>
          </div>
        </div>
      )

    case 'snapshot-diff':
      return (
        <div className={containerClasses}>
          <div className="grid md:grid-cols-2 gap-12 w-full max-w-2xl">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center block">Traditional (Diffs)</span>
              <div className="h-48 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-2">
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded opacity-20" />
                <motion.div className="w-full h-3 bg-rose-500 rounded shadow-lg shadow-rose-500/20" animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity }} />
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded opacity-20" />
              </div>
            </div>
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest text-center block">Git (Snapshots)</span>
              <div className="h-48 rounded-3xl bg-emerald-500/5 border-2 border-emerald-500/30 p-6 flex flex-col gap-2">
                {[1, 2, 3, 4].map(i => (
                  <motion.div key={i} className="w-full h-3 bg-emerald-500/40 rounded" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ delay: i * 0.2, repeat: Infinity }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case 'folder-graph':
      return (
        <div className={containerClasses}>
          <div className="relative group">
            <motion.div 
              className="w-64 h-48 bg-amber-400 dark:bg-amber-500 rounded-[2rem] shadow-2xl relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="absolute -top-4 left-0 w-24 h-8 bg-amber-500 dark:bg-amber-600 rounded-t-2xl" />
              <div className="absolute inset-0 flex items-center justify-center font-black text-amber-900/20 text-4xl tracking-tighter">PROJECT</div>
            </motion.div>
            <motion.div 
              className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500 rounded-[2.5rem] border-8 border-white dark:border-slate-950 shadow-2xl flex flex-col items-center justify-center text-white"
              animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <span className="font-black text-2xl">.git</span>
              <span className="text-[8px] font-bold uppercase opacity-60">Engine</span>
            </motion.div>
          </div>
        </div>
      )

    case 'working-dir':
      return (
        <div className={containerClasses}>
          <div className="w-full max-w-sm rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">workspace/app.js</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
            <div className="p-8 space-y-4">
              <div className="h-4 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
              <motion.div 
                className="h-4 w-full bg-emerald-500/20 border-l-4 border-emerald-500 rounded-r"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="flex justify-center pt-4">
                <motion.div 
                  className="px-4 py-2 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity }}
                >
                  Unsaved Changes
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'head-pointer':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full max-w-xl overflow-visible">
            {/* Commits */}
            {[100, 250, 400].map((x, i) => (
              <g key={x}>
                {i < 2 && <line x1={x} y1={150} x2={x + 150} y2={150} stroke={borderColor} strokeWidth="4" />}
                <circle cx={x} cy={150} r="20" fill={primaryColor} />
                <text x={x} y={155} textAnchor="middle" fill="white" fontSize="10" fontWeight="black">C{i+1}</text>
              </g>
            ))}
            
            {/* Branch Label */}
            <g transform="translate(400, 100)">
              <rect x="-35" y="-25" width="70" height="30" rx="8" fill={primaryColor} />
              <text y="-5" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">main</text>
              <path d="M 0 5 L 0 30" stroke={primaryColor} strokeWidth="2" strokeDasharray="4 2" />
            </g>

            {/* HEAD Pointer Animation */}
            <motion.g
              animate={{ 
                y: [0, -10, 0],
                x: [0, -150, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }}
            >
              <path d="M 400 40 L 400 70" stroke="#ef4444" strokeWidth="4" markerEnd="url(#head-arrow-new)" />
              <rect x="375" y="10" width="50" height="25" rx="6" fill="#ef4444" />
              <text x="400" y="27" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">HEAD</text>
            </motion.g>
            
            <defs>
              <marker id="head-arrow-new" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
          <div className="absolute bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">HEAD usually points to a branch, which points to a commit.</div>
        </div>
      )

    case 'branch-pointer':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full">
            <line x1="50" y1="150" x2="550" y2="150" stroke={borderColor} strokeWidth="2" />
            {[100, 200, 300, 400].map((x, i) => (
              <circle key={x} cx={x} cy="150" r="15" fill={i < 3 ? primaryColor : borderColor} />
            ))}
            
            {/* main branch */}
            <motion.g animate={{ x: [300, 400, 300] }} transition={{ duration: 4, repeat: Infinity }}>
              <rect x="-30" y="80" width="60" height="24" rx="6" fill={primaryColor} />
              <text x="0" y="96" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">main</text>
              <path d="M 0 104 L 0 135" stroke={primaryColor} strokeWidth="2" />
            </motion.g>

            {/* feature branch */}
            <motion.g initial={{ x: 300, y: 100 }}>
              <rect x="-35" y="100" width="70" height="24" rx="6" fill={secondaryColor} />
              <text x="0" y="116" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">feature</text>
              <path d="M 0 124 L 0 135" stroke={secondaryColor} strokeWidth="2" />
            </motion.g>
          </svg>
        </div>
      )

    case 'checkout-move':
      return (
        <div className={containerClasses}>
          <div className="flex flex-col items-center gap-8 w-full">
            <svg viewBox="0 0 600 200" className="w-full h-32">
              <line x1="100" y1="100" x2="500" y2="100" stroke={borderColor} strokeWidth="2" />
              <circle cx="200" cy="100" r="15" fill={primaryColor} />
              <circle cx="400" cy="100" r="15" fill={secondaryColor} />
              
              <motion.g
                animate={{ x: [200, 400, 200] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <path d="M 0 40 L 0 70" stroke="#ef4444" strokeWidth="4" markerEnd="url(#head-arrow-checkout)" />
                <text x="0" y="30" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="black">HEAD</text>
              </motion.g>
              <defs>
                <marker id="head-arrow-checkout" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
              </defs>
            </svg>
            
            <div className="grid grid-cols-2 gap-12 w-full max-w-md">
              <motion.div 
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 space-y-2"
                animate={{ opacity: [1, 0.3, 1], scale: [1, 0.95, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-2 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="text-[8px] font-black text-center text-slate-400 uppercase pt-2">Files on Main</div>
              </motion.div>
              <motion.div 
                className="p-4 rounded-2xl bg-emerald-500/5 border-2 border-emerald-500/20 space-y-2"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1, 0.95] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="h-2 w-full bg-emerald-500/20 rounded" />
                <div className="h-2 w-2/3 bg-emerald-500/20 rounded" />
                <div className="text-[8px] font-black text-center text-emerald-500 uppercase pt-2">Files on Feature</div>
              </motion.div>
            </div>
          </div>
        </div>
      )

    case 'detached-head':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full max-w-lg">
            {[100, 250, 400].map((x, i) => (
              <g key={x}>
                {i < 2 && <line x1={x} y1={150} x2={x + 150} y2={150} stroke={borderColor} strokeWidth="4" />}
                <circle cx={x} cy={150} r="20" fill={i < 2 ? primaryColor : "#ef4444"} fillOpacity={i === 2 ? 0.2 : 1} stroke={i === 2 ? "#ef4444" : "none"} strokeWidth="2" />
              </g>
            ))}
            
            <g transform="translate(250, 100)">
              <rect x="-30" y="-25" width="60" height="25" rx="6" fill={primaryColor} />
              <text y="-8" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">main</text>
            </g>

            <motion.g
              animate={{ 
                x: [250, 400, 250],
                y: [0, 0, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <path d="M 0 40 L 0 130" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" />
              <rect x="-35" y="10" width="70" height="25" rx="6" fill="#ef4444" />
              <text y="27" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">HEAD</text>
              
              <motion.text
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 5, repeat: Infinity, times: [0, 0.5, 1] }}
                x="45" y="25" fill="#ef4444" fontSize="8" fontWeight="black"
              >! DETACHED</motion.text>
            </motion.g>
          </svg>
        </div>
      )

    case 'fast-forward':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full max-w-lg">
            {[100, 200, 300, 400].map((x, i) => (
              <circle key={x} cx={x} cy={150} r="15" fill={i < 4 ? primaryColor : borderColor} />
            ))}
            <line x1="100" y1="150" x2="400" y2="150" stroke={primaryColor} strokeWidth="4" />
            
            {/* feature branch */}
            <g transform="translate(400, 150)">
              <rect x="-35" y="-60" width="70" height="25" rx="6" fill={secondaryColor} />
              <text y="-43" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">feature</text>
            </g>

            {/* main branch moving */}
            <motion.g
              animate={{ x: [100, 400, 100] }}
              transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 1] }}
            >
              <rect x="70" y="180" width="60" height="25" rx="6" fill={primaryColor} />
              <text x="100" y="197" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">main</text>
              <path d="M 100 180 L 100 165" stroke={primaryColor} strokeWidth="2" strokeDasharray="4 2" />
            </motion.g>
          </svg>
          <div className="absolute bottom-8 text-[10px] font-black text-emerald-500 uppercase tracking-widest">No new commit created. main just "catches up".</div>
        </div>
      )

    case 'three-way-merge':
    case 'three-way-diagram':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full">
            {/* Common Ancestor */}
            <circle cx="100" cy="150" r="15" fill={borderColor} />
            <text x="100" y="180" textAnchor="middle" fill={mutedColor} fontSize="8" fontWeight="bold">Base</text>

            {/* Paths */}
            <path d="M 100 150 L 250 100 L 400 100" fill="none" stroke={primaryColor} strokeWidth="2" />
            <path d="M 100 150 L 250 200 L 400 200" fill="none" stroke={secondaryColor} strokeWidth="2" />
            
            {/* Branch Commits */}
            <circle cx="250" cy="100" r="15" fill={primaryColor} />
            <circle cx="400" cy="100" r="15" fill={primaryColor} />
            <circle cx="250" cy="200" r="15" fill={secondaryColor} />
            <circle cx="400" cy="200" r="15" fill={secondaryColor} />

            {/* Merge Animation */}
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
            >
              <path d="M 400 100 L 520 150" stroke={primaryColor} strokeWidth="2" strokeDasharray="4 2" />
              <path d="M 400 200 L 520 150" stroke={secondaryColor} strokeWidth="2" strokeDasharray="4 2" />
              <circle cx="520" cy="150" r="20" fill={primaryColor} />
              <text x="520" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">M</text>
              <rect x="490" y="180" width="60" height="20" rx="6" fill={primaryColor} />
              <text x="520" y="193" textAnchor="middle" fill="white" fontSize="8" fontWeight="black">MERGE</text>
            </motion.g>
          </svg>
        </div>
      )

    case 'conflict-resolution':
      return (
        <div className={containerClasses}>
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className="w-full p-6 rounded-3xl bg-slate-900 border-2 border-rose-500/50 relative overflow-hidden">
              <div className="font-mono text-xs space-y-2 text-slate-300">
                <div className="text-rose-400">{"<<<<<<< HEAD"}</div>
                <div className="pl-4 bg-rose-500/10 text-white">const user = "Alice";</div>
                <div className="text-rose-400">{"======="}</div>
                <div className="pl-4 bg-emerald-500/10 text-white">const user = "Bob";</div>
                <div className="text-rose-400">{">>>>>>> feature"}</div>
              </div>
              <motion.div 
                className="absolute inset-0 bg-rose-500/5"
                animate={{ opacity: [0, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <ArrowLeft className="rotate-[-90deg] text-emerald-500 w-8 h-8 animate-bounce" />
            <motion.div 
              className="w-full p-6 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 font-mono text-xs text-emerald-400"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              const user = "Alice & Bob";
              <div className="mt-2 text-[10px] text-emerald-500/50 uppercase font-black tracking-widest">Resolution Success</div>
            </motion.div>
          </div>
        </div>
      )

    case 'merge-rebase-comparison':
      return (
        <div className={containerClasses}>
          <div className="grid md:grid-cols-2 gap-12 w-full max-w-4xl h-full items-center">
            {/* MERGE VIEW */}
            <div className="flex flex-col items-center gap-6 h-full">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center block">Strategy: Merge</span>
              <div className="flex-grow flex items-center justify-center w-full min-h-[250px] relative">
                <svg viewBox="0 0 300 200" className="w-full">
                  <circle cx="50" cy="100" r="10" fill={borderColor} />
                  <path d="M 50 100 L 120 60 L 190 60" fill="none" stroke={primaryColor} strokeWidth="2" />
                  <path d="M 50 100 L 120 140 L 190 140" fill="none" stroke={secondaryColor} strokeWidth="2" />
                  
                  <circle cx="120" cy="60" r="10" fill={primaryColor} />
                  <circle cx="190" cy="60" r="10" fill={primaryColor} />
                  <circle cx="120" cy="140" r="10" fill={secondaryColor} />
                  <circle cx="190" cy="140" r="10" fill={secondaryColor} />

                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <path d="M 190 60 L 260 100" stroke={primaryColor} strokeWidth="2" strokeDasharray="4 2" />
                    <path d="M 190 140 L 260 100" stroke={secondaryColor} strokeWidth="2" strokeDasharray="4 2" />
                    <circle cx="260" cy="100" r="15" fill={primaryColor} />
                    <text x="260" y="104" textAnchor="middle" fill="white" fontSize="8" fontWeight="black">M</text>
                  </motion.g>
                </svg>
              </div>
              <p className="text-[9px] font-bold text-slate-500 text-center uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Non-linear history (True record)</p>
            </div>

            {/* REBASE VIEW */}
            <div className="flex flex-col items-center gap-6 h-full">
              <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest text-center block">Strategy: Rebase</span>
              <div className="flex-grow flex items-center justify-center w-full min-h-[250px] relative">
                <svg viewBox="0 0 300 200" className="w-full">
                  <line x1="30" y1="100" x2="270" y2="100" stroke={borderColor} strokeWidth="2" />
                  <circle cx="50" cy="100" r="10" fill={borderColor} />
                  <circle cx="120" cy="100" r="10" fill={primaryColor} />
                  
                  {/* Commits being rebased */}
                  <motion.g
                    animate={{ 
                      x: [0, 70, 0],
                      y: [40, 0, 40],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <circle cx="120" cy="60" r="10" fill={secondaryColor} />
                    <circle cx="190" cy="60" r="10" fill={secondaryColor} />
                    <path d="M 120 60 L 190 60" stroke={secondaryColor} strokeWidth="2" strokeDasharray="2 2" />
                  </motion.g>

                  {/* Visual indication of where they go */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <circle cx="190" cy="100" r="10" fill={secondaryColor} stroke={secondaryColor} fillOpacity="0.2" />
                    <circle cx="260" cy="100" r="10" fill={secondaryColor} stroke={secondaryColor} fillOpacity="0.2" />
                  </motion.g>
                </svg>
              </div>
              <p className="text-[9px] font-bold text-indigo-500 text-center uppercase tracking-tighter bg-indigo-500/10 px-3 py-1 rounded-full">Linear history (Clean rewrite)</p>
            </div>
          </div>
        </div>
      )

    case 'cherry-pick-animation':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full">
            {/* Source Branch */}
            <path d="M 50 80 L 550 80" stroke={borderColor} strokeWidth="2" strokeDasharray="4 4" />
            <text x="50" y="70" fill={mutedColor} fontSize="8" fontWeight="black">BRANCH: FEATURE</text>
            {[100, 200, 300, 400].map(x => <circle key={x} cx={x} cy="80" r="12" fill={secondaryColor} />)}
            
            {/* Target Branch */}
            <path d="M 50 220 L 550 220" stroke={borderColor} strokeWidth="2" />
            <text x="50" y="210" fill={primaryColor} fontSize="8" fontWeight="black">BRANCH: MAIN</text>
            <circle cx="100" cy="220" r="12" fill={primaryColor} />
            <circle cx="200" cy="220" r="12" fill={primaryColor} />

            {/* Picking Animation */}
            <motion.g
              animate={{ 
                y: [0, 140, 140],
                x: [0, 0, 100],
                opacity: [1, 1, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, times: [0, 0.5, 1] }}
            >
              <circle cx="200" cy="80" r="15" fill={secondaryColor} className="shadow-2xl" />
              <motion.circle 
                cx="200" cy="80" r="20" fill="none" stroke={secondaryColor} strokeWidth="2"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text x="200" y="84" textAnchor="middle" fill="white" fontSize="8" fontWeight="black">PICK</text>
            </motion.g>

            {/* Destination placeholder */}
            <circle cx="300" cy="220" r="12" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeDasharray="2 2" />
          </svg>
          <div className="absolute bottom-8 text-[10px] font-black text-emerald-500 uppercase tracking-widest">Selectively applying one commit to another branch.</div>
        </div>
      )

    case 'bisect-search':
      return (
        <div className={containerClasses}>
          <div className="flex flex-col items-center gap-12 w-full">
            <svg viewBox="0 0 600 120" className="w-full overflow-visible">
              <line x1="50" y1="60" x2="550" y2="60" stroke={borderColor} strokeWidth="4" />
              {[50, 150, 250, 350, 450, 550].map((x, i) => (
                <motion.g key={x}>
                  <circle cx={x} cy="60" r="15" fill={i === 0 ? primaryColor : i === 5 ? "#ef4444" : borderColor} />
                  {i === 0 && <text x={x} y="95" textAnchor="middle" fill={primaryColor} fontSize="8" fontWeight="black">GOOD</text>}
                  {i === 5 && <text x={x} y="95" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="black">BAD</text>}
                </motion.g>
              ))}
              
              {/* Binary Search Step */}
              <motion.g
                animate={{ x: [250, 350, 450] }}
                transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 1] }}
              >
                <circle cx="0" cy="60" r="20" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <text x="0" y="30" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="black">CHECKING...</text>
              </motion.g>
            </svg>
            <div className="px-6 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest">
              Binary Search: O(log n) efficiency
            </div>
          </div>
        </div>
      )

    case 'tags-on-graph':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full">
            <path d="M 50 150 L 550 150" stroke={borderColor} strokeWidth="2" />
            {[100, 250, 400, 550].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy="150" r="15" fill={primaryColor} />
                {i % 2 === 0 && (
                  <motion.g
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.5 }}
                  >
                    <path d={`M ${x} 135 L ${x} 100`} stroke={primaryColor} strokeWidth="2" strokeDasharray="2 2" />
                    <rect x={x - 30} y="70" width="60" height="30" rx="8" fill={primaryColor} />
                    <text x={x} y="89" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">v{i/2 + 1}.0.0</text>
                    <Tag className="w-3 h-3 text-white/50 absolute" style={{ transform: `translate(${x+10}px, 75px)` }} />
                  </motion.g>
                )}
              </g>
            ))}
          </svg>
        </div>
      )

    case 'git-objects-diagram':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full max-w-lg">
            {/* Commit */}
            <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <rect x="50" y="120" width="100" height="60" rx="12" fill={primaryColor} />
              <text x="100" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">COMMIT</text>
            </motion.g>

            {/* Tree */}
            <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>
              <rect x="250" y="80" width="100" height="60" rx="12" fill={secondaryColor} />
              <text x="300" y="115" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">TREE</text>
            </motion.g>

            {/* Blobs */}
            <g transform="translate(450, 40)">
              {[0, 80, 160].map((y, i) => (
                <motion.g key={y} animate={{ x: [0, 5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>
                  <rect x="0" y={y} width="80" height="40" rx="8" fill={borderColor} />
                  <text x="40" y={y + 25} textAnchor="middle" fill={textColor} fontSize="8" fontWeight="black">BLOB</text>
                </motion.g>
              ))}
            </g>

            {/* Connectors */}
            <motion.path d="M 150 150 L 250 110" stroke={primaryColor} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <motion.path d="M 350 110 L 450 60" stroke={secondaryColor} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <motion.path d="M 350 110 L 450 140" stroke={secondaryColor} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <motion.path d="M 350 110 L 450 220" stroke={secondaryColor} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
          </svg>
        </div>
      )

    case 'remote-connection':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-around w-full max-w-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xl">
                <LayoutIcon className="w-10 h-10 text-emerald-500" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Local Machine</span>
            </div>

            <div className="flex-grow flex flex-col items-center gap-2 px-8">
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-emerald-500 w-1/4"
                  animate={{ x: ['-100%', '400%'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-[0.2em]">Remote URL Connection</span>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                <div className="text-2xl">☁️</div>
              </div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">GitHub / GitLab</span>
            </div>
          </div>
        </div>
      )

    case 'fork-upstream':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full">
            {/* Upstream */}
            <g transform="translate(300, 50)">
              <rect x="-50" y="0" width="100" height="40" rx="10" fill="#6366f1" />
              <text x="0" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">UPSTREAM</text>
            </g>

            {/* Fork Animation */}
            <motion.path
              d="M 300 90 L 300 130 L 150 180"
              fill="none" stroke={borderColor} strokeWidth="2" strokeDasharray="4 4"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            />
            
            {/* Origin (Fork) */}
            <g transform="translate(100, 180)">
              <rect x="-40" y="0" width="80" height="40" rx="10" fill={primaryColor} />
              <text x="0" y="25" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">ORIGIN</text>
              <text x="0" y="55" textAnchor="middle" fill={mutedColor} fontSize="8" fontWeight="bold">(Your Fork)</text>
            </g>

            {/* Local */}
            <g transform="translate(300, 180)">
              <rect x="-40" y="0" width="80" height="40" rx="10" fill={borderColor} />
              <text x="0" y="25" textAnchor="middle" fill={textColor} fontSize="10" fontWeight="black">LOCAL</text>
            </g>

            {/* Connections */}
            <path d="M 140 200 L 260 200" stroke={primaryColor} strokeWidth="2" markerEnd="url(#fork-arrow)" />
            <path d="M 300 90 L 300 180" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" />
            
            <defs>
              <marker id="fork-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={primaryColor} />
              </marker>
            </defs>
          </svg>
        </div>
      )

    case 'fetch-pull-diagram':
      return (
        <div className={containerClasses}>
          <div className="grid grid-cols-2 gap-12 w-full max-w-2xl">
            <div className="space-y-6 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Git Fetch</span>
              <div className="w-full aspect-video bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-amber-500/20 flex items-center justify-center relative overflow-hidden">
                <motion.div 
                  className="absolute top-0 w-full h-1 bg-amber-500"
                  animate={{ y: [0, 100, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="text-center p-4">
                  <div className="text-xs font-bold text-slate-500">Only downloads metadata. History updated, files untouched.</div>
                </div>
              </div>
            </div>
            <div className="space-y-6 flex flex-col items-center">
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Git Pull</span>
              <div className="w-full aspect-video bg-emerald-500/5 rounded-3xl border-2 border-emerald-500/20 flex items-center justify-center relative">
                <motion.div 
                  className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <RefreshCw className="w-6 h-6 text-emerald-500" />
                </motion.div>
                <div className="absolute bottom-4 text-[8px] font-black text-emerald-600 uppercase">Fetch + Merge</div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'push-animation':
      return (
        <div className={containerClasses}>
          <div className="flex flex-col items-center gap-12 w-full max-w-md">
            <div className="flex justify-between w-full">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg">
                  <div className="text-2xl">💻</div>
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase">Local</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-indigo-500 flex items-center justify-center shadow-xl">
                  <div className="text-2xl">☁️</div>
                </div>
                <span className="text-[8px] font-black text-indigo-400 uppercase">Remote</span>
              </div>
            </div>

            <div className="w-full h-12 relative">
              <motion.div
                className="absolute left-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30"
                animate={{ x: [0, 350, 0], opacity: [1, 1, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Save className="w-6 h-6 text-white" />
              </motion.div>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-[2px] bg-slate-200 dark:bg-slate-800 border-t-2 border-dashed border-slate-300 dark:border-slate-700" />
              </div>
            </div>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Pushing local commits to the server</p>
          </div>
        </div>
      )

    case 'pr-workflow':
      return (
        <div className={containerClasses}>
          <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
            <div className="flex items-center gap-12">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white font-black">DEV</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase">Feature</div>
              </div>
              
              <motion.div
                className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-emerald-500 text-emerald-500 font-black text-xs shadow-xl relative"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                PULL REQUEST #42
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
              </motion.div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black">MAIN</div>
                <div className="text-[8px] font-bold text-slate-400 uppercase">Master</div>
              </div>
            </div>

            <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-1">
                  <div className="h-2 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="h-1.5 w-16 bg-slate-100 dark:bg-slate-700 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded" />
                <div className="h-2 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase">Reject</div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-[8px] font-black uppercase shadow-lg shadow-emerald-500/20">Approve & Merge</div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'reset-modes':
      return (
        <div className={containerClasses}>
          <div className="flex flex-col items-center gap-12 w-full max-w-2xl">
            <svg viewBox="0 0 600 160" className="w-full overflow-visible">
              <line x1="50" y1="100" x2="550" y2="100" stroke={borderColor} strokeWidth="4" strokeLinecap="round" />
              {[100, 250, 400, 550].map((x, i) => (
                <circle key={x} cx={x} cy="100" r="18" fill={i < 3 ? primaryColor : borderColor} stroke={i === 3 ? "#ef4444" : "none"} strokeWidth="2" />
              ))}
              <motion.g
                animate={{ x: [400, 250, 400] }}
                transition={{ duration: 6, repeat: Infinity }}
              >
                <path d="M 0 50 L 0 75" stroke="#ef4444" strokeWidth="4" markerEnd="url(#reset-head-arrow)" />
                <text x="0" y="40" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="black">HEAD</text>
              </motion.g>
              <defs>
                <marker id="reset-head-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                </marker>
              </defs>
            </svg>

            <div className="grid grid-cols-3 gap-4 w-full">
              {[
                { label: 'SOFT', desc: 'Only moves HEAD. Changes stay staged.', color: 'text-emerald-500' },
                { label: 'MIXED', desc: 'Moves HEAD + resets Stage. Changes stay in Work.', color: 'text-amber-500' },
                { label: 'HARD', desc: 'Moves HEAD + wipes Stage & Work. Changes LOST.', color: 'text-rose-500' }
              ].map((mode, i) => (
                <motion.div 
                  key={mode.label}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-2 shadow-lg"
                  animate={{ y: [0, -5, 0], scale: [1, 1.02, 1] }}
                  transition={{ delay: i * 0.5, duration: 4, repeat: Infinity }}
                >
                  <div className={`text-[10px] font-black ${mode.color} tracking-widest`}>{mode.label}</div>
                  <div className="text-[8px] font-bold text-slate-400 leading-tight uppercase">{mode.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )

    case 'revert-new-commit':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full max-w-lg">
            <line x1="50" y1="150" x2="550" y2="150" stroke={borderColor} strokeWidth="4" />
            <circle cx="100" cy="150" r="18" fill={primaryColor} />
            <circle cx="250" cy="150" r="18" fill="#ef4444" />
            <text x="250" y="185" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="black">ERROR COMMIT</text>
            
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2, duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
            >
              <circle cx="400" cy="150" r="22" fill={secondaryColor} />
              <text x="400" y="155" textAnchor="middle" fill="white" fontSize="10" fontWeight="black">R</text>
              <rect x="370" y="185" width="60" height="20" rx="6" fill={secondaryColor} />
              <text x="400" y="198" textAnchor="middle" fill="white" fontSize="8" fontWeight="black">REVERT</text>
              <path d="M 400 120 C 350 80, 300 80, 250 120" stroke={secondaryColor} strokeWidth="3" strokeDasharray="4 4" fill="none" markerEnd="url(#revert-arrow)" />
            </motion.g>
            <defs>
              <marker id="revert-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={secondaryColor} />
              </marker>
            </defs>
          </svg>
          <div className="absolute bottom-8 text-[10px] font-black text-blue-500 uppercase tracking-widest">Revert never deletes history. It adds a "fix" commit.</div>
        </div>
      )

    case 'stash-stack':
      return (
        <div className={containerClasses}>
          <div className="flex items-center justify-around w-full max-w-2xl">
            {/* Workspace */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace</span>
              <motion.div 
                className="w-24 h-32 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-4 space-y-2 relative"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="h-2 w-full bg-emerald-500/30 rounded" />
                <div className="h-2 w-full bg-emerald-500/30 rounded" />
                <div className="h-2 w-2/3 bg-emerald-500/30 rounded" />
              </motion.div>
            </div>

            {/* Animation Arrow */}
            <motion.div
              animate={{ x: [-20, 20, -20] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <ChevronRight className="w-8 h-8 text-indigo-500" />
            </motion.div>

            {/* Stash Stack */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Stash @{'{'}0{'}'}</span>
              <div className="relative w-32 h-40 flex flex-col-reverse gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    className="h-10 w-full bg-indigo-500 rounded-lg border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-white font-black text-[10px]"
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: i === 3 ? [0, 1, 0] : 1, y: 0 }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    CHANGESET #{i}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )

    case 'commit-graph':
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 600 300" className="w-full">
            {/* Root */}
            <circle cx="100" cy="150" r="15" fill={primaryColor} />
            
            {/* Branch 1 */}
            <motion.path d="M 100 150 L 250 100 L 400 100" fill="none" stroke={primaryColor} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
            <circle cx="250" cy="100" r="15" fill={primaryColor} />
            <circle cx="400" cy="100" r="15" fill={primaryColor} />
            
            {/* Branch 2 */}
            <motion.path d="M 100 150 L 250 200 L 400 200" fill="none" stroke={secondaryColor} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 1 }} />
            <circle cx="250" cy="200" r="15" fill={secondaryColor} />
            <circle cx="400" cy="200" r="15" fill={secondaryColor} />

            <rect x="420" y="88" width="50" height="24" rx="6" fill={primaryColor} />
            <text x="445" y="104" textAnchor="middle" fill="white" fontSize="9" fontWeight="black">main</text>

            <rect x="420" y="188" width="50" height="24" rx="6" fill={secondaryColor} />
            <text x="445" y="204" textAnchor="middle" fill="white" fontSize="9" fontWeight="black">dev</text>
          </svg>
        </div>
      )

    default:
      return (
        <div className={containerClasses}>
          <svg viewBox="0 0 400 200" className="w-full">
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: '200px 100px' }}
            >
              <circle cx="200" cy="100" r="50" fill={primaryColor} opacity="0.1" />
              <circle cx="200" cy="100" r="35" fill={primaryColor} opacity="0.2" />
              <circle cx="200" cy="100" r="20" fill={primaryColor} />
            </motion.g>
            <motion.g
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <GitBranchIcon className="w-16 h-16 mx-auto" style={{ color: primaryColor }} />
            </motion.g>
            <text x="200" y="180" textAnchor="middle" fill={isDark ? '#9ca3af' : '#64748b'} fontSize="16">
              {type?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </text>
          </svg>
        </div>
      )
  }
}

function GitBranchIcon({ className, style }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  )
}

export default ConceptPage