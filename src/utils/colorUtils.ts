// Utility functions for handling color attributes in WooCommerce products

export interface ColorInfo {
  name: string;
  hex: string;
  isKnownColor: boolean;
}

// Common color mappings for WooCommerce color attributes
const COLOR_MAP: Record<string, string> = {
  // Basic colors
  red: "#DC2626",
  blue: "#2563EB",
  green: "#16A34A",
  yellow: "#EAB308",
  orange: "#EA580C",
  purple: "#9333EA",
  pink: "#EC4899",
  black: "#000000",
  white: "#FFFFFF",
  gray: "#6B7280",
  grey: "#6B7280",
  brown: "#92400E",
  navy: "#1E3A8A",
  maroon: "#7F1D1D",
  olive: "#65A30D",
  lime: "#84CC16",
  aqua: "#06B6D4",
  teal: "#0D9488",
  silver: "#94A3B8",
  gold: "#F59E0B",
  beige: "#F5F5DC",
  tan: "#D2B48C",
  coral: "#FF7F50",
  salmon: "#FA8072",
  khaki: "#F0E68C",
  violet: "#8B5CF6",
  indigo: "#6366F1",
  turquoise: "#14B8A6",
  crimson: "#DC143C",
  magenta: "#D946EF",
  cyan: "#06B6D4",

  // Color variations
  "light blue": "#60A5FA",
  "dark blue": "#1E40AF",
  "light green": "#4ADE80",
  "dark green": "#15803D",
  "light gray": "#D1D5DB",
  "dark gray": "#374151",
  "light grey": "#D1D5DB",
  "dark grey": "#374151",
  "royal blue": "#2563EB",
  "forest green": "#166534",
  "sky blue": "#0EA5E9",
  "mint green": "#6EE7B7",
  "rose gold": "#E11D48",
  "powder blue": "#BFDBFE",
  "deep burgundy": "#7F1D1D",
  emerald: "#059669",
  slate: "#475569",
  stone: "#78716C",
  neutral: "#737373",
  "warm gray": "#78716C",
  "cool gray": "#6B7280",

  // Fashion colors
  nude: "#F3E8D0",
  cream: "#FFFDD0",
  ivory: "#FFFFF0",
  champagne: "#F7E7CE",
  pearl: "#EAE0C8",
  platinum: "#E5E4E2",
  bronze: "#CD7F32",
  copper: "#B87333",
  metallic: "#C0C0C0",
  charcoal: "#36454F",
  midnight: "#191970",
  espresso: "#3C2415",
  chocolate: "#7B3F00",
  camel: "#C19A6B",
  mustard: "#FFDB58",
  rust: "#B7410E",
  burgundy: "#800020",
  wine: "#722F37",
  plum: "#8E4585",
  lavender: "#E6E6FA",
  peach: "#FFCBA4",
  blush: "#DE5D83",
  sage: "#9CAF88",
  mint: "#98FB98",
  seafoam: "#93E9BE",
  denim: "#1560BD",
  chambray: "#4C86A8",
};

// Extended color patterns for more flexible matching
const COLOR_PATTERNS: Array<{ pattern: RegExp; color: string }> = [
  { pattern: /^#[0-9A-Fa-f]{6}$/, color: "" }, // Already hex
  { pattern: /^#[0-9A-Fa-f]{3}$/, color: "" }, // 3-digit hex
  { pattern: /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i, color: "" }, // RGB
  {
    pattern: /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\d.]+\s*\)/i,
    color: "",
  }, // RGBA
];

/**
 * Determines if an attribute is likely a color attribute
 */
export const isColorAttribute = (attributeName: string): boolean => {
  const colorKeywords = ["color", "colour", "shade", "hue", "tone"];
  const lowerName = attributeName.toLowerCase();
  return colorKeywords.some((keyword) => lowerName.includes(keyword));
};

/**
 * Converts a color name or value to hex format
 */
export const getColorInfo = (colorValue: string): ColorInfo => {
  const cleanValue = colorValue.trim().toLowerCase();

  // Check if it's already a hex color
  if (/^#[0-9A-Fa-f]{6}$/.test(colorValue)) {
    return {
      name: colorValue,
      hex: colorValue.toUpperCase(),
      isKnownColor: true,
    };
  }

  // Check if it's a 3-digit hex
  if (/^#[0-9A-Fa-f]{3}$/.test(colorValue)) {
    const expanded = colorValue.replace(
      /^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/,
      "#$1$1$2$2$3$3"
    );
    return {
      name: colorValue,
      hex: expanded.toUpperCase(),
      isKnownColor: true,
    };
  }

  // Check RGB format
  const rgbMatch = colorValue.match(
    /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    const hex =
      "#" +
      [r, g, b]
        .map((x) => parseInt(x).toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
    return {
      name: colorValue,
      hex,
      isKnownColor: true,
    };
  }

  // Check our color map
  if (COLOR_MAP[cleanValue]) {
    return {
      name: colorValue,
      hex: COLOR_MAP[cleanValue],
      isKnownColor: true,
    };
  }

  // Try partial matches (e.g., "light blue" matching "blue")
  for (const [colorName, hexValue] of Object.entries(COLOR_MAP)) {
    if (cleanValue.includes(colorName) || colorName.includes(cleanValue)) {
      return {
        name: colorValue,
        hex: hexValue,
        isKnownColor: true,
      };
    }
  }

  // If no match found, generate a hash-based color
  return {
    name: colorValue,
    hex: generateHashColor(cleanValue),
    isKnownColor: false,
  };
};

/**
 * Generates a consistent color based on string hash
 */
const generateHashColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate a pleasant color by limiting saturation and lightness
  const hue = Math.abs(hash) % 360;
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 45 + (Math.abs(hash) % 20); // 45-65%

  return hslToHex(hue, saturation, lightness);
};

/**
 * Converts HSL to hex color
 */
const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

/**
 * Determines if a color is light (for text contrast)
 */
export const isLightColor = (hex: string): boolean => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Use relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
};

/**
 * Gets appropriate text color for a background color
 */
export const getContrastColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? "#000000" : "#FFFFFF";
};

/**
 * Gets all colors from a list of attribute options
 */
export const getColorsFromOptions = (options: string[]): ColorInfo[] => {
  return options.map((option) => getColorInfo(option));
};
