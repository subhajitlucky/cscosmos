'use client';
import React from 'react';
import { Code2, Heart, Globe, Github } from 'lucide-react';

export default function About() {
    return (
        <div className="max-w-4xl mx-auto py-20">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-display font-bold text-white mb-6">About HTMLViz</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    A visual, interactive learning platform designed to help developers master HTML through intuition, not memorization.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-surface border border-white/10 rounded-2xl p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <Globe className="text-primary" size={24} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Our Mission</h3>
                    <p className="text-slate-400 leading-relaxed">
                        We believe that coding is best learned by doing and seeing. Traditional documentation is dry and abstract.
                        HTMLViz brings concepts to life with interactive visualizers and real-time feedback.
                    </p>
                </div>

                <div className="bg-surface border border-white/10 rounded-2xl p-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                        <Code2 className="text-primary" size={24} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-4">Open Source</h3>
                    <p className="text-slate-400 leading-relaxed">
                        This project is open source and built for the community. We welcome contributions, feedback, and new ideas
                        to make learning web development accessible to everyone.
                    </p>
                </div>
            </div>

            <div className="text-center border-t border-white/10 pt-16">
                <h3 className="text-2xl font-display font-bold text-white mb-8">Built with Modern Tech</h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Monaco Editor'].map((tech) => (
                        <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono text-sm">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
