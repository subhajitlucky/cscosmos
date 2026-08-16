import { Link, useSearchParams } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { 
  Layers, Grid3X3, Sparkles, Dice5, TrendingUp, 
  BarChart3, Brain, Move3D, ArrowRight, Search,
  ChevronRight, BookOpen, Star
} from 'lucide-react';
import { topicsData, learningPaths, getAllTopics } from '../data/topics';
import useSEO from '../hooks/useSEO';
import { useState, useMemo } from 'react';

const iconMap = {
  Layers,
  Move3D,
  Grid3X3,
  Sparkles,
  Dice5,
  TrendingUp,
  BarChart3,
  Brain,
};

const colorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800',
  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  rose: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800',
  sky: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
};

const difficultyColors = {
  beginner: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  intermediate: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  advanced: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
};

export default function LearnPage() {
  useSEO({
    title: 'Learn',
    description: 'Explore 30 interactive topics covering linear algebra and probability for machine learning.',
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');

  const allTopics = useMemo(() => getAllTopics(), []);

  const filteredTopics = useMemo(() => {
    let topics = allTopics;

    if (selectedCategory !== 'all') {
      topics = topics.filter(t => t.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      topics = topics.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.mlRelevance.toLowerCase().includes(query)
      );
    }

    return topics;
  }, [allTopics, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Learning Paths</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Master the mathematics behind machine learning through visual, 
            interactive lessons. Choose a learning path or explore individual topics.
          </p>
        </motion.div>

        {/* Learning Paths */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-500" />
            Structured Learning Paths
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningPaths.map((path, idx) => {
              const Icon = iconMap[path.icon] || Layers;
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  className={`glass-card p-6 border-t-4 cursor-pointer group ${
                    colorClasses[path.color]?.split(' ').filter(c => c.includes('border')).join(' ') || 'border-primary-500'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                    colorClasses[path.color]?.split(' ').slice(0, 2).join(' ') || 'bg-primary-100 dark:bg-primary-900/30'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      colorClasses[path.color]?.split(' ').slice(2, 4).join(' ') || 'text-primary-600 dark:text-primary-400'
                    }`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{path.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {path.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {path.topics.length} topics
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* All Topics */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500" />
              All Topics ({filteredTopics.length})
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-full sm:w-64"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2">
                {['all', 'linear', 'probability'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat === 'linear' ? 'Linear Algebra' : 'Probability'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic, idx) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Link
                  to={`/topic/${topic.id}`}
                  className="block h-full"
                >
                  <div className="concept-card h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`topic-badge ${
                        topic.category === 'linear' ? 'topic-badge-linear' : 'topic-badge-probability'
                      }`}>
                        {topic.category === 'linear' ? 'Linear Algebra' : 'Probability'}
                      </span>
                      <span className={`topic-badge ${difficultyColors[topic.difficulty]}`}>
                        {topic.difficulty}
                      </span>
                    </div>

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {topic.title}
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
                      {topic.description}
                    </p>

                    <div className="mt-auto">
                      <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                        <strong>ML:</strong> {topic.mlRelevance.slice(0, 80)}...
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-4 text-primary-600 dark:text-primary-400">
                      <span className="text-sm font-medium">Learn</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                No topics found matching your search.
              </p>
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
