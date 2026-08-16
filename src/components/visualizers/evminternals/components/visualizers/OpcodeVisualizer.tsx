import React from 'react';
import { OPCODES } from '../../lib/evm/opcodes';
import { Code2, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface OpcodeVisualizerProps {
  code: Uint8Array;
  pc: number;
}

const OpcodeVisualizer: React.FC<OpcodeVisualizerProps> = ({ code, pc }) => {
  // Parse bytecode into a list of instructions for display
  const instructions = [];
  let i = 0;
  while (i < code.length) {
    const opcode = code[i];
    const info = OPCODES[opcode] || { name: `UNKNOWN(0x${opcode.toString(16)})`, description: '' };
    
    let args = '';
    let jump = 1;
    
    if (opcode >= 0x60 && opcode <= 0x7f) {
      const size = opcode - 0x60 + 1;
      const val = code.slice(i + 1, i + 1 + size);
      args = Array.from(val).map(b => b.toString(16).padStart(2, '0')).join('');
      jump = 1 + size;
    }

    instructions.push({
      offset: i,
      opcode,
      name: info.name,
      args,
      size: jump,
      description: info.description
    });
    i += jump;
  }

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-900/30 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Program</h3>
          <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-600 dark:text-neutral-400 font-mono">
            {code.length} bytes
          </span>
        </div>
        <Code2 size={14} className="text-neutral-400 dark:text-neutral-600" />
      </div>

      <div className="flex-1 overflow-y-auto font-mono text-xs scrollbar-hide space-y-0.5">
        {instructions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-400 dark:text-neutral-700 text-center">
            <div className="text-xs italic">No bytecode loaded</div>
          </div>
        ) : (
          instructions.map((instr) => {
            const isActive = pc === instr.offset;
            const isTarget = pc > instr.offset && pc < instr.offset + instr.size;

            return (
              <div 
                key={instr.offset}
                className={`
                  group relative flex items-center gap-4 px-3 py-2 rounded-md transition-all duration-200
                  ${isActive 
                    ? 'bg-evm-accent/20 border-l-2 border-evm-accent translate-x-1' 
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/50 border-l-2 border-transparent'
                  }
                  ${isTarget ? 'bg-evm-accent/5' : ''}
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-pointer"
                    className="absolute -left-1 text-evm-accent"
                  >
                    <ChevronRight size={14} />
                  </motion.div>
                )}
                
                <span className={`w-8 text-[10px] ${isActive ? 'text-evm-accent font-bold' : 'text-neutral-400 dark:text-neutral-600'}`}>
                  {instr.offset.toString(16).padStart(4, '0')}
                </span>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`font-black uppercase tracking-tight ${isActive ? 'text-evm-accent' : 'text-neutral-600 dark:text-neutral-300'}`}>
                      {instr.name}
                    </span>
                    {instr.args && (
                      <span className="text-neutral-400 dark:text-neutral-500 truncate text-[10px]">
                        0x{instr.args}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[9px] text-neutral-500 dark:text-neutral-500 mt-1 leading-tight"
                    >
                      {instr.description}
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OpcodeVisualizer;
