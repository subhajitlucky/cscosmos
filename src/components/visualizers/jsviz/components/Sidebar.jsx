'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = ({ topics = [] }) => {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 hidden lg:block border-r border-brand-border bg-brand-black overflow-y-auto custom-scrollbar">
            <div className="p-6">
                <h3 className="text-xs font-bold text-brand-lime uppercase tracking-widest mb-6 border-b border-brand-border pb-2">
                    Index
                </h3>

                <nav className="space-y-8">
                    {topics.map((category) => (
                        <div key={category.title}>
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                                {category.title}
                            </h4>
                            <ul className="space-y-1 border-l border-brand-border ml-1">
                                {category.items.map((item) => {
                                    const isActive = pathname === `/jsviz/topic/${item.id}`;
                                    return (
                                        <li key={item.id}>
                                            <Link
                                                href={`/jsviz/topic/${item.id}`}
                                                className={`block pl-4 py-1 text-sm font-mono transition-colors border-l-2 -ml-[1px] ${isActive
                                                        ? 'text-brand-lime border-brand-lime bg-brand-zinc'
                                                        : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                                                    }`}
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
