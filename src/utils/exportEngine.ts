import {
  InkBleedSettings,
  PaperSettings,
  TypographySettings,
  AnimationSettings
} from '../types';
import { drawPaperBackground } from './paperTexture';
import { computeFilterParams, buildSvgFilterMarkup } from './inkBleedEngine';

export interface ExportOptions {
  scale: 1 | 2 | 4;
  transparent: boolean;
  baseWidth?: number;
  baseHeight?: number;
}

/**
 * Builds an SVG image containing the text and the ink bleed filter, scaled for the target resolution
 */
export function generateSvgArtwork(
  width: number,
  height: number,
  typography: TypographySettings,
  ink: InkBleedSettings,
  paper: PaperSettings,
  anim: AnimationSettings,
  transparent: boolean
): string {
  const filterParams = computeFilterParams(ink, anim, 'export-ink-bleed');
  const filterMarkup = buildSvgFilterMarkup(filterParams);

  const lines = typography.text.split('\n');
  const fontSize = typography.fontSize;
  const lineHeight = fontSize * typography.lineHeight;
  const totalTextHeight = lines.length * lineHeight;
  const startY = (height - totalTextHeight) / 2 + fontSize * 0.82;

  let textAnchor = 'middle';
  let posX = width / 2;
  if (typography.textAlign === 'left') {
    textAnchor = 'start';
    posX = width * 0.12;
  } else if (typography.textAlign === 'right') {
    textAnchor = 'end';
    posX = width * 0.88;
  }

  const textTransform = typography.uppercase ? 'uppercase' : 'none';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        ${filterMarkup}
      </defs>
      <g filter="url(#export-ink-bleed)">
        ${lines
          .map((line, idx) => {
            const y = startY + idx * lineHeight;
            return `
            <text
              x="${posX}"
              y="${y}"
              text-anchor="${textAnchor}"
              font-family="${typography.fontFamily}, sans-serif"
              font-size="${fontSize}px"
              font-weight="${typography.fontWeight}"
              letter-spacing="${typography.letterSpacing}px"
              fill="${ink.inkColor}"
              opacity="${ink.inkOpacity / 100}"
              text-transform="${textTransform}"
              style="text-transform: ${textTransform};"
            >${escapeXml(typography.uppercase ? line.toUpperCase() : line)}</text>
          `;
          })
          .join('\n')}
      </g>
    </svg>
  `;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Exports high-resolution PNG (up to 4K / 300 DPI print scale)
 */
export async function exportHighResPng(
  typography: TypographySettings,
  ink: InkBleedSettings,
  paper: PaperSettings,
  anim: AnimationSettings,
  options: ExportOptions
): Promise<void> {
  const baseW = options.baseWidth || 1200;
  const baseH = options.baseHeight || 900;
  const targetWidth = baseW * options.scale;
  const targetHeight = baseH * options.scale;

  // Scale typography for export canvas
  const scaledTypography: TypographySettings = {
    ...typography,
    fontSize: typography.fontSize * options.scale,
    letterSpacing: typography.letterSpacing * options.scale
  };

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  // 1. Draw paper background if not transparent
  if (!options.transparent && paper.paperType !== 'transparent') {
    drawPaperBackground(ctx, targetWidth, targetHeight, paper);
  } else {
    ctx.clearRect(0, 0, targetWidth, targetHeight);
  }

  // 2. Render SVG ink bleed text onto canvas
  const svgString = generateSvgArtwork(
    targetWidth,
    targetHeight,
    scaledTypography,
    ink,
    paper,
    anim,
    options.transparent
  );

  await drawSvgToCanvas(ctx, svgString, targetWidth, targetHeight);

  // 3. Trigger download
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const downloadLink = document.createElement('a');
  const filename = `inkbleed-${options.transparent ? 'transparent' : 'print'}-${options.scale}x-${Date.now()}.png`;
  downloadLink.download = filename;
  downloadLink.href = dataUrl;
  downloadLink.click();
}

/**
 * Exports clean scalable SVG with embedded ink bleed filter
 */
export function exportSvgFile(
  typography: TypographySettings,
  ink: InkBleedSettings,
  paper: PaperSettings,
  anim: AnimationSettings,
  transparent = true
): void {
  const width = 1200;
  const height = 900;
  const svgContent = generateSvgArtwork(
    width,
    height,
    typography,
    ink,
    paper,
    anim,
    transparent
  );

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.download = `inkbleed-artwork-${Date.now()}.svg`;
  downloadLink.href = url;
  downloadLink.click();
  URL.revokeObjectURL(url);
}

/**
 * Records fluid ink bleed animation and exports high-definition WebM video
 */
export async function recordAnimationVideo(
  typography: TypographySettings,
  ink: InkBleedSettings,
  paper: PaperSettings,
  anim: AnimationSettings,
  onProgress?: (pct: number) => void
): Promise<void> {
  const width = 1280;
  const height = 720;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  // Video capture stream at 60 FPS
  const stream = canvas.captureStream(60);
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm';
  }

  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 6000000 // 6 Mbps crisp high-definition
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordingFinished = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: mimeType }));
    };
  });

  recorder.start();

  const totalFrames = Math.round(anim.duration * 30); // 30 rendered keyframes for smooth capture
  const frameInterval = (anim.duration * 1000) / totalFrames;

  for (let i = 0; i <= totalFrames; i++) {
    const progress = i / totalFrames;
    if (onProgress) onProgress(Math.round(progress * 100));

    // Render frame
    ctx.clearRect(0, 0, width, height);

    if (paper.paperType !== 'transparent') {
      drawPaperBackground(ctx, width, height, paper, 42);
    }

    const frameAnim: AnimationSettings = {
      ...anim,
      isPlaying: true,
      progress
    };

    const svgString = generateSvgArtwork(
      width,
      height,
      typography,
      ink,
      paper,
      frameAnim,
      paper.paperType === 'transparent'
    );

    await drawSvgToCanvas(ctx, svgString, width, height);
    await new Promise((r) => setTimeout(r, frameInterval / 2));
  }

  recorder.stop();
  const videoBlob = await recordingFinished;

  const videoUrl = URL.createObjectURL(videoBlob);
  const downloadLink = document.createElement('a');
  downloadLink.download = `inkbleed-fluid-animation-${Date.now()}.webm`;
  downloadLink.href = videoUrl;
  downloadLink.click();
  URL.revokeObjectURL(videoUrl);
}

/**
 * Utility to rasterize SVG markup onto a canvas context
 */
function drawSvgToCanvas(
  ctx: CanvasRenderingContext2D,
  svgMarkup: string,
  width: number,
  height: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve();
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}
