import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Grid3X3, TrendingUp, Sparkles, 
  RotateCcw, Download, Copy, Check, 
  ChevronDown, Play, Pause
} from 'lucide-react';
import VectorCanvas from '../components/visualizers/VectorCanvas';
import MatrixTransformCanvas from '../components/visualizers/MatrixTransformCanvas';
import DistributionCanvas from '../components/visualizers/DistributionCanvas';
import EigenCanvas from '../components/visualizers/EigenCanvas';
import ErrorBoundary from '../components/ErrorBoundary';
import useSEO from '../hooks/useSEO';

const tabs = [
  { id: 'vectors', label: 'Vector Space', icon: Layers, color: 'blue' },
  { id: 'matrices', label: 'Transformations', icon: Grid3X3, color: 'teal' },
  { id: 'eigen', label: 'Eigenvalues', icon: Sparkles, color: 'cyan' },
  { id: 'probability', label: 'Distributions', icon: TrendingUp, color: 'amber' },
];

export default function PlaygroundPage() {
  useSEO({
    title: 'Playground',
    description: 'Experiment with vectors, matrices, eigenvalues, and probability distributions interactively.',
  });

  const [activeTab, setActiveTab] = useState('vectors');

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Math <span className="gradient-text">Playground</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Experiment with mathematical concepts interactively. 
            Drag, adjust, and observe how math comes to life.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? `bg-${tab.color}-100 dark:bg-${tab.color}-900/30 text-${tab.color}-700 dark:text-${tab.color}-300 shadow-md`
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'vectors' && <VectorPlayground />}
            {activeTab === 'matrices' && <MatrixPlayground />}
            {activeTab === 'eigen' && <EigenPlayground />}
            {activeTab === 'probability' && <ProbabilityPlayground />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Vector Space Playground
function VectorPlayground() {
  const [vectors, setVectors] = useState([
    { x: 2, y: 3, color: '#ef4444', label: 'a', draggable: true },
    { x: -1, y: 2, color: '#22c55e', label: 'b', draggable: true },
  ]);
  const [showSum, setShowSum] = useState(true);
  const [scalar, setScalar] = useState(1);

  const sum = { 
    x: vectors[0].x + vectors[1].x, 
    y: vectors[0].y + vectors[1].y,
    color: '#f59e0b',
    label: 'a+b'
  };

  const displayVectors = [
    ...vectors,
    ...(showSum ? [sum] : []),
  ];

  const dotProduct = vectors[0].x * vectors[1].x + vectors[0].y * vectors[1].y;
  const mag0 = Math.sqrt(vectors[0].x ** 2 + vectors[0].y ** 2);
  const mag1 = Math.sqrt(vectors[1].x ** 2 + vectors[1].y ** 2);
  const cosAngle = dotProduct / (mag0 * mag1);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);

  const handleVectorChange = (idx, newVec) => {
    setVectors(prev => prev.map((v, i) => i === idx ? { ...v, ...newVec } : v));
  };

  const addVector = () => {
    const newColor = ['#3b82f6', '#8b5cf6', '#ec4899'][vectors.length % 3];
    setVectors(prev => [...prev, {
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2,
      color: newColor,
      label: String.fromCharCode(97 + prev.length),
      draggable: true,
    }]);
  };

  const reset = () => {
    setVectors([
      { x: 2, y: 3, color: '#ef4444', label: 'a', draggable: true },
      { x: -1, y: 2, color: '#22c55e', label: 'b', draggable: true },
    ]);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Visualization */}
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Vector Space Explorer</h2>
          <div className="flex gap-2">
            <button
              onClick={addVector}
              className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/50"
              title="Add vector"
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={reset}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <VectorCanvas
          vectors={displayVectors}
          interactive={true}
          onVectorChange={handleVectorChange}
          width={600}
          height={450}
          scale={50}
        />

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
          Drag the vector tips to move them • Watch how the sum changes
        </p>
      </div>

      {/* Controls & Info */}
      <div className="space-y-6">
        {/* Vector Values */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Vector Values</h3>
          <div className="space-y-3">
            {vectors.map((v, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: v.color }}
                />
                <span className="font-mono text-sm flex-1">
                  {v.label} = [{v.x.toFixed(2)}, {v.y.toFixed(2)}]
                </span>
                <span className="text-xs text-slate-500">
                  |{v.label}| = {Math.sqrt(v.x**2 + v.y**2).toFixed(2)}
                </span>
              </div>
            ))}
            {showSum && (
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="w-4 h-4 rounded-full bg-amber-500" />
                <span className="font-mono text-sm flex-1">
                  sum = [{sum.x.toFixed(2)}, {sum.y.toFixed(2)}]
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Display Options</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={showSum}
              onChange={(e) => setShowSum(e.target.checked)}
              className="w-4 h-4 rounded text-primary-500"
            />
            <span className="text-sm">Show vector sum</span>
          </label>
        </div>

        {/* Computed Values */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Computed Values</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
              <p className="text-xs text-slate-500 mb-1">Dot Product</p>
              <p className="text-xl font-bold text-primary-600">{dotProduct.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
              <p className="text-xs text-slate-500 mb-1">Angle</p>
              <p className="text-xl font-bold text-accent-600">{angle.toFixed(1)}°</p>
            </div>
          </div>
        </div>

        {/* ML Connection */}
        <div className="ml-callout">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>ML Connection:</strong> These operations power similarity search, 
            attention mechanisms, and feature engineering in machine learning.
          </p>
        </div>
      </div>
    </div>
  );
}

// Matrix Transformation Playground
function MatrixPlayground() {
  const [matrix, setMatrix] = useState([[1, 0], [0, 1]]);
  const [presetOpen, setPresetOpen] = useState(false);

  const presets = [
    { name: 'Identity', matrix: [[1, 0], [0, 1]] },
    { name: 'Scale 2x', matrix: [[2, 0], [0, 2]] },
    { name: 'Rotate 45°', matrix: [[0.707, -0.707], [0.707, 0.707]] },
    { name: 'Rotate 90°', matrix: [[0, -1], [1, 0]] },
    { name: 'Shear X', matrix: [[1, 1], [0, 1]] },
    { name: 'Shear Y', matrix: [[1, 0], [1, 1]] },
    { name: 'Reflect Y', matrix: [[-1, 0], [0, 1]] },
    { name: 'Squeeze', matrix: [[2, 0], [0, 0.5]] },
  ];

  const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Visualization */}
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Matrix Transformation Lab</h2>
          <div className="relative">
            <button
              onClick={() => setPresetOpen(!presetOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              Presets
              <ChevronDown className={`w-4 h-4 transition-transform ${presetOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {presetOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-10"
                >
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setMatrix(preset.matrix);
                        setPresetOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-xl last:rounded-b-xl"
                    >
                      {preset.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <MatrixTransformCanvas
          matrix={matrix}
          animate={false}
          showBasisVectors={true}
          showGrid={true}
          showUnitSquare={true}
          width={600}
          height={450}
          scale={60}
        />

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
          Watch how the grid, unit square, and basis vectors transform
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Matrix Editor */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Matrix Values</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { row: 0, col: 0, label: 'a' },
              { row: 0, col: 1, label: 'b' },
              { row: 1, col: 0, label: 'c' },
              { row: 1, col: 1, label: 'd' },
            ].map(({ row, col, label }) => (
              <div key={label}>
                <label className="text-xs text-slate-500 mb-1 block">{label}</label>
                <input
                  type="number"
                  step="0.1"
                  value={matrix[row][col]}
                  onChange={(e) => {
                    const newMatrix = matrix.map(r => [...r]);
                    newMatrix[row][col] = parseFloat(e.target.value) || 0;
                    setMatrix(newMatrix);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center font-mono"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center font-mono text-sm">
            M = [{matrix[0][0].toFixed(1)}, {matrix[0][1].toFixed(1)}]
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;[{matrix[1][0].toFixed(1)}, {matrix[1][1].toFixed(1)}]
          </div>
        </div>

        {/* Sliders */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Quick Adjust</h3>
          <div className="space-y-4">
            {[
              { row: 0, col: 0, label: 'Scale X (a)', color: 'red' },
              { row: 1, col: 1, label: 'Scale Y (d)', color: 'green' },
              { row: 0, col: 1, label: 'Shear X (b)', color: 'blue' },
              { row: 1, col: 0, label: 'Shear Y (c)', color: 'teal' },
            ].map(({ row, col, label }) => (
              <div key={label}>
                <label className="text-xs text-slate-500 flex justify-between">
                  <span>{label}</span>
                  <span>{matrix[row][col].toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.05"
                  value={matrix[row][col]}
                  onChange={(e) => {
                    const newMatrix = matrix.map(r => [...r]);
                    newMatrix[row][col] = parseFloat(e.target.value);
                    setMatrix(newMatrix);
                  }}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Properties */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Matrix Properties</h3>
          <div className={`p-4 rounded-lg text-center ${det >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <p className="text-xs text-slate-500">Determinant</p>
            <p className={`text-2xl font-bold ${det >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {det.toFixed(3)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {det > 0 ? 'Preserves orientation' : det < 0 ? 'Flips orientation' : 'Singular (collapses)'}
            </p>
          </div>
        </div>

        {/* ML Connection */}
        <div className="ml-callout">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>ML Connection:</strong> Every neural network layer multiplies 
            inputs by a weight matrix - this is that transformation!
          </p>
        </div>
      </div>
    </div>
  );
}

// Eigenvalue Playground
function EigenPlayground() {
  const [matrix, setMatrix] = useState([[2, 1], [1, 2]]);
  const [animate, setAnimate] = useState(true);

  // Calculate eigenvalues
  const a = matrix[0][0], b = matrix[0][1], c = matrix[1][0], d = matrix[1][1];
  const trace = a + d;
  const det = a * d - b * c;
  const discriminant = trace * trace - 4 * det;
  const isComplex = discriminant < 0;
  const lambda1 = isComplex ? null : (trace + Math.sqrt(discriminant)) / 2;
  const lambda2 = isComplex ? null : (trace - Math.sqrt(discriminant)) / 2;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Visualization */}
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Eigenvector Explorer</h2>
          <button
            onClick={() => setAnimate(!animate)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              animate 
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}
          >
            {animate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {animate ? 'Animating' : 'Paused'}
          </button>
        </div>

        <EigenCanvas
          matrix={matrix}
          animate={animate}
          width={600}
          height={450}
          scale={60}
          key={animate ? 'animate' : JSON.stringify(matrix)}
        />

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
          {isComplex 
            ? 'Complex eigenvalues — the matrix rotates vectors (no real eigenvectors)' 
            : 'Red and green show eigenvector directions that only get scaled, not rotated'}
        </p>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Matrix Editor */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Symmetric Matrix</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">a (top-left)</label>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={matrix[0][0]}
                onChange={(e) => setMatrix([[parseFloat(e.target.value), matrix[0][1]], matrix[1]])}
                className="w-full"
              />
              <p className="text-center font-mono text-sm">{matrix[0][0].toFixed(1)}</p>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">b = c (off-diagonal)</label>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={matrix[0][1]}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setMatrix([[matrix[0][0], val], [val, matrix[1][1]]]);
                }}
                className="w-full"
              />
              <p className="text-center font-mono text-sm">{matrix[0][1].toFixed(1)}</p>
            </div>
            <div className="col-span-2">
              <label className="text-xs text-slate-500 mb-1 block">d (bottom-right)</label>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.1"
                value={matrix[1][1]}
                onChange={(e) => setMatrix([matrix[0], [matrix[1][0], parseFloat(e.target.value)]])}
                className="w-full"
              />
              <p className="text-center font-mono text-sm">{matrix[1][1].toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Eigenvalues */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Eigenvalues</h3>
          {isComplex ? (
            <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg text-center">
              <p className="text-cyan-600 dark:text-cyan-400 font-medium">Complex Eigenvalues</p>
              <p className="text-xs text-slate-500 mt-1">Matrix causes rotation</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                <p className="text-xs text-red-600 dark:text-red-400">λ₁</p>
                <p className="text-2xl font-bold text-red-600">{lambda1.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                <p className="text-xs text-green-600 dark:text-green-400">λ₂</p>
                <p className="text-2xl font-bold text-green-600">{lambda2.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Interpretation */}
        <div className="intuition-box">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Intuition:</strong> Eigenvectors are special directions that don't rotate 
            under the transformation — they only stretch or shrink by the eigenvalue factor.
          </p>
        </div>

        {/* ML Connection */}
        <div className="ml-callout">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>ML Connection:</strong> PCA finds eigenvectors of the covariance matrix 
            to identify the principal directions of variation in data.
          </p>
        </div>
      </div>
    </div>
  );
}

// Probability Distribution Playground
function ProbabilityPlayground() {
  const [distribution, setDistribution] = useState('normal');
  const [params, setParams] = useState({ mean: 0, std: 1 });
  const [samples, setSamples] = useState([]);
  const [autoSample, setAutoSample] = useState(false);

  // Generate samples
  const generateSample = () => {
    let sample;
    if (distribution === 'normal') {
      // Box-Muller transform
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      sample = params.mean + params.std * z;
    } else if (distribution === 'uniform') {
      sample = Math.random() * 4 - 2;
    } else if (distribution === 'exponential') {
      sample = -Math.log(Math.random());
    }
    setSamples(prev => [...prev.slice(-200), sample]);
  };

  // Auto sampling
  useState(() => {
    if (!autoSample) return;
    const interval = setInterval(generateSample, 100);
    return () => clearInterval(interval);
  }, [autoSample, distribution, params]);

  const mean = samples.length > 0 
    ? samples.reduce((a, b) => a + b, 0) / samples.length 
    : 0;
  const variance = samples.length > 1
    ? samples.reduce((sum, s) => sum + (s - mean) ** 2, 0) / (samples.length - 1)
    : 0;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Visualization */}
      <div className="lg:col-span-2 glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Distribution Sampler</h2>
          <div className="flex gap-2">
            {['normal', 'uniform', 'exponential'].map(dist => (
              <button
                key={dist}
                onClick={() => {
                  setDistribution(dist);
                  setSamples([]);
                }}
                className={`px-3 py-1 rounded-lg text-sm capitalize ${
                  distribution === dist 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        <DistributionCanvas
          distribution={distribution}
          params={distribution === 'normal' ? params : {}}
          samples={samples}
          showSamples={true}
          showMean={distribution === 'normal'}
          showStd={distribution === 'normal'}
          width={600}
          height={400}
          color="#8b5cf6"
        />

        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={generateSample}
            className="btn-primary"
          >
            Sample Once
          </button>
          <button
            onClick={() => {
              for (let i = 0; i < 50; i++) generateSample();
            }}
            className="btn-secondary"
          >
            Sample 50x
          </button>
          <button
            onClick={() => setSamples([])}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6">
        {/* Parameters */}
        {distribution === 'normal' && (
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Parameters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 flex justify-between mb-1">
                  <span>Mean (μ)</span>
                  <span>{params.mean.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.1"
                  value={params.mean}
                  onChange={(e) => setParams(p => ({ ...p, mean: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 flex justify-between mb-1">
                  <span>Std Dev (σ)</span>
                  <span>{params.std.toFixed(1)}</span>
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="2"
                  step="0.1"
                  value={params.std}
                  onChange={(e) => setParams(p => ({ ...p, std: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Sample Statistics */}
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Sample Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Samples</span>
              <span className="font-mono">{samples.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sample Mean</span>
              <span className="font-mono">{mean.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sample Variance</span>
              <span className="font-mono">{variance.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sample Std Dev</span>
              <span className="font-mono">{Math.sqrt(variance).toFixed(4)}</span>
            </div>
          </div>
        </div>

        {/* Theory */}
        {distribution === 'normal' && (
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">True Parameters</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-500">True Mean</span>
                <span className="font-mono">{params.mean.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">True Variance</span>
                <span className="font-mono">{(params.std ** 2).toFixed(4)}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              Sample statistics converge to true values as n → ∞
            </p>
          </div>
        )}

        {/* ML Connection */}
        <div className="ml-callout">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>ML Connection:</strong> Understanding sampling helps with 
            Monte Carlo methods, dropout, VAEs, and uncertainty quantification.
          </p>
        </div>
      </div>
    </div>
  );
}
