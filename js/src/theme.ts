export const Theme = {
  colors: {
    primary: "#2962FF", // Deep Blue
    primaryLight: "#768FFF",
    primaryDark: "#0039CB",
    secondary: "#00BFA5", // Teal accent
    background: "#F5F7FA", // Light Gray
    surface: "#FFFFFF",
    error: "#B00020",
    textPrimary: "#1F2937", // Gray 900
    textSecondary: "#6B7280", // Gray 500
    textHint: "#9CA3AF", // Gray 400
    divider: "#E5E7EB", // Gray 200
    success: "#10B981",
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  borderRadius: {
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
  },
  shadows: {
    small: { color: "#0000001A", blurRadius: 4, offset: { dx: 0, dy: 2 } },
    medium: { color: "#0000001A", blurRadius: 8, offset: { dx: 0, dy: 4 } },
    large: { color: "#00000026", blurRadius: 16, offset: { dx: 0, dy: 8 } },
  },
  typography: {
    h1: { fontSize: 32, fontWeight: "bold" },
    h2: { fontSize: 24, fontWeight: "bold" },
    h3: { fontSize: 20, fontWeight: "bold" },
    body: { fontSize: 16, fontWeight: "normal" },
    caption: { fontSize: 14, fontWeight: "normal", color: "#6B7280" },
  }
};
