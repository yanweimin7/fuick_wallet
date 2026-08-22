export const Theme = {
  colors: {
    // Brand — gold trust + purple tech
    primary: "#F59E0B",
    primaryVariant: "#FBBF24",
    accent: "#8B5CF6",
    accentVariant: "#7C3AED",

    // Surfaces (dark, layered)
    background: "#0B0E14",
    surface: "#141A26",
    surfaceVariant: "#1B2230",
    surfaceHighlight: "#222C3D",
    overlay: "#0B0E14CC",

    // Text
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    textHint: "#64748B",
    onPrimary: "#0B0E14",
    onAccent: "#FFFFFF",

    // Semantic
    success: "#34D399",
    successSoft: "#34D39922",
    error: "#F87171",
    errorSoft: "#F8717122",
    warning: "#FBBF24",
    info: "#60A5FA",

    border: "#27303F",
    borderLight: "#313C4F",
    divider: "#1E2632",

    // Decorative gradients (fuickjs: type/colors/begin/end)
    heroGradient: {
      type: "linear",
      colors: ["#7C3AED", "#4338CA", "#6D28D9"],
      begin: "topLeft",
      end: "bottomRight",
    },
    heroGradientWarm: {
      type: "linear",
      colors: ["#8B5CF6", "#6D28D9"],
      begin: "topLeft",
      end: "bottomRight",
    },
    primaryGradient: {
      type: "linear",
      colors: ["#F59E0B", "#FBBF24"],
      begin: "topLeft",
      end: "bottomRight",
    },
    accentGradient: {
      type: "linear",
      colors: ["#8B5CF6", "#6366F1"],
      begin: "topLeft",
      end: "bottomRight",
    },
  },
  spacing: {
    xxs: 2,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    xxl: 32,
    full: 9999,
  },
  shadows: {
    small: { color: "#00000040", blurRadius: 6, offset: { dx: 0, dy: 2 } },
    medium: { color: "#00000055", blurRadius: 14, offset: { dx: 0, dy: 6 } },
    large: { color: "#0000006B", blurRadius: 28, offset: { dx: 0, dy: 12 } },
    glow: { color: "#7C3AED55", blurRadius: 24, offset: { dx: 0, dy: 8 } },
  },
  typography: {
    display: { fontSize: 34, fontWeight: "bold" },
    h1: { fontSize: 28, fontWeight: "bold" },
    h2: { fontSize: 22, fontWeight: "bold" },
    h3: { fontSize: 18, fontWeight: "bold" },
    body: { fontSize: 15, fontWeight: "normal" },
    caption: { fontSize: 13, fontWeight: "normal", color: "#94A3B8" },
  },
};

export type ThemeColors = typeof Theme.colors;
