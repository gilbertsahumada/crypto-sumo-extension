// Background script for Crypto Sumo Extension
console.log('🚀 Crypto Sumo Extension - Background script loaded');

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // Set default storage values
    chrome.storage.sync.set({
      cryptoData: {},
      settings: {
        refreshInterval: 30000, // 30 seconds
        notifications: true
      }
    });
  }
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  switch (request.action) {
    case 'getCryptoData':
      // Handle crypto data request
      sendResponse({ success: true, data: 'crypto data here' });
      break;
    
    case 'updateSettings':
      chrome.storage.sync.set({ settings: request.settings }, () => {
        sendResponse({ success: true });
      });
      break;
    
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true; // Keep message channel open for async response
});