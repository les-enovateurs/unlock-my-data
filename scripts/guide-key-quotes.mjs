// Annotated screenshots of the key-quote review for the contributor guide
// (section VII), then a 2-page volunteer PDF printed from that section.
//
//   npm run dev                      # in another terminal
//   npm run guide-key-quotes         # BASE_URL=http://localhost:3005 if not :3000
//
// Writes public/img/guide/citations-{fr,en}-*.webp (committed) and
// tmp/guide-citations-cles/citations-cles-{fr,en}.pdf (shared by hand).
// Uses the Chromium already in the Playwright cache: never `playwright install`.
// Verdicts clicked for the screenshots stay in a throwaway browser profile.
import { mkdirSync } from "node:fs";
import sharp from "sharp";
import { chromium } from "playwright-core";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const SLUG = process.env.SLUG || "app-elles";
const IMG_DIR = "public/img/guide";
const PDF_DIR = "tmp/guide-citations-cles";
const REVIEW_PATH = { fr: "/contribuer/revue-confidentialite/", en: "/contribute/privacy-review/" };
const GUIDE_PATH = { fr: "/contribuer/guide/", en: "/contribute/guide/" };
const HIDE_DEV_OVERLAY = "nextjs-portal{display:none!important}";

const LABELS = {
  fr: { pseudo: "1. Votre pseudo (il crédite votre relecture)", row: "2. Choisissez un service à relire",
        deadline: "Sans réponse, publication automatique des 3 premières",
        quote: "1. Cliquez la citation…", mark: "…elle s'éclaire dans la politique",
        keep: "2. Garder ou Écarter", rank: "3. Ordre sur la fiche (★ = à la une)", plain: "4. Corriger la phrase « En clair »",
        publish: "5. Publier : une seule fois, à la fin", deadlineText: /Sans réponse/ },
  en: { pseudo: "1. Your nickname (credits your review)", row: "2. Pick a service to review",
        deadline: "With no answer, the first 3 are published automatically",
        quote: "1. Click the quote…", mark: "…it lights up in the policy",
        keep: "2. Keep or Set aside", rank: "3. Order on the entry (★ = featured)", plain: "4. Fix the “Plain words” line",
        publish: "5. Publish: once, at the end", deadlineText: /Without an answer/ },
};

/** Boxes each `[data-ann=id]` element and points a label bubble at it.
 *  `at` = [dx, dy] offset of the bubble from the box; `alignTo` pins the
 *  bubble to the right of another element (keeps it in the page margin). */
async function annotate(page, notes) {
  await page.evaluate((notes) => {
    document.querySelectorAll(".ann").forEach((e) => e.remove());
    const C = "#e11d48", sx = scrollX, sy = scrollY;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("ann");
    Object.assign(svg.style, { position: "absolute", left: 0, top: 0, width: document.documentElement.scrollWidth + "px",
      height: document.documentElement.scrollHeight + "px", pointerEvents: "none", zIndex: 99999, overflow: "visible" });
    svg.innerHTML = `<defs><marker id="ah" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${C}"/></marker></defs>`;
    document.body.appendChild(svg);
    for (const n of notes) {
      const el = document.querySelector(`[data-ann="${n.id}"]`);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      const box = { x: r.left + sx - 5, y: r.top + sy - 5, w: r.width + 10, h: r.height + 10 };
      svg.insertAdjacentHTML("beforeend",
        `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="8" fill="none" stroke="${C}" stroke-width="3"/>`);
      const lab = document.createElement("div");
      lab.className = "ann"; lab.textContent = n.text;
      Object.assign(lab.style, { position: "absolute", zIndex: 100000, background: C, color: "#fff", font: "700 15px/1.3 system-ui, sans-serif",
        padding: "7px 12px", borderRadius: "9px", boxShadow: "0 4px 14px rgba(0,0,0,.25)", maxWidth: "230px" });
      document.body.appendChild(lab);
      const lw = lab.offsetWidth, lh = lab.offsetHeight;
      const [dx, dy] = n.at;
      const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
      const lx = n.alignTo ? document.querySelector(n.alignTo).getBoundingClientRect().right + sx + 40
        : dx < 0 ? box.x + dx - lw : dx > 0 ? box.x + box.w + dx : cx - lw / 2;
      const ly = dy < 0 ? box.y + dy - lh : dy > 0 ? box.y + box.h + dy : cy - lh / 2;
      Object.assign(lab.style, { left: lx + "px", top: ly + "px" });
      const from = [dx < 0 ? lx + lw : dx > 0 ? lx : lx + lw / 2, dy < 0 ? ly + lh : dy > 0 ? ly : ly + lh / 2];
      const to = [dx < 0 ? box.x : dx > 0 ? box.x + box.w : cx, dy < 0 ? box.y : dy > 0 ? box.y + box.h : cy];
      if (dx && dy) to[0] = cx;
      svg.insertAdjacentHTML("beforeend",
        `<line x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}" stroke="${C}" stroke-width="3.5" marker-end="url(#ah)"/>`);
    }
  }, notes);
}

