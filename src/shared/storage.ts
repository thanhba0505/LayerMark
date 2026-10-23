/**
 * LayerMark Type-Safe Storage Manager
 * Encapsulates chrome.storage.local with browser localStorage fallback and reactive subscriptions.
 */

import { 
  LayerMarkTag, 
  LayerMarkSettings, 
  LayerMarkExportData 
} from './types';
import { DEFAULT_SETTINGS, getDefaultPresets } from './presets';

const STORAGE_KEY_TAGS = 'layermark_tags';
const STORAGE_KEY_SETTINGS = 'layermark_settings';
const STORAGE_VERSION = '1.0.0';

// In-memory store fallback for Node / SSR / Test runner environments
const memoryFallbackStore = new Map<string, string>();

/**
 * Checks if the Chrome extension storage API is available.
 */
function isChromeStorageAvailable(): boolean {
  return typeof chrome !== 'undefined' && Boolean(chrome?.storage?.local);
}

/**
 * Retrieves raw data from chrome.storage.local, window.localStorage, or memory fallback.
 */
async function getStorageItem<T>(key: string, defaultValue: T): Promise<T> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        if (result && result[key] !== undefined) {
          resolve(result[key]);
        } else {
          resolve(defaultValue);
        }
      });
    });
  }

  // Fallback for browser preview / tests
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    } else if (memoryFallbackStore.has(key)) {
      return JSON.parse(memoryFallbackStore.get(key)!) as T;
    }
  } catch (err) {
    console.warn('[LayerMark Storage] Fallback read failed:', err);
  }

  return defaultValue;
}

/**
 * Sets raw data into chrome.storage.local, window.localStorage, or memory fallback.
 */
async function setStorageItem<T>(key: string, value: T): Promise<void> {
  if (isChromeStorageAvailable()) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  // Fallback for browser preview / tests
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event('storage'));
    } else {
      memoryFallbackStore.set(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn('[LayerMark Storage] Fallback write failed:', err);
  }
}

/**
 * Generates unique ID.
 */
