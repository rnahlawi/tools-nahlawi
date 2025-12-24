<template>
  <div class="lorem-ipsum">
    <!-- Settings Panel -->
    <div class="settings-panel">
      <div class="input-grid">
        <div class="form-group">
          <label class="form-label">Number of</label>
          <input 
            type="number" 
            v-model.number="settings.count"
            class="form-input"
            min="1"
            max="100"
            placeholder="5"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Type</label>
          <select v-model="settings.type" class="form-input">
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
      </div>

      <div class="options-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="settings.startWithLorem">
          <span>Start with "Lorem ipsum dolor sit amet..."</span>
        </label>
      </div>

      <button @click="generate" class="btn btn-primary generate-btn">
        📝 Generate Lorem Ipsum
      </button>
    </div>

    <!-- Output Area -->
    <div v-if="output" class="output-section">
      <div class="output-header">
        <h3>Generated Text</h3>
        <div class="output-stats">
          <span>{{ stats.paragraphs }} paragraphs</span>
          <span>•</span>
          <span>{{ stats.words }} words</span>
          <span>•</span>
          <span>{{ stats.characters }} characters</span>
        </div>
      </div>

      <div class="output-display">
        {{ output }}
      </div>

      <div class="button-group">
        <button @click="copyOutput" class="btn btn-success">
          📋 Copy Text
        </button>
        <button @click="clearOutput" class="btn btn-secondary">
          🗑️ Clear
        </button>
      </div>
    </div>

    <!-- Copy Success Message -->
    <transition name="fade">
      <div v-if="showCopyMessage" class="success-message">
        ✅ Copied to clipboard!
      </div>
    </transition>

    <!-- Info Box -->
    <div class="info-box">
      <h3>About Lorem Ipsum</h3>
      <p>
        Lorem ipsum is placeholder text commonly used in graphic design, publishing, and web development 
        to demonstrate the visual form of a document without relying on meaningful content.
      </p>
      <p>
        The text is derived from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" 
        (The Extremes of Good and Evil) by Cicero, written in 45 BC.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

interface Settings {
  count: number;
  type: 'paragraphs' | 'sentences' | 'words';
  startWithLorem: boolean;
}

const settings = ref<Settings>({
  count: 5,
  type: 'paragraphs',
  startWithLorem: true
});

const output = ref('');
const showCopyMessage = ref(false);

// Lorem Ipsum word bank
const words = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

const loremStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

const generateWord = (): string => {
  return words[Math.floor(Math.random() * words.length)];
};

const generateSentence = (): string => {
  const length = Math.floor(Math.random() * 10) + 5; // 5-15 words
  const sentence = [];
  
  for (let i = 0; i < length; i++) {
    sentence.push(generateWord());
  }
  
  // Capitalize first word
  sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
  
  return sentence.join(' ') + '.';
};

const generateParagraph = (): string => {
  const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-7 sentences
  const sentences = [];
  
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  
  return sentences.join(' ');
};

const generate = () => {
  const results: string[] = [];

  if (settings.value.startWithLorem && settings.value.type === 'paragraphs') {
    results.push(loremStart);
  }

  const count = settings.value.startWithLorem && settings.value.type === 'paragraphs' 
    ? settings.value.count - 1 
    : settings.value.count;

  switch (settings.value.type) {
    case 'paragraphs':
      for (let i = 0; i < count; i++) {
        results.push(generateParagraph());
      }
      output.value = results.join('\n\n');
      break;

    case 'sentences':
      if (settings.value.startWithLorem) {
        results.push(loremStart);
      }
      for (let i = 0; i < count; i++) {
        results.push(generateSentence());
      }
      output.value = results.join(' ');
      break;

    case 'words':
      if (settings.value.startWithLorem) {
        results.push(...loremStart.split(' ').slice(0, Math.min(settings.value.count, 10)));
      }
      const remaining = settings.value.startWithLorem 
        ? Math.max(0, settings.value.count - 10)
        : settings.value.count;
      
      for (let i = 0; i < remaining; i++) {
        results.push(generateWord());
      }
      output.value = results.join(' ');
      break;
  }
};

const stats = computed(() => {
  if (!output.value) return { paragraphs: 0, words: 0, characters: 0 };

  const paragraphs = output.value.split('\n\n').filter(p => p.trim()).length;
  const words = output.value.trim().split(/\s+/).length;
  const characters = output.value.length;

  return { paragraphs, words, characters };
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

const clearOutput = () => {
  output.value = '';
};

// Generate initial content
generate();
</script>

<style scoped>
.lorem-ipsum {
  width: 100%;
}

.settings-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.options-group {
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-lg);
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

.generate-btn {
  width: 100%;
  font-size: var(--font-size-lg);
  padding: var(--space-lg);
}

.output-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
  flex-wrap: wrap;
  gap: var(--space-md);
}

.output-header h3 {
  margin: 0;
  color: var(--color-primary);
}

.output-stats {
  display: flex;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.output-display {
  background: var(--color-primary-alpha);
  padding: var(--space-xl);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text);
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: var(--space-lg);
}

.button-group {
  display: flex;
  gap: var(--space-md);
}

.button-group .btn {
  flex: 1;
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

.info-box p {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.info-box p:last-child {
  margin-bottom: 0;
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
  .input-grid {
    grid-template-columns: 1fr;
  }

  .output-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .button-group {
    flex-direction: column;
  }
}
</style>