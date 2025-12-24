/**
 * Reference Components
 * 
 * Renders ref_step and ref_var types for cross-referencing.
 */

import type { VariableMatch } from '../types';
import { formatVariableName, parseTypedParams } from './shared/format';
import { renderRichTooltip } from './shared/tooltip';

/**
 * Render ref_step type as step reference link with jump arrow
 */
export function renderRefStepComponent(variable: VariableMatch): string {
    const params = parseTypedParams(variable.params || '');
    const displayName = params.title || formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const description = params.description || `Reference to step: ${displayName}`;

    const tooltipParams = { ...params, description };
    const tooltipHtml = renderRichTooltip(displayName, escapedName, 'step-ref', tooltipParams);

    // Single-line HTML to prevent whitespace issues with inline-block layout
    return `<span class="aimd-ref-step aimd-var-wrapper"><span class="aimd-ref-text">Step: ${displayName}</span><span class="aimd-ref-icon aimd-ref-jump" data-target-step="${escapedName}" title="点击跳转到 ${displayName}" role="button" tabindex="0">↗</span>${tooltipHtml}</span>`;
}

/**
 * Render ref_var type as variable reference with jump arrow
 */
export function renderRefVarComponent(variable: VariableMatch): string {
    const params = parseTypedParams(variable.params || '');
    const displayName = params.title || formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const description = params.description || `Reference to variable: ${displayName}`;

    const tooltipParams = { ...params, description };
    const tooltipHtml = renderRichTooltip(displayName, escapedName, 'var-ref', tooltipParams);

    // Single-line HTML to prevent whitespace issues with inline-block layout
    return `<span class="aimd-ref-var aimd-var-wrapper"><span class="aimd-ref-var-text">${displayName}</span><span class="aimd-ref-icon aimd-ref-jump" data-target-var="${escapedName}" title="点击跳转到 ${displayName}" role="button" tabindex="0">↗</span>${tooltipHtml}</span>`;
}

