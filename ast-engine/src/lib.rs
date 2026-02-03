use serde::Serialize;
use wasm_bindgen::prelude::*;

/// Represents a node in the Abstract Syntax Tree
#[derive(Serialize, Debug, Clone)]
pub struct AstNode {
    /// The type/kind of the node (e.g., "function_definition", "string_literal")
    pub kind: String,
    /// Start byte offset in the source code
    pub start: usize,
    /// End byte offset in the source code
    pub end: usize,
    /// Start position as (row, column)
    pub start_position: (usize, usize),
    /// End position as (row, column)
    pub end_position: (usize, usize),
    /// The actual text content of this node (for leaf nodes)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    /// Whether this is a named node in the grammar
    pub is_named: bool,
    /// Child nodes
    pub children: Vec<AstNode>,
}

/// Result structure returned to JavaScript
#[derive(Serialize, Debug)]
pub struct ParseResult {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ast: Option<AstNode>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    pub language: String,
}

#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// Convert a tree-sitter node to our AstNode structure
fn node_to_ast(node: tree_sitter::Node, source: &str) -> AstNode {
    let start = node.start_byte();
    let end = node.end_byte();
    let start_pos = node.start_position();
    let end_pos = node.end_position();

    // Get text for leaf nodes (nodes without children)
    let text = if node.child_count() == 0 {
        source.get(start..end).map(|s| s.to_string())
    } else {
        None
    };

    // Recursively convert children
    let children: Vec<AstNode> = (0..node.child_count())
        .filter_map(|i| node.child(i))
        .map(|child| node_to_ast(child, source))
        .collect();

    AstNode {
        kind: node.kind().to_string(),
        start,
        end,
        start_position: (start_pos.row, start_pos.column),
        end_position: (end_pos.row, end_pos.column),
        text,
        is_named: node.is_named(),
        children,
    }
}

/// Parse code and return AST as JSON string
///
/// # Arguments
/// * `code` - The source code to parse
/// * `language` - The language identifier ("json" or "rust")
///
/// # Returns
/// A JSON string containing the ParseResult
#[wasm_bindgen]
pub fn generate_ast(code: &str, language: &str) -> String {
    let result = parse_code(code, language);
    serde_json::to_string(&result).unwrap_or_else(|e| {
        serde_json::to_string(&ParseResult {
            success: false,
            ast: None,
            error: Some(format!("Serialization error: {}", e)),
            language: language.to_string(),
        })
        .unwrap()
    })
}

/// Internal parsing function
fn parse_code(code: &str, language: &str) -> ParseResult {
    // Get the appropriate language parser
    let ts_language = match language.to_lowercase().as_str() {
        "json" => tree_sitter_json::LANGUAGE,
        "rust" => tree_sitter_rust::LANGUAGE,
        "javascript" => tree_sitter_javascript::LANGUAGE,
        "typescript" => tree_sitter_typescript::LANGUAGE_TYPESCRIPT,
        "python" => tree_sitter_python::LANGUAGE,
        "go" => tree_sitter_go::LANGUAGE,
        "ocaml" => tree_sitter_ocaml::LANGUAGE_OCAML,
        _ => {
            return ParseResult {
                success: false,
                ast: None,
                error: Some(format!("Unsupported language: {}", language)),
                language: language.to_string(),
            };
        }
    };

    // Create parser and set language
    let mut parser = tree_sitter::Parser::new();
    if let Err(e) = parser.set_language(&ts_language.into()) {
        return ParseResult {
            success: false,
            ast: None,
            error: Some(format!("Failed to set language: {}", e)),
            language: language.to_string(),
        };
    }

    // Parse the code
    match parser.parse(code, None) {
        Some(tree) => {
            let root = tree.root_node();
            let ast = node_to_ast(root, code);

            ParseResult {
                success: true,
                ast: Some(ast),
                error: None,
                language: language.to_string(),
            }
        }
        None => ParseResult {
            success: false,
            ast: None,
            error: Some("Failed to parse code".to_string()),
            language: language.to_string(),
        },
    }
}

/// Get list of supported languages
#[wasm_bindgen]
pub fn get_supported_languages() -> String {
    serde_json::to_string(&vec!["json", "rust", "javascript", "typescript", "python", "go", "ocaml"]).unwrap()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_json_parsing() {
        let result = parse_code(r#"{"key": "value"}"#, "json");
        assert!(result.success);
        assert!(result.ast.is_some());
    }

    #[test]
    fn test_rust_parsing() {
        let result = parse_code("fn main() { println!(\"Hello\"); }", "rust");
        assert!(result.success);
        assert!(result.ast.is_some());
    }

    #[test]
    fn test_unsupported_language() {
        let result = parse_code("print('hello')", "python");
        assert!(!result.success);
        assert!(result.error.is_some());
    }
}
