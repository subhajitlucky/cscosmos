'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Settings2, RefreshCw, Laptop, Terminal, 
  Globe, ShieldCheck, Plus, X, Eye, Code, List, Copy
} from 'lucide-react';
import FlowVisualizer from '../components/visualizations/FlowVisualizer';

interface Header {
  id: string;
  key: string;
  value: string;
}

const Playground = () => {
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [cacheEnabled, setCacheEnabled] = useState(true);
  const [status, setStatus] = useState('200');
  const [latency, setLatency] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<{ id: number, text: string, type: 'info' | 'success' | 'error' }[]>([]);
  const [activeResponseTab, setActiveResponseTab] = useState<'visual' | 'raw' | 'headers'>('visual');
  const [requestHeaders, setRequestHeaders] = useState<Header[]>([
    { id: '1', key: 'Accept', value: 'application/json' },
    { id: '2', key: 'User-Agent', value: 'WebProtocols/1.0' }
  ]);
  const [cookies, setCookies] = useState<Record<string, string>>({ 'pref_theme': 'dark' });
  const [response, setResponse] = useState<{ status: string, headers: Record<string, string>, body: string } | null>(null);

  const copyAsCurl = () => {
    let curl = `curl -X ${method} 'https://api.webprotocols.dev/api/v1/resource'`;
    requestHeaders.forEach(h => {
      if (h.key && h.value) curl += ` \\\n  -H '${h.key}: ${h.value}'`;
    });
    // Add cookies to curl
    const cookieStr = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
    if (cookieStr) curl += ` \\\n  -b '${cookieStr}'`;
    
    navigator.clipboard.writeText(curl);
    setLogs(prev => [{ id: Date.now(), text: `[SYSTEM] Copied as cURL command`, type: 'info' }, ...prev]);
  };

  const presets = {
    'REST_API': {
      method: 'GET' as const,
      status: '200',
      headers: [
        { id: '1', key: 'Accept', value: 'application/json' },
        { id: '2', key: 'Authorization', value: 'Bearer token_123' }
      ]
    },
    'STATIC_FILE': {
      method: 'GET' as const,
      status: '304',
      headers: [
        { id: '1', key: 'If-None-Match', value: '"v2.1"' },
        { id: '2', key: 'Accept', value: 'image/webp' }
      ]
    },
    'FORM_SUBMIT': {
      method: 'POST' as const,
      status: '200',
      headers: [
        { id: '1', key: 'Content-Type', value: 'application/json' }
      ]
    }
  };

  const applyPreset = (name: keyof typeof presets) => {
    const p = presets[name];
    setMethod(p.method);
    setStatus(p.status);
    setRequestHeaders(p.headers);
    setLogs(prev => [{ id: Date.now(), text: `[SYSTEM] Applied ${name.replace('_', ' ')} preset`, type: 'info' }, ...prev]);
  };

  const addHeader = () => {
    setRequestHeaders([...requestHeaders, { id: Math.random().toString(), key: '', value: '' }]);
  };

  const removeHeader = (id: string) => {
    setRequestHeaders(requestHeaders.filter(h => h.id !== id));
  };

  const updateHeader = (id: string, field: 'key' | 'value', val: string) => {
    setRequestHeaders(requestHeaders.map(h => h.id === id ? { ...h, [field]: val } : h));
  };

  const runSimulation = () => {
    setIsRunning(true);
    setResponse(null);
    const startTime = Date.now();
    
    const requestLog = { 
      id: Date.now(), 
      text: `[REQUEST] ${method} /api/v1/resource HTTP/1.1`, 
      type: 'info' as const 
    };
    setLogs(prev => [requestLog, ...prev].slice(0, 15));

    // Simulate DNS and Connection
    setTimeout(() => {
      setLogs(prev => [{ id: Date.now(), text: `[TCP] Connection established with 93.184.216.34:443`, type: 'info' as const }, ...prev]);
    }, 400);

    setTimeout(() => {
      const isCacheHit = cacheEnabled && status === '304';
      const endTime = Date.now();
      const actualLatency = endTime - startTime;

      const resHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Date': new Date().toUTCString(),
        'Server': 'WebProtocols-Edge/2.1',
        'X-Cache': isCacheHit ? 'HIT' : 'MISS'
      };

      if (cacheEnabled) {
        resHeaders['Cache-Control'] = 'public, max-age=3600';
      }

      const resBody = status === '200' ? JSON.stringify({ id: 101, name: "Playground Resource", status: "active" }, null, 2) : "";

      setResponse({
        status,
        headers: resHeaders,
        body: resBody
      });

      const responseLog = { 
        id: Date.now() + 1, 
        text: `[RESPONSE] HTTP/1.1 ${status} (${actualLatency}ms)`, 
        type: (status === '200' || status === '304' ? 'success' : 'error') as 'success' | 'error'
      };
      setLogs(prev => [responseLog, ...prev].slice(0, 15));
      setIsRunning(false);
    }, latency);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
           <Terminal size={16} /> Advanced Lab
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight dark:text-white transition-colors">Protocol Playground</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl transition-colors">The ultimate sandbox for web developers. Experiment with headers, latency, and cache behaviors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 transition-colors">
            <div className="flex items-center justify-between border-b dark:border-slate-800 pb-4">
               <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Settings2 size={18} className="text-primary" /> Request
               </div>
               <div className="flex gap-2">
                 <button 
                  onClick={() => setLogs([])}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                  title="Clear Logs"
                 >
                   <RefreshCw size={14} />
                 </button>
                 <button 
                  onClick={runSimulation}
                  disabled={isRunning}
                  className="bg-primary text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {isRunning ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
                  Send
                </button>
               </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase text-slate-400">Presets</label>
                <button 
                  onClick={copyAsCurl}
                  className="flex items-center gap-1 text-[8px] font-bold text-primary hover:text-primary/80 transition-colors uppercase"
                >
                  <Copy size={10} /> Copy cURL
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(presets).map(name => (
                  <button
                    key={name}
                    onClick={() => applyPreset(name as any)}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-bold text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    {name.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Config */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Method</label>
                  <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Status</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all dark:text-white"
                  >
                    <option value="200">200 OK</option>
                    <option value="304">304 Cache</option>
                    <option value="404">404 Error</option>
                    <option value="500">500 Crash</option>
                  </select>
               </div>
            </div>

            {/* Latency Slider */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <label className="text-[10px] font-bold uppercase text-slate-400">Latency (RTT)</label>
                <span className="text-[10px] font-bold text-primary">{latency}ms</span>
              </div>
              <input 
                type="range" min="100" max="5000" step="100"
                value={latency}
                onChange={(e) => setLatency(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Headers Editor */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase text-slate-400">Request Headers</label>
                <button onClick={addHeader} className="text-primary hover:text-primary/80 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto overflow-x-hidden pr-3 custom-scrollbar">
                {requestHeaders.map((h) => (
                  <div key={h.id} className="flex gap-2 items-center group">
                    <input 
                      placeholder="Key"
                      value={h.key}
                      onChange={(e) => updateHeader(h.id, 'key', e.target.value)}
                      className="w-[38%] bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-mono focus:outline-none dark:text-slate-300 min-w-0 flex-shrink-0 transition-colors"
                    />
                    <input 
                      placeholder="Value"
                      value={h.value}
                      onChange={(e) => updateHeader(h.id, 'value', e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-mono focus:outline-none dark:text-slate-300 min-w-0 transition-colors"
                    />
                    <button 
                      onClick={() => removeHeader(h.id)} 
                      className="text-slate-300 hover:text-red-500 transition-colors p-0.5 flex-shrink-0"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cookies Editor */}
            <div className="space-y-3">
               <label className="text-[10px] font-bold uppercase text-slate-400">Active Cookies</label>
               <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-800 space-y-2">
                  {Object.entries(cookies).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center text-[10px] font-mono">
                       <span className="text-primary">{k}</span>
                       <span className="text-slate-500 dark:text-slate-400 truncate max-w-[100px]">{v}</span>
                       <button onClick={() => {
                         const next = { ...cookies };
                         delete next[k];
                         setCookies(next);
                       }} className="text-red-400 opacity-0 group-hover:opacity-100"><X size={10}/></button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setCookies({ ...cookies, [`session_${Math.floor(Math.random()*100)}`]: 'active_user' })}
                    className="w-full py-1 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-[8px] font-bold text-slate-400 hover:text-primary transition-colors"
                  >
                    + INJECT AUTH COOKIE
                  </button>
               </div>
            </div>

            <div className="pt-4 border-t dark:border-slate-800 space-y-4">
               <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border dark:border-slate-800 font-mono text-[9px] text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between mb-2 border-b dark:border-slate-800 pb-1">
                     <span className="uppercase font-bold">Raw Request Preview</span>
                     <span className="text-primary animate-pulse">LIVE</span>
                  </div>
                  <div>{method} /api/v1/resource HTTP/1.1</div>
                  <div>Host: api.webprotocols.dev</div>
                  {requestHeaders.filter(h => h.key && h.value).map(h => (
                    <div key={h.id}>{h.key}: {h.value}</div>
                  ))}
                  {(method === 'POST' || method === 'PUT') && (
                    <div className="mt-2 text-amber-500">{'{ "data": "..." }'}</div>
                  )}
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className={cacheEnabled ? 'text-green-500' : 'text-slate-300'} />
                    <span className="text-xs font-bold dark:text-slate-300 transition-colors">Persistent Cache</span>
                  </div>
                  <button 
                    onClick={() => setCacheEnabled(!cacheEnabled)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${cacheEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <motion.div 
                      animate={{ x: cacheEnabled ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
               </div>
            </div>
          </div>

          {/* Console Output */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-6 shadow-xl overflow-hidden relative transition-colors border dark:border-slate-800">
             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                <Terminal size={12} /> Live Traffic
             </div>
             <div className="space-y-2 h-40 overflow-y-auto font-mono text-[10px] custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {logs.length === 0 && <div className="text-slate-600 italic">No activity detected...</div>}
                  {logs.map((log) => (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`${log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-slate-300'}`}
                    >
                      <span className="opacity-50 mr-2">{new Date(log.id).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      {log.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Right Column: Visualization & Response */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-3xl shadow-sm min-h-[600px] flex flex-col relative overflow-hidden transition-colors">
              {/* Tabs */}
              <div className="flex border-b dark:border-slate-800 px-6">
                 {[
                   { id: 'visual', label: 'Visualization', icon: Eye },
                   { id: 'raw', label: 'Raw Body', icon: Code },
                   { id: 'headers', label: 'Response Headers', icon: List }
                 ].map((tab) => (
                   <button
                    key={tab.id}
                    onClick={() => setActiveResponseTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all relative ${activeResponseTab === tab.id ? 'text-primary' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                   >
                     <tab.icon size={14} />
                     {tab.label}
                     {activeResponseTab === tab.id && (
                       <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                     )}
                   </button>
                 ))}
              </div>

              <div className="flex-1 p-8 flex flex-col">
                 <AnimatePresence mode="wait">
                    {activeResponseTab === 'visual' && (
                      <motion.div 
                        key="visual"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center relative"
                      >
                         <div className="absolute top-0 left-0 flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-tighter transition-colors">
                                <Laptop size={12} /> Browser
                            </div>
                            <div className="w-4 h-px bg-slate-200 dark:bg-slate-800" />
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-colors ${cacheEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <ShieldCheck size={12} /> {cacheEnabled ? 'Cache Layer' : 'No Cache'}
                            </div>
                         </div>

                         <div className="w-full flex-1 flex items-center justify-center">
                            <FlowVisualizer type={status === '304' ? 'validation' : status === '200' ? 'cycle' : 'status'} />
                         </div>
                      </motion.div>
                    )}

                    {activeResponseTab === 'raw' && (
                      <motion.div 
                        key="raw"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 font-mono text-sm dark:text-slate-300 overflow-auto transition-colors"
                      >
                         {response ? (
                           <pre className="whitespace-pre-wrap">{response.body || "// Empty response body"}</pre>
                         ) : (
                           <div className="h-full flex items-center justify-center text-slate-400 italic">Execute a request to see the body</div>
                         )}
                      </motion.div>
                    )}

                    {activeResponseTab === 'headers' && (
                      <motion.div 
                        key="headers"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-1 space-y-3"
                      >
                         {response ? (
                           <div className="grid grid-cols-1 gap-2">
                              {Object.entries(response.headers).map(([k, v]) => (
                                <div key={k} className="flex justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border dark:border-slate-800 transition-colors">
                                   <span className="font-mono text-xs font-bold text-primary">{k}:</span>
                                   <span className="font-mono text-xs text-slate-600 dark:text-slate-400 truncate ml-4">{v}</span>
                                </div>
                              ))}
                           </div>
                         ) : (
                           <div className="h-full flex items-center justify-center text-slate-400 italic">Execute a request to see response headers</div>
                         )}
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Status Bar */}
              <div className="bg-slate-50 dark:bg-slate-800/50 border-t dark:border-slate-800 p-4 flex justify-between items-center transition-colors">
                 <div className="flex gap-6">
                    <div className="flex flex-col">
                       <span className="text-[8px] font-bold uppercase text-slate-400">Status</span>
                       <span className={`text-xs font-bold ${status === '200' ? 'text-green-500' : 'text-red-500'}`}>{response ? `${status} ${status === '200' ? 'OK' : 'Error'}` : '---'}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-bold uppercase text-slate-400">Time</span>
                       <span className="text-xs font-bold dark:text-slate-300">{isRunning ? '...' : response ? `${latency}ms` : '---'}</span>
                    </div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Connected</span>
                 </div>
              </div>
           </div>

           <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-6 rounded-3xl flex gap-4 transition-colors">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100 dark:border-slate-800 shrink-0">
                 <Globe size={24} />
              </div>
              <div className="space-y-1">
                 <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm">Pro Tip: Cache Control</h4>
                 <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                   Try setting the Status to **304 Cache** and observe the "X-Cache" header in the Response Headers tab. This simulates a conditional request where the server tells the browser to use its local copy.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;