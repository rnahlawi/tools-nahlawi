<template>
  <div class="random-number">
    <!-- Settings Panel -->
    <div class="settings-panel">
      <div class="input-grid">
        <div class="form-group">
          <label class="form-label">Minimum Value</label>
          <input 
            type="number" 
            v-model.number="settings.min"
            class="form-input"
            placeholder="1"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Maximum Value</label>
          <input 
            type="number" 
            v-model.number="settings.max"
            class="form-input"
            placeholder="100"
          >
        </div>
      </div>

      <div class="input-grid">
        <div class="form-group">
          <label class="form-label">How Many Numbers?</label>
          <input 
            type="number" 
            v-model.number="settings.count"
            class="form-input"
            placeholder="1"
            min="1"
            max="1000"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Number Type</label>
          <select v-model="settings.type" class="form-input">
            <option value="integer">Integer</option>
            <option value="decimal">Decimal</option>
          </select>
        </div>
      </div>

      <!-- Decimal Places (only show for decimal type) -->
      <div v-if="settings.type === 'decimal'" class="form-group">
        <label class="form-label">Decimal Places</label>
        <input 
          type="number" 
          v-model.number="settings.decimals"
          class="form-input"
          min="1"
          max="10"
        >
      </div>

      <!-- Options -->
      <div class="options-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="settings.allowDuplicates">
          <span>Allow duplicate numbers</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="settings.sorted">
          <span>Sort results</span>
        </label>
      </div>
    </div>

    <!-- Generate Button -->
    <button @click="generateNumbers" class="btn btn-primary generate-btn">
      🎲 Generate Random Numbers
    </button>

    <!-- Error Message -->
    <transition name="fade">
      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>
    </transition>

    <!-- Results -->
    <transition name="fade">
      <div v-if="results.length > 0" class="results-section">
        <div class="results-header">
          <h3>Generated Numbers</h3>
          <button @click="copyResults" class="btn btn-success btn-sm">
            📋 Copy All
          </button>
        </div>

        <!-- Display Mode Selector -->
        <div class="display-mode">
          <button 
            @click="displayMode = 'grid'"
            :class="['btn', 'btn-sm', 'btn-mode', { active: displayMode === 'grid' }]"
          >
            Grid
          </button>
          <button 
            @click="displayMode = 'list'"
            :class="['btn', 'btn-sm', 'btn-mode', { active: displayMode === 'list' }]"
          >
            List
          </button>
          <button 
            @click="displayMode = 'comma'"
            :class="['btn', 'btn-sm', 'btn-mode', { active: displayMode === 'comma' }]"
          >
            Comma
          </button>
        </div>

        <!-- Results Display -->
        <div class="results-display">
          <!-- Grid View -->
          <div v-if="displayMode === 'grid'" class="results-grid">
            <div 
              v-for="(number, index) in results" 
              :key="index"
              class="number-card"
            >
              {{ number }}
            </div>
          </div>

          <!-- List View -->
          <div v-if="displayMode === 'list'" class="results-list">
            <div 
              v-for="(number, index) in results" 
              :key="index"
              class="list-item"
            >
              <span class="item-index">{{ index + 1 }}.</span>
              <span class="item-number">{{ number }}</span>
            </div>
          </div>

          <!-- Comma Separated -->
          <div v-if="displayMode === 'comma'" class="results-comma">
            {{ results.join(', ') }}
          </div>
        </div>

        <!-- Statistics -->
        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-label">Count:</span>
            <span class="stat-value">{{ results.length }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Sum:</span>
            <span class="stat-value">{{ calculateSum }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Average:</span>
            <span class="stat-value">{{ calculateAverage }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Min:</span>
            <span class="stat-value">{{ calculateMin }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Max:</span>
            <span class="stat-value">{{ calculateMax }}</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Copy Success Message -->
    <transition name="fade">
      <div v-if="showCopyMessage" class="success-message">
        ✅ Copied to clipboard!
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Settings {
  min: number;
  max: number;
  count: number;
  type: 'integer' | 'decimal';
  decimals: number;
  allowDuplicates: boolean;
  sorted: boolean;
}

const settings = ref<Settings>({
  min: 1,
  max: 100,
  count: 10,
  type: 'integer',
  decimals: 2,
  allowDuplicates: true,
  sorted: false
});

const results = ref<number[]>([]);
const displayMode = ref<'grid' | 'list' | 'comma'>('grid');
const errorMessage = ref('');
const showCopyMessage = ref(false);

const generateNumbers = () => {
  errorMessage.value = '';
  
  // Validation
  if (settings.value.min >= settings.value.max) {
    errorMessage.value = 'Minimum must be less than maximum';
    return;
  }

  if (settings.value.count < 1 || settings.value.count > 1000) {
    errorMessage.value = 'Count must be between 1 and 1000';
    return;
  }

  // Check if we can generate unique numbers
  if (!settings.value.allowDuplicates && settings.value.type === 'integer') {
    const range = settings.value.max - settings.value.min + 1;
    if (settings.value.count > range) {
      errorMessage.value = `Cannot generate ${settings.value.count} unique integers in range [${settings.value.min}, ${settings.value.max}]`;
      return;
    }
  }

  const generated: number[] = [];

  if (settings.value.allowDuplicates) {
    // Allow duplicates - simple generation
    for (let i = 0; i < settings.value.count; i++) {
      generated.push(generateSingleNumber());
    }
  } else {
    // No duplicates
    if (settings.value.type === 'integer') {
      // For integers, use a set to track used numbers
      const used = new Set<number>();
      while (generated.length < settings.value.count) {
        const num = generateSingleNumber();
        if (!used.has(num)) {
          used.add(num);
          generated.push(num);
        }
      }
    } else {
      // For decimals, just generate (collision unlikely with decimals)
      for (let i = 0; i < settings.value.count; i++) {
        generated.push(generateSingleNumber());
      }
    }
  }

  // Sort if requested
  if (settings.value.sorted) {
    generated.sort((a, b) => a - b);
  }

  results.value = generated;
};

const generateSingleNumber = (): number => {
  const min = settings.value.min;
  const max = settings.value.max;

  if (settings.value.type === 'integer') {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  } else {
    const random = Math.random() * (max - min) + min;
    return Number(random.toFixed(settings.value.decimals));
  }
};

const copyResults = async () => {
  const text = displayMode.value === 'comma' 
    ? results.value.join(', ')
    : results.value.join('\n');

  try {
    await navigator.clipboard.writeText(text);
    showCopyMessage.value = true;
    setTimeout(() => {
      showCopyMessage.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// Statistics
const calculateSum = computed(() => {
  return results.value.reduce((sum, num) => sum + num, 0).toFixed(2);
});

const calculateAverage = computed(() => {
  if (results.value.length === 0) return '0';
  const avg = results.value.reduce((sum, num) => sum + num, 0) / results.value.length;
  return avg.toFixed(2);
});

const calculateMin = computed(() => {
  if (results.value.length === 0) return '0';
  return Math.min(...results.value).toString();
});

const calculateMax = computed(() => {
  if (results.value.length === 0) return '0';
  return Math.max(...results.value).toString();
});
</script>

<style scoped>
.random-number {
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
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
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
  margin-bottom: var(--space-lg);
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

.results-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
}

.results-header h3 {
  margin: 0;
  color: var(--color-primary);
}

.display-mode {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.btn-mode {
  flex: 1;
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

.btn-mode.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.results-display {
  min-height: 200px;
  margin-bottom: var(--space-lg);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--space-sm);
}

.number-card {
  background: var(--color-primary-alpha);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  text-align: center;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.list-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface-hover);
  border-radius: var(--radius-sm);
}

.item-index {
  color: var(--color-text-tertiary);
  font-weight: var(--font-weight-medium);
  min-width: 30px;
}

.item-number {
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-lg);
}

.results-comma {
  background: var(--color-primary-alpha);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  word-break: break-all;
  color: var(--color-text);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--space-md);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-xs);
}

.stat-value {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.success-message {
  background: var(--color-success);
  color: white;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  text-align: center;
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
  .input-grid {
    grid-template-columns: 1fr;
  }

  .results-grid {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>