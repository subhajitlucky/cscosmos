"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Folder, FileText, ChevronRight, MousePointer2 } from "lucide-react"

interface RouteNode {
  name: string
  type: "folder" | "file"
  label?: string
  children?: RouteNode[]
  highlight?: boolean
}

interface RoutingVisualizerProps {
  data?: RouteNode[]
  title?: string
}

export function RoutingVisualizer({ data, title = "Project Structure" }: RoutingVisualizerProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  
  const defaultTree: RouteNode[] = [
    { name: "app", type: "folder", children: [
      { name: "layout.tsx", type: "file", label: "Root Layout" },
      { name: "page.tsx", type: "file", label: "Home Page" },
    ]}
  ]

  const tree = data || defaultTree

  const renderNode = (node: RouteNode, depth = 0) => (
    <div key={node.name} className="ml-4">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setSelectedNode(node.name)}
        className={`flex items-center gap-2 py-1.5 px-2 text-sm rounded-lg transition-all cursor-pointer group ${
          selectedNode === node.name 
            ? "bg-primary/10 text-primary" 
            : node.highlight 
              ? "text-primary bg-primary/5" 
              : "hover:bg-muted"
        }`}
      >
        {node.type === "folder" ? (
          <Folder className={`h-4 w-4 shrink-0 ${node.highlight || selectedNode === node.name ? "text-primary" : "text-blue-500"}`} />
        ) : (
          <FileText className={`h-4 w-4 shrink-0 ${node.highlight || selectedNode === node.name ? "text-primary" : "text-muted-foreground"}`} />
        )}
        <span className={`truncate ${node.type === "folder" || node.highlight || selectedNode === node.name ? "font-semibold" : ""}`}>
          {node.name}
        </span>
        
        {node.label && (
          <span className="text-[9px] md:text-[10px] bg-muted group-hover:bg-background px-1.5 py-0.5 rounded text-muted-foreground ml-auto whitespace-nowrap">
            {node.label}
          </span>
        )}
      </motion.div>
      {node.children && node.children.map((child) => renderNode(child, depth + 1))}
    </div>
  )

  return (
    <div className="p-4 md:p-8 h-full flex flex-col gap-6">
      <div className="flex-1 w-full max-w-md mx-auto bg-muted/30 rounded-2xl border p-4 md:p-6 font-mono relative overflow-hidden group/box">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover/box:opacity-10 transition-opacity">
           <Folder className="h-32 w-32" />
        </div>
        
        <div className="flex items-center gap-2 mb-4 pb-2 border-b text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>{title}</span>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          {tree.map(node => renderNode(node))}
        </div>

        <AnimatePresence>
          {!selectedNode && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-bold text-primary/40 italic"
            >
              <MousePointer2 className="h-3 w-3" />
              Click nodes to inspect
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-1">
             <div className="h-1.5 w-1.5 rounded-full bg-primary" />
             <p className="text-xs font-bold text-primary uppercase tracking-wider">Node Insight</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {selectedNode.endsWith('.tsx') 
              ? `The ${selectedNode} file is a special segment that Next.js uses to build the component hierarchy.`
              : `The /${selectedNode} folder defines a new segment in your application's URL path.`}
          </p>
        </motion.div>
      )}
    </div>
  )
}