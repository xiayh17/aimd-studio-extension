# Changelog

All notable changes to the "aimd-studio" extension will be documented in this file.

## [0.4.0] - 2025-12-26

### Added
- **Record Mode**: New session-based data recording workflow for experimental protocols.
  - Start/stop recording sessions with toggle button in toolbar
  - All variable inputs become editable during recording
  - Session values persist across preview refreshes
- **File Upload (Session)**: Upload files directly to recording sessions with automatic FileId generation.
  - Image preview with base64 data URL encoding
  - Support for PNG, JPG, TIFF, PDF, CSV, MP4 file types
- **Historical Records**: Load and manage previously recorded experimental data.
  - History button to browse and load saved records
  - Delete records with confirmation dialog
  - Rename records with custom aliases for easy identification
- **Secret Input**: Password visibility toggle for `IgnoreStr` type fields (API keys, tokens).
- **Cross-Record Linking**: `RecordId` type selector now queries actual historical records.

### Changed
- **VarFileCard**: Shows icon placeholder instead of black video player when preview is unavailable.
- **Mock Client**: Enhanced `Airalogy` client with session management, file upload, and record CRUD operations.

### Fixed
- **Import Error**: Fixed `AiralogyMockClient` vs `Airalogy` name mismatch that prevented model.py loading.
- **Value Reset**: Session values now persist across content refreshes in Record Mode.

## [0.3.2] - 2025-12-25

### Fixed
- **Missing Dependencies**: Implemented extension host bundling with `esbuild`. This fixes the "Cannot find module 'unified'" error when installing from the marketplace on clean environments.
- **Packaging Configuration**: Included bundled files and optimized `.vscodeignore` to ensure all runtime requirements are packed into the `.vsix`.

## [0.3.1] - 2025-12-25

### Added
- **Automated Build Pipeline**: PyInstaller-based compilation of Python backend to standalone binaries.
- **Multi-Platform CI**: GitHub Actions workflow for Windows, macOS (Intel & ARM), and Linux builds.
- **Automated Publishing**: GitHub Actions workflow for automatic publishing to VS Code Marketplace and Open VSX on release.
- **Platform Detection**: Extension automatically loads compiled binary or falls back to Python source.

### Changed
- **Runner Updates**: Migrated from deprecated `macos-13` to `macos-15` runners.

## [0.3.0] - 2025-12-25

### Added
- **Python Backend Integration**: Implemented binary sidecar pattern for Python backend support via JSON-RPC over stdio.
- **Backend Bridge**: New `AimdBackend` class for seamless TypeScript-Python communication.
- **Test Command**: Added `AIMD: Hello Backend` command for verifying Python integration.

### Changed
- **Preview Title**: Simplified from "AIMD Preview (Vue)" to "AIMD Preview".

### Fixed
- **Legacy Commands**: Removed unused `toggleExperimental` and `toggleVue` commands that caused errors.

## [0.2.1] - 2025-12-25

### Added
- **Westlake Theme**: New "Swedish Minimalist" design aesthetic with muted, sophisticated color palette for both light and dark modes.
- **Dark Mode Support**: Full dark mode implementation with centralized theme tokens in `theme.css`.
- **Check Component Enhancements**: Refined `{{check}}` styling with teal accent colors, adaptive theme colors, and "dimming" effect on checked state.

### Changed
- **Theme Architecture**: Centralized all color tokens using CSS custom properties for consistent theming across components.
- **Component Styling**: Updated `StepCard`, `Callout`, `VarTable`, `VarInput`, and `CheckPill` to use semantic theme variables.

### Fixed
- **Line Marker Visibility**: Resolved issue where source line markers were visible in preview by switching to invisible HTML comments.
- **Scroll Synchronization**: Improved element-based scroll sync accuracy with updated line number injection.

## [0.2.0] - 2025-12-24

### Added
- **Scientific Minimalist UI Redesign**: Transitioned from "Cyberpunk" to a cleaner, high-contrast, professional research aesthetic.
- **Unified Renderer Migration**: Replaced `marked` with the `Remark/Rehype` ecosystem for robust parsing and future extensibility.
- **Vue Webview Integration**: Full migration to Vue.js for the preview interface, enabling richer interactivity.
- **Theme Switching**: Introduced "Modern", "Journal", and "Clinical" themes with proper style encapsulation.
- **Hover Interactions**: Enhanced variable tooltips and hover states for better data visibility.

### Changed
- **Directory Structure**: Optimized `@src` organization for better modularity and maintainability.
- **Preview Engine**: Significant refactoring of the preview module (types, styles, components, scripts, parser).

### Fixed
- **Acorn Parsing Error**: Resolved parsing issues by switching to standard Unified pipeline.
- **Tooltip Visibility**: Fixed z-index and stacking context issues for variable tooltips.
- **Header Adoption**: Corrected logic for headers appearing immediately before step cards.
- **Webview Process Error**: Eliminated Node.js dependency leaks into the browser context.

## [0.1.0] - 2025-12-23

### Added
- Initial release of AIMD Studio.
- Core language support for `.aimd` files (syntax highlighting, grammar).
- **ProFlow-inspired Timeline Preview**: A high-fidelity, interactive visualization tool for protocol files.
- **Experimental Renderer**: Toggleable advanced UI with card-based layouts and step navigation.
- Status bar integration for quick access to preview functionality.
- Customization options for status bar appearance (icon, text, priority).
