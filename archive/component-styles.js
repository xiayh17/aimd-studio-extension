"use strict";
/**
 * 组件样式定义
 * 现代化的UI组件样式
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentStyles = getComponentStyles;
function getComponentStyles() {
    return `
        /* ============================================
           Variables & Theme - ProFlow Palette
           ============================================ */
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
        }

        /* ... existing dark mode adjustments ... */

        /* ... */

        /* The Circular Node */
        .aimd-timeline-node {
            width: var(--aimd-node-size);
            height: var(--aimd-node-size);
            border-radius: 50%;
            background-color: var(--vscode-editor-background); 
            border: 1px solid var(--aimd-slate-400); /* Thinner border */
            color: var(--aimd-slate-400);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            font-size: 13px;
            position: relative;
            z-index: 20;
            transition: all 0.2s ease;
        }

        /* Checkable Node */
        .aimd-timeline-node[data-checkable="true"] {
            cursor: pointer;
            border-color: var(--aimd-slate-500);
        }
        
        .aimd-timeline-node[data-checkable="true"]:hover {
            transform: scale(1.05); /* Subtle scale */
            color: var(--aimd-teal-500);
            border-color: var(--aimd-teal-500);
        }

        .aimd-timeline-node[data-checked="true"] {
            background-color: transparent;
            color: var(--aimd-teal-500);
            border-color: var(--aimd-teal-500);
            font-weight: bold;
        }

        /* ... */

        /* ============================================
           Variable Input Components (Scientific Blank)
           ============================================ */
        .aimd-var-input {
            background: transparent;
            border: none;
            border-bottom: 1px solid var(--aimd-teal-500); /* Underline only */
            border-radius: 0;
            color: var(--aimd-teal-400); /* Readable contrast */
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-weight: 500;
            font-size: 0.95em;
            padding: 0 4px;
            text-align: center;
            min-width: 60px;
            outline: none;
            transition: all 0.2s ease;
            cursor: text;
        }

        .aimd-var-input:hover, .aimd-var-input:focus {
            background-color: rgba(20, 184, 166, 0.05); /* Extremely subtle bg */
            border-bottom-width: 2px;
        }

        .aimd-var-input::placeholder {
            color: var(--aimd-slate-500);
            font-style: normal;
            opacity: 0.3;
        }

        /* ... */

        /* ============================================
           Callouts / GFM Alerts (Scientific Minimalist)
           ============================================ */
        .aimd-callout {
            margin: 1.5em 0;
            padding: 12px 16px;
            border-radius: 2px; /* Sharp corners */
            border-left: 3px solid; /* Thinner accent line */
            background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%);
            position: relative;
        }
        
        body.vscode-light .aimd-callout {
            background: linear-gradient(90deg, rgba(0,0,0,0.02) 0%, transparent 100%);
        }

        .aimd-callout p {
            margin: 0.5em 0;
            color: var(--aimd-text-secondary); /* Softer text */
        }
        
        .aimd-callout strong {
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 0.85em;
            display: block;
            margin-bottom: 4px;
        }

        /* TIP / SUCCESS */
        .aimd-callout-tip {
            border-left-color: var(--aimd-teal-500);
        }
        .aimd-callout-tip strong { color: var(--aimd-teal-500); }

        /* NOTE / INFO */
        .aimd-callout-note {
            border-left-color: #3b82f6;
        }
        .aimd-callout-note strong { color: #60a5fa; }

        /* WARNING / IMPORTANT */
        .aimd-callout-warning, .aimd-callout-important {
            border-left-color: #f59e0b;
        }
        .aimd-callout-warning strong { color: #fbbf24; }

        /* CAUTION / ERROR */
        .aimd-callout-caution {
            border-left-color: #ef4444;
        }
        .aimd-callout-caution strong { color: #f87171; }
        
        /* Remove icons for purely scientific look, or keep them subtle? 
           User requested "Signal-to-Noise", icons can be noise but also signal. 
           Let's keep icons but make them part of the header line if possible.
           Actually user CSS snippet didn't include icons in the 'Professional' ASCII art.
           Let's simplify: Icon only on the title line. */
        .aimd-callout::before { display: none; } /* Remove floating icon */
        
        /* ... */

        /* --- Right Column: Content Card (Elsevier Style) --- */
        .aimd-step-content {
            flex: 1;
            min-width: 0;
            background-color: var(--aimd-card-bg);
            border: 1px solid var(--aimd-slate-200); /* 极细浅灰边框 */
            border-top: 3px solid var(--aimd-green-700); /* 顶部深绿装饰线 */
            border-radius: 4px; /* 小圆角 */
            box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* 极轻阴影 */
            transition: box-shadow 0.2s ease;
            overflow: visible; /* Fix: Allow tooltips to overflow */
            display: flex;
            flex-direction: column;
        }

        .aimd-step-content > :first-child {
            border-top-left-radius: 3px; /* Match parent radius - 1px border */
            border-top-right-radius: 3px;
        }

        .aimd-step-content > :last-child {
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }

        .aimd-step-content:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.08);
        }

        /* --- Text Card (Scientific Minimalist) --- */
        .aimd-text-card {
            display: block;
            padding: 8px 0; /* Align left with cards, no side padding needed if we want strict alignment */
            background-color: transparent;
            border: none;
            margin-bottom: 24px;
            overflow: visible; /* Allow tooltips to overflow */
        }

        .aimd-text-card:hover {
            /* Minimal interaction */
        }
        
        /* Adjust headings in text card */
        .aimd-text-card h1, .aimd-text-card h2 {
            border-bottom: 1px solid var(--aimd-line-color); /* Minimal divider */
            padding-bottom: 8px;
            margin-top: 16px;
            margin-bottom: 20px;
            font-weight: 600;
            letter-spacing: -0.01em;
        }

        /* Result Marker Strip */
        .aimd-step-content.is-result {
            border-top-color: var(--aimd-green-500);
            background-color: rgba(22, 101, 52, 0.03);
        }
        
        /* Result Header Label */
        .aimd-result-label {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--aimd-green-700);
            font-weight: 700;
            padding: 12px 20px 0 20px;
        }

        /* Header Area */
        .aimd-step-header {
            padding: 16px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center; /* 垂直居中 */
            cursor: pointer;
            user-select: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08); /* 极细分割线 */
        }
        
        /* Header Left: 徽章 + 标题组 */
        .aimd-step-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 0;
        }

        /* Step Badge: Elsevier 期刊风格 - 墨绿实心正方形 */
        .aimd-step-badge {
            position: static;
            background: var(--aimd-green-700); /* 墨绿实心 */
            color: #ffffff;
            border: none;
            min-width: 32px;
            height: 32px;
            border-radius: 4px; /* 小圆角正方形 */
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Georgia', 'Times New Roman', serif; /* 期刊字体 */
            font-size: 14px;
            font-weight: 700;
            flex-shrink: 0;
            transition: all 0.2s ease;
        }

        /* Checkable Badge 可交互样式 */
        .aimd-step-badge[data-checkable="true"] {
            cursor: pointer;
        }

        .aimd-step-badge[data-checkable="true"]:hover {
            background: var(--aimd-green-600);
            transform: scale(1.05);
        }

        .aimd-step-badge[data-checked="true"] {
            background: var(--aimd-green-500);
        }

        .aimd-step-title-group {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .aimd-step-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--aimd-text-primary);
            line-height: 1.4;
        }

        .aimd-step-subtitle {
            font-size: 13px;
            color: var(--aimd-text-secondary);
            margin-top: 4px;
        }

        .aimd-step-checked-message {
            display: none;
            font-size: 13px;
            color: var(--aimd-teal-500);
            font-weight: 500;
            margin-top: 4px;
            font-style: italic;
        }

        .aimd-step-container[data-checked="true"] .aimd-step-checked-message {
            display: block;
        }

        .aimd-step-container[data-checked="true"] .aimd-step-title {
            text-decoration: line-through;
            opacity: 0.6;
        }


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
            vertical-align: baseline; /* 与文字基线对齐 */
            background: rgba(22, 101, 52, 0.08); /* 极淡墨绿底色 */
            border: none;
            border-bottom: 2px solid var(--aimd-green-500); /* 底部实线，像填空题 */
            border-radius: 2px; /* 极小圆角 */
            color: var(--aimd-green-800); /* 森林绿文字 */
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
            font-size: 0.95em;
            line-height: 1.4; /* 保持一致的行高 */
            padding: 2px 6px;
            margin: 0 2px; /* 左右小间距 */
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

        /* ============================================
           Rich Variable Tooltip
           ============================================ */
        .aimd-var-wrapper {
            position: relative;
            display: inline-block;
            margin: 0 4px; /* Replaces Tailwind's mx-1 */
            vertical-align: baseline; /* Align with surrounding text */
            transition: z-index 0.1s; /* Smooth transition */
        }

        /* Essential Fix: Promote wrapper on hover so tooltip sits above subsequent content */
        .aimd-var-wrapper:hover {
            z-index: 2000;
        }

        .aimd-var-tooltip {
            position: absolute;
            top: 100%; /* Change: Show below the element */
            bottom: auto;
            left: 50%;
            transform: translateX(-50%) translateY(0); /* Start at 0 */
            margin-top: 8px; /* Margin from top */
            margin-bottom: 0;
            background-color: #ffffff;
            border: 1px solid var(--aimd-green-700); /* 深绿边框 */
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 8px 12px;
            min-width: 200px;
            max-width: 320px;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            text-align: left;
        }

        /* 顶部小三角箭头 (Now pointing UP, located at top of tooltip) */
        .aimd-var-tooltip::after {
            content: '';
            position: absolute;
            bottom: 100%; /* Located at top of tooltip */
            top: auto;
            left: 50%;
            margin-left: -6px;
            border-width: 6px;
            border-style: solid;
            /* Border color: Bottom is Green/bg, others transparent */
            border-color: transparent transparent var(--aimd-green-700) transparent;
        }

        .aimd-var-wrapper:hover .aimd-var-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(4px); /* Slight slide down effect */
        }

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
        }

        .aimd-tooltip-display {
            font-weight: 600;
            margin-bottom: 4px;
        }

        .aimd-tooltip-desc {
            margin-bottom: 6px;
            color: var(--aimd-slate-500);
            font-style: italic;
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

        /* 确保段落和列表中的变量输入一致 */
        p .aimd-var-input,
        li .aimd-var-input,
        td .aimd-var-input,
        .aimd-callout .aimd-var-input {
            margin: 0 4px;
        }

        /* ============================================
           Variable Table Components (High Performance Style)
           ============================================ */
        
        /* Table Container Wrapper */
        .aimd-var-table-wrapper {
            margin: 1.5em 0;
            background: var(--aimd-bg-secondary);
            border: 1px solid var(--aimd-border-light);
            border-radius: 6px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        /* Header Bar */
        .aimd-table-header-bar {
            height: 40px;
            background: var(--aimd-bg-tertiary);
            border-bottom: 1px solid var(--aimd-border-light);
            display: flex;
            align-items: center;
            padding: 0 16px;
            gap: 12px;
            flex-shrink: 0;
        }

        .aimd-table-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: var(--aimd-text-primary);
        }

        .aimd-table-status {
            margin-left: auto;
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: var(--aimd-text-tertiary);
            background: var(--aimd-bg-primary);
            padding: 2px 6px;
            border-radius: 3px;
            border: 1px solid var(--aimd-border-light);
        }

        /* Scrollable Area */
        .aimd-var-table-container {
            flex: 1;
            overflow: auto;
            position: relative;
            max-height: 400px;
            background: var(--aimd-bg-primary);
        }

        /* Custom Scrollbar for the table */
        .custom-scrollbar::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: var(--aimd-bg-secondary);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: var(--aimd-border-subtle);
            border: 2px solid var(--aimd-bg-secondary);
            border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: var(--aimd-slate-400);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
            background: var(--aimd-bg-secondary);
        }

        /* Main Table */
        .aimd-var-table {
            width: 100%;
            border-collapse: separate; /* Required for sticky */
            border-spacing: 0;
            min-width: 600px;
        }

        /* Sticky Header */
        .aimd-var-table thead {
            position: sticky;
            top: 0;
            z-index: 25; /* Higher than sticky col */
            background: var(--vscode-editor-background);
        }

        .aimd-table-th {
            text-align: left;
            padding: 0;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--aimd-text-secondary);
            border-bottom: 1px solid var(--aimd-slate-200);
            background: var(--aimd-slate-50);
            vertical-align: middle;
            height: 38px;
            white-space: nowrap;
        }
        
        body.vscode-dark .aimd-table-th {
            background: rgba(255, 255, 255, 0.05);
            border-bottom-color: rgba(255, 255, 255, 0.1);
        }

        .aimd-th-content {
            padding: 0 12px;
            height: 100%;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .aimd-table-actions-th {
            width: 32px;
            min-width: 32px;
            padding: 0;
            background-color: var(--aimd-code-bg);
            border-bottom: 1px solid var(--aimd-border);
        }

        .aimd-table-actions-td {
            width: 32px;
            padding: 0;
            text-align: center;
            vertical-align: middle;
            opacity: 0;
            transition: opacity 0.2s;
        }

        .aimd-var-table-row:hover .aimd-table-actions-td {
            opacity: 1;
        }

        .aimd-row-delete-btn {
            color: var(--vscode-descriptionForeground);
            padding: 4px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            cursor: pointer;
        }

        .aimd-row-delete-btn:hover {
            background-color: var(--vscode-button-secondaryHoverBackground);
            color: var(--vscode-errorForeground);
        }

        .aimd-th-text {
            flex: 1;
        }

        .aimd-th-type {
            font-family: 'JetBrains Mono', monospace;
            font-size: 8px;
            opacity: 0.5;
            font-weight: 400;
        }

        /* Sticky Action Column (Left 0) */
        .aimd-table-actions-th,
        .aimd-table-actions-td {
            position: sticky;
            left: 0;
            z-index: 25;
            background-color: var(--aimd-code-bg); /* Match bg to cover scroll */
        }
        
        .aimd-var-table-row:hover .aimd-table-actions-td {
            background-color: var(--aimd-row-hover-bg) !important;
        }

        /* Shadow mask for sticky column */
        .aimd-table-actions-td::after, .aimd-table-actions-th::after {
            content: '';
            position: absolute;
            top: 0;
            right: -12px;
            bottom: 0;
            width: 12px;
            pointer-events: none;
            background: linear-gradient(to right, rgba(0,0,0,0.1), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .aimd-var-table-container.is-scrolled-x .aimd-table-actions-td::after,
        .aimd-var-table-container.is-scrolled-x .aimd-table-actions-th::after {
            opacity: 1;
        }

        .aimd-table-td {
            padding: 0;
            background: transparent;
            border-bottom: 1px solid var(--aimd-slate-100);
            vertical-align: middle;
            height: 36px;
        }
        
        body.vscode-dark .aimd-table-td {
            border-bottom-color: rgba(255, 255, 255, 0.05);
        }

        .aimd-var-table-row:nth-child(odd) .aimd-table-td {
            background-color: rgba(0, 0, 0, 0.01);
        }
        
        body.vscode-dark .aimd-var-table-row:nth-child(odd) .aimd-table-td {
             background-color: rgba(255, 255, 255, 0.02);
        }
        
        /* Sticky column needs to respect zebra striping */
        .aimd-var-table-row:nth-child(odd) .aimd-sticky-col {
            background-color: var(--aimd-slate-50);
        }
        
        body.vscode-dark .aimd-var-table-row:nth-child(odd) .aimd-sticky-col {
            background-color: rgba(255, 255, 255, 0.03);
        }

        /* Hover Effect */
        .aimd-var-table-row:hover .aimd-table-td,
        .aimd-var-table-row:hover .aimd-sticky-col {
            background-color: rgba(22, 103, 52, 0.06) !important;
        }
        
        /* Focus state within row highlights the whole row slightly */
        .aimd-var-table-row:focus-within {
            background-color: rgba(22, 103, 52, 0.04);
        }

        /* Cell Input Styling - Ghost Interaction */
        .aimd-cell-input {
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            padding: 0 12px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--vscode-editor-foreground);
            outline: none;
            cursor: pointer;
            transition: all 0.15s ease;
            text-align: left;
        }

        .aimd-cell-input:hover {
            background: rgba(22, 103, 52, 0.05);
        }

        .aimd-cell-input:focus {
            background: var(--vscode-editor-background);
            box-shadow: inset 0 0 0 2px var(--aimd-green-600);
            cursor: text;
        }

        /* Primary Input (Sticky Col) */
        .aimd-cell-input-primary {
            font-weight: 700;
            color: var(--aimd-green-800);
        }
        
        body.vscode-dark .aimd-cell-input-primary {
            color: var(--aimd-green-500);
        }

        /* Drag Handle Placeholder */
        .aimd-drag-handle {
            color: var(--aimd-slate-400);
            cursor: grab;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        .aimd-var-table-wrapper:hover .aimd-drag-handle {
            opacity: 1;
        }

        /* Responsive Hybrid View: Card Mode (< 650px) */
        @media (max-width: 650px) {
            .aimd-var-table-container {
                overflow-x: hidden;
                border: none;
            }

            .aimd-var-table {
                min-width: unset !important;
                display: block;
            }

            .aimd-var-table thead {
                display: none; /* Hide header completely in card mode */
            }
            
            .aimd-var-table tbody {
                display: block;
            }

            /* Card Container - Adaptive Grid Layout */
            .aimd-var-table-row {
                display: grid !important;
                /* Default to 1 column, overridden by density */
                grid-template-columns: 1fr;
                gap: 12px 16px;
                background: var(--vscode-editor-background);
                border: 1px solid var(--aimd-border);
                border-radius: 12px;
                margin-bottom: 16px;
                padding: 0;
                padding-bottom: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                position: relative;
                overflow: hidden;
            }

            /* Density: Normal (≤3 columns) - Single column */
            .aimd-var-table-wrapper[data-density="normal"] .aimd-var-table-row {
                grid-template-columns: 1fr;
            }

            /* Density: Compact (4+ columns) - 2-column grid */
            .aimd-var-table-wrapper[data-density="compact"] .aimd-var-table-row {
                grid-template-columns: 1fr 1fr;
            }

            .aimd-var-table-row:hover {
                box-shadow: 0 4px 16px rgba(0,0,0,0.12);
                border-color: var(--aimd-green-500);
            }

            /* Card Header (Title + Description) - Spans full width */
            .aimd-card-header-td {
                grid-column: 1 / -1;
                position: relative !important;
                order: -1; /* Always first */
                padding: 12px 16px !important;
                padding-right: 44px !important; /* Room for delete button */
                border-bottom: 1px solid var(--aimd-border) !important;
                background: rgba(0,0,0,0.04) !important;
                display: block !important;
                height: auto !important; /* Reset height */
            }
            
            body.vscode-light .aimd-card-header-td {
                background: rgba(0,0,0,0.03) !important;
            }

            .aimd-card-header-td::before {
                display: none !important;
            }

            .aimd-card-header-content {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .aimd-card-title {
                font-size: 14px;
                font-weight: 700;
                color: var(--aimd-text-primary);
                letter-spacing: -0.01em;
            }

            .aimd-card-desc {
                font-size: 10px;
                color: var(--vscode-descriptionForeground);
                opacity: 0.7;
            }

            /* Remove .aimd-card-body generic styles */

            /* Data Cells (Key-Value Pairs) */
            .aimd-table-td {
                display: flex !important;
                flex-direction: column !important;
                gap: 4px;
                padding: 0 16px; /* Side padding for items */
                border: none !important;
                background: transparent !important;
                height: auto !important;
            }

            /* Adaptive Text Sizes */
            .aimd-var-table-wrapper[data-density="normal"] .aimd-table-td::before {
                font-size: 11px;
            }
            .aimd-var-table-wrapper[data-density="normal"] .aimd-table-td .aimd-var-input {
                font-size: 16px;
            }

            .aimd-var-table-wrapper[data-density="compact"] .aimd-table-td::before {
                font-size: 9px;
            }
            .aimd-var-table-wrapper[data-density="compact"] .aimd-table-td .aimd-var-input {
                font-size: 13px;
            }

            /* Delete Button (Absolute top-right in header) */
            .aimd-table-actions-td {
                position: absolute !important;
                top: 8px;
                right: 8px;
                width: auto !important;
                height: auto !important;
                padding: 0 !important;
                opacity: 0.5;
                display: block !important;
                z-index: 10;
                grid-column: auto; /* Ignore grid */
            }

            .aimd-table-actions-td::before {
                display: none !important;
            }

            .aimd-var-table-row:hover .aimd-table-actions-td {
                opacity: 1;
            }

            .aimd-row-delete-btn {
                background: transparent !important;
                color: var(--vscode-errorForeground);
                font-size: 16px;
                font-weight: 400;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
                border: none;
                cursor: pointer;
            }

            .aimd-row-delete-btn:hover {
                background: rgba(255, 80, 80, 0.2) !important;
            }

            /* Label (::before pseudo-element) */
            .aimd-table-td::before {
                content: attr(data-col-title);
                display: block;
                font-weight: 600;
                color: var(--vscode-descriptionForeground);
                text-transform: uppercase;
                letter-spacing: 0.06em;
                opacity: 0.8;
            }

            /* Value (input) */
            .aimd-table-td .aimd-var-input,
            .aimd-table-td .aimd-cell-input {
                width: 100%;
                background: rgba(22, 101, 52, 0.06) !important;
                border: none !important;
                border-bottom: 1.5px solid var(--aimd-green-500) !important;
                border-radius: 2px !important;
                padding: 4px 6px !important;
                font-family: 'JetBrains Mono', monospace;
                color: var(--aimd-green-800);
                line-height: 1.4;
                text-align: left;
            }
            
            body.vscode-dark .aimd-table-td .aimd-var-input,
            body.vscode-dark .aimd-table-td .aimd-cell-input {
                color: var(--aimd-green-500);
            }

            /* Disable all sticky behaviors in card mode */
            .aimd-sticky-col,
            .aimd-table-actions-th,
            .aimd-card-header-th {
                position: static !important;
                left: auto !important;
            }

            .aimd-sticky-col::after,
            .aimd-table-actions-td::after,
            .aimd-table-actions-th::after {
                display: none !important;
            }
        }

        /* Hide card header in Table Mode */
        .aimd-card-header-th,
        .aimd-card-header-td {
            display: none;
        }

        /* Footer Bar */
        .aimd-table-footer-bar {
            height: 32px;
            border-top: 1px solid var(--aimd-border-light);
            background: var(--aimd-bg-tertiary);
            display: flex;
            align-items: center;
            padding: 0 12px;
            gap: 16px;
            font-size: 11px;
            color: var(--aimd-text-tertiary);
        }

        .aimd-table-meta {
            font-family: 'JetBrains Mono', monospace;
        }

        .aimd-table-actions {
            margin-left: auto;
        }

        .aimd-btn-icon {
            background: transparent;
            border: none;
            color: var(--aimd-teal-600);
            font-weight: 600;
            font-size: 11px;
            cursor: pointer;
            padding: 4px 8px;
            border-radius: 4px;
            transition: all 0.2s;
        }

        .aimd-btn-icon:hover {
            background: var(--aimd-teal-50);
            color: var(--aimd-teal-700);
        }



        /* ============================================
           Reference Tags (Elsevier Style)
           ============================================ */
        .aimd-ref-step {
            position: relative; /* Required for tooltip positioning */
            display: inline-flex;
            align-items: center;
            gap: 4px;
            color: var(--aimd-green-800);
            font-size: 0.9em;
            font-weight: 600;
            padding: 3px 10px;
            background-color: var(--aimd-green-50);
            border: 1px solid var(--aimd-green-500);
            border-radius: 4px;
            text-decoration: none;
            vertical-align: baseline;
            margin: 4px 6px;
            line-height: 1.4;
        }

        /* 箭头在 ref-step 中的特殊样式 */
        .aimd-ref-step .aimd-ref-jump {
            color: var(--aimd-green-600);
        }

        .aimd-ref-step .aimd-ref-jump:hover {
            background: var(--aimd-green-700);
            color: white;
        }

        .aimd-ref-icon {
            font-size: 0.85em;
            line-height: 1;
        }

        /* 跳转箭头专用样式 */
        .aimd-ref-jump {
            cursor: pointer;
            padding: 2px 4px;
            margin-left: 2px;
            border-radius: 3px;
            transition: all 0.15s ease;
        }

        .aimd-ref-jump:hover {
            background: var(--aimd-green-700);
            color: white;
        }

        .aimd-ref-var {
            position: relative; /* Required for tooltip positioning */
            display: inline-flex;
            align-items: center;
            gap: 2px;
            padding: 2px 6px;
            margin: 2px 4px;
            background-color: rgba(22, 101, 52, 0.08);
            color: var(--aimd-green-800);
            border-radius: 2px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.9em;
            font-weight: 600;
            border-bottom: 2px solid var(--aimd-green-500);
            vertical-align: baseline;
            line-height: 1.4;
        }

        .aimd-ref-var-text {
            /* 变量文本不可点击 */
        }

        .aimd-ref-var:hover {
            background-color: rgba(22, 101, 52, 0.12);
        }
        
        .aimd-unknown-tag {
            display: inline-block;
            padding: 2px 6px;
            background-color: var(--aimd-slate-100);
            color: var(--aimd-slate-500);
            border: 1px dashed var(--aimd-slate-300);
            border-radius: 4px;
            font-size: 0.8em;
        }

        /* 跳转高亮动画 */
        @keyframes highlight-flash {
            0%, 100% { box-shadow: none; }
            25%, 75% { box-shadow: 0 0 0 3px var(--aimd-green-500); }
            50% { box-shadow: 0 0 0 5px var(--aimd-green-500); }
        }

        .aimd-highlight-flash {
            animation: highlight-flash 1.5s ease-in-out;
        }

        .aimd-step-container.aimd-highlight-flash {
            animation: highlight-flash 1.5s ease-in-out;
        }

        .aimd-var-input.aimd-highlight-flash {
            animation: highlight-flash 1.5s ease-in-out;
            border-bottom-color: var(--aimd-green-700) !important;
        }


        /* ============================================
           Inline Check Components (Pure CSS)
           ============================================ */
        .aimd-check-pill {
            display: inline-flex;
            align-items: center;
            margin: 8px 4px;
            padding: 8px 16px;
            background: var(--aimd-bg-secondary);
            border: 1px solid var(--aimd-card-border);
            border-radius: 999px;
            cursor: pointer;
            user-select: none;
            transition: all 0.2s ease;
        }

        .aimd-check-pill:hover {
            border-color: var(--aimd-teal-500);
        }

        /* 隐藏原生 checkbox 但保持可交互 */
        .aimd-check-input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* 自定义 checkbox 外框 */
        .aimd-check-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            border: 2px solid var(--aimd-slate-400);
            border-radius: 4px;
            margin-right: 10px;
            transition: all 0.2s ease;
        }

        .aimd-check-box svg {
            width: 10px;
            height: 10px;
            color: white;
            opacity: 0;
            transition: opacity 0.15s ease;
        }

        /* 选中状态 - 使用 :has() */
        .aimd-check-pill:has(.aimd-check-input:checked) .aimd-check-box {
            background: var(--aimd-teal-500);
            border-color: var(--aimd-teal-500);
        }

        .aimd-check-pill:has(.aimd-check-input:checked) .aimd-check-box svg {
            opacity: 1;
        }

        /* 内容区域 */
        .aimd-check-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .aimd-check-name {
            font-size: 14px;
            font-weight: 500;
            color: var(--aimd-text-secondary);
            transition: all 0.2s ease;
        }

        .aimd-check-pill:hover .aimd-check-name {
            color: var(--aimd-teal-500);
        }

        /* 选中时文字变化 */
        .aimd-check-pill:has(.aimd-check-input:checked) .aimd-check-name {
            color: var(--aimd-teal-500);
            text-decoration: line-through;
            opacity: 0.7;
        }

        /* checked_message 默认隐藏 */
        .aimd-check-msg {
            display: none;
            font-size: 12px;
            font-weight: 500;
            color: var(--aimd-teal-500);
            background: var(--aimd-teal-50);
            padding: 2px 8px;
            border-radius: 999px;
            animation: aimd-fade-in 0.2s ease-out;
        }

        /* 选中时显示 message */
        .aimd-check-pill:has(.aimd-check-input:checked) .aimd-check-msg {
            display: inline-block;
        }

        @keyframes aimd-fade-in {
            from { opacity: 0; transform: translateX(-4px); }
            to { opacity: 1; transform: translateX(0); }
        }

        /* Body Area */
        .aimd-step-body {
            padding: 16px 20px 20px 20px;
            color: var(--aimd-text-secondary);
            font-size: 14px;
            line-height: 1.6;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative; /* Ensure body content is above header shadows/layers */
            z-index: 5;
            overflow: visible; /* Allow tooltips to overflow */
        }
        
        /* Collapsed State */
        .aimd-step-container[data-collapsed="true"] .aimd-step-body {
            display: none;
        }
        
        .aimd-step-container[data-collapsed="true"] .aimd-chevron {
            transform: rotate(-90deg);
        }

        .aimd-chevron {
            color: var(--aimd-slate-400);
            transition: transform 0.2s;
        }

        /* ============================================
           Hierarchy / Tree Support
           ============================================ */
        
        /* Step Container Spacing */
        .aimd-step-container {
            margin-bottom: 12px;
        }
        
        .aimd-step-container:last-child {
            margin-bottom: 0;
        }
        
        /* Indentation Levels */
        .aimd-step-level-2 { margin-left: 40px; }
        .aimd-step-level-3 { margin-left: 80px; }
        
        /* Hierarchy Connectors (Hidden as per user request) */
        .aimd-step-level-2::after, .aimd-step-level-3::after {
            display: none;
        }
        
        /* The vertical extension from Previous Sibling down to this one */
        /* This is tricky in CSS alone without strict parent wrapping. 
           We rely on the renderer to create a visually continuous line 
           OR we use the 'mask' trick from ProFlow if structure permits. */
           
        /* ProFlow Mask Trick for 'Last Child' to cut off the parent line */

        /* ============================================
           Callouts / GFM Alerts
           ============================================ */
        .aimd-callout {
            margin: 1.5em 0;
            padding: 16px 20px;
            border-radius: 6px;
            border-left: 4px solid;
            background-color: rgba(128, 128, 128, 0.1);
            position: relative;
        }

        .aimd-callout p {
            margin: 0.5em 0;
        }
        
        .aimd-callout p:first-child {
            margin-top: 0;
        }
        
        .aimd-callout p:last-child {
            margin-bottom: 0;
        }

        /* TIP / SUCCESS */
        .aimd-callout-tip {
            background-color: rgba(20, 184, 166, 0.1); /* Teal tint */
            border-left-color: var(--aimd-teal-500);
            color: var(--aimd-teal-600);
        }
        .aimd-callout-tip strong { color: var(--aimd-teal-600); }

        /* NOTE / INFO */
        .aimd-callout-note {
            background-color: rgba(59, 130, 246, 0.1); /* Blue tint */
            border-left-color: #3b82f6;
            color: #2563eb;
        }
        .aimd-callout-note strong { color: #2563eb; }

        /* WARNING / IMPORTANT */
        .aimd-callout-warning, .aimd-callout-important {
            background-color: rgba(245, 158, 11, 0.1); /* Amber tint */
            border-left-color: #f59e0b;
            color: #d97706;
        }
        .aimd-callout-warning strong { color: #d97706; }

        /* CAUTION / DANGER */
        .aimd-callout-caution, .aimd-callout-danger {
            background-color: rgba(220, 38, 38, 0.1); /* Red tint */
            border-left-color: #dc2626;
            color: #b91c1c;
        }
        .aimd-callout-caution strong { color: #b91c1c; }

        /* ============================================
           Floating Toolbar - Segmented Ring Dial
           ============================================ */
        .aimd-toolbar {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 1000;
        }

        .aimd-ring-dial {
            width: 64px;
            height: 64px;
            position: relative;
            cursor: pointer;
            background: #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .aimd-ring-dial:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .aimd-ring-dial:active {
            transform: scale(0.98);
        }

        /* SVG Ring */
        .dial-ring {
            width: 100%;
            height: 100%;
            transform: rotate(-90deg); /* Start from top */
        }

        .dial-bg {
            stroke: var(--aimd-slate-200);
        }

        .dial-segment {
            stroke: var(--aimd-green-500);
            stroke-linecap: round;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
        }

        /* Mode-specific segment rotation */
        .dial-segment[data-mode="0"] { transform: rotate(0deg); }
        .dial-segment[data-mode="1"] { transform: rotate(90deg); }
        .dial-segment[data-mode="2"] { transform: rotate(180deg); }
        .dial-segment[data-mode="3"] { transform: rotate(270deg); }

        /* Center label */
        .dial-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            pointer-events: none;
        }

        .dial-letter {
            font-size: 18px;
            font-weight: 700;
            color: var(--aimd-green-700);
            line-height: 1;
            transition: all 0.3s ease;
        }

        .dial-label {
            font-size: 8px;
            font-weight: 500;
            color: var(--aimd-slate-500);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 2px;
            transition: all 0.3s ease;
        }

        /* Segment labels around the ring */
        .dial-labels {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }

        .dial-seg-label {
            position: absolute;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 600;
            color: var(--aimd-slate-400);
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .dial-seg-label.active {
            color: var(--aimd-green-600);
            background: var(--aimd-green-50);
            transform: scale(1.1);
        }

        /* Position labels at cardinal directions */
        .seg-0 { top: 2px; left: 50%; transform: translateX(-50%); }     /* Top - Name */
        .seg-1 { right: 2px; top: 50%; transform: translateY(-50%); }   /* Right - Value */
        .seg-2 { bottom: 2px; left: 50%; transform: translateX(-50%); } /* Bottom - Title */
        .seg-3 { left: 2px; top: 50%; transform: translateY(-50%); }    /* Left - Type */

        .seg-0.active { transform: translateX(-50%) scale(1.1); }
        .seg-1.active { transform: translateY(-50%) scale(1.1); }
        .seg-2.active { transform: translateX(-50%) scale(1.1); }
        .seg-3.active { transform: translateY(-50%) scale(1.1); }

        /* Mode colors */
        .aimd-ring-dial[data-mode="0"] .dial-segment { stroke: var(--aimd-green-500); }
        .aimd-ring-dial[data-mode="1"] .dial-segment { stroke: #6366f1; } /* Indigo */
        .aimd-ring-dial[data-mode="2"] .dial-segment { stroke: #f59e0b; } /* Amber */
        .aimd-ring-dial[data-mode="3"] .dial-segment { stroke: #8b5cf6; } /* Purple */

        .aimd-ring-dial[data-mode="0"] .dial-letter { color: var(--aimd-green-700); }
        .aimd-ring-dial[data-mode="1"] .dial-letter { color: #4f46e5; }
        .aimd-ring-dial[data-mode="2"] .dial-letter { color: #d97706; }
        .aimd-ring-dial[data-mode="3"] .dial-letter { color: #7c3aed; }

        /* CAUTION / ERROR */
        .aimd-callout-caution {
            background-color: rgba(239, 68, 68, 0.1); /* Red tint */
            border-left-color: #ef4444;
            color: #dc2626;
        }
        .aimd-callout-caution strong { color: #dc2626; }
        
        /* Add icons to callouts (simple CSS generated) */
        .aimd-callout-tip::before { content: '💡'; float: left; margin-right: 0.5em; }
        .aimd-callout-note::before { content: 'ℹ️'; float: left; margin-right: 0.5em; }
        .aimd-callout-warning::before { content: '⚠️'; float: left; margin-right: 0.5em; }
        .aimd-callout-caution::before { content: '🛑'; float: left; margin-right: 0.5em; }

        /* EXAMPLE - 紫色/薰衣草 */
        .aimd-callout-example {
            background-color: rgba(139, 92, 246, 0.1);
            border-left-color: #8b5cf6;
            color: #7c3aed;
        }
        .aimd-callout-example strong { color: #7c3aed; }
        .aimd-callout-example::before { content: '📝'; float: left; margin-right: 0.5em; }

        /* ABSTRACT / SUMMARY - 青色 */
        .aimd-callout-abstract {
            background-color: rgba(6, 182, 212, 0.1);
            border-left-color: #06b6d4;
            color: #0891b2;
        }
        .aimd-callout-abstract strong { color: #0891b2; }
        .aimd-callout-abstract::before { content: '📋'; float: left; margin-right: 0.5em; }

        /* INFO - 青蓝色 */
        .aimd-callout-info {
            background-color: rgba(59, 130, 246, 0.1);
            border-left-color: #3b82f6;
            color: #2563eb;
        }
        .aimd-callout-info strong { color: #2563eb; }
        .aimd-callout-info::before { content: '📌'; float: left; margin-right: 0.5em; }

        /* SUCCESS - 绿色 */
        .aimd-callout-success {
            background-color: rgba(34, 197, 94, 0.1);
            border-left-color: #22c55e;
            color: #16a34a;
        }
        .aimd-callout-success strong { color: #16a34a; }
        .aimd-callout-success::before { content: '✅'; float: left; margin-right: 0.5em; }

        /* DANGER - 深红色 */
        .aimd-callout-danger {
            background-color: rgba(220, 38, 38, 0.1);
            border-left-color: #dc2626;
            color: #b91c1c;
        }
        .aimd-callout-danger strong { color: #b91c1c; }
        .aimd-callout-danger::before { content: '⚡'; float: left; margin-right: 0.5em; }

        /* BUG - 红橙色 */
        .aimd-callout-bug {
            background-color: rgba(234, 88, 12, 0.1);
            border-left-color: #ea580c;
            color: #c2410c;
        }
        .aimd-callout-bug strong { color: #c2410c; }
        .aimd-callout-bug::before { content: '🐛'; float: left; margin-right: 0.5em; }

        /* QUOTE - 灰色 */
        .aimd-callout-quote {
            background-color: rgba(107, 114, 128, 0.1);
            border-left-color: #6b7280;
            color: #4b5563;
        }
        .aimd-callout-quote strong { color: #4b5563; }
        .aimd-callout-quote::before { content: '💬'; float: left; margin-right: 0.5em; }


        /* ============================================
           Markdown Styling (Restore after Tailwind Reset)
           ============================================ */
        /* ... Adjusted for new Typography ... */
        .aimd-step-body h1, .aimd-preamble h1 { font-size: 1.8em; border-bottom: 1px solid var(--aimd-slate-200); padding-bottom: 0.3em; margin-top: 1.2em; }
        .aimd-step-body h2, .aimd-preamble h2 { font-size: 1.5em; margin-top: 1.2em; font-weight: 700; color: var(--aimd-text-primary); }
        .aimd-step-body p, .aimd-preamble p { margin-bottom: 1.2em; line-height: 1.7; }
        
        .aimd-step-body code, .aimd-preamble code {
            font-family: 'Fira Code', monospace;
            background-color: rgba(0,0,0,0.05);
            padding: 0.2em 0.4em;
            border-radius: 4px;
            font-size: 0.9em;
        }

    `;
}
//# sourceMappingURL=component-styles.js.map