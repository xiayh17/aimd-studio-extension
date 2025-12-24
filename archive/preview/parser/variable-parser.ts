/**
 * Variable Parser
 * 
 * Parses AIMD template variables from Markdown content.
 * Handles formats like {{var|name: str = default}} and {{step|step_name}}.
 */

import type { VariableMatch } from '../types';

/** Regex pattern to match AIMD template variables */
const VARIABLE_PATTERN = /\{\{(\w+)\|([^}]+)\}\}|\{\{(\w+)\}\}/g;

/**
 * Parse all variables from content
 * Returns array of VariableMatch objects and content with placeholders
 */
export function parseVariables(content: string): {
    variables: VariableMatch[];
    content: string;
} {
    const variables: VariableMatch[] = [];
    let index = 0;

    const replacedContent = content.replace(VARIABLE_PATTERN, (match, type1, params, type2) => {
        const type = type1 || type2;

        // Extract name from params (first part before : or =)
        let name = type; // Default to type if no params
        if (params) {
            const nameMatch = params.match(/^([^:=,]+)/);
            name = nameMatch ? nameMatch[1].trim() : type;
        }

        const variable: VariableMatch = {
            fullMatch: match,
            type,
            name,
            params: params || undefined
        };

        variables.push(variable);
        const placeholder = `__VAR_${index}__`;
        index++;

        return placeholder;
    });

    return { variables, content: replacedContent };
}

/**
 * Replace variable placeholders with rendered components
 */
export function replaceVariablePlaceholders(
    content: string,
    renderedComponents: string[]
): string {
    return content.replace(/__VAR_(\d+)__/g, (_, index) => {
        return renderedComponents[parseInt(index, 10)] || '';
    });
}
