export interface FoundationSubtopic {
  id: string;
  number: number;
  title: string;
  category: 'Core Mental Models' | 'Lifecycle & Roles' | 'Parameters & Mechanics' | 'Systems & Reliability' | 'Pipeline Projects';
  definition: string;
  keyPoints: string[];
  analogy: string;
  pitfall: string;
  codeSnippet: string;
  visualization:
    | 'ai-taxonomy'
    | 'rule-vs-learned'
    | 'representation'
    | 'generative-sampling'
    | 'math-function'
    | 'generalization'
    | 'next-token'
    | 'system-architecture'
    | 'roles-matrix'
    | 'lifecycle-stepper'
    | 'data-pipeline'
    | 'training-vs-inference'
    | 'tensor-inspector'
    | 'hyperparameters'
    | 'weight-slider'
    | 'bias-slider'
    | 'features-vector'
    | 'ground-truth'
    | 'softmax-distribution'
    | 'input-flow'
    | 'probabilistic-dice'
    | 'failure-modes'
    | 'tools-radar'
    | 'cloud-vs-local'
    | 'pipeline-stepper'
    | 'pipeline-capstone';
}

export const foundationSubtopics: FoundationSubtopic[] = [
  {
    id: 'what-is-artificial-intelligence',
    number: 1,
    title: 'What is Artificial Intelligence?',
    category: 'Core Mental Models',
    definition: 'Artificial Intelligence is the broad engineering discipline of constructing computer systems capable of performing cognitive tasks historically associated with biological intelligence, such as visual perception, natural language comprehension, sound synthesis, decision-making, and multi-step reasoning.',
    keyPoints: [
      'AI is an overarching field and destination, not a singular algorithm or math formula.',
      'Includes symbolic reasoning, expert rule engines, heuristic search, and statistical machine learning.',
      'Modern AI focuses primarily on empirical representations learned from large datasets rather than hardcoded hand-written logic.'
    ],
    analogy: 'AI is like "aviation" — it includes gliders, propellers, jet airliners, and rockets. Some use simple aerodynamics; others require rocket engines, but all aim to achieve flight.',
    pitfall: 'Equating AI solely with generative LLMs like ChatGPT, ignoring 70 years of deterministic algorithms, search trees, and classical ML.',
    codeSnippet: `// Symbolic Rule-Based AI vs Learned AI
function ruleBasedSentiment(text: string): 'POS' | 'NEG' {
  const positiveWords = ['excellent', 'superb', 'great'];
  return positiveWords.some(w => text.toLowerCase().includes(w)) ? 'POS' : 'NEG';
}`,
    visualization: 'ai-taxonomy'
  },
  {
    id: 'ai-vs-machine-learning',
    number: 2,
    title: 'AI vs Machine Learning',
    category: 'Core Mental Models',
    definition: 'Artificial Intelligence is the broad objective of synthetic intelligence; Machine Learning is a specific paradigm where computational systems learn optimal parameters directly from empirical data rather than executing human-authored conditional rules.',
    keyPoints: [
      'Traditional Programming: Rules + Data = Answers.',
      'Machine Learning: Data + Answers = Learned Rules (Model Parameters).',
      'Machine learning models improve task performance metrics automatically through experience.'
    ],
    analogy: 'Traditional programming is giving a chef a strict step-by-step recipe. Machine learning is showing a chef 10,000 photos of great dishes until they understand culinary balance themselves.',
    pitfall: 'Writing brittle nested if/else statements for edge cases when an empirical statistical model is required.',
    codeSnippet: `// The Machine Learning Inversion
// Traditional: output = f(input, rules)
// Machine Learning: parameters = train(inputs, targets)`,
    visualization: 'rule-vs-learned'
  },
  {
    id: 'machine-learning-vs-deep-learning',
    number: 3,
    title: 'Machine Learning vs Deep Learning',
    category: 'Core Mental Models',
    definition: 'Deep Learning is a specialized subfield of Machine Learning based on multi-layered Artificial Neural Networks that automatically discover hierarchical feature representations directly from raw data, bypassing manual feature engineering.',
    keyPoints: [
      'Classical ML requires human engineers to manually craft feature vectors (e.g. edge detectors, word counts).',
      'Deep Learning learns intermediate representations: early layers learn low-level primitives (edges, phonemes); deeper layers learn abstract concepts (faces, semantics).',
      'Deep learning scales effectively with compute and massive parameter counts.'
    ],
    analogy: 'Classical ML is giving a student handcrafted formula sheets; Deep Learning is giving the student a blank neural network and letting them develop their own internal mental abstractions.',
    pitfall: 'Using complex deep neural networks for simple tabular data when classical algorithms (XGBoost, Random Forests) perform better with 100x less compute.',
    codeSnippet: `# Deep Learning representation hierarchy
# Layer 1: Edges & Gradients
# Layer 2: Textures & Shapes
# Layer 3: Object Parts
# Output: Class Probabilities`,
    visualization: 'representation'
  },
  {
    id: 'what-is-generative-ai',
    number: 4,
    title: 'What is Generative AI?',
    category: 'Core Mental Models',
    definition: 'Generative AI refers to probabilistic models that learn the underlying joint probability distribution P(X) of training data, allowing them to sample and synthesize brand-new realistic artifacts (text, code, images, audio, 3D assets) conditioned on a prompt.',
    keyPoints: [
      'Discriminative models estimate P(Y|X) — classifying or predicting a label given inputs.',
      'Generative models estimate P(X) or P(X|Context) — synthesizing new instances from a learned distribution.',
      'Generation involves stochastic decoding (temperature, top-p nucleus sampling).'
    ],
    analogy: 'A discriminative model is an art critic judging whether a painting is genuine; a generative model is the painter painting a brand-new original canvas in that style.',
    pitfall: 'Expecting generative outputs to be fully deterministic without explicitly setting temperature to 0 and locking random seeds.',
    codeSnippet: `// Sampling from learned probability distribution
const nextToken = sampleDistribution(logits, { temperature: 0.7, topP: 0.9 });`,
    visualization: 'generative-sampling'
  },
  {
    id: 'what-is-an-ai-model',
    number: 5,
    title: 'What is an AI Model?',
    category: 'Core Mental Models',
    definition: 'An AI model is a serialized mathematical function f_theta(x) with fixed numerical parameter tensors (theta) discovered through training, designed to map arbitrary input representations (x) into predicted outputs (y).',
    keyPoints: [
      'A model is just a static artifact (weights, bias vectors, computational graph definition).',
      'The model is NOT the entire application: it requires parsers, tokenizers, APIs, storage, and validation scaffolding.',
      'Once deployed, inference runs the model with fixed, immutable parameters.'
    ],
    analogy: 'An AI model is an engine block sitting on a test bench. To turn it into a car, you need the chassis, fuel lines, steering wheel, brakes, and safety airbags (AI Engineering).',
    pitfall: 'Confusing model capability with application reliability. An 80B model can still fail without robust prompt sanitization and fallback handlers.',
    codeSnippet: `// Pure mathematical function
// y = f(x; W, b) = activation(W * x + b)`,
    visualization: 'math-function'
  },
  {
    id: 'what-is-a-machine-learning-model',
    number: 6,
    title: 'What is a Machine Learning Model?',
    category: 'Core Mental Models',
    definition: 'A Machine Learning model is a trained algorithmic artifact whose internal configuration parameters were optimized against an objective loss function on historical data, evaluated specifically on its ability to generalize to unseen data.',
    keyPoints: [
      'Training minimizes empirical risk on training samples.',
      'Generalization evaluates performance on held-out validation/test distributions.',
      'Overfitting occurs when a model memorizes noise rather than true underlying patterns.'
    ],
    analogy: 'Memorizing the exact answers to last year’s exam versus understanding the principles so you can solve completely new exam questions.',
    pitfall: 'Evaluating a model on data it already saw during training (data leakage), producing artificially inflated accuracy scores.',
    codeSnippet: `// Generalization Error = Test Loss - Training Loss`,
    visualization: 'generalization'
  },
  {
    id: 'what-is-an-llm',
    number: 7,
    title: 'What is an LLM?',
    category: 'Core Mental Models',
    definition: 'A Large Language Model is an autoregressive Transformer neural network with billions of parameters trained on vast corpora of text to iteratively predict the probability distribution of the next token given preceding context tokens.',
    keyPoints: [
      'Text is chopped into sub-word tokens (~4 characters per token).',
      'Next-token prediction: P(w_t | w_1, w_2, ..., w_{t-1}).',
      'Emergent capabilities (reasoning, code synthesis, translation) arise from scale, compute, and architectural depth.'
    ],
    analogy: 'The world’s most sophisticated predictive autocomplete: having read all public literature, it understands human knowledge and context well enough to continue ideas coherently.',
    pitfall: 'Assuming LLMs possess feelings, sentience, or internal consciousness rather than high-dimensional statistical pattern matching.',
    codeSnippet: `// Autoregressive token generation loop
while (!isStopToken(token)) {
  const logits = model.forward(contextTokens);
  token = sample(logits);
  contextTokens.push(token);
}`,
    visualization: 'next-token'
  },
  {
    id: 'what-is-ai-engineering',
    number: 8,
    title: 'What is AI Engineering?',
    category: 'Core Mental Models',
    definition: 'AI Engineering is the applied discipline of architecting, integrating, securing, evaluating, deploying, and maintaining reliable production software systems powered by foundational AI models and multi-agent workflows.',
    keyPoints: [
      'Bridges the gap between raw model checkpoints and resilient production products.',
      'Centers on context construction, structured outputs, prompt security, latency/cost budgets, and evals.',
      'Treats models as non-deterministic probabilistic dependencies that must be bounded by deterministic software constraints.'
    ],
    analogy: 'If model researchers invent electricity, AI engineers build the power grid, appliances, circuit breakers, and household wall outlets.',
    pitfall: 'Treating AI engineering as just calling an API, neglecting schema validation, latency budgets, semantic caching, and regression evals.',
    codeSnippet: `// AI Engineering: Bounding probabilistic models with deterministic code
const response = await callLLM(prompt);
const validatedData = UserProfileSchema.parse(JSON.parse(response)); // Deterministic contract`,
    visualization: 'system-architecture'
  },
  {
    id: 'ai-vs-ml-engineer-vs-data-scientist',
    number: 9,
    title: 'AI Engineer vs ML Engineer vs Data Scientist',
    category: 'Lifecycle & Roles',
    definition: 'While these engineering titles collaborate on data-driven systems, they focus on distinct domains: Data Scientists extract insights and formulate hypotheses; ML Engineers train and deploy custom models; AI Engineers build production user-facing software on top of foundation models.',
    keyPoints: [
      'Data Scientist: Statistics, exploratory analysis, hypothesis validation, business insights.',
      'ML Engineer (MLE): Custom training, PyTorch, GPU clustering, feature stores, model quantization, MLOps.',
      'AI Engineer (AIE): Application software, LLM orchestration, RAG pipelines, autonomous agents, schema enforcement, evals.'
    ],
    analogy: 'Data Scientists explore the terrain and find oil; ML Engineers build the refineries to extract fuel; AI Engineers build the jet aircraft that runs on that fuel.',
    pitfall: 'Hiring a deep-learning researcher when what your business actually needs is an AI engineer to integrate RAG and schema-validated tool calling.',
    codeSnippet: `// Roles Matrix
// Data Scientist -> Model / Insight
// ML Engineer    -> Weights / Training / Cuda
// AI Engineer    -> Product / Context / Evals`,
    visualization: 'roles-matrix'
  },
  {
    id: 'ai-engineering-pipeline',
    number: 10,
    title: 'The AI Engineering Pipeline',
    category: 'Lifecycle & Roles',
    definition: 'The comprehensive production lifecycle that transforms raw business data and operational requirements into monitored, resilient AI-driven software.',
    keyPoints: [
      '7 Key Stages: Ingestion ➔ Data Prep ➔ Model Selection ➔ Evaluation ➔ Deployment ➔ Observability ➔ Continuous Iteration.',
      'Feedback loops are continuous: production hallucinations become new regression test cases.',
      'Evaluations gate deployments like automated unit tests.'
    ],
    analogy: 'A closed-loop aerospace assembly line with wind-tunnel testing, avionics validation, black-box flight recording, and continuous telemetry.',
    pitfall: 'Deploying an AI app without automated evaluation gates, letting subtle prompt regressions degrade production accuracy unnoticed.',
    codeSnippet: `// Pipeline Gates
Ingest -> Preprocess -> Retrieve Context -> Model Inference -> Validate Schema -> Evals & Logging`,
    visualization: 'lifecycle-stepper'
  },
  {
    id: 'data-model-inference',
    number: 11,
    title: 'Data → Model → Inference',
    category: 'Lifecycle & Roles',
    definition: 'The fundamental transformation pipeline of computing with AI: Raw Data informs Model Training, producing a frozen Model Artifact, which executes Inference on fresh user queries.',
    keyPoints: [
      'Data: Ground truth historical observations that shape parameter distributions.',
      'Model: The mathematical function whose parameters capture regularities in the data.',
      'Inference: The real-time application of that model to new inputs.'
    ],
    analogy: 'Raw cocoa beans (Data) ➔ chocolate recipe molding (Model creation) ➔ serving chocolate bars to store customers (Inference).',
    pitfall: 'Blaming model architecture when the underlying root cause is contaminated, mislabeled, or biased training data (garbage in, garbage out).',
    codeSnippet: `// Data -> Model -> Inference
const model = train(trainingData);       // Offline, compute-heavy
const result = model.predict(userInput); // Online, low-latency`,
    visualization: 'data-pipeline'
  },
  {
    id: 'training-vs-inference',
    number: 12,
    title: 'Training vs Inference',
    category: 'Lifecycle & Roles',
    definition: 'Training is the asynchronous, compute-intensive optimization phase that calculates gradients and updates parameter weights; Inference is the synchronous, read-only phase that runs inputs through frozen weights to generate predictions.',
    keyPoints: [
      'Training requires forward pass, loss calculation, backward pass (gradients), and optimizer weight updates.',
      'Inference only requires forward pass with no gradient calculation (requires significantly less VRAM).',
      'Training latency is measured in days/weeks; inference latency is measured in milliseconds.'
    ],
    analogy: 'Studying 4 years at university (Training) versus answering a customer phone inquiry on the job (Inference).',
    pitfall: 'Allocating training-sized memory buffers during production inference (e.g. not disabling gradient tracking with torch.no_grad()).',
    codeSnippet: `# PyTorch Inference Safety
with torch.no_grad(): # Disable gradient memory
    outputs = model(inputs)`,
    visualization: 'training-vs-inference'
  },
  {
    id: 'parameters',
    number: 13,
    title: 'Parameters',
    category: 'Parameters & Mechanics',
    definition: 'Parameters are internal numerical values (weights and biases arranged in multi-dimensional tensor arrays) that the learning algorithm automatically adjusts during optimization to minimize prediction loss.',
    keyPoints: [
      'Parameters constitute the learned knowledge of the model.',
      'Stored as floating-point tensors (FP32, FP16, BF16, INT8, INT4).',
      'A 70-Billion parameter model holds 70,000,000,000 distinct floating-point numbers.'
    ],
    analogy: 'Millions of internal microscopically precise tuning knobs inside a jet engine that automatically dial into balance.',
    pitfall: 'Confusing internal learned model parameters with developer-set configuration hyperparameters.',
    codeSnippet: `// Parameter Footprint:
// 7B params * 2 bytes (FP16) = ~14 GB VRAM baseline`,
    visualization: 'tensor-inspector'
  },
  {
    id: 'hyperparameters',
    number: 14,
    title: 'Hyperparameters',
    category: 'Parameters & Mechanics',
    definition: 'Hyperparameters are external configuration choices established by engineers prior to model execution or training that govern the learning process and inference sampling behavior.',
    keyPoints: [
      'Training hyperparameters: Learning rate, batch size, epochs, weight decay, optimizer type.',
      'Inference hyperparameters: Temperature, top-p, max tokens, frequency penalty, presence penalty.',
      'Hyperparameters are not learned via backpropagation; they are selected through experimentation.'
    ],
    analogy: 'The thermostat temperature setting in a classroom (hyperparameter) versus what knowledge the students absorb (parameters).',
    pitfall: 'Setting temperature too high in production workflows requiring deterministic JSON parsing.',
    codeSnippet: `const inferenceConfig = {
  temperature: 0.2, // Low for consistency
  top_p: 0.95,
  max_tokens: 1024
};`,
    visualization: 'hyperparameters'
  },
  {
    id: 'weights',
    number: 15,
    title: 'Weights',
    category: 'Parameters & Mechanics',
    definition: 'Weights are individual numerical coefficients within a parameter tensor that determine the amplification, attenuation, or polarity of input signals passing between connected nodes.',
    keyPoints: [
      'Positive weight: excitatory connection (increases output signal).',
      'Negative weight: inhibitory connection (suppresses output signal).',
      'Weight near zero: input feature has negligible effect on the prediction.'
    ],
    analogy: 'Volume sliders on a soundboard: sliding one instrument up amplifies its voice in the mix, while turning another down mutes it.',
    pitfall: 'Poor weight initialization causing vanishing or exploding gradients during deep network backpropagation.',
    codeSnippet: `// Weighted Sum
// z = w1*x1 + w2*x2 + ... + wn*xn`,
    visualization: 'weight-slider'
  },
  {
    id: 'bias',
    number: 16,
    title: 'Bias',
    category: 'Parameters & Mechanics',
    definition: "A bias is an additive learned parameter that shifts a model's activation curve left, right, up, or down independently of the weighted input contributions, allowing the model to fit data that does not pass through the origin.",
    keyPoints: [
      'Without bias, a linear neuron must pass through the origin (0,0) when all inputs are 0.',
      'Acts as a learned activation threshold: determines baseline firing likelihood.',
      'Distinct from sociological or demographic bias.'
    ],
    analogy: 'The baseline water pressure in a faucet when nobody is turning the handle.',
    pitfall: 'Forgetting to include a bias term, forcing linear decision boundaries to intersect (0,0) and severely restricting representational capacity.',
    codeSnippet: `// Linear Neuron Equation
const z = (weight * x) + bias;`,
    visualization: 'bias-slider'
  },
  {
    id: 'features',
    number: 17,
    title: 'Features',
    category: 'Parameters & Mechanics',
    definition: 'Features are quantitative, measurable numerical attributes or learned vector embeddings extracted from raw input entities that serve as explanatory variables for model computation.',
    keyPoints: [
      'Tabular features: Age, income, transaction amount, latitude.',
      'Text features: Sub-word token IDs, dense 1536-dimensional embeddings.',
      'Feature normalization (scaling to [0, 1] or Z-score standard deviation) prevents large values from dominating gradients.'
    ],
    analogy: 'The specific clues a doctor measures (blood pressure, temperature, heart rate) to determine a patient’s diagnosis.',
    pitfall: 'Feeding unnormalized features with radically different scales (e.g. income in $100,000s vs age in 10s) into gradient-based optimizers.',
    codeSnippet: `// Feature Normalization (Min-Max)
const normalized = (x - min) / (max - min);`,
    visualization: 'features-vector'
  },
  {
    id: 'labels',
    number: 18,
    title: 'Labels',
    category: 'Parameters & Mechanics',
    definition: 'A label is the ground truth target value or desired outcome associated with an example in supervised learning, against which model predictions are scored.',
    keyPoints: [
      'Classification labels: Categorical classes (e.g. "Spam" vs "Ham", "Positive" vs "Negative").',
      'Regression labels: Continuous numerical targets (e.g. house price, wait time).',
      'Unsupervised learning operates without explicit labels.'
    ],
    analogy: 'The teacher’s answer key at the back of a math textbook.',
    pitfall: 'Label noise: inconsistent or contradictory labels created by human raters degrade model ceiling accuracy.',
    codeSnippet: `// Supervised dataset pair: [features, groundTruthLabel]
const sample = { features: [0.82, 0.45], label: 1 };`,
    visualization: 'ground-truth'
  },
  {
    id: 'predictions',
    number: 19,
    title: 'Predictions',
    category: 'Parameters & Mechanics',
    definition: 'A prediction is the finalized computed output generated by an AI model for an input, frequently expressed as normalized probabilities across candidates or continuous score tensors.',
    keyPoints: [
      'Raw model outputs (logits) are converted to probabilities using Softmax or Sigmoid functions.',
      'Argmax selects the highest probability candidate.',
      'Calibration measures whether a 90% confidence prediction is actually correct 90% of the time.'
    ],
    analogy: 'A weather forecaster stating: "There is an 82% probability of rain in Seattle tomorrow."',
    pitfall: 'Treating model confidence as a proof of factual accuracy: a hallucinating LLM can assign 99% confidence to a fabricated claim.',
    codeSnippet: `// Softmax to probability
const probabilities = softmax(logits);
const predictedClass = argmax(probabilities);`,
    visualization: 'softmax-distribution'
  },
  {
    id: 'what-happens-when-model-receives-input',
    number: 20,
    title: 'What happens when an AI model receives input?',
    category: 'Systems & Reliability',
    definition: 'The internal execution journey of an AI query: text tokenization, tensor embedding, multi-layer forward propagation matrix multiplications, non-linear activations, and output decoding.',
    keyPoints: [
      '1. Tokenization: Text converted to numeric token ID sequence.',
      '2. Embedding Lookup: Token IDs mapped to high-dimensional continuous vectors.',
      '3. Forward Pass: Layer-by-layer matrix multiplication and attention calculations.',
      '4. Decoding: Softmax logit sampling converts top tokens back to readable text string.'
    ],
    analogy: 'Translating English to Morse code ➔ routing pulses through telephone switches ➔ decoding pulses back into audible speech.',
    pitfall: 'Overlooking tokenization artifacts (e.g. numbers or trailing whitespace behaving differently across tokenizers).',
    codeSnippet: `// Input Pipeline
User Prompt -> Tokenizer -> Embedding Tensor -> Transformer Layers -> Logits -> Detokenize -> Stream`,
    visualization: 'input-flow'
  },
  {
    id: 'deterministic-vs-probabilistic-systems',
    number: 21,
    title: 'Deterministic vs Probabilistic Systems',
    category: 'Systems & Reliability',
    definition: 'Deterministic systems always produce the exact same output given the identical initial state and input; probabilistic AI systems represent uncertainty and sample outputs from a probability distribution.',
    keyPoints: [
      'Traditional databases and compilers are deterministic: 2 + 2 is always 4.',
      'LLMs and neural networks are fundamentally probabilistic: each generation samples tokens based on context.',
      'AI engineering designs deterministic guardrails and validation schemas to contain probabilistic outputs.'
    ],
    analogy: 'A calculator (deterministic — always gives the exact same result) versus rolling a weighted 20-sided die (probabilistic — predictable distributions, but individual roll is uncertain).',
    pitfall: 'Expecting probabilistic LLMs to behave like deterministic SQL databases without schema validation or retry loops.',
    codeSnippet: `// Deterministic: f(x) === f(x) always
// Probabilistic: f(x) ~ P(Y|x)`,
    visualization: 'probabilistic-dice'
  },
  {
    id: 'why-ai-makes-mistakes',
    number: 22,
    title: 'Why AI sometimes makes mistakes',
    category: 'Systems & Reliability',
    definition: 'The systematic root causes of AI failure: hallucinations, training distribution shift, adversarial prompt injection, ambiguity, and lossy compression of knowledge in parameter weights.',
    keyPoints: [
      'Hallucination: Model generates syntactically fluent text with false factual claims.',
      'Distribution Shift: Real-world inputs differ from training data distributions.',
      'Context Length Degradation: "Lost in the Middle" attention degradation in long prompts.'
    ],
    analogy: 'An eager student guessing on a test question they never studied: they write very confident-sounding paragraphs, but the underlying facts are completely fabricated.',
    pitfall: 'Assuming newer or larger models have zero hallucinations without implementing automated verification and RAG citation checks.',
    codeSnippet: `// Guardrail against hallucination
if (!groundedInContext(response, retrievedDocuments)) {
  fallbackToHumanReview();
}`,
    visualization: 'failure-modes'
  },
  {
    id: 'ai-engineering-tools',
    number: 23,
    title: 'AI Engineering tools',
    category: 'Systems & Reliability',
    definition: 'The modern 2026 AI systems engineering ecosystem spanning orchestration frameworks, schema validators, vector databases, local model runners, and automated evaluation platforms.',
    keyPoints: [
      'Orchestration & Structured Outputs: Pydantic, Zod, Instructor, LangGraph.',
      'Retrieval & Vector Search: Qdrant, Pinecone, Chroma, pgvector.',
      'Inference & Serving: vLLM, Ollama, TensorRT-LLM, LiteLLM.',
      'Observability & Evals: LangSmith, Arize Phoenix, Braintrust, DeepEval.'
    ],
    analogy: 'A carpenter’s workshop: you need measuring tapes (evals), vises (schema guardrails), fast saws (serving engines), and blueprints (orchestration).',
    pitfall: 'Adopting heavy wrapper libraries before understanding the raw API calls and schema validation fundamentals.',
    codeSnippet: `// Modern AI Engineering Stack
import { z } from 'zod';
import { QdrantClient } from '@qdrant/js-client-rest';`,
    visualization: 'tools-radar'
  },
  {
    id: 'local-ai-vs-cloud-ai',
    number: 24,
    title: 'Local AI vs Cloud AI',
    category: 'Systems & Reliability',
    definition: 'The architectural tradeoff between running open-weight models on self-hosted local hardware versus invoking managed proprietary foundation model APIs in cloud datacenters.',
    keyPoints: [
      'Cloud AI (OpenAI, Anthropic, Gemini): Frontier reasoning, zero hardware maintenance, elastic scaling; high per-token cost, data privacy concerns.',
      'Local AI (Llama, Mistral on vLLM/Ollama): 100% data privacy, predictable cost, zero external API latency, works offline; limited by GPU VRAM.',
      'Enterprise Hybrid: Light routing models run locally; complex reasoning routes to cloud.'
    ],
    analogy: 'Cooking your own food in your kitchen (Local AI — privacy, fixed appliance cost) versus ordering gourmet delivery from top restaurants (Cloud AI — supreme quality, paid per meal).',
    pitfall: 'Underestimating the VRAM and operational maintenance required to host 70B+ parameter models locally at production scale.',
    codeSnippet: `// Hybrid Routing Pattern
if (containsPII(query)) {
  return localOllamaModel.generate(query);
} else {
  return cloudFrontierModel.generate(query);
}`,
    visualization: 'cloud-vs-local'
  },
  {
    id: 'first-tiny-ai-pipeline',
    number: 25,
    title: 'Build your first tiny AI pipeline',
    category: 'Pipeline Projects',
    definition: 'Connecting raw input, string normalization, numerical feature extraction, linear model scoring, and decision boundary thresholding into a transparent, observable pipeline.',
    keyPoints: [
      'Pipeline: Input ➔ Feature Extractor ➔ Model Math ➔ Threshold Decision.',
      'Every intermediate mathematical state must be logged and inspectable.',
      'Establishes the architecture for complex neural network and RAG pipelines.'
    ],
    analogy: 'Building a miniature wooden waterwheel before constructing a hydro-electric Hoover Dam.',
    pitfall: 'Failing to log intermediate states, making pipeline debugging an exercise in guesswork.',
    codeSnippet: `export function tinyPipeline(rawText: string, weight = 1.4, bias = -0.3) {
  const charLength = rawText.trim().length;
  const x = Math.min(1, charLength / 100); // Feature extraction
  const z = (weight * x) + bias;          // Model parameter math
  const probability = 1 / (1 + Math.exp(-z)); // Sigmoid activation
  return { input: rawText, x, z, probability, prediction: probability > 0.5 ? 'POSITIVE' : 'NEGATIVE' };
}`,
    visualization: 'pipeline-stepper'
  },
  {
    id: 'tiny-ai-pipeline-project',
    number: 26,
    title: 'Mini Project: Input → Processing → Model → Prediction',
    category: 'Pipeline Projects',
    definition: 'The hands-on capstone for AI Engineering Foundations: an interactive pipeline studio where learners manipulate parameters, activations, and thresholds to observe live predictions.',
    keyPoints: [
      'Real-time reactive pipeline execution.',
      'Direct slider control of weights, bias, and threshold.',
      'Inspectable transformation at every single stage.'
    ],
    analogy: 'A glass-cased concept car where every piston, gear, and electrical circuit is visible while driving.',
    pitfall: 'Skipping the capstone and jumping straight into neural networks without mastering the intuition of weights, bias, and thresholding.',
    codeSnippet: `// Capstone Pipeline State
const pipelineState = runPipeline({ input, weight, bias, activation, threshold });`,
    visualization: 'pipeline-capstone'
  }
];

export const getFoundationSubtopic = (id: string) => foundationSubtopics.find(t => t.id === id);

export const foundationCategories = [
  'All',
  'Core Mental Models',
  'Lifecycle & Roles',
  'Parameters & Mechanics',
  'Systems & Reliability',
  'Pipeline Projects'
] as const;
