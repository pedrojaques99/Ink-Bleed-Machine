import React from 'react';
import {
  Download,
  Video,
  Layers,
  Sparkles,
  Sliders,
  Type,
  FileCode2,
  Maximize2
} from 'lucide-react';

interface ToolbarHeaderProps {
  activeTab: 'typography' | 'presets' | 'ink' | 'paper';
  setActiveTab: (tab: 'typography' | 'presets' | 'ink' | 'paper') => void;
  onOpenExportModal: () => void;
  onQuickExportTransparent: () => void;
  onQuickExportSvg: () => void;
  onResetView: () => void;
  isExporting: boolean;
}

export const ToolbarHeader: React.FC<ToolbarHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExportModal,
  onQuickExportTransparent,
  onQuickExportSvg,
  onResetView,
  isExporting
}) => {
  return (
    <header className="h-14 border-b border-[#22242a] bg-[#111215] flex items-center justify-between px-5 select-none z-30 shrink-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"></span>
          InkBleed Studio
        </span>
        <span className="text-xs text-neutral-500 font-mono hidden sm:inline">v2.6</span>
      </div>

      {/* Zone 2: 4 clean text navigation links / panels */}
      <nav className="flex items-center gap-1 bg-[#18191e] p-1 rounded-lg border border-[#262830]">
        <button
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'typography'
              ? 'bg-[#2b2d35] text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Tipografia</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'presets'
              ? 'bg-[#2b2d35] text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>

        <button
          onClick={() => setActiveTab('ink')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'ink'
              ? 'bg-[#2b2d35] text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Ink Bleed</span>
        </button>

        <button
          onClick={() => setActiveTab('paper')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'paper'
              ? 'bg-[#2b2d35] text-white shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Papel & Textura</span>
        </button>
      </nav>

      {/* Zone 3: Primary actions & export */}
      <div className="flex items-center gap-2">
        <button
          onClick={onResetView}
          title="Centralizar e ajustar tela"
          className="p-2 text-neutral-400 hover:text-white hover:bg-[#1e2026] rounded-md transition-colors text-xs"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={onQuickExportSvg}
          title="Exportar vetor SVG"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-[#1a1c22] hover:bg-[#252830] border border-[#282a33] rounded-lg transition-colors whitespace-nowrap"
        >
          <FileCode2 className="w-3.5 h-3.5 text-neutral-400" />
          <span>SVG</span>
        </button>

        <button
          onClick={onQuickExportTransparent}
          title="Exportar PNG transparente imediato"
          disabled={isExporting}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-[#1e2129] hover:bg-[#282c37] border border-[#2f323e] rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-neutral-300" />
          <span>PNG Transparente</span>
        </button>

        <button
          onClick={onOpenExportModal}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-black bg-white hover:bg-neutral-200 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98] disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar 4K</span>
        </button>
      </div>
    </header>
  );
};
