import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { categories, getCategoryByKey, getQuestionsByCategory } from '@/data/interview';
import { CategoryBrowser } from '@/components/interview/CategoryBrowser';

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: key } = await params;
  const category = getCategoryByKey(key);
  if (!category) return {};
  return { title: `${category.title} - CSCosmos`, description: category.description };
}

export default async function InterviewCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: key } = await params;
  const category = getCategoryByKey(key);
  if (!category) notFound();
  const questions = getQuestionsByCategory(category.key);
  return <CategoryBrowser category={category} questions={questions} />;
}
