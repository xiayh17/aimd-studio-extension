/**
 * Variable Input Component Styles
 * 
 * Styles for inline variable inputs, wrappers, and rich tooltips.
 */

export function getVarInputStyles(): string {
    return `
        /* ============================================
           Variable Input Components (Elsevier Style)
           ============================================ */
        .aimd-inline-input-wrapper {
            display: inline-block;
            vertical-align: baseline;
        }

        /* Elsevier 期刊风格: 底纹文字样式 */
        .aimd-var-input {
            display: inline-block;
            vertical-align: baseline;
            background: rgba(22, 101, 52, 0.08);
            border: none;
            border-bottom: 2px solid var(--aimd-green-500);
            border-radius: 2px;
            color: var(--aimd-green-800);
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            font-size: 0.95em;
            line-height: 1;
            padding: 2px 6px;
            margin: 0 2px;
            text-align: center;
            min-width: 60px;
            outline: none;
            transition: all 0.2s ease;
            cursor: text;
        }

        .aimd-var-input:hover, .aimd-var-input:focus {
            background: rgba(22, 101, 52, 0.12);
            border-bottom-color: var(--aimd-green-700);
        }

        .aimd-var-input::placeholder {
            color: var(--aimd-green-600);
            font-style: normal;
            opacity: 0.6;
        }

        /* 确保段落和列表中的变量输入一致 */
        p .aimd-var-input,
        li .aimd-var-input,
        td .aimd-var-input,
        .aimd-callout .aimd-var-input {
            margin: 0 4px;
        }

        /* ============================================
           Rich Variable Tooltip
           ============================================ */
        .aimd-var-wrapper {
            position: relative;
            display: inline-flex;
            align-items: center;
            margin: 0 4px;
            vertical-align: middle;
            transition: z-index 0.1s;
            height: 1.2em;
        }

        /* Promote wrapper on hover */
        .aimd-var-wrapper:hover {
            z-index: 9999;
            isolation: isolate;
        }

        .aimd-var-tooltip {
            position: absolute;
            top: 100%;
            bottom: auto;
            left: 50%;
            transform: translateX(-50%) translateY(0);
            margin-top: 8px;
            margin-bottom: 0;
            background-color: #ffffff;
            border: 1px solid var(--aimd-green-700);
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 8px 12px;
            min-width: 200px;
            max-width: 320px;
            /* Use very high z-index within the wrapper's stacking context */
            z-index: 10;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            text-align: left;
            /* Changed to span, so need block display */
            display: block;
        }

        /* 顶部小三角箭头 */
        .aimd-var-tooltip::after {
            content: '';
            position: absolute;
            bottom: 100%;
            top: auto;
            left: 50%;
            margin-left: -6px;
            border-width: 6px;
            border-style: solid;
            border-color: transparent transparent var(--aimd-green-700) transparent;
        }

        /* 
           Tooltip is now handled via JS Portal (initPortalTooltips) 
           to avoid stacking context issues.
           Do NOT show via CSS hover.
        */
        /*
        .aimd-var-wrapper:hover .aimd-var-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(4px);
        }
        */

        .aimd-tooltip-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--aimd-slate-200);
            padding-bottom: 6px;
            margin-bottom: 6px;
        }

        .aimd-tooltip-title {
            font-weight: 700;
            color: var(--aimd-slate-800);
            font-size: 0.95em;
        }

        .aimd-tooltip-type {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8em;
            color: var(--aimd-green-700);
            background-color: var(--aimd-green-50);
            padding: 2px 6px;
            border-radius: 4px;
        }

        .aimd-tooltip-meta {
            font-size: 0.85em;
            color: var(--aimd-slate-600);
            line-height: 1.5;
            display: block; /* Changed to span */
        }

        .aimd-tooltip-display {
            font-weight: 600;
            margin-bottom: 4px;
            display: block; /* Changed to span */
        }

        .aimd-tooltip-desc {
            margin-bottom: 6px;
            color: var(--aimd-slate-500);
            font-style: italic;
            display: block; /* Changed to span */
        }

        .aimd-tooltip-constraints {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.8em;
            color: var(--aimd-slate-400);
            background: var(--aimd-slate-50);
            padding: 2px 4px;
            border-radius: 2px;
            display: inline-block;
        }

        /* Highlight flash animation for jump targets */
        .aimd-var-input.aimd-highlight-flash {
            animation: highlight-flash 1.5s ease-in-out;
            border-bottom-color: var(--aimd-green-700) !important;
        }

        .aimd-empty-line {
            height: 1.2em;
            margin: 0;
            padding: 0;
            display: block;
        }
    `;
}
