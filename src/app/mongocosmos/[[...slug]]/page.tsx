import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/mongocosmos/components/Navbar';
import { Footer } from '@/components/visualizers/mongocosmos/components/Footer';
import Home from '@/components/visualizers/mongocosmos/pages/Home';
import Concepts from '@/components/visualizers/mongocosmos/pages/Concepts';
import ConceptDetail from '@/components/visualizers/mongocosmos/pages/ConceptDetail';
import WiredTigerLab from '@/components/visualizers/mongocosmos/pages/WiredTigerLab';
import AggLab from '@/components/visualizers/mongocosmos/pages/AggLab';
import ReplicaLab from '@/components/visualizers/mongocosmos/pages/ReplicaLab';
import ShardingLab from '@/components/visualizers/mongocosmos/pages/ShardingLab';
import Playground from '@/components/visualizers/mongocosmos/pages/Playground';
import Problems from '@/components/visualizers/mongocosmos/pages/Problems';
import Flashcards from '@/components/visualizers/mongocosmos/pages/Flashcards';
import CheatSheet from '@/components/visualizers/mongocosmos/pages/CheatSheet';
import { MONGO_TOPICS } from '@/components/visualizers/mongocosmos/data/topics';

const CANONICAL_BASE = 'https://cscosmos.vercel.app/fullstack/mongocosmos';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['wiredtiger-lab'] },
    { slug: ['agg-lab'] },
    { slug: ['replica-lab'] },
    { slug: ['sharding-lab'] },
    { slug: ['playground'] },
    { slug: ['problems'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  MONGO_TOPICS.forEach((topic) => {
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
      const topic = MONGO_TOPICS.find((t) => t.id === second);
      if (topic) {
        return {
          title: `${topic.title} | MongoCosmos - CSCosmos`,
          description: topic.summary,
          alternates: { canonical: `${CANONICAL_BASE}/concepts/${topic.id}` },
          openGraph: {
            title: `${topic.title} | MongoCosmos`,
            description: topic.summary,
            url: `${CANONICAL_BASE}/concepts/${topic.id}`,
          },
        };
      }
    }
    return {
      title: 'MongoDB & Document Engine Architecture Concepts | MongoCosmos - CSCosmos',
      description: '50 comprehensive lessons covering BSON serialization, WiredTiger cache internals, covered queries, aggregation pipelines, and Raft consensus.',
      alternates: { canonical: `${CANONICAL_BASE}/concepts` },
      openGraph: {
        title: 'MongoDB & Document Engine Concepts | MongoCosmos',
        description: '50 comprehensive lessons on MongoDB internals and distributed architecture.',
        url: `${CANONICAL_BASE}/concepts`,
      },
    };
  }

  const routeMeta: Record<string, { title: string; desc: string }> = {
    'wiredtiger-lab': {
      title: 'WiredTiger Engine & Cache Eviction Lab | MongoCosmos - CSCosmos',
      desc: 'Interactive simulation of WiredTiger memory cache pages, dirty page ratios, eviction servers, WAL journaling, and 60s checkpoints.',
    },
    'agg-lab': {
      title: 'Aggregation Pipeline Stream Lab | MongoCosmos - CSCosmos',
      desc: 'Interactive step-by-step document flow visualizer through $match, $group, $unwind, $lookup, and memory limit buffers.',
    },
    'replica-lab': {
      title: 'Replica Set Raft Consensus & Election Lab | MongoCosmos - CSCosmos',
      desc: 'Simulate replica set heartbeats, primary crash failover, Raft quorum elections, and writeConcern majority guarantees.',
    },
    'sharding-lab': {
      title: 'Horizontal Sharding & mongos Router Lab | MongoCosmos - CSCosmos',
      desc: 'Interactive evaluation of mongos query routing, targeted key lookups, scatter-gather queries, and chunk migrations.',
    },
    'playground': {
      title: 'Interactive MQL & Aggregation Playground | MongoCosmos - CSCosmos',
      desc: 'In-browser document query engine evaluating MQL find and aggregate pipelines against in-memory BSON collections with EXPLAIN plans.',
    },
    'problems': {
      title: 'MongoDB Practice Problems & Challenges | MongoCosmos - CSCosmos',
      desc: 'Solve 50 real-world MQL and aggregation pipeline challenges with instant in-memory evaluation and unit test validation.',
    },
    'flashcards': {
      title: 'Senior MongoDB & Database Engineering Flashcards | MongoCosmos - CSCosmos',
      desc: '50 staff-level database engineering questions covering BSON prefixes, WiredTiger hazard pointers, ESR rules, and Raft consensus.',
    },
    'cheatsheet': {
      title: 'MongoDB Performance & Architecture Cheatsheet | MongoCosmos - CSCosmos',
      desc: 'Production recipes for ESR compound indexing, aggregation pipeline memory limits, WiredTiger cache tuning, and write concern combinations.',
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
    title: 'MongoCosmos: MongoDB Queries, WiredTiger Engine & Distributed Architecture | CSCosmos',
    description: 'Master document database engineering: BSON byte layouts, WiredTiger memory eviction, aggregation pipelines, Raft replica consensus, horizontal sharding, and 50 in-depth lessons.',
    alternates: { canonical: CANONICAL_BASE },
    openGraph: {
      title: 'MongoCosmos: MongoDB Queries, WiredTiger Engine & Distributed Architecture | CSCosmos',
      description: 'Master document database engineering: BSON byte layouts, WiredTiger memory eviction, aggregation pipelines, Raft replica consensus, horizontal sharding, and 50 in-depth lessons.',
      url: CANONICAL_BASE,
    },
  };
}

export default async function MongoCosmosPage({
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
  } else if (first === 'wiredtiger-lab') {
    content = <WiredTigerLab />;
  } else if (first === 'agg-lab') {
    content = <AggLab />;
  } else if (first === 'replica-lab') {
    content = <ReplicaLab />;
  } else if (first === 'sharding-lab') {
    content = <ShardingLab />;
  } else if (first === 'playground') {
    content = <Playground />;
  } else if (first === 'problems') {
    content = <Problems />;
  } else if (first === 'flashcards') {
    content = <Flashcards />;
  } else if (first === 'cheatsheet') {
    content = <CheatSheet />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-emerald-600/20 selection:text-emerald-700 dark:selection:text-emerald-300">
      <Navbar />
      <main className="flex-1 w-full">{content}</main>
      <Footer />
    </div>
  );
}
