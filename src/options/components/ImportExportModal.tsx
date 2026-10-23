import { useState, useRef } from 'react';
import { X, Download, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AppLanguage } from '../../shared/types';
import { exportData, importData } from '../../shared/storage';
import { getTranslation, TranslationKey } from '../../shared/i18n';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => Promise<void>;
  lang: AppLanguage;
}

export default function ImportExportModal({
  isOpen,
  onClose,
  onImportComplete,
  lang,
}: ImportExportModalProps) {
  const t = (key: TranslationKey) => getTranslation(key, lang);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<'merge' | 'overwrite'>('merge');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `layermark-config-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage({ type: 'success', text: t('exportSuccess') });
    } catch {
      setStatusMessage({ type: 'error', text: 'Export failed.' });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const result = await importData(content, mode);
      if (result.success) {
        setStatusMessage({ type: 'success', text: `${t('importSuccess')} (${result.count} tags)` });
        await onImportComplete();
      } else {
        setStatusMessage({ type: 'error', text: result.error || t('importError') });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('importJson')} / {t('exportJson')}
            </h2>
            <p className="text-xs text-slate-500">Backup, share, and restore configuration</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className={`p-3 rounded-xl flex items-center space-x-2 text-xs font-semibold ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Export Section */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {t('exportJson')}
              </h3>
              <p className="text-[11px] text-slate-500">Download all your tags and settings into a JSON backup.</p>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('exportJson')}</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {t('importTitle')}
            </h3>
            <p className="text-[11px] text-slate-500">{t('importDesc')}</p>
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="merge"
                checked={mode === 'merge'}
                onChange={() => setMode('merge')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>{t('importModeMerge')}</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="overwrite"
                checked={mode === 'overwrite'}
                onChange={() => setMode('overwrite')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>{t('importModeOverwrite')}</span>
            </label>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2 px-3 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center space-x-2"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>{t('selectJsonFile')}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
