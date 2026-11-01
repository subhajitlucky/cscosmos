'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';
import { NODE_TOPICS, NODE_MODULES, type NodeTopic } from '../data/topics';

export default function Concepts() {
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [moduleFilter, setModuleFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [groupByModule, setGroupByModule] = useState<boolean>(true);

  const filteredTopics = useMemo(() => {
    return NODE_TOPICS.filter((topic) => {
      const matchLevel =
        levelFilter === 'all' ||
        topic.level.toLowerCase() === levelFilter.toLowerCase();
      const matchModule =
        moduleFilter === 'all' || topic.moduleNumber === moduleFilter;
      const matchQuery =
        !searchQuery ||
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.number.toString() === searchQuery.trim();
      return matchLevel && matchModule && matchQuery;
    });
  }, [levelFilter, moduleFilter, searchQuery]);

  // Group filtered topics by moduleNumber if groupByModule is active
  const groupedModules = useMemo(() => {
    const map = new Map<number, { module: (typeof NODE_MODULES)[number]; topics: NodeTopic[] }>();
    NODE_MODULES.forEach((mod) => {
      const modTopics = filteredTopics.filter((t) => t.moduleNumber === mod.number);
      if (modTopics.length > 0) {
        map.set(mod.number, { module: mod, topics: modTopics });
      }
    });
    return Array.from(map.values());
  }, [filteredTopics]);

  return (
    <div className="space-y-10 pb-24 max-w-7xl mx-auto px-4 sm:px-6 pt-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Node.js 2027 Complete Learning Roadmap &bull; 280 Concepts
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
          Node.js Architectural Curriculum
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl leading-relaxed">
          From runtime fundamentals and the 6-phase Libuv event loop to V8 Ignition/TurboFan internals, Native Node-API addons, and single executable applications (SEA).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        {/* Row 1: Search + Grouping Toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, number, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/40 border border-border text-xs text-foreground focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs text-muted-foreground font-medium">Layout:</span>
            <button
              onClick={() => setGroupByModule(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                groupByModule
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              By Module
            </button>
            <button
              onClick={() => setGroupByModule(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                !groupByModule
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-muted/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              All Grid
            </button>
          </div>
        </div>

        {/* Row 2: Level Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-border/80 pt-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
            Levels:
          </span>
          {[
            { id: 'all', label: `All (${NODE_TOPICS.length})` },
            { id: 'beginner', label: 'Beginner (60)' },
            { id: 'intermediate', label: 'Intermediate (78)' },
            { id: 'advanced', label: 'Advanced (77)' },
            { id: 'expert', label: 'Expert (65)' },
          ].map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setLevelFilter(lvl.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                levelFilter === lvl.id
                  ? 'bg-foreground text-background shadow-xs'
                  : 'bg-muted/30 border border-border text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Row 3: Module Filter Dropdown */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto text-xs">
          <span className="font-bold uppercase tracking-wider text-muted-foreground shrink-0">
            Module Filter:
          </span>
          <select
            value={moduleFilter}
            onChange={(e) =>
              setModuleFilter(
                e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
              )
            }
            className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs text-foreground focus:border-emerald-500 outline-none"
          >
            <option value="all">All 20 Modules</option>
            {NODE_MODULES.map((m) => (
              <option key={m.number} value={m.number}>
                Module {m.number}: {m.name} ({m.level})
              </option>
            ))}
          </select>

          <span className="text-xs text-muted-foreground ml-auto font-mono">
            Showing {filteredTopics.length} of {NODE_TOPICS.length} concepts
          </span>
        </div>
      </div>

      {/* Topics Display: Grouped or Grid */}
      {groupByModule ? (
        <div className="space-y-12">
          {groupedModules.map(({ module, topics }) => (
            <div key={module.number} className="space-y-4">
              {/* Module Header Banner */}
              <div className="p-4 sm:p-5 rounded-3xl bg-muted/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Module {module.number} &bull; {module.level}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {topics.length} Concepts
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    {module.name}
                  </h2>
                </div>
              </div>

              {/* Module Concepts Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic) => (
                  <ConceptCard key={topic.id} topic={topic} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => (
            <ConceptCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConceptCard({ topic }: { topic: NodeTopic }) {
  return (
    <Link
      href={`/nodecosmos/concepts/${topic.id}`}
      className="p-5 rounded-3xl bg-card border border-border/80 hover:border-emerald-500/50 hover:shadow-md transition-all space-y-3 flex flex-col justify-between group"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            #{topic.number}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                topic.stability === 'Experimental'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {topic.stability || 'Stable'}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-muted text-muted-foreground">
              {topic.level}
            </span>
          </div>
        </div>

        <h3 className="text-base font-bold text-foreground group-hover:text-emerald-500 transition-colors leading-snug">
          {topic.title}
        </h3>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {topic.moduleName}
        </p>
      </div>

      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="w-3 h-3" /> Coming Soon
        </span>
        <div className="flex items-center gap-1">
          <span>View Lesson</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
