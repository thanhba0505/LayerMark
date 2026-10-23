import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ShieldAlert, 
  Server, 
  Code, 
  Laptop, 
  Bug, 
  Globe, 
  Database,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  LayerMarkTag, 
  AnchorPosition, 
  EnvironmentType, 
  RuleMatchType, 
  TagSize, 
  UrlRule,
  AppLanguage 
} from '../../shared/types';
import { generateId } from '../../shared/storage';
import { matchesRule } from '../../shared/matcher';
import { getTranslation, TranslationKey } from '../../shared/i18n';

interface TagEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tagData: Omit<LayerMarkTag, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => Promise<void>;
  editingTag?: LayerMarkTag | null;
  initialDomain?: string;
  lang: AppLanguage;
}

const PRESET_COLORS = [
  '#DC2626', // Red (Prod)
  '#EA580C', // Orange
  '#D97706', // Amber (Staging)
  '#059669', // Emerald (Dev)
  '#0284C7', // Sky
  '#2563EB', // Blue (Local)
  '#7C3AED', // Purple
  '#DB2777', // Pink
  '#475569', // Slate
  '#0F172A', // Dark Slate
];

const PRESET_ICONS = ['ShieldAlert', 'Server', 'Code', 'Laptop', 'Bug', 'Globe', 'Database'];

