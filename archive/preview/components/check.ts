/**
 * Check Component
 * 
 * Renders check type as inline checkbox pill.
 */

import type { VariableMatch } from '../types';
import { formatVariableName, parseTypedParams } from './shared/format';

/**
 * Render check type as inline checkbox component
 */
export function renderCheckComponent(
    variable: VariableMatch,
    description?: string
): string {
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
