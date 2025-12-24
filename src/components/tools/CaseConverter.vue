<template>
  <div class="case-converter">
    <!-- Text Input -->
    <div class="form-group">
      <label for="textInput" class="form-label">Enter your text:</label>
      <textarea 
        id="textInput"
        v-model="inputText"
        class="form-textarea"
        placeholder="Type or paste your text here..."
        rows="8"
      ></textarea>
    </div>

    <!-- Conversion Buttons -->
    <div class="conversion-buttons">
      <button @click="convert('uppercase')" class="btn btn-primary">
        <span class="btn-icon">🔠</span>
        UPPERCASE
      </button>
      <button @click="convert('lowercase')" class="btn btn-primary">
        <span class="btn-icon">🔡</span>
        lowercase
      </button>
      <button @click="convert('titlecase')" class="btn btn-primary">
        <span class="btn-icon">🔤</span>
        Title Case
      </button>
      <button @click="convert('sentencecase')" class="btn btn-primary">
        <span class="btn-icon">📝</span>
        Sentence case
      </button>
      <button @click="convert('camelcase')" class="btn btn-primary">
        <span class="btn-icon">🐫</span>
        camelCase
      </button>
      <button @click="convert('pascalcase')" class="btn btn-primary">
        <span class="btn-icon">📐</span>
        PascalCase
      </button>
      <button @click="convert('snakecase')" class="btn btn-primary">
        <span class="btn-icon">🐍</span>
        snake_case
      </button>
      <button @click="convert('kebabcase')" class="btn btn-primary">
        <span class="btn-icon">�串</span>
        kebab-case
      </button>
      <button @click="convert('alternating')" class="btn btn-primary">
        <span class="btn-icon">🔀</span>
        aLtErNaTiNg
      </button>
    </div>

    <!-- Output Area -->
    <div class="form-group">
      <label for="outputText" class="form-label">Converted text:</label>
      <textarea 
        id="outputText"
        v-model="outputText"
        class="form-textarea output-textarea"
        placeholder="Converted text will appear here..."
        readonly
        rows="8"
      ></textarea>
    </div>

    <!-- Action Buttons -->
    <div class="button-group">
      <button @click="copyOutput" class="btn btn-success" :disabled="!outputText">
        📋 Copy Result
      </button>
      <button @click="swapTexts" class="btn btn-secondary" :disabled="!outputText">
        🔄 Use as Input
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const inputText = ref('');
const outputText = ref('');
const showCopyMessage = ref(false);

type ConversionType = 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase' | 
                      'camelcase' | 'pascalcase' | 'snakecase' | 'kebabcase' | 'alternating';

const convert = (type: ConversionType) => {
  if (!inputText.value.trim()) {
    outputText.value = '';
    return;
  }

  const text = inputText.value;

  switch (type) {
    case 'uppercase':
      outputText.value = text.toUpperCase();
      break;

    case 'lowercase':
      outputText.value = text.toLowerCase();
      break;

    case 'titlecase':
      outputText.value = text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      break;

    case 'sentencecase':
      outputText.value = text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s+\w)/g, match => match.toUpperCase());
      break;

    case 'camelcase':
      outputText.value = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .replace(/^[A-Z]/, char => char.toLowerCase());
      break;

    case 'pascalcase':
      outputText.value = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .replace(/^[a-z]/, char => char.toUpperCase());
      break;

    case 'snakecase':
      outputText.value = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      break;

    case 'kebabcase':
      outputText.value = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      break;

    case 'alternating':
      outputText.value = text
        .split('')
        .map((char, index) => 
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join('');
      break;

    default:
      outputText.value = text;
  }
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
};
</script>

<style scoped>
.case-converter {
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

.conversion-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}

.conversion-buttons .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-sm);
}

.btn-icon {
  font-size: var(--font-size-lg);
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
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  text-align: center;
  margin-top: var(--space-md);
  font-weight: var(--font-weight-medium);
  box-shadow: var(--shadow-md);
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
  .conversion-buttons {
    grid-template-columns: repeat(2, 1fr);
  }

  .button-group {
    flex-direction: column;
  }

  .button-group .btn {
    width: 100%;
    min-width: unset;
  }
}

@media (max-width: 480px) {
  .conversion-buttons {
    grid-template-columns: 1fr;
  }

  .conversion-buttons .btn {
    font-size: var(--font-size-base);
  }
}
</style>