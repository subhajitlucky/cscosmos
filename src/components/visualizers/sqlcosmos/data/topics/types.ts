export interface SqlTopicTable {
  title?: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface SqlTopicInterviewQuestion {
  question: string;
  answer: string;
  codeBlock?: string;
  comparisonTable?: { headers: string[]; rows: (string | number)[][] };
}

export interface SqlTopicQuickTest {
  question: string;
  tableContext?: SqlTopicTable[];
  codeBlock?: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface SqlTopic {
  id: string;
  topicNumber: number; // 1 to 50
  title: string;
  category: 'foundations' | 'indexing' | 'query-execution' | 'transactions' | 'architecture';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;

  // 1. Definition
  definition: string;

  // 2. Explain Like I'm 5
  eli5: string;

  // 3. Real-World Example
  realWorldExample: {
    description: string;
    tables?: SqlTopicTable[];
    explanation: string;
  };

  // 4. SQL Syntax
  sqlSyntaxSteps: {
    step: string;
    code: string;
    note?: string;
  }[];

  // 5. Important Rules
  rulesTable: {
    rule: string;
    explanation: string;
  }[];

  // 6. Deep Dive / Special mechanics
  deepDive: {
    title: string;
    description: string;
    codeSnippet?: string;
    warning?: string;
  };

  // 7. Advantages & Disadvantages
  advantages: string[];
  disadvantages: string[];

  // 8. Common Interview Questions
  interviewQuestions: SqlTopicInterviewQuestion[];

  // 9. Interview-Ready Answer
  interviewReadyAnswer: string;

  // 10. Quick Test
  quickTest: SqlTopicQuickTest;

  // Backward-compatibility fields:
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
  prevTopicId?: string;
}
