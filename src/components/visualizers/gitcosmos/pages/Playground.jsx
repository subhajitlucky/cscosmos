import { useGitStore } from '../store/gitStore'
import { useState, useRef, useEffect } from 'react'
import { GitBranch, RefreshCw, Undo2, Redo2, Terminal, Activity, Zap, History, GitMerge, RotateCcw, Tag, Trash2, ArrowRight, Layout, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import CommitGraph from '../components/CommitGraph'
import InspectorPanel from '../components/InspectorPanel'

function Playground() {
  const gitStore = useGitStore()
  const [commitMessage, setCommitMessage] = useState('')
  const [branchName, setBranchName] = useState('')
  const [mergeBranch, setMergeBranch] = useState('')
  const [showCommandOutput, setShowCommandOutput] = useState('')
  const [activeMenu, setActiveMenu] = useState('commit')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const terminalRef = useRef(null)

  const graphData = gitStore.getGraphData()

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [showCommandOutput])

  const handleAction = (cmd, callback) => {
    try {
      const result = callback()
      let output = `\n$ ${cmd}\n${result?.message || 'Success: Operation completed.'}`
      setShowCommandOutput(prev => prev + output)
    } catch (error) {
      setShowCommandOutput(prev => prev + `\n$ ${cmd}\nfatal: ${error.message}`)
    }
  }

  const handleCommit = () => {
    if (!commitMessage.trim()) return
    handleAction(`git commit -m "${commitMessage}"`, () => {
      gitStore.commit(commitMessage)
      setCommitMessage('')
    })
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-100 dark:bg-slate-950 p-4 pt-6 overflow-hidden flex flex-col items-center">
      <div className="flex-grow flex gap-6 overflow-hidden max-w-7xl w-full">

        {/* LEFT SIDEBAR - ACTIONS */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="flex-shrink-0 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#F05033] flex items-center justify-center shadow-lg shadow-[#F05033]/25">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Git Studio</h2>
                    <p className="text-[10px] font-medium text-slate-400">Interactive Simulation</p>
                  </div>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button onClick={gitStore.undo} disabled={!gitStore.canUndo()} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-500 transition-all">
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={gitStore.redo} disabled={!gitStore.canRedo()} className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-md disabled:opacity-30 text-slate-500 transition-all">
                    <Redo2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-2 grid grid-cols-4 gap-1 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                {[
                  { id: 'commit', icon: Zap, label: 'Commit' },
                  { id: 'branch', icon: GitBranch, label: 'Branch' },
                  { id: 'merge', icon: GitMerge, label: 'Merge' },
                  { id: 'reset', icon: RotateCcw, label: 'Reset' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all ${activeMenu === item.id ? 'bg-white dark:bg-slate-800 shadow-sm text-emerald-600 ring-1 ring-emerald-500/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex-grow overflow-y-auto p-5 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMenu}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {activeMenu === 'commit' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commit Message</label>
                          <textarea
                            value={commitMessage}
                            onChange={(e) => setCommitMessage(e.target.value)}
                            className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none transition-all"
                            placeholder="Type a message describing your changes..."
                          />
                        </div>
                        <button onClick={handleCommit} disabled={!commitMessage.trim()} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-[10px] tracking-widest uppercase hover:opacity-90 disabled:opacity-50 shadow-lg shadow-emerald-500/10 transition-all flex items-center justify-center gap-2">
                          <Zap className="w-3.5 h-3.5" /> Commit Changes
                        </button>
                      </div>
                    )}

                    {activeMenu === 'branch' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Branch Name</label>
                          <div className="relative">
                            <GitBranch className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input
                              value={branchName}
                              onChange={(e) => setBranchName(e.target.value)}
                              className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                              placeholder="feature-branch"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => handleAction(`git branch ${branchName}`, () => gitStore.createBranch(branchName))} disabled={!branchName.trim()} className="py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all">Create</button>
                          <button onClick={() => handleAction(`git checkout ${branchName}`, () => gitStore.checkout(branchName))} disabled={!branchName.trim()} className="py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">Switch</button>
                        </div>

                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                          <InspectorPanel state={gitStore.state} minimal />
                        </div>
                      </div>
                    )}

                    {activeMenu === 'merge' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Merge Source</label>
                          <select
                            value={mergeBranch}
                            onChange={(e) => setMergeBranch(e.target.value)}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white outline-none appearance-none"
                          >
                            <option value="">Select a branch to merge into {gitStore.state.head.ref}...</option>
                            {Object.keys(gitStore.state.branches).filter(b => b !== gitStore.state.head.ref).map(b => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>
                        <button onClick={() => {
                          const result = gitStore.merge(mergeBranch);
                          if (result) {
                            setShowCommandOutput(prev => prev + `\n$ git merge ${mergeBranch}\n${result.message}`);
                          }
                        }} disabled={!mergeBranch} className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold text-[10px] tracking-widest uppercase hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 transition-all">Merge Branch</button>
                      </div>
                    )}

                    {activeMenu === 'reset' && (
                      <div className="space-y-3">
                        <button onClick={() => handleAction('git reset --hard HEAD~1', () => gitStore.reset('hard', 1))} className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-600 shadow-lg shadow-rose-500/20 transition-all">Reset Hard (Head~1)</button>
                        <button onClick={() => handleAction('git reset --soft HEAD~1', () => gitStore.reset('soft', 1))} className="w-full py-3 border border-rose-200 dark:border-rose-800 text-rose-500 dark:text-rose-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">Reset Soft</button>

                        <div className="py-4 flex justify-center">
                          <div className="w-8 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        </div>

                        <button onClick={() => { gitStore.init(); setShowCommandOutput(''); }} className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-2 transition-all">
                          <RefreshCw className="w-3.5 h-3.5" /> Reset Repository
                        </button>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN VISUALIZATION AREA */}
        <main className="flex-grow flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">

          {/* Main Toolbar Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="pointer-events-auto">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
              >
                {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3 pointer-events-auto">
              {/* Stats Pills */}
              <div className="hidden md:flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live</span>
                </div>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">COMMITS</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{gitStore.state.commits.length}</span>
                </div>
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400">BRANCHES</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">{Object.keys(gitStore.state.branches).length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Container */}
          <div className="flex-grow relative bg-slate-50/50 dark:bg-slate-950/50 overflow-hidden">

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            {gitStore.state.commits.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Repo Initialized</p>
                <p className="text-xs text-slate-400 mt-1">Make your first commit</p>
              </div>
            ) : (
              <CommitGraph data={graphData} />
            )}
          </div>

          {/* Bottom Terminal Drawer */}
          <div className="h-48 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col relative z-20">
            <div className="px-5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">System Stream</span>
              </div>
              <button onClick={() => setShowCommandOutput('')} className="text-[9px] font-bold text-slate-400 hover:text-emerald-500 uppercase tracking-wider transition-colors">Clear</button>
            </div>
            <div ref={terminalRef} className="flex-grow p-4 font-mono text-[11px] overflow-y-auto custom-scrollbar bg-slate-50/20 dark:bg-slate-950/20">
              <pre className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                {showCommandOutput || "SYSTEM: Simulation engine online and ready.\n$ git init\nSuccess: Git repository initialized."}
              </pre>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

export default Playground