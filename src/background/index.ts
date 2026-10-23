/**
 * LayerMark Background Service Worker (Manifest V3)
 * Manages extension events, active tab badge counters, and tab URL change notifications.
 */

import { getTags, getSettings } from '../shared/storage';
import { getMatchingTags } from '../shared/matcher';

async function updateTabBadge(tabId: number, url?: string) {
  if (!url || url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('chrome-extension://')) {
    chrome.action.setBadgeText({ tabId, text: '' });
    return;
  }

  try {
    const [tags, settings] = await Promise.all([getTags(), getSettings()]);
    if (!settings.enableGlobalToggle || !settings.showBadgeCounter) {
      chrome.action.setBadgeText({ tabId, text: '' });
      return;
    }

    const matched = getMatchingTags(url, tags);
    if (matched.length > 0) {
      chrome.action.setBadgeText({ tabId, text: String(matched.length) });
      chrome.action.setBadgeBackgroundColor({ tabId, color: '#4F46E5' });
    } else {
      chrome.action.setBadgeText({ tabId, text: '' });
    }
  } catch (err) {
    console.warn('[LayerMark SW] Badge update failed:', err);
  }
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    const targetUrl = changeInfo.url || tab.url;
    if (targetUrl) {
      updateTabBadge(tabId, targetUrl);
      // Notify content script of URL change
      chrome.tabs.sendMessage(tabId, { type: 'LAYERMARK_URL_CHANGED' }).catch(() => {
        // Tab might not have content script yet or is restricted
      });
    }
  }
});

// Update badge when user activates/switches tab
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab?.url) {
      updateTabBadge(activeInfo.tabId, tab.url);
    }
  } catch {
    // Tab might be closing
  }
});

// Extension install / update listener
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[LayerMark] Initialized successfully.');
  }
});

export {};
