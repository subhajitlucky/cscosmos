import React, { useState } from 'react';
import { useBlockchain } from '../../lib/use-blockchain';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, ArrowRight, ShieldCheck, PenTool, Send, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';

export const TransactionCreator: React.FC = () => {
  const { addTransaction } = useBlockchain();
  const [sender, setSender] = useState('Alice');
  const [receiver, setReceiver] = useState('Bob');
  const [amount, setAmount] = useState(10);
  const [step, setStep] = useState(1); // 1: Construct, 2: Sign, 3: Broadcast

  const txHash = CryptoJS.SHA256(sender + receiver + amount).toString().substring(0, 16);

  const handleBroadcast = () => {
    addTransaction({ sender, receiver, amount });
    setStep(1);
    setAmount(Math.floor(Math.random() * 100));
  };

  return (
    <Card className="w-full bg-card border-border shadow-xl rounded-3xl overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-muted">
          <motion.div 
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-primary"
          />
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-black uppercase tracking-widest flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Forge Transaction
          </div>
          <span className="text-[10px] opacity-40">Step {step} of 3</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        <AnimatePresence mode="wait">
            {step === 1 && (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Sender</label>
                            <Input value={sender} onChange={(e) => setSender(e.target.value)} className="h-9 text-xs font-mono" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Receiver</label>
                            <Input value={receiver} onChange={(e) => setReceiver(e.target.value)} className="h-9 text-xs font-mono" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">Amount (BTC)</label>
                        <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="h-9 text-xs font-mono" />
                    </div>
                    <Button onClick={() => setStep(2)} className="w-full h-10 rounded-xl gap-2 mt-2">
                        Next <ArrowRight className="w-4 h-4" />
                    </Button>
                </motion.div>
            )}

            {step === 2 && (
                <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                >
                    <div className="bg-secondary/30 p-4 rounded-xl border border-border space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold opacity-50 uppercase">Payload Hash</span>
                            <span className="font-mono text-[10px] text-primary">{txHash}</span>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                                <Key className="w-3 h-3" /> ECDSA Private Key
                            </label>
                            <Input type="password" value="••••••••••••" disabled className="h-8 text-xs font-mono bg-background" />
                        </div>
                    </div>
                    <Button onClick={() => setStep(3)} className="w-full h-10 rounded-xl gap-2 bg-primary">
                        <PenTool className="w-4 h-4" /> Sign Transaction
                    </Button>
                    <Button variant="ghost" onClick={() => setStep(1)} className="w-full text-xs opacity-50">Back</Button>
                </motion.div>
            )}

            {step === 3 && (
                <motion.div 
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 text-center py-4"
                >
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2 text-green-500">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Authentication Success</h4>
                        <p className="text-[10px] text-muted-foreground">Digital signature verified and attached.</p>
                    </div>
                    <Button onClick={handleBroadcast} className="w-full h-12 rounded-xl gap-2 bg-primary shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs">
                        <Send className="w-4 h-4" /> Broadcast to Network
                    </Button>
                </motion.div>
            )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};