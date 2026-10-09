#!/usr/bin/env node
/**
 * Strict data check: every JSON parses, every fiche matches
 * schemas/service.schema.json, cross-references resolve, and FR/EN pairs
 * have the same keys and are written in the right language.
 *
 * Exits 1 on any finding. CI blocks on `--schema-only` (parsing, schema,
 * slug index); the FR/EN language checks are still report-only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Function words only: content words like "data" or "service" are shared.
const FR_WORDS = new Set(
  'le la les des du de un une et est sont pour avec dans sur par pas que qui vos votre nous vous ce cette ces au aux ne ou où être leur leurs ont il elle sa son ses peut sans été'.split(' ')
);
const EN_WORDS = new Set(
  'the and is are for with in on by not that which your you we this these to of be have has from their its can without or been was were'.split(' ')
);

export function detectLanguage(text) {
  const words = text.toLowerCase().match(/[a-zàâçéèêëîïôûùüÿœ']+/g) ?? [];
  let fr = 0;
  let en = 0;
  for (const word of words) {
    if (FR_WORDS.has(word)) fr++;
    if (EN_WORDS.has(word)) en++;
  }
  // ponytail: stopword ratio, misses short labels; a dictionary lookup would catch those
  if (fr + en < 3) return null;
  if (fr > en * 2) return 'fr';
  if (en > fr * 2) return 'en';
  return null;
}

export function checkPair(fr, en, at, report) {
  if (typeof fr === 'string' && typeof en === 'string') {
    const frLang = detectLanguage(fr);
    const enLang = detectLanguage(en);
    if (fr.trim() === en.trim() && frLang) report('FR and EN text identical (untranslated)', at);
    else if (enLang === 'fr') report('EN text looks French', at);
    else if (frLang === 'en') report('FR text looks English', at);
    return;
  }
  if (Array.isArray(fr) && Array.isArray(en)) {
    if (fr.length !== en.length) report(`FR has ${fr.length} items, EN has ${en.length}`, at);
    fr.forEach((item, i) => i < en.length && checkPair(item, en[i], `${at}[${i}]`, report));
    return;
  }
  if (isObject(fr) && isObject(en)) {
    for (const key of Object.keys(fr)) {
      if (!(key in en)) report('key missing in EN', `${at}.${key}`);
      else checkPair(fr[key], en[key], `${at}.${key}`, report);
    }
    for (const key of Object.keys(en)) {
      if (!(key in fr)) report('key missing in FR', `${at}.${key}`);
    }
  }
}

export function findPairs(node, at, report) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => findPairs(item, `${at}[${i}]`, report));
    return;
  }
  if (!isObject(node)) return;
  const paired = new Set();
  if ('fr' in node && 'en' in node) {
    checkPair(node.fr, node.en, at, report);
    paired.add('fr').add('en');
  }
  for (const key of Object.keys(node)) {
    const frKey = key.endsWith('_fr') ? key : key.endsWith('_en') ? null : key;
    if (!frKey) continue;
    const enKey = frKey.replace(/_fr$/, '') + '_en';
    if (enKey in node) {
      checkPair(node[frKey], node[enKey], `${at}.${frKey}`, report);
      paired.add(frKey).add(enKey);
    }
  }
  for (const [key, value] of Object.entries(node)) {
    if (!paired.has(key)) findPairs(value, `${at}.${key}`, report);
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function listJson(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listJson(full);
    return entry.name.endsWith('.json') ? [full] : [];
  });
}

// To cover another JSON, add a schema in schemas/ and a line here.
const SCHEMAS = [
  {
    schema: 'schemas/service.schema.json',
    files: (rel) => path.dirname(rel) === 'public/data/manual' && path.basename(rel) !== 'slugs.json',
  },
];

function displayName(rel) {
  return rel.startsWith('public/data/manual/') ? path.basename(rel, '.json') : rel;
}

function checkSchemas(parsed, report) {
  const ajv = new Ajv({ allErrors: true });
  for (const { schema, files } of SCHEMAS) {
    const validate = ajv.compile(JSON.parse(fs.readFileSync(path.join(root, schema), 'utf8')));
    for (const [rel, data] of Object.entries(parsed)) {
      if (!files(rel) || validate(data)) continue;
      for (const error of validate.errors) {
        const field = error.dataPath.replace(/\[\d+\]/g, '[]') || '(root)';
        const extra = error.params.additionalProperty ? ` "${error.params.additionalProperty}"` : '';
        report(`${field} ${error.message}${extra}`, displayName(rel));
      }
    }
  }
}

function checkSlugIndex(parsed, report) {
  const known = new Set(
    Object.keys(parsed).filter(SCHEMAS[0].files).map((rel) => path.basename(rel, '.json'))
  );
  const listed = new Set(parsed['public/data/manual/slugs.json'].map((s) => s.slug));
  for (const slug of known) if (!listed.has(slug)) report('fiche missing from manual/slugs.json', slug);
  for (const slug of listed) if (!known.has(slug)) report('manual/slugs.json lists a missing fiche', slug);
}

function main() {
  const findings = new Map();
  const report = (rule, where) => {
    if (!findings.has(rule)) findings.set(rule, []);
    findings.get(rule).push(where);
  };

  const files = [...listJson(path.join(root, 'public/data')), ...listJson(path.join(root, 'i18n'))];
  const parsed = {};
  for (const file of files) {
    const rel = path.relative(root, file);
    try {
      parsed[rel] = JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
      report(`invalid JSON: ${error.message}`, rel);
    }
  }

  if (!process.argv.includes('--schema-only')) {
    for (const [rel, data] of Object.entries(parsed)) findPairs(data, displayName(rel), report);
  }
  checkSchemas(parsed, report);
  checkSlugIndex(parsed, report);

  const red = (s) => `\x1b[31m${s}\x1b[0m`;
  const green = (s) => `\x1b[32m${s}\x1b[0m`;
  const sorted = [...findings].sort((a, b) => b[1].length - a[1].length);
  for (const [rule, where] of sorted) {
    console.log(red(`✗ ${rule}`) + ` (${where.length})`);
    for (const w of where) console.log(`    ${w}`);
  }
  const total = sorted.reduce((n, [, where]) => n + where.length, 0);
  console.log(total ? red(`\n${total} findings in ${sorted.length} rules`) : green(`✓ ${files.length} JSON files clean`));
  process.exit(total ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
