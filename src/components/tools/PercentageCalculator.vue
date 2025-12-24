<template>
  <div class="percentage-calculator">
    <!-- Calculator 1: What is X% of Y? -->
    <div class="calculator-section">
      <h3 class="calc-title">What is X% of Y?</h3>
      <div class="calc-grid">
        <div class="calc-input-group">
          <label class="calc-label">What is</label>
          <input 
            type="number" 
            v-model.number="calc1.percent"
            @input="calculate1"
            class="form-input" 
            placeholder="10"
            step="0.01"
          >
        </div>
        <span class="calc-operator">%</span>
        <div class="calc-input-group">
          <label class="calc-label">of</label>
          <input 
            type="number" 
            v-model.number="calc1.value"
            @input="calculate1"
            class="form-input" 
            placeholder="100"
            step="0.01"
          >
        </div>
        <span class="calc-operator">=</span>
        <div class="calc-input-group">
          <label class="calc-label">Result</label>
          <input 
            type="text" 
            :value="calc1.result"
            class="form-input result-input" 
            readonly
          >
        </div>
      </div>
    </div>

    <!-- Calculator 2: X is what % of Y? -->
    <div class="calculator-section">
      <h3 class="calc-title">X is what % of Y?</h3>
      <div class="calc-grid">
        <div class="calc-input-group">
          <label class="calc-label">Value</label>
          <input 
            type="number" 
            v-model.number="calc2.value1"
            @input="calculate2"
            class="form-input" 
            placeholder="25"
            step="0.01"
          >
        </div>
        <span class="calc-operator">is</span>
        <div class="calc-input-group">
          <label class="calc-label">what %</label>
          <input 
            type="text" 
            :value="calc2.result"
            class="form-input result-input" 
            readonly
          >
        </div>
        <span class="calc-operator">of</span>
        <div class="calc-input-group">
          <label class="calc-label">Total</label>
          <input 
            type="number" 
            v-model.number="calc2.value2"
            @input="calculate2"
            class="form-input" 
            placeholder="100"
            step="0.01"
          >
        </div>
      </div>
    </div>

    <!-- Calculator 3: Percentage Change -->
    <div class="calculator-section">
      <h3 class="calc-title">Percentage Increase/Decrease</h3>
      <div class="change-inputs">
        <div class="form-group">
          <label class="form-label">Original Value</label>
          <input 
            type="number" 
            v-model.number="calc3.original"
            @input="calculate3"
            class="form-input" 
            placeholder="100"
            step="0.01"
          >
        </div>
        <div class="form-group">
          <label class="form-label">New Value</label>
          <input 
            type="number" 
            v-model.number="calc3.new"
            @input="calculate3"
            class="form-input" 
            placeholder="150"
            step="0.01"
          >
        </div>
      </div>
      
      <transition name="fade">
        <div v-if="calc3.showResults" class="results-grid">
          <div class="result-card">
            <span class="result-value" :class="{ positive: calc3.change > 0, negative: calc3.change < 0 }">
              {{ calc3.change > 0 ? '+' : '' }}{{ formatNumber(calc3.change) }}
            </span>
            <span class="result-label">Change Amount</span>
          </div>
          <div class="result-card">
            <span class="result-value" :class="{ positive: calc3.percent > 0, negative: calc3.percent < 0 }">
              {{ calc3.percent > 0 ? '+' : '' }}{{ formatNumber(calc3.percent) }}%
            </span>
            <span class="result-label">Percentage Change</span>
          </div>
        </div>
      </transition>
    </div>

    <!-- Calculator 4: Add/Subtract Percentage -->
    <div class="calculator-section">
      <h3 class="calc-title">Add or Subtract Percentage</h3>
      <div class="calc4-controls">
        <div class="form-group">
          <label class="form-label">Starting Value</label>
          <input 
            type="number" 
            v-model.number="calc4.value"
            @input="calculate4"
            class="form-input" 
            placeholder="100"
            step="0.01"
          >
        </div>
        <div class="operation-buttons">
          <button 
            @click="setOperation('add')"
            :class="['btn', 'btn-operation', { active: calc4.operation === 'add' }]"
          >
            +
          </button>
          <button 
            @click="setOperation('subtract')"
            :class="['btn', 'btn-operation', { active: calc4.operation === 'subtract' }]"
          >
            −
          </button>
        </div>
        <div class="form-group">
          <label class="form-label">Percentage</label>
          <input 
            type="number" 
            v-model.number="calc4.percent"
            @input="calculate4"
            class="form-input" 
            placeholder="20"
            step="0.01"
          >
        </div>
      </div>
      
      <div class="calc4-result">
        <div class="result-label-small">Result</div>
        <div class="result-value-large">{{ calc4.result }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

// Calculator 1: What is X% of Y?
const calc1 = reactive({
  percent: null as number | null,
  value: null as number | null,
  result: ''
});

// Calculator 2: X is what % of Y?
const calc2 = reactive({
  value1: null as number | null,
  value2: null as number | null,
  result: ''
});

// Calculator 3: Percentage Change
const calc3 = reactive({
  original: null as number | null,
  new: null as number | null,
  change: 0,
  percent: 0,
  showResults: false
});

// Calculator 4: Add/Subtract Percentage
const calc4 = reactive({
  value: null as number | null,
  percent: null as number | null,
  operation: 'add' as 'add' | 'subtract',
  result: '-'
});

// Helper function to format numbers
const formatNumber = (num: number): string => {
  if (num === 0) return '0';
  if (!isFinite(num)) return '0';
  
  // Round to 2 decimal places and remove trailing zeros
  const rounded = Math.round(num * 100) / 100;
  return rounded.toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  });
};

