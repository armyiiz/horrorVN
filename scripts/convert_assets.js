import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.resolve('public/assets');

async function convertImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    const webpPath = filePath.replace(new RegExp(`${ext}$`), '.webp');
    console.log(`Converting: ${filePath} -> ${webpPath}`);

    try {
      await sharp(filePath)
        .webp({ quality: 80 })
        .toFile(webpPath);

      fs.unlinkSync(filePath); // Delete original
      console.log(`Converted and deleted original: ${filePath}`);
    } catch (err) {
      console.error(`Error converting ${filePath}:`, err);
    }
  }
}

async function scanDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await scanDirectory(filePath);
    } else {
      await convertImage(filePath);
    }
  }
}

console.log(`Scanning assets directory: ${assetsDir}`);
scanDirectory(assetsDir);
