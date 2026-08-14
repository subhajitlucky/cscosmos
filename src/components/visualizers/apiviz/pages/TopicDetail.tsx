'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { learningPath } from '../data/learning-path';
import { ArrowLeft, Repeat, AlertTriangle, PlayCircle, Code2, Globe, Server, Database } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function TopicDetail({ topicId }: { topicId: string }) {
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Find topic in data
  const allTopics = learningPath.flatMap(d => d.topics);
  const topic = allTopics.find(t => t.id === topicId) || allTopics[0];

  const renderVisualization = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 space-y-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10" />
        
        {/* Animated Request Flow */}
        <div className="relative z-10 w-full flex items-center justify-around gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 border-2 border-cyan-400/40 bg-black/60 flex flex-col items-center justify-center p-4 relative group">
              <Globe className="w-10 h-10 text-cyan-400 mb-2" />
              <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400/40">CLIENT_NODE</span>
            </div>
            <button 
              onClick={() => setIsSimulating(true)}
              disabled={isSimulating}
              className="px-4 py-2 border border-cyan-400 bg-cyan-400/10 text-cyan-400 text-[8px] font-black uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-20 shadow-[0_0_10px_rgba(0,255,255,0.2)]"
            >
              SEND_REQUEST
            </button>
          </div>

          <div className="flex-grow h-px bg-cyan-400/20 relative">
            <AnimatePresence onExitComplete={() => setIsSimulating(false)}>
              {isSimulating && (
                <motion.div 
                  initial={{ left: "0%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  onAnimationComplete={() => setIsSimulating(false)}
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rotate-45 shadow-[0_0_15px_rgba(0,255,255,1)]"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="w-32 h-32 border-2 border-cyan-400/40 bg-black/60 flex flex-col items-center justify-center p-4 relative">
            <Server className="w-10 h-10 text-cyan-400 mb-2 opacity-40" />
            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400/40">SERVER_GATEWAY</span>
          </div>

          <div className="flex-grow h-px bg-cyan-400/20 relative border-dashed" />

          <div className="w-32 h-32 border-2 border-cyan-400/20 bg-black/60 flex flex-col items-center justify-center p-4 relative opacity-40">
            <Database className="w-10 h-10 text-cyan-400 mb-2" />
            <span className="text-[8px] font-black uppercase tracking-widest text-cyan-400/40">PERSISTENCE_LAYER</span>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-2xl bg-black/40 border border-cyan-400/10 p-6 rounded-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">Response_Manifest</span>
          </div>
          <pre className="font-mono text-[10px] text-cyan-400/60 leading-relaxed overflow-x-auto whitespace-pre">
            {`HTTP/1.1 200 OK\nContent-Type: application/json\nX-Request-ID: 0x7F2A\n\n{\n  "status": "success",\n  "topic": "${topic.name}",\n  "protocol": "API_V1"\n}`}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-24 pb-32">
      {/* Back Nav */}
      <Link href="/apiviz/learn" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/40 hover:text-cyan-400 transition-colors group">
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        BACK_TO_MAP
      </Link>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-20">
        
        {/* Left Column: Theory & Context */}
        <div className="xl:col-span-4 space-y-16">
          
          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-[#d6f5f5]">{topic.name}</h1>
            <div className="p-6 border-l-4 border-cyan-400 bg-cyan-400/5">
              <p className="text-sm font-bold text-cyan-400/60 uppercase leading-relaxed italic">
                "{topic.description}"
              </p>
            </div>
          </div>

          {/* Analogy */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Repeat className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400/40">Real_World_Analogy</h2>
            </div>
            <p className="text-sm font-bold text-cyan-400/80 uppercase leading-relaxed border-2 border-cyan-400/10 p-8 bg-black/40">
              {topic.analogy}
            </p>
          </div>

          {/* Trade-offs & Mistakes */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-xs font-black uppercase tracking-widest text-amber-500/40">Tradeoffs_&_Constraints</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-[10px] font-bold text-cyan-400/40 uppercase leading-relaxed">
                <div className="w-1.5 h-1.5 bg-amber-500 mt-1 flex-shrink-0" />
                Abstraction layers improve maintenance but can increase latency.
              </li>
              <li className="flex items-start gap-4 text-[10px] font-bold text-cyan-400/40 uppercase leading-relaxed">
                <div className="w-1.5 h-1.5 bg-amber-500 mt-1 flex-shrink-0" />
                Over-generic schemas create complexity for simple clients.
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column: Visualization */}
        <div className="xl:col-span-8 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-cyan-400">
                <PlayCircle className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest italic">INTERACTIVE_TRACE</span>
              </div>
              <div className="text-[10px] font-black text-cyan-400/20 uppercase tracking-[0.2em]">NODE_FLOW_0x1</div>
            </div>
            
            <div className="border-2 border-cyan-400/20 bg-black/40 min-h-[600px] relative overflow-hidden">
              {renderVisualization()}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xs font-black uppercase tracking-widest text-cyan-400/40">Request_Specimen</h2>
            </div>
            <div className="bg-black/60 border-2 border-cyan-400/10 p-8 rounded-sm font-mono text-[11px] text-cyan-400/40 leading-relaxed overflow-x-auto italic">
              {`GET /api/v1/resources/${topic.slug} HTTP/1.1\nHost: cscosmos.api\nAuthorization: Bearer <JWT_TOKEN>\nAccept: application/json`}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
