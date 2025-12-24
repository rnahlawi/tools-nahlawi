<template>
  <div class="bmi-calculator">
    <!-- Unit Selection -->
    <div class="unit-selector">
      <button 
        @click="units = 'metric'"
        :class="['btn', 'btn-unit', { active: units === 'metric' }]"
      >
        Metric (kg/cm)
      </button>
      <button 
        @click="units = 'imperial'"
        :class="['btn', 'btn-unit', { active: units === 'imperial' }]"
      >
        Imperial (lbs/ft)
      </button>
    </div>

    <!-- Metric Input -->
    <div v-if="units === 'metric'" class="input-section">
      <div class="input-grid">
        <div class="form-group">
          <label class="form-label">Weight (kg)</label>
          <input 
            type="number" 
            v-model.number="metric.weight"
            @input="calculateBMI"
            class="form-input" 
            placeholder="70"
            step="0.1"
            min="1"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Height (cm)</label>
          <input 
            type="number" 
            v-model.number="metric.height"
            @input="calculateBMI"
            class="form-input" 
            placeholder="170"
            step="0.1"
            min="1"
          >
        </div>
      </div>
    </div>

    <!-- Imperial Input -->
    <div v-if="units === 'imperial'" class="input-section">
      <div class="input-grid">
        <div class="form-group">
          <label class="form-label">Weight (lbs)</label>
          <input 
            type="number" 
            v-model.number="imperial.weight"
            @input="calculateBMI"
            class="form-input" 
            placeholder="154"
            step="0.1"
            min="1"
          >
        </div>
        <div class="form-group">
          <label class="form-label">Height</label>
          <div class="height-imperial">
            <input 
              type="number" 
              v-model.number="imperial.feet"
              @input="calculateBMI"
              class="form-input" 
              placeholder="5"
              min="0"
            >
            <span class="unit-label">ft</span>
            <input 
              type="number" 
              v-model.number="imperial.inches"
              @input="calculateBMI"
              class="form-input" 
              placeholder="7"
              min="0"
              max="11"
            >
            <span class="unit-label">in</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <transition name="fade">
      <div v-if="showResults" class="results-section">
        <!-- BMI Value Card -->
        <div class="bmi-card" :class="categoryClass">
          <div class="bmi-value">{{ bmi }}</div>
          <div class="bmi-label">Your BMI</div>
        </div>

        <!-- Category Card -->
        <div class="category-card" :class="categoryClass">
          <div class="category-icon">{{ categoryIcon }}</div>
          <div class="category-name">{{ category }}</div>
          <div class="category-range">{{ categoryRange }}</div>
        </div>

        <!-- BMI Chart -->
        <div class="bmi-chart">
          <div class="chart-bar">
            <div class="chart-section underweight">
              <span class="chart-label">Underweight</span>
              <span class="chart-range">&lt; 18.5</span>
            </div>
            <div class="chart-section normal">
              <span class="chart-label">Normal</span>
              <span class="chart-range">18.5 - 24.9</span>
            </div>
            <div class="chart-section overweight">
              <span class="chart-label">Overweight</span>
              <span class="chart-range">25 - 29.9</span>
            </div>
            <div class="chart-section obese">
              <span class="chart-label">Obese</span>
              <span class="chart-range">≥ 30</span>
            </div>
          </div>
          <div class="chart-indicator" :style="{ left: indicatorPosition }">
            <div class="indicator-arrow">▼</div>
            <div class="indicator-value">{{ bmi }}</div>
          </div>
        </div>

        <!-- Health Info -->
        <div class="health-info" :class="categoryClass">
          <h3>{{ healthTitle }}</h3>
          <p>{{ healthMessage }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const units = ref<'metric' | 'imperial'>('metric');
const showResults = ref(false);

const metric = ref({
  weight: null as number | null,
  height: null as number | null
});

const imperial = ref({
  weight: null as number | null,
  feet: null as number | null,
  inches: null as number | null
});

const bmi = ref(0);
const category = ref('');
const categoryRange = ref('');

// Calculate BMI
const calculateBMI = () => {
  let calculatedBMI = 0;

  if (units.value === 'metric') {
    if (metric.value.weight && metric.value.height) {
      // BMI = weight(kg) / height(m)^2
      const heightInMeters = metric.value.height / 100;
      calculatedBMI = metric.value.weight / (heightInMeters * heightInMeters);
    }
  } else {
    if (imperial.value.weight && (imperial.value.feet !== null || imperial.value.inches !== null)) {
      // Convert to inches
      const totalInches = (imperial.value.feet || 0) * 12 + (imperial.value.inches || 0);
      if (totalInches > 0) {
        // BMI = (weight(lbs) / height(in)^2) * 703
        calculatedBMI = (imperial.value.weight / (totalInches * totalInches)) * 703;
      }
    }
  }

  if (calculatedBMI > 0) {
    bmi.value = Math.round(calculatedBMI * 10) / 10;
    updateCategory(bmi.value);
    showResults.value = true;
  } else {
    showResults.value = false;
  }
};

// Update category based on BMI
const updateCategory = (bmiValue: number) => {
  if (bmiValue < 18.5) {
    category.value = 'Underweight';
    categoryRange.value = 'BMI less than 18.5';
  } else if (bmiValue < 25) {
    category.value = 'Normal Weight';
    categoryRange.value = 'BMI 18.5 - 24.9';
  } else if (bmiValue < 30) {
    category.value = 'Overweight';
    categoryRange.value = 'BMI 25 - 29.9';
  } else {
    category.value = 'Obese';
    categoryRange.value = 'BMI 30 or greater';
  }
};

// Computed properties
const categoryClass = computed(() => {
  if (bmi.value < 18.5) return 'underweight';
  if (bmi.value < 25) return 'normal';
  if (bmi.value < 30) return 'overweight';
  return 'obese';
});

const categoryIcon = computed(() => {
  if (bmi.value < 18.5) return '⚠️';
  if (bmi.value < 25) return '✅';
  if (bmi.value < 30) return '⚠️';
  return '🔴';
});

const healthTitle = computed(() => {
  if (bmi.value < 18.5) return 'Underweight';
  if (bmi.value < 25) return 'Healthy Weight';
  if (bmi.value < 30) return 'Overweight';
  return 'Obese';
});

const healthMessage = computed(() => {
  if (bmi.value < 18.5) {
    return 'Your BMI suggests you may be underweight. Consider consulting with a healthcare professional about healthy weight gain strategies.';
  }
  if (bmi.value < 25) {
    return 'Your BMI is in the healthy range. Maintain your current lifestyle with balanced nutrition and regular physical activity.';
  }
  if (bmi.value < 30) {
    return 'Your BMI suggests you may be overweight. Consider speaking with a healthcare professional about healthy weight management strategies.';
  }
  return 'Your BMI suggests obesity. We recommend consulting with a healthcare professional for personalized health guidance.';
});

const indicatorPosition = computed(() => {
  // Position indicator on chart (0-100%)
  let position = 0;
  
  if (bmi.value < 18.5) {
    // Underweight section (0-25%)
    position = (bmi.value / 18.5) * 25;
  } else if (bmi.value < 25) {
    // Normal section (25-50%)
    position = 25 + ((bmi.value - 18.5) / (25 - 18.5)) * 25;
  } else if (bmi.value < 30) {
    // Overweight section (50-75%)
    position = 50 + ((bmi.value - 25) / (30 - 25)) * 25;
  } else {
    // Obese section (75-100%)
    position = 75 + Math.min(((bmi.value - 30) / 20) * 25, 25);
  }
  
  return `${Math.min(position, 100)}%`;
});
</script>

<style scoped>
.bmi-calculator {
  width: 100%;
}

.unit-selector {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-xl);
  background: var(--color-surface-hover);
  padding: var(--space-xs);
  border-radius: var(--radius-md);
}

