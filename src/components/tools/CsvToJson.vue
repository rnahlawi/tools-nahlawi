<template>
  <div class="csv-json-converter">
    <!-- Mode Selector -->
    <div class="mode-selector">
      <button
        @click="mode = 'csv-to-json'"
        class="btn"
        :class="mode === 'csv-to-json' ? 'btn-primary' : 'btn-secondary'"
      >
        📊 CSV → JSON
      </button>
      <button
        @click="mode = 'json-to-csv'"
        class="btn"
        :class="mode === 'json-to-csv' ? 'btn-primary' : 'btn-secondary'"
      >
        📋 JSON → CSV
      </button>
    </div>

    <!-- CSV to JSON Mode -->
    <div v-if="mode === 'csv-to-json'" class="converter-section">
      <h3>CSV to JSON Converter</h3>

      <!-- File Upload Drop Zone -->
      <div
        class="file-drop-zone"
        :class="{ 'dragging': isDragging }"
        @drop.prevent="handleFileDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="triggerFileInput"
      >
        <input
          ref="csvFileInput"
          type="file"
          accept=".csv,.txt"
          @change="handleCsvFileSelect"
          style="display: none;"
        />
        <div class="drop-zone-content">
          <div class="drop-icon">📁</div>
          <h4>Drop CSV file here or click to browse</h4>
          <p>Supports .csv and .txt files</p>
        </div>
      </div>

      <!-- Options -->
      <div class="options-panel">
        <div class="option-row">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="csvOptions.hasHeaders" />
            <span>First row contains headers</span>
          </label>
        </div>

        <div class="option-row">
          <label>Delimiter:</label>
          <select v-model="csvOptions.delimiter" class="form-select">
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="	">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <div class="option-row">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="csvOptions.trimValues" />
            <span>Trim whitespace</span>
          </label>
        </div>
      </div>

      <!-- Input -->
      <div class="form-group">
        <div class="input-header">
          <label>CSV Input</label>
          <div class="input-actions">
            <button @click="loadSampleCsv" class="btn btn-sm btn-secondary">
              📝 Load Sample
            </button>
            <button @click="csvInput = ''" class="btn btn-sm btn-secondary">
              🗑️ Clear
            </button>
          </div>
        </div>
        <textarea
          v-model="csvInput"
          class="form-textarea"
          placeholder="Paste CSV here, drop a file above, or load sample data..."
          rows="10"
        ></textarea>
      </div>

      <!-- Convert Button -->
      <button @click="convertCsvToJson" class="btn btn-primary btn-large">
        🔄 Convert to JSON
      </button>

      <!-- Preview Table -->
      <div v-if="tableData.length > 0" class="preview-section">
        <h4>Preview ({{ tableData.length }} rows)</h4>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="(header, index) in tableHeaders" :key="index">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in tableData.slice(0, 10)" :key="rowIndex">
                <td v-for="(header, colIndex) in tableHeaders" :key="colIndex">
                  {{ row[header] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="tableData.length > 10" class="preview-note">
          Showing first 10 rows. Download to see all {{ tableData.length }} rows.
        </p>
      </div>

      <!-- JSON Output -->
      <div v-if="jsonOutput" class="output-section">
        <div class="output-header">
          <label>JSON Output</label>
          <div class="output-actions">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="jsonOptions.prettify" @change="updateJsonOutput" />
              <span>Prettify</span>
            </label>
            <button @click="copyToClipboard(jsonOutput)" class="btn btn-sm btn-secondary">
              📋 Copy
            </button>
            <button @click="downloadJson" class="btn btn-sm btn-success">
              ⬇️ Download
            </button>
          </div>
        </div>
        <textarea
          v-model="jsonOutput"
          class="form-textarea code-output"
          readonly
          rows="15"
        ></textarea>
        <div class="output-stats">
          <span>{{ jsonOutput.length.toLocaleString() }} characters</span>
          <span>{{ tableData.length }} objects</span>
        </div>
      </div>
    </div>

    <!-- JSON to CSV Mode -->
    <div v-else class="converter-section">
      <h3>JSON to CSV Converter</h3>

      <!-- File Upload Drop Zone -->
      <div
        class="file-drop-zone"
        :class="{ 'dragging': isDragging }"
        @drop.prevent="handleFileDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="triggerFileInput"
      >
        <input
          ref="jsonFileInput"
          type="file"
          accept=".json"
          @change="handleJsonFileSelect"
          style="display: none;"
        />
        <div class="drop-zone-content">
          <div class="drop-icon">📁</div>
          <h4>Drop JSON file here or click to browse</h4>
          <p>Supports .json files</p>
        </div>
      </div>

      <!-- Options -->
      <div class="options-panel">
        <div class="option-row">
          <label>Delimiter:</label>
          <select v-model="csvOptions.delimiter" class="form-select">
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="	">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <div class="option-row">
          <label class="checkbox-wrapper">
            <input type="checkbox" v-model="csvOptions.includeHeaders" />
            <span>Include headers</span>
          </label>
        </div>
      </div>

      <!-- Input -->
      <div class="form-group">
        <div class="input-header">
          <label>JSON Input</label>
          <div class="input-actions">
            <button @click="loadSampleJson" class="btn btn-sm btn-secondary">
              📝 Load Sample
            </button>
            <button @click="jsonInput = ''" class="btn btn-sm btn-secondary">
              🗑️ Clear
            </button>
          </div>
        </div>
        <textarea
          v-model="jsonInput"
          class="form-textarea code-output"
          placeholder="Paste JSON array here, drop a file above, or load sample data..."
          rows="10"
        ></textarea>
      </div>

      <!-- Convert Button -->
      <button @click="convertJsonToCsv" class="btn btn-primary btn-large">
        🔄 Convert to CSV
      </button>

      <!-- Preview Table -->
      <div v-if="tableData.length > 0" class="preview-section">
        <h4>Preview ({{ tableData.length }} rows)</h4>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th v-for="(header, index) in tableHeaders" :key="index">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in tableData.slice(0, 10)" :key="rowIndex">
                <td v-for="(header, colIndex) in tableHeaders" :key="colIndex">
                  {{ row[header] }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-if="tableData.length > 10" class="preview-note">
          Showing first 10 rows. Download to see all {{ tableData.length }} rows.
        </p>
      </div>

      <!-- CSV Output -->
      <div v-if="csvOutput" class="output-section">
        <div class="output-header">
          <label>CSV Output</label>
          <div class="output-actions">
            <button @click="copyToClipboard(csvOutput)" class="btn btn-sm btn-secondary">
              📋 Copy
            </button>
            <button @click="downloadCsv" class="btn btn-sm btn-success">
              ⬇️ Download
            </button>
          </div>
        </div>
        <textarea
          v-model="csvOutput"
          class="form-textarea"
          readonly
          rows="15"
        ></textarea>
        <div class="output-stats">
          <span>{{ csvOutput.split('\n').length }} rows</span>
          <span>{{ csvOutput.length.toLocaleString() }} characters</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// State
const mode = ref('csv-to-json');
const isDragging = ref(false);

const csvInput = ref('');
const jsonInput = ref('');
const csvOutput = ref('');
const jsonOutput = ref('');

const tableData = ref([]);
const tableHeaders = ref([]);

const csvFileInput = ref(null);
const jsonFileInput = ref(null);

const csvOptions = reactive({
  delimiter: ',',
  hasHeaders: true,
  trimValues: true,
  includeHeaders: true
});

const jsonOptions = reactive({
  prettify: true
});

// Sample Data
const sampleCsv = `Name,Age,City,Email
John Doe,30,New York,john@example.com
Jane Smith,25,Los Angeles,jane@example.com
Bob Johnson,35,Chicago,bob@example.com
Alice Williams,28,Houston,alice@example.com`;

const sampleJson = `[
  {"name": "John Doe", "age": 30, "city": "New York", "email": "john@example.com"},
  {"name": "Jane Smith", "age": 25, "city": "Los Angeles", "email": "jane@example.com"},
  {"name": "Bob Johnson", "age": 35, "city": "Chicago", "email": "bob@example.com"},
  {"name": "Alice Williams", "age": 28, "city": "Houston", "email": "alice@example.com"}
]`;

// File Upload Methods
const triggerFileInput = () => {
  if (mode.value === 'csv-to-json') {
    csvFileInput.value?.click();
  } else {
    jsonFileInput.value?.click();
  }
};

const handleFileDrop = (event) => {
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  
  if (!file) return;

  if (mode.value === 'csv-to-json') {
    if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
      readCsvFile(file);
    } else {
      alert('Please drop a CSV or TXT file');
    }
  } else {
    if (file.name.endsWith('.json')) {
      readJsonFile(file);
    } else {
      alert('Please drop a JSON file');
    }
  }
};

const handleCsvFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    readCsvFile(file);
  }
};

