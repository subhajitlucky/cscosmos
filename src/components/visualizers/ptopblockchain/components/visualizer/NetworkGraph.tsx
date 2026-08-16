import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3-force';
import type { NetworkState, Node } from '../../lib/simulation/types';

interface Props {
  state: NetworkState;
  width?: number;
  height?: number;
  topicId?: string;
  onNodeClick?: (id: string) => void;
}

interface D3Node extends Node, d3.SimulationNodeDatum { }
interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  id: string;
}

const NetworkGraph: React.FC<Props> = ({ state, width: propWidth, height: propHeight, topicId, onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<D3Node, D3Link> | null>(null);

  const [observedDimensions, setObservedDimensions] = useState({ width: 1152, height: 800 });
  const width = propWidth ?? observedDimensions.width;
  const height = propHeight ?? observedDimensions.height;

  const isMobile = width < 640;

  const scaleX = width / 1152;
  const scaleY = height / 800;
  // Adjusted scale for mobile to be slightly smaller to fit crowded elements
  const scale = Math.max(isMobile ? 0.6 : 0.8, Math.min(scaleX, scaleY, 1.1));

  useEffect(() => {
    if (propWidth !== undefined && propHeight !== undefined) return;
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          setObservedDimensions({ width: newWidth, height: newHeight });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [propWidth, propHeight]);

  const nodesRef = useRef<D3Node[]>([]);
  const [renderNodes, setRenderNodes] = useState<D3Node[]>([]);
  const [, setTick] = useState(0);

  /* 
    Updated Safety Margins:
    - Top: Increased for mobile (120px) to clear the top-stacked Stats UI.
    - Side: Reduced slightly (30px) to use more width.
    - Bottom: HEAVILY increased for mobile (220px) to clear the tall stack of control buttons.
  */
  const topSafety = (isMobile ? 120 : 80) * scale;
  const bottomSafety = (isMobile ? 220 : 100) * scale;
  const sideSafety = (isMobile ? 30 : 80) * scale;

  // Sync state with refs
  useEffect(() => {
    const existingNodes = new Map(nodesRef.current.map(n => [n.id, n]));
    const isNewTopic = nodesRef.current.length === 0 || state.nodes.length !== nodesRef.current.length;

    nodesRef.current = state.nodes.map(node => {
      const existing = existingNodes.get(node.id);
      if (existing && !isNewTopic) {
        existing.x = Math.max(sideSafety, Math.min(width - sideSafety, existing.x || width / 2));
        existing.y = Math.max(topSafety, Math.min(height - bottomSafety, existing.y || height / 2));

        return {
          ...existing,
          mempool: node.mempool,
          chain: node.chain,
          peers: node.peers,
          isDown: node.isDown,
          hopCount: node.hopCount,
          isReorging: node.isReorging
        };
      }

      const designOffsetX = (node.x || 576) - 576;
      const designOffsetY = (node.y || 400) - 400;

      // ULTRA-COMPRESSION for horizontal topics on mobile
      const isHorizontalTopic = topicId === 'gossip-basics' || topicId === 'duplicate-handling' || topicId === 'transaction-propagation' || topicId === 'block-propagation';
      const spreadFactorX = (isMobile && isHorizontalTopic) ? 0.4 : 1.35;
      const spreadFactorY = (isMobile && isHorizontalTopic) ? 0.65 : 1.35;

      const startX = (width / 2) + (designOffsetX * scale * spreadFactorX);
      const startY = (height / 2) + (designOffsetY * scale * spreadFactorY);

      return { ...node, x: startX, y: startY } as D3Node;
    });

    if (simulationRef.current) {
      simulationRef.current.nodes(nodesRef.current);
      const linkForce = simulationRef.current.force("link") as d3.ForceLink<D3Node, D3Link>;
      linkForce.links(state.connections.map(c => ({
        id: c.id,
        source: nodesRef.current.find(n => n.id === c.from)!,
        target: nodesRef.current.find(n => n.id === c.to)!
      })) as D3Link[]);

      simulationRef.current.alpha(isNewTopic ? 0.3 : 0.05).restart();
    }
    setRenderNodes([...nodesRef.current]);
  }, [state.nodes, state.connections, width, height, scale, isMobile, sideSafety, topSafety, bottomSafety, topicId]);

  // Physics setup
  useEffect(() => {
    // Topic-specific distance and charge for ultra-tight mobile clusters
    const isHorizontalTopic = topicId === 'gossip-basics' || topicId === 'duplicate-handling' || topicId === 'transaction-propagation' || topicId === 'block-propagation';
    const baseDistance = isHorizontalTopic ? (isMobile ? 60 : 140) : 200;
    const chargeStrength = isHorizontalTopic ? (isMobile ? -200 : -800) : -1000;
    const xStrength = (isMobile && isHorizontalTopic) ? 0.02 : 0.06;
    const yStrength = (isMobile && isHorizontalTopic) ? 0.1 : 0.06; // Stronger vertical gravity on mobile

    if (!simulationRef.current) {
      simulationRef.current = d3.forceSimulation<D3Node>(nodesRef.current)
        .force("link", d3.forceLink<D3Node, D3Link>().id((d) => d.id).distance(baseDistance * scale))
        .force("charge", d3.forceManyBody().strength(chargeStrength * scale))
        .force("x", d3.forceX(width / 2).strength(xStrength))
        .force("y", d3.forceY(height / 2).strength(yStrength))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(75 * scale));

      simulationRef.current.on("tick", () => {
        nodesRef.current.forEach(node => {
          if (node.x) node.x = Math.max(sideSafety, Math.min(width - sideSafety, node.x));
          if (node.y) node.y = Math.max(topSafety, Math.min(height - bottomSafety, node.y));
        });
        setTick(t => t + 1);
        setRenderNodes([...nodesRef.current]);
      });
    } else {
      simulationRef.current.force("center", d3.forceCenter(width / 2, height / 2));
      simulationRef.current.force("x", d3.forceX(width / 2).strength(xStrength));
      simulationRef.current.force("y", d3.forceY(height / 2).strength(0.06));
      (simulationRef.current.force("link") as d3.ForceLink<D3Node, D3Link>).distance(baseDistance * scale);
      simulationRef.current.force("charge", d3.forceManyBody().strength(chargeStrength * scale));
      simulationRef.current.force("collision", d3.forceCollide().radius(75 * scale));
      simulationRef.current.alpha(0.1).restart();
    }

    return () => {
      simulationRef.current?.stop();
      simulationRef.current = null;
    };
  }, [width, height, scale, sideSafety, topSafety, bottomSafety, topicId, isMobile]);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-bg-app transition-colors duration-500">
      <div className="absolute inset-0 noise opacity-[0.01] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none" />

      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="block w-full h-full relative z-10">
        <defs>
          <filter id="glow-p" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={2.5 * scale} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g>
          {state.connections.map((conn) => {
            const source = renderNodes.find(n => n.id === conn.from);
            const target = renderNodes.find(n => n.id === conn.to);
            if (!source?.x || !target?.x || source?.y === undefined || target?.y === undefined) return null;

            const isActive = state.packets.some(p => (p.from === conn.from && p.to === conn.to) || (p.from === conn.to && p.to === conn.from));
            const isDeadLink = source.isDown || target.isDown;
            const midX = (source.x + target.x) / 2;
            const midY = (source.y + target.y) / 2;

            return (
              <g key={conn.id}>
                <line
                  x1={source.x} y1={source.y} x2={target.x} y2={target.y}
                  stroke={isDeadLink ? "#ef4444" : "var(--primary)"}
                  strokeWidth={(isMobile ? 2 : 3) * scale}
                  strokeOpacity={isDeadLink ? 0.4 : (isActive ? 0.8 : 0.2)}
                  strokeDasharray={isDeadLink ? `${4 * scale},${4 * scale}` : "none"}
                />
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect x={-22 * scale} y={-9 * scale} width={44 * scale} height={18 * scale} rx={4 * scale} fill="var(--surface)" fillOpacity="0.9" stroke="var(--primary)" strokeOpacity="0.2" />
                  <text textAnchor="middle" dy={5 * scale} fontSize={Math.max(8, 10 * scale)} fontWeight="bold" fill="var(--primary)" style={{ opacity: isDeadLink ? 0.3 : 0.7 }} fontFamily="var(--font-mono)">
                    {conn.latency}ms
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        <g>
          {renderNodes.map((node) => {
            const nodeColor = node.id === 'Server' || node.isMalicious ? '#ef4444' : "var(--primary)";
            const radius = (isMobile ? 20 : 22) * scale;

            return (
              <g key={node.id} transform={`translate(${node.x || 0},${node.y || 0})`} onClick={() => onNodeClick?.(node.id)} className="cursor-pointer group">
                <circle r={radius} style={{ fill: 'var(--surface)', stroke: node.isDown ? '#ef4444' : nodeColor }} fillOpacity={0.8} strokeWidth={2 * scale} className="backdrop-blur-md" />
                <circle r={node.isDown ? 3 * scale : 4.5 * scale} fill={node.isDown ? '#ef4444' : nodeColor} />

                {node.isReorging && (
                  <g>
                    <circle r={radius * 1.5} fill="none" stroke="#ef4444" strokeWidth={2 * scale} className="animate-ping" />
                    <text dy={-(radius + 15 * scale)} textAnchor="middle" fill="#ef4444" fontSize={Math.max(8, 10 * scale)} fontWeight="bold">REORG</text>
                  </g>
                )}

                {!node.isDown && node.hopCount !== undefined && node.hopCount > 0 && (
                  <g transform={`translate(${radius * 0.75}, ${-radius * 0.75})`}>
                    <circle r={8 * scale} fill="var(--primary)" />
                    <text dy={3 * scale} textAnchor="middle" fill="var(--bg-app)" fontSize={Math.max(7, 8 * scale)} fontWeight="bold">{node.hopCount}</text>
                  </g>
                )}

                {node.isDown && <text dy={-(radius + 10 * scale)} textAnchor="middle" fill="#ef4444" fontSize={Math.max(9, 12 * scale)} fontWeight="900">OFFLINE</text>}
                <text dy={radius + 22 * scale} textAnchor="middle" fontSize={Math.max(9, 11 * scale)} fontWeight="bold" className="font-mono uppercase tracking-widest fill-text-main">{node.id}</text>
              </g>
            );
          })}
        </g>

        <g>
          {state.packets.map((packet) => {
            const source = renderNodes.find(n => n.id === packet.from);
            const target = renderNodes.find(n => n.id === packet.to);
            if (!source?.x || !target?.x || source?.y === undefined || target?.y === undefined) return null;

            const progress = target.isDown ? Math.min(packet.progress, 0.8) : packet.progress;
            const x = source.x + (target.x - source.x) * progress;
            const y = source.y + (target.y - source.y) * progress;
            const color = target.isDown ? "#ef4444" : (packet.type === 'transaction' ? "var(--accent)" : "var(--primary)");

            return (
              <g key={packet.id}>
                {topicId === 'network-latency' && (
                  <g transform={`translate(${x}, ${y - 22 * scale})`}>
                    <rect x={-35 * scale} y={-7 * scale} width={70 * scale} height={14 * scale} rx={4 * scale} fill="var(--primary)" fillOpacity="0.2" stroke="var(--primary)" strokeOpacity="0.4" />
                    <text textAnchor="middle" dy={4 * scale} fontSize={Math.max(7, 8 * scale)} fontWeight="bold" fill="var(--primary)" className="font-mono uppercase">{packet.from}→{packet.to}</text>
                  </g>
                )}
                <circle cx={x} cy={y} r={5 * scale} fill={color} style={{ filter: target.isDown ? 'none' : 'url(#glow-p)' }} />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default NetworkGraph;