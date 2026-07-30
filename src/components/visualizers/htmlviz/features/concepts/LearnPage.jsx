'use client';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ConceptCard from './ConceptCard';
import { Layout, Type, Box, Table, MousePointer } from 'lucide-react';

const concepts = [
    { id: 'intro', title: 'Introduction', description: 'Start your journey here. Understand the basic structure of an HTML document.', icon: Layout, color: 'blue' },
    { id: 'text', title: 'Text Formatting', description: 'Learn how to format text with headings, paragraphs, bold, and italic tags.', icon: Type, color: 'green' },
    { id: 'box-model', title: 'Box Model', description: 'Master the core concept of layout: Margins, Borders, Padding, and Content.', icon: Box, color: 'orange' },
    { id: 'tables', title: 'Tables', description: 'Organize data into rows and columns using HTML tables.', icon: Table, color: 'purple' },
    { id: 'forms', title: 'Forms & Inputs', description: 'Collect user input with text fields, checkboxes, and buttons.', icon: MousePointer, color: 'pink' },
];

export default function LearnPage() {
    const location = useLocation();
    const isRoot = location.pathname === '/learn';

    if (!isRoot) return <Outlet />;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold text-white mb-4">Interactive HTML Course</h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                    Master HTML through visual examples and interactive exercises. Pick a topic below to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {concepts.map((concept) => (
                    <ConceptCard key={concept.id} {...concept} />
                ))}
            </div>
        </div>
    );
}
