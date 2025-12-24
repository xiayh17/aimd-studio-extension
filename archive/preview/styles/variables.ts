/**
 * CSS Custom Properties (Design Tokens)
 * 
 * Centralized :root variables for colors, spacing, and theming.
 * Uses VS Code CSS variables for native integration.
 */

export function getCssVariables(): string {
    return `
        /* ============================================
           Variables & Theme - Scientific Minimalist
           ============================================ */
        :root {
            /* Elsevier Journal Palette: Forest Green + Paper White + Charcoal */
            --aimd-green-50: #f0fdf4;    /* 极淡绿背景 */
            --aimd-green-100: #dcfce7;   /* 淡绿背景 */
            --aimd-green-500: #22c55e;   /* 中绿色 */
            --aimd-green-600: #16a34a;   /* 深绿色 */
            --aimd-green-700: #15803d;   /* 墨绿色 - 主色 */
            --aimd-green-800: #166534;   /* 森林绿 - 文字 */
            
            --aimd-slate-50: #f8fafc;
            --aimd-slate-100: #f1f5f9;
            --aimd-slate-200: #e2e8f0;   /* 极细边框 */
            --aimd-slate-300: #cbd5e1;
            --aimd-slate-400: #94a3b8;
            --aimd-slate-500: #64748b;
            --aimd-slate-700: #334155;   /* 炭黑文字 */
            --aimd-slate-800: #1e293b;
            
            /* Components */
            --aimd-line-color: var(--aimd-slate-200);
            --aimd-card-bg: var(--vscode-editor-background);
            --aimd-card-border: var(--aimd-slate-200);
            --aimd-text-primary: var(--vscode-editor-foreground);
            --aimd-text-secondary: var(--vscode-descriptionForeground);
            --aimd-bg-secondary: var(--vscode-textBlockQuote-background);
            
            /* Legacy aliases for compatibility */
            --aimd-teal-50: var(--aimd-green-50);
            --aimd-teal-400: var(--aimd-green-500);
            --aimd-teal-500: var(--aimd-green-600);
            --aimd-teal-600: var(--aimd-green-700);
            
            /* Base styles module compatibility */
            --aimd-bg: var(--vscode-editor-background);
            --aimd-text: var(--vscode-editor-foreground);
            --aimd-border: var(--vscode-panel-border);
            --aimd-code-bg: var(--vscode-textCodeBlock-background);
            --aimd-link: var(--vscode-textLink-foreground);
            --aimd-primary: #15803d;
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
            
            /* check 类型 - 琥珀 */
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
            
            /* Table-specific variables */
            --aimd-border-light: var(--aimd-slate-200);
            --aimd-bg-tertiary: var(--aimd-slate-50);
            --aimd-bg-primary: var(--vscode-editor-background);
            --aimd-text-tertiary: var(--aimd-slate-500);
            --aimd-border-subtle: var(--aimd-slate-300);
            --aimd-row-hover-bg: rgba(22, 103, 52, 0.06);
        }
    `;
}
