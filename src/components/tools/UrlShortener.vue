<template>
  <div class="url-shortener">
    <!-- Input Section -->
    <div class="input-section">
      <div class="form-group">
        <label for="longUrl" class="form-label">Enter Long URL</label>
        <input
          id="longUrl"
          v-model="longUrl"
          type="url"
          class="form-input url-input"
          placeholder="https://example.com/very/long/url/that/needs/shortening"
          @keyup.enter="shortenUrl"
        />
      </div>

      <!-- Custom Short URL (Optional) -->
      <div class="form-group">
        <label class="checkbox-wrapper">
          <input type="checkbox" v-model="useCustomShort" />
          <span>Use custom short code (optional)</span>
        </label>
        
        <div v-if="useCustomShort" class="custom-short-input">
          <span class="url-prefix">is.gd/</span>
          <input
            v-model="customShort"
            type="text"
            class="form-input"
            placeholder="mylink"
            maxlength="30"
            @keyup.enter="shortenUrl"
          />
        </div>
        <p v-if="useCustomShort" class="help-text">
          Only letters, numbers, and hyphens. Max 30 characters.
        </p>
      </div>

      <!-- Shorten Button -->
      <button 
        @click="shortenUrl" 
        class="btn btn-primary btn-large"
        :disabled="isLoading || !longUrl.trim()"
      >
        <span v-if="isLoading">⏳ Shortening...</span>
        <span v-else>🔗 Shorten URL</span>
      </button>

      <!-- Error Message -->
      <div v-if="errorMessage" class="alert alert-error">
        <strong>❌ Error:</strong> {{ errorMessage }}
      </div>
    </div>

    <!-- Result Section -->
    <div v-if="shortUrl" class="result-section">
      <h3>✅ Short URL Created!</h3>

      <div class="short-url-display">
        <div class="url-box">
          <a :href="shortUrl" target="_blank" rel="noopener noreferrer" class="short-link">
            {{ shortUrl }}
          </a>
        </div>

        <div class="action-buttons">
          <button @click="copyToClipboard" class="btn btn-success">
            <span v-if="copied">✅ Copied!</span>
            <span v-else>📋 Copy</span>
          </button>
          <button @click="openInNewTab" class="btn btn-secondary">
            🔗 Open
          </button>
          <button @click="shareUrl" class="btn btn-secondary">
            📤 Share
          </button>
        </div>
      </div>

      <!-- QR Code Option -->
      <div class="qr-section">
        <button @click="showQr = !showQr" class="btn btn-sm btn-secondary">
          {{ showQr ? '❌ Hide QR Code' : '📱 Show QR Code' }}
        </button>

        <div v-if="showQr" class="qr-display">
          <canvas ref="qrCanvas"></canvas>
          <button @click="downloadQr" class="btn btn-sm btn-secondary">
            ⬇️ Download QR
          </button>
        </div>
      </div>

      <!-- URL Info -->
      <div class="url-info">
        <div class="info-item">
          <span class="info-label">Original URL:</span>
          <span class="info-value">{{ longUrl }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Short URL:</span>
          <span class="info-value">{{ shortUrl }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Saved Characters:</span>
          <span class="info-value success">{{ savedChars }} characters</span>
        </div>
        <div class="info-item">
          <span class="info-label">Created:</span>
          <span class="info-value">{{ createdAt }}</span>
        </div>
      </div>

      <button @click="createAnother" class="btn btn-secondary" style="margin-top: var(--space-lg);">
        🔄 Create Another
      </button>
    </div>

    <!-- Recent URLs -->
    <div v-if="recentUrls.length > 0" class="recent-section">
      <div class="recent-header">
        <h3>Recent Short URLs</h3>
        <button @click="clearHistory" class="btn btn-sm btn-secondary">
          🗑️ Clear History
        </button>
      </div>

      <div class="recent-list">
        <div v-for="(item, index) in recentUrls" :key="index" class="recent-item">
          <div class="recent-info">
            <a :href="item.short" target="_blank" class="recent-short">{{ item.short }}</a>
            <p class="recent-long">{{ truncate(item.long, 60) }}</p>
            <span class="recent-date">{{ formatDate(item.created) }}</span>
          </div>
          <div class="recent-actions">
            <button @click="copyUrl(item.short)" class="btn-icon" title="Copy">
              📋
            </button>
            <button @click="removeFromHistory(index)" class="btn-icon" title="Remove">
              ❌
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Privacy Notice -->
    <div class="privacy-notice">
      <h4>🔒 Privacy & Terms</h4>
      <ul>
        <li>We use <strong>is.gd</strong> API - a privacy-focused URL shortener</li>
        <li>is.gd does not track clicks or collect personal data</li>
        <li>Short links are <strong>public and permanent</strong></li>
        <li>Do not shorten sensitive, private, or confidential URLs</li>
        <li>Recent URLs are stored locally in your browser only</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import QRCode from 'qrcode';

// State
const longUrl = ref('');
const shortUrl = ref('');
const customShort = ref('');
const useCustomShort = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const copied = ref(false);
const showQr = ref(false);
const createdAt = ref('');
const qrCanvas = ref(null);
const recentUrls = ref([]);

// Add watch for showQr
watch(showQr, (newValue) => {
  if (newValue && shortUrl.value) {
    // Wait for next tick to ensure canvas is rendered
    setTimeout(() => {
      generateQrCode();
    }, 100);
  }
});

// Computed
const savedChars = computed(() => {
  if (!longUrl.value || !shortUrl.value) return 0;
  return longUrl.value.length - shortUrl.value.length;
});

// Methods
const shortenUrl = async () => {
  // Validate URL
  if (!longUrl.value.trim()) {
    errorMessage.value = 'Please enter a URL';
    return;
  }

  // Simple URL validation
  try {
    new URL(longUrl.value);
  } catch (e) {
    errorMessage.value = 'Please enter a valid URL (must start with http:// or https://)';
    return;
  }

  // Validate custom short code
  if (useCustomShort.value && customShort.value) {
    const validShort = /^[a-zA-Z0-9-]+$/;
    if (!validShort.test(customShort.value)) {
      errorMessage.value = 'Custom code can only contain letters, numbers, and hyphens';
      return;
    }
  }

  isLoading.value = true;
  errorMessage.value = '';
  shortUrl.value = '';

  try {
    // Build API URL
    let apiUrl = `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl.value)}`;
    
    if (useCustomShort.value && customShort.value) {
      apiUrl += `&shorturl=${encodeURIComponent(customShort.value)}`;
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.shorturl) {
      shortUrl.value = data.shorturl;
      createdAt.value = new Date().toLocaleString();
      
      // Save to history
      saveToHistory({
        long: longUrl.value,
        short: data.shorturl,
        created: Date.now()
      });

      // Generate QR code
      if (showQr.value) {
        generateQrCode();
      }
    } else if (data.errormessage) {
      errorMessage.value = data.errormessage;
    } else {
      errorMessage.value = 'Failed to shorten URL. Please try again.';
    }
  } catch (error) {
    console.error('Error:', error);
    errorMessage.value = 'Network error. Please check your connection and try again.';
  } finally {
    isLoading.value = false;
  }
};

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shortUrl.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Copy failed:', error);
    alert('Failed to copy. Please copy manually.');
  }
};

