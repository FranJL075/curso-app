import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootDir = path.resolve(fileURLToPath(new URL(".", import.meta.url)));

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) {
    return nextResolve(specifier, context, nextResolve);
  }

  const relativePath = specifier.slice(2);
  const basePath = path.resolve(rootDir, relativePath);
  const candidates = [
    basePath,
    `${basePath}.js`,
    `${basePath}.mjs`,
    `${basePath}.json`,
    path.join(basePath, "index.js"),
    path.join(basePath, "index.mjs"),
  ];

  const finalPath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!finalPath) {
    return nextResolve(specifier, context, nextResolve);
  }

  return nextResolve(pathToFileURL(finalPath).href, context, nextResolve);
}
