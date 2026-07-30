'use client';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ConceptCard({ id, title, description, icon: Icon, color }) {
    return (
        <Link
            to={`/learn/${id}`}
            className="group relative overflow-hidden bg-slate-800/50 border border-slate-700 hover:border-primary/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
        >
            <div className={`absolute top-0 right-0 p-32 bg-${color}-500/5 rounded-full blur-3xl group-hover:bg-${color}-500/10 transition-colors`} />

            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`text-${color}-400`} size={24} />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                    {description}
                </p>

                <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all">
                    Start Learning <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    );
}
