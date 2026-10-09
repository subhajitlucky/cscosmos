import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  categories,
  getAdjacentQuestions,
  getCategoryByKey,
  getQuestion,
  getQuestionsByCategory,
} from '@/data/interview';
import { QuestionView } from '@/components/interview/QuestionView';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap((c) =>
    getQuestionsByCategory(c.key).map((q) => ({ category: c.key, question: q.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; question: string }>;
}): Promise<Metadata> {
  const { category: categoryKey, question: slug } = await params;
  const category = getCategoryByKey(categoryKey);
  const question = category ? getQuestion(category.key, slug) : undefined;
  if (!category || !question) return {};
  return {
    title: `${question.title} - ${category.shortTitle} Interview Questions - CSCosmos`,
    description: question.oneLiner,
  };
}

export default async function InterviewQuestionPage({
  params,
}: {
  params: Promise<{ category: string; question: string }>;
}) {
  const { category: categoryKey, question: slug } = await params;
  const category = getCategoryByKey(categoryKey);
  if (!category) notFound();
  const question = getQuestion(category.key, slug);
  if (!question) notFound();
  const { prev, next } = getAdjacentQuestions(category.key, question.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: question.title,
      text: question.whyAsked,
      acceptedAnswer: {
        '@type': 'Answer',
        text: [question.mentalModel, ...question.steps.map((s) => s.title)].join(' '),
      },
    },
  };

  return (
    <main className="page-container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <QuestionView category={category} question={question} />
      <nav className="mt-10 flex items-center justify-between gap-4 border-t border-border pt-6">
        {prev ? (
          <Link href={`/interview/${category.key}/${prev.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1" />
            {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/interview/${category.key}/${next.slug}`} className="group flex items-center gap-2 text-right text-sm text-muted-foreground hover:text-foreground">
            {next.title}
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : <span />}
      </nav>
    </main>
  );
}
