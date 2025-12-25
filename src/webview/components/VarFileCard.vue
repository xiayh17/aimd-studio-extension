<template>
  <div 
    class="var-file-card" 
    :class="{ 'is-dragover': isDragOver, 'has-file': hasFile, 'compact': !hasFile }"
    @dragover.prevent="isDragOver = true"
    @dragleave.prevent="isDragOver = false"
    @drop.prevent="handleDrop"
  >
    <!-- Header (Only shown when has file) -->
    <div class="file-header" v-if="hasFile">
      <div class="header-info">
        <span class="type-badge">{{ displayType }}</span>
        <span class="file-name" :title="displayValue">{{ fileName }}</span>
      </div>
      <div class="actions">
        <button class="action-btn" @click="handleOpen" title="Open File">
          <i class="codicon codicon-eye"></i>
        </button>
        <button class="action-btn danger" @click="handleClear" title="Remove File">
          <i class="codicon codicon-trash"></i>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="file-content" v-if="hasFile">
      <!-- Preview (Image/Video) - Only show if we have actual preview data -->
      <div v-if="isPreviewable && formattedSrc" class="preview-container">
        <img v-if="isImage" :src="formattedSrc" alt="Preview" />
        <video v-if="isVideo" :src="formattedSrc" controls></video>
      </div>
      
      <!-- Icon Placeholder (Non-previewable OR no preview URL) -->
      <div v-if="!isPreviewable || !formattedSrc" class="file-icon-placeholder">
        <i class="codicon codicon-file-media" style="font-size: 32px; color: var(--vscode-textLink-foreground);"></i>
        <span class="file-path">{{ fileName }}</span>
      </div>
    </div>

    <!-- Checkbox/Button Mode (when !hasFile) -->
    <div v-if="!hasFile" class="upload-trigger">
        <button 
            class="upload-btn" 
            @click="handleSelect" 
            :title="description || 'Click to select file'"
        >
            <i class="codicon codicon-cloud-upload"></i>
            <span class="btn-text">{{ title || 'Upload File' }}</span>
            <span class="type-hint" v-if="!title">{{ displayType }}</span>
        </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
  name: string;
  varType: string;
  defaultValue?: string; // File path or ID
  calculatedValue?: string;
  title?: string;
  description?: string;
  isRecording?: string; // Passed as attribute 'true'/'false'
  sessionValue?: string;
  sessionPreview?: string; // Base64 data URL for preview
}>();

const vscode = (window as any).vscode;
const isDragOver = ref(false);

const isRecordingMode = computed(() => props.isRecording === 'true');

const displayValue = computed(() => {
  // Priority: sessionValue (if recording) > calculatedValue > defaultValue
  if (isRecordingMode.value && props.sessionValue) return props.sessionValue;
  return props.calculatedValue || props.defaultValue || '';
});

const hasFile = computed(() => !!displayValue.value);

const fileName = computed(() => {
  const path = displayValue.value;
  if (!path) return '';
  return path.split(/[/\\]/).pop() || path;
});

const displayType = computed(() => {
  return props.varType.replace('FileId', '').toUpperCase();
});

const acceptType = computed(() => {
    // Map varType to accept
    const map: Record<string, string> = {
        'FileIdPNG': '.png',
        'FileIdJPG': '.jpg,.jpeg',
        'FileIdJPEG': '.jpg,.jpeg',
        'FileIdTIFF': '.tiff',
        'FileIdPDF': '.pdf',
        'FileIdCSV': '.csv',
        'FileIdMP4': '.mp4',
    };
    return map[props.varType] || '*/*';
});

const isImage = computed(() => {
    const ext = fileName.value.toLowerCase();
    return ext.endsWith('.png') || ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.gif');
});

const isVideo = computed(() => {
    const ext = fileName.value.toLowerCase();
    return ext.endsWith('.mp4') || ext.endsWith('.webm');
});

const isPreviewable = computed(() => isImage.value || isVideo.value);

const formattedSrc = computed(() => {
    // If sessionPreview is available (base64 data URL from upload), use it
    if (props.sessionPreview) {
        return props.sessionPreview;
    }
    // If it's a file ID (Record Mode), we can't preview without base64 data
    if (displayValue.value && displayValue.value.includes('airalogy.id.file')) {
        return '';
    }
    return displayValue.value;
});

