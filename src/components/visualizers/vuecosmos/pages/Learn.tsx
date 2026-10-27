'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Search } from 'lucide-react';
import { topicGroups, slugify } from '../data/topics';

export function Learn() {
  const [filter, setFilter] = useState('All concepts');

  // Read ?search= AFTER mount, not during render. Calling useSearchParams() during
  // render makes Next.js bail out of static generation for this route and ship the
  // Suspense fallback instead of the page — /vuecosmos/learn pre-rendered as a bare
  // "Loading Vue Visualizer..." with no content. Reading window.location.search in
  // an effect keeps the page statically rendered; the deep link still applies on
  // hydration.
  const [query, setQuery] = useState('');

  useEffect(() => {
    const searchParamQuery = new URLSearchParams(window.location.search).get('search') || '';
    if (searchParamQuery) setQuery(searchParamQuery);
  }, []);

  const visibleGroups = useMemo(() => {
    return topicGroups.reduce((groups: typeof topicGroups, group) => {
      if (filter !== 'All concepts' && group.label !== filter) return groups;
      const topics = group.topics.filter(([title]) =>
        title.toLowerCase().includes(query.toLowerCase())
      );
      if (topics.length) groups.push({ ...group, topics });
      return groups;
    }, []);
  }, [filter, query]);

  return (
    <div className="page learn-page">
      <section className="page-intro">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-dot" /> The concept map <span className="eyebrow-line" /> 06 paths
          </div>
          <h1>Learn the<br /><em>connections.</em></h1>
        </div>
        <p>
          Vue makes sense when the pieces are allowed to talk. Pick a thread and follow it through the system.
        </p>
      </section>

      <div className="learn-toolbar">
        <div className="filter-tabs">
          {['All concepts', ...topicGroups.map(({ label }) => label)].map((label) => (
            <button
              type="button"
              className={filter === label ? 'selected' : ''}
              key={label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a concept..."
          />
        </label>
      </div>

      <div className="topic-map">
        {visibleGroups.map((group, groupIndex) => (
          <section className="topic-group" key={group.label}>
            <div className="group-heading">
              <span className={`group-dot ${group.color}`} />
              <span className="group-number">0{groupIndex + 1}</span>
              <h2>{group.label}</h2>
              <span className="group-count">{String(group.topics.length).padStart(2, '0')} concepts</span>
            </div>
            <div className="topic-grid">
              {group.topics.map(([title, summary, difficulty], index) => (
                <TopicCard
                  key={title}
                  title={title}
                  summary={summary}
                  difficulty={difficulty}
                  color={group.color}
                  number={String(index + 1).padStart(2, '0')}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function TopicCard({
  title,
  summary,
  difficulty,
  color,
  number,
}: {
  title: string;
  summary: string;
  difficulty: string;
  color: string;
  number: string;
}) {
  return (
    <Link href={`/vuecosmos/topic/${slugify(title)}`} className="topic-card">
      <div className={`topic-card-top ${color}`}>
        <span>{number}</span>
        <ArrowUpRight size={15} />
      </div>
      <h3>{title}</h3>
      <p>{summary}</p>
      <div className="topic-meta">
        <span className={`difficulty ${difficulty}`}>{difficulty}</span>
        <span className="topic-dash" />
      </div>
    </Link>
  );
}
