/**
 * Rich Tooltip Component
 * 
 * Shared tooltip helper for variable components.
 */

import type { ParsedParams } from '../../types';

/**
 * Render a rich tooltip with variable metadata
 * NOTE: We intentionally keep the HTML on a single line to prevent 
 * whitespace text nodes from affecting inline layout.
 */
export function renderRichTooltip(
    displayName: string,
    escapedName: string,
    type: string,
    params: ParsedParams
): string {
    const description = params.description || '';

    // Build constraints list
    const constraints: string[] = [];
    if (params.ge !== undefined) constraints.push(`≥ ${params.ge}`);
    if (params.gt !== undefined) constraints.push(`> ${params.gt}`);
    if (params.le !== undefined) constraints.push(`≤ ${params.le}`);
    if (params.lt !== undefined) constraints.push(`< ${params.lt}`);
    if (params.max_length) constraints.push(`Max len: ${params.max_length}`);
    if (params.min_length) constraints.push(`Min len: ${params.min_length}`);

    const constraintsHtml = constraints.length > 0
        ? `<span class="aimd-tooltip-constraints">${constraints.join(' | ')}</span>`
        : '';

    const descHtml = description
        ? `<span class="aimd-tooltip-desc">${description}</span>`
        : '';

    // Single-line HTML to prevent whitespace issues with inline-block layout
    // Changed div to span to allow nesting inside p tags
    return `<span class="aimd-var-tooltip"><span class="aimd-tooltip-header"><span class="aimd-tooltip-title">${escapedName}</span><span class="aimd-tooltip-type">${type}</span></span><span class="aimd-tooltip-meta"><span class="aimd-tooltip-display">${displayName}</span>${descHtml}${constraintsHtml}</span></span>`;
}

