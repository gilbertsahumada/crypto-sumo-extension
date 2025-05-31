"use strict";
// Popup script for Crypto Sumo Extension
console.log('💰 Crypto Sumo Extension - Popup loaded');
class CryptoSumoPopup {
    constructor() {
        this.isActive = false;
        this.settings = {
            refreshInterval: 30000,
            notifications: true
        };
        this.init();
    }
    async init() {
        // Load settings from storage
        await this.loadSettings();
        // Setup event listeners
        this.setupEventListeners();
        // Update UI
        this.updateUI();
    }
    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['settings'], (result) => {
                if (result.settings) {
                    this.settings = result.settings;
                }
                resolve();
            });
        });
    }
    setupEventListeners() {
        // Toggle extension button
        const toggleBtn = document.getElementById('toggleBtn');
        toggleBtn?.addEventListener('click', () => this.toggleExtension());
        // Scan page button
        const scanBtn = document.getElementById('scanBtn');
        scanBtn?.addEventListener('click', () => this.scanCurrentPage());
        // Settings toggle
        const notificationsToggle = document.getElementById('notifications');
        notificationsToggle?.addEventListener('change', (e) => {
            this.settings.notifications = e.target.checked;
            this.saveSettings();
        });
        // Refresh interval
        const refreshInterval = document.getElementById('refreshInterval');
        refreshInterval?.addEventListener('change', (e) => {
            this.settings.refreshInterval = parseInt(e.target.value);
            this.saveSettings();
        });
    }
    async toggleExtension() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'toggleExtension'
            });
            if (response.success) {
                this.isActive = response.active;
                this.updateUI();
            }
        }
        catch (error) {
            console.error('Error toggling extension:', error);
            this.showStatus('Error: Could not toggle extension', 'error');
        }
    }
    async scanCurrentPage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, {
                action: 'scanPage'
            });
            if (response.success) {
                this.showStatus(`Found ${response.elements} crypto elements`, 'success');
            }
        }
        catch (error) {
            console.error('Error scanning page:', error);
            this.showStatus('Error: Could not scan page', 'error');
        }
    }
    async saveSettings() {
        chrome.storage.sync.set({ settings: this.settings }, () => {
            this.showStatus('Settings saved', 'success');
        });
    }
    updateUI() {
        const toggleBtn = document.getElementById('toggleBtn');
        const statusEl = document.getElementById('status');
        const notificationsToggle = document.getElementById('notifications');
        const refreshInterval = document.getElementById('refreshInterval');
        if (toggleBtn) {
            toggleBtn.textContent = this.isActive ? 'Deactivate' : 'Activate';
            toggleBtn.className = this.isActive ? 'btn btn-danger' : 'btn btn-primary';
        }
        if (statusEl) {
            statusEl.textContent = this.isActive ? 'Active' : 'Inactive';
            statusEl.className = this.isActive ? 'status active' : 'status inactive';
        }
        if (notificationsToggle) {
            notificationsToggle.checked = this.settings.notifications;
        }
        if (refreshInterval) {
            refreshInterval.value = this.settings.refreshInterval.toString();
        }
    }
    showStatus(message, type) {
        const statusMsg = document.getElementById('statusMessage');
        if (statusMsg) {
            statusMsg.textContent = message;
            statusMsg.className = `status-message ${type}`;
            // Hide after 3 seconds
            setTimeout(() => {
                statusMsg.textContent = '';
                statusMsg.className = 'status-message';
            }, 3000);
        }
    }
}
// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CryptoSumoPopup();
});
