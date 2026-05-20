import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const jsPath = path.join(repoRoot, 'app/components/Sidebar.js');
const cssPath = path.join(repoRoot, 'app/components/Sidebar.module.css');

const jsSource = fs.readFileSync(jsPath, 'utf8');
const cssSource = fs.readFileSync(cssPath, 'utf8');

const referencedKeys = new Set([
  ...jsSource.matchAll(/\bstyles\.([A-Za-z0-9_]+)/g),
].map((match) => match[1]));

const definedKeys = new Set([
  ...cssSource.matchAll(/\.([A-Za-z0-9_-]+)\b/g),
].map((match) => match[1]));

const missingKeys = [...referencedKeys].filter((key) => !definedKeys.has(key));

if (missingKeys.length > 0) {
  console.error(`Sidebar CSS module mismatch: ${missingKeys.join(', ')}`);
  process.exit(1);
}

console.log('Sidebar CSS module keys match.');