const handleJsonFileSelect = (event) => {
  const file = event.target.files?.[0];
  if (file) {
    readJsonFile(file);
  }
};

const readCsvFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    csvInput.value = e.target.result;
    // Auto-convert after loading
    setTimeout(() => convertCsvToJson(), 100);
  };
  reader.onerror = () => {
    alert('Error reading file');
  };
  reader.readAsText(file);
};

const readJsonFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    jsonInput.value = e.target.result;
    // Auto-convert after loading
    setTimeout(() => convertJsonToCsv(), 100);
  };
  reader.onerror = () => {
    alert('Error reading file');
  };
  reader.readAsText(file);
};

// Methods - CSV to JSON
const loadSampleCsv = () => {
  csvInput.value = sampleCsv;
};

const convertCsvToJson = () => {
  if (!csvInput.value.trim()) {
    alert('Please enter CSV data');
    return;
  }

  try {
    const lines = csvInput.value.trim().split('\n');
    const delimiter = csvOptions.delimiter;
    
    let headers;
    let dataLines;

    if (csvOptions.hasHeaders) {
      headers = parseCsvLine(lines[0], delimiter);
      dataLines = lines.slice(1);
    } else {
      // Generate generic headers
      const firstLine = parseCsvLine(lines[0], delimiter);
      headers = firstLine.map((_, i) => `column_${i + 1}`);
      dataLines = lines;
    }

    tableHeaders.value = headers;

    const data = dataLines
      .filter(line => line.trim())
      .map(line => {
        const values = parseCsvLine(line, delimiter);
        const obj = {};
        headers.forEach((header, index) => {
          let value = values[index] || '';
          if (csvOptions.trimValues) {
            value = value.trim();
          }
          obj[header] = value;
        });
        return obj;
      });

    tableData.value = data;
    updateJsonOutput();

  } catch (error) {
    alert('Error parsing CSV: ' + error.message);
    console.error(error);
  }
};