const tag = (loc, id) => loc.first().evaluate((e, id) => e.setAttribute("data-ann", id), id);

/** Viewport screenshot of a box (+ padding), saved as a 60%-width webp. */
async function shot(page, name, b, pad = { t: 20, r: 20, b: 20, l: 20 }) {
  const png = await page.screenshot({
    clip: { x: Math.max(0, b.x - pad.l), y: Math.max(0, b.y - pad.t), width: b.width + pad.l + pad.r, height: b.height + pad.t + pad.b } });
  const { width } = await sharp(png).metadata();
  await sharp(png).resize(Math.round(width * 0.6)).webp({ quality: 82 }).toFile(`${IMG_DIR}/citations-${name}.webp`);
}

async function captureReview(browser, lang) {
  const t = LABELS[lang];
  const page = await browser.newPage({ viewport: { width: 1640, height: 1000 }, deviceScaleFactor: 2 });
  const open = async (url) => {
    await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 180000 });
    await page.addStyleTag({ content: HIDE_DEV_OVERLAY });
  };

  // 1. Queue: nickname + first service
  await open(REVIEW_PATH[lang]);
  const rows = page.locator(".umd-card-hover");
  await rows.first().waitFor({ timeout: 180000 });
  await page.locator("input.umd-input").first().fill("Camille");
  await tag(page.locator("input.umd-input"), "pseudo");
  await tag(rows.first().locator("b"), "row");
  await annotate(page, [{ id: "pseudo", text: t.pseudo, at: [40, 0] }, { id: "row", text: t.row, at: [60, 0] }]);
  const wrap = await page.locator(".umd-wrap").filter({ has: page.locator("h1") }).first().boundingBox();
  await shot(page, `${lang}-1-queue`, { x: wrap.x, y: wrap.y, width: wrap.width, height: 430 }, { t: -10, r: 290, b: 0, l: 0 });

  // 2. Service header: automatic publication date
  await open(`${REVIEW_PATH[lang]}?service=${SLUG}`);
  await page.locator("[id^='prv-card-keyquote']").first().waitFor({ timeout: 60000 });
  const nameInput = page.locator("input.umd-input").first();
  if (!(await nameInput.inputValue())) await nameInput.fill("Camille");
  await page.waitForTimeout(800);
  const head = page.locator(".umd-card").filter({ has: page.locator("h2 a") }).first();
  await tag(head.locator("span").filter({ hasText: t.deadlineText }).last(), "deadline");
  await annotate(page, [{ id: "deadline", text: t.deadline, at: [0, 30] }]);
  await shot(page, `${lang}-2-header`, await head.boundingBox(), { t: 12, r: 12, b: 110, l: 12 });

  // 3. A quote card next to the highlighted policy text (sticky bar hidden)
  const card = page.locator("[id='prv-card-keyquote/0']");
  const bar = page.locator(".umd-card").filter({ has: page.locator("button.umd-btn-primary") }).last();
  const split = page.locator(".prv-split");
  await bar.evaluate((e) => (e.style.visibility = "hidden"));
  await split.evaluate((e) => window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 20));
  await card.locator("blockquote").click();
  await page.waitForTimeout(1200);
  await tag(card.locator("blockquote"), "quote");
  await tag(page.locator("mark"), "mark");
  await tag(card.locator(".prv-chip").first().locator(".."), "keep");
  await tag(card.locator(".prv-rank"), "rank");
  await tag(card.locator(".prv-linkbtn"), "plain");
  await annotate(page, [
    { id: "quote", text: t.quote, at: [40, -20], alignTo: ".prv-split" },
    { id: "mark", text: t.mark, at: [-60, 0] },
    { id: "keep", text: t.keep, at: [40, 30], alignTo: ".prv-split" },
    { id: "rank", text: t.rank, at: [-60, 0] },
    { id: "plain", text: t.plain, at: [40, 0], alignTo: ".prv-split" },
  ]);
  const sb = await split.boundingBox();
  await shot(page, `${lang}-3-card`, { x: 0, y: sb.y, width: 1640, height: 640 }, { t: 10, r: 0, b: 0, l: 0 });

  // 4. Two verdicts, then the sticky publish bar
  await page.evaluate(() => document.querySelectorAll(".ann").forEach((e) => e.remove()));
  await bar.evaluate((e) => (e.style.visibility = ""));
  await card.locator(".prv-chip").first().click();
  await page.locator("[id='prv-card-keyquote/1'] .prv-chip").nth(1).click();
  await page.waitForTimeout(600);
  await tag(bar.locator("button.umd-btn-primary"), "publish");
  await annotate(page, [{ id: "publish", text: t.publish, at: [0, -70] }]);
  const bb = await bar.boundingBox();
  await shot(page, `${lang}-4-publish`, { x: bb.x, y: bb.y - 260, width: bb.width, height: bb.height + 260 }, { t: 0, r: 230, b: 14, l: 10 });

  await page.close();
}

