'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  BookOpen,
  Sliders,
  ArrowRight
} from 'lucide-react';

interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'Lifecycle & Compute',
    question: 'Why does model inference typically require significantly less memory (VRAM) and compute than training the same model?',
    options: [
      'Inference operates on smaller batch sizes and never computes backward pass gradients or optimizer states.',
      'Inference automatically reduces the parameter count of the model by 50%.',
      'Inference converts floating-point weights into rule-based conditional if/else code.',
      'Inference runs only on CPU while training runs on GPUs.'
    ],
    correctIndex: 0,
    explanation: 'Correct! Training requires storing activations, computing backward pass gradients, and tracking optimizer states (e.g. Adam momentum buffers), requiring 3x–4x more VRAM. Inference is read-only forward execution with frozen weights.'
  },
  {
    id: 2,
    category: 'Parameters vs Hyperparameters',
    question: 'Which of the following is an internal learned parameter, rather than an engineer-configured hyperparameter?',
    options: [
      'The learning rate passed to the Adam optimizer.',
      'The weight matrix connecting Layer 1 to Layer 2 in a neural network.',
      'The sampling temperature set in an LLM completion API call.',
      'The batch size used during model gradient updates.'
    ],
    correctIndex: 1,
    explanation: 'Correct! The weight matrix is learned by the optimization algorithm through gradient descent. Learning rates, batch sizes, and temperature are hyperparameters configured by human engineers.'
  },
  {
    id: 3,
    category: 'Model Architecture',
    question: 'What fundamental mathematical limitation arises if a linear neuron lacks a bias term (i.e. z = w * x instead of z = w * x + b)?',
    options: [
      'The model can only compute negative numbers.',
      'The decision boundary is forced to pass through the origin (0, 0) whenever x = 0.',
      'The activation function fails to calculate a gradient.',
      'The model requires 2x more floating-point operations per second (FLOPS).'
    ],
    correctIndex: 1,
    explanation: 'Correct! Without a bias term b, when input x = 0, z = w * 0 = 0 regardless of the weight value. A bias offset allows the decision boundary to shift freely along the axis.'
  },
  {
    id: 4,
    category: 'Inference Mechanics',
    question: 'What happens mathematically when you set the sampling temperature to 0.0 in an autoregressive Large Language Model?',
    options: [
      'The model executes pure greedy decoding (argmax), deterministically selecting the single token with the highest predicted probability.',
      'The model randomly samples uniformly across the entire vocabulary without weighting.',
      'The model turns off all neural network weights and executes a regex search.',
      'The model shuts down the GPU to conserve power.'
    ],
    correctIndex: 0,
    explanation: 'Correct! As temperature approaches 0, the softmax probability distribution collapses into a one-hot distribution, ensuring repeatable deterministic outputs where the top-ranked token is chosen every time.'
  },
  {
    id: 5,
    category: 'Generalization & Reliability',
    question: 'What is the root cause of model "overfitting" during empirical training?',
    options: [
      'The server runs out of GPU memory during the forward pass.',
      'The model memorizes noise and specific idiosyncrasies in the training set rather than learning generalizable underlying patterns, failing on unseen evaluation data.',
      'The learning rate is set to exactly 0.0.',
      'The dataset is too large for the model parameters to store.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Overfitting occurs when model capacity exceeds dataset complexity, allowing the optimization algorithm to minimize training loss to near zero by fitting random noise rather than generalizable signals.'
  },
  {
    id: 6,
    category: 'AI Engineering Systems',
    question: 'What is the primary difference between a classical Software 1.0 architecture and a Software 2.0 (AI/ML) architecture?',
    options: [
      'Software 1.0 is written in Python; Software 2.0 is written in HTML.',
      'Software 1.0 executes explicit human-authored deterministic instructions; Software 2.0 optimizes continuous mathematical weight parameters from empirical data.',
      'Software 2.0 does not require computer hardware to execute.',
      'Software 1.0 cannot communicate over computer networks.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Software 1.0 is defined by human-written logic (if/else, loops). Software 2.0 specifies the program implicitly through dataset curation, loss functions, and optimization search.'
  },
  {
    id: 7,
    category: 'Engineering Roles',
    question: 'What is the core distinction between an AI Researcher and an AI Engineer?',
    options: [
      'Researchers write Python; AI Engineers only write HTML.',
      'Researchers focus on novel model architectures, loss formulations, and mathematical benchmarks; AI Engineers integrate, serve, evaluate, and scale models into reliable production software systems.',
      'Researchers build mobile apps; AI Engineers manage databases.',
      'AI Engineers only use prompt engineering without writing code.'
    ],
    correctIndex: 1,
    explanation: 'Correct! AI Researchers push the frontier of algorithmic capabilities. AI Engineers turn those models into resilient, low-latency, deterministic software products with observability, evals, and caching.'
  },
  {
    id: 8,
    category: 'Tokenization & Inputs',
    question: 'What is a "token" in modern Large Language Models?',
    options: [
      'An encrypted cryptographic password used to access the database.',
      'A sub-word textual chunk (averaging ~4 English characters or ~0.75 words) mapped to a unique integer ID in a fixed vocabulary.',
      'A complete paragraph of text.',
      'A physical microchip inside the GPU memory cluster.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Modern LLMs use sub-word tokenizers (such as Byte-Pair Encoding or WordPiece). Words are split into common fragments, each assigned a discrete integer ID.'
  },
  {
    id: 9,
    category: 'Production Failure Modes',
    question: 'What is "Distribution Shift" (or Data Drift) in production AI systems?',
    options: [
      'When the user changes their operating system from Linux to macOS.',
      'When the statistical distribution of real-world inputs encountered in production differs significantly from the data distribution used during training.',
      'When the database disk space exceeds 90% utilization.',
      'When the model provider raises their API pricing.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Distribution shift occurs when consumer behavior, language slang, market conditions, or sensor hardware change over time, rendering the model’s learned patterns inaccurate.'
  },
  {
    id: 10,
    category: 'Architecture Tradeoffs',
    question: 'In which scenario is an on-premise Local AI deployment (e.g. Llama 3 via vLLM) strictly preferable over a proprietary Cloud AI API (e.g. OpenAI/Anthropic)?',
    options: [
      'When you want zero hardware capital expense and elastic scaling without managing servers.',
      'When handling strictly confidential, air-gapped corporate data with zero external data transmission mandates and predictable high-volume request loads.',
      'When you have no engineering staff to manage Linux server infrastructure.',
      'When you require the highest possible frontier reasoning benchmark scores regardless of cost.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Local/self-hosted AI provides 100% data sovereignty, zero external data leakage, and fixed hardware amortized costs at massive scale, making it ideal for air-gapped or HIPAA/GDPR-sensitive workflows.'
  }
];

interface FoundationProblemsProps {
  basePath?: string;
}

export function FoundationProblems({ basePath = '/ai/ai-engineering-foundations' }: FoundationProblemsProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Lifecycle & Compute',
    'Parameters vs Hyperparameters',
    'Model Architecture',
    'Inference Mechanics',
    'Generalization & Reliability',
    'AI Engineering Systems',
    'Engineering Roles',
    'Tokenization & Inputs',
    'Production Failure Modes',
    'Architecture Tradeoffs'
  ];

  const filteredQuestions = QUESTIONS.filter(
    (q) => activeCategory === 'All' || q.category === activeCategory
  );

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([qid, ans]) => QUESTIONS.find((q) => q.id === parseInt(qid))?.correctIndex === ans
  ).length;

  const resetQuiz = () => {
    setSelectedAnswers({});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Top Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4 text-xs font-mono text-muted-foreground">
        <Link
          href={basePath}
          className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Foundations Matrix
        </Link>
        <span className="font-semibold text-foreground">
          // CERTIFICATION_01 &bull; 10 SCENARIOS
        </span>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="rounded border border-border bg-secondary/50 px-2.5 py-0.5 text-xs font-mono text-muted-foreground">
            AUDIT BENCH 01
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight font-display">
          Foundations Knowledge Check
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Audit your comprehension of fundamental parameter mechanics, memory hierarchies, compute tradeoffs, and failure modes before progressing to neural networks and deep learning.
        </p>
      </header>

      {/* Progress & Score Bar */}
      <div className="rounded-xl border border-border/80 bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Audit Progress:</div>
          <div className="text-base font-bold font-mono text-foreground">
            Answered: <span>{answeredCount}</span> / {QUESTIONS.length} &bull; Correct: <span className="text-emerald-500">{correctCount}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {answeredCount > 0 && (
            <button
              onClick={resetQuiz}
              className="px-3 py-1.5 rounded-lg border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:border-foreground/30 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset Quiz
            </button>
          )}
          <div className="px-3.5 py-1.5 rounded-lg border border-border bg-secondary/40 font-mono text-xs font-bold text-foreground">
            {answeredCount === 0 ? '0%' : `${Math.round((correctCount / answeredCount) * 100)}% Accuracy`}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'border-foreground bg-foreground text-background font-bold'
                : 'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = selected !== undefined;
          const isCorrect = selected === q.correctIndex;

          return (
            <section
              key={q.id}
              className={`rounded-xl border p-6 space-y-5 transition-colors ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-secondary/20'
                    : 'border-rose-500/40 bg-secondary/20'
                  : 'border-border/80 bg-card'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">
                    // SCENARIO_{String(q.id).padStart(2, '0')} &bull; {q.category.toUpperCase()}
                  </span>
                  <h2 className="font-display font-bold text-base sm:text-lg text-foreground pt-1 leading-snug">
                    {q.question}
                  </h2>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let styleClass =
                    'border-border/80 bg-secondary/30 text-muted-foreground hover:text-foreground hover:border-foreground/30';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      styleClass =
                        'border-emerald-500 text-foreground font-semibold bg-emerald-500/10';
                    } else if (isThisSelected && !isThisCorrect) {
                      styleClass =
                        'border-rose-500 text-foreground font-semibold bg-rose-500/10';
                    } else {
                      styleClass =
                        'border-transparent bg-secondary/10 text-muted-foreground opacity-40';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() =>
                        setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                      }
                      className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm font-sans transition-colors flex items-start gap-3 ${styleClass}`}
                    >
                      <span className="font-mono text-xs opacity-60 mt-0.5 shrink-0">
                        [{String.fromCharCode(65 + optIdx)}]
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {isAnswered && isThisCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isThisSelected && !isThisCorrect && (
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-lg border text-xs sm:text-sm leading-relaxed font-sans ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-secondary/30 text-foreground'
                      : 'border-rose-500/30 bg-secondary/30 text-foreground'
                  }`}
                >
                  <div className="font-mono text-xs font-bold uppercase mb-1">
                    {isCorrect ? '✓ Architectural Rationale:' : '✕ Engineering Diagnostic:'}
                  </div>
                  {q.explanation}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Completion Banner */}
      {answeredCount === QUESTIONS.length && (
        <section className="rounded-xl border border-border/80 bg-card p-8 text-center space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-widest">
              CERTIFICATION COMPLETE
            </span>
            <h2 className="font-display font-black text-2xl text-foreground">
              Score: {correctCount} / {QUESTIONS.length} ({Math.round((correctCount / QUESTIONS.length) * 100)}%)
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Your mental models for foundational parameter mechanics, deterministic inference, and memory layouts have been audited and verified.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={`${basePath}/lab`}
              className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-xs font-mono font-bold text-background hover:bg-foreground/90 transition-colors"
            >
              <Sliders className="h-4 w-4" /> Open Micro-Model Studio
            </Link>
            <Link
              href="/ai/python-for-ai-engineering"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-4 py-2.5 text-xs font-mono font-bold text-foreground hover:bg-secondary/70 transition-colors"
            >
              <BookOpen className="h-4 w-4" /> Next Subject: Python for AI &rarr;
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
