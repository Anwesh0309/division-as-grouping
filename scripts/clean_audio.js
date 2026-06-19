import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { audioMap } from '../src/utils/audioMap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const audioDir = path.join(__dirname, '../public/assets/audio');

const referenced = new Set(Object.values(audioMap));

if (fs.existsSync(audioDir)) {
  const files = fs.readdirSync(audioDir, { recursive: true });
  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('.mp3')) {
      const fullPath = `/assets/audio/${file.replace(/\\/g, '/')}`;
      if (![...referenced].some((r) => r.includes(file.replace(/\\/g, '/')))) {
        fs.unlinkSync(path.join(audioDir, file));
        console.log(`Removed orphan: ${file}`);
      }
    }
  }
}

console.log('Cleanup complete.');
