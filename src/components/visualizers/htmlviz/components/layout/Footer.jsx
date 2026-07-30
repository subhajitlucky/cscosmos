'use client';
import React from 'react';
import { Code2, Github, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-border bg-surface py-12 mt-20">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Code2 className="text-dark" size={20} />
                    </div>
                    <span className="text-lg font-display font-bold text-white">
                        HTMLViz
                    </span>
                </div>

                <div className="text-sm text-slate-500">
                    © {new Date().getFullYear()} HTMLViz. Open Source Learning.
                </div>

                <div className="flex items-center gap-4">
                    <a href="https://github.com/subhajitlucky/htmlviz" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary transition-colors">
                        <Github size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
