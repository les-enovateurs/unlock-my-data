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

    if (!content.logo) continue;

    const webpFileName = `${slug}.webp`;
    const webpPath = path.join(LOGOS_DIR, webpFileName);
    const exists = await fs.access(webpPath).then(() => true).catch(() => false);

    // If it's already a local webp and it exists on disk, we skip
    if (exists && content.logo === `/img/logos/${webpFileName}`) {
      continue;
    }

    let localPath;
    if (content.logo.startsWith('http')) {
      // If it's a URL but the webp already exists, we might want to skip 
      // unless the user specifically wants to refresh it by deleting the local file.
      if (exists) {
        console.log(`⏩ Skipping download for ${slug} - local webp already exists`);
        localPath = `/img/logos/${webpFileName}`;
      } else {
        localPath = await downloadLogo(content.logo, slug);
      }
    } else if (content.logo.startsWith('/img/logos/')) {
      // Already local path in JSON
      if (exists && content.logo.endsWith('.webp')) {
        // Already functional webp
        continue;
      }
      
      // Not webp or doesn't exist, try to process existing local file
      const fullPath = path.join(PROJECT_ROOT, 'public', content.logo);
      try {
        const buffer = await fs.readFile(fullPath);
        localPath = await processAndSaveImage(buffer, slug);
      } catch (e) {
        console.error(`❌ Could not read local file ${fullPath} for ${slug}`);
      }
    }

    if (localPath) {
      content.logo = localPath;
      await fs.writeFile(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
    }
  }
}

async function processDeletionFile() {
  if (await fs.access(DELETION_FILE).then(() => true).catch(() => false)) {
    const content = JSON.parse(await fs.readFile(DELETION_FILE, 'utf8'));
    let modified = false;

    if (content.services && Array.isArray(content.services)) {
      for (const service of content.services) {
        if (!service.logo) continue;

        const webpFileName = `${service.id}.webp`;
        const webpPath = path.join(LOGOS_DIR, webpFileName);
        const exists = await fs.access(webpPath).then(() => true).catch(() => false);

        if (exists && service.logo === `/img/logos/${webpFileName}`) {
          continue;
        }

        let localPath;
        if (service.logo.startsWith('http')) {
          if (exists) {
            console.log(`⏩ Skipping download for ${service.id} in deletion-services - local webp already exists`);
            localPath = `/img/logos/${webpFileName}`;
          } else {
            localPath = await downloadLogo(service.logo, service.id);
          }
        } else if (service.logo.startsWith('/img/logos/')) {
          if (exists && service.logo.endsWith('.webp')) {
            continue;
          }
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
