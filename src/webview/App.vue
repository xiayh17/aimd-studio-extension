<template>
  <div class="aimd-preview" :class="themeClass" :data-design-theme="designTheme">
    <div v-if="loading" class="aimd-loading">Loading...</div>
    <div v-else class="aimd-content">
      <!-- Render HTML content with component injection -->
      <div v-html="renderedContent"></div>
    </div>
    
    <!-- Variable View Mode Toggle -->
    <VariableToolbar 
      :mode="currentMode" 
      :theme="designTheme" 
      @mode-change="handleModeChange" 
      @theme-change="handleThemeChange" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import VariableToolbar from './components/VariableToolbar.vue';
import { scrollToLine } from './scrollSync';

// VS Code API for communication with extension
declare const acquireVsCodeApi: () => {
  postMessage: (message: any) => void;
  getState: () => any;
  setState: (state: any) => void;
};

const vscode = acquireVsCodeApi();

// Reactive state
const content = ref('');
const loading = ref(true);
const designTheme = ref<'elsevier' | 'modern' | 'clinical' | 'westlake'>('elsevier'); // Default to Elsevier (Green)
const currentMode = ref(1); // Default to 'Value' mode

// Computed
const themeClass = computed(() => `theme-${designTheme.value}`);
const renderedContent = computed(() => content.value);

// Message handler for extension communication
function handleMessage(event: MessageEvent) {
  const message = event.data;
  
  switch (message.type) {
    case 'update':
      content.value = message.content;
      loading.value = false;
      // Initialize interactions after content update
      nextTick(() => {
        initializeInteractions();
        broadcastMode(currentMode.value);
        broadcastTheme(designTheme.value);
      });
      break;
    case 'theme':
      // Optionally handle external theme set requests
      if (['elsevier', 'modern', 'clinical', 'westlake'].includes(message.theme)) {
        designTheme.value = message.theme;
        broadcastTheme(message.theme);
      }
      break;
    case 'scroll':
      // Element-based scroll sync from source editor
      // message.line is the source line number (0-indexed)
      if (typeof message.line === 'number') {
        scrollToLine(message.line);
      }
      break;
  }
}

function handleThemeChange(newTheme: 'elsevier' | 'modern' | 'clinical' | 'westlake') {
  designTheme.value = newTheme;
  broadcastTheme(newTheme);
  // Persist theme preference
  vscode.setState({ ...vscode.getState(), designTheme: newTheme });
}

function handleModeChange(modeIndex: number) {
  currentMode.value = modeIndex;
  broadcastMode(modeIndex);
}

function broadcastMode(modeIndex: number) {
  const modes = ['id', 'value', 'title', 'type'];
  const nextModeName = modes[modeIndex];
  
  // Broadcast new mode to all var-input custom elements
  document.querySelectorAll('var-input').forEach(el => {
    el.setAttribute('view-mode', nextModeName);
  });
  
  // Broadcast to var-table elements
  document.querySelectorAll('var-table').forEach(el => {
    el.setAttribute('view-mode', nextModeName);
  });

  // Broadcast to ref-tag elements
  document.querySelectorAll('ref-tag').forEach(el => {
    el.setAttribute('view-mode', nextModeName);
  });
}

function broadcastTheme(themeName: string) {
  const elements = [
    'var-input',
    'var-table',
    'step-card',
    'callout-block',
    'ref-tag',
    'check-pill'
  ];
  
  elements.forEach(tagName => {
    document.querySelectorAll(tagName).forEach(el => {
      el.setAttribute('data-design-theme', themeName);
    });
  });
}

