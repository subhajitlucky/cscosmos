import { describe, it, expect } from 'vitest';
import {
  pythonAiSubtopics,
  pythonAiCategories,
  getPythonAiSubtopic,
  pythonAiQuizQuestions,
} from './python-ai';

describe('Python for AI Engineering Catalog Integrity', () => {
  it('contains exactly 24 comprehensive subtopics', () => {
    expect(pythonAiSubtopics).toHaveLength(24);
  });

  it('has strictly sequential numbering from 1 to 24 without gaps', () => {
    const numbers = pythonAiSubtopics.map((t) => t.number);
    const expected = Array.from({ length: 24 }, (_, i) => i + 1);
    expect(numbers).toEqual(expected);
  });

  it('has unique subtopic IDs', () => {
    const ids = pythonAiSubtopics.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('assigns valid categories to every subtopic', () => {
    const validCategories = new Set(pythonAiCategories.filter((c) => c !== 'All'));
    for (const subtopic of pythonAiSubtopics) {
      expect(validCategories.has(subtopic.category)).toBe(true);
    }
  });

  it('ensures each subtopic has deep engineering explanations and code examples', () => {
    for (const subtopic of pythonAiSubtopics) {
      expect(subtopic.title.trim().length).toBeGreaterThan(5);
      expect(subtopic.definition.trim().length).toBeGreaterThan(30);
      expect(subtopic.keyPoints.length).toBeGreaterThanOrEqual(3);
      expect(subtopic.analogy.trim().length).toBeGreaterThan(15);
      expect(subtopic.pitfall.trim().length).toBeGreaterThan(15);
      expect(subtopic.codeSnippet.trim().length).toBeGreaterThan(20);
      expect(subtopic.visualization).toBeDefined();
    }
  });

  it('retrieves subtopics by ID correctly with getPythonAiSubtopic', () => {
    const first = getPythonAiSubtopic('cpython-memory-model-pyobject');
    expect(first).toBeDefined();
    expect(first?.number).toBe(1);

    const mid = getPythonAiSubtopic('token-streaming-with-async-generators');
    expect(mid).toBeDefined();
    expect(mid?.category).toBe('Async & LLM Services');

    const last = getPythonAiSubtopic('uv-dependency-graph');
    expect(last).toBeDefined();
    expect(last?.number).toBe(24);

    expect(getPythonAiSubtopic('invalid-slug')).toBeUndefined();
  });
});

describe('Certification Quiz Questions Integrity', () => {
  it('contains 10 certification questions', () => {
    expect(pythonAiQuizQuestions).toHaveLength(10);
  });

  it('has unique question IDs and 4 distinct options per question', () => {
    const ids = pythonAiQuizQuestions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const q of pythonAiQuizQuestions) {
      expect(q.options).toHaveLength(4);
      expect(new Set(q.options).size).toBe(4);
      expect(q.correctIndex).toBeGreaterThanOrEqual(0);
      expect(q.correctIndex).toBeLessThan(4);
      expect(q.explanation.length).toBeGreaterThan(20);
    }
  });

  it('references valid subtopics from pythonAiSubtopics', () => {
    const validSubtopicIds = new Set(pythonAiSubtopics.map((t) => t.id));
    for (const q of pythonAiQuizQuestions) {
      expect(validSubtopicIds.has(q.subtopicId)).toBe(true);
    }
  });
});

describe('Memory Calculations & Strides Simulation', () => {
  it('correctly calculates PyObject vs Contiguous Buffer memory footprint', () => {
    const itemCount = 1_000_000;
    // Standard Python float: 8-byte pointer in list + 24-byte PyFloatObject = 32 bytes
    const pythonListBytes = itemCount * (8 + 24);
    // NumPy float32 contiguous buffer: 4 bytes per item
    const numpyFloat32Bytes = itemCount * 4;

    const memorySavingsRatio = pythonListBytes / numpyFloat32Bytes;
    expect(memorySavingsRatio).toBe(8); // Exactly 8x memory reduction!
    expect(numpyFloat32Bytes).toBe(4_000_000);
  });

  it('computes 2D row-major C strides correctly', () => {
    const rows = 3;
    const cols = 4;
    const itemsize = 4; // float32 = 4 bytes
    const rowStride = cols * itemsize; // 16 bytes
    const colStride = itemsize; // 4 bytes

    // Element at (row=2, col=3) byte offset:
    const targetRow = 2;
    const targetCol = 3;
    const byteOffset = targetRow * rowStride + targetCol * colStride;
    expect(byteOffset).toBe(2 * 16 + 3 * 4); // 44 bytes
  });
});
