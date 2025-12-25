<template>
  <div class="qr-generator">
    <div class="form-group">
      <label for="qrInput" class="form-label">Enter Text or URL</label>
      <textarea
        id="qrInput"
        v-model="inputText"
        class="form-textarea"
        placeholder="https://tools.nahlawi.com or any text..."
        rows="4"
        @input="debouncedGenerate"
      ></textarea>
    </div>

    <div class="options-panel">
      <h3 class="options-title">QR Code Options</h3>
      
      <div class="option-row">
        <label for="qrSize" class="option-label">Size</label>
        <select id="qrSize" v-model="qrSize" class="form-select" @change="generateQR">
          <option :value="300">Small (300x300)</option>
          <option :value="400">Medium (400x400)</option>
          <option :value="500">Large (500x500)</option>
          <option :value="600">Extra Large (600x600)</option>
        </select>
      </div>

      <div class="option-row">
        <label for="errorCorrection" class="option-label">Error Correction</label>
        <select id="errorCorrection" v-model="errorCorrection" class="form-select" @change="generateQR">
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%) - Recommended</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%) - Best for print</option>
        </select>
      </div>

      <div class="option-row">
        <label for="fgColor" class="option-label">Foreground Color</label>
        <input 
          id="fgColor" 
          type="color" 
          v-model="fgColor" 
          class="color-input"
          @change="generateQR"
        />
      </div>

      <div class="option-row">
        <label for="bgColor" class="option-label">Background Color</label>
        <input 
          id="bgColor" 
          type="color" 
          v-model="bgColor" 
          class="color-input"
          @change="generateQR"
        />
      </div>
    </div>

    <button @click="generateQR" class="btn btn-primary" style="width: 100%; margin: var(--space-lg) 0;">
      🎨 Generate QR Code
    </button>

    <div v-if="qrCodeDataUrl" class="qr-result">
      <h3>Generated QR Code</h3>
      
      <div class="qr-display">
        <img :src="qrCodeDataUrl" :alt="inputText" class="qr-image" />
      </div>

      <div class="qr-info">
        <p><strong>Size:</strong> {{ qrSize }}x{{ qrSize }}px</p>
        <p><strong>Error Correction:</strong> {{ errorCorrectionNames[errorCorrection] }}</p>
        <p class="scan-tip">📱 <strong>Tip:</strong> For best scanning, use Medium or High error correction. Test with your phone camera before printing!</p>
      </div>

      <div class="btn-group">
        <button @click="downloadQR" class="btn btn-success">
          ⬇️ Download PNG
        </button>
        <button @click="copyToClipboard" class="btn btn-secondary">
          📋 Copy Image
        </button>
        <button @click="testQR" class="btn btn-secondary">
          📱 Test Scan
        </button>
      </div>
    </div>

    <div v-else class="qr-placeholder">
      <p>Enter text or URL above and click "Generate QR Code"</p>
    </div>

    <!-- Testing Instructions -->
    <div class="info-box" style="margin-top: var(--space-xl);">
      <h3>📱 How to Test QR Code Scanning</h3>
      <ol>
        <li>Open your phone's camera app</li>
        <li>Point it at the QR code on your screen</li>
        <li>A notification should appear to open the link</li>
        <li>If it doesn't scan, try:
          <ul>
            <li>Adjusting screen brightness</li>
            <li>Moving phone closer or further away</li>
            <li>Using Medium or High error correction</li>
            <li>Increasing QR code size</li>
          </ul>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import QRCode from 'qrcode';

const inputText = ref('https://tools.nahlawi.com');
const qrCodeDataUrl = ref('');
const qrSize = ref(400);
const errorCorrection = ref('M');
const fgColor = ref('#000000');
const bgColor = ref('#ffffff');

let debounceTimeout = null;

const errorCorrectionNames = {
  L: 'Low (7%)',
  M: 'Medium (15%)',
  Q: 'Quartile (25%)',
  H: 'High (30%)'
};

const generateQR = async () => {
  if (!inputText.value.trim()) {
    qrCodeDataUrl.value = '';
    return;
  }

  try {
    const dataUrl = await QRCode.toDataURL(inputText.value, {
      width: qrSize.value,
      margin: 4, // CRITICAL: Quiet zone for reliable scanning
      errorCorrectionLevel: errorCorrection.value,
      color: {
        dark: fgColor.value,
        light: bgColor.value
      },
      type: 'image/png',
      quality: 1, // Maximum quality
      scale: 4 // Higher resolution for better scanning
    });
    
    qrCodeDataUrl.value = dataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    alert('Failed to generate QR code. Please check your input.');
  }
};

const debouncedGenerate = () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    generateQR();
  }, 500);
};

const downloadQR = () => {
  if (!qrCodeDataUrl.value) return;
  
  const link = document.createElement('a');
  link.download = `qr-code-${Date.now()}.png`;
  link.href = qrCodeDataUrl.value;
  link.click();
};

const copyToClipboard = async () => {
  if (!qrCodeDataUrl.value) return;

  try {
    const response = await fetch(qrCodeDataUrl.value);
    const blob = await response.blob();
    
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob
      })
    ]);
    
    alert('✅ QR code copied to clipboard!');
  } catch (error) {
    console.error('Copy failed:', error);
    alert('⚠️ Copy failed. Try downloading instead.');
  }
};

const testQR = () => {
  alert('📱 Testing Instructions:\n\n1. Open your phone camera\n2. Point at the QR code\n3. Wait for notification\n4. Tap to open link\n\nIf it doesn\'t work:\n• Try Medium or High error correction\n• Increase size to 500px or 600px\n• Ensure good contrast (black on white works best)');
};

onMounted(() => {
  generateQR();
});
</script>

<style scoped>
.qr-generator {
  max-width: 800px;
  margin: 0 auto;
}

.form-textarea {
  font-family: var(--font-mono);
}

.options-panel {
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin: var(--space-xl) 0;
}

.options-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.option-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) 0;
  gap: var(--space-md);
}

.option-label {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  min-width: 150px;
}

.form-select {
  max-width: 250px;
  padding: var(--space-sm) var(--space-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
}

.color-input {
  width: 80px;
  height: 40px;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  padding: 2px;
}

.qr-result {
  margin-top: var(--space-xl);
}

.qr-result h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-text);
  text-align: center;
}

.qr-display {
  background: white;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-lg);
  box-shadow: var(--shadow-md);
}

.qr-image {
  max-width: 100%;
  height: auto;
  display: block;
  image-rendering: pixelated; /* Crisp edges for QR codes */
}

.qr-info {
  background: var(--color-primary-alpha);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.qr-info p {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
}

.qr-info p:last-child {
  margin-bottom: 0;
}

.scan-tip {
  color: var(--color-primary) !important;
  font-size: var(--font-size-sm);
  margin-top: var(--space-md) !important;
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
  font-weight: var(--font-weight-semibold);
}

.qr-placeholder {
  text-align: center;
  padding: var(--space-3xl);
  color: var(--color-text-tertiary);
  background: var(--color-surface);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  margin-top: var(--space-xl);
}

.btn-group {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
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

.info-box ol {
  margin: var(--space-md) 0;
  padding-left: var(--space-xl);
}

.info-box li {
  margin-bottom: var(--space-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.info-box ul {
  margin: var(--space-sm) 0;
  padding-left: var(--space-xl);
}

@media (max-width: 768px) {
  .option-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .option-label {
    min-width: auto;
  }

  .form-select {
    width: 100%;
    max-width: none;
  }

  .btn-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>