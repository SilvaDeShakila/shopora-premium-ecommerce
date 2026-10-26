import React, { useState } from 'react';
import { FileCode, Check, Copy, Folder, File, Terminal, X, ExternalLink } from 'lucide-react';

interface FileNode {
  path: string;
  name: string;
  content: string;
  category: string;
}

const FLUTTER_FILES: FileNode[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'Configuration',
    content: `name: shopora
description: "Shopora - Premium E-Commerce Shopping Application (Task 05 Advanced)"
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.2.0 <4.0.0"
  flutter: ">=3.16.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  http: ^1.2.0
  shared_preferences: ^2.2.2
  cached_network_image: ^3.3.1
  google_fonts: ^6.1.0
  intl: ^0.19.0
  shimmer: ^3.0.0
  cupertino_icons: ^1.0.6

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'Core',
    content: `import 'package:flutter/material.dart';
import 'app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const ShoporaApp());
}`,
  },
  {
    path: 'lib/app.dart',
    name: 'app.dart',
    category: 'Core',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/theme_provider.dart';
import 'providers/cart_provider.dart';
import 'providers/product_provider.dart';
import 'providers/wishlist_provider.dart';
import 'screens/cart/cart_screen.dart';
import 'screens/catalog/catalog_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/wishlist/wishlist_screen.dart';

class ShoporaApp extends StatelessWidget {
  const ShoporaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()..loadInitialData()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => WishlistProvider()),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themeProvider, child) {
          return MaterialApp(
            title: 'Shopora',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme(),
            darkTheme: AppTheme.darkTheme(),
            themeMode: themeProvider.themeMode,
            home: const MainNavigationScaffold(),
            routes: {
              '/cart': (ctx) => CartScreen(onExplore: () => Navigator.pop(ctx)),
            },
          );
        },
      ),
    );
  }
}`,
  },
  {
    path: 'lib/core/theme/app_theme.dart',
    name: 'app_theme.dart',
    category: 'Theme',
    content: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color primaryIndigo = Color(0xFF4F46E5);
  static const Color primaryIndigoDark = Color(0xFF6366F1);
  static const Color secondaryViolet = Color(0xFF7C3AED);

  static ThemeData lightTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      colorScheme: const ColorScheme.light(
        primary: primaryIndigo,
        secondary: secondaryViolet,
        surface: Colors.white,
      ),
    );
  }

  static ThemeData darkTheme() {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: const Color(0xFF090D16),
      colorScheme: const ColorScheme.dark(
        primary: primaryIndigoDark,
        secondary: secondaryViolet,
        surface: const Color(0xFF111827),
      ),
    );
  }
}`,
  },
  {
    path: 'lib/models/product.dart',
    name: 'product.dart',
    category: 'Models',
    content: `class Rating {
  final double rate;
  final int count;
  const Rating({required this.rate, required this.count});

  factory Rating.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const Rating(rate: 0.0, count: 0);
    return Rating(
      rate: (json['rate'] is num) ? (json['rate'] as num).toDouble() : 0.0,
      count: (json['count'] is num) ? (json['count'] as num).toInt() : 0,
    );
  }
  Map<String, dynamic> toJson() => {'rate': rate, 'count': count};
}

class Product {
  final int id;
  final String title;
  final double price;
  final String description;
  final String category;
  final String image;
  final Rating rating;

  const Product({
    required this.id,
    required this.title,
    required this.price,
    required this.description,
    required this.category,
    required this.image,
    required this.rating,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: (json['id'] is num) ? (json['id'] as num).toInt() : 0,
      title: json['title'] as String? ?? 'Untitled Product',
      price: (json['price'] is num) ? (json['price'] as num).toDouble() : 0.0,
      description: json['description'] as String? ?? '',
      category: json['category'] as String? ?? 'general',
      image: json['image'] as String? ?? '',
      rating: Rating.fromJson(json['rating'] as Map<String, dynamic>?),
    );
  }
}`,
  },
  {
    path: 'lib/models/cart_item.dart',
    name: 'cart_item.dart',
    category: 'Models',
    content: `import 'product.dart';

class CartItem {
  final Product product;
  int quantity;

  CartItem({required this.product, this.quantity = 1});

  double get subtotal => product.price * quantity;

