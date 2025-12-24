
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { getPreviewHtml } from './html';
import { renderVariableComponent } from './components';

// --- Types ---
interface VariableMatch {
    fullMatch: string;
    type: string;
    name: string;
    params?: string;
    index: number;
}

// Use Fullwidth Vertical Line as placeholder (won't be confused with underscores)
const PIPE_PLACEHOLDER = '\uFF5C';

/**
 * Collapse multi-line variable definitions into single lines
 * This handles cases like:
 * {{var|name,
 *     title="...",
 *     subvars=[...]
 * }}
 */
function collapseMultiLineVariables(content: string): string {
    let result = '';
    let i = 0;

    while (i < content.length) {
        // Look for {{
        if (content[i] === '{' && content[i + 1] === '{') {
            const start = i;
            i += 2;
            let depth = 1;

            // Find matching }}
            while (i < content.length && depth > 0) {
                if (content[i] === '{' && content[i + 1] === '{') {
                    depth++;
                    i += 2;
                } else if (content[i] === '}' && content[i + 1] === '}') {
                    depth--;
                    if (depth === 0) {
                        i += 2;
                        break;
                    }
                    i += 2;
                } else {
                    i++;
                }
            }

            // Extract the variable block and collapse whitespace
            let varBlock = content.slice(start, i);
            // Replace newlines and multiple spaces with single space (but keep inside strings intact)
            varBlock = varBlock.replace(/\s+/g, ' ');
            result += varBlock;
        } else {
            result += content[i];
            i++;
        }
    }

    return result;
}

// --- Plugins ---

/**
 * Remark Plugin: Parse variables (MDAST)
 * Detects {{variable}} and converts them into HTML nodes (or custom nodes).
 * This allows us to control whether they are block or inline.
 */
function remarkAimdVariables() {
    return (tree: any) => {
        // Regex matches both standard pipe | and our placeholder character
        const variableRegex = new RegExp(`\\{\\{([a-zA-Z_][a-zA-Z0-9_]*)(?:[${PIPE_PLACEHOLDER}|]([^}]+))?\\}\\}`, 'g');

        visit(tree, 'text', (node, index, parent) => {
            if (!node.value.match(variableRegex)) return;

            const children: any[] = [];
            let lastIndex = 0;
            let match;

            // We need to reset regex index because we are loop-matching
            variableRegex.lastIndex = 0;

            while ((match = variableRegex.exec(node.value)) !== null) {
                // Add text before the variable
                if (match.index > lastIndex) {
                    children.push({
                        type: 'text',
                        value: node.value.slice(lastIndex, match.index)
                    });
                }

                // Restore pipes in params
                let rawParams = match[2] || '';
                rawParams = rawParams.replace(new RegExp(PIPE_PLACEHOLDER, 'g'), '|');

                const firstPart = rawParams.split(',')[0].trim();
                const varName = firstPart.split(':')[0].trim() || match[1];
                let varType = match[1];
                if (varType === 'var' && rawParams.includes('subvars')) {
                    varType = 'var_table';
                }

                const varInfo = {
                    type: varType,
                    name: varName,
                    params: rawParams
                };

                // Store data in a way we can retrieve later. 
                // We use base64 to avoid JSON escaping issues in attributes
                const dataStr = Buffer.from(JSON.stringify(varInfo)).toString('base64');

                children.push({
                    type: 'html',
                    value: `<aimd-var data-info="${dataStr}"></aimd-var>`
                });

                lastIndex = variableRegex.lastIndex;
            }

            // Add remaining text
            if (lastIndex < node.value.length) {
                children.push({
                    type: 'text',
                    value: node.value.slice(lastIndex)
                });
            }

            // Replace the text node with the new children
            if (typeof index === 'number' && children.length > 0) {
                parent.children.splice(index, 1, ...children);
                return index + children.length;
            }
            return index;
        });
    };
}

/**
 * Rehype Plugin: Handle "div in p" and generic Unwrapping
 * ONLY unwrap when there's an actual block element (div), NOT for inline aimd-var
 */
