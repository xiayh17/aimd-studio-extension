/**
 * Miscellaneous Component Styles
 * 
 * Styles for reference tags, check pills, animations, and other components.
 */

export function getMiscStyles(): string {
    return `
        /* ============================================
           Reference Tags (Elsevier Style)
           ============================================ */
        .aimd-ref-step {
            position: relative;
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
            position: relative;
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

        .aimd-check-input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }

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

        .aimd-check-pill:has(.aimd-check-input:checked) .aimd-check-box {
            background: var(--aimd-teal-500);
            border-color: var(--aimd-teal-500);
        }

        .aimd-check-pill:has(.aimd-check-input:checked) .aimd-check-box svg {
            opacity: 1;
        }

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

        .aimd-check-pill:has(.aimd-check-input:checked) .aimd-check-name {
            color: var(--aimd-teal-500);
            text-decoration: line-through;
            opacity: 0.7;
        }

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

        .aimd-check-pill:has(.aimd-check-input:checked) .aimd-check-msg {
            display: inline-block;
        }

        /* ============================================
           Animations
           ============================================ */
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

        @keyframes aimd-fade-in {
            from { opacity: 0; transform: translateX(-4px); }
            to { opacity: 1; transform: translateX(0); }
        }

        /* ============================================
           Legacy Variable Styles (for compatibility)
           ============================================ */
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

        .aimd-variable:hover {
            transform: translateY(-1px);
        }

        .aimd-variable-interactive {
            cursor: grab;
            user-select: none;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            contain: layout style paint;
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
            will-change: transform, left, top;
        }

        .aimd-variable-clicked {
            transform: scale(0.92);
            transition: transform 0.15s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .aimd-variable-returning {
            pointer-events: none;
            z-index: 9999 !important;
            will-change: transform, left, top;
        }

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

        /* Right-click menu */
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
    `;
}
