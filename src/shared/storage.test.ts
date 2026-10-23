import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getTags, 
  addTag, 
  updateTag, 
  deleteTag, 
  duplicateTag, 
  toggleTag, 
  reorderTags,
  getSettings,
  updateSettings,
  exportData,
  importData,
  resetToDefaults
} from './storage';

describe('LayerMark Storage Manager', () => {
  beforeEach(async () => {
    // Reset defaults before each test
    await resetToDefaults();
  });

  it('loads default presets when initialized', async () => {
    const tags = await getTags();
    expect(tags.length).toBeGreaterThanOrEqual(4);
    const prodTag = tags.find((t) => t.environment === 'production');
    expect(prodTag).toBeDefined();
    expect(prodTag?.name).toBe('PRODUCTION');

    const uatTag = tags.find((t) => t.name === 'UAT');
    expect(uatTag).toBeDefined();
    expect(uatTag?.rules.some((r) => r.pattern === '*.uat.*')).toBe(true);

    const stagingTag = tags.find((t) => t.name === 'STAGING');
    expect(stagingTag?.rules.some((r) => r.pattern === '*.stg.*')).toBe(true);

    const localTag = tags.find((t) => t.name === 'LOCAL DEV');
    expect(localTag?.rules.some((r) => r.pattern === 'localhost:*')).toBe(true);
  });

  it('adds and retrieves a new tag', async () => {
    const newTag = await addTag({
      name: 'CUSTOM QA',
      enabled: true,
      priority: 99,
      environment: 'testing',
      style: {
        bgColor: '#8B5CF6',
        textColor: '#FFFFFF',
        size: 'small',
        anchorPosition: 'bottom-right',
      },
      rules: [
        { id: 'r_qa', type: 'wildcard-domain', pattern: '*.qa.company.com', enabled: true },
      ],
    });

    expect(newTag.id).toBeDefined();
    const tags = await getTags();
    const found = tags.find((t) => t.id === newTag.id);
    expect(found).toBeDefined();
    expect(found?.name).toBe('CUSTOM QA');
  });

  it('updates an existing tag', async () => {
    const tags = await getTags();
    const target = tags[0];

    const updated = await updateTag(target.id, { name: 'RENAMED TAG' });
    expect(updated.name).toBe('RENAMED TAG');

    const freshTags = await getTags();
    expect(freshTags.find((t) => t.id === target.id)?.name).toBe('RENAMED TAG');
  });

  it('duplicates a tag', async () => {
    const tags = await getTags();
    const target = tags[0];

    const cloned = await duplicateTag(target.id);
    expect(cloned.id).not.toBe(target.id);
    expect(cloned.name).toContain('(Copy)');

    const freshTags = await getTags();
    expect(freshTags.length).toBe(tags.length + 1);
  });

  it('toggles tag enabled status', async () => {
    const tags = await getTags();
    const target = tags[0];
    const initialStatus = target.enabled;

    const newStatus = await toggleTag(target.id);
    expect(newStatus).toBe(!initialStatus);

    const freshTags = await getTags();
    expect(freshTags.find((t) => t.id === target.id)?.enabled).toBe(!initialStatus);
  });

  it('deletes a tag', async () => {
    const tags = await getTags();
    const initialCount = tags.length;
    const target = tags[0];

    await deleteTag(target.id);

    const freshTags = await getTags();
    expect(freshTags.length).toBe(initialCount - 1);
    expect(freshTags.find((t) => t.id === target.id)).toBeUndefined();
  });

  it('reorders tags', async () => {
    const tags = await getTags();
    const reversedIds = [...tags].reverse().map((t) => t.id);

    const reordered = await reorderTags(reversedIds);
    expect(reordered[0].id).toBe(reversedIds[0]);
    expect(reordered[0].priority).toBe(0);
  });

  it('exports and imports JSON configuration', async () => {
    const exported = await exportData();
    expect(exported.app).toBe('LayerMark');
    expect(exported.tags.length).toBeGreaterThan(0);

    const jsonString = JSON.stringify(exported);
    const importResult = await importData(jsonString, 'merge');
    expect(importResult.success).toBe(true);
    expect(importResult.count).toBe(exported.tags.length);
  });

  it('updates global settings and language', async () => {
    const settings = await getSettings();
    expect(settings.language).toBeDefined();

    const updated = await updateSettings({ language: 'en', theme: 'dark' });
    expect(updated.language).toBe('en');
    expect(updated.theme).toBe('dark');
  });
});
