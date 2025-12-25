<template>
  <div class="image-resizer">
    <!-- File Upload Area -->
    <div class="upload-section">
      <div 
        class="drop-zone"
        :class="{ 'dragging': isDragging }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          style="display: none;"
        />
        
        <div v-if="!originalImage" class="drop-zone-content">
          <div class="upload-icon">📸</div>
          <h3>Drop image here or click to browse</h3>
          <p>Supports: JPG, PNG, GIF, WebP, BMP</p>
          <p class="privacy-note">🔒 Processing happens in your browser - no upload!</p>
        </div>

        <div v-else class="image-preview">
          <img :src="originalImage" alt="Original" />
          <div class="image-info">
            <p><strong>Original:</strong> {{ originalWidth }}×{{ originalHeight }}px</p>
            <p><strong>Size:</strong> {{ formatFileSize(originalSize) }}</p>
          </div>
          <button @click.stop="clearImage" class="btn btn-secondary btn-sm">
            ❌ Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Resize Options -->
    <div v-if="originalImage" class="options-panel">
      <h3 class="options-title">Resize Options</h3>

      <!-- Dimension Input -->
      <div class="option-group">
        <div class="dimension-inputs">
          <div class="input-group">
            <label>Width (px)</label>
            <input
              v-model.number="newWidth"
              type="number"
              min="1"
              :max="originalWidth"
              class="form-input"
              @input="updateHeight"
            />
          </div>

          <div class="lock-aspect">
            <button
              @click="lockAspectRatio = !lockAspectRatio"
              class="btn btn-icon"
              :class="{ active: lockAspectRatio }"
              title="Lock aspect ratio"
            >
              {{ lockAspectRatio ? '🔒' : '🔓' }}
            </button>
          </div>

          <div class="input-group">
            <label>Height (px)</label>
            <input
              v-model.number="newHeight"
              type="number"
              min="1"
              :max="originalHeight"
              class="form-input"
              @input="updateWidth"
            />
          </div>
        </div>

        <div class="quick-resize">
          <label>Quick Resize:</label>
          <div class="btn-group-compact">
            <button @click="resizeByPercent(25)" class="btn btn-sm btn-secondary">25%</button>
            <button @click="resizeByPercent(50)" class="btn btn-sm btn-secondary">50%</button>
            <button @click="resizeByPercent(75)" class="btn btn-sm btn-secondary">75%</button>
            <button @click="resetDimensions" class="btn btn-sm btn-secondary">100%</button>
          </div>
        </div>
      </div>

      <!-- Format Selection -->
      <div class="option-group">
        <label>Output Format:</label>
        <div class="format-options">
          <label class="radio-option">
            <input type="radio" v-model="outputFormat" value="image/jpeg" />
            <span>JPEG</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="outputFormat" value="image/png" />
            <span>PNG</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="outputFormat" value="image/webp" />
            <span>WebP</span>
          </label>
        </div>
      </div>

      <!-- Quality Slider (for JPEG/WebP) -->
      <div v-if="outputFormat !== 'image/png'" class="option-group">
        <label>Quality: {{ quality }}%</label>
        <input
          v-model.number="quality"
          type="range"
          min="1"
          max="100"
          class="range-input"
        />
        <div class="quality-labels">
          <span>Low (smaller file)</span>
          <span>High (better quality)</span>
        </div>
      </div>

      <!-- Resize Button -->
      <button @click="resizeImage" class="btn btn-primary btn-large">
        🎨 Resize Image
      </button>
    </div>

    <!-- Result -->
    <div v-if="resizedImage" class="result-section">
      <h3>Resized Image</h3>

      <div class="comparison">
        <div class="comparison-item">
          <h4>Original</h4>
          <img :src="originalImage" alt="Original" />
          <p>{{ originalWidth }}×{{ originalHeight }}px</p>
          <p>{{ formatFileSize(originalSize) }}</p>
        </div>

        <div class="comparison-arrow">→</div>

        <div class="comparison-item">
          <h4>Resized</h4>
          <img :src="resizedImage" alt="Resized" />
          <p>{{ newWidth }}×{{ newHeight }}px</p>
          <p>{{ formatFileSize(resizedSize) }}</p>
          <p class="size-reduction" :class="{ positive: sizeReduction > 0 }">
            {{ sizeReduction > 0 ? '↓' : '↑' }} {{ Math.abs(sizeReduction) }}%
          </p>
        </div>
      </div>

      <div class="btn-group">
        <button @click="downloadImage" class="btn btn-success">
          ⬇️ Download Resized Image
        </button>
        <button @click="copyToClipboard" class="btn btn-secondary">
          📋 Copy to Clipboard
        </button>
        <button @click="startOver" class="btn btn-secondary">
          🔄 Start Over
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// State
const fileInput = ref(null);
const isDragging = ref(false);

// Original image
const originalImage = ref('');
const originalWidth = ref(0);
const originalHeight = ref(0);
const originalSize = ref(0);
const originalFileName = ref('');

// Resize options
const newWidth = ref(0);
const newHeight = ref(0);
const lockAspectRatio = ref(true);
const outputFormat = ref('image/jpeg');
const quality = ref(85);

// Result
const resizedImage = ref('');
const resizedSize = ref(0);

// Computed
const aspectRatio = computed(() => originalWidth.value / originalHeight.value);

const sizeReduction = computed(() => {
  if (!originalSize.value || !resizedSize.value) return 0;
  return Math.round(((originalSize.value - resizedSize.value) / originalSize.value) * 100);
});

// Methods
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    loadImage(file);
  }
};

const handleDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files?.[0];
  if (file && file.type.startsWith('image/')) {
    loadImage(file);
  } else {
    alert('Please drop an image file');
  }
};

