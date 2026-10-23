/**
 * LayerMark Content Script Entrypoint
 * Controls overlay lifecycle, URL matching, and real-time reactive re-rendering.
 */

import { setupShadowHost, ShadowHostManager } from './shadow-host';
import { renderActiveTags } from './tag-renderer';
import { getTags, getSettings, subscribeToStorageChanges } from '../shared/storage';
import { getMatchingTags } from '../shared/matcher';

let hostManager: ShadowHostManager | null = null;
let lastEvaluatedUrl = '';

async function updateOverlay(force = false) {
  const currentUrl = window.location.href;
  if (!force && currentUrl === lastEvaluatedUrl) {
    return;
  }
  lastEvaluatedUrl = currentUrl;

  try {
    if (!hostManager) {
      hostManager = setupShadowHost();
    }

    const [tags, settings] = await Promise.all([getTags(), getSettings()]);
    const matched = getMatchingTags(currentUrl, tags);

    renderActiveTags(hostManager, matched, settings);
  } catch (err) {
    console.error('[LayerMark Content Script] Failed to update overlay:', err);
  }
}

function initContentScript() {
  // Initial render
  updateOverlay(true);

  // Subscribe to storage changes (instant sync across tabs when user edits in popup or options)
  subscribeToStorageChanges(() => {
    updateOverlay(true);
  });

  // Track SPA history changes (pushState / replaceState / popstate)
  window.addEventListener('popstate', () => updateOverlay(true));

  // Hook history pushState
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    setTimeout(() => updateOverlay(true), 10);
  };

  // Hook history replaceState
  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    setTimeout(() => updateOverlay(true), 10);
  };

  // Background service worker message listener
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((message) => {
      if (message?.type === 'LAYERMARK_URL_CHANGED') {
        updateOverlay(true);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}

export {};