// Calculator 1: What is X% of Y?
const calculate1 = () => {
  if (calc1.percent !== null && calc1.value !== null) {
    const result = (calc1.percent / 100) * calc1.value;
    calc1.result = formatNumber(result);
  } else {
    calc1.result = '';
  }
};

// Calculator 2: X is what % of Y?
const calculate2 = () => {
  if (calc2.value1 !== null && calc2.value2 !== null && calc2.value2 !== 0) {
    const result = (calc2.value1 / calc2.value2) * 100;
    calc2.result = formatNumber(result) + '%';
  } else {
    calc2.result = '';
  }
};

// Calculator 3: Percentage Change
const calculate3 = () => {
  if (calc3.original !== null && calc3.new !== null && calc3.original !== 0) {
    calc3.change = calc3.new - calc3.original;
    calc3.percent = ((calc3.new - calc3.original) / calc3.original) * 100;
    calc3.showResults = true;
  } else {
    calc3.showResults = false;
  }
};

// Calculator 4: Add/Subtract Percentage
const setOperation = (operation: 'add' | 'subtract') => {
  calc4.operation = operation;
  calculate4();
};

const calculate4 = () => {
  if (calc4.value !== null && calc4.percent !== null) {
    let result: number;
    if (calc4.operation === 'add') {
      result = calc4.value * (1 + calc4.percent / 100);
    } else {
      result = calc4.value * (1 - calc4.percent / 100);
    }
    calc4.result = formatNumber(result);
  } else {
    calc4.result = '-';
  }
};
</script>

<style scoped>
.percentage-calculator {
  width: 100%;
}

.calculator-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-sm);
}

.calculator-section:last-child {
  margin-bottom: 0;
}

.calc-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-lg);
  color: var(--color-text);
}

/* Calculator Grid Layout */
.calc-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: var(--space-md);
  align-items: end;
}

.calc-input-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.calc-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.calc-operator {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-secondary);
  padding-bottom: 12px;
  text-align: center;
}

.result-input {
  background: var(--color-primary-alpha);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

/* Calculator 3: Change Inputs */
.change-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.result-card {
  background: var(--color-primary-alpha);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.result-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.result-value.positive {
  color: var(--color-success);
}

.result-value.negative {
  color: var(--color-error);
}

.result-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Calculator 4: Controls */
.calc4-controls {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-md);
  align-items: end;
  margin-bottom: var(--space-lg);
}

.operation-buttons {
  display: flex;
  gap: var(--space-sm);
  padding-bottom: 2px;
}

.btn-operation {
  width: 48px;
  height: 48px;
  padding: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  background: var(--color-surface-hover);
  border: 2px solid var(--color-border);
  color: var(--color-text);
  transition: all var(--transition-fast);
}

.btn-operation:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-operation.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.calc4-result {
  background: var(--color-primary-alpha);
  padding: var(--space-lg);
  border-radius: var(--radius-md);
  text-align: center;
}

.result-label-small {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.result-value-large {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

/* Animations */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .calc-grid {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }

  .calc-operator {
    display: none;
  }

  .change-inputs {
    grid-template-columns: 1fr;
  }

  .calc4-controls {
    grid-template-columns: 1fr;
  }

  .operation-buttons {
    justify-content: center;
    padding-bottom: 0;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .calculator-section {
    padding: var(--space-lg);
  }

  .calc-title {
    font-size: var(--font-size-base);
  }

  .result-value-large {
    font-size: var(--font-size-2xl);
  }
}
</style>