import { motion } from 'framer-motion'
import { shortHash } from '../lib/utils'
import { GitBranch, Tag, Info, Activity, Code2, GitFork } from 'lucide-react'

export default function InspectorPanel({ state, minimal = false }) {
  const { commits, branches, tags, head } = state

  if (minimal) {
    return (
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Head</span>
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${head.type === 'detached' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{head.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {head.type === 'branch' ? head.ref : shortHash(head.ref)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card h-full flex flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <Activity className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">State Inspector</h3>
      </div>

      <div className="flex-grow overflow-auto custom-scrollbar">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <Section title="Branches" icon={<GitFork className="w-3.5 h-3.5" />}>
            <div className="space-y-1.5">
              {Object.entries(branches).map(([name, hash]) => (
                <div key={name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-500/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${head.type === 'branch' && head.ref === name ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{shortHash(hash)}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon, children }) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        {icon}
        <h4 className="text-[10px] font-black uppercase tracking-widest">{title}</h4>
      </div>
      {children}
    </div>
  )
}