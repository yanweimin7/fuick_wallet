import 'package:flutter/material.dart';
import 'package:fuick_wallet/pages/splash_page.dart';
import 'package:fuick_wallet/service/fuick_storage_service.dart';
import 'package:fuick_wallet/service/fuick_wallet_service.dart';
import 'package:fuick_wallet/service/local_auth_service.dart';
import 'package:fuickjs_flutter/core/engine/fuick_app_context.dart';
import 'package:fuickjs_flutter/core/engine/fuick_app_context_manager.dart';
import 'package:fuickjs_flutter/core/service/native_services.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // 1. 先注册所有 Native 服务，确保 JS 运行时能找到它们
  NativeServiceManager().registerService(() => FuickWalletService());
  NativeServiceManager().registerService(() => FuickStorageService());
  NativeServiceManager().registerService(() => LocalAuthService());

  // 2. 然后再初始化 FuickAppContext
  final appContext = FuickAppContext(appName: 'bundle');
  FuickAppContextManager().registerContext('bundle', appContext);
  appContext.init(); // 不使用 await，让其并行执行

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const SplashPage(),
    );
  }
}
