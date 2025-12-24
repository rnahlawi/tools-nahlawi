<template>
  <div class="url-encoder">
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
        {{ mode === 'encode' ? 'URL/Text to Encode:' : 'Encoded URL to Decode:' }}
      </label>
      <textarea 
        v-model="input"
        @input="process"
        class="form-textarea"
        :placeholder="mode === 'encode' ? 'Enter URL or text...' : 'Enter encoded URL...'"
        rows="8"
      ></textarea>
    </div>

    <!-- Output Area -->
    <div class="form-group">
      <label class="form-label">
        {{ mode === 'encode' ? 'URL Encoded:' : 'Decoded URL/Text:' }}
      </label>
      <textarea 
        v-model="output"
        class="form-textarea output-textarea"
        :placeholder="mode === 'encode' ? 'Encoded URL will appear here...' : 'Decoded text will appear here...'"
        readonly
        rows="8"
      ></textarea>
    </div>

    <!-- Error Message -->
    <transition name="fade">
      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>
    </transition>

    <!-- Character Encoding Table -->
    <div v-if="output" class="encoding-table">
      <h3>Common Characters Encoded:</h3>
      <div class="table-grid">
        <div class="table-row">
          <span class="char">Space</span>
          <span class="encoded">%20</span>
        </div>
        <div class="table-row">
          <span class="char">!</span>
          <span class="encoded">%21</span>
        </div>
        <div class="table-row">
          <span class="char">#</span>
          <span class="encoded">%23</span>
        </div>
        <div class="table-row">
          <span class="char">$</span>
          <span class="encoded">%24</span>
        </div>
        <div class="table-row">
          <span class="char">%</span>
          <span class="encoded">%25</span>
        </div>
        <div class="table-row">
          <span class="char">&</span>
          <span class="encoded">%26</span>
        </div>
        <div class="table-row">
          <span class="char">=</span>
          <span class="encoded">%3D</span>
        </div>
        <div class="table-row">
          <span class="char">?</span>
          <span class="encoded">%3F</span>
        </div>
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
      <h3>About URL Encoding</h3>
      <p>
        URL encoding (percent-encoding) converts characters into a format that can be transmitted over the Internet. 
        Special characters are replaced with a '%' followed by two hexadecimal digits.
      </p>
      <h4>Common Use Cases:</h4>
      <ul>
        <li>Encoding query parameters in URLs</li>
        <li>Handling special characters in form data</li>
        <li>Processing international (Unicode) characters</li>
        <li>Working with spaces and reserved characters</li>
      </ul>
      <h4>Examples:</h4>
      <ul>
        <li><code>Hello World</code> → <code>Hello%20World</code></li>
        <li><code>user@example.com</code> → <code>user%40example.com</code></li>
        <li><code>a=1&b=2</code> → <code>a%3D1%26b%3D2</code></li>
      </ul>
      <p class="privacy-note">
        <strong>Privacy:</strong> All encoding/decoding happens locally in your browser. 
        No data is sent to any server.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
      // Encode URL
      output.value = encodeURIComponent(input.value);
    } else {
      // Decode URL
      output.value = decodeURIComponent(input.value);
    }
  } catch (err) {
    errorMessage.value = mode.value === 'encode' 
      ? 'Failed to encode. Check your input.'
      : 'Invalid encoded URL. Please check your input.';
    output.value = '';
  }
};

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
.url-encoder {
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

.encoding-table {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.encoding-table h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
  font-size: var(--font-size-base);
}

.table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-sm);
}

.table-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface-hover);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.char {
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}

.encoded {
  color: var(--color-primary);
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

.info-box h4 {
  color: var(--color-text);
  margin: var(--space-lg) 0 var(--space-sm);
  font-size: var(--font-size-base);
}

.info-box p {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.info-box ul {
  margin: var(--space-sm) 0;
  padding-left: var(--space-xl);
}

.info-box li {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
}

.info-box code {
  background: var(--color-surface);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-primary);
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

  .table-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .table-grid {
    grid-template-columns: 1fr;
  }
}
</style>