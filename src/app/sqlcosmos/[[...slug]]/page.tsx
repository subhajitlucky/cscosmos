import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/sqlcosmos/components/Navbar';
import { Footer } from '@/components/visualizers/sqlcosmos/components/Footer';
import Home from '@/components/visualizers/sqlcosmos/pages/Home';
import Concepts from '@/components/visualizers/sqlcosmos/pages/Concepts';
import ConceptDetail from '@/components/visualizers/sqlcosmos/pages/ConceptDetail';
import IndexLab from '@/components/visualizers/sqlcosmos/pages/IndexLab';
import ExplainLab from '@/components/visualizers/sqlcosmos/pages/ExplainLab';
import JoinsLab from '@/components/visualizers/sqlcosmos/pages/JoinsLab';
import Playground from '@/components/visualizers/sqlcosmos/pages/Playground';
import Flashcards from '@/components/visualizers/sqlcosmos/pages/Flashcards';
import CheatSheet from '@/components/visualizers/sqlcosmos/pages/CheatSheet';
import { SQL_TOPICS } from '@/components/visualizers/sqlcosmos/data/topics';
import { TopicNotes } from '@/components/learning/TopicNotes';
import { RelatedTopics } from '@/components/learning/RelatedTopics';
import { TopicComments } from '@/components/learning/TopicComments';

const CANONICAL_BASE = 'https://cscosmos.vercel.app/fullstack/sqlcosmos';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['index-lab'] },
    { slug: ['explain-lab'] },
    { slug: ['joins-lab'] },
    { slug: ['playground'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  SQL_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  if (first === 'concepts') {
    if (second) {
      const topic = SQL_TOPICS.find((t) => t.id === second);
      if (topic) {
        return {
          title: `${topic.title} | SQLCosmos - CSCosmos`,
          description: topic.summary,
          alternates: { canonical: `${CANONICAL_BASE}/concepts/${topic.id}` },
          openGraph: {
            title: `${topic.title} | SQLCosmos`,
            description: topic.summary,
            url: `${CANONICAL_BASE}/concepts/${topic.id}`,
          },
        };
      }
    }
    return {
      title: 'SQL & Database Architecture Concepts | SQLCosmos - CSCosmos',
      description: '23 comprehensive lessons from SQL DDL, constraints, and aggregations to B+ Tree page traversals, MVCC, and table partitioning.',
      alternates: { canonical: `${CANONICAL_BASE}/concepts` },
    };
  }

  const routeMeta: Record<string, { title: string; desc: string }> = {
    'index-lab': {
      title: 'B+ Tree Index Lab | SQLCosmos - CSCosmos',
      desc: 'Interactive deep-dive into Root, Branch, Leaf page structures, and Heap tuple pointers.',
    },
    'explain-lab': {
      title: 'EXPLAIN ANALYZE Cost Optimizer Lab | SQLCosmos - CSCosmos',
      desc: 'Interactive evaluation of Seq Scan, Index Scan, Index-Only Scan, and Bitmap Index Scan execution plans.',
    },
    'joins-lab': {
      title: 'SQL Physical Joins Engine | SQLCosmos - CSCosmos',
      desc: 'Interactive evaluation of Nested Loop Join, Hash Join (Build & Probe phases), and Merge Join lockstep traversal.',
    },
    'playground': {
      title: 'Interactive SQL Playground | SQLCosmos - CSCosmos',
      desc: 'In-browser relational engine evaluating SQL queries against in-memory tables.',
    },
    'flashcards': {
      title: 'Senior Database Engineering Flashcards | SQLCosmos - CSCosmos',
      desc: '18 high-yield database engineering questions covering B+ Trees, Leftmost Prefix, MVCC, and write skew.',
    },
    'cheatsheet': {
      title: 'SQL Performance & Analytics Cheat Sheet | SQLCosmos - CSCosmos',
      desc: 'Production recipes for covering indexes, window functions, recursive CTEs, and concurrent materialized views.',
    },
  };

  if (first && routeMeta[first]) {
    return {
      title: routeMeta[first].title,
      description: routeMeta[first].desc,
      alternates: { canonical: `${CANONICAL_BASE}/${first}` },
      openGraph: {
        title: routeMeta[first].title,
        description: routeMeta[first].desc,
        url: `${CANONICAL_BASE}/${first}`,
      },
    };
  }

  return {
    title: 'SQL Visualizer: Queries, Indexes & Storage Engine | CSCosmos',
    description: 'Master relational database architecture: B+ Tree page traversals, Leftmost Prefix rule, EXPLAIN plans, MVCC tuple headers, and 23 in-depth lessons.',
    alternates: { canonical: CANONICAL_BASE },
    openGraph: {
      title: 'SQL Visualizer: Queries, Indexes & Storage Engine | CSCosmos',
      description: 'Master relational database architecture: B+ Tree page traversals, Leftmost Prefix rule, EXPLAIN plans, MVCC tuple headers, and 23 in-depth lessons.',
      url: CANONICAL_BASE,
    },
  };
}

export default async function SqlCosmosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';

  let content = <Home />;

  if (first === 'concepts') {
    if (second) {
      content = <ConceptDetail topicId={second} />;
    } else {
      content = <Concepts />;
    }
  } else if (first === 'index-lab') {
    content = <IndexLab />;
  } else if (first === 'explain-lab') {
    content = <ExplainLab />;
  } else if (first === 'joins-lab') {
    content = <JoinsLab />;
  } else if (first === 'playground') {
    content = <Playground />;
  } else if (first === 'flashcards') {
    content = <Flashcards />;
  } else if (first === 'cheatsheet') {
    content = <CheatSheet />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors">
      <Navbar />
      <main className="flex-1 w-full">{content}</main>
      
      {/* Platform Learning Integration: Notes, Related Topics & Comments */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-16 space-y-4 pt-12 border-t border-border/80">
        <TopicNotes slug="sqlcosmos" name="SQL Visualizer (Queries, Indexes)" domain="fullstack" />
        <RelatedTopics slug="sqlcosmos" domain="fullstack" />
        <TopicComments slug="sqlcosmos" />
      </div>

      <Footer />
    </div>
  );
}
