import 'package:flutter/material.dart';
import 'package:fuick_wallet/pages/home_page.dart';
import 'package:fuick_wallet/service/fuick_storage_service.dart';
import 'package:fuick_wallet/service/fuick_wallet_service.dart';
import 'package:fuick_wallet/service/local_auth_service.dart';
import 'package:fuickjs_flutter/core/engine/engine.dart';
import 'package:fuickjs_flutter/core/service/native_services.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Fuick Engine
  EngineInit.initIsolate();

  // Register Wallet Service
  NativeServiceManager().registerService(() => FuickWalletService());
  NativeServiceManager().registerService(() => FuickStorageService());
  NativeServiceManager().registerService(() => LocalAuthService());

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
      home: const HomePage(),
    );
  }
}
