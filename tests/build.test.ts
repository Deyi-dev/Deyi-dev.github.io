import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';

const expectedPages = [
  'dist/index.html',
  'dist/about/index.html',
  'dist/projects/index.html',
  'dist/blog/why-your-rag-pipeline-is-lying/index.html',
  'dist/blog/building-agents-that-work/index.html',
  'dist/blog/mcp-server-i-use-every-day/index.html',
  'dist/blog/context-windows-are-new-memory/index.html',
  'dist/blog/from-railway-to-ai-engineer/index.html',
  'dist/blog/langchain-considered-harmful/index.html',
];

describe('build output', () => {
  expectedPages.forEach(page => {
    it(`generates ${page}`, () => {
      expect(existsSync(page)).toBe(true);
    });
  });
});
