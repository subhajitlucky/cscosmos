import { useState, useMemo } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Key, PenTool, ShieldCheck, ShieldAlert, Lock, Unlock } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';

export const TransactionViz = () => {
    const [sender, setSender] = useState('Alice');
    const [receiver, setReceiver] = useState('Bob');
    const [amount, setAmount] = useState('5');
    const [privateKey, setPrivateKey] = useState('8f2e...9a1c');
    const [isSigned, setIsSigned] = useState(false);
    const [tamperedAmount, setTamperedAmount] = useState<string | null>(null);

    // Derived: Current Data being viewed (either original or tampered)
    const currentAmount = tamperedAmount !== null ? tamperedAmount : amount;
    const txData = `{ "from": "${sender}", "to": "${receiver}", "amt": ${currentAmount} }`;
    
    // Simulate ECDSA signature (r, s) based on private key and original data
    const signature = useMemo(() => {
        const originalData = `{ "from": "${sender}", "to": "${receiver}", "amt": ${amount} }`;
        const hash = CryptoJS.SHA256(originalData + privateKey).toString();
        return {
            r: hash.substring(0, 32),
            s: hash.substring(32, 64)
        };
    }, [sender, receiver, amount, privateKey]);

    // Verification Logic: Does the current data + public key match the signature?
    const isValid = isSigned && tamperedAmount === null;

    const handleSign = () => {
        setIsSigned(true);
        setTamperedAmount(null);
    };

    const handleTamper = () => {
        setTamperedAmount((Math.random() * 100).toFixed(0));
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 py-4">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                
                {/* 1. The Input (The Intent) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">1</div>
                        <h3 className="font-black text-sm uppercase tracking-tighter">Construct Transaction</h3>
                    </div>
                    
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 relative overflow-hidden">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Sender</label>
                                <Input value={sender} onChange={(e) => {setSender(e.target.value); setIsSigned(false);}} className="h-8 text-xs font-mono" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase">Receiver</label>
                                <Input value={receiver} onChange={(e) => {setReceiver(e.target.value); setIsSigned(false);}} className="h-8 text-xs font-mono" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Amount (BTC)</label>
                            <Input type="number" value={amount} onChange={(e) => {setAmount(e.target.value); setIsSigned(false);}} className="h-8 text-xs font-mono" />
                        </div>
                        <div className="pt-2">
                             <label className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                                <Key className="w-3 h-3" /> Private Key (d)
                             </label>
                             <Input 
                                type="password" 
                                value={privateKey} 
                                onChange={(e) => {setPrivateKey(e.target.value); setIsSigned(false);}} 
                                className="h-8 text-xs font-mono bg-primary/5 border-primary/20" 
                             />
                        </div>

                        {!isSigned && (
                            <Button onClick={handleSign} className="w-full gap-2 mt-4 bg-primary hover:scale-[1.02] transition-transform">
                                <PenTool className="w-4 h-4" /> Sign Transaction
                            </Button>
                        )}
                    </div>
                </div>

                {/* 2. The Result (The Cryptography) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">2</div>
                        <h3 className="font-black text-sm uppercase tracking-tighter">Cryptographic Proof</h3>
                    </div>

                    <div className={cn(
                        "bg-card border-2 rounded-2xl p-6 shadow-xl transition-all duration-500 relative min-h-[280px]",
                        !isSigned ? "border-dashed border-border opacity-50" : isValid ? "border-green-500/50" : "border-destructive animate-shake"
                    )}>
                        {!isSigned ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
                                <Lock className="w-8 h-8 opacity-20" />
                                <p className="text-xs italic">Waiting for signature...</p>
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Signed Data Packet</span>
                                        {tamperedAmount && <span className="text-[10px] font-bold text-destructive flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> DATA TAMPERED</span>}
                                    </div>
                                    <div className={cn(
                                        "font-mono text-[10px] p-3 rounded-lg border transition-colors",
                                        tamperedAmount ? "bg-destructive/10 border-destructive text-destructive" : "bg-secondary text-foreground border-border"
                                    )}>
                                        {txData}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Signature (r, s)</span>
                                    <div className="grid grid-cols-1 gap-2">
                                        <div className="bg-primary/5 border border-primary/20 p-2 rounded font-mono text-[9px] truncate text-primary">
                                            r: {signature.r}
                                        </div>
                                        <div className="bg-primary/5 border border-primary/20 p-2 rounded font-mono text-[9px] truncate text-primary">
                                            s: {signature.s}
                                        </div>
                                    </div>
                                </div>

                                <div className={cn(
                                    "mt-4 p-3 rounded-xl flex items-center gap-3 transition-colors",
                                    isValid ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                                )}>
                                    {isValid ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold">{isValid ? "Signature Valid" : "Verification Failed"}</span>
                                        <span className="text-[9px] opacity-80">{isValid ? "Mathematics confirm origin and integrity" : "Hash mismatch: Data does not match signature"}</span>
                                    </div>
                                </div>

                                {isValid && (
                                    <Button variant="outline" size="sm" onClick={handleTamper} className="w-full mt-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive">
                                        <Unlock className="w-3 h-3 mr-2" /> Simulate Tampering
                                    </Button>
                                )}
                                
                                {tamperedAmount && (
                                    <Button variant="ghost" size="sm" onClick={() => setTamperedAmount(null)} className="w-full mt-2 text-xs">
                                        Revert to Original Data
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Engineer Insight */}
            <AnimatePresence>
                {isValid && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-lg flex items-start gap-4"
                    >
                        <div className="p-2 bg-white/20 rounded-lg">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">The Magic of Verification</h4>
                            <p className="text-xs opacity-80 leading-relaxed">
                                The network takes your <strong>Public Key</strong>, the <strong>Current Data</strong>, and the <strong>Signature (r, s)</strong>. 
                                It performs a curve point multiplication. If the result matches the signature's geometric position, it proves the data hasn't changed by even a single bit since it was signed.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};