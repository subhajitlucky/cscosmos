'use client';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Layout, Type, Box, Table, MousePointer } from 'lucide-react';
import clsx from 'clsx';

const topics = [
    { id: 'intro', title: 'Introduction', icon: Layout },
    { id: 'text', title: 'Text Formatting', icon: Type },
    { id: 'box-model', title: 'Box Model', icon: Box },
    { id: 'tables', title: 'Tables', icon: Table },
    { id: 'forms', title: 'Forms & Inputs', icon: MousePointer },
];

export default function Sidebar() {
    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-900/30 fixed left-0 top-16 bottom-0 overflow-y-auto p-4">
            <div className="mb-4 px-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Core Concepts</h3>
            </div>

            <div className="space-y-1">
                {topics.map((topic) => (
                    <NavLink
                        key={topic.id}
                        to={`/learn/${topic.id}`}
                        className={({ isActive }) => clsx(
                            "flex items-center justify-between px-3 py-2 rounded-lg transition-colors group",
                            isActive
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <topic.icon size={18} className="opacity-70" />
                            <span className="text-sm font-medium">{topic.title}</span>
                        </div>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                ))}
            </div>
        </aside>
    );
}
