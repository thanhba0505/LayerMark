import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Upload, 
  Layers, 
  RotateCcw,
  Languages, 
  Moon, 
  Sun, 
  Edit3, 
  Copy, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ShieldAlert, 
  Server, 
  Code, 
  Laptop, 
  Bug, 
  Globe, 
  Database
} from 'lucide-react';
import { 
  LayerMarkTag, 
  LayerMarkSettings, 
  EnvironmentType, 
  AppLanguage 
} from '../shared/types';
import { 
  getTags, 
  saveTags, 
  getSettings, 
  updateSettings, 
  addTag, 
  updateTag, 
  deleteTag, 
  duplicateTag, 
  toggleTag, 
  resetToDefaults, 
  subscribeToStorageChanges 
} from '../shared/storage';
import { getTranslation, TranslationKey } from '../shared/i18n';
import TagEditorModal from './components/TagEditorModal';
import ImportExportModal from './components/ImportExportModal';

export default function App() {
  const [tags, setTags] = useState<LayerMarkTag[]>([]);
  const [settings, setSettings] = useState<LayerMarkSettings | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<'all' | EnvironmentType>('all');
  const [groupBy, setGroupBy] = useState<'none' | 'environment' | 'project'>('none');

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<LayerMarkTag | null>(null);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [initialDomain, setInitialDomain] = useState<string | undefined>(undefined);

  // Notification / Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const lang: AppLanguage = settings?.language || 'vi';
  const t = (key: TranslationKey) => getTranslation(key, lang);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initial data load & URL query param check
  useEffect(() => {
    async function loadData() {
      const [allTags, appSettings] = await Promise.all([getTags(), getSettings()]);
      setTags(allTags);
      setSettings(appSettings);

      // Apply theme
      if (appSettings.theme === 'dark' || (appSettings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Check if opened with ?newDomain=
      const urlParams = new URLSearchParams(window.location.search);
      const prefill = urlParams.get('newDomain');
      if (prefill) {
        setInitialDomain(prefill);
        setIsEditorOpen(true);
      }
    }

    loadData();

    const unsubscribe = subscribeToStorageChanges((newTags, newSettings) => {
      setTags(newTags);
      setSettings(newSettings);
    });

    return () => unsubscribe();
  }, []);

  // Language toggle
  const handleToggleLanguage = async () => {
    if (!settings) return;
    const nextLang: AppLanguage = settings.language === 'vi' ? 'en' : 'vi';
    const updated = await updateSettings({ language: nextLang });
    setSettings(updated);
  };

  // Theme toggle
  const handleToggleTheme = async () => {
    if (!settings) return;
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      await updateSettings({ theme: 'light' });
    } else {
      document.documentElement.classList.add('dark');
      await updateSettings({ theme: 'dark' });
    }
  };

  // Tag CRUD actions
  const handleSaveTag = async (
    tagData: Omit<LayerMarkTag, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    if (id) {
      await updateTag(id, tagData);
      showToast(t('tagSaved'));
    } else {
      await addTag(tagData);
      showToast(t('tagSaved'));
    }
    const fresh = await getTags();
    setTags(fresh);
  };

  const handleDuplicate = async (id: string) => {
    await duplicateTag(id);
    const fresh = await getTags();
    setTags(fresh);
    showToast(t('tagDuplicated'));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('deleteConfirmDesc'))) {
      await deleteTag(id);
      const fresh = await getTags();
      setTags(fresh);
      showToast(t('tagDeleted'));
    }
  };

  const handleToggle = async (id: string) => {
    await toggleTag(id);
    const fresh = await getTags();
    setTags(fresh);
  };

  const handleMovePriority = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sortedTags.length) return;

    const copy = [...sortedTags];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    // Reassign priorities
    const reordered = copy.map((t, idx) => ({ ...t, priority: idx }));
    await saveTags(reordered);
    setTags(reordered);
  };

  const handleResetDefaults = async () => {
    if (window.confirm(t('resetConfirmDesc'))) {
      await resetToDefaults();
      const fresh = await getTags();
      setTags(fresh);
      showToast(t('resetDefaults'));
    }
  };

  // Render SVG icons safely
  const renderIconSvg = (iconName?: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-3.5 h-3.5 shrink-0" />;
      case 'Server': return <Server className="w-3.5 h-3.5 shrink-0" />;
      case 'Code': return <Code className="w-3.5 h-3.5 shrink-0" />;
      case 'Laptop': return <Laptop className="w-3.5 h-3.5 shrink-0" />;
      case 'Bug': return <Bug className="w-3.5 h-3.5 shrink-0" />;
      case 'Globe': return <Globe className="w-3.5 h-3.5 shrink-0" />;
      case 'Database': return <Database className="w-3.5 h-3.5 shrink-0" />;
      default: return null;
    }
  };

  // Filtered & Sorted Tags
  const sortedTags = useMemo(() => {
    return [...tags].sort((a, b) => a.priority - b.priority);
  }, [tags]);

  const filteredTags = useMemo(() => {
    return sortedTags.filter((tag) => {
      // Env filter
      if (selectedEnv !== 'all' && tag.environment !== selectedEnv) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = tag.name.toLowerCase().includes(query);
        const matchesProject = tag.project?.toLowerCase().includes(query);
        const matchesDesc = tag.description?.toLowerCase().includes(query);
        const matchesRulePattern = tag.rules.some((r) => r.pattern.toLowerCase().includes(query));
        return matchesName || matchesProject || matchesDesc || matchesRulePattern;
      }
      return true;
    });
  }, [sortedTags, selectedEnv, searchQuery]);

  // Grouped Tags
  const groupedSections = useMemo(() => {
    if (groupBy === 'none') {
      return [{ key: 'all', title: '', items: filteredTags }];
    }

    const groups = new Map<string, LayerMarkTag[]>();

    for (const tag of filteredTags) {
      const groupKey = groupBy === 'environment' ? tag.environment : (tag.project || 'General');
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(tag);
    }

    return Array.from(groups.entries()).map(([key, items]) => ({
      key,
      title: key.toUpperCase(),
      items,
    }));
  }, [filteredTags, groupBy]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md font-bold text-base tracking-tight">
              LM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  LayerMark
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {t('dashboard')}
                </span>
              </div>
              <p className="text-xs text-slate-500">{t('appSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Language Switch */}
            <button
              onClick={handleToggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Đổi ngôn ngữ / Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-500" />
              <span>{lang === 'vi' ? 'Tiếng Việt' : 'English'}</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={handleToggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Toggle Theme"
            >
              <Sun className="w-4 h-4 hidden dark:block" />
              <Moon className="w-4 h-4 block dark:hidden" />
            </button>

            {/* Reset Presets */}
            <button
              onClick={handleResetDefaults}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-rose-600 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={t('resetDefaults')}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Import / Export JSON */}
            <button
              onClick={() => setIsImportExportOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t('importJson')} / {t('exportJson')}</span>
            </button>

            {/* Create Tag */}
            <button
              onClick={() => {
                setEditingTag(null);
                setInitialDomain(undefined);
                setIsEditorOpen(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createTag')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6 space-y-6">
        {/* Search, Filter & Grouping Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            />
          </div>

          {/* Group By selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 shrink-0">{t('groupBy')}:</span>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as 'none' | 'environment' | 'project')}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 outline-hidden"
            >
              <option value="none">{t('groupByNone')}</option>
              <option value="environment">{t('groupByEnv')}</option>
              <option value="project">{t('groupByProject')}</option>
            </select>
          </div>
        </div>

        {/* Environment Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-medium">
          {(['all', 'production', 'staging', 'uat', 'development', 'local', 'testing', 'custom'] as const).map((env) => (
            <button
              key={env}
              onClick={() => setSelectedEnv(env)}
              className={`px-3 py-1.5 rounded-xl transition capitalize whitespace-nowrap ${
                selectedEnv === env
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {env === 'all' ? t('allEnvironments') : t(env as TranslationKey)}
            </button>
          ))}
        </div>

        {/* Priority Help Note */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <span>{t('sortByPriority')}</span>
          <span>{filteredTags.length} tags</span>
        </div>

        {/* Tag List Sections */}
        {filteredTags.length > 0 ? (
          <div className="space-y-6">
            {groupedSections.map((section) => (
              <div key={section.key} className="space-y-3">
                {section.title && (
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1">
                    {section.title} ({section.items.length})
                  </h3>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {section.items.map((tag) => {
                    const originalIndex = sortedTags.findIndex((t) => t.id === tag.id);

                    return (
                      <div
                        key={tag.id}
                        className={`p-4 rounded-2xl border transition shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                          tag.enabled
                            ? 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-indigo-400/50'
                            : 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/40 opacity-70'
                        }`}
                      >
                        {/* Left: Badge Preview & Info */}
                        <div className="flex items-start sm:items-center space-x-3.5 min-w-0 flex-1">
                          {/* Priority controls */}
                          <div className="flex flex-col items-center justify-center space-y-1 text-slate-400">
                            <button
                              type="button"
                              disabled={originalIndex === 0}
                              onClick={() => handleMovePriority(originalIndex, 'up')}
                              className="p-1 hover:text-indigo-600 disabled:opacity-20 transition"
                              title={t('moveUp')}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono font-bold">#{tag.priority}</span>
                            <button
                              type="button"
                              disabled={originalIndex === sortedTags.length - 1}
                              onClick={() => handleMovePriority(originalIndex, 'down')}
                              className="p-1 hover:text-indigo-600 disabled:opacity-20 transition"
                              title={t('moveDown')}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Rendered Badge Preview */}
                          <div
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs uppercase shadow-sm select-none shrink-0"
                            style={{
                              backgroundColor: tag.style.bgColor,
                              color: tag.style.textColor,
                              border: tag.style.borderWidth ? `${tag.style.borderWidth}px solid ${tag.style.borderColor || 'transparent'}` : 'none',
                              borderRadius: `${tag.style.borderRadius ?? 6}px`,
                              opacity: tag.enabled ? (tag.style.opacity ?? 0.95) : 0.4,
                            }}
                          >
                            {tag.style.pulseAnimation && (
                              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            )}
                            {tag.style.icon && renderIconSvg(tag.style.icon)}
                            <span>{tag.name}</span>
                          </div>

                          {/* Tag Metadata & Rules summary */}
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {tag.environment}
                              </span>
                              {tag.project && (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                  {tag.project}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400">
                                {tag.style.anchorPosition}
                              </span>
                            </div>

                            {tag.description && (
                              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                                {tag.description}
                              </p>
                            )}

                            {/* Rules pills */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              {tag.rules.slice(0, 3).map((r) => (
                                <span
                                  key={r.id}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                                >
                                  {r.pattern}
                                </span>
                              ))}
                              {tag.rules.length > 3 && (
                                <span className="text-[10px] text-slate-400">
                                  +{tag.rules.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={() => handleToggle(tag.id)}
                            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition ${
                              tag.enabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                            }`}
                            title={tag.enabled ? 'Enabled' : 'Disabled'}
                          >
                            <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                          </button>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTag(tag);
                              setIsEditorOpen(true);
                            }}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                            title={t('editTag')}
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Duplicate button */}
                          <button
                            type="button"
                            onClick={() => handleDuplicate(tag.id)}
                            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                            title={t('duplicateTag')}
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(tag.id)}
                            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition"
                            title={t('deleteTag')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-xs">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-inner">
                <Layers className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {searchQuery || selectedEnv !== 'all' ? t('noTagsFound') : t('emptyDashboardTitle')}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {searchQuery || selectedEnv !== 'all' ? t('noTagsFoundDesc') : t('emptyDashboardDesc')}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setEditingTag(null);
                    setInitialDomain(undefined);
                    setIsEditorOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('createTag')}</span>
                </button>
                <button
                  onClick={handleResetDefaults}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('loadPresets')}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Tag Editor Modal */}
      <TagEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveTag}
        editingTag={editingTag}
        initialDomain={initialDomain}
        lang={lang}
      />

      {/* Import / Export Modal */}
      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onImportComplete={async () => {
          const fresh = await getTags();
          setTags(fresh);
        }}
        lang={lang}
      />
    </div>
  );
}
