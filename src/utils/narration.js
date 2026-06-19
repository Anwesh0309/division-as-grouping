import { say, ask, cheer, emphasize, celebrate } from './audio';

export function introNarration() {
  return [
    cheer('Welcome to Division as Grouping!'),
    say("Today, we're going to learn how to split numbers into equal groups."),
    ask('If I have 12 apples and want 4 in each basket, how many baskets do I need?'),
    cheer("Are you ready to join Leo on a fun grouping adventure? Let's begin our learning journey!"),
  ];
}

export function wonderNarration(questionText, subtext) {
  return [ask(questionText), say(subtext)];
}

export function wonderDiscoverNarration() {
  return [];
}

export function getStoryNarration(slideIndex) {
  switch (slideIndex) {
    case 0:
      return [
        say('Leo picked 12 shiny apples from his garden. He wants to pack them into baskets with 3 apples in each basket. Leo wonders...'),
        ask('How many baskets do I need?'),
        say("Let's help Leo group his apples!"),
      ];
    case 1:
      return [
        say('To find out, we make equal groups. We put 3 apples in each basket until all 12 apples are packed. This is called division as grouping!'),
        emphasize('12 divided by 3 equals 4 baskets!'),
        say('Division means making equal groups!'),
      ];
    case 2:
      return [
        say('Leo drew circles to show his groups. Each circle is one basket with 3 apples inside. He counted the circles and found 4 groups. "When I know the group size, I count how many groups I can make!" he said.'),
        emphasize('Group size times number of groups equals the total!'),
        say('Count the groups to solve!'),
      ];
    case 3:
      return [
        say('Leo was so excited! He learned that division is the opposite of multiplication. "Can we practice more grouping?" he asked Emma.'),
        cheer('Equal groups — here we come!'),
        say('Your turn now!'),
      ];
    default:
      return [];
  }
}

export function simulateStation1Intro(dividend, divisor) {
  return [say(`Drag ${dividend} objects into groups of ${divisor}. Count how many groups you make!`)];
}

export function simulateStation2Intro() {
  return [say('Tap to circle equal groups of dots on the grid. How many groups can you make?')];
}

export function simulateStation3Intro() {
  return [say('Jump along the number line in equal steps. Each jump is one group!')];
}

export function simulateStation4Intro() {
  return [say('Fill in the division sentence! Use the number pad.')];
}

export function reflectQuestionNarration(questionText) {
  return [ask(questionText)];
}

export function simulateAllComplete() {
  return [];
}

export function playWorldIntro(worldName) {
  return [celebrate(`Welcome to ${worldName}!`)];
}

export function playReadQuestion(questionText) {
  return [say(questionText)];
}

export function playCorrectNarration() {
  return [];
}

export function playWrongNarration() {
  return [];
}

export function playWorldComplete(worldName, score, total) {
  return [say(`${worldName} Complete!`), say(`Score: ${score} out of ${total}`)];
}

export function reflectIntroNarration() {
  return [ask('What did you learn about division as grouping?')];
}

export function reflectCorrectNarration() {
  return [];
}

export function reflectWrongNarration() {
  return [];
}

export function reflectConfidenceNarration() {
  return [ask('How confident do you feel about dividing into equal groups?')];
}

export function reflectCertificateNarration(pct) {
  return [say(`You scored ${Math.round(pct)} percent!`)];
}

export function getEncouragementNarration() {
  return [];
}