// Initialize interaction handlers for the rendered content
function initializeInteractions() {
  // Reference tag jump handlers (Event Delegation)
  const contentContainer = document.querySelector('.aimd-content');
  if (contentContainer) {
    contentContainer.addEventListener('jump', (e: any) => {
      const target = e.detail?.target;
      if (target) {
        // Try both step-id (StepCard) and data-variable-name (VarInput)
        const element = document.querySelector(`[step-id="${target}"], [name="${target}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('aimd-highlight-flash');
          setTimeout(() => element.classList.remove('aimd-highlight-flash'), 1500);
        }
      }
    });
  }
}

onMounted(() => {
  window.addEventListener('message', handleMessage);
  
  // Restore user theme preference
  const savedState = vscode.getState();
  if (savedState?.designTheme) {
    designTheme.value = savedState.designTheme;
  }

  // Initial broadcast of theme
  nextTick(() => {
    broadcastTheme(designTheme.value);
  });
  
  // Notify extension that webview is ready
  vscode.postMessage({ type: 'ready' });
});

onUnmounted(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<style>
.aimd-preview {
  font-family: 'Inter', var(--vscode-font-family), sans-serif;
  font-size: 15px;
  line-height: 1.7;
  padding: 24px;
  color: var(--aimd-text-primary);
  background-color: var(--aimd-bg-page);
}

.aimd-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--vscode-descriptionForeground);
}

.aimd-content {
  max-width: 960px;
  margin: 0 auto;
}

/* Chevron rotation for collapsible steps */
.aimd-chevron {
  transition: transform 0.2s ease;
}

.aimd-chevron.collapsed {
  transform: rotate(-90deg);
}

/* Highlight flash animation */
@keyframes highlight-flash {
  0%, 100% { box-shadow: none; }
  25%, 75% { box-shadow: 0 0 0 3px #22c55e; }
  50% { box-shadow: 0 0 0 5px #22c55e; }
}

.aimd-highlight-flash {
  animation: highlight-flash 1.5s ease-in-out;
}

/* ==========================================================================
   Code Block Styling
   ========================================================================== */

/* Base Styles */
.aimd-content code {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.85em;
  padding: 0.2em 0.4em;
  border-radius: 4px;
}

.aimd-content pre {
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  line-height: 1.5;
  margin: 1em 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.aimd-content pre code {
  padding: 0;
  background-color: transparent;
  color: inherit;
  font-size: 0.9em;
  border: none;
}

/* === Theme: Modern (Darker blocks, soft inline) === */
[data-design-theme="modern"] .aimd-content code:not(pre code) {
  background-color: var(--aimd-code-bg);
  color: var(--aimd-code-text);
  font-weight: 500;
}

/* Modern blocks: Dark background for contrast pop */
[data-design-theme="modern"] .aimd-content pre {
  background-color: var(--aimd-pre-bg);
  color: var(--aimd-pre-text);
  border: 1px solid var(--aimd-pre-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* === Theme: Elsevier (Journal, minimalistic) === */
[data-design-theme="elsevier"] .aimd-content code:not(pre code) {
  background-color: var(--aimd-bg-tertiary);
  border: 1px solid var(--aimd-border-light);
  color: var(--aimd-text-primary);
}

/* Journal blocks: Light, bordered, academic feel */
[data-design-theme="elsevier"] .aimd-content pre {
  background-color: var(--aimd-bg-secondary);
  border-top: 2px solid var(--aimd-border-light);
  border-bottom: 2px solid var(--aimd-border-light);
  border-left: none;
  border-right: none;
  border-radius: 0;
  color: var(--aimd-text-primary);
}

/* === Theme: Clinical (High Contrast, Sterile) === */
[data-design-theme="clinical"] .aimd-content code:not(pre code) {
  background-color: var(--aimd-bg-primary);
  border: 1px solid var(--aimd-border-medium);
  color: var(--aimd-text-primary);
  font-weight: 600;
}

/* Clinical blocks: Boxed, white, status-like stripe */
[data-design-theme="clinical"] .aimd-content pre {
  background-color: var(--aimd-bg-primary);
  border: 1px solid var(--aimd-border-medium);
  border-left: 4px solid var(--aimd-text-secondary);
  color: var(--aimd-text-primary);
  border-radius: 2px;
}

/* === Theme: Westlake (Swedish Minimalism) === */
[data-design-theme="westlake"] .aimd-content code:not(pre code) {
  background-color: rgba(0, 73, 143, 0.06);
  border: none;
  border-bottom: 1px solid var(--aimd-westlake-primary, #00498F);
  color: var(--aimd-westlake-primary, #00498F);
  font-weight: 600;
  border-radius: 0;
}

/* Westlake blocks: Clean, minimal with blue top border */
[data-design-theme="westlake"] .aimd-content pre {
  background-color: var(--aimd-bg-secondary);
  border: none;
  border-top: 2px solid var(--aimd-westlake-primary, #00498F);
  color: var(--aimd-text-primary);
  border-radius: 0;
}

/* Dark mode overrides for Modern theme logic if needed */
/* Dark mode overrides are now handled by aimd-* variables in theme.css */
</style>
