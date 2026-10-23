import React from 'react';
import { TagShape, TagCorner, TagSize } from '../../shared/types';
import { AppLanguage } from '../../shared/types';
import { getTranslation, TranslationKey } from '../../shared/i18n';

interface VisualPreviewBoxProps {
  name: string;
  shape: TagShape;
  corner: TagCorner;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  size?: TagSize;
  icon?: string;
  pulseAnimation?: boolean;
  onCornerChange: (corner: TagCorner) => void;
  renderIconSvg: (iconName: string) => React.ReactNode;
  lang: AppLanguage;
}

export default function VisualPreviewBox({
  name,
  shape,
  corner,
  bgColor,
  textColor,
  borderColor,
  borderWidth,
  borderRadius,
  opacity = 0.95,
  size = 'medium',
  icon,
  pulseAnimation,
  onCornerChange,
  renderIconSvg,
  lang,
}: VisualPreviewBoxProps) {
  const t = (key: TranslationKey) => getTranslation(key, lang);

  // Ribbon corner positioning calculations for the mini preview container
  const getRibbonContainerStyle = (c: TagCorner): React.CSSProperties => {
    switch (c) {
      case 'top-right':
        return { top: 0, right: 0, width: 90, height: 90 };
      case 'top-left':
        return { top: 0, left: 0, width: 90, height: 90 };
      case 'bottom-right':
        return { bottom: 0, right: 0, width: 90, height: 90 };
      case 'bottom-left':
        return { bottom: 0, left: 0, width: 90, height: 90 };
    }
  };

  const getRibbonBadgeStyle = (c: TagCorner): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 110,
      textAlign: 'center',
      padding: '3px 0',
      fontSize: size === 'small' ? '8px' : size === 'large' ? '11px' : '9px',
      fontWeight: 'bold',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      backgroundColor: bgColor,
      color: textColor,
      opacity: opacity,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '3px',
      lineHeight: 1,
    };

    switch (c) {
      case 'top-right':
        return { ...base, top: 16, right: -26, transform: 'rotate(45deg)' };
      case 'top-left':
        return { ...base, top: 16, left: -26, transform: 'rotate(-45deg)' };
      case 'bottom-right':
        return { ...base, bottom: 16, right: -26, transform: 'rotate(-45deg)' };
      case 'bottom-left':
        return { ...base, bottom: 16, left: -26, transform: 'rotate(45deg)' };
    }
  };

  // Badge corner positioning
  const getBadgePositionClass = (c: TagCorner): string => {
    switch (c) {
      case 'top-left': return 'top-2.5 left-2.5';
      case 'top-right': return 'top-2.5 right-2.5';
      case 'bottom-left': return 'bottom-2.5 left-2.5';
      case 'bottom-right': return 'bottom-2.5 right-2.5';
    }
  };

  const CORNER_KEYS: { id: TagCorner; label: TranslationKey; icon: string }[] = [
    { id: 'top-left', label: 'cornerTopLeft', icon: '↖' },
    { id: 'top-right', label: 'cornerTopRight', icon: '↗' },
    { id: 'bottom-left', label: 'cornerBottomLeft', icon: '↙' },
    { id: 'bottom-right', label: 'cornerBottomRight', icon: '↘' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            {t('visualPreviewTitle')}
          </span>
          <span className="text-[11px] text-slate-400">
            {t('clickCornerToSelect')}
          </span>
        </div>
      </div>

      {/* Mini Mock Browser Window */}
      <div className="relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg overflow-hidden select-none">
        {/* Browser Titlebar */}
        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          </div>

          {/* Address Bar */}
          <div className="flex-1 max-w-[200px] mx-auto px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-400 text-center truncate font-mono">
            https://myapp.com/dashboard
          </div>

          <div className="w-8" />
        </div>

        {/* Viewport Canvas (Simulated Website Content) */}
        <div className="relative h-56 bg-slate-50 dark:bg-slate-950 p-3 overflow-hidden">
          {/* Simulated Mock Web Elements */}
          <div className="space-y-2.5 opacity-40 pointer-events-none">
            {/* Mock Header */}
            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded-md" />
            <div className="flex gap-2">
              <div className="h-16 flex-1 bg-slate-200 dark:bg-slate-800 rounded-lg p-2 space-y-1">
                <div className="h-2 w-16 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-3 w-10 bg-slate-300 dark:bg-slate-700 rounded" />
              </div>
              <div className="h-16 flex-1 bg-slate-200 dark:bg-slate-800 rounded-lg p-2 space-y-1">
                <div className="h-2 w-16 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-3 w-10 bg-slate-300 dark:bg-slate-700 rounded" />
              </div>
            </div>
            {/* Mock Table/List */}
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded-lg p-2 space-y-1.5">
              <div className="h-2.5 w-full bg-slate-300 dark:bg-slate-700 rounded" />
              <div className="h-2.5 w-3/4 bg-slate-300 dark:bg-slate-700 rounded" />
              <div className="h-2.5 w-1/2 bg-slate-300 dark:bg-slate-700 rounded" />
            </div>
          </div>

          {/* Interactive 4 Corner Target Hotspots */}
          {CORNER_KEYS.map((ck) => {
            const isSelected = corner === ck.id;
            const positionClasses = 
              ck.id === 'top-left' ? 'top-1.5 left-1.5' :
              ck.id === 'top-right' ? 'top-1.5 right-1.5' :
              ck.id === 'bottom-left' ? 'bottom-1.5 left-1.5' :
              'bottom-1.5 right-1.5';

            return (
              <button
                key={ck.id}
                type="button"
                onClick={() => onCornerChange(ck.id)}
                className={`absolute ${positionClasses} z-20 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight transition flex items-center gap-1 ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 bg-indigo-600/90 text-white shadow-md'
                    : 'bg-white/80 dark:bg-slate-800/80 hover:bg-indigo-50 hover:text-indigo-600 text-slate-500 border border-slate-300/80 dark:border-slate-700'
                }`}
                title={t(ck.label)}
              >
                <span>{ck.icon}</span>
                <span>{ck.id.replace('-', ' ').toUpperCase()}</span>
              </button>
            );
          })}

          {/* LIVE RENDER: RIBBON SHAPE */}
          {shape === 'ribbon' && (
            <div
              className="absolute z-10 pointer-events-none overflow-hidden"
              style={getRibbonContainerStyle(corner)}
            >
              <div style={getRibbonBadgeStyle(corner)}>
                {pulseAnimation && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />}
                {icon && <span className="scale-75 shrink-0">{renderIconSvg(icon)}</span>}
                <span className="truncate max-w-[80px]">{name || 'TAG'}</span>
              </div>
            </div>
          )}

          {/* LIVE RENDER: BADGE / PILL SHAPE */}
          {shape === 'badge' && (
            <div
              className={`absolute z-10 pointer-events-none ${getBadgePositionClass(corner)}`}
            >
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 font-bold text-xs uppercase shadow-md transition-all select-none"
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  border: borderWidth ? `${borderWidth}px solid ${borderColor || 'transparent'}` : 'none',
                  borderRadius: `${borderRadius ?? 6}px`,
                  opacity: opacity,
                  fontSize: size === 'small' ? '9px' : size === 'large' ? '12px' : '10px',
                }}
              >
                {pulseAnimation && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {icon && <span className="scale-75 shrink-0">{renderIconSvg(icon)}</span>}
                <span className="truncate max-w-[120px]">{name || 'TAG'}</span>
              </div>
            </div>
          )}

          {/* LIVE RENDER: FULL BANNER SHAPE */}
          {shape === 'banner' && (
            <div
              className={`absolute z-10 left-0 right-0 pointer-events-none text-center font-bold text-xs uppercase shadow-md flex items-center justify-center gap-1.5 py-1 ${
                corner.includes('bottom') ? 'bottom-0' : 'top-0'
              }`}
              style={{
                backgroundColor: bgColor,
                color: textColor,
                opacity: opacity,
                fontSize: size === 'small' ? '9px' : size === 'large' ? '12px' : '10px',
              }}
            >
              {pulseAnimation && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              {icon && <span className="scale-75 shrink-0">{renderIconSvg(icon)}</span>}
              <span>{name || 'BANNER TAG'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