const copyUrl = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    alert('✅ Copied!');
  } catch (error) {
    console.error('Copy failed:', error);
  }
};

const openInNewTab = () => {
  window.open(shortUrl.value, '_blank');
};

const shareUrl = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Short URL',
        text: 'Check out this link:',
        url: shortUrl.value
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        copyToClipboard();
      }
    }
  } else {
    copyToClipboard();
  }
};

const generateQrCode = async () => {
  if (!qrCanvas.value) return;
  
  try {
    await QRCode.toCanvas(qrCanvas.value, shortUrl.value, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });
  } catch (error) {
    console.error('QR generation failed:', error);
  }
};

const downloadQr = () => {
  if (!qrCanvas.value) return;
  
  const link = document.createElement('a');
  link.download = `qr-${Date.now()}.png`;
  link.href = qrCanvas.value.toDataURL();
  link.click();
};

const createAnother = () => {
  longUrl.value = '';
  shortUrl.value = '';
  customShort.value = '';
  errorMessage.value = '';
  showQr.value = false;
};

const saveToHistory = (item) => {
  recentUrls.value.unshift(item);
  // Keep only last 10
  if (recentUrls.value.length > 10) {
    recentUrls.value = recentUrls.value.slice(0, 10);
  }
  localStorage.setItem('shortUrlHistory', JSON.stringify(recentUrls.value));
};

