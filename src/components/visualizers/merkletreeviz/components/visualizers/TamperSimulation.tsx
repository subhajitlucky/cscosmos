import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { sha256 } from '../../lib/merkle';

export const TamperSimulation = () => {
  const [data] = useState("Hello World");
  const [tampered, setTampered] = useState("Hello World");
  const [hash1, setHash1] = useState("");
  const [hash2, setHash2] = useState("");

  useEffect(() => { sha256(data).then(setHash1); }, [data]);
  useEffect(() => { sha256(tampered).then(setHash2); }, [tampered]);

  const isMatch = hash1 === hash2;
  
  const firstDiffIndex = data.split('').findIndex((char, i) => char !== tampered[i]);

  return (
    <div className="flex flex-col space-y-8 w-full max-w-sm">
      <div className="space-y-2">
        <label className="text-xs font-mono text-primary uppercase">Original Data</label>
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 text-sm font-mono tracking-widest">{data}</div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-accent uppercase flex justify-between">
          <span>Received Data</span>
          <span className="text-[10px] text-muted">(Try editing this!)</span>
        </label>
        <div className="relative group">
          <input 
            value={tampered}
            onChange={(e) => setTampered(e.target.value)}
            className={`w-full p-3 rounded-lg border-2 bg-transparent outline-none transition-all font-mono text-sm tracking-widest ${isMatch ? 'border-green-500/50 focus:border-green-500' : 'border-red-500/50 focus:border-red-500 ring-4 ring-red-500/5'}`}
            aria-invalid={!isMatch}
            aria-describedby="integrity-status"
          />
          {!isMatch && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-pulse">
                <AlertTriangle className="w-4 h-4" />
            </div>
          )}
        </div>
        {!isMatch && (
            <div className="text-[10px] font-bold text-red-500 flex items-center">
                <span className="mr-1">Mutation detected:</span>
                {firstDiffIndex !== -1 ? (
                    <span>Character at index {firstDiffIndex + 1} changed</span>
                ) : (
                    <span>Length mismatch ({tampered.length} vs {data.length})</span>
                )}
            </div>
        )}
      </div>
      
      <div 
        id="integrity-status"
        className={`p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-500 ${isMatch ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}
      >
        <div className="text-xs font-mono">
          <div className="opacity-50 uppercase mb-1">Integrity Status</div>
          <div className={`font-bold flex flex-col ${isMatch ? 'text-green-500' : 'text-red-500'}`}>
            <span className="text-lg">{isMatch ? 'VERIFIED' : 'COMPROMISED'}</span>
            <span className="text-[10px] opacity-80">{isMatch ? 'Data is authentic & secure' : 'Hashes do not match'}</span>
          </div>
        </div>
        {isMatch ? <CheckCircle className="w-8 h-8 text-green-500" /> : <AlertTriangle className="w-8 h-8 text-red-500" />}
      </div>
    </div>
  );
};
