import 'dart:convert';
import 'dart:io';

import 'package:flutter/services.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:fuickjs_flutter/core/service/BaseFuickService.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FuickStorageService extends BaseFuickService {
  final _storage = const FlutterSecureStorage(
    mOptions: MacOsOptions(
      // Explicitly set groupId to null to avoid entitlement check issues
      groupId: null,
      // Use standard accessibility
      accessibility: KeychainAccessibility.first_unlock,
    ),
  );

  bool _useFallback = Platform.isMacOS;

  @override
  String get name => "Storage";

  FuickStorageService() {
    registerAsyncMethod('setItem', (args) async {
      if (args is Map) {
        final key = args['key'];
        final value = args['value'];
        if (key is String && value != null) {
          // Serialize value to string if it's not
          String valueStr;
          if (value is String) {
            valueStr = value;
          } else {
            valueStr = jsonEncode(value);
          }

          if (_useFallback) {
            final prefs = await SharedPreferences.getInstance();
            await prefs.setString(key, valueStr);
            return true;
          }

          try {
            await _storage.write(key: key, value: valueStr);
          } catch (e) {
            if (e is PlatformException && e.code == '-34018') {
              print(
                  "WARNING: Secure Storage failed (-34018). Falling back to SharedPreferences (INSECURE).");
              _useFallback = true;
              final prefs = await SharedPreferences.getInstance();
              await prefs.setString(key, valueStr);
            } else {
              rethrow;
            }
          }
          return true;
        }
      }
      return false;
    });

    registerAsyncMethod('getItem', (args) async {
      if (args is Map) {
        final key = args['key'];
        if (key is String) {
          String? value;

          if (_useFallback) {
            final prefs = await SharedPreferences.getInstance();
            value = prefs.getString(key);
          } else {
            try {
              value = await _storage.read(key: key);
            } catch (e) {
              if (e is PlatformException && e.code == '-34018') {
                print(
                    "WARNING: Secure Storage failed (-34018). Falling back to SharedPreferences (INSECURE).");
                _useFallback = true;
                final prefs = await SharedPreferences.getInstance();
                value = prefs.getString(key);
              } else {
                // Try fallback anyway if read fails? No, only on specific error
                // But if we switched to fallback, we should stick to it.
                // If the error happens on read first?
                // If read fails with -34018, it means we can't access keychain.
                // But we probably didn't write to prefs yet.
                // So returning null is correct, but future writes should use fallback.
                _useFallback = true;
                final prefs = await SharedPreferences.getInstance();
                value = prefs.getString(key);
              }
            }
          }

          if (value != null) {
            try {
              // Try to decode if it looks like JSON
              return jsonDecode(value);
            } catch (e) {
              return value;
            }
          }
        }
      }
      return null;
    });

    registerAsyncMethod('removeItem', (args) async {
      if (args is Map) {
        final key = args['key'];
        if (key is String) {
          if (_useFallback) {
            final prefs = await SharedPreferences.getInstance();
            await prefs.remove(key);
            return true;
          }

          try {
            await _storage.delete(key: key);
          } catch (e) {
            if (e is PlatformException && e.code == '-34018') {
              _useFallback = true;
              final prefs = await SharedPreferences.getInstance();
              await prefs.remove(key);
            } else {
              rethrow;
            }
          }
          return true;
        }
      }
      return false;
    });

    registerAsyncMethod('hasItem', (args) async {
      if (args is Map) {
        final key = args['key'];
        if (key is String) {
          if (_useFallback) {
            final prefs = await SharedPreferences.getInstance();
            return prefs.containsKey(key);
          }
          try {
            final value = await _storage.read(key: key);
            return value != null;
          } catch (e) {
            if (e is PlatformException && e.code == '-34018') {
              _useFallback = true;
              final prefs = await SharedPreferences.getInstance();
              return prefs.containsKey(key);
            }
            return false;
          }
        }
      }
      return false;
    });
  }
}
