import React from 'react';
import { useParams, Navigate, Link } from '@/components/visualizers/shared/RouterShim';
import { TOPICS } from '../data/topics';
import { 
  ArrowLeft, BookOpen, Clock, HardDrive, AlertTriangle, 
  Terminal, ChevronLeft, ChevronRight, GitFork, RotateCw, 
  Layers, Scissors, ShieldAlert, Cpu, Search, Binary, List,
  Hash, Zap
} from 'lucide-react';
import { AlgorithmVisualizer } from '../components/visualizers/AlgorithmVisualizer';
import { StringRow } from '../components/visualizers/StringBox';
import { naiveMatch } from '../algorithms/naiveMatching';
import { kmpMatch, computePrefixFunction } from '../algorithms/kmp';
import { rabinKarpMatch } from '../algorithms/rabinKarp';
import { boyerMooreMatch } from '../algorithms/boyerMoore';
import { zMatch } from '../algorithms/zAlgorithm';
import { rleEncode } from '../algorithms/rle';
import { trieInsert, type TrieNode } from '../algorithms/trie';
import { bwtTransform } from '../algorithms/bwt';
import { Table as TableIcon } from 'lucide-react';

export const TopicDetail: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topicIndex = TOPICS.findIndex(t => t.id === topicId);
  const topic = TOPICS[topicIndex];

  if (!topic) {
    return <Navigate to="/learn" replace />;
  }

  const prevTopic = topicIndex > 0 ? TOPICS[topicIndex - 1] : null;
  const nextTopic = topicIndex < TOPICS.length - 1 ? TOPICS[topicIndex + 1] : null;

  const renderVisualizer = () => {
    switch (topicId) {
      case 'intro-to-strings': {
        const text = "HELLO";
        return (
          <div className="flex flex-col items-center gap-8 py-4">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Memory Layout (C-Style String)</span>
              <div className="flex gap-1">
                {text.split('').map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                      <span className="text-xl font-bold text-brand-500">{c}</span>
                      <span className="text-[10px] font-mono text-slate-400">0x{c.charCodeAt(0).toString(16).toUpperCase()}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">ptr+{i}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center gap-1">
                  <div className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <span className="text-xl font-bold text-slate-300">\0</span>
                    <span className="text-[10px] font-mono text-slate-300">0x00</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Term</span>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'ascii-encoding': {
        const sample = "Hi!";
        return (
          <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
             {sample.split('').map((c, i) => (
               <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center bg-brand-500 text-white rounded-lg text-2xl font-bold">{c}</div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Decimal</span>
                    <span className="text-lg font-mono font-bold">{c.charCodeAt(0)}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Binary (7-bit)</span>
                    <span className="text-[10px] font-mono bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">{c.charCodeAt(0).toString(2).padStart(7, '0')}</span>
                  </div>
               </div>
             ))}
          </div>
        );
      }
      case 'utf8-encoding': {
        const utf8Sample = ["A", "©", "λ", "🌍"];
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {utf8Sample.map((c, i) => {
              const bytes = new TextEncoder().encode(c);
              return (
                <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-6 shadow-sm">
                  <div className="w-14 h-14 flex items-center justify-center bg-indigo-500 text-white rounded-lg text-2xl font-bold">{c}</div>
                  <div className="flex-1 overflow-hidden">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{bytes.length} Byte Sequence</div>
                    <div className="font-mono text-sm text-indigo-500 font-bold whitespace-nowrap overflow-x-auto">
                      {Array.from(bytes).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }
      case 'utf16-utf32': {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-brand-500 shadow-sm flex flex-col items-center gap-4">
               <div className="text-xs font-bold text-brand-500 uppercase tracking-widest">UTF-16 (JavaScript/C#)</div>
               <div className="flex gap-2">
                 <div className="px-3 py-2 bg-brand-500 text-white rounded font-mono text-xs shadow-inner">0xD83D</div>
                 <div className="px-3 py-2 bg-brand-500 text-white rounded font-mono text-xs shadow-inner">0xDE80</div>
               </div>
               <p className="text-[10px] text-slate-500 text-center">Uses 2 or 4 bytes. Emojis use "Surrogate Pairs".</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center gap-4">
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">UTF-32 (Python Ints)</div>
               <div className="px-6 py-2 bg-emerald-500 text-white rounded font-mono text-sm shadow-inner">0x0001F680</div>
               <p className="text-[10px] text-slate-500 text-center">Always 4 bytes. Simple indexing, heavy memory.</p>
            </div>
          </div>
        );
      }
      case 'code-points-units': {
        return (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg w-full max-w-2xl">
              <div className="flex items-center justify-around mb-8 border-b border-slate-100 dark:border-slate-700 pb-8">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Visual Character</span>
                  <div className="text-6xl bg-slate-50 dark:bg-slate-900 w-24 h-24 rounded-2xl flex items-center justify-center shadow-inner">𐐷</div>
                </div>
                <div className="text-4xl text-slate-200">→</div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">One Code Point</span>
                  <div className="text-2xl font-mono text-brand-500 font-bold">U+10437</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800">
                  <span className="text-[10px] font-bold text-brand-500 uppercase block mb-2">UTF-16 Units</span>
                  <div className="font-mono text-sm font-bold text-center">["\uD801", "\uDC37"]</div>
                  <div className="text-[10px] text-slate-500 mt-2 text-center">Length: 2</div>
                </div>
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase block mb-2">Code Points</span>
                  <div className="font-mono text-sm font-bold text-center">[0x10437]</div>
                  <div className="text-[10px] text-slate-500 mt-2 text-center">Array.from(str).length: 1</div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'grapheme-clusters': {
        const emoji = "👨‍👩‍👧‍👦";
        const parts = ["👨", "‍", "👩", "‍", "👧", "‍", "👦"];
        return (
          <div className="flex flex-col items-center gap-12 w-full py-4">
            <div className="flex flex-col items-center gap-4">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">1 Grapheme Cluster (User View)</span>
               <div className="w-28 h-24 bg-white dark:bg-slate-800 border-2 border-brand-500 text-white rounded-3xl flex items-center justify-center text-6xl shadow-xl">
                 {emoji}
               </div>
            </div>
            <div className="flex flex-col items-center gap-6">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">7 Hidden Code Points</span>
               <div className="flex gap-1 flex-wrap justify-center">
                 {parts.map((p, i) => (
                   <div key={i} className="flex flex-col items-center gap-2">
                     <div className="w-10 h-10 border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center text-sm shadow-sm">
                       {p === "‍" ? <span className="text-[8px] font-bold text-rose-500">ZWJ</span> : p}
                     </div>
                     <span className="text-[8px] font-mono text-slate-400">U+{p.codePointAt(0)?.toString(16).toUpperCase()}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        );
      }
      case 'indexing-pitfalls': {
        return (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-200 dark:border-rose-800 p-8 rounded-2xl w-full max-w-2xl shadow-sm">
               <h3 className="text-rose-600 dark:text-rose-400 font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                 <AlertTriangle size={16} /> Dangerous: str[1]
               </h3>
               <div className="flex flex-col gap-8">
                  <div className="flex gap-1 justify-center">
                    <div className="w-12 h-12 border-2 rounded bg-white flex items-center justify-center font-bold">A</div>
                    <div className="w-32 h-12 border-2 border-brand-500 bg-brand-50 rounded flex items-center justify-center font-bold">🌍</div>
                    <div className="w-12 h-12 border-2 rounded bg-white flex items-center justify-center font-bold">C</div>
                  </div>
                  <div className="grid grid-cols-2 gap-8 pt-4 border-t border-rose-100 dark:border-rose-900/30">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Intent (Char at 1)</span>
                      <div className="text-4xl">🌍</div>
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-rose-500 uppercase block mb-2">Reality (Unit at 1)</span>
                      <div className="text-2xl font-mono text-rose-600 font-bold">0xD83D</div>
                      <span className="text-[8px] text-rose-400 block mt-1">"High Surrogate" - Corrupted!</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        );
      }
      case 'substring-ops': {
        return (
          <div className="flex flex-col items-center gap-8 py-8 w-full">
            <div className="flex flex-col gap-6 items-center w-full">
              <div className="flex flex-col gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source String</span>
                <div className="flex gap-1">
                  {"STRING".split('').map((c, i) => (
                    <div key={i} className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center font-bold transition-colors ${i < 3 ? 'border-brand-500 bg-brand-50' : 'border-slate-200'}`}>{c}</div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-brand-500 font-mono font-bold animate-pulse">
                <Scissors size={20} /> slice(0, 3)
              </div>
              <div className="flex flex-col gap-2 items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New String / View</span>
                <div className="flex gap-1">
                  {"STR".split('').map((c, i) => (
                    <div key={i} className="w-12 h-12 border-2 border-brand-500 bg-brand-50 rounded-lg flex items-center justify-center font-bold text-brand-600">{c}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      case 'naive-matching': {
        const text = "ABCABCD";
        const pattern = "ABCD";
        const result = naiveMatch(text, pattern);
        return (
          <AlgorithmVisualizer 
            steps={result.steps}
            renderStep={(step) => (
              <div className="flex flex-col gap-12 w-full items-center">
                <StringRow text={text} highlightedIndices={step.highlightedIndices} label="Text (N)" />
                <div style={{ transform: `translateX(${(step.index * 28) - (text.length * 14) + (pattern.length * 14)}px)` }}>
                  <StringRow text={pattern} highlightedIndices={step.secondaryHighlightedIndices} label="Pattern (M)" />
                </div>
              </div>
            )}
          />
        );
      }
      case 'prefix-function': {
        const pText = "ABABCABA";
        const { steps } = computePrefixFunction(pText);
        return (
          <AlgorithmVisualizer 
            steps={steps}
            renderStep={(step) => (
              <div className="flex flex-col gap-12 w-full items-center">
                <StringRow text={pText} highlightedIndices={step.highlightedIndices} secondaryHighlightedIndices={step.secondaryHighlightedIndices} label="Building Pattern Pi" />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <TableIcon size={14} /> Pi Table
                  </div>
                  <div className="flex gap-1">
                    {step.state.pi && step.state.pi.map((val: number, i: number) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono text-sm transition-colors ${i === step.index ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-100 dark:border-slate-800'}`}>
                          {val}
                        </div>
                        <span className="text-[8px] font-mono text-slate-400">{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          />
        );
      }
      case 'kmp-algorithm': {
        const kText = "ABABDABACDABABCABAB";
        const kPattern = "ABABCABAB";
        const kResult = kmpMatch(kText, kPattern);
        return (
          <AlgorithmVisualizer 
            steps={kResult.steps}
            renderStep={(step) => (
              <div className="flex flex-col gap-12 w-full items-center">
                <StringRow text={kText} highlightedIndices={step.highlightedIndices} matchedIndices={step.matches} label="Text" />
                <div style={{ transform: `translateX(${(step.index * 28) - (step.innerIndex! * 28) - (kText.length * 14) + (kPattern.length * 14)}px)` }}>
                  <StringRow text={kPattern} highlightedIndices={step.secondaryHighlightedIndices} label="Pattern" />
                </div>
                {step.state.pi && (
                  <div className="flex flex-col items-center gap-2 mt-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                      <TableIcon size={14} /> KMP Prefix Jump Table
                    </div>
                    <div className="flex gap-1">
                      {step.state.pi.map((val: number, i: number) => (
                        <div key={i} className={`w-8 h-8 flex items-center justify-center border-2 rounded font-mono text-xs transition-colors ${i === step.innerIndex ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-100 dark:border-slate-800'}`}>
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          />
        );
      }
      case 'z-algorithm': {
        const zText = "ABABDABAC";
        const zPattern = "ABA";
        const zResult = zMatch(zText, zPattern);
        const concat = zPattern + "$" + zText;
        return (
          <AlgorithmVisualizer 
            steps={zResult.steps}
            renderStep={(step) => (
              <div className="flex flex-col gap-12 w-full items-center">
                <StringRow 
                  label="Concatenated (P + $ + T)"
                  text={concat}
                  highlightedIndices={step.highlightedIndices}
                  secondaryHighlightedIndices={step.secondaryHighlightedIndices}
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <TableIcon size={14} /> Z-Array (LCP with Prefix)
                  </div>
                  <div className="flex gap-1">
                    {step.state.z && step.state.z.map((val: number, i: number) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono text-sm transition-colors ${i === step.index ? 'border-brand-500 bg-brand-50 text-brand-700' : (i >= step.state.l && i <= step.state.r) ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-100 dark:border-slate-800'}`}>
                          {val}
                        </div>
                        <span className="text-[8px] text-slate-400">{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          />
        );
      }
      case 'rabin-karp': {
        const rText = "ABABCABABD";
        const rPattern = "ABABD";
        const rResult = rabinKarpMatch(rText, rPattern);
        return (
          <AlgorithmVisualizer 
            steps={rResult.steps}
            renderStep={(step) => (
              <div className="flex flex-col gap-12 w-full items-center">
                <StringRow text={rText} highlightedIndices={step.highlightedIndices} matchedIndices={step.matches} label="Text" />
                <div style={{ transform: `translateX(${(step.index * 28) - (rText.length * 14) + (rPattern.length * 14)}px)` }}>
                  <StringRow text={rPattern} highlightedIndices={Array.from({length: rPattern.length}, (_, i) => i)} label="Pattern" />
                </div>
                <div className="flex gap-8 mt-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><Hash size={14} /> Pattern Hash</div>
                    <div className="w-24 h-12 flex items-center justify-center border-2 border-brand-500 bg-brand-50 rounded-xl font-mono text-lg font-bold text-brand-700">{step.state.p}</div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest"><Hash size={14} /> Sliding Hash</div>
                    <div className={`w-24 h-12 flex items-center justify-center border-2 rounded-xl font-mono text-lg font-bold transition-colors ${step.state.p === step.state.t ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-400'}`}>{step.state.t}</div>
                  </div>
                </div>
              </div>
            )}
          />
        );
      }
      case 'boyer-moore': {
        const bmText = "FINDINAHAYSTACKNEEDLE";
        const bmPattern = "NEEDLE";
        const bmResult = boyerMooreMatch(bmText, bmPattern);
        return (
          <AlgorithmVisualizer 
            steps={bmResult.steps}
            renderStep={(step) => (
              <div className="flex flex-col gap-12 w-full items-center">
                <StringRow text={bmText} highlightedIndices={step.highlightedIndices} matchedIndices={step.matches} label="Text" />
                <div style={{ transform: `translateX(${(step.index * 28) - (bmText.length * 14) + (bmPattern.length * 14)}px)` }}>
                  <StringRow text={bmPattern} highlightedIndices={step.secondaryHighlightedIndices} label="Pattern (Right-to-Left)" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex gap-8 items-center shadow-sm">
                   <div className="flex flex-col items-center">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Phase</span>
                      <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">{step.state.phase}</span>
                   </div>
                   <div className="w-px h-8 bg-slate-100 dark:bg-slate-700" />
                   <div className="flex flex-col items-center">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">Shift</span>
                      <span className="text-xs font-mono font-bold">{step.state.shift || 0}</span>
                   </div>
                </div>
              </div>
            )}
          />
        );
      }
      case 'rolling-hash': {
        const rhText = "PETERPIPE";
        const rhPattern = "PIPE";
        const rhResult = rabinKarpMatch(rhText, rhPattern);
        return (
          <AlgorithmVisualizer 
            steps={rhResult.steps}
            renderStep={(step) => (
              <div className="flex flex-col gap-12 w-full items-center">
                <StringRow text={rhText} highlightedIndices={step.highlightedIndices} label="Current Window" />
                <div className="w-full max-w-xl bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border-2 border-brand-500/20 shadow-inner">
                  <div className="flex flex-col gap-6 font-mono">
                    <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-800 pb-4">
                      <span className="text-slate-500 uppercase font-bold text-[10px]">Operation</span>
                      <span className="font-bold text-brand-500">{step.description}</span>
                    </div>
                    {step.state.prevT !== undefined && (
                      <div className="flex items-center justify-center gap-4 py-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                         <div className="text-rose-500 flex flex-col items-center"><span className="text-[8px] uppercase font-bold">Pop</span><span className="text-lg font-bold">-{step.state.outChar}</span></div>
                         <ArrowLeft className="text-slate-300" size={16} />
                         <div className="flex flex-col items-center px-4"><span className="text-[8px] text-slate-400 uppercase font-bold">Value</span><span className="text-2xl font-bold">{step.state.t}</span></div>
                         <ArrowLeft className="text-slate-300 rotate-180" size={16} />
                         <div className="text-emerald-500 flex flex-col items-center"><span className="text-[8px] uppercase font-bold">Push</span><span className="text-lg font-bold">+{step.state.nextChar}</span></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
        );
      }
      case 'collision-handling': {
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-brand-500 shadow-md">
                <div className="flex items-center gap-2 text-brand-500 font-bold mb-6 text-xs uppercase tracking-widest"><ShieldAlert size={16} /> Chaining (Linked Lists)</div>
                <div className="space-y-3">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="w-8 h-8 border-2 border-slate-100 dark:border-slate-700 rounded flex items-center justify-center font-mono text-xs font-bold">{i}</div>
                      {i === 1 ? (
                        <div className="flex gap-1 animate-in slide-in-from-left">
                          <div className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-200 dark:border-brand-800 rounded text-[10px] font-bold font-mono">"cat"</div>
                          <div className="w-4 h-0.5 bg-slate-300 mt-3" />
                          <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-800 rounded text-[10px] font-bold font-mono text-amber-600">"act"</div>
                        </div>
                      ) : <div className="w-8 h-0.5 bg-slate-100 dark:bg-slate-800" />}
                    </div>
                  ))}
                </div>
             </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 font-bold mb-6 text-xs uppercase tracking-widest"><Search size={16} /> Open Addressing</div>
                <div className="space-y-2">
                  {[0, 1, 2, 3].map(i => (
                    <div key={i} className={`w-full h-10 border-2 rounded px-4 flex items-center font-mono text-xs ${i === 2 ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold' : 'border-slate-50 dark:border-slate-900 opacity-40'}`}>
                      {i}: {i === 1 ? '"busy"' : i === 2 ? '"collision_probed"' : "empty"}
                    </div>
                  ))}
                </div>
             </div>
          </div>
        );
      }
      case 'suffix-arrays': {
        const sortedSuffixes = ["A", "ANA", "ANANA", "BANANA", "NA", "NANA"];
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest mb-2">Original String: BANANA</span>
              {["BANANA", "ANANA", "NANA", "ANA", "NA", "A"].map((s, i) => (
                <div key={i} className="p-2 border border-slate-100 dark:border-slate-800 rounded font-mono text-xs bg-slate-50/50 dark:bg-slate-900/50">[{i}] {s}</div>
              ))}
            </div>
            <div className="flex flex-col gap-2 animate-in fade-in duration-1000">
              <span className="text-[10px] font-bold text-brand-500 text-center uppercase tracking-widest mb-2">Sorted Suffix Array</span>
              {sortedSuffixes.map((s, i) => (
                <div key={i} className="p-2 border-2 border-brand-500 bg-brand-50 dark:bg-brand-900/20 rounded font-mono text-xs font-bold text-brand-700">{s}</div>
              ))}
            </div>
          </div>
        );
      }
      case 'suffix-trees': {
        return (
          <div className="flex flex-col items-center gap-8 w-full py-8">
            <div className="bg-slate-950 rounded-3xl p-12 relative overflow-hidden w-full max-w-2xl border-4 border-brand-500/20 shadow-2xl">
               <div className="flex items-center justify-center gap-16 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50" />
                  <div className="flex flex-col gap-12">
                    <div className="flex gap-12">
                       <div className="px-4 py-2 rounded-lg border-2 border-brand-400 bg-brand-900/40 text-white font-mono text-xs shadow-sm">BAN$</div>
                       <div className="px-4 py-2 rounded-lg border-2 border-brand-400 bg-brand-900/40 text-white font-mono text-xs shadow-sm">ANA$</div>
                    </div>
                    <div className="flex gap-12 ml-12">
                       <div className="px-4 py-2 rounded-lg border-2 border-brand-400 bg-brand-900/40 text-white font-mono text-xs shadow-sm">NA$</div>
                       <div className="px-4 py-2 rounded-lg border-2 border-brand-400 bg-brand-900/40 text-white font-mono text-xs shadow-sm">$</div>
                    </div>
                  </div>
               </div>
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0ea5e9_1px,transparent_1px)] [background-size:24px_24px]" />
               <div className="absolute bottom-4 right-8 text-[10px] font-bold text-brand-500 uppercase tracking-widest animate-pulse">Rooted Compressed Suffix Trie</div>
            </div>
          </div>
        );
      }
      case 'lcp-array': {
        const suffixes = ["A", "ANA", "ANANA"];
        return (
          <div className="flex flex-col items-center gap-8 w-full py-4">
            <div className="flex flex-col gap-4 w-full max-w-md">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Finding Longest Common Prefix</span>
              <div className="space-y-4">
                {suffixes.slice(0, 2).map((_, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center relative z-10">
                      <div className="font-mono text-lg space-y-1">
                        <div className="flex gap-1">
                          {suffixes[i].split('').map((c, ci) => <span key={ci} className={ci < 1 ? "text-brand-500 font-bold bg-brand-50 px-0.5 rounded" : "opacity-40"}>{c}</span>)}
                        </div>
                        <div className="flex gap-1">
                          {suffixes[i+1].split('').map((c, ci) => <span key={ci} className={ci < 1 ? "text-brand-500 font-bold bg-brand-50 px-0.5 rounded" : "opacity-40"}>{c}</span>)}
                        </div>
                      </div>
                      <div className="bg-brand-500 text-white w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg">
                        <span className="text-[8px] font-bold uppercase">LCP</span>
                        <span className="text-xl font-bold">{i === 0 ? 1 : 3}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      case 'aho-corasick': {
        return (
          <div className="flex flex-col items-center gap-8 w-full py-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl w-full max-w-2xl overflow-hidden">
              <div className="flex flex-col items-center gap-10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Multi-Pattern DFA</span>
                <div className="flex gap-16 items-start justify-center relative">
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold border-4 border-slate-800 shadow-lg">root</div>
                      <div className="flex gap-8">
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-10 h-10 rounded-full border-2 border-brand-500 bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-700 shadow-sm">a</div>
                           <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-700 shadow-sm">sh</div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-10 h-10 rounded-full border-2 border-brand-500 bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-700 shadow-sm">h</div>
                           <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-700 shadow-sm">e</div>
                        </div>
                      </div>
                   </div>
                   <div className="absolute top-24 left-1/2 w-32 h-0.5 bg-rose-500/20 -translate-x-1/2">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold text-rose-500 uppercase bg-white px-2 rounded-full border border-rose-200 flex items-center gap-1"><RotateCw size={8} /> Failure Link</div>
                      <div className="absolute right-0 -top-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                   </div>
                </div>
                <p className="text-xs text-slate-500 text-center leading-relaxed">Built from words: ["ash", "she"]. Linear time O(N + total_patterns_len).</p>
              </div>
            </div>
          </div>
        );
      }
      case 'trie-search': {
        const trieWords = ["CAR", "CAT", "CART"];
        const trieResult = trieInsert(trieWords);
        const renderNode = (node: TrieNode): React.ReactNode => (
          <div className="flex flex-col items-center gap-4" key={node.id}>
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${node.id === 'root' ? 'bg-slate-900 text-white border-slate-800' : (node.isEndOfWord ? 'bg-brand-500 text-white border-brand-600 shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm')}`}>
              {node.char || 'R'}
            </div>
            {Object.keys(node.children).length > 0 && (
              <div className="flex gap-4">
                {Object.values(node.children).map(child => (
                  <div key={child.id} className="relative">
                    <div className="absolute top-0 left-1/2 w-px h-4 bg-slate-200 dark:bg-slate-700 -translate-y-4" />
                    {renderNode(child)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
        return (
          <AlgorithmVisualizer steps={trieResult.steps} renderStep={(step) => (
            <div className="flex flex-col gap-12 w-full items-center overflow-x-auto py-8">
              <div className="flex items-center gap-2 mb-4 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-800">
                <GitFork className="text-brand-500" size={16} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Inserting Words: {trieWords.join(', ')}</span>
              </div>
              <div className="scale-90 origin-top">{renderNode(step.state.root)}</div>
            </div>
          )} />
        );
      }
      case 'compression-concepts': {
        return (
          <div className="flex flex-col items-center gap-12 w-full py-8">
            <div className="flex items-center gap-12">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-36 h-24 bg-slate-50 dark:bg-slate-900 rounded-2xl border-4 border-slate-100 dark:border-slate-800 border-dashed flex items-center justify-center text-slate-400 font-bold text-sm text-center px-4 shadow-inner">UNCOMPRESSED<br />(100%)</div>
                  <div className="h-12 w-0.5 bg-brand-500 animate-pulse relative">
                    <ChevronRight size={16} className="rotate-90 absolute -bottom-4 -left-2 text-brand-500" />
                  </div>
                  <div className="w-28 h-12 bg-brand-500 rounded-xl flex items-center justify-center text-white font-bold shadow-xl shadow-brand-500/30">30% SIZE</div>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:translate-x-2 transition-transform">
                    <Layers size={20} className="text-indigo-500" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Dictionary Encoding</span>
                      <span className="text-[10px] text-slate-400">Map long patterns to short IDs</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:translate-x-2 transition-transform">
                    <Binary size={20} className="text-emerald-500" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Huffman Coding</span>
                      <span className="text-[10px] text-slate-400">Variable-length bit codes</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        );
      }
      case 'run-length-encoding': {
        const text = "AAAAABBBCCDAA";
        const rleResult = rleEncode(text);
        return (
          <AlgorithmVisualizer steps={rleResult.steps} renderStep={(step) => (
            <div className="flex flex-col gap-12 w-full items-center py-4">
              <StringRow text={text} highlightedIndices={step.highlightedIndices} label="Scanning Input" />
              <div className="flex flex-col items-center gap-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="text-amber-500" /> RLE Compressed Buffer</div>
                <div className="bg-slate-900 text-brand-300 px-8 py-6 rounded-3xl font-mono text-3xl border-4 border-brand-500/20 shadow-2xl shadow-inner min-w-[240px] text-center tracking-tighter italic">
                  {step.state.result || '...'}
                </div>
              </div>
              <div className="flex gap-6">
                <div className="px-6 py-3 bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-500 rounded-2xl flex flex-col items-center shadow-sm">
                  <span className="text-[8px] font-bold text-brand-500 uppercase tracking-widest mb-1">Current Char</span>
                  <span className="text-2xl font-bold text-brand-700">{step.state.current}</span>
                </div>
                <div className="px-6 py-3 bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500 rounded-2xl flex flex-col items-center shadow-sm">
                  <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Run Count</span>
                  <span className="text-2xl font-bold text-emerald-700">{step.state.count}</span>
                </div>
              </div>
            </div>
          )} />
        );
      }
      case 'burrows-wheeler': {
        const bwtText = "BANANA";
        const bwtResult = bwtTransform(bwtText);
        return (
          <AlgorithmVisualizer steps={bwtResult.steps} renderStep={(step) => (
            <div className="flex flex-col gap-8 w-full items-center py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full items-start">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2"><RotateCw size={14} /> Lexicographical Rotations</span>
                  <div className="flex flex-col gap-1 font-mono text-xs">
                    {(step.state.rotations || step.state.sortedRotations).map((r: string, i: number) => (
                      <div key={i} className={`p-2 rounded-lg border-2 transition-all duration-500 ${step.state.phase === 'sorting' ? 'border-brand-500/20 bg-brand-50/10' : 'border-slate-50 dark:border-slate-900 bg-slate-50/30'}`}>
                        {r.split('').map((c, ci) => (
                          <span key={ci} className={`px-0.5 ${ci === r.length - 1 && step.state.phase === 'result' ? 'text-brand-500 font-extrabold bg-brand-50 rounded underline' : 'opacity-60'}`}>{c}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                {step.state.result && (
                  <div className="flex flex-col items-center justify-center gap-6 bg-brand-50 dark:bg-brand-900/10 rounded-3xl p-12 border-4 border-brand-500/20 shadow-2xl animate-in zoom-in duration-500 h-full">
                    <span className="text-xs font-bold text-brand-500 uppercase tracking-widest">BWT Output</span>
                    <div className="text-5xl font-extrabold font-mono text-brand-600 tracking-[0.2em] italic underline decoration-brand-200">{step.state.result}</div>
                    <p className="text-[10px] text-slate-500 font-medium text-center">Ready for MTF and Huffman encoding.</p>
                  </div>
                )}
              </div>
            </div>
          )} />
        );
      }
      case 'matching-in-practice': {
        return (
          <div className="flex flex-col items-center gap-8 w-full py-4">
            <div className="w-full max-w-2xl bg-slate-950 rounded-2xl border-4 border-slate-800 shadow-2xl p-8 font-mono overflow-hidden">
               <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4 items-center">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500 ml-4 flex items-center gap-2"><Terminal size={12} /> stringcosmos — -bash</span>
               </div>
               <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <span className="text-emerald-500 font-bold">$</span>
                    <span className="text-slate-300">grep --color=always "KMP" performance.log</span>
                  </div>
                  <div className="text-slate-500 pl-4 py-4 border-l-4 border-brand-500/30 leading-loose space-y-2">
                    <div>[INFO] Initializing search with <span className="bg-brand-500 text-white px-1 rounded font-bold">KMP</span> engine...</div>
                    <div>[DEBUG] Optimization: skip backtracking in linear time.</div>
                    <div>[SUCCESS] Pattern <span className="bg-brand-500 text-white px-1 rounded font-bold">KMP</span> found in 4.2ms.</div>
                  </div>
                  <div className="flex gap-2 animate-pulse">
                    <span className="text-emerald-500 font-bold">$</span>
                    <div className="w-2 h-5 bg-brand-500 shadow-lg shadow-brand-500/50" />
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-6 text-slate-400">
               <div className="flex items-center gap-2"><Cpu size={16} /> SIMD Enabled</div>
               <div className="flex items-center gap-2"><ShieldAlert size={16} /> Multi-Threaded</div>
            </div>
          </div>
        );
      }
      default:
        return (
          <div className="p-16 bg-slate-100 dark:bg-slate-800 rounded-3xl border-4 border-dashed border-slate-300 dark:border-slate-700 text-center flex flex-col items-center gap-6">
             <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center animate-bounce shadow-inner">
               <BookOpen className="text-slate-400" size={32} />
             </div>
             <div className="space-y-2">
               <p className="text-slate-600 dark:text-slate-300 font-bold text-xl">Conceptual Overview</p>
               <p className="text-slate-400 text-sm max-w-sm">The visual simulation for {topic.title} is being optimized. Please refer to the Core Concepts guide below.</p>
             </div>
          </div>
        );
    }
  };

  const getTopicData = () => {
    const contentMap: Record<string, any> = {
      'intro-to-strings': {
        concepts: "At the highest level, a string is a sequence of text. In low-level memory, it's a contiguous block of bytes. Modern programming languages abstract away the memory management, but efficiency depends on understanding how these bytes are stored and accessed. C-style strings are null-terminated, while languages like Java or Rust store the length explicitly to avoid O(N) length checks.",
        steps: [
          "Allocating memory for a sequence of character numeric IDs.",
          "Applying an encoding (like ASCII or UTF-8) to map numbers to symbols.",
          "Handling the terminator character or length metadata.",
          "Accessing characters via pointers or indexed offsets."
        ],
        code: "char* msg = \"Hello\";\n// msg[0] is 'H', msg[5] is '\\0'",
        pitfalls: "Forgetting the null terminator in manual memory management, leading to buffer overflows."
      },
      'ascii-encoding': {
        concepts: "ASCII was the first major standard for character encoding. It uses 7 bits to represent 128 characters, which was enough for English text and basic control characters. In modern 8-bit bytes, the most significant bit is usually set to zero. While limited, it remains the foundation of most modern encodings, as UTF-8 is backward-compatible with it.",
        steps: [
          "Mapping letters 'A-Z' to values 65-90.",
          "Mapping digits '0-9' to values 48-57.",
          "Including control codes like 10 (Newline) and 13 (Carriage Return).",
          "Storing each character in exactly one byte."
        ],
        code: "let val = 'A'.charCodeAt(0); // 65",
        pitfalls: "Assuming ASCII can handle characters like 'é', 'λ', or Emojis."
      },
      'utf8-encoding': {
        concepts: "UTF-8 is the dominant encoding standard today. It solved the problem of global character support while remaining space-efficient. It uses 1 to 4 bytes per character. ASCII characters take 1 byte, while complex symbols like Emojis take 4. This 'variable-width' nature makes it memory efficient for English but requires careful processing for indexing.",
        steps: [
          "Checking the first bits of a byte to determine the sequence length.",
          "1-byte sequence starts with '0' (ASCII).",
          "Multi-byte sequences use 'leading bits' (110, 1110, 11110) to signal total bytes.",
          "Characters are decoded by combining bits across the sequence."
        ],
        code: "const buf = Buffer.from('🌍');\nconsole.log(buf.length); // 4 bytes",
        pitfalls: "Confusing string.length (code units) with the actual number of bytes in UTF-8."
      },
      'utf16-utf32': {
        concepts: "UTF-16 uses either 2 or 4 bytes per character and is the internal format for JavaScript and Java. UTF-32 uses exactly 4 bytes for every single character. UTF-32 is easier for O(1) indexing but consumes vast amounts of memory. UTF-16 is a middle ground but introduced 'Surrogate Pairs', where one logical character is represented by two 16-bit storage units.",
        steps: [
          "UTF-16 maps the Basic Multilingual Plane (common chars) to 2 bytes.",
          "Extended characters (Emojis) use two 16-bit units (Surrogates).",
          "UTF-32 maps every Unicode code point directly to a 32-bit integer.",
          "Choosing UTF-32 for algorithms where memory is cheap but indexing speed is critical."
        ],
        code: "// UTF-16 surrogate pair\n'🚀'.length; // 2 units",
        pitfalls: "UTF-16 is variable-width just like UTF-8, but often mistaken for fixed-width."
      },
      'code-points-units': {
        concepts: "A Code Point is the 'numerical identity' of a character in Unicode (e.g., U+1F680). A Code Unit is the 'storage chunk' used by an encoding (e.g., two 16-bit units in UTF-16). Most beginners use '.length', which measures code units. To correctly count characters, you must count code points.",
        steps: [
          "Understanding that one visual character = one Code Point.",
          "Realizing that one Code Point can require multiple Code Units.",
          "Using iterators like 'for...of' which correctly yield code points.",
          "Differentiating between byte-size, unit-size, and character-count."
        ],
        code: "const s = '𐐷';\n[...s].length; // 1 (Code Points)\ns.length; // 2 (Code Units)",
        pitfalls: "Looping through a string with a standard 'for(i)' loop and breaking surrogate pairs."
      },
      'grapheme-clusters': {
        concepts: "Even code points don't always represent one visual character. A 'Grapheme Cluster' is what a user sees as a single character. For example, a family emoji is actually multiple emojis (Man, Woman, Girl, Boy) joined by invisible 'Zero Width Joiner' code points. Algorithms that reverse strings or delete characters must work at the Grapheme Cluster level to avoid corruption.",
        steps: [
          "Combining a base character with skin tone modifiers.",
          "Joining independent characters with ZWJ (U+200D).",
          "Applying accent marks (Combining Diacritical Marks) to base letters.",
          "Parsing sequences to find logical visual boundaries."
        ],
        code: "const cluster = 'ñ'; // 'n' + accent\n// length is 2, but it looks like 1.",
        pitfalls: "Splitting a string in the middle of a cluster, leaving a 'floating' accent or modifier."
      },
      'indexing-pitfalls': {
        concepts: "In older systems, indexing `str[i]` was an O(1) operation because characters were always 1 byte. In the modern Unicode era, this is a dangerous trap. Accessing a string by index can return a partial byte or a partial surrogate pair, resulting in corrupted text. Modern high-performance string libraries often discourage index-based access in favor of iterators.",
        steps: [
          "Recognizing that `str[i]` returns a code unit, not a character.",
          "Visualizing how an emoji takes multiple indices.",
          "Using high-level iterators to safely traverse multi-byte text.",
          "Pre-calculating an index-to-character map if O(1) access is needed."
        ],
        code: "const text = 'A🌍C';\nconsole.log(text[1]); // '\uD83D' (Broken!)",
        pitfalls: "Writing code that works for 'ABC' but crashes when a user enters an emoji."
      },
      'substring-ops': {
        concepts: "Substring operations involve extracting a portion of a string. Efficient implementations use 'string views' or 'slices', which point to the original memory instead of copying characters. This avoids O(N) allocation and copying, making operations like parsing much faster. However, it requires careful management to ensure the original string remains in memory while the view exists.",
        steps: [
          "Defining a start and end boundary (often inclusive/exclusive).",
          "Creating a reference to the existing character buffer.",
          "Adjusting the 'length' metadata for the new slice.",
          "Avoiding character splitting in multi-byte encodings."
        ],
        code: "str.slice(0, 5); // Modern slicing",
        pitfalls: "Keeping a small slice of a massive string in memory, preventing the large string from being garbage collected."
      },
      'naive-matching': {
        concepts: "The Naive string-matching algorithm is the baseline approach. It slides the pattern across the text one position at a time and performs a character-by-character comparison. If any character mismatches, it shifts the pattern by exactly one. While simple to implement, its worst-case performance is O(N * M), which occurs with highly repetitive text like matching 'AAAAAB' in 'AAAAAAAAAA'.",
        steps: [
          "Aligning the pattern at index 0 of the text.",
          "Comparing characters left-to-right.",
          "On failure, resetting the comparison and shifting the alignment by 1.",
          "Repeating until index N-M is reached."
        ],
        code: "for (let i = 0; i <= n - m; i++) {\n  if (text.substr(i, m) === p) return i;\n}",
        pitfalls: "Catastrophic backtracking performance on large, repetitive datasets."
      },
      'prefix-function': {
        concepts: "The Prefix Function (often called the Pi table) is the engine behind KMP. For every position in the pattern, it stores the length of the longest proper prefix that is also a suffix of that substring. This precomputation tells us exactly how much of the pattern we've already successfully matched even after a mismatch occurs, allowing us to skip ahead.",
        steps: [
          "Initializing pi[0] = 0.",
          "Comparing the current character with the character after the current prefix.",
          "Backtracking through previous prefix lengths on mismatch.",
          "Storing the resulting lengths in an array of size M."
        ],
        code: "if (p[k] === p[q]) k++;\npi[q] = k;",
        pitfalls: "Incorrectly including the entire string as a 'proper' prefix (k must be less than current length)."
      },
      'kmp-algorithm': {
        concepts: "Knuth-Morris-Pratt (KMP) is the first linear-time string matching algorithm discovered. It uses the precomputed Prefix Function to ensure that the pointer in the main text *never* moves backward. When a mismatch occurs, the algorithm looks up the Prefix Table to see what's the next best alignment, effectively 'jumping' the pattern across the text.",
        steps: [
          "Computing the Prefix Table (Pi) for the pattern in O(M).",
          "Scanning the text once with pointer 'i' and pattern with pointer 'q'.",
          "On mismatch, setting q = pi[q-1] instead of resetting i.",
          "Completing the search in exactly O(N + M) time."
        ],
        code: "while (q > 0 && p[q] !== t[i]) q = pi[q-1];",
        pitfalls: "Off-by-one errors when indexing the Pi table after a mismatch."
      },
      'z-algorithm': {
        concepts: "The Z-Algorithm computes an array Z where Z[i] is the length of the longest common prefix between the string S and the suffix of S starting at i. By concatenating the pattern and the text (P + $ + T), we can find all matches by looking for Z[i] values equal to the pattern length. It is as efficient as KMP but often considered more intuitive to visualize.",
        steps: [
          "Creating the string P + separator + T.",
          "Maintaining a 'Z-box' [L, R] which is the rightmost matched interval.",
          "Using values inside the Z-box to compute new Z-values in O(1).",
          "Extending the Z-box linearly when i is outside the current range."
        ],
        code: "if (i <= r) z[i] = Math.min(r - i + 1, z[i - l]);",
        pitfalls: "Using a separator character that actually appears in the text or pattern."
      },
      'rabin-karp': {
        concepts: "Rabin-Karp uses Hashing to find patterns. Instead of comparing characters, it computes a hash of the pattern and compares it to the hashes of all windows in the text. If hashes match, it performs a final character check (to handle collisions). This is exceptionally powerful for searching for multiple patterns at once.",
        steps: [
          "Computing the hash of the pattern in O(M).",
          "Computing the initial hash of the first text window.",
          "Sliding the window and updating the hash in O(1) using math (Rolling Hash).",
          "Performing character comparison only if hashes are equal."
        ],
        code: "if (patternHash === windowHash) checkChars();",
        pitfalls: "Poor choice of prime numbers leading to excessive hash collisions (spurious hits)."
      },
      'rolling-hash': {
        concepts: "The magic behind Rabin-Karp is the Rolling Hash. It allows us to compute the hash of the next window from the current window in O(1) time. We 'subtract' the character leaving the window and 'add' the new character entering. This is typically done using modular arithmetic and polynomial rolling hashes (e.g., base 256).",
        steps: [
          "Removing the leading character's value (Value * base^(M-1)).",
          "Multiplying the remaining hash by the base.",
          "Adding the new trailing character's value.",
          "Applying a large prime modulus to keep numbers within register limits."
        ],
        code: "hash = (base * (hash - charOut * h) + charIn) % prime;",
        pitfalls: "Numeric overflow before the modulo operation is applied."
      },
      'collision-handling': {
        concepts: "In hash-based string algorithms, different strings can produce the same hash value (a collision). We handle this through Chaining (storing colliding items in a list) or Open Addressing (finding the next empty slot). In Rabin-Karp, we handle collisions by simply verifying the characters when a hash match occurs.",
        steps: [
          "Detecting when Hash(A) == Hash(B) but A != B.",
          "Chaining: Using a linked list at the hash bucket.",
          "Linear Probing: Searching for the next available index.",
          "Double Hashing: Using a second hash function to find a new index."
        ],
        code: "if (h1 == h2 && text.slice(i, i+m) === pattern) match();",
        pitfalls: "A high collision rate can degrade Rabin-Karp's O(N) performance back to O(N*M)."
      },
      'suffix-arrays': {
        concepts: "A Suffix Array is a sorted array of all suffixes of a string. It is a powerful space-efficient alternative to Suffix Trees. Once built, we can find any pattern of length M in the text using Binary Search in O(M log N) time. Advanced construction algorithms like SA-IS can build the array in linear O(N) time.",
        steps: [
          "Generating all N suffixes of the string.",
          "Sorting the suffixes lexicographically.",
          "Storing only the starting indices of the sorted suffixes.",
          "Using the array for fast substring queries."
        ],
        code: "suffixes.sort(); // Simplest O(N^2 log N) way",
        pitfalls: "Building the array by actually copying and sorting strings is O(N^2 log N); professional versions use pointers."
      },
      'suffix-trees': {
        concepts: "A Suffix Tree is a compressed Trie of all suffixes of a string. It allows for incredibly fast operations: finding the longest repeated substring, finding the longest common substring of two strings, and counting pattern occurrences. While complex to implement (Ukkonen's Algorithm), it provides O(N) construction and query time.",
        steps: [
          "Building a Trie of all suffixes.",
          "Compressing paths with single children into a single edge.",
          "Using 'suffix links' to accelerate construction.",
          "Terminating all suffixes with a unique '$' character."
        ],
        code: "tree.insert(all_suffixes);",
        pitfalls: "High memory overhead—often 10x to 20x the size of the original string."
      },
      'lcp-array': {
        concepts: "The Longest Common Prefix (LCP) Array is an auxiliary data structure for Suffix Arrays. It stores the length of the longest common prefix between each pair of consecutive suffixes in the sorted suffix array. This allows us to speed up string matching and perform complex analysis like finding the number of distinct substrings in O(N).",
        steps: [
          "Sorting suffixes to get the Suffix Array.",
          "Comparing adjacent suffixes in the sorted list.",
          "Calculating the length of their shared prefix.",
          "Storing these values in a linear array."
        ],
        code: "lcp[i] = commonPrefix(suffixes[i], suffixes[i-1]);",
        pitfalls: "Calculating each LCP from scratch takes O(N^2); use Kasai's algorithm for O(N)."
      },
      'aho-corasick': {
        concepts: "Aho-Corasick is the gold standard for multi-pattern matching. It builds a finite automaton (a Trie with failure links) from a set of patterns. It can find all occurrences of all patterns in a text in one single pass. It is the core algorithm used in tools like `fgrep` and virus scanners.",
        steps: [
          "Building a Trie of all target patterns.",
          "Adding 'Failure Links' that point to the longest proper suffix that is also a prefix in the tree.",
          "Traversing the text through the automaton states.",
          "Emitting matches whenever an 'output' state is reached."
        ],
        code: "while (!curr.next[char]) curr = curr.fail;",
        pitfalls: "Memory consumption grows with the total size of the pattern dictionary."
      },
      'trie-search': {
        concepts: "A Trie (Prefix Tree) is an ordered tree used to store a dynamic set of strings. Unlike a hash table, it allows for prefix-based searches (e.g., 'find all words starting with CAT'). Each node represents a single character, and the path from the root to a node represents a prefix. It is highly efficient for dictionaries and autocomplete systems.",
        steps: [
          "Starting at the root for every new word.",
          "Moving down the tree if the character node exists.",
          "Creating a new node if the character is missing.",
          "Marking the final node as the 'end of word'."
        ],
        code: "curr = curr.children[char] ||= new Node();",
        pitfalls: "Standard Tries can be very sparse and memory-intensive; use Radix Tries for optimization."
      },
      'compression-concepts': {
        concepts: "String compression reduces the number of bits needed to represent text. Lossless compression ensures the original text can be perfectly reconstructed. Core concepts include Entropy (the unpredictability of data), Huffman Coding (using fewer bits for frequent characters), and Dictionary Encoding (replacing repeating strings with references).",
        steps: [
          "Analyzing the frequency of characters or patterns.",
          "Assigning shorter codes to more frequent elements.",
          "Removing redundant information (Entropy reduction).",
          "Building a decoding table to reverse the process."
        ],
        code: "compress(data) -> { dictionary, bitstream }",
        pitfalls: "Compiling a compression algorithm that actually makes small strings larger due to header overhead."
      },
      'run-length-encoding': {
        concepts: "Run-Length Encoding (RLE) is the simplest form of data compression. it replaces consecutive identical characters (a 'run') with a single character and its repeat count. For example, 'AAAAA' becomes 'A5'. It is highly effective for data with long runs of identical values, such as simple icons or sparse datasets.",
        steps: [
          "Scanning the string from left to right.",
          "Counting consecutive identical characters.",
          "Writing the character followed by the count to the output.",
          "Handling runs of length 1 (which might increase size)."
        ],
        code: "result += char + count;",
        pitfalls: "Using RLE on high-entropy text (like 'ABCDEFG') which will double the storage size."
      },
      'burrows-wheeler': {
        concepts: "The Burrows-Wheeler Transform (BWT) doesn't compress data itself but rearranges it to make it highly compressible. It groups similar characters together by performing cyclic rotations and sorting them. When combined with Move-To-Front (MTF) and RLE, it forms the basis of the powerful BZIP2 compression algorithm.",
        steps: [
          "Generating all cyclic rotations of the input string.",
          "Sorting the rotations lexicographically in a matrix.",
          "Extracting the last column of the sorted matrix.",
          "Storing the index of the original string in the sorted list."
        ],
        code: "matrix.sort().map(row => row.last())",
        pitfalls: "Forgetting to add a unique terminator ($) to make the transform reversible."
      },
      'matching-in-practice': {
        concepts: "Real-world string matching isn't just about one algorithm. Tools like `grep`, `ripgrep`, and IDE search engines use hybrid approaches. They might start with a fast 'filter' (like SIMD-accelerated Rabin-Karp or Boyer-Moore) and switch to a complex regex engine only when a potential match is found. They also optimize for CPU cache lines and memory-mapped files.",
        steps: [
          "Pre-filtering data using hardware acceleration (SIMD).",
          "Selecting algorithms based on pattern length and alphabet size.",
          "Handling memory mapping to search files larger than RAM.",
          "Using Boyer-Moore or Horspool for large-alphabet average-case speed."
        ],
        code: "ripgrep --smart-case 'pattern' .",
        pitfalls: "Assuming a theoretical O(N) algorithm is always faster than a well-optimized O(N*M) algorithm in practice."
      },
      'boyer-moore': { 
        concepts: "Boyer-Moore is the benchmark for practical string matching. It compares characters from right to left and uses two powerful heuristics—Bad Character and Good Suffix—to skip as much of the text as possible. It is most efficient when the alphabet is large and mismatches happen frequently near the end of the pattern.",
        steps: ["Precompute bad character shifts.", "Align pattern and compare from right-to-left.", "On mismatch, skip text based on the heuristic.", "Achieve sub-linear performance in many cases."],
        code: "s += Math.max(1, j - badChar[text[s+j]]);",
        pitfalls: "Poor performance on very small alphabets (like binary) compared to KMP."
      }
    };

    return (topicId ? contentMap[topicId] : null) || {
      concepts: `This topic covers ${topic.title}, exploring its fundamental role in string processing and its implementation details.`, 
      steps: [
        "Initializing the required data structures and memory buffers.",
        "Iterating through the string characters using efficient pointers.",
        "Applying the algorithm's core logical transformations.",
        "Validating the output and analyzing the final results."
      ],
      code: "// Implementation logic for " + topic.title + "\n// More details coming in the next update.",
      pitfalls: "Memory overhead and edge cases like empty strings or non-standard characters."
    };
  };

  const data = getTopicData();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link to="/learn" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-500 transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          Back to Curriculum
        </Link>
        <div className="flex gap-2">
          {prevTopic && (
            <Link 
              to={prevTopic.path}
              className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-brand-500 transition-colors text-slate-600 dark:text-slate-400"
              title={`Previous: ${prevTopic.title}`}
            >
              <ChevronLeft size={18} />
            </Link>
          )}
          {nextTopic && (
            <Link 
              to={nextTopic.path}
              className="flex items-center gap-2 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-bold text-xs shadow-md shadow-brand-500/20"
            >
              Next Topic <ChevronRight size={16} />
            </Link>
          )}
        </div>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 text-brand-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
          <List size={14} />
          {topic.category}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">{topic.title}</h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          {topic.description}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Time Complexity</div>
            <div className="font-mono font-bold text-base">{topic.complexity.time}</div>
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0">
            <HardDrive size={20} />
          </div>
          <div>
            <div className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Space Complexity</div>
            <div className="font-mono font-bold text-base">{topic.complexity.space}</div>
          </div>
        </div>
      </div>

      <section className="mb-16 overflow-x-hidden">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-slate-800 dark:text-slate-100">
          <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center text-white"><Cpu size={16} /></div>
          Interactive Visualization
        </h2>
        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-inner overflow-x-auto custom-scrollbar">
          {renderVisualizer()}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-slate-800 dark:text-slate-100">
              <BookOpen size={20} className="text-brand-500" />
              Technical Guide
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6">
                {data.concepts}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm not-prose">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Logical Phases</h3>
              <ul className="space-y-5 list-none p-0 m-0">
                {data.steps.map((step: string, i: number) => (
                  <li key={i} className="flex gap-4 m-0 p-0 items-start">
                    <div className="flex-none w-5 h-5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold mt-1 shadow-sm">
                      {i + 1}
                    </div>
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
              <Terminal size={18} className="text-brand-500" />
              Implementation
            </h2>
            <div className="bg-slate-900 rounded-2xl p-5 font-mono text-[11px] text-brand-300 overflow-x-auto shadow-xl border border-slate-800">
              <pre className="m-0"><code className="block leading-relaxed">{data.code}</code></pre>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-3">
              <AlertTriangle size={18} className="text-amber-500" />
              Expert Pitfalls
            </h2>
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-5 rounded-2xl shadow-sm">
              <p className="text-amber-900 dark:text-amber-300 text-xs leading-relaxed font-medium">
                {data.pitfalls}
              </p>
            </div>
          </section>
        </div>
      </div>

      {nextTopic && (
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-center pb-12">
           <Link 
              to={nextTopic.path}
              className="flex flex-col items-center gap-4 group no-underline"
            >
              <span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black group-hover:text-brand-500 transition-colors">Up Next</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 group-hover:text-brand-500 transition-all text-center">
                {nextTopic.title}
              </span>
              <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-500/20 group-hover:scale-110 transition-all duration-300">
                <ChevronRight size={24} strokeWidth={3} />
              </div>
            </Link>
        </div>
      )}
    </div>
  );
};
export default TopicDetail;
