<template>
  <div class="color-picker-tool">
    <!-- Main Color Picker -->
    <div class="picker-section">
      <div class="color-display" :style="{ backgroundColor: currentColor }">
        <div class="color-overlay">
          <h2>{{ currentColor.toUpperCase() }}</h2>
          <p>Click to change color</p>
        </div>
        <input
          type="color"
          v-model="currentColor"
          @input="handleColorChange"
          class="color-input-hidden"
        />
      </div>

      <div class="picker-controls">
        <button @click="randomColor" class="btn btn-primary">
          🎲 Random Color
        </button>
        <button @click="copyColor(currentColor)" class="btn btn-secondary">
          📋 Copy HEX
        </button>
      </div>
    </div>

    <!-- Color Formats -->
    <div class="formats-section">
      <h3>Color Formats</h3>
      
      <div class="format-grid">
        <div class="format-item">
          <label>HEX</label>
          <div class="input-with-copy">
            <input
              v-model="formats.hex"
              @input="updateFromHex"
              class="form-input"
              placeholder="#000000"
            />
            <button @click="copyColor(formats.hex)" class="btn-copy">📋</button>
          </div>
        </div>

        <div class="format-item">
          <label>RGB</label>
          <div class="input-with-copy">
            <input
              v-model="formats.rgb"
              @input="updateFromRgb"
              class="form-input"
              placeholder="rgb(0, 0, 0)"
            />
            <button @click="copyColor(formats.rgb)" class="btn-copy">📋</button>
          </div>
        </div>

        <div class="format-item">
          <label>HSL</label>
          <div class="input-with-copy">
            <input
              v-model="formats.hsl"
              @input="updateFromHsl"
              class="form-input"
              placeholder="hsl(0, 0%, 0%)"
            />
            <button @click="copyColor(formats.hsl)" class="btn-copy">📋</button>
          </div>
        </div>

        <div class="format-item">
          <label>CMYK</label>
          <div class="input-with-copy">
            <input
              :value="formats.cmyk"
              class="form-input"
              readonly
              placeholder="cmyk(0%, 0%, 0%, 100%)"
            />
            <button @click="copyColor(formats.cmyk)" class="btn-copy">📋</button>
          </div>
        </div>
      </div>
    </div>

    <!-- RGB Sliders -->
    <div class="sliders-section">
      <h3>RGB Sliders</h3>
      
      <div class="slider-group">
        <div class="slider-item">
          <label>
            <span class="slider-label">Red</span>
            <span class="slider-value">{{ rgb.r }}</span>
          </label>
          <input
            v-model.number="rgb.r"
            @input="updateFromRgbSliders"
            type="range"
            min="0"
            max="255"
            class="range-input range-red"
          />
        </div>

        <div class="slider-item">
          <label>
            <span class="slider-label">Green</span>
            <span class="slider-value">{{ rgb.g }}</span>
          </label>
          <input
            v-model.number="rgb.g"
            @input="updateFromRgbSliders"
            type="range"
            min="0"
            max="255"
            class="range-input range-green"
          />
        </div>

        <div class="slider-item">
          <label>
            <span class="slider-label">Blue</span>
            <span class="slider-value">{{ rgb.b }}</span>
          </label>
          <input
            v-model.number="rgb.b"
            @input="updateFromRgbSliders"
            type="range"
            min="0"
            max="255"
            class="range-input range-blue"
          />
        </div>
      </div>
    </div>

    <!-- Color Harmonies -->
    <div class="harmonies-section">
      <h3>Color Harmonies</h3>
      
      <div class="harmony-type-buttons">
        <button
          v-for="type in harmonyTypes"
          :key="type.id"
          @click="selectedHarmony = type.id"
          class="btn btn-sm"
          :class="{ 'btn-primary': selectedHarmony === type.id, 'btn-secondary': selectedHarmony !== type.id }"
        >
          {{ type.name }}
        </button>
      </div>

      <div class="harmony-palette">
        <div
          v-for="(color, index) in harmonies[selectedHarmony]"
          :key="index"
          class="harmony-color"
          :style="{ backgroundColor: color }"
          @click="currentColor = color; handleColorChange()"
          :title="color"
        >
          <span class="harmony-label">{{ color }}</span>
        </div>
      </div>
    </div>

    <!-- Color Shades -->
    <div class="shades-section">
      <h3>Shades & Tints</h3>
      
      <div class="shades-grid">
        <div
          v-for="(shade, index) in shades"
          :key="index"
          class="shade-item"
          :style="{ backgroundColor: shade }"
          @click="currentColor = shade; handleColorChange()"
          :title="shade"
        >
          <span class="shade-label">{{ getShadeLabel(index) }}</span>
        </div>
      </div>
    </div>

    <!-- Saved Colors -->
    <div class="saved-section">
      <div class="saved-header">
        <h3>Saved Colors</h3>
        <button @click="saveCurrentColor" class="btn btn-secondary btn-sm">
          ➕ Save Current
        </button>
      </div>

      <div v-if="savedColors.length === 0" class="empty-state">
        <p>No saved colors yet. Click "Save Current" to add colors to your palette.</p>
      </div>

      <div v-else class="saved-grid">
        <div
          v-for="(color, index) in savedColors"
          :key="index"
          class="saved-item"
          :style="{ backgroundColor: color }"
          @click="currentColor = color; handleColorChange()"
        >
          <span class="saved-label">{{ color }}</span>
          <button @click.stop="removeSavedColor(index)" class="btn-remove">×</button>
        </div>
      </div>

      <button
        v-if="savedColors.length > 0"
        @click="clearSavedColors"
        class="btn btn-secondary btn-sm"
        style="margin-top: var(--space-md);"
      >
        🗑️ Clear All
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue';

