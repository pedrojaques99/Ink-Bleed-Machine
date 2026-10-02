/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  InkBleedSettings,
  PaperSettings,
  TypographySettings,
  AnimationSettings,
  Preset
} from './types';
import { PRESETS } from './utils/presets';
import { loadGoogleFont } from './utils/googleFonts';
import {
  exportHighResPng,
  exportSvgFile,
  recordAnimationVideo
} from './utils/exportEngine';
import { ToolbarHeader } from './components/ToolbarHeader';
import { CanvasViewport } from './components/CanvasViewport';
import { SidebarLeft } from './components/SidebarLeft';
import { SidebarRight } from './components/SidebarRight';
import { AnimationTimeline } from './components/AnimationTimeline';
import { ExportModal } from './components/ExportModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  // Master state initialized with the iconic "Old Ink 1920" preset (matching user image 2)
  const defaultPreset = PRESETS[0]; // Old Ink Vintage

  const [typography, setTypography] = useState<TypographySettings>(defaultPreset.typography);
  const [ink, setInk] = useState<InkBleedSettings>(defaultPreset.ink);
  const [paper, setPaper] = useState<PaperSettings>(defaultPreset.paper);
  const [anim, setAnim] = useState<AnimationSettings>({
    isPlaying: false,
    progress: 0.85, // Show beautifully saturated ink spread by default
    duration: 3.5,
    mode: 'bleed-in',
    loop: true,
    speed: 1.0
  });

  const [activeTab, setActiveTab] = useState<'typography' | 'presets' | 'ink' | 'paper'>('ink');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resetViewTrigger, setResetViewTrigger] = useState(0);

  // Show temporary toast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  }, []);

  // Pre-load default preset font
  useEffect(() => {
    loadGoogleFont(typography.fontFamily);
  }, [typography.fontFamily]);

  // Animation frame loop
  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!anim.isPlaying) {
      lastTimeRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setAnim((prev) => {
        if (!prev.isPlaying) return prev;
        const step = (delta / prev.duration) * prev.speed;
        let newProgress = prev.progress + step;

        if (newProgress >= 1.0) {
          if (prev.loop) {
            newProgress = newProgress % 1.0;
          } else {
            return { ...prev, progress: 1.0, isPlaying: false };
          }
        }

        return { ...prev, progress: newProgress };
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [anim.isPlaying, anim.duration, anim.speed, anim.loop]);

  // Apply a preset
  const handleApplyPreset = (preset: Preset) => {
    loadGoogleFont(preset.typography.fontFamily);
    setTypography(preset.typography);
    setInk(preset.ink);
    setPaper(preset.paper);
    showToast(`Preset "${preset.name}" aplicado!`);
  };

  // Keyboard shortcut listener (Spacebar for play/pause, Cmd+E for export)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setAnim((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Export handlers
  const handleExportPng = async (scale: 1 | 2 | 4, transparent: boolean) => {
    try {
      setIsExporting(true);
      await exportHighResPng(typography, ink, paper, anim, {
        scale,
        transparent,
        baseWidth: 1200,
        baseHeight: 900
      });
      showToast(`Exportação PNG ${scale}x (${transparent ? 'Transparente' : 'Papel'}) concluída!`);
    } catch (err) {
      console.error('Export error:', err);
      showToast('Erro ao exportar imagem.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExportTransparent = async () => {
    try {
      setIsExporting(true);
      await exportHighResPng(typography, ink, paper, anim, {
        scale: 4,
        transparent: true,
        baseWidth: 1200,
        baseHeight: 900
      });
      showToast('PNG Transparente 4K (4800x3600) exportado!');
    } catch (err) {
      console.error(err);
      showToast('Erro ao exportar PNG transparente.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSvg = (transparent: boolean) => {
    try {
      exportSvgFile(typography, ink, paper, anim, transparent);
      showToast('Arquivo SVG vetorial exportado!');
    } catch (err) {
      console.error(err);
      showToast('Erro ao exportar SVG.');
    }
  };

  const handleRecordVideo = async () => {
    try {
      setIsRecordingVideo(true);
      setRecordingProgress(0);
      await recordAnimationVideo(typography, ink, paper, anim, (progress) => {
        setRecordingProgress(progress);
      });
      showToast('Vídeo WebM da animação gravado e pronto!');
    } catch (err) {
      console.error('Video recording error:', err);
      showToast('Erro ao gravar vídeo da animação.');
    } finally {
      setIsRecordingVideo(false);
      setRecordingProgress(0);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0c0d0e] text-[#ededed] font-sans antialiased">
      {/* Apple-grade Minimalist Top Header */}
      <ToolbarHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onQuickExportTransparent={handleQuickExportTransparent}
        onQuickExportSvg={() => handleExportSvg(paper.paperType === 'transparent')}
        onResetView={() => setResetViewTrigger((n) => n + 1)}
        isExporting={isExporting}
      />

      {/* Main Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Typography & Presets */}
        <SidebarLeft
          typography={typography}
          setTypography={setTypography}
          onApplyPreset={handleApplyPreset}
          activeTab={activeTab}
        />

        {/* Central Canvas Viewport */}
        <CanvasViewport
          typography={typography}
          ink={ink}
          paper={paper}
          anim={anim}
          setAnimProgress={(p) => setAnim((prev) => ({ ...prev, progress: p }))}
          resetTrigger={resetViewTrigger}
        />

        {/* Right Sidebar: Ink Bleed & Paper Parameters */}
        <SidebarRight
          ink={ink}
          setInk={setInk}
          paper={paper}
          setPaper={setPaper}
          activeTab={activeTab}
        />
      </div>

      {/* Bottom Animation Dock / Timeline */}
      <AnimationTimeline
        anim={anim}
        setAnim={setAnim}
        onRecordVideo={handleRecordVideo}
        isRecording={isRecordingVideo}
        recordingProgress={recordingProgress}
      />

      {/* High-Resolution Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        typography={typography}
        ink={ink}
        paper={paper}
        anim={anim}
        onExportPng={handleExportPng}
        onExportSvg={handleExportSvg}
        onRecordVideo={handleRecordVideo}
        isExporting={isExporting}
        isRecordingVideo={isRecordingVideo}
        recordingProgress={recordingProgress}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#191a21]/95 border border-[#2e313d] text-white px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