// The site's styles rely on next/font and screen layout; print gets its own.
const PRINT_CSS = `
@page{size:A4;margin:13mm 14mm}
*{box-sizing:border-box}
body{margin:0;font:400 13.5px/1.6 Helvetica,Arial,sans-serif;color:#334155;background:#fff}
.top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:3px solid #4338ca;padding-bottom:8px;margin-bottom:18px}
.brand{font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4338ca;font-size:12px}
.url{font-size:11px;color:#475569}
h2{display:flex;align-items:center;gap:10px;font-size:24px;font-weight:700;color:#0f172a;margin:0 0 10px}
.guide-h2-ic{display:inline-flex;width:34px;height:34px;border-radius:9px;background:#eef2ff;color:#4338ca;align-items:center;justify-content:center}
h3{font-size:15.5px;font-weight:700;color:#0f172a;margin:20px 0 6px;break-after:avoid}
p{margin:0 0 9px} ul{margin:0 0 9px;padding-left:20px} strong{color:#0f172a;font-weight:700}
a{color:#4338ca}
figure{margin:10px 0 14px;break-inside:avoid;text-align:center}
figure img{max-width:100%;height:auto!important;border:1px solid #e2e8f0;border-radius:8px}
figcaption{font-size:11.5px;color:#475569;font-style:italic;margin-top:4px}
.guide-tip{display:flex;gap:10px;background:#fffbeb;border:1px solid #fcd34d;border-radius:10px;padding:10px 14px;margin:12px 0;break-inside:avoid}
.guide-tip svg{color:#b45309;flex-shrink:0;margin-top:3px}
.guide-noprint-ic{display:none}`;

/** Prints the guide's section VII into a standalone page: printing the guide
 *  itself fails, React re-hydrates the whole guide over any DOM surgery. */
async function printPdf(browser, lang) {
  const page = await browser.newPage();
  await page.goto(BASE + GUIDE_PATH[lang], { waitUntil: "networkidle", timeout: 180000 });
  const section = await page.evaluate(() => {
    const s = document.querySelector("#citations-cles").cloneNode(true);
    s.querySelector(".guide-h2-num")?.remove();
    s.querySelectorAll("img").forEach((i) => { i.src = i.currentSrc || i.src; i.removeAttribute("srcset"); i.removeAttribute("style"); });
    s.querySelectorAll("a[href^='/']").forEach((a) => (a.href = "https://unlock-my-data.com" + a.getAttribute("href")));
    return s.innerHTML;
  });
  const url = `unlock-my-data.com${REVIEW_PATH[lang].replace(/\/$/, "")}`;
  const print = await browser.newPage();
  await print.setContent(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>${PRINT_CSS}</style></head>
    <body><div class="top"><span class="brand">Unlock My Data</span><span class="url">${url}</span></div>${section}</body></html>`,
    { waitUntil: "networkidle" });
  await print.pdf({ path: `${PDF_DIR}/citations-cles-${lang}.pdf`, preferCSSPageSize: true, printBackground: true });
  await page.close(); await print.close();
}

mkdirSync(PDF_DIR, { recursive: true });
const browser = await chromium.launch();
try {
  for (const lang of ["fr", "en"]) await captureReview(browser, lang);
  // Second pass: the guide must serve the webp files just written.
  for (const lang of ["fr", "en"]) await printPdf(browser, lang);
} finally {
  await browser.close();
}
console.log(`webp → ${IMG_DIR}/citations-*.webp\npdf  → ${PDF_DIR}/citations-cles-{fr,en}.pdf`);
