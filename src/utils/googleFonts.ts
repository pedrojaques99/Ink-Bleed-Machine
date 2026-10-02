export interface FontOption {
  family: string;
  category: 'Brutalist' | 'Vintage' | 'Serif' | 'Monospace' | 'Display' | 'Gothic';
  recommendedWeights: number[];
  tagline: string;
}

export const POPULAR_GOOGLE_FONTS: FontOption[] = [
  {
    family: 'Anton',
    category: 'Brutalist',
    recommendedWeights: [400],
    tagline: 'Heavy impact sans, iconic Ray Gun zine style'
  },
  {
    family: 'Bebas Neue',
    category: 'Brutalist',
    recommendedWeights: [400],
    tagline: 'Tall condensed poster grotesque'
  },
  {
    family: 'Archivo Black',
    category: 'Brutalist',
    recommendedWeights: [400],
    tagline: 'Massive ultra-heavy geometric display'
  },
  {
    family: 'Syne',
    category: 'Display',
    recommendedWeights: [700, 800],
    tagline: 'Artistic contemporary brutalist type'
  },
  {
    family: 'Cinzel Decorative',
    category: 'Vintage',
    recommendedWeights: [700, 900],
    tagline: 'Classical engraved Roman inscriptional'
  },
  {
    family: 'Cinzel',
    category: 'Vintage',
    recommendedWeights: [600, 900],
    tagline: 'Chiseled monumental serif'
  },
  {
    family: 'Playfair Display',
    category: 'Serif',
    recommendedWeights: [700, 900],
    tagline: 'High contrast editorial transition serif'
  },
  {
    family: 'Lora',
    category: 'Serif',
    recommendedWeights: [600, 700],
    tagline: 'Balanced contemporary literary serif'
  },
  {
    family: 'Special Elite',
    category: 'Vintage',
    recommendedWeights: [400],
    tagline: 'Distressed vintage typewriter ribbon'
  },
  {
    family: 'Courier Prime',
    category: 'Monospace',
    recommendedWeights: [700],
    tagline: 'Heavy monospaced typewriter key'
  },
  {
    family: 'Rubik Mono One',
    category: 'Monospace',
    recommendedWeights: [400],
    tagline: 'Ultra-bold geometric monospaced'
  },
  {
    family: 'UnifrakturMaguntia',
    category: 'Gothic',
    recommendedWeights: [400],
    tagline: 'Authentic 15th-century Gutenberg blackletter'
  },
  {
    family: 'Rye',
    category: 'Vintage',
    recommendedWeights: [400],
    tagline: 'Wild West wood type letterpress'
  },
  {
    family: 'Oswald',
    category: 'Brutalist',
    recommendedWeights: [600, 700],
    tagline: 'Modern reimagining of gothic headline type'
  },
  {
    family: 'Righteous',
    category: 'Display',
    recommendedWeights: [400],
    tagline: 'Retro geometric art deco headline'
  },
  {
    family: 'Montserrat',
    category: 'Brutalist',
    recommendedWeights: [800, 900],
    tagline: 'Urban Buenos Aires signage sans'
  },
  {
    family: 'Space Grotesk',
    category: 'Display',
    recommendedWeights: [600, 700],
    tagline: 'Quirky technological display grotesque'
  }
];

const loadedFonts = new Set<string>();

/**
 * Dynamically loads any Google Font by name
 */
export async function loadGoogleFont(fontFamily: string): Promise<boolean> {
  const cleanName = fontFamily.trim();
  if (!cleanName) return false;
  if (loadedFonts.has(cleanName)) return true;

  try {
    const formattedName = cleanName.replace(/\s+/g, '+');
    const href = `https://fonts.googleapis.com/css2?family=${formattedName}:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap`;

    // Check if link already exists
    const existing = document.querySelector(`link[href*="${formattedName}"]`);
    if (existing) {
      loadedFonts.add(cleanName);
      return true;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    const promise = new Promise<boolean>((resolve) => {
      link.onload = () => {
        loadedFonts.add(cleanName);
        resolve(true);
      };
      link.onerror = () => {
        // Fallback: try loading just regular weight
        const fallbackHref = `https://fonts.googleapis.com/css2?family=${formattedName}&display=swap`;
        link.href = fallbackHref;
        link.onload = () => {
          loadedFonts.add(cleanName);
          resolve(true);
        };
        link.onerror = () => resolve(false);
      };
    });

    document.head.appendChild(link);
    return await promise;
  } catch {
    return false;
  }
}
