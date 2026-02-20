import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/engine/fuick_app_context_manager.dart';
import 'package:fuick_wallet/pages/home_page.dart';
import 'package:fuick_wallet/service/fuick_wallet_service.dart';
import 'package:fuick_wallet/service/fuick_storage_service.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    _initApp();
  }

  Future<void> _initApp() async {
    // 获取 AppContext
    final appContext = FuickAppContextManager().getContext('bundle');

    // 最小展示时间 500ms
    final minDisplayTime = Future.delayed(const Duration(milliseconds: 500));

    bool hasWallet = false;
    try {
      if (appContext != null) {
        // 等待 JS 初始化完成
        await appContext.init();

        // 初始化完成后检查钱包状态
        hasWallet = await _checkHasWallet();
      }
    } catch (e) {
      debugPrint('App initialization failed: $e');
      // 即使失败也尝试进入主页，或者显示错误页
    }

    // 确保最小展示时间
    await minDisplayTime;

    if (!mounted) return;

    // 跳转到主页，并根据是否有钱包决定路由
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) =>
            HomePage(initialRoute: hasWallet ? '/' : '/wallet/onboarding'),
      ),
    );
  }

  Future<bool> _checkHasWallet() async {
    final appContext = FuickAppContextManager().getContext('bundle');
    if (appContext != null && appContext.isReady.value) {
      try {
        // 等待 JS init 完成
        // 由于 JS 端的 initApp 是异步的，可能在 bundle 加载完成后还在执行
        // 我们通过轮询 globalThis.isAppReady 标志位来确保初始化完成
        int retry = 0;
        while (retry < 20) {
          final isReady = await appContext.ctx.eval('globalThis.isAppReady');
          if (isReady == true) break;
          await Future.delayed(const Duration(milliseconds: 100));
          retry++;
        }

        // 等待 JS init 完成后，读取全局变量
        final result = await appContext.ctx.eval('globalThis.hasWallet');
        return result == true;
      } catch (e) {
        debugPrint('Failed to check wallet status from JS: $e');
      }
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // 这里可以放 Logo
            const Icon(
              Icons.account_balance_wallet,
              size: 80,
              color: Colors.blue,
            ),
            const SizedBox(height: 24),
            const Text(
              'Fuick Wallet',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.blue,
              ),
            ),
            const SizedBox(height: 48),
            const CircularProgressIndicator(),
            const SizedBox(height: 16),
            const Text(
              'Initializing...',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
