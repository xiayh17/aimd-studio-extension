import { getNonce } from './utils';
import { getPreviewStyles, getComponentStyles } from './styles';
import { getVariableInteractionScript } from './scripts';

/**
 * HTML 生成相关功能
 */

/**
 * 生成完整的 HTML 预览页面
 */
export function getPreviewHtml(bodyContent: string, webview: any): string {
    const nonce = getNonce();
    const interactionScript = getVariableInteractionScript(nonce);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; script-src 'nonce-${nonce}' https://cdn.tailwindcss.com https://unpkg.com;">
    <title>AIMD Preview</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com" nonce="${nonce}"></script>
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest" nonce="${nonce}"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        ${getPreviewStyles()}
        ${getComponentStyles()}
        
        /* Transition utilities for accordion */
        .step-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        body {
            font-family: 'Inter', var(--vscode-font-family), sans-serif;
            -webkit-font-smoothing: antialiased;
        }
    </style>
</head>
<body class="bg-[var(--vscode-editor-background)] text-[var(--vscode-editor-foreground)] selection:bg-blue-500/30">
    <div class="aimd-preview-container max-w-4xl mx-auto py-8 px-4">
        ${bodyContent}
    </div>
    
    <!-- Floating Toolbar (placed at body level for correct fixed positioning) -->
    <div class="aimd-toolbar" id="aimd-toolbar">
        <div class="aimd-ring-dial" id="btn-toggle-var-view" title="切换变量显示模式">
            <!-- SVG Ring with 4 segments -->
            <svg class="dial-ring" viewBox="0 0 100 100">
                <!-- Background ring -->
                <circle class="dial-bg" cx="50" cy="50" r="42" fill="none" stroke-width="8"/>
                <!-- Active segment arc (will be rotated via CSS) -->
                <circle class="dial-segment" cx="50" cy="50" r="42" fill="none" stroke-width="8"
                        stroke-dasharray="66 198" stroke-dashoffset="16.5"
                        data-mode="0"/>
            </svg>
            <!-- Center label -->
            <div class="dial-center">
                <span class="dial-letter">ID</span>
                <span class="dial-label">Variable ID</span>
            </div>
            <!-- Segment labels (positioned around the ring) -->
            <div class="dial-labels">
                <span class="dial-seg-label seg-0 active">ID</span>
                <span class="dial-seg-label seg-1">V</span>
                <span class="dial-seg-label seg-2">T</span>
                <span class="dial-seg-label seg-3">⌘</span>
            </div>
        </div>
    </div>

    <script nonce="${nonce}">
        ${interactionScript}
        // Initialize Lucide Icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    </script>
</body>
</html>`;
}

/**
 * 生成错误页面的 HTML
 */
export function getErrorHtml(errorMessage: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 20px;
            color: var(--vscode-errorForeground);
        }
    </style>
</head>
<body>
    <h2>Preview Error</h2>
    <p>Failed to load preview: ${errorMessage}</p>
</body>
</html>`;
}

