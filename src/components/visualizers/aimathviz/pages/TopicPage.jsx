import { useParams, Link, useNavigate } from '@/components/visualizers/shared/RouterShim';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Lightbulb, Brain, 
  Play, ChevronLeft, ChevronRight, Hand
} from 'lucide-react';
import { getTopicById, getAllTopics } from '../data/topics';
import { useState, useEffect, useMemo } from 'react';
import useSEO from '../hooks/useSEO';
import ErrorBoundary from '../components/ErrorBoundary';

// Import all visualizer components
import VectorCanvas from '../components/visualizers/VectorCanvas';
import MatrixTransformCanvas from '../components/visualizers/MatrixTransformCanvas';
import DistributionCanvas from '../components/visualizers/DistributionCanvas';
import EigenCanvas from '../components/visualizers/EigenCanvas';

// Topic-specific content components
const TopicVisualizers = {
  'scalars-vectors-matrices': ScalarsVectorsMatricesViz,
  'vector-addition-scaling': VectorAdditionViz,
  'dot-product': DotProductViz,
  'vector-norms': VectorNormsViz,
  'projections-orthogonality': ProjectionsViz,
  'matrix-multiplication': MatrixMultiplicationViz,
  'linear-transformations': LinearTransformationsViz,
  'determinant': DeterminantViz,
  'rank-independence': RankIndependenceViz,
  'eigenvalues-eigenvectors': EigenvaluesViz,
  'eigen-decomposition': EigenDecompositionViz,
  'svd': SVDViz,
  'matrix-inverse': MatrixInverseViz,
  'linear-equations': LinearEquationsViz,
  'gradient-vector': GradientVectorViz,
  'probability-basics': ProbabilityBasicsViz,
  'sample-space-events': SampleSpaceViz,
  'conditional-probability': ConditionalProbabilityViz,
  'bayes-theorem': BayesTheoremViz,
  'random-variables': RandomVariablesViz,
  'probability-distributions': DistributionsViz,
  'expectation-variance': ExpectationVarianceViz,
  'covariance-correlation': CovarianceViz,
  'gaussian-distribution': GaussianViz,
  'multivariate-gaussian': MultivariateGaussianViz,
  'law-large-numbers': LLNViz,
  'central-limit-theorem': CLTViz,
  'entropy-information': EntropyViz,
  'kl-divergence': KLDivergenceViz,
  'likelihood': LikelihoodViz,
};

