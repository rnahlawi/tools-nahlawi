<template>
  <div class="base64-encoder">
    <!-- Mode Selector -->
    <div class="mode-selector">
      <button 
        @click="mode = 'encode'"
        :class="['btn', 'btn-mode', { active: mode === 'encode' }]"
      >
        🔒 Encode
      </button>
      <button 
        @click="mode = 'decode'"
        :class="['btn', 'btn-mode', { active: mode === 'decode' }]"
      >
        🔓 Decode
      </button>
    </div>

    <!-- Input Area -->
    <div class="form-group">
      <label class="form-label">
        {{ mode === 'encode' ? 'Text to Encode:' : 'Base64 to Decode:' }}
      </label>
      <textarea 
        v-model="input"
        @input="process"
        class="form-textarea"
        :placeholder="mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'"
        rows="10"
      ></textarea>
    </div>

    <!-- Output Area -->
    <div class="form-group">
      <label class="form-label">
        {{ mode === 'encode' ? 'Base64 Encoded:' : 'Decoded Text:' }}
      </label>
      <textarea 
        v-model="output"
        class="form-textarea output-textarea"
        :placeholder="mode === 'encode' ? 'Encoded Base64 will appear here...' : 'Decoded text will appear here...'"
        readonly
        rows="10"
      ></textarea>
    </div>

    <!-- Error Message -->
    <transition name="fade">
      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>
    </transition>

    <!-- Statistics -->
    <div v-if="output && !errorMessage" class="stats-section">
      <div class="stat-item">
        <span class="stat-label">Input Length:</span>
        <span class="stat-value">{{ input.length }} chars</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Output Length:</span>
        <span class="stat-value">{{ output.length }} chars</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Size Change:</span>
        <span class="stat-value" :class="sizeChangeClass">
          {{ sizeChangeText }}
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="button-group">
      <button @click="copyOutput" class="btn btn-success" :disabled="!output">
        📋 Copy Result
      </button>
      <button @click="swapInputOutput" class="btn btn-secondary" :disabled="!output">
        ⇄ Swap
      </button>
      <button @click="clearAll" class="btn btn-secondary">
        🗑️ Clear
      </button>
    </div>

    <!-- Copy Success Message -->
    <transition name="fade">
      <div v-if="showCopyMessage" class="success-message">
        ✅ Copied to clipboard!
      </div>
    </transition>

    <!-- Info Box -->
    <div class="info-box">
      <h3>About Base64 Encoding</h3>
      <p>
        Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
        It's commonly used for:
      </p>
      <ul>
        <li>Encoding binary data in URLs and emails</li>
        <li>Storing complex data in JSON or XML</li>
        <li>Embedding images in HTML/CSS</li>
        <li>Data transmission over text-based protocols</li>
      </ul>
      <p class="privacy-note">
        <strong>Privacy:</strong> All encoding/decoding happens locally in your browser. 
        No data is sent to any server.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const mode = ref<'encode' | 'decode'>('encode');
const input = ref('');
const output = ref('');
const errorMessage = ref('');
const showCopyMessage = ref(false);

const process = () => {
  errorMessage.value = '';
  
  if (!input.value) {
    output.value = '';
    return;
  }

  try {
    if (mode.value === 'encode') {
      // Encode to Base64
      output.value = btoa(unescape(encodeURIComponent(input.value)));
    } else {
      // Decode from Base64
      output.value = decodeURIComponent(escape(atob(input.value)));
    }
  } catch (err) {
    errorMessage.value = mode.value === 'encode' 
      ? 'Failed to encode. Check your input.'
      : 'Invalid Base64 string. Please check your input.';
    output.value = '';
  }
};

const sizeChangeClass = computed(() => {
  if (!input.value || !output.value) return '';
  return output.value.length > input.value.length ? 'increase' : 'decrease';
});

const sizeChangeText = computed(() => {
  if (!input.value || !output.value) return '';
  
  const diff = output.value.length - input.value.length;
  const percent = ((Math.abs(diff) / input.value.length) * 100).toFixed(1);
  
  if (diff > 0) {
    return `+${percent}% (${diff} chars)`;
  } else if (diff < 0) {
    return `-${percent}% (${Math.abs(diff)} chars)`;
  } else {
    return 'No change';
  }
});

const copyOutput = async () => {
  if (output.value) {
    try {
      await navigator.clipboard.writeText(output.value);
      showCopyMessage.value = true;
      setTimeout(() => {
        showCopyMessage.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};

const swapInputOutput = () => {
  const temp = input.value;
  input.value = output.value;
  output.value = temp;
  mode.value = mode.value === 'encode' ? 'decode' : 'encode';
  process();
};

const clearAll = () => {
  input.value = '';
  output.value = '';
  errorMessage.value = '';
};
</script>

<style scoped>
.base64-encoder {
  width: 100%;
}

.mode-selector {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  background: var(--color-surface-hover);
  padding: var(--space-xs);
  border-radius: var(--radius-md);
}

.btn-mode {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
}

.btn-mode:hover {
  color: var(--color-text);
}

.btn-mode.active {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.form-textarea {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  word-break: break-all;
}

.output-textarea {
  background: var(--color-primary-alpha);
  cursor: default;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.stats-section {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.stat-value.increase {
  color: var(--color-error);
}

.stat-value.decrease {
  color: var(--color-success);
}

.button-group {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.button-group .btn {
  flex: 1;
  min-width: 150px;
}

.success-message {
  background: var(--color-success);
  color: white;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  text-align: center;
  margin-top: var(--space-md);
  font-weight: var(--font-weight-medium);
}

.info-box {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-top: var(--space-xl);
}

.info-box h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.info-box p {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.info-box ul {
  margin: var(--space-md) 0;
  padding-left: var(--space-xl);
}

.info-box li {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
}

.privacy-note {
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid var(--color-success);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  margin-top: var(--space-md);
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }

  .button-group .btn {
    width: 100%;
    min-width: unset;
  }

  .stats-section {
    flex-direction: column;
    gap: var(--space-md);
  }
}
</style>