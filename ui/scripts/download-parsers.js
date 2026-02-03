import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const parsersDir = join(__dirname, '..', 'public', 'parsers');

// Ensure parsers directory exists
if (!existsSync(parsersDir)) {
  mkdirSync(parsersDir, { recursive: true });
}

// Tree-sitter language WASM files from sourcegraph's pre-built packages on unpkg
const PARSERS = {
  json: 'https://unpkg.com/tree-sitter-wasms@latest/out/tree-sitter-json.wasm',
  rust: 'https://unpkg.com/tree-sitter-wasms@latest/out/tree-sitter-rust.wasm',
  javascript: 'https://unpkg.com/tree-sitter-wasms@latest/out/tree-sitter-javascript.wasm',
  typescript: 'https://unpkg.com/tree-sitter-wasms@latest/out/tree-sitter-typescript.wasm',
  tsx: 'https://unpkg.com/tree-sitter-wasms@latest/out/tree-sitter-tsx.wasm',
  python: 'https://unpkg.com/tree-sitter-wasms@latest/out/tree-sitter-python.wasm',
  go: 'https://unpkg.com/tree-sitter-wasms@latest/out/tree-sitter-go.wasm',
  ocaml: 'https://unpkg.com/tree-sitter-wasms@latest/out/tree-sitter-ocaml.wasm',
};

async function downloadFile(url, dest) {
  console.log(`Downloading ${url}...`);
  const response = await fetch(url, {
    redirect: 'follow',
  });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  writeFileSync(dest, Buffer.from(buffer));
  console.log(`Saved to ${dest} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('Downloading Tree-sitter language parsers from unpkg...\n');

  for (const [lang, url] of Object.entries(PARSERS)) {
    const dest = join(parsersDir, `tree-sitter-${lang}.wasm`);
    try {
      await downloadFile(url, dest);
    } catch (err) {
      console.error(`Failed to download ${lang} parser:`, err.message);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
