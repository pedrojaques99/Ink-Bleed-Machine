import React from 'react';
import {
  InkBleedSettings,
  PaperSettings,
  PaperType
} from '../types';
import {
  Sliders,
  Layers,
  Palette,
  ShieldCheck
} from 'lucide-react';

interface SidebarRightProps {
  ink: InkBleedSettings;
  setInk: React.Dispatch<React.SetStateAction<InkBleedSettings>>;
  paper: PaperSettings;
  setPaper: React.Dispatch<React.SetStateAction<PaperSettings>>;
  activeTab: 'typography' | 'presets' | 'ink' | 'paper';
}

const INK_PALETTE = [
  { name: 'Carbon Black', hex: '#0a0a0c' },
  { name: 'Dark Ink 1920', hex: '#171719' },
  { name: 'Vintage Sepia', hex: '#261b14' },
  { name: 'Risograph Blue', hex: '#0c2461' },
  { name: 'Vermillion Red', hex: '#942521' },
  { name: 'Forest Green', hex: '#163622' },
  { name: 'Bleached White', hex: '#f4f4f0' }
];

const PAPER_PRESETS: { type: PaperType; label: string; desc: string; color: string }[] = [
  {
    type: 'newspaper-vintage',
    label: 'Jornal Vintage Liso',
    desc: 'Papel liso com tom natural de imprensa antiga, sem vincos',
    color: '#e5e1d5'
  },
  {
    type: 'aged-parchment',
    label: 'Pergaminho Antigo',
    desc: 'Amarelecimento suave e pátina homogênea',
    color: '#ebdcb9'
  },
  {
    type: 'kraft',
    label: 'Papel Kraft Rústico',
    desc: 'Fibras recicladas marrons e textura suave',
    color: '#d8c5a8'
  },
  {
    type: 'cotton-fine-art',
    label: 'Algodão Fine Art',
    desc: 'Papel nobre fosco de gravura e letterpress',
    color: '#f6f4ef'
  },
  {
    type: 'photostat-dark',
    label: 'Photostat Escuro',
    desc: 'Negativo escuro de laboratório com tinta branca',
    color: '#141416'
  },
  {
    type: 'transparent',
    label: 'Fundo Transparente',
    desc: 'Canal alpha puro sem fundo para estamparia e design',
    color: 'transparent'
  }
];

