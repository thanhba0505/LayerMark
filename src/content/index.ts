/**
 * LayerMark Content Script Entrypoint
 * Injects Shadow DOM container and coordinates live tag rendering on matched URLs.
 */

const HOST_ELEMENT_ID = 'layermark-root-container';

function initLayerMark() {
  if (document.getElementById(HOST_ELEMENT_ID)) {
    return;
  }

  // Create isolated host element
  const host = document.createElement('div');
  host.id = HOST_ELEMENT_ID;
  host.style.position = 'fixed';
  host.style.zIndex = '2147483647';
  host.style.top = '0';
  host.style.left = '0';
  host.style.width = '100vw';
  host.style.height = '100vh';
  host.style.pointerEvents = 'none';

  // Attach Shadow DOM for 100% CSS isolation
  const shadowRoot = host.attachShadow({ mode: 'open' });

  // Add initial container inside shadow DOM
  const container = document.createElement('div');
  container.className = 'layermark-viewport-container';
  shadowRoot.appendChild(container);

  document.documentElement.appendChild(host);
  console.log('[LayerMark] Injected isolated overlay into host page.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLayerMark);
} else {
  initLayerMark();
}

export {};
