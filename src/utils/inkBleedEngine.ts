import { InkBleedSettings, AnimationSettings } from '../types';

export interface FilterParams {
  filterId: string;
  displacementScale: number;
  baseFrequency: string;
  numOctaves: number;
  blurStdDev: number;
  alphaMultiplier: number;
  alphaOffset: number;
  seed: number;
  coreFillDensity: number;
  erosionOpacity: number;
  gritOpacity: number;
  gritFrequency: number;
}

/**
 * Computes dynamic SVG filter parameters taking into account current settings and animation progress
 */
export function computeFilterParams(
  ink: InkBleedSettings,
  anim: AnimationSettings,
  filterId = 'ink-bleed-filter'
): FilterParams {
  // Animation modifier calculations
  let animSpreadFactor = 1.0;
  let animRoughnessFactor = 1.0;
  let animFrequencyFactor = 1.0;
  let animSeedOffset = 0;

  if (anim.isPlaying || anim.progress > 0) {
    const t = anim.progress; // 0.0 to 1.0

    switch (anim.mode) {
      case 'bleed-in': {
        // Starts sharp (progress 0) and organically bleeds out to full spread (progress 1)
        animSpreadFactor = 0.05 + 0.95 * Math.pow(t, 0.85);
        animRoughnessFactor = 0.15 + 0.85 * Math.pow(t, 0.7);
        animFrequencyFactor = 1.15 - 0.15 * t;
        animSeedOffset = Math.floor(t * 12);
        break;
      }
      case 'pulse': {
        // Living, breathing organic ink pulsation
        const wave = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
        animSpreadFactor = 0.85 + 0.28 * wave;
        animRoughnessFactor = 0.88 + 0.22 * wave;
        animFrequencyFactor = 0.95 + 0.1 * wave;
        animSeedOffset = Math.floor(t * 4);
        break;
      }
      case 'capillary-flow': {
        // Continuous organic fluid flow / capillary creeping
        animSpreadFactor = 0.9 + 0.18 * Math.sin(t * Math.PI * 4);
        animRoughnessFactor = 1.0 + 0.12 * Math.cos(t * Math.PI * 2);
        animSeedOffset = Math.floor(t * 120);
        break;
      }
      case 'xerox-burn': {
        // Harsh brutalist toner flickering and erosion
        const jitter = (Math.sin(t * 30) + Math.cos(t * 53)) * 0.08;
        animSpreadFactor = Math.max(0.2, 0.9 + jitter);
        animRoughnessFactor = Math.max(0.3, 1.0 + jitter * 1.5);
        animSeedOffset = Math.floor(t * 60);
        break;
      }
    }
  }

  // Effective values
  const effectiveSpread = ink.bleedSpread * animSpreadFactor;
  const effectiveRoughness = ink.roughness * animRoughnessFactor;
  const effectiveFrequency = ink.frequency * animFrequencyFactor;

  // SVG Displacement Scale: controls how far capillary tentacles bleed outwards
  const displacementScale = (effectiveRoughness / 100) * 28;

  // Base frequency for capillary branches
  const baseFreqX = Math.max(0.005, effectiveFrequency);
  const baseFreqY = Math.max(0.005, effectiveFrequency * (1 + ink.capillaryStreaks * 0.006));
  const baseFrequency = `${baseFreqX.toFixed(4)} ${baseFreqY.toFixed(4)}`;

  // Blur stdDev for ink spread / metaball fusion
  const blurStdDev = Math.max(0.1, (effectiveSpread / 100) * 6.0);

  // Alpha thresholding: controls sharpness and pooling of the bleeding ink
  const featherRatio = ink.edgeFeather / 100;
  const alphaMultiplier = 18 + (1 - featherRatio) * 20; // 18 to 38
  const alphaOffset = 6 + (1 - featherRatio) * 8;       // 6 to 14

  const seed = (Math.floor(ink.roughness * 17) + animSeedOffset) % 1000 + 1;

  // Core fill density: default to 100 if undefined
  const coreFillDensity = ink.coreFillDensity !== undefined ? ink.coreFillDensity / 100 : 1.0;

  // Erosion opacity: strictly controlled so letters remain solid
  const erosionOpacity = (ink.inkErosion / 100) * 0.35; // max 35% erosion, never hollows out letter
  const gritOpacity = (ink.tonerGrit / 100) * 0.3;
  const gritFrequency = 0.4 + (ink.tonerGrit / 100) * 0.3;

  return {
    filterId,
    displacementScale,
    baseFrequency,
    numOctaves: Math.min(4, Math.max(1, ink.octaves)),
    blurStdDev,
    alphaMultiplier,
    alphaOffset,
    seed,
    coreFillDensity,
    erosionOpacity,
    gritOpacity,
    gritFrequency
  };
}

/**
 * Returns full SVG `<filter>` markup string for the given parameters.
 * Crucial: Preserves the SOLID OPAQUE INK CORE of the letters (SourceGraphic),
 * while producing rich organic ink bleeding and capillary expansion around contours.
 */
export function buildSvgFilterMarkup(params: FilterParams): string {
  const {
    filterId,
    displacementScale,
    baseFrequency,
    numOctaves,
    blurStdDev,
    alphaMultiplier,
    alphaOffset,
    seed,
    coreFillDensity,
    erosionOpacity
  } = params;

  return `
    <filter id="${filterId}" x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <!-- 1. Organic paper capillary turbulence -->
      <feTurbulence
        type="fractalNoise"
        baseFrequency="${baseFrequency}"
        numOctaves="${numOctaves}"
        seed="${seed}"
        result="capillaryNoise"
      />

      <!-- 2. Displace typography contours with capillary noise -->
      <feDisplacementMap
        in="SourceGraphic"
        in2="capillaryNoise"
        scale="${displacementScale.toFixed(2)}"
        xChannelSelector="R"
        yChannelSelector="G"
        result="displacedText"
      />

      <!-- 3. Blur for ink diffusion & paper absorption -->
      <feGaussianBlur
        in="displacedText"
        stdDeviation="${blurStdDev.toFixed(2)}"
        result="blurredInk"
      />

      <!-- 4. Metaball alpha ramp: expands wet ink pooling outward -->
      <feColorMatrix
        in="blurredInk"
        type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 ${alphaMultiplier.toFixed(1)} -${alphaOffset.toFixed(1)}"
        result="solidBleedContour"
      />

      <!-- 5. SOLID INK CORE MERGE:
           Merges the bleeding outer contour with the solid original letterform (SourceGraphic).
           This guarantees the letter interior remains 100% solidly filled and dense! -->
      ${
        coreFillDensity > 0.05
          ? `
      <feMerge result="denseInkedText">
        <feMergeNode in="solidBleedContour" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
      `
          : `
      <feMerge result="denseInkedText">
        <feMergeNode in="solidBleedContour" />
      </feMerge>
      `
      }

      ${
        erosionOpacity > 0.04
          ? `
      <!-- 6. Subtle edge dropout specks (controlled, preserves solid body) -->
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.09"
        numOctaves="3"
        seed="${(seed * 11) % 500}"
        result="microErosion"
      />
      <feColorMatrix
        in="microErosion"
        type="matrix"
        values="0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 ${((1 - erosionOpacity) * 8).toFixed(1)} -1.5"
        result="erosionMask"
      />
      <!-- Soft composite: retains solid core while adding subtle micro-bites -->
      <feComposite
        in="denseInkedText"
        in2="erosionMask"
        operator="in"
        result="finalInk"
      />
      `
          : `
      <feMerge result="finalInk">
        <feMergeNode in="denseInkedText" />
      </feMerge>
      `
      }
    </filter>
  `;
}
