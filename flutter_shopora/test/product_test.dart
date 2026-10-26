import 'package:flutter_test/flutter_test.dart';
import 'package:shopora/models/product.dart';

void main() {
  group('Product JSON Parsing and Resilience', () {
    test('Parses valid FakeStore API JSON accurately', () {
      final sampleJson = {
        'id': 10,
        'title': 'SanDisk SSD PLUS 1TB Internal SSD',
        'price': 109,
        'description': 'Easy upgrade for faster boot up',
        'category': 'electronics',
        'image': 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
        'rating': {'rate': 2.9, 'count': 470}
      };

      final product = Product.fromJson(sampleJson);

      expect(product.id, equals(10));
      expect(product.title, equals('SanDisk SSD PLUS 1TB Internal SSD'));
      expect(product.price, equals(109.0));
      expect(product.category, equals('electronics'));
      expect(product.rating.rate, equals(2.9));
      expect(product.rating.count, equals(470));
    });

    test('Safely handles missing or null fields without throwing exceptions', () {
      final incompleteJson = {
        'id': 99,
        'title': null,
        'price': null,
        'description': null,
        'category': null,
        'image': null,
        'rating': null,
      };

      final product = Product.fromJson(incompleteJson);

      expect(product.id, equals(99));
      expect(product.title, equals('Untitled Product'));
      expect(product.price, equals(0.0));
      expect(product.category, equals('general'));
      expect(product.rating.rate, equals(0.0));
      expect(product.rating.count, equals(0));
    });

    test('toJson and fromJson cycle retains data integrity', () {
      const original = Product(
        id: 5,
        title: 'Silver Dragon Bracelet',
        price: 695.0,
        description: 'From our Legends Collection',
        category: 'jewelery',
        image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
        rating: Rating(rate: 4.6, count: 400),
      );

      final jsonMap = original.toJson();
      final reconstructed = Product.fromJson(jsonMap);

      expect(reconstructed.id, equals(original.id));
      expect(reconstructed.price, equals(original.price));
      expect(reconstructed.rating.rate, equals(original.rating.rate));
    });
  });
}
