/**
 * Step Component
 * 
 * Renders step type as timeline marker for DOM restructuring.
 */

import type { VariableMatch } from '../types';
import { formatVariableName, parseTypedParams } from './shared/format';

/**
 * Render step type as timeline marker node
 * This creates a marker that will be processed by the renderer for DOM restructuring
 */
export function renderStepComponent(
    variable: VariableMatch,
    stepIndex: number,
    isLast: boolean
): string {
    const displayName = formatVariableName(variable.name);
    const escapedName = variable.name.replace(/"/g, '&quot;');
    const escapedFullMatch = variable.fullMatch.replace(/"/g, '&quot;');
    const params = parseTypedParams(variable.params || '');
    const stepNumber = params.step || stepIndex + 1;

    // Get level (default is 1)
    const level = params.level || 1;

    // Check if this step has a checkbox
    const hasCheck = params.check === true;
    const checkedMessage = params.checked_message || '';

    // Get Chinese title if available
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
