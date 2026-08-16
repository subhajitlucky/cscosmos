import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

export default function MatrixTransformCanvas({
  matrix = [[1, 0], [0, 1]], // Identity matrix
  showBasisVectors = true,
  showGrid = true,
  showUnitSquare = true,
  animate = true,
  width = 400,
  height = 400,
  scale = 50,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [progress, setProgress] = useState(animate ? 0 : 1);

  const interpolateMatrix = useCallback((t) => {
    const identity = [[1, 0], [0, 1]];
    return [
      [
        identity[0][0] + (matrix[0][0] - identity[0][0]) * t,
        identity[0][1] + (matrix[0][1] - identity[0][1]) * t,
      ],
      [
        identity[1][0] + (matrix[1][0] - identity[1][0]) * t,
        identity[1][1] + (matrix[1][1] - identity[1][1]) * t,
      ],
    ];
  }, [matrix]);

  const transformPoint = useCallback((x, y, m) => {
    return {
      x: m[0][0] * x + m[0][1] * y,
      y: m[1][0] * x + m[1][1] * y,
    };
  }, []);

  const toCanvasCoords = useCallback((x, y) => ({
    x: width / 2 + x * scale,
    y: height / 2 - y * scale,
  }), [width, height, scale]);

  const draw = useCallback((t) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    const currentMatrix = interpolateMatrix(t);

    // Draw transformed grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath();
        const start = transformPoint(i, -5, currentMatrix);
        const end = transformPoint(i, 5, currentMatrix);
        const canvasStart = toCanvasCoords(start.x, start.y);
        const canvasEnd = toCanvasCoords(end.x, end.y);
        ctx.moveTo(canvasStart.x, canvasStart.y);
        ctx.lineTo(canvasEnd.x, canvasEnd.y);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = -5; i <= 5; i++) {
        ctx.beginPath();
        const start = transformPoint(-5, i, currentMatrix);
        const end = transformPoint(5, i, currentMatrix);
        const canvasStart = toCanvasCoords(start.x, start.y);
        const canvasEnd = toCanvasCoords(end.x, end.y);
        ctx.moveTo(canvasStart.x, canvasStart.y);
        ctx.lineTo(canvasEnd.x, canvasEnd.y);
        ctx.stroke();
      }
    }

    // Draw unit square
    if (showUnitSquare) {
      const corners = [
        transformPoint(0, 0, currentMatrix),
        transformPoint(1, 0, currentMatrix),
        transformPoint(1, 1, currentMatrix),
        transformPoint(0, 1, currentMatrix),
      ];

      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 1;

      ctx.beginPath();
      const first = toCanvasCoords(corners[0].x, corners[0].y);
      ctx.moveTo(first.x, first.y);
      corners.slice(1).forEach(corner => {
        const pt = toCanvasCoords(corner.x, corner.y);
        ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Draw axes (fixed)
    ctx.strokeStyle = 'rgba(107, 114, 128, 0.5)';
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Draw basis vectors
    if (showBasisVectors) {
      // i-hat (red)
      const iHat = transformPoint(1, 0, currentMatrix);
      const iHatCanvas = toCanvasCoords(iHat.x, iHat.y);
      const origin = toCanvasCoords(0, 0);

      drawArrow(ctx, origin.x, origin.y, iHatCanvas.x, iHatCanvas.y, '#ef4444', 'î');

      // j-hat (green)
      const jHat = transformPoint(0, 1, currentMatrix);
      const jHatCanvas = toCanvasCoords(jHat.x, jHat.y);

      drawArrow(ctx, origin.x, origin.y, jHatCanvas.x, jHatCanvas.y, '#22c55e', 'ĵ');
    }

    // Draw determinant area indicator
    const det = currentMatrix[0][0] * currentMatrix[1][1] - currentMatrix[0][1] * currentMatrix[1][0];
    ctx.fillStyle = det >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.fillText(`det = ${det.toFixed(2)}`, 10, 20);
  }, [interpolateMatrix, transformPoint, toCanvasCoords, showGrid, showUnitSquare, showBasisVectors, width, height, scale]);

  function drawArrow(ctx, x1, y1, x2, y2, color, label) {
    const angle = Math.atan2(y1 - y2, x1 - x2);
    const arrowLength = 10;
    const arrowAngle = Math.PI / 6;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 + arrowLength * Math.cos(angle - arrowAngle),
      y2 + arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.lineTo(
      x2 + arrowLength * Math.cos(angle + arrowAngle),
      y2 + arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.closePath();
    ctx.fill();

    if (label) {
      ctx.font = 'bold 14px Inter, sans-serif';
      const labelOffset = 20;
      ctx.fillText(label, x2 + labelOffset * Math.cos(angle - Math.PI / 4), y2 + labelOffset * Math.sin(angle - Math.PI / 4));
    }
  }

  useEffect(() => {
    if (!animate) {
      draw(1);
      return;
    }

    let startTime = null;
    const duration = 1000;

    const animateLoop = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic

      setProgress(eased);
      draw(eased);

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animateLoop);
      }
    };

    animationRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, draw, matrix]);

  useEffect(() => {
    if (!animate) {
      draw(1);
    }
  }, [matrix, animate, draw]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-full"
    >
      <canvas
        ref={canvasRef}
        className="rounded-xl bg-slate-50 dark:bg-slate-800/50 w-full h-auto"
        style={{ maxWidth: width, aspectRatio: `${width}/${height}` }}
        role="img"
        aria-label="Matrix transformation visualization"
      />
    </motion.div>
  );
}
