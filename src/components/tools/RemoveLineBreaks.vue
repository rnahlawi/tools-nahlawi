<template>
  <div class="remove-line-breaks">
    <!-- Input Area -->
    <div class="form-group">
      <label for="textInput" class="form-label">Enter your text:</label>
      <textarea 
        id="textInput"
        v-model="inputText"
        class="form-textarea"
        placeholder="Paste text with line breaks here..."
        rows="12"
      ></textarea>
    </div>

    <!-- Action Buttons -->
    <div class="button-grid">
      <button @click="removeAllBreaks" class="btn btn-primary">
        Remove All Line Breaks
      </button>
      <button @click="removeSingleBreaks" class="btn btn-primary">
        Remove Single Line Breaks
      </button>
      <button @click="addLineBreaks" class="btn btn-primary">
        Add Line Breaks (Every Sentence)
      </button>
      <button @click="doubleSpacing" class="btn btn-primary">
        Double Spacing
      </button>
    </div>

    <!-- Output Area -->
    <div class="form-group">
      <label for="outputText" class="form-label">Processed text:</label>
      <textarea 
        id="outputText"
        v-model="outputText"
        class="form-textarea output-textarea"
        placeholder="Processed text will appear here..."
        readonly
        rows="12"
      ></textarea>
    </div>

    <!-- Statistics -->
    <div v-if="outputText" class="stats-row">
      <div class="stat-item">
        <span class="stat-label">Line Breaks Removed:</span>
        <span class="stat-value">{{ stats.removed }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Lines in Output:</span>
        <span class="stat-value">{{ stats.linesInOutput }}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="button-group">
      <button @click="copyOutput" class="btn btn-success" :disabled="!outputText">
        📋 Copy Result
      </button>
      <button @click="swapTexts" class="btn btn-secondary" :disabled="!outputText">
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
      <h3>How It Works</h3>
      <ul>
        <li><strong>Remove All Line Breaks:</strong> Combines all text into a single line with spaces</li>
        <li><strong>Remove Single Line Breaks:</strong> Preserves paragraph breaks (double line breaks), removes single ones</li>
        <li><strong>Add Line Breaks:</strong> Adds a line break after each sentence (. ! ?)</li>
        <li><strong>Double Spacing:</strong> Adds an extra line break between each existing line</li>
      </ul>
      <p class="use-case">
        <strong>Common Use Case:</strong> Cleaning text copied from PDFs that have unwanted line breaks in the middle of paragraphs.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const inputText = ref('');
const outputText = ref('');
const showCopyMessage = ref(false);

const stats = reactive({
  removed: 0,
  linesInOutput: 0
});

const countLineBreaks = (text: string): number => {
  return (text.match(/\n/g) || []).length;
};

const removeAllBreaks = () => {
  if (!inputText.value) {
    outputText.value = '';
    return;
  }

  const originalBreaks = countLineBreaks(inputText.value);
  
  // Replace all line breaks with spaces, then clean up multiple spaces
  outputText.value = inputText.value
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  stats.removed = originalBreaks;
  stats.linesInOutput = countLineBreaks(outputText.value) + 1;
};

const removeSingleBreaks = () => {
  if (!inputText.value) {
    outputText.value = '';
    return;
  }

  const originalBreaks = countLineBreaks(inputText.value);
  
  // Replace single line breaks with space, keep double+ line breaks
  outputText.value = inputText.value
    .replace(/\n(?!\n)/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\n\s*/g, '\n\n')
    .trim();

  const newBreaks = countLineBreaks(outputText.value);
  stats.removed = originalBreaks - newBreaks;
  stats.linesInOutput = newBreaks + 1;
};

const addLineBreaks = () => {
  if (!inputText.value) {
    outputText.value = '';
    return;
  }

  const originalBreaks = countLineBreaks(inputText.value);
  
  // Add line break after sentence-ending punctuation
  outputText.value = inputText.value
    .replace(/([.!?])\s+/g, '$1\n')
    .trim();

  const newBreaks = countLineBreaks(outputText.value);
  stats.removed = originalBreaks - newBreaks;
  stats.linesInOutput = newBreaks + 1;
};

const doubleSpacing = () => {
  if (!inputText.value) {
    outputText.value = '';
    return;
  }

  const originalBreaks = countLineBreaks(inputText.value);
  
  // Add extra line break after each existing line
  outputText.value = inputText.value
    .split('\n')
    .join('\n\n')
    .trim();

  const newBreaks = countLineBreaks(outputText.value);
  stats.removed = originalBreaks - newBreaks;
  stats.linesInOutput = newBreaks + 1;
};

const copyOutput = async () => {
  if (outputText.value) {
    try {
      await navigator.clipboard.writeText(outputText.value);
      showCopyMessage.value = true;
      setTimeout(() => {
        showCopyMessage.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};

const swapTexts = () => {
  inputText.value = outputText.value;
  outputText.value = '';
};

const clearAll = () => {
  inputText.value = '';
  outputText.value = '';
  stats.removed = 0;
  stats.linesInOutput = 0;
};
</script>

<style scoped>
.remove-line-breaks {
  width: 100%;
}

.form-textarea {
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-textarea {
  background: var(--color-primary-alpha);
  cursor: default;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}

.stats-row {
  display: flex;
  gap: var(--space-xl);
  padding: var(--space-lg);
  background: var(--color-primary-alpha);
  border-radius: var(--radius-md);
  margin: var(--space-lg) 0;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
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

.info-box ul {
  margin: var(--space-md) 0;
  padding-left: var(--space-xl);
}

.info-box li {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
}

.use-case {
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
    grid-template-columns: repeat(2, 1fr);
  }

  .button-group {
    flex-direction: column;
  }

  .button-group .btn {
    width: 100%;
    min-width: unset;
  }

  .stats-row {
    flex-direction: column;
    gap: var(--space-md);
  }
}

@media (max-width: 480px) {
  .button-grid {
    grid-template-columns: 1fr;
  }
}
</style>