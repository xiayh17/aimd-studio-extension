
import { renderAimdToHtml } from '../renderer';

describe('AIMD Empty Line Rendering', () => {
    // Mock webview object since we don't need it for these tests
    const mockWebview = {};

    it('should preserve single empty lines', () => {
        const input = 'Paragraph 1\n\n\nParagraph 2';
        const output = renderAimdToHtml(input, mockWebview);

        // Helper to normalize whitespace for easier checking
        // But here we specifically want to check for <br>
        expect(output).toContain('<br class="aimd-empty-line">');
        expect(output).toContain('Paragraph 1');
        expect(output).toContain('Paragraph 2');
    });

    it('should preserve multiple empty lines', () => {
        const input = 'Paragraph 1\n\n\n\nParagraph 2';
        const output = renderAimdToHtml(input, mockWebview);

        // Should have 2 br tags for 2 empty lines
        const matches = output.match(/<br class="aimd-empty-line">/g);
        expect(matches).not.toBeNull();
        expect(matches?.length).toBe(2);
    });

    it('should NOT preserve empty lines inside fenced code blocks', () => {
        const input = '```\nCode Line 1\n\nCode Line 2\n```';
        const output = renderAimdToHtml(input, mockWebview);

        // Code block content should be wrapped in <pre><code>...</code></pre>
        // and should NOT contain the custom br class
        expect(output).not.toContain('<br class="aimd-empty-line">');
        // Marked usually escapes code content, but structure remains
        expect(output).toContain('Code Line 1');
        expect(output).toContain('Code Line 2');
    });

    it('should NOT preserve empty lines inside inline code', () => {
        const input = '`Code Line 1\n\nCode Line 2`';
        const output = renderAimdToHtml(input, mockWebview);

        expect(output).not.toContain('<br class="aimd-empty-line">');
    });

    it('should handle empty lines between variable placeholders', () => {
        // Need to simulate variable detection that renderer does
        // Variable format: {{name}}
        const input = '{{var1}}\n\n\n{{var2}}';
        const output = renderAimdToHtml(input, mockWebview);

        expect(output).toContain('<br class="aimd-empty-line">');
        // Check simple presence of variable markers or rendered components
        // (The exact output depends on renderVariableComponent mock/impl, but we just check spacing)
    });
});
