import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Not `__dirname`: jest transforms .mjs to CJS, where that name already exists.
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

// The APK dataset is produced by a private repository and dropped on the deploy
// server, outside this checkout. It is never committed here, so most build paths
// -- CI, pull requests, a fresh clone, a local `npm run build` -- run without it.
// Those builds must stay green: this script always leaves a valid manifest
// behind, and the reading surfaces render nothing when `app_count` is 0.
export const DEFAULT_SOURCE_DIR = "/srv/umd-private/apk-lab";

export const EMPTY_MANIFEST = { dataset_version: 1, app_count: 0, apps: [], hydrated: false };

function sha256(file) {
  // Bytes, not text. The study CSVs are CRLF and hashing decoded strings made
  // every checksum fail there; the same trap applies to any JSON re-encoded on
  // the way in.
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

export default function loadApkLab({
  root = path.join(SCRIPT_DIR, ".."),
  sourceDir = process.env.APK_LAB_DIR || DEFAULT_SOURCE_DIR,
  log = console,
} = {}) {
  const destDir = path.join(root, "public", "data", "apk-lab");
  const destManifest = path.join(destDir, "manifest.json");

  const degrade = (reason) => {
    // Wipe first: a previous build may have hydrated this directory, and serving
    // a stale dataset next to a source that vanished is worse than serving none.
    fs.rmSync(destDir, { recursive: true, force: true });
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(destManifest, JSON.stringify({ ...EMPTY_MANIFEST, reason }, null, 1));
    log.log(`apk-lab: aucune donnée (${reason}) — surfaces désactivées`);
    return { hydrated: false, app_count: 0, reason };
  };

  // Trois situations à ne pas confondre, parce qu'elles appellent trois gestes
  // différents : le dépôt n'existe pas (rien n'a jamais été déposé), il existe mais le
  // compte qui construit ne peut pas le lire (droits), ou son contenu est cassé. Les
  // avoir toutes les trois sous « pas de manifeste » a déjà coûté une mise en ligne
  // silencieuse : le site s'était déployé vert, sans l'analyse, et le motif ne disait
  // pas si le dépôt manquait ou si le build n'avait pas le droit d'y entrer.
  const srcManifest = path.join(sourceDir, "manifest.json");
  if (!fs.existsSync(sourceDir)) return degrade(`dépôt absent : ${sourceDir}`);
  try {
    fs.accessSync(sourceDir, fs.constants.R_OK | fs.constants.X_OK);
  } catch {
    return degrade(`dépôt illisible par ${process.getuid?.() ?? "ce compte"} : ${sourceDir}`
      + " — vérifier les droits (chmod 755)");
  }
  if (!fs.existsSync(srcManifest)) return degrade(`pas de manifeste dans ${sourceDir}`);

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(srcManifest, "utf8"));
  } catch (err) {
    return degrade(`manifeste illisible : ${err.message}`);
  }
  if (!Array.isArray(manifest.apps)) return degrade("manifeste sans tableau `apps`");

  // The manifest is authoritative over the dataset's contents: the private repo
  // never deletes a stale export, so a file present in the drop but absent from
  // the manifest is a leftover and must not be served. Hence copying the list,
  // never a readdir of the source.
  const copied = [];
  for (const app of manifest.apps) {
    if (!app.file || !app.slug) return degrade("entrée de manifeste sans `file` ou `slug`");
    // Refuse anything that could climb out of the drop directory: the manifest
    // arrives over the network and is not a trusted input.
    const rel = path.normalize(app.file);
    if (path.isAbsolute(rel) || rel.startsWith("..")) return degrade(`chemin hors dépôt : ${app.file}`);
    const src = path.join(sourceDir, rel);
    if (!fs.existsSync(src)) return degrade(`fichier annoncé mais absent : ${app.file}`);
    if (app.sha256 && sha256(src) !== app.sha256) return degrade(`sha256 divergent : ${app.file}`);
    copied.push({ rel, src });
  }

  // Refusing to hydrate rather than throwing: a corrupt drop must not block the
  // deploy of everything else on the site. The server-side accept script
  // validates the manifest before swapping it in, so reaching this point at all
  // already means two checks disagreed.
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });
  for (const { rel, src } of copied) {
    const dest = path.join(destDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
  // `app_count` is rewritten from what was actually copied, so the served
  // manifest can never announce more applications than the directory holds.
  fs.writeFileSync(
    destManifest,
    JSON.stringify({ ...manifest, app_count: copied.length, hydrated: true }, null, 1),
  );

  log.log(`apk-lab: ${copied.length} application(s) hydratée(s) depuis ${sourceDir}`);
  return { hydrated: true, app_count: copied.length, reason: null };
}

// Direct invocation from `prebuild`.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  loadApkLab();
}
