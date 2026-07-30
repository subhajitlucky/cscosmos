'use client';
import { motion } from "framer-motion";
import { CheckCircle, XCircle, ShieldCheck, Globe, Image as ImageIcon, FileCode } from "lucide-react";
import { useState } from "react";
import { Label } from "../ui/label";

// Mock Switch component since I didn't create ui/switch yet
function SimpleSwitch({ checked, onCheckedChange, id }: { checked: boolean, onCheckedChange: (c: boolean) => void, id: string }) {
  return (
    <button
        id={id}
        onClick={() => onCheckedChange(!checked)}
        className={`w-10 h-5 rounded-full relative transition-colors ${checked ? 'bg-green-500' : 'bg-slate-300'}`}
    >
        <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  );
}

export function CspBuilder() {
  const [allowSelf, setAllowSelf] = useState(true);
  const [allowGoogle, setAllowGoogle] = useState(false);
  const [allowInline, setAllowInline] = useState(false);

  const resources = [
    {
       id: 1,
       type: "script",
       url: "/js/app.js (Self)",
       origin: "self",
       icon: FileCode,
    },
    {
       id: 2,
       type: "script",
       url: "https://analytics.google.com/...",
       origin: "google",
       icon: Globe,
    },
    {
       id: 3,
       type: "script",
       url: "<script>alert('xss')</script>",
       origin: "inline",
       icon: FileCode,
    },
    {
       id: 4,
       type: "image",
       url: "/img/logo.png (Self)",
       origin: "self",
       icon: ImageIcon,
    },
    {
       id: 5,
       type: "script",
       url: "https://evil.com/miner.js",
       origin: "evil",
       icon: Globe,
    }
  ];

  const checkAllowed = (res: any) => {
      if (res.origin === 'self') return allowSelf;
      if (res.origin === 'google') return allowGoogle;
      if (res.origin === 'inline') return allowInline;
      return false; // Evil always blocked in this simple demo unless we had 'allow all'
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 border rounded-xl p-8 flex flex-col gap-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
         <div className="text-xs font-mono text-muted-foreground">VISUALIZATION: CSP POLICY BUILDER</div>
         <div className="flex items-center gap-2 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded text-xs font-mono">
            <ShieldCheck className="h-4 w-4" />
            <span>Current Policy</span>
         </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         {/* Policy Controls */}
         <div className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg border shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2">Policy Directives</h3>
            
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="self" className="text-base font-medium">script-src 'self'</Label>
                    <p className="text-xs text-muted-foreground">Allow scripts from my own domain</p>
                </div>
                <SimpleSwitch id="self" checked={allowSelf} onCheckedChange={setAllowSelf} />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="google" className="text-base font-medium">script-src google.com</Label>
                    <p className="text-xs text-muted-foreground">Allow scripts from trusted partner</p>
                </div>
                <SimpleSwitch id="google" checked={allowGoogle} onCheckedChange={setAllowGoogle} />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label htmlFor="inline" className="text-base font-medium text-red-500">unsafe-inline</Label>
                    <p className="text-xs text-muted-foreground">Allow inline &lt;script&gt; tags (Dangerous!)</p>
                </div>
                <SimpleSwitch id="inline" checked={allowInline} onCheckedChange={setAllowInline} />
            </div>

            <div className="mt-6 p-3 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs break-all">
                <span className="text-blue-600 dark:text-blue-400">Content-Security-Policy:</span> default-src 'self'; script-src 
                {allowSelf ? " 'self'" : ""} 
                {allowGoogle ? " https://analytics.google.com" : ""}
                {allowInline ? " 'unsafe-inline'" : ""};
            </div>
         </div>

         {/* Resource Simulator */}
         <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Browser Resource Loader</h3>
            
            <div className="space-y-3">
               {resources.map((res) => {
                   const isAllowed = checkAllowed(res);
                   return (
                       <motion.div 
                          key={res.id}
                          layout
                          initial={false}
                          animate={{ 
                              opacity: isAllowed ? 1 : 0.5,
                              borderColor: isAllowed ? "rgb(34 197 94)" : "rgb(239 68 68)",
                              backgroundColor: isAllowed ? "rgba(34, 197, 94, 0.05)" : "rgba(239, 68, 68, 0.05)"
                          }}
                          className="border rounded-lg p-3 flex items-center justify-between"
                       >
                           <div className="flex items-center gap-3 overflow-hidden">
                               <res.icon className="h-5 w-5 text-slate-500 shrink-0" />
                               <div className="flex flex-col min-w-0">
                                   <span className="text-sm font-medium truncate">{res.url}</span>
                                   <span className="text-[10px] text-muted-foreground uppercase">{res.type} • {res.origin}</span>
                               </div>
                           </div>
                           
                           <div className="shrink-0 ml-2">
                               {isAllowed ? (
                                   <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                       <CheckCircle className="h-4 w-4" /> Allowed
                                   </div>
                               ) : (
                                   <div className="flex items-center gap-1 text-red-600 text-xs font-bold">
                                       <XCircle className="h-4 w-4" /> Blocked
                                   </div>
                               )}
                           </div>
                       </motion.div>
                   );
               })}
            </div>
         </div>
      </div>
    </div>
  );
}
