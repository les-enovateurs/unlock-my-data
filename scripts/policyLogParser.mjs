export function parseProblemLine(line) {
  if (!line || !line.trim()) return null;
  if (line.startsWith("done marker")) return null;
  const m = line.match(/^(\S+)\s+(.*)$/);
  if (!m) return null;
  const slug = m[1];
  const rest = m[2].trim();
  if (slug === "slugs") return null;
  if (rest.startsWith("ok ")) return null;
  if (rest.startsWith("skip")) return null;
  if (rest === "no-url") return { slug, status: "no-url", detail: "" };
  if (rest.startsWith("ERROR:")) return { slug, status: "error", detail: rest.slice(6).trim() };
  const low = rest.match(/^low-content \(([^)]*)\)/);
  if (low) return { slug, status: "low-content", detail: low[1].trim() };
  return null;
}

export function suggestedAction(status, detail) {
  if (status === "no-url" || status === "error") return "fix_url";
  if (status === "low-content") {
    const n = parseInt(detail, 10);
    return n > 0 ? "re_extract" : "fix_url";
  }
  return "fix_url";
}
