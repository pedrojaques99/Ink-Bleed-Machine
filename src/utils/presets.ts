import { Preset } from '../types';

export const PRESETS: Preset[] = [
  {
    id: 'old-ink-1920',
    name: 'Old Ink Vintage',
    category: 'Vintage Print',
    description: 'Porous ink diffusion with organic capillary stippling on smooth aged paper, faithful to classic PSD text effects.',
    ink: {
      bleedSpread: 36,
      roughness: 38,
      frequency: 0.035,
      octaves: 3,
      coreFillDensity: 100,
      inkErosion: 0,
      edgeFeather: 24,
      tonerGrit: 15,
      capillaryStreaks: 25,
      inkColor: '#171719',
      inkOpacity: 100
    },
    paper: {
      paperType: 'newspaper-vintage',
      baseColor: '#e5e1d5',
      agingSepia: 35,
      fiberGrain: 45,
      vignette: 30
    },
    typography: {
      text: 'OLD INK\nARCHIVAL PRESS',
      fontFamily: 'Bebas Neue',
      fontSize: 110,
      lineHeight: 0.92,
      letterSpacing: 6,
      textAlign: 'center',
      uppercase: true,
      fontWeight: 400
    }
  },
  {
    id: 'ray-gun-1994',
    name: 'Ray Gun 1994',
    category: 'Xerox & Zine',
    description: 'Iconic David Carson 90s brutalist photocopy ink bleed with solid deep black ink and bleeding borders.',
    ink: {
      bleedSpread: 45,
      roughness: 48,
      frequency: 0.032,
      octaves: 4,
      coreFillDensity: 100,
      inkErosion: 8,
      edgeFeather: 15,
      tonerGrit: 20,
      capillaryStreaks: 35,
      inkColor: '#0a0a0c',
      inkOpacity: 100
    },
    paper: {
      paperType: 'newspaper-vintage',
      baseColor: '#e9e7df',
      agingSepia: 25,
      fiberGrain: 40,
      vignette: 20
    },
    typography: {
      text: 'RAY GUN\nSUB-CULTURE',
      fontFamily: 'Anton',
      fontSize: 100,
      lineHeight: 0.88,
      letterSpacing: 3,
      textAlign: 'center',
      uppercase: true,
      fontWeight: 400
    }
  },
  {
    id: 'rubber-stamp-grunge',
    name: 'Worn Rubber Stamp',
    category: 'Letterpress',
    description: 'Heavy pressure commercial hand stamp with deep filled ink and organic porous bleeding edges.',
    ink: {
      bleedSpread: 34,
      roughness: 40,
      frequency: 0.04,
      octaves: 3,
      coreFillDensity: 100,
      inkErosion: 6,
      edgeFeather: 20,
      tonerGrit: 18,
      capillaryStreaks: 20,
      inkColor: '#8a1f1d',
      inkOpacity: 98
    },
    paper: {
      paperType: 'kraft',
      baseColor: '#d6c4a5',
      agingSepia: 35,
      fiberGrain: 45,
      vignette: 28
    },
    typography: {
      text: 'OFFICIAL\nAPPROVED',
      fontFamily: 'Special Elite',
      fontSize: 84,
      lineHeight: 1.05,
      letterSpacing: 4,
      textAlign: 'center',
      uppercase: true,
      fontWeight: 400
    }
  },
  {
    id: 'risograph-heavy',
    name: 'Risograph Blot',
    category: 'Risograph',
    description: 'Solid soy-based risograph ink pooling with rich saturated fill and porous edge bleed.',
    ink: {
      bleedSpread: 38,
      roughness: 32,
      frequency: 0.025,
      octaves: 3,
      coreFillDensity: 100,
      inkErosion: 0,
      edgeFeather: 25,
      tonerGrit: 12,
      capillaryStreaks: 18,
      inkColor: '#0c2461',
      inkOpacity: 98
    },
    paper: {
      paperType: 'aged-parchment',
      baseColor: '#f7f4ea',
      agingSepia: 15,
      fiberGrain: 30,
      vignette: 10
    },
    typography: {
      text: 'SOY INK\nRISOGRAPH',
      fontFamily: 'Archivo Black',
      fontSize: 88,
      lineHeight: 0.95,
      letterSpacing: 2,
      textAlign: 'center',
      uppercase: true,
      fontWeight: 400
    }
  },
  {
    id: 'victorian-letterpress',
    name: 'Victorian Letterpress',
    category: 'Letterpress',
    description: 'Deep heavy metal type stamped into cotton paper with ink spreading into surrounding fibers.',
    ink: {
      bleedSpread: 28,
      roughness: 30,
      frequency: 0.022,
      octaves: 3,
      coreFillDensity: 100,
      inkErosion: 0,
      edgeFeather: 20,
      tonerGrit: 10,
      capillaryStreaks: 22,
      inkColor: '#1d1715',
      inkOpacity: 100
    },
    paper: {
      paperType: 'cotton-fine-art',
      baseColor: '#f4f1ea',
      agingSepia: 22,
      fiberGrain: 40,
      vignette: 18
    },
    typography: {
      text: 'FOUNDRY\nLETTERPRESS',
      fontFamily: 'Cinzel Decorative',
      fontSize: 76,
      lineHeight: 1.05,
      letterSpacing: 4,
      textAlign: 'center',
      uppercase: true,
      fontWeight: 700
    }
  },
  {
    id: 'wet-sumi-bleed',
    name: 'Wet Sumi Diffusion',
    category: 'Organic Fluid',
    description: 'Liquefied Asian carbon ink with solid brush strokes diffusing outward into mulberry rice paper.',
    ink: {
      bleedSpread: 56,
      roughness: 60,
      frequency: 0.02,
      octaves: 4,
      coreFillDensity: 100,
      inkErosion: 0,
      edgeFeather: 38,
      tonerGrit: 10,
      capillaryStreaks: 60,
      inkColor: '#0a0d10',
      inkOpacity: 98
    },
    paper: {
      paperType: 'aged-parchment',
      baseColor: '#eae7dc',
      agingSepia: 26,
      fiberGrain: 45,
      vignette: 28
    },
    typography: {
      text: 'SUMI-E\nFLUID BLEED',
      fontFamily: 'Syne',
      fontSize: 82,
      lineHeight: 0.95,
      letterSpacing: 5,
      textAlign: 'center',
      uppercase: true,
      fontWeight: 800
    }
  },
  {
    id: 'photostat-acid',
    name: 'Photostat Negative',
    category: 'Brutalist',
    description: 'Darkroom photostat with solid bleached white toner and distressed edge capillary bleed.',
    ink: {
      bleedSpread: 40,
      roughness: 50,
      frequency: 0.035,
      octaves: 4,
      coreFillDensity: 100,
      inkErosion: 5,
      edgeFeather: 15,
      tonerGrit: 22,
      capillaryStreaks: 35,
      inkColor: '#f2f2ee',
      inkOpacity: 100
    },
    paper: {
      paperType: 'photostat-dark',
      baseColor: '#121214',
      agingSepia: 10,
      fiberGrain: 55,
      vignette: 40
    },
    typography: {
      text: 'PHOTOSTAT\nNEGATIVE',
      fontFamily: 'Rubik Mono One',
      fontSize: 74,
      lineHeight: 1.0,
      letterSpacing: 2,
      textAlign: 'center',
      uppercase: true,
      fontWeight: 400
    }
  },
  {
    id: 'gothic-manuscript',
    name: 'Gothic Manuscript',
    category: 'Vintage Print',
    description: 'Medieval quill and dense gall ink bleeding into animal vellum parchment.',
    ink: {
      bleedSpread: 30,
      roughness: 35,
      frequency: 0.03,
      octaves: 3,
      coreFillDensity: 100,
      inkErosion: 0,
      edgeFeather: 22,
      tonerGrit: 12,
      capillaryStreaks: 25,
      inkColor: '#1e140d',
      inkOpacity: 100
    },
    paper: {
      paperType: 'aged-parchment',
      baseColor: '#e8dcbe',
      agingSepia: 50,
      fiberGrain: 50,
      vignette: 35
    },
    typography: {
      text: 'GUTENBERG\nANNO 1455',
      fontFamily: 'UnifrakturMaguntia',
      fontSize: 90,
      lineHeight: 1.0,
      letterSpacing: 2,
      textAlign: 'center',
      uppercase: false,
      fontWeight: 400
    }
  }
];
