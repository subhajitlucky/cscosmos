import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import '@/components/visualizers/aicosmos/styles.css';
import { Navbar } from '@/components/visualizers/aicosmos/components/Navbar';
import { Footer } from '@/components/visualizers/aicosmos/components/Footer';
import { Home } from '@/components/visualizers/aicosmos/pages/Home';
import { Learn } from '@/components/visualizers/aicosmos/pages/Learn';
import { TopicDetail } from '@/components/visualizers/aicosmos/pages/TopicDetail';
import { RagLab } from '@/components/visualizers/aicosmos/pages/RagLab';
import { AgentLab } from '@/components/visualizers/aicosmos/pages/AgentLab';
import { NeuralNetworkLab } from '@/components/visualizers/aicosmos/pages/NeuralNetworkLab';
import { TransformerAttentionLab } from '@/components/visualizers/aicosmos/pages/TransformerAttentionLab';
import { About } from '@/components/visualizers/aicosmos/pages/About';
import { aiTopics } from '@/components/visualizers/aicosmos/data/topics';
import { foundationSubtopics } from '@/components/visualizers/aicosmos/data/foundations';
import { FoundationHome } from '@/components/visualizers/aicosmos/pages/FoundationHome';
import { FoundationTopic } from '@/components/visualizers/aicosmos/pages/FoundationTopic';
import { FoundationLab } from '@/components/visualizers/aicosmos/pages/FoundationLab';
import { FoundationProblems } from '@/components/visualizers/aicosmos/pages/FoundationProblems';
import { pythonAiSubtopics } from '@/components/visualizers/aicosmos/data/python-ai';
import { PythonAiHome } from '@/components/visualizers/aicosmos/pages/PythonAiHome';
import { PythonAiTopic } from '@/components/visualizers/aicosmos/pages/PythonAiTopic';
import { PythonAiLab } from '@/components/visualizers/aicosmos/pages/PythonAiLab';
import { PythonAiProblems } from '@/components/visualizers/aicosmos/pages/PythonAiProblems';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['learn'] },
    { slug: ['nn-lab'] },
    { slug: ['attention-lab'] },
    { slug: ['rag-lab'] },
    { slug: ['agent-lab'] },
    { slug: ['about'] },
    { slug: ['learn', 'ai-engineering-foundations'] },
    { slug: ['ai-engineering-foundations'] },
    { slug: ['ai-engineering-foundations', 'learn'] },
    { slug: ['ai-engineering-foundations', 'lab'] },
    { slug: ['ai-engineering-foundations', 'problems'] },
    { slug: ['learn', 'python-for-ai-engineering'] },
    { slug: ['python-for-ai-engineering'] },
    { slug: ['python-for-ai-engineering', 'learn'] },
    { slug: ['python-for-ai-engineering', 'lab'] },
    { slug: ['python-for-ai-engineering', 'problems'] },
  ];

  aiTopics.forEach((topic) => {
    params.push({ slug: ['learn', topic.id] });
  });

  foundationSubtopics.forEach((topic) => {
    params.push({ slug: ['learn', 'ai-engineering-foundations', topic.id] });
    params.push({ slug: ['ai-engineering-foundations', 'learn', topic.id] });
  });

  pythonAiSubtopics.forEach((topic) => {
    params.push({ slug: ['learn', 'python-for-ai-engineering', topic.id] });
    params.push({ slug: ['python-for-ai-engineering', 'learn', topic.id] });
  });

  return params;
}

export default async function AiCosmosPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const first = slug && slug.length > 0 ? slug[0] : '';
  const second = slug && slug.length > 1 ? slug[1] : '';
  const third = slug && slug.length > 2 ? slug[2] : '';

  let content = <Home />;

  if (first === 'learn') {
    if (second === 'ai-engineering-foundations') {
      content = third ? <FoundationTopic topicId={third} /> : <FoundationHome />;
    } else if (second === 'python-for-ai-engineering') {
      content = third ? <PythonAiTopic topicId={third} /> : <PythonAiHome />;
    } else if (second) {
      content = <TopicDetail topicId={second} />;
    } else {
      content = <Learn />;
    }
  } else if (first === 'ai-engineering-foundations') {
    if (second === 'lab') content = <FoundationLab />;
    else if (second === 'problems') content = <FoundationProblems />;
    else if (second === 'learn') {
      content = third ? <FoundationTopic topicId={third} /> : <FoundationHome />;
    } else if (!second) {
      content = <FoundationHome />;
    } else notFound();
  } else if (first === 'python-for-ai-engineering') {
    if (second === 'lab') content = <PythonAiLab />;
    else if (second === 'problems') content = <PythonAiProblems />;
    else if (second === 'learn') {
      content = third ? <PythonAiTopic topicId={third} /> : <PythonAiHome />;
    } else if (!second) {
      content = <PythonAiHome />;
    } else notFound();
  } else if (first === 'nn-lab') {
    content = <NeuralNetworkLab />;
  } else if (first === 'attention-lab') {
    content = <TransformerAttentionLab />;
  } else if (first === 'rag-lab') {
    content = <RagLab />;
  } else if (first === 'agent-lab') {
    content = <AgentLab />;
  } else if (first === 'about') {
    content = <About />;
  } else if (first !== '') {
    notFound();
  }

  return (
    <div className="aicosmos-root">
      <Navbar />
      <main>
        <Suspense fallback={<div className="p-12 text-center font-mono text-xs text-[var(--ai-muted)]">Loading AI::COSMOS...</div>}>
          {content}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
