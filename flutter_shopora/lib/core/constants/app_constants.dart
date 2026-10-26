class AppConstants {
  static const String appName = 'Shopora';
  static const String appTagline = 'Curated Modern Living';
  
  // FakeStore API Endpoints
  static const String baseUrl = 'https://fakestoreapi.com';
  static const String productsEndpoint = '$baseUrl/products';
  static const String categoriesEndpoint = '$baseUrl/products/categories';
  static String categoryProductsEndpoint(String category) => 
      '$baseUrl/products/category/${Uri.encodeComponent(category)}';
  static String singleProductEndpoint(int id) => '$baseUrl/products/$id';

  // Local Storage Keys
  static const String cartStorageKey = 'shopora_cart_items_v1';
  static const String wishlistStorageKey = 'shopora_wishlist_ids_v1';
  static const String themeStorageKey = 'shopora_theme_mode_v1';
  static const String ordersStorageKey = 'shopora_orders_history_v1';

  // Animation Durations
  static const Duration fastAnimation = Duration(milliseconds: 200);
  static const Duration normalAnimation = Duration(milliseconds: 350);
}
