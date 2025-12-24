/**
 * Code Block Masking Utility
 * 
 * Masks code blocks before variable processing to prevent
 * template substitution inside code examples.
 */

import type { MaskResult } from '../types';

/**
 * Mask code blocks by replacing them with placeholders
 * Returns the modified content and array of original blocks
 */
export function maskCodeBlocks(content: string): MaskResult {
    const blocks: string[] = [];

    // Match fenced code blocks (```...```) and inline code (`...`)
    const masked = content.replace(/```[\s\S]*?```|`[^`\n]+`/g, (match) => {
        const index = blocks.length;
        blocks.push(match);
        return `__CODE_BLOCK_${index}__`;
    });

    return { content: masked, blocks };
}

/**
 * Restore masked code blocks from placeholders
 */
export function unmaskCodeBlocks(content: string, blocks: string[]): string {
    return content.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => {
        return blocks[parseInt(index, 10)] || '';
    });
}
