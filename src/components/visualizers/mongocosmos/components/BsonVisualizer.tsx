'use client';

import React, { useState } from 'react';
import { Binary, Check, Copy, HelpCircle, Layers, Sparkles } from 'lucide-react';

interface BsonElement {
  tag: string;
  typeName: string;
  fieldName: string;
  hexBytes: string[];
  explanation: string;
  size: number;
}

const PRESETS = [
  {
    name: 'User Profile (Strings & Integers)',
    doc: { _id: 'u1', name: 'Alice Chen', age: 29, active: true },
    elements: [
      {
        tag: '0x07',
        typeName: 'ObjectId (12 bytes)',
        fieldName: '_id',
        hexBytes: ['07', '5f', '69', '64', '00', '65', 'e3', '1f', '8a', '3b', '01', 'a2', '44', '5c', '90', '11', '02'],
        explanation: 'ObjectId: 4-byte timestamp, 5-byte random value, 3-byte incrementing counter.',
        size: 17
      },
      {
        tag: '0x02',
        typeName: 'UTF-8 String',
        fieldName: 'name',
        hexBytes: ['02', '6e', '61', '6d', '65', '00', '0b', '00', '00', '00', '41', '6c', '69', '63', '65', '20', '43', '68', '65', '6e', '00'],
        explanation: 'String: Type tag (0x02) + cstring key "name\0" + 4-byte length (11) + "Alice Chen\0".',
        size: 21
      },
      {
        tag: '0x10',
        typeName: '32-bit Integer',
        fieldName: 'age',
        hexBytes: ['10', '61', '67', '65', '00', '1d', '00', '00', '00'],
        explanation: 'int32: Type tag (0x10) + cstring key "age\0" + 4-byte little-endian value (29 = 0x1D).',
        size: 9
      },
      {
        tag: '0x08',
        typeName: 'Boolean',
        fieldName: 'active',
        hexBytes: ['08', '61', '63', '74', '69', '76', '65', '00', '01'],
        explanation: 'Boolean: Type tag (0x08) + cstring key "active\0" + 1-byte value (0x01 = true).',
        size: 9
      }
    ],
    totalDocSize: 61
  },
  {
    name: 'E-Commerce Order (Array & Timestamp)',
    doc: { orderId: 1042, total: 249.99, tags: ['hardware', 'usb'], paidAt: '2026-03-01T00:00:00Z' },
    elements: [
      {
        tag: '0x10',
        typeName: '32-bit Integer',
        fieldName: 'orderId',
        hexBytes: ['10', '6f', '72', '64', '65', '72', '49', '64', '00', '12', '04', '00', '00'],
        explanation: 'int32: Type tag (0x10) + key "orderId\0" + 4-byte little endian (1042 = 0x0412).',
        size: 13
      },
      {
        tag: '0x01',
        typeName: '64-bit Double',
        fieldName: 'total',
        hexBytes: ['01', '74', '6f', '74', '61', '6c', '00', '71', '3d', '0a', 'd7', 'a3', '3f', '6f', '40'],
        explanation: 'Double: Type tag (0x01) + key "total\0" + 8-byte IEEE 754 float (249.99).',
        size: 15
      },
      {
        tag: '0x04',
        typeName: 'BSON Array (Subdocument)',
        fieldName: 'tags',
        hexBytes: ['04', '74', '61', '67', '73', '00', '28', '00', '00', '00', '02', '30', '00', '...'],
        explanation: 'Array: Stored as subdocument where keys are string indexes "0\0", "1\0" prefixed with 4-byte size.',
        size: 40
      },
      {
        tag: '0x09',
        typeName: 'UTC DateTime',
        fieldName: 'paidAt',
        hexBytes: ['09', '70', '61', '69', '64', '41', '74', '00', '00', '34', 'b2', '89', '9f', '01', '00', '00'],
        explanation: 'UTC DateTime: Type tag (0x09) + key "paidAt\0" + 8-byte signed int milliseconds since epoch.',
        size: 16
      }
    ],
    totalDocSize: 89
  }
];

