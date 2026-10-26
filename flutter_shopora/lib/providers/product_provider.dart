import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../repositories/product_repository.dart';

enum ProductSortOption {
  featured,
  priceLowHigh,
  priceHighLow,
  alphabetical,
  rating,
}

class ProductProvider with ChangeNotifier {
  final ProductRepository _repository;

  bool _isLoading = false;
  String? _errorMessage;
  List<Product> _allProducts = [];
  List<String> _categories = [];
  
  // Filter & Search states
  String _searchQuery = '';
  String? _selectedCategory;
  double _minPrice = 0;
  double _maxPrice = 1000;
  double _currentMinPrice = 0;
  double _currentMaxPrice = 1000;
  ProductSortOption _sortOption = ProductSortOption.featured;

  ProductProvider({ProductRepository? repository})
      : _repository = repository ?? ProductRepository();

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  List<Product> get allProducts => _allProducts;
  List<String> get categories => _categories;
  String get searchQuery => _searchQuery;
  String? get selectedCategory => _selectedCategory;
  double get minPrice => _minPrice;
  double get maxPrice => _maxPrice;
  double get currentMinPrice => _currentMinPrice;
  double get currentMaxPrice => _currentMaxPrice;
  ProductSortOption get sortOption => _sortOption;

  bool get hasActiveFilters =>
      _searchQuery.isNotEmpty ||
      _selectedCategory != null ||
      _currentMinPrice > _minPrice ||
      _currentMaxPrice < _maxPrice ||
      _sortOption != ProductSortOption.featured;

  /// Returns filtered and sorted products
  List<Product> get filteredProducts {
    List<Product> list = List.from(_allProducts);

    // 1. Search filter (case-insensitive in title and description)
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      list = list.where((p) {
        return p.title.toLowerCase().contains(q) ||
            p.description.toLowerCase().contains(q);
      }).toList();
    }

    // 2. Category filter
    if (_selectedCategory != null && _selectedCategory!.isNotEmpty) {
      list = list.where((p) => p.category.toLowerCase() == _selectedCategory!.toLowerCase()).toList();
    }

    // 3. Price range filter
    list = list.where((p) => p.price >= _currentMinPrice && p.price <= _currentMaxPrice).toList();

    // 4. Sorting
    switch (_sortOption) {
      case ProductSortOption.priceLowHigh:
        list.sort((a, b) => a.price.compareTo(b.price));
        break;
      case ProductSortOption.priceHighLow:
        list.sort((a, b) => b.price.compareTo(a.price));
        break;
      case ProductSortOption.alphabetical:
        list.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
        break;
      case ProductSortOption.rating:
        list.sort((a, b) => b.rating.rate.compareTo(a.rating.rate));
        break;
      case ProductSortOption.featured:
      default:
        // Keep original API sequence
        break;
    }

    return list;
  }

  /// Initial fetch of products and categories
  Future<void> loadInitialData({bool forceRefresh = false}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final results = await Future.wait([
        _repository.getProducts(forceRefresh: forceRefresh),
        _repository.getCategories(forceRefresh: forceRefresh),
      ]);

      _allProducts = results[0] as List<Product>;
      _categories = results[1] as List<String>;

      // Determine price bounds dynamically from actual products
      if (_allProducts.isNotEmpty) {
        double min = _allProducts.first.price;
        double max = _allProducts.first.price;
        for (var p in _allProducts) {
          if (p.price < min) min = p.price;
          if (p.price > max) max = p.price;
        }
        _minPrice = (min * 10).floor() / 10;
        _maxPrice = (max * 10).ceil() / 10;
        if (_currentMaxPrice == 1000 || _currentMaxPrice > _maxPrice) {
          _currentMinPrice = _minPrice;
          _currentMaxPrice = _maxPrice;
        }
      }

      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _isLoading = false;
      _errorMessage = e.toString();
      notifyListeners();
    }
  }

  void setSearchQuery(String query) {
    if (_searchQuery == query) return;
    _searchQuery = query;
    notifyListeners();
  }

  void selectCategory(String? category) {
    if (_selectedCategory == category) {
      _selectedCategory = null; // Toggle off if already selected
    } else {
      _selectedCategory = category;
    }
    notifyListeners();
  }

  void setPriceRange(double min, double max) {
    _currentMinPrice = min;
    _currentMaxPrice = max;
    notifyListeners();
  }

  void setSortOption(ProductSortOption option) {
    _sortOption = option;
    notifyListeners();
  }

  void clearAllFilters() {
    _searchQuery = '';
    _selectedCategory = null;
    _currentMinPrice = _minPrice;
    _currentMaxPrice = _maxPrice;
    _sortOption = ProductSortOption.featured;
    notifyListeners();
  }

  List<Product> getRelatedProducts(Product current, {int limit = 4}) {
    return _allProducts
        .where((p) => p.category == current.category && p.id != current.id)
        .take(limit)
        .toList();
  }
}
