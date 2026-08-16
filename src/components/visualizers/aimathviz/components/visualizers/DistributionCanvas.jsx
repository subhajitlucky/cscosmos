import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

// Normal distribution PDF
function normalPDF(x, mean = 0, std = 1) {
  const coefficient = 1 / (std * Math.sqrt(2 * Math.PI));
  const exponent = -0.5 * Math.pow((x - mean) / std, 2);
  return coefficient * Math.exp(exponent);
}

// Uniform distribution PDF
function uniformPDF(x, a = -2, b = 2) {
  return x >= a && x <= b ? 1 / (b - a) : 0;
}

// Exponential distribution PDF
function exponentialPDF(x, lambda = 1) {
  return x >= 0 ? lambda * Math.exp(-lambda * x) : 0;
}

// Beta distribution PDF (simplified)
function betaPDF(x, alpha = 2, beta = 5) {
  if (x <= 0 || x >= 1) return 0;
  // Simplified without proper normalization
  return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) * 12;
}

const distributions = {
  normal: { pdf: normalPDF, xRange: [-4, 4], name: 'Normal (Gaussian)' },
  uniform: { pdf: uniformPDF, xRange: [-3, 3], name: 'Uniform' },
  exponential: { pdf: exponentialPDF, xRange: [-0.5, 5], name: 'Exponential' },
  beta: { pdf: betaPDF, xRange: [-0.1, 1.1], name: 'Beta' },
};

export default function DistributionCanvas({
  distribution = 'normal',
  params = {},
  samples = [],
  showSamples = true,
  showMean = true,
  showStd = true,
  width = 500,
  height = 300,
  color = '#8b5cf6',
}) {
  const canvasRef = useRef(null);
  const [hoveredX, setHoveredX] = useState(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    const dist = distributions[distribution];
    const [xMin, xMax] = dist.xRange;

    // Calculate y range based on distribution
    let yMax = 0;
    const points = [];
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (i / 200) * (xMax - xMin);
      const y = dist.pdf(x, ...Object.values(params));
      points.push({ x, y });
      if (y > yMax) yMax = y;
    }
    yMax *= 1.1;

    const toCanvasX = (x) => padding.left + ((x - xMin) / (xMax - xMin)) * plotWidth;
    const toCanvasY = (y) => padding.top + plotHeight - (y / yMax) * plotHeight;

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 0.5;

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = xMin + (i / 10) * (xMax - xMin);
      const cx = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(cx, padding.top);
      ctx.lineTo(cx, height - padding.bottom);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * yMax;
      const cy = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(padding.left, cy);
      ctx.lineTo(width - padding.right, cy);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.8)';
    ctx.lineWidth = 1.5;

    // X axis
    const xAxisY = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(padding.left, xAxisY);
    ctx.lineTo(width - padding.right, xAxisY);
    ctx.stroke();

    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = 'rgba(107, 114, 128, 0.8)';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';

    for (let i = 0; i <= 4; i++) {
      const x = xMin + (i / 4) * (xMax - xMin);
      ctx.fillText(x.toFixed(1), toCanvasX(x), height - padding.bottom + 20);
    }

    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * yMax;
      ctx.fillText(y.toFixed(2), padding.left - 8, toCanvasY(y) + 4);
    }

    // Draw distribution curve with gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, `${color}40`);
    gradient.addColorStop(1, `${color}05`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(points[0].x), toCanvasY(0));
    points.forEach(p => {
      ctx.lineTo(toCanvasX(p.x), toCanvasY(p.y));
    });
    ctx.lineTo(toCanvasX(points[points.length - 1].x), toCanvasY(0));
    ctx.closePath();
    ctx.fill();

    // Draw the curve line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(toCanvasX(points[0].x), toCanvasY(points[0].y));
    points.forEach(p => {
      ctx.lineTo(toCanvasX(p.x), toCanvasY(p.y));
    });
    ctx.stroke();

    // Draw mean line
    if (showMean && distribution === 'normal') {
      const mean = params.mean || 0;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(toCanvasX(mean), padding.top);
      ctx.lineTo(toCanvasX(mean), height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`μ = ${mean}`, toCanvasX(mean), padding.top - 5);
    }

    // Draw std deviation markers
    if (showStd && distribution === 'normal') {
      const mean = params.mean || 0;
      const std = params.std || 1;

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);

      [-1, 1].forEach(sign => {
        const x = mean + sign * std;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(x), padding.top);
        ctx.lineTo(toCanvasX(x), height - padding.bottom);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Draw samples
    if (showSamples && samples.length > 0) {
      ctx.fillStyle = `${color}80`;
      samples.forEach(s => {
        if (s >= xMin && s <= xMax) {
          ctx.beginPath();
          ctx.arc(toCanvasX(s), toCanvasY(0) - 5, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Hover effect
    if (hoveredX !== null && hoveredX >= xMin && hoveredX <= xMax) {
      const y = dist.pdf(hoveredX, ...Object.values(params));
      const cx = toCanvasX(hoveredX);
      const cy = toCanvasY(y);

      ctx.strokeStyle = 'rgba(107, 114, 128, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, toCanvasY(0));
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`x = ${hoveredX.toFixed(2)}, p(x) = ${y.toFixed(4)}`, cx + 10, cy - 10);
    }

    // Distribution name
    ctx.fillStyle = 'rgba(107, 114, 128, 0.8)';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(dist.name, padding.left + 10, padding.top + 15);
  }, [distribution, params, samples, showSamples, showMean, showStd, hoveredX, width, height, color]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const padding = { left: 50, right: 30 };
    const plotWidth = width - padding.left - padding.right;
    const dist = distributions[distribution];
    const [xMin, xMax] = dist.xRange;

    const cx = e.clientX - rect.left;
    if (cx >= padding.left && cx <= width - padding.right) {
      const x = xMin + ((cx - padding.left) / plotWidth) * (xMax - xMin);
      setHoveredX(x);
    } else {
      setHoveredX(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative w-full"
    >
      <canvas
        ref={canvasRef}
        className="rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-crosshair w-full h-auto"
        style={{ maxWidth: width, aspectRatio: `${width}/${height}` }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredX(null)}
        role="img"
        aria-label={`${distributions[distribution].name} distribution visualization`}
      />
    </motion.div>
  );
}

export { distributions };
