import { Link } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Play, Sparkles, Brain, 
  Layers, TrendingUp, Grid3X3, Dice5,
  ChevronRight, Zap
} from 'lucide-react';
import VectorCanvas from '../components/visualizers/VectorCanvas';
import MatrixTransformCanvas from '../components/visualizers/MatrixTransformCanvas';
import DistributionCanvas from '../components/visualizers/DistributionCanvas';
import ErrorBoundary from '../components/ErrorBoundary';
import { CanvasSkeleton } from '../components/Skeleton';
import useSEO from '../hooks/useSEO';
import { useState, useEffect, Suspense } from 'react';

const heroVectors = [
  { x: 2, y: 3, color: '#3b82f6', label: 'data', draggable: false },
  { x: -1.5, y: 2, color: '#8b5cf6', label: 'weights', draggable: false },
  { x: 3, y: -1, color: '#22c55e', label: 'gradient', draggable: false },
];

const mlConnections = [
  {
    math: 'Vectors',
    ml: 'Data points & features',
    icon: Layers,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    math: 'Matrices',
    ml: 'Neural network layers',
    icon: Grid3X3,
    color: 'from-teal-500 to-cyan-500',
  },
  {
    math: 'Gradients',
    ml: 'Training & optimization',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
  },
  {
    math: 'Probability',
    ml: 'Predictions & uncertainty',
    icon: Dice5,
    color: 'from-amber-500 to-orange-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  useSEO({
    title: null, // Use default for home
    description: 'Learn math for machine learning through interactive visualizations. Master linear algebra, probability, and statistics with intuitive animations.',
  });

  const [animatedVectors, setAnimatedVectors] = useState(heroVectors);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedVectors(prev => prev.map(v => ({
        ...v,
        x: v.x + (Math.random() - 0.5) * 0.3,
        y: v.y + (Math.random() - 0.5) * 0.3,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5Q0EzQUYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 dark:opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left column - Text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                  Visual Learning for ML
                </span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">See</span> the Math Behind{' '}
                <span className="gradient-text">Machine Learning</span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Transform abstract mathematical concepts into intuitive visualizations. 
                Build deep geometric intuition for linear algebra and probability — 
                the foundations that power every ML model.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/learn" className="btn-primary inline-flex items-center justify-center gap-2">
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/playground" className="btn-secondary inline-flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  Open Playground
                </Link>
              </motion.div>
            </motion.div>

            {/* Right column - Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative"
            >
              <div className="glass-card p-4 sm:p-6 shadow-2xl">
                <div className="w-full max-w-[400px] mx-auto">
                  <VectorCanvas 
                    vectors={animatedVectors}
                    width={400}
                    height={350}
                    scale={40}
                  />
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Vectors representing data, weights, and gradients in ML
                </p>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 px-3 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-full shadow-lg"
              >
                Linear Algebra
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-full shadow-lg"
              >
                Probability
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Math Matters Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              Why <span className="gradient-text">Math</span> Powers ML
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Every machine learning algorithm is built on mathematical foundations. 
              Understanding the math gives you superpowers to debug, improve, and innovate.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mlConnections.map((item, idx) => (
              <motion.div
                key={item.math}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="concept-card text-center"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.math}</h3>
                <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                  <ArrowRight className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.ml}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Preview Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              Learn by <span className="gradient-text">Seeing</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our interactive visualizations make abstract concepts tangible. 
              Watch transformations happen, sample from distributions, and build intuition.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Matrix Transformation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <h3 className="subsection-title flex items-center gap-2">
                <Grid3X3 className="w-5 h-5 text-teal-500" />
                Matrix Transformations
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                See how matrices warp space — every neural network layer does exactly this!
              </p>
              <div className="w-full overflow-hidden">
                <div className="w-full max-w-[380px] mx-auto">
                  <MatrixTransformCanvas 
                    matrix={[[1.5, 0.5], [0, 1.2]]} 
                    animate={true}
                    width={380}
                    height={280}
                  />
                </div>
              </div>
              <Link 
                to="/topic/matrix-multiplication" 
                className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
              >
                Learn more about transformations
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Probability Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <h3 className="subsection-title flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Probability Distributions
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Visualize uncertainty — model outputs, sampling, and the famous bell curve.
              </p>
              <div className="w-full overflow-hidden">
                <div className="w-full max-w-[380px] mx-auto">
                  <DistributionCanvas 
                    distribution="normal"
                    params={{ mean: 0, std: 1 }}
                    showMean={true}
                    showStd={true}
                    width={380}
                    height={280}
                    color="#8b5cf6"
                  />
                </div>
              </div>
              <Link 
                to="/topic/gaussian-distribution" 
                className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
              >
                Learn about Gaussian distributions
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Learning Paths Preview */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">
              Choose Your <span className="gradient-text">Path</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Start with foundations or jump to specific topics. 
              Every path leads to deeper ML understanding.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-8 border-l-4 border-blue-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Linear Algebra</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Vectors, matrices, transformations, eigenvalues — the language of data and models.
              </p>
              <Link 
                to="/learn" 
                className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Explore 15 topics
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-8 border-l-4 border-amber-500"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Dice5 className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-bold">Probability & Stats</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Random variables, distributions, Bayes theorem — the math of predictions.
              </p>
              <Link 
                to="/learn" 
                className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium hover:underline"
              >
                Explore 15 topics
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/learn" className="btn-primary inline-flex items-center gap-2">
              View All Learning Paths
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 gradient-bg relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-accent-600/90" />
            <div className="relative z-10">
              <Zap className="w-12 h-12 text-white mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to See Math in Action?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Jump into the interactive playground and experiment with vectors, 
                matrices, and probability — no formulas required.
              </p>
              <Link 
                to="/playground" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 font-bold rounded-xl hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <Play className="w-5 h-5" />
                Open Playground
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
