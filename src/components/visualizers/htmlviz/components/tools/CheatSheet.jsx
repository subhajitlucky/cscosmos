'use client';
import React, { useState } from 'react';
import { X, FileText, Copy, Check } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

const CHEAT_SHEET_DATA = [
    {
        title: "Boilerplate",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body>
  
</body>
</html>`
    },
    {
        title: "Image",
        code: `<img src="url" alt="desc">`
    },
    {
        title: "Link",
        code: `<a href="url">Link</a>`
    },
    {
        title: "List",
        code: `<ul>
  <li>Item</li>
</ul>`
    },
    {
        title: "Table",
        code: `<table>
  <tr>
    <td>Data</td>
  </tr>
</table>`
    },
    {
        title: "Form",
        code: `<form>
  <input type="text">
  <button>Submit</button>
</form>`
    }
];

export default function CheatSheet() {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 z-40 bg-primary text-dark font-bold px-4 py-3 rounded-full shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
            >
                <FileText size={20} />
                <span className="hidden md:inline">Cheat Sheet</span>
            </button>

            {/* Slide-over Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-dark border-l border-white/10 z-50 shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-surface/50">
                                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                    <FileText className="text-primary" /> Quick Reference
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {CHEAT_SHEET_DATA.map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                                                {item.title}
                                            </h3>
                                            <button
                                                onClick={() => handleCopy(item.code, index)}
                                                className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
                                            >
                                                {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedIndex === index ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                        <div className="bg-surface border border-white/5 rounded-lg p-3 font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre">
                                            {item.code}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-white/10 bg-surface/50 text-center">
                                <p className="text-xs text-slate-500">
                                    Pro Tip: Use <code className="text-primary">Ctrl+Space</code> in VS Code for autocomplete.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