.btn-unit {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
}

.btn-unit:hover {
  color: var(--color-text);
}

.btn-unit.active {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.input-section {
  margin-bottom: var(--space-xl);
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.height-imperial {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto;
  gap: var(--space-sm);
  align-items: center;
}

.unit-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.bmi-card {
  background: var(--color-primary-alpha);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  text-align: center;
}

.bmi-value {
  font-size: 4rem;
  font-weight: var(--font-weight-bold);
  line-height: 1;
  margin-bottom: var(--space-sm);
}

.bmi-label {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.category-icon {
  font-size: 3rem;
}

.category-name {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.category-range {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* BMI Chart */
.bmi-chart {
  position: relative;
  margin-top: var(--space-lg);
  margin-bottom: var(--space-2xl);
}

.chart-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.chart-section {
  padding: var(--space-lg) var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  text-align: center;
  color: white;
}

.chart-label {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.chart-range {
  font-size: var(--font-size-xs);
  opacity: 0.9;
}

.chart-section.underweight {
  background: #3b82f6;
}

.chart-section.normal {
  background: #10b981;
}

.chart-section.overweight {
  background: #f59e0b;
}

.chart-section.obese {
  background: #ef4444;
}

.chart-indicator {
  position: absolute;
  top: -30px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 0.3s ease;
}

.indicator-arrow {
  font-size: var(--font-size-2xl);
  color: var(--color-text);
}

.indicator-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  background: var(--color-surface);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-xs);
}

/* Health Info */
.health-info {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.health-info h3 {
  margin-bottom: var(--space-md);
  font-size: var(--font-size-xl);
}

.health-info p {
  margin: 0;
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
}

/* Color Coding */
.underweight {
  border-color: #3b82f6 !important;
}

.underweight .bmi-value,
.underweight .category-name {
  color: #3b82f6;
}

.normal {
  border-color: #10b981 !important;
}

.normal .bmi-value,
.normal .category-name {
  color: #10b981;
}

.overweight {
  border-color: #f59e0b !important;
}

.overweight .bmi-value,
.overweight .category-name {
  color: #f59e0b;
}

.obese {
  border-color: #ef4444 !important;
}

.obese .bmi-value,
.obese .category-name {
  color: #ef4444;
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

  .height-imperial {
    grid-template-columns: 1fr auto 1fr auto;
  }

  .bmi-value {
    font-size: 3rem;
  }

  .chart-bar {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-section {
    padding: var(--space-md) var(--space-sm);
  }

  .chart-label {
    font-size: var(--font-size-xs);
  }

  .chart-range {
    font-size: 0.625rem;
  }
}

@media (max-width: 480px) {
  .unit-selector {
    flex-direction: column;
  }

  .bmi-value {
    font-size: 2.5rem;
  }

  .category-icon {
    font-size: 2rem;
  }

  .category-name {
    font-size: var(--font-size-xl);
  }
}
</style>