import { useEffect, useReducer } from "react";
import { StorageService } from "./services/StorageService";

/**
 * 设计方向：Minimalism & Swiss —— 克制的单一主色 + 高对比中性面，
 * 靠留白与字重建立层级，不靠彩色渐变堆砌。
 * 暗色不是亮色的简单反转，而是同一色相下「提亮 + 去饱和」的独立色阶。
 *
 * 所有前景/背景组合均已按 WCAG 校验：
 *   正文 ≥ 4.5:1，大号/次要文字与描边 ≥ 3:1。
 */

export type ThemeMode = "light" | "dark";

export interface ThemeGradient {
  type: "linear";
  colors: string[];
  begin: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center";
  end: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center";
}

export interface ThemePalette {
  // Brand
  primary: string;
  primaryVariant: string;
  primarySoft: string;
  accent: string;
  accentVariant: string;
  accentSoft: string;

  // Surfaces（分层：background → surface → surfaceVariant → surfaceHighlight）
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceHighlight: string;
  overlay: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textHint: string;
  onPrimary: string;
  onAccent: string;
  /** 叠在 heroGradient 之上的前景色 */
  onHero: string;
  /** 叠在实底品牌色块（如 IconBadge 非 soft）之上的前景色 */
  onTint: string;

  // Semantic
  success: string;
  successSoft: string;
  error: string;
  errorSoft: string;
  warning: string;
  warningSoft: string;
  info: string;
  infoSoft: string;
  /** 叠在 error 实底之上的前景色 */
  onError: string;
  /** 分类识别色（非语义，仅作色标） */
  pink: string;
  violet: string;

  // Lines
  border: string;
  borderLight: string;
  divider: string;

  // Gradients
  heroGradient: ThemeGradient;
  heroGradientWarm: ThemeGradient;
  primaryGradient: ThemeGradient;
  accentGradient: ThemeGradient;
}

const DARK: ThemePalette = {
  primary: "#4C7DFF",
  primaryVariant: "#6D97FF",
  primarySoft: "#4C7DFF26",
  accent: "#22D3A7",
  accentVariant: "#2DD4BF",
  accentSoft: "#22D3A726",

  background: "#0B1120",
  surface: "#131C2E",
  surfaceVariant: "#1B2639",
  surfaceHighlight: "#243049",
  overlay: "#0B1120CC",

  textPrimary: "#F1F5F9",
  textSecondary: "#A3B1C6",
  textHint: "#6B7A90",
  onPrimary: "#061024",
  onAccent: "#04211A",
  // 金色本身亮度高，两种模式下 hero 前景统一用深墨色（对比 5.6~9.7）
  onHero: "#1C1408",
  onTint: "#1C1408",

  success: "#34D399",
  successSoft: "#34D39922",
  error: "#FB7185",
  errorSoft: "#FB718522",
  warning: "#FBBF24",
  warningSoft: "#FBBF2422",
  info: "#60A5FA",
  infoSoft: "#60A5FA22",
  onError: "#061024",
  pink: "#F472B6",
  violet: "#A78BFA",

  border: "#2A3549",
  borderLight: "#37445C",
  divider: "#1E2739",

  heroGradient: {
    type: "linear",
    colors: ["#C77E11", "#EBB443"],
    begin: "topLeft",
    end: "bottomRight",
  },
  heroGradientWarm: {
    type: "linear",
    colors: ["#A85F08", "#C77E11"],
    begin: "topLeft",
    end: "bottomRight",
  },
  primaryGradient: {
    type: "linear",
    colors: ["#4C7DFF", "#6D97FF"],
    begin: "topLeft",
    end: "bottomRight",
  },
  accentGradient: {
    type: "linear",
    colors: ["#14B8A6", "#22D3A7"],
    begin: "topLeft",
    end: "bottomRight",
  },
};

const LIGHT: ThemePalette = {
  primary: "#2563EB",
  primaryVariant: "#3B6BF5",
  primarySoft: "#2563EB1A",
  accent: "#0D9488",
  accentVariant: "#0F766E",
  accentSoft: "#0D94881A",

  background: "#F6F8FC",
  surface: "#FFFFFF",
  surfaceVariant: "#F1F4F9",
  surfaceHighlight: "#E8EDF5",
  overlay: "#0E172666",

  textPrimary: "#0E1726",
  textSecondary: "#4A5871",
  textHint: "#7C8AA0",
  onPrimary: "#FFFFFF",
  onAccent: "#FFFFFF",
  onHero: "#1C1408",
  onTint: "#1C1408",

  success: "#059669",
  successSoft: "#0596691F",
  error: "#DC2626",
  errorSoft: "#DC26261F",
  warning: "#B45309",
  warningSoft: "#B453091F",
  info: "#2563EB",
  infoSoft: "#2563EB1F",
  onError: "#FFFFFF",
  pink: "#DB2777",
  violet: "#7C3AED",

  border: "#DDE4EE",
  borderLight: "#C9D3E2",
  divider: "#E9EEF5",

  heroGradient: {
    type: "linear",
    colors: ["#C77E11", "#EBB443"],
    begin: "topLeft",
    end: "bottomRight",
  },
  heroGradientWarm: {
    type: "linear",
    colors: ["#A85F08", "#C77E11"],
    begin: "topLeft",
    end: "bottomRight",
  },
  primaryGradient: {
    type: "linear",
    colors: ["#2563EB", "#3B6BF5"],
    begin: "topLeft",
    end: "bottomRight",
  },
  accentGradient: {
    type: "linear",
    colors: ["#0B7C72", "#0F766E"],
    begin: "topLeft",
    end: "bottomRight",
  },
};