// State
const currentColor = ref('#3b82f6');
const selectedHarmony = ref('complementary');

const rgb = reactive({
  r: 59,
  g: 130,
  b: 246
});

const formats = reactive({
  hex: '#3b82f6',
  rgb: 'rgb(59, 130, 246)',
  hsl: 'hsl(217, 91%, 60%)',
  cmyk: 'cmyk(76%, 47%, 0%, 4%)'
});

const savedColors = ref([]);

const harmonyTypes = [
  { id: 'complementary', name: 'Complementary' },
  { id: 'analogous', name: 'Analogous' },
  { id: 'triadic', name: 'Triadic' },
  { id: 'tetradic', name: 'Tetradic' },
  { id: 'monochromatic', name: 'Monochromatic' }
];

// Computed
const harmonies = computed(() => {
  const hsl = hexToHsl(currentColor.value);
  const h = hsl.h;
  
  return {
    complementary: [
      currentColor.value,
      hslToHex((h + 180) % 360, hsl.s, hsl.l)
    ],
    analogous: [
      hslToHex((h - 30 + 360) % 360, hsl.s, hsl.l),
      currentColor.value,
      hslToHex((h + 30) % 360, hsl.s, hsl.l)
    ],
    triadic: [
      currentColor.value,
      hslToHex((h + 120) % 360, hsl.s, hsl.l),
      hslToHex((h + 240) % 360, hsl.s, hsl.l)
    ],
    tetradic: [
      currentColor.value,
      hslToHex((h + 90) % 360, hsl.s, hsl.l),
      hslToHex((h + 180) % 360, hsl.s, hsl.l),
      hslToHex((h + 270) % 360, hsl.s, hsl.l)
    ],
    monochromatic: [
      hslToHex(h, hsl.s, Math.min(hsl.l + 20, 100)),
      hslToHex(h, hsl.s, Math.min(hsl.l + 10, 100)),
      currentColor.value,
      hslToHex(h, hsl.s, Math.max(hsl.l - 10, 0)),
      hslToHex(h, hsl.s, Math.max(hsl.l - 20, 0))
    ]
  };
});

const shades = computed(() => {
  const hsl = hexToHsl(currentColor.value);
  const result = [];
  
  for (let i = 0; i <= 10; i++) {
    const lightness = (i / 10) * 100;
    result.push(hslToHex(hsl.h, hsl.s, lightness));
  }
  
  return result;
});

// Methods
const handleColorChange = () => {
  const hex = currentColor.value;
  const rgbObj = hexToRgb(hex);
  const hsl = hexToHsl(hex);
  const cmyk = rgbToCmyk(rgbObj.r, rgbObj.g, rgbObj.b);
  
  rgb.r = rgbObj.r;
  rgb.g = rgbObj.g;
  rgb.b = rgbObj.b;
  
  formats.hex = hex;
  formats.rgb = `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`;
  formats.hsl = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
  formats.cmyk = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
};

const updateFromRgbSliders = () => {
  currentColor.value = rgbToHex(rgb.r, rgb.g, rgb.b);
  handleColorChange();
};

const updateFromHex = () => {
  if (/^#[0-9A-F]{6}$/i.test(formats.hex)) {
    currentColor.value = formats.hex;
    handleColorChange();
  }
};

const updateFromRgb = () => {
  const match = formats.rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    currentColor.value = rgbToHex(r, g, b);
    handleColorChange();
  }
};

const updateFromHsl = () => {
  const match = formats.hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (match) {
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    currentColor.value = hslToHex(h, s, l);
    handleColorChange();
  }
};

const randomColor = () => {
  const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  currentColor.value = randomHex;
  handleColorChange();
};

const copyColor = async (color) => {
  try {
    await navigator.clipboard.writeText(color);
    alert(`✅ Copied: ${color}`);
  } catch (error) {
    console.error('Copy failed:', error);
  }
};

