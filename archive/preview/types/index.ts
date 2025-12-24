/**
 * Shared Types for Preview Module
 * 
 * Central type definitions to eliminate duplication across
 * renderer.ts, components.ts, and other modules.
 */

/**
 * Represents a parsed template variable match from Markdown content
 * Format: {{type|params}} or {{type}}
 */
export interface VariableMatch {
    /** The full matched string including braces, e.g. "{{var|name: str = default}}" */
    fullMatch: string;
    /** Variable type: var, step, check, var_table, ref_step, ref_var */
    type: string;
    /** Variable name extracted from params */
    name: string;
    /** Raw parameters string after the pipe, e.g. "name: str = default, title=..." */
    params?: string;
}

/**
 * Context passed to component renderers for conditional behavior
 */
export interface ComponentContext {
    /** Current step index (0-based) for step components */
    stepIndex?: number;
    /** Whether this is the last step in the sequence */
    isLast?: boolean;
    /** Optional description for check components */
    description?: string;
}

/**
 * Parsed variable parameters after processing the params string
 */
export interface ParsedParams {
    [key: string]: any;
    /** Variable data type: str, int, float, etc. */
    type?: string;
    /** Default value for the variable */
    default?: string;
    /** Display title for UI */
    title?: string;
    /** Description for tooltips */
    description?: string;
    /** Nesting level for step hierarchy */
    level?: number;
    /** Whether step has a checkbox */
    check?: boolean;
    /** Message shown when step is checked */
    checked_message?: string;
    /** Subvariables for table columns */
    subvars?: string;
    /** Validation: greater than or equal */
    ge?: number;
    /** Validation: greater than */
    gt?: number;
    /** Validation: less than or equal */
    le?: number;
    /** Validation: less than */
    lt?: number;
    /** Maximum string length */
    max_length?: number;
    /** Minimum string length */
    min_length?: number;
}

/**
 * Column definition for var_table component
 */
export interface TableColumnDef {
    /** Column identifier (variable name) */
    id: string;
    /** Display title */
    title: string;
    /** Data type */
    type: string;
    /** Default value */
    default: string;
    /** Column description */
    description: string;
}

/**
 * Result from masking code blocks to prevent variable substitution
 */
export interface MaskResult {
    /** Content with code blocks replaced by placeholders */
    content: string;
    /** Original code blocks in order */
    blocks: string[];
}

/**
 * Step metadata parsed from step markers
 */
export interface StepMeta {
    /** Step number (1-indexed) */
    stepNumber: number;
    /** Display title */
    title: string;
    /** Nesting level (1 = top level) */
    level: number;
    /** Whether step has a checkbox */
    hasCheck: boolean;
    /** Message shown when checked */
    checkedMessage: string;
    /** Whether this is a result step */
    isResult: boolean;
}
