/**
 * Table Component
 * 
 * Renders var_table type as editable table component.
 */

import type { VariableMatch, TableColumnDef } from '../types';
import { formatVariableName, parseTypedParams } from './shared/format';

/**
 * Render var_table type as table component
 */
export function renderVarTableComponent(variable: VariableMatch): string {
    const displayName = formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const escapedFullMatch = variable.fullMatch.replace(/"/g, '&quot;');
    const params = parseTypedParams(variable.params || '');

    // Parse subvars to extract column definitions
    let columns: TableColumnDef[] = [];

    if (params.subvars) {
        // Robust split of subvars by comma, respecting nested () and []
        const subvarParts: string[] = [];
        let currentPart = '';
        let parenLevel = 0;
        let bLevel = 0;
        let inQ: string | null = null;

        const subvarsStr = params.subvars as string;
        for (let i = 0; i < subvarsStr.length; i++) {
            const char = subvarsStr[i];
            if (char === '"' || char === "'") {
                if (inQ === char) inQ = null;
                else if (!inQ) inQ = char;
            }
            if (!inQ) {
                if (char === '(') parenLevel++;
                else if (char === ')') parenLevel--;
                else if (char === '[') bLevel++;
                else if (char === ']') bLevel--;
            }
            if (char === ',' && parenLevel === 0 && bLevel === 0 && !inQ) {
                subvarParts.push(currentPart.trim());
                currentPart = '';
            } else {
                currentPart += char;
            }
        }
        if (currentPart.trim()) subvarParts.push(currentPart.trim());

        columns = subvarParts.map((part: string) => {
            // Check if it's "var(...)"
            const varMatch = part.match(/^var\s*\(([\s\S]*)\)$/);
            if (varMatch) {
                const innerParams = parseTypedParams(varMatch[1]);
                const id = varMatch[1].split(/[=,:]/)[0].trim();
                return {
                    id: id,
                    title: innerParams.title || formatVariableName(id),
                    type: innerParams.type || 'str',
                    default: innerParams.default !== undefined ? String(innerParams.default) : '',
                    description: innerParams.description || ''
                };
            } else {
                // Fallback for simple "name: type = default"
                const match = part.match(/^([^:=]+)(?::\s*([^=]+))?(?:=\s*(.+))?$/);
                if (match) {
                    let defaultVal = match[3]?.trim() || '';
                    if ((defaultVal.startsWith('"') && defaultVal.endsWith('"')) ||
                        (defaultVal.startsWith("'") && defaultVal.endsWith("'"))) {
                        defaultVal = defaultVal.slice(1, -1);
                    }
                    return {
                        id: match[1].trim(),
                        title: formatVariableName(match[1].trim()),
                        type: match[2]?.trim() || 'str',
                        default: defaultVal,
                        description: ''
                    };
                }
            }
            return null;
        }).filter((c): c is TableColumnDef => c !== null);
    }

    // Default columns if none specified
    if (columns.length === 0) {
        columns = [
            { id: 'column_1', title: 'Column 1', type: 'str', default: '', description: '' },
            { id: 'column_2', title: 'Column 2', type: 'str', default: '', description: '' },
            { id: 'column_3', title: 'Column 3', type: 'str', default: '', description: '' }
        ];
    }

    // Generate Headers
    const columnHeaders = columns.map((col, index) => {
        const stickyClass = index === 0 ? 'aimd-sticky-col' : '';
        const headerContent = `
            <div class="aimd-th-content" 
                 title="${col.description || col.id}"
                 data-col-id="${col.id}"
                 data-col-title="${col.title}"
                 data-col-type="${col.type}">
                <span class="aimd-th-text">${col.title}</span>
                ${index === 0 ? '<span class="codicon codicon-grabber aimd-drag-handle"></span>' : ''}
                <span class="aimd-th-type">${col.type}</span>
            </div>
        `;
        return `<th class="aimd-table-th aimd-mode-aware-th ${stickyClass}" data-col-index="${index}">${headerContent}</th>`;
    }).join('');

    // Action header
    const actionHeader = `<th class="aimd-table-th aimd-table-actions-th"></th>`;

    // Generate Body
    const rowCells = columns.map((col, index) => {
        const cellVarName = `${escapedName}.${col.id}`;
        const stickyClass = index === 0 ? 'aimd-sticky-col' : '';
        const defaultValue = col.default;

        const inputClass = index === 0 ? 'aimd-cell-input aimd-cell-input-primary' : 'aimd-cell-input';

        const cellContent = `<input type="text" 
                   class="aimd-var-input ${inputClass}" 
                   data-variable-name="${cellVarName}"
                   data-variable-type="var"
                   data-var-id="${col.id}"
                   data-var-title="${col.title}"
                   data-var-type="${col.type}"
                   data-default-value="${defaultValue}"
                   placeholder="${col.title}"
                   value="${defaultValue}"
                   readonly />`;

        return `<td class="aimd-table-td ${stickyClass}" data-col-name="${col.id}" data-col-title="${col.title}">
            ${cellContent}
        </td>`;
    }).join('');

    // Action cell
    const actionCell = `
        <td class="aimd-table-td aimd-table-actions-td">
            <button class="aimd-btn-icon aimd-row-delete-btn" title="Delete Row">✕</button>
        </td>
    `;

    // Card header cell
    const tableTitle = params.title || displayName;
    const tableDesc = params.description || '';
    const cardHeaderCell = `
        <td class="aimd-table-td aimd-card-header-td" 
            data-card-title="${tableTitle}" 
            data-card-desc="${tableDesc}">
            <div class="aimd-card-header-content">
                <span class="aimd-card-title">${tableTitle}</span>
                ${tableDesc ? `<span class="aimd-card-desc">${tableDesc}</span>` : ''}
            </div>
        </td>
    `;

    // Determine density
    const density = columns.length > 3 ? 'compact' : 'normal';

    return `
        <div class="aimd-var-table-wrapper" 
             data-variable-name="${escapedName}"
             data-variable-type="var_table"
             data-variable-full="${escapedFullMatch}"
             data-column-count="${columns.length}"
             data-density="${density}">
            
            <div class="aimd-table-header-bar">
                <div class="aimd-table-title">
                    <span class="codicon codicon-table"></span>
                    <span>${displayName}</span>
                </div>
            </div>

            <div class="aimd-var-table-container custom-scrollbar">
                <table class="aimd-var-table">
                    <thead>
                        <tr><th class="aimd-table-th aimd-card-header-th"></th>${columnHeaders}${actionHeader}</tr>
                    </thead>
                    <tbody>
                        <tr class="aimd-var-table-row">${cardHeaderCell}${rowCells}${actionCell}</tr>
                    </tbody>
                </table>
            </div>
            
            <div class="aimd-table-footer-bar">
                 <div class="aimd-table-meta">1 Row</div>
                 <div class="aimd-table-actions">
                    <button class="aimd-btn-icon" title="Add Row">+ Add Row</button>
                 </div>
            </div>
        </div>
    `;
}
