import { NextResponse } from "next/server";
import {
  categories,
  getQuestionsByCategory,
  interviewQuestions,
} from "@/data/interview";
import { siteConfig } from "@/config/site";

export const revalidate = 3600;

export function GET() {
  const payload = {
    count: interviewQuestions.length,
    generatedAt: new Date().toISOString(),
    categories: categories.map((category) => ({
      key: category.key,
      title: category.title,
      description: category.description,
      url: `${siteConfig.url}/interview/${category.key}`,
      questions: getQuestionsByCategory(category.key).map((question) => ({
        slug: question.slug,
        title: question.title,
        topic: question.topic,
        difficulty: question.difficulty,
        frequency: question.frequency,
        round: question.round,
        type: question.type,
        companies: question.companies ?? [],
        tags: question.tags,
        oneLiner: question.oneLiner,
        url: `${siteConfig.url}/interview/${question.category}/${question.slug}`,
      })),
    })),
  };

  return NextResponse.json(payload, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
