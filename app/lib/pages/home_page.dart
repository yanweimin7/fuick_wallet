import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Fuick Web3 Wallet'),
      ),
      body: const FuickAppView(
        appName: 'bundle',
        initialRoute: '/wallet/entry',
        initialParams: {},
      ),
    );
  }
}