function rehypeAimdStructure() {
    return (tree: any) => {
        visit(tree, 'element', (node, index, parent) => {
            if (node.tagName === 'p') {
                // Only unwrap if there's a div (block element) inside
                // Do NOT unwrap for aimd-var which is inline
                const hasBlockDiv = node.children.some((child: any) => {
                    return child.tagName === 'div';
                });

                if (hasBlockDiv && parent && typeof index === 'number') {
                    parent.children.splice(index, 1, ...node.children);
                    return index + node.children.length;
                }
            }
        });
    };
}

/**
 * Remark Plugin: GitHub Alerts (Callouts)
 */
function remarkGithubAlerts() {
    return (tree: any) => {
        visit(tree, 'blockquote', (node: any) => {
            if (node.children && node.children.length > 0 && node.children[0].type === 'paragraph') {
                const p = node.children[0];
                if (p.children && p.children.length > 0 && p.children[0].type === 'text') {
                    const text = p.children[0].value;
                    const alertRegex = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|EXAMPLE|ABSTRACT|INFO|SUCCESS|DANGER|BUG|QUOTE)\]\s*/i;
                    const match = text.match(alertRegex);

                    if (match) {
                        const type = match[1].toLowerCase();
                        p.children[0].value = text.replace(alertRegex, '');
                        node.data = node.data || {};
                        node.data.hProperties = node.data.hProperties || {};
                        node.data.hProperties.className = ['aimd-callout', `aimd-callout-${type}`];
                    }
                }
            }
        });
    };
}

// --- Main ---

