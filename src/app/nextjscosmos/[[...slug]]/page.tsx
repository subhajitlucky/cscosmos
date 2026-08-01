import { allConceptsFlat } from '@/components/visualizers/nextjscosmos/lib/concepts-data';
import NextJSCosmosClientPage from './NextJSCosmosClientPage';

export function generateStaticParams() {
  const routes = [
    { slug: [] },
    { slug: ['concepts'] },
    { slug: ['errors'] },
    { slug: ['playground'] },
    ...allConceptsFlat.map(concept => ({
      slug: ['concepts', concept.slug],
    })),
  ];

  return routes;
}

export default async function NextJSCosmosPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slugArray = resolvedParams?.slug || [];

  return <NextJSCosmosClientPage slug={slugArray} />;
}
