<template>
  <div class="qr-generator">
    <div class="form-group">
      <label for="qrInput" class="form-label">Enter Text or URL:</label>
      <textarea
        id="qrInput"
        v-model="inputText"
        class="form-textarea"
        placeholder="https://tools.nahlawi.com or any text..."
        rows="4"
        @input="generateQR"
      ></textarea>
    </div>

    <div class="options-panel">
      <h3 class="options-title">Options</h3>
      
      <div class="option-row">
        <label for="qrSize" class="option-label">Size:</label>
        <select id="qrSize" v-model="qrSize" class="form-select" @change="generateQR">
          <option value="200">Small (200px)</option>
          <option value="300">Medium (300px)</option>
          <option value="400">Large (400px)</option>
          <option value="600">Extra Large (600px)</option>
        </select>
      </div>

      <div class="option-row">
        <label for="errorCorrection" class="option-label">Error Correction:</label>
        <select id="errorCorrection" v-model="errorCorrection" class="form-select" @change="generateQR">
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
      </div>

      <div class="option-row">
        <label for="fgColor" class="option-label">Color:</label>
        <input 
          id="fgColor" 
          type="color" 
          v-model="fgColor" 
          class="color-input"
          @change="generateQR"
        />
      </div>

      <div class="option-row">
        <label for="bgColor" class="option-label">Background:</label>
        <input 
          id="bgColor" 
          type="color" 
          v-model="bgColor" 
          class="color-input"
          @change="generateQR"
        />
      </div>
    </div>

    <div v-if="qrCodeUrl" class="qr-result">
      <h3>Generated QR Code:</h3>
      
      <div class="qr-display">
        <img :src="qrCodeUrl" :alt="inputText" class="qr-image" />
      </div>

      <div class="qr-info">
        <p><strong>Size:</strong> {{ qrSize }}x{{ qrSize }}px</p>
        <p><strong>Error Correction:</strong> {{ errorCorrectionNames[errorCorrection] }}</p>
        <p class="scan-tip">📱 <strong>Tip:</strong> QR code is optimized for phone cameras. Test by scanning with your phone!</p>
      </div>

      <div class="btn-group">
        <button @click="downloadQR" class="btn btn-primary">
          ⬇️ Download PNG
        </button>
        <button @click="copyToClipboard" class="btn btn-secondary">
          📋 Copy Image
        </button>
      </div>
    </div>

    <div v-else class="qr-placeholder">
      <p>Enter text or URL above to generate QR code</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import QRCode from 'qrcode';

const inputText = ref('https://tools.nahlawi.com');
const qrCodeUrl = ref('');
const qrSize = ref(400);
const errorCorrection = ref('M');
const fgColor = ref('#000000');
const bgColor = ref('#ffffff');

const errorCorrectionNames = {
  L: 'Low (7%)',
  M: 'Medium (15%)',
  Q: 'Quartile (25%)',
  H: 'High (30%)'
};

const generateQR = async () => {
  if (!inputText.value.trim()) {
    qrCodeUrl.value = '';
    return;
  }

  try {
    const url = await QRCode.toDataURL(inputText.value, {
      width: parseInt(qrSize.value),
      margin: 4, // Important: quiet zone for reliable scanning
      errorCorrectionLevel: errorCorrection.value,
      color: {
        dark: fgColor.value,
        light: bgColor.value
      },
      type: 'image/png',
      quality: 1 // Maximum quality
    });
    
    qrCodeUrl.value = url;
  } catch (error) {
    console.error('QR Code generation error:', error);
    alert('Failed to generate QR code. Please check your input.');
  }
};

const downloadQR = () => {
  if (!qrCodeUrl.value) return;
  
  const link = document.createElement('a');
  link.download = `qr-code-${Date.now()}.png`;
  link.href = qrCodeUrl.value;
  link.click();
};

const copyToClipboard = async () => {
  if (!qrCodeUrl.value) return;

  try {
    const response = await fetch(qrCodeUrl.value);
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
}

.qr-display {
  background: white;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.qr-image {
  max-width: 100%;
  height: auto;
  display: block;
  image-rendering: pixelated; /* Crisp QR codes */
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