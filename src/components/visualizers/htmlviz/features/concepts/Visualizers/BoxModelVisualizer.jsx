import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function BoxModelVisualizer() {
    const [padding, setPadding] = useState(20);
    const [border, setBorder] = useState(5);
    const [margin, setMargin] = useState(20);

    return (
        <div className="bg-slate-900 rounded-xl p-8 border border-slate-800">
            <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Controls */}
                <div className="w-full md:w-64 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-400">Margin (px)</label>
                        <input
                            type="range" min="0" max="50" value={margin}
                            onChange={(e) => setMargin(Number(e.target.value))}
                            className="w-full accent-orange-500"
                        />
                        <div className="text-right text-xs text-slate-400">{margin}px</div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-yellow-400">Border (px)</label>
                        <input
                            type="range" min="0" max="20" value={border}
                            onChange={(e) => setBorder(Number(e.target.value))}
                            className="w-full accent-yellow-500"
                        />
                        <div className="text-right text-xs text-slate-400">{border}px</div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-green-400">Padding (px)</label>
                        <input
                            type="range" min="0" max="50" value={padding}
                            onChange={(e) => setPadding(Number(e.target.value))}
                            className="w-full accent-green-500"
                        />
                        <div className="text-right text-xs text-slate-400">{padding}px</div>
                    </div>
                </div>

                {/* Visualizer */}
                <div className="flex-1 flex items-center justify-center min-h-[400px] w-full bg-slate-950/50 rounded-lg overflow-hidden relative">

                    {/* Margin Box */}
                    <motion.div
                        animate={{ padding: margin }}
                        className="bg-orange-400/20 border border-orange-400/30 relative"
                    >
                        <div className="absolute top-1 left-2 text-[10px] text-orange-400 font-mono">MARGIN</div>

                        {/* Border Box */}
                        <motion.div
                            animate={{ padding: border }}
                            className="bg-yellow-400/20 border border-yellow-400/30 relative"
                        >
                            <div className="absolute top-1 left-2 text-[10px] text-yellow-400 font-mono">BORDER</div>

                            {/* Padding Box */}
                            <motion.div
                                animate={{ padding: padding }}
                                className="bg-green-400/20 border border-green-400/30 relative"
                            >
                                <div className="absolute top-1 left-2 text-[10px] text-green-400 font-mono">PADDING</div>

                                {/* Content Box */}
                                <div className="w-32 h-20 bg-blue-500 flex items-center justify-center text-white font-bold shadow-lg relative z-10">
                                    CONTENT
                                    <div className="absolute -bottom-6 text-[10px] text-blue-400 font-mono">128x80</div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <code className="text-sm font-mono text-slate-300">
                    <span className="text-purple-400">.box</span> {'{'} <br />
                    &nbsp;&nbsp;<span className="text-blue-400">width</span>: 128px;<br />
                    &nbsp;&nbsp;<span className="text-blue-400">height</span>: 80px;<br />
                    &nbsp;&nbsp;<span className="text-orange-400">margin</span>: {margin}px;<br />
                    &nbsp;&nbsp;<span className="text-yellow-400">border</span>: {border}px solid;<br />
                    &nbsp;&nbsp;<span className="text-green-400">padding</span>: {padding}px;<br />
                    {'}'}
                </code>
            </div>
        </div>
    );
}