const parseCsvLine = (line, delimiter) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

const updateJsonOutput = () => {
  if (tableData.value.length === 0) return;
  
  if (jsonOptions.prettify) {
    jsonOutput.value = JSON.stringify(tableData.value, null, 2);
  } else {
    jsonOutput.value = JSON.stringify(tableData.value);
  }
};

// Methods - JSON to CSV
const loadSampleJson = () => {
  jsonInput.value = sampleJson;
};

const convertJsonToCsv = () => {
  if (!jsonInput.value.trim()) {
    alert('Please enter JSON data');
    return;
  }

  try {
    const data = JSON.parse(jsonInput.value);

    if (!Array.isArray(data)) {
      throw new Error('JSON must be an array of objects');
    }

    if (data.length === 0) {
      throw new Error('JSON array is empty');
    }

    // Extract headers from first object
    const headers = Object.keys(data[0]);
    tableHeaders.value = headers;
    tableData.value = data;

    // Build CSV
    const delimiter = csvOptions.delimiter;
    let csv = '';

    if (csvOptions.includeHeaders) {
      csv += headers.map(h => escapeCsvValue(h, delimiter)).join(delimiter) + '\n';
    }

    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header];
        return escapeCsvValue(value, delimiter);
      });
      csv += values.join(delimiter) + '\n';
    });

    csvOutput.value = csv.trim();

  } catch (error) {
    alert('Error parsing JSON: ' + error.message);
    console.error(error);
  }
};

