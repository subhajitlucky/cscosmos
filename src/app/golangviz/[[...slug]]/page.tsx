import GolangVizClientPage from './GolangVizClientPage';

export function generateStaticParams() {
  return [
    { slug: [] },
    { slug: ['path'] },
    { slug: ['playground'] },
    { slug: ['concepts', 'introduction-to-go'] },
    { slug: ['concepts', 'installation-and-setup'] },
    { slug: ['concepts', 'hello-world'] },
    { slug: ['concepts', 'basic-syntax'] },
    { slug: ['concepts', 'variables'] },
    { slug: ['concepts', 'basic-types'] },
    { slug: ['concepts', 'constants'] },
  ];
}

export default async function GolangVizPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug || [];

  return <GolangVizClientPage slug={slug} />;
}
