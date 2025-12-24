/**
 * Step Component Styles
 * 
 * Styles for step containers, badges, headers, timeline, and hierarchy.
 */

export function getStepStyles(): string {
    return `
        /* ============================================
           Step Container & Cards (Scientific Minimalist)
           ============================================ */
        .aimd-step-container {
            margin-bottom: 12px;
        }
        
        .aimd-step-container:last-child {
            margin-bottom: 0;
        }

        /* --- Content Card (Elsevier Style) --- */
        .aimd-step-content {
            flex: 1;
            min-width: 0;
            background-color: var(--aimd-card-bg);
            border: 1px solid var(--aimd-slate-200);
            border-top: 3px solid var(--aimd-green-700);
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: box-shadow 0.2s ease;
            overflow: visible;
            display: flex;
            flex-direction: column;
        }

        .aimd-step-content > :first-child {
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
        }

        .aimd-step-content > :last-child {
            border-bottom-left-radius: 3px;
            border-bottom-right-radius: 3px;
        }

        .aimd-step-content:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.08);
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
            align-items: center;
            cursor: pointer;
            user-select: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        
        /* Header Left: 徽章 + 标题组 */
        .aimd-step-header-left {
            display: flex;
            align-items: center;
            gap: 12px;
            flex: 1;
            min-width: 0;
        }

        /* Step Badge: Elsevier 期刊风格 */
        .aimd-step-badge {
            position: static;
            background: var(--aimd-green-700);
            color: #ffffff;
            border: none;
            min-width: 32px;
            height: 32px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 14px;
            font-weight: 700;
            flex-shrink: 0;
            transition: all 0.2s ease;
        }

        /* Checkable Badge */
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

        /* Body Area */
        .aimd-step-body {
            padding: 16px 20px 20px 20px;
            color: var(--aimd-text-secondary);
            font-size: 14px;
            line-height: 1.6;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            /* NOTE: Do NOT set z-index here - it creates a stacking context
               that prevents tooltips from appearing above adjacent elements */
            overflow: visible;
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

        /* --- Text Card (Scientific Minimalist) --- */
        .aimd-text-card {
            display: block;
            padding: 8px 0;
            background-color: transparent;
            border: none;
            margin-bottom: 24px;
            overflow: visible;
        }

        .aimd-text-card:hover {
            /* Minimal interaction */
        }
        
        .aimd-text-card h1, .aimd-text-card h2 {
            border-bottom: 1px solid var(--aimd-line-color);
            padding-bottom: 8px;
            margin-top: 16px;
            margin-bottom: 20px;
            font-weight: 600;
            letter-spacing: -0.01em;
        }
        
        .aimd-text-card p {
            margin-bottom: 1em;
            line-height: 1.7;
        }
        
        .aimd-text-card p:last-child {
            margin-bottom: 0;
        }

        /* ============================================
           Hierarchy / Tree Support
           ============================================ */
        
        /* Indentation Levels */
        .aimd-step-level-2 { margin-left: 40px; }
        .aimd-step-level-3 { margin-left: 80px; }
        
        /* Hierarchy Connectors (Hidden) */
        .aimd-step-level-2::after, .aimd-step-level-3::after {
            display: none;
        }

        /* Timeline Node (Legacy) */
        .aimd-timeline-node {
            width: var(--aimd-node-size, 32px);
            height: var(--aimd-node-size, 32px);
            border-radius: 50%;
            background-color: var(--vscode-editor-background); 
            border: 1px solid var(--aimd-slate-400);
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

        .aimd-timeline-node[data-checkable="true"] {
            cursor: pointer;
            border-color: var(--aimd-slate-500);
        }
        
        .aimd-timeline-node[data-checkable="true"]:hover {
            transform: scale(1.05);
            color: var(--aimd-teal-500);
            border-color: var(--aimd-teal-500);
        }

        .aimd-timeline-node[data-checked="true"] {
            background-color: transparent;
            color: var(--aimd-teal-500);
            border-color: var(--aimd-teal-500);
            font-weight: bold;
        }
    `;
}
