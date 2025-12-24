<template>
  <div class="age-calculator">
    <!-- Input Section -->
    <div class="input-grid">
      <div class="form-group">
        <label for="birthDate" class="form-label">Date of Birth:</label>
        <input 
          type="date" 
          id="birthDate" 
          v-model="birthDate"
          class="form-input"
          :max="today"
        >
      </div>
      <div class="form-group">
        <label for="currentDate" class="form-label">Calculate Age On:</label>
        <input 
          type="date" 
          id="currentDate" 
          v-model="currentDate"
          class="form-input"
          :min="birthDate"
        >
      </div>
    </div>

    <button 
      @click="calculateAge" 
      class="btn btn-primary calculate-btn"
      :disabled="!birthDate || !currentDate"
    >
      🎂 Calculate Age
    </button>

    <!-- Results Section -->
    <transition name="fade">
      <div v-if="showResults" class="results-section">
        <!-- Main Age Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">{{ age.years }}</span>
            <span class="stat-label">Years</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ age.months }}</span>
            <span class="stat-label">Months</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ age.days }}</span>
            <span class="stat-label">Days</span>
          </div>
        </div>

        <!-- Detailed Information -->
        <div class="info-box detailed-info">
          <h3>Detailed Age Information</h3>
          <div class="detail-grid">
            <div class="detail-row">
              <span class="detail-label">Total Months:</span>
              <strong>{{ totals.months.toLocaleString() }}</strong>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Weeks:</span>
              <strong>{{ totals.weeks.toLocaleString() }}</strong>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Days:</span>
              <strong>{{ totals.days.toLocaleString() }}</strong>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Hours:</span>
              <strong>{{ totals.hours.toLocaleString() }}</strong>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Minutes:</span>
              <strong>{{ totals.minutes.toLocaleString() }}</strong>
            </div>
          </div>
        </div>

        <!-- Next Birthday -->
        <div class="info-box birthday-info">
          <h3>🎉 Next Birthday</h3>
          <p class="birthday-text">{{ nextBirthdayText }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Reactive state
const birthDate = ref('');
const currentDate = ref('');
const showResults = ref(false);

interface AgeBreakdown {
  years: number;
  months: number;
  days: number;
}

interface AgeTotals {
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
}

const age = ref<AgeBreakdown>({ years: 0, months: 0, days: 0 });
const totals = ref<AgeTotals>({ 
  months: 0, 
  weeks: 0, 
  days: 0, 
  hours: 0, 
  minutes: 0 
});
const nextBirthdayText = ref('');

// Computed today's date in YYYY-MM-DD format
const today = computed(() => {
  const now = new Date();
  return now.toISOString().split('T')[0];
});

// Initialize current date to today
onMounted(() => {
  currentDate.value = today.value;
});

// Calculate age function
const calculateAge = () => {
  if (!birthDate.value || !currentDate.value) return;

  const birth = new Date(birthDate.value);
  const current = new Date(currentDate.value);

  // Validate dates
  if (birth > current) {
    alert('Birth date cannot be after the calculation date!');
    return;
  }

  // Calculate age breakdown
  let years = current.getFullYear() - birth.getFullYear();
  let months = current.getMonth() - birth.getMonth();
  let days = current.getDate() - birth.getDate();

  // Adjust for negative values
  if (days < 0) {
    months--;
    const prevMonth = new Date(current.getFullYear(), current.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  age.value = { years, months, days };

  // Calculate totals
  const diffTime = Math.abs(current.getTime() - birth.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  totals.value = {
    months: years * 12 + months,
    weeks: Math.floor(diffDays / 7),
    days: diffDays,
    hours: diffDays * 24,
    minutes: diffDays * 24 * 60
  };

  // Calculate next birthday
  calculateNextBirthday(birth, current);

  showResults.value = true;
};

const calculateNextBirthday = (birth: Date, current: Date) => {
  let nextBirthday = new Date(
    current.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );

  // If birthday already passed this year, calculate for next year
  if (nextBirthday < current) {
    nextBirthday.setFullYear(current.getFullYear() + 1);
  }

  const daysUntil = Math.ceil(
    (nextBirthday.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntil === 0) {
    nextBirthdayText.value = "🎉 Happy Birthday! Today is your special day!";
  } else if (daysUntil === 1) {
    nextBirthdayText.value = "🎈 Your birthday is tomorrow!";
  } else {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const dateString = nextBirthday.toLocaleDateString('en-US', options);
    nextBirthdayText.value = `Your next birthday is in ${daysUntil} days on ${dateString}`;
  }
};
</script>

<style scoped>
.age-calculator {
  width: 100%;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.calculate-btn {
  width: 100%;
  margin-bottom: var(--space-xl);
}

.calculate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-section {
  margin-top: var(--space-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.stat-card {
  background: var(--color-primary-alpha);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detailed-info {
  background: var(--color-primary-alpha);
  margin-bottom: var(--space-lg);
}

.detailed-info h3 {
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.detail-grid {
  display: grid;
  gap: var(--space-sm);
  font-size: var(--font-size-sm);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-xs) 0;
}

.detail-label {
  color: var(--color-text-secondary);
}

.birthday-info h3 {
  margin-bottom: var(--space-md);
  color: var(--color-primary);
}

.birthday-text {
  font-size: var(--font-size-lg);
  margin: 0;
  color: var(--color-text);
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

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>