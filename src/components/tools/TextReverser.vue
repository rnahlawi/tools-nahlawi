<template>
  <div class="text-reverser">
    <!-- Input Area -->
    <div class="form-group">
      <label for="textInput" class="form-label">Enter your text:</label>
      <textarea 
        id="textInput"
        v-model="inputText"
        class="form-textarea"
        placeholder="Type or paste text here..."
        rows="10"
      ></textarea>
    </div>

    <!-- Action Buttons -->
    <div class="button-grid">
      <button @click="reverseText" class="btn btn-primary">
        🔄 Reverse Text
      </button>
      <button @click="reverseWords" class="btn btn-primary">
        🔄 Reverse Words
      </button>
      <button @click="reverseLines" class="btn btn-primary">
        🔄 Reverse Lines
      </button>
      <button @click="reverseSentences" class="btn btn-primary">
        🔄 Reverse Sentences
      </button>
    </div>

    <!-- Output Area -->
    <div class="form-group">
      <label for="outputText" class="form-label">Reversed text:</label>
      <textarea 
        id="outputText"
        v-model="outputText"
        class="form-textarea output-textarea"
        placeholder="Reversed text will appear here..."
        readonly
        rows="10"
      ></textarea>
    </div>

    <!-- Action Buttons -->
    <div class="button-group">
      <button @click="copyOutput" class="btn btn-success" :disabled="!outputText">
        📋 Copy Result
      </button>
      <button @click="swapTexts" class="btn btn-secondary" :disabled="!outputText">
        ⇄ Swap Input/Output
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

    <!-- Examples -->
    <div class="examples-section">
      <h3>Examples</h3>
      <div class="example-grid">
        <div class="example-card">
          <div class="example-title">Reverse Text</div>
          <div class="example-before">Hello World</div>
          <div class="example-arrow">→</div>
          <div class="example-after">dlroW olleH</div>
        </div>
        <div class="example-card">
          <div class="example-title">Reverse Words</div>
          <div class="example-before">Hello World</div>
          <div class="example-arrow">→</div>
          <div class="example-after">World Hello</div>
        </div>
        <div class="example-card">
          <div class="example-title">Reverse Lines</div>
          <div class="example-before">Line 1<br>Line 2</div>
          <div class="example-arrow">→</div>
          <div class="example-after">Line 2<br>Line 1</div>
        </div>
        <div class="example-card">
          <div class="example-title">Reverse Sentences</div>
          <div class="example-before">Hi. How are you?</div>
          <div class="example-arrow">→</div>
          <div class="example-after">How are you? Hi.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const inputText = ref('');
const outputText = ref('');
const showCopyMessage = ref(false);

const reverseText = () => {
  if (!inputText.value) {
    outputText.value = '';
    return;
  }
  
  outputText.value = inputText.value.split('').reverse().join('');
};

const reverseWords = () => {
  if (!inputText.value) {
    outputText.value = '';
    return;
  }
  
  outputText.value = inputText.value
    .split(' ')
    .reverse()
    .join(' ');
};

const reverseLines = () => {
  if (!inputText.value) {
    outputText.value = '';
    return;
  }
  
  outputText.value = inputText.value
    .split('\n')
    .reverse()
    .join('\n');
};

const reverseSentences = () => {
  if (!inputText.value) {
    outputText.value = '';
    return;
  }
  
  // Split by sentence-ending punctuation
  const sentences = inputText.value.split(/([.!?]+\s*)/);
  
  // Reverse pairs of (sentence + punctuation)
  const reversed: string[] = [];
  for (let i = sentences.length - 1; i >= 0; i -= 2) {
    const punctuation = sentences[i];
    const sentence = sentences[i - 1];
    
    if (sentence !== undefined) {
      reversed.push(sentence);
    }
    if (punctuation && punctuation.trim()) {
      reversed.push(punctuation);
    }
  }
  
  outputText.value = reversed.join('');
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
  const temp = inputText.value;
  inputText.value = outputText.value;
  outputText.value = temp;
};

const clearAll = () => {
  inputText.value = '';
  outputText.value = '';
};
</script>

<style scoped>
.text-reverser {
  width: 100%;
}

.form-textarea {
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

.output-textarea {
  background: var(--color-primary-alpha);
  cursor: default;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}

.button-group {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
  margin-top: var(--space-lg);
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

.examples-section {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-top: var(--space-xl);
}

.examples-section h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.example-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-md);
}

.example-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.example-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.example-before,
.example-after {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  padding: var(--space-sm);
  background: var(--color-surface-hover);
  border-radius: var(--radius-sm);
  text-align: center;
}

.example-arrow {
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-lg);
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

  .example-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .button-grid {
    grid-template-columns: 1fr;
  }
}
</style>