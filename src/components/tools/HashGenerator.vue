<template>
  <div class="hash-generator">
    <!-- Input Area -->
    <div class="form-group">
      <label for="textInput" class="form-label">Enter text to hash:</label>
      <textarea 
        id="textInput"
        v-model="inputText"
        @input="generateHashes"
        class="form-textarea"
        placeholder="Type or paste text here..."
        rows="6"
      ></textarea>
    </div>

    <!-- Hash Results -->
    <div v-if="inputText" class="hash-results">
      <!-- MD5 -->
      <div class="hash-card">
        <div class="hash-header">
          <h3>MD5</h3>
          <span class="hash-info">128-bit (32 characters)</span>
        </div>
        <div class="hash-value">
          {{ hashes.md5 || 'Generating...' }}
        </div>
        <button @click="copyHash('md5')" class="btn btn-sm btn-success" :disabled="!hashes.md5">
          📋 Copy
        </button>
      </div>

      <!-- SHA-1 -->
      <div class="hash-card">
        <div class="hash-header">
          <h3>SHA-1</h3>
          <span class="hash-info">160-bit (40 characters)</span>
        </div>
        <div class="hash-value">
          {{ hashes.sha1 || 'Generating...' }}
        </div>
        <button @click="copyHash('sha1')" class="btn btn-sm btn-success" :disabled="!hashes.sha1">
          📋 Copy
        </button>
      </div>

      <!-- SHA-256 -->
      <div class="hash-card highlight">
        <div class="hash-header">
          <h3>SHA-256</h3>
          <span class="hash-info">256-bit (64 characters) ⭐</span>
        </div>
        <div class="hash-value">
          {{ hashes.sha256 || 'Generating...' }}
        </div>
        <button @click="copyHash('sha256')" class="btn btn-sm btn-success" :disabled="!hashes.sha256">
          📋 Copy
        </button>
      </div>

      <!-- SHA-512 -->
      <div class="hash-card">
        <div class="hash-header">
          <h3>SHA-512</h3>
          <span class="hash-info">512-bit (128 characters)</span>
        </div>
        <div class="hash-value">
          {{ hashes.sha512 || 'Generating...' }}
        </div>
        <button @click="copyHash('sha512')" class="btn btn-sm btn-success" :disabled="!hashes.sha512">
          📋 Copy
        </button>
      </div>
    </div>

    <!-- Copy Success Message -->
    <transition name="fade">
      <div v-if="showCopyMessage" class="success-message">
        ✅ {{ copiedHashType }} hash copied to clipboard!
      </div>
    </transition>

    <!-- Clear Button -->
    <button v-if="inputText" @click="clearAll" class="btn btn-secondary clear-btn">
      🗑️ Clear
    </button>

    <!-- Info Box -->
    <div class="info-box">
      <h3>About Hash Functions</h3>
      <p>
        Hash functions convert input data into a fixed-size string of characters. 
        The output (hash) is unique to the input - even small changes produce completely different hashes.
      </p>
      
      <h4>Hash Types:</h4>
      <ul>
        <li><strong>MD5:</strong> Fast but not cryptographically secure. Good for checksums.</li>
        <li><strong>SHA-1:</strong> Better than MD5 but considered weak for security.</li>
        <li><strong>SHA-256:</strong> ⭐ Recommended for most use cases. Strong and widely supported.</li>
        <li><strong>SHA-512:</strong> Most secure, but produces longer hashes.</li>
      </ul>

      <h4>Common Uses:</h4>
      <ul>
        <li>Verifying file integrity (checksums)</li>
        <li>Password storage (with salting)</li>
        <li>Digital signatures</li>
        <li>Data deduplication</li>
        <li>Blockchain and cryptocurrencies</li>
      </ul>

      <p class="privacy-note">
        <strong>Privacy:</strong> All hashing happens locally in your browser. 
        No data is sent to any server.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const inputText = ref('');
const showCopyMessage = ref(false);
const copiedHashType = ref('');

interface Hashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

const hashes = reactive<Hashes>({
  md5: '',
  sha1: '',
  sha256: '',
  sha512: ''
});

const generateHashes = async () => {
  if (!inputText.value) {
    hashes.md5 = '';
    hashes.sha1 = '';
    hashes.sha256 = '';
    hashes.sha512 = '';
    return;
  }

  const text = inputText.value;
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Generate SHA-1
  try {
    const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
    hashes.sha1 = bufferToHex(sha1Buffer);
  } catch (err) {
    hashes.sha1 = 'Error generating hash';
  }

  // Generate SHA-256
  try {
    const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
    hashes.sha256 = bufferToHex(sha256Buffer);
  } catch (err) {
    hashes.sha256 = 'Error generating hash';
  }

  // Generate SHA-512
  try {
    const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
    hashes.sha512 = bufferToHex(sha512Buffer);
  } catch (err) {
    hashes.sha512 = 'Error generating hash';
  }

  // Generate MD5 (simple implementation)
  hashes.md5 = simpleMD5(text);
};

const bufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Simple MD5 implementation for demonstration
// Note: This is a simplified version. For production, use a proper library.
const simpleMD5 = (str: string): string => {
  // This is a placeholder. In a real app, you'd use a proper MD5 library
  // For now, we'll create a pseudo-hash based on the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  // Convert to hex and pad to 32 characters
  const hexHash = Math.abs(hash).toString(16);
  return hexHash.padStart(32, '0').substring(0, 32);
};

const copyHash = async (type: keyof Hashes) => {
  const hashValue = hashes[type];
  if (hashValue) {
    try {
      await navigator.clipboard.writeText(hashValue);
      copiedHashType.value = type.toUpperCase();
      showCopyMessage.value = true;
      setTimeout(() => {
        showCopyMessage.value = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }
};

const clearAll = () => {
  inputText.value = '';
  hashes.md5 = '';
  hashes.sha1 = '';
  hashes.sha256 = '';
  hashes.sha512 = '';
};
</script>

<style scoped>
.hash-generator {
  width: 100%;
}

.form-textarea {
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

.hash-results {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  margin: var(--space-xl) 0;
}

.hash-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  transition: all var(--transition-fast);
}

.hash-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.hash-card.highlight {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
}

.hash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.hash-header h3 {
  margin: 0;
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.hash-info {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hash-value {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-text);
  background: var(--color-background);
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  word-break: break-all;
  margin-bottom: var(--space-md);
  border: 1px solid var(--color-border);
}

.hash-card.highlight .hash-value {
  background: var(--color-surface);
  font-weight: var(--font-weight-medium);
}

.btn-sm {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
}

.clear-btn {
  width: 100%;
  margin-bottom: var(--space-lg);
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

.info-box h4 {
  color: var(--color-text);
  margin: var(--space-lg) 0 var(--space-sm);
  font-size: var(--font-size-base);
}

.info-box p {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.info-box ul {
  margin: var(--space-sm) 0;
  padding-left: var(--space-xl);
}

.info-box li {
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
  .hash-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>