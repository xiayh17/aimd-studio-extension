import * as vscode from 'vscode';
import { renderAimdToHtml } from './renderer';
import { getErrorHtml } from './html';
import { escapeHtml } from './utils';

/**
 * 预览提供者，管理 AIMD 文件的预览面板
 */
export class AimdPreviewProvider {
    private static readonly viewType = 'aimd.preview';
    private static readonly previewTitle = 'AIMD Preview';

    private static previewPanels = new Map<string, vscode.WebviewPanel>();
    private static updateTimeouts = new Map<string, NodeJS.Timeout>();

    /**
     * 创建或显示预览面板
     */
    public static createOrShow(
        uri: vscode.Uri,
        viewColumn: vscode.ViewColumn = vscode.ViewColumn.Beside
    ): void {
        const resourcePath = uri.toString();

        // 如果预览面板已存在，直接显示
        let panel = this.previewPanels.get(resourcePath);
        if (panel) {
            panel.reveal(viewColumn);
            return;
        }

        // 创建新的预览面板
        panel = vscode.window.createWebviewPanel(
            this.viewType,
            `${this.previewTitle}: ${uri.fsPath.split('/').pop() || uri.fsPath.split('\\').pop()}`,
            viewColumn,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: []
            }
        );

        // 设置初始内容
        this.updatePreview(panel, uri);

        // 监听面板关闭事件
        panel.onDidDispose(() => {
            this.previewPanels.delete(resourcePath);
            const timeout = this.updateTimeouts.get(resourcePath);
            if (timeout) {
                clearTimeout(timeout);
                this.updateTimeouts.delete(resourcePath);
            }
        }, null);

        // 保存面板引用
        this.previewPanels.set(resourcePath, panel);
    }

    /**
     * 更新预览内容
     */
    private static updatePreview(panel: vscode.WebviewPanel, uri: vscode.Uri): void {
        // 读取文档内容
        vscode.workspace.openTextDocument(uri).then(document => {
            const content = document.getText();
            const html = renderAimdToHtml(content, panel.webview);
            panel.webview.html = html;
        }, error => {
            panel.webview.html = getErrorHtml(escapeHtml(error.message));
        });
    }

    /**
     * 监听文档变化并自动更新预览（带防抖）
     */
    public static registerDocumentWatcher(): vscode.Disposable {
        const debounceDelay = 300; // 300ms 防抖延迟

        return vscode.workspace.onDidChangeTextDocument(e => {
            const uri = e.document.uri;
            const resourcePath = uri.toString();

            // 只处理 .aimd 文件
            if (uri.scheme !== 'file' || !uri.fsPath.endsWith('.aimd')) {
                return;
            }

            // 检查是否有对应的预览面板
            const panel = this.previewPanels.get(resourcePath);
            if (!panel || !panel.visible) {
                return;
            }

            // 清除之前的延迟更新
            const existingTimeout = this.updateTimeouts.get(resourcePath);
            if (existingTimeout) {
                clearTimeout(existingTimeout);
            }

            // 设置新的延迟更新
            const timeout = setTimeout(() => {
                this.updatePreview(panel, uri);
                this.updateTimeouts.delete(resourcePath);
            }, debounceDelay);

            this.updateTimeouts.set(resourcePath, timeout);
        });
    }

    /**
     * 监听文档保存事件并更新预览
     */
    public static registerSaveWatcher(): vscode.Disposable {
        return vscode.workspace.onDidSaveTextDocument(document => {
            const uri = document.uri;
            const resourcePath = uri.toString();

            // 只处理 .aimd 文件
            if (uri.scheme !== 'file' || !uri.fsPath.endsWith('.aimd')) {
                return;
            }

            // 检查是否有对应的预览面板
            const panel = this.previewPanels.get(resourcePath);
            if (panel) {
                // 立即更新（保存时不需要防抖）
                const existingTimeout = this.updateTimeouts.get(resourcePath);
                if (existingTimeout) {
                    clearTimeout(existingTimeout);
                    this.updateTimeouts.delete(resourcePath);
                }
                this.updatePreview(panel, uri);
            }
        });
    }

    /**
     * 刷新指定 URI 的预览
     */
    public static refresh(uri: vscode.Uri): void {
        const resourcePath = uri.toString();
        const panel = this.previewPanels.get(resourcePath);
        if (panel) {
            this.updatePreview(panel, uri);
        }
    }

    /**
     * 刷新所有打开的预览面板
     */
    public static refreshAll(): void {
        for (const [resourcePath, panel] of this.previewPanels.entries()) {
            const uri = vscode.Uri.parse(resourcePath);
            this.updatePreview(panel, uri);
        }
    }

    /**
     * 关闭所有预览面板
     */
    public static disposeAll(): void {
        for (const panel of this.previewPanels.values()) {
            panel.dispose();
        }
        this.previewPanels.clear();

        for (const timeout of this.updateTimeouts.values()) {
            clearTimeout(timeout);
        }
        this.updateTimeouts.clear();
    }
}

