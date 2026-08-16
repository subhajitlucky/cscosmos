import { useState } from 'react';
import { Button } from '../../ui/button';
import { FileCode, FileText, Database, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

type Transaction = {
    id: string;
    from: string;
    to: string;
    amt: number;
    type: 'coinbase' | 'standard';
};

const TXS: Transaction[] = [
    { id: "tx_000", from: "NETWORK", to: "MINER_01", amt: 6.25, type: 'coinbase' },
    { id: "tx_821", from: "Alice", to: "Bob", amt: 12.5, type: 'standard' },
    { id: "tx_104", from: "Charlie", to: "Dave", amt: 0.85, type: 'standard' },
    { id: "tx_559", from: "Bob", to: "Eve", amt: 2.10, type: 'standard' },
];

export const BlockBodyViz = () => {
    const [view, setView] = useState<'parsed' | 'raw'>('parsed');

    const toHex = (str: string) => {
        return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
            {/* Header / Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest">Block #742,104</h3>
                        <p className="text-[10px] text-muted-foreground">Payload Size: 1.24 MB • 4 Transactions</p>
                    </div>
                </div>

                <div className="flex bg-muted p-1 rounded-xl">
                    <Button 
                        variant={view === 'parsed' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setView('parsed')}
                        className="rounded-lg text-[10px] uppercase font-bold px-4"
                    >
                        <FileText className="w-3 h-3 mr-2" /> Human Readable
                    </Button>
                    <Button 
                        variant={view === 'raw' ? 'default' : 'ghost'} 
                        size="sm" 
                        onClick={() => setView('raw')}
                        className="rounded-lg text-[10px] uppercase font-bold px-4"
                    >
                        <FileCode className="w-3 h-3 mr-2" /> Raw Binary (Hex)
                    </Button>
                </div>
            </div>

            {/* Inspector Window */}
            <div className="bg-card border-2 border-border rounded-3xl shadow-xl overflow-hidden min-h-[350px]">
                <AnimatePresence mode="wait">
                    {view === 'parsed' ? (
                        <motion.div 
                            key="parsed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-0"
                        >
                            <table className="w-full text-left">
                                <thead className="bg-muted/50 border-b border-border">
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Route</th>
                                        <th className="px-6 py-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {TXS.map((tx) => (
                                        <tr key={tx.id} className={cn(
                                            "group hover:bg-primary/5 transition-colors",
                                            tx.type === 'coinbase' ? "bg-yellow-500/5" : ""
                                        )}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        tx.type === 'coinbase' ? "bg-yellow-500 animate-pulse" : "bg-primary/20"
                                                    )} />
                                                    <span className="font-mono text-[10px] font-bold">{tx.id}</span>
                                                    {tx.type === 'coinbase' && (
                                                        <span className="text-[8px] bg-yellow-500 text-white px-1.5 py-0.5 rounded font-black uppercase">Coinbase</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[11px] font-medium">
                                                    <span className={tx.type === 'coinbase' ? "text-yellow-600 font-bold" : "text-muted-foreground"}>{tx.from}</span>
                                                    <span className="mx-2 opacity-30">→</span>
                                                    <span className="text-foreground">{tx.to}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={cn(
                                                    "font-mono font-bold text-xs",
                                                    tx.type === 'coinbase' ? "text-yellow-600" : "text-primary"
                                                )}>
                                                    {tx.amt.toFixed(2)} BTC
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="raw"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-6 font-mono text-[10px] leading-relaxed break-all"
                        >
                            <div className="grid grid-cols-1 gap-4">
                                <div className="p-4 bg-muted/50 rounded-xl border border-border">
                                    <div className="text-[8px] font-bold text-muted-foreground uppercase mb-2">Block Body Header</div>
                                    <span className="text-primary font-bold">0100000004</span>
                                </div>
                                <div className="space-y-4">
                                    {TXS.map((tx, i) => (
                                        <div key={i} className="group relative">
                                            <div className="text-[8px] font-bold text-muted-foreground uppercase mb-1 flex justify-between">
                                                <span>Transaction {tx.id}</span>
                                                {tx.type === 'coinbase' && <span className="text-yellow-600">Reward Payload</span>}
                                            </div>
                                            <div className={cn(
                                                "p-3 rounded-lg border transition-all cursor-help",
                                                tx.type === 'coinbase' ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-700" : "bg-background border-border text-muted-foreground hover:border-primary/30"
                                            )}>
                                                {toHex(JSON.stringify(tx))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Insight Card */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-2xl flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                        <h4 className="text-[11px] font-black uppercase text-yellow-700">The Block Subsidy</h4>
                        <p className="text-[10px] text-yellow-800/70 leading-relaxed">
                            Every block starts with the <strong>Coinbase</strong>. It currently pays 6.25 BTC plus all transaction fees from the block. This is the heartbeat of the network's economy.
                        </p>
                    </div>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-start gap-3">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <div>
                        <h4 className="text-[11px] font-black uppercase text-primary">Wire Format Efficiency</h4>
                        <p className="text-[10px] text-primary/70 leading-relaxed">
                            Raw Hex view shows the <strong>serialized</strong> data. In production, field lengths are fixed and data is packed to ensure the block can travel the globe in milliseconds.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};