export function BsonVisualizer() {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [activeElementIdx, setActiveElementIdx] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const current = PRESETS[selectedPreset];
  const activeElement = activeElementIdx !== null ? current.elements[activeElementIdx] : null;

  const handleCopyBson = () => {
    const allHex = [
      '// 4-byte Little Endian Total Length Header:',
      `${current.totalDocSize.toString(16).padStart(2, '0')} 00 00 00`,
      '// Elements:',
      ...current.elements.map((el) => `${el.fieldName}: ${el.hexBytes.join(' ')}`),
      '// 1-byte Document Null Terminator:',
      '00'
    ].join('\n');
    navigator.clipboard.writeText(allHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-4 sm:p-6 text-card-foreground">
      {/* Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
              <Binary className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-foreground">BSON Binary Byte Layout Inspector</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Explore how MongoDB serializes JSON documents into binary BSON with length headers for O(1) field navigation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setSelectedPreset(idx);
                setActiveElementIdx(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedPreset === idx
                  ? 'bg-foreground text-background font-semibold shadow-xs'
                  : 'border border-border bg-card hover:bg-muted/40 text-muted-foreground'
              }`}
            >
              Preset {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Top Spec Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">BSON Total Size</div>
          <div className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {current.totalDocSize} bytes
          </div>
          <div className="text-[10px] text-muted-foreground">Incl. 4B header &amp; 1B \0</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Elements Count</div>
          <div className="text-lg font-bold font-mono text-foreground">{current.elements.length} fields</div>
          <div className="text-[10px] text-muted-foreground">Type tagged</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Field Traversal</div>
          <div className="text-lg font-bold font-mono text-foreground">O(1) Jump</div>
          <div className="text-[10px] text-muted-foreground">Via length headers</div>
        </div>
        <div className="p-3 rounded-lg border border-border bg-muted/20">
          <div className="text-[11px] text-muted-foreground font-medium">Max Document Size</div>
          <div className="text-lg font-bold font-mono text-foreground">16 MB</div>
          <div className="text-[10px] text-muted-foreground">Hard engine limit</div>
        </div>
      </div>

      {/* Interactive Element Stream */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Document Byte Stream (Click to inspect field)
          </span>
          <button
            type="button"
            onClick={handleCopyBson}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Hex'}</span>
          </button>
        </div>

        {/* Binary Byte Blocks */}
        <div className="p-4 rounded-xl border border-border bg-muted/10 font-mono text-xs space-y-3 overflow-x-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-border/60">
            <span className="text-muted-foreground text-[11px] mr-2">Header:</span>
            <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold">
              {current.totalDocSize.toString(16).padStart(2, '0')} 00 00 00
            </div>
            <span className="text-[11px] text-muted-foreground ml-2">(4-byte little-endian int32 total length)</span>
          </div>

          {/* Fields */}
          <div className="space-y-2 pt-1">
            {current.elements.map((el, idx) => {
              const isSelected = activeElementIdx === idx;
              return (
                <div
                  key={el.fieldName}
                  onClick={() => setActiveElementIdx(idx)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 shadow-xs'
                      : 'border-border/60 bg-card hover:border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-bold text-foreground">
                      {el.tag}
                    </span>
                    <span className="font-bold text-foreground">"{el.fieldName}":</span>
                    <span className="text-muted-foreground text-[11px] font-sans">{el.typeName}</span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap text-muted-foreground">
                    {el.hexBytes.slice(0, 10).map((byte, bIdx) => (
                      <span
                        key={bIdx}
                        className={`px-1 py-0.5 rounded text-[11px] ${
                          bIdx === 0
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold'
                            : 'bg-muted/60 text-foreground'
                        }`}
                      >
                        {byte}
                      </span>
                    ))}
                    {el.hexBytes.length > 10 && <span className="text-[10px] text-muted-foreground">...</span>}
                    <span className="text-[10px] font-sans text-muted-foreground ml-2">({el.size} B)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Null Terminator */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/60">
            <span className="text-muted-foreground text-[11px] mr-2">Terminator:</span>
            <div className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold">
              00
            </div>
            <span className="text-[11px] text-muted-foreground ml-2">(1-byte null terminator 0x00)</span>
          </div>
        </div>
      </div>

      {/* Selected Element Detail Inspector */}
      {activeElement && (
        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-xs font-bold">
                {activeElement.tag}
              </span>
              <h4 className="text-sm font-bold text-foreground">
                Field "{activeElement.fieldName}" • {activeElement.typeName}
              </h4>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{activeElement.size} Bytes total</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{activeElement.explanation}</p>
        </div>
      )}

      {/* Architectural Takeaway Alert */}
      <div className="p-3.5 rounded-lg border border-border bg-muted/20 text-xs text-muted-foreground flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground">Why BSON over JSON? </span>
          JSON is text-based and requires full stream parsing ($O(N)$) to find an inner property. BSON embeds length headers for each document and string, letting WiredTiger jump directly to the target byte offset in $O(1)$ time.
        </div>
      </div>
    </div>
  );
}
