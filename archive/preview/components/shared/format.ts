/**
 * Shared Format Utilities
 * 
 * Helper functions for formatting variable names and parsing parameters.
 */

import type { ParsedParams } from '../../types';

/**
 * Convert variable name to friendly display format
 * Example: "cell_line_name" -> "Cell Line Name"
 */
export function formatVariableName(name: string): string {
    return name
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Parse typed variable parameters
 * Supports format: name: type = default, key=value, ...
 */
export function parseTypedParams(params: string): ParsedParams {
    const result: ParsedParams = {};
    if (!params) return result;

    // 1. Robust split that respects brackets and quotes
    const parts: string[] = [];
    let currentPart = '';
    let bracketLevel = 0;
    let inQuotes: string | null = null;

    for (let i = 0; i < params.length; i++) {
        const char = params[i];
        if (char === '"' || char === "'") {
            if (inQuotes === char) inQuotes = null;
            else if (!inQuotes) inQuotes = char;
        }

        if (!inQuotes) {
            if (char === '[') bracketLevel++;
            else if (char === ']') bracketLevel--;
        }

        if (char === ',' && bracketLevel === 0 && !inQuotes) {
            parts.push(currentPart.trim());
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    if (currentPart.trim()) parts.push(currentPart.trim());

    if (parts.length > 0) {
        const firstPart = parts[0];

        // Parse "name: type = default" pattern
        const match = firstPart.match(/^([^:=]+)(?::\s*([^=]+))?(?:=\s*(.+))?$/);

        if (match) {
            if (match[2]) result.type = match[2].trim();
            if (match[3]) {
                let defaultVal = match[3].trim();
                // Remove surrounding quotes
                if ((defaultVal.startsWith('"') && defaultVal.endsWith('"')) ||
                    (defaultVal.startsWith("'") && defaultVal.endsWith("'"))) {
                    defaultVal = defaultVal.slice(1, -1);
                }
                result.default = defaultVal;
            }
        }
    }

    // Parse subsequent key=value pairs
    for (let i = 1; i < parts.length; i++) {
        const part = parts[i];
        const kvMatch = part.match(/^(\w+)\s*=\s*([\s\S]*)$/);
        if (kvMatch) {
            const key = kvMatch[1];
            let value: any = kvMatch[2].trim();

            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            } else if (value === 'True' || value === 'true') {
                value = true;
            } else if (value === 'False' || value === 'false') {
                value = false;
            } else if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).trim();
            }

            result[key] = value;
        } else {
            // Positional level check
            const numMatch = part.match(/^\d+$/);
            if (numMatch && i === 1) {
                result.level = parseInt(part, 10);
            }
        }
    }

    return result;
}
