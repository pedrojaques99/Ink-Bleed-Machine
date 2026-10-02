import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Video,
  Repeat,
  Sparkles,
  Flame,
  Activity,
  Droplets
} from 'lucide-react';
import { AnimationSettings, AnimationMode } from '../types';

interface AnimationTimelineProps {
  anim: AnimationSettings;
  setAnim: React.Dispatch<React.SetStateAction<AnimationSettings>>;
  onRecordVideo: () => void;
  isRecording: boolean;
  recordingProgress: number;
}

export const AnimationTimeline: React.FC<AnimationTimelineProps> = ({
  anim,
  setAnim,
  onRecordVideo,
  isRecording,
  recordingProgress
}) => {
  const togglePlay = () => {
    setAnim((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAnim((prev) => ({ ...prev, progress: val, isPlaying: false }));
  };

  const setMode = (mode: AnimationMode) => {
    setAnim((prev) => ({ ...prev, mode }));
  };

  const cycleSpeed = () => {
    setAnim((prev) => {
      const nextSpeed = prev.speed === 0.5 ? 1.0 : prev.speed === 1.0 ? 2.0 : 0.5;
      return { ...prev, speed: nextSpeed };
    });
  };

  const currentSeconds = (anim.progress * anim.duration).toFixed(1);
  const totalSeconds = anim.duration.toFixed(1);

  return (
    <footer className="h-16 border-t border-[#22242a] bg-[#111215] flex items-center justify-between px-6 select-none z-20 shrink-0">
      {/* Playhead & Play / Pause controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          title={anim.isPlaying ? 'Pausar (Espaço)' : 'Reproduzir animação (Espaço)'}
          className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-transform active:scale-95 shadow-sm"
        >
          {anim.isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setAnim((prev) => ({ ...prev, progress: 0 }))}
          title="Reiniciar animação"
          className="p-2 text-neutral-400 hover:text-white hover:bg-[#1f2128] rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="font-mono text-xs text-neutral-400 min-w-[70px]">
          <span className="text-white font-medium">{currentSeconds}s</span> / {totalSeconds}s
        </div>
      </div>

      {/* Scrub Slider */}
      <div className="flex-1 max-w-xl mx-6 flex items-center gap-3">
        <span className="text-[11px] text-neutral-500 font-mono">0%</span>
        <div className="relative flex-1 flex items-center">
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={anim.progress}
            onChange={handleScrub}
            className="w-full cursor-pointer accent-white"
          />
        </div>
        <span className="text-[11px] text-neutral-500 font-mono">100%</span>
      </div>

      {/* Animation Modes & Video Export */}
      <div className="flex items-center gap-2">
        {/* Modes */}
        <div className="hidden xl:flex items-center gap-1 bg-[#18191e] p-1 rounded-lg border border-[#262830]">
          <button
            onClick={() => setMode('bleed-in')}
            title="Fluidez de tinta líquida se espalhando"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
              anim.mode === 'bleed-in'
                ? 'bg-[#2b2d35] text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Droplets className="w-3 h-3" />
            <span>Bleed In</span>
          </button>

          <button
            onClick={() => setMode('pulse')}
            title="Pulso orgânico respirando"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
              anim.mode === 'pulse'
                ? 'bg-[#2b2d35] text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Pulse</span>
          </button>

          <button
            onClick={() => setMode('capillary-flow')}
            title="Fluxo capilar contínuo"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
              anim.mode === 'capillary-flow'
                ? 'bg-[#2b2d35] text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Capilar</span>
          </button>

          <button
            onClick={() => setMode('xerox-burn')}
            title="Flicker xerox brutalista"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
              anim.mode === 'xerox-burn'
                ? 'bg-[#2b2d35] text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Xerox</span>
          </button>
        </div>

        {/* Speed toggle */}
        <button
          onClick={cycleSpeed}
          title="Velocidade da animação"
          className="px-2.5 py-1 text-xs font-mono text-neutral-300 hover:text-white bg-[#18191e] border border-[#262830] rounded-lg transition-colors"
        >
          {anim.speed}x
        </button>

        {/* Loop toggle */}
        <button
          onClick={() => setAnim((prev) => ({ ...prev, loop: !prev.loop }))}
          title="Repetir em loop"
          className={`p-2 rounded-lg border transition-colors ${
            anim.loop
              ? 'bg-[#2b2d35] text-white border-neutral-600'
              : 'text-neutral-400 border-[#262830] hover:text-neutral-200 bg-[#18191e]'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
        </button>

        {/* Video recording button */}
        <button
          onClick={onRecordVideo}
          disabled={isRecording}
          title="Gravar e exportar vídeo WebM da animação"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-sm transition-all whitespace-nowrap disabled:opacity-50 active:scale-95"
        >
          <Video className="w-3.5 h-3.5" />
          <span>{isRecording ? `Gravando ${recordingProgress}%` : 'Gravar Vídeo'}</span>
        </button>
      </div>
    </footer>
  );
};