export function generateId(prefix = 'tag'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Gets all saved tags. If none exist, initializes with default presets.
 */
export async function getTags(): Promise<LayerMarkTag[]> {
  const tags = await getStorageItem<LayerMarkTag[] | null>(STORAGE_KEY_TAGS, null);
  if (!tags || !Array.isArray(tags)) {
    const defaultPresets = getDefaultPresets();
    await setStorageItem(STORAGE_KEY_TAGS, defaultPresets);
    return defaultPresets;
  }
  return tags;
}

/**
 * Saves full tags array to storage.
 */
export async function saveTags(tags: LayerMarkTag[]): Promise<void> {
  await setStorageItem(STORAGE_KEY_TAGS, tags);
}

/**
 * Gets global settings.
 */
export async function getSettings(): Promise<LayerMarkSettings> {
  const settings = await getStorageItem<LayerMarkSettings | null>(STORAGE_KEY_SETTINGS, null);
  if (!settings) {
    await setStorageItem(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }
  return { ...DEFAULT_SETTINGS, ...settings };
}

/**
 * Updates global settings partially.
 */
export async function updateSettings(updates: Partial<LayerMarkSettings>): Promise<LayerMarkSettings> {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  await setStorageItem(STORAGE_KEY_SETTINGS, updated);
  return updated;
}

/**
 * Adds a new tag.
 */
export async function addTag(tagData: Omit<LayerMarkTag, 'id' | 'createdAt' | 'updatedAt'>): Promise<LayerMarkTag> {
  const tags = await getTags();
  const now = Date.now();
  const newTag: LayerMarkTag = {
    ...tagData,
    id: generateId('tag'),
    createdAt: now,
    updatedAt: now,
  };

  tags.push(newTag);
  await saveTags(tags);
  return newTag;
}

/**
 * Updates an existing tag by ID.
 */
export async function updateTag(id: string, updates: Partial<LayerMarkTag>): Promise<LayerMarkTag> {
  const tags = await getTags();
  const index = tags.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Tag with ID "${id}" not found.`);
  }

  const updatedTag: LayerMarkTag = {
    ...tags[index],
    ...updates,
    updatedAt: Date.now(),
  };

  tags[index] = updatedTag;
  await saveTags(tags);
  return updatedTag;
}

/**
 * Deletes a tag by ID.
 */
export async function deleteTag(id: string): Promise<void> {
  const tags = await getTags();
  const filtered = tags.filter((t) => t.id !== id);
  await saveTags(filtered);
}

/**
 * Duplicates a tag by ID.
 */
export async function duplicateTag(id: string): Promise<LayerMarkTag> {
  const tags = await getTags();
  const source = tags.find((t) => t.id === id);
  if (!source) {
    throw new Error(`Tag with ID "${id}" not found.`);
  }

  const now = Date.now();
  const cloned: LayerMarkTag = {
    ...JSON.parse(JSON.stringify(source)),
    id: generateId('tag'),
    name: `${source.name} (Copy)`,
    priority: source.priority + 1,
    createdAt: now,
    updatedAt: now,
  };

  tags.push(cloned);
  await saveTags(tags);
  return cloned;
}

/**
 * Toggles tag enabled state.
 */
export async function toggleTag(id: string, enabled?: boolean): Promise<boolean> {
  const tags = await getTags();
  const target = tags.find((t) => t.id === id);
  if (!target) {
    throw new Error(`Tag with ID "${id}" not found.`);
  }

  const newStatus = enabled !== undefined ? enabled : !target.enabled;
  target.enabled = newStatus;
  target.updatedAt = Date.now();

  await saveTags(tags);
  return newStatus;
}

/**
 * Reorders tags by list of IDs (updating priority ascending).
 */
export async function reorderTags(orderedIds: string[]): Promise<LayerMarkTag[]> {
  const tags = await getTags();
  const idMap = new Map<string, number>();
  orderedIds.forEach((id, index) => idMap.set(id, index));

  const reordered = tags.map((tag) => {
    if (idMap.has(tag.id)) {
      return { ...tag, priority: idMap.get(tag.id)!, updatedAt: Date.now() };
    }
    return tag;
  });

  reordered.sort((a, b) => a.priority - b.priority);
  await saveTags(reordered);
  return reordered;
}

/**
 * Resets storage to default presets.
 */
export async function resetToDefaults(): Promise<void> {
  const presets = getDefaultPresets();
  await setStorageItem(STORAGE_KEY_TAGS, presets);
  await setStorageItem(STORAGE_KEY_SETTINGS, DEFAULT_SETTINGS);
}

/**
 * Exports all configuration to structured JSON object.
 */
export async function exportData(): Promise<LayerMarkExportData> {
  const tags = await getTags();
  const settings = await getSettings();

  return {
    app: 'LayerMark',
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    tags,
    settings,
  };
}

/**
 * Imports JSON data with validation and sanitization.
 */
export async function importData(
  jsonString: string,
  mode: 'overwrite' | 'merge' = 'merge'
): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const parsed = JSON.parse(jsonString);

    if (parsed.app !== 'LayerMark' || !Array.isArray(parsed.tags)) {
      return { success: false, count: 0, error: 'Invalid LayerMark format.' };
    }

    const incomingTags = parsed.tags as LayerMarkTag[];
    const now = Date.now();

    if (mode === 'overwrite') {
      await saveTags(incomingTags);
      if (parsed.settings) {
        await updateSettings(parsed.settings);
      }
      return { success: true, count: incomingTags.length };
    } else {
      // Merge mode
      const currentTags = await getTags();
      const existingIds = new Set(currentTags.map((t) => t.id));

      const sanitizedIncoming = incomingTags.map((tag) => {
        if (existingIds.has(tag.id)) {
          return {
            ...tag,
            id: generateId('tag'),
            name: `${tag.name} (Imported)`,
            updatedAt: now,
          };
        }
        return tag;
      });

      const merged = [...currentTags, ...sanitizedIncoming];
      await saveTags(merged);
      return { success: true, count: sanitizedIncoming.length };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown JSON parse error.';
    return { success: false, count: 0, error: message };
  }
}

/**
 * Subscribes to storage changes across all tabs/windows.
 */
export function subscribeToStorageChanges(
  callback: (tags: LayerMarkTag[], settings: LayerMarkSettings) => void
): () => void {
  if (isChromeStorageAvailable()) {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'local') {
        if (changes[STORAGE_KEY_TAGS] || changes[STORAGE_KEY_SETTINGS]) {
          Promise.all([getTags(), getSettings()]).then(([tags, settings]) => {
            callback(tags, settings);
          });
        }
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }

  // Fallback storage listener for non-extension environments
  const fallbackListener = () => {
    Promise.all([getTags(), getSettings()]).then(([tags, settings]) => {
      callback(tags, settings);
    });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', fallbackListener);
    return () => {
      window.removeEventListener('storage', fallbackListener);
    };
  }

  return () => {};
}
