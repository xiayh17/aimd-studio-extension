# AIMD Studio

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/yonghe.aimd-studio?label=VS%20Code%20Marketplace&logo=visualstudiocode&logoColor=white)](https://marketplace.visualstudio.com/items?itemName=yonghe.aimd-studio)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/yonghe.aimd-studio?label=Installs&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=yonghe.aimd-studio)
[![Open VSX](https://img.shields.io/open-vsx/v/yonghe/aimd-studio?label=Open%20VSX&logo=eclipse)](https://open-vsx.org/extension/yonghe/aimd-studio)
[![GitHub](https://img.shields.io/github/license/xiayh17/aimd-studio-extension?label=License)](https://github.com/xiayh17/aimd-studio-extension/blob/main/LICENSE)

AIMD Studio is a professional VS Code extension designed for editing and previewing **AIMD (Advanced Interactive Molecular/Lab Design)** protocol files. It provides a modern, "Scientific Minimalist" preview interface to help scientists and researchers visualize their experimental workflows.

## Features

- **Interactive Timeline Preview**: Visualize your protocol as a sleek, card-based timeline.
- **Scientific Minimalist Design**: High-fidelity UI inspired by professional lab design tools, offering high contrast and reduced visual clutter.
- **Unified Rendering Engine**: Powered by Remark/Rehype and Vue.js for robust and extensible document parsing.
- **Python Backend Integration**: Binary sidecar architecture for advanced features like AI assistance and data export.
- **Real-time Synchronization**: The preview updates instantly as you edit your `.aimd` files.
- **Smart Variable Highlighting**: Easily identify and interact with protocol variables.
- **Theme Support**: Choose between Modern, Journal, Clinical, and Westlake themes with full dark mode support.
- **Status Bar Integration**: Quick access to preview commands directly from the status bar.

## Usage

1. Open any file with the `.aimd` extension.
2. Click the **AIMD Preview** button in the status bar (bottom right).
3. Alternatively, use the preview icon in the editor title bar or the context menu.

## Extension Settings

This extension contributes the following settings:

* `aimd.preview.experimental`: Enable/disable the experimental timeline view (default: true).
* `aimd.preview.buttonText`: Customize the status bar button text.
* `aimd.preview.buttonIcon`: Change the status bar icon (uses VS Code Codicons).
* `aimd.preview.buttonPriority`: Adjust the position of the status bar button.

## Requirements

* VS Code version 1.74.0 or higher.
* Python 3.8+ (for backend features, optional).

## Release Notes

### 0.3.1

CI/CD automation and build pipeline:
- **Multi-Platform Binaries**: Automated PyInstaller builds for Win/Mac/Linux.
- **Auto Publishing**: GitHub Actions for automatic marketplace releases.

### 0.3.0

Python backend integration:
- **Binary Sidecar Pattern**: Python backend via JSON-RPC over stdio.
- **Backend Bridge**: Seamless TypeScript-Python communication.

### 0.2.0

Major update focusing on UI refinement and architecture modernization:
- **Scientific Minimalist Redesign**: A cleaner, more professional look.
- **Unified Renderer**: Robust parsing using the Unified ecosystem.
- **Vue.js Integration**: Completely rewritten preview interface using Vue.
- **Enhanced Reliability**: Fixed numerous parsing and display bugs.

### 0.1.0

Initial release of AIMD Studio:
- Basic syntax highlighting for `.aimd` files.
- Advanced Timeline Preview with card-based layout.
- Experimental ProFlow-style rendering.
- Status bar and editor title integration.

---

**Happy Experimenting!**
