import '../models/product.dart';
import '../services/product_api_service.dart';

class ProductRepository {
  final ProductApiService _apiService;

  ProductRepository({ProductApiService? apiService})
      : _apiService = apiService ?? ProductApiService();

  Future<List<Product>> getProducts({bool forceRefresh = false}) {
    return _apiService.fetchAllProducts(forceRefresh: forceRefresh);
  }

  Future<List<String>> getCategories({bool forceRefresh = false}) {
    return _apiService.fetchCategories(forceRefresh: forceRefresh);
  }

  Future<List<Product>> getProductsByCategory(String category, {bool forceRefresh = false}) {
    return _apiService.fetchProductsByCategory(category, forceRefresh: forceRefresh);
  }

  Future<Product> getProductById(int id) {
    return _apiService.fetchProductById(id);
  }

  void clearCache() {
    _apiService.clearCache();
  }
}
