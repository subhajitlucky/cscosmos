import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';

export default function EigenCanvas({
  matrix = [[2, 1], [1, 2]], // Default symmetric matrix with clear eigenvalues
  showEigenvectors = true,
  showTransformation = true,
  animate = true,
  width = 400,
  height = 400,
  scale = 50,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Calculate eigenvalues and eigenvectors for 2x2 matrix
  const calculateEigen = useCallback((m) => {
    const a = m[0][0], b = m[0][1], c = m[1][0], d = m[1][1];
    const trace = a + d;
    const det = a * d - b * c;
    const discriminant = trace * trace - 4 * det;

    if (discriminant < 0) {
      return { eigenvalues: [], eigenvectors: [], isComplex: true };
    }

    const sqrtDisc = Math.sqrt(discriminant);
    const lambda1 = (trace + sqrtDisc) / 2;
    const lambda2 = (trace - sqrtDisc) / 2;

    // Calculate eigenvectors
    const getEigenvector = (lambda) => {
      // (A - λI)v = 0
      const matMinusLambda = [
        [a - lambda, b],
        [c, d - lambda]
      ];

      // Find non-trivial solution
      if (Math.abs(matMinusLambda[0][0]) > 0.0001) {
        const v = [1, -matMinusLambda[0][0] / matMinusLambda[0][1]];
        const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [v[0] / norm, v[1] / norm];
      } else if (Math.abs(matMinusLambda[1][0]) > 0.0001) {
        const v = [1, -matMinusLambda[1][0] / matMinusLambda[1][1]];
        const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [v[0] / norm, v[1] / norm];
      } else {
        return [1, 0];
      }
    };

    return {
      eigenvalues: [lambda1, lambda2],
      eigenvectors: [getEigenvector(lambda1), getEigenvector(lambda2)],
      isComplex: false
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

    const { eigenvalues, eigenvectors, isComplex } = calculateEigen(matrix);

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 0.5;

    for (let i = -10; i <= 10; i++) {
      const x = width / 2 + i * scale;
      const y = height / 2 + i * scale;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw axes
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

    // Draw eigenvectors and their transformations
    if (!isComplex && showEigenvectors) {
      eigenvectors.forEach((ev, idx) => {
        const eigenvalue = eigenvalues[idx];
        const color = idx === 0 ? '#ef4444' : '#22c55e';

        // Original eigenvector direction (faded)
        const length = 3;
        const origin = toCanvasCoords(0, 0);
        const endOrig = toCanvasCoords(ev[0] * length, ev[1] * length);
        const endOrigNeg = toCanvasCoords(-ev[0] * length, -ev[1] * length);

        // Draw the invariant line
        ctx.strokeStyle = `${color}30`;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(endOrigNeg.x, endOrigNeg.y);
        ctx.lineTo(endOrig.x, endOrig.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated eigenvector
        if (showTransformation) {
          const scaledLength = 1 + (eigenvalue - 1) * t;
          const animEnd = toCanvasCoords(ev[0] * scaledLength, ev[1] * scaledLength);

          ctx.strokeStyle = color;
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(origin.x, origin.y);
          ctx.lineTo(animEnd.x, animEnd.y);
          ctx.stroke();

          // Arrowhead
          const angle = Math.atan2(origin.y - animEnd.y, origin.x - animEnd.x);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(animEnd.x, animEnd.y);
          ctx.lineTo(
            animEnd.x + 10 * Math.cos(angle - Math.PI / 6),
            animEnd.y + 10 * Math.sin(angle - Math.PI / 6)
          );
          ctx.lineTo(
            animEnd.x + 10 * Math.cos(angle + Math.PI / 6),
            animEnd.y + 10 * Math.sin(angle + Math.PI / 6)
          );
          ctx.closePath();
          ctx.fill();

          // Label
          ctx.font = 'bold 12px Inter, sans-serif';
          ctx.fillStyle = color;
          ctx.fillText(`λ${idx + 1} = ${eigenvalue.toFixed(2)}`, animEnd.x + 15, animEnd.y - 5);
        }
      });
    }

    // Draw a test point and its transformation
    if (showTransformation) {
      const testPoints = [
        { x: 1, y: 0.5, color: '#3b82f6' },
        { x: 0.5, y: 1, color: '#8b5cf6' },
      ];

      testPoints.forEach(pt => {
        const origin = toCanvasCoords(0, 0);
        const original = toCanvasCoords(pt.x, pt.y);

        // Interpolate transformation
        const transformedX = pt.x + (matrix[0][0] * pt.x + matrix[0][1] * pt.y - pt.x) * t;
        const transformedY = pt.y + (matrix[1][0] * pt.x + matrix[1][1] * pt.y - pt.y) * t;
        const transformed = toCanvasCoords(transformedX, transformedY);

        // Original vector (faded)
        ctx.strokeStyle = `${pt.color}40`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(original.x, original.y);
        ctx.stroke();

        // Transformed vector
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(transformed.x, transformed.y);
        ctx.stroke();

        // Points
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(transformed.x, transformed.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Info box
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.font = '11px Inter, sans-serif';

    if (isComplex) {
      ctx.fillText('Complex eigenvalues (rotation)', 10, 20);
    } else {
      ctx.fillText('Eigenvectors stay on their lines!', 10, 20);
      ctx.fillText(`Only scaled by λ₁=${eigenvalues[0].toFixed(2)}, λ₂=${eigenvalues[1].toFixed(2)}`, 10, 35);
    }
  }, [matrix, calculateEigen, toCanvasCoords, showEigenvectors, showTransformation, width, height, scale]);

  useEffect(() => {
    if (!animate) {
      draw(1);
      return;
    }

    let startTime = null;
    const duration = 2000;

    const animateLoop = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full"
    >
      <canvas
        ref={canvasRef}
        className="rounded-xl bg-slate-50 dark:bg-slate-800/50 w-full h-auto"
        style={{ maxWidth: width, aspectRatio: `${width}/${height}` }}
        role="img"
        aria-label="Eigenvalue and eigenvector visualization"
      />
    </motion.div>
  );
}
