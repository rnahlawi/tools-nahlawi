<template>
  <div class="password-generator">
    <!-- Generated Password Display -->
    <div class="password-display">
      <div class="password-text" :class="{ placeholder: !password }">
        {{ password || 'Click generate to create a password' }}
      </div>
      <div class="password-actions">
        <button 
          @click="copyPassword" 
          class="btn btn-success btn-icon"
          :disabled="!password"
          title="Copy to clipboard"
        >
          📋
        </button>
        <button 
          @click="generatePassword" 
          class="btn btn-primary btn-icon"
          title="Generate new password"
        >
          🔄
        </button>
      </div>
    </div>

    <!-- Strength Indicator -->
    <div v-if="password" class="strength-indicator">
      <div class="strength-bar">
        <div 
          class="strength-fill" 
          :class="strengthClass"
          :style="{ width: strengthWidth }"
        ></div>
      </div>
      <div class="strength-text" :class="strengthClass">
        {{ strengthText }}
      </div>
    </div>

    <!-- Settings Panel -->
    <div class="settings-panel">
      <!-- Length Slider -->
      <div class="form-group">
        <div class="setting-header">
          <label class="form-label">Password Length</label>
          <span class="length-value">{{ settings.length }}</span>
        </div>
        <input 
          type="range" 
          v-model.number="settings.length"
          min="8"
          max="64"
          class="range-slider"
        >
        <div class="range-labels">
          <span>8</span>
          <span>64</span>
        </div>
      </div>

      <!-- Character Options -->
      <div class="options-group">
        <h3>Include Characters</h3>
        
        <label class="option-label">
          <input 
            type="checkbox" 
            v-model="settings.uppercase"
            @change="validateOptions"
          >
          <div class="option-content">
            <span class="option-text">Uppercase Letters</span>
            <span class="option-example">ABC...XYZ</span>
          </div>
        </label>

        <label class="option-label">
          <input 
            type="checkbox" 
            v-model="settings.lowercase"
            @change="validateOptions"
          >
          <div class="option-content">
            <span class="option-text">Lowercase Letters</span>
            <span class="option-example">abc...xyz</span>
          </div>
        </label>

        <label class="option-label">
          <input 
            type="checkbox" 
            v-model="settings.numbers"
            @change="validateOptions"
          >
          <div class="option-content">
            <span class="option-text">Numbers</span>
            <span class="option-example">0123456789</span>
          </div>
        </label>

        <label class="option-label">
          <input 
            type="checkbox" 
            v-model="settings.symbols"
            @change="validateOptions"
          >
          <div class="option-content">
            <span class="option-text">Symbols</span>
            <span class="option-example">!@#$%^&*</span>
          </div>
        </label>

        <label class="option-label">
          <input 
            type="checkbox" 
            v-model="settings.excludeAmbiguous"
          >
          <div class="option-content">
            <span class="option-text">Exclude Ambiguous Characters</span>
            <span class="option-example">Remove i, l, 1, L, o, 0, O</span>
          </div>
        </label>
      </div>

      <!-- Generate Button -->
      <button @click="generatePassword" class="btn btn-primary generate-btn">
        🔐 Generate Password
      </button>
    </div>

    <!-- Copy Success Message -->
    <transition name="fade">
      <div v-if="showCopyMessage" class="success-message">
        ✅ Password copied to clipboard!
      </div>
    </transition>

    <!-- Security Info -->
    <div class="info-section">
      <h3>🔒 Password Security Tips</h3>
      <ul>
        <li>Use at least 12 characters for better security</li>
        <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
        <li>Never reuse passwords across different sites</li>
        <li>Use a password manager to store complex passwords</li>
        <li>Change passwords regularly, especially for sensitive accounts</li>
      </ul>
      <p class="privacy-note">
        <strong>Privacy:</strong> All passwords are generated locally in your browser. 
        Nothing is sent to any server.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Settings {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

const settings = ref<Settings>({
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false
});

const password = ref('');
const showCopyMessage = ref(false);

const chars = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const ambiguous = 'il1Lo0O';

const validateOptions = () => {
  // Ensure at least one option is selected
  if (!settings.value.uppercase && !settings.value.lowercase && 
      !settings.value.numbers && !settings.value.symbols) {
    settings.value.lowercase = true;
  }
};

const generatePassword = () => {
  let charset = '';
  
  if (settings.value.uppercase) charset += chars.uppercase;
  if (settings.value.lowercase) charset += chars.lowercase;
  if (settings.value.numbers) charset += chars.numbers;
  if (settings.value.symbols) charset += chars.symbols;

  // Remove ambiguous characters if requested
  if (settings.value.excludeAmbiguous) {
    charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
  }

  // Generate password using crypto.getRandomValues for better randomness
  const array = new Uint32Array(settings.value.length);
  crypto.getRandomValues(array);
  
  let newPassword = '';
  for (let i = 0; i < settings.value.length; i++) {
    newPassword += charset[array[i] % charset.length];
  }

  password.value = newPassword;
};

const copyPassword = async () => {
  if (password.value) {
    try {
      await navigator.clipboard.writeText(password.value);
      showCopyMessage.value = true;
      setTimeout(() => {
        showCopyMessage.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};

// Calculate password strength
const calculateStrength = computed(() => {
  if (!password.value) return 0;

  let score = 0;
  const len = password.value.length;

  // Length score
  if (len >= 8) score += 20;
  if (len >= 12) score += 20;
  if (len >= 16) score += 20;
  if (len >= 20) score += 20;

  // Character variety
  if (/[a-z]/.test(password.value)) score += 5;
  if (/[A-Z]/.test(password.value)) score += 5;
  if (/[0-9]/.test(password.value)) score += 5;
  if (/[^a-zA-Z0-9]/.test(password.value)) score += 5;

  return Math.min(score, 100);
});

const strengthClass = computed(() => {
  const strength = calculateStrength.value;
  if (strength < 40) return 'weak';
  if (strength < 70) return 'medium';
  return 'strong';
});

const strengthText = computed(() => {
  const strength = calculateStrength.value;
  if (strength < 40) return 'Weak Password';
  if (strength < 70) return 'Medium Strength';
  return 'Strong Password';
});

const strengthWidth = computed(() => `${calculateStrength.value}%`);

// Generate initial password
generatePassword();
</script>

<style scoped>
.password-generator {
  width: 100%;
}

.password-display {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.password-text {
  flex: 1;
  font-family: var(--font-mono);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  word-break: break-all;
  line-height: 1.5;
}

.password-text.placeholder {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
}

.password-actions {
  display: flex;
  gap: var(--space-sm);
}

.btn-icon {
  width: 48px;
  height: 48px;
  padding: 0;
  font-size: var(--font-size-xl);
}

.strength-indicator {
  margin-bottom: var(--space-xl);
}

.strength-bar {
  height: 8px;
  background: var(--color-surface-hover);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-sm);
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: var(--color-error);
}

.strength-fill.medium {
  background: var(--color-warning);
}

.strength-fill.strong {
  background: var(--color-success);
}

.strength-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-align: center;
}

.strength-text.weak {
  color: var(--color-error);
}

.strength-text.medium {
  color: var(--color-warning);
}

.strength-text.strong {
  color: var(--color-success);
}

.settings-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-lg);
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.length-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.range-slider {
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  outline: none;
  -webkit-appearance: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
}

.range-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--space-xs);
}

.options-group {
  margin-top: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.options-group h3 {
  font-size: var(--font-size-base);
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.option-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  margin-bottom: var(--space-sm);
  background: var(--color-surface-hover);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.option-label:hover {
  background: var(--color-primary-alpha);
}

.option-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  cursor: pointer;
}

.option-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.option-text {
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.option-example {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  font-family: var(--font-mono);
}

.generate-btn {
  width: 100%;
  font-size: var(--font-size-lg);
  padding: var(--space-lg);
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

.info-section {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.info-section h3 {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.info-section ul {
  margin: var(--space-md) 0;
  padding-left: var(--space-xl);
}

.info-section li {
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
  .password-display {
    flex-direction: column;
    align-items: stretch;
  }

  .password-text {
    font-size: var(--font-size-lg);
    text-align: center;
  }

  .password-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .password-text {
    font-size: var(--font-size-base);
  }

  .btn-icon {
    width: 40px;
    height: 40px;
  }
}
</style>