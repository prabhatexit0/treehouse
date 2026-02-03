import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const parsersDir = join(publicDir, 'parsers');

// Ensure parsers directory exists
if (!existsSync(parsersDir)) {
  mkdirSync(parsersDir, { recursive: true });
}

// Copy tree-sitter.wasm from node_modules
const treeSitterWasm = join(__dirname, '..', 'node_modules', 'web-tree-sitter', 'tree-sitter.wasm');
if (existsSync(treeSitterWasm)) {
  copyFileSync(treeSitterWasm, join(publicDir, 'tree-sitter.wasm'));
  console.log('Copied tree-sitter.wasm to public/');
}

console.log('WASM files ready!');
console.log('Note: Language parsers (tree-sitter-json.wasm, tree-sitter-rust.wasm) need to be downloaded separately.');
console.log('Run: npm run download-parsers');