export const SidebarRight: React.FC<SidebarRightProps> = ({
  ink,
  setInk,
  paper,
  setPaper,
  activeTab
}) => {
  if (activeTab !== 'ink' && activeTab !== 'paper') {
    return null;
  }

  return (
    <aside className="w-80 border-l border-[#22242a] bg-[#141519] flex flex-col h-full select-none z-10 shrink-0">
      {/* Tab: Ink Bleed Parameters */}
      {activeTab === 'ink' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="pb-2 border-b border-[#23252d]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Controles de Ink Bleed</span>
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Ajuste fino de dispersão capilar nas bordas e densidade da impressão.
            </p>
          </div>

          {/* Core Fill Density (User requested: keep letters filled and dense!) */}
          <div className="space-y-1 bg-[#1a1b22] p-2.5 rounded-xl border border-[#2b2d37]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Preenchimento do Miolo</span>
              </span>
              <span className="font-mono text-emerald-400 text-[11px] font-semibold">
                {ink.coreFillDensity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ink.coreFillDensity}
              onChange={(e) =>
                setInk((prev) => ({ ...prev, coreFillDensity: parseInt(e.target.value) }))
              }
              className="w-full accent-emerald-400"
            />
            <span className="text-[10px] text-neutral-400 block leading-tight">
              Mantém o interior das letras 100% sólido e denso, com o sangramento de tinta ocorrendo
              apenas nas bordas.
            </span>
          </div>

          {/* Bleed Spread */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300">Expansão da Borda (Bleed Spread)</span>
              <span className="font-mono text-neutral-400 text-[11px]">{ink.bleedSpread}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ink.bleedSpread}
              onChange={(e) => setInk((prev) => ({ ...prev, bleedSpread: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Roughness / Edge Distortion */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300">Distorção & Rugosidade da Borda</span>
              <span className="font-mono text-neutral-400 text-[11px]">{ink.roughness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ink.roughness}
              onChange={(e) => setInk((prev) => ({ ...prev, roughness: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Subtle Edge Erosion (Controlled, non-hollow) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300">Micro-desgaste de Borda</span>
              <span className="font-mono text-neutral-400 text-[11px]">{ink.inkErosion}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ink.inkErosion}
              onChange={(e) => setInk((prev) => ({ ...prev, inkErosion: parseInt(e.target.value) }))}
              className="w-full"
            />
            <span className="text-[10px] text-neutral-500 block">
              Desgaste pontual nas margens da letra, sem esvaziar o corpo da impressão.
            </span>
          </div>

          {/* Capillary Branches Frequency */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300">Frequência Capilar</span>
              <span className="font-mono text-neutral-400 text-[11px]">
                {(ink.frequency * 1000).toFixed(0)}
              </span>
            </div>
            <input
              type="range"
              min="0.008"
              max="0.08"
              step="0.002"
              value={ink.frequency}
              onChange={(e) => setInk((prev) => ({ ...prev, frequency: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Edge Feathering */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300">Suavidade da Borda (Feather)</span>
              <span className="font-mono text-neutral-400 text-[11px]">{ink.edgeFeather}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ink.edgeFeather}
              onChange={(e) => setInk((prev) => ({ ...prev, edgeFeather: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Toner Grit / Fiber Stippling */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300">Grão Fino de Impressão</span>
              <span className="font-mono text-neutral-400 text-[11px]">{ink.tonerGrit}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ink.tonerGrit}
              onChange={(e) => setInk((prev) => ({ ...prev, tonerGrit: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Directional Capillary Streaks */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-300">Estrias nas Fibras</span>
              <span className="font-mono text-neutral-400 text-[11px]">{ink.capillaryStreaks}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ink.capillaryStreaks}
              onChange={(e) =>
                setInk((prev) => ({ ...prev, capillaryStreaks: parseInt(e.target.value) }))
              }
              className="w-full"
            />
          </div>

          {/* Ink Color Selector */}
          <div className="space-y-2 pt-3 border-t border-[#23252d]">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block">
              Cor da Tinta
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {INK_PALETTE.map((item) => {
                const isSelected = ink.inkColor.toLowerCase() === item.hex.toLowerCase();
                return (
                  <button
                    key={item.name}
                    onClick={() => setInk((prev) => ({ ...prev, inkColor: item.hex }))}
                    title={item.name}
                    className={`w-7 h-7 rounded-full border transition-transform ${
                      isSelected
                        ? 'border-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                        : 'border-[#33353e] hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.hex }}
                  />
                );
              })}
              <div className="relative flex items-center ml-1">
                <input
                  type="color"
                  value={ink.inkColor}
                  onChange={(e) => setInk((prev) => ({ ...prev, inkColor: e.target.value }))}
                  className="w-7 h-7 rounded-full overflow-hidden border border-[#33353e] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Paper & Aging */}
      {activeTab === 'paper' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="pb-2 border-b border-[#23252d]">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Papel & Envelhecimento</span>
            </h2>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Texturas suaves com pátina homogênea, fibras naturais e fundo transparente.
            </p>
          </div>

          {/* Paper Stock Cards */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-300">Tipo de Papel</label>
            <div className="grid grid-cols-1 gap-1.5">
              {PAPER_PRESETS.map((preset) => {
                const isSelected = paper.paperType === preset.type;
                return (
                  <button
                    key={preset.type}
                    onClick={() =>
                      setPaper((prev) => ({
                        ...prev,
                        paperType: preset.type,
                        baseColor: preset.color !== 'transparent' ? preset.color : prev.baseColor
                      }))
                    }
                    className={`p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-[#282a35] border-neutral-400 text-white shadow-sm'
                        : 'bg-[#181920] border-[#252731] hover:bg-[#1e2028] text-neutral-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded border border-neutral-700 shrink-0 ${
                        preset.type === 'transparent' ? 'bg-checkered' : ''
                      }`}
                      style={{
                        backgroundColor: preset.type === 'transparent' ? undefined : preset.color
                      }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-white leading-tight">
                        {preset.label}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5 leading-normal">
                        {preset.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sliders for Aging (Without Creases) */}
          {paper.paperType !== 'transparent' && (
            <div className="space-y-4 pt-3 border-t border-[#23252d]">
              {/* Aging Sepia */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300">Oxidação & Amarelamento Sépia</span>
                  <span className="font-mono text-neutral-400 text-[11px]">
                    {paper.agingSepia}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={paper.agingSepia}
                  onChange={(e) =>
                    setPaper((prev) => ({ ...prev, agingSepia: parseInt(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              {/* Fiber Grain */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300">Fibras & Grão de Polpa</span>
                  <span className="font-mono text-neutral-400 text-[11px]">
                    {paper.fiberGrain}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={paper.fiberGrain}
                  onChange={(e) =>
                    setPaper((prev) => ({ ...prev, fiberGrain: parseInt(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>

              {/* Vignette */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-300">Vinheta & Queima de Borda</span>
                  <span className="font-mono text-neutral-400 text-[11px]">{paper.vignette}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={paper.vignette}
                  onChange={(e) =>
                    setPaper((prev) => ({ ...prev, vignette: parseInt(e.target.value) }))
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
