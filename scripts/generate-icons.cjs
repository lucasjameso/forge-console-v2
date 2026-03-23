const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE = path.join(__dirname, '..', 'public', 'forge-icon.png');
const OUT = path.join(__dirname, '..', 'public');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'forge-icon-192.png', size: 192 },
  { name: 'forge-icon-512.png', size: 512 },
];

async function main() {
  for (const { name, size } of sizes) {
    const outPath = path.join(OUT, name);
    await sharp(SOURCE).resize(size, size).png().toFile(outPath);
    console.log(`Generated: ${name} (${size}x${size})`);
  }

  // Generate favicon.ico as a PNG-in-ICO (browsers accept this)
  const buf32 = await sharp(SOURCE).resize(32, 32).png().toBuffer();
  const icoPath = path.join(OUT, 'favicon.ico');
  fs.writeFileSync(icoPath, buf32);
  console.log('Generated: favicon.ico (32x32 PNG)');

  console.log('All icons generated successfully.');
}

main().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});
