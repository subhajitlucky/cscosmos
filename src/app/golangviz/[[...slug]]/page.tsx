import GolangVizClientPage from './GolangVizClientPage';
import { allConcepts } from '@/components/visualizers/golangviz/data/concepts-data';

export function generateStaticParams() {
  const conceptRoutes = allConcepts.map((concept) => ({
    slug: ['concepts', concept.slug],
  }));

  return [
    { slug: [] },
    { slug: ['path'] },
    { slug: ['playground'] },
    { slug: ['cheatsheet'] },
    ...conceptRoutes,
  ];
}

export default async function GolangVizPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  return <GolangVizClientPage slug={slug} />;
}
