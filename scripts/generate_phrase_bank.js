import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2';
const audioDir = path.join(__dirname, '../public/assets/audio/phrases');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const getSettings = () => ({
  stability: 0.2,
  similarity_boost: 0.55,
  style: 0.5,
  use_speaker_boost: true,
});

const numbers = Array.from({ length: 100 }, (_, i) => String(i + 1));
const objects = ['apples', 'stickers', 'toys', 'puppies', 'pencils', 'baskets', 'bags', 'boxes'];
const frames = [
  'Group these',
  'into bags of',
  'into baskets of',
  'How many bags?',
  'How many baskets?',
  'How many groups?',
  'Fill in the blank',
  'divided by',
  'equals',
  'groups of',
  'make',
];

async function generate() {
  if (!apiKey) {
    console.error('Missing API key');
    process.exit(1);
  }

  const phraseMap = {};
  const allPhrases = [...numbers, ...objects, ...frames];

  for (let i = 0; i < allPhrases.length; i++) {
    const text = allPhrases[i];
    const filename = `phrase_${text.replace(/[^a-z0-9]/gi, '_')}.mp3`;
    const filepath = path.join(audioDir, filename);
    phraseMap[text] = `/assets/audio/phrases/${filename}`;

    if (fs.existsSync(filepath)) {
      console.log(`Skip: ${text}`);
      continue;
    }

    console.log(`Generating phrase: ${text}`);

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: getSettings(),
        }),
      });

      if (!res.ok) {
        console.error(`Failed ${text}:`, await res.text());
        continue;
      }

      fs.writeFileSync(filepath, Buffer.from(await res.arrayBuffer()));
    } catch (e) {
      console.error(e.message);
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  const outFile = path.join(__dirname, '../src/utils/phraseMap.js');
  fs.writeFileSync(outFile, `export const phraseMap = ${JSON.stringify(phraseMap, null, 2)};\n`);
  console.log('Phrase bank complete.');
}

generate();
