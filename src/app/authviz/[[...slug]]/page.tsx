import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/authviz/components/Navbar';
import { Footer } from '@/components/visualizers/authviz/components/Footer';
import Home from '@/components/visualizers/authviz/pages/Home';
import Concepts from '@/components/visualizers/authviz/pages/Concepts';
import ConceptDetail from '@/components/visualizers/authviz/pages/ConceptDetail';
import PkceLab from '@/components/visualizers/authviz/pages/PkceLab';
import JwtLab from '@/components/visualizers/authviz/pages/JwtLab';
import SessionLab from '@/components/visualizers/authviz/pages/SessionLab';
import RbacLab from '@/components/visualizers/authviz/pages/RbacLab';
import HashingLab from '@/components/visualizers/authviz/pages/HashingLab';
import Flashcards from '@/components/visualizers/authviz/pages/Flashcards';
import CheatSheet from '@/components/visualizers/authviz/pages/CheatSheet';
import { AUTH_TOPICS } from '@/components/visualizers/authviz/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['pkce-lab'] },
    { slug: ['jwt-lab'] },
    { slug: ['session-lab'] },
    { slug: ['rbac-lab'] },
    { slug: ['hashing-lab'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  AUTH_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function AuthVizPage({
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
  } else if (first === 'pkce-lab') {
    content = <PkceLab />;
  } else if (first === 'jwt-lab') {
    content = <JwtLab />;
  } else if (first === 'session-lab') {
    content = <SessionLab />;
  } else if (first === 'rbac-lab') {
    content = <RbacLab />;
  } else if (first === 'hashing-lab') {
    content = <HashingLab />;
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
      <Footer />
    </div>
  );
}
