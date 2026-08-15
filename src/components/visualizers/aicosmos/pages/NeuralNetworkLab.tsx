'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  Network, 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  Sparkles, 
  TrendingDown, 
  Activity,
  ArrowRight,
  Info,
  ChevronRight
} from 'lucide-react';

type ActivationType = 'relu' | 'sigmoid' | 'tanh' | 'gelu';
type DatasetType = 'xor' | 'circle' | 'linear' | 'moons';

interface DataPoint {
  x: number;
  y: number;
  label: number; // 0 or 1
}

export function NeuralNetworkLab() {
  const [learningRate, setLearningRate] = useState<number>(0.15);
  const [activation, setActivation] = useState<ActivationType>('relu');
  const [datasetType, setDatasetType] = useState<DatasetType>('xor');
  const [hiddenNeurons, setHiddenNeurons] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [epoch, setEpoch] = useState<number>(0);
  const [lossHistory, setLossHistory] = useState<number[]>([]);
  const [currentLoss, setCurrentLoss] = useState<number>(0.5);
  const [selectedNeuron, setSelectedNeuron] = useState<{ layer: number; index: number } | null>(null);

  // Network weights & biases
  // Layer 1: 2 inputs -> hiddenNeurons
  // Layer 2: hiddenNeurons -> 1 output
  const [w1, setW1] = useState<number[][]>([]);
  const [b1, setB1] = useState<number[]>([]);
  const [w2, setW2] = useState<number[]>([]);
  const [b2, setB2] = useState<number>(0);

  // Canvas ref for decision boundary
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate Synthetic Datasets
  const dataset: DataPoint[] = useMemo(() => {
    const points: DataPoint[] = [];
    const n = 60;

    if (datasetType === 'xor') {
      for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * 2;
        const y = (Math.random() - 0.5) * 2;
        const label = (x > 0 && y > 0) || (x < 0 && y < 0) ? 1 : 0;
        points.push({ x: x + (Math.random() - 0.5) * 0.1, y: y + (Math.random() - 0.5) * 0.1, label });
      }
    } else if (datasetType === 'circle') {
      for (let i = 0; i < n; i++) {
        const r = Math.random();
        const theta = Math.random() * 2 * Math.PI;
        if (r < 0.5) {
          points.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 0 });
        } else {
          points.push({ x: (0.7 + r * 0.3) * Math.cos(theta), y: (0.7 + r * 0.3) * Math.sin(theta), label: 1 });
        }
      }
    } else if (datasetType === 'linear') {
      for (let i = 0; i < n; i++) {
        const x = (Math.random() - 0.5) * 2;
        const y = (Math.random() - 0.5) * 2;
        const label = x + y > 0.1 ? 1 : 0;
        points.push({ x, y, label });
      }
    } else if (datasetType === 'moons') {
      for (let i = 0; i < n / 2; i++) {
        const theta = Math.random() * Math.PI;
        points.push({ x: Math.cos(theta) * 0.6 - 0.3, y: Math.sin(theta) * 0.6 - 0.2, label: 0 });
      }
      for (let i = 0; i < n / 2; i++) {
        const theta = Math.random() * Math.PI;
        points.push({ x: -Math.cos(theta) * 0.6 + 0.3, y: -Math.sin(theta) * 0.6 + 0.2, label: 1 });
      }
    }

    return points;
  }, [datasetType]);

  // Initialize weights
  const resetWeights = () => {
    // Xavier / He uniform initialization
    const initialW1: number[][] = [];
    for (let i = 0; i < 2; i++) {
      const row: number[] = [];
      for (let j = 0; j < hiddenNeurons; j++) {
        row.push((Math.random() - 0.5) * Math.sqrt(6 / 2));
      }
      initialW1.push(row);
    }
    const initialB1 = new Array(hiddenNeurons).fill(0);
    const initialW2 = new Array(hiddenNeurons).fill(0).map(() => (Math.random() - 0.5) * Math.sqrt(6 / hiddenNeurons));
    const initialB2 = 0;

    setW1(initialW1);
    setB1(initialB1);
    setW2(initialW2);
    setB2(initialB2);
    setEpoch(0);
    setLossHistory([]);
    setCurrentLoss(0.5);
    setIsPlaying(false);
  };

  useEffect(() => {
    resetWeights();
  }, [hiddenNeurons, datasetType]);

  // Activation function math
  const act = (z: number): number => {
    if (activation === 'relu') return Math.max(0, z);
    if (activation === 'sigmoid') return 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, z))));
    if (activation === 'tanh') return Math.tanh(z);
    if (activation === 'gelu') return 0.5 * z * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (z + 0.044715 * Math.pow(z, 3))));
    return z;
  };

  const actDeriv = (z: number, a: number): number => {
    if (activation === 'relu') return z > 0 ? 1 : 0;
    if (activation === 'sigmoid') return a * (1 - a);
    if (activation === 'tanh') return 1 - a * a;
    if (activation === 'gelu') {
      const c = Math.sqrt(2 / Math.PI);
      const tanhTerm = Math.tanh(c * (z + 0.044715 * Math.pow(z, 3)));
      return 0.5 * (1 + tanhTerm) + 0.5 * z * (1 - tanhTerm * tanhTerm) * c * (1 + 3 * 0.044715 * z * z);
    }
    return 1;
  };

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-Math.max(-15, Math.min(15, z))));

  // Forward Pass for a single point [x1, x2]
  const forwardPass = (x: number, y: number, currentW1: number[][], currentB1: number[], currentW2: number[], currentB2: number) => {
    const z1: number[] = [];
    const a1: number[] = [];

    for (let j = 0; j < hiddenNeurons; j++) {
      const val = (x * (currentW1[0]?.[j] ?? 0)) + (y * (currentW1[1]?.[j] ?? 0)) + (currentB1[j] ?? 0);
      z1.push(val);
      a1.push(act(val));
    }

    let z2 = currentB2;
    for (let j = 0; j < hiddenNeurons; j++) {
      z2 += a1[j] * (currentW2[j] ?? 0);
    }
    const a2 = sigmoid(z2); // Output binary classification [0, 1]

    return { z1, a1, z2, a2 };
  };

  // Perform single training step (Backpropagation & Gradient Descent)
  const trainStep = () => {
    if (w1.length === 0) return;

    let totalLoss = 0;
    const dW1: number[][] = [[...new Array(hiddenNeurons).fill(0)], [...new Array(hiddenNeurons).fill(0)]];
    const dB1: number[] = new Array(hiddenNeurons).fill(0);
    const dW2: number[] = new Array(hiddenNeurons).fill(0);
    let dB2 = 0;

    // Accumulate gradients over dataset
    for (const pt of dataset) {
      const { z1, a1, a2 } = forwardPass(pt.x, pt.y, w1, b1, w2, b2);

      // Binary Cross Entropy Loss: -[y log(a2) + (1-y) log(1-a2)]
      const eps = 1e-7;
      const loss = -(pt.label * Math.log(a2 + eps) + (1 - pt.label) * Math.log(1 - a2 + eps));
      totalLoss += loss;

      // Output gradient dL/dz2 = (a2 - y) for sigmoid + BCE
      const dZ2 = a2 - pt.label;

      // Hidden to output gradients
      for (let j = 0; j < hiddenNeurons; j++) {
        dW2[j] += dZ2 * a1[j];
      }
      dB2 += dZ2;

      // Backprop into hidden layer
      for (let j = 0; j < hiddenNeurons; j++) {
        const dZ1 = (dZ2 * w2[j]) * actDeriv(z1[j], a1[j]);
        dW1[0][j] += dZ1 * pt.x;
        dW1[1][j] += dZ1 * pt.y;
        dB1[j] += dZ1;
      }
    }

    const n = dataset.length;
    const avgLoss = totalLoss / n;

    // Gradient Descent Update
    const newW1 = w1.map((row, rIdx) => row.map((w, cIdx) => w - (learningRate * dW1[rIdx][cIdx]) / n));
    const newB1 = b1.map((b, idx) => b - (learningRate * dB1[idx]) / n);
    const newW2 = w2.map((w, idx) => w - (learningRate * dW2[idx]) / n);
    const newB2 = b2 - (learningRate * dB2) / n;

    setW1(newW1);
    setB1(newB1);
    setW2(newW2);
    setB2(newB2);
    setEpoch((prev) => prev + 1);
    setCurrentLoss(avgLoss);
    setLossHistory((prev) => [...prev.slice(-40), avgLoss]);
  };

  // Continuous training animation loop
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const loop = () => {
        trainStep();
        animId = requestAnimationFrame(loop);
      };
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, w1, b1, w2, b2, dataset, learningRate, activation]);

  // Render 2D Decision Boundary Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || w1.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // Scan grid space [-1.2, 1.2]
    const stepX = 2.4 / width;
    const stepY = 2.4 / height;

    for (let py = 0; py < height; py += 2) {
      const y = 1.2 - py * stepY;
      for (let px = 0; px < width; px += 2) {
        const x = -1.2 + px * stepX;
        const { a2 } = forwardPass(x, y, w1, b1, w2, b2);

        // Interpolate color: a2 -> 0 (Cyan/Blue #06b6d4) vs 1 (Indigo/Violet #6366f1)
        const r = Math.floor(6 + a2 * (99 - 6));
        const g = Math.floor(182 + a2 * (102 - 182));
        const b = Math.floor(212 + a2 * (241 - 212));

        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            if (px + dx < width && py + dy < height) {
              const idx = ((py + dy) * width + (px + dx)) * 4;
              data[idx] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = 75; // Soft opacity for background contour
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Draw axis lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw dataset points
    dataset.forEach((pt) => {
      const px = ((pt.x + 1.2) / 2.4) * width;
      const py = ((1.2 - pt.y) / 2.4) * height;

      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      if (pt.label === 1) {
        ctx.fillStyle = '#6366f1';
        ctx.strokeStyle = '#ffffff';
      } else {
        ctx.fillStyle = '#06b6d4';
        ctx.strokeStyle = '#ffffff';
      }
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
    });
  }, [w1, b1, w2, b2, dataset]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--ai-border-subtle)] pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 rounded-full border border-[var(--ai-border)] bg-[var(--ai-primary)]/10 px-3 py-1 text-xs font-mono font-semibold text-[var(--ai-primary)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Deep Learning Sandbox &bull; Real-Time Backpropagation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--ai-text)]">
            Neural Network <span className="text-[var(--ai-primary)] ai-glow">Backpropagation Lab</span>
          </h1>
          <p className="text-xs sm:text-sm text-[var(--ai-muted)] leading-relaxed">
            Observe the chain rule of calculus in action. Step through forward activation passes, compute binary cross-entropy loss, and propagate analytical partial derivatives &part;L/&part;W to update synaptic weights in real-time.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
              isPlaying
                ? 'bg-[var(--ai-rose)] text-white hover:opacity-90'
                : 'bg-[var(--ai-primary)] text-white hover:bg-[var(--ai-primary-hover)]'
            }`}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? 'Pause Training' : 'Train Network'}</span>
          </button>

          <button
            onClick={trainStep}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-[var(--ai-border)] bg-[var(--ai-surface)] text-xs font-bold text-[var(--ai-text)] hover:bg-[var(--ai-surface-2)] disabled:opacity-50 transition-colors"
          >
            <Activity className="h-3.5 w-3.5 text-[var(--ai-cyan)]" />
            <span>Step (1 Epoch)</span>
          </button>

          <button
            onClick={resetWeights}
            className="p-2.5 rounded-lg border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-[var(--ai-muted)] hover:text-[var(--ai-text)] hover:border-[var(--ai-border)] transition-colors"
            title="Reset Network Weights"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Hyperparameters Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] text-xs">
        {/* Dataset Choice */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase text-[var(--ai-muted)] font-bold">Dataset Shape</label>
          <select
            value={datasetType}
            onChange={(e) => setDatasetType(e.target.value as DatasetType)}
            className="w-full rounded-lg border border-[var(--ai-border)] bg-[var(--ai-surface-2)] px-2.5 py-1.5 text-xs text-[var(--ai-text)] focus:outline-none focus:border-[var(--ai-primary)]"
          >
            <option value="xor">XOR Non-Linear Problem</option>
            <option value="circle">Concentric Circles</option>
            <option value="moons">Two Intertwined Moons</option>
            <option value="linear">Linearly Separable</option>
          </select>
        </div>

        {/* Activation Function */}
        <div className="space-y-1.5">
          <label className="font-mono text-[10px] uppercase text-[var(--ai-muted)] font-bold">Activation Function</label>
          <select
            value={activation}
            onChange={(e) => setActivation(e.target.value as ActivationType)}
            className="w-full rounded-lg border border-[var(--ai-border)] bg-[var(--ai-surface-2)] px-2.5 py-1.5 text-xs text-[var(--ai-text)] focus:outline-none focus:border-[var(--ai-primary)]"
          >
            <option value="relu">ReLU (Rectified Linear)</option>
            <option value="sigmoid">Sigmoid &sigma;(z)</option>
            <option value="tanh">Hyperbolic Tangent tanh(z)</option>
            <option value="gelu">GELU (Gaussian Error)</option>
          </select>
        </div>

        {/* Hidden Neurons */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-[10px] uppercase text-[var(--ai-muted)] font-bold">
            <span>Hidden Layer Neurons</span>
            <span className="text-[var(--ai-primary)]">{hiddenNeurons}</span>
          </div>
          <input
            type="range"
            min={2}
            max={8}
            step={1}
            value={hiddenNeurons}
            onChange={(e) => setHiddenNeurons(Number(e.target.value))}
            className="w-full accent-[var(--ai-primary)] cursor-pointer"
          />
        </div>

        {/* Learning Rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-[10px] uppercase text-[var(--ai-muted)] font-bold">
            <span>Learning Rate (&alpha;)</span>
            <span className="text-[var(--ai-cyan)]">{learningRate.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.01}
            max={0.5}
            step={0.01}
            value={learningRate}
            onChange={(e) => setLearningRate(Number(e.target.value))}
            className="w-full accent-[var(--ai-cyan)] cursor-pointer"
          />
        </div>
      </div>

      {/* Main Dual Grid: Synaptic Graph vs 2D Decision Boundary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Interactive Synapse Architecture Diagram */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6 space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-4">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-[var(--ai-primary)]" />
              <span className="font-bold text-xs uppercase tracking-wider text-[var(--ai-text)]">
                Feedforward &amp; Backpropagation Architecture
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-[var(--ai-muted)]">Epoch: <strong className="text-[var(--ai-text)]">{epoch}</strong></span>
              <span className="text-[var(--ai-muted)]">Loss: <strong className="text-[var(--ai-rose)]">{currentLoss.toFixed(4)}</strong></span>
            </div>
          </div>

          {/* SVG Multi-Layer Neural Graph */}
          <div className="relative w-full h-80 flex items-center justify-center bg-[var(--ai-bg)] rounded-xl border border-[var(--ai-border-subtle)] overflow-hidden p-4">
            <svg className="w-full h-full" viewBox="0 0 500 280">
              {/* Layer 1 Synaptic Weights (Input -> Hidden) */}
              {w1.length > 0 && [0, 1].map((i) => {
                const inY = 70 + i * 140;
                return Array.from({ length: hiddenNeurons }).map((_, j) => {
                  const outY = 30 + (220 / (hiddenNeurons - 1 || 1)) * j;
                  const weight = w1[i]?.[j] ?? 0;
                  const strokeWidth = Math.min(4, Math.max(0.7, Math.abs(weight) * 1.5));
                  const strokeColor = weight >= 0 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(244, 63, 94, 0.4)';

                  return (
                    <line
                      key={`l1-${i}-${j}`}
                      x1={70}
                      y1={inY}
                      x2={250}
                      y2={outY}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                    />
                  );
                });
              })}

              {/* Layer 2 Synaptic Weights (Hidden -> Output) */}
              {w2.length > 0 && Array.from({ length: hiddenNeurons }).map((_, j) => {
                const inY = 30 + (220 / (hiddenNeurons - 1 || 1)) * j;
                const outY = 140;
                const weight = w2[j] ?? 0;
                const strokeWidth = Math.min(4, Math.max(0.7, Math.abs(weight) * 1.5));
                const strokeColor = weight >= 0 ? 'rgba(99, 102, 241, 0.5)' : 'rgba(244, 63, 94, 0.5)';

                return (
                  <line
                    key={`l2-${j}`}
                    x1={250}
                    y1={inY}
                    x2={430}
                    y2={outY}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                  />
                );
              })}

              {/* Input Nodes (X1, X2) */}
              {[
                { label: 'x₁', y: 70, name: 'Input Feature 1' },
                { label: 'x₂', y: 210, name: 'Input Feature 2' }
              ].map((node, i) => (
                <g key={`in-${i}`} className="cursor-pointer">
                  <circle
                    cx={70}
                    cy={node.y}
                    r={18}
                    className="fill-[var(--ai-surface)] stroke-[var(--ai-cyan)] stroke-2"
                  />
                  <text x={70} y={node.y + 4} textAnchor="middle" className="fill-[var(--ai-text)] text-xs font-mono font-bold">
                    {node.label}
                  </text>
                </g>
              ))}

              {/* Hidden Layer Nodes */}
              {Array.from({ length: hiddenNeurons }).map((_, j) => {
                const outY = 30 + (220 / (hiddenNeurons - 1 || 1)) * j;
                const isSelected = selectedNeuron?.layer === 1 && selectedNeuron?.index === j;

                return (
                  <g
                    key={`h-${j}`}
                    onClick={() => setSelectedNeuron({ layer: 1, index: j })}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={250}
                      cy={outY}
                      r={16}
                      className={`transition-all ${
                        isSelected
                          ? 'fill-[var(--ai-primary)] stroke-white stroke-2'
                          : 'fill-[var(--ai-surface)] stroke-[var(--ai-primary)] stroke-2 group-hover:stroke-white'
                      }`}
                    />
                    <text x={250} y={outY + 4} textAnchor="middle" className="fill-[var(--ai-text)] text-[10px] font-mono">
                      h{j + 1}
                    </text>
                  </g>
                );
              })}

              {/* Output Node (Y_hat) */}
              <g className="cursor-pointer">
                <circle
                  cx={430}
                  cy={140}
                  r={20}
                  className="fill-[var(--ai-surface)] stroke-[var(--ai-emerald)] stroke-2"
                />
                <text x={430} y={144} textAnchor="middle" className="fill-[var(--ai-text)] text-xs font-mono font-bold">
                  ŷ
                </text>
              </g>

              {/* Layer Headers */}
              <text x={70} y={18} textAnchor="middle" className="fill-[var(--ai-muted)] text-[10px] font-mono uppercase">
                Input (2)
              </text>
              <text x={250} y={18} textAnchor="middle" className="fill-[var(--ai-muted)] text-[10px] font-mono uppercase">
                Hidden ({hiddenNeurons})
              </text>
              <text x={430} y={18} textAnchor="middle" className="fill-[var(--ai-muted)] text-[10px] font-mono uppercase">
                Output (1)
              </text>
            </svg>
          </div>

          {/* Mathematical Chain Rule Inspector */}
          <div className="rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface-2)] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--ai-text)]">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-[var(--ai-primary)]" />
                Analytical Chain Rule Equations:
              </span>
              <span className="font-mono text-[10px] text-[var(--ai-muted)]">BCE Loss + {activation.toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-[var(--ai-muted)]">
              <div className="bg-[var(--ai-bg)] p-2.5 rounded border border-[var(--ai-border-subtle)]">
                <span className="text-[var(--ai-primary)] font-bold">1. Output Delta:</span>
                <div className="text-[var(--ai-text)] mt-0.5">&delta;&sup2; = (&ycirc; &minus; y)</div>
              </div>
              <div className="bg-[var(--ai-bg)] p-2.5 rounded border border-[var(--ai-border-subtle)]">
                <span className="text-[var(--ai-cyan)] font-bold">2. Hidden Delta:</span>
                <div className="text-[var(--ai-text)] mt-0.5">&delta;&sup1; = (W&sup2;&middot;&delta;&sup2;) &odot; &sigma;&apos;(z&sup1;)</div>
              </div>
              <div className="bg-[var(--ai-bg)] p-2.5 rounded border border-[var(--ai-border-subtle)]">
                <span className="text-[var(--ai-emerald)] font-bold">3. Weight Update:</span>
                <div className="text-[var(--ai-text)] mt-0.5">W &larr; W &minus; &alpha; (&part;L/&part;W)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 5 Cols: 2D Decision Boundary Canvas & Training Metrics */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Decision Boundary Card */}
          <div className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--ai-border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-[var(--ai-cyan)]" />
                <span className="font-bold text-xs uppercase tracking-wider text-[var(--ai-text)]">
                  2D Decision Boundary Space
                </span>
              </div>
              <span className="text-[10px] font-mono text-[var(--ai-muted)]">Span: [-1.2, 1.2]</span>
            </div>

            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="rounded-xl border border-[var(--ai-border)] shadow-lg bg-[var(--ai-bg)]"
              />
            </div>

            <div className="flex items-center justify-center gap-6 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#06b6d4] inline-block border border-white" />
                <span className="text-[var(--ai-text)]">Class 0 (y = 0)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#6366f1] inline-block border border-white" />
                <span className="text-[var(--ai-text)]">Class 1 (y = 1)</span>
              </div>
            </div>
          </div>

          {/* Loss Convergence Chart */}
          <div className="rounded-2xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--ai-text)]">
              <span className="flex items-center gap-1.5">
                <TrendingDown className="h-3.5 w-3.5 text-[var(--ai-rose)]" />
                Binary Cross-Entropy Loss Curve
              </span>
              <span className="font-mono text-[10px] text-[var(--ai-muted)]">Last 40 Epochs</span>
            </div>

            <div className="h-20 w-full flex items-end gap-1 bg-[var(--ai-bg)] p-2 rounded-lg border border-[var(--ai-border-subtle)]">
              {lossHistory.length > 0 ? (
                lossHistory.map((val, idx) => {
                  const heightPct = Math.min(100, Math.max(10, (val / 1.5) * 100));
                  return (
                    <div
                      key={idx}
                      style={{ height: `${heightPct}%` }}
                      className="flex-1 bg-[var(--ai-rose)]/80 hover:bg-[var(--ai-rose)] rounded-t transition-all"
                      title={`Loss: ${val.toFixed(4)}`}
                    />
                  );
                })
              ) : (
                <div className="w-full text-center text-[10px] font-mono text-[var(--ai-muted)] py-6">
                  Press &quot;Train Network&quot; to begin loss recording.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Deep-Dive Architectural Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--ai-border-subtle)]">
        <div className="p-5 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-2">
          <h3 className="text-sm font-bold text-[var(--ai-text)] flex items-center gap-2">
            <Zap className="h-4 w-4 text-[var(--ai-primary)]" />
            Universal Approximation
          </h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            By combining non-linear activation functions (ReLU, GELU) with stacked linear matrix transformations, a single hidden layer can approximate any continuous decision boundary.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-2">
          <h3 className="text-sm font-bold text-[var(--ai-text)] flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-[var(--ai-emerald)]" />
            Gradient Flow &amp; Vanishing
          </h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            Sigmoid saturates at both tails with &sigma;&apos;(z) &approx; 0, causing backpropagated gradients to exponentially vanish in deeper networks. ReLU solves this with constant unit derivative &part;a/&part;z = 1 for z &gt; 0.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[var(--ai-border-subtle)] bg-[var(--ai-surface)] space-y-2">
          <h3 className="text-sm font-bold text-[var(--ai-text)] flex items-center gap-2">
            <Layers className="h-4 w-4 text-[var(--ai-cyan)]" />
            Step vs Batch Optimization
          </h3>
          <p className="text-xs text-[var(--ai-muted)] leading-relaxed">
            Full Batch Gradient Descent computes exact average gradients over all N data points, providing smooth and deterministic convergence towards local loss minima.
          </p>
        </div>
      </div>

    </div>
  );
}
