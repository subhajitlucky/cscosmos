'use client';
import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-brand-border bg-brand-black mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <span className="text-xl font-bold tracking-tighter text-white">
            JS_VIZ
          </span>
          <p className="mt-2 text-xs text-gray-500 font-mono uppercase tracking-widest">
            Engineered for clarity.
          </p>
        </div>

        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-brand-lime transition-colors">
            <Github size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-brand-lime transition-colors">
            <Twitter size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-brand-lime transition-colors">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
      <div className="border-t border-brand-border py-4 text-center">
        <p className="text-xs text-gray-600 font-mono">
          © {new Date().getFullYear()} JS VISUALIZER. SYSTEM OPERATIONAL.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
