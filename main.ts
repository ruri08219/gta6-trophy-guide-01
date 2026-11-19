// Entry point: hands this guide in as a make.fun dossier entry.
//
// What it does, in order: copy the guide (app/) and its screenshots into
// the output directory, then ask the kit's dossier library to build
// dossier.json from exactly those copied files. The dossier is built from
// the output copy, never from the repository, so the bytes the judge reads
// are the bytes that were handed in.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.
import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The caps the competition sets for this entry: the text budget for the
// dossier, at most four screenshots of at most 256 KiB each, and the app
// limits from the rules (993 files, 48 MiB, 1,000-byte paths).
const caps = {
  app_max_bytes: 48 * 1024 * 1024,
  app_max_files: 993,
  app_path_max_bytes: 1000,
  screenshots: { max: 4, max_bytes: 256 * 1024 },
  text_max_bytes: 163840,
};

function copyTreeInto(sourceDir: string, targetDir: string): void {
  mkdirSync(targetDir, { recursive: true });
  for (const name of readdirSync(sourceDir)) {
    const from = join(sourceDir, name);
    const to = join(targetDir, name);
    if (statSync(from).isDirectory()) cpSync(from, to, { recursive: true });
    else copyFileSync(from, to);
  }
}

mkdirSync(outDir, { recursive: true });
copyTreeInto(join(repoRoot, "app"), join(outDir, "app"));
if (existsSync(join(repoRoot, "screenshots"))) {
  copyTreeInto(join(repoRoot, "screenshots"), join(outDir, "screenshots"));
}

const dossier = buildDossier(outDir, caps);
writeFileSync(join(outDir, "dossier.json"), dossier);
console.log(`wrote dossier.json (${dossier.length} bytes) to ${outDir}`);
