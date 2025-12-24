<template>
  <span class="aimd-var-wrapper" @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <input
      type="text"
      class="aimd-var-input"
      :data-variable-name="name"
      :data-variable-type="variableType"
      :data-var-type="varType"
      :data-default-value="defaultValue"
      :placeholder="displayName"
      :value="displayValue"
      readonly
      @click="handleClick"
    />
    <span v-if="tooltipVisible" class="aimd-var-tooltip">
      <span class="aimd-tooltip-header">
        <span class="aimd-tooltip-title">{{ displayName }}</span>
        <span class="aimd-tooltip-type">{{ varType }}</span>
      </span>
      <span class="aimd-tooltip-meta">
        <span v-if="description" class="aimd-tooltip-desc">{{ description }}</span>
        <span v-if="constraints" class="aimd-tooltip-constraints">{{ constraints }}</span>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  name: string;
  variableType?: string;
  varType?: string;
  title?: string;
  defaultValue?: string;
  description?: string;
  min?: string;
  max?: string;
  ge?: string;
  le?: string;
  gt?: string;
  lt?: string;
  viewMode?: string; // 'id' | 'value' | 'title' | 'type'
}

const props = withDefaults(defineProps<Props>(), {
  variableType: 'var',
  varType: 'str',
  title: '',
  defaultValue: '',
  description: '',
  viewMode: 'value'
});

const tooltipVisible = ref(false);

const displayValue = computed(() => {
  if (props.viewMode === 'value') return props.defaultValue;
  if (props.viewMode === 'type') return props.varType;
  if (props.viewMode === 'title') return props.title || displayName.value;
  return props.name;
});

const displayName = computed(() => {
  if (props.title) return props.title;
  // Convert snake_case to Title Case
  return props.name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
});

const constraints = computed(() => {
  const parts: string[] = [];
  if (props.min) parts.push(`min: ${props.min}`);
  if (props.max) parts.push(`max: ${props.max}`);
  if (props.ge) parts.push(`≥ ${props.ge}`);
  if (props.le) parts.push(`≤ ${props.le}`);
  if (props.gt) parts.push(`> ${props.gt}`);
  if (props.lt) parts.push(`< ${props.lt}`);
  return parts.join(', ');
});

function showTooltip() {
  tooltipVisible.value = true;
}

function hideTooltip() {
  tooltipVisible.value = false;
}

function handleClick() {
  // Emit event for parent to handle
}
</script>

<style scoped>
/* Variable Wrapper - Inline Flex for proper alignment */
.aimd-var-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin: 0 4px;
  vertical-align: middle;
  transition: z-index 0.1s;
}

.aimd-var-wrapper:hover {
  z-index: 100;
}

/* Base Input Style */
.aimd-var-input {
  display: inline-block;
  border: none;
  border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  font-size: 0.9em;
  padding: 1px 6px;
  margin: 0;
  text-align: center;
  min-width: 80px;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

/* ==========================================================================
   THEME: MODERN (Default)
   ========================================================================== */
:host([data-design-theme="modern"]) .aimd-var-input {
  background: rgba(22, 101, 52, 0.05);
  border-bottom: 2px solid var(--aimd-green-500, #16a34a);
  color: var(--aimd-green-800, #166534);
}

:host([data-design-theme="modern"]) .aimd-var-input:hover,
:host([data-design-theme="modern"]) .aimd-var-input:focus {
  background: rgba(22, 101, 52, 0.12);
  border-bottom-color: var(--aimd-green-700, #15803d);
}

/* Modern Dark Mode */
:global(body.vscode-dark) :host([data-design-theme="modern"]) .aimd-var-input {
  background: rgba(22, 197, 94, 0.1);
  color: #4ade80;
}

/* ==========================================================================
   THEME: ELSEVIER (Journal)
   ========================================================================== */
:host([data-design-theme="elsevier"]) .aimd-var-input {
  background: transparent;
  border-bottom: 1px dashed var(--aimd-var-elsevier-border, #94a3b8);
  color: var(--aimd-var-elsevier-text, #e2e8f0);
  font-family: "Georgia", serif;
  font-style: italic;
  padding: 0 4px;
}

:host([data-design-theme="elsevier"]) .aimd-var-input:hover,
:host([data-design-theme="elsevier"]) .aimd-var-input:focus {
  background: var(--aimd-var-elsevier-hover-bg, rgba(255, 255, 255, 0.08));
  border-bottom-style: solid;
  border-bottom-color: var(--aimd-var-elsevier-hover-border, #f1f5f9);
}

/* ==========================================================================
   THEME: CLINICAL (High Contrast)
   ========================================================================== */
:host([data-design-theme="clinical"]) .aimd-var-input {
  background: var(--aimd-bg-primary, #ffffff);
  border: 1px solid var(--aimd-border-medium, #cbd5e1);
  border-radius: 0;
  color: var(--aimd-text-primary, #0f172a);
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

:host([data-design-theme="clinical"]) .aimd-var-input:hover,
:host([data-design-theme="clinical"]) .aimd-var-input:focus {
  border-color: var(--aimd-status-success-icon, #16a34a);
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.1);
}

/* ==========================================================================
   THEME: WESTLAKE (Swedish Minimalism)
   Clean, precise, restrained color usage
   ========================================================================== */
:host([data-design-theme="westlake"]) .aimd-var-input {
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--aimd-var-westlake-border, #00498F);
  border-radius: 0;
  color: var(--aimd-var-westlake-text, #00498F);
  font-family: 'Inter', -apple-system, sans-serif;
  font-weight: 600;
  font-style: normal;
  padding: 2px 6px;
  letter-spacing: 0.01em;
}

:host([data-design-theme="westlake"]) .aimd-var-input:hover,
:host([data-design-theme="westlake"]) .aimd-var-input:focus {
  background: var(--aimd-var-westlake-hover-bg, rgba(0, 73, 143, 0.06));
  border-bottom-color: var(--aimd-var-westlake-hover-border, #F18B1C);
}

/* Tooltip Styles (Shared / Generic) */
.aimd-var-tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  margin-top: 8px;
  background-color: #ffffff;
  border: 1px solid var(--aimd-green-700, #15803d);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 12px;
  min-width: 200px;
  max-width: 320px;
  z-index: 10;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  text-align: left;
  display: block;
}

.aimd-var-tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -6px;
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent var(--aimd-green-700, #15803d) transparent;
}

.aimd-tooltip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 6px;
  margin-bottom: 6px;
}

.aimd-tooltip-title {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95em;
}

.aimd-tooltip-type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8em;
  color: var(--aimd-green-700, #15803d);
  background-color: var(--aimd-green-50, #f0fdf4);
  padding: 2px 6px;
  border-radius: 4px;
}

.aimd-tooltip-meta {
  font-size: 0.85em;
  color: var(--aimd-text-secondary, #64748b);
  display: block;
}

.aimd-tooltip-desc {
  margin-bottom: 4px;
  color: var(--aimd-text-tertiary, #94a3b8);
  font-style: italic;
  display: block;
}

.aimd-tooltip-constraints {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8em;
  color: var(--aimd-text-tertiary, #94a3b8);
  background: var(--aimd-bg-secondary, #f8fafc);
  padding: 2px 4px;
  border-radius: 2px;
  display: inline-block;
}
</style>
