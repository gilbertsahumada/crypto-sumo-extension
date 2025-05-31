// Popup script for Crypto Sumo Extension
console.log('💰 Crypto Sumo Extension - Popup loaded');

interface Settings {
  refreshInterval: number;
  notifications: boolean;
}

class CryptoSumoPopup {
  private isActive: boolean = false;
  private settings: Settings = {
    refreshInterval: 30000,
    notifications: true
  };

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    // Load settings from storage
    await this.loadSettings();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Update UI
    this.updateUI();
  }

  private async loadSettings(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['settings'], (result) => {
        if (result.settings) {
          this.settings = result.settings;
        }
        resolve();
      });
    });
  }

  private setupEventListeners(): void {
    // Toggle extension button
    const toggleBtn = document.getElementById('toggleBtn') as HTMLButtonElement;
    toggleBtn?.addEventListener('click', () => this.toggleExtension());

    // Scan page button
    const scanBtn = document.getElementById('scanBtn') as HTMLButtonElement;
    scanBtn?.addEventListener('click', () => this.scanCurrentPage());

    // Settings toggle
    const notificationsToggle = document.getElementById('notifications') as HTMLInputElement;
    notificationsToggle?.addEventListener('change', (e) => {
      this.settings.notifications = (e.target as HTMLInputElement).checked;
      this.saveSettings();
    });

    // Refresh interval
    const refreshInterval = document.getElementById('refreshInterval') as HTMLSelectElement;
    refreshInterval?.addEventListener('change', (e) => {
      this.settings.refreshInterval = parseInt((e.target as HTMLSelectElement).value);
      this.saveSettings();
    });
  }

  private async toggleExtension(): Promise<void> {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id!, {
        action: 'toggleExtension'
      });

      if (response.success) {
        this.isActive = response.active;
        this.updateUI();
      }
    } catch (error) {
      console.error('Error toggling extension:', error);
      this.showStatus('Error: Could not toggle extension', 'error');
    }
  }

  private async scanCurrentPage(): Promise<void> {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      const response = await chrome.tabs.sendMessage(tab.id!, {
        action: 'scanPage'
      });

      if (response.success) {
        this.showStatus(`Found ${response.elements} crypto elements`, 'success');
      }
    } catch (error) {
      console.error('Error scanning page:', error);
      this.showStatus('Error: Could not scan page', 'error');
    }
  }

  private async saveSettings(): Promise<void> {
    chrome.storage.sync.set({ settings: this.settings }, () => {
      this.showStatus('Settings saved', 'success');
    });
  }

  private updateUI(): void {
    const toggleBtn = document.getElementById('toggleBtn') as HTMLButtonElement;
    const statusEl = document.getElementById('status') as HTMLElement;
    const notificationsToggle = document.getElementById('notifications') as HTMLInputElement;
    const refreshInterval = document.getElementById('refreshInterval') as HTMLSelectElement;

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

  private showStatus(message: string, type: 'success' | 'error'): void {
    const statusMsg = document.getElementById('statusMessage') as HTMLElement;
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