export const SPACING = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

const DARK_SHADOWS = {
  small: { color: "#04070E66", blurRadius: 8, offset: { dx: 0, dy: 2 } },
  medium: { color: "#04070E80", blurRadius: 16, offset: { dx: 0, dy: 6 } },
  large: { color: "#04070E99", blurRadius: 28, offset: { dx: 0, dy: 12 } },
  glow: { color: "#C77E1140", blurRadius: 24, offset: { dx: 0, dy: 8 } },
};

const LIGHT_SHADOWS = {
  small: { color: "#0E172614", blurRadius: 6, offset: { dx: 0, dy: 2 } },
  medium: { color: "#0E17261F", blurRadius: 14, offset: { dx: 0, dy: 6 } },
  large: { color: "#0E17262E", blurRadius: 28, offset: { dx: 0, dy: 12 } },
  glow: { color: "#B4530926", blurRadius: 24, offset: { dx: 0, dy: 8 } },
};

const DARK_TYPO = {
  display: { fontSize: 34, fontWeight: "bold" },
  h1: { fontSize: 28, fontWeight: "bold" },
  h2: { fontSize: 22, fontWeight: "bold" },
  h3: { fontSize: 18, fontWeight: "bold" },
  body: { fontSize: 15, fontWeight: "normal" },
  caption: { fontSize: 13, fontWeight: "normal", color: DARK.textSecondary },
};

const LIGHT_TYPO = {
  display: { fontSize: 34, fontWeight: "bold" },
  h1: { fontSize: 28, fontWeight: "bold" },
  h2: { fontSize: 22, fontWeight: "bold" },
  h3: { fontSize: 18, fontWeight: "bold" },
  body: { fontSize: 15, fontWeight: "normal" },
  caption: { fontSize: 13, fontWeight: "normal", color: LIGHT.textSecondary },
};

const STORAGE_KEY = "fuick_theme_mode";

type Listener = () => void;

const listeners = new Set<Listener>();
let mode: ThemeMode = "dark";

/**
 * 供 ThemeStore 与 useAppTheme 共用的实现。
 * 刻意写成模块级函数而不是对象方法：这些函数会被解构后单独传出
 * （`const { toggle } = useAppTheme()`），一旦依赖 `this` 就会在严格模式下抛错。
 */
function setMode(next: ThemeMode, persist: boolean = true): void {
  if (next === mode) return;
  mode = next;
  if (persist) {
    StorageService.setItem(STORAGE_KEY, next).catch(() => {
      /* 持久化失败不阻塞切换 */
    });
  }
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error("[ThemeStore] listener failed", e);
    }
  });
}

function toggleMode(): void {
  setMode(mode === "dark" ? "light" : "dark");
}

/**
 * 全局主题状态。刻意做成「模块单例 + 订阅」而不是 Context Provider：
 * fuickjs 用的是真 React reconciler，页面各自是独立 root（elementToDsl 的
 * slot 生命周期有限），Context 传不到所有页面；单例订阅则与树形结构无关，
 * 哪一层发起的切换都能广播到全部订阅者。
 */
export const ThemeStore = {
  get mode(): ThemeMode {
    return mode;
  },
  isDark(): boolean {
    return mode === "dark";
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  setMode,
  toggle: toggleMode,
  async load(): Promise<void> {
    try {
      const saved = await StorageService.getItem(STORAGE_KEY);
      if ((saved === "light" || saved === "dark") && saved !== mode) {
        // 读取是异步的，可能在页面挂载之后才 resolve，
        // 因此必须走 setMode 广播，否则已挂载的页面会一直停在默认暗色。
        setMode(saved, false);
      }
    } catch (e) {
      console.error("[ThemeStore] load failed", e);
    }
  },
};

/**
 * 活动主题的实时视图。`Theme.colors.xxx` 在任何页面读到的都是当前模式的取值，
 * 且同一模式下返回同一对象引用（便于框架的 props diff / DSL 缓存命中）。
 * 注意：这是 getter，不是普通属性——不要对它做解构快照后长期持有。
 */
export const Theme = {
  get colors(): ThemePalette {
    return mode === "dark" ? DARK : LIGHT;
  },
  get shadows() {
    return mode === "dark" ? DARK_SHADOWS : LIGHT_SHADOWS;
  },
  get typography() {
    return mode === "dark" ? DARK_TYPO : LIGHT_TYPO;
  },
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
};

export type ThemeColors = ThemePalette;

/**
 * 每个页面组件在顶部调用一次：订阅主题变化，切换时重渲染自身子树。
 * （框架是标准 React 语义，父组件 setState 会重跑整棵子树。）
 */
export function useAppTheme() {
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);

  useEffect(() => ThemeStore.subscribe(() => forceUpdate()), []);

  return {
    mode: ThemeStore.mode,
    isDark: ThemeStore.isDark(),
    colors: Theme.colors,
    setMode: ThemeStore.setMode,
    toggle: ThemeStore.toggle,
  };
}

/** 尽早恢复用户偏好：在模块被 import 时（首个页面渲染前）就发起读取 */
ThemeStore.load();
