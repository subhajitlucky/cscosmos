import { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, ZoomOut, Move, Maximize } from 'lucide-react'

export default function CommitGraph({ data }) {
  const { nodes, branches, head } = data
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const zoomSensitivity = 0.001
      const newScale = Math.min(Math.max(0.5, transform.scale - e.deltaY * zoomSensitivity), 2)
      setTransform(prev => ({ ...prev, scale: newScale }))
    } else {
      setTransform(prev => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }))
    }
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    const dx = e.clientX - lastMousePos.x
    const dy = e.clientY - lastMousePos.y
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }))
    setLastMousePos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Reset view when data changes (optional, keeps view centered on start)
  useEffect(() => {
    if (nodes.length === 0) {
      setTransform({ x: 0, y: 0, scale: 1 })
    }
  }, [nodes.length])

  const layout = useMemo(() => {
    const branchColors = {}
    const colorPalette = [
      '#10b981', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'
    ]

    Object.keys(branches).forEach((branch, index) => {
      branchColors[branch] = colorPalette[index % colorPalette.length]
    })

    // Compact Layout Constants
    const NODE_SPACING_X = 100
    const LANE_HEIGHT = 80
    const BASE_Y = 100

    const nodesWithPositions = nodes.map((node, index) => {
      const x = index * NODE_SPACING_X + 100
      const lane = node.parents.length > 1 ? 2 : node.branches.length > 0 ? 1 : 0
      const y = lane * LANE_HEIGHT + BASE_Y

      return {
        ...node,
        x,
        y,
        color: branchColors[node.branches[0]] || '#34d399',
        isActive: node.id === (head.type === 'detached' ? head.ref : branches[head.ref])
      }
    })

    const edges = []
    nodesWithPositions.forEach((node) => {
      node.parents.forEach((parentHash) => {
        const parent = nodesWithPositions.find((n) => n.id === parentHash)
        if (parent) {
          edges.push({ from: parent, to: node, color: node.color })
        }
      })
    })

    return { nodes: nodesWithPositions, edges }
  }, [nodes, branches, head])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full overflow-hidden bg-slate-50 dark:bg-slate-950 relative cursor-${isDragging ? 'grabbing' : 'grab'}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button onClick={() => setTransform(p => ({ ...p, scale: Math.min(2, p.scale + 0.1) }))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={() => setTransform(p => ({ ...p, scale: Math.max(0.5, p.scale - 0.1) }))} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
          <ZoomOut className="w-4 h-4" />
        </button>
        <button onClick={() => setTransform({ x: 0, y: 0, scale: 1 })} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 transition-colors">
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      <div
        className="w-full h-full origin-top-left transition-transform duration-75 ease-out"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
      >
        <svg width="2000" height="2000" className="overflow-visible">
          <defs>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {layout.edges.map((edge, index) => {
            const midX = (edge.from.x + edge.to.x) / 2
            return (
              <motion.path
                key={index}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                d={`M ${edge.from.x} ${edge.from.y} C ${midX} ${edge.from.y}, ${midX} ${edge.to.y}, ${edge.to.x} ${edge.to.y}`}
                fill="none"
                stroke={edge.color}
                strokeWidth="3"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
            )
          })}

          {layout.nodes.map((node, index) => {
            const labelSpacing = 28;
            const labelsCount = node.branches.length;
            const headYOffset = labelsCount > 0 ? (50 + (labelsCount * labelSpacing)) : 50;

            return (
              <g key={node.id} className="group">
                <motion.g
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, delay: index * 0.05 }}
                >
                  {/* Active Pulse */}
                  {node.isActive && (
                    <motion.circle
                      cx={node.x} cy={node.y} r="30"
                      fill={node.color} fillOpacity="0.15"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  <circle
                    cx={node.x} cy={node.y} r="16"
                    fill={node.color}
                    className="shadow-md"
                    filter={node.isActive ? "url(#nodeGlow)" : ""}
                  />

                  <text
                    x={node.x} y={node.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                    fontWeight="900"
                    className="select-none pointer-events-none"
                  >
                    {index + 1}
                  </text>

                  {/* Branch Labels */}
                  {node.branches.map((branch, bIdx) => (
                    <motion.g key={branch} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 + bIdx * 0.1 }}>
                      <rect
                        x={node.x - 40} y={node.y - 50 - (bIdx * labelSpacing)}
                        width="80" height="22" rx="6"
                        fill="white" className="dark:fill-slate-800"
                        stroke={node.color} strokeWidth="2"
                        style={{ filter: 'drop-shadow(0 2px 4px rgb(0 0 0 / 0.05))' }}
                      />
                      <rect
                        x={node.x - 40} y={node.y - 50 - (bIdx * labelSpacing)}
                        width="80" height="22" rx="6"
                        fill={node.color} fillOpacity="0.05"
                      />
                      <text
                        x={node.x} y={node.y - 36 - (bIdx * labelSpacing)}
                        textAnchor="middle"
                        fill={node.color}
                        fontSize="9"
                        fontWeight="800"
                        className="uppercase tracking-wider select-none"
                      >
                        {branch}
                      </text>
                    </motion.g>
                  ))}

                  {/* HEAD Indicator */}
                  {(head.ref === node.id || node.branches.includes(head.ref)) && (
                    <motion.g
                      animate={{ y: [-3, 0, -3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <path
                        d={`M ${node.x} ${node.y - (labelsCount > 0 ? (50 + (labelsCount - 1) * labelSpacing) : 25)} L ${node.x} ${node.y - headYOffset + 15}`}
                        fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3"
                      />
                      <rect x={node.x - 20} y={node.y - headYOffset - 12} width="40" height="18" rx="5" fill="#f43f5e" className="shadow-md" />
                      <text x={node.x} y={node.y - headYOffset} textAnchor="middle" fill="white" fontSize="8" fontWeight="900" className="tracking-widest capitalize">HEAD</text>
                    </motion.g>
                  )}
                </motion.g>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}