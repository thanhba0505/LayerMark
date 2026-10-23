/**
 * LayerMark Shadow Host Manager
 * Manages the isolated host container and Shadow Root lifecycle on host web pages.
 */

const HOST_ELEMENT_ID = 'layermark-root-container';

export interface ShadowHostManager {
  host: HTMLElement;
  shadowRoot: ShadowRoot;
  getAnchorZone(position: string): HTMLElement;
  clearAllZones(): void;
}

const SCOPED_STYLES = `
:host {
  all: initial;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;
}

.lm-zone {
  position: absolute;
  pointer-events: none;
  display: flex;
  gap: 8px;
  z-index: 2147483647;
}

/* 4 Standard Corner Badge Zones */
.lm-zone-top-left {
  top: 12px;
  left: 12px;
  flex-direction: column;
  align-items: flex-start;
}

.lm-zone-top-right {
  top: 12px;
  right: 12px;
  flex-direction: column;
  align-items: flex-end;
}

.lm-zone-bottom-left {
  bottom: 12px;
  left: 12px;
  flex-direction: column-reverse;
  align-items: flex-start;
}

.lm-zone-bottom-right {
  bottom: 12px;
  right: 12px;
  flex-direction: column-reverse;
  align-items: flex-end;
}

.lm-zone-top-center {
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
  align-items: center;
}

.lm-zone-bottom-center {
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column-reverse;
  align-items: center;
}

/* Full Width Banners */
.lm-zone-top-banner {
  top: 0;
  left: 0;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

.lm-zone-bottom-banner {
  bottom: 0;
  left: 0;
  width: 100%;
  flex-direction: column;
  align-items: center;
}

/* 4 Diagonal Ribbon Corner Zones */
.lm-zone-ribbon-top-right {
  top: 0;
  right: 0;
  width: 140px;
  height: 140px;
  overflow: hidden;
}

.lm-zone-ribbon-top-left {
  top: 0;
  left: 0;
  width: 140px;
  height: 140px;
  overflow: hidden;
}

.lm-zone-ribbon-bottom-right {
  bottom: 0;
  right: 0;
  width: 140px;
  height: 140px;
  overflow: hidden;
}

.lm-zone-ribbon-bottom-left {
  bottom: 0;
  left: 0;
  width: 140px;
  height: 140px;
  overflow: hidden;
}

/* Badge Base */
.lm-badge {
  pointer-events: auto;
  user-select: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.15);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  line-height: 1;
}

/* Hover Dim / Minimize Effect */
.lm-badge-collapse-hover:hover {
  opacity: 0.2 !important;
  transform: scale(0.92);
}

/* Badge Sizes */
.lm-badge-small {
  padding: 3px 8px;
  font-size: 10px;
}

.lm-badge-medium {
  padding: 5px 12px;
  font-size: 11px;
}

.lm-badge-large {
  padding: 8px 16px;
  font-size: 13px;
}

/* Pulse Animation */
@keyframes lm-pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(255, 255, 255, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
}

.lm-pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #ffffff;
  display: inline-block;
  animation: lm-pulse 1.8s infinite;
}

/* Banner Styles */
.lm-banner {
  width: 100%;
  text-align: center;
  padding: 6px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  justify-content: center;
}

/* 4 Diagonal Ribbon Styles */
.lm-ribbon-top-right, .lm-ribbon-right {
  position: absolute;
  top: 25px;
  right: -40px;
  width: 160px;
  transform: rotate(45deg);
  text-align: center;
  padding: 6px 0;
  justify-content: center;
}

.lm-ribbon-top-left, .lm-ribbon-left {
  position: absolute;
  top: 25px;
  left: -40px;
  width: 160px;
  transform: rotate(-45deg);
  text-align: center;
  padding: 6px 0;
  justify-content: center;
}

.lm-ribbon-bottom-right {
  position: absolute;
  bottom: 25px;
  right: -40px;
  width: 160px;
  transform: rotate(-45deg);
  text-align: center;
  padding: 6px 0;
  justify-content: center;
}

.lm-ribbon-bottom-left {
  position: absolute;
  bottom: 25px;
  left: -40px;
  width: 160px;
  transform: rotate(45deg);
  text-align: center;
  padding: 6px 0;
  justify-content: center;
}
`;

export function setupShadowHost(): ShadowHostManager {
  let host = document.getElementById(HOST_ELEMENT_ID);
  let shadowRoot: ShadowRoot;

  if (host && host.shadowRoot) {
    shadowRoot = host.shadowRoot;
  } else {
    if (host) host.remove();

    host = document.createElement('div');
    host.id = HOST_ELEMENT_ID;
    shadowRoot = host.attachShadow({ mode: 'open' });

    // Inject styles
    const styleEl = document.createElement('style');
    styleEl.textContent = SCOPED_STYLES;
    shadowRoot.appendChild(styleEl);

    if (document.body) {
      document.body.appendChild(host);
    } else {
      document.documentElement.appendChild(host);
    }
  }

  const zoneCache = new Map<string, HTMLElement>();

  function getAnchorZone(position: string): HTMLElement {
    if (zoneCache.has(position)) {
      const cached = zoneCache.get(position)!;
      if (shadowRoot.contains(cached)) return cached;
    }

    const zoneClass = `lm-zone-${position}`;
    let zoneEl = shadowRoot.querySelector(`.${zoneClass}`) as HTMLElement;
    if (!zoneEl) {
      zoneEl = document.createElement('div');
      zoneEl.className = `lm-zone ${zoneClass}`;
      shadowRoot.appendChild(zoneEl);
    }

    zoneCache.set(position, zoneEl);
    return zoneEl;
  }

  function clearAllZones(): void {
    const zones = shadowRoot.querySelectorAll('.lm-zone');
    zones.forEach((zone) => (zone.innerHTML = ''));
  }

  return {
    host,
    shadowRoot,
    getAnchorZone,
    clearAllZones,
  };
}
