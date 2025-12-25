<template>
  <div class="ip-lookup">
    <!-- Current IP Display -->
    <div v-if="currentIp" class="current-ip">
      <div class="ip-display">
        <div class="ip-icon">🌐</div>
        <div class="ip-info">
          <div class="ip-label">Your Public IP Address</div>
          <div class="ip-value">{{ currentIp }}</div>
        </div>
        <button @click="copyIp" class="btn btn-secondary btn-icon">
          {{ copied ? '✅' : '📋' }}
        </button>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="btn-group">
      <button @click="getIpInfo" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">⏳ Loading...</span>
        <span v-else>🔍 Get My IP Info</span>
      </button>
      <button @click="lookupCustomIp" class="btn btn-secondary">
        🔎 Lookup Different IP
      </button>
    </div>

    <!-- Custom IP Lookup -->
    <div v-if="showCustomLookup" class="custom-lookup">
      <div class="form-group">
        <label for="customIp" class="form-label">Enter IP Address</label>
        <div class="input-with-button">
          <input
            id="customIp"
            v-model="customIpInput"
            type="text"
            class="form-input"
            placeholder="8.8.8.8"
            @keyup.enter="lookupIp(customIpInput)"
          />
          <button @click="lookupIp(customIpInput)" class="btn btn-primary">
            Lookup
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="alert alert-error">
      {{ errorMessage }}
    </div>

    <!-- IP Information Display -->
    <div v-if="ipInfo" class="ip-details">
      <h3>IP Information</h3>
      
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">IP Address</div>
          <div class="info-value">{{ ipInfo.ip }}</div>
        </div>

        <div v-if="ipInfo.version" class="info-item">
          <div class="info-label">IP Version</div>
          <div class="info-value">IPv{{ ipInfo.version }}</div>
        </div>

        <div v-if="ipInfo.city" class="info-item">
          <div class="info-label">City</div>
          <div class="info-value">{{ ipInfo.city }}</div>
        </div>

        <div v-if="ipInfo.region" class="info-item">
          <div class="info-label">Region</div>
          <div class="info-value">{{ ipInfo.region }}</div>
        </div>

        <div v-if="ipInfo.country" class="info-item">
          <div class="info-label">Country</div>
          <div class="info-value">
            {{ ipInfo.country_name }} {{ ipInfo.country_flag }}
          </div>
        </div>

        <div v-if="ipInfo.postal" class="info-item">
          <div class="info-label">Postal Code</div>
          <div class="info-value">{{ ipInfo.postal }}</div>
        </div>

        <div v-if="ipInfo.latitude && ipInfo.longitude" class="info-item">
          <div class="info-label">Coordinates</div>
          <div class="info-value">
            {{ ipInfo.latitude }}, {{ ipInfo.longitude }}
          </div>
        </div>

        <div v-if="ipInfo.timezone" class="info-item">
          <div class="info-label">Timezone</div>
          <div class="info-value">{{ ipInfo.timezone }}</div>
        </div>

        <div v-if="ipInfo.org" class="info-item">
          <div class="info-label">ISP / Organization</div>
          <div class="info-value">{{ ipInfo.org }}</div>
        </div>

        <div v-if="ipInfo.asn" class="info-item">
          <div class="info-label">ASN</div>
          <div class="info-value">{{ ipInfo.asn }}</div>
        </div>
      </div>

      <!-- Map Link -->
      <div v-if="ipInfo.latitude && ipInfo.longitude" class="map-link">
        <a
          :href="`https://www.google.com/maps?q=${ipInfo.latitude},${ipInfo.longitude}`"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-success"
        >
          🗺️ View on Google Maps
        </a>
      </div>
    </div>

    <!-- Recent Lookups -->
    <div v-if="recentLookups.length > 0" class="recent-lookups">
      <h3>Recent Lookups</h3>
      <div class="recent-list">
        <div
          v-for="(lookup, index) in recentLookups"
          :key="index"
          class="recent-item"
          @click="loadRecentLookup(lookup)"
        >
          <div class="recent-ip">{{ lookup.ip }}</div>
          <div class="recent-location">
            {{ lookup.city }}, {{ lookup.country }}
          </div>
          <div class="recent-time">{{ formatTime(lookup.timestamp) }}</div>
        </div>
      </div>
      <button @click="clearHistory" class="btn btn-secondary btn-sm">
        🗑️ Clear History
      </button>
    </div>

    <!-- Privacy Notice -->
    <div class="privacy-notice">
      <strong>🔒 Privacy:</strong> This tool uses ipify API and ipapi.co for IP lookup. 
      Your lookups are stored locally in your browser and never sent to our servers.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentIp = ref('');
const ipInfo = ref(null);
const loading = ref(false);
const errorMessage = ref('');
const copied = ref(false);
const showCustomLookup = ref(false);
const customIpInput = ref('');
const recentLookups = ref([]);

// Get user's public IP address
const getMyIp = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to get IP:', error);
    return null;
  }
};

