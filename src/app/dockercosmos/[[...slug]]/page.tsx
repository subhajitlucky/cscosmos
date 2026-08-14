import React from 'react';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/visualizers/dockercosmos/components/Navbar';
import { Footer } from '@/components/visualizers/dockercosmos/components/Footer';
import Home from '@/components/visualizers/dockercosmos/pages/Home';
import Concepts from '@/components/visualizers/dockercosmos/pages/Concepts';
import ConceptDetail from '@/components/visualizers/dockercosmos/pages/ConceptDetail';
import NamespacesLab from '@/components/visualizers/dockercosmos/pages/NamespacesLab';
import OverlayFsLab from '@/components/visualizers/dockercosmos/pages/OverlayFsLab';
import CgroupsLab from '@/components/visualizers/dockercosmos/pages/CgroupsLab';
import K8sLab from '@/components/visualizers/dockercosmos/pages/K8sLab';
import Playground from '@/components/visualizers/dockercosmos/pages/Playground';
import Flashcards from '@/components/visualizers/dockercosmos/pages/Flashcards';
import CheatSheet from '@/components/visualizers/dockercosmos/pages/CheatSheet';
import { DOCKER_TOPICS } from '@/components/visualizers/dockercosmos/data/topics';

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['namespaces-lab'] },
    { slug: ['overlayfs-lab'] },
    { slug: ['cgroups-lab'] },
    { slug: ['k8s-lab'] },
    { slug: ['playground'] },
    { slug: ['flashcards'] },
    { slug: ['cheatsheet'] },
  ];

  DOCKER_TOPICS.forEach((topic) => {
    params.push({ slug: ['concepts', topic.id] });
  });

  return params;
}

export default async function DockerCosmosPage({
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
  } else if (first === 'namespaces-lab') {
    content = <NamespacesLab />;
  } else if (first === 'overlayfs-lab') {
    content = <OverlayFsLab />;
  } else if (first === 'cgroups-lab') {
    content = <CgroupsLab />;
  } else if (first === 'k8s-lab') {
    content = <K8sLab />;
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
      <Footer />
    </div>
  );
}
