/**
 * Responsive and Card Mode Styles
 * 
 * Styles for responsive table card mode (<650px) and other adaptive layouts.
 */

export function getResponsiveStyles(): string {
    return `
        /* ============================================
           Responsive Hybrid View: Card Mode (<650px)
           ============================================ */
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
                display: none;
            }
            
            .aimd-var-table tbody {
                display: block;
            }

            /* Card Container - Adaptive Grid Layout */
            .aimd-var-table-row {
                display: grid !important;
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

            /* Card Header (Title + Description) */
            .aimd-card-header-td {
                grid-column: 1 / -1;
                position: relative !important;
                order: -1;
                padding: 12px 16px !important;
                padding-right: 44px !important;
                border-bottom: 1px solid var(--aimd-border) !important;
                background: rgba(0,0,0,0.04) !important;
                display: block !important;
                height: auto !important;
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

            /* Data Cells (Key-Value Pairs) */
            .aimd-table-td {
                display: flex !important;
                flex-direction: column !important;
                gap: 4px;
                padding: 0 16px;
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

            /* Delete Button */
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
                grid-column: auto;
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
    `;
}
