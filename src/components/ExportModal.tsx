import React, { useState } from 'react';
import {
  Download,
  X,
  FileImage,
  FileCode2,
  Video,
  Check,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  InkBleedSettings,
  PaperSettings,
  TypographySettings,
  AnimationSettings
} from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  typography: TypographySettings;
  ink: InkBleedSettings;
  paper: PaperSettings;
  anim: AnimationSettings;
  onExportPng: (scale: 1 | 2 | 4, transparent: boolean) => Promise<void>;
  onExportSvg: (transparent: boolean) => void;
  onRecordVideo: () => void;
  isExporting: boolean;
  isRecordingVideo: boolean;
  recordingProgress: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  typography,
  ink,
  paper,
  anim,
  onExportPng,
  onExportSvg,
  onRecordVideo,
  isExporting,
  isRecordingVideo,
  recordingProgress
}) => {
  const [scale, setScale] = useState<1 | 2 | 4>(4);
  const [transparent, setTransparent] = useState<boolean>(paper.paperType === 'transparent');
  const [exportFormat, setExportFormat] = useState<'png' | 'svg' | 'video'>('png');

  if (!isOpen) return null;

  const getDimensions = (s: number) => `${1200 * s} × ${900 * s} px`;

  const handleExport = async () => {
    if (exportFormat === 'png') {
      await onExportPng(scale, transparent);
      onClose();
    } else if (exportFormat === 'svg') {
      onExportSvg(transparent);
      onClose();
    } else if (exportFormat === 'video') {
      onRecordVideo();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#141519] border border-[#2a2c35] rounded-2xl shadow-2xl overflow-hidden text-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#22242a]">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-white" />
            <h2 className="text-sm font-semibold text-white">Exportar Arte em Alta Resolução</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Format selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Formato de Exportação
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setExportFormat('png')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  exportFormat === 'png'
                    ? 'bg-[#252733] border-white/40 text-white'
                    : 'bg-[#181920] border-[#252731] hover:bg-[#1e2028] text-neutral-400'
                }`}
              >
                <FileImage className="w-5 h-5" />
                <span className="text-xs font-semibold">PNG Raster</span>
                <span className="text-[10px] text-neutral-500">Até 4K 300 DPI</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('svg')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  exportFormat === 'svg'
                    ? 'bg-[#252733] border-white/40 text-white'
                    : 'bg-[#181920] border-[#252731] hover:bg-[#1e2028] text-neutral-400'
                }`}
              >
                <FileCode2 className="w-5 h-5" />
                <span className="text-xs font-semibold">Vetor SVG</span>
                <span className="text-[10px] text-neutral-500">Escala Infinita</span>
              </button>

              <button
                type="button"
                onClick={() => setExportFormat('video')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  exportFormat === 'video'
                    ? 'bg-[#252733] border-white/40 text-white'
                    : 'bg-[#181920] border-[#252731] hover:bg-[#1e2028] text-neutral-400'
                }`}
              >
                <Video className="w-5 h-5 text-red-400" />
                <span className="text-xs font-semibold">Vídeo WebM</span>
                <span className="text-[10px] text-neutral-500">Animação 60 FPS</span>
              </button>
            </div>
          </div>

          {/* Scale Resolution (for PNG) */}
          {exportFormat === 'png' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Resolução & Escala
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 1 as const, label: '1x Web', desc: getDimensions(1) },
                  { value: 2 as const, label: '2x Retina', desc: getDimensions(2) },
                  { value: 4 as const, label: '4x Ultra HD', desc: `${getDimensions(4)} · 300 DPI` }
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setScale(item.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      scale === item.value
                        ? 'bg-[#252733] border-neutral-300 text-white'
                        : 'bg-[#181920] border-[#252731] hover:bg-[#1e2028] text-neutral-400'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Background Options */}
          {exportFormat !== 'video' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Plano de Fundo
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTransparent(true)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    transparent
                      ? 'bg-[#252733] border-neutral-300 text-white'
                      : 'bg-[#181920] border-[#252731] hover:bg-[#1e2028] text-neutral-400'
                  }`}
                >
                  <div className="w-5 h-5 rounded border border-neutral-600 bg-checkered shrink-0" />
                  <div>
                    <div className="text-xs font-medium">Fundo Transparente</div>
                    <div className="text-[10px] text-neutral-500">Canal Alpha puro</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTransparent(false)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 ${
                    !transparent
                      ? 'bg-[#252733] border-neutral-300 text-white'
                      : 'bg-[#181920] border-[#252731] hover:bg-[#1e2028] text-neutral-400'
                  }`}
                >
                  <Layers className="w-5 h-5 text-neutral-300 shrink-0" />
                  <div>
                    <div className="text-xs font-medium">Papel Envelhecido</div>
                    <div className="text-[10px] text-neutral-500">Com vincos e textura</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Video summary */}
          {exportFormat === 'video' && (
            <div className="p-3 bg-[#181920] rounded-xl border border-[#252731] text-xs text-neutral-400 space-y-1">
              <div className="text-white font-medium">Renderização de Animação Fluida</div>
              <p>
                Gera um vídeo WebM em 60 FPS com a dispersão orgânica da tinta acontecendo quadro a
                quadro.
              </p>
              <div className="text-[11px] text-neutral-500 pt-1">
                Duração: {anim.duration}s · Modo: {anim.mode} · 1280 × 720 HD
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-[#101114] border-t border-[#22242a]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting || isRecordingVideo}
            className="flex items-center gap-2 px-5 py-2 text-xs font-medium text-black bg-white hover:bg-neutral-200 rounded-lg shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {isExporting
                ? 'Exportando...'
                : isRecordingVideo
                ? `Gravando ${recordingProgress}%`
                : 'Iniciar Download'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