// Get detailed IP information
const getIpInfo = async () => {
  loading.value = true;
  errorMessage.value = '';
  ipInfo.value = null;

  try {
    // Get user's IP first
    const ip = await getMyIp();
    if (!ip) {
      throw new Error('Failed to get your IP address');
    }
    currentIp.value = ip;

    // Get detailed info
    await lookupIp(ip);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to get IP information';
  } finally {
    loading.value = false;
  }
};

// Lookup specific IP address
const lookupIp = async (ip) => {
  if (!ip || !isValidIp(ip)) {
    errorMessage.value = 'Please enter a valid IP address';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.reason || 'Failed to lookup IP');
    }

    ipInfo.value = {
      ip: data.ip,
      version: data.version,
      city: data.city,
      region: data.region,
      country: data.country_code,
      country_name: data.country_name,
      country_flag: data.country_emoji || getFlagEmoji(data.country_code),
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      org: data.org,
      asn: data.asn
    };

    // Save to recent lookups
    saveToHistory(ipInfo.value);
  } catch (error) {
    errorMessage.value = error.message || 'Failed to lookup IP address';
  } finally {
    loading.value = false;
    showCustomLookup.value = false;
    customIpInput.value = '';
  }
};

// Validate IP address
const isValidIp = (ip) => {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i;
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};

// Get flag emoji from country code
const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

// Copy IP to clipboard
const copyIp = async () => {
  if (!currentIp.value) return;

  try {
    await navigator.clipboard.writeText(currentIp.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy:', error);
  }
};

// Toggle custom lookup
const lookupCustomIp = () => {
  showCustomLookup.value = !showCustomLookup.value;
  if (showCustomLookup.value) {
    customIpInput.value = '';
    errorMessage.value = '';
  }
};

// Save to history
const saveToHistory = (info) => {
  const lookup = {
    ip: info.ip,
    city: info.city || 'Unknown',
    country: info.country_name || 'Unknown',
    timestamp: Date.now()
  };

  // Remove duplicate if exists
  recentLookups.value = recentLookups.value.filter(l => l.ip !== lookup.ip);

  // Add to beginning
  recentLookups.value.unshift(lookup);

  // Keep only last 5
  if (recentLookups.value.length > 5) {
    recentLookups.value = recentLookups.value.slice(0, 5);
  }

  // Save to localStorage
  try {
    localStorage.setItem('ip-lookup-history', JSON.stringify(recentLookups.value));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

// Load recent lookup
const loadRecentLookup = (lookup) => {
  lookupIp(lookup.ip);
};

// Clear history
const clearHistory = () => {
  recentLookups.value = [];
  try {
    localStorage.removeItem('ip-lookup-history');
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

// Format timestamp
const formatTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

// Load history on mount
onMounted(() => {
  try {
    const saved = localStorage.getItem('ip-lookup-history');
    if (saved) {
      recentLookups.value = JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load history:', error);
  }

  // Auto-fetch user's IP on load
  getMyIp().then(ip => {
    if (ip) currentIp.value = ip;
  });
});
</script>

<style scoped>
.ip-lookup {
  max-width: 800px;
  margin: 0 auto;
}

/* Current IP Display */
.current-ip {
  margin-bottom: var(--space-xl);
}

.ip-display {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border: 2px solid var(--color-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.ip-icon {
  font-size: 3rem;
}

.ip-info {
  flex: 1;
}

.ip-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ip-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  font-family: var(--font-mono);
}

.btn-icon {
  padding: var(--space-md);
  font-size: var(--font-size-xl);
}

/* Custom Lookup */
.custom-lookup {
  margin: var(--space-lg) 0;
  padding: var(--space-lg);
  background: var(--color-surface-hover);
  border-radius: var(--radius-md);
}

.input-with-button {
  display: flex;
  gap: var(--space-sm);
}

.input-with-button .form-input {
  flex: 1;
}

/* IP Details */
.ip-details {
  margin-top: var(--space-xl);
  padding: var(--space-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.ip-details h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.info-item {
  padding: var(--space-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.info-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
  word-break: break-word;
}

/* Map Link */
.map-link {
  text-align: center;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
}

/* Recent Lookups */
.recent-lookups {
  margin-top: var(--space-xl);
  padding: var(--space-lg);
  background: var(--color-surface-hover);
  border-radius: var(--radius-md);
}

.recent-lookups h3 {
  margin-bottom: var(--space-md);
  font-size: var(--font-size-lg);
}

.recent-list {
  margin-bottom: var(--space-md);
}

.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.recent-item:hover {
  border-color: var(--color-primary);
  background: var(--color-surface);
  transform: translateX(4px);
}

.recent-ip {
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-mono);
  color: var(--color-primary);
}

.recent-location {
  flex: 1;
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.recent-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

.btn-sm {
  font-size: var(--font-size-sm);
  padding: var(--space-sm) var(--space-md);
}

/* Privacy Notice */
.privacy-notice {
  margin-top: var(--space-xl);
  padding: var(--space-md);
  background: rgba(16, 185, 129, 0.1);
  border-left: 3px solid var(--color-success);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Responsive */
@media (max-width: 768px) {
  .ip-display {
    flex-direction: column;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .recent-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  .recent-location {
    text-align: left;
  }

  .input-with-button {
    flex-direction: column;
  }

  .input-with-button .form-input {
    width: 100%;
  }
}
</style>