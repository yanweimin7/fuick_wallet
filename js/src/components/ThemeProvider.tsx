import React, { useEffect, useReducer } from "react";
import { Container, GestureDetector, Icon } from "fuickjs";
import { Theme, ThemeStore, useAppTheme } from "../theme";

/**
 * 全局主题 Provider。挂在 Router 的每个入口上（见 app.ts 的 page()），
 * 因此各页面无需自行订阅主题。
 *
 * 注意：这里必须 cloneElement 产生新的 element 引用。
 * 若直接透传 props.children，切换主题时 React 会对子节点命中
 * bailoutOnAlreadyFinishedWork（oldProps === newProps 且子节点无待处理更新），
 * 从而跳过整棵子树的重渲染，主题切换将完全失效。
 */
export function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const [, forceUpdate] = useReducer((c: number) => c + 1, 0);

  useEffect(() => ThemeStore.subscribe(() => forceUpdate()), []);

  return (
    <>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child) : child,
      )}
    </>
  );
}

/**
 * 明暗主题切换按钮。自身完成订阅与文案反馈，
 * 调用方只需渲染它，不需要关心主题状态。
 */
export function ThemeToggle({ size = 38 }: { size?: number }) {
  const { isDark, toggle } = useAppTheme();

  return (
    <GestureDetector
      onTap={() => {
        toggle();
      }}
    >
      <Container
        width={size}
        height={size}
        alignment="center"
        decoration={{
          color: Theme.colors.surfaceVariant,
          borderRadius: Theme.borderRadius.full,
          border: { color: Theme.colors.border, width: 1 },
        }}
      >
        <Icon
          name={isDark ? "light_mode" : "dark_mode"}
          color={Theme.colors.textPrimary}
          size={Math.round(size * 0.53)}
        />
      </Container>
    </GestureDetector>
  );
}