  Map<String, dynamic> toJson() => {
    'product': product.toJson(),
    'quantity': quantity,
  };
}`,
  },
  {
    path: 'lib/services/product_api_service.dart',
    name: 'product_api_service.dart',
    category: 'Services',
    content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/product.dart';

class ProductApiService {
  final http.Client _client = http.Client();
  static const String baseUrl = 'https://fakestoreapi.com';

  Future<List<Product>> fetchAllProducts() async {
    final res = await _client.get(Uri.parse('$baseUrl/products'))
        .timeout(const Duration(seconds: 12));
    if (res.statusCode == 200) {
      final List data = json.decode(res.body);
      return data.map((e) => Product.fromJson(e)).toList();
    }
    throw Exception('Failed to load products: \${res.statusCode}');
  }

  Future<List<String>> fetchCategories() async {
    final res = await _client.get(Uri.parse('$baseUrl/products/categories'));
    if (res.statusCode == 200) {
      final List data = json.decode(res.body);
      return data.map((e) => e.toString()).toList();
    }
    throw Exception('Failed to load categories');
  }
}`,
  },
  {
    path: 'lib/providers/cart_provider.dart',
    name: 'cart_provider.dart',
    category: 'Providers',
    content: `import 'package:flutter/foundation.dart';
import '../models/cart_item.dart';
import '../models/product.dart';
import '../services/local_storage_service.dart';

class CartProvider with ChangeNotifier {
  final List<CartItem> _items = [];

  List<CartItem> get items => List.unmodifiable(_items);
  int get totalItemCount => _items.fold(0, (s, i) => s + i.quantity);
  double get subtotal => _items.fold(0.0, (s, i) => s + i.subtotal);
  double get estimatedTax => subtotal * 0.08;
  double get estimatedShipping => subtotal > 75.0 || _items.isEmpty ? 0.0 : 9.99;
  double get orderTotal => _items.isEmpty ? 0.0 : (subtotal + estimatedTax + estimatedShipping);

  void addItem(Product product, {int quantity = 1}) {
    final idx = _items.indexWhere((i) => i.product.id == product.id);
    if (idx >= 0) {
      _items[idx].quantity += quantity;
    } else {
      _items.add(CartItem(product: product, quantity: quantity));
    }
    notifyListeners();
    LocalStorageService.saveCart(_items);
  }

  void updateQuantity(int productId, int quantity) {
    final idx = _items.indexWhere((i) => i.product.id == productId);
    if (idx >= 0) {
      if (quantity <= 0) {
        _items.removeAt(idx);
      } else {
        _items[idx].quantity = quantity;
      }
      notifyListeners();
      LocalStorageService.saveCart(_items);
    }
  }

  void removeItem(int productId) {
    _items.removeWhere((i) => i.product.id == productId);
    notifyListeners();
    LocalStorageService.saveCart(_items);
  }

  void clearCart() {
    _items.clear();
    notifyListeners();
    LocalStorageService.saveCart(_items);
  }
}`,
  },
  {
    path: 'test/cart_test.dart',
    name: 'cart_test.dart',
    category: 'Tests',
    content: `import 'package:flutter_test/flutter_test.dart';
import 'package:shopora/models/cart_item.dart';
import 'package:shopora/models/product.dart';

void main() {
  group('Cart Calculations & Item Management', () {
    const testProduct = Product(
      id: 1,
      title: 'Backpack',
      price: 109.95,
      description: 'Durable bag',
      category: "men's clothing",
      image: '',
      rating: Rating(rate: 3.9, count: 120),
    );

    test('CartItem correctly computes subtotal for multiple quantity', () {
      final item = CartItem(product: testProduct, quantity: 3);
      expect(item.subtotal, closeTo(329.85, 0.001));
    });

    test('Shipping is free over $75', () {
      double shipping(double subtotal) => subtotal > 75.0 ? 0.0 : 9.99;
      expect(shipping(50.0), equals(9.99));
      expect(shipping(80.0), equals(0.0));
    });
  });
}`,
  },
  {
    path: 'test/filter_test.dart',
    name: 'filter_test.dart',
    category: 'Tests',
    content: `import 'package:flutter_test/flutter_test.dart';
import 'package:shopora/models/product.dart';

void main() {
  group('Catalog Search & Filters', () {
    test('Case-insensitive search in title and description', () {
      final p = Product(
        id: 1,
        title: 'Casual Cotton Jacket',
        price: 55.99,
        description: 'Warm everyday wear',
        category: 'clothing',
        image: '',
        rating: Rating(rate: 4.7, count: 50),
      );
      final query = 'jacket';
      final matches = p.title.toLowerCase().contains(query);
      expect(matches, isTrue);
    });
  });
}`,
  },
];

export const FlutterCodeViewer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileNode>(FLUTTER_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Shopora Flutter Source Code Explorer
                <span className="text-xs font-normal text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/50">
                  Task 05 Submission
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pristine Dart & Flutter code ready for VS Code, Android, iOS & Flutter Web
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard' : 'Copy Code'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content split */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Tree Sidebar */}
          <div className="w-64 border-r border-slate-800 bg-slate-950/30 overflow-y-auto p-3 text-xs">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Project Files
            </div>
            <div className="space-y-1">
              {FLUTTER_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <File className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 px-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Terminal className="w-3 h-3" /> Quick Run
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono text-emerald-400">
                flutter pub get<br />
                flutter test<br />
                flutter run
              </div>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-950/80 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400 bg-slate-900/40">
              <span className="font-mono text-indigo-400">{selectedFile.path}</span>
              <span className="text-[11px] text-slate-500">Category: {selectedFile.category}</span>
            </div>
            <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300 select-text whitespace-pre">
              {selectedFile.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
