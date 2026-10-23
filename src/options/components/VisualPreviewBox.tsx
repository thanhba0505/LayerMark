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

  // Ribbon corner container styles
  const getRibbonContainerStyle = (c: TagCorner): React.CSSProperties => {
    switch (c) {
      case 'top-right':
        return { top: 0, right: 0, width: 110, height: 110 };
      case 'top-left':
        return { top: 0, left: 0, width: 110, height: 110 };
      case 'bottom-right':
        return { bottom: 0, right: 0, width: 110, height: 110 };
      case 'bottom-left':
        return { bottom: 0, left: 0, width: 110, height: 110 };
    }
  };

  const getRibbonBadgeStyle = (c: TagCorner): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      width: 140,
      textAlign: 'center',
      padding: '4px 0',
      fontSize: size === 'small' ? '9px' : size === 'large' ? '12px' : '10px',
      fontWeight: 'bold',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
      backgroundColor: bgColor,
      color: textColor,
      opacity: opacity,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
      lineHeight: 1,
      zIndex: 25,
      pointerEvents: 'none',
    };

    switch (c) {
      case 'top-right':
        return { ...base, top: 22, right: -32, transform: 'rotate(45deg)' };
      case 'top-left':
        return { ...base, top: 22, left: -32, transform: 'rotate(-45deg)' };
      case 'bottom-right':
        return { ...base, bottom: 22, right: -32, transform: 'rotate(-45deg)' };
      case 'bottom-left':
        return { ...base, bottom: 22, left: -32, transform: 'rotate(45deg)' };
    }
  };

  // Badge corner positioning
  const getBadgePositionClass = (c: TagCorner): string => {
    switch (c) {
      case 'top-left': return 'top-3 left-3';
      case 'top-right': return 'top-3 right-3';
      case 'bottom-left': return 'bottom-3 left-3';
      case 'bottom-right': return 'bottom-3 right-3';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
          {t('visualPreviewTitle')}
        </span>
        <span className="text-[11px] text-slate-400">
          {t('clickCornerToSelect')}
        </span>
      </div>

      {/* Mini Mock Browser Window */}
      <div className="relative rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md overflow-hidden select-none">
        {/* Browser Titlebar */}
        <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
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

        {/* Viewport Canvas (Clean Website Background) */}
        <div className="relative h-60 bg-slate-50 dark:bg-slate-950 p-3 overflow-hidden">
          {/* Simulated Webpage Layout */}
          <div className="space-y-3 opacity-30 pointer-events-none">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-slate-300 dark:border-slate-700 pb-2">
              <div className="h-4 w-28 bg-slate-400 dark:bg-slate-600 rounded" />
              <div className="flex gap-2">
                <div className="h-3 w-12 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-3 w-12 bg-slate-300 dark:bg-slate-700 rounded" />
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg p-2 space-y-1">
                <div className="h-2 w-16 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-3 w-10 bg-slate-400 dark:bg-slate-600 rounded" />
              </div>
              <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg p-2 space-y-1">
                <div className="h-2 w-16 bg-slate-300 dark:bg-slate-700 rounded" />
                <div className="h-3 w-10 bg-slate-400 dark:bg-slate-600 rounded" />
              </div>
            </div>

            {/* Content row */}
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-lg p-2 space-y-1.5">
              <div className="h-2.5 w-full bg-slate-300 dark:bg-slate-700 rounded" />
              <div className="h-2.5 w-3/4 bg-slate-300 dark:bg-slate-700 rounded" />
            </div>
          </div>

          {/* 4 Interactive Clickable Corner Quadrants (Invisible, clean, no overlapping buttons!) */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 z-10">
            <div 
              onClick={() => onCornerChange('top-left')} 
              className={`cursor-pointer transition-colors ${corner === 'top-left' ? 'bg-indigo-500/5' : 'hover:bg-indigo-500/10'}`}
              title={t('cornerTopLeft')}
            />
            <div 
              onClick={() => onCornerChange('top-right')} 
              className={`cursor-pointer transition-colors ${corner === 'top-right' ? 'bg-indigo-500/5' : 'hover:bg-indigo-500/10'}`}
              title={t('cornerTopRight')}
            />
            <div 
              onClick={() => onCornerChange('bottom-left')} 
              className={`cursor-pointer transition-colors ${corner === 'bottom-left' ? 'bg-indigo-500/5' : 'hover:bg-indigo-500/10'}`}
              title={t('cornerBottomLeft')}
            />
            <div 
              onClick={() => onCornerChange('bottom-right')} 
              className={`cursor-pointer transition-colors ${corner === 'bottom-right' ? 'bg-indigo-500/5' : 'hover:bg-indigo-500/10'}`}
              title={t('cornerBottomRight')}
            />
          </div>

          {/* LIVE RENDER: RIBBON SHAPE (Clean, authentic diagonal ribbon) */}
          {shape === 'ribbon' && (
            <div
              className="absolute pointer-events-none overflow-hidden z-20"
              style={getRibbonContainerStyle(corner)}
            >
              <div style={getRibbonBadgeStyle(corner)}>
                {pulseAnimation && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0" />}
                {icon && <span className="scale-75 shrink-0">{renderIconSvg(icon)}</span>}
                <span className="truncate max-w-[90px]">{name || 'TAG'}</span>
              </div>
            </div>
          )}

          {/* LIVE RENDER: BADGE / PILL SHAPE */}
          {shape === 'badge' && (
            <div
              className={`absolute pointer-events-none z-20 ${getBadgePositionClass(corner)}`}
            >
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 font-bold text-xs uppercase shadow-md transition-all select-none"
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
              className={`absolute left-0 right-0 pointer-events-none z-20 text-center font-bold text-xs uppercase shadow-md flex items-center justify-center gap-1.5 py-1.5 ${
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
