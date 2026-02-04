import { useState, useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { json } from '@codemirror/lang-json';
import { rust } from '@codemirror/lang-rust';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { go } from '@codemirror/lang-go';
import { StreamLanguage } from '@codemirror/language';
import { LanguageSelector } from './components/LanguageSelector';

// Sample code for each language
const SAMPLE_CODE: Record<string, string> = {
  json: `{
  "name": "TreeHouse",
  "version": "1.0.0",
  "features": ["parsing", "visualization"],
  "config": {
    "theme": "dark",
    "fontSize": 14
  }
}`,
  rust: `fn main() {
    let message = "Hello, AST!";
    println!("{}", message);

    for i in 0..5 {
        println!("Count: {}", i);
    }
}`,
  javascript: `function greet(name) {
  const message = \`Hello, \${name}!\`;
  console.log(message);
  return message;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);`,
  typescript: `interface User {
  name: string;
  age: number;
}

function greet(user: User): string {
  const message = \`Hello, \${user.name}!\`;
  console.log(message);
  return message;
}

const user: User = { name: "Alice", age: 30 };`,
  python: `def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(f"fib({i}) = {fibonacci(i)}")`,
  go: `package main

import "fmt"

func main() {
    message := "Hello, AST!"
    fmt.Println(message)

    for i := 0; i < 5; i++ {
        fmt.Printf("Count: %d\\n", i)
    }
}`,
  ocaml: `let rec factorial n =
  if n <= 1 then 1
  else n * factorial (n - 1)

let () =
  let result = factorial 5 in
  Printf.printf "5! = %d\\n" result`,
  tsx: `function Welcome({ name }: { name: string }) {
  return (
    <div className="container">
      <h1>Hello, {name}!</h1>
      <p>This is a React component</p>
    </div>
  );
}

export default Welcome;`,
};

// Simple OCaml mode for basic syntax highlighting
const ocamlLanguage = StreamLanguage.define({
  token(stream) {
    if (stream.match(/\(\*/)) {
      while (!stream.match(/\*\)/) && !stream.eol()) {
        stream.next();
      }
      return 'comment';
    }
    if (stream.match(/"(?:[^"\\]|\\.)*"/)) {
      return 'string';
    }
    if (stream.match(/\b(let|rec|in|if|then|else|match|with|fun|function|type|module|struct|sig|end|open|include|val|and|or|not|true|false|begin|end|for|to|do|done|while|try|exception|raise|ref)\b/)) {
      return 'keyword';
    }
    if (stream.match(/\b\d+(\.\d+)?\b/)) {
      return 'number';
    }
    if (stream.match(/[+\-*/=<>@^|&!?~.:]+/)) {
      return 'operator';
    }
    if (stream.match(/[a-z_][a-zA-Z0-9_']*/)) {
      return 'variable';
    }
    if (stream.match(/[A-Z][a-zA-Z0-9_']*/)) {
      return 'typeName';
    }
    stream.next();
    return null;
  },
});

// Get CodeMirror language extension for each language
function getLanguageExtension(lang: string) {
  switch (lang) {
    case 'json':
      return json();
    case 'rust':
      return rust();
    case 'javascript':
      return javascript();
    case 'typescript':
      return javascript({ typescript: true });
    case 'python':
      return python();
    case 'go':
      return go();
    case 'ocaml':
      return ocamlLanguage;
    case 'tsx':
      return javascript({ typescript: true, jsx: true });
    default:
      return [];
  }
}

function App() {
  const [code, setCode] = useState(SAMPLE_CODE.json);
  const [language, setLanguage] = useState('json');

  // Memoize language extension to prevent unnecessary re-renders
  const languageExtension = useMemo(
    () => getLanguageExtension(language),
    [language]
  );

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(SAMPLE_CODE[newLanguage] || '');
  };

  // Handle code change from editor
  const handleCodeChange = useCallback((value: string) => {
    setCode(value);
  }, []);

  return (
    <div className="h-full flex flex-col bg-[#0f0f0f] text-white">
      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Editor Panel */}
        <div className="w-full flex flex-col">
          <div className="px-4 py-2 border-b border-white/10 bg-white/5 flex items-center justify-between h-[50px]">
            <span className="text-sm font-medium text-gray-400">
              Source Code
            </span>
            <LanguageSelector
              value={language}
              onChange={handleLanguageChange}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={code}
              height="100%"
              theme={vscodeDark}
              extensions={[languageExtension]}
              onChange={handleCodeChange}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightActiveLine: true,
                foldGutter: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: true,
                rectangularSelection: true,
                crosshairCursor: false,
                highlightSelectionMatches: true,
              }}
              style={{ height: '100%', fontSize: '14px' }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-2 border-t border-white/10 text-xs text-gray-500">
        <span>Powered by Tree-sitter WASM</span>
      </footer>
    </div>
  );
}

export default App;
