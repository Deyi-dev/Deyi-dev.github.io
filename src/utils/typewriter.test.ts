import { describe, it, expect } from 'vitest';
import { generateFrames, defaultConfig } from './typewriter';

const frames = generateFrames();

describe('typewriter animation frames', () => {
  it('first frame is empty', () => {
    expect(frames[0]).toEqual({ accent: '', plain: '' });
  });

  it('types out full first phrase', () => {
    const full = defaultConfig.firstWord + defaultConfig.suffix;
    // Find the frame where typing phase 1 completes
    const lastTypeFrame = frames[full.length];
    expect(lastTypeFrame).toEqual({
      accent: defaultConfig.firstWord,
      plain: defaultConfig.suffix,
    });
  });

  it('deletes first word down to empty accent', () => {
    // After typing (full.length + 1 frames) and deleting (firstWord.length frames),
    // the accent should be empty
    const full = defaultConfig.firstWord + defaultConfig.suffix;
    const afterDelete = frames[full.length + defaultConfig.firstWord.length];
    expect(afterDelete).toEqual({ accent: '', plain: defaultConfig.suffix });
  });

  it('ends with new word fully typed', () => {
    const last = frames[frames.length - 1];
    expect(last).toEqual({
      accent: defaultConfig.newWord,
      plain: defaultConfig.suffix,
    });
  });

  it('final text reads "thrive in AI"', () => {
    const last = frames[frames.length - 1];
    expect(last.accent + last.plain).toBe('thrive in AI');
  });

  it('generates correct total number of frames', () => {
    const full = defaultConfig.firstWord + defaultConfig.suffix;
    // type: full.length + 1, delete: firstWord.length, retype: newWord.length
    const expected = (full.length + 1) + defaultConfig.firstWord.length + defaultConfig.newWord.length;
    expect(frames.length).toBe(expected);
  });
});
