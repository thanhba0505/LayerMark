import { useEffect, useState } from 'react';
import { Tag, Settings, Plus, ExternalLink, Globe } from 'lucide-react';

export default function App() {
  const [currentDomain, setCurrentDomain] = useState<string>('');
  const activeCount = 0;

  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.url) {
          try {
            const urlObj = new URL(activeTab.url);
            setCurrentDomain(urlObj.hostname + (urlObj.port ? `:${urlObj.port}` : ''));
          } catch {
            setCurrentDomain(activeTab.url);
          }
        }
      });
    } else {
      setCurrentDomain('localhost:3000');
    }
  }, []);

  const openOptionsPage = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime?.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('../options/index.html', '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
            LM
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100 leading-none">
              LayerMark
            </h1>
            <span className="text-xs text-slate-500">Visual Environment Manager</span>
          </div>
        </div>
        <button
          onClick={openOptionsPage}
          className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Mở trang quản lý"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Current Domain Box */}
      <div className="p-3 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-1">
        <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-500">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span>Tab hiện tại</span>
        </div>
        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
          {currentDomain || 'Chưa phát hiện'}
        </div>
      </div>

      {/* Matching Tags Section (Placeholder for Phase 2) */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tag đang khớp ({activeCount})
          </span>
          <button
            onClick={openOptionsPage}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm tag</span>
          </button>
        </div>

        <div className="p-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/20">
          <Tag className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Chưa có tag nào được kích hoạt cho URL này.
          </p>
          <button
            onClick={openOptionsPage}
            className="mt-3 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs transition"
          >
            Tạo tag mới cho domain này
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>v1.0.0 (Local storage)</span>
        <button
          onClick={openOptionsPage}
          className="flex items-center space-x-1 hover:text-indigo-600 transition"
        >
          <span>Trang quản trị</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
