'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  FlaskConical
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
      'The model is unable to process floating-point numbers.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Without bias (b), when all input features x are zero, z must equal zero. The bias term shifts the activation curve independently of inputs, allowing the model to fit data that does not cross the origin.'
  },
  {
    id: 4,
    category: 'Inference Mechanics',
    question: 'What is the exact behavioral effect of setting an LLM’s sampling temperature to 0.0?',
    options: [
      'It shuts down model computation to save electrical power.',
      'It causes the model to always select the single highest-probability token (Greedy Argmax decoding), making outputs deterministic.',
      'It forces the model to search the web for external citations.',
      'It doubles the maximum context window of the model.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Setting temperature to 0 eliminates stochastic sampling, causing the model to greedily pick the argmax token at each step. This produces deterministic, repeatable outputs.'
  },
  {
    id: 5,
    category: 'Generalization & Reliability',
    question: 'A machine learning model achieves 99.8% accuracy on its training dataset, but drops to 61.2% accuracy on fresh production user queries. What has occurred?',
    options: [
      'The model is underfitting due to insufficient training epochs.',
      'Overfitting: the model memorized idiosyncrasies and noise in the training set rather than learning generalizable patterns.',
      'The learning rate was set too low during inference.',
      'The model ran out of tokens in its context window.'
    ],
    correctIndex: 1,
    explanation: 'Correct! A large divergence between training accuracy and validation/production accuracy is the classic symptom of overfitting (high variance). The model failed to generalize.'
  },
  {
    id: 6,
    category: 'AI Engineering Systems',
    question: 'Why do AI Engineers use schema validation libraries (like Pydantic or Zod) to constrain LLM outputs in production software?',
    options: [
      'To speed up GPU matrix multiplication by 10x.',
      'To bound non-deterministic probabilistic text generation into strict, typed, deterministic data contracts for backend services.',
      'To reduce the token price charged by model providers.',
      'To automatically fine-tune the model parameters in real time.'
    ],
    correctIndex: 1,
    explanation: 'Correct! Downstream software cannot reliably parse free-form, probabilistic natural language. Schema validation enforces valid JSON types (e.g. integers, enums, required fields), guaranteeing reliability.'
  },
  {
    id: 7,
    category: 'Engineering Roles',
    question: 'Which of the following responsibilities most accurately characterizes the role of an AI Engineer (AIE) as distinct from an ML Engineer (MLE)?',
    options: [
      'Writing custom CUDA kernels and distributed PyTorch multi-node cluster training scripts.',
      'Building production application software, RAG context pipelines, tool-calling agents, and automated evaluation suites around foundation models.',
      'Deriving mathematical convergence proofs for stochastic gradient descent.',
      'Collecting raw biological training datasets in research labs.'
    ],
    correctIndex: 1,
    explanation: 'Correct! AI Engineers specialize in application-layer architecture: context construction, RAG, agent orchestration, structured outputs, prompt security, and regression evals on foundation models.'
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

export function FoundationProblems() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Lifecycle & Compute', 'Parameters vs Hyperparameters', 'Model Architecture', 'Inference Mechanics', 'Generalization & Reliability', 'AI Engineering Systems', 'Engineering Roles', 'Tokenization & Inputs', 'Production Failure Modes', 'Architecture Tradeoffs'];

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/aicosmos/learn/ai-engineering-foundations"
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--ai-muted)] hover:text-[var(--ai-primary)] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Foundations Curriculum
        </Link>
        <span className="font-mono text-xs px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          KNOWLEDGE CHECK &bull; 10 PROBLEMS
        </span>
      </div>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--ai-primary)] uppercase tracking-wider font-semibold">
            Certification Arena
          </span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-[var(--ai-text)] tracking-tight">
          Mental Model Knowledge Check
        </h1>
        <p className="text-base sm:text-lg text-[var(--ai-muted)] max-w-2xl leading-relaxed">
          Test whether you have mastered the core definitions, parameter mechanics, compute tradeoffs, and failure modes of AI Engineering before moving into mathematics and neural networks.
        </p>
      </header>

      {/* Progress & Score Bar */}
      <div className="rounded-2xl border border-[var(--ai-border)] bg-[var(--ai-surface)] p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-mono text-[var(--ai-muted)] uppercase tracking-wider">Your Progress:</div>
          <div className="text-lg font-bold font-mono text-[var(--ai-text)]">
            Answered: <span className="text-[var(--ai-primary)]">{answeredCount}</span> of {QUESTIONS.length} &bull; Score: <span className="text-emerald-400">{correctCount}</span> correct
          </div>
        </div>

        <div className="flex items-center gap-3">
          {answeredCount > 0 && (
            <button
              onClick={resetQuiz}
              className="px-3.5 py-2 rounded-xl text-xs font-mono border border-white/10 text-[var(--ai-muted)] hover:text-[var(--ai-text)] hover:border-white/20 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Quiz
            </button>
          )}
          <div className="px-4 py-2 rounded-xl bg-[var(--ai-primary)]/10 border border-[var(--ai-primary)]/30 font-mono text-sm font-bold text-[var(--ai-primary)]">
            {answeredCount === 0 ? '0%' : `${Math.round((correctCount / answeredCount) * 100)}% Accuracy`}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-8">
        {filteredQuestions.map((q) => {
          const selected = selectedAnswers[q.id];
          const isAnswered = selected !== undefined;
          const isCorrect = selected === q.correctIndex;

          return (
            <section
              key={q.id}
              className={`rounded-2xl border p-6 sm:p-8 space-y-6 transition-all duration-200 ${
                isAnswered
                  ? isCorrect
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-rose-500/40 bg-rose-500/5'
                  : 'border-[var(--ai-border-subtle)] bg-[var(--ai-surface)]'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-[var(--ai-primary)] px-2 py-0.5 rounded bg-[var(--ai-primary)]/10 border border-[var(--ai-primary)]/20">
                    PROBLEM {String(q.id).padStart(2, '0')} &bull; {q.category.toUpperCase()}
                  </span>
                  <h2 className="font-display font-bold text-lg sm:text-xl text-[var(--ai-text)] pt-2 leading-snug">
                    {q.question}
                  </h2>
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selected === optIdx;
                  const isThisCorrect = optIdx === q.correctIndex;

                  let styleClass =
                    'border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] text-[var(--ai-muted)] hover:text-[var(--ai-text)] hover:border-[var(--ai-border)]';

                  if (isAnswered) {
                    if (isThisCorrect) {
                      styleClass =
                        'border-emerald-500/80 bg-emerald-500/15 text-emerald-200 font-semibold shadow-sm';
                    } else if (isThisSelected && !isThisCorrect) {
                      styleClass =
                        'border-rose-500/80 bg-rose-500/15 text-rose-200 font-semibold';
                    } else {
                      styleClass =
                        'border-transparent bg-white/5 text-[var(--ai-muted)] opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() =>
                        setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                      }
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-sans transition-all flex items-start gap-3 ${styleClass}`}
                    >
                      <span className="font-mono text-xs opacity-60 mt-0.5 shrink-0">
                        [{String.fromCharCode(65 + optIdx)}]
                      </span>
                      <span className="flex-1 leading-relaxed">{option}</span>
                      {isAnswered && isThisCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isThisSelected && !isThisCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {isAnswered && (
                <div
                  className={`p-4 sm:p-5 rounded-xl border text-xs sm:text-sm leading-relaxed font-sans ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                      : 'border-rose-500/30 bg-rose-500/10 text-rose-200'
                  }`}
                >
                  <div className="font-mono text-xs font-bold uppercase mb-1">
                    {isCorrect ? '✓ Correct Rationale:' : '✕ Incorrect Rationale:'}
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
        <section className="rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-8 sm:p-10 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--ai-text)]">
              Foundations Knowledge Check Completed!
            </h2>
            <p className="text-sm text-[var(--ai-muted)] max-w-lg mx-auto">
              You scored <strong>{correctCount} out of {QUESTIONS.length}</strong> ({Math.round((correctCount / QUESTIONS.length) * 100)}%). Your mental models for AI Engineering are verified and ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/aicosmos/ai-engineering-foundations/lab"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-mono font-bold text-white hover:bg-emerald-500 transition-colors shadow-md"
            >
              <FlaskConical className="w-4 h-4" /> Open The Micro-Model Studio
            </Link>
            <Link
              href="/aicosmos/learn"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[var(--ai-surface)] px-5 py-3 text-xs font-mono font-bold text-[var(--ai-text)] hover:border-white/20 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[var(--ai-primary)]" /> Continue to Next AI Subject
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
