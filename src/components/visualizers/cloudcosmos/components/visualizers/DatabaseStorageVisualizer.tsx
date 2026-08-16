import { motion } from "framer-motion";
import { Table, Box, Layers, Share2 } from "lucide-react";

interface Props {
  mode: 'rds' | 'nosql' | 's3';
}

export function DatabaseStorageVisualizer({ mode }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 w-full py-4">
      <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
        {mode === 'rds' && (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className="p-4 border-2 border-primary/20 rounded-xl flex flex-col items-center gap-2 transition-colors hover:bg-primary/10"
              >
                <Table className="h-6 w-6 text-primary" />
                <span className="text-[8px] font-mono">Table_{i}</span>
              </motion.div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
               <Share2 className="h-32 w-32" />
            </div>
          </div>
        )}

        {mode === 'nosql' && (
          <div className="flex flex-col gap-3 w-full px-8">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 border-2 border-indigo-500/20 bg-indigo-500/5 rounded-xl flex items-center gap-3"
              >
                <Layers className="h-5 w-5 text-indigo-500" />
                <div className="flex-1 space-y-1">
                   <div className="h-1.5 w-full bg-indigo-500/20 rounded-full" />
                   <div className="h-1.5 w-2/3 bg-indigo-500/10 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {mode === 's3' && (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
              <motion.div
                key={i}
                whileHover={{ y: -5, scale: 1.1 }}
                className="p-3 glass border rounded-xl flex items-center justify-center shadow-sm"
              >
                <Box className="h-5 w-5 text-primary/60" />
              </motion.div>
            ))}
            <div className="absolute -bottom-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              Flat Key-Value Namespace
            </div>
          </div>
        )}
      </div>

      <div className="w-full px-6 text-center">
        {mode === 'rds' && <p className="text-[10px] text-muted-foreground leading-relaxed">Relational: Strict schema, joins, and ACID compliance. Best for complex queries.</p>}
        {mode === 'nosql' && <p className="text-[10px] text-muted-foreground leading-relaxed">NoSQL: Flexible schema, key-value or document based. Built for infinite horizontal scale.</p>}
        {mode === 's3' && <p className="text-[10px] text-muted-foreground leading-relaxed">Object: Immutable files with metadata. Extremely durable and virtually unlimited capacity.</p>}
      </div>
    </div>
  );
}
