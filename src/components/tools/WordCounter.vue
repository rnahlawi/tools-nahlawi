<template>
  <div class="word-counter">
    <!-- Text Input Area -->
    <div class="form-group">
      <label for="textInput" class="form-label">Enter your text:</label>
      <textarea 
        id="textInput"
        v-model="text"
        @input="analyzeText"
        class="form-textarea"
        placeholder="Type or paste your text here..."
        rows="12"
      ></textarea>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">📝</div>
        <div class="stat-value">{{ stats.words }}</div>
        <div class="stat-label">Words</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🔤</div>
        <div class="stat-value">{{ stats.characters }}</div>
        <div class="stat-label">Characters</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📄</div>
        <div class="stat-value">{{ stats.charactersNoSpaces }}</div>
        <div class="stat-label">Characters (no spaces)</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-value">{{ stats.sentences }}</div>
        <div class="stat-label">Sentences</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">¶</div>
        <div class="stat-value">{{ stats.paragraphs }}</div>
        <div class="stat-label">Paragraphs</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-value">{{ stats.readingTime }}</div>
        <div class="stat-label">Reading Time</div>
      </div>
    </div>

    <!-- Additional Details -->
    <div class="details-section">
      <div class="detail-row">
        <span class="detail-label">Average Word Length:</span>
        <strong>{{ stats.avgWordLength }} characters</strong>
      </div>
      <div class="detail-row">
        <span class="detail-label">Longest Word:</span>
        <strong>{{ stats.longestWord || 'N/A' }} ({{ stats.longestWord?.length || 0 }} characters)</strong>
      </div>
      <div class="detail-row">
        <span class="detail-label">Speaking Time (slow):</span>
        <strong>{{ stats.speakingTime }}</strong>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="button-group">
      <button @click="copyText" class="btn btn-success">
        📋 Copy Text
      </button>
      <button @click="clearText" class="btn btn-secondary">
        🗑️ Clear
      </button>
    </div>

    <!-- Copy Success Message -->
    <transition name="fade">
      <div v-if="showCopyMessage" class="copy-message">
        ✅ Text copied to clipboard!
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const text = ref('');
const showCopyMessage = ref(false);

interface Stats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTime: string;
  avgWordLength: number;
  longestWord: string;
  speakingTime: string;
}

const stats = reactive<Stats>({
  words: 0,
  characters: 0,
  charactersNoSpaces: 0,
  sentences: 0,
  paragraphs: 0,
  readingTime: '0 min',
  avgWordLength: 0,
  longestWord: '',
  speakingTime: '0 min'
});

const analyzeText = () => {
  const content = text.value;

  // Characters
  stats.characters = content.length;
  stats.charactersNoSpaces = content.replace(/\s/g, '').length;

  // Words
  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  stats.words = content.trim() === '' ? 0 : words.length;

  // Sentences (split by . ! ?)
  const sentences = content
    .split(/[.!?]+/)
    .filter(sentence => sentence.trim().length > 0);
  stats.sentences = sentences.length;

  // Paragraphs (split by double line breaks)
  const paragraphs = content
    .split(/\n\n+/)
    .filter(para => para.trim().length > 0);
  stats.paragraphs = Math.max(paragraphs.length, content.trim() ? 1 : 0);

  // Reading time (average 200 words per minute)
  const readingMinutes = Math.ceil(stats.words / 200);
  stats.readingTime = readingMinutes === 0 ? '< 1 min' : 
    readingMinutes === 1 ? '1 min' : 
    `${readingMinutes} min`;

  // Speaking time (average 130 words per minute)
  const speakingMinutes = Math.ceil(stats.words / 130);
  stats.speakingTime = speakingMinutes === 0 ? '< 1 min' : 
    speakingMinutes === 1 ? '1 min' : 
    `${speakingMinutes} min`;

  // Average word length
  if (stats.words > 0) {
    const totalLength = words.reduce((sum, word) => sum + word.length, 0);
    stats.avgWordLength = Math.round((totalLength / stats.words) * 10) / 10;
  } else {
    stats.avgWordLength = 0;
  }

  // Longest word
  if (words.length > 0) {
    stats.longestWord = words.reduce((longest, word) => 
      word.length > longest.length ? word : longest
    , '');
  } else {
    stats.longestWord = '';
  }
};

const copyText = async () => {
  if (text.value) {
    try {
      await navigator.clipboard.writeText(text.value);
      showCopyMessage.value = true;
      setTimeout(() => {
        showCopyMessage.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }
};

const clearText = () => {
  text.value = '';
  analyzeText();
};
</script>

<style scoped>
.word-counter {
  width: 100%;
}

.form-textarea {
  font-family: var(--font-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  resize: vertical;
  min-height: 300px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
  margin: var(--space-xl) 0;
}

.stat-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  text-align: center;
  transition: all var(--transition-fast);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-card.primary {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
}

.stat-icon {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--space-sm);
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  line-height: 1;
  margin-bottom: var(--space-xs);
}

.stat-card.primary .stat-value {
  color: var(--color-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.details-section {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-sm) 0;
}

.detail-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-base);
}

.detail-row strong {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.button-group {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.button-group .btn {
  flex: 1;
}

.copy-message {
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
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .button-group {
    flex-direction: column;
  }

  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .form-textarea {
    min-height: 200px;
  }
}
</style>