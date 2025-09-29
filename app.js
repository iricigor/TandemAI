// Application State
class TandemAnalyzer {
    constructor() {
        this.currentPage = 'title';
        this.datasets = [];
        this.analysisResults = null;
        this.settings = {
            apiToken: '',
            storageType: 'persistent',
            enableNotifications: false,
            autoAnalysis: false
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.loadDatasets();
        this.setupEventListeners();
        this.renderDatasets();
        this.populateMockData();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('navTabs').addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-tab')) {
                this.navigateToPage(e.target.dataset.page);
            }
        });

        // Mobile menu
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        document.getElementById('mobileMenuOverlay').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // File upload
        this.setupFileUpload();

        // Dataset management
        document.getElementById('selectAllBtn').addEventListener('click', () => {
            this.selectAllDatasets();
        });

        document.getElementById('analyzeBtn').addEventListener('click', () => {
            this.analyzeSelectedDatasets();
        });

        // Settings
        document.getElementById('saveApiBtn').addEventListener('click', () => {
            this.saveApiToken();
        });

        document.querySelectorAll('input[name="storageType"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.settings.storageType = radio.value;
                this.saveSettings();
            });
        });

        document.getElementById('enableNotifications').addEventListener('change', (e) => {
            this.settings.enableNotifications = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('autoAnalysis').addEventListener('change', (e) => {
            this.settings.autoAnalysis = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('clearDataBtn').addEventListener('click', () => {
            this.clearAllData();
        });
    }

    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');

        // Click to upload
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            this.handleFileUpload(e.dataTransfer.files);
        });
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            const dataset = {
                id: 'dataset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                name: file.name,
                uploadDate: new Date().toISOString().split('T'),
                fileSize: this.formatFileSize(file.size),
                dateRange: this.generateDateRange(),
                recordCount: Math.floor(Math.random() * 10000) + 1000,
                selected: false,
                file: file
            };

            this.datasets.push(dataset);
        });

        this.saveDatasets();
        this.renderDatasets();

        if (this.settings.autoAnalysis && this.datasets.length > 0) {
            this.analyzeSelectedDatasets();
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    generateDateRange() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        const options = { month: 'short', day: 'numeric' };
        return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}, 2024`;
    }

    renderDatasets() {
        const datasetsList = document.getElementById('datasetsList');
        
        if (this.datasets.length === 0) {
            datasetsList.innerHTML = `
                <div class="empty-state">
                    <p>No datasets uploaded yet. Upload your Tandem pump data files to get started.</p>
                </div>
            `;
            return;
        }

        datasetsList.innerHTML = this.datasets.map(dataset => `
            <div class="dataset-item ${dataset.selected ? 'selected' : ''}" data-id="${dataset.id}">
                <input type="checkbox" class="dataset-checkbox" ${dataset.selected ? 'checked' : ''}>
                <div class="dataset-info">
                    <div class="dataset-name">${dataset.name}</div>
                    <div class="dataset-meta">
                        <span>📅 ${dataset.uploadDate}</span>
                        <span>📊 ${dataset.recordCount.toLocaleString()} records</span>
                        <span>💾 ${dataset.fileSize}</span>
                        <span>📈 ${dataset.dateRange}</span>
                    </div>
                </div>
                <div class="dataset-actions-btn">
                    <button class="btn-icon" onclick="app.deleteDataset('${dataset.id}')" title="Delete dataset">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners for checkboxes
        datasetsList.querySelectorAll('.dataset-checkbox').forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => {
                this.datasets[index].selected = checkbox.checked;
                this.saveDatasets();
                this.renderDatasets();
            });
        });
    }

    selectAllDatasets() {
        const allSelected = this.datasets.every(dataset => dataset.selected);
        this.datasets.forEach(dataset => {
            dataset.selected = !allSelected;
        });
        this.saveDatasets();
        this.renderDatasets();
    }

    deleteDataset(id) {
        if (confirm('Are you sure you want to delete this dataset?')) {
            this.datasets = this.datasets.filter(dataset => dataset.id !== id);
            this.saveDatasets();
            this.renderDatasets();
        }
    }

    async analyzeSelectedDatasets() {
        const selectedDatasets = this.datasets.filter(dataset => dataset.selected);
        
        if (selectedDatasets.length === 0) {
            alert('Please select at least one dataset to analyze.');
            return;
        }

        // Navigate to analysis page
        this.navigateToPage('analysis');

        // Reset progress bars
        this.resetProgressBars();

        // Simulate analysis process
        await this.simulateAnalysis(selectedDatasets);
    }

    resetProgressBars() {
        document.getElementById('prepProgress').style.width = '0%';
        document.getElementById('aiProgress').style.width = '0%';
        document.getElementById('parseProgress').style.width = '0%';
        
        document.getElementById('prepStatus').textContent = 'Ready';
        document.getElementById('aiStatus').textContent = 'Waiting';
        document.getElementById('parseStatus').textContent = 'Waiting';

        // Hide results sections
        document.getElementById('statsSection').style.display = 'none';
        document.getElementById('insightsSection').style.display = 'none';
        document.getElementById('recommendationsSection').style.display = 'none';
        document.getElementById('exportSection').style.display = 'none';
    }

    async simulateAnalysis(datasets) {
        // Step 1: Data Preparation
        document.getElementById('prepStatus').textContent = 'Processing...';
        await this.animateProgress('prepProgress', 100, 2000);
        document.getElementById('prepStatus').textContent = 'Complete';

        // Step 2: AI Processing
        document.getElementById('aiStatus').textContent = 'Analyzing...';
        await this.animateProgress('aiProgress', 100, 3000);
        document.getElementById('aiStatus').textContent = 'Complete';

        // Step 3: Results Parsing
        document.getElementById('parseStatus').textContent = 'Processing...';
        await this.animateProgress('parseProgress', 100, 1000);
        document.getElementById('parseStatus').textContent = 'Complete';

        // Display results
        this.displayAnalysisResults(datasets);
    }

    async animateProgress(elementId, targetWidth, duration) {
        const element = document.getElementById(elementId);
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                element.style.width = (progress * targetWidth) + '%';
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }

    displayAnalysisResults(datasets) {
        // Calculate combined stats
        const totalRecords = datasets.reduce((sum, dataset) => sum + dataset.recordCount, 0);
        const dateRange = this.getCombinedDateRange(datasets);

        // Mock analysis results
        const mockResults = {
            summaryStats: {
                dateRange: dateRange,
                totalRecords: totalRecords,
                avgGlucose: "142 mg/dL",
                timeInRange: "68%",
                timeAboveRange: "28%",
                timeBelowRange: "4%",
                totalInsulinDelivered: "487.3 units",
                avgDailyInsulin: "16.2 units/day"
            },
            aiInsights: [
                "Your time in range of 68% is approaching the recommended target of 70%. Focus on reducing post-meal glucose spikes.",
                "Most high glucose events occur between 2-4 PM. Consider adjusting your lunch bolus timing or carb counting.",
                "Your overnight glucose control is excellent with 89% time in range during sleep hours.",
                "Basal insulin appears well-tuned with minimal adjustments needed by the pump's algorithm.",
                "Consider increasing pre-bolus time for larger meals to improve post-meal glucose control."
            ],
            recommendations: [
                "Increase meal bolus by 0.5-1 units for lunches containing >45g carbs",
                "Try pre-bolusing 15-20 minutes before large meals",
                "Monitor stress levels during afternoon hours as they may contribute to glucose spikes",
                "Continue current exercise routine as it's positively impacting overnight glucose stability"
            ]
        };

        // Display summary statistics
        document.getElementById('avgGlucose').textContent = mockResults.summaryStats.avgGlucose;
        document.getElementById('timeInRange').textContent = mockResults.summaryStats.timeInRange;
        document.getElementById('totalInsulin').textContent = mockResults.summaryStats.totalInsulinDelivered;
        document.getElementById('totalRecords').textContent = totalRecords.toLocaleString();

        // Display insights
        const insightsList = document.getElementById('insightsList');
        insightsList.innerHTML = mockResults.aiInsights.map(insight => `
            <div class="insight-item">💡 ${insight}</div>
        `).join('');

        // Display recommendations
        const recommendationsList = document.getElementById('recommendationsList');
        recommendationsList.innerHTML = mockResults.recommendations.map(recommendation => `
            <div class="recommendation-item">✅ ${recommendation}</div>
        `).join('');

        // Show all sections
        document.getElementById('statsSection').style.display = 'block';
        document.getElementById('insightsSection').style.display = 'block';
        document.getElementById('recommendationsSection').style.display = 'block';
        document.getElementById('exportSection').style.display = 'block';

        this.analysisResults = mockResults;
    }

    getCombinedDateRange(datasets) {
        if (datasets.length === 1) {
            return datasets.dateRange;
        }
        return `Multiple datasets spanning ${datasets.length} files`;
    }

    navigateToPage(pageName) {
        // Update navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

        // Update pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById(pageName + 'Page').classList.add('active');

        this.currentPage = pageName;

        // Close mobile menu
        this.closeMobileMenu();
    }

    toggleMobileMenu() {
        const navContainer = document.querySelector('.nav-container');
        const overlay = document.getElementById('mobileMenuOverlay');
        const menuBtn = document.getElementById('mobileMenuBtn');

        navContainer.classList.toggle('active');
        overlay.classList.toggle('active');
        menuBtn.classList.toggle('active');
    }

    closeMobileMenu() {
        const navContainer = document.querySelector('.nav-container');
        const overlay = document.getElementById('mobileMenuOverlay');
        const menuBtn = document.getElementById('mobileMenuBtn');

        navContainer.classList.remove('active');
        overlay.classList.remove('active');
        menuBtn.classList.remove('active');
    }

    saveApiToken() {
        const token = document.getElementById('apiToken').value.trim();
        if (token) {
            this.settings.apiToken = token;
            this.saveSettings();
            alert('API token saved successfully!');
            document.getElementById('apiToken').value = '';
        } else {
            alert('Please enter a valid API token.');
        }
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.datasets = [];
            this.analysisResults = null;
            this.saveDatasets();
            this.renderDatasets();
            alert('All data has been cleared.');
        }
    }

    populateMockData() {
        if (this.datasets.length === 0) {
            // Add sample datasets for demo purposes
            const mockDatasets = [
                {
                    id: 'dataset_001',
                    name: 'tandem_export_2024_09.csv',
                    uploadDate: '2024-09-25',
                    fileSize: '2.3 MB',
                    dateRange: 'Sep 1-30, 2024',
                    recordCount: 8640,
                    selected: false
                },
                {
                    id: 'dataset_002',
                    name: 'tandem_export_2024_08.zip',
                    uploadDate: '2024-09-20',
                    fileSize: '1.8 MB',
                    dateRange: 'Aug 1-31, 2024',
                    recordCount: 8928,
                    selected: false
                }
            ];

            this.datasets = mockDatasets;
            this.saveDatasets();
            this.renderDatasets();
        }
    }

    // Storage methods
    loadSettings() {
        try {
            const stored = localStorage.getItem('tandem_analyzer_settings');
            if (stored) {
                this.settings = { ...this.settings, ...JSON.parse(stored) };
            }
            
            // Apply settings to UI
            document.getElementById('apiToken').placeholder = this.settings.apiToken ? 'Token saved' : 'Enter your API token';
            document.querySelector(`input[name="storageType"][value="${this.settings.storageType}"]`).checked = true;
            document.getElementById('enableNotifications').checked = this.settings.enableNotifications;
            document.getElementById('autoAnalysis').checked = this.settings.autoAnalysis;
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('tandem_analyzer_settings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    loadDatasets() {
        try {
            const storageKey = this.settings.storageType === 'persistent' ? 
                'tandem_analyzer_datasets' : 'tandem_analyzer_datasets_session';
            
            const storage = this.settings.storageType === 'persistent' ? 
                localStorage : sessionStorage;
            
            const stored = storage.getItem(storageKey);
            if (stored) {
                this.datasets = JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Failed to load datasets:', error);
        }
    }

    saveDatasets() {
        try {
            const storageKey = this.settings.storageType === 'persistent' ? 
                'tandem_analyzer_datasets' : 'tandem_analyzer_datasets_session';
            
            const storage = this.settings.storageType === 'persistent' ? 
                localStorage : sessionStorage;
            
            storage.setItem(storageKey, JSON.stringify(this.datasets));
        } catch (error) {
            console.warn('Failed to save datasets:', error);
        }
    }
}

// Initialize the application
const app = new TandemAnalyzer();

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Handle offline/online status
window.addEventListener('online', () => {
    console.log('Application is online');
});

window.addEventListener('offline', () => {
    console.log('Application is offline');
});
