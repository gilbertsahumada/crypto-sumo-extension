// Content script for Crypto Sumo Extension
console.log('🎯 Crypto Sumo Extension - Content script loaded');

// Interface for crypto data
interface CryptoData {
  symbol: string;
  price: number;
  change24h: number;
}

// Main content script class
class CryptoSumoContent {
  private isActive: boolean = false;
  private cryptoElements: HTMLElement[] = [];

  constructor() {
    this.init();
  }

  private init(): void {
    // Listen for messages from popup or background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'toggleExtension':
          this.toggle();
          sendResponse({ success: true, active: this.isActive });
          break;
        
        case 'scanPage':
          this.scanForCryptoData();
          sendResponse({ success: true, elements: this.cryptoElements.length });
          break;
      }
      return true;
    });

    // Auto-scan when page loads
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.scanForCryptoData());
    } else {
      this.scanForCryptoData();
    }
  }

  private toggle(): void {
    this.isActive = !this.isActive;
    console.log(`Extension ${this.isActive ? 'activated' : 'deactivated'}`);
    
    if (this.isActive) {
      this.highlightCryptoElements();
    } else {
      this.removeHighlights();
    }
  }

  private scanForCryptoData(): void {
    // Common crypto symbols to look for
    const cryptoSymbols = ['BTC', 'ETH', 'ADA', 'DOT', 'SOL', 'MATIC', 'LINK', 'UNI'];
    const cryptoRegex = new RegExp(`\\b(${cryptoSymbols.join('|')})\\b`, 'gi');
    
    // Find text nodes containing crypto symbols
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );

    this.cryptoElements = [];
    let node;
    
    while (node = walker.nextNode()) {
      if (node.textContent && cryptoRegex.test(node.textContent)) {
        const parent = node.parentElement;
        if (parent && !this.cryptoElements.includes(parent)) {
          this.cryptoElements.push(parent);
        }
      }
    }

    console.log(`Found ${this.cryptoElements.length} crypto-related elements`);
  }

  private highlightCryptoElements(): void {
    this.cryptoElements.forEach(element => {
      element.style.backgroundColor = '#ffeb3b';
      element.style.border = '2px solid #ff9800';
      element.style.borderRadius = '4px';
      element.classList.add('crypto-sumo-highlight');
    });
  }

  private removeHighlights(): void {
    this.cryptoElements.forEach(element => {
      element.style.backgroundColor = '';
      element.style.border = '';
      element.style.borderRadius = '';
      element.classList.remove('crypto-sumo-highlight');
    });
  }
}

// Initialize the content script
new CryptoSumoContent();