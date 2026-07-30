'use client';

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-lime-400/30">
            <Navbar />

            <main className="pt-24 min-h-screen">
                <div className="max-w-7xl mx-auto px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
