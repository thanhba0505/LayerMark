import { useEffect, useState } from 'react';
import { 
  Settings, 
  Plus, 
  ExternalLink, 
  Globe, 
  Power, 
  CheckCircle2, 
  Tag as TagIcon,
  Languages
} from 'lucide-react';
import { LayerMarkTag, LayerMarkSettings, AppLanguage } from '../shared/types';
import { getTags, getSettings, toggleTag, updateSettings, subscribeToStorageChanges } from '../shared/storage';
import { getMatchingTags } from '../shared/matcher';
import { getTranslation, TranslationKey } from '../shared/i18n';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const [tags, setTags] = useState<LayerMarkTag[]>([]);
  const [settings, setSettings] = useState<LayerMarkSettings | null>(null);
  const [matchedTags, setMatchedTags] = useState<LayerMarkTag[]>([]);

  const lang: AppLanguage = settings?.language || 'vi';
  const t = (key: TranslationKey) => getTranslation(key, lang);

  // Load active tab info and storage data
  useEffect(() => {
    async function init() {
      const [allTags, appSettings] = await Promise.all([getTags(), getSettings()]);
      setTags(allTags);
      setSettings(appSettings);

      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          const activeTab = tabs[0];
          if (activeTab?.url) {
            setCurrentUrl(activeTab.url);
            try {
              const urlObj = new URL(activeTab.url);
              setCurrentDomain(urlObj.hostname + (urlObj.port ? `:${urlObj.port}` : ''));
            } catch {
              setCurrentDomain(activeTab.url);
            }
          }
        });
      } else {
        // Fallback for dev preview
        const dummyUrl = 'http://localhost:3000/dashboard';
        setCurrentUrl(dummyUrl);
        setCurrentDomain('localhost:3000');
      }
    }

    init();

    // Subscribe to storage changes
    const unsubscribe = subscribeToStorageChanges((newTags, newSettings) => {
      setTags(newTags);
      setSettings(newSettings);
    });

    return () => unsubscribe();
  }, []);

  // Compute matching tags whenever currentUrl or tags change
  useEffect(() => {
    if (currentUrl && tags.length > 0) {
      setMatchedTags(getMatchingTags(currentUrl, tags));
    } else {
      setMatchedTags([]);
    }
  }, [currentUrl, tags]);

  const handleToggleGlobal = async () => {
    if (!settings) return;
    const updated = await updateSettings({ enableGlobalToggle: !settings.enableGlobalToggle });
    setSettings(updated);
  };

  const handleToggleLanguage = async () => {
    if (!settings) return;
    const nextLang: AppLanguage = settings.language === 'vi' ? 'en' : 'vi';
    const updated = await updateSettings({ language: nextLang });
    setSettings(updated);
  };

  const handleToggleTag = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleTag(id);
    const updatedTags = await getTags();
    setTags(updatedTags);
  };

  const openOptionsPage = (prefillDomain?: string) => {
    let url = chrome?.runtime?.getURL ? chrome.runtime.getURL('src/options/index.html') : '../options/index.html';
    if (prefillDomain) {
      url += `?newDomain=${encodeURIComponent(prefillDomain)}`;
    }
    if (typeof chrome !== 'undefined' && chrome.tabs?.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-[480px] p-4 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-xs tracking-tight">
            LM
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100 leading-tight">
              LayerMark
            </h1>
            <span className="text-[10px] text-slate-500 block -mt-0.5">{t('appSubtitle')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Language Switcher */}
          <button
            onClick={handleToggleLanguage}
            className="px-2 py-1 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center space-x-1"
            title="Đổi ngôn ngữ / Switch Language"
          >
            <Languages className="w-3 h-3 text-indigo-500" />
            <span>{lang === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {/* Master Enable Toggle */}
          <button
            onClick={handleToggleGlobal}
            className={`p-1.5 rounded-md transition ${
              settings?.enableGlobalToggle
                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100'
                : 'text-slate-400 bg-slate-200/60 dark:bg-slate-800 hover:bg-slate-300'
            }`}
            title={t('globalToggle')}
          >
            <Power className="w-3.5 h-3.5" />
          </button>

          {/* Settings / Dashboard link */}
          <button
            onClick={() => openOptionsPage()}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
            title={t('openDashboard')}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Current Domain Box */}
      <div className="mt-3 p-2.5 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-0.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>{t('activeTabHost')}</span>
          </div>
          {settings?.enableGlobalToggle ? (
            <span className="flex items-center space-x-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Active</span>
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 font-medium">Disabled</span>
          )}
        </div>
        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
          {currentDomain || 'Unknown'}
        </div>
      </div>

      {/* Matching Tags Section */}
      <div className="flex-1 mt-3 flex flex-col min-h-0">
        <div className="flex items-center justify-between pb-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {t('matchedTagsCount')} ({matchedTags.length})
          </span>
          {currentDomain && (
            <button
              onClick={() => openOptionsPage(currentDomain)}
              className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>{t('createTag')}</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
          {matchedTags.length > 0 ? (
            matchedTags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => openOptionsPage()}
                className="p-2.5 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/70 dark:border-slate-700/70 shadow-xs flex items-center justify-between hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition cursor-pointer"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  {/* Badge visual representation */}
                  <div
                    className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase truncate shadow-xs flex items-center space-x-1 shrink-0"
                    style={{
                      backgroundColor: tag.style.bgColor,
                      color: tag.style.textColor,
                      opacity: tag.enabled ? 1 : 0.4,
                    }}
                  >
                    {tag.style.pulseAnimation && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                    )}
                    <span>{tag.name}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                      {tag.project ? `${tag.project} • ` : ''}{tag.style.anchorPosition}
                    </div>
                  </div>
                </div>

                {/* Quick toggle */}
                <button
                  onClick={(e) => handleToggleTag(tag.id, e)}
                  className={`w-8 h-4 flex items-center rounded-full p-0.5 transition ${
                    tag.enabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                  }`}
                  title={tag.enabled ? 'Disable' : 'Enable'}
                >
                  <span className="w-3 h-3 rounded-full bg-white shadow-xs" />
                </button>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/40 dark:bg-slate-800/20">
              <TagIcon className="w-7 h-7 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                {t('popupNoMatch')}
              </p>
              {currentDomain && (
                <button
                  onClick={() => openOptionsPage(currentDomain)}
                  className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition"
                >
                  {t('popupCreateForDomain')}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 mt-auto border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Local-first</span>
        </span>
        <button
          onClick={() => openOptionsPage()}
          className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:underline font-medium transition"
        >
          <span>{t('dashboard')}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
