import 'package:flutter/material.dart';
import 'package:fuickjs_flutter/core/container/fuick_app_view.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return FuickAppView(
      appName: 'bundle',
      initialRoute: '/',
      initialParams: {},
    );
  }
}
