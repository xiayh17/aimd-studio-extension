import * as vscode from 'vscode';
import { getVueWebviewHtml } from './html';
import { escapeHtml } from '../../shared/utils';

/**
 * Vue-based Preview Provider
 * 
 * This provider uses a Vue 3 application for rendering the preview.
 * It communicates with the Vue app via postMessage.
 */
export class VuePreviewProvider {
    private static readonly viewType = 'aimd.preview.vue';
    private static readonly previewTitle = 'AIMD Preview (Vue)';

    private static previewPanels = new Map<string, vscode.WebviewPanel>();
    private static updateTimeouts = new Map<string, NodeJS.Timeout>();
    private static scrollDebounceTimeouts = new Map<string, NodeJS.Timeout>();
    private static extensionUri: vscode.Uri;

    /**
     * Initialize the provider with extension context
     */
    public static initialize(context: vscode.ExtensionContext): void {
        this.extensionUri = context.extensionUri;
    }

    /**
     * Create or show preview panel
     */
    public static createOrShow(
        uri: vscode.Uri,
        viewColumn: vscode.ViewColumn = vscode.ViewColumn.Beside
    ): void {
        if (!this.extensionUri) {
            vscode.window.showErrorMessage('VuePreviewProvider not initialized');
            return;
        }

        const resourcePath = uri.toString();

        // If panel exists, reveal it
        let panel = this.previewPanels.get(resourcePath);
        if (panel) {
            panel.reveal(viewColumn);
            return;
        }

        // Create new panel
        panel = vscode.window.createWebviewPanel(
            this.viewType,
            `${this.previewTitle}: ${uri.fsPath.split('/').pop() || uri.fsPath.split('\\').pop()}`,
            viewColumn,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(this.extensionUri, 'out', 'webview')
                ]
            }
        );

        // Set initial HTML (Vue app shell)
        panel.webview.html = getVueWebviewHtml(panel.webview, this.extensionUri);

        // Handle messages from webview
        panel.webview.onDidReceiveMessage(
            message => this.handleWebviewMessage(panel!, uri, message),
            undefined
        );

        // Handle panel disposal
        panel.onDidDispose(() => {
            this.previewPanels.delete(resourcePath);
            const timeout = this.updateTimeouts.get(resourcePath);
            if (timeout) {
                clearTimeout(timeout);
                this.updateTimeouts.delete(resourcePath);
            }
        }, null);

        // Store panel reference
        this.previewPanels.set(resourcePath, panel);
    }

    /**
     * Handle messages from the Vue webview
     */
    private static handleWebviewMessage(
        panel: vscode.WebviewPanel,
        uri: vscode.Uri,
        message: any
    ): void {
        switch (message.type) {
            case 'ready':
                // Webview is ready, send initial content
                this.sendContent(panel, uri);
                break;
            case 'error':
                vscode.window.showErrorMessage(`Preview error: ${message.error}`);
                break;
        }
    }

    /**
     * Send rendered content to webview
     */
    private static async sendContent(
        panel: vscode.WebviewPanel,
        uri: vscode.Uri
    ): Promise<void> {
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const content = document.getText();

            // Use MDX compiler for rendering
            const { compileAimdToHtml } = require('./compiler');
            const result = await compileAimdToHtml(content);

            if (result.error) {
                throw new Error(result.error);
            }

            panel.webview.postMessage({
                type: 'update',
                content: result.html
            });
        } catch (error) {
            panel.webview.postMessage({
                type: 'update',
                content: `<div style="color:red;padding:20px;">Error: ${escapeHtml((error as Error).message)}</div>`
            });
        }
    }

    /**
     * Register document watcher for auto-refresh
     */
    public static registerDocumentWatcher(): vscode.Disposable {
        const debounceDelay = 300;

        return vscode.workspace.onDidChangeTextDocument(e => {
            const uri = e.document.uri;
            const resourcePath = uri.toString();

            if (uri.scheme !== 'file' || !uri.fsPath.endsWith('.aimd')) {
                return;
            }

            const panel = this.previewPanels.get(resourcePath);
            if (!panel || !panel.visible) {
                return;
            }

            const existingTimeout = this.updateTimeouts.get(resourcePath);
            if (existingTimeout) {
                clearTimeout(existingTimeout);
            }

            const timeout = setTimeout(() => {
                this.sendContent(panel, uri);
                this.updateTimeouts.delete(resourcePath);
            }, debounceDelay);

            this.updateTimeouts.set(resourcePath, timeout);
        });
    }

    /**
     * Register save watcher
     */
    public static registerSaveWatcher(): vscode.Disposable {
        return vscode.workspace.onDidSaveTextDocument(document => {
            const uri = document.uri;
            const resourcePath = uri.toString();

            if (uri.scheme !== 'file' || !uri.fsPath.endsWith('.aimd')) {
                return;
            }

            const panel = this.previewPanels.get(resourcePath);
            if (panel) {
                const existingTimeout = this.updateTimeouts.get(resourcePath);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                    this.updateTimeouts.delete(resourcePath);
                }
                this.sendContent(panel, uri);
            }
        });
    }

    // Throttle state for scroll watcher
    private static scrollThrottleActive = new Map<string, boolean>();

    /**
     * Register scroll watcher for sync scrolling from editor to preview
     * Uses throttle (not debounce) for smoother real-time sync
     */
    public static registerScrollWatcher(): vscode.Disposable {
        const THROTTLE_MS = 50; // Send at most every 50ms for smooth scrolling

        return vscode.window.onDidChangeTextEditorVisibleRanges(e => {
            const uri = e.textEditor.document.uri;

            // Only handle .aimd files
            if (uri.scheme !== 'file' || !uri.fsPath.endsWith('.aimd')) {
                return;
            }

            const resourcePath = uri.toString();
            const panel = this.previewPanels.get(resourcePath);

            // Only sync if panel exists and is visible
            if (!panel || !panel.visible) {
                return;
            }

            // Throttle: skip if we're still in cooldown
            if (this.scrollThrottleActive.get(resourcePath)) {
                return;
            }

            // Get the first visible line
            const visibleRanges = e.visibleRanges;
            if (visibleRanges.length === 0) return;

            const startLine = visibleRanges[0].start.line;

            // Send line number to webview (element-based mapping)
            panel.webview.postMessage({
                type: 'scroll',
                line: startLine
            });

            // Set throttle cooldown
            this.scrollThrottleActive.set(resourcePath, true);
            setTimeout(() => {
                this.scrollThrottleActive.set(resourcePath, false);
            }, THROTTLE_MS);
        });
    }

    /**
     * Refresh all panels
     */
    public static refreshAll(): void {
        for (const [resourcePath, panel] of this.previewPanels.entries()) {
            const uri = vscode.Uri.parse(resourcePath);
            this.sendContent(panel, uri);
        }
    }

    /**
     * Dispose all panels
     */
    public static disposeAll(): void {
        for (const panel of this.previewPanels.values()) {
            panel.dispose();
        }
        this.previewPanels.clear();
        this.updateTimeouts.clear();
        this.scrollDebounceTimeouts.clear();
    }
}
