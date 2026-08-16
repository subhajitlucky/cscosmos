import { motion } from 'framer-motion';
import { Link } from '@/components/visualizers/shared/RouterShim';
import { 
  Target, Heart, AlertCircle, Code, 
  ExternalLink, Github, Lightbulb, BookOpen
} from 'lucide-react';
import useSEO from '../hooks/useSEO';

const sections = [
  {
    icon: Target,
    title: 'Our Mission',
    color: 'blue',
    content: `
      Math for Machine Learning was created to make mathematical foundations of ML 
      accessible through visual intuition. We believe that seeing is understanding — 
      when you can visualize how a matrix transforms space, or how probability 
      distributions behave, the abstract becomes concrete.
      
      Our goal is to help you build genuine geometric and probabilistic intuition 
      that transfers to real ML understanding, not just memorize formulas you'll forget.
    `,
  },
  {
    icon: Heart,
    title: 'Why This Exists',
    color: 'rose',
    content: `
      Too many ML practitioners struggle because they skipped or rushed through 
      the math foundations. They can use libraries, but don't understand what's 
      happening inside. This creates a ceiling on what they can debug, improve, 
      or innovate.
      
      We want to lower the barrier to mathematical intuition, making it as easy 
      as playing with sliders and watching animations. No prerequisites required — 
      just curiosity and a willingness to experiment.
    `,
  },
  {
    icon: AlertCircle,
    title: 'Educational Disclaimer',
    color: 'amber',
    content: `
      This is an educational visualization tool, not a comprehensive mathematics 
      course. The visualizations are simplified 2D representations that capture 
      the essence of concepts but may not cover all edge cases or higher dimensions.
      
      For rigorous mathematical foundations, we recommend supplementing with 
      textbooks like "Mathematics for Machine Learning" by Deisenroth et al. 
      or 3Blue1Brown's "Essence of Linear Algebra" video series.
    `,
  },
  {
    icon: Code,
    title: 'Technical Details',
    color: 'green',
    content: `
      All visualizations run entirely in your browser — no data is sent to any server. 
      This is a frontend-only application built with React, using the HTML5 Canvas API 
      for graphics and Framer Motion for animations.
      
      Numerical computations are performed in JavaScript with standard floating-point 
      precision. For actual ML implementations, you'd use optimized libraries like 
      NumPy, PyTorch, or TensorFlow that handle numerical stability better.
    `,
  },
];

const resources = [
  {
    title: '3Blue1Brown',
    description: 'Essence of Linear Algebra & Calculus series',
    url: 'https://www.3blue1brown.com/',
  },
  {
    title: 'Mathematics for ML',
    description: 'Free textbook by Deisenroth, Faisal & Ong',
    url: 'https://mml-book.github.io/',
  },
  {
    title: 'Seeing Theory',
    description: 'Interactive probability visualizations',
    url: 'https://seeing-theory.brown.edu/',
  },
  {
    title: 'Linear Algebra Done Right',
    description: 'Axler\'s conceptual approach to linear algebra',
    url: 'https://linear.axler.net/',
  },
  {
    title: 'StatQuest',
    description: 'Josh Starmer\'s ML & statistics explanations',
    url: 'https://statquest.org/',
  },
  {
    title: 'Distill',
    description: 'Visual ML research articles',
    url: 'https://distill.pub/',
  },
];

const principles = [
  {
    icon: Lightbulb,
    title: 'Visual First',
    description: 'Every concept starts with an interactive visualization, not a formula.',
  },
  {
    icon: Target,
    title: 'ML-Focused',
    description: 'Content is curated specifically for machine learning applications.',
  },
  {
    icon: BookOpen,
    title: 'Intuition Over Rigor',
    description: 'We prioritize geometric understanding over formal proofs.',
  },
];

export default function AboutPage() {
  useSEO({
    title: 'About',
    description: 'Learn about the MathML Cosmos project - visual math education for machine learning practitioners.',
  });

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="gradient-text">This Project</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Building mathematical intuition for machine learning through 
            interactive visualizations and experiments.
          </p>
        </motion.div>

        {/* Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {principles.map((principle, idx) => (
            <div 
              key={idx}
              className="glass-card p-6 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                <principle.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold mb-2">{principle.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {principle.description}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8 mb-16">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              className="glass-card p-8"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${section.color}-100 dark:bg-${section.color}-900/30 flex items-center justify-center shrink-0`}>
                  <section.icon className={`w-6 h-6 text-${section.color}-600 dark:text-${section.color}-400`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">{section.title}</h2>
                  <div className="text-slate-600 dark:text-slate-400 space-y-3">
                    {section.content.trim().split('\n\n').map((para, i) => (
                      <p key={i}>{para.trim()}</p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Limitations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">Limitations of Visualization</h2>
          <div className="glass-card p-8">
            <ul className="space-y-4 text-slate-600 dark:text-slate-400">
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">⚠</span>
                <span>
                  <strong className="text-slate-900 dark:text-white">2D/3D Only:</strong> Most ML operates in high-dimensional spaces (hundreds to millions of dimensions). Our visualizations are limited to 2D, which can only hint at higher-dimensional phenomena.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">⚠</span>
                <span>
                  <strong className="text-slate-900 dark:text-white">Numerical Precision:</strong> Browser JavaScript uses 64-bit floating point. Real ML frameworks handle numerical stability more carefully with techniques like mixed precision and specialized implementations.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">⚠</span>
                <span>
                  <strong className="text-slate-900 dark:text-white">Simplified Examples:</strong> Visualizations use small matrices and clean examples. Real ML data is messier, larger, and requires different computational strategies.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 font-bold">⚠</span>
                <span>
                  <strong className="text-slate-900 dark:text-white">Not a Substitute:</strong> This tool builds intuition but doesn't replace formal education. For rigorous understanding, combine visualizations with textbooks and courses.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">Recommended Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-4 hover:shadow-lg transition-shadow group flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary-500 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-slate-500">{resource.description}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Open Source */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-8 text-center"
        >
          <Github className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Open Source</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
            This project is open source. Feel free to explore the code, 
            suggest improvements, or use it as a learning resource for React and Canvas visualizations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
            <Link
              to="/playground"
              className="btn-secondary"
            >
              Try the Playground
            </Link>
          </div>
        </motion.div>

        {/* Footer Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <blockquote className="text-xl italic text-slate-600 dark:text-slate-400">
            "The purpose of computation is insight, not numbers."
          </blockquote>
          <p className="text-sm text-slate-400 mt-2">— Richard Hamming</p>
        </motion.div>
      </div>
    </div>
  );
}