const loadImage = (file) => {
  originalFileName.value = file.name;
  originalSize.value = file.size;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      originalImage.value = e.target.result;
      originalWidth.value = img.width;
      originalHeight.value = img.height;
      newWidth.value = img.width;
      newHeight.value = img.height;
      resizedImage.value = '';
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

const updateHeight = () => {
  if (lockAspectRatio.value && newWidth.value) {
    newHeight.value = Math.round(newWidth.value / aspectRatio.value);
  }
};

const updateWidth = () => {
  if (lockAspectRatio.value && newHeight.value) {
    newWidth.value = Math.round(newHeight.value * aspectRatio.value);
  }
};

const resizeByPercent = (percent) => {
  newWidth.value = Math.round(originalWidth.value * (percent / 100));
  newHeight.value = Math.round(originalHeight.value * (percent / 100));
};

const resetDimensions = () => {
  newWidth.value = originalWidth.value;
  newHeight.value = originalHeight.value;
};

const resizeImage = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = newWidth.value;
  canvas.height = newHeight.value;

  const img = new Image();
  img.onload = () => {
    // Use better image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(img, 0, 0, newWidth.value, newHeight.value);
    
    const qualityValue = outputFormat.value === 'image/png' ? 1 : quality.value / 100;
    
    canvas.toBlob(
      (blob) => {
        resizedSize.value = blob.size;
        resizedImage.value = URL.createObjectURL(blob);
      },
      outputFormat.value,
      qualityValue
    );
  };
  img.src = originalImage.value;
};

const downloadImage = () => {
  const link = document.createElement('a');
  const extension = outputFormat.value.split('/')[1];
  const baseName = originalFileName.value.replace(/\.[^/.]+$/, '');
  link.download = `${baseName}_resized.${extension}`;
  link.href = resizedImage.value;
  link.click();
};

const copyToClipboard = async () => {
  try {
    const response = await fetch(resizedImage.value);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
    alert('✅ Image copied to clipboard!');
  } catch (error) {
    console.error('Copy failed:', error);
    alert('⚠️ Copy to clipboard failed. Try downloading instead.');
  }
};

const clearImage = () => {
  originalImage.value = '';
  resizedImage.value = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const startOver = () => {
  clearImage();
};

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};
</script>

<style scoped>
.image-resizer {
  max-width: 900px;
  margin: 0 auto;
}

/* Drop Zone */
.drop-zone {
  border: 3px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-surface);
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.drop-zone:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-alpha);
}

.drop-zone.dragging {
  border-color: var(--color-primary);
  background: var(--color-primary-alpha);
  transform: scale(1.02);
}

.drop-zone-content {
  width: 100%;
}

.upload-icon {
  font-size: 4rem;
  margin-bottom: var(--space-lg);
}

.drop-zone h3 {
  margin-bottom: var(--space-sm);
  color: var(--color-text);
}

.drop-zone p {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.privacy-note {
  color: var(--color-success) !important;
  font-weight: var(--font-weight-semibold);
}

/* Image Preview */
.image-preview {
  width: 100%;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  object-fit: contain;
}

.image-info {
  margin-bottom: var(--space-md);
}

.image-info p {
  margin-bottom: var(--space-xs);
  color: var(--color-text-secondary);
}

/* Options Panel */
.options-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-top: var(--space-xl);
}

.options-title {
  margin-bottom: var(--space-lg);
  color: var(--color-text);
}

.option-group {
  margin-bottom: var(--space-xl);
}

.option-group label {
  display: block;
  margin-bottom: var(--space-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

/* Dimension Inputs */
.dimension-inputs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-md);
  align-items: end;
  margin-bottom: var(--space-lg);
}

.input-group label {
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-xs);
}

.lock-aspect {
  padding-bottom: 12px;
}

.btn-icon {
  width: 48px;
  height: 48px;
  font-size: var(--font-size-xl);
  padding: 0;
  background: var(--color-surface-hover);
  border: 2px solid var(--color-border);
}

.btn-icon.active {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Quick Resize */
.quick-resize {
  margin-top: var(--space-md);
}

.btn-group-compact {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.btn-sm {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
}

/* Format Options */
.format-options {
  display: flex;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  padding: var(--space-sm) var(--space-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.radio-option:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-alpha);
}

.radio-option input[type="radio"] {
  cursor: pointer;
}

/* Quality Slider */
.range-input {
  width: 100%;
  margin: var(--space-md) 0;
}

.quality-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* Buttons */
.btn-large {
  width: 100%;
  padding: var(--space-lg);
  font-size: var(--font-size-lg);
}

/* Result Section */
.result-section {
  margin-top: var(--space-2xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.result-section h3 {
  margin-bottom: var(--space-xl);
  text-align: center;
  color: var(--color-text);
}

/* Comparison */
.comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-xl);
  align-items: center;
  margin-bottom: var(--space-xl);
}

.comparison-item {
  text-align: center;
}

.comparison-item h4 {
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.comparison-item img {
  max-width: 100%;
  max-height: 250px;
  border-radius: var(--radius-md);
  border: 2px solid var(--color-border);
  margin-bottom: var(--space-md);
  object-fit: contain;
}

.comparison-item p {
  margin-bottom: var(--space-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.comparison-arrow {
  font-size: var(--font-size-3xl);
  color: var(--color-primary);
  font-weight: bold;
}

.size-reduction {
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.size-reduction.positive {
  color: var(--color-success);
}

/* Responsive */
@media (max-width: 768px) {
  .dimension-inputs {
    grid-template-columns: 1fr;
  }

  .lock-aspect {
    order: 3;
    padding-bottom: 0;
    padding-top: var(--space-md);
  }

  .comparison {
    grid-template-columns: 1fr;
  }

  .comparison-arrow {
    transform: rotate(90deg);
  }

  .btn-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>