/**
 * Variable Input Component
 * 
 * Renders var type as inline input with rich tooltip.
 */

import type { VariableMatch } from '../types';
import { formatVariableName, parseTypedParams } from './shared/format';
import { renderRichTooltip } from './shared/tooltip';

/**
 * Render var type as inline input component (Mad Libs style + Rich Tooltip)
 */
export function renderVarComponent(variable: VariableMatch): string {
    const params = parseTypedParams(variable.params || '');
    const displayName = params.title || formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const escapedFullMatch = variable.fullMatch.replace(/"/g, '&quot;');
    const varType = params.type || 'str';
    const defaultValue = params.default !== undefined ? params.default : '';
    const description = params.description || '';

    // Build tooltip
    const tooltipParams = { ...params, description };
    const tooltipHtml = renderRichTooltip(displayName, escapedName, varType, tooltipParams);

    // Single-line HTML to prevent whitespace issues with inline-block layout
    return `<span class="aimd-var-wrapper"><input type="text" class="aimd-var-input" data-variable-name="${escapedName}" data-variable-type="var" data-var-type="${varType}" data-variable-full="${escapedFullMatch}" data-default-value="${defaultValue}" placeholder="${displayName}" value="${defaultValue}" readonly />${tooltipHtml}</span>`;
}

