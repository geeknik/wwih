/**
 * WWIH - Chaos Engine
 * Deterministic randomness for reproducible suffering
 */

// Generate a seed from userAgent + time bucket
function generateSeed(): number {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'default';
  const timeBucket = Math.floor(Date.now() / 60000); // Changes every minute
  const salt = Math.random().toString(36).substring(7);
  
  let hash = 0;
  const str = userAgent + timeBucket + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Seeded random number generator
class ChaosRNG {
  private seed: number;
  
  constructor(seed?: number) {
    this.seed = seed ?? generateSeed();
  }
  
  // Simple seeded random
  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }
  
  // Random between min and max
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  
  // Random integer
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
  
  // Random item from array
  pick<T>(arr: T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }
  
  // Shuffle array
  shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  
  // Chance check (returns true X% of time)
  chance(percent: number): boolean {
    return this.next() * 100 < percent;
  }
}

// Global chaos instance
export const chaos = new ChaosRNG();

// Evil utility functions
export const evil = {
  // Delay between 100-2500ms
  randomDelay(): number {
    return chaos.range(100, 2500);
  },
  
  // 5-15% chance to misroute
  shouldMisdirect(): boolean {
    return chaos.chance(chaos.range(5, 15));
  },
  
  // 30-60% chance to show confirmation
  shouldConfirm(): boolean {
    return chaos.chance(chaos.range(30, 60));
  },
  
  // Generate hostile error messages
  hostileErrors: [
    'No.',
    'Try again.',
    'Incorrect vibe.',
    'Your input displeases the server.',
    'Incorrect. Reflect.',
    'Have you tried understanding better?',
    'Skill issue.',
    'Nice try.',
    'Processing... failed. Obviously.',
    'This is obvious.',
    'You seem lost.',
    'Why would you do that?',
    'Unacceptable.',
    'Error 4O4: Too much optimism.',
    'Request denied. Heartlessly.'
  ],
  
  getRandomError(): string {
    return chaos.pick(evil.hostileErrors);
  },
  
  // Hostile button labels
  hostileButtons: [
    'Probably.',
    'Do it yourself.',
    'Fine.',
    'Whatever.',
    'If you insist.',
    'I guess.',
    'Despite your efforts.',
    'Fine (sad).',
    'Click if you dare.',
    'Proceed (regrettably).',
    'Continue (mistake).',
    'Yes (but why?).',
    'OK (but we warned you).',
    "Submit (don't say we didn't).",
    'Confirm (your doom).'
  ],
  
  getRandomButton(): string {
    return chaos.pick(evil.hostileButtons);
  },
  
  // Navigation lies
  navMisdirections: new Map([
    ['Home', ['About', 'FAQ', 'Contact', 'Store', 'Blog', 'Services']],
    ['About', ['Store', 'Contact', 'Home', 'Blog', 'FAQ']],
    ['Contact', ['FAQ', 'Home', 'Blog', 'About', 'Store']],
    ['FAQ', ['Store', 'Home', 'Contact', 'Blog', 'About']],
    ['Store', ['Home', 'About', 'Contact', 'FAQ', 'Blog']],
    ['Blog', ['Contact', 'FAQ', 'Home', 'Store', 'About']],
    ['Services', ['Home', 'About', 'FAQ', 'Store', 'Contact']]
  ]),
  
  getMisdirection(label: string): string {
    const options = this.navMisdirections.get(label) || ['Home', 'About', 'Contact'];
    return chaos.pick(options);
  },
  
  // Field wipe pattern (wipes 50% of fields on error)
  shouldWipeField(): boolean {
    return chaos.chance(50);
  },
  
  // Moving button offset
  getButtonOffset(): { x: number; y: number } {
    return {
      x: chaos.range(-30, 30),
      y: chaos.range(-20, 20)
    };
  },
  
  // Random required fields (changes per refresh)
  getRandomRequiredFields(allFields: string[]): string[] {
    const count = chaos.int(1, Math.ceil(allFields.length * 0.7));
    return chaos.shuffle(allFields).slice(0, count);
  }
};

export default chaos;
