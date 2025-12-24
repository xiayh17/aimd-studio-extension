# AIMD Studio

AIMD Studio is a professional VS Code extension designed for editing and previewing **AIMD (Advanced Interactive Molecular/Lab Design)** protocol files. It provides a modern, "Scientific Minimalist" preview interface to help scientists and researchers visualize their experimental workflows.

## Features

- **Interactive Timeline Preview**: Visualize your protocol as a sleek, card-based timeline.
- **Scientific Minimalist Design**: High-fidelity UI inspired by professional lab design tools, offering high contrast and reduced visual clutter.
- **Unified Rendering Engine**: Powered by Remark/Rehype and Vue.js for robust and extensible document parsing.
- **Real-time Synchronization**: The preview updates instantly as you edit your `.aimd` files.
- **Smart Variable Highlighting**: Easily identify and interact with protocol variables.
- **Theme Support**: Choose between Modern, Journal, Clinical, and Westlake themes with full dark mode support.
- **Status Bar Integration**: Quick access to preview commands directly from the status bar.

## Usage

1. Open any file with the `.aimd` extension.
2. Click the **AIMD Preview** button in the status bar (bottom right).
3. Alternatively, use the preview icon in the editor title bar or the context menu.
4. Use the **Toggle Experimental Preview** command to switch between rendering engines.

## Extension Settings

This extension contributes the following settings:

* `aimd.preview.experimental`: Enable/disable the experimental timeline view (default: true).
* `aimd.preview.buttonText`: Customize the status bar button text.
* `aimd.preview.buttonIcon`: Change the status bar icon (uses VS Code Codicons).
* `aimd.preview.buttonPriority`: Adjust the position of the status bar button.

## Requirements

* VS Code version 1.74.0 or higher.

## Release Notes

### 0.2.1

Theme and styling refinements:
- **Westlake Theme**: A new "Swedish Minimalist" design language.
- **Dark Mode**: Complete dark mode support across all components.
- **Check Component Polish**: Improved visual feedback and theme adaptivity.

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
