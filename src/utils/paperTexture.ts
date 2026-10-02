import { PaperSettings } from '../types';

/**
 * Procedural paper texture renderer: Clean, smooth vintage archival paper
 * with soft tone wash, natural pulp fibers, and delicate edge aging.
 * Free of artificial crease or fold lines.
 */
export function drawPaperBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  paper: PaperSettings,
  seed = 42
): void {
  if (paper.paperType === 'transparent') {
    ctx.clearRect(0, 0, width, height);
    return;
  }

  ctx.save();

  // 1. Base color fill
  let baseHex = paper.baseColor;
  if (!baseHex) {
    switch (paper.paperType) {
      case 'newspaper-vintage':
        baseHex = '#e8e5dc';
        break;
      case 'aged-parchment':
        baseHex = '#ebdcb9';
        break;
      case 'kraft':
        baseHex = '#d8c5a8';
        break;
      case 'cotton-fine-art':
        baseHex = '#f6f4ef';
        break;
      case 'photostat-dark':
        baseHex = '#141416';
        break;
      default:
        baseHex = '#f0eee9';
    }
  }

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, width, height);

  // 2. Vintage aging sepia / tone wash
  if (paper.agingSepia > 0 && paper.paperType !== 'photostat-dark') {
    const sepiaAlpha = (paper.agingSepia / 100) * 0.22;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, `rgba(180, 130, 70, ${sepiaAlpha * 0.6})`);
    grad.addColorStop(0.5, `rgba(140, 95, 45, ${sepiaAlpha})`);
    grad.addColorStop(1, `rgba(195, 145, 80, ${sepiaAlpha * 0.7})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Tactile paper pulp fiber grain (natural micro-texture)
  if (paper.fiberGrain > 0) {
    const grainStrength = (paper.fiberGrain / 100) * 0.14;
    drawPaperFiberNoise(ctx, width, height, grainStrength, seed, paper.paperType === 'photostat-dark');
  }

  // 4. Subtle edge vignette / vintage burning
  if (paper.vignette > 0) {
    const vigStrength = (paper.vignette / 100) * 0.4;
    const radius = Math.max(width, height) * 0.75;
    const radial = ctx.createRadialGradient(
      width / 2,
      height / 2,
      radius * 0.45,
      width / 2,
      height / 2,
      radius
    );

    if (paper.paperType === 'photostat-dark') {
      radial.addColorStop(0, 'rgba(0, 0, 0, 0)');
      radial.addColorStop(1, `rgba(0, 0, 0, ${vigStrength * 0.7})`);
    } else {
      radial.addColorStop(0, 'rgba(60, 40, 20, 0)');
      radial.addColorStop(0.75, `rgba(70, 45, 20, ${vigStrength * 0.3})`);
      radial.addColorStop(1, `rgba(45, 25, 10, ${vigStrength})`);
    }

    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);
  }

  ctx.restore();
}

/**
 * Adds high-frequency paper grain and speckles
 */
function drawPaperFiberNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number,
  seed: number,
  isDark: boolean
): void {
  const tileSize = 256;
  const offscreen = document.createElement('canvas');
  offscreen.width = tileSize;
  offscreen.height = tileSize;
  const offCtx = offscreen.getContext('2d');
  if (!offCtx) return;

  const imgData = offCtx.createImageData(tileSize, tileSize);
  const data = imgData.data;

  let s = seed || 77;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const alphaScale = intensity * 255;
  for (let i = 0; i < data.length; i += 4) {
    const val = rand();
    if (isDark) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = val > 0.88 ? Math.floor(rand() * alphaScale) : 0;
    } else {
      data[i] = 30;
      data[i + 1] = 20;
      data[i + 2] = 15;
      data[i + 3] = val > 0.85 ? Math.floor(rand() * alphaScale) : 0;
    }
  }

  offCtx.putImageData(imgData, 0, 0);

  ctx.save();
  const pattern = ctx.createPattern(offscreen, 'repeat');
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.restore();
}
