/**
 * LayerMark Background Service Worker (Manifest V3)
 * Manages extension events, tab updates, badge counter, and storage synchronization.
 */

// Listen for tab updates (including SPA history / URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
      // In Phase 2: Query matching tags for tab.url and update action badge text
      chrome.action.setBadgeText({
        tabId: tabId,
        text: ''
      });
    }
  }
});

// Extension install / update listener
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[LayerMark] Extension installed successfully. Initializing default configuration...');
  }
});

export {};
