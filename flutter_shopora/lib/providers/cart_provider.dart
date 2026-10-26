import 'dart:math';
import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../models/order.dart';
import '../models/product.dart';
import '../services/local_storage_service.dart';

class CartProvider with ChangeNotifier {
  final List<CartItem> _items = [];
  bool _isInitialized = false;

  CartProvider() {
    _initFromStorage();
  }

  List<CartItem> get items => List.unmodifiable(_items);

  bool get isEmpty => _items.isEmpty;

  int get totalItemCount => _items.fold(0, (sum, item) => sum + item.quantity);

  double get subtotal => _items.fold(0.0, (sum, item) => sum + item.subtotal);

  double get estimatedTax => subtotal * 0.08; // 8% estimated sales tax

  double get estimatedShipping => subtotal > 75.0 || isEmpty ? 0.0 : 9.99; // Free shipping over $75

  double get orderTotal => isEmpty ? 0.0 : (subtotal + estimatedTax + estimatedShipping);

  bool isInCart(int productId) {
    return _items.any((item) => item.product.id == productId);
  }

  int getItemQuantity(int productId) {
    final index = _items.indexWhere((item) => item.product.id == productId);
    return index != -1 ? _items[index].quantity : 0;
  }

  Future<void> _initFromStorage() async {
    if (_isInitialized) return;
    final loaded = await LocalStorageService.loadCart();
    _items.clear();
    _items.addAll(loaded);
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> addItem(Product product, {int quantity = 1}) async {
    final existingIndex = _items.indexWhere((item) => item.product.id == product.id);

    if (existingIndex >= 0) {
      _items[existingIndex].quantity += quantity;
    } else {
      _items.add(CartItem(product: product, quantity: quantity));
    }

    notifyListeners();
    await _persist();
  }

  Future<void> updateQuantity(int productId, int quantity) async {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      if (quantity <= 0) {
        _items.removeAt(index);
      } else {
        _items[index].quantity = quantity;
      }
      notifyListeners();
      await _persist();
    }
  }

  Future<void> incrementQuantity(int productId) async {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      _items[index].quantity += 1;
      notifyListeners();
      await _persist();
    }
  }

  Future<void> decrementQuantity(int productId) async {
    final index = _items.indexWhere((item) => item.product.id == productId);
    if (index >= 0) {
      if (_items[index].quantity > 1) {
        _items[index].quantity -= 1;
      } else {
        _items.removeAt(index);
      }
      notifyListeners();
      await _persist();
    }
  }

  Future<void> removeItem(int productId) async {
    _items.removeWhere((item) => item.product.id == productId);
    notifyListeners();
    await _persist();
  }

  Future<void> clearCart() async {
    _items.clear();
    notifyListeners();
    await _persist();
  }

  Future<void> _persist() async {
    await LocalStorageService.saveCart(_items);
  }

  /// Completes simulated checkout with simulated order confirmation
  Future<OrderModel> placeSimulatedOrder({
    required String customerName,
    required String customerEmail,
    required String customerPhone,
    required String deliveryAddress,
  }) async {
    final randomSuffix = Random().nextInt(89999) + 10000;
    final orderId = 'SHP-2026-$randomSuffix';

    final order = OrderModel(
      orderId: orderId,
      orderDate: DateTime.now(),
      items: List.from(_items),
      totalAmount: orderTotal,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      deliveryAddress: deliveryAddress,
    );

    // Save order history
    await LocalStorageService.saveOrder(order);

    // Clear cart after successful checkout demo
    await clearCart();

    return order;
  }
}
