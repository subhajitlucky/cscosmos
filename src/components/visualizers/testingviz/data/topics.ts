export interface TestingTopic {
  id: string;
  title: string;
  kicker: string;
  group: 'Foundations' | 'Integration & E2E' | 'Practice';
  difficulty: 'starter' | 'intermediate' | 'advanced';
  summary: string;
  definition: string;
  analogy: string;
  keyPoints: string[];
  codeSnippet: string;
  mistakes: string[];
  check: {
    question: string;
    answer: string;
  };
  related: string[];
}

export const testingTopics: TestingTopic[] = [
  {
    id: 'testing-pyramid',
    title: 'The Testing Pyramid',
    kicker: 'Foundations / 01',
    group: 'Foundations',
    difficulty: 'starter',
    summary: 'Why fast unit tests should outnumber slow end-to-end tests, and where integration tests fit.',
    definition:
      'The testing pyramid is a portfolio rule: many small unit tests, fewer integration tests, and a small number of end-to-end tests. The shape keeps feedback fast and failures easy to localize while still proving the assembled system works.',
    analogy:
      'A pyramid of evidence: thousands of close-up photos, hundreds of room-level shots, and a few wide aerial photos. You get detail cheaply, then pay for the expensive wide view only where it matters.',
    keyPoints: [
      'Unit tests are fast, deterministic, and isolate one behavior.',
      'Integration tests verify real boundaries: database, HTTP, queue, filesystem.',
      'E2E tests prove a user journey through the deployed stack.',
      'The pyramid is a default, not a law — critical flows deserve more E2E coverage.',
      'Test size and test scope are different axes; a slow unit test is still a unit test.',
    ],
    codeSnippet: `// Unit: pure business rule, no I/O
expect(canWithdraw(100, 40)).toBe(true);

// Integration: real repository + real database
const repo = new AccountRepository(testDb);
await repo.save({ id: 'a1', balance: 100 });
expect(await repo.balance('a1')).toBe(100);

// E2E: real browser through the real app
await page.goto('/accounts/a1');
await page.getByRole('button', { name: 'Withdraw' }).click();
await expect(page.getByText('Balance: $60')).toBeVisible();`,
    mistakes: [
      'Calling every test an integration test because it imports more than one file.',
      'Building an inverted pyramid: hundreds of brittle E2E tests and almost no unit tests.',
      'Mocking the database in every test, then discovering migrations and queries are broken in production.',
    ],
    check: {
      question: 'Why should unit tests usually outnumber E2E tests?',
      answer:
        'They run in milliseconds, isolate the failing behavior, and do not need a browser, network, or database. E2E tests are slower and flakier, so reserve them for critical user journeys.',
    },
    related: ['unit-testing', 'integration-testing', 'e2e-testing'],
  },
  {
    id: 'unit-testing',
    title: 'Unit Testing',
    kicker: 'Foundations / 02',
    group: 'Foundations',
    difficulty: 'starter',
    summary: 'Arrange-Act-Assert, deterministic inputs, and testing behavior instead of implementation details.',
    definition:
      'A unit test exercises one small unit of behavior in isolation and asserts an observable outcome. Good unit tests are fast, repeatable, independent, and readable. They describe what the code promises, not how it happens to be written today.',
    analogy:
      'Testing a single Lego brick: does the stud fit, does the color match, does it survive pressure? You do not need to build the whole castle to know the brick is sound.',
    keyPoints: [
      'Structure every test as Arrange → Act → Assert.',
      'Assert observable behavior, not private methods or call order.',
      'One logical behavior per test; multiple assertions are fine if they describe the same outcome.',
      'Use deterministic inputs: no Date.now(), random values, or live network.',
      'A failing test should tell you what broke without opening the debugger.',
    ],
    codeSnippet: `import { describe, expect, it } from 'vitest';
import { applyDiscount } from './pricing';

describe('applyDiscount', () => {
  it('applies a percentage discount to the subtotal', () => {
    // Arrange
    const subtotal = 200;
    const discount = 0.15;

    // Act
    const total = applyDiscount(subtotal, discount);

    // Assert
    expect(total).toBe(170);
  });

  it('never returns a negative total', () => {
    expect(applyDiscount(10, 2)).toBe(0);
  });
});`,
    mistakes: [
      'Testing implementation details such as how many times a private helper ran.',
      'Sharing mutable state between tests so order changes the result.',
      'Writing a test that passes even when the feature is deleted.',
      'Using snapshot tests for logic that should have explicit assertions.',
    ],
    check: {
      question: 'What does Arrange-Act-Assert buy you?',
      answer:
        'It separates setup, the behavior under test, and the expected outcome, so a failing test is easy to read and debug.',
    },
    related: ['testing-pyramid', 'test-doubles', 'tdd'],
  },
  {
    id: 'test-doubles',
    title: 'Mocks, Stubs & Spies',
    kicker: 'Foundations / 03',
    group: 'Foundations',
    difficulty: 'intermediate',
    summary: 'When to fake a dependency, when to use the real thing, and how mocks quietly make tests lie.',
    definition:
      'Test doubles replace a real dependency during a test. A stub returns canned data, a spy records calls, and a mock sets expectations about calls. They are useful at slow or non-deterministic boundaries, but overuse turns tests into assertions about your own fake.',
    analogy:
      'A flight simulator: useful for training a pilot without burning fuel, but it cannot prove the real aircraft’s engine works. Use it for the pilot, not for the engine.',
    keyPoints: [
      'Prefer fakes at boundaries you do not own: payment APIs, email, clocks, external HTTP.',
      'Use the real database when the query or migration is the behavior under test.',
      'Mocking an internal module couples the test to today’s file layout.',
      'Assert on outcomes first; assert on interactions only when the interaction is the contract.',
      'Reset mocks between tests to avoid order-dependent leaks.',
    ],
    codeSnippet: `// Stub: return a fixed response from a slow external API
const payments = {
  charge: vi.fn().mockResolvedValue({ id: 'ch_123', status: 'succeeded' }),
};

const receipt = await checkout({ payments, amount: 4200 });

expect(receipt.status).toBe('succeeded');
expect(payments.charge).toHaveBeenCalledWith(
  expect.objectContaining({ amount: 4200 }),
);`,
    mistakes: [
      'Mocking the function you are supposed to be testing.',
      'Asserting every internal call, so refactoring breaks dozens of tests.',
      'Forgetting to restore a mocked clock and leaking fake time into later tests.',
      'Using a mock that returns data the real API could never return.',
    ],
    check: {
      question: 'When is a mock the wrong tool?',
      answer:
        'When the real dependency is fast, deterministic, and part of the behavior you need to verify — such as your own database query or a pure function.',
    },
    related: ['unit-testing', 'integration-testing', 'contract-testing'],
  },
  {
    id: 'integration-testing',
    title: 'Integration Testing',
    kicker: 'Integration / 04',
    group: 'Integration & E2E',
    difficulty: 'intermediate',
    summary: 'Test the seams: real HTTP handlers, real SQL, real queues, real serialization.',
    definition:
      'An integration test verifies that two or more real components work together. It catches the failures unit tests cannot see: wrong SQL, missing migrations, JSON shape mismatches, auth middleware order, transaction boundaries, and queue serialization.',
    analogy:
      'Checking that the plumbing actually connects: each pipe can be perfect on its own, but water still leaks at the joint.',
    keyPoints: [
      'Use a disposable database and run real migrations.',
      'Exercise the HTTP layer, not just the service function.',
      'Assert status codes, response bodies, and persisted rows.',
      'Keep each test isolated with transactions or unique fixtures.',
      'Run integration tests in CI against the same engine version as production.',
    ],
    codeSnippet: `import request from 'supertest';
import { app } from '../app';
import { migrate, truncate } from './test-db';

beforeAll(migrate);
beforeEach(truncate);

it('creates an account and returns 201', async () => {
  const res = await request(app)
    .post('/accounts')
    .send({ name: 'Ada', currency: 'USD' });

  expect(res.status).toBe(201);
  expect(res.body).toMatchObject({ name: 'Ada', balance: 0 });
});`,
    mistakes: [
      'Using the production database because the test database is inconvenient.',
      'Skipping migrations and testing against a schema that no longer exists.',
      'Sharing one account row across parallel tests and getting random failures.',
      'Mocking the HTTP layer, which turns an integration test back into a unit test.',
    ],
    check: {
      question: 'What class of bug does an integration test catch that a unit test cannot?',
      answer:
        'Boundary bugs: SQL and migrations, serialization, middleware order, auth, transactions, and real network contracts.',
    },
    related: ['unit-testing', 'e2e-testing', 'contract-testing'],
  },
  {
    id: 'e2e-testing',
    title: 'End-to-End Testing',
    kicker: 'Integration / 05',
    group: 'Integration & E2E',
    difficulty: 'intermediate',
    summary: 'A real browser, a real server, and a small set of journeys that must never break.',
    definition:
      'An end-to-end test drives the deployed system the way a user does: browser, network, server, database. It is the most realistic and the slowest, flakiest, and most expensive test you can write. Use it for revenue-critical and auth-critical journeys, not every form field.',
    analogy:
      'A full dress rehearsal: the costumes, lights, orchestra, and audience are all real. Expensive, but it is the only rehearsal that proves the whole show works.',
    keyPoints: [
      'Test user-visible behavior with role, label, and text selectors.',
      'Run against a production-like build, not the dev server.',
      'Control test data through APIs or a seeded database, not by clicking through setup.',
      'Capture trace, video, and screenshots on failure.',
      'Quarantine flaky tests instead of retrying them forever.',
    ],
    codeSnippet: `import { test, expect } from '@playwright/test';

test('user can sign in and see the dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('ada@example.com');
  await page.getByLabel('Password').fill('correct-horse');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Welcome, Ada' })).toBeVisible();
});`,
    mistakes: [
      'Testing every validation message through the browser when a unit test is enough.',
      'Using CSS selectors tied to styling classes.',
      'Depending on test order or leftover data from a previous run.',
      'Ignoring flaky tests until the suite is trusted by nobody.',
    ],
    check: {
      question: 'Which journeys deserve E2E coverage?',
      answer:
        'The ones where failure blocks the business: sign-up, login, checkout/payment, password reset, and the core workflow of the product.',
    },
    related: ['integration-testing', 'testing-pyramid', 'contract-testing'],
  },
  {
    id: 'contract-testing',
    title: 'Contract Testing',
    kicker: 'Integration / 06',
    group: 'Integration & E2E',
    difficulty: 'advanced',
    summary: 'Catch breaking API changes without spinning up every service in the company.',
    definition:
      'Contract testing verifies that a consumer and a provider agree on the shape of their interaction. The consumer publishes expectations; the provider verifies it still satisfies them. This catches breaking changes in CI without a full E2E environment.',
    analogy:
      'A socket and a plug are tested against the same standard, not against every appliance in the building. If both match the contract, they connect.',
    keyPoints: [
      'Contracts describe requests, responses, status codes, and schema — not business logic.',
      'Consumer-driven contracts make the consumer’s needs explicit.',
      'Provider verification runs in the provider’s pipeline.',
      'Contract tests complement integration tests; they do not replace them.',
      'Version and publish contracts so both sides can evolve safely.',
    ],
    codeSnippet: `// Consumer expectation (Pact-style)
provider
  .given('account a1 exists')
  .uponReceiving('a request for account a1')
  .withRequest({ method: 'GET', path: '/accounts/a1' })
  .willRespondWith({
    status: 200,
    body: { id: 'a1', name: 'Ada', balance: 60 },
  });

// Provider verification runs against the real provider in CI.
await new Verifier({ providerBaseUrl: 'http://localhost:3000' })
  .verifyProvider();`,
    mistakes: [
      'Treating a contract test as a full integration test and asserting database state.',
      'Letting contracts drift because only the consumer pipeline runs them.',
      'Over-specifying fields the consumer does not actually use.',
      'Using contract tests for internal function calls instead of service boundaries.',
    ],
    check: {
      question: 'What does a contract test prove?',
      answer:
        'That the consumer and provider still agree on the request/response shape, so a provider change will not break the consumer.',
    },
    related: ['integration-testing', 'e2e-testing', 'test-doubles'],
  },
  {
    id: 'tdd',
    title: 'TDD: Red, Green, Refactor',
    kicker: 'Practice / 07',
    group: 'Practice',
    difficulty: 'intermediate',
    summary: 'Write the failing test first, make it pass with the simplest code, then improve the design.',
    definition:
      'Test-driven development is a tight loop: write a test for the next small behavior (red), make it pass with the simplest implementation (green), then refactor with the safety net still in place. The test is a design tool, not an afterthought.',
    analogy:
      'Building a bridge with a load test running first: you define the weight it must carry, build until it holds, then strengthen the structure without changing the requirement.',
    keyPoints: [
      'Red: the test must fail for the right reason.',
      'Green: write only enough code to pass; do not gold-plate.',
      'Refactor: remove duplication and improve names with tests green.',
      'Keep cycles short — seconds to minutes, not hours.',
      'TDD is hardest at boundaries; spike first, then test-drive the real implementation.',
    ],
    codeSnippet: `// 1. RED — the function does not exist yet
it('rejects a withdrawal larger than the balance', () => {
  expect(() => withdraw({ balance: 50 }, 80)).toThrow('Insufficient funds');
});

// 2. GREEN — simplest implementation
export function withdraw(account: { balance: number }, amount: number) {
  if (amount > account.balance) throw new Error('Insufficient funds');
  account.balance -= amount;
}

// 3. REFACTOR — extract a rule, keep the test green
export function canWithdraw(balance: number, amount: number) {
  return amount <= balance;
}`,
    mistakes: [
      'Writing a test that already passes, so it never proves anything.',
      'Writing all the tests first and then all the code — that is test-first, not TDD.',
      'Skipping the refactor step and accumulating duplication.',
      'Testing trivial getters while the risky business rule has no test.',
    ],
    check: {
      question: 'Why must the first test fail?',
      answer:
        'A test that passes before the implementation proves nothing. The red step confirms the test can detect the missing behavior.',
    },
    related: ['unit-testing', 'property-based-testing', 'coverage-mutation'],
  },
  {
    id: 'property-based-testing',
    title: 'Property-Based Testing',
    kicker: 'Practice / 08',
    group: 'Practice',
    difficulty: 'advanced',
    summary: 'State invariants, generate hundreds of inputs, and let the framework shrink failures to a minimal case.',
    definition:
      'Property-based testing describes invariants that must hold for all valid inputs, then generates many inputs to try to break them. When a failure is found, the framework shrinks it to the smallest reproducing case. It finds edge cases example-based tests miss.',
    analogy:
      'Instead of checking ten specific bridges, you state “no bridge may collapse under twice its rated load” and let a machine try thousands of bridge designs.',
    keyPoints: [
      'Properties are invariants: round-trip, idempotence, ordering, conservation.',
      'Generators define the input space; keep them realistic.',
      'Shrinking turns a random failure into a tiny reproducible example.',
      'Use it for parsers, serializers, math, state machines, and data transforms.',
      'Property tests complement, not replace, example-based tests.',
    ],
    codeSnippet: `import { fc, test } from '@fast-check/vitest';
import { encode, decode } from './codec';

test.prop([fc.string()])('decode is the inverse of encode', (input) => {
  expect(decode(encode(input))).toBe(input);
});

test.prop([fc.array(fc.integer())])('sorting is idempotent', (items) => {
  const once = [...items].sort((a, b) => a - b);
  const twice = [...once].sort((a, b) => a - b);
  expect(twice).toEqual(once);
});`,
    mistakes: [
      'Writing a property that is just the implementation restated.',
      'Using generators that produce mostly invalid inputs and test nothing.',
      'Ignoring the shrunk counterexample and fixing only the random seed.',
      'Expecting property tests to replace readable example-based tests.',
    ],
    check: {
      question: 'What is shrinking in property-based testing?',
      answer:
        'When a generated input fails, the framework repeatedly simplifies it to the smallest input that still fails, giving you a reproducible bug report.',
    },
    related: ['tdd', 'unit-testing', 'coverage-mutation'],
  },
  {
    id: 'coverage-mutation',
    title: 'Coverage & Mutation Testing',
    kicker: 'Practice / 09',
    group: 'Practice',
    difficulty: 'advanced',
    summary: 'Coverage tells you what ran. Mutation testing tells you whether your assertions can actually catch a bug.',
    definition:
      'Line coverage measures which code executed during tests. It does not prove the assertions are meaningful. Mutation testing changes the code in small ways (mutants) and checks whether a test fails. A surviving mutant is a gap in the suite’s ability to detect real defects.',
    analogy:
      'Coverage is checking that every room was walked through. Mutation testing is planting a small fire in each room to see whether the alarm actually goes off.',
    keyPoints: [
      'Coverage is a diagnostic, not a target to maximize blindly.',
      'High coverage with weak assertions still ships bugs.',
      'Mutation testing reports survived mutants as actionable gaps.',
      'Run mutation testing on critical modules, not the whole repo on every commit.',
      'Track coverage trends, not a single vanity percentage.',
    ],
    codeSnippet: `// 100% line coverage, zero meaningful assertions:
it('covers the discount branch', () => {
  applyDiscount(100, 0.2); // no expect()
});

// Mutation-aware test:
it('subtracts the discount from the total', () => {
  expect(applyDiscount(100, 0.2)).toBe(80);
});

// A mutant that changes 0.2 to 0.1 is killed by the assertion above.`,
    mistakes: [
      'Adding tests that execute code without asserting anything.',
      'Gaming coverage by excluding files or ignoring branches.',
      'Running mutation testing on every file and drowning in low-value mutants.',
      'Treating 100% coverage as proof of correctness.',
    ],
    check: {
      question: 'What does a surviving mutant mean?',
      answer:
        'A code change was made and no test failed, so the suite cannot detect that class of defect. It is a concrete gap to address.',
    },
    related: ['unit-testing', 'property-based-testing', 'tdd'],
  },
];

export const testingTopicGroups = [
  {
    id: 'foundations',
    name: 'Foundations',
    description: 'The shape of a healthy suite, unit tests, and test doubles.',
    topics: testingTopics.filter((topic) => topic.group === 'Foundations'),
  },
  {
    id: 'integration-e2e',
    name: 'Integration & E2E',
    description: 'Real boundaries, real browsers, and service contracts.',
    topics: testingTopics.filter((topic) => topic.group === 'Integration & E2E'),
  },
  {
    id: 'practice',
    name: 'Practice',
    description: 'TDD, property-based testing, and measuring whether assertions bite.',
    topics: testingTopics.filter((topic) => topic.group === 'Practice'),
  },
];

export function getTestingTopic(id: string): TestingTopic | undefined {
  return testingTopics.find((topic) => topic.id === id);
}
