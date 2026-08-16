import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function VectorCanvas({ 
  vectors = [], 
  showGrid = true, 
  showAxis = true,
  interactive = false,
  onVectorChange,
  width = 400,
  height = 400,
  scale = 40,
}) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const toCanvasCoords = useCallback((x, y) => ({
    x: width / 2 + x * scale + offset.x,
    y: height / 2 - y * scale + offset.y,
  }), [width, height, scale, offset]);

  const fromCanvasCoords = useCallback((cx, cy) => ({
    x: (cx - width / 2 - offset.x) / scale,
    y: (height / 2 + offset.y - cy) / scale,
  }), [width, height, scale, offset]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear
    ctx.clearRect(0, 0, width, height);

    // Grid
    if (showGrid) {
      ctx.strokeStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-grid').trim() || '#e5e7eb';
      ctx.lineWidth = 0.5;
      
      const gridSize = scale;
      const startX = (width / 2 + offset.x) % gridSize;
      const startY = (height / 2 + offset.y) % gridSize;
      
      for (let x = startX; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      for (let y = startY; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Axes
    if (showAxis) {
      ctx.strokeStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-axis').trim() || '#6b7280';
      ctx.lineWidth = 1.5;
      
      // X axis
      ctx.beginPath();
      ctx.moveTo(0, height / 2 + offset.y);
      ctx.lineTo(width, height / 2 + offset.y);
      ctx.stroke();
      
      // Y axis
      ctx.beginPath();
      ctx.moveTo(width / 2 + offset.x, 0);
      ctx.lineTo(width / 2 + offset.x, height);
      ctx.stroke();
      
      // Axis labels
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('x', width - 15, height / 2 + offset.y - 8);
      ctx.fillText('y', width / 2 + offset.x + 8, 15);
    }

    // Draw vectors
    vectors.forEach((vec, idx) => {
      if (!vec) return;
      
      const start = toCanvasCoords(vec.startX || 0, vec.startY || 0);
      const end = toCanvasCoords(vec.x, vec.y);
      
      // Vector line
      ctx.strokeStyle = vec.color || '#3b82f6';
      ctx.lineWidth = vec.width || 2.5;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      
      // Arrowhead
      const angle = Math.atan2(start.y - end.y, start.x - end.x);
      const arrowLength = 12;
      const arrowAngle = Math.PI / 6;
      
      ctx.fillStyle = vec.color || '#3b82f6';
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x + arrowLength * Math.cos(angle - arrowAngle),
        end.y + arrowLength * Math.sin(angle - arrowAngle)
      );
      ctx.lineTo(
        end.x + arrowLength * Math.cos(angle + arrowAngle),
        end.y + arrowLength * Math.sin(angle + arrowAngle)
      );
      ctx.closePath();
      ctx.fill();
      
      // Label
      if (vec.label) {
        ctx.fillStyle = vec.color || '#3b82f6';
        ctx.font = 'bold 14px Inter, sans-serif';
        const labelOffset = 15;
        const labelX = end.x + labelOffset * Math.cos(angle - Math.PI / 2);
        const labelY = end.y + labelOffset * Math.sin(angle - Math.PI / 2);
        ctx.fillText(vec.label, labelX, labelY);
      }
    });

    // Interactive handles
    if (interactive) {
      vectors.forEach((vec, idx) => {
        if (!vec || !vec.draggable) return;
        const end = toCanvasCoords(vec.x, vec.y);
        
        ctx.fillStyle = vec.color || '#3b82f6';
        ctx.beginPath();
        ctx.arc(end.x, end.y, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(end.x, end.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [vectors, showGrid, showAxis, toCanvasCoords, width, height, scale, offset, interactive]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleMouseDown = (e) => {
    if (!interactive) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    
    vectors.forEach((vec, idx) => {
      if (!vec || !vec.draggable) return;
      const end = toCanvasCoords(vec.x, vec.y);
      const dist = Math.sqrt((cx - end.x) ** 2 + (cy - end.y) ** 2);
      
      if (dist < 15) {
        setDragging(idx);
      }
    });
  };

  const handleMouseMove = (e) => {
    if (dragging === null || !onVectorChange) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const coords = fromCanvasCoords(cx, cy);
    
    onVectorChange(dragging, { 
      x: Math.round(coords.x * 10) / 10, 
      y: Math.round(coords.y * 10) / 10 
    });
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="vector-canvas rounded-xl cursor-crosshair w-full h-auto"
      style={{ maxWidth: width, aspectRatio: `${width}/${height}` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      role="img"
      aria-label="Vector visualization canvas"
    />
  );
}
