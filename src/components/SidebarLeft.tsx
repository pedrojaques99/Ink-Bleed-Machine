import React, { useState } from 'react';
import {
  TypographySettings,
  InkBleedSettings,
  PaperSettings,
  Preset
} from '../types';
import { POPULAR_GOOGLE_FONTS, loadGoogleFont } from '../utils/googleFonts';
import { PRESETS } from '../utils/presets';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Search,
  Check,
  Sparkles,
  Type,
  Plus
} from 'lucide-react';

interface SidebarLeftProps {
  typography: TypographySettings;
  setTypography: React.Dispatch<React.SetStateAction<TypographySettings>>;
  onApplyPreset: (preset: Preset) => void;
  activeTab: 'typography' | 'presets' | 'ink' | 'paper';
}

export const SidebarLeft: React.FC<SidebarLeftProps> = ({
  typography,
  setTypography,
  onApplyPreset,
  activeTab
}) => {
  const [fontSearch, setFontSearch] = useState('');
  const [fontCategory, setFontCategory] = useState<string>('All');
  const [customFontInput, setCustomFontInput] = useState('');
  const [isLoadingCustomFont, setIsLoadingCustomFont] = useState(false);

  // Filter fonts
  const filteredFonts = POPULAR_GOOGLE_FONTS.filter((font) => {
    const matchesSearch = font.family.toLowerCase().includes(fontSearch.toLowerCase());
    const matchesCat = fontCategory === 'All' || font.category === fontCategory;
    return matchesSearch && matchesCat;
  });

  const handleSelectFont = async (family: string) => {
    await loadGoogleFont(family);
    setTypography((prev) => ({ ...prev, fontFamily: family }));
  };

  const handleLoadCustomFont = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFontInput.trim()) return;

    setIsLoadingCustomFont(true);
    const success = await loadGoogleFont(customFontInput.trim());
    setIsLoadingCustomFont(false);

    if (success) {
      setTypography((prev) => ({ ...prev, fontFamily: customFontInput.trim() }));
      setCustomFontInput('');
    }
  };

  const categories = ['All', 'Brutalist', 'Vintage', 'Serif', 'Monospace', 'Gothic', 'Display'];

  if (activeTab !== 'typography' && activeTab !== 'presets') {
    return null;
  }

  return (
    <aside className="w-80 border-r border-[#22242a] bg-[#141519] flex flex-col h-full select-none z-10 shrink-0">
      {/* Tab Content: Typography */}
      {activeTab === 'typography' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Header */}
          <div className="pb-2 border-b border-[#23252d]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Conteúdo & Tipografia
            </h2>
          </div>

          {/* Text input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Texto</label>
            <textarea
              rows={3}
              value={typography.text}
              onChange={(e) => setTypography((prev) => ({ ...prev, text: e.target.value }))}
              placeholder="Digite o texto aqui..."
              className="w-full bg-[#1b1c23] border border-[#2b2d37] rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-neutral-400 resize-none font-sans"
            />
          </div>

          {/* Align, Uppercase & Weight */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-neutral-400 mb-1 block">
                Alinhamento
              </label>
              <div className="flex bg-[#1b1c23] p-1 rounded-lg border border-[#2b2d37]">
                <button
                  type="button"
                  onClick={() => setTypography((prev) => ({ ...prev, textAlign: 'left' }))}
                  className={`flex-1 py-1 flex items-center justify-center rounded transition-colors ${
                    typography.textAlign === 'left' ? 'bg-[#2f313c] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTypography((prev) => ({ ...prev, textAlign: 'center' }))}
                  className={`flex-1 py-1 flex items-center justify-center rounded transition-colors ${
                    typography.textAlign === 'center' ? 'bg-[#2f313c] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTypography((prev) => ({ ...prev, textAlign: 'right' }))}
                  className={`flex-1 py-1 flex items-center justify-center rounded transition-colors ${
                    typography.textAlign === 'right' ? 'bg-[#2f313c] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-neutral-400 mb-1 block">
                Estilo
              </label>
              <button
                type="button"
                onClick={() => setTypography((prev) => ({ ...prev, uppercase: !prev.uppercase }))}
                className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                  typography.uppercase
                    ? 'bg-[#2f313c] text-white border-neutral-600'
                    : 'bg-[#1b1c23] text-neutral-400 border-[#2b2d37] hover:text-white'
                }`}
              >
                MAIÚSCULAS
              </button>
            </div>
          </div>

          {/* Sliders: Size, Tracking, Line Height */}
          <div className="space-y-4 pt-2 border-t border-[#23252d]">
            {/* Font Size */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Tamanho da Fonte</span>
                <span className="font-mono text-neutral-400 text-[11px]">
                  {typography.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="32"
                max="200"
                value={typography.fontSize}
                onChange={(e) =>
                  setTypography((prev) => ({ ...prev, fontSize: parseInt(e.target.value) }))
                }
                className="w-full"
              />
            </div>

            {/* Letter Spacing */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Espaçamento (Tracking)</span>
                <span className="font-mono text-neutral-400 text-[11px]">
                  {typography.letterSpacing}px
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="50"
                value={typography.letterSpacing}
                onChange={(e) =>
                  setTypography((prev) => ({ ...prev, letterSpacing: parseInt(e.target.value) }))
                }
                className="w-full"
              />
            </div>

            {/* Line Height */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-300">Altura da Linha</span>
                <span className="font-mono text-neutral-400 text-[11px]">
                  {typography.lineHeight.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.8"
                step="0.05"
                value={typography.lineHeight}
                onChange={(e) =>
                  setTypography((prev) => ({ ...prev, lineHeight: parseFloat(e.target.value) }))
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Google Fonts Directory */}
          <div className="space-y-3 pt-3 border-t border-[#23252d]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Fontes Google Fonts
              </label>
              <span className="text-[10px] text-neutral-500 font-mono">
                {typography.fontFamily}
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-500" />
              <input
                type="text"
                value={fontSearch}
                onChange={(e) => setFontSearch(e.target.value)}
                placeholder="Buscar fonte..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#1b1c23] border border-[#2b2d37] rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-400"
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFontCategory(cat)}
                  className={`px-2 py-0.5 text-[11px] rounded transition-colors whitespace-nowrap ${
                    fontCategory === cat
                      ? 'bg-neutral-200 text-black font-medium'
                      : 'text-neutral-400 hover:text-white bg-[#1a1c22]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Font cards list */}
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {filteredFonts.map((font) => {
                const isSelected = typography.fontFamily === font.family;
                return (
                  <button
                    key={font.family}
                    onClick={() => handleSelectFont(font.family)}
                    className={`w-full text-left p-2 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#2b2d38] border-neutral-500 text-white'
                        : 'bg-[#181920] border-[#252731] hover:bg-[#20222a] text-neutral-300'
                    }`}
                  >
                    <div>
                      <div
                        className="text-sm font-semibold truncate leading-tight"
                        style={{ fontFamily: `'${font.family}', sans-serif` }}
                      >
                        {font.family}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5 truncate max-w-[200px]">
                        {font.tagline}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Load any Google Font directly */}
            <form onSubmit={handleLoadCustomFont} className="pt-2">
              <label className="text-[11px] text-neutral-400 block mb-1">
                Carregar Qualquer Fonte do Google Fonts
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={customFontInput}
                  onChange={(e) => setCustomFontInput(e.target.value)}
                  placeholder="Ex: Oswald, Cinzel, Rye..."
                  className="flex-1 px-2.5 py-1 text-xs bg-[#1b1c23] border border-[#2b2d37] rounded-lg text-white focus:outline-none focus:border-neutral-400"
                />
                <button
                  type="submit"
                  disabled={isLoadingCustomFont || !customFontInput.trim()}
                  className="px-2.5 py-1 text-xs font-medium bg-neutral-200 text-black hover:bg-white rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isLoadingCustomFont ? '...' : 'Usar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Content: Presets */}
      {activeTab === 'presets' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="pb-2 border-b border-[#23252d]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Coleção de Presets Clássicos
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Estilos inspirados em zines dos anos 90, cópias xerox e papéis antigos.
            </p>
          </div>

          <div className="space-y-3">
            {PRESETS.map((preset) => (
              <div
                key={preset.id}
                onClick={() => onApplyPreset(preset)}
                className="group p-3 rounded-xl bg-[#181920] border border-[#252731] hover:border-neutral-500 hover:bg-[#1e2028] transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {preset.name}
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#272935] text-neutral-300 font-mono">
                    {preset.category}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-[#22242d]">
                  <span>Fonte: {preset.typography.fontFamily}</span>
                  <span className="text-neutral-400 group-hover:text-white flex items-center gap-1">
                    Aplicar Preset →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
