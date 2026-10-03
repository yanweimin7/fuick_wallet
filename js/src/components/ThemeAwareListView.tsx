import React, { useEffect, useRef } from "react";
import { ListView, ListViewProps } from "fuickjs";
import { ThemeStore } from "../theme";

interface Refreshable {
  refresh: () => void;
}

/** 所有主题敏感的 itemBuilder 列表，主题切换时需要主动让 Dart 重新拉 DSL */
const registry = new Set<Refreshable>();

/**
 * 会跟随主题刷新的 ListView。
 *
 * 为什么需要它：无状态 `itemBuilder` 列表的 item DSL 是**由 Dart 主动拉取**
 * （getItemDSL）后缓存起来的，主题切换时 React 只会重渲染到 ListView 这一层，
 * 不会把新的 item DSL 推给 Dart，结果就是卡片颜色停在旧主题
 * （暗色下浅色 surface 看起来就是"白底"）。
 * `refresh()` 走 FuickDslCacheMixin 的 _handleDslCommand → resetForNewData，
 * 清掉 Dart 侧 DSL 缓存，Dart 随即重新拉取，此时读到的已是新主题。
 *
 * 主动注册 + 订阅，因此调用方无需关心主题，不需要写任何额外样板。
 */
export function ThemeAwareListView(props: ListViewProps) {
  const ref = useRef<ListView>(null);

  useEffect(() => {
    const entry: Refreshable = {
      refresh: () => ref.current?.refresh(),
    };
    registry.add(entry);
    const unsubscribe = ThemeStore.subscribe(() => entry.refresh());
    return () => {
      registry.delete(entry);
      unsubscribe();
    };
  }, []);

  return <ListView ref={ref} {...props} />;
}