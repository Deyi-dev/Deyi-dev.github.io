export interface TypewriterConfig {
  firstWord: string;
  suffix: string;
  newWord: string;
  typeSpeed: number;
  retypeSpeed: number;
  deleteSpeed: number;
  pauseBeforeDelete: number;
  pauseBeforeRetype: number;
}

export const defaultConfig: TypewriterConfig = {
  firstWord: 'survive',
  suffix: ' in AI',
  newWord: 'thrive',
  typeSpeed: 90,
  retypeSpeed: 180,
  deleteSpeed: 120,
  pauseBeforeDelete: 1500,
  pauseBeforeRetype: 400,
};

export type Frame = { accent: string; plain: string };

/** Generate every frame of the typewriter animation in order. */
export function generateFrames(config: TypewriterConfig = defaultConfig): Frame[] {
  const { firstWord, suffix, newWord } = config;
  const frames: Frame[] = [];

  // Phase 1: type full string character by character
  const full = firstWord + suffix;
  for (let i = 0; i <= full.length; i++) {
    const text = full.slice(0, i);
    const sp = text.indexOf(' ');
    if (sp === -1) {
      frames.push({ accent: text, plain: '' });
    } else {
      frames.push({ accent: text.slice(0, sp), plain: text.slice(sp) });
    }
  }

  // Phase 2: delete first word character by character
  for (let j = firstWord.length - 1; j >= 0; j--) {
    const word = firstWord.slice(0, j);
    frames.push({ accent: word, plain: suffix });
  }

  // Phase 3: type new word character by character
  for (let j = 1; j <= newWord.length; j++) {
    frames.push({ accent: newWord.slice(0, j), plain: suffix });
  }

  return frames;
}
