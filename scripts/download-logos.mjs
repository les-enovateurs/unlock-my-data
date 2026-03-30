import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '..');
const MANUAL_DIR = path.join(PROJECT_ROOT, 'public', 'data', 'manual');
const LOGOS_DIR = path.join(PROJECT_ROOT, 'public', 'img', 'logos');
const DELETION_FILE = path.join(PROJECT_ROOT, 'public', 'data', 'deletion-services.json');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    
    const contentType = response.headers.get('content-type');
    let ext = 'png'; // default
    if (contentType) {
      if (contentType.includes('svg')) ext = 'svg';
      else if (contentType.includes('png')) ext = 'png';
      else if (contentType.includes('jpeg') || contentType.includes('jpg')) ext = 'jpg';
      else if (contentType.includes('webp')) ext = 'webp';
    } else {
      // Try to get ext from URL
      const urlExt = url.split('.').pop().split(/[#?]/)[0];
      if (['svg', 'png', 'jpg', 'jpeg', 'webp'].includes(urlExt.toLowerCase())) {
        ext = urlExt.toLowerCase();
      }
    }

    const fileName = `${slug}.${ext}`;
    const filePath = path.join(LOGOS_DIR, fileName);
    
    const buffer = await response.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));
    
    console.log(`✅ Downloaded ${fileName} for ${slug}`);
    return `/img/logos/${fileName}`;
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

    if (content.logo && content.logo.startsWith('http')) {
      const localPath = await downloadLogo(content.logo, slug);
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
        if (service.logo && service.logo.startsWith('http')) {
          const localPath = await downloadLogo(service.logo, service.id);
          if (localPath) {
            service.logo = localPath;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      await fs.writeFile(DELETION_FILE, JSON.stringify(content, null, 2) + '\n', 'utf8');
      console.log('✅ Updated deletion-services.json with local logos');
    }
  }
}

async function main() {
  await fs.mkdir(LOGOS_DIR, { recursive: true });
  console.log('🚀 Starting logo download...');
  await processManualFiles();
  await processDeletionFile();
  console.log('✨ Finished!');
}

main().catch(console.error);