const removeFromHistory = (index) => {
  recentUrls.value.splice(index, 1);
  localStorage.setItem('shortUrlHistory', JSON.stringify(recentUrls.value));
};

const clearHistory = () => {
  if (confirm('Clear all recent URLs?')) {
    recentUrls.value = [];
    localStorage.removeItem('shortUrlHistory');
  }
};

const truncate = (str, length) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};

// Lifecycle
onMounted(() => {
  const stored = localStorage.getItem('shortUrlHistory');
  if (stored) {
    try {
      recentUrls.value = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }
});
</script>

<style scoped>
.url-shortener {
  max-width: 800px;
  margin: 0 auto;
}

/* Input Section */
.input-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  margin-bottom: var(--space-xl);
}

.url-input {
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
}

.custom-short-input {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
}

.url-prefix {
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-semibold);
  white-space: nowrap;
}

.help-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
  margin-top: var(--space-sm);
}

.btn-large {
  width: 100%;
  padding: var(--space-lg);
  font-size: var(--font-size-lg);
  margin-top: var(--space-lg);
}

.btn-large:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alert */
.alert {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  margin-top: var(--space-lg);
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  color: var(--color-error);
}

/* Result Section */
.result-section {
  background: var(--color-surface);
  border: 2px solid var(--color-success);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  margin-bottom: var(--space-xl);
}

.result-section h3 {
  color: var(--color-success);
  margin-bottom: var(--space-xl);
  text-align: center;
  font-size: var(--font-size-2xl);
}

.short-url-display {
  margin-bottom: var(--space-xl);
}

.url-box {
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
  text-align: center;
}

.short-link {
  font-family: var(--font-mono);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  word-break: break-all;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

/* QR Section */
.qr-section {
  margin: var(--space-xl) 0;
  text-align: center;
}

.qr-display {
  margin-top: var(--space-lg);
  padding: var(--space-lg);
  background: white;
  border-radius: var(--radius-md);
  display: inline-block;
}

.qr-display canvas {
  display: block;
  margin-bottom: var(--space-md);
}

/* URL Info */
.url-info {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  border-bottom: 1px solid var(--color-border);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
}

.info-value {
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  text-align: right;
}

.info-value.success {
  color: var(--color-success);
  font-weight: var(--font-weight-bold);
}

/* Recent URLs */
.recent-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.recent-header h3 {
  margin: 0;
  color: var(--color-text);
}

.recent-list {
  display: grid;
  gap: var(--space-md);
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.recent-item:hover {
  border-color: var(--color-primary);
  transform: translateX(4px);
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-short {
  font-family: var(--font-mono);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  text-decoration: none;
  display: block;
  margin-bottom: var(--space-xs);
}

.recent-short:hover {
  text-decoration: underline;
}

.recent-long {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: var(--space-xs) 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.recent-actions {
  display: flex;
  gap: var(--space-sm);
}

.btn-icon {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  padding: var(--space-xs);
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.btn-icon:hover {
  opacity: 1;
}

/* Privacy Notice */
.privacy-notice {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.privacy-notice h4 {
  color: var(--color-primary);
  margin-bottom: var(--space-md);
}

.privacy-notice ul {
  margin: 0;
  padding-left: var(--space-xl);
}

.privacy-notice li {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

/* Responsive */
@media (max-width: 768px) {
  .action-buttons {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }

  .info-value {
    text-align: left;
  }

  .recent-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }

  .recent-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>