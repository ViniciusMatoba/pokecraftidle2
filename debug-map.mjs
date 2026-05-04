import fs from 'fs';
import { SourceMapConsumer } from 'source-map';

async function run() {
  // Try to find the exact map file
  const files = fs.readdirSync('./dist/assets');
  const jsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
  const mapFile = files.find(f => f.startsWith('index-') && f.endsWith('.js.map'));
  
  if (!mapFile) {
    console.error("Map file not found! Did you build with sourcemaps?");
    return;
  }

  console.log('Using map file:', mapFile);
  const rawSourceMap = JSON.parse(fs.readFileSync('./dist/assets/' + mapFile, 'utf8'));

  await SourceMapConsumer.with(rawSourceMap, null, consumer => {
    // The error from the screenshot was line 25, col 327689
    // But since the minified file could be slightly different locally vs GitHub actions (wait, it's built locally)
    // I'll check line 25, col 327689
    const pos = consumer.originalPositionFor({
      line: 25,
      column: 327689
    });
    console.log("Original position:", pos);
  });
}

run().catch(console.error);
