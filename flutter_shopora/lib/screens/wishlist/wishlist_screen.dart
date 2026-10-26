import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/product_provider.dart';
import '../../providers/wishlist_provider.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/product_card.dart';

class WishlistScreen extends StatelessWidget {
  final VoidCallback onExplore;

  const WishlistScreen({super.key, required this.onExplore});

  @override
  Widget build(BuildContext context) {
    final wishlistProvider = context.watch<WishlistProvider>();
    final productProvider = context.watch<ProductProvider>();
    final favoriteProducts = wishlistProvider.getFavoriteProducts(productProvider.allProducts);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Wishlist', style: TextStyle(fontWeight: FontWeight.w700)),
        actions: [
          if (favoriteProducts.isNotEmpty)
            TextButton(
              onPressed: () => wishlistProvider.clearWishlist(),
              child: const Text('Clear All'),
            ),
          const SizedBox(width: 8),
        ],
      ),
      body: favoriteProducts.isEmpty
          ? EmptyStateWidget(
              icon: Icons.favorite_border_rounded,
              title: 'Your Wishlist is Empty',
              message: 'Save items you love by tapping the heart icon on any product card.',
              buttonText: 'Discover Products',
              onAction: onExplore,
            )
          : GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.65,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: favoriteProducts.length,
              itemBuilder: (context, index) {
                return ProductCard(product: favoriteProducts[index]);
              },
            ),
    );
  }
}
