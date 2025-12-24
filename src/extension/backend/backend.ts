/**
 * AIMD Backend - Python Binary Sidecar Bridge
 * 
 * Manages communication with the Python backend process via JSON-RPC over stdio.
 * In development mode, runs Python source directly.
 * In production mode, runs the compiled binary.
 */

import * as path from 'path';
import * as cp from 'child_process';
import * as vscode from 'vscode';

// JSON-RPC message types
interface JsonRpcRequest {
    jsonrpc: '2.0';
    id: number;
    method: string;
    params?: Record<string, unknown>;
}

interface JsonRpcResponse {
    jsonrpc: '2.0';
    id: number;
    result?: unknown;
    error?: {
        code: number;
        message: string;
        data?: unknown;
    };
}

interface HelloResult {
    message: string;
    timestamp: string;
    python_version: string;
}

export class AimdBackend {
    private process: cp.ChildProcess | null = null;
    private outputChannel: vscode.OutputChannel;
    private requestId = 0;
    private pendingRequests = new Map<number, {
        resolve: (value: unknown) => void;
        reject: (error: Error) => void;
    }>();
    private buffer = '';
    private isReady = false;
    private readyPromise: Promise<void>;
    private readyResolve: (() => void) | null = null;

    constructor(private extensionPath: string) {
        this.outputChannel = vscode.window.createOutputChannel('AIMD Backend');
        this.readyPromise = new Promise((resolve) => {
            this.readyResolve = resolve;
        });
    }

    /**
     * Get the path to the Python executable or compiled binary
     */
    private getBackendCommand(): { command: string; args: string[] } {
        // For development: use Python source directly
        const pythonScript = path.join(this.extensionPath, 'python', 'server.py');

        // Try to find Python executable
        // Priority: python3 > python
        const pythonCommands = process.platform === 'win32'
            ? ['python', 'python3', 'py']
            : ['python3', 'python'];

        // For now, use the first available (in production, we'd use compiled binary)
        return {
            command: pythonCommands[0],
            args: [pythonScript]
        };
    }

    /**
     * Start the backend process
     */
    async start(): Promise<void> {
        if (this.process) {
            this.outputChannel.appendLine('Backend already running');
            return;
        }

        const { command, args } = this.getBackendCommand();

        this.outputChannel.appendLine(`Starting backend: ${command} ${args.join(' ')}`);

        try {
            this.process = cp.spawn(command, args, {
                cwd: path.join(this.extensionPath, 'python'),
                env: {
                    ...process.env,
                    PYTHONUNBUFFERED: '1',  // Ensure immediate output
                    AIMD_MODE: 'development'
                },
                stdio: ['pipe', 'pipe', 'pipe']
            });

            // Handle stdout (JSON-RPC responses)
            this.process.stdout?.on('data', (data: Buffer) => {
                this.handleStdout(data.toString());
            });

            // Handle stderr (log messages)
            this.process.stderr?.on('data', (data: Buffer) => {
                const message = data.toString().trim();
                if (message) {
                    this.outputChannel.appendLine(`[Python] ${message}`);
                }
            });

            // Handle process exit
            this.process.on('exit', (code, signal) => {
                this.outputChannel.appendLine(`Backend exited with code ${code}, signal ${signal}`);
                this.process = null;
                this.isReady = false;

                // Reject all pending requests
                for (const [id, { reject }] of this.pendingRequests) {
                    reject(new Error('Backend process exited'));
                }
                this.pendingRequests.clear();
            });

            this.process.on('error', (err) => {
                this.outputChannel.appendLine(`Backend error: ${err.message}`);
                vscode.window.showErrorMessage(`AIMD Backend failed to start: ${err.message}`);
            });

            // Wait for ready signal
            await this.readyPromise;
            this.outputChannel.appendLine('Backend is ready');

        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.outputChannel.appendLine(`Failed to start backend: ${message}`);
            throw error;
        }
    }

    /**
     * Handle data from stdout (JSON-RPC messages)
     */
    private handleStdout(data: string): void {
        this.buffer += data;

        // Process complete lines
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || '';  // Keep incomplete line in buffer

        for (const line of lines) {
            if (!line.trim()) continue;

            try {
                const message = JSON.parse(line);

                // Check for ready notification
                if (message.method === '$/ready') {
                    this.isReady = true;
                    if (this.readyResolve) {
                        this.readyResolve();
                        this.readyResolve = null;
                    }
                    continue;
                }

                // Handle response
                if ('id' in message) {
                    const response = message as JsonRpcResponse;
                    const pending = this.pendingRequests.get(response.id);

                    if (pending) {
                        this.pendingRequests.delete(response.id);

                        if (response.error) {
                            pending.reject(new Error(
                                `${response.error.message} (code: ${response.error.code})`
                            ));
                        } else {
                            pending.resolve(response.result);
                        }
                    }
                }
            } catch (e) {
                this.outputChannel.appendLine(`Failed to parse response: ${line}`);
            }
        }
    }

    /**
     * Send a JSON-RPC request to the backend
     */
    async sendRequest<T>(method: string, params?: Record<string, unknown>): Promise<T> {
        if (!this.process || !this.isReady) {
            throw new Error('Backend is not running');
        }

        const id = ++this.requestId;
        const request: JsonRpcRequest = {
            jsonrpc: '2.0',
            id,
            method,
            params
        };

        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, {
                resolve: resolve as (value: unknown) => void,
                reject
            });

            const requestStr = JSON.stringify(request) + '\n';
            this.process?.stdin?.write(requestStr, (err) => {
                if (err) {
                    this.pendingRequests.delete(id);
                    reject(err);
                }
            });
        });
    }

    /**
     * Call the hello method on the backend
     */
    async hello(name: string = 'World'): Promise<HelloResult> {
        return this.sendRequest<HelloResult>('hello', { name });
    }

    /**
     * Stop the backend process
     */
    async stop(): Promise<void> {
        if (!this.process) {
            return;
        }

        this.outputChannel.appendLine('Stopping backend...');

        try {
            // Try graceful shutdown first
            await this.sendRequest('shutdown').catch(() => { });
        } catch {
            // Ignore errors during shutdown
        }

        // Force kill if still running
        if (this.process) {
            this.process.kill();
            this.process = null;
        }

        this.isReady = false;
        this.outputChannel.appendLine('Backend stopped');
    }

    /**
     * Show the output channel
     */
    showOutput(): void {
        this.outputChannel.show();
    }

    /**
     * Dispose resources
     */
    dispose(): void {
        this.stop();
        this.outputChannel.dispose();
    }
}
