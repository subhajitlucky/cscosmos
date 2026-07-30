'use client';
import React, { useState } from 'react';
import { TopicLayout } from '../components/TopicLayout';
import { motion } from 'framer-motion';
import { Keyboard, HardDrive, Network, MousePointer2, Cpu, ArrowRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const IOBasics: React.FC = () => {
  const [ioType, setIoType] = useState<'blocking' | 'non-blocking'>('blocking');
  const { theme } = useTheme();

  return (
    <TopicLayout stepNumber={6} title="Input / Output (I/O)">
      <div className="space-y-12">
        <section className={cn(
          "space-y-4",
          theme === 'dark' ? "text-slate-300" : "text-slate-700"
        )}>
          <p>
            Programs are useless if they can't interact with the world. <strong>I/O</strong> is how a program gets data (Input) and sends data out (Output).
          </p>
          <p>
            Common I/O devices include the keyboard, mouse, monitor, storage disks, and network cards.
          </p>
        </section>

        {/* Visualization: Program to Device Flow */}
        <div className={cn(
          "rounded-2xl p-8 border transition-colors duration-300",
          theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        )}>
          <h3 className={cn(
            "text-center mb-12 uppercase tracking-widest text-sm font-semibold",
            theme === 'dark' ? "text-slate-400" : "text-slate-500"
          )}>The I/O Path</h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-12">
            <div className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border w-32 transition-colors",
              theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100 shadow-inner"
            )}>
              <Cpu className="w-8 h-8 text-blue-500" />
              <span className="text-xs font-bold">Your Program</span>
            </div>

            <div className="flex flex-col items-center">
              <motion.div 
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className={theme === 'dark' ? "text-slate-600" : "text-slate-300"} />
              </motion.div>
              <span className={cn("text-[10px] uppercase font-bold mt-2", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>System Call</span>
            </div>

            <div className={cn(
              "p-4 border-2 rounded-xl text-center w-40 transition-colors",
              theme === 'dark' ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"
            )}>
              <span className={cn("text-xs font-bold uppercase block mb-2", theme === 'dark' ? "text-slate-400" : "text-slate-500")}>Operating System</span>
              <div className="h-1 bg-blue-600 rounded-full w-full" />
            </div>

            <div className="flex flex-col items-center">
              <motion.div 
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <ArrowRight className={theme === 'dark' ? "text-slate-600" : "text-slate-300"} />
              </motion.div>
              <span className={cn("text-[10px] uppercase font-bold mt-2", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>Driver</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[Keyboard, HardDrive, Network, MousePointer2].map((Icon, i) => (
                <div key={i} className={cn(
                  "p-3 rounded-lg border transition-colors",
                  theme === 'dark' ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100 shadow-sm"
                )}>
                  <Icon className="w-5 h-5 text-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blocking vs Non-Blocking Interaction */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold">How Programs Wait</h3>
          <div className={cn(
            "flex p-1 rounded-lg w-fit transition-colors",
            theme === 'dark' ? "bg-slate-900" : "bg-slate-100"
          )}>
            <button 
              onClick={() => setIoType('blocking')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-bold transition-all",
                ioType === 'blocking' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : (theme === 'dark' ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-600")
              )}
            >
              Blocking
            </button>
            <button 
              onClick={() => setIoType('non-blocking')}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-bold transition-all",
                ioType === 'non-blocking' 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                  : (theme === 'dark' ? "text-slate-500 hover:text-white" : "text-slate-400 hover:text-slate-600")
              )}
            >
              Non-Blocking
            </button>
          </div>

          <div className={cn(
            "border rounded-xl p-8 overflow-hidden relative transition-colors",
            theme === 'dark' ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          )}>
             <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className={cn("w-20 text-xs font-mono", theme === 'dark' ? "text-slate-500" : "text-slate-400")}>PROGRAM</div>
                  <div className={cn(
                    "flex-1 h-2 rounded-full relative overflow-hidden transition-colors",
                    theme === 'dark' ? "bg-slate-800" : "bg-slate-100"
                  )}>
                    <motion.div 
                      className={`absolute inset-0 ${ioType === 'blocking' ? 'bg-red-500/40' : 'bg-green-500/40'}`}
                      animate={ioType === 'blocking' ? { x: ['-100%', '0%', '-100%'] } : {}}
                      transition={{ duration: 4, repeat: Infinity }}
                    />
                  </div>
                </div>
                <p className={cn("text-sm", theme === 'dark' ? "text-slate-400" : "text-slate-600")}>
                  {ioType === 'blocking' 
                    ? "The program stops execution entirely until the I/O operation (like reading a file) is finished. It's simple but can feel slow."
                    : "The program tells the OS what it wants, then continues doing other work. It checks back later to see if the data is ready."}
                </p>
             </div>
          </div>
        </div>
      </div>
    </TopicLayout>
  );
};
