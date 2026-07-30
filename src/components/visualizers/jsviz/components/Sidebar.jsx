'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ topics = [] }) => {
    const pathname = usePathname();

    return (
        <aside 
            className="w-64 h-[calc(100vh-4rem)] sticky top-16 hidden lg:block border-r overflow-y-auto custom-scrollbar transition-colors duration-200"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-main)' }}
        >
            <div className="p-6">
                <h3 className="text-xs font-bold text-brand-lime uppercase tracking-widest mb-6 border-b pb-2" style={{ borderColor: 'var(--border-main)' }}>
                    // Curriculum Index
                </h3>

                <nav className="space-y-8">
                    {topics.map((category) => (
                        <div key={category.title}>
                            <h4 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-60" style={{ color: 'var(--text-muted)' }}>
                                {category.title}
                            </h4>
                            <ul className="space-y-1 border-l ml-1" style={{ borderColor: 'var(--border-main)' }}>
                                {category.items.map((item) => {
                                    const isActive = pathname === `/jsviz/topic/${item.id}`;
                                    return (
                                        <li key={item.id}>
                                            <Link
                                                href={`/jsviz/topic/${item.id}`}
                                                className={`block pl-4 py-1.5 text-xs font-mono transition-all border-l-2 -ml-[1px] ${isActive
                                                        ? 'text-brand-lime border-brand-lime bg-brand-lime/10 font-bold'
                                                        : 'border-transparent hover:text-brand-lime hover:border-brand-lime/50'
                                                    }`}
                                                style={{ color: isActive ? undefined : 'var(--text-muted)' }}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
