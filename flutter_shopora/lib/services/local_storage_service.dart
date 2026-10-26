import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants/app_constants.dart';
import '../models/cart_item.dart';
import '../models/order.dart';

class LocalStorageService {
  /// Save Cart items to SharedPreferences
  static Future<void> saveCart(List<CartItem> items) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final jsonList = items.map((e) => e.toJson()).toList();
      await prefs.setString(AppConstants.cartStorageKey, json.encode(jsonList));
    } catch (_) {}
  }

  /// Load Cart items from SharedPreferences
  static Future<List<CartItem>> loadCart() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(AppConstants.cartStorageKey);
      if (raw == null || raw.isEmpty) return [];
      final List<dynamic> jsonList = json.decode(raw);
      return jsonList.map((e) => CartItem.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  /// Save Wishlist Product IDs
  static Future<void> saveWishlistIds(Set<int> ids) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final strList = ids.map((id) => id.toString()).toList();
      await prefs.setStringList(AppConstants.wishlistStorageKey, strList);
    } catch (_) {}
  }

  /// Load Wishlist Product IDs
  static Future<Set<int>> loadWishlistIds() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList(AppConstants.wishlistStorageKey);
      if (list == null) return {};
      return list.map((e) => int.tryParse(e) ?? 0).where((id) => id != 0).toSet();
    } catch (_) {
      return {};
    }
  }

  /// Save Completed Orders
  static Future<void> saveOrder(OrderModel order) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final currentOrders = await loadOrders();
      currentOrders.insert(0, order);
      final jsonList = currentOrders.map((o) => o.toJson()).toList();
      await prefs.setString(AppConstants.ordersStorageKey, json.encode(jsonList));
    } catch (_) {}
  }

  /// Load Orders History
  static Future<List<OrderModel>> loadOrders() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(AppConstants.ordersStorageKey);
      if (raw == null || raw.isEmpty) return [];
      final List<dynamic> list = json.decode(raw);
      return list.map((e) => OrderModel.fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }
}
