import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/local_storage_service.dart';

class WishlistProvider with ChangeNotifier {
  final Set<int> _favoriteIds = {};
  bool _isInitialized = false;

  WishlistProvider() {
    _initFromStorage();
  }

  Set<int> get favoriteIds => Set.unmodifiable(_favoriteIds);

  int get count => _favoriteIds.length;

  bool isFavorite(int productId) => _favoriteIds.contains(productId);

  Future<void> _initFromStorage() async {
    if (_isInitialized) return;
    final ids = await LocalStorageService.loadWishlistIds();
    _favoriteIds.clear();
    _favoriteIds.addAll(ids);
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> toggleFavorite(Product product) async {
    if (_favoriteIds.contains(product.id)) {
      _favoriteIds.remove(product.id);
    } else {
      _favoriteIds.add(product.id);
    }
    notifyListeners();
    await LocalStorageService.saveWishlistIds(_favoriteIds);
  }

  Future<void> removeFavorite(int productId) async {
    if (_favoriteIds.contains(productId)) {
      _favoriteIds.remove(productId);
      notifyListeners();
      await LocalStorageService.saveWishlistIds(_favoriteIds);
    }
  }

  Future<void> clearWishlist() async {
    _favoriteIds.clear();
    notifyListeners();
    await LocalStorageService.saveWishlistIds(_favoriteIds);
  }

  List<Product> getFavoriteProducts(List<Product> allProducts) {
    return allProducts.where((p) => _favoriteIds.contains(p.id)).toList();
  }
}