export default function TopicPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const topic = getTopicById(id);
  const allTopics = useMemo(() => getAllTopics(), []);
  
  const currentIndex = allTopics.findIndex(t => t.id === id);
  const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

  useSEO({
    title: topic?.title || 'Topic',
    description: topic?.description || 'Learn this mathematical concept with interactive visualizations.',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <Link to="/learn" className="btn-primary">
            Back to Learning
          </Link>
        </div>
      </div>
    );
  }

  const VisualizerComponent = TopicVisualizers[id] || DefaultViz;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link 
            to="/learn" 
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Learning
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className={`topic-badge ${
              topic.category === 'linear' ? 'topic-badge-linear' : 'topic-badge-probability'
            }`}>
              {topic.category === 'linear' ? 'Linear Algebra' : 'Probability'}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 capitalize">
              {topic.difficulty}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{topic.title}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            {topic.description}
          </p>
        </motion.header>

        {/* ML Relevance Callout */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="ml-callout mb-12"
        >
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                Why This Matters for ML
              </h3>
              <p className="text-amber-700 dark:text-amber-300">
                {topic.mlRelevance}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Visualization */}
          <div className="glass-card p-6">
            <h2 className="subsection-title flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-primary-500" />
              Interactive Visualization
            </h2>
            <div className="interactive-hint mb-4">
              <Hand className="w-4 h-4" />
              Interact with the visualization to explore
            </div>
            <VisualizerComponent />
          </div>

          {/* Intuition */}
          <div className="space-y-6">
            <div className="intuition-box">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-primary-800 dark:text-primary-200 mb-2">
                    The Key Intuition
                  </h3>
                  <TopicIntuition topicId={id} />
                </div>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="glass-card p-6">
              <h3 className="font-semibold mb-4">Try It Yourself</h3>
              <TopicControls topicId={id} />
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-700"
        >
          {prevTopic ? (
            <Link
              to={`/topic/${prevTopic.id}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
              <div className="text-left">
                <p className="text-xs text-slate-500 dark:text-slate-400">Previous</p>
                <p className="font-medium">{prevTopic.title}</p>
              </div>
            </Link>
          ) : <div />}

          {nextTopic ? (
            <Link
              to={`/topic/${nextTopic.id}`}
              className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group sm:text-right"
            >
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Next</p>
                <p className="font-medium">{nextTopic.title}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500" />
            </Link>
          ) : <div />}
        </motion.div>

        {/* CTA to Playground */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            to="/playground"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Experiment in Playground
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// Topic-specific intuition text
function TopicIntuition({ topicId }) {
  const intuitions = {
    'scalars-vectors-matrices': (
      <p className="text-primary-700 dark:text-primary-300">
        Think of a <strong>scalar</strong> as a single number (like temperature). 
        A <strong>vector</strong> is an arrow pointing somewhere in space — it has both magnitude and direction 
        (like velocity). A <strong>matrix</strong> is a grid of numbers that can transform vectors — 
        it's like a function that takes vectors as input and outputs transformed vectors.
      </p>
    ),
    'vector-addition-scaling': (
      <p className="text-primary-700 dark:text-primary-300">
        Adding vectors is like walking: go in one direction, then another. 
        The result is where you end up! Scaling stretches or shrinks a vector — 
        multiply by 2 to double the length, by 0.5 to halve it.
        Neural networks constantly add scaled vectors together — that's what "weighted sum" means!
      </p>
    ),
    'dot-product': (
      <p className="text-primary-700 dark:text-primary-300">
        The dot product measures how "aligned" two vectors are. When they point the same way, 
        it's large and positive. When perpendicular, it's zero. When opposite, it's negative.
        This is why cosine similarity works — and why attention in transformers uses dot products!
      </p>
    ),
    'matrix-multiplication': (
      <p className="text-primary-700 dark:text-primary-300">
        Matrix multiplication isn't just arithmetic — it's <strong>transformation</strong>. 
        A matrix takes every vector in space and moves it somewhere else, all at once. 
        The columns of the matrix tell you where the basis vectors land. 
        Every neural network layer does exactly this transformation!
      </p>
    ),
    'eigenvalues-eigenvectors': (
      <p className="text-primary-700 dark:text-primary-300">
        Most vectors get rotated and stretched when transformed by a matrix. 
        But <strong>eigenvectors</strong> are special — they only get scaled, not rotated! 
        The scaling factor is the <strong>eigenvalue</strong>. 
        PCA finds these special directions in your data's covariance matrix.
      </p>
    ),
    'gaussian-distribution': (
      <p className="text-primary-700 dark:text-primary-300">
        The bell curve appears everywhere because of the Central Limit Theorem — 
        when you add many independent random things together, you get a Gaussian. 
        That's why we initialize neural network weights with it, and why many natural phenomena follow it!
      </p>
    ),
    'bayes-theorem': (
      <p className="text-primary-700 dark:text-primary-300">
        Bayes' theorem is about updating beliefs with evidence. 
        You start with a prior belief P(A), observe data B, and calculate P(A|B) — 
        your updated belief. This is the foundation of all Bayesian machine learning!
      </p>
    ),
  };

  return intuitions[topicId] || (
    <p className="text-primary-700 dark:text-primary-300">
      Explore this concept through the interactive visualization. 
      Try different parameters and observe how the output changes!
    </p>
  );
}

// Topic-specific controls
function TopicControls({ topicId }) {
  return (
    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
      <p>Use the visualization controls to:</p>
      <ul className="list-disc list-inside space-y-1">
        <li>Drag vectors to see transformations in real-time</li>
        <li>Adjust parameters with sliders</li>
        <li>Observe how changes affect the output</li>
        <li>Connect the visual behavior to the math</li>
      </ul>
    </div>
  );
}

// Default visualization fallback
function DefaultViz() {
  return (
    <div className="flex items-center justify-center h-64 bg-slate-100 dark:bg-slate-800 rounded-xl">
      <p className="text-slate-500">Interactive visualization</p>
    </div>
  );
}

// Scalars, Vectors, and Matrices Visualization
function ScalarsVectorsMatricesViz() {
  const [vector, setVector] = useState({ x: 2, y: 3 });
  const [scalar, setScalar] = useState(1.5);

  const scaledVector = { 
    x: vector.x * scalar, 
    y: vector.y * scalar,
    color: '#f59e0b',
    label: `${scalar}v`
  };

  return (
    <div className="space-y-4">
      <VectorCanvas
        vectors={[
          { x: vector.x, y: vector.y, color: '#3b82f6', label: 'v', draggable: true },
          scaledVector,
        ]}
        interactive={true}
        onVectorChange={(idx, newVec) => {
          if (idx === 0) setVector(newVec);
        }}
        width={350}
        height={300}
        scale={35}
      />
      <div className="space-y-2">
        <label className="slider-label">
          Scalar: {scalar.toFixed(1)}
        </label>
        <input
          type="range"
          min="-2"
          max="3"
          step="0.1"
          value={scalar}
          onChange={(e) => setScalar(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="text-xs text-slate-500">
        Vector v = [{vector.x.toFixed(1)}, {vector.y.toFixed(1)}] → 
        Scaled = [{scaledVector.x.toFixed(1)}, {scaledVector.y.toFixed(1)}]
      </div>
    </div>
  );
}

// Vector Addition Visualization
function VectorAdditionViz() {
  const [v1, setV1] = useState({ x: 2, y: 1 });
  const [v2, setV2] = useState({ x: 1, y: 2 });

  const sum = { x: v1.x + v2.x, y: v1.y + v2.y };

  return (
    <div className="space-y-4">
      <VectorCanvas
        vectors={[
          { x: v1.x, y: v1.y, color: '#ef4444', label: 'a', draggable: true },
          { x: v2.x, y: v2.y, color: '#22c55e', label: 'b', draggable: true },
          { x: v2.x, y: v2.y, startX: v1.x, startY: v1.y, color: '#22c55e66', label: '', draggable: false },
          { x: sum.x, y: sum.y, color: '#f59e0b', label: 'a+b', draggable: false },
        ]}
        interactive={true}
        onVectorChange={(idx, newVec) => {
          if (idx === 0) setV1(newVec);
          if (idx === 1) setV2(newVec);
        }}
        width={350}
        height={300}
        scale={35}
      />
      <div className="formula-box text-xs">
        a + b = [{v1.x.toFixed(1)}, {v1.y.toFixed(1)}] + [{v2.x.toFixed(1)}, {v2.y.toFixed(1)}] = [{sum.x.toFixed(1)}, {sum.y.toFixed(1)}]
      </div>
    </div>
  );
}

// Dot Product Visualization
function DotProductViz() {
  const [v1, setV1] = useState({ x: 3, y: 1 });
  const [v2, setV2] = useState({ x: 1, y: 3 });

  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2);
  const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2);
  const cosAngle = dotProduct / (mag1 * mag2);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);

  return (
    <div className="space-y-4">
      <VectorCanvas
        vectors={[
          { x: v1.x, y: v1.y, color: '#ef4444', label: 'a', draggable: true },
          { x: v2.x, y: v2.y, color: '#22c55e', label: 'b', draggable: true },
        ]}
        interactive={true}
        onVectorChange={(idx, newVec) => {
          if (idx === 0) setV1(newVec);
          if (idx === 1) setV2(newVec);
        }}
        width={350}
        height={300}
        scale={35}
      />
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-500">Dot Product</p>
          <p className="text-xl font-bold text-primary-600">{dotProduct.toFixed(2)}</p>
        </div>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-xs text-slate-500">Angle</p>
          <p className="text-xl font-bold text-accent-600">{angle.toFixed(1)}°</p>
        </div>
      </div>
    </div>
  );
}

// Vector Norms Visualization
function VectorNormsViz() {
  const [vector, setVector] = useState({ x: 3, y: 4 });

  const l1 = Math.abs(vector.x) + Math.abs(vector.y);
  const l2 = Math.sqrt(vector.x ** 2 + vector.y ** 2);
  const lInf = Math.max(Math.abs(vector.x), Math.abs(vector.y));

  return (
    <div className="space-y-4">
      <VectorCanvas
        vectors={[
          { x: vector.x, y: vector.y, color: '#3b82f6', label: 'v', draggable: true },
        ]}
        interactive={true}
        onVectorChange={(idx, newVec) => setVector(newVec)}
        width={350}
        height={300}
        scale={35}
      />
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">L1 (Manhattan)</p>
          <p className="text-lg font-bold">{l1.toFixed(2)}</p>
        </div>
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-green-600 dark:text-green-400">L2 (Euclidean)</p>
          <p className="text-lg font-bold">{l2.toFixed(2)}</p>
        </div>
        <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
          <p className="text-xs text-cyan-600 dark:text-cyan-400">L∞ (Max)</p>
          <p className="text-lg font-bold">{lInf.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

// Projections Visualization
function ProjectionsViz() {
  const [v, setV] = useState({ x: 3, y: 2 });
  const [u, setU] = useState({ x: 4, y: 1 });

  const dot = v.x * u.x + v.y * u.y;
  const magU = u.x ** 2 + u.y ** 2;
  const scalar = dot / magU;
  const proj = { x: scalar * u.x, y: scalar * u.y };

  return (
    <div className="space-y-4">
      <VectorCanvas
        vectors={[
          { x: u.x, y: u.y, color: '#22c55e', label: 'u', draggable: true },
          { x: v.x, y: v.y, color: '#3b82f6', label: 'v', draggable: true },
          { x: proj.x, y: proj.y, color: '#f59e0b', label: 'proj', draggable: false },
          // Line from v to projection
          { x: proj.x, y: proj.y, startX: v.x, startY: v.y, color: '#f59e0b44', width: 1, label: '', draggable: false },
        ]}
        interactive={true}
        onVectorChange={(idx, newVec) => {
          if (idx === 0) setU(newVec);
          if (idx === 1) setV(newVec);
        }}
        width={350}
        height={300}
        scale={35}
      />
      <div className="text-xs text-slate-600 dark:text-slate-400">
        <p>Projection of <span className="text-blue-500">v</span> onto <span className="text-green-500">u</span>:</p>
        <p className="font-mono">proj = ({scalar.toFixed(2)}) × u = [{proj.x.toFixed(2)}, {proj.y.toFixed(2)}]</p>
      </div>
    </div>
  );
}

// Matrix Multiplication Visualization
function MatrixMultiplicationViz() {
  const [matrix, setMatrix] = useState([[1, 0.5], [0, 1]]);

  return (
    <div className="space-y-4">
      <MatrixTransformCanvas
        matrix={matrix}
        animate={true}
        width={350}
        height={300}
        scale={45}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500">a (scale x)</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={matrix[0][0]}
            onChange={(e) => setMatrix([[parseFloat(e.target.value), matrix[0][1]], matrix[1]])}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">b (shear x)</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={matrix[0][1]}
            onChange={(e) => setMatrix([[matrix[0][0], parseFloat(e.target.value)], matrix[1]])}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">c (shear y)</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={matrix[1][0]}
            onChange={(e) => setMatrix([matrix[0], [parseFloat(e.target.value), matrix[1][1]]])}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">d (scale y)</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={matrix[1][1]}
            onChange={(e) => setMatrix([matrix[0], [matrix[1][0], parseFloat(e.target.value)]])}
            className="w-full"
          />
        </div>
      </div>
      <div className="formula-box text-xs text-center">
        M = [{matrix[0][0].toFixed(1)}, {matrix[0][1].toFixed(1)}; {matrix[1][0].toFixed(1)}, {matrix[1][1].toFixed(1)}]
      </div>
    </div>
  );
}

// Linear Transformations Visualization
function LinearTransformationsViz() {
  const [transformType, setTransformType] = useState('rotate');
  const [angle, setAngle] = useState(45);
  const [scale, setScale] = useState(1.5);

  const matrices = {
    rotate: [
      [Math.cos(angle * Math.PI / 180), -Math.sin(angle * Math.PI / 180)],
      [Math.sin(angle * Math.PI / 180), Math.cos(angle * Math.PI / 180)]
    ],
    scale: [[scale, 0], [0, scale]],
    shear: [[1, 0.5], [0, 1]],
    reflect: [[1, 0], [0, -1]],
  };

  return (
    <div className="space-y-4">
      <MatrixTransformCanvas
        matrix={matrices[transformType]}
        animate={true}
        width={350}
        height={280}
        scale={45}
        key={transformType + angle + scale}
      />
      <div className="flex gap-2 flex-wrap">
        {Object.keys(matrices).map(type => (
          <button
            key={type}
            onClick={() => setTransformType(type)}
            className={`px-3 py-1 rounded-lg text-sm capitalize ${
              transformType === type 
                ? 'bg-primary-500 text-white' 
                : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      {transformType === 'rotate' && (
        <div>
          <label className="text-xs text-slate-500">Angle: {angle}°</label>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}
      {transformType === 'scale' && (
        <div>
          <label className="text-xs text-slate-500">Scale: {scale.toFixed(1)}x</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
}

// Determinant Visualization
function DeterminantViz() {
  const [matrix, setMatrix] = useState([[2, 0.5], [0.5, 1.5]]);
  const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  return (
    <div className="space-y-4">
      <MatrixTransformCanvas
        matrix={matrix}
        showUnitSquare={true}
        animate={false}
        width={350}
        height={280}
        scale={50}
      />
      <div className={`p-4 rounded-lg text-center ${det >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
        <p className="text-sm text-slate-600 dark:text-slate-400">Determinant (Area Scale Factor)</p>
        <p className={`text-3xl font-bold ${det >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {det.toFixed(2)}
        </p>
        <p className="text-xs mt-1">
          {det > 0 ? 'Preserves orientation' : det < 0 ? 'Flips orientation' : 'Collapses to line'}
        </p>
      </div>
    </div>
  );
}

// Rank and Independence Visualization  
function RankIndependenceViz() {
  const [v1, setV1] = useState({ x: 2, y: 1 });
  const [v2, setV2] = useState({ x: 1, y: 2 });

  // Check if linearly dependent (parallel)
  const cross = v1.x * v2.y - v1.y * v2.x;
  const isDependent = Math.abs(cross) < 0.01;

  return (
    <div className="space-y-4">
      <VectorCanvas
        vectors={[
          { x: v1.x, y: v1.y, color: '#ef4444', label: 'v₁', draggable: true },
          { x: v2.x, y: v2.y, color: '#22c55e', label: 'v₂', draggable: true },
        ]}
        interactive={true}
        onVectorChange={(idx, newVec) => {
          if (idx === 0) setV1(newVec);
          if (idx === 1) setV2(newVec);
        }}
        width={350}
        height={280}
        scale={40}
      />
      <div className={`p-4 rounded-lg ${isDependent ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}>
        <p className={`font-bold ${isDependent ? 'text-red-600' : 'text-green-600'}`}>
          {isDependent ? 'Linearly Dependent (Rank = 1)' : 'Linearly Independent (Rank = 2)'}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
          {isDependent 
            ? 'These vectors are parallel - they span only a line!' 
            : 'These vectors span the entire 2D plane'}
        </p>
      </div>
    </div>
  );
}

// Eigenvalues Visualization
function EigenvaluesViz() {
  const [matrix, setMatrix] = useState([[2, 1], [1, 2]]);

  return (
    <div className="space-y-4">
      <EigenCanvas
        matrix={matrix}
        animate={true}
        width={350}
        height={300}
        scale={50}
        key={JSON.stringify(matrix)}
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="range"
          min="0"
          max="3"
          step="0.1"
          value={matrix[0][0]}
          onChange={(e) => setMatrix([[parseFloat(e.target.value), matrix[0][1]], matrix[1]])}
          className="w-full"
        />
        <input
          type="range"
          min="-2"
          max="2"
          step="0.1"
          value={matrix[0][1]}
          onChange={(e) => setMatrix([[matrix[0][0], parseFloat(e.target.value)], [parseFloat(e.target.value), matrix[1][1]]])}
          className="w-full"
        />
      </div>
      <p className="text-xs text-slate-500 text-center">
        Adjust the symmetric matrix - red and green are eigenvector directions
      </p>
    </div>
  );
}

// Eigen Decomposition Visualization
function EigenDecompositionViz() {
  return <EigenvaluesViz />;
}

// SVD Visualization
function SVDViz() {
  const [matrix, setMatrix] = useState([[3, 1], [1, 2]]);

  return (
    <div className="space-y-4">
      <MatrixTransformCanvas
        matrix={matrix}
        animate={true}
        width={350}
        height={280}
        scale={45}
      />
      <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
        SVD decomposes any matrix into rotation → scale → rotation.
        <br />
        Watch how the unit circle transforms into an ellipse!
      </p>
    </div>
  );
}

// Matrix Inverse Visualization
function MatrixInverseViz() {
  const [matrix, setMatrix] = useState([[2, 1], [1, 1.5]]);
  const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  const inverse = det !== 0 ? [
    [matrix[1][1] / det, -matrix[0][1] / det],
    [-matrix[1][0] / det, matrix[0][0] / det]
  ] : null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-center mb-2 text-slate-500">Original A</p>
          <MatrixTransformCanvas
            matrix={matrix}
            animate={false}
            width={160}
            height={160}
            scale={30}
          />
        </div>
        <div>
          <p className="text-xs text-center mb-2 text-slate-500">Inverse A⁻¹</p>
          {inverse ? (
            <MatrixTransformCanvas
              matrix={inverse}
              animate={false}
              width={160}
              height={160}
              scale={30}
            />
          ) : (
            <div className="w-40 h-40 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <p className="text-red-500 text-xs">Singular!</p>
            </div>
          )}
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center">
        A × A⁻¹ = Identity (undoes the transformation)
      </p>
    </div>
  );
}

// Linear Equations Visualization
function LinearEquationsViz() {
  return (
    <div className="space-y-4">
      <VectorCanvas
        vectors={[
          { x: 2, y: 1, color: '#ef4444', label: 'eq1' },
          { x: 1, y: 2, color: '#22c55e', label: 'eq2' },
          { x: 1, y: 1, color: '#f59e0b', label: 'solution' },
        ]}
        width={350}
        height={280}
        scale={50}
      />
      <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
        Lines represent equations. Their intersection is the solution!
      </p>
    </div>
  );
}

// Gradient Vector Visualization
function GradientVectorViz() {
  const [pos, setPos] = useState({ x: 1, y: 1 });
  
  // Gradient of f(x,y) = x² + y² points towards origin
  const gradX = -2 * pos.x * 0.3;
  const gradY = -2 * pos.y * 0.3;

  return (
    <div className="space-y-4">
      <VectorCanvas
        vectors={[
          { x: pos.x, y: pos.y, color: '#3b82f6', label: 'pos', draggable: true },
          { x: pos.x + gradX, y: pos.y + gradY, startX: pos.x, startY: pos.y, color: '#ef4444', label: '-∇f' },
        ]}
        interactive={true}
        onVectorChange={(idx, newVec) => {
          if (idx === 0) setPos(newVec);
        }}
        width={350}
        height={280}
        scale={40}
      />
      <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
        Gradient points uphill. Negative gradient points toward minimum!
        <br/>
        This is how gradient descent works.
      </p>
    </div>
  );
}

// Probability Basics Visualization
function ProbabilityBasicsViz() {
  const [samples, setSamples] = useState([]);

  const addSample = () => {
    const sample = Math.random();
    setSamples(prev => [...prev.slice(-50), sample]);
  };

  return (
    <div className="space-y-4">
      <div className="h-64 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 overflow-hidden">
        <div className="h-full flex items-end gap-1">
          {Array.from({ length: 10 }).map((_, bin) => {
            const count = samples.filter(s => s >= bin/10 && s < (bin+1)/10).length;
            const height = Math.min((count / Math.max(samples.length, 1)) * 300, 100);
            return (
              <div
                key={bin}
                className="flex-1 bg-primary-500 rounded-t transition-all duration-300"
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <button onClick={addSample} className="btn-primary text-sm">
          Add Sample
        </button>
        <button onClick={() => setSamples([])} className="btn-secondary text-sm">
          Reset
        </button>
      </div>
      <p className="text-xs text-center text-slate-500">
        Samples: {samples.length} | Uniform distribution converges with more samples
      </p>
    </div>
  );
}

// Sample Space Visualization
function SampleSpaceViz() {
  return <ProbabilityBasicsViz />;
}

// Conditional Probability Visualization
function ConditionalProbabilityViz() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-center">
          <p className="text-xs text-blue-600 dark:text-blue-400">P(A)</p>
          <p className="text-2xl font-bold">0.3</p>
        </div>
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl text-center">
          <p className="text-xs text-green-600 dark:text-green-400">P(B|A)</p>
          <p className="text-2xl font-bold">0.8</p>
        </div>
      </div>
      <div className="p-4 bg-teal-100 dark:bg-teal-900/30 rounded-xl text-center">
        <p className="text-xs text-teal-600 dark:text-teal-400">P(A and B) = P(A) × P(B|A)</p>
        <p className="text-2xl font-bold">0.24</p>
      </div>
    </div>
  );
}

// Bayes Theorem Visualization
function BayesTheoremViz() {
  const [prior, setPrior] = useState(0.1);
  const [likelihood, setLikelihood] = useState(0.9);
  const [falsePositive, setFalsePositive] = useState(0.1);

  const evidence = likelihood * prior + falsePositive * (1 - prior);
  const posterior = (likelihood * prior) / evidence;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
          <p className="text-xs text-slate-500">Prior P(H)</p>
          <p className="font-bold">{(prior * 100).toFixed(0)}%</p>
        </div>
        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
          <p className="text-xs text-slate-500">Likelihood</p>
          <p className="font-bold">{(likelihood * 100).toFixed(0)}%</p>
        </div>
        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded">
          <p className="text-xs text-primary-600">Posterior</p>
          <p className="font-bold text-primary-600">{(posterior * 100).toFixed(1)}%</p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs text-slate-500">Prior: {(prior * 100).toFixed(0)}%</label>
        <input
          type="range"
          min="0.01"
          max="0.5"
          step="0.01"
          value={prior}
          onChange={(e) => setPrior(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

// Random Variables Visualization
function RandomVariablesViz() {
  const [samples, setSamples] = useState([]);

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setSamples(prev => [...prev.slice(-100), roll]);
  };

  const mean = samples.length > 0 
    ? samples.reduce((a, b) => a + b, 0) / samples.length 
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center mb-4">
        {[1, 2, 3, 4, 5, 6].map(val => {
          const count = samples.filter(s => s === val).length;
          return (
            <div key={val} className="text-center">
              <div 
                className="w-10 bg-primary-500 rounded-t transition-all duration-300 mx-auto"
                style={{ height: `${Math.min(count * 3, 100)}px` }}
              />
              <p className="text-xs mt-1">{val}</p>
            </div>
          );
        })}
      </div>
      <button onClick={rollDice} className="btn-primary w-full">
        Roll Dice
      </button>
      <p className="text-xs text-center text-slate-500">
        Rolls: {samples.length} | Mean: {mean.toFixed(2)} (Expected: 3.5)
      </p>
    </div>
  );
}

// Distributions Visualization
function DistributionsViz() {
  const [dist, setDist] = useState('normal');

  return (
    <div className="space-y-4">
      <DistributionCanvas
        distribution={dist}
        params={dist === 'normal' ? { mean: 0, std: 1 } : {}}
        width={350}
        height={250}
        color={dist === 'normal' ? '#8b5cf6' : dist === 'uniform' ? '#22c55e' : '#f59e0b'}
      />
      <div className="flex gap-2 justify-center">
        {['normal', 'uniform', 'exponential'].map(d => (
          <button
            key={d}
            onClick={() => setDist(d)}
            className={`px-3 py-1 rounded text-sm capitalize ${
              dist === d ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

// Expectation and Variance Visualization
function ExpectationVarianceViz() {
  const [std, setStd] = useState(1);

  return (
    <div className="space-y-4">
      <DistributionCanvas
        distribution="normal"
        params={{ mean: 0, std }}
        showMean={true}
        showStd={true}
        width={350}
        height={250}
        color="#8b5cf6"
      />
      <div>
        <label className="text-xs text-slate-500">Standard Deviation (σ): {std.toFixed(1)}</label>
        <input
          type="range"
          min="0.3"
          max="2.5"
          step="0.1"
          value={std}
          onChange={(e) => setStd(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 text-center text-sm">
        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
          <p className="text-xs text-amber-600">Mean (μ)</p>
          <p className="font-bold">0</p>
        </div>
        <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded">
          <p className="text-xs text-cyan-600">Variance (σ²)</p>
          <p className="font-bold">{(std * std).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

// Covariance Visualization
function CovarianceViz() {
  const [correlation, setCorrelation] = useState(0.7);

  return (
    <div className="space-y-4">
      <div className="h-64 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 relative overflow-hidden">
        {/* Scatter plot simulation */}
        {Array.from({ length: 50 }).map((_, i) => {
          const x = Math.random() * 2 - 1;
          const noise = (Math.random() - 0.5) * 2 * (1 - Math.abs(correlation));
          const y = x * correlation + noise;
          return (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary-500 rounded-full"
              style={{
                left: `${50 + x * 40}%`,
                top: `${50 - y * 40}%`,
              }}
            />
          );
        })}
      </div>
      <div>
        <label className="text-xs text-slate-500">Correlation (ρ): {correlation.toFixed(2)}</label>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.05"
          value={correlation}
          onChange={(e) => setCorrelation(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

// Gaussian Distribution Visualization
function GaussianViz() {
  const [mean, setMean] = useState(0);
  const [std, setStd] = useState(1);

  return (
    <div className="space-y-4">
      <DistributionCanvas
        distribution="normal"
        params={{ mean, std }}
        showMean={true}
        showStd={true}
        width={350}
        height={250}
        color="#8b5cf6"
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500">Mean (μ): {mean.toFixed(1)}</label>
          <input
            type="range"
            min="-2"
            max="2"
            step="0.1"
            value={mean}
            onChange={(e) => setMean(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">Std (σ): {std.toFixed(1)}</label>
          <input
            type="range"
            min="0.3"
            max="2"
            step="0.1"
            value={std}
            onChange={(e) => setStd(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

// Multivariate Gaussian Visualization
function MultivariateGaussianViz() {
  return (
    <div className="space-y-4">
      <div className="h-64 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-radial from-primary-500/50 to-transparent" />
      </div>
      <p className="text-xs text-center text-slate-500">
        Multivariate Gaussian: Contours show equal probability density
      </p>
    </div>
  );
}

// Law of Large Numbers Visualization
function LLNViz() {
  const [samples, setSamples] = useState([]);
  const [running, setRunning] = useState(false);

  const addSamples = () => {
    const newSamples = Array.from({ length: 10 }, () => Math.random());
    setSamples(prev => [...prev, ...newSamples]);
  };

  const runningMean = samples.length > 0
    ? samples.reduce((a, b) => a + b, 0) / samples.length
    : 0;

  return (
    <div className="space-y-4">
      <div className="h-48 bg-slate-50 dark:bg-slate-800 rounded-xl p-4 relative">
        {/* Running mean visualization */}
        <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-amber-500" />
        <div 
          className="absolute left-0 right-0 border-t-2 border-primary-500 transition-all duration-300"
          style={{ top: `${50 - (runningMean - 0.5) * 80}%` }}
        />
        <p className="absolute bottom-2 right-2 text-xs text-slate-500">
          True mean: 0.5 | Running: {runningMean.toFixed(4)}
        </p>
      </div>
      <button onClick={addSamples} className="btn-primary w-full">
        Add 10 Samples (n = {samples.length})
      </button>
    </div>
  );
}

// Central Limit Theorem Visualization
function CLTViz() {
  const [sampleSize, setSampleSize] = useState(1);
  const [means, setMeans] = useState([]);

  const generateMeans = () => {
    const newMeans = Array.from({ length: 100 }, () => {
      const samples = Array.from({ length: sampleSize }, () => Math.random());
      return samples.reduce((a, b) => a + b, 0) / sampleSize;
    });
    setMeans(newMeans);
  };

  return (
    <div className="space-y-4">
      <div className="h-48 bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
        <div className="h-full flex items-end gap-0.5">
          {Array.from({ length: 20 }).map((_, bin) => {
            const low = 0 + bin * 0.05;
            const high = low + 0.05;
            const count = means.filter(m => m >= low && m < high).length;
            return (
              <div
                key={bin}
                className="flex-1 bg-primary-500 rounded-t transition-all duration-300"
                style={{ height: `${(count / means.length) * 300}%` }}
              />
            );
          })}
        </div>
      </div>
      <div>
        <label className="text-xs text-slate-500">Sample Size (n): {sampleSize}</label>
        <input
          type="range"
          min="1"
          max="50"
          value={sampleSize}
          onChange={(e) => setSampleSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      <button onClick={generateMeans} className="btn-primary w-full">
        Generate 100 Sample Means
      </button>
      <p className="text-xs text-center text-slate-500">
        As n increases, distribution of means becomes Gaussian!
      </p>
    </div>
  );
}

// Entropy Visualization
function EntropyViz() {
  const [p, setP] = useState(0.5);
  const entropy = p > 0 && p < 1 
    ? -(p * Math.log2(p) + (1-p) * Math.log2(1-p))
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-8">
        <div 
          className="w-20 bg-primary-500 rounded transition-all duration-300"
          style={{ height: `${p * 150}px` }}
        />
        <div 
          className="w-20 bg-accent-500 rounded transition-all duration-300"
          style={{ height: `${(1-p) * 150}px` }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm text-slate-500">Entropy (uncertainty)</p>
        <p className="text-3xl font-bold text-primary-600">{entropy.toFixed(3)} bits</p>
      </div>
      <div>
        <label className="text-xs text-slate-500">P(heads): {p.toFixed(2)}</label>
        <input
          type="range"
          min="0.01"
          max="0.99"
          step="0.01"
          value={p}
          onChange={(e) => setP(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}

// KL Divergence Visualization
function KLDivergenceViz() {
  const [qMean, setQMean] = useState(0.5);

  return (
    <div className="space-y-4">
      <DistributionCanvas
        distribution="normal"
        params={{ mean: 0, std: 1 }}
        width={350}
        height={200}
        color="#3b82f6"
      />
      <DistributionCanvas
        distribution="normal"
        params={{ mean: qMean, std: 1 }}
        width={350}
        height={200}
        color="#ef4444"
      />
      <div>
        <label className="text-xs text-slate-500">Q distribution mean: {qMean.toFixed(1)}</label>
        <input
          type="range"
          min="-2"
          max="2"
          step="0.1"
          value={qMean}
          onChange={(e) => setQMean(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <p className="text-xs text-center text-slate-500">
        Blue = P (true), Red = Q (model). KL measures how different they are.
      </p>
    </div>
  );
}

// Likelihood Visualization
function LikelihoodViz() {
  const [data] = useState([1.2, 0.8, 1.5, 0.9, 1.1]);
  const [mu, setMu] = useState(1);

  const logLikelihood = data.reduce((sum, x) => {
    return sum - 0.5 * Math.pow(x - mu, 2);
  }, 0);

  return (
    <div className="space-y-4">
      <DistributionCanvas
        distribution="normal"
        params={{ mean: mu, std: 0.5 }}
        samples={data}
        showSamples={true}
        width={350}
        height={250}
        color="#8b5cf6"
      />
      <div>
        <label className="text-xs text-slate-500">μ (model parameter): {mu.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.05"
          value={mu}
          onChange={(e) => setMu(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded text-center">
        <p className="text-xs text-slate-500">Log-Likelihood</p>
        <p className="text-xl font-bold">{logLikelihood.toFixed(2)}</p>
      </div>
    </div>
  );
}
