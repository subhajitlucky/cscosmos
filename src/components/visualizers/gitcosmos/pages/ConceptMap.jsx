import { Link } from '@/components/visualizers/shared/RouterShim'
import { conceptGroups } from '../data/concepts'
import { ChevronRight, Search, Filter, Sparkles, GitBranch } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

function ConceptMap() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  const allConcepts = conceptGroups.flatMap(group =>
    group.concepts.map(concept => ({ ...concept, groupName: group.name }))
  )

  const filteredConcepts = allConcepts.filter(concept => {
    const matchesSearch = concept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        concept.definition.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'all' || concept.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  const groupConcepts = () => {
    return conceptGroups.map(group => ({
      ...group,
      concepts: group.concepts.filter(concept =>
        filteredConcepts.some(fc => fc.id === concept.id)
      )
    })).filter(group => group.concepts.length > 0)
  }

  const filteredGroups = groupConcepts()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {filteredConcepts.length} Concepts Available
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Git Concepts
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400">
          From basic snapshots to complex branching workflows, master them all visually.
        </p>
      </section>

      <section className="sticky top-20 z-40">
        <div className="flex flex-col md:flex-row gap-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-xl">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </section>

      {filteredConcepts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No results found</h3>
          <p className="text-sm text-slate-500">Try broadening your search or filters</p>
        </motion.div>
      ) : (
        <div className="space-y-16">
          {filteredGroups.map((group, groupIndex) => (
            <section key={group.name} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white">
                  {group.name}
                </h2>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {group.concepts.length}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.concepts.map((concept, index) => (
                  <motion.div
                    key={concept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                  >
                    <Link
                      to={`/concepts/${concept.id}`}
                      className="group flex flex-col h-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          <GitBranch className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                          {concept.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {concept.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-2">
                        {concept.definition}
                      </p>
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Explore Module</span>
                        <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConceptMap