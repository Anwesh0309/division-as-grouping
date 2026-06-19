import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2';
const audioDir = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const getElevenLabsSettings = (style) => {
  switch (style) {
    case 'celebration':
      return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement':
      return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
    case 'question':
      return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':
      return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
    case 'thinking':
      return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
    default:
      return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
  }
};

const phrases = [
  { text: 'Welcome to Division as Grouping!', style: 'encouragement' },
  { text: "Today, we're going to learn how to split numbers into equal groups.", style: 'statement' },
  {
    text: 'If I have 12 apples and want 4 in each basket, how many baskets do I need?',
    style: 'question',
  },
  {
    text: "Are you ready to join Leo on a fun grouping adventure? Let's begin our learning journey!",
    style: 'encouragement',
  },
  {
    text: 'If I have 12 apples and want 4 in each basket, how many baskets do I need?',
    style: 'question',
  },
  {
    text: 'Division is about making equal groups — let us find out!',
    style: 'statement',
  },
  {
    text: 'If there are 20 stickers and we put 5 in each bag, how many bags can we make?',
    style: 'question',
  },
  { text: 'When we group equally, we are dividing!', style: 'statement' },
  { text: 'How can equal grouping help us solve division?', style: 'question' },
  { text: 'Groups are like teams — same size, counted together!', style: 'statement' },
  { text: 'If 3 times 4 equals 12, what is 12 divided by 3?', style: 'question' },
  { text: 'Multiplication and division are best friends!', style: 'statement' },
  {
    text: 'What happens when we split a big number into equal smaller groups?',
    style: 'question',
  },
  { text: 'That is exactly what division as grouping does!', style: 'statement' },
  {
    text: 'Leo picked 12 shiny apples from his garden. He wants to pack them into baskets with 3 apples in each basket. Leo wonders...',
    style: 'statement',
  },
  { text: 'How many baskets do I need?', style: 'question' },
  { text: "Let's help Leo group his apples!", style: 'encouragement' },
  {
    text: 'To find out, we make equal groups. We put 3 apples in each basket until all 12 apples are packed. This is called division as grouping!',
    style: 'statement',
  },
  { text: '12 divided by 3 equals 4 baskets!', style: 'emphasis' },
  { text: 'Division means making equal groups!', style: 'statement' },
  {
    text: 'Leo drew circles to show his groups. Each circle is one basket with 3 apples inside. He counted the circles and found 4 groups. "When I know the group size, I count how many groups I can make!" he said.',
    style: 'statement',
  },
  { text: 'Group size times number of groups equals the total!', style: 'emphasis' },
  { text: 'Count the groups to solve!', style: 'encouragement' },
  {
    text: 'Leo was so excited! He learned that division is the opposite of multiplication. "Can we practice more grouping?" he asked Emma.',
    style: 'statement',
  },
  { text: 'Equal groups — here we come!', style: 'encouragement' },
  { text: 'Your turn now!', style: 'encouragement' },
  {
    text: 'Drag 12 objects into groups of 3. Count how many groups you make!',
    style: 'statement',
  },
  {
    text: 'Drag 8 objects into groups of 2. Count how many groups you make!',
    style: 'statement',
  },
  {
    text: 'Drag 15 objects into groups of 5. Count how many groups you make!',
    style: 'statement',
  },
  {
    text: 'Drag 16 objects into groups of 4. Count how many groups you make!',
    style: 'statement',
  },
  {
    text: 'Tap to circle equal groups of dots on the grid. How many groups can you make?',
    style: 'statement',
  },
  { text: 'Jump along the number line in equal steps. Each jump is one group!', style: 'statement' },
  { text: 'Fill in the division sentence! Use the number pad.', style: 'statement' },
  { text: '12 divided by 3 equals 4 groups!', style: 'celebration' },
  { text: 'Great grouping!', style: 'encouragement' },
  { text: '8 divided by 2 equals 4 groups!', style: 'celebration' },
  { text: '15 divided by 5 equals 3 groups!', style: 'celebration' },
  { text: '16 divided by 4 equals 4 groups!', style: 'celebration' },
  { text: '3 jumps of 4 make 12!', style: 'celebration' },
  { text: 'Yes! 12 divided by 3 equals 4!', style: 'celebration' },
  { text: 'Yes! 8 divided by 4 equals 2!', style: 'celebration' },
  { text: 'What did you learn about division as grouping?', style: 'question' },
  { text: 'How confident do you feel about dividing into equal groups?', style: 'question' },
  { text: 'Welcome to Apple Orchard!', style: 'celebration' },
  { text: 'Welcome to Sticker Studio!', style: 'celebration' },
  { text: 'Welcome to Toy Town!', style: 'celebration' },
  { text: 'Welcome to Puppy Park!', style: 'celebration' },
  { text: 'Welcome to Pencil Palace!', style: 'celebration' },
  { text: 'Welcome to Group Galaxy!', style: 'celebration' },
  { text: 'Welcome to Basket Bay!', style: 'celebration' },
  { text: 'Welcome to Number Nest!', style: 'celebration' },
  { text: 'Welcome to Rainbow Groups!', style: 'celebration' },
  { text: 'Welcome to Division Castle!', style: 'celebration' },
  { text: 'Apple Orchard Complete!', style: 'statement' },
  { text: 'Score: 8 out of 10', style: 'statement' },
];

async function generate() {
  if (!apiKey) {
    console.error('Missing VITE_ELEVENLABS_API_KEY in .env.local');
    process.exit(1);
  }

  const mapData = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const safeName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50);
    const filename = `audio_${safeName}_${i}.mp3`;
    const filepath = path.join(audioDir, filename);

    mapData[text] = `/assets/audio/${filename}`;

    if (fs.existsSync(filepath)) {
      console.log(`Skipping (exists): ${filename}`);
      continue;
    }

    console.log(`Generating (${i + 1}/${phrases.length}): ${text.substring(0, 50)}...`);

    const settings = getElevenLabsSettings(style);

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: settings,
        }),
      });

      if (!res.ok) {
        console.error(`Failed: ${res.status} ${res.statusText}`);
        console.error(await res.text());
        continue;
      }

      const buffer = await res.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log(`Saved: ${filename}`);
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
  fs.writeFileSync(mapFile, `export const audioMap = ${JSON.stringify(mapData, null, 2)};\n`);
  console.log(`Done! ${Object.keys(mapData).length} phrases mapped.`);
}

generate();
