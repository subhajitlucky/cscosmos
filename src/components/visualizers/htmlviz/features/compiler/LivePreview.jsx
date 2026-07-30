'use client';
import React from 'react';

export default function LivePreview({ code }) {
    return (
        <div className="h-full w-full rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-white">
            <div className="h-9 bg-slate-100 border-b border-slate-200 flex items-center px-4 justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Browser Preview</span>
                </div>
                <div className="text-[10px] text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                    localhost:3000
                </div>
            </div>
            <iframe
                title="preview"
                srcDoc={code}
                className="w-full h-[calc(100%-36px)] bg-white"
                sandbox="allow-scripts"
            />
        </div>
    );
}
