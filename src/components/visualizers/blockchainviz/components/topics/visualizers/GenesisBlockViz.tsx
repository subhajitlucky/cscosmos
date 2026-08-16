import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export const GenesisBlockViz = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-card border-4 border-primary rounded-xl p-8 max-w-lg shadow-2xl"
            >
                <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground px-4 py-1 rounded font-bold shadow-lg">
                    Block #0
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-border pb-4">
                        <div className="space-y-1">
                            <div className="text-xs uppercase text-muted-foreground font-bold">Previous Hash</div>
                            <div className="font-mono text-sm">00000000000000000000000000000000</div>
                        </div>
                        <div className="text-xs text-muted-foreground">Null / Void</div>
                    </div>

                    <div className="bg-secondary/30 p-4 rounded-lg border border-border relative">
                        <Quote className="absolute -top-3 -left-2 w-8 h-8 text-primary/20 fill-primary/20" />
                        <p className="font-serif italic text-lg text-center px-4 py-2">
                            "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
                        </p>
                        <div className="text-right text-xs text-muted-foreground mt-2">— Coinbase Data (Hex Decoded)</div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Timestamp:</span>
                            <span className="font-mono">2009-01-03 18:15:05</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Nonce:</span>
                            <span className="font-mono">2083236893</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reward:</span>
                            <span className="font-mono text-primary font-bold">50 BTC</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
