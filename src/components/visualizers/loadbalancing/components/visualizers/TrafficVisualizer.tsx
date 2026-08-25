import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { Server, Monitor, ShieldCheck, Activity, Layers, Globe } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Request as SimRequest } from '../../engine/types';

export const TrafficVisualizer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 500 });
  const { nodes, requests, mode, circuitBreakerStatus } = useStore();

  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  const isClientSide = mode === 'client-side';
  const isCDN = mode === 'cdn';
  const isGlobal = mode === 'global-lb';
  const isConsistent = mode === 'consistent-hashing';

  const w = dimensions.width || 800;
  const h = dimensions.height || 500;

  const CLIENTS_X = w * 0.1;
  const LB_X = isClientSide ? CLIENTS_X : w * 0.45;
  const NODES_X = w * 0.85;
  const LB_Y = h * 0.5;
  const PROXY_X = LB_X;
  
  const isMobile = w < 640;
  const NODE_CARD_WIDTH = isMobile ? 120 : 180;
  const NODE_ENTRY_X = NODES_X - (NODE_CARD_WIDTH / 2);
  const LB_CARD_WIDTH = isMobile ? 100 : 140;

  const getNodeY = (index: number, total: number) => {
    if (total === 1) return LB_Y;
    const margin = h * 0.2;
    const trackHeight = h - (margin * 2);
    return margin + (index * (trackHeight / (total - 1)));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[500px] bg-zinc-50/50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group/canvas"
    >
      <div className="absolute inset-0 grid-background opacity-[0.2] dark:opacity-[0.1]" />
      
      {mode === 'reverse-proxy' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-0 bottom-0 bg-zinc-950/5 dark:bg-white/5 border-x border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center justify-between py-10 pointer-events-none group/proxy"
            style={{ left: LB_X, width: isMobile ? '60px' : '120px', transform: 'translateX(-50%)' }}
          >
              <div className="text-[6px] sm:text-[8px] font-bold text-zinc-400 uppercase tracking-widest bg-white dark:bg-zinc-900 px-1 sm:px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 shadow-sm mb-4">SSL</div>
              <div className="rotate-90 text-[8px] sm:text-[10px] font-bold text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.5em] whitespace-nowrap">Gateway</div>
              <div className="text-[6px] sm:text-[8px] font-bold text-zinc-400 uppercase tracking-widest bg-white dark:bg-zinc-900 px-1 sm:px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800 shadow-sm mt-4">Cache</div>
          </motion.div>
      )}

      {isConsistent && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center opacity-50"
                style={{ width: Math.min(w * 0.5, h * 0.7), height: Math.min(w * 0.5, h * 0.7) }}
              >
                  <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest bg-white dark:bg-zinc-900 px-2 py-1 rounded">Hash Ring</div>
              </motion.div>
          </div>
      )}

      {mode === 'l4' && <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-zinc-400 uppercase">Transport Layer (IP/Port)</div>}
      {mode === 'l7' && <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[8px] font-bold text-zinc-400 uppercase text-center">Application Layer<br/>(HTTP/Cookies)</div>}

      {isGlobal && (
          <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 flex flex-col items-end gap-1 opacity-40">
                  <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]"><Globe className="h-3 w-3" /> US-East</div>
                  <div className="h-px w-20 sm:w-32 bg-blue-500/50" />
              </div>
              <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1 opacity-40">
                  <div className="flex items-center gap-2 text-[8px] sm:text-[10px] font-bold text-purple-500 uppercase tracking-[0.2em]"><Globe className="h-3 w-3" /> EU-West</div>
                  <div className="h-px w-20 sm:w-32 bg-purple-500/50" />
              </div>
          </div>
      )}

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, i) => {
            const nodeY = getNodeY(i, nodes.length);
            const startX = isClientSide ? CLIENTS_X : LB_X;
            const startY = LB_Y;
            const isStickyPath = mode === 'sticky-sessions' && i === 0;

            return (
                <g key={node.id}>
                    <path
                        d={`M ${startX} ${startY} L ${NODE_ENTRY_X} ${nodeY}`}
                        stroke="currentColor"
                        strokeWidth={isStickyPath ? "2" : "1"}
                        className={cn(
                            "transition-colors duration-500",
                            isGlobal ? (i === 0 ? "text-blue-200/30" : "text-purple-200/30") : 
                            isStickyPath ? "text-blue-500/20" : "text-zinc-200 dark:text-zinc-700"
                        )}
                        fill="none"
                    />
                    {(node.status === 'healthy' || isStickyPath) && (
                        <motion.path
                            d={`M ${startX} ${startY} L ${NODE_ENTRY_X} ${nodeY}`}
                            stroke="currentColor"
                            strokeWidth={isStickyPath ? "1.5" : "1"}
                            className={isStickyPath ? "text-blue-400/30" : "text-zinc-400/20 dark:text-zinc-500/20"}
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    )}
                </g>
            );
        })}

        {!isClientSide && (
            <path d={`M ${CLIENTS_X} ${LB_Y} L ${LB_X} ${LB_Y}`} stroke="currentColor" strokeWidth="1" className="text-zinc-200 dark:text-zinc-700" fill="none" />
        )}
      </svg>

      <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: CLIENTS_X, top: LB_Y }}>
        <div className="flex flex-col items-center gap-2">
            <div className="p-3 sm:p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl relative">
                <Monitor className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 dark:text-zinc-500" />
                {isClientSide && (
                    <motion.div className="absolute -right-8 top-0 px-1 py-0.5 bg-emerald-500 text-white text-[5px] font-bold uppercase rounded shadow-lg">Smart</motion.div>
                )}
            </div>
            <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">{isClientSide ? 'Client' : 'Source'}</span>
        </div>
      </div>

      {!isClientSide && (
          <motion.div className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: LB_X, top: LB_Y }} initial={false} animate={{ scale: isCDN ? 0.75 : 0.9 }}>
            <div className={cn("relative p-1 rounded-xl shadow-xl transition-all duration-500", mode === 'circuit-breaker' ? (circuitBreakerStatus === 'open' ? "bg-red-500" : circuitBreakerStatus === 'half-open' ? "bg-amber-500" : "bg-emerald-500") : (isCDN ? "bg-zinc-400" : "bg-zinc-200 dark:bg-zinc-700"))}>
                <div className="bg-white dark:bg-zinc-900 px-4 sm:px-6 py-3 sm:py-4 rounded-[calc(0.75rem-2px)] flex flex-col items-center gap-2" style={{ width: LB_CARD_WIDTH }}>
                    <div className={cn("p-2 rounded-lg transition-colors", mode === 'circuit-breaker' ? (circuitBreakerStatus === 'open' ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600") : "bg-zinc-950 dark:bg-zinc-800 text-white dark:text-zinc-100")}>
                        {isCDN ? <Layers className="h-4 w-4 sm:h-5 sm:w-5" /> : mode === 'circuit-breaker' && circuitBreakerStatus === 'open' ? <Activity className="h-4 w-4 sm:h-5 sm:w-5" /> : <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-[9px] sm:text-[11px] uppercase tracking-tight">{isCDN ? 'Edge' : 'Balancer'}</p>
                    </div>
                </div>
            </div>
          </motion.div>
      )}

      {nodes.map((node, i) => {
        const nodeY = getNodeY(i, nodes.length);
        return (
          <div key={node.id} className={cn("absolute -translate-x-1/2 -translate-y-1/2 group/node px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-all duration-500 flex items-center gap-2 sm:gap-3", node.status === 'healthy' ? "shadow-md" : "opacity-60 grayscale")} style={{ left: NODES_X, top: nodeY, width: NODE_CARD_WIDTH }}>
              <div className={cn("p-1.5 sm:p-2 rounded-lg relative", node.status === 'healthy' ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100" : "bg-red-50 dark:bg-red-900 text-red-500")}>
                  <Server className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
              <div className="flex-1 min-w-0">
                  <p className="font-bold text-[10px] sm:text-xs tracking-tight truncate">{node.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                      <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-zinc-900 dark:bg-zinc-100" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (node.currentConnections / 10) * 100)}%` }} />
                      </div>
                      <span className="text-[8px] font-mono font-bold">{node.currentConnections}</span>
                  </div>
              </div>
          </div>
        );
      })}

      <AnimatePresence>
        {requests.map((req: SimRequest) => {
          const targetIndex = req.targetNodeIndex !== undefined ? req.targetNodeIndex : nodes.findIndex((n) => n.id === req.targetNodeId);
          const nodeY = targetIndex === -1 ? LB_Y : getNodeY(targetIndex, nodes.length);

          let animate: any = { x: CLIENTS_X, y: LB_Y, opacity: 1, scale: 1 };

          if (isClientSide) {
             if (req.status === 'routing' || req.status === 'processing') {
                animate = { x: NODE_ENTRY_X, y: nodeY, opacity: 1, scale: 1 };
             } else if (req.status === 'completed' || req.status === 'failed') {
                animate = { x: NODE_ENTRY_X + 20, y: nodeY, opacity: 0, scale: 0.5 };
             }
          } else if (mode === 'reverse-proxy') {
            if (req.status === 'routing') {
                animate = { x: PROXY_X, y: LB_Y, opacity: 1, scale: 1 };
            } else if (req.status === 'processing') {
                animate = { x: NODE_ENTRY_X, y: nodeY, opacity: 1, scale: 1 };
            } else if (req.status === 'completed' || req.status === 'failed') {
                if (req.status === 'failed' && !req.targetNodeId) {
                    animate = { x: [PROXY_X, PROXY_X, PROXY_X], y: [LB_Y, LB_Y, h + 50], opacity: [1, 1, 0], scale: [1, 1.3, 0.5] };
                } else {
                    animate = { x: NODE_ENTRY_X + 20, y: nodeY, opacity: 0, scale: 0.5 };
                }
            }
          } else {
            if (req.status === 'routing') {
                animate = { x: LB_X, y: LB_Y, opacity: 1, scale: 1 };
            } else if (req.status === 'processing') {
                animate = { x: NODE_ENTRY_X, y: nodeY, opacity: 1, scale: 1 };
            } else if (req.status === 'completed' || req.status === 'failed') {
                if (req.status === 'failed' && !req.targetNodeId) {
                    animate = { x: [LB_X, LB_X, LB_X], y: [LB_Y, LB_Y, h + 50], opacity: [1, 1, 0], scale: 0.5 };
                } else {
                    animate = { x: NODE_ENTRY_X + 20, y: nodeY, opacity: 0, scale: 0.5 };
                }
            }
          }

          return (
            <motion.div
              key={req.id}
              initial={{ x: CLIENTS_X, y: LB_Y, opacity: 0, scale: 0.5 }}
              animate={animate}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ 
                duration: req.status === 'failed' && !req.targetNodeId ? 2.5 : 0.6,
                times: req.status === 'failed' && !req.targetNodeId ? [0, 0.4, 1] : undefined,
                ease: "easeInOut"
              }}
              style={{ x: '-50%', y: '-50%' }}
              className="absolute z-20 pointer-events-none"
            >
              <div 
                className={cn(
                    "shadow-lg border border-white dark:border-zinc-950 transition-all",
                    mode === 'l4' ? "h-1.5 w-2 sm:h-2 sm:w-3 rounded-sm" : "h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full",
                    req.status === 'failed' ? "bg-red-500" : ""
                )}
                style={{ backgroundColor: req.status === 'failed' ? undefined : (req.color || '#71717a') }}
              >
                  <div className={cn("absolute inset-0 blur-[1px] opacity-50", mode === 'l4' ? "rounded-sm" : "rounded-full")} style={{ backgroundColor: 'inherit' }} />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
          {mode !== 'default' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-950 dark:bg-zinc-800 text-white dark:text-zinc-100 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-2xl z-50 flex items-center gap-2 border border-white/10 dark:border-zinc-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {mode.replace(/-/g, ' ')}
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};