export function renderAimdToHtmlUnified(content: string, webview: any): string {
    // 0. Pre-process

    // 0.1 Collapse multi-line variables into single line and escape pipes
    // Use a function to find matching {{ }} pairs that may span lines
    let processedContent = collapseMultiLineVariables(content);

    // 0.2 Escape pipes inside variables to prevent them from breaking tables
    processedContent = processedContent.replace(/\{\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\}/g, (match) => {
        return match.replace(/\|/g, PIPE_PLACEHOLDER);
    });

    // 0.3 Preserve empty lines (2+ newlines become <br> markers)
    // We use a special marker that won't break Markdown structures like tables or callouts
    const duplicateNewlinesRegex = /\n{2,}/g;
    processedContent = processedContent.replace(duplicateNewlinesRegex, (match) => {
        const brCount = match.length - 1; // \n\n is 1 empty line
        if (brCount <= 0) return match;
        // Use a unique placeholder that rehype-raw will preserve but won't break block parsing
        const brs = Array(brCount).fill('<div class="aimd-empty-line"></div>').join('');
        return `\n\n${brs}\n\n`;
    });

    // 1. Unified Pipeline
    const file = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkBreaks) // Handle newlines as <br>
        .use(remarkGithubAlerts) // Handle Callouts
        .use(remarkAimdVariables) // Convert {{}} to <aimd-var>
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeAimdStructure)
        .use(rehypeStringify)
        .processSync(processedContent);

    let html = String(file);

    // 2. Hydrate Variables (Convert <aimd-var> to actual components)
    html = html.replace(/<aimd-var data-info="([^"]+)"><\/aimd-var>/g, (match, dataStr) => {
        try {
            const varInfo = JSON.parse(Buffer.from(dataStr, 'base64').toString('utf-8'));

            const variable: VariableMatch = {
                fullMatch: '',
                type: varInfo.type,
                name: varInfo.name,
                params: varInfo.params,
                index: 0
            };

            return renderVariableComponent(variable, {
                stepIndex: 0,
                isLast: false
            });
        } catch (e) {
            console.error('Failed to parse var info', e);
            return '<span style="color:red">Error rendering variable</span>';
        }
    });

    // 3. Step Parsing
    const stepMarkerRegex = /<div class="aimd-step-marker"([^>]*)><\/div>/g;
    let stepCount = 0;

    html = html.replace(stepMarkerRegex, (fullMatch, attrStr) => {
        stepCount++;
        const getAttr = (key: string) => {
            const m = attrStr.match(new RegExp(`${key}="([^"]*)"`));
            return m ? m[1] : '';
        };

        const displayName = getAttr('data-display-name');
        const level = parseInt(getAttr('data-level') || '1', 10);
        const hasCheck = getAttr('data-has-check') === 'true';
        const checkedMessage = getAttr('data-checked-message');
        const rawVar = getAttr('data-variable-full');

        let isResult = false;
        if (rawVar && (rawVar.includes('result=true') || rawVar.includes('type=result'))) {
            isResult = true;
        }

        return `<!--STEP_START::${JSON.stringify({
            stepNumber: stepCount,
            title: displayName,
            level,
            hasCheck,
            checkedMessage,
            isResult
        })}-->`;
    });

    const parts = html.split(/<!--STEP_START::(.*?)-->/);
    let finalHtml = '';

    if (parts[0] && parts[0].trim()) {
        finalHtml += `
        <div class="aimd-step-container">
            <div class="aimd-timeline-column"></div>
            <div class="aimd-text-card">
                ${parts[0]}
            </div>
        </div>`;
    }

    if (parts.length > 1) {
        finalHtml += `<div class="aimd-steps-timeline">`;
        for (let i = 1; i < parts.length; i += 2) {
            const meta = JSON.parse(parts[i]);
            let fullContent = parts[i + 1] || '';

            const splitRegex = /(<h[1-6]|<hr)/i;
            const splitMatch = fullContent.match(splitRegex);
            let stepBody = fullContent;
            let textCardContent = '';

            if (splitMatch && splitMatch.index !== undefined) {
                stepBody = fullContent.substring(0, splitMatch.index);
                textCardContent = fullContent.substring(splitMatch.index);
            }

            let cnTitle = '';
            const titleMatch = stepBody.match(/<p>\s*(?:<strong>)?([\u4e00-\u9fa5].*?)(?:<\/strong>)?\s*<\/p>/);
            if (titleMatch) {
                cnTitle = titleMatch[1];
                stepBody = stepBody.replace(titleMatch[0], '');
            }

            const indentClass = meta.level > 1 ? ` aimd-step-level-${meta.level}` : '';
            const resultClass = meta.isResult ? ' is-result' : '';

            finalHtml += `
            <div class="aimd-step-container${indentClass}" data-step-id="${meta.stepNumber}" data-checked="${false}">
                <div class="aimd-step-content${resultClass}">
                    ${meta.isResult ? `
                    <div class="aimd-result-label">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px;">
                            <path d="M10 2v7.31L4.89 20.69C4.46 21.49 5.03 22.5 5.94 22.5h12.12c.91 0 1.48-1.01 1.05-1.81L14 9.31V2h-4z"/>
                            <line x1="8.5" y1="2" x2="15.5" y2="2"/>
                            <path d="M10 14h4"/>
                        </svg>
                        Result
                    </div>` : ''}
                    <div class="aimd-step-header" data-collapsible-trigger="true">
                        <div class="aimd-step-header-left">
                            <div class="aimd-step-badge" data-checkable="${meta.hasCheck}" data-checked="false">${meta.stepNumber}</div>
                            <div class="aimd-step-title-group">
                                <div class="aimd-step-title">${meta.title}</div>
                                ${cnTitle ? `<div class="aimd-step-subtitle">${cnTitle}</div>` : ''}
                                ${meta.checkedMessage ? `<div class="aimd-step-checked-message">${meta.checkedMessage}</div>` : ''}
                            </div>
                        </div>
                        <div class="aimd-chevron">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>
                    </div>
                    <div class="aimd-step-body">${stepBody}</div>
                </div>
            </div>`;

            if (textCardContent.trim()) {
                finalHtml += `<div class="aimd-step-container"><div class="aimd-text-card">${textCardContent}</div></div>`;
            }
        }
        finalHtml += `</div>`;
    } else {
        finalHtml = `<div class="aimd-container">${html}</div>`;
    }

    return getPreviewHtml(finalHtml, webview);
}
