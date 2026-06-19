import {
  DIVISORS,
  THEMES,
  WESTERN_NAMES,
  pickWeightedByDifficultyTier,
} from '../data/divisionFacts.js';

export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDistractors(correct, count = 3) {
  const distractors = new Set();
  let attempts = 0;
  while (distractors.size < count && attempts < 50) {
    const offset = (Math.random() > 0.5 ? 1 : -1) * randomInt(1, 3);
    const d = correct + offset;
    if (d > 0 && d !== correct) distractors.add(d);
    attempts++;
  }
  [correct - 1, correct + 1, correct + 2, correct - 2].forEach((d) => {
    if (d > 0 && d !== correct && distractors.size < count) distractors.add(d);
  });
  return shuffleArray([correct, ...distractors]);
}

const FORMATS = ['groupingVisual', 'numberSentence', 'wordProblem', 'inverseMultiplication'];

function buildQuestion({ dividend, divisor, quotient, format, theme, id, difficultyTier }) {
  const t = THEMES[theme];
  const name = pick(WESTERN_NAMES);

  let questionText = '';
  let visual = null;
  let options = generateDistractors(quotient);
  let correctAnswer = quotient;

  switch (format) {
    case 'groupingVisual':
      questionText = `Group these ${dividend} ${t.items} into ${t.container}s of ${divisor}. How many ${t.container}s?`;
      visual = 'grouping';
      break;
    case 'numberSentence':
      questionText = `Fill in the blank: ${dividend} ÷ ${divisor} = ___`;
      visual = 'sentence';
      break;
    case 'wordProblem':
      questionText = `${name} has ${dividend} ${t.items}. She puts ${divisor} in each ${t.container}. How many ${t.container}s does ${name} need?`;
      visual = 'word';
      break;
    case 'inverseMultiplication':
      questionText = `If ${divisor} × ${quotient} = ${dividend}, then ${dividend} ÷ ${divisor} = ___`;
      visual = 'inverse';
      options = generateDistractors(quotient);
      break;
    default:
      break;
  }

  return {
    id,
    dividend,
    divisor,
    quotient,
    format,
    theme,
    themeData: t,
    difficultyTier,
    questionText,
    displayText: questionText,
    visual,
    options,
    correctAnswer,
    explanation: `${dividend} ÷ ${divisor} = ${quotient}. ${quotient} groups of ${divisor} make ${dividend}!`,
    world: Math.floor(parseInt(id.replace('q', ''), 10) / 10),
  };
}

export function generateQuestionPool(count = 100, tier = 'mixed') {
  const pool = [];
  const usedSignatures = new Set();
  let attempts = 0;

  while (pool.length < count && attempts < count * 20) {
    attempts++;
    const divisor = pickWeightedByDifficultyTier(DIVISORS, tier);
    const quotient = randomInt(1, 10);
    const dividend = divisor * quotient;
    const format = pick(FORMATS);
    const theme = pick(Object.keys(THEMES));
    const signature = `${dividend}-${divisor}-${format}-${theme}`;

    if (usedSignatures.has(signature)) continue;
    usedSignatures.add(signature);

    pool.push(
      buildQuestion({
        dividend,
        divisor,
        quotient,
        format,
        theme,
        id: `q${pool.length}`,
        difficultyTier: tier,
      })
    );
  }

  return pool;
}

export function generateSessionQuestions() {
  const pool = generateQuestionPool(100, 'mixed');
  return pool.map((q, i) => ({ ...q, world: Math.floor(i / 10) }));
}

export function getNextTier(currentTier, streak, wrongStreak) {
  if (wrongStreak >= 2) return 'easy';
  if (streak >= 3 && currentTier === 'easy') return 'medium';
  if (streak >= 3 && currentTier === 'medium') return 'mixed';
  return currentTier;
}
