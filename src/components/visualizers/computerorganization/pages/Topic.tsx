'use client';

import Link from 'next/link';
import '../styles.css';
import { getChapter } from '../data/chapters';
import { ChapterInteractive } from '../interactives';

export interface ComputerOrganizationTopicProps {
  subtopicSlug: string;
  basePath?: string;
}

// Chapter article: intuition first, then the formal model, a labelled block
// diagram, one worked example, misconceptions, a hands-on tool and takeaways.
export function ComputerOrganizationTopic({
  subtopicSlug,
  basePath = '/corecs/computer-organization',
}: ComputerOrganizationTopicProps) {
  const chapter = getChapter(subtopicSlug);
  if (!chapter) {
    return <div className="co-root p-12">Chapter not found.</div>;
  }

  return (
    <div className="co-root mx-auto max-w-4xl px-6 py-12">
      <p className="co-chip">
        Chapter {chapter.number} · {chapter.category} · {chapter.minutes} min
      </p>
      <h1 className="mt-3 text-3xl font-bold">{chapter.title}</h1>
      <p className="co-muted mt-3 text-lg">{chapter.summary}</p>

      <section className="co-card mt-8">
        <h2 className="text-xl font-semibold">Intuition</h2>
        <p className="mt-2">{chapter.intuition}</p>
      </section>

      <section className="co-card mt-4">
        <h2 className="text-xl font-semibold">Formal model</h2>
        <p className="mt-2">{chapter.formalModel}</p>
      </section>

      <section className="co-card mt-4">
        <h2 className="text-xl font-semibold">{chapter.diagram.label}</h2>
        <div className="co-topic-diagram mt-3">
          {chapter.diagram.blocks.map((block) => (
            <span key={block} className="co-chip">
              {block}
            </span>
          ))}
        </div>
        <ol className="co-topic-flow mt-3">
          {chapter.diagram.flow.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="co-card mt-4">
        <h2 className="text-xl font-semibold">Worked example: {chapter.workedExample.title}</h2>
        <ol className="mt-2 list-decimal pl-6">
          {chapter.workedExample.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="co-muted mt-3 text-sm">{chapter.workedExample.result}</p>
      </section>

      <section className="co-card mt-4">
        <h2 className="text-xl font-semibold">Common misconceptions</h2>
        <div className="mt-2 space-y-2">
          {chapter.misconceptions.map((item) => (
            <p key={item.claim}>
              <strong>“{item.claim}”</strong> — {item.correction}
            </p>
          ))}
        </div>
      </section>

      <section className="co-card mt-4">
        <h2 className="text-xl font-semibold">Try it</h2>
        <div className="mt-3">
          <ChapterInteractive kind={chapter.interactive} />
        </div>
      </section>

      <section className="co-card mt-4">
        <h2 className="text-xl font-semibold">Key takeaways</h2>
        <ul className="mt-2 list-disc pl-6">
          {chapter.takeaways.map((takeaway) => (
            <li key={takeaway}>{takeaway}</li>
          ))}
        </ul>
      </section>

      <Link className="co-chip co-cta mt-8" href={`${basePath}/learn`}>
        ← All chapters
      </Link>
    </div>
  );
}
