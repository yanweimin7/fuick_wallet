#!/usr/bin/env bash
#
# Fuick Wallet / fuickjs demo 一键清理 (macOS)
# 作用：清空钱包列表缓存 + 完全卸载 fuickjs demo app
# 用法：bash clean_fuick.sh
#
set -u

# 两个可能的 bundle id（demo 运行器 / 打包后的 wallet）
BUNDLE_IDS=("com.example.flutterQuickjs" "com.fuick.wallet.fuickWallet")

# demo app 的 macOS 构建产物路径（如换了路径请改这里）
APP_BUNDLE="$HOME/work/flutter_dynamic/fuickjs_demo/app/build/macos/Build/Products/Debug/flutter_quickjs.app"

# 钱包相关 key（兼容直接删域名失败的情况）
WALLET_KEYS=(
  "flutter.fuick_wallet_list_v2"
  "flutter.fuick_wallet_pw_key_v8"
  "flutter.fuick_wallet_salt_v8"
  "flutter.fuick_wallet_secret_1"
  "flutter.fuick_wallet_secret_2"
)

echo "==> 1. 终止正在运行的 app 进程"
pkill -f "flutter_quickjs" 2>/dev/null && echo "killed flutter_quickjs" || echo "无运行进程"
pkill -f "Fuick" 2>/dev/null || true
sleep 1

echo "==> 2. 删除 app bundle"
if [ -e "$APP_BUNDLE" ]; then
  rm -rf "$APP_BUNDLE" && echo "已删除 $APP_BUNDLE"
else
  echo "app bundle 不存在: $APP_BUNDLE"
fi

echo "==> 3. 清空 Preferences 并刷新 cfprefsd 缓存"
for bid in "${BUNDLE_IDS[@]}"; do
  defaults delete "$bid" 2>/dev/null && echo "已删除偏好域 $bid" || echo "无偏好域 $bid"
  rm -f "$HOME/Library/Preferences/$bid.plist"
  for key in "${WALLET_KEYS[@]}"; do
    defaults delete "$bid" "$key" 2>/dev/null || true
  done
done
killall cfprefsd 2>/dev/null && echo "已刷新 cfprefsd" || true

echo "==> 4. 清空 Keychain (flutter_secure_storage，兼容旧构建)"
security delete-generic-password -s flutter_secure_storage 2>/dev/null \
  && echo "已删除 keychain 项" || echo "无 keychain 项"

echo "==> 5. 删除各 bundle 的 Library 数据"
for bid in "${BUNDLE_IDS[@]}"; do
  rm -rf "$HOME/Library/Containers/$bid"
  rm -rf "$HOME/Library/Caches/$bid"
  rm -rf "$HOME/Library/Preferences/$bid.plist"
  rm -rf "$HOME/Library/Application Support/$bid"
  rm -rf "$HOME/Library/WebKit/$bid"
  rm -rf "$HOME/Library/HTTPStorages/$bid"
  rm -f  "$HOME/Library/HTTPStorages/$bid.binarycookies"
  rm -rf "$HOME/Library/Application Scripts/$bid"
  rm -rf "$HOME/Library/Group Containers/$bid"
  echo "已清理 $bid"
done

# 如需连 iOS 模拟器里的数据一起清，取消下面注释（默认不碰模拟器）
# echo "==> 6. (可选) 清理模拟器中的 fuick app"
# find "$HOME/Library/Developer/CoreSimulator/Devices" -maxdepth 9 \
#   -type d -name "wallet_bundle" 2>/dev/null | sed 's#/Documents/.*##' | sort -u | while read ctr; do
#   rm -rf "$ctr/Library/Preferences" "$ctr/Documents" "$ctr/tmp/com.fuick.app" 2>/dev/null
#   echo "已清理模拟器容器: $ctr"
# done

echo "==> 7. 校验残留"
LEFT=$(find "$HOME/Library" -maxdepth 4 \
  \( -iname "*flutterQuickjs*" -o -path "*com.example.flutterQuickjs*" -o -path "*com.fuick.wallet*" \) \
  2>/dev/null | grep -v "Trae CN\|CatPawAI\|CodeBuddy")
if [ -z "$LEFT" ]; then
  echo "OK: 无残留 fuick 运行时数据"
else
  echo "仍残留:"; echo "$LEFT"
fi

echo "完成。请完全退出 app 后冷启动验证（flutter run 请按 R 重启，勿用 r）。"
