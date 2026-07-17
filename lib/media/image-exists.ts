import fs from "node:fs";
import path from "node:path";

/**
 * Checks whether a `public/`-relative image path resolves to a real file on
 * disk. Server-only: backs FigureImage's placeholder-vs-real decision so a
 * missing or DB-typo'd path degrades to the on-brand placeholder instead of
 * a broken <img>, with zero client JS.
 */
export function imageExists(publicPath: string | null | undefined): publicPath is string {
  if (!publicPath) return false;
  const relative = publicPath.startsWith("/") ? publicPath.slice(1) : publicPath;
  const resolved = path.join(process.cwd(), "public", relative);
  try {
    return fs.existsSync(resolved) && fs.statSync(resolved).isFile();
  } catch {
    return false;
  }
}
