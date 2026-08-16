import React from 'react';
import { Cpu, Github, Twitter, ExternalLink } from 'lucide-react';
import { Link } from '@/components/visualizers/shared/RouterShim';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-900 pt-12 pb-6 mt-16 transition-colors duration-300">
      <div className="container mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="p-1.5 rounded-md bg-evm-accent/10 text-evm-accent group-hover:bg-evm-accent/20 transition-colors">
                <Cpu size={16} />
              </div>
              <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-white">
                EVM<span className="text-evm-accent">Viz</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 leading-relaxed mb-4">
              A high-fidelity visual simulator for Ethereum Virtual Machine internals. Master the stack, memory, and storage through interactive execution.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-evm-accent hover:border-evm-accent transition-all">
                <Github size={14} />
              </a>
              <a href="#" className="p-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-blue-500 hover:border-blue-500 transition-all">
                <Twitter size={14} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4 uppercase text-[10px] tracking-widest">Learning</h4>
            <ul className="space-y-2.5 text-xs text-neutral-500">
              <li><Link to="/learn/intro" className="hover:text-evm-accent transition-colors">What is the EVM?</Link></li>
              <li><Link to="/learn/stack" className="hover:text-evm-accent transition-colors">Stack Machine Model</Link></li>
              <li><Link to="/learn/memory" className="hover:text-evm-accent transition-colors">Memory Layout</Link></li>
              <li><Link to="/learn/storage" className="hover:text-evm-accent transition-colors">Storage Persistence</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4 uppercase text-[10px] tracking-widest">Tools</h4>
            <ul className="space-y-2.5 text-xs text-neutral-500">
              <li><Link to="/playground" className="hover:text-evm-accent transition-colors">EVM Playground</Link></li>
              <li><a href="https://ethereum.org/en/developers/docs/evm/" target="_blank" rel="noopener noreferrer" className="hover:text-evm-accent transition-colors flex items-center gap-1.5">
                EVM Docs <ExternalLink size={10} />
              </a></li>
              <li><a href="https://www.evm.codes/" target="_blank" rel="noopener noreferrer" className="hover:text-evm-accent transition-colors flex items-center gap-1.5">
                Opcodes Reference <ExternalLink size={10} />
              </a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-900 dark:text-white mb-4 uppercase text-[10px] tracking-widest">Status</h4>
            <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-colors">
              <div className="flex items-center gap-1.5 text-xs font-mono text-green-600 dark:text-green-400 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Simulation Active
              </div>
              <p className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono">
                v0.1.0-alpha<br />
                Compiled: Dec 2025
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono uppercase tracking-wider">
            © 2025 EVMVIZ PROJECT. NO RIGHTS RESERVED. MIT LICENSE.
          </p>
          <p className="text-[10px] text-neutral-400 dark:text-neutral-700 font-mono italic">
            "The EVM is a state machine that transitions between states via transactions."
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
