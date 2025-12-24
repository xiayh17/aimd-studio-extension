/**
 * GFM Callout / Alert Styles
 * 
 * Styles for GitHub Flavored Markdown alert blocks:
 * NOTE, TIP, IMPORTANT, WARNING, CAUTION, EXAMPLE, ABSTRACT, INFO, SUCCESS, DANGER, BUG, QUOTE
 */

export function getCalloutStyles(): string {
    return `
        /* ============================================
           Callouts / GFM Alerts
           ============================================ */
        .aimd-callout {
            margin: 1.5em 0;
            padding: 16px 20px;
            border-radius: 6px;
            border-left: 4px solid;
            background-color: rgba(128, 128, 128, 0.1);
            position: relative;
        }

        .aimd-callout p {
            margin: 0.5em 0;
        }
        
        .aimd-callout p:first-child {
            margin-top: 0;
        }
        
        .aimd-callout p:last-child {
            margin-bottom: 0;
        }

        /* TIP / SUCCESS */
        .aimd-callout-tip {
            background-color: rgba(20, 184, 166, 0.1);
            border-left-color: var(--aimd-teal-500);
            color: var(--aimd-teal-600);
        }
        .aimd-callout-tip strong { color: var(--aimd-teal-600); }
        .aimd-callout-tip::before { content: '💡'; float: left; margin-right: 0.5em; }

        /* NOTE / INFO */
        .aimd-callout-note {
            background-color: rgba(59, 130, 246, 0.1);
            border-left-color: #3b82f6;
            color: #2563eb;
        }
        .aimd-callout-note strong { color: #2563eb; }
        .aimd-callout-note::before { content: 'ℹ️'; float: left; margin-right: 0.5em; }

        /* WARNING / IMPORTANT */
        .aimd-callout-warning, .aimd-callout-important {
            background-color: rgba(245, 158, 11, 0.1);
            border-left-color: #f59e0b;
            color: #d97706;
        }
        .aimd-callout-warning strong { color: #d97706; }
        .aimd-callout-warning::before { content: '⚠️'; float: left; margin-right: 0.5em; }

        /* CAUTION / ERROR */
        .aimd-callout-caution {
            background-color: rgba(239, 68, 68, 0.1);
            border-left-color: #ef4444;
            color: #dc2626;
        }
        .aimd-callout-caution strong { color: #dc2626; }
        .aimd-callout-caution::before { content: '🛑'; float: left; margin-right: 0.5em; }

        /* EXAMPLE - 紫色/薰衣草 */
        .aimd-callout-example {
            background-color: rgba(139, 92, 246, 0.1);
            border-left-color: #8b5cf6;
            color: #7c3aed;
        }
        .aimd-callout-example strong { color: #7c3aed; }
        .aimd-callout-example::before { content: '📝'; float: left; margin-right: 0.5em; }

        /* ABSTRACT / SUMMARY - 青色 */
        .aimd-callout-abstract {
            background-color: rgba(6, 182, 212, 0.1);
            border-left-color: #06b6d4;
            color: #0891b2;
        }
        .aimd-callout-abstract strong { color: #0891b2; }
        .aimd-callout-abstract::before { content: '📋'; float: left; margin-right: 0.5em; }

        /* INFO - 青蓝色 */
        .aimd-callout-info {
            background-color: rgba(59, 130, 246, 0.1);
            border-left-color: #3b82f6;
            color: #2563eb;
        }
        .aimd-callout-info strong { color: #2563eb; }
        .aimd-callout-info::before { content: '📌'; float: left; margin-right: 0.5em; }

        /* SUCCESS - 绿色 */
        .aimd-callout-success {
            background-color: rgba(34, 197, 94, 0.1);
            border-left-color: #22c55e;
            color: #16a34a;
        }
        .aimd-callout-success strong { color: #16a34a; }
        .aimd-callout-success::before { content: '✅'; float: left; margin-right: 0.5em; }

        /* DANGER - 深红色 */
        .aimd-callout-danger {
            background-color: rgba(220, 38, 38, 0.1);
            border-left-color: #dc2626;
            color: #b91c1c;
        }
        .aimd-callout-danger strong { color: #b91c1c; }
        .aimd-callout-danger::before { content: '⚡'; float: left; margin-right: 0.5em; }

        /* BUG - 红橙色 */
        .aimd-callout-bug {
            background-color: rgba(234, 88, 12, 0.1);
            border-left-color: #ea580c;
            color: #c2410c;
        }
        .aimd-callout-bug strong { color: #c2410c; }
        .aimd-callout-bug::before { content: '🐛'; float: left; margin-right: 0.5em; }

        /* QUOTE - 灰色 */
        .aimd-callout-quote {
            background-color: rgba(107, 114, 128, 0.1);
            border-left-color: #6b7280;
            color: #4b5563;
        }
        .aimd-callout-quote strong { color: #4b5563; }
        .aimd-callout-quote::before { content: '💬'; float: left; margin-right: 0.5em; }
    `;
}
