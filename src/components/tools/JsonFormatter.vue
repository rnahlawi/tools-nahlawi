<template>
  <div class="json-formatter">
    <!-- Input Area -->
    <div class="form-group">
      <label for="jsonInput" class="form-label">Enter JSON:</label>
      <textarea 
        id="jsonInput"
        v-model="inputJSON"
        class="form-textarea"
        placeholder='{"name": "John", "age": 30}'
        rows="12"
      ></textarea>
    </div>

    <!-- Action Buttons -->
    <div class="button-grid">
      <button @click="formatJSON" class="btn btn-primary">
        ✨ Format (Beautify)
      </button>
      <button @click="minifyJSON" class="btn btn-primary">
        🗜️ Minify
      </button>
      <button @click="validateJSON" class="btn btn-primary">
        ✅ Validate
      </button>
    </div>

    <!-- Formatting Options -->
    <div v-if="showOptions" class="options-panel">
      <label class="option-label">
        <span>Indentation:</span>
        <select v-model.number="indentSpaces" class="form-input option-select">
          <option :value="2">2 spaces</option>
          <option :value="4">4 spaces</option>
          <option :value="8">8 spaces</option>
        </select>
      </label>
      <label class="checkbox-label">
        <input type="checkbox" v-model="sortKeys">
        <span>Sort keys alphabetically</span>
      </label>
    </div>

    <!-- Validation Message -->
    <transition name="fade">
      <div v-if="validationMessage" :class="['validation-message', validationClass]">
        {{ validationIcon }} {{ validationMessage }}
      </div>
    </transition>

    <!-- Output Area -->
    <div v-if="outputJSON" class="form-group">
      <label for="jsonOutput" class="form-label">Output:</label>
      <textarea 
        id="jsonOutput"
        v-model="outputJSON"
        class="form-textarea output-textarea"
        readonly
        rows="12"
      ></textarea>
    </div>

    <!-- Statistics -->
    <div v-if="outputJSON && !validationMessage" class="stats-section">
      <div class="stat-item">
        <span class="stat-label">Input Size:</span>
        <span class="stat-value">{{ inputJSON.length }} chars</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Output Size:</span>
        <span class="stat-value">{{ outputJSON.length }} chars</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Size Change:</span>
        <span class="stat-value" :class="sizeChangeClass">
          {{ sizeChangeText }}
        </span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="outputJSON" class="button-group">
      <button @click="copyOutput" class="btn btn-success">
        📋 Copy Result
      </button>
      <button @click="useAsInput" class="btn btn-secondary">
        ⇄ Use as Input
      </button>
      <button @click="clearAll" class="btn btn-secondary">
        🗑️ Clear All
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
      <h3>JSON Formatter Features</h3>
      <ul>
        <li><strong>Format/Beautify:</strong> Adds proper indentation and line breaks for readability</li>
        <li><strong>Minify:</strong> Removes whitespace to reduce file size</li>
        <li><strong>Validate:</strong> Checks if JSON syntax is correct</li>
        <li><strong>Sort Keys:</strong> Organizes object keys alphabetically</li>
      </ul>
      
      <h4>Common Use Cases:</h4>
      <ul>
        <li>Debugging API responses</li>
        <li>Formatting configuration files</li>
        <li>Validating JSON before deployment</li>
        <li>Reducing JSON file size for production</li>
      </ul>

      <p class="privacy-note">
        <strong>Privacy:</strong> All processing happens locally in your browser. 
        No data is sent to any server.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const inputJSON = ref('');
const outputJSON = ref('');
const validationMessage = ref('');
const validationClass = ref('');
const showCopyMessage = ref(false);
const showOptions = ref(true);
const indentSpaces = ref(2);
const sortKeys = ref(false);

const validationIcon = computed(() => {
  return validationClass.value === 'success' ? '✅' : '⚠️';
});

const parseJSON = (): any => {
  try {
    return JSON.parse(inputJSON.value);
  } catch (err) {
    throw new Error('Invalid JSON syntax');
  }
};

const sortObjectKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((sorted: any, key) => {
        sorted[key] = sortObjectKeys(obj[key]);
        return sorted;
      }, {});
  }
  return obj;
};

const formatJSON = () => {
  validationMessage.value = '';
  outputJSON.value = '';

  if (!inputJSON.value.trim()) {
    validationMessage.value = 'Please enter JSON to format';
    validationClass.value = 'error';
    return;
  }

  try {
    let parsed = parseJSON();
    
    if (sortKeys.value) {
      parsed = sortObjectKeys(parsed);
    }
    
    outputJSON.value = JSON.stringify(parsed, null, indentSpaces.value);
    validationMessage.value = 'JSON formatted successfully!';
    validationClass.value = 'success';
  } catch (err) {
    validationMessage.value = err instanceof Error ? err.message : 'Error formatting JSON';
    validationClass.value = 'error';
  }
};

const minifyJSON = () => {
  validationMessage.value = '';
  outputJSON.value = '';

  if (!inputJSON.value.trim()) {
    validationMessage.value = 'Please enter JSON to minify';
    validationClass.value = 'error';
    return;
  }

  try {
    let parsed = parseJSON();
    
    if (sortKeys.value) {
      parsed = sortObjectKeys(parsed);
    }
    
    outputJSON.value = JSON.stringify(parsed);
    validationMessage.value = 'JSON minified successfully!';
    validationClass.value = 'success';
  } catch (err) {
    validationMessage.value = err instanceof Error ? err.message : 'Error minifying JSON';
    validationClass.value = 'error';
  }
};

const validateJSON = () => {
  outputJSON.value = '';

  if (!inputJSON.value.trim()) {
    validationMessage.value = 'Please enter JSON to validate';
    validationClass.value = 'error';
    return;
  }

  try {
    parseJSON();
    validationMessage.value = 'Valid JSON! ✨';
    validationClass.value = 'success';
  } catch (err) {
    validationMessage.value = err instanceof Error ? err.message : 'Invalid JSON';
    validationClass.value = 'error';
  }
};

const sizeChangeClass = computed(() => {
  if (!inputJSON.value || !outputJSON.value) return '';
  return outputJSON.value.length > inputJSON.value.length ? 'increase' : 'decrease';
});

const sizeChangeText = computed(() => {
  if (!inputJSON.value || !outputJSON.value) return '';
  
  const diff = outputJSON.value.length - inputJSON.value.length;
  const percent = ((Math.abs(diff) / inputJSON.value.length) * 100).toFixed(1);
  
  if (diff > 0) {
    return `+${percent}% (${diff} chars)`;
  } else if (diff < 0) {
    return `-${percent}% (${Math.abs(diff)} chars)`;
  } else {
    return 'No change';
  }
});

const copyOutput = async () => {
  if (outputJSON.value) {
    try {
      await navigator.clipboard.writeText(outputJSON.value);
      showCopyMessage.value = true;
      setTimeout(() => {
        showCopyMessage.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};

const useAsInput = () => {
  inputJSON.value = outputJSON.value;
  outputJSON.value = '';
  validationMessage.value = '';
};

const clearAll = () => {
  inputJSON.value = '';
  outputJSON.value = '';
  validationMessage.value = '';
};
</script>

<style scoped>
.json-formatter {
  width: 100%;
}

.form-textarea {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.output-textarea {
  background: var(--color-primary-alpha);
  cursor: default;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
  margin: var(--space-lg) 0;
}

.options-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.option-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.option-select {
  width: auto;
  max-width: 150px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
  color: var(--color-text-secondary);
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.validation-message {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-lg);
  text-align: center;
  font-weight: var(--font-weight-medium);
}

.validation-message.success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid var(--color-success);
  color: var(--color-success);
}

.validation-message.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  color: var(--color-error);
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
  margin-bottom: var(--space-lg);
  font-weight: var(--font-weight-medium);
}

.info-box {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
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

.info-box ul {
  margin: var(--space-sm) 0;
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
  .button-grid {
    grid-template-columns: 1fr;
  }

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

  .option-label {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .option-select {
    max-width: 100%;
  }
}
</style>