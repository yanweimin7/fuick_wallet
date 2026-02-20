import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/engine/fuick_app_context_manager.dart';
import 'package:fuick_wallet/pages/home_page.dart';

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

    final initFuture =
        (appContext != null) ? appContext.init() : Future.value();

    try {
      // 等待初始化和最小展示时间同时完成
      await Future.wait([initFuture, minDisplayTime]);
    } catch (e) {
      debugPrint('App initialization failed: $e');
      // 即使失败也尝试进入主页，或者显示错误页
    }

    if (!mounted) return;

    // 跳转到主页
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const HomePage()),
    );
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
