/**
 * Components Module Index
 * 
 * Central registry for all component renderers.
 * Provides the main renderVariableComponent dispatcher.
 */

import type { VariableMatch, ComponentContext } from '../types';
import { formatVariableName, parseTypedParams } from './shared/format';
import { renderVarComponent } from './var';
import { renderStepComponent } from './step';
import { renderCheckComponent } from './check';
import { renderVarTableComponent } from './table';
import { renderRefStepComponent, renderRefVarComponent } from './ref';

/**
 * Render a variable based on its type
 * Central dispatcher for all component types
 */
export function renderVariableComponent(
    variable: VariableMatch,
    context?: ComponentContext
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
            // Render unknown tag type
            const displayName = formatVariableName(variable.name);
            return `<span class="aimd-unknown-tag" title="Unknown tag type: ${variable.type}">[? ${variable.type}: ${displayName}]</span>`;
    }
}

// Re-export all components for direct access
export {
    renderVarComponent,
    renderStepComponent,
    renderCheckComponent,
    renderVarTableComponent,
    renderRefStepComponent,
    renderRefVarComponent
};

// Local exports
export {
    formatVariableName,
    parseTypedParams
};

export { renderRichTooltip } from './shared/tooltip';