const escapeCsvValue = (value, delimiter) => {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  // Check if value needs quoting
  if (
    stringValue.includes(delimiter) ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    // Escape quotes by doubling them
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }

  return stringValue;
};

// Utility Methods
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('✅ Copied to clipboard!');
  } catch (error) {
    console.error('Copy failed:', error);
    alert('⚠️ Copy failed. Please try again.');
  }
};

const downloadJson = () => {
  const blob = new Blob([jsonOutput.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `data_${Date.now()}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};

const downloadCsv = () => {
  const blob = new Blob([csvOutput.value], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `data_${Date.now()}.csv`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};
</script>

<style scoped>
.csv-json-converter {
  max-width: 1000px;
  margin: 0 auto;
}

/* Mode Selector */
.mode-selector {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-2xl);
}

.mode-selector .btn {
  flex: 1;
  padding: var(--space-lg);
  font-size: var(--font-size-lg);
}

/* Converter Section */
.converter-section h3 {
  margin-bottom: var(--space-xl);
  color: var(--color-text);
  text-align: center;
}

/* File Drop Zone */
.file-drop-zone {
  border: 3px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  margin-bottom: var(--space-xl);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-surface);
  text-align: center;
}

.file-drop-zone:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-alpha);
}

.file-drop-zone.dragging {
  border-color: var(--color-primary);
  background: var(--color-primary-alpha);
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
}

.drop-zone-content {
  pointer-events: none;
}

.drop-icon {
  font-size: 4rem;
  margin-bottom: var(--space-md);
}

.drop-zone-content h4 {
  color: var(--color-text);
  margin-bottom: var(--space-sm);
  font-size: var(--font-size-lg);
}

.drop-zone-content p {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

/* Options Panel */
.options-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.option-row {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.option-row:last-child {
  margin-bottom: 0;
}

.option-row label:not(.checkbox-wrapper) {
  min-width: 100px;
  font-weight: var(--font-weight-medium);
  color: var(--color-text);
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}

.checkbox-wrapper input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-select {
  padding: var(--space-sm) var(--space-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
}

/* Input/Output Sections */
.input-header,
.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
}

.input-header label,
.output-header label {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text);
}

.input-actions,
.output-actions {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.code-output {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
}

.btn-large {
  width: 100%;
  padding: var(--space-lg);
  font-size: var(--font-size-lg);
  margin: var(--space-xl) 0;
}

/* Preview Section */
.preview-section {
  margin: var(--space-xl) 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.preview-section h4 {
  margin-bottom: var(--space-md);
  color: var(--color-text);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.data-table th {
  background: var(--color-primary-alpha);
  color: var(--color-text);
  padding: var(--space-md);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  border-bottom: 2px solid var(--color-border);
  white-space: nowrap;
}

.data-table td {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.data-table tbody tr:hover {
  background: var(--color-surface-hover);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.preview-note {
  margin-top: var(--space-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
  font-style: italic;
}

/* Output Section */
.output-section {
  margin-top: var(--space-xl);
}

.output-stats {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* Responsive */
@media (max-width: 768px) {
  .mode-selector {
    flex-direction: column;
  }

  .option-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .option-row label:not(.checkbox-wrapper) {
    min-width: auto;
    margin-bottom: var(--space-xs);
  }

  .input-header,
  .output-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .input-actions,
  .output-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .table-wrapper {
    font-size: var(--font-size-xs);
  }
}
</style>