/**
 * Styles Module Index
 * 
 * Aggregates all style modules and provides the main style getter functions.
 * This maintains backward compatibility with existing imports.
 */

import { getCssVariables } from './variables';
import { getBaseStyles } from './base';
import { getStepStyles } from './step';
import { getVarInputStyles } from './var-input';
import { getTableStyles } from './table';
import { getCalloutStyles } from './callouts';
import { getToolbarStyles } from './toolbar';
import { getResponsiveStyles } from './responsive';
import { getMiscStyles } from './misc';

/**
 * Get base preview styles (variables + typography)
 * This replaces the original getPreviewStyles() from styles.ts
 */
export function getPreviewStyles(): string {
    return `
        ${getCssVariables()}
        ${getBaseStyles()}
    `;
}

/**
 * Get component styles (all UI components)
 * This replaces the original getComponentStyles() from component-styles.ts
 */
export function getComponentStyles(): string {
    return `
        ${getStepStyles()}
        ${getVarInputStyles()}
        ${getTableStyles()}
        ${getCalloutStyles()}
        ${getToolbarStyles()}
        ${getMiscStyles()}
        ${getResponsiveStyles()}
    `;
}

// Re-export individual style getters for fine-grained access
export {
    getCssVariables,
    getBaseStyles,
    getStepStyles,
    getVarInputStyles,
    getTableStyles,
    getCalloutStyles,
    getToolbarStyles,
    getResponsiveStyles,
    getMiscStyles
};