const saveCurrentColor = () => {
  if (!savedColors.value.includes(currentColor.value)) {
    savedColors.value.push(currentColor.value);
    localStorage.setItem('savedColors', JSON.stringify(savedColors.value));
  }
};

const removeSavedColor = (index) => {
  savedColors.value.splice(index, 1);
  localStorage.setItem('savedColors', JSON.stringify(savedColors.value));
};

const clearSavedColors = () => {
  if (confirm('Clear all saved colors?')) {
    savedColors.value = [];
    localStorage.removeItem('savedColors');
  }
};

const getShadeLabel = (index) => {
  const percentage = (index / 10) * 100;
  return `${Math.round(percentage)}%`;
};

// Color Conversion Functions
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const hexToHsl = (hex) => {
  const rgb = hexToRgb(hex);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
};

const hslToHex = (h, s, l) => {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return rgbToHex(r, g, b);
};

const rgbToCmyk = (r, g, b) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = k === 1 ? 0 : (1 - rNorm - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - gNorm - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
};

// Lifecycle
onMounted(() => {
  const stored = localStorage.getItem('savedColors');
  if (stored) {
    savedColors.value = JSON.parse(stored);
  }
  handleColorChange();
});
</script>

<style scoped>
.color-picker-tool {
  max-width: 900px;
  margin: 0 auto;
}

/* Color Display */
.picker-section {
  margin-bottom: var(--space-2xl);
}

.color-display {
  position: relative;
  height: 300px;
  border-radius: var(--radius-lg);
  cursor: pointer;
  overflow: hidden;
  transition: transform var(--transition-fast);
  box-shadow: var(--shadow-lg);
}

.color-display:hover {
  transform: scale(1.02);
}

.color-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.2));
}

.color-overlay h2 {
  font-size: var(--font-size-4xl);
  margin-bottom: var(--space-sm);
}

.color-overlay p {
  font-size: var(--font-size-lg);
  opacity: 0.9;
}

.color-input-hidden {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.picker-controls {
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

/* Format Grid */
.formats-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.formats-section h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-text);
}

.format-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
}

.format-item label {
  display: block;
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-sm);
  color: var(--color-text);
  font-size: var(--font-size-sm);
}

.input-with-copy {
  display: flex;
  gap: var(--space-sm);
}

.input-with-copy input {
  flex: 1;
}

.btn-copy {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface-hover);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: var(--font-size-lg);
}

.btn-copy:hover {
  background: var(--color-primary-alpha);
  border-color: var(--color-primary);
}

/* Sliders */
.sliders-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.sliders-section h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-text);
}

.slider-group {
  display: grid;
  gap: var(--space-lg);
}

.slider-item label {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.slider-value {
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.range-input {
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  appearance: none;
  -webkit-appearance: none;
  background: var(--color-border);
  outline: none;
}

.range-input::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  box-shadow: var(--shadow-md);
}

.range-red::-webkit-slider-thumb { background: #ef4444; }
.range-green::-webkit-slider-thumb { background: #10b981; }
.range-blue::-webkit-slider-thumb { background: #3b82f6; }

/* Harmonies */
.harmonies-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.harmonies-section h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-text);
}

.harmony-type-buttons {
  display: flex;
  gap: var(--space-sm);
  flex-wrap: wrap;
  margin-bottom: var(--space-lg);
}

.harmony-palette {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-md);
}

.harmony-color {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  cursor: pointer;
  position: relative;
  transition: transform var(--transition-fast);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: flex-end;
  padding: var(--space-sm);
}

.harmony-color:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.harmony-label {
  color: white;
  font-size: var(--font-size-xs);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  font-family: var(--font-mono);
}

/* Shades */
.shades-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-xl);
}

.shades-section h3 {
  margin-bottom: var(--space-lg);
  color: var(--color-text);
}

.shades-grid {
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: var(--space-sm);
}

.shade-item {
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  cursor: pointer;
  position: relative;
  transition: transform var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.shade-item:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
  z-index: 1;
}

.shade-label {
  color: rgba(0,0,0,0.5);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

/* Saved Colors */
.saved-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
}

.saved-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
}

.saved-header h3 {
  margin: 0;
  color: var(--color-text);
}

.empty-state {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--color-text-secondary);
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-md);
}

.saved-item {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  cursor: pointer;
  position: relative;
  transition: transform var(--transition-fast);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm);
}

.saved-item:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.saved-label {
  color: white;
  font-size: var(--font-size-xs);
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
  font-family: var(--font-mono);
}

.btn-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
  font-size: var(--font-size-lg);
  line-height: 1;
}

.saved-item:hover .btn-remove {
  opacity: 1;
}

.btn-remove:hover {
  background: rgba(239, 68, 68, 0.9);
}

/* Responsive */
@media (max-width: 768px) {
  .format-grid {
    grid-template-columns: 1fr;
  }

  .harmony-palette {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }

  .shades-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .saved-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }
}
</style>