export interface MongoTopicDocument {
  collection: string;
  doc: Record<string, any>;
}

export interface MongoTopicInterviewQuestion {
  question: string;
  answer: string;
  codeBlock?: string;
  comparisonTable?: { headers: string[]; rows: (string | number)[][] };
}

export interface MongoTopicQuickTest {
  question: string;
  contextDocument?: Record<string, any>;
  codeBlock?: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface MongoTopic {
  id: string;
  topicNumber: number; // 1 to 50
  title: string;
  category: 'bson-storage' | 'wiredtiger' | 'indexing' | 'aggregation' | 'distributed';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  summary: string;

  // 1. Definition
  definition: string;

  // 2. Explain Like I'm 5
  eli5: string;

  // 3. Real-World Architecture Example
  realWorldExample: {
    description: string;
    sampleDocuments?: MongoTopicDocument[];
    explanation: string;
  };

  // 4. MQL Syntax Steps
  syntaxSteps: {
    step: string;
    code: string;
    note?: string;
  }[];

  // 5. Critical Engineering Rules
  rulesTable: {
    rule: string;
    explanation: string;
  }[];

  // 6. Deep Dive
  deepDive: {
    title: string;
    description: string;
    codeSnippet?: string;
    warning?: string;
  };

  // 7. Trade-offs
  advantages: string[];
  disadvantages: string[];

  // 8. Technical Interview Questions
  interviewQuestions: MongoTopicInterviewQuestion[];

  // 9. Staff-Level Ready Answer
  interviewReadyAnswer: string;

  // 10. Quick Knowledge Check
  quickTest: MongoTopicQuickTest;

  // Summary & Navigation Metadata
  mentalModel: string;
  codeSnippet: string;
  takeaways: string[];
  commonPitfall: { mistake: string; fix: string };
  nextTopicId?: string;
  prevTopicId?: string;
}
