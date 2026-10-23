/**
 * LayerMark Tag Renderer
 * Renders active environment badges into the isolated Shadow Root.
 */

import { LayerMarkTag, LayerMarkSettings } from '../shared/types';
import { ShadowHostManager } from './shadow-host';

// Common SVG icons mapped by name
const ICON_SVGS: Record<string, string> = {
  ShieldAlert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  Server: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`,
  Code: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  Laptop: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>`,
  Bug: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 3.8-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/></svg>`,
  Globe: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
  Database: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
};

/**
 * Resolves the target anchor zone key for a tag based on its shape and corner.
 */
export function resolveAnchorZone(tag: LayerMarkTag): string {
  const shape = tag.style.shape || (tag.style.anchorPosition?.startsWith('ribbon') ? 'ribbon' : tag.style.anchorPosition?.includes('banner') ? 'banner' : 'badge');
  const corner = tag.style.corner || (tag.style.anchorPosition?.includes('left') ? 'top-left' : 'top-right');

  if (shape === 'ribbon') {
    return `ribbon-${corner}`;
  }
  if (shape === 'banner') {
    return corner.includes('bottom') ? 'bottom-banner' : 'top-banner';
  }
  return corner;
}

/**
 * Creates the badge DOM element.
 */
function createBadgeElement(tag: LayerMarkTag, settings: LayerMarkSettings): HTMLElement {
  const badge = document.createElement('div');
  const style = tag.style;
  const shape = style.shape || (style.anchorPosition?.startsWith('ribbon') ? 'ribbon' : style.anchorPosition?.includes('banner') ? 'banner' : 'badge');
  const corner = style.corner || (style.anchorPosition?.includes('left') ? 'top-left' : 'top-right');

  badge.className = `lm-badge lm-badge-${style.size || 'medium'}`;

  // Handle ribbon, banner and badge-pill classes
  if (shape === 'ribbon') {
    badge.classList.add(`lm-ribbon-${corner}`);
  } else if (shape === 'banner') {
    badge.classList.add('lm-banner');
  } else {
    badge.classList.add('lm-badge-pill');
  }

  // Slide & Fade on Hover: Allows instant clicking on website elements directly underneath
  if (settings.collapseOnHover) {
    badge.classList.add('lm-badge-collapse-hover');

    let isTucked = false;
    let savedRect: DOMRect | null = null;

    const onMouseMove = (e: MouseEvent) => {
      if (!isTucked || !savedRect) return;
      if (!badge.isConnected) {
        window.removeEventListener('mousemove', onMouseMove);
        return;
      }

      const buffer = 15;
      const isInside =
        e.clientX >= savedRect.left - buffer &&
        e.clientX <= savedRect.right + buffer &&
        e.clientY >= savedRect.top - buffer &&
        e.clientY <= savedRect.bottom + buffer;

      const isOutsideWindow =
        e.clientX < 0 ||
        e.clientY < 0 ||
        e.clientX > window.innerWidth ||
        e.clientY > window.innerHeight;

      if (!isInside || isOutsideWindow) {
        isTucked = false;
        badge.classList.remove('lm-badge-tucked');
        window.removeEventListener('mousemove', onMouseMove);
      }
    };

    badge.addEventListener('mouseenter', () => {
      if (isTucked) return;
      savedRect = badge.getBoundingClientRect();
      if (savedRect.width === 0 && savedRect.height === 0) return;

      isTucked = true;
      badge.classList.add('lm-badge-tucked');
      window.addEventListener('mousemove', onMouseMove);
    });
  }

  // Apply visual styling
  badge.style.backgroundColor = style.bgColor;
  badge.style.color = style.textColor;
  badge.style.opacity = String(style.opacity ?? 0.95);

  if (style.borderColor && style.borderWidth) {
    badge.style.border = `${style.borderWidth}px solid ${style.borderColor}`;
  } else {
    badge.style.border = 'none';
  }

  if (style.borderRadius !== undefined && shape !== 'ribbon') {
    badge.style.borderRadius = `${style.borderRadius}px`;
  }

  if (style.fontSize) {
    badge.style.fontSize = `${style.fontSize}px`;
  }

  // Hover title
  badge.title = `${tag.name}${tag.project ? ` [${tag.project}]` : ''}${tag.description ? ` - ${tag.description}` : ''}`;

  // Build inner contents: pulse dot, icon, name
  let innerHtml = '';

  if (style.pulseAnimation) {
    innerHtml += `<span class="lm-pulse-dot" style="background-color: ${style.textColor};"></span>`;
  }

  if (style.icon) {
    if (ICON_SVGS[style.icon]) {
      innerHtml += `<span class="lm-icon" style="display:flex;align-items:center;">${ICON_SVGS[style.icon]}</span>`;
    } else {
      innerHtml += `<span class="lm-icon">${style.icon}</span>`;
    }
  }

  innerHtml += `<span class="lm-text">${tag.name}</span>`;
  badge.innerHTML = innerHtml;

  return badge;
}

/**
 * Main render function called whenever active matching tags change.
 */
export function renderActiveTags(
  hostManager: ShadowHostManager,
  matchingTags: LayerMarkTag[],
  settings: LayerMarkSettings
): void {
  // Clear any existing badges
  hostManager.clearAllZones();

  if (!settings.enableGlobalToggle || matchingTags.length === 0) {
    return;
  }

  // Group tags by resolved anchor zone
  const tagsByZone = new Map<string, LayerMarkTag[]>();

  for (const tag of matchingTags) {
    const zoneKey = resolveAnchorZone(tag);
    if (!tagsByZone.has(zoneKey)) {
      tagsByZone.set(zoneKey, []);
    }
    tagsByZone.get(zoneKey)!.push(tag);
  }

  // Render each zone's group
  for (const [zoneKey, tags] of tagsByZone.entries()) {
    const zone = hostManager.getAnchorZone(zoneKey);

    for (const tag of tags) {
      const badge = createBadgeElement(tag, settings);
      zone.appendChild(badge);
    }
  }
}
