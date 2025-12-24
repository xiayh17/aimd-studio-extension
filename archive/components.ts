/**
 * 组件渲染模块
 * 将不同类型的模板变量渲染为对应的UI组件
 */

interface VariableMatch {
    fullMatch: string;
    type: string;
    name: string;
    params?: string;
}

/**
 * 将变量名转换为友好显示格式
 */
function formatVariableName(name: string): string {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * 解析变量参数
 * 支持格式：
 *   - "name" -> { name: "name" }
 *   - "name, 2" -> { name: "name", level: 2 }
 *   - "name, 2, check=True" -> { name: "name", level: 2, check: true }
 *   - "name, check=True" -> { name: "name", check: true }
 */
/**
 * 解析带类型的变量参数
 * 支持格式：name: type = default, key=value, ...
 */
function parseTypedParams(params: string): { [key: string]: any } {
    const result: { [key: string]: any } = {};
    if (!params) return result;

    // 1. Robust split that respects brackets and quotes
    const parts: string[] = [];
    let currentPart = '';
    let bracketLevel = 0;
    let inQuotes: string | null = null;

    for (let i = 0; i < params.length; i++) {
        const char = params[i];
        if (char === '"' || char === "'") {
            if (inQuotes === char) inQuotes = null;
            else if (!inQuotes) inQuotes = char;
        }

        if (!inQuotes) {
            if (char === '[') bracketLevel++;
            else if (char === ']') bracketLevel--;
        }

        if (char === ',' && bracketLevel === 0 && !inQuotes) {
            parts.push(currentPart.trim());
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    if (currentPart.trim()) parts.push(currentPart.trim());

    if (parts.length > 0) {
        const firstPart = parts[0];

        // 解析 "name: type = default" 模式
        const match = firstPart.match(/^([^:=]+)(?::\s*([^=]+))?(?:=\s*(.+))?$/);

        if (match) {
            if (match[2]) result.type = match[2].trim();
            if (match[3]) {
                let defaultVal = match[3].trim();
                // 去除可能包围的引号
                if ((defaultVal.startsWith('"') && defaultVal.endsWith('"')) ||
                    (defaultVal.startsWith("'") && defaultVal.endsWith("'"))) {
                    defaultVal = defaultVal.slice(1, -1);
                }
                result.default = defaultVal;
            }
        }
    }

    // 解析后续的 key=value
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        // Match key=value, where value can be quoted or bracketed or just string
        const kvMatch = part.match(/^(\w+)\s*=\s*([\s\S]*)$/);
        if (kvMatch) {
            const key = kvMatch[1];
            let value: any = kvMatch[2].trim();

            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            } else if (value === 'True' || value === 'true') {
                value = true;
            } else if (value === 'False' || value === 'false') {
                value = false;
            } else if (value.startsWith('[') && value.endsWith(']')) {
                // Keep the brackets for subvars, or strip them? 
                // Let's strip them here to make it cleaner for subvars
                value = value.slice(1, -1).trim();
            }

            result[key] = value;
        } else {
            // Positional level check
            const numMatch = part.match(/^\d+$/);
            if (numMatch && i === 1) {
                result.level = parseInt(part, 10);
            }
        }
    }

    return result;
}

// --- Helper for Rich Tooltips ---
function renderRichTooltip(
    displayName: string,
    escapedName: string,
    type: string,
    params: { [key: string]: any }
): string {
    const description = params.description || '';

    // 构建约束列表
    const constraints: string[] = [];
    if (params.ge !== undefined) constraints.push(`≥ ${params.ge}`);
    if (params.gt !== undefined) constraints.push(`> ${params.gt}`);
    if (params.le !== undefined) constraints.push(`≤ ${params.le}`);
    if (params.lt !== undefined) constraints.push(`< ${params.lt}`);
    if (params.max_length) constraints.push(`Max len: ${params.max_length}`);
    if (params.min_length) constraints.push(`Min len: ${params.min_length}`);

    const constraintsHtml = constraints.length > 0
        ? `<div class="aimd-tooltip-constraints">${constraints.join(' | ')}</div>`
        : '';

    const descHtml = description
        ? `<div class="aimd-tooltip-desc">${description}</div>`
        : '';

    return `
        <div class="aimd-var-tooltip">
            <div class="aimd-tooltip-header">
                <span class="aimd-tooltip-title">${escapedName}</span>
                <span class="aimd-tooltip-type">${type}</span>
            </div>
            <div class="aimd-tooltip-meta">
                <div class="aimd-tooltip-display">${displayName}</div>
                ${descHtml}
                ${constraintsHtml}
            </div>
        </div>
    `;
}

/**
 * 渲染 var 类型为行内输入框组件（Mad Libs 风格 + Rich Tooltip）
 */
export function renderVarComponent(variable: VariableMatch): string {
    const params = parseTypedParams(variable.params || '');
    const displayName = params.title || formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const escapedFullMatch = variable.fullMatch.replace(/"/g, '&quot;');
    const varType = params.type || 'str';
    const defaultValue = params.default !== undefined ? params.default : '';
    const description = params.description || '';

    // Pass params for common tooltip
    const tooltipParams = { ...params, description };
    const tooltipHtml = renderRichTooltip(displayName, escapedName, varType, tooltipParams);

    return `
        <span class="aimd-var-wrapper">
            <input 
                type="text" 
                class="aimd-var-input" 
                data-variable-name="${escapedName}"
                data-variable-type="var"
                data-var-type="${varType}"
                data-variable-full="${escapedFullMatch}"
                data-default-value="${defaultValue}"
                placeholder="${displayName}"
                value="${defaultValue}"
                readonly
            />
            
            ${tooltipHtml}
        </span>
    `;
}

/**
 * 渲染 step 类型为时间轴节点
 */
export function renderStepComponent(variable: VariableMatch, stepIndex: number, isLast: boolean): string {
    const displayName = formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const escapedFullMatch = variable.fullMatch.replace(/"/g, '&quot;');
    const params = parseTypedParams(variable.params || '');
    const stepNumber = params.step || stepIndex + 1;

    // 获取层级（默认为 1）
    const level = params.level || 1;

    // 是否启用检查功能
    const hasCheck = params.check === true;
    const checkedMessage = params.checked_message || '';

    // 获取中文标题（如果有）
    const cnTitle = params.cn_title || '';
    const cnTitleAttr = cnTitle ? `data-cn-title="${cnTitle.replace(/"/g, '&quot;')}"` : '';

    return `<div class="aimd-step-marker" 
                data-variable-name="${escapedName}"
                data-variable-type="step"
                data-variable-full="${escapedFullMatch}"
                data-step-index="${stepIndex}"
                data-step-number="${stepNumber}"
                data-display-name="${displayName}"
                data-level="${level}"
                data-has-check="${hasCheck}"
                data-checked-message="${checkedMessage.replace(/"/g, '&quot;')}"
                ${cnTitleAttr}
                data-is-last="${isLast}"></div>`;
}

/**
 * 渲染 check 类型为行内复选框组件
 */
export function renderCheckComponent(variable: VariableMatch, description?: string): string {
    const displayName = formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const escapedFullMatch = variable.fullMatch.replace(/"/g, '&quot;');
    const params = parseTypedParams(variable.params || '');
    const checkedMessage = params.checked_message || '';

    return `
        <label class="aimd-check-pill">
            <input type="checkbox" class="aimd-check-input"
                data-variable-name="${escapedName}"
                data-variable-type="check"
                data-variable-full="${escapedFullMatch}"
            />
            <span class="aimd-check-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </span>
            <span class="aimd-check-content">
                <span class="aimd-check-name">${displayName}</span>
                ${checkedMessage ? `<span class="aimd-check-msg">${checkedMessage}</span>` : ''}
            </span>
        </label>
    `;
}

/**
 * 渲染 var_table 类型为表格组件
 */
export function renderVarTableComponent(variable: VariableMatch): string {
    const displayName = formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const escapedFullMatch = variable.fullMatch.replace(/"/g, '&quot;');
    const params = parseTypedParams(variable.params || '');

    // 解析 subvars，同时提取类型信息和默认值
    interface ColumnDef {
        id: string;      // 变量 ID (e.g. concentration)
        title: string;   // 显示标题 (e.g. 药物浓度)
        type: string;    // 类型 (e.g. float)
        default: string; // 默认值
        description: string;
    }
    let columns: ColumnDef[] = [];

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
                // Extract original name (first part before any punctuation)
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
        }).filter((c: ColumnDef | null): c is ColumnDef => c !== null);
    }

    // 如果没有指定列，使用默认列
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

    // Extra header for actions (Delete row)
    const actionHeader = `<th class="aimd-table-th aimd-table-actions-th"></th>`;

    // Generate Body (Initial empty row or default rows)
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

    // Extra cell for actions (Delete row) - will be at the END now
    const actionCell = `
        <td class="aimd-table-td aimd-table-actions-td">
            <button class="aimd-btn-icon aimd-row-delete-btn" title="Delete Row">✕</button>
        </td>
    `;

    // Card header cell (hidden in table mode, shown in card mode)
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

    // Determine density based on column count
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

/**
 * 渲染 ref_step 类型为步骤引用链接（箭头可点击跳转）
 */
export function renderRefStepComponent(variable: VariableMatch): string {
    const params = parseTypedParams(variable.params || '');
    const displayName = params.title || formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const description = params.description || `Reference to step: ${displayName}`;

    // Pass enhanced params to tooltip helper
    const tooltipParams = { ...params, description };
    const tooltipHtml = renderRichTooltip(displayName, escapedName, 'step-ref', tooltipParams);

    return `
        <span class="aimd-ref-step aimd-var-wrapper">
            <span class="aimd-ref-text">Step: ${displayName}</span>
            <span class="aimd-ref-icon aimd-ref-jump" 
                  data-target-step="${escapedName}"
                  title="点击跳转到 ${displayName}"
                  role="button"
                  tabindex="0">↗</span>
            ${tooltipHtml}
        </span>
    `;
}

/**
 * 渲染 ref_var 类型为变量引用高亮（箭头可点击跳转）
 */
export function renderRefVarComponent(variable: VariableMatch): string {
    const params = parseTypedParams(variable.params || '');
    const displayName = params.title || formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const description = params.description || `Reference to variable: ${displayName}`;

    const tooltipParams = { ...params, description };
    const tooltipHtml = renderRichTooltip(displayName, escapedName, 'var-ref', tooltipParams);

    return `
        <span class="aimd-ref-var aimd-var-wrapper">
            <span class="aimd-ref-var-text">${displayName}</span>
            <span class="aimd-ref-icon aimd-ref-jump" 
                  data-target-var="${escapedName}"
                  title="点击跳转到 ${displayName}"
                  role="button"
                  tabindex="0">↗</span>
            ${tooltipHtml}
        </span>
    `;
}

/**
 * 根据变量类型渲染对应的组件
 */
export function renderVariableComponent(
    variable: VariableMatch,
    context?: { stepIndex?: number; isLast?: boolean; description?: string }
): string {
    switch (variable.type) {
        case 'var':
            return renderVarComponent(variable);
        case 'step':
            return renderStepComponent(
                variable,
                context?.stepIndex || 0,
                context?.isLast || false
            );
        case 'check':
            return renderCheckComponent(variable, context?.description);
        case 'var_table':
            return renderVarTableComponent(variable);
        case 'ref_step':
            return renderRefStepComponent(variable);
        case 'ref_var':
            return renderRefVarComponent(variable);
        default:
            // 默认渲染为未识别标签
            const displayName = formatVariableName(variable.name);
            return `<span class="aimd-unknown-tag" title="Unknown tag type: ${variable.type}">[? ${variable.type}: ${displayName}]</span>`;
    }
}
