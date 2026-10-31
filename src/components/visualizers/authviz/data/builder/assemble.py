import json
import os
import d1_fundamentals
import d2_sessions
import d3_mfa
import d4_oauth
import d5_jwt
import d6_authz
import d7_appsec
import problems_builder

all_topics = (
    d1_fundamentals.topics +
    d2_sessions.topics +
    d3_mfa.topics +
    d4_oauth.topics +
    d5_jwt.topics +
    d6_authz.topics +
    d7_appsec.topics
)

assert len(all_topics) == 30, f"Expected 30 topics, got {len(all_topics)}"

# Verify topic IDs are unique and sequential linkage
topic_ids = [t["id"] for t in all_topics]
assert len(set(topic_ids)) == 30, "Topic IDs must be unique"

all_problems = problems_builder.problems
assert len(all_problems) == 60, f"Expected 60 problems, got {len(all_problems)}"

# Verify every topic is covered
covered_topics = set(p["topicId"] for p in all_problems)
for t_id in topic_ids:
    assert t_id in covered_topics, f"Topic {t_id} missing in problems!"

# 1. Generate topics.ts
topics_ts_path = "/home/subhajit/project/cscosmos/src/components/visualizers/authviz/data/topics.ts"

topics_content = """export interface AuthTopic {
  id: string;
  title: string;
  category: 'oauth-oidc' | 'jwt-tokens' | 'sessions-cookies' | 'authz-rbac' | 'cryptography-passwords' | 'resilience-security';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;
  whyExists: string;
  mentalModel: string;
  architectureDiagram: string;
  cosmosAppStory: string;
  stepByStep: string[];
  codeSnippet: string;
  misconceptions: string[];
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  knowledgeCheck: {
    question: string;
    answer: string;
  };
  nextTopicId?: string;
}

export const AUTH_TOPICS: AuthTopic[] = """ + json.dumps(all_topics, indent=2) + ";\n"

with open(topics_ts_path, "w", encoding="utf-8") as f:
    f.write(topics_content)

print(f"Generated {topics_ts_path} with {len(all_topics)} topics.")

# 2. Generate problems.ts
problems_ts_path = "/home/subhajit/project/cscosmos/src/components/visualizers/authviz/data/problems.ts"

problems_content = """// 60 Comprehensive Practice Questions for Authentication, OAuth 2.0 & Identity Architecture
// Ordered pedagogically from Beginner to Advanced/Expert.
// Covers all 30 core modules in the AuthCosmos curriculum (2 problems per topic).

export interface AuthProblem {
  id: number;
  topicId: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AuthProblemCategory {
  id: string;
  name: string;
  count: number;
}

export const AUTH_PROBLEM_CATEGORIES: { id: string; name: string }[] = [
  { id: 'all', name: 'All Topics (60)' },
  { id: 'OAuth & OIDC', name: 'OAuth 2.0 & OIDC' },
  { id: 'JWT & Signatures', name: 'JWT & Digital Signatures' },
  { id: 'Sessions & Cookies', name: 'Sessions & Cookie Security' },
  { id: 'Authorization & RBAC', name: 'Authorization & Policy Engines' },
  { id: 'Cryptography & Passwords', name: 'Cryptography & Passwords' },
  { id: 'Resilience & Defense', name: 'Resilience & Attack Defenses' },
];

export const AUTH_PROBLEMS: AuthProblem[] = """ + json.dumps(all_problems, indent=2) + ";\n"

with open(problems_ts_path, "w", encoding="utf-8") as f:
    f.write(problems_content)

print(f"Generated {problems_ts_path} with {len(all_problems)} problems.")

# 3. Update problems.test.ts
test_ts_path = "/home/subhajit/project/cscosmos/src/components/visualizers/authviz/data/problems.test.ts"
test_content = """import { describe, it, expect } from 'vitest';
import { AUTH_PROBLEMS, AUTH_PROBLEM_CATEGORIES } from './problems';
import { AUTH_TOPICS } from './topics';

describe('AuthCosmos Practice Problems Dataset', () => {
  it('contains exactly 60 curated problems (2 per topic)', () => {
    expect(AUTH_PROBLEMS.length).toBe(60);
  });

  it('has sequential IDs from 1 to 60', () => {
    AUTH_PROBLEMS.forEach((p, index) => {
      expect(p.id).toBe(index + 1);
    });
  });

  it('has valid structure for all problems', () => {
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const validTopicIds = new Set(AUTH_TOPICS.map((t) => t.id));

    AUTH_PROBLEMS.forEach((p) => {
      expect(p.question.trim().length).toBeGreaterThan(10);
      expect(p.options).toHaveLength(4);
      p.options.forEach((opt) => {
        expect(opt.trim().length).toBeGreaterThan(0);
      });
      expect(p.correctIndex).toBeGreaterThanOrEqual(0);
      expect(p.correctIndex).toBeLessThan(4);
      expect(p.explanation.trim().length).toBeGreaterThan(10);
      expect(validDifficulties).toContain(p.difficulty);
      expect(validTopicIds.has(p.topicId)).toBe(true);
    });
  });

  it('covers all 30 topics across the curriculum with exactly 2 questions each', () => {
    const topicCountMap = new Map<string, number>();
    AUTH_PROBLEMS.forEach((p) => {
      topicCountMap.set(p.topicId, (topicCountMap.get(p.topicId) || 0) + 1);
    });

    AUTH_TOPICS.forEach((t) => {
      expect(topicCountMap.get(t.id)).toBe(2);
    });
  });

  it('defines valid categories', () => {
    expect(AUTH_PROBLEM_CATEGORIES.length).toBeGreaterThanOrEqual(6);
  });
});
"""

with open(test_ts_path, "w", encoding="utf-8") as f:
    f.write(test_content)

print(f"Updated {test_ts_path}")
