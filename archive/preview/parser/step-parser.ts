/**
 * Step Parser
 * 
 * Processes step markers and restructures DOM into step containers.
 */

/**
 * Parse step markers and restructure HTML into step containers
 * Handles the conversion from flat HTML with step markers to nested step cards
 */
export function parseAndRestructureSteps(html: string): string {
    // Pattern to match step markers
    const stepMarkerPattern = /<div class="aimd-step-marker"[^>]*><\/div>/g;

    // Check if there are step markers
    if (!stepMarkerPattern.test(html)) {
        // No steps - wrap in preamble
        return `<div class="aimd-preamble">${html}</div>`;
    }

    // Reset regex lastIndex
    stepMarkerPattern.lastIndex = 0;

    // Split by step markers
    const parts = html.split(stepMarkerPattern);
    const markers = html.match(stepMarkerPattern) || [];

    let output = '';

    // First part is preamble (content before first step)
    if (parts[0] && parts[0].trim()) {
        output += `<div class="aimd-preamble">${parts[0]}</div>`;
    }

    // Process each step
    for (let i = 0; i < markers.length; i++) {
        const marker = markers[i];
        const stepContent = parts[i + 1] || '';

        // Extract attributes from marker
        const stepNumber = extractAttr(marker, 'data-step-number') || String(i + 1);
        const displayName = extractAttr(marker, 'data-display-name') || `Step ${stepNumber}`;
        const level = extractAttr(marker, 'data-level') || '1';
        const hasCheck = extractAttr(marker, 'data-has-check') === 'true';
        const checkedMessage = extractAttr(marker, 'data-checked-message') || '';
        const variableName = extractAttr(marker, 'data-variable-name') || '';

        // Build step container
        const levelClass = level !== '1' ? ` aimd-step-level-${level}` : '';
        const checkableAttr = hasCheck ? 'data-checkable="true"' : '';

        // Look for trailing headers that should be extracted
        const { mainContent, trailingHeaders } = extractTrailingHeaders(stepContent);

        output += `
            <div class="aimd-step-container${levelClass}" 
                 data-step-id="${stepNumber}"
                 data-variable-name="${variableName}"
                 data-checked="false">
                <div class="aimd-step-content">
                    <div class="aimd-step-header" data-collapsible-trigger>
                        <div class="aimd-step-header-left">
                            <div class="aimd-step-badge" ${checkableAttr}>${stepNumber}</div>
                            <div class="aimd-step-title-group">
                                <span class="aimd-step-title">${displayName}</span>
                                ${checkedMessage ? `<span class="aimd-step-checked-message">${checkedMessage}</span>` : ''}
                            </div>
                        </div>
                        <svg class="aimd-chevron" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M5.5 3.5L10 8L5.5 12.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
                        </svg>
                    </div>
                    <div class="aimd-step-body">
                        ${mainContent}
                    </div>
                </div>
            </div>
        `;

        // Add trailing headers outside the step
        if (trailingHeaders) {
            output += `<div class="aimd-text-card">${trailingHeaders}</div>`;
        }
    }

    return output;
}

/**
 * Extract attribute value from HTML string
 */
function extractAttr(html: string, attr: string): string | null {
    const regex = new RegExp(`${attr}="([^"]*)"`, 'i');
    const match = html.match(regex);
    return match ? match[1] : null;
}

/**
 * Extract trailing headers (h1-h6) from the end of step content
 * Returns main content and extracted headers separately
 */
function extractTrailingHeaders(content: string): {
    mainContent: string;
    trailingHeaders: string;
} {
    // Pattern to match headers at the end
    const trailingHeaderPattern = /(<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>\s*)$/i;
    const match = content.match(trailingHeaderPattern);

    if (match) {
        return {
            mainContent: content.slice(0, -match[0].length),
            trailingHeaders: match[0]
        };
    }

    return {
        mainContent: content,
        trailingHeaders: ''
    };
}
