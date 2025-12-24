/**
 * Preview Module Public API
 * 
 * This module handles AIMD file preview functionality:
 * - Preview panel management
 * - Markdown rendering
 * - HTML generation
 * - Style definitions
 * 
 * The module is organized into subdirectories:
 * - types/    - Shared TypeScript interfaces
 * - styles/   - CSS style modules
 * - components/ - Component renderers
 * - scripts/  - Webview interaction scripts
 * - parser/   - Markdown parsing utilities
 */

// Core exports
export { AimdPreviewProvider } from './provider';
export { renderAimdToHtml } from './renderer';
export { getPreviewHtml, getErrorHtml } from './html';
export { getNonce, escapeHtml } from './utils';

// Types
export type { VariableMatch, ComponentContext, ParsedParams, TableColumnDef, MaskResult, StepMeta } from './types';

// Styles (backward compatible)
export { getPreviewStyles, getComponentStyles } from './styles';

// Scripts (backward compatible)
export { getVariableInteractionScript } from './scripts';

// Components (backward compatible)
export {
    renderVariableComponent,
    renderVarComponent,
    renderStepComponent,
    renderCheckComponent,
    renderVarTableComponent,
    renderRefStepComponent,
    renderRefVarComponent,
    formatVariableName,
    parseTypedParams
} from './components';

// Parser utilities
export {
    maskCodeBlocks,
    unmaskCodeBlocks,
    parseVariables,
    replaceVariablePlaceholders,
    parseAndRestructureSteps
} from './parser';
