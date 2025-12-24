/**
 * Table Component Styles
 * 
 * Styles for var_table component including headers, cells, sticky columns,
 * and card mode responsive layout.
 */

export function getTableStyles(): string {
    return `
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

        /* Custom Scrollbar */
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
            border-collapse: separate;
            border-spacing: 0;
            min-width: 600px;
        }

        /* Sticky Header */
        .aimd-var-table thead {
            position: sticky;
            top: 0;
            z-index: 25;
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

        .aimd-th-text {
            flex: 1;
        }

        .aimd-th-type {
            font-family: 'JetBrains Mono', monospace;
            font-size: 8px;
            opacity: 0.5;
            font-weight: 400;
        }

        /* Action Column */
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

        /* Sticky Action Column */
        .aimd-table-actions-th,
        .aimd-table-actions-td {
            position: sticky;
            left: 0;
            z-index: 25;
            background-color: var(--aimd-code-bg);
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

        /* Table Cells */
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
        
        .aimd-var-table-row:focus-within {
            background-color: rgba(22, 103, 52, 0.04);
        }

        /* Cell Input Styling */
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

        .aimd-cell-input-primary {
            font-weight: 700;
            color: var(--aimd-green-800);
        }
        
        body.vscode-dark .aimd-cell-input-primary {
            color: var(--aimd-green-500);
        }

        /* Drag Handle */
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
    `;
}
