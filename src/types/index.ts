export interface InkBleedSettings {
  bleedSpread: number;      // 0 - 100: extent of ink bleeding outwards
  roughness: number;        // 0 - 100: displacement turbulence amplitude
  frequency: number;        // 0.005 - 0.12: scale of capillary branches / grain
  octaves: number;          // 1 - 5: fractal detail layers
  coreFillDensity: number;  // 0 - 100: keeps the inner body of the letters solid and fully filled
  inkErosion: number;       // 0 - 100: subtle edge dropout specks (controlled, non-hollow)
  edgeFeather: number;      // 0 - 100: softness of bleeding fringes
  tonerGrit: number;        // 0 - 100: micro paper fiber grain
  capillaryStreaks: number; // 0 - 100: directional paper fiber bleeding
  inkColor: string;         // hex
  inkOpacity: number;       // 10 - 100
}

export type PaperType = 
  | 'newspaper-vintage' 
  | 'aged-parchment' 
  | 'kraft' 
  | 'cotton-fine-art' 
  | 'photostat-dark' 
  | 'transparent';

export interface PaperSettings {
  paperType: PaperType;
  baseColor: string;
  agingSepia: number;       // 0 - 100: vintage sepia tone wash
  fiberGrain: number;       // 0 - 100: tactile paper pulp grain
  vignette: number;         // 0 - 100: edge burn / aging
}

export interface TypographySettings {
  text: string;
  fontFamily: string;
  fontSize: number;         // px (40 - 240)
  lineHeight: number;       // 0.7 - 2.0
  letterSpacing: number;    // -10 - 50 px
  textAlign: 'left' | 'center' | 'right';
  uppercase: boolean;
  fontWeight: number;       // 400 - 900
}

export type AnimationMode = 'bleed-in' | 'pulse' | 'capillary-flow' | 'xerox-burn';

export interface AnimationSettings {
  isPlaying: boolean;
  progress: number;         // 0.0 - 1.0
  duration: number;         // seconds (1.0 - 10.0)
  mode: AnimationMode;
  loop: boolean;
  speed: number;            // 0.25 - 3.0
}

export interface Preset {
  id: string;
  name: string;
  category: string;
  description: string;
  ink: InkBleedSettings;
  paper: PaperSettings;
  typography: TypographySettings;
}
