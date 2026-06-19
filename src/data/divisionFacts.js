// MOE P2 Division facts — divisors 2, 3, 4, 5, 10; no remainders
export const DIVISORS = [2, 3, 4, 5, 10];

export const EASY_DIVISORS = [2, 5, 10];
export const MEDIUM_DIVISORS = [3, 4];

export const THEMES = {
  fruits: { emoji: '🍎', container: 'basket', containerEmoji: '🧺', items: 'apples' },
  stickers: { emoji: '⭐', container: 'bag', containerEmoji: '👜', items: 'stickers' },
  toys: { emoji: '🧸', container: 'box', containerEmoji: '📦', items: 'toys' },
  animals: { emoji: '🐶', container: 'pen', containerEmoji: '🏠', items: 'puppies' },
  pencils: { emoji: '✏️', container: 'bundle', containerEmoji: '📚', items: 'pencils' },
};

export const WESTERN_NAMES = ['Leo', 'Emma', 'Jake', 'Sophie', 'Oliver', 'Mia', 'Noah', 'Lily'];

export function getValidFacts(maxQuotient = 10) {
  const facts = [];
  for (const divisor of DIVISORS) {
    for (let quotient = 1; quotient <= maxQuotient; quotient++) {
      facts.push({ dividend: divisor * quotient, divisor, quotient });
    }
  }
  return facts;
}

export function pickWeightedByDifficultyTier(divisors, tier) {
  if (tier === 'easy') {
    return EASY_DIVISORS[Math.floor(Math.random() * EASY_DIVISORS.length)];
  }
  if (tier === 'medium') {
    return MEDIUM_DIVISORS[Math.floor(Math.random() * MEDIUM_DIVISORS.length)];
  }
  return divisors[Math.floor(Math.random() * divisors.length)];
}
