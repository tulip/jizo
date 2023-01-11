// /** Widths */
export const widths = {
  'w-max-x-0': 820,
  'w-max-x-1': 960,
  'w-max-x-2': 1200,
  'w-max-x-3': 1440,
};

// /** Margins */
export const margins = {
  'm-1': 4,
  'm-2': 8,
  'm-3': 16,
  'm-4': 24,
  'm-5': 32,
  'm-6': 64,
  'm-7': 96,
  'm-8': 128,
};

// /** Gutters */
export const gutters = {
  'gutter-y': `${margins['m-3']}`,
  'gutter-x': `${margins['m-4'] / 2}px`,
  gutter: `${margins['m-3']}px ${margins['m-4'] / 2}px`,
  gutter__lg: `${margins['m-3'] * 2}px ${(margins['m-4'] / 2) * 2}px`,
};

// /** Typography */
export const fontSize = {
  'fs-1': 11,
  'fs-2': 13,
  'fs-3': 16,
  'fs-4': 18,
  'fs-5': 24,
  'fs-6': 32,
  'fs-7': 48,
  'fs-8': 60,
};

export const headerSize = {
  'hs-1': `${fontSize['fs-7']}`,
  'hs-2': `${fontSize['fs-6']}`,
  'hs-3': `${fontSize['fs-5']}`,
  'hs-4': `${fontSize['fs-4']}`,
  'hs-5': `${fontSize['fs-3']}`,
  'hs-6': `${fontSize['fs-2']}`,
};

export const lineHeight = {
  'lh-0': 0.75,
  'lh-1': 1,
  'lh-2': 1.25,
  'lh-3': 1.5,
};

// /** Border Radii */
export const borderRadius = {
  'br-1': 8,
  'br-2': 16,
  'br-3': 48,
  'br-100': '50%',
};

// /** Breakpoints */
export const breakpoints = {
  'bp-1': 480, // <= Mobile
  'bp-2': 728, // <= Tablet
  'bp-3': 1024, // <= Small Display
  'bp-4': 1200, // <= Modern Display
  'bp-5': 1440, // <= Large Display
  'bp-6': 1920, // <= XL Display
  'bp-7': 2160, // <= 4k Display
};

export const styles = {
  widths: widths,
  margins: margins,
  gutters: gutters,
  fontSize: fontSize,
  headerSize: headerSize,
  lineHeight: lineHeight,
  borderRadius: borderRadius,
  breakpoints: breakpoints,
};
