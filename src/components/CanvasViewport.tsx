import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  InkBleedSettings,
  PaperSettings,
  TypographySettings,
  AnimationSettings
} from '../types';
import { drawPaperBackground } from '../utils/paperTexture';
import { computeFilterParams, buildSvgFilterMarkup } from '../utils/inkBleedEngine';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Grid } from 'lucide-react';

interface CanvasViewportProps {
  typography: TypographySettings;
  ink: InkBleedSettings;
  paper: PaperSettings;
  anim: AnimationSettings;
  setAnimProgress: (p: number) => void;
  resetTrigger?: number;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  typography,
  ink,
  paper,
  anim,
  resetTrigger = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const paperCanvasRef = useRef<HTMLCanvasElement>(null);

  // Viewport navigation
  const [zoom, setZoom] = useState<number>(0.85);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(false);

  const canvasWidth = 1200;
  const canvasHeight = 900;

  // Compute live SVG filter parameters
  const filterParams = useMemo(() => {
    return computeFilterParams(ink, anim, 'viewport-ink-bleed');
  }, [ink, anim]);

  // Redraw procedural paper background whenever paper settings change
  useEffect(() => {
    const canvas = paperCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawPaperBackground(ctx, canvasWidth, canvasHeight, paper, 42);
  }, [paper, canvasWidth, canvasHeight]);

  // Reset viewport zoom/pan to center
  const resetView = () => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const scaleX = (clientWidth - 80) / canvasWidth;
    const scaleY = (clientHeight - 120) / canvasHeight;
    const initialScale = Math.min(scaleX, scaleY, 0.95);
    setZoom(initialScale);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    resetView();
  }, [resetTrigger]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan on middle button or spacebar/left click drag on empty background
    if (e.button === 1 || e.button === 0) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prev) => Math.min(3.0, Math.max(0.2, prev * zoomFactor)));
  };

  // Split lines for SVG rendering
  const lines = typography.text.split('\n');
  const fontSize = typography.fontSize;
  const lineHeight = fontSize * typography.lineHeight;
  const totalHeight = lines.length * lineHeight;
  const startY = (canvasHeight - totalHeight) / 2 + fontSize * 0.82;

  let textAnchor: 'start' | 'middle' | 'end' = 'middle';
  let posX = canvasWidth / 2;
  if (typography.textAlign === 'left') {
    textAnchor = 'start';
    posX = canvasWidth * 0.12;
  } else if (typography.textAlign === 'right') {
    textAnchor = 'end';
    posX = canvasWidth * 0.88;
  }

  const isTransparent = paper.paperType === 'transparent';

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative flex-1 h-full overflow-hidden select-none cursor-${
        isPanning ? 'grabbing' : 'default'
      } ${isTransparent || showGrid ? 'bg-checkered' : 'bg-[#0e0f12]'}`}
    >
      {/* Dynamic SVG Filter Definitions with Solid Core Preservation */}
      <svg
        className="absolute w-0 h-0 pointer-events-none"
        aria-hidden="true"
        dangerouslySetInnerHTML={{
          __html: `<defs>${buildSvgFilterMarkup(filterParams)}</defs>`
        }}
      />

      {/* Canvas Workbench Transform Frame */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        <div
          className={`relative pointer-events-auto transition-shadow duration-300 ${
            isTransparent
              ? 'shadow-2xl border border-white/10'
              : 'shadow-[0_25px_60px_rgba(0,0,0,0.65)]'
          }`}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`
          }}
        >
          {/* Background: Procedural Paper or Transparent Checkers */}
          <canvas
            ref={paperCanvasRef}
            width={canvasWidth}
            height={canvasHeight}
            className={`absolute inset-0 w-full h-full pointer-events-none ${
              isTransparent ? 'hidden' : 'block'
            }`}
          />

          {/* SVG Ink Bleed Typography Layer */}
          <svg
            width={canvasWidth}
            height={canvasHeight}
            viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <g filter="url(#viewport-ink-bleed)">
              {lines.map((line, idx) => {
                const y = startY + idx * lineHeight;
                return (
                  <text
                    key={idx}
                    x={posX}
                    y={y}
                    textAnchor={textAnchor}
                    fontFamily={`'${typography.fontFamily}', sans-serif`}
                    fontSize={`${fontSize}px`}
                    fontWeight={typography.fontWeight}
                    letterSpacing={`${typography.letterSpacing}px`}
                    fill={ink.inkColor}
                    opacity={ink.inkOpacity / 100}
                    style={{
                      textTransform: typography.uppercase ? 'uppercase' : 'none'
                    }}
                  >
                    {typography.uppercase ? line.toUpperCase() : line}
                  </text>
                );
              })}
            </g>
          </svg>
        </div>
      </div>

      {/* Floating Viewport HUD Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#141519]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#252730] shadow-lg text-xs text-neutral-300">
        <span className="font-mono text-neutral-400 font-medium mr-1.5">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom((z) => Math.min(3.0, z * 1.15))}
          title="Zoom In"
          className="p-1 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setZoom((z) => Math.max(0.2, z / 1.15))}
          title="Zoom Out"
          className="p-1 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={resetView}
          title="Ajustar à tela"
          className="p-1 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-3.5 bg-neutral-700 mx-1"></div>

        <button
          onClick={() => setShowGrid((g) => !g)}
          title="Alternar quadriculado de transparência"
          className={`p-1 rounded-md transition-colors ${
            showGrid ? 'text-white bg-white/20' : 'hover:text-white hover:bg-white/10'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Resolution & Paper Type indicator */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#141519]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#252730] shadow-lg text-xs text-neutral-400">
        <span className="font-mono text-neutral-300">1200 × 900</span>
        <span className="text-neutral-600">·</span>
        <span className="capitalize text-neutral-300">
          {paper.paperType.replace('-', ' ')}
        </span>
        <span className="text-neutral-600">·</span>
        <span className="text-neutral-300 font-medium">300 DPI Export</span>
      </div>
    </div>
  );
};
