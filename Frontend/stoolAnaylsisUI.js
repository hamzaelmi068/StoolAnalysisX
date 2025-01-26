class StoolAnalysisUI {
  constructor(containerId, apiClient) {
    this.container = document.getElementById(containerId);
    this.apiClient = apiClient;
    this.initializeUI();
  }

  initializeUI() {
    this.container.innerHTML = `
      <div class="analysis-container">
        <div class="upload-section">
          <input type="file" id="stool-upload" accept="image/*" hidden />
          <label for="stool-upload" class="upload-label">
            <svg class="upload-icon" viewBox="0 0 24 24">...</svg>
            <span>Upload Stool Image</span>
          </label>
          <div class="image-preview"></div>
        </div>
        
        <div class="analysis-progress hidden">
          <div class="progress-bar"></div>
          <div class="progress-text">Analyzing...</div>
        </div>

        <div class="results-section hidden">
          <div class="bristol-scale-display"></div>
          <div class="biomarker-grid"></div>
          <div class="recommendations"></div>
        </div>

        <div class="error-message hidden"></div>
      </div>
    `;

    this.initializeEventListeners();
    this.initializeChart();
  }

  initializeEventListeners() {
    const uploadInput = this.container.querySelector('#stool-upload');
    uploadInput.addEventListener('change', this.handleImageUpload.bind(this));
  }

  async handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      this.showLoadingState();
      const processedImage = await this.processImage(file);
      const analysis = await this.apiClient.analyzeImage(processedImage);
      this.displayResults(analysis);
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.hideLoadingState();
    }
  }

  async processImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Auto-crop and resize
          const size = Math.min(img.width, img.height);
          canvas.width = 512;
          canvas.height = 512;
          
          ctx.drawImage(
            img,
            (img.width - size)/2, (img.height - size)/2,
            size, size,
            0, 0, 512, 512
          );

          this.updateImagePreview(canvas.toDataURL('image/jpeg'));
          resolve(canvas.toDataURL('image/jpeg').split(',')[1]);
        };
      };
      reader.readAsDataURL(file);
    });
  }

  updateImagePreview(dataURL) {
    const preview = this.container.querySelector('.image-preview');
    preview.innerHTML = `<img src="${dataURL}" alt="Stool preview" />`;
  }

  showLoadingState() {
    this.container.querySelector('.analysis-progress').classList.remove('hidden');
    this.container.querySelector('.upload-section').classList.add('hidden');
  }

  hideLoadingState() {
    this.container.querySelector('.analysis-progress').classList.add('hidden');
  }

  displayResults(analysis) {
    this.container.querySelector('.results-section').classList.remove('hidden');
    
    // Bristol Scale Display
    const bristolDisplay = this.container.querySelector('.bristol-scale-display');
    bristolDisplay.innerHTML = `
      <h3>Bristol Stool Scale: Type ${analysis.biomarkers.bristolScale}</h3>
      <div class="scale-visualization">
        ${this.createBristolScaleChart(analysis.biomarkers.bristolScale)}
      </div>
    `;

    // Biomarker Grid
    const biomarkerGrid = this.container.querySelector('.biomarker-grid');
    biomarkerGrid.innerHTML = Object.entries(analysis.biomarkers)
      .map(([key, value]) => `
        <div class="biomarker-card">
          <div class="metric-name">${this.formatKey(key)}</div>
          <div class="metric-value">${value}</div>
          <div class="metric-severity ${this.getSeverityClass(value)}"></div>
        </div>
      `).join('');

    // Recommendations
    const recContainer = this.container.querySelector('.recommendations');
    recContainer.innerHTML = `
      <h3>Recommendations</h3>
      <ul>
        ${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}
      </ul>
    `;
  }

  createBristolScaleChart(score) {
    // Implementation using Chart.js or SVG animation
    return `<div class="bristol-chart" data-score="${score}"></div>`;
  }

  showError(message) {
    const errorContainer = this.container.querySelector('.error-message');
    errorContainer.textContent = message;
    errorContainer.classList.remove('hidden');
    setTimeout(() => errorContainer.classList.add('hidden'), 5000);
  }

  formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').toUpperCase();
  }

  getSeverityClass(value) {
    const severityMap = {
      normal: 'severity-normal',
      mild: 'severity-mild',
      moderate: 'severity-moderate',
      severe: 'severity-severe'
    };
    return severityMap[value.toLowerCase()] || '';
  }

  cleanup() {
    this.container.innerHTML = '';
  }
}

// Usage Example
// const analysisUI = new StoolAnalysisUI('analysis-container', apiClient);