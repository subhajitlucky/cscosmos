import { categories } from './categories';
import type { InterviewCategory, InterviewCategoryKey, InterviewQuestion } from './types';
import { fullstackQuestions } from './questions/fullstack';
import { cybersecurityQuestions } from './questions/cybersecurity';
import { dsaQuestions } from './questions/dsa';
import { systemDesignQuestions } from './questions/system-design';
import { aiMlQuestions } from './questions/ai-ml';

export * from './types';
export { categories } from './categories';
export * from './meta';

export const interviewQuestions: InterviewQuestion[] = [
  ...fullstackQuestions,
  ...cybersecurityQuestions,
  ...dsaQuestions,
  ...systemDesignQuestions,
  ...aiMlQuestions,
];

export function getCategoryByKey(key: string): InterviewCategory | undefined {
  return categories.find((c) => c.key === key);
}

export function getQuestionsByCategory(key: InterviewCategoryKey): InterviewQuestion[] {
  return interviewQuestions.filter((q) => q.category === key);
}

export function getQuestion(category: InterviewCategoryKey, slug: string): InterviewQuestion | undefined {
  return interviewQuestions.find((q) => q.category === category && q.slug === slug);
}

export interface CategoryFacets {
  topics: { value: string; count: number }[];
  count: number;
}

export function getCategoryFacets(key: InterviewCategoryKey): CategoryFacets {
  const qs = getQuestionsByCategory(key);
  const counts = new Map<string, number>();
  for (const q of qs) counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
  return {
    count: qs.length,
    topics: [...counts.entries()]
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => (a.value < b.value ? -1 : a.value > b.value ? 1 : 0)),
  };
}

export function getAdjacentQuestions(
  category: InterviewCategoryKey,
  slug: string,
): { prev?: InterviewQuestion; next?: InterviewQuestion } {
  const qs = getQuestionsByCategory(category);
  const i = qs.findIndex((q) => q.slug === slug);
  if (i === -1) return {};
  return { prev: qs[i - 1], next: qs[i + 1] };
}
