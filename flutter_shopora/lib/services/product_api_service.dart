import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../core/constants/app_constants.dart';
import '../models/product.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  ApiException(this.message, [this.statusCode]);

  @override
  String toString() => message;
}

class ProductApiService {
  final http.Client _client;

  // In-memory caching to avoid unnecessary requests
  List<Product>? _cachedProducts;
  List<String>? _cachedCategories;
  final Map<String, List<Product>> _cachedCategoryProducts = {};
  final Map<int, Product> _cachedSingleProducts = {};

  ProductApiService({http.Client? client}) : _client = client ?? http.Client();

  /// Fetches all products from FakeStore API
  Future<List<Product>> fetchAllProducts({bool forceRefresh = false}) async {
    if (!forceRefresh && _cachedProducts != null && _cachedProducts!.isNotEmpty) {
      return _cachedProducts!;
    }

    try {
      final response = await _client
          .get(Uri.parse(AppConstants.productsEndpoint))
          .timeout(const Duration(seconds: 12));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final products = data.map((item) => Product.fromJson(item as Map<String, dynamic>)).toList();
        _cachedProducts = products;
        return products;
      } else {
        throw ApiException(
          'Failed to load products from server (${response.statusCode})',
          response.statusCode,
        );
      }
    } on SocketException {
      throw ApiException('Unable to connect. Please check your internet connection.');
    } on TimeoutException {
      throw ApiException('Connection timed out. The server took too long to respond.');
    } on FormatException {
      throw ApiException('Received malformed data from the server.');
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('An unexpected network error occurred: ${e.toString()}');
    }
  }

  /// Fetches all product categories
  Future<List<String>> fetchCategories({bool forceRefresh = false}) async {
    if (!forceRefresh && _cachedCategories != null && _cachedCategories!.isNotEmpty) {
      return _cachedCategories!;
    }

    try {
      final response = await _client
          .get(Uri.parse(AppConstants.categoriesEndpoint))
          .timeout(const Duration(seconds: 12));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final categories = data.map((item) => item.toString()).toList();
        _cachedCategories = categories;
        return categories;
      } else {
        throw ApiException('Failed to load categories (${response.statusCode})');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Could not retrieve product categories.');
    }
  }

  /// Fetches products in a specific category
  Future<List<Product>> fetchProductsByCategory(String category, {bool forceRefresh = false}) async {
    if (!forceRefresh && _cachedCategoryProducts.containsKey(category)) {
      return _cachedCategoryProducts[category]!;
    }

    try {
      final response = await _client
          .get(Uri.parse(AppConstants.categoryProductsEndpoint(category)))
          .timeout(const Duration(seconds: 12));

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final products = data.map((item) => Product.fromJson(item as Map<String, dynamic>)).toList();
        _cachedCategoryProducts[category] = products;
        return products;
      } else {
        throw ApiException('Failed to load category products (${response.statusCode})');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Could not retrieve products for "$category".');
    }
  }

  /// Fetches single product by ID
  Future<Product> fetchProductById(int id) async {
    if (_cachedSingleProducts.containsKey(id)) {
      return _cachedSingleProducts[id]!;
    }

    try {
      final response = await _client
          .get(Uri.parse(AppConstants.singleProductEndpoint(id)))
          .timeout(const Duration(seconds: 12));

      if (response.statusCode == 200) {
        final product = Product.fromJson(json.decode(response.body) as Map<String, dynamic>);
        _cachedSingleProducts[id] = product;
        return product;
      } else {
        throw ApiException('Failed to load product details (${response.statusCode})');
      }
    } catch (e) {
      if (e is ApiException) rethrow;
      throw ApiException('Could not load details for product #$id.');
    }
  }

  /// Clears in-memory cache
  void clearCache() {
    _cachedProducts = null;
    _cachedCategories = null;
    _cachedCategoryProducts.clear();
    _cachedSingleProducts.clear();
  }
}
