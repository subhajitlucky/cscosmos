import Link from 'next/link';
import {
  DIFFICULTY_META,
  FREQUENCY_META,
  ROUND_META,
  TYPE_META,
} from '@/data/interview';
import type { InterviewQuestion } from '@/data/interview';

export function QuestionCard({ question }: { question: InterviewQuestion }) {
  const difficulty = DIFFICULTY_META[question.difficulty];
  const frequency = FREQUENCY_META[question.frequency];

  return (
    <Link
      href={`/interview/${question.category}/${question.slug}`}
      className="glass-card card-hover group block p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${difficulty.className}`}
        >
          {difficulty.label}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${frequency.className}`}
        >
          {frequency.label}
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {question.topic}
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-muted-foreground">
          {ROUND_META[question.round].label} · {TYPE_META[question.type].label}
        </span>
      </div>

      <h2 className="mt-3 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
        {question.title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{question.oneLiner}</p>

      {question.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {question.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
