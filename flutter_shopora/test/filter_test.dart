import 'package:flutter_test/flutter_test.dart';
import 'package:shopora/models/product.dart';

void main() {
  group('Catalog Search, Category Filtering, and Sorting Logic', () {
    final sampleCatalog = [
      const Product(
        id: 1,
        title: 'Mens Casual Premium Slim Fit T-Shirts',
        price: 22.3,
        description: 'Casual comfort slim fit',
        category: "men's clothing",
        image: '',
        rating: Rating(rate: 4.1, count: 259),
      ),
      const Product(
        id: 2,
        title: 'John Hardy Women Legends Naga Gold & Silver Dragon',
        price: 695.0,
        description: 'Luxury handcrafted jewelry inspired by nature',
        category: 'jewelery',
        image: '',
        rating: Rating(rate: 4.6, count: 400),
      ),
      const Product(
        id: 3,
        title: 'WD 2TB Elements Portable External Hard Drive',
        price: 64.0,
        description: 'Fast data transfers with USB 3.0',
        category: 'electronics',
        image: '',
        rating: Rating(rate: 3.3, count: 203),
      ),
      const Product(
        id: 4,
        title: 'DANVOUY Womens T Shirt Casual Cotton',
        price: 12.99,
        description: 'Short sleeve casual lightweight fabric',
        category: "women's clothing",
        image: '',
        rating: Rating(rate: 3.6, count: 145),
      ),
    ];

    test('Case-insensitive search in title and description', () {
      const query = 'casual';
      final matches = sampleCatalog.where((p) {
        return p.title.toLowerCase().contains(query) ||
            p.description.toLowerCase().contains(query);
      }).toList();

      expect(matches.length, equals(2));
      expect(matches.map((p) => p.id), containsAll([1, 4]));
    });

    test('Filter by specific category', () {
      final filtered = sampleCatalog.where((p) => p.category == 'electronics').toList();
      expect(filtered.length, equals(1));
      expect(filtered.first.id, equals(3));
    });

    test('Filter by price range boundaries', () {
      const min = 20.0;
      const max = 100.0;
      final inRange = sampleCatalog.where((p) => p.price >= min && p.price <= max).toList();

      expect(inRange.length, equals(2));
      expect(inRange.map((p) => p.id), containsAll([1, 3]));
    });

    test('Sorting by Price ascending (low to high)', () {
      final sorted = List<Product>.from(sampleCatalog)
        ..sort((a, b) => a.price.compareTo(b.price));

      expect(sorted.first.id, equals(4)); // 12.99
      expect(sorted.last.id, equals(2)); // 695.0
    });

    test('Sorting by Price descending (high to low)', () {
      final sorted = List<Product>.from(sampleCatalog)
        ..sort((a, b) => b.price.compareTo(a.price));

      expect(sorted.first.id, equals(2)); // 695.0
      expect(sorted.last.id, equals(4)); // 12.99
    });

    test('Sorting by Rating descending (highest first)', () {
      final sorted = List<Product>.from(sampleCatalog)
        ..sort((a, b) => b.rating.rate.compareTo(a.rating.rate));

      expect(sorted.first.id, equals(2)); // 4.6
      expect(sorted.last.id, equals(3)); // 3.3
    });
  });
}