export default function TagEditorModal({
  isOpen,
  onClose,
  onSave,
  editingTag,
  initialDomain,
  lang,
}: TagEditorModalProps) {
  const t = (key: TranslationKey) => getTranslation(key, lang);

  const [activeTab, setActiveTab] = useState<'basic' | 'style' | 'rules'>('basic');

  // Form State
  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState<EnvironmentType>('production');
  const [project, setProject] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [priority, setPriority] = useState(0);

  // Style State
  const [bgColor, setBgColor] = useState('#DC2626');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [borderColor, setBorderColor] = useState('');
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderRadius, setBorderRadius] = useState(6);
  const [opacity, setOpacity] = useState(0.95);
  const [size, setSize] = useState<TagSize>('medium');
  const [icon, setIcon] = useState<string>('ShieldAlert');
  const [anchorPosition, setAnchorPosition] = useState<AnchorPosition>('top-right');
  const [pulseAnimation, setPulseAnimation] = useState(true);

  // Rules State
  const [rules, setRules] = useState<UrlRule[]>([]);

  // Tester State
  const [testUrl, setTestUrl] = useState('');
  const [isTestMatched, setIsTestMatched] = useState<boolean | null>(null);

  // Populate form on edit or open
  useEffect(() => {
    if (editingTag) {
      setName(editingTag.name);
      setEnvironment(editingTag.environment);
      setProject(editingTag.project || '');
      setDescription(editingTag.description || '');
      setEnabled(editingTag.enabled);
      setPriority(editingTag.priority);

      setBgColor(editingTag.style.bgColor);
      setTextColor(editingTag.style.textColor);
      setBorderColor(editingTag.style.borderColor || '');
      setBorderWidth(editingTag.style.borderWidth || 0);
      setBorderRadius(editingTag.style.borderRadius ?? 6);
      setOpacity(editingTag.style.opacity ?? 0.95);
      setSize(editingTag.style.size || 'medium');
      setIcon(editingTag.style.icon || '');
      setAnchorPosition(editingTag.style.anchorPosition || 'top-right');
      setPulseAnimation(Boolean(editingTag.style.pulseAnimation));

      setRules(JSON.parse(JSON.stringify(editingTag.rules)));
    } else {
      // Default new tag
      setName('');
      setEnvironment('production');
      setProject('');
      setDescription('');
      setEnabled(true);
      setPriority(0);

      setBgColor('#DC2626');
      setTextColor('#FFFFFF');
      setBorderColor('');
      setBorderWidth(0);
      setBorderRadius(6);
      setOpacity(0.95);
      setSize('medium');
      setIcon('ShieldAlert');
      setAnchorPosition('top-right');
      setPulseAnimation(true);

      if (initialDomain) {
        setName(initialDomain.toUpperCase().slice(0, 16));
        setRules([
          {
            id: generateId('rule'),
            type: initialDomain.includes(':') ? 'port' : 'exact-domain',
            pattern: initialDomain,
            enabled: true,
          },
        ]);
      } else {
        setRules([
          {
            id: generateId('rule'),
            type: 'wildcard-domain',
            pattern: '*.prod.*',
            enabled: true,
          },
        ]);
      }
    }
  }, [editingTag, initialDomain, isOpen]);

  // Live Rule Tester logic
  useEffect(() => {
    if (!testUrl.trim()) {
      setIsTestMatched(null);
      return;
    }

    const matches = rules.some((rule) => matchesRule(testUrl.trim(), rule));
    setIsTestMatched(matches);
  }, [testUrl, rules]);

  if (!isOpen) return null;

  const handleAddRule = () => {
    setRules([
      ...rules,
      {
        id: generateId('rule'),
        type: 'exact-domain',
        pattern: '',
        enabled: true,
      },
    ]);
  };

  const handleUpdateRule = (index: number, updates: Partial<UrlRule>) => {
    const updated = [...rules];
    updated[index] = { ...updated[index], ...updates };
    setRules(updated);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSave(
      {
        name: name.trim(),
        environment,
        project: project.trim() || undefined,
        description: description.trim() || undefined,
        enabled,
        priority: Number(priority) || 0,
        style: {
          bgColor,
          textColor,
          borderColor: borderColor || undefined,
          borderWidth: borderWidth ? Number(borderWidth) : undefined,
          borderRadius: Number(borderRadius),
          opacity: Number(opacity),
          size,
          icon: icon || undefined,
          anchorPosition,
          pulseAnimation,
        },
        rules: rules.filter((r) => r.pattern.trim().length > 0),
      },
      editingTag?.id
    );

    onClose();
  };

  const renderIconSvg = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'Server': return <Server className="w-3.5 h-3.5" />;
      case 'Code': return <Code className="w-3.5 h-3.5" />;
      case 'Laptop': return <Laptop className="w-3.5 h-3.5" />;
      case 'Bug': return <Bug className="w-3.5 h-3.5" />;
      case 'Globe': return <Globe className="w-3.5 h-3.5" />;
      case 'Database': return <Database className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                {editingTag ? t('modalEditTitle') : t('modalCreateTitle')}
              </h2>
              <p className="text-xs text-slate-500">Configure styling, rules, and priority</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-900/50">
          {(['basic', 'style', 'rules'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {tab === 'basic' && t('tabBasic')}
              {tab === 'style' && t('tabStyle')}
              {tab === 'rules' && `${t('tabRules')} (${rules.length})`}
            </button>
          ))}
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('tagName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('tagNamePlaceholder')}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('environment')}
                  </label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value as EnvironmentType)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden capitalize"
                  >
                    <option value="production">{t('production')}</option>
                    <option value="staging">{t('staging')}</option>
                    <option value="uat">{t('uat')}</option>
                    <option value="development">{t('development')}</option>
                    <option value="local">{t('local')}</option>
                    <option value="testing">{t('testing')}</option>
                    <option value="custom">{t('custom')}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('project')}
                  </label>
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder={t('projectPlaceholder')}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('priority')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={priority}
                    onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden"
                  />
                  <span className="text-[11px] text-slate-400 mt-0.5 block">0 = Higher priority</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('description')}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('descriptionPlaceholder')}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-hidden resize-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="tag-enabled-check"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="tag-enabled-check" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  {t('enabled')}
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE & STYLING */}
          {activeTab === 'style' && (
            <div className="space-y-5">
              {/* Live Preview Box inside Modal */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/40 text-center">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  {t('tabPreview')}
                </span>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-xs uppercase shadow-md select-none transition-all"
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    border: borderWidth ? `${borderWidth}px solid ${borderColor || 'transparent'}` : 'none',
                    borderRadius: `${borderRadius}px`,
                    opacity: opacity,
                  }}
                >
                  {pulseAnimation && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  {icon && renderIconSvg(icon)}
                  <span>{name || 'PREVIEW TAG'}</span>
                </div>
              </div>

              {/* Color Presets & Pickers */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('bgColor')}
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setBgColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition ${
                        bgColor === c ? 'border-indigo-600 scale-110 shadow-sm' : 'border-white dark:border-slate-800'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                  />
                  <span className="text-xs font-mono text-slate-500">{bgColor}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('textColor')}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-7 h-7 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-transparent"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-28 px-2 py-1 text-xs font-mono bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('size')}
                  </label>
                  <select
                    value={size}
                    onChange={(e) => setSize(e.target.value as TagSize)}
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                  >
                    <option value="small">{t('sizeSmall')}</option>
                    <option value="medium">{t('sizeMedium')}</option>
                    <option value="large">{t('sizeLarge')}</option>
                  </select>
                </div>
              </div>

              {/* Anchor Position */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('anchorPosition')}
                </label>
                <select
                  value={anchorPosition}
                  onChange={(e) => setAnchorPosition(e.target.value as AnchorPosition)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl"
                >
                  <option value="top-right">{t('anchorTopRight')}</option>
                  <option value="top-left">{t('anchorTopLeft')}</option>
                  <option value="bottom-right">{t('anchorBottomRight')}</option>
                  <option value="bottom-left">{t('anchorBottomLeft')}</option>
                  <option value="top-center">{t('anchorTopCenter')}</option>
                  <option value="bottom-center">{t('anchorBottomCenter')}</option>
                  <option value="top-banner">{t('anchorTopBanner')}</option>
                  <option value="bottom-banner">{t('anchorBottomBanner')}</option>
                  <option value="ribbon-top-right">{t('anchorRibbonTopRight')}</option>
                  <option value="ribbon-top-left">{t('anchorRibbonTopLeft')}</option>
                </select>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('icon')}
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIcon('')}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
                      icon === '' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {t('iconNone')}
                  </button>
                  {PRESET_ICONS.map((iName) => (
                    <button
                      key={iName}
                      type="button"
                      onClick={() => setIcon(iName)}
                      className={`p-2 rounded-lg border transition flex items-center justify-center ${
                        icon === iName ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                      title={iName}
                    >
                      {renderIconSvg(iName)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pulse Alert Animation Toggle */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="pulse-check"
                  checked={pulseAnimation}
                  onChange={(e) => setPulseAnimation(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded-sm border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="pulse-check" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  {t('pulseAnimation')} — <span className="text-slate-400 font-normal">{t('pulseAnimationDesc')}</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: URL RULES & TESTER */}
          {activeTab === 'rules' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {t('rulesTitle')}
                    </h3>
                    <p className="text-[11px] text-slate-400">{t('rulesDesc')}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('addRule')}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {rules.length > 0 ? (
                    rules.map((rule, idx) => (
                      <div
                        key={rule.id}
                        className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <select
                            value={rule.type}
                            onChange={(e) => handleUpdateRule(idx, { type: e.target.value as RuleMatchType })}
                            className="text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 outline-hidden"
                          >
                            <option value="exact-domain">{t('typeExactDomain')}</option>
                            <option value="wildcard-domain">{t('typeWildcardDomain')}</option>
                            <option value="port">{t('typePort')}</option>
                            <option value="path-pattern">{t('typePathPattern')}</option>
                            <option value="regex">{t('typeRegex')}</option>
                          </select>

                          <div className="flex items-center space-x-2">
                            <label className="text-[11px] text-slate-400 flex items-center space-x-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={rule.enabled}
                                onChange={(e) => handleUpdateRule(idx, { enabled: e.target.checked })}
                                className="w-3.5 h-3.5 text-indigo-600 rounded-sm"
                              />
                              <span>Active</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleRemoveRule(idx)}
                              className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-md transition"
                              title={t('removeRule')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <input
                          type="text"
                          required
                          value={rule.pattern}
                          onChange={(e) => handleUpdateRule(idx, { pattern: e.target.value })}
                          placeholder={
                            rule.type === 'exact-domain'
                              ? 'e.g. github.com'
                              : rule.type === 'wildcard-domain'
                              ? 'e.g. *.staging.myapp.com'
                              : rule.type === 'port'
                              ? 'e.g. localhost:3000 or *:5173'
                              : rule.type === 'path-pattern'
                              ? 'e.g. /admin/*'
                              : '^https://.*\\.dev'
                          }
                          className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-hidden"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400">
                      No rules added yet. Click &quot;Add URL Rule&quot; to begin.
                    </div>
                  )}
                </div>
              </div>

              {/* Live Rule Tester */}
              <div className="p-4 bg-slate-100/70 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                  <span>{t('testUrl')}</span>
                </span>
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder={t('testPlaceholder')}
                  className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-hidden"
                />

                {isTestMatched !== null && (
                  <div className={`flex items-center space-x-1.5 text-xs font-semibold ${
                    isTestMatched ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                  }`}>
                    {isTestMatched ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t('matched')}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4" />
                        <span>{t('notMatched')}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
