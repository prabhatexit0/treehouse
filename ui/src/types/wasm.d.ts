// Type declarations for the ast-engine WASM module
declare module '*/wasm/ast_engine' {
  export function generate_ast(code: string, language: string): string;
  export function get_supported_languages(): string;
  export default function init(): Promise<void>;
}

// AST Node structure matching Rust's AstNode
export interface AstNode {
  kind: string;
  start: number;
  end: number;
  start_position: [number, number];
  end_position: [number, number];
  text?: string;
  is_named: boolean;
  children: AstNode[];
}

// Parse result structure matching Rust's ParseResult
export interface ParseResult {
  success: boolean;
  ast?: AstNode;
  error?: string;
  language: string;
}
