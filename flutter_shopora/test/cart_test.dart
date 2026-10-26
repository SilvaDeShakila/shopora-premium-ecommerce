import 'package:flutter_test/flutter_test.dart';
import 'package:shopora/models/cart_item.dart';
import 'package:shopora/models/product.dart';

void main() {
  group('Cart Calculations & Item Management', () {
    const testProductA = Product(
      id: 1,
      title: 'Fjallraven Backpack',
      price: 109.95,
      description: 'Fits 15 inch laptops',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
      rating: Rating(rate: 3.9, count: 120),
    );

    const testProductB = Product(
      id: 2,
      title: 'Casual T-Shirt',
      price: 22.30,
      description: 'Slim fit',
      category: "men's clothing",
      image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
      rating: Rating(rate: 4.1, count: 259),
    );

    test('CartItem correctly computes subtotal for single quantity', () {
      final item = CartItem(product: testProductA, quantity: 1);
      expect(item.subtotal, closeTo(109.95, 0.001));
    });

    test('CartItem correctly computes subtotal for multiple quantity', () {
      final item = CartItem(product: testProductB, quantity: 3);
      expect(item.subtotal, closeTo(66.90, 0.001));
    });

    test('Quantity update dynamically recalculates line item subtotal', () {
      final item = CartItem(product: testProductB, quantity: 1);
      expect(item.subtotal, closeTo(22.30, 0.001));

      item.quantity = 4;
      expect(item.subtotal, closeTo(89.20, 0.001));
    });

    test('Cart total correctly sums distinct items and quantities', () {
      final items = [
        CartItem(product: testProductA, quantity: 2), // 219.90
        CartItem(product: testProductB, quantity: 3), // 66.90
      ];

      final subtotal = items.fold(0.0, (sum, i) => sum + i.subtotal);
      expect(subtotal, closeTo(286.80, 0.001));

      final totalQuantity = items.fold(0, (sum, i) => sum + i.quantity);
      expect(totalQuantity, equals(5));
    });

    test('Shipping is free over the threshold and applies below it', () {
      double calculateShipping(double subtotal) {
        if (subtotal == 0) return 0.0;
        return subtotal > 75.0 ? 0.0 : 9.99;
      }

      expect(calculateShipping(0.0), equals(0.0));
      expect(calculateShipping(45.0), equals(9.99));
      expect(calculateShipping(75.01), equals(0.0));
      expect(calculateShipping(120.0), equals(0.0));
    });
  });
}
