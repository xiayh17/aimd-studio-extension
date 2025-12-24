/**
 * Base Typography and Layout Styles
 * 
 * Foundational styles for body, headings, paragraphs, code blocks,
 * links, tables, and other basic HTML elements.
 */

export function getBaseStyles(): string {
    return `
        body {
            font-family: 'Inter', var(--vscode-font-family), sans-serif;
            font-size: 15px;
            color: var(--aimd-text);
            background-color: var(--aimd-bg);
            padding: 24px;
            line-height: 1.6;
            margin: 0;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.8em;
            font-weight: 700;
            line-height: 1.3;
            color: var(--aimd-text);
        }

        p, ul, ol {
            margin: 0.8em 0;
        }

        /* Modern Blockquote (Base) */
        blockquote {
            margin: 1.5em 0;
            padding: 0 1em;
            color: var(--vscode-textBlockQuote-foreground);
            border-left: 4px solid var(--aimd-border);
            opacity: 0.9;
        }

        code {
            font-family: 'Fira Code', 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
            background-color: rgba(125, 125, 125, 0.15);
            padding: 0.2em 0.5em;
            border-radius: 4px;
        }

        /* Enhanced Code Block */
        pre {
            background-color: #1e1e1e;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5em 0;
            border: 1px solid #333;
            font-family: 'Fira Code', 'JetBrains Mono', monospace;
        }

        pre code {
            background-color: transparent;
            padding: 0;
            color: #d4d4d4;
            font-size: 0.9em;
        }

        a {
            color: var(--aimd-primary);
            text-decoration: none;
            border-bottom: 1px dotted var(--aimd-primary);
            transition: all 0.2s;
        }

        a:hover {
            border-bottom-style: solid;
            opacity: 0.8;
        }

        table {
            border-collapse: collapse;
            margin-bottom: 16px;
            width: 100%;
        }

        th, td {
            border: 1px solid var(--aimd-border);
            padding: 6px 13px;
        }

        th {
            background-color: var(--aimd-code-bg);
            font-weight: 600;
        }

        hr {
            height: 0.25em;
            padding: 0;
            margin: 24px 0;
            background-color: var(--aimd-border);
            border: 0;
        }

        img {
            max-width: 100%;
            height: auto;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }

            h1 {
                font-size: 1.75em;
            }

            h2 {
                font-size: 1.5em;
            }

            h3 {
                font-size: 1.25em;
            }
        }
        
        /* Markdown Styling for step body */
        .aimd-step-body h1, .aimd-preamble h1 { 
            font-size: 1.8em; 
            border-bottom: 1px solid var(--aimd-slate-200); 
            padding-bottom: 0.3em; 
            margin-top: 1.2em; 
        }
        
        .aimd-step-body h2, .aimd-preamble h2 { 
            font-size: 1.5em; 
            margin-top: 1.2em; 
            font-weight: 700; 
            color: var(--aimd-text-primary); 
        }
        
        .aimd-step-body p, .aimd-preamble p { 
            margin: 0.8em 0; 
            line-height: 1.6; 
        }
        
        .aimd-step-body code, .aimd-preamble code {
            font-family: 'Fira Code', monospace;
            background-color: rgba(0,0,0,0.05);
            padding: 0.2em 0.4em;
            border-radius: 4px;
            font-size: 0.9em;
        }
    `;
}
