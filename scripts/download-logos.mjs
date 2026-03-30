import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const MANUAL_DIR = path.join(PROJECT_ROOT, 'public', 'data', 'manual');
const LOGOS_DIR = path.join(PROJECT_ROOT, 'public', 'img', 'logos');
const DELETION_FILE = path.join(PROJECT_ROOT, 'public', 'data', 'deletion-services.json');

const MAX_WIDTH = 400;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processAndSaveImage(buffer, slug) {
  try {
    const fileName = `${slug}.webp`;
    const filePath = path.join(LOGOS_DIR, fileName);
    
    await sharp(buffer)
      .resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 80 })
      .toFile(filePath);
      
    console.log(`✅ Processed and saved ${fileName} for ${slug}`);
    return `/img/logos/${fileName}`;
  } catch (error) {
    console.error(`❌ Error processing image for ${slug}:`, error.message);
    return null;
  }
}

async function downloadLogo(url, slug, retries = 3) {
  try {
    await delay(200); // Small delay to avoid rate limiting
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'UnlockMyDataBot/1.0 (https://unlock-my-data.fr; contact@unlock-my-data.fr)'
      }
    });
    
    if (response.status === 429 && retries > 0) {
      console.log(`⚠️ Rate limited for ${slug}, retrying in 2 seconds...`);
      await delay(2000);
      return downloadLogo(url, slug, retries - 1);
    }
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const buffer = await response.arrayBuffer();
    return await processAndSaveImage(Buffer.from(buffer), slug);
  } catch (error) {
    console.error(`❌ Error downloading logo for ${slug} (${url}):`, error.message);
    return null;
  }
}

async function processManualFiles() {
  const files = await fs.readdir(MANUAL_DIR);
  const jsonFiles = files.filter(file => file.endsWith('.json') && file !== 'slugs.json');

  for (const file of jsonFiles) {
    const filePath = path.join(MANUAL_DIR, file);
    const slug = path.basename(file, '.json');
    const content = JSON.parse(await fs.readFile(filePath, 'utf8'));

    // Re-process even if local if not webp? 
    // The user said "avoir au format webp", so maybe we should convert existing ones too.
    if (content.logo && (content.logo.startsWith('http') || !content.logo.endsWith('.webp'))) {
      let localPath;
      if (content.logo.startsWith('http')) {
        localPath = await downloadLogo(content.logo, slug);
      } else if (content.logo.startsWith('/img/logos/')) {
        // Already local but maybe not webp
        const fullPath = path.join(PROJECT_ROOT, 'public', content.logo);
        try {
          const buffer = await fs.readFile(fullPath);
          localPath = await processAndSaveImage(buffer, slug);
        } catch (e) {
          console.error(`❌ Could not read local file ${fullPath}`);
        }
      }

      if (localPath) {
        content.logo = localPath;
        await fs.writeFile(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
      }
    }
  }
}

async function processDeletionFile() {
  if (await fs.access(DELETION_FILE).then(() => true).catch(() => false)) {
    const content = JSON.parse(await fs.readFile(DELETION_FILE, 'utf8'));
    let modified = false;

    if (content.services && Array.isArray(content.services)) {
      for (const service of content.services) {
        if (service.logo && (service.logo.startsWith('http') || !service.logo.endsWith('.webp'))) {
          let localPath;
          if (service.logo.startsWith('http')) {
            localPath = await downloadLogo(service.logo, service.id);
          } else if (service.logo.startsWith('/img/logos/')) {
            const fullPath = path.join(PROJECT_ROOT, 'public', service.logo);
            try {
              const buffer = await fs.readFile(fullPath);
              localPath = await processAndSaveImage(buffer, service.id);
            } catch (e) {}
          }

          if (localPath) {
            service.logo = localPath;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      await fs.writeFile(DELETION_FILE, JSON.stringify(content, null, 2) + '\n', 'utf8');
      console.log('✅ Updated deletion-services.json with local webp logos');
    }
  }
}

async function main() {
  await fs.mkdir(LOGOS_DIR, { recursive: true });
  console.log('🚀 Starting logo download and conversion to webp...');
  await processManualFiles();
  await processDeletionFile();
  console.log('✨ Finished!');
}

main().catch(console.error);