const handleSelect = () => {
    if (isRecordingMode.value) {
        vscode.postMessage({
            type: 'session:upload',
            payload: {
                varId: props.name,
                // filePath missing -> nativeBridge will open dialog
            }
        });
    } else {
        vscode.postMessage({
            type: 'file:select',
            payload: {
                fieldName: props.name,
                accept: acceptType.value
            }
        });
    }
};

const handleOpen = () => {
    vscode.postMessage({
        type: 'nav:open-resource',
        payload: {
            resourceId: props.name,
            contentType: 'file',
            filePath: displayValue.value
        }
    });
};

const handleClear = () => {
    // TODO: Send update to clear value?
    console.log('Clear not implemented yet');
};

const handleDrop = (e: DragEvent) => {
    isDragOver.value = false;
    if (e.dataTransfer?.files.length) {
        const file = e.dataTransfer.files[0];
        // Electron adds 'path' property to File object
        const filePath = (file as any).path; 
        
        if (filePath) {
             if (isRecordingMode.value) {
                 vscode.postMessage({
                    type: 'session:upload',
                    payload: {
                        varId: props.name,
                        filePath: filePath
                    }
                });
             } else {
                 vscode.postMessage({
                    type: 'file:upload',
                    payload: {
                        fieldName: props.name,
                        sourceUri: filePath
                    }
                });
             }
        }
    }
};
</script>

<style scoped>
.var-file-card {
  margin: 8px 0;
  transition: all 0.2s;
}

/* Container styling changes when content is present */
.var-file-card.has-file {
  border: 1px solid var(--vscode-widget-border);
  border-radius: 6px;
  background: var(--vscode-editor-background);
  overflow: hidden;
}

.var-file-card.compact {
    border: none;
    background: transparent;
}

.var-file-card.is-dragover {
    outline: 2px dashed var(--vscode-focusBorder);
    outline-offset: -2px;
}

/* Header */
.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid var(--vscode-widget-border);
  background: var(--vscode-editor-lineHighlightBackground);
}

.header-info {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
}

.type-badge {
    font-size: 10px;
    font-weight: 700;
    color: var(--vscode-badge-foreground);
    background: var(--vscode-badge-background);
    padding: 2px 4px;
    border-radius: 3px;
}

.file-name {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.actions {
    display: flex;
    gap: 4px;
}

.action-btn {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 3px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--vscode-icon-foreground);
}

.action-btn:hover {
  background-color: var(--vscode-toolbar-hoverBackground);
}

.action-btn.danger:hover {
    color: var(--vscode-errorForeground);
}

/* Content */
.file-content {
    padding: 12px;
}

.preview-container {
    display: flex;
    justify-content: center;
    background: var(--vscode-editor-inactiveSelectionBackground);
    border-radius: 4px;
    overflow: hidden;
    max-height: 200px;
}

.preview-container img,
.preview-container video {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
}

.file-icon-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px;
    background: var(--vscode-editor-inactiveSelectionBackground);
    border-radius: 4px;
}

.file-path {
    font-size: 11px;
    color: var(--vscode-descriptionForeground);
    word-break: break-all;
    text-align: center;
}

/* Upload Button Styling */
.upload-trigger {
    display: flex;
    align-items: center;
}

.upload-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--vscode-button-secondaryBackground);
    color: var(--vscode-button-secondaryForeground);
    border: 1px solid var(--vscode-widget-border);
    border-radius: 4px;
    cursor: pointer;
    font-family: var(--vscode-font-family);
    font-size: 13px;
    line-height: 1.4;
    transition: all 0.2s;
    user-select: none;
}

.upload-btn:hover {
    background: var(--vscode-button-secondaryHoverBackground);
    border-color: var(--vscode-focusBorder);
}

.upload-btn:active {
    transform: translateY(1px);
}

.upload-btn i {
    font-size: 16px;
}

.btn-text {
    font-weight: 500;
}

.type-hint {
    font-size: 11px;
    opacity: 0.7;
    margin-left: 4px;
}
</style>
