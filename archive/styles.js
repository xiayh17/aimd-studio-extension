"use strict";
/**
 * 预览页面的样式定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviewStyles = getPreviewStyles;
/**
 * 获取预览页面的 CSS 样式
 */
function getPreviewStyles() {
    return `
        :root {
            --aimd-bg: var(--vscode-editor-background);
            --aimd-text: var(--vscode-editor-foreground);
            --aimd-border: var(--vscode-panel-border);
            --aimd-code-bg: var(--vscode-textCodeBlock-background);
            --aimd-link: var(--vscode-textLink-foreground);
            
            /* Elsevier 期刊风格: 深墨绿 + 纸张白 + 炭黑 */
            --aimd-primary: #15803d;      /* 墨绿主色 */
            --aimd-primary-light: rgba(22, 101, 52, 0.08);
            --aimd-primary-dark: #166534;
            
            /* var 类型 - 森林绿 */
            --aimd-var-bg: rgba(22, 101, 52, 0.08);
            --aimd-var-bg-hover: rgba(22, 101, 52, 0.12);
            --aimd-var-border: #22c55e;
            --aimd-var-border-hover: #15803d;
            --aimd-var-text: #166534;
            --aimd-var-shadow: rgba(22, 101, 52, 0.15);
            
            /* step 类型 - 墨绿 */
            --aimd-step-bg: rgba(21, 128, 61, 0.08);
            --aimd-step-bg-hover: rgba(21, 128, 61, 0.12);
            --aimd-step-border: #15803d;
            --aimd-step-border-hover: #166534;
            --aimd-step-text: #15803d;
            --aimd-step-shadow: rgba(21, 128, 61, 0.15);
            
            /* check 类型 - 琥珀 (保持) */
            --aimd-check-bg: rgba(251, 191, 36, 0.12);
            --aimd-check-bg-hover: rgba(251, 191, 36, 0.22);
            --aimd-check-border: rgba(251, 191, 36, 0.5);
            --aimd-check-border-hover: rgba(251, 191, 36, 0.8);
            --aimd-check-text: #d97706;
            --aimd-check-shadow: rgba(251, 191, 36, 0.25);
            
            /* var_table 类型 - 石板灰 */
            --aimd-var_table-bg: rgba(100, 116, 139, 0.08);
            --aimd-var_table-bg-hover: rgba(100, 116, 139, 0.12);
            --aimd-var_table-border: rgba(100, 116, 139, 0.5);
            --aimd-var_table-border-hover: rgba(100, 116, 139, 0.8);
            --aimd-var_table-text: #475569;
            --aimd-var_table-shadow: rgba(100, 116, 139, 0.15);
            
            /* 默认类型 - 炭灰 */
            --aimd-variable-bg: rgba(71, 85, 105, 0.08);
            --aimd-variable-bg-hover: rgba(71, 85, 105, 0.12);
            --aimd-variable-border: rgba(71, 85, 105, 0.4);
            --aimd-variable-border-hover: rgba(71, 85, 105, 0.6);
            --aimd-variable-text: #334155;
            --aimd-variable-shadow: rgba(71, 85, 105, 0.15);
        }

        body {
            font-family: 'Inter', var(--vscode-font-family), sans-serif;
            font-size: 15px; /* Slightly larger */
            color: var(--aimd-text);
            background-color: var(--aimd-bg);
            padding: 24px;
            line-height: 1.7; /* Increased line-height */
            margin: 0;
            -webkit-font-smoothing: antialiased;
        }

        /* ... */

        h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.8em;
            font-weight: 700; /* Bolder headers */
            line-height: 1.3;
            color: var(--aimd-text);
        }

        p, ul, ol {
            margin-bottom: 1.2em; /* Increased spacing */
        }

        /* ... */
        
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
            background-color: #1e1e1e; /* Darker bg for contrast */
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

        /* 模板变量占位符样式 - 基础样式 */
        .aimd-variable {
            display: inline-flex;
            align-items: center;
            background: linear-gradient(135deg, var(--aimd-variable-bg) 0%, var(--aimd-variable-bg-hover) 100%);
            border: 2px solid var(--aimd-variable-border);
            border-radius: 8px;
            padding: 6px 12px;
            margin: 2px 4px;
            font-family: var(--vscode-font-family);
            font-size: 0.9em;
            font-weight: 500;
            color: var(--aimd-variable-text);
            box-shadow: 0 2px 6px var(--aimd-variable-shadow), 
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
            white-space: nowrap;
            position: relative;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            text-shadow: none;
            letter-spacing: 0.2px;
            vertical-align: middle;
        }
        
        /* 确保变量在段落中有合适的行间距 */
        p .aimd-variable,
        li .aimd-variable,
        td .aimd-variable,
        th .aimd-variable {
            margin: 2px 4px;
            vertical-align: baseline;
        }
        
        /* 列表项中的变量间距 */
        li .aimd-variable {
            margin: 4px 4px;
        }
        
        /* var 类型样式 */
        .aimd-variable-var {
            background: linear-gradient(135deg, var(--aimd-var-bg) 0%, var(--aimd-var-bg-hover) 100%);
            border-color: var(--aimd-var-border);
            color: var(--aimd-var-text);
            box-shadow: 0 2px 6px var(--aimd-var-shadow), 
                        0 0 0 1px rgba(33, 150, 243, 0.1) inset;
        }
        
        .aimd-variable-var:hover {
            background: linear-gradient(135deg, var(--aimd-var-bg-hover) 0%, rgba(33, 150, 243, 0.35) 100%);
            border-color: var(--aimd-var-border-hover);
            box-shadow: 0 4px 12px var(--aimd-var-shadow), 
                        0 0 0 2px rgba(33, 150, 243, 0.2) inset,
                        0 0 20px rgba(33, 150, 243, 0.2);
        }
        
        /* step 类型样式 */
        .aimd-variable-step {
            background: linear-gradient(135deg, var(--aimd-step-bg) 0%, var(--aimd-step-bg-hover) 100%);
            border-color: var(--aimd-step-border);
            color: var(--aimd-step-text);
            box-shadow: 0 2px 6px var(--aimd-step-shadow), 
                        0 0 0 1px rgba(76, 175, 80, 0.1) inset;
        }
        
        .aimd-variable-step:hover {
            background: linear-gradient(135deg, var(--aimd-step-bg-hover) 0%, rgba(76, 175, 80, 0.35) 100%);
            border-color: var(--aimd-step-border-hover);
            box-shadow: 0 4px 12px var(--aimd-step-shadow), 
                        0 0 0 2px rgba(76, 175, 80, 0.2) inset,
                        0 0 20px rgba(76, 175, 80, 0.2);
        }
        
        /* check 类型样式 */
        .aimd-variable-check {
            background: linear-gradient(135deg, var(--aimd-check-bg) 0%, var(--aimd-check-bg-hover) 100%);
            border-color: var(--aimd-check-border);
            color: var(--aimd-check-text);
            box-shadow: 0 2px 6px var(--aimd-check-shadow), 
                        0 0 0 1px rgba(255, 152, 0, 0.1) inset;
        }
        
        .aimd-variable-check:hover {
            background: linear-gradient(135deg, var(--aimd-check-bg-hover) 0%, rgba(255, 152, 0, 0.35) 100%);
            border-color: var(--aimd-check-border-hover);
            box-shadow: 0 4px 12px var(--aimd-check-shadow), 
                        0 0 0 2px rgba(255, 152, 0, 0.2) inset,
                        0 0 20px rgba(255, 152, 0, 0.2);
        }
        
        /* var_table 类型样式 */
        .aimd-variable-var_table {
            background: linear-gradient(135deg, var(--aimd-var_table-bg) 0%, var(--aimd-var_table-bg-hover) 100%);
            border-color: var(--aimd-var_table-border);
            color: var(--aimd-var_table-text);
            box-shadow: 0 2px 6px var(--aimd-var_table-shadow), 
                        0 0 0 1px rgba(156, 39, 176, 0.1) inset;
        }
        
        .aimd-variable-var_table:hover {
            background: linear-gradient(135deg, var(--aimd-var_table-bg-hover) 0%, rgba(156, 39, 176, 0.35) 100%);
            border-color: var(--aimd-var_table-border-hover);
            box-shadow: 0 4px 12px var(--aimd-var_table-shadow), 
                        0 0 0 2px rgba(156, 39, 176, 0.2) inset,
                        0 0 20px rgba(156, 39, 176, 0.2);
        }

        /* 不同类型的变量图标 - 使用更简洁的图标 */
        .aimd-variable-var::before {
            content: '●';
            margin-right: 6px;
            font-size: 0.7em;
            opacity: 0.8;
        }

        .aimd-variable-step::before {
            content: '▶';
            margin-right: 6px;
            font-size: 0.75em;
            opacity: 0.8;
        }

        .aimd-variable-check::before {
            content: '✓';
            margin-right: 6px;
            font-size: 0.85em;
            opacity: 0.8;
            font-weight: bold;
        }

        .aimd-variable-var_table::before {
            content: '▦';
            margin-right: 6px;
            font-size: 0.8em;
            opacity: 0.8;
        }

        /* 默认图标（简单格式） */
        .aimd-variable:not([class*="aimd-variable-var"]):not([class*="aimd-variable-step"]):not([class*="aimd-variable-check"]):not([class*="aimd-variable-var_table"])::before {
            content: '○';
            margin-right: 6px;
            font-size: 0.7em;
            opacity: 0.8;
        }

        .aimd-variable:hover {
            transform: translateY(-1px);
        }

        /* 模板变量交互样式 */
        .aimd-variable-interactive {
            cursor: grab;
            user-select: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .aimd-variable-interactive:hover {
            transform: translateY(-2px) scale(1.05);
            z-index: 1000;
        }

        .aimd-variable-interactive:active {
            cursor: grabbing;
        }

        .aimd-variable-dragging {
            cursor: grabbing !important;
            opacity: 0.95;
            transform: scale(1.15) rotate(2deg) !important;
            z-index: 10000 !important;
            filter: brightness(1.2);
            will-change: transform, left, top; /* 性能优化提示 */
        }
        
        /* 拖动时使用对应类型的阴影 */
        .aimd-variable-var.aimd-variable-dragging {
            box-shadow: 0 8px 24px var(--aimd-var-shadow), 
                        0 0 30px rgba(33, 150, 243, 0.3) !important;
            border-color: var(--aimd-var-border-hover) !important;
        }
        
        .aimd-variable-step.aimd-variable-dragging {
            box-shadow: 0 8px 24px var(--aimd-step-shadow), 
                        0 0 30px rgba(76, 175, 80, 0.3) !important;
            border-color: var(--aimd-step-border-hover) !important;
        }
        
        .aimd-variable-check.aimd-variable-dragging {
            box-shadow: 0 8px 24px var(--aimd-check-shadow), 
                        0 0 30px rgba(255, 152, 0, 0.3) !important;
            border-color: var(--aimd-check-border-hover) !important;
        }
        
        .aimd-variable-var_table.aimd-variable-dragging {
            box-shadow: 0 8px 24px var(--aimd-var_table-shadow), 
                        0 0 30px rgba(156, 39, 176, 0.3) !important;
            border-color: var(--aimd-var_table-border-hover) !important;
        }

        .aimd-variable-clicked {
            transform: scale(0.92);
            transition: transform 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        /* 归位动画样式 */
        .aimd-variable-returning {
            pointer-events: none; /* 归位时禁用交互 */
            z-index: 9999 !important;
            will-change: transform, left, top; /* 性能优化提示 */
        }
        
        /* 归位时的视觉反馈 */
        .aimd-variable-returning::after {
            opacity: 0.3;
            animation: returnPulse 0.5s ease-in-out;
        }
        
        @keyframes returnPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
        }
        
        /* 优化渲染性能 */
        .aimd-variable-interactive {
            contain: layout style paint; /* CSS containment 优化 */
        }

        /* 添加拖动手柄提示 */
        .aimd-variable-interactive::after {
            content: '⋮⋮';
            position: absolute;
            right: 4px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.7em;
            opacity: 0.5;
            line-height: 1;
            letter-spacing: -2px;
        }

        .aimd-variable-interactive:hover::after {
            opacity: 0.8;
        }

        /* 右键菜单样式 */
        .aimd-variable-context-menu {
            background-color: var(--vscode-menu-background);
            border: 1px solid var(--vscode-menu-border);
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            min-width: 180px;
            padding: 4px 0;
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
        }

        .aimd-variable-menu-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 12px;
            color: var(--vscode-menu-foreground);
            cursor: pointer;
            transition: background-color 0.1s ease;
        }

        .aimd-variable-menu-item:hover {
            background-color: var(--vscode-menu-selectionBackground);
            color: var(--vscode-menu-selectionForeground);
        }

        .aimd-variable-menu-hint {
            font-size: 0.9em;
            opacity: 0.7;
            margin-left: 12px;
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
    `;
}
//# sourceMappingURL=styles